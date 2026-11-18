import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { ExtractionResult, InboxMessage, InboxPayload, MatchResult } from "../../../cms/endpoints/sourcing.ts";
import type { ExtractedLine } from "../../../cms/endpoints/sourcing-data.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { MenuItem } from "../../../components/primitives/navigation/menu.ts";
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
    return html`<ui-flex justify="between" align="end" gap="4" wrap>
      <ui-flex direction="col" gap="1" shrink>
        <ui-text size="xs" color="muted" weight="medium" uppercase>Sourcing desk · intake</ui-text>
        <ui-heading level="1" size="page">Inbox</ui-heading>
        <ui-text color="muted"
          >Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.</ui-text
        >
      </ui-flex>
      <ui-flex gap="2" wrap>
        <ui-button size="sm" color="primary" ?disabled=${this.busy === "simulate"} @click=${() => this._simulate("rfq")}
          ><ui-icon name="mail" size="sm"></ui-icon>Simulate new email</ui-button
        >
        <ui-button
          size="sm"
          variant="soft"
          ?disabled=${this.busy === "simulate"}
          @click=${() => this._simulate("forward")}
          >Simulate forwarded copy</ui-button
        >
        <ui-button
          size="sm"
          variant="soft"
          ?disabled=${this.busy === "simulate"}
          @click=${() => this._simulate("reply")}
          >Simulate supplier reply</ui-button
        >
      </ui-flex>
    </ui-flex>`;
  }

  private _channels(d: InboxPayload) {
    const tone = (s: string): Tone =>
      s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";
    return html`<ui-card variant="border" size="sm" shadow="false" heading="Connected channels">
      <ui-flex gap="2" wrap>
        ${d.connections.map(
          (c) =>
            html`<ui-badge variant="soft" .color=${tone(c.status)}
              >${c.kind.replace(" mailbox", "")} · ${c.account} — ${c.status}</ui-badge
            >`,
        )}
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Processed today: ${d.stats.processedToday} · duplicates suppressed: ${d.stats.duplicates} · waiting for a
        person: ${d.stats.review}</ui-text
      >
    </ui-card>`;
  }

  private _visible(d: InboxPayload) {
    return d.messages.filter((m) =>
      this.filter === "new"
        ? m.status === "New"
        : this.filter === "review"
          ? m.status === "Needs review"
          : this.filter === "linked"
            ? ["Linked", "Case created"].includes(m.status)
            : true,
    );
  }

  private _list(d: InboxPayload) {
    const items: MenuItem[] = this._visible(d).map((m) => {
      const [tone, label] = STATUS[m.status] ?? ["neutral", m.status];
      return {
        value: m.id,
        active: m.id === this.selected,
        label: html`<ui-flex direction="col" gap="1" full-width shrink>
          <ui-flex justify="between" gap="2" full-width>
            <ui-text size="sm" weight="semibold" truncate>${m.fromName || m.from}</ui-text>
            <ui-text size="xs" color="muted">${when(m.receivedAt)}</ui-text>
          </ui-flex>
          <ui-text size="sm" truncate>${m.subject}</ui-text>
          <ui-flex gap="1" wrap>
            <ui-badge size="xs" variant="soft" .color=${tone}>${label}</ui-badge>
            <ui-badge size="xs" variant="ghost"
              ><ui-icon .name=${channelIcon(m)} size="xs"></ui-icon>${channelLabel(m)}</ui-badge
            >
            ${m.files.length ? html`<ui-badge size="xs" variant="ghost">${m.files.length} file${m.files.length > 1 ? "s" : ""}</ui-badge>` : nothing}
          </ui-flex>
        </ui-flex>`,
      };
    });
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <ui-flex gap="2" align="center"
          >Messages<ui-badge size="sm" variant="soft">${d.messages.length}</ui-badge></ui-flex
        >
      </ui-flex>
      <ui-tabs
        variant="box"
        size="xs"
        .surface=${false}
        .label=${"Filter messages"}
        .active=${FILTERS.findIndex((f) => f.key === this.filter)}
        .items=${FILTERS.map((f) => ({
          label:
            f.key === "review" && d.stats.review
              ? html`${f.label} <ui-badge size="xs" color="warning">${d.stats.review}</ui-badge>`
              : f.label,
        }))}
        @ui-change=${(e: CustomEvent<{ index: number }>) => (this.filter = FILTERS[e.detail.index].key)}
      ></ui-tabs>
      ${
        items.length
          ? html`<ui-menu
              size="sm"
              width="full"
              surface="false"
              .items=${items}
              @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => this._select(String(e.detail.item.value))}
            ></ui-menu>`
          : html`<ui-text size="sm" color="muted">Nothing here.</ui-text>`
      }
    </ui-card>`;
  }

  private _reviewQueue(d: InboxPayload) {
    const queue = d.messages.filter((m) => m.status === "Needs review");
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex slot="heading" gap="2" align="center"
        >Review queue<ui-badge size="sm" variant="soft" .color=${queue.length ? "warning" : "success"}
          >${queue.length}</ui-badge
        ></ui-flex
      >
      <ui-text size="xs" color="muted"
        >Matches below 85% confidence are never linked automatically — a person picks the case.</ui-text
      >
      ${
        queue.length
          ? html`<ui-flex direction="col" gap="2">
              ${queue.map(
                (m) =>
                  html`<ui-flex gap="2" align="start">
                    <ui-status size="sm" color="warning" label="Needs review"></ui-status>
                    <ui-flex direction="col" gap="0" grow shrink>
                      <ui-button size="xs" variant="link" justify="start" @click=${() => this._select(m.id)}
                        >${m.subject}</ui-button
                      >
                      <ui-text size="xs" color="muted" truncate
                        >${m.fromName} · ${m.match ? pct(m.match.confidence) : "no match"}</ui-text
                      >
                    </ui-flex>
                  </ui-flex>`,
              )}
            </ui-flex>`
          : html`<ui-text size="sm" color="muted">Nothing waiting — every reply is matched.</ui-text>`
      }
    </ui-card>`;
  }

  private _original(m: InboxMessage) {
    const paragraphs = m.body.split(/\n{2,}/);
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Original message</span>
        <ui-badge size="sm" variant="ghost">Kept as received</ui-badge>
      </ui-flex>
      <ui-mockup-window variant="bordered">
        <ui-flex direction="col" gap="3" padding="4">
          <ui-flex direction="col" gap="1">
            <ui-text size="xs" color="muted"><strong>From</strong> ${m.fromName} &lt;${m.from}&gt;</ui-text>
            <ui-text size="xs" color="muted"><strong>Via</strong> ${channelLabel(m)} · ${full(m.receivedAt)}</ui-text>
            <ui-text size="sm" weight="semibold">${m.subject}</ui-text>
          </ui-flex>
          <ui-divider></ui-divider>
          ${
            paragraphs.length && m.body
              ? paragraphs.map(
                  (p) =>
                    html`<ui-text size="sm"
                      >${p.split("\n").map((l, i) => html`${i ? html`<br />` : nothing}${l}`)}</ui-text
                    >`,
                )
              : html`<ui-text size="sm" color="muted">(no text)</ui-text>`
          }
          ${
            m.files.length
              ? html`<ui-flex gap="2" wrap>
                  ${m.files.map(
                    (f) =>
                      html`<ui-badge variant="outline" size="md"
                        ><ui-icon name="file" size="xs"></ui-icon
                        >${f.name}${f.note ? html` · <em>${f.note}</em>` : nothing}</ui-badge
                      >`,
                  )}
                </ui-flex>`
              : nothing
          }
        </ui-flex>
      </ui-mockup-window>
      <ui-text size="xs" color="muted"
        >Message id ${m.messageId} · re-processing the same message never creates a second case or
        acknowledgement.</ui-text
      >
    </ui-card>`;
  }

  private _reading(m: InboxMessage) {
    return html`<ui-card variant="border" shadow="false" heading="AI is reading">
      <ui-flex gap="3" align="center">
        <ui-loading variant="dots" size="md" color="primary" label="Reading"></ui-loading>
        <ui-text size="sm"
          >Reading the email${m.files.length ? ` and ${m.files.length} attachment${m.files.length > 1 ? "s" : ""}` : ""}
          (${m.files.map((f) => f.kind).join(", ") || "text"})…</ui-text
        >
      </ui-flex>
      <ui-progress indeterminate width="full" color="primary"></ui-progress>
    </ui-card>`;
  }

  private _extractPrompt(m: InboxMessage) {
    if (this.busy === "extract") return this._reading(m);
    return html`<ui-card variant="dash" shadow="false" heading="Read it into a draft case">
      <ui-text size="sm" color="muted"
        >The AI reads the email${m.files.length ? " and every attachment (Excel, PDF, Word, photos)" : ""} into a draft:
        customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every
        value. Nothing is created until you confirm.</ui-text
      >
      <ui-button slot="actions" color="primary" size="sm" @click=${() => this._extract(m)}
        ><ui-icon name="sparkles" size="sm"></ui-icon>Extract with AI</ui-button
      >
    </ui-card>`;
  }

  private _conf(c: number) {
    return html`<ui-badge size="sm" variant="soft" .color=${confTone(c)}>${pct(c)}</ui-badge>`;
  }

  private _draftHeader(x: ExtractionResult) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Draft case</span>
        <ui-flex gap="1" wrap
          ><ui-badge size="sm" color="primary" variant="soft"
            ><ui-icon name="sparkles" size="xs"></ui-icon>AI draft</ui-badge
          >${x.newCustomer ? html`<ui-badge size="sm" color="accent" variant="soft">New customer</ui-badge>` : nothing}</ui-flex
        >
      </ui-flex>
      <ui-text size="xs" color="muted">Low-confidence values are never applied without a person checking them.</ui-text>
      <ui-grid fit="xs" gap="3">
        ${x.header.map(
          (f) =>
            html`<ui-box border rounded="box" padding="3" .surface=${f.confidence < 0.6 ? "base-200" : "base-100"}>
              <ui-flex direction="col" gap="1">
                <ui-flex justify="between" align="center" gap="2">
                  <ui-text size="xs" color="muted" uppercase>${f.field}</ui-text>
                  ${this._conf(f.confidence)}
                </ui-flex>
                <ui-text size="sm" weight="medium" .color=${f.confidence < 0.6 ? "error" : undefined}
                  >${f.value}</ui-text
                >
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
            <ui-text size="sm" weight="medium">${l.description}</ui-text>
            <ui-text size="xs" color="muted">“${l.originalText}”</ui-text>
            ${l.brandRule !== "Any" ? html`<ui-text size="xs" color="accent">${l.brandRule}${l.brand ? ` · ${l.brand}` : ""}</ui-text>` : nothing}
            ${l.flag ? html`<ui-text size="xs" color="warning">⚑ ${l.flag}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "impa",
        label: "IMPA · ISSA",
        render: (l) =>
          html`<ui-flex direction="col" gap="0"
            ><ui-text size="xs" mono>${l.impa || "—"}</ui-text
            ><ui-text size="xs" mono color="muted">${l.issa || "—"}</ui-text></ui-flex
          >`,
      },
      { key: "partNo", label: "Part no.", render: (l) => html`<ui-text size="xs" mono>${l.partNo || "—"}</ui-text>` },
      { key: "qty", label: "Qty", render: (l) => html`<ui-text size="sm" weight="medium">${l.qty}</ui-text>` },
      { key: "unit", label: "Unit" },
      {
        key: "source",
        label: "Source",
        render: (l) =>
          html`<ui-badge size="sm" variant="ghost"><ui-icon name="file" size="xs"></ui-icon>${l.source}</ui-badge>`,
      },
      {
        key: "confidence",
        label: "Confidence",
        render: (l) =>
          html`<ui-flex direction="col" gap="1" align="start"
            >${this._conf(l.confidence)}${l.confidence < 0.8 ? html`<ui-text size="xs" color="warning">Check against the original</ui-text>` : nothing}</ui-flex
          >`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <ui-flex gap="2" align="center"
          >Draft lines<ui-badge size="sm" variant="soft">${x.lines.length}</ui-badge></ui-flex
        >
        <ui-badge size="sm" color="primary" variant="soft"
          ><ui-icon name="sparkles" size="xs"></ui-icon>AI draft</ui-badge
        >
      </ui-flex>
      <ui-table size="sm" .columns=${columns} .rows=${x.lines as unknown as Record<string, unknown>[]}></ui-table>
      ${x.notes.map((n) => html`<ui-alert color="info" variant="soft">${n}</ui-alert>`)}
    </ui-card>`;
  }

  private _missing(x: ExtractionResult) {
    if (!x.missing.length) return nothing;
    return html`<ui-card variant="border" shadow="false" heading="Missing or unclear">
      <ui-alert color="warning" variant="soft">${x.missing.join(" · ")}</ui-alert>
      ${
        x.clarification
          ? html`<ui-text size="sm" weight="medium">Clarification request — drafted, not sent</ui-text>
              <ui-mockup-window variant="bordered">
                <ui-flex direction="col" gap="2" padding="4">
                  ${x.clarification
                    .split(/\n{2,}/)
                    .map(
                      (p) =>
                        html`<ui-text size="sm"
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
    return html`<ui-card variant="border" shadow="false" heading="Owner, backup and deadline">
      <ui-text size="xs" color="muted">Suggested by the assignment rules: ${x.assignment.rule}.</ui-text>
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
          <ui-text size="sm" weight="medium">Quote deadline</ui-text>
          <ui-text size="sm">${full(x.assignment.deadline)}</ui-text>
          <ui-text size="xs" color="muted">A reminder is scheduled before it.</ui-text>
        </ui-flex>
      </ui-grid>
    </ui-card>`;
  }

  private _ack(m: InboxMessage, x: ExtractionResult) {
    const a = x.acknowledgement;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Acknowledgement draft</span>
        <ui-badge size="sm" variant="soft" .color=${m.acknowledgedAt ? "success" : a.manual ? "warning" : "neutral"}
          >${m.acknowledgedAt ? `Sent once · ${full(m.acknowledgedAt)}` : a.manual ? "Send by hand" : "Sent once on create"}</ui-badge
        >
      </ui-flex>
      <ui-mockup-window variant="filled">
        <ui-flex direction="col" gap="2" padding="4">
          <ui-text size="xs" weight="bold" color="primary" uppercase>Golden Sea for Trading & Marketing</ui-text>
          <ui-text size="sm" weight="semibold">${a.subject}</ui-text>
          ${a.body
            .split(/\n{2,}/)
            .map(
              (p) =>
                html`<ui-text size="sm"
                  >${p.split("\n").map((l, i) => html`${i ? html`<br />` : nothing}${l}`)}</ui-text
                >`,
            )}
        </ui-flex>
      </ui-mockup-window>
      <ui-text size="xs" color="muted"
        >Template: ${a.template}.
        ${a.manual ? "WhatsApp / form source: the owner sends it — the system never messages the customer by itself here." : "Sent once from the approved template — never twice, even if the email is re-processed."}</ui-text
      >
    </ui-card>`;
  }

  private _createBar(m: InboxMessage, x: ExtractionResult) {
    if (m.createdCase)
      return html`<ui-alert color="success" variant="soft">
        Case ${m.createdCase.caseId} created from this message and linked to it.
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="sm" .href=${`/collections/cases/${m.createdCase.id}/rfqs`} color="primary"
            >Send supplier RFQs</ui-button
          >
          <ui-button size="sm" variant="soft" .href=${`/collections/cases/${m.createdCase.id}`}>Open case</ui-button>
        </ui-flex>
      </ui-alert>`;
    const flagged = x.lines.filter((l) => l.flag).length;
    const owner =
      this.users.find((u) => u.value === (this.owner[m.id] ?? x.assignment.owner))?.label ?? x.assignment.ownerName;
    return html`<ui-card variant="border" shadow="false" heading="Create the case">
        <ui-text size="sm"
          >${x.caseType === "service" ? "Service case" : "RFQ case"} for <strong>${x.customerName}</strong> with
          ${x.lines.length}
          line${x.lines.length === 1 ? "" : "s"}${flagged ? ` (${flagged} flagged for clarification)` : ""}, owner
          <strong>${owner}</strong>. The original message stays linked to it.</ui-text
        >
        <ui-flex slot="actions" gap="2" wrap>
          <ui-button size="sm" variant="ghost" @click=${() => this._review(m, "not-related")}>Not an RFQ</ui-button>
          <ui-button
            size="sm"
            color="primary"
            ?disabled=${this.busy === "create"}
            @click=${() => (this.confirming = true)}
            >Create case</ui-button
          >
        </ui-flex>
      </ui-card>
      <ui-modal heading="Create this case?" .open=${this.confirming} @ui-close=${() => (this.confirming = false)}>
        <ui-flex direction="col" gap="2">
          <ui-text size="sm"
            >Creates a ${x.caseType === "service" ? "service" : "RFQ"} case for
            <strong>${x.customerName}</strong> ${x.newCustomer ? "(new customer record)" : ""} with ${x.lines.length}
            line${x.lines.length === 1 ? "" : "s"} exactly as drafted, owner <strong>${owner}</strong>, deadline
            ${full(x.assignment.deadline)}.</ui-text
          >
          <ui-text size="sm"
            >${x.acknowledgement.manual ? "The acknowledgement is yours to send by hand." : "The acknowledgement is sent once, from the approved template."}
            ${flagged ? " Flagged lines stay “Clarification needed” until the customer answers." : ""}</ui-text
          >
        </ui-flex>
        <ui-button slot="actions" variant="ghost" @click=${() => (this.confirming = false)}>Cancel</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => this._create(m)}>Create case</ui-button>
      </ui-modal>`;
  }

  private _matchCard(m: InboxMessage) {
    const live = this.matched[m.id];
    const dup = this.duplicate[m.id]?.match;
    const result = live ?? dup;
    const st = m.status;
    if (st === "New" && !result)
      return html`<ui-card variant="dash" shadow="false" heading="Match this message">
        ${
          this.busy === "match"
            ? html`<ui-flex gap="3" align="center"
                ><ui-loading variant="dots" color="primary"></ui-loading
                ><ui-text size="sm"
                  >Looking for a reference, the thread, identical files and the sender…</ui-text
                ></ui-flex
              >`
            : html`<ui-text size="sm" color="muted"
                >Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their
                files. Below 85% a person decides.</ui-text
              >`
        }
        <ui-button
          slot="actions"
          size="sm"
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
      return html`<ui-card variant="border" shadow="false">
        <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap
          ><span>Needs a person</span>${this._conf(conf)}</ui-flex
        >
        <ui-alert color="warning" variant="soft">Uncertain match — not linked automatically.</ui-alert>
        <ui-list framed="false" .items=${basis.map((b) => ({ heading: b }))}></ui-list>
        <ui-flex direction="col" gap="2">
          ${candidates.map(
            (c) =>
              html`<ui-flex justify="between" align="center" gap="2" wrap>
                <ui-flex direction="col" gap="0" shrink>
                  <ui-text size="sm" weight="medium">${c.caseId} ${this._conf(c.confidence)}</ui-text>
                  <ui-text size="xs" color="muted">${c.reason}</ui-text>
                </ui-flex>
                <ui-button
                  size="sm"
                  color="primary"
                  variant="soft"
                  ?disabled=${this.busy === "review"}
                  @click=${() => this._review(m, "link", c.case)}
                  >Link to ${c.caseId}</ui-button
                >
              </ui-flex>`,
          )}
        </ui-flex>
        <ui-flex slot="actions" gap="2">
          <ui-button size="sm" variant="ghost" @click=${() => this._review(m, "not-related")}>Not related</ui-button>
        </ui-flex>
      </ui-card>`;
    }
    if (st === "Ignored")
      return html`<ui-alert color="info" variant="soft"
        >Marked not related${match?.reviewedBy ? ` by ${match.reviewedBy}` : ""}.</ui-alert
      >`;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>${duplicate ? "Duplicate detected" : "Reply matched"}</span>
        ${this._conf(conf)}
      </ui-flex>
      ${
        duplicate
          ? html`<ui-alert color="info" variant="soft"
              >No new case —
              ${caseRef?.caseId ? `already linked to ${caseRef.caseId}` : "kept with the original message"}. No second
              acknowledgement.</ui-alert
            >`
          : html`<ui-alert color="success" variant="soft"
              >Matched to
              ${caseRef?.caseId ?? "the case"}${match?.reference ? ` by reference ${match.reference}` : ""}${match?.reviewedBy ? ` · confirmed by ${match.reviewedBy}` : ""}.</ui-alert
            >`
      }
      <ui-list framed="false" .items=${basis.map((b) => ({ heading: b }))}></ui-list>
      ${
        caseRef
          ? html`<ui-flex slot="actions" gap="2" wrap>
              <ui-button size="sm" variant="soft" .href=${`/collections/cases/${caseRef.id}/rfqs`}
                >Supplier RFQs</ui-button
              >
              <ui-button size="sm" color="primary" .href=${`/collections/cases/${caseRef.id}`}
                >Open ${caseRef.caseId}</ui-button
              >
            </ui-flex>`
          : nothing
      }
    </ui-card>`;
  }

  private _detail(m: InboxMessage | undefined) {
    if (!m)
      return html`<ui-card variant="border" shadow="false" heading="No message selected"
        ><ui-text size="sm" color="muted">Pick a message on the left.</ui-text></ui-card
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
              ? html`<ui-alert color="success" variant="soft"
                  >Case ${m.createdCase.caseId} was created from this message.
                  <ui-button slot="actions" size="sm" .href=${`/collections/cases/${m.createdCase.id}`}
                    >Open case</ui-button
                  ></ui-alert
                >`
              : m.status === "Ignored"
                ? html`<ui-alert color="info" variant="soft">Marked “not an RFQ”.</ui-alert>`
                : this._extractPrompt(m)
          : this._matchCard(m)
      }
    </ui-flex>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
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
