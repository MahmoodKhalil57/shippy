import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "../../mock/types.ts";
import { WAITS } from "../collections/cases.ts";
import { history as H } from "./history.ts";

/**
 * GET /api/home — the signed-in user's dashboard, tailored to their role: what needs them
 * today (decisions, briefing, follow-ups, their queue), the numbers they steer by, and the
 * trends behind them. Counts and lists come from the live collections; trends from
 * ./history.ts. Sales never receives cost or profit figures (as everywhere else).
 *
 * The response is a list of widgets the dashboard lays out in order (dashboard-home); the
 * selection per role is the only place the roles differ.
 */

/** The demo's "now": the morning the scenario is set in (seeded dates are relative to it). */
export const DEMO_NOW = new Date("2026-11-17T09:30:00.000Z");

export type HomeTone = "error" | "warning" | "info" | "success" | "neutral";
/** How a number reads: plain count, days, minutes, thousands of a currency, or a percentage. */
export type HomeUnit = "count" | "days" | "minutes" | "usd-k" | "egp-k" | "pct";

export interface HomeTile {
  label: string;
  value: string;
  note?: string;
  tone?: HomeTone;
  href?: string;
  trend?: { labels: string[]; values: number[]; unit: HomeUnit };
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
    };

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
const usd = (n: number) => `USD ${Math.round(n).toLocaleString("en-US")}`;

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
    const pending = approvals.filter((a) => str(a.status ?? "Pending") === "Pending");
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
    const waitTiles = (scope: Doc[], note: (w: string, n: number) => string | undefined): HomeTile[] =>
      WAITS.map((w) => {
        const n = scope.filter((c) => c.wait === w).length;
        return {
          label: w,
          value: str(n),
          note: note(w, n),
          href: path("collections", "cases"),
          trend: { labels: H.weeks, values: [...(H.waitTrend[w] ?? []).slice(0, -1), n], unit: "count" },
        };
      });
    const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
    const last = <T>(a: T[]) => a[a.length - 1]!;
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

    /* ---------------------------------------------------------------- per role */
    const name = first(str(me.name ?? ""));
    const eyebrow = `My day · ${DEMO_NOW.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`;
    const greeting = `Good morning, ${name}`;
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
    const live$ = sum(live.map((c) => (typeof c.value === "number" ? c.value : 0)));

    let body: Omit<Home, "role" | "eyebrow" | "greeting">;
    switch (role) {
      case "management":
        body = {
          subtitle: `${forMe.length} decision${forMe.length === 1 ? "" : "s"} waiting for you. Everything below is prepared — you approve or return.`,
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
                  label: "Inquiries (12 wk)",
                  value: str(sum(H.inquiries)),
                  note: "+21% vs previous 12 wk",
                  trend: { labels: H.weeks, values: H.inquiries, unit: "count" },
                },
                {
                  label: "Quoted",
                  value: str(sum(H.quoted)),
                  note: `${Math.round((sum(H.quoted) / sum(H.inquiries)) * 100)}% of inquiries`,
                  trend: { labels: H.weeks, values: H.quoted, unit: "count" },
                },
                {
                  label: "Won",
                  value: str(sum(H.won)),
                  note: `${live.length} cases live · ${usd(live$)} open`,
                  trend: { labels: H.weeks, values: H.won, unit: "count" },
                },
                {
                  label: "Quote turnaround",
                  value: `${last(H.turnaround)} d`,
                  note: `was ${H.turnaround[0]} d · target ≤ 1 d`,
                  tone: "warning",
                  trend: { labels: H.weeks, values: H.turnaround, unit: "days" },
                },
                {
                  label: "Manual touches / RFQ",
                  value: str(last(H.touches)),
                  note: `was ${H.touches[0]} before go-live`,
                  tone: "success",
                  trend: { labels: H.weeks, values: H.touches, unit: "count" },
                },
                {
                  label: "Gross profit Nov",
                  value: `EGP ${last(H.gpExpectedK)}k`,
                  note: `expected · EGP ${last(H.gpActualK)}k billed so far`,
                  trend: { labels: H.months, values: H.gpExpectedK, unit: "egp-k" },
                },
              ],
            },
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
      case "finance-director":
        body = {
          subtitle: "Payments, deposits and bank changes wait for you here. Nothing is paid without your approval.",
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
                  note: forMe.some((a) => a.twoPerson) ? "includes a two-person approval" : undefined,
                  tone: forMe.length ? "warning" : "success",
                  href: path("collections", "approvals"),
                },
                {
                  label: "Receivables",
                  value: `USD ${sum(H.ageing).toFixed(1)}k`,
                  note: `USD ${(sum(H.ageing) - H.ageing[0]!).toFixed(1)}k past due · ${H.ageing[3]}k over 60 days`,
                  tone: "warning",
                  href: path("collections", "invoices"),
                },
                {
                  label: "Supplier bills open",
                  value: str(bills.length),
                  note: bills[0] ? `next due ${fmtDay(date(bills[0].dueDate) ?? DEMO_NOW)}` : undefined,
                  href: path("collections", "supplier-bills"),
                },
                {
                  label: "Net cash, next 8 weeks",
                  value: `EGP ${sum(H.receiptsK) - sum(H.paymentsK)}k`,
                  note: `in ${sum(H.receiptsK)}k · out ${sum(H.paymentsK)}k`,
                  trend: {
                    labels: H.cashWeeks,
                    values: H.receiptsK.map((r, i) => r - H.paymentsK[i]!),
                    unit: "egp-k",
                  },
                },
              ],
            },
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
      case "operations":
        body = {
          subtitle: "Deliveries, receipts, bills and integrations: what moves today, and what's stuck.",
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
                  value: str(deliveries.filter((d) => d.status !== "Delivered").length),
                  note: deliveries
                    .filter((d) => d.status !== "Delivered")
                    .map((d) => `${str(d.number)} ${str(d.status).toLowerCase()}`)
                    .join(" · "),
                  href: path("collections", "deliveries"),
                },
                {
                  label: "Supplier bills to match",
                  value: str(bills.length),
                  note: "three-way match: PO · receipt · bill",
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
                {
                  label: "Awaiting delivery or payment",
                  value: str(live.filter((c) => c.wait === "Awaiting delivery or payment").length),
                  href: path("collections", "cases"),
                  trend: {
                    labels: H.weeks,
                    values: H.waitTrend["Awaiting delivery or payment"]!,
                    unit: "count",
                  },
                },
              ],
            },
            { kind: "lists", id: "today", lists: [briefingList, followUps(me.id)] },
            { kind: "charts", id: "flow", charts: [cash, ack] },
            queue("My queue", mine, "Cases I own, sorted by risk, then deadline"),
          ],
        };
        break;
      case "sales":
        body = {
          subtitle:
            "Your customers' decisions, your pipeline and your next steps. Costs and margins stay with purchasing.",
          actions: [
            { label: "Pipeline", href: path("collections", "opportunities") },
            { label: "New case", href: path("collections", "cases", "create"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "waits",
              tiles: waitTiles(
                live.filter((c) => idOf(c.owner) === me.id),
                () => undefined,
              ),
            },
            queue("My queue", mine, "Cases I own, sorted by risk, then deadline", false),
            {
              kind: "lists",
              id: "today",
              lists: [
                briefingList,
                {
                  title: "Pipeline next steps",
                  sub: "Growth CRM · calls, visits and registrations",
                  items: opportunities
                    .filter((o) => idOf(o.owner) === me.id)
                    .map((o) => {
                      const due = date(o.nextStepDue);
                      return {
                        tone: due && due < DEMO_NOW ? ("error" as const) : ("info" as const),
                        title: `${str(o.name)} · ${str(o.nextStep ?? "")}`,
                        sub: `${str(o.stage)} · ${str(o.kind ?? "")} · ${str(o.estimatedValue ?? "")}`,
                        href: path("collections", "opportunities", o.id),
                        badge: due ? fmtDay(due) : undefined,
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
      case "office-admin":
        body = {
          subtitle: "New messages to file, follow-ups to send, and the desk's cases at a glance.",
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
            { kind: "tiles", id: "waits", tiles: waitTiles(live, () => undefined) },
            queue("Desk cases", everyone, "Every live case, its owner and next step", false),
            { kind: "charts", id: "desk", charts: [afterHours, ack] },
          ],
        };
        break;
      default:
        // Supply chain & customer service (and anyone else): the buyer's day.
        body = {
          subtitle: "Your prioritised queue. The system has prepared the drafts — you check, decide and send.",
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
              tiles: waitTiles(live, (w, n) =>
                w === "Awaiting internal approval" && n
                  ? `${pending.length} approval${pending.length === 1 ? "" : "s"} in the queue`
                  : w === "Awaiting supplier"
                    ? `${awaitingReply} supplier RFQ${awaitingReply === 1 ? "" : "s"} awaiting reply`
                    : undefined,
              ),
            },
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
