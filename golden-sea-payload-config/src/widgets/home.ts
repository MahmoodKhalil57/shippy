import { block, type NumberFormat, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { Home, HomeCase, HomeChart, HomeUnit, HomeWidget } from "../endpoints/home.ts";

/**
 * The dashboard's home (Payload `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role by GET /api/home (../endpoints/home.ts): KPI tiles with trends, decision /
 * briefing / follow-up lists, the case queue and charts. /home decides which of these a role
 * sees; the page draws each as its own tile, in one order packed for the board. The header's "While you were away" summary reads the user's unread notifications.
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

function queue(q: Extract<HomeWidget, { kind: "queue" }>): ViewBlock {
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
  return block("card", {
    heading: q.title,
    count: q.cases.length,
    actions: [{ label: "All cases", href: q.href }],
    blocks: [
      block("text", { text: q.sub, muted: true }),
      block("table", {
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
      }),
    ],
  });
}

function tiles(w: Extract<HomeWidget, { kind: "tiles" }>): ViewBlock {
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

function chart(c: HomeChart): ViewBlock {
  return block("chart", {
    title: c.title,
    subhead: c.sub,
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

function list(l: Extract<HomeWidget, { kind: "lists" }>["lists"][number]): ViewBlock {
  return block("card", {
    heading: l.title,
    subhead: l.sub,
    count: l.items.length,
    actions: l.href ? [{ label: l.hrefLabel ?? "All", href: l.href }] : undefined,
    blocks: [
      block("list", {
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
      }),
    ],
  });
}

/** /home's widget of a kind (a role has at most one of each). */
const of = <K extends HomeWidget["kind"]>(h: Home, kind: K) =>
  h.widgets.find((w): w is Extract<HomeWidget, { kind: K }> => w.kind === kind);

/**
 * One tile per thing /home sends: its figures, each list, the case queue, each chart. Their
 * headings come from the data (they differ by role), so each draws its own card. A role without
 * a part leaves its tile out.
 */
const on = from<Home>(home);
const listTile = (i: number): Widget<Home> =>
  on({
    size: "s",
    skeleton: "list",
    hidden: (h) => !of(h, "lists")?.lists[i],
    render: (h) => {
      const l = of(h, "lists")?.lists[i];
      return l ? list(l) : null;
    },
  });
const chartTile = (i: number): Widget<Home> =>
  on({
    size: "m",
    skeleton: "chart",
    hidden: (h) => !of(h, "charts")?.charts[i],
    render: (h) => {
      const c = of(h, "charts")?.charts[i];
      return c ? chart(c) : null;
    },
  });

const figures = on({
  title: "Your numbers today",
  size: "m",
  skeleton: "stats",
  hidden: (h) => !of(h, "tiles"),
  render: (h) => {
    const t = of(h, "tiles");
    return t ? tiles(t) : null;
  },
});

const cases = on({
  size: "l",
  skeleton: "table",
  hidden: (h) => !of(h, "queue"),
  render: (h) => {
    const q = of(h, "queue");
    return q ? queue(q) : null;
  },
});

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
  widgets: [figures, listTile(0), listTile(1), cases, chartTile(0), chartTile(1)],
});
