import type { Endpoint, PayloadRequest } from "payload";
import { idOf, logActivity } from "../collections/shared.ts";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { DEMO_NOW } from "./home.ts";
import * as link from "../links.ts";

/**
 * Root endpoints for order-to-cash: the customer PO check (PO vs approved quotation version,
 * amendments, partial awards), supplier POs (re-check before confirming), receipts and backorders,
 * vessel delivery (ETA re-planning, proof of delivery), invoicing from delivered quantities, the
 * Egyptian e-invoice submission (safe retries), and receivables & payables. Registered in ./index.ts.
 *
 * Everything an AI or an integration does here is a deterministic stub: the PO "reading", the
 * supplier re-check, the agent's ETA email, the tax authority's answer and the collection draft.
 * People confirm every write in the dashboard (the widgets in src/cms/widgets/case-order.ts,
 * case-delivery.ts, cash.ts). Sales never receives supplier costs or payables.
 */

/* ---------------------------------------------------------------- types */

type Cur = "USD" | "EGP" | "EUR";

/** One awarded / quoted line of a case's order book: what we sell, and where it comes from. */
export interface BookLine {
  lineNo: number;
  description: string;
  qty: number;
  unit: string;
  /** Customer price per unit, in the case currency. */
  sellPrice: number;
  /** Supplier(s) and cost per unit (EGP unless `costCurrency`); omitted for sales. */
  sources?: { supplier: string; qty: number; cost: number; costCurrency?: Cur }[];
  route: "warehouse" | "dropship" | "stock";
}

interface Plan {
  currency: Cur;
  agent?: string;
  lines: BookLine[];
  /** Customer PO the "AI reading" produces when none is on file yet (the flagship's won story). */
  incomingPo?: {
    number: string;
    quotation: string;
    billingEntity: string;
    checks: Check[];
    unawarded: { lineNo: number; outcome: string; reason: string }[];
  };
  /** Re-check results before supplier POs are confirmed, per supplier. */
  recheck?: Record<string, { item: string; atQuotation: string; now: string; ok: boolean }[]>;
}

export interface Check {
  lineNo: number;
  field: string;
  matches: boolean;
  po: string;
  quote: string;
  resolution?: string | null;
  evidence?: unknown;
  /** AI-suggested wording for the amendment (never recorded without a person). */
  suggestion?: string;
}

/* ---------------------------------------------------------------- the order book (mock ERP data) */

/** Order books of the cases in the order-to-cash part of the demo (sales prices and sources). */
export const ORDER_BOOK: Record<string, Plan> = {
  "gs-rfq-0136": {
    currency: "USD",
    agent: "Canal Link Agency · Port Said ops desk",
    lines: [
      {
        lineNo: 1,
        description: "Electrical contact cleaner, 400 ml",
        qty: 48,
        unit: "can",
        sellPrice: 7.9,
        sources: [{ supplier: "S2", qty: 48, cost: 280 }],
        route: "dropship",
      },
      {
        lineNo: 2,
        description: "LOCTITE 243 threadlocker, 50 ml",
        qty: 6,
        unit: "EA",
        sellPrice: 48.5,
        sources: [{ supplier: "S1", qty: 6, cost: 1750 }],
        route: "warehouse",
      },
      {
        lineNo: 3,
        description: "Safety helmet EN 397, white",
        qty: 10,
        unit: "EA",
        sellPrice: 11.2,
        sources: [{ supplier: "S4", qty: 10, cost: 340 }],
        route: "warehouse",
      },
      {
        lineNo: 4,
        description: "FR coverall navy EN ISO 11612, size L",
        qty: 8,
        unit: "EA",
        sellPrice: 58,
        route: "warehouse",
      },
      {
        lineNo: 5,
        description: "Degreaser, water based, 25 L",
        qty: 2,
        unit: "drum",
        sellPrice: 96,
        sources: [{ supplier: "S1", qty: 2, cost: 3450 }],
        route: "warehouse",
      },
    ],
    recheck: {
      S1: [
        {
          item: "Delta Marine L2 LOCTITE price",
          atQuotation: "EGP 1,750",
          now: "EGP 1,750 (valid to 24 Nov)",
          ok: true,
        },
        {
          item: "Delta Marine L5 degreaser",
          atQuotation: "EGP 3,450 · 2 drums",
          now: "EGP 3,450 · in stock",
          ok: true,
        },
        { item: "FX USD/EGP", atQuotation: "48.60", now: "48.60 (48.95 pending approval)", ok: true },
      ],
      S2: [
        { item: "Suez Industrial L1 price", atQuotation: "EGP 280", now: "EGP 280", ok: true },
        { item: "Lead time (drop-ship to Port Said)", atQuotation: "3 days", now: "2 days", ok: true },
      ],
      S4: [
        { item: "Nile Safety L3 availability", atQuotation: "10 pcs", now: "8 pcs today + 2 on 20 Nov", ok: false },
        { item: "Nile Safety L3 price", atQuotation: "EGP 340", now: "EGP 340", ok: true },
      ],
    },
  },
  "gs-rfq-0142": {
    currency: "USD",
    agent: "Canal Link Agency · ops desk",
    lines: [
      {
        lineNo: 1,
        description: "CRC Belt Grip spray for mud pump V-belts, 400 ml aerosol",
        qty: 24,
        unit: "EA",
        sellPrice: 14.05,
        sources: [{ supplier: "S5", qty: 24, cost: 9.8, costCurrency: "USD" }],
        route: "warehouse",
      },
      {
        lineNo: 2,
        description: "LOCTITE 243 threadlocker, medium strength, 50 ml",
        qty: 3,
        unit: "EA",
        sellPrice: 68.2,
        sources: [{ supplier: "S1", qty: 3, cost: 2405 }],
        route: "warehouse",
      },
      {
        lineNo: 3,
        description: "Electrical contact cleaner, 500 ml aerosol (accepted alternative pack)",
        qty: 100,
        unit: "can",
        sellPrice: 10.92,
        sources: [{ supplier: "S2", qty: 100, cost: 330 }],
        route: "dropship",
      },
      {
        lineNo: 4,
        description: "Welding electrodes E6013, Ø3.2 mm, 5 kg pack",
        qty: 4,
        unit: "pack",
        sellPrice: 0,
        route: "warehouse",
      },
      {
        lineNo: 5,
        description: "Safety helmet EN 397, white, with chin strap",
        qty: 15,
        unit: "EA",
        sellPrice: 10.44,
        sources: [
          { supplier: "S4", qty: 10, cost: 340 },
          { supplier: "S1", qty: 5, cost: 365 },
        ],
        route: "warehouse",
      },
      {
        lineNo: 6,
        description: "Flame-retardant coverall, navy, EN ISO 11612",
        qty: 10,
        unit: "EA",
        sellPrice: 0,
        route: "warehouse",
      },
    ],
    incomingPo: {
      number: "NSM-PO-77231",
      quotation: "q-0142-v1",
      billingEntity: "Nordvik Ship Management AS · VAT NO 999 000 111",
      checks: [
        {
          lineNo: 1,
          field: "Price",
          matches: true,
          po: "L1 CRC Belt Grip — 24 EA × USD 14.05",
          quote: "24 EA × USD 14.05",
        },
        {
          lineNo: 2,
          field: "Price",
          matches: true,
          po: "L2 LOCTITE 243 — 3 EA × USD 68.20",
          quote: "3 EA × USD 68.20",
        },
        {
          lineNo: 3,
          field: "Pack size",
          matches: false,
          po: "L3 Contact cleaner — 200 × 250 ml (old pack)",
          quote: "100 × 500 ml (accepted alternative, same 50 L)",
        },
        { lineNo: 5, field: "Quantity", matches: false, po: "L5 Safety helmet — 20 EA", quote: "15 EA" },
        { lineNo: 0, field: "Currency", matches: true, po: "USD · excl. VAT", quote: "USD · excl. VAT" },
        { lineNo: 0, field: "Payment terms", matches: true, po: "60 days (better than quoted)", quote: "90 days" },
        {
          lineNo: 0,
          field: "Delivery terms",
          matches: true,
          po: "Delivered on board, Port Said",
          quote: "On board at Port Said on arrival",
        },
        { lineNo: 0, field: "Quote validity", matches: true, po: "PO dated 17 Nov", quote: "v1 valid to 24 Nov" },
      ],
      unawarded: [
        { lineNo: 4, outcome: "Open — revision to follow", reason: "v2 to follow once welding offers are complete" },
      ],
    },
    recheck: {
      S5: [
        {
          item: "Horizon Trading L1 price & stock",
          atQuotation: "USD 9.80 · 24 pcs",
          now: "Reconfirmed 17 Nov 10:15",
          ok: true,
        },
        {
          item: "Deposit terms (new supplier)",
          atQuotation: "50% advance",
          now: "50% advance · pro forma PF-H-118",
          ok: true,
        },
      ],
      S1: [
        { item: "Delta Marine L2 price", atQuotation: "EGP 2,405", now: "EGP 2,405 (valid to 24 Nov)", ok: true },
        { item: "Delta Marine L5 helmets", atQuotation: "EGP 365 · 5 pcs", now: "EGP 365 · 5 pcs", ok: true },
      ],
      S2: [{ item: "Suez Industrial L3 lead time", atQuotation: "4 days", now: "3 days — ready 20 Nov", ok: true }],
      S4: [{ item: "Nile Safety L5 availability", atQuotation: "10 pcs", now: "8 pcs today + 2 on 22 Nov", ok: false }],
    },
  },
  "gs-rfq-0133": {
    currency: "EGP",
    agent: "Abu Qir Marine Services · base operations",
    lines: [
      {
        lineNo: 1,
        description: "Coverall FR, assorted sizes",
        qty: 40,
        unit: "EA",
        sellPrice: 1650,
        sources: [{ supplier: "S1", qty: 40, cost: 1150 }],
        route: "warehouse",
      },
      {
        lineNo: 2,
        description: "Safety gloves, leather palm",
        qty: 200,
        unit: "pair",
        sellPrice: 360,
        sources: [{ supplier: "S1", qty: 200, cost: 252 }],
        route: "warehouse",
      },
      {
        lineNo: 3,
        description: "Safety helmet EN 397, white",
        qty: 10,
        unit: "EA",
        sellPrice: 520,
        sources: [{ supplier: "S4", qty: 10, cost: 340 }],
        route: "warehouse",
      },
      {
        lineNo: 4,
        description: "Hydraulic oil ISO VG 68, 208 L drum",
        qty: 6,
        unit: "drum",
        sellPrice: 27500,
        sources: [{ supplier: "S2", qty: 6, cost: 19800 }],
        route: "dropship",
      },
    ],
  },
  "gs-rfq-0131": {
    currency: "USD",
    agent: "Suez Canal Shipping Agency",
    lines: [
      {
        lineNo: 1,
        description: "Engine spares — 7 lines as per DN-0131-1",
        qty: 1,
        unit: "lot",
        sellPrice: 14200,
        sources: [{ supplier: "S1", qty: 1, cost: 512000 }],
        route: "warehouse",
      },
    ],
  },
};

/** Amendment wording the AI proposes for known mismatches (a person records it). */
const SUGGESTIONS: Record<string, string> = {
  "NSM-PO-77104|1|Pack size": "Customer amendment: PO line 1 → 48 × 400 ml (email Ingrid L. 17 Nov 08:40)",
  "NSM-PO-77104|3|Price": "Customer accepted the v2 price USD 11.20 for line 3 (email Ingrid L. 17 Nov 08:40)",
  "NSM-PO-77104|3|Quantity": "Customer confirmed 10 EA, as quoted — not 15 (email Ingrid L. 17 Nov 08:40)",
  "NSM-PO-77231|3|Pack size": "Customer amendment: PO line 3 → 100 × 500 ml (email 17 Nov 11:02)",
  "NSM-PO-77231|5|Quantity": "Customer confirmed 15 EA (email 17 Nov 11:02)",
};

/** The agent's (simulated) ETA updates, per case. */
const ETA_UPDATES: Record<string, { eta: string; from: string; text: string }> = {
  "gs-rfq-0133": {
    eta: "2026-11-22T16:00:00.000Z",
    from: "Abu Qir Marine Services (agent)",
    text: "DOS Falcon delayed at the rig by weather — now returning to Abu Qir base 22 Nov 16:00.",
  },
  "gs-rfq-0142": {
    eta: "2026-11-20T22:00:00.000Z",
    from: "Canal Link Agency",
    text: "MV Aurora Crest ETA Port Said anchorage moved forward to 20 Nov 22:00.",
  },
};

/** Requested bank-detail changes (the approval holds the decision; this holds the request). */
export const BANK_REQUESTS: Record<
  string,
  {
    supplier: string;
    current: string;
    requested: { beneficiary: string; bankName: string; iban: string };
    requestedVia: string;
    phoneOnFile: string;
    phoneInRequest: string;
  }
> = {
  "ap-bank-s3": {
    supplier: "S3",
    current: "National Bank of Egypt · ···· 4410",
    requested: {
      beneficiary: "Port Said Welding Co.",
      bankName: "Banque Misr",
      iban: "EG38 0019 0005 0000 0000 2631 8000 2",
    },
    requestedVia: "Email from accounts@portsaidwelding.example, 16 Nov 14:22 (letterhead PDF attached)",
    phoneOnFile: "+20 10 0000 1103 (Sherif K.)",
    phoneInRequest: "+20 12 5555 0199 (not on file — not used)",
  },
};

/** Fixed weekly outgoings from the budget (payroll, rent, fleet), in EGP: part of the cash forecast. */
const FIXED_WEEKLY_EGP = 165000;

/* ---------------------------------------------------------------- helpers */

type U = { id?: string; role?: string; name?: string } | null | undefined;
const userOf = (req: PayloadRequest) => req.user as U;
const isSales = (req: PayloadRequest) => userOf(req)?.role === "sales";
const FINANCE_ROLES = ["management", "finance-director", "operations"];
const canFinance = (req: PayloadRequest) => FINANCE_ROLES.includes(String(userOf(req)?.role));

const fail = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const str = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : "";
const round2 = (n: number) => Math.round(n * 100) / 100;
const DAY = 86400000;
const addDays = (iso: string | Date, days: number) => new Date(new Date(iso).getTime() + days * DAY).toISOString();

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await (req as unknown as { json: () => Promise<unknown> }).json()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

const find = async (req: PayloadRequest, collection: string, where?: Record<string, unknown>) =>
  (
    await req.payload.find({
      collection: collection as never,
      where: where as never,
      depth: 0,
      limit: 0,
    } as never)
  ).docs as unknown as Doc[];

const byId = (req: PayloadRequest, collection: string, id: string) =>
  req.payload.findByID({ collection: collection as never, id, depth: 0 }).catch(() => null) as Promise<Doc | null>;

const update = (req: PayloadRequest, collection: string, id: string, data: Record<string, unknown>) =>
  req.payload.update({ collection: collection as never, id, data: data as never, req }) as unknown as Promise<Doc>;

const create = (req: PayloadRequest, collection: string, data: Record<string, unknown>) =>
  req.payload.create({ collection: collection as never, data: data as never, req }) as unknown as Promise<Doc>;

/** Turns a thrown business-rule error into the REST error response. */
async function attempt(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    const err = e as Error & { status?: number; data?: { errors?: { message: string }[] } };
    const detail = err.data?.errors?.map((x) => x.message).join("; ");
    return fail(detail || err.message, err.status && err.status < 500 ? err.status : 400);
  }
}

/** Active FX rates (EGP per unit), from the fx-rates global. */
async function fxRates(req: PayloadRequest): Promise<Record<Cur, number>> {
  const out: Record<Cur, number> = { EGP: 1, USD: 48.6, EUR: 52.9 };
  try {
    const g = (await req.payload.findGlobal({ slug: "fx-rates" as never, depth: 0 } as never)) as {
      rates?: { currency?: string; egpPerUnit?: number; status?: string }[];
    };
    for (const r of g.rates ?? []) if (r.status === "Active" && r.currency) out[r.currency as Cur] = num(r.egpPerUnit);
  } catch {
    /* defaults */
  }
  return out;
}

const supplierNames = async (req: PayloadRequest) =>
  new Map((await find(req, "suppliers")).map((s) => [s.id, str(s.name)]));

/** Notifies people (their bell) — never blocks the main write. */
async function notify(
  req: PayloadRequest,
  users: string[],
  n: { title: string; detail?: string; kind?: string; href?: string },
) {
  for (const user of new Set(users))
    await create(req, "notifications", {
      user,
      title: n.title,
      detail: n.detail,
      kind: n.kind ?? "Alert",
      href: n.href,
      at: new Date().toISOString(),
    }).catch(() => null);
}

function planFor(caseId: string, sales: boolean): Plan | undefined {
  const p = ORDER_BOOK[caseId];
  if (!p || !sales) return p;
  return { ...p, lines: p.lines.map(({ sources: _s, ...l }) => l), recheck: undefined };
}

/* ---------------------------------------------------------------- GET /api/operations/case/:id */

/** Everything the "Order & purchasing" and "Delivery & billing" tabs show for one case. */
async function caseOps(req: PayloadRequest) {
  const user = userOf(req);
  if (!user) return fail("You are not allowed to perform this action.", 401);
  const id = str(req.routeParams?.id);
  const c = await byId(req, "cases", id);
  if (!c) return fail("Case not found.", 404);
  const sales = isSales(req);
  const where = { case: { equals: id } };
  const [customer, cpos, pos, receipts, deliveries, invoices, approvals, activities] = await Promise.all([
    byId(req, "customers", str(idOf(c.customer))),
    find(req, "customer-pos", where),
    find(req, "purchase-orders", where),
    find(req, "receipts", where),
    find(req, "deliveries", where),
    find(req, "invoices", where),
    find(req, "approvals", where),
    find(req, "activities", where),
  ]);
  const poIds = pos.map((p) => p.id);
  const [bills, payments, names] = await Promise.all([
    poIds.length ? find(req, "supplier-bills", { purchaseOrder: { in: poIds } }) : Promise.resolve([] as Doc[]),
    find(req, "payments"),
    supplierNames(req),
  ]);
  const plan = planFor(id, sales);
  const cpo = cpos.sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt)))[0] ?? null;
  const quotation = cpo ? await byId(req, "quotations", str(idOf(cpo.quotation))) : null;

  const invoiceIds = new Set(invoices.map((i) => i.id));
  const customerPayments = payments.filter((p) => p.direction === "in" && invoiceIds.has(str(idOf(p.invoice))));
  const supplierPayments = payments.filter((p) => p.direction === "out" && poIds.includes(str(idOf(p.purchaseOrder))));

  const purchaseOrders = pos
    .sort((a, b) => str(a.number).localeCompare(str(b.number)))
    .map((p) => {
      const pid = p.id;
      const side = (p.supplierSide ?? {}) as Record<string, unknown>;
      const paid = supplierPayments.filter((x) => str(idOf(x.purchaseOrder)) === pid);
      const approval =
        approvals.find((a) => /deposit|payment|PO/i.test(str(a.type)) && str(a.detail).includes(str(p.number))) ??
        approvals.find(
          (a) =>
            idOf((a.subject as { value?: unknown } | undefined)?.value) === pid || str(a.title).includes(str(p.number)),
        );
      const lines = ((p.lines as Record<string, unknown>[] | undefined) ?? []).map((l) =>
        sales ? { lineNo: l.lineNo, description: l.description, qty: l.qty, scheduledFor: l.scheduledFor } : l,
      );
      return {
        id: pid,
        number: p.number,
        supplier: str(idOf(p.supplier)),
        supplierName: names.get(str(idOf(p.supplier))) ?? str(idOf(p.supplier)),
        currency: p.currency,
        total: sales ? undefined : p.total,
        deliverTo: p.deliverTo,
        status: p.status,
        recheck: sales ? [] : (p.recheck ?? []),
        recheckDone: p.recheckDone,
        lines,
        acknowledgedAt: side.acknowledgedAt,
        proforma: side.proforma,
        depositPct: side.depositPct,
        deposit: sales ? undefined : round2((num(p.total) * num(side.depositPct)) / 100),
        balanceDue: side.balanceDue,
        paid: sales ? undefined : round2(paid.reduce((s, x) => s + num(x.amount), 0)),
        approval: approval ? { id: approval.id, title: approval.title, status: approval.status } : null,
      };
    });

  const supplierBills = sales
    ? []
    : bills.map((b) => ({
        id: b.id,
        billNumber: b.billNumber,
        supplier: str(idOf(b.supplier)),
        supplierName: names.get(str(idOf(b.supplier))) ?? "",
        purchaseOrder: str(idOf(b.purchaseOrder)),
        poNumber: pos.find((p) => p.id === str(idOf(b.purchaseOrder)))?.number,
        amount: b.amount,
        currency: b.currency,
        dueDate: b.dueDate,
        status: b.status,
        holdReason: b.holdReason,
        match: b.match ?? [],
      }));

  const supplierOfPo = new Map(pos.map((p) => [p.id, names.get(str(idOf(p.supplier))) ?? ""]));
  const receiptRows = receipts
    .sort((a, b) => num(a.lineNo) - num(b.lineNo))
    .map((r) => ({
      id: r.id,
      lineNo: r.lineNo,
      description: plan?.lines.find((l) => l.lineNo === r.lineNo)?.description ?? "",
      supplierName: supplierOfPo.get(str(idOf(r.purchaseOrder))) ?? "",
      poNumber: pos.find((p) => p.id === str(idOf(r.purchaseOrder)))?.number,
      ordered: r.ordered,
      received: r.received,
      shortfall: r.shortfall,
      receivedAt: r.receivedAt,
      warehouse: r.warehouse,
      lot: r.lot,
      expiry: r.expiry,
      qc: r.qc,
      claim: r.claim,
      backorderDate: r.backorderDate,
    }));

  // A delivery is invoiced when an invoice names it, or when the case's invoices already cover its
  // quantities (invoices booked before delivery links existed).
  type QtyLine = { lineNo: number; qty: number };
  const linesOf = (doc: Doc) => (doc.lines as QtyLine[] | undefined) ?? [];
  const live = invoices.filter((inv) => inv.status !== "Cancelled");
  const invoicedQty = (lineNo: number) =>
    live
      .flatMap(linesOf)
      .filter((l) => l.lineNo === lineNo)
      .reduce((s, l) => s + num(l.qty), 0);
  const confirmedSorted = deliveries
    .filter((x) => x.status === "Delivered — confirmed")
    .sort((a, b) => str(a.plannedAt).localeCompare(str(b.plannedAt)));
  const invoicedBy = (d: Doc): string | null => {
    const named = live.find((inv) => str(idOf(inv.delivery)) === d.id);
    if (named) return str(named.number);
    const upTo = confirmedSorted.slice(0, confirmedSorted.indexOf(d) + 1);
    if (!upTo.includes(d)) return null;
    const covered = linesOf(d).every(
      (l) =>
        invoicedQty(l.lineNo) >=
        upTo
          .flatMap(linesOf)
          .filter((x) => x.lineNo === l.lineNo)
          .reduce((s, x) => s + num(x.qty), 0),
    );
    const first = live.find((inv) => linesOf(inv).some((l) => linesOf(d).some((x) => x.lineNo === l.lineNo)));
    return covered && first ? str(first.number) : null;
  };
  const deliveryRows = deliveries
    .sort((a, b) => str(a.plannedAt).localeCompare(str(b.plannedAt)))
    .map((d, i) => ({
      id: d.id,
      number: d.number,
      drop: i + 1,
      plannedAt: d.plannedAt,
      place: d.place,
      status: d.status,
      plan: d.plan ?? {},
      lines: ((d.lines as { lineNo: number; qty: number; lot?: string }[] | undefined) ?? []).map((l) => ({
        ...l,
        description: plan?.lines.find((x) => x.lineNo === l.lineNo)?.description ?? `Line ${l.lineNo}`,
      })),
      dispatchedAt: d.dispatchedAt,
      confirmedAt: d.confirmedAt,
      confirmedBy: d.confirmedBy,
      proof: Boolean(d.proof),
      shortages: d.shortages,
      invoice: invoicedBy(d),
    }));

  // Backorders: receipt shortfalls that follow in a later drop, with an owner and a date.
  const backorders = receiptRows
    .filter((r) => num(r.shortfall) > 0)
    .map((r) => {
      const later = deliveryRows.find(
        (d) => !/confirmed|Cancelled/.test(str(d.status)) && d.lines.some((l) => l.lineNo === r.lineNo) && d.drop > 1,
      );
      const ready = str((later?.plan as Record<string, unknown> | undefined)?.readyAt) || str(later?.plannedAt);
      return {
        lineNo: r.lineNo,
        description: r.description,
        qty: r.shortfall,
        supplierName: r.supplierName,
        date: r.backorderDate,
        owner: str(idOf(c.owner)),
        followsIn: later?.number ?? null,
        late: Boolean(ready && r.backorderDate && str(r.backorderDate) > ready),
      };
    });

  const invoiceRows = invoices
    .sort((a, b) => str(a.number).localeCompare(str(b.number)))
    .map((inv) => ({
      id: inv.id,
      number: inv.number,
      basis: inv.basis,
      delivery: deliveries.find((d) => d.id === str(idOf(inv.delivery)))?.number ?? null,
      currency: inv.currency,
      amount: inv.amount,
      paid: inv.paid,
      balance: inv.balance,
      issuedAt: inv.issuedAt,
      dueDate: inv.dueDate,
      status: inv.status,
      vatTreatment: inv.vatTreatment,
      eInvoice: inv.eInvoice ?? {},
      billing: inv.billing ?? {},
      lines: inv.lines ?? [],
      payments: customerPayments
        .filter((p) => str(idOf(p.invoice)) === inv.id)
        .map((p) => ({ reference: p.reference, amount: p.amount, paidAt: p.paidAt })),
    }));

  const quotedLines = plan?.lines ?? [];
  const checks = ((cpo?.checks as Check[] | undefined) ?? []).map((ch) => ({
    ...ch,
    suggestion: SUGGESTIONS[`${str(cpo?.number)}|${ch.lineNo}|${ch.field}`],
  }));

  return Response.json({
    case: {
      id: c.id,
      caseId: c.caseId,
      vessel: c.vessel,
      port: c.port,
      eta: c.eta,
      agent: str(c.agent) || plan?.agent || "",
      stage: c.stage,
      owner: str(idOf(c.owner)),
      nextAction: c.nextAction,
      blocker: c.blocker,
      currency: plan?.currency ?? c.currency ?? "USD",
    },
    customer: customer
      ? {
          id: customer.id,
          name: customer.name,
          contactRule: customer.contactRule,
          billingEntity: customer.billingEntity,
          paymentTermsDays: customer.paymentTermsDays,
          country: customer.country,
        }
      : null,
    canSeeCosts: !sales,
    canFinance: canFinance(req),
    isManagement: user.role === "management",
    lines: quotedLines,
    customerPo: cpo
      ? {
          id: cpo.id,
          number: cpo.number,
          receivedAt: cpo.receivedAt,
          billingEntity: cpo.billingEntity,
          quotation: quotation?.number ?? str(idOf(cpo.quotation)).replace(/^q-(\d+)-v(\d+)$/i, "GS-Q-$1 v$2"),
          status: cpo.status,
          openMismatches: cpo.openMismatches,
          checks,
          unawarded: cpo.unawarded ?? [],
        }
      : null,
    poExpected: Boolean(ORDER_BOOK[id]?.incomingPo) && !cpo,
    orderConfirmed: /sales order confirmed|Purchasing|Delivering|Delivered|Invoiced|Closed/.test(str(c.stage)),
    purchaseOrders,
    bills: supplierBills,
    receipts: receiptRows,
    deliveries: deliveryRows,
    backorders,
    invoices: invoiceRows,
    alerts: activities
      .filter((a) => a.kind === "alert")
      .sort((a, b) => str(b.at).localeCompare(str(a.at)))
      .slice(0, 5)
      .map((a) => ({ at: a.at, text: a.text })),
  });
}

/* ---------------------------------------------------------------- customer PO check */

/** POST /api/operations/po-check { case } — the AI reads the customer's PO and checks it against the quotation. */
async function poCheck(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const existing = (await find(req, "customer-pos", { case: { equals: id } }))[0];
  if (existing) {
    // Re-run: the same reading, keeping recorded resolutions (idempotent).
    const doc = await update(req, "customer-pos", existing.id, { checks: existing.checks });
    return Response.json({ doc, created: false, confidence: 0.96 });
  }
  const incoming = ORDER_BOOK[id]?.incomingPo;
  if (!incoming) return fail("No customer PO has been received for this case yet.");
  const doc = await create(req, "customer-pos", {
    number: incoming.number,
    case: id,
    quotation: incoming.quotation,
    receivedAt: new Date().toISOString(),
    billingEntity: incoming.billingEntity,
    checks: incoming.checks,
    unawarded: incoming.unawarded,
  });
  const c = await byId(req, "cases", id);
  const open = num(doc.openMismatches);
  await update(req, "cases", id, {
    stage: "Won — PO mismatch",
    decision: "Won",
    tone: open ? "danger" : "info",
    nextAction: open ? `Resolve ${open} PO mismatches before confirming the sales order` : "Confirm the sales order",
    blocker: open ? "Commitment blocked" : "",
  });
  await logActivity(req, {
    case: id,
    kind: "auto",
    text: `Customer PO ${incoming.number} read by AI and checked against ${str(c?.caseId)} quotation: ${open} mismatch(es).`,
  });
  return Response.json({ doc, created: true, confidence: 0.96 });
}

/** POST /api/operations/po-amend { po, index, resolution, evidence? } — records the customer's written agreement. */
async function poAmend(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const b = await body(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail("Customer PO not found.", 404);
  const resolution = str(b.resolution).trim();
  if (!resolution) return fail("Describe the customer's written agreement (who, when, what).");
  if (!b.evidence) return fail("Attach the customer's written confirmation (email or signed amendment).");
  const checks = [...((po.checks as Check[] | undefined) ?? [])];
  const i = num(b.index);
  if (!checks[i] || checks[i].matches) return fail("That check has no mismatch to resolve.");
  checks[i] = { ...checks[i], resolution, evidence: b.evidence };
  const doc = await update(req, "customer-pos", po.id, { checks });
  const caseId = str(idOf(po.case));
  await logActivity(req, {
    case: caseId,
    text: `PO ${str(po.number)} line ${checks[i].lineNo || "header"} (${checks[i].field}): ${resolution} — evidence attached.`,
  });
  if (doc.status === "Validated")
    await update(req, "cases", caseId, {
      tone: "info",
      blocker: "",
      nextAction: "Confirm the sales order & prepare supplier POs",
    });
  return Response.json({ doc });
}

/** POST /api/operations/po-award { po, lineNo, outcome, reason } — partial award: keep a line open or close it. */
async function poAward(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const b = await body(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail("Customer PO not found.", 404);
  const outcome = str(b.outcome);
  const reason = str(b.reason).trim();
  if (!["Open — revision to follow", "Closed"].includes(outcome))
    return fail("Choose to keep the line open or close it.");
  if (outcome === "Closed" && !reason) return fail("Closing an unawarded line needs a reason.");
  const lineNo = num(b.lineNo);
  const all = (po.unawarded as Unawarded[] | undefined) ?? [];
  const was = all.find((u) => u.lineNo === lineNo);
  const rest = all.filter((u) => u.lineNo !== lineNo);
  const doc = await update(req, "customer-pos", po.id, { unawarded: [...rest, { lineNo, outcome, reason }] });
  await logActivity(req, {
    case: str(idOf(po.case)),
    text: `Line ${lineNo} not awarded: ${outcome}${reason ? ` — ${reason}` : ""}.`,
  });
  // `undo`: the call that puts the line back where it was (undecided, or kept open).
  return Response.json({
    doc,
    undo: {
      path: "/operations/po-award-undo",
      body: { po: po.id, lineNo, outcome, was: was ? { outcome: was.outcome, reason: was.reason ?? "" } : null },
    },
  });
}

type Unawarded = { lineNo: number; outcome?: string; reason?: string };

/**
 * POST /api/operations/po-award-undo { po, lineNo, outcome, was } — the Undo of a partial-award
 * decision: the line goes back to what it was (`was`: undecided, or kept open). Refused once the
 * line has been decided again, or the sales order is confirmed (the supplier POs were built
 * without it).
 */
async function poAwardUndo(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const b = await body(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail("Customer PO not found.", 404);
  const lineNo = num(b.lineNo);
  const all = (po.unawarded as Unawarded[] | undefined) ?? [];
  const now = all.find((u) => u.lineNo === lineNo);
  if (!now || now.outcome !== str(b.outcome))
    return fail(`Line ${lineNo} has been decided again since — nothing to take back.`, 409);
  const caseId = str(idOf(po.case));
  if ((await find(req, "purchase-orders", { case: { equals: caseId } })).length)
    return fail("The sales order is confirmed and its supplier POs are prepared — the line's decision stands.", 409);
  const was = b.was && typeof b.was === "object" ? (b.was as Unawarded) : null;
  if (was && was.outcome !== "Open — revision to follow") return fail("A line goes back to undecided or kept open.");
  const rest = all.filter((u) => u.lineNo !== lineNo);
  const doc = (await req.payload.update({
    collection: "customer-pos" as never,
    id: po.id,
    data: {
      unawarded: was ? [...rest, { lineNo, outcome: was.outcome, reason: str(was.reason) }] : rest,
    } as never,
    req,
    overrideAccess: false,
  })) as unknown as Doc;
  await logActivity(req, {
    case: caseId,
    text: `Line ${lineNo}: “${str(b.outcome)}” taken back — ${was ? was.outcome : "undecided again"}.`,
  });
  return Response.json({ doc, message: `Line ${lineNo} is ${was ? "kept open again" : "undecided again"}` });
}

/** POST /api/operations/confirm-order { case } — sales order confirmed; supplier POs prepared for approval. */
async function confirmOrder(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const po = (await find(req, "customer-pos", { case: { equals: id } }))[0];
  if (!po) return fail("No customer PO on file.");
  if (po.status !== "Validated")
    return fail(`Commitment blocked: ${num(po.openMismatches)} PO mismatch(es) need written customer agreement.`);
  const plan = ORDER_BOOK[id];
  const existing = await find(req, "purchase-orders", { case: { equals: id } });
  const created: Doc[] = [];
  if (plan && !existing.length) {
    const unawarded = new Set(((po.unawarded as { lineNo: number }[] | undefined) ?? []).map((u) => u.lineNo));
    const bySupplier = new Map<string, { lineNo: number; description: string; qty: number; unitPrice: number }[]>();
    for (const l of plan.lines)
      if (!unawarded.has(l.lineNo))
        for (const s of l.sources ?? [])
          bySupplier.set(s.supplier, [
            ...(bySupplier.get(s.supplier) ?? []),
            { lineNo: l.lineNo, description: l.description, qty: s.qty, unitPrice: s.cost },
          ]);
    for (const [supplier, lines] of bySupplier) {
      const dropship = lines.some((l) => plan.lines.find((x) => x.lineNo === l.lineNo)?.route === "dropship");
      const costCur = plan.lines.find((x) => x.lineNo === lines[0].lineNo)?.sources?.[0]?.costCurrency ?? "EGP";
      created.push(
        await create(req, "purchase-orders", {
          case: id,
          supplier,
          currency: costCur,
          lines,
          deliverTo: dropship ? "Direct to vessel (dropship)" : "Alexandria",
          status: "Awaiting approval",
          recheckDone: false,
          supplierSide: supplier === "S5" ? { depositPct: 50 } : {},
        }),
      );
    }
  }
  await update(req, "cases", id, {
    stage: "Won — sales order confirmed",
    decision: "Won",
    tone: "info",
    wait: "Awaiting internal approval",
    blocker: "",
    nextAction: "Re-check supplier costs, then approve supplier POs",
  });
  await logActivity(req, {
    case: id,
    text: `Sales order confirmed against PO ${str(po.number)}. ${created.length} supplier PO(s) prepared for re-check and approval.`,
  });
  return Response.json({ created: created.map((p) => p.number) });
}

/** POST /api/operations/po-recheck { po } — re-checks price, availability, FX and lead time before confirming. */
async function poRecheck(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  if (isSales(req)) return fail("Supplier costs are not visible to Sales.", 403);
  const { po: poId } = await body(req);
  const po = await byId(req, "purchase-orders", str(poId));
  if (!po) return fail("Purchase order not found.", 404);
  const rows = ORDER_BOOK[str(idOf(po.case))]?.recheck?.[str(idOf(po.supplier))] ?? [
    { item: "Supplier price", atQuotation: "As quoted", now: "Unchanged", ok: true },
    { item: "Availability & lead time", atQuotation: "As quoted", now: "Confirmed by phone", ok: true },
  ];
  const doc = await update(req, "purchase-orders", po.id, {
    recheck: rows,
    recheckDone: true,
  });
  const changed = rows.filter((r) => !r.ok);
  await logActivity(req, {
    case: str(idOf(po.case)),
    kind: changed.length ? "alert" : "auto",
    text: `Re-check for ${str(po.number)}: ${changed.length ? changed.map((r) => `${r.item} → ${r.now}`).join("; ") : "no changes"}.`,
  });
  return Response.json({ doc, changed: changed.length });
}

/* ---------------------------------------------------------------- delivery */

/** POST /api/operations/eta-change { case } — the agent's ETA email: every open drop, booking and task re-planned. */
async function etaChange(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const c = await byId(req, "cases", id);
  const upd = ETA_UPDATES[id];
  if (!c || !upd) return fail("No ETA update from the agent for this case.");
  if (str(c.eta) === upd.eta)
    return Response.json({ changed: 0, message: "ETA already up to date — nothing re-planned." });
  const deltaMs = new Date(upd.eta).getTime() - new Date(str(c.eta) || upd.eta).getTime();
  const hours = Math.round(deltaMs / 3600000);
  const deliveries = await find(req, "deliveries", { case: { equals: id } });
  const moved: string[] = [];
  for (const d of deliveries) {
    if (/confirmed|Cancelled|Dispatched/.test(str(d.status))) continue;
    const plan = { ...(d.plan as Record<string, unknown> | undefined) };
    const plannedAt = upd.eta;
    const readyAt = addDays(upd.eta, -0.5);
    plan.readyAt = readyAt;
    plan.launch = `${str(plan.launch).split(" — ")[0] || "Launch / boat"} — re-booked for ${fmt(plannedAt)}`;
    await update(req, "deliveries", d.id, { plannedAt, plan, status: "Rescheduled" });
    moved.push(str(d.number));
    await create(req, "tasks", {
      title: `Re-confirm truck, boarding staff and launch for ${str(d.number)} (ETA ${hours >= 0 ? "+" : ""}${hours} h)`,
      type: "Delivery task",
      channel: "Call",
      due: readyAt,
      case: id,
      owner: str(idOf(c.owner)),
      createdByRule: "ETA change",
      stopCondition: "Delivery confirmed",
    }).catch(() => null);
  }
  await update(req, "cases", id, {
    eta: upd.eta,
    blocker: `ETA moved ${hours >= 0 ? "+" : ""}${hours} h by agent — ${moved.length} drop(s) re-planned`,
    tone: "warn",
  });
  const text = `ETA change from ${upd.from}: ${fmt(str(c.eta))} → ${fmt(upd.eta)}. ${upd.text} Re-planned: ${moved.join(", ") || "nothing open"}; owner and management alerted.`;
  await logActivity(req, { case: id, kind: "alert", text });
  await notify(req, [str(idOf(c.owner)), "kb"], {
    title: `ETA change ${str(c.caseId)}: ${fmt(upd.eta)}`,
    detail: `${moved.length} drop(s) re-planned — re-confirm transport.`,
    kind: "Alert",
    href: link.doc("cases", id, "delivery"),
  });
  return Response.json({ changed: moved.length, moved, eta: upd.eta, hours, text });
}

const fmt = (iso: string) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(iso))
    : "—";

/** POST /api/operations/confirm-delivery { delivery, proof, signedBy, shortages? } — delivered only with evidence. */
async function confirmDelivery(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  const b = await body(req);
  const d = await byId(req, "deliveries", str(b.delivery));
  if (!d) return fail("Delivery not found.", 404);
  if (!str(b.signedBy).trim()) return fail("Who signed the delivery note on board?");
  return attempt(async () => {
    const doc = await update(req, "deliveries", d.id, {
      status: "Delivered — confirmed",
      proof: b.proof || null,
      confirmedBy: str(b.signedBy),
      confirmedAt: new Date().toISOString(),
      dispatchedAt: d.dispatchedAt ?? new Date().toISOString(),
      shortages: str(b.shortages) || d.shortages,
    });
    const caseId = str(idOf(d.case));
    const all = await find(req, "deliveries", { case: { equals: caseId } });
    const open = all.filter((x) => !/confirmed|Cancelled/.test(str(x.status))).length;
    await update(req, "cases", caseId, {
      stage: open ? `Delivering (drop 1 of 2)` : "Delivered",
      nextAction: `Invoice ${str(d.number)} — delivered quantities only`,
    });
    await logActivity(req, {
      case: caseId,
      text: `${str(d.number)} delivered — signed by ${str(b.signedBy)}; signed delivery note attached.`,
    });
    return Response.json({ doc });
  });
}

/* ---------------------------------------------------------------- invoicing & e-invoice */

/** POST /api/operations/invoice-delivery { delivery } — invoice exactly what was delivered (never twice). */
async function invoiceDelivery(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  if (!canFinance(req)) return fail("Invoices are issued by operations & finance.", 403);
  const b = await body(req);
  const d = await byId(req, "deliveries", str(b.delivery));
  if (!d) return fail("Delivery not found.", 404);
  if (d.status !== "Delivered — confirmed")
    return fail("Only a delivery confirmed with a signed delivery note can be invoiced.");
  const caseId = str(idOf(d.case));
  const [c, all] = await Promise.all([
    byId(req, "cases", caseId),
    find(req, "deliveries", { case: { equals: caseId } }),
  ]);
  const customer = c ? await byId(req, "customers", str(idOf(c.customer))) : null;
  const plan = ORDER_BOOK[caseId];
  if (!c || !customer || !plan) return fail("No order book for this case.");
  const confirmed = all.filter((x) => x.status === "Delivered — confirmed");
  const deliveredTotal = (lineNo: number) =>
    confirmed
      .flatMap((x) => (x.lines as { lineNo: number; qty: number }[] | undefined) ?? [])
      .filter((l) => l.lineNo === lineNo)
      .reduce((s, l) => s + num(l.qty), 0);
  const lines = ((d.lines as { lineNo: number; qty: number }[] | undefined) ?? []).map((l) => {
    const book = plan.lines.find((x) => x.lineNo === l.lineNo);
    return {
      lineNo: l.lineNo,
      description: book?.description ?? `Line ${l.lineNo}`,
      qty: l.qty,
      deliveredQty: deliveredTotal(l.lineNo),
      unitPrice: book?.sellPrice ?? 0,
    };
  });
  const issuedAt = new Date().toISOString();
  const local = /egypt/i.test(str(customer.country));
  // INV/2026/NNNN: the next number after the highest (the year is part of the prefix, not the counter).
  const last = Math.max(
    0,
    ...(await find(req, "invoices")).map((i) => Number(/(\d{4})$/.exec(str(i.number))?.[1]) || 0),
  );
  return attempt(async () => {
    const doc = await create(req, "invoices", {
      number: `INV/2026/${String(last + 1).padStart(4, "0")}`,
      case: caseId,
      customer: customer.id,
      basis: "Delivery",
      delivery: d.id,
      currency: plan.currency,
      lines,
      paid: 0,
      issuedAt,
      dueDate: addDays(issuedAt, num(customer.paymentTermsDays) || 30),
      vatTreatment: local ? "14% standard" : "0% — foreign vessel in transit",
      billing: { legalEntity: str(customer.billingEntity) || str(customer.name), taxId: str(customer.taxId) },
      eInvoice: { status: "Not submitted" },
      status: "Open",
    });
    await update(req, "cases", caseId, { nextAction: `Submit ${str(doc.number)} to the tax authority (e-invoice)` });
    await logActivity(req, {
      case: caseId,
      text: `Invoice ${str(doc.number)} created from ${str(d.number)}: delivered quantities only (${lines.map((l) => `L${l.lineNo} × ${l.qty}`).join(", ")}).`,
    });
    return Response.json({ doc });
  });
}

/**
 * POST /api/operations/einvoice { invoice, taxId? } — submit to the Egyptian Tax Authority (stub).
 * Safe to retry: an invoice already accepted is never submitted again (the idempotency key is the
 * invoice number), and a failed signature leaves it unsubmitted. A second call refreshes the status
 * (Submitted → Valid).
 */
async function eInvoice(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  if (!canFinance(req)) return fail("E-invoices are submitted by operations & finance.", 403);
  const b = await body(req);
  const inv = await byId(req, "invoices", str(b.invoice));
  if (!inv) return fail("Invoice not found.", 404);
  const e = { ...(inv.eInvoice as Record<string, unknown> | undefined) };
  const billing = { ...(inv.billing as Record<string, unknown> | undefined) };
  if (e.status === "Valid")
    return Response.json({ doc: inv, result: "already-valid", message: "Already accepted — not resubmitted." });
  if (e.status === "Submitted") {
    const doc = await update(req, "invoices", inv.id, { eInvoice: { ...e, status: "Valid", error: null } });
    await logActivity(req, {
      case: str(idOf(inv.case)),
      kind: "auto",
      text: `E-invoice ${str(inv.number)}: Valid (UUID ${str(e.uuid)}).`,
    });
    return Response.json({ doc, result: "valid", message: `Tax authority: ${str(inv.number)} is valid.` });
  }
  if (b.taxId) billing.taxId = str(b.taxId);
  // The rejected one: the buyer's tax registration number must have 9 digits.
  if (inv.vatTreatment === "14% standard" && !/^\d{9}$/.test(str(billing.taxId).replace(/\D/g, ""))) {
    const doc = await update(req, "invoices", inv.id, {
      billing,
      eInvoice: {
        ...e,
        status: "Rejected",
        submittedAt: new Date().toISOString(),
        error: `Buyer tax registration number “${str(billing.taxId) || "—"}” not found (9 digits expected). Correct it and resubmit.`,
      },
    });
    return Response.json({ doc, result: "rejected", message: "Rejected by the tax authority — buyer tax ID." });
  }
  const uuid = `${str(inv.number).replace(/\D/g, "").slice(-4)}-${Math.abs(hash(str(inv.number)))
    .toString(16)
    .toUpperCase()
    .slice(0, 6)}-ETA`;
  const doc = await update(req, "invoices", inv.id, {
    billing,
    eInvoice: { status: "Submitted", uuid, submittedAt: new Date().toISOString(), error: null },
  });
  // A retry after "signature service unreachable" resolves the exception (same idempotency key).
  const ex = (
    await find(req, "integration-exceptions", { idempotencyKey: { equals: `invoice:${str(inv.number)}` } })
  )[0];
  if (ex && ex.status === "Open")
    await update(req, "integration-exceptions", ex.id, {
      status: "Resolved",
      retries: num(ex.retries) + 1,
      lastRetryAt: new Date().toISOString(),
      resolvedBy: userOf(req)?.id,
    }).catch(() => null);
  await logActivity(req, {
    case: str(idOf(inv.case)),
    kind: "auto",
    text: `E-invoice ${str(inv.number)} signed and submitted to the tax authority (UUID ${uuid}).`,
  });
  return Response.json({ doc, result: "submitted", message: `${str(inv.number)} signed and submitted.` });
}

function hash(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return h || 1;
}

/* ---------------------------------------------------------------- receivables & payables */

export const AGE_BUCKETS = ["Not due", "1–30 days", "31–60 days", "60+ days"] as const;
const bucketOf = (due: string) => {
  const days = Math.floor((DEMO_NOW.getTime() - new Date(due).getTime()) / DAY);
  return days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : 3;
};

/** GET /api/operations/cash — receivables, payables, approvals, bank changes and the 8-week forecast. */
export async function cash(req: PayloadRequest) {
  const user = userOf(req);
  if (!user) return fail("You are not allowed to perform this action.", 401);
  const sales = isSales(req);
  const fx = await fxRates(req);
  const toEgp = (amount: number, cur: unknown) => amount * (fx[(str(cur) || "EGP") as Cur] ?? 1);
  const toUsd = (amount: number, cur: unknown) => toEgp(amount, cur) / fx.USD;
  const [invoices, customers, cases, tasks] = await Promise.all([
    find(req, "invoices"),
    find(req, "customers"),
    find(req, "cases"),
    find(req, "tasks", { type: { in: ["Collection", "Customer follow-up", "Internal reminder"] } }),
  ]);
  const custById = new Map(customers.map((c) => [c.id, c]));
  const caseById = new Map(cases.map((c) => [c.id, c]));

  const open = invoices.filter((i) => num(i.balance) > 0 && !["Draft", "Cancelled"].includes(str(i.status)));
  const receivables = open
    .map((i) => {
      const cust = custById.get(str(idOf(i.customer)));
      const daysOverdue = Math.floor((DEMO_NOW.getTime() - new Date(str(i.dueDate)).getTime()) / DAY);
      const reminders = tasks.filter((t) => str(t.title).includes(str(i.number)));
      return {
        id: i.id,
        number: i.number,
        caseId: caseById.get(str(idOf(i.case)))?.caseId ?? null,
        case: caseById.has(str(idOf(i.case))) ? str(idOf(i.case)) : null,
        customer: str(idOf(i.customer)),
        customerName: str(cust?.name),
        contactRule: str(cust?.contactRule) || "allowed",
        currency: i.currency,
        amount: i.amount,
        paid: i.paid,
        balance: i.balance,
        balanceUsd: round2(toUsd(num(i.balance), i.currency)),
        dueDate: i.dueDate,
        daysOverdue,
        bucket: AGE_BUCKETS[bucketOf(str(i.dueDate))],
        eInvoice: str((i.eInvoice as { status?: string } | undefined)?.status) || "Not submitted",
        lastReminder: reminders.sort((a, b) => str(b.due).localeCompare(str(a.due)))[0]?.title ?? null,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const ageingMap = new Map<string, number[]>();
  for (const r of receivables) {
    const row = ageingMap.get(r.customerName) ?? [0, 0, 0, 0];
    row[AGE_BUCKETS.indexOf(r.bucket)] += r.balanceUsd;
    ageingMap.set(r.customerName, row);
  }
  const ageing = [...ageingMap.entries()]
    .map(([customer, values]) => ({
      customer,
      values: values.map(round2),
      total: round2(values.reduce((s, v) => s + v, 0)),
    }))
    .sort((a, b) => b.total - a.total);

  // Weeks starting Monday 16 Nov (the demo's week), eight of them.
  const start = new Date("2026-11-16T00:00:00.000Z").getTime();
  const weeks = Array.from({ length: 8 }, (_, k) => new Date(start + k * 7 * DAY));
  const weekOf = (iso: string) => {
    const t = new Date(iso).getTime();
    const k = Math.floor((t - start) / (7 * DAY));
    return k < 0 ? 0 : k; // overdue → expected this week
  };
  const inflow = Array.from({ length: 8 }, () => 0);
  for (const r of receivables) {
    // Customers who never pay on time get a week of slack in the forecast.
    const k = Math.min(7, weekOf(str(r.dueDate)) + (r.daysOverdue > 30 ? 1 : 0));
    if (k < 8) inflow[k] += toEgp(num(r.balance), r.currency) / 1000;
  }

  const base = {
    fx: { USD: fx.USD, EUR: fx.EUR },
    receivables,
    ageing,
    buckets: AGE_BUCKETS,
    totals: {
      receivableUsd: round2(receivables.reduce((s, r) => s + r.balanceUsd, 0)),
      overdueUsd: round2(receivables.filter((r) => r.daysOverdue > 0).reduce((s, r) => s + r.balanceUsd, 0)),
    },
    weeks: weeks.map((w) =>
      new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }).format(w),
    ),
  };
  if (sales)
    return Response.json({
      ...base,
      canSeePayables: false,
      canFinance: false,
      payables: [],
      approvals: [],
      bankChanges: [],
      cashIn: inflow.map(Math.round),
      cashOut: [],
    });

  const [bills, pos, payments, approvals, suppliers, users] = await Promise.all([
    find(req, "supplier-bills"),
    find(req, "purchase-orders"),
    find(req, "payments"),
    find(req, "approvals"),
    find(req, "suppliers"),
    find(req, "users"),
  ]);
  const supName = new Map(suppliers.map((s) => [s.id, str(s.name)]));
  const userName = new Map(users.map((u) => [u.id, str(u.name)]));
  const outPaid = (filter: (p: Doc) => boolean) =>
    payments.filter((p) => p.direction === "out" && filter(p)).reduce((s, p) => s + num(p.amount), 0);

  const payables: Record<string, unknown>[] = [];
  const outflow = Array.from({ length: 8 }, () => FIXED_WEEKLY_EGP / 1000);
  for (const po of pos) {
    if (["Draft", "Awaiting approval", "Cancelled", "Closed"].includes(str(po.status))) continue;
    const side = (po.supplierSide ?? {}) as Record<string, unknown>;
    const bill = bills.find((b) => str(idOf(b.purchaseOrder)) === po.id && b.status !== "Cancelled");
    const paid = outPaid((p) => str(idOf(p.purchaseOrder)) === po.id || (bill ? str(idOf(p.bill)) === bill.id : false));
    const total = num(bill?.amount ?? po.total);
    const balance = round2(Math.max(0, total - paid));
    if (!balance) continue;
    const deposit = round2((num(po.total) * num(side.depositPct)) / 100);
    const depositApproval = approvals.find(
      (a) =>
        /deposit/i.test(str(a.type)) &&
        (str(a.detail).includes(str(po.number)) || str(a.title).includes(str(po.number))),
    );
    // A deposit not yet paid comes first (it's due now, whatever the bill says).
    const depositDue = deposit > 0 && paid < deposit;
    const due = depositDue
      ? DEMO_NOW.toISOString()
      : str(bill?.dueDate) || str(side.balanceDue) || addDays(DEMO_NOW, 30);
    const stage = depositDue
      ? "Deposit to pay"
      : bill?.status === "On hold"
        ? "Bill on hold"
        : paid && side.balanceDue
          ? "Balance on delivery"
          : bill
            ? paid
              ? "Balance due"
              : "Bill matched"
            : "Awaiting bill";
    payables.push({
      id: po.id,
      po: po.number,
      case: str(idOf(po.case)),
      caseId: caseById.get(str(idOf(po.case)))?.caseId ?? null,
      supplier: str(idOf(po.supplier)),
      supplierName: supName.get(str(idOf(po.supplier))) ?? "",
      currency: bill?.currency ?? po.currency,
      total,
      paid: round2(paid),
      balance,
      deposit,
      depositPct: num(side.depositPct),
      depositApproval: depositApproval ? { id: depositApproval.id, status: depositApproval.status } : null,
      bill: bill ? { id: bill.id, number: bill.billNumber, status: bill.status, holdReason: bill.holdReason } : null,
      due,
      stage,
    });
    if (stage !== "Bill on hold")
      outflow[Math.min(7, weekOf(due))] +=
        toEgp(depositDue ? deposit - paid : balance, bill?.currency ?? po.currency) / 1000;
  }
  payables.sort((a, b) => str(a.due).localeCompare(str(b.due)));

  const paymentTypes = ["Supplier deposit (payment)", "Supplier payment"];
  const recorded = new Set(payments.map((p) => str(idOf(p.approval))).filter(Boolean));
  const approvalRows = approvals
    .filter((a) => paymentTypes.includes(str(a.type)))
    .filter((a) => !(a.status === "Approved" && recorded.has(a.id)) && a.status !== "Rejected")
    .map((a) => {
      const po = pos.find((p) => str(a.detail).includes(str(p.number)) || str(a.title).includes(str(p.number)));
      const side = (po?.supplierSide ?? {}) as Record<string, unknown>;
      const amount = po
        ? round2(
            /deposit/i.test(str(a.type))
              ? (num(po.total) * num(side.depositPct || 100)) / 100
              : num(po.total) - outPaid((p) => str(idOf(p.purchaseOrder)) === po.id),
          )
        : 0;
      const decisions = (
        (a.decisions as { user?: unknown; decision?: string; reason?: string }[] | undefined) ?? []
      ).map((d) => ({
        user: str(idOf(d.user)),
        name: userName.get(str(idOf(d.user))) ?? "",
        decision: d.decision,
        reason: d.reason,
      }));
      return {
        id: a.id,
        title: a.title,
        type: a.type,
        detail: a.detail,
        status: a.status,
        caseId: caseById.get(str(idOf(a.case)))?.caseId ?? null,
        case: str(idOf(a.case)) || null,
        approvers: ((a.approvers as unknown[] | undefined) ?? []).map((u) => ({
          id: str(idOf(u)),
          name: userName.get(str(idOf(u))) ?? "",
        })),
        decisions,
        po: po
          ? { id: po.id, number: po.number, supplier: supName.get(str(idOf(po.supplier))) ?? "", currency: po.currency }
          : null,
        amount,
        kind: /deposit/i.test(str(a.type)) ? "Deposit / advance" : "Balance",
        canDecide:
          ((a.approvers as unknown[] | undefined) ?? []).map((u) => str(idOf(u))).includes(str(user.id)) &&
          !decisions.some((d) => d.user === user.id) &&
          !["Approved", "Rejected"].includes(str(a.status)),
      };
    });

  const bankChanges = approvals
    .filter((a) => a.type === "Bank detail change")
    .map((a) => {
      const reqInfo = BANK_REQUESTS[a.id];
      const decisions = (
        (a.decisions as { user?: unknown; decision?: string; reason?: string; at?: string }[] | undefined) ?? []
      ).map((d) => ({
        user: str(idOf(d.user)),
        name: userName.get(str(idOf(d.user))) ?? "",
        decision: d.decision,
        reason: d.reason,
        at: d.at,
      }));
      const supplier = reqInfo ? suppliers.find((s) => s.id === reqInfo.supplier) : undefined;
      const bank = (supplier?.bank ?? {}) as Record<string, unknown>;
      return {
        id: a.id,
        title: a.title,
        status: a.status,
        detail: a.detail,
        request: reqInfo ?? null,
        supplierName: supplier?.name ?? "",
        applied: Boolean(reqInfo && bank.iban === reqInfo.requested.iban && bank.verified),
        approvers: ((a.approvers as unknown[] | undefined) ?? []).map((u) => ({
          id: str(idOf(u)),
          name: userName.get(str(idOf(u))) ?? "",
        })),
        decisions,
        canDecide:
          ((a.approvers as unknown[] | undefined) ?? []).map((u) => str(idOf(u))).includes(str(user.id)) &&
          !decisions.some((d) => d.user === user.id) &&
          !["Approved", "Rejected"].includes(str(a.status)),
      };
    });

  return Response.json({
    ...base,
    canSeePayables: true,
    canFinance: canFinance(req),
    payables,
    payablesTotalEgp: Math.round(payables.reduce((s, p) => s + toEgp(num(p.balance), p.currency), 0)),
    approvals: approvalRows,
    bankChanges,
    cashIn: inflow.map(Math.round),
    cashOut: outflow.map(Math.round),
    fixedWeeklyEgp: FIXED_WEEKLY_EGP,
  });
}

/**
 * POST /api/operations/collection-draft { invoice } — the AI drafts a reminder that respects the
 * customer's contact rule: do-not-chase → an internal reminder only; otherwise a customer email
 * that a person reviews and sends.
 */
async function collectionDraft(req: PayloadRequest) {
  if (!req.user) return fail("Sign in first.", 401);
  return collectionDraftFor(req, str((await body(req)).invoice));
}

/** The reminder draft for one invoice (also behind the cash page's reminders, ./cash.ts). */
export async function collectionDraftFor(req: PayloadRequest, invoice: string) {
  if (!req.user) return fail("Sign in first.", 401);
  const inv = await byId(req, "invoices", invoice);
  if (!inv) return fail("Invoice not found.", 404);
  const customer = await byId(req, "customers", str(idOf(inv.customer)));
  const rule = str(customer?.contactRule) || "allowed";
  const days = Math.floor((DEMO_NOW.getTime() - new Date(str(inv.dueDate)).getTime()) / DAY);
  const money = `${str(inv.currency)} ${num(inv.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  const due = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(str(inv.dueDate)));
  if (rule === "do-not-chase")
    return Response.json({
      mode: "internal",
      rule,
      title: `Internal: ${str(inv.number)} ${money} ${days > 0 ? `${days} days overdue` : `due ${due}`} — ${str(customer?.name)}`,
      body: `${str(customer?.name)} must not be chased (account rule). Check the payment run with the account owner at the next scheduled call; escalate to Karim Balbaa if still open after 60 days. No message goes to the customer.`,
      confidence: 1,
    });
  const contact = ((customer?.contacts as { name?: string; email?: string }[] | undefined) ?? [])[0];
  const greeting = contact?.name ? `Dear ${contact.name.split(" ")[0]},` : "Dear accounts team,";
  return Response.json({
    mode: "customer",
    rule,
    to: contact?.email ?? str(customer?.contactEmail),
    title: `Reminder: ${str(inv.number)} ${days > 0 ? `${days} days overdue` : `due ${due}`} — ${str(customer?.name)}`,
    subject: `Golden Sea invoice ${str(inv.number)} — ${money} ${days > 0 ? "overdue" : `due ${due}`}`,
    body: `${greeting}

Our invoice ${str(inv.number)} for ${money} ${days > 0 ? `fell due on ${due}` : `is due on ${due}`}${num(inv.paid) ? ` (balance after your payment of ${str(inv.currency)} ${num(inv.paid).toLocaleString("en-US")})` : ""}. Could you let us know when it is scheduled for payment? A copy of the invoice and the signed delivery note are attached.

If it has already been paid, please send us the remittance so we can allocate it.

Kind regards,
Golden Sea — Accounts`,
    confidence: 0.92,
    note:
      rule === "one-follow-up"
        ? "Account rule: one follow-up per invoice — this is it; later reminders are internal."
        : "Account rule: follow-ups allowed.",
  });
}

export const operationsEndpoints: Endpoint[] = [
  { path: "/operations/case/:id", method: "get", handler: caseOps as Endpoint["handler"] },
  { path: "/operations/po-check", method: "post", handler: poCheck as Endpoint["handler"] },
  { path: "/operations/po-amend", method: "post", handler: poAmend as Endpoint["handler"] },
  { path: "/operations/po-award", method: "post", handler: poAward as Endpoint["handler"] },
  { path: "/operations/po-award-undo", method: "post", handler: poAwardUndo as Endpoint["handler"] },
  { path: "/operations/confirm-order", method: "post", handler: confirmOrder as Endpoint["handler"] },
  { path: "/operations/po-recheck", method: "post", handler: poRecheck as Endpoint["handler"] },
  { path: "/operations/eta-change", method: "post", handler: etaChange as Endpoint["handler"] },
  { path: "/operations/confirm-delivery", method: "post", handler: confirmDelivery as Endpoint["handler"] },
  { path: "/operations/invoice-delivery", method: "post", handler: invoiceDelivery as Endpoint["handler"] },
  { path: "/operations/einvoice", method: "post", handler: eInvoice as Endpoint["handler"] },
  { path: "/operations/cash", method: "get", handler: cash as Endpoint["handler"] },
  { path: "/operations/collection-draft", method: "post", handler: collectionDraft as Endpoint["handler"] },
];
