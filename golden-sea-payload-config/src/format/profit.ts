import { formatNumber, type Action, type Figure, type KindData, type Row } from "saastemlycrm-design-system/contracts";
import { checkAction, profitActions } from "../actions/case-profit.ts";
import type { CaseProfit, LineState } from "../endpoints/profit.ts";
import { m } from "../i18n/paraglide/messages.js";
import { dateFormat, money, numberFormat } from "./index.ts";

/**
 * A case's profit and close, read for the widgets of the case profit tab: expected vs actual
 * profit and cost, the FX differences on receipts, claims and the close checklist. Money is EGP
 * rounded to the pound, differences signed (a cost over the estimate is red, under it green),
 * percentages and dates with the time, the same as the insights endpoints write them
 * (../endpoints/insights-shared.ts). Pure: data in (GET /api/case-profit/:id,
 * ../endpoints/profit.ts), what a kind draws out.
 */

export const egp = (n: number) => money(Math.round(n), "EGP");
export const signed = (n: number, fmt: (n: number) => string) =>
  n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : fmt(0);
export const pct = (n: number) => formatNumber(n, { unit: "pct", decimals: 1 });
/** An exchange rate or margin points to fixed places ("50.25"). */
const fixed = (n: number, places = 2) =>
  numberFormat({ minimumFractionDigits: places, maximumFractionDigits: places, useGrouping: false }).format(n);

/** "17 Nov 2026, 09:30" (UTC); an unreadable date as it came. */
export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : m.profit_date_time({
        date: dateFormat({ day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(d),
        time: dateFormat({ hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(d),
      });
};

/** An amount, or nothing when there isn't one. */
export const egpOrNone = (v?: number) => (v === undefined ? null : egp(v));

/** A cost difference: over the estimate in red, under it in green. */
export const diffCell = (d: number) => ({
  text: signed(Math.round(d), egp),
  tone: d > 0 ? ("error" as const) : d < 0 ? ("success" as const) : undefined,
});

/** How many of the close checks are green, in green once all of them are. */
const checksGreen = (p: CaseProfit) => {
  const done = p.checks.filter((k) => k.ok).length;
  return { done, tone: done === p.checks.length ? ("success" as const) : ("warning" as const) };
};

/**
 * Above everything: the case closed and settled, not costed yet (the expected profit is fixed at
 * the customer PO), or costed and on its way to close (how many close checks are still open).
 */
export const profitStatus = (p: CaseProfit): KindData<"alert"> => {
  const open = p.checks.filter((k) => !k.ok).length;
  const said = [
    ...(p.closed
      ? [
          {
            tone: "success" as const,
            heading: m.profit_closed_heading(),
            text: p.closedAt ? m.profit_closed_text_at({ at: formatDateTime(p.closedAt) }) : m.profit_closed_text(),
          },
        ]
      : []),
    ...(p.costed
      ? []
      : [
          {
            tone: "info" as const,
            heading: m.profit_not_costed_heading(),
            text: m.profit_not_costed_text({ caseId: p.caseId, stage: p.stage }),
          },
        ]),
  ];
  const main = said.at(-1) ?? {
    tone: open ? ("warning" as const) : ("success" as const),
    heading: open ? m.profit_checks_open({ count: open }) : m.profit_checks_green_heading(),
    text: open ? m.profit_checks_open_text() : m.profit_checks_green_text(),
  };
  return { ...main, alerts: said.slice(0, -1) };
};

/** The profit figures' keys, one tile each, in order (`profitFigures`; their words: `profitFigureName`). */
export const PROFIT_FIGURES = ["Expected gross profit", "Actual gross profit", "Difference", "FX difference"] as const;

/** A profit figure's words in the interface's language. */
export const profitFigureName = (key: (typeof PROFIT_FIGURES)[number]): string =>
  ({
    "Expected gross profit": m.profit_figure_expected,
    "Actual gross profit": m.profit_figure_actual,
    Difference: m.profit_figure_difference,
    "FX difference": m.profit_figure_fx,
  })[key]();

/**
 * The case's profit: expected at quotation, actual so far (or final), the difference in money and
 * margin points, and the FX difference on receipts. Until the case is costed, all show "—".
 */
export const profitFigures = (p: CaseProfit): Figure<(typeof PROFIT_FIGURES)[number]>[] => {
  if (!p.costed) return [];
  const diff = p.actual.profit - p.expected.profit;
  const open = p.checks.filter((k) => !k.ok).length;
  return [
    {
      key: "Expected gross profit",
      label: profitFigureName("Expected gross profit"),
      value: egp(p.expected.profit),
      note: m.profit_at_quotation(),
      share: { value: Math.max(0, p.expected.margin) / 100, text: m.profit_margin({ pct: pct(p.expected.margin) }) },
    },
    {
      key: "Actual gross profit",
      label: profitFigureName("Actual gross profit"),
      value: egp(p.actual.profit),
      note: p.actual.final
        ? m.profit_actual_final({ pct: pct(p.actual.margin) })
        : m.profit_actual_so_far({ pct: pct(p.actual.margin), count: open }),
      tone: p.actual.margin < 15 ? "error" : undefined,
      share:
        p.expected.profit > 0
          ? { value: Math.max(0, p.actual.profit) / p.expected.profit, text: m.profit_of_expected() }
          : undefined,
    },
    {
      key: "Difference",
      label: profitFigureName("Difference"),
      value: signed(Math.round(diff), egp),
      note: m.profit_actual_against_expected(),
      tone: diff < 0 ? "error" : "success",
      delta: {
        text: m.profit_margin_points({ points: signed(p.actual.margin - p.expected.margin, (n) => fixed(n, 1)) }),
        dir: diff < 0 ? "down" : diff > 0 ? "up" : "flat",
        good: diff >= 0,
      },
    },
    {
      key: "FX difference",
      label: profitFigureName("FX difference"),
      value: p.currency === "EGP" ? "—" : signed(Math.round(p.fxTotal), egp),
      note:
        p.currency === "EGP"
          ? m.profit_invoiced_egp()
          : m.profit_fx_note({ quoted: fixed(p.quoteRate), today: fixed(p.currentRate), currency: p.currency }),
      tone: p.fxTotal < 0 ? "error" : undefined,
      ...(p.currency === "EGP"
        ? {}
        : {
            delta: {
              text: m.profit_rate_change({ from: fixed(p.quoteRate), to: fixed(p.currentRate) }),
              dir:
                p.currentRate > p.quoteRate
                  ? ("up" as const)
                  : p.currentRate < p.quoteRate
                    ? ("down" as const)
                    : ("flat" as const),
              good: p.fxTotal >= 0,
            },
          }),
    },
  ];
};

/** How many of the close checks are green: the case closes only when all of them are. */
export const closeProgress = (p: CaseProfit): KindData<"gauges"> => {
  const { done, tone } = checksGreen(p);
  return {
    items: [
      {
        label: m.profit_checks_green_label(),
        value: done,
        max: p.checks.length,
        tone,
        valueText: m.profit_done_of({ done, total: p.checks.length }),
      },
    ],
  };
};

/**
 * The close checklist: quantities, documents, claims and balances, each green or open with its
 * sources and the action that turns it green; "Close case" once every check is.
 */
export const closeChecklist = (p: CaseProfit): KindData<"list"> => {
  const a = profitActions(p);
  const { done, tone } = checksGreen(p);
  return {
    head: { tags: [{ label: m.profit_green_of({ done, total: p.checks.length }), tone }] },
    note: m.profit_checklist_note(),
    items: p.checks.map((k) => {
      const act = checkAction(k, p, a);
      return {
        headline: k.label,
        supporting: k.detail,
        icon: k.ok ? "success" : "warning",
        tags: k.ok
          ? [{ label: m.profit_check_done(), tone: "success" as const }]
          : [{ label: m.profit_check_open(), tone: "warning" as const }],
        actions: [...k.sources.map((s): Action => ({ label: s.label, href: s.href })), ...(act ? [act] : [])],
      };
    }),
    actions: p.closed ? [] : [a.close],
  };
};

/**
 * The case's claims against suppliers, each settled by a credit note against the replacement
 * cost; finance records the credit note. A damage photo is described by `damageReader`.
 */
export const claims = (p: CaseProfit): KindData<"list"> => {
  const a = profitActions(p);
  return {
    empty: m.profit_claims_empty(),
    items: p.claims.map((c) => ({
      headline: `${c.ref} · ${c.title}`,
      supporting: c.settled
        ? m.profit_claim_settled({ amount: egp(c.amount), against: c.against, note: c.note, creditNote: c.creditNote })
        : m.profit_claim({ amount: egp(c.amount), against: c.against, note: c.note }),
      dot: c.settled ? "success" : "warning",
      href: c.settled ? c.href : undefined,
      actions: !c.settled && p.canAct ? [a.claim(c.ref)!] : undefined,
    })),
  };
};

/**
 * For a claim: the on-device AI describes damage from a photo of the delivered goods (or a voice
 * note), writing only what it can see, for a person to use.
 */
export const damageReader = (): KindData<"custom"> => ({
  element: "ui-ai-read-file",
  props: {
    label: m.profit_damage_label(),
    imagePrompt: m.profit_damage_image_prompt(),
    audioPrompt: m.profit_damage_audio_prompt(),
  },
});

/** A cost line's state (the endpoint's value) in words, with its tone. */
const STATE: Record<LineState, { label: () => string; tone: "success" | "warning" | "neutral" | "info" }> = {
  Confirmed: { label: m.profit_state_actual, tone: "success" },
  Billed: { label: m.profit_state_billed, tone: "warning" },
  Estimate: { label: m.profit_state_estimate, tone: "neutral" },
  "Not applicable": { label: m.profit_state_not_applicable, tone: "info" },
};

/**
 * Each cost as estimated when the quotation was approved and as billed, with the difference and
 * the total. Bills replace estimates only when a person confirms them ("Confirm actuals").
 */
export const costLines = (p: CaseProfit): KindData<"table"> => {
  const rows: Row[] = p.lines.map((l) => ({
    label: { text: l.label, href: l.href, strong: true },
    detail: l.note ? { text: `${l.detail} · ${l.note}`, tone: "warning" } : l.detail,
    expected: egpOrNone(l.expected),
    actual: egpOrNone(l.actual),
    difference: l.actual === undefined ? null : diffCell(l.actual - l.expected),
    state: { text: STATE[l.state].label(), tone: STATE[l.state].tone, tag: true },
  }));
  rows.push({
    label: { text: m.profit_total_cost(), strong: true },
    expected: egpOrNone(p.expected.cost),
    actual: egpOrNone(p.actual.cost),
    difference: diffCell(p.actual.cost - p.expected.cost),
  });
  return {
    head: {
      actions: p.checks.find((k) => k.key === "actuals")?.action && !p.closed ? [profitActions(p).actuals] : [],
    },
    note: m.profit_costs_note(),
    totals: true,
    columns: [
      { key: "label", label: m.profit_col_cost(), supporting: "detail" },
      { key: "expected", label: m.profit_col_expected(), align: "end" },
      { key: "actual", label: m.profit_col_actual(), align: "end" },
      { key: "difference", label: m.profit_col_difference(), align: "end" },
      { key: "state", label: m.profit_col_status() },
    ],
    rows,
  };
};

/**
 * Revenue booked at the quotation's rate against each receipt converted at the bank's actual
 * rate: the FX difference per receipt, realised or not. A case invoiced in EGP has none.
 */
export const fxReceipts = (p: CaseProfit): KindData<"table"> => ({
  note: m.profit_fx_table_note({
    rate: fixed(p.quoteRate),
    currency: p.currency,
    expected: egp(p.expected.revenue),
    actual: egp(p.actual.revenue),
  }),
  empty: p.currency === "EGP" ? m.profit_fx_empty_egp() : m.profit_fx_empty(),
  columns: [
    { key: "label", label: m.profit_col_receipt(), supporting: "amount" },
    { key: "rate", label: m.profit_col_rate(), align: "end", supporting: "quoted" },
    { key: "difference", label: m.profit_col_fx(), align: "end" },
    { key: "realised", label: "" },
  ],
  rows:
    p.currency === "EGP"
      ? []
      : p.fx.map((r) => ({
          label: { text: r.label, href: r.href },
          amount: r.amount,
          rate: fixed(r.rate),
          quoted: m.profit_quoted_rate({ rate: fixed(r.quoteRate) }),
          difference: { ...diffCell(-r.difference), text: signed(Math.round(r.difference), egp) },
          realised: {
            text: r.realised ? m.profit_realised() : m.profit_unrealised(),
            tone: r.realised ? "success" : "neutral",
            tag: true,
          },
        })),
});
