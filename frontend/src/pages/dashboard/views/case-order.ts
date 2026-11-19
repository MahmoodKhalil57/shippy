import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { Check } from "../../../cms/endpoints/operations.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";
import {
  type CaseOps,
  type OpsPO,
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
 * Case tab "Order & purchasing" (/collections/cases/<id>/order): the customer's PO checked line
 * by line against the approved quotation version (commitment blocked until every mismatch has
 * written customer agreement), partial awards, the supplier POs (re-checked before confirming,
 * deposits through approval), supplier bills with the 3-way match and the duplicate-bill block,
 * drop-ship vs warehouse, and receipts with lots, expiry, QC and backorders.
 * Data: GET /api/operations/case/:id and the POST endpoints in src/cms/endpoints/operations.ts.
 */

type Dialog =
  | { kind: "amend"; index: number; check: Check; resolution: string; file: File | null }
  | { kind: "award"; lineNo: number; description: string; reason: string }
  | { kind: "recheck"; po: OpsPO; running: boolean }
  | { kind: "bill" };

type Row = Record<string, unknown>;
type ReceiptRow = CaseOps["receipts"][number] & Row;

@customElement("gs-case-order")
export class GsCaseOrder extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: ViewProps["user"];
  @property() slug?: string;
  @property() docId?: string;

  @state() private data: CaseOps | null = null;
  @state() private error = "";
  @state() private busy = "";
  @state() private dialog: Dialog | null = null;
  @state() private duplicateBlocked = "";

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

  /** Runs an action with a busy marker; reloads and toasts. */
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

  private _checkPo() {
    void this._run("po-check", async () => {
      await reading(1100);
      const r = await api.post<{ created: boolean; doc: { openMismatches?: number } }>("/operations/po-check", {
        case: this.docId,
      });
      const open = r.doc.openMismatches ?? 0;
      return `${r.created ? "Customer PO read and checked" : "PO re-checked"}: ${open ? `${open} mismatch(es) block commitment` : "all lines match"}.`;
    });
  }

  private async _amend() {
    const d = this.dialog;
    if (d?.kind !== "amend" || !this.data?.customerPo) return;
    const po = this.data.customerPo;
    this.dialog = null;
    await this._run("amend", async () => {
      const file =
        d.file ??
        sampleFile(`${po.number}-amendment-L${d.check.lineNo}.pdf`, [
          `From: purchasing (customer)`,
          `Re: ${po.number} line ${d.check.lineNo}`,
          d.resolution,
        ]);
      const evidence = await uploadEvidence(file, "Customer PO", `${po.number} amendment, line ${d.check.lineNo}`);
      await api.post("/operations/po-amend", { po: po.id, index: d.index, resolution: d.resolution, evidence });
      return `Amendment recorded on line ${d.check.lineNo} — evidence attached.`;
    });
  }

  private _award(lineNo: number, outcome: string, reason: string) {
    const po = this.data?.customerPo;
    if (!po) return;
    this.dialog = null;
    void this._run(`award-${lineNo}`, async () => {
      await api.post("/operations/po-award", { po: po.id, lineNo, outcome, reason });
      return `Line ${lineNo}: ${outcome === "Closed" ? "closed with reason" : "kept open for a revision"}.`;
    });
  }

  private _confirmOrder() {
    void this._run("confirm", async () => {
      const r = await api.post<{ created: string[] }>("/operations/confirm-order", { case: this.docId });
      return `Sales order confirmed${r.created.length ? ` · supplier POs ${r.created.join(", ")} prepared for re-check & approval` : ""}.`;
    });
  }

  private async _recheck(po: OpsPO) {
    this.dialog = { kind: "recheck", po, running: true };
    try {
      await reading(1000);
      await api.post("/operations/po-recheck", { po: po.id });
      await this._load();
      const fresh = this.data?.purchaseOrders.find((p) => p.id === po.id) ?? po;
      this.dialog = { kind: "recheck", po: fresh, running: false };
    } catch (e) {
      this.dialog = null;
      toast(errorText(e), "error");
    }
  }

  private _confirmPo(po: OpsPO) {
    this.dialog = null;
    void this._run(`po-${po.id}`, async () => {
      await api.update("purchase-orders", po.id, { status: "Confirmed", recheckDone: true });
      return `${po.number} confirmed — sent to ${po.supplierName}.`;
    });
  }

  private _askApproval(po: OpsPO) {
    this.dialog = null;
    void this._run(`po-${po.id}`, async () => {
      await api.create("approvals", {
        title: `Supplier PO ${po.number} to ${po.supplierName}`,
        type: "Supplier PO",
        case: this.docId,
        detail: `PO ${po.number} · re-check done${po.recheck.some((r) => !r.ok) ? " — changes flagged" : ", no changes"}.`,
        approvers: ["kb"],
        subject: { relationTo: "purchase-orders", value: po.id },
      });
      await api
        .create("notifications", {
          user: "kb",
          title: `Approve supplier PO ${po.number}`,
          detail: `${po.supplierName} · ${this.data?.case.caseId}`,
          kind: "Approval",
          href: "/approvals",
        })
        .catch(() => null);
      return `Approval requested from Karim Balbaa for ${po.number}.`;
    });
  }

  /** The supplier emails the same bill again: booking it is refused (same supplier + bill number). */
  private _bookDuplicate() {
    const bill = this.data?.bills[0];
    this.dialog = null;
    if (!bill) return;
    void this._run("bill", async () => {
      try {
        await api.create("supplier-bills", {
          billNumber: bill.billNumber,
          supplier: bill.supplier,
          purchaseOrder: bill.purchaseOrder,
          amount: bill.amount,
          currency: bill.currency,
        });
        return "Bill booked.";
      } catch (e) {
        this.duplicateBlocked = errorText(e);
        throw e;
      }
    });
  }

  /* ------------------------------------------------------------ render */

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._tiles(d)} ${this._poCheck(d)} ${this._partialAward(d)} ${this._supplierPos(d)} ${this._bills(d)}
      ${this._receipts(d)}
      <ui-modal .heading=${this._dialogTitle()} .open=${Boolean(this.dialog)} @ui-close=${() => (this.dialog = null)}>
        ${this._dialogBody(d)}
      </ui-modal>
    </ui-flex>`;
  }

  private _tile(label: string, value: string, note: string, tone?: "error" | "warning" | "success") {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" color="muted" truncate>${label}</ui-text>
        <ui-text size="2xl" weight="semibold" leading="tight" .color=${tone}>${value}</ui-text>
        <ui-text size="xs" color="muted" clamp="2">${note}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _tiles(d: CaseOps) {
    const po = d.customerPo;
    const confirmed = d.purchaseOrders.filter((p) => !["Draft", "Awaiting approval", "Cancelled"].includes(p.status));
    const ordered = d.receipts.reduce((s, r) => s + r.ordered, 0);
    const received = d.receipts.reduce((s, r) => s + r.received, 0);
    const held = d.bills.filter((b) => b.status === "On hold").length;
    return html`<ui-grid fit="xs" gap="4">
      ${this._tile(
        "Customer PO",
        po ? po.status : d.orderConfirmed ? "Validated" : "Not received",
        po
          ? `${po.number} vs ${po.quotation}`
          : d.orderConfirmed
            ? "Sales order confirmed"
            : "Waiting for the customer's order",
        po ? (po.status === "Validated" ? "success" : "error") : d.orderConfirmed ? "success" : undefined,
      )}
      ${this._tile(
        "Supplier POs confirmed",
        `${confirmed.length} of ${d.purchaseOrders.length}`,
        d.purchaseOrders.length ? "Re-checked before confirming" : "Prepared when the sales order is confirmed",
      )}
      ${this._tile(
        "Received",
        ordered ? `${received} of ${ordered}` : "—",
        ordered && received < ordered ? `${ordered - received} on backorder` : "Units across all receipts",
        ordered && received < ordered ? "warning" : undefined,
      )}
      ${
        d.canSeeCosts
          ? this._tile(
              "Supplier bills",
              `${d.bills.length}`,
              held ? `${held} on hold — 3-way match` : "Matched to PO and receipt",
              held ? "error" : undefined,
            )
          : nothing
      }
    </ui-grid>`;
  }

  private _heading(title: string, badge?: TemplateResult | typeof nothing, actions?: TemplateResult | typeof nothing) {
    return html`<ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
      <ui-flex gap="2" align="center" wrap>${title}${badge ?? nothing}</ui-flex>
      ${actions ? html`<ui-flex gap="2" wrap>${actions}</ui-flex>` : nothing}
    </ui-flex>`;
  }

  private _poCheck(d: CaseOps) {
    const po = d.customerPo;
    const isReading = this.busy === "po-check";
    if (!po)
      return html`<ui-card variant="border" shadow="false">
        ${this._heading("Customer PO check")}
        ${
          isReading
            ? html`<ui-flex gap="3" align="center"
                ><ui-loading size="sm" color="primary"></ui-loading
                ><ui-text size="sm">AI is reading the customer's PO and matching it to the quotation…</ui-text></ui-flex
              >`
            : d.orderConfirmed
              ? html`<ui-alert color="success" variant="soft"
                  >The customer's PO was checked against the approved quotation and validated — the sales order is
                  confirmed.</ui-alert
                >`
              : d.poExpected
                ? html`<ui-alert color="info" variant="soft">
                    <ui-flex direction="col" gap="1">
                      <strong>Nordvik's purchase order has just arrived by email.</strong>
                      <ui-text size="sm"
                        >The AI reads it and checks every line and commercial term against the quotation version it
                        refers to. Nothing is committed until a person resolves each mismatch.</ui-text
                      >
                    </ui-flex>
                    <ui-button slot="actions" size="sm" color="primary" @click=${() => this._checkPo()}
                      >Read customer PO</ui-button
                    >
                  </ui-alert>`
                : html`<ui-text size="sm" color="muted"
                    >No customer PO yet. When it arrives it is checked here against the approved quotation
                    version.</ui-text
                  >`
        }
      </ui-card>`;
    const columns: TableColumn<Row>[] = [
      {
        key: "line",
        label: "Line",
        render: (r) =>
          html`<ui-text size="sm" weight="medium"
            >${(r.c as Check).lineNo ? `L${(r.c as Check).lineNo}` : "Header"}</ui-text
          >`,
      },
      { key: "field", label: "Checked", render: (r) => html`<ui-text size="sm">${(r.c as Check).field}</ui-text>` },
      { key: "po", label: "Customer PO", render: (r) => html`<ui-text size="sm">${(r.c as Check).po}</ui-text>` },
      {
        key: "quote",
        label: `Quotation ${po.quotation}`,
        render: (r) => html`<ui-text size="sm">${(r.c as Check).quote}</ui-text>`,
      },
      {
        key: "result",
        label: "Result",
        render: (r) => {
          const c = r.c as Check;
          if (c.matches) return html`<ui-badge size="sm" variant="soft" color="success">Match</ui-badge>`;
          if (c.resolution)
            return html`<ui-flex direction="col" gap="1" align="start">
              <ui-badge size="sm" variant="soft" color="success">Amendment recorded</ui-badge>
              <ui-text size="xs" color="muted">${c.resolution}${c.evidence ? " · evidence attached" : ""}</ui-text>
            </ui-flex>`;
          return html`<ui-badge size="sm" variant="soft" color="error">Mismatch</ui-badge>`;
        },
      },
      {
        key: "act",
        label: "",
        render: (r) => {
          const c = r.c as Check;
          return !c.matches && !c.resolution
            ? html`<ui-button
                size="xs"
                variant="soft"
                color="primary"
                ?disabled=${Boolean(this.busy)}
                @click=${() =>
                  (this.dialog = {
                    kind: "amend",
                    index: r.i as number,
                    check: c,
                    resolution: c.suggestion ?? "",
                    file: null,
                  })}
                >Record amendment</ui-button
              >`
            : nothing;
        },
      },
    ];
    const blocked = po.status !== "Validated";
    return html`<ui-card variant="border" shadow="false">
      ${this._heading(
        "Customer PO check",
        html`<ui-badge size="sm" variant="soft" .color=${statusColor(po.status)}>${po.status}</ui-badge>`,
        html`<ui-button size="xs" variant="ghost" ?disabled=${Boolean(this.busy)} @click=${() => this._checkPo()}
          >${isReading ? html`<ui-loading size="xs"></ui-loading> Reading…` : "Re-run PO check"}</ui-button
        >`,
      )}
      <ui-text size="sm" color="muted"
        >${po.number} · received ${dayTime(po.receivedAt)} · matched to ${po.quotation} · billing entity
        ${po.billingEntity ?? "—"} ·
        <ui-badge size="xs" variant="outline" color="secondary">AI check · 96%</ui-badge></ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${po.checks.map((c, i) => ({ c, i }))}></ui-table>
      <ui-ai-check
        label="Second look with AI"
        .text=${po.checks
          .map(
            (c) =>
              `${c.lineNo > 0 ? `Line ${c.lineNo}` : "Terms"} · ${c.field}: PO says "${c.po}", quotation ${po.quotation} says "${c.quote}"`,
          )
          .join("\n")}
        .questions=${[
          {
            id: "prices",
            prompt: "Are the prices on the customer's PO the same as on the quotation?",
            yes: "Prices match the quotation",
            no: "A price differs from the quotation",
          },
          {
            id: "items",
            prompt: "Are the items and quantities on the PO the same as on the quotation?",
            yes: "Items and quantities match",
            no: "An item or quantity differs",
          },
          {
            id: "terms",
            prompt: "Do the PO's commercial terms (payment, delivery, validity) match the quotation?",
            yes: "Terms match",
            no: "A term differs",
          },
        ]}
      ></ui-ai-check>
      ${
        blocked
          ? html`<ui-alert color="error" variant="soft"
              >Commitment blocked: ${po.openMismatches} mismatch${po.openMismatches === 1 ? "" : "es"} need the
              customer's written agreement (or an approved exception) before the sales order and supplier POs.</ui-alert
            >`
          : d.orderConfirmed
            ? html`<ui-alert color="success" variant="soft"
                >PO validated — sales order confirmed. Supplier POs follow below.</ui-alert
              >`
            : html`<ui-alert color="success" variant="soft"
                >PO validated — every mismatch has written customer agreement.</ui-alert
              >`
      }
      <ui-flex slot="actions" gap="2" wrap>
        ${
          d.orderConfirmed
            ? nothing
            : html`<ui-button
                color="primary"
                size="sm"
                ?disabled=${blocked || Boolean(this.busy)}
                @click=${() => this._confirmOrder()}
                >${this.busy === "confirm" ? html`<ui-loading size="xs"></ui-loading>` : nothing} Confirm sales order &
                prepare supplier POs</ui-button
              >`
        }
      </ui-flex>
    </ui-card>`;
  }

  private _partialAward(d: CaseOps) {
    const po = d.customerPo;
    if (!po) return nothing;
    const onPo = new Set(po.checks.filter((c) => c.lineNo > 0).map((c) => c.lineNo));
    const missing = d.lines.filter((l) => !onPo.has(l.lineNo));
    if (!missing.length) return nothing;
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Partial award")}
      <ui-text size="sm" color="muted"
        >Quoted lines the customer didn't order: they stay open for a revision or close with a reason — a partly awarded
        case never shows as complete.</ui-text
      >
      <ui-flex direction="col" gap="3">
        ${missing.map((l) => {
          const u = po.unawarded.find((x) => x.lineNo === l.lineNo);
          return html`<ui-flex justify="between" align="center" gap="3" wrap>
            <ui-flex direction="col" gap="0" shrink>
              <ui-text size="sm" weight="medium">L${l.lineNo} · ${l.description}</ui-text>
              <ui-text size="xs" color="muted"
                >${u ? `${u.outcome}${u.reason ? ` — ${u.reason}` : ""}` : "Not on the customer's PO — decide"}</ui-text
              >
            </ui-flex>
            <ui-flex gap="2" align="center" wrap>
              ${
                u
                  ? html`<ui-badge size="sm" variant="soft" .color=${u.outcome === "Closed" ? "neutral" : "warning"}
                      >${u.outcome === "Closed" ? "Closed" : "Open — revision to follow"}</ui-badge
                    >`
                  : html`<ui-badge size="sm" variant="soft" color="error">Undecided</ui-badge>`
              }
              ${
                u?.outcome === "Closed"
                  ? nothing
                  : html`${
                        u
                          ? nothing
                          : html`<ui-button
                              size="xs"
                              variant="ghost"
                              ?disabled=${Boolean(this.busy)}
                              @click=${() => this._award(l.lineNo, "Open — revision to follow", "Revision to follow")}
                              >Keep open</ui-button
                            >`
                      }
                      <ui-button
                        size="xs"
                        variant="soft"
                        ?disabled=${Boolean(this.busy)}
                        @click=${() => (this.dialog = { kind: "award", lineNo: l.lineNo, description: l.description, reason: "" })}
                        >Close with reason</ui-button
                      >`
              }
            </ui-flex>
          </ui-flex>`;
        })}
      </ui-flex>
    </ui-card>`;
  }

  private _supplierPos(d: CaseOps) {
    const pos = d.purchaseOrders;
    const columns: TableColumn<Row>[] = [
      {
        key: "number",
        label: "PO",
        render: (r) => {
          const p = r.p as OpsPO;
          return html`<ui-flex direction="col" gap="0">
            <ui-link color="primary" .href=${`/collections/purchase-orders/${p.id}`}
              ><ui-text size="sm" weight="semibold">${p.number}</ui-text></ui-link
            >
            <ui-text size="xs" color="muted">${p.supplierName}</ui-text>
          </ui-flex>`;
        },
      },
      {
        key: "lines",
        label: "Lines",
        render: (r) =>
          html`<ui-flex direction="col" gap="0"
            >${(r.p as OpsPO).lines.map(
              (l) =>
                html`<ui-text size="xs"
                  >L${l.lineNo} · ${l.qty} ×
                  ${l.description}${
                    d.canSeeCosts && l.unitPrice != null
                      ? html` · ${money(l.unitPrice, (r.p as OpsPO).currency)}`
                      : nothing
                  }</ui-text
                >`,
            )}</ui-flex
          >`,
      },
      {
        key: "route",
        label: "Route",
        render: (r) => {
          const drop = /dropship/i.test((r.p as OpsPO).deliverTo ?? "");
          return html`<ui-badge size="sm" variant="outline" .color=${drop ? "accent" : "neutral"}
            >${drop ? "Drop-ship to vessel" : `Warehouse · ${(r.p as OpsPO).deliverTo ?? "—"}`}</ui-badge
          >`;
        },
      },
      ...(d.canSeeCosts
        ? [
            {
              key: "total",
              label: "Amount",
              render: (r: Row) =>
                html`<ui-text size="sm" align="end">${money((r.p as OpsPO).total, (r.p as OpsPO).currency)}</ui-text>`,
            },
            {
              key: "deposit",
              label: "Pro forma · deposit",
              render: (r: Row) => {
                const p = r.p as OpsPO;
                if (!p.depositPct)
                  return html`<ui-text size="xs" color="muted">${p.proforma ?? "No deposit"}</ui-text>`;
                const paid = (p.paid ?? 0) > 0;
                return html`<ui-flex direction="col" gap="1" align="start">
                  <ui-text size="xs"
                    >${p.depositPct}% · ${money(p.deposit, p.currency)}${p.proforma ? ` · ${p.proforma}` : ""}</ui-text
                  >
                  ${
                    paid
                      ? html`<ui-badge size="xs" variant="soft" color="success"
                          >Deposit paid ${money(p.paid, p.currency)}</ui-badge
                        >`
                      : p.approval
                        ? html`<ui-link .href=${"/cash"}
                            ><ui-badge size="xs" variant="soft" .color=${statusColor(p.approval.status)}
                              >Payment approval: ${p.approval.status}</ui-badge
                            ></ui-link
                          >`
                        : html`<ui-badge size="xs" variant="soft" color="warning">Needs payment approval</ui-badge>`
                  }
                  ${p.balanceDue ? html`<ui-text size="xs" color="muted">Balance on delivery · ${day(p.balanceDue)}</ui-text>` : nothing}
                </ui-flex>`;
              },
            },
          ]
        : []),
      {
        key: "status",
        label: "Status",
        render: (r) => {
          const p = r.p as OpsPO;
          return html`<ui-flex direction="col" gap="1" align="start">
            <ui-badge size="sm" variant="soft" .color=${statusColor(p.status)}>${p.status}</ui-badge>
            ${p.acknowledgedAt ? html`<ui-text size="xs" color="muted">Acknowledged ${day(p.acknowledgedAt)}</ui-text>` : nothing}
            ${
              p.recheckDone
                ? html`<ui-text size="xs" .color=${p.recheck.some((x) => x.ok === false) ? "warning" : "muted"}
                    >Re-checked${p.recheck.some((x) => x.ok === false) ? " · change flagged" : ""}</ui-text
                  >`
                : nothing
            }
          </ui-flex>`;
        },
      },
      {
        key: "act",
        label: "",
        render: (r) => {
          const p = r.p as OpsPO;
          if (!["Draft", "Awaiting approval"].includes(p.status) || !d.canSeeCosts) return nothing;
          return html`<ui-button
            size="xs"
            variant="soft"
            color="primary"
            ?disabled=${Boolean(this.busy)}
            @click=${() => (p.recheckDone ? (this.dialog = { kind: "recheck", po: p, running: false }) : this._recheck(p))}
            >${p.recheckDone ? "Review & confirm" : "Re-check & confirm"}</ui-button
          >`;
        },
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Supplier purchase orders", html`<ui-badge size="sm" variant="soft">${pos.length}</ui-badge>`)}
      <ui-text size="sm" color="muted"
        >Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and
        lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment
        approval.${d.canSeeCosts ? "" : " Supplier costs are hidden for Sales."}</ui-text
      >
      ${
        pos.length
          ? html`<ui-table size="sm" .columns=${columns} .rows=${pos.map((p) => ({ p }))}></ui-table>`
          : html`<ui-alert variant="soft" color=${d.customerPo?.status === "Validated" ? "info" : "warning"}
              >${
                d.customerPo?.status === "Validated"
                  ? "Confirm the sales order to prepare the supplier POs."
                  : "Blocked: no supplier PO is prepared until the customer's PO is validated."
              }</ui-alert
            >`
      }
    </ui-card>`;
  }

  private _bills(d: CaseOps) {
    if (!d.canSeeCosts || !d.purchaseOrders.length) return nothing;
    const columns: TableColumn<Row>[] = [
      {
        key: "bill",
        label: "Bill",
        render: (b) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="semibold">${b.billNumber}</ui-text>
            <ui-text size="xs" color="muted">${b.supplierName} · ${b.poNumber ?? "—"}</ui-text>
          </ui-flex>`,
      },
      {
        key: "match",
        label: "PO · receipt · bill",
        render: (b) =>
          html`<ui-flex direction="col" gap="0"
            >${(b.match as { lineNo: number; ordered: number; received: number; billed: number }[]).map(
              (m) =>
                html`<ui-text size="xs" .color=${m.billed > m.received || m.received > m.ordered ? "error" : undefined}
                  >L${m.lineNo}: ${m.ordered} · ${m.received} · ${m.billed}</ui-text
                >`,
            )}</ui-flex
          >`,
      },
      {
        key: "amount",
        label: "Amount",
        render: (b) =>
          html`<ui-text size="sm" align="end">${money(b.amount as number, b.currency as string)}</ui-text>`,
      },
      { key: "due", label: "Due", render: (b) => html`<ui-text size="sm">${day(b.dueDate as string)}</ui-text>` },
      {
        key: "status",
        label: "Status",
        render: (b) =>
          html`<ui-flex direction="col" gap="1" align="start">
            <ui-badge size="sm" variant="soft" .color=${statusColor(String(b.status))}>${b.status}</ui-badge>
            ${b.holdReason ? html`<ui-text size="xs" color="error">${b.holdReason}</ui-text>` : nothing}
          </ui-flex>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading(
        "Supplier bills — 3-way match",
        nothing,
        d.canFinance && d.bills.length
          ? html`<ui-button
              size="xs"
              variant="soft"
              ?disabled=${Boolean(this.busy)}
              @click=${() => (this.dialog = { kind: "bill" })}
              >Book incoming bill</ui-button
            >`
          : nothing,
      )}
      <ui-text size="sm" color="muted"
        >A bill is payable only when ordered = received = billed. More billed than received puts it on hold; the same
        supplier's bill number can't be booked twice.</ui-text
      >
      ${
        this.duplicateBlocked
          ? html`<ui-alert color="error" variant="soft">Duplicate bill blocked — ${this.duplicateBlocked}</ui-alert>`
          : nothing
      }
      ${
        d.bills.length
          ? html`<ui-table size="sm" .columns=${columns} .rows=${d.bills as unknown as Row[]}></ui-table>`
          : html`<ui-text size="sm" color="muted">No supplier bills yet.</ui-text>`
      }
    </ui-card>`;
  }

  private _receipts(d: CaseOps) {
    if (!d.receipts.length) return nothing;
    const columns: TableColumn<ReceiptRow>[] = [
      {
        key: "line",
        label: "Line",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="medium">L${r.lineNo} · ${r.description}</ui-text>
            <ui-text size="xs" color="muted">${r.supplierName} · ${r.poNumber ?? ""}</ui-text>
          </ui-flex>`,
      },
      {
        key: "qty",
        label: "Received",
        render: (r) =>
          html`<ui-text size="sm" .color=${(r.shortfall as number) > 0 ? "warning" : undefined}
            >${r.received} of ${r.ordered}</ui-text
          >`,
      },
      {
        key: "where",
        label: "Where",
        render: (r) =>
          html`<ui-text size="xs"
            >${r.warehouse === "Direct to vessel" ? "Drop-ship → vessel" : `Warehouse ${r.warehouse ?? ""}`} ·
            ${day(r.receivedAt as string)}</ui-text
          >`,
      },
      {
        key: "lot",
        label: "Lot · expiry",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="xs" mono>${r.lot ?? "—"}</ui-text>
            <ui-text size="xs" color="muted"
              >${r.expiry ? `Expires ${day(r.expiry as string)} ${String(r.expiry).slice(0, 4)}` : "No expiry"}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "qc",
        label: "Quality check",
        render: (r) =>
          html`<ui-flex direction="col" gap="1" align="start">
            <ui-badge size="sm" variant="soft" .color=${statusColor(String(r.qc))}>${r.qc}</ui-badge>
            ${r.claim ? html`<ui-text size="xs" color="muted">${r.claim}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "bo",
        label: "Backorder",
        render: (r) =>
          (r.shortfall as number) > 0
            ? html`<ui-text size="xs" color="warning"
                >${r.shortfall} follow · ${day(r.backorderDate as string)} · owner
                ${USERS[d.case.owner] ?? d.case.owner}</ui-text
              >`
            : html`<ui-text size="xs" color="muted">—</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Receipts · lots · expiry · quality")}
      <ui-text size="sm" color="muted"
        >Warehouse receipts and drop-ship deliveries, with lot, expiry and quality check per line. A shortfall becomes a
        backorder with a date and an owner — it follows in the next drop.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.receipts as ReceiptRow[]}></ui-table>
      ${d.backorders.map(
        (b) =>
          html`<ui-alert color="warning" variant="soft"
            >${b.qty} × ${b.description} short from ${b.supplierName}: backorder ${day(b.date)}
            ${b.followsIn ? `— follows in ${b.followsIn}` : ""} (owner ${USERS[b.owner] ?? b.owner}).</ui-alert
          >`,
      )}
    </ui-card>`;
  }

  /* ------------------------------------------------------------ dialogs */

  private _dialogTitle() {
    const d = this.dialog;
    if (!d) return "";
    if (d.kind === "amend") return `Record customer amendment — line ${d.check.lineNo || "header"}`;
    if (d.kind === "award") return `Close line ${d.lineNo} (not awarded)`;
    if (d.kind === "recheck") return `Re-check before confirming ${d.po.number}`;
    return "Book incoming supplier bill";
  }

  private _dialogBody(data: CaseOps) {
    const d = this.dialog;
    if (!d) return nothing;
    const cancel = html`<ui-button variant="ghost" size="sm" @click=${() => (this.dialog = null)}>Cancel</ui-button>`;
    if (d.kind === "amend")
      return html`<ui-flex direction="col" gap="3">
        <ui-text size="sm"><strong>${d.check.field}</strong> — PO: ${d.check.po} · Quotation: ${d.check.quote}</ui-text>
        <ui-textarea
          legend="Customer's written agreement"
          hint=${d.check.suggestion ? "AI draft from the customer's email — check it before recording" : "Who agreed, when and what"}
          width="full"
          .value=${d.resolution}
          @input=${(e: Event) => (this.dialog = { ...d, resolution: (e.target as HTMLTextAreaElement).value })}
        ></ui-textarea>
        <ui-file-input
          legend="Evidence (email or signed amendment)"
          hint=${d.file ? d.file.name : "Optional in the demo — a copy of the customer's email is attached if you skip this"}
          @ui-change=${(e: CustomEvent<{ files: FileList | null }>) =>
            (this.dialog = { ...d, file: e.detail.files?.[0] ?? null })}
        ></ui-file-input>
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button color="primary" size="sm" ?disabled=${!d.resolution.trim()} @click=${() => this._amend()}
            >Record amendment & lift block</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    if (d.kind === "award")
      return html`<ui-flex direction="col" gap="3">
        <ui-text size="sm">L${d.lineNo} · ${d.description}</ui-text>
        <ui-textarea
          legend="Reason (kept on the case)"
          width="full"
          placeholder="e.g. Vessel bought it locally"
          .value=${d.reason}
          @input=${(e: Event) => (this.dialog = { ...d, reason: (e.target as HTMLTextAreaElement).value })}
        ></ui-textarea>
        <ui-flex gap="2" wrap>
          ${["Vessel bought it locally", "Customer cancelled the item", "Price not accepted"].map(
            (r) =>
              html`<ui-button size="xs" variant="ghost" @click=${() => (this.dialog = { ...d, reason: r })}
                >${r}</ui-button
              >`,
          )}
        </ui-flex>
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button
            color="primary"
            size="sm"
            ?disabled=${!d.reason.trim()}
            @click=${() => this._award(d.lineNo, "Closed", d.reason)}
            >Close line</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    if (d.kind === "recheck") {
      if (d.running)
        return html`<ui-flex gap="3" align="center" padding="4"
          ><ui-loading color="primary"></ui-loading
          ><ui-text size="sm"
            >Re-checking price, availability, FX and lead time with ${d.po.supplierName}…</ui-text
          ></ui-flex
        >`;
      const changed = d.po.recheck.filter((r) => r.ok === false);
      return html`<ui-flex direction="col" gap="3">
        <ui-table
          size="sm"
          .columns=${[
            { key: "item", label: "Item" },
            { key: "atQuotation", label: "At quotation" },
            { key: "now", label: "Now" },
            {
              key: "ok",
              label: "",
              render: (r: Row) =>
                html`<ui-badge size="sm" variant="soft" .color=${r.ok === false ? "warning" : "success"}
                  >${r.ok === false ? "Changed" : "OK"}</ui-badge
                >`,
            },
          ]}
          .rows=${d.po.recheck as unknown as Row[]}
        ></ui-table>
        ${
          changed.length
            ? html`<ui-alert color="warning" variant="soft"
                >${changed.map((c) => `${c.item}: ${c.now}`).join(" · ")} — the shortfall is scheduled as a backorder
                (the customer promise stays as agreed).</ui-alert
              >`
            : nothing
        }
        ${
          data.isManagement
            ? nothing
            : html`<ui-text size="sm" color="muted">Supplier POs are confirmed by Karim Balbaa (management).</ui-text>`
        }
        <ui-flex justify="end" gap="2" wrap>
          ${cancel}
          ${
            data.isManagement
              ? html`<ui-button size="sm" color="primary" @click=${() => this._confirmPo(d.po)}
                  >Approve & confirm ${d.po.number}</ui-button
                >`
              : html`<ui-button size="sm" color="primary" @click=${() => this._askApproval(d.po)}
                  >Ask Karim Balbaa to approve</ui-button
                >`
          }
        </ui-flex>
      </ui-flex>`;
    }
    const bill = data.bills[0];
    return html`<ui-flex direction="col" gap="3">
      <ui-text size="sm"
        >Bill from <strong>${bill?.supplierName}</strong> received by email: <strong>${bill?.billNumber}</strong> ·
        ${money(bill?.amount, bill?.currency)} · PO ${bill?.poNumber} — read by AI (confidence 98%).</ui-text
      >
      <ui-alert color="info" variant="soft"
        >Booking checks the bill number against this supplier's bills first.</ui-alert
      >
      <ui-flex justify="end" gap="2">
        ${cancel}
        <ui-button color="primary" size="sm" @click=${() => this._bookDuplicate()}>Book bill</ui-button>
      </ui-flex>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-order": GsCaseOrder;
  }
}
