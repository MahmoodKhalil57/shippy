import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { WAITS, relativeDue } from "../collections/cases.ts";
import { TODAY } from "../collections/shared.ts";
import { m } from "../i18n/paraglide/messages.js";
import { history as H, historyLabel } from "./history.ts";
import { intlLocale, langOf, optionLabel } from "./insights-shared.ts";

/**
 * GET /api/home — what the signed-in user's home needs that spans several collections, tailored
 * to their role: the greeting with the day's live numbers, the figures they steer by that carry a
 * trend and how it moved (./history.ts), what's due next across tasks, supplier replies, cases,
 * deliveries, invoices, bills and the pipeline, the 07:00 briefing, and the trend charts. Sales
 * never receives cost or profit figures (as everywhere else).
 *
 * What is one collection's documents is not here: the role's case queue, its follow-ups, the
 * decisions waiting, the inbox to triage, the pipeline's next steps and the plain counts are data
 * widgets on the home page (../pages/home.ts), reading the collections themselves.
 */

/** The demo's "now": the morning the scenario is set in (seeded dates are relative to it). */
/** The demo's clock (../collections/shared.ts): what today and overdue count from. */
export const DEMO_NOW = TODAY;

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
  /** The figure the strip leads with (drawn tinted). */
  main?: boolean;
  /** Its tile: the same in every language (its English words); `label` is its words in the request's. */
  key: string;
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
}
export type HomeWidget =
  | { kind: "tiles"; id: string; tiles: HomeTile[] }
  | { kind: "charts"; id: string; charts: HomeChart[] }
  /** The 07:00 briefing: what needs this role this morning, across cases, inbox and integrations. */
  | { kind: "briefing"; id: string; title: string; sub: string; items: HomeItem[]; empty: string }
  /** What's due next for this person, soonest first. */
  | { kind: "agenda"; id: string; title: string; sub: string; items: HomeAgendaItem[]; empty: string };

export interface Home {
  role: string;
  eyebrow: string;
  greeting: string;
  subtitle: string;
  actions: { label: string; href: string; primary?: boolean }[];
  /**
   * The role's day, only what it sees: its figures that carry a trend (the rest of its strip are
   * the home page's counts), what's next, its briefing, and its charts in the order the home page
   * lays them out (the main chart first, then the compact one, then the rest).
   */
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
const RANK: Record<HomeTone, number> = { error: 0, warning: 1, info: 2, success: 3, neutral: 4 };

/** A scalar as text (relationships and objects read as nothing). */
const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const path = (...parts: string[]) => `/${parts.join("/")}`;
const idOf = (v: unknown) => (v && typeof v === "object" ? (v as Doc).id : typeof v === "string" ? v : undefined);
const nameOf = (v: unknown) =>
  v && typeof v === "object" ? str((v as Doc).name ?? (v as Doc).id) : typeof v === "string" ? v : "";
const date = (v: unknown) => (typeof v === "string" ? new Date(v) : undefined);
const first = (name: string) => name.split(" ")[0] ?? name;

type Lang = "en" | "ar";
const fmtDay = (d: Date, lang: Lang) =>
  d.toLocaleDateString(intlLocale(lang), { day: "numeric", month: "short", timeZone: "UTC" });
const fmtTime = (d: Date, lang: Lang) =>
  d.toLocaleTimeString(intlLocale(lang), { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/** "today 16:00", "tomorrow 09:00", "in 3 days", "2 days overdue": as a case's `due` reads. */
const relative = (d: Date, req: PayloadRequest) => relativeDue(d.toISOString(), req);

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
const moved = (
  lang: Lang,
  change: number,
  amount: string,
  o: { rising?: "good" | "bad"; than?: string } = {},
): HomeDelta => ({
  text:
    change === 0
      ? o.than
        ? m.api_home_same_as({ than: o.than }, { locale: lang })
        : m.api_home_no_change({}, { locale: lang })
      : o.than
        ? m.api_home_amount_vs({ amount, than: o.than }, { locale: lang })
        : amount,
  dir: change > 0 ? "up" : change < 0 ? "down" : "flat",
  good: change === 0 || !o.rising ? undefined : change > 0 === (o.rising === "good"),
});

async function all(req: PayloadRequest, collection: string) {
  const r = await req.payload.find({
    locale: req.locale,
    collection: collection as never,
    pagination: false,
    depth: 1,
  });
  return r.docs as unknown as Doc[];
}

/** The signed-in user's day, by role (or a 401 response). */
export async function homeData(req: PayloadRequest): Promise<Home | Response> {
  {
    const me = req.user as unknown as (Doc & { name?: string; role?: string }) | null;
    const lang = langOf(req);
    const o = { locale: lang };
    if (!me) return Response.json({ errors: [{ message: m.api_insights_shared_not_allowed({}, o) }] }, { status: 401 });
    /** History labels, option labels and number formats in the request's language. */
    const t = (label: string) => historyLabel(label, lang);
    const ts = (labels: string[]) => labels.map(t);
    const opt = (collection: string, field: string, value: unknown) => optionLabel(req, collection, field, value);
    const int = (n: number) => n.toLocaleString(intlLocale(lang, "en-US"));
    const lastWeek = m.api_home_last_week({}, o);
    const fourWeeksAgo = m.api_home_4_weeks_ago({}, o);
    const role = str(me.role ?? "");
    const [cases, approvals, tasks, rfqs, messages, exceptions, invoices, bills, deliveries, opportunities] =
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
        ].map((c) => all(req, c)),
      );

    /* ---------------------------------------------------------------- cases */
    const live = cases.filter((c) => !LIVE_END.includes(str(c.stage)));
    const toneOf = (c: Doc) => TONE[str(c.tone)] ?? "info";
    // The user's own live cases in their queue's order (worst risk, urgent, soonest deadline): the
    // first is the one to continue.
    const mine = live
      .filter((c) => idOf(c.owner) === me.id)
      .sort(
        (a, b) =>
          RANK[toneOf(a)] - RANK[toneOf(b)] ||
          Number(b.urgent === true) - Number(a.urgent === true) ||
          str(a.deadline).localeCompare(str(b.deadline)),
      );

    /* ---------------------------------------------------------------- approvals */
    // Still open: neither approved nor rejected (a two-person approval with one signature is
    // "Approved 1 of 2": the second approver still has to decide).
    const pending = approvals.filter((a) => !["Approved", "Rejected"].includes(str(a.status ?? "Pending")));
    const decided = (a: Doc, id: string) =>
      ((a.decisions as { user?: unknown }[] | undefined) ?? []).some((d) => idOf(d.user) === id);
    const forMe = pending.filter(
      (a) => ((a.approvers as unknown[] | undefined) ?? []).some((u) => idOf(u) === me.id) && !decided(a, me.id),
    );

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
          title:
            d! < DEMO_NOW
              ? m.api_home_quote_late({ vessel: str(c.vessel), when: relative(d!, req) }, o)
              : m.api_home_quote_due_when({ vessel: str(c.vessel), when: relative(d!, req) }, o),
          sub: `${str(c.caseId)} · ${str(c.nextAction ?? "")}${c.blocker ? ` · ${str(c.blocker)}` : ""}`,
          href: path("collections", "cases", c.id),
        });
      if (/PO mismatch/.test(str(c.stage)))
        briefing.push({
          for: [...desk, "operations"],
          tone: "error",
          title: m.api_home_po_mismatch({ caseId: str(c.caseId) }, o),
          sub: str(c.blocker || c.nextAction || m.api_home_commitment_blocked({}, o)),
          href: path("collections", "cases", c.id),
        });
      const eta = date(c.eta);
      if (soon(eta, 2) && eta! > DEMO_NOW && /Deliver|Purchasing|Won/.test(str(c.stage)))
        briefing.push({
          for: ["supply-chain", "operations", "management"],
          tone: "warning",
          title: m.api_home_arrives_when({ vessel: str(c.vessel), when: relative(eta!, req) }, o),
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
          title: m.api_home_supplier_silent({ supplier: nameOf(r.supplier) }, o),
          sub: m.api_home_was_due(
            {
              reference: str(r.reference),
              when: relative(due, req),
              last: str(r.lastEvent ?? m.api_home_reminder_drafted({}, o)),
            },
            o,
          ),
          href: path("collections", "supplier-rfqs", r.id),
        });
    }
    if (pending.length && !["management", "finance-director"].includes(role))
      briefing.push({
        for: ["supply-chain", "sales", "operations"],
        tone: "info",
        title: m.api_home_items_awaiting_approval({ count: pending.length }, o),
        sub: [...new Set(pending.map((a) => opt("approvals", "type", a.type)))].join(lang === "ar" ? "، " : ", "),
        href: path("collections", "approvals"),
      });
    /** Invoices with a balance still to collect. */
    const receivable = invoices.filter((i) => ["Open", "Partially paid", "Overdue"].includes(str(i.status)));
    const openExceptions = exceptions.filter((x) => x.status === "Open");
    for (const x of openExceptions)
      briefing.push({
        for: ["operations", "management", "office-admin", "supply-chain"],
        tone: "warning",
        title: `${opt("integration-exceptions", "source", x.source)}: ${str(x.summary)}`,
        sub: m.api_home_safe_retry({ impact: str(x.impact ?? "") }, o),
        href: path("collections", "integration-exceptions", x.id),
      });
    for (const inv of receivable) {
      const due = date(inv.dueDate);
      briefing.push({
        for: ["operations", "finance-director", "management"],
        tone: "info",
        title: m.api_home_invoice_due(
          {
            customer: nameOf(inv.customer),
            amount: `${str(inv.currency) || "USD"} ${int(Number(inv.balance ?? 0))}`,
            day: due ? fmtDay(due, lang) : "—",
          },
          o,
        ),
        sub:
          typeof inv.paid === "number" && inv.paid
            ? m.api_home_invoice_sub_paid(
                { number: str(inv.number), status: opt("invoices", "status", inv.status), paid: int(Number(inv.paid)) },
                o,
              )
            : m.api_home_invoice_sub({ number: str(inv.number), status: opt("invoices", "status", inv.status) }, o),
        href: path("collections", "invoices", inv.id),
      });
    }
    const newMessages = messages.filter((m) => m.status === "New" || m.status === "Needs review");
    if (newMessages.length)
      briefing.push({
        for: ["supply-chain", "sales", "office-admin"],
        tone: "info",
        title: m.api_home_new_messages({ count: newMessages.length }, o),
        sub: newMessages.map((m) => str(m.fromName ?? m.from)).join(", "),
        href: path("collections", "intake-messages"),
      });
    const myBriefing = briefing
      .filter((b) => b.for.includes(role))
      .sort((a, b) => RANK[a.tone] - RANK[b.tone])
      .map((b): HomeItem => ({ tone: b.tone, title: b.title, sub: b.sub, href: b.href }));

    /* ---------------------------------------------------------------- follow-ups */
    const endOfDay = new Date(Math.floor(DEMO_NOW.getTime() / DAY) * DAY + DAY);
    const openTasks = tasks.filter((t) => (t.status ?? "Open") === "Open");
    /** How many follow-ups are due by tonight (someone's, or everyone's). */
    const todays = (owner?: string) =>
      openTasks.filter((t) => (!owner || idOf(t.owner) === owner) && (date(t.due) ?? DEMO_NOW) < endOfDay).length;

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
        key: wait,
        label: t(wait),
        value: str(n),
        note,
        href: path("collections", "cases"),
        trend: { labels: ts(H.weeks), values: weeks, unit: "count" },
        delta: moved(lang, change, signed(change), { than: lastWeek }),
      };
    };
    /** Figures several roles steer by. */
    const inquiries4 = fourWeeks(H.inquiries);
    const won4 = fourWeeks(H.won);
    const wonTile: HomeTile = {
      key: m.api_home_won_4_weeks({}, { locale: "en" }),
      label: m.api_home_won_4_weeks({}, o),
      value: str(won4.now),
      note: m.api_home_vs_prior_4_weeks({}, o),
      trend: { labels: ts(H.weeks), values: H.won, unit: "count" },
      delta: moved(lang, won4.change, `${signed(won4.change)}%`, { rising: "good" }),
    };
    const profitChange = Math.round(
      ((last(H.gpExpectedK) - H.gpExpectedK[H.gpExpectedK.length - 2]!) / H.gpExpectedK[H.gpExpectedK.length - 2]!) *
        100,
    );
    const profitTile: HomeTile = {
      key: m.api_home_expected_gp_nov({}, { locale: "en" }),
      label: m.api_home_expected_gp_nov({}, o),
      value: m.api_home_thousands({ currency: "EGP", n: last(H.gpExpectedK) }, o),
      note: m.api_home_billed_so_far({ n: last(H.gpActualK) }, o),
      trend: { labels: ts(H.months), values: H.gpExpectedK, unit: "egp-k" },
      delta: moved(lang, profitChange, `${signed(profitChange)}%`, {
        rising: "good",
        than: t(H.months[H.months.length - 2]!),
      }),
    };
    const ackTile: HomeTile = {
      key: m.api_home_time_to_acknowledge({}, { locale: "en" }),
      label: m.api_home_time_to_acknowledge({}, o),
      value: m.api_home_minutes({ n: last(H.ackMinutes) }, o),
      note: m.api_home_median_new_rfqs({}, o),
      trend: { labels: ts(H.weeks), values: H.ackMinutes, unit: "minutes" },
      delta: moved(lang, since(H.ackMinutes, 4), m.api_home_minutes({ n: signed(since(H.ackMinutes, 4)) }, o), {
        rising: "bad",
        than: fourWeeksAgo,
      }),
    };
    const pipeline: HomeChart = {
      title: m.api_home_pipeline_title({}, o),
      sub: m.api_home_pipeline_sub({}, o),
      kind: "line",
      unit: "count",
      labels: ts(H.weeks),
      series: [
        { name: m.api_home_inquiries({}, o), values: H.inquiries },
        { name: m.api_home_quoted({}, o), values: H.quoted },
        { name: m.api_home_won({}, o), values: H.won },
      ],
    };
    const turnaround: HomeChart = {
      title: m.api_home_turnaround_title({}, o),
      sub: m.api_home_turnaround_sub({}, o),
      kind: "line",
      unit: "days",
      labels: ts(H.weeks),
      series: [{ name: m.api_home_median_days({}, o), values: H.turnaround }],
      target: 1,
      targetLabel: m.api_home_target_1_day({}, o),
    };
    const profit: HomeChart = {
      title: m.api_home_gp_title({}, o),
      sub: m.api_home_gp_sub({}, o),
      kind: "line",
      unit: "egp-k",
      labels: ts(H.months),
      series: [
        { name: m.api_home_expected({}, o), values: H.gpExpectedK },
        { name: m.api_home_actual({}, o), values: H.gpActualK },
      ],
    };
    const cash: HomeChart = {
      title: m.api_home_cash_title({}, o),
      sub: m.api_home_cash_sub({}, o),
      kind: "line",
      unit: "egp-k",
      labels: ts(H.cashWeeks),
      series: [
        { name: m.api_home_receipts({}, o), values: H.receiptsK },
        { name: m.api_home_payments({}, o), values: H.paymentsK },
      ],
    };
    const ack: HomeChart = {
      title: m.api_home_ack_title({}, o),
      sub: m.api_home_ack_sub({}, o),
      kind: "bars",
      unit: "minutes",
      labels: ts(H.weeks),
      series: [{ name: m.api_home_minutes_series({}, o), values: H.ackMinutes }],
      highlightLast: true,
    };
    const afterHours: HomeChart = {
      title: m.api_home_after_hours_title({}, o),
      sub: m.api_home_after_hours_sub({}, o),
      kind: "bars",
      unit: "count",
      labels: ts(H.weeks),
      series: [{ name: m.api_home_rfqs({}, o), values: H.afterHours }],
      highlightLast: true,
    };
    const lost: HomeChart = {
      title: m.api_home_lost_title({}, o),
      sub: m.api_home_lost_sub({}, o),
      kind: "bars",
      unit: "count",
      labels: H.lostReasons.map((r) => t(r[0])),
      series: [{ name: m.api_home_lost_cases({}, o), values: H.lostReasons.map((r) => r[1]) }],
    };
    const myTurnaround: HomeChart = {
      title: m.api_home_my_turnaround({}, o),
      sub: m.api_home_my_turnaround_sub({}, o),
      kind: "line",
      unit: "days",
      labels: ts(H.weeks.slice(-8)),
      series: [{ name: m.api_home_median_days({}, o), values: H.myTurnaround }],
      target: 1,
      targetLabel: m.api_home_target_1_day({}, o),
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
      if (d.getTime() < today + DAY) return timed ? fmtTime(d, lang) : m.api_home_today({}, o);
      const day = d.toLocaleDateString(intlLocale(lang), { weekday: "short", timeZone: "UTC" });
      return timed ? `${day} ${fmtTime(d, lang)}` : day;
    };
    const own = (c: Doc) => idOf(c.owner) === me.id;
    const everyones = ["management", "office-admin"].includes(role);
    const due: { at: Date; for: boolean; title: string; sub: string; href: string }[] = [];
    for (const k of openTasks) {
      const at = date(k.due);
      if (within(at))
        due.push({
          at,
          for: own(k) || role === "office-admin",
          title: str(k.title),
          sub: k.type ? opt("tasks", "type", k.type) : opt("tasks", "channel", k.channel ?? ""),
          href: path("collections", "tasks", k.id),
        });
    }
    for (const r of rfqs) {
      const at = date(r.dueAt);
      if (r.status === "Awaiting reply" && within(at))
        due.push({
          at,
          for: ["supply-chain", "management"].includes(role),
          title: m.api_home_reply_due({ supplier: nameOf(r.supplier) }, o),
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
          title: m.api_home_quote_due({ vessel: str(c.vessel) }, o),
          sub: `${str(c.caseId)} · ${str(c.port ?? "")}`,
          href: path("collections", "cases", c.id),
        });
      const eta = date(c.eta);
      if (within(eta) && /Deliver|Purchasing|Won/.test(str(c.stage)))
        due.push({
          at: eta,
          for: ["supply-chain", "operations", "management"].includes(role),
          title: m.api_home_arrives({ vessel: str(c.vessel) }, o),
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
          title: m.api_home_drop_leaves({ number: str(d.number) }, o),
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
          title: m.api_home_invoice_due_short({ customer: nameOf(inv.customer) }, o),
          sub: `${str(inv.currency) || "USD"} ${int(Number(inv.balance ?? 0))}`,
          href: path("collections", "invoices", inv.id),
        });
    }
    for (const b of bills) {
      const at = date(b.dueDate);
      if (b.status !== "Paid" && within(at))
        due.push({
          at,
          for: ["operations", "finance-director"].includes(role),
          title: m.api_home_bill_due({ supplier: nameOf(b.supplier) }, o),
          sub: str(b.billNumber),
          href: path("collections", "supplier-bills", b.id),
        });
    }
    for (const p of opportunities) {
      const at = date(p.nextStepDue);
      if (within(at) && own(p))
        due.push({
          at,
          for: true,
          title: str(p.nextStep ?? p.name),
          sub: str(p.name),
          href: path("collections", "opportunities", p.id),
        });
    }
    const upcoming = due.filter((d) => d.for).sort((a, b) => a.at.getTime() - b.at.getTime());
    const dueToday = upcoming.filter((d) => d.at.getTime() < today + DAY).length;
    const agenda: HomeWidget = {
      kind: "agenda",
      id: "agenda",
      title: m.api_home_next_up({}, o),
      sub: upcoming.length
        ? [
            dueToday ? m.api_home_n_today({ n: dueToday }, o) : m.api_home_nothing_due_today({}, o),
            ...(upcoming.length > dueToday ? [m.api_home_later_this_week({ n: upcoming.length - dueToday }, o)] : []),
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
      empty: m.api_home_nothing_due_week({}, o),
    };

    /* ---------------------------------------------------------------- per role */
    const name = first(str(me.name ?? ""));
    const eyebrow = m.api_home_my_day(
      {
        date: DEMO_NOW.toLocaleDateString(intlLocale(lang), {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
      },
      o,
    );
    const greeting = m.api_home_good_morning({ name }, o);
    /** The greeting's subtitle: the day's live numbers, in one line. */
    const numbers = (...parts: string[]) => parts.join(" · ");
    const briefingList: HomeWidget = {
      kind: "briefing",
      id: "briefing",
      title: m.api_home_daily_briefing({}, o),
      sub: m.api_home_briefing_sub({}, o),
      items: myBriefing,
      empty: m.api_home_nothing_needs_you({}, o),
    };
    const quotesDue = live.filter(
      (c) =>
        soon(date(c.deadline), 2) &&
        date(c.deadline)! >= DEMO_NOW &&
        /Comparing|Awaiting|Sourcing|Validating|New|Revision/.test(str(c.stage)),
    ).length;
    const inProgress = deliveries.filter((d) => !str(d.status).startsWith("Delivered"));
    const myLive = live.filter(own);

    // Each role's figures here are the ones with a trend; its plain counts (decisions waiting, my
    // live cases, bills, invoices, exceptions, the inbox, today's follow-ups) are the home page's
    // `metrics`, which complete the strip of four.
    let body: Omit<Home, "role" | "eyebrow" | "greeting">;
    switch (role) {
      case "management":
        body = {
          subtitle: numbers(
            m.api_home_decisions_waiting({ n: forMe.length }, o),
            m.api_home_quotes_due_tomorrow({ n: quotesDue }, o),
            m.api_home_live_cases({ n: live.length }, o),
          ),
          actions: [
            { label: m.api_home_all_live_cases({}, o), href: path("collections", "cases") },
            { label: m.api_home_open_approvals({}, o), href: path("collections", "approvals"), primary: true },
          ],
          widgets: [
            briefingList,
            {
              kind: "tiles",
              id: "kpis",
              tiles: [
                {
                  main: true,
                  key: m.api_home_inquiries_4_weeks({}, { locale: "en" }),
                  label: m.api_home_inquiries_4_weeks({}, o),
                  value: str(inquiries4.now),
                  note: m.api_home_vs_prior_4_weeks({}, o),
                  trend: { labels: ts(H.weeks), values: H.inquiries, unit: "count" },
                  delta: moved(lang, inquiries4.change, `${signed(inquiries4.change)}%`, { rising: "good" }),
                },
                wonTile,
                {
                  key: m.api_home_quote_turnaround({}, { locale: "en" }),
                  label: m.api_home_quote_turnaround({}, o),
                  value: m.api_home_days({ n: last(H.turnaround) }, o),
                  note: m.api_home_median_target({}, o),
                  trend: { labels: ts(H.weeks), values: H.turnaround, unit: "days" },
                  delta: moved(
                    lang,
                    since(H.turnaround, 4),
                    m.api_home_days({ n: signed(since(H.turnaround, 4), 1) }, o),
                    {
                      rising: "bad",
                      than: fourWeeksAgo,
                    },
                  ),
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
                  title: m.api_home_value_won_title({}, o),
                  sub: m.api_home_value_won_sub({}, o),
                  kind: "bars",
                  unit: "usd-k",
                  labels: ts(H.months),
                  series: [{ name: m.api_home_value_won({}, o), values: H.wonValueK }],
                  highlightLast: true,
                },
                turnaround,
                profit,
              ],
            },
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
            m.api_home_decisions_waiting({ n: forMe.length }, o),
            m.api_home_usd_past_due({ n: pastDue.toFixed(1) }, o),
            m.api_home_supplier_bills_open({ n: openBills.length }, o),
          ),
          actions: [
            { label: m.api_home_invoices({}, o), href: path("collections", "invoices") },
            { label: m.api_home_open_approvals({}, o), href: path("collections", "approvals"), primary: true },
          ],
          widgets: [
            briefingList,
            {
              kind: "tiles",
              id: "money",
              tiles: [
                {
                  key: m.api_home_receivables({}, { locale: "en" }),
                  label: m.api_home_receivables({}, o),
                  value: m.api_home_thousands({ currency: "USD", n: sum(H.ageing).toFixed(1) }, o),
                  note: m.api_home_k_past_due({ n: pastDue.toFixed(1) }, o),
                  href: path("collections", "invoices"),
                  trend: { labels: ts(H.weeks), values: H.receivablesK, unit: "usd-k" },
                  delta: moved(lang, receivablesChange, `${signed(receivablesChange)}%`, {
                    rising: "bad",
                    than: lastWeek,
                  }),
                },
                {
                  key: m.api_home_net_cash({}, { locale: "en" }),
                  label: m.api_home_net_cash({}, o),
                  value: m.api_home_thousands({ currency: "EGP", n: sum(H.receiptsK) - sum(H.paymentsK) }, o),
                  note: m.api_home_in_out({ in: int(sum(H.receiptsK)), out: int(sum(H.paymentsK)) }, o),
                  trend: {
                    labels: ts(H.cashWeeks),
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
                  title: m.api_home_receivables_by_age({}, o),
                  sub: m.api_home_usd_thousands_all({}, o),
                  kind: "bars",
                  unit: "usd-k",
                  labels: ts(H.ageingKeys),
                  series: [{ name: m.api_home_receivables({}, o), values: H.ageing }],
                },
                profit,
              ],
            },
          ],
        };
        break;
      }
      case "operations": {
        const openBills = bills.filter((b) => b.status !== "Paid");
        const moving = [...H.waitTrend["Awaiting delivery or payment"]!.slice(0, -1), inProgress.length];
        body = {
          subtitle: numbers(
            m.api_home_deliveries_in_progress({ n: inProgress.length }, o),
            m.api_home_bills_to_match({ n: openBills.length }, o),
            m.api_home_integration_exceptions({ n: openExceptions.length }, o),
          ),
          actions: [
            { label: m.api_home_supplier_bills({}, o), href: path("collections", "supplier-bills") },
            { label: m.api_home_deliveries({}, o), href: path("collections", "deliveries"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "ops",
              tiles: [
                {
                  main: true,
                  key: m.api_home_deliveries_in_progress_label({}, { locale: "en" }),
                  label: m.api_home_deliveries_in_progress_label({}, o),
                  value: str(inProgress.length),
                  note: inProgress
                    .map((d) => `${str(d.number)} ${opt("deliveries", "status", d.status).toLowerCase()}`)
                    .join(" · "),
                  href: path("collections", "deliveries"),
                  trend: { labels: ts(H.weeks), values: moving, unit: "count" },
                  delta: moved(lang, since(moving), signed(since(moving)), { than: lastWeek }),
                },
              ],
            },
            agenda,
            briefingList,
            { kind: "charts", id: "flow", charts: [cash, ack] },
          ],
        };
        break;
      }
      case "sales": {
        const steps = opportunities.filter((p) => own(p) && within(date(p.nextStepDue)));
        body = {
          subtitle: numbers(
            m.api_home_live_cases({ n: myLive.length }, o),
            m.api_home_awaiting_customer(
              { n: myLive.filter((c) => c.wait === "Awaiting customer decision").length },
              o,
            ),
            m.api_home_pipeline_steps_week({ n: steps.length }, o),
          ),
          actions: [
            { label: m.api_home_pipeline({}, o), href: path("collections", "opportunities") },
            { label: m.api_home_new_case({}, o), href: path("collections", "cases", "create"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "waits",
              tiles: [
                waitTile("Awaiting customer decision", myLive),
                waitTile("Awaiting internal approval", myLive),
                wonTile,
              ],
            },
            agenda,
            briefingList,
            { kind: "charts", id: "sales", charts: [pipeline, lost] },
          ],
        };
        break;
      }
      case "office-admin": {
        const outOfHours = since(H.afterHours);
        body = {
          subtitle: numbers(
            m.api_home_messages_to_triage({ n: newMessages.length }, o),
            m.api_home_follow_ups_due_today({ n: todays() }, o),
            m.api_home_live_cases({ n: live.length }, o),
          ),
          actions: [
            { label: m.api_home_follow_ups({}, o), href: path("collections", "tasks") },
            { label: m.api_home_review_inbox({}, o), href: path("collections", "intake-messages"), primary: true },
          ],
          widgets: [
            {
              kind: "tiles",
              id: "desk",
              tiles: [
                {
                  key: m.api_home_out_of_hours_rfqs({}, { locale: "en" }),
                  label: m.api_home_out_of_hours_rfqs({}, o),
                  value: str(last(H.afterHours)),
                  note: m.api_home_this_week_vs_last({}, o),
                  trend: { labels: ts(H.weeks), values: H.afterHours, unit: "count" },
                  delta: moved(lang, outOfHours, signed(outOfHours)),
                },
                ackTile,
              ],
            },
            agenda,
            { kind: "charts", id: "desk", charts: [afterHours, ack] },
          ],
        };
        break;
      }
      default:
        // Supply chain & customer service (and anyone else): the buyer's day.
        body = {
          subtitle: numbers(
            m.api_home_cases_in_queue({ n: mine.length }, o),
            m.api_home_supplier_replies_outstanding({ n: awaitingReply }, o),
            m.api_home_follow_ups_today({ n: todays(me.id) }, o),
          ),
          actions: [
            { label: m.api_home_review_inbox({}, o), href: path("collections", "intake-messages") },
            ...(mine[0]
              ? [
                  {
                    label: m.api_home_continue({ caseId: str(mine[0].caseId) }, o),
                    href: path("collections", "cases", mine[0].id),
                    primary: true,
                  },
                ]
              : [{ label: m.api_home_all_cases({}, o), href: path("collections", "cases"), primary: true }]),
          ],
          widgets: [
            {
              kind: "tiles",
              id: "waits",
              tiles: [
                waitTile("Awaiting supplier", live, m.api_home_rfqs_awaiting_reply({ n: awaitingReply }, o)),
                waitTile("Awaiting internal approval", live, m.api_home_approvals_in_queue({ n: pending.length }, o)),
                {
                  key: m.api_home_my_turnaround({}, { locale: "en" }),
                  label: m.api_home_my_turnaround({}, o),
                  value: m.api_home_days({ n: last(H.myTurnaround) }, o),
                  note: m.api_home_median_target({}, o),
                  trend: { labels: ts(H.weeks.slice(-8)), values: H.myTurnaround, unit: "days" },
                  delta: moved(
                    lang,
                    since(H.myTurnaround),
                    m.api_home_days({ n: signed(since(H.myTurnaround), 1) }, o),
                    {
                      rising: "bad",
                      than: lastWeek,
                    },
                  ),
                },
              ],
            },
            agenda,
            briefingList,
            // My deadlines over the next 7 days are the cases collection drawn as a chart (../pages/home.ts).
            { kind: "charts", id: "mine", charts: [myTurnaround] },
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
