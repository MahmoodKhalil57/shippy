import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "../types.ts";
import { history as H } from "./history.ts";
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
  meOf,
  money,
  nameOf,
  num,
  pct,
  relative,
  str,
  unauthorized,
} from "./insights-shared.ts";

/**
 * The AI layer of the control room, as deterministic stubs over live data:
 *
 * - GET /api/briefing — the 07:00 daily briefing, written for the signed-in person from the
 *   cases, approvals, supplier RFQs, invoices, bills, FX and exceptions as they stand (`?refresh=1`
 *   is the "Summarise" button: same data, stamped now).
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

const LIVE_END = ["Closed — settled", "Lost", "Expired"];
/** Stages before the quotation goes out (where the quote deadline matters). */
const PRE_QUOTE = /New|Validating|Sourcing|Awaiting supplier|Comparing|corrected|approval|Revision/;
/** The first few, then "and N more". */
const some = (xs: string[], n = 3) =>
  xs.length > n ? `${xs.slice(0, n).join("; ")} and ${xs.length - n} more` : xs.join("; ");

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
  const fx = (await req.payload.findGlobal({ slug: "fx-rates" as never }).catch(() => ({}))) as Record<string, unknown>;
  return { cases, approvals, rfqs, invoices, bills, suppliers, opportunities, exceptions, users, receipts, fx };
}

/** "USD 35,600 + EUR 7,040 + EGP 663,500". */
const totalsText = (invoices: Doc[]) => {
  const totals = new Map<string, number>();
  for (const i of invoices)
    totals.set(str(i.currency) || "USD", (totals.get(str(i.currency) || "USD") ?? 0) + balance(i));
  return [...totals].map(([cur, n]) => money(cur, n)).join(" + ");
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
  const items: BriefingItem[] = [];

  const due = dueSoon(w);
  if (due.length)
    items.push({
      tone: "error",
      text: `${due.length} quote${due.length === 1 ? "" : "s"} must go out by tomorrow: ${due
        .map(
          (c) =>
            `${str(c.vessel)} (${str(c.caseId)}) ${relative(new Date(str(c.deadline)))}${c.blocker ? ` — ${str(c.blocker).toLowerCase()}` : ""}`,
        )
        .join("; ")}.`,
      sources: due.map(caseSource),
    });
  const silent = silentRfqs(w);
  if (silent.length)
    items.push({
      tone: "warning",
      text: `${silent.length} supplier${silent.length === 1 ? " hasn't" : "s haven't"} replied in time: ${silent
        .map(
          (r) =>
            `${nameOf(r.supplier)} on ${str(r.reference)}${num(r.reminders) ? ` (${num(r.reminders)} reminder${num(r.reminders) === 1 ? "" : "s"} sent)` : ""}`,
        )
        .join("; ")}. Reminders run automatically; escalations go to the case owner.`,
      sources: silent.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
    });
  const late = lateReceipts(w);
  if (late.length && role !== "sales")
    items.push({
      tone: "warning",
      text: `${late.length} supplier deliver${late.length === 1 ? "y came" : "ies came"} in short: ${some(
        late.map(
          (r) =>
            `PO ${str((r.purchaseOrder as Doc | undefined)?.number)} line ${num(r.lineNo)}, ${num(r.received)} of ${num(r.ordered)}${r.backorderDate ? ` — rest promised ${fmtDay(new Date(str(r.backorderDate)))}` : ""}`,
        ),
      )}. The bills stay on hold until the quantities match.`,
      sources: late.map((r) => ({
        label: `Receipt PO ${str((r.purchaseOrder as Doc | undefined)?.number)}`,
        href: docHref("receipts", r.id),
      })),
    });
  const mismatch = w.cases.filter((c) => /PO mismatch/.test(str(c.stage)));
  for (const c of mismatch)
    items.push({
      tone: "error",
      text: `The customer PO on ${str(c.caseId)} (${str(c.vessel)}) differs from the approved quote: ${str(c.blocker || "commitment blocked until it matches")}.`,
      sources: [caseSource(c)],
    });
  const ap = pending(w);
  const forMe = ap.filter((a) => ((a.approvers as unknown[] | undefined) ?? []).some((u) => idOf(u) === me.id));
  if (ap.length)
    items.push({
      tone: forMe.length ? "warning" : "info",
      text: forMe.length
        ? `${forMe.length} approval${forMe.length === 1 ? " waits" : "s wait"} for you: ${some(forMe.map((a) => str(a.title)))}.`
        : `${ap.length} item${ap.length === 1 ? " is" : "s are"} awaiting approval (${[...new Set(ap.map((a) => str(a.type)))].join(", ")}).`,
      sources: (forMe.length ? forMe : ap).map((a) => ({
        label: str(a.type || a.title),
        href: docHref("approvals", a.id),
      })),
    });
  const rate = pendingRate(w);
  const active = activeRate(w);
  if (rate && active && money$)
    items.push({
      tone: "warning",
      text: `USD moved from ${active.toFixed(2)} to ${num(rate.egpPerUnit).toFixed(2)} EGP (${pct(((num(rate.egpPerUnit) - active) / active) * 100)}). The new rate waits for approval; open quotations are re-checked against the 15% minimum margin once it's active.`,
      sources: [{ label: "FX rates", href: "/globals/fx-rates" }],
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
    const line = (i: Doc) => `${nameOf(i.customer)} ${money(str(i.currency) || "USD", balance(i))} (${str(i.number)})`;
    items.push({
      tone: overdue.length ? "warning" : "info",
      text: `Collections: ${totalsText(rec)} open on ${rec.length} invoices.${week.length ? ` Due this week: ${some(week.map(line))}.` : ""}${overdue.length ? ` Overdue: ${some(overdue.map(line))}.` : " Nothing overdue."}`,
      sources: [...week, ...overdue].map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
    });
  }
  const held = w.bills.filter((b) => b.status === "On hold");
  if (held.length && money$)
    items.push({
      tone: "warning",
      text: `${held.length} supplier bill${held.length === 1 ? " is" : "s are"} on hold after the three-way match: ${held.map((b) => `${str(b.billNumber)} (${str(b.holdReason)})`).join("; ")}.`,
      sources: held.map((b) => ({ label: str(b.billNumber), href: docHref("supplier-bills", b.id) })),
    });
  const ex = w.exceptions.filter((x) => x.status === "Open");
  if (ex.length)
    items.push({
      tone: "warning",
      text: `${ex.length} integration exception${ex.length === 1 ? "" : "s"} need${ex.length === 1 ? "s" : ""} a look: ${ex.map((x) => `${str(x.source)} — ${str(x.summary)}`).join("; ")}. Safe retry is available.`,
      sources: ex.map((x) => ({ label: str(x.source), href: docHref("integration-exceptions", x.id) })),
    });
  if (money$) {
    const gpE = H.gpExpectedK.at(-1) ?? 0;
    const gpA = H.gpActualK.at(-1) ?? 0;
    items.push({
      tone: "info",
      text: `November gross profit: EGP ${gpE}k expected at quotation, EGP ${gpA}k actual so far as costs are billed.`,
      sources: [{ label: "Control room", href: "/control-room" }],
    });
  }

  const name = first(str(me.name) || "there");
  const greeting = `Good morning ${name}.`;
  const summary = [greeting, "", ...items.map((i) => `• ${i.text}`)].join("\n");
  const at = refresh ? fmtTime(new Date()) : "07:00";
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
  const points = [
    `Stage: ${str(c.stage)}${c.wait ? ` (${str(c.wait).toLowerCase()})` : ""} · owner ${userName(w, c.owner)}`,
    `Next: ${str(c.nextAction)}${c.blocker ? ` · blocker: ${str(c.blocker)}` : ""}`,
    deadline && PRE_QUOTE.test(str(c.stage))
      ? `Quote deadline ${fmtDay(deadline)} ${fmtTime(deadline)} (${relative(deadline)})${eta ? ` · ETA ${str(c.port)} ${fmtDay(eta)}` : ""}`
      : eta
        ? `ETA ${str(c.port)} ${fmtDay(eta)}`
        : "",
    total
      ? `Lines: ${num(lines?.ready)} of ${total} ready${num(lines?.blocked) ? `, ${num(lines?.blocked)} blocked` : ""}`
      : "",
    waiting.length
      ? `Waiting on ${waiting.map((r) => nameOf(r.supplier)).join(", ")} (${waiting.map((r) => str(r.status).toLowerCase()).join(", ")})`
      : "",
    approvals.length ? `Approval pending: ${approvals.map((a) => str(a.title)).join("; ")}` : "",
    ...invoices.map(
      (i) => `Invoice ${str(i.number)}: ${str(i.status)}, ${money(str(i.currency) || "USD", balance(i))} open`,
    ),
  ].filter(Boolean);
  const sources: Source[] = [
    caseSource(c),
    ...waiting.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
    ...approvals.map((a) => ({ label: str(a.type), href: docHref("approvals", a.id) })),
    ...invoices.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
  ];
  if (MONEY_ROLES.includes(role) && /Invoiced|Delivering|Closed/.test(str(c.stage))) {
    const p = await caseProfit(req, c.id);
    if (p?.costed) {
      points.push(
        `Gross profit ${egp(p.actual.profit)} (${pct(p.actual.margin)}) against ${egp(p.expected.profit)} expected (${pct(p.expected.margin)})`,
      );
      sources.push({ label: "Profit & close", href: `${docHref("cases", c.id)}/profit` });
    }
  }
  return {
    intent: "case",
    answer: `${str(c.caseId)} · ${str(c.vessel)} (${nameOf(c.customer)}): ${str(c.stage)}.`,
    points,
    sources,
  };
}

export async function ask(req: PayloadRequest, question: string): Promise<Answer> {
  const me = meOf(req)!;
  const role = str(me.role);
  const q = question.toLowerCase().trim();
  const w = await world(req);
  const reply = (a: Omit<Answer, "question">): Answer => ({ question, ...a });

  // Margin, profit and cost questions first: Sales never gets an answer to those.
  if (has(q, "margin", "profit", "cost", "markup", " gp", /^gp\b/, "earn")) {
    if (role === "sales")
      return reply({
        intent: "refused",
        refused: true,
        answer: "I can't share costs, margins or profit with the Sales role.",
        points: ["Ask about a case's status, approvals, deadlines, suppliers or the growth pipeline instead."],
        sources: [],
      });
    const c = findCase(w, q);
    if (c) {
      const p = await caseProfit(req, c.id);
      if (p?.costed)
        return reply({
          intent: "margin",
          answer: `${p.caseId} (${p.vessel}): actual gross profit ${egp(p.actual.profit)}, ${pct(p.actual.margin)} margin, against ${egp(p.expected.profit)} (${pct(p.expected.margin)}) expected at quotation.`,
          points: [
            ...p.lines
              .filter((l) => l.actual !== undefined && Math.abs(l.actual - l.expected) >= 1)
              .map((l) => `${l.label}: ${egp(l.expected)} → ${egp(l.actual!)}${l.note ? ` (${l.note})` : ""}`),
            p.fxTotal ? `FX on receipts: ${p.fxTotal > 0 ? "+" : "−"}${egp(Math.abs(p.fxTotal))}` : "",
          ].filter(Boolean),
          sources: [{ label: `${p.caseId} profit & close`, href: `${docHref("cases", p.id)}/profit` }],
        });
    }
    const months = H.months;
    const e = H.gpExpectedK.at(-1) ?? 0;
    const a = H.gpActualK.at(-1) ?? 0;
    const low = H.marginByStore.filter(([, m]) => m < 20);
    const settled = await caseProfit(req, "gs-rfq-0131");
    return reply({
      intent: "margin",
      answer: `${months.at(-1)}: gross profit EGP ${e}k expected at quotation, EGP ${a}k actual so far — the gap closes as November's costs are billed.`,
      points: [
        `Margin by store, last 90 days: ${H.marginByStore.map(([s, m]) => `${s} ${pct(m)}`).join(", ")} (minimum 15%).`,
        low.length ? `Lowest: ${low.map(([s, m]) => `${s} ${pct(m)}`).join(", ")}.` : "",
        settled?.costed
          ? `${settled.caseId}: ${pct(settled.actual.margin)} actual vs ${pct(settled.expected.margin)} expected — the launch cost more after the ETA moved at short notice.`
          : "",
      ].filter(Boolean),
      sources: [
        { label: "Control room", href: "/control-room" },
        ...(settled?.costed
          ? [{ label: `${settled.caseId} profit & close`, href: `${docHref("cases", settled.id)}/profit` }]
          : []),
      ],
    });
  }

  if (has(q, "approv", "sign off", "sign-off", "waiting for me", "decision")) {
    const ap = pending(w);
    return reply({
      intent: "approvals",
      answer: ap.length
        ? `${ap.length} approval${ap.length === 1 ? " is" : "s are"} waiting.`
        : "Nothing is waiting for approval.",
      points: ap.map(
        (a) =>
          `${str(a.title)} — ${str(a.type)}, from ${userName(w, a.requestedBy)} · approvers ${((a.approvers as unknown[] | undefined) ?? []).map((u) => first(userName(w, u))).join(" + ")}${a.twoPerson ? " (two-person rule)" : ""}`,
      ),
      sources: ap.map((a) => ({ label: str(a.type), href: docHref("approvals", a.id) })),
    });
  }

  if (has(q, "owe", "cash", "receivable", "collect", "invoice", "paid", "payment", "debt", "overdue")) {
    const rec = receivable(w).sort((x, y) => str(x.dueDate).localeCompare(str(y.dueDate)));
    const overdue = rec.filter((i) => i.dueDate && new Date(str(i.dueDate)) < NOW);
    const shown = rec.slice(0, 6);
    const bills = MONEY_ROLES.includes(role)
      ? w.bills.filter((b) => !["Paid", "Cancelled", "Credit note"].includes(str(b.status)))
      : [];
    return reply({
      intent: "cash",
      answer: rec.length
        ? `Customers owe ${totalsText(rec)} on ${rec.length} open invoice${rec.length === 1 ? "" : "s"}${overdue.length ? `; ${overdue.length} overdue` : ""}.`
        : "No customer invoice has an open balance.",
      points: [
        ...shown.map(
          (i) =>
            `${nameOf(i.customer)}: ${money(str(i.currency) || "USD", balance(i))} on ${str(i.number)}${i.dueDate ? `, ${new Date(str(i.dueDate)) < NOW ? "overdue since" : "due"} ${fmtDay(new Date(str(i.dueDate)))}` : ""}${num(i.paid) ? ` (${money(str(i.currency) || "USD", num(i.paid))} received)` : ""}`,
        ),
        rec.length > shown.length ? `…and ${rec.length - shown.length} more due later.` : "",
        ...bills.map(
          (b) =>
            `We owe ${nameOf(b.supplier)} ${money(str(b.currency) || "EGP", num(b.amount))} on bill ${str(b.billNumber)} (${str(b.status)}${b.holdReason ? `: ${str(b.holdReason)}` : ""})`,
        ),
      ].filter(Boolean),
      sources: [
        ...shown.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
        ...bills.map((b) => ({ label: str(b.billNumber), href: docHref("supplier-bills", b.id) })),
      ],
    });
  }

  if (has(q, "supplier", "vendor", "late", "slow", "reply", "replied", "respond")) {
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
        ? `${str(named.name)}: replies in ${num(named.replyHrs) || "—"} h on average, ${named.onTime ? `${num(named.onTime)}% on time` : "no deliveries yet"}${named.status === "New" ? " — new supplier, never ordered from" : ""}.`
        : `${late.length} deliver${late.length === 1 ? "y is" : "ies are"} late or short, and ${waiting.length} supplier RFQ${waiting.length === 1 ? " is" : "s are"} waiting for a reply.`,
      points: [
        ...late.map(
          (r) =>
            `${sName(poSupplier(r))} — ${str((r.purchaseOrder as Doc | undefined)?.number)} line ${num(r.lineNo)}: ${num(r.received)} of ${num(r.ordered)} received${r.claim ? ` · ${str(r.claim)}` : r.backorderDate ? ` · rest promised ${fmtDay(new Date(str(r.backorderDate)))}` : ""}`,
        ),
        ...waiting.map(
          (r) =>
            `${nameOf(r.supplier)} — ${str(r.reference)} ${str(r.status).toLowerCase()}${r.dueAt ? `, due ${relative(new Date(str(r.dueAt)))}` : ""}${num(r.reminders) ? ` (${num(r.reminders)} reminder${num(r.reminders) === 1 ? "" : "s"})` : ""}`,
        ),
        ...(named
          ? []
          : ranked
              .slice(0, 2)
              .map((s) => `Least reliable: ${str(s.name)} ${num(s.onTime)}% on time, ${num(s.replyHrs)} h replies`)),
      ],
      sources: [
        ...late.map((r) => ({
          label: `PO ${str((r.purchaseOrder as Doc | undefined)?.number)}`,
          href: docHref("receipts", r.id),
        })),
        ...waiting.map((r) => ({ label: str(r.reference), href: docHref("supplier-rfqs", r.id) })),
        ...(named ? [{ label: str(named.name), href: docHref("suppliers", named.id) }] : []),
      ],
    });
  }

  if (
    has(q, "pipeline", "growth", "prospect", "opportunit", "lead", "registration", "win rate", "conversion", "sales")
  ) {
    const open = w.opportunities.filter((o) => o.stage !== "Closed");
    const noNext = open.filter((o) => !o.nextStep && o.stage !== "Active account");
    const inquiries = H.inquiries.reduce((s, v) => s + v, 0);
    const won = H.won.reduce((s, v) => s + v, 0);
    return reply({
      intent: "pipeline",
      answer: `${open.length} growth opportunities open; ${inquiries} inquiries and ${won} wins in the last 12 weeks (${Math.round((won / inquiries) * 100)}% by count, ${H.conversion.at(-1)}% by value this month).`,
      points: [
        ...open.map(
          (o) =>
            `${str(o.name)} — ${str(o.stage)}${o.estimatedValue ? `, ${str(o.estimatedValue)}` : ""}${o.nextStep ? ` · next: ${str(o.nextStep)}${o.nextStepDue ? ` (${fmtDay(new Date(str(o.nextStepDue)))})` : ""}` : " · no next step planned"}`,
        ),
        noNext.length ? `Plan a next step or close: ${noNext.map((o) => str(o.name)).join(", ")}.` : "",
      ].filter(Boolean),
      sources: [
        { label: "Growth board", href: "/growth" },
        ...open.map((o) => ({ label: str(o.name), href: docHref("opportunities", o.id) })),
      ],
    });
  }

  if (has(q, "due", "deadline", "today", "urgent", "risk", "blocked")) {
    const live = w.cases.filter((c) => !LIVE_END.includes(str(c.stage)));
    const risky = live
      .filter((c) => dueSoon(w).includes(c) || c.tone === "danger" || c.tone === "warn" || c.urgent)
      .sort((a, b) => str(a.deadline).localeCompare(str(b.deadline)));
    return reply({
      intent: "deadlines",
      answer: risky.length
        ? `${risky.length} live case${risky.length === 1 ? " needs" : "s need"} attention.`
        : "No live case is at risk.",
      points: risky.map(
        (c) =>
          `${str(c.caseId)} ${str(c.vessel)} — ${str(c.stage)}, deadline ${relative(new Date(str(c.deadline)))}${c.blocker ? ` · ${str(c.blocker)}` : ""}`,
      ),
      sources: risky.map(caseSource),
    });
  }

  const c = findCase(w, q);
  if (c) return reply(await answerCase(req, w, c, role));

  return reply({
    intent: "help",
    answer:
      "I answer from every case, quote, approval, invoice and supplier record in the platform. Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline.",
    points: [],
    sources: [],
  });
}

/* ---------------------------------------------------------------- endpoints */

export const assistantEndpoints: Endpoint[] = [
  {
    path: "/briefing",
    method: "get",
    handler: async (req) => {
      if (!meOf(req)) return unauthorized();
      const q = (req.query ?? {}) as Record<string, unknown>;
      return Response.json(await briefing(req, Boolean(q.refresh)));
    },
  },
  {
    path: "/ask",
    method: "post",
    handler: async (req) => {
      if (!meOf(req)) return unauthorized();
      const question = str((await body(req)).question).slice(0, 500);
      if (!question.trim()) return Response.json({ errors: [{ message: "Ask a question." }] }, { status: 400 });
      return Response.json(await ask(req, question));
    },
  },
  {
    path: "/ask/suggestions",
    method: "get",
    handler: async (req) => {
      const me = meOf(req);
      if (!me) return unauthorized();
      return Response.json({
        suggestions: SUGGESTIONS.filter((s) => str(me.role) !== "sales" || !/margin/i.test(s)),
      });
    },
  },
];
