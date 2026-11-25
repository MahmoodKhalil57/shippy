import type { Figure, KindData, NumberFormat, ViewHeader, WidgetScope } from "saastemlycrm-design-system/contracts";
import type { Home, HomeAgendaItem, HomeChart, HomeItem, HomeUnit, HomeWidget } from "../endpoints/home.ts";
import { m } from "../i18n/paraglide/messages.js";

export const HOME_FORMAT: Record<HomeUnit, NumberFormat> = {
  count: { unit: "count" },
  days: { unit: "days" },
  minutes: { unit: "minutes" },
  "usd-k": { unit: "money", currency: "USD", compact: true },
  "egp-k": { unit: "money", currency: "EGP", compact: true },
  pct: { unit: "pct" },
};
export const scale = (unit: HomeUnit, values: number[]) => (unit.endsWith("-k") ? values.map((v) => v * 1000) : values);

export const homePart = <K extends HomeWidget["kind"]>(h: Home, kind: K) =>
  h.widgets.find((w): w is Extract<HomeWidget, { kind: K }> => w.kind === kind);

export const homeCharts = (h: Home): HomeChart[] => h.widgets.flatMap((w) => (w.kind === "charts" ? w.charts : []));

const HOME_CHARTS: Record<string, number> = {
  management: 4,
  "finance-director": 3,
  operations: 2,
  sales: 2,
  "office-admin": 2,
};
export const homeChartCount = ({ user }: WidgetScope) => HOME_CHARTS[user.role ?? ""] ?? 1;

export const HOME_FIGURES = {
  management: ["Inquiries, last 4 weeks", "Won, last 4 weeks", "Quote turnaround", "Expected gross profit, Nov"],
  "finance-director": ["Receivables", "Net cash, next 8 weeks", "Expected gross profit, Nov"],
  operations: ["Deliveries in progress"],
  sales: ["Awaiting customer decision", "Awaiting internal approval", "Won, last 4 weeks"],
  "office-admin": ["Out-of-hours RFQs", "Time to acknowledge"],
  desk: ["Awaiting supplier", "Awaiting internal approval", "My quote turnaround"],
} as const;
export type HomeFigure = (typeof HOME_FIGURES)[keyof typeof HOME_FIGURES][number];
export const homeFigureLabels = ({ user }: WidgetScope): readonly HomeFigure[] =>
  HOME_FIGURES[(user.role ?? "") as keyof typeof HOME_FIGURES] ?? HOME_FIGURES.desk;

const HOME_FIGURE_NAMES: Record<HomeFigure, () => string> = {
  "Inquiries, last 4 weeks": m.home_figure_inquiries_4_weeks,
  "Won, last 4 weeks": m.home_figure_won_4_weeks,
  "Quote turnaround": m.home_figure_quote_turnaround,
  "Expected gross profit, Nov": m.home_figure_expected_gross_profit_nov,
  Receivables: m.home_figure_receivables,
  "Net cash, next 8 weeks": m.home_figure_net_cash_8_weeks,
  "Deliveries in progress": m.home_figure_deliveries_in_progress,
  "Awaiting customer decision": m.home_figure_awaiting_customer_decision,
  "Awaiting internal approval": m.home_figure_awaiting_internal_approval,
  "Out-of-hours RFQs": m.home_figure_out_of_hours_rfqs,
  "Time to acknowledge": m.home_figure_time_to_acknowledge,
  "Awaiting supplier": m.home_figure_awaiting_supplier,
  "My quote turnaround": m.home_figure_my_quote_turnaround,
};
export const homeFigureName = (key: HomeFigure): string => HOME_FIGURE_NAMES[key]?.() ?? key;

export const homeHeader = ({
  home: h,
  unread: n,
}: {
  home: Home;
  unread: { docs: Record<string, unknown>[] };
}): ViewHeader => ({
  eyebrow: h.eyebrow,
  heading: h.greeting,
  subtitle: h.subtitle,
  summary: {
    label: m.home_away_label(),
    context: m.home_away_context(),
    text: n.docs.map((x) => `${String(x.kind)}: ${String(x.title)} — ${String(x.detail)}`).join("\n"),
  },
  actions: h.actions.map((a) => ({ label: a.label, href: a.href, main: a.primary })),
});

export const homeFigures = (h: Home): Figure<HomeFigure>[] =>
  (homePart(h, "tiles")?.tiles ?? []).map((t) => ({
    main: t.main,
    key: t.key as HomeFigure,
    label: t.label,
    value: t.value,
    note: t.note,
    tone: t.tone === "success" || t.tone === "warning" || t.tone === "error" ? t.tone : undefined,
    href: t.href,
    delta: t.delta,
    trend: t.trend && {
      labels: t.trend.labels,
      values: scale(t.trend.unit, t.trend.values),
      format: HOME_FORMAT[t.trend.unit],
    },
  }));

export const agenda = (h: Home): KindData<"list"> | null => {
  const a = homePart(h, "agenda");
  return a
    ? {
        head: { subhead: a.sub },
        empty: a.empty,
        items: a.items.map((i: HomeAgendaItem) => ({
          lead: i.lead,
          headline: i.title,
          supporting: i.sub,
          href: i.href,
          tags: i.late ? [{ label: m.home_late(), tone: "error" as const }] : undefined,
        })),
      }
    : null;
};

export const homeChart = (c: HomeChart): KindData<"chart"> => ({
  head: { subhead: c.sub },
  label: c.title,
  chart: {
    kind: c.kind,
    labels: c.labels,
    series: c.series.map((s) => ({ ...s, values: scale(c.unit, s.values) })),
    format: HOME_FORMAT[c.unit],
    target: c.target === undefined ? undefined : scale(c.unit, [c.target])[0],
    targetLabel: c.targetLabel,
    highlightLast: c.highlightLast,
  },
});

export const briefing = (h: Home): KindData<"list"> | null => {
  const b = homePart(h, "briefing");
  return b
    ? {
        head: { subhead: b.sub, count: b.items.length },
        empty: b.empty,
        items: b.items.map((i: HomeItem) => ({
          headline: i.title,
          supporting: i.sub,
          href: i.href,
          dot: i.tone,
        })),
      }
    : null;
};
