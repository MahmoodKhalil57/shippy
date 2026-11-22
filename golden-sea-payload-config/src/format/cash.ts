import type { KindData, Stat, WidgetScope, Action } from "saastemlycrm-design-system/contracts";
import { decideActions, decisionLines } from "../actions/cash.ts";
import type { BankChange, Cash, CashPayables } from "../endpoints/cash.ts";
import { statusTone } from "./index.ts";

/**
 * Receivables and payables where they span collections or are a workflow: the 8-week cash
 * forecast and net position, matching a remittance, payment approvals and the two-person
 * bank-detail change. What customers and suppliers owe are the invoices' and purchase orders' own
 * fields (../collections/finance.ts, fulfilment.ts). Pure: data in (../endpoints/cash.ts's
 * answers), what a kind draws out.
 */

/**
 * The net cash for the next 8 weeks: a forecast across invoices, supplier POs, bills, payments and
 * the budget's fixed costs (receivables and payables are the invoices' and POs' own figures).
 */
export const position = (d: Cash): Stat[] => {
  const net = d.cashIn.reduce((s, v) => s + v, 0) - d.cashOut.reduce((s, v) => s + v, 0);
  if (!d.canSeePayables) return [];
  return [
    {
      label: "Net cash, 8 weeks",
      value: `EGP ${Math.round(net)}k`,
      note: "Expected receipts − committed payments − fixed costs",
      tone: net < 0 ? "error" : "success",
    },
  ];
};

/**
 * The same 8 weeks as a bridge: expected receipts, less supplier payments, less the budget's fixed
 * costs, to the net (EGP; only for those who may see payables). The forecast's own figures, so the
 * net matches the stat beside it.
 */
export const bridge = (d: Cash): KindData<"waterfall"> | null => {
  if (!d.canSeePayables) return null;
  const k = (v: number) => `EGP ${Math.round(Math.abs(v)).toLocaleString("en-US")}k`;
  const cashIn = d.cashIn.reduce((s, v) => s + v, 0);
  const out = d.cashOut.reduce((s, v) => s + v, 0);
  const fixed = Math.min(out, ((d.fixedWeeklyEgp ?? 0) * d.weeks.length) / 1000);
  const net = cashIn - out;
  return {
    label: "Cash, next 8 weeks",
    note: "Expected receipts less committed supplier payments and the budget's fixed costs",
    steps: [
      { label: "Receipts", value: cashIn * 1000, valueText: k(cashIn) },
      { label: "Suppliers", value: -(out - fixed) * 1000, valueText: k(out - fixed) },
      ...(fixed ? [{ label: "Fixed costs", value: -fixed * 1000, valueText: k(fixed) }] : []),
      { label: "Net cash", value: net * 1000, valueText: k(net), total: true },
    ],
    format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
  };
};

/**
 * A customer's payment advice, read on this device: its invoice numbers and amount are matched to
 * open invoices (by number, or by an equal balance). A person records the payment.
 */
export const remittance = (d: Cash): KindData<"text"> => ({
  head: { tags: [{ label: "On this device" }] },
  muted: true,
  text: "Paste a customer's payment advice or remittance email: the invoice numbers and amount are read on this device, then matched to open invoices (by number, or by an equal balance). A person records the payment.",
  actions: [
    {
      label: "Read and match",
      icon: "sparkles",
      disabled: !d.receivables.length,
      reason: d.receivables.length ? undefined : "No open invoices to match.",
      prompt: "Match a remittance",
      call: { path: "/cash/match" },
      fields: [
        { type: "text", name: "payer", label: "Paid by" },
        {
          type: "text",
          name: "invoices",
          label: "Invoice numbers",
          admin: { description: "Every invoice number mentioned, comma-separated." },
        },
        { type: "number", name: "amount", label: "Amount paid" },
        { type: "text", name: "reference", label: "Bank reference" },
      ],
      extract: {
        label: "Read and match",
        what: "customer remittance advice or payment email",
        placeholder: "Paste the remittance or payment advice…",
        fields: [
          { id: "invoices", label: "Invoice numbers", hint: "every invoice number mentioned, comma-separated" },
          { id: "amount", label: "Amount paid", type: "number" },
          { id: "currency", label: "Currency" },
          { id: "payer", label: "Paid by" },
          { id: "reference", label: "Bank reference" },
        ],
        into: {
          invoices: { field: "invoices" },
          amount: { field: "amount" },
          payer: { field: "payer" },
          reference: { field: "reference" },
        },
      },
      reply: true,
    },
  ],
});

/** Cash in against cash out for the next 8 weeks (cash out only for those who may see payables). */
export const forecast = (d: Cash): KindData<"chart"> => {
  const series = [{ name: "Cash in (expected receipts)", values: d.cashIn.map((v) => v * 1000) }];
  if (d.canSeePayables)
    series.push({ name: "Cash out (payables + fixed costs)", values: d.cashOut.map((v) => v * 1000) });
  return {
    head: {
      subhead: `EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates${
        d.fixedWeeklyEgp
          ? `, plus EGP ${Math.round(d.fixedWeeklyEgp / 1000)}k a week of fixed costs from the budget`
          : ""
      }. Bills on hold are left out until they match.`,
    },
    label: "Cash in vs out, next 8 weeks",
    chart: {
      kind: "line",
      labels: d.weeks,
      series,
      format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
    },
  };
};

/**
 * Each change of a supplier's bank details in progress, one tile each: where it is in the
 * two-person check (Finance and the CEO, after a call-back on the number on file), who decided,
 * and what's left to do. Payments stay on the old account until it's applied.
 */
export const bankChange = (b: BankChange, d: CashPayables, { user }: WidgetScope): KindData<"steps"> => {
  const me = user.id;
  const approved = b.decisions.filter((x) => x.decision === "Approve");
  const callBackDone = approved.length > 0 || b.decisions.some((x) => /call-back/i.test(x.reason ?? ""));
  const current = b.applied ? 5 : b.status === "Approved" ? 4 : approved.length === 1 ? 3 : callBackDone ? 2 : 1;
  const decisions = decisionLines(b.decisions);
  const actions: Action[] = [
    ...(b.canDecide ? decideActions(b, b.request) : []),
    ...(b.status === "Approved" && !b.applied && d.canFinance
      ? [
          {
            label: "Apply new bank details",
            main: true,
            call: { path: "/cash/apply-bank", body: { approval: b.id } },
            // Payments follow these details from now on: it asks first and can't be undone here.
            confirm: {
              heading: `Apply the new bank details to ${b.supplierName}?`,
              text: "Two people approved the change. From now on payments to this supplier go to the new account.",
              label: "Apply details",
            },
            done: `New bank details applied to ${b.supplierName} — verified by two people.`,
          },
        ]
      : []),
  ];
  const waiting =
    !b.canDecide && b.status !== "Approved"
      ? b.decisions.some((x) => x.user === me)
        ? "You have decided — a second, different person must approve."
        : "Waiting for an approver."
      : "";
  const said = [decisions, waiting].filter(Boolean).join("\n");
  return {
    head: { tags: [{ label: b.applied ? "Applied" : b.status, tone: b.applied ? "success" : statusTone(b.status) }] },
    note: said || undefined,
    current: current - 1,
    items: [
      { label: "Request received" },
      { label: "Call-back on number on file" },
      { label: "First approval" },
      { label: "Second approval" },
      { label: "Applied & verified" },
    ],
    alerts: [
      {
        tone: b.applied ? "success" : "warning",
        text: b.applied
          ? `New details applied to ${b.supplierName} and verified. Payments can use them.`
          : `Payments to ${b.supplierName} stay on the old, verified account until two different people — Finance and the CEO — approve after a call-back on the number on file.`,
      },
    ],
    actions,
  };
};

/**
 * What each bank-detail change asks for: the current and requested accounts, how the request came,
 * and the only number to call back on (never the one in the request).
 */
export const bankChangeRequest = (b: BankChange): KindData<"details"> | null | undefined =>
  b.request && {
    items: [
      { label: "Current account", value: b.request.current },
      { label: "Requested", value: `${b.request.requested.bankName} · ${b.request.requested.iban}` },
      { label: "Request came by", value: b.request.requestedVia },
      {
        label: "Call back on",
        value: b.request.phoneOnFile,
        note: `Never: ${b.request.phoneInRequest}`,
        noteTone: "error",
      },
    ],
  };
