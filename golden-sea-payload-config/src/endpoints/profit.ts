import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { logActivity } from "../collections/shared.ts";
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
  meOf,
  money,
  nameOf,
  num,
  str,
  unauthorized,
} from "./insights-shared.ts";

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

interface CostingGoods {
  label: string;
  supplier: string;
  expected: number;
  actual: number;
  /** What the actual cost is booked on (a stock issue, or a bill from before go-live). */
  bill: string;
}
interface CostingCharge {
  label: string;
  expected: number;
  /** Billed amount, when the bill has arrived. */
  actual?: number;
  source: string;
  note?: string;
}
interface CostingClaim {
  ref: string;
  title: string;
  /** Supplier id the claim is against; the credit note settles it. */
  against: string;
  amountEGP: number;
  creditNote: string;
  note: string;
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
      { label: "Road freight Cairo → Suez", expected: 4_500, actual: 4_200, source: "Bill HZ-118" },
      {
        label: "Launch delivery to vessel, Suez anchorage",
        expected: 3_800,
        actual: 6_900,
        source: "Launch invoice SCL-2241",
        note: "ETA moved at short notice — launch re-booked with a waiting-time charge, plus boarding-staff overtime",
      },
      { label: "Port agent fee & gate pass", expected: 2_000, actual: 2_000, source: "Agent invoice CLA-7731" },
      { label: "Bank transfer charges", expected: 350, actual: 410, source: "Bank statement 12 Nov" },
    ],
    receiptRates: { "TRX-77120": 48.8 },
    claims: [
      {
        ref: "CLM-0131-1",
        title: "2 safety helmets cracked in the launch transfer",
        against: "S1",
        amountEGP: 1_240,
        creditNote: "CN-DM-031",
        note: "Replaced on board from Alexandria stock; Delta Marine Stores accepted the packaging claim.",
      },
    ],
  },
  // Still delivering: drop 1 of 2 to the DOS Falcon. Bought-in goods come from POs P0416–P0418.
  "gs-rfq-0133": {
    quoteRate: 48.6,
    goods: [
      {
        label: "Rig-support stores from own stock (5 lines)",
        supplier: "Golden Sea stock — Alexandria",
        expected: 470_000,
        actual: 470_000,
        bill: "stock issue SI-0133 at average cost",
      },
    ],
    charges: [
      { label: "Supply-boat transfer, drop 1", expected: 4_500, actual: 4_500, source: "Boat invoice AQ-5521" },
      {
        label: "Supply-boat transfer, drop 2",
        expected: 4_500,
        source: "Estimate — drop planned 21 Nov",
        note: "ETA moved +1 day: standby may be charged",
      },
      { label: "Bank transfer charges", expected: 350, source: "Estimate" },
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
  const role = str(meOf(req)?.role);
  const costing = COSTING[c.id];
  const [invoicesAll, paymentsAll, posAll, billsAll, deliveriesAll, suppliers, fx] = await Promise.all([
    all(req, "invoices", 0),
    all(req, "payments", 0),
    all(req, "purchase-orders", 0),
    all(req, "supplier-bills", 0),
    all(req, "deliveries", 0),
    all(req, "suppliers", 0),
    req.payload.findGlobal({ slug: "fx-rates" as never }).catch(() => ({})) as Promise<Record<string, unknown>>,
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
        label: `${supplierName(po.supplier)} — PO ${str(po.number)}`,
        detail: poBills.length
          ? poBills
              .map((b) => `Bill ${str(b.billNumber)} (${str(b.status)}${b.holdReason ? `: ${str(b.holdReason)}` : ""})`)
              .join(" · ")
          : "No supplier bill yet",
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
        label: `${g.supplier} — ${g.label}`,
        detail: g.bill.charAt(0).toUpperCase() + g.bill.slice(1),
        expected: g.expected,
        actual: g.actual,
        state: "Confirmed",
      });

  // Shared charges: the case's own (pricing tab), with billed actuals from the cost sheet.
  type Charge = { label?: string; amountEGP?: number; status?: string; actualEGP?: number };
  const own = ((c.pricing as { charges?: Charge[] } | undefined)?.charges ?? []).filter((x) => x.label);
  const sheet = costing?.charges ?? [];
  const charges = own.length
    ? own.map((x) => ({ own: x, sheet: sheet.find((s) => s.label === x.label) }))
    : sheet.map((s) => ({ own: undefined as Charge | undefined, sheet: s }));
  for (const { own: o, sheet: s } of charges) {
    const expected = num(o?.amountEGP ?? s?.expected);
    const confirmed = o?.status === "Confirmed" && (o.actualEGP !== undefined || !s);
    const na = o?.status === "Not applicable";
    const actual = na ? 0 : (o?.actualEGP ?? s?.actual ?? (confirmed ? expected : undefined));
    lines.push({
      kind: "charge",
      label: str(o?.label ?? s?.label),
      detail: na ? "Not applicable" : (s?.source ?? (confirmed ? "Confirmed on the pricing tab" : "Estimate")),
      expected,
      actual,
      state: na ? "Not applicable" : confirmed ? "Confirmed" : actual !== undefined ? "Billed" : "Estimate",
      note: s?.note,
    });
  }

  /* ------------------------------------------------ claims */
  const creditNotes = billsAll.filter((b) => b.status === "Credit note");
  const claims: ProfitClaim[] = (costing?.claims ?? []).map((cl) => {
    const cn = creditNotes.find((b) => str(b.creditNote).includes(cl.ref) || str(b.billNumber) === cl.creditNote);
    return {
      ref: cl.ref,
      title: cl.title,
      against: nameOf(cl.against),
      amount: cl.amountEGP,
      settled: Boolean(cn),
      creditNote: cn ? str(cn.billNumber) : cl.creditNote,
      note: cl.note,
      href: cn ? docHref("supplier-bills", cn.id) : undefined,
    };
  });
  for (const cl of claims) cl.against = supplierNames.get(cl.against) ?? cl.against;
  for (const cl of claims)
    lines.push({
      kind: "claim",
      label: `Claim ${cl.ref}: ${cl.title}`,
      detail: cl.settled
        ? `Replacement cost offset by credit note ${cl.creditNote}`
        : `Open — claimed from ${cl.against}`,
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
        label: `Receipt ${str(p.reference)}${p.paidAt ? ` · ${fmtDay(new Date(str(p.paidAt)))}` : ""}`,
        amount: money(str(p.currency) || currency, amount),
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
        label: invoiced ? "Open balance, at today's rate" : "Not yet invoiced, at today's rate",
        amount: money(currency, open),
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
    label: "Supplier bills matched to POs and receipts",
    ok: billsOk,
    detail: goods.length
      ? goods.map((l) => `${l.label}: ${l.detail}`).join(" · ")
      : "No supplier PO or bill recorded for this case yet.",
    sources: [
      ...pos.map((p) => ({ label: `PO ${str(p.number)}`, href: docHref("purchase-orders", p.id) })),
      ...bills.map((b) => ({ label: `Bill ${str(b.billNumber)}`, href: docHref("supplier-bills", b.id) })),
    ],
  });
  const signed = (d: Doc) => d.status === "Delivered — confirmed" || Boolean(d.confirmedAt && d.confirmedBy);
  checks.push({
    key: "deliveries",
    label: "Deliveries signed on board",
    ok: deliveries.length > 0 && deliveries.every(signed),
    detail: deliveries.length
      ? deliveries
          .map(
            (d) => `${str(d.number)}: ${signed(d) ? `signed by ${str(d.confirmedBy) || "the vessel"}` : str(d.status)}`,
          )
          .join(" · ")
      : "No delivery recorded yet.",
    sources: deliveries.map((d) => ({ label: str(d.number), href: docHref("deliveries", d.id) })),
  });
  const einv = (i: Doc) => str((i.eInvoice as { status?: string } | undefined)?.status) || "Not submitted";
  checks.push({
    key: "einvoice",
    label: "Invoices accepted by the tax authority (ETA e-invoice)",
    ok: invoices.length > 0 && invoices.every((i) => einv(i) === "Valid"),
    detail: invoices.length
      ? invoices.map((i) => `${str(i.number)}: ${einv(i)}`).join(" · ")
      : "No customer invoice issued yet.",
    sources: invoices.map((i) => ({ label: str(i.number), href: docHref("invoices", i.id) })),
  });
  const balance = (i: Doc) => Math.max(0, num(i.balance ?? num(i.amount) - num(i.paid)));
  const unpaid = invoices.filter((i) => balance(i) > 0.005);
  const canAct = FINANCE_ROLES.includes(role);
  checks.push({
    key: "paid",
    label: "Customer invoices paid in full",
    ok: invoices.length > 0 && unpaid.length === 0,
    detail: invoices.length
      ? unpaid.length
        ? unpaid
            .map(
              (i) =>
                `${str(i.number)}: ${money(str(i.currency) || currency, balance(i))} open${i.dueDate ? `, due ${fmtDay(new Date(str(i.dueDate)))}` : ""}`,
            )
            .join(" · ")
        : `All paid (${receipts.length} receipt${receipts.length === 1 ? "" : "s"} reconciled).`
      : "No customer invoice issued yet.",
    sources: receipts.map((p) => ({ label: `Receipt ${str(p.reference)}`, href: docHref("payments", p.id) })),
    action: canAct && unpaid.length === 1 ? "receipt" : undefined,
    actionLabel: "Record receipt",
  });
  const openClaims = claims.filter((cl) => !cl.settled);
  checks.push({
    key: "claims",
    label: "Claims settled",
    ok: openClaims.length === 0,
    detail: claims.length
      ? claims
          .map(
            (cl) =>
              `${cl.ref} (${cl.title}): ${cl.settled ? `settled by credit note ${cl.creditNote}` : `open with ${cl.against}`}`,
          )
          .join(" · ")
      : "No claims on this case.",
    sources: claims.filter((cl) => cl.href).map((cl) => ({ label: cl.creditNote, href: cl.href! })),
    action: canAct && openClaims.length ? "claim" : undefined,
    actionLabel: "Record credit note",
  });
  const chargeLines = lines.filter((l) => l.kind === "charge");
  const pending = chargeLines.filter((l) => l.state === "Estimate" || l.state === "Billed");
  checks.push({
    key: "actuals",
    label: "Estimated costs replaced by actuals",
    ok: pending.length === 0,
    detail: pending.length
      ? pending
          .map((l) =>
            l.state === "Billed"
              ? `${l.label}: billed ${egp(l.actual ?? 0)} vs estimate ${egp(l.expected)} — confirm`
              : `${l.label}: still an estimate (${egp(l.expected)})`,
          )
          .join(" · ")
      : "Every shared charge is confirmed against its bill.",
    sources: [],
    action: canAct && pending.some((l) => l.state === "Billed") ? "actuals" : undefined,
    actionLabel: "Confirm actuals",
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
  if (!me) return unauthorized();
  if (str(me.role) === "sales") return fail(403, "Profit, costs and margins are not visible to Sales.");
  if (act && !FINANCE_ROLES.includes(str(me.role)))
    return fail(403, "Only management and finance record receipts, credit notes and closures.");
  const p = await caseProfit(req, str(req.routeParams?.id));
  return p ?? fail(404, "Case not found.");
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
      const c = (await req.payload.findByID({ collection: "cases" as never, id: p.id, depth: 0 })) as unknown as Doc;
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
        text: `Actual costs confirmed: ${replaced.map((l) => `${l.label} ${egp(l.expected)} → ${egp(l.actual ?? 0)}`).join("; ")}.`,
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
      if (!p.receipt) return fail(400, "There is no single open invoice balance to record.");
      const input = await body(req);
      await req.payload.create({
        collection: "payments" as never,
        data: {
          direction: "in",
          reference: str(input.reference) || "TRX-77984",
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
      const claim = COSTING[p.id]?.claims.find((cl) => cl.ref === ref);
      if (!claim) return fail(404, "Claim not found.");
      if (p.claims.find((cl) => cl.ref === ref)?.settled) return respond(req, p.id);
      await req.payload.create({
        collection: "supplier-bills" as never,
        data: {
          billNumber: claim.creditNote,
          supplier: claim.against,
          amount: claim.amountEGP,
          currency: "EGP",
          status: "Credit note",
          creditNote: `${claim.ref} · ${claim.title} (${p.caseId})`,
        } as never,
        req,
      });
      await logActivity(req, {
        case: p.id,
        text: `Claim ${claim.ref} settled: credit note ${claim.creditNote} for ${egp(claim.amountEGP)} recorded.`,
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
      const open = p.checks.filter((k) => !k.ok);
      if (open.length)
        return fail(400, `The case can't close yet: ${open.map((k) => k.label.toLowerCase()).join(", ")}.`);
      await req.payload.update({
        collection: "cases" as never,
        id: p.id,
        data: {
          stage: CLOSED,
          tone: "ok",
          wait: null,
          nextAction: "None — case closed",
          blocker: "",
          closedAt: new Date().toISOString(),
        } as never,
        req,
      });
      await logActivity(req, {
        case: p.id,
        text: `Case closed — actual gross profit ${egp(p.actual.profit)} (${p.actual.margin.toFixed(1)}%) against ${egp(p.expected.profit)} expected. Supplier prices and on-time results fed back to supplier records.`,
        entity: `cases/${p.id}`,
      });
      return respond(req, p.id);
    },
  },
];
