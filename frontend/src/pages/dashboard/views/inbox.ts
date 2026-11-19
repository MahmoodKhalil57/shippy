import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { decisionsReady, score, type ExtractField } from "../../../agent/built-in-ai.ts";
import { api } from "../../../cms/client.ts";
import type { ExtractionResult, InboxMessage, InboxPayload, MatchResult } from "../../../cms/endpoints/sourcing.ts";
import type { ExtractedLine } from "../../../cms/endpoints/sourcing-data.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import type { Access } from "../app.ts";
import type { ViewProps } from "../views.ts";
import { toast } from "../shared.ts";
import "../../../components/index.ts";

/**
 * Inbox (`/inbox`): every channel in one list — Outlook and Gmail mailboxes, the website
 * quick-quote form, WhatsApp forwards. A person opens a message (the original is kept, with its
 * attachments), lets the AI read it into a draft case with per-field confidence, and creates the
 * case; replies and forwards are matched to their case by reference, duplicates recognised, and
 * anything uncertain waits in the review queue. Logic: src/cms/endpoints/sourcing.ts.
 */

type Tone = "success" | "warning" | "error" | "info" | "neutral";
type Filter = "all" | "new" | "review" | "linked";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "review", label: "Needs review" },
  { key: "linked", label: "Linked" },
];

const STATUS: Record<string, [Tone, string]> = {
  New: ["info", "New"],
  "Needs review": ["warning", "Needs review"],
  Linked: ["success", "Linked"],
  "Case created": ["success", "Linked · case created"],
  Ignored: ["neutral", "Not related"],
};

/** What a supplier's reply can tell us, for "Pull out the offer details" (on the device). */
const OFFER_FIELDS: ExtractField[] = [
  { id: "item", label: "Item offered", hint: "product, brand and part number" },
  { id: "price", label: "Unit price", type: "number" },
  { id: "currency", label: "Currency" },
  { id: "pack", label: "Unit / pack size" },
  { id: "leadTime", label: "Lead time" },
  { id: "validity", label: "Valid until" },
];

/** What an incoming message can be, for the on-device category suggestion. */
const MESSAGE_KINDS = [
  "New RFQ",
  "Supplier offer or reply",
  "Customer PO or order",
  "Invoice or payment query",
  "Delivery or logistics",
  "Complaint",
  "Other",
];

const confTone = (c: number): Tone => (c >= 0.85 ? "success" : c >= 0.6 ? "warning" : "error");
const pct = (c: number) => `${Math.round(c * 100)}%`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TIME = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const FULL = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const when = (v: string) =>
  v ? (v.startsWith("2026-11-17") ? TIME.format(new Date(v)) : DAY.format(new Date(v))) : "";
const full = (v: string) => (v ? FULL.format(new Date(v)) : "");

function channelLabel(m: InboxMessage) {
  if (m.channel === "Email") return m.mailbox.startsWith("Gmail") ? m.mailbox : `Outlook · ${m.mailbox || "sales@"}`;
  if (m.channel === "WhatsApp") return "WhatsApp";
  if (m.channel === "Website form") return "Website quick-quote form";
  return m.channel;
}
const channelIcon = (m: InboxMessage) =>
  m.channel === "WhatsApp" ? "chat" : m.channel === "Website form" ? "link" : m.channel === "Phone" ? "phone" : "mail";

const isRfq = (m: InboxMessage) => ["New RFQ", "Service request"].includes(m.classification);

type DuplicateResult = { kind: "duplicate"; match: MatchResult; message: InboxMessage };

@customElement("gs-inbox")
export class GsInbox extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: ViewProps["user"];

  @state() private data: InboxPayload | null = null;
  @state() private error = "";
  @state() private selected = "";
  @state() private filter: Filter = "all";
  /** What's running: "extract", "match", "create", "simulate", "review". */
  @state() private busy = "";
  @state() private extracted: Record<string, ExtractionResult> = {};
  @state() private duplicate: Record<string, DuplicateResult> = {};
  @state() private matched: Record<string, MatchResult> = {};
  @state() private owner: Record<string, string> = {};
  @state() private backup: Record<string, string> = {};
  @state() private confirming = false;
  @state() private users: { label: string; value: string }[] = [];

  connectedCallback() {
    super.connectedCallback();
    void this._load();
    void api
      .find("users", { limit: 0, depth: 0, sort: "name" })
      .then(
        (r) => (this.users = r.docs.map((u) => ({ label: typeof u.name === "string" ? u.name : u.id, value: u.id }))),
      )
      .catch(() => undefined);
  }

  private async _load(select?: string) {
    try {
      this.data = await api.get<InboxPayload>("/inbox");
      this.error = "";
      const ids = this.data.messages.map((m) => m.id);
      this.selected = select ?? (ids.includes(this.selected) ? this.selected : (ids[0] ?? ""));
      void this._restore();
      void this._rateUrgency();
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private get current() {
    return this.data?.messages.find((m) => m.id === this.selected);
  }

  /** A message read before (extraction saved on it) shows its draft again without the reading state. */
  private async _restore() {
    const m = this.current;
    if (!m || !m.extracted || this.extracted[m.id] || !isRfq(m)) return;
    const r = await api.post<ExtractionResult | DuplicateResult>(`/inbox/${m.id}/extract`).catch(() => null);
    if (r?.kind === "extraction") this.extracted = { ...this.extracted, [m.id]: r };
  }

  private _select(id: string) {
    this.selected = id;
    this.confirming = false;
    void this._restore();
  }

  private async _simulate(kind: "rfq" | "forward" | "reply") {
    this.busy = "simulate";
    try {
      const { doc } = await api.post<{ doc: InboxMessage }>("/inbox/simulate", { kind });
      this.filter = "all";
      await this._load(doc.id);
      toast(`New ${kind === "reply" ? "supplier reply" : "email"}: “${doc.subject}”`, "info");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _extract(m: InboxMessage) {
    this.busy = "extract";
    try {
      const [r] = await Promise.all([
        api.post<ExtractionResult | DuplicateResult>(`/inbox/${m.id}/extract`),
        wait(1100),
      ]);
      if (r.kind === "duplicate") {
        this.duplicate = { ...this.duplicate, [m.id]: r };
        toast(
          r.match.case ? `No new case — already linked to ${r.match.caseId}` : "Copy of a message already in the inbox",
          "info",
        );
        await this._load(m.id);
      } else {
        this.extracted = { ...this.extracted, [m.id]: r };
        await this._load(m.id);
      }
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _match(m: InboxMessage) {
    this.busy = "match";
    try {
      const [r] = await Promise.all([api.post<{ match: MatchResult }>(`/inbox/${m.id}/match`), wait(800)]);
      this.matched = { ...this.matched, [m.id]: r.match };
      const t = r.match;
      toast(
        t.outcome === "linked"
          ? `Matched to ${t.caseId} by ${t.reference} (${pct(t.confidence)})`
          : t.outcome === "duplicate"
            ? `Duplicate — ${t.caseId ? `already linked to ${t.caseId}` : "kept with the original"}`
            : "Uncertain — sent to the review queue",
        t.outcome === "review" || t.outcome === "none" ? "warning" : "success",
      );
      await this._load(m.id);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _create(m: InboxMessage) {
    const x = this.extracted[m.id];
    this.confirming = false;
    this.busy = "create";
    try {
      const r = await api.post<{ case: { id: string; caseId: string }; acknowledged: boolean; manualAck: boolean }>(
        `/inbox/${m.id}/create-case`,
        { owner: this.owner[m.id] ?? x?.assignment.owner, backup: this.backup[m.id] ?? x?.assignment.backup },
      );
      toast(
        `Case ${r.case.caseId} created · ${r.acknowledged ? "acknowledgement sent once" : r.manualAck ? "acknowledge by hand" : "already acknowledged"}`,
      );
      await this._load(m.id);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _review(m: InboxMessage, decision: "link" | "not-related", caseId?: string) {
    this.busy = "review";
    try {
      await api.post(`/inbox/${m.id}/review`, { decision, case: caseId });
      toast(decision === "link" ? "Linked — your decision is in the audit log" : "Marked not related", "success");
      await this._load(m.id);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  /* ---------------------------------------------------------------- parts */

  private _header() {
    return html`<ui-page-header>
      <span slot="eyebrow">Sourcing desk · intake</span>
      <span slot="heading">Inbox</span>
      <span slot="subtitle"
        >Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.</span
      >
      <ui-flex slot="actions" gap="2" wrap>
        <ui-button size="xs" color="primary" ?disabled=${this.busy === "simulate"} @click=${() => this._simulate("rfq")}
          ><ui-icon name="mail" size="sm"></ui-icon>Simulate new email</ui-button
        >
        <ui-button
          size="xs"
          variant="tonal"
          ?disabled=${this.busy === "simulate"}
          @click=${() => this._simulate("forward")}
          >Simulate forwarded copy</ui-button
        >
        <ui-button
          size="xs"
          variant="tonal"
          ?disabled=${this.busy === "simulate"}
          @click=${() => this._simulate("reply")}
          >Simulate supplier reply</ui-button
        >
      </ui-flex>
    </ui-page-header>`;
  }

  private _channels(d: InboxPayload) {
    const tone = (s: string): Tone =>
      s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";
    return html`<ui-card size="sm" heading="Connected channels">
      <ui-flex gap="2" wrap>
        ${d.connections.map(
          (c) =>
            html`<ui-tag .tone=${tone(c.status)}
              >${c.kind.replace(" mailbox", "")} · ${c.account} — ${c.status}</ui-tag
            >`,
        )}
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Processed today: ${d.stats.processedToday} · duplicates suppressed: ${d.stats.duplicates} · waiting for a
        person: ${d.stats.review}</ui-text
      >
    </ui-card>`;
  }

  /** On-device urgency (1–5) per message, when the model is already there; for the badge and the sort. */
  @state() private urgency = new Map<string, number>();
  @state() private urgentFirst = false;

  private async _rateUrgency() {
    const messages = this.data?.messages.filter((m) => !this.urgency.has(m.id)).slice(0, 20) ?? [];
    if (!messages.length || !(await decisionsReady())) return;
    for (const m of messages) {
      const n = await score(
        `${m.subject}\n\n${m.body}`,
        "How urgent is this message for a ship chandler? Urgent: a vessel arriving very soon, a deadline today, a complaint, a stop or a cancellation.",
      ).catch(() => null);
      if (n != null) this.urgency = new Map(this.urgency).set(m.id, n);
    }
  }

  private _visible(d: InboxPayload) {
    const visible = d.messages.filter((m) =>
      this.filter === "new"
        ? m.status === "New"
        : this.filter === "review"
          ? m.status === "Needs review"
          : this.filter === "linked"
            ? ["Linked", "Case created"].includes(m.status)
            : true,
    );
    return this.urgentFirst
      ? [...visible].sort((a, b) => (this.urgency.get(b.id) ?? 0) - (this.urgency.get(a.id) ?? 0))
      : visible;
  }

  private _list(d: InboxPayload) {
    const items = this._visible(d).map((m) => {
      const [tone, label] = STATUS[m.status] ?? ["neutral", m.status];
      const urgency = this.urgency.get(m.id) ?? 0;
      return html`<ui-list-item
        action
        lines="1"
        ?selected=${m.id === this.selected}
        .headline=${m.fromName || m.from}
        .trailingText=${when(m.receivedAt)}
        .supporting=${m.subject}
        @click=${() => this._select(m.id)}
      >
        <ui-tag .tone=${tone}>${label}</ui-tag>
        <ui-tag .icon=${channelIcon(m)}>${channelLabel(m)}</ui-tag>
        ${m.files.length ? html`<ui-tag>${m.files.length} file${m.files.length > 1 ? "s" : ""}</ui-tag>` : nothing}
        <ui-ai-language .text=${`${m.subject}\n${m.body}`}></ui-ai-language>
        ${urgency >= 3 ? html`<ui-tag .tone=${urgency >= 4 ? "warning" : undefined}>Urgency ${urgency}/5</ui-tag>` : nothing}
      </ui-list-item>`;
    });
    return html`<ui-card size="sm" .count=${d.messages.length}>
      <span slot="heading">Messages</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        >${
          this.urgency.size
            ? html`<ui-button
                size="xs"
                variant="text"
                toggle
                ?selected=${this.urgentFirst}
                @click=${() => (this.urgentFirst = !this.urgentFirst)}
                >Most urgent first</ui-button
              >`
            : nothing
        }</ui-flex
      >
      <ui-button-group
        label="Show messages"
        size="xs"
        .value=${this.filter}
        .options=${FILTERS.map((f) => ({
          value: f.key,
          label: f.key === "review" && d.stats.review ? `${f.label} · ${d.stats.review}` : f.label,
        }))}
        @ui-change=${(e: CustomEvent<{ value: string }>) => (this.filter = e.detail.value as Filter)}
      ></ui-button-group>
      ${
        items.length
          ? html`<ui-list variant="separated" label="Messages">${items}</ui-list>`
          : html`<ui-empty-state size="sm">Nothing here.</ui-empty-state>`
      }
    </ui-card>`;
  }

  private _reviewQueue(d: InboxPayload) {
    const queue = d.messages.filter((m) => m.status === "Needs review");
    return html`<ui-card size="sm" .count=${queue.length} .countTone=${queue.length ? "warning" : "success"}>
      <span slot="heading">Review queue</span>
      <ui-text variant="body-sm" color="muted"
        >Matches below 85% confidence are never linked automatically — a person picks the case.</ui-text
      >
      ${
        queue.length
          ? html`<ui-flex direction="col" gap="2">
              ${queue.map(
                (m) =>
                  html`<ui-flex gap="2" align="start">
                    <ui-badge dot tone="warning" label="Needs review"></ui-badge>
                    <ui-flex direction="col" gap="0" grow shrink>
                      <ui-button size="xs" variant="text" justify="start" @click=${() => this._select(m.id)}
                        >${m.subject}</ui-button
                      >
                      <ui-text variant="body-sm" color="muted" truncate
                        >${m.fromName} · ${m.match ? pct(m.match.confidence) : "no match"}</ui-text
                      >
                    </ui-flex>
                  </ui-flex>`,
              )}
            </ui-flex>`
          : html`<ui-empty-state size="sm">Nothing waiting — every reply is matched.</ui-empty-state>`
      }
    </ui-card>`;
  }

  private _original(m: InboxMessage) {
    return html`<ui-card>
      <span slot="heading">Original message</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap><ui-tag>Kept as received</ui-tag></ui-flex>
      <ui-mockup-window variant="bordered">
        <ui-flex direction="col" gap="3" padding="4">
          <ui-flex direction="col" gap="1">
            <ui-text variant="body-sm" color="muted"><strong>From</strong> ${m.fromName} &lt;${m.from}&gt;</ui-text>
            <ui-text variant="body-sm" color="muted"
              ><strong>Via</strong> ${channelLabel(m)} · ${full(m.receivedAt)}</ui-text
            >
            <ui-text variant="title-sm">${m.subject}</ui-text>
          </ui-flex>
          <ui-divider></ui-divider>
          ${
            m.body
              ? html`<ui-ai-classify
                    .text=${`${m.subject}\n\n${m.body}`}
                    .options=${MESSAGE_KINDS}
                    what="incoming emails and messages to a ship chandler"
                  ></ui-ai-classify>
                  <ui-ai-flag
                    tone="error"
                    heading="Asks to change bank or payment details"
                    question="Does this message ask to change bank account, IBAN or payment details?"
                    .text=${m.body}
                    note="Don't act on it from the email: a bank-detail change needs two people (Finance and the CEO) and a call-back on the number already on file."
                  ></ui-ai-flag>
                  <ui-ai-flag
                    tone="info"
                    heading="Looks like an automatic reply"
                    question="Is this an automatic reply (out of office, auto-acknowledgement) rather than a written answer?"
                    .text=${m.body}
                    note="It doesn't answer the request — supplier reminders keep running."
                  ></ui-ai-flag>
                  <ui-ai-flag
                    heading="The sender can't supply"
                    question="Does the sender say they cannot supply, quote or deliver the requested items?"
                    .text=${m.body}
                    note="Look for another supplier for these lines before the deadline."
                  ></ui-ai-flag>
                  <ui-ai-text .text=${m.body} translatable summarizable></ui-ai-text>
                  <ui-ai-extract
                    source="text"
                    label="Pull out the offer details"
                    what="supplier offer or reply to a ship chandler"
                    .text=${m.body}
                    .fields=${OFFER_FIELDS}
                  ></ui-ai-extract>
                  <ui-ai-replies .text=${m.body}></ui-ai-replies>`
              : html`<ui-text variant="body-md" color="muted">(no text)</ui-text>`
          }
          ${
            m.files.length
              ? html`<ui-flex gap="2" wrap>
                  ${m.files.map(
                    (f) =>
                      html`<ui-tag variant="outline" size="md"
                        ><ui-icon name="file" size="xs"></ui-icon
                        >${f.name}${f.note ? html` · <em>${f.note}</em>` : nothing}</ui-tag
                      >`,
                  )}
                </ui-flex>`
              : nothing
          }
          <ui-ai-read-file></ui-ai-read-file>
        </ui-flex>
      </ui-mockup-window>
      <ui-text variant="body-sm" color="muted"
        >Message id ${m.messageId} · re-processing the same message never creates a second case or
        acknowledgement.</ui-text
      >
    </ui-card>`;
  }

  private _reading(m: InboxMessage) {
    return html`<ui-card heading="AI is reading">
      <ui-flex gap="3" align="center">
        <ui-loading size="md" color="primary" label="Reading"></ui-loading>
        <ui-text variant="body-md"
          >Reading the email${m.files.length ? ` and ${m.files.length} attachment${m.files.length > 1 ? "s" : ""}` : ""}
          (${m.files.map((f) => f.kind).join(", ") || "text"})…</ui-text
        >
      </ui-flex>
      <ui-progress indeterminate></ui-progress>
    </ui-card>`;
  }

  private _extractPrompt(m: InboxMessage) {
    if (this.busy === "extract") return this._reading(m);
    return html`<ui-card variant="filled" heading="Read it into a draft case">
      <ui-text variant="body-md" color="muted"
        >The AI reads the email${m.files.length ? " and every attachment (Excel, PDF, Word, photos)" : ""} into a draft:
        customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every
        value. Nothing is created until you confirm.</ui-text
      >
      <ui-button slot="actions" color="primary" size="xs" @click=${() => this._extract(m)}
        ><ui-icon name="sparkles" size="sm"></ui-icon>Extract with AI</ui-button
      >
    </ui-card>`;
  }

  private _conf(c: number) {
    return html`<ui-tag .tone=${confTone(c)}>${pct(c)}</ui-tag>`;
  }

  private _draftHeader(x: ExtractionResult) {
    return html`<ui-card>
      <span slot="heading">Draft case</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-flex gap="1" wrap
          ><ui-tag tone="primary" icon="sparkles">AI draft</ui-tag
          >${x.newCustomer ? html`<ui-tag tone="primary">New customer</ui-tag>` : nothing}</ui-flex
        ></ui-flex
      >
      <ui-text variant="body-sm" color="muted"
        >Low-confidence values are never applied without a person checking them.</ui-text
      >
      <ui-grid fit="xs" gap="3">
        ${x.header.map(
          (f) =>
            html`<ui-box border rounded="box" padding="3" .surface=${f.confidence < 0.6 ? "base-200" : "base-100"}>
              <ui-flex direction="col" gap="1">
                <ui-flex justify="between" align="center" gap="2">
                  <ui-text variant="body-sm" color="muted" uppercase>${f.field}</ui-text>
                  ${this._conf(f.confidence)}
                </ui-flex>
                <ui-text variant="label-lg" .color=${f.confidence < 0.6 ? "error" : undefined}>${f.value}</ui-text>
              </ui-flex>
            </ui-box>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _draftLines(x: ExtractionResult) {
    if (!x.lines.length) return nothing;
    const columns: TableColumn<ExtractedLine & Record<string, unknown>>[] = [
      { key: "lineNo", label: "#" },
      {
        key: "description",
        label: "Item",
        render: (l) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="label-lg">${l.description}</ui-text>
            <ui-text variant="body-sm" color="muted">“${l.originalText}”</ui-text>
            ${l.brandRule !== "Any" ? html`<ui-text variant="body-sm" color="accent">${l.brandRule}${l.brand ? ` · ${l.brand}` : ""}</ui-text>` : nothing}
            ${l.flag ? html`<ui-text variant="body-sm" color="warning">⚑ ${l.flag}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "impa",
        label: "IMPA · ISSA",
        render: (l) =>
          html`<ui-flex direction="col" gap="0"
            ><ui-text variant="body-sm" mono>${l.impa || "—"}</ui-text
            ><ui-text variant="body-sm" mono color="muted">${l.issa || "—"}</ui-text></ui-flex
          >`,
      },
      {
        key: "partNo",
        label: "Part no.",
        render: (l) => html`<ui-text variant="body-sm" mono>${l.partNo || "—"}</ui-text>`,
      },
      { key: "qty", label: "Qty", render: (l) => html`<ui-text variant="label-lg">${l.qty}</ui-text>` },
      { key: "unit", label: "Unit" },
      {
        key: "source",
        label: "Source",
        render: (l) => html`<ui-tag icon="file">${l.source}</ui-tag>`,
      },
      {
        key: "confidence",
        label: "Confidence",
        render: (l) =>
          html`<ui-flex direction="col" gap="1" align="start"
            >${this._conf(l.confidence)}${l.confidence < 0.8 ? html`<ui-text variant="body-sm" color="warning">Check against the original</ui-text>` : nothing}</ui-flex
          >`,
      },
    ];
    return html`<ui-card .count=${x.lines.length}>
      <span slot="heading">Draft lines</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag tone="primary" icon="sparkles">AI draft</ui-tag></ui-flex
      >
      <ui-table size="sm" .columns=${columns} .rows=${x.lines as unknown as Record<string, unknown>[]}></ui-table>
      ${x.notes.map((n) => html`<ui-alert tone="info">${n}</ui-alert>`)}
    </ui-card>`;
  }

  private _missing(x: ExtractionResult) {
    if (!x.missing.length) return nothing;
    return html`<ui-card heading="Missing or unclear">
      <ui-alert tone="warning">${x.missing.join(" · ")}</ui-alert>
      ${
        x.clarification
          ? html`<ui-text variant="label-lg">Clarification request — drafted, not sent</ui-text>
              <ui-mockup-window variant="bordered">
                <ui-flex direction="col" gap="2" padding="4">
                  ${x.clarification
                    .split(/\n{2,}/)
                    .map(
                      (p) =>
                        html`<ui-text variant="body-md"
                          >${p.split("\n").map((l, i) => html`${i ? html`<br />` : nothing}${l}`)}</ui-text
                        >`,
                    )}
                </ui-flex>
              </ui-mockup-window>`
          : nothing
      }
    </ui-card>`;
  }

  private _assignment(m: InboxMessage, x: ExtractionResult) {
    const owner = this.owner[m.id] ?? x.assignment.owner;
    const backup = this.backup[m.id] ?? x.assignment.backup;
    const locked = Boolean(m.createdCase);
    return html`<ui-card heading="Owner, backup and deadline">
      <ui-text variant="body-sm" color="muted">Suggested by the assignment rules: ${x.assignment.rule}.</ui-text>
      <ui-grid fit="xs" gap="3">
        <ui-select
          legend="Owner"
          size="sm"
          width="full"
          ?disabled=${locked}
          .options=${this.users.length ? this.users : [{ label: x.assignment.ownerName, value: x.assignment.owner }]}
          .value=${owner}
          @change=${(e: Event) => (this.owner = { ...this.owner, [m.id]: (e.target as HTMLSelectElement).value })}
        ></ui-select>
        <ui-select
          legend="Backup"
          size="sm"
          width="full"
          ?disabled=${locked}
          .options=${this.users.length ? this.users : [{ label: x.assignment.backupName, value: x.assignment.backup }]}
          .value=${backup}
          @change=${(e: Event) => (this.backup = { ...this.backup, [m.id]: (e.target as HTMLSelectElement).value })}
        ></ui-select>
        <ui-flex direction="col" gap="1">
          <ui-text variant="label-lg">Quote deadline</ui-text>
          <ui-text variant="body-md">${full(x.assignment.deadline)}</ui-text>
          <ui-text variant="body-sm" color="muted">A reminder is scheduled before it.</ui-text>
        </ui-flex>
      </ui-grid>
    </ui-card>`;
  }

  private _ack(m: InboxMessage, x: ExtractionResult) {
    const a = x.acknowledgement;
    return html`<ui-card>
      <span slot="heading">Acknowledgement draft</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${m.acknowledgedAt ? "success" : a.manual ? "warning" : "neutral"}
          >${m.acknowledgedAt ? `Sent once · ${full(m.acknowledgedAt)}` : a.manual ? "Send by hand" : "Sent once on create"}</ui-tag
        ></ui-flex
      >
      <ui-mockup-window variant="filled">
        <ui-flex direction="col" gap="2" padding="4">
          <ui-text variant="label-md" emphasized color="primary" uppercase>Golden Sea for Trading & Marketing</ui-text>
          <ui-text variant="title-sm">${a.subject}</ui-text>
          <ui-ai-text .text=${a.body} translatable></ui-ai-text>
        </ui-flex>
      </ui-mockup-window>
      <ui-text variant="body-sm" color="muted"
        >Template: ${a.template}.
        ${a.manual ? "WhatsApp / form source: the owner sends it — the system never messages the customer by itself here." : "Sent once from the approved template — never twice, even if the email is re-processed."}</ui-text
      >
    </ui-card>`;
  }

  private _createBar(m: InboxMessage, x: ExtractionResult) {
    if (m.createdCase)
      return html`<ui-alert tone="success">
        Case ${m.createdCase.caseId} created from this message and linked to it.
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="xs" .href=${`/collections/cases/${m.createdCase.id}/rfqs`} color="primary"
            >Send supplier RFQs</ui-button
          >
          <ui-button size="xs" variant="tonal" .href=${`/collections/cases/${m.createdCase.id}`}>Open case</ui-button>
        </ui-flex>
      </ui-alert>`;
    const flagged = x.lines.filter((l) => l.flag).length;
    const owner =
      this.users.find((u) => u.value === (this.owner[m.id] ?? x.assignment.owner))?.label ?? x.assignment.ownerName;
    return html`<ui-card heading="Create the case">
        <ui-text variant="body-md"
          >${x.caseType === "service" ? "Service case" : "RFQ case"} for <strong>${x.customerName}</strong> with
          ${x.lines.length}
          line${x.lines.length === 1 ? "" : "s"}${flagged ? ` (${flagged} flagged for clarification)` : ""}, owner
          <strong>${owner}</strong>. The original message stays linked to it.</ui-text
        >
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="xs" variant="text" @click=${() => this._review(m, "not-related")}>Not an RFQ</ui-button>
          <ui-button
            size="xs"
            color="primary"
            ?disabled=${this.busy === "create"}
            @click=${() => (this.confirming = true)}
            >Create case</ui-button
          >
        </ui-flex>
      </ui-card>
      <ui-modal heading="Create this case?" .open=${this.confirming} @ui-close=${() => (this.confirming = false)}>
        <ui-flex direction="col" gap="2">
          <ui-text variant="body-md"
            >Creates a ${x.caseType === "service" ? "service" : "RFQ"} case for
            <strong>${x.customerName}</strong> ${x.newCustomer ? "(new customer record)" : ""} with ${x.lines.length}
            line${x.lines.length === 1 ? "" : "s"} exactly as drafted, owner <strong>${owner}</strong>, deadline
            ${full(x.assignment.deadline)}.</ui-text
          >
          <ui-text variant="body-md"
            >${x.acknowledgement.manual ? "The acknowledgement is yours to send by hand." : "The acknowledgement is sent once, from the approved template."}
            ${flagged ? " Flagged lines stay “Clarification needed” until the customer answers." : ""}</ui-text
          >
        </ui-flex>
        <ui-button slot="actions" variant="text" @click=${() => (this.confirming = false)}>Cancel</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => this._create(m)}>Create case</ui-button>
      </ui-modal>`;
  }

  private _matchCard(m: InboxMessage) {
    const live = this.matched[m.id];
    const dup = this.duplicate[m.id]?.match;
    const result = live ?? dup;
    const st = m.status;
    if (st === "New" && !result)
      return html`<ui-card variant="filled" heading="Match this message">
        ${
          this.busy === "match"
            ? html`<ui-flex gap="3" align="center"
                ><ui-loading color="primary"></ui-loading
                ><ui-text variant="body-md"
                  >Looking for a reference, the thread, identical files and the sender…</ui-text
                ></ui-flex
              >`
            : html`<ui-text variant="body-md" color="muted"
                >Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their
                files. Below 85% a person decides.</ui-text
              >`
        }
        <ui-button
          slot="actions"
          size="xs"
          color="primary"
          ?disabled=${this.busy === "match"}
          @click=${() => this._match(m)}
          ><ui-icon name="sparkles" size="sm"></ui-icon>Match reply</ui-button
        >
      </ui-card>`;
    const match = m.match;
    const basis = result?.basis ?? match?.basis ?? [];
    const conf = result?.confidence ?? match?.confidence ?? 0;
    const caseRef = match?.case ?? (result?.case ? { id: result.case, caseId: result.caseId ?? "" } : undefined);
    const duplicate = m.classification === "Duplicate";
    if (st === "Needs review") {
      const candidates = match?.candidates ?? [];
      return html`<ui-card>
        <span slot="heading">Needs a person</span>
        <ui-flex slot="trailing" gap="2" align="center" wrap>${this._conf(conf)}</ui-flex>
        <ui-alert tone="warning">Uncertain match — not linked automatically.</ui-alert>
        <ui-list>${basis.map((b) => html`<ui-list-item .supporting=${b} lines="3"></ui-list-item>`)}</ui-list>
        <ui-flex direction="col" gap="2">
          ${candidates.map(
            (c) =>
              html`<ui-flex justify="between" align="center" gap="2" wrap>
                <ui-flex direction="col" gap="0" shrink>
                  <ui-text variant="label-lg">${c.caseId} ${this._conf(c.confidence)}</ui-text>
                  <ui-text variant="body-sm" color="muted">${c.reason}</ui-text>
                </ui-flex>
                <ui-button
                  size="xs"
                  color="primary"
                  variant="tonal"
                  ?disabled=${this.busy === "review"}
                  @click=${() => this._review(m, "link", c.case)}
                  >Link to ${c.caseId}</ui-button
                >
              </ui-flex>`,
          )}
        </ui-flex>
        <ui-flex slot="actions" gap="2">
          <ui-button size="xs" variant="text" @click=${() => this._review(m, "not-related")}>Not related</ui-button>
        </ui-flex>
      </ui-card>`;
    }
    if (st === "Ignored")
      return html`<ui-alert tone="info"
        >Marked not related${match?.reviewedBy ? ` by ${match.reviewedBy}` : ""}.</ui-alert
      >`;
    return html`<ui-card>
      <span slot="heading">${duplicate ? "Duplicate detected" : "Reply matched"}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap>${this._conf(conf)}</ui-flex>
      ${
        duplicate
          ? html`<ui-alert tone="info"
              >No new case —
              ${caseRef?.caseId ? `already linked to ${caseRef.caseId}` : "kept with the original message"}. No second
              acknowledgement.</ui-alert
            >`
          : html`<ui-alert tone="success"
              >Matched to
              ${caseRef?.caseId ?? "the case"}${match?.reference ? ` by reference ${match.reference}` : ""}${match?.reviewedBy ? ` · confirmed by ${match.reviewedBy}` : ""}.</ui-alert
            >`
      }
      <ui-list>${basis.map((b) => html`<ui-list-item .supporting=${b} lines="3"></ui-list-item>`)}</ui-list>
      ${
        caseRef
          ? html`<ui-flex slot="actions" gap="2" wrap>
              <ui-button size="xs" variant="tonal" .href=${`/collections/cases/${caseRef.id}/rfqs`}
                >Supplier RFQs</ui-button
              >
              <ui-button size="xs" color="primary" .href=${`/collections/cases/${caseRef.id}`}
                >Open ${caseRef.caseId}</ui-button
              >
            </ui-flex>`
          : nothing
      }
    </ui-card>`;
  }

  private _detail(m: InboxMessage | undefined) {
    if (!m)
      return html`<ui-card heading="No message selected"
        ><ui-text variant="body-md" color="muted">Pick a message on the left.</ui-text></ui-card
      >`;
    const x = this.extracted[m.id];
    const dup = this.duplicate[m.id];
    const rfq = isRfq(m) && !dup;
    return html`<ui-flex direction="col" gap="4">
      ${this._original(m)}
      ${
        rfq
          ? x
            ? html`${this._draftHeader(x)} ${this._draftLines(x)} ${this._missing(x)} ${this._assignment(m, x)}
              ${this._ack(m, x)} ${this._createBar(m, x)}`
            : m.createdCase
              ? html`<ui-alert tone="success"
                  >Case ${m.createdCase.caseId} was created from this message.
                  <ui-button slot="actions" size="xs" .href=${`/collections/cases/${m.createdCase.id}`}
                    >Open case</ui-button
                  ></ui-alert
                >`
              : m.status === "Ignored"
                ? html`<ui-alert tone="info">Marked “not an RFQ”.</ui-alert>`
                : this._extractPrompt(m)
          : this._matchCard(m)
      }
    </ui-flex>`;
  }

  render() {
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const d = this.data;
    if (!d) return html`<ui-empty-state loading></ui-empty-state>`;
    const side = html`<ui-flex direction="col" gap="4">${this._list(d)} ${this._reviewQueue(d)}</ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._header()} ${this._channels(d)}
      <ui-grid
        sidebar
        gap="4"
        .items=${[
          { content: side, role: "side" },
          { content: this._detail(this.current), role: "main" },
        ]}
      ></ui-grid>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-inbox": GsInbox;
  }
}
