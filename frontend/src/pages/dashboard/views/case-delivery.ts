import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";
import {
  type CaseOps,
  type OpsDelivery,
  type OpsInvoice,
  day,
  dayTime,
  errorText,
  loadCaseOps,
  money,
  reading,
  sampleFile,
  statusColor,
  uploadEvidence,
  USERS,
} from "./o2c-shared.ts";

/**
 * Case tab "Delivery & billing" (/collections/cases/<id>/delivery): the vessel delivery plan
 * (port, ETA, agent, truck, boarding staff, launch, documents, pre-dispatch check), the agent's
 * ETA change re-planning every open drop (escalated to the owner and management), drops with
 * proof of delivery (a signed delivery note is required), backorders from late suppliers, and
 * invoicing only delivered quantities with the Egyptian e-invoice status per invoice and
 * partial payments. Data: GET /api/operations/case/:id; writes via src/cms/endpoints/operations.ts.
 */

type Dialog =
  | { kind: "eta"; loading: boolean }
  | { kind: "pod"; delivery: OpsDelivery; file: File | null; signedBy: string; shortages: string }
  | { kind: "einvoice"; invoice: OpsInvoice; taxId: string }
  | { kind: "payment"; invoice: OpsInvoice; amount: string; reference: string };

type Row = Record<string, unknown>;
type BackorderRow = CaseOps["backorders"][number] & Row;
type InvoiceRow = OpsInvoice & Row;

/** The agents' ETA emails the presenter can "receive" (mirrors ETA_UPDATES in the endpoint). */
const AGENT_EMAIL: Record<string, { from: string; subject: string; body: string; eta: string }> = {
  "gs-rfq-0133": {
    from: "ops@abuqir-marine.example",
    subject: "DOS Falcon — revised return to base",
    body: "Good morning, due to weather at the rig the DOS Falcon will now return to Abu Qir base on 22 Nov at 16:00 local slot. Please re-arrange your delivery accordingly. Regards, Abu Qir Marine Services",
    eta: "2026-11-22T16:00:00.000Z",
  },
  "gs-rfq-0142": {
    from: "ops@canallink.example",
    subject: "MV Aurora Crest — ETA update",
    body: "Dear Golden Sea, MV Aurora Crest now expected Port Said anchorage 20 Nov 22:00 (was 21 Nov 08:00). Launch to be re-booked. Rgds, Canal Link Agency",
    eta: "2026-11-20T22:00:00.000Z",
  },
};

@customElement("gs-case-delivery")
export class GsCaseDelivery extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: ViewProps["user"];
  @property() slug?: string;
  @property() docId?: string;

  @state() private data: CaseOps | null = null;
  @state() private error = "";
  @state() private busy = "";
  @state() private dialog: Dialog | null = null;
  @state() private replan: { text: string; moved: string[] } | null = null;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    if (!this.docId) return;
    try {
      this.data = await loadCaseOps(this.docId);
      this.error = "";
    } catch (e) {
      this.error = errorText(e);
    }
  }

  private async _run(key: string, fn: () => Promise<string | void>) {
    this.busy = key;
    try {
      const msg = await fn();
      await this._load();
      if (msg) toast(msg);
    } catch (e) {
      toast(errorText(e), "error");
    } finally {
      this.busy = "";
    }
  }

  /* ------------------------------------------------------------ actions */

  private async _openEta() {
    this.dialog = { kind: "eta", loading: true };
    await reading(1000);
    if (this.dialog?.kind === "eta") this.dialog = { kind: "eta", loading: false };
  }

  private _applyEta() {
    this.dialog = null;
    void this._run("eta", async () => {
      const r = await api.post<{ changed: number; moved?: string[]; text?: string; message?: string }>(
        "/operations/eta-change",
        { case: this.docId },
      );
      if (r.text) this.replan = { text: r.text, moved: r.moved ?? [] };
      return r.message ?? `ETA updated — ${r.changed} drop(s) re-planned; owner and management alerted.`;
    });
  }

  private async _confirmPod() {
    const d = this.dialog;
    if (d?.kind !== "pod") return;
    this.dialog = null;
    await this._run(`pod-${d.delivery.id}`, async () => {
      const proof = d.file ? await uploadEvidence(d.file, "Delivery note / POD", `${d.delivery.number} signed`) : null;
      await api.post("/operations/confirm-delivery", {
        delivery: d.delivery.id,
        proof,
        signedBy: d.signedBy,
        shortages: d.shortages,
      });
      return `${d.delivery.number} delivered — signed delivery note on file.`;
    });
  }

  private _invoice(delivery: OpsDelivery) {
    void this._run(`inv-${delivery.id}`, async () => {
      const r = await api.post<{ doc: { number: string } }>("/operations/invoice-delivery", { delivery: delivery.id });
      return `${r.doc.number} created from ${delivery.number} — delivered quantities only.`;
    });
  }

  private async _submitEInvoice() {
    const d = this.dialog;
    if (d?.kind !== "einvoice") return;
    this.dialog = null;
    await this._run(`einv-${d.invoice.id}`, async () => {
      await reading(900);
      const r = await api.post<{ result: string; message: string }>("/operations/einvoice", {
        invoice: d.invoice.id,
        taxId: d.taxId || undefined,
      });
      if (r.result !== "submitted") return r.message;
      await this._load();
      await reading(1200);
      const v = await api.post<{ message: string }>("/operations/einvoice", { invoice: d.invoice.id });
      return v.message;
    });
  }

  private _refreshEInvoice(inv: OpsInvoice) {
    void this._run(`einv-${inv.id}`, async () => {
      await reading(700);
      const r = await api.post<{ message: string }>("/operations/einvoice", { invoice: inv.id });
      return r.message;
    });
  }

  private _recordPayment() {
    const d = this.dialog;
    if (d?.kind !== "payment") return;
    this.dialog = null;
    void this._run(`pay-${d.invoice.id}`, async () => {
      const amount = Number(d.amount);
      if (!(amount > 0)) throw new Error("Enter the amount received.");
      await api.create("payments", {
        direction: "in",
        reference: d.reference || "TRX-",
        paidAt: new Date().toISOString(),
        amount,
        currency: d.invoice.currency,
        invoice: d.invoice.id,
        kind: amount < d.invoice.balance ? "Installment" : "Balance",
        status: "Recorded",
      });
      const left = Math.max(0, d.invoice.balance - amount);
      return `${money(amount, d.invoice.currency)} allocated to ${d.invoice.number}${left ? ` — balance ${money(left, d.invoice.currency)}` : " — paid in full"}.`;
    });
  }

  /* ------------------------------------------------------------ render */

  render() {
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const d = this.data;
    if (!d) return html`<ui-empty-state loading></ui-empty-state>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._alerts(d)} ${this._plan(d)} ${this._drops(d)} ${this._backorders(d)} ${this._invoices(d)}
      <ui-modal .heading=${this._dialogTitle()} .open=${Boolean(this.dialog)} @ui-close=${() => (this.dialog = null)}>
        ${this._dialogBody(d)}
      </ui-modal>
    </ui-flex>`;
  }

  private _heading(title: string, badge?: TemplateResult | typeof nothing, actions?: TemplateResult | typeof nothing) {
    return html`<span slot="heading">${title}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        >${badge ?? nothing}${actions ? html`<ui-flex gap="2" wrap>${actions}</ui-flex>` : nothing}</ui-flex
      >`;
  }

  private _alerts(d: CaseOps) {
    const eta = d.alerts.find((a) => /ETA change/.test(a.text));
    if (this.replan)
      return html`<ui-alert tone="warning">
        <ui-flex direction="col" gap="1">
          <strong
            >Re-planned after the agent's ETA change — escalated to ${USERS[d.case.owner] ?? d.case.owner} and Karim
            Balbaa</strong
          >
          <ui-text variant="body-md">${this.replan.text}</ui-text>
        </ui-flex>
      </ui-alert>`;
    if (eta)
      return html`<ui-alert tone="warning"
        ><ui-text variant="body-md">${dayTime(eta.at)} · ${eta.text}</ui-text></ui-alert
      >`;
    if (d.case.blocker) return html`<ui-alert tone="info">${d.case.blocker}</ui-alert>`;
    return nothing;
  }

  private _plan(d: CaseOps) {
    const next = d.deliveries.find((x) => !/confirmed|Cancelled/.test(x.status)) ?? d.deliveries[0];
    if (!next)
      return html`<ui-card>
        ${this._heading("Vessel delivery plan")}
        <ui-text variant="body-md" color="muted"
          >No delivery planned yet — the plan is created once supplier POs are confirmed and goods are due.</ui-text
        >
      </ui-card>`;
    const p = next.plan;
    const openApprovals = d.purchaseOrders.some((x) => x.status === "Awaiting approval");
    const goodsReady = d.backorders.every((b) => !next.lines.some((l) => l.lineNo === b.lineNo) || !b.late);
    const email = AGENT_EMAIL[d.case.id];
    const checks: [string, boolean][] = [
      ["Goods ready & labelled per line", goodsReady],
      ["Documents: delivery note, packing list, SDS, certificates", true],
      ["Ship-stores declaration", Boolean(p.clearance)],
      ["Transport booked (truck, launch)", Boolean(p.vehicle && p.launch && !/to be confirmed/i.test(p.launch))],
      ["No open approval on the order", !openApprovals],
    ];
    return html`<ui-card>
      ${this._heading(
        "Vessel delivery plan",
        html`<ui-tag .tone=${statusColor(next.status)}
          >Drop ${next.drop} of ${d.deliveries.length} · ${next.status}</ui-tag
        >`,
        email
          ? html`<ui-button
              size="xs"
              variant="tonal"
              color="primary"
              ?disabled=${Boolean(this.busy)}
              @click=${() => this._openEta()}
              >Agent email: ETA update</ui-button
            >`
          : nothing,
      )}
      <ui-text variant="body-md" color="muted"
        >Supplier promises and the customer promise are tracked separately; an ETA change moves every open drop, booking
        and task, and alerts the owner.</ui-text
      >
      <ui-description-list
        .items=${[
          { label: "Port · place", value: `${d.case.port ?? "—"} · ${next.place}` },
          { label: "Vessel ETA", value: dayTime(d.case.eta) },
          { label: "Agent / delivery contact", value: d.case.agent || "—" },
          { label: "Truck & boarding staff", value: `${p.vehicle ?? "—"} · ${p.boardingStaff ?? "—"}` },
          { label: "Launch / boat", value: p.launch ?? "—" },
          { label: "Goods ready", value: dayTime(p.readyAt) },
          { label: "Planned on board", value: dayTime(next.plannedAt) },
          { label: "Clearance", value: p.clearance ?? "—" },
        ]}
      ></ui-description-list>
      <ui-flex direction="col" gap="2">
        <ui-text variant="label-lg">Pre-dispatch check — ${next.number}</ui-text>
        <ui-flex gap="2" wrap>
          ${checks.map(
            ([label, ok]) =>
              html`<ui-tag .tone=${ok ? "success" : "warning"} .icon=${ok ? "success" : "warning"}>${label}</ui-tag>`,
          )}
        </ui-flex>
      </ui-flex>
    </ui-card>`;
  }

  private _drops(d: CaseOps) {
    if (!d.deliveries.length) return nothing;
    return html`<ui-card>
      ${this._heading(
        "Drops & proof of delivery",
        html`<ui-tag
          >${d.deliveries.filter((x) => /confirmed/.test(x.status)).length} of ${d.deliveries.length} delivered</ui-tag
        >`,
      )}
      <ui-text variant="body-md" color="muted"
        >“Delivered” needs evidence: dispatch and confirmed receipt are separate, and a drop is confirmed only with the
        signed delivery note or photo from the vessel.</ui-text
      >
      <ui-grid fit="sm" gap="4">${d.deliveries.map((x) => this._drop(d, x))}</ui-grid>
    </ui-card>`;
  }

  private _drop(d: CaseOps, x: OpsDelivery) {
    const delivered = /confirmed/.test(x.status);
    return html`<ui-card size="sm">
      <span slot="heading">Drop ${x.drop} · ${x.number}</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${statusColor(x.status)}>${x.status}</ui-tag></ui-flex
      >
      <ui-text variant="body-sm" color="muted">${dayTime(x.plannedAt)} · ${x.place}</ui-text>
      <ui-flex direction="col" gap="0">
        ${x.lines.map(
          (l) =>
            html`<ui-text variant="body-md"
              >L${l.lineNo} · ${l.qty} × ${l.description}${l.lot ? html` · <em>lot ${l.lot}</em>` : nothing}</ui-text
            >`,
        )}
      </ui-flex>
      <ui-flex direction="col" gap="1">
        <ui-text variant="body-sm" .color=${x.dispatchedAt ? "success" : "muted"}
          >${x.dispatchedAt ? `Dispatched ${dayTime(x.dispatchedAt)}` : "Not dispatched yet"}</ui-text
        >
        <ui-text variant="body-sm" .color=${delivered ? "success" : "warning"}
          >${
            delivered
              ? `Signed by ${x.confirmedBy ?? "vessel"} · ${dayTime(x.confirmedAt)}${x.proof ? " · signed delivery note on file" : ""}`
              : "Confirmed receipt pending — signed delivery note required"
          }</ui-text
        >
        ${x.shortages ? html`<ui-text variant="body-sm" color="warning">${x.shortages}</ui-text>` : nothing}
        ${x.invoice ? html`<ui-text variant="body-sm" color="muted">Invoiced: ${x.invoice}</ui-text>` : nothing}
      </ui-flex>
      <ui-flex slot="actions" gap="2" wrap>
        ${
          !delivered && x.status !== "Cancelled"
            ? html`<ui-button
                size="xs"
                color="primary"
                variant=${x.dispatchedAt ? "tonal" : "text"}
                ?disabled=${Boolean(this.busy)}
                @click=${() =>
                  (this.dialog = {
                    kind: "pod",
                    delivery: x,
                    file: null,
                    signedBy: "Chief Officer, " + (d.case.vessel || "vessel"),
                    shortages: "",
                  })}
                >Confirm delivery…</ui-button
              >`
            : nothing
        }
        ${
          delivered && !x.invoice && d.canFinance
            ? html`<ui-button
                size="xs"
                color="primary"
                variant="tonal"
                ?disabled=${Boolean(this.busy)}
                @click=${() => this._invoice(x)}
                >${this.busy === `inv-${x.id}` ? html`<ui-loading size="sm"></ui-loading>` : nothing} Invoice delivered
                quantities</ui-button
              >`
            : nothing
        }
      </ui-flex>
    </ui-card>`;
  }

  private _backorders(d: CaseOps) {
    if (!d.backorders.length) return nothing;
    const columns: TableColumn<BackorderRow>[] = [
      {
        key: "line",
        label: "Line",
        render: (b) => html`<ui-text variant="label-lg">L${b.lineNo} · ${b.description}</ui-text>`,
      },
      { key: "qty", label: "Short", render: (b) => html`<ui-text variant="body-md">${b.qty}</ui-text>` },
      {
        key: "supplier",
        label: "Supplier",
        render: (b) => html`<ui-text variant="body-md">${b.supplierName}</ui-text>`,
      },
      { key: "date", label: "Promised", render: (b) => html`<ui-text variant="body-md">${day(b.date)}</ui-text>` },
      {
        key: "follows",
        label: "Follows in",
        render: (b) => html`<ui-text variant="body-md">${b.followsIn ?? "Not planned"}</ui-text>`,
      },
      {
        key: "owner",
        label: "Owner",
        render: (b) => html`<ui-text variant="body-md">${USERS[b.owner] ?? b.owner}</ui-text>`,
      },
      {
        key: "risk",
        label: "Risk",
        render: (b) =>
          html`<ui-tag .tone=${b.late ? "error" : "success"}
            >${b.late ? "Arrives after the drop is packed" : "In time for the drop"}</ui-tag
          >`,
      },
    ];
    return html`<ui-card>
      ${this._heading("Backorders & late suppliers")}
      <ui-text variant="body-md" color="muted"
        >Receipt shortfalls become backorders with a date and an owner; a late supplier is escalated against the drop it
        was meant for.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.backorders as BackorderRow[]}></ui-table>
    </ui-card>`;
  }

  private _eBadge(inv: OpsInvoice) {
    const e = inv.eInvoice;
    const s = e.status ?? "Not submitted";
    const label = /unreachable/i.test(e.error ?? "") ? "Signature service unreachable" : s;
    return html`<ui-flex direction="col" gap="1" align="start">
      <ui-tag .tone=${/unreachable/i.test(label) ? "error" : statusColor(s)}>${label}</ui-tag>
      ${e.uuid ? html`<ui-text variant="body-sm" color="muted" mono>UUID ${e.uuid}</ui-text>` : nothing}
      ${e.error ? html`<ui-text variant="body-sm" color="error">${e.error}</ui-text>` : nothing}
    </ui-flex>`;
  }

  private _eAction(d: CaseOps, inv: OpsInvoice) {
    if (!d.canFinance) return nothing;
    const s = inv.eInvoice.status ?? "Not submitted";
    const busy = this.busy === `einv-${inv.id}`;
    if (s === "Valid") return nothing;
    if (s === "Submitted")
      return html`<ui-button
        size="xs"
        variant="text"
        ?disabled=${Boolean(this.busy)}
        @click=${() => this._refreshEInvoice(inv)}
        >${busy ? html`<ui-loading size="sm"></ui-loading>` : nothing} Refresh status</ui-button
      >`;
    const label = s === "Rejected" ? "Correct & resubmit" : inv.eInvoice.error ? "Retry (safe)" : "Sign & submit";
    return html`<ui-button
      size="xs"
      variant="tonal"
      color="primary"
      ?disabled=${Boolean(this.busy)}
      @click=${() => (this.dialog = { kind: "einvoice", invoice: inv, taxId: inv.billing.taxId ?? "" })}
      >${busy ? html`<ui-loading size="sm"></ui-loading>` : nothing} ${label}</ui-button
    >`;
  }

  private _invoices(d: CaseOps) {
    const cur = d.case.currency;
    const invoiced = d.invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const received = d.invoices.reduce((s, i) => s + (i.paid || 0), 0);
    const balance = d.invoices.reduce((s, i) => s + (i.balance || 0), 0);
    const nextDue = d.invoices
      .filter((i) => i.balance > 0)
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))[0];
    const columns: TableColumn<InvoiceRow>[] = [
      {
        key: "number",
        label: "Invoice",
        render: (i) =>
          html`<ui-flex direction="col" gap="0">
            <ui-link color="primary" .href=${`/collections/invoices/${i.id}`}
              ><ui-text variant="title-sm">${i.number}</ui-text></ui-link
            >
            <ui-text variant="body-sm" color="muted"
              >${i.basis ?? "Delivery"}${i.delivery ? ` · ${i.delivery}` : ""} · ${day(i.issuedAt)}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "lines",
        label: "Invoiced lines",
        render: (i) =>
          html`<ui-flex direction="col" gap="0"
            >${i.lines.map(
              (l) =>
                html`<ui-text variant="body-sm"
                  >L${l.lineNo} · ${l.qty}${l.deliveredQty != null ? ` of ${l.deliveredQty} delivered` : ""} ×
                  ${money(l.unitPrice, i.currency)}</ui-text
                >`,
            )}</ui-flex
          >`,
      },
      {
        key: "amount",
        label: "Amount · VAT",
        render: (i) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${money(i.amount, i.currency)}</ui-text>
            <ui-text variant="body-sm" color="muted">${i.vatTreatment ?? ""}</ui-text>
          </ui-flex>`,
      },
      {
        key: "einvoice",
        label: "E-invoice (tax authority)",
        render: (i) =>
          html`<ui-flex direction="col" gap="2" align="start">${this._eBadge(i)} ${this._eAction(d, i)}</ui-flex>`,
      },
      {
        key: "paid",
        label: "Paid · balance",
        render: (i) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${money(i.paid, i.currency)} paid</ui-text>
            <ui-text variant="body-sm" .color=${i.balance > 0 ? "warning" : "success"}
              >${i.balance > 0 ? `Balance ${money(i.balance, i.currency)} due ${day(i.dueDate)}` : "Settled"}</ui-text
            >
            ${i.payments.map((p) => html`<ui-text variant="body-sm" color="muted">${day(p.paidAt)} · ${p.reference} · ${money(p.amount, i.currency)}</ui-text>`)}
          </ui-flex>`,
      },
      {
        key: "status",
        label: "Status",
        render: (i) =>
          html`<ui-flex direction="col" gap="2" align="start">
            <ui-tag .tone=${statusColor(i.status)}>${i.status}</ui-tag>
            ${
              d.canFinance && i.balance > 0
                ? html`<ui-button
                    size="xs"
                    variant="text"
                    ?disabled=${Boolean(this.busy)}
                    @click=${() =>
                      (this.dialog = {
                        kind: "payment",
                        invoice: i,
                        amount: String(i.balance),
                        reference: "TRX-77" + String(Date.now()).slice(-3),
                      })}
                    >Record payment</ui-button
                  >`
                : nothing
            }
          </ui-flex>`,
      },
    ];
    return html`<ui-card>
      ${this._heading("Customer invoices & payments", html`<ui-badge .count=${d.invoices.length}></ui-badge>`)}
      <ui-text variant="body-md" color="muted"
        >Invoices come from signed deliveries: only delivered quantities, never the same quantity twice. Each one is
        signed and submitted to the Egyptian Tax Authority; a failed signature submits nothing and is safe to
        retry.</ui-text
      >
      ${
        d.invoices.length
          ? html`<ui-description-list
                size="md"
                .items=${[
                  { label: "Invoiced", value: money(invoiced, cur) },
                  { label: "Received", value: money(received, cur) },
                  { label: "Balance", value: money(balance, cur), tone: balance > 0 ? "warning" : "success" },
                  {
                    label: "Next due",
                    value: nextDue ? `${day(nextDue.dueDate)} · ${money(nextDue.balance, nextDue.currency)}` : "—",
                  },
                ]}
              ></ui-description-list>
              <ui-table size="sm" .columns=${columns} .rows=${d.invoices as InvoiceRow[]}></ui-table>`
          : html`<ui-text variant="body-md" color="muted"
              >No invoice yet — the first one is created from a delivery confirmed with a signed note.</ui-text
            >`
      }
    </ui-card>`;
  }

  /* ------------------------------------------------------------ dialogs */

  private _dialogTitle() {
    const d = this.dialog;
    if (!d) return "";
    if (d.kind === "eta") return "Agent email — ETA update";
    if (d.kind === "pod") return `Confirm ${d.delivery.number} delivered`;
    if (d.kind === "einvoice") return `Sign & submit ${d.invoice.number} to the tax authority`;
    return `Record customer payment — ${d.invoice.number}`;
  }

  private _dialogBody(data: CaseOps) {
    const d = this.dialog;
    if (!d) return nothing;
    const cancel = html`<ui-button variant="text" size="xs" @click=${() => (this.dialog = null)}>Cancel</ui-button>`;
    if (d.kind === "eta") {
      const email = AGENT_EMAIL[data.case.id];
      if (d.loading || !email)
        return html`<ui-flex gap="3" align="center" padding="4"
          ><ui-loading color="primary"></ui-loading
          ><ui-text variant="body-md">Reading the agent's email…</ui-text></ui-flex
        >`;
      const open = data.deliveries.filter((x) => !/confirmed|Cancelled|Dispatched/.test(x.status));
      return html`<ui-flex direction="col" gap="3">
        <ui-mockup-window variant="filled">
          <ui-flex direction="col" gap="1" padding="4">
            <ui-text variant="body-sm" color="muted">From ${email.from} · Subject: ${email.subject}</ui-text>
            <ui-text variant="body-md">${email.body}</ui-text>
          </ui-flex>
        </ui-mockup-window>
        <ui-flex gap="2" align="center" wrap>
          <ui-tag variant="outline">AI read · 97%</ui-tag>
          <ui-text variant="body-md"
            >New ETA <strong>${dayTime(email.eta)}</strong> (was ${dayTime(data.case.eta)})</ui-text
          >
        </ui-flex>
        <ui-text variant="label-lg">What moves</ui-text>
        <ui-flex direction="col" gap="1">
          ${
            open.length
              ? open.map(
                  (x) =>
                    html`<ui-text variant="body-md"
                      >${x.number}: on board ${dayTime(x.plannedAt)} → ${dayTime(email.eta)} · launch re-booked · truck
                      & boarding staff re-confirmed (task for ${USERS[data.case.owner] ?? data.case.owner})</ui-text
                    >`,
                )
              : html`<ui-empty-state size="sm">No open drop to move.</ui-empty-state>`
          }
          ${data.backorders.map(
            (b) =>
              html`<ui-text variant="body-md" .color=${b.date && b.date > email.eta ? "error" : "success"}
                >Backorder L${b.lineNo} (${b.supplierName}, ${day(b.date)}):
                ${b.date && b.date > email.eta ? "still late — escalate" : "now in time for the drop"}</ui-text
              >`,
          )}
          <ui-text variant="body-md">Alert to ${USERS[data.case.owner] ?? data.case.owner} and Karim Balbaa.</ui-text>
        </ui-flex>
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button color="primary" size="xs" @click=${() => this._applyEta()}>Apply re-plan & alert</ui-button>
        </ui-flex>
      </ui-flex>`;
    }
    if (d.kind === "pod")
      return html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >${d.delivery.lines.map((l) => `L${l.lineNo} × ${l.qty}`).join(" · ")} — ${d.delivery.place}</ui-text
        >
        <ui-file-input
          legend="Signed delivery note or photo (required)"
          accept="image/*,application/pdf"
          hint=${d.file ? d.file.name : "Photo of the stamped note from the vessel, or the scanned PDF"}
          @ui-change=${(e: CustomEvent<{ files: FileList | null }>) =>
            (this.dialog = { ...d, file: e.detail.files?.[0] ?? null })}
        ></ui-file-input>
        ${
          d.file
            ? nothing
            : html`<ui-button
                size="xs"
                variant="text"
                @click=${() =>
                  (this.dialog = {
                    ...d,
                    file: sampleFile(`${d.delivery.number}-signed.pdf`, [
                      `Delivery note ${d.delivery.number}`,
                      `Received on board — ${d.signedBy}`,
                    ]),
                  })}
                >Use the sample scan from the boarding officer</ui-button
              >`
        }
        <ui-text-input
          legend="Signed by (vessel)"
          width="full"
          .value=${d.signedBy}
          @input=${(e: Event) => (this.dialog = { ...d, signedBy: (e.target as HTMLInputElement).value })}
        ></ui-text-input>
        <ui-textarea
          legend="Shortages or damage noted on board"
          hint="Optional — becomes a claim"
          width="full"
          .value=${d.shortages}
          @input=${(e: Event) => (this.dialog = { ...d, shortages: (e.target as HTMLTextAreaElement).value })}
        ></ui-textarea>
        <ui-ai-dictate
          label="Dictate shortages or damage"
          @ui-select=${(e: CustomEvent<{ value: string }>) => {
            const now = this.dialog;
            if (now?.kind === "pod")
              this.dialog = {
                ...now,
                shortages: now.shortages ? `${now.shortages}\n${e.detail.value}` : e.detail.value,
              };
          }}
        ></ui-ai-dictate>
        <ui-ai-extract
          source="file"
          label="Read the signed note from a photo"
          what="signed delivery note or receipt from a ship"
          pickable
          use-label="Fill in"
          .fields=${[
            { id: "signedBy", label: "Signed by", hint: "name and rank of the officer who signed" },
            { id: "date", label: "Date" },
            { id: "vessel", label: "Vessel" },
            {
              id: "remarks",
              label: "Shortages or damage noted",
              hint: "anything written about missing or damaged items",
            },
          ]}
          @ui-select=${(e: CustomEvent<{ values: Record<string, string | number | null> }>) => {
            const now = this.dialog;
            if (now?.kind !== "pod") return;
            const v = e.detail.values;
            this.dialog = {
              ...now,
              signedBy: v.signedBy ? String(v.signedBy) : now.signedBy,
              shortages: v.remarks ? [now.shortages, String(v.remarks)].filter(Boolean).join("\n") : now.shortages,
            };
          }}
        ></ui-ai-extract>
        ${d.file ? nothing : html`<ui-alert tone="warning">No evidence, no “Delivered”: attach the signed note first.</ui-alert>`}
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button
            color="primary"
            size="xs"
            ?disabled=${!d.file || !d.signedBy.trim()}
            @click=${() => this._confirmPod()}
            >Confirm delivered</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    if (d.kind === "einvoice") {
      const local = d.invoice.vatTreatment === "14% standard";
      const rejected = d.invoice.eInvoice.status === "Rejected";
      return html`<ui-flex direction="col" gap="3">
        <ui-text variant="body-md"
          >${d.invoice.billing.legalEntity ?? data.customer?.name} · ${money(d.invoice.amount, d.invoice.currency)} ·
          ${d.invoice.vatTreatment}</ui-text
        >
        ${
          d.invoice.eInvoice.error
            ? html`<ui-alert tone=${rejected ? "error" : "warning"}>${d.invoice.eInvoice.error}</ui-alert>`
            : nothing
        }
        ${
          local
            ? html`<ui-text-input
                legend="Buyer tax registration number"
                hint="9 digits — on the customer's tax card on file: 100-200-300"
                width="full"
                .value=${d.taxId}
                @input=${(e: Event) => (this.dialog = { ...d, taxId: (e.target as HTMLInputElement).value })}
              ></ui-text-input>`
            : nothing
        }
        ${
          rejected && local
            ? html`<ui-button size="xs" variant="text" @click=${() => (this.dialog = { ...d, taxId: "100-200-300" })}
                >Use 100-200-300 from the tax card</ui-button
              >`
            : nothing
        }
        <ui-text variant="body-sm" color="muted"
          >Signed with Golden Sea's e-signature and submitted; the invoice number is the idempotency key, so a retry
          never creates a second submission.</ui-text
        >
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button color="primary" size="xs" @click=${() => this._submitEInvoice()}>Sign & submit</ui-button>
        </ui-flex>
      </ui-flex>`;
    }
    return html`<ui-flex direction="col" gap="3">
      <ui-text variant="body-md"
        >Balance ${money(d.invoice.balance, d.invoice.currency)} · due ${day(d.invoice.dueDate)}. Recorded after the
        money is in the bank — the system never moves money.</ui-text
      >
      <ui-text-input
        legend=${`Amount received (${d.invoice.currency})`}
        type="number"
        width="full"
        .value=${d.amount}
        @input=${(e: Event) => (this.dialog = { ...d, amount: (e.target as HTMLInputElement).value })}
      ></ui-text-input>
      <ui-text-input
        legend="Bank reference"
        width="full"
        .value=${d.reference}
        @input=${(e: Event) => (this.dialog = { ...d, reference: (e.target as HTMLInputElement).value })}
      ></ui-text-input>
      <ui-flex justify="end" gap="2">
        ${cancel}
        <ui-button color="primary" size="xs" @click=${() => this._recordPayment()}>Record payment</ui-button>
      </ui-flex>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-delivery": GsCaseDelivery;
  }
}
