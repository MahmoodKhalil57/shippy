import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import type { Access } from "../app.ts";
import { toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";
import { day, dayTime, errorText, money, reading, statusColor, USERS } from "./o2c-shared.ts";

/**
 * Root view "Receivables & payables" (/cash): what customers owe (ageing by customer, collection
 * reminders that respect each customer's contact rule) and what we owe suppliers (deposits,
 * balances on delivery, bills on hold), payments waiting for the Financial Director or the CEO,
 * the two-person bank-detail change with its call-back check, and cash in vs out for the next
 * 8 weeks. Data: GET /api/operations/cash (src/cms/endpoints/operations.ts); Sales sees
 * receivables only. The system records payments after the bank movement — it never pays.
 */

interface Receivable {
  id: string;
  number: string;
  caseId: string | null;
  case: string | null;
  customer: string;
  customerName: string;
  contactRule: string;
  currency: string;
  amount: number;
  paid: number;
  balance: number;
  balanceUsd: number;
  dueDate: string;
  daysOverdue: number;
  bucket: string;
  eInvoice: string;
  lastReminder: string | null;
}
interface Payable {
  id: string;
  po: string;
  case: string;
  caseId: string | null;
  supplier: string;
  supplierName: string;
  currency: string;
  total: number;
  paid: number;
  balance: number;
  deposit: number;
  depositPct: number;
  depositApproval: { id: string; status: string } | null;
  bill: { id: string; number: string; status: string; holdReason?: string | null } | null;
  due: string;
  stage: string;
}
interface Person {
  id: string;
  name: string;
}
interface Decision {
  user: string;
  name: string;
  decision: string;
  reason?: string;
  at?: string;
}
interface PaymentApproval {
  id: string;
  title: string;
  type: string;
  detail?: string;
  status: string;
  caseId: string | null;
  case: string | null;
  approvers: Person[];
  decisions: Decision[];
  po: { id: string; number: string; supplier: string; currency: string } | null;
  amount: number;
  kind: string;
  canDecide: boolean;
}
interface BankChange {
  id: string;
  title: string;
  status: string;
  detail?: string;
  supplierName: string;
  applied: boolean;
  approvers: Person[];
  decisions: Decision[];
  canDecide: boolean;
  request: {
    supplier: string;
    current: string;
    requested: { beneficiary: string; bankName: string; iban: string };
    requestedVia: string;
    phoneOnFile: string;
    phoneInRequest: string;
  } | null;
}
interface Cash {
  fx: { USD: number; EUR: number };
  receivables: Receivable[];
  ageing: { customer: string; values: number[]; total: number }[];
  buckets: string[];
  totals: { receivableUsd: number; overdueUsd: number };
  weeks: string[];
  canSeePayables: boolean;
  canFinance: boolean;
  payables: Payable[];
  payablesTotalEgp?: number;
  approvals: PaymentApproval[];
  bankChanges: BankChange[];
  cashIn: number[];
  cashOut: number[];
  fixedWeeklyEgp?: number;
}

interface Draft {
  mode: "internal" | "customer";
  rule: string;
  to?: string;
  title: string;
  subject?: string;
  body: string;
  confidence: number;
  note?: string;
}

type Dialog =
  | { kind: "reminder"; invoice: Receivable; draft: Draft | null }
  | {
      kind: "decide";
      approval: PaymentApproval | BankChange;
      bank: boolean;
      decision: "Approve" | "Reject";
      reason: string;
      callBack: boolean;
    }
  | { kind: "record"; approval: PaymentApproval; reference: string }
  | { kind: "request"; payable: Payable };

type Row = Record<string, unknown>;
type ReceivableRow = Receivable & Row;
type PayableRow = Payable & Row;

const RULE: Record<string, { label: string; color: "success" | "warning" | "error" }> = {
  allowed: { label: "Follow-ups allowed", color: "success" },
  "one-follow-up": { label: "One follow-up", color: "warning" },
  "do-not-chase": { label: "Do not chase", color: "error" },
};

const usdK = (v: number) => `USD ${(v / 1000).toFixed(v < 10000 ? 1 : 0)}k`;
const egpK = (v: number) => `EGP ${Math.round(v)}k`;

@customElement("gs-cash")
export class GsCash extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: Access;
  @property({ attribute: false }) user!: ViewProps["user"];
  @property() slug?: string;
  @property() docId?: string;

  @state() private data: Cash | null = null;
  @state() private error = "";
  @state() private busy = "";
  @state() private dialog: Dialog | null = null;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<Cash>("/operations/cash");
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

  private async _draftReminder(inv: Receivable) {
    this.dialog = { kind: "reminder", invoice: inv, draft: null };
    try {
      await reading(1000);
      const draft = await api.post<Draft>("/operations/collection-draft", { invoice: inv.id });
      if (this.dialog?.kind === "reminder") this.dialog = { ...this.dialog, draft };
    } catch (e) {
      this.dialog = null;
      toast(errorText(e), "error");
    }
  }

  /** A person sends the reminder (or files the internal one): recorded as a task on the account. */
  private _sendReminder() {
    const d = this.dialog;
    if (d?.kind !== "reminder" || !d.draft) return;
    const { invoice, draft } = d;
    this.dialog = null;
    void this._run(`rem-${invoice.id}`, async () => {
      const internal = draft.mode === "internal";
      await api.create("tasks", {
        title: draft.title,
        type: internal ? "Internal reminder" : "Customer follow-up",
        channel: internal ? "Internal" : "Email",
        due: new Date().toISOString(),
        case: invoice.case ?? undefined,
        customer: invoice.customer,
        who: internal ? "Account owner" : draft.to,
        goal: `Collect ${money(invoice.balance, invoice.currency)} on ${invoice.number}`,
        script: internal ? draft.body : `${draft.subject}\n\n${draft.body}`,
        internalOnly: internal,
        owner: this.user.id,
        createdByRule: "Collection reminder",
        stopCondition: "Payment received",
        ...(internal ? {} : { status: "Done", outcome: { result: "Sent", note: "Reviewed and sent by a person." } }),
      });
      return internal
        ? `Internal reminder created — nothing sent to ${invoice.customerName}.`
        : `Reminder sent to ${invoice.customerName} by you (logged on the account).`;
    });
  }

  private _decide() {
    const d = this.dialog;
    if (d?.kind !== "decide") return;
    this.dialog = null;
    void this._run(`dec-${d.approval.id}`, async () => {
      const current = await api.findByID("approvals", d.approval.id, { depth: 0 });
      const decisions = (current.decisions as Record<string, unknown>[] | undefined) ?? [];
      const reason = d.bank && d.callBack ? `Call-back done on number on file. ${d.reason}`.trim() : d.reason;
      await api.update("approvals", d.approval.id, {
        decisions: [...decisions, { decision: d.decision, reason }],
      });
      return `${d.decision === "Approve" ? "Approved" : "Rejected"}: ${d.approval.title}.`;
    });
  }

  private _applyBank(b: BankChange) {
    if (!b.request) return;
    const r = b.request;
    void this._run(`bank-${b.id}`, async () => {
      await api.update("suppliers", r.supplier, {
        bank: {
          beneficiary: r.requested.beneficiary,
          bankName: r.requested.bankName,
          iban: r.requested.iban,
          verified: true,
          verifiedBy: this.user.id,
          verifiedAt: new Date().toISOString(),
        },
      });
      return `New bank details applied to ${b.supplierName} — verified by two people.`;
    });
  }

  private _recordPayment() {
    const d = this.dialog;
    if (d?.kind !== "record" || !d.approval.po) return;
    const a = d.approval;
    const po = d.approval.po;
    this.dialog = null;
    void this._run(`pay-${a.id}`, async () => {
      await api.create("payments", {
        direction: "out",
        reference: d.reference,
        paidAt: new Date().toISOString(),
        amount: a.amount,
        currency: po.currency,
        purchaseOrder: po.id,
        approval: a.id,
        kind: a.kind,
        status: "Recorded",
      });
      return `Payment ${money(a.amount, po.currency)} to ${po.supplier} recorded against ${po.number}.`;
    });
  }

  private _requestApproval() {
    const d = this.dialog;
    if (d?.kind !== "request") return;
    const p = d.payable;
    this.dialog = null;
    void this._run(`req-${p.id}`, async () => {
      await api.create("approvals", {
        title: `Pay ${p.supplierName} ${money(p.balance, p.currency)} — ${p.po}`,
        type: "Supplier payment",
        case: p.case,
        detail: `PO ${p.po}${p.bill ? ` · bill ${p.bill.number} matched (PO = receipt = bill)` : ""} · due ${day(p.due)} · bank details unchanged.`,
        approvers: ["kb", "mh"],
        subject: { relationTo: "purchase-orders", value: p.id },
      });
      for (const user of ["kb", "mh"])
        await api
          .create("notifications", {
            user,
            title: `Approve payment to ${p.supplierName}`,
            detail: `${money(p.balance, p.currency)} · ${p.po}`,
            kind: "Payment",
            href: "/cash",
          })
          .catch(() => null);
      return `Payment approval requested from Mohamed Helmy or Karim Balbaa.`;
    });
  }

  /* ------------------------------------------------------------ render */

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>Finance · Tue 17 Nov</ui-text>
          <ui-heading level="1" size="page">Receivables & payables</ui-heading>
          <ui-text color="muted"
            >What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here
            people approve and record it.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/approvals">Approvals queue</ui-button>
          <ui-button size="sm" variant="soft" href="/collections/invoices">All invoices</ui-button>
        </ui-flex>
      </ui-flex>
      ${this._tiles(d)}
      <ui-grid fit="lg" gap="4">${this._ageing(d)} ${this._forecast(d)}</ui-grid>
      ${this._collections(d)}
      ${
        d.canSeePayables
          ? html`${this._payables(d)} ${this._approvals(d)} ${this._bank(d)}`
          : html`<ui-alert color="info" variant="soft"
              >Supplier payables, payment approvals and bank details are not visible to Sales.</ui-alert
            >`
      }
      <ui-modal .heading=${this._dialogTitle()} .open=${Boolean(this.dialog)} @ui-close=${() => (this.dialog = null)}>
        ${this._dialogBody(d)}
      </ui-modal>
    </ui-flex>`;
  }

  private _heading(title: string, badge?: TemplateResult | typeof nothing, actions?: TemplateResult | typeof nothing) {
    return html`<ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
      <ui-flex gap="2" align="center" wrap>${title}${badge ?? nothing}</ui-flex>
      ${actions ? html`<ui-flex gap="2" wrap>${actions}</ui-flex>` : nothing}
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

  private _tiles(d: Cash) {
    const overdue = d.receivables.filter((r) => r.daysOverdue > 0);
    const pending = d.approvals.filter((a) => !["Approved", "Rejected"].includes(a.status)).length;
    const net = d.cashIn.reduce((s, v) => s + v, 0) - d.cashOut.reduce((s, v) => s + v, 0);
    return html`<ui-grid fit="xs" gap="4">
      ${this._tile("Receivables", money(d.totals.receivableUsd, "USD"), `${d.receivables.length} open invoices · USD equivalent`)}
      ${this._tile(
        "Overdue",
        money(d.totals.overdueUsd, "USD"),
        `${overdue.length} invoices · ${new Set(overdue.map((o) => o.customer)).size} customers`,
        overdue.length ? "error" : "success",
      )}
      ${
        d.canSeePayables
          ? html`${this._tile("Payables", money(d.payablesTotalEgp ?? 0, "EGP"), `${d.payables.length} supplier balances open`)}
            ${this._tile("Payments to approve", String(pending), "Financial Director or CEO", pending ? "warning" : "success")}
            ${this._tile("Net cash, 8 weeks", egpK(net), "Expected receipts − committed payments − fixed costs", net < 0 ? "error" : "success")}`
          : nothing
      }
    </ui-grid>`;
  }

  private _ageing(d: Cash) {
    // Three series (the chart's limit): not due, 1–30, and 31+ days overdue.
    const series = [
      { name: "Not due", values: d.ageing.map((a) => a.values[0]) },
      { name: "1–30 days", values: d.ageing.map((a) => a.values[1]) },
      { name: "31+ days", values: d.ageing.map((a) => a.values[2] + a.values[3]) },
    ];
    const columns: TableColumn<Row>[] = [
      {
        key: "customer",
        label: "Customer",
        render: (r) => html`<ui-text size="sm" weight="medium">${r.customer}</ui-text>`,
      },
      ...d.buckets.map((b, i) => ({
        key: b,
        label: b,
        render: (r: Row) => {
          const v = (r.values as number[])[i];
          return html`<ui-text
            size="sm"
            align="end"
            .color=${v && i >= 2 ? "error" : v && i === 1 ? "warning" : undefined}
            >${v ? usdK(v) : "—"}</ui-text
          >`;
        },
      })),
      {
        key: "total",
        label: "Total",
        render: (r) => html`<ui-text size="sm" weight="semibold" align="end">${usdK(r.total as number)}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Receivables ageing by customer")}
      <ui-text size="sm" color="muted"
        >Open balances in USD equivalent (USD/EGP ${d.fx.USD}, EUR/EGP ${d.fx.EUR}), by days past due.</ui-text
      >
      <ui-chart
        kind="bars"
        label="Receivables ageing by customer"
        .labels=${d.ageing.map((a) => a.customer.split(" ")[0])}
        .series=${series}
        .format=${usdK}
      ></ui-chart>
      <ui-table size="sm" .columns=${columns} .rows=${d.ageing as unknown as Row[]}></ui-table>
    </ui-card>`;
  }

  private _forecast(d: Cash) {
    const series = [{ name: "Cash in (expected receipts)", values: d.cashIn }];
    if (d.canSeePayables) series.push({ name: "Cash out (payables + fixed costs)", values: d.cashOut });
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Cash in vs out — next 8 weeks")}
      <ui-text size="sm" color="muted"
        >EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week
        later); payments by bill and balance due
        dates${d.fixedWeeklyEgp ? `, plus EGP ${Math.round(d.fixedWeeklyEgp / 1000)}k a week of fixed costs from the budget` : ""}.
        Bills on hold are left out until they match.</ui-text
      >
      <ui-chart
        kind="line"
        label="Cash in vs out, next 8 weeks"
        .labels=${d.weeks}
        .series=${series}
        .format=${egpK}
      ></ui-chart>
    </ui-card>`;
  }

  private _collections(d: Cash) {
    const columns: TableColumn<ReceivableRow>[] = [
      {
        key: "number",
        label: "Invoice",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-link color="primary" .href=${`/collections/invoices/${r.id}`}
              ><ui-text size="sm" weight="semibold">${r.number}</ui-text></ui-link
            >
            <ui-text size="xs" color="muted">${r.customerName}${r.caseId ? ` · ${r.caseId}` : ""}</ui-text>
          </ui-flex>`,
      },
      {
        key: "balance",
        label: "Balance",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${money(r.balance, r.currency)}</ui-text>
            ${r.paid ? html`<ui-text size="xs" color="muted">of ${money(r.amount, r.currency)} · ${money(r.paid, r.currency)} paid</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "due",
        label: "Due",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${day(r.dueDate)}</ui-text>
            <ui-text size="xs" .color=${r.daysOverdue > 30 ? "error" : r.daysOverdue > 0 ? "warning" : "muted"}
              >${r.daysOverdue > 0 ? `${r.daysOverdue} days overdue` : `in ${-r.daysOverdue} days`}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "rule",
        label: "Contact rule",
        render: (r) => {
          const rule = RULE[r.contactRule] ?? RULE.allowed;
          return html`<ui-badge size="sm" variant="soft" .color=${rule.color}>${rule.label}</ui-badge>`;
        },
      },
      {
        key: "einv",
        label: "E-invoice",
        render: (r) =>
          html`<ui-badge size="sm" variant="outline" .color=${statusColor(r.eInvoice)}>${r.eInvoice}</ui-badge>`,
      },
      {
        key: "act",
        label: "Reminder",
        render: (r) =>
          html`<ui-flex direction="col" gap="1" align="start">
            ${
              r.daysOverdue > -5
                ? html`<ui-button
                    size="xs"
                    variant="soft"
                    .color=${r.contactRule === "do-not-chase" ? undefined : "primary"}
                    ?disabled=${Boolean(this.busy)}
                    @click=${() => this._draftReminder(r)}
                    >${r.contactRule === "do-not-chase" ? "Internal reminder" : "Draft reminder"}</ui-button
                  >`
                : html`<ui-text size="xs" color="muted">Not due yet</ui-text>`
            }
            ${r.lastReminder ? html`<ui-text size="xs" color="muted" clamp="2">Last: ${r.lastReminder}</ui-text>` : nothing}
          </ui-flex>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Collections — open invoices", html`<ui-badge size="sm" variant="soft">${d.receivables.length}</ui-badge>`)}
      <ui-text size="sm" color="muted"
        >Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the
        others the AI drafts the email and a person reviews and sends it.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.receivables as ReceivableRow[]}></ui-table>
    </ui-card>`;
  }

  private _payables(d: Cash) {
    const columns: TableColumn<PayableRow>[] = [
      {
        key: "supplier",
        label: "Supplier",
        render: (p) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="semibold">${p.supplierName}</ui-text>
            <ui-text size="xs" color="muted"
              >${p.po}${p.caseId ? html` · <ui-link color="primary" .href=${`/collections/cases/${p.case}/order`}>${p.caseId}</ui-link>` : nothing}${p.bill ? ` · bill ${p.bill.number}` : ""}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "stage",
        label: "Stage",
        render: (p) =>
          html`<ui-flex direction="col" gap="1" align="start">
            <ui-badge
              size="sm"
              variant="soft"
              .color=${p.stage === "Bill on hold" ? "error" : p.stage === "Deposit to pay" || p.stage === "Balance due" ? "warning" : "neutral"}
              >${p.stage}</ui-badge
            >
            ${p.bill?.holdReason ? html`<ui-text size="xs" color="error">${p.bill.holdReason}</ui-text>` : nothing}
            ${
              p.depositPct
                ? html`<ui-text size="xs" color="muted"
                    >Deposit ${p.depositPct}%
                    ${money(p.deposit, p.currency)}${p.paid ? " · paid" : p.depositApproval ? ` · approval ${p.depositApproval.status}` : ""}</ui-text
                  >`
                : nothing
            }
          </ui-flex>`,
      },
      {
        key: "total",
        label: "Total",
        render: (p) => html`<ui-text size="sm" align="end">${money(p.total, p.currency)}</ui-text>`,
      },
      {
        key: "paid",
        label: "Paid",
        render: (p) => html`<ui-text size="sm" align="end">${p.paid ? money(p.paid, p.currency) : "—"}</ui-text>`,
      },
      {
        key: "balance",
        label: "Balance",
        render: (p) => html`<ui-text size="sm" weight="semibold" align="end">${money(p.balance, p.currency)}</ui-text>`,
      },
      { key: "due", label: "Due", render: (p) => html`<ui-text size="sm">${day(p.due)}</ui-text>` },
      {
        key: "act",
        label: "",
        render: (p) => {
          const hasApproval = d.approvals.some((a) => a.po?.id === p.id);
          if (p.stage === "Bill on hold")
            return html`<ui-text size="xs" color="muted">Waits for receipt / credit note</ui-text>`;
          if (hasApproval || p.depositApproval)
            return html`<ui-text size="xs" color="muted">Approval in progress</ui-text>`;
          if (!d.canFinance) return nothing;
          return html`<ui-button
            size="xs"
            variant="soft"
            ?disabled=${Boolean(this.busy)}
            @click=${() => (this.dialog = { kind: "request", payable: p })}
            >Request payment approval</ui-button
          >`;
        },
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Supplier payables", html`<ui-badge size="sm" variant="soft">${d.payables.length}</ui-badge>`)}
      <ui-text size="sm" color="muted"
        >Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't
        match.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.payables as PayableRow[]}></ui-table>
    </ui-card>`;
  }

  private _decisions(list: Decision[]) {
    return list.length
      ? html`<ui-flex direction="col" gap="0"
          >${list.map(
            (x) =>
              html`<ui-text size="xs" .color=${x.decision === "Approve" ? "success" : "error"}
                >${x.decision === "Approve" ? "Approved" : "Rejected"} by
                ${x.name || USERS[x.user] || x.user}${x.at ? ` · ${dayTime(x.at)}` : ""}${x.reason ? ` — ${x.reason}` : ""}</ui-text
              >`,
          )}</ui-flex
        >`
      : nothing;
  }

  private _approvals(d: Cash) {
    return html`<ui-card variant="border" shadow="false">
      ${this._heading("Payments needing approval", html`<ui-badge size="sm" variant="soft">${d.approvals.length}</ui-badge>`)}
      <ui-text size="sm" color="muted"
        >Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and
        records it here with the bank reference.</ui-text
      >
      ${
        d.approvals.length
          ? html`<ui-flex direction="col" gap="4">
              ${d.approvals.map(
                (a) =>
                  html`<ui-flex justify="between" align="start" gap="3" wrap>
                    <ui-flex direction="col" gap="1" shrink>
                      <ui-text size="sm" weight="semibold">${a.title}</ui-text>
                      <ui-text size="xs" color="muted"
                        >${a.type}${a.caseId ? ` · ${a.caseId}` : ""}${a.po ? ` · ${money(a.amount, a.po.currency)}` : ""}
                        · approvers ${a.approvers.map((p) => p.name).join(" or ")}</ui-text
                      >
                      ${a.detail ? html`<ui-text size="xs" color="muted">${a.detail}</ui-text>` : nothing}
                      ${this._decisions(a.decisions)}
                    </ui-flex>
                    <ui-flex gap="2" align="center" wrap>
                      <ui-badge size="sm" variant="soft" .color=${statusColor(a.status)}>${a.status}</ui-badge>
                      ${
                        a.canDecide
                          ? html`<ui-button
                                size="xs"
                                variant="ghost"
                                @click=${() => (this.dialog = { kind: "decide", approval: a, bank: false, decision: "Reject", reason: "", callBack: false })}
                                >Reject</ui-button
                              >
                              <ui-button
                                size="xs"
                                color="primary"
                                @click=${() => (this.dialog = { kind: "decide", approval: a, bank: false, decision: "Approve", reason: "", callBack: false })}
                                >Approve</ui-button
                              >`
                          : nothing
                      }
                      ${
                        a.status === "Approved" && d.canFinance && a.po
                          ? html`<ui-button
                              size="xs"
                              color="primary"
                              variant="soft"
                              @click=${() => (this.dialog = { kind: "record", approval: a, reference: "TRX-88" + String(Date.now()).slice(-3) })}
                              >Record payment</ui-button
                            >`
                          : nothing
                      }
                    </ui-flex>
                  </ui-flex>`,
              )}
            </ui-flex>`
          : html`<ui-text size="sm" color="muted">Nothing waiting.</ui-text>`
      }
    </ui-card>`;
  }

  private _bank(d: Cash) {
    if (!d.bankChanges.length) return nothing;
    return html`${d.bankChanges.map((b) => {
      const approved = b.decisions.filter((x) => x.decision === "Approve");
      const callBackDone = approved.length > 0 || b.decisions.some((x) => /call-back/i.test(x.reason ?? ""));
      const current = b.applied ? 5 : b.status === "Approved" ? 4 : approved.length === 1 ? 3 : callBackDone ? 2 : 1;
      return html`<ui-card variant="border" shadow="false">
        ${this._heading(
          "Bank-detail change — two-person check",
          html`<ui-badge size="sm" variant="soft" .color=${b.applied ? "success" : statusColor(b.status)}
            >${b.applied ? "Applied" : b.status}</ui-badge
          >`,
        )}
        <ui-text size="sm" weight="medium">${b.title}</ui-text>
        <ui-steps
          .current=${current - 1}
          .items=${[
            { label: "Request received" },
            { label: "Call-back on number on file" },
            { label: "First approval" },
            { label: "Second approval" },
            { label: "Applied & verified" },
          ]}
          scrollable
        ></ui-steps>
        ${
          b.request
            ? html`<ui-grid fit="xs" gap="4">
                <ui-flex direction="col" gap="0">
                  <ui-text size="xs" color="muted" uppercase>Current account</ui-text>
                  <ui-text size="sm">${b.request.current}</ui-text>
                </ui-flex>
                <ui-flex direction="col" gap="0">
                  <ui-text size="xs" color="muted" uppercase>Requested</ui-text>
                  <ui-text size="sm">${b.request.requested.bankName} · ${b.request.requested.iban}</ui-text>
                </ui-flex>
                <ui-flex direction="col" gap="0">
                  <ui-text size="xs" color="muted" uppercase>Request came by</ui-text>
                  <ui-text size="sm">${b.request.requestedVia}</ui-text>
                </ui-flex>
                <ui-flex direction="col" gap="0">
                  <ui-text size="xs" color="muted" uppercase>Call back on</ui-text>
                  <ui-text size="sm">${b.request.phoneOnFile}</ui-text>
                  <ui-text size="xs" color="error">Never: ${b.request.phoneInRequest}</ui-text>
                </ui-flex>
              </ui-grid>`
            : nothing
        }
        ${this._decisions(b.decisions)}
        <ui-alert color=${b.applied ? "success" : "warning"} variant="soft"
          >${
            b.applied
              ? `New details applied to ${b.supplierName} and verified. Payments can use them.`
              : `Payments to ${b.supplierName} stay on the old, verified account until two different people — Finance and the CEO — approve after a call-back on the number on file.`
          }</ui-alert
        >
        <ui-flex slot="actions" gap="2" wrap>
          ${
            b.canDecide
              ? html`<ui-button
                    size="sm"
                    variant="ghost"
                    @click=${() => (this.dialog = { kind: "decide", approval: b, bank: true, decision: "Reject", reason: "", callBack: false })}
                    >Reject</ui-button
                  >
                  <ui-button
                    size="sm"
                    color="primary"
                    @click=${() => (this.dialog = { kind: "decide", approval: b, bank: true, decision: "Approve", reason: "", callBack: false })}
                    >Approve after call-back</ui-button
                  >`
              : b.status !== "Approved"
                ? html`<ui-text size="xs" color="muted"
                    >${b.decisions.some((x) => x.user === this.user.id) ? "You have decided — a second, different person must approve." : "Waiting for an approver."}</ui-text
                  >`
                : nothing
          }
          ${
            b.status === "Approved" && !b.applied && d.canFinance
              ? html`<ui-button
                  size="sm"
                  color="primary"
                  ?disabled=${Boolean(this.busy)}
                  @click=${() => this._applyBank(b)}
                  >Apply new bank details</ui-button
                >`
              : nothing
          }
        </ui-flex>
      </ui-card>`;
    })}`;
  }

  /* ------------------------------------------------------------ dialogs */

  private _dialogTitle() {
    const d = this.dialog;
    if (!d) return "";
    if (d.kind === "reminder") return `Collection reminder — ${d.invoice.number}`;
    if (d.kind === "decide") return `${d.decision === "Approve" ? "Approve" : "Reject"}: ${d.approval.title}`;
    if (d.kind === "record") return `Record supplier payment — ${d.approval.po?.number ?? ""}`;
    return `Request payment approval — ${d.payable.supplierName}`;
  }

  private _dialogBody(_data: Cash) {
    const d = this.dialog;
    if (!d) return nothing;
    const cancel = html`<ui-button variant="ghost" size="sm" @click=${() => (this.dialog = null)}>Cancel</ui-button>`;
    if (d.kind === "reminder") {
      const draft = d.draft;
      if (!draft)
        return html`<ui-flex gap="3" align="center" padding="4"
          ><ui-loading color="primary"></ui-loading
          ><ui-text size="sm">Checking ${d.invoice.customerName}'s contact rule and drafting…</ui-text></ui-flex
        >`;
      const internal = draft.mode === "internal";
      return html`<ui-flex direction="col" gap="3">
        <ui-flex gap="2" align="center" wrap>
          <ui-badge size="sm" variant="outline" color="secondary"
            >AI draft · ${Math.round(draft.confidence * 100)}%</ui-badge
          >
          <ui-badge size="sm" variant="soft" .color=${(RULE[draft.rule] ?? RULE.allowed).color}
            >${(RULE[draft.rule] ?? RULE.allowed).label}</ui-badge
          >
        </ui-flex>
        ${
          internal
            ? html`<ui-alert color="warning" variant="soft"
                >${d.invoice.customerName} must not be chased: no customer message is drafted — an internal reminder for
                the account owner instead.</ui-alert
              >`
            : html`<ui-text size="sm">To: <strong>${draft.to}</strong> · Subject: ${draft.subject}</ui-text>`
        }
        <ui-textarea
          legend=${internal ? "Internal reminder" : "Email (edit before sending)"}
          width="full"
          height="48"
          .value=${draft.body}
          @input=${(e: Event) =>
            this.dialog?.kind === "reminder" && this.dialog.draft
              ? (this.dialog = {
                  ...this.dialog,
                  draft: { ...this.dialog.draft, body: (e.target as HTMLTextAreaElement).value },
                })
              : undefined}
        ></ui-textarea>
        ${draft.note ? html`<ui-text size="xs" color="muted">${draft.note}</ui-text>` : nothing}
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button color="primary" size="sm" @click=${() => this._sendReminder()}
            >${internal ? "Create internal reminder" : "Send reminder"}</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    }
    if (d.kind === "decide")
      return html`<ui-flex direction="col" gap="3">
        ${
          d.bank && d.decision === "Approve"
            ? html`<ui-alert color="warning" variant="soft"
                  >Call the supplier back on the number on file
                  (${(d.approval as BankChange).request?.phoneOnFile ?? "—"}) — never on a number from the request — and
                  confirm the new account with them.</ui-alert
                >
                <ui-toggle
                  label="I called back on the number on file and the supplier confirmed the new account"
                  .checked=${d.callBack}
                  @change=${(e: Event) => (this.dialog = { ...d, callBack: (e.target as HTMLInputElement).checked })}
                ></ui-toggle>`
            : nothing
        }
        <ui-textarea
          legend=${d.decision === "Reject" ? "Reason (required)" : "Note (optional)"}
          width="full"
          .value=${d.reason}
          @input=${(e: Event) => (this.dialog = { ...d, reason: (e.target as HTMLTextAreaElement).value })}
        ></ui-textarea>
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button
            size="sm"
            .color=${d.decision === "Approve" ? "primary" : "error"}
            ?disabled=${(d.decision === "Reject" && !d.reason.trim()) || (d.bank && d.decision === "Approve" && !d.callBack)}
            @click=${() => this._decide()}
            >${d.decision === "Approve" ? "Approve" : "Reject"}</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    if (d.kind === "record")
      return html`<ui-flex direction="col" gap="3">
        <ui-text size="sm"
          >${money(d.approval.amount, d.approval.po?.currency)} to ${d.approval.po?.supplier} (${d.approval.kind}) —
          approved. Pay it in the bank first, then record the bank reference here.</ui-text
        >
        <ui-text-input
          legend="Bank reference"
          width="full"
          .value=${d.reference}
          @input=${(e: Event) => (this.dialog = { ...d, reference: (e.target as HTMLInputElement).value })}
        ></ui-text-input>
        <ui-flex justify="end" gap="2">
          ${cancel}
          <ui-button color="primary" size="sm" ?disabled=${!d.reference.trim()} @click=${() => this._recordPayment()}
            >Record payment</ui-button
          >
        </ui-flex>
      </ui-flex>`;
    return html`<ui-flex direction="col" gap="3">
      <ui-text size="sm"
        >${d.payable.supplierName} · ${d.payable.po} · balance
        <strong>${money(d.payable.balance, d.payable.currency)}</strong> due
        ${day(d.payable.due)}${d.payable.bill ? ` · bill ${d.payable.bill.number} ${d.payable.bill.status}` : ""}.</ui-text
      >
      <ui-text size="sm" color="muted">Routed to Mohamed Helmy (Financial Director) or Karim Balbaa (CEO).</ui-text>
      <ui-flex justify="end" gap="2">
        ${cancel}
        <ui-button color="primary" size="sm" @click=${() => this._requestApproval()}>Request approval</ui-button>
      </ui-flex>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-cash": GsCash;
  }
}
