import type { Access, CollectionConfig, Field, PayloadRequest } from "payload";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";

/** Shared vocabulary and access rules for the sourcing-desk data model. */

/** A text people read, in each language (Payload's `{ en, ar }`), or one string. */
export type Words = string | { en: string; ar: string };

/**
 * Select options from their values: each labelled in English (the value itself) and in Arabic
 * (`ar`, keyed by value). Throws for a value with no Arabic, so a list is never half translated.
 */
export const choices = (values: readonly string[], ar: Record<string, string>) =>
  values.map((value) => {
    if (!ar[value]) throw new Error(`choices: no Arabic label for "${value}"`);
    return { value, label: { en: value, ar: ar[value] } };
  });

/**
 * Payload's `{ en, ar }` where a type still says `string`: Payload's select, relationship and
 * date placeholders, and the contracts' action, navigation and view words. The object is passed
 * unchanged: the dashboard reads it in the page's language as it starts (`localizeConfig`) and
 * `fieldProblems` checks both languages.
 */
export const words = (text: { en: string; ar: string }): string => text as unknown as string;

/** A string, or `{ en, ar }` passed as one (`words`). */
export const asText = (text: Words): string => (typeof text === "string" ? text : words(text));

/** Of a text in each language, the one the request reads in (Payload's `req.locale`, else English). */
export const inLanguage = (req: { locale?: unknown } | undefined, words: { en: string; ar: string }): string =>
  req?.locale === "ar" ? words.ar : words.en;

/** The roles, labelled in English (what endpoints show); `ROLE_OPTIONS` labels them in both languages. */
export const ROLES = [
  { label: "Supply chain & customer service", value: "supply-chain" },
  { label: "Management approver", value: "management" },
  { label: "Sales", value: "sales" },
  { label: "Operations & finance", value: "operations" },
  { label: "Financial director", value: "finance-director" },
  { label: "Office admin", value: "office-admin" },
];
export type Role = (typeof ROLES)[number]["value"];
const ROLE_AR: Record<string, string> = {
  "supply-chain": "سلسلة التوريد وخدمة العملاء",
  management: "معتمد الإدارة",
  sales: "المبيعات",
  operations: "العمليات والمالية",
  "finance-director": "المدير المالي",
  "office-admin": "إدارة المكتب",
};
/** The roles as select options, labelled in English and Arabic. */
export const ROLE_OPTIONS = ROLES.map((r) => ({ value: r.value, label: { en: r.label, ar: ROLE_AR[r.value]! } }));

export const CURRENCIES = ["EGP", "USD", "EUR"];
export const PORTS = ["Port Said", "Suez", "Damietta", "Alexandria", "Abu Qir", "Dekheila", "Offshore"];
export const PORT_OPTIONS = choices(PORTS, {
  "Port Said": "بورسعيد",
  Suez: "السويس",
  Damietta: "دمياط",
  Alexandria: "الإسكندرية",
  "Abu Qir": "أبو قير",
  Dekheila: "الدخيلة",
  Offshore: "أوفشور",
});
export const WAREHOUSES = ["Cairo (6th October)", "Alexandria"];
export const WAREHOUSE_OPTIONS = choices(WAREHOUSES, {
  "Cairo (6th October)": "القاهرة (6 أكتوبر)",
  Alexandria: "الإسكندرية",
});

/** Golden Sea's stores (product categories) plus the older sourcing categories used by existing records. */
export const STORES = [
  "Engine stores",
  "Deck stores",
  "Cabin stores",
  "Electrical stores",
  "Safety stores",
  "Medicine stores",
  "Stationery stores",
  "Provision stores",
  "Bond stores",
];
export const STORE_OPTIONS = choices(STORES, {
  "Engine stores": "مستلزمات المحركات",
  "Deck stores": "مستلزمات سطح السفينة",
  "Cabin stores": "مستلزمات الكبائن",
  "Electrical stores": "المستلزمات الكهربائية",
  "Safety stores": "مستلزمات السلامة",
  "Medicine stores": "الأدوية",
  "Stationery stores": "القرطاسية",
  "Provision stores": "المؤن",
  "Bond stores": "مستلزمات الإيداع الجمركي",
});

export const UNITS = ["pcs", "EA", "kg", "ltr", "L", "m", "set", "roll", "pack", "can", "drum", "carton"];
export const UNIT_OPTIONS = choices(UNITS, {
  pcs: "قطعة",
  EA: "وحدة (EA)",
  kg: "كجم",
  ltr: "لتر",
  L: "لتر (L)",
  m: "م",
  set: "طقم",
  roll: "لفة",
  pack: "عبوة",
  can: "علبة",
  drum: "برميل",
  carton: "كرتونة",
});

export const CASE_TYPES = [
  { label: { en: "Stores / provisions RFQ", ar: "طلب عرض مستلزمات / مؤن" }, value: "rfq" },
  { label: { en: "Spare-parts clearance", ar: "تخليص قطع غيار" }, value: "service" },
  { label: { en: "Held stores", ar: "مستلزمات محتجزة" }, value: "held" },
];

export const SUPPLIER_RFQ_STATUSES = [
  "Draft",
  "Sent",
  "Awaiting reply",
  "Partial reply",
  "Clarification needed",
  "Replied",
  "Revised offer received",
  "Declined",
  "No response",
];
export const SUPPLIER_RFQ_STATUS_OPTIONS = choices(SUPPLIER_RFQ_STATUSES, {
  Draft: "مسودة",
  Sent: "مُرسل",
  "Awaiting reply": "بانتظار الرد",
  "Partial reply": "رد جزئي",
  "Clarification needed": "يحتاج توضيحًا",
  Replied: "تم الرد",
  "Revised offer received": "وصل عرض معدّل",
  Declined: "اعتذر",
  "No response": "لا استجابة",
});

export const QUOTE_DECISIONS = [
  "Quotation prepared",
  "Awaiting management approval",
  "Submitted",
  "Awaiting customer decision",
  "Revision requested",
  "Won",
  "Lost",
  "Expired",
  "On hold",
];
/** The quotation decisions and "Partially won" (a case's customer decision), in both languages. */
export const QUOTE_DECISION_OPTIONS = choices([...QUOTE_DECISIONS, "Partially won"], {
  "Quotation prepared": "أُعدّ عرض السعر",
  "Awaiting management approval": "بانتظار موافقة الإدارة",
  Submitted: "مقدَّم",
  "Awaiting customer decision": "بانتظار قرار العميل",
  "Revision requested": "طُلبت مراجعة",
  Won: "فوز",
  Lost: "خسارة",
  Expired: "منتهي",
  "On hold": "معلّق",
  "Partially won": "فوز جزئي",
});

/** The contact rules, labelled in English (what endpoints show); `CONTACT_RULE_OPTIONS` labels them in both languages. */
export const CONTACT_RULES = [
  { label: "Follow-ups allowed", value: "allowed" },
  { label: "Max one follow-up per quotation", value: "one-follow-up" },
  { label: "Do not chase — internal reminders only", value: "do-not-chase" },
];
const CONTACT_RULE_AR: Record<string, string> = {
  allowed: "المتابعات مسموحة",
  "one-follow-up": "متابعة واحدة كحد أقصى لكل عرض سعر",
  "do-not-chase": "عدم المتابعة — تذكيرات داخلية فقط",
};
export const CONTACT_RULE_OPTIONS = CONTACT_RULES.map((r) => ({
  value: r.value,
  label: { en: r.label, ar: CONTACT_RULE_AR[r.value]! },
}));

/* ---------------------------------------------------------------- access */

type User = { id?: string; role?: string } | null | undefined;
const role = (req: PayloadRequest): string | undefined => (req.user as User)?.role;

export const loggedIn: Access = ({ req }) => Boolean(req.user);
export const anyone: Access = () => true;
export const hasRole =
  (...roles: Role[]): Access =>
  ({ req }) =>
    roles.includes(role(req) as Role);
export const management = hasRole("management");
/** Field-level variant (field access must return a boolean). */
export const isManagement = ({ req }: { req: PayloadRequest }) => role(req) === "management";
export const finance = hasRole("management", "finance-director", "operations");

/** Readable by anyone (the mock pages work without logging in); writable by logged-in users; deleted by management. */
export const deskAccess: CollectionConfig["access"] = {
  read: anyone,
  create: loggedIn,
  update: loggedIn,
  delete: management,
};

/** Money records: everyone logged in reads, finance roles write, management deletes. */
export const financeAccess: CollectionConfig["access"] = {
  read: loggedIn,
  create: finance,
  update: finance,
  delete: management,
};

/** Field-level: costs & margins hidden from sales (as in the demo's "Viewing as Soaad Amer"). */
export const costVisible = ({ req }: { req: PayloadRequest }) => Boolean(req.user) && role(req) !== "sales";

/* ---------------------------------------------------------------- the demo's clock */

/** The day the demo's records are set on (a Tuesday morning): what "today" and "overdue" count from. */
export const TODAY = demoToday();

/** The demo's fixed clock: the seed's dates are written against this morning. */
function demoToday(): Date {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return new Date("2026-11-17T09:30:00.000Z");
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      'TODAY is the demo\'s fixed clock (17 Nov 2026 09:30 UTC): "today", "overdue" and $today in widget queries need the real clock, and the data\'s dates real ones',
    );
  }
}
export const DAY = 86_400_000;
/** Whole days from `iso` to today: positive once it's past, negative before. */
export const daysSince = (iso: unknown) =>
  typeof iso === "string" && iso ? Math.floor((TODAY.getTime() - new Date(iso).getTime()) / DAY) : 0;

/* ---------------------------------------------------------------- computed fields */

/**
 * A field computed whenever the document is read and never stored (Payload's `virtual`): the
 * business logic lives with the collection, so every screen that shows its documents shows the
 * same value. Read-only in the form. A query can't filter on it (a widget filters on it with
 * `keep`).
 */
export const computed = <F extends Field>(
  field: F,
  compute: (doc: Record<string, unknown>, req: PayloadRequest) => unknown,
): F =>
  ({
    ...field,
    virtual: true,
    admin: { readOnly: true, ...(field as { admin?: object }).admin },
    hooks: {
      afterRead: [({ data, req }: { data: Record<string, unknown>; req: PayloadRequest }) => compute(data, req)],
    },
  }) as F;

/** EGP per unit of each currency (the active rates), read once per request. */
export async function fxRates(req: PayloadRequest): Promise<Record<string, number>> {
  const ctx = (req.context ??= {}) as { fx?: Promise<Record<string, number>> };
  ctx.fx ??= (async () => {
    const out: Record<string, number> = { EGP: 1, ...fallbackRates() };
    try {
      const g = (await req.payload.findGlobal({
        locale: req.locale,
        slug: "fx-rates" as never,
        depth: 0,
      } as never)) as {
        rates?: { currency?: string; egpPerUnit?: number; status?: string }[];
      };
      for (const r of g.rates ?? [])
        if (r.status === "Active" && r.currency) out[r.currency] = Number(r.egpPerUnit) || 1;
    } catch {
      // No rates yet: the defaults.
    }
    return out;
  })();
  return ctx.fx;
}

/** The rates used for a currency with no active approved rate. */
function fallbackRates(): Record<string, number> {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return { USD: 48.6, EUR: 52.9 };
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "fxRates falls back to fixed USD/EGP 48.6 and EUR/EGP 52.9: a currency with no active approved rate needs a decided behaviour (refuse, or ask finance), not a hard-coded rate",
    );
  }
}

/** A related document, populated or by id (read as the request's user). */
export async function related(
  req: PayloadRequest,
  collection: string,
  v: unknown,
): Promise<Record<string, unknown> | null> {
  if (v && typeof v === "object") return v as Record<string, unknown>;
  if (typeof v !== "string" || !v) return null;
  try {
    return (await req.payload.findByID({ collection: collection as never, id: v, depth: 0, req } as never)) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- reusable fields */

/** What a reusable field tells the person filling it in (its hint and placeholder), when not the default. */
export interface FieldWords {
  hint?: Words;
  placeholder?: Words;
}

/** An amount and its currency, side by side; `words` for the amount (the currency's are fixed). */
export const money = (name: string, label?: Words, extra: Partial<Field> = {}, words: FieldWords = {}): Field =>
  ({
    type: "row",
    fields: [
      {
        name,
        type: "number",
        label: label ?? name,
        min: 0,
        admin: {
          description: words.hint ?? {
            en: "The amount, before VAT; its currency is beside it.",
            ar: "المبلغ قبل ضريبة القيمة المضافة؛ وعملته بجانبه.",
          },
          placeholder: words.placeholder ?? { en: "e.g. 12,500", ar: "مثال: 12,500" },
        },
      },
      {
        name: `${name}Currency`,
        type: "select",
        label: { en: "Currency", ar: "العملة" },
        options: CURRENCIES,
        defaultValue: "EGP",
        admin: {
          description: { en: "The currency the amount is in.", ar: "العملة التي بها المبلغ." },
          placeholder: { en: "EGP", ar: "EGP" },
        },
      },
    ],
    ...extra,
  }) as Field;

export const evidence = (
  name = "evidence",
  label: Words = { en: "Evidence", ar: "الإثبات" },
  words: FieldWords = {},
): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
  admin: {
    description: words.hint ?? {
      en: "A photo, scan or PDF that backs this up.",
      ar: "صورة أو مسح ضوئي أو ملف PDF يثبت ذلك.",
    },
  },
});

export const caseRef = (required = true, text: FieldWords = {}): Field => ({
  name: "case",
  type: "relationship",
  label: { en: "Case", ar: "الملف" },
  relationTo: "cases",
  required,
  index: true,
  admin: {
    description: text.hint ?? { en: "The customer case this belongs to.", ar: "ملف العميل الذي يتبعه هذا." },
    // Payload types a relationship's placeholder as a string.
    placeholder: asText(text.placeholder ?? { en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
  },
});

/** `GS-XXX-0001`-style numbering for a collection's reference field. */
export const autoNumber =
  (collection: string, field: string, prefix: string) =>
  async ({ data, operation, req }: { data?: Record<string, unknown>; operation: string; req: PayloadRequest }) => {
    if (operation !== "create" || !data || data[field]) return data;
    const { docs } = await req.payload.find({
      locale: req.locale,
      collection: collection as never,
      limit: 0,
      depth: 0,
    });
    // The running number is what follows the prefix (`INV/2026/0412` → 412), not every digit.
    const last = Math.max(
      0,
      ...docs.map((d) => {
        const v = scalar((d as Record<string, unknown>)[field]);
        return v.startsWith(prefix) ? Number(/\d+/.exec(v.slice(prefix.length))?.[0] ?? 0) : 0;
      }),
    );
    return { ...data, [field]: `${prefix}${String(last + 1).padStart(4, "0")}` };
  };

/**
 * Records an activity on the related case (the demo's case timeline / audit log). Its `text` is
 * localized: a string is written as the English text, `{ en, ar }` in both languages.
 */
export async function logActivity(
  req: PayloadRequest,
  entry: { case?: string | null; kind?: "auto" | "human" | "alert"; text: Words; entity?: string },
) {
  try {
    await req.payload.create({
      collection: "activities" as never,
      locale: typeof entry.text === "string" ? "en" : "all",
      data: {
        case: entry.case ?? undefined,
        kind: entry.kind ?? (req.user ? "human" : "auto"),
        text: entry.text,
        entity: entry.entity,
        actor: (req.user as User)?.id ?? undefined,
        at: new Date().toISOString(),
      } as never,
      req,
    });
  } catch {
    /* activity logging never blocks the main write */
  }
}

/**
 * Logs one AI call in the AI log (`ai-calls`): every call the platform makes is on record, with
 * how sure it was. The demo's AI is a deterministic stub, and says so in `model`. Never blocks the
 * call it logs.
 */
export async function logAiCall(
  req: PayloadRequest,
  entry: {
    task: string;
    subject: string;
    case?: string | null;
    confidence?: number;
    values?: number;
    outcome?: string;
  },
) {
  try {
    await req.payload.create({
      collection: "ai-calls" as never,
      // The subject is localized; the endpoints write it in English.
      locale: "en",
      data: {
        at: new Date().toISOString(),
        task: entry.task,
        subject: entry.subject.slice(0, 200),
        case: entry.case ?? undefined,
        confidence: entry.confidence,
        values: entry.values,
        seconds: aiCallSeconds(),
        model: aiModel(),
        outcome: entry.outcome ?? "Applied automatically",
      } as never,
      req,
    });
  } catch {
    /* logging never blocks the call it logs */
  }
}

/** The model and version that answered an AI call, as the AI log records it. */
function aiModel(): string {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return "Demo stub (no live AI)";
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError("AI model: logAiCall records the model and version the real AI call answered with");
  }
}

/** How long an AI call took, as the AI log records it. */
function aiCallSeconds(): number {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return 0.4;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError("logAiCall records a fixed 0.4 s: the caller should pass the call's measured duration");
  }
}

/** A string or number as text; anything else (objects, null) as "". */
export const scalar = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

/** The id of a relationship value, populated (`{ id }`) or not. */
export const idOf = (v: unknown): string | undefined =>
  (v && typeof v === "object" ? scalar((v as { id?: unknown }).id) : scalar(v)) || undefined;

/** A business-rule violation: HTTP 400 like Payload's `APIError(message, 400)` (kept import-free for the browser). */
export const ruleError = (message: string) => Object.assign(new Error(message), { status: 400, name: "APIError" });
