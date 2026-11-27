import type { CollectionConfig, Field, PayloadRequest } from "payload";
import {
  CURRENCIES,
  SUPPLIER_RFQ_STATUS_OPTIONS,
  caseRef,
  computed,
  inLanguage,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
  scalar,
  type Words,
  words,
} from "./shared.ts";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";
import { OPEN_RFQ_STATUSES } from "./shared.ts";

export { OPEN_RFQ_STATUSES } from "./shared.ts";
const REMINDERS = 2;

const AT = { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" } as const;
const AT_EN = new Intl.DateTimeFormat("en-GB", AT);
const AT_AR = new Intl.DateTimeFormat("ar-u-nu-latn", AT);

export function reminderState(r: Record<string, unknown>, req?: { locale?: unknown }): string {
  const n = Number(r.reminders) || 0;
  const say = (en: string, ar: string) => inLanguage(req, { en, ar });
  const sent = say(`${n} of ${REMINDERS}`, `${n} من ${REMINDERS}`);
  if (r.escalated) return `${sent} · ${say("escalated", "صُعّد")}`;
  if (!OPEN_RFQ_STATUSES.includes(String(r.status))) return `${sent} · ${say("stopped", "متوقف")}`;
  if (typeof r.nextReminderAt !== "string" || !r.nextReminderAt) return sent;
  const at = new Date(r.nextReminderAt);
  return `${sent} · ${say(`next ${AT_EN.format(at)}`, `التالي ${AT_AR.format(at)}`)}`;
}

export function urgencyOf(m: Record<string, unknown>): number {
  const text = `${scalar(m.subject)}\n${scalar(m.body)}`;
  const status = scalar(m.status);
  let n = status === "Needs review" ? 3 : status === "New" ? 2 : 1;
  if (/\burgent|\basap\b|immediately|within 24\s*h|\btoday\b|tonight/i.test(text)) n += 2;
  if (/complain|cancel|\bstop\b|damaged|wrong (item|delivery)/i.test(text)) n += 2;
  return Math.min(5, n);
}

const CHANNEL_WORDS: Record<string, { en: string; ar: string }> = {
  WhatsApp: { en: "WhatsApp", ar: "WhatsApp" },
  Phone: { en: "Phone", ar: "الهاتف" },
  "Customer portal": { en: "Customer portal", ar: "بوابة العميل" },
};

const RFQ_STATUS_AR: Record<string, string> = Object.fromEntries(
  SUPPLIER_RFQ_STATUS_OPTIONS.map((o) => [o.value, o.label.ar]),
);

const SURE = 85;

const percentOf = (tonePath?: string, label: Words = { en: "Confidence", ar: "الثقة" }): Field => ({
  name: "confidencePct",
  type: "number",
  label,
  virtual: true,
  admin: {
    readOnly: true,
    description: { en: "The same confidence as a whole percentage.", ar: "الثقة نفسها كنسبة مئوية كاملة." },
  },
  custom: {
    ...formats.percent(0),
    ...(tonePath
      ? {
          toneWhen: [
            { when: { [tonePath]: { greater_than_equal: SURE } }, tone: "success" },
            { when: { [tonePath]: { greater_than_equal: 60 } }, tone: "warning" },
            { when: { [tonePath]: { exists: true } }, tone: "error" },
          ],
        }
      : {}),
  },
  hooks: {
    afterRead: [
      ({ siblingData }: { siblingData?: Record<string, unknown> }) =>
        typeof siblingData?.confidence === "number" ? Math.round(siblingData.confidence * 100) : undefined,
    ],
  },
});

const confidenceField = (hint: Words): Field => ({
  name: "confidence",
  type: "number",
  label: { en: "Confidence", ar: "الثقة" },
  min: 0,
  max: 1,
  admin: { description: hint, placeholder: { en: "e.g. 0.92", ar: "مثال: 0.92" } },
});

async function historyApproved(req: PayloadRequest): Promise<boolean> {
  const ctx = (req.context ??= {}) as { historyApproved?: Promise<boolean> };
  ctx.historyApproved ??= req.payload
    .findGlobal({ slug: "integrations" as never, depth: 0 } as never)
    .then((g) => {
      const imp = ((g as Record<string, unknown>).emailImport ?? {}) as Record<string, unknown>;
      return ["Approved", "Running", "Done"].includes(scalar(imp.status)) && Boolean(idOf(imp.approvedBy));
    })
    .catch(() => false);
  return ctx.historyApproved;
}

export const SOURCING_ROLES = ["supply-chain", "management"];
const LIVE = { source: { not_equals: "History import" } };
const NEEDS_REVIEW = { ...LIVE, status: { equals: "Needs review" } };
const LINKED = { ...LIVE, status: { equals: "Linked" }, "match.case": { exists: true } };
const review = (decision: "link" | "not-related", caseId?: string) => ({
  path: "/inbox/$row.id/review",
  body: caseId ? { decision, case: caseId } : { decision },
});
const HISTORY = (decision: "confirm" | "reject") => ({
  call: { path: "/inbox-history/review/$row.id", body: { decision } },
  done:
    decision === "confirm"
      ? words({ en: "Proposal confirmed", ar: "تم تأكيد الاقتراح" })
      : words({ en: "Proposal rejected — left out of the import", ar: "رُفض الاقتراح — استُبعد من الاستيراد" }),
});
const CHANGEABLE = { source: { equals: "History import" }, "history.locked": { not_equals: true } };

export const IntakeMessages: CollectionConfig = {
  slug: "intake-messages",
  labels: {
    singular: { en: "Intake message", ar: "رسالة واردة" },
    plural: { en: "Intake messages", ar: "الرسائل الواردة" },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Confirm offer", ar: "تأكيد العرض" }),
        main: true,
        roles: SOURCING_ROLES,
        when: { ...NEEDS_REVIEW, "match.case": { exists: true } },
        call: review("link", "$row.match.case.id"),
        done: words({
          en: "Confirmed — your decision is in the audit log",
          ar: "تم التأكيد — قرارك مسجّل في سجل التدقيق",
        }),
      },
      {
        label: words({
          en: "Link to $item.case.caseId ($item.confidencePct%)",
          ar: "ربط بـ $item.case.caseId ($item.confidencePct%)",
        }),
        roles: SOURCING_ROLES,
        when: NEEDS_REVIEW,
        each: "candidates",
        call: review("link", "$item.case.id"),
        done: words({ en: "Linked — your decision is in the audit log", ar: "تم الربط — قرارك مسجّل في سجل التدقيق" }),
      },
      {
        label: words({ en: "Not related", ar: "غير مرتبطة" }),
        roles: SOURCING_ROLES,
        when: NEEDS_REVIEW,
        call: review("not-related"),
        done: words({ en: "Marked not related", ar: "عُلّمت غير مرتبطة" }),
      },
      {
        label: words({ en: "Supplier RFQs", ar: "طلبات عروض الموردين" }),
        when: { ...LINKED, classification: { equals: "Supplier reply" } },
        href: link.doc("cases", "$row.match.case", "rfqs"),
      },
      {
        label: words({ en: "Open $row.match.case.caseId", ar: "فتح $row.match.case.caseId" }),
        main: true,
        when: LINKED,
        href: link.doc("cases", "$row.match.case"),
      },
      {
        label: words({ en: "Confirm", ar: "تأكيد" }),
        when: { ...CHANGEABLE, "history.decision": { exists: false } },
        ...HISTORY("confirm"),
      },
      {
        label: words({ en: "Reject", ar: "رفض" }),
        when: { ...CHANGEABLE, "history.decision": { exists: false } },
        ...HISTORY("reject"),
      },
      {
        label: words({ en: "Change", ar: "تغيير" }),
        when: { ...CHANGEABLE, "history.decision": { equals: "Confirmed" } },
        ...HISTORY("reject"),
      },
      {
        label: words({ en: "Change", ar: "تغيير" }),
        when: { ...CHANGEABLE, "history.decision": { equals: "Rejected" } },
        ...HISTORY("confirm"),
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "fromName", "channel", "classification", "status", "receivedAt"],
    group: { en: "Sourcing desk", ar: "مكتب التوريد" },
  },
  defaultSort: "-receivedAt",
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        data.urgency = urgencyOf({ ...originalDoc, ...data });
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { en: "Message", ar: "الرسالة" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "channel",
                  type: "select",
                  label: { en: "Channel", ar: "القناة" },
                  required: true,
                  options: [
                    { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
                    { value: "Website form", label: { en: "Website form", ar: "نموذج الموقع" } },
                    { value: "WhatsApp", label: { en: "WhatsApp", ar: "WhatsApp" } },
                    { value: "Phone", label: { en: "Phone", ar: "الهاتف" } },
                    { value: "Customer portal", label: { en: "Customer portal", ar: "بوابة العميل" } },
                  ],
                  admin: {
                    description: { en: "How the message reached us.", ar: "كيف وصلتنا الرسالة." },
                    placeholder: words({ en: "Pick a channel", ar: "اختر قناة" }),
                  },
                },
                {
                  name: "mailbox",
                  type: "text",
                  label: { en: "Mailbox", ar: "صندوق البريد" },
                  admin: {
                    description: {
                      en: "The shared mailbox that received it, for email.",
                      ar: "صندوق البريد المشترك الذي استلمها، للبريد الإلكتروني.",
                    },
                    placeholder: { en: "sales@ / purchasing@", ar: "sales@ / purchasing@" },
                  },
                },
                {
                  name: "receivedAt",
                  type: "date",
                  label: { en: "Received At", ar: "تاريخ الاستلام" },
                  required: true,
                  admin: {
                    description: {
                      en: "When it arrived. The inbox sorts newest first.",
                      ar: "وقت وصولها. يرتّب صندوق الوارد الأحدث أولًا.",
                    },
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "from",
                  type: "text",
                  label: { en: "From", ar: "من" },
                  required: true,
                  admin: {
                    description: { en: "Sender's email address or phone number.", ar: "بريد المرسل أو رقم هاتفه." },
                    placeholder: { en: "e.g. ops@nordictern.com", ar: "مثال: ops@nordictern.com" },
                  },
                },
                {
                  name: "fromName",
                  type: "text",
                  label: { en: "From Name", ar: "اسم المرسل" },
                  admin: {
                    description: {
                      en: "Sender's display name, as shown in the mailbox.",
                      ar: "الاسم الظاهر للمرسل كما في صندوق البريد.",
                    },
                    placeholder: { en: "e.g. Anders Holm", ar: "مثال: Anders Holm" },
                  },
                },
              ],
            },
            {
              name: "subject",
              type: "text",
              label: { en: "Subject", ar: "الموضوع" },
              required: true,
              admin: {
                description: {
                  en: "The email subject or the first line of the message.",
                  ar: "موضوع البريد أو السطر الأول من الرسالة.",
                },
                placeholder: {
                  en: "e.g. RFQ provisions for MV Nordic Tern, Port Said",
                  ar: "مثال: طلب عرض أسعار مؤن للسفينة MV Nordic Tern، بورسعيد",
                },
              },
            },
            {
              name: "body",
              type: "textarea",
              label: { en: "Body", ar: "النص" },
              admin: {
                description: { en: "The message text, kept as received.", ar: "نص الرسالة كما ورد." },
                placeholder: {
                  en: "e.g. Please quote the attached list, delivery Port Said 14 Dec.",
                  ar: "مثال: يرجى تسعير القائمة المرفقة، التسليم في بورسعيد 14 ديسمبر.",
                },
              },
            },
            {
              name: "attachments",
              type: "upload",
              label: { en: "Attachments", ar: "المرفقات" },
              relationTo: "media",
              hasMany: true,
              admin: {
                description: {
                  en: "Files that came with the message, stored in the media library.",
                  ar: "الملفات المرفقة بالرسالة، محفوظة في مكتبة الوسائط.",
                },
              },
            },
            {
              name: "files",
              type: "array",
              label: { en: "Files", ar: "الملفات" },
              labels: {
                singular: { en: "Attachment", ar: "مرفق" },
                plural: { en: "Attachments (as received)", ar: "المرفقات (كما وردت)" },
              },
              admin: {
                description: {
                  en: "The original attachments, kept with the message.",
                  ar: "المرفقات الأصلية، محفوظة مع الرسالة.",
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
                        description: { en: "The file name as received.", ar: "اسم الملف كما ورد." },
                        placeholder: { en: "e.g. provisions-list.xlsx", ar: "مثال: provisions-list.xlsx" },
                      },
                    },
                    {
                      name: "kind",
                      type: "select",
                      label: { en: "Kind", ar: "النوع" },
                      options: [
                        { value: "Excel", label: { en: "Excel", ar: "Excel" } },
                        { value: "PDF", label: { en: "PDF", ar: "PDF" } },
                        { value: "Word", label: { en: "Word", ar: "Word" } },
                        { value: "Image", label: { en: "Image", ar: "صورة" } },
                        { value: "Other", label: { en: "Other", ar: "أخرى" } },
                      ],
                      admin: {
                        description: {
                          en: "The kind of file, so the AI reads it the right way.",
                          ar: "نوع الملف، ليقرأه الذكاء الاصطناعي بالطريقة الصحيحة.",
                        },
                        placeholder: words({ en: "Pick a type", ar: "اختر نوعًا" }),
                      },
                    },
                    {
                      name: "note",
                      type: "text",
                      label: { en: "Note", ar: "ملاحظة" },
                      admin: {
                        description: {
                          en: "Anything worth knowing about this file.",
                          ar: "أي شيء يستحق المعرفة عن هذا الملف.",
                        },
                        placeholder: {
                          en: "e.g. Second sheet is deck stores",
                          ar: "مثال: الورقة الثانية لمستلزمات سطح السفينة",
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "messageId",
              type: "text",
              label: { en: "Message Id", ar: "معرّف الرسالة" },
              unique: true,
              admin: {
                readOnly: true,
                description: {
                  en: "Mailbox message-id or form submission id. Processing the same message twice does nothing.",
                  ar: "معرّف الرسالة في صندوق البريد أو معرّف إرسال النموذج. معالجة الرسالة نفسها مرتين لا تفعل شيئًا.",
                },
              },
            },
            {
              name: "attachmentHash",
              type: "text",
              label: { en: "Attachment Hash", ar: "بصمة المرفقات" },
              admin: {
                readOnly: true,
                description: {
                  en: "Fingerprint of the attachments, to spot the same files sent twice.",
                  ar: "بصمة المرفقات، لاكتشاف الملفات نفسها المرسلة مرتين.",
                },
              },
            },
            {
              name: "scenario",
              type: "text",
              admin: {
                hidden: true,
                description: {
                  en: "Demo: which canned AI result this message gets.",
                  ar: "عرض تجريبي: نتيجة الذكاء الاصطناعي الجاهزة لهذه الرسالة.",
                },
              },
            },
          ],
        },
        {
          label: { en: "Extraction", ar: "الاستخراج" },
          fields: [
            {
              name: "extraction",
              type: "group",
              label: {
                en: "AI draft (never applied automatically when confidence is low)",
                ar: "مسودة الذكاء الاصطناعي (لا تُطبَّق تلقائيًا عند انخفاض الثقة)",
              },
              admin: {
                description: {
                  en: "What the AI read from the message. A person checks it before a case is built.",
                  ar: "ما قرأه الذكاء الاصطناعي من الرسالة. يراجعه شخص قبل إنشاء الملف.",
                },
              },
              fields: [
                {
                  name: "header",
                  type: "array",
                  label: { en: "Header", ar: "الترويسة" },
                  labels: { singular: { en: "Field", ar: "حقل" }, plural: { en: "Fields", ar: "الحقول" } },
                  admin: {
                    description: {
                      en: "Case details the AI found, such as vessel, port and ETA.",
                      ar: "تفاصيل الملف التي وجدها الذكاء الاصطناعي، مثل السفينة والميناء وموعد الوصول.",
                    },
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "field",
                          type: "text",
                          label: { en: "Field", ar: "الحقل" },
                          required: true,
                          admin: {
                            description: { en: "Which case detail this is.", ar: "أي تفصيل من تفاصيل الملف هذا." },
                            placeholder: { en: "e.g. Vessel", ar: "مثال: السفينة" },
                          },
                        },
                        {
                          name: "value",
                          type: "text",
                          label: { en: "Value", ar: "القيمة" },
                          admin: {
                            description: {
                              en: "What the AI read for it.",
                              ar: "ما قرأه الذكاء الاصطناعي لهذا التفصيل.",
                            },
                            placeholder: { en: "e.g. MV Nordic Tern", ar: "مثال: MV Nordic Tern" },
                          },
                        },
                        confidenceField({
                          en: "How sure the AI is, from 0 to 1.",
                          ar: "مدى ثقة الذكاء الاصطناعي، من 0 إلى 1.",
                        }),
                      ],
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
                      en: "The requested items the AI found, one line each.",
                      ar: "الأصناف المطلوبة التي وجدها الذكاء الاصطناعي، بند لكل صنف.",
                    },
                  },
                  fields: [
                    {
                      name: "description",
                      type: "text",
                      label: { en: "Description", ar: "الوصف" },
                      required: true,
                      admin: {
                        description: { en: "What the customer asked for.", ar: "ما طلبه العميل." },
                        placeholder: { en: "e.g. Fresh water hose 25 mm", ar: "مثال: خرطوم مياه عذبة 25 مم" },
                      },
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "brand",
                          type: "text",
                          label: { en: "Brand", ar: "العلامة التجارية" },
                          admin: {
                            description: {
                              en: "Brand named in the request.",
                              ar: "العلامة التجارية المذكورة في الطلب.",
                            },
                            placeholder: { en: "e.g. Gates", ar: "مثال: Gates" },
                          },
                        },
                        {
                          name: "partNo",
                          type: "text",
                          label: { en: "Part No", ar: "رقم القطعة" },
                          admin: {
                            description: { en: "Maker's part number, if given.", ar: "رقم قطعة المصنّع، إن ذُكر." },
                            placeholder: { en: "e.g. 7-11-10-8", ar: "مثال: 7-11-10-8" },
                          },
                        },
                        {
                          name: "impa",
                          type: "text",
                          label: { en: "Impa", ar: "رمز IMPA" },
                          admin: {
                            description: {
                              en: "IMPA code, the marine stores catalogue number.",
                              ar: "رمز IMPA، رقم كتالوج مستلزمات السفن.",
                            },
                            placeholder: { en: "e.g. 590312", ar: "مثال: 590312" },
                          },
                        },
                        {
                          name: "issa",
                          type: "text",
                          label: { en: "Issa", ar: "رمز ISSA" },
                          admin: {
                            description: {
                              en: "ISSA code, used for ship cleaning and chemicals.",
                              ar: "رمز ISSA، يُستخدم لمواد تنظيف السفن والكيماويات.",
                            },
                            placeholder: { en: "e.g. 75.110.01", ar: "مثال: 75.110.01" },
                          },
                        },
                        {
                          name: "qty",
                          type: "text",
                          label: { en: "Qty", ar: "الكمية" },
                          admin: {
                            description: {
                              en: "Quantity as written, before it is cleaned up.",
                              ar: "الكمية كما كُتبت، قبل تنقيحها.",
                            },
                            placeholder: { en: "e.g. 12", ar: "مثال: 12" },
                          },
                        },
                        {
                          name: "unit",
                          type: "text",
                          label: { en: "Unit", ar: "الوحدة" },
                          admin: {
                            description: { en: "Unit as written in the request.", ar: "الوحدة كما كُتبت في الطلب." },
                            placeholder: { en: "e.g. pcs", ar: "مثال: قطعة" },
                          },
                        },
                        {
                          name: "brandRule",
                          type: "select",
                          label: { en: "Brand Rule", ar: "قاعدة العلامة" },
                          options: [
                            { value: "Any", label: { en: "Any", ar: "أي علامة" } },
                            { value: "Preferred brand", label: { en: "Preferred brand", ar: "علامة مفضلة" } },
                            { value: "Exact brand", label: { en: "Exact brand", ar: "العلامة نفسها" } },
                          ],
                          admin: {
                            description: {
                              en: "How strictly the customer wants the brand.",
                              ar: "مدى تشدد العميل في العلامة التجارية.",
                            },
                            placeholder: words({ en: "Pick a rule", ar: "اختر قاعدة" }),
                          },
                          custom: {
                            about: {
                              en: "Exact brand means a different brand is a deviation the customer must accept.",
                              ar: "«العلامة نفسها» تعني أن أي علامة أخرى انحراف يجب أن يقبله العميل.",
                            },
                          },
                        },
                        confidenceField({
                          en: "How sure the AI is about this line, from 0 to 1.",
                          ar: "مدى ثقة الذكاء الاصطناعي بهذا البند، من 0 إلى 1.",
                        }),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "store",
                          type: "text",
                          label: { en: "Store", ar: "القسم" },
                          admin: {
                            description: {
                              en: "Ship store this item belongs to.",
                              ar: "قسم مستلزمات السفينة الذي ينتمي إليه الصنف.",
                            },
                            placeholder: { en: "e.g. Deck stores", ar: "مثال: مستلزمات سطح السفينة" },
                          },
                        },
                        {
                          name: "source",
                          type: "text",
                          label: { en: "Source attachment", ar: "المرفق المصدر" },
                          admin: {
                            description: {
                              en: "The attachment this line came from.",
                              ar: "المرفق الذي جاء منه هذا البند.",
                            },
                            placeholder: { en: "e.g. provisions-list.xlsx", ar: "مثال: provisions-list.xlsx" },
                          },
                        },
                        {
                          name: "flag",
                          type: "text",
                          label: { en: "Missing / unclear", ar: "ناقص / غير واضح" },
                          admin: {
                            description: {
                              en: "What is missing or unclear on this line.",
                              ar: "ما هو ناقص أو غير واضح في هذا البند.",
                            },
                            placeholder: { en: "e.g. No quantity given", ar: "مثال: لم تُذكر الكمية" },
                          },
                        },
                      ],
                    },
                    {
                      name: "originalText",
                      type: "text",
                      label: { en: "Original Text", ar: "النص الأصلي" },
                      admin: {
                        description: {
                          en: "The line exactly as the customer wrote it.",
                          ar: "البند كما كتبه العميل حرفيًا.",
                        },
                        placeholder: { en: "e.g. 12x hose 25mm gates", ar: "مثال: 12x hose 25mm gates" },
                      },
                    },
                  ],
                },
                {
                  name: "missing",
                  type: "array",
                  label: { en: "Missing", ar: "الناقص" },
                  admin: {
                    description: {
                      en: "Details still needed from the customer before pricing.",
                      ar: "تفاصيل لا تزال مطلوبة من العميل قبل التسعير.",
                    },
                  },
                  fields: [
                    {
                      name: "item",
                      type: "text",
                      label: { en: "Item", ar: "البند" },
                      localized: true,
                      required: true,
                      admin: {
                        description: { en: "One missing detail.", ar: "تفصيل واحد ناقص." },
                        placeholder: { en: "e.g. Vessel ETA", ar: "مثال: موعد وصول السفينة" },
                      },
                    },
                  ],
                },
                {
                  name: "clarification",
                  type: "textarea",
                  localized: true,
                  label: { en: "Drafted clarification request (not sent)", ar: "مسودة طلب توضيح (لم تُرسل)" },
                  admin: {
                    description: {
                      en: "A reply asking for the missing details. A person sends it.",
                      ar: "رد يطلب التفاصيل الناقصة. يرسله شخص.",
                    },
                    placeholder: {
                      en: "e.g. Could you confirm the vessel ETA and quantities?",
                      ar: "مثال: هل يمكنكم تأكيد موعد وصول السفينة والكميات؟",
                    },
                  },
                },
                {
                  name: "assignment",
                  type: "group",
                  label: { en: "Suggested by the assignment rules", ar: "مقترح من قواعد الإسناد" },
                  admin: {
                    description: {
                      en: "Who should handle the case, by the assignment rules.",
                      ar: "من يجب أن يتولى الملف، حسب قواعد الإسناد.",
                    },
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "owner",
                          type: "relationship",
                          label: { en: "Owner", ar: "المسؤول" },
                          relationTo: "users",
                          admin: {
                            description: { en: "Suggested case owner.", ar: "مالك الملف المقترح." },
                            placeholder: words({ en: "e.g. Karim Youssef", ar: "مثال: كريم يوسف" }),
                          },
                        },
                        {
                          name: "backup",
                          type: "relationship",
                          label: { en: "Backup", ar: "البديل" },
                          relationTo: "users",
                          admin: {
                            description: { en: "Covers when the owner is away.", ar: "يغطي عند غياب المالك." },
                            placeholder: words({ en: "e.g. Mona Adel", ar: "مثال: منى عادل" }),
                          },
                        },
                        {
                          name: "deadline",
                          type: "date",
                          label: { en: "Deadline", ar: "الموعد النهائي" },
                          admin: {
                            description: {
                              en: "When the quote should go out, by the rules.",
                              ar: "موعد إرسال العرض، حسب القواعد.",
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: "rule",
                      type: "text",
                      label: { en: "Rule", ar: "القاعدة" },
                      admin: {
                        description: { en: "The assignment rule that picked them.", ar: "قاعدة الإسناد التي اختارتهم." },
                        placeholder: { en: "e.g. Port Said vessels", ar: "مثال: سفن بورسعيد" },
                      },
                    },
                  ],
                },
                {
                  name: "acknowledgement",
                  type: "group",
                  label: { en: "Acknowledgement draft", ar: "مسودة الإشعار بالاستلام" },
                  admin: {
                    description: {
                      en: "A short receipt reply for the customer. Never sent without a person.",
                      ar: "رد قصير بالاستلام للعميل. لا يُرسل أبدًا دون شخص.",
                    },
                  },
                  fields: [
                    {
                      name: "subject",
                      type: "text",
                      label: { en: "Subject", ar: "الموضوع" },
                      localized: true,
                      admin: {
                        description: { en: "Subject of the receipt reply.", ar: "موضوع رد الاستلام." },
                        placeholder: {
                          en: "e.g. RE: RFQ for MV Nordic Tern",
                          ar: "مثال: RE: طلب عرض أسعار للسفينة MV Nordic Tern",
                        },
                      },
                    },
                    {
                      name: "body",
                      type: "textarea",
                      label: { en: "Body", ar: "النص" },
                      localized: true,
                      admin: {
                        description: { en: "Text of the receipt reply.", ar: "نص رد الاستلام." },
                        placeholder: {
                          en: "e.g. Thank you, we received your request and will quote shortly.",
                          ar: "مثال: شكرًا لكم، استلمنا طلبكم وسنرسل العرض قريبًا.",
                        },
                      },
                    },
                    {
                      name: "manual",
                      type: "checkbox",
                      label: {
                        en: "Owner sends it by hand (WhatsApp / phone)",
                        ar: "يرسله المالك يدويًا (واتساب / هاتف)",
                      },
                      admin: {
                        description: {
                          en: "Tick when the message came by WhatsApp or phone, so no email goes out.",
                          ar: "حدّد عندما تصل الرسالة عبر واتساب أو الهاتف، فلا يُرسل بريد.",
                        },
                      },
                    },
                  ],
                },
                {
                  name: "model",
                  type: "text",
                  label: { en: "Model", ar: "الموديل" },
                  admin: {
                    readOnly: true,
                    description: { en: "Model and version used.", ar: "النموذج والإصدار المستخدمان." },
                  },
                },
                {
                  name: "extractedAt",
                  type: "date",
                  label: { en: "Extracted At", ar: "تاريخ الاستخراج" },
                  admin: {
                    readOnly: true,
                    description: {
                      en: "When the AI last read this message.",
                      ar: "آخر مرة قرأ فيها الذكاء الاصطناعي هذه الرسالة.",
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
      name: "classification",
      type: "select",
      label: { en: "Classification", ar: "التصنيف" },
      options: [
        { value: "New RFQ", label: { en: "New RFQ", ar: "طلب عرض جديد" } },
        { value: "Supplier reply", label: { en: "Supplier reply", ar: "رد مورّد" } },
        { value: "Service request", label: { en: "Service request", ar: "طلب خدمة" } },
        { value: "Duplicate", label: { en: "Duplicate", ar: "مكرر" } },
        { value: "Customer reply", label: { en: "Customer reply", ar: "رد عميل" } },
        { value: "Not an RFQ", label: { en: "Not an RFQ", ar: "ليس طلب عرض" } },
      ],
      admin: {
        position: "sidebar",
        description: { en: "What the AI decided this message is.", ar: "ما صنّف به الذكاء الاصطناعي هذه الرسالة." },
        placeholder: words({ en: "Pick a class", ar: "اختر تصنيفًا" }),
      },
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      required: true,
      defaultValue: "New",
      options: [
        { value: "New", label: { en: "New", ar: "جديد" } },
        { value: "Needs review", label: { en: "Needs review", ar: "يحتاج مراجعة" } },
        { value: "Linked", label: { en: "Linked", ar: "مرتبطة" } },
        { label: { en: "Linked · case created", ar: "مرتبطة · أُنشئ ملف" }, value: "Case created" },
        { label: { en: "Not related", ar: "غير مرتبطة" }, value: "Ignored" },
      ],
      custom: tones({
        New: "info",
        "Needs review": "warning",
        Linked: "success",
        "Case created": "success",
        Ignored: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: { en: "Where the message is in triage.", ar: "موقع الرسالة في الفرز." },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    {
      name: "match",
      type: "group",
      label: { en: "Match", ar: "المطابقة" },
      admin: {
        position: "sidebar",
        description: {
          en: "Which case and supplier RFQ this message belongs to.",
          ar: "الملف وطلب عرض المورّد اللذان تخصهما هذه الرسالة.",
        },
      },
      fields: [
        {
          name: "case",
          type: "relationship",
          label: { en: "Case", ar: "الملف" },
          relationTo: "cases",
          admin: {
            description: { en: "The case the message was linked to.", ar: "الملف الذي رُبطت به الرسالة." },
            placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
          },
        },
        {
          name: "supplierRfq",
          type: "relationship",
          label: { en: "Supplier Rfq", ar: "طلب عرض المورّد" },
          relationTo: "supplier-rfqs",
          admin: {
            description: { en: "The supplier RFQ a reply answers.", ar: "طلب عرض المورّد الذي يجيب عنه الرد." },
            placeholder: words({ en: "e.g. GS-SRFQ-0142-A", ar: "مثال: GS-SRFQ-0142-A" }),
          },
        },
        {
          name: "reference",
          type: "text",
          label: { en: "Reference found", ar: "المرجع الموجود" },
          admin: {
            description: {
              en: "A case or RFQ reference quoted in the message.",
              ar: "مرجع ملف أو طلب عرض مذكور في الرسالة.",
            },
            placeholder: { en: "e.g. GS-SRFQ-0142-A", ar: "مثال: GS-SRFQ-0142-A" },
          },
        },
        confidenceField({
          en: "How sure the AI is about the match, from 0 to 1.",
          ar: "مدى ثقة الذكاء الاصطناعي بالمطابقة، من 0 إلى 1.",
        }),
        percentOf("match.confidencePct", { en: "Match confidence", ar: "ثقة المطابقة" }),
        {
          name: "basis",
          type: "textarea",
          localized: true,
          label: { en: "Why it matched", ar: "سبب المطابقة" },
          admin: {
            description: {
              en: "The reason the AI gave for the match.",
              ar: "السبب الذي قدّمه الذكاء الاصطناعي للمطابقة.",
            },
            placeholder: { en: "e.g. Subject quotes GS-SRFQ-0142-A.", ar: "مثال: الموضوع يذكر GS-SRFQ-0142-A." },
          },
        },
        {
          name: "candidates",
          type: "array",
          label: { en: "Candidates", ar: "المرشحون" },
          admin: {
            description: {
              en: "Cases it might belong to, when the match is unsure.",
              ar: "الملفات التي قد تتبعها، عندما تكون المطابقة غير مؤكدة.",
            },
          },
          custom: {
            about: {
              en: "Below 85% confidence nothing is linked by itself. A person picks the case in the review queue.",
              ar: "تحت ثقة 85% لا يُربط شيء تلقائيًا. يختار شخص الملف في قائمة المراجعة.",
            },
          },
          fields: [
            {
              name: "case",
              type: "relationship",
              label: { en: "Case", ar: "الملف" },
              relationTo: "cases",
              required: true,
              admin: {
                description: { en: "A case this message could belong to.", ar: "ملف قد تتبعه هذه الرسالة." },
                placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
              },
            },
            confidenceField({
              en: "How sure the AI is about this case, from 0 to 1.",
              ar: "مدى ثقة الذكاء الاصطناعي بهذا الملف، من 0 إلى 1.",
            }),
            {
              name: "reason",
              type: "text",
              label: { en: "Reason", ar: "السبب" },
              localized: true,
              admin: {
                description: { en: "Why this case is a candidate.", ar: "سبب ترشيح هذا الملف." },
                placeholder: { en: "e.g. Same vessel and port", ar: "مثال: السفينة والميناء نفسهما" },
              },
            },
          ],
        },
        {
          name: "reviewedBy",
          type: "relationship",
          label: { en: "Reviewed By", ar: "راجعه" },
          relationTo: "users",
          admin: {
            description: { en: "Who made the review decision.", ar: "من اتخذ قرار المراجعة." },
            placeholder: words({ en: "e.g. Karim Youssef", ar: "مثال: كريم يوسف" }),
          },
        },
        {
          name: "reviewedAt",
          type: "date",
          label: { en: "Reviewed At", ar: "تاريخ المراجعة" },
          admin: { description: { en: "When the review decision was made.", ar: "وقت اتخاذ قرار المراجعة." } },
        },
      ],
    },
    computed(
      {
        name: "candidates",
        type: "array",
        label: { en: "Candidate cases", ar: "الملفات المرشحة" },
        admin: {
          position: "sidebar",
          description: {
            en: "Cases to link the message to, each with its confidence.",
            ar: "ملفات يمكن ربط الرسالة بها، مع ثقة كل منها.",
          },
          condition: (data) => Boolean(data?.match?.candidates?.length),
        },
        fields: [
          {
            name: "case",
            type: "relationship",
            label: { en: "Case", ar: "الملف" },
            relationTo: "cases",
            admin: {
              description: { en: "A case this message could belong to.", ar: "ملف قد تتبعه هذه الرسالة." },
              placeholder: words({ en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" }),
            },
          },
          {
            name: "confidence",
            type: "number",
            label: { en: "Confidence", ar: "الثقة" },
            admin: {
              description: {
                en: "How sure the AI is about this case, from 0 to 1.",
                ar: "مدى ثقة الذكاء الاصطناعي بهذا الملف، من 0 إلى 1.",
              },
              placeholder: { en: "e.g. 0.72", ar: "مثال: 0.72" },
            },
          },
          {
            name: "confidencePct",
            type: "number",
            label: { en: "Confidence", ar: "الثقة" },
            admin: {
              description: { en: "The same confidence as a percentage.", ar: "الثقة نفسها كنسبة مئوية." },
              placeholder: { en: "e.g. 72", ar: "مثال: 72" },
            },
            custom: formats.percent(0),
          },
          {
            name: "reason",
            type: "text",
            label: { en: "Reason", ar: "السبب" },
            localized: true,
            admin: {
              description: { en: "Why this case is a candidate.", ar: "سبب ترشيح هذا الملف." },
              placeholder: { en: "e.g. Same vessel and port", ar: "مثال: السفينة والميناء نفسهما" },
            },
          },
        ],
      },
      (m) =>
        (
          ((m.match as Record<string, unknown> | undefined)?.candidates as Record<string, unknown>[] | undefined) ?? []
        ).map((c) => ({
          ...c,
          confidencePct: typeof c.confidence === "number" ? Math.round(c.confidence * 100) : undefined,
        })),
    ),
    computed(
      {
        name: "uncertain",
        type: "textarea",
        label: { en: "To confirm", ar: "للتأكيد" },
        admin: {
          position: "sidebar",
          description: {
            en: "What a person should confirm in the offer read from the reply.",
            ar: "ما يجب أن يؤكده شخص في العرض المقروء من الرد.",
          },
        },
        custom: { toneWhen: [{ when: {}, tone: "warning" }] },
      },
      (m) =>
        ((m.offerDraft as { uncertain?: unknown }[] | undefined) ?? [])
          .map((d) => scalar(d.uncertain))
          .filter(Boolean)
          .join("\n"),
    ),
    {
      name: "offerDraft",
      type: "array",
      label: { en: "Offer Draft", ar: "مسودة العرض" },
      labels: {
        singular: { en: "Offer line", ar: "بند العرض" },
        plural: { en: "Offer read from the reply", ar: "العرض المقروء من الرد" },
      },
      admin: {
        position: "sidebar",
        description: {
          en: "Supplier offer lines read from a reply, saved as offers once matched.",
          ar: "بنود عرض المورّد المقروءة من الرد، تُحفظ كعروض بعد مطابقتها.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              label: { en: "Line No", ar: "رقم البند" },
              required: true,
              min: 1,
              admin: {
                description: { en: "The RFQ line this price answers.", ar: "بند طلب العرض الذي يجيب عنه هذا السعر." },
                placeholder: { en: "e.g. 3", ar: "مثال: 3" },
              },
            },
            {
              name: "price",
              type: "number",
              label: { en: "Price", ar: "السعر" },
              min: 0,
              access: { read: costVisible },
              admin: {
                description: { en: "The supplier's price per pack, as read.", ar: "سعر المورّد للعبوة، كما قُرئ." },
                placeholder: { en: "e.g. 1250", ar: "مثال: 1250" },
              },
            },
            {
              name: "currency",
              type: "select",
              label: { en: "Currency", ar: "العملة" },
              options: CURRENCIES,
              defaultValue: "EGP",
              admin: {
                description: { en: "Currency the supplier quoted in.", ar: "العملة التي سعّر بها المورّد." },
                placeholder: words({ en: "Pick a currency", ar: "اختر عملة" }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "packs",
              type: "number",
              label: { en: "Packs", ar: "العبوات" },
              min: 0,
              admin: {
                description: { en: "How many packs the supplier offers.", ar: "عدد العبوات التي يعرضها المورّد." },
                placeholder: { en: "e.g. 12", ar: "مثال: 12" },
              },
            },
            {
              name: "packSize",
              type: "number",
              label: { en: "Pack Size", ar: "حجم العبوة" },
              min: 0,
              admin: {
                description: { en: "Base units in one pack.", ar: "الوحدات الأساسية في العبوة الواحدة." },
                placeholder: { en: "e.g. 100", ar: "مثال: 100" },
              },
            },
            {
              name: "packLabel",
              type: "text",
              label: { en: "Pack Label", ar: "وصف العبوة" },
              admin: {
                description: { en: "How the pack is described.", ar: "وصف العبوة." },
                placeholder: { en: "e.g. 100 × 500 ml", ar: "مثال: 100 × 500 مل" },
              },
            },
            {
              name: "leadDays",
              type: "number",
              label: { en: "Lead Days", ar: "مدة التوريد (أيام)" },
              min: 0,
              admin: {
                description: { en: "Days from order to delivery.", ar: "الأيام من الطلب حتى التسليم." },
                placeholder: { en: "e.g. 5", ar: "مثال: 5" },
              },
            },
            {
              name: "validDays",
              type: "number",
              label: { en: "Valid Days", ar: "مدة الصلاحية (أيام)" },
              min: 0,
              admin: {
                description: { en: "Days the price stays valid.", ar: "أيام صلاحية السعر." },
                placeholder: { en: "e.g. 14", ar: "مثال: 14" },
              },
            },
          ],
        },
        {
          name: "offeredDescription",
          type: "text",
          label: { en: "Offered Description", ar: "الوصف المعروض" },
          admin: {
            description: { en: "The item as the supplier describes it.", ar: "الصنف كما يصفه المورّد." },
            placeholder: { en: "e.g. Gates hose 25 mm, 10 m", ar: "مثال: خرطوم Gates 25 مم، 10 م" },
          },
        },
        {
          name: "uncertain",
          type: "text",
          label: { en: "What a person should confirm", ar: "ما يجب أن يؤكده شخص" },
          admin: {
            description: {
              en: "What the AI was unsure about on this line.",
              ar: "ما لم يكن الذكاء الاصطناعي متأكدًا منه في هذا البند.",
            },
            placeholder: { en: "e.g. Is the price per pack or per unit?", ar: "مثال: هل السعر للعبوة أم للوحدة؟" },
          },
        },
        confidenceField({
          en: "How sure the AI is about this line, from 0 to 1.",
          ar: "مدى ثقة الذكاء الاصطناعي بهذا البند، من 0 إلى 1.",
        }),
      ],
    },
    {
      name: "source",
      type: "select",
      label: { en: "Source", ar: "المصدر" },
      defaultValue: "Live",
      options: [
        { value: "Live", label: { en: "Live", ar: "مباشر" } },
        { value: "History import", label: { en: "History import", ar: "استيراد السجل" } },
      ],
      admin: {
        position: "sidebar",
        description: {
          en: "History import means a past email organised by the inbox-history import.",
          ar: "«استيراد السجل» يعني بريدًا سابقًا نظّمه استيراد سجل الوارد.",
        },
        placeholder: words({ en: "Pick a source", ar: "اختر مصدرًا" }),
      },
    },
    {
      name: "history",
      type: "group",
      label: { en: "History import review", ar: "مراجعة استيراد السجل" },
      admin: {
        position: "sidebar",
        description: {
          en: "What the import found in a past email, for a person to confirm.",
          ar: "ما وجده الاستيراد في بريد سابق، ليؤكده شخص.",
        },
        condition: (data) => data?.source === "History import",
      },
      fields: [
        {
          name: "kind",
          type: "select",
          label: { en: "Kind", ar: "النوع" },
          options: [
            { value: "Customer", label: { en: "Customer", ar: "العميل" } },
            { value: "Vessel", label: { en: "Vessel", ar: "السفينة" } },
            { value: "Supplier", label: { en: "Supplier", ar: "المورّد" } },
            { value: "Price", label: { en: "Price", ar: "السعر" } },
            { value: "Confidential", label: { en: "Confidential", ar: "سري" } },
          ],
          admin: {
            description: { en: "What kind of fact the import found.", ar: "نوع المعلومة التي وجدها الاستيراد." },
            placeholder: words({ en: "Pick a kind", ar: "اختر نوعًا" }),
          },
          custom: tones({
            Customer: "neutral",
            Vessel: "info",
            Supplier: "info",
            Price: "warning",
            Confidential: "error",
          }),
        },
        {
          name: "question",
          type: "text",
          label: { en: "Question", ar: "السؤال" },
          localized: true,
          admin: {
            description: {
              en: "What the import is asking a person to check.",
              ar: "ما يطلب الاستيراد من شخص التحقق منه.",
            },
            placeholder: { en: "e.g. Is Delta Marine Stores a supplier?", ar: "مثال: هل Delta Marine Stores مورّد؟" },
          },
        },
        {
          name: "proposal",
          type: "text",
          label: { en: "Proposal", ar: "الاقتراح" },
          localized: true,
          admin: {
            description: { en: "What the import proposes to record.", ar: "ما يقترح الاستيراد تسجيله." },
            placeholder: {
              en: "e.g. Add Delta Marine Stores as supplier",
              ar: "مثال: إضافة Delta Marine Stores كمورّد",
            },
          },
        },
        confidenceField({ en: "How sure the import is, from 0 to 1.", ar: "مدى ثقة الاستيراد، من 0 إلى 1." }),
        percentOf(),
        {
          name: "decision",
          type: "select",
          label: { en: "Decision", ar: "القرار" },
          options: [
            { value: "Confirmed", label: { en: "Confirmed", ar: "مؤكد" } },
            { value: "Rejected", label: { en: "Rejected", ar: "مرفوض" } },
          ],
          admin: {
            description: { en: "A person's decision on the proposal.", ar: "قرار شخص بشأن الاقتراح." },
            placeholder: words({ en: "Pick a decision", ar: "اختر قرارًا" }),
          },
          custom: tones({ Confirmed: "success", Rejected: "neutral" }),
        },
        {
          name: "locked",
          type: "checkbox",
          label: { en: "Import approved", ar: "تمت الموافقة على الاستيراد" },
          virtual: true,
          admin: {
            readOnly: true,
            description: {
              en: "Once management approves the import, decisions are final.",
              ar: "بعد موافقة الإدارة على الاستيراد، تصبح القرارات نهائية.",
            },
          },
          hooks: { afterRead: [({ req }: { req: PayloadRequest }) => historyApproved(req)] },
        },
      ],
    },
    computed(
      {
        name: "via",
        type: "text",
        label: { en: "Channel", ar: "القناة" },
        admin: { position: "sidebar", description: { en: "Where the message came from.", ar: "مصدر الرسالة." } },
      },
      (m, req) => {
        const mailbox = scalar(m.mailbox);
        if (m.channel === "Email") return mailbox.startsWith("Gmail") ? mailbox : `Outlook · ${mailbox || "sales@"}`;
        if (m.channel === "Website form")
          return inLanguage(req, { en: "Website quick-quote form", ar: "نموذج طلب عرض سريع على الموقع" });
        return inLanguage(req, CHANNEL_WORDS[scalar(m.channel)] ?? { en: scalar(m.channel), ar: scalar(m.channel) });
      },
    ),
    computed(
      {
        name: "fileCount",
        type: "text",
        label: { en: "Files", ar: "الملفات" },
        admin: {
          position: "sidebar",
          description: { en: "How many files came with it.", ar: "عدد الملفات المرفقة بها." },
        },
      },
      (m, req) => {
        const n = ((m.files as unknown[] | undefined) ?? []).length;
        const ar = n === 1 ? "ملف واحد" : n === 2 ? "ملفان" : n <= 10 ? `${n} ملفات` : `${n} ملفًا`;
        return n ? inLanguage(req, { en: `${n} file${n === 1 ? "" : "s"}`, ar }) : "";
      },
    ),
    {
      name: "urgency",
      type: "number",
      label: { en: "Urgency", ar: "الأولوية" },
      min: 1,
      max: 5,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "How urgent it reads, from 1 to 5, by its words and status.",
          ar: "درجة استعجالها، من 1 إلى 5، حسب كلماتها وحالتها.",
        },
      },
    },
    computed(
      {
        name: "urgencyTag",
        type: "text",
        label: { en: "Urgency", ar: "الاستعجال" },
        admin: { hidden: true },
        custom: { toneWhen: [{ when: { urgency: { greater_than_equal: 4 } }, tone: "warning" }] },
      },
      (m, req) =>
        Number(m.urgency) >= 3
          ? inLanguage(req, { en: `Urgency ${Number(m.urgency)}/5`, ar: `الاستعجال ${Number(m.urgency)}/5` })
          : "",
    ),
    {
      name: "createdCase",
      type: "relationship",
      label: { en: "Created Case", ar: "الملف المُنشأ" },
      relationTo: "cases",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "The case built from this message, if any.", ar: "الملف المنشأ من هذه الرسالة، إن وُجد." },
      },
    },
    {
      name: "acknowledgedAt",
      type: "date",
      label: { en: "Acknowledged At", ar: "تاريخ الإقرار" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "Set once, so a customer is never acknowledged twice.",
          ar: "يُضبط مرة واحدة، فلا يُشعَر العميل بالاستلام مرتين.",
        },
      },
    },
  ],
};

export const SupplierRfqs: CollectionConfig = {
  slug: "supplier-rfqs",
  labels: {
    singular: { en: "Supplier RFQ", ar: "طلب عرض مورّد" },
    plural: { en: "Supplier RFQs", ar: "طلبات عروض الموردين" },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Remind now", ar: "ذكّر الآن" }),
        roles: SOURCING_ROLES,
        when: {
          status: { in: OPEN_RFQ_STATUSES },
          or: [{ reminders: { less_than: 1 } }, { reminders: { exists: false } }],
        },
        call: { path: "/sourcing/rfqs/$row.id/remind" },
        confirm: {
          heading: words({ en: "Send a reminder to $row.supplier.name?", ar: "إرسال تذكير إلى $row.supplier.name؟" }),
          text: words({
            en: "Reminder 1 for $row.reference goes to the supplier now, from the approved template (client hidden).",
            ar: "يُرسل التذكير 1 لـ $row.reference إلى المورّد الآن، من القالب المعتمد (مع إخفاء العميل).",
          }),
          label: words({ en: "Send reminder", ar: "إرسال التذكير" }),
        },
        done: words({ en: "$row.reference: Reminder 1 sent", ar: "$row.reference: أُرسل التذكير 1" }),
      },
      {
        label: words({ en: "Remind now", ar: "ذكّر الآن" }),
        roles: SOURCING_ROLES,
        when: {
          status: { in: OPEN_RFQ_STATUSES },
          reminders: { greater_than_equal: 1 },
          or: [{ escalated: { not_equals: true } }, { reminders: { less_than: REMINDERS } }],
        },
        call: { path: "/sourcing/rfqs/$row.id/remind" },
        done: words({ en: "$row.reference: escalated to the case owner", ar: "$row.reference: صُعّد إلى مالك الملف" }),
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "case", "supplier", "status", "dueAt", "reminders"],
    group: { en: "Sourcing desk", ar: "مكتب التوريد" },
  },
  defaultSort: "dueAt",
  access: deskAccess,
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data || data.reference || !data.case) return data;
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
          collection: "supplier-rfqs" as never,
          where: { case: { equals: idOf(data.case) } },
        });
        const n = String(c.caseId ?? "").replace(/\D/g, "");
        return { ...data, reference: `GS-SRFQ-${n}-${String.fromCharCode(65 + totalDocs)}` };
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (["Replied", "Revised offer received", "Declined"].includes(String(data.status))) data.nextReminderAt = null;
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: {
              en: `${doc.reference}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
              ar: `${doc.reference}: ${RFQ_STATUS_AR[previousDoc?.status] ?? previousDoc?.status ?? "—"} ← ${RFQ_STATUS_AR[doc.status] ?? doc.status}.`,
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
          name: "reference",
          type: "text",
          label: { en: "Reference", ar: "المرجع" },
          unique: true,
          admin: {
            readOnly: true,
            description: { en: "Numbered per case, such as GS-SRFQ-0142-A.", ar: "مرقّم لكل ملف، مثل GS-SRFQ-0142-A." },
          },
        },
        caseRef(true, {
          hint: { en: "The customer case this supplier request is for.", ar: "ملف العميل الذي يخصه طلب المورّد هذا." },
        }),
        {
          name: "supplier",
          type: "relationship",
          label: { en: "Supplier", ar: "المورّد" },
          relationTo: "suppliers",
          required: true,
          admin: {
            description: { en: "The supplier asked to quote.", ar: "المورّد المطلوب منه التسعير." },
            placeholder: words({ en: "e.g. Delta Marine Stores", ar: "مثال: Delta Marine Stores" }),
          },
        },
      ],
    },
    {
      name: "lineNos",
      type: "number",
      hasMany: true,
      label: { en: "Lines included", ar: "البنود المشمولة" },
      required: true,
      admin: {
        description: { en: "Case line numbers sent to this supplier.", ar: "أرقام بنود الملف المرسلة إلى هذا المورّد." },
        placeholder: { en: "e.g. 1, 2, 5", ar: "مثال: 1، 2، 5" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "sentAt",
          type: "date",
          label: { en: "Sent At", ar: "تاريخ الإرسال" },
          admin: {
            description: { en: "When the request went to the supplier.", ar: "وقت إرسال الطلب إلى المورّد." },
            date: { pickerAppearance: "dayAndTime" },
          },
        },
        {
          name: "dueAt",
          type: "date",
          label: { en: "Due At", ar: "موعد الاستحقاق" },
          required: true,
          admin: {
            description: { en: "When we need the supplier's answer by.", ar: "الموعد الذي نحتاج فيه رد المورّد." },
            date: { pickerAppearance: "dayAndTime" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "reminders",
          type: "number",
          label: { en: "Reminders", ar: "التذكيرات" },
          min: 0,
          defaultValue: 0,
          admin: {
            description: { en: "How many reminders went to the supplier.", ar: "عدد التذكيرات المرسلة إلى المورّد." },
            placeholder: { en: "e.g. 1", ar: "مثال: 1" },
          },
          custom: {
            about: {
              en: "Two reminders go out. After that the case owner is alerted.",
              ar: "يُرسل تذكيران. بعد ذلك يُنبَّه مالك الملف.",
            },
          },
        },
        {
          name: "nextReminderAt",
          type: "date",
          label: { en: "Next Reminder At", ar: "موعد التذكير التالي" },
          admin: { description: { en: "When the next reminder is due.", ar: "موعد التذكير التالي." } },
        },
        {
          name: "escalated",
          type: "checkbox",
          label: { en: "Escalated", ar: "مُصعَّد" },
          defaultValue: false,
          admin: {
            description: { en: "Ticked once the case owner has been alerted.", ar: "يُحدَّد بعد تنبيه مالك الملف." },
          },
        },
        computed(
          {
            name: "reminderState",
            type: "text",
            label: { en: "Reminders", ar: "التذكيرات" },
            admin: { description: { en: "Reminders sent and what comes next.", ar: "التذكيرات المرسلة وما يليها." } },
          },
          reminderState,
        ),
      ],
    },
    {
      name: "lastEvent",
      type: "text",
      localized: true,
      label: { en: "Latest", ar: "الأحدث" },
      admin: {
        description: { en: "The most recent thing that happened on this request.", ar: "آخر ما حدث في هذا الطلب." },
        placeholder: { en: "e.g. Supplier replied by email", ar: "مثال: ردّ المورّد بالبريد" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "mode",
          type: "select",
          label: { en: "Mode", ar: "الوضع" },
          options: [
            { value: "Split by category", label: { en: "Split by category", ar: "مقسّم حسب الفئة" } },
            { value: "Full list", label: { en: "Full list", ar: "القائمة كاملة" } },
          ],
          defaultValue: "Split by category",
          admin: {
            description: {
              en: "Whether the supplier gets the whole list or only their category.",
              ar: "هل يستلم المورّد القائمة كاملة أم فئته فقط.",
            },
            placeholder: words({ en: "Pick a mode", ar: "اختر طريقة" }),
          },
        },
        {
          name: "category",
          type: "text",
          label: { en: "Category", ar: "الفئة" },
          admin: {
            description: { en: "The category this supplier was asked for.", ar: "الفئة المطلوبة من هذا المورّد." },
            placeholder: { en: "e.g. Deck stores", ar: "مثال: مستلزمات سطح السفينة" },
          },
        },
      ],
    },
    {
      name: "supplierQuestion",
      type: "textarea",
      label: { en: "Supplier Question", ar: "سؤال المورّد" },
      localized: true,
      admin: {
        description: { en: "What the supplier asked us to clarify.", ar: "ما طلب المورّد منا توضيحه." },
        placeholder: { en: "e.g. Is the hose with or without couplings?", ar: "مثال: هل الخرطوم مع الوصلات أم بدونها؟" },
        condition: (_, s) => s?.status === "Clarification needed",
      },
    },
    {
      name: "anonymised",
      type: "checkbox",
      label: { en: "Client identity & attachments removed", ar: "حُذفت هوية العميل والمرفقات" },
      defaultValue: true,
      admin: {
        description: {
          en: "Always on. The supplier never sees who the customer is.",
          ar: "مفعّل دائمًا. لا يرى المورّد هوية العميل أبدًا.",
        },
      },
      validate: (v: unknown) => v === true || "Supplier RFQs never carry the client's identity.",
    },
    {
      name: "status",
      type: "select",
      label: { en: "Status", ar: "الحالة" },
      required: true,
      defaultValue: "Draft",
      options: SUPPLIER_RFQ_STATUS_OPTIONS,
      custom: tones({
        Draft: "neutral",
        Sent: "info",
        "Awaiting reply": "warning",
        "Partial reply": "warning",
        "Clarification needed": "warning",
        Escalated: "error",
        Replied: "success",
        "Revised offer received": "success",
        Declined: "neutral",
        "No response": "error",
      }),
      admin: {
        position: "sidebar",
        description: { en: "Where the request stands with the supplier.", ar: "موقف الطلب لدى المورّد." },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
    },
    {
      name: "sentBy",
      type: "relationship",
      label: { en: "Sent By", ar: "أرسله" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: { en: "Who sent the request.", ar: "من أرسل الطلب." },
        placeholder: words({ en: "e.g. Karim Youssef", ar: "مثال: كريم يوسف" }),
      },
    },
  ],
};

export const Offers: CollectionConfig = {
  slug: "offers",
  labels: { singular: { en: "Offer", ar: "عرض" }, plural: { en: "Offers", ar: "العروض" } },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "case", "lineNo", "supplier", "price", "currency", "leadDays", "compliance"],
    group: { en: "Sourcing desk", ar: "مكتب التوريد" },
  },
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        const sup = data.supplier
          ? ((await req.payload
              .findByID({ collection: "suppliers", id: String(idOf(data.supplier)), depth: 0 })
              .catch(() => null)) as { name?: string } | null)
          : null;
        data.label = `L${data.lineNo ?? "?"} · ${sup?.name ?? "Supplier"} v${data.version ?? 1}`;
        if (operation === "create" && data.supersedes) {
          await req.payload.update({
            collection: "offers" as never,
            id: String(idOf(data.supersedes)),
            data: { superseded: true } as never,
            req,
          });
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create" || req.context?.seed || doc.source === "Own stock") return doc;
        await req.payload
          .create({
            collection: "supplier-prices" as never,
            data: {
              supplier: idOf(doc.supplier),
              product: idOf(doc.product),
              description: doc.offeredDescription,
              price: doc.price,
              currency: doc.currency,
              per: doc.packLabel ?? "EA",
              quotedAt: new Date().toISOString(),
              validUntil: doc.validUntil,
              source:
                doc.source === "Agency pricelist"
                  ? "Agency pricelist"
                  : doc.source === "WhatsApp / phone"
                    ? "WhatsApp / phone"
                    : "Case offer",
              case: idOf(doc.case),
            } as never,
            req,
          })
          .catch(() => undefined);
        return doc;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", label: { en: "Label", ar: "التسمية" }, admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(true, { hint: { en: "The customer case this offer prices.", ar: "ملف العميل الذي يسعّره هذا العرض." } }),
        {
          name: "lineNo",
          type: "number",
          required: true,
          min: 1,
          label: { en: "Line #", ar: "رقم البند" },
          admin: {
            description: { en: "The case line this offer answers.", ar: "بند الملف الذي يجيب عنه هذا العرض." },
            placeholder: { en: "e.g. 3", ar: "مثال: 3" },
          },
        },
        {
          name: "supplierRfq",
          type: "relationship",
          label: { en: "Supplier Rfq", ar: "طلب عرض المورّد" },
          relationTo: "supplier-rfqs",
          admin: {
            description: {
              en: "The supplier request this offer replies to.",
              ar: "طلب المورّد الذي يردّ عليه هذا العرض.",
            },
            placeholder: words({ en: "e.g. GS-SRFQ-0142-A", ar: "مثال: GS-SRFQ-0142-A" }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "supplier",
          type: "relationship",
          label: { en: "Supplier", ar: "المورّد" },
          relationTo: "suppliers",
          required: true,
          admin: {
            description: { en: "Who made the offer.", ar: "من قدّم العرض." },
            placeholder: words({ en: "e.g. Delta Marine Stores", ar: "مثال: Delta Marine Stores" }),
          },
        },
        {
          name: "product",
          type: "relationship",
          label: { en: "Product", ar: "المنتج" },
          relationTo: "products",
          admin: {
            description: {
              en: "The catalogue product this matches, if known.",
              ar: "منتج الكتالوج المطابق، إن كان معروفًا.",
            },
            placeholder: words({ en: "Search products", ar: "ابحث في المنتجات" }),
          },
        },
        {
          name: "version",
          type: "number",
          label: { en: "Version", ar: "الإصدار" },
          min: 1,
          defaultValue: 1,
          admin: {
            description: { en: "Revision number, 1 for the first offer.", ar: "رقم المراجعة، 1 للعرض الأول." },
            placeholder: { en: "e.g. 1", ar: "مثال: 1" },
          },
        },
        {
          name: "supersedes",
          type: "relationship",
          label: { en: "Supersedes", ar: "يحل محل" },
          relationTo: "offers",
          admin: {
            description: {
              en: "The earlier offer this revision replaces.",
              ar: "العرض السابق الذي تحل محله هذه المراجعة.",
            },
            placeholder: words({ en: "Search offers", ar: "ابحث في العروض" }),
          },
          custom: {
            about: {
              en: "A revision replaces the earlier offer, which is kept for audit and marked superseded.",
              ar: "تحل المراجعة محل العرض السابق، الذي يُحفظ للتدقيق ويُعلَّم بأنه مُستبدَل.",
            },
          },
        },
      ],
    },
    {
      name: "offeredDescription",
      type: "text",
      label: { en: "As offered (brand / part / spec)", ar: "كما عُرض (العلامة / القطعة / المواصفات)" },
      admin: {
        description: { en: "The item as the supplier describes it.", ar: "الصنف كما يصفه المورّد." },
        placeholder: { en: "e.g. Gates hose 25 mm, 10 m", ar: "مثال: خرطوم Gates 25 مم، 10 م" },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          label: { en: "Price per pack", ar: "سعر العبوة" },
          access: { read: costVisible },
          admin: {
            description: {
              en: "The supplier's price for one pack, before freight.",
              ar: "سعر المورّد للعبوة الواحدة، قبل الشحن.",
            },
            placeholder: { en: "e.g. 1250", ar: "مثال: 1250" },
          },
        },
        {
          name: "currency",
          type: "select",
          label: { en: "Currency", ar: "العملة" },
          options: CURRENCIES,
          required: true,
          defaultValue: "EGP",
          admin: {
            description: { en: "Currency the supplier quoted in.", ar: "العملة التي سعّر بها المورّد." },
            placeholder: words({ en: "Pick a currency", ar: "اختر عملة" }),
          },
        },
        {
          name: "discountPct",
          type: "number",
          label: { en: "Discount Pct", ar: "نسبة الخصم" },
          min: 0,
          max: 100,
          admin: {
            description: {
              en: "Discount the supplier gave, in percent.",
              ar: "الخصم الذي منحه المورّد، بالنسبة المئوية.",
            },
            placeholder: { en: "e.g. 5", ar: "مثال: 5" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "packs",
          type: "number",
          required: true,
          min: 0,
          label: { en: "Packs offered", ar: "العبوات المعروضة" },
          admin: {
            description: {
              en: "How many packs the supplier can supply.",
              ar: "عدد العبوات التي يستطيع المورّد توريدها.",
            },
            placeholder: { en: "e.g. 12", ar: "مثال: 12" },
          },
        },
        {
          name: "packSize",
          type: "number",
          min: 0,
          defaultValue: 1,
          label: { en: "Base units per pack", ar: "الوحدات الأساسية في كل عبوة" },
          admin: {
            description: {
              en: "Units in one pack, to compare with the quantity asked.",
              ar: "الوحدات في العبوة الواحدة، للمقارنة بالكمية المطلوبة.",
            },
            placeholder: { en: "e.g. 100", ar: "مثال: 100" },
          },
        },
        {
          name: "packLabel",
          type: "text",
          label: { en: "Pack Label", ar: "وصف العبوة" },
          admin: {
            description: { en: "How the pack is described by the supplier.", ar: "وصف المورّد للعبوة." },
            placeholder: { en: "100 × 500 ml", ar: "100 × 500 مل" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "leadDays",
          type: "number",
          min: 0,
          required: true,
          label: { en: "Lead time (days)", ar: "مدة التوريد (أيام)" },
          admin: {
            description: {
              en: "Days from order to delivery. Checked against the vessel ETA.",
              ar: "الأيام من الطلب حتى التسليم. تُقارن بموعد وصول السفينة.",
            },
            placeholder: { en: "e.g. 5", ar: "مثال: 5" },
          },
        },
        {
          name: "validUntil",
          type: "date",
          label: { en: "Valid Until", ar: "ساري حتى" },
          admin: { description: { en: "The last day the price holds.", ar: "آخر يوم يسري فيه السعر." } },
        },
        {
          name: "expiry",
          type: "text",
          label: { en: "Batch expiry (YYYY-MM)", ar: "انتهاء الدفعة (YYYY-MM)" },
          admin: {
            description: {
              en: "Expiry of the batch offered, for shelf life checks.",
              ar: "انتهاء صلاحية الدفعة المعروضة، لفحص مدة الصلاحية.",
            },
            placeholder: { en: "e.g. 2027-06", ar: "مثال: 2027-06" },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "paymentTerms",
          type: "text",
          label: { en: "Payment Terms", ar: "شروط الدفع" },
          admin: {
            description: { en: "When the supplier wants to be paid.", ar: "متى يريد المورّد أن يُدفع له." },
            placeholder: { en: "e.g. 30 days from invoice", ar: "مثال: 30 يومًا من الفاتورة" },
          },
        },
        {
          name: "deliveryBasis",
          type: "text",
          label: { en: "Delivery Basis", ar: "أساس التسليم" },
          admin: {
            description: { en: "Where the supplier delivers to.", ar: "مكان تسليم المورّد." },
            placeholder: { en: "e.g. Ex warehouse Port Said", ar: "مثال: تسليم مستودع بورسعيد" },
          },
        },
        {
          name: "freightEGP",
          type: "number",
          min: 0,
          label: { en: "Freight (EGP)", ar: "الشحن (EGP)" },
          admin: {
            description: {
              en: "Freight the supplier charges on top, in EGP.",
              ar: "الشحن الذي يضيفه المورّد، بالجنيه.",
            },
            placeholder: { en: "e.g. 800", ar: "مثال: 800" },
          },
        },
      ],
    },
    {
      name: "deviations",
      type: "array",
      label: { en: "Deviations", ar: "الانحرافات" },
      labels: { singular: { en: "Deviation", ar: "انحراف" }, plural: { en: "Deviations", ar: "الانحرافات" } },
      admin: {
        description: {
          en: "Where the offer differs from what the customer asked.",
          ar: "مواضع اختلاف العرض عمّا طلبه العميل.",
        },
      },
      custom: {
        about: {
          en: "Wrong brand or part, missing item, quantity shortfall, spec, unit, pack size, expired validity, lead time vs ETA, shelf life. Some block use, others need the customer's acceptance.",
          ar: "علامة أو قطعة خاطئة، صنف ناقص، نقص في الكمية، المواصفات، الوحدة، حجم العبوة، صلاحية منتهية، مدة التوريد مقابل موعد الوصول، مدة الصلاحية. بعضها يمنع الاستخدام، وبعضها يحتاج قبول العميل.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "type",
              type: "select",
              label: { en: "Type", ar: "النوع" },
              required: true,
              options: [
                { value: "Wrong brand / part", label: { en: "Wrong brand / part", ar: "علامة / قطعة خاطئة" } },
                { value: "Missing item", label: { en: "Missing item", ar: "صنف ناقص" } },
                { value: "Quantity shortfall", label: { en: "Quantity shortfall", ar: "نقص في الكمية" } },
                { value: "Specification", label: { en: "Specification", ar: "المواصفات" } },
                { value: "Unit", label: { en: "Unit", ar: "الوحدة" } },
                { value: "Pack size", label: { en: "Pack size", ar: "حجم العبوة" } },
                { value: "Expired validity", label: { en: "Expired validity", ar: "صلاحية منتهية" } },
                { value: "Lead time vs ETA", label: { en: "Lead time vs ETA", ar: "مدة التوريد مقابل موعد الوصول" } },
                { value: "Shelf life", label: { en: "Shelf life", ar: "مدة الصلاحية" } },
              ],
              admin: {
                description: { en: "What kind of difference it is.", ar: "نوع الاختلاف." },
                placeholder: words({ en: "Pick a type", ar: "اختر نوعًا" }),
              },
            },
            {
              name: "severity",
              type: "select",
              label: { en: "Severity", ar: "الخطورة" },
              options: [
                { value: "Blocks use", label: { en: "Blocks use", ar: "يمنع الاستخدام" } },
                {
                  value: "Needs customer acceptance",
                  label: { en: "Needs customer acceptance", ar: "يحتاج قبول العميل" },
                },
                { value: "Warning", label: { en: "Warning", ar: "تحذير" } },
              ],
              defaultValue: "Warning",
              admin: {
                description: { en: "How much it matters for the quote.", ar: "مدى تأثيره على العرض." },
                placeholder: words({ en: "Pick a severity", ar: "اختر درجة الخطورة" }),
              },
            },
          ],
        },
        {
          name: "detail",
          type: "text",
          label: { en: "Detail", ar: "التفاصيل" },
          localized: true,
          admin: {
            description: { en: "What exactly differs.", ar: "ما الذي يختلف بالضبط." },
            placeholder: { en: "e.g. Offered 20 mm, asked 25 mm", ar: "مثال: عُرض 20 مم، والمطلوب 25 مم" },
          },
        },
        {
          name: "detectedBy",
          type: "select",
          label: { en: "Detected By", ar: "اكتشفه" },
          options: [
            { value: "Rules", label: { en: "Rules", ar: "القواعد" } },
            { value: "AI", label: { en: "AI", ar: "الذكاء الاصطناعي" } },
            { value: "Person", label: { en: "Person", ar: "شخص" } },
          ],
          defaultValue: "Rules",
          admin: {
            description: { en: "Who spotted it.", ar: "من اكتشفه." },
            placeholder: words({ en: "Pick a source", ar: "اختر مصدرًا" }),
          },
        },
      ],
    },
    evidence("evidence", {
      en: "Source (email, PDF, WhatsApp screenshot)",
      ar: "المصدر (بريد، PDF، لقطة شاشة واتساب)",
    }),
    {
      name: "source",
      type: "select",
      label: { en: "Source", ar: "المصدر" },
      required: true,
      defaultValue: "Email",
      options: [
        { value: "Email", label: { en: "Email", ar: "البريد الإلكتروني" } },
        { value: "WhatsApp / phone", label: { en: "WhatsApp / phone", ar: "WhatsApp / هاتف" } },
        { value: "Supplier portal", label: { en: "Supplier portal", ar: "بوابة المورّد" } },
        { value: "Agency pricelist", label: { en: "Agency pricelist", ar: "قائمة أسعار وكالة" } },
        { value: "Own stock", label: { en: "Own stock", ar: "مخزوننا" } },
      ],
      admin: {
        position: "sidebar",
        description: { en: "Where the price came from.", ar: "مصدر السعر." },
        placeholder: words({ en: "Pick a source", ar: "اختر مصدرًا" }),
      },
    },
    {
      name: "compliance",
      type: "select",
      label: { en: "Compliance", ar: "المطابقة" },
      defaultValue: "Pending",
      options: [
        { value: "Pending", label: { en: "Pending", ar: "معلّق" } },
        { value: "Confirmed", label: { en: "Confirmed", ar: "مؤكد" } },
        { value: "Rejected", label: { en: "Rejected", ar: "مرفوض" } },
        { value: "Awaiting corrected offer", label: { en: "Awaiting corrected offer", ar: "بانتظار عرض مصحَّح" } },
      ],
      admin: {
        position: "sidebar",
        description: {
          en: "Whether the offer meets the request. A person decides.",
          ar: "هل يلبي العرض الطلب. يقرر ذلك شخص.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر حالة" }),
      },
      custom: {
        about: {
          en: "Technical equivalence is a human decision, never the AI's.",
          ar: "التكافؤ الفني قرار بشري، وليس قرار الذكاء الاصطناعي أبدًا.",
        },
      },
    },
    {
      name: "superseded",
      type: "checkbox",
      label: { en: "Superseded", ar: "مُستبدَل" },
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "Set when a newer version replaces this offer.",
          ar: "يُضبط عندما تحل نسخة أحدث محل هذا العرض.",
        },
      },
    },
    {
      name: "enteredBy",
      type: "relationship",
      label: { en: "Entered By", ar: "أدخله" },
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: { en: "Who captured this offer.", ar: "من سجّل هذا العرض." },
        placeholder: words({ en: "e.g. Karim Youssef", ar: "مثال: كريم يوسف" }),
      },
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
    },
  ],
};
