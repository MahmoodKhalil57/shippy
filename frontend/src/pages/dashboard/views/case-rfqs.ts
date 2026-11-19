import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { CaseRfqRow, CaseRfqsPayload, ReplyEvent, RfqPlan } from "../../../cms/endpoints/sourcing.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import type { TimelineItem } from "../../../components/primitives/data/timeline.ts";
import type { Access } from "../app.ts";
import type { ViewProps } from "../views.ts";
import { toast } from "../shared.ts";
import "../../../components/index.ts";

/**
 * Case tab "Supplier RFQs" (`/collections/cases/<id>/rfqs`): the case's lines go out to
 * suppliers — split by category or as the full list — in an anonymised RFQ (no client, vessel or
 * customer files). Statuses, the reminder schedule (stops on reply, escalation after two
 * reminders), and the presenter's "Simulate replies": replies matched by reference even with a
 * changed subject, a new supplier saved on the spot with its dated price, offers created for the
 * Compare tab, and anything uncertain left for a person. Logic: src/cms/endpoints/sourcing.ts.
 */

type Tone = "success" | "warning" | "error" | "info" | "neutral";

const STATUS: Record<string, Tone> = {
  Draft: "neutral",
  Sent: "info",
  "Awaiting reply": "warning",
  "Partial reply": "warning",
  "Clarification needed": "warning",
  Replied: "success",
  "Revised offer received": "success",
  Declined: "neutral",
  "No response": "error",
};
const OPEN = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed"];

const FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const at = (v: string) => (v ? FMT.format(new Date(v)) : "—");
const day = (v: string) => (v ? DAY.format(new Date(v)) : "—");
const pct = (c: number) => `${Math.round(c * 100)}%`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

@customElement("gs-case-rfqs")
export class GsCaseRfqs extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: ViewProps["user"];
  @property() slug = "cases";
  @property() docId = "";

  @state() private data: CaseRfqsPayload | null = null;
  @state() private error = "";
  @state() private mode: "split" | "full" = "split";
  @state() private chosen: number[] | null = null;
  @state() private plan: RfqPlan | null = null;
  @state() private previewAt = 0;
  @state() private confirming = false;
  @state() private busy = "";
  @state() private events: ReplyEvent[] = [];
  @state() private shown = 0;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<CaseRfqsPayload>(`/sourcing/cases/${encodeURIComponent(this.docId)}`);
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  /** Lines picked for the next RFQs: by default, those not yet asked of anyone. */
  private get picked(): number[] {
    if (this.chosen) return this.chosen;
    const d = this.data;
    if (!d) return [];
    const sendable = d.lines.filter((l) => !l.held);
    const fresh = sendable.filter((l) => !l.rfqs.length && !l.offers);
    return (fresh.length ? fresh : sendable).map((l) => l.lineNo);
  }

  private _toggle(n: number, on: boolean) {
    const set = new Set(this.picked);
    if (on) set.add(n);
    else set.delete(n);
    this.chosen = [...set].sort((a, b) => a - b);
    this.plan = null;
  }

  private async _draft() {
    this.busy = "plan";
    try {
      const [plan] = await Promise.all([
        api.post<RfqPlan>(`/sourcing/cases/${encodeURIComponent(this.docId)}/plan`, {
          mode: this.mode,
          lineNos: this.picked,
        }),
        wait(500),
      ]);
      this.plan = plan;
      this.previewAt = 0;
      if (!plan.drafts.length)
        toast("Nothing new to send — every picked line was already asked of these suppliers", "info");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private _dropDraft(i: number) {
    if (!this.plan) return;
    const drafts = this.plan.drafts.filter((_, j) => j !== i);
    this.plan = { ...this.plan, drafts };
    this.previewAt = Math.min(this.previewAt, Math.max(0, drafts.length - 1));
  }

  private async _send() {
    const plan = this.plan;
    this.confirming = false;
    if (!plan) return;
    this.busy = "send";
    try {
      const r = await api.post<{ sent: { reference: string }[] }>(
        `/sourcing/cases/${encodeURIComponent(this.docId)}/send`,
        {
          mode: plan.mode,
          dueAt: plan.dueAt,
          drafts: plan.drafts.map((d) => ({ supplier: d.supplier, lineNos: d.lineNos, category: d.category })),
        },
      );
      toast(
        `${r.sent.length} supplier RFQ${r.sent.length === 1 ? "" : "s"} sent — replies will be matched automatically`,
      );
      this.plan = null;
      this.chosen = null;
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _simulate() {
    this.busy = "simulate";
    this.events = [];
    this.shown = 0;
    try {
      const r = await api.post<CaseRfqsPayload & { events: ReplyEvent[] }>(
        `/sourcing/cases/${encodeURIComponent(this.docId)}/simulate-replies`,
      );
      if (!r.events.length) {
        toast("No supplier RFQs are waiting for a reply — send RFQs first", "info");
        return;
      }
      this.events = r.events;
      for (let i = 1; i <= r.events.length; i++) {
        await wait(650);
        this.shown = i;
      }
      const { events: _events, ...payload } = r;
      this.data = payload;
      toast(`${r.events.length} supplier event${r.events.length === 1 ? "" : "s"} — offers are on the Compare tab`);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _remind(r: CaseRfqRow) {
    try {
      const { event } = await api.post<{ event: ReplyEvent }>(`/sourcing/rfqs/${encodeURIComponent(r.id)}/remind`);
      toast(`${r.reference}: ${event.detail}`, event.outcome === "Escalated" ? "warning" : "success");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _review(id: string, decision: "link" | "not-related", caseId?: string) {
    try {
      await api.post(`/inbox/${encodeURIComponent(id)}/review`, { decision, case: caseId });
      toast(decision === "link" ? "Confirmed — your decision is in the audit log" : "Marked not related");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  /* ---------------------------------------------------------------- parts */

  private _stats(d: CaseRfqsPayload) {
    const tile = (label: string, value: number, note: string, color?: Tone) =>
      html`<ui-card size="sm">
        <ui-flex direction="col" gap="1">
          <ui-text variant="body-md" color="muted" truncate>${label}</ui-text>
          <ui-text
            variant="headline-md"
            leading="tight"
            .color=${color && color !== "neutral" && color !== "info" ? color : undefined}
            >${value}</ui-text
          >
          <ui-text variant="body-sm" color="muted">${note}</ui-text>
        </ui-flex>
      </ui-card>`;
    return html`<ui-grid fit="xs" gap="4">
      ${tile("Supplier RFQs", d.counts.total, `from 1 customer RFQ · ${d.lines.length} lines`)}
      ${tile("Replied", d.counts.replied, "offers captured automatically", "success")}
      ${tile("Waiting", d.counts.waiting, "reminders scheduled", d.counts.waiting ? "warning" : undefined)}
      ${tile("Declined · no response", d.counts.closed, d.counts.escalated ? `${d.counts.escalated} escalated to the owner` : "none escalated", d.counts.escalated ? "error" : undefined)}
    </ui-grid>`;
  }

  private _table(d: CaseRfqsPayload) {
    const columns: TableColumn<CaseRfqRow & Record<string, unknown>>[] = [
      {
        key: "reference",
        label: "Reference",
        render: (r) => html`<ui-text variant="label-md" emphasized mono>${r.reference}</ui-text>`,
      },
      {
        key: "supplier",
        label: "Supplier",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-flex gap="1" align="center" wrap>
              <ui-link variant="hover" .href=${`/collections/suppliers/${r.supplier.id}`}
                ><ui-text variant="label-lg">${r.supplier.name}</ui-text></ui-link
              >
              ${r.supplier.isNew ? html`<ui-tag tone="primary">New supplier</ui-tag>` : nothing}
            </ui-flex>
            <ui-text variant="body-sm" color="muted"
              >${[r.supplier.city, r.category].filter(Boolean).join(" · ")}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "lineNos",
        label: "Lines",
        render: (r) =>
          html`<ui-flex gap="1" wrap>${r.lineNos.map((n) => html`<ui-tag variant="outline">L${n}</ui-tag>`)}</ui-flex>`,
      },
      {
        key: "sentAt",
        label: "Sent · due",
        render: (r) =>
          html`<ui-flex direction="col" gap="0"
            ><ui-text variant="body-sm">${r.sentAt ? at(r.sentAt) : "not invited"}</ui-text
            ><ui-text variant="body-sm" color="muted">due ${at(r.dueAt)}</ui-text></ui-flex
          >`,
      },
      {
        key: "status",
        label: "Status",
        render: (r) => html`<ui-tag .tone=${STATUS[r.status] ?? "neutral"}>${r.status}</ui-tag>`,
      },
      {
        key: "reminders",
        label: "Reminders",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${r.reminders} of 2</ui-text>
            <ui-text variant="body-sm" .color=${r.escalated ? "error" : "muted"}
              >${r.escalated ? "escalated" : OPEN.includes(r.status) ? (r.nextReminderAt ? `next ${at(r.nextReminderAt)}` : "—") : "stopped"}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "lastEvent",
        label: "Latest",
        render: (r) => html`<ui-text variant="body-sm" clamp="2">${r.lastEvent}</ui-text>`,
      },
      {
        key: "actions",
        label: "",
        render: (r) =>
          OPEN.includes(r.status) && !(r.escalated && r.reminders >= 2)
            ? html`<ui-button size="xs" variant="tonal" @click=${() => this._remind(r)}>Remind now</ui-button>`
            : nothing,
      },
    ];
    return html`<ui-card .count=${d.rfqs.length}>
      <span slot="heading">Supplier RFQs</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-button size="xs" color="primary" ?disabled=${this.busy === "simulate"} @click=${() => this._simulate()}
          ><ui-icon name="sync" size="sm"></ui-icon>Simulate replies</ui-button
        ></ui-flex
      >
      <ui-text variant="body-sm" color="muted"
        >Each supplier sees only the lines they can quote — never the client, the vessel or the client's files.</ui-text
      >
      ${
        d.rfqs.length
          ? html`<ui-table
              size="sm"
              hover
              .columns=${columns}
              .rows=${d.rfqs as unknown as Record<string, unknown>[]}
            ></ui-table>`
          : html`<ui-empty-state size="sm">No supplier RFQs yet — draft them below.</ui-empty-state>`
      }
    </ui-card>`;
  }

  private _arrivals() {
    if (!this.events.length) return nothing;
    const tone: Record<ReplyEvent["outcome"], Tone> = {
      Replied: "success",
      Declined: "neutral",
      "Reminder sent": "warning",
      Escalated: "error",
      "New supplier saved": "info",
    };
    const items: TimelineItem[] = this.events.slice(0, this.shown).map((e) => ({
      done: true,
      box: "end",
      end: html`<ui-flex direction="col" gap="1">
        <ui-flex gap="2" align="center" wrap>
          <ui-tag .tone=${tone[e.outcome]}>${e.outcome}</ui-tag>
          <ui-text variant="title-sm">${e.supplier}</ui-text>
          <ui-text variant="body-sm" mono color="muted">${e.reference}</ui-text>
        </ui-flex>
        ${e.subject ? html`<ui-text variant="body-sm" color="muted">Subject: “${e.subject}”</ui-text>` : nothing}
        <ui-text variant="body-sm">${e.detail}</ui-text>
      </ui-flex>`,
    }));
    return html`<ui-card heading="Replies arriving">
      <ui-timeline direction="vertical" compact .items=${items}></ui-timeline>
      ${this.shown < this.events.length ? html`<ui-loading color="primary" label="More replies"></ui-loading>` : nothing}
    </ui-card>`;
  }

  private _reviewQueue(d: CaseRfqsPayload) {
    if (!d.review.length) return nothing;
    return html`<ui-card .count=${d.review.length} count-tone="warning">
      <span slot="heading">Needs a person</span>
      <ui-text variant="body-sm" color="muted"
        >Anything the AI isn't sure of waits here — nothing uncertain is applied on its own.</ui-text
      >
      <ui-flex direction="col" gap="4">
        ${d.review.map(
          (r) =>
            html`<ui-box border rounded="box" padding="3">
              <ui-flex direction="col" gap="2">
                <ui-flex justify="between" align="center" gap="2" wrap>
                  <ui-flex direction="col" gap="0" shrink>
                    <ui-text variant="title-sm">${r.fromName}: “${r.subject}”</ui-text>
                    <ui-text variant="body-sm" color="muted">${at(r.receivedAt)}</ui-text>
                  </ui-flex>
                  <ui-tag tone="warning">${pct(r.confidence)}</ui-tag>
                </ui-flex>
                ${r.basis.map((b) => html`<ui-text variant="body-sm">• ${b}</ui-text>`)}
                ${r.uncertain.map((u) => html`<ui-alert tone="warning">${u}</ui-alert>`)}
                <ui-flex gap="2" wrap>
                  ${
                    r.kind === "new-supplier"
                      ? html`<ui-button size="xs" color="primary" @click=${() => this._review(r.id, "link", d.case.id)}
                          >Confirm offer</ui-button
                        >`
                      : r.candidates.map(
                          (c) =>
                            html`<ui-button
                              size="xs"
                              .variant=${c.case === d.case.id ? "filled" : "tonal"}
                              @click=${() => this._review(r.id, "link", c.case)}
                              >Link to ${c.caseId} (${pct(c.confidence)})</ui-button
                            >`,
                        )
                  }
                  <ui-button size="xs" variant="text" @click=${() => this._review(r.id, "not-related")}
                    >Not related</ui-button
                  >
                </ui-flex>
              </ui-flex>
            </ui-box>`,
        )}
      </ui-flex>
    </ui-card>`;
  }

  private _replies(d: CaseRfqsPayload) {
    if (!d.replies.length) return nothing;
    return html`<ui-card heading="Replies matched">
      <ui-text variant="body-sm" color="muted"
        >Matched by reference, thread and sender — even when the supplier changed the subject.</ui-text
      >
      <ui-flex direction="col" gap="3">
        ${d.replies.map(
          (r) =>
            html`<ui-flex direction="col" gap="0">
              <ui-flex gap="2" align="center" wrap>
                <ui-text variant="label-lg">${r.fromName}</ui-text>
                <ui-text variant="body-sm" color="muted">“${r.subject}” · ${at(r.receivedAt)}</ui-text>
                <ui-tag tone="success">${r.reference || "linked"} · ${pct(r.confidence)}</ui-tag>
              </ui-flex>
              <ui-text variant="body-sm" color="muted">${r.basis.slice(0, 2).join(" · ")}</ui-text>
            </ui-flex>`,
        )}
      </ui-flex>
    </ui-card>`;
  }

  private _newSuppliers(d: CaseRfqsPayload) {
    if (!d.newSuppliers.length) return nothing;
    return html`<ui-card heading="New suppliers saved">
      <ui-text variant="body-sm" color="muted"
        >Saved the moment they replied — contact, category and a dated price with its validity, even without an
        order.</ui-text
      >
      <ui-grid fit="sm" gap="3">
        ${d.newSuppliers.map(
          (s) =>
            html`<ui-box border rounded="box" padding="3">
              <ui-flex direction="col" gap="2">
                <ui-flex gap="2" align="center" wrap>
                  <ui-link variant="hover" .href=${`/collections/suppliers/${s.id}`}
                    ><ui-text variant="title-sm">${s.name}</ui-text></ui-link
                  >
                  <ui-tag tone="primary">New · quoted, never ordered</ui-tag>
                </ui-flex>
                <ui-text variant="body-sm" color="muted">${s.city} · ${s.source}</ui-text>
                ${s.prices.map(
                  (p) =>
                    html`<ui-text variant="body-sm"
                      >${p.description}:
                      ${d.canSeeCosts && p.price !== undefined ? html`<strong>${p.currency} ${p.price.toLocaleString("en-US")}</strong> / ${p.per}` : html`<em>price hidden for your role</em>`}
                      · quoted ${day(p.quotedAt)} · valid to ${day(p.validUntil)}</ui-text
                    >`,
                )}
              </ui-flex>
            </ui-box>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _builder(d: CaseRfqsPayload) {
    const picked = new Set(this.picked);
    const plan = this.plan;
    const preview = plan?.drafts[this.previewAt];
    return html`<ui-card>
      <span slot="heading">Draft supplier RFQs</span>
      <ui-button-group
        slot="trailing"
        label="How to send"
        size="xs"
        .value=${this.mode}
        .options=${[
          { value: "split", label: "Split by category" },
          { value: "full", label: "Full list" },
        ]}
        @ui-change=${(e: CustomEvent<{ value: string }>) => {
          this.mode = e.detail.value as "split" | "full";
          this.plan = null;
        }}
      ></ui-button-group>
      <ui-text variant="body-sm" color="muted"
        >${this.mode === "split" ? "Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ." : "General chandlers receive every line in one RFQ."}</ui-text
      >
      <ui-grid fit="sm" gap="2">
        ${d.lines.map(
          (l) =>
            html`<ui-checkbox
              size="sm"
              .checked=${picked.has(l.lineNo)}
              ?disabled=${Boolean(l.held)}
              .label=${html`<ui-flex direction="col" gap="0">
                <ui-text variant="body-md">L${l.lineNo} · ${l.description}</ui-text>
                <ui-text variant="body-sm" .color=${l.held ? "warning" : "muted"}
                  >${l.qty} ${l.unit} ·
                  ${l.category}${l.held ? ` · held: ${l.held}` : l.rfqs.length ? ` · asked: ${l.rfqs.join(", ")}` : ""}${l.offers ? ` · ${l.offers} offer${l.offers > 1 ? "s" : ""}` : ""}</ui-text
                >
              </ui-flex>`}
              @change=${(e: Event) => this._toggle(l.lineNo, (e.target as HTMLInputElement).checked)}
            ></ui-checkbox>`,
        )}
      </ui-grid>
      <ui-flex gap="2" wrap>
        <ui-button
          size="xs"
          variant="tonal"
          ?disabled=${!picked.size || this.busy === "plan"}
          @click=${() => this._draft()}
          ><ui-icon name="sparkles" size="sm"></ui-icon
          >${this.busy === "plan" ? "Choosing suppliers…" : "Draft RFQs"}</ui-button
        >
      </ui-flex>
      ${
        plan
          ? html`<ui-divider></ui-divider>
              ${plan.held.length ? html`<ui-alert tone="warning">Held back until clarified: ${plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ")}</ui-alert>` : nothing}
              ${plan.skipped.length ? html`<ui-text variant="body-sm" color="muted">Skipped (already asked): ${plan.skipped.join(" · ")}</ui-text>` : nothing}
              <ui-flex direction="col" gap="2">
                ${plan.drafts.map(
                  (r, i) =>
                    html`<ui-flex justify="between" align="center" gap="2" wrap>
                      <ui-flex direction="col" gap="0" shrink>
                        <ui-flex gap="2" align="center" wrap>
                          <ui-tag>Draft</ui-tag>
                          <ui-text variant="title-sm">${r.supplierName}</ui-text>
                          <ui-text variant="body-sm" mono color="muted">${r.reference}</ui-text>
                        </ui-flex>
                        <ui-text variant="body-sm" color="muted"
                          >${r.category} · L${r.lineNos.join(", L")} · ${r.note}</ui-text
                        >
                      </ui-flex>
                      <ui-flex gap="1">
                        <ui-button
                          size="xs"
                          variant="text"
                          toggle
                          ?selected=${i === this.previewAt}
                          @click=${() => (this.previewAt = i)}
                          >Preview</ui-button
                        >
                        <ui-button size="xs" variant="text" @click=${() => this._dropDraft(i)}>Remove</ui-button>
                      </ui-flex>
                    </ui-flex>`,
                )}
              </ui-flex>
              ${
                preview
                  ? html`<ui-flex gap="1" wrap>
                        <ui-tag tone="success" icon="success">Client name removed</ui-tag>
                        <ui-tag tone="success" icon="success">Vessel removed</ui-tag>
                        <ui-tag tone="success" icon="success">No customer files</ui-tag>
                        <ui-tag tone="success" icon="success">Our reference only</ui-tag>
                      </ui-flex>
                      <ui-mockup-window variant="bordered">
                        <ui-flex direction="col" gap="2" padding="4">
                          <ui-text variant="body-sm" color="muted"><strong>To</strong> ${preview.preview.to}</ui-text>
                          <ui-text variant="title-sm">${preview.preview.subject}</ui-text>
                          <ui-divider></ui-divider>
                          <ui-ai-text .text=${preview.preview.body} translatable></ui-ai-text>
                        </ui-flex>
                      </ui-mockup-window>`
                  : nothing
              }
              <ui-flex justify="end" gap="2" wrap>
                <ui-button size="xs" variant="text" @click=${() => (this.plan = null)}>Discard drafts</ui-button>
                <ui-button
                  size="xs"
                  color="primary"
                  ?disabled=${!plan.drafts.length || this.busy === "send"}
                  @click=${() => (this.confirming = true)}
                  ><ui-icon name="send" size="sm"></ui-icon>Send RFQs</ui-button
                >
              </ui-flex>
              <ui-modal
                heading="Send these supplier RFQs?"
                .open=${this.confirming}
                @ui-close=${() => (this.confirming = false)}
              >
                <ui-flex direction="col" gap="2">
                  <ui-text variant="body-md"
                    >${plan.drafts.length} RFQ${plan.drafts.length === 1 ? "" : "s"} to
                    ${plan.drafts.map((r) => r.supplierName).join(", ")} — reply by ${at(plan.dueAt)}.</ui-text
                  >
                  <ui-text variant="body-md"
                    >The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon
                    as a supplier answers, and the case owner is alerted after the second.</ui-text
                  >
                </ui-flex>
                <ui-button slot="actions" variant="text" @click=${() => (this.confirming = false)}>Cancel</ui-button>
                <ui-button slot="actions" color="primary" @click=${() => this._send()}>Send RFQs</ui-button>
              </ui-modal>`
          : nothing
      }
    </ui-card>`;
  }

  private _reminders(d: CaseRfqsPayload) {
    const open = d.rfqs.filter((r) => OPEN.includes(r.status) || r.escalated);
    const steps = (r: CaseRfqRow) => {
      const done = r.schedule.filter((s) => s.state === "done").length;
      return html`<ui-flex direction="col" gap="1">
        <ui-text variant="label-lg"
          >${r.supplier.name} · <ui-text as="span" variant="body-sm" mono>${r.reference}</ui-text></ui-text
        >
        <ui-steps
          scrollable
          .tone=${r.escalated ? "error" : "primary"}
          .current=${done - 1}
          .items=${r.schedule.map((s) => ({
            label: s.label,
            supporting: s.state === "skipped" ? "not needed" : s.state === "next" ? `next · ${at(s.at)}` : at(s.at),
            state: s.state === "done" || s.state === "skipped" ? s.state : undefined,
          }))}
        ></ui-steps>
      </ui-flex>`;
    };
    return html`<ui-card heading="Reminders and escalation">
      <ui-text variant="body-md"
        >Reminder 1 after 24 h, reminder 2 after 48 h, then the case owner (${d.case.ownerName}) is alerted. Reminders
        stop the moment a supplier replies or declines.</ui-text
      >
      ${open.length ? open.map(steps) : html`<ui-empty-state size="sm">No supplier is being chased right now.</ui-empty-state>`}
    </ui-card>`;
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
    return html`<ui-flex direction="col" gap="4">
      ${this._stats(d)} ${this._table(d)} ${this._arrivals()} ${this._reviewQueue(d)}
      <ui-grid fit="md" gap="4">${this._replies(d)} ${this._newSuppliers(d)}</ui-grid>
      ${this._builder(d)} ${this._reminders(d)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-rfqs": GsCaseRfqs;
  }
}
