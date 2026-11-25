import {
  formatNumber,
  type Figure,
  type KindData,
  type NumberFormat,
  type ViewHeader,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import type { Briefing } from "../endpoints/assistant.ts";
import type { ControlRoom, CrChart, CrRanked, CrWidget, Unit } from "../endpoints/control-room.ts";
import { m } from "../i18n/paraglide/messages.js";
import * as link from "../links.ts";
import { dateFormat } from "./index.ts";
import { seesMoney } from "./visuals.ts";

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

const dashboards =
  <K extends CrWidget["kind"]>(kind: K) =>
  (d: ControlRoom): Extract<CrWidget, { kind: K }>[] =>
    d.sections.flatMap((s) => s.widgets).filter((w): w is Extract<CrWidget, { kind: K }> => w.kind === kind);
export const roomCharts = dashboards("chart");
export const roomRankings = dashboards("ranked");
export const roomChartTiles = (scope: WidgetScope) => (seesMoney(scope) ? 11 : 7);
export const roomRankingTiles = (scope: WidgetScope) => (seesMoney(scope) ? 5 : 2);

export const roomHeader = (d: ControlRoom): ViewHeader => ({
  eyebrow: m.control_room_eyebrow(),
  heading: m.control_room_heading(),
  subtitle: m.control_room_subtitle(),
  actions: [
    { label: m.control_room_approvals(), href: "/approvals" },
    ...(d.money ? [{ label: m.control_room_receivables_payables(), href: "/cash" }] : []),
    { label: m.control_room_all_cases(), href: link.list("cases"), main: true },
  ],
});

const ROOM_FIGURES = ["Open RFQs", "Avg time to quote", "Win rate", "Waiting on suppliers"] as const;
const MONEY_FIGURES = ["Gross profit", "Receivables open"] as const;
type RoomFigure = (typeof ROOM_FIGURES)[number] | (typeof MONEY_FIGURES)[number];
export const roomFigureLabels = (scope: WidgetScope): readonly RoomFigure[] =>
  seesMoney(scope) ? [...ROOM_FIGURES, ...MONEY_FIGURES] : ROOM_FIGURES;
const isRoomFigure = (label: string): label is RoomFigure =>
  (ROOM_FIGURES as readonly string[]).includes(label) || (MONEY_FIGURES as readonly string[]).includes(label);

const ROOM_FIGURE_NAMES: Record<RoomFigure, () => string> = {
  "Open RFQs": m.control_room_figure_open_rfqs,
  "Avg time to quote": m.control_room_figure_avg_time_to_quote,
  "Win rate": m.control_room_figure_win_rate,
  "Waiting on suppliers": m.control_room_figure_waiting_on_suppliers,
  "Gross profit": m.control_room_figure_gross_profit,
  "Receivables open": m.control_room_figure_receivables_open,
};
export const roomFigureName = (key: RoomFigure): string => ROOM_FIGURE_NAMES[key]();

export const roomFigures = (d: ControlRoom): Figure<RoomFigure>[] =>
  d.tiles.flatMap((t, i) => {
    const month = /^Gross profit (.+)$/.exec(t.label)?.[1];
    const key = month ? "Gross profit" : t.label;
    if (!isRoomFigure(key)) return [];
    return [
      {
        main: i === 0,
        key,
        label: roomFigureName(key),
        value: t.value,
        note: month ? m.control_room_month_note({ month, note: t.note ?? "" }) : t.note,
        tone: t.tone,
        href: t.href,
        share: t.share,
        trend: t.trend && {
          labels: t.trend.labels,
          values: scaled(t.trend.unit, t.trend.values),
          format: CR_FORMAT[t.trend.unit],
        },
      },
    ];
  });

export const briefing = (b: Briefing): KindData<"text"> => {
  const seen = new Set<string>();
  const sources = b.items.flatMap((i) => i.sources).filter((x) => !seen.has(x.href) && Boolean(seen.add(x.href)));
  return {
    head: {
      tags: [{ label: m.control_room_ai_draft(), tone: "primary", icon: "sparkles" }],
      actions: [
        { label: m.control_room_summarise(), icon: "sparkles", call: { path: "/briefing/refresh" }, reply: true },
      ],
    },
    text: b.summary,
    speak: true,
    actions: sources.map((x) => ({ label: x.label, href: x.href })),
    note:
      b.at === "07:00"
        ? m.control_room_briefing_written({ count: b.read })
        : m.control_room_briefing_summarised({ at: b.at, count: b.read }),
  };
};

export const askGoldenSea = (): KindData<"ask"> => ({
  head: { tags: [{ label: m.control_room_assistant(), tone: "primary", icon: "chat" }] },
  endpoint: "/ask",
  suggestions: { endpoint: "/ask/suggestions" },
  question: m.control_room_ask_question(),
  name: m.control_room_ask_name(),
  placeholder: m.control_room_ask_placeholder(),
  intro: m.control_room_ask_intro(),
  reading: m.control_room_ask_reading(),
  footnote: m.control_room_ask_footnote(),
});

export const moneyWithheld = (): KindData<"text"> => ({
  text: m.control_room_money_withheld(),
  muted: true,
});

export const trendChart = (w: CrChart): KindData<"chart"> => {
  const range = w.grain === "month" ? m.control_room_range_months : m.control_room_range_weeks;
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
      ranges: w.grain ? w.ranges?.map((points) => ({ label: range({ points }), points })) : undefined,
      range: shown || undefined,
    },
  };
};

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

export const quoteFunnel = (d: ControlRoom): KindData<"funnel"> => ({
  label: d.period === "4w" ? m.control_room_funnel_4w() : m.control_room_funnel_12w(),
  note: d.period === "4w" ? m.control_room_funnel_note_4w() : m.control_room_funnel_note_12w(),
  stages: d.visuals.funnel.map((s) => ({ ...s, href: link.list("cases") })),
});

export const lostRing = (d: ControlRoom): KindData<"ring"> => {
  const total = d.visuals.lost.reduce((t, x) => t + x.value, 0);
  return {
    label: m.control_room_lost_label(),
    parts: d.visuals.lost.map((x) => ({ ...x, valueText: String(x.value) })),
    total: String(total),
    center: m.control_room_lost_center(),
  };
};

export const ageingRing = (d: ControlRoom): KindData<"ring"> | null => {
  if (!d.visuals.ageing.length) return null;
  const usd = (v: number) => fmt("usd-k", v);
  const total = d.visuals.ageing.reduce((t, x) => t + x.value, 0);
  return {
    label: m.control_room_ageing_label(),
    parts: d.visuals.ageing.map((x) => ({ ...x, valueText: usd(x.value), href: link.list("invoices") })),
    total: usd(total),
    center: m.control_room_ageing_center(),
  };
};

export const inquiryDays = (d: ControlRoom): KindData<"heatmap"> => {
  const days = d.visuals.days.map((x) => ({
    label: dateFormat({ weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
      .format(new Date(`${x.date}T00:00:00Z`))
      .replace(/[,،]/, ""),
    value: x.value,
    valueText: m.control_room_inquiries({ count: x.value }),
  }));
  const total = days.reduce((t, x) => t + x.value, 0);
  const busiest = days.reduce((b, x) => (x.value > b.value ? x : b), days[0]!);
  return {
    label: m.control_room_days_label(),
    days,
    summary: m.control_room_days_summary({ total, day: busiest.label, count: busiest.value }),
  };
};
