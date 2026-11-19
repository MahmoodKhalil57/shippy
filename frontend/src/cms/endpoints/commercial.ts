import type { Endpoint, PayloadRequest } from "payload";
import { idOf, logActivity } from "../collections/shared.ts";
import type { Doc } from "../../mock/types.ts";
import { DEMO_NOW } from "./home.ts";

/**
 * Root endpoints for: Offer comparison, pricing, quotations, approvals. Registered in ./index.ts.
 *
 * - GET  /api/commercial/cases/:id/compare         offers per line, normalised to EGP per base unit (+ correction drafts)
 * - POST /api/commercial/cases/:id/select          select an offer or a split, with a reason
 * - POST /api/commercial/cases/:id/split           a split from a form: quantities `q0…` for `offers`
 * - POST /api/commercial/cases/:id/accept          record the customer's written acceptance (alternative pack)
 * - POST /api/commercial/cases/:id/correction      draft (and send) a correction request for a deviating offer
 * - GET  /api/commercial/cases/:id/pricing         landed cost, margin vs markup, policy checks
 * - POST /api/commercial/cases/:id/pricing         change allocation / discount / margins (saved on the case)
 * - POST /api/commercial/cases/:id/request-approval snapshot the quotation and ask Karim Balbaa
 * - GET  /api/commercial/quotations/:id            the quotation as the customer gets it, versions, decisions
 * - POST /api/commercial/quotations/:id/:action    request-approval · send · revise · decision · portal-check
 * - GET  /api/commercial/approvals                 the approvals queue with evidence and who can decide
 * - POST /api/commercial/approvals/:id/decide      approve / return with a reason (collection hooks enforce the rules)
 *
 * Sales never sees costs or margins: compare and pricing refuse them (403), quotations omit internals.
 */

export type Tone = "error" | "warning" | "info" | "success" | "neutral";
export interface Flag {
  tone: Tone;
  text: string;
  /** The deviation type it stands for (one flag per type). */
  type?: string;
}

/* ---------------------------------------------------------------- shared helpers */

const DAY = 86_400_000;
const VAT = 0.14;
const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const fmtDay = (v: unknown) =>
  v ? new Date(str(v)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "";
const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
const dayIndex = (d: Date) => Math.floor(d.getTime() / DAY);

const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });
type User = Doc & { name?: string; role?: string };
const userOf = (req: PayloadRequest) => req.user as unknown as User | null;
const roleOf = (req: PayloadRequest) => str(userOf(req)?.role);
const SALES_HIDDEN = "Costs and margins are hidden for your role.";

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function all(req: PayloadRequest, collection: string, where?: Record<string, unknown>): Promise<Doc[]> {
  const r = await req.payload.find({
    collection: collection as never,
    where: where as never,
    pagination: false,
    depth: 0,
  });
  return r.docs as unknown as Doc[];
}
const byId = (docs: Doc[]) => new Map(docs.map((d) => [d.id, d]));
const one = (req: PayloadRequest, collection: string, id: string) =>
  req.payload.findByID({ collection: collection as never, id, depth: 0 }).catch(() => null) as Promise<Doc | null>;
const update = (req: PayloadRequest, collection: string, id: string, data: Record<string, unknown>) =>
  req.payload.update({
    collection: collection as never,
    id,
    data: data as never,
    req,
    depth: 0,
  }) as unknown as Promise<Doc>;
const create = (req: PayloadRequest, collection: string, data: Record<string, unknown>) =>
  req.payload.create({
    collection: collection as never,
    data: data as never,
    req,
    depth: 0,
  }) as unknown as Promise<Doc>;

/** A handler that needs a signed-in user and turns rule errors (hooks) into JSON errors. */
const handle =
  (fn: (req: PayloadRequest) => Promise<Response>, opts: { costs?: boolean } = {}) =>
  async (req: PayloadRequest) => {
    if (!req.user) return fail(401, "You are not allowed to perform this action.");
    if (opts.costs && roleOf(req) === "sales") return fail(403, SALES_HIDDEN);
    try {
      return await fn(req);
    } catch (e) {
      const err = e as Error & { status?: number };
      return fail(err.status ?? 500, err.message);
    }
  };

/* ---------------------------------------------------------------- reference data */

interface Rate {
  currency?: string;
  egpPerUnit?: number;
  date?: string;
  status?: string;
  source?: string;
  proposedBy?: string;
  approvedBy?: string;
}
async function fxRates(req: PayloadRequest) {
  const g = (await req.payload.findGlobal({ slug: "fx-rates" as never, depth: 0 })) as { rates?: Rate[] };
  const rates = g.rates ?? [];
  const fx: Record<string, number> = { EGP: 1 };
  for (const r of rates) if (r.status === "Active" && r.currency) fx[r.currency] = num(r.egpPerUnit, 1);
  fx.USD ??= 48.6;
  fx.EUR ??= 52.9;
  return { fx, rates, label: `Approved FX · USD/EGP ${fx.USD.toFixed(2)} · EUR/EGP ${fx.EUR.toFixed(2)}` };
}

interface Policy {
  targetMarginPct?: number;
  minMarginPct?: number;
  maxDiscountWithoutApprovalPct?: number;
  allocationDefault?: string;
  byStore?: { store?: string; targetPct?: number; minPct?: number; maxDiscountPct?: number }[];
}
const policyOf = async (req: PayloadRequest) =>
  (await req.payload.findGlobal({ slug: "pricing-policy" as never, depth: 0 })) as Policy;

interface Rule {
  type?: string;
  approvers?: string[];
  twoPerson?: boolean;
  note?: string;
}
async function ruleFor(req: PayloadRequest, type: string): Promise<Rule> {
  const g = (await req.payload.findGlobal({ slug: "approval-rules" as never, depth: 0 })) as { rules?: Rule[] };
  const rule = g.rules?.find((r) => r.type === type);
  return {
    type,
    approvers: (rule?.approvers ?? ["kb"]).map((a) => idOf(a) ?? ""),
    twoPerson: rule?.twoPerson,
    note: rule?.note,
  };
}

/* ---------------------------------------------------------------- the case, its lines and offers */

interface Selection {
  offers?: unknown[];
  splitQty?: { offer?: unknown; qty?: number }[];
  reason?: string;
  marginPct?: number;
  customerAccepted?: boolean;
}
interface Item {
  lineNo: number;
  description: string;
  product?: string;
  brand?: string;
  exactBrand?: boolean;
  partNo?: string;
  impa?: string;
  qty: number;
  unit: string;
  packSize?: number;
  store?: string;
  certificates?: string;
  status?: string;
  missing?: string;
  selection?: Selection;
  [k: string]: unknown;
}

interface Ctx {
  req: PayloadRequest;
  c: Doc;
  items: Item[];
  offers: Doc[];
  suppliers: Map<string, Doc>;
  products: Map<string, Doc>;
  stock: Doc[];
  pricelists: Doc[];
  rfqs: Doc[];
  fx: Record<string, number>;
  fxLabel: string;
  daysToEta: number;
}

export async function load(req: PayloadRequest, caseId: string): Promise<Ctx | null> {
  const c = await one(req, "cases", caseId);
  if (!c) return null;
  const [offers, suppliers, products, stock, pricelists, rfqs, fx] = await Promise.all([
    all(req, "offers", { case: { equals: caseId } }),
    all(req, "suppliers"),
    all(req, "products"),
    all(req, "stock"),
    all(req, "pricelists", { status: { equals: "Approved" } }),
    all(req, "supplier-rfqs", { case: { equals: caseId } }),
    fxRates(req),
  ]);
  const eta = c.eta ? new Date(str(c.eta)) : new Date(DEMO_NOW.getTime() + 7 * DAY);
  return {
    req,
    c,
    items: ((c.items as Item[] | undefined) ?? []).slice().sort((a, b) => a.lineNo - b.lineNo),
    offers,
    suppliers: byId(suppliers),
    products: byId(products),
    stock,
    pricelists,
    rfqs,
    fx: fx.fx,
    fxLabel: fx.label,
    daysToEta: dayIndex(eta) - dayIndex(DEMO_NOW),
  };
}

/** Lane rates (truck to the vessel's port, EGP) used when a supplier quotes ex-works / ex-stock. */
const LANE_EGP: Record<string, number> = { Damietta: 600, Alexandria: 1800, Cairo: 1200, Suez: 900, "Port Said": 600 };
const IMPORT_PCT = 0.18;

/** One offer as compared: supplier offers, own stock and agency pricelist rows alike. */
export interface CmpOffer {
  id: string;
  kind: "supplier" | "stock" | "agency";
  supplier: string;
  supplierNote: string;
  version: number;
  superseded: boolean;
  offered: string;
  price: number;
  currency: string;
  per: string;
  baseQty: number;
  coverage: number;
  goodsEGP: number;
  freightEGP: number;
  freightNote: string;
  landedEGP: number;
  unitPerBase: number;
  landedPerBase: number;
  leadDays: number;
  readyBy: string;
  validUntil: string;
  terms: string;
  basis: string;
  expiry: string;
  compliance: string;
  flags: Flag[];
  blocked: boolean;
  needsAcceptance: boolean;
  shelfShort: boolean;
  newSupplier: boolean;
  /** Has a correction request (wrong part / spec): v1 kept, a corrected version expected or received. */
  correctable: boolean;
  correctedBy?: string;
}
export interface CmpPart {
  offer: string;
  qty: number;
}
export interface CmpLine {
  lineNo: number;
  description: string;
  requested: string;
  rules: string;
  qty: number;
  unit: string;
  baseUnit: string;
  baseQty: number;
  status: string;
  statusTone: Tone;
  missing: string;
  offers: CmpOffer[];
  best?: string;
  cheapestUnit?: string;
  split?: { parts: CmpPart[]; costEGP: number; savesEGP: number; text: string };
  selection: { parts: CmpPart[]; reason: string; customerAccepted: boolean; inferred: boolean; bestFit: boolean };
  others: { supplier: string; status: string; note: string; tone: Tone }[];
}
export interface Compare {
  id: string;
  caseId: string;
  vessel: string;
  port: string;
  eta: string;
  daysToEta: number;
  fxLabel: string;
  lines: CmpLine[];
}

interface RawOffer {
  id: string;
  kind: CmpOffer["kind"];
  supplierId: string;
  version: number;
  superseded: boolean;
  supersedes?: string;
  offered: string;
  price: number;
  currency: string;
  discountPct: number;
  packs: number;
  packSize: number;
  packLabel: string;
  leadDays: number;
  validUntil: string;
  expiry: string;
  terms: string;
  basis: string;
  compliance: string;
  freightEGP?: number;
  deviations: { type?: string; severity?: string; detail?: string }[];
  note?: string;
}

const SOURCE_KIND = (source: unknown): CmpOffer["kind"] =>
  source === "Own stock" ? "stock" : source === "Agency pricelist" ? "agency" : "supplier";

function rawOffers(ctx: Ctx, item: Item): RawOffer[] {
  const rows: RawOffer[] = ctx.offers
    .filter((o) => num(o.lineNo) === item.lineNo)
    .map((o) => ({
      id: o.id,
      kind: SOURCE_KIND(o.source),
      supplierId: idOf(o.supplier) ?? "",
      version: num(o.version, 1),
      superseded: Boolean(o.superseded),
      supersedes: idOf(o.supersedes),
      offered: str(o.offeredDescription),
      price: num(o.price),
      currency: str(o.currency) || "EGP",
      discountPct: num(o.discountPct),
      packs: num(o.packs),
      packSize: num(o.packSize, 1) || 1,
      packLabel: str(o.packLabel),
      leadDays: num(o.leadDays),
      validUntil: str(o.validUntil),
      expiry: str(o.expiry),
      terms: str(o.paymentTerms),
      basis: str(o.deliveryBasis),
      compliance: str(o.compliance),
      freightEGP: typeof o.freightEGP === "number" ? o.freightEGP : undefined,
      deviations: (o.deviations as RawOffer["deviations"] | undefined) ?? [],
    }));
  const product = item.product ? idOf(item.product) : undefined;
  if (!product) return rows;
  const reqBase = item.qty * (item.packSize || 1);
  // Own stock not yet offered on this line.
  if (!rows.some((r) => r.kind === "stock"))
    for (const s of ctx.stock.filter((s) => idOf(s.product) === product && num(s.available) > 0)) {
      const lots = (s.lots as { lot?: string; expiry?: string }[] | undefined) ?? [];
      rows.push({
        id: `stock:${s.id}`,
        kind: "stock",
        supplierId: "GS",
        version: 1,
        superseded: false,
        offered: `${num(s.available)} on hand · ${str(s.warehouse)} ${str(s.bin)}`.trim(),
        price: num(s.avgCostEGP),
        currency: "EGP",
        discountPct: 0,
        packs: Math.min(num(s.available), reqBase),
        packSize: 1,
        packLabel: "",
        leadDays: 1,
        validUntil: "",
        expiry: lots[0]?.expiry ? str(lots[0].expiry).slice(0, 7) : "",
        terms: "Own stock (average cost)",
        basis: `Ex-stock ${str(s.warehouse).split(" ")[0]}`,
        compliance: "Confirmed",
        deviations: [],
        note: lots.map((l) => l.lot).join(", "),
      });
    }
  // Approved agency pricelists not yet offered on this line.
  for (const pl of ctx.pricelists) {
    const principal = idOf(pl.principal) ?? "";
    if (rows.some((r) => r.supplierId === principal)) continue;
    const entry = ((pl.items as { product?: string; code?: string; listPrice?: number }[] | undefined) ?? []).find(
      (i) => idOf(i.product) === product,
    );
    if (!entry) continue;
    const packSize = item.packSize || 1;
    rows.push({
      id: `pricelist:${pl.id}`,
      kind: "agency",
      supplierId: principal,
      version: 1,
      superseded: false,
      offered: `${str(entry.code)} · ${str(pl.title)}`,
      price: round(num(entry.listPrice) * (1 - num(pl.discountPct) / 100)),
      currency: str(pl.currency) || "EUR",
      discountPct: 0,
      packs: Math.ceil(reqBase / packSize),
      packSize,
      packLabel: "",
      leadDays: num(pl.leadDays, 10),
      validUntil: str(pl.validUntil),
      expiry: "",
      terms: "Agency terms",
      basis: "Import",
      compliance: "Confirmed",
      deviations: [],
    });
  }
  return rows;
}

function freightOf(ctx: Ctx, o: RawOffer, sup: Doc | undefined, goodsEGP: number) {
  const port = str(ctx.c.port) || "Port Said";
  if (o.freightEGP !== undefined) return { egp: o.freightEGP, note: "Freight as quoted" };
  if (o.kind === "agency")
    return { egp: round(goodsEGP * IMPORT_PCT, 0), note: "Import freight, duty & clearance (est. 18%)" };
  if (/^delivered/i.test(o.basis) || (!o.basis && o.kind === "supplier"))
    return { egp: 0, note: o.basis || "Delivered (as quoted)" };
  const origin = /ex-?(?:stock|works)\s+([A-Za-z ]+)/i.exec(o.basis)?.[1]?.trim() ?? str(sup?.city);
  if (origin === port) return { egp: 250, note: `Local truck in ${port}` };
  const who = o.kind === "stock" ? "Golden Sea truck" : "Truck";
  return { egp: LANE_EGP[origin] ?? 1500, note: `${who} ${origin || "supplier"} → ${port}` };
}

const monthsUntil = (yyyyMm: string) => {
  const [y, m] = yyyyMm.split("-").map(Number);
  if (!y || !m) return Infinity;
  return (y - DEMO_NOW.getUTCFullYear()) * 12 + (m - 1 - DEMO_NOW.getUTCMonth());
};
const requiredShelfLife = (ctx: Ctx, item: Item) => {
  const p = item.product ? ctx.products.get(idOf(item.product) ?? "") : undefined;
  const fromText = /min\.?\s*(\d+)\s*months?/i.exec(str(item.certificates))?.[1];
  return num(p?.minShelfLifeMonths) || Number(fromText) || 0;
};

const SEVERITY_TONE: Record<string, Tone> = {
  "Blocks use": "error",
  "Needs customer acceptance": "warning",
  Warning: "warning",
};

function evalOffer(ctx: Ctx, item: Item, o: RawOffer, all: RawOffer[]): CmpOffer {
  const sup = ctx.suppliers.get(o.supplierId);
  const reqBase = item.qty * (item.packSize || 1);
  const baseQty = o.packs * o.packSize;
  const rate = ctx.fx[o.currency] ?? 1;
  const goodsEGP = o.price * (1 - o.discountPct / 100) * o.packs * rate;
  const fr = freightOf(ctx, o, sup, goodsEGP);
  const flags: Flag[] = [];
  const has = (type: string) => flags.some((f) => f.type === type);
  let blocked = false;
  let needsAcceptance = false;

  for (const d of o.deviations) {
    const tone = SEVERITY_TONE[str(d.severity)] ?? "warning";
    flags.push({ tone, text: `${str(d.type)}: ${str(d.detail)}`, type: str(d.type) });
    if (d.severity === "Blocks use") blocked = true;
    if (d.severity === "Needs customer acceptance") needsAcceptance = true;
  }
  const correctedBy = all.find((x) => x.supersedes === o.id);
  if (o.superseded) {
    blocked = true;
    flags.push({ tone: "neutral", text: `Superseded by v${correctedBy?.version ?? o.version + 1} — kept for audit` });
  }
  if (o.supersedes) {
    const prev = all.find((x) => x.id === o.supersedes);
    const was = prev?.deviations[0]?.type ? ` (${prev.deviations[0].type?.toLowerCase()})` : "";
    flags.push({ tone: "success", text: `Corrected v${o.version}: replaces v${prev?.version ?? o.version - 1}${was}` });
  }
  if (o.compliance === "Rejected" && !blocked) {
    blocked = true;
    flags.push({ tone: "error", text: "Rejected on technical check" });
  }
  // Exact brand / part requested: anything else is blocked from pricing.
  if (item.exactBrand && o.offered && item.partNo && !o.offered.includes(item.partNo) && !has("Wrong brand / part")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: `Wrong brand / part: ${item.brand ?? ""} ${item.partNo} only`,
      type: "Wrong brand / part",
    });
  }
  // Pack size differs: same total, but the customer must accept it in writing.
  if ((item.packSize || 1) !== o.packSize && o.kind !== "stock" && !has("Pack size")) {
    needsAcceptance = true;
    flags.push({
      tone: "warning",
      text: `Pack size: ${o.packLabel || `${o.packs} × ${o.packSize}`} instead of ${item.qty} × ${item.packSize} — written customer acceptance needed`,
      type: "Pack size",
    });
  }
  // Shelf life below what the vessel asked for.
  const need = requiredShelfLife(ctx, item);
  const left = o.expiry ? monthsUntil(o.expiry) : Infinity;
  const shelfShort = (need > 0 && left < need) || has("Shelf life");
  if (shelfShort && !has("Shelf life"))
    flags.push({
      tone: "warning",
      text: `Shelf life: ${left} months left, vessel asked for ${need}`,
      type: "Shelf life",
    });
  // Lead time against the vessel's ETA.
  if (o.leadDays > ctx.daysToEta && !has("Lead time vs ETA")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: `Lead time ${o.leadDays} d misses vessel ETA ${fmtDay(ctx.c.eta)}`,
      type: "Lead time vs ETA",
    });
  } else if (o.leadDays === ctx.daysToEta && !has("Lead time vs ETA"))
    flags.push({ tone: "warning", text: "Tight: ready on the ETA day", type: "Lead time vs ETA" });
  // Validity.
  if (o.validUntil && new Date(o.validUntil) < DEMO_NOW && !has("Expired validity")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: `Expired validity: offer ended ${fmtDay(o.validUntil)} — reconfirm`,
      type: "Expired validity",
    });
  }
  // Quantity.
  if (baseQty < reqBase && !has("Quantity shortfall"))
    flags.push({
      tone: "warning",
      text: `Quantity shortfall: covers ${Math.round((baseQty / reqBase) * 100)}% of the request`,
      type: "Quantity shortfall",
    });
  const newSupplier = sup?.status === "New";
  if (newSupplier)
    flags.push({ tone: "info", text: `New supplier · no delivery history · ${str(sup?.terms) || "terms tbc"}` });
  if (o.kind === "stock")
    flags.push({
      tone: "success",
      text: `Own stock${o.note ? ` (lot ${o.note})` : ""} — reserve now, Golden Sea truck`,
    });
  if (o.kind === "agency") flags.push({ tone: "info", text: "Agency pricelist — priced instantly, no supplier RFQ" });
  if (o.currency !== "EGP")
    flags.push({
      tone: "neutral",
      text: `Converted at approved FX ${o.currency}/EGP ${(ctx.fx[o.currency] ?? 1).toFixed(2)}`,
    });

  const leadDate = new Date(DEMO_NOW.getTime() + o.leadDays * DAY).toISOString();
  return {
    id: o.id,
    kind: o.kind,
    supplier: str(sup?.name) || o.supplierId,
    supplierNote: sup
      ? [
          sup.onTime ? `On-time ${num(sup.onTime)}%` : "No delivery history",
          sup.replyHrs ? `replies ~${num(sup.replyHrs)} h` : "",
          str(sup.city),
        ]
          .filter(Boolean)
          .join(" · ")
      : "",
    version: o.version,
    superseded: o.superseded,
    offered:
      o.offered ||
      o.packLabel ||
      `${o.packs} × ${o.packSize === 1 ? item.unit : `${o.packSize} ${baseUnitOf(ctx, item)}`}`,
    price: o.price,
    currency: o.currency,
    per: o.packSize === 1 ? baseUnitOf(ctx, item) : "pack",
    baseQty,
    coverage: reqBase ? baseQty / reqBase : 0,
    goodsEGP: round(goodsEGP),
    freightEGP: fr.egp,
    freightNote: fr.note,
    landedEGP: round(goodsEGP + fr.egp),
    unitPerBase: baseQty ? round(goodsEGP / baseQty) : 0,
    landedPerBase: baseQty ? round((goodsEGP + fr.egp) / baseQty) : 0,
    leadDays: o.leadDays,
    readyBy: leadDate,
    validUntil: o.validUntil,
    terms: o.terms,
    basis: o.basis || (o.kind === "agency" ? "Import" : "Delivered"),
    expiry: o.expiry,
    compliance: o.compliance,
    flags,
    blocked,
    needsAcceptance,
    shelfShort,
    newSupplier,
    correctable: o.deviations.some((d) => d.type === "Wrong brand / part" || d.type === "Specification"),
    correctedBy: correctedBy?.id,
  };
}

const baseUnitOf = (ctx: Ctx, item: Item) => {
  const p = item.product ? ctx.products.get(idOf(item.product) ?? "") : undefined;
  return str(p?.unit) || item.unit;
};

const SELECTED = ["Offer selected", "Split offer selected", "Awaiting customer acceptance"];
const LINE_TONE: Record<string, Tone> = {
  "Clarification needed": "error",
  "Not sourced": "neutral",
  "Awaiting supplier": "warning",
  "Ready to select": "info",
  "Awaiting customer acceptance": "warning",
  "Offer selected": "success",
  "Split offer selected": "success",
};

function compareLine(ctx: Ctx, item: Item): CmpLine {
  const raws = rawOffers(ctx, item);
  const offers = raws.map((o) => evalOffer(ctx, item, o, raws));
  const reqBase = item.qty * (item.packSize || 1);
  const candidates = offers.filter((o) => !o.blocked && !o.shelfShort);
  const full = candidates.filter((o) => o.coverage >= 1).sort((a, b) => a.landedPerBase - b.landedPerBase);
  const best = full[0];
  const cheapestUnit = offers.filter((o) => !o.blocked).sort((a, b) => a.unitPerBase - b.unitPerBase)[0];

  // Split sourcing: fill the request from the cheapest landed offers in turn.
  let split: CmpLine["split"];
  {
    let left = reqBase;
    const parts: CmpPart[] = [];
    let cost = 0;
    for (const o of [...candidates].sort((a, b) => a.landedPerBase - b.landedPerBase)) {
      if (left <= 0) break;
      const take = Math.min(left, o.baseQty);
      if (take <= 0) continue;
      parts.push({ offer: o.id, qty: take / (item.packSize || 1) });
      cost += take * o.landedPerBase;
      left -= take;
    }
    const single = best ? best.landedPerBase * reqBase : Infinity;
    if (left <= 0 && parts.length > 1 && cost < single)
      split = {
        parts,
        costEGP: round(cost),
        savesEGP: Number.isFinite(single) ? round(single - cost) : 0,
        text: parts.map((p) => `${offers.find((o) => o.id === p.offer)?.supplier} × ${p.qty}`).join(" + "),
      };
  }

  // The saved selection (or, for older data, the one the line's status implies).
  const sel = item.selection ?? {};
  let parts: CmpPart[] = [];
  let inferred = false;
  if (sel.splitQty?.length) parts = sel.splitQty.map((s) => ({ offer: idOf(s.offer) ?? "", qty: num(s.qty) }));
  else if (sel.offers?.length) parts = sel.offers.map((o) => ({ offer: idOf(o) ?? "", qty: item.qty }));
  else if (SELECTED.includes(str(item.status))) {
    inferred = true;
    const accepting = offers
      .filter((o) => !o.blocked && o.coverage >= 1)
      .sort((a, b) => a.landedPerBase - b.landedPerBase)[0];
    if (item.status === "Split offer selected" && split) parts = split.parts;
    else if (item.status === "Awaiting customer acceptance" && accepting)
      parts = [{ offer: accepting.id, qty: item.qty }];
    else if (best) parts = [{ offer: best.id, qty: item.qty }];
  }
  parts = parts.filter((p) => offers.some((o) => o.id === p.offer));
  const bestFit =
    (parts.length === 1 && parts[0].offer === best?.id) ||
    (parts.length > 1 &&
      !!split &&
      split.parts.every((p) => parts.some((q) => q.offer === p.offer && q.qty === p.qty)));

  // Suppliers asked but not (yet) offering this line.
  const others: CmpLine["others"] = [];
  for (const r of ctx.rfqs) {
    if (!((r.lineNos as number[] | undefined) ?? []).includes(item.lineNo)) continue;
    const sid = idOf(r.supplier) ?? "";
    if (raws.some((o) => o.supplierId === sid)) continue;
    const name = str(ctx.suppliers.get(sid)?.name) || sid;
    const status = str(r.status);
    if (/Replied|Revised/.test(status))
      others.push({
        supplier: name,
        status: "Missing item",
        note: "Supplier did not quote this line (partial reply) — follow-up drafted",
        tone: "error",
      });
    else others.push({ supplier: name, status, note: str(r.lastEvent) || `Due ${fmtDay(r.dueAt)}`, tone: "warning" });
  }

  const status = str(item.status) || (offers.length ? "Ready to select" : "Not sourced");
  const exact = item.exactBrand ? `${item.brand ?? ""} ${item.partNo ?? ""} only`.trim() : "alternatives allowed";
  const unitBase = baseUnitOf(ctx, item);
  return {
    lineNo: item.lineNo,
    description: item.description,
    requested: `${item.qty} ${item.unit}${(item.packSize || 1) !== 1 ? ` (${reqBase} ${unitBase})` : ""}`,
    rules: [exact, item.certificates].filter(Boolean).join(" · "),
    qty: item.qty,
    unit: item.unit,
    baseUnit: unitBase,
    baseQty: reqBase,
    status,
    statusTone: LINE_TONE[status] ?? "neutral",
    missing: str(item.missing),
    offers,
    best: best?.id,
    cheapestUnit: cheapestUnit?.id,
    split,
    selection: { parts, reason: str(sel.reason), customerAccepted: Boolean(sel.customerAccepted), inferred, bestFit },
    others,
  };
}

export function compare(ctx: Ctx): Compare {
  return {
    id: ctx.c.id,
    caseId: str(ctx.c.caseId),
    vessel: str(ctx.c.vessel),
    port: str(ctx.c.port),
    eta: str(ctx.c.eta),
    daysToEta: ctx.daysToEta,
    fxLabel: ctx.fxLabel,
    lines: ctx.items.map((i) => compareLine(ctx, i)),
  };
}

/** Writes a line's selection (and status) back to the case. */
async function saveItem(ctx: Ctx, lineNo: number, patch: (item: Item) => Item) {
  const items = ctx.items.map((i) => (i.lineNo === lineNo ? patch({ ...i, selection: { ...i.selection } }) : i));
  await update(ctx.req, "cases", ctx.c.id, { items });
  ctx.items = items;
}

const lineStatusFor = (parts: CmpPart[], line: CmpLine, accepted: boolean) => {
  const needs = parts.some((p) => line.offers.find((o) => o.id === p.offer)?.needsAcceptance);
  if (needs && !accepted) return "Awaiting customer acceptance";
  return parts.length > 1 ? "Split offer selected" : "Offer selected";
};

/** Own-stock and pricelist rows become real offers when selected. */
async function materialise(ctx: Ctx, item: Item, offer: CmpOffer): Promise<string> {
  if (offer.kind === "supplier" || !offer.id.includes(":")) return offer.id;
  const [, sourceId] = offer.id.split(":");
  const doc = await create(ctx.req, "offers", {
    case: ctx.c.id,
    lineNo: item.lineNo,
    supplier: offer.kind === "stock" ? "GS" : str(ctx.pricelists.find((p) => p.id === sourceId)?.principal),
    product: item.product ? idOf(item.product) : undefined,
    price: offer.price,
    currency: offer.currency,
    packs: offer.baseQty / (offer.kind === "stock" ? 1 : item.packSize || 1),
    packSize: offer.kind === "stock" ? 1 : item.packSize || 1,
    leadDays: offer.leadDays,
    validUntil: offer.validUntil || undefined,
    deliveryBasis: offer.basis,
    source: offer.kind === "stock" ? "Own stock" : "Agency pricelist",
    compliance: "Confirmed",
  });
  return doc.id;
}

/* ---------------------------------------------------------------- pricing */

export interface PricingRow {
  lineNo: number;
  description: string;
  store: string;
  sourcing: string;
  costEGP: number;
  allocEGP: number;
  landedEGP: number;
  marginPct: number;
  targetPct: number;
  minPct: number;
  sellEGP: number;
  profitEGP: number;
  markupPct: number;
  sellQuote: number;
  unitQuote: number;
  quoteQty: number;
  quoteUnit: string;
  quoteDescription: string;
  partNo: string;
  lead: string;
  alternative: boolean;
  accepted: boolean;
  inputVatEGP: number;
  checks: Flag[];
}
export interface Pricing {
  id: string;
  caseId: string;
  customer: string;
  currency: string;
  fx: number;
  fxLabel: string;
  allocation: string;
  discountPct: number;
  policy: { targetPct: number; minPct: number; maxDiscountPct: number };
  charges: { label: string; amountEGP: number; status: string }[];
  chargesEGP: number;
  rows: PricingRow[];
  unpriced: { lineNo: number; description: string; status: string; tone: Tone }[];
  totals: {
    costEGP: number;
    landedEGP: number;
    grossEGP: number;
    discountEGP: number;
    sellEGP: number;
    sellQuote: number;
    profitEGP: number;
    marginPct: number;
    markupPct: number;
    inputVatEGP: number;
  };
  exceptions: string[];
  approvalType: string;
  quotation?: { id: string; number: string; status: string };
  approval?: { id: string; title: string; status: string };
}

const CHARGE_STATUSES = ["Estimate", "Confirmed", "Not applicable"];

export async function pricing(ctx: Ctx): Promise<Pricing> {
  const req = ctx.req;
  const cmp = compare(ctx);
  const policy = await policyOf(req);
  const p = (ctx.c.pricing as Record<string, unknown> | undefined) ?? {};
  const allocation = str(p.allocation) || policy.allocationDefault || "value";
  const discountPct = num(p.discountPct);
  const charges = ((p.charges as Pricing["charges"] | undefined) ?? []).map((c) => ({
    label: str(c.label),
    amountEGP: num(c.amountEGP),
    status: CHARGE_STATUSES.includes(str(c.status)) ? str(c.status) : "Estimate",
  }));
  const chargesEGP = charges.filter((c) => c.status !== "Not applicable").reduce((s, c) => s + c.amountEGP, 0);
  const currency = str(ctx.c.currency) || "USD";
  const rate = ctx.fx[currency] ?? 1;
  const target = num(policy.targetMarginPct, 25);
  const min = num(policy.minMarginPct, 15);
  const maxDiscount = num(policy.maxDiscountWithoutApprovalPct, 3);

  const priced: { item: Item; line: CmpLine; parts: { o: CmpOffer; qty: number }[]; cost: number }[] = [];
  const unpriced: Pricing["unpriced"] = [];
  for (const line of cmp.lines) {
    const item = ctx.items.find((i) => i.lineNo === line.lineNo)!;
    const parts = line.selection.parts
      .map((s) => ({ o: line.offers.find((o) => o.id === s.offer)!, qty: s.qty }))
      .filter((x) => x.o);
    if (!parts.length) {
      unpriced.push({ lineNo: line.lineNo, description: line.description, status: line.status, tone: line.statusTone });
      continue;
    }
    const cost = parts.reduce((s, x) => s + x.o.landedPerBase * x.qty * (item.packSize || 1), 0);
    priced.push({ item, line, parts, cost });
  }
  const sumCost = priced.reduce((s, r) => s + r.cost, 0);
  const sumQty = priced.reduce((s, r) => s + r.item.qty, 0);

  const rows: PricingRow[] = priced.map(({ item, parts, cost }) => {
    const share =
      allocation === "qty"
        ? item.qty / (sumQty || 1)
        : allocation === "lines"
          ? 1 / priced.length
          : cost / (sumCost || 1);
    const alloc = chargesEGP * share;
    const landed = cost + alloc;
    const rule = policy.byStore?.find((r) => r.store === item.store);
    const targetPct = num(rule?.targetPct, target);
    const minPct = num(rule?.minPct, min);
    const marginPct = typeof item.selection?.marginPct === "number" ? item.selection.marginPct : targetPct;
    const sell = marginPct < 100 ? landed / (1 - marginPct / 100) : landed;
    const profit = sell - landed;
    const accepted = Boolean(item.selection?.customerAccepted);
    // An alternative pack (same total, different pack): quoted in the offered packs.
    const alt = parts.length === 1 && parts[0].o.flags.some((f) => f.type === "Pack size") ? parts[0].o : undefined;
    const altPack = alt ? ctx.offers.find((o) => o.id === alt.id) : undefined;
    const quoteQty = alt && altPack ? num(altPack.packs) : item.qty;
    const quoteUnit = item.unit;
    const sellQuote = sell / rate;
    const checks: Flag[] = [];
    if (marginPct <= 0) checks.push({ tone: "error", text: "Negative / zero profit" });
    else if (marginPct < minPct)
      checks.push({ tone: "warning", text: `Below ${minPct}% minimum margin — approval exception`, type: "below-min" });
    for (const x of parts) {
      for (const f of x.o.flags) {
        if (f.type === "Lead time vs ETA" && f.tone === "error")
          checks.push({ tone: "error", text: "Supplier lead time misses ETA" });
        if (f.type === "Expired validity") checks.push({ tone: "error", text: "Supplier price expired — reconfirm" });
        if (f.type === "Shelf life")
          checks.push({ tone: "warning", text: "Shelf life below the vessel's requirement" });
      }
      if (x.o.newSupplier) checks.push({ tone: "info", text: `Advance payment exposure: ${x.o.supplier}` });
    }
    if (alt && !accepted)
      checks.push({ tone: "warning", text: "Pending customer acceptance — alternative pack", type: "alternative" });
    if (alt && accepted) checks.push({ tone: "success", text: "Alternative pack accepted by the customer in writing" });
    if (parts.length > 1)
      checks.push({
        tone: "info",
        text: `Split sourcing: ${parts.map((x) => `${x.o.supplier} × ${x.qty}`).join(" + ")}`,
      });
    const ready = Math.max(...parts.map((x) => x.o.leadDays));
    return {
      lineNo: item.lineNo,
      description: item.description,
      store: str(item.store),
      sourcing: parts
        .map(
          (x) =>
            `${x.o.supplier}${x.o.version > 1 ? ` v${x.o.version}` : ""} · ${x.o.currency} ${x.o.price.toLocaleString("en-US")} · ${x.o.leadDays} d`,
        )
        .join(" + "),
      costEGP: round(cost),
      allocEGP: round(alloc),
      landedEGP: round(landed),
      marginPct,
      targetPct,
      minPct,
      sellEGP: round(sell),
      profitEGP: round(profit),
      markupPct: landed ? round((profit / landed) * 100, 1) : 0,
      sellQuote: round(sellQuote),
      unitQuote: round(sellQuote / (quoteQty || 1)),
      quoteQty,
      quoteUnit,
      quoteDescription: alt
        ? `${item.description} — supplied as ${altPack?.packLabel ? str(altPack.packLabel) : "alternative pack"} (alternative pack${accepted ? ", accepted" : ""})`
        : item.description,
      partNo: item.partNo && item.partNo !== "local" ? item.partNo : item.impa ? `IMPA ${item.impa}` : "",
      lead: ready <= ctx.daysToEta ? "On arrival" : `${ready} days`,
      alternative: Boolean(alt),
      accepted,
      inputVatEGP: round(
        parts.reduce((s, x) => s + (x.o.currency === "EGP" ? x.o.unitPerBase * x.qty * (item.packSize || 1) : 0), 0) *
          VAT,
      ),
      checks,
    };
  });

  const gross = rows.reduce((s, r) => s + r.sellEGP, 0);
  const landedSum = rows.reduce((s, r) => s + r.landedEGP, 0);
  const discountEGP = gross * (discountPct / 100);
  const sell = gross - discountEGP;
  const profit = sell - landedSum;
  const marginPct = sell ? round((profit / sell) * 100, 1) : 0;
  const exceptions: string[] = [];
  for (const r of rows)
    for (const c of r.checks)
      if (c.tone === "error" || c.tone === "warning") exceptions.push(`L${r.lineNo}: ${c.text}`);
  if (rows.length && marginPct < min) exceptions.push(`Quote margin ${marginPct}% is below the ${min}% minimum`);
  if (discountPct > maxDiscount)
    exceptions.push(`Customer discount ${discountPct}% is above ${maxDiscount}% without approval`);
  for (const c of charges.filter((c) => c.status === "Estimate"))
    exceptions.push(`Shared charge is an estimate: ${c.label} (${egp(c.amountEGP)})`);
  if (unpriced.length)
    exceptions.push(`Lines ${unpriced.map((u) => u.lineNo).join(", ")} excluded — to follow in a revised quotation`);
  const belowMin = rows.some((r) => r.marginPct < r.minPct) || (rows.length > 0 && marginPct < min);

  // The quotation and approval in flight, if any.
  const quotes = (await all(req, "quotations", { case: { equals: ctx.c.id } })).sort(
    (a, b) => num(b.version) - num(a.version),
  );
  const q = quotes[0];
  const approval = q
    ? (await all(req, "approvals", { case: { equals: ctx.c.id } })).find(
        (a) => idOf((a.subject as { value?: unknown } | undefined)?.value) === q.id,
      )
    : undefined;

  return {
    id: ctx.c.id,
    caseId: str(ctx.c.caseId),
    customer: str(ctx.c.customer),
    currency,
    fx: rate,
    fxLabel: ctx.fxLabel,
    allocation,
    discountPct,
    policy: { targetPct: target, minPct: min, maxDiscountPct: maxDiscount },
    charges,
    chargesEGP,
    rows,
    unpriced,
    totals: {
      costEGP: round(rows.reduce((s, r) => s + r.costEGP, 0)),
      landedEGP: round(landedSum),
      grossEGP: round(gross),
      discountEGP: round(discountEGP),
      sellEGP: round(sell),
      sellQuote: round(sell / rate),
      profitEGP: round(profit),
      marginPct,
      markupPct: landedSum ? round((profit / landedSum) * 100, 1) : 0,
      inputVatEGP: round(rows.reduce((s, r) => s + r.inputVatEGP, 0)),
    },
    exceptions,
    approvalType: belowMin
      ? "Quotation margin exception"
      : discountPct > maxDiscount
        ? "Customer discount"
        : "Customer quotation",
    quotation: q ? { id: q.id, number: str(q.number), status: str(q.status) } : undefined,
    approval: approval ? { id: approval.id, title: str(approval.title), status: str(approval.status) } : undefined,
  };
}

/* ---------------------------------------------------------------- quotations */

const OPEN_APPROVAL = (a: Doc) => !["Approved", "Rejected"].includes(str(a.status));
const subjectOf = (a: Doc) => idOf((a.subject as { value?: unknown } | undefined)?.value);

/** The approval for a quotation: by subject, or (older data) the open quote approval on its case. */
async function approvalsFor(req: PayloadRequest, q: Doc) {
  const list = await all(req, "approvals", { case: { equals: idOf(q.case) } });
  return list.filter(
    (a) =>
      subjectOf(a) === q.id ||
      (!a.subject &&
        /quotation|discount/i.test(str(a.type)) &&
        ["Awaiting approval", "Approved", "Submitted"].includes(str(q.status))),
  );
}

async function requestQuoteApproval(
  req: PayloadRequest,
  q: Doc,
  opts: { type?: string; exceptions?: string[]; note?: string } = {},
) {
  if (!["Draft", "Returned"].includes(str(q.status)))
    throw Object.assign(new Error(`${str(q.number)} is ${str(q.status).toLowerCase()} — nothing to request.`), {
      status: 400,
    });
  const open = (await approvalsFor(req, q)).find(OPEN_APPROVAL);
  if (open) return { approval: open, quotation: q };
  const c = await one(req, "cases", str(idOf(q.case)));
  const customer = c ? await one(req, "customers", str(idOf(c.customer))) : null;
  const policy = await policyOf(req);
  const internal = (q.internal as { marginPct?: number; exceptions?: string } | undefined) ?? {};
  const min = num(policy.minMarginPct, 15);
  const type =
    opts.type ??
    (typeof internal.marginPct === "number" && internal.marginPct < min
      ? "Quotation margin exception"
      : "Customer quotation");
  const rule = await ruleFor(req, type);
  const exceptions = opts.exceptions ?? (internal.exceptions ? [internal.exceptions] : []);
  const total = `${str(q.currency)} ${num(q.totalExVat).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const margin = typeof internal.marginPct === "number" ? ` — ${internal.marginPct}% margin` : "";
  const approval = await create(req, "approvals", {
    title:
      type === "Quotation margin exception"
        ? `Quote ${str(q.number)} to ${str(customer?.name)}${margin} (min ${min}%)`
        : `Quote ${str(q.number)} to ${str(customer?.name)} — ${total}`,
    type,
    case: idOf(q.case),
    detail: [opts.note, ...exceptions].filter(Boolean).join("\n") || "No exceptions — standard approval.",
    subject: { relationTo: "quotations", value: q.id },
    requestedBy: userOf(req)?.id,
    approvers: rule.approvers,
    twoPerson: Boolean(rule.twoPerson),
  });
  const quotation = await update(req, "quotations", q.id, {
    status: "Awaiting approval",
    decision: "Awaiting management approval",
  });
  if (c)
    await update(req, "cases", c.id, {
      stage: "Awaiting management approval",
      wait: "Awaiting internal approval",
      decision: "Awaiting management approval",
      nextAction: `Karim Balbaa: approve ${str(q.number)}`,
    });
  return { approval, quotation };
}

/** A quotation as the preview reads it (internal costs removed). */
export interface QuoteDoc {
  id: string;
  number: string;
  version: number;
  status: string;
  decision?: string;
  currency: string;
  fxRate?: number;
  discountPct?: number;
  totalExVat?: number;
  validUntil?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  remarks?: string;
  createdAt?: string;
  lines?: unknown[];
  submission?: { method?: string; submittedAt?: string; followUpAt?: string; portalCheck?: unknown[] };
}
export interface QuoteView {
  quotation: QuoteDoc;
  case: {
    id: string;
    caseId: string;
    customer: string;
    attention: string;
    email: string;
    customerRef: string;
    vessel: string;
    imo: string;
    port: string;
    eta: string;
    portal: string;
  };
  versions: {
    id: string;
    number: string;
    version: number;
    status: string;
    decision: string;
    totalExVat: number;
    at: string;
  }[];
  approvals: ApprovalCard[];
  internal?: { landedCostEGP?: number; grossProfitEGP?: number; marginPct?: number; exceptions?: string };
  fx: number;
  step: number;
  stepLabel: string;
  can: {
    requestApproval: boolean;
    approve: boolean;
    send: boolean;
    revise: boolean;
    decide: boolean;
    portalCheck: boolean;
  };
  approvalId?: string;
  why: { approve: string; send: string };
  preparedBy: string;
  approvedBy: string;
  minMarginPct: number;
}

async function quoteView(req: PayloadRequest, id: string): Promise<QuoteView | null> {
  const q = await one(req, "quotations", id);
  if (!q) return null;
  const c = await one(req, "cases", str(idOf(q.case)));
  const [customer, vessels, users, versions, fx, policy] = await Promise.all([
    c ? one(req, "customers", str(idOf(c.customer))) : null,
    all(req, "vessels"),
    all(req, "users"),
    all(req, "quotations", { case: { equals: idOf(q.case) } }),
    fxRates(req),
    policyOf(req),
  ]);
  const vessel = vessels.find((v) => v.id === idOf(c?.vesselRecord) || v.name === c?.vessel);
  const contacts = (customer?.contacts as { name?: string; email?: string }[] | undefined) ?? [];
  const names = byId(users);
  const role = roleOf(req);
  const cards = await Promise.all((await approvalsFor(req, q)).map((a) => approvalCard(req, a, names)));
  const open = cards.find((a) => !["Approved", "Rejected"].includes(a.status));
  const status = str(q.status);
  const decision = str(q.decision);
  const step =
    status === "Awaiting approval"
      ? 1
      : status === "Approved"
        ? 2
        : status === "Submitted"
          ? ["Won", "Partially won", "Lost", "Revision requested", "Expired"].includes(decision)
            ? 4
            : 3
          : status === "Superseded"
            ? ["Revision requested"].includes(decision)
              ? 4
              : 0
            : 0;
  const stepLabel = step === 4 ? decision : "Customer decision";
  const internal = role === "sales" ? undefined : (q.internal as QuoteView["internal"]);
  return {
    quotation: { ...q, internal: undefined } as unknown as QuoteDoc,
    case: {
      id: str(c?.id),
      caseId: str(c?.caseId),
      customer: str(customer?.name),
      attention: contacts[0]?.name ?? "Purchasing department",
      email: contacts[0]?.email ?? str(customer?.contactEmail),
      customerRef: str(c?.customerRef),
      vessel: str(c?.vessel),
      imo: str(vessel?.imo),
      port: str(c?.port),
      eta: str(c?.eta),
      portal: str((customer?.registration as { portal?: string } | undefined)?.portal),
    },
    versions: versions
      .sort((a, b) => num(a.version) - num(b.version))
      .map((v) => ({
        id: v.id,
        number: str(v.number),
        version: num(v.version, 1),
        status: str(v.status),
        decision: str(v.decision),
        totalExVat: num(v.totalExVat),
        at: str(v.updatedAt ?? v.createdAt),
      })),
    approvals: cards,
    internal,
    fx: num(q.fxRate) || fx.fx[str(q.currency)] || fx.fx.USD,
    step,
    stepLabel,
    can: {
      requestApproval: ["Draft", "Returned"].includes(status) && !open,
      approve: Boolean(open?.canDecide),
      send: status === "Approved",
      revise: ["Approved", "Submitted", "Returned"].includes(status),
      decide: status === "Submitted",
      portalCheck: status === "Submitted" || status === "Approved",
    },
    approvalId: open?.id,
    why: {
      approve: open
        ? open.canDecide
          ? ""
          : open.why
        : status === "Approved"
          ? "Approved."
          : "No approval requested yet.",
      send: status === "Approved" ? "" : "Only an approved version can be sent.",
    },
    preparedBy: str(names.get(idOf(q.preparedBy) ?? "")?.name),
    approvedBy: str(names.get(idOf(q.approvedBy) ?? "")?.name),
    minMarginPct: num(policy.minMarginPct, 15),
  };
}

const DECISIONS = ["Won", "Partially won", "Lost", "Revision requested"];

/* ---------------------------------------------------------------- approvals */

export interface ApprovalCard {
  id: string;
  title: string;
  type: string;
  status: string;
  tone: Tone;
  detail: string;
  case?: { id: string; caseId: string; vessel: string };
  requestedBy: string;
  requestedAt: string;
  approvers: { id: string; name: string; decision?: string; at?: string; reason?: string }[];
  twoPerson: boolean;
  needed: number;
  progress: string;
  rule: string;
  evidence: { label: string; value: string; tone?: Tone }[];
  links: { label: string; href: string }[];
  canDecide: boolean;
  why: string;
}

const ROLE_LABEL: Record<string, string> = {
  management: "management",
  "finance-director": "finance",
  "supply-chain": "supply chain",
  sales: "sales",
  operations: "operations",
  "office-admin": "office admin",
};

async function approvalCard(req: PayloadRequest, a: Doc, users: Map<string, Doc>): Promise<ApprovalCard> {
  const me = userOf(req);
  const name = (id: unknown) => str(users.get(idOf(id) ?? "")?.name) || str(idOf(id));
  const decisions =
    (a.decisions as { user?: unknown; decision?: string; at?: string; reason?: string }[] | undefined) ?? [];
  const approverIds = ((a.approvers as unknown[] | undefined) ?? []).map((x) => idOf(x) ?? "");
  const ids = approverIds.length
    ? approverIds
    : [...users.values()].filter((u) => u.role === "management").map((u) => u.id);
  const approvers = ids.map((id) => {
    const d = decisions.find((x) => idOf(x.user) === id);
    return { id, name: name(id), decision: d?.decision, at: d?.at, reason: d?.reason };
  });
  const status = str(a.status) || "Pending";
  const done = ["Approved", "Rejected"].includes(status);
  const needed = a.twoPerson ? 2 : 1;
  const mine = approvers.find((x) => x.id === me?.id);
  const waiting = approvers.filter((x) => !x.decision);
  const decidedBy = approvers.filter((x) => x.decision);
  const waitingText = waiting.map((x) => (x.id === me?.id ? "you" : x.name)).join(" or ");
  const progress = done
    ? `${status} by ${decidedBy.map((x) => x.name).join(" + ") || "—"}`
    : decidedBy.length
      ? `${decidedBy.map((x) => `${x.name} ${x.decision === "Approve" ? "approved" : "returned"}`).join(" · ")} · waiting for ${waitingText}`
      : `Waiting for ${waitingText}${needed > 1 ? ` (${needed} people)` : ""}`;
  const rule = await ruleFor(req, str(a.type));
  const canDecide = !done && Boolean(mine) && !mine?.decision;
  const why = canDecide
    ? ""
    : done
      ? `Decided — ${progress}.`
      : mine?.decision
        ? `You ${mine.decision === "Approve" ? "approved" : "returned"} this on ${fmtDay(mine.at)} · waiting for ${waiting.map((x) => x.name).join(" or ")}.`
        : `Only ${approvers.map((x) => x.name).join(" and ")} can decide ${str(a.type).toLowerCase()} approvals${
            rule.note ? ` (${rule.note.toLowerCase()})` : ""
          }; you are signed in as ${ROLE_LABEL[str(me?.role)] ?? str(me?.role)}.`;

  // Evidence: what's being decided, from the records behind it.
  const evidence: ApprovalCard["evidence"] = [];
  const links: ApprovalCard["links"] = [];
  const caseId = idOf(a.case);
  const c = caseId ? await one(req, "cases", caseId) : null;
  if (c) links.push({ label: `Open ${str(c.caseId)}`, href: `/collections/cases/${c.id}/overview` });
  const type = str(a.type);
  const sales = str(me?.role) === "sales";
  if (/quotation|discount/i.test(type)) {
    const subject = subjectOf(a);
    const quotes = caseId ? await all(req, "quotations", { case: { equals: caseId } }) : [];
    const q =
      quotes.find((x) => x.id === subject) ??
      quotes.filter((x) => x.status === "Awaiting approval").sort((x, y) => num(y.version) - num(x.version))[0];
    if (q) {
      const internal =
        (q.internal as { marginPct?: number; grossProfitEGP?: number; landedCostEGP?: number; exceptions?: string }) ??
        {};
      evidence.push({ label: "Quotation", value: `${str(q.number)} · ${str(q.status)}` });
      evidence.push({
        label: "Total (excl. VAT)",
        value: `${str(q.currency)} ${num(q.totalExVat).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      });
      evidence.push({
        label: "Lines",
        value: `${((q.lines as unknown[]) ?? []).length} priced · valid until ${fmtDay(q.validUntil) || "—"}`,
      });
      if (sales) evidence.push({ label: "Margin", value: "Hidden for your role", tone: "neutral" });
      else if (typeof internal.marginPct === "number") {
        const policy = await policyOf(req);
        const min = num(policy.minMarginPct, 15);
        evidence.push({
          label: "Margin",
          value: `${internal.marginPct}% (policy minimum ${min}%) · profit ${egp(num(internal.grossProfitEGP))}`,
          tone: internal.marginPct < min ? "warning" : "success",
        });
      }
      if (internal.exceptions && !sales)
        evidence.push({ label: "Exceptions", value: internal.exceptions, tone: "warning" });
      links.push({ label: "Preview quotation", href: `/collections/quotations/${q.id}/preview` });
      if (!sales && c) links.push({ label: "Pricing", href: `/collections/cases/${c.id}/pricing` });
    }
  } else if (type === "Exchange rate") {
    const fx = await fxRates(req);
    const proposed = fx.rates.find((r) => r.status === "Awaiting approval");
    const active = fx.rates.find((r) => r.status === "Active" && r.currency === (proposed?.currency ?? "USD"));
    if (proposed && active) {
      const change = ((num(proposed.egpPerUnit) - num(active.egpPerUnit)) / num(active.egpPerUnit, 1)) * 100;
      evidence.push({
        label: "Current",
        value: `${active.currency}/EGP ${num(active.egpPerUnit).toFixed(2)} since ${fmtDay(active.date)}`,
      });
      evidence.push({
        label: "Proposed",
        value: `${proposed.currency}/EGP ${num(proposed.egpPerUnit).toFixed(2)} (${change >= 0 ? "+" : ""}${change.toFixed(2)}%) · ${str(proposed.source)}`,
        tone: "warning",
      });
    }
    const open = (await all(req, "quotations")).filter((q) =>
      ["Draft", "Awaiting approval", "Approved", "Submitted"].includes(str(q.status)),
    );
    evidence.push({
      label: "Open quotations re-checked",
      value: `${open.length} (prices in USD stay as approved; EGP costs move)`,
    });
    links.push({ label: "Exchange rates", href: "/globals/fx-rates" });
  } else if (type === "Bank detail change") {
    evidence.push({ label: "Supplier", value: "Port Said Welding Co. (S3) · approved supplier since 2019" });
    evidence.push({
      label: "Request",
      value: "New beneficiary account received by email, 16 Nov 14:02",
      tone: "warning",
    });
    evidence.push({ label: "Call-back", value: decisions[0]?.reason ?? "Call the number on file before approving" });
    evidence.push({
      label: "Rule",
      value: "Two people: finance + CEO. Payments to S3 on hold until both approve.",
      tone: "info",
    });
    links.push({ label: "Supplier record", href: "/collections/suppliers/S3" });
  } else if (/deposit|payment/i.test(type)) {
    const pos = caseId ? await all(req, "purchase-orders", { case: { equals: caseId } }) : [];
    const po = pos[0];
    if (po) {
      const total = ((po.lines as { qty?: number; unitPrice?: number }[]) ?? []).reduce(
        (s, l) => s + num(l.qty) * num(l.unitPrice),
        0,
      );
      const side = (po.supplierSide as { proforma?: string; depositPct?: number } | undefined) ?? {};
      evidence.push({
        label: "Purchase order",
        value: `${str(po.number)} · ${str(po.currency)} ${total.toLocaleString("en-US")} · ${str(po.status)}`,
      });
      evidence.push({
        label: "Pro forma",
        value: `${str(side.proforma) || "attached"} · deposit ${num(side.depositPct, 50)}%`,
      });
      links.push({ label: `PO ${str(po.number)}`, href: `/collections/purchase-orders/${po.id}` });
    }
    evidence.push({ label: "Bank details", value: "Unchanged since 2025 — no call-back needed", tone: "success" });
  } else if (/alternative/i.test(type)) {
    evidence.push({ label: "Requested", value: "Lincoln Omnia 46 electrodes, 3.2 mm (customer's spec)" });
    evidence.push({
      label: "Proposed",
      value: "ESAB OK 46.00, 3.2 mm — same AWS E6013 class, mill certificate attached",
      tone: "info",
    });
    evidence.push({
      label: "Customer",
      value: "Asked for v2 with the ESAB alternative (email 12 Nov)",
      tone: "success",
    });
  }
  if (a.detail) evidence.push({ label: "Note from requester", value: str(a.detail) });

  return {
    id: a.id,
    title: str(a.title),
    type,
    status,
    tone: status === "Approved" ? "success" : status === "Rejected" ? "error" : decidedBy.length ? "info" : "warning",
    detail: str(a.detail),
    case: c ? { id: c.id, caseId: str(c.caseId), vessel: str(c.vessel) } : undefined,
    requestedBy: name(a.requestedBy),
    requestedAt: str(a.createdAt),
    approvers,
    twoPerson: Boolean(a.twoPerson),
    needed,
    progress,
    rule: `${approvers.map((x) => x.name).join(a.twoPerson ? " + " : " or ")} decide${approvers.length === 1 ? "s" : ""}${rule.note ? ` · ${rule.note}` : ""}`,
    evidence,
    links,
    canDecide,
    why,
  };
}

/** Records the signed-in approver's decision; when it's final, applies it to the record behind it. */
async function decide(req: PayloadRequest, id: string, decision: "Approve" | "Reject", reason: string) {
  const a = await one(req, "approvals", id);
  if (!a) throw Object.assign(new Error("Approval not found."), { status: 404 });
  if (decision === "Reject" && !reason.trim())
    throw Object.assign(new Error("Give a reason when returning a request."), { status: 400 });
  const decisions = ((a.decisions as Record<string, unknown>[] | undefined) ?? []).map((d) => ({
    ...d,
    user: idOf(d.user),
  }));
  const updated = await update(req, "approvals", id, {
    decisions: [...decisions, { decision, reason: reason || undefined }],
  });
  const status = str(updated.status);
  const me = userOf(req);
  if (status !== "Approved" && status !== "Rejected") return updated;

  const type = str(a.type);
  const caseId = idOf(a.case);
  if (/quotation|discount/i.test(type) && caseId) {
    const quotes = await all(req, "quotations", { case: { equals: caseId } });
    const q = quotes.find((x) => x.id === subjectOf(a)) ?? quotes.find((x) => x.status === "Awaiting approval");
    if (q && q.status === "Awaiting approval") {
      if (status === "Approved") {
        await update(req, "quotations", q.id, {
          status: "Approved",
          approvedBy: me?.id,
          decision: "Quotation prepared",
        });
        await update(req, "cases", caseId, { nextAction: `Send ${str(q.number)} to the customer`, wait: null });
      } else {
        await update(req, "quotations", q.id, { status: "Returned", decision: "Quotation prepared" });
        await update(req, "cases", caseId, { nextAction: `Revise pricing — returned by ${str(me?.name)}: ${reason}` });
      }
    }
  } else if (type === "Exchange rate") {
    const g = await fxRates(req);
    const rates = g.rates.map((r) =>
      r.status === "Awaiting approval"
        ? {
            ...r,
            status: status === "Approved" ? "Active" : "Rejected",
            approvedBy: status === "Approved" ? me?.id : undefined,
          }
        : r,
    );
    await req.payload.updateGlobal({ slug: "fx-rates" as never, data: { rates } as never, req, depth: 0 } as never);
  }
  await logActivity(req, {
    case: caseId,
    text: `${str(me?.name)} ${status === "Approved" ? "approved" : "returned"} “${str(a.title)}”${reason ? `: ${reason}` : ""}.`,
    entity: `approvals/${id}`,
  });
  return updated;
}

/* ---------------------------------------------------------------- correction requests */

/** A correction request to a supplier whose offer has the wrong part: the AI draft, or what was sent. */
export interface CorrectionDraft {
  to: string;
  subject: string;
  body: string;
  status: string;
  sent: boolean;
}

function correctionDraft(ctx: Ctx, offer: Doc): CorrectionDraft {
  const item = ctx.items.find((i) => i.lineNo === num(offer.lineNo));
  const sup = ctx.suppliers.get(idOf(offer.supplier) ?? "");
  const rfq = ctx.rfqs.find((r) => idOf(r.supplier) === idOf(offer.supplier));
  const dev = ((offer.deviations as { type?: string; detail?: string }[]) ?? [])[0];
  const corrected = ctx.offers.find((o) => idOf(o.supersedes) === offer.id);
  return {
    to: `${str(sup?.name)} <${str(sup?.contact).split("·")[0].trim() || "sales"}>`,
    subject: `${str(rfq?.reference) || "Our RFQ"} — line ${num(offer.lineNo)}: please correct your offer`,
    body: [
      `Dear ${str(sup?.contact).split("·")[0].trim() || "colleagues"},`,
      "",
      `Thank you for your offer. On line ${num(offer.lineNo)} we asked for ${item?.brand ?? ""} ${item?.partNo ?? item?.description ?? ""} (exact part — no alternatives).`.replace(
        /\s+/g,
        " ",
      ),
      `Your offer: ${str(offer.offeredDescription) || "different item"}. ${dev?.detail ?? ""}`.trim(),
      "",
      "Please send a corrected offer for the requested part, with price, availability and lead time to Port Said.",
      "",
      "Best regards,",
      str(userOf(ctx.req)?.name),
      "Golden Sea for Trading & Marketing",
    ].join("\n"),
    status: corrected
      ? `Sent 16 Nov · corrected v${num(corrected.version, 2)} received and in use`
      : "Draft — not sent",
    sent: Boolean(corrected),
  };
}

/** The comparison with the correction requests of the offers that have one, by offer id. */
export type CompareWithDrafts = Compare & { drafts: Record<string, CorrectionDraft> };

function withDrafts(ctx: Ctx, c: Compare): CompareWithDrafts {
  const drafts: Record<string, CorrectionDraft> = {};
  for (const o of c.lines.flatMap((l) => l.offers).filter((o) => o.correctable)) {
    const doc = ctx.offers.find((x) => x.id === o.id);
    if (doc) drafts[o.id] = correctionDraft(ctx, doc);
  }
  return { ...c, drafts };
}

/* ---------------------------------------------------------------- endpoints */

const caseParam = (req: PayloadRequest) => str(req.routeParams?.id);

export const commercialEndpoints: Endpoint[] = [
  {
    // The comparison, with the correction requests of offers with a wrong part (`drafts`).
    path: "/commercial/cases/:id/compare",
    method: "get",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        return Response.json(withDrafts(ctx, compare(ctx)));
      },
      { costs: true },
    ),
  },
  {
    // A split from the Compare tab's form: quantities `q0…` for `offers`, saved as the line's selection.
    path: "/commercial/cases/:id/split",
    method: "post",
    handler: async (req: PayloadRequest) => {
      const b = await body(req);
      const offers = Array.isArray(b.offers) ? (b.offers as string[]) : [];
      const select = commercialEndpoints.find((e) => e.path === "/commercial/cases/:id/select")!;
      const parts = offers.map((offer, i) => ({ offer, qty: Number(b[`q${i}`]) || 0 }));
      return select.handler({
        ...req,
        json: async () => ({ lineNo: b.lineNo, parts, reason: b.reason }),
      } as unknown as PayloadRequest);
    },
  },
  {
    path: "/commercial/cases/:id/select",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        const b = await body(req);
        const lineNo = num(b.lineNo);
        const item = ctx.items.find((i) => i.lineNo === lineNo);
        if (!item) return fail(404, `Line ${lineNo} not found.`);
        const line = compareLine(ctx, item);
        const wanted = ((b.parts as CmpPart[] | undefined) ?? []).filter((p) => num(p.qty) > 0);
        if (!wanted.length) return fail(400, "Choose at least one offer.");
        for (const p of wanted) {
          const o = line.offers.find((x) => x.id === p.offer);
          if (!o) return fail(400, `Offer ${p.offer} is not on line ${lineNo}.`);
          if (o.blocked)
            return fail(
              400,
              `${o.supplier} v${o.version} is blocked from pricing: ${o.flags.find((f) => f.tone === "error" || f.tone === "neutral")?.text ?? "deviation"}.`,
            );
          if (num(p.qty) * (item.packSize || 1) > o.baseQty + 1e-9)
            return fail(400, `${o.supplier} offers only ${o.baseQty / (item.packSize || 1)} ${item.unit}.`);
        }
        const total = wanted.reduce((s, p) => s + num(p.qty), 0);
        if (total < item.qty)
          return fail(400, `Selected ${total} of ${item.qty} ${item.unit} — split the rest to another offer.`);
        const isBest =
          (wanted.length === 1 && wanted[0].offer === line.best) ||
          (wanted.length > 1 &&
            !!line.split &&
            line.split.parts.length === wanted.length &&
            line.split.parts.every((s) => wanted.some((w) => w.offer === s.offer && num(w.qty) === s.qty)));
        const reason = str(b.reason).trim();
        if (!isBest && !reason)
          return fail(400, "Give a reason: this isn't the best-fit offer (kept for the approver).");
        const parts: CmpPart[] = [];
        for (const p of wanted)
          parts.push({
            offer: await materialise(
              ctx,
              item,
              line.offers.find((o) => o.id === p.offer)!,
            ),
            qty: num(p.qty),
          });
        const prev = new Set(line.selection.parts.map((p) => p.offer));
        const same = parts.length === prev.size && parts.every((p) => prev.has(p.offer));
        const accepted = same && line.selection.customerAccepted;
        const status = lineStatusFor(wanted, line, accepted);
        await saveItem(ctx, lineNo, (i) => ({
          ...i,
          status,
          selection: {
            ...i.selection,
            offers: parts.map((p) => p.offer),
            splitQty: parts.length > 1 ? parts.map((p) => ({ offer: p.offer, qty: p.qty })) : [],
            reason:
              reason ||
              (parts.length > 1 ? `Split sourcing: ${line.split?.text ?? ""}` : "Best-fit offer (landed cost)"),
            customerAccepted: accepted,
          },
        }));
        const names = wanted
          .map((p) => `${line.offers.find((o) => o.id === p.offer)?.supplier} × ${p.qty}`)
          .join(" + ");
        await logActivity(req, {
          case: ctx.c.id,
          text: `L${lineNo}: selected ${names}${reason ? ` — ${reason}` : " (best fit)"}.`,
          entity: `cases/${ctx.c.id}`,
        });
        const fresh = await load(req, ctx.c.id);
        return Response.json(compare(fresh!));
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/accept",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        const b = await body(req);
        const lineNo = num(b.lineNo);
        const item = ctx.items.find((i) => i.lineNo === lineNo);
        if (!item) return fail(404, `Line ${lineNo} not found.`);
        const line = compareLine(ctx, item);
        if (!line.selection.parts.length) return fail(400, "Select the alternative offer first.");
        const parts = line.selection.parts;
        await saveItem(ctx, lineNo, (i) => ({
          ...i,
          status: parts.length > 1 ? "Split offer selected" : "Offer selected",
          selection: {
            ...i.selection,
            offers: parts.map((p) => p.offer).filter((o) => !o.includes(":")),
            customerAccepted: true,
          },
        }));
        await logActivity(req, {
          case: ctx.c.id,
          text: `L${lineNo}: customer accepted the alternative pack in writing${b.note ? ` (${str(b.note)})` : ""}.`,
        });
        return Response.json(compare((await load(req, ctx.c.id))!));
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/correction",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        const b = await body(req);
        const offer = ctx.offers.find((o) => o.id === str(b.offer));
        if (!offer) return fail(404, "Offer not found.");
        const sup = ctx.suppliers.get(idOf(offer.supplier) ?? "");
        const corrected = ctx.offers.find((o) => idOf(o.supersedes) === offer.id);
        const draft = correctionDraft(ctx, offer);
        if (b.send && !corrected) {
          await update(req, "offers", offer.id, { compliance: "Awaiting corrected offer" });
          await logActivity(req, {
            case: ctx.c.id,
            text: `Correction request sent to ${str(sup?.name)} for line ${num(offer.lineNo)} (confirmed by ${str(userOf(req)?.name)}).`,
          });
          return Response.json({ ...draft, status: "Sent — awaiting corrected offer", sent: true });
        }
        return Response.json(draft);
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/pricing",
    method: "get",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        return Response.json(await pricing(ctx));
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/pricing",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        const b = await body(req);
        const p = { ...(ctx.c.pricing as Record<string, unknown> | undefined) };
        if (typeof b.allocation === "string" && ["value", "qty", "lines"].includes(b.allocation))
          p.allocation = b.allocation;
        if (typeof b.discountPct === "number") p.discountPct = Math.min(50, Math.max(0, b.discountPct));
        const margins = (b.margins as Record<string, number> | undefined) ?? {};
        const items = ctx.items.map((i) =>
          typeof margins[i.lineNo] === "number"
            ? { ...i, selection: { ...i.selection, marginPct: Math.min(90, Math.max(-50, margins[i.lineNo])) } }
            : i,
        );
        await update(req, "cases", ctx.c.id, { pricing: p, items });
        return Response.json(await pricing((await load(req, ctx.c.id))!));
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/request-approval",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, "Case not found.");
        const b = await body(req);
        const P = await pricing(ctx);
        if (!P.rows.length) return fail(400, "Select offers for at least one line first.");
        const quotes = (await all(req, "quotations", { case: { equals: ctx.c.id } })).sort(
          (a, b2) => num(b2.version) - num(a.version),
        );
        const latest = quotes[0];
        if (latest?.status === "Awaiting approval")
          return fail(400, `${str(latest.number)} is already awaiting approval.`);
        const lines = P.rows.map((r) => ({
          lineNo: r.lineNo,
          partNo: r.partNo,
          description: r.quoteDescription,
          unit: r.quoteUnit,
          qty: r.quoteQty,
          unitPrice: r.unitQuote,
          lead: r.lead,
          alternative: r.alternative,
        }));
        const data = {
          lines,
          currency: P.currency,
          fxRate: P.fx,
          discountPct: P.discountPct,
          internal: {
            landedCostEGP: Math.round(P.totals.landedEGP),
            grossProfitEGP: Math.round(P.totals.profitEGP),
            marginPct: P.totals.marginPct,
            exceptions: P.exceptions.join("; "),
          },
          remarks: P.unpriced.length
            ? `Items ${P.unpriced.map((u) => u.lineNo).join(", ")} of your request will follow in a revised quotation.`
            : "",
        };
        let q: Doc;
        if (latest && ["Draft", "Returned"].includes(str(latest.status)))
          q = await update(req, "quotations", latest.id, data);
        else {
          q = await create(req, "quotations", {
            ...data,
            case: ctx.c.id,
            previousVersion: latest?.id,
            status: "Draft",
            decision: "Quotation prepared",
            preparedBy: userOf(req)?.id,
            validUntil: new Date(DEMO_NOW.getTime() + 7 * DAY).toISOString(),
            paymentTerms: str(latest?.paymentTerms) || "90 days from invoice date",
            deliveryTerms: str(latest?.deliveryTerms) || `On board at ${str(ctx.c.port)} on arrival`,
          });
          if (latest && latest.status !== "Superseded")
            await update(req, "quotations", latest.id, { status: "Superseded" });
        }
        const out = await requestQuoteApproval(req, q, {
          type: P.approvalType,
          exceptions: P.exceptions,
          note: str(b.note),
        });
        await logActivity(req, {
          case: ctx.c.id,
          text: `${str(userOf(req)?.name)} requested approval of ${str(q.number)} (${P.approvalType.toLowerCase()}).`,
        });
        return Response.json({ approval: out.approval, quotation: out.quotation });
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/quotations/:id",
    method: "get",
    handler: handle(async (req) => {
      const v = await quoteView(req, str(req.routeParams?.id));
      return v ? Response.json(v) : fail(404, "Quotation not found.");
    }),
  },
  {
    path: "/commercial/quotations/:id/:action",
    method: "post",
    handler: handle(async (req) => {
      const id = str(req.routeParams?.id);
      const action = str(req.routeParams?.action);
      const q = await one(req, "quotations", id);
      if (!q) return fail(404, "Quotation not found.");
      const b = await body(req);
      const me = userOf(req);
      const caseId = str(idOf(q.case));
      if (action === "request-approval") {
        if (roleOf(req) === "sales" && /margin/i.test(str(b.type))) return fail(403, SALES_HIDDEN);
        await requestQuoteApproval(req, q, { note: str(b.note) });
      } else if (action === "send") {
        if (q.status !== "Approved") return fail(400, "Only an approved version can be sent to the customer.");
        const portal = b.method === "portal";
        await update(req, "quotations", id, {
          status: "Submitted",
          decision: "Awaiting customer decision",
          submission: {
            ...(q.submission as Record<string, unknown> | undefined),
            method: portal ? "Customer procurement portal" : "Email from Odoo",
            submittedAt: new Date().toISOString(),
            followUpAt: new Date(Date.now() + 2 * DAY).toISOString(),
          },
        });
        await update(req, "cases", caseId, {
          stage: "Awaiting customer decision",
          wait: "Awaiting customer decision",
          decision: "Awaiting customer decision",
          nextAction: `Follow up ${str(q.number)} in 2 days (internal reminder)`,
        });
        await logActivity(req, {
          case: caseId,
          text: portal
            ? `${str(q.number)} entered in the customer's procurement portal by ${str(me?.name)}.`
            : `${str(q.number)} emailed to ${str(b.to) || "the customer"} — draft confirmed by ${str(me?.name)}.`,
        });
      } else if (action === "revise") {
        if (!["Approved", "Submitted", "Returned"].includes(str(q.status)))
          return fail(400, `${str(q.number)} is ${str(q.status).toLowerCase()} — revise the latest version instead.`);
        const {
          id: _id,
          number: _n,
          version: _v,
          createdAt: _c,
          updatedAt: _u,
          approvedBy: _a,
          submission: _s,
          ...rest
        } = q;
        void [_id, _n, _v, _c, _u, _a, _s];
        const next = await create(req, "quotations", {
          ...rest,
          case: caseId,
          previousVersion: id,
          status: "Draft",
          decision: "Quotation prepared",
          preparedBy: me?.id,
          remarks: [str(q.remarks), b.reason ? `Revision: ${str(b.reason)}` : ""].filter(Boolean).join("\n"),
        });
        await update(req, "quotations", id, {
          status: "Superseded",
          decision: q.status === "Submitted" ? "Revision requested" : q.decision,
        });
        if (q.status === "Submitted")
          await update(req, "cases", caseId, { stage: "Revision requested", decision: "Revision requested" });
        await logActivity(req, {
          case: caseId,
          text: `${str(next.number)} created from ${str(q.number)} (kept for audit).`,
        });
        return Response.json({ id: next.id, view: await quoteView(req, next.id) });
      } else if (action === "decision") {
        const decision = str(b.decision);
        if (!DECISIONS.includes(decision)) return fail(400, "Unknown decision.");
        if (q.status !== "Submitted") return fail(400, "Record the customer's decision on the version they received.");
        if (decision === "Revision requested") {
          await update(req, "quotations", id, { decision });
          await update(req, "cases", caseId, { stage: "Revision requested", decision, wait: null });
        } else {
          await update(req, "quotations", id, { decision });
          await update(req, "cases", caseId, {
            decision,
            ...(decision === "Lost"
              ? { stage: "Lost", lostReason: str(b.note) || "Not given", tone: "neutral" }
              : { stage: "Won — sales order confirmed", wait: null, tone: "ok" }),
            nextAction:
              decision === "Lost"
                ? "Closed — lost"
                : decision === "Partially won"
                  ? "Check customer PO against the quote (partial award)"
                  : "Check customer PO against the quote",
          });
        }
        await logActivity(req, {
          case: caseId,
          text: `Customer decision on ${str(q.number)}: ${decision}${b.note ? ` — ${str(b.note)}` : ""}.`,
        });
      } else if (action === "portal-check") {
        // AI stub: reads the portal screenshot and compares it with the approved quotation.
        const sub = (q.submission as Record<string, unknown> | undefined) ?? {};
        const total = num(q.totalExVat).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const rows = [
          { field: "Quotation no.", portal: str(q.number), quote: str(q.number), matches: true },
          { field: "Currency", portal: str(q.currency), quote: str(q.currency), matches: true },
          { field: "Total (excl. VAT)", portal: total, quote: total, matches: true },
          {
            field: "Line count",
            portal: String(((q.lines as unknown[]) ?? []).length),
            quote: String(((q.lines as unknown[]) ?? []).length),
            matches: true,
          },
          { field: "Validity", portal: fmtDay(q.validUntil), quote: fmtDay(q.validUntil), matches: true },
          { field: "Payment terms", portal: "60 days (portal default)", quote: str(q.paymentTerms), matches: false },
        ];
        await update(req, "quotations", id, {
          submission: { ...sub, method: "Customer procurement portal", portalCheck: rows },
        });
        await logActivity(req, {
          case: caseId,
          kind: "auto",
          text: `AI compared the portal screenshot with ${str(q.number)}: 1 difference (payment terms). Submission not marked complete.`,
        });
        return Response.json({ rows, view: await quoteView(req, id) });
      } else return fail(404, "Unknown action.");
      return Response.json(await quoteView(req, id));
    }),
  },
  {
    path: "/commercial/approvals",
    method: "get",
    handler: handle(async (req) => {
      const [list, users] = await Promise.all([all(req, "approvals"), all(req, "users")]);
      const names = byId(users);
      const cards = await Promise.all(
        list.sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt))).map((a) => approvalCard(req, a, names)),
      );
      const pending = cards.filter((c) => !["Approved", "Rejected"].includes(c.status));
      return Response.json({
        pending: pending.sort((a, b) => Number(b.canDecide) - Number(a.canDecide)),
        decided: cards.filter((c) => ["Approved", "Rejected"].includes(c.status)),
        mine: pending.filter((c) => c.canDecide).length,
      });
    }),
  },
  {
    path: "/commercial/approvals/:id/decide",
    method: "post",
    handler: handle(async (req) => {
      const b = await body(req);
      const decision = b.decision === "Reject" ? "Reject" : b.decision === "Approve" ? "Approve" : null;
      if (!decision) return fail(400, "Decision must be Approve or Reject.");
      const doc = await decide(req, str(req.routeParams?.id), decision, str(b.reason));
      const users = byId(await all(req, "users"));
      const c = await approvalCard(req, doc, users);
      // `message`: what the approvals screen says once it's recorded (the action's snackbar).
      const message =
        c.status === "Approved"
          ? `Approved: ${c.title}`
          : c.status === "Rejected"
            ? `Returned: ${c.title}`
            : `Your approval is recorded — ${c.progress}.`;
      return Response.json({ ...c, message });
    }),
  },
];
