import type { Action, KindData, Row, Stat } from "saastemlycrm-design-system/contracts";
import { checkAction, profitActions } from "../actions/case-profit.ts";
import type { CaseProfit, LineState } from "../endpoints/profit.ts";

/**
 * A case's profit and close, read for the widgets of the case profit tab: expected vs actual
 * profit and cost, the FX differences on receipts, claims and the close checklist. Money is EGP
 * rounded to the pound, differences signed (a cost over the estimate is red, under it green),
 * percentages and dates with the time, the same as the insights endpoints write them
 * (../endpoints/insights-shared.ts). Pure: data in (GET /api/case-profit/:id,
 * ../endpoints/profit.ts), what a kind draws out.
 */

export const egp = (n: number) =>
  `EGP ${Math.round(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
export const signed = (n: number, fmt: (n: number) => string) =>
  n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : fmt(0);
export const pct = (n: number) => `${n.toFixed(1)}%`;

/** "17 Nov 2026, 09:30" (UTC); an unreadable date as it came. */
export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}`;
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
 * Above everything: the case closed and settled, or not costed yet (the expected profit is fixed
 * at the customer PO).
 */
export const profitStatus = (p: CaseProfit): KindData<"alert"> | null => {
  const said = [
    ...(p.closed
      ? [
          {
            tone: "success" as const,
            heading: "Case closed and settled",
            text: `${p.closedAt ? `Closed ${formatDateTime(p.closedAt)}. ` : ""}Actual profit recorded; supplier prices and on-time results fed back to the supplier records.`,
          },
        ]
      : []),
    ...(p.costed
      ? []
      : [
          {
            tone: "info" as const,
            heading: "Expected profit is fixed at the customer PO",
            text: `${p.caseId} is at "${p.stage}". The expected profit is taken from the approved quotation once the customer's PO is confirmed; actuals follow as supplier bills arrive.`,
          },
        ]),
  ];
  const main = said.at(-1);
  return main ? { ...main, alerts: said.slice(0, -1) } : null;
};

/**
 * The case's profit: expected at quotation, actual so far (or final), the difference in money and
 * margin points, and the FX difference on receipts.
 */
export const profitFigures = (p: CaseProfit): Stat[] => {
  const diff = p.actual.profit - p.expected.profit;
  const open = p.checks.filter((k) => !k.ok).length;
  return [
    {
      label: "Expected gross profit",
      value: egp(p.expected.profit),
      note: "at quotation",
      share: { value: Math.max(0, p.expected.margin) / 100, text: `${pct(p.expected.margin)} margin` },
    },
    {
      label: p.actual.final ? "Actual gross profit" : "Actual gross profit so far",
      value: egp(p.actual.profit),
      note: `${pct(p.actual.margin)} margin · ${p.actual.final ? "final, every cost is actual" : `${open} close check${open === 1 ? "" : "s"} open`}`,
      tone: p.actual.margin < 15 ? "error" : undefined,
      share:
        p.expected.profit > 0
          ? { value: Math.max(0, p.actual.profit) / p.expected.profit, text: "of the expected profit" }
          : undefined,
    },
    {
      label: "Difference",
      value: signed(Math.round(diff), egp),
      note: "actual against expected",
      tone: diff < 0 ? "error" : "success",
      delta: {
        text: `${signed(p.actual.margin - p.expected.margin, (n) => `${n.toFixed(1)} pts`)} of margin`,
        dir: diff < 0 ? "down" : diff > 0 ? "up" : "flat",
        good: diff >= 0,
      },
    },
    {
      label: "FX difference",
      value: p.currency === "EGP" ? "—" : signed(Math.round(p.fxTotal), egp),
      note:
        p.currency === "EGP"
          ? "invoiced in EGP"
          : `quoted at ${p.quoteRate.toFixed(2)} · today ${p.currentRate.toFixed(2)} EGP/${p.currency}`,
      tone: p.fxTotal < 0 ? "error" : undefined,
      ...(p.currency === "EGP"
        ? {}
        : {
            delta: {
              text: `rate ${p.quoteRate.toFixed(2)} → ${p.currentRate.toFixed(2)}`,
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
      { label: "Checks green", value: done, max: p.checks.length, tone, valueText: `${done} / ${p.checks.length}` },
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
    head: { tags: [{ label: `${done} of ${p.checks.length} green`, tone }] },
    note: "The case closes only when quantities, documents, claims and balances reconcile.",
    items: p.checks.map((k) => {
      const act = checkAction(k, p, a);
      return {
        headline: k.label,
        supporting: k.detail,
        icon: k.ok ? "success" : "warning",
        tags: k.ok ? [{ label: "Done", tone: "success" as const }] : [{ label: "Open", tone: "warning" as const }],
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
    empty: "No claims on this case.",
    items: p.claims.map((c) => ({
      headline: `${c.ref} · ${c.title}`,
      supporting: `${egp(c.amount)} against ${c.against} · ${c.note}${c.settled ? ` · settled by credit note ${c.creditNote}` : ""}`,
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
    label: "Describe damage from a photo",
    imagePrompt:
      "This photo shows goods delivered to a ship. Describe any damage for a claim: which items, how many, what is damaged (dents, leaks, broken seals, wet cartons), and any visible labels, part numbers or batch numbers. Write only what you can see.",
    audioPrompt:
      "This voice note describes goods delivered to a ship. Write down the damage or shortage for a claim: which items, how many, and what is wrong.",
  },
});

const STATE: Record<LineState, { label: string; tone: "success" | "warning" | "neutral" | "info" }> = {
  Confirmed: { label: "Actual", tone: "success" },
  Billed: { label: "Billed, to confirm", tone: "warning" },
  Estimate: { label: "Estimate", tone: "neutral" },
  "Not applicable": { label: "Not applicable", tone: "info" },
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
    state: { text: STATE[l.state].label, tone: STATE[l.state].tone, tag: true },
  }));
  rows.push({
    label: { text: "Total cost", strong: true },
    expected: egpOrNone(p.expected.cost),
    actual: egpOrNone(p.actual.cost),
    difference: diffCell(p.actual.cost - p.expected.cost),
  });
  return {
    head: {
      actions: p.checks.find((k) => k.key === "actuals")?.action && !p.closed ? [profitActions(p).actuals] : [],
    },
    note: "Costs as estimated when the quotation was approved, and as billed. Bills replace estimates once a person confirms them; nothing changes on its own.",
    totals: true,
    columns: [
      { key: "label", label: "Cost", supporting: "detail" },
      { key: "expected", label: "Expected", align: "end" },
      { key: "actual", label: "Actual", align: "end" },
      { key: "difference", label: "Difference", align: "end" },
      { key: "state", label: "Status" },
    ],
    rows,
  };
};

/**
 * Revenue booked at the quotation's rate against each receipt converted at the bank's actual
 * rate: the FX difference per receipt, realised or not. A case invoiced in EGP has none.
 */
export const fxReceipts = (p: CaseProfit): KindData<"table"> => ({
  note: `Revenue is booked at the quotation's rate (${p.quoteRate.toFixed(2)} EGP/${p.currency}); each receipt converts at the bank's actual rate. Expected revenue ${egp(p.expected.revenue)} · actual ${egp(p.actual.revenue)}.`,
  empty: p.currency === "EGP" ? "Invoiced in EGP, so there's no exchange-rate difference." : "No receipts yet.",
  columns: [
    { key: "label", label: "Receipt", supporting: "amount" },
    { key: "rate", label: "Rate", align: "end", supporting: "quoted" },
    { key: "difference", label: "FX difference", align: "end" },
    { key: "realised", label: "" },
  ],
  rows:
    p.currency === "EGP"
      ? []
      : p.fx.map((r) => ({
          label: { text: r.label, href: r.href },
          amount: r.amount,
          rate: r.rate.toFixed(2),
          quoted: `quoted ${r.quoteRate.toFixed(2)}`,
          difference: { ...diffCell(-r.difference), text: signed(Math.round(r.difference), egp) },
          realised: {
            text: r.realised ? "Realised" : "Unrealised",
            tone: r.realised ? "success" : "neutral",
            tag: true,
          },
        })),
});
