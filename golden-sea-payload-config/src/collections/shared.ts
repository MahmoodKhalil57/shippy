import type { Access, CollectionConfig, Field, PayloadRequest } from "payload";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";

export type Words = string | { en: string; ar: string };

export const choices = (values: readonly string[], ar: Record<string, string>) =>
  values.map((value) => {
    if (!ar[value]) throw new Error(`choices: no Arabic label for "${value}"`);
    return { value, label: { en: value, ar: ar[value] } };
  });

export const words = (text: { en: string; ar: string }): string => text as unknown as string;

export const asText = (text: Words): string => (typeof text === "string" ? text : words(text));

export const inLanguage = (req: { locale?: unknown } | undefined, words: { en: string; ar: string }): string =>
  req?.locale === "ar" ? words.ar : words.en;

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
  "Escalated",
  "Replied",
  "Revised offer received",
  "Declined",
  "No response",
];
export const WAITING_RFQ_STATUSES = ["Sent", "Awaiting reply", "Escalated"];
export const AWAITING_REPLY_STATUSES = ["Awaiting reply", "Escalated"];
export const UNANSWERED_RFQ_STATUSES = [...WAITING_RFQ_STATUSES, "No response"];
export const OPEN_RFQ_STATUSES = [...WAITING_RFQ_STATUSES, "Partial reply", "Clarification needed"];
export const OUTSTANDING_RFQ_STATUSES = [...OPEN_RFQ_STATUSES, "No response"];
export const SUPPLIER_RFQ_STATUS_OPTIONS = choices(SUPPLIER_RFQ_STATUSES, {
  Draft: "مسودة",
  Sent: "مُرسل",
  "Awaiting reply": "بانتظار الرد",
  "Partial reply": "رد جزئي",
  "Clarification needed": "يحتاج توضيحًا",
  Escalated: "مُصعَّد",
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

type User = { id?: string; role?: string } | null | undefined;
const role = (req: PayloadRequest): string | undefined => (req.user as User)?.role;

export const loggedIn: Access = ({ req }) => Boolean(req.user);
export const anyone: Access = () => true;
export const hasRole =
  (...roles: Role[]): Access =>
  ({ req }) =>
    roles.includes(role(req) as Role);
export const management = hasRole("management");
export const isManagement = ({ req }: { req: PayloadRequest }) => role(req) === "management";
export const finance = hasRole("management", "finance-director", "operations");

export const deskAccess: CollectionConfig["access"] = {
  read: anyone,
  create: loggedIn,
  update: loggedIn,
  delete: management,
};

export const financeAccess: CollectionConfig["access"] = {
  read: loggedIn,
  create: finance,
  update: finance,
  delete: management,
};

export const costVisible = ({ req }: { req: PayloadRequest }) => Boolean(req.user) && role(req) !== "sales";

export const TODAY = demoToday();

function demoToday(): Date {
  if (IS_TEMP_MOCK) {
    return new Date("2026-11-17T09:30:00.000Z");
  } else {
    throw new TempMockError(
      'TODAY is the demo\'s fixed clock (17 Nov 2026 09:30 UTC): "today", "overdue" and $today in widget queries need the real clock, and the data\'s dates real ones',
    );
  }
}
export const DAY = 86_400_000;
export const daysSince = (iso: unknown) =>
  typeof iso === "string" && iso ? Math.floor((TODAY.getTime() - new Date(iso).getTime()) / DAY) : 0;

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

export interface FxRate {
  currency?: string;
  egpPerUnit?: number;
  date?: string;
  status?: string;
}

export const activeRate = <R extends FxRate>(rates: R[] | undefined, currency: string): R | undefined =>
  (rates ?? [])
    .filter((r) => r.currency === currency && r.status === "Active")
    .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")))[0];

export const activeRates = (rates: FxRate[] | undefined): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const currency of new Set((rates ?? []).map((r) => r.currency).filter((c): c is string => Boolean(c)))) {
    const rate = activeRate(rates, currency);
    if (rate) out[currency] = Number(rate.egpPerUnit) || 1;
  }
  return out;
};

export async function fxRates(req: PayloadRequest): Promise<Record<string, number>> {
  const ctx = (req.context ??= {}) as { fx?: Promise<Record<string, number>> };
  ctx.fx ??= (async () => {
    const out: Record<string, number> = { EGP: 1, ...fallbackRates() };
    try {
      const g = (await req.payload.findGlobal({
        locale: req.locale,
        slug: "fx-rates" as never,
        depth: 0,
      } as never)) as { rates?: FxRate[] };
      Object.assign(out, activeRates(g.rates));
    } catch {}
    return out;
  })();
  return ctx.fx;
}

function fallbackRates(): Record<string, number> {
  if (IS_TEMP_MOCK) {
    return { USD: 48.6, EUR: 52.9 };
  } else {
    throw new TempMockError(
      "fxRates falls back to fixed USD/EGP 48.6 and EUR/EGP 52.9: a currency with no active approved rate needs a decided behaviour (refuse, or ask finance), not a hard-coded rate",
    );
  }
}

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

export interface FieldWords {
  hint?: Words;
  placeholder?: Words;
}

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
    placeholder: asText(text.placeholder ?? { en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
  },
});

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
    const last = Math.max(
      0,
      ...docs.map((d) => {
        const v = scalar((d as Record<string, unknown>)[field]);
        return v.startsWith(prefix) ? Number(/\d+/.exec(v.slice(prefix.length))?.[0] ?? 0) : 0;
      }),
    );
    return { ...data, [field]: `${prefix}${String(last + 1).padStart(4, "0")}` };
  };

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
  } catch {}
}

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
  } catch {}
}

function aiModel(): string {
  if (IS_MOCK) {
    return "Demo stub (no live AI)";
  } else {
    throw new NotConnectedError("AI model: logAiCall records the model and version the real AI call answered with");
  }
}

function aiCallSeconds(): number {
  if (IS_TEMP_MOCK) {
    return 0.4;
  } else {
    throw new TempMockError("logAiCall records a fixed 0.4 s: the caller should pass the call's measured duration");
  }
}

export const scalar = (v: unknown): string => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");

export const idOf = (v: unknown): string | undefined =>
  (v && typeof v === "object" ? scalar((v as { id?: unknown }).id) : scalar(v)) || undefined;

export const ruleError = (message: string) => Object.assign(new Error(message), { status: 400, name: "APIError" });
