import type { Endpoint, PayloadRequest } from "payload";
import { payableOf } from "../collections/fulfilment.ts";
import { idOf, related } from "../collections/shared.ts";
import { withdrawal } from "./commercial.ts";
import { IS_MOCK, NotConnectedError } from "../flags.ts";
import { forward } from "./forward.ts";
import { cash, collectionDraftFor, operationsEndpoints } from "./operations.ts";
import * as link from "../links.ts";
import { m } from "../i18n/paraglide/messages.js";
import { type Lang, intlLocale, langOf } from "./insights-shared.ts";

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
export type CashPayables = Pick<Cash, "canFinance" | "approvals" | "bankChanges">;

const money = (n: number, cur = "USD", lang: Lang = "en") => {
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString(intlLocale(lang, "en-US"), { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
};
const DAY = {
  en: new Intl.DateTimeFormat(intlLocale("en"), { day: "2-digit", month: "short", timeZone: "UTC" }),
  ar: new Intl.DateTimeFormat(intlLocale("ar"), { day: "2-digit", month: "short", timeZone: "UTC" }),
};
const day = (iso?: string | null, lang: Lang = "en") =>
  iso && !Number.isNaN(new Date(iso).getTime()) ? DAY[lang].format(new Date(iso)) : "—";
const loc = (req: PayloadRequest) => ({ locale: langOf(req) });

const fail = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });

async function input(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

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

const read = (path: string, run: (req: PayloadRequest, d: Cash) => Promise<Response>): Endpoint => ({
  path: `/cash/${path}`,
  method: "get",
  handler: async (req: PayloadRequest) => {
    const d = await load(req);
    return d instanceof Response ? d : run(req, d);
  },
});

const action = (
  path: string,
  run: (req: PayloadRequest, d: Cash, b: Record<string, unknown>) => Promise<Response>,
): Endpoint => ({
  path: `/cash/${path}`,
  method: "post",
  handler: async (req: PayloadRequest) => {
    if (!req.user) return fail(m.api_insights_shared_not_allowed({}, loc(req)), 401);
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
  read("payables", async (req, d) =>
    d.canSeePayables
      ? Response.json({
          canFinance: d.canFinance,
          approvals: d.approvals,
          bankChanges: d.bankChanges,
        } satisfies CashPayables)
      : fail(m.api_cash_payables_hidden_from_sales({}, loc(req)), 403),
  ),
  action("reminder", async (req, d, b) => {
    const o = loc(req);
    const invoice = d.receivables.find((r) => r.id === s(b.invoice));
    if (!invoice) return fail(m.api_cash_invoice_not_found({}, o), 404);
    const x = await draft(req, invoice.id);
    if (!x) return fail(m.api_cash_invoice_not_found({}, o), 404);
    const text = s(b.body).trim() || x.body;
    const internal = x.mode === "internal";
    if (!internal) {
      if (IS_MOCK) {
      } else {
        throw new NotConnectedError("emailing the collection reminder to the customer's accounts contact (mailbox)");
      }
    }
    await create(req, "tasks", {
      title: x.title,
      type: internal ? "Internal reminder" : "Customer follow-up",
      channel: internal ? "Internal" : "Email",
      due: new Date().toISOString(),
      case: invoice.case ?? undefined,
      customer: invoice.customer,
      who: internal ? m.api_cash_account_owner({}, o) : x.to,
      goal: m.api_cash_collect_goal(
        { amount: money(invoice.balance, invoice.currency, o.locale), number: invoice.number },
        o,
      ),
      script: internal ? text : `${x.subject}\n\n${text}`,
      internalOnly: internal,
      owner: userId(req),
      createdByRule: "Collection reminder",
      stopCondition: "Payment received",
      ...(internal ? {} : { status: "Done", outcome: { result: "Sent", note: m.api_cash_reminder_sent_note({}, o) } }),
    });
    return Response.json({ ok: true });
  }),
  action("decide", async (req, d, b) => {
    const o = loc(req);
    const id = s(b.approval);
    const bank = d.bankChanges.find((x) => x.id === id);
    const item = bank ?? d.approvals.find((x) => x.id === id);
    if (!item) return fail(m.api_cash_approval_not_found({}, o), 404);
    if (!item.canDecide) return fail(m.api_cash_cant_decide({}, o), 403);
    const decision = s(b.decision) === "Reject" ? "Reject" : "Approve";
    const note = s(b.reason).trim();
    if (decision === "Reject" && !note) return fail(m.api_cash_give_reject_reason({}, o));
    if (bank && decision === "Approve" && b.callBack !== true) return fail(m.api_cash_call_back_first({}, o));
    const reason = bank && b.callBack === true ? m.api_cash_call_back_done({ note }, o).trim() : note;
    const current = (await req.payload.findByID({
      locale: req.locale,
      collection: "approvals" as never,
      id,
      depth: 0,
    })) as {
      decisions?: Record<string, unknown>[];
    };
    await update(req, "approvals", id, {
      decisions: [...(current.decisions ?? []), { decision, reason }],
    });
    return Response.json({ ok: true, undo: await withdrawal(req, id) });
  }),
  action("apply-bank", async (req, d, b) => {
    const o = loc(req);
    const bank = d.bankChanges.find((x) => x.id === s(b.approval));
    if (!bank?.request) return fail(m.api_cash_bank_change_not_found({}, o), 404);
    if (!d.canFinance) return fail(m.api_cash_finance_applies_bank({}, o), 403);
    if (bank.status !== "Approved" || bank.applied) return fail(m.api_cash_two_approvers_first({}, o));
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
  action("record-payment", async (req, d, b) => {
    const o = loc(req);
    const a = d.approvals.find((x) => x.id === s(b.approval));
    if (!a?.po) return fail(m.api_cash_approval_not_found({}, o), 404);
    if (!d.canFinance) return fail(m.api_cash_finance_records_payments({}, o), 403);
    if (a.status !== "Approved") return fail(m.api_cash_payment_not_approved({}, o));
    const reference = s(b.reference).trim();
    if (!reference) return fail(m.api_cash_give_bank_reference({}, o));
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
  action("request-approval", async (req, d, b) => {
    const o = loc(req);
    if (!d.canFinance) return fail(m.api_cash_finance_requests_approvals({}, o), 403);
    const po = (await req.payload
      .findByID({ collection: "purchase-orders" as never, id: s(b.payable), depth: 0, req } as never)
      .catch(() => null)) as Record<string, unknown> | null;
    const docs = {
      bills: await all(req, "supplier-bills"),
      payments: await all(req, "payments", { direction: { equals: "out" } }),
      approvals: await all(req, "approvals"),
    };
    const p = po ? payableOf(po, docs) : null;
    if (!po || !p) return fail(m.api_cash_payable_not_found({}, o), 404);
    if (p.stage === "Bill on hold") return fail(m.api_cash_bill_on_hold({ number: s(po.number) }, o));
    if (p.depositApproval || p.paymentApproval) return fail(m.api_cash_approval_in_progress({}, o));
    const supplier = await related(req, "suppliers", po.supplier);
    const supplierName = s(supplier?.name);
    const number = s(po.number);
    await create(req, "approvals", {
      title: m.api_cash_pay_title(
        { supplier: supplierName, amount: money(p.balance, p.currency, o.locale), number },
        o,
      ),
      type: "Supplier payment",
      case: idOf(po.case),
      detail: p.bill
        ? m.api_cash_pay_detail_matched({ number, bill: p.bill.number, due: day(p.due, o.locale) }, o)
        : m.api_cash_pay_detail({ number, due: day(p.due, o.locale) }, o),
      approvers: ["kb", "mh"],
      subject: { relationTo: "purchase-orders", value: s(po.id) },
    });
    for (const user of ["kb", "mh"])
      await create(req, "notifications", {
        user,
        title: m.api_cash_approve_payment_title({ supplier: supplierName }, o),
        detail: `${money(p.balance, p.currency, o.locale)} · ${number}`,
        kind: "Payment",
        href: "/cash",
      }).catch(() => null);
    return Response.json({ ok: true });
  }),
  action("match", async (req, d, b) => {
    const o = loc(req);
    const found = matchRemittance(d.receivables, { invoices: s(b.invoices), amount: b.amount });
    if (!found.length) return fail(m.api_cash_no_remittance_match({}, o));
    const list = found
      .map((r) =>
        m.api_cash_match_item(
          { number: r.number, customer: r.customerName, amount: money(r.balance, r.currency, o.locale) },
          o,
        ),
      )
      .join(m.api_cash_list_separator({}, o));
    return Response.json({
      ok: true,
      invoices: found.map((r) => r.id),
      message: m.api_cash_match_message({ count: found.length, list }, o),
      ...(found.length === 1 ? { href: link.doc("invoices", found[0]!.id) } : {}),
    });
  }),
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
  {
    path: "/cash/payment",
    method: "post",
    handler: async (req: PayloadRequest) => {
      const o = loc(req);
      if (!req.user) return fail(m.api_insights_shared_not_allowed({}, o), 401);
      const b = await input(req);
      const inv = (await req.payload
        .findByID({ collection: "invoices" as never, id: s(b.invoice), depth: 0, req, overrideAccess: false } as never)
        .catch(() => null)) as { id: string; number: string; currency: string; balance: number } | null;
      if (!inv) return fail(m.api_cash_invoice_not_found({}, o), 404);
      const amount = Number(b.amount);
      if (!(amount > 0)) return fail(m.api_cash_enter_amount({}, o));
      if (Math.round(amount * 100) > Math.round(inv.balance * 100))
        return fail(
          m.api_cash_more_than_balance({ number: inv.number, balance: money(inv.balance, inv.currency, o.locale) }, o),
        );
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
        message: left
          ? m.api_cash_allocated_balance(
              {
                amount: money(amount, inv.currency, o.locale),
                number: inv.number,
                balance: money(left, inv.currency, o.locale),
              },
              o,
            )
          : m.api_cash_allocated_paid({ amount: money(amount, inv.currency, o.locale), number: inv.number }, o),
      });
    },
  },
];

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
