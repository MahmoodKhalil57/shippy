import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { logActivity } from "../collections/shared.ts";
import { IS_MOCK, NotConnectedError } from "../flags.ts";
import {
  FINANCE_ROLES,
  type Source,
  all,
  body,
  docHref,
  egp,
  fail,
  fmtDay,
  idOf,
  type Lang,
  langOf,
  meOf,
  optionLabel,
  money,
  nameOf,
  num,
  str,
  unauthorized,
} from "./insights-shared.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Actual profit & close (case tab /profit): the profit expected when the quotation was approved,
 * against the actual once costs are billed — estimates replaced by actuals, FX differences on
 * customer receipts, claims — and the close checklist. A case closes only when every check is
 * green; Sales never receives any of it.
 *
 * Live records drive everything they can (invoices, receipts, e-invoice status, POs, supplier
 * bills and credit notes, deliveries, the case's shared charges). What a real deployment reads
 * from Odoo's accounting but the demo has no record for — the quote-time cost sheet of the
 * settled cases and the supplier bills booked before go-live — is in COSTING below.
 */

/* ---------------------------------------------------------------- the quote-time cost sheets */

/** Text of a cost sheet, in English and Arabic (as a seed's localized fields). */
interface Text {
  en: string;
  ar: string;
}
const tx = (t: Text | undefined, lang: Lang) => (t ? t[lang] : undefined);

interface CostingGoods {
  label: Text;
  supplier: string;
  expected: number;
  actual: number;
  /** What the actual cost is booked on (a stock issue, or a bill from before go-live). */
  bill: Text;
}
interface CostingCharge {
  label: Text;
  expected: number;
  /** Billed amount, when the bill has arrived. */
  actual?: number;
  source: Text;
  note?: Text;
}
interface CostingClaim {
  ref: string;
  title: Text;
  /** Supplier id the claim is against; the credit note settles it. */
  against: string;
  amountEGP: number;
  creditNote: string;
  note: Text;
}
interface Costing {
  /** USD/EGP snapshot on the approved quotation. */
  quoteRate: number;
  goods: CostingGoods[];
  charges: CostingCharge[];
  /** Actual FX of customer receipts recorded without one (bank reference → EGP per USD). */
  receiptRates: Record<string, number>;
  claims: CostingClaim[];
}

export const COSTING: Record<string, Costing> = {
  // Settled story: engine spares to MV Helios Dawn at Suez. Goods come from PO P0402 / bill DM-4980.
  "gs-rfq-0131": {
    quoteRate: 48.6,
    goods: [],
    charges: [
      {
        label: { en: "Road freight Cairo → Suez", ar: "نقل بري القاهرة ← السويس" },
        expected: 4_500,
        actual: 4_200,
        source: { en: "Bill HZ-118", ar: "فاتورة HZ-118" },
      },
      {
        label: { en: "Launch delivery to vessel, Suez anchorage", ar: "تسليم بلنش إلى السفينة، مخطاف السويس" },
        expected: 3_800,
        actual: 6_900,
        source: { en: "Launch invoice SCL-2241", ar: "فاتورة البلنش SCL-2241" },
        note: {
          en: "ETA moved at short notice — launch re-booked with a waiting-time charge, plus boarding-staff overtime",
          ar: "تغيّر موعد الوصول المتوقع في وقت قصير، فأُعيد حجز البلنش مع رسوم انتظار، إضافة إلى ساعات عمل إضافية لفريق الصعود",
        },
      },
      {
        label: { en: "Port agent fee & gate pass", ar: "أتعاب الوكيل الملاحي وتصريح البوابة" },
        expected: 2_000,
        actual: 2_000,
        source: { en: "Agent invoice CLA-7731", ar: "فاتورة الوكيل CLA-7731" },
      },
      {
        label: { en: "Bank transfer charges", ar: "رسوم التحويل البنكي" },
        expected: 350,
        actual: 410,
        source: { en: "Bank statement 12 Nov", ar: "كشف الحساب البنكي 12 نوفمبر" },
      },
    ],
    receiptRates: { "TRX-77120": 48.8 },
    claims: [
      {
        ref: "CLM-0131-1",
        title: { en: "2 safety helmets cracked in the launch transfer", ar: "خوذتا سلامة تشققتا أثناء النقل بالبلنش" },
        against: "S1",
        amountEGP: 1_240,
        creditNote: "CN-DM-031",
        note: {
          en: "Replaced on board from Alexandria stock; Delta Marine Stores accepted the packaging claim.",
          ar: "استُبدلتا على متن السفينة من مخزون الإسكندرية، وقبلت Delta Marine Stores مطالبة التغليف.",
        },
      },
    ],
  },
  // Still delivering: drop 1 of 2 to the DOS Falcon. Bought-in goods come from POs P0416–P0418.
  "gs-rfq-0133": {
    quoteRate: 48.6,
    goods: [
      {
        label: { en: "Rig-support stores from own stock (5 lines)", ar: "مستلزمات دعم المنصة من مخزوننا (5 بنود)" },
        supplier: "Golden Sea stock — Alexandria",
        expected: 470_000,
        actual: 470_000,
        bill: { en: "stock issue SI-0133 at average cost", ar: "صرف مخزني SI-0133 بمتوسط التكلفة" },
      },
    ],
    charges: [
      {
        label: { en: "Supply-boat transfer, drop 1", ar: "نقل بقارب الإمداد، الدفعة 1" },
        expected: 4_500,
        actual: 4_500,
        source: { en: "Boat invoice AQ-5521", ar: "فاتورة القارب AQ-5521" },
      },
      {
        label: { en: "Supply-boat transfer, drop 2", ar: "نقل بقارب الإمداد، الدفعة 2" },
        expected: 4_500,
        source: { en: "Estimate — drop planned 21 Nov", ar: "تقدير، والدفعة مخططة في 21 نوفمبر" },
        note: {
          en: "ETA moved +1 day: standby may be charged",
          ar: "تأخر موعد الوصول المتوقع يومًا: قد تُحتسب رسوم انتظار",
        },
      },
      {
        label: { en: "Bank transfer charges", ar: "رسوم التحويل البنكي" },
        expected: 350,
        source: { en: "Estimate", ar: "تقدير" },
      },
    ],
    receiptRates: {},
    claims: [],
  },
};

/* ---------------------------------------------------------------- response shape */

export type LineState = "Estimate" | "Billed" | "Confirmed" | "Not applicable";
export interface ProfitLine {
  kind: "goods" | "charge" | "claim";
  label: string;
  detail: string;
  expected: number;
  actual?: number;
  state: LineState;
  note?: string;
  href?: string;
}
export interface ProfitFx {
  label: string;
  amount: string;
  quoteRate: number;
  rate: number;
  difference: number;
  realised: boolean;
  href?: string;
}
export interface ProfitClaim {
  ref: string;
  title: string;
  against: string;
  amount: number;
  settled: boolean;
  creditNote: string;
  note: string;
  href?: string;
}
export type CheckAction = "actuals" | "receipt" | "claim";
export interface CloseCheck {
  key: "bills" | "deliveries" | "einvoice" | "paid" | "claims" | "actuals";
  label: string;
  ok: boolean;
  detail: string;
  sources: Source[];
  action?: CheckAction;
  actionLabel?: string;
}
export interface CaseProfit {
  id: string;
  caseId: string;
  customer: string;
  vessel: string;
  stage: string;
  closed: boolean;
  closedAt?: string;
  /** Whether a quote-time cost sheet exists (otherwise expected profit waits for the PO). */
  costed: boolean;
  currency: string;
  quoteRate: number;
  currentRate: number;
  expected: { revenue: number; cost: number; profit: number; margin: number };
  actual: { revenue: number; cost: number; profit: number; margin: number; final: boolean };
  lines: ProfitLine[];
  fx: ProfitFx[];
  fxTotal: number;
  claims: ProfitClaim[];
  checks: CloseCheck[];
  /** Whether the signed-in user may record receipts, credit notes, actuals and close. */
  canAct: boolean;
  canClose: boolean;
  /** The open balance a "Record receipt" would collect. */
  receipt?: { invoice: string; number: string; amount: number; currency: string; rate: number };
}

/* ---------------------------------------------------------------- building it */

/** A case's costing from the accounting: its quote-time cost sheet, pre-go-live bills, receipt rates and claims. */
function costingOf(caseId: string): Costing | undefined {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return COSTING[caseId];
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "Odoo accounting: a case's quote-time cost sheet, the supplier bills booked before go-live, receipt FX and supplier claims",
    );
  }
}

const CLOSED = "Closed — settled";
const MATCHED = ["Matched", "Approved for payment", "Paid"];

const latestRate = (fx: Record<string, unknown>, currency: string, fallback: number) => {
  const rates = ((fx.rates as { currency?: string; egpPerUnit?: number; date?: string }[] | undefined) ?? [])
    .filter((r) => r.currency === currency && r.egpPerUnit)
    .sort((a, b) => str(b.date).localeCompare(str(a.date)));
  return rates[0]?.egpPerUnit ?? fallback;
};

export async function caseProfit(req: PayloadRequest, id: string): Promise<CaseProfit | null> {
  const c = (await req.payload
    .findByID({ collection: "cases" as never, id, depth: 1 })
    .catch(() => null)) as unknown as Doc | null;
  if (!c) return null;
  const lang = langOf(req);
  const o = { locale: lang };
  const role = str(meOf(req)?.role);
  const costing = costingOf(c.id);
  const [invoicesAll, paymentsAll, posAll, billsAll, deliveriesAll, suppliers, fx] = await Promise.all([
    all(req, "invoices", 0),
    all(req, "payments", 0),
    all(req, "purchase-orders", 0),
    all(req, "supplier-bills", 0),
    all(req, "deliveries", 0),
    all(req, "suppliers", 0),
    req.payload.findGlobal({ locale: req.locale, slug: "fx-rates" as never }).catch(() => ({})) as Promise<
      Record<string, unknown>
    >,
  ]);
  const ofCase = (d: Doc) => idOf(d.case) === c.id;
  const supplierNames = new Map(suppliers.map((s) => [s.id, str(s.name)] as const));
  const supplierName = (v: unknown) => supplierNames.get(str(idOf(v))) ?? nameOf(v);
  const invoices = invoicesAll.filter((i) => ofCase(i) && i.status !== "Cancelled");
  const invoiceIds = new Set(invoices.map((i) => i.id));
  const receipts = paymentsAll.filter((p) => p.direction === "in" && invoiceIds.has(str(idOf(p.invoice))));
  const pos = posAll.filter((p) => ofCase(p) && p.status !== "Cancelled");
  const poIds = new Set(pos.map((p) => p.id));
  const bills = billsAll.filter((b) => poIds.has(str(idOf(b.purchaseOrder))) && b.status !== "Credit note");
  const deliveries = deliveriesAll.filter((d) => ofCase(d) && d.status !== "Cancelled");

  const currency = str(invoices[0]?.currency ?? c.currency) || "USD";
  const quoteRate =
    costing?.quoteRate ??
    (num((c.pricing as { fxRateUSD?: number } | undefined)?.fxRateUSD) || latestRate(fx, "USD", 48.6));
  const currentRate = currency === "EGP" ? 1 : latestRate(fx, currency, quoteRate);
  const toEgp = (amount: number, cur: string, rate = quoteRate) => (cur === "EGP" ? amount : amount * rate);

  /* ------------------------------------------------ cost lines */
  const lines: ProfitLine[] = [];
  if (pos.length)
    for (const po of pos) {
      const cur = str(po.currency) || "EGP";
      const total =
        num(po.total) ||
        ((po.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? []).reduce(
          (s, l) => s + num(l.qty) * num(l.unitPrice),
          0,
        );
      const poBills = bills.filter((b) => idOf(b.purchaseOrder) === po.id);
      const billed = poBills.reduce((s, b) => s + toEgp(num(b.amount), str(b.currency) || "EGP"), 0);
      const matched = poBills.length > 0 && poBills.every((b) => MATCHED.includes(str(b.status)));
      lines.push({
        kind: "goods",
        label: m.api_profit_po_line({ supplier: supplierName(po.supplier), number: str(po.number) }, o),
        detail: poBills.length
          ? poBills
              .map((b) =>
                b.holdReason
                  ? m.api_profit_bill_held(
                      {
                        number: str(b.billNumber),
                        status: optionLabel(req, "supplier-bills", "status", b.status),
                        reason: str(b.holdReason),
                      },
                      o,
                    )
                  : m.api_profit_bill(
                      { number: str(b.billNumber), status: optionLabel(req, "supplier-bills", "status", b.status) },
                      o,
                    ),
              )
              .join(" · ")
          : m.api_profit_no_bill_yet({}, o),
        expected: toEgp(total, cur),
        actual: poBills.length ? billed : undefined,
        state: matched ? "Confirmed" : poBills.length ? "Billed" : "Estimate",
        href: docHref("purchase-orders", po.id),
      });
    }
  for (const g of costing?.goods ?? [])
    if (!pos.length || !pos.some((p) => supplierName(p.supplier) === g.supplier))
      lines.push({
        kind: "goods",
        label: `${g.supplier} — ${g.label[lang]}`,
        detail: g.bill[lang].charAt(0).toUpperCase() + g.bill[lang].slice(1),
        expected: g.expected,
        actual: g.actual,
        state: "Confirmed",
      });

  // Shared charges: the case's own (pricing tab), with billed actuals from the cost sheet.
  type Charge = { label?: string; amountEGP?: number; status?: string; actualEGP?: number };
  const own = ((c.pricing as { charges?: Charge[] } | undefined)?.charges ?? []).filter((x) => x.label);
  const sheet = costing?.charges ?? [];
  const charges = own.length
    ? own.map((x) => ({ own: x, sheet: sheet.find((s) => s.label.en === x.label || s.label.ar === x.label) }))
    : sheet.map((s) => ({ own: undefined as Charge | undefined, sheet: s }));
  for (const { own: x, sheet: s } of charges) {
    const expected = num(x?.amountEGP ?? s?.expected);
    const confirmed = x?.status === "Confirmed" && (x.actualEGP !== undefined || !s);
    const na = x?.status === "Not applicable";
    const actual = na ? 0 : (x?.actualEGP ?? s?.actual ?? (confirmed ? expected : undefined));
    lines.push({
      kind: "charge",
      label: str(x?.label ?? tx(s?.label, lang)),
      detail: na
        ? m.api_profit_not_applicable({}, o)
        : (tx(s?.source, lang) ??
          (confirmed ? m.api_profit_confirmed_on_pricing({}, o) : m.api_profit_estimate({}, o))),
      expected,
      actual,
      state: na ? "Not applicable" : confirmed ? "Confirmed" : actual !== undefined ? "Billed" : "Estimate",
      note: tx(s?.note, lang),
    });
  }

  /* ------------------------------------------------ claims */
  const creditNotes = billsAll.filter((b) => b.status === "Credit note");
  const claims: ProfitClaim[] = (costing?.claims ?? []).map((cl) => {
    const cn = creditNotes.find((b) => str(b.creditNote).includes(cl.ref) || str(b.billNumber) === cl.creditNote);
    return {
      ref: cl.ref,
      title: cl.title[lang],
      against: nameOf(cl.against),
      amount: cl.amountEGP,
      settled: Boolean(cn),
      creditNote: cn ? str(cn.billNumber) : cl.creditNote,
      note: cl.note[lang],
      href: cn ? docHref("supplier-bills", cn.id) : undefined,
    };
  });
  for (const cl of claims) cl.against = supplierNames.get(cl.against) ?? cl.against;
  for (const cl of claims)
    lines.push({
      kind: "claim",
      label: m.api_profit_claim_line({ ref: cl.ref, title: cl.title }, o),
      detail: cl.settled
        ? m.api_profit_claim_offset({ creditNote: cl.creditNote }, o)
        : m.api_profit_claim_open({ against: cl.against }, o),
      expected: 0,
      actual: cl.settled ? 0 : cl.amount,
      state: cl.settled ? "Confirmed" : "Billed",
      href: cl.href,
    });

  /* ------------------------------------------------ revenue & FX */
  const invoiced = invoices.reduce((s, i) => s + num(i.amount), 0);
  const revenueAmount = invoiced || num(c.value);
  const fxRows: ProfitFx[] = [];
  let actualRevenue = 0;
  if (currency === "EGP") actualRevenue = revenueAmount;
  else {
    for (const p of receipts) {
      const rate = num(p.fxRate) || costing?.receiptRates[str(p.reference)] || quoteRate;
      const amount = num(p.amount);
      actualRevenue += amount * rate;
      fxRows.push({
        label: p.paidAt
          ? m.api_profit_receipt_on({ reference: str(p.reference), day: fmtDay(new Date(str(p.paidAt)), lang) }, o)
          : m.api_profit_receipt({ reference: str(p.reference) }, o),
        amount: money(str(p.currency) || currency, amount, 0, lang),
        quoteRate,
        rate,
        difference: amount * (rate - quoteRate),
        realised: true,
        href: docHref("payments", p.id),
      });
    }
    const received = receipts.reduce((s, p) => s + num(p.amount), 0);
    const open = Math.max(0, revenueAmount - received);
    if (open > 0) {
      actualRevenue += open * currentRate;
      fxRows.push({
        label: invoiced ? m.api_profit_open_balance_today({}, o) : m.api_profit_not_invoiced_today({}, o),
        amount: money(currency, open, 0, lang),
        quoteRate,
        rate: currentRate,
        difference: open * (currentRate - quoteRate),
        realised: false,
      });
    }
  }
  const fxTotal = fxRows.reduce((s, r) => s + r.difference, 0);

  const expectedRevenue = toEgp(revenueAmount, currency);
  const expectedCost = lines.reduce((s, l) => s + l.expected, 0);
  const actualCost = lines.reduce((s, l) => s + (l.actual ?? l.expected), 0);

  /* ------------------------------------------------ close checklist */
  const checks: CloseCheck[] = [];
  const goods = lines.filter((l) => l.kind === "goods");
  const billsOk = goods.length > 0 && goods.every((l) => l.state === "Confirmed");
  checks.push({
    key: "bills",
    label: m.api_profit_check_bills({}, o),
    ok: billsOk,
    detail: goods.length ? goods.map((l) => `${l.label}: ${l.detail}`).join(" · ") : m.api_profit_no_po_or_bill({}, o),
    sources: [
      ...pos.map((p) => ({
        label: m.api_profit_po({ number: str(p.number) }, o),
        href: docHref("purchase-orders", p.id),
      })),
      ...bills.map((b) => ({
        label: m.api_profit_bill_number({ number: str(b.billNumber) }, o),
        href: docHref("supplier-bills", b.id),
      })),
    ],
  });
  const signed = (d: Doc) => d.status === "Delivered — confirmed" || Boolean(d.confirmedAt && d.confirmedBy);
  checks.push({
    key: "deliveries",
    label: m.api_profit_check_deliveries({}, o),
    ok: deliveries.length > 0 && deliveries.every(signed),
    detail: deliveries.length
      ? deliveries
          .map(
            (d) =>
              `${str(d.number)}: ${
                signed(d)
                  ? str(d.confirmedBy)
                    ? m.api_profit_signed_by({ who: str(d.confirmedBy) }, o)
                    : m.api_profit_signed_by_vessel({}, o)
                  : optionLabel(req, "deliveries", "status", d.status)
              }`,
          )
          .join(" · ")
      : m.api_profit_no_delivery({}, o),
    sources: deliveries.map((d) => ({ label: str(d.number), href: docHref("deliveries", d.id) })),
  });
  const einv = (i: Doc) => str((i.eInvoice as { status?: string } | undefined)?.status) || "Not submitted";
  checks.push({
    key: "einvoice",
    label: m.api_profit_check_einvoice({}, o),
    ok: invoices.length > 0 && invoices.every((i) => einv(i) === "Valid"),
    detail: invoices.length
      ? invoices.map((i) => `${str(i.number)}: ${optionLabel(req, "invoices", "eInvoice.status", einv(i))}`).join(" · ")
      : m.api_profit_no_invoice({}, o),
    sources: invoices.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
  });
  const balance = (i: Doc) => Math.max(0, num(i.balance ?? num(i.amount) - num(i.paid)));
  const unpaid = invoices.filter((i) => balance(i) > 0.005);
  const canAct = FINANCE_ROLES.includes(role);
  checks.push({
    key: "paid",
    label: m.api_profit_check_paid({}, o),
    ok: invoices.length > 0 && unpaid.length === 0,
    detail: invoices.length
      ? unpaid.length
        ? unpaid
            .map((i) => {
              const amount = money(str(i.currency) || currency, balance(i), 0, lang);
              return i.dueDate
                ? m.api_profit_open_due(
                    { number: str(i.number), amount, due: fmtDay(new Date(str(i.dueDate)), lang) },
                    o,
                  )
                : m.api_profit_open({ number: str(i.number), amount }, o);
            })
            .join(" · ")
        : m.api_profit_all_paid({ count: receipts.length }, o)
      : m.api_profit_no_invoice({}, o),
    sources: receipts.map((p) => ({
      label: m.api_profit_receipt({ reference: str(p.reference) }, o),
      href: docHref("payments", p.id),
    })),
    action: canAct && unpaid.length === 1 ? "receipt" : undefined,
    actionLabel: m.api_profit_record_receipt({}, o),
  });
  const openClaims = claims.filter((cl) => !cl.settled);
  checks.push({
    key: "claims",
    label: m.api_profit_check_claims({}, o),
    ok: openClaims.length === 0,
    detail: claims.length
      ? claims
          .map((cl) =>
            cl.settled
              ? m.api_profit_claim_settled_by({ ref: cl.ref, title: cl.title, creditNote: cl.creditNote }, o)
              : m.api_profit_claim_open_with({ ref: cl.ref, title: cl.title, against: cl.against }, o),
          )
          .join(" · ")
      : m.api_profit_no_claims({}, o),
    sources: claims.filter((cl) => cl.href).map((cl) => ({ label: cl.creditNote, href: cl.href! })),
    action: canAct && openClaims.length ? "claim" : undefined,
    actionLabel: m.api_profit_record_credit_note({}, o),
  });
  const chargeLines = lines.filter((l) => l.kind === "charge");
  const pending = chargeLines.filter((l) => l.state === "Estimate" || l.state === "Billed");
  checks.push({
    key: "actuals",
    label: m.api_profit_check_actuals({}, o),
    ok: pending.length === 0,
    detail: pending.length
      ? pending
          .map((l) =>
            l.state === "Billed"
              ? m.api_profit_billed_vs_estimate(
                  { label: l.label, billed: egp(l.actual ?? 0, lang), estimate: egp(l.expected, lang) },
                  o,
                )
              : m.api_profit_still_estimate({ label: l.label, estimate: egp(l.expected, lang) }, o),
          )
          .join(" · ")
      : m.api_profit_all_charges_confirmed({}, o),
    sources: [],
    action: canAct && pending.some((l) => l.state === "Billed") ? "actuals" : undefined,
    actionLabel: m.api_profit_confirm_actuals({}, o),
  });

  const closed = str(c.stage) === CLOSED;
  const ready = checks.every((k) => k.ok);
  const profit = (rev: number, cost: number) => ({
    revenue: rev,
    cost,
    profit: rev - cost,
    margin: rev ? ((rev - cost) / rev) * 100 : 0,
  });
  const receiptInvoice = unpaid.length === 1 ? unpaid[0] : undefined;
  return {
    id: c.id,
    caseId: str(c.caseId),
    customer: nameOf(c.customer),
    vessel: str(c.vessel),
    stage: str(c.stage),
    closed,
    closedAt: str(c.closedAt) || undefined,
    costed: Boolean(costing) || pos.length > 0,
    currency,
    quoteRate,
    currentRate,
    expected: profit(expectedRevenue, expectedCost),
    actual: { ...profit(actualRevenue, actualCost), final: ready },
    lines,
    fx: fxRows,
    fxTotal,
    claims,
    checks,
    canAct,
    canClose: canAct && ready && !closed,
    receipt: receiptInvoice
      ? {
          invoice: receiptInvoice.id,
          number: str(receiptInvoice.number),
          amount: balance(receiptInvoice),
          currency: str(receiptInvoice.currency) || currency,
          rate: currentRate,
        }
      : undefined,
  };
}

/* ---------------------------------------------------------------- endpoints */

/** Loads the case's profit for a user allowed to see it, or the error response. */
export async function guarded(req: PayloadRequest, act = false): Promise<CaseProfit | Response> {
  const me = meOf(req);
  const o = { locale: langOf(req) };
  if (!me) return unauthorized(o.locale);
  if (str(me.role) === "sales") return fail(403, m.api_profit_hidden_from_sales({}, o));
  if (act && !FINANCE_ROLES.includes(str(me.role))) return fail(403, m.api_profit_finance_only({}, o));
  const p = await caseProfit(req, str(req.routeParams?.id));
  return p ?? fail(404, m.api_profit_case_not_found({}, o));
}

const respond = async (req: PayloadRequest, id: string) => Response.json(await caseProfit(req, id));

export const profitEndpoints: Endpoint[] = [
  {
    // GET /api/case-profit/:id — expected vs actual profit, FX, claims and the close checklist.
    path: "/case-profit/:id",
    method: "get",
    handler: async (req) => {
      const p = await guarded(req);
      return p instanceof Response ? p : Response.json(p);
    },
  },
  {
    // POST /api/case-profit/:id/actuals — billed actuals replace the estimates on the case's shared charges.
    path: "/case-profit/:id/actuals",
    method: "post",
    handler: async (req) => {
      const p = await guarded(req, true);
      if (p instanceof Response) return p;
      const c = (await req.payload.findByID({
        locale: req.locale,
        collection: "cases" as never,
        id: p.id,
        depth: 0,
      })) as unknown as Doc;
      const charges = p.lines
        .filter((l) => l.kind === "charge")
        .map((l) => ({
          label: l.label,
          amountEGP: l.expected,
          status: l.state === "Not applicable" ? "Not applicable" : l.actual !== undefined ? "Confirmed" : "Estimate",
          ...(l.actual !== undefined ? { actualEGP: l.actual } : {}),
        }));
      const replaced = p.lines.filter((l) => l.kind === "charge" && l.state === "Billed");
      await req.payload.update({
        collection: "cases" as never,
        id: p.id,
        data: { pricing: { ...(c.pricing as object | undefined), charges } } as never,
        req,
      });
      await logActivity(req, {
        case: p.id,
        text: m.api_profit_actuals_confirmed(
          {
            list: replaced
              .map((l) => `${l.label} ${egp(l.expected, langOf(req))} → ${egp(l.actual ?? 0, langOf(req))}`)
              .join(langOf(req) === "ar" ? "؛ " : "; "),
          },
          { locale: langOf(req) },
        ),
        entity: `cases/${p.id}`,
      });
      return respond(req, p.id);
    },
  },
  {
    // POST /api/case-profit/:id/receipt { reference? } — the customer's balance arrived (recorded after the bank movement).
    path: "/case-profit/:id/receipt",
    method: "post",
    handler: async (req) => {
      const p = await guarded(req, true);
      if (p instanceof Response) return p;
      if (!p.receipt) return fail(400, m.api_profit_no_single_balance({}, { locale: langOf(req) }));
      const input = await body(req);
      let reference = str(input.reference);
      if (!reference) {
        if (IS_MOCK) {
          // TODO implement mock only logic to simulate third party connections
          // The simulated bank movement's reference.
          reference = "TRX-77984";
        } else {
          // TODO implement actual prod third party connections
          throw new NotConnectedError("the bank feed: the reference of the customer's incoming transfer");
        }
      }
      await req.payload.create({
        collection: "payments" as never,
        data: {
          direction: "in",
          reference,
          paidAt: new Date().toISOString(),
          amount: p.receipt.amount,
          currency: p.receipt.currency,
          fxRate: p.receipt.currency === "EGP" ? undefined : p.receipt.rate,
          invoice: p.receipt.invoice,
          kind: "Balance",
          status: "Recorded",
        } as never,
        req,
      });
      return respond(req, p.id);
    },
  },
  {
    // POST /api/case-profit/:id/claims/:ref — the supplier's credit note settles the claim.
    path: "/case-profit/:id/claims/:ref",
    method: "post",
    handler: async (req) => {
      const p = await guarded(req, true);
      if (p instanceof Response) return p;
      const ref = str(req.routeParams?.ref);
      const claim = costingOf(p.id)?.claims.find((cl) => cl.ref === ref);
      const o = { locale: langOf(req) };
      if (!claim) return fail(404, m.api_profit_claim_not_found({}, o));
      if (p.claims.find((cl) => cl.ref === ref)?.settled) return respond(req, p.id);
      await req.payload.create({
        collection: "supplier-bills" as never,
        data: {
          billNumber: claim.creditNote,
          supplier: claim.against,
          amount: claim.amountEGP,
          currency: "EGP",
          status: "Credit note",
          creditNote: `${claim.ref} · ${claim.title[o.locale]} (${p.caseId})`,
        } as never,
        req,
      });
      await logActivity(req, {
        case: p.id,
        text: m.api_profit_claim_settled_activity(
          { ref: claim.ref, creditNote: claim.creditNote, amount: egp(claim.amountEGP, o.locale) },
          o,
        ),
        entity: `cases/${p.id}`,
      });
      return respond(req, p.id);
    },
  },
  {
    // POST /api/case-profit/:id/close — only when every check is green.
    path: "/case-profit/:id/close",
    method: "post",
    handler: async (req) => {
      const p = await guarded(req, true);
      if (p instanceof Response) return p;
      if (p.closed) return respond(req, p.id);
      const o = { locale: langOf(req) };
      const open = p.checks.filter((k) => !k.ok);
      if (open.length)
        return fail(
          400,
          m.api_profit_cant_close(
            { checks: open.map((k) => k.label.toLowerCase()).join(o.locale === "ar" ? "، " : ", ") },
            o,
          ),
        );
      await req.payload.update({
        collection: "cases" as never,
        id: p.id,
        data: {
          stage: CLOSED,
          tone: "ok",
          wait: null,
          nextAction: m.api_profit_none_case_closed({}, o),
          blocker: "",
          closedAt: new Date().toISOString(),
        } as never,
        req,
      });
      await logActivity(req, {
        case: p.id,
        text: m.api_profit_case_closed_activity(
          {
            actual: egp(p.actual.profit, o.locale),
            margin: p.actual.margin.toFixed(1),
            expected: egp(p.expected.profit, o.locale),
          },
          o,
        ),
        entity: `cases/${p.id}`,
      });
      return respond(req, p.id);
    },
  },
];
