import type { CollectionConfig, PayloadRequest } from "payload";
import {
  activeRate,
  type FxRate,
  CURRENCIES,
  QUOTE_DECISION_OPTIONS,
  ROLES,
  UNIT_OPTIONS,
  caseRef,
  computed,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
  ruleError,
  scalar,
} from "./shared.ts";
import { words } from "./shared.ts";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import { quotePreview } from "../pages/quote-preview.ts";
import { APPROVAL_STATUS_AR, CASE_PLACEHOLDER, PO_STATUS_AR, arabic, labelled } from "./fulfilment.ts";

type Json = Record<string, unknown>;
const num = (v: unknown, d = 0) => (typeof v === "number" && Number.isFinite(v) ? v : d);

const QUOTE_STATUS_AR: Record<string, string> = {
  Draft: "مسودة",
  "Awaiting approval": "بانتظار الاعتماد",
  Approved: "معتمد",
  Returned: "مُعاد",
  Submitted: "مُرسَل",
  Superseded: "مستبدَل",
};
const QUOTE_STATUSES = labelled(QUOTE_STATUS_AR);
const QUOTE_TONES = tones({
  Draft: "neutral",
  "Awaiting approval": "warning",
  Approved: "success",
  Returned: "error",
  Submitted: "info",
  Superseded: "neutral",
});

const COST_ROLES = ROLES.map((r) => r.value).filter((r) => r !== "sales");

function minMarginOf(req: PayloadRequest): Promise<number> {
  const ctx = (req.context ??= {}) as { minMargin?: Promise<number> };
  ctx.minMargin ??= req.payload
    .findGlobal({ slug: "pricing-policy" as never, depth: 0 } as never)
    .then((p) => num((p as Json).minMarginPct, 15))
    .catch(() => 15);
  return ctx.minMargin;
}

export const Quotations: CollectionConfig = {
  slug: "quotations",
  labels: {
    singular: { en: "Quotation", ar: "عرض سعر" },
    plural: { en: "Quotations", ar: "عروض الأسعار" },
  },
  custom: {
    edit: { steps: { field: "status", skip: ["Returned", "Superseded"] } },
    actions: [
      {
        label: words({ en: "Pricing", ar: "التسعير" }),
        roles: COST_ROLES,
        href: link.doc("cases", "$row.case", "pricing"),
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "version", "status", "decision", "totalExVat", "currency", "validUntil"],
    group: { en: "Commercial", ar: "التجاري" },
    components: {
      views: {
        edit: {
          preview: {
            Component: quotePreview,
            path: "/preview",
            tab: { label: "Preview & send", href: "/preview" },
          },
        },
      },
    },
  },
  access: deskAccess,
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data?.case) return data;
        const c = (await req.payload.findByID({
          locale: req.locale,
          collection: "cases",
          id: String(idOf(data.case)),
          depth: 0,
        })) as {
          caseId?: string;
        };
        const { totalDocs } = await req.payload.count({
          locale: req.locale,
          collection: "quotations" as never,
          where: { case: { equals: idOf(data.case) } },
        });
        const n = String(c.caseId ?? "").replace(/\D/g, "");
        return {
          ...data,
          version: data.version ?? totalDocs + 1,
          number: data.number ?? `GS-Q-${n} v${totalDocs + 1}`,
        };
      },
    ],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const lines = (data.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? [];
        const gross = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
        data.totalExVat = Math.round(gross * (1 - (Number(data.discountPct) || 0) / 100) * 100) / 100;
        if (
          originalDoc?.status === "Approved" &&
          data.status === "Approved" &&
          JSON.stringify(originalDoc.lines) !== JSON.stringify(data.lines)
        )
          throw ruleError(
            arabic(req)
              ? "هذا الإصدار معتمد. أنشئ إصدارًا معدَّلًا لتغيير البنود أو الأسعار."
              : "This version is approved. Create a revision to change lines or prices.",
          );
        if (data.status === "Approved" && originalDoc?.status !== "Approved" && req.user?.role !== "management")
          throw ruleError(arabic(req) ? "لا يعتمد عروض الأسعار إلا الإدارة." : "Only management can approve quotations.");
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: {
              en: `Quotation ${doc.number}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
              ar: `عرض السعر ${doc.number}: ${QUOTE_STATUS_AR[previousDoc?.status] ?? previousDoc?.status ?? "—"} ← ${QUOTE_STATUS_AR[doc.status] ?? doc.status}.`,
            },
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          unique: true,
          label: { en: "Number", ar: "الرقم" },
          admin: {
            readOnly: true,
            description: {
              en: "The quotation reference, made from the case number and version.",
              ar: "مرجع عرض السعر، مكوَّن من رقم الملف والإصدار.",
            },
          },
          custom: {
            about: {
              en: "Built as GS-Q-<case number> v<version> when the quotation is created, so every revision keeps a traceable number.",
              ar: "يُبنى بالصيغة GS-Q-<رقم الملف> v<الإصدار> عند إنشاء عرض السعر، فيحتفظ كل إصدار معدَّل برقم يمكن تتبعه.",
            },
          },
        },
        caseRef(true, {
          hint: { en: "The customer case this belongs to.", ar: "ملف العميل الذي يتبعه عرض السعر." },
          placeholder: CASE_PLACEHOLDER,
        }),
        {
          name: "version",
          type: "number",
          min: 1,
          label: { en: "Version", ar: "الإصدار" },
          admin: {
            readOnly: true,
            description: {
              en: "Revision count on this case, starting at 1.",
              ar: "عدد الإصدارات في هذا الملف، بدءًا من 1.",
            },
          },
        },
        {
          name: "previousVersion",
          type: "relationship",
          relationTo: "quotations",
          label: { en: "Previous Version", ar: "الإصدار السابق" },
          admin: {
            description: {
              en: "The earlier version this revision replaces.",
              ar: "الإصدار الأقدم الذي يحل محله هذا الإصدار.",
            },
            placeholder: words({ en: "e.g. GS-Q-0142 v1", ar: "مثال: GS-Q-0142 v1" }),
          },
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      label: { en: "Lines", ar: "البنود" },
      labels: { singular: { en: "Line", ar: "بند" }, plural: { en: "Lines", ar: "البنود" } },
      admin: {
        description: {
          en: "What the customer sees: no supplier names, costs or margins.",
          ar: "ما يراه العميل: بلا أسماء موردين أو تكاليف أو هوامش ربح.",
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
              label: { en: "Line No", ar: "رقم البند" },
              admin: {
                description: {
                  en: "Position on the quotation, as on the customer's RFQ.",
                  ar: "ترتيب البند في عرض السعر، كما في طلب عرض أسعار العميل.",
                },
                placeholder: words({ en: "e.g. 3", ar: "مثال: 3" }),
              },
            },
            {
              name: "partNo",
              type: "text",
              label: { en: "Part No", ar: "رقم القطعة" },
              admin: {
                description: {
                  en: "IMPA, ISSA or maker part number the customer asked for.",
                  ar: "رقم IMPA أو ISSA أو رقم قطعة الصانع الذي طلبه العميل.",
                },
                placeholder: words({ en: "e.g. 232101", ar: "مثال: 232101" }),
              },
            },
            {
              name: "description",
              type: "text",
              required: true,
              localized: true,
              label: { en: "Description", ar: "الوصف" },
              admin: {
                description: {
                  en: "The item as the customer reads it on the quotation.",
                  ar: "الصنف كما يقرؤه العميل في عرض السعر.",
                },
                placeholder: words({
                  en: "e.g. Welding electrodes E6013, 3.2 mm",
                  ar: "مثال: أقطاب لحام E6013، 3.2 مم",
                }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "unit",
              type: "select",
              options: UNIT_OPTIONS,
              label: { en: "Unit", ar: "الوحدة" },
              admin: {
                description: {
                  en: "Unit the quantity and price are quoted in.",
                  ar: "الوحدة التي تُسعَّر بها الكمية والسعر.",
                },
                placeholder: words({ en: "e.g. kg", ar: "مثال: kg" }),
              },
            },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              label: { en: "Qty", ar: "الكمية" },
              admin: {
                description: { en: "How many units the customer gets.", ar: "عدد الوحدات التي يحصل عليها العميل." },
                placeholder: words({ en: "e.g. 25", ar: "مثال: 25" }),
              },
            },
            {
              name: "unitPrice",
              type: "number",
              min: 0,
              required: true,
              label: { en: "Unit Price", ar: "سعر الوحدة" },
              admin: {
                description: {
                  en: "Price per unit before VAT, in the quotation currency.",
                  ar: "سعر الوحدة قبل ضريبة القيمة المضافة، بعملة عرض السعر.",
                },
                placeholder: words({ en: "e.g. 18.50", ar: "مثال: 18.50" }),
              },
            },
            {
              name: "lead",
              type: "text",
              defaultValue: "On arrival",
              localized: true,
              label: { en: "Lead", ar: "مدة التوريد" },
              admin: {
                description: {
                  en: "When the line can be delivered to the vessel.",
                  ar: "متى يمكن تسليم البند إلى السفينة.",
                },
                placeholder: words({ en: "e.g. 5 days ex stock", ar: "مثال: 5 أيام من المخزون" }),
              },
            },
          ],
        },
        {
          name: "alternative",
          type: "checkbox",
          label: { en: "Alternative (customer accepted)", ar: "بديل (وافق عليه العميل)" },
          defaultValue: false,
          admin: {
            description: {
              en: "Tick when the item replaces the one asked for and the customer agreed.",
              ar: "ضع علامة إذا حل الصنف محل المطلوب ووافق العميل.",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          defaultValue: "USD",
          label: { en: "Currency", ar: "العملة" },
          admin: {
            description: { en: "The currency the customer is quoted in.", ar: "العملة التي يُسعَّر بها العميل." },
            placeholder: words({ en: "e.g. USD", ar: "مثال: USD" }),
          },
        },
        {
          name: "fxRate",
          type: "number",
          min: 0,
          label: { en: "FX (EGP per unit)", ar: "سعر الصرف (جنيه لكل وحدة)" },
          admin: {
            description: {
              en: "EGP per one unit of the quotation currency.",
              ar: "عدد الجنيهات لكل وحدة من عملة عرض السعر.",
            },
            placeholder: words({ en: "e.g. 48.50", ar: "مثال: 48.50" }),
          },
        },
        {
          name: "discountPct",
          type: "number",
          min: 0,
          max: 50,
          defaultValue: 0,
          label: { en: "Discount Pct", ar: "نسبة الخصم" },
          admin: {
            description: { en: "Percent off the line total, up to 50.", ar: "نسبة الخصم من إجمالي البنود، حتى 50." },
            placeholder: words({ en: "e.g. 5", ar: "مثال: 5" }),
          },
        },
        {
          name: "totalExVat",
          type: "number",
          min: 0,
          label: { en: "Total Ex Vat", ar: "الإجمالي قبل الضريبة" },
          admin: {
            readOnly: true,
            description: {
              en: "Line total after discount, before VAT.",
              ar: "إجمالي البنود بعد الخصم، قبل ضريبة القيمة المضافة.",
            },
          },
          custom: formats.money("currency", { decimals: 2 }),
        },
      ],
    },
    {
      name: "internal",
      type: "group",
      label: { en: "Internal (never printed)", ar: "داخلي (لا يُطبع أبدًا)" },
      admin: {
        description: {
          en: "Costs and margin for approvers; hidden from Sales and never on the PDF.",
          ar: "التكاليف وهامش الربح للمعتمدين؛ مخفية عن المبيعات ولا تظهر في ملف PDF.",
        },
      },
      access: { read: costVisible },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "landedCostEGP",
              type: "number",
              min: 0,
              label: { en: "Landed cost", ar: "التكلفة الواصلة" },
              admin: {
                description: {
                  en: "Supplier price plus freight and duties, in EGP.",
                  ar: "سعر المورّد مضافًا إليه الشحن والرسوم، بالجنيه.",
                },
                placeholder: words({ en: "e.g. 84,000", ar: "مثال: 84,000" }),
              },
              custom: formats.money("EGP"),
            },
            {
              name: "grossProfitEGP",
              type: "number",
              label: { en: "Gross profit", ar: "إجمالي الربح" },
              admin: {
                description: {
                  en: "Sales total minus landed cost, in EGP.",
                  ar: "إجمالي البيع ناقص التكلفة الواصلة، بالجنيه.",
                },
                placeholder: words({ en: "e.g. 16,500", ar: "مثال: 16,500" }),
              },
              custom: formats.money("EGP"),
            },
            {
              name: "marginPct",
              type: "number",
              label: { en: "Margin", ar: "هامش الربح" },
              admin: {
                description: {
                  en: "Gross profit as a percent of the sales total.",
                  ar: "إجمالي الربح نسبةً إلى إجمالي البيع.",
                },
                placeholder: words({ en: "e.g. 18", ar: "مثال: 18" }),
              },
              custom: {
                about: {
                  en: "Compared with the pricing policy's minimum margin; below it, the quotation needs a management exception.",
                  ar: "يُقارَن بالحد الأدنى لهامش الربح في سياسة التسعير؛ وإذا قلّ عنه احتاج عرض السعر إلى استثناء من الإدارة.",
                },
                ...formats.percent(),
                toneWhen: [
                  { when: { "internal.belowMinimum": { equals: true } }, tone: "warning" },
                  { when: { "internal.marginPct": { exists: true } }, tone: "success" },
                ],
              },
            },
          ],
        },
        {
          name: "exceptions",
          type: "textarea",
          localized: true,
          label: { en: "Exceptions", ar: "الاستثناءات" },
          admin: {
            description: {
              en: "Why this needs a closer look: low margin, alternative pack, advance payment.",
              ar: "سبب الحاجة إلى مراجعة أدق: هامش منخفض، عبوة بديلة، دفعة مقدمة.",
            },
            placeholder: words({
              en: "e.g. Margin 11%, below the 15% minimum",
              ar: "مثال: هامش 11%، أقل من الحد الأدنى 15%",
            }),
          },
          custom: {
            about: {
              en: "The approver reads this first. Leave empty when the quotation is within policy.",
              ar: "يقرأ المعتمد هذا أولًا. اتركه فارغًا إذا كان عرض السعر ضمن السياسة.",
            },
          },
        },
        {
          type: "row",
          fields: [
            computed(
              {
                name: "minMarginPct",
                type: "number",
                label: { en: "Policy minimum", ar: "الحد الأدنى للسياسة" },
                admin: {
                  description: {
                    en: "The lowest margin the pricing policy allows.",
                    ar: "أدنى هامش ربح تسمح به سياسة التسعير.",
                  },
                },
                custom: formats.percent(0),
              },
              async (_q, req) => minMarginOf(req),
            ),
            computed(
              {
                name: "belowMinimum",
                type: "checkbox",
                label: { en: "Below the policy minimum", ar: "أقل من الحد الأدنى للسياسة" },
                admin: {
                  description: {
                    en: "Ticked when the margin is under the policy minimum.",
                    ar: "يُعلَّم حين يقل الهامش عن الحد الأدنى للسياسة.",
                  },
                },
              },
              async (q, req) => num((q.internal as Json | undefined)?.marginPct) < (await minMarginOf(req)),
            ),
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "validUntil",
          type: "date",
          label: { en: "Valid Until", ar: "صالح حتى" },
          admin: {
            description: {
              en: "Last day the customer can accept these prices.",
              ar: "آخر يوم يمكن للعميل فيه قبول هذه الأسعار.",
            },
          },
        },
        {
          name: "paymentTerms",
          type: "text",
          defaultValue: "90 days from invoice date",
          localized: true,
          label: { en: "Payment Terms", ar: "شروط الدفع" },
          admin: {
            description: { en: "When and how the customer pays.", ar: "متى وكيف يدفع العميل." },
            placeholder: words({ en: "e.g. 60 days from invoice date", ar: "مثال: 60 يومًا من تاريخ الفاتورة" }),
          },
        },
        {
          name: "deliveryTerms",
          type: "text",
          localized: true,
          label: { en: "Delivery Terms", ar: "شروط التسليم" },
          admin: {
            description: {
              en: "Where and on what terms stores are handed over.",
              ar: "أين وبأي شروط تُسلَّم المؤن.",
            },
            placeholder: words({
              en: "e.g. Delivered alongside, Port Said anchorage",
              ar: "مثال: تسليم بجانب السفينة، مخطاف بورسعيد",
            }),
          },
        },
      ],
    },
    {
      name: "remarks",
      type: "textarea",
      localized: true,
      label: { en: "Remarks", ar: "ملاحظات" },
      admin: {
        description: {
          en: "Notes printed on the quotation for the customer.",
          ar: "ملاحظات تُطبع في عرض السعر للعميل.",
        },
        placeholder: words({
          en: "e.g. Prices exclude VAT and port dues.",
          ar: "مثال: الأسعار لا تشمل ضريبة القيمة المضافة ورسوم الميناء.",
        }),
      },
    },
    computed(
      {
        name: "versions",
        type: "array",
        label: { en: "Versions", ar: "الإصدارات" },
        admin: {
          position: "sidebar",
          description: { en: "Every version on this case, oldest first.", ar: "كل إصدارات هذا الملف، الأقدم أولًا." },
        },
        fields: [
          {
            name: "number",
            type: "text",
            label: { en: "Number", ar: "الرقم" },
            admin: {
              description: { en: "Quotation reference of that version.", ar: "مرجع عرض السعر لذلك الإصدار." },
              placeholder: words({ en: "e.g. GS-Q-0142 v2", ar: "مثال: GS-Q-0142 v2" }),
            },
            custom: { href: link.doc("quotations", "$row.id", "preview") },
          },
          {
            name: "version",
            type: "number",
            label: { en: "Version", ar: "الإصدار" },
            admin: {
              description: { en: "Revision number of that version.", ar: "رقم ذلك الإصدار." },
              placeholder: words({ en: "e.g. 2", ar: "مثال: 2" }),
            },
          },
          {
            name: "status",
            type: "select",
            options: QUOTE_STATUSES,
            label: { en: "Status", ar: "الحالة" },
            admin: {
              description: { en: "Where that version stands.", ar: "موقف ذلك الإصدار." },
              placeholder: words({ en: "e.g. Approved", ar: "مثال: معتمد" }),
            },
            custom: QUOTE_TONES,
          },
          {
            name: "totalExVat",
            type: "number",
            label: { en: "Total", ar: "الإجمالي" },
            admin: {
              description: { en: "That version's total before VAT.", ar: "إجمالي ذلك الإصدار قبل الضريبة." },
              placeholder: words({ en: "e.g. 4,250", ar: "مثال: 4,250" }),
            },
            custom: formats.money("currency", { decimals: 2 }),
          },
          {
            name: "currency",
            type: "text",
            label: { en: "Currency", ar: "العملة" },
            admin: {
              description: { en: "Currency of that version.", ar: "عملة ذلك الإصدار." },
              placeholder: words({ en: "e.g. USD", ar: "مثال: USD" }),
            },
          },
        ],
      },
      async (q, req) => {
        if (req.context?.quotationVersions || !idOf(q.case)) return [];
        const { docs } = await req.payload.find({
          locale: req.locale,
          collection: "quotations" as never,
          where: { case: { equals: idOf(q.case) } } as never,
          sort: "version",
          limit: 0,
          depth: 0,
          context: { quotationVersions: true },
        } as never);
        return (docs as unknown as Json[]).map((v) => ({
          id: scalar(v.id),
          number: scalar(v.number),
          version: num(v.version),
          status: scalar(v.status),
          totalExVat: num(v.totalExVat),
          currency: scalar(v.currency),
        }));
      },
    ),
    {
      name: "submission",
      type: "group",
      label: { en: "Submission", ar: "الإرسال" },
      admin: {
        description: {
          en: "How and when the quotation went to the customer.",
          ar: "كيف ومتى أُرسل عرض السعر إلى العميل.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "method",
              type: "select",
              options: labelled({
                "Email from Odoo": "بريد إلكتروني من Odoo",
                "Customer procurement portal": "بوابة مشتريات العميل",
              }),
              defaultValue: "Email from Odoo",
              label: { en: "Method", ar: "الطريقة" },
              admin: {
                description: {
                  en: "How the customer received the quotation.",
                  ar: "كيف تسلّم العميل عرض السعر.",
                },
                placeholder: words({ en: "e.g. Email from Odoo", ar: "مثال: بريد إلكتروني من Odoo" }),
              },
            },
            {
              name: "submittedAt",
              type: "date",
              label: { en: "Submitted At", ar: "تاريخ الإرسال" },
              admin: { description: { en: "When the quotation was sent.", ar: "متى أُرسل عرض السعر." } },
            },
            {
              name: "followUpAt",
              type: "date",
              label: { en: "Follow Up At", ar: "موعد المتابعة" },
              admin: {
                description: { en: "When to chase the customer for an answer.", ar: "متى نتابع العميل للحصول على رد." },
              },
            },
          ],
        },
        {
          name: "portalCheck",
          type: "array",
          label: { en: "Portal Check", ar: "مراجعة البوابة" },
          labels: {
            singular: { en: "Checked field", ar: "حقل مُراجَع" },
            plural: { en: "Portal vs quote", ar: "البوابة مقابل العرض" },
          },
          admin: {
            description: {
              en: "Compare what the portal shows with the quotation.",
              ar: "قارن ما تعرضه البوابة بعرض السعر.",
            },
            condition: (_, s) => s?.method === "Customer procurement portal",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "field",
                  type: "text",
                  required: true,
                  localized: true,
                  label: { en: "Field", ar: "الحقل" },
                  admin: {
                    description: { en: "The portal field being checked.", ar: "حقل البوابة قيد المراجعة." },
                    placeholder: words({ en: "e.g. Total price", ar: "مثال: السعر الإجمالي" }),
                  },
                },
                {
                  name: "portal",
                  type: "text",
                  label: { en: "Portal", ar: "البوابة" },
                  admin: {
                    description: { en: "The value as entered in the portal.", ar: "القيمة كما أُدخلت في البوابة." },
                    placeholder: words({ en: "e.g. USD 4,250.00", ar: "مثال: USD 4,250.00" }),
                  },
                },
                {
                  name: "quote",
                  type: "text",
                  label: { en: "Quote", ar: "العرض" },
                  admin: {
                    description: { en: "The value on our quotation.", ar: "القيمة في عرض السعر الخاص بنا." },
                    placeholder: words({ en: "e.g. USD 4,250.00", ar: "مثال: USD 4,250.00" }),
                  },
                },
                {
                  name: "matches",
                  type: "checkbox",
                  defaultValue: false,
                  label: { en: "Matches", ar: "مطابق" },
                  admin: {
                    description: {
                      en: "Tick when the portal value equals the quotation.",
                      ar: "ضع علامة إذا طابقت قيمة البوابة عرض السعر.",
                    },
                  },
                },
              ],
            },
          ],
        },
        evidence(
          "receipt",
          { en: "Portal receipt / screenshot", ar: "إيصال البوابة / لقطة شاشة" },
          {
            hint: {
              en: "The portal's confirmation that the quotation was received.",
              ar: "تأكيد البوابة استلام عرض السعر.",
            },
          },
        ),
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: QUOTE_STATUSES,
      custom: QUOTE_TONES,
      label: { en: "Status", ar: "الحالة" },
      admin: {
        position: "sidebar",
        description: {
          en: "Where this version is in approval and sending.",
          ar: "موقع هذا الإصدار في الاعتماد والإرسال.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
    {
      name: "decision",
      type: "select",
      options: QUOTE_DECISION_OPTIONS,
      label: { en: "Decision", ar: "القرار" },
      admin: {
        position: "sidebar",
        description: { en: "The customer's answer to this quotation.", ar: "رد العميل على عرض السعر هذا." },
        placeholder: words({ en: "Pick the outcome", ar: "اختر النتيجة" }),
      },
    },
    {
      name: "preparedBy",
      type: "relationship",
      relationTo: "users",
      label: { en: "Prepared By", ar: "أعدّه" },
      admin: {
        position: "sidebar",
        description: { en: "The salesperson who priced this quotation.", ar: "مندوب المبيعات الذي سعّر عرض السعر هذا." },
        placeholder: words({ en: "Search people", ar: "ابحث عن الأشخاص" }),
      },
    },
    {
      name: "approvedBy",
      type: "relationship",
      relationTo: "users",
      label: { en: "Approved By", ar: "اعتمده" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "The manager who approved this version.", ar: "المدير الذي اعتمد هذا الإصدار." },
      },
    },
  ],
};

const SHORT_DAY = {
  en: { locale: "en-GB" },
  ar: { locale: "ar-EG-u-nu-latn" },
};
const shortDay = (v: unknown, ar = false) =>
  scalar(v)
    ? new Date(scalar(v)).toLocaleDateString(SHORT_DAY[ar ? "ar" : "en"].locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : "";
const egp = (n: number) => `EGP ${Math.round(n).toLocaleString("en-US")}`;
const amount = (cur: unknown, n: number) =>
  `${scalar(cur)} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`.trim();

const APPROVAL_TYPES_AR: Record<string, string> = {
  "Customer quotation": "عرض سعر للعميل",
  "Quotation margin exception": "استثناء هامش ربح عرض السعر",
  "Customer discount": "خصم للعميل",
  "Alternative product (internal)": "منتج بديل (داخلي)",
  "Supplier PO": "أمر شراء من مورّد",
  "Supplier deposit (payment)": "مقدّم للمورّد (دفعة)",
  "Supplier payment": "دفعة لمورّد",
  "Bank detail change": "تغيير بيانات بنكية",
  "Exchange rate": "سعر الصرف",
  "Agency pricelist": "قائمة أسعار الوكالة",
  "Approved-vendor status": "صفة المورّد المعتمد",
  "Close with exception": "إغلاق باستثناء",
};
const APPROVAL_TYPES = Object.keys(APPROVAL_TYPES_AR);

export const APPROVAL_STATUSES = ["Pending", "Approved 1 of 2", "Approved", "Rejected"];
export const FINAL_APPROVAL = ["Approved", "Rejected"];
export const PAYMENT_APPROVALS = ["Supplier deposit (payment)", "Supplier payment"];
const FINANCE_ROLES = ["management", "finance-director", "operations"];

const ROLE_LABEL: Record<string, { en: string; ar: string }> = {
  management: { en: "management", ar: "الإدارة" },
  "finance-director": { en: "finance", ar: "المالية" },
  "supply-chain": { en: "supply chain", ar: "سلسلة الإمداد" },
  sales: { en: "sales", ar: "المبيعات" },
  operations: { en: "operations", ar: "العمليات" },
  "office-admin": { en: "office admin", ar: "الشؤون الإدارية" },
};

const all = async (req: PayloadRequest, collection: string, where?: Json): Promise<Json[]> =>
  (
    await req.payload.find({
      locale: req.locale,
      collection: collection as never,
      where: where as never,
      limit: 0,
      depth: 0,
    } as never)
  ).docs as unknown as Json[];
const one = (req: PayloadRequest, collection: string, id: string) =>
  req.payload
    .findByID({ collection: collection as never, id, depth: 0 } as never)
    .catch(() => null) as Promise<Json | null>;
const global = (req: PayloadRequest, slug: string) =>
  req.payload
    .findGlobal({ locale: req.locale, slug: slug as never, depth: 0 } as never)
    .catch(() => ({})) as Promise<Json>;

function shared(req: PayloadRequest) {
  const ctx = (req.context ??= {}) as {
    approvalRefs?: Promise<{ users: Map<string, Json>; rules: Json[]; minMargin: number }>;
  };
  ctx.approvalRefs ??= (async () => {
    const [users, rules, policy] = await Promise.all([
      all(req, "users"),
      global(req, "approval-rules"),
      global(req, "pricing-policy"),
    ]);
    return {
      users: new Map(users.map((u) => [scalar(u.id), u])),
      rules: (rules.rules as Json[] | undefined) ?? [],
      minMargin: num(policy.minMarginPct, 15),
    };
  })();
  return ctx.approvalRefs;
}

const quotationSubject = (a: Json | undefined) =>
  (a?.subject as { relationTo?: string } | undefined)?.relationTo === "quotations";

const hiddenFromSales = ({ req, doc }: { req: PayloadRequest; doc?: Json }) =>
  (req.user as { role?: string } | null | undefined)?.role !== "sales" || (doc !== undefined && !quotationSubject(doc));

async function quotationOf(req: PayloadRequest, a: Json): Promise<Json | null> {
  if (!/quotation|discount/i.test(scalar(a.type)) && !quotationSubject(a)) return null;
  const subject = idOf((a.subject as { value?: unknown } | undefined)?.value);
  const caseId = idOf(a.case);
  const quotes = caseId ? await all(req, "quotations", { case: { equals: caseId } }) : [];
  return (
    quotes.find((x) => x.id === subject) ??
    quotes.filter((x) => x.status === "Awaiting approval").sort((x, y) => num(y.version) - num(x.version))[0] ??
    null
  );
}

async function purchaseOrderOf(req: PayloadRequest, a: Json): Promise<Json | null> {
  if (!/deposit|payment/i.test(scalar(a.type))) return null;
  const caseId = idOf(a.case);
  const pos = await all(req, "purchase-orders", caseId ? { case: { equals: caseId } } : undefined);
  const text = `${scalar(a.title)} ${scalar(a.detail)}`;
  return pos.find((p) => scalar(p.number) && text.includes(scalar(p.number))) ?? (caseId ? (pos[0] ?? null) : null);
}

export interface ApprovalView {
  canDecide: boolean;
  progress: string;
  whoDecides: string;
  why: string;
  afterYou: string;
  evidence: string;
  quotation: string | null;
  payment: {
    po: string;
    purchaseOrder: string;
    supplier: string;
    currency: string;
    amount: number;
    amountText: string;
    kind: string;
    recorded: boolean;
    open: boolean;
    reference: string;
  } | null;
}

export async function approvalView(a: Json, req: PayloadRequest): Promise<ApprovalView> {
  const me = req.user as { id?: string; role?: string } | null | undefined;
  const ctx = (req.context ??= {}) as { approvalViews?: Map<string, Promise<ApprovalView>> };
  const key = [a.id, a.updatedAt, a.status, ((a.decisions as unknown[]) ?? []).length, me?.id, req.locale].join("|");
  ctx.approvalViews ??= new Map();
  let view = ctx.approvalViews.get(key);
  if (!view) {
    view = compute(a, req, me);
    ctx.approvalViews.set(key, view);
  }
  return view;
}

function bankChangeSupplierHref(): string {
  if (IS_TEMP_MOCK) {
    return link.doc("suppliers", "S3");
  } else {
    throw new TempMockError(
      'the bank-detail-change approval\'s "Supplier record" action opens supplier S3 whatever the request: link the approval to its supplier and open that one',
    );
  }
}

function outgoingBankReference(a: Json): string {
  if (IS_MOCK) {
    return `TRX-88${scalar(a.id).slice(-3)}`;
  } else {
    throw new NotConnectedError(
      "bank: the reference of the outgoing transfer that paid this approval, from the bank statement or feed",
    );
  }
}

async function compute(
  a: Json,
  req: PayloadRequest,
  me: { id?: string; role?: string } | null | undefined,
): Promise<ApprovalView> {
  const ar = arabic(req);
  const { users, rules, minMargin } = await shared(req);
  const name = (id: unknown) => scalar(users.get(idOf(id) ?? "")?.name) || scalar(idOf(id));
  const decisions = (a.decisions as { user?: unknown; decision?: string; at?: string; reason?: string }[]) ?? [];
  const listed = ((a.approvers as unknown[] | undefined) ?? []).map((x) => idOf(x) ?? "");
  const ids = listed.length
    ? listed
    : [...users.values()].filter((u) => u.role === "management").map((u) => scalar(u.id));
  const approvers = ids.map((id) => {
    const d = decisions.find((x) => idOf(x.user) === id);
    return { id, name: name(id), decision: d?.decision, at: d?.at };
  });
  const type = me?.role === "sales" && quotationSubject(a) ? "Customer quotation" : scalar(a.type);
  const status = scalar(a.status) || "Pending";
  const done = FINAL_APPROVAL.includes(status);
  const needed = a.twoPerson ? 2 : 1;
  const mine = approvers.find((x) => x.id === me?.id);
  const waiting = approvers.filter((x) => !x.decision);
  const decidedBy = approvers.filter((x) => x.decision);
  const or = ar ? " أو " : " or ";
  const waitingText = waiting.map((x) => (x.id === me?.id ? (ar ? "أنت" : "you") : x.name)).join(or);
  const decided = (d?: string) => (d === "Approve" ? (ar ? "اعتمد" : "approved") : ar ? "أعاد" : "returned");
  const progress = ar
    ? done
      ? `${APPROVAL_STATUS_AR[status] ?? status}: ${decidedBy.map((x) => x.name).join(" + ") || "—"}`
      : decidedBy.length
        ? `${decidedBy.map((x) => `${x.name} ${decided(x.decision)}`).join(" · ")} · بانتظار ${waitingText}`
        : `بانتظار ${waitingText}${needed > 1 ? " (شخصان)" : ""}`
    : done
      ? `${status} by ${decidedBy.map((x) => x.name).join(" + ") || "—"}`
      : decidedBy.length
        ? `${decidedBy.map((x) => `${x.name} ${decided(x.decision)}`).join(" · ")} · waiting for ${waitingText}`
        : `Waiting for ${waitingText}${needed > 1 ? ` (${needed} people)` : ""}`;
  const note = scalar(rules.find((r) => r.type === type)?.note);
  const canDecide = !done && Boolean(mine) && !mine?.decision;
  const role = ROLE_LABEL[scalar(me?.role)];
  const why = canDecide
    ? ""
    : ar
      ? done
        ? `تقرّر — ${progress}.`
        : mine?.decision
          ? `${mine.decision === "Approve" ? "اعتمدت" : "أعدت"} هذا الطلب في ${shortDay(mine.at, true)} · بانتظار ${waiting.map((x) => x.name).join(or)}.`
          : `لا يقرّر طلبات «${APPROVAL_TYPES_AR[type] ?? type}» إلا ${approvers.map((x) => x.name).join(" و")}${
              note ? ` (${note})` : ""
            }؛ أنت مسجّل الدخول بصفة ${role?.ar ?? scalar(me?.role)}.`
      : done
        ? `Decided — ${progress}.`
        : mine?.decision
          ? `You ${decided(mine.decision)} this on ${shortDay(mine.at)} · waiting for ${waiting.map((x) => x.name).join(or)}.`
          : `Only ${approvers.map((x) => x.name).join(" and ")} can decide ${type.toLowerCase()} approvals${
              note ? ` (${note.toLowerCase()})` : ""
            }; you are signed in as ${role?.en ?? scalar(me?.role)}.`;
  const approved = decisions.filter((d) => d.decision === "Approve").length;
  const others = approvers.filter((p) => !p.decision && p.id !== me?.id);
  const afterYou =
    a.twoPerson && needed - approved > 1
      ? ar
        ? `\nقاعدة الشخصين: بعدك يجب أن يعتمد ${others.map((p) => p.name).join(or)} أيضًا.`
        : `\nTwo-person rule: after you, ${others.map((p) => p.name).join(or)} must also approve.`
      : "";

  const evidence: [string, string][] = [];
  const say = (en: string, arText: string) => (ar ? arText : en);
  const sales = me?.role === "sales";
  const q = await quotationOf(req, a);
  if (q) {
    const internal = (q.internal as Json | undefined) ?? {};
    const qStatus = scalar(q.status);
    evidence.push([
      say("Quotation", "عرض السعر"),
      `${scalar(q.number)} · ${ar ? (QUOTE_STATUS_AR[qStatus] ?? qStatus) : qStatus}`,
    ]);
    evidence.push([say("Total (excl. VAT)", "الإجمالي (قبل الضريبة)"), amount(q.currency, num(q.totalExVat))]);
    const lineCount = ((q.lines as unknown[]) ?? []).length;
    evidence.push([
      say("Lines", "البنود"),
      ar
        ? `${lineCount} مسعّرة · صالح حتى ${shortDay(q.validUntil, true) || "—"}`
        : `${lineCount} priced · valid until ${shortDay(q.validUntil) || "—"}`,
    ]);
    if (sales) evidence.push([say("Margin", "هامش الربح"), say("Hidden for your role", "مخفي لدورك")]);
    else if (typeof internal.marginPct === "number")
      evidence.push([
        say("Margin", "هامش الربح"),
        ar
          ? `${internal.marginPct}% (الحد الأدنى للسياسة ${minMargin}%) · الربح ${egp(num(internal.grossProfitEGP))}`
          : `${internal.marginPct}% (policy minimum ${minMargin}%) · profit ${egp(num(internal.grossProfitEGP))}`,
      ]);
    if (internal.exceptions && !sales) evidence.push([say("Exceptions", "الاستثناءات"), scalar(internal.exceptions)]);
  } else if (type === "Exchange rate") {
    const rates = ((await global(req, "fx-rates")).rates as Json[] | undefined) ?? [];
    const proposed = rates.find((r) => r.status === "Awaiting approval");
    const active = activeRate(rates as FxRate[], scalar(proposed?.currency) || "USD") as Json | undefined;
    if (proposed && active) {
      const change = ((num(proposed.egpPerUnit) - num(active.egpPerUnit)) / num(active.egpPerUnit, 1)) * 100;
      evidence.push([
        say("Current", "الحالي"),
        `${scalar(active.currency)}/EGP ${num(active.egpPerUnit).toFixed(2)} ${say("since", "منذ")} ${shortDay(active.date, ar)}`,
      ]);
      evidence.push([
        say("Proposed", "المقترح"),
        `${scalar(proposed.currency)}/EGP ${num(proposed.egpPerUnit).toFixed(2)} (${change >= 0 ? "+" : ""}${change.toFixed(2)}%) · ${scalar(proposed.source)}`,
      ]);
    }
    const open = (await all(req, "quotations")).filter((x) =>
      ["Draft", "Awaiting approval", "Approved", "Submitted"].includes(scalar(x.status)),
    );
    evidence.push(
      ar
        ? ["عروض الأسعار المفتوحة المُعاد فحصها", `${open.length} (أسعار USD تبقى كما اعتُمدت؛ تكاليف EGP تتغير)`]
        : ["Open quotations re-checked", `${open.length} (prices in USD stay as approved; EGP costs move)`],
    );
  } else if (type === "Bank detail change") {
    if (IS_TEMP_MOCK) {
      if (ar) {
        evidence.push(["المورّد", "Port Said Welding Co. (S3) · مورّد معتمد منذ 2019"]);
        evidence.push(["الطلب", "حساب مستفيد جديد وصل بالبريد الإلكتروني، 16 نوفمبر 14:02"]);
        evidence.push(["الاتصال للتحقق", decisions[0]?.reason ?? "اتصل بالرقم المسجّل قبل الاعتماد"]);
        evidence.push(["القاعدة", "شخصان: المالية + الرئيس التنفيذي. المدفوعات إلى S3 موقوفة حتى يعتمد الاثنان."]);
      } else {
        evidence.push(["Supplier", "Port Said Welding Co. (S3) · approved supplier since 2019"]);
        evidence.push(["Request", "New beneficiary account received by email, 16 Nov 14:02"]);
        evidence.push(["Call-back", decisions[0]?.reason ?? "Call the number on file before approving"]);
        evidence.push(["Rule", "Two people: finance + CEO. Payments to S3 on hold until both approve."]);
      }
    } else {
      throw new TempMockError(
        "a bank-detail-change approval's evidence is fixed text about supplier S3: read the supplier, the request (when and how it came in) and the approval rule from the records",
      );
    }
  } else if (/alternative/i.test(type)) {
    if (IS_TEMP_MOCK) {
      if (ar) {
        evidence.push(["المطلوب", "أقطاب Lincoln Omnia 46، 3.2 مم (مواصفة العميل)"]);
        evidence.push(["المقترح", "ESAB OK 46.00، 3.2 مم — نفس فئة AWS E6013، مع شهادة المصنع"]);
        evidence.push(["العميل", "طلب الإصدار 2 مع بديل ESAB (بريد 12 نوفمبر)"]);
      } else {
        evidence.push(["Requested", "Lincoln Omnia 46 electrodes, 3.2 mm (customer's spec)"]);
        evidence.push(["Proposed", "ESAB OK 46.00, 3.2 mm — same AWS E6013 class, mill certificate attached"]);
        evidence.push(["Customer", "Asked for v2 with the ESAB alternative (email 12 Nov)"]);
      }
    } else {
      throw new TempMockError(
        "an alternative-product approval's evidence is fixed text (Lincoln Omnia 46 → ESAB OK 46.00): read the requested and proposed items and the customer's request from the case",
      );
    }
  }

  let payment: ApprovalView["payment"] = null;
  const po = await purchaseOrderOf(req, a);
  if (po) {
    const side = (po.supplierSide as Json | undefined) ?? {};
    const lineTotal = ((po.lines as { qty?: number; unitPrice?: number }[]) ?? []).reduce(
      (s, l) => s + num(l.qty) * num(l.unitPrice),
      0,
    );
    const poStatus = scalar(po.status);
    evidence.push([
      say("Purchase order", "أمر الشراء"),
      `${scalar(po.number)} · ${amount(po.currency, lineTotal)} · ${ar ? (PO_STATUS_AR[poStatus] ?? poStatus) : poStatus}`,
    ]);
    evidence.push([
      say("Pro forma", "الفاتورة المبدئية"),
      ar
        ? `${scalar(side.proforma) || "مرفقة"} · مقدّم ${num(side.depositPct, 50)}%`
        : `${scalar(side.proforma) || "attached"} · deposit ${num(side.depositPct, 50)}%`,
    ]);
    const payments = await all(req, "payments");
    const recorded = payments.some((p) => idOf(p.approval) === a.id);
    const paidOut = payments
      .filter((p) => p.direction === "out" && idOf(p.purchaseOrder) === po.id)
      .reduce((s, p) => s + num(p.amount), 0);
    const deposit = /deposit/i.test(type);
    const due =
      Math.round((deposit ? (num(po.total) * num(side.depositPct || 100)) / 100 : num(po.total) - paidOut) * 100) / 100;
    const supplier = await one(req, "suppliers", scalar(idOf(po.supplier)));
    payment = {
      po: scalar(po.id),
      purchaseOrder: scalar(po.number),
      supplier: scalar(supplier?.name),
      currency: scalar(po.currency),
      amount: due,
      amountText: amount(po.currency, due),
      kind: deposit ? "Deposit / advance" : "Balance",
      recorded,
      open: status !== "Rejected" && !(status === "Approved" && recorded),
      reference: outgoingBankReference(a),
    };
  }
  if (/deposit|payment/i.test(type)) {
    if (IS_TEMP_MOCK) {
      evidence.push(
        ar
          ? ["البيانات البنكية", "لم تتغير منذ 2025 — لا حاجة لاتصال تحقق"]
          : ["Bank details", "Unchanged since 2025 — no call-back needed"],
      );
    } else {
      throw new TempMockError(
        "a payment approval's \"Bank details\" evidence is fixed text (unchanged since 2025): read when the supplier's bank details last changed and whether they are verified",
      );
    }
  }
  if (a.detail && !(sales && quotationSubject(a)))
    evidence.push([say("Note from requester", "ملاحظة مقدّم الطلب"), scalar(a.detail)]);

  const deciders = approvers.map((x) => x.name).join(a.twoPerson ? " + " : or);
  return {
    canDecide,
    progress,
    whoDecides: ar
      ? `يقرّر: ${deciders}${note ? ` · ${note}` : ""}`
      : `${deciders} decide${approvers.length === 1 ? "s" : ""}${note ? ` · ${note}` : ""}`,
    why,
    afterYou,
    evidence: evidence.map(([label, value]) => `${label}: ${value}`).join("\n"),
    quotation: q ? scalar(q.id) : null,
    payment,
  };
}

const view =
  <K extends keyof ApprovalView>(key: K) =>
  async (a: Json, req: PayloadRequest) =>
    (await approvalView(a, req))[key];

const RECORDED = {
  en: "Recorded under your name with the time, on the request and the case timeline.",
  ar: "يُسجَّل باسمك مع الوقت، على الطلب وعلى سجل الملف.",
};
const decide = (decision: "Approve" | "Reject") => ({
  path: "/commercial/approvals/$row.id/decide",
  body: { decision },
});
const PEOPLE = words({ en: "Search people", ar: "ابحث عن الأشخاص" });

export const Approvals: CollectionConfig = {
  slug: "approvals",
  labels: {
    singular: { en: "Approval", ar: "طلب اعتماد" },
    plural: { en: "Approvals", ar: "طلبات الاعتماد" },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Open $row.case.caseId", ar: "فتح $row.case.caseId" }),
        href: link.doc("cases", "$row.case", "overview"),
        when: { case: { exists: true } },
      },
      {
        label: words({ en: "Preview quotation", ar: "معاينة عرض السعر" }),
        href: link.doc("quotations", "$row.quotation", "preview"),
        when: { quotation: { exists: true } },
      },
      {
        label: words({ en: "Pricing", ar: "التسعير" }),
        roles: COST_ROLES,
        href: link.doc("cases", "$row.case", "pricing"),
        when: { quotation: { exists: true }, case: { exists: true } },
      },
      {
        label: words({ en: "Exchange rates", ar: "أسعار الصرف" }),
        href: link.global("fx-rates"),
        when: { type: { equals: "Exchange rate" } },
      },
      {
        label: words({ en: "Supplier record", ar: "سجل المورّد" }),
        href: bankChangeSupplierHref(),
        when: { type: { equals: "Bank detail change" } },
      },
      {
        label: words({ en: "PO $row.payment.purchaseOrder", ar: "أمر الشراء $row.payment.purchaseOrder" }),
        href: link.doc("purchase-orders", "$row.payment.po"),
        when: { "payment.po": { exists: true } },
      },
      {
        label: words({ en: "Record payment", ar: "تسجيل الدفعة" }),
        roles: FINANCE_ROLES,
        when: { status: { equals: "Approved" }, "payment.recorded": { equals: false } },
        call: { path: "/cash/record-payment", body: { approval: "$row.id" } },
        confirm: {
          heading: words({
            en: "Record supplier payment — $row.payment.purchaseOrder",
            ar: "تسجيل دفعة المورّد — $row.payment.purchaseOrder",
          }),
          text: words({
            en: "$row.payment.amountText to $row.payment.supplier ($row.payment.kind) — approved. Pay it in the bank first, then record the bank reference here.",
            ar: "$row.payment.amountText إلى $row.payment.supplier ($row.payment.kind) — معتمدة. ادفعها في البنك أولًا، ثم سجّل مرجع البنك هنا.",
          }),
          label: words({ en: "Record payment", ar: "تسجيل الدفعة" }),
        },
        fields: [
          {
            type: "text",
            name: "reference",
            label: words({ en: "Bank reference", ar: "مرجع البنك" }),
            required: true,
            defaultValue: "$row.payment.reference",
          },
        ],
        done: words({
          en: "Payment $row.payment.amountText to $row.payment.supplier recorded against $row.payment.purchaseOrder.",
          ar: "سُجّلت دفعة $row.payment.amountText إلى $row.payment.supplier على أمر الشراء $row.payment.purchaseOrder.",
        }),
      },
      {
        label: words({ en: "Return", ar: "إعادة" }),
        tone: "error",
        when: { canDecide: { equals: true } },
        call: decide("Reject"),
        confirm: {
          heading: words({ en: "Return with a reason", ar: "إعادة مع ذكر السبب" }),
          text: words({ en: `$row.title\n${RECORDED.en}`, ar: `$row.title\n${RECORDED.ar}` }),
          label: words({ en: "Return", ar: "إعادة" }),
          tone: "error",
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: words({ en: "Reason (required)", ar: "السبب (مطلوب)" }),
            required: true,
            admin: {
              placeholder: words({
                en: "e.g. Margin too thin — ask the customer to accept v1 prices",
                ar: "مثال: الهامش ضئيل جدًا — اطلب من العميل قبول أسعار الإصدار 1",
              }),
            },
          },
        ],
        reply: true,
      },
      {
        label: words({ en: "Approve", ar: "اعتماد" }),
        main: true,
        when: { canDecide: { equals: true }, twoPerson: { not_equals: true } },
        call: decide("Approve"),
        reply: true,
      },
      {
        label: words({ en: "Approve", ar: "اعتماد" }),
        main: true,
        when: { canDecide: { equals: true }, twoPerson: { equals: true } },
        call: decide("Approve"),
        confirm: {
          heading: words({ en: "Approve request", ar: "اعتماد الطلب" }),
          text: words({ en: `$row.title$row.afterYou\n${RECORDED.en}`, ar: `$row.title$row.afterYou\n${RECORDED.ar}` }),
          label: words({ en: "Approve", ar: "اعتماد" }),
        },
        fields: [
          {
            type: "textarea",
            name: "reason",
            label: words({ en: "Note for the other approver (optional)", ar: "ملاحظة للمعتمد الآخر (اختياري)" }),
            admin: {
              placeholder: words({
                en: "e.g. Call-back done on the number on file",
                ar: "مثال: تم الاتصال على الرقم المسجّل",
              }),
            },
          },
        ],
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "status", "requestedBy", "createdAt"],
    group: { en: "Commercial", ar: "التجاري" },
  },
  defaultSort: "-createdAt",
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const ar = arabic(req);
        const decisions = (data.decisions as { user?: unknown; decision?: string; at?: string }[] | undefined) ?? [];
        const before = (originalDoc?.decisions as unknown[] | undefined)?.length ?? 0;
        const approvers = ((data.approvers as unknown[] | undefined) ?? []).map(idOf);
        decisions.slice(before).forEach((d) => {
          const uid = idOf(d.user) ?? idOf(req.user);
          if (!req.context?.seed && uid !== idOf(req.user))
            throw ruleError(ar ? "لا يمكنك تسجيل إلا قرارك أنت." : "You can only record your own decision.");
          if (approvers.length && !approvers.includes(uid))
            throw ruleError(ar ? "لست من معتمدي هذا الطلب." : "You are not an approver for this request.");
          d.user = uid;
          d.at ??= new Date().toISOString();
        });
        const users = decisions.map((d) => idOf(d.user));
        if (new Set(users).size !== users.length)
          throw ruleError(ar ? "يقرّر كل معتمد مرة واحدة." : "Each approver decides once.");
        const approved = decisions.filter((d) => d.decision === "Approve").length;
        const needed = data.twoPerson ? 2 : 1;
        data.status = decisions.some((d) => d.decision === "Reject")
          ? "Rejected"
          : approved >= needed
            ? "Approved"
            : approved > 0
              ? `Approved 1 of ${needed}`
              : "Pending";
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: {
              en: `Approval “${doc.title}”: ${doc.status}.`,
              ar: `طلب الاعتماد «${doc.title}»: ${APPROVAL_STATUS_AR[doc.status] ?? doc.status}.`,
            },
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: { en: "Title", ar: "العنوان" },
      admin: {
        description: {
          en: "A one-line summary the approver reads in the queue.",
          ar: "ملخص في سطر واحد يقرؤه المعتمد في قائمة الانتظار.",
        },
        placeholder: words({
          en: "e.g. Quote GS-Q-0142 v2 to Nordvik Ship Management",
          ar: "مثال: عرض السعر GS-Q-0142 v2 إلى Nordvik Ship Management",
        }),
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          access: { read: hiddenFromSales },
          label: { en: "Type", ar: "النوع" },
          admin: {
            description: { en: "What kind of decision is being asked for.", ar: "نوع القرار المطلوب." },
            placeholder: words({ en: "e.g. Quotation margin exception", ar: "مثال: استثناء هامش ربح عرض السعر" }),
          },
          custom: tones(Object.fromEntries(APPROVAL_TYPES.map((t) => [t, "primary" as const]))),
          options: labelled(APPROVAL_TYPES_AR),
        },
        caseRef(false, {
          hint: { en: "The customer case this belongs to.", ar: "ملف العميل الذي يتبعه هذا الطلب." },
          placeholder: CASE_PLACEHOLDER,
        }),
      ],
    },
    {
      name: "detail",
      type: "textarea",
      localized: true,
      access: { read: hiddenFromSales },
      label: { en: "Detail", ar: "التفاصيل" },
      admin: {
        description: { en: "Context the approver needs to decide.", ar: "السياق الذي يحتاجه المعتمد ليقرّر." },
        placeholder: words({
          en: "e.g. Customer wants the ESAB alternative and accepts the longer lead time.",
          ar: "مثال: العميل يريد بديل ESAB ويقبل مدة التوريد الأطول.",
        }),
      },
    },
    {
      name: "subject",
      type: "relationship",
      relationTo: ["quotations", "purchase-orders", "payments", "suppliers", "pricelists"],
      label: { en: "Record to approve", ar: "السجل المطلوب اعتماده" },
      admin: {
        description: {
          en: "The quotation, PO, payment, supplier or pricelist being decided.",
          ar: "عرض السعر أو أمر الشراء أو الدفعة أو المورّد أو قائمة الأسعار قيد القرار.",
        },
        placeholder: words({ en: "Search records", ar: "ابحث في السجلات" }),
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "requestedBy",
          type: "relationship",
          relationTo: "users",
          defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
          label: { en: "Requested By", ar: "مقدّم الطلب" },
          admin: {
            description: { en: "Who is asking for the approval.", ar: "من يطلب الاعتماد." },
            placeholder: PEOPLE,
          },
        },
        {
          name: "approvers",
          type: "relationship",
          relationTo: "users",
          hasMany: true,
          label: { en: "Approvers", ar: "المعتمدون" },
          admin: {
            description: {
              en: "People allowed to decide; empty means management.",
              ar: "الأشخاص المسموح لهم بالقرار؛ إن تُرك فارغًا فالإدارة.",
            },
            placeholder: PEOPLE,
          },
        },
        {
          name: "twoPerson",
          type: "checkbox",
          label: { en: "Two-person rule", ar: "قاعدة الشخصين" },
          defaultValue: false,
          admin: {
            description: {
              en: "Tick when two different approvers must both approve.",
              ar: "ضع علامة إذا وجب أن يعتمد معتمدان مختلفان.",
            },
          },
        },
      ],
    },
    {
      name: "decisions",
      type: "array",
      label: { en: "Decisions", ar: "القرارات" },
      labels: { singular: { en: "Decision", ar: "قرار" }, plural: { en: "Decisions", ar: "القرارات" } },
      admin: {
        description: {
          en: "Each approver's answer, recorded under their own name.",
          ar: "رد كل معتمد، مسجّلًا باسمه.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "user",
              type: "relationship",
              relationTo: "users",
              label: { en: "User", ar: "المستخدم" },
              admin: {
                description: { en: "The approver who decided.", ar: "المعتمد الذي قرّر." },
                placeholder: PEOPLE,
              },
            },
            {
              name: "decision",
              type: "select",
              options: labelled({ Approve: "اعتماد", Reject: "إعادة" }),
              required: true,
              label: { en: "Decision", ar: "القرار" },
              admin: {
                description: { en: "Approve it, or return it with a reason.", ar: "اعتمده، أو أعِده مع ذكر السبب." },
                placeholder: words({ en: "Pick a decision", ar: "اختر القرار" }),
              },
            },
            {
              name: "at",
              type: "date",
              label: { en: "At", ar: "الوقت" },
              admin: { description: { en: "When the decision was recorded.", ar: "وقت تسجيل القرار." } },
            },
          ],
        },
        {
          name: "reason",
          type: "textarea",
          localized: true,
          label: { en: "Reason", ar: "السبب" },
          admin: {
            description: {
              en: "Why it was returned, or a note for the other approver.",
              ar: "سبب الإعادة، أو ملاحظة للمعتمد الآخر.",
            },
            placeholder: words({
              en: "e.g. Margin too thin, ask for v1 prices.",
              ar: "مثال: الهامش ضئيل جدًا، اطلب أسعار الإصدار 1.",
            }),
          },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: labelled(APPROVAL_STATUS_AR),
      defaultValue: "Pending",
      label: { en: "Status", ar: "الحالة" },
      custom: tones({ Pending: "warning", "Approved 1 of 2": "info", Approved: "success", Rejected: "error" }),
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "Worked out from the decisions below.", ar: "تُستنتج من القرارات أدناه." },
      },
    },
    computed(
      {
        name: "canDecide",
        type: "checkbox",
        label: { en: "You can decide", ar: "يمكنك القرار" },
        admin: {
          position: "sidebar",
          description: {
            en: "Ticked when you are a listed approver who has not decided.",
            ar: "يُعلَّم حين تكون معتمدًا مدرجًا لم يقرّر بعد.",
          },
        },
      },
      view("canDecide"),
    ),
    computed(
      {
        name: "progress",
        type: "text",
        label: { en: "Progress", ar: "التقدّم" },
        admin: {
          position: "sidebar",
          description: { en: "Who has decided and who is still awaited.", ar: "من قرّر ومن لا يزال منتظرًا." },
        },
      },
      view("progress"),
    ),
    computed(
      {
        name: "whoDecides",
        type: "text",
        label: { en: "Who decides", ar: "من يقرّر" },
        admin: {
          position: "sidebar",
          description: { en: "The approvers for this kind of request.", ar: "معتمدو هذا النوع من الطلبات." },
        },
      },
      view("whoDecides"),
    ),
    computed(
      {
        name: "why",
        type: "text",
        label: { en: "Why you can't decide", ar: "لماذا لا يمكنك القرار" },
        admin: {
          position: "sidebar",
          description: {
            en: "The reason this request is not yours to decide.",
            ar: "سبب عدم اختصاصك بالقرار في هذا الطلب.",
          },
        },
      },
      view("why"),
    ),
    computed({ name: "afterYou", type: "text", admin: { hidden: true } }, view("afterYou")),
    computed(
      {
        name: "rule",
        type: "text",
        label: { en: "Rule", ar: "القاعدة" },
        admin: { hidden: true },
        custom: { toneWhen: [{ when: { twoPerson: { equals: true } }, tone: "warning" }] },
      },
      (a, req) => (a.twoPerson ? (arabic(req) ? "قاعدة الشخصين" : "Two-person rule") : ""),
    ),
    computed(
      {
        name: "evidence",
        type: "textarea",
        label: { en: "Evidence", ar: "الأدلة" },
        admin: {
          description: {
            en: "Figures from the quotation, rates, PO or supplier behind the request.",
            ar: "أرقام من عرض السعر أو أسعار الصرف أو أمر الشراء أو المورّد وراء الطلب.",
          },
        },
      },
      view("evidence"),
    ),
    computed(
      {
        name: "quotation",
        type: "relationship",
        relationTo: "quotations",
        label: { en: "Quotation", ar: "عرض السعر" },
        admin: {
          position: "sidebar",
          description: { en: "The quotation this request decides on.", ar: "عرض السعر الذي يقرّر فيه هذا الطلب." },
        },
      },
      view("quotation"),
    ),
    computed(
      {
        name: "payment",
        type: "group",
        label: { en: "Supplier payment", ar: "دفعة المورّد" },
        admin: {
          description: { en: "The supplier PO this request pays.", ar: "أمر شراء المورّد الذي يدفعه هذا الطلب." },
          condition: (data) => Boolean(data?.payment),
        },
        fields: [
          {
            type: "row",
            fields: [
              {
                name: "purchaseOrder",
                type: "text",
                label: { en: "PO", ar: "أمر الشراء" },
                admin: {
                  description: { en: "Supplier PO being paid.", ar: "أمر شراء المورّد قيد الدفع." },
                  placeholder: words({ en: "e.g. GS-PO-0087", ar: "مثال: GS-PO-0087" }),
                },
              },
              {
                name: "supplier",
                type: "text",
                label: { en: "Supplier", ar: "المورّد" },
                admin: {
                  description: { en: "Who gets the money.", ar: "من يتسلّم المبلغ." },
                  placeholder: words({ en: "e.g. Port Said Welding Co.", ar: "مثال: Port Said Welding Co." }),
                },
              },
              {
                name: "currency",
                type: "text",
                label: { en: "Currency", ar: "العملة" },
                admin: {
                  description: { en: "Currency of the payment.", ar: "عملة الدفعة." },
                  placeholder: words({ en: "e.g. USD", ar: "مثال: USD" }),
                },
              },
              {
                name: "amount",
                type: "number",
                label: { en: "Amount", ar: "المبلغ" },
                admin: {
                  description: { en: "How much is due now.", ar: "المبلغ المستحق الآن." },
                  placeholder: words({ en: "e.g. 5,000", ar: "مثال: 5,000" }),
                },
                custom: formats.money("currency"),
              },
            ],
          },
          {
            type: "row",
            fields: [
              {
                name: "kind",
                type: "text",
                label: { en: "Kind", ar: "النوع" },
                admin: {
                  description: { en: "Deposit or balance.", ar: "مقدّم أو رصيد." },
                  placeholder: words({ en: "e.g. Deposit / advance", ar: "مثال: مقدّم / دفعة مسبقة" }),
                },
              },
              {
                name: "recorded",
                type: "checkbox",
                label: { en: "Payment recorded", ar: "سُجّلت الدفعة" },
                admin: {
                  description: {
                    en: "Ticked once finance has booked the bank payment.",
                    ar: "يُعلَّم بعد أن تسجّل المالية الدفعة البنكية.",
                  },
                },
              },
              {
                name: "open",
                type: "checkbox",
                label: { en: "Still to pay", ar: "لم تُدفع بعد" },
                admin: {
                  description: {
                    en: "Ticked while the payment is still outstanding.",
                    ar: "يُعلَّم ما دامت الدفعة مستحقة.",
                  },
                },
              },
            ],
          },
          { name: "po", type: "text", admin: { hidden: true } },
          { name: "amountText", type: "text", admin: { hidden: true } },
          { name: "reference", type: "text", label: { en: "Reference", ar: "المرجع" }, admin: { hidden: true } },
        ],
      },
      view("payment"),
    ),
  ],
};

export const CustomerPOs: CollectionConfig = {
  slug: "customer-pos",
  labels: {
    singular: { en: "Customer PO", ar: "أمر شراء العميل" },
    plural: { en: "Customer POs", ar: "أوامر شراء العملاء" },
  },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "quotation", "status", "receivedAt"],
    group: { en: "Commercial", ar: "التجاري" },
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        const checks = (data.checks as { matches?: boolean; resolution?: string }[] | undefined) ?? [];
        const open = checks.filter((c) => !c.matches && !c.resolution).length;
        if (data.status !== "Cancelled") data.status = open ? "Blocked — mismatch" : "Validated";
        data.openMismatches = open;
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "number",
          type: "text",
          required: true,
          unique: true,
          label: { en: "Number", ar: "الرقم" },
          admin: {
            description: { en: "The customer's own PO number.", ar: "رقم أمر الشراء لدى العميل." },
            placeholder: words({ en: "e.g. NVK-PO-77412", ar: "مثال: NVK-PO-77412" }),
          },
        },
        caseRef(true, {
          hint: { en: "The customer case this belongs to.", ar: "ملف العميل الذي يتبعه أمر الشراء." },
          placeholder: CASE_PLACEHOLDER,
        }),
        {
          name: "quotation",
          type: "relationship",
          relationTo: "quotations",
          required: true,
          label: { en: "Quotation", ar: "عرض السعر" },
          admin: {
            description: {
              en: "The approved version this PO orders against.",
              ar: "الإصدار المعتمد الذي يطلب بموجبه أمر الشراء.",
            },
            placeholder: words({ en: "e.g. GS-Q-0142 v2", ar: "مثال: GS-Q-0142 v2" }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "receivedAt",
          type: "date",
          label: { en: "Received At", ar: "تاريخ الاستلام" },
          admin: { description: { en: "The day the PO reached us.", ar: "اليوم الذي وصلنا فيه أمر الشراء." } },
        },
        {
          name: "billingEntity",
          type: "text",
          label: { en: "Billing Entity", ar: "جهة الفوترة" },
          admin: {
            description: {
              en: "The company we invoice, as named on the PO.",
              ar: "الشركة التي نصدر لها الفاتورة، كما وردت في أمر الشراء.",
            },
            placeholder: words({ en: "e.g. Nordvik Ship Management Ltd", ar: "مثال: Nordvik Ship Management Ltd" }),
          },
        },
        {
          name: "file",
          type: "upload",
          relationTo: "media",
          label: { en: "File", ar: "الملف" },
          admin: {
            description: { en: "The PO as received, PDF or scan.", ar: "أمر الشراء كما وصل، PDF أو صورة ممسوحة." },
          },
        },
      ],
    },
    {
      name: "checks",
      type: "array",
      label: { en: "Checks", ar: "المراجعات" },
      labels: {
        singular: { en: "Check", ar: "مراجعة" },
        plural: { en: "PO vs quotation", ar: "أمر الشراء مقابل عرض السعر" },
      },
      admin: {
        description: {
          en: "Each PO line compared with the approved quotation.",
          ar: "كل بند في أمر الشراء مقارنًا بعرض السعر المعتمد.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              min: 0,
              label: { en: "Line No", ar: "رقم البند" },
              admin: {
                description: { en: "Line number; 0 for the PO header.", ar: "رقم البند؛ 0 لرأس أمر الشراء." },
                placeholder: words({ en: "e.g. 3", ar: "مثال: 3" }),
              },
            },
            {
              name: "field",
              type: "select",
              required: true,
              label: { en: "Field", ar: "الحقل" },
              admin: {
                description: { en: "What is being compared.", ar: "ما تجري مقارنته." },
                placeholder: words({ en: "e.g. Price", ar: "مثال: السعر" }),
              },
              options: labelled({
                Price: "السعر",
                Quantity: "الكمية",
                "Pack size": "حجم العبوة",
                Specification: "المواصفات",
                Currency: "العملة",
                Taxes: "الضرائب",
                "Delivery terms": "شروط التسليم",
                "Billing entity": "جهة الفوترة",
                "Payment terms": "شروط الدفع",
                "Quote validity": "صلاحية العرض",
              }),
            },
            {
              name: "matches",
              type: "checkbox",
              defaultValue: false,
              label: { en: "Matches", ar: "مطابق" },
              admin: {
                description: {
                  en: "Tick when the PO equals the quotation.",
                  ar: "ضع علامة إذا طابق أمر الشراء عرض السعر.",
                },
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "po",
              type: "text",
              label: { en: "On the PO", ar: "في أمر الشراء" },
              admin: {
                description: { en: "The value the customer wrote.", ar: "القيمة التي كتبها العميل." },
                placeholder: words({ en: "e.g. USD 18.50", ar: "مثال: USD 18.50" }),
              },
            },
            {
              name: "quote",
              type: "text",
              label: { en: "On the quotation", ar: "في عرض السعر" },
              admin: {
                description: { en: "The value we quoted.", ar: "القيمة التي عرضناها." },
                placeholder: words({ en: "e.g. USD 18.50", ar: "مثال: USD 18.50" }),
              },
            },
          ],
        },
        {
          name: "resolution",
          type: "text",
          localized: true,
          label: { en: "Resolution", ar: "التسوية" },
          admin: {
            description: {
              en: "Written customer agreement or approved exception.",
              ar: "موافقة مكتوبة من العميل أو استثناء معتمد.",
            },
            placeholder: words({
              en: "e.g. Customer accepted 18.50 by email, 12 Nov",
              ar: "مثال: وافق العميل على 18.50 بالبريد الإلكتروني، 12 نوفمبر",
            }),
          },
          custom: {
            about: {
              en: "A mismatch without a resolution blocks the PO from validating, so the order cannot go ahead.",
              ar: "أي اختلاف بلا تسوية يمنع اعتماد أمر الشراء، فلا يمكن المضي في الطلب.",
            },
          },
        },
        evidence(
          "evidence",
          { en: "Customer's written confirmation", ar: "التأكيد المكتوب من العميل" },
          {
            hint: {
              en: "The email or letter where the customer accepts the difference.",
              ar: "البريد الإلكتروني أو الخطاب الذي يقبل فيه العميل الاختلاف.",
            },
          },
        ),
      ],
    },
    {
      name: "unawarded",
      type: "array",
      label: { en: "Unawarded", ar: "البنود غير المُرسّاة" },
      labels: {
        singular: { en: "Unawarded line", ar: "بند غير مُرسّى" },
        plural: { en: "Unawarded lines", ar: "البنود غير المُرسّاة" },
      },
      admin: {
        description: {
          en: "Quotation lines the customer did not order on this PO.",
          ar: "بنود عرض السعر التي لم يطلبها العميل في أمر الشراء هذا.",
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
              required: true,
              label: { en: "Line No", ar: "رقم البند" },
              admin: {
                description: { en: "The quotation line left out.", ar: "بند عرض السعر المستبعد." },
                placeholder: words({ en: "e.g. 4", ar: "مثال: 4" }),
              },
            },
            {
              name: "outcome",
              type: "select",
              options: labelled({ "Open — revision to follow": "مفتوح — يتبعه عرض معدَّل", Closed: "مغلق" }),
              required: true,
              label: { en: "Outcome", ar: "النتيجة" },
              admin: {
                description: {
                  en: "Whether we expect a revised quotation for it.",
                  ar: "هل نتوقع عرض سعر معدَّلًا له.",
                },
                placeholder: words({ en: "Pick an outcome", ar: "اختر النتيجة" }),
              },
            },
            {
              name: "reason",
              type: "text",
              localized: true,
              label: { en: "Reason", ar: "السبب" },
              admin: {
                description: { en: "Why the customer left it out.", ar: "سبب استبعاد العميل له." },
                placeholder: words({ en: "e.g. Bought locally by the vessel", ar: "مثال: اشترته السفينة محليًا" }),
              },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "text",
      label: { en: "Status", ar: "الحالة" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "Validated, or blocked while a mismatch is unresolved.",
          ar: "معتمد، أو موقوف ما دام هناك اختلاف بلا تسوية.",
        },
      },
    },
    {
      name: "openMismatches",
      type: "number",
      label: { en: "Open Mismatches", ar: "الاختلافات المفتوحة" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "Checks that differ and have no resolution yet.",
          ar: "مراجعات بها اختلاف ولم تُسوَّ بعد.",
        },
      },
    },
  ],
};
