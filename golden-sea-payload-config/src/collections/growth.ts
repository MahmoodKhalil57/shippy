import type { CollectionConfig } from "payload";
import { DAY, TODAY, choices, computed, deskAccess, inLanguage, management, related, scalar, words } from "./shared.ts";
import { tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";

export const GROWTH_STAGES = [
  "Prospect",
  "Introduced",
  "Registration submitted",
  "Approved vendor",
  "First RFQ",
  "Active account",
  "Closed",
];

const GROWTH_STAGE_OPTIONS = choices(GROWTH_STAGES, {
  Prospect: "عميل محتمل",
  Introduced: "تم التعارف",
  "Registration submitted": "قُدّم التسجيل",
  "Approved vendor": "مورّد معتمد",
  "First RFQ": "أول طلب عرض",
  "Active account": "حساب نشط",
  Closed: "مغلق",
});

export const SALES_CHANNELS = ["Call", "Email", "WhatsApp", "Site visit", "Meeting"];
const SALES_CHANNEL_OPTIONS = choices(SALES_CHANNELS, {
  Call: "مكالمة",
  Email: "البريد الإلكتروني",
  WhatsApp: "WhatsApp",
  "Site visit": "زيارة موقع",
  Meeting: "اجتماع",
});
export const SALES_RESULTS = ["Reached — positive", "Reached — call back", "No answer", "Not interested", "Sent"];
const SALES_RESULT_AR: Record<string, string> = {
  "Reached — positive": "تم الوصول — إيجابي",
  "Reached — call back": "تم الوصول — معاودة الاتصال",
  "No answer": "لا رد",
  "Not interested": "غير مهتم",
  Sent: "مُرسل",
};
const SALES_RESULT_OPTIONS = choices(SALES_RESULTS, SALES_RESULT_AR);

const day = (v: unknown, req?: { locale?: unknown }) =>
  typeof v === "string" && v
    ? new Date(v).toLocaleDateString(req?.locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      })
    : "";
const TODAY_START = TODAY.toISOString().slice(0, 10);
const IN_A_WEEK = new Date(TODAY.getTime() + 7 * DAY).toISOString().slice(0, 10);

const outcome = (label: { en: string; ar: string }, planning: boolean): CollectionAction => ({
  label: words(label),
  when: { noNextStep: planning ? { equals: true } : { not_equals: true } },
  call: { path: "/growth/$row.id/outcome", body: { company: "$row.name" } },
  prompt: words({ en: `${label.en} — $row.name`, ar: `${label.ar} — $row.name` }),
  fields: [
    {
      type: "select",
      name: "result",
      label: words({ en: "Outcome", ar: "النتيجة" }),
      required: true,
      options: SALES_RESULT_OPTIONS.map((o) => ({ ...o, label: words(o.label) })),
      defaultValue: planning ? "Sent" : "Reached — positive",
      admin: planning
        ? undefined
        : {
            description: words({
              en: "Step: $row.nextStep ($row.channel, $row.contact)",
              ar: "الخطوة: $row.nextStep ($row.channel، $row.contact)",
            }),
          },
    },
    {
      type: "textarea",
      name: "note",
      label: words({ en: "What happened", ar: "ما حدث" }),
      admin: {
        placeholder: words({
          en: "Who said what — e.g. Registration committee meets 24 Nov; documents complete.",
          ar: "من قال ماذا — مثال: تجتمع لجنة التسجيل 24 نوفمبر؛ المستندات مكتملة.",
        }),
      },
    },
    {
      type: "text",
      name: "nextStep",
      label: words({ en: "Next step", ar: "الخطوة التالية" }),
      admin: {
        placeholder: words({ en: "e.g. Call after the committee decision", ar: "مثال: الاتصال بعد قرار اللجنة" }),
        description: words({
          en: "Saved on the opportunity; the next step goes on the owner's follow-ups.",
          ar: "يُحفظ على فرصة البيع؛ وتُضاف الخطوة التالية إلى متابعات المالك.",
        }),
      },
    },
    {
      type: "date",
      name: "nextStepDue",
      label: words({ en: "Next step date", ar: "تاريخ الخطوة التالية" }),
      defaultValue: IN_A_WEEK,
      admin: { width: "50%" },
    },
    {
      type: "select",
      name: "stage",
      label: words({ en: "Stage", ar: "المرحلة" }),
      options: GROWTH_STAGE_OPTIONS.map((o) => ({ ...o, label: words(o.label) })),
      defaultValue: "$row.stage",
      admin: { width: "50%" },
    },
  ],
  reply: true,
});

export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  labels: { singular: { en: "Opportunity", ar: "فرصة بيع" }, plural: { en: "Opportunities", ar: "فرص البيع" } },
  custom: {
    list: { board: "stage" },
    actions: [
      outcome({ en: "Record outcome", ar: "تسجيل النتيجة" }, false),
      outcome({ en: "Plan next step", ar: "تخطيط الخطوة التالية" }, true),
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "stage", "owner", "nextStepDue", "estimatedValue"],
    group: { en: "Growth", ar: "النمو" },
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.noNextStep = !data.nextStep && data.stage !== "Closed" && data.stage !== "Active account";
        return data;
      },
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
          required: true,
          admin: {
            description: { en: "The prospect company's name.", ar: "اسم الشركة المحتملة." },
            placeholder: { en: "e.g. Nordvik Ship Management", ar: "مثال: Nordvik Ship Management" },
          },
        },
        {
          name: "kind",
          type: "text",
          label: { en: "Kind", ar: "النوع" },
          localized: true,
          admin: {
            description: { en: "One line on what they are and how big.", ar: "سطر واحد عن طبيعتها وحجمها." },
            placeholder: { en: "Ship manager · 14 reefers", ar: "مدير سفن · 14 سفينة مبرّدة" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "segment",
          type: "select",
          label: { en: "Segment", ar: "الشريحة" },
          options: [
            { value: "Marine", label: { en: "Marine", ar: "بحري" } },
            { value: "Offshore", label: { en: "Offshore", ar: "أوفشور" } },
            { value: "Oil & gas", label: { en: "Oil & gas", ar: "النفط والغاز" } },
            { value: "Industrial", label: { en: "Industrial", ar: "صناعي" } },
            { value: "Shipbuilding & repair", label: { en: "Shipbuilding & repair", ar: "بناء وإصلاح السفن" } },
          ],
          admin: {
            description: { en: "The market they belong to.", ar: "السوق الذي تنتمي إليه." },
            placeholder: words({ en: "Pick a segment", ar: "اختر قطاعًا" }),
          },
        },
        {
          name: "source",
          type: "text",
          label: { en: "Source", ar: "المصدر" },
          admin: {
            description: { en: "How we found them.", ar: "كيف وجدناهم." },
            placeholder: { en: "e.g. Referral from a Port Said agent", ar: "مثال: ترشيح من وكيل في بورسعيد" },
          },
        },
        {
          name: "estimatedValue",
          type: "text",
          label: { en: "Estimated Value", ar: "القيمة التقديرية" },
          admin: {
            description: { en: "What we expect them to buy in a year.", ar: "ما نتوقع أن يشتروه في السنة." },
            placeholder: { en: "USD 60k / yr", ar: "USD 60 ألف / سنة" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "nextStep",
          type: "text",
          label: { en: "Next Step", ar: "الخطوة التالية" },
          localized: true,
          admin: {
            description: {
              en: "The one thing to do next to move them forward.",
              ar: "الخطوة الوحيدة التالية لدفعهم إلى الأمام.",
            },
            placeholder: { en: "e.g. Call after the committee decision", ar: "مثال: الاتصال بعد قرار اللجنة" },
          },
        },
        {
          name: "nextStepDue",
          type: "date",
          label: { en: "Next Step Due", ar: "موعد الخطوة التالية" },
          admin: {
            description: {
              en: "The day the next step should happen by.",
              ar: "اليوم الذي يجب أن تتم فيه الخطوة التالية.",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "contact",
          type: "text",
          label: { en: "Who", ar: "من" },
          admin: {
            description: { en: "The person or role to reach.", ar: "الشخص أو الدور المطلوب الوصول إليه." },
            placeholder: { en: "Procurement lead", ar: "مسؤول المشتريات" },
          },
        },
        {
          name: "channel",
          type: "select",
          label: { en: "Channel", ar: "القناة" },
          options: SALES_CHANNEL_OPTIONS,
          custom: tones(Object.fromEntries(SALES_CHANNELS.map((c) => [c, "info" as const]))),
          admin: {
            description: { en: "How the next step will be done.", ar: "كيف ستُنفَّذ الخطوة التالية." },
            placeholder: words({ en: "Pick a channel", ar: "اختر قناة" }),
          },
        },
      ],
    },
    {
      name: "script",
      type: "textarea",
      localized: true,
      label: { en: "What to say", ar: "ماذا نقول" },
      admin: {
        description: { en: "Talking points for the next step.", ar: "نقاط الحديث للخطوة التالية." },
        placeholder: {
          en: "e.g. Introduce our Port Said stores and ask about their vendor list.",
          ar: "مثال: نعرّف بمستلزماتنا في بورسعيد ونسأل عن قائمة مورّديهم.",
        },
      },
    },
    {
      name: "fleetSize",
      type: "number",
      label: { en: "Fleet Size", ar: "حجم الأسطول" },
      min: 0,
      admin: {
        description: { en: "How many vessels they run in total.", ar: "إجمالي عدد السفن التي يشغّلونها." },
        placeholder: { en: "e.g. 14", ar: "مثال: 14" },
      },
    },
    {
      name: "fleet",
      type: "array",
      label: { en: "Fleet", ar: "الأسطول" },
      labels: {
        singular: { en: "Vessel", ar: "السفينة" },
        plural: { en: "Fleet (known vessels)", ar: "الأسطول (السفن المعروفة)" },
      },
      admin: {
        description: {
          en: "The prospect's vessels, before they become vessel records.",
          ar: "سفن العميل المحتمل، قبل أن تصبح سجلات سفن.",
        },
      },
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
                description: { en: "The vessel's name.", ar: "اسم السفينة." },
                placeholder: { en: "e.g. MV Nordic Star", ar: "مثال: MV Nordic Star" },
              },
            },
            {
              name: "imo",
              type: "text",
              label: { en: "IMO", ar: "IMO" },
              admin: {
                description: {
                  en: "The 7-digit IMO number, if known.",
                  ar: "رقم IMO المكوّن من 7 أرقام، إن كان معروفًا.",
                },
                placeholder: { en: "e.g. 9811204", ar: "مثال: 9811204" },
              },
              validate: (value: unknown) =>
                value == null ||
                value === "" ||
                (typeof value === "string" && /^\d{7}$/.test(value)) ||
                "IMO numbers have 7 digits.",
            },
            {
              name: "vesselType",
              type: "text",
              label: { en: "Type", ar: "النوع" },
              admin: {
                description: { en: "What kind of vessel she is.", ar: "نوع السفينة." },
                placeholder: { en: "e.g. Reefer", ar: "مثال: سفينة مبرّدة" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      label: { en: "Outcomes", ar: "النتائج" },
      labels: { singular: { en: "Outcome", ar: "النتيجة" }, plural: { en: "Outcomes", ar: "النتائج" } },
      admin: {
        description: {
          en: "What happened after each call, visit or email, newest last.",
          ar: "ما حدث بعد كل مكالمة أو زيارة أو بريد، والأحدث في الأخير.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "at",
              type: "date",
              label: { en: "At", ar: "الوقت" },
              admin: { description: { en: "When it happened.", ar: "متى حدث ذلك." } },
            },
            {
              name: "result",
              type: "select",
              label: { en: "Result", ar: "النتيجة" },
              options: SALES_RESULT_OPTIONS,
              admin: {
                description: { en: "How the contact went.", ar: "كيف سار التواصل." },
                placeholder: words({ en: "Pick an outcome", ar: "اختر نتيجة" }),
              },
            },
            {
              name: "by",
              type: "relationship",
              label: { en: "By", ar: "بواسطة" },
              relationTo: "users",
              admin: {
                description: { en: "Who made the contact.", ar: "من قام بالتواصل." },
                placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
              },
            },
          ],
        },
        {
          name: "note",
          type: "textarea",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          admin: {
            description: { en: "What was said and agreed.", ar: "ما قيل وما اتُّفق عليه." },
            placeholder: {
              en: "e.g. Committee meets 24 Nov; documents complete.",
              ar: "مثال: تجتمع اللجنة 24 نوفمبر؛ المستندات مكتملة.",
            },
          },
        },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      label: { en: "Customer", ar: "العميل" },
      relationTo: "customers",
      admin: {
        description: { en: "Set when the prospect becomes a customer.", ar: "يُضبط عندما يصبح العميل المحتمل عميلًا." },
        placeholder: words({ en: "Search customers", ar: "ابحث في العملاء" }),
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: { en: "Notes", ar: "ملاحظات" },
      localized: true,
      admin: {
        description: {
          en: "Background that does not fit elsewhere.",
          ar: "معلومات خلفية لا مكان لها في غير هذا الحقل.",
        },
        placeholder: {
          en: "e.g. Fleet manager prefers WhatsApp after 4 pm.",
          ar: "مثال: مدير الأسطول يفضّل واتساب بعد الرابعة عصرًا.",
        },
      },
    },
    {
      name: "stage",
      type: "select",
      label: { en: "Stage", ar: "المرحلة" },
      required: true,
      defaultValue: "Prospect",
      options: GROWTH_STAGE_OPTIONS,
      admin: {
        position: "sidebar",
        description: {
          en: "How far along they are, from prospect to active account.",
          ar: "مدى تقدّمهم، من عميل محتمل إلى حساب نشط.",
        },
        placeholder: words({ en: "Pick a stage", ar: "اختر مرحلة" }),
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
        description: { en: "The salesperson who owns this lead.", ar: "مندوب المبيعات المسؤول عن هذا العميل المحتمل." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
    {
      name: "noNextStep",
      type: "checkbox",
      label: { en: "No Next Step", ar: "لا خطوة تالية" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "Set when no next step is planned.", ar: "يُضبط عندما لا توجد خطوة تالية مخططة." },
      },
    },
    computed(
      {
        name: "step",
        type: "text",
        label: { en: "Next step status", ar: "حالة الخطوة التالية" },
        custom: {
          toneWhen: [
            { when: { noNextStep: { equals: true } }, tone: "error" },
            { when: { nextStepDue: { less_than: TODAY_START } }, tone: "error" },
          ],
        },
        admin: {
          position: "sidebar",
          description: {
            en: "Whether the next step is planned, due or overdue.",
            ar: "هل الخطوة التالية مخططة أم مستحقة أم متأخرة.",
          },
        },
      },
      (o, req) => {
        if (o.noNextStep === true)
          return inLanguage(req, { en: "No next step — plan one or close", ar: "لا خطوة تالية — خطّط لواحدة أو أغلق" });
        if (typeof o.nextStepDue !== "string" || !o.nextStepDue)
          return o.nextStep ? inLanguage(req, { en: "Planned", ar: "مخططة" }) : null;
        const due = day(o.nextStepDue, req);
        return o.nextStepDue < TODAY_START ? inLanguage(req, { en: `Overdue · ${due}`, ar: `متأخرة · ${due}` }) : due;
      },
    ),
    computed(
      {
        name: "brief",
        type: "text",
        label: { en: "Next step", ar: "الخطوة التالية" },
        admin: {
          condition: () => false,
          description: { en: "The next step, or a nudge to plan one.", ar: "الخطوة التالية، أو تنبيه لتخطيط واحدة." },
        },
      },
      (o, req) =>
        scalar(o.nextStep) ||
        inLanguage(req, {
          en: "Plan the next step, or close the opportunity.",
          ar: "خطّط للخطوة التالية، أو أغلق فرصة البيع.",
        }),
    ),
    computed(
      {
        name: "lastOutcome",
        type: "text",
        label: { en: "Last outcome", ar: "آخر نتيجة" },
        admin: {
          condition: () => false,
          description: { en: "The most recent contact, in one line.", ar: "آخر تواصل، في سطر واحد." },
        },
      },
      async (o, req) => {
        const last = (o.outcomes as { at?: string; result?: string; note?: string; by?: unknown }[] | undefined)?.at(
          -1,
        );
        if (!last) return null;
        const by = scalar((await related(req, "users", last.by))?.name);
        const result = scalar(last.result);
        const note = last.note ? ` — ${last.note}` : "";
        const when = [by, day(last.at, req)].filter(Boolean);
        return inLanguage(req, {
          en: `Last: ${result}${note} (${when.join(", ")})`,
          ar: `آخر نتيجة: ${SALES_RESULT_AR[result] ?? result}${note} (${when.join("، ")})`,
        });
      },
    ),
  ],
};

export const VendorRegistrations: CollectionConfig = {
  slug: "vendor-registrations",
  labels: {
    singular: { en: "Vendor registration", ar: "تسجيل مورّد" },
    plural: { en: "Vendor registrations", ar: "تسجيلات الموردين" },
  },
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "portal", "status", "submittedAt", "renewBy"],
    group: { en: "Growth", ar: "النمو" },
  },
  access: deskAccess,
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "company",
          type: "text",
          label: { en: "Company", ar: "الشركة" },
          required: true,
          admin: {
            description: { en: "The ship manager or owner we apply to.", ar: "مدير السفن أو المالك الذي نتقدّم إليه." },
            placeholder: { en: "e.g. Nordvik Ship Management", ar: "مثال: Nordvik Ship Management" },
          },
        },
        {
          name: "customer",
          type: "relationship",
          label: { en: "Customer", ar: "العميل" },
          relationTo: "customers",
          admin: {
            description: { en: "Their customer record, once they have one.", ar: "سجل العميل الخاص بهم، متى وُجد." },
            placeholder: words({ en: "Search customers", ar: "ابحث في العملاء" }),
          },
        },
        {
          name: "opportunity",
          type: "relationship",
          label: { en: "Opportunity", ar: "الفرصة" },
          relationTo: "opportunities",
          admin: {
            description: { en: "The sales lead this application belongs to.", ar: "فرصة البيع التي يتبعها هذا الطلب." },
            placeholder: words({ en: "Search opportunities", ar: "ابحث في فرص البيع" }),
          },
        },
      ],
    },
    {
      name: "portal",
      type: "text",
      label: { en: "Portal / method", ar: "البوابة / الطريقة" },
      admin: {
        description: { en: "Where or how we submit the application.", ar: "أين أو كيف نقدّم الطلب." },
        placeholder: { en: "e.g. Nordvik supplier portal", ar: "مثال: بوابة موردي Nordvik" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "submittedAt",
          type: "date",
          label: { en: "Submitted At", ar: "تاريخ التقديم" },
          admin: { description: { en: "The day we sent the application in.", ar: "اليوم الذي أرسلنا فيه الطلب." } },
        },
        {
          name: "committeeDate",
          type: "date",
          label: { en: "Committee decides", ar: "موعد قرار اللجنة" },
          admin: {
            description: {
              en: "When their vendor committee meets to decide.",
              ar: "موعد اجتماع لجنة الموردين لديهم للبت.",
            },
          },
        },
        {
          name: "renewBy",
          type: "date",
          label: { en: "Renew By", ar: "التجديد قبل" },
          admin: { description: { en: "When the approval must be renewed.", ar: "موعد تجديد الاعتماد." } },
        },
      ],
    },
    {
      name: "contact",
      type: "text",
      label: { en: "Their contact", ar: "جهة الاتصال لديهم" },
      admin: {
        description: { en: "Who handles vendor approval on their side.", ar: "من يتولى اعتماد الموردين من جهتهم." },
        placeholder: { en: "e.g. Sara Lindqvist, Procurement", ar: "مثال: Sara Lindqvist، المشتريات" },
      },
    },
    {
      name: "documents",
      type: "array",
      label: { en: "Documents", ar: "المستندات" },
      admin: {
        description: {
          en: "The papers they ask for, and where each one stands.",
          ar: "المستندات التي يطلبونها وموقف كل منها.",
        },
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
                description: { en: "The document they ask for.", ar: "المستند الذي يطلبونه." },
                placeholder: { en: "e.g. ISO 9001 certificate", ar: "مثال: شهادة ISO 9001" },
              },
            },
            {
              name: "status",
              type: "select",
              label: { en: "Status", ar: "الحالة" },
              options: [
                { value: "Missing", label: { en: "Missing", ar: "ناقص" } },
                { value: "Ready", label: { en: "Ready", ar: "جاهز" } },
                { value: "Submitted", label: { en: "Submitted", ar: "مقدَّم" } },
                { value: "Expired", label: { en: "Expired", ar: "منتهي" } },
              ],
              defaultValue: "Missing",
              admin: {
                description: { en: "Where this document stands.", ar: "موقف هذا المستند." },
                placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
              },
            },
            {
              name: "file",
              type: "upload",
              label: { en: "File", ar: "الملف المرفق" },
              relationTo: "media",
              admin: {
                description: { en: "The scan or PDF we submit.", ar: "النسخة الممسوحة أو ملف PDF الذي نقدّمه." },
              },
            },
          ],
        },
      ],
    },
    {
      name: "nextStep",
      type: "text",
      label: { en: "Next Step", ar: "الخطوة التالية" },
      localized: true,
      admin: {
        description: { en: "What we do next on this application.", ar: "ما نفعله بعد ذلك في هذا الطلب." },
        placeholder: { en: "e.g. Send the renewed ISO certificate", ar: "مثال: إرسال شهادة ISO المجدّدة" },
      },
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      required: true,
      defaultValue: "Documents requested",
      options: [
        { value: "Documents requested", label: { en: "Documents requested", ar: "طُلبت المستندات" } },
        { value: "Submitted", label: { en: "Submitted", ar: "مقدَّم" } },
        { value: "Under review", label: { en: "Under review", ar: "قيد المراجعة" } },
        { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
        { value: "Rejected", label: { en: "Rejected", ar: "مرفوض" } },
        { value: "Renewal overdue", label: { en: "Renewal overdue", ar: "التجديد متأخر" } },
      ],
      custom: tones({
        "Documents requested": "warning",
        Submitted: "info",
        "Under review": "info",
        Approved: "success",
        Rejected: "error",
        "Renewal overdue": "error",
      }),
      admin: {
        position: "sidebar",
        description: { en: "Where the application stands with the buyer.", ar: "موقف الطلب لدى المشتري." },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    computed(
      {
        name: "dates",
        type: "text",
        label: { en: "Dates", ar: "التواريخ" },
        admin: {
          condition: () => false,
          description: {
            en: "Submission, committee and renewal dates in one line.",
            ar: "تواريخ التقديم واللجنة والتجديد في سطر واحد.",
          },
        },
      },
      (r, req) =>
        [
          r.submittedAt &&
            inLanguage(req, { en: `Submitted ${day(r.submittedAt)}`, ar: `قُدّم ${day(r.submittedAt, req)}` }),
          r.committeeDate &&
            inLanguage(req, { en: `Committee ${day(r.committeeDate)}`, ar: `اللجنة ${day(r.committeeDate, req)}` }),
          r.renewBy && inLanguage(req, { en: `Renew by ${day(r.renewBy)}`, ar: `التجديد قبل ${day(r.renewBy, req)}` }),
        ]
          .filter(Boolean)
          .join(" · ") || null,
    ),
    computed(
      {
        name: "paperwork",
        type: "text",
        label: { en: "Documents", ar: "المستندات" },
        admin: {
          condition: () => false,
          description: {
            en: "The documents, with the missing or expired ones flagged.",
            ar: "المستندات، مع تمييز الناقص أو المنتهي منها.",
          },
        },
      },
      (r, req) =>
        ((r.documents as { name?: string; status?: string }[] | undefined) ?? [])
          .map((d) => {
            const status = scalar(d.status) || "Missing";
            const flag = inLanguage(req, { en: status.toLowerCase(), ar: status === "Missing" ? "ناقص" : "منتهي" });
            return status === "Missing" || status === "Expired" ? `${scalar(d.name)} — ${flag}` : scalar(d.name);
          })
          .join(" · ") || null,
    ),
  ],
};

export const Campaigns: CollectionConfig = {
  slug: "campaigns",
  labels: { singular: { en: "Campaign", ar: "حملة" }, plural: { en: "Campaigns", ar: "الحملات" } },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "audience", "contentStatus", "status", "scheduledAt"],
    group: { en: "Growth", ar: "النمو" },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: management,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const sending = ["Scheduled", "Sent"].includes(String(data.status)) && data.status !== originalDoc?.status;
        if (sending && req.user?.role !== "management" && !req.context?.seed)
          throw Object.assign(new Error("Only management can schedule or send campaigns."), {
            status: 403,
            name: "Forbidden",
          });
        if (sending && data.contentStatus !== "Approved")
          throw Object.assign(new Error("Content must be approved before sending."), { status: 400, name: "APIError" });
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Name", ar: "الاسم" },
      localized: true,
      required: true,
      admin: {
        description: { en: "An internal name to find the campaign by.", ar: "اسم داخلي للعثور على الحملة." },
        placeholder: { en: "e.g. Winter bond stores offer", ar: "مثال: عرض مستلزمات الإيداع الجمركي للشتاء" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "audience",
          type: "text",
          label: { en: "Audience", ar: "الجمهور" },
          localized: true,
          required: true,
          admin: {
            description: { en: "Who gets it, in a few words.", ar: "من يستلمها، في كلمات قليلة." },
            placeholder: { en: "Ship managers, consented", ar: "مديرو السفن، بموافقتهم" },
          },
        },
        {
          name: "recipients",
          type: "number",
          label: { en: "Recipients", ar: "المستلمون" },
          min: 0,
          admin: {
            description: { en: "How many contacts are on the list.", ar: "عدد جهات الاتصال في القائمة." },
            placeholder: { en: "e.g. 120", ar: "مثال: 120" },
          },
        },
        {
          name: "consentOnly",
          type: "checkbox",
          defaultValue: true,
          label: { en: "Consented contacts only", ar: "جهات الاتصال الموافقة فقط" },
          admin: {
            description: {
              en: "Keep ticked so only contacts who agreed to emails get it.",
              ar: "أبقِه محددًا ليستلمها فقط من وافق على تلقي الرسائل.",
            },
          },
        },
      ],
    },
    {
      name: "subject",
      type: "text",
      label: { en: "Subject", ar: "الموضوع" },
      localized: true,
      admin: {
        description: { en: "The email subject line recipients see.", ar: "سطر الموضوع الذي يراه المستلمون." },
        placeholder: {
          en: "e.g. Bond stores for your winter port calls",
          ar: "مثال: مستلزمات الإيداع الجمركي لرسوّكم الشتوي",
        },
      },
    },
    {
      name: "body",
      type: "textarea",
      label: { en: "Body", ar: "النص" },
      localized: true,
      admin: {
        description: {
          en: "The email text. It must be approved before sending.",
          ar: "نص البريد. يجب اعتماده قبل الإرسال.",
        },
        placeholder: {
          en: "e.g. Dear Captain, our Port Said stores now carry...",
          ar: "مثال: حضرة القبطان، أصبحت مخازننا في بورسعيد توفّر...",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "contentStatus",
          type: "select",
          label: { en: "Content Status", ar: "حالة المحتوى" },
          defaultValue: "Draft",
          options: [
            { value: "Draft", label: { en: "Draft", ar: "مسودة" } },
            { value: "Awaiting approval", label: { en: "Awaiting approval", ar: "بانتظار الموافقة" } },
            { value: "Approved", label: { en: "Approved", ar: "معتمد" } },
          ],
          custom: tones({ Draft: "warning", "Awaiting approval": "warning", Approved: "success" }),
          admin: {
            description: { en: "Whether the wording has been signed off.", ar: "هل اعتُمدت الصياغة." },
            placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
          },
        },
        {
          name: "scheduledAt",
          type: "date",
          label: { en: "Scheduled At", ar: "موعد الإرسال" },
          admin: { description: { en: "When it goes out; management sets this.", ar: "موعد الإرسال؛ تضبطه الإدارة." } },
        },
      ],
    },
    {
      name: "stats",
      type: "group",
      label: { en: "Stats", ar: "الإحصاءات" },
      admin: { description: { en: "How the send performed.", ar: "أداء الإرسال." } },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "sent",
              type: "number",
              label: { en: "Sent", ar: "المرسلة" },
              min: 0,
              admin: {
                description: { en: "Emails delivered.", ar: "الرسائل المسلّمة." },
                placeholder: { en: "e.g. 118", ar: "مثال: 118" },
              },
            },
            {
              name: "opened",
              type: "number",
              label: { en: "Opened", ar: "المفتوحة" },
              min: 0,
              admin: {
                description: { en: "Recipients who opened it.", ar: "المستلمون الذين فتحوها." },
                placeholder: { en: "e.g. 54", ar: "مثال: 54" },
              },
            },
            {
              name: "replied",
              type: "number",
              label: { en: "Replied", ar: "الردود" },
              min: 0,
              admin: {
                description: { en: "Recipients who wrote back.", ar: "المستلمون الذين ردّوا." },
                placeholder: { en: "e.g. 9", ar: "مثال: 9" },
              },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      defaultValue: "Draft",
      options: [
        { value: "Draft", label: { en: "Draft", ar: "مسودة" } },
        { value: "Scheduled", label: { en: "Scheduled", ar: "مجدول" } },
        { value: "Sent", label: { en: "Sent", ar: "مُرسل" } },
        { value: "Cancelled", label: { en: "Cancelled", ar: "ملغى" } },
      ],
      admin: {
        position: "sidebar",
        description: { en: "Only management can schedule or send.", ar: "الإدارة وحدها تجدول الإرسال أو ترسل." },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    computed(
      {
        name: "reach",
        type: "text",
        label: { en: "Audience", ar: "الجمهور" },
        admin: {
          condition: () => false,
          description: { en: "Who it reaches, in one line.", ar: "من تصل إليهم، في سطر واحد." },
        },
      },
      (c, req) => {
        const n = Number(c.recipients) || 0;
        return [
          scalar(c.audience),
          inLanguage(req, { en: `${n} contacts`, ar: `${n} جهة اتصال` }),
          c.consentOnly !== false ? inLanguage(req, { en: "consented only", ar: "الموافقون فقط" }) : "",
        ]
          .filter(Boolean)
          .join(" · ");
      },
    ),
    computed(
      {
        name: "results",
        type: "text",
        label: { en: "Results", ar: "النتائج" },
        admin: {
          condition: () => false,
          description: {
            en: "Sent, opened and replied counts in one line.",
            ar: "أعداد المرسل والمفتوح والمردود عليه في سطر واحد.",
          },
        },
      },
      (c, req) => {
        const s = (c.stats as { sent?: number; opened?: number; replied?: number } | undefined) ?? {};
        const [sent, opened, replied] = [Number(s.sent), Number(s.opened) || 0, Number(s.replied) || 0];
        return sent
          ? inLanguage(req, {
              en: `${sent} sent · ${opened} opened · ${replied} replied`,
              ar: `${sent} مُرسلة · ${opened} مفتوحة · ${replied} مردود عليها`,
            })
          : null;
      },
    ),
  ],
};
