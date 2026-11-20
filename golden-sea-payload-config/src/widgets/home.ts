import { block, type NumberFormat, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget, type WidgetScope } from "saastemlycrm-design-system/contracts";
import type { Home, HomeCase, HomeChart, HomeUnit, HomeWidget } from "../endpoints/home.ts";

/**
 * The dashboard's home (Payload `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role by GET /api/home (../endpoints/home.ts). Every role's day has the same
 * shape, so the first window says where they stand: a greeting whose subtitle is the day's live
 * numbers, a strip of the four figures they steer by (the first tinted, each with how it moved and
 * its trend), the chart their work turns on beside "Next up" (what's due, soonest first: the one
 * inverse tile), then their two lists, their case queue and the other charts. Each tile draws its
 * part of /home's data (lists and charts found by the title /home gives them), `visible` by role.
 * The header's "While you were away" summary reads the user's unread notifications.
 *
 * The order fills the board's rows (saastemlycrm-design-system/AGENTS.md, "No lane left empty"):
 * figures `full`; chart `m` + next up `s` (one row on 3 lanes; on 4 the first list joins it); three
 * small cards, the two lists and a compact chart (`s` + `s` + `s`: a row on 3 lanes, pairs on 2);
 * the queue `l`; the other charts `m`.
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
type HomeAgenda = Extract<HomeWidget, { kind: "agenda" }>;

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
        owner: c.owner ? { text: c.owner, person: true } : "",
        value: c.value === undefined ? null : `USD ${c.value.toLocaleString("en-US")}`,
      };
    }),
  });
}

function stats(w: Extract<HomeWidget, { kind: "tiles" }>): ViewBlock {
  return block("stats", {
    size: "md",
    // The first figure is the row's headline: drawn tinted.
    items: w.tiles.map((t, i) => ({
      main: i === 0,
      label: t.label,
      value: t.value,
      note: t.note,
      tone: t.tone === "success" || t.tone === "warning" || t.tone === "error" ? t.tone : undefined,
      href: t.href,
      delta: t.delta,
      trend: t.trend && {
        labels: t.trend.labels,
        values: scale(t.trend.unit, t.trend.values),
        format: FORMAT[t.trend.unit],
      },
    })),
  });
}

/** What's due, soonest first: each row led by its time. */
function agenda(a: HomeAgenda): ViewBlock {
  return block("list", {
    empty: a.empty,
    items: a.items.map((i) => ({
      lead: i.lead,
      headline: i.title,
      supporting: i.sub,
      href: i.href,
      tags: i.late ? [{ label: "Late", tone: "error" as const }] : undefined,
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

/**
 * The role's four figures (/home sends one set per role), as a strip across the page: untitled, so
 * each figure is a card of its own (every one carries its label).
 */
const figures = (): Widget<Home> =>
  on({
    size: "full",
    skeleton: "stats",
    hidden: (h) => !of(h, "tiles"),
    render: (h) => {
      const t = of(h, "tiles");
      return t ? stats(t) : null;
    },
  });

/** What's due next for this person: the screen's one inverse tile, beside the main chart. */
const nextUp = (): Widget<Home> =>
  on({
    title: "Next up",
    size: "s",
    emphasis: "inverse",
    skeleton: "list",
    hidden: (h) => !of(h, "agenda"),
    head: (h) => ({ subhead: of(h, "agenda")?.sub }),
    render: (h) => {
      const a = of(h, "agenda");
      return a ? agenda(a) : null;
    },
  });

/** One of /home's lists, by the title /home gives it: `tinted` for the list that waits on this person alone. */
const listTile = (title: string, emphasis?: "tinted"): Widget<Home> =>
  on({
    title,
    size: "s",
    emphasis,
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

/** One of /home's charts, by the title /home gives it: `s` for a few bars that read in one lane. */
const chartTile = (title: string, size: "s" | "m" = "m"): Widget<Home> =>
  on({
    title,
    size,
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

const DECISIONS = "Waiting for your decision";
const BRIEFING = "Daily briefing";
const FOLLOW_UPS = "Today's follow-ups";

/**
 * One role's day: its figures, its main chart beside what's due next, three small cards (its two
 * lists and a compact chart), its queue, then its other charts.
 */
const day = (d: {
  chart: string;
  lists: [string, string];
  small: string;
  queue: string;
  charts?: string[];
}): Widget<Home>[] => [
  figures(),
  chartTile(d.chart),
  nextUp(),
  listTile(d.lists[0], d.lists[0] === DECISIONS ? "tinted" : undefined),
  listTile(d.lists[1]),
  chartTile(d.small, "s"),
  queueTile(d.queue),
  ...(d.charts ?? []).map((title) => chartTile(title)),
];

const days: Widget[] = [
  ...forRole(
    "management",
    day({
      chart: "Inquiries, quotes and wins",
      lists: [DECISIONS, BRIEFING],
      small: "Value won per month",
      queue: "All live cases",
      charts: ["Quotation turnaround", "Gross profit: expected vs actual"],
    }),
  ),
  ...forRole(
    "finance-director",
    day({
      chart: "Cash in vs cash out, next 8 weeks",
      lists: [DECISIONS, BRIEFING],
      small: "Receivables by age",
      queue: "All live cases",
      charts: ["Gross profit: expected vs actual"],
    }),
  ),
  ...forRole(
    "operations",
    day({
      chart: "Cash in vs cash out, next 8 weeks",
      lists: [FOLLOW_UPS, BRIEFING],
      small: "Time to acknowledge an RFQ",
      queue: "My queue",
    }),
  ),
  ...forRole(
    "sales",
    day({
      chart: "Inquiries, quotes and wins",
      lists: ["Pipeline next steps", BRIEFING],
      small: "Why we lose",
      queue: "My queue",
    }),
  ),
  ...forRole(
    "office-admin",
    day({
      chart: "Out-of-hours requests",
      lists: ["Inbox to triage", FOLLOW_UPS],
      small: "Time to acknowledge an RFQ",
      queue: "Desk cases",
    }),
  ),
  ...forRole(
    null,
    day({
      chart: "My deadlines, next 7 days",
      lists: [FOLLOW_UPS, BRIEFING],
      small: "My quote turnaround",
      queue: "My queue",
    }),
  ),
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
