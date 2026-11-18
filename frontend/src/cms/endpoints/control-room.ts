import type { Endpoint } from "payload";
import type { Doc } from "../types.ts";
import { history as H } from "./history.ts";
import { MONEY_ROLES, NOW, all, docHref, idOf, meOf, num, str, unauthorized } from "./insights-shared.ts";

/**
 * GET /api/control-room?period=4w|12w|6m — the management dashboards: pipeline & conversion,
 * speed & workload, profit & cash, delivery & suppliers. Today's numbers (live cases, owners,
 * receivables, suppliers) come from the collections; trends from ./history.ts. Profit & cash is
 * only sent to management and finance roles.
 */

export type Unit = "count" | "days" | "minutes" | "usd-k" | "egp-k" | "pct";
export type Period = "4w" | "12w" | "6m";
export const PERIODS: { value: Period; label: string }[] = [
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
export interface CrSuppliers {
  kind: "suppliers";
  title: string;
  sub: string;
  rows: {
    id: string;
    name: string;
    href: string;
    replyHrs?: number;
    onTime?: number;
    open: number;
    trend?: number[];
  }[];
}
export type CrWidget = CrChart | CrRanked | CrSuppliers;
export interface CrSection {
  id: "pipeline" | "speed" | "money" | "delivery";
  title: string;
  sub: string;
  widgets: CrWidget[];
}
export interface ControlRoom {
  period: Period;
  periods: typeof PERIODS;
  /** Whether profit & cash were included (management and finance only). */
  money: boolean;
  tiles: CrTile[];
  sections: CrSection[];
}

const LIVE_END = ["Closed — settled", "Lost", "Expired"];
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
const balance = (i: Doc) => Math.max(0, num(i.balance ?? num(i.amount) - num(i.paid)));

export function controlRoom(
  period: Period,
  role: string,
  data: { cases: Doc[]; invoices: Doc[]; suppliers: Doc[]; rfqs: Doc[]; users: Doc[] },
): ControlRoom {
  const money = MONEY_ROLES.includes(role);
  const nw = period === "4w" ? 4 : 12;
  const nm = period === "4w" ? 2 : period === "12w" ? 3 : 6;
  const wk = <T>(a: T[]) => a.slice(-nw);
  const mo = <T>(a: T[]) => a.slice(-nm);
  const weeks = wk(H.weeks);
  const months = mo(H.months);
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
      href: "/collections/cases",
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
      href: "/collections/supplier-rfqs",
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
        note: `${receivable.length} open invoice${receivable.length === 1 ? "" : "s"} · ${receivable.filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW).length} overdue`,
        href: "/collections/invoices",
      },
    );

  const owners = new Map<string, number>();
  for (const c of live) owners.set(str(idOf(c.owner)), (owners.get(str(idOf(c.owner))) ?? 0) + 1);
  const userName = (id: string) => str(data.users.find((u) => u.id === id)?.name ?? id);

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
          labels: weeks,
          series: [
            { name: "Inquiries", values: wk(H.inquiries) },
            { name: "Quoted", values: wk(H.quoted) },
            { name: "Won", values: wk(H.won) },
          ],
        },
        {
          kind: "chart",
          title: "Value won per month",
          sub: "Customer POs incl. partial awards",
          type: "bars",
          unit: "usd-k",
          labels: months,
          series: [{ name: "Value won", values: mo(H.wonValueK) }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: "Conversion by value",
          sub: "Value of POs ÷ value quoted, by month the RFQ arrived (November still open)",
          type: "line",
          unit: "pct",
          labels: months,
          series: [{ name: "Conversion", values: mo(H.conversion) }],
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
          labels: weeks,
          series: [{ name: "Median days", values: wk(H.turnaround) }],
          target: 1,
          targetLabel: "Target 1 d",
        },
        {
          kind: "chart",
          title: "Acknowledgement time",
          sub: "Median minutes to acknowledge an RFQ — automation live since 6 Oct",
          type: "bars",
          unit: "minutes",
          labels: weeks,
          series: [{ name: "Minutes", values: wk(H.ackMinutes) }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: "Out-of-hours requests",
          sub: "RFQs outside Sun–Thu 08:00–17:00, routed to the on-duty person",
          type: "bars",
          unit: "count",
          labels: weeks,
          series: [{ name: "Out-of-hours RFQs", values: wk(H.afterHours) }],
          highlightLast: true,
        },
        {
          kind: "ranked",
          title: "Live cases per owner",
          sub: "Every live case has an owner, a deadline and a next action",
          unit: "count",
          rows: [...owners]
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => ({ label: userName(id), value: n, href: "/collections/cases" })),
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
          labels: months,
          series: [
            { name: "Expected at quotation", values: mo(H.gpExpectedK) },
            { name: "Actual", values: mo(H.gpActualK) },
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
          type: "bars",
          unit: "egp-k",
          labels: months,
          series: H.sourceKeys.map((k) => ({ name: k, values: mo(H.sourceByMonth[k] ?? []) })),
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

  const supplierRows = data.suppliers
    .filter((s) => s.kind !== "own-stock")
    .map((s) => ({
      id: s.id,
      name: str(s.name),
      href: docHref("suppliers", s.id),
      replyHrs: typeof s.replyHrs === "number" ? s.replyHrs : undefined,
      onTime: typeof s.onTime === "number" ? s.onTime : undefined,
      open: rfqsOpen.filter((r) => idOf(r.supplier) === s.id).length,
      trend: H.supplierOnTime[s.id] ? mo(H.supplierOnTime[s.id]!) : undefined,
    }))
    .sort((a, b) => (b.onTime ?? -1) - (a.onTime ?? -1));
  const deliveryWeeks = H.weeks.slice(-Math.min(6, nw));
  sections.push({
    id: "delivery",
    title: "Delivery & suppliers",
    sub: "Who delivers on time, and how fast they answer",
    widgets: [
      {
        kind: "suppliers",
        title: "Supplier on-time vs reply time",
        sub: "On-time delivery and average reply time per supplier — open RFQs from the live records",
        rows: supplierRows,
      },
      {
        kind: "chart",
        title: "Deliveries by outcome",
        sub: "Deliveries to vessels per week",
        type: "bars",
        unit: "count",
        labels: deliveryWeeks,
        series: Object.entries(H.deliveryOutcomes).map(([name, values]) => ({
          name,
          values: values.slice(-deliveryWeeks.length),
        })),
      },
    ],
  });

  return { period, periods: PERIODS, money, tiles, sections };
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
      const [cases, invoices, suppliers, rfqs, users] = await Promise.all(
        ["cases", "invoices", "suppliers", "supplier-rfqs", "users"].map((c) => all(req, c, 0)),
      );
      return Response.json(controlRoom(period, str(me.role), { cases, invoices, suppliers, rfqs, users }));
    },
  },
];
