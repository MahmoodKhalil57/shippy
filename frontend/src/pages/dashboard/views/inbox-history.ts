import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { HistoryPayload, HistoryReviewItem } from "../../../cms/endpoints/sourcing.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import type { Access } from "../app.ts";
import type { ViewProps } from "../views.ts";
import { toast } from "../shared.ts";
import "../../../components/index.ts";

/**
 * Inbox history (`/inbox-history`): the deck's "We organise your past" moment. Every mailbox is
 * scanned (dry run) and de-duplicated; "Organise" turns years of emails into customers (ship
 * managers), vessels (IMO, fleet, ports), suppliers (who quoted what) and dated prices — even
 * where no PO followed. What the organiser is unsure of waits in a review queue, and nothing is
 * saved before management (Karim Balbaa) approves the import. Logic: src/cms/endpoints/sourcing.ts.
 */

type Tone = "success" | "warning" | "error" | "info" | "neutral";

const n = (v: number) => v.toLocaleString("en-US");
const pct = (c: number) => `${Math.round(c * 100)}%`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const day = (v: string) => (v ? DAY.format(new Date(v)) : "");

const STEPS = ["Connect mailboxes", "Scan (dry run)", "De-duplicate", "Organise", "Review uncertain", "Approve import"];
const ORGANISE_PHASES = [
  "Reading 30,625 business emails and 21,715 attachments…",
  "Finding ship managers and owners…",
  "Matching vessels by IMO, fleet and ports…",
  "Learning which supplier quoted what…",
  "Dating every price — with or without a PO…",
];

const KIND_TONE: Record<string, Tone> = {
  Supplier: "info",
  Vessel: "info",
  Customer: "neutral",
  Price: "warning",
  Confidential: "error",
};

@customElement("gs-inbox-history")
export class GsInboxHistory extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: ViewProps["user"];

  @state() private data: HistoryPayload | null = null;
  @state() private error = "";
  @state() private phase = -1;
  @state() private confirming = false;
  @state() private busy = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<HistoryPayload>("/inbox-history");
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _organise() {
    this.busy = "organise";
    try {
      const request = api.post<HistoryPayload>("/inbox-history/organise");
      for (let i = 0; i < ORGANISE_PHASES.length; i++) {
        this.phase = i;
        await wait(450);
      }
      this.data = await request;
      toast("History organised — uncertain items are waiting for you");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.phase = -1;
      this.busy = "";
    }
  }

  private async _decide(item: HistoryReviewItem, decision: "confirm" | "reject") {
    try {
      this.data = await api.post<HistoryPayload>(`/inbox-history/review/${encodeURIComponent(item.id)}`, { decision });
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _approve() {
    this.confirming = false;
    this.busy = "approve";
    try {
      this.data = await api.post<HistoryPayload>("/inbox-history/approve");
      toast("Import approved — customers, vessels, suppliers and dated prices saved");
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private _step(d: HistoryPayload) {
    if (d.approved) return 5;
    if (d.organised) return d.pending ? 4 : 5;
    return 3;
  }

  /* ---------------------------------------------------------------- parts */

  private _header(d: HistoryPayload) {
    return html`<ui-flex justify="between" align="end" gap="4" wrap>
      <ui-flex direction="col" gap="1" shrink>
        <ui-text variant="label-md" color="muted" uppercase>Sourcing desk · your history</ui-text>
        <ui-heading level="1" variant="page">Inbox history</ui-heading>
        <ui-text color="muted">We organise your past, not just your future: every inbox, every year.</ui-text>
      </ui-flex>
      <ui-flex gap="2" wrap>
        ${
          d.organised
            ? html`<ui-badge color="success" variant="soft" icon="success">Organised</ui-badge>`
            : html`<ui-button
                size="sm"
                color="primary"
                ?disabled=${this.busy === "organise"}
                @click=${() => this._organise()}
                ><ui-icon name="sparkles" size="sm"></ui-icon>Organise</ui-button
              >`
        }
      </ui-flex>
    </ui-flex>`;
  }

  private _progress(d: HistoryPayload) {
    return html`<ui-card variant="border" shadow="false" heading="Import progress">
      <ui-steps scrollable .current=${this._step(d)} .items=${STEPS.map((label) => ({ label }))}></ui-steps>
      <ui-text variant="body-sm" color="muted"
        >Status:
        ${d.approved ? `imported · approved by ${d.approvedBy}` : d.organised ? (d.pending ? `${d.pending} uncertain item${d.pending > 1 ? "s" : ""} to review` : "waiting for management's approval") : "dry run ready — nothing has been imported"}</ui-text
      >
    </ui-card>`;
  }

  private _mailboxes(d: HistoryPayload) {
    const columns: TableColumn[] = [
      {
        key: "mailbox",
        label: "Mailbox",
        render: (m) => html`<ui-text variant="label-lg">${m.mailbox}</ui-text>`,
      },
      {
        key: "provider",
        label: "Source",
        render: (m) => html`<ui-badge size="sm" variant="ghost">${m.provider}</ui-badge>`,
      },
      { key: "years", label: "Years", render: (m) => html`<ui-text variant="body-md">${m.from}–${m.to}</ui-text>` },
      {
        key: "emails",
        label: "Messages",
        render: (m) => html`<ui-text variant="body-md" align="end">${n(m.emails as number)}</ui-text>`,
      },
      {
        key: "attachments",
        label: "Attachments",
        render: (m) => html`<ui-text variant="body-md" align="end">${n(m.attachments as number)}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Mailboxes imported</span>
        <ui-badge size="sm" variant="soft">${n(d.scanned)} messages · 2019–2026</ui-badge>
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >All of Golden Sea's mailboxes and WhatsApp exports, read in a dry run first — nothing is saved before
        approval.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.mailboxes as unknown as Record<string, unknown>[]}></ui-table>
      <ui-chart
        kind="bars"
        label="Messages per year"
        .labels=${d.perYear.labels}
        .series=${[{ name: "Messages", values: d.perYear.values }]}
        .format=${(v: number) => n(Math.round(v))}
      ></ui-chart>
    </ui-card>`;
  }

  private _dedup(d: HistoryPayload) {
    return html`<ui-card variant="border" shadow="false" heading="De-duplication">
      <ui-text variant="body-md"
        >The same email often sits in three mailboxes. Each message is kept once, with all its copies linked.</ui-text
      >
      <ui-flex direction="col" gap="3">
        ${d.dedup.map(
          (x) =>
            html`<ui-flex direction="col" gap="1">
              <ui-flex justify="between" gap="2"
                ><ui-text variant="body-md">${x.label}</ui-text
                ><ui-text variant="title-sm">− ${n(x.count)}</ui-text></ui-flex
              >
              <ui-progress
                width="full"
                color="neutral"
                .value=${x.count}
                .max=${d.scanned}
                .label=${x.label}
              ></ui-progress>
            </ui-flex>`,
        )}
      </ui-flex>
      <ui-divider></ui-divider>
      <ui-flex justify="between" gap="2" wrap>
        <ui-text variant="title-sm">Business messages kept</ui-text>
        <ui-text variant="title-lg" emphasized color="primary">${n(d.kept)}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _scattered() {
    if (this.phase >= 0)
      return html`<ui-card variant="border" shadow="false" heading="Organising your history">
        <ui-flex gap="3" align="center">
          <ui-loading variant="dots" color="primary" label="Organising"></ui-loading>
          <ui-text variant="body-md">${ORGANISE_PHASES[this.phase]}</ui-text>
        </ui-flex>
        <ui-progress width="full" color="primary" .value=${this.phase + 1} .max=${ORGANISE_PHASES.length}></ui-progress>
      </ui-card>`;
    return html`<ui-card variant="dash" shadow="false" heading="Years of emails, RFQs, offers and quotes · scattered">
      <ui-text variant="body-md" color="muted"
        >Press Organise: the AI reads the kept messages and builds your customers, vessels, suppliers and dated prices.
        Anything it isn't sure of comes to you first.</ui-text
      >
      <ui-button
        slot="actions"
        color="primary"
        size="sm"
        ?disabled=${this.busy === "organise"}
        @click=${() => this._organise()}
        ><ui-icon name="sparkles" size="sm"></ui-icon>Organise</ui-button
      >
    </ui-card>`;
  }

  private _totals(d: HistoryPayload) {
    const tile = (label: string, value: number, note: string) =>
      html`<ui-card variant="border" size="sm" shadow="false">
        <ui-flex direction="col" gap="1">
          <ui-text variant="body-md" color="muted">${label}</ui-text>
          <ui-text variant="headline-md" leading="tight">${n(value)}</ui-text>
          <ui-text variant="body-sm" color="muted">${note}</ui-text>
        </ui-flex>
      </ui-card>`;
    return html`<ui-grid fit="xs" gap="4">
      ${tile("Customers", d.totals.customers, "ship managers & owners")}
      ${tile("Vessels", d.totals.vessels, "IMO · fleet · ports")}
      ${tile("Suppliers", d.totals.suppliers, "who quoted what")}
      ${tile("Dated prices", d.totals.prices, `${n(d.totals.pricesWithoutPo)} with no PO`)}
    </ui-grid>`;
  }

  private _newBadge(known: boolean) {
    return known ? nothing : html`<ui-badge size="xs" color="accent" variant="soft">New to Odoo</ui-badge>`;
  }

  private _entities(d: HistoryPayload) {
    type Row = Record<string, unknown>;
    const customers: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Customer",
        render: (c) =>
          html`<ui-flex gap="1" align="center" wrap
            ><ui-text variant="label-lg">${c.name}</ui-text>${this._newBadge(Boolean(c.known))}</ui-flex
          >`,
      },
      { key: "country", label: "Country" },
      { key: "years", label: "Years" },
      { key: "rfqs", label: "RFQs" },
      { key: "vessels", label: "Vessels" },
    ];
    const vessels: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Vessel",
        render: (v) =>
          html`<ui-flex gap="1" align="center" wrap
            ><ui-text variant="label-lg">${v.name}</ui-text>${this._newBadge(Boolean(v.known))}</ui-flex
          >`,
      },
      { key: "imo", label: "IMO", render: (v) => html`<ui-text variant="body-sm" mono>${v.imo}</ui-text>` },
      { key: "fleet", label: "Fleet" },
      { key: "ports", label: "Ports" },
      { key: "calls", label: "Calls" },
    ];
    const suppliers: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Supplier",
        render: (s) =>
          html`<ui-flex gap="1" align="center" wrap
            ><ui-text variant="label-lg">${s.name}</ui-text>${this._newBadge(Boolean(s.known))}</ui-flex
          >`,
      },
      { key: "categories", label: "What they quote" },
      { key: "quoted", label: "Lines quoted", render: (s) => html`${n(s.quoted as number)}` },
      { key: "ordered", label: "Ordered", render: (s) => html`${n(s.ordered as number)}` },
    ];
    const prices: TableColumn<Row>[] = [
      { key: "item", label: "Item", render: (p) => html`<ui-text variant="label-lg">${p.item}</ui-text>` },
      { key: "supplier", label: "Supplier" },
      {
        key: "price",
        label: "Price",
        render: (p) =>
          d.canSeePrices && typeof p.price === "number"
            ? html`<ui-text variant="body-md">${p.currency} ${n(p.price)} / ${p.per}</ui-text>`
            : html`<ui-text variant="body-sm" color="muted">hidden for your role</ui-text>`,
      },
      { key: "quotedAt", label: "Quoted", render: (p) => html`${day(String(p.quotedAt))}` },
      {
        key: "ordered",
        label: "PO",
        render: (p) =>
          p.ordered
            ? html`<ui-badge size="xs" variant="soft" color="success">Ordered</ui-badge>`
            : html`<ui-badge size="xs" variant="soft">No PO — still remembered</ui-badge>`,
      },
    ];
    const card = (heading: string, sub: string, columns: TableColumn<Row>[], rows: unknown[]) =>
      html`<ui-card variant="border" shadow="false" .heading=${heading}>
        <ui-text variant="body-sm" color="muted">${sub}</ui-text>
        <ui-table size="sm" .columns=${columns} .rows=${rows as Row[]}></ui-table>
      </ui-card>`;
    return html`<ui-grid fit="lg" gap="4">
      ${card("Customers — ship managers", `${n(d.totals.customers)} found · top 5 by RFQs`, customers, d.customers)}
      ${card("Vessels — IMO, fleet, ports", `${n(d.totals.vessels)} found · matched by IMO, renames kept`, vessels, d.vessels)}
      ${card("Suppliers — who quoted what", `${n(d.totals.suppliers)} found · incl. ones you never ordered from`, suppliers, d.suppliers)}
      ${card("Dated prices — even with no PO", `${n(d.totals.prices)} prices, each with its date and validity`, prices, d.prices)}
    </ui-grid>`;
  }

  private _review(d: HistoryPayload) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center"
        >Uncertain items<ui-badge size="sm" variant="soft" .color=${d.pending ? "warning" : "success"}
          >${d.pending ? `${d.pending} to review` : "all decided"}</ui-badge
        ></ui-flex
      >
      <ui-text variant="body-sm" color="muted"
        >Reviewed with you before they are saved — confirm the proposal or reject it.</ui-text
      >
      <ui-flex direction="col" gap="3">
        ${d.review.map(
          (r) =>
            html`<ui-box border rounded="box" padding="3" .surface=${r.decision ? "base-200" : "base-100"}>
              <ui-flex direction="col" gap="2">
                <ui-flex justify="between" align="center" gap="2" wrap>
                  <ui-flex gap="2" align="center" wrap>
                    <ui-badge size="sm" variant="soft" .color=${KIND_TONE[r.kind] ?? "neutral"}>${r.kind}</ui-badge>
                    <ui-text variant="title-sm">${r.question}</ui-text>
                  </ui-flex>
                  <ui-badge size="sm" variant="outline">${pct(r.confidence)}</ui-badge>
                </ui-flex>
                <ui-text variant="body-md"><strong>Proposal:</strong> ${r.proposal}</ui-text>
                <ui-text variant="body-sm" color="muted"
                  >${r.mailbox} · ${day(r.receivedAt)} · “${r.subject}” from ${r.fromName}</ui-text
                >
                ${
                  r.decision
                    ? html`<ui-flex gap="2" align="center" wrap>
                        <ui-badge size="sm" variant="soft" .color=${r.decision === "Confirmed" ? "success" : "neutral"}
                          >${r.decision}${r.reviewedBy ? ` by ${r.reviewedBy}` : ""}</ui-badge
                        >
                        ${
                          d.approved
                            ? nothing
                            : html`<ui-button
                                size="xs"
                                variant="ghost"
                                @click=${() => this._decide(r, r.decision === "Confirmed" ? "reject" : "confirm")}
                                >Change</ui-button
                              >`
                        }
                      </ui-flex>`
                    : html`<ui-flex gap="2" wrap>
                        <ui-button size="sm" color="primary" variant="soft" @click=${() => this._decide(r, "confirm")}
                          >Confirm</ui-button
                        >
                        <ui-button size="sm" variant="ghost" @click=${() => this._decide(r, "reject")}
                          >Reject</ui-button
                        >
                      </ui-flex>`
                }
              </ui-flex>
            </ui-box>`,
        )}
      </ui-flex>
    </ui-card>`;
  }

  private _approval(d: HistoryPayload) {
    if (d.approved)
      return html`<ui-card variant="border" shadow="false" heading="Import approval">
        <ui-alert color="success" variant="soft"
          >Approved by ${d.approvedBy}. Your history is searchable from day one: ${n(d.totals.customers)} customers,
          ${n(d.totals.vessels)} vessels, ${n(d.totals.suppliers)} suppliers and ${n(d.totals.prices)} dated
          prices.</ui-alert
        >
        ${
          d.created.length
            ? html`<ui-text variant="label-lg">New records (examples)</ui-text>
                <ui-flex gap="2" wrap>
                  ${d.created.map((c) => html`<ui-button size="xs" variant="soft" .href=${c.href}>${c.kind}: ${c.name}</ui-button>`)}
                </ui-flex>`
            : nothing
        }
      </ui-card>`;
    const blocked = !d.organised
      ? "Organise the history first."
      : d.pending
        ? `${d.pending} uncertain item${d.pending > 1 ? "s" : ""} still need a decision.`
        : "";
    return html`<ui-card variant="border" shadow="false" heading="Import approval">
      <ui-text variant="body-md"
        >Only management approves the import — nothing from the history becomes a record before Karim Balbaa says yes.
        Confidential threads stay out.</ui-text
      >
      ${
        d.canApprove
          ? html`${blocked ? html`<ui-alert color="warning" variant="soft">${blocked}</ui-alert>` : nothing}
              <ui-flex slot="actions" gap="2">
                <ui-button
                  size="sm"
                  color="primary"
                  ?disabled=${Boolean(blocked) || this.busy === "approve"}
                  @click=${() => (this.confirming = true)}
                  ><ui-icon name="check" size="sm"></ui-icon>Approve import</ui-button
                >
              </ui-flex>`
          : html`<ui-alert color="info" variant="soft"
              >Waiting for Karim Balbaa (management).
              ${blocked || "Everything is reviewed — it's ready for his approval."}</ui-alert
            >`
      }
      <ui-modal
        heading="Approve the history import?"
        .open=${this.confirming}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-text variant="body-md"
          >Saves ${n(d.totals.customers)} customers, ${n(d.totals.vessels)} vessels, ${n(d.totals.suppliers)} suppliers
          and ${n(d.totals.prices)} dated prices from ${n(d.kept)} de-duplicated messages, with your ${d.review.length}
          decisions on the uncertain items. Rejected and confidential items are left out.</ui-text
        >
        <ui-button slot="actions" variant="ghost" @click=${() => (this.confirming = false)}>Cancel</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => this._approve()}>Approve import</ui-button>
      </ui-modal>
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._header(d)} ${this._progress(d)}
      <ui-grid fit="md" gap="4">${this._mailboxes(d)} ${this._dedup(d)}</ui-grid>
      ${d.organised ? html`${this._totals(d)} ${this._entities(d)} ${this._review(d)}` : this._scattered()}
      ${this._approval(d)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-inbox-history": GsInboxHistory;
  }
}
