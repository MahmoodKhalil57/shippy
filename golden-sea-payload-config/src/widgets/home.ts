import { block, type NumberFormat, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { Home, HomeCase, HomeUnit, HomeWidget } from "../endpoints/home.ts";

/**
 * The dashboard's home (Payload `admin.components.views.dashboard`): the signed-in user's day,
 * tailored to their role by GET /api/home (../endpoints/home.ts): KPI tiles with trends, decision /
 * briefing / follow-up lists, the case queue and charts. /home decides which of these a role
 * sees and in what order, so the page is a row of slots, each drawing the data's widget at its
 * place. The header's "While you were away" summary reads the user's unread notifications.
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
    actions: [{ label: "All cases", href: q.href, variant: "text" }],
    blocks: [
      block("text", { text: q.sub, muted: true, variant: "body-sm" }),
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

/** One of /home's widgets, by its kind. */
function draw(w: HomeWidget): ViewBlock {
  switch (w.kind) {
    case "tiles":
      return block("stats", {
        items: w.tiles.map((t) => ({
          label: t.label,
          value: t.value,
          note: t.note,
          tone: t.tone,
          href: t.href,
          trend: t.trend && {
            labels: t.trend.labels,
            values: scale(t.trend.unit, t.trend.values),
            format: FORMAT[t.trend.unit],
          },
        })),
      });
    case "charts":
      return block("grid", {
        fit: "md",
        blocks: w.charts.map((c) =>
          block("chart", {
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
          }),
        ),
      });
    case "lists":
      return block("grid", {
        fit: "md",
        blocks: w.lists.map((l) =>
          block("card", {
            heading: l.title,
            subhead: l.sub,
            count: l.items.length,
            actions: l.href ? [{ label: l.hrefLabel ?? "All", href: l.href, variant: "text" }] : undefined,
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
          }),
        ),
      });
    case "queue":
      return queue(w);
  }
}

/** The data's widget at place `i` (every role has four); the last slot also draws any after it. */
const slot = (i: number, last = false): Widget<Home> => ({
  source: home,
  skeleton: "card",
  render: (h) => (last ? h.widgets.slice(i) : h.widgets.slice(i, i + 1)).map(draw),
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
        actions: h.actions.map((a) => ({ label: a.label, href: a.href, variant: a.primary ? "filled" : "tonal" })),
      };
    },
  },
  widgets: [slot(0), slot(1), slot(2), slot(3, true)],
});
