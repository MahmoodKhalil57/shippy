import type { Access, CollectionConfig } from "payload";
import {
  DAY,
  TODAY,
  choices,
  computed,
  deskAccess,
  idOf,
  inLanguage,
  loggedIn,
  management,
  related,
  ruleError,
  scalar,
  type Words,
  asText,
  words,
} from "./shared.ts";
import { tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";

const clock = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/**
 * When something is due, against the demo's clock: "Overdue" once passed, its time today ("11:00"),
 * else its day ("Wed 18 Nov", with the time when it has one); in the request's language (`req`),
 * else English. Pure: the date in.
 */
export function dueLabel(iso: unknown, req?: { locale?: unknown }): string | null {
  if (typeof iso !== "string" || !iso) return null;
  const d = new Date(iso);
  if (d < TODAY) return inLanguage(req, { en: "Overdue", ar: "متأخرة" });
  const timed = d.getTime() % DAY !== 0;
  if (Math.floor(d.getTime() / DAY) === Math.floor(TODAY.getTime() / DAY))
    return timed ? clock(d) : inLanguage(req, { en: "Today", ar: "اليوم" });
  const day = d.toLocaleDateString(req?.locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return timed ? `${day} ${clock(d)}` : day;
}

const KIND_LABEL: Record<string, { en: string; ar: string }> = {
  auto: { en: "Automatic", ar: "تلقائي" },
  human: { en: "Human", ar: "بشري" },
  alert: { en: "Alert", ar: "تنبيه" },
};

/** Case timeline + audit log: every automatic step and human decision. Append-only. */
export const Activities: CollectionConfig = {
  slug: "activities",
  labels: { singular: { en: "Activity", ar: "نشاط" }, plural: { en: "Activity log", ar: "سجل النشاط" } },
  admin: {
    useAsTitle: "text",
    defaultColumns: ["at", "case", "kind", "text", "actor"],
    group: { en: "Work", ar: "العمل" },
  },
  defaultSort: "-at",
  access: { read: loggedIn, create: loggedIn, update: () => false, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "at",
          type: "date",
          label: { en: "At", ar: "الوقت" },
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: { pickerAppearance: "dayAndTime" },
            description: { en: "When the step happened.", ar: "وقت حدوث الخطوة." },
          },
        },
        {
          name: "case",
          type: "relationship",
          label: { en: "Case", ar: "الملف" },
          relationTo: "cases",
          index: true,
          admin: {
            description: { en: "The customer case it belongs to.", ar: "ملف العميل الذي تتبعه." },
            placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
          },
        },
        {
          name: "kind",
          type: "select",
          label: { en: "Kind", ar: "النوع" },
          options: [
            { label: { en: "Automatic", ar: "تلقائي" }, value: "auto" },
            { label: { en: "Human", ar: "بشري" }, value: "human" },
            { label: { en: "Alert", ar: "تنبيه" }, value: "alert" },
          ],
          custom: tones({ auto: "info", human: "success", alert: "warning" }),
          defaultValue: "auto",
          admin: {
            description: {
              en: "Whether the system, a person or a warning did it.",
              ar: "هل قام بها النظام أم شخص أم تحذير.",
            },
            placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
          },
        },
      ],
    },
    {
      name: "text",
      type: "textarea",
      label: { en: "Text", ar: "النص" },
      localized: true,
      required: true,
      admin: {
        description: { en: "What happened, in plain words.", ar: "ما حدث، بكلمات بسيطة." },
        placeholder: {
          en: "e.g. Reminder sent to Delta Marine for RFQ 0142.",
          ar: "مثال: أُرسل تذكير إلى Delta Marine بشأن طلب العرض 0142.",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "actor",
          type: "relationship",
          label: { en: "Actor", ar: "المنفّذ" },
          relationTo: "users",
          admin: {
            description: {
              en: "The person who did it; empty for automatic steps.",
              ar: "الشخص الذي قام بها؛ فارغ للخطوات التلقائية.",
            },
            placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
          },
        },
        {
          name: "entity",
          type: "text",
          label: { en: "Entity", ar: "الكيان" },
          admin: {
            description: {
              en: "The record that changed, as collection/id.",
              ar: "السجل الذي تغيّر، بصيغة collection/id.",
            },
            placeholder: { en: "e.g. suppliers/12", ar: "مثال: suppliers/12" },
          },
        },
        {
          name: "rule",
          type: "text",
          label: { en: "Automation rule", ar: "قاعدة أتمتة" },
          admin: {
            description: { en: "Set when an automation did it.", ar: "يُضبط عندما تقوم بها أتمتة." },
            placeholder: { en: "e.g. RFQ reminder", ar: "مثال: تذكير طلب العرض" },
          },
        },
      ],
    },
    {
      name: "undoOf",
      type: "relationship",
      relationTo: "activities",
      label: { en: "Undoes", ar: "يلغي" },
      admin: {
        description: { en: "The earlier step this one reverses.", ar: "الخطوة السابقة التي تعكسها هذه الخطوة." },
        placeholder: words({ en: "Search the activity log", ar: "ابحث في سجل النشاط" }),
      },
    },
    // Who or what did it, in a line (never stored): "Automatic · System · rule: RFQ reminder",
    // "Human · Karim Youssef". Every automatic step names its rule, every human one the person.
    computed(
      {
        name: "byline",
        type: "text",
        label: { en: "By", ar: "بواسطة" },
        admin: {
          condition: () => false,
          description: {
            en: "Who or what did it, with the rule if automatic.",
            ar: "من أو ما قام بها، مع القاعدة إن كانت تلقائية.",
          },
        },
      },
      async (a, req) => {
        const kind = inLanguage(req, KIND_LABEL[scalar(a.kind)] ?? KIND_LABEL.auto!);
        const actor = a.actor ? scalar((await related(req, "users", a.actor))?.name) : "";
        const system = inLanguage(req, { en: "System", ar: "النظام" });
        const rule = a.rule ? inLanguage(req, { en: `rule: ${scalar(a.rule)}`, ar: `القاعدة: ${scalar(a.rule)}` }) : "";
        return [kind, actor || (a.kind === "human" ? "" : system), rule].filter(Boolean).join(" · ");
      },
    ),
  ],
};

/**
 * Everything someone has to do by a time: supplier reminders, customer follow-ups (respecting the
 * account's contact rule), sales next steps, collections, delivery tasks.
 */
export const Tasks: CollectionConfig = {
  slug: "tasks",
  labels: { singular: { en: "Task", ar: "مهمة" }, plural: { en: "Tasks", ar: "المهام" } },
  custom: { list: { board: "status", cardFields: ["type", "due", "owner"] } } satisfies CollectionSettings,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "channel", "due", "owner", "status"],
    group: { en: "Work", ar: "العمل" },
  },
  defaultSort: "due",
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Customer-facing follow-ups are refused for "do not chase" accounts (internal reminders only).
      async ({ data, req }) => {
        if (data.type !== "Customer follow-up" || !data.customer || data.internalOnly) return data;
        const c = (await req.payload
          .findByID({ collection: "customers", id: String(idOf(data.customer)), depth: 0 })
          .catch(() => null)) as { contactRule?: string } | null;
        if (c?.contactRule === "do-not-chase")
          throw ruleError("This customer must not be chased — create an internal reminder instead.");
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: { en: "Title", ar: "العنوان" },
      localized: true,
      required: true,
      admin: {
        description: { en: "What has to be done, in a few words.", ar: "المطلوب إنجازه، في كلمات قليلة." },
        placeholder: {
          en: "e.g. Chase Delta Marine for RFQ 0142 prices",
          ar: "مثال: متابعة أسعار Delta Marine لطلب العرض 0142",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          label: { en: "Type", ar: "النوع" },
          required: true,
          options: [
            { value: "Supplier reminder", label: { en: "Supplier reminder", ar: "تذكير مورّد" } },
            { value: "Customer follow-up", label: { en: "Customer follow-up", ar: "متابعة عميل" } },
            { value: "Internal reminder", label: { en: "Internal reminder", ar: "تذكير داخلي" } },
            { value: "Sales next step", label: { en: "Sales next step", ar: "الخطوة التالية للمبيعات" } },
            { value: "Collection", label: { en: "Collection", ar: "تحصيل" } },
            { value: "Delivery task", label: { en: "Delivery task", ar: "مهمة تسليم" } },
            { value: "Clarification", label: { en: "Clarification", ar: "توضيح" } },
          ],
          admin: {
            description: {
              en: "Decides who is contacted and how it is tracked.",
              ar: "يحدد من يُتواصل معه وكيف يُتابع.",
            },
            placeholder: words({ en: "Pick a task type", ar: "اختر نوع المهمة" }),
          },
        },
        {
          name: "channel",
          type: "select",
          label: { en: "Channel", ar: "القناة" },
          options: [
            { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
            { value: "Call", label: { en: "Call", ar: "مكالمة" } },
            { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
            { value: "Site visit", label: { en: "Site visit", ar: "زيارة موقع" } },
            { value: "Meeting", label: { en: "Meeting", ar: "اجتماع" } },
            { value: "Internal", label: { en: "Internal", ar: "داخلي" } },
          ],
          admin: {
            description: { en: "How it will be done.", ar: "كيف ستُنجز." },
            placeholder: words({ en: "Pick a channel", ar: "اختر قناة" }),
          },
        },
        {
          name: "due",
          type: "date",
          label: { en: "Due", ar: "الاستحقاق" },
          required: true,
          admin: {
            date: { pickerAppearance: "dayAndTime" },
            description: { en: "When it must be done by.", ar: "موعد إنجازها النهائي." },
          },
        },
      ],
    },
    // "Overdue" (in red), "11:00" or its day: how every list of follow-ups says when (never stored).
    computed(
      {
        name: "when",
        type: "text",
        label: { en: "When", ar: "متى" },
        // Red once overdue, as it reads in either language.
        custom: { toneWhen: [{ when: { when: { in: ["Overdue", "متأخرة"] } }, tone: "error" }] },
        admin: {
          position: "sidebar",
          description: { en: "Overdue, a time today, or the due day.", ar: "متأخرة، أو وقت اليوم، أو يوم الاستحقاق." },
        },
      },
      (t, req) => (t.status === "Open" || !t.status ? dueLabel(t.due, req) : null),
    ),
    {
      type: "row",
      fields: [
        {
          name: "case",
          type: "relationship",
          label: { en: "Case", ar: "الملف" },
          relationTo: "cases",
          admin: {
            description: { en: "The case this task is about.", ar: "الملف الذي تخصه هذه المهمة." },
            placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
          },
        },
        {
          name: "customer",
          type: "relationship",
          label: { en: "Customer", ar: "العميل" },
          relationTo: "customers",
          admin: {
            description: { en: "The customer to contact, if any.", ar: "العميل المطلوب التواصل معه، إن وُجد." },
            placeholder: words({ en: "Search customers", ar: "ابحث في العملاء" }),
          },
        },
        {
          name: "supplier",
          type: "relationship",
          label: { en: "Supplier", ar: "المورّد" },
          relationTo: "suppliers",
          admin: {
            description: { en: "The supplier to contact, if any.", ar: "المورّد المطلوب التواصل معه، إن وُجد." },
            placeholder: words({ en: "Search suppliers", ar: "ابحث في الموردين" }),
          },
        },
        {
          name: "opportunity",
          type: "relationship",
          label: { en: "Opportunity", ar: "الفرصة" },
          relationTo: "opportunities",
          admin: {
            description: { en: "The sales lead this belongs to.", ar: "فرصة البيع التي تتبعها." },
            placeholder: words({ en: "Search opportunities", ar: "ابحث في فرص البيع" }),
          },
        },
      ],
    },
    {
      name: "who",
      type: "text",
      label: { en: "Who (person / role)", ar: "من (شخص / دور)" },
      admin: {
        description: { en: "The person or role to reach.", ar: "الشخص أو الدور المطلوب الوصول إليه." },
        placeholder: { en: "e.g. Purchasing manager", ar: "مثال: مدير المشتريات" },
      },
    },
    {
      name: "goal",
      type: "text",
      label: { en: "Goal", ar: "الهدف" },
      localized: true,
      admin: {
        description: { en: "What we want out of it.", ar: "ما نريد تحقيقه منها." },
        placeholder: { en: "e.g. Get a firm price by Thursday", ar: "مثال: الحصول على سعر نهائي قبل الخميس" },
      },
    },
    {
      name: "script",
      type: "textarea",
      localized: true,
      label: { en: "What to say / draft", ar: "ماذا نقول / مسودة" },
      admin: {
        description: { en: "Talking points or a draft message.", ar: "نقاط الحديث أو مسودة رسالة." },
        placeholder: {
          en: "e.g. Ask if the quote for 40 drums of lube oil still stands.",
          ar: "مثال: اسأل إن كان عرض 40 برميل زيت تشحيم لا يزال قائمًا.",
        },
      },
    },
    {
      name: "internalOnly",
      type: "checkbox",
      label: { en: "Internal only (no customer contact)", ar: "داخلي فقط (دون تواصل مع العميل)" },
      defaultValue: false,
      admin: {
        description: {
          en: "Tick when nobody outside Golden Sea is contacted.",
          ar: "حدّد عندما لا يُتواصل مع أحد خارج Golden Sea.",
        },
      },
      custom: {
        about: {
          en: "Customers set to do not chase can only get internal tasks; customer follow-ups to them are refused.",
          ar: "العملاء المضبوطون على «عدم المتابعة» لا تُنشأ لهم إلا مهام داخلية؛ وتُرفض متابعات العملاء لهم.",
        },
      },
    },
    {
      name: "outcome",
      type: "group",
      label: { en: "Outcome", ar: "النتيجة" },
      admin: {
        description: { en: "How it went, once done or skipped.", ar: "كيف سارت، بعد إنجازها أو تخطيها." },
        condition: (data) => data?.status === "Done" || data?.status === "Skipped",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "result",
              type: "select",
              label: { en: "Result", ar: "النتيجة" },
              options: [
                { value: "Reached — positive", label: { en: "Reached — positive", ar: "تم الوصول — إيجابي" } },
                { value: "Reached — call back", label: { en: "Reached — call back", ar: "تم الوصول — معاودة الاتصال" } },
                { value: "No answer", label: { en: "No answer", ar: "لا رد" } },
                { value: "Not interested", label: { en: "Not interested", ar: "غير مهتم" } },
                { value: "Sent", label: { en: "Sent", ar: "مُرسل" } },
              ],
              admin: {
                description: { en: "How the contact went.", ar: "كيف سار التواصل." },
                placeholder: words({ en: "Pick an outcome", ar: "اختر نتيجة" }),
              },
            },
            {
              name: "nextDate",
              type: "date",
              label: { en: "Next Date", ar: "التاريخ التالي" },
              admin: { description: { en: "When to try again, if needed.", ar: "موعد المحاولة مجددًا، إن لزم." } },
            },
          ],
        },
        {
          name: "note",
          type: "textarea",
          label: { en: "Note", ar: "ملاحظة" },
          localized: true,
          admin: {
            description: { en: "What was said or decided.", ar: "ما قيل أو تقرر." },
            placeholder: {
              en: "e.g. Left a voicemail, will call back tomorrow.",
              ar: "مثال: تُركت رسالة صوتية، سأعاود الاتصال غدًا.",
            },
          },
        },
      ],
    },
    {
      name: "owner",
      type: "relationship",
      label: { en: "Owner", ar: "المسؤول" },
      relationTo: "users",
      required: true,
      admin: {
        position: "sidebar",
        description: { en: "The person who has to do it.", ar: "الشخص المكلّف بها." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      defaultValue: "Open",
      options: [
        { value: "Open", label: { en: "Open", ar: "مفتوح" } },
        { value: "Done", label: { en: "Done", ar: "تم" } },
        { value: "Skipped", label: { en: "Skipped", ar: "تم التخطي" } },
        { value: "Cancelled", label: { en: "Cancelled", ar: "ملغى" } },
      ],
      custom: tones({ Open: "info", Done: "success", Skipped: "neutral", Cancelled: "neutral" }),
      admin: {
        position: "sidebar",
        description: { en: "Open until done, skipped or cancelled.", ar: "مفتوحة حتى تُنجز أو تُتخطى أو تُلغى." },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    {
      name: "createdByRule",
      type: "text",
      label: { en: "Created By Rule", ar: "أنشأته قاعدة" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "The automation rule that created it, if any.", ar: "قاعدة الأتمتة التي أنشأتها، إن وُجدت." },
      },
    },
    {
      name: "stopCondition",
      type: "text",
      label: { en: "Stop Condition", ar: "شرط التوقف" },
      localized: true,
      admin: {
        position: "sidebar",
        description: { en: "When to stop the task without doing it.", ar: "متى تُوقف المهمة دون إنجازها." },
        placeholder: { en: "e.g. Reply received or case closed", ar: "مثال: وصل الرد أو أُغلق الملف" },
      },
    },
  ],
};

/** The safe retry of an exception: the endpoint answers with what it did (the snackbar). */
const retry = (label: Words, when: Record<string, unknown>): CollectionAction => ({
  label: asText(label),
  when,
  call: { path: "/automations/retry/$row.id" },
  reply: true,
});

/** Failed integrations and uncertain automation results — nothing fails silently; retries are idempotent. */
export const IntegrationExceptions: CollectionConfig = {
  slug: "integration-exceptions",
  labels: { singular: { en: "Exception", ar: "استثناء" }, plural: { en: "Exception queue", ar: "قائمة الاستثناءات" } },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["occurredAt", "source", "summary", "status", "retries"],
    group: { en: "Work", ar: "العمل" },
  },
  defaultSort: "-occurredAt",
  // Wherever exceptions show: a safe retry (it checks the idempotency key first, so nothing is
  // created, imported or sent twice; on a done one it changes nothing), and for an uncertain AI
  // result, marking it reviewed under the person's name (POST /api/automations/…,
  // ../endpoints/platform.ts, which re-checks).
  custom: {
    actions: [
      retry({ en: "Safe retry", ar: "إعادة محاولة آمنة" }, { status: { equals: "Open" } }),
      retry(
        { en: "Retry again", ar: "إعادة المحاولة مجددًا" },
        { status: { in: ["Resolved", "Auto-resolved", "Ignored"] } },
      ),
      {
        label: words({ en: "Mark reviewed", ar: "تعليم كمراجَع" }),
        when: { status: { equals: "Waiting for review" } },
        call: { path: "/automations/review/$row.id", body: {} },
        confirm: {
          heading: words({ en: "Mark as reviewed?", ar: "تعليم كمراجَع؟" }),
          text: words({
            en: "$row.source: $row.summary\nConfirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this.",
            ar: "$row.source: $row.summary\\nأكّد أنك تحققت من الحقول المعلَّمة في المصدر. يُسجَّل اسمك في سجل التدقيق؛ ولا تُطبَّق قيم الذكاء الاصطناعي أبدًا دون ذلك.",
          }),
          label: words({ en: "Confirm reviewed", ar: "تأكيد المراجعة" }),
        },
        done: words({ en: "Reviewed — your name is on the audit log", ar: "تمت المراجعة — اسمك مسجّل في سجل التدقيق" }),
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "occurredAt",
          type: "date",
          label: { en: "Occurred At", ar: "تاريخ الحدوث" },
          required: true,
          admin: {
            date: { pickerAppearance: "dayAndTime" },
            description: { en: "When the failure happened.", ar: "وقت حدوث الإخفاق." },
          },
        },
        {
          name: "source",
          type: "select",
          label: { en: "Source", ar: "المصدر" },
          required: true,
          options: [
            { value: "Outlook", label: { en: "Outlook", ar: "Outlook" } },
            { value: "Gmail", label: { en: "Gmail", ar: "Gmail" } },
            { value: "Website form", label: { en: "Website form", ar: "نموذج الموقع" } },
            { value: "AI extraction", label: { en: "AI extraction", ar: "الاستخراج بالذكاء الاصطناعي" } },
            { value: "E-invoicing", label: { en: "E-invoicing", ar: "الفاتورة الإلكترونية" } },
            { value: "Automation rule", label: { en: "Automation rule", ar: "قاعدة أتمتة" } },
            { value: "Import", label: { en: "Import", ar: "استيراد" } },
          ],
          admin: {
            description: { en: "Which integration raised it.", ar: "التكامل الذي أبلغ عنه." },
            placeholder: words({ en: "Pick a source", ar: "اختر مصدرًا" }),
          },
        },
      ],
    },
    {
      name: "summary",
      type: "text",
      label: { en: "Summary", ar: "الملخص" },
      localized: true,
      required: true,
      admin: {
        description: { en: "What went wrong, in one line.", ar: "ما الخطأ، في سطر واحد." },
        placeholder: { en: "e.g. Supplier offer PDF could not be read", ar: "مثال: تعذّرت قراءة ملف PDF لعرض المورّد" },
      },
    },
    {
      name: "impact",
      type: "text",
      label: { en: "Impact", ar: "الأثر" },
      localized: true,
      admin: {
        description: { en: "What this blocks or delays.", ar: "ما يعيقه هذا أو يؤخره." },
        placeholder: { en: "e.g. RFQ 0142 has no comparison yet", ar: "مثال: طلب العرض 0142 بلا مقارنة بعد" },
      },
    },
    {
      name: "idempotencyKey",
      type: "text",
      label: { en: "Idempotency Key", ar: "مفتاح عدم التكرار" },
      admin: {
        description: { en: "The message or document id behind it.", ar: "معرّف الرسالة أو المستند المرتبط." },
        placeholder: { en: "e.g. msg-7f3a91", ar: "مثال: msg-7f3a91" },
      },
      custom: {
        about: {
          en: "A retry checks this id first, so nothing is created or sent twice.",
          ar: "تتحقق إعادة المحاولة من هذا المعرّف أولًا، فلا يُنشأ أو يُرسل شيء مرتين.",
        },
      },
    },
    {
      name: "payload",
      type: "json",
      label: { en: "Payload", ar: "البيانات" },
      admin: { description: { en: "Technical detail kept for the retry.", ar: "تفاصيل تقنية محفوظة لإعادة المحاولة." } },
    },
    {
      type: "row",
      fields: [
        {
          name: "retries",
          type: "number",
          label: { en: "Retries", ar: "المحاولات" },
          min: 0,
          defaultValue: 0,
          admin: {
            description: { en: "How many times it was retried.", ar: "عدد مرات إعادة المحاولة." },
            placeholder: { en: "e.g. 0", ar: "مثال: 0" },
          },
        },
        {
          name: "lastRetryAt",
          type: "date",
          label: { en: "Last Retry At", ar: "آخر إعادة محاولة" },
          admin: { description: { en: "When it was last retried.", ar: "آخر وقت لإعادة المحاولة." } },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      defaultValue: "Open",
      options: [
        { value: "Open", label: { en: "Open", ar: "مفتوح" } },
        { value: "Waiting for review", label: { en: "Waiting for review", ar: "بانتظار المراجعة" } },
        { value: "Resolved", label: { en: "Resolved", ar: "تم الحل" } },
        { value: "Auto-resolved", label: { en: "Auto-resolved", ar: "حُلّ تلقائيًا" } },
        { value: "Ignored", label: { en: "Ignored", ar: "متجاهَل" } },
      ],
      custom: tones({
        Open: "error",
        "Waiting for review": "warning",
        Resolved: "success",
        "Auto-resolved": "success",
        Ignored: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: {
          en: "Open until retried, reviewed or ignored.",
          ar: "مفتوح حتى تُعاد المحاولة أو يُراجع أو يُتجاهل.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    {
      name: "resolvedBy",
      type: "relationship",
      label: { en: "Resolved By", ar: "حلّه" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: { en: "Who closed it.", ar: "من أغلقه." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
  ],
};

/** What the AI is asked to do, by kind of work (the log's `task`, the usage page's measures). */
export const AI_TASKS = [
  "Read an email",
  "Read an attachment",
  "Match a reply",
  "Check an offer",
  "Draft a handover",
  "Write the briefing",
  "Answer a question",
  "Draft a reminder",
] as const;

/**
 * Every AI call, logged: what it was asked to do, what it read, how sure it was, and whether a
 * person confirmed, corrected or rejected the result ("Every step logged" in the proposal). The
 * AI never applies an uncertain value on its own: under 85% it waits for a person. Written by the
 * endpoints that call the AI (`logAiCall`, ./shared.ts); people only add their review.
 */
export const AiCalls: CollectionConfig = {
  slug: "ai-calls",
  labels: {
    singular: { en: "AI call", ar: "استدعاء ذكاء اصطناعي" },
    plural: { en: "AI calls", ar: "استدعاءات الذكاء الاصطناعي" },
  },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["at", "task", "subject", "case", "confidence", "outcome"],
    group: { en: "Work", ar: "العمل" },
  },
  defaultSort: "-at",
  access: { read: loggedIn, create: loggedIn, update: management, delete: () => false },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "at",
          type: "date",
          label: { en: "At", ar: "الوقت" },
          required: true,
          admin: {
            date: { pickerAppearance: "dayAndTime" },
            description: { en: "When the AI ran.", ar: "وقت تشغيل الذكاء الاصطناعي." },
          },
        },
        {
          name: "task",
          type: "select",
          label: { en: "Task", ar: "المهمة" },
          required: true,
          options: choices(AI_TASKS, {
            "Read an email": "قراءة بريد",
            "Read an attachment": "قراءة مرفق",
            "Match a reply": "مطابقة رد",
            "Check an offer": "فحص عرض",
            "Draft a handover": "صياغة مذكرة تسليم",
            "Write the briefing": "كتابة الملخص",
            "Answer a question": "الإجابة عن سؤال",
            "Draft a reminder": "صياغة تذكير",
          }),
          admin: {
            description: { en: "What the AI was asked to do.", ar: "ما طُلب من الذكاء الاصطناعي فعله." },
            placeholder: words({ en: "Pick a task", ar: "اختر مهمة" }),
          },
        },
      ],
    },
    {
      name: "subject",
      type: "text",
      label: { en: "Subject", ar: "الموضوع" },
      localized: true,
      required: true,
      admin: {
        description: { en: "What it read or answered, in one line.", ar: "ما قرأه أو أجاب عنه، في سطر واحد." },
        placeholder: {
          en: "e.g. RFQ email from Helios Bulk, 3 attachments",
          ar: "مثال: بريد طلب عرض من Helios Bulk، 3 مرفقات",
        },
      },
    },
    {
      name: "case",
      type: "relationship",
      label: { en: "Case", ar: "الملف" },
      relationTo: "cases",
      admin: {
        description: { en: "The case it worked on, if any.", ar: "الملف الذي عمل عليه، إن وُجد." },
        placeholder: words({ en: "Search cases", ar: "ابحث في الملفات" }),
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "confidence",
          type: "number",
          label: { en: "Confidence", ar: "الثقة" },
          min: 0,
          max: 1,
          admin: {
            step: 0.01,
            description: {
              en: "How sure the AI was, from 0 to 1. Under 0.85 waits for a person.",
              ar: "مدى ثقة الذكاء الاصطناعي، من 0 إلى 1. ما دون 0.85 ينتظر شخصًا.",
            },
            placeholder: { en: "e.g. 0.92", ar: "مثال: 0.92" },
          },
        },
        {
          name: "values",
          type: "number",
          label: { en: "Values", ar: "القيم" },
          min: 0,
          admin: {
            description: { en: "How many values it read or wrote.", ar: "عدد القيم التي قرأها أو كتبها." },
            placeholder: { en: "e.g. 14", ar: "مثال: 14" },
          },
        },
        {
          name: "seconds",
          type: "number",
          label: { en: "Seconds", ar: "الثواني" },
          min: 0,
          admin: {
            step: 0.1,
            description: { en: "How long the call took.", ar: "المدة التي استغرقها الاستدعاء." },
            placeholder: { en: "e.g. 3.2", ar: "مثال: 3.2" },
          },
        },
      ],
    },
    {
      name: "model",
      type: "text",
      label: { en: "Model", ar: "الموديل" },
      admin: {
        description: { en: "The model and version that answered.", ar: "النموذج والإصدار الذي أجاب." },
        placeholder: { en: "e.g. Demo stub (no live AI)", ar: "مثال: نموذج تجريبي (بلا ذكاء اصطناعي فعلي)" },
      },
    },
    {
      name: "outcome",
      type: "select",
      label: { en: "Outcome", ar: "النتيجة" },
      required: true,
      defaultValue: "Applied automatically",
      options: [
        { value: "Applied automatically", label: { en: "Applied automatically", ar: "طُبّق تلقائيًا" } },
        { value: "Confirmed by a person", label: { en: "Confirmed by a person", ar: "أكّده شخص" } },
        { value: "Corrected by a person", label: { en: "Corrected by a person", ar: "صحّحه شخص" } },
        { value: "Rejected", label: { en: "Rejected", ar: "مرفوض" } },
        { value: "Waiting for review", label: { en: "Waiting for review", ar: "بانتظار المراجعة" } },
      ],
      custom: tones({
        "Applied automatically": "success",
        "Confirmed by a person": "success",
        "Corrected by a person": "info",
        Rejected: "error",
        "Waiting for review": "warning",
      }),
      admin: {
        position: "sidebar",
        description: { en: "What happened to the result.", ar: "ما حدث للنتيجة." },
        placeholder: words({ en: "Pick an outcome", ar: "اختر نتيجة" }),
      },
    },
    {
      name: "reviewedBy",
      type: "relationship",
      label: { en: "Reviewed By", ar: "راجعه" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: { en: "Who confirmed, corrected or rejected it.", ar: "من أكّدها أو صحّحها أو رفضها." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
  ],
};

/** Only the signed-in user's own documents (a Payload Where-returning access function). */
const own: Access = ({ req }) => (req.user ? { user: { equals: req.user.id } } : false);

/**
 * Per-user notifications (the side panel's bell): what happened that needs this person —
 * approvals routed to them, replies on their cases, failures in their area. Each person sees
 * only their own; opening one marks it read.
 */
export const Notifications: CollectionConfig = {
  slug: "notifications",
  labels: { singular: { en: "Notification", ar: "إشعار" }, plural: { en: "Notifications", ar: "الإشعارات" } },
  admin: { useAsTitle: "title", defaultColumns: ["at", "title", "kind", "read"], group: { en: "Work", ar: "العمل" } },
  defaultSort: "-at",
  access: { read: own, create: loggedIn, update: own, delete: own },
  fields: [
    {
      name: "user",
      type: "relationship",
      label: { en: "User", ar: "المستخدم" },
      relationTo: "users",
      required: true,
      index: true,
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
      admin: {
        position: "sidebar",
        description: { en: "The person who sees it in their bell.", ar: "الشخص الذي يراه في جرس الإشعارات." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
    {
      name: "title",
      type: "text",
      label: { en: "Title", ar: "العنوان" },
      localized: true,
      required: true,
      admin: {
        description: { en: "The headline they read first.", ar: "العنوان الذي يقرؤه أولًا." },
        placeholder: {
          en: "e.g. Quotation GS-Q-0142 needs your approval",
          ar: "مثال: عرض السعر GS-Q-0142 يحتاج موافقتك",
        },
      },
    },
    {
      name: "detail",
      type: "text",
      label: { en: "Detail", ar: "التفاصيل" },
      localized: true,
      admin: {
        description: { en: "One more line of context.", ar: "سطر إضافي للسياق." },
        placeholder: { en: "e.g. Margin is below the approval threshold.", ar: "مثال: الهامش أقل من حد الموافقة." },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "kind",
          type: "select",
          label: { en: "Kind", ar: "النوع" },
          required: true,
          defaultValue: "Update",
          options: [
            { value: "Approval", label: { en: "Approval", ar: "موافقة" } },
            { value: "Reply", label: { en: "Reply", ar: "رد" } },
            { value: "Reminder", label: { en: "Reminder", ar: "تذكير" } },
            { value: "Alert", label: { en: "Alert", ar: "تنبيه" } },
            { value: "Payment", label: { en: "Payment", ar: "دفعة" } },
            { value: "Update", label: { en: "Update", ar: "تحديث" } },
          ],
          custom: tones({ Approval: "warning", Alert: "error", Payment: "success", Reply: "info", Reminder: "info" }),
          admin: {
            description: { en: "What sort of news it is.", ar: "نوع الخبر." },
            placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
          },
        },
        {
          name: "href",
          type: "text",
          label: { en: "Link", ar: "الرابط" },
          admin: {
            description: { en: "The dashboard page it opens.", ar: "صفحة لوحة التحكم التي يفتحها." },
            placeholder: { en: "e.g. /collections/cases/gs-rfq-0142", ar: "مثال: /collections/cases/gs-rfq-0142" },
          },
        },
      ],
    },
    {
      name: "at",
      type: "date",
      label: { en: "At", ar: "الوقت" },
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
        description: { en: "When it was sent.", ar: "وقت إرساله." },
      },
    },
    {
      name: "read",
      type: "checkbox",
      label: { en: "Read", ar: "مقروء" },
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: { en: "Set once the person has opened it.", ar: "يُضبط بعد أن يفتحه الشخص." },
      },
    },
  ],
};

/** Per-user bookmarks (the side panel's star): pages a person keeps coming back to. */
export const Bookmarks: CollectionConfig = {
  slug: "bookmarks",
  labels: { singular: { en: "Bookmark", ar: "إشارة مرجعية" }, plural: { en: "Bookmarks", ar: "الإشارات المرجعية" } },
  admin: { useAsTitle: "label", defaultColumns: ["label", "href"], group: { en: "Work", ar: "العمل" }, hidden: true },
  defaultSort: "createdAt",
  access: { read: own, create: loggedIn, update: own, delete: own },
  fields: [
    {
      name: "user",
      type: "relationship",
      label: { en: "User", ar: "المستخدم" },
      relationTo: "users",
      required: true,
      index: true,
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
      admin: {
        description: { en: "The person whose list it is in.", ar: "الشخص الذي تخصه القائمة." },
        placeholder: words({ en: "Search users", ar: "ابحث في المستخدمين" }),
      },
    },
    {
      name: "label",
      type: "text",
      label: { en: "Label", ar: "التسمية" },
      required: true,
      admin: {
        description: { en: "The name shown in the side panel.", ar: "الاسم الظاهر في اللوحة الجانبية." },
        placeholder: { en: "e.g. Open RFQs", ar: "مثال: طلبات العروض المفتوحة" },
      },
    },
    {
      name: "href",
      type: "text",
      label: { en: "Href", ar: "الرابط" },
      required: true,
      admin: {
        description: { en: "The dashboard page it opens.", ar: "صفحة لوحة التحكم التي يفتحها." },
        placeholder: { en: "e.g. /collections/cases", ar: "مثال: /collections/cases" },
      },
    },
  ],
};
