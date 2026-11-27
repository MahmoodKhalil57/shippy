import type { CollectionConfig, PayloadRequest } from "payload";
import { formats, tones } from "saastemlycrm-design-system/contracts";
import {
  CONTACT_RULE_OPTIONS,
  CURRENCIES,
  PORT_OPTIONS,
  STORES,
  STORE_OPTIONS,
  choices,
  computed,
  inLanguage,
  deskAccess,
  idOf,
  isManagement,
  logActivity,
  OUTSTANDING_RFQ_STATUSES,
  words,
} from "./shared.ts";

async function openRfqs(req: PayloadRequest): Promise<Record<string, unknown>[]> {
  const ctx = (req.context ??= {}) as { openRfqs?: Promise<Record<string, unknown>[]> };
  ctx.openRfqs ??= req.payload
    .find({
      collection: "supplier-rfqs",
      where: { status: { in: OUTSTANDING_RFQ_STATUSES } },
      limit: 0,
      depth: 0,
      pagination: false,
    } as never)
    .then((r) => r.docs as unknown as Record<string, unknown>[])
    .catch(() => []);
  return ctx.openRfqs;
}

export const CATEGORIES = [
  "Chemicals",
  "Deck & engine stores",
  "Deck stores",
  "Engine spares",
  "Paints",
  "Safety & PPE",
  "Welding",
  "Adhesives",
  "Lubricants",
  ...STORES.filter((s) => s !== "Deck stores"),
];
const CATEGORY_OPTIONS = [
  ...choices(CATEGORIES.slice(0, 9), {
    Chemicals: "الكيماويات",
    "Deck & engine stores": "مستلزمات السطح والمحركات",
    "Deck stores": "مستلزمات سطح السفينة",
    "Engine spares": "قطع غيار المحركات",
    Paints: "الدهانات",
    "Safety & PPE": "السلامة ومعدات الوقاية",
    Welding: "اللحام",
    Adhesives: "المواد اللاصقة",
    Lubricants: "مواد التشحيم",
  }),
  ...STORE_OPTIONS.filter((o) => o.value !== "Deck stores"),
];

const contactsField = {
  name: "contacts",
  type: "array" as const,
  label: { en: "Contacts", ar: "جهات الاتصال" },
  labels: { singular: { en: "Contact", ar: "جهة اتصال" }, plural: { en: "Contacts", ar: "جهات الاتصال" } },
  admin: {
    description: {
      en: "People at the company we write to, with the channel they answer on.",
      ar: "الأشخاص الذين نراسلهم في الشركة، مع القناة التي يردّون عليها.",
    },
  },
  fields: [
    {
      type: "row" as const,
      fields: [
        {
          name: "name",
          type: "text" as const,
          label: { en: "Name", ar: "الاسم" },
          required: true,
          admin: {
            description: { en: "Full name of the person.", ar: "الاسم الكامل للشخص." },
            placeholder: { en: "e.g. Anders Nordvik", ar: "مثال: Anders Nordvik" },
          },
        },
        {
          name: "role",
          type: "text" as const,
          label: { en: "Role", ar: "الدور" },
          admin: {
            description: {
              en: "Their job title, so we know who decides what.",
              ar: "المسمى الوظيفي، لنعرف من يقرر ماذا.",
            },
            placeholder: { en: "e.g. Purchasing manager", ar: "مثال: مدير المشتريات" },
          },
        },
      ],
    },
    {
      type: "row" as const,
      fields: [
        {
          name: "email",
          type: "email" as const,
          label: { en: "Email", ar: "البريد الإلكتروني" },
          admin: {
            description: {
              en: "Where RFQs and quotations are sent.",
              ar: "العنوان الذي تُرسل إليه طلبات العروض وعروض الأسعار.",
            },
            placeholder: { en: "e.g. purchasing@nordvik.example", ar: "مثال: purchasing@nordvik.example" },
          },
        },
        {
          name: "phone",
          type: "text" as const,
          label: { en: "Phone", ar: "الهاتف" },
          admin: {
            description: {
              en: "Direct line or mobile, with country code.",
              ar: "الخط المباشر أو الجوال، مع رمز الدولة.",
            },
            placeholder: { en: "e.g. +47 22 33 44 55", ar: "مثال: +47 22 33 44 55" },
          },
        },
        {
          name: "preferredChannel",
          type: "select" as const,
          label: { en: "Preferred Channel", ar: "القناة المفضلة" },
          options: [
            { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
            { value: "Phone", label: { en: "Phone", ar: "الهاتف" } },
            { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
          ],
          defaultValue: "Email",
          admin: {
            description: {
              en: "How this person prefers to be reached first.",
              ar: "الطريقة المفضلة للتواصل مع هذا الشخص أولًا.",
            },
            placeholder: words({ en: "Pick a channel", ar: "اختر قناة" }),
          },
        },
      ],
    },
  ],
};

const CONTACT_NOTE: Record<string, { en: string; ar: string }> = {
  allowed: {
    en: "Follow-ups allowed, drafted for a person to send.",
    ar: "المتابعات مسموحة، وتُصاغ ليرسلها شخص.",
  },
  "one-follow-up": {
    en: "One customer follow-up per quotation; after that, internal reminders only.",
    ar: "متابعة واحدة للعميل لكل عرض سعر؛ بعدها تذكيرات داخلية فقط.",
  },
  "do-not-chase": {
    en: "Follow-ups for this customer are internal reminders only — the system refuses customer-facing chasers.",
    ar: "متابعات هذا العميل تذكيرات داخلية فقط — ويرفض النظام أي متابعة موجّهة إلى العميل.",
  },
};

export const Customers: CollectionConfig = {
  slug: "customers",
  labels: { singular: { en: "Customer", ar: "عميل" }, plural: { en: "Customers", ar: "العملاء" } },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "country", "contactRule", "doNotChase"],
    group: { en: "Directory", ar: "الدليل" },
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.contactRule) data.doNotChase = data.contactRule === "do-not-chase";
        else if (data.doNotChase) data.contactRule = "do-not-chase";
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Account", ar: "الحساب" },
          fields: [
            {
              name: "name",
              type: "text",
              label: { en: "Name", ar: "الاسم" },
              required: true,
              unique: true,
              admin: {
                description: { en: "The company's registered trading name.", ar: "الاسم التجاري المسجّل للشركة." },
                placeholder: { en: "e.g. Nordvik Ship Management", ar: "مثال: Nordvik Ship Management" },
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "type",
                  type: "select",
                  label: { en: "Type", ar: "النوع" },
                  options: [
                    { value: "Ship manager", label: { en: "Ship manager", ar: "مدير سفن" } },
                    { value: "Shipowner", label: { en: "Shipowner", ar: "مالك سفن" } },
                    { value: "Offshore / oil & gas", label: { en: "Offshore / oil & gas", ar: "أوفشور / نفط وغاز" } },
                    { value: "Industrial", label: { en: "Industrial", ar: "صناعي" } },
                    { value: "Shipyard / repair", label: { en: "Shipyard / repair", ar: "حوض بناء / إصلاح" } },
                  ],
                  admin: {
                    description: { en: "What kind of business they run.", ar: "نوع النشاط الذي تمارسه." },
                    placeholder: words({ en: "Pick a type", ar: "اختر نوعًا" }),
                  },
                },
                {
                  name: "segment",
                  type: "select",
                  label: { en: "Segment", ar: "الشريحة" },
                  options: [
                    { value: "Marine", label: { en: "Marine", ar: "بحري" } },
                    { value: "Offshore", label: { en: "Offshore", ar: "أوفشور" } },
                    { value: "Onshore", label: { en: "Onshore", ar: "بري" } },
                    { value: "Oil & gas", label: { en: "Oil & gas", ar: "النفط والغاز" } },
                    { value: "Shipbuilding & repair", label: { en: "Shipbuilding & repair", ar: "بناء وإصلاح السفن" } },
                    { value: "Industrial", label: { en: "Industrial", ar: "صناعي" } },
                  ],
                  admin: {
                    description: {
                      en: "The market they belong to, used for sales reporting.",
                      ar: "السوق الذي تنتمي إليه، لتقارير المبيعات.",
                    },
                    placeholder: words({ en: "Pick a segment", ar: "اختر قطاعًا" }),
                  },
                },
                {
                  name: "country",
                  type: "text",
                  label: { en: "Country", ar: "الدولة" },
                  admin: {
                    description: { en: "Where the company is based.", ar: "مقر الشركة." },
                    placeholder: { en: "e.g. Norway", ar: "مثال: النرويج" },
                  },
                },
              ],
            },
            {
              name: "contactEmail",
              type: "email",
              label: { en: "Contact Email", ar: "بريد التواصل" },
              admin: {
                description: {
                  en: "The shared mailbox for quotations and invoices.",
                  ar: "البريد المشترك لعروض الأسعار والفواتير.",
                },
                placeholder: { en: "e.g. purchasing@nordvik.example", ar: "مثال: purchasing@nordvik.example" },
              },
            },
            {
              name: "leadSource",
              type: "text",
              label: { en: "Lead Source", ar: "مصدر العميل المحتمل" },
              admin: {
                description: { en: "How we first met them.", ar: "كيف تعرّفنا عليهم أول مرة." },
                placeholder: { en: "e.g. Port agent introduction", ar: "مثال: تعريف من وكيل الميناء" },
              },
            },
            {
              name: "portPreferences",
              type: "select",
              label: { en: "Port Preferences", ar: "الموانئ المفضلة" },
              hasMany: true,
              options: PORT_OPTIONS,
              admin: {
                description: {
                  en: "Ports where their vessels usually call for stores.",
                  ar: "الموانئ التي ترسو فيها سفنهم عادةً للتزوّد.",
                },
                placeholder: words({ en: "e.g. Port Said", ar: "مثال: بورسعيد" }),
              },
            },
            contactsField,
          ],
        },
        {
          label: { en: "Commercial", ar: "التجاري" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "billingEntity",
                  type: "text",
                  label: { en: "Billing Entity", ar: "جهة الفوترة" },
                  admin: {
                    description: {
                      en: "The legal entity invoices are issued to.",
                      ar: "الكيان القانوني الذي تصدر له الفواتير.",
                    },
                    placeholder: { en: "e.g. Nordvik Ship Management AS", ar: "مثال: Nordvik Ship Management AS" },
                  },
                },
                {
                  name: "taxId",
                  type: "text",
                  label: { en: "Tax / VAT ID", ar: "الرقم الضريبي / ضريبة القيمة المضافة" },
                  admin: {
                    description: {
                      en: "Their tax number, printed on every invoice.",
                      ar: "رقمهم الضريبي، يُطبع على كل فاتورة.",
                    },
                    placeholder: { en: "e.g. NO 912 345 678 MVA", ar: "مثال: NO 912 345 678 MVA" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "paymentTermsDays",
                  type: "number",
                  label: { en: "Payment terms (days)", ar: "شروط الدفع (أيام)" },
                  min: 0,
                  admin: {
                    description: {
                      en: "Days after invoice date they agreed to pay.",
                      ar: "الأيام بعد تاريخ الفاتورة التي اتفقوا على الدفع خلالها.",
                    },
                    placeholder: { en: "e.g. 30", ar: "مثال: 30" },
                  },
                },
                {
                  name: "currency",
                  type: "select",
                  label: { en: "Currency", ar: "العملة" },
                  options: CURRENCIES,
                  defaultValue: "USD",
                  admin: {
                    description: {
                      en: "The currency we quote and invoice them in.",
                      ar: "العملة التي نسعّر ونفوتر بها.",
                    },
                    placeholder: words({ en: "USD", ar: "USD" }),
                  },
                },
                {
                  name: "creditLimit",
                  type: "number",
                  label: { en: "Credit limit (USD)", ar: "حد الائتمان (USD)" },
                  min: 0,
                  admin: {
                    description: {
                      en: "The most we allow them to owe at once.",
                      ar: "أقصى مبلغ نسمح بأن يكون مستحقًا عليهم في وقت واحد.",
                    },
                    placeholder: { en: "e.g. 50,000", ar: "مثال: 50,000" },
                  },
                },
              ],
            },
            {
              name: "registration",
              type: "group",
              label: {
                en: "Vendor registration (Golden Sea as their approved supplier)",
                ar: "تسجيل المورّد (Golden Sea مورّدًا معتمدًا لديهم)",
              },
              admin: {
                description: {
                  en: "Where we stand as an approved supplier on their vendor list.",
                  ar: "موقفنا كمورّد معتمد في قائمة مورّديهم.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "status",
                      type: "select",
                      label: { en: "Status", ar: "الحالة" },
                      options: [
                        { value: "Not registered", label: { en: "Not registered", ar: "غير مسجّل" } },
                        { value: "Documents requested", label: { en: "Documents requested", ar: "طُلبت المستندات" } },
                        { value: "Under review", label: { en: "Under review", ar: "قيد المراجعة" } },
                        { value: "Approved vendor", label: { en: "Approved vendor", ar: "مورّد معتمد" } },
                        { value: "Renewal overdue", label: { en: "Renewal overdue", ar: "التجديد متأخر" } },
                      ],
                      admin: {
                        description: {
                          en: "How far their vendor approval of us has got.",
                          ar: "مدى تقدّم اعتمادهم لنا كمورّد.",
                        },
                        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
                      },
                    },
                    {
                      name: "portal",
                      type: "text",
                      label: { en: "Portal / method", ar: "البوابة / الطريقة" },
                      admin: {
                        description: {
                          en: "Where we keep our listing with them.",
                          ar: "المكان الذي نحتفظ فيه بتسجيلنا لديهم.",
                        },
                        placeholder: { en: "e.g. Nordvik supplier portal", ar: "مثال: بوابة موردي Nordvik" },
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "since",
                      type: "date",
                      label: { en: "Since", ar: "منذ" },
                      admin: {
                        description: {
                          en: "The day they approved us as a vendor.",
                          ar: "اليوم الذي اعتمدونا فيه كمورّد.",
                        },
                      },
                    },
                    {
                      name: "renewBy",
                      type: "date",
                      label: { en: "Renew By", ar: "التجديد قبل" },
                      admin: {
                        description: {
                          en: "The date the approval lapses unless we renew.",
                          ar: "تاريخ انتهاء الاعتماد ما لم نجدّده.",
                        },
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
      name: "contactRule",
      type: "select",
      label: { en: "Contact rule", ar: "قاعدة التواصل" },
      options: CONTACT_RULE_OPTIONS,
      custom: {
        ...tones({ allowed: "success", "one-follow-up": "warning", "do-not-chase": "error" }),
        about: {
          en: "Applied to every follow-up and reminder automation, so no chaser goes out against this rule.",
          ar: "تُطبَّق على كل متابعة وتذكير آلي، فلا تخرج متابعة تخالف هذه القاعدة.",
        },
      },
      defaultValue: "allowed",
      admin: {
        position: "sidebar",
        description: { en: "Sets how often we may chase this customer.", ar: "تحدد عدد مرات متابعة هذا العميل." },
        placeholder: words({ en: "Pick a rule", ar: "اختر قاعدة" }),
      },
    },
    computed(
      {
        name: "contactNote",
        type: "text",
        label: { en: "What it means", ar: "معناها" },
        admin: {
          position: "sidebar",
          description: {
            en: "The contact rule in plain words, for whoever is about to write.",
            ar: "قاعدة التواصل بكلمات بسيطة، لمن يوشك أن يكتب.",
          },
        },
      },
      (c, req) =>
        inLanguage(
          req,
          CONTACT_NOTE[typeof c.contactRule === "string" ? c.contactRule : "allowed"] ?? CONTACT_NOTE.allowed!,
        ),
    ),
    {
      name: "doNotChase",
      type: "checkbox",
      label: { en: "Do not chase", ar: "عدم المتابعة" },
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: {
          en: "Tick to stop all customer status requests.",
          ar: "حدّد لإيقاف كل طلبات الاستفسار عن الحالة لدى العميل.",
        },
      },
      custom: {
        about: {
          en: "Never send status requests to this customer; internal reminders only.",
          ar: "لا تُرسل أبدًا استفسارات حالة لهذا العميل؛ تذكيرات داخلية فقط.",
        },
      },
    },
    {
      name: "accountOwner",
      type: "relationship",
      label: { en: "Account Owner", ar: "مسؤول الحساب" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: {
          en: "The Golden Sea person who looks after them.",
          ar: "الشخص في Golden Sea الذي يتولى أمورهم.",
        },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
    {
      name: "fleetSize",
      type: "number",
      label: { en: "Vessels in fleet (total)", ar: "السفن في الأسطول (الإجمالي)" },
      min: 0,
      admin: {
        position: "sidebar",
        description: {
          en: "All vessels they own or manage, not only ours.",
          ar: "كل السفن التي يملكونها أو يديرونها، لا سفننا فقط.",
        },
        placeholder: { en: "e.g. 14", ar: "مثال: 14" },
      },
    },
    {
      name: "vessels",
      type: "join",
      collection: "vessels",
      on: "customer",
      admin: {
        defaultColumns: ["name", "imo", "vesselType"],
        description: { en: "The vessels we know for this customer.", ar: "السفن التي نعرفها لهذا العميل." },
      },
    },
  ],
};

export const Vessels: CollectionConfig = {
  slug: "vessels",
  labels: { singular: { en: "Vessel", ar: "سفينة" }, plural: { en: "Vessels", ar: "السفن" } },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "imo", "vesselType", "customer"],
    group: { en: "Directory", ar: "الدليل" },
  },
  access: deskAccess,
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          label: { en: "Name", ar: "الاسم" },
          required: true,
          admin: {
            description: { en: "The vessel's name as on her papers.", ar: "اسم السفينة كما في أوراقها." },
            placeholder: { en: "e.g. MV Nordic Star", ar: "مثال: MV Nordic Star" },
          },
        },
        {
          name: "imo",
          type: "text",
          label: { en: "IMO", ar: "IMO" },
          unique: true,
          admin: {
            description: {
              en: "The 7-digit IMO number; it identifies the ship.",
              ar: "رقم IMO المكوّن من 7 أرقام؛ يحدد هوية السفينة.",
            },
            placeholder: { en: "e.g. 9811204", ar: "مثال: 9811204" },
          },
          validate: (value: unknown) =>
            value == null ||
            value === "" ||
            (typeof value === "string" && /^\d{7}$/.test(value)) ||
            "IMO numbers have 7 digits.",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "vesselType",
          type: "select",
          label: { en: "Vessel Type", ar: "نوع السفينة" },
          options: [
            { value: "Bulk carrier", label: { en: "Bulk carrier", ar: "ناقلة بضائع سائبة" } },
            { value: "Tanker", label: { en: "Tanker", ar: "ناقلة" } },
            { value: "Container", label: { en: "Container", ar: "حاويات" } },
            { value: "General cargo", label: { en: "General cargo", ar: "بضائع عامة" } },
            { value: "Reefer", label: { en: "Reefer", ar: "سفينة مبرّدة" } },
            { value: "Offshore supply", label: { en: "Offshore supply", ar: "إمداد بحري" } },
            { value: "Platform / rig", label: { en: "Platform / rig", ar: "منصة / حفار" } },
            { value: "Ferry", label: { en: "Ferry", ar: "عبّارة" } },
          ],
          admin: {
            description: {
              en: "Decides which stores she is likely to need.",
              ar: "يحدد المستلزمات التي يُرجَّح أن تحتاجها.",
            },
            placeholder: words({ en: "Pick a vessel type", ar: "اختر نوع السفينة" }),
          },
        },
        {
          name: "flag",
          type: "text",
          label: { en: "Flag", ar: "العلم" },
          admin: {
            description: { en: "The country she is registered in.", ar: "الدولة المسجّلة فيها." },
            placeholder: { en: "e.g. Panama", ar: "مثال: بنما" },
          },
        },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      label: { en: "Manager / owner", ar: "المدير / المالك" },
      admin: {
        description: { en: "The customer who orders stores for her.", ar: "العميل الذي يطلب لها المستلزمات." },
        placeholder: words({ en: "Search customers", ar: "ابحث في العملاء" }),
      },
    },
    {
      name: "manager",
      type: "text",
      label: { en: "Managing office", ar: "المكتب المسؤول" },
      admin: {
        description: {
          en: "The office or desk that handles her purchasing.",
          ar: "المكتب أو القسم الذي يتولى مشترياتها.",
        },
        placeholder: { en: "e.g. Nordvik Oslo fleet desk", ar: "مثال: مكتب أسطول Nordvik في أوسلو" },
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: { en: "Notes", ar: "ملاحظات" },
      localized: true,
      admin: {
        description: {
          en: "Anything useful at delivery, like berth or agent.",
          ar: "أي معلومة مفيدة عند التسليم، مثل الرصيف أو الوكيل.",
        },
        placeholder: {
          en: "e.g. Usually calls at Port Said, agent is Suez Marine.",
          ar: "مثال: ترسو عادةً في بورسعيد، والوكيل Suez Marine.",
        },
      },
    },
  ],
};

export const Suppliers: CollectionConfig = {
  slug: "suppliers",
  labels: { singular: { en: "Supplier", ar: "مورّد" }, plural: { en: "Suppliers", ar: "الموردون" } },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "city", "status", "onTime"],
    group: { en: "Directory", ar: "الدليل" },
  },
  access: deskAccess,
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const before = previousDoc?.bank?.iban;
        if (operation === "update" && doc.bank?.iban && before && doc.bank.iban !== before) {
          await logActivity(req, {
            kind: "alert",
            entity: `suppliers/${doc.id}`,
            text: {
              en: `Bank details changed for ${doc.name} — verification and two-person approval required before any payment.`,
              ar: `تغيّرت البيانات البنكية لـ ${doc.name} — يلزم التحقق وموافقة شخصين قبل أي دفعة.`,
            },
          });
        }
        return doc;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (originalDoc?.bank?.iban && data.bank?.iban && data.bank.iban !== originalDoc.bank.iban) {
          data.bank = { ...data.bank, verified: false, verifiedBy: null, verifiedAt: null };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Supplier", ar: "المورّد" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: { en: "Name", ar: "الاسم" },
                  required: true,
                  unique: true,
                  admin: {
                    description: { en: "The supplier's trading name.", ar: "الاسم التجاري للمورّد." },
                    placeholder: { en: "e.g. Delta Marine Chandlers", ar: "مثال: Delta Marine Chandlers" },
                  },
                },
                {
                  name: "city",
                  type: "text",
                  label: { en: "City", ar: "المدينة" },
                  admin: {
                    description: { en: "Where their warehouse or office is.", ar: "موقع مستودعهم أو مكتبهم." },
                    placeholder: { en: "e.g. Alexandria", ar: "مثال: الإسكندرية" },
                  },
                },
                {
                  name: "country",
                  type: "text",
                  label: { en: "Country", ar: "الدولة" },
                  defaultValue: "Egypt",
                  admin: {
                    description: { en: "The country they ship from.", ar: "الدولة التي يشحنون منها." },
                    placeholder: { en: "e.g. Egypt", ar: "مثال: مصر" },
                  },
                },
              ],
            },
            {
              name: "categories",
              type: "select",
              label: { en: "Categories", ar: "الفئات" },
              hasMany: true,
              options: CATEGORY_OPTIONS,
              admin: {
                description: {
                  en: "What they sell, used to pick who gets an RFQ.",
                  ar: "ما يبيعونه، لاختيار من يتلقى طلب العرض.",
                },
                placeholder: words({ en: "e.g. Engine spares", ar: "مثال: قطع غيار المحركات" }),
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "currency",
                  type: "select",
                  label: { en: "Currency", ar: "العملة" },
                  options: CURRENCIES,
                  defaultValue: "EGP",
                  admin: {
                    description: { en: "The currency they quote in.", ar: "العملة التي يسعّرون بها." },
                    placeholder: words({ en: "EGP", ar: "EGP" }),
                  },
                },
                {
                  name: "terms",
                  type: "text",
                  label: { en: "Payment terms", ar: "شروط الدفع" },
                  admin: {
                    description: { en: "When they expect to be paid.", ar: "متى يتوقعون الدفع." },
                    placeholder: { en: "e.g. 30 days from delivery", ar: "مثال: 30 يومًا من التسليم" },
                  },
                },
              ],
            },
            {
              name: "contact",
              type: "text",
              label: { en: "Main contact", ar: "جهة الاتصال الرئيسية" },
              admin: {
                description: { en: "The person to call first.", ar: "الشخص الذي يُتصل به أولًا." },
                placeholder: { en: "e.g. Hossam Fathy", ar: "مثال: حسام فتحي" },
              },
            },
            {
              name: "emailDomain",
              type: "text",
              label: { en: "Email Domain", ar: "نطاق البريد" },
              admin: {
                description: {
                  en: "Lets us match incoming replies to this supplier.",
                  ar: "يتيح مطابقة الردود الواردة بهذا المورّد.",
                },
                placeholder: { en: "e.g. deltamarine.example", ar: "مثال: deltamarine.example" },
              },
            },
            contactsField,
          ],
        },
        {
          label: { en: "Performance", ar: "الأداء" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "replyHrs",
                  type: "number",
                  label: { en: "Average reply (hours)", ar: "متوسط الرد (ساعات)" },
                  min: 0,
                  admin: {
                    description: {
                      en: "How long they take to answer an RFQ.",
                      ar: "المدة التي يستغرقونها للرد على طلب العرض.",
                    },
                    placeholder: { en: "e.g. 18", ar: "مثال: 18" },
                  },
                  custom: {
                    number: { unit: "hours" as const },
                    toneWhen: [{ when: { replyHrs: { greater_than: 24 } }, tone: "warning" }],
                  },
                },
                {
                  name: "onTime",
                  type: "number",
                  label: { en: "On-time delivery %", ar: "التسليم في الموعد %" },
                  min: 0,
                  max: 100,
                  admin: {
                    description: {
                      en: "Share of orders delivered on the promised date.",
                      ar: "نسبة الطلبات المسلّمة في الموعد المتفق عليه.",
                    },
                    placeholder: { en: "e.g. 92", ar: "مثال: 92" },
                  },
                  custom: {
                    ...formats.percent(0),
                    gauge: { max: 100 },
                    toneWhen: [
                      { when: { onTime: { less_than: 85 } }, tone: "warning" },
                      { when: {}, tone: "success" },
                    ],
                  },
                },
                {
                  name: "compliance",
                  type: "number",
                  label: { en: "Compliant offers %", ar: "العروض المطابقة %" },
                  min: 0,
                  max: 100,
                  admin: {
                    description: {
                      en: "Share of offers that matched the RFQ spec.",
                      ar: "نسبة العروض المطابقة لمواصفات الطلب.",
                    },
                    placeholder: { en: "e.g. 88", ar: "مثال: 88" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "rfqCount",
                  type: "number",
                  label: { en: "RFQs received", ar: "طلبات العروض المستلمة" },
                  min: 0,
                  admin: {
                    readOnly: true,
                    description: {
                      en: "How many RFQs we have sent them.",
                      ar: "عدد طلبات العروض التي أرسلناها إليهم.",
                    },
                  },
                },
                {
                  name: "poCount",
                  type: "number",
                  label: { en: "POs placed", ar: "أوامر الشراء الصادرة" },
                  min: 0,
                  admin: {
                    readOnly: true,
                    description: {
                      en: "How many purchase orders we gave them.",
                      ar: "عدد أوامر الشراء التي أعطيناها لهم.",
                    },
                  },
                },
                computed(
                  {
                    name: "openRfqs",
                    type: "number",
                    label: { en: "Open RFQs", ar: "طلبات العروض المفتوحة" },
                    admin: {
                      description: {
                        en: "RFQs sent to them and not fully answered yet.",
                        ar: "طلبات عروض أُرسلت إليهم ولم يُرد عليها كاملًا بعد.",
                      },
                    },
                  },
                  async (s, req) => (await openRfqs(req)).filter((r) => idOf(r.supplier) === s.id).length,
                ),
              ],
            },
          ],
        },
        {
          label: { en: "Bank", ar: "البنك" },
          fields: [
            {
              name: "bank",
              type: "group",
              label: { en: "Bank", ar: "البنك" },
              admin: {
                description: {
                  en: "Where we pay them; a change needs verification first.",
                  ar: "مكان دفعنا لهم؛ أي تغيير يحتاج تحققًا أولًا.",
                },
              },
              access: { read: ({ req }) => Boolean(req.user) },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "beneficiary",
                      type: "text",
                      label: { en: "Beneficiary", ar: "المستفيد" },
                      admin: {
                        description: {
                          en: "The account holder's name, as the bank has it.",
                          ar: "اسم صاحب الحساب كما لدى البنك.",
                        },
                        placeholder: { en: "e.g. Delta Marine Chandlers LLC", ar: "مثال: Delta Marine Chandlers LLC" },
                      },
                    },
                    {
                      name: "bankName",
                      type: "text",
                      label: { en: "Bank Name", ar: "اسم البنك" },
                      admin: {
                        description: { en: "The bank that holds the account.", ar: "البنك الذي يحتفظ بالحساب." },
                        placeholder: { en: "e.g. Banque Misr", ar: "مثال: بنك مصر" },
                      },
                    },
                  ],
                },
                {
                  name: "iban",
                  type: "text",
                  label: { en: "IBAN / account", ar: "IBAN / الحساب" },
                  admin: {
                    description: { en: "Changing it resets verification.", ar: "تغييره يعيد التحقق من البداية." },
                    placeholder: {
                      en: "e.g. EG380019000500000000263180002",
                      ar: "مثال: EG380019000500000000263180002",
                    },
                  },
                  custom: {
                    about: {
                      en: "A change is logged as an alert and needs verification and two-person approval before any payment.",
                      ar: "يُسجَّل أي تغيير كتنبيه ويحتاج تحققًا وموافقة شخصين قبل أي دفعة.",
                    },
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "verified",
                      type: "checkbox",
                      label: { en: "Verified", ar: "موثّق" },
                      defaultValue: false,
                      admin: {
                        description: {
                          en: "Tick once the details were confirmed with the supplier.",
                          ar: "حدّد بعد تأكيد البيانات مع المورّد.",
                        },
                      },
                    },
                    {
                      name: "verifiedBy",
                      type: "relationship",
                      label: { en: "Verified By", ar: "وثّقه" },
                      relationTo: "users",
                      admin: {
                        description: { en: "Who confirmed the bank details.", ar: "من أكّد البيانات البنكية." },
                        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
                      },
                    },
                    {
                      name: "verifiedAt",
                      type: "date",
                      label: { en: "Verified At", ar: "تاريخ التوثيق" },
                      admin: {
                        description: {
                          en: "The day the bank details were confirmed.",
                          ar: "يوم تأكيد البيانات البنكية.",
                        },
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
      name: "kind",
      type: "select",
      label: { en: "Kind", ar: "النوع" },
      defaultValue: "local",
      options: [
        { label: { en: "Local / regional supplier", ar: "مورّد محلي / إقليمي" }, value: "local" },
        { label: { en: "Agency principal (pricelist)", ar: "وكيل أصلي (قائمة أسعار)" }, value: "agency" },
        { label: { en: "Own stock", ar: "مخزوننا" }, value: "own-stock" },
      ],
      admin: {
        position: "sidebar",
        description: {
          en: "Local supplier, agency pricelist or our own stock.",
          ar: "مورّد محلي، أو قائمة أسعار وكالة، أو مخزوننا.",
        },
        placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
      },
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      defaultValue: "Approved",
      options: [
        { value: "New", label: { en: "New", ar: "جديد" } },
        { value: "Trial", label: { en: "Trial", ar: "تجريبي" } },
        { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
        { value: "On watch", label: { en: "On watch", ar: "تحت المراقبة" } },
        { value: "Blocked", label: { en: "Blocked", ar: "متوقف" } },
      ],
      access: { update: isManagement },
      admin: {
        position: "sidebar",
        description: {
          en: "Only management can approve or block a supplier.",
          ar: "الإدارة وحدها تعتمد المورّد أو تحظره.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    {
      name: "source",
      type: "text",
      label: { en: "Source", ar: "المصدر" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "How the record was created, like an email reply.",
          ar: "طريقة إنشاء السجل، مثل رد بالبريد.",
        },
      },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: { en: "Media", ar: "ملف وسائط" }, plural: { en: "Media", ar: "الوسائط" } },
  upload: true,
  admin: { useAsTitle: "filename", group: { en: "Directory", ar: "الدليل" } },
  access: deskAccess,
  fields: [
    {
      name: "alt",
      type: "text",
      label: { en: "Alt text", ar: "النص البديل" },
      admin: {
        description: { en: "A short description of what the file shows.", ar: "وصف قصير لما يعرضه الملف." },
        placeholder: { en: "e.g. Signed delivery note, MV Nordic Star", ar: "مثال: إذن تسليم موقّع، MV Nordic Star" },
      },
    },
    {
      name: "kind",
      type: "select",
      label: { en: "Kind", ar: "النوع" },
      options: [
        { value: "RFQ attachment", label: { en: "RFQ attachment", ar: "مرفق طلب العرض" } },
        { value: "Supplier offer", label: { en: "Supplier offer", ar: "عرض مورّد" } },
        { value: "Certificate", label: { en: "Certificate", ar: "شهادة" } },
        { value: "SDS / TDS", label: { en: "SDS / TDS", ar: "SDS / TDS" } },
        { value: "Delivery note / POD", label: { en: "Delivery note / POD", ar: "إذن تسليم / إثبات تسليم" } },
        { value: "Customer PO", label: { en: "Customer PO", ar: "أمر شراء العميل" } },
        { value: "Portal receipt", label: { en: "Portal receipt", ar: "إيصال البوابة" } },
        { value: "Other", label: { en: "Other", ar: "أخرى" } },
      ],
      admin: {
        description: { en: "What the file is, so it can be found later.", ar: "ماهية الملف، ليُعثر عليه لاحقًا." },
        placeholder: words({ en: "Pick a file kind", ar: "اختر نوع الملف" }),
      },
    },
  ],
};
