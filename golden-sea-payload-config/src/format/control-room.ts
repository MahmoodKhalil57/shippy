import {
  formatNumber,
  type KindData,
  type NumberFormat,
  type Stat,
  type ViewHeader,
} from "saastemlycrm-design-system/contracts";
import type { Briefing } from "../endpoints/assistant.ts";
import type { ControlRoom, CrChart, CrRanked, CrWidget, Unit } from "../endpoints/control-room.ts";
import * as link from "../links.ts";

/**
 * The management dashboards (GET /api/control-room, ../endpoints/control-room.ts) and the 07:00
 * briefing (GET /api/briefing), read for the widgets that show them: the key figures, each
 * dashboard (a trend chart or a ranking: one tile each, titled by the data; profit & cash only for
 * management and finance), the briefing and "Ask Golden Sea". Pure: data in, what a kind draws
 * out. Live cases per owner and the supplier table read their collections (data widgets).
 */

/** How each unit reads. `-k` units are thousands, so their values are scaled up for `compact`. */
export const CR_FORMAT: Record<Unit, NumberFormat> = {
  count: {},
  days: { unit: "days" },
  minutes: { unit: "minutes" },
  "usd-k": { unit: "money", currency: "USD", compact: true },
  "egp-k": { unit: "money", currency: "EGP", compact: true, decimals: 0 },
  pct: { unit: "pct" },
};
const scale = (u: Unit) => (u.endsWith("-k") ? 1000 : 1);
export const scaled = (u: Unit, v: number[]) => v.map((x) => x * scale(u));
const fmt = (u: Unit, v: number) => formatNumber(v * scale(u), CR_FORMAT[u]);

/** The dashboards of a kind, in every section, in the data's order. */
const dashboards =
  <K extends CrWidget["kind"]>(kind: K) =>
  (d: ControlRoom): Extract<CrWidget, { kind: K }>[] =>
    d.sections.flatMap((s) => s.widgets).filter((w): w is Extract<CrWidget, { kind: K }> => w.kind === kind);
/** Every trend chart the role may see. */
export const roomCharts = dashboards("chart");
/** Every ranking the role may see. */
export const roomRankings = dashboards("ranked");

/**
 * The control room's header: "The business, live.", with the way to approvals and all cases, and
 * to receivables & payables for those who may see money (the data says: `money`).
 */
export const roomHeader = (d: ControlRoom): ViewHeader => ({
  eyebrow: "Control room · for Karim Balbaa & Mohamed Helmy",
  heading: "The business, live.",
  subtitle: "Briefed at 07:00 from every case, quote, delivery and payment — and answers to any question about them.",
  actions: [
    { label: "Approvals", href: "/approvals" },
    ...(d.money ? [{ label: "Receivables & payables", href: "/cash" }] : []),
    { label: "All cases", href: link.list("cases"), main: true },
  ],
});

/** The key figures for the last four weeks, each with its trend; the first is the headline (tinted). */
export const roomFigures = (d: ControlRoom): Stat[] =>
  d.tiles.map((t, i) => ({
    main: i === 0,
    label: t.label,
    value: t.value,
    note: t.note,
    tone: t.tone,
    href: t.href,
    share: t.share,
    trend: t.trend && {
      labels: t.trend.labels,
      values: scaled(t.trend.unit, t.trend.values),
      format: CR_FORMAT[t.trend.unit],
    },
  }));

/**
 * The 07:00 AI briefing: read aloud, its sources linked; "Summarise" re-reads the live records.
 * A draft to read: nothing is sent, priced or paid.
 */
export const briefing = (b: Briefing): KindData<"text"> => {
  const seen = new Set<string>();
  const sources = b.items.flatMap((i) => i.sources).filter((x) => !seen.has(x.href) && Boolean(seen.add(x.href)));
  return {
    head: {
      tags: [{ label: "AI draft", tone: "primary", icon: "sparkles" }],
      actions: [{ label: "Summarise", icon: "sparkles", call: { path: "/briefing/refresh" }, reply: true }],
    },
    text: b.summary,
    speak: true,
    actions: sources.map((x) => ({ label: x.label, href: x.href })),
    note: `${b.at === "07:00" ? "Written at 07:00" : `Summarised again at ${b.at}`} from ${b.read} live records. A draft to read — nothing is sent, priced or paid.`,
  };
};

/**
 * "Ask Golden Sea": questions about vessels, cases, approvals, money owed, suppliers, deadlines
 * or the pipeline, answered from the live records (POST /api/ask) with links to them. It reads
 * and answers; it never sends, prices or pays.
 */
export const askGoldenSea = (): KindData<"ask"> => ({
  head: { tags: [{ label: "Assistant", tone: "primary", icon: "chat" }] },
  endpoint: "/ask",
  suggestions: { endpoint: "/ask/suggestions" },
  question: "What's the status of Aurora Crest?",
  name: "Golden Sea assistant",
  placeholder: "Ask Golden Sea…",
  intro:
    "Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline. Answers come from the live records and link to them.",
  reading: "Reading cases, approvals, invoices and suppliers…",
  footnote: "The assistant reads and answers; it never sends, prices or pays.",
});

/** In place of the profit and cash dashboards, for those who may not see them: why they're missing. */
export const moneyWithheld = (): KindData<"text"> => ({
  text: "Gross profit, margins, receivables and cash flow are shown to management and finance only.",
  muted: true,
});

/**
 * A trend chart (inquiries, quotes and wins; value won; conversion by value; quote turnaround;
 * acknowledgement time; out-of-hours requests; gross profit; sales by source; receivables
 * ageing; cash in vs out; deliveries by outcome). It carries its whole history and opens on all
 * of it (a trend reads best long); the chart's own range switch cuts it ("4 w", "12 w").
 */
export const trendChart = (w: CrChart): KindData<"chart"> => {
  const unit = w.grain === "month" ? "m" : "w";
  const shown = w.grain && w.ranges?.length ? Math.max(...w.ranges) : undefined;
  return {
    head: { subhead: w.sub },
    label: w.title,
    chart: {
      kind: w.type,
      labels: w.labels,
      series: w.series.map((s) => ({ name: s.name, values: scaled(w.unit, s.values) })),
      format: CR_FORMAT[w.unit],
      target: w.target === undefined ? undefined : w.target * scale(w.unit),
      targetLabel: w.targetLabel,
      highlightLast: Boolean(w.highlightLast),
      stacked: Boolean(w.stacked),
      ranges: w.grain ? w.ranges?.map((points) => ({ label: `${points} ${unit}`, points })) : undefined,
      range: shown || undefined,
    },
  };
};

/**
 * A ranking as gauges (the conversion funnel, why we lose, margin by store and by source,
 * receivables by customer), red under its policy minimum.
 */
export const rankedGauges = (r: CrRanked): KindData<"gauges"> => {
  const max = Math.max(1, ...r.rows.map((x) => x.value), r.minimum ?? 0);
  return {
    head: { subhead: r.sub },
    items: r.rows.map((row) => ({
      label: row.label,
      value: row.value,
      max,
      tone: r.minimum !== undefined && row.value < r.minimum ? "error" : "primary",
      valueText: fmt(r.unit, row.value),
      href: row.href,
      a11y: `${row.label}: ${fmt(r.unit, row.value)}`,
      note: row.note,
    })),
  };
};

const PERIOD_WORDS: Record<ControlRoom["period"], string> = {
  "4w": "the last 4 weeks",
  "12w": "the last 12 weeks",
  "6m": "the last 12 weeks",
};

/** The quote funnel over the period: inquiries, quoted, won, each opening the cases. */
export const quoteFunnel = (d: ControlRoom): KindData<"funnel"> => ({
  label: `Quote funnel, ${PERIOD_WORDS[d.period]}`,
  note: `RFQ cases received in ${PERIOD_WORDS[d.period]}, how many were quoted and how many won`,
  stages: d.visuals.funnel.map((s) => ({ ...s, href: link.list("cases") })),
});

/** Why quotes were lost, as parts of the whole. */
export const lostRing = (d: ControlRoom): KindData<"ring"> => {
  const total = d.visuals.lost.reduce((t, x) => t + x.value, 0);
  return {
    label: "Why quotes were lost",
    parts: d.visuals.lost.map((x) => ({ ...x, valueText: String(x.value) })),
    total: String(total),
    center: "lost",
  };
};

/** Receivables by age (management and finance): how much is still not due, and how late the rest is. */
export const ageingRing = (d: ControlRoom): KindData<"ring"> | null => {
  if (!d.visuals.ageing.length) return null;
  const usd = (v: number) => fmt("usd-k", v);
  const total = d.visuals.ageing.reduce((t, x) => t + x.value, 0);
  return {
    label: "Receivables by age",
    parts: d.visuals.ageing.map((x) => ({ ...x, valueText: usd(x.value), href: link.list("invoices") })),
    total: usd(total),
    center: "open",
  };
};

const DAY_NAME = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Inquiries per day for the last 12 weeks: the busy days and the quiet weeks. */
export const inquiryDays = (d: ControlRoom): KindData<"heatmap"> => {
  const days = d.visuals.days.map((x) => ({
    label: DAY_NAME.format(new Date(`${x.date}T00:00:00Z`)).replace(",", ""),
    value: x.value,
    valueText: `${x.value} ${x.value === 1 ? "inquiry" : "inquiries"}`,
  }));
  const total = days.reduce((t, x) => t + x.value, 0);
  const busiest = days.reduce((b, x) => (x.value > b.value ? x : b), days[0]!);
  return {
    label: "Inquiries per day, last 12 weeks",
    days,
    summary: `${total} inquiries in 12 weeks · busiest ${busiest.label} (${busiest.value})`,
  };
};
