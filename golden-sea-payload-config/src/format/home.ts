import type { Figure, KindData, NumberFormat, ViewHeader, WidgetScope } from "saastemlycrm-design-system/contracts";
import type { Home, HomeAgendaItem, HomeChart, HomeItem, HomeUnit, HomeWidget } from "../endpoints/home.ts";

/**
 * The signed-in user's day (GET /api/home, ../endpoints/home.ts), read for the widgets that show
 * what spans several collections: /home sends one day per role, already cut to what the role sees
 * (the greeting, its figures with a trend, what's due next, the 07:00 briefing and its charts).
 * The role's queue, follow-ups, decisions, inbox, pipeline and plain counts are data widgets on
 * the page. Pure: data in, what a kind draws out.
 */

export const HOME_FORMAT: Record<HomeUnit, NumberFormat> = {
  count: { unit: "count" },
  days: { unit: "days" },
  minutes: { unit: "minutes" },
  "usd-k": { unit: "money", currency: "USD", compact: true },
  "egp-k": { unit: "money", currency: "EGP", compact: true },
  pct: { unit: "pct" },
};
/** Home sends thousands for `-k` units; the format expects the full amount. */
export const scale = (unit: HomeUnit, values: number[]) => (unit.endsWith("-k") ? values.map((v) => v * 1000) : values);

/** /home's widget of a kind (a role has at most one of each). */
export const homePart = <K extends HomeWidget["kind"]>(h: Home, kind: K) =>
  h.widgets.find((w): w is Extract<HomeWidget, { kind: K }> => w.kind === kind);

/** The role's charts, in the day's order: its main chart first. */
export const homeCharts = (h: Home): HomeChart[] => h.widgets.flatMap((w) => (w.kind === "charts" ? w.charts : []));

/**
 * How many charts /home sends each role (../endpoints/home.ts), known before the data so the
 * board keeps its shape: everyone without a day of their own (the sourcing desk) has one.
 */
const HOME_CHARTS: Record<string, number> = {
  management: 4,
  "finance-director": 3,
  operations: 2,
  sales: 2,
  "office-admin": 2,
};
export const homeChartCount = ({ user }: WidgetScope) => HOME_CHARTS[user.role ?? ""] ?? 1;

/**
 * The figures with a trend /home sends each role, in its order (../endpoints/home.ts): one tile
 * each, decided by who is looking. Everyone without a day of their own has the sourcing desk's.
 */
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

/**
 * The home page's header: the greeting, a subtitle with the day's live numbers, the role's
 * shortcuts and "While you were away", a summary of the user's unread notifications.
 */
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
    label: "While you were away",
    context: "Unread notifications for someone back at their desk at a ship chandler: say what needs them first.",
    text: n.docs.map((x) => `${String(x.kind)}: ${String(x.title)} — ${String(x.detail)}`).join("\n"),
  },
  actions: h.actions.map((a) => ({ label: a.label, href: a.href, main: a.primary })),
});

/**
 * The figures this role steers by that carry a trend (/home sends one set per role), each a tile of
 * its own with how it moved and its trend; the headline (`main`) is drawn tinted. The page's
 * counts complete the strip of four.
 */
export const homeFigures = (h: Home): Figure<HomeFigure>[] =>
  (homePart(h, "tiles")?.tiles ?? []).map((t) => ({
    main: t.main,
    // /home's labels are `HOME_FIGURES`' (a label it doesn't list shows in the last tile).
    label: t.label as HomeFigure,
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

/** What's due next for this person, soonest first, each row led by its time ("Late" once passed). */
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
          tags: i.late ? [{ label: "Late", tone: "error" as const }] : undefined,
        })),
      }
    : null;
};

/**
 * One of /home's charts in its own tile, titled by the chart: the role's pipeline (inquiries,
 * quotes and wins; value won), speed (quotation turnaround, time to acknowledge an RFQ, my quote
 * turnaround), money (gross profit expected vs actual, receivables by age, cash in vs out), why
 * we lose, out-of-hours requests or my deadlines. Its subhead says what it counts.
 */
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

/**
 * The 07:00 briefing in its own tile: what needs this role this morning, worst first, from its
 * cases, inbox and integrations (several collections at once, so the endpoint writes it).
 */
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
