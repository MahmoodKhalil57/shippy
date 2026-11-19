import type { Endpoint, PayloadRequest } from "payload";
import { cash, collectionDraftFor } from "./operations.ts";
import * as link from "../links.ts";

/**
 * Receivables & payables (/cash, src/cms/widgets/cash.ts) beyond GET /api/operations/cash:
 *
 * - GET  /api/cash/reminder-drafts — the AI's collection reminder per invoice due within 5 days
 *   or overdue, by invoice id (respecting each customer's contact rule).
 * - GET  /api/cash/payables — supplier payables, payment approvals and bank-detail changes;
 *   refused (403) for Sales.
 * - POST /api/cash/reminder | decide | apply-bank | record-payment | request-approval | match — what a
 *   person does on the page. Each re-checks who may do what. The system records payments after
 *   the bank movement — it never pays.
 */

export interface Receivable {
  id: string;
  number: string;
  caseId: string | null;
  case: string | null;
  customer: string;
  customerName: string;
  contactRule: string;
  currency: string;
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  daysOverdue: number;
  eInvoice: string;
  lastReminder: string | null;
}
export interface Payable {
  id: string;
  po: string;
  case: string;
  caseId: string | null;
  supplier: string;
  supplierName: string;
  currency: string;
  total: number;
  paid: number;
  balance: number;
  deposit: number;
  depositPct: number;
  depositApproval: { id: string; status: string } | null;
  bill: { id: string; number: string; status: string; holdReason?: string | null } | null;
  due: string;
  stage: string;
}
export interface Decision {
  user: string;
  name: string;
  decision: string;
  reason?: string;
  at?: string;
}
export interface PaymentApproval {
  id: string;
  title: string;
  type: string;
  detail?: string;
  status: string;
  caseId: string | null;
  case: string | null;
  approvers: { id: string; name: string }[];
  decisions: Decision[];
  po: { id: string; number: string; supplier: string; currency: string } | null;
  amount: number;
  kind: string;
  canDecide: boolean;
}
export interface BankChange {
  id: string;
  title: string;
  status: string;
  supplierName: string;
  applied: boolean;
  decisions: Decision[];
  canDecide: boolean;
  request: {
    supplier: string;
    current: string;
    requested: { beneficiary: string; bankName: string; iban: string };
    requestedVia: string;
    phoneOnFile: string;
    phoneInRequest: string;
  } | null;
}
/** GET /api/operations/cash. */
export interface Cash {
  fx: { USD: number; EUR: number };
  receivables: Receivable[];
  ageing: { customer: string; values: number[]; total: number }[];
  buckets: string[];
  totals: { receivableUsd: number; overdueUsd: number };
  weeks: string[];
  canSeePayables: boolean;
  canFinance: boolean;
  payables: Payable[];
  payablesTotalEgp?: number;
  approvals: PaymentApproval[];
  bankChanges: BankChange[];
  cashIn: number[];
  cashOut: number[];
  fixedWeeklyEgp?: number;
}
/** A collection reminder draft (POST /api/operations/collection-draft). */
export interface Draft {
  mode: "internal" | "customer";
  rule: string;
  to?: string;
  title: string;
  subject?: string;
  body: string;
  confidence: number;
  note?: string;
}
/** GET /api/cash/payables. */
export type CashPayables = Pick<Cash, "canFinance" | "payables" | "approvals" | "bankChanges">;

const money = (n: number, cur = "USD") => {
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
};
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const day = (iso?: string | null) => (iso && !Number.isNaN(new Date(iso).getTime()) ? DAY.format(new Date(iso)) : "—");

const fail = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });

async function input(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** The cash payload as the signed-in user sees it, or the refusal. */
async function load(req: PayloadRequest): Promise<Cash | Response> {
  const res = await cash(req);
  return res.ok ? ((await res.json()) as Cash) : res;
}

async function draft(req: PayloadRequest, invoice: string): Promise<Draft | null> {
  const res = await collectionDraftFor(req, invoice);
  return res.ok ? ((await res.json()) as Draft) : null;
}

const userId = (req: PayloadRequest) => String((req.user as { id?: string } | null)?.id ?? "");
const s = (v: unknown) => (typeof v === "string" ? v : "");

/** A GET under /cash that needs the cash payload. */
const read = (path: string, run: (req: PayloadRequest, d: Cash) => Promise<Response>): Endpoint => ({
  path: `/cash/${path}`,
  method: "get",
  handler: async (req: PayloadRequest) => {
    const d = await load(req);
    return d instanceof Response ? d : run(req, d);
  },
});

/** A POST under /cash that needs the cash payload and a signed-in user. */
const action = (
  path: string,
  run: (req: PayloadRequest, d: Cash, b: Record<string, unknown>) => Promise<Response>,
): Endpoint => ({
  path: `/cash/${path}`,
  method: "post",
  handler: async (req: PayloadRequest) => {
    if (!req.user) return fail("You are not allowed to perform this action.", 401);
    const d = await load(req);
    if (d instanceof Response) return d;
    try {
      return await run(req, d, await input(req));
    } catch (e) {
      const err = e as Error & { status?: number; data?: { errors?: { message: string }[] } };
      return fail(err.data?.errors?.map((x) => x.message).join("; ") || err.message, err.status ?? 400);
    }
  },
});

const create = (req: PayloadRequest, collection: string, data: Record<string, unknown>) =>
  req.payload.create({ collection: collection as never, data: data as never, req });
const update = (req: PayloadRequest, collection: string, id: string, data: Record<string, unknown>) =>
  req.payload.update({ collection: collection as never, id, data: data as never, req });

export const cashEndpoints: Endpoint[] = [
  // The reminder drafts, for invoices due within 5 days or overdue.
  read("reminder-drafts", async (req, d) => {
    const drafts: Record<string, Draft> = {};
    for (const r of d.receivables.filter((x) => x.daysOverdue > -5)) {
      const x = await draft(req, r.id);
      if (x) drafts[r.id] = x;
    }
    return Response.json(drafts);
  }),
  // Payables, approvals and bank changes: never for Sales.
  read("payables", async (_req, d) =>
    d.canSeePayables
      ? Response.json({
          canFinance: d.canFinance,
          payables: d.payables,
          approvals: d.approvals,
          bankChanges: d.bankChanges,
        } satisfies CashPayables)
      : fail("Supplier payables, payment approvals and bank details are not visible to Sales.", 403),
  ),
  // A person sends the reminder (or files the internal one): recorded as a task on the account.
  action("reminder", async (req, d, b) => {
    const invoice = d.receivables.find((r) => r.id === s(b.invoice));
    if (!invoice) return fail("Invoice not found.", 404);
    const x = await draft(req, invoice.id);
    if (!x) return fail("Invoice not found.", 404);
    const text = s(b.body).trim() || x.body;
    const internal = x.mode === "internal";
    await create(req, "tasks", {
      title: x.title,
      type: internal ? "Internal reminder" : "Customer follow-up",
      channel: internal ? "Internal" : "Email",
      due: new Date().toISOString(),
      case: invoice.case ?? undefined,
      customer: invoice.customer,
      who: internal ? "Account owner" : x.to,
      goal: `Collect ${money(invoice.balance, invoice.currency)} on ${invoice.number}`,
      script: internal ? text : `${x.subject}\n\n${text}`,
      internalOnly: internal,
      owner: userId(req),
      createdByRule: "Collection reminder",
      stopCondition: "Payment received",
      ...(internal ? {} : { status: "Done", outcome: { result: "Sent", note: "Reviewed and sent by a person." } }),
    });
    return Response.json({ ok: true });
  }),
  // An approver decides on a payment or a bank-detail change (once, and only if they are named on it).
  action("decide", async (req, d, b) => {
    const id = s(b.approval);
    const bank = d.bankChanges.find((x) => x.id === id);
    const item = bank ?? d.approvals.find((x) => x.id === id);
    if (!item) return fail("Approval not found.", 404);
    if (!item.canDecide) return fail("You can't decide on this approval.", 403);
    const decision = s(b.decision) === "Reject" ? "Reject" : "Approve";
    const note = s(b.reason).trim();
    if (decision === "Reject" && !note) return fail("Give a reason for rejecting.");
    if (bank && decision === "Approve" && b.callBack !== true)
      return fail("Call back on the number on file and tick the confirmation first.");
    const reason = bank && b.callBack === true ? `Call-back done on number on file. ${note}`.trim() : note;
    const current = (await req.payload.findByID({
      collection: "approvals" as never,
      id,
      depth: 0,
    })) as {
      decisions?: Record<string, unknown>[];
    };
    await update(req, "approvals", id, {
      decisions: [...(current.decisions ?? []), { decision, reason }],
    });
    return Response.json({ ok: true });
  }),
  // Finance applies the new bank details once two people approved.
  action("apply-bank", async (req, d, b) => {
    const bank = d.bankChanges.find((x) => x.id === s(b.approval));
    if (!bank?.request) return fail("Bank-detail change not found.", 404);
    if (!d.canFinance) return fail("Management and finance apply bank details.", 403);
    if (bank.status !== "Approved" || bank.applied) return fail("Two different people must approve first.");
    const r = bank.request;
    await update(req, "suppliers", r.supplier, {
      bank: {
        beneficiary: r.requested.beneficiary,
        bankName: r.requested.bankName,
        iban: r.requested.iban,
        verified: true,
        verifiedBy: userId(req),
        verifiedAt: new Date().toISOString(),
      },
    });
    return Response.json({ ok: true });
  }),
  // Finance records a supplier payment made in the bank against its approval.
  action("record-payment", async (req, d, b) => {
    const a = d.approvals.find((x) => x.id === s(b.approval));
    if (!a?.po) return fail("Approval not found.", 404);
    if (!d.canFinance) return fail("Management and finance record payments.", 403);
    if (a.status !== "Approved") return fail("The payment isn't approved yet.");
    const reference = s(b.reference).trim();
    if (!reference) return fail("Give the bank reference.");
    await create(req, "payments", {
      direction: "out",
      reference,
      paidAt: new Date().toISOString(),
      amount: a.amount,
      currency: a.po.currency,
      purchaseOrder: a.po.id,
      approval: a.id,
      kind: a.kind,
      status: "Recorded",
    });
    return Response.json({ ok: true });
  }),
  // Finance asks the Financial Director or the CEO to approve a supplier payment.
  action("request-approval", async (req, d, b) => {
    const p = d.payables.find((x) => x.id === s(b.payable));
    if (!p) return fail("Payable not found.", 404);
    if (!d.canFinance) return fail("Management and finance request payment approvals.", 403);
    if (p.stage === "Bill on hold" || p.depositApproval || d.approvals.some((a) => a.po?.id === p.id))
      return fail("An approval is already in progress for this payable.");
    await create(req, "approvals", {
      title: `Pay ${p.supplierName} ${money(p.balance, p.currency)} — ${p.po}`,
      type: "Supplier payment",
      case: p.case,
      detail: `PO ${p.po}${p.bill ? ` · bill ${p.bill.number} matched (PO = receipt = bill)` : ""} · due ${day(p.due)} · bank details unchanged.`,
      approvers: ["kb", "mh"],
      subject: { relationTo: "purchase-orders", value: p.id },
    });
    for (const user of ["kb", "mh"])
      await create(req, "notifications", {
        user,
        title: `Approve payment to ${p.supplierName}`,
        detail: `${money(p.balance, p.currency)} · ${p.po}`,
        kind: "Payment",
        href: "/cash",
      }).catch(() => null);
    return Response.json({ ok: true });
  }),
  // "Match a remittance": which open invoices a payment advice pays — plain matching, not a model.
  action("match", async (_req, d, b) => {
    const found = matchRemittance(d.receivables, { invoices: s(b.invoices), amount: b.amount });
    if (!found.length)
      return fail("No open invoice matches these numbers or this amount — check the remittance by hand.");
    const list = found.map((r) => `${r.number} (${r.customerName}, ${money(r.balance, r.currency)} open)`).join("; ");
    return Response.json({
      ok: true,
      invoices: found.map((r) => r.id),
      message: `Looks like it pays ${found.length === 1 ? "this invoice" : `these ${found.length} invoices`}: ${list}. A person records the payment.`,
      ...(found.length === 1 ? { href: link.doc("invoices", found[0]!.id) } : {}),
    });
  }),
];

/** Open invoices a remittance pays: by number (also just its digits), or by an equal balance. */
export function matchRemittance(invoices: Receivable[], values: { invoices?: string; amount?: unknown }): Receivable[] {
  const open = invoices.filter((r) => r.balance > 0);
  const digits = (x: string) => x.replace(/\D/g, "");
  const tokens = String(values.invoices ?? "")
    .split(/[\s,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => digits(t).length >= 3);
  const raw = values.amount;
  const amount = typeof raw === "number" ? raw : Number((typeof raw === "string" ? raw : "").replace(/[^\d.-]/g, ""));
  const byNumber = open.filter((r) =>
    tokens.some((t) => r.number.toLowerCase().includes(t) || digits(r.number).endsWith(digits(t))),
  );
  const byAmount =
    raw !== undefined && raw !== "" && Number.isFinite(amount) && amount > 0
      ? open.filter((r) => Math.abs(r.balance - amount) < 1)
      : [];
  return [...new Set([...byNumber, ...byAmount])];
}
