import { formatNumber, type KindData, type WidgetScope } from "saastemlycrm-design-system/contracts";
import type { Pricing } from "../endpoints/commercial.ts";
import type { Visuals } from "../endpoints/visuals.ts";
import { m } from "../i18n/paraglide/messages.js";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import * as link from "../links.ts";
import { count, money, numberFormat } from "./index.ts";

const MONEY_ROLES: readonly string[] = ["management", "finance-director", "operations"];
export const seesMoney = ({ user }: WidgetScope) => MONEY_ROLES.includes(user.role ?? "");

const plain = (n: number) => numberFormat({ useGrouping: false, maximumFractionDigits: 20 }).format(n);
const fixed = (n: number, places: number) =>
  numberFormat({ useGrouping: false, minimumFractionDigits: places, maximumFractionDigits: places }).format(n);

const usdK = (v: number) => m.index_money_k({ currency: "USD", amount: fixed(v, 1) });
const egpK = (v: number) => m.index_money_k({ currency: "EGP", amount: plain(Math.round(Math.abs(v) / 1000)) });
const signedK = (v: number) => `${v < 0 ? "−" : "+"}${egpK(v)}`;

function countdownNow(today: string): string {
  if (IS_TEMP_MOCK) {
    return `${today}T09:30:00.000Z`;
  } else {
    throw new TempMockError("the countdowns' start: the current time, not 09:30 on the demo's day");
  }
}

export const deadlines = (v: Visuals): KindData<"countdown"> => ({
  label: m.visuals_deadlines(),
  now: countdownNow(v.today),
  items: v.deadlines,
});

export const calendar = (v: Visuals): KindData<"month"> => ({
  label: m.visuals_this_month(),
  month: v.month,
  today: v.today,
  events: v.calendar,
});

export const targets = (v: Visuals): KindData<"bullet"> => ({
  note: m.visuals_targets_note(),
  items: v.targets,
});

export const turnaroundDial = (v: Visuals): KindData<"dial"> => ({
  label: m.visuals_turnaround(),
  value: v.turnaround,
  max: 4,
  valueText: m.visuals_days({ value: plain(v.turnaround) }),
  caption: m.visuals_turnaround_caption(),
  zones: [
    { to: 1, tone: "success" },
    { to: 2, tone: "warning" },
    { to: 4, tone: "error" },
  ],
});

export const ackDial = (v: Visuals): KindData<"dial"> => ({
  label: m.visuals_ack(),
  value: v.ack,
  max: 60,
  valueText: m.visuals_minutes({ value: plain(v.ack) }),
  caption: m.visuals_ack_caption(),
  zones: [
    { to: 15, tone: "success" },
    { to: 30, tone: "warning" },
    { to: 60, tone: "error" },
  ],
});

export const winWaffle = (v: Visuals): KindData<"waffle"> => {
  const t = v.targets[0]!;
  return {
    label: m.visuals_win_rate(),
    value: t.value,
    max: 100,
    valueText: t.valueText,
    caption: m.visuals_win_caption({ target: t.targetText ?? "" }),
  };
};

export const receivablesMap = (v: Visuals): KindData<"treemap"> | null =>
  v.receivables.length
    ? {
        label: m.visuals_receivables(),
        items: v.receivables.map((r) => ({ ...r, valueText: usdK(r.value), href: link.list("invoices") })),
        total: usdK(v.receivables.reduce((t, r) => t + r.value, 0)),
      }
    : null;

export const gpBridge = (v: Visuals): KindData<"waterfall"> | null =>
  v.gp.length
    ? {
        label: m.visuals_gp_bridge(),
        note: m.visuals_gp_bridge_note(),
        steps: v.gp.map((s) => ({ ...s, valueText: s.total ? egpK(s.value) : signedK(s.value) })),
        format: { unit: "money", currency: "EGP", compact: true },
        fit: true,
      }
    : null;

const egp = (n: number) => money(Math.round(n), "EGP");
const pct = (n: number) => formatNumber(n, { unit: "pct", decimals: 1 });

export const priceBuildUp = (P: Pricing): KindData<"waterfall"> => {
  const t = P.totals;
  return {
    label: m.visuals_price_built(),
    steps: [
      { label: m.visuals_supplier_cost(), value: t.costEGP, valueText: egp(t.costEGP) },
      {
        label: m.visuals_shared_charges(),
        value: t.landedEGP - t.costEGP,
        valueText: egp(t.landedEGP - t.costEGP),
      },
      { label: m.visuals_profit(), value: t.grossEGP - t.landedEGP, valueText: egp(t.grossEGP - t.landedEGP) },
      ...(t.discountEGP
        ? [{ label: m.visuals_discount(), value: -t.discountEGP, valueText: `−${egp(t.discountEGP)}` }]
        : []),
      { label: m.visuals_selling_price(), value: t.sellEGP, valueText: egp(t.sellEGP), total: true },
    ],
    format: { unit: "money", currency: "EGP", compact: true },
  };
};

export const marginDial = (P: Pricing): KindData<"dial"> => {
  const max = Math.max(40, Math.ceil(P.totals.marginPct / 10) * 10);
  return {
    label: m.visuals_margin(),
    value: P.totals.marginPct,
    max,
    valueText: pct(P.totals.marginPct),
    caption: m.visuals_margin_caption({ min: plain(P.policy.minPct), target: plain(P.policy.targetPct) }),
    zones: [
      { to: P.policy.minPct, tone: "error" },
      { to: P.policy.targetPct, tone: "warning" },
      { to: max, tone: "success" },
    ],
  };
};

export const pricingWhatIf = (P: Pricing): KindData<"whatif"> => {
  const t = P.totals;
  const min = P.policy.minPct;
  const target = P.policy.targetPct;
  return {
    label: m.visuals_what_if(),
    note: m.visuals_what_if_note(),
    inputs: [
      {
        key: "margin",
        label: m.visuals_margin_before(),
        min: 0,
        max: 50,
        step: 0.5,
        value: Math.round((t.grossEGP ? ((t.grossEGP - t.landedEGP) / t.grossEGP) * 100 : target) * 2) / 2,
        format: { unit: "pct" },
      },
      {
        key: "discount",
        label: m.visuals_customer_discount(),
        min: 0,
        max: Math.max(10, P.policy.maxDiscountPct + 5),
        step: 0.5,
        value: P.discountPct,
        format: { unit: "pct" },
      },
      {
        key: "fx",
        label: m.visuals_rate({ currency: P.currency }),
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
          label: m.visuals_selling_price_in({ currency: P.currency }),
          value: m.index_money({ currency: P.currency, amount: count(Math.round(sell / (fx || 1))) }),
          note: egp(sell),
        },
        {
          label: m.visuals_margin_after(),
          value: pct(real),
          tone: real < min ? "error" : real < target ? "warning" : "success",
          note: real < min ? m.visuals_under_minimum({ min: plain(min) }) : m.visuals_target({ target: plain(target) }),
        },
        { label: m.visuals_gross_profit(), value: egp(profit), tone: profit < 0 ? "error" : undefined },
        {
          label: m.visuals_discount(),
          value: pct(discount ?? 0),
          tone: (discount ?? 0) > P.policy.maxDiscountPct ? "warning" : undefined,
          note: m.visuals_policy_max({ max: plain(P.policy.maxDiscountPct) }),
        },
      ];
    },
  };
};
