import { block, formatNumber, type NumberFormat, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { Briefing } from "../endpoints/assistant.ts";
import type { ControlRoom, CrChart, CrRanked, CrSuppliers, CrWidget, Unit } from "../endpoints/control-room.ts";
import { MONEY_ROLES } from "../endpoints/insights-shared.ts";
import * as link from "../links.ts";

/**
 * The control room (/control-room): "The business, live. Briefed at 07:00." for Karim Balbaa and
 * Mohamed Helmy: the 07:00 AI briefing (GET /api/briefing), "Ask Golden Sea" (an `ask` block on POST /api/ask) and the
 * management dashboards (one tile per chart, ranking and table), with one period choice
 * (`?period=`) above them. Data:
 * GET /api/control-room?period= (../endpoints/control-room.ts); profit & cash only reach
 * management and finance.
 */

const room: Source = { endpoint: "/control-room", query: { period: "$param.period" } };
const on = from<ControlRoom>(room);

/** How each unit reads. `-k` units are thousands, so their values are scaled up for `compact`. */
const FORMAT: Record<Unit, NumberFormat> = {
  count: {},
  days: { unit: "days" },
  minutes: { unit: "minutes" },
  "usd-k": { unit: "money", currency: "USD", compact: true },
  "egp-k": { unit: "money", currency: "EGP", compact: true, decimals: 0 },
  pct: { unit: "pct" },
};
const scale = (u: Unit) => (u.endsWith("-k") ? 1000 : 1);
const values = (u: Unit, v: number[]) => v.map((x) => x * scale(u));
const fmt = (u: Unit, v: number) => formatNumber(v * scale(u), FORMAT[u]);

const gauges = (r: CrRanked): ViewBlock => {
  const max = Math.max(1, ...r.rows.map((x) => x.value), r.minimum ?? 0);
  return block("gauges", {
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
  });
};

const suppliers = (s: CrSuppliers): ViewBlock =>
  block("table", {
    columns: [
      { key: "name", label: "Supplier" },
      { key: "onTime", label: "On time" },
      { key: "replyHrs", label: "Avg reply" },
      { key: "open", label: "Open RFQs" },
    ],
    rows: s.rows.map((r) => ({
      name: { text: r.name, href: r.href, strong: true },
      onTime:
        r.onTime === undefined
          ? { text: "No deliveries yet", tone: "neutral" }
          : {
              text: `${r.onTime}%`,
              tone: r.onTime < 85 ? "warning" : undefined,
              gauge: {
                value: r.onTime,
                max: 100,
                tone: r.onTime < 85 ? "warning" : "success",
                label: `${r.name} on time ${r.onTime}%`,
              },
            },
      replyHrs:
        r.replyHrs === undefined ? null : { text: `${r.replyHrs} h`, tone: r.replyHrs > 24 ? "warning" : undefined },
      open: r.open ? String(r.open) : null,
    })),
  });

const chart = (w: CrChart): ViewBlock =>
  block("chart", {
    label: w.title,
    chart: {
      kind: w.type,
      labels: w.labels,
      series: w.series.map((s) => ({ name: s.name, values: values(w.unit, s.values) })),
      format: FORMAT[w.unit],
      target: w.target === undefined ? undefined : w.target * scale(w.unit),
      targetLabel: w.targetLabel,
      highlightLast: Boolean(w.highlightLast),
    },
  });

/** One of the dashboards' widgets, found by its title in any section (absent: no tile). */
const find = (d: ControlRoom, title: string) => d.sections.flatMap((s) => s.widgets).find((w) => w.title === title);

/**
 * One dashboard widget as its own tile, titled as the data titles it: a chart (`m`), a ranking
 * as gauges (`s`) or the supplier table (`l`). Profit & cash only reach management and finance,
 * so for everyone else those tiles are left out.
 */
const tile = (title: string, kind: CrWidget["kind"]): Widget<ControlRoom> =>
  on({
    title,
    size: kind === "chart" ? "m" : kind === "ranked" ? "s" : "l",
    skeleton: kind === "chart" ? "chart" : kind === "ranked" ? "list" : "table",
    hidden: (d) => find(d, title)?.kind !== kind,
    head: (d) => ({ subhead: find(d, title)?.sub }),
    render: (d) => {
      const w = find(d, title);
      if (w?.kind === "chart") return chart(w);
      if (w?.kind === "ranked") return gauges(w);
      if (w?.kind === "suppliers") return suppliers(w);
      return null;
    },
  });

/** The 07:00 briefing: read aloud, its sources linked; "Summarise" re-reads the live records. */
const briefing: Widget<Briefing> = {
  title: "07:00 · daily AI briefing",
  size: "s",
  source: { endpoint: "/briefing" },
  skeleton: "text",
  head: () => ({
    tags: [{ label: "AI draft", tone: "primary", icon: "sparkles" }],
    actions: [{ label: "Summarise", icon: "sparkles", call: { path: "/briefing/refresh" }, reply: true }],
  }),
  render: (b) => {
    const seen = new Set<string>();
    const sources = b.items.flatMap((i) => i.sources).filter((x) => !seen.has(x.href) && Boolean(seen.add(x.href)));
    return [
      block("text", { text: b.summary, speak: true }),
      ...(sources.length
        ? [
            block("actions", {
              items: sources.map((x) => ({ label: x.label, href: x.href })),
            }),
          ]
        : []),
      block("text", {
        muted: true,
        text: `${b.at === "07:00" ? "Written at 07:00" : `Summarised again at ${b.at}`} from ${b.read} live records. A draft to read — nothing is sent, priced or paid.`,
      }),
    ];
  },
};

export const controlRoom = widgets({
  params: { period: "4w" },
  header: {
    render: (_, { user }) => ({
      eyebrow: "Control room · for Karim Balbaa & Mohamed Helmy",
      heading: "The business, live.",
      subtitle:
        "Briefed at 07:00 from every case, quote, delivery and payment — and answers to any question about them.",
      actions: [
        { label: "Approvals", href: "/approvals" },
        ...(MONEY_ROLES.includes(user.role ?? "") ? [{ label: "Receivables & payables", href: "/cash" }] : []),
        { label: "All cases", href: link.list("cases"), main: true },
      ],
    }),
  },
  widgets: [
    on({
      title: "Today at a glance",
      size: "m",
      skeleton: "stats",
      render: (d) =>
        block("stats", {
          items: d.tiles.map((t) => ({
            label: t.label,
            value: t.value,
            note: t.note,
            tone: t.tone,
            href: t.href,
            trend: t.trend && {
              labels: t.trend.labels,
              values: values(t.trend.unit, t.trend.values),
              format: FORMAT[t.trend.unit],
            },
          })),
        }),
    }),
    briefing,
    {
      title: "Ask Golden Sea",
      size: "m",
      head: () => ({ tags: [{ label: "Assistant", tone: "primary", icon: "chat" }] }),
      render: () =>
        block("ask", {
          endpoint: "/ask",
          suggestions: { endpoint: "/ask/suggestions" },
          question: "What's the status of Aurora Crest?",
          name: "Golden Sea assistant",
          placeholder: "Ask Golden Sea…",
          intro:
            "Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline. Answers come from the live records and link to them.",
          reading: "Reading cases, approvals, invoices and suppliers…",
          footnote: "The assistant reads and answers; it never sends, prices or pays.",
        }),
    },
    on({
      size: "full",
      skeleton: "text",
      render: (d) => [
        block("heading", { text: "Management dashboards" }),
        block("text", {
          text: "Today's numbers from the live records; trends from the reporting history.",
          muted: true,
        }),
        block("choice", {
          param: "period",
          label: "Period",
          value: d.period,
          options: d.periods.map((p) => ({ value: p.value, label: p.label })),
        }),
      ],
    }),
    tile("Inquiries, quotes and wins", "chart"),
    tile("Value won per month", "chart"),
    tile("Conversion funnel", "ranked"),
    tile("Conversion by value", "chart"),
    tile("Why we lose", "ranked"),
    tile("Quote turnaround", "chart"),
    tile("Acknowledgement time", "chart"),
    tile("Live cases per owner", "ranked"),
    tile("Out-of-hours requests", "chart"),
    on({
      title: "Profit & cash",
      size: "s",
      skeleton: "text",
      hidden: (d) => d.money,
      render: () =>
        block("text", {
          text: "Gross profit, margins, receivables and cash flow are shown to management and finance only.",
          muted: true,
        }),
    }),
    tile("Gross profit: expected vs actual", "chart"),
    tile("Sales by source", "chart"),
    tile("Margin by store", "ranked"),
    tile("Receivables ageing", "chart"),
    tile("Margin by source", "ranked"),
    tile("Cash in vs cash out", "chart"),
    tile("Receivables by customer", "ranked"),
    tile("Supplier on-time vs reply time", "suppliers"),
    tile("Deliveries by outcome", "chart"),
  ],
});
