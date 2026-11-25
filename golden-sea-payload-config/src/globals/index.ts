import type { Field, GlobalConfig, PayloadRequest } from "payload";
import {
  CURRENCIES,
  DAY,
  ROLE_OPTIONS,
  STORE_OPTIONS,
  TODAY,
  anyone,
  choices,
  inLanguage,
  loggedIn,
  management,
  type Words,
  asText,
  words,
} from "../collections/shared.ts";
import { formats, tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import { approvalRulesBefore } from "../pages/approval-rules.ts";
import { Assistant, Branding } from "./dashboard.ts";

const managementOnly: GlobalConfig["access"] = { read: anyone, update: management };
const staffRead: GlobalConfig["access"] = { read: loggedIn, update: management };

export const LANGUAGES = [
  { label: { en: "English", ar: "الإنجليزية" }, value: "en" },
  { label: { en: "العربية (Arabic)", ar: "العربية" }, value: "ar" },
];

export const PERMISSIONS = [
  {
    key: "clientInfo",
    label: "Client info",
    hint: "Lets the role open customers, vessels and cases.",
    enforced: "Read access on customers, vessels and cases",
    ar: { label: "بيانات العملاء", hint: "يتيح للدور فتح العملاء والسفن والملفات." },
  },
  {
    key: "supplierCosts",
    label: "Supplier costs",
    hint: "Lets the role see what suppliers charge. Hidden from Sales.",
    enforced: "Field access on offers, supplier prices and case pricing (hidden from Sales)",
    ar: { label: "تكاليف الموردين", hint: "يتيح للدور رؤية أسعار الموردين. مخفي عن المبيعات." },
  },
  {
    key: "margins",
    label: "Margins",
    hint: "Lets the role see line margins and profit. Hidden from Sales.",
    enforced: "Field access on line margins and profit (hidden from Sales)",
    ar: { label: "الهوامش", hint: "يتيح للدور رؤية هوامش البنود والربح. مخفي عن المبيعات." },
  },
  {
    key: "approveQuotes",
    label: "Approve quotes & discounts",
    hint: "Lets the role approve customer quotations and discounts.",
    enforced: "Approval rules: customer quotation, discount",
    ar: { label: "اعتماد العروض والخصومات", hint: "يتيح للدور اعتماد عروض أسعار العملاء والخصومات." },
  },
  {
    key: "approvePOs",
    label: "Approve supplier POs",
    hint: "Lets the role approve purchase orders to suppliers.",
    enforced: "Approval rules: supplier PO",
    ar: { label: "اعتماد أوامر شراء الموردين", hint: "يتيح للدور اعتماد أوامر الشراء للموردين." },
  },
  {
    key: "approvePayments",
    label: "Approve payments & bank changes",
    hint: "Lets the role approve deposits, payments and bank detail changes.",
    enforced: "Approval rules: deposits and payments; bank changes need two people",
    ar: {
      label: "اعتماد المدفوعات وتغييرات البنك",
      hint: "يتيح للدور اعتماد الدفعات المقدمة والمدفوعات وتغيير البيانات البنكية.",
    },
  },
  {
    key: "sendExternal",
    label: "Send external messages",
    hint: "Lets the role email or message customers and suppliers.",
    enforced: "Only approved templates send automatically; anything else is sent by a person",
    ar: { label: "إرسال رسائل خارجية", hint: "يتيح للدور مراسلة العملاء والموردين بالبريد أو الرسائل." },
  },
  {
    key: "accounting",
    label: "Accounting postings",
    hint: "Lets the role post invoices, bills and payments.",
    enforced: "Create / update on invoices, bills and payments",
    ar: { label: "القيود المحاسبية", hint: "يتيح للدور ترحيل الفواتير وفواتير الموردين والمدفوعات." },
  },
] as const;

async function namesByRole(req: PayloadRequest): Promise<Map<string, string[]>> {
  const ctx = (req.context ??= {}) as { namesByRole?: Promise<Map<string, string[]>> };
  ctx.namesByRole ??= req.payload
    .find({ collection: "users" as never, depth: 0, pagination: false, sort: "name" } as never)
    .then(({ docs }) => {
      const by = new Map<string, string[]>();
      for (const u of docs as unknown as { role?: string; name?: string }[])
        if (u.role) by.set(u.role, [...(by.get(u.role) ?? []), String(u.name ?? "")]);
      return by;
    });
  return ctx.namesByRole;
}

const permissionsMatrix = {
  name: "permissions",
  type: "array",
  label: { en: "Permissions", ar: "الصلاحيات" },
  labels: { singular: { en: "Role", ar: "الدور" }, plural: { en: "Roles", ar: "الأدوار" } },
  admin: {
    description: {
      en: "What each role can see and approve. Shown on the roles page.",
      ar: "ما يمكن لكل دور رؤيته واعتماده. يظهر في صفحة الأدوار.",
    },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Edit", ar: "تعديل" }),
        roles: ["management"],
        call: { path: "/roles/permission", body: { role: "$row.role" } },
        fields: PERMISSIONS.map((p) => ({
          type: "checkbox",
          name: p.key,
          label: words({ en: p.label, ar: p.ar.label }),
          admin: { description: words({ en: p.hint, ar: p.ar.hint }) },
          defaultValue: `$row.${p.key}`,
        })),
        done: words({
          en: "Permissions saved (logged on the audit trail)",
          ar: "حُفظت الصلاحيات (مسجّلة في سجل التدقيق)",
        }),
      },
    ] satisfies CollectionAction[],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "role",
          type: "select",
          label: { en: "Role", ar: "الدور" },
          required: true,
          options: [
            ...ROLE_OPTIONS,
            { label: { en: "System mailbox (sales@)", ar: "صندوق بريد النظام (sales@)" }, value: "system" },
          ],
          admin: {
            description: { en: "The role this row grants permissions to.", ar: "الدور الذي يمنحه هذا الصف الصلاحيات." },
            placeholder: { en: "Pick a role", ar: "اختر دورًا" },
          },
        },
        {
          name: "note",
          type: "text",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          admin: {
            description: { en: "A reminder of what this role is for.", ar: "تذكير بالغرض من هذا الدور." },
            placeholder: { en: "e.g. Sales cannot see supplier costs.", ar: "مثال: المبيعات لا ترى تكاليف الموردين." },
          },
        },
      ],
    },
    {
      name: "people",
      type: "text",
      label: { en: "People", ar: "الأشخاص" },
      virtual: true,
      admin: {
        readOnly: true,
        description: { en: "Everyone holding this role right now.", ar: "كل من يحمل هذا الدور حاليًا." },
      },
      hooks: {
        afterRead: [
          async ({ siblingData, req }: { siblingData?: { role?: string }; req: PayloadRequest }) => {
            if (!req.user) return undefined;
            const role = String(siblingData?.role ?? "");
            const names = (await namesByRole(req)).get(role) ?? [];
            if (names.length) return names.join(", ");
            return role === "system" ? inLanguage(req, { en: "System account", ar: "حساب النظام" }) : undefined;
          },
        ],
      },
    },
    {
      type: "row",
      fields: PERMISSIONS.map((p) => ({
        name: p.key,
        type: "checkbox" as const,
        label: { en: p.label, ar: p.ar.label },
        admin: { description: { en: p.hint, ar: p.ar.hint } },
        defaultValue: false,
        custom: { toneWhen: [{ when: { [p.key]: { equals: true } }, tone: "success" as const }] },
      })),
    },
  ],
} as Field;

export const Settings: GlobalConfig = {
  slug: "settings",
  label: { en: "Settings", ar: "الإعدادات العامة" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: managementOnly,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Company", ar: "الشركة" },
          fields: [
            {
              name: "companyName",
              type: "text",
              label: { en: "Company Name", ar: "اسم الشركة" },
              defaultValue: "Golden Sea",
              admin: {
                description: {
                  en: "Legal name printed on quotations and invoices.",
                  ar: "الاسم القانوني المطبوع على عروض الأسعار والفواتير.",
                },
                placeholder: { en: "e.g. Golden Sea Marine Supply", ar: "مثال: Golden Sea Marine Supply" },
              },
            },
            {
              name: "workingHours",
              type: "text",
              label: { en: "Working Hours", ar: "ساعات العمل" },
              defaultValue: "Sun–Thu 08:00–17:00",
              admin: {
                description: {
                  en: "Office hours. Outside them, after-hours routing applies.",
                  ar: "ساعات العمل. خارجها يُطبَّق توجيه ما بعد الدوام.",
                },
                placeholder: { en: "e.g. Sun to Thu, 08:00 to 17:00", ar: "مثال: الأحد إلى الخميس، 08:00 إلى 17:00" },
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "timezone",
                  type: "text",
                  label: { en: "Timezone", ar: "المنطقة الزمنية" },
                  defaultValue: "Africa/Cairo",
                  admin: {
                    description: {
                      en: "Used for due times and the on-call roster.",
                      ar: "يُستخدم لمواعيد الاستحقاق وجدول المناوبة.",
                    },
                    placeholder: { en: "e.g. Africa/Cairo", ar: "مثال: Africa/Cairo" },
                  },
                },
                {
                  name: "baseCurrency",
                  type: "select",
                  label: { en: "Base Currency", ar: "العملة الأساسية" },
                  options: CURRENCIES,
                  defaultValue: "EGP",
                  admin: {
                    description: { en: "The currency the books are kept in.", ar: "العملة التي تُمسك بها الدفاتر." },
                    placeholder: words({ en: "Pick a currency", ar: "اختر عملة" }),
                  },
                },
                {
                  name: "defaultQuoteCurrency",
                  type: "select",
                  label: { en: "Default Quote Currency", ar: "عملة العرض الافتراضية" },
                  options: CURRENCIES,
                  defaultValue: "USD",
                  admin: {
                    description: {
                      en: "The currency new quotations start in.",
                      ar: "العملة التي تبدأ بها عروض الأسعار الجديدة.",
                    },
                    placeholder: words({ en: "Pick a currency", ar: "اختر عملة" }),
                  },
                },
              ],
            },
            {
              name: "service24x7",
              type: "checkbox",
              label: { en: "24/7 service (after-hours routing on)", ar: "خدمة 24/7 (توجيه ما بعد الدوام مفعّل)" },
              defaultValue: true,
              admin: {
                description: {
                  en: "Sends after-hours requests to whoever is on call.",
                  ar: "يرسل الطلبات الواردة بعد الدوام إلى المناوب.",
                },
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "defaultLanguage",
                  type: "select",
                  label: { en: "Default language", ar: "اللغة الافتراضية" },
                  options: LANGUAGES,
                  defaultValue: "en",
                  admin: {
                    description: { en: "The language the dashboard opens in.", ar: "اللغة التي تفتح بها لوحة التحكم." },
                    placeholder: words({ en: "Pick a language", ar: "اختر لغة" }),
                  },
                },
                {
                  name: "documentLanguages",
                  type: "select",
                  hasMany: true,
                  label: { en: "Customer documents in", ar: "مستندات العملاء بلغة" },
                  options: LANGUAGES,
                  defaultValue: ["en", "ar"],
                  admin: {
                    description: {
                      en: "Acknowledgements, quotations and invoices.",
                      ar: "إشعارات الاستلام وعروض الأسعار والفواتير.",
                    },
                    placeholder: words({ en: "Pick languages", ar: "اختر اللغات" }),
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: "Commercial", ar: "التجاري" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "marginFloor",
                  type: "number",
                  label: { en: "Minimum margin %", ar: "الحد الأدنى للهامش %" },
                  defaultValue: 15,
                  min: 0,
                  max: 100,
                  admin: {
                    description: {
                      en: "Quotes below this margin need approval.",
                      ar: "العروض التي يقل هامشها عن هذا تحتاج موافقة.",
                    },
                    placeholder: { en: "e.g. 15", ar: "مثال: 15" },
                  },
                },
                {
                  name: "vatRatePct",
                  type: "number",
                  label: { en: "VAT %", ar: "ضريبة القيمة المضافة %" },
                  defaultValue: 14,
                  min: 0,
                  max: 100,
                  admin: {
                    description: {
                      en: "Egyptian VAT added to local invoices.",
                      ar: "ضريبة القيمة المضافة المصرية المضافة إلى الفواتير المحلية.",
                    },
                    placeholder: { en: "e.g. 14", ar: "مثال: 14" },
                  },
                },
                {
                  name: "quoteValidityDays",
                  type: "number",
                  label: { en: "Quote Validity Days", ar: "مدة صلاحية العرض (أيام)" },
                  defaultValue: 7,
                  min: 1,
                  admin: {
                    description: {
                      en: "How long a quotation stays valid, in days.",
                      ar: "مدة صلاحية عرض السعر، بالأيام.",
                    },
                    placeholder: { en: "e.g. 7", ar: "مثال: 7" },
                  },
                },
              ],
            },
            {
              name: "defaultPaymentTerms",
              type: "text",
              label: { en: "Default Payment Terms", ar: "شروط الدفع الافتراضية" },
              localized: true,
              defaultValue: "90 days from invoice date",
              admin: {
                description: {
                  en: "Printed on quotations unless a customer has their own.",
                  ar: "تُطبع على عروض الأسعار ما لم يكن للعميل شروطه الخاصة.",
                },
                placeholder: { en: "e.g. 30 days from invoice date", ar: "مثال: 30 يومًا من تاريخ الفاتورة" },
              },
            },
            {
              name: "quoteRemarks",
              type: "textarea",
              localized: true,
              label: { en: "Standard quotation remarks", ar: "ملاحظات عرض السعر القياسية" },
              admin: {
                description: {
                  en: "Added to every quotation, such as delivery and price terms.",
                  ar: "تُضاف إلى كل عرض سعر، مثل شروط التسليم والسعر.",
                },
                placeholder: { en: "e.g. Prices exclude port charges.", ar: "مثال: الأسعار لا تشمل رسوم الميناء." },
              },
            },
            {
              name: "quoteFooter",
              type: "text",
              label: { en: "Quote Footer", ar: "تذييل عرض السعر" },
              localized: true,
              admin: {
                description: {
                  en: "A closing line at the bottom of each quotation.",
                  ar: "سطر ختامي أسفل كل عرض سعر.",
                },
                placeholder: { en: "e.g. Thank you for choosing Golden Sea.", ar: "مثال: شكرًا لاختياركم Golden Sea." },
              },
            },
          ],
        },
        { label: { en: "Roles & permissions", ar: "الأدوار والصلاحيات" }, fields: [permissionsMatrix] },
        {
          label: { en: "Numbering", ar: "الترقيم" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "rfqPrefix",
                  type: "text",
                  label: { en: "Rfq Prefix", ar: "بادئة طلب العرض" },
                  defaultValue: "GS-RFQ-",
                  admin: {
                    description: { en: "Starts every customer request number.", ar: "بادئة كل رقم طلب عميل." },
                    placeholder: { en: "e.g. GS-RFQ-", ar: "مثال: GS-RFQ-" },
                  },
                },
                {
                  name: "servicePrefix",
                  type: "text",
                  label: { en: "Service Prefix", ar: "بادئة الخدمة" },
                  defaultValue: "GS-SVC-",
                  admin: {
                    description: { en: "Starts every service request number.", ar: "بادئة كل رقم طلب خدمة." },
                    placeholder: { en: "e.g. GS-SVC-", ar: "مثال: GS-SVC-" },
                  },
                },
                {
                  name: "quotePrefix",
                  type: "text",
                  label: { en: "Quote Prefix", ar: "بادئة عرض السعر" },
                  defaultValue: "GS-Q-",
                  admin: {
                    description: { en: "Starts every quotation number.", ar: "بادئة كل رقم عرض سعر." },
                    placeholder: { en: "e.g. GS-Q-", ar: "مثال: GS-Q-" },
                  },
                },
                {
                  name: "supplierRfqPrefix",
                  type: "text",
                  label: { en: "Supplier Rfq Prefix", ar: "بادئة طلب عرض المورّد" },
                  defaultValue: "GS-SRFQ-",
                  admin: {
                    description: { en: "Starts every request sent to a supplier.", ar: "بادئة كل طلب يُرسل إلى مورّد." },
                    placeholder: { en: "e.g. GS-SRFQ-", ar: "مثال: GS-SRFQ-" },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const FxRates: GlobalConfig = {
  slug: "fx-rates",
  label: { en: "Exchange rates", ar: "أسعار الصرف" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  hooks: {
    beforeChange: [
      ({ data }) => {
        const rates = (data.rates as { currency?: string; status?: string; date?: string }[] | undefined) ?? [];
        for (const cur of CURRENCIES) {
          const approved = rates.filter(
            (r) => r.currency === cur && (r.status === "Active" || r.status === "Superseded"),
          );
          approved.sort((a, b) => String(b.date).localeCompare(String(a.date)));
          approved.forEach((r, i) => (r.status = i === 0 ? "Active" : "Superseded"));
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "rates",
      type: "array",
      label: { en: "Rates", ar: "الأسعار" },
      labels: { singular: { en: "Rate", ar: "سعر" }, plural: { en: "Rates", ar: "الأسعار" } },
      admin: { description: { en: "Approved exchange rates, newest first.", ar: "أسعار الصرف المعتمدة، الأحدث أولًا." } },
      custom: {
        about: {
          en: "Quotations and comparisons only use approved rates. The newest approved rate per currency becomes Active.",
          ar: "لا تستخدم عروض الأسعار والمقارنات إلا الأسعار المعتمدة. أحدث سعر معتمد لكل عملة يصبح «نشطًا».",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "currency",
              type: "select",
              label: { en: "Currency", ar: "العملة" },
              options: CURRENCIES.filter((c) => c !== "EGP"),
              required: true,
              admin: {
                description: {
                  en: "The foreign currency this rate converts.",
                  ar: "العملة الأجنبية التي يحوّلها هذا السعر.",
                },
                placeholder: words({ en: "Pick a currency", ar: "اختر عملة" }),
              },
            },
            {
              name: "egpPerUnit",
              type: "number",
              min: 0,
              required: true,
              label: { en: "EGP per unit", ar: "جنيه لكل وحدة" },
              admin: {
                description: {
                  en: "How many Egyptian pounds one unit buys.",
                  ar: "عدد الجنيهات المصرية مقابل الوحدة الواحدة.",
                },
                placeholder: { en: "e.g. 48.60", ar: "مثال: 48.60" },
              },
            },
            {
              name: "date",
              type: "date",
              label: { en: "Date", ar: "التاريخ" },
              required: true,
              admin: { description: { en: "The day this rate takes effect.", ar: "يوم سريان هذا السعر." } },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "source",
              type: "text",
              label: { en: "Source", ar: "المصدر" },
              defaultValue: "CBE mid-rate + 0.5% buffer",
              admin: {
                description: { en: "Where the rate came from.", ar: "مصدر السعر." },
                placeholder: {
                  en: "e.g. CBE mid-rate + 0.5% buffer",
                  ar: "مثال: السعر المتوسط للبنك المركزي + هامش 0.5%",
                },
              },
            },
            {
              name: "proposedBy",
              type: "relationship",
              label: { en: "Proposed By", ar: "اقترحه" },
              relationTo: "users",
              admin: {
                description: { en: "Who suggested this rate.", ar: "من اقترح هذا السعر." },
                placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
              },
            },
            {
              name: "approvedBy",
              type: "relationship",
              label: { en: "Approved By", ar: "اعتمده" },
              relationTo: "users",
              admin: {
                description: {
                  en: "Who signed it off for use in quotations.",
                  ar: "من اعتمده للاستخدام في عروض الأسعار.",
                },
                placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
              },
            },
            {
              name: "status",
              type: "select",
              label: { en: "Status", ar: "الحالة" },
              options: [
                { value: "Awaiting approval", label: { en: "Awaiting approval", ar: "بانتظار الموافقة" } },
                { value: "Active", label: { en: "Active", ar: "نشط" } },
                { value: "Superseded", label: { en: "Superseded", ar: "مُستبدَل" } },
                { value: "Rejected", label: { en: "Rejected", ar: "مرفوض" } },
              ],
              defaultValue: "Awaiting approval",
              admin: {
                description: {
                  en: "Only Active rates price quotations.",
                  ar: "الأسعار «النشطة» وحدها تسعّر عروض الأسعار.",
                },
                placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
              },
            },
          ],
        },
      ],
    },
    {
      name: "recheckOpenQuotes",
      type: "checkbox",
      label: { en: "Re-check open quotations when a rate changes", ar: "إعادة فحص العروض المفتوحة عند تغيّر السعر" },
      defaultValue: true,
      admin: {
        description: {
          en: "Flags open quotations whose price moves with a new rate.",
          ar: "يعلّم العروض المفتوحة التي يتغيّر سعرها مع السعر الجديد.",
        },
      },
    },
  ],
};

export const PricingPolicy: GlobalConfig = {
  slug: "pricing-policy",
  label: { en: "Pricing policy", ar: "سياسة التسعير" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "targetMarginPct",
          type: "number",
          label: { en: "Target Margin Pct", ar: "نسبة الهامش المستهدفة" },
          defaultValue: 25,
          min: 0,
          max: 90,
          admin: {
            description: { en: "The margin new quotations aim for.", ar: "الهامش الذي تستهدفه عروض الأسعار الجديدة." },
            placeholder: { en: "e.g. 25", ar: "مثال: 25" },
          },
        },
        {
          name: "minMarginPct",
          type: "number",
          label: { en: "Min Margin Pct", ar: "أدنى نسبة هامش" },
          defaultValue: 15,
          min: 0,
          max: 90,
          admin: {
            description: {
              en: "Quotes below this margin raise an approval.",
              ar: "العروض التي يقل هامشها عن هذا تستدعي موافقة.",
            },
            placeholder: { en: "e.g. 15", ar: "مثال: 15" },
          },
        },
        {
          name: "maxDiscountWithoutApprovalPct",
          type: "number",
          label: { en: "Max Discount Without Approval Pct", ar: "أقصى خصم بدون اعتماد (%)" },
          defaultValue: 3,
          min: 0,
          max: 50,
          admin: {
            description: {
              en: "Sales can discount up to this much without asking.",
              ar: "يمكن للمبيعات منح خصم حتى هذا الحد دون سؤال.",
            },
            placeholder: { en: "e.g. 3", ar: "مثال: 3" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "allocationDefault",
          type: "select",
          label: { en: "Allocation Default", ar: "التوزيع الافتراضي" },
          defaultValue: "value",
          admin: {
            description: {
              en: "How shared costs, such as freight, spread over lines.",
              ar: "كيف تتوزع التكاليف المشتركة، مثل الشحن، على البنود.",
            },
            placeholder: words({ en: "Pick a method", ar: "اختر طريقة" }),
          },
          options: [
            { label: { en: "By line value", ar: "حسب قيمة البند" }, value: "value" },
            { label: { en: "By quantity", ar: "حسب الكمية" }, value: "qty" },
            { label: { en: "Equal per line", ar: "بالتساوي لكل بند" }, value: "lines" },
          ],
        },
        {
          name: "roundingUSD",
          type: "number",
          label: { en: "Rounding U S D", ar: "التقريب بالدولار" },
          defaultValue: 0.05,
          min: 0,
          admin: {
            description: {
              en: "Unit prices in USD round to this step.",
              ar: "تُقرَّب أسعار الوحدات بالدولار إلى هذه الخطوة.",
            },
            placeholder: { en: "e.g. 0.05", ar: "مثال: 0.05" },
          },
        },
      ],
    },
    {
      name: "byStore",
      type: "array",
      label: { en: "By Store", ar: "حسب القسم" },
      labels: {
        singular: { en: "Store rule", ar: "قاعدة القسم" },
        plural: { en: "Per-store margins", ar: "هوامش الأقسام" },
      },
      admin: {
        description: {
          en: "Margin rules that replace the defaults for one store.",
          ar: "قواعد هامش تحل محل الافتراضية لقسم واحد.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "store",
              type: "select",
              label: { en: "Store", ar: "القسم" },
              options: STORE_OPTIONS,
              required: true,
              admin: {
                description: { en: "The store these margins apply to.", ar: "القسم الذي تنطبق عليه هذه الهوامش." },
                placeholder: words({ en: "Pick a store", ar: "اختر قسمًا" }),
              },
            },
            {
              name: "targetPct",
              type: "number",
              label: { en: "Target Pct", ar: "النسبة المستهدفة" },
              min: 0,
              max: 90,
              admin: {
                description: { en: "Margin this store aims for.", ar: "الهامش الذي يستهدفه هذا القسم." },
                placeholder: { en: "e.g. 28", ar: "مثال: 28" },
              },
            },
            {
              name: "minPct",
              type: "number",
              label: { en: "Min Pct", ar: "أدنى نسبة" },
              min: 0,
              max: 90,
              admin: {
                description: { en: "Lowest margin this store may quote.", ar: "أدنى هامش يجوز لهذا القسم التسعير به." },
                placeholder: { en: "e.g. 18", ar: "مثال: 18" },
              },
            },
            {
              name: "maxDiscountPct",
              type: "number",
              label: { en: "Max Discount Pct", ar: "أقصى نسبة خصم" },
              min: 0,
              max: 50,
              admin: {
                description: { en: "Largest discount without approval.", ar: "أكبر خصم دون موافقة." },
                placeholder: { en: "e.g. 5", ar: "مثال: 5" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "flags",
      type: "select",
      hasMany: true,
      label: { en: "Raise an approval exception for", ar: "استدعاء استثناء موافقة عند" },
      admin: {
        description: {
          en: "Situations that stop a quotation until someone approves.",
          ar: "حالات توقف عرض السعر حتى يوافق أحد.",
        },
        placeholder: words({ en: "Pick situations", ar: "اختر الحالات" }),
      },
      custom: {
        about: {
          en: "Each ticked situation sends the quotation to approval before it can go out.",
          ar: "كل حالة محددة ترسل عرض السعر للموافقة قبل خروجه.",
        },
      },
      defaultValue: ["negative-profit", "below-min", "expired-price", "missing-cost"],
      options: [
        { label: { en: "Negative profit", ar: "ربح سالب" }, value: "negative-profit" },
        { label: { en: "Below minimum margin", ar: "أقل من الحد الأدنى للهامش" }, value: "below-min" },
        { label: { en: "Expired supplier price", ar: "سعر مورّد منتهي الصلاحية" }, value: "expired-price" },
        { label: { en: "Missing cost estimate", ar: "تقدير تكلفة ناقص" }, value: "missing-cost" },
        { label: { en: "Alternative without customer acceptance", ar: "بديل دون قبول العميل" }, value: "alternative" },
        { label: { en: "Advance-payment exposure", ar: "مخاطر الدفع المقدم" }, value: "advance" },
      ],
    },
  ],
};

export const ApprovalRules: GlobalConfig = {
  slug: "approval-rules",
  label: { en: "Approval rules", ar: "قواعد الموافقة" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  custom: { edit: { before: approvalRulesBefore } } satisfies CollectionSettings,
  fields: [
    {
      name: "rules",
      type: "array",
      label: { en: "Rules", ar: "القواعد" },
      labels: { singular: { en: "Rule", ar: "قاعدة" }, plural: { en: "Rules", ar: "القواعد" } },
      admin: { description: { en: "One rule per kind of decision.", ar: "قاعدة واحدة لكل نوع من القرارات." } },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "type",
              type: "text",
              label: { en: "Type", ar: "النوع" },
              required: true,
              admin: {
                placeholder: { en: "e.g. Customer quotation", ar: "مثال: عرض سعر العميل" },
                description: { en: "What needs approving.", ar: "ما يحتاج موافقة." },
              },
            },
            {
              name: "approvers",
              type: "relationship",
              label: { en: "Approvers", ar: "المعتمدون" },
              relationTo: "users",
              hasMany: true,
              admin: {
                description: { en: "Named people who can approve.", ar: "أشخاص محددون يمكنهم الموافقة." },
                placeholder: words({ en: "Pick approvers", ar: "اختر المعتمدين" }),
              },
            },
            {
              name: "approverRoles",
              type: "select",
              label: { en: "Approver Roles", ar: "أدوار المعتمدين" },
              hasMany: true,
              options: ROLE_OPTIONS,
              admin: {
                description: {
                  en: "Anyone holding these roles can approve.",
                  ar: "يمكن لأي شخص يحمل هذه الأدوار الموافقة.",
                },
                placeholder: words({ en: "Pick roles", ar: "اختر الأدوار" }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "twoPerson",
              type: "checkbox",
              label: { en: "Two Person", ar: "اعتماد شخصين" },
              defaultValue: false,
              admin: {
                description: { en: "Needs two different people to approve.", ar: "يحتاج موافقة شخصين مختلفين." },
              },
              custom: {
                about: {
                  en: "Used for bank detail changes. The two people must be different.",
                  ar: "يُستخدم لتغيير البيانات البنكية. يجب أن يكون الشخصان مختلفين.",
                },
              },
            },
            {
              name: "thresholdEGP",
              type: "number",
              min: 0,
              label: { en: "Only above (EGP)", ar: "فقط فوق (EGP)" },
              admin: {
                description: { en: "Smaller amounts skip approval.", ar: "المبالغ الأصغر تتجاوز الموافقة." },
                placeholder: { en: "e.g. 50000", ar: "مثال: 50000" },
              },
            },
            {
              name: "always",
              type: "checkbox",
              label: { en: "Always required", ar: "مطلوبة دائمًا" },
              defaultValue: true,
              admin: {
                description: { en: "Approval is needed whatever the amount.", ar: "الموافقة مطلوبة أيًّا كان المبلغ." },
              },
            },
          ],
        },
        {
          name: "note",
          type: "text",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          admin: {
            description: { en: "Context shown to the approver.", ar: "سياق يظهر للمعتمد." },
            placeholder: {
              en: "e.g. Over 50,000 EGP needs the manager.",
              ar: "مثال: ما يزيد على 50,000 جنيه يحتاج المدير.",
            },
          },
        },
      ],
    },
  ],
};

const switchRule = (label: Words, value: boolean, when: Record<string, unknown>): CollectionAction => ({
  label: asText(label),
  when,
  roles: ["management"],
  call: { path: "/automations/rule", body: { id: "$row.id", value } },
  done: value
    ? words({ en: "$row.name enabled (logged)", ar: "فُعّلت $row.name (مسجّل)" })
    : words({ en: "$row.name paused (logged)", ar: "أُوقفت $row.name مؤقتًا (مسجّل)" }),
});

export const AutomationRules: GlobalConfig = {
  slug: "automation-rules",
  label: { en: "Automation rules", ar: "قواعد الأتمتة" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  fields: [
    {
      name: "rules",
      type: "array",
      label: { en: "Rules", ar: "القواعد" },
      labels: { singular: { en: "Rule", ar: "قاعدة" }, plural: { en: "Rules", ar: "القواعد" } },
      admin: { description: { en: "Everything that runs by itself, and how.", ar: "كل ما يعمل تلقائيًا، وكيف." } },
      custom: {
        about: {
          en: "Each rule has a trigger, an owner, a due time, an approval step, retries and a stop condition.",
          ar: "لكل قاعدة مُشغِّل ومالك وموعد استحقاق وخطوة موافقة وإعادات محاولة وشرط توقف.",
        },
        actions: [
          switchRule({ en: "Pause", ar: "إيقاف مؤقت" }, false, { enabled: { not_equals: false } }),
          switchRule({ en: "Enable", ar: "تفعيل" }, true, { enabled: { equals: false } }),
        ],
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              label: { en: "Name", ar: "الاسم" },
              localized: true,
              required: true,
              admin: {
                description: { en: "What the rule is called in the registry.", ar: "اسم القاعدة في السجل." },
                placeholder: { en: "e.g. Acknowledge new RFQ", ar: "مثال: الإشعار باستلام طلب عرض جديد" },
              },
            },
            {
              name: "enabled",
              type: "checkbox",
              label: { en: "Enabled", ar: "مفعّل" },
              defaultValue: true,
              admin: { description: { en: "Switch off to pause the rule.", ar: "أوقفه لإيقاف القاعدة مؤقتًا." } },
            },
            {
              name: "mode",
              type: "select",
              label: { en: "Mode", ar: "الوضع" },
              defaultValue: "auto",
              admin: {
                description: { en: "How much a person is involved.", ar: "مدى تدخل الشخص." },
                placeholder: words({ en: "Pick a mode", ar: "اختر طريقة" }),
              },
              custom: {
                about: {
                  en: "Automatic runs on its own. Pre-approved runs with a template a person has signed off. Prepare for review drafts the result for a person to check.",
                  ar: "«تلقائي» يعمل وحده. «معتمد مسبقًا» يعمل بقالب اعتمده شخص. «إعداد للمراجعة» يصوغ النتيجة ليتحقق منها شخص.",
                },
                ...tones({ auto: "success", "pre-approved": "info", prepare: "warning" }),
              },
              options: [
                { label: { en: "Automatic", ar: "تلقائي" }, value: "auto" },
                { label: { en: "Automatic (pre-approved)", ar: "تلقائي (معتمد مسبقًا)" }, value: "pre-approved" },
                { label: { en: "Prepare for review", ar: "إعداد للمراجعة" }, value: "prepare" },
              ],
            },
            {
              name: "usesAI",
              type: "checkbox",
              label: { en: "AI-assisted", ar: "بمساعدة الذكاء الاصطناعي" },
              defaultValue: false,
              admin: {
                description: {
                  en: "The rule uses AI to read or draft.",
                  ar: "تستخدم القاعدة الذكاء الاصطناعي للقراءة أو الصياغة.",
                },
              },
            },
          ],
        },
        {
          name: "state",
          type: "select",
          label: { en: "On", ar: "مفعّلة" },
          options: [
            { value: "On", label: { en: "On", ar: "مفعّلة" } },
            { value: "Paused", label: { en: "Paused", ar: "متوقف مؤقتًا" } },
          ],
          virtual: true,
          admin: {
            readOnly: true,
            description: { en: "Whether the rule runs right now.", ar: "هل تعمل القاعدة الآن." },
          },
          custom: tones({ On: "success", Paused: "neutral" }),
          hooks: {
            afterRead: [
              ({ siblingData }) => ((siblingData as { enabled?: unknown }).enabled === false ? "Paused" : "On"),
            ],
          },
        },
        {
          name: "aiReview",
          type: "text",
          label: { en: "AI", ar: "الذكاء الاصطناعي" },
          virtual: true,
          admin: {
            readOnly: true,
            description: {
              en: "Whether AI is involved and when a person reviews.",
              ar: "هل يشارك الذكاء الاصطناعي ومتى يراجع شخص.",
            },
          },
          hooks: {
            afterRead: [
              ({ siblingData, req }) => {
                const r = siblingData as { usesAI?: unknown; confidenceThreshold?: unknown };
                const pct = typeof r.confidenceThreshold === "number" ? Math.round(r.confidenceThreshold * 100) : null;
                const below =
                  pct === null ? "" : inLanguage(req, { en: `review below ${pct}%`, ar: `مراجعة تحت ${pct}%` });
                const ai = r.usesAI ? inLanguage(req, { en: "AI-assisted", ar: "بمساعدة الذكاء الاصطناعي" }) : "";
                return [ai, below].filter(Boolean).join(" · ") || undefined;
              },
            ],
          },
        },
        {
          name: "trigger",
          type: "text",
          label: { en: "Trigger", ar: "المُشغِّل" },
          localized: true,
          required: true,
          admin: {
            description: { en: "The event that starts the rule.", ar: "الحدث الذي يبدأ القاعدة." },
            placeholder: { en: "e.g. New RFQ arrives in the inbox", ar: "مثال: وصول طلب عرض جديد إلى صندوق الوارد" },
          },
        },
        {
          name: "action",
          type: "textarea",
          label: { en: "Action", ar: "الإجراء" },
          localized: true,
          required: true,
          admin: {
            description: { en: "What the rule does when triggered.", ar: "ما تفعله القاعدة عند تشغيلها." },
            placeholder: {
              en: "e.g. Send the acknowledgement and create a case.",
              ar: "مثال: إرسال الإشعار بالاستلام وإنشاء ملف.",
            },
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "owner",
              type: "text",
              label: { en: "Owner", ar: "المسؤول" },
              admin: {
                description: { en: "Who is responsible when it needs a person.", ar: "المسؤول عندما تحتاج إلى شخص." },
                placeholder: { en: "e.g. Sales", ar: "مثال: المبيعات" },
              },
            },
            {
              name: "due",
              type: "text",
              label: { en: "Due", ar: "الاستحقاق" },
              localized: true,
              admin: {
                description: { en: "How soon it must be done.", ar: "المهلة اللازمة لإنجازها." },
                placeholder: { en: "e.g. Within 15 minutes", ar: "مثال: خلال 15 دقيقة" },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "approval",
              type: "text",
              label: { en: "Approval", ar: "الاعتماد" },
              localized: true,
              admin: {
                description: { en: "Who must approve before it acts.", ar: "من يجب أن يوافق قبل أن تعمل." },
                placeholder: { en: "e.g. None, pre-approved template", ar: "مثال: لا أحد، قالب معتمد مسبقًا" },
              },
            },
            {
              name: "retry",
              type: "text",
              label: { en: "Retry", ar: "إعادة المحاولة" },
              localized: true,
              admin: {
                description: { en: "What happens when it fails.", ar: "ما يحدث عند الإخفاق." },
                placeholder: {
                  en: "e.g. Retry 3 times, then queue",
                  ar: "مثال: إعادة المحاولة 3 مرات، ثم قائمة الانتظار",
                },
              },
            },
            {
              name: "stop",
              type: "text",
              localized: true,
              label: { en: "Stop condition", ar: "شرط التوقف" },
              admin: {
                description: { en: "When the rule stops repeating.", ar: "متى تتوقف القاعدة عن التكرار." },
                placeholder: { en: "e.g. Customer replies", ar: "مثال: رد العميل" },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "confidenceThreshold",
              type: "number",
              label: { en: "Confidence Threshold", ar: "حد الثقة" },
              min: 0,
              max: 1,
              admin: {
                description: {
                  en: "AI rules: below this confidence, a person reviews.",
                  ar: "قواعد الذكاء الاصطناعي: دون هذه الثقة يراجع شخص.",
                },
                placeholder: { en: "e.g. 0.8", ar: "مثال: 0.8" },
              },
            },
            {
              name: "template",
              type: "text",
              label: { en: "Message template key", ar: "مفتاح قالب الرسالة" },
              admin: {
                description: {
                  en: "The message template this rule sends.",
                  ar: "قالب الرسالة الذي ترسله هذه القاعدة.",
                },
                placeholder: { en: "e.g. rfq-ack", ar: "مثال: rfq-ack" },
              },
            },
          ],
        },
      ],
    },
  ],
};

export const MessageTemplates: GlobalConfig = {
  slug: "message-templates",
  label: { en: "Message templates", ar: "قوالب الرسائل" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  fields: [
    {
      name: "templates",
      type: "array",
      label: { en: "Templates", ar: "القوالب" },
      labels: { singular: { en: "Template", ar: "قالب" }, plural: { en: "Templates", ar: "القوالب" } },
      admin: {
        description: {
          en: "Reusable messages that automations send.",
          ar: "رسائل قابلة لإعادة الاستخدام ترسلها الأتمتة.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "key",
              type: "text",
              label: { en: "Key", ar: "المفتاح" },
              required: true,
              admin: {
                placeholder: { en: "e.g. rfq-ack", ar: "مثال: rfq-ack" },
                description: { en: "The short id rules use to find it.", ar: "المعرّف القصير الذي تجده به القواعد." },
              },
            },
            {
              name: "name",
              type: "text",
              label: { en: "Name", ar: "الاسم" },
              localized: true,
              required: true,
              admin: {
                description: { en: "What people see when picking it.", ar: "ما يراه الناس عند اختياره." },
                placeholder: { en: "e.g. RFQ acknowledgement", ar: "مثال: الإشعار باستلام طلب العرض" },
              },
            },
            {
              name: "channel",
              type: "select",
              label: { en: "Channel", ar: "القناة" },
              options: [
                { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
                { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
                { value: "SMS", label: { en: "SMS", ar: "رسالة نصية" } },
              ],
              defaultValue: "Email",
              admin: {
                description: { en: "Where the message goes out.", ar: "القناة التي تُرسل منها الرسالة." },
                placeholder: words({ en: "Pick a channel", ar: "اختر قناة" }),
              },
            },
          ],
        },
        {
          name: "subject",
          type: "text",
          label: { en: "Subject", ar: "الموضوع" },
          admin: {
            description: { en: "The email subject line.", ar: "سطر موضوع البريد." },
            placeholder: {
              en: "e.g. We received your request {{caseId}}",
              ar: "مثال: We received your request {{caseId}}",
            },
          },
        },
        {
          name: "body",
          type: "textarea",
          label: { en: "Body", ar: "النص" },
          admin: {
            description: {
              en: "The message text, with placeholders filled in per case.",
              ar: "نص الرسالة، مع ملء العناصر النائبة لكل ملف.",
            },
            placeholder: {
              en: "e.g. Dear {{customer}}, we received {{caseId}} for {{vessel}}.",
              ar: "مثال: Dear {{customer}}, we received {{caseId}} for {{vessel}}.",
            },
          },
          custom: {
            about: {
              en: "Placeholders: {{caseId}}, {{customer}}, {{vessel}}, {{lines}}, {{dueAt}}, {{user}}.",
              ar: "العناصر النائبة: {{caseId}}، {{customer}}، {{vessel}}، {{lines}}، {{dueAt}}، {{user}}.",
            },
          },
        },
        {
          name: "subjectAr",
          type: "text",
          label: { en: "Subject (Arabic)", ar: "الموضوع (عربي)" },
          admin: {
            description: { en: "The subject for Arabic-speaking customers.", ar: "الموضوع للعملاء الناطقين بالعربية." },
            placeholder: { en: "e.g. استلمنا طلبكم {{caseId}}", ar: "مثال: استلمنا طلبكم {{caseId}}" },
          },
        },
        {
          name: "bodyAr",
          type: "textarea",
          label: { en: "Body (Arabic)", ar: "النص (عربي)" },
          admin: {
            description: { en: "The Arabic message text.", ar: "نص الرسالة بالعربية." },
            placeholder: {
              en: "e.g. عزيزي {{customer}}، استلمنا طلبكم.",
              ar: "مثال: عزيزي {{customer}}، استلمنا طلبكم.",
            },
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "status",
              type: "select",
              label: { en: "Status", ar: "الحالة" },
              defaultValue: "Draft",
              options: [
                { value: "Draft", label: { en: "Draft", ar: "مسودة" } },
                { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
                { value: "Retired", label: { en: "Retired", ar: "متقاعد" } },
              ],
              admin: {
                description: {
                  en: "Only approved templates send on their own.",
                  ar: "القوالب المعتمدة وحدها تُرسل تلقائيًا.",
                },
                placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
              },
              custom: {
                about: {
                  en: "Only Approved templates are sent automatically. Anything else is sent by a person.",
                  ar: "القوالب «المعتمدة» وحدها تُرسل تلقائيًا. وكل ما عداها يرسله شخص.",
                },
              },
            },
            {
              name: "version",
              type: "number",
              label: { en: "Version", ar: "الإصدار" },
              min: 1,
              defaultValue: 1,
              admin: {
                description: { en: "Raise it each time the wording changes.", ar: "زِده كلما تغيّرت الصياغة." },
                placeholder: { en: "e.g. 2", ar: "مثال: 2" },
              },
            },
            {
              name: "approvedBy",
              type: "relationship",
              label: { en: "Approved By", ar: "اعتمده" },
              relationTo: "users",
              admin: {
                description: { en: "Who signed off this wording.", ar: "من اعتمد هذه الصياغة." },
                placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
              },
            },
          ],
        },
        {
          name: "neverIncludeClientIdentity",
          type: "checkbox",
          defaultValue: false,
          label: { en: "Supplier-facing (strip client identity)", ar: "موجّه للمورّد (حذف هوية العميل)" },
          admin: {
            description: {
              en: "Hides customer and vessel names from the supplier.",
              ar: "يخفي أسماء العملاء والسفن عن المورّد.",
            },
          },
        },
      ],
    },
  ],
};

const MAILBOXES = ["Outlook mailbox", "Gmail mailbox"];

const KIND_AR: Record<string, string> = {
  "Outlook mailbox": "صندوق بريد Outlook",
  "Gmail mailbox": "صندوق بريد Gmail",
  "Website form": "نموذج الموقع",
  WhatsApp: "WhatsApp",
  "AI extraction": "الاستخراج بالذكاء الاصطناعي",
  "E-invoicing (tax authority)": "الفاتورة الإلكترونية (مصلحة الضرائب)",
  "Document storage": "تخزين المستندات",
  Odoo: "Odoo",
};

type Pair = { en: string; ar: string };
const ABOUT: Record<string, { title?: Pair; about: Pair }> = {
  "Outlook mailbox": {
    about: {
      en: "Every email becomes or joins a case, with its attachments kept.",
      ar: "كل بريد يصبح ملفًا أو ينضم إلى ملف، مع حفظ مرفقاته.",
    },
  },
  "Gmail mailbox": {
    about: {
      en: "Every email becomes or joins a case, with its attachments kept.",
      ar: "كل بريد يصبح ملفًا أو ينضم إلى ملف، مع حفظ مرفقاته.",
    },
  },
  "Website form": {
    title: { en: "Website quick-quote form", ar: "نموذج طلب عرض سريع على الموقع" },
    about: {
      en: "“Request a quick quote” creates a draft case and contact; AI reads the items.",
      ar: "«اطلب عرضًا سريعًا» ينشئ مسودة ملف وجهة اتصال؛ ويقرأ الذكاء الاصطناعي الأصناف.",
    },
  },
  WhatsApp: {
    about: {
      en: "Captains and agents message on WhatsApp: each message is logged on its case with a screenshot and who logged it.",
      ar: "يراسل القباطنة والوكلاء عبر واتساب: تُسجَّل كل رسالة على ملفها مع لقطة شاشة واسم من سجّلها.",
    },
  },
  "E-invoicing (tax authority)": {
    title: { en: "Egyptian e-invoicing (ETA)", ar: "الفاتورة الإلكترونية المصرية (ETA)" },
    about: {
      en: "Invoices are signed and submitted to the tax authority; the UUID and status are stored on the invoice.",
      ar: "تُوقَّع الفواتير وتُقدَّم إلى مصلحة الضرائب؛ ويُحفظ UUID والحالة على الفاتورة.",
    },
  },
  "AI extraction": {
    about: {
      en: "Reads PDF, Excel, Word and photos into draft lines. Drafts only.",
      ar: "يقرأ ملفات PDF وExcel وWord والصور إلى مسودات بنود. مسودات فقط.",
    },
  },
  "Document storage": {
    title: { en: "Documents", ar: "المستندات" },
    about: { en: "Every file on its case, searchable.", ar: "كل ملف على ملفه، قابل للبحث." },
  },
  Odoo: {
    about: {
      en: "Odoo for the books, SaaSTEMLY for the way you work. Standard, supported Odoo holds contacts, sales and purchase orders, stock, invoices and accounting. The sourcing desk on top — inbox, comparison, approvals, automations — writes into it, so any Odoo partner can read your books.",
      ar: "Odoo للدفاتر، وSaaSTEMLY لطريقة عملكم. يحتفظ Odoo القياسي المدعوم بجهات الاتصال وأوامر البيع والشراء والمخزون والفواتير والمحاسبة. ومكتب التوريد فوقه — الوارد والمقارنة والموافقات والأتمتة — يكتب فيه، فيستطيع أي شريك Odoo قراءة دفاتركم.",
    },
  },
};

type Row = Record<string, unknown>;
const kindOf = (row: unknown) => {
  const kind = (row as Row | undefined)?.kind;
  return typeof kind === "string" ? kind : "";
};

const fromRow = <F extends Field>(field: F, compute: (row: Row, req: PayloadRequest) => unknown): F =>
  ({
    ...field,
    virtual: true,
    admin: { ...field.admin, readOnly: true },
    hooks: {
      afterRead: [
        ({ siblingData, req }: { siblingData?: Row; req: PayloadRequest }) => compute(siblingData ?? {}, req),
      ],
    },
  }) as F;

const expiryTones = [
  { when: { expiresInDays: { less_than: 0 } }, tone: "error" as const },
  { when: { expiresInDays: { less_than: 30 } }, tone: "warning" as const },
];

const connectionFields: Field[] = [
  {
    type: "row",
    fields: [
      {
        name: "kind",
        type: "select",
        label: { en: "Kind", ar: "النوع" },
        required: true,
        admin: {
          description: { en: "What this connection links to.", ar: "ما يرتبط به هذا الاتصال." },
          placeholder: words({ en: "Pick a connection", ar: "اختر اتصالًا" }),
        },
        options: [
          ...choices(MAILBOXES, { "Outlook mailbox": "صندوق بريد Outlook", "Gmail mailbox": "صندوق بريد Gmail" }),
          { value: "Website form", label: { en: "Website form", ar: "نموذج الموقع" } },
          { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
          { value: "AI extraction", label: { en: "AI extraction", ar: "الاستخراج بالذكاء الاصطناعي" } },
          {
            value: "E-invoicing (tax authority)",
            label: { en: "E-invoicing (tax authority)", ar: "الفاتورة الإلكترونية (مصلحة الضرائب)" },
          },
          { value: "Document storage", label: { en: "Document storage", ar: "تخزين المستندات" } },
          { value: "Odoo", label: { en: "Odoo", ar: "Odoo" } },
        ],
      },
      {
        name: "account",
        type: "text",
        label: { en: "Account", ar: "الحساب" },
        admin: {
          placeholder: { en: "e.g. sales@goldensea.example", ar: "مثال: sales@goldensea.example" },
          description: { en: "The mailbox, number or account used.", ar: "صندوق البريد أو الرقم أو الحساب المستخدم." },
        },
      },
      {
        name: "status",
        type: "select",
        label: { en: "Status", ar: "الحالة" },
        options: [
          { value: "Connected", label: { en: "Connected", ar: "متصل" } },
          { value: "Token expired", label: { en: "Token expired", ar: "انتهى الرمز" } },
          { value: "To connect", label: { en: "To connect", ar: "للربط" } },
          { value: "Sandbox", label: { en: "Sandbox", ar: "بيئة تجريبية" } },
          { value: "Staging", label: { en: "Staging", ar: "بيئة الاختبار" } },
          { value: "Manual", label: { en: "Manual", ar: "يدوي" } },
          { value: "Disabled", label: { en: "Disabled", ar: "معطّل" } },
        ],
        defaultValue: "To connect",
        admin: {
          description: { en: "Whether it works right now.", ar: "هل يعمل الآن." },
          placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
        },
        custom: tones({
          Connected: "success",
          "Token expired": "error",
          "To connect": "warning",
          Sandbox: "info",
          Staging: "info",
          Manual: "neutral",
          Disabled: "neutral",
        }),
      },
    ],
  },
  {
    type: "row",
    fields: [
      {
        name: "lastSyncAt",
        type: "date",
        label: { en: "Last sync", ar: "آخر مزامنة" },
        admin: {
          date: { pickerAppearance: "dayAndTime" },
          description: { en: "When it last fetched anything.", ar: "آخر مرة جلب فيها شيئًا." },
        },
      },
      {
        name: "pollEveryMinutes",
        type: "number",
        label: { en: "Poll Every Minutes", ar: "الفحص كل (دقائق)" },
        min: 1,
        admin: {
          description: { en: "How often it checks for new messages.", ar: "عدد مرات التحقق من الرسائل الجديدة." },
          placeholder: { en: "e.g. 5", ar: "مثال: 5" },
        },
      },
      {
        name: "tokenExpiresAt",
        type: "date",
        label: { en: "Token / certificate expires", ar: "انتهاء الرمز / الشهادة" },
        admin: { description: { en: "Sign in again before this date.", ar: "سجّل الدخول مجددًا قبل هذا التاريخ." } },
        custom: { toneWhen: expiryTones },
      },
      fromRow(
        {
          name: "expiresInDays",
          type: "number",
          label: { en: "Expires in", ar: "ينتهي خلال" },
          admin: {
            description: {
              en: "Days left before the sign-in or certificate lapses.",
              ar: "الأيام المتبقية قبل انتهاء تسجيل الدخول أو الشهادة.",
            },
          },
          custom: { ...formats.days(), toneWhen: expiryTones },
        },
        ({ tokenExpiresAt: at }) =>
          typeof at === "string" && at ? Math.round((new Date(at).getTime() - TODAY.getTime()) / DAY) : null,
      ),
    ],
  },
  {
    type: "row",
    fields: [
      {
        name: "emailsImported",
        type: "number",
        label: { en: "Emails Imported", ar: "الرسائل المستوردة" },
        min: 0,
        admin: {
          description: {
            en: "Messages imported so far, history and live.",
            ar: "الرسائل المستوردة حتى الآن، السابقة والحالية.",
          },
          placeholder: { en: "e.g. 1240", ar: "مثال: 1240" },
        },
      },
      {
        name: "modules",
        type: "text",
        label: { en: "Modules", ar: "الوحدات" },
        admin: {
          description: { en: "Odoo apps in use, comma-separated.", ar: "تطبيقات Odoo المستخدمة، مفصولة بفواصل." },
          placeholder: { en: "e.g. Sales, Purchase, Accounting", ar: "مثال: Sales, Purchase, Accounting" },
        },
      },
    ],
  },
  {
    name: "notes",
    type: "text",
    label: { en: "Notes", ar: "ملاحظات" },
    localized: true,
    admin: {
      description: { en: "Anything the team should know about it.", ar: "أي شيء يجب أن يعرفه الفريق عنه." },
      placeholder: { en: "e.g. Renew the token each quarter.", ar: "مثال: جدّد الرمز كل ربع سنة." },
    },
  },
  fromRow(
    {
      name: "title",
      type: "text",
      label: { en: "Connection", ar: "الاتصال" },
      admin: { description: { en: "The connection's name on its card.", ar: "اسم الاتصال على بطاقته." } },
    },
    (row, req) => {
      const kind = kindOf(row);
      return inLanguage(req, ABOUT[kind]?.title ?? { en: kind, ar: KIND_AR[kind] ?? kind });
    },
  ),
  fromRow(
    {
      name: "about",
      type: "text",
      label: { en: "What it does", ar: "ما يفعله" },
      admin: { description: { en: "What this connection does for the business.", ar: "ما يقدمه هذا الاتصال للعمل." } },
    },
    (row, req) => {
      const about = ABOUT[kindOf(row)]?.about;
      return about && inLanguage(req, about);
    },
  ),
  fromRow(
    {
      name: "poll",
      type: "text",
      label: { en: "Polled", ar: "تم الاستعلام" },
      admin: {
        description: { en: "How often it checks for new messages.", ar: "عدد مرات التحقق من الرسائل الجديدة." },
      },
    },
    (row, req) =>
      typeof row.pollEveryMinutes === "number"
        ? inLanguage(req, { en: `every ${row.pollEveryMinutes} min`, ar: `كل ${row.pollEveryMinutes} دقيقة` })
        : undefined,
  ),
  fromRow(
    {
      name: "received",
      type: "number",
      label: { en: "Messages received", ar: "الرسائل المستلمة" },
      admin: {
        description: {
          en: "Imported messages plus those in the inbox now.",
          ar: "الرسائل المستوردة بالإضافة إلى ما في صندوق الوارد الآن.",
        },
      },
    },
    async (row, req) => {
      if (row.emailsImported == null) return null;
      const or: Row[] = [];
      if (typeof row.account === "string" && row.account) or.push({ mailbox: { equals: row.account } });
      if (row.kind === "Website form") or.push({ channel: { equals: "Website form" } });
      const live = or.length
        ? (await req.payload.count({ collection: "intake-messages" as never, where: { or } as never })).totalDocs
        : 0;
      return (Number(row.emailsImported) || 0) + live;
    },
  ),
];

const reconnect = (kind: string, provider: string): CollectionAction => ({
  label: words({ en: "Reconnect", ar: "إعادة الربط" }),
  main: true,
  when: { kind: { equals: kind }, status: { in: ["Token expired", "To connect"] } },
  roles: ["management", "operations", "office-admin"],
  call: { path: "/integrations/reconnect", body: { id: "$row.id" } },
  confirm: {
    heading: words({ en: "Reconnect $row.account", ar: "إعادة ربط $row.account" }),
    text: words({
      en: `You'll sign in with the mailbox's ${provider} account (simulated in the demo). After sign-in, the emails that waited are imported once each — the idempotency check makes sure none is imported, acknowledged or turned into a case twice.`,
      ar: `ستسجّل الدخول بحساب ${provider} الخاص بصندوق البريد (محاكاة في العرض التجريبي). بعد تسجيل الدخول، تُستورد الرسائل المنتظرة مرة واحدة لكل منها — ويضمن فحص عدم التكرار ألا تُستورد أي رسالة أو يُشعَر باستلامها أو تتحول إلى ملف مرتين.`,
    }),
    label: words({ en: "Sign in & reconnect", ar: "تسجيل الدخول وإعادة الربط" }),
  },
  reply: true,
});

const connectionsWhere = (
  name: string,
  label: Words,
  keep: (row: unknown) => boolean,
  actions: CollectionAction[],
): Field =>
  ({
    name,
    type: "array",
    label,
    virtual: true,
    admin: { readOnly: true, hidden: true },
    custom: { actions },
    fields: connectionFields,
    hooks: {
      afterRead: [
        ({ siblingData }: { siblingData?: Row }) =>
          ((siblingData?.connections as unknown[] | undefined) ?? []).filter(keep),
      ],
    },
  }) as Field;

export const Integrations: GlobalConfig = {
  slug: "integrations",
  label: { en: "Integrations", ar: "التكاملات" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  fields: [
    {
      name: "connections",
      type: "array",
      label: { en: "Connections", ar: "الاتصالات" },
      labels: { singular: { en: "Connection", ar: "الاتصال" }, plural: { en: "Connections", ar: "الاتصالات" } },
      admin: {
        description: {
          en: "Mailboxes, WhatsApp, e-invoicing and other links.",
          ar: "صناديق البريد وواتساب والفاتورة الإلكترونية والروابط الأخرى.",
        },
      },
      fields: connectionFields,
    },
    connectionsWhere("mailboxes", { en: "Mailboxes", ar: "صناديق البريد" }, (c) => MAILBOXES.includes(kindOf(c)), [
      reconnect("Outlook mailbox", "Microsoft 365"),
      reconnect("Gmail mailbox", "Google"),
    ]),
    connectionsWhere("channels", { en: "Channels", ar: "القنوات" }, (c) => !MAILBOXES.includes(kindOf(c)), [
      {
        label: words({ en: "Exception queue", ar: "قائمة الاستثناءات" }),
        when: { kind: { equals: "E-invoicing (tax authority)" } },
        href: "/automations",
      },
    ]),
    {
      name: "emailImport",
      type: "group",
      label: { en: "Email history import", ar: "استيراد سجل البريد" },
      admin: {
        description: {
          en: "A one-off job that turns past emails into cases.",
          ar: "مهمة لمرة واحدة تحوّل الرسائل السابقة إلى ملفات.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "days",
              type: "number",
              label: { en: "Days", ar: "الأيام" },
              min: 1,
              defaultValue: 90,
              admin: {
                description: {
                  en: "How far back to read the mailbox.",
                  ar: "المدة التي يُقرأ صندوق البريد إلى الوراء خلالها.",
                },
                placeholder: { en: "e.g. 90", ar: "مثال: 90" },
              },
            },
            {
              name: "status",
              type: "select",
              label: { en: "Status", ar: "الحالة" },
              options: [
                { value: "Not started", label: { en: "Not started", ar: "لم يبدأ" } },
                { value: "Dry run ready", label: { en: "Dry run ready", ar: "التشغيل التجريبي جاهز" } },
                { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
                { value: "Running", label: { en: "Running", ar: "قيد التشغيل" } },
                { value: "Done", label: { en: "Done", ar: "تم" } },
              ],
              defaultValue: "Not started",
              admin: {
                description: { en: "Where the import job stands.", ar: "موقف مهمة الاستيراد." },
                placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "scanned",
              type: "number",
              label: { en: "Scanned", ar: "تم فحصه" },
              min: 0,
              admin: {
                description: { en: "Emails read in the dry run.", ar: "الرسائل المقروءة في التشغيل التجريبي." },
                placeholder: { en: "e.g. 4200", ar: "مثال: 4200" },
              },
            },
            {
              name: "rfqThreads",
              type: "number",
              label: { en: "Rfq Threads", ar: "محادثات طلبات العروض" },
              min: 0,
              admin: {
                description: { en: "Threads that look like customer requests.", ar: "المحادثات التي تبدو طلبات عملاء." },
                placeholder: { en: "e.g. 310", ar: "مثال: 310" },
              },
            },
            {
              name: "duplicates",
              type: "number",
              label: { en: "Duplicates", ar: "المكررات" },
              min: 0,
              admin: {
                description: { en: "Emails already in the system.", ar: "الرسائل الموجودة في النظام بالفعل." },
                placeholder: { en: "e.g. 25", ar: "مثال: 25" },
              },
            },
            {
              name: "exceptions",
              type: "number",
              label: { en: "Exceptions", ar: "الاستثناءات" },
              min: 0,
              admin: {
                description: { en: "Emails that need a person to look.", ar: "الرسائل التي تحتاج أن ينظر فيها شخص." },
                placeholder: { en: "e.g. 12", ar: "مثال: 12" },
              },
            },
            {
              name: "confidential",
              type: "number",
              min: 0,
              label: { en: "Flagged confidential", ar: "معلَّمة سرية" },
              admin: {
                description: { en: "Emails held back as confidential.", ar: "الرسائل المحجوزة لسريتها." },
                placeholder: { en: "e.g. 8", ar: "مثال: 8" },
              },
            },
          ],
        },
        {
          name: "approvedBy",
          type: "relationship",
          label: { en: "Approved By", ar: "اعتمده" },
          relationTo: "users",
          access: { update: ({ req }) => req.user?.role === "management" },
          admin: {
            description: { en: "Management signs off before the import runs.", ar: "تعتمد الإدارة قبل تشغيل الاستيراد." },
            placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
          },
        },
        {
          name: "excludeConfidential",
          type: "checkbox",
          label: { en: "Exclude Confidential", ar: "استبعاد السري" },
          defaultValue: true,
          admin: {
            description: {
              en: "Leaves flagged confidential emails out of the import.",
              ar: "يستبعد الرسائل المعلَّمة سرية من الاستيراد.",
            },
          },
        },
      ],
    },
    {
      name: "migration",
      type: "array",
      label: { en: "Odoo migration", ar: "الترحيل من Odoo" },
      labels: { singular: { en: "Part", ar: "جزء" }, plural: { en: "Parts", ar: "الأجزاء" } },
      admin: {
        description: {
          en: "What moves from Odoo, how much has moved and how much is checked.",
          ar: "ما يُنقل من Odoo، وكم نُقل، وكم تم التحقق منه.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "part",
              type: "text",
              label: { en: "Part", ar: "الجزء" },
              localized: true,
              required: true,
              admin: {
                description: { en: "What moves, in your words.", ar: "ما يُنقل، بكلماتكم." },
                placeholder: { en: "e.g. Customers and contacts", ar: "مثال: العملاء وجهات الاتصال" },
              },
            },
            {
              name: "odooModel",
              type: "text",
              label: { en: "Odoo model", ar: "نموذج Odoo" },
              admin: {
                description: { en: "Where it lives in Odoo.", ar: "مكانه في Odoo." },
                placeholder: { en: "e.g. res.partner", ar: "مثال: res.partner" },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "inOdoo",
              type: "number",
              min: 0,
              label: { en: "In Odoo", ar: "في Odoo" },
              admin: {
                description: { en: "Records counted in Odoo.", ar: "السجلات المعدودة في Odoo." },
                placeholder: { en: "e.g. 412", ar: "مثال: 412" },
              },
            },
            {
              name: "moved",
              type: "number",
              label: { en: "Moved", ar: "تم النقل" },
              min: 0,
              admin: {
                description: { en: "Records copied into the platform.", ar: "السجلات المنسوخة إلى المنصة." },
                placeholder: { en: "e.g. 412", ar: "مثال: 412" },
              },
            },
            {
              name: "checked",
              type: "number",
              label: { en: "Checked", ar: "تم الفحص" },
              min: 0,
              admin: {
                description: { en: "Records a person checked against Odoo.", ar: "السجلات التي طابقها شخص مع Odoo." },
                placeholder: { en: "e.g. 380", ar: "مثال: 380" },
              },
            },
          ],
        },
        {
          name: "status",
          type: "select",
          label: { en: "Status", ar: "الحالة" },
          defaultValue: "Not started",
          options: [
            { value: "Not started", label: { en: "Not started", ar: "لم يبدأ" } },
            { value: "Moving", label: { en: "Moving", ar: "قيد النقل" } },
            { value: "Checking", label: { en: "Checking", ar: "قيد التحقق" } },
            { value: "Done", label: { en: "Done", ar: "تم" } },
          ],
          custom: tones({ "Not started": "neutral", Moving: "info", Checking: "warning", Done: "success" }),
          admin: {
            description: {
              en: "Done once every record is moved and checked.",
              ar: "يكتمل بعد نقل كل سجل والتحقق منه.",
            },
            placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
          },
        },
        {
          name: "note",
          type: "text",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          admin: {
            description: { en: "What's left or what was found.", ar: "ما تبقى أو ما وُجد." },
            placeholder: { en: "e.g. 36 vessels without an IMO number", ar: "مثال: 36 سفينة بلا رقم IMO" },
          },
        },
      ],
    },
    {
      name: "backups",
      type: "group",
      label: { en: "Backups, staging and export", ar: "النسخ الاحتياطي وبيئة الاختبار والتصدير" },
      admin: {
        description: { en: "How data is copied, restored and tested.", ar: "كيف تُنسخ البيانات وتُستعاد وتُختبر." },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "schedule",
              type: "text",
              label: { en: "Schedule", ar: "الجدول" },
              defaultValue: "Daily 02:00 Cairo",
              admin: {
                description: { en: "When backups run.", ar: "مواعيد النسخ الاحتياطي." },
                placeholder: { en: "e.g. Daily 02:00 Cairo", ar: "مثال: يوميًا 02:00 بتوقيت القاهرة" },
              },
            },
            {
              name: "locations",
              type: "number",
              label: { en: "Locations", ar: "المواقع" },
              min: 1,
              defaultValue: 3,
              admin: {
                description: { en: "How many places each backup is stored.", ar: "عدد الأماكن التي تُحفظ فيها كل نسخة." },
                placeholder: { en: "e.g. 3", ar: "مثال: 3" },
              },
            },
            {
              name: "retentionDays",
              type: "number",
              label: { en: "Retention Days", ar: "مدة الاحتفاظ (أيام)" },
              min: 1,
              defaultValue: 30,
              admin: {
                description: { en: "How long old backups are kept.", ar: "مدة الاحتفاظ بالنسخ القديمة." },
                placeholder: { en: "e.g. 30", ar: "مثال: 30" },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "lastBackupAt",
              type: "date",
              label: { en: "Last Backup At", ar: "آخر نسخة احتياطية" },
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: { en: "When the latest backup finished.", ar: "وقت انتهاء آخر نسخة احتياطية." },
              },
            },
            {
              name: "restoreTestedAt",
              type: "date",
              label: { en: "Restore Tested At", ar: "تاريخ اختبار الاستعادة" },
              admin: {
                description: {
                  en: "When a backup was last restored to prove it works.",
                  ar: "آخر مرة استُعيدت فيها نسخة لإثبات عملها.",
                },
              },
            },
            {
              name: "stagingRefreshedAt",
              type: "date",
              label: { en: "Staging copy refreshed", ar: "تحديث نسخة الاختبار" },
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: {
                  en: "When the practice copy was last refreshed.",
                  ar: "آخر مرة حُدّثت فيها نسخة التدريب.",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

const CAIRO = {
  timeZone: "Africa/Cairo",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
} as const;
const cairo = { en: new Intl.DateTimeFormat("en-GB", CAIRO), ar: new Intl.DateTimeFormat("ar-u-nu-latn", CAIRO) };
const cairoText = (v: unknown, req?: { locale?: unknown }) =>
  typeof v === "string" && v ? cairo[req?.locale === "ar" ? "ar" : "en"].format(new Date(v)) : "";

export const OnCallRoster: GlobalConfig = {
  slug: "on-call-roster",
  label: { en: "On-call roster", ar: "جدول المناوبة" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: { read: loggedIn, update: ({ req }) => ["management", "office-admin"].includes(String(req.user?.role)) },
  fields: [
    {
      name: "shifts",
      type: "array",
      label: { en: "Shifts", ar: "المناوبات" },
      labels: { singular: { en: "Shift", ar: "مناوبة" }, plural: { en: "Shifts", ar: "المناوبات" } },
      admin: {
        description: { en: "Who covers after-hours requests, and when.", ar: "من يغطي الطلبات بعد الدوام، ومتى." },
      },
      custom: {
        actions: [
          {
            label: words({ en: "Edit", ar: "تعديل" }),
            roles: ["management", "office-admin"],
            call: { path: "/roles/roster", body: { id: "$row.id" } },
            fields: [
              {
                type: "relationship",
                relationTo: "users",
                name: "user",
                label: words({ en: "On duty", ar: "المناوب" }),
                required: true,
                defaultValue: "$row.user.id",
              },
              {
                type: "relationship",
                relationTo: "users",
                name: "backup",
                label: words({ en: "Backup", ar: "الاحتياطي" }),
                defaultValue: "$row.backup.id",
              },
            ],
            done: words({ en: "Roster saved", ar: "حُفظ جدول المناوبة" }),
          },
        ] satisfies CollectionAction[],
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "from",
              type: "date",
              label: { en: "From", ar: "من" },
              required: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: { en: "When the shift starts.", ar: "وقت بدء المناوبة." },
              },
            },
            {
              name: "to",
              type: "date",
              label: { en: "To", ar: "إلى" },
              required: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description: { en: "When the shift ends.", ar: "وقت انتهاء المناوبة." },
              },
            },
            {
              name: "user",
              type: "relationship",
              relationTo: "users",
              required: true,
              label: { en: "On duty", ar: "المناوب" },
              admin: {
                description: {
                  en: "Takes after-hours calls for this shift.",
                  ar: "يتلقى اتصالات ما بعد الدوام في هذه المناوبة.",
                },
                placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
              },
            },
            {
              name: "backup",
              type: "relationship",
              label: { en: "Backup", ar: "البديل" },
              relationTo: "users",
              admin: {
                description: {
                  en: "Steps in if the first person does not answer.",
                  ar: "يتدخل إذا لم يرد الشخص الأول.",
                },
                placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
              },
            },
          ],
        },
        fromRow(
          {
            name: "now",
            type: "checkbox",
            label: { en: "On now", ar: "مناوب الآن" },
            admin: { description: { en: "Ticked while this shift is running.", ar: "محدد طوال سير هذه المناوبة." } },
          },
          ({ from, to }) => new Date(String(from)) <= TODAY && TODAY < new Date(String(to)),
        ),
        fromRow(
          {
            name: "shift",
            type: "text",
            label: { en: "Shift (Cairo)", ar: "المناوبة (القاهرة)" },
            admin: { description: { en: "The shift in Cairo time.", ar: "المناوبة بتوقيت القاهرة." } },
            custom: { toneWhen: [{ when: { now: { equals: true } }, tone: "primary" }] },
          },
          ({ from, to }, req) => `${cairoText(from, req)} → ${cairoText(to, req)}`,
        ),
      ],
    },
    {
      name: "escalateAfterMinutes",
      type: "number",
      label: { en: "Escalate After Minutes", ar: "التصعيد بعد (دقائق)" },
      min: 1,
      defaultValue: 15,
      admin: {
        description: {
          en: "Minutes before an unanswered request goes to the backup.",
          ar: "الدقائق قبل تحويل الطلب غير المُجاب إلى الاحتياطي.",
        },
        placeholder: { en: "e.g. 15", ar: "مثال: 15" },
      },
    },
    {
      name: "seniorContacts",
      type: "array",
      label: { en: "Senior Contacts", ar: "جهات الاتصال العليا" },
      admin: { description: { en: "People alerted when nobody answers.", ar: "الأشخاص المنبَّهون عندما لا يرد أحد." } },
      fields: [
        {
          name: "user",
          type: "relationship",
          label: { en: "User", ar: "المستخدم" },
          relationTo: "users",
          required: true,
          admin: {
            description: { en: "A senior person to alert.", ar: "شخص أقدم يُنبَّه." },
            placeholder: words({ en: "Pick a person", ar: "اختر شخصًا" }),
          },
        },
      ],
    },
  ],
};

export const USAGE_SOURCES = [
  "AI log: reading",
  "AI log: questions",
  "AI log: briefings",
  "Inbox",
  "Support log",
  "Change requests",
] as const;

export const ServiceUsage: GlobalConfig = {
  slug: "service-usage",
  label: { en: "Service usage", ar: "استخدام الخدمة" },
  admin: { group: { en: "Configuration", ar: "الإعدادات" } },
  access: staffRead,
  fields: [
    {
      name: "plan",
      type: "array",
      label: { en: "Full-use plan", ar: "خطة الاستخدام الكامل" },
      labels: { singular: { en: "Measure", ar: "مقياس" }, plural: { en: "Measures", ar: "المقاييس" } },
      admin: {
        description: {
          en: "Each measure of the service and how much of it a month at full use means.",
          ar: "كل مقياس للخدمة وما يعنيه الاستخدام الكامل منه شهريًا.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "line",
              type: "select",
              label: { en: "Line", ar: "البند" },
              required: true,
              options: [
                { value: "AI usage", label: { en: "AI usage", ar: "استخدام الذكاء الاصطناعي" } },
                { value: "Hosting", label: { en: "Hosting", ar: "الاستضافة" } },
                { value: "Support & care", label: { en: "Support & care", ar: "الدعم والرعاية" } },
                { value: "Continuous improvement", label: { en: "Continuous improvement", ar: "التحسين المستمر" } },
              ],
              admin: {
                description: { en: "Which line of the service it counts.", ar: "بند الخدمة الذي يحسبه." },
                placeholder: words({ en: "Pick a line", ar: "اختر بندًا" }),
              },
            },
            {
              name: "measure",
              type: "text",
              label: { en: "Measure", ar: "المقياس" },
              localized: true,
              required: true,
              admin: {
                description: { en: "What is counted, in plain words.", ar: "ما يُحسب، بكلمات بسيطة." },
                placeholder: { en: "e.g. Documents read", ar: "مثال: المستندات المقروءة" },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "source",
              type: "select",
              label: { en: "Source", ar: "المصدر" },
              required: true,
              options: choices(USAGE_SOURCES, {
                "AI log: reading": "سجل الذكاء الاصطناعي: القراءة",
                "AI log: questions": "سجل الذكاء الاصطناعي: الأسئلة",
                "AI log: briefings": "سجل الذكاء الاصطناعي: الملخصات",
                Inbox: "صندوق الوارد",
                "Support log": "سجل الدعم",
                "Change requests": "طلبات التغيير",
              }),
              admin: {
                description: { en: "Where the platform counts it.", ar: "أين تحسبه المنصة." },
                placeholder: words({ en: "Pick a source", ar: "اختر مصدرًا" }),
              },
            },
            {
              name: "fullUse",
              type: "number",
              min: 0,
              required: true,
              label: { en: "Full use a month", ar: "الاستخدام الكامل شهريًا" },
              admin: {
                description: {
                  en: "How much of it a month at full use means.",
                  ar: "ما يعنيه الاستخدام الكامل منه شهريًا.",
                },
                placeholder: { en: "e.g. 1500", ar: "مثال: 1500" },
              },
            },
            {
              name: "earlier",
              type: "number",
              min: 0,
              defaultValue: 0,
              label: { en: "Counted earlier this month", ar: "المحسوب سابقًا هذا الشهر" },
              admin: {
                description: {
                  en: "Counted this month before the records kept here.",
                  ar: "المحسوب هذا الشهر قبل السجلات المحفوظة هنا.",
                },
                placeholder: { en: "e.g. 260", ar: "مثال: 260" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "support",
      type: "array",
      label: { en: "Support log", ar: "سجل الدعم" },
      labels: { singular: { en: "Visit", ar: "زيارة" }, plural: { en: "Visits", ar: "الزيارات" } },
      admin: {
        description: {
          en: "Each piece of support work, with the time it took.",
          ar: "كل عمل دعم، مع الوقت الذي استغرقه.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "date",
              type: "date",
              label: { en: "Date", ar: "التاريخ" },
              required: true,
              admin: { description: { en: "When it was done.", ar: "وقت إنجازه." } },
            },
            {
              name: "hours",
              type: "number",
              label: { en: "Hours", ar: "الساعات" },
              min: 0,
              required: true,
              admin: {
                step: 0.5,
                description: { en: "Time it took, in hours.", ar: "الوقت المستغرق، بالساعات." },
                placeholder: { en: "e.g. 1.5", ar: "مثال: 1.5" },
              },
            },
            {
              name: "kind",
              type: "select",
              label: { en: "Kind", ar: "النوع" },
              options: [
                { value: "Fix", label: { en: "Fix", ar: "إصلاح" } },
                { value: "Update", label: { en: "Update", ar: "تحديث" } },
                { value: "Security patch", label: { en: "Security patch", ar: "تصحيح أمني" } },
                { value: "Question", label: { en: "Question", ar: "سؤال" } },
                { value: "Training", label: { en: "Training", ar: "تدريب" } },
              ],
              custom: tones({
                Fix: "warning",
                Update: "info",
                "Security patch": "error",
                Question: "neutral",
                Training: "success",
              }),
              admin: {
                description: { en: "What sort of work it was.", ar: "نوع العمل." },
                placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
              },
            },
          ],
        },
        {
          name: "topic",
          type: "text",
          label: { en: "Topic", ar: "الموضوع" },
          localized: true,
          required: true,
          admin: {
            description: { en: "What was done, in one line.", ar: "ما أُنجز، في سطر واحد." },
            placeholder: { en: "e.g. Mailbox rule for purchasing@", ar: "مثال: قاعدة بريد لـ purchasing@" },
          },
        },
      ],
    },
    {
      name: "changes",
      type: "array",
      label: { en: "Change requests", ar: "طلبات التغيير" },
      labels: { singular: { en: "Request", ar: "طلب" }, plural: { en: "Requests", ar: "الطلبات" } },
      admin: {
        description: {
          en: "Small changes and new automations you asked for.",
          ar: "تغييرات صغيرة وأتمتة جديدة طلبتموها.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "requestedAt",
              type: "date",
              label: { en: "Requested At", ar: "تاريخ الطلب" },
              required: true,
              admin: { description: { en: "When it was asked for.", ar: "وقت طلبه." } },
            },
            {
              name: "requestedBy",
              type: "relationship",
              label: { en: "Requested By", ar: "طلبه" },
              relationTo: "users",
              admin: {
                description: { en: "Who asked for it.", ar: "من طلبه." },
                placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
              },
            },
            {
              name: "status",
              type: "select",
              label: { en: "Status", ar: "الحالة" },
              defaultValue: "Requested",
              options: [
                { value: "Requested", label: { en: "Requested", ar: "مطلوب" } },
                { value: "Estimated", label: { en: "Estimated", ar: "مُقدَّر" } },
                { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
                { value: "In progress", label: { en: "In progress", ar: "قيد التنفيذ" } },
                { value: "Done", label: { en: "Done", ar: "تم" } },
              ],
              custom: tones({
                Requested: "neutral",
                Estimated: "info",
                Approved: "warning",
                "In progress": "info",
                Done: "success",
              }),
              admin: {
                description: {
                  en: "Estimated and approved before any work starts.",
                  ar: "يُقدَّر ويُعتمد قبل بدء أي عمل.",
                },
                placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
              },
            },
          ],
        },
        {
          name: "title",
          type: "text",
          label: { en: "Title", ar: "العنوان" },
          localized: true,
          required: true,
          admin: {
            description: { en: "The change, in one line.", ar: "التغيير، في سطر واحد." },
            placeholder: {
              en: "e.g. Weekly supplier scorecard by email",
              ar: "مثال: بطاقة أداء أسبوعية للموردين بالبريد",
            },
          },
        },
      ],
    },
  ],
};

export const globals = [
  Branding,
  Assistant,
  Settings,
  FxRates,
  PricingPolicy,
  ApprovalRules,
  AutomationRules,
  MessageTemplates,
  Integrations,
  OnCallRoster,
  ServiceUsage,
];
