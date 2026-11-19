import type { Endpoint } from "payload";
import { block, formatNumber, type Action, type NumberFormat, type ViewBlock } from "../../app/view/schema.ts";
import {
  controlRoomEndpoints,
  type ControlRoom,
  type CrRanked,
  type CrSuppliers,
  type CrWidget,
  type Unit,
} from "../endpoints/control-room.ts";
import { MONEY_ROLES, meOf, str } from "../endpoints/insights-shared.ts";
import { via } from "./via.ts";

/**
 * The control room (/control-room): "The business, live. Briefed at 07:00." for Karim Balbaa and
 * Mohamed Helmy: the 07:00 AI briefing (`gs-briefing`, GET /api/briefing), "Ask Golden Sea"
 * (`gs-ask`, POST /api/ask) and the management dashboards (GET /api/control-room): pipeline &
 * conversion, speed & workload, profit & cash (management and finance only) and delivery &
 * suppliers, with one period filter (`?period=`) above the charts.
 */

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

const sub = (text: string) => block("text", { text, muted: true, variant: "body-sm" });

function ranked(r: CrRanked) {
  const max = Math.max(1, ...r.rows.map((x) => x.value), r.minimum ?? 0);
  return block("card", {
    heading: r.title,
    blocks: [
      sub(r.sub),
      block("gauges", {
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
      }),
    ],
  });
}

function suppliers(s: CrSuppliers) {
  return block("card", {
    heading: s.title,
    blocks: [
      sub(s.sub),
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
            r.replyHrs === undefined
              ? null
              : { text: `${r.replyHrs} h`, tone: r.replyHrs > 24 ? "warning" : undefined },
          open: r.open ? String(r.open) : null,
        })),
      }),
    ],
  });
}

function widget(w: CrWidget): ViewBlock {
  if (w.kind === "ranked") return ranked(w);
  if (w.kind === "suppliers") return suppliers(w);
  return block("chart", {
    title: w.title,
    subhead: w.sub,
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
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/control-room?period=4w|12w|6m: the control room as a View (src/app/view).
    path: "/views/control-room",
    method: "get",
    handler: async (req) => {
      const d = await via<ControlRoom>(controlRoomEndpoints, "get", "/control-room", req);
      if (d instanceof Response) return d;
      const money = MONEY_ROLES.includes(str(meOf(req)?.role));
      const actions: Action[] = [
        { label: "Approvals", href: "/approvals" },
        ...(money ? [{ label: "Receivables & payables", href: "/cash" }] : []),
        { label: "All cases", href: "/collections/cases", variant: "filled" as const },
      ];
      const blocks: ViewBlock[] = [
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
        block("grid", {
          fit: "md",
          blocks: [
            block("custom", { element: "gs-briefing" }),
            block("card", {
              heading: "Ask Golden Sea",
              tags: [{ label: "Assistant", tone: "primary", icon: "chat" }],
              blocks: [block("custom", { element: "gs-ask" })],
            }),
          ],
        }),
        block("text", { text: "Management dashboards", variant: "title-md" }),
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
        ...d.sections.map((s) =>
          block("card", {
            heading: s.title,
            subhead: s.sub,
            blocks: [block("grid", { fit: "md", blocks: s.widgets.map(widget) })],
          }),
        ),
      ];
      if (!d.money)
        blocks.push(
          block("card", {
            heading: "Profit & cash",
            blocks: [
              block("text", {
                text: "Gross profit, margins, receivables and cash flow are shown to management and finance only.",
                muted: true,
              }),
            ],
          }),
        );
      return Response.json({
        header: {
          eyebrow: "Control room · for Karim Balbaa & Mohamed Helmy",
          heading: "The business, live.",
          subtitle:
            "Briefed at 07:00 from every case, quote, delivery and payment — and answers to any question about them.",
          actions,
        },
        blocks,
      });
    },
  },
];
