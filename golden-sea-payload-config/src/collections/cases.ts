import type { CollectionConfig, Field, PayloadRequest } from "payload";
import { formats, tones, type CollectionSettings, type OptionTone } from "saastemlycrm-design-system/contracts";
import { widgets } from "saastemlycrm-design-system/contracts";
import {
  CASE_TYPES,
  CURRENCIES,
  DAY,
  PORT_OPTIONS,
  QUOTE_DECISION_OPTIONS,
  STORE_OPTIONS,
  TODAY,
  UNIT_OPTIONS,
  autoNumber,
  choices,
  computed,
  inLanguage,
  costVisible,
  idOf,
  logActivity,
  scalar,
  words,
} from "./shared.ts";
import { caseDelivery } from "../pages/case-delivery.ts";
import { caseOrder } from "../pages/case-order.ts";
import { caseOverview } from "../pages/case-overview.ts";
import { caseRfqs } from "../pages/case-rfqs.ts";
import { caseCompare } from "../pages/case-compare.ts";
import { casePricing } from "../pages/case-pricing.ts";
import { caseProfit } from "../pages/case-profit.ts";

export const STAGES = [
  "New",
  "Validating",
  "Sourcing",
  "Awaiting supplier",
  "Comparing offers",
  "Awaiting corrected offer",
  "Awaiting management approval",
  "Quotation submitted",
  "Awaiting customer decision",
  "Revision requested",
  "Won — PO mismatch",
  "Won — sales order confirmed",
  "Purchasing",
  "Delivering (drop 1 of 2)",
  "Delivered",
  "Invoiced — partially paid",
  "Customs clearance",
  "Held for vessel",
  "Closed — settled",
  "On hold",
  "Lost",
  "Expired",
];

const STAGE_AR: Record<string, string> = {
  New: "جديد",
  Validating: "قيد التحقق",
  Sourcing: "قيد التوريد",
  "Awaiting supplier": "بانتظار المورّد",
  "Comparing offers": "مقارنة العروض",
  "Awaiting corrected offer": "بانتظار عرض مصحَّح",
  "Awaiting management approval": "بانتظار موافقة الإدارة",
  "Quotation submitted": "قُدّم عرض السعر",
  "Awaiting customer decision": "بانتظار قرار العميل",
  "Revision requested": "طُلبت مراجعة",
  "Won — PO mismatch": "فوز — عدم تطابق أمر الشراء",
  "Won — sales order confirmed": "فوز — تأكيد أمر البيع",
  Purchasing: "قيد الشراء",
  "Delivering (drop 1 of 2)": "قيد التسليم (الدفعة 1 من 2)",
  Delivered: "تم التسليم",
  "Invoiced — partially paid": "مفوتر — مدفوع جزئيًا",
  "Customs clearance": "التخليص الجمركي",
  "Held for vessel": "محتجز للسفينة",
  "Closed — settled": "مغلق — تمت التسوية",
  "On hold": "معلّق",
  Lost: "خسارة",
  Expired: "منتهي",
};
export const STAGE_OPTIONS = choices(STAGES, STAGE_AR);

export const WAITS = [
  "Awaiting supplier",
  "Awaiting corrected offer",
  "Awaiting internal approval",
  "Awaiting customer decision",
  "Awaiting delivery or payment",
];

export const WAIT_OPTIONS = choices(WAITS, {
  "Awaiting supplier": "بانتظار المورّد",
  "Awaiting corrected offer": "بانتظار عرض مصحَّح",
  "Awaiting internal approval": "بانتظار موافقة داخلية",
  "Awaiting customer decision": "بانتظار قرار العميل",
  "Awaiting delivery or payment": "بانتظار التسليم أو الدفع",
});

export const LINE_BUCKET: Record<string, LineBucket> = {
  "Clarification needed": "blocked",
  "Not sourced": "noOffer",
  "Awaiting supplier": "waiting",
  "Awaiting customer acceptance": "waiting",
  "Ready to select": "ready",
  "Offer selected": "ready",
  "Split offer selected": "ready",
  Ordered: "ready",
  Received: "ready",
  Delivered: "ready",
  Invoiced: "ready",
  "Closed — not awarded": "closed",
};
export type LineBucket = "ready" | "waiting" | "blocked" | "noOffer" | "closed";

const BUCKET_TONE: Record<LineBucket, OptionTone> = {
  ready: "success",
  waiting: "warning",
  blocked: "error",
  noOffer: "neutral",
  closed: "neutral",
};

export const bucketOf = (status: unknown): LineBucket => LINE_BUCKET[scalar(status) || "Not sourced"] ?? "noOffer";

export function lineCounts(c: Record<string, unknown>) {
  const items = (c.items as { status?: string }[] | undefined) ?? [];
  if (items.length) {
    const count = (b: LineBucket) => items.filter((l) => bucketOf(l.status) === b).length;
    return {
      total: items.length,
      ready: count("ready"),
      waiting: count("waiting"),
      blocked: count("blocked"),
      noOffer: count("noOffer"),
      closed: count("closed"),
    };
  }
  const s = (c.lines as Record<string, number> | undefined) ?? {};
  const n = (k: string) => Number(s[k]) || 0;
  return {
    total: n("ready") + n("waiting") + n("blocked") + n("noOffer"),
    ready: n("ready"),
    waiting: n("waiting"),
    blocked: n("blocked"),
    noOffer: n("noOffer"),
    closed: 0,
  };
}

const RISK_RANK: Record<string, number> = { danger: 0, warn: 1, info: 2, ok: 3, neutral: 4 };

const time = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const arDays = (n: number) => (n === 1 ? "يوم واحد" : n === 2 ? "يومان" : n <= 10 ? `${n} أيام` : `${n} يومًا`);
export function relativeDue(iso: unknown, req?: { locale?: unknown }): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  const days = Math.floor(d.getTime() / DAY) - Math.floor(TODAY.getTime() / DAY);
  const say = (en: string, ar: string) => inLanguage(req, { en, ar });
  if (days === 0)
    return d < TODAY
      ? say(`overdue since ${time(d)}`, `متأخر منذ ${time(d)}`)
      : say(`today ${time(d)}`, `اليوم ${time(d)}`);
  if (days === 1) return say(`tomorrow ${time(d)}`, `غدًا ${time(d)}`);
  if (days > 1) return say(`in ${days} days`, `خلال ${arDays(days)}`);
  return say(`${-days} day${days === -1 ? "" : "s"} overdue`, `متأخر ${arDays(-days)}`);
}

const rowComputed = <F extends Field>(field: F, compute: (row: Record<string, unknown>) => unknown): F =>
  ({
    ...field,
    virtual: true,
    admin: { readOnly: true, condition: () => false, ...(field as { admin?: object }).admin },
    hooks: {
      afterRead: [({ siblingData }: { siblingData?: Record<string, unknown> }) => compute(siblingData ?? {})],
    },
  }) as F;

const LINE_GAUGES = [
  ["waiting", { en: "Waiting", ar: "منتظر" }, { en: "Lines that are waiting.", ar: "البنود المنتظرة." }, "warning"],
  ["blocked", { en: "Blocked", ar: "متوقف" }, { en: "Lines that are blocked.", ar: "البنود المتوقفة." }, "error"],
  [
    "noOffer",
    { en: "No offer", ar: "بلا عرض" },
    { en: "Lines that are no offer.", ar: "البنود التي بلا عرض." },
    "neutral",
  ],
] as const;

const NOW = TODAY.toISOString();

export const REASSIGN_ROLES = ["management", "supply-chain"];
export const HANDOVER_ROLES = ["supply-chain", "sales", "operations", "management"];
type Reader = { id?: unknown; role?: unknown } | null | undefined;
export const mayReassign = (c: Record<string, unknown>, user: Reader) =>
  !!user?.id && (REASSIGN_ROLES.includes(scalar(user.role)) || user.id === idOf(c.owner) || user.id === idOf(c.backup));

async function desk(req: PayloadRequest): Promise<Record<string, unknown>[]> {
  const ctx = (req.context ??= {}) as { desk?: Promise<Record<string, unknown>[]> };
  ctx.desk ??= req.payload
    .find({ collection: "users", limit: 0, depth: 0, pagination: false } as never)
    .then((r) =>
      (r.docs as unknown as Record<string, unknown>[]).filter((u) => HANDOVER_ROLES.includes(scalar(u.role))),
    )
    .catch(() => []);
  return ctx.desk;
}

const LINE_STATUSES = [
  "Clarification needed",
  "Not sourced",
  "Awaiting supplier",
  "Ready to select",
  "Awaiting customer acceptance",
  "Offer selected",
  "Split offer selected",
  "Ordered",
  "Received",
  "Delivered",
  "Invoiced",
  "Closed — not awarded",
];

const LINE_STATUS_OPTIONS = choices(LINE_STATUSES, {
  "Clarification needed": "يحتاج توضيحًا",
  "Not sourced": "لم يُورَّد",
  "Awaiting supplier": "بانتظار المورّد",
  "Ready to select": "جاهز للاختيار",
  "Awaiting customer acceptance": "بانتظار قبول العميل",
  "Offer selected": "اختير العرض",
  "Split offer selected": "اختير عرض مجزّأ",
  Ordered: "تم الطلب",
  Received: "تم الاستلام",
  Delivered: "تم التسليم",
  Invoiced: "مفوتر",
  "Closed — not awarded": "مغلق — لم يُرسَ",
});

export const Cases: CollectionConfig = {
  slug: "cases",
  labels: { singular: { en: "Case", ar: "ملف" }, plural: { en: "Cases", ar: "الملفات" } },
  admin: {
    useAsTitle: "caseId",
    listSearchableFields: ["caseId", "vessel", "customerRef"],
    defaultColumns: ["caseId", "customer", "vessel", "stage", "deadline", "owner", "value"],
    group: { en: "Sourcing desk", ar: "مكتب التوريد" },
    description: {
      en: "Client RFQs and everything that follows: supplier RFQs, quotes, POs, delivery and payment.",
      ar: "طلبات عروض أسعار العملاء وكل ما يليها: طلبات الموردين، العروض، أوامر الشراء، التسليم والدفع.",
    },
    components: {
      beforeList: [widgets({ widgets: [{ size: "s", counts: { collection: "cases", field: "wait" } }] })],
      views: {
        edit: {
          overview: {
            Component: caseOverview,
            path: "/overview",
            tab: { label: words({ en: "Overview", ar: "نظرة عامة" }), href: "/overview" },
          },
          rfqs: {
            Component: caseRfqs,
            path: "/rfqs",
            tab: { label: words({ en: "Supplier RFQs", ar: "طلبات عروض الموردين" }), href: "/rfqs" },
          },
          compare: {
            Component: caseCompare,
            path: "/compare",
            tab: { label: words({ en: "Compare offers", ar: "مقارنة العروض" }), href: "/compare" },
          },
          pricing: {
            Component: casePricing,
            path: "/pricing",
            tab: { label: words({ en: "Pricing", ar: "التسعير" }), href: "/pricing" },
          },
          order: {
            Component: caseOrder,
            path: "/order",
            tab: { label: words({ en: "Order & purchasing", ar: "الطلب والمشتريات" }), href: "/order" },
          },
          delivery: {
            Component: caseDelivery,
            path: "/delivery",
            tab: { label: words({ en: "Delivery & billing", ar: "التسليم والفوترة" }), href: "/delivery" },
          },
          profit: {
            Component: caseProfit,
            path: "/profit",
            tab: { label: words({ en: "Profit & close", ar: "الربح والإغلاق" }), href: "/profit" },
          },
        },
      },
    },
  },
  defaultSort: "deadline",
  custom: {
    list: { board: "wait", cardFields: ["customer", "vessel", "deadline", "owner"] },
    edit: {
      steps: {
        field: "stage",
        skip: [
          "Awaiting corrected offer",
          "Revision requested",
          "Won — PO mismatch",
          "Customs clearance",
          "Held for vessel",
          "On hold",
          "Lost",
          "Expired",
        ],
      },
    },
    actions: [
      {
        label: words({ en: "Reassign", ar: "إعادة إسناد" }),
        when: { canReassign: { equals: true } },
        call: { path: "/case-overview/$row.id/reassign" },
        confirm: {
          heading: words({ en: "Reassign $row.caseId", ar: "إعادة إسناد $row.caseId" }),
          text: words({
            en: "The new owner gets the case, its open tasks and a notification. The handover note is logged on the timeline. AI drafts the note from the case, its clarifications, open tasks and timeline.",
            ar: "يتسلّم المالك الجديد الملف ومهامه المفتوحة ويصله إشعار. تُسجَّل مذكرة التسليم على الخط الزمني. يصوغ الذكاء الاصطناعي المذكرة من الملف وتوضيحاته ومهامه المفتوحة وخطه الزمني.",
          }),
          label: words({ en: "Confirm handover", ar: "تأكيد التسليم" }),
        },
        fields: [
          {
            type: "select",
            name: "to",
            label: words({ en: "Hand over to", ar: "تسليم إلى" }),
            required: true,
            defaultValue: "$row.backup.id",
            options: "$row.handoverTeam" as never,
            admin: {
              description: words({ en: "The colleague who takes the case over.", ar: "الزميل الذي يتسلّم الملف." }),
              placeholder: words({ en: "Choose a person", ar: "اختر شخصًا" }),
            },
          },
          {
            type: "textarea",
            name: "note",
            label: words({ en: "Handover note", ar: "مذكرة التسليم" }),
            required: true,
            admin: {
              description: words({
                en: "Edit freely. Nothing is saved until you confirm.",
                ar: "عدّل بحرية. لا يُحفظ شيء حتى تؤكد.",
              }),
              placeholder: words({
                en: "e.g. Offers are in for lines 1 to 6, customer call pending.",
                ar: "مثال: وصلت العروض للبنود 1 إلى 6، ومكالمة العميل معلّقة.",
              }),
              rows: 10,
            },
          },
        ],
        prefill: { when: "to", into: "note", from: "draft", call: { path: "/case-overview/$row.id/handover" } },
        assist: { field: "note", tools: "formal shorter proofread" },
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data) data.riskRank = RISK_RANK[scalar(data.tone ?? originalDoc?.tone) || "info"] ?? 2;
        return data;
      },
    ],
    beforeValidate: [
      async (args) => {
        const { data } = args;
        const prefix = data?.caseType === "service" ? "GS-SVC-" : data?.caseType === "held" ? "GS-HLD-" : "GS-RFQ-";
        return autoNumber("cases", "caseId", prefix)(args);
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (req.context?.seed) return doc;
        if (operation === "create")
          await logActivity(req, {
            case: doc.id,
            text: { en: `Case ${doc.caseId} created.`, ar: `أُنشئ الملف ${doc.caseId}.` },
          });
        else {
          if (previousDoc?.stage !== doc.stage)
            await logActivity(req, {
              case: doc.id,
              text: {
                en: `Stage: ${previousDoc?.stage ?? "—"} → ${doc.stage}.`,
                ar: `المرحلة: ${STAGE_AR[previousDoc?.stage] ?? previousDoc?.stage ?? "—"} ← ${STAGE_AR[doc.stage] ?? doc.stage}.`,
              },
            });
          const prevOwner = typeof previousDoc?.owner === "object" ? previousDoc?.owner?.id : previousDoc?.owner;
          const owner = typeof doc.owner === "object" ? doc.owner?.id : doc.owner;
          if (prevOwner && prevOwner !== owner) {
            const user = await req.payload
              .findByID({ collection: "users", id: String(owner), depth: 0 })
              .catch(() => null);
            const name = typeof user?.name === "string" ? user.name : String(owner);
            const note = scalar(doc.handoverNote);
            await logActivity(req, {
              case: doc.id,
              text: { en: `Reassigned to ${name}. ${note}`.trim(), ar: `أُعيد الإسناد إلى ${name}. ${note}`.trim() },
            });
          }
        }
        return doc;
      },
    ],
  },
  endpoints: [
    {
      path: "/:id/summary",
      method: "get",
      handler: async (req) => {
        const doc = await req.payload.findByID({
          locale: req.locale,
          collection: "cases",
          id: String(req.routeParams?.id),
          depth: 1,
        });
        const customer = typeof doc.customer === "object" && doc.customer ? doc.customer.name : doc.customer;
        return Response.json({
          id: doc.id,
          summary: `${doc.caseId} · ${customer} · ${doc.vessel}: ${doc.stage}. Next: ${doc.nextAction}.`,
        });
      },
    },
  ],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Case", ar: "ملف" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "caseId",
                  type: "text",
                  label: { en: "Case", ar: "ملف" },
                  unique: true,
                  admin: {
                    readOnly: true,
                    description: {
                      en: "Numbered automatically when the case is created.",
                      ar: "يُرقَّم تلقائيًا عند إنشاء الملف.",
                    },
                  },
                },
                {
                  name: "customer",
                  type: "relationship",
                  label: { en: "Customer", ar: "العميل" },
                  relationTo: "customers",
                  required: true,
                  admin: {
                    description: {
                      en: "The shipping company or owner asking for the quote.",
                      ar: "شركة الشحن أو المالك الذي يطلب العرض.",
                    },
                    placeholder: words({ en: "e.g. Nordvik Ship Management", ar: "مثال: Nordvik Ship Management" }),
                  },
                },
                {
                  name: "customerRef",
                  type: "text",
                  label: { en: "Customer reference", ar: "مرجع العميل" },
                  admin: {
                    description: {
                      en: "The customer's own RFQ or requisition number, if any.",
                      ar: "رقم طلب عرض الأسعار أو طلب التوريد الخاص بالعميل، إن وُجد.",
                    },
                    placeholder: { en: "e.g. RFQ-2026-0457", ar: "مثال: RFQ-2026-0457" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "vessel",
                  type: "text",
                  label: { en: "Vessel", ar: "السفينة" },
                  required: true,
                  admin: {
                    description: { en: "The ship the stores are for.", ar: "السفينة التي تُورَّد لها المستلزمات." },
                    placeholder: { en: "e.g. MV Nordic Tern", ar: "مثال: MV Nordic Tern" },
                  },
                },
                {
                  name: "vesselRecord",
                  type: "relationship",
                  relationTo: "vessels",
                  label: { en: "Vessel record (IMO)", ar: "سجل السفينة (IMO)" },
                  admin: {
                    description: {
                      en: "Link the vessel's record to keep its IMO number and history.",
                      ar: "اربط سجل السفينة للاحتفاظ برقم IMO وتاريخها.",
                    },
                    placeholder: words({ en: "Search vessels", ar: "ابحث في السفن" }),
                  },
                },
                {
                  name: "port",
                  type: "select",
                  label: { en: "Port", ar: "الميناء" },
                  options: PORT_OPTIONS,
                  admin: {
                    description: {
                      en: "Where the goods are handed over to the vessel.",
                      ar: "مكان تسليم البضاعة إلى السفينة.",
                    },
                    placeholder: words({ en: "e.g. Port Said", ar: "مثال: بورسعيد" }),
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "eta",
                  type: "date",
                  label: { en: "ETA", ar: "موعد الوصول المتوقع" },
                  admin: {
                    date: { pickerAppearance: "dayAndTime" },
                    description: {
                      en: "When the vessel is expected at the port.",
                      ar: "موعد وصول السفينة المتوقع إلى الميناء.",
                    },
                  },
                },
                {
                  name: "deadline",
                  type: "date",
                  required: true,
                  label: { en: "Quote deadline", ar: "موعد تقديم العرض" },
                  admin: {
                    description: {
                      en: "When the customer needs our quotation by.",
                      ar: "الموعد الذي يحتاج فيه العميل عرض السعر.",
                    },
                  },
                },
                {
                  name: "currency",
                  type: "select",
                  options: CURRENCIES,
                  defaultValue: "USD",
                  label: { en: "Quote currency", ar: "عملة العرض" },
                  admin: {
                    description: { en: "The currency the customer is quoted in.", ar: "العملة التي يُسعَّر بها العميل." },
                    placeholder: words({ en: "USD", ar: "USD" }),
                  },
                },
              ],
            },
            {
              name: "agent",
              type: "text",
              label: { en: "Port agent / delivery contact", ar: "الوكيل البحري / جهة الاستلام" },
              admin: {
                description: {
                  en: "Who meets the goods at the port, usually the vessel's agent.",
                  ar: "من يستلم البضاعة في الميناء، وعادةً وكيل السفينة.",
                },
                placeholder: { en: "e.g. Ahmed Hassan, Suez Agency", ar: "مثال: أحمد حسن، وكالة السويس" },
              },
            },
            {
              name: "nextAction",
              type: "text",
              localized: true,
              label: { en: "Next action", ar: "الإجراء التالي" },
              required: true,
              admin: {
                description: { en: "The next step and who takes it.", ar: "الخطوة التالية ومن يتولاها." },
                placeholder: {
                  en: "e.g. Chase supplier offers for lines 3 to 5",
                  ar: "مثال: متابعة عروض الموردين للبنود 3 إلى 5",
                },
              },
            },
            {
              name: "blocker",
              type: "text",
              label: { en: "Blocker", ar: "العائق" },
              localized: true,
              custom: { toneWhen: [{ when: { tone: { equals: "danger" } }, tone: "error" }] },
              admin: {
                description: { en: "What stops this case moving, if anything.", ar: "ما يعيق تقدّم هذا الملف، إن وُجد." },
                placeholder: {
                  en: "e.g. Customer has not confirmed the brand",
                  ar: "مثال: لم يؤكد العميل العلامة التجارية",
                },
              },
            },
            {
              name: "handoverNote",
              type: "textarea",
              label: { en: "Handover Note", ar: "مذكرة التسليم" },
              localized: true,
              admin: {
                description: {
                  en: "Logged on the timeline when the owner changes.",
                  ar: "يُسجَّل على الخط الزمني عند تغيّر المالك.",
                },
                placeholder: {
                  en: "e.g. Offers are in for lines 1 to 6, customer call pending.",
                  ar: "مثال: وصلت العروض للبنود 1 إلى 6، ومكالمة العميل معلّقة.",
                },
              },
            },
          ],
        },
        {
          label: { en: "Requested lines", ar: "البنود المطلوبة" },
          fields: [
            {
              name: "items",
              type: "array",
              label: { en: "Items", ar: "البنود" },
              labels: { singular: { en: "Line", ar: "بند" }, plural: { en: "Lines", ar: "البنود" } },
              admin: {
                description: {
                  en: "The customer's lines, as extracted and validated. Offers and the quotation refer to them by line number.",
                  ar: "بنود العميل كما استُخرجت وتم التحقق منها. تشير العروض وعرض السعر إليها برقم البند.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "lineNo",
                      type: "number",
                      required: true,
                      min: 1,
                      label: { en: "#", ar: "#" },
                      admin: {
                        description: {
                          en: "The line's position in the customer's list.",
                          ar: "ترتيب البند في قائمة العميل.",
                        },
                        placeholder: { en: "e.g. 3", ar: "مثال: 3" },
                      },
                    },
                    {
                      name: "description",
                      type: "text",
                      label: { en: "Description", ar: "الوصف" },
                      localized: true,
                      required: true,
                      admin: {
                        description: { en: "The item as the customer names it.", ar: "الصنف كما يسمّيه العميل." },
                        placeholder: { en: "e.g. Safety helmet, white, size L", ar: "مثال: خوذة سلامة، بيضاء، مقاس L" },
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "product",
                      type: "relationship",
                      label: { en: "Product", ar: "المنتج" },
                      relationTo: "products",
                      admin: {
                        description: {
                          en: "Match it to a catalogue product to reuse suppliers and prices.",
                          ar: "اربطه بمنتج من الكتالوج لإعادة استخدام الموردين والأسعار.",
                        },
                        placeholder: words({ en: "Search products", ar: "ابحث في المنتجات" }),
                      },
                    },
                    {
                      name: "brand",
                      type: "text",
                      label: { en: "Brand", ar: "العلامة التجارية" },
                      admin: {
                        description: {
                          en: "The brand the customer asks for.",
                          ar: "العلامة التجارية التي يطلبها العميل.",
                        },
                        placeholder: { en: "e.g. Jotun", ar: "مثال: Jotun" },
                      },
                    },
                    {
                      name: "exactBrand",
                      type: "checkbox",
                      label: { en: "Exact brand / part only", ar: "العلامة / رقم القطعة نفسه فقط" },
                      defaultValue: false,
                      admin: {
                        description: {
                          en: "Tick when only this brand or part number is acceptable.",
                          ar: "حدّد عندما لا يُقبل إلا هذه العلامة أو رقم القطعة.",
                        },
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "model",
                      type: "text",
                      label: { en: "Model", ar: "الموديل" },
                      admin: {
                        description: { en: "The model or type of the item.", ar: "طراز الصنف أو نوعه." },
                        placeholder: { en: "e.g. HEMPEL 45880", ar: "مثال: HEMPEL 45880" },
                      },
                    },
                    {
                      name: "partNo",
                      type: "text",
                      label: { en: "Part no.", ar: "رقم القطعة" },
                      admin: {
                        description: { en: "The maker's part number.", ar: "رقم القطعة لدى الشركة المصنّعة." },
                        placeholder: { en: "e.g. 4410-2203", ar: "مثال: 4410-2203" },
                      },
                    },
                    {
                      name: "impa",
                      type: "text",
                      label: { en: "IMPA", ar: "IMPA" },
                      admin: {
                        description: {
                          en: "The IMPA code, the standard marine stores number.",
                          ar: "رمز IMPA، الرقم القياسي لمستلزمات السفن.",
                        },
                        placeholder: { en: "e.g. 150101", ar: "مثال: 150101" },
                      },
                    },
                    {
                      name: "issa",
                      type: "text",
                      label: { en: "ISSA", ar: "ISSA" },
                      admin: {
                        description: {
                          en: "The ISSA code, the ship chandlers' catalogue number.",
                          ar: "رمز ISSA، رقم كتالوج مورّدي السفن.",
                        },
                        placeholder: { en: "e.g. 41.01.01", ar: "مثال: 41.01.01" },
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "qty",
                      type: "number",
                      label: { en: "Qty", ar: "الكمية" },
                      required: true,
                      min: 0,
                      admin: {
                        description: {
                          en: "How many units the customer wants.",
                          ar: "عدد الوحدات التي يطلبها العميل.",
                        },
                        placeholder: { en: "e.g. 12", ar: "مثال: 12" },
                      },
                    },
                    {
                      name: "unit",
                      type: "select",
                      label: { en: "Unit", ar: "الوحدة" },
                      options: UNIT_OPTIONS,
                      required: true,
                      admin: {
                        description: { en: "The unit the quantity is counted in.", ar: "الوحدة التي تُعدّ بها الكمية." },
                        placeholder: words({ en: "e.g. pcs", ar: "مثال: قطعة" }),
                      },
                    },
                    {
                      name: "packSize",
                      type: "number",
                      min: 0,
                      label: { en: "Base units per unit", ar: "الوحدات الأساسية في كل وحدة" },
                      defaultValue: 1,
                      admin: {
                        description: {
                          en: "How many base units one unit holds, such as 12 per carton.",
                          ar: "عدد الوحدات الأساسية في الوحدة الواحدة، مثل 12 في الكرتونة.",
                        },
                        placeholder: { en: "e.g. 12", ar: "مثال: 12" },
                      },
                    },
                    {
                      name: "store",
                      type: "select",
                      label: { en: "Store", ar: "القسم" },
                      options: STORE_OPTIONS,
                      admin: {
                        description: {
                          en: "Which store department the item belongs to.",
                          ar: "قسم المستلزمات الذي ينتمي إليه الصنف.",
                        },
                        placeholder: words({ en: "Pick a store", ar: "اختر قسمًا" }),
                      },
                    },
                  ],
                },
                {
                  name: "certificates",
                  type: "text",
                  label: { en: "Certificates / requirements", ar: "الشهادات / المتطلبات" },
                  admin: {
                    description: {
                      en: "Papers or specs the customer needs with the goods.",
                      ar: "المستندات أو المواصفات التي يحتاجها العميل مع البضاعة.",
                    },
                    placeholder: { en: "e.g. Class certificate, MSDS", ar: "مثال: شهادة التصنيف، MSDS" },
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "status",
                      type: "select",
                      label: { en: "Status", ar: "الحالة" },
                      options: LINE_STATUS_OPTIONS,
                      defaultValue: "Not sourced",
                      custom: {
                        ...tones(Object.fromEntries(LINE_STATUSES.map((s) => [s, BUCKET_TONE[bucketOf(s)]]))),
                        about: {
                          en: "Each status counts as ready, waiting, blocked or no offer on the case's line bar.",
                          ar: "تُحتسب كل حالة جاهزةً أو منتظرةً أو متوقفةً أو بلا عرض في شريط بنود الملف.",
                        },
                      },
                      admin: {
                        description: {
                          en: "Where this line stands in sourcing and delivery.",
                          ar: "موقف هذا البند في التوريد والتسليم.",
                        },
                        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
                      },
                    },
                    {
                      name: "confidence",
                      type: "number",
                      min: 0,
                      max: 1,
                      label: { en: "AI extraction confidence", ar: "ثقة الاستخراج بالذكاء الاصطناعي" },
                      admin: {
                        readOnly: true,
                        description: {
                          en: "How sure the AI was when it read this line from the email.",
                          ar: "مدى ثقة الذكاء الاصطناعي عند قراءة هذا البند من البريد.",
                        },
                      },
                    },
                    rowComputed(
                      {
                        name: "aiRead",
                        type: "number",
                        label: { en: "AI read", ar: "قراءة الذكاء الاصطناعي" },
                        admin: {
                          description: {
                            en: "The AI's confidence as a percentage; amber under 85%.",
                            ar: "ثقة الذكاء الاصطناعي كنسبة مئوية؛ بالكهرماني تحت 85%.",
                          },
                        },
                        custom: {
                          ...formats.percent(0),
                          toneWhen: [{ when: { aiRead: { less_than: 85 } }, tone: "warning" }],
                        },
                      },
                      (l) => (typeof l.confidence === "number" ? Math.round(l.confidence * 100) : null),
                    ),
                  ],
                },
                {
                  name: "missing",
                  type: "text",
                  localized: true,
                  label: { en: "Missing / unclear", ar: "ناقص / غير واضح" },
                  admin: {
                    description: {
                      en: "What is unclear on this line and must be asked.",
                      ar: "ما هو غير واضح في هذا البند ويجب السؤال عنه.",
                    },
                    placeholder: { en: "e.g. Size and colour", ar: "مثال: المقاس واللون" },
                  },
                },
                {
                  name: "originalText",
                  type: "textarea",
                  label: { en: "Original Text", ar: "النص الأصلي" },
                  admin: {
                    readOnly: true,
                    description: { en: "Exactly as written by the customer.", ar: "كما كتبه العميل حرفيًا." },
                  },
                },
                {
                  name: "selection",
                  type: "group",
                  label: { en: "Selected offer", ar: "العرض المختار" },
                  admin: {
                    description: {
                      en: "The offer chosen for this line and why.",
                      ar: "العرض المختار لهذا البند وسببه.",
                    },
                  },
                  fields: [
                    {
                      name: "offers",
                      type: "relationship",
                      label: { en: "Offers", ar: "العروض" },
                      relationTo: "offers",
                      hasMany: true,
                      admin: {
                        description: { en: "More than one = split sourcing.", ar: "أكثر من عرض = توريد مجزّأ." },
                        placeholder: words({ en: "Search offers", ar: "ابحث في العروض" }),
                      },
                    },
                    {
                      name: "splitQty",
                      type: "array",
                      label: { en: "Split Qty", ar: "تقسيم الكمية" },
                      labels: {
                        singular: { en: "Split", ar: "تجزئة" },
                        plural: { en: "Split quantities", ar: "الكميات المجزّأة" },
                      },
                      admin: {
                        description: {
                          en: "How the quantity is shared between offers.",
                          ar: "كيف تتوزع الكمية بين العروض.",
                        },
                      },
                      fields: [
                        {
                          type: "row",
                          fields: [
                            {
                              name: "offer",
                              type: "relationship",
                              label: { en: "Offer", ar: "العرض" },
                              relationTo: "offers",
                              required: true,
                              admin: {
                                description: {
                                  en: "The offer that covers part of the quantity.",
                                  ar: "العرض الذي يغطي جزءًا من الكمية.",
                                },
                                placeholder: words({ en: "Search offers", ar: "ابحث في العروض" }),
                              },
                            },
                            {
                              name: "qty",
                              type: "number",
                              label: { en: "Qty", ar: "الكمية" },
                              min: 0,
                              required: true,
                              admin: {
                                description: {
                                  en: "Units taken from this offer.",
                                  ar: "الوحدات المأخوذة من هذا العرض.",
                                },
                                placeholder: { en: "e.g. 6", ar: "مثال: 6" },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "reason",
                      type: "textarea",
                      label: { en: "Reason", ar: "السبب" },
                      localized: true,
                      admin: {
                        description: {
                          en: "Required when the choice isn't the best-fit offer.",
                          ar: "مطلوب عندما لا يكون الاختيار هو العرض الأنسب.",
                        },
                        placeholder: {
                          en: "e.g. Cheaper offer lacks the certificate",
                          ar: "مثال: العرض الأرخص بلا شهادة",
                        },
                      },
                    },
                    {
                      name: "marginPct",
                      type: "number",
                      min: -50,
                      max: 90,
                      label: { en: "Margin %", ar: "الهامش %" },
                      access: { read: costVisible },
                      admin: {
                        description: {
                          en: "Our margin on this line; hidden from Sales.",
                          ar: "هامشنا على هذا البند؛ مخفي عن المبيعات.",
                        },
                        placeholder: { en: "e.g. 18", ar: "مثال: 18" },
                      },
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "customerAccepted",
                          type: "checkbox",
                          label: {
                            en: "Customer accepted alternative in writing",
                            ar: "وافق العميل على البديل كتابيًا",
                          },
                          defaultValue: false,
                          admin: {
                            description: {
                              en: "Tick once the customer agreed to a substitute in writing.",
                              ar: "حدّد بعد موافقة العميل كتابيًا على البديل.",
                            },
                          },
                        },
                        {
                          name: "acceptanceEvidence",
                          type: "upload",
                          label: { en: "Acceptance Evidence", ar: "إثبات القبول" },
                          relationTo: "media",
                          admin: {
                            description: {
                              en: "The email or message where the customer agreed.",
                              ar: "البريد أو الرسالة التي وافق فيها العميل.",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "clarifications",
              type: "array",
              label: { en: "Clarifications", ar: "الاستيضاحات" },
              labels: {
                singular: { en: "Clarification", ar: "توضيح" },
                plural: { en: "Clarifications", ar: "التوضيحات" },
              },
              admin: {
                description: {
                  en: "Questions asked about the lines, and the answers.",
                  ar: "الأسئلة المطروحة حول البنود وإجاباتها.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "lineNo",
                      type: "number",
                      min: 1,
                      label: { en: "Line #", ar: "رقم البند" },
                      admin: {
                        description: { en: "The line the question is about.", ar: "البند الذي يخصه السؤال." },
                        placeholder: { en: "e.g. 4", ar: "مثال: 4" },
                      },
                    },
                    {
                      name: "to",
                      type: "select",
                      label: { en: "To", ar: "إلى" },
                      options: [
                        { value: "Customer", label: { en: "Customer", ar: "العميل" } },
                        { value: "Supplier", label: { en: "Supplier", ar: "المورّد" } },
                        { value: "Internal", label: { en: "Internal", ar: "داخلي" } },
                      ],
                      defaultValue: "Customer",
                      admin: {
                        description: { en: "Who the question goes to.", ar: "الجهة التي يُوجَّه إليها السؤال." },
                        placeholder: words({ en: "Customer", ar: "العميل" }),
                      },
                    },
                    {
                      name: "via",
                      type: "select",
                      label: { en: "Via", ar: "عبر" },
                      options: [
                        { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
                        { value: "Phone", label: { en: "Phone", ar: "الهاتف" } },
                        { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
                        { value: "Supplier question", label: { en: "Supplier question", ar: "سؤال المورّد" } },
                      ],
                      admin: {
                        description: { en: "How the question was sent.", ar: "طريقة إرسال السؤال." },
                        placeholder: words({ en: "Email", ar: "البريد الإلكتروني" }),
                      },
                    },
                  ],
                },
                {
                  name: "question",
                  type: "textarea",
                  label: { en: "Question", ar: "السؤال" },
                  localized: true,
                  required: true,
                  admin: {
                    description: {
                      en: "What we need to know, in one clear question.",
                      ar: "ما نحتاج معرفته، في سؤال واحد واضح.",
                    },
                    placeholder: { en: "e.g. Is size 42 or 43 required?", ar: "مثال: هل المقاس المطلوب 42 أم 43؟" },
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "askedAt",
                      type: "date",
                      label: { en: "Asked At", ar: "تاريخ السؤال" },
                      admin: { description: { en: "When the question was sent.", ar: "وقت إرسال السؤال." } },
                    },
                    {
                      name: "askedBy",
                      type: "relationship",
                      label: { en: "Asked By", ar: "سأله" },
                      relationTo: "users",
                      admin: {
                        description: { en: "The colleague who asked.", ar: "الزميل الذي سأل." },
                        placeholder: words({ en: "Search team", ar: "ابحث في الفريق" }),
                      },
                    },
                  ],
                },
                {
                  name: "answer",
                  type: "textarea",
                  label: { en: "Answer", ar: "الإجابة" },
                  localized: true,
                  admin: {
                    description: { en: "The reply received.", ar: "الرد الوارد." },
                    placeholder: { en: "e.g. Size 42, white.", ar: "مثال: مقاس 42، أبيض." },
                  },
                },
                {
                  name: "answeredAt",
                  type: "date",
                  label: { en: "Answered At", ar: "تاريخ الإجابة" },
                  admin: { description: { en: "When the reply came in.", ar: "وقت وصول الرد." } },
                },
                rowComputed(
                  {
                    name: "reply",
                    type: "text",
                    label: { en: "Answer", ar: "الإجابة" },
                    admin: {
                      description: {
                        en: "The answer, or Waiting while the question is open.",
                        ar: "الإجابة، أو «بانتظار الرد» ما دام السؤال مفتوحًا.",
                      },
                    },
                    custom: { toneWhen: [{ when: { answer: { exists: false } }, tone: "warning" }] },
                  },
                  (q) => scalar(q.answer) || "Waiting",
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Line status", ar: "حالة البنود" },
          fields: [
            {
              name: "lines",
              type: "group",
              label: { en: "Line status (summary)", ar: "حالة البنود (ملخص)" },
              admin: {
                description: {
                  en: "Line counts used until the lines themselves are entered.",
                  ar: "أعداد البنود المستخدمة إلى أن تُدخل البنود نفسها.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "ready",
                      type: "number",
                      label: { en: "Ready", ar: "جاهز" },
                      defaultValue: 0,
                      min: 0,
                      admin: {
                        description: { en: "Lines ready to quote or order.", ar: "البنود الجاهزة للتسعير أو الطلب." },
                        placeholder: { en: "e.g. 4", ar: "مثال: 4" },
                      },
                    },
                    {
                      name: "waiting",
                      type: "number",
                      label: { en: "Waiting", ar: "بانتظار" },
                      defaultValue: 0,
                      min: 0,
                      admin: {
                        description: {
                          en: "Lines waiting on a supplier or the customer.",
                          ar: "البنود المنتظرة لمورّد أو للعميل.",
                        },
                        placeholder: { en: "e.g. 2", ar: "مثال: 2" },
                      },
                    },
                    {
                      name: "blocked",
                      type: "number",
                      label: { en: "Blocked", ar: "متوقف" },
                      defaultValue: 0,
                      min: 0,
                      admin: {
                        description: { en: "Lines stuck on a missing detail.", ar: "البنود المتوقفة على تفصيل ناقص." },
                        placeholder: { en: "e.g. 1", ar: "مثال: 1" },
                      },
                    },
                    {
                      name: "noOffer",
                      type: "number",
                      label: { en: "No offer", ar: "بلا عرض" },
                      defaultValue: 0,
                      min: 0,
                      admin: {
                        description: {
                          en: "Lines no supplier has offered on yet.",
                          ar: "البنود التي لم يقدّم عليها أي مورّد عرضًا بعد.",
                        },
                        placeholder: { en: "e.g. 0", ar: "مثال: 0" },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "quoteLines",
              type: "array",
              label: { en: "Quote Lines", ar: "بنود عرض السعر" },
              labels: {
                singular: { en: "Quote line", ar: "بند العرض" },
                plural: { en: "Quote lines", ar: "بنود العرض" },
              },
              admin: { description: { en: "The lines as quoted to the customer.", ar: "البنود كما سُعّرت للعميل." } },
              fields: [
                {
                  name: "description",
                  type: "text",
                  label: { en: "Description", ar: "الوصف" },
                  localized: true,
                  required: true,
                  admin: {
                    description: { en: "What the customer is quoted for.", ar: "ما يُسعَّر للعميل." },
                    placeholder: { en: "e.g. Safety helmet, white, size L", ar: "مثال: خوذة سلامة، بيضاء، مقاس L" },
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "qty",
                      type: "number",
                      label: { en: "Qty", ar: "الكمية" },
                      min: 0,
                      admin: {
                        description: { en: "Units quoted.", ar: "الوحدات المسعّرة." },
                        placeholder: { en: "e.g. 12", ar: "مثال: 12" },
                      },
                    },
                    {
                      name: "unit",
                      type: "select",
                      label: { en: "Unit", ar: "الوحدة" },
                      options: [
                        { value: "pcs", label: { en: "pcs", ar: "قطعة" } },
                        { value: "kg", label: { en: "kg", ar: "كجم" } },
                        { value: "ltr", label: { en: "ltr", ar: "لتر" } },
                        { value: "set", label: { en: "set", ar: "طقم" } },
                        { value: "roll", label: { en: "roll", ar: "لفة" } },
                      ],
                      admin: {
                        description: { en: "The unit the quantity is counted in.", ar: "الوحدة التي تُعدّ بها الكمية." },
                        placeholder: words({ en: "e.g. pcs", ar: "مثال: قطعة" }),
                      },
                    },
                    {
                      name: "unitPrice",
                      type: "number",
                      label: { en: "Unit price (USD)", ar: "سعر الوحدة (USD)" },
                      min: 0,
                      admin: {
                        description: {
                          en: "The selling price per unit in US dollars.",
                          ar: "سعر البيع للوحدة بالدولار الأمريكي.",
                        },
                        placeholder: { en: "e.g. 24.50", ar: "مثال: 24.50" },
                      },
                    },
                  ],
                },
                {
                  name: "supplier",
                  type: "relationship",
                  label: { en: "Supplier", ar: "المورّد" },
                  relationTo: "suppliers",
                  admin: {
                    description: { en: "Who supplies this line.", ar: "المورّد الذي يورّد هذا البند." },
                    placeholder: words({ en: "Search suppliers", ar: "ابحث في الموردين" }),
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: "Pricing", ar: "التسعير" },
          fields: [
            {
              name: "pricing",
              type: "group",
              label: { en: "Pricing", ar: "التسعير" },
              access: { read: costVisible },
              admin: {
                description: {
                  en: "How shared charges and the discount are priced; hidden from Sales.",
                  ar: "كيف تُسعَّر الرسوم المشتركة والخصم؛ مخفي عن المبيعات.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "allocation",
                      type: "select",
                      label: { en: "Shared charges allocated", ar: "توزيع الرسوم المشتركة" },
                      defaultValue: "value",
                      options: [
                        { label: { en: "By line value", ar: "حسب قيمة البند" }, value: "value" },
                        { label: { en: "By quantity", ar: "حسب الكمية" }, value: "qty" },
                        { label: { en: "Equal per line", ar: "بالتساوي لكل بند" }, value: "lines" },
                      ],
                      admin: {
                        description: {
                          en: "How shared charges are split across the lines.",
                          ar: "كيف تُوزَّع الرسوم المشتركة على البنود.",
                        },
                        placeholder: words({ en: "By line value", ar: "حسب قيمة البند" }),
                      },
                    },
                    {
                      name: "discountPct",
                      type: "number",
                      label: { en: "Customer discount %", ar: "خصم العميل %" },
                      min: 0,
                      max: 50,
                      defaultValue: 0,
                      admin: {
                        description: {
                          en: "Discount given to the customer on the whole quote.",
                          ar: "الخصم الممنوح للعميل على العرض كاملًا.",
                        },
                        placeholder: { en: "e.g. 5", ar: "مثال: 5" },
                      },
                    },
                    {
                      name: "fxRateUSD",
                      type: "number",
                      label: { en: "FX snapshot USD/EGP", ar: "سعر الصرف المثبّت USD/EGP" },
                      min: 0,
                      admin: {
                        readOnly: true,
                        description: {
                          en: "The dollar rate in EGP fixed when the case was priced.",
                          ar: "سعر الدولار بالجنيه المثبّت عند تسعير الملف.",
                        },
                      },
                    },
                  ],
                },
                {
                  name: "charges",
                  type: "array",
                  label: { en: "Charges", ar: "الرسوم" },
                  labels: {
                    singular: { en: "Shared charge", ar: "رسوم مشتركة" },
                    plural: { en: "Shared charges", ar: "الرسوم المشتركة" },
                  },
                  admin: {
                    description: {
                      en: "Charges shared by the whole case, such as port fees.",
                      ar: "رسوم يتحملها الملف كله، مثل رسوم الميناء.",
                    },
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "label",
                          type: "text",
                          label: { en: "Label", ar: "التسمية" },
                          localized: true,
                          required: true,
                          admin: {
                            description: { en: "What the charge is for.", ar: "الغرض من الرسوم." },
                            placeholder: { en: "e.g. Port clearance", ar: "مثال: تخليص الميناء" },
                          },
                        },
                        {
                          name: "amountEGP",
                          type: "number",
                          min: 0,
                          label: { en: "Amount (EGP)", ar: "المبلغ (EGP)" },
                          admin: {
                            description: {
                              en: "The estimated amount in Egyptian pounds.",
                              ar: "المبلغ التقديري بالجنيه المصري.",
                            },
                            placeholder: { en: "e.g. 8,500", ar: "مثال: 8,500" },
                          },
                        },
                        {
                          name: "status",
                          type: "select",
                          label: { en: "Status", ar: "الحالة" },
                          options: [
                            { value: "Estimate", label: { en: "Estimate", ar: "تقديري" } },
                            { value: "Confirmed", label: { en: "Confirmed", ar: "مؤكد" } },
                            { value: "Not applicable", label: { en: "Not applicable", ar: "لا ينطبق" } },
                          ],
                          defaultValue: "Estimate",
                          admin: {
                            description: {
                              en: "Whether the charge is a guess or confirmed.",
                              ar: "هل الرسوم تقديرية أم مؤكدة.",
                            },
                            placeholder: words({ en: "Estimate", ar: "تقديري" }),
                          },
                        },
                        {
                          name: "actualEGP",
                          type: "number",
                          min: 0,
                          label: { en: "Actual (EGP)", ar: "الفعلي (EGP)" },
                          admin: {
                            description: {
                              en: "What the charge actually cost in Egyptian pounds.",
                              ar: "التكلفة الفعلية للرسوم بالجنيه المصري.",
                            },
                            placeholder: { en: "e.g. 9,200", ar: "مثال: 9,200" },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: "Service", ar: "الخدمة" },
          fields: [
            {
              name: "service",
              type: "group",
              label: { en: "Spare-parts clearance & forwarding", ar: "تخليص وشحن قطع الغيار" },
              admin: {
                condition: (data) => data?.caseType === "service",
                description: {
                  en: "Customs and forwarding for spare parts sent to a vessel.",
                  ar: "التخليص الجمركي والشحن لقطع غيار مرسلة إلى سفينة.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "awb",
                      type: "text",
                      label: { en: "AWB / B/L", ar: "بوليصة الشحن الجوي / البحري" },
                      admin: {
                        description: {
                          en: "The air waybill or bill of lading number.",
                          ar: "رقم بوليصة الشحن الجوي أو البحري.",
                        },
                        placeholder: { en: "e.g. 176-12345675", ar: "مثال: 176-12345675" },
                      },
                    },
                    {
                      name: "carrier",
                      type: "text",
                      label: { en: "Carrier", ar: "الناقل" },
                      admin: {
                        description: {
                          en: "The airline or shipping line carrying the parcel.",
                          ar: "شركة الطيران أو الخط الملاحي الناقل للطرد.",
                        },
                        placeholder: { en: "e.g. Emirates SkyCargo", ar: "مثال: Emirates SkyCargo" },
                      },
                    },
                    {
                      name: "arrival",
                      type: "date",
                      label: { en: "Arrival", ar: "الوصول" },
                      admin: {
                        description: { en: "When the shipment lands in Egypt.", ar: "موعد وصول الشحنة إلى مصر." },
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "customsDeclaration",
                      type: "text",
                      label: { en: "Customs Declaration", ar: "البيان الجمركي" },
                      admin: {
                        description: { en: "The customs declaration number.", ar: "رقم البيان الجمركي." },
                        placeholder: { en: "e.g. 2026/118452", ar: "مثال: 2026/118452" },
                      },
                    },
                    {
                      name: "customsStatus",
                      type: "select",
                      label: { en: "Customs Status", ar: "الحالة الجمركية" },
                      options: [
                        { value: "Documents pending", label: { en: "Documents pending", ar: "مستندات معلّقة" } },
                        { value: "Submitted", label: { en: "Submitted", ar: "مقدَّم" } },
                        { value: "Released", label: { en: "Released", ar: "مُفرج عنه" } },
                        { value: "Held by customs", label: { en: "Held by customs", ar: "محتجز لدى الجمارك" } },
                      ],
                      admin: {
                        description: { en: "Where customs clearance stands.", ar: "موقف التخليص الجمركي." },
                        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
                      },
                    },
                    {
                      name: "releasedAt",
                      type: "date",
                      label: { en: "Released At", ar: "تاريخ الإفراج" },
                      admin: {
                        description: { en: "When customs released the goods.", ar: "موعد إفراج الجمارك عن البضاعة." },
                      },
                    },
                  ],
                },
                {
                  name: "consolidateWith",
                  type: "relationship",
                  relationTo: "cases",
                  label: { en: "Deliver together with case", ar: "تسليم مع ملف" },
                  admin: {
                    description: {
                      en: "Another case whose delivery goes out with this one.",
                      ar: "ملف آخر يُسلَّم مع هذا الملف.",
                    },
                    placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
                  },
                },
                {
                  name: "fees",
                  type: "array",
                  label: { en: "Fees", ar: "الرسوم" },
                  admin: {
                    description: {
                      en: "Extra fees paid for clearance and forwarding.",
                      ar: "الرسوم الإضافية المدفوعة للتخليص والشحن.",
                    },
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "label",
                          type: "text",
                          label: { en: "Label", ar: "التسمية" },
                          localized: true,
                          required: true,
                          admin: {
                            description: { en: "What the fee is for.", ar: "الغرض من الرسم." },
                            placeholder: { en: "e.g. Customs duty", ar: "مثال: رسوم جمركية" },
                          },
                        },
                        {
                          name: "amountUSD",
                          type: "number",
                          label: { en: "Amount U S D", ar: "المبلغ بالدولار" },
                          min: 0,
                          admin: {
                            description: { en: "The fee in US dollars.", ar: "الرسم بالدولار الأمريكي." },
                            placeholder: { en: "e.g. 350", ar: "مثال: 350" },
                          },
                        },
                        {
                          name: "atCost",
                          type: "checkbox",
                          label: { en: "Re-billed at cost", ar: "يُعاد تحميله بالتكلفة" },
                          defaultValue: false,
                          admin: {
                            description: {
                              en: "Tick when the fee is passed on without markup.",
                              ar: "حدّد عندما يُمرَّر الرسم دون هامش.",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "held",
              type: "group",
              label: { en: "Held stores", ar: "مستلزمات محتجزة" },
              admin: {
                condition: (data) => data?.caseType === "held",
                description: {
                  en: "Stores we keep for a vessel until it arrives.",
                  ar: "مستلزمات نحتفظ بها لسفينة حتى وصولها.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "location",
                      type: "text",
                      label: { en: "Location", ar: "الموقع" },
                      admin: {
                        description: {
                          en: "Where in our warehouse the stores sit.",
                          ar: "موقع المستلزمات في مستودعنا.",
                        },
                        placeholder: { en: "e.g. Alexandria, rack B3", ar: "مثال: الإسكندرية، رف B3" },
                      },
                    },
                    {
                      name: "receivedAt",
                      type: "date",
                      label: { en: "Received At", ar: "تاريخ الاستلام" },
                      admin: {
                        description: { en: "When the stores arrived with us.", ar: "موعد وصول المستلزمات إلينا." },
                      },
                    },
                    {
                      name: "freeDays",
                      type: "number",
                      label: { en: "Free Days", ar: "الأيام المجانية" },
                      min: 0,
                      defaultValue: 14,
                      admin: {
                        description: {
                          en: "Days we hold the stores free of charge.",
                          ar: "أيام الاحتفاظ بالمستلزمات مجانًا.",
                        },
                        placeholder: { en: "e.g. 14", ar: "مثال: 14" },
                      },
                    },
                    {
                      name: "dailyChargeUSD",
                      type: "number",
                      label: { en: "Daily Charge U S D", ar: "الرسم اليومي بالدولار" },
                      min: 0,
                      defaultValue: 5,
                      admin: {
                        description: {
                          en: "The charge per day in US dollars once free days run out.",
                          ar: "الرسم اليومي بالدولار بعد انتهاء الأيام المجانية.",
                        },
                        placeholder: { en: "e.g. 5", ar: "مثال: 5" },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "caseType",
      type: "select",
      label: { en: "Case Type", ar: "نوع الملف" },
      options: CASE_TYPES,
      defaultValue: "rfq",
      admin: {
        position: "sidebar",
        description: { en: "What kind of job this is.", ar: "نوع هذه المهمة." },
        placeholder: words({ en: "Pick a case type", ar: "اختر نوع الملف" }),
      },
    },
    {
      name: "stage",
      type: "select",
      label: { en: "Stage", ar: "المرحلة" },
      required: true,
      defaultValue: "New",
      options: STAGE_OPTIONS,
      custom: tones({
        New: "info",
        Validating: "info",
        Sourcing: "info",
        "Awaiting supplier": "warning",
        "Comparing offers": "info",
        "Awaiting corrected offer": "warning",
        "Awaiting management approval": "warning",
        "Quotation submitted": "info",
        "Awaiting customer decision": "warning",
        "Revision requested": "warning",
        "Won — PO mismatch": "error",
        "Won — sales order confirmed": "success",
        Purchasing: "info",
        "Delivering (drop 1 of 2)": "info",
        Delivered: "success",
        "Invoiced — partially paid": "warning",
        "Customs clearance": "info",
        "Held for vessel": "warning",
        "Closed — settled": "success",
        "On hold": "error",
        Lost: "neutral",
        Expired: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: {
          en: "Where the case is, from first email to settlement.",
          ar: "مرحلة الملف، من أول بريد حتى التسوية.",
        },
        placeholder: words({ en: "Pick a stage", ar: "اختر مرحلة" }),
      },
    },
    {
      name: "decision",
      type: "select",
      label: { en: "Customer decision", ar: "قرار العميل" },
      options: QUOTE_DECISION_OPTIONS,
      admin: {
        position: "sidebar",
        description: { en: "The customer's answer on our quotation.", ar: "رد العميل على عرض السعر." },
        placeholder: words({ en: "Pick a decision", ar: "اختر قرارًا" }),
      },
    },
    {
      name: "wait",
      type: "select",
      label: { en: "Waiting for", ar: "بانتظار" },
      options: WAIT_OPTIONS,
      custom: tones({
        "Awaiting supplier": "warning",
        "Awaiting corrected offer": "warning",
        "Awaiting internal approval": "warning",
        "Awaiting customer decision": "info",
        "Awaiting delivery or payment": "info",
      }),
      admin: {
        position: "sidebar",
        description: { en: "What the case is waiting on right now.", ar: "ما ينتظره الملف الآن." },
        placeholder: words({ en: "Pick what it waits for", ar: "اختر ما ينتظره" }),
      },
    },
    {
      name: "tone",
      type: "select",
      label: { en: "Risk", ar: "المخاطر" },
      defaultValue: "info",
      options: [
        { label: { en: "Blocked", ar: "متوقف" }, value: "danger" },
        { label: { en: "At risk", ar: "معرّض للخطر" }, value: "warn" },
        { label: { en: "On track", ar: "على المسار" }, value: "info" },
        { label: { en: "Done", ar: "تم" }, value: "ok" },
        { label: { en: "Paused", ar: "متوقف مؤقتًا" }, value: "neutral" },
      ],
      custom: tones({ danger: "error", warn: "warning", info: "info", ok: "success", neutral: "neutral" }),
      admin: {
        position: "sidebar",
        description: { en: "How worried we are about this case.", ar: "مدى قلقنا بشأن هذا الملف." },
        placeholder: words({ en: "Pick a risk level", ar: "اختر مستوى المخاطر" }),
      },
    },
    {
      name: "riskRank",
      type: "number",
      label: { en: "Risk rank", ar: "ترتيب المخاطر" },
      admin: {
        hidden: true,
        readOnly: true,
        description: {
          en: "0 blocked … 4 paused: what queues sort by.",
          ar: "0 متوقف … 4 متوقف مؤقتًا: ما ترتّب به قوائم العمل.",
        },
      },
    },
    {
      name: "owner",
      type: "relationship",
      label: { en: "Owner", ar: "المسؤول" },
      relationTo: "users",
      required: true,
      admin: {
        position: "sidebar",
        description: { en: "The person responsible for the case.", ar: "المسؤول عن الملف." },
        placeholder: words({ en: "Search team", ar: "ابحث في الفريق" }),
      },
    },
    {
      name: "backup",
      type: "relationship",
      label: { en: "Backup", ar: "البديل" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: { en: "Covers the case when the owner is away.", ar: "يغطي الملف عند غياب المالك." },
        placeholder: words({ en: "Search team", ar: "ابحث في الفريق" }),
      },
    },
    {
      name: "value",
      type: "number",
      label: { en: "Value (USD)", ar: "القيمة (USD)" },
      min: 0,
      custom: formats.money("USD"),
      access: { read: costVisible },
      admin: {
        position: "sidebar",
        description: {
          en: "The selling value of the case in US dollars; hidden from Sales.",
          ar: "قيمة بيع الملف بالدولار الأمريكي؛ مخفية عن المبيعات.",
        },
        placeholder: { en: "e.g. 18,500", ar: "مثال: 18,500" },
      },
    },
    {
      name: "urgent",
      type: "checkbox",
      label: { en: "Urgent", ar: "عاجل" },
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: { en: "Tick for a case that must jump the queue.", ar: "حدّد للملف الذي يجب تقديمه على غيره." },
      },
    },
    {
      name: "lostReason",
      type: "text",
      label: { en: "Lost Reason", ar: "سبب الخسارة" },
      localized: true,
      admin: {
        position: "sidebar",
        condition: (data) => data?.stage === "Lost",
        description: { en: "Why we lost the case, for later review.", ar: "سبب خسارة الملف، للمراجعة لاحقًا." },
        placeholder: { en: "e.g. Customer chose a cheaper bid", ar: "مثال: اختار العميل عرضًا أرخص" },
      },
    },
    {
      name: "sourceMessage",
      type: "relationship",
      label: { en: "Source Message", ar: "الرسالة المصدر" },
      relationTo: "intake-messages",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "The email this case was created from.", ar: "البريد الذي أُنشئ منه هذا الملف." },
      },
    },
    {
      name: "closedAt",
      type: "date",
      label: { en: "Closed At", ar: "تاريخ الإغلاق" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "When the case was settled and closed.", ar: "موعد تسوية الملف وإغلاقه." },
      },
    },
    computed(
      {
        name: "due",
        type: "text",
        label: { en: "Due", ar: "الاستحقاق" },
        custom: { toneWhen: [{ when: { deadline: { less_than: NOW } }, tone: "error" }] },
        admin: {
          position: "sidebar",
          description: { en: "How long until the quote deadline.", ar: "المدة المتبقية حتى موعد تقديم العرض." },
        },
      },
      (c, req) => relativeDue(c.deadline, req),
    ),
    computed(
      {
        name: "vesselPort",
        type: "text",
        label: { en: "Vessel · port", ar: "السفينة · الميناء" },
        admin: {
          condition: () => false,
          description: { en: "The vessel and its port on one line.", ar: "السفينة وميناؤها في سطر واحد." },
        },
      },
      (c) => [scalar(c.vessel), scalar(c.port)].filter(Boolean).join(" · "),
    ),
    computed(
      {
        name: "lineCount",
        type: "group",
        label: { en: "Lines", ar: "البنود" },
        admin: {
          condition: () => false,
          description: { en: "How far the lines are before the order.", ar: "مدى تقدّم البنود قبل الطلب." },
        },
        fields: [
          {
            name: "total",
            type: "number",
            label: { en: "Lines", ar: "البنود" },
            admin: {
              description: { en: "How many lines the case has.", ar: "عدد بنود الملف." },
              placeholder: { en: "e.g. 6", ar: "مثال: 6" },
            },
          },
          {
            name: "ready",
            type: "number",
            label: { en: "Ready", ar: "جاهز" },
            admin: {
              description: { en: "Lines ready to quote or order.", ar: "البنود الجاهزة للتسعير أو الطلب." },
              placeholder: { en: "e.g. 4", ar: "مثال: 4" },
            },
            custom: {
              gauge: { max: "lineCount.total" },
              toneWhen: [
                { when: { "lineCount.blocked": { greater_than: 0 } }, tone: "warning" },
                { when: {}, tone: "success" },
              ],
            },
          },
          ...LINE_GAUGES.map(([name, label, description, tone]) => ({
            name,
            type: "number" as const,
            label,
            admin: { description, placeholder: { en: "e.g. 1", ar: "مثال: 1" } },
            custom: { gauge: { max: "lineCount.total" }, toneWhen: [{ when: {}, tone }] },
          })),
          {
            name: "readyPct",
            type: "number",
            label: { en: "Ready share", ar: "نسبة الجاهز" },
            admin: {
              description: { en: "Share of the lines that are ready.", ar: "نسبة البنود الجاهزة." },
              placeholder: { en: "e.g. 67", ar: "مثال: 67" },
            },
            custom: formats.percent(0),
          },
        ],
      },
      (c) => {
        const l = lineCounts(c);
        return l.total
          ? {
              total: l.total,
              ready: l.ready,
              waiting: l.waiting,
              blocked: l.blocked,
              noOffer: l.noOffer,
              readyPct: Math.round((l.ready / l.total) * 100),
            }
          : null;
      },
    ),
    computed(
      {
        name: "lineNote",
        type: "text",
        label: { en: "Lines", ar: "البنود" },
        admin: {
          condition: () => false,
          description: { en: "Of how many lines, and how many are blocked.", ar: "من أصل كم بندًا، وكم منها متوقف." },
        },
      },
      (c, req) => {
        const l = lineCounts(c);
        const of = inLanguage(req, { en: `of ${l.total}`, ar: `من ${l.total}` });
        const blocked = l.blocked ? inLanguage(req, { en: `${l.blocked} blocked`, ar: `${l.blocked} متوقف` }) : "";
        return l.total ? [of, blocked].filter(Boolean).join(" · ") : null;
      },
    ),
    computed(
      {
        name: "flag",
        type: "select",
        label: { en: "Urgency", ar: "الاستعجال" },
        options: [{ value: "Urgent", label: { en: "Urgent", ar: "عاجل" } }],
        custom: tones({ Urgent: "error" }),
        admin: {
          condition: () => false,
          description: { en: "Shows Urgent when the case is marked urgent.", ar: "تظهر «عاجل» عندما يُعلَّم الملف عاجلًا." },
        },
      },
      (c) => (c.urgent === true ? "Urgent" : null),
    ),
    computed(
      {
        name: "canReassign",
        type: "checkbox",
        label: { en: "Can Reassign", ar: "يمكن إعادة الإسناد" },
        admin: {
          condition: () => false,
          description: { en: "Whether the reader may hand this case over.", ar: "هل يحق للقارئ تسليم هذا الملف." },
        },
      },
      (c, req) => mayReassign(c, req.user as Reader),
    ),
    computed(
      {
        name: "handoverTeam",
        type: "json",
        label: { en: "Handover Team", ar: "فريق التسليم" },
        admin: {
          condition: () => false,
          description: { en: "The people this case can be handed to.", ar: "الأشخاص الذين يمكن تسليم الملف إليهم." },
        },
      },
      async (c, req) =>
        (await desk(req))
          .filter((u) => u.id !== idOf(c.owner))
          .map((u) => ({
            label: `${scalar(u.name)}${u.id === idOf(c.backup) ? inLanguage(req, { en: " (backup)", ar: " (احتياطي)" }) : ""}`,
            value: u.id,
          })),
    ),
  ],
};
