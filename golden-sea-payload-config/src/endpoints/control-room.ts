import type { Endpoint } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { history as H, inquiriesDaily } from "./history.ts";
import { MONEY_ROLES, NOW, all, meOf, num, str, unauthorized } from "./insights-shared.ts";
import * as link from "../links.ts";

/**
 * GET /api/control-room?period=4w|12w|6m — the management dashboards: pipeline & conversion,
 * speed & workload, profit & cash, delivery. The key figures put today's numbers (live cases,
 * supplier RFQs, receivables) beside their trends from ./history.ts; the charts and rankings are
 * that history. Profit & cash is only sent to management and finance roles. What one collection
 * says on its own (live cases per owner, each supplier's on-time and reply time and open RFQs) is
 * a data widget on the page (../pages/control-room.ts), not here.
 *
 * The period sets the key figures' window.
 * The trend charts always carry their whole history (`grain`, `ranges`), so each can be cut to
 * another range on the screen without asking again.
 */

export type Unit = "count" | "days" | "minutes" | "usd-k" | "egp-k" | "pct";
export type Period = "4w" | "12w" | "6m";
const PERIODS: { value: Period; label: string }[] = [
  { value: "4w", label: "Last 4 weeks" },
  { value: "12w", label: "Last 12 weeks" },
  { value: "6m", label: "Last 6 months" },
];

export interface CrTile {
  label: string;
  value: string;
  note: string;
  tone?: "success" | "warning" | "error";
  href?: string;
  trend?: { labels: string[]; values: number[]; unit: Unit };
  /** Its part of a whole (overdue of open), 0 to 1, with its words. */
  share?: { value: number; text: string };
}
export interface CrChart {
  kind: "chart";
  title: string;
  sub: string;
  type: "bars" | "line";
  unit: Unit;
  labels: string[];
  series: { name: string; values: number[] }[];
  target?: number;
  targetLabel?: string;
  highlightLast?: boolean;
  /** The series are parts of a whole (sales by source, deliveries by outcome). */
  stacked?: boolean;
  /** A trend over time: what one point is, and the ranges (in points) worth offering. */
  grain?: "week" | "month";
  ranges?: number[];
}
export interface CrRanked {
  kind: "ranked";
  title: string;
  sub: string;
  unit: Unit;
  rows: { label: string; value: number; note?: string; href?: string }[];
  /** A policy minimum: rows below it are flagged. */
  minimum?: number;
}
export type CrWidget = CrChart | CrRanked;
export interface CrSection {
  id: "pipeline" | "speed" | "money" | "delivery";
  title: string;
  sub: string;
  widgets: CrWidget[];
}
export interface ControlRoom {
  period: Period;
  /** Whether profit & cash were included (management and finance only). */
  money: boolean;
  tiles: CrTile[];
  sections: CrSection[];
  /**
   * The quote funnel over the period (inquiries, quoted, won), why quotes were lost, receivables
   * by age (USD thousands; management and finance only, else empty), and inquiries per day for
   * the last 12 weeks.
   */
  visuals: {
    funnel: { label: string; value: number }[];
    lost: { label: string; value: number }[];
    ageing: { label: string; value: number }[];
    days: { date: string; value: number }[];
  };
}

const LIVE_END = ["Closed — settled", "Lost", "Expired"];
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
const balance = (i: Doc) => Math.max(0, num(i.balance ?? num(i.amount) - num(i.paid)));

export function controlRoom(
  period: Period,
  role: string,
  data: { cases: Doc[]; invoices: Doc[]; rfqs: Doc[] },
): ControlRoom {
  const money = MONEY_ROLES.includes(role);
  const nw = period === "4w" ? 4 : 12;
  const nm = period === "4w" ? 2 : period === "12w" ? 3 : 6;
  const wk = <T>(a: T[]) => a.slice(-nw);
  const mo = <T>(a: T[]) => a.slice(-nm);
  const weeks = wk(H.weeks);
  const months = mo(H.months);
  /** The trend charts' ranges, in points: weeks and months of history. */
  const WEEKS = [4, 8, 12];
  const MONTHS = [3, 6];
  const label = PERIODS.find((p) => p.value === period)!.label.toLowerCase();

  const live = data.cases.filter((c) => !LIVE_END.includes(str(c.stage)));
  const waitingSuppliers = live.filter((c) => c.wait === "Awaiting supplier").length;
  const rfqsOpen = data.rfqs.filter((r) =>
    ["Sent", "Awaiting reply", "Partial reply", "No response"].includes(str(r.status)),
  );
  const quoted = sum(wk(H.quoted));
  const won = sum(wk(H.won));
  const receivable = data.invoices.filter((i) => balance(i) > 0 && !["Draft", "Cancelled"].includes(str(i.status)));
  const usdOpen = receivable.filter((i) => (str(i.currency) || "USD") === "USD").reduce((s, i) => s + balance(i), 0);

  const tiles: CrTile[] = [
    {
      label: "Open RFQs",
      value: String(live.length),
      note: `${live.filter((c) => c.urgent || c.tone === "danger").length} blocked or urgent`,
      href: link.list("cases"),
      trend: { labels: weeks, values: wk(H.inquiries), unit: "count" },
    },
    {
      label: "Avg time to quote",
      value: `${(H.turnaround.at(-1) ?? 0).toFixed(1)} d`,
      note: `was ${H.turnaround[0]} d in September · target 1 d`,
      tone: "success",
      trend: { labels: weeks, values: wk(H.turnaround), unit: "days" },
    },
    {
      label: "Win rate",
      value: `${Math.round((won / Math.max(1, quoted)) * 100)}%`,
      note: `${won} won of ${quoted} quoted, ${label}`,
      trend: { labels: months, values: mo(H.conversion), unit: "pct" },
    },
    {
      label: "Waiting on suppliers",
      value: String(waitingSuppliers),
      note: `${rfqsOpen.length} supplier RFQ${rfqsOpen.length === 1 ? "" : "s"} without a full reply`,
      tone: waitingSuppliers ? "warning" : undefined,
      href: link.list("supplier-rfqs"),
      trend: { labels: H.weeks.slice(-nw), values: wk(H.waitTrend["Awaiting supplier"] ?? []), unit: "count" },
    },
  ];
  if (money)
    tiles.push(
      {
        label: `Gross profit ${H.months.at(-1)}`,
        value: `EGP ${H.gpActualK.at(-1)}k`,
        note: `actual so far · EGP ${H.gpExpectedK.at(-1)}k expected at quotation`,
        trend: { labels: months, values: mo(H.gpActualK), unit: "egp-k" },
      },
      {
        label: "Receivables open",
        value: `USD ${(usdOpen / 1000).toFixed(1)}k`,
        note: `${receivable.length} open invoice${receivable.length === 1 ? "" : "s"}`,
        href: link.list("invoices"),
        ...(() => {
          const overdue = receivable.filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW).length;
          return receivable.length
            ? { share: { value: overdue / receivable.length, text: `${overdue} of ${receivable.length} overdue` } }
            : {};
        })(),
      },
    );

  const sections: CrSection[] = [
    {
      id: "pipeline",
      title: "Pipeline & conversion",
      sub: "Inquiries to wins, and why we lose",
      widgets: [
        {
          kind: "chart",
          title: "Inquiries, quotes and wins",
          sub: "RFQ cases per week of receipt",
          type: "line",
          unit: "count",
          labels: H.weeks,
          grain: "week",
          ranges: WEEKS,
          series: [
            { name: "Inquiries", values: H.inquiries },
            { name: "Quoted", values: H.quoted },
            { name: "Won", values: H.won },
          ],
        },
        {
          kind: "chart",
          title: "Value won per month",
          sub: "Customer POs incl. partial awards",
          type: "bars",
          unit: "usd-k",
          labels: H.months,
          grain: "month",
          ranges: MONTHS,
          series: [{ name: "Value won", values: H.wonValueK }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: "Conversion by value",
          sub: "Value of POs ÷ value quoted, by month the RFQ arrived (November still open)",
          type: "line",
          unit: "pct",
          labels: H.months,
          grain: "month",
          ranges: MONTHS,
          series: [{ name: "Conversion", values: H.conversion }],
          target: 35,
          targetLabel: "Target 35%",
        },
        {
          kind: "ranked",
          title: "Conversion funnel",
          sub: "Last 90 days, each step counted once",
          unit: "count",
          rows: H.funnel.map(([l, v]) => ({ label: l, value: v })),
        },
        {
          kind: "ranked",
          title: "Why we lose",
          sub: "Lost cases by recorded reason, last 90 days",
          unit: "count",
          rows: H.lostReasons.map(([l, v]) => ({ label: l, value: v })),
        },
      ],
    },
    {
      id: "speed",
      title: "Speed & workload",
      sub: "How fast we answer, and who carries the load",
      widgets: [
        {
          kind: "chart",
          title: "Quote turnaround",
          sub: "Median days from RFQ received to quote sent",
          type: "line",
          unit: "days",
          labels: H.weeks,
          grain: "week",
          ranges: WEEKS,
          series: [{ name: "Median days", values: H.turnaround }],
          target: 1,
          targetLabel: "Target 1 d",
        },
        {
          kind: "chart",
          title: "Acknowledgement time",
          sub: "Median minutes to acknowledge an RFQ — automation live since 6 Oct",
          type: "bars",
          unit: "minutes",
          labels: H.weeks,
          grain: "week",
          ranges: WEEKS,
          series: [{ name: "Minutes", values: H.ackMinutes }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: "Out-of-hours requests",
          sub: "RFQs outside Sun–Thu 08:00–17:00, routed to the on-duty person",
          type: "bars",
          unit: "count",
          labels: H.weeks,
          grain: "week",
          ranges: WEEKS,
          series: [{ name: "Out-of-hours RFQs", values: H.afterHours }],
          highlightLast: true,
        },
      ],
    },
  ];

  if (money) {
    const byCustomer = H.ageingByCustomer.map(([name, buckets]) => ({
      label: name,
      value: sum(buckets),
      note:
        buckets[2] || buckets[3]
          ? `USD ${(buckets[2]! + buckets[3]!).toFixed(1)}k over 30 days`
          : "nothing over 30 days",
    }));
    sections.push({
      id: "money",
      title: "Profit & cash",
      sub: "Management and finance only",
      widgets: [
        {
          kind: "chart",
          title: "Gross profit: expected vs actual",
          sub: "Actual replaces estimates as costs are billed (November in progress)",
          type: "line",
          unit: "egp-k",
          labels: H.months,
          grain: "month",
          ranges: MONTHS,
          series: [
            { name: "Expected at quotation", values: H.gpExpectedK },
            { name: "Actual", values: H.gpActualK },
          ],
        },
        {
          kind: "ranked",
          title: "Margin by store",
          sub: "Actual gross margin, last 90 days · minimum 15%",
          unit: "pct",
          minimum: 15,
          rows: H.marginByStore.map(([l, v]) => ({ label: l, value: v })),
        },
        {
          kind: "chart",
          title: "Sales by source",
          sub: "Agency pricelists and own stock carry more margin than buying to order",
          type: "line",
          stacked: true,
          unit: "egp-k",
          labels: H.months,
          grain: "month",
          ranges: MONTHS,
          series: H.sourceKeys.map((k) => ({ name: k, values: H.sourceByMonth[k] ?? [] })),
        },
        {
          kind: "ranked",
          title: "Margin by source",
          sub: "Gross margin, last 90 days · minimum 15%",
          unit: "pct",
          minimum: 15,
          rows: H.sourceMargin.map(([l, v]) => ({ label: l, value: v })),
        },
        {
          kind: "chart",
          title: "Receivables ageing",
          sub: "All customers, by days past due",
          type: "bars",
          unit: "usd-k",
          labels: H.ageingKeys,
          series: [{ name: "Receivables", values: H.ageing }],
        },
        {
          kind: "ranked",
          title: "Receivables by customer",
          sub: "Open balances, all ages",
          unit: "usd-k",
          rows: byCustomer.sort((a, b) => b.value - a.value),
        },
        {
          kind: "chart",
          title: "Cash in vs cash out",
          sub: "Expected customer receipts and committed supplier payments, next 8 weeks",
          type: "line",
          unit: "egp-k",
          labels: H.cashWeeks,
          series: [
            { name: "Receipts", values: H.receiptsK },
            { name: "Payments", values: H.paymentsK },
          ],
        },
      ],
    });
  }

  const deliveryWeeks = H.weeks.slice(-6);
  sections.push({
    id: "delivery",
    title: "Delivery & suppliers",
    sub: "Who delivers on time, and how fast they answer",
    widgets: [
      {
        kind: "chart",
        title: "Deliveries by outcome",
        sub: "Deliveries to vessels per week",
        type: "bars",
        stacked: true,
        unit: "count",
        labels: deliveryWeeks,
        grain: "week",
        ranges: [4, 6],
        series: Object.entries(H.deliveryOutcomes).map(([name, values]) => ({
          name,
          values: values.slice(-deliveryWeeks.length),
        })),
      },
    ],
  });

  const visuals: ControlRoom["visuals"] = {
    funnel: [
      { label: "Inquiries", value: sum(wk(H.inquiries)) },
      { label: "Quoted", value: sum(wk(H.quoted)) },
      { label: "Won", value: sum(wk(H.won)) },
    ],
    lost: H.lostReasons.map(([label, value]) => ({ label, value })),
    ageing: money ? H.ageingKeys.map((label, i) => ({ label, value: H.ageing[i]! })) : [],
    days: inquiriesDaily(NOW),
  };
  return { period, money, tiles, sections, visuals };
}

export const controlRoomEndpoints: Endpoint[] = [
  {
    path: "/control-room",
    method: "get",
    handler: async (req) => {
      const me = meOf(req);
      if (!me) return unauthorized();
      const q = (req.query ?? {}) as Record<string, unknown>;
      const period = (PERIODS.some((p) => p.value === q.period) ? q.period : "12w") as Period;
      const [cases, invoices, rfqs] = await Promise.all(
        ["cases", "invoices", "supplier-rfqs"].map((c) => all(req, c, 0)),
      );
      return Response.json(controlRoom(period, str(me.role), { cases, invoices, rfqs }));
    },
  },
];
