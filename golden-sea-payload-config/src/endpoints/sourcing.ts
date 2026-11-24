import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "saastemlycrm-design-system/contracts";
import { idOf, logActivity, scalar } from "../collections/shared.ts";
import { urgencyOf } from "../collections/sourcing.ts";
import { DEMO_NOW } from "./home.ts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import {
  HISTORY_CUSTOMERS,
  HISTORY_DEDUP,
  HISTORY_MAILBOXES,
  HISTORY_PER_YEAR,
  HISTORY_PRICES,
  HISTORY_SUPPLIERS,
  HISTORY_TOTALS,
  HISTORY_UNCERTAIN,
  HISTORY_VESSELS,
  SCENARIO_BY_ID,
  SCENARIOS,
  SIMULATED_FORWARD,
  SIMULATED_REPLY,
  SIMULATED_RFQ,
  type ExtractedField,
  type ExtractedLine,
  type Scenario,
} from "./sourcing-data.ts";
import * as link from "../links.ts";
import { m } from "../i18n/paraglide/messages.js";
import { type Lang, intlLocale, langOf, optionLabel } from "./insights-shared.ts";
import { sourcingInArabic } from "./sourcing-ar.ts";

/**
 * Root endpoints for the sourcing desk (registered in ./index.ts):
 *
 * - Inbox: `GET /inbox`, `GET /inbox/message?id=` (one message and its draft), `POST /inbox/simulate`,`POST /inbox/:id/extract` (AI stub),
 *   `POST /inbox/:id/match` (reply matching), `POST /inbox/:id/create-case`, `POST /inbox/:id/review`.
 * - Inbox history: `GET /inbox-history`, `POST /inbox-history/organise`,
 *   `POST /inbox-history/review/:id`, `POST /inbox-history/approve` (management only).
 * - Supplier RFQs of a case: `GET /sourcing/cases/:id`, `POST …/plan` (drafts the RFQs and keeps
 *   them as the case's `plan` on the GET), `POST …/plan/remove`, `POST …/plan/discard`,
 *   `POST …/send` (the kept plan, or the drafts given),
 *   `POST …/simulate-replies`, and `POST /sourcing/rfqs/:id/remind`; the tab's own
 *   `POST /case-rfqs/:id/simulate-replies` keeps what arrived (`arrivals` on the GET).
 *
 * AI steps are deterministic stubs (./sourcing-data.ts). Nothing is sent, priced or saved as
 * final without a person: extraction returns a draft; a person creates the case; uncertain
 * matches wait in a review queue; the history import waits for management's approval.
 */

type Req = PayloadRequest;
type Json = Record<string, unknown>;

/* ------------------------------------------------------------------ helpers */

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Below this, a match is never applied automatically (review queue). */
export const MATCH_THRESHOLD = 0.85;
/** Reminders go out 24 h and 48 h after sending; after the second, the case owner is alerted. */
export const REMINDER_HOURS = [24, 48];
export const ESCALATE_AFTER = 2;
/** The supplier-RFQ reference format (GS-SRFQ-0142-E). */
export const REF_RE = /GS-SRFQ-\d{4}-[A-Z]/i;

const OPEN_RFQ = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed"];
const ANSWERED_RFQ = ["Replied", "Revised offer received", "Declined"];

const iso = (t: number) => new Date(t).toISOString();

/** "Now" for the sourcing desk (ms): the demo's fixed clock. */
function now(): number {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return DEMO_NOW.getTime();
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("the sourcing desk's clock: the current time instead of the demo's fixed DEMO_NOW");
  }
}

/**
 * An email out of Golden Sea's mailbox (a customer's acknowledgement, a supplier RFQ, a reminder).
 * The mock sends nothing: what was sent is kept where it was written (the case's activity, the RFQ).
 */
function sendEmail(what: string): void {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(`outgoing email (Outlook/Gmail mailbox): send ${what}`);
  }
}

const role = (req: Req) => scalar((req.user as { role?: unknown } | null)?.role);
const userId = (req: Req) => idOf(req.user) ?? undefined;
const isSales = (req: Req) => role(req) === "sales";
const json = (body: unknown, status = 200) => Response.json(body, { status });
const fail = (status: number, message: string) => json({ errors: [{ message }] }, status);
const str = (v: unknown) => scalar(v);
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const list = <T = Json>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});

async function body(req: Req): Promise<Json> {
  try {
    return ((await req.json?.()) as Json) ?? {};
  } catch {
    return {};
  }
}

async function all(req: Req, collection: string, where?: Json, sort?: string, depth = 0): Promise<Doc[]> {
  const r = await req.payload.find({
    collection: collection as never,
    where: where as never,
    sort,
    depth,
    pagination: false,
    req,
  });
  return r.docs as unknown as Doc[];
}

async function byId(req: Req, collection: string, id: string, depth = 0): Promise<Doc | null> {
  return (await req.payload
    .findByID({ collection: collection as never, id, depth, req, disableErrors: true } as never)
    .catch(() => null)) as Doc | null;
}

async function create(req: Req, collection: string, data: Json): Promise<Doc> {
  return (await req.payload.create({ collection: collection as never, data: data as never, req })) as unknown as Doc;
}

async function update(req: Req, collection: string, id: string, data: Json): Promise<Doc> {
  return (await req.payload.update({
    collection: collection as never,
    id,
    data: data as never,
    req,
  })) as unknown as Doc;
}

/** An update with the collection's access rules applied to the signed-in user (what an Undo runs as). */
async function updateAsUser(req: Req, collection: string, id: string, data: Json): Promise<Doc> {
  return (await req.payload.update({
    collection: collection as never,
    id,
    data: data as never,
    req,
    overrideAccess: false,
  })) as unknown as Doc;
}

async function notify(
  req: Req,
  user: string | undefined,
  title: string,
  detail: string,
  href: string,
  kind = "Update",
) {
  if (!user) return;
  await create(req, "notifications", { user, title, detail, href, kind, at: iso(now()) }).catch(() => undefined);
}

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", timeZone: "UTC" };
const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};
const DATE = {
  en: new Intl.DateTimeFormat(intlLocale("en"), DATE_OPTIONS),
  ar: new Intl.DateTimeFormat(intlLocale("ar"), DATE_OPTIONS),
};
const DATETIME = {
  en: new Intl.DateTimeFormat(intlLocale("en"), DATETIME_OPTIONS),
  ar: new Intl.DateTimeFormat(intlLocale("ar"), DATETIME_OPTIONS),
};
const fmtDate = (v: unknown, lang: Lang = "en") => (str(v) ? DATE[lang].format(new Date(str(v))) : "");
const fmtDateTime = (v: unknown, lang: Lang = "en") => (str(v) ? DATETIME[lang].format(new Date(str(v))) : "");
/** The request's language, as Paraglide's options. */
const loc = (req: Req) => ({ locale: langOf(req) });
/** Canned AI text (./sourcing-data.ts) in a language. */
const canned = <T>(value: T, lang: Lang): T => (lang === "ar" ? sourcingInArabic(value) : value);

async function userName(req: Req, id: unknown): Promise<string> {
  const uid = idOf(id);
  if (!uid) return "";
  const u = await byId(req, "users", uid);
  return str(u?.name) || uid;
}

/** "Now" in the demo's timeline, nudged forward so new records sort after the seeded ones. */
async function demoNow(req: Req, offsetMinutes = 0) {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    const { totalDocs } = await req.payload.count({
      collection: "intake-messages" as never,
      where: { messageId: { like: "sim-" } } as never,
      req,
    });
    return DEMO_NOW.getTime() + (25 + totalDocs * 3 + offsetMinutes) * 60_000;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the time a new message arrives: the current time instead of the demo's clock nudged by the simulated messages",
    );
  }
}

/* ------------------------------------------------------------------ supplier knowledge */

/** Reply recognition by sender domain (suppliers without `emailDomain` in the seed). */
const KNOWN_DOMAINS: Record<string, string> = {
  S1: "delta-marine.example",
  S2: "suez-industrial.example",
  S3: "psweld.example",
  S4: "nile-safety.example",
  S5: "horizon-trading.example",
};
function domainOf(s: Doc): string {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return str(s.emailDomain) || KNOWN_DOMAINS[s.id] || "";
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "a supplier's email domain: every supplier's `emailDomain` on its record instead of the fixed KNOWN_DOMAINS list",
    );
  }
}
const senderDomain = (from: unknown) => str(from).split("@")[1]?.toLowerCase() ?? "";

/** The supplier category a requested line is sourced in (what suppliers are asked for). */
export function lineCategory(item: { description?: unknown; store?: unknown }): string {
  const d = str(item.description).toLowerCase();
  const store = str(item.store);
  if (/weld|electrode/.test(d)) return "Welding";
  if (/loctite|threadlock|adhesive|sealant/.test(d)) return "Adhesives";
  if (/\b(oil|lubricant|lubricating|grease|hydraulic)\b/.test(d)) return "Lubricants";
  if (/paint|primer|thinner/.test(d)) return "Paints";
  if (store === "Safety stores" || /helmet|coverall|glove|life ?jacket|lifebuoy|boots|goggle/.test(d))
    return "Safety & PPE";
  if (/spray|cleaner|degreaser|detergent|remover|chemical/.test(d)) return "Chemicals";
  if (/rope|mooring|shackle|padlock|brush|rag/.test(d) || store === "Deck stores") return "Deck stores";
  if (store === "Provision stores") return "Provision stores";
  if (store === "Cabin stores") return "Cabin stores";
  if (store === "Electrical stores") return "Electrical stores";
  return "Engine spares";
}

/** The general chandlers: they quote anything, so they get the full list. */
const isGeneral = (s: Doc) => list<string>(s.categories).includes("Deck & engine stores");
const canQuote = (s: Doc) =>
  (str(s.kind) || "local") === "local" && !["Blocked"].includes(str(s.status)) && list(s.categories).length > 0;

function suppliersFor(category: string, suppliers: Doc[]): Doc[] {
  const specialists = suppliers.filter((s) => canQuote(s) && list<string>(s.categories).includes(category));
  const ranked = specialists.sort((a, b) => num(b.onTime) - num(a.onTime));
  return ranked.length ? ranked.slice(0, 3) : suppliers.filter((s) => canQuote(s) && isGeneral(s)).slice(0, 2);
}

/** Indicative price per requested unit (EGP), by category — the stub "reads" offers around it. */
const BASE_PRICE: Record<string, number> = {
  Adhesives: 2_350,
  Chemicals: 520,
  Welding: 980,
  Lubricants: 95,
  Paints: 5_900,
  "Deck stores": 3_600,
  "Safety & PPE": 450,
  "Cabin stores": 180,
  "Electrical stores": 140,
  "Provision stores": 260,
  "Engine spares": 1_200,
};
function basePrice(item: Json): number {
  const d = str(item.description).toLowerCase();
  if (/coverall/.test(d)) return 1_900;
  if (/life ?jacket/.test(d)) return 1_650;
  if (/lifebuoy/.test(d)) return 2_400;
  if (/padlock/.test(d)) return 240;
  if (/brush/.test(d)) return 85;
  return BASE_PRICE[lineCategory(item)] ?? 300;
}
const factor = (supplierId: string, lineNo: number) => {
  const key = `${supplierId}:${lineNo}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h += key.charCodeAt(i);
  return 0.9 + (h % 23) / 100;
};

interface OfferLine {
  lineNo: number;
  price: number;
  currency: string;
  packs: number;
  packSize: number;
  packLabel: string;
  leadDays: number;
  validDays: number;
  offeredDescription: string;
  uncertain?: string;
  confidence: number;
}

/** The offer a supplier's reply "contains" for the lines it was asked (deterministic). */
function offerFor(supplierId: string, item: Json, special?: Partial<OfferLine>): OfferLine {
  const lineNo = num(item.lineNo);
  const qty = num(item.qty) || 1;
  const packSize = num(item.packSize) || 1;
  return {
    lineNo,
    price: Math.round(basePrice(item) * factor(supplierId, lineNo)),
    currency: "EGP",
    packs: qty,
    packSize,
    packLabel: packSize === 1 ? str(item.unit) || "EA" : `${str(item.unit)} of ${packSize}`,
    leadDays: 2 + (lineNo % 3),
    validDays: 7,
    offeredDescription: str(item.description),
    confidence: 0.94,
    ...special,
  };
}

/* ------------------------------------------------------------------ reply matching */

export interface MatchCandidate {
  case: string;
  caseId: string;
  confidence: number;
  reason: string;
}
export interface MatchResult {
  outcome: "linked" | "duplicate" | "review" | "none";
  case?: string;
  caseId?: string;
  supplierRfq?: string;
  supplier?: string;
  reference?: string;
  confidence: number;
  basis: string[];
  candidates?: MatchCandidate[];
  /** The supplier isn't in the database yet. */
  newSupplier?: boolean;
}

async function caseIdOf(req: Req, id: unknown) {
  const cid = idOf(id);
  if (!cid) return "";
  return str((await byId(req, "cases", cid))?.caseId) || cid;
}

/** How likely the `i`-th case a known sender was asked on is the one its reply is about. */
function candidateConfidence(i: number): number {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return Math.max(0.3, 0.62 - i * 0.21);
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "a candidate case's match confidence: scored from the reply (lines, dates, open RFQs) instead of fixed by its rank",
    );
  }
}

/**
 * Matches an incoming message to a case: supplier-RFQ reference anywhere in the subject or body
 * (subjects change all the time), identical attachments or customer reference (duplicates),
 * then the sender's domain (uncertain → review queue). Never guesses below the threshold.
 */
export async function matchMessage(req: Req, msg: Doc): Promise<MatchResult> {
  const t = loc(req);
  const subject = str(msg.subject);
  const text = `${subject}\n${str(msg.body)}`;
  const suppliers = await all(req, "suppliers");
  const domain = senderDomain(msg.from);
  const sender = suppliers.find((s) => domainOf(s) && domainOf(s) === domain);

  const ref = REF_RE.exec(text)?.[0]?.toUpperCase();
  if (ref) {
    const [rfq] = await all(req, "supplier-rfqs", { reference: { equals: ref } });
    if (rfq) {
      const caseId = await caseIdOf(req, rfq.case);
      const invited = idOf(rfq.supplier);
      const basis = [
        (REF_RE.test(subject) ? m.api_sourcing_ref_in_subject : m.api_sourcing_ref_in_body)({ ref }, t),
        REF_RE.test(subject) ? m.api_sourcing_subject_kept({}, t) : m.api_sourcing_subject_changed({ subject }, t),
      ];
      if (sender && sender.id === invited)
        basis.push(m.api_sourcing_sender_domain({ domain, name: str(sender.name) }, t));
      else if (sender) basis.push(m.api_sourcing_sent_by_other({ name: str(sender.name) }, t));
      else basis.push(m.api_sourcing_sender_unknown({ sender: domain || str(msg.from) }, t));
      return {
        outcome: "linked",
        case: idOf(rfq.case),
        caseId,
        supplierRfq: rfq.id,
        supplier: sender?.id,
        reference: ref,
        confidence: sender ? 0.99 : 0.93,
        basis,
        newSupplier: !sender,
      };
    }
  }

  // Duplicates: the same files (hash) or the same customer reference as a message already handled.
  const hash = str(msg.attachmentHash);
  if (hash) {
    const twins = (await all(req, "intake-messages", { attachmentHash: { equals: hash } }, "receivedAt")).filter(
      (m) => m.id !== msg.id && str(m.receivedAt) <= str(msg.receivedAt),
    );
    const first = twins[0];
    if (first) {
      const linkedCase = idOf(first.createdCase) ?? idOf(obj(first.match).case);
      const caseId = linkedCase ? await caseIdOf(req, linkedCase) : "";
      return {
        outcome: "duplicate",
        case: linkedCase,
        caseId,
        confidence: 1,
        basis: [
          m.api_sourcing_identical_attachments(
            { hash: hash.slice(0, 14), subject: str(first.subject), at: fmtDateTime(first.receivedAt, t.locale) },
            t,
          ),
          linkedCase ? m.api_sourcing_already_linked_no_new({ caseId }, t) : m.api_sourcing_original_not_case({}, t),
        ],
      };
    }
  }
  const customerRef = /\b[A-Z]{2,4}-REQ-\d{3,}\b/.exec(text)?.[0];
  if (customerRef) {
    const [c] = await all(req, "cases", { customerRef: { equals: customerRef } });
    if (c)
      return {
        outcome: "duplicate",
        case: c.id,
        caseId: str(c.caseId),
        confidence: 0.98,
        basis: [
          m.api_sourcing_customer_ref_is({ ref: customerRef, caseId: str(c.caseId) }, t),
          m.api_sourcing_no_new_case({}, t),
        ],
      };
  }

  // Known sender, no reference: candidates from the cases it was asked on — a person decides.
  if (sender) {
    const rfqs = await all(req, "supplier-rfqs", { supplier: { equals: sender.id } }, "-sentAt");
    const byCase = new Map<string, Doc>();
    for (const r of rfqs) if (!byCase.has(str(idOf(r.case)))) byCase.set(str(idOf(r.case)), r);
    const candidates: MatchCandidate[] = [];
    let i = 0;
    for (const [cid, r] of byCase) {
      candidates.push({
        case: cid,
        caseId: await caseIdOf(req, cid),
        confidence: candidateConfidence(i),
        reason: m.api_sourcing_was_asked_on(
          {
            name: str(sender.name),
            reference: str(r.reference),
            status: optionLabel(req, "supplier-rfqs", "status", r.status).toLowerCase(),
          },
          t,
        ),
      });
      i++;
    }
    return {
      outcome: "review",
      supplier: sender.id,
      confidence: candidates[0]?.confidence ?? 0.4,
      basis: [
        m.api_sourcing_no_reference({}, t),
        m.api_sourcing_sender_domain({ domain, name: str(sender.name) }, t),
        candidates.length > 1
          ? m.api_sourcing_invited_on_many({ count: candidates.length }, t)
          : m.api_sourcing_below_threshold({}, t),
      ],
      candidates,
    };
  }
  return {
    outcome: "none",
    confidence: 0,
    basis: [m.api_sourcing_unclassifiable({}, t)],
  };
}

/** Offers from a matched reply: created once per RFQ line (the Compare tab reads them). */
async function saveOffers(req: Req, rfq: Doc, supplierId: string, lines: OfferLine[]) {
  const existing = await all(req, "offers", {
    and: [{ supplierRfq: { equals: rfq.id } }, { supplier: { equals: supplierId } }],
  });
  const c = await byId(req, "cases", str(idOf(rfq.case)));
  const items = list<Json>(c?.items);
  const created: Doc[] = [];
  for (const l of lines) {
    if (existing.some((o) => num(o.lineNo) === l.lineNo)) continue;
    const item = items.find((i) => num(i.lineNo) === l.lineNo) ?? {};
    created.push(
      await create(req, "offers", {
        case: idOf(rfq.case),
        lineNo: l.lineNo,
        supplierRfq: rfq.id,
        supplier: supplierId,
        product: idOf(item.product),
        version: 1,
        offeredDescription: l.offeredDescription,
        price: l.price,
        currency: l.currency,
        packs: l.packs,
        packSize: l.packSize,
        packLabel: l.packLabel,
        leadDays: l.leadDays,
        validUntil: iso(now() + l.validDays * DAY),
        paymentTerms: m.api_sourcing_cash_terms({}, loc(req)),
        deliveryBasis: "Delivered to port",
        source: "Email",
        compliance: "Pending",
        deviations: l.uncertain ? [{ type: "Unit", severity: "Warning", detail: l.uncertain, detectedBy: "AI" }] : [],
        enteredBy: userId(req),
      }),
    );
  }
  if (created.length)
    await logActivity(req, {
      case: idOf(rfq.case),
      kind: "auto",
      text: m.api_sourcing_offers_captured({ count: created.length, reference: str(rfq.reference) }, loc(req)),
    });
  return created;
}

/** The offer lines a reply to `rfq` contains (deterministic stub of the offer reader). */
async function replyLines(req: Req, rfq: Doc, supplierId: string): Promise<OfferLine[]> {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    const c = await byId(req, "cases", str(idOf(rfq.case)));
    const items = list<Json>(c?.items).filter((i) => list<number>(rfq.lineNos).includes(num(i.lineNo)));
    return items.map((item) =>
      supplierId === "S3" && /E6013/i.test(str(item.description))
        ? offerFor(supplierId, item, { price: 980, leadDays: 3, validDays: 7, packLabel: "Box 5 kg" })
        : offerFor(supplierId, item),
    );
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      `AI model (offer reader): read the offer lines (price, pack, lead time, validity) from the reply to ${str(rfq.reference)}`,
    );
  }
}

/* ------------------------------------------------------------------ inbox: extraction */

const UNIT_MAP: Record<string, string> = { coil: "roll", sheet: "pcs", box: "pack", ltr: "L", litre: "L" };
const caseUnit = (u: string) => UNIT_MAP[u.toLowerCase()] ?? u;

/** What the extraction model reads from a message and its attachments (the demo's canned scenarios). */
function scenarioOf(msg: Doc): Scenario | undefined {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return SCENARIOS[str(msg.scenario) || SCENARIO_BY_ID[msg.id] || ""];
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "AI model (extraction): read the message and its attachments into header values, lines, missing items and a clarification",
    );
  }
}

/** Who a new case goes to and by when, and the rule that says so. */
function draftAssignment(req: Req, draft: Scenario["draft"] | undefined) {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return {
      owner: draft?.owner ?? userId(req) ?? "ky",
      backup: draft?.backup ?? "ky",
      deadline: draft?.deadline ?? iso(now() + DAY),
      rule: draft?.rule,
    };
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "a new case's owner, backup and quote deadline: from the assignment rules instead of the canned scenario's draft and the fixed user ky",
    );
  }
}

function fill(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? "");
}

export interface ExtractionResult {
  kind: "extraction";
  header: ExtractedField[];
  lines: ExtractedLine[];
  missing: string[];
  clarification: string;
  notes: string[];
  assignment: { owner: string; ownerName: string; backup: string; backupName: string; deadline: string; rule: string };
  acknowledgement: { subject: string; body: string; manual: boolean; template: string };
  caseType: "rfq" | "service";
  customerName: string;
  newCustomer: boolean;
  model: string;
}

async function extraction(req: Req, msg: Doc): Promise<ExtractionResult> {
  const t = loc(req);
  const lang = t.locale;
  const s = scenarioOf(msg);
  const draft = s?.draft;
  const { owner, backup, deadline, rule } = draftAssignment(req, draft);
  const ownerName = await userName(req, owner);
  const backupName = await userName(req, backup);
  const customer = draft?.customer ? await byId(req, "customers", draft.customer) : null;
  const customerName = str(customer?.name) || draft?.newCustomer?.name || str(msg.fromName) || str(msg.from);
  const templates = list<Json>(
    obj(await req.payload.findGlobal({ slug: "message-templates" as never, req })).templates,
  );
  const tpl = templates.find((t) => t.key === "rfq-ack");
  const vars = {
    contact: str(msg.fromName).split(/[·(]/)[0].trim() || m.api_sourcing_sir_madam({}, t),
    vessel: draft?.vessel ?? m.api_sourcing_your_vessel({}, t),
    caseId: m.api_sourcing_case_number_on_creation({}, t),
    dueAt: fmtDateTime(deadline, lang),
    customerRef:
      draft?.customerRef ??
      m.api_sourcing_for_vessel({ vessel: draft?.vessel ?? m.api_sourcing_your_vessel({}, t) }, t),
    owner: ownerName,
  };
  // The acknowledgement in the request's language: the approved template's Arabic when there is one.
  const tplBody = lang === "ar" ? str(tpl?.bodyAr) || str(tpl?.body) : str(tpl?.body);
  const tplSubject = lang === "ar" ? str(tpl?.subjectAr) || str(tpl?.subject) : str(tpl?.subject);
  const ackBody = `${fill(tplBody || m.api_sourcing_ack_default_body({}, t), vars)}\n\n${m.api_sourcing_ack_footer({ owner: ownerName, backup: backupName }, t)}`;
  return {
    kind: "extraction",
    header: canned(
      s?.header ?? [
        { field: "Customer", value: customerName, confidence: 0.5 },
        { field: "Subject", value: str(msg.subject), confidence: 0.9 },
      ],
      lang,
    ),
    lines: (s?.lines ?? []).map((l) => (l.flag ? { ...l, flag: canned(l.flag, lang) } : l)),
    missing: canned(s?.missing ?? ["No lines found — add them by hand"], lang),
    // The customer's clarification goes out in English, as the customer writes (international ship managers).
    clarification: fill(s?.clarification ?? "", { ...vars, caseId: "your case" }),
    notes: canned(s?.notes ?? [], lang),
    assignment: {
      owner,
      ownerName,
      backup,
      backupName,
      deadline,
      rule: rule ? canned(rule, lang) : m.api_sourcing_no_rule({}, t),
    },
    acknowledgement: {
      subject: fill(tplSubject || m.api_sourcing_ack_default_subject({}, t), vars),
      body: ackBody,
      manual: Boolean(s?.manualAck) || str(msg.channel) !== "Email",
      template: m.api_sourcing_template_label(
        { name: str(tpl?.name) || "RFQ received – marine", version: num(tpl?.version) || 1 },
        t,
      ),
    },
    caseType: draft?.caseType ?? "rfq",
    customerName,
    newCustomer: !customer && Boolean(draft?.newCustomer),
    model: m.api_sourcing_model({}, t),
  };
}

async function saveExtraction(req: Req, msg: Doc, x: ExtractionResult) {
  await update(req, "intake-messages", msg.id, {
    extraction: {
      header: x.header,
      lines: x.lines.map((l) => ({
        description: l.description,
        brand: l.brand,
        partNo: l.partNo,
        impa: l.impa,
        issa: l.issa,
        qty: String(l.qty),
        unit: l.unit,
        brandRule: l.brandRule,
        confidence: l.confidence,
        store: l.store,
        source: l.source,
        flag: l.flag,
        originalText: l.originalText,
      })),
      missing: x.missing.map((item) => ({ item })),
      clarification: x.clarification,
      assignment: {
        owner: x.assignment.owner,
        backup: x.assignment.backup,
        deadline: x.assignment.deadline,
        rule: x.assignment.rule,
      },
      acknowledgement: {
        subject: x.acknowledgement.subject,
        body: x.acknowledgement.body,
        manual: x.acknowledgement.manual,
      },
      model: x.model,
      extractedAt: iso(now()),
    },
  });
}

/** Applies a match result to the message (and, for supplier replies, to the RFQ and offers). */
async function applyMatch(req: Req, msg: Doc, match: MatchResult) {
  const status =
    match.outcome === "linked" || (match.outcome === "duplicate" && match.case) ? "Linked" : "Needs review";
  let classification = str(msg.classification) || "Supplier reply";
  if (match.outcome === "duplicate") classification = "Duplicate";
  await update(req, "intake-messages", msg.id, {
    status,
    classification,
    match: {
      case: match.case ?? null,
      supplierRfq: match.supplierRfq ?? null,
      reference: match.reference,
      confidence: match.confidence,
      basis: match.basis.join("\n"),
      candidates: (match.candidates ?? []).map((c) => ({ case: c.case, confidence: c.confidence, reason: c.reason })),
    },
  });
  if (match.outcome === "linked" && match.supplierRfq && match.supplier && !match.newSupplier) {
    const rfq = await byId(req, "supplier-rfqs", match.supplierRfq);
    if (rfq && idOf(rfq.supplier) === match.supplier && !ANSWERED_RFQ.includes(str(rfq.status))) {
      const lines = await replyLines(req, rfq, match.supplier);
      await update(req, "intake-messages", msg.id, { offerDraft: lines });
      await saveOffers(req, rfq, match.supplier, lines);
      await update(req, "supplier-rfqs", rfq.id, {
        status: "Replied",
        lastEvent: m.api_sourcing_reply_matched_event({ subject: str(msg.subject) }, loc(req)),
      });
    }
  }
}

/* ------------------------------------------------------------------ inbox: case creation */

async function createCaseFrom(req: Req, msg: Doc, input: Json) {
  const t = loc(req);
  const lang = t.locale;
  let s: Scenario | undefined;
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    s = scenarioOf(msg);
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "creating a case: from the message's saved extraction and the person's edits instead of the canned scenario read again",
    );
  }
  if (!s) throw Object.assign(new Error(m.api_sourcing_nothing_extracted({}, t)), { status: 400 });
  const d = s.draft;
  let customer = d.customer;
  if (!customer && d.newCustomer) {
    const [found] = await all(req, "customers", { name: { equals: d.newCustomer.name } });
    customer =
      found?.id ??
      (
        await create(req, "customers", {
          name: d.newCustomer.name,
          type: d.newCustomer.type,
          segment: d.newCustomer.segment,
          country: d.newCustomer.country,
          contactEmail: d.newCustomer.contactEmail,
          accountOwner: d.owner,
        })
      ).id;
  }
  const owner = str(input.owner) || d.owner;
  const backup = str(input.backup) || d.backup;
  const deadline = str(input.deadline) || d.deadline;
  const flagged = s.lines.filter((l) => l.flag);
  const items = s.lines.map((l) => ({
    lineNo: l.lineNo,
    description: l.description,
    product: l.product,
    brand: l.brand,
    exactBrand: l.brandRule === "Exact brand",
    partNo: l.partNo,
    impa: l.impa,
    issa: l.issa,
    qty: l.qty,
    unit: caseUnit(l.unit),
    packSize: 1,
    store: l.store,
    status: l.flag ? "Clarification needed" : "Not sourced",
    confidence: l.confidence,
    missing: l.flag ? canned(l.flag, lang) : l.flag,
    originalText: m.api_sourcing_original_text({ text: l.originalText, source: l.source }, t),
  }));
  const data: Json = {
    caseType: d.caseType,
    customer,
    customerRef: d.customerRef,
    vessel: d.vessel,
    vesselRecord: d.vesselRecord,
    port: d.port,
    eta: d.eta,
    deadline,
    currency: d.currency,
    owner,
    backup,
    urgent: Boolean(d.urgent),
    nextAction: canned(d.nextAction, lang),
    blocker: flagged.length
      ? m.api_sourcing_blocker(
          {
            lines: flagged.map((l) => l.lineNo).join(lang === "ar" ? "، " : ", "),
            flag: canned(flagged[0].flag!, lang),
          },
          t,
        )
      : undefined,
    stage: d.caseType === "service" ? "Customs clearance" : flagged.length ? "Validating" : "Sourcing",
    tone: d.urgent ? "warn" : "info",
    items,
    clarifications: flagged.length
      ? [
          {
            lineNo: flagged[0].lineNo,
            to: "Customer",
            via: str(msg.channel) === "WhatsApp" ? "WhatsApp" : "Email",
            question: canned(s.missing, lang).join(" · "),
          },
        ]
      : [],
    lines: { ready: 0, waiting: 0, blocked: flagged.length, noOffer: items.length - flagged.length },
    sourceMessage: msg.id,
    service: d.service
      ? {
          awb: d.service.awb,
          carrier: d.service.carrier,
          arrival: d.service.arrival,
          customsStatus: "Documents pending",
          consolidateWith: d.service.consolidateWith,
        }
      : undefined,
  };
  const c = await create(req, "cases", data);
  const x = await extraction(req, msg);
  const manual = x.acknowledgement.manual;
  const firstAck = !msg.acknowledgedAt && !manual;
  if (firstAck) sendEmail(`the acknowledgement "${x.acknowledgement.subject}" to ${str(msg.from)}`);
  await update(req, "intake-messages", msg.id, {
    status: "Case created",
    createdCase: c.id,
    classification: d.caseType === "service" ? "Service request" : "New RFQ",
    ...(firstAck ? { acknowledgedAt: iso(now()) } : {}),
  });
  const who = str((req.user as { name?: unknown } | null)?.name) || m.api_sourcing_a_person({}, t);
  await logActivity(req, {
    case: c.id,
    kind: "human",
    text: m.api_sourcing_created_activity(
      {
        channel: optionLabel(req, "intake-messages", "channel", msg.channel).toLowerCase(),
        subject: str(msg.subject),
        count: items.length,
        who,
      },
      t,
    ),
  });
  await logActivity(req, {
    case: c.id,
    kind: "auto",
    text: firstAck
      ? m.api_sourcing_ack_sent_activity({ template: x.acknowledgement.template }, t)
      : manual
        ? m.api_sourcing_ack_by_hand_activity({}, t)
        : m.api_sourcing_ack_already_activity({}, t),
  });
  if (owner !== userId(req))
    await notify(
      req,
      owner,
      m.api_sourcing_new_case_assigned({ caseId: str(c.caseId) }, t),
      m.api_sourcing_new_case_detail(
        { customer: x.customerName, vessel: d.vessel, due: fmtDateTime(deadline, lang) },
        t,
      ),
      link.doc("cases", c.id),
      "Update",
    );
  return {
    case: { id: c.id, caseId: str(c.caseId) },
    acknowledged: firstAck,
    manualAck: manual,
    message: m.api_sourcing_case_created(
      { caseId: str(c.caseId), ack: firstAck ? "sent" : manual ? "manual" : "already" },
      t,
    ),
  };
}

/* ------------------------------------------------------------------ inbox: list */

export interface InboxMessage {
  id: string;
  channel: string;
  mailbox: string;
  /** Where it came from, as the inbox says it (the message's own `via`). */
  via: string;
  receivedAt: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  files: { name: string; kind: string; note: string }[];
  classification: string;
  status: string;
  messageId: string;
  createdCase?: { id: string; caseId: string };
  /**
   * Its match, once tried: the case and who reviewed it. Why it matched and the candidate cases are
   * the message's own fields (`match.basis`, `candidates`), read with no code.
   */
  match?: {
    case?: { id: string; caseId: string };
    reviewedBy: string;
  };
  acknowledgedAt: string;
  /** How urgent it reads (1–5): the message's own `urgency`. */
  urgency: number;
}

async function toInboxMessage(req: Req, m: Doc): Promise<InboxMessage> {
  const match = obj(m.match);
  const created = idOf(m.createdCase);
  const matchCase = idOf(match.case);
  return {
    id: m.id,
    channel: str(m.channel),
    mailbox: str(m.mailbox),
    via: str(m.via),
    receivedAt: str(m.receivedAt),
    from: str(m.from),
    fromName: str(m.fromName),
    subject: str(m.subject),
    body: str(m.body),
    files: list<Json>(m.files).map((f) => ({ name: str(f.name), kind: str(f.kind), note: str(f.note) })),
    classification: str(m.classification),
    status: str(m.status),
    messageId: str(m.messageId),
    createdCase: created ? { id: created, caseId: await caseIdOf(req, created) } : undefined,
    match:
      Object.keys(match).length && (matchCase || match.basis)
        ? {
            case: matchCase ? { id: matchCase, caseId: await caseIdOf(req, matchCase) } : undefined,
            reviewedBy: await userName(req, match.reviewedBy),
          }
        : undefined,
    acknowledgedAt: str(m.acknowledgedAt),
    urgency: num(m.urgency) || urgencyOf(m),
  };
}

/** The inbox's channels and today's figures (its messages are the intake-messages collection's). */
export interface InboxPayload {
  connections: { kind: string; account: string; status: string }[];
  stats: { processedToday: number; duplicates: number; review: number; newCount: number };
}

/* ------------------------------------------------------------------ inbox history */

/**
 * The mailboxes' history as the import scanned it (Outlook, Gmail, WhatsApp exports) and as the AI
 * organised it: counts, de-duplication, customers, vessels, suppliers, dated prices and the
 * uncertain items (./sourcing-data.ts).
 */
function scannedHistory() {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return {
      mailboxes: HISTORY_MAILBOXES,
      perYear: HISTORY_PER_YEAR,
      dedup: HISTORY_DEDUP,
      totals: HISTORY_TOTALS,
      customers: HISTORY_CUSTOMERS,
      vessels: HISTORY_VESSELS,
      suppliers: HISTORY_SUPPLIERS,
      prices: HISTORY_PRICES,
      uncertain: HISTORY_UNCERTAIN,
    };
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "mailbox import (Outlook/Gmail, WhatsApp exports) and the AI model: scan the mailboxes' history and organise it into customers, vessels, suppliers and prices",
    );
  }
}

async function historyMessages(req: Req) {
  return all(req, "intake-messages", { source: { equals: "History import" } }, "receivedAt");
}

export interface HistoryReviewItem {
  id: string;
  key: string;
  kind: string;
  question: string;
  proposal: string;
  confidence: number;
  mailbox: string;
  receivedAt: string;
  subject: string;
  fromName: string;
  decision: string;
  reviewedBy: string;
}

export interface HistoryPayload {
  status: string;
  approved: boolean;
  approvedBy: string;
  organised: boolean;
  canApprove: boolean;
  canSeePrices: boolean;
  mailboxes: typeof HISTORY_MAILBOXES;
  perYear: typeof HISTORY_PER_YEAR;
  scanned: number;
  dedup: typeof HISTORY_DEDUP;
  kept: number;
  totals: typeof HISTORY_TOTALS;
  customers: typeof HISTORY_CUSTOMERS;
  vessels: typeof HISTORY_VESSELS;
  suppliers: typeof HISTORY_SUPPLIERS;
  prices: (Omit<(typeof HISTORY_PRICES)[number], "price"> & { price?: number })[];
  review: HistoryReviewItem[];
  pending: number;
  created: { kind: string; name: string; href: string }[];
}

export async function historyPayload(req: Req): Promise<HistoryPayload> {
  const scan = scannedHistory();
  const integrations = obj(await req.payload.findGlobal({ slug: "integrations" as never, req }));
  const imp = obj(integrations.emailImport);
  const status = str(imp.status) || "Dry run ready";
  const approved = ["Approved", "Running", "Done"].includes(status) && Boolean(idOf(imp.approvedBy));
  const msgs = await historyMessages(req);
  const review: HistoryReviewItem[] = [];
  for (const m of msgs) {
    const h = obj(m.history);
    review.push({
      id: m.id,
      key: str(m.messageId).replace(/^history-/, ""),
      kind: str(h.kind),
      question: str(h.question),
      proposal: str(h.proposal),
      confidence: num(h.confidence),
      mailbox: str(m.mailbox),
      receivedAt: str(m.receivedAt),
      subject: str(m.subject),
      fromName: str(m.fromName),
      decision: str(h.decision),
      reviewedBy: await userName(req, obj(m.match).reviewedBy),
    });
  }
  const scanned = scan.mailboxes.reduce((n, m) => n + m.emails, 0);
  const kept = scanned - scan.dedup.reduce((n, d) => n + d.count, 0);
  const created: HistoryPayload["created"] = [];
  if (approved) {
    for (const s of scan.suppliers.filter((x) => !x.known)) {
      const [doc] = await all(req, "suppliers", { name: { equals: s.name } });
      if (doc) created.push({ kind: "Supplier", name: s.name, href: link.doc("suppliers", doc.id) });
    }
    let newCustomers: string[];
    if (IS_TEMP_MOCK) {
      // TODO replace temporary mock logic with proper polished logic
      newCustomers = [...scan.customers.filter((x) => !x.known).map((x) => x.name), "Petro Delta"];
    } else {
      // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
      throw new TempMockError(
        "the customers the history import created: read from the import's own records instead of the fixed Petro Delta",
      );
    }
    for (const c of newCustomers) {
      const [doc] = await all(req, "customers", { name: { equals: c } });
      if (doc) created.push({ kind: "Customer", name: c, href: link.doc("customers", doc.id) });
    }
    for (const v of scan.vessels.filter((x) => !x.known)) {
      const [doc] = await all(req, "vessels", { imo: { equals: v.imo } });
      if (doc) created.push({ kind: "Vessel", name: `${v.name} (IMO ${v.imo})`, href: link.doc("vessels", doc.id) });
    }
  }
  return {
    status,
    approved,
    approvedBy: await userName(req, imp.approvedBy),
    organised: msgs.length > 0,
    canApprove: role(req) === "management",
    canSeePrices: !isSales(req),
    mailboxes: canned(scan.mailboxes, langOf(req)),
    perYear: scan.perYear,
    scanned,
    dedup: canned(scan.dedup, langOf(req)),
    kept,
    totals: scan.totals,
    customers: scan.customers,
    vessels: scan.vessels,
    suppliers: scan.suppliers,
    prices: scan.prices.map((p) => (isSales(req) ? { ...p, price: undefined } : p)),
    review,
    pending: review.filter((r) => !r.decision).length,
    created,
  };
}

async function supplierByName(req: Req, name: string) {
  const [doc] = await all(req, "suppliers", { name: { equals: name } });
  return doc;
}

/** Approval commits the import: new customers, vessels, suppliers and dated prices become records. */
async function commitHistory(req: Req) {
  const scan = scannedHistory();
  const decisions = new Map(
    (await historyMessages(req)).map((m) => [str(m.messageId).replace(/^history-/, ""), str(obj(m.history).decision)]),
  );
  const customerIds = new Map<string, string>();
  let prices: typeof scan.prices;
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    for (const c of scan.customers.filter((x) => !x.known)) {
      const [found] = await all(req, "customers", { name: { equals: c.name } });
      const doc =
        found ??
        (await create(req, "customers", {
          name: c.name,
          country: c.country,
          type: "Ship manager",
          segment: "Marine",
          accountOwner: "sa",
        }));
      customerIds.set(c.name, doc.id);
    }
    if (decisions.get("petro-delta") === "Confirmed") {
      const [found] = await all(req, "customers", { name: { equals: "Petro Delta" } });
      if (!found)
        await create(req, "customers", {
          name: "Petro Delta",
          country: "Egypt",
          type: "Offshore / oil & gas",
          segment: "Offshore",
          contactEmail: "purchasing@petro-delta.example",
          accountOwner: "ah",
        });
    }
    for (const v of scan.vessels.filter((x) => !x.known)) {
      const [found] = await all(req, "vessels", { imo: { equals: v.imo } });
      const customer = customerIds.get(v.fleet);
      if (!found && customer)
        await create(req, "vessels", {
          name: v.name,
          imo: v.imo,
          vesselType: "Reefer",
          customer,
          notes: m.api_sourcing_vessel_history_note({ calls: v.calls, ports: v.ports }, loc(req)),
        });
    }
    for (const s of scan.suppliers.filter((x) => !x.known)) {
      if (await supplierByName(req, s.name)) continue;
      await create(req, "suppliers", {
        name: s.name,
        city: s.city,
        categories: s.categories.startsWith("Paints") ? ["Paints"] : ["Deck stores"],
        emailDomain: s.domain,
        status: "New",
        kind: "local",
        source: m.api_sourcing_supplier_history_source({ quoted: s.quoted }, loc(req)),
      });
    }
    prices = [...scan.prices];
    if (decisions.get("loctite-currency") === "Confirmed")
      prices.push({
        item: "LOCTITE 243 threadlocker 50 ml",
        product: "P2",
        supplier: "Suez Industrial Supply",
        price: 1_950,
        currency: "EGP",
        per: "EA",
        quotedAt: "2024-03-11T00:00:00.000Z",
        validDays: 14,
        ordered: false,
      });
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "committing the history import: records from the organised items and each confirmed proposal (types, owners, categories from the data), not the fixed defaults, Petro Delta and the LOCTITE price",
    );
  }
  let saved = 0;
  for (const p of prices) {
    const sup = await supplierByName(req, p.supplier);
    if (!sup) continue;
    const dup = await all(req, "supplier-prices", {
      and: [
        { supplier: { equals: sup.id } },
        { quotedAt: { equals: p.quotedAt } },
        { description: { equals: p.item } },
      ],
    });
    if (dup.length) continue;
    await create(req, "supplier-prices", {
      supplier: sup.id,
      product: p.product,
      description: p.item,
      price: p.price,
      currency: p.currency,
      per: p.per,
      quotedAt: p.quotedAt,
      validUntil: iso(Date.parse(p.quotedAt) + p.validDays * DAY),
      source: p.ordered ? "Purchase order" : "Email reply",
      ordered: p.ordered,
    });
    saved++;
  }
  const integrations = obj(await req.payload.findGlobal({ slug: "integrations" as never, req }));
  await req.payload.updateGlobal({
    slug: "integrations" as never,
    data: { emailImport: { ...obj(integrations.emailImport), status: "Done", approvedBy: userId(req) } } as never,
    req,
  });
  await logActivity(req, {
    kind: "human",
    entity: "globals/integrations",
    text: m.api_sourcing_history_approved_activity(
      {
        name: await userName(req, userId(req)),
        customers: scan.totals.customers,
        vessels: scan.totals.vessels,
        suppliers: scan.totals.suppliers,
        prices: scan.totals.prices.toLocaleString(intlLocale(langOf(req), "en-US")),
        saved,
      },
      loc(req),
    ),
  });
}

/* ------------------------------------------------------------------ case supplier RFQs */

export interface RfqScheduleStep {
  label: string;
  at: string;
  state: "done" | "next" | "planned" | "skipped";
}

/** A supplier RFQ's reminder schedule (the RFQ itself is read from its collection). */
export interface CaseRfqRow {
  id: string;
  reference: string;
  supplier: { name: string };
  lineNos: number[];
  status: string;
  escalated: boolean;
  schedule: RfqScheduleStep[];
}

export interface CaseLine {
  lineNo: number;
  description: string;
  qty: number;
  unit: string;
  store: string;
  category: string;
  status: string;
  exactBrand: boolean;
  impa: string;
  held: string;
  offers: number;
  rfqs: string[];
}

export interface CaseRfqsPayload {
  case: {
    id: string;
    caseId: string;
    vessel: string;
    port: string;
    deadline: string;
    owner: string;
    ownerName: string;
    stage: string;
  };
  lines: CaseLine[];
  rfqs: CaseRfqRow[];
  newSuppliers: {
    id: string;
    name: string;
    city: string;
    source: string;
    prices: {
      description: string;
      price?: number;
      currency: string;
      per: string;
      quotedAt: string;
      validUntil: string;
    }[];
  }[];
  canSeeCosts: boolean;
  /** What the last "Simulate replies" brought in (`POST /case-rfqs/:id/simulate-replies`), for a while after. */
  arrivals: ReplyEvent[];
  /** The supplier RFQs drafted (`POST …/plan`) and not yet sent or discarded. */
  plan: RfqPlan | null;
}

/** The drafted supplier RFQs per case, kept until sent or discarded (`POST …/plan`). */
const plans = new Map<string, RfqPlan>();
/**
 * Per case, the drafts as they were before one was removed or all were discarded, with what that
 * left: what `…/plan/restore` (the Undo of both) puts back, as long as the drafts are still as
 * it left them (not drafted again, not sent).
 */
const takenBack = new Map<string, { before: RfqPlan; after: RfqPlan | null }>();

/**
 * The replies the last "Simulate replies" brought in, per case, shown as "Replies arriving" for a
 * while after (the presenter's moment; the replies themselves are saved as messages and offers).
 */
const arrivals = new Map<string, { at: number; events: ReplyEvent[] }>();
const SHOW_ARRIVALS_MS = 15 * 60_000;
const arrivalsOf = (caseId: string) => {
  const last = arrivals.get(caseId);
  return last && Date.now() - last.at < SHOW_ARRIVALS_MS ? last.events : [];
};

function scheduleOf(r: Doc, req?: Req): RfqScheduleStep[] {
  const t = { locale: req ? langOf(req) : "en" } as const;
  const status = req ? optionLabel(req, "supplier-rfqs", "status", r.status) : str(r.status);
  const sent = Date.parse(str(r.sentAt));
  const reminders = num(r.reminders);
  const answered = ANSWERED_RFQ.includes(str(r.status));
  if (!sent)
    return answered
      ? [
          {
            label: m.api_sourcing_step_uninvited({ status }, t),
            at: str(r.updatedAt),
            state: "done",
          },
        ]
      : [{ label: m.api_sourcing_step_draft({}, t), at: "", state: "planned" }];
  const steps: RfqScheduleStep[] = [{ label: m.api_sourcing_step_sent({}, t), at: iso(sent), state: "done" }];
  REMINDER_HOURS.forEach((h, i) => {
    const state: RfqScheduleStep["state"] =
      reminders > i ? "done" : answered ? "skipped" : reminders === i ? "next" : "planned";
    steps.push({ label: m.api_sourcing_step_reminder({ n: i + 1 }, t), at: iso(sent + h * HOUR), state });
  });
  steps.push({
    label: m.api_sourcing_step_escalate({}, t),
    at: iso(sent + (REMINDER_HOURS[1] + 4) * HOUR),
    state: r.escalated ? "done" : answered ? "skipped" : "planned",
  });
  if (answered) steps.push({ label: m.api_sourcing_step_stopped({ status }, t), at: str(r.updatedAt), state: "done" });
  return steps;
}

export async function caseRfqsPayload(req: Req, caseDoc: Doc): Promise<CaseRfqsPayload> {
  const rfqs = await all(req, "supplier-rfqs", { case: { equals: caseDoc.id } }, "reference");
  const offers = await all(req, "offers", { case: { equals: caseDoc.id } });
  const suppliers = await all(req, "suppliers");
  const supplier = (id: unknown) => suppliers.find((s) => s.id === idOf(id));
  const rows: CaseRfqRow[] = rfqs.map((r) => {
    const s = supplier(r.supplier);
    return {
      id: r.id,
      reference: str(r.reference),
      supplier: { name: str(s?.name) || m.api_sourcing_supplier({}, loc(req)) },
      lineNos: list<number>(r.lineNos),
      status: str(r.status),
      escalated: Boolean(r.escalated),
      schedule: scheduleOf(r, req),
    };
  });
  const lines: CaseLine[] = list<Json>(caseDoc.items).map((i) => {
    const n = num(i.lineNo);
    return {
      lineNo: n,
      description: str(i.description),
      qty: num(i.qty),
      unit: str(i.unit),
      store: str(i.store),
      category: lineCategory(i),
      status: str(i.status),
      exactBrand: Boolean(i.exactBrand),
      impa: str(i.impa),
      held:
        str(i.status) === "Clarification needed"
          ? str(i.missing) || m.api_sourcing_needs_clarification({}, loc(req))
          : "",
      offers: offers.filter((o) => num(o.lineNo) === n && !o.superseded).length,
      rfqs: rows.filter((r) => r.lineNos.includes(n)).map((r) => r.reference),
    };
  });
  const newSupplierIds = [...new Set(offers.map((o) => str(idOf(o.supplier))))].filter(
    (id) => str(supplier(id)?.status) === "New",
  );
  const newSuppliers: CaseRfqsPayload["newSuppliers"] = [];
  for (const id of newSupplierIds) {
    const s = supplier(id)!;
    const prices = await all(req, "supplier-prices", { supplier: { equals: id } }, "-quotedAt");
    newSuppliers.push({
      id,
      name: str(s.name),
      city: str(s.city),
      source: str(s.source),
      prices: prices.slice(0, 4).map((p) => ({
        description: str(p.description) || str(p.label),
        price: isSales(req) ? undefined : num(p.price),
        currency: str(p.currency),
        per: str(p.per),
        quotedAt: str(p.quotedAt),
        validUntil: str(p.validUntil),
      })),
    });
  }
  return {
    case: {
      id: caseDoc.id,
      caseId: str(caseDoc.caseId),
      vessel: str(caseDoc.vessel),
      port: str(caseDoc.port),
      deadline: str(caseDoc.deadline),
      owner: str(idOf(caseDoc.owner)),
      ownerName: await userName(req, caseDoc.owner),
      stage: str(caseDoc.stage),
    },
    lines,
    rfqs: rows,
    newSuppliers,
    canSeeCosts: !isSales(req),
    arrivals: arrivalsOf(caseDoc.id),
    plan: plans.get(caseDoc.id) ?? null,
  };
}

export interface RfqDraft {
  supplier: string;
  supplierName: string;
  city: string;
  category: string;
  lineNos: number[];
  reference: string;
  note: string;
  preview: { to: string; subject: string; body: string };
}

export interface RfqPlan {
  mode: "split" | "full";
  dueAt: string;
  drafts: RfqDraft[];
  held: { lineNo: number; reason: string }[];
  skipped: string[];
}

function rfqDueAt(caseDoc: Doc) {
  const deadline = Date.parse(str(caseDoc.deadline)) || now() + 2 * DAY;
  return iso(Math.max(now() + 3 * HOUR, Math.min(now() + DAY, deadline - 3 * HOUR)));
}

/** The anonymised email a supplier receives: no client, vessel, reference or customer files. */
export function rfqPreview(
  caseDoc: Doc,
  lines: Json[],
  reference: string,
  dueAt: string,
  supplier: Doc,
  sender: string,
  lang: Lang = "en",
): RfqDraft["preview"] {
  const t = { locale: lang };
  const body = [
    m.api_sourcing_rfq_dear({}, t),
    "",
    m.api_sourcing_rfq_please_quote(
      {
        port: str(caseDoc.port) || m.api_sourcing_rfq_to_port({}, t),
        date: fmtDate(caseDoc.eta, lang) || m.api_sourcing_rfq_date_below({}, t),
      },
      t,
    ),
    "",
    ...lines.map(
      (l, i) =>
        ` ${i + 1}. ${str(l.description)} — ${num(l.qty)} ${str(l.unit)}${l.exactBrand ? m.api_sourcing_rfq_exact({}, t) : m.api_sourcing_rfq_alternatives({}, t)}${str(l.impa) ? ` · IMPA ${str(l.impa)}` : ""}${str(l.partNo) ? m.api_sourcing_rfq_part({ part: str(l.partNo) }, t) : ""}`,
    ),
    "",
    m.api_sourcing_rfq_please_state({}, t),
    "",
    m.api_sourcing_rfq_keep_reference({ reference }, t),
    "",
    m.api_sourcing_rfq_best_regards({}, t),
    `${sender} — Golden Sea for Trading & Marketing`,
  ].join("\n");
  return {
    to: str(supplier.contact) || `sales@${domainOf(supplier) || "supplier.example"}`,
    subject: m.api_sourcing_rfq_subject({ reference, due: fmtDateTime(dueAt, lang) }, t),
    body,
  };
}

async function planRfqs(req: Req, caseDoc: Doc, mode: "split" | "full", only?: number[]): Promise<RfqPlan> {
  const suppliers = await all(req, "suppliers");
  const existing = await all(req, "supplier-rfqs", { case: { equals: caseDoc.id } });
  const asked = (sid: string, n: number) =>
    existing.some((r) => idOf(r.supplier) === sid && list<number>(r.lineNos).includes(n) && str(r.status) !== "Draft");
  const t = loc(req);
  const items = list<Json>(caseDoc.items).filter((i) => !only?.length || only.includes(num(i.lineNo)));
  const held = items
    .filter((i) => str(i.status) === "Clarification needed")
    .map((i) => ({ lineNo: num(i.lineNo), reason: str(i.missing) || m.api_sourcing_needs_clarification({}, t) }));
  const sendable = items.filter((i) => str(i.status) !== "Clarification needed");
  const bySupplier = new Map<string, { s: Doc; lines: Json[]; cats: Set<string> }>();
  const skipped: string[] = [];
  const add = (s: Doc, item: Json, cat: string) => {
    if (asked(s.id, num(item.lineNo))) {
      skipped.push(m.api_sourcing_already_asked({ line: num(item.lineNo), name: str(s.name) }, t));
      return;
    }
    const e = bySupplier.get(s.id) ?? { s, lines: [], cats: new Set<string>() };
    e.lines.push(item);
    e.cats.add(cat);
    bySupplier.set(s.id, e);
  };
  if (mode === "full") {
    const general = suppliers.filter((s) => canQuote(s) && isGeneral(s));
    for (const s of general) for (const i of sendable) add(s, i, "Full list");
  } else {
    for (const i of sendable) {
      const cat = lineCategory(i);
      for (const s of suppliersFor(cat, suppliers)) add(s, i, cat);
    }
  }
  const dueAt = rfqDueAt(caseDoc);
  const n = str(caseDoc.caseId).replace(/\D/g, "");
  const sender = await userName(req, userId(req) ?? caseDoc.owner);
  const drafts: RfqDraft[] = [...bySupplier.values()].map((e, i) => {
    const reference = `GS-SRFQ-${n}-${String.fromCharCode(65 + existing.length + i)}`;
    const category = [...e.cats].join(" · ");
    return {
      supplier: e.s.id,
      supplierName: str(e.s.name),
      city: str(e.s.city),
      category,
      lineNos: e.lines.map((l) => num(l.lineNo)),
      reference,
      note:
        mode === "full"
          ? m.api_sourcing_general_full({}, t)
          : list<string>(e.s.categories).some((c) => e.cats.has(c))
            ? m.api_sourcing_specialist({ category }, t)
            : m.api_sourcing_no_specialist({}, t),
      preview: rfqPreview(caseDoc, e.lines, reference, dueAt, e.s, sender, t.locale),
    };
  });
  return { mode, dueAt, drafts, held, skipped };
}

/* ------------------------------------------------------------------ simulate replies */

/** The new supplier whose reply arrives without ever having been in the database. */
export const NEW_SUPPLIER = {
  name: "Alex Weld Trading",
  city: "Alexandria",
  emailDomain: "alexweld.example",
  contact: "Sherif A. · sales@alexweld.example",
};

export interface ReplyEvent {
  reference: string;
  supplier: string;
  subject: string;
  outcome: "Replied" | "Declined" | "Reminder sent" | "Escalated" | "New supplier saved";
  detail: string;
}

async function remind(req: Req, rfq: Doc): Promise<ReplyEvent> {
  const reminders = num(rfq.reminders) + 1;
  const c = await byId(req, "cases", str(idOf(rfq.case)));
  const supplier = await byId(req, "suppliers", str(idOf(rfq.supplier)));
  const escalate = reminders >= ESCALATE_AFTER;
  const t = loc(req);
  sendEmail(`reminder ${reminders} for ${str(rfq.reference)} to ${str(supplier?.contact) || str(supplier?.name)}`);
  await update(req, "supplier-rfqs", rfq.id, {
    reminders,
    status: escalate && num(rfq.reminders) >= ESCALATE_AFTER ? "No response" : "Awaiting reply",
    escalated: escalate || Boolean(rfq.escalated),
    nextReminderAt: escalate ? null : iso(now() + DAY),
    lastEvent: escalate
      ? m.api_sourcing_reminder_escalated_event({ n: reminders, after: ESCALATE_AFTER }, t)
      : m.api_sourcing_reminder_sent_event({ n: reminders }, t),
  });
  if (escalate && !rfq.escalated) {
    await logActivity(req, {
      case: idOf(rfq.case),
      kind: "alert",
      text: m.api_sourcing_silent_activity(
        { reference: str(rfq.reference), name: str(supplier?.name), after: ESCALATE_AFTER },
        t,
      ),
    });
    await notify(
      req,
      idOf(c?.owner),
      m.api_sourcing_silent_title({ name: str(supplier?.name), reference: str(rfq.reference) }, t),
      m.api_sourcing_silent_detail(
        { after: ESCALATE_AFTER, caseId: str(c?.caseId), due: fmtDateTime(c?.deadline, t.locale) },
        t,
      ),
      link.doc("cases", str(idOf(rfq.case)), "rfqs"),
      "Alert",
    );
  }
  return {
    reference: str(rfq.reference),
    supplier: str(supplier?.name),
    subject: "",
    outcome: escalate ? "Escalated" : "Reminder sent",
    detail: escalate
      ? m.api_sourcing_escalated_to({ name: await userName(req, c?.owner) }, t)
      : m.api_sourcing_reminder_n_sent({ n: reminders }, t),
  };
}

async function replyMessage(req: Req, data: Json) {
  const [existing] = await all(req, "intake-messages", { messageId: { equals: data.messageId } });
  return existing ?? create(req, "intake-messages", data);
}

/** The suppliers' replies to a case's open RFQs (the presenter's "Simulate replies"). */
export async function simulateReplies(req: Req, caseDoc: Doc): Promise<ReplyEvent[]> {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return simulatedReplies(req, caseDoc);
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "suppliers' replies: they arrive in the purchasing mailbox and are matched there; there is nothing to simulate",
    );
  }
}

/** Replies, declines, reminders and a new supplier's offer, as suppliers would send them. */
async function simulatedReplies(req: Req, caseDoc: Doc): Promise<ReplyEvent[]> {
  const onCase = await all(req, "supplier-rfqs", { case: { equals: caseDoc.id } }, "reference");
  const rfqs = onCase.filter((r) => ["Sent", "Awaiting reply"].includes(str(r.status)));
  const events: ReplyEvent[] = [];
  const o = loc(req);
  let t = await demoNow(req);
  // The RFQ the new supplier answers: the first open one, else the latest one sent.
  const firstOpen = rfqs[0] ?? onCase.filter((r) => str(r.sentAt)).at(-1);
  for (const [i, r] of rfqs.entries()) {
    const sid = str(idOf(r.supplier));
    const s = await byId(req, "suppliers", sid);
    const name = str(s?.name);
    const domain = s ? domainOf(s) || `${sid.toLowerCase()}.example` : "supplier.example";
    const pattern = sid === "S3" || i === 0 ? 0 : i % 4;
    t += 4 * 60_000;
    if (pattern === 2) {
      events.push(await remind(req, r));
      continue;
    }
    if (pattern === 3) {
      await replyMessage(req, {
        messageId: `sim-reply-${r.id}`,
        channel: "Email",
        mailbox: "purchasing@",
        receivedAt: iso(t),
        from: `sales@${domain}`,
        fromName: name,
        subject: `RE: Request for quotation ${str(r.reference)}`,
        body: `Dear Golden Sea,\n\nSorry, we cannot supply these items this time.\n\nRegards,\n${name}`,
        classification: "Supplier reply",
        status: "Linked",
        match: {
          case: caseDoc.id,
          supplierRfq: r.id,
          reference: str(r.reference),
          confidence: 0.99,
          basis: [
            m.api_sourcing_ref_in_subject({ ref: str(r.reference) }, o),
            m.api_sourcing_sender_domain({ domain, name }, o),
          ].join("\n"),
        },
      });
      await update(req, "supplier-rfqs", r.id, {
        status: "Declined",
        lastEvent: m.api_sourcing_declined_event({}, o),
      });
      events.push({
        reference: str(r.reference),
        supplier: name,
        subject: "RE: Request for quotation",
        outcome: "Declined",
        detail: m.api_sourcing_cannot_supply({}, o),
      });
      continue;
    }
    const lines = await replyLines(req, r, sid);
    const subject =
      pattern === 0
        ? sid === "S3"
          ? "electrodes – our best price"
          : `our offer ${list<number>(r.lineNos).length > 1 ? "for your list" : "as requested"}`
        : `RE: Request for quotation ${str(r.reference)}`;
    await replyMessage(req, {
      messageId: `sim-reply-${r.id}`,
      channel: "Email",
      mailbox: "purchasing@",
      receivedAt: iso(t),
      from: `sales@${domain}`,
      fromName: name,
      subject,
      body: `Dear Karim,\n\n${pattern === 0 ? `For your ref ${str(r.reference)}:` : "Please find our offer below."}\n${lines
        .map(
          (l) =>
            `Item ${l.lineNo}: ${l.offeredDescription} — ${l.price.toLocaleString("en-US")} LE per ${l.packLabel}, ${l.packs} available, ${l.leadDays} days.`,
        )
        .join("\n")}\nValid ${lines[0]?.validDays ?? 7} days.\n\nRegards,\n${name}`,
      classification: "Supplier reply",
      status: "Linked",
      offerDraft: lines,
      match: {
        case: caseDoc.id,
        supplierRfq: r.id,
        reference: str(r.reference),
        confidence: 0.99,
        basis: [
          (pattern === 0 ? m.api_sourcing_ref_in_body : m.api_sourcing_ref_in_subject)({ ref: str(r.reference) }, o),
          pattern === 0 ? m.api_sourcing_subject_changed({ subject }, o) : m.api_sourcing_subject_kept({}, o),
          m.api_sourcing_sender_domain({ domain, name }, o),
        ].join("\n"),
      },
    });
    await saveOffers(req, r, sid, lines);
    await update(req, "supplier-rfqs", r.id, {
      status: "Replied",
      lastEvent: m.api_sourcing_offer_received_event({ changed: pattern === 0 ? "yes" : "no", subject }, o),
    });
    events.push({
      reference: str(r.reference),
      supplier: name,
      subject,
      outcome: "Replied",
      detail: m.api_sourcing_lines_offered({ count: lines.length, changed: pattern === 0 ? "yes" : "no" }, o),
    });
  }

  // A supplier we've never dealt with answers the RFQ (forwarded to them): created on the spot.
  if (firstOpen) {
    let s = await supplierByName(req, NEW_SUPPLIER.name);
    const fresh = !s;
    const category = lineCategory(
      list<Json>(caseDoc.items).find((i) => list<number>(firstOpen.lineNos).includes(num(i.lineNo))) ?? {},
    );
    s ??= await create(req, "suppliers", {
      ...NEW_SUPPLIER,
      categories: [category],
      status: "New",
      kind: "local",
      currency: "EGP",
      source: m.api_sourcing_auto_created_source(
        { reference: str(firstOpen.reference), date: fmtDate(iso(t), o.locale) },
        o,
      ),
    });
    const already = await all(req, "supplier-rfqs", {
      and: [{ case: { equals: caseDoc.id } }, { supplier: { equals: s.id } }],
    });
    if (!already.length) {
      t += 6 * 60_000;
      const ownRfq = await create(req, "supplier-rfqs", {
        case: caseDoc.id,
        supplier: s.id,
        lineNos: list<number>(firstOpen.lineNos),
        dueAt: str(firstOpen.dueAt),
        status: "Replied",
        category,
        mode: "Split by category",
        lastEvent: m.api_sourcing_not_invited_event({ reference: str(firstOpen.reference) }, o),
        anonymised: true,
      });
      const lines = (await replyLines(req, firstOpen, s.id)).map((l) => {
        const perKg = l.packSize > 1;
        const price = Math.round((perKg ? l.price / l.packSize : l.price) * 0.94);
        return {
          ...l,
          price: perKg ? price * l.packSize : price,
          leadDays: 1,
          validDays: 5,
          confidence: perKg ? 0.71 : 0.86,
          uncertain: perKg
            ? m.api_sourcing_per_kg_uncertain(
                {
                  price,
                  converted: (price * l.packSize).toLocaleString(intlLocale(o.locale, "en-US")),
                  pack: l.packSize,
                },
                o,
              )
            : m.api_sourcing_new_supplier_confirm({ line: l.lineNo }, o),
        };
      });
      const reference = str(firstOpen.reference);
      await replyMessage(req, {
        messageId: `sim-newsupplier-${caseDoc.id}`,
        channel: "Email",
        mailbox: "purchasing@",
        receivedAt: iso(t),
        from: `sales@${NEW_SUPPLIER.emailDomain}`,
        fromName: NEW_SUPPLIER.name,
        subject: "price offer",
        body: `Hello,\n\nWe got your request ${reference} from a colleague.\n${lines
          .map(
            (l) =>
              `${l.offeredDescription}: ${Math.round(l.packSize > 1 ? l.price / l.packSize : l.price)} LE, ready tomorrow.`,
          )
          .join("\n")}\nPrice valid 5 days. Cash on delivery.\n\nSherif — Alex Weld Trading`,
        classification: "Supplier reply",
        status: "Needs review",
        offerDraft: lines,
        match: {
          case: caseDoc.id,
          supplierRfq: ownRfq.id,
          reference,
          confidence: 0.93,
          basis: [
            m.api_sourcing_ref_in_body({ ref: reference }, o),
            m.api_sourcing_subject_changed({ subject: "price offer" }, o),
            (fresh ? m.api_sourcing_new_supplier_created : m.api_sourcing_new_supplier_saved)(
              { domain: NEW_SUPPLIER.emailDomain },
              o,
            ),
            m.api_sourcing_price_unit_unclear({}, o),
          ].join("\n"),
        },
      });
      await saveOffers(req, ownRfq, s.id, lines);
      events.push({
        reference,
        supplier: NEW_SUPPLIER.name,
        subject: "price offer",
        outcome: "New supplier saved",
        detail: m.api_sourcing_new_supplier_detail({}, o),
      });
      await logActivity(req, {
        case: caseDoc.id,
        kind: "auto",
        text: m.api_sourcing_new_supplier_activity({ name: NEW_SUPPLIER.name, reference }, o),
      });
    }
  }
  return events;
}

/* ------------------------------------------------------------------ endpoints */

const guard = (handler: (req: Req) => Promise<Response>) => async (req: Req) => {
  if (!req.user) return fail(401, m.api_insights_shared_not_allowed({}, loc(req)));
  try {
    return await handler(req);
  } catch (e) {
    const err = e as Error & { status?: number };
    return fail(err.status ?? 500, err.message);
  }
};

export async function inboxPayload(req: Req): Promise<InboxPayload> {
  const docs = (await all(req, "intake-messages", undefined, "-receivedAt")).filter(
    (m) => str(m.source) !== "History import",
  );
  const integrations = obj(await req.payload.findGlobal({ slug: "integrations" as never, req }));
  const connections = list<Json>(integrations.connections)
    .filter((c) => /mailbox|Website/.test(str(c.kind)))
    .map((c) => ({ kind: str(c.kind), account: str(c.account), status: str(c.status) }));
  connections.push({ kind: "WhatsApp", account: m.api_sourcing_forwarded_by_staff({}, loc(req)), status: "Manual" });
  let processedToday: number;
  let duplicates: number;
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    processedToday = 14 + docs.filter((m) => str(m.messageId).startsWith("sim-")).length;
    duplicates = 2 + docs.filter((m) => m.classification === "Duplicate").length;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the inbox's figures for today: the messages received and the duplicates found today, without the fixed 14 and 2",
    );
  }
  return {
    connections,
    stats: {
      processedToday,
      duplicates,
      review: docs.filter((m) => m.status === "Needs review").length,
      newCount: docs.filter((m) => m.status === "New").length,
    },
  };
}

export interface InboxDetail {
  /** The message (the newest when none is asked for or it's gone); null when the inbox is empty. */
  message: InboxMessage | null;
  /** An RFQ or service request: read into a draft case rather than matched. */
  rfq: boolean;
  /** The draft read from it before (saved on the message), for an RFQ. */
  extraction: ExtractionResult | null;
}

const isRfqMessage = (m: Doc) => ["New RFQ", "Service request"].includes(str(m.classification));

/** One message of the inbox with its extraction state (`GET /inbox/message?id=`). */
export async function inboxDetail(req: Req, id: string): Promise<InboxDetail> {
  const doc =
    (id ? await byId(req, "intake-messages", id) : null) ??
    (await all(req, "intake-messages", undefined, "-receivedAt")).find((m) => str(m.source) !== "History import");
  if (!doc) return { message: null, rfq: false, extraction: null };
  const rfq = isRfqMessage(doc);
  const read = list(obj(doc.extraction).header).length > 0;
  let draft: ExtractionResult | null;
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    draft = rfq && read ? await extraction(req, doc) : null;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the reading pane's draft case: the extraction saved on the message instead of reading the message again",
    );
  }
  return {
    message: await toInboxMessage(req, doc),
    rfq,
    extraction: draft,
  };
}

/** The call that puts a case's RFQ drafts back as they were (a reply's `undo`). */
const restorePlan = (c: Doc) => ({ path: `/sourcing/cases/${encodeURIComponent(c.id)}/plan/restore`, body: {} });

/** What a review changes on a message, so its Undo can put it back: its status and the case guessed. */
const reviewedFrom = (msg: Doc) => ({ status: str(msg.status), case: idOf(obj(msg.match).case) ?? null });

/** The supplier RFQ a linked reply was counted on (its offers saved, its status set), if any. */
async function linkedReply(req: Req, msg: Doc): Promise<Doc | null> {
  const match = obj(msg.match);
  const rfqId = idOf(match.supplierRfq);
  if (rfqId) return byId(req, "supplier-rfqs", rfqId);
  const sender = (await all(req, "suppliers")).find((s) => domainOf(s) === senderDomain(msg.from));
  const caseId = idOf(match.case);
  if (!sender || !caseId) return null;
  const [rfq] = await all(req, "supplier-rfqs", {
    and: [{ case: { equals: caseId } }, { supplier: { equals: sender.id } }],
  });
  return rfq ?? null;
}

async function messageOr404(req: Req) {
  const msg = await byId(req, "intake-messages", str(req.routeParams?.id));
  if (!msg) throw Object.assign(new Error(m.api_sourcing_message_not_found({}, loc(req))), { status: 404 });
  return msg;
}

export async function caseOr404(req: Req) {
  const c = await byId(req, "cases", str(req.routeParams?.id));
  if (!c) throw Object.assign(new Error(m.api_sourcing_case_not_found({}, loc(req))), { status: 404 });
  return c;
}

export const sourcingEndpoints: Endpoint[] = [
  /* -------- inbox */
  {
    path: "/inbox",
    method: "get",
    handler: guard(async (req) => json(await inboxPayload(req))),
  },
  {
    // Presenter: drop a fresh message into the inbox (rfq | forward | reply).
    path: "/inbox/simulate",
    method: "post",
    handler: guard(async (req) => {
      if (IS_MOCK) {
        // TODO implement mock only logic to simulate third party connections
        const kind = str((await body(req)).kind) || "rfq";
        const t = await demoNow(req);
        const { totalDocs } = await req.payload.count({
          collection: "intake-messages" as never,
          where: { messageId: { like: "sim-" } } as never,
          req,
        });
        const base = kind === "forward" ? SIMULATED_FORWARD : kind === "reply" ? SIMULATED_REPLY : SIMULATED_RFQ;
        const doc = await create(req, "intake-messages", {
          ...base,
          receivedAt: iso(t),
          messageId: `sim-${kind}-${totalDocs + 1}@${senderDomain(base.from)}`,
          source: "Live",
        });
        // `href` opens the new message on the inbox (`?message=`), as a fresh arrival would be.
        return json({ doc: await toInboxMessage(req, doc), href: `?message=${encodeURIComponent(doc.id)}` }, 201);
      } else {
        // TODO implement actual prod third party connections
        throw new NotConnectedError(
          "incoming mail and WhatsApp: the mailboxes, the website form and WhatsApp deliver new messages; there is nothing to simulate",
        );
      }
    }),
  },
  {
    // One message with its extraction state, for the reading pane (the newest without `id`).
    path: "/inbox/message",
    method: "get",
    handler: guard(async (req) => json(await inboxDetail(req, str(req.query?.id)))),
  },
  {
    // AI stub: read the message + attachments into a draft case (or recognise a duplicate).
    path: "/inbox/:id/extract",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      const match = await matchMessage(req, msg);
      if (match.outcome === "duplicate") {
        await applyMatch(req, msg, match);
        return json({
          kind: "duplicate",
          match,
          message: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!),
        });
      }
      const x = await extraction(req, msg);
      await saveExtraction(req, msg, x);
      return json(x);
    }),
  },
  {
    // Reply matching (supplier replies, forwards): reference → duplicate → sender; below 85% → review.
    path: "/inbox/:id/match",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      const match = await matchMessage(req, msg);
      await applyMatch(req, msg, match);
      const t = loc(req);
      const pct = `${Math.round(match.confidence * 100)}%`;
      const message =
        match.outcome === "linked"
          ? m.api_sourcing_matched_to({ caseId: str(match.caseId), reference: str(match.reference), pct }, t)
          : match.outcome === "duplicate"
            ? match.caseId
              ? m.api_sourcing_duplicate_linked({ caseId: match.caseId }, t)
              : m.api_sourcing_duplicate_kept({}, t)
            : m.api_sourcing_uncertain_review({}, t);
      return json({ match, doc: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!), message });
    }),
  },
  {
    // A person confirms the draft: the case and its lines are created, the message linked, acknowledged once.
    path: "/inbox/:id/create-case",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      if (idOf(msg.createdCase)) {
        const caseId = await caseIdOf(req, msg.createdCase);
        return json({
          case: { id: idOf(msg.createdCase), caseId },
          acknowledged: false,
          already: true,
          message: m.api_sourcing_case_already_created({ caseId }, loc(req)),
        });
      }
      return json(await createCaseFrom(req, msg, await body(req)), 201);
    }),
  },
  {
    // Review queue: link to the case a person picked (saving any offer read from it), or mark not related.
    path: "/inbox/:id/review",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      const input = await body(req);
      const decision = str(input.decision);
      const match = obj(msg.match);
      // `undo`: the call that puts it back in the queue as it was (`…/reopen`), while it still can be.
      const reopen = { path: `/inbox/${encodeURIComponent(msg.id)}/reopen`, body: reviewedFrom(msg) };
      if (decision === "not-related") {
        await update(req, "intake-messages", msg.id, {
          status: "Ignored",
          match: { ...match, reviewedBy: userId(req), reviewedAt: iso(now()) },
        });
        return json({
          message: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!),
          undo: reopen,
        });
      }
      const caseId = str(input.case) || str(idOf(match.case));
      const c = caseId ? await byId(req, "cases", caseId) : null;
      const t = loc(req);
      if (!c) return fail(400, m.api_sourcing_pick_case({}, t));
      await update(req, "intake-messages", msg.id, {
        status: "Linked",
        match: { ...match, case: c.id, reviewedBy: userId(req), reviewedAt: iso(now()) },
      });
      // Offers read from the reply: saved now, against this supplier's RFQ on the chosen case.
      const rfqId = idOf(match.supplierRfq);
      const sender = (await all(req, "suppliers")).find((s) => domainOf(s) === senderDomain(msg.from));
      let rfq = rfqId ? await byId(req, "supplier-rfqs", rfqId) : null;
      if (!rfq && sender)
        [rfq] = await all(req, "supplier-rfqs", {
          and: [{ case: { equals: c.id } }, { supplier: { equals: sender.id } }],
        });
      if (rfq) {
        const offers = await all(req, "offers", { supplierRfq: { equals: rfq.id } });
        for (const o of offers) {
          const deviations = list<Json>(o.deviations).filter((d) => !(d.type === "Unit" && d.detectedBy === "AI"));
          if (deviations.length !== list(o.deviations).length) await update(req, "offers", o.id, { deviations });
        }
        const drafts = list<OfferLine>(msg.offerDraft);
        if (drafts.length && !offers.length) await saveOffers(req, rfq, str(idOf(rfq.supplier)), drafts);
        if (!ANSWERED_RFQ.includes(str(rfq.status)))
          await update(req, "supplier-rfqs", rfq.id, {
            status: "Replied",
            lastEvent: m.api_sourcing_linked_after_review_event({}, t),
          });
      }
      const who = await userName(req, userId(req));
      await logActivity(req, {
        case: c.id,
        kind: "human",
        text: m.api_sourcing_linked_activity(
          {
            subject: str(msg.subject),
            from: str(msg.fromName),
            who,
            offer: list(msg.offerDraft).length ? "yes" : "no",
          },
          t,
        ),
      });
      // A link that counted a supplier's reply on the case (offers, the RFQ's status) stands.
      return json({
        message: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!),
        undo: rfq ? null : reopen,
      });
    }),
  },
  {
    // The Undo of a review: the person who filed the message puts it back in the queue, as it was.
    path: "/inbox/:id/reopen",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      const t = loc(req);
      const match = obj(msg.match);
      if (!["Ignored", "Linked"].includes(str(msg.status)) || !idOf(match.reviewedBy))
        return fail(409, m.api_sourcing_not_filed_by_review({}, t));
      if (idOf(match.reviewedBy) !== userId(req))
        return fail(
          403,
          m.api_sourcing_only_filer({ name: await userName(req, idOf(match.reviewedBy) ?? undefined) }, t),
        );
      if (str(msg.status) === "Linked" && (await linkedReply(req, msg)))
        return fail(409, m.api_sourcing_reply_counted({}, t));
      const was = obj(await body(req));
      const before = ["New", "Needs review"].includes(str(was.status)) ? str(was.status) : "Needs review";
      const guess = str(was.case) ? await byId(req, "cases", str(was.case)) : null;
      await updateAsUser(req, "intake-messages", msg.id, {
        status: before,
        match: { ...match, case: guess?.id ?? null, reviewedBy: null, reviewedAt: null },
      });
      if (str(msg.status) === "Linked" && idOf(match.case))
        await logActivity(req, {
          case: idOf(match.case)!,
          kind: "human",
          text: m.api_sourcing_reopened_activity(
            { subject: str(msg.subject), from: str(msg.fromName), who: await userName(req, userId(req)) },
            t,
          ),
        });
      return json({
        doc: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!),
        message: m.api_sourcing_back_in_queue({}, t),
      });
    }),
  },

  /* -------- inbox history */
  {
    path: "/inbox-history",
    method: "get",
    handler: guard(async (req) => json(await historyPayload(req))),
  },
  {
    // Presenter: organise the scanned history into customers, vessels, suppliers and prices.
    path: "/inbox-history/organise",
    method: "post",
    handler: guard(async (req) => {
      const existing = await historyMessages(req);
      const t = loc(req);
      const scan = scannedHistory();
      for (const u of scan.uncertain) {
        if (existing.some((m) => m.messageId === `history-${u.key}`)) continue;
        await create(req, "intake-messages", {
          channel: "Email",
          mailbox: u.mailbox,
          receivedAt: u.receivedAt,
          from: u.from,
          fromName: u.fromName,
          subject: u.subject,
          messageId: `history-${u.key}`,
          classification:
            u.kind === "Confidential"
              ? "Not an RFQ"
              : u.kind === "Supplier" || u.kind === "Price"
                ? "Supplier reply"
                : "New RFQ",
          status: "Needs review",
          source: "History import",
          history: {
            kind: u.kind,
            question: canned(u.question, t.locale),
            proposal: canned(u.proposal, t.locale),
            confidence: u.confidence,
          },
        });
      }
      // Who approves the import: management.
      let approver: string;
      if (IS_TEMP_MOCK) {
        // TODO replace temporary mock logic with proper polished logic
        approver = "kb";
      } else {
        // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
        throw new TempMockError("who approves the history import: the management users instead of the fixed user kb");
      }
      if (!existing.length)
        await notify(
          req,
          approver,
          m.api_sourcing_history_ready({}, t),
          m.api_sourcing_history_ready_detail(
            {
              customers: scan.totals.customers,
              vessels: scan.totals.vessels,
              suppliers: scan.totals.suppliers,
              prices: scan.totals.prices.toLocaleString(intlLocale(t.locale, "en-US")),
              uncertain: scan.uncertain.length,
            },
            t,
          ),
          "/inbox-history",
          "Approval",
        );
      return json(await historyPayload(req));
    }),
  },
  {
    path: "/inbox-history/review/:id",
    method: "post",
    handler: guard(async (req) => {
      const msg = await messageOr404(req);
      const t = loc(req);
      if (str(msg.source) !== "History import") return fail(400, m.api_sourcing_not_history_item({}, t));
      const input = str((await body(req)).decision);
      const path = `/inbox-history/review/${encodeURIComponent(msg.id)}`;
      // The Undo of a decision: back to "needs a decision", while the import isn't approved.
      if (input === "reopen") {
        if (str(msg.status) === "Needs review") return fail(409, m.api_sourcing_already_waiting({}, t));
        if ((await historyPayload(req)).approved) return fail(409, m.api_sourcing_import_approved({}, t));
        if (idOf(obj(msg.match).reviewedBy) !== userId(req))
          return fail(
            403,
            m.api_sourcing_only_decider({ name: await userName(req, idOf(obj(msg.match).reviewedBy) ?? undefined) }, t),
          );
        await updateAsUser(req, "intake-messages", msg.id, {
          status: "Needs review",
          history: { ...obj(msg.history), decision: null },
          match: { ...obj(msg.match), reviewedBy: null, reviewedAt: null },
        });
        return json({ ...(await historyPayload(req)), message: m.api_sourcing_back_to_decision({}, t) });
      }
      const decision = input === "reject" ? "Rejected" : "Confirmed";
      await update(req, "intake-messages", msg.id, {
        status: decision === "Confirmed" ? "Linked" : "Ignored",
        history: { ...obj(msg.history), decision },
        match: { ...obj(msg.match), reviewedBy: userId(req), reviewedAt: iso(now()) },
      });
      return json({ ...(await historyPayload(req)), undo: { path, body: { decision: "reopen" } } });
    }),
  },
  {
    // Management only: nothing from the history is saved before this approval.
    path: "/inbox-history/approve",
    method: "post",
    handler: guard(async (req) => {
      const t = loc(req);
      if (role(req) !== "management") return fail(403, m.api_sourcing_management_approves({}, t));
      const p = await historyPayload(req);
      if (!p.organised) return fail(400, m.api_sourcing_organise_first({}, t));
      if (p.pending) return fail(400, m.api_sourcing_pending_items({ count: p.pending }, t));
      if (!p.approved) await commitHistory(req);
      return json(await historyPayload(req));
    }),
  },

  /* -------- supplier RFQs of a case */
  {
    path: "/sourcing/cases/:id",
    method: "get",
    handler: guard(async (req) => json(await caseRfqsPayload(req, await caseOr404(req)))),
  },
  {
    // Draft the supplier RFQs: lines split by category (or the full list), client identity removed.
    path: "/sourcing/cases/:id/plan",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const input = await body(req);
      const mode = str(input.mode) === "full" ? "full" : "split";
      const only = list<number>(input.lineNos).map(num).filter(Boolean);
      const t = loc(req);
      if (Array.isArray(input.lineNos) && !only.length) return fail(400, m.api_sourcing_pick_line({}, t));
      const plan = await planRfqs(req, c, mode, only);
      if (plan.drafts.length) plans.set(c.id, plan);
      else plans.delete(c.id);
      takenBack.delete(c.id);
      const n = plan.drafts.length;
      const message = n
        ? m.api_sourcing_drafts_ready({ count: n }, t)
        : plan.held.length && !plan.skipped.length
          ? m.api_sourcing_held_back({ lines: plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ") }, t)
          : m.api_sourcing_nothing_new({}, t);
      return json({ ...plan, message });
    }),
  },
  {
    // Drop one drafted RFQ (by its reference) before sending.
    path: "/sourcing/cases/:id/plan/remove",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const reference = str((await body(req)).reference);
      const plan = plans.get(c.id);
      if (!plan?.drafts.some((d) => d.reference === reference))
        return fail(404, m.api_sourcing_draft_gone({}, loc(req)));
      const drafts = plan.drafts.filter((d) => d.reference !== reference);
      if (drafts.length) plans.set(c.id, { ...plan, drafts });
      else plans.delete(c.id);
      takenBack.set(c.id, { before: plan, after: plans.get(c.id) ?? null });
      return json({ plan: plans.get(c.id) ?? null, undo: restorePlan(c) });
    }),
  },
  {
    // The Undo of removing a draft or discarding them all: the drafts as they were before.
    path: "/sourcing/cases/:id/plan/restore",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const kept = takenBack.get(c.id);
      if (!kept || (plans.get(c.id) ?? null) !== kept.after)
        return fail(409, m.api_sourcing_drafts_changed({}, loc(req)));
      plans.set(c.id, kept.before);
      takenBack.delete(c.id);
      const n = kept.before.drafts.length;
      return json({ plan: kept.before, message: m.api_sourcing_drafts_back({ count: n }, loc(req)) });
    }),
  },
  {
    // Throw the drafts away; nothing was sent.
    path: "/sourcing/cases/:id/plan/discard",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const plan = plans.get(c.id);
      plans.delete(c.id);
      if (plan) takenBack.set(c.id, { before: plan, after: null });
      return json({ plan: null, undo: plan ? restorePlan(c) : null });
    }),
  },
  {
    // A person confirmed the drafts: one RFQ per supplier, sent, reminders scheduled. Sends the
    // drafts given, or else the plan kept by `…/plan`.
    path: "/sourcing/cases/:id/send",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const input = await body(req);
      const kept = plans.get(c.id);
      const given = list<Json>(input.drafts);
      const drafts: Json[] = given.length ? given : ((kept?.drafts ?? []) as unknown as Json[]);
      const t = loc(req);
      if (!drafts.length) return fail(400, m.api_sourcing_nothing_to_send({}, t));
      const mode = str(input.mode || (given.length ? "" : kept?.mode)) === "full" ? "Full list" : "Split by category";
      const due = str(input.dueAt) || (given.length ? "" : str(kept?.dueAt)) || rfqDueAt(c);
      const sentAt = now() + 5 * 60_000;
      const sent: Doc[] = [];
      for (const d of drafts) {
        const lineNos = list<number>(d.lineNos).map(num).filter(Boolean);
        if (!lineNos.length || !str(d.supplier)) continue;
        sendEmail(
          `the supplier RFQ ${str(d.reference)} to ${str(obj(d.preview).to) || str(d.supplierName) || str(d.supplier)}`,
        );
        sent.push(
          await create(req, "supplier-rfqs", {
            case: c.id,
            supplier: str(d.supplier),
            lineNos,
            sentAt: iso(sentAt),
            dueAt: due,
            status: "Sent",
            reminders: 0,
            nextReminderAt: iso(sentAt + REMINDER_HOURS[0] * HOUR),
            lastEvent: m.api_sourcing_sent_event({}, t),
            anonymised: true,
            sentBy: userId(req),
            mode,
            category: str(d.category),
          }),
        );
      }
      plans.delete(c.id);
      takenBack.delete(c.id);
      if (["New", "Validating", "Sourcing"].includes(str(c.stage)))
        await update(req, "cases", c.id, { stage: "Awaiting supplier", wait: "Awaiting supplier" });
      await logActivity(req, {
        case: c.id,
        kind: "human",
        text: m.api_sourcing_sent_activity(
          {
            count: sent.length,
            who: await userName(req, userId(req)),
            mode: optionLabel(req, "supplier-rfqs", "mode", mode).toLowerCase(),
            references: sent.map((r) => str(r.reference)).join(t.locale === "ar" ? "، " : ", "),
          },
          t,
        ),
      });
      return json({ sent: sent.map((r) => ({ id: r.id, reference: str(r.reference) })) }, 201);
    }),
  },
  {
    // Presenter: replies arrive — matched by reference (even with changed subjects), offers captured.
    path: "/sourcing/cases/:id/simulate-replies",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const events = await simulateReplies(req, c);
      return json({ events, ...(await caseRfqsPayload(req, c)) });
    }),
  },
  {
    // The "Supplier RFQs" tab's "Simulate replies": as above, keeping what arrived for the tab to show.
    path: "/case-rfqs/:id/simulate-replies",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      const events = await simulateReplies(req, c);
      if (!events.length) return fail(400, m.api_sourcing_none_waiting({}, loc(req)));
      arrivals.set(c.id, { at: Date.now(), events });
      return json({ events });
    }),
  },
  {
    path: "/sourcing/rfqs/:id/remind",
    method: "post",
    handler: guard(async (req) => {
      const r = await byId(req, "supplier-rfqs", str(req.routeParams?.id));
      const t = loc(req);
      if (!r) return fail(404, m.api_sourcing_rfq_not_found({}, t));
      if (!OPEN_RFQ.includes(str(r.status))) return fail(400, m.api_sourcing_reminders_stop({}, t));
      return json({ event: await remind(req, r) });
    }),
  },
];
