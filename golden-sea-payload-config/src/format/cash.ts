import type { Figure, KindData, WidgetScope, Action } from "saastemlycrm-design-system/contracts";
import { decideActions, decisionLines } from "../actions/cash.ts";
import type { BankChange, Cash, CashPayables } from "../endpoints/cash.ts";
import { m } from "../i18n/paraglide/messages.js";
import { numberFormat, statusTone, thousands } from "./index.ts";

export const CASH_FIGURES = ["Net cash, 8 weeks"] as const;
type CashFigure = (typeof CASH_FIGURES)[number];

export const cashFigureName = (key: CashFigure): string => ({ "Net cash, 8 weeks": m.cash_net_8_weeks() })[key] ?? key;

const APPROVAL_STATUS: Record<string, () => string> = {
  Pending: m.cash_status_pending,
  "Approved 1 of 2": m.cash_status_approved_1_of_2,
  Approved: m.cash_status_approved,
  Rejected: m.cash_status_rejected,
};

const kEgp = (k: number) =>
  m.index_money_k({
    currency: "EGP",
    amount: numberFormat({ maximumFractionDigits: 0, useGrouping: false }).format(k),
  });

export const position = (d: Cash): Figure<CashFigure>[] => {
  const net = d.cashIn.reduce((s, v) => s + v, 0) - d.cashOut.reduce((s, v) => s + v, 0);
  if (!d.canSeePayables) return [];
  return [
    {
      key: "Net cash, 8 weeks",
      label: cashFigureName("Net cash, 8 weeks"),
      value: kEgp(Math.round(net)),
      note: m.cash_net_note(),
      tone: net < 0 ? "error" : "success",
      trend: {
        labels: d.weeks,
        values: d.cashIn.map((v, i) => (v - (d.cashOut[i] ?? 0)) * 1000),
        format: { unit: "money", currency: "EGP", compact: true },
      },
    },
  ];
};

export const bridge = (d: Cash): KindData<"waterfall"> | null => {
  if (!d.canSeePayables) return null;
  const k = (v: number) => thousands(Math.abs(v));
  const cashIn = d.cashIn.reduce((s, v) => s + v, 0);
  const out = d.cashOut.reduce((s, v) => s + v, 0);
  const fixed = Math.min(out, ((d.fixedWeeklyEgp ?? 0) * d.weeks.length) / 1000);
  const net = cashIn - out;
  return {
    label: m.cash_bridge_label(),
    note: m.cash_bridge_note(),
    steps: [
      { label: m.cash_receipts(), value: cashIn * 1000, valueText: k(cashIn) },
      { label: m.cash_suppliers(), value: -(out - fixed) * 1000, valueText: k(out - fixed) },
      ...(fixed ? [{ label: m.cash_fixed_costs(), value: -fixed * 1000, valueText: k(fixed) }] : []),
      { label: m.cash_net_cash(), value: net * 1000, valueText: k(net), total: true },
    ],
    format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
  };
};

export const remittance = (d: Cash): KindData<"text"> => ({
  head: { tags: [{ label: m.cash_on_this_device() }] },
  muted: true,
  text: m.cash_remittance_text(),
  actions: [
    {
      label: m.cash_read_and_match(),
      icon: "sparkles",
      disabled: !d.receivables.length,
      reason: d.receivables.length ? undefined : m.cash_no_open_invoices(),
      prompt: m.cash_match_prompt(),
      call: { path: "/cash/match" },
      fields: [
        { type: "text", name: "payer", label: m.cash_paid_by() },
        {
          type: "text",
          name: "invoices",
          label: m.cash_invoice_numbers(),
          admin: { description: m.cash_invoice_numbers_hint() },
        },
        { type: "number", name: "amount", label: m.cash_amount_paid() },
        { type: "text", name: "reference", label: m.cash_bank_reference() },
      ],
      extract: {
        label: m.cash_read_and_match(),
        what: "customer remittance advice or payment email",
        placeholder: m.cash_remittance_placeholder(),
        fields: [
          { id: "invoices", label: m.cash_invoice_numbers(), hint: "every invoice number mentioned, comma-separated" },
          { id: "amount", label: m.cash_amount_paid(), type: "number" },
          { id: "currency", label: m.cash_currency() },
          { id: "payer", label: m.cash_paid_by() },
          { id: "reference", label: m.cash_bank_reference() },
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

export const forecast = (d: Cash): KindData<"chart"> => {
  const series = [{ name: m.cash_series_in(), values: d.cashIn.map((v) => v * 1000) }];
  if (d.canSeePayables) series.push({ name: m.cash_series_out(), values: d.cashOut.map((v) => v * 1000) });
  return {
    head: {
      subhead: d.fixedWeeklyEgp
        ? m.cash_forecast_subhead_fixed({ fixed: kEgp(Math.round(d.fixedWeeklyEgp / 1000)) })
        : m.cash_forecast_subhead(),
    },
    label: m.cash_forecast_label(),
    chart: {
      kind: "line",
      labels: d.weeks,
      series,
      format: { unit: "money", currency: "EGP", compact: true, decimals: 0 },
    },
  };
};

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
            label: m.cash_apply_bank_details(),
            main: true,
            call: { path: "/cash/apply-bank", body: { approval: b.id } },
            confirm: {
              heading: m.cash_apply_heading({ supplier: b.supplierName }),
              text: m.cash_apply_text(),
              label: m.cash_apply_details(),
            },
            done: m.cash_apply_done({ supplier: b.supplierName }),
          },
        ]
      : []),
  ];
  const waiting =
    !b.canDecide && b.status !== "Approved"
      ? b.decisions.some((x) => x.user === me)
        ? m.cash_you_decided()
        : m.cash_waiting_for_approver()
      : "";
  const said = [decisions, waiting].filter(Boolean).join("\n");
  return {
    head: {
      tags: [
        {
          label: b.applied ? m.cash_applied() : (APPROVAL_STATUS[b.status]?.() ?? b.status),
          tone: b.applied ? "success" : statusTone(b.status),
        },
      ],
    },
    note: said || undefined,
    current: current - 1,
    items: [
      { label: m.cash_step_request_received() },
      { label: m.cash_step_call_back() },
      { label: m.cash_step_first_approval() },
      { label: m.cash_step_second_approval() },
      { label: m.cash_step_applied() },
    ],
    alerts: [
      {
        tone: b.applied ? "success" : "warning",
        text: b.applied
          ? m.cash_applied_alert({ supplier: b.supplierName })
          : m.cash_held_alert({ supplier: b.supplierName }),
      },
    ],
    actions,
  };
};

export const bankChangeRequest = (b: BankChange): KindData<"details"> | null | undefined =>
  b.request && {
    items: [
      { label: m.cash_current_account(), value: b.request.current },
      {
        label: m.cash_requested(),
        value: m.cash_requested_value({ bank: b.request.requested.bankName, iban: b.request.requested.iban }),
      },
      { label: m.cash_request_came_by(), value: b.request.requestedVia },
      {
        label: m.cash_call_back_on(),
        value: b.request.phoneOnFile,
        note: m.cash_never({ phone: b.request.phoneInRequest }),
        noteTone: "error",
      },
    ],
  };
