import type { Endpoint, PayloadRequest } from "payload";
import { payableOf } from "../collections/fulfilment.ts";
import { idOf, related } from "../collections/shared.ts";
import { withdrawal } from "./commercial.ts";
import { forward } from "./forward.ts";
import { cash, collectionDraftFor, operationsEndpoints } from "./operations.ts";
import * as link from "../links.ts";

/**
 * Receivables & payables (/cash, src/pages/cash.ts) beyond GET /api/operations/cash:
 *
 * - GET  /api/cash/payables — payment approvals and bank-detail changes; refused (403) for Sales.
 *   What we owe on each supplier PO is the PO's own `payable` field (../collections/fulfilment.ts).
 * - POST /api/cash/decide | apply-bank | record-payment | request-approval | match — what a person
 *   does on the page; reminder | einvoice | payment — an invoice's own actions, wherever invoices
 *   show (../collections/finance.ts, which drafts the reminder). Each re-checks who may do what.
 *   The system records payments after the bank movement — it never pays. `decide` answers with
 *   `undo` (withdrawing the decision,
 *   POST /api/commercial/approvals/:id/withdraw); sending a reminder, applying bank details and
 *   recording a payment can't be undone.
 */

/** An open invoice, as the forecast, a remittance match and a reminder read it. */
export interface Receivable {
  id: string;
  number: string;
  case: string | null;
  customer: string;
  customerName: string;
  currency: string;
  balance: number;
  dueDate: string;
  daysOverdue: number;
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
  receivables: Receivable[];
  weeks: string[];
  canSeePayables: boolean;
  canFinance: boolean;
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
export type CashPayables = Pick<Cash, "canFinance" | "approvals" | "bankChanges">;

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

const all = async (req: PayloadRequest, collection: string, where?: Record<string, unknown>) =>
  (await req.payload.find({ collection: collection as never, where: where as never, depth: 0, limit: 0, req }))
    .docs as unknown as Record<string, unknown>[];
const create = (req: PayloadRequest, collection: string, data: Record<string, unknown>) =>
  req.payload.create({ collection: collection as never, data: data as never, req });
const update = (req: PayloadRequest, collection: string, id: string, data: Record<string, unknown>) =>
  req.payload.update({ collection: collection as never, id, data: data as never, req });

export const cashEndpoints: Endpoint[] = [
  // Payables, approvals and bank changes: never for Sales.
  read("payables", async (_req, d) =>
    d.canSeePayables
      ? Response.json({
          canFinance: d.canFinance,
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
    // `undo`: the approver can take it back until the payment is recorded or the details applied.
    return Response.json({ ok: true, undo: await withdrawal(req, id) });
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
  // What's owed on a PO is the PO's own `payable` (../collections/fulfilment.ts).
  action("request-approval", async (req, d, b) => {
    if (!d.canFinance) return fail("Management and finance request payment approvals.", 403);
    const po = (await req.payload
      .findByID({ collection: "purchase-orders" as never, id: s(b.payable), depth: 0, req } as never)
      .catch(() => null)) as Record<string, unknown> | null;
    const docs = {
      bills: await all(req, "supplier-bills"),
      payments: await all(req, "payments", { direction: { equals: "out" } }),
      approvals: await all(req, "approvals"),
    };
    const p = po ? payableOf(po, docs) : null;
    if (!po || !p) return fail("Payable not found.", 404);
    if (p.stage === "Bill on hold" || p.depositApproval || p.paymentApproval)
      return fail("An approval is already in progress for this payable.");
    const supplier = await related(req, "suppliers", po.supplier);
    const supplierName = s(supplier?.name);
    const number = s(po.number);
    await create(req, "approvals", {
      title: `Pay ${supplierName} ${money(p.balance, p.currency)} — ${number}`,
      type: "Supplier payment",
      case: idOf(po.case),
      detail: `PO ${number}${p.bill ? ` · bill ${p.bill.number} matched (PO = receipt = bill)` : ""} · due ${day(p.due)} · bank details unchanged.`,
      approvers: ["kb", "mh"],
      subject: { relationTo: "purchase-orders", value: s(po.id) },
    });
    for (const user of ["kb", "mh"])
      await create(req, "notifications", {
        user,
        title: `Approve payment to ${supplierName}`,
        detail: `${money(p.balance, p.currency)} · ${number}`,
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
  // An invoice's own actions (../collections/finance.ts), wherever invoices show.
  // Sign & submit (or refresh) its e-invoice: a submission the tax authority accepts is checked
  // again at once, so the person sees the final status.
  {
    path: "/cash/einvoice",
    method: "post",
    handler: async (req: PayloadRequest) => {
      const b = await input(req);
      const run = () =>
        forward<{ result: string; message: string }>(req, operationsEndpoints, "/operations/einvoice", {
          body: { invoice: b.invoice, taxId: b.taxId || undefined },
        });
      const r = await run();
      if (r instanceof Response || r.result !== "submitted") return r instanceof Response ? r : Response.json(r);
      const v = await forward<{ message: string }>(req, operationsEndpoints, "/operations/einvoice", {
        body: { invoice: b.invoice },
      });
      return v instanceof Response ? v : Response.json({ message: v.message });
    },
  },
  // A customer payment, recorded after the money is in the bank (the system never moves money).
  {
    path: "/cash/payment",
    method: "post",
    handler: async (req: PayloadRequest) => {
      if (!req.user) return fail("You are not allowed to perform this action.", 401);
      const b = await input(req);
      const inv = (await req.payload
        .findByID({ collection: "invoices" as never, id: s(b.invoice), depth: 0, req, overrideAccess: false } as never)
        .catch(() => null)) as { id: string; number: string; currency: string; balance: number } | null;
      if (!inv) return fail("Invoice not found.", 404);
      const amount = Number(b.amount);
      if (!(amount > 0)) return fail("Enter the amount received.");
      try {
        await req.payload.create({
          req,
          overrideAccess: false,
          collection: "payments" as never,
          data: {
            direction: "in",
            reference: s(b.reference) || "TRX-",
            paidAt: new Date().toISOString(),
            amount,
            currency: inv.currency,
            invoice: inv.id,
            kind: amount < inv.balance ? "Installment" : "Balance",
            status: "Recorded",
          } as never,
        });
      } catch (e) {
        return fail((e as Error).message, (e as { status?: number }).status === 403 ? 403 : 400);
      }
      const left = Math.max(0, inv.balance - amount);
      return Response.json({
        message: `${money(amount, inv.currency)} allocated to ${inv.number}${left ? ` — balance ${money(left, inv.currency)}` : " — paid in full"}.`,
      });
    },
  },
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
