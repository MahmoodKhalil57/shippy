import type { Endpoint, PayloadRequest } from "payload";
import type { ApprovalView } from "../collections/commercial.ts";
import { activeRate, activeRates, idOf, logActivity } from "../collections/shared.ts";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import { DEMO_NOW } from "./home.ts";
import { bankRequest } from "./operations.ts";
import { m } from "../i18n/paraglide/messages.js";
import { type Lang, intlLocale, langOf, optionLabel } from "./insights-shared.ts";

export type Tone = "error" | "warning" | "info" | "success" | "neutral";
export interface Flag {
  tone: Tone;
  text: string;
  type?: string;
}

const DAY = 86_400_000;
const VAT = 0.14;
const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const fmtDay = (v: unknown, lang: Lang = "en") =>
  v ? new Date(str(v)).toLocaleDateString(intlLocale(lang), { day: "numeric", month: "short", timeZone: "UTC" }) : "";
const egp = (n: number, lang: Lang = "en") => `EGP ${Math.round(n).toLocaleString(intlLocale(lang, "en-US"))}`;
const loc = (req: PayloadRequest) => ({ locale: langOf(req) });
const dayIndex = (d: Date) => Math.floor(d.getTime() / DAY);

const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });
type User = Doc & { name?: string; role?: string };
const userOf = (req: PayloadRequest) => req.user as unknown as User | null;
const roleOf = (req: PayloadRequest) => str(userOf(req)?.role);
const salesHidden = (req: PayloadRequest) => m.api_commercial_sales_hidden({}, loc(req));

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    return ((await req.json?.()) ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function all(req: PayloadRequest, collection: string, where?: Record<string, unknown>): Promise<Doc[]> {
  const r = await req.payload.find({
    locale: req.locale,
    collection: collection as never,
    where: where as never,
    pagination: false,
    depth: 0,
  });
  return r.docs as unknown as Doc[];
}
const byId = (docs: Doc[]) => new Map(docs.map((d) => [d.id, d]));
const one = (req: PayloadRequest, collection: string, id: string) =>
  req.payload
    .findByID({ locale: req.locale, collection: collection as never, id, depth: 0 })
    .catch(() => null) as Promise<Doc | null>;
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

const handle =
  (fn: (req: PayloadRequest) => Promise<Response>, opts: { costs?: boolean } = {}) =>
  async (req: PayloadRequest) => {
    if (!req.user) return fail(401, m.api_insights_shared_not_allowed({}, loc(req)));
    if (opts.costs && roleOf(req) === "sales") return fail(403, salesHidden(req));
    try {
      return await fn(req);
    } catch (e) {
      const err = e as Error & { status?: number };
      return fail(err.status ?? 500, err.message);
    }
  };

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
  const g = (await req.payload.findGlobal({ locale: req.locale, slug: "fx-rates" as never, depth: 0 })) as {
    rates?: Rate[];
  };
  const rates = g.rates ?? [];
  const fx: Record<string, number> = { EGP: 1, ...activeRates(rates) };
  if (fx.USD === undefined || fx.EUR === undefined) {
    if (IS_TEMP_MOCK) {
      fx.USD ??= 48.6;
      fx.EUR ??= 52.9;
    } else {
      throw new TempMockError(
        "an active USD and EUR rate in the fx-rates global, with no fixed fallback (48.60, 52.90)",
      );
    }
  }
  return { fx, rates, label: m.api_commercial_fx_label({ usd: fx.USD.toFixed(2), eur: fx.EUR.toFixed(2) }, loc(req)) };
}

interface Policy {
  targetMarginPct?: number;
  minMarginPct?: number;
  maxDiscountWithoutApprovalPct?: number;
  allocationDefault?: string;
  byStore?: { store?: string; targetPct?: number; minPct?: number; maxDiscountPct?: number }[];
}
const policyOf = async (req: PayloadRequest) =>
  (await req.payload.findGlobal({ locale: req.locale, slug: "pricing-policy" as never, depth: 0 })) as Policy;

interface Rule {
  type?: string;
  approvers?: string[];
  twoPerson?: boolean;
  note?: string;
}
async function ruleFor(req: PayloadRequest, type: string): Promise<Rule> {
  const g = (await req.payload.findGlobal({ locale: req.locale, slug: "approval-rules" as never, depth: 0 })) as {
    rules?: Rule[];
  };
  const rule = g.rules?.find((r) => r.type === type);
  return {
    type,
    approvers: (rule?.approvers ?? ["kb"]).map((a) => idOf(a) ?? ""),
    twoPerson: rule?.twoPerson,
    note: rule?.note,
  };
}

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
  lang: Lang;
  o: { locale: Lang };
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
    lang: langOf(req),
    o: loc(req),
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

const LANE_EGP: Record<string, number> = { Damietta: 600, Alexandria: 1800, Cairo: 1200, Suez: 900, "Port Said": 600 };
const IMPORT_PCT = 0.18;

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
  if (!rows.some((r) => r.kind === "stock"))
    for (const s of ctx.stock.filter((s) => idOf(s.product) === product && num(s.available) > 0)) {
      const lots = (s.lots as { lot?: string; expiry?: string }[] | undefined) ?? [];
      rows.push({
        id: `stock:${s.id}`,
        kind: "stock",
        supplierId: "GS",
        version: 1,
        superseded: false,
        offered: m
          .api_commercial_on_hand({ n: num(s.available), place: `${str(s.warehouse)} ${str(s.bin)}` }, ctx.o)
          .trim(),
        price: num(s.avgCostEGP),
        currency: "EGP",
        discountPct: 0,
        packs: Math.min(num(s.available), reqBase),
        packSize: 1,
        packLabel: "",
        leadDays: 1,
        validUntil: "",
        expiry: lots[0]?.expiry ? str(lots[0].expiry).slice(0, 7) : "",
        terms: m.api_commercial_own_stock_terms({}, ctx.o),
        basis: `Ex-stock ${str(s.warehouse).split(" ")[0]}`,
        compliance: "Confirmed",
        deviations: [],
        note: lots.map((l) => l.lot).join(", "),
      });
    }
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
      terms: m.api_commercial_agency_terms({}, ctx.o),
      basis: "Import",
      compliance: "Confirmed",
      deviations: [],
    });
  }
  return rows;
}

function freightOf(ctx: Ctx, o: RawOffer, sup: Doc | undefined, goodsEGP: number) {
  const port = str(ctx.c.port) || "Port Said";
  const t = ctx.o;
  if (o.freightEGP !== undefined) return { egp: o.freightEGP, note: m.api_commercial_freight_as_quoted({}, t) };
  if (o.kind === "agency")
    return { egp: round(goodsEGP * IMPORT_PCT, 0), note: m.api_commercial_import_freight({}, t) };
  if (/^delivered/i.test(o.basis) || (!o.basis && o.kind === "supplier"))
    return { egp: 0, note: o.basis || m.api_commercial_delivered_as_quoted({}, t) };
  const origin = /ex-?(?:stock|works)\s+([A-Za-z ]+)/i.exec(o.basis)?.[1]?.trim() ?? str(sup?.city);
  if (origin === port) return { egp: 250, note: m.api_commercial_local_truck({ port }, t) };
  const from = origin || m.api_commercial_supplier_word({}, t);
  return {
    egp: LANE_EGP[origin] ?? 1500,
    note:
      o.kind === "stock"
        ? m.api_commercial_gs_truck_lane({ from, port }, t)
        : m.api_commercial_truck_lane({ from, port }, t),
  };
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
    flags.push({
      tone,
      text: `${optionLabel(ctx.req, "offers", "deviations.type", d.type)}: ${str(d.detail)}`,
      type: str(d.type),
    });
    if (d.severity === "Blocks use") blocked = true;
    if (d.severity === "Needs customer acceptance") needsAcceptance = true;
  }
  const correctedBy = all.find((x) => x.supersedes === o.id);
  if (o.superseded) {
    blocked = true;
    flags.push({
      tone: "neutral",
      text: m.api_commercial_superseded_by({ version: correctedBy?.version ?? o.version + 1 }, ctx.o),
    });
  }
  if (o.supersedes) {
    const prev = all.find((x) => x.id === o.supersedes);
    const was = prev?.deviations[0]?.type
      ? optionLabel(ctx.req, "offers", "deviations.type", prev.deviations[0].type).toLowerCase()
      : "";
    flags.push({
      tone: "success",
      text: m.api_commercial_corrected_version(
        { version: o.version, replaces: prev?.version ?? o.version - 1, hasWas: was ? "yes" : "no", was },
        ctx.o,
      ),
    });
  }
  if (o.compliance === "Rejected" && !blocked) {
    blocked = true;
    flags.push({ tone: "error", text: m.api_commercial_rejected_technical({}, ctx.o) });
  }
  if (item.exactBrand && o.offered && item.partNo && !o.offered.includes(item.partNo) && !has("Wrong brand / part")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: m.api_commercial_wrong_part({ brand: item.brand ?? "", partNo: item.partNo }, ctx.o),
      type: "Wrong brand / part",
    });
  }
  if ((item.packSize || 1) !== o.packSize && o.kind !== "stock" && !has("Pack size")) {
    needsAcceptance = true;
    flags.push({
      tone: "warning",
      text: m.api_commercial_pack_size(
        { offered: o.packLabel || `${o.packs} × ${o.packSize}`, requested: `${item.qty} × ${item.packSize}` },
        ctx.o,
      ),
      type: "Pack size",
    });
  }
  const need = requiredShelfLife(ctx, item);
  const left = o.expiry ? monthsUntil(o.expiry) : Infinity;
  const shelfShort = (need > 0 && left < need) || has("Shelf life");
  if (shelfShort && !has("Shelf life"))
    flags.push({
      tone: "warning",
      text: m.api_commercial_shelf_life({ left, need }, ctx.o),
      type: "Shelf life",
    });
  if (ctx.daysToEta >= 0 && o.leadDays > ctx.daysToEta && !has("Lead time vs ETA")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: m.api_commercial_lead_time_misses({ days: o.leadDays, eta: fmtDay(ctx.c.eta, ctx.lang) }, ctx.o),
      type: "Lead time vs ETA",
    });
  } else if (o.leadDays === ctx.daysToEta && !has("Lead time vs ETA"))
    flags.push({ tone: "warning", text: m.api_commercial_tight_eta({}, ctx.o), type: "Lead time vs ETA" });
  if (o.validUntil && new Date(o.validUntil) < DEMO_NOW && !has("Expired validity")) {
    blocked = true;
    flags.push({
      tone: "error",
      text: m.api_commercial_expired_validity({ day: fmtDay(o.validUntil, ctx.lang) }, ctx.o),
      type: "Expired validity",
    });
  }
  if (baseQty < reqBase && !has("Quantity shortfall"))
    flags.push({
      tone: "warning",
      text: m.api_commercial_quantity_shortfall({ pct: Math.round((baseQty / reqBase) * 100) }, ctx.o),
      type: "Quantity shortfall",
    });
  const newSupplier = sup?.status === "New";
  if (newSupplier)
    flags.push({
      tone: "info",
      text: m.api_commercial_new_supplier({ terms: str(sup?.terms) || m.api_commercial_terms_tbc({}, ctx.o) }, ctx.o),
    });
  if (o.kind === "stock")
    flags.push({
      tone: "success",
      text: m.api_commercial_own_stock_flag({ hasLot: o.note ? "yes" : "no", lot: o.note ?? "" }, ctx.o),
    });
  if (o.kind === "agency") flags.push({ tone: "info", text: m.api_commercial_agency_flag({}, ctx.o) });
  if (o.currency !== "EGP")
    flags.push({
      tone: "neutral",
      text: m.api_commercial_converted_fx({ currency: o.currency, rate: (ctx.fx[o.currency] ?? 1).toFixed(2) }, ctx.o),
    });

  const leadDate = new Date(DEMO_NOW.getTime() + o.leadDays * DAY).toISOString();
  return {
    id: o.id,
    kind: o.kind,
    supplier: str(sup?.name) || o.supplierId,
    supplierNote: sup
      ? [
          sup.onTime
            ? m.api_commercial_on_time({ pct: num(sup.onTime) }, ctx.o)
            : m.api_commercial_no_delivery_history({}, ctx.o),
          sup.replyHrs ? m.api_commercial_replies_in({ hours: num(sup.replyHrs) }, ctx.o) : "",
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
    per: o.packSize === 1 ? baseUnitOf(ctx, item) : m.api_commercial_pack({}, ctx.o),
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
        note: m.api_commercial_missing_item_note({}, ctx.o),
        tone: "error",
      });
    else
      others.push({
        supplier: name,
        status,
        note: str(r.lastEvent) || m.api_commercial_due_day({ day: fmtDay(r.dueAt, ctx.lang) }, ctx.o),
        tone: "warning",
      });
  }

  const status = str(item.status) || (offers.length ? "Ready to select" : "Not sourced");
  const exact = item.exactBrand
    ? m.api_commercial_exact_only({ part: `${item.brand ?? ""} ${item.partNo ?? ""}`.trim() }, ctx.o)
    : m.api_commercial_alternatives_allowed({}, ctx.o);
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
  const t = ctx.o;
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
    const alt = parts.length === 1 && parts[0].o.flags.some((f) => f.type === "Pack size") ? parts[0].o : undefined;
    const altPack = alt ? ctx.offers.find((o) => o.id === alt.id) : undefined;
    const quoteQty = alt && altPack ? num(altPack.packs) : item.qty;
    const quoteUnit = item.unit;
    const sellQuote = sell / rate;
    const checks: Flag[] = [];
    if (marginPct <= 0) checks.push({ tone: "error", text: m.api_commercial_negative_profit({}, t) });
    else if (marginPct < minPct)
      checks.push({ tone: "warning", text: m.api_commercial_below_min({ min: minPct }, t), type: "below-min" });
    for (const x of parts) {
      for (const f of x.o.flags) {
        if (f.type === "Lead time vs ETA" && f.tone === "error")
          checks.push({ tone: "error", text: m.api_commercial_lead_time_misses_eta({}, t) });
        if (f.type === "Expired validity") checks.push({ tone: "error", text: m.api_commercial_price_expired({}, t) });
        if (f.type === "Shelf life") checks.push({ tone: "warning", text: m.api_commercial_shelf_life_below({}, t) });
      }
      if (x.o.newSupplier)
        checks.push({ tone: "info", text: m.api_commercial_advance_payment({ supplier: x.o.supplier }, t) });
    }
    if (alt && !accepted)
      checks.push({ tone: "warning", text: m.api_commercial_pending_acceptance({}, t), type: "alternative" });
    if (alt && accepted) checks.push({ tone: "success", text: m.api_commercial_alternative_accepted({}, t) });
    if (parts.length > 1)
      checks.push({
        tone: "info",
        text: m.api_commercial_split_sourcing({ parts: parts.map((x) => `${x.o.supplier} × ${x.qty}`).join(" + ") }, t),
      });
    const ready = Math.max(...parts.map((x) => x.o.leadDays));
    return {
      lineNo: item.lineNo,
      description: item.description,
      store: str(item.store),
      sourcing: parts
        .map(
          (x) =>
            `${x.o.supplier}${x.o.version > 1 ? ` v${x.o.version}` : ""} · ${x.o.currency} ${x.o.price.toLocaleString(intlLocale(ctx.lang, "en-US"))} · ${m.api_commercial_days_short({ n: x.o.leadDays }, t)}`,
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
        ? m.api_commercial_supplied_as(
            {
              description: item.description,
              pack: altPack?.packLabel ? str(altPack.packLabel) : m.api_commercial_alternative_pack({}, t),
              accepted: accepted ? "yes" : "no",
            },
            t,
          )
        : item.description,
      partNo: item.partNo && item.partNo !== "local" ? item.partNo : item.impa ? `IMPA ${item.impa}` : "",
      lead:
        ready <= ctx.daysToEta || ctx.daysToEta < 0
          ? m.api_commercial_on_arrival({}, t)
          : m.api_commercial_lead_days({ n: ready }, t),
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
  if (rows.length && marginPct < min)
    exceptions.push(m.api_commercial_quote_margin_below({ margin: marginPct, min }, t));
  if (discountPct > maxDiscount)
    exceptions.push(m.api_commercial_discount_above({ discount: discountPct, max: maxDiscount }, t));
  for (const c of charges.filter((c) => c.status === "Estimate"))
    exceptions.push(m.api_commercial_charge_estimate({ label: c.label, amount: egp(c.amountEGP, ctx.lang) }, t));
  if (unpriced.length)
    exceptions.push(
      m.api_commercial_lines_excluded(
        { lines: unpriced.map((u) => u.lineNo).join(ctx.lang === "ar" ? "، " : ", ") },
        t,
      ),
    );
  const belowMin = rows.some((r) => r.marginPct < r.minPct) || (rows.length > 0 && marginPct < min);

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

const OPEN_APPROVAL = (a: Doc) => !["Approved", "Rejected"].includes(str(a.status));
const subjectOf = (a: Doc) => idOf((a.subject as { value?: unknown } | undefined)?.value);

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
  const t = loc(req);
  if (!["Draft", "Returned"].includes(str(q.status)))
    throw Object.assign(
      new Error(
        m.api_commercial_nothing_to_request(
          { number: str(q.number), status: optionLabel(req, "quotations", "status", q.status).toLowerCase() },
          t,
        ),
      ),
      { status: 400 },
    );
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
  const total = `${str(q.currency)} ${num(q.totalExVat).toLocaleString(intlLocale(t.locale, "en-US"), { maximumFractionDigits: 2 })}`;
  const approval = await create(req, "approvals", {
    title: m.api_commercial_approval_title({ number: str(q.number), customer: str(customer?.name), total }, t),
    type,
    case: idOf(q.case),
    detail: [opts.note, ...exceptions].filter(Boolean).join("\n") || m.api_commercial_no_exceptions({}, t),
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
      nextAction: m.api_commercial_karim_approve({ number: str(q.number) }, t),
    });
  return { approval, quotation };
}

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
  versions?: { id: string; number: string; version: number; status: string }[];
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
}

async function quoteView(req: PayloadRequest, id: string): Promise<QuoteView | null> {
  const q = await one(req, "quotations", id);
  if (!q) return null;
  const c = await one(req, "cases", str(idOf(q.case)));
  const [customer, vessels, users, fx] = await Promise.all([
    c ? one(req, "customers", str(idOf(c.customer))) : null,
    all(req, "vessels"),
    all(req, "users"),
    fxRates(req),
  ]);
  const vessel = vessels.find((v) => v.id === idOf(c?.vesselRecord) || v.name === c?.vessel);
  const contacts = (customer?.contacts as { name?: string; email?: string }[] | undefined) ?? [];
  const names = byId(users);
  const pending = (await approvalsFor(req, q)).find(OPEN_APPROVAL);
  const open = pending ? await readApproval(req, pending.id) : null;
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
  const t = loc(req);
  const stepLabel =
    step === 4 ? optionLabel(req, "quotations", "decision", decision) : m.api_commercial_customer_decision({}, t);
  return {
    quotation: { ...q, internal: undefined } as unknown as QuoteDoc,
    case: {
      id: str(c?.id),
      caseId: str(c?.caseId),
      customer: str(customer?.name),
      attention: contacts[0]?.name ?? m.api_commercial_purchasing_department({}, t),
      email: contacts[0]?.email ?? str(customer?.contactEmail),
      customerRef: str(c?.customerRef),
      vessel: str(c?.vessel),
      imo: str(vessel?.imo),
      port: str(c?.port),
      eta: str(c?.eta),
      portal: str((customer?.registration as { portal?: string } | undefined)?.portal),
    },
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
          ? m.api_commercial_approved_dot({}, t)
          : m.api_commercial_no_approval_requested({}, t),
      send: status === "Approved" ? "" : m.api_commercial_only_approved_sent({}, t),
    },
    preparedBy: str(names.get(idOf(q.preparedBy) ?? "")?.name),
    approvedBy: str(names.get(idOf(q.approvedBy) ?? "")?.name),
  };
}

const DECISIONS = ["Won", "Partially won", "Lost", "Expired", "Revision requested"];

async function supersede(req: PayloadRequest, q: Doc, next: Doc) {
  const t = loc(req);
  const caseId = str(idOf(q.case));
  const sent = q.status === "Submitted";
  await update(req, "quotations", q.id, {
    status: "Superseded",
    decision: sent ? "Revision requested" : q.decision,
  });
  await update(req, "cases", caseId, {
    ...(sent ? { stage: "Revision requested", decision: "Revision requested" } : {}),
    wait: null,
    nextAction: m.api_commercial_send_for_approval({ number: str(next.number) }, t),
  });
  await logActivity(req, {
    case: caseId,
    text: m.api_commercial_revised_activity({ next: str(next.number), from: str(q.number) }, t),
  });
}

const readApproval = (req: PayloadRequest, id: string) =>
  req.payload.findByID({ collection: "approvals" as never, id, depth: 0, req }) as unknown as Promise<
    Doc & ApprovalView
  >;

async function decide(req: PayloadRequest, id: string, decision: "Approve" | "Reject", reason: string) {
  const t = loc(req);
  const a = await one(req, "approvals", id);
  if (!a) throw Object.assign(new Error(m.api_commercial_approval_not_found({}, t)), { status: 404 });
  if (decision === "Reject" && !reason.trim())
    throw Object.assign(new Error(m.api_commercial_give_return_reason({}, t)), { status: 400 });
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
        await update(req, "cases", caseId, {
          nextAction: m.api_commercial_send_to_customer({ number: str(q.number) }, t),
          wait: null,
        });
      } else {
        await update(req, "quotations", q.id, { status: "Returned", decision: "Quotation prepared" });
        await update(req, "cases", caseId, {
          nextAction: m.api_commercial_revise_pricing({ name: str(me?.name), reason }, t),
        });
      }
    }
  } else if (type === "Exchange rate") {
    const g = await fxRates(req);
    const approved = status === "Approved";
    const replaced = new Set(
      approved
        ? g.rates
            .filter((r) => r.status === "Awaiting approval" && r.currency)
            .map((r) => activeRate(g.rates, str(r.currency)))
        : [],
    );
    const rates = g.rates.map((r) =>
      r.status === "Awaiting approval"
        ? {
            ...r,
            status: approved ? "Active" : "Rejected",
            approvedBy: approved ? me?.id : undefined,
          }
        : replaced.has(r)
          ? { ...r, status: "Superseded" }
          : r,
    );
    await req.payload.updateGlobal({ slug: "fx-rates" as never, data: { rates } as never, req, depth: 0 } as never);
  }
  await logActivity(req, {
    case: caseId,
    text: m.api_commercial_decided_activity(
      {
        name: str(me?.name),
        approved: status === "Approved" ? "yes" : "no",
        title: str(a.title),
        hasReason: reason ? "yes" : "no",
        reason,
      },
      t,
    ),
    entity: `approvals/${id}`,
  });
  return updated;
}

type Decision = { user?: unknown; decision?: string; at?: string; reason?: string };
const decisionsOf = (a: Doc) =>
  ((a.decisions as Decision[] | undefined) ?? []).map((d) => ({ ...d, user: idOf(d.user) }));
const FINAL = ["Approved", "Rejected"];

async function decidedQuotation(req: PayloadRequest, a: Doc): Promise<Doc | null> {
  const subject = subjectOf(a);
  return /quotation|discount/i.test(str(a.type)) && subject ? one(req, "quotations", subject) : null;
}

async function withdrawBlock(req: PayloadRequest, a: Doc): Promise<string> {
  const t = loc(req);
  const me = userOf(req);
  const decisions = decisionsOf(a);
  const last = decisions.at(-1);
  if (!decisions.some((d) => d.user === me?.id)) return m.api_commercial_no_decision_to_withdraw({}, t);
  if (last?.user !== me?.id) return m.api_commercial_someone_decided_after({}, t);
  if (!FINAL.includes(str(a.status))) return "";
  const type = str(a.type);
  if (type === "Exchange rate") return m.api_commercial_fx_decision_stands({}, t);
  if (/quotation|discount/i.test(type)) {
    const q = await decidedQuotation(req, a);
    if (!q) return m.api_commercial_no_quotation_named({}, t);
    const left = a.status === "Approved" ? "Approved" : "Returned";
    if (q.status !== left)
      return m.api_commercial_already_cant_withdraw(
        { number: str(q.number), status: optionLabel(req, "quotations", "status", q.status).toLowerCase() },
        t,
      );
  }
  if (/deposit|payment/i.test(type)) {
    const paid = await all(req, "payments", { approval: { equals: a.id } });
    if (paid.length) return m.api_commercial_payment_recorded_cant_withdraw({}, t);
  }
  if (type === "Bank detail change") {
    const request = bankRequest(a.id);
    const supplier = request ? await one(req, "suppliers", request.supplier) : null;
    const bank = (supplier?.bank as { iban?: string; verified?: boolean } | undefined) ?? {};
    if (request && bank.verified && bank.iban === request.requested.iban)
      return m.api_commercial_bank_applied_cant_withdraw({}, t);
  }
  if (type === "Supplier PO") {
    const po = subjectOf(a) ? await one(req, "purchase-orders", str(subjectOf(a))) : null;
    if (po && !["Draft", "Awaiting approval"].includes(str(po.status)))
      return m.api_commercial_already_cant_withdraw(
        { number: str(po.number), status: optionLabel(req, "purchase-orders", "status", po.status).toLowerCase() },
        t,
      );
  }
  return "";
}

export async function withdrawal(
  req: PayloadRequest,
  approval: string,
): Promise<{ path: string; body: Record<string, unknown> } | null> {
  const a = await one(req, "approvals", approval);
  if (!a || (await withdrawBlock(req, a))) return null;
  return { path: `/commercial/approvals/${encodeURIComponent(a.id)}/withdraw`, body: {} };
}

async function withdraw(req: PayloadRequest, id: string) {
  const t = loc(req);
  const a = await one(req, "approvals", id);
  if (!a) throw Object.assign(new Error(m.api_commercial_approval_not_found({}, t)), { status: 404 });
  const blocked = await withdrawBlock(req, a);
  if (blocked) throw Object.assign(new Error(blocked), { status: 409 });
  const me = userOf(req);
  const mine = decisionsOf(a).at(-1)!;
  const q = FINAL.includes(str(a.status)) ? await decidedQuotation(req, a) : null;
  const updated = (await req.payload.update({
    collection: "approvals" as never,
    id,
    data: { decisions: decisionsOf(a).slice(0, -1) } as never,
    req,
    depth: 0,
    overrideAccess: false,
  })) as unknown as Doc;
  const caseId = idOf(a.case);
  if (q) {
    await update(req, "quotations", q.id, {
      status: "Awaiting approval",
      approvedBy: null,
      decision: "Awaiting management approval",
    });
    if (caseId)
      await update(req, "cases", caseId, {
        wait: "Awaiting internal approval",
        nextAction: m.api_commercial_karim_approve({ number: str(q.number) }, t),
      });
  }
  await logActivity(req, {
    case: caseId,
    text: m.api_commercial_withdrew_activity(
      { name: str(me?.name), approval: mine.decision === "Approve" ? "yes" : "no", title: str(a.title) },
      t,
    ),
    entity: `approvals/${id}`,
  });
  return updated;
}

function portalCheck(q: Doc, t: { locale: Lang }) {
  if (IS_MOCK) {
    const total = num(q.totalExVat).toLocaleString(intlLocale(t.locale, "en-US"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return [
      {
        field: m.api_commercial_field_quotation_no({}, t),
        portal: str(q.number),
        quote: str(q.number),
        matches: true,
      },
      {
        field: m.api_commercial_field_currency({}, t),
        portal: str(q.currency),
        quote: str(q.currency),
        matches: true,
      },
      { field: m.api_commercial_field_total({}, t), portal: total, quote: total, matches: true },
      {
        field: m.api_commercial_field_line_count({}, t),
        portal: String(((q.lines as unknown[]) ?? []).length),
        quote: String(((q.lines as unknown[]) ?? []).length),
        matches: true,
      },
      {
        field: m.api_commercial_field_validity({}, t),
        portal: fmtDay(q.validUntil, t.locale),
        quote: fmtDay(q.validUntil, t.locale),
        matches: true,
      },
      {
        field: m.api_commercial_field_payment_terms({}, t),
        portal: m.api_commercial_portal_default_terms({}, t),
        quote: str(q.paymentTerms),
        matches: false,
      },
    ];
  } else {
    throw new NotConnectedError("the AI model reading the customer portal's screenshot against the approved quotation");
  }
}

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
  const t = ctx.o;
  const contact = str(sup?.contact).split("·")[0].trim();
  return {
    to: `${str(sup?.name)} <${contact || "sales"}>`,
    subject: m.api_commercial_correction_subject(
      { rfq: str(rfq?.reference) || m.api_commercial_our_rfq({}, t), line: num(offer.lineNo) },
      t,
    ),
    body: [
      contact ? m.api_commercial_dear({ name: contact }, t) : m.api_commercial_dear_colleagues({}, t),
      "",
      m
        .api_commercial_correction_asked(
          {
            line: num(offer.lineNo),
            part: `${item?.brand ?? ""} ${item?.partNo ?? item?.description ?? ""}`,
          },
          t,
        )
        .replace(/\s+/g, " "),
      m
        .api_commercial_your_offer(
          {
            offered: str(offer.offeredDescription) || m.api_commercial_different_item({}, t),
            detail: dev?.detail ?? "",
          },
          t,
        )
        .trim(),
      "",
      m.api_commercial_correction_please({}, t),
      "",
      m.api_commercial_best_regards({}, t),
      str(userOf(ctx.req)?.name),
      "Golden Sea for Trading & Marketing",
    ].join("\n"),
    status: corrected
      ? m.api_commercial_correction_sent_status({ version: num(corrected.version, 2) }, t)
      : m.api_commercial_draft_not_sent({}, t),
    sent: Boolean(corrected),
  };
}

export type CompareWithDrafts = Compare & { drafts: Record<string, CorrectionDraft> };

function withDrafts(ctx: Ctx, c: Compare): CompareWithDrafts {
  const drafts: Record<string, CorrectionDraft> = {};
  for (const o of c.lines.flatMap((l) => l.offers).filter((o) => o.correctable)) {
    const doc = ctx.offers.find((x) => x.id === o.id);
    if (doc) drafts[o.id] = correctionDraft(ctx, doc);
  }
  return { ...c, drafts };
}

const caseParam = (req: PayloadRequest) => str(req.routeParams?.id);

export const commercialEndpoints: Endpoint[] = [
  {
    path: "/commercial/cases/:id/compare",
    method: "get",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        return Response.json(withDrafts(ctx, compare(ctx)));
      },
      { costs: true },
    ),
  },
  {
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        const b = await body(req);
        const lineNo = num(b.lineNo);
        const item = ctx.items.find((i) => i.lineNo === lineNo);
        if (!item) return fail(404, m.api_commercial_line_not_found({ line: lineNo }, loc(req)));
        const line = compareLine(ctx, item);
        const wanted = ((b.parts as CmpPart[] | undefined) ?? []).filter((p) => num(p.qty) > 0);
        const t = ctx.o;
        if (!wanted.length) return fail(400, m.api_commercial_choose_offer({}, t));
        for (const p of wanted) {
          const o = line.offers.find((x) => x.id === p.offer);
          if (!o) return fail(400, m.api_commercial_offer_not_on_line({ offer: p.offer, line: lineNo }, t));
          if (o.blocked)
            return fail(
              400,
              m.api_commercial_offer_blocked(
                {
                  supplier: o.supplier,
                  version: o.version,
                  reason:
                    o.flags.find((f) => f.tone === "error" || f.tone === "neutral")?.text ??
                    m.api_commercial_deviation({}, t),
                },
                t,
              ),
            );
          if (num(p.qty) * (item.packSize || 1) > o.baseQty + 1e-9)
            return fail(
              400,
              m.api_commercial_offers_only(
                { supplier: o.supplier, qty: o.baseQty / (item.packSize || 1), unit: item.unit },
                t,
              ),
            );
        }
        const total = wanted.reduce((s, p) => s + num(p.qty), 0);
        if (total < item.qty)
          return fail(400, m.api_commercial_selected_of({ total, qty: item.qty, unit: item.unit }, t));
        const isBest =
          (wanted.length === 1 && wanted[0].offer === line.best) ||
          (wanted.length > 1 &&
            !!line.split &&
            line.split.parts.length === wanted.length &&
            line.split.parts.every((s) => wanted.some((w) => w.offer === s.offer && num(w.qty) === s.qty)));
        const reason = str(b.reason).trim();
        if (!isBest && !reason) return fail(400, m.api_commercial_give_reason_not_best({}, t));
        const was = { status: item.status ?? null, selection: item.selection ?? null };
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
        const made = parts.some((p, i) => p.offer !== wanted[i]!.offer);
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
              (parts.length > 1
                ? m.api_commercial_split_sourcing({ parts: line.split?.text ?? "" }, t)
                : m.api_commercial_best_fit_reason({}, t)),
            customerAccepted: accepted,
          },
        }));
        const names = wanted
          .map((p) => `${line.offers.find((o) => o.id === p.offer)?.supplier} × ${p.qty}`)
          .join(" + ");
        await logActivity(req, {
          case: ctx.c.id,
          text: m.api_commercial_selected_activity(
            { line: lineNo, names, hasReason: reason ? "yes" : "no", reason },
            t,
          ),
          entity: `cases/${ctx.c.id}`,
        });
        const fresh = await load(req, ctx.c.id);
        return Response.json({
          ...compare(fresh!),
          undo: made
            ? null
            : {
                path: `/commercial/cases/${encodeURIComponent(ctx.c.id)}/select-undo`,
                body: { lineNo, offers: parts.map((p) => p.offer), was },
              },
        });
      },
      { costs: true },
    ),
  },
  {
    path: "/commercial/cases/:id/select-undo",
    method: "post",
    handler: handle(
      async (req) => {
        const ctx = await load(req, caseParam(req));
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        const b = await body(req);
        const lineNo = num(b.lineNo);
        const item = ctx.items.find((i) => i.lineNo === lineNo);
        if (!item) return fail(404, m.api_commercial_line_not_found({ line: lineNo }, loc(req)));
        const t = ctx.o;
        const now = (item.selection?.offers ?? []).map((o) => str(idOf(o)));
        const then = (Array.isArray(b.offers) ? b.offers : []).map(str);
        if (!then.length || now.length !== then.length || now.some((o, i) => o !== then[i]))
          return fail(409, m.api_commercial_selected_again({ line: lineNo }, t));
        const quoted = (await all(req, "quotations", { case: { equals: ctx.c.id } })).find((q) =>
          ["Awaiting approval", "Approved", "Submitted"].includes(str(q.status)),
        );
        if (quoted)
          return fail(
            409,
            m.api_commercial_quoted_with_selection(
              {
                number: str(quoted.number),
                status: optionLabel(req, "quotations", "status", quoted.status).toLowerCase(),
              },
              t,
            ),
          );
        const was = (b.was && typeof b.was === "object" ? b.was : {}) as {
          status?: unknown;
          selection?: Selection | null;
        };
        const onLine = new Set(ctx.offers.filter((o) => num(o.lineNo) === lineNo).map((o) => o.id));
        const back = (was.selection?.offers ?? []).map((o) => str(idOf(o)));
        if (back.some((o) => !onLine.has(o))) return fail(400, m.api_commercial_not_a_selection({ line: lineNo }, t));
        const items = ctx.items.map((i) =>
          i.lineNo === lineNo
            ? {
                ...i,
                status: str(was.status) || "Ready to select",
                selection: was.selection ?? { offers: [], splitQty: [] },
              }
            : i,
        );
        await req.payload.update({
          collection: "cases" as never,
          id: ctx.c.id,
          data: { items } as never,
          req,
          depth: 0,
          overrideAccess: false,
        });
        await logActivity(req, {
          case: ctx.c.id,
          text: m.api_commercial_taken_back_activity(
            { line: lineNo, name: str(userOf(req)?.name), earlier: back.length ? "yes" : "no" },
            t,
          ),
          entity: `cases/${ctx.c.id}`,
        });
        const fresh = await load(req, ctx.c.id);
        return Response.json({ ...compare(fresh!), message: m.api_commercial_taken_back({ line: lineNo }, t) });
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        const b = await body(req);
        const lineNo = num(b.lineNo);
        const item = ctx.items.find((i) => i.lineNo === lineNo);
        if (!item) return fail(404, m.api_commercial_line_not_found({ line: lineNo }, loc(req)));
        const line = compareLine(ctx, item);
        if (!line.selection.parts.length) return fail(400, m.api_commercial_select_alternative_first({}, ctx.o));
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
          text: m.api_commercial_accepted_activity(
            { line: lineNo, hasNote: b.note ? "yes" : "no", note: str(b.note) },
            ctx.o,
          ),
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        const b = await body(req);
        const offer = ctx.offers.find((o) => o.id === str(b.offer));
        if (!offer) return fail(404, m.api_commercial_offer_not_found({}, ctx.o));
        const sup = ctx.suppliers.get(idOf(offer.supplier) ?? "");
        const corrected = ctx.offers.find((o) => idOf(o.supersedes) === offer.id);
        const draft = correctionDraft(ctx, offer);
        if (b.send && !corrected) {
          if (IS_MOCK) {
          } else {
            throw new NotConnectedError("sending the correction request email to the supplier (mailbox)");
          }
          await update(req, "offers", offer.id, { compliance: "Awaiting corrected offer" });
          await logActivity(req, {
            case: ctx.c.id,
            text: m.api_commercial_correction_sent_activity(
              { supplier: str(sup?.name), line: num(offer.lineNo), name: str(userOf(req)?.name) },
              ctx.o,
            ),
          });
          return Response.json({ ...draft, status: m.api_commercial_sent_awaiting_corrected({}, ctx.o), sent: true });
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
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
        if (!ctx) return fail(404, m.api_commercial_case_not_found({}, loc(req)));
        const b = await body(req);
        const P = await pricing(ctx);
        const t = ctx.o;
        if (!P.rows.length) return fail(400, m.api_commercial_select_offers_first({}, t));
        const quotes = (await all(req, "quotations", { case: { equals: ctx.c.id } })).sort(
          (a, b2) => num(b2.version) - num(a.version),
        );
        const latest = quotes[0];
        if (latest?.status === "Awaiting approval")
          return fail(400, m.api_commercial_already_awaiting({ number: str(latest.number) }, t));
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
            ? m.api_commercial_items_follow(
                { lines: P.unpriced.map((u) => u.lineNo).join(ctx.lang === "ar" ? "، " : ", ") },
                t,
              )
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
            paymentTerms: str(latest?.paymentTerms) || m.api_commercial_payment_terms_default({}, t),
            deliveryTerms:
              str(latest?.deliveryTerms) || m.api_commercial_delivery_terms_default({ port: str(ctx.c.port) }, t),
          });
          if (latest && latest.status !== "Superseded") await supersede(req, latest, q);
        }
        const out = await requestQuoteApproval(req, q, {
          type: P.approvalType,
          exceptions: P.exceptions,
          note: str(b.note),
        });
        await logActivity(req, {
          case: ctx.c.id,
          text: m.api_commercial_requested_activity({ name: str(userOf(req)?.name), number: str(q.number) }, t),
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
      return v ? Response.json(v) : fail(404, m.api_commercial_quotation_not_found({}, loc(req)));
    }),
  },
  {
    path: "/commercial/quotations/:id/:action",
    method: "post",
    handler: handle(async (req) => {
      const id = str(req.routeParams?.id);
      const action = str(req.routeParams?.action);
      const q = await one(req, "quotations", id);
      if (!q) return fail(404, m.api_commercial_quotation_not_found({}, loc(req)));
      const b = await body(req);
      const me = userOf(req);
      const t = loc(req);
      const caseId = str(idOf(q.case));
      if (action === "request-approval") {
        if (roleOf(req) === "sales" && /margin/i.test(str(b.type))) return fail(403, salesHidden(req));
        await requestQuoteApproval(req, q, { note: str(b.note) });
      } else if (action === "send") {
        if (q.status !== "Approved") return fail(400, m.api_commercial_only_approved_to_customer({}, t));
        const portal = b.method === "portal";
        if (!portal) {
          if (IS_MOCK) {
          } else {
            throw new NotConnectedError("emailing the approved quotation PDF to the customer (Odoo mail)");
          }
        }
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
          nextAction: m.api_commercial_follow_up_2_days({ number: str(q.number) }, t),
        });
        await logActivity(req, {
          case: caseId,
          text: portal
            ? m.api_commercial_portal_activity({ number: str(q.number), name: str(me?.name) }, t)
            : m.api_commercial_emailed_activity(
                { number: str(q.number), to: str(b.to) || m.api_commercial_the_customer({}, t), name: str(me?.name) },
                t,
              ),
        });
      } else if (action === "revise") {
        if (!["Approved", "Submitted", "Returned"].includes(str(q.status)))
          return fail(
            400,
            m.api_commercial_revise_latest(
              { number: str(q.number), status: optionLabel(req, "quotations", "status", q.status).toLowerCase() },
              t,
            ),
          );
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
          remarks: [str(q.remarks), b.reason ? m.api_commercial_revision_remark({ reason: str(b.reason) }, t) : ""]
            .filter(Boolean)
            .join("\n"),
        });
        await supersede(req, q, next);
        return Response.json({ id: next.id, view: await quoteView(req, next.id) });
      } else if (action === "decision") {
        const decision = str(b.decision);
        if (!DECISIONS.includes(decision)) return fail(400, m.api_commercial_unknown_decision({}, t));
        if (q.status !== "Submitted") return fail(400, m.api_commercial_decision_on_received({}, t));
        await update(req, "quotations", id, { decision });
        if (decision === "Revision requested")
          await update(req, "cases", caseId, {
            stage: "Revision requested",
            decision,
            wait: null,
            nextAction: m.api_commercial_revise_for_customer({ number: str(q.number) }, t),
          });
        else if (decision === "Lost" || decision === "Expired")
          await update(req, "cases", caseId, {
            decision,
            stage: decision,
            wait: null,
            tone: "neutral",
            ...(decision === "Lost" ? { lostReason: str(b.note) || m.api_commercial_not_given({}, t) } : {}),
            nextAction:
              decision === "Lost" ? m.api_commercial_closed_lost({}, t) : m.api_commercial_closed_expired({}, t),
          });
        else
          await update(req, "cases", caseId, {
            decision,
            stage: "Won — sales order confirmed",
            wait: null,
            tone: "ok",
            nextAction:
              decision === "Partially won"
                ? m.api_commercial_check_po_partial({}, t)
                : m.api_commercial_check_po({}, t),
          });
        await logActivity(req, {
          case: caseId,
          text: m.api_commercial_decision_activity(
            {
              number: str(q.number),
              decision: optionLabel(req, "quotations", "decision", decision),
              hasNote: b.note ? "yes" : "no",
              note: str(b.note),
            },
            t,
          ),
        });
      } else if (action === "portal-check") {
        const sub = (q.submission as Record<string, unknown> | undefined) ?? {};
        const rows = portalCheck(q, t);
        await update(req, "quotations", id, {
          submission: { ...sub, method: "Customer procurement portal", portalCheck: rows },
        });
        await logActivity(req, {
          case: caseId,
          kind: "auto",
          text: m.api_commercial_portal_check_activity({ number: str(q.number) }, t),
        });
        return Response.json({ rows, view: await quoteView(req, id) });
      } else return fail(404, m.api_commercial_unknown_action({}, t));
      return Response.json(await quoteView(req, id));
    }),
  },
  {
    path: "/commercial/approvals/:id/decide",
    method: "post",
    handler: handle(async (req) => {
      const b = await body(req);
      const decision = b.decision === "Reject" ? "Reject" : b.decision === "Approve" ? "Approve" : null;
      const t = loc(req);
      if (!decision) return fail(400, m.api_commercial_decision_must_be({}, t));
      const doc = await decide(req, str(req.routeParams?.id), decision, str(b.reason));
      const c = await readApproval(req, doc.id);
      const message =
        c.status === "Approved"
          ? m.api_commercial_approved_title({ title: str(c.title) }, t)
          : c.status === "Rejected"
            ? m.api_commercial_returned_title({ title: str(c.title) }, t)
            : m.api_commercial_approval_recorded({ progress: str(c.progress) }, t);
      return Response.json({ ...c, message, undo: await withdrawal(req, doc.id) });
    }),
  },
  {
    path: "/commercial/approvals/:id/withdraw",
    method: "post",
    handler: handle(async (req) => {
      const doc = await withdraw(req, str(req.routeParams?.id));
      const c = await readApproval(req, doc.id);
      return Response.json({ ...c, message: m.api_commercial_decision_withdrawn({ title: str(c.title) }, loc(req)) });
    }),
  },
];
