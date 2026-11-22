import type { Endpoint } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { history as H } from "./history.ts";
import { DAY, MONEY_ROLES, NOW, all, date, idOf, meOf, nameOf, num, str, unauthorized } from "./insights-shared.ts";
import * as link from "../links.ts";

/**
 * GET /api/visuals: what the dashboards draw as shapes rather than numbers, for the signed-in user.
 *
 * - `deadlines`: quote deadlines on the live cases and the vessels' arrivals, soonest first, each
 *   with when its clock started (a quote's from 5 days before its deadline, an arrival's from
 *   7), for a live countdown; Sales and the sourcing desk see their own cases, everyone else all.
 * - `calendar`: this month's deadlines, arrivals, deliveries and invoices falling due, toned by how
 *   close they are, for a month view.
 * - `targets`: the figures management steers by against their targets (win rate, quote turnaround,
 *   time to acknowledge, on-time delivery), with the bands they read in.
 * - `turnaround` and `ack`: the latest quote turnaround and acknowledgement time, for dials.
 * - `waiting`: what the live cases wait on, for a share bar.
 * - `suppliers`: each supplier's on-time share and reply time, for a quadrant.
 * - Money (management, finance, operations; empty for everyone else): `receivables` by customer
 *   (USD thousands) and the gross profit `gp` bridge from expected to actual (EGP); the cash bridge
 *   is the cash forecast's own (GET /api/operations/cash).
 *
 * Live collections where they hold it; the trends and the profit bridge are the illustrative
 * history (./history.ts), as on the other dashboards.
 */
export interface Visuals {
  today: string;
  month: string;
  deadlines: { label: string; due: string; from: string; supporting: string; href?: string }[];
  calendar: { date: string; label: string; href?: string; tone: "neutral" | "warning" | "error" | "success" }[];
  targets: {
    label: string;
    value: number;
    max: number;
    target: number;
    bands: number[];
    valueText: string;
    targetText: string;
    lowerIsBetter?: boolean;
  }[];
  turnaround: number;
  ack: number;
  waiting: { label: string; value: number; href?: string }[];
  suppliers: { label: string; x: number; y: number; href?: string }[];
  money: boolean;
  receivables: { label: string; value: number }[];
  gp: { label: string; value: number; total?: boolean }[];
}

const MINE_ROLES = ["sales", "sourcing"];
const last = (a: number[]) => a[a.length - 1] ?? 0;
const sum = (a: number[]) => a.reduce((t, v) => t + v, 0);
const iso = (d: Date) => d.toISOString();
const dayOf = (d: Date) => iso(d).slice(0, 10);

export function visuals(
  role: string,
  me: string,
  data: { cases: Doc[]; invoices: Doc[]; deliveries: Doc[]; suppliers: Doc[] },
): Visuals {
  const money = MONEY_ROLES.includes(role);
  const LIVE_END = ["Closed — settled", "Lost", "Expired"];
  const live = data.cases.filter((c) => !LIVE_END.includes(str(c.stage)));
  const mine = MINE_ROLES.includes(role) || !role ? live.filter((c) => idOf(c.owner) === me) : live;
  const caseName = (c: Doc) => `${str(c.vessel) || str(c.caseId)}`;

  const deadlines: Visuals["deadlines"] = [];
  for (const c of mine) {
    const due = date(c.deadline);
    if (due) {
      deadlines.push({
        label: `${caseName(c)}: quote due`,
        due: iso(due),
        from: iso(new Date(due.getTime() - 5 * DAY)),
        supporting: `${str(c.caseId)} · ${nameOf(c.customer)}`,
        href: link.doc("cases", str(c.id)),
      });
    }
    const eta = date(c.eta);
    if (eta && eta.getTime() > NOW.getTime()) {
      deadlines.push({
        label: `${caseName(c)} arrives`,
        due: iso(eta),
        from: iso(new Date(eta.getTime() - 7 * DAY)),
        supporting: `${str(c.caseId)} · ${str(c.port)}`,
        href: link.doc("cases", str(c.id)),
      });
    }
  }
  deadlines.sort((a, b) => a.due.localeCompare(b.due));

  // This month's calendar: deadlines (amber within two days, red once passed), arrivals, deliveries
  // and invoices falling due (money roles).
  const month = dayOf(NOW).slice(0, 7);
  const calendar: Visuals["calendar"] = [];
  const inMonth = (d?: Date) => !!d && dayOf(d).startsWith(month);
  for (const c of mine) {
    const due = date(c.deadline);
    if (inMonth(due)) {
      const left = (due!.getTime() - NOW.getTime()) / DAY;
      calendar.push({
        date: dayOf(due!),
        label: `Quote due · ${caseName(c)}`,
        href: link.doc("cases", str(c.id)),
        tone: left < 0 ? "error" : left < 2 ? "warning" : "neutral",
      });
    }
    const eta = date(c.eta);
    if (inMonth(eta))
      calendar.push({
        date: dayOf(eta!),
        label: `Arrives · ${caseName(c)}`,
        href: link.doc("cases", str(c.id)),
        tone: "neutral",
      });
  }
  for (const d of data.deliveries) {
    const at = date(d.plannedAt);
    if (inMonth(at))
      calendar.push({
        date: dayOf(at!),
        label: `Delivery ${str(d.number)} · ${str(d.status)}`,
        href: link.doc("deliveries", str(d.id)),
        tone: str(d.status) === "Delivered" ? "success" : "neutral",
      });
  }
  if (money)
    for (const i of data.invoices) {
      const due = date(i.dueDate);
      if (inMonth(due) && str(i.status) !== "Paid")
        calendar.push({
          date: dayOf(due!),
          label: `Invoice ${str(i.number)} due · ${nameOf(i.customer)}`,
          href: link.doc("invoices", str(i.id)),
          tone: due!.getTime() < NOW.getTime() ? "error" : "neutral",
        });
    }
  calendar.sort((a, b) => a.date.localeCompare(b.date));

  const winRate = Math.round((sum(H.won.slice(-12)) / Math.max(1, sum(H.quoted.slice(-12)))) * 100);
  const onTimeWeeks = H.deliveryOutcomes["On time"]!;
  const allWeeks = onTimeWeeks.map((v, i) => v + H.deliveryOutcomes.Partial![i]! + H.deliveryOutcomes.Late![i]!);
  const onTime = Math.round((sum(onTimeWeeks) / Math.max(1, sum(allWeeks))) * 100);
  const targets: Visuals["targets"] = [
    {
      label: "Win rate, 12 weeks",
      value: winRate,
      max: 60,
      target: 30,
      bands: [20, 30],
      valueText: `${winRate}%`,
      targetText: "30%",
    },
    {
      label: "Quote turnaround",
      value: last(H.turnaround),
      max: 4,
      target: 1,
      bands: [1, 2],
      valueText: `${last(H.turnaround)} d`,
      targetText: "1 d",
      lowerIsBetter: true,
    },
    {
      label: "Time to acknowledge",
      value: last(H.ackMinutes),
      max: 60,
      target: 15,
      bands: [15, 30],
      valueText: `${last(H.ackMinutes)} min`,
      targetText: "15 min",
      lowerIsBetter: true,
    },
    {
      label: "Deliveries on time, 6 weeks",
      value: onTime,
      max: 100,
      target: 90,
      bands: [75, 90],
      valueText: `${onTime}%`,
      targetText: "90%",
    },
  ];

  const waits = new Map<string, number>();
  for (const c of live) {
    const w = str(c.wait) || "Nothing — moving";
    waits.set(w, (waits.get(w) ?? 0) + 1);
  }
  const waiting = [...waits].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  const suppliers = data.suppliers
    .filter((s) => typeof s.onTime === "number" && typeof s.replyHrs === "number")
    .map((s) => ({ label: str(s.name), x: num(s.onTime), y: num(s.replyHrs), href: link.doc("suppliers", str(s.id)) }));

  const receivables = money
    ? H.ageingByCustomer.map(([label, buckets]) => ({ label, value: Math.round(sum(buckets) * 10) / 10 }))
    : [];
  // October's gross profit, from what the quotes expected to what the bills made it (illustrative).
  const expected = H.gpExpectedK.at(-2)!;
  const actual = H.gpActualK.at(-2)!;
  const gp = money
    ? [
        // The start is a step (a total adds nothing, so a first total would stand at zero).
        { label: "At quote", value: expected * 1000 },
        { label: "Freight", value: -12_000 },
        { label: "Supplier prices", value: -9_000 },
        { label: "FX", value: -6_000 },
        { label: "Recovered", value: (actual - expected + 27) * 1000 },
        { label: "Actual", value: actual * 1000, total: true },
      ]
    : [];

  return {
    today: dayOf(NOW),
    month,
    deadlines: deadlines.slice(0, 8),
    calendar,
    targets,
    turnaround: last(H.turnaround),
    ack: last(H.ackMinutes),
    waiting,
    suppliers,
    money,
    receivables,
    gp,
  };
}

export const visualsEndpoints: Endpoint[] = [
  {
    path: "/visuals",
    method: "get",
    handler: async (req) => {
      const me = meOf(req);
      if (!me) return unauthorized();
      const [cases, invoices, deliveries, suppliers] = await Promise.all(
        ["cases", "invoices", "deliveries", "suppliers"].map((c) => all(req, c, 1)),
      );
      return Response.json(visuals(str(me.role), str(me.id), { cases, invoices, deliveries, suppliers }));
    },
  },
];
