import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { CONTACT_RULES, ROLES } from "../collections/shared.ts";
import { PERMISSIONS } from "../globals/index.ts";
import { DEMO_NOW } from "./home.ts";
import * as link from "../links.ts";

/**
 * Root endpoints for the platform & trust screens: the case overview (lifecycle, line progress,
 * owner and handover, clarifications, audit trail), automations (rule registry, exception queue
 * with idempotent safe retry, AI review queue, audit log), roles & on-call routing, integrations
 * and the client-facing delivery plan. Registered in ./index.ts.
 *
 * AI steps are deterministic stubs: they draft; a person confirms (the screens call the write
 * endpoints only after a confirmation dialog).
 */

/* ================================================================ helpers */

type Req = PayloadRequest;
type User = Doc & { name?: string; role?: string; initials?: string };

const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const idOf = (v: unknown) => (v && typeof v === "object" ? str((v as Doc).id) : str(v)) || undefined;
const json = (body: unknown, status = 200) => Response.json(body, { status });
const deny = (message = "You are not allowed to perform this action.", status = 403) =>
  json({ errors: [{ message }] }, status);
const DAY = 86_400_000;

async function all(req: Req, collection: string, where?: Record<string, unknown>) {
  const r = await req.payload.find({
    collection: collection as never,
    pagination: false,
    depth: 0,
    ...(where ? { where: where as never } : {}),
  });
  return r.docs as unknown as Doc[];
}
async function body(req: Req): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}
const me = (req: Req) => req.user as unknown as User | null;

/** People, by id, for names in timelines and owners. */
async function people(req: Req) {
  const users = (await all(req, "users")) as User[];
  const byId = new Map(users.map((u) => [u.id, u]));
  const name = (v: unknown) => str(byId.get(idOf(v) ?? "")?.name) || str(idOf(v));
  const person = (v: unknown): Person | null => {
    const u = byId.get(idOf(v) ?? "");
    return u ? { id: u.id, name: str(u.name), initials: str(u.initials), role: str(u.role) } : null;
  };
  return { users, name, person };
}

const CAIRO = "Africa/Cairo";
const fmtDay = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: CAIRO });
const fmtTime = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: CAIRO });
const fmtWhen = (d: Date) => `${fmtDay(d)} ${fmtTime(d)}`;
const roleLabel = (r: string) => ROLES.find((x) => x.value === r)?.label ?? (r === "system" ? "System mailbox" : r);

async function log(
  req: Req,
  entry: { case?: string; kind: "auto" | "human" | "alert"; text: string; rule?: string; entity?: string },
) {
  await req.payload.create({
    collection: "activities" as never,
    data: { ...entry, actor: me(req)?.id, at: new Date().toISOString() } as never,
    req,
  });
}
async function notify(req: Req, user: string, n: { title: string; detail?: string; kind: string; href?: string }) {
  await req.payload.create({
    collection: "notifications" as never,
    data: { user, ...n, at: new Date().toISOString(), read: false } as never,
  });
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
}

/* ================================================================ case overview */

/** The 16 steps from the first email to the last payment (the deck's ring), with their phase. */
export const LIFECYCLE = [
  ["Intake", "Outlook and Gmail emails become cases; AI reads Excel, Word, PDF and photos.", 1],
  ["Validate", "Specs, units, certificates, exact brand vs alternatives, clarifications per line.", 1],
  ["Source", "Recommended suppliers; RFQs split by category with the client identity removed.", 1],
  ["Track", "Status per supplier, reminders that stop on reply, escalation.", 1],
  ["Deviations", "Wrong part, pack, spec or shelf life flagged; offer versions kept.", 1],
  ["Compare", "Normalised units, FX, landed cost, split sourcing, reason when not the cheapest.", 1],
  ["Price", "Pricing policy, margin vs markup, shared charges, approval by Karim Balbaa.", 1],
  ["Quote", "Golden Sea's layout in EGP or USD, English or Arabic, version-controlled.", 1],
  ["Decision", "Won, lost or waiting; follow-ups respect each customer's contact rule.", 2],
  ["PO check", "Customer PO checked against the quote version; mismatches block the order.", 2],
  ["Purchase", "Supplier POs, deposits and pro formas, 3-way bill match.", 2],
  ["Receive", "Drop-ship by default; warehouse receipts with lots, expiry and QC.", 2],
  ["Deliver", "Port, ETA and agent; an ETA change re-plans the tasks; proof of delivery.", 2],
  ["Invoice", "Invoice from delivered quantity, deposits, Egyptian e-invoicing.", 2],
  ["Collect / pay", "Collection reminders, payment approvals, two-person bank-change check.", 2],
  ["Close", "Actual vs expected profit, FX differences, claims.", 3],
] as const;

/** Where each case stage sits on the lifecycle (index into LIFECYCLE). */
export const STAGE_STEP: Record<string, number> = {
  New: 0,
  Validating: 1,
  Sourcing: 2,
  "Awaiting supplier": 3,
  "Awaiting corrected offer": 4,
  "Comparing offers": 5,
  "Awaiting management approval": 6,
  "Quotation submitted": 7,
  "Awaiting customer decision": 8,
  "Revision requested": 8,
  "On hold": 8,
  Lost: 8,
  Expired: 8,
  "Won — PO mismatch": 9,
  "Won — sales order confirmed": 10,
  Purchasing: 10,
  "Customs clearance": 11,
  "Held for vessel": 11,
  "Delivering (drop 1 of 2)": 12,
  Delivered: 13,
  "Invoiced — partially paid": 14,
  "Closed — settled": 15,
};

/** Line status → the progress bucket it counts in before the order. */
const BUCKET: Record<string, LineBucket> = {
  "Clarification needed": "blocked",
  "Not sourced": "noOffer",
  "Awaiting supplier": "waiting",
  "Awaiting customer acceptance": "waiting",
  "Ready to select": "ready",
  "Offer selected": "ready",
  "Split offer selected": "ready",
  Ordered: "ready",
  Received: "ready",
  Delivered: "ready",
  Invoiced: "ready",
  "Closed — not awarded": "closed",
};
export type LineBucket = "ready" | "waiting" | "blocked" | "noOffer" | "closed";

export interface CaseOverview {
  id: string;
  caseId: string;
  customer: { id: string; name: string; contactRule: string; contactRuleLabel: string; strict: boolean };
  customerRef: string;
  vessel: string;
  port: string;
  eta?: string;
  deadline?: string;
  deadlineText: string;
  stage: string;
  tone: string;
  urgent: boolean;
  steps: { label: string; detail: string; phase: number }[];
  current: number;
  /** Lost / expired / on hold: the stepper stops at the decision. */
  halted: "" | "lost" | "paused";
  lines: {
    total: number;
    ready: number;
    waiting: number;
    blocked: number;
    noOffer: number;
    closed: number;
    rows: { lineNo: number; description: string; status: string; bucket: LineBucket; confidence?: number }[];
  };
  /** After the order: per-line counts from POs, receipts, deliveries and invoices (partials don't count). */
  fulfilment: {
    started: boolean;
    total: number;
    ordered: number;
    received: number;
    delivered: number;
    invoiced: number;
    notes: string[];
  };
  next: string;
  blocker: string;
  owner: Person | null;
  backup: Person | null;
  handoverNote: string;
  clarifications: {
    lineNo?: number;
    to: string;
    via: string;
    question: string;
    askedAt?: string;
    askedBy: string;
    answer: string;
    answeredAt?: string;
    open: boolean;
  }[];
  tasks: {
    id: string;
    title: string;
    type: string;
    channel: string;
    due?: string;
    owner: string;
    rule: string;
    stop: string;
  }[];
  timeline: TimelineEntry[];
  /** Selling value; never for Sales. */
  value?: number;
  canReassign: boolean;
  team: Person[];
}
export interface TimelineEntry {
  id: string;
  at: string;
  kind: "auto" | "human" | "alert";
  text: string;
  actor: string;
  rule: string;
  entity: string;
  caseId?: string;
  caseHref?: string;
}

const lineNos = (v: unknown) =>
  ((v as { lineNo?: number }[] | undefined) ?? []).map((l) => Number(l.lineNo)).filter((n) => n > 0);

export async function overview(req: Req, id: string): Promise<CaseOverview | null> {
  const c = (await req.payload.findByID({
    collection: "cases",
    id,
    depth: 0,
    disableErrors: true,
  } as never)) as Doc | null;
  if (!c) return null;
  const user = me(req);
  const { users, name, person } = await people(req);
  const [customer, activities, tasks, pos, receipts, deliveries, invoices] = await Promise.all([
    req.payload
      .findByID({ collection: "customers", id: str(idOf(c.customer)), depth: 0, disableErrors: true } as never)
      .catch(() => null) as Promise<Doc | null>,
    all(req, "activities", { case: { equals: id } }),
    all(req, "tasks", { case: { equals: id } }),
    all(req, "purchase-orders", { case: { equals: id } }),
    all(req, "receipts", { case: { equals: id } }),
    all(req, "deliveries", { case: { equals: id } }),
    all(req, "invoices", { case: { equals: id } }),
  ]);

  /* lines before the order */
  const items = (c.items as Doc[] | undefined) ?? [];
  const rows = items.map((l) => {
    const status = str(l.status) || "Not sourced";
    return {
      lineNo: Number(l.lineNo),
      description: str(l.description),
      status,
      bucket: BUCKET[status] ?? "noOffer",
      confidence: typeof l.confidence === "number" ? l.confidence : undefined,
    };
  });
  const summary = (c.lines as Record<string, number> | undefined) ?? {};
  const count = (b: LineBucket) => rows.filter((r) => r.bucket === b).length;
  const lines = rows.length
    ? {
        total: rows.length,
        ready: count("ready"),
        waiting: count("waiting"),
        blocked: count("blocked"),
        noOffer: count("noOffer"),
        closed: count("closed"),
        rows,
      }
    : {
        total: (summary.ready ?? 0) + (summary.waiting ?? 0) + (summary.blocked ?? 0) + (summary.noOffer ?? 0),
        ready: summary.ready ?? 0,
        waiting: summary.waiting ?? 0,
        blocked: summary.blocked ?? 0,
        noOffer: summary.noOffer ?? 0,
        closed: 0,
        rows,
      };

  /* lines after the order: a line counts only when its whole quantity has reached the step */
  const orderedQty = new Map<number, number>();
  for (const p of pos.filter((p) => p.status !== "Cancelled"))
    for (const l of (p.lines as { lineNo?: number; qty?: number }[] | undefined) ?? [])
      orderedQty.set(Number(l.lineNo), (orderedQty.get(Number(l.lineNo)) ?? 0) + (Number(l.qty) || 0));
  const ordered = new Set(orderedQty.keys());
  const notes: string[] = [];
  const receivedQty = new Map<number, { ordered: number; received: number }>();
  for (const r of receipts) {
    const n = Number(r.lineNo);
    const cur = receivedQty.get(n) ?? { ordered: 0, received: 0 };
    cur.ordered = Math.max(cur.ordered, Number(r.ordered) || 0);
    cur.received += Number(r.received) || 0;
    receivedQty.set(n, cur);
    if (r.qc && r.qc !== "OK")
      notes.push(
        `Line ${n}: ${str(r.qc).toLowerCase()} — ${str(r.received)} of ${str(r.ordered)} received${r.backorderDate ? `, rest due ${fmtDay(new Date(str(r.backorderDate)))}` : ""}`,
      );
  }
  const received = new Set(
    [...receivedQty].filter(([, q]) => q.received >= q.ordered && q.ordered > 0).map(([n]) => n),
  );
  const deliveredQty = new Map<number, number>();
  for (const d of deliveries) {
    const done = d.status === "Delivered — confirmed";
    for (const l of (d.lines as { lineNo?: number; qty?: number }[] | undefined) ?? [])
      if (done) deliveredQty.set(Number(l.lineNo), (deliveredQty.get(Number(l.lineNo)) ?? 0) + (Number(l.qty) || 0));
    if (!done && d.status !== "Cancelled")
      notes.push(`${str(d.number)} ${str(d.status).toLowerCase()} — not counted as delivered until confirmed`);
  }
  const need = (n: number) => Math.max(orderedQty.get(n) ?? 0, receivedQty.get(n)?.ordered ?? 0, 1);
  const delivered = new Set([...deliveredQty].filter(([n, q]) => q >= need(n)).map(([n]) => n));
  const invoiced = new Set(
    invoices.filter((i) => i.status !== "Cancelled" && i.status !== "Draft").flatMap((i) => lineNos(i.lines)),
  );
  const started = ordered.size + receipts.length + deliveries.length + invoices.length > 0;
  const fulfilmentTotal = Math.max(lines.total, ...ordered, 0);

  const contactRule = str(customer?.contactRule) || "allowed";
  const stage = str(c.stage);
  const current = STAGE_STEP[stage] ?? 0;
  const deadline = str(c.deadline) ? new Date(str(c.deadline)) : undefined;
  const ownerId = idOf(c.owner);
  const role = str(user?.role);
  return {
    id: c.id,
    caseId: str(c.caseId),
    customer: {
      id: str(customer?.id),
      name: str(customer?.name) || str(idOf(c.customer)),
      contactRule,
      contactRuleLabel: CONTACT_RULES.find((r) => r.value === contactRule)?.label ?? contactRule,
      strict: contactRule === "do-not-chase",
    },
    customerRef: str(c.customerRef),
    vessel: str(c.vessel),
    port: str(c.port),
    eta: str(c.eta) || undefined,
    deadline: str(c.deadline) || undefined,
    deadlineText: deadline
      ? `${fmtWhen(deadline)}${deadline < DEMO_NOW ? " (passed)" : deadline.getTime() - DEMO_NOW.getTime() < DAY ? " (within 24 h)" : ""}`
      : "—",
    stage,
    tone: str(c.tone) || "info",
    urgent: c.urgent === true,
    steps: LIFECYCLE.map(([label, detail, phase]) => ({ label, detail, phase })),
    current,
    halted: stage === "Lost" || stage === "Expired" ? "lost" : stage === "On hold" ? "paused" : "",
    lines,
    fulfilment: {
      started,
      total: fulfilmentTotal,
      ordered: ordered.size,
      received: received.size,
      delivered: delivered.size,
      invoiced: invoiced.size,
      notes,
    },
    next: str(c.nextAction),
    blocker: str(c.blocker),
    owner: person(c.owner),
    backup: person(c.backup),
    handoverNote: str(c.handoverNote),
    clarifications: ((c.clarifications as Doc[] | undefined) ?? []).map((q) => ({
      lineNo: typeof q.lineNo === "number" ? q.lineNo : undefined,
      to: str(q.to) || "Customer",
      via: str(q.via),
      question: str(q.question),
      askedAt: str(q.askedAt) || undefined,
      askedBy: name(q.askedBy),
      answer: str(q.answer),
      answeredAt: str(q.answeredAt) || undefined,
      open: !str(q.answer),
    })),
    tasks: tasks
      .filter((t) => (t.status ?? "Open") === "Open")
      .map((t) => ({
        id: t.id,
        title: str(t.title),
        type: str(t.type),
        channel: str(t.channel),
        due: str(t.due) || undefined,
        owner: name(t.owner),
        rule: str(t.createdByRule),
        stop: str(t.stopCondition),
      })),
    timeline: activities.map((a) => timelineEntry(a, name)).sort((a, b) => b.at.localeCompare(a.at)),
    value: role !== "sales" && typeof c.value === "number" ? c.value : undefined,
    canReassign:
      !!user && (["management", "supply-chain"].includes(role) || user.id === ownerId || user.id === idOf(c.backup)),
    team: users
      .filter((u) => ["supply-chain", "sales", "operations", "management"].includes(str(u.role)))
      .map((u) => ({ id: u.id, name: str(u.name), initials: str(u.initials), role: str(u.role) })),
  };
}

const timelineEntry = (a: Doc, name: (v: unknown) => string, cases?: Map<string, Doc>): TimelineEntry => {
  const caseDoc = cases?.get(str(idOf(a.case)));
  return {
    id: a.id,
    at: str(a.at),
    kind: (["auto", "human", "alert"].includes(str(a.kind)) ? str(a.kind) : "auto") as TimelineEntry["kind"],
    text: str(a.text),
    actor: a.actor ? name(a.actor) : a.kind === "human" ? "—" : "System",
    rule: str(a.rule),
    entity: str(a.entity),
    caseId: caseDoc ? str(caseDoc.caseId) : undefined,
    caseHref: caseDoc ? link.doc("cases", caseDoc.id, "overview") : undefined,
  };
};

/** The AI-drafted handover summary (deterministic stub): what the next owner must know. */
export function handoverDraft(o: CaseOverview, to: string) {
  const open = o.clarifications.filter((q) => q.open);
  const parts = [
    `Handover — ${o.caseId} for ${to}`,
    `${o.customer.name} · ${o.vessel}${o.port ? `, ${o.port}` : ""}${o.eta ? `, ETA ${fmtDay(new Date(o.eta))}` : ""}. Stage: ${o.stage}. Quote due ${o.deadlineText}.`,
    `Lines: ${o.lines.ready} ready, ${o.lines.waiting} waiting, ${o.lines.blocked} blocked, ${o.lines.noOffer} without offer (of ${o.lines.total}).`,
    `Next: ${o.next}.${o.blocker ? ` Blocker: ${o.blocker}.` : ""}`,
    ...open.map((q) => `Open question${q.lineNo ? ` (line ${q.lineNo})` : ""} to ${q.to.toLowerCase()}: ${q.question}`),
    ...o.tasks.map((t) => `Task: ${t.title}${t.due ? ` — due ${fmtWhen(new Date(t.due))}` : ""}.`),
    `Customer contact rule: ${o.customer.contactRuleLabel}.`,
    ...o.lines.rows
      .filter((r) => r.confidence !== undefined && r.confidence < 0.85)
      .map(
        (r) => `Check line ${r.lineNo} (${r.description}): AI read it at ${Math.round((r.confidence ?? 0) * 100)}%.`,
      ),
  ];
  return {
    draft: parts.join("\n"),
    confidence: 0.92,
    sources: [
      "Case record",
      `${o.clarifications.length} clarification${o.clarifications.length === 1 ? "" : "s"}`,
      `${o.tasks.length} open task${o.tasks.length === 1 ? "" : "s"}`,
      `${o.timeline.length} timeline entries`,
    ],
  };
}

const caseOverviewGet: Endpoint = {
  path: "/case-overview/:id",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const o = await overview(req, str(req.routeParams?.id));
    return o ? json(o) : deny("Case not found.", 404);
  },
};

const handover: Endpoint = {
  path: "/case-overview/:id/handover",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const o = await overview(req, str(req.routeParams?.id));
    if (!o) return deny("Case not found.", 404);
    if (!o.canReassign) return deny("Only the owner, the backup, the supply-chain desk or management can reassign.");
    const { to } = await body(req);
    const target = o.team.find((p) => p.id === to);
    if (!target) return deny("Pick someone on the desk to hand over to.", 400);
    return json(handoverDraft(o, target.name));
  },
};

const reassign: Endpoint = {
  path: "/case-overview/:id/reassign",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const id = str(req.routeParams?.id);
    const o = await overview(req, id);
    if (!o) return deny("Case not found.", 404);
    if (!o.canReassign) return deny("Only the owner, the backup, the supply-chain desk or management can reassign.");
    const { to, note, backup } = await body(req);
    const target = o.team.find((p) => p.id === to);
    if (!target) return deny("Pick someone on the desk to hand over to.", 400);
    if (target.id === o.owner?.id) return deny(`${target.name} already owns ${o.caseId}.`, 400);
    if (!str(note).trim()) return deny("A handover note is required.", 400);
    const previous = o.owner;
    // The case hook logs "Reassigned to …" with the note on the timeline.
    await req.payload.update({
      collection: "cases",
      id,
      data: {
        owner: target.id,
        backup: str(backup) || (previous && previous.id !== target.id ? previous.id : o.backup?.id),
        handoverNote: str(note).trim(),
      } as never,
      req,
    });
    // Open tasks of the previous owner on this case move with it.
    let moved = 0;
    if (previous)
      for (const t of await all(req, "tasks", { case: { equals: id }, owner: { equals: previous.id } }))
        if ((t.status ?? "Open") === "Open") {
          await req.payload.update({ collection: "tasks", id: t.id, data: { owner: target.id } as never, req });
          moved++;
        }
    await notify(req, target.id, {
      kind: "Update",
      title: `You now own ${o.caseId}`,
      detail: `Handover from ${str(me(req)?.name)}${moved ? ` · ${moved} open task${moved === 1 ? "" : "s"} moved to you` : ""}`,
      href: link.doc("cases", id, "overview"),
    });
    return json({
      ok: true,
      owner: target,
      movedTasks: moved,
      message: `${o.caseId} handed over to ${target.name}${moved ? ` · ${moved} open task${moved === 1 ? "" : "s"} moved` : ""} · note logged on the timeline`,
    });
  },
};

/* ================================================================ automations */

export interface AutomationsView {
  rules: (Record<string, unknown> & { index: number })[];
  exceptions: Doc[];
  review: {
    id: string;
    kind: "exception" | "message" | "line";
    title: string;
    detail: string;
    href: string;
    confidence?: number;
  }[];
  audit: TimelineEntry[];
  canEdit: boolean;
  stats: { rules: number; enabled: number; ai: number; open: number; review: number; autoResolved: number };
}

const automations: Endpoint = {
  path: "/automations",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const [rulesGlobal, exceptions, messages, cases, activities, { name }] = await Promise.all([
      req.payload.findGlobal({ slug: "automation-rules", depth: 0 } as never),
      all(req, "integration-exceptions"),
      all(req, "intake-messages"),
      all(req, "cases"),
      all(req, "activities"),
      people(req),
    ]);
    const rules = ((rulesGlobal.rules as Record<string, unknown>[] | undefined) ?? []).map(
      (r, index): AutomationsView["rules"][number] => ({ ...r, index }),
    );
    const threshold = Number(rules.find((r) => r.name === "Create case from RFQ email")?.confidenceThreshold) || 0.85;
    const review: AutomationsView["review"] = [
      ...exceptions
        .filter((x) => x.status === "Waiting for review")
        .map((x) => ({
          id: x.id,
          kind: "exception" as const,
          title: `${str(x.source)}: ${str(x.summary)}`,
          detail: str(x.impact),
          href: link.doc("integration-exceptions", x.id),
        })),
      ...messages
        .filter((m) => m.status === "Needs review")
        .map((m) => ({
          id: m.id,
          kind: "message" as const,
          title: `${str(m.fromName || m.from)}: ${str(m.subject)}`,
          detail: `Uncertain match (${str(m.classification) || "unclassified"}) — waiting for a person in the inbox`,
          href: "/inbox",
          confidence: typeof m.matchConfidence === "number" ? m.matchConfidence : undefined,
        })),
      ...cases.flatMap((c) =>
        ((c.items as Doc[] | undefined) ?? [])
          .filter((l) => typeof l.confidence === "number" && l.confidence < threshold)
          .map((l) => ({
            id: `${c.id}#${str(l.lineNo)}`,
            kind: "line" as const,
            title: `${str(c.caseId)} line ${str(l.lineNo)}: ${str(l.description)}`,
            detail: str(l.missing) || "Low extraction confidence",
            href: link.doc("cases", c.id, "overview"),
            confidence: l.confidence as number,
          })),
      ),
    ];
    const caseMap = new Map(cases.map((c) => [c.id, c]));
    const view: AutomationsView = {
      rules,
      exceptions,
      review,
      audit: activities
        .map((a) => timelineEntry(a, name, caseMap))
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 40),
      canEdit: str(me(req)?.role) === "management",
      stats: {
        rules: rules.length,
        enabled: rules.filter((r) => r.enabled !== false).length,
        ai: rules.filter((r) => r.usesAI).length,
        open: exceptions.filter((x) => x.status === "Open").length,
        review: review.length,
        autoResolved: exceptions.filter((x) => x.status === "Auto-resolved").length,
      },
    };
    return json(view);
  },
};

const DONE = ["Resolved", "Auto-resolved", "Ignored"];

/**
 * Re-runs a failed step once, safely: the idempotency key is checked first, so a retry never
 * creates, imports or sends anything twice. A second retry of the same exception changes nothing.
 */
export async function safeRetry(req: Req, id: string) {
  const x = (await req.payload.findByID({
    collection: "integration-exceptions",
    id,
    depth: 0,
    disableErrors: true,
  } as never)) as Doc | null;
  if (!x) return { status: 404, message: "Exception not found." };
  const key = str(x.idempotencyKey);
  if (DONE.includes(str(x.status)))
    return {
      status: 200,
      alreadyDone: true,
      message: `Already ${str(x.status).toLowerCase()} — key ${key || "—"} checked, nothing re-run or re-sent.`,
    };
  const detail = (x.payload as Record<string, unknown> | undefined) ?? {};
  let message: string;
  if (key.startsWith("mailbox:")) {
    const account = key.slice("mailbox:".length);
    const pending = Number(detail.pending ?? (str(x.impact).match(/\d+/)?.[0] || 0));
    const linked = Number(detail.alreadyLinked ?? 0);
    message = `Re-checked ${key}: ${pending} messages waiting, ${linked} already imported → ${pending - linked} imported. No duplicate cases or acknowledgements.`;
    const g = await req.payload.findGlobal({ slug: "integrations", depth: 0 } as never);
    const connections = ((g.connections as Record<string, unknown>[] | undefined) ?? []).map((c) =>
      c.account === account
        ? {
            ...c,
            status: "Connected",
            lastSyncAt: new Date().toISOString(),
            tokenExpiresAt: new Date(Date.now() + 90 * DAY).toISOString(),
            emailsImported: (Number(c.emailsImported) || 0) + pending - linked,
            notes: "Reconnected — waiting emails imported once each",
          }
        : c,
    );
    await req.payload.updateGlobal({ slug: "integrations", data: { connections } as never });
  } else if (key.startsWith("invoice:")) {
    const no = key.slice("invoice:".length);
    message = detail.submitted
      ? `Re-checked ${key}: already accepted by the tax authority — not submitted again.`
      : `Re-checked ${key}: not yet accepted by the tax authority → signed and submitted once. Status: Valid.`;
    if (!detail.submitted) detail.submitted = true;
    detail.invoice = no;
  } else message = `Re-checked ${key || "the record"}: step re-run once.`;
  await req.payload.update({
    collection: "integration-exceptions",
    id,
    data: {
      status: "Resolved",
      retries: (Number(x.retries) || 0) + 1,
      lastRetryAt: new Date().toISOString(),
      resolvedBy: me(req)?.id,
      payload: detail,
      impact: `${str(x.impact)} — resolved by safe retry`,
    } as never,
  });
  await log(req, {
    kind: "auto",
    rule: "Safe retry",
    text: `${str(x.source)}: ${str(x.summary)}. ${message}`,
    entity: `integration-exceptions/${id}`,
  });
  return { status: 200, alreadyDone: false, message };
}

const retry: Endpoint = {
  path: "/automations/retry/:id",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const r = await safeRetry(req, str(req.routeParams?.id));
    if (r.status !== 200) return deny(r.message, r.status);
    return json({ ...r, message: r.alreadyDone ? r.message : `Retried safely — ${r.message}` });
  },
};

const ruleSwitch: Endpoint = {
  // POST /api/automations/rule { index, value }: switch a rule on or off (management), logged.
  path: "/automations/rule",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    if (str(me(req)?.role) !== "management") return deny("Management can pause or enable rules.");
    const b = await body(req);
    const enabled = b.value === true;
    const g = await req.payload.findGlobal({ slug: "automation-rules", depth: 0 } as never);
    const list = (g.rules as Record<string, unknown>[] | undefined) ?? [];
    const rule = list[Number(b.index)];
    if (!rule) return deny("Rule not found.", 404);
    const rules = list.map((r, i) => (i === Number(b.index) ? { ...r, enabled } : r));
    await req.payload.updateGlobal({ slug: "automation-rules", data: { rules }, req, overrideAccess: false } as never);
    await log(req, {
      kind: "human",
      text: `${enabled ? "Enabled" : "Paused"} automation “${str(rule.name)}”.`,
      entity: "globals/automation-rules",
    });
    return json({ ok: true, message: `${str(rule.name)} ${enabled ? "enabled" : "paused"} (logged)` });
  },
};

const reviewed: Endpoint = {
  path: "/automations/review/:id",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const id = str(req.routeParams?.id);
    const x = (await req.payload.findByID({
      collection: "integration-exceptions",
      id,
      depth: 0,
      disableErrors: true,
    } as never)) as Doc | null;
    if (!x) return deny("Exception not found.", 404);
    if (x.status !== "Waiting for review") return json({ ok: true, alreadyDone: true });
    const { note } = await body(req);
    await req.payload.update({
      collection: "integration-exceptions",
      id,
      data: { status: "Resolved", resolvedBy: me(req)?.id } as never,
    });
    await log(req, {
      kind: "human",
      text: `Reviewed: ${str(x.summary)}.${str(note) ? ` ${str(note)}` : " Fields confirmed by a person."}`,
      entity: `integration-exceptions/${id}`,
    });
    return json({ ok: true });
  },
};

/* ================================================================ roles & on-call */

/** Office hours, Cairo time: Sun–Thu 08:00–17:00. */
export function inOfficeHours(at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CAIRO,
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(at);
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  return ["Sun", "Mon", "Tue", "Wed", "Thu"].includes(day) && hour >= 8 && hour < 17;
}

export interface Routing {
  at: string;
  atText: string;
  inHours: boolean;
  routedTo: Person | null;
  backup: Person | null;
  senior: Person[];
  escalateAfterMinutes: number;
  reason: string;
}

/** Who an urgent RFQ arriving at `at` goes to. */
export async function routeUrgent(req: Req, at: Date): Promise<Routing> {
  const [roster, { person }] = await Promise.all([
    req.payload.findGlobal({ slug: "on-call-roster", depth: 0 } as never),
    people(req),
  ]);
  const escalate = Number(roster.escalateAfterMinutes) || 15;
  const senior = ((roster.seniorContacts as { user?: unknown }[] | undefined) ?? [])
    .map((s) => person(s.user))
    .filter((p): p is Person => !!p);
  const base = { at: at.toISOString(), atText: fmtWhen(at), senior, escalateAfterMinutes: escalate };
  if (inOfficeHours(at))
    return {
      ...base,
      inHours: true,
      routedTo: null,
      backup: null,
      reason: "Office hours (Sun–Thu 08:00–17:00 Cairo): the case owner picks it up by the assignment rule.",
    };
  const shift = ((roster.shifts as Record<string, unknown>[] | undefined) ?? []).find(
    (s) => new Date(str(s.from)) <= at && at < new Date(str(s.to)),
  );
  if (!shift)
    return {
      ...base,
      inHours: false,
      routedTo: senior[0] ?? null,
      backup: senior[1] ?? null,
      reason: "Outside office hours and no shift on the roster: straight to the senior call list.",
    };
  return {
    ...base,
    inHours: false,
    routedTo: person(shift.user),
    backup: person(shift.backup),
    reason: `Outside office hours: WhatsApp / SMS to the on-duty person; the backup after ${escalate} min, then senior contacts.`,
  };
}

export interface RolesView {
  permissions: { key: string; label: string; enforced: string }[];
  roles: (Record<string, unknown> & { role: string; label: string; users: Person[] })[];
  checks: { label: string; pass: boolean; detail: string }[];
  roster: {
    shifts: {
      from: string;
      to: string;
      fromText: string;
      toText: string;
      user: Person | null;
      backup: Person | null;
      now: boolean;
    }[];
    senior: Person[];
    escalateAfterMinutes: number;
  };
  now: Routing;
  canEditPermissions: boolean;
  canEditRoster: boolean;
}

const roles: Endpoint = {
  path: "/roles",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const [perms, roster, approvalRules, { users, person }] = await Promise.all([
      req.payload.findGlobal({ slug: "settings", depth: 0 } as never),
      req.payload.findGlobal({ slug: "on-call-roster", depth: 0 } as never),
      req.payload.findGlobal({ slug: "approval-rules", depth: 0 } as never),
      people(req),
    ]);
    // Live checks: the matrix is enforced by the access rules, not just written down.
    const sales = users.find((u) => u.role === "sales");
    const offer = (await all(req, "offers"))[0];
    let hidden = false;
    if (sales && offer) {
      const asSales = (await req.payload.findByID({
        collection: "offers",
        id: offer.id,
        depth: 0,
        overrideAccess: false,
        req: { user: { ...sales, collection: "users" } },
      } as never)) as Doc;
      hidden = asSales.price === undefined && offer.price !== undefined;
    }
    const bank = ((approvalRules.rules as Record<string, unknown>[] | undefined) ?? []).find((r) =>
      /bank/i.test(str(r.type)),
    );
    const bankApprovers = ((bank?.approvers as unknown[] | undefined) ?? []).map((u) => idOf(u));
    const now = DEMO_NOW;
    const view: RolesView = {
      permissions: PERMISSIONS.map((p) => ({ ...p })),
      roles: ((perms.permissions as Record<string, unknown>[] | undefined) ?? []).map((r) => ({
        ...r,
        role: str(r.role),
        label: roleLabel(str(r.role)),
        users: users
          .filter((u) => u.role === r.role)
          .map((u) => ({ id: u.id, name: str(u.name), initials: str(u.initials), role: str(u.role) })),
      })),
      checks: [
        {
          label: "Sales never sees supplier costs",
          pass: hidden,
          detail: `Read an offer as ${str(sales?.name) || "Sales"}: the price field is ${hidden ? "removed by field access" : "visible"}.`,
        },
        {
          label: "Bank-detail changes need two people (Finance + CEO)",
          pass: bank?.twoPerson === true && bankApprovers.includes("kb") && bankApprovers.includes("mh"),
          detail: `Approval rule “${str(bank?.type) || "Bank detail change"}”: two-person ${bank?.twoPerson ? "on" : "off"}, approvers ${bankApprovers.map((u) => person(u)?.name ?? u).join(" and ")}.`,
        },
      ],
      roster: {
        shifts: ((roster.shifts as Record<string, unknown>[] | undefined) ?? []).map((s) => {
          const from = new Date(str(s.from));
          const to = new Date(str(s.to));
          return {
            from: from.toISOString(),
            to: to.toISOString(),
            fromText: fmtWhen(from),
            toText: fmtWhen(to),
            user: person(s.user),
            backup: person(s.backup),
            now: from <= now && now < to,
          };
        }),
        senior: ((roster.seniorContacts as { user?: unknown }[] | undefined) ?? [])
          .map((s) => person(s.user))
          .filter((p): p is Person => !!p),
        escalateAfterMinutes: Number(roster.escalateAfterMinutes) || 15,
      },
      now: await routeUrgent(req, now),
      canEditPermissions: str(me(req)?.role) === "management",
      canEditRoster: ["management", "office-admin"].includes(str(me(req)?.role)),
    };
    return json(view);
  },
};

const route: Endpoint = {
  path: "/on-call/route",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const { at, simulate } = await body(req);
    const when = new Date(str(at) || DEMO_NOW.toISOString());
    if (Number.isNaN(when.getTime())) return deny("Give a valid time.", 400);
    const r = await routeUrgent(req, when);
    if (simulate && r.routedTo) {
      await notify(req, r.routedTo.id, {
        kind: "Alert",
        title: `Urgent RFQ after hours — you're on call (${r.atText})`,
        detail: `Simulated from /roles · acknowledge within ${r.escalateAfterMinutes} min, then ${r.backup?.name ?? "senior contacts"} is alerted`,
        href: "/roles",
      });
      await log(req, {
        kind: "alert",
        rule: "After-hours & weekend RFQ",
        text: `Simulated urgent RFQ at ${r.atText}: alert sent to on-duty ${r.routedTo.name}${r.backup ? `, backup ${r.backup.name}` : ""}.`,
      });
    }
    return json(r);
  },
};

const routeAt: Endpoint = {
  // GET /api/on-call/route?at=<iso>: who an urgent RFQ arriving then goes to (default: the demo's "now").
  path: "/on-call/route",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const at = new Date(str(req.query?.at) || DEMO_NOW.toISOString());
    return json(await routeUrgent(req, Number.isNaN(at.getTime()) ? DEMO_NOW : at));
  },
};

const permission: Endpoint = {
  // POST /api/roles/permission { role, key, value }: switch one permission of a role (management).
  path: "/roles/permission",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    if (str(me(req)?.role) !== "management") return deny("Only management edits permissions.");
    const b = await body(req);
    const key = str(b.key);
    if (!PERMISSIONS.some((p) => p.key === key)) return deny("Unknown permission.", 400);
    const settings = await req.payload.findGlobal({ slug: "settings", depth: 0 } as never);
    const permissions = ((settings.permissions as Record<string, unknown>[] | undefined) ?? []).map((r) =>
      r.role === str(b.role) ? { ...r, [key]: b.value === true } : r,
    );
    await req.payload.updateGlobal({ slug: "settings", data: { permissions }, req, overrideAccess: false } as never);
    await log(req, { kind: "human", text: "Updated the roles & permissions matrix.", entity: "globals/settings" });
    return json({ ok: true });
  },
};

const rosterSave: Endpoint = {
  // POST /api/roles/roster { user<i>, backup<i> }: who is on duty for each shift (management, office manager).
  path: "/roles/roster",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    if (!["management", "office-admin"].includes(str(me(req)?.role)))
      return deny("Management and the office manager edit the roster.");
    const b = await body(req);
    const roster = await req.payload.findGlobal({ slug: "on-call-roster", depth: 0 } as never);
    const shifts = ((roster.shifts as Record<string, unknown>[] | undefined) ?? []).map((s, i) => ({
      from: s.from,
      to: s.to,
      user: str(b[`user${i}`]) || s.user,
      backup: str(b[`backup${i}`]) || null,
    }));
    await req.payload.updateGlobal({
      slug: "on-call-roster",
      data: { ...roster, shifts },
      req,
      overrideAccess: false,
    } as never);
    await log(req, { kind: "human", text: "Updated the on-call roster.", entity: "globals/on-call-roster" });
    return json({ ok: true });
  },
};

/* ================================================================ integrations */

export interface IntegrationsView {
  /** `expiresInDays`: days from the demo's "now" until the token or certificate expires. */
  connections: (Record<string, unknown> & { index: number; live: number; expiresInDays: number | null })[];
  emailImport: Record<string, unknown>;
  backups: Record<string, unknown>;
  ack: {
    en: { subject: string; body: string };
    ar: { subject: string; body: string };
    version: number;
    status: string;
    approvedBy: string;
    to: string;
    from: string;
  };
  language: { default: string; documents: string[] };
  myLanguage: string;
  canManage: boolean;
  canSettings: boolean;
}

const fill = (t: string, vars: Record<string, string>) =>
  t.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? `{{${k}}}`);

const integrations: Endpoint = {
  path: "/integrations/status",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const [g, templates, settings, messages, { name }] = await Promise.all([
      req.payload.findGlobal({ slug: "integrations", depth: 0 } as never),
      req.payload.findGlobal({ slug: "message-templates", depth: 0 } as never),
      req.payload.findGlobal({ slug: "settings", depth: 0 } as never),
      all(req, "intake-messages"),
      people(req),
    ]);
    const ack =
      ((templates.templates as Record<string, unknown>[] | undefined) ?? []).find((t) => t.key === "rfq-ack") ?? {};
    const c = (await req.payload.findByID({
      collection: "cases",
      id: "gs-rfq-0142",
      depth: 0,
      disableErrors: true,
    } as never)) as Doc | null;
    const deadline = c?.deadline ? new Date(str(c.deadline)) : DEMO_NOW;
    const vars = {
      contact: "Ingrid L.",
      vessel: str(c?.vessel) || "MV Aurora Crest",
      port: str(c?.port) || "Port Said",
      caseId: str(c?.caseId) || "GS-RFQ-0142",
      customerRef: str(c?.customerRef) || "NSM-REQ-55821",
      owner: name(c?.owner) || "Karim Youssef",
      dueAt: fmtWhen(deadline),
      customer: "Nordvik Ship Management",
    };
    const role = str(me(req)?.role);
    const view: IntegrationsView = {
      connections: ((g.connections as Record<string, unknown>[] | undefined) ?? []).map((conn, index) => ({
        ...conn,
        index,
        expiresInDays: conn.tokenExpiresAt
          ? Math.round((new Date(str(conn.tokenExpiresAt)).getTime() - DEMO_NOW.getTime()) / DAY)
          : null,
        live: messages.filter(
          (m) =>
            (m.mailbox && m.mailbox === conn.account) || (conn.kind === "Website form" && m.channel === "Website form"),
        ).length,
      })),
      emailImport: (g.emailImport as Record<string, unknown>) ?? {},
      backups: (g.backups as Record<string, unknown>) ?? {},
      ack: {
        en: { subject: fill(str(ack.subject), vars), body: fill(str(ack.body), vars) },
        ar: { subject: fill(str(ack.subjectAr), vars), body: fill(str(ack.bodyAr), vars) },
        version: Number(ack.version) || 1,
        status: str(ack.status),
        approvedBy: name(ack.approvedBy),
        to: "purchasing@nordvik.example",
        from: "sales@goldensea.com.eg",
      },
      language: {
        default: str(settings.defaultLanguage) || "en",
        documents: ((settings.documentLanguages as string[] | undefined) ?? ["en"]).map(str),
      },
      myLanguage: str(me(req)?.language) || "en",
      canManage: ["management", "operations", "office-admin"].includes(role),
      canSettings: role === "management",
    };
    return json(view);
  },
};

const reconnect: Endpoint = {
  path: "/integrations/reconnect",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    if (!["management", "operations", "office-admin"].includes(str(me(req)?.role)))
      return deny("Management, operations or the office manager reconnect mailboxes.");
    const { index } = await body(req);
    const g = await req.payload.findGlobal({ slug: "integrations", depth: 0 } as never);
    const list = (g.connections as Record<string, unknown>[] | undefined) ?? [];
    const conn = list[Number(index)];
    if (!conn) return deny("Connection not found.", 404);
    // A mailbox with a failed sync: the safe retry imports what was waiting, once.
    const exceptions = await all(req, "integration-exceptions", {
      idempotencyKey: { equals: `mailbox:${str(conn.account)}` },
    });
    const open = exceptions.find((x) => !DONE.includes(str(x.status)));
    if (open) {
      const r = await safeRetry(req, open.id);
      return json({ ok: true, message: `Reconnected ${str(conn.account)}. ${r.message}` });
    }
    const connections = list.map((c, i) =>
      i === Number(index)
        ? {
            ...c,
            status: "Connected",
            lastSyncAt: new Date().toISOString(),
            tokenExpiresAt: new Date(Date.now() + 90 * DAY).toISOString(),
          }
        : c,
    );
    await req.payload.updateGlobal({ slug: "integrations", data: { connections } as never });
    await log(req, {
      kind: "human",
      text: `Reconnected ${str(conn.kind)} ${str(conn.account)}.`,
      entity: "globals/integrations",
    });
    return json({ ok: true, message: `Reconnected ${str(conn.account)}.` });
  },
};

const staging: Endpoint = {
  path: "/integrations/staging",
  method: "post",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    if (str(me(req)?.role) !== "management") return deny("Only management refreshes the staging copy.");
    const g = await req.payload.findGlobal({ slug: "integrations", depth: 0 } as never);
    const at = new Date().toISOString();
    await req.payload.updateGlobal({
      slug: "integrations",
      data: { backups: { ...(g.backups as Record<string, unknown> | undefined), stagingRefreshedAt: at } } as never,
    });
    await log(req, {
      kind: "human",
      text: "Staging copy refreshed from last night's backup (emails and integrations disabled on staging).",
      entity: "globals/integrations",
    });
    return json({ ok: true, stagingRefreshedAt: at });
  },
};

const language: Endpoint = {
  // POST /api/integrations/language { field: default | documents | mine, lang?, value }.
  path: "/integrations/language",
  method: "post",
  handler: async (req) => {
    const user = me(req);
    if (!user) return deny("Please sign in.", 401);
    const b = await body(req);
    const value = b.value;
    if (b.field === "mine") {
      const lang = value === "ar" ? "ar" : "en";
      await req.payload.update({
        collection: "users",
        id: user.id,
        data: { language: lang },
        req,
        overrideAccess: false,
      } as never);
      return json({
        ok: true,
        message:
          lang === "ar"
            ? "Your dashboard language: Arabic (applies after go-live translation)"
            : "Your dashboard language: English",
      });
    }
    if (str(user.role) !== "management") return deny("Company settings are changed by management.");
    let data: Record<string, unknown>;
    if (b.field === "default") data = { defaultLanguage: value === "ar" ? "ar" : "en" };
    else if (b.field === "documents") {
      const settings = await req.payload.findGlobal({ slug: "settings", depth: 0 } as never);
      const docs = ((settings.documentLanguages as string[] | undefined) ?? ["en"]).map(str);
      const l = str(b.lang);
      const next = value === true ? [...new Set([...docs, l])] : docs.filter((x) => x !== l);
      data = { documentLanguages: next.length ? next : ["en"] };
    } else return deny("Unknown setting.", 400);
    await req.payload.updateGlobal({ slug: "settings", data, req, overrideAccess: false } as never);
    return json({ ok: true, message: "Language settings saved" });
  },
};

/* ================================================================ delivery plan (client-facing) */

/**
 * The client-facing plan. Deliberately holds no prices, day rates, effort, costs or margins:
 * those stay in the vendor's internal estimate (tests/platform.test.ts guards this).
 */
interface WorkPackage {
  name: string;
  detail: string;
  /** The demo screen that shows it ("" when there is none). */
  href: string;
}
export interface Plan {
  phases: {
    key: string;
    name: string;
    weeks: string;
    from: number;
    to: number;
    goal: string;
    packages: WorkPackage[];
  }[];
  platform: WorkPackage[];
  milestones: { week: string; title: string; text: string }[];
  /** [problem, answer, screen] */
  problems: [string, string, string][];
  /** [requirement, phase, screen] */
  requirements: [string, number, string][];
  /** [principle, text, screen] */
  trust: [string, string, string][];
  /** [item, scope] */
  monthly: [string, string][];
  /** [share, when] */
  payment: [string, string][];
}

export const PLAN: Plan = {
  phases: [
    {
      key: "0",
      name: "Phase 0 · Discovery",
      weeks: "Week 1",
      from: 1,
      to: 1,
      goal: "Workflow sessions with your team, an inbox and data audit, and agreed baseline KPIs.",
      packages: [
        {
          name: "Workflow sessions with each role",
          detail: "Sourcing desk, sales, operations, finance, management",
          href: "",
        },
        {
          name: "Inbox and data audit",
          detail: "Mailboxes, existing Odoo database, products, suppliers",
          href: "/integrations",
        },
        {
          name: "Baseline KPIs and phase plan",
          detail: "Turnaround, touches per RFQ, conversion — measured before go-live",
          href: "/control-room",
        },
      ],
    },
    {
      key: "1",
      name: "Phase 1 · Email intake → approved quotation",
      weeks: "Weeks 2–7",
      from: 2,
      to: 7,
      goal: "Live by week 7: first quotations from the platform, with your inbox history loaded.",
      packages: [
        {
          name: "Odoo foundation",
          detail: "CRM, Sales, Purchase, Contacts, users and roles, English / Arabic",
          href: "/roles",
        },
        {
          name: "Outlook + Gmail connection",
          detail: "Email-to-case, attachments kept, branded acknowledgement",
          href: "/integrations",
        },
        {
          name: "AI extraction",
          detail: "PDF, Excel, Word, photo → draft lines with IMPA/ISSA, part numbers, confidence",
          href: "/inbox",
        },
        {
          name: "Reply matching & new suppliers",
          detail: "Changed subjects, duplicates, review queue, auto-saved suppliers and dated prices",
          href: link.doc("cases", "gs-rfq-0142", "rfqs"),
        },
        {
          name: "Supplier RFQs",
          detail: "Full list or split by category, client hidden, statuses, reminders, escalation",
          href: link.doc("cases", "gs-rfq-0142", "rfqs"),
        },
        {
          name: "Offer comparison",
          detail: "Deviations, versions, unit/pack normalisation, FX, landed cost, split sourcing",
          href: link.doc("cases", "gs-rfq-0142", "compare"),
        },
        {
          name: "Pricing & approvals",
          detail: "Pricing policy, margin vs markup, shared charges, approval rules",
          href: link.doc("cases", "gs-rfq-0142", "pricing"),
        },
        {
          name: "Golden Sea quotation",
          detail: "Your layout, EGP/USD, Arabic, versions, decision states",
          href: link.doc("quotations", "q-0142-v1", "preview"),
        },
        {
          name: "Inbox history",
          detail: "All mailboxes imported and de-duplicated: customers, vessels, suppliers, dated prices",
          href: "/inbox-history",
        },
        {
          name: "Approvals queue",
          detail: "Quotations, discounts and exceptions wait for a named person",
          href: "/approvals",
        },
        {
          name: "Testing, training, go-live",
          detail: "Acceptance tests from your brief, role training, 2 weeks go-live support",
          href: "",
        },
      ],
    },
    {
      key: "2",
      name: "Phase 2 · Order → delivery → billing",
      weeks: "Weeks 8–10",
      from: 8,
      to: 10,
      goal: "Orders to cash live: PO checks, supplier POs, vessel delivery and Egyptian e-invoicing.",
      packages: [
        {
          name: "Customer PO check",
          detail: "PO vs quote version, partial awards; mismatches block the order",
          href: link.doc("cases", "gs-rfq-0136", "order"),
        },
        {
          name: "Supplier POs & bills",
          detail: "Deposits, pro formas, 3-way match, no duplicate bills",
          href: link.doc("cases", "gs-rfq-0136", "order"),
        },
        {
          name: "Drop-ship & warehouse",
          detail: "Lots, expiry, QC, shortfalls and backorders",
          href: link.doc("cases", "gs-rfq-0133", "delivery"),
        },
        {
          name: "Vessel delivery",
          detail: "Port, ETA, agent; ETA changes re-plan tasks; proof of delivery",
          href: link.doc("cases", "gs-rfq-0133", "delivery"),
        },
        {
          name: "Invoicing & Egyptian e-invoice (ETA)",
          detail: "Invoices from delivered quantity, signed submission",
          href: "/cash",
        },
        {
          name: "Receivables & payables",
          detail: "Collection reminders, payment approvals, two-person bank-change check",
          href: "/cash",
        },
      ],
    },
    {
      key: "3",
      name: "Phase 3 · Actual profit, dashboards & growth",
      weeks: "Weeks 11–13",
      from: 11,
      to: 13,
      goal: "Full handover: actual profit, management dashboards, the 07:00 briefing and growth CRM.",
      packages: [
        {
          name: "Actual profit & close",
          detail: "Actual vs expected, FX differences, claims and credit notes",
          href: link.doc("cases", "gs-rfq-0131", "profit"),
        },
        {
          name: "Management dashboards",
          detail: "Pipeline, speed, cash, supplier performance, with drill-down",
          href: "/control-room",
        },
        {
          name: "AI daily briefing & “Ask Golden Sea”",
          detail: "07:00 briefing per person and an assistant across every case",
          href: "/control-room",
        },
        { name: "Growth CRM", detail: "Prospects, fleets, vendor registrations, opportunities", href: "/growth" },
        { name: "Final training and handover", detail: "Role manuals, recorded sessions, acceptance log", href: "" },
      ],
    },
  ],
  /** Running through every phase. */
  platform: [
    {
      name: "Automations & exception queue",
      detail: "Every rule explicit; nothing fails silently; safe retries",
      href: "/automations",
    },
    {
      name: "Roles, permissions & on-call",
      detail: "Sales never sees costs; after-hours RFQs to the on-duty person",
      href: "/roles",
    },
    {
      name: "Integrations, backups & export",
      detail: "Mailboxes, website form, WhatsApp, ETA, Odoo; daily backups; full export",
      href: "/integrations",
    },
  ],
  milestones: [
    { week: "Week 1", title: "Discovery done", text: "Baseline KPIs agreed and the phase plan signed." },
    {
      week: "Week 7",
      title: "First quotes from the platform",
      text: "Email intake to approved quotation live, with your inbox history loaded.",
    },
    {
      week: "Week 10",
      title: "Orders to cash live",
      text: "PO checks, supplier POs, vessel delivery, Egyptian e-invoicing.",
    },
    { week: "Week 13", title: "Full handover", text: "Actual profit, dashboards, 07:00 briefing and growth CRM." },
  ],
  problems: [
    [
      "Information scattered across Outlook, WhatsApp, Excel and people's heads",
      "One case per RFQ holds every email, file, decision and WhatsApp note. Search finds it by IMO, part number or supplier.",
      link.doc("cases", "gs-rfq-0142", "overview"),
    ],
    [
      "The same lines retyped into RFQs, quotes, POs and invoices",
      "Lines are captured once and flow through all 16 steps. Nothing is typed twice.",
      link.doc("cases", "gs-rfq-0142", "rfqs"),
    ],
    [
      "No clear owner; things fall through on leave or handover",
      "Every case has an owner, a backup, a next action and a deadline. AI writes the handover summary.",
      link.doc("cases", "gs-rfq-0142", "overview"),
    ],
    [
      "The last price is lost when nothing was ordered",
      "Every supplier offer is stored with its date and validity, with or without a PO.",
      "/inbox-history",
    ],
    [
      "The wrong item or spec reaches the customer",
      "Deviation checks catch the wrong part, pack, shelf life or spec. A person decides on equivalents.",
      link.doc("cases", "gs-rfq-0142", "compare"),
    ],
    [
      "Chasing suppliers from memory",
      "Status per supplier, reminders that stop when they reply, escalation after two reminders.",
      link.doc("cases", "gs-rfq-0142", "rfqs"),
    ],
    [
      "FX and cost changes eat the margin after quoting",
      "An approved FX table, a recheck before buying, and margin exceptions sent to Karim Balbaa.",
      "/approvals",
    ],
    [
      "Hard to see what is delivered, billed and paid",
      "Status on every line from quoted to collected, with receivables and payables per case.",
      "/cash",
    ],
    [
      "Management can't see progress or profit live",
      "Live dashboards with drill-down, actual vs expected profit, and a 07:00 AI briefing.",
      "/control-room",
    ],
  ],
  /** The brief, line by line (the deck's 22), with the phase and the screen that shows it. */
  requirements: [
    ["Email creates the case; one history", 1, link.doc("cases", "gs-rfq-0142", "overview")],
    ["Outlook + Gmail, history import", 1, "/integrations"],
    ["Extract from Excel, Word, PDF, photo", 1, "/inbox"],
    ["Match replies when the subject changes", 1, "/inbox"],
    ["Owner, backup, next action, queue", 1, link.doc("cases", "gs-rfq-0142", "overview")],
    ["RFQs split by category, client hidden", 1, link.doc("cases", "gs-rfq-0142", "rfqs")],
    ["New supplier auto-saved with prices", 1, "/inbox-history"],
    ["Supplier statuses, reminders", 1, link.doc("cases", "gs-rfq-0142", "rfqs")],
    ["Deviation checks, versions", 1, link.doc("cases", "gs-rfq-0142", "compare")],
    ["Normalised units, FX, landed cost", 1, link.doc("cases", "gs-rfq-0142", "compare")],
    ["Pricing policy & approvals", 1, link.doc("cases", "gs-rfq-0142", "pricing")],
    ["Decision states, contact rules", 1, link.doc("quotations", "q-0142-v1", "preview")],
    ["Customer PO vs quote version", 2, link.doc("cases", "gs-rfq-0136", "order")],
    ["Drop-ship, lots, expiry, QC", 2, link.doc("cases", "gs-rfq-0133", "delivery")],
    ["ETA changes, delivery proof", 2, link.doc("cases", "gs-rfq-0133", "delivery")],
    ["Invoices, multi-currency, e-invoice", 2, "/cash"],
    ["Deposits, two-person bank check", 2, "/approvals"],
    ["Actual vs expected profit", 3, link.doc("cases", "gs-rfq-0131", "profit")],
    ["Automation rules, exception queue", 1, "/automations"],
    ["Vessels, fleet, growth CRM", 3, "/growth"],
    ["Management dashboards", 3, "/control-room"],
    ["Requirement-by-requirement proof", 1, "/project"],
  ],
  trust: [
    [
      "People decide",
      "AI reads, matches and drafts. Prices, equivalent parts, approvals and payments always need a named person.",
      "/approvals",
    ],
    [
      "Every step logged",
      "Every AI call and every change has an audit trail. Low-confidence results go to a review queue.",
      "/automations",
    ],
    [
      "Roles that hold",
      "Sales never sees costs or margins. Bank-detail changes need two people: Finance and the CEO.",
      "/roles",
    ],
    [
      "Your data, exportable",
      "Standard Odoo underneath. Full data export on request, daily backups and a staging copy.",
      "/integrations",
    ],
    [
      "Your working week",
      "Support Sunday to Thursday, on your hours, with urgent RFQs routed after hours to the on-duty person.",
      "/roles",
    ],
    [
      "Proven before paid",
      "Acceptance tests from your own brief for every requirement. The final 20% is due after 30 days of use.",
      "/project",
    ],
  ],
  monthly: [
    ["AI usage", "Reading documents, matching replies, briefings and the assistant"],
    ["Hosting, monitoring & backups", "The AI and inbox engine, mail processing, daily backups and a staging copy"],
    ["Support & care", "Sunday to Thursday on your hours; fixes; custom modules kept working through Odoo updates"],
    ["Continuous improvement", "6 improvement hours a month for small changes and new automations"],
  ],
  payment: [
    ["40%", "to start a phase"],
    ["40%", "at go-live of that phase"],
    ["20%", "after 30 days of real use"],
  ],
};

export interface AcceptanceTest {
  no: number;
  scenario: string;
  evidence: string;
  href: string;
  pass: boolean;
  status: string;
  check: string;
}
export type ProjectView = Plan & { acceptance: AcceptanceTest[]; checkedAt: string };

/** The ten scenarios from the brief, checked live against the demo data. */
async function acceptance(req: Req): Promise<AcceptanceTest[]> {
  const [cases, customers, tasks, exceptions, approvals, invoices, deliveries, activities, rfqs] = await Promise.all(
    [
      "cases",
      "customers",
      "tasks",
      "integration-exceptions",
      "approvals",
      "invoices",
      "deliveries",
      "activities",
      "supplier-rfqs",
    ].map((c) => all(req, c)),
  );
  const caseById = (id: string) => cases.find((c) => c.id === id);
  const c142 = caseById("gs-rfq-0142");
  const items = (c142?.items as Doc[] | undefined) ?? [];
  const acts = (id: string) => activities.filter((a) => idOf(a.case) === id);
  const l3 = items.find((l) => l.lineNo === 3);
  const atlas = customers.find((c) => c.id === "atlas");
  const settled = cases.find((c) => c.stage === "Closed — settled");
  const inv = invoices.find((i) => idOf(i.case) === "gs-rfq-0131");
  const t = (
    no: number,
    scenario: string,
    evidence: string,
    href: string,
    pass: boolean,
    check: string,
    pending = "Not yet shown",
  ): AcceptanceTest => ({ no, scenario, evidence, href, pass, status: pass ? "Pass" : pending, check });
  return [
    t(
      1,
      "RFQ email with several items and an attachment",
      "One case, accurate draft lines, source links, owner, deadline and approved acknowledgement behaviour.",
      "/inbox",
      !!c142 &&
        items.length > 1 &&
        !!idOf(c142.owner) &&
        acts("gs-rfq-0142").some((a) => a.rule === "RFQ acknowledgement"),
      `${str(c142?.caseId)}: ${items.length} lines, owner set, acknowledgement logged once`,
    ),
    t(
      2,
      "Three supplier offers with one wrong item",
      "Line comparison identifies the mismatch; correction draft created; revised offer replaces no historical evidence.",
      link.doc("cases", "gs-rfq-0142", "compare"),
      acts("gs-rfq-0142").some((a) => a.kind === "alert" && /offered/.test(str(a.text))) &&
        rfqs.some((r) => idOf(r.case) === "gs-rfq-0142" && r.status === "Revised offer received"),
      "Deviation alert logged; revised offer received as a new version",
    ),
    t(
      3,
      "Pack size and brand changes",
      "200 × 250 ml and 100 × 500 ml both equal 50 L; totals compare correctly. Written customer acceptance required.",
      link.doc("cases", "gs-rfq-0142", "compare"),
      !!l3 && Number(l3.qty) * Number(l3.packSize) === 50,
      `Line 3: ${str(l3?.qty)} × ${str(l3?.packSize)} L = ${Number(l3?.qty) * Number(l3?.packSize)} L`,
    ),
    t(
      4,
      "Quote submitted with no answer",
      "Case remains awaiting decision; internal reminders appear; customer contact restrictions are respected.",
      link.doc("cases", "gs-rfq-0139", "overview"),
      atlas?.contactRule === "do-not-chase" &&
        tasks.some((x) => idOf(x.case) === "gs-rfq-0139" && x.internalOnly === true) &&
        caseById("gs-rfq-0139")?.stage === "Awaiting customer decision",
      "Atlas Tankers: do not chase · internal reminder only",
    ),
    t(
      5,
      "PO refers to old price or wrong quantity",
      "Mismatch blocks commitment; approval and revised customer agreement are recorded.",
      link.doc("cases", "gs-rfq-0136", "order"),
      caseById("gs-rfq-0136")?.stage === "Won — PO mismatch" ||
        acts("gs-rfq-0136").some((a) => a.rule === "Customer PO check"),
      "GS-RFQ-0136: PO mismatch blocks the sales order",
    ),
    t(
      6,
      "Split delivery with short shelf life",
      "One order supports two scheduled deliveries; stock, expiry, remaining quantity, billing and balances remain accurate.",
      link.doc("cases", "gs-rfq-0133", "delivery"),
      deliveries.filter((d) => idOf(d.case) === "gs-rfq-0133").length >= 2,
      `GS-RFQ-0133: ${deliveries.filter((d) => idOf(d.case) === "gs-rfq-0133").length} deliveries on one order`,
    ),
    t(
      7,
      "Supplier deposit and partial customer collection",
      "Separate payable and receivable balances, authorized payment steps and overdue reminders are visible.",
      "/cash",
      approvals.some((a) => /deposit/i.test(str(a.type))) && !!inv && Number(inv.paid) > 0,
      "Deposit waits for approval; GS-RFQ-0131 invoice partially paid",
    ),
    t(
      8,
      "Vessel ETA changes or supplier is late",
      "Affected delivery tasks are updated and escalated with a clear owner and next action.",
      link.doc("cases", "gs-rfq-0133", "delivery"),
      activities.some((a) => a.rule === "ETA change") && activities.some((a) => a.rule === "Escalate no response"),
      "ETA change re-planned tasks; no-response escalation logged",
    ),
    t(
      9,
      "Duplicate email or failed integration",
      "No duplicate case, bill or outgoing message; exception appears and can be safely retried.",
      "/automations",
      exceptions.some((x) => x.status === "Auto-resolved") && exceptions.every((x) => !!x.idempotencyKey),
      "Duplicate auto-resolved; every exception carries an idempotency key",
    ),
    t(
      10,
      "Order completed and settled",
      "Signed delivery evidence, invoices, actual costs, profit and residual balances reconcile.",
      link.doc("cases", "gs-rfq-0131", "profit"),
      !!settled,
      settled ? `${str(settled.caseId)} closed and settled` : "GS-RFQ-0131 closes once its balance is collected",
      "Runs at settlement",
    ),
  ];
}

const project: Endpoint = {
  path: "/project",
  method: "get",
  handler: async (req) => {
    if (!req.user) return deny("Please sign in.", 401);
    const view: ProjectView = { ...PLAN, acceptance: await acceptance(req), checkedAt: new Date().toISOString() };
    return json(view);
  },
};

export const platformEndpoints: Endpoint[] = [
  caseOverviewGet,
  handover,
  reassign,
  automations,
  retry,
  reviewed,
  ruleSwitch,
  roles,
  route,
  routeAt,
  permission,
  rosterSave,
  integrations,
  reconnect,
  staging,
  language,
  project,
];
