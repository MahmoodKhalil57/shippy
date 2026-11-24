import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { history as H, historyLabel } from "./history.ts";
import { caseProfit } from "./profit.ts";
import {
  DAY,
  MONEY_ROLES,
  NOW,
  type Source,
  type Tone,
  all,
  body,
  docHref,
  egp,
  first,
  fmtDay,
  fmtTime,
  idOf,
  type Lang,
  langOf,
  meOf,
  money,
  nameOf,
  num,
  pct,
  relative,
  optionLabel,
  str,
  unauthorized,
} from "./insights-shared.ts";
import { logAiCall } from "../collections/shared.ts";
import { IS_MOCK, NotConnectedError } from "../flags.ts";
import * as link from "../links.ts";

/**
 * The AI layer of the control room, as deterministic stubs over live data:
 *
 * - GET /api/briefing — the 07:00 daily briefing, written for the signed-in person from the
 *   cases, approvals, supplier RFQs, invoices, bills, FX and exceptions as they stand (`?refresh=1`
 *   stamps it now). POST /api/briefing/refresh is the "Summarise" button: it re-reads the records
 *   and later GETs carry the new time.
 * - POST /api/ask { question } — "Ask Golden Sea": intent matching (case / vessel, approvals,
 *   cash, suppliers, pipeline, deadlines, margin) answered from the records, each answer citing
 *   the records it used. Cost and margin questions are refused for Sales.
 *
 * In production these are LLM calls made server-side (Odoo), grounded on the same queries and
 * logged; the AI only drafts and answers — it never sends, prices or pays.
 */

export interface BriefingItem {
  tone: Tone;
  text: string;
  sources: Source[];
}
export interface Briefing {
  /** "07:00" for the scheduled run; the refresh time after "Summarise". */
  at: string;
  greeting: string;
  /** One-paragraph summary (what the typing animation shows). */
  summary: string;
  items: BriefingItem[];
  /** Records read to write it. */
  read: number;
}

export interface Answer {
  question: string;
  intent: "case" | "approvals" | "cash" | "suppliers" | "pipeline" | "deadlines" | "margin" | "refused" | "help";
  answer: string;
  points: string[];
  sources: Source[];
  refused?: boolean;
}

export const SUGGESTIONS = [
  "What's the status of Aurora Crest?",
  "What's waiting for approval?",
  "Who owes us money?",
  "Which suppliers are late?",
  "How is the growth pipeline?",
  "What's our margin this month?",
];
/** The suggestions in a language, in the order of SUGGESTIONS (the last is about margin). */
const suggestions = (o: { locale: Lang }) => [
  m.api_assistant_suggest_status({}, o),
  m.api_assistant_suggest_approvals({}, o),
  m.api_assistant_suggest_owes({}, o),
  m.api_assistant_suggest_late_suppliers({}, o),
  m.api_assistant_suggest_pipeline({}, o),
  m.api_assistant_suggest_margin({}, o),
];

/**
 * How the assistant writes in the request's language: Paraglide's options, an option's label and
 * money, all in that language.
 */
interface Words {
  lang: Lang;
  o: { locale: Lang };
  opt: (collection: string, path: string, value: unknown) => string;
  money: (currency: string, n: number) => string;
  egp: (n: number) => string;
}
const wordsOf = (req: PayloadRequest): Words => {
  const lang = langOf(req);
  return {
    lang,
    o: { locale: lang },
    opt: (collection, path, value) => optionLabel(req, collection, path, value),
    money: (currency, n) => money(currency, n, 0, lang),
    egp: (n) => egp(n, lang),
  };
};

const LIVE_END = ["Closed — settled", "Lost", "Expired"];
/** Stages before the quotation goes out (where the quote deadline matters). */
const PRE_QUOTE = /New|Validating|Sourcing|Awaiting supplier|Comparing|corrected|approval|Revision/;
/** The list separator of a language. */
const sep = (t: Words) => (t.lang === "ar" ? "؛ " : "; ");
/** The first few, then "and N more". */
const some = (t: Words, xs: string[], n = 3) =>
  xs.length > n
    ? m.api_assistant_and_more({ list: xs.slice(0, n).join(sep(t)), more: xs.length - n }, t.o)
    : xs.join(sep(t));

interface World {
  cases: Doc[];
  approvals: Doc[];
  rfqs: Doc[];
  invoices: Doc[];
  bills: Doc[];
  suppliers: Doc[];
  opportunities: Doc[];
  exceptions: Doc[];
  users: Doc[];
  receipts: Doc[];
  fx: Record<string, unknown>;
}

async function world(req: PayloadRequest): Promise<World> {
  const [cases, approvals, rfqs, invoices, bills, suppliers, opportunities, exceptions, users, receipts] =
    await Promise.all(
      [
        "cases",
        "approvals",
        "supplier-rfqs",
        "invoices",
        "supplier-bills",
        "suppliers",
        "opportunities",
        "integration-exceptions",
        "users",
        "receipts",
      ].map((c) => all(req, c)),
    );
  const fx = (await req.payload
    .findGlobal({ locale: req.locale, slug: "fx-rates" as never })
    .catch(() => ({}))) as Record<string, unknown>;
  return { cases, approvals, rfqs, invoices, bills, suppliers, opportunities, exceptions, users, receipts, fx };
}

/** "USD 35,600 + EUR 7,040 + EGP 663,500". */
const totalsText = (t: Words, invoices: Doc[]) => {
  const totals = new Map<string, number>();
  for (const i of invoices)
    totals.set(str(i.currency) || "USD", (totals.get(str(i.currency) || "USD") ?? 0) + balance(i));
  return [...totals].map(([cur, n]) => t.money(cur, n)).join(" + ");
};
const caseSource = (c: Doc): Source => ({ label: str(c.caseId), href: docHref("cases", c.id) });
const pending = (w: World) =>
  w.approvals.filter((a) => str(a.status ?? "Pending").startsWith("Pending") || /of 2/.test(str(a.status)));
const balance = (i: Doc) => Math.max(0, num(i.balance ?? num(i.amount) - num(i.paid)));
const receivable = (w: World) =>
  w.invoices.filter((i) => balance(i) > 0 && i.status !== "Cancelled" && i.status !== "Draft");
const silentRfqs = (w: World) =>
  w.rfqs.filter(
    (r) =>
      ["Sent", "Awaiting reply", "No response"].includes(str(r.status)) &&
      (r.dueAt ? new Date(str(r.dueAt)) < NOW : r.status === "No response"),
  );
/** Live cases whose quote is due before the end of tomorrow. */
const dueSoon = (w: World) =>
  w.cases
    .filter((c) => {
      const d = c.deadline ? new Date(str(c.deadline)) : undefined;
      return (
        !LIVE_END.includes(str(c.stage)) &&
        d &&
        Math.floor(d.getTime() / DAY) - Math.floor(NOW.getTime() / DAY) <= 1 &&
        PRE_QUOTE.test(str(c.stage))
      );
    })
    .sort((a, b) => str(a.deadline).localeCompare(str(b.deadline)));
/** Supplier RFQs still without a full reply. */
const awaitingRfqs = (w: World) =>
  w.rfqs.filter((r) =>
    ["Sent", "Awaiting reply", "Partial reply", "No response", "Clarification needed"].includes(str(r.status)),
  );
/** Goods received short or late against a supplier's promise. */
const lateReceipts = (w: World) => w.receipts.filter((r) => r.backorderDate || /late/i.test(str(r.claim)));
const pendingRate = (w: World) =>
  ((w.fx.rates as { currency?: string; egpPerUnit?: number; status?: string }[] | undefined) ?? []).find(
    (r) => r.status === "Awaiting approval",
  );
const activeRate = (w: World, currency = "USD") =>
  ((w.fx.rates as { currency?: string; egpPerUnit?: number; status?: string }[] | undefined) ?? []).find(
    (r) => r.currency === currency && r.status === "Active",
  )?.egpPerUnit;

/* ---------------------------------------------------------------- 07:00 briefing */

export async function briefing(req: PayloadRequest, refresh = false): Promise<Briefing> {
  const me = meOf(req)!;
  const role = str(me.role);
  const money$ = MONEY_ROLES.includes(role);
  const w = await world(req);
  const t = wordsOf(req);
  const { o } = t;
  const items: BriefingItem[] = [];

  const due = dueSoon(w);
  if (due.length)
    items.push({
      tone: "error",
      text: m.api_assistant_quotes_due(
        {
          count: due.length,
          list: due
            .map((c) =>
              m.api_assistant_quote_due_item(
                {
                  vessel: str(c.vessel),
                  caseId: str(c.caseId),
                  when: relative(new Date(str(c.deadline)), t.lang),
                  hasBlocker: c.blocker ? "yes" : "no",
                  blocker: str(c.blocker).toLowerCase(),
                },
                o,
              ),
            )
            .join(sep(t)),
        },
        o,
      ),
      sources: due.map(caseSource),
    });
  const silent = silentRfqs(w);
  if (silent.length)
    items.push({
      tone: "warning",
      text: m.api_assistant_suppliers_silent(
        {
          count: silent.length,
          list: silent
            .map((r) =>
              m.api_assistant_silent_item(
                { supplier: nameOf(r.supplier), reference: str(r.reference), reminders: num(r.reminders) },
                o,
              ),
            )
            .join(sep(t)),
        },
        o,
      ),
      sources: silent.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
    });
  const late = lateReceipts(w);
  if (late.length && role !== "sales")
    items.push({
      tone: "warning",
      text: m.api_assistant_deliveries_short(
        {
          count: late.length,
          list: some(
            t,
            late.map((r) =>
              m.api_assistant_short_item(
                {
                  po: str((r.purchaseOrder as Doc | undefined)?.number),
                  line: num(r.lineNo),
                  received: num(r.received),
                  ordered: num(r.ordered),
                  hasPromise: r.backorderDate ? "yes" : "no",
                  promised: r.backorderDate ? fmtDay(new Date(str(r.backorderDate)), t.lang) : "",
                },
                o,
              ),
            ),
          ),
        },
        o,
      ),
      sources: late.map((r) => ({
        label: m.api_assistant_receipt_po({ po: str((r.purchaseOrder as Doc | undefined)?.number) }, o),
        href: docHref("receipts", r.id),
      })),
    });
  const mismatch = w.cases.filter((c) => /PO mismatch/.test(str(c.stage)));
  for (const c of mismatch)
    items.push({
      tone: "error",
      text: m.api_assistant_po_mismatch(
        {
          caseId: str(c.caseId),
          vessel: str(c.vessel),
          blocker: str(c.blocker) || m.api_assistant_commitment_blocked({}, o),
        },
        o,
      ),
      sources: [caseSource(c)],
    });
  const ap = pending(w);
  const forMe = ap.filter((a) => ((a.approvers as unknown[] | undefined) ?? []).some((u) => idOf(u) === me.id));
  if (ap.length)
    items.push({
      tone: forMe.length ? "warning" : "info",
      text: forMe.length
        ? m.api_assistant_approvals_for_you(
            {
              count: forMe.length,
              list: some(
                t,
                forMe.map((a) => str(a.title)),
              ),
            },
            o,
          )
        : m.api_assistant_items_awaiting_approval(
            {
              count: ap.length,
              types: [...new Set(ap.map((a) => t.opt("approvals", "type", a.type)))].join(
                t.lang === "ar" ? "، " : ", ",
              ),
            },
            o,
          ),
      sources: (forMe.length ? forMe : ap).map((a) => ({
        label: a.type ? t.opt("approvals", "type", a.type) : str(a.title),
        href: docHref("approvals", a.id),
      })),
    });
  const rate = pendingRate(w);
  const active = activeRate(w);
  if (rate && active && money$)
    items.push({
      tone: "warning",
      text: m.api_assistant_fx_moved(
        {
          from: active.toFixed(2),
          to: num(rate.egpPerUnit).toFixed(2),
          change: pct(((num(rate.egpPerUnit) - active) / active) * 100),
        },
        o,
      ),
      sources: [{ label: m.api_assistant_fx_rates({}, o), href: link.global("fx-rates") }],
    });
  const rec = receivable(w);
  if (rec.length && role !== "sales") {
    const overdue = rec
      .filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW)
      .sort((x, y) => str(x.dueDate).localeCompare(str(y.dueDate)));
    const week = rec.filter((i) => {
      const d = i.dueDate ? new Date(str(i.dueDate)) : undefined;
      return d && d >= NOW && d.getTime() - NOW.getTime() < 7 * DAY;
    });
    const line = (i: Doc) =>
      `${nameOf(i.customer)} ${t.money(str(i.currency) || "USD", balance(i))} (${str(i.number)})`;
    items.push({
      tone: overdue.length ? "warning" : "info",
      text: [
        m.api_assistant_collections({ totals: totalsText(t, rec), count: rec.length }, o),
        week.length ? m.api_assistant_due_this_week({ list: some(t, week.map(line)) }, o) : "",
        overdue.length
          ? m.api_assistant_overdue({ list: some(t, overdue.map(line)) }, o)
          : m.api_assistant_nothing_overdue({}, o),
      ]
        .filter(Boolean)
        .join(" "),
      sources: [...week, ...overdue].map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
    });
  }
  const held = w.bills.filter((b) => b.status === "On hold");
  if (held.length && money$)
    items.push({
      tone: "warning",
      text: m.api_assistant_bills_on_hold(
        { count: held.length, list: held.map((b) => `${str(b.billNumber)} (${str(b.holdReason)})`).join(sep(t)) },
        o,
      ),
      sources: held.map((b) => ({ label: str(b.billNumber), href: docHref("supplier-bills", b.id) })),
    });
  const ex = w.exceptions.filter((x) => x.status === "Open");
  if (ex.length)
    items.push({
      tone: "warning",
      text: m.api_assistant_exceptions(
        {
          count: ex.length,
          list: ex
            .map((x) => `${t.opt("integration-exceptions", "source", x.source)} — ${str(x.summary)}`)
            .join(sep(t)),
        },
        o,
      ),
      sources: ex.map((x) => ({
        label: t.opt("integration-exceptions", "source", x.source),
        href: docHref("integration-exceptions", x.id),
      })),
    });
  if (money$) {
    const gpE = H.gpExpectedK.at(-1) ?? 0;
    const gpA = H.gpActualK.at(-1) ?? 0;
    items.push({
      tone: "info",
      text: m.api_assistant_november_gp({ expected: gpE, actual: gpA }, o),
      sources: [{ label: m.api_assistant_control_room({}, o), href: "/control-room" }],
    });
  }

  const greeting = str(me.name)
    ? m.api_assistant_good_morning({ name: first(str(me.name)) }, o)
    : m.api_assistant_good_morning_there({}, o);
  const summary = [greeting, "", ...items.map((i) => `• ${i.text}`)].join("\n");
  const at = refresh ? fmtTime(new Date(), t.lang) : "07:00";
  return {
    at,
    greeting,
    summary,
    items,
    read:
      w.cases.length + w.approvals.length + w.rfqs.length + w.invoices.length + w.bills.length + w.exceptions.length,
  };
}

/* ---------------------------------------------------------------- Ask Golden Sea */

const has = (q: string, ...words: (string | RegExp)[]) =>
  words.some((w) => (typeof w === "string" ? q.includes(w) : w.test(q)));

/** The case a question is about: by case number, vessel name or customer name. */
function findCase(w: World, q: string): Doc | undefined {
  const num4 = /(\d{4})/.exec(q)?.[1];
  if (num4) {
    const hit = w.cases.find((c) => str(c.caseId).endsWith(num4));
    if (hit) return hit;
  }
  const words = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(mv|mt|m\/v)\s+/, "")
      .split(/[^a-z0-9]+/)
      .filter((x) => x.length > 3 && !["rig", "support", "ship", "management", "shipping", "services"].includes(x));
  const live = [...w.cases].sort(
    (a, b) => Number(LIVE_END.includes(str(a.stage))) - Number(LIVE_END.includes(str(b.stage))),
  );
  const byVessel = live.find((c) => {
    const v = words(str(c.vessel));
    return v.length > 0 && v.every((x) => q.includes(x));
  });
  if (byVessel) return byVessel;
  return live.find((c) => words(str(c.vessel)).some((x) => q.includes(x)));
}

const userName = (w: World, v: unknown) => str(w.users.find((u) => u.id === idOf(v))?.name ?? nameOf(v));

async function answerCase(req: PayloadRequest, w: World, c: Doc, role: string): Promise<Omit<Answer, "question">> {
  const deadline = c.deadline ? new Date(str(c.deadline)) : undefined;
  const eta = c.eta ? new Date(str(c.eta)) : undefined;
  const lines = c.lines as { ready?: number; waiting?: number; blocked?: number; noOffer?: number } | undefined;
  const total = lines ? num(lines.ready) + num(lines.waiting) + num(lines.blocked) + num(lines.noOffer) : 0;
  const rfqs = w.rfqs.filter((r) => idOf(r.case) === c.id);
  const waiting = rfqs.filter((r) =>
    ["Sent", "Awaiting reply", "No response", "Partial reply"].includes(str(r.status)),
  );
  const approvals = pending(w).filter((a) => idOf(a.case) === c.id);
  const invoices = w.invoices.filter((i) => idOf(i.case) === c.id);
  const t = wordsOf(req);
  const { o } = t;
  const comma = t.lang === "ar" ? "، " : ", ";
  const etaText = eta ? m.api_assistant_eta({ port: str(c.port), day: fmtDay(eta, t.lang) }, o) : "";
  const points = [
    m.api_assistant_case_stage(
      {
        stage: t.opt("cases", "stage", c.stage),
        hasWait: c.wait ? "yes" : "no",
        wait: t.opt("cases", "wait", c.wait).toLowerCase(),
        owner: userName(w, c.owner),
      },
      o,
    ),
    m.api_assistant_case_next(
      { next: str(c.nextAction), hasBlocker: c.blocker ? "yes" : "no", blocker: str(c.blocker) },
      o,
    ),
    deadline && PRE_QUOTE.test(str(c.stage))
      ? m.api_assistant_case_deadline(
          {
            day: fmtDay(deadline, t.lang),
            time: fmtTime(deadline, t.lang),
            when: relative(deadline, t.lang),
            hasEta: eta ? "yes" : "no",
            eta: etaText,
          },
          o,
        )
      : etaText,
    total
      ? m.api_assistant_case_lines(
          {
            ready: num(lines?.ready),
            total,
            blocked: num(lines?.blocked),
            hasBlocked: num(lines?.blocked) ? "yes" : "no",
          },
          o,
        )
      : "",
    waiting.length
      ? m.api_assistant_case_waiting_on(
          {
            suppliers: waiting.map((r) => nameOf(r.supplier)).join(comma),
            statuses: waiting.map((r) => t.opt("supplier-rfqs", "status", r.status).toLowerCase()).join(comma),
          },
          o,
        )
      : "",
    approvals.length
      ? m.api_assistant_case_approval_pending({ titles: approvals.map((a) => str(a.title)).join(sep(t)) }, o)
      : "",
    ...invoices.map((i) =>
      m.api_assistant_case_invoice(
        {
          number: str(i.number),
          status: t.opt("invoices", "status", i.status),
          amount: t.money(str(i.currency) || "USD", balance(i)),
        },
        o,
      ),
    ),
  ].filter(Boolean);
  const sources: Source[] = [
    caseSource(c),
    ...waiting.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
    ...approvals.map((a) => ({ label: t.opt("approvals", "type", a.type), href: docHref("approvals", a.id) })),
    ...invoices.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
  ];
  if (MONEY_ROLES.includes(role) && /Invoiced|Delivering|Closed/.test(str(c.stage))) {
    const p = await caseProfit(req, c.id);
    if (p?.costed) {
      points.push(
        m.api_assistant_case_gp(
          {
            actual: t.egp(p.actual.profit),
            actualMargin: pct(p.actual.margin),
            expected: t.egp(p.expected.profit),
            expectedMargin: pct(p.expected.margin),
          },
          o,
        ),
      );
      sources.push({ label: m.api_assistant_profit_and_close({}, o), href: `${docHref("cases", c.id)}/profit` });
    }
  }
  return {
    intent: "case",
    answer: `${str(c.caseId)} · ${str(c.vessel)} (${nameOf(c.customer)}): ${t.opt("cases", "stage", c.stage)}.`,
    points,
    sources,
  };
}

export async function ask(req: PayloadRequest, question: string): Promise<Answer> {
  const me = meOf(req)!;
  const role = str(me.role);
  const q = question.toLowerCase().trim();
  const w = await world(req);
  const t = wordsOf(req);
  const { o } = t;
  const comma = t.lang === "ar" ? "، " : ", ";
  const reply = (a: Omit<Answer, "question">): Answer => ({ question, ...a });

  // Margin, profit and cost questions first: Sales never gets an answer to those. Questions are
  // matched in English and in Arabic.
  if (has(q, "margin", "profit", "cost", "markup", " gp", /^gp\b/, "earn", "هامش", "ربح", "أرباح", "تكلف", "تكاليف")) {
    if (role === "sales")
      return reply({
        intent: "refused",
        refused: true,
        answer: m.api_assistant_refused({}, o),
        points: [m.api_assistant_refused_hint({}, o)],
        sources: [],
      });
    const c = findCase(w, q);
    if (c) {
      const p = await caseProfit(req, c.id);
      if (p?.costed)
        return reply({
          intent: "margin",
          answer: m.api_assistant_case_margin(
            {
              caseId: p.caseId,
              vessel: p.vessel,
              actual: t.egp(p.actual.profit),
              actualMargin: pct(p.actual.margin),
              expected: t.egp(p.expected.profit),
              expectedMargin: pct(p.expected.margin),
            },
            o,
          ),
          points: [
            ...p.lines
              .filter((l) => l.actual !== undefined && Math.abs(l.actual - l.expected) >= 1)
              .map((l) => `${l.label}: ${t.egp(l.expected)} → ${t.egp(l.actual!)}${l.note ? ` (${l.note})` : ""}`),
            p.fxTotal
              ? m.api_assistant_fx_on_receipts(
                  { amount: `${p.fxTotal > 0 ? "+" : "−"}${t.egp(Math.abs(p.fxTotal))}` },
                  o,
                )
              : "",
          ].filter(Boolean),
          sources: [
            {
              label: m.api_assistant_case_profit_and_close({ caseId: p.caseId }, o),
              href: `${docHref("cases", p.id)}/profit`,
            },
          ],
        });
    }
    const months = H.months;
    const e = H.gpExpectedK.at(-1) ?? 0;
    const a = H.gpActualK.at(-1) ?? 0;
    const low = H.marginByStore.filter(([, v]) => v < 20);
    const settled = await caseProfit(req, "gs-rfq-0131");
    const stores = (rows: [string, number][]) =>
      rows.map(([s, v]) => `${historyLabel(s, t.lang)} ${pct(v)}`).join(comma);
    return reply({
      intent: "margin",
      answer: m.api_assistant_month_gp({ month: historyLabel(months.at(-1)!, t.lang), expected: e, actual: a }, o),
      points: [
        m.api_assistant_margin_by_store({ list: stores(H.marginByStore) }, o),
        low.length ? m.api_assistant_lowest({ list: stores(low) }, o) : "",
        settled?.costed
          ? m.api_assistant_settled_margin(
              { caseId: settled.caseId, actual: pct(settled.actual.margin), expected: pct(settled.expected.margin) },
              o,
            )
          : "",
      ].filter(Boolean),
      sources: [
        { label: m.api_assistant_control_room({}, o), href: "/control-room" },
        ...(settled?.costed
          ? [
              {
                label: m.api_assistant_case_profit_and_close({ caseId: settled.caseId }, o),
                href: `${docHref("cases", settled.id)}/profit`,
              },
            ]
          : []),
      ],
    });
  }

  if (has(q, "approv", "sign off", "sign-off", "waiting for me", "decision", "موافق", "اعتماد", "قرار")) {
    const ap = pending(w);
    return reply({
      intent: "approvals",
      answer: ap.length
        ? m.api_assistant_approvals_waiting({ count: ap.length }, o)
        : m.api_assistant_nothing_waiting_approval({}, o),
      points: ap.map((a) =>
        m.api_assistant_approval_item(
          {
            title: str(a.title),
            type: t.opt("approvals", "type", a.type),
            from: userName(w, a.requestedBy),
            approvers: ((a.approvers as unknown[] | undefined) ?? []).map((u) => first(userName(w, u))).join(" + "),
            twoPerson: a.twoPerson ? "yes" : "no",
          },
          o,
        ),
      ),
      sources: ap.map((a) => ({ label: t.opt("approvals", "type", a.type), href: docHref("approvals", a.id) })),
    });
  }

  if (
    has(
      q,
      "owe",
      "cash",
      "receivable",
      "collect",
      "invoice",
      "paid",
      "payment",
      "debt",
      "overdue",
      "يدين",
      "ندين",
      "مدين",
      "مستحق",
      "تحصيل",
      "فاتور",
      "سداد",
      "دفع",
      "سيولة",
      "نقد",
      "دين",
    )
  ) {
    const rec = receivable(w).sort((x, y) => str(x.dueDate).localeCompare(str(y.dueDate)));
    const overdue = rec.filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW);
    const shown = rec.slice(0, 6);
    const bills = MONEY_ROLES.includes(role)
      ? w.bills.filter((b) => !["Paid", "Cancelled", "Credit note"].includes(str(b.status)))
      : [];
    return reply({
      intent: "cash",
      answer: rec.length
        ? m.api_assistant_customers_owe({ totals: totalsText(t, rec), count: rec.length, overdue: overdue.length }, o)
        : m.api_assistant_no_open_balance({}, o),
      points: [
        ...shown.map((i) =>
          m.api_assistant_owe_item(
            {
              customer: nameOf(i.customer),
              amount: t.money(str(i.currency) || "USD", balance(i)),
              number: str(i.number),
              due: !i.dueDate ? "none" : new Date(str(i.dueDate)) < NOW ? "overdue" : "due",
              day: i.dueDate ? fmtDay(new Date(str(i.dueDate)), t.lang) : "",
              hasPaid: num(i.paid) ? "yes" : "no",
              paid: t.money(str(i.currency) || "USD", num(i.paid)),
            },
            o,
          ),
        ),
        rec.length > shown.length ? m.api_assistant_more_due_later({ count: rec.length - shown.length }, o) : "",
        ...bills.map((b) =>
          m.api_assistant_we_owe(
            {
              supplier: nameOf(b.supplier),
              amount: t.money(str(b.currency) || "EGP", num(b.amount)),
              bill: str(b.billNumber),
              status: t.opt("supplier-bills", "status", b.status),
              hasReason: b.holdReason ? "yes" : "no",
              reason: str(b.holdReason),
            },
            o,
          ),
        ),
      ].filter(Boolean),
      sources: [
        ...shown.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
        ...bills.map((b) => ({ label: str(b.billNumber), href: docHref("supplier-bills", b.id) })),
      ],
    });
  }

  if (
    has(
      q,
      "supplier",
      "vendor",
      "late",
      "slow",
      "reply",
      "replied",
      "respond",
      "مورد",
      "مورّد",
      "متأخر",
      "تأخر",
      "بطيء",
      "يرد",
      "الرد",
      "ردود",
    )
  ) {
    const named = w.suppliers.find((s) =>
      str(s.name)
        .toLowerCase()
        .split(/\s+/)
        .filter((x) => x.length > 3 && !["stores", "supply", "trading", "equipment"].includes(x))
        .some((x) => q.includes(x)),
    );
    const mine = (r: Doc, key = "supplier") => !named || idOf(r[key]) === named.id;
    const waiting = awaitingRfqs(w).filter((r) => mine(r));
    const poSupplier = (r: Doc) => (r.purchaseOrder as Doc | undefined)?.supplier;
    const sName = (v: unknown) => str(w.suppliers.find((x) => x.id === idOf(v))?.name) || nameOf(v);
    const late = lateReceipts(w).filter((r) => !named || idOf(poSupplier(r)) === named.id);
    const ranked = w.suppliers
      .filter((s) => s.kind !== "own-stock" && typeof s.onTime === "number")
      .sort((x, y) => num(x.onTime) - num(y.onTime));
    return reply({
      intent: "suppliers",
      answer: named
        ? m.api_assistant_supplier_named(
            {
              name: str(named.name),
              hours: num(named.replyHrs) || "—",
              hasOnTime: named.onTime ? "yes" : "no",
              onTime: num(named.onTime),
              isNew: named.status === "New" ? "yes" : "no",
            },
            o,
          )
        : m.api_assistant_suppliers_summary({ late: late.length, waiting: waiting.length }, o),
      points: [
        ...late.map((r) =>
          m.api_assistant_late_item(
            {
              supplier: sName(poSupplier(r)),
              po: str((r.purchaseOrder as Doc | undefined)?.number),
              line: num(r.lineNo),
              received: num(r.received),
              ordered: num(r.ordered),
              extra: r.claim ? "claim" : r.backorderDate ? "promised" : "none",
              claim: str(r.claim),
              promised: r.backorderDate ? fmtDay(new Date(str(r.backorderDate)), t.lang) : "",
            },
            o,
          ),
        ),
        ...waiting.map((r) =>
          m.api_assistant_waiting_item(
            {
              supplier: nameOf(r.supplier),
              reference: str(r.reference),
              status: t.opt("supplier-rfqs", "status", r.status).toLowerCase(),
              hasDue: r.dueAt ? "yes" : "no",
              due: r.dueAt ? relative(new Date(str(r.dueAt)), t.lang) : "",
              reminders: num(r.reminders),
            },
            o,
          ),
        ),
        ...(named
          ? []
          : ranked
              .slice(0, 2)
              .map((s) =>
                m.api_assistant_least_reliable({ name: str(s.name), onTime: num(s.onTime), hours: num(s.replyHrs) }, o),
              )),
      ],
      sources: [
        ...late.map((r) => ({
          label: m.api_assistant_po({ po: str((r.purchaseOrder as Doc | undefined)?.number) }, o),
          href: docHref("receipts", r.id),
        })),
        ...waiting.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
        ...(named ? [{ label: str(named.name), href: docHref("suppliers", named.id) }] : []),
      ],
    });
  }

  if (
    has(
      q,
      "pipeline",
      "growth",
      "prospect",
      "opportunit",
      "lead",
      "registration",
      "win rate",
      "conversion",
      "sales",
      "مسار",
      "نمو",
      "النمو",
      "فرص",
      "فرصة",
      "محتمل",
      "تسجيل",
      "نسبة الفوز",
      "تحويل",
      "مبيعات",
    )
  ) {
    const open = w.opportunities.filter((o) => o.stage !== "Closed");
    const noNext = open.filter((o) => !o.nextStep && o.stage !== "Active account");
    const inquiries = H.inquiries.reduce((s, v) => s + v, 0);
    const won = H.won.reduce((s, v) => s + v, 0);
    return reply({
      intent: "pipeline",
      answer: m.api_assistant_pipeline(
        {
          open: open.length,
          inquiries,
          won,
          byCount: Math.round((won / inquiries) * 100),
          byValue: H.conversion.at(-1)!,
        },
        o,
      ),
      points: [
        ...open.map((p) =>
          m.api_assistant_opportunity_item(
            {
              name: str(p.name),
              stage: t.opt("opportunities", "stage", p.stage),
              hasValue: p.estimatedValue ? "yes" : "no",
              value: str(p.estimatedValue),
              next: !p.nextStep ? "none" : p.nextStepDue ? "dated" : "yes",
              step: str(p.nextStep),
              due: p.nextStepDue ? fmtDay(new Date(str(p.nextStepDue)), t.lang) : "",
            },
            o,
          ),
        ),
        noNext.length ? m.api_assistant_plan_next_step({ names: noNext.map((p) => str(p.name)).join(comma) }, o) : "",
      ].filter(Boolean),
      sources: [
        { label: m.api_assistant_growth_board({}, o), href: "/growth" },
        ...open.map((p) => ({ label: str(p.name), href: docHref("opportunities", p.id) })),
      ],
    });
  }

  if (
    has(q, "due", "deadline", "today", "urgent", "risk", "blocked", "موعد", "مواعيد", "اليوم", "عاجل", "خطر", "متوقف")
  ) {
    const live = w.cases.filter((c) => !LIVE_END.includes(str(c.stage)));
    const risky = live
      .filter((c) => dueSoon(w).includes(c) || c.tone === "danger" || c.tone === "warn" || c.urgent)
      .sort((a, b) => str(a.deadline).localeCompare(str(b.deadline)));
    return reply({
      intent: "deadlines",
      answer: risky.length
        ? m.api_assistant_cases_need_attention({ count: risky.length }, o)
        : m.api_assistant_no_case_at_risk({}, o),
      points: risky.map((c) =>
        m.api_assistant_risky_item(
          {
            caseId: str(c.caseId),
            vessel: str(c.vessel),
            stage: t.opt("cases", "stage", c.stage),
            deadline: relative(new Date(str(c.deadline)), t.lang),
            hasBlocker: c.blocker ? "yes" : "no",
            blocker: str(c.blocker),
          },
          o,
        ),
      ),
      sources: risky.map(caseSource),
    });
  }

  const c = findCase(w, q);
  if (c) return reply(await answerCase(req, w, c, role));

  return reply({
    intent: "help",
    answer: m.api_assistant_help({}, o),
    points: [],
    sources: [],
  });
}

/* ---------------------------------------------------------------- endpoints */

/** The briefing as the AI model writes it (simulated: composed by rules from the same records). */
async function writeBriefing(req: PayloadRequest, refresh: boolean): Promise<Briefing> {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return briefing(req, refresh);
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError("the AI model writing the daily briefing, grounded on the records it reads");
  }
}

/** A question answered by the AI model (simulated: intent matching answered from the records). */
async function answer(req: PayloadRequest, question: string): Promise<Answer> {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return ask(req, question);
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      'the AI model answering an "Ask Golden Sea" question, grounded on the records it cites',
    );
  }
}

/** When each person last pressed "Summarise" (until the service worker restarts). */
const summarised = new Map<string, string>();

export const assistantEndpoints: Endpoint[] = [
  {
    path: "/briefing",
    method: "get",
    handler: async (req) => {
      if (!meOf(req)) return unauthorized(langOf(req));
      const q = (req.query ?? {}) as Record<string, unknown>;
      const again = summarised.get(String(meOf(req)!.id));
      const b = await writeBriefing(req, Boolean(q.refresh));
      return Response.json(again && !q.refresh ? { ...b, at: again } : b);
    },
  },
  {
    // "Summarise": re-read the live records now; the next GET /briefing is stamped with this time.
    path: "/briefing/refresh",
    method: "post",
    handler: async (req) => {
      const o = { locale: langOf(req) };
      if (!meOf(req)) return unauthorized(o.locale);
      const b = await writeBriefing(req, true);
      summarised.set(String(meOf(req)!.id), b.at);
      await logAiCall(req, {
        task: "Write the briefing",
        subject: m.api_assistant_briefing_subject({ count: b.read }, o),
        values: b.read,
      });
      return Response.json({
        ok: true,
        at: b.at,
        message: m.api_assistant_summarised_again({ at: b.at, count: b.read }, o),
      });
    },
  },
  {
    path: "/ask",
    method: "post",
    handler: async (req) => {
      const o = { locale: langOf(req) };
      if (!meOf(req)) return unauthorized(o.locale);
      const question = str((await body(req)).question).slice(0, 500);
      if (!question.trim())
        return Response.json({ errors: [{ message: m.api_assistant_ask_a_question({}, o) }] }, { status: 400 });
      const a = await answer(req, question);
      await logAiCall(req, {
        task: "Answer a question",
        subject: question,
        values: a.sources.length,
        outcome: a.refused ? "Rejected" : "Applied automatically",
      });
      return Response.json(a);
    },
  },
  {
    path: "/ask/suggestions",
    method: "get",
    handler: async (req) => {
      const me = meOf(req);
      const o = { locale: langOf(req) };
      if (!me) return unauthorized(o.locale);
      return Response.json({
        suggestions: suggestions(o).filter((_, i) => str(me.role) !== "sales" || !/margin/i.test(SUGGESTIONS[i]!)),
      });
    },
  },
];
