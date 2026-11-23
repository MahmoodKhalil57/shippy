import type { Endpoint } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { history as H, historyLabel, inquiriesDaily } from "./history.ts";
import { type Lang, MONEY_ROLES, NOW, all, langOf, meOf, num, str, unauthorized } from "./insights-shared.ts";
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
const PERIODS: { value: Period; label: (o: { locale: Lang }) => string }[] = [
  { value: "4w", label: (o) => m.api_control_room_last_4_weeks({}, o) },
  { value: "12w", label: (o) => m.api_control_room_last_12_weeks({}, o) },
  { value: "6m", label: (o) => m.api_control_room_last_6_months({}, o) },
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
  lang: Lang = "en",
): ControlRoom {
  const o = { locale: lang };
  const t = (label: string) => historyLabel(label, lang);
  const ts = (labels: string[]) => labels.map(t);
  const money = MONEY_ROLES.includes(role);
  const nw = period === "4w" ? 4 : 12;
  const nm = period === "4w" ? 2 : period === "12w" ? 3 : 6;
  const wk = <T>(a: T[]) => a.slice(-nw);
  const mo = <T>(a: T[]) => a.slice(-nm);
  const weeks = ts(wk(H.weeks));
  const months = ts(mo(H.months));
  /** The trend charts' ranges, in points: weeks and months of history. */
  const WEEKS = [4, 8, 12];
  const MONTHS = [3, 6];
  const label = PERIODS.find((p) => p.value === period)!
    .label(o)
    .toLowerCase();

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
      label: m.api_control_room_open_rfqs({}, o),
      value: String(live.length),
      note: m.api_control_room_blocked_or_urgent(
        { count: live.filter((c) => c.urgent || c.tone === "danger").length },
        o,
      ),
      href: link.list("cases"),
      trend: { labels: weeks, values: wk(H.inquiries), unit: "count" },
    },
    {
      label: m.api_control_room_avg_time_to_quote({}, o),
      value: m.api_control_room_days({ n: (H.turnaround.at(-1) ?? 0).toFixed(1) }, o),
      note: m.api_control_room_turnaround_note({ was: H.turnaround[0]! }, o),
      tone: "success",
      trend: { labels: weeks, values: wk(H.turnaround), unit: "days" },
    },
    {
      label: m.api_control_room_win_rate({}, o),
      value: `${Math.round((won / Math.max(1, quoted)) * 100)}%`,
      note: m.api_control_room_won_of_quoted({ won, quoted, period: label }, o),
      trend: { labels: months, values: mo(H.conversion), unit: "pct" },
    },
    {
      label: m.api_control_room_waiting_on_suppliers({}, o),
      value: String(waitingSuppliers),
      note: m.api_control_room_rfqs_without_reply({ count: rfqsOpen.length }, o),
      tone: waitingSuppliers ? "warning" : undefined,
      href: link.list("supplier-rfqs"),
      trend: { labels: ts(H.weeks.slice(-nw)), values: wk(H.waitTrend["Awaiting supplier"] ?? []), unit: "count" },
    },
  ];
  if (money)
    tiles.push(
      {
        label: m.api_control_room_gross_profit_month({ month: t(H.months.at(-1)!) }, o),
        value: m.api_control_room_thousands({ currency: "EGP", n: H.gpActualK.at(-1)! }, o),
        note: m.api_control_room_gp_note(
          { expected: m.api_control_room_thousands({ currency: "EGP", n: H.gpExpectedK.at(-1)! }, o) },
          o,
        ),
        trend: { labels: months, values: mo(H.gpActualK), unit: "egp-k" },
      },
      {
        label: m.api_control_room_receivables_open({}, o),
        value: m.api_control_room_thousands({ currency: "USD", n: (usdOpen / 1000).toFixed(1) }, o),
        note: m.api_control_room_open_invoices({ count: receivable.length }, o),
        href: link.list("invoices"),
        ...(() => {
          const overdue = receivable.filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW).length;
          return receivable.length
            ? {
                share: {
                  value: overdue / receivable.length,
                  text: m.api_control_room_overdue_of({ overdue, total: receivable.length }, o),
                },
              }
            : {};
        })(),
      },
    );

  const sections: CrSection[] = [
    {
      id: "pipeline",
      title: m.api_control_room_pipeline_title({}, o),
      sub: m.api_control_room_pipeline_sub({}, o),
      widgets: [
        {
          kind: "chart",
          title: m.api_control_room_inquiries_chart_title({}, o),
          sub: m.api_control_room_inquiries_chart_sub({}, o),
          type: "line",
          unit: "count",
          labels: ts(H.weeks),
          grain: "week",
          ranges: WEEKS,
          series: [
            { name: m.api_control_room_inquiries({}, o), values: H.inquiries },
            { name: m.api_control_room_quoted({}, o), values: H.quoted },
            { name: m.api_control_room_won({}, o), values: H.won },
          ],
        },
        {
          kind: "chart",
          title: m.api_control_room_value_won_title({}, o),
          sub: m.api_control_room_value_won_sub({}, o),
          type: "bars",
          unit: "usd-k",
          labels: ts(H.months),
          grain: "month",
          ranges: MONTHS,
          series: [{ name: m.api_control_room_value_won({}, o), values: H.wonValueK }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: m.api_control_room_conversion_title({}, o),
          sub: m.api_control_room_conversion_sub({}, o),
          type: "line",
          unit: "pct",
          labels: ts(H.months),
          grain: "month",
          ranges: MONTHS,
          series: [{ name: m.api_control_room_conversion({}, o), values: H.conversion }],
          target: 35,
          targetLabel: m.api_control_room_target_35({}, o),
        },
        {
          kind: "ranked",
          title: m.api_control_room_funnel_title({}, o),
          sub: m.api_control_room_funnel_sub({}, o),
          unit: "count",
          rows: H.funnel.map(([l, v]) => ({ label: t(l), value: v })),
        },
        {
          kind: "ranked",
          title: m.api_control_room_lost_title({}, o),
          sub: m.api_control_room_lost_sub({}, o),
          unit: "count",
          rows: H.lostReasons.map(([l, v]) => ({ label: t(l), value: v })),
        },
      ],
    },
    {
      id: "speed",
      title: m.api_control_room_speed_title({}, o),
      sub: m.api_control_room_speed_sub({}, o),
      widgets: [
        {
          kind: "chart",
          title: m.api_control_room_turnaround_title({}, o),
          sub: m.api_control_room_turnaround_sub({}, o),
          type: "line",
          unit: "days",
          labels: ts(H.weeks),
          grain: "week",
          ranges: WEEKS,
          series: [{ name: m.api_control_room_median_days({}, o), values: H.turnaround }],
          target: 1,
          targetLabel: m.api_control_room_target_1_day({}, o),
        },
        {
          kind: "chart",
          title: m.api_control_room_ack_title({}, o),
          sub: m.api_control_room_ack_sub({}, o),
          type: "bars",
          unit: "minutes",
          labels: ts(H.weeks),
          grain: "week",
          ranges: WEEKS,
          series: [{ name: m.api_control_room_minutes({}, o), values: H.ackMinutes }],
          highlightLast: true,
        },
        {
          kind: "chart",
          title: m.api_control_room_after_hours_title({}, o),
          sub: m.api_control_room_after_hours_sub({}, o),
          type: "bars",
          unit: "count",
          labels: ts(H.weeks),
          grain: "week",
          ranges: WEEKS,
          series: [{ name: m.api_control_room_after_hours({}, o), values: H.afterHours }],
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
          ? m.api_control_room_over_30_days(
              {
                amount: m.api_control_room_thousands({ currency: "USD", n: (buckets[2]! + buckets[3]!).toFixed(1) }, o),
              },
              o,
            )
          : m.api_control_room_nothing_over_30_days({}, o),
    }));
    sections.push({
      id: "money",
      title: m.api_control_room_money_title({}, o),
      sub: m.api_control_room_money_sub({}, o),
      widgets: [
        {
          kind: "chart",
          title: m.api_control_room_gp_title({}, o),
          sub: m.api_control_room_gp_sub({}, o),
          type: "line",
          unit: "egp-k",
          labels: ts(H.months),
          grain: "month",
          ranges: MONTHS,
          series: [
            { name: m.api_control_room_expected_at_quotation({}, o), values: H.gpExpectedK },
            { name: m.api_control_room_actual({}, o), values: H.gpActualK },
          ],
        },
        {
          kind: "ranked",
          title: m.api_control_room_margin_store_title({}, o),
          sub: m.api_control_room_margin_store_sub({}, o),
          unit: "pct",
          minimum: 15,
          rows: H.marginByStore.map(([l, v]) => ({ label: t(l), value: v })),
        },
        {
          kind: "chart",
          title: m.api_control_room_sales_source_title({}, o),
          sub: m.api_control_room_sales_source_sub({}, o),
          type: "line",
          stacked: true,
          unit: "egp-k",
          labels: ts(H.months),
          grain: "month",
          ranges: MONTHS,
          series: H.sourceKeys.map((k) => ({ name: t(k), values: H.sourceByMonth[k] ?? [] })),
        },
        {
          kind: "ranked",
          title: m.api_control_room_margin_source_title({}, o),
          sub: m.api_control_room_margin_source_sub({}, o),
          unit: "pct",
          minimum: 15,
          rows: H.sourceMargin.map(([l, v]) => ({ label: t(l), value: v })),
        },
        {
          kind: "chart",
          title: m.api_control_room_ageing_title({}, o),
          sub: m.api_control_room_ageing_sub({}, o),
          type: "bars",
          unit: "usd-k",
          labels: ts(H.ageingKeys),
          series: [{ name: m.api_control_room_receivables({}, o), values: H.ageing }],
        },
        {
          kind: "ranked",
          title: m.api_control_room_receivables_customer_title({}, o),
          sub: m.api_control_room_receivables_customer_sub({}, o),
          unit: "usd-k",
          rows: byCustomer.sort((a, b) => b.value - a.value),
        },
        {
          kind: "chart",
          title: m.api_control_room_cash_title({}, o),
          sub: m.api_control_room_cash_sub({}, o),
          type: "line",
          unit: "egp-k",
          labels: ts(H.cashWeeks),
          series: [
            { name: m.api_control_room_receipts({}, o), values: H.receiptsK },
            { name: m.api_control_room_payments({}, o), values: H.paymentsK },
          ],
        },
      ],
    });
  }

  const deliveryWeeks = ts(H.weeks.slice(-6));
  sections.push({
    id: "delivery",
    title: m.api_control_room_delivery_title({}, o),
    sub: m.api_control_room_delivery_sub({}, o),
    widgets: [
      {
        kind: "chart",
        title: m.api_control_room_deliveries_title({}, o),
        sub: m.api_control_room_deliveries_sub({}, o),
        type: "bars",
        stacked: true,
        unit: "count",
        labels: deliveryWeeks,
        grain: "week",
        ranges: [4, 6],
        series: Object.entries(H.deliveryOutcomes).map(([name, values]) => ({
          name: t(name),
          values: values.slice(-deliveryWeeks.length),
        })),
      },
    ],
  });

  const visuals: ControlRoom["visuals"] = {
    funnel: [
      { label: m.api_control_room_inquiries({}, o), value: sum(wk(H.inquiries)) },
      { label: m.api_control_room_quoted({}, o), value: sum(wk(H.quoted)) },
      { label: m.api_control_room_won({}, o), value: sum(wk(H.won)) },
    ],
    lost: H.lostReasons.map(([label, value]) => ({ label: t(label), value })),
    ageing: money ? H.ageingKeys.map((label, i) => ({ label: t(label), value: H.ageing[i]! })) : [],
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
      if (!me) return unauthorized(langOf(req));
      const q = (req.query ?? {}) as Record<string, unknown>;
      const period = (PERIODS.some((p) => p.value === q.period) ? q.period : "12w") as Period;
      const [cases, invoices, rfqs] = await Promise.all(
        ["cases", "invoices", "supplier-rfqs"].map((c) => all(req, c, 0)),
      );
      return Response.json(controlRoom(period, str(me.role), { cases, invoices, rfqs }, langOf(req)));
    },
  },
];
