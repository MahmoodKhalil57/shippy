import type { Endpoint, PayloadRequest } from "payload";
import type { Doc } from "../../mock/types.ts";
import { idOf, logActivity, scalar } from "../collections/shared.ts";
import { DEMO_NOW } from "./home.ts";
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

async function notify(
  req: Req,
  user: string | undefined,
  title: string,
  detail: string,
  href: string,
  kind = "Update",
) {
  if (!user) return;
  await create(req, "notifications", { user, title, detail, href, kind, at: iso(DEMO_NOW.getTime()) }).catch(
    () => undefined,
  );
}

const DATE = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const DATETIME = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const fmtDate = (v: unknown) => (str(v) ? DATE.format(new Date(str(v))) : "");
const fmtDateTime = (v: unknown) => (str(v) ? DATETIME.format(new Date(str(v))) : "");

async function userName(req: Req, id: unknown): Promise<string> {
  const uid = idOf(id);
  if (!uid) return "";
  const u = await byId(req, "users", uid);
  return str(u?.name) || uid;
}

/** "Now" in the demo's timeline, nudged forward so new records sort after the seeded ones. */
async function demoNow(req: Req, offsetMinutes = 0) {
  const { totalDocs } = await req.payload.count({
    collection: "intake-messages" as never,
    where: { messageId: { like: "sim-" } } as never,
    req,
  });
  return DEMO_NOW.getTime() + (25 + totalDocs * 3 + offsetMinutes) * 60_000;
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
const domainOf = (s: Doc) => str(s.emailDomain) || KNOWN_DOMAINS[s.id] || "";
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

/**
 * Matches an incoming message to a case: supplier-RFQ reference anywhere in the subject or body
 * (subjects change all the time), identical attachments or customer reference (duplicates),
 * then the sender's domain (uncertain → review queue). Never guesses below the threshold.
 */
export async function matchMessage(req: Req, msg: Doc): Promise<MatchResult> {
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
        `Reference ${ref} found in the ${REF_RE.test(subject) ? "subject" : "body"}`,
        REF_RE.test(subject)
          ? "Thread subject kept"
          : `Subject changed (“${subject}”) — matched by reference, not by subject`,
      ];
      if (sender && sender.id === invited) basis.push(`Sender domain ${domain} = ${str(sender.name)}`);
      else if (sender) basis.push(`Sent by ${str(sender.name)} for an RFQ sent to another supplier`);
      else basis.push(`Sender ${domain || str(msg.from)} is not in the supplier list — new supplier`);
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
          `Identical attachments (${hash.slice(0, 14)}…) to “${str(first.subject)}”, received ${fmtDateTime(first.receivedAt)}`,
          linkedCase
            ? `Already linked to ${caseId} — no new case, no second acknowledgement`
            : "The original message isn't a case yet — handle that one; this copy is kept with it",
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
        basis: [`Customer reference ${customerRef} = ${str(c.caseId)}`, "No new case, no second acknowledgement"],
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
        confidence: Math.max(0.3, 0.62 - i * 0.21),
        reason: `${str(sender.name)} was asked on ${str(r.reference)} (${str(r.status).toLowerCase()})`,
      });
      i++;
    }
    return {
      outcome: "review",
      supplier: sender.id,
      confidence: candidates[0]?.confidence ?? 0.4,
      basis: [
        "No supplier-RFQ reference in subject or body",
        `Sender domain ${domain} = ${str(sender.name)}`,
        candidates.length > 1
          ? `Invited on ${candidates.length} open cases — can't tell which`
          : "Below 85% — a person confirms before anything is linked",
      ],
      candidates,
    };
  }
  return {
    outcome: "none",
    confidence: 0,
    basis: ["No reference, no thread, unknown sender — a person classifies it"],
  };
}

/** Offers from a matched reply: created once per RFQ line (the Compare tab reads them). */
async function saveOffers(req: Req, rfq: Doc, supplierId: string, lines: OfferLine[], messageId?: string) {
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
        validUntil: iso(DEMO_NOW.getTime() + l.validDays * DAY),
        paymentTerms: "Cash",
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
      text: `${created.length} offer line${created.length > 1 ? "s" : ""} captured from the reply to ${str(rfq.reference)}${messageId ? "" : ""} — dated prices saved to the supplier's history.`,
    });
  return created;
}

/** The offer lines a reply to `rfq` contains (deterministic stub of the offer reader). */
async function replyLines(req: Req, rfq: Doc, supplierId: string): Promise<OfferLine[]> {
  const c = await byId(req, "cases", str(idOf(rfq.case)));
  const items = list<Json>(c?.items).filter((i) => list<number>(rfq.lineNos).includes(num(i.lineNo)));
  return items.map((item) =>
    supplierId === "S3" && /E6013/i.test(str(item.description))
      ? offerFor(supplierId, item, { price: 980, leadDays: 3, validDays: 7, packLabel: "Box 5 kg" })
      : offerFor(supplierId, item),
  );
}

/* ------------------------------------------------------------------ inbox: extraction */

const UNIT_MAP: Record<string, string> = { coil: "roll", sheet: "pcs", box: "pack", ltr: "L", litre: "L" };
const caseUnit = (u: string) => UNIT_MAP[u.toLowerCase()] ?? u;

function scenarioOf(msg: Doc): Scenario | undefined {
  return SCENARIOS[str(msg.scenario) || SCENARIO_BY_ID[msg.id] || ""];
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
  const s = scenarioOf(msg);
  const draft = s?.draft;
  const owner = draft?.owner ?? userId(req) ?? "ky";
  const backup = draft?.backup ?? "ky";
  const ownerName = await userName(req, owner);
  const backupName = await userName(req, backup);
  const customer = draft?.customer ? await byId(req, "customers", draft.customer) : null;
  const customerName = str(customer?.name) || draft?.newCustomer?.name || str(msg.fromName) || str(msg.from);
  const deadline = draft?.deadline ?? iso(DEMO_NOW.getTime() + DAY);
  const templates = list<Json>(
    obj(await req.payload.findGlobal({ slug: "message-templates" as never, req })).templates,
  );
  const tpl = templates.find((t) => t.key === "rfq-ack");
  const vars = {
    contact: str(msg.fromName).split(/[·(]/)[0].trim() || "Sir / Madam",
    vessel: draft?.vessel ?? "your vessel",
    caseId: "(case number on creation)",
    dueAt: fmtDateTime(deadline),
    customerRef: draft?.customerRef ?? `for ${draft?.vessel ?? "your vessel"}`,
    owner: ownerName,
  };
  const ackBody = `${fill(str(tpl?.body) || "Dear {{contact}},\n\nThank you — your request for {{vessel}} is registered as {{caseId}}. We will revert by {{dueAt}}.", vars)}\n\nYour contact: ${ownerName} (backup ${backupName}).\n\nGolden Sea for Trading & Marketing\nShip chandler · Port Said · Suez · Alexandria`;
  return {
    kind: "extraction",
    header: s?.header ?? [
      { field: "Customer", value: customerName, confidence: 0.5 },
      { field: "Subject", value: str(msg.subject), confidence: 0.9 },
    ],
    lines: s?.lines ?? [],
    missing: s?.missing ?? ["No lines found — add them by hand"],
    clarification: fill(s?.clarification ?? "", { ...vars, caseId: "your case" }),
    notes: s?.notes ?? [],
    assignment: { owner, ownerName, backup, backupName, deadline, rule: draft?.rule ?? "No rule matched — you own it" },
    acknowledgement: {
      subject: fill(str(tpl?.subject) || "We received your RFQ {{customerRef}}", vars),
      body: ackBody,
      manual: Boolean(s?.manualAck) || str(msg.channel) !== "Email",
      template: `${str(tpl?.name) || "RFQ received – marine"} · v${num(tpl?.version) || 1} (approved)`,
    },
    caseType: draft?.caseType ?? "rfq",
    customerName,
    newCustomer: !customer && Boolean(draft?.newCustomer),
    model: "gs-extract (demo stub) · vision + spreadsheet reader",
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
      extractedAt: iso(DEMO_NOW.getTime()),
    },
  });
}

/** Applies a match result to the message (and, for supplier replies, to the RFQ and offers). */
async function applyMatch(req: Req, msg: Doc, m: MatchResult) {
  const status = m.outcome === "linked" || (m.outcome === "duplicate" && m.case) ? "Linked" : "Needs review";
  let classification = str(msg.classification) || "Supplier reply";
  if (m.outcome === "duplicate") classification = "Duplicate";
  await update(req, "intake-messages", msg.id, {
    status,
    classification,
    match: {
      case: m.case ?? null,
      supplierRfq: m.supplierRfq ?? null,
      reference: m.reference,
      confidence: m.confidence,
      basis: m.basis.join("\n"),
      candidates: (m.candidates ?? []).map((c) => ({ case: c.case, confidence: c.confidence, reason: c.reason })),
    },
  });
  if (m.outcome === "linked" && m.supplierRfq && m.supplier && !m.newSupplier) {
    const rfq = await byId(req, "supplier-rfqs", m.supplierRfq);
    if (rfq && idOf(rfq.supplier) === m.supplier && !ANSWERED_RFQ.includes(str(rfq.status))) {
      const lines = await replyLines(req, rfq, m.supplier);
      await update(req, "intake-messages", msg.id, { offerDraft: lines });
      await saveOffers(req, rfq, m.supplier, lines);
      await update(req, "supplier-rfqs", rfq.id, {
        status: "Replied",
        lastEvent: `Reply matched by reference (subject “${str(msg.subject)}”) — reminders stopped`,
      });
    }
  }
}

/* ------------------------------------------------------------------ inbox: case creation */

async function createCaseFrom(req: Req, msg: Doc, input: Json) {
  const s = scenarioOf(msg);
  if (!s) throw Object.assign(new Error("Nothing extracted from this message yet."), { status: 400 });
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
    missing: l.flag,
    originalText: `${l.originalText} · source: ${l.source}`,
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
    nextAction: d.nextAction,
    blocker: flagged.length ? `Line ${flagged.map((l) => l.lineNo).join(", ")}: ${flagged[0].flag}` : undefined,
    stage: d.caseType === "service" ? "Customs clearance" : flagged.length ? "Validating" : "Sourcing",
    tone: d.urgent ? "warn" : "info",
    items,
    clarifications: flagged.length
      ? [
          {
            lineNo: flagged[0].lineNo,
            to: "Customer",
            via: str(msg.channel) === "WhatsApp" ? "WhatsApp" : "Email",
            question: s.missing.join(" · "),
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
  await update(req, "intake-messages", msg.id, {
    status: "Case created",
    createdCase: c.id,
    classification: d.caseType === "service" ? "Service request" : "New RFQ",
    ...(firstAck ? { acknowledgedAt: iso(DEMO_NOW.getTime()) } : {}),
  });
  const who = str((req.user as { name?: unknown } | null)?.name) || "a person";
  await logActivity(req, {
    case: c.id,
    kind: "human",
    text: `Created from the ${str(msg.channel).toLowerCase()} “${str(msg.subject)}” — ${items.length} AI-extracted line${items.length === 1 ? "" : "s"} checked and confirmed by ${who}.`,
  });
  await logActivity(req, {
    case: c.id,
    kind: "auto",
    text: firstAck
      ? `Acknowledgement sent once from the approved template “${x.acknowledgement.template}”.`
      : manual
        ? "Acknowledgement to be sent by the owner by hand (WhatsApp / phone source)."
        : "Already acknowledged earlier — no second acknowledgement.",
  });
  if (owner !== userId(req))
    await notify(
      req,
      owner,
      `New case ${str(c.caseId)} assigned to you`,
      `${x.customerName} · ${d.vessel} · quote due ${fmtDateTime(deadline)}`,
      `/collections/cases/${c.id}`,
      "Update",
    );
  return {
    case: { id: c.id, caseId: str(c.caseId) },
    acknowledged: firstAck,
    manualAck: manual,
    message: `Case ${str(c.caseId)} created · ${firstAck ? "acknowledgement sent once" : manual ? "acknowledge by hand" : "already acknowledged"}`,
  };
}

/* ------------------------------------------------------------------ inbox: list */

export interface InboxMessage {
  id: string;
  channel: string;
  mailbox: string;
  receivedAt: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
  files: { name: string; kind: string; note: string }[];
  classification: string;
  status: string;
  messageId: string;
  hasAI: boolean;
  extracted: boolean;
  createdCase?: { id: string; caseId: string };
  match?: {
    case?: { id: string; caseId: string };
    reference: string;
    confidence: number;
    basis: string[];
    candidates: MatchCandidate[];
    reviewedBy: string;
  };
  acknowledgedAt: string;
  simulated: boolean;
  /** How urgent it reads (1–5): a deadline today, "asap", a complaint or a cancellation, still waiting. */
  urgency: number;
}

/** Urgency from the message's own words and status (deterministic, for the "Most urgent first" sort). */
export function urgencyOf(m: Doc): number {
  const text = `${str(m.subject)}\n${str(m.body)}`;
  const status = str(m.status);
  let n = status === "Needs review" ? 3 : status === "New" ? 2 : 1;
  if (/\burgent|\basap\b|immediately|within 24\s*h|\btoday\b|tonight/i.test(text)) n += 2;
  if (/complain|cancel|\bstop\b|damaged|wrong (item|delivery)/i.test(text)) n += 2;
  return Math.min(5, n);
}

async function toInboxMessage(req: Req, m: Doc): Promise<InboxMessage> {
  const match = obj(m.match);
  const created = idOf(m.createdCase);
  const matchCase = idOf(match.case);
  const candidates: MatchCandidate[] = [];
  for (const c of list<Json>(match.candidates))
    candidates.push({
      case: str(idOf(c.case)),
      caseId: await caseIdOf(req, c.case),
      confidence: num(c.confidence),
      reason: str(c.reason),
    });
  // Older seeded review items name their candidates in the basis only.
  if (!candidates.length && str(m.status) === "Needs review")
    for (const caseId of new Set(str(match.basis).match(/GS-RFQ-\d{4}/g) ?? [])) {
      const [c] = await all(req, "cases", { caseId: { equals: caseId } });
      if (c)
        candidates.push({
          case: c.id,
          caseId,
          confidence: candidates.length ? 0.41 : 0.62,
          reason: "Named in the match notes",
        });
    }
  return {
    id: m.id,
    channel: str(m.channel),
    mailbox: str(m.mailbox),
    receivedAt: str(m.receivedAt),
    from: str(m.from),
    fromName: str(m.fromName),
    subject: str(m.subject),
    body: str(m.body),
    files: list<Json>(m.files).map((f) => ({ name: str(f.name), kind: str(f.kind), note: str(f.note) })),
    classification: str(m.classification),
    status: str(m.status),
    messageId: str(m.messageId),
    hasAI: Boolean(scenarioOf(m)),
    extracted: list(obj(m.extraction).header).length > 0,
    createdCase: created ? { id: created, caseId: await caseIdOf(req, created) } : undefined,
    match:
      Object.keys(match).length && (matchCase || match.basis)
        ? {
            case: matchCase ? { id: matchCase, caseId: await caseIdOf(req, matchCase) } : undefined,
            reference: str(match.reference),
            confidence: num(match.confidence),
            basis: str(match.basis).split("\n").filter(Boolean),
            candidates,
            reviewedBy: await userName(req, match.reviewedBy),
          }
        : undefined,
    acknowledgedAt: str(m.acknowledgedAt),
    simulated: str(m.messageId).startsWith("sim-"),
    urgency: urgencyOf(m),
  };
}

export interface InboxPayload {
  messages: InboxMessage[];
  connections: { kind: string; account: string; status: string }[];
  stats: { processedToday: number; duplicates: number; review: number; newCount: number };
}

/* ------------------------------------------------------------------ inbox history */

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
  const scanned = HISTORY_MAILBOXES.reduce((n, m) => n + m.emails, 0);
  const kept = scanned - HISTORY_DEDUP.reduce((n, d) => n + d.count, 0);
  const created: HistoryPayload["created"] = [];
  if (approved) {
    for (const s of HISTORY_SUPPLIERS.filter((x) => !x.known)) {
      const [doc] = await all(req, "suppliers", { name: { equals: s.name } });
      if (doc) created.push({ kind: "Supplier", name: s.name, href: `/collections/suppliers/${doc.id}` });
    }
    for (const c of [...HISTORY_CUSTOMERS.filter((x) => !x.known).map((x) => x.name), "Petro Delta"]) {
      const [doc] = await all(req, "customers", { name: { equals: c } });
      if (doc) created.push({ kind: "Customer", name: c, href: `/collections/customers/${doc.id}` });
    }
    for (const v of HISTORY_VESSELS.filter((x) => !x.known)) {
      const [doc] = await all(req, "vessels", { imo: { equals: v.imo } });
      if (doc)
        created.push({ kind: "Vessel", name: `${v.name} (IMO ${v.imo})`, href: `/collections/vessels/${doc.id}` });
    }
  }
  return {
    status,
    approved,
    approvedBy: await userName(req, imp.approvedBy),
    organised: msgs.length > 0,
    canApprove: role(req) === "management",
    canSeePrices: !isSales(req),
    mailboxes: HISTORY_MAILBOXES,
    perYear: HISTORY_PER_YEAR,
    scanned,
    dedup: HISTORY_DEDUP,
    kept,
    totals: HISTORY_TOTALS,
    customers: HISTORY_CUSTOMERS,
    vessels: HISTORY_VESSELS,
    suppliers: HISTORY_SUPPLIERS,
    prices: HISTORY_PRICES.map((p) => (isSales(req) ? { ...p, price: undefined } : p)),
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
  const decisions = new Map(
    (await historyMessages(req)).map((m) => [str(m.messageId).replace(/^history-/, ""), str(obj(m.history).decision)]),
  );
  const customerIds = new Map<string, string>();
  for (const c of HISTORY_CUSTOMERS.filter((x) => !x.known)) {
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
  for (const v of HISTORY_VESSELS.filter((x) => !x.known)) {
    const [found] = await all(req, "vessels", { imo: { equals: v.imo } });
    const customer = customerIds.get(v.fleet);
    if (!found && customer)
      await create(req, "vessels", {
        name: v.name,
        imo: v.imo,
        vesselType: "Reefer",
        customer,
        notes: `Found in inbox history: ${v.calls} calls (${v.ports}).`,
      });
  }
  for (const s of HISTORY_SUPPLIERS.filter((x) => !x.known)) {
    if (await supplierByName(req, s.name)) continue;
    await create(req, "suppliers", {
      name: s.name,
      city: s.city,
      categories: s.categories.startsWith("Paints") ? ["Paints"] : ["Deck stores"],
      emailDomain: s.domain,
      status: "New",
      kind: "local",
      source: `Inbox history import — quoted ${s.quoted} lines 2022–2025, never ordered`,
    });
  }
  const prices = [...HISTORY_PRICES];
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
    text: `Inbox history import approved by ${await userName(req, userId(req))}: ${HISTORY_TOTALS.customers} customers, ${HISTORY_TOTALS.vessels} vessels, ${HISTORY_TOTALS.suppliers} suppliers and ${HISTORY_TOTALS.prices.toLocaleString("en-US")} dated prices (${saved} sample prices written in the demo).`,
  });
}

/* ------------------------------------------------------------------ case supplier RFQs */

export interface RfqScheduleStep {
  label: string;
  at: string;
  state: "done" | "next" | "planned" | "skipped";
}

export interface CaseRfqRow {
  id: string;
  reference: string;
  supplier: { id: string; name: string; city: string; isNew: boolean; source: string };
  lineNos: number[];
  category: string;
  mode: string;
  sentAt: string;
  dueAt: string;
  status: string;
  reminders: number;
  nextReminderAt: string;
  escalated: boolean;
  lastEvent: string;
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

export interface CaseReply {
  id: string;
  subject: string;
  fromName: string;
  receivedAt: string;
  reference: string;
  confidence: number;
  basis: string[];
  status: string;
}

export interface CaseReview {
  id: string;
  subject: string;
  fromName: string;
  receivedAt: string;
  confidence: number;
  basis: string[];
  candidates: MatchCandidate[];
  uncertain: string[];
  kind: "match" | "new-supplier";
  caseId: string;
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
  replies: CaseReply[];
  review: CaseReview[];
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
  counts: { total: number; replied: number; waiting: number; closed: number; escalated: number };
  canSeeCosts: boolean;
  /** What the last "Simulate replies" brought in (`POST /case-rfqs/:id/simulate-replies`), for a while after. */
  arrivals: ReplyEvent[];
  /** The supplier RFQs drafted (`POST …/plan`) and not yet sent or discarded. */
  plan: RfqPlan | null;
}

/** The drafted supplier RFQs per case, kept until sent or discarded (`POST …/plan`). */
const plans = new Map<string, RfqPlan>();

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

function scheduleOf(r: Doc): RfqScheduleStep[] {
  const sent = Date.parse(str(r.sentAt));
  const reminders = num(r.reminders);
  const answered = ANSWERED_RFQ.includes(str(r.status));
  if (!sent)
    return answered
      ? [
          {
            label: `${str(r.status)} without an invitation — reply matched by reference`,
            at: str(r.updatedAt),
            state: "done",
          },
        ]
      : [{ label: "Draft — not sent", at: "", state: "planned" }];
  const steps: RfqScheduleStep[] = [{ label: "Sent", at: iso(sent), state: "done" }];
  REMINDER_HOURS.forEach((h, i) => {
    const state: RfqScheduleStep["state"] =
      reminders > i ? "done" : answered ? "skipped" : reminders === i ? "next" : "planned";
    steps.push({ label: `Reminder ${i + 1}`, at: iso(sent + h * HOUR), state });
  });
  steps.push({
    label: "Escalate to case owner",
    at: iso(sent + (REMINDER_HOURS[1] + 4) * HOUR),
    state: r.escalated ? "done" : answered ? "skipped" : "planned",
  });
  if (answered) steps.push({ label: `${str(r.status)} — reminders stopped`, at: str(r.updatedAt), state: "done" });
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
      supplier: {
        id: str(s?.id),
        name: str(s?.name) || "Supplier",
        city: str(s?.city),
        isNew: str(s?.status) === "New",
        source: str(s?.source),
      },
      lineNos: list<number>(r.lineNos),
      category: str(r.category),
      mode: str(r.mode),
      sentAt: str(r.sentAt),
      dueAt: str(r.dueAt),
      status: str(r.status),
      reminders: num(r.reminders),
      nextReminderAt: str(r.nextReminderAt),
      escalated: Boolean(r.escalated),
      lastEvent: str(r.lastEvent),
      schedule: scheduleOf(r),
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
      held: str(i.status) === "Clarification needed" ? str(i.missing) || "Needs clarification first" : "",
      offers: offers.filter((o) => num(o.lineNo) === n && !o.superseded).length,
      rfqs: rows.filter((r) => r.lineNos.includes(n)).map((r) => r.reference),
    };
  });
  const msgs = await all(
    req,
    "intake-messages",
    { classification: { in: ["Supplier reply", "Duplicate"] } },
    "-receivedAt",
  );
  const replies: CaseReply[] = [];
  const review: CaseReview[] = [];
  for (const m of msgs) {
    const im = await toInboxMessage(req, m);
    const onCase = im.match?.case?.id === caseDoc.id;
    const candidate = im.match?.candidates.some((c) => c.case === caseDoc.id);
    if (im.status === "Needs review" && (onCase || candidate)) {
      const drafts = list<Json>(m.offerDraft);
      review.push({
        id: m.id,
        subject: im.subject,
        fromName: im.fromName,
        receivedAt: im.receivedAt,
        confidence: im.match?.confidence ?? 0,
        basis: im.match?.basis ?? [],
        candidates: im.match?.candidates ?? [],
        uncertain: drafts.map((d) => str(d.uncertain)).filter(Boolean),
        kind: onCase ? "new-supplier" : "match",
        caseId: str(caseDoc.caseId),
      });
    } else if (onCase && im.classification === "Supplier reply")
      replies.push({
        id: m.id,
        subject: im.subject,
        fromName: im.fromName,
        receivedAt: im.receivedAt,
        reference: im.match?.reference ?? "",
        confidence: im.match?.confidence ?? 0,
        basis: im.match?.basis ?? [],
        status: im.status,
      });
  }
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
    replies,
    review,
    newSuppliers,
    counts: {
      total: rows.length,
      replied: rows.filter((r) => ["Replied", "Revised offer received"].includes(r.status)).length,
      waiting: rows.filter((r) => OPEN_RFQ.includes(r.status)).length,
      closed: rows.filter((r) => ["Declined", "No response"].includes(r.status)).length,
      escalated: rows.filter((r) => r.escalated).length,
    },
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
  const deadline = Date.parse(str(caseDoc.deadline)) || DEMO_NOW.getTime() + 2 * DAY;
  return iso(Math.max(DEMO_NOW.getTime() + 3 * HOUR, Math.min(DEMO_NOW.getTime() + DAY, deadline - 3 * HOUR)));
}

/** The anonymised email a supplier receives: no client, vessel, reference or customer files. */
export function rfqPreview(
  caseDoc: Doc,
  lines: Json[],
  reference: string,
  dueAt: string,
  supplier: Doc,
  sender: string,
): RfqDraft["preview"] {
  const body = [
    "Dear supplier,",
    "",
    `Please quote the following, delivered ${str(caseDoc.port) || "to port"} by ${fmtDate(caseDoc.eta) || "the date below"}:`,
    "",
    ...lines.map(
      (l, i) =>
        ` ${i + 1}. ${str(l.description)} — ${num(l.qty)} ${str(l.unit)}${l.exactBrand ? " (exact brand / part only)" : " (alternatives: state brand)"}${str(l.impa) ? ` · IMPA ${str(l.impa)}` : ""}${str(l.partNo) ? ` · part ${str(l.partNo)}` : ""}`,
    ),
    "",
    "For each line please state: unit price & currency, available quantity, pack size, lead time, delivery basis, freight, validity and payment terms — and attach SDS / TDS / certificates.",
    "",
    `Please keep our reference ${reference} in your reply.`,
    "",
    "Best regards,",
    `${sender} — Golden Sea for Trading & Marketing`,
  ].join("\n");
  return {
    to: str(supplier.contact) || `sales@${domainOf(supplier) || "supplier.example"}`,
    subject: `Request for quotation ${reference} — reply by ${fmtDateTime(dueAt)}`,
    body,
  };
}

async function planRfqs(req: Req, caseDoc: Doc, mode: "split" | "full", only?: number[]): Promise<RfqPlan> {
  const suppliers = await all(req, "suppliers");
  const existing = await all(req, "supplier-rfqs", { case: { equals: caseDoc.id } });
  const asked = (sid: string, n: number) =>
    existing.some((r) => idOf(r.supplier) === sid && list<number>(r.lineNos).includes(n) && str(r.status) !== "Draft");
  const items = list<Json>(caseDoc.items).filter((i) => !only?.length || only.includes(num(i.lineNo)));
  const held = items
    .filter((i) => str(i.status) === "Clarification needed")
    .map((i) => ({ lineNo: num(i.lineNo), reason: str(i.missing) || "Needs clarification first" }));
  const sendable = items.filter((i) => str(i.status) !== "Clarification needed");
  const bySupplier = new Map<string, { s: Doc; lines: Json[]; cats: Set<string> }>();
  const skipped: string[] = [];
  const add = (s: Doc, item: Json, cat: string) => {
    if (asked(s.id, num(item.lineNo))) {
      skipped.push(`L${num(item.lineNo)} already asked of ${str(s.name)}`);
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
          ? "General chandler — receives the full list"
          : list<string>(e.s.categories).some((c) => e.cats.has(c))
            ? `Specialist in ${category}`
            : "No specialist on file — general chandler",
      preview: rfqPreview(caseDoc, e.lines, reference, dueAt, e.s, sender),
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
  await update(req, "supplier-rfqs", rfq.id, {
    reminders,
    status: escalate && num(rfq.reminders) >= ESCALATE_AFTER ? "No response" : "Awaiting reply",
    escalated: escalate || Boolean(rfq.escalated),
    nextReminderAt: escalate ? null : iso(DEMO_NOW.getTime() + DAY),
    lastEvent: escalate
      ? `Reminder ${reminders} sent — no reply after ${ESCALATE_AFTER} reminders, escalated to the case owner`
      : `Reminder ${reminders} sent (approved template, client hidden) · next in 24 h`,
  });
  if (escalate && !rfq.escalated) {
    await logActivity(req, {
      case: idOf(rfq.case),
      kind: "alert",
      text: `${str(rfq.reference)}: ${str(supplier?.name)} silent after ${ESCALATE_AFTER} reminders — escalated to the owner.`,
    });
    await notify(
      req,
      idOf(c?.owner),
      `${str(supplier?.name)} hasn't replied to ${str(rfq.reference)}`,
      `${ESCALATE_AFTER} reminders sent · ${str(c?.caseId)} quote due ${fmtDateTime(c?.deadline)} — call them or source elsewhere`,
      `/collections/cases/${str(idOf(rfq.case))}/rfqs`,
      "Alert",
    );
  }
  return {
    reference: str(rfq.reference),
    supplier: str(supplier?.name),
    subject: "",
    outcome: escalate ? "Escalated" : "Reminder sent",
    detail: escalate ? `Escalated to ${await userName(req, c?.owner)}` : `Reminder ${reminders} sent`,
  };
}

async function replyMessage(req: Req, data: Json) {
  const [existing] = await all(req, "intake-messages", { messageId: { equals: data.messageId } });
  return existing ?? create(req, "intake-messages", data);
}

export async function simulateReplies(req: Req, caseDoc: Doc): Promise<ReplyEvent[]> {
  const onCase = await all(req, "supplier-rfqs", { case: { equals: caseDoc.id } }, "reference");
  const rfqs = onCase.filter((r) => ["Sent", "Awaiting reply"].includes(str(r.status)));
  const events: ReplyEvent[] = [];
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
          basis: `Reference ${str(r.reference)} in the subject\nSender domain ${domain} = ${name}`,
        },
      });
      await update(req, "supplier-rfqs", r.id, {
        status: "Declined",
        lastEvent: "Declined by email — reminders stopped",
      });
      events.push({
        reference: str(r.reference),
        supplier: name,
        subject: "RE: Request for quotation",
        outcome: "Declined",
        detail: "Cannot supply — reminders stopped",
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
          `Reference ${str(r.reference)} found in the ${pattern === 0 ? "body" : "subject"}`,
          pattern === 0
            ? `Subject changed (“${subject}”) — matched by reference, not by subject`
            : "Thread subject kept",
          `Sender domain ${domain} = ${name}`,
        ].join("\n"),
      },
    });
    await saveOffers(req, r, sid, lines);
    await update(req, "supplier-rfqs", r.id, {
      status: "Replied",
      lastEvent: `Offer received${pattern === 0 ? ` (subject “${subject}”)` : ""} — matched by reference, reminders stopped`,
    });
    events.push({
      reference: str(r.reference),
      supplier: name,
      subject,
      outcome: "Replied",
      detail: `${lines.length} line${lines.length > 1 ? "s" : ""} offered${pattern === 0 ? " · subject changed, matched by reference" : ""}`,
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
      source: `Auto-created from an email reply to ${str(firstOpen.reference)} (${fmtDate(iso(t))}) — quoted, never ordered`,
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
        lastEvent: `Not invited — replied to ${str(firstOpen.reference)} forwarded to them; supplier created automatically`,
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
            ? `Quoted “${price} LE” — read as per kg, converted to ${(price * l.packSize).toLocaleString("en-US")} per ${l.packSize} kg pack. Confirm the unit.`
            : `New supplier: confirm the offered item matches line ${l.lineNo}.`,
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
            `Reference ${reference} found in the body`,
            "Subject changed (“price offer”) — matched by reference, not by subject",
            `Sender ${NEW_SUPPLIER.emailDomain} is not in the supplier list — new supplier ${fresh ? "created" : "already saved"} automatically`,
            "Price unit unclear — a person confirms",
          ].join("\n"),
        },
      });
      await saveOffers(req, ownRfq, s.id, lines);
      events.push({
        reference,
        supplier: NEW_SUPPLIER.name,
        subject: "price offer",
        outcome: "New supplier saved",
        detail: "Not in the database: supplier created, dated price stored with validity — unit to confirm",
      });
      await logActivity(req, {
        case: caseDoc.id,
        kind: "auto",
        text: `New supplier ${NEW_SUPPLIER.name} replied to ${reference} — supplier and dated price saved automatically; unit waits for a person.`,
      });
    }
  }
  return events;
}

/* ------------------------------------------------------------------ endpoints */

const guard = (handler: (req: Req) => Promise<Response>) => async (req: Req) => {
  if (!req.user) return fail(401, "You are not allowed to perform this action.");
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
  const messages = await Promise.all(docs.map((m) => toInboxMessage(req, m)));
  const integrations = obj(await req.payload.findGlobal({ slug: "integrations" as never, req }));
  const connections = list<Json>(integrations.connections)
    .filter((c) => /mailbox|Website/.test(str(c.kind)))
    .map((c) => ({ kind: str(c.kind), account: str(c.account), status: str(c.status) }));
  connections.push({ kind: "WhatsApp", account: "forwarded by staff", status: "Manual" });
  return {
    messages,
    connections,
    stats: {
      processedToday: 14 + messages.filter((m) => m.simulated).length,
      duplicates: 2 + messages.filter((m) => m.classification === "Duplicate").length,
      review: messages.filter((m) => m.status === "Needs review").length,
      newCount: messages.filter((m) => m.status === "New").length,
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
  return {
    message: await toInboxMessage(req, doc),
    rfq,
    extraction: rfq && read ? await extraction(req, doc) : null,
  };
}

async function messageOr404(req: Req) {
  const msg = await byId(req, "intake-messages", str(req.routeParams?.id));
  if (!msg) throw Object.assign(new Error("Message not found."), { status: 404 });
  return msg;
}

export async function caseOr404(req: Req) {
  const c = await byId(req, "cases", str(req.routeParams?.id));
  if (!c) throw Object.assign(new Error("Case not found."), { status: 404 });
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
      const m = await matchMessage(req, msg);
      if (m.outcome === "duplicate") {
        await applyMatch(req, msg, m);
        return json({
          kind: "duplicate",
          match: m,
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
      const m = await matchMessage(req, msg);
      await applyMatch(req, msg, m);
      const pct = `${Math.round(m.confidence * 100)}%`;
      const message =
        m.outcome === "linked"
          ? `Matched to ${m.caseId} by ${m.reference} (${pct})`
          : m.outcome === "duplicate"
            ? `Duplicate — ${m.caseId ? `already linked to ${m.caseId}` : "kept with the original"}`
            : "Uncertain — sent to the review queue";
      return json({ match: m, doc: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!), message });
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
          message: `Case ${caseId} was already created from this message`,
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
      if (decision === "not-related") {
        await update(req, "intake-messages", msg.id, {
          status: "Ignored",
          match: { ...match, reviewedBy: userId(req), reviewedAt: iso(DEMO_NOW.getTime()) },
        });
        return json({ message: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!) });
      }
      const caseId = str(input.case) || str(idOf(match.case));
      const c = caseId ? await byId(req, "cases", caseId) : null;
      if (!c) return fail(400, "Pick the case this message belongs to.");
      await update(req, "intake-messages", msg.id, {
        status: "Linked",
        match: { ...match, case: c.id, reviewedBy: userId(req), reviewedAt: iso(DEMO_NOW.getTime()) },
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
          await update(req, "supplier-rfqs", rfq.id, { status: "Replied", lastEvent: "Reply linked after review" });
      }
      const who = await userName(req, userId(req));
      await logActivity(req, {
        case: c.id,
        kind: "human",
        text: `“${str(msg.subject)}” from ${str(msg.fromName)} linked by ${who} after review${list(msg.offerDraft).length ? " — offer confirmed" : ""}.`,
      });
      return json({ message: await toInboxMessage(req, (await byId(req, "intake-messages", msg.id))!) });
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
      for (const u of HISTORY_UNCERTAIN) {
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
          history: { kind: u.kind, question: u.question, proposal: u.proposal, confidence: u.confidence },
        });
      }
      if (!existing.length)
        await notify(
          req,
          "kb",
          "Inbox history ready for your approval",
          `${HISTORY_TOTALS.customers} customers, ${HISTORY_TOTALS.vessels} vessels, ${HISTORY_TOTALS.suppliers} suppliers, ${HISTORY_TOTALS.prices.toLocaleString("en-US")} dated prices · ${HISTORY_UNCERTAIN.length} uncertain items to review`,
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
      if (str(msg.source) !== "History import") return fail(400, "Not a history item.");
      const decision = str((await body(req)).decision) === "reject" ? "Rejected" : "Confirmed";
      await update(req, "intake-messages", msg.id, {
        status: decision === "Confirmed" ? "Linked" : "Ignored",
        history: { ...obj(msg.history), decision },
        match: { ...obj(msg.match), reviewedBy: userId(req), reviewedAt: iso(DEMO_NOW.getTime()) },
      });
      return json(await historyPayload(req));
    }),
  },
  {
    // Management only: nothing from the history is saved before this approval.
    path: "/inbox-history/approve",
    method: "post",
    handler: guard(async (req) => {
      if (role(req) !== "management")
        return fail(403, "Only management (Karim Balbaa) can approve the history import.");
      const p = await historyPayload(req);
      if (!p.organised) return fail(400, "Organise the history first.");
      if (p.pending) return fail(400, `${p.pending} uncertain item${p.pending > 1 ? "s" : ""} still need a decision.`);
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
      if (Array.isArray(input.lineNos) && !only.length) return fail(400, "Pick at least one line.");
      const plan = await planRfqs(req, c, mode, only);
      if (plan.drafts.length) plans.set(c.id, plan);
      else plans.delete(c.id);
      const n = plan.drafts.length;
      const message = n
        ? `${n} RFQ draft${n === 1 ? "" : "s"} ready — check them before sending`
        : plan.held.length && !plan.skipped.length
          ? `Held back until clarified: ${plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ")}`
          : "Nothing new to send — every picked line was already asked of these suppliers";
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
      if (!plan?.drafts.some((d) => d.reference === reference)) return fail(404, "That draft is no longer there.");
      const drafts = plan.drafts.filter((d) => d.reference !== reference);
      if (drafts.length) plans.set(c.id, { ...plan, drafts });
      else plans.delete(c.id);
      return json({ plan: plans.get(c.id) ?? null });
    }),
  },
  {
    // Throw the drafts away; nothing was sent.
    path: "/sourcing/cases/:id/plan/discard",
    method: "post",
    handler: guard(async (req) => {
      const c = await caseOr404(req);
      plans.delete(c.id);
      return json({ plan: null });
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
      if (!drafts.length) return fail(400, "Nothing to send — draft the RFQs first.");
      const mode = str(input.mode || (given.length ? "" : kept?.mode)) === "full" ? "Full list" : "Split by category";
      const due = str(input.dueAt) || (given.length ? "" : str(kept?.dueAt)) || rfqDueAt(c);
      const sentAt = DEMO_NOW.getTime() + 5 * 60_000;
      const sent: Doc[] = [];
      for (const d of drafts) {
        const lineNos = list<number>(d.lineNos).map(num).filter(Boolean);
        if (!lineNos.length || !str(d.supplier)) continue;
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
            lastEvent: "Sent (client identity removed) · reminder 1 scheduled",
            anonymised: true,
            sentBy: userId(req),
            mode,
            category: str(d.category),
          }),
        );
      }
      plans.delete(c.id);
      if (["New", "Validating", "Sourcing"].includes(str(c.stage)))
        await update(req, "cases", c.id, { stage: "Awaiting supplier", wait: "Awaiting supplier" });
      await logActivity(req, {
        case: c.id,
        kind: "human",
        text: `${sent.length} supplier RFQ${sent.length === 1 ? "" : "s"} sent by ${await userName(req, userId(req))} (${mode.toLowerCase()}, client identity removed): ${sent.map((r) => str(r.reference)).join(", ")}.`,
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
      if (!events.length) return fail(400, "No supplier RFQs are waiting for a reply — send RFQs first");
      arrivals.set(c.id, { at: Date.now(), events });
      return json({ events });
    }),
  },
  {
    path: "/sourcing/rfqs/:id/remind",
    method: "post",
    handler: guard(async (req) => {
      const r = await byId(req, "supplier-rfqs", str(req.routeParams?.id));
      if (!r) return fail(404, "Supplier RFQ not found.");
      if (!OPEN_RFQ.includes(str(r.status))) return fail(400, "Reminders stop once a supplier has answered.");
      return json({ event: await remind(req, r) });
    }),
  },
];
