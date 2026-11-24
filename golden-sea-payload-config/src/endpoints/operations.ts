import type { Endpoint, PayloadRequest } from "payload";
import { reminderDraft } from "../collections/finance.ts";
import { backorderOf, payableOf } from "../collections/fulfilment.ts";
import { idOf, logActivity } from "../collections/shared.ts";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import { DEMO_NOW } from "./home.ts";
import * as link from "../links.ts";
import { m } from "../i18n/paraglide/messages.js";
import { type Lang, intlLocale, langOf, optionLabel } from "./insights-shared.ts";

/**
 * Root endpoints for order-to-cash: the customer PO check (PO vs approved quotation version,
 * amendments, partial awards), supplier POs (re-check before confirming), receipts and backorders,
 * vessel delivery (ETA re-planning, proof of delivery), invoicing from delivered quantities, the
 * Egyptian e-invoice submission (safe retries), and receivables & payables. Registered in ./index.ts.
 *
 * Everything an AI or an integration does here is a deterministic stub: the PO "reading", the
 * supplier re-check, the agent's ETA email, the tax authority's answer and the collection draft.
 * People confirm every write in the dashboard (the widgets in src/pages/case-order.ts,
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
        description: "Fuel injection valve nozzle, aux. engine Yanmar 6EY18ALW",
        qty: 6,
        unit: "pcs",
        sellPrice: 402.17,
        sources: [{ supplier: "S1", qty: 6, cost: 14500 }],
        route: "warehouse",
      },
      {
        lineNo: 2,
        description: "Piston ring set (one cylinder), Yanmar 6EY18ALW",
        qty: 6,
        unit: "set",
        sellPrice: 513.11,
        sources: [{ supplier: "S1", qty: 6, cost: 18500 }],
        route: "warehouse",
      },
      {
        lineNo: 3,
        description: "Turbocharger overhaul kit, MAN NR20/S",
        qty: 1,
        unit: "set",
        sellPrice: 8595.16,
        sources: [{ supplier: "S1", qty: 1, cost: 309920 }],
        route: "warehouse",
      },
      {
        lineNo: 4,
        description: "Safety helmet EN 397, white, with chin strap",
        qty: 12,
        unit: "EA",
        sellPrice: 9.43,
        sources: [{ supplier: "S1", qty: 12, cost: 340 }],
        route: "warehouse",
      },
    ],
  },
};

/** Amendment wording the AI proposes for known mismatches (a person records it), in English and Arabic. */
const SUGGESTIONS: Record<string, { en: string; ar: string }> = {
  "NSM-PO-77104|1|Pack size": {
    en: "Customer amendment: PO line 1 → 48 × 400 ml (email Ingrid L. 17 Nov 08:40)",
    ar: "تعديل من العميل: بند أمر الشراء 1 ← 48 × 400 مل (بريد Ingrid L. في 17 نوفمبر 08:40)",
  },
  "NSM-PO-77104|3|Price": {
    en: "Customer accepted the v2 price USD 11.20 for line 3 (email Ingrid L. 17 Nov 08:40)",
    ar: "قبل العميل سعر النسخة v2 وهو USD 11.20 للبند 3 (بريد Ingrid L. في 17 نوفمبر 08:40)",
  },
  "NSM-PO-77104|3|Quantity": {
    en: "Customer confirmed 10 EA, as quoted — not 15 (email Ingrid L. 17 Nov 08:40)",
    ar: "أكّد العميل 10 قطع كما في العرض، وليس 15 (بريد Ingrid L. في 17 نوفمبر 08:40)",
  },
  "NSM-PO-77231|3|Pack size": {
    en: "Customer amendment: PO line 3 → 100 × 500 ml (email 17 Nov 11:02)",
    ar: "تعديل من العميل: بند أمر الشراء 3 ← 100 × 500 مل (بريد في 17 نوفمبر 11:02)",
  },
  "NSM-PO-77231|5|Quantity": {
    en: "Customer confirmed 15 EA (email 17 Nov 11:02)",
    ar: "أكّد العميل 15 قطعة (بريد في 17 نوفمبر 11:02)",
  },
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

/** A case's order book: what it sells at what price, and from which suppliers. */
function orderBook(caseId: string): Plan | undefined {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return ORDER_BOOK[caseId];
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "a case's order book (sell prices, supplier sources and costs, routes) from its approved quotation and selected offers, not the fixed ORDER_BOOK",
    );
  }
}

/** The customer's PO waiting to be read for a case: its number, billing entity and the AI's line checks. */
function incomingCustomerPo(caseId: string): Plan["incomingPo"] {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    // The PO that "arrives" for the flagship case, already read: the order book's `incomingPo`.
    return orderBook(caseId)?.incomingPo;
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "the customer's PO from the mailbox, and the AI model reading it against the approved quotation",
    );
  }
}

/** The AI's wording for the amendment that resolves a PO mismatch (a person records it). */
function amendmentSuggestion(key: string, lang: Lang): string | undefined {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return SUGGESTIONS[key]?.[lang];
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError("the AI model drafting the amendment wording for a customer PO mismatch");
  }
}

/** The shipping agent's latest ETA email for a case (none: nothing new). */
function agentEtaUpdate(caseId: string): { eta: string; from: string; text: string } | undefined {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return ETA_UPDATES[caseId];
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError("the shipping agent's ETA email from the mailbox, read into the vessel's new ETA");
  }
}

/** The request behind a bank-detail change approval: the supplier, its current and requested account, how it came in. */
export function bankRequest(approval: string): (typeof BANK_REQUESTS)[string] | undefined {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return BANK_REQUESTS[approval];
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "a bank-detail change request (supplier, current and requested account, the message it came in, the phones) stored with its approval, not the fixed BANK_REQUESTS",
    );
  }
}

/** The fixed weekly outgoings (payroll, rent, fleet) in EGP. */
function fixedWeeklyEgp(): number {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return FIXED_WEEKLY_EGP;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the fixed weekly outgoings (payroll, rent, fleet) from the budget, not a fixed EGP 165,000",
    );
  }
}

/** The Monday the cash forecast's eight weeks start on. */
function forecastStart(): number {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // Monday 16 Nov (the demo's week).
    return new Date("2026-11-16T00:00:00.000Z").getTime();
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("the cash forecast's first week: the Monday of the current week, not Monday 16 Nov 2026");
  }
}

/** A supplier's side of a new PO (its deposit terms). */
function supplierTerms(supplier: string): Record<string, unknown> {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // Horizon Trading, the new supplier, asks 50% in advance.
    return supplier === "S5" ? { depositPct: 50 } : {};
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("a supplier's deposit terms from its record or its selected offer, not 50% for S5");
  }
}

/* ---------------------------------------------------------------- helpers */

type U = { id?: string; role?: string; name?: string } | null | undefined;
const userOf = (req: PayloadRequest) => req.user as U;
const isSales = (req: PayloadRequest) => userOf(req)?.role === "sales";
const FINANCE_ROLES = ["management", "finance-director", "operations"];
const canFinance = (req: PayloadRequest) => FINANCE_ROLES.includes(String(userOf(req)?.role));

const fail = (message: string, status = 400) => Response.json({ errors: [{ message }] }, { status });
/** The request's language, as Paraglide's options. */
const loc = (req: PayloadRequest) => ({ locale: langOf(req) });
/** "Sign in first." in the request's language. */
const signIn = (req: PayloadRequest) => fail(m.api_operations_sign_in_first({}, loc(req)), 401);
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
      locale: req.locale,
      collection: collection as never,
      where: where as never,
      depth: 0,
      limit: 0,
    } as never)
  ).docs as unknown as Doc[];

const byId = (req: PayloadRequest, collection: string, id: string) =>
  req.payload
    .findByID({ locale: req.locale, collection: collection as never, id, depth: 0 })
    .catch(() => null) as Promise<Doc | null>;

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
  const out: Partial<Record<Cur, number>> = { EGP: 1 };
  try {
    const g = (await req.payload.findGlobal({ locale: req.locale, slug: "fx-rates" as never, depth: 0 } as never)) as {
      rates?: { currency?: string; egpPerUnit?: number; status?: string }[];
    };
    for (const r of g.rates ?? []) if (r.status === "Active" && r.currency) out[r.currency as Cur] = num(r.egpPerUnit);
  } catch {
    /* defaults */
  }
  if (out.USD === undefined || out.EUR === undefined) {
    if (IS_TEMP_MOCK) {
      // TODO replace temporary mock logic with proper polished logic
      out.USD ??= 48.6;
      out.EUR ??= 52.9;
    } else {
      // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
      throw new TempMockError(
        "an active USD and EUR rate in the fx-rates global, with no fixed fallback (48.60, 52.90)",
      );
    }
  }
  return out as Record<Cur, number>;
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
  const p = orderBook(caseId);
  if (!p || !sales) return p;
  return { ...p, lines: p.lines.map(({ sources: _s, ...l }) => l), recheck: undefined };
}

/* ---------------------------------------------------------------- GET /api/operations/case/:id */

/** Everything the "Order & purchasing" and "Delivery & billing" tabs show for one case. */
async function caseOps(req: PayloadRequest) {
  const user = userOf(req);
  const t = loc(req);
  if (!user) return fail(m.api_insights_shared_not_allowed({}, t), 401);
  const id = str(req.routeParams?.id);
  const c = await byId(req, "cases", id);
  if (!c) return fail(m.api_operations_case_not_found({}, t), 404);
  const sales = isSales(req);
  const where = { case: { equals: id } };
  const [cpos, pos, receipts, deliveries, invoices, activities] = await Promise.all([
    find(req, "customer-pos", where),
    find(req, "purchase-orders", where),
    find(req, "receipts", where),
    find(req, "deliveries", where),
    find(req, "invoices", where),
    find(req, "activities", where),
  ]);
  const poIds = pos.map((p) => p.id);
  const [bills, names] = await Promise.all([
    poIds.length ? find(req, "supplier-bills", { purchaseOrder: { in: poIds } }) : Promise.resolve([] as Doc[]),
    supplierNames(req),
  ]);
  const plan = planFor(id, sales);
  const cpo = cpos.sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt)))[0] ?? null;
  const quotation = cpo ? await byId(req, "quotations", str(idOf(cpo.quotation))) : null;

  // The supplier POs, bills and receipts as the case's workflow reads them (the invoices only to
  // know which drops are invoiced); their tables and the invoiced balance read the collections themselves (their fields, ../collections/fulfilment.ts and finance.ts).
  const purchaseOrders = pos
    .sort((a, b) => str(a.number).localeCompare(str(b.number)))
    .map((p) => ({
      id: p.id,
      number: p.number,
      supplier: str(idOf(p.supplier)),
      supplierName: names.get(str(idOf(p.supplier))) ?? str(idOf(p.supplier)),
      status: p.status,
      recheck: sales ? [] : (p.recheck ?? []),
      recheckDone: p.recheckDone,
    }));

  const supplierBills = sales ? [] : bills.map((b) => ({ id: b.id, billNumber: b.billNumber, status: b.status }));

  const supplierOfPo = new Map(pos.map((p) => [p.id, names.get(str(idOf(p.supplier))) ?? ""]));
  const receiptRows = receipts
    .sort((a, b) => num(a.lineNo) - num(b.lineNo))
    .map((r) => ({
      id: r.id,
      lineNo: r.lineNo,
      description: plan?.lines.find((l) => l.lineNo === r.lineNo)?.description ?? "",
      supplierName: supplierOfPo.get(str(idOf(r.purchaseOrder))) ?? "",
      ordered: r.ordered,
      received: r.received,
      shortfall: r.shortfall,
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
        description:
          plan?.lines.find((x) => x.lineNo === l.lineNo)?.description ?? m.api_operations_line({ n: l.lineNo }, t),
      })),
      dispatchedAt: d.dispatchedAt,
      confirmedAt: d.confirmedAt,
      confirmedBy: d.confirmedBy,
      proof: Boolean(d.proof),
      shortages: d.shortages,
      invoice: invoicedBy(d),
    }));

  // Backorders: receipt shortfalls that follow in a later drop (the receipt's own `backorderOf`),
  // with an owner and a date.
  const backorders = receiptRows.flatMap((r) => {
    const b = backorderOf(r, deliveries);
    return b
      ? [
          {
            lineNo: r.lineNo,
            description: r.description,
            qty: r.shortfall,
            supplierName: r.supplierName,
            date: r.backorderDate,
            owner: str(idOf(c.owner)),
            ...b,
          },
        ]
      : [];
  });

  const quotedLines = plan?.lines ?? [];
  const checks = ((cpo?.checks as Check[] | undefined) ?? []).map((ch) => ({
    ...ch,
    suggestion: amendmentSuggestion(`${str(cpo?.number)}|${ch.lineNo}|${ch.field}`, t.locale),
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
    poExpected: Boolean(incomingCustomerPo(id)) && !cpo,
    orderConfirmed: /sales order confirmed|Purchasing|Delivering|Delivered|Invoiced|Closed/.test(str(c.stage)),
    purchaseOrders,
    bills: supplierBills,
    receipts: receiptRows.map((r) => ({ lineNo: r.lineNo, ordered: r.ordered, received: r.received })),
    deliveries: deliveryRows,
    backorders,
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
  if (!req.user) return signIn(req);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const existing = (await find(req, "customer-pos", { case: { equals: id } }))[0];
  if (existing) {
    // Re-run: the same reading, keeping recorded resolutions (idempotent).
    const doc = await update(req, "customer-pos", existing.id, { checks: existing.checks });
    return Response.json({ doc, created: false, confidence: 0.96 });
  }
  const t = loc(req);
  const incoming = incomingCustomerPo(id);
  if (!incoming) return fail(m.api_operations_no_customer_po_yet({}, t));
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
    nextAction: open
      ? m.api_operations_resolve_mismatches({ n: open }, t)
      : m.api_operations_confirm_sales_order({}, t),
    blocker: open ? m.api_operations_commitment_blocked({}, t) : "",
  });
  await logActivity(req, {
    case: id,
    kind: "auto",
    text: m.api_operations_po_read_activity({ number: incoming.number, caseId: str(c?.caseId), open }, t),
  });
  return Response.json({ doc, created: true, confidence: 0.96 });
}

/** POST /api/operations/po-amend { po, index, resolution, evidence? } — records the customer's written agreement. */
async function poAmend(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const b = await body(req);
  const t = loc(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail(m.api_operations_customer_po_not_found({}, t), 404);
  const resolution = str(b.resolution).trim();
  if (!resolution) return fail(m.api_operations_describe_agreement({}, t));
  if (!b.evidence) return fail(m.api_operations_attach_confirmation({}, t));
  const checks = [...((po.checks as Check[] | undefined) ?? [])];
  const i = num(b.index);
  if (!checks[i] || checks[i].matches) return fail(m.api_operations_no_mismatch({}, t));
  checks[i] = { ...checks[i], resolution, evidence: b.evidence };
  const doc = await update(req, "customer-pos", po.id, { checks });
  const caseId = str(idOf(po.case));
  await logActivity(req, {
    case: caseId,
    text: m.api_operations_amend_activity(
      {
        number: str(po.number),
        line: checks[i].lineNo || m.api_operations_header({}, t),
        field: optionLabel(req, "customer-pos", "checks.field", checks[i].field),
        resolution,
      },
      t,
    ),
  });
  if (doc.status === "Validated")
    await update(req, "cases", caseId, {
      tone: "info",
      blocker: "",
      nextAction: m.api_operations_confirm_and_prepare({}, t),
    });
  return Response.json({ doc });
}

/** POST /api/operations/po-award { po, lineNo, outcome, reason } — partial award: keep a line open or close it. */
async function poAward(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const b = await body(req);
  const t = loc(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail(m.api_operations_customer_po_not_found({}, t), 404);
  const outcome = str(b.outcome);
  const reason = str(b.reason).trim();
  if (!["Open — revision to follow", "Closed"].includes(outcome)) return fail(m.api_operations_keep_or_close({}, t));
  if (outcome === "Closed" && !reason) return fail(m.api_operations_closing_needs_reason({}, t));
  const lineNo = num(b.lineNo);
  const all = (po.unawarded as Unawarded[] | undefined) ?? [];
  const was = all.find((u) => u.lineNo === lineNo);
  const rest = all.filter((u) => u.lineNo !== lineNo);
  const doc = await update(req, "customer-pos", po.id, { unawarded: [...rest, { lineNo, outcome, reason }] });
  await logActivity(req, {
    case: str(idOf(po.case)),
    text: m.api_operations_not_awarded_activity(
      {
        line: lineNo,
        outcome: optionLabel(req, "customer-pos", "unawarded.outcome", outcome),
        hasReason: reason ? "yes" : "no",
        reason,
      },
      t,
    ),
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
  if (!req.user) return signIn(req);
  const b = await body(req);
  const t = loc(req);
  const po = await byId(req, "customer-pos", str(b.po));
  if (!po) return fail(m.api_operations_customer_po_not_found({}, t), 404);
  const lineNo = num(b.lineNo);
  const all = (po.unawarded as Unawarded[] | undefined) ?? [];
  const now = all.find((u) => u.lineNo === lineNo);
  if (!now || now.outcome !== str(b.outcome)) return fail(m.api_operations_decided_again({ line: lineNo }, t), 409);
  const caseId = str(idOf(po.case));
  if ((await find(req, "purchase-orders", { case: { equals: caseId } })).length)
    return fail(m.api_operations_decision_stands({}, t), 409);
  const was = b.was && typeof b.was === "object" ? (b.was as Unawarded) : null;
  if (was && was.outcome !== "Open — revision to follow") return fail(m.api_operations_back_to_undecided({}, t));
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
    text: m.api_operations_award_undo_activity(
      {
        line: lineNo,
        outcome: optionLabel(req, "customer-pos", "unawarded.outcome", b.outcome),
        hasWas: was ? "yes" : "no",
        was: was ? optionLabel(req, "customer-pos", "unawarded.outcome", was.outcome) : "",
      },
      t,
    ),
  });
  return Response.json({
    doc,
    message: was
      ? m.api_operations_kept_open_again({ line: lineNo }, t)
      : m.api_operations_undecided_again({ line: lineNo }, t),
  });
}

/** POST /api/operations/confirm-order { case } — sales order confirmed; supplier POs prepared for approval. */
async function confirmOrder(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const t = loc(req);
  const po = (await find(req, "customer-pos", { case: { equals: id } }))[0];
  if (!po) return fail(m.api_operations_no_customer_po({}, t));
  if (po.status !== "Validated") return fail(m.api_operations_commitment_blocked_by({ n: num(po.openMismatches) }, t));
  const plan = orderBook(id);
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
          supplierSide: supplierTerms(supplier),
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
    nextAction: m.api_operations_recheck_then_approve({}, t),
  });
  await logActivity(req, {
    case: id,
    text: m.api_operations_order_confirmed_activity({ number: str(po.number), n: created.length }, t),
  });
  return Response.json({ created: created.map((p) => p.number) });
}

/** What a supplier says now about a PO's price, availability and lead time, against the quotation. */
function supplierRecheck(caseId: string, supplier: string, t: { locale: Lang }) {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    // The supplier's answers, from the order book; any other supplier confirms everything unchanged.
    return (
      ORDER_BOOK[caseId]?.recheck?.[supplier] ?? [
        {
          item: m.api_operations_recheck_price({}, t),
          atQuotation: m.api_operations_as_quoted({}, t),
          now: m.api_operations_unchanged({}, t),
          ok: true,
        },
        {
          item: m.api_operations_recheck_availability({}, t),
          atQuotation: m.api_operations_as_quoted({}, t),
          now: m.api_operations_confirmed_by_phone({}, t),
          ok: true,
        },
      ]
    );
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "the supplier's reconfirmation of price, availability and lead time before a PO is confirmed (email or portal)",
    );
  }
}

/** POST /api/operations/po-recheck { po } — re-checks price, availability, FX and lead time before confirming. */
async function poRecheck(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const t = loc(req);
  if (isSales(req)) return fail(m.api_operations_costs_hidden_sales({}, t), 403);
  const { po: poId } = await body(req);
  const po = await byId(req, "purchase-orders", str(poId));
  if (!po) return fail(m.api_operations_po_not_found({}, t), 404);
  const rows = supplierRecheck(str(idOf(po.case)), str(idOf(po.supplier)), t);
  const doc = await update(req, "purchase-orders", po.id, {
    recheck: rows,
    recheckDone: true,
  });
  const changed = rows.filter((r) => !r.ok);
  await logActivity(req, {
    case: str(idOf(po.case)),
    kind: changed.length ? "alert" : "auto",
    text: m.api_operations_recheck_activity(
      {
        number: str(po.number),
        changes: changed.length
          ? changed.map((r) => `${r.item} → ${r.now}`).join(t.locale === "ar" ? "؛ " : "; ")
          : m.api_operations_no_changes({}, t),
      },
      t,
    ),
  });
  return Response.json({ doc, changed: changed.length });
}

/* ---------------------------------------------------------------- delivery */

/** POST /api/operations/eta-change { case } — the agent's ETA email: every open drop, booking and task re-planned. */
async function etaChange(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const { case: caseId } = await body(req);
  const id = str(caseId);
  const t = loc(req);
  const c = await byId(req, "cases", id);
  const upd = agentEtaUpdate(id);
  if (!c || !upd) return fail(m.api_operations_no_eta_update({}, t));
  if (str(c.eta) === upd.eta) return Response.json({ changed: 0, message: m.api_operations_eta_up_to_date({}, t) });
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
    plan.launch = m.api_operations_launch_rebooked(
      { launch: str(plan.launch).split(" — ")[0] || m.api_operations_launch_boat({}, t), at: fmt(plannedAt, t.locale) },
      t,
    );
    await update(req, "deliveries", d.id, { plannedAt, plan, status: "Rescheduled" });
    moved.push(str(d.number));
    await create(req, "tasks", {
      title: m.api_operations_reconfirm_task({ number: str(d.number), hours: `${hours >= 0 ? "+" : ""}${hours}` }, t),
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
    blocker: m.api_operations_eta_moved_blocker({ hours: `${hours >= 0 ? "+" : ""}${hours}`, n: moved.length }, t),
    tone: "warn",
  });
  const text = m.api_operations_eta_change_activity(
    {
      from: upd.from,
      was: fmt(str(c.eta), t.locale),
      now: fmt(upd.eta, t.locale),
      email: upd.text,
      moved: moved.join(t.locale === "ar" ? "، " : ", ") || m.api_operations_nothing_open({}, t),
    },
    t,
  );
  await logActivity(req, { case: id, kind: "alert", text });
  await notify(req, [str(idOf(c.owner)), "kb"], {
    title: m.api_operations_eta_notification({ caseId: str(c.caseId), at: fmt(upd.eta, t.locale) }, t),
    detail: m.api_operations_eta_notification_detail({ n: moved.length }, t),
    kind: "Alert",
    href: link.doc("cases", id, "delivery"),
  });
  return Response.json({ changed: moved.length, moved, eta: upd.eta, hours, text });
}

const fmt = (iso: string, lang: Lang = "en") =>
  iso
    ? new Intl.DateTimeFormat(intlLocale(lang), {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(iso))
    : "—";

/** POST /api/operations/confirm-delivery { delivery, proof, signedBy, shortages? } — delivered only with evidence. */
async function confirmDelivery(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const b = await body(req);
  const t = loc(req);
  const d = await byId(req, "deliveries", str(b.delivery));
  if (!d) return fail(m.api_operations_delivery_not_found({}, t), 404);
  if (!str(b.signedBy).trim()) return fail(m.api_operations_who_signed({}, t));
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
      nextAction: m.api_operations_invoice_delivered({ number: str(d.number) }, t),
    });
    await logActivity(req, {
      case: caseId,
      text: m.api_operations_delivered_activity({ number: str(d.number), signedBy: str(b.signedBy) }, t),
    });
    return Response.json({ doc });
  });
}

/* ---------------------------------------------------------------- invoicing & e-invoice */

/** POST /api/operations/invoice-delivery { delivery } — invoice exactly what was delivered (never twice). */
async function invoiceDelivery(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  const t = loc(req);
  if (!canFinance(req)) return fail(m.api_operations_invoices_by_finance({}, t), 403);
  const b = await body(req);
  const d = await byId(req, "deliveries", str(b.delivery));
  if (!d) return fail(m.api_operations_delivery_not_found({}, t), 404);
  if (d.status !== "Delivered — confirmed") return fail(m.api_operations_only_confirmed_invoiced({}, t));
  const caseId = str(idOf(d.case));
  const [c, all] = await Promise.all([
    byId(req, "cases", caseId),
    find(req, "deliveries", { case: { equals: caseId } }),
  ]);
  const customer = c ? await byId(req, "customers", str(idOf(c.customer))) : null;
  const plan = orderBook(caseId);
  if (!c || !customer || !plan) return fail(m.api_operations_no_order_book({}, t));
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
      description: book?.description ?? m.api_operations_line({ n: l.lineNo }, t),
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
    await update(req, "cases", caseId, {
      nextAction: m.api_operations_submit_einvoice({ number: str(doc.number) }, t),
    });
    await logActivity(req, {
      case: caseId,
      text: m.api_operations_invoice_created_activity(
        {
          number: str(doc.number),
          delivery: str(d.number),
          lines: lines.map((l) => `L${l.lineNo} × ${l.qty}`).join(t.locale === "ar" ? "، " : ", "),
        },
        t,
      ),
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
  if (!req.user) return signIn(req);
  const t = loc(req);
  if (!canFinance(req)) return fail(m.api_operations_einvoices_by_finance({}, t), 403);
  const b = await body(req);
  const inv = await byId(req, "invoices", str(b.invoice));
  if (!inv) return fail(m.api_operations_invoice_not_found({}, t), 404);
  const e = { ...(inv.eInvoice as Record<string, unknown> | undefined) };
  const billing = { ...(inv.billing as Record<string, unknown> | undefined) };
  if (e.status === "Valid")
    return Response.json({ doc: inv, result: "already-valid", message: m.api_operations_already_accepted({}, t) });
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return simulatedEInvoice(req, inv, e, billing, str(b.taxId), t);
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "the Egyptian Tax Authority's e-invoicing API: signing and submitting an invoice, and reading back its status",
    );
  }
}

/** The tax authority's answers, simulated: Submitted, then Valid on the next call; a 14% invoice without a 9-digit tax ID is rejected. */
async function simulatedEInvoice(
  req: PayloadRequest,
  inv: Doc,
  e: Record<string, unknown>,
  billing: Record<string, unknown>,
  taxId: string,
  t: { locale: Lang },
) {
  if (e.status === "Submitted") {
    const doc = await update(req, "invoices", inv.id, { eInvoice: { ...e, status: "Valid", error: null } });
    await logActivity(req, {
      case: str(idOf(inv.case)),
      kind: "auto",
      text: m.api_operations_einvoice_valid_activity({ number: str(inv.number), uuid: str(e.uuid) }, t),
    });
    return Response.json({
      doc,
      result: "valid",
      message: m.api_operations_einvoice_valid({ number: str(inv.number) }, t),
    });
  }
  if (taxId) billing.taxId = taxId;
  // The rejected one: the buyer's tax registration number must have 9 digits.
  if (inv.vatTreatment === "14% standard" && !/^\d{9}$/.test(str(billing.taxId).replace(/\D/g, ""))) {
    const doc = await update(req, "invoices", inv.id, {
      billing,
      eInvoice: {
        ...e,
        status: "Rejected",
        submittedAt: new Date().toISOString(),
        error: m.api_operations_tax_id_error({ taxId: str(billing.taxId) || "—" }, t),
      },
    });
    return Response.json({ doc, result: "rejected", message: m.api_operations_rejected_tax_id({}, t) });
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
    text: m.api_operations_einvoice_submitted_activity({ number: str(inv.number), uuid }, t),
  });
  return Response.json({
    doc,
    result: "submitted",
    message: m.api_operations_einvoice_submitted({ number: str(inv.number) }, t),
  });
}

function hash(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return h || 1;
}

/* ---------------------------------------------------------------- receivables & payables */

/**
 * GET /api/operations/cash — the 8-week cash forecast (across invoices, supplier POs, bills, payments
 * and the budget), the open invoices a remittance or a reminder reads, payment approvals and bank
 * changes. Receivables and payables themselves are the invoices' and POs' own fields.
 */
export async function cash(req: PayloadRequest) {
  const user = userOf(req);
  if (!user) return fail(m.api_insights_shared_not_allowed({}, loc(req)), 401);
  const sales = isSales(req);
  const fx = await fxRates(req);
  const toEgp = (amount: number, cur: unknown) => amount * (fx[(str(cur) || "EGP") as Cur] ?? 1);
  const [invoices, customers, cases] = await Promise.all([
    find(req, "invoices"),
    find(req, "customers"),
    find(req, "cases"),
  ]);
  const custById = new Map(customers.map((c) => [c.id, c]));
  const caseById = new Map(cases.map((c) => [c.id, c]));

  // Open invoices, as the forecast, a remittance match and a reminder read them (their ageing,
  // USD balance and reminder are the invoices' own fields, ../collections/finance.ts).
  const open = invoices.filter((i) => num(i.balance) > 0 && !["Draft", "Cancelled"].includes(str(i.status)));
  const receivables = open
    .map((i) => ({
      id: i.id,
      number: i.number,
      case: str(idOf(i.case)) || null,
      customer: str(idOf(i.customer)),
      customerName: str(custById.get(str(idOf(i.customer)))?.name),
      currency: i.currency,
      balance: i.balance,
      dueDate: i.dueDate,
      daysOverdue: Math.floor((DEMO_NOW.getTime() - new Date(str(i.dueDate)).getTime()) / DAY),
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  // Eight weeks, from the forecast's first Monday.
  const start = forecastStart();
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
    receivables,
    weeks: weeks.map((w) =>
      new Intl.DateTimeFormat(intlLocale(langOf(req)), { day: "2-digit", month: "short", timeZone: "UTC" }).format(w),
    ),
  };
  if (sales)
    return Response.json({
      ...base,
      canSeePayables: false,
      canFinance: false,
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

  // Committed payments: what each supplier PO's payable has to pay now, by its due week (a bill on
  // hold is left out until it matches). The payable itself is the PO's (../collections/fulfilment.ts).
  const fixed = fixedWeeklyEgp();
  const outflow = Array.from({ length: 8 }, () => fixed / 1000);
  for (const po of pos) {
    const p = payableOf(po, { bills, payments, approvals });
    if (p && p.stage !== "Bill on hold") outflow[Math.min(7, weekOf(p.due))] += toEgp(p.toPay, p.currency) / 1000;
  }

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
      const reqInfo = bankRequest(a.id);
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
    approvals: approvalRows,
    bankChanges,
    cashIn: inflow.map(Math.round),
    cashOut: outflow.map(Math.round),
    fixedWeeklyEgp: fixed,
  });
}

/**
 * POST /api/operations/collection-draft { invoice } — the AI drafts a reminder that respects the
 * customer's contact rule: do-not-chase → an internal reminder only; otherwise a customer email
 * that a person reviews and sends.
 */
async function collectionDraft(req: PayloadRequest) {
  if (!req.user) return signIn(req);
  return collectionDraftFor(req, str((await body(req)).invoice));
}

/** The reminder draft for one invoice (also behind the cash page's reminders, ./cash.ts). */
/** The AI's collection reminder for one invoice (the invoice's own `reminder` draft, ../collections/finance.ts). */
export async function collectionDraftFor(req: PayloadRequest, invoice: string) {
  if (!req.user) return signIn(req);
  const inv = await byId(req, "invoices", invoice);
  if (!inv) return fail(m.api_operations_invoice_not_found({}, loc(req)), 404);
  const customer = await byId(req, "customers", str(idOf(inv.customer)));
  return Response.json(reminderDraft(inv, customer));
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
