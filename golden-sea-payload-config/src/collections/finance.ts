import type { CollectionConfig, PayloadRequest } from "payload";
import {
  CURRENCIES,
  autoNumber,
  caseRef,
  computed,
  daysSince,
  financeAccess,
  fxRates,
  idOf,
  logActivity,
  related,
  ruleError,
  scalar,
} from "./shared.ts";
import { words } from "./shared.ts";
import { IS_MOCK, IS_TEMP_MOCK, NotConnectedError, TempMockError } from "../flags.ts";
import { formats, tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import { CASE_PLACEHOLDER, FINANCE_ROLES, arabic, dayText, findAll, labelled, moneyText, once } from "./fulfilment.ts";

/** Customer receipts (payments in), read once per request. */
const customerPayments = (req: PayloadRequest) =>
  once(req, "payments-in", () => findAll(req, "payments", { direction: { equals: "in" } }));

/** How late an open invoice is, in the buckets finance reads receivables by. */
export const AGE_BUCKETS = ["Not due", "1–30 days", "31–60 days", "60+ days"] as const;
const bucketOf = (days: number) => AGE_BUCKETS[days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : 3];

/** What an invoice is raised for (the stored value), with its Arabic. */
const BASIS_AR: Record<string, string> = {
  Delivery: "تسليم",
  Milestone: "مرحلة إنجاز",
  Deposit: "مقدّم",
  Installment: "قسط",
  "Final balance": "الرصيد النهائي",
  "Service fees": "رسوم خدمة",
};
/** The VAT applied (the stored value), with its Arabic. */
const VAT_AR: Record<string, string> = {
  "14% standard": "14% قياسي",
  "0% — foreign vessel in transit": "0% — سفينة أجنبية عابرة",
  Exempt: "معفاة",
};

/** An invoice with money still to collect (not a draft, not cancelled). */
const collectible = (inv: Record<string, unknown>) =>
  Number(inv.balance) > 0 && !["Draft", "Cancelled"].includes(String(inv.status));

const longDay = {
  en: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }),
  ar: new Intl.DateTimeFormat("ar-EG-u-nu-latn", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }),
};

/**
 * The collection reminder for an invoice, as the AI drafts it, following the customer's contact
 * rule: a "do not chase" customer gets no message (an internal reminder for the account owner
 * instead); the others get an email a person reviews and sends. Pure: the invoice and its customer
 * in, written in `locale` (English unless "ar").
 */
export function reminderDraft(
  inv: Record<string, unknown>,
  customer: Record<string, unknown> | null,
  locale?: string | null,
) {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return cannedReminderDraft(inv, customer, locale);
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "reminderDraft is canned template text with a fixed confidence (0.92) and a hard-coded escalation contact (Karim Balbaa): the AI's draft, its confidence and the account's escalation owner",
    );
  }
}

/** The demo's reminder draft: template text standing in for the AI's. */
function cannedReminderDraft(
  inv: Record<string, unknown>,
  customer: Record<string, unknown> | null,
  locale?: string | null,
) {
  const ar = locale === "ar";
  const rule = scalar(customer?.contactRule) || "allowed";
  const days = daysSince(inv.dueDate);
  const cur = scalar(inv.currency);
  const amount = `${cur} ${Number(inv.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  const due = inv.dueDate ? longDay[ar ? "ar" : "en"].format(new Date(scalar(inv.dueDate))) : "—";
  const when = ar
    ? days > 0
      ? `متأخرة ${days} يومًا`
      : `مستحقة في ${due}`
    : days > 0
      ? `${days} days overdue`
      : `due ${due}`;
  const name = scalar(customer?.name);
  const number = scalar(inv.number);
  if (rule === "do-not-chase")
    return {
      mode: "internal",
      rule,
      title: ar ? `داخلي: ${number} ${amount} ${when} — ${name}` : `Internal: ${number} ${amount} ${when} — ${name}`,
      body: ar
        ? `لا تجوز مطالبة ${name} (قاعدة الحساب). راجع موعد السداد مع مسؤول الحساب في المكالمة المجدولة التالية، وصعّد الأمر إلى Karim Balbaa إذا بقيت مفتوحة بعد 60 يومًا. لن تُرسل أي رسالة إلى العميل.`
        : `${name} must not be chased (account rule). Check the payment run with the account owner at the next scheduled call; escalate to Karim Balbaa if still open after 60 days. No message goes to the customer.`,
      confidence: 1,
    };
  const contact = ((customer?.contacts as { name?: string; email?: string }[] | undefined) ?? [])[0];
  const first = contact?.name ? contact.name.split(" ")[0] : "";
  const paid = Number(inv.paid) || 0;
  if (ar)
    return {
      mode: "customer",
      rule,
      to: contact?.email ?? scalar(customer?.contactEmail),
      title: `تذكير: ${number} ${when} — ${name}`,
      subject: `فاتورة Golden Sea رقم ${number} — ${amount} ${days > 0 ? "متأخرة" : `مستحقة في ${due}`}`,
      body: `${first ? `عزيزي ${first}،` : "السادة فريق الحسابات المحترمون،"}

فاتورتنا رقم ${number} بمبلغ ${amount} ${days > 0 ? `استُحقت في ${due}` : `تستحق في ${due}`}${paid ? ` (الرصيد بعد دفعتكم البالغة ${cur} ${paid.toLocaleString("en-US")})` : ""}. هل يمكنكم إفادتنا بموعد جدولة سدادها؟ مرفق نسخة من الفاتورة وإذن التسليم الموقّع.

إذا كانت قد سُدّدت بالفعل، فنرجو إرسال إشعار التحويل لنتمكن من تخصيصه.

مع خالص التحية،
Golden Sea — الحسابات`,
      confidence: 0.92,
      note:
        rule === "one-follow-up"
          ? "قاعدة الحساب: متابعة واحدة لكل فاتورة — وهذه هي؛ التذكيرات اللاحقة داخلية."
          : "قاعدة الحساب: المتابعات مسموحة.",
    };
  const greeting = first ? `Dear ${first},` : "Dear accounts team,";
  return {
    mode: "customer",
    rule,
    to: contact?.email ?? scalar(customer?.contactEmail),
    title: `Reminder: ${number} ${when} — ${name}`,
    subject: `Golden Sea invoice ${number} — ${amount} ${days > 0 ? "overdue" : `due ${due}`}`,
    body: `${greeting}

Our invoice ${number} for ${amount} ${days > 0 ? `fell due on ${due}` : `is due on ${due}`}${paid ? ` (balance after your payment of ${cur} ${paid.toLocaleString("en-US")})` : ""}. Could you let us know when it is scheduled for payment? A copy of the invoice and the signed delivery note are attached.

If it has already been paid, please send us the remittance so we can allocate it.

Kind regards,
Golden Sea — Accounts`,
    confidence: 0.92,
    note:
      rule === "one-follow-up"
        ? "Account rule: one follow-up per invoice — this is it; later reminders are internal."
        : "Account rule: follow-ups allowed.",
  };
}
import { widgets } from "saastemlycrm-design-system/contracts";

/** The bank reference recording a customer payment starts from. */
function incomingBankReference(inv: Record<string, unknown>): string {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    // A fixed sample reference, so the action is the same on every read.
    return `TRX-77${scalar(inv.number).replace(/\D/g, "").slice(-3).padStart(3, "0")}`;
  } else {
    // TODO implement actual prod third party connections
    throw new NotConnectedError(
      "bank: the reference of the customer's incoming transfer for this invoice, from the bank statement or feed",
    );
  }
}

/** Customer invoices: from delivered quantities, never billing the same quantity twice. */
export const Invoices: CollectionConfig = {
  slug: "invoices",
  labels: {
    singular: { en: "Invoice", ar: "فاتورة" },
    plural: { en: "Invoices", ar: "الفواتير" },
  },
  custom: {
    edit: { steps: { field: "status", skip: ["Overdue", "Cancelled"] } },
    // Reminders follow each customer's contact rule (the draft is the `reminder` field): an email a
    // person reviews and sends, or, for "do not chase", an internal reminder only. Offered on open
    // invoices due within 5 days or overdue, wherever invoices show.
    actions: [
      {
        label: words({ en: "Draft reminder", ar: "صياغة تذكير" }),
        when: {
          "reminder.mode": { equals: "customer" },
          daysOverdue: { greater_than: -6 },
          balance: { greater_than: 0 },
        },
        roles: ["management", "finance-director", "operations"],
        call: { path: "/cash/reminder", body: { invoice: "$row.id" } },
        confirm: {
          heading: words({ en: "Collection reminder — $row.number", ar: "تذكير تحصيل — $row.number" }),
          text: words({
            en: "AI draft · $row.reminder.note\nTo: $row.reminder.to · Subject: $row.reminder.subject",
            ar: "مسودة بالذكاء الاصطناعي · $row.reminder.note\nإلى: $row.reminder.to · الموضوع: $row.reminder.subject",
          }),
          label: words({ en: "Send reminder", ar: "إرسال التذكير" }),
        },
        fields: [
          {
            type: "textarea",
            name: "body",
            label: words({ en: "Email (edit before sending)", ar: "البريد (عدّله قبل الإرسال)" }),
            required: true,
            defaultValue: "$row.reminder.body",
            admin: { rows: 10 },
          },
        ],
        done: words({
          en: "Reminder sent to $row.customer.name by you (logged on the account).",
          ar: "أرسلتَ التذكير إلى $row.customer.name (سُجّل على الحساب).",
        }),
      },
      {
        label: words({ en: "Internal reminder", ar: "تذكير داخلي" }),
        when: {
          "reminder.mode": { equals: "internal" },
          daysOverdue: { greater_than: -6 },
          balance: { greater_than: 0 },
        },
        roles: ["management", "finance-director", "operations"],
        call: { path: "/cash/reminder", body: { invoice: "$row.id" } },
        confirm: {
          heading: words({ en: "Collection reminder — $row.number", ar: "تذكير تحصيل — $row.number" }),
          text: words({
            en: "$row.customer.name must not be chased: no customer message is drafted — an internal reminder for the account owner instead.",
            ar: "لا تجوز مطالبة $row.customer.name: لا تُصاغ رسالة للعميل — بل تذكير داخلي لمسؤول الحساب.",
          }),
          label: words({ en: "Create internal reminder", ar: "إنشاء تذكير داخلي" }),
        },
        fields: [
          {
            type: "textarea",
            name: "body",
            label: words({ en: "Internal reminder", ar: "تذكير داخلي" }),
            required: true,
            defaultValue: "$row.reminder.body",
            admin: { rows: 6 },
          },
        ],
        done: words({
          en: "Internal reminder created — nothing sent to $row.customer.name.",
          ar: "أُنشئ تذكير داخلي — لم يُرسل شيء إلى $row.customer.name.",
        }),
      },
      // The Egyptian e-invoice (`eInvoiceNext`): refresh a submitted one, else sign and submit it
      // (a local buyer's tax registration number checked first). Safe to retry.
      {
        label: words({ en: "Refresh status · $row.number", ar: "تحديث الحالة · $row.number" }),
        when: { "eInvoiceNext.mode": { equals: "refresh" } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/einvoice", body: { invoice: "$row.id" } },
        reply: true,
      },
      ...(["foreign", "local"] as const).map((mode): CollectionAction => ({
        label: words({ en: "$row.eInvoiceNext.label · $row.number", ar: "$row.eInvoiceNext.label · $row.number" }),
        when: { "eInvoiceNext.mode": { equals: mode } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/einvoice", body: { invoice: "$row.id" } },
        prompt: words({
          en: "Sign & submit $row.number to the tax authority",
          ar: "توقيع $row.number وتقديمها إلى مصلحة الضرائب",
        }),
        confirm: {
          heading: words({
            en: "Sign & submit $row.number to the tax authority",
            ar: "توقيع $row.number وتقديمها إلى مصلحة الضرائب",
          }),
          text: words({ en: "$row.eInvoiceNext.summary", ar: "$row.eInvoiceNext.summary" }),
          label: words({ en: "Sign & submit", ar: "توقيع وتقديم" }),
          tone: "primary",
        },
        fields:
          mode === "local"
            ? [
                {
                  type: "text",
                  name: "taxId",
                  label: words({ en: "Buyer tax registration number", ar: "رقم التسجيل الضريبي للمشتري" }),
                  defaultValue: "$row.billing.taxId",
                  admin: { description: "9 digits, from the customer's tax card on file." },
                },
              ]
            : undefined,
        reply: true,
      })),
      // A customer payment, recorded once the money is in the bank (the system never moves money).
      {
        label: words({ en: "Record payment · $row.number", ar: "تسجيل دفعة · $row.number" }),
        when: { balance: { greater_than: 0 }, status: { not_in: ["Draft", "Cancelled"] } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/payment", body: { invoice: "$row.id" } },
        prompt: words({ en: "Record customer payment — $row.number", ar: "تسجيل دفعة العميل — $row.number" }),
        fields: [
          {
            type: "number",
            name: "amount",
            label: words({ en: "Amount received ($row.currency)", ar: "المبلغ المستلم ($row.currency)" }),
            required: true,
            defaultValue: "$row.balance",
            admin: { description: "$row.paymentDraft.note" },
          },
          {
            type: "text",
            name: "reference",
            label: words({ en: "Bank reference", ar: "مرجع البنك" }),
            defaultValue: "$row.paymentDraft.reference",
          },
        ],
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    components: {
      beforeList: [widgets({ widgets: [{ size: "s", counts: { collection: "invoices", field: "status" } }] })],
    },
    useAsTitle: "number",
    defaultColumns: ["number", "case", "amount", "currency", "paid", "dueDate", "status"],
    group: { en: "Finance", ar: "المالية" },
  },
  access: financeAccess,
  hooks: {
    beforeValidate: [autoNumber("invoices", "number", "INV/2026/")],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const lines = (data.lines as { qty?: number; unitPrice?: number; lineNo?: number }[] | undefined) ?? [];
        data.amount =
          Math.round(lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0) * 100) / 100 ||
          data.amount;
        data.balance = Math.max(0, (Number(data.amount) || 0) - (Number(data.paid) || 0));
        if (data.status !== "Draft" && data.status !== "Cancelled")
          data.status = data.balance === 0 ? "Paid" : Number(data.paid) > 0 ? "Partially paid" : "Open";
        // Double-billing guard: a line's invoiced qty across invoices can't exceed what was delivered.
        if (data.case && !req.context?.seed) {
          const { docs } = await req.payload.find({
            locale: req.locale,
            collection: "invoices" as never,
            where: { case: { equals: idOf(data.case) } },
            depth: 0,
            limit: 0,
          });
          const others = docs.filter((d) => (d as { id: string }).id !== originalDoc?.id) as {
            lines?: { lineNo?: number; qty?: number }[];
            status?: string;
          }[];
          for (const l of lines) {
            const already = others
              .filter((o) => o.status !== "Cancelled")
              .flatMap((o) => o.lines ?? [])
              .filter((x) => x.lineNo === l.lineNo)
              .reduce((s, x) => s + (Number(x.qty) || 0), 0);
            const delivered = Number((l as { deliveredQty?: number }).deliveredQty ?? Infinity);
            if (already + (Number(l.qty) || 0) > delivered)
              throw ruleError(
                arabic(req)
                  ? `البند ${l.lineNo}: الفوترة تتجاوز الكمية المسلّمة (فُوتر ${already} بالفعل).`
                  : `Line ${l.lineNo}: invoicing more than delivered (${already} already invoiced).`,
              );
          }
        }
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
          unique: true,
          label: { en: "Number", ar: "الرقم" },
          admin: {
            readOnly: true,
            description: {
              en: "Numbered automatically when saved, like INV/2026/0412.",
              ar: "يُرقَّم تلقائيًا عند الحفظ، مثل INV/2026/0412.",
            },
          },
        },
        caseRef(true, {
          hint: { en: "The customer case this invoice bills.", ar: "ملف العميل الذي تُصدر عنه هذه الفاتورة." },
          placeholder: CASE_PLACEHOLDER,
        }),
        {
          name: "customer",
          type: "relationship",
          relationTo: "customers",
          required: true,
          label: { en: "Customer", ar: "العميل" },
          admin: {
            description: {
              en: "The shipping company or owner who pays this invoice.",
              ar: "شركة الشحن أو المالك الذي يسدد هذه الفاتورة.",
            },
            placeholder: words({ en: "e.g. Nile Maritime Co.", ar: "مثال: Nile Maritime Co." }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "basis",
          type: "select",
          options: labelled(BASIS_AR),
          defaultValue: "Delivery",
          label: { en: "Basis", ar: "الأساس" },
          admin: {
            description: {
              en: "Why this invoice is raised: a delivery, a deposit or a milestone.",
              ar: "سبب إصدار الفاتورة: تسليم أو مقدّم أو مرحلة إنجاز.",
            },
            placeholder: words({ en: "Pick a basis", ar: "اختر الأساس" }),
          },
        },
        {
          name: "delivery",
          type: "relationship",
          relationTo: "deliveries",
          label: { en: "Delivery", ar: "التسليم" },
          admin: {
            description: {
              en: "The delivery being billed, when the basis is a delivery.",
              ar: "التسليم المفوتر، حين يكون الأساس تسليمًا.",
            },
            placeholder: words({ en: "e.g. DN-0212", ar: "مثال: DN-0212" }),
          },
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      label: { en: "Lines", ar: "البنود" },
      admin: {
        description: { en: "What is billed, one row per item delivered.", ar: "ما تجري فوترته، صف لكل صنف مسلَّم." },
      },
      custom: {
        about: {
          en: "A line's total invoiced quantity across all invoices cannot exceed what was delivered, so the same quantity is never billed twice.",
          ar: "لا يتجاوز إجمالي الكمية المفوترة لأي بند عبر كل الفواتير ما سُلّم منه، فلا تُفوتر الكمية نفسها مرتين.",
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
                description: { en: "The order line this row bills.", ar: "بند الطلب الذي يفوتره هذا الصف." },
                placeholder: words({ en: "e.g. 1", ar: "مثال: 1" }),
              },
            },
            {
              name: "description",
              type: "text",
              required: true,
              localized: true,
              label: { en: "Description", ar: "الوصف" },
              admin: {
                description: { en: "The item as it appears on the invoice.", ar: "الصنف كما يظهر في الفاتورة." },
                placeholder: words({ en: "e.g. Coverall FR, size L", ar: "مثال: أفرول مقاوم للهب، مقاس L" }),
              },
            },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              label: { en: "Qty", ar: "الكمية" },
              admin: {
                description: { en: "Units billed on this invoice.", ar: "الوحدات المفوترة في هذه الفاتورة." },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
            {
              name: "deliveredQty",
              type: "number",
              min: 0,
              label: { en: "Delivered Qty", ar: "الكمية المسلّمة" },
              admin: {
                description: {
                  en: "Units delivered to the vessel. Billing cannot go above it.",
                  ar: "الوحدات المسلّمة إلى السفينة، ولا تتجاوزها الفوترة.",
                },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
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
                  en: "The selling price per unit, before VAT.",
                  ar: "سعر بيع الوحدة، قبل ضريبة القيمة المضافة.",
                },
                placeholder: words({ en: "e.g. 1,950", ar: "مثال: 1,950" }),
              },
            },
          ],
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
            description: { en: "The currency the customer is billed in.", ar: "العملة التي يُفوتر بها العميل." },
            placeholder: words({ en: "USD", ar: "USD" }),
          },
        },
        {
          name: "amount",
          type: "number",
          min: 0,
          label: { en: "Amount", ar: "المبلغ" },
          admin: {
            description: {
              en: "The invoice total. It is worked out from the lines.",
              ar: "إجمالي الفاتورة، ويُحسب من البنود.",
            },
            placeholder: words({ en: "e.g. 48,200", ar: "مثال: 48,200" }),
          },
          custom: formats.money("currency"),
        },
        {
          name: "paid",
          type: "number",
          min: 0,
          defaultValue: 0,
          label: { en: "Paid", ar: "المدفوع" },
          admin: {
            description: {
              en: "Payments received so far. It grows as customer receipts are recorded.",
              ar: "المدفوعات المستلمة حتى الآن، وتزيد مع تسجيل تحصيلات العميل.",
            },
            placeholder: words({ en: "e.g. 10,000", ar: "مثال: 10,000" }),
          },
          custom: formats.money("currency"),
        },
        {
          name: "balance",
          type: "number",
          min: 0,
          label: { en: "Balance", ar: "الرصيد" },
          admin: {
            readOnly: true,
            description: {
              en: "Amount minus paid. It reaches zero when the invoice is settled.",
              ar: "المبلغ ناقص المدفوع، ويصل إلى الصفر عند تسوية الفاتورة.",
            },
          },
          custom: formats.money("currency"),
        },
      ],
    },
    // What finance reads an invoice by, worked out on every read (never stored).
    {
      type: "row",
      fields: [
        computed(
          {
            name: "balanceUsd",
            type: "number",
            label: { en: "Balance (USD)", ar: "الرصيد (USD)" },
            admin: {
              description: {
                en: "The open balance at today's FX rate, so invoices compare.",
                ar: "الرصيد المفتوح بسعر صرف اليوم، لتسهل المقارنة بين الفواتير.",
              },
            },
            custom: formats.money("USD"),
          },
          async (inv, req) => {
            const fx = await fxRates(req);
            const egp = (Number(inv.balance) || 0) * (fx[scalar(inv.currency) || "EGP"] ?? 1);
            return Math.round((egp / (fx.USD ?? 1)) * 100) / 100;
          },
        ),
        computed(
          {
            name: "daysOverdue",
            type: "number",
            label: { en: "Days overdue", ar: "أيام التأخير" },
            admin: {
              description: {
                en: "Days past the due date. Zero or less means not yet due.",
                ar: "الأيام بعد تاريخ الاستحقاق، والصفر أو أقل يعني أنها لم تستحق بعد.",
              },
            },
            custom: formats.days(),
          },
          (inv) => (collectible(inv) ? daysSince(inv.dueDate) : 0),
        ),
        computed(
          {
            name: "ageBucket",
            type: "select",
            label: { en: "Age", ar: "العمر" },
            options: labelled({
              "Not due": "غير مستحقة",
              "1–30 days": "1–30 يومًا",
              "31–60 days": "31–60 يومًا",
              "60+ days": "أكثر من 60 يومًا",
            } satisfies Record<(typeof AGE_BUCKETS)[number], string>),
            admin: {
              description: {
                en: "How late the invoice is, in the buckets finance reads receivables by.",
                ar: "مدى تأخر الفاتورة، بالفئات التي تقرأ بها المالية الذمم المدينة.",
              },
            },
            custom: tones({ "Not due": "success", "1–30 days": "warning", "31–60 days": "error", "60+ days": "error" }),
          },
          (inv) => (collectible(inv) ? bucketOf(daysSince(inv.dueDate)) : null),
        ),
      ],
    },
    // The collection reminder the AI drafts for it (`custom.actions` offers it), in the request's language.
    computed(
      {
        name: "reminder",
        type: "group",
        label: { en: "Reminder", ar: "التذكير" },
        admin: {
          condition: () => false,
          description: {
            en: "The collection reminder the AI drafts for this invoice.",
            ar: "تذكير التحصيل الذي يصوغه الذكاء الاصطناعي لهذه الفاتورة.",
          },
        },
        fields: [
          {
            name: "mode",
            type: "text",
            label: { en: "Mode", ar: "النوع" },
            admin: {
              description: {
                en: "Customer email, or internal only for a do-not-chase account.",
                ar: "بريد للعميل، أو داخلي فقط لحساب لا تجوز مطالبته.",
              },
              placeholder: words({ en: "e.g. customer", ar: "مثال: customer" }),
            },
          },
          {
            name: "to",
            type: "text",
            label: { en: "To", ar: "إلى" },
            admin: {
              description: {
                en: "The customer contact the email goes to.",
                ar: "جهة اتصال العميل التي يُرسل إليها البريد.",
              },
              placeholder: words({ en: "e.g. accounts@nilemaritime.com", ar: "مثال: accounts@nilemaritime.com" }),
            },
          },
          {
            name: "subject",
            type: "text",
            label: { en: "Subject", ar: "الموضوع" },
            admin: {
              description: { en: "The email subject line.", ar: "سطر موضوع البريد." },
              placeholder: words({
                en: "e.g. Golden Sea invoice INV/2026/0412, overdue",
                ar: "مثال: فاتورة Golden Sea رقم INV/2026/0412، متأخرة",
              }),
            },
          },
          {
            name: "body",
            type: "textarea",
            label: { en: "Body", ar: "النص" },
            admin: {
              description: {
                en: "The drafted message a person reviews before sending.",
                ar: "الرسالة المصاغة التي يراجعها شخص قبل الإرسال.",
              },
              placeholder: words({ en: "Dear accounts team,", ar: "السادة فريق الحسابات المحترمون،" }),
            },
          },
          {
            name: "note",
            type: "text",
            label: { en: "Note", ar: "ملاحظة" },
            admin: {
              description: {
                en: "The account's contact rule that shaped the draft.",
                ar: "قاعدة التواصل مع الحساب التي شكّلت المسودة.",
              },
              placeholder: words({
                en: "e.g. Account rule: follow-ups allowed.",
                ar: "مثال: قاعدة الحساب: المتابعات مسموحة.",
              }),
            },
          },
        ],
      },
      async (inv, req) =>
        collectible(inv) ? reminderDraft(inv, await related(req, "customers", inv.customer), req.locale) : null,
    ),
    // What the case's invoice table reads it by, in one line each.
    {
      type: "row",
      fields: [
        computed(
          {
            name: "basisNote",
            type: "text",
            label: { en: "Basis", ar: "الأساس" },
            admin: {
              description: {
                en: "Basis, delivery and issue date in one line.",
                ar: "الأساس والتسليم وتاريخ الإصدار في سطر واحد.",
              },
            },
          },
          async (inv, req) => {
            const delivery = await related(req, "deliveries", inv.delivery);
            const basis = scalar(inv.basis) || "Delivery";
            return `${arabic(req) ? (BASIS_AR[basis] ?? basis) : basis}${delivery ? ` · ${scalar(delivery.number)}` : ""} · ${dayText(inv.issuedAt, req.locale)}`;
          },
        ),
        computed(
          {
            name: "linesSummary",
            type: "text",
            label: { en: "Invoiced lines", ar: "البنود المفوترة" },
            admin: {
              description: {
                en: "Each billed line against what was delivered.",
                ar: "كل بند مفوتر مقابل ما سُلّم منه.",
              },
            },
          },
          (inv, req) =>
            ((inv.lines as Record<string, unknown>[] | undefined) ?? [])
              .map(
                (l) =>
                  `L${scalar(l.lineNo)} · ${scalar(l.qty)}${l.deliveredQty != null ? (arabic(req) ? ` من ${scalar(l.deliveredQty)} مسلّمة` : ` of ${scalar(l.deliveredQty)} delivered`) : ""} × ${moneyText(Number(l.unitPrice) || 0, scalar(inv.currency))}`,
              )
              .join("; "),
        ),
        // The tax authority's answer: its error, else the UUID it gave.
        computed(
          {
            name: "eInvoiceNote",
            type: "text",
            label: { en: "E-invoice note", ar: "ملاحظة الفاتورة الإلكترونية" },
            admin: {
              description: {
                en: "The tax authority's error, or the UUID it issued.",
                ar: "خطأ مصلحة الضرائب، أو المعرّف الفريد الذي أصدرته.",
              },
            },
          },
          (inv) => {
            const e = (inv.eInvoice ?? {}) as { error?: string; uuid?: string };
            return e.error || (e.uuid ? `UUID ${e.uuid}` : "");
          },
        ),
        // The balance and when it's due (or settled), then each payment received.
        computed(
          {
            name: "paymentsNote",
            type: "text",
            label: { en: "Payments", ar: "المدفوعات" },
            admin: {
              description: { en: "The open balance and each payment received.", ar: "الرصيد المفتوح وكل دفعة مستلمة." },
            },
          },
          async (inv, req) => {
            const ar = arabic(req);
            const cur = scalar(inv.currency);
            const payments = req.context?.seed
              ? []
              : (await customerPayments(req)).filter((p) => idOf(p.invoice) === idOf(inv.id));
            return [
              Number(inv.balance) > 0
                ? ar
                  ? `الرصيد ${moneyText(Number(inv.balance), cur)} مستحق ${dayText(inv.dueDate, "ar")}`
                  : `Balance ${moneyText(Number(inv.balance), cur)} due ${dayText(inv.dueDate)}`
                : ar
                  ? "مسدَّدة"
                  : "Settled",
              ...payments.map(
                (p) =>
                  `${dayText(p.paidAt, req.locale)} · ${scalar(p.reference)} · ${moneyText(Number(p.amount) || 0, cur)}`,
              ),
            ].join(" · ");
          },
        ),
      ],
    },
    // The next step with the tax authority (the e-invoice actions read it): nothing once valid.
    computed(
      {
        name: "eInvoiceNext",
        type: "group",
        label: { en: "E Invoice Next", ar: "الخطوة التالية للفاتورة الإلكترونية" },
        admin: {
          condition: () => false,
          description: {
            en: "The next step with the tax authority for this invoice.",
            ar: "الخطوة التالية مع مصلحة الضرائب لهذه الفاتورة.",
          },
        },
        fields: [
          {
            name: "mode",
            type: "text",
            label: { en: "Mode", ar: "النوع" },
            admin: {
              description: {
                en: "Local buyer, foreign buyer, or a status refresh.",
                ar: "مشترٍ محلي أو أجنبي، أو تحديث للحالة.",
              },
              placeholder: words({ en: "e.g. local", ar: "مثال: local" }),
            },
          },
          {
            name: "label",
            type: "text",
            label: { en: "Label", ar: "التسمية" },
            admin: {
              description: { en: "The action's name on the button.", ar: "اسم الإجراء على الزر." },
              placeholder: words({ en: "e.g. Sign & submit", ar: "مثال: توقيع وإرسال" }),
            },
          },
          {
            name: "summary",
            type: "textarea",
            label: { en: "Summary", ar: "الملخص" },
            admin: {
              description: {
                en: "What the submission contains, shown before sending.",
                ar: "محتوى الإرسال، يُعرض قبل الإرسال.",
              },
              placeholder: words({
                en: "e.g. Nile Maritime Co. · EGP 48,200 · 14% standard",
                ar: "مثال: Nile Maritime Co. · EGP 48,200 · 14% قياسي",
              }),
            },
          },
        ],
      },
      async (inv, req) => {
        const ar = arabic(req);
        const e = (inv.eInvoice ?? {}) as { status?: string; error?: string };
        const status = e.status || "Not submitted";
        if (status === "Valid") return null;
        if (status === "Submitted")
          return { mode: "refresh", label: ar ? "تحديث الحالة" : "Refresh status", summary: "" };
        const billing = (inv.billing ?? {}) as { legalEntity?: string };
        const customer = billing.legalEntity ? null : await related(req, "customers", inv.customer);
        const vat = scalar(inv.vatTreatment);
        return {
          mode: inv.vatTreatment === "14% standard" ? "local" : "foreign",
          label: ar
            ? status === "Rejected"
              ? "تصحيح وإعادة الإرسال"
              : e.error
                ? "إعادة المحاولة (آمنة)"
                : "توقيع وإرسال"
            : status === "Rejected"
              ? "Correct & resubmit"
              : e.error
                ? "Retry (safe)"
                : "Sign & submit",
          summary: [
            `${billing.legalEntity || scalar(customer?.name)} · ${moneyText(Number(inv.amount) || 0, scalar(inv.currency))} · ${ar ? (VAT_AR[vat] ?? vat) : vat}`,
            ...(e.error ? ["", e.error] : []),
            "",
            ar
              ? "يُوقَّع بالتوقيع الإلكتروني لـ Golden Sea ثم يُرسل؛ رقم الفاتورة هو مفتاح منع التكرار، فلا تُنشئ إعادة المحاولة إرسالًا ثانيًا أبدًا."
              : "Signed with Golden Sea's e-signature and submitted; the invoice number is the idempotency key, so a retry never creates a second submission.",
          ].join("\n"),
        };
      },
    ),
    // What recording a payment against it starts from.
    computed(
      {
        name: "paymentDraft",
        type: "group",
        label: { en: "Payment Draft", ar: "مسودة الدفعة" },
        admin: {
          condition: () => false,
          description: { en: "What recording a payment starts from.", ar: "ما يبدأ منه تسجيل الدفعة." },
        },
        fields: [
          {
            name: "reference",
            type: "text",
            label: { en: "Reference", ar: "المرجع" },
            admin: {
              description: { en: "A sample bank reference to start from.", ar: "مرجع بنكي نموذجي للبدء منه." },
              placeholder: words({ en: "e.g. TRX-77412", ar: "مثال: TRX-77412" }),
            },
          },
          {
            name: "note",
            type: "text",
            label: { en: "Note", ar: "ملاحظة" },
            admin: {
              description: {
                en: "The open balance and due date, as a reminder.",
                ar: "الرصيد المفتوح وتاريخ الاستحقاق، للتذكير.",
              },
              placeholder: words({
                en: "e.g. Balance EGP 48,200 · due 17 Nov",
                ar: "مثال: الرصيد EGP 48,200 · مستحق 17 نوفمبر",
              }),
            },
          },
        ],
      },
      (inv, req) =>
        Number(inv.balance) > 0
          ? {
              reference: incomingBankReference(inv),
              note: arabic(req)
                ? `الرصيد ${moneyText(Number(inv.balance), scalar(inv.currency))} · مستحق ${dayText(inv.dueDate, "ar")}. يُسجَّل بعد وصول المبلغ إلى البنك — النظام لا يحوّل أموالًا أبدًا.`
                : `Balance ${moneyText(Number(inv.balance), scalar(inv.currency))} · due ${dayText(inv.dueDate)}. Recorded after the money is in the bank — the system never moves money.`,
            }
          : null,
    ),
    {
      type: "row",
      fields: [
        {
          name: "issuedAt",
          type: "date",
          label: { en: "Issued At", ar: "تاريخ الإصدار" },
          admin: {
            description: { en: "The invoice date printed on the document.", ar: "تاريخ الفاتورة المطبوع على المستند." },
          },
        },
        {
          name: "dueDate",
          type: "date",
          label: { en: "Due Date", ar: "تاريخ الاستحقاق" },
          admin: {
            description: {
              en: "The date payment is due under the customer's terms.",
              ar: "تاريخ استحقاق الدفع وفق شروط العميل.",
            },
          },
        },
        {
          name: "vatTreatment",
          type: "select",
          options: labelled(VAT_AR),
          defaultValue: "0% — foreign vessel in transit",
          label: { en: "Vat Treatment", ar: "المعاملة الضريبية" },
          admin: {
            description: {
              en: "The VAT rate applied. Foreign vessels in transit are usually 0%.",
              ar: "نسبة ضريبة القيمة المضافة المطبقة، وتكون عادةً 0% للسفن الأجنبية العابرة.",
            },
            placeholder: words({ en: "Pick a VAT treatment", ar: "اختر المعاملة الضريبية" }),
          },
          custom: {
            about: {
              en: "A 14% standard invoice goes to a local buyer and needs their tax registration number when submitted to the tax authority.",
              ar: "تصدر فاتورة 14% القياسية لمشترٍ محلي، وتحتاج إلى رقم تسجيله الضريبي عند إرسالها إلى مصلحة الضرائب.",
            },
          },
        },
      ],
    },
    {
      name: "billing",
      type: "group",
      label: { en: "Billing", ar: "الفوترة" },
      admin: {
        description: {
          en: "The legal entity and tax number the invoice is issued to.",
          ar: "الكيان القانوني والرقم الضريبي اللذان تصدر لهما الفاتورة.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "legalEntity",
              type: "text",
              label: { en: "Legal Entity", ar: "الكيان القانوني" },
              admin: {
                description: {
                  en: "The company name as it appears on its tax card.",
                  ar: "اسم الشركة كما يظهر في بطاقتها الضريبية.",
                },
                placeholder: words({ en: "e.g. Nile Maritime Co. S.A.E.", ar: "مثال: Nile Maritime Co. S.A.E." }),
              },
            },
            {
              name: "taxId",
              type: "text",
              label: { en: "Tax Id", ar: "الرقم الضريبي" },
              admin: {
                description: {
                  en: "The buyer's tax registration number, 9 digits.",
                  ar: "رقم التسجيل الضريبي للمشتري، 9 أرقام.",
                },
                placeholder: words({ en: "e.g. 100-200-300", ar: "مثال: 100-200-300" }),
              },
            },
          ],
        },
      ],
    },
    {
      name: "eInvoice",
      type: "group",
      label: { en: "Egyptian e-invoice (tax authority)", ar: "الفاتورة الإلكترونية المصرية (مصلحة الضرائب)" },
      admin: {
        description: {
          en: "Where the invoice stands with the Egyptian tax authority.",
          ar: "موقف الفاتورة لدى مصلحة الضرائب المصرية.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "status",
              type: "select",
              label: { en: "E-invoice (tax authority)", ar: "الفاتورة الإلكترونية (مصلحة الضرائب)" },
              options: labelled({
                "Not submitted": "لم تُرسل",
                Submitted: "مُرسَلة",
                Valid: "صالحة",
                Invalid: "غير صالحة",
                Rejected: "مرفوضة",
                Cancelled: "ملغاة",
              }),
              defaultValue: "Not submitted",
              admin: {
                description: {
                  en: "The tax authority's verdict on the submitted invoice.",
                  ar: "قرار مصلحة الضرائب بشأن الفاتورة المرسلة.",
                },
                placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
              },
              custom: tones({
                "Not submitted": "neutral",
                Submitted: "info",
                Valid: "success",
                Invalid: "error",
                Rejected: "error",
                Cancelled: "neutral",
              }),
            },
            {
              name: "uuid",
              type: "text",
              label: { en: "UUID", ar: "المعرّف الفريد (UUID)" },
              admin: {
                description: {
                  en: "The unique ID the tax authority gave the invoice.",
                  ar: "المعرّف الفريد الذي منحته مصلحة الضرائب للفاتورة.",
                },
                placeholder: words({ en: "e.g. 7K3M9X2P4Q8R", ar: "مثال: 7K3M9X2P4Q8R" }),
              },
            },
            {
              name: "submittedAt",
              type: "date",
              label: { en: "Submitted At", ar: "تاريخ الإرسال" },
              admin: {
                description: {
                  en: "When the invoice was sent to the tax authority.",
                  ar: "متى أُرسلت الفاتورة إلى مصلحة الضرائب.",
                },
              },
            },
          ],
        },
        {
          name: "error",
          type: "text",
          label: { en: "Error", ar: "الخطأ" },
          admin: {
            description: {
              en: "The reason the tax authority gave when it refused the invoice.",
              ar: "السبب الذي ذكرته مصلحة الضرائب عند رفض الفاتورة.",
            },
            placeholder: words({ en: "e.g. Buyer tax ID not found", ar: "مثال: الرقم الضريبي للمشتري غير موجود" }),
          },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Draft",
      label: { en: "Status", ar: "الحالة" },
      options: labelled({
        Draft: "مسودة",
        Open: "مفتوحة",
        "Partially paid": "مدفوعة جزئيًا",
        Paid: "مدفوعة",
        Overdue: "متأخرة",
        Cancelled: "ملغاة",
      }),
      custom: tones({
        Draft: "neutral",
        Open: "info",
        "Partially paid": "warning",
        Paid: "success",
        Overdue: "error",
        Cancelled: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: {
          en: "Where the invoice is. It moves on its own as payments arrive.",
          ar: "موقف الفاتورة، ويتغير تلقائيًا مع وصول المدفوعات.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
    {
      name: "collectionRule",
      type: "text",
      label: { en: "Collection Rule", ar: "قاعدة التحصيل" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: { en: "From the customer's contact rule.", ar: "من قاعدة التواصل مع العميل." },
      },
    },
  ],
};

/**
 * Money in and out. Recorded after the bank movement — the system never initiates transfers.
 * Supplier payments need an approved approval record.
 */
export const Payments: CollectionConfig = {
  slug: "payments",
  labels: {
    singular: { en: "Payment", ar: "دفعة" },
    plural: { en: "Payments", ar: "الدفعات" },
  },
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "direction", "amount", "currency", "paidAt", "status"],
    group: { en: "Finance", ar: "المالية" },
  },
  defaultSort: "-paidAt",
  access: financeAccess,
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.direction === "out" && data.status === "Recorded" && !req.context?.seed) {
          const approval = data.approval
            ? ((await req.payload
                .findByID({ collection: "approvals" as never, id: String(idOf(data.approval)), depth: 0 })
                .catch(() => null)) as { status?: string } | null)
            : null;
          if (approval?.status !== "Approved")
            throw ruleError(
              arabic(req)
                ? "تحتاج المدفوعات الصادرة إلى طلب اعتماد معتمد (مقدّم / دفعة)."
                : "Outgoing payments need an approved approval (deposit / payment).",
            );
        }
        return data;
      },
    ],
    afterChange: [
      // Allocating a customer receipt updates the invoice's paid amount.
      async ({ doc, operation, req }) => {
        if (operation !== "create" || doc.direction !== "in" || !doc.invoice || req.context?.seed) return doc;
        const inv = (await req.payload.findByID({
          locale: req.locale,
          collection: "invoices" as never,
          id: String(idOf(doc.invoice)),
          depth: 0,
        })) as { paid?: number; number?: string; case?: unknown };
        await req.payload.update({
          collection: "invoices" as never,
          id: String(idOf(doc.invoice)),
          data: { paid: (Number(inv.paid) || 0) + Number(doc.amount) } as never,
          req,
        });
        await logActivity(req, {
          case: idOf(inv.case),
          text: {
            en: `Payment ${doc.currency} ${doc.amount} allocated to ${inv.number}.`,
            ar: `خُصّصت دفعة ${doc.currency} ${doc.amount} للفاتورة ${inv.number}.`,
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
          name: "direction",
          type: "select",
          required: true,
          label: { en: "Direction", ar: "الاتجاه" },
          options: [
            { label: { en: "Customer receipt", ar: "تحصيل من عميل" }, value: "in" },
            { label: { en: "Supplier payment", ar: "دفعة لمورّد" }, value: "out" },
          ],
          admin: {
            description: {
              en: "Money in from a customer, or money out to a supplier.",
              ar: "مبلغ وارد من عميل، أو صادر إلى مورّد.",
            },
            placeholder: words({ en: "Pick a direction", ar: "اختر الاتجاه" }),
          },
        },
        {
          name: "reference",
          type: "text",
          required: true,
          label: { en: "Bank reference", ar: "المرجع البنكي" },
          admin: {
            description: {
              en: "The reference on the bank transfer or cheque.",
              ar: "المرجع على التحويل البنكي أو الشيك.",
            },
            placeholder: words({ en: "e.g. TRX-77412", ar: "مثال: TRX-77412" }),
          },
        },
        {
          name: "paidAt",
          type: "date",
          required: true,
          label: { en: "Paid At", ar: "تاريخ الدفع" },
          admin: {
            description: { en: "The day the money moved at the bank.", ar: "اليوم الذي تحرّك فيه المبلغ في البنك." },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "amount",
          type: "number",
          min: 0,
          required: true,
          label: { en: "Amount", ar: "المبلغ" },
          admin: {
            description: { en: "The amount that moved at the bank.", ar: "المبلغ الذي تحرّك في البنك." },
            placeholder: words({ en: "e.g. 48,200", ar: "مثال: 48,200" }),
          },
          custom: formats.money("currency"),
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          label: { en: "Currency", ar: "العملة" },
          admin: {
            description: { en: "The currency of the transfer.", ar: "عملة التحويل." },
            placeholder: words({ en: "EGP", ar: "EGP" }),
          },
        },
        {
          name: "fxRate",
          type: "number",
          min: 0,
          label: { en: "Actual FX", ar: "سعر الصرف الفعلي" },
          admin: {
            description: {
              en: "The rate the bank applied, in pounds per unit.",
              ar: "السعر الذي طبّقه البنك، بالجنيه لكل وحدة.",
            },
            placeholder: words({ en: "e.g. 48.6", ar: "مثال: 48.6" }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "invoice",
          type: "relationship",
          relationTo: "invoices",
          label: { en: "Invoice", ar: "الفاتورة" },
          admin: {
            condition: (_, s) => s?.direction === "in",
            description: {
              en: "The customer invoice this receipt is allocated to.",
              ar: "فاتورة العميل المخصص لها هذا التحصيل.",
            },
            placeholder: words({ en: "e.g. INV/2026/0412", ar: "مثال: INV/2026/0412" }),
          },
        },
        {
          name: "bill",
          type: "relationship",
          relationTo: "supplier-bills",
          label: { en: "Bill", ar: "فاتورة المورّد" },
          admin: {
            condition: (_, s) => s?.direction === "out",
            description: { en: "The supplier bill this payment settles.", ar: "فاتورة المورّد التي تسددها هذه الدفعة." },
            placeholder: words({ en: "e.g. DM-5512", ar: "مثال: DM-5512" }),
          },
        },
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          label: { en: "Purchase Order", ar: "أمر الشراء" },
          admin: {
            condition: (_, s) => s?.direction === "out",
            description: {
              en: "The purchase order a deposit or advance is paid against.",
              ar: "أمر الشراء الذي يُدفع عنه المقدّم أو الدفعة المسبقة.",
            },
            placeholder: words({ en: "e.g. PO/2026/0214", ar: "مثال: PO/2026/0214" }),
          },
        },
      ],
    },
    {
      name: "kind",
      type: "select",
      label: { en: "Kind", ar: "النوع" },
      options: labelled({
        "Deposit / advance": "مقدّم / دفعة مسبقة",
        Installment: "قسط",
        Balance: "رصيد",
        Full: "كامل",
      }),
      defaultValue: "Full",
      admin: {
        description: {
          en: "Whether this covers the whole amount or only a part.",
          ar: "هل تغطي الدفعة المبلغ كله أم جزءًا منه.",
        },
        placeholder: words({ en: "Pick a kind", ar: "اختر النوع" }),
      },
    },
    {
      name: "approval",
      type: "relationship",
      relationTo: "approvals",
      label: { en: "Approval", ar: "طلب الاعتماد" },
      admin: {
        condition: (_, s) => s?.direction === "out",
        description: {
          en: "The approved payment approval. A supplier payment cannot be recorded without it.",
          ar: "طلب اعتماد الدفع المعتمد، ولا تُسجَّل دفعة لمورّد بدونه.",
        },
        placeholder: words({ en: "Search approvals", ar: "ابحث في طلبات الاعتماد" }),
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Recorded",
      label: { en: "Status", ar: "الحالة" },
      options: labelled({ Planned: "مخطط", Recorded: "مسجّل", Reconciled: "مسوّى", Reversed: "معكوس" }),
      admin: {
        position: "sidebar",
        description: {
          en: "Recorded once the bank movement happened, Reconciled once matched.",
          ar: "مسجّل بعد حركة البنك، ومسوّى بعد المطابقة.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
  ],
};
