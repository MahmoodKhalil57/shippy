import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { WAITS } from "../collections/cases.ts";
import { history as H } from "./history.ts";

/**
 * GET /api/home — the signed-in user's dashboard, tailored to their role: what needs them
 * today (what's due next, decisions, briefing, follow-ups, their queue), the four numbers they
 * steer by with how each moved, and the trends behind them. Counts, lists and the agenda come from
 * the live collections; trends and the deltas read from them from ./history.ts. Sales never
 * receives cost or profit figures (as everywhere else).
 *
 * The response is a list of widgets the dashboard lays out in order (dashboard-home); the
 * selection per role is the only place the roles differ.
 */

/** The demo's "now": the morning the scenario is set in (seeded dates are relative to it). */
export const DEMO_NOW = new Date("2026-11-17T09:30:00.000Z");

export type HomeTone = "error" | "warning" | "info" | "success" | "neutral";
/** How a number reads: plain count, days, minutes, thousands of a currency, or a percentage. */
export type HomeUnit = "count" | "days" | "minutes" | "usd-k" | "egp-k" | "pct";

/** How a figure moved against the previous period: the change in words, its direction, and whether that is good news. */
export interface HomeDelta {
  text: string;
  dir: "up" | "down" | "flat";
  good?: boolean;
}
export interface HomeTile {
  label: string;
  value: string;
  note?: string;
  tone?: HomeTone;
  href?: string;
  trend?: { labels: string[]; values: number[]; unit: HomeUnit };
  delta?: HomeDelta;
}
/** Something due, with when: "11:00" today, "Wed" or "Wed 10:00" later this week. */
export interface HomeAgendaItem {
  lead: string;
  title: string;
  sub: string;
  href?: string;
  /** Its time has passed. */
  late: boolean;
}
export interface HomeChart {
  title: string;
  sub: string;
  kind: "bars" | "line";
  unit: HomeUnit;
  labels: string[];
  series: { name: string; values: number[] }[];
  target?: number;
  targetLabel?: string;
  highlightLast?: boolean;
}
export interface HomeItem {
  tone: HomeTone;
  title: string;
  sub: string;
  href?: string;
  badge?: string;
}
export interface HomeCase {
  id: string;
  caseId: string;
  href: string;
  customer: string;
  vessel: string;
  port: string;
  stage: string;
  wait: string;
  tone: HomeTone;
  risk: string;
  deadline: string;
  due: string;
  overdue: boolean;
  next: string;
  blocker: string;
  owner: string;
  urgent: boolean;
  lines?: { ready: number; waiting: number; blocked: number; noOffer: number };
  value?: number;
}

export type HomeWidget =
  | { kind: "tiles"; id: string; tiles: HomeTile[] }
  | { kind: "charts"; id: string; charts: HomeChart[] }
  | {
      kind: "queue";
      id: string;
      title: string;
      sub: string;
      cases: HomeCase[];
      /** Show the value column (never for Sales). */
      value: boolean;
      /** Show the owner column (off for "my" queues). */
      owners: boolean;
      href: string;
    }
  | {
      kind: "lists";
      id: string;
      lists: { title: string; sub?: string; items: HomeItem[]; empty: string; href?: string; hrefLabel?: string }[];
    }
  /** What's due next for this person, soonest first. */
  | { kind: "agenda"; id: string; title: string; sub: string; items: HomeAgendaItem[]; empty: string };

export interface Home {
  role: string;
  eyebrow: string;
  greeting: string;
  subtitle: string;
  actions: { label: string; href: string; primary?: boolean }[];
  widgets: HomeWidget[];
}

const DAY = 86_400_000;
const LIVE_END = ["Closed — settled", "Lost", "Expired"];
const TONE: Record<string, HomeTone> = {
  danger: "error",
  warn: "warning",
  info: "info",
  ok: "success",
  neutral: "neutral",
};
const RISK: Record<string, string> = {
  danger: "Blocked",
  warn: "At risk",
  info: "On track",
  ok: "Done",
  neutral: "Paused",
};
const RANK: Record<HomeTone, number> = { error: 0, warning: 1, info: 2, success: 3, neutral: 4 };

/** A scalar as text (relationships and objects read as nothing). */
const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const path = (...parts: string[]) => `/${parts.join("/")}`;
const idOf = (v: unknown) => (v && typeof v === "object" ? (v as Doc).id : typeof v === "string" ? v : undefined);
const nameOf = (v: unknown) =>
  v && typeof v === "object" ? str((v as Doc).name ?? (v as Doc).id) : typeof v === "string" ? v : "";
const date = (v: unknown) => (typeof v === "string" ? new Date(v) : undefined);
const first = (name: string) => name.split(" ")[0] ?? name;

const fmtDay = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const fmtTime = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/** "today 16:00", "tomorrow", "in 3 days", "2 days overdue". */
const relative = (d: Date) => {
  const days = Math.floor(d.getTime() / DAY) - Math.floor(DEMO_NOW.getTime() / DAY);
  if (days === 0) return d < DEMO_NOW ? `overdue since ${fmtTime(d)}` : `today ${fmtTime(d)}`;
  if (days === 1) return `tomorrow ${fmtTime(d)}`;
  if (days > 1) return `in ${days} days`;
  return `${-days} day${days === -1 ? "" : "s"} overdue`;
};
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** A change with its sign, "+2" or "−0.4" (a real minus sign), and nothing before a zero. */
const signed = (n: number, digits = 0) => {
  const text = Math.abs(n).toFixed(digits);
  return Number(text) === 0 ? text : `${n > 0 ? "+" : "−"}${text}`;
};
/**
 * A figure's move as a delta: the amount in words (with what it's compared to, `than`, when the
 * note under it doesn't say), or that nothing changed. `rising` says what a rise means: good news
 * (`"good"`), bad news (`"bad"`), or neither when left out (a queue that grew is just busier).
 */
const moved = (change: number, amount: string, o: { rising?: "good" | "bad"; than?: string } = {}): HomeDelta => ({
  text: change === 0 ? (o.than ? `same as ${o.than}` : "no change") : o.than ? `${amount} vs ${o.than}` : amount,
  dir: change > 0 ? "up" : change < 0 ? "down" : "flat",
  good: change === 0 || !o.rising ? undefined : change > 0 === (o.rising === "good"),
});

async function all(req: PayloadRequest, collection: string) {
  const r = await req.payload.find({ collection: collection as never, pagination: false, depth: 1 });
  return r.docs as unknown as Doc[];
}

/** The signed-in user's day, by role (or a 401 response). */
export async function homeData(req: PayloadRequest): Promise<Home | Response> {
  {
    const me = req.user as unknown as (Doc & { name?: string; role?: string }) | null;
    if (!me)
      return Response.json({ errors: [{ message: "You are not allowed to perform this action." }] }, { status: 401 });
    const role = str(me.role ?? "");
    const costs = role !== "sales";
    const [cases, approvals, tasks, rfqs, messages, exceptions, invoices, bills, deliveries, opportunities, users] =
      await Promise.all(
        [
          "cases",
          "approvals",
          "tasks",
          "supplier-rfqs",
          "intake-messages",
          "integration-exceptions",
          "invoices",
          "supplier-bills",
          "deliveries",
          "opportunities",
          "users",
        ].map((c) => all(req, c)),
      );
    const userName = (id: unknown) => str(users.find((u) => u.id === idOf(id))?.name ?? nameOf(id));

    /* ---------------------------------------------------------------- cases */
    const live = cases.filter((c) => !LIVE_END.includes(str(c.stage)));
    const row = (c: Doc): HomeCase => {
      const deadline = date(c.deadline) ?? DEMO_NOW;
      const tone = TONE[str(c.tone)] ?? "info";
      const lines = c.lines as HomeCase["lines"] | undefined;
      return {
        id: c.id,
        caseId: str(c.caseId),
        href: path("collections", "cases", c.id),
        customer: nameOf(c.customer),
        vessel: str(c.vessel ?? ""),
        port: str(c.port ?? ""),
        stage: str(c.stage ?? ""),
        wait: str(c.wait ?? ""),
        tone,
        risk: RISK[str(c.tone)] ?? "On track",
        deadline: fmtDay(deadline),
        due: relative(deadline),
        overdue: deadline < DEMO_NOW,
        next: str(c.nextAction ?? ""),
        blocker: str(c.blocker ?? ""),
        owner: userName(c.owner),
        urgent: c.urgent === true,
        lines: lines && lines.ready + lines.waiting + lines.blocked + lines.noOffer > 0 ? lines : undefined,
        value: typeof c.value === "number" ? c.value : undefined,
      };
    };
    const byRisk = (a: HomeCase, b: HomeCase) =>
      RANK[a.tone] - RANK[b.tone] || Number(b.urgent) - Number(a.urgent) || a.deadline.localeCompare(b.deadline);
    const mine = live
      .filter((c) => idOf(c.owner) === me.id)
      .map(row)
      .sort(byRisk);
    const everyone = live.map(row).sort(byRisk);

    /* ---------------------------------------------------------------- approvals */
    // Still open: neither approved nor rejected (a two-person approval with one signature is
    // "Approved 1 of 2": the second approver still has to decide).
    const pending = approvals.filter((a) => !["Approved", "Rejected"].includes(str(a.status ?? "Pending")));
    const decided = (a: Doc, id: string) =>
      ((a.decisions as { user?: unknown }[] | undefined) ?? []).some((d) => idOf(d.user) === id);
    const forMe = pending.filter(
      (a) => ((a.approvers as unknown[] | undefined) ?? []).some((u) => idOf(u) === me.id) && !decided(a, me.id),
    );
    const approvalItem = (a: Doc): HomeItem => {
      const others = ((a.decisions as { user?: unknown; decision?: string }[] | undefined) ?? []).map(
        (d) => `${first(userName(d.user))} ${str(d.decision ?? "").toLowerCase()}d`,
      );
      return {
        tone: /bank|deposit|payment/i.test(str(a.type)) ? "warning" : "info",
        title: str(a.title ?? a.type),
        sub: [a.type, `from ${userName(a.requestedBy)}`, ...others].filter(Boolean).join(" · "),
        href: path("collections", "approvals", a.id),
        badge: a.twoPerson ? "Two-person" : undefined,
      };
    };

    /* ---------------------------------------------------------------- briefing */
    const soon = (d?: Date, days = 1) => !!d && d.getTime() - DEMO_NOW.getTime() < days * DAY;
    const briefing: (HomeItem & { for: string[] })[] = [];
    const desk = ["supply-chain", "management", "sales", "office-admin"];
    for (const c of live) {
      const d = date(c.deadline);
      if (soon(d) && /Comparing|Awaiting|Sourcing|Validating|New|Revision/.test(str(c.stage)))
        briefing.push({
          for: [...desk, idOf(c.owner) === me.id ? role : ""],
          tone: "error",
          title: `${str(c.vessel)} quote ${d! < DEMO_NOW ? "" : "due "}${relative(d!)}`,
          sub: `${str(c.caseId)} · ${str(c.nextAction ?? "")}${c.blocker ? ` · ${str(c.blocker)}` : ""}`,
          href: path("collections", "cases", c.id),
        });
      if (/PO mismatch/.test(str(c.stage)))
        briefing.push({
          for: [...desk, "operations"],
          tone: "error",
          title: `Customer PO mismatch on ${str(c.caseId)}`,
          sub: str(c.blocker || c.nextAction || "Commitment blocked until the PO matches the approved quote."),
          href: path("collections", "cases", c.id),
        });
      const eta = date(c.eta);
      if (soon(eta, 2) && eta! > DEMO_NOW && /Deliver|Purchasing|Won/.test(str(c.stage)))
        briefing.push({
          for: ["supply-chain", "operations", "management"],
          tone: "warning",
          title: `${str(c.vessel)} arrives ${relative(eta!)}`,
          sub: `${str(c.caseId)} · ${str(c.port ?? "")} · ${str(c.nextAction ?? "")}`,
          href: path("collections", "cases", c.id),
        });
    }
    for (const r of rfqs) {
      const due = date(r.dueAt);
      if (r.status === "Awaiting reply" && due && due < DEMO_NOW)
        briefing.push({
          for: ["supply-chain", "management"],
          tone: "warning",
          title: `${nameOf(r.supplier)} hasn't replied`,
          sub: `${str(r.reference)} was due ${relative(due)} · ${str(r.lastEvent ?? "reminder drafted")}`,
          href: path("collections", "supplier-rfqs", r.id),
        });
    }
    if (pending.length && !["management", "finance-director"].includes(role))
      briefing.push({
        for: ["supply-chain", "sales", "operations"],
        tone: "info",
        title: `${pending.length} item${pending.length === 1 ? "" : "s"} awaiting approval`,
        sub: [...new Set(pending.map((a) => str(a.type)))].join(", "),
        href: path("collections", "approvals"),
      });
    /** Invoices with a balance still to collect. */
    const receivable = invoices.filter((i) => ["Open", "Partially paid", "Overdue"].includes(str(i.status)));
    const openExceptions = exceptions.filter((x) => x.status === "Open");
    for (const x of openExceptions)
      briefing.push({
        for: ["operations", "management", "office-admin", "supply-chain"],
        tone: "warning",
        title: `${str(x.source)}: ${str(x.summary)}`,
        sub: `${str(x.impact ?? "")} · safe retry available`,
        href: path("collections", "integration-exceptions", x.id),
      });
    for (const inv of receivable) {
      const due = date(inv.dueDate);
      briefing.push({
        for: ["operations", "finance-director", "management"],
        tone: "info",
        title: `${nameOf(inv.customer)}: ${str(inv.currency) || "USD"} ${Number(inv.balance ?? 0).toLocaleString("en-US")} due ${due ? fmtDay(due) : "—"}`,
        sub: `${str(inv.number)} · ${str(inv.status)}${typeof inv.paid === "number" && inv.paid ? ` · ${Number(inv.paid).toLocaleString("en-US")} received` : ""} · collection reminder drafted`,
        href: path("collections", "invoices", inv.id),
      });
    }
    const newMessages = messages.filter((m) => m.status === "New" || m.status === "Needs review");
    if (newMessages.length)
      briefing.push({
        for: ["supply-chain", "sales", "office-admin"],
        tone: "info",
        title: `${newMessages.length} new message${newMessages.length === 1 ? "" : "s"} in the inbox`,
        sub: newMessages.map((m) => str(m.fromName ?? m.from)).join(", "),
        href: path("collections", "intake-messages"),
      });
    const myBriefing = briefing
      .filter((b) => b.for.includes(role))
      .sort((a, b) => RANK[a.tone] - RANK[b.tone])
      .map((b): HomeItem => ({ tone: b.tone, title: b.title, sub: b.sub, href: b.href }));

    /* ---------------------------------------------------------------- follow-ups */
    const endOfDay = new Date(Math.floor(DEMO_NOW.getTime() / DAY) * DAY + DAY);
    const followUp = (t: Doc): HomeItem => {
      const due = date(t.due);
      return {
        tone: due && due < DEMO_NOW ? "error" : "info",
        title: `${str(t.channel ?? "Task")} · ${str(t.title)}`,
        sub: [t.type, t.stopCondition ? `stops on: ${str(t.stopCondition)}` : ""].filter(Boolean).join(" · "),
        href: path("collections", "tasks", t.id),
        badge: due ? (due < DEMO_NOW ? "Overdue" : fmtTime(due)) : undefined,
      };
    };
    const openTasks = tasks.filter((t) => (t.status ?? "Open") === "Open");
    const todays = (owner?: string) =>
      openTasks
        .filter((t) => (!owner || idOf(t.owner) === owner) && (date(t.due) ?? DEMO_NOW) < endOfDay)
        .map(followUp);

    /* ---------------------------------------------------------------- tiles & charts */
    const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
    const last = <T>(a: T[]) => a[a.length - 1]!;
    /** A series' latest value against the one `back` points earlier. */
    const since = (a: number[], back = 1) => last(a) - a[a.length - 1 - back]!;
    /** The last four points of a weekly series against the four before, in percent. */
    const fourWeeks = (a: number[]) => {
      const now = sum(a.slice(-4));
      const before = sum(a.slice(-8, -4));
      return { now, change: before ? Math.round(((now - before) / before) * 100) : 0 };
    };
    /** Cases in one waiting state: today's count on the weekly trend, against last week. */
    const waitTile = (wait: (typeof WAITS)[number], scope: Doc[], note?: string): HomeTile => {
      const n = scope.filter((c) => c.wait === wait).length;
      const weeks = [...(H.waitTrend[wait] ?? []).slice(0, -1), n];
      const change = since(weeks);
      return {
        label: wait,
        value: str(n),
        note,
        href: path("collections", "cases"),
        trend: { labels: H.weeks, values: weeks, unit: "count" },
        delta: moved(change, signed(change), { than: "last week" }),
      };
    };
    /** Figures several roles steer by. */
    const inquiries4 = fourWeeks(H.inquiries);
    const won4 = fourWeeks(H.won);
    const wonTile: HomeTile = {
      label: "Won, last 4 weeks",
      value: str(won4.now),
      note: "vs prior 4 weeks",
      trend: { labels: H.weeks, values: H.won, unit: "count" },
      delta: moved(won4.change, `${signed(won4.change)}%`, { rising: "good" }),
    };
    const profitChange = Math.round(
      ((last(H.gpExpectedK) - H.gpExpectedK[H.gpExpectedK.length - 2]!) / H.gpExpectedK[H.gpExpectedK.length - 2]!) *
        100,
    );
    const profitTile: HomeTile = {
      label: "Expected gross profit, Nov",
      value: `EGP ${last(H.gpExpectedK)}k`,
      note: `${last(H.gpActualK)}k billed so far`,
      trend: { labels: H.months, values: H.gpExpectedK, unit: "egp-k" },
      delta: moved(profitChange, `${signed(profitChange)}%`, { rising: "good", than: H.months[H.months.length - 2] }),
    };
    const ackTile: HomeTile = {
      label: "Time to acknowledge",
      value: `${last(H.ackMinutes)} min`,
      note: "median, new RFQs",
      trend: { labels: H.weeks, values: H.ackMinutes, unit: "minutes" },
      delta: moved(since(H.ackMinutes, 4), `${signed(since(H.ackMinutes, 4))} min`, {
        rising: "bad",
        than: "4 weeks ago",
      }),
    };
    const pipeline: HomeChart = {
      title: "Inquiries, quotes and wins",
      sub: "RFQ cases per week of receipt, last 12 weeks",
      kind: "line",
      unit: "count",
      labels: H.weeks,
      series: [
        { name: "Inquiries", values: H.inquiries },
        { name: "Quoted", values: H.quoted },
        { name: "Won", values: H.won },
      ],
    };
    const turnaround: HomeChart = {
      title: "Quotation turnaround",
      sub: "Median days from RFQ received to quote sent",
      kind: "line",
      unit: "days",
      labels: H.weeks,
      series: [{ name: "Median days", values: H.turnaround }],
      target: 1,
      targetLabel: "Target 1 d",
    };
    const profit: HomeChart = {
      title: "Gross profit: expected vs actual",
      sub: "EGP thousands · actual replaces estimates as costs are billed (Nov in progress)",
      kind: "line",
      unit: "egp-k",
      labels: H.months,
      series: [
        { name: "Expected", values: H.gpExpectedK },
        { name: "Actual", values: H.gpActualK },
      ],
    };
    const cash: HomeChart = {
      title: "Cash in vs cash out, next 8 weeks",
      sub: "Expected customer receipts and committed supplier payments, EGP thousands",
      kind: "line",
      unit: "egp-k",
      labels: H.cashWeeks,
      series: [
        { name: "Receipts", values: H.receiptsK },
        { name: "Payments", values: H.paymentsK },
      ],
    };
    const ack: HomeChart = {
      title: "Time to acknowledge an RFQ",
      sub: "Median minutes · automatic acknowledgement went live 6 Oct",
      kind: "bars",
      unit: "minutes",
      labels: H.weeks,
      series: [{ name: "Minutes", values: H.ackMinutes }],
      highlightLast: true,
    };
    const afterHours: HomeChart = {
      title: "Out-of-hours requests",
      sub: "RFQs outside Sun–Thu 08:00–17:00, routed to the on-call person",
      kind: "bars",
      unit: "count",
      labels: H.weeks,
      series: [{ name: "RFQs", values: H.afterHours }],
      highlightLast: true,
    };
    const lost: HomeChart = {
      title: "Why we lose",
      sub: "Lost cases by recorded reason, last 90 days",
      kind: "bars",
      unit: "count",
      labels: H.lostReasons.map((r) => r[0]),
      series: [{ name: "Lost cases", values: H.lostReasons.map((r) => r[1]) }],
    };
    // Deadlines on my cases over the next 7 days (quote deadlines and vessel ETAs).
    const week = Array.from({ length: 7 }, (_, i) => new Date(Math.floor(DEMO_NOW.getTime() / DAY) * DAY + i * DAY));
    const myDeadlines: HomeChart = {
      title: "My deadlines, next 7 days",
      sub: "Quote deadlines and vessel arrivals on cases I own",
      kind: "bars",
      unit: "count",
      labels: week.map((d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", timeZone: "UTC" })),
      series: [
        {
          name: "Deadlines",
          values: week.map(
            (d) =>
              live
                .filter((c) => idOf(c.owner) === me.id)
                .flatMap((c) => [date(c.deadline), date(c.eta)])
                .filter((x) => x && Math.floor(x.getTime() / DAY) === Math.floor(d.getTime() / DAY)).length,
          ),
        },
      ],
    };
    const myTurnaround: HomeChart = {
      title: "My quote turnaround",
      sub: "Median days, last 8 weeks",
      kind: "line",
      unit: "days",
      labels: H.weeks.slice(-8),
      series: [{ name: "Median days", values: H.myTurnaround }],
      target: 1,
      targetLabel: "Target 1 d",
    };

    const awaitingReply = rfqs.filter((r) => r.status === "Awaiting reply").length;

    /* ---------------------------------------------------------------- next up */
    // What is due from this morning through the week, with when: follow-ups, supplier replies,
    // quote deadlines, vessel arrivals, planned drops, invoices and bills falling due, pipeline
    // steps. Each role sees its own kinds, and the buyer and Sales only their own cases. The
    // second line is one short fact (a reference, a port, an amount): it shows on one line.
    const today = Math.floor(DEMO_NOW.getTime() / DAY) * DAY;
    const within = (d?: Date): d is Date => !!d && d.getTime() >= today && d.getTime() < today + 7 * DAY;
    /** "11:00" today; "Wed 10:00" later, or "Wed" for a date with no time. */
    const lead = (d: Date) => {
      const timed = d.getTime() % DAY !== 0;
      if (d.getTime() < today + DAY) return timed ? fmtTime(d) : "Today";
      const day = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
      return timed ? `${day} ${fmtTime(d)}` : day;
    };
    const own = (c: Doc) => idOf(c.owner) === me.id;
    const everyones = ["management", "office-admin"].includes(role);
    const due: { at: Date; for: boolean; title: string; sub: string; href: string }[] = [];
    for (const t of openTasks) {
      const at = date(t.due);
      if (within(at))
        due.push({
          at,
          for: own(t) || role === "office-admin",
          title: str(t.title),
          sub: str(t.type ?? t.channel ?? ""),
          href: path("collections", "tasks", t.id),
        });
    }
    for (const r of rfqs) {
      const at = date(r.dueAt);
      if (r.status === "Awaiting reply" && within(at))
        due.push({
          at,
          for: ["supply-chain", "management"].includes(role),
          title: `${nameOf(r.supplier)}: reply due`,
          sub: str(r.reference),
          href: path("collections", "supplier-rfqs", r.id),
        });
    }
    for (const c of live) {
      const deadline = date(c.deadline);
      if (within(deadline) && /Comparing|Awaiting|Sourcing|Validating|New|Revision/.test(str(c.stage)))
        due.push({
          at: deadline,
          for: everyones || (["supply-chain", "sales"].includes(role) && own(c)),
          title: `${str(c.vessel)}: quote due`,
          sub: `${str(c.caseId)} · ${str(c.port ?? "")}`,
          href: path("collections", "cases", c.id),
        });
      const eta = date(c.eta);
      if (within(eta) && /Deliver|Purchasing|Won/.test(str(c.stage)))
        due.push({
          at: eta,
          for: ["supply-chain", "operations", "management"].includes(role),
          title: `${str(c.vessel)} arrives`,
          sub: `${str(c.caseId)} · ${str(c.port ?? "")}`,
          href: path("collections", "cases", c.id),
        });
    }
    for (const d of deliveries) {
      const at = date(d.plannedAt);
      if (d.status === "Planned" && within(at))
        due.push({
          at,
          for: role === "operations",
          title: `Drop ${str(d.number)} leaves`,
          sub: str(d.place ?? ""),
          href: path("collections", "deliveries", d.id),
        });
    }
    for (const inv of receivable) {
      const at = date(inv.dueDate);
      if (within(at))
        due.push({
          at,
          for: ["operations", "finance-director", "management"].includes(role),
          title: `${nameOf(inv.customer)}: invoice due`,
          sub: `${str(inv.currency) || "USD"} ${Number(inv.balance ?? 0).toLocaleString("en-US")}`,
          href: path("collections", "invoices", inv.id),
        });
    }
    for (const b of bills) {
      const at = date(b.dueDate);
      if (b.status !== "Paid" && within(at))
        due.push({
          at,
          for: ["operations", "finance-director"].includes(role),
          title: `${nameOf(b.supplier)}: bill due`,
          sub: str(b.billNumber),
          href: path("collections", "supplier-bills", b.id),
        });
    }
    for (const o of opportunities) {
      const at = date(o.nextStepDue);
      if (within(at) && own(o))
        due.push({
          at,
          for: true,
          title: str(o.nextStep ?? o.name),
          sub: str(o.name),
          href: path("collections", "opportunities", o.id),
        });
    }
    const upcoming = due.filter((d) => d.for).sort((a, b) => a.at.getTime() - b.at.getTime());
    const dueToday = upcoming.filter((d) => d.at.getTime() < today + DAY).length;
    const agenda: HomeWidget = {
      kind: "agenda",
      id: "agenda",
      title: "Next up",
      sub: upcoming.length
        ? [
            dueToday ? `${dueToday} today` : "Nothing due today",
            ...(upcoming.length > dueToday ? [`${upcoming.length - dueToday} later this week`] : []),
          ].join(" · ")
        : "",
      // The next five: what fits a glance (the lists behind it hold the rest).
      items: upcoming.slice(0, 5).map((d) => ({
        lead: lead(d.at),
        title: d.title,
        sub: d.sub,
        href: d.href,
        late: d.at.getTime() % DAY !== 0 && d.at < DEMO_NOW,
      })),
      empty: "Nothing due this week.",
    };

    /* ---------------------------------------------------------------- per role */
    const name = first(str(me.name ?? ""));
    const eyebrow = `My day · ${DEMO_NOW.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`;
    const greeting = `Good morning, ${name}`;
    /** The greeting's subtitle: the day's live numbers, in one line. */
    const numbers = (...parts: string[]) => parts.join(" · ");
    const queue = (title: string, list: HomeCase[], sub: string, value = costs): HomeWidget => ({
      kind: "queue",
      id: "queue",
      title,
      sub,
      cases: value ? list : list.map((c) => ({ ...c, value: undefined })),
      value,
      owners: list !== mine,
      href: path("collections", "cases"),
    });
    const briefingList = {
      title: "Daily briefing",
      sub: "Prepared at 07:00 from your cases, inbox and integrations",
      items: myBriefing,
      empty: "Nothing needs you this morning.",
    };
    const followUps = (owner?: string) => ({
      title: "Today's follow-ups",
      sub: "Reminders stop on reply, decline or case closure",
      items: todays(owner),
      empty: "No follow-ups due today.",
      href: path("collections", "tasks"),
      hrefLabel: "All follow-ups",
    });
    const decisions = {
      title: "Waiting for your decision",
      sub: "Everything is prepared — you approve or return",
      items: forMe.map(approvalItem),
      empty: "No decisions waiting. Nice.",
      href: path("collections", "approvals"),
      hrefLabel: "All approvals",
    };
    const quotesDue = live.filter(
      (c) =>
        soon(date(c.deadline), 2) &&
        date(c.deadline)! >= DEMO_NOW &&
        /Comparing|Awaiting|Sourcing|Validating|New|Revision/.test(str(c.stage)),
    ).length;
    const inProgress = deliveries.filter((d) => !str(d.status).startsWith("Delivered"));
    const myLive = live.filter(own);

    let body: Omit<Home, "role" | "eyebrow" | "greeting">;
    switch (role) {
      case "management":
        body = {
          subtitle: numbers(
            `${plural(forMe.length, "decision")} waiting`,
            `${plural(quotesDue, "quote")} due by tomorrow`,
            plural(live.length, "live case"),
          ),
          actions: [
            { label: "All live cases", href: path("collections", "cases") },
            { label: "Open approvals", href: path("collections", "approvals"), primary: true },
          ],
          widgets: [
            { kind: "lists", id: "decisions", lists: [decisions, briefingList] },
            {
              kind: "tiles",
              id: "kpis",
              tiles: [
                {
                  label: "Inquiries, last 4 weeks",
                  value: str(inquiries4.now),
                  note: "vs prior 4 weeks",
                  trend: { labels: H.weeks, values: H.inquiries, unit: "count" },
                  delta: moved(inquiries4.change, `${signed(inquiries4.change)}%`, { rising: "good" }),
                },
                wonTile,
                {
                  label: "Quote turnaround",
                  value: `${last(H.turnaround)} d`,
                  note: "median · target 1 d",
                  trend: { labels: H.weeks, values: H.turnaround, unit: "days" },
                  delta: moved(since(H.turnaround, 4), `${signed(since(H.turnaround, 4), 1)} d`, {
                    rising: "bad",
                    than: "4 weeks ago",
                  }),
                },
                profitTile,
              ],
            },
            agenda,
            {
              kind: "charts",
              id: "business",
              charts: [
                pipeline,
                {
                  title: "Value won per month",
                  sub: "Customer POs incl. partial awards, USD thousands",
                  kind: "bars",
                  unit: "usd-k",
                  labels: H.months,
                  series: [{ name: "Value won", values: H.wonValueK }],
                  highlightLast: true,
                },
                turnaround,
                profit,
              ],
            },
            queue(
              "All live cases",
              everyone,
              "Sorted by risk, then deadline · every case has an owner and a next action",
            ),
          ],
        };
        break;
      case "finance-director": {
        const pastDue = sum(H.ageing) - H.ageing[0]!;
        const openBills = bills.filter((b) => b.status !== "Paid");
        const receivablesChange = Math.round(
          (since(H.receivablesK) / H.receivablesK[H.receivablesK.length - 2]!) * 100,
        );
        body = {
          subtitle: numbers(
            `${plural(forMe.length, "decision")} waiting`,
            `USD ${pastDue.toFixed(1)}k past due`,
            `${plural(openBills.length, "supplier bill")} open`,
          ),
          actions: [
            { label: "Invoices", href: path("collections", "invoices") },
            { label: "Open approvals", href: path("collections", "approvals"), primary: true },
          ],
          widgets: [
            { kind: "lists", id: "decisions", lists: [decisions, briefingList] },
            {
              kind: "tiles",
              id: "money",
              tiles: [
                {
                  label: "Decisions waiting",
                  value: str(forMe.length),
                  note: forMe.some((a) => a.twoPerson)
                    ? "includes a two-person approval"
                    : "payments, deposits, bank changes",
                  href: path("collections", "approvals"),
                },
                {
                  label: "Receivables",
                  value: `USD ${sum(H.ageing).toFixed(1)}k`,
                  note: `${pastDue.toFixed(1)}k past due`,
                  href: path("collections", "invoices"),
                  trend: { labels: H.weeks, values: H.receivablesK, unit: "usd-k" },
                  delta: moved(receivablesChange, `${signed(receivablesChange)}%`, {
                    rising: "bad",
                    than: "last week",
                  }),
                },
                {
                  label: "Net cash, next 8 weeks",
                  value: `EGP ${sum(H.receiptsK) - sum(H.paymentsK)}k`,
                  note: `in ${sum(H.receiptsK).toLocaleString("en-US")}k · out ${sum(H.paymentsK).toLocaleString("en-US")}k`,
                  trend: {
                    labels: H.cashWeeks,
                    values: H.receiptsK.map((r, i) => r - H.paymentsK[i]!),
                    unit: "egp-k",
                  },
                },
                profitTile,
              ],
            },
            agenda,
            {
              kind: "charts",
              id: "cash",
              charts: [
                cash,
                {
                  title: "Receivables by age",
                  sub: "USD thousands, all customers",
                  kind: "bars",
                  unit: "usd-k",
                  labels: H.ageingKeys,
                  series: [{ name: "Receivables", values: H.ageing }],
                },
                profit,
              ],
            },
            queue("All live cases", everyone, "Sorted by risk, then deadline"),
          ],
        };
        break;
      }
      case "operations": {
        const openBills = bills.filter((b) => b.status !== "Paid");
        const moving = [...H.waitTrend["Awaiting delivery or payment"]!.slice(0, -1), inProgress.length];
        body = {
          subtitle: numbers(
            `${plural(inProgress.length, "delivery", "deliveries")} in progress`,
            `${plural(openBills.length, "bill")} to match`,
            plural(openExceptions.length, "integration exception"),
          ),
          actions: [
            { label: "Supplier bills", href: path("collections", "supplier-bills") },
            { label: "Deliveries", href: path("collections", "deliveries"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "ops",
              tiles: [
                {
                  label: "Deliveries in progress",
                  value: str(inProgress.length),
                  note: inProgress.map((d) => `${str(d.number)} ${str(d.status).toLowerCase()}`).join(" · "),
                  href: path("collections", "deliveries"),
                  trend: { labels: H.weeks, values: moving, unit: "count" },
                  delta: moved(since(moving), signed(since(moving)), { than: "last week" }),
                },
                {
                  label: "Supplier bills to match",
                  value: str(openBills.length),
                  note: "PO · receipt · bill",
                  href: path("collections", "supplier-bills"),
                },
                {
                  label: "Invoices to collect",
                  value: str(receivable.length),
                  note: "e-invoices valid at the tax authority",
                  href: path("collections", "invoices"),
                },
                {
                  label: "Integration exceptions",
                  value: str(openExceptions.length),
                  note: openExceptions.length ? "safe retry available" : "all clear",
                  tone: openExceptions.length ? "warning" : "success",
                  href: path("collections", "integration-exceptions"),
                },
              ],
            },
            agenda,
            { kind: "lists", id: "today", lists: [briefingList, followUps(me.id)] },
            { kind: "charts", id: "flow", charts: [cash, ack] },
            queue("My queue", mine, "Cases I own, sorted by risk, then deadline"),
          ],
        };
        break;
      }
      case "sales": {
        const steps = opportunities.filter((o) => own(o) && within(date(o.nextStepDue)));
        body = {
          subtitle: numbers(
            plural(myLive.length, "live case"),
            `${myLive.filter((c) => c.wait === "Awaiting customer decision").length} awaiting the customer`,
            `${plural(steps.length, "pipeline step")} this week`,
          ),
          actions: [
            { label: "Pipeline", href: path("collections", "opportunities") },
            { label: "New case", href: path("collections", "cases", "create"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "waits",
              tiles: [
                {
                  label: "My live cases",
                  value: str(myLive.length),
                  note: `${mine.filter((c) => c.urgent).length} urgent · ${mine.filter((c) => c.overdue).length} past deadline`,
                  href: path("collections", "cases"),
                },
                waitTile("Awaiting customer decision", myLive),
                waitTile("Awaiting internal approval", myLive),
                wonTile,
              ],
            },
            agenda,
            queue("My queue", mine, "Cases I own, sorted by risk, then deadline", false),
            {
              kind: "lists",
              id: "today",
              lists: [
                briefingList,
                {
                  title: "Pipeline next steps",
                  sub: "Growth CRM · calls, visits and registrations",
                  items: opportunities.filter(own).map((o) => {
                    const stepDue = date(o.nextStepDue);
                    return {
                      tone: stepDue && stepDue < DEMO_NOW ? ("error" as const) : ("info" as const),
                      title: `${str(o.name)} · ${str(o.nextStep ?? "")}`,
                      sub: `${str(o.stage)} · ${str(o.kind ?? "")} · ${str(o.estimatedValue ?? "")}`,
                      href: path("collections", "opportunities", o.id),
                      badge: stepDue ? fmtDay(stepDue) : undefined,
                    };
                  }),
                  empty: "No pipeline steps due.",
                  href: path("collections", "opportunities"),
                  hrefLabel: "Pipeline",
                },
              ],
            },
            { kind: "charts", id: "sales", charts: [pipeline, lost] },
          ],
        };
        break;
      }
      case "office-admin": {
        const outOfHours = since(H.afterHours);
        body = {
          subtitle: numbers(
            `${plural(newMessages.length, "message")} to triage`,
            `${plural(todays().length, "follow-up")} due today`,
            plural(live.length, "live case"),
          ),
          actions: [
            { label: "Follow-ups", href: path("collections", "tasks") },
            { label: "Review inbox", href: path("collections", "intake-messages"), primary: true },
          ],
          widgets: [
            {
              kind: "lists",
              id: "inbox",
              lists: [
                {
                  title: "Inbox to triage",
                  sub: "AI has read each message — check the case, owner and missing details",
                  items: newMessages.map((m) => ({
                    tone: m.status === "Needs review" ? ("warning" as const) : ("info" as const),
                    title: str(m.subject ?? m.from),
                    sub: `${str(m.fromName ?? m.from)} · ${str(m.channel ?? "")} · ${str(m.classification ?? "")}`,
                    href: path("collections", "intake-messages", m.id),
                    badge: str(m.status),
                  })),
                  empty: "Inbox zero.",
                  href: path("collections", "intake-messages"),
                  hrefLabel: "Inbox",
                },
                followUps(),
              ],
            },
            {
              kind: "tiles",
              id: "desk",
              tiles: [
                {
                  label: "Inbox to triage",
                  value: str(newMessages.length),
                  note: `${newMessages.filter((m) => m.status === "Needs review").length} need review`,
                  href: path("collections", "intake-messages"),
                },
                {
                  label: "Follow-ups due today",
                  value: str(todays().length),
                  note: "reminders stop on reply",
                  href: path("collections", "tasks"),
                },
                {
                  label: "Out-of-hours RFQs",
                  value: str(last(H.afterHours)),
                  note: "this week, vs last week",
                  trend: { labels: H.weeks, values: H.afterHours, unit: "count" },
                  delta: moved(outOfHours, signed(outOfHours)),
                },
                ackTile,
              ],
            },
            agenda,
            queue("Desk cases", everyone, "Every live case, its owner and next step", false),
            { kind: "charts", id: "desk", charts: [afterHours, ack] },
          ],
        };
        break;
      }
      default:
        // Supply chain & customer service (and anyone else): the buyer's day.
        body = {
          subtitle: numbers(
            `${plural(mine.length, "case")} in your queue`,
            `${plural(awaitingReply, "supplier reply", "supplier replies")} outstanding`,
            `${plural(todays(me.id).length, "follow-up")} today`,
          ),
          actions: [
            { label: "Review inbox", href: path("collections", "intake-messages") },
            ...(mine[0]
              ? [{ label: `Continue ${mine[0].caseId}`, href: mine[0].href, primary: true }]
              : [{ label: "All cases", href: path("collections", "cases"), primary: true }]),
          ],
          widgets: [
            {
              kind: "tiles",
              id: "waits",
              tiles: [
                {
                  label: "My live cases",
                  value: str(myLive.length),
                  note: `${mine.filter((c) => c.tone === "error" || c.tone === "warning").length} at risk or blocked`,
                  href: path("collections", "cases"),
                },
                waitTile("Awaiting supplier", live, `${plural(awaitingReply, "supplier RFQ")} awaiting reply`),
                waitTile("Awaiting internal approval", live, `${plural(pending.length, "approval")} in the queue`),
                {
                  label: "My quote turnaround",
                  value: `${last(H.myTurnaround)} d`,
                  note: "median · target 1 d",
                  trend: { labels: H.weeks.slice(-8), values: H.myTurnaround, unit: "days" },
                  delta: moved(since(H.myTurnaround), `${signed(since(H.myTurnaround), 1)} d`, {
                    rising: "bad",
                    than: "last week",
                  }),
                },
              ],
            },
            agenda,
            queue(
              "My queue",
              mine,
              "Sorted by risk, then deadline · every case has an owner, deadline and next action",
            ),
            { kind: "lists", id: "today", lists: [briefingList, followUps(me.id)] },
            { kind: "charts", id: "mine", charts: [myDeadlines, myTurnaround] },
          ],
        };
    }
    return { role, eyebrow, greeting, ...body } satisfies Home;
  }
}

export const home: Endpoint = {
  path: "/home",
  method: "get",
  handler: async (req) => {
    const h = await homeData(req);
    return h instanceof Response ? h : Response.json(h);
  },
};
