import { block, type NumberFormat, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget, type WidgetScope } from "saastemlycrm-design-system/contracts";
import type { Home, HomeCase, HomeChart, HomeUnit, HomeWidget } from "../endpoints/home.ts";

/**
 * The dashboard's home (Payload `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role by GET /api/home (../endpoints/home.ts): KPI tiles with trends, decision /
 * briefing / follow-up lists, the case queue and charts. Each role /home distinguishes has its own
 * tiles in its own order (`visible` by role), each titled here and drawing its part of /home's
 * data (lists and charts found by the title /home gives them). The header's "While you were away"
 * summary reads the user's unread notifications.
 */

const home: Source = { endpoint: "/home" };
const unread: Source = { find: "notifications", where: { read: { equals: false } }, sort: "-at", limit: 20, depth: 0 };

const FORMAT: Record<HomeUnit, NumberFormat> = {
  count: { unit: "count" },
  days: { unit: "days" },
  minutes: { unit: "minutes" },
  "usd-k": { unit: "money", currency: "USD", compact: true },
  "egp-k": { unit: "money", currency: "EGP", compact: true },
  pct: { unit: "pct" },
};
/** Home sends thousands for `-k` units; the format expects the full amount. */
const scale = (unit: HomeUnit, values: number[]) => (unit.endsWith("-k") ? values.map((v) => v * 1000) : values);

type HomeList = Extract<HomeWidget, { kind: "lists" }>["lists"][number];
type HomeQueue = Extract<HomeWidget, { kind: "queue" }>;

/* ------------------------------------------------------------ the parts of /home's data */

/** /home's widget of a kind (a role has at most one of each). */
const of = <K extends HomeWidget["kind"]>(h: Home, kind: K) =>
  h.widgets.find((w): w is Extract<HomeWidget, { kind: K }> => w.kind === kind);
const listNamed = (h: Home, title: string) =>
  h.widgets.flatMap((w) => (w.kind === "lists" ? w.lists : [])).find((l) => l.title === title);
const chartNamed = (h: Home, title: string) =>
  h.widgets.flatMap((w) => (w.kind === "charts" ? w.charts : [])).find((c) => c.title === title);

/* ------------------------------------------------------------ blocks */

function queueTable(q: HomeQueue): ViewBlock {
  const lines = (c: HomeCase) => {
    const l = c.lines;
    if (!l) return { cell: null, note: "" };
    const total = l.ready + l.waiting + l.blocked + l.noOffer;
    return {
      cell: {
        text: `${l.ready}/${total} ready`,
        gauge: {
          value: l.ready,
          max: total,
          tone: l.blocked ? ("warning" as const) : ("success" as const),
          label: `${l.ready} of ${total} lines ready`,
        },
      },
      note: l.blocked ? `${l.blocked} blocked` : "",
    };
  };
  return block("table", {
    empty: "No live cases.",
    columns: [
      { key: "caseId", label: "Case", supporting: "urgent" },
      { key: "customer", label: "Customer · vessel", supporting: "where" },
      { key: "stage", label: "Stage", supporting: "wait" },
      { key: "lines", label: "Lines", supporting: "blocked" },
      { key: "deadline", label: "Deadline", supporting: "due" },
      { key: "next", label: "Next action · blocker", supporting: "blocker" },
      ...(q.owners ? [{ key: "owner", label: "Owner" }] : []),
      ...(q.value ? [{ key: "value", label: "Value", align: "end" as const }] : []),
    ],
    rows: q.cases.map((c) => {
      const l = lines(c);
      return {
        caseId: { text: c.caseId, href: c.href },
        urgent: c.urgent ? { text: "Urgent", tone: "error" } : "",
        customer: c.customer,
        where: `${c.vessel} · ${c.port}`,
        stage: { text: c.stage, dot: c.tone },
        wait: c.wait,
        lines: l.cell,
        blocked: l.note,
        deadline: c.deadline,
        due: c.overdue ? { text: c.due, tone: "error" } : c.due,
        next: c.next,
        blocker: c.blocker ? { text: `⚑ ${c.blocker}`, tone: c.tone === "error" ? "error" : undefined } : "",
        owner: c.owner,
        value: c.value === undefined ? null : `USD ${c.value.toLocaleString("en-US")}`,
      };
    }),
  });
}

function stats(w: Extract<HomeWidget, { kind: "tiles" }>): ViewBlock {
  return block("stats", {
    items: w.tiles.map((t) => ({
      label: t.label,
      value: t.value,
      note: t.note,
      tone: t.tone === "success" || t.tone === "warning" || t.tone === "error" ? t.tone : undefined,
      href: t.href,
      trend: t.trend && {
        labels: t.trend.labels,
        values: scale(t.trend.unit, t.trend.values),
        format: FORMAT[t.trend.unit],
      },
    })),
  });
}

/** A chart in its own tile: the tile carries its title and subhead. */
function chart(c: HomeChart): ViewBlock {
  return block("chart", {
    label: c.title,
    chart: {
      kind: c.kind,
      labels: c.labels,
      series: c.series.map((s) => ({ ...s, values: scale(c.unit, s.values) })),
      format: FORMAT[c.unit],
      target: c.target === undefined ? undefined : scale(c.unit, [c.target])[0],
      targetLabel: c.targetLabel,
      highlightLast: c.highlightLast,
    },
  });
}

function list(l: HomeList): ViewBlock {
  return block("list", {
    empty: l.empty,
    items: l.items.map((i) => ({
      headline: i.title,
      supporting: i.sub,
      href: i.href,
      dot: i.tone,
      tags: i.badge
        ? [{ label: i.badge, tone: i.tone === "error" ? ("error" as const) : ("neutral" as const) }]
        : undefined,
    })),
  });
}

/* ------------------------------------------------------------ tiles */

const on = from<Home>(home);

/** The role's figures (/home sends one set per role). */
const figures = (title: string): Widget<Home> =>
  on({
    title,
    size: "m",
    skeleton: "stats",
    hidden: (h) => !of(h, "tiles"),
    render: (h) => {
      const t = of(h, "tiles");
      return t ? stats(t) : null;
    },
  });

/** One of /home's lists, by the title /home gives it. */
const listTile = (title: string): Widget<Home> =>
  on({
    title,
    size: "s",
    skeleton: "list",
    hidden: (h) => !listNamed(h, title),
    head: (h) => {
      const l = listNamed(h, title);
      return l
        ? {
            subhead: l.sub,
            count: l.items.length,
            actions: l.href ? [{ label: l.hrefLabel ?? "All", href: l.href }] : undefined,
          }
        : {};
    },
    render: (h) => {
      const l = listNamed(h, title);
      return l ? list(l) : null;
    },
  });

/** One of /home's charts, by the title /home gives it. */
const chartTile = (title: string): Widget<Home> =>
  on({
    title,
    size: "m",
    skeleton: "chart",
    hidden: (h) => !chartNamed(h, title),
    head: (h) => ({ subhead: chartNamed(h, title)?.sub }),
    render: (h) => {
      const c = chartNamed(h, title);
      return c ? chart(c) : null;
    },
  });

/** The role's case queue. */
const queueTile = (title: string): Widget<Home> =>
  on({
    title,
    size: "l",
    skeleton: "table",
    hidden: (h) => !of(h, "queue"),
    head: (h) => {
      const q = of(h, "queue");
      return q ? { subhead: q.sub, count: q.cases.length, actions: [{ label: "All cases", href: q.href }] } : {};
    },
    render: (h) => {
      const q = of(h, "queue");
      return q ? queueTable(q) : null;
    },
  });

/* ------------------------------------------------------------ each role's day, in its own order */

/** The roles /home gives a day of their own; everyone else (supply chain, customer service) gets the buyer's day. */
const ROLES = ["management", "finance-director", "operations", "sales", "office-admin"];
/** These tiles for one role (`null`: every role not in ROLES). */
const forRole = (role: string | null, tiles: Widget<Home>[]): Widget[] =>
  tiles.map(
    (w) =>
      ({
        ...w,
        visible: (scope: WidgetScope) => (role ? scope.user.role === role : !ROLES.includes(scope.user.role ?? "")),
      }) as Widget,
  );

const decisions = () => listTile("Waiting for your decision");
const briefing = () => listTile("Daily briefing");
const followUps = () => listTile("Today's follow-ups");

const days: Widget[] = [
  ...forRole("management", [
    decisions(),
    briefing(),
    figures("Business at a glance"),
    chartTile("Inquiries, quotes and wins"),
    chartTile("Value won per month"),
    chartTile("Quotation turnaround"),
    chartTile("Gross profit: expected vs actual"),
    queueTile("All live cases"),
  ]),
  ...forRole("finance-director", [
    decisions(),
    briefing(),
    figures("Money today"),
    chartTile("Cash in vs cash out, next 8 weeks"),
    chartTile("Receivables by age"),
    chartTile("Gross profit: expected vs actual"),
    queueTile("All live cases"),
  ]),
  ...forRole("operations", [
    figures("Operations today"),
    briefing(),
    followUps(),
    chartTile("Cash in vs cash out, next 8 weeks"),
    chartTile("Time to acknowledge an RFQ"),
    queueTile("My queue"),
  ]),
  ...forRole("sales", [
    figures("My cases by wait"),
    queueTile("My queue"),
    briefing(),
    listTile("Pipeline next steps"),
    chartTile("Inquiries, quotes and wins"),
    chartTile("Why we lose"),
  ]),
  ...forRole("office-admin", [
    listTile("Inbox to triage"),
    followUps(),
    figures("Cases by wait"),
    queueTile("Desk cases"),
    chartTile("Out-of-hours requests"),
    chartTile("Time to acknowledge an RFQ"),
  ]),
  ...forRole(null, [
    figures("Cases by wait"),
    queueTile("My queue"),
    briefing(),
    followUps(),
    chartTile("My deadlines, next 7 days"),
    chartTile("My quote turnaround"),
  ]),
];

export const homePage = widgets({
  header: {
    source: { all: { home, unread } },
    render: (data) => {
      const { home: h, unread: n } = data as { home: Home; unread: { docs: Record<string, unknown>[] } };
      return {
        eyebrow: h.eyebrow,
        heading: h.greeting,
        subtitle: h.subtitle,
        summary: {
          label: "While you were away",
          context: "Unread notifications for someone back at their desk at a ship chandler: say what needs them first.",
          text: n.docs.map((x) => `${String(x.kind)}: ${String(x.title)} — ${String(x.detail)}`).join("\n"),
        },
        actions: h.actions.map((a) => ({ label: a.label, href: a.href, main: a.primary })),
      };
    },
  },
  widgets: days,
});
