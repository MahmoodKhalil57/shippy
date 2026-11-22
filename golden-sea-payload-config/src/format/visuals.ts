import type { KindData } from "saastemlycrm-design-system/contracts";
import type { Pricing } from "../endpoints/commercial.ts";
import type { Visuals } from "../endpoints/visuals.ts";
import * as link from "../links.ts";

/**
 * The dashboards' shapes (GET /api/visuals, ../endpoints/visuals.ts) and the pricing tab's
 * (GET /api/commercial/cases/:id/pricing): pure, data in, what a kind draws out. Each says in
 * words what it shows; the shapes add the glance and the interaction (pointing at a part reads it,
 * choosing one opens it).
 */

const usdK = (v: number) => `USD ${v.toFixed(1)}k`;
const egpK = (v: number) => `EGP ${Math.round(Math.abs(v) / 1000)}k`;
const signedK = (v: number) => `${v < 0 ? "−" : "+"}${egpK(v)}`;

/** Quote deadlines and arrivals, soonest first, each draining live. */
export const deadlines = (v: Visuals): KindData<"countdown"> => ({
  label: "Deadlines and arrivals",
  now: `${v.today}T09:30:00.000Z`,
  items: v.deadlines,
});

/** This month: quotes due, arrivals, deliveries and (money roles) invoices falling due. */
export const calendar = (v: Visuals): KindData<"month"> => ({
  label: "This month",
  month: v.month,
  today: v.today,
  events: v.calendar,
});

/** The figures management steers by, against their targets. */
export const targets = (v: Visuals): KindData<"bullet"> => ({
  note: "Each bar against its target (the tick); the shading reads poor, fair, good",
  items: v.targets,
});

/** The latest quote turnaround on a dial: green at the 1-day target, amber to 2 days, red past it. */
export const turnaroundDial = (v: Visuals): KindData<"dial"> => ({
  label: "Quote turnaround",
  value: v.turnaround,
  max: 4,
  valueText: `${v.turnaround} d`,
  caption: "median, this week · target 1 d",
  zones: [
    { to: 1, tone: "success" },
    { to: 2, tone: "warning" },
    { to: 4, tone: "error" },
  ],
});

/** Time to acknowledge a new RFQ on a dial: green within 15 minutes. */
export const ackDial = (v: Visuals): KindData<"dial"> => ({
  label: "Time to acknowledge",
  value: v.ack,
  max: 60,
  valueText: `${v.ack} min`,
  caption: "median, new RFQs · target 15 min",
  zones: [
    { to: 15, tone: "success" },
    { to: 30, tone: "warning" },
    { to: 60, tone: "error" },
  ],
});

/** The 12 weeks' win rate as 100 cells. */
export const winWaffle = (v: Visuals): KindData<"waffle"> => {
  const t = v.targets[0]!;
  return {
    label: "Win rate",
    value: t.value,
    max: 100,
    valueText: t.valueText,
    caption: `of quoted cases won, 12 weeks · target ${t.targetText}`,
  };
};

/** Receivables by customer, sized by what they owe (money roles). */
export const receivablesMap = (v: Visuals): KindData<"treemap"> | null =>
  v.receivables.length
    ? {
        label: "Receivables by customer",
        items: v.receivables.map((r) => ({ ...r, valueText: usdK(r.value), href: link.list("invoices") })),
        total: usdK(v.receivables.reduce((t, r) => t + r.value, 0)),
      }
    : null;

/** October's gross profit, from what the quotes expected to what the bills made it (money roles). */
export const gpBridge = (v: Visuals): KindData<"waterfall"> | null =>
  v.gp.length
    ? {
        label: "Gross profit, October: expected to actual",
        note: "Where the profit went between the quotes and the bills",
        steps: v.gp.map((s) => ({ ...s, valueText: s.total ? egpK(s.value) : signedK(s.value) })),
        format: { unit: "money", currency: "EGP", compact: true },
        fit: true,
      }
    : null;

// ---------------------------------------------------------------- the pricing tab

const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

/** How the selling price is built: cost, shared charges, profit, the discount. */
export const priceBuildUp = (P: Pricing): KindData<"waterfall"> => {
  const t = P.totals;
  return {
    label: "How the price is built",
    steps: [
      { label: "Supplier cost", value: t.costEGP, valueText: egp(t.costEGP) },
      { label: "Shared charges", value: t.landedEGP - t.costEGP, valueText: egp(t.landedEGP - t.costEGP) },
      { label: "Profit", value: t.grossEGP - t.landedEGP, valueText: egp(t.grossEGP - t.landedEGP) },
      ...(t.discountEGP ? [{ label: "Discount", value: -t.discountEGP, valueText: `−${egp(t.discountEGP)}` }] : []),
      { label: "Selling price", value: t.sellEGP, valueText: egp(t.sellEGP), total: true },
    ],
    format: { unit: "money", currency: "EGP", compact: true },
  };
};

/** The quote's margin on a dial against the policy: red under the minimum, amber under the target. */
export const marginDial = (P: Pricing): KindData<"dial"> => {
  const max = Math.max(40, Math.ceil(P.totals.marginPct / 10) * 10);
  return {
    label: "Margin",
    value: P.totals.marginPct,
    max,
    valueText: pct(P.totals.marginPct),
    caption: `policy: minimum ${P.policy.minPct}%, target ${P.policy.targetPct}%`,
    zones: [
      { to: P.policy.minPct, tone: "error" },
      { to: P.policy.targetPct, tone: "warning" },
      { to: max, tone: "success" },
    ],
  };
};

/**
 * What if the margin, the discount or the rate moved: the selling price, its margin after the
 * discount and the profit, recomputed as the sliders move, each against the policy.
 */
export const pricingWhatIf = (P: Pricing): KindData<"whatif"> => {
  const t = P.totals;
  const min = P.policy.minPct;
  const target = P.policy.targetPct;
  return {
    label: "What if",
    note: "Try a margin, a discount and an exchange rate; nothing is saved",
    inputs: [
      {
        key: "margin",
        label: "Margin before discount",
        min: 0,
        max: 50,
        step: 0.5,
        value: Math.round((t.grossEGP ? ((t.grossEGP - t.landedEGP) / t.grossEGP) * 100 : target) * 2) / 2,
        format: { unit: "pct" },
      },
      {
        key: "discount",
        label: "Customer discount",
        min: 0,
        max: Math.max(10, P.policy.maxDiscountPct + 5),
        step: 0.5,
        value: P.discountPct,
        format: { unit: "pct" },
      },
      {
        key: "fx",
        label: `Rate (EGP per ${P.currency})`,
        min: Math.round(P.fx * 0.9 * 100) / 100,
        max: Math.round(P.fx * 1.1 * 100) / 100,
        step: 0.05,
        value: P.fx,
        format: { decimals: 2 },
      },
    ],
    compute: ({ margin, discount, fx }) => {
      const gross = t.landedEGP / Math.max(0.01, 1 - (margin ?? 0) / 100);
      const sell = gross * (1 - (discount ?? 0) / 100);
      const profit = sell - t.landedEGP;
      const real = sell > 0 ? (profit / sell) * 100 : 0;
      return [
        {
          label: `Selling price (${P.currency})`,
          value: `${P.currency} ${Math.round(sell / (fx || 1)).toLocaleString("en-US")}`,
          note: egp(sell),
        },
        {
          label: "Margin after discount",
          value: pct(real),
          tone: real < min ? "error" : real < target ? "warning" : "success",
          note: real < min ? `under the ${min}% minimum: needs approval` : `target ${target}%`,
        },
        { label: "Gross profit", value: egp(profit), tone: profit < 0 ? "error" : undefined },
        {
          label: "Discount",
          value: pct(discount ?? 0),
          tone: (discount ?? 0) > P.policy.maxDiscountPct ? "warning" : undefined,
          note: `policy maximum ${P.policy.maxDiscountPct}%`,
        },
      ];
    },
  };
};
