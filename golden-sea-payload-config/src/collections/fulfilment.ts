import type { CollectionConfig, PayloadRequest, TextFieldSingleValidation } from "payload";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import {
  CURRENCIES,
  DAY,
  TODAY,
  WAREHOUSES,
  WAREHOUSE_OPTIONS,
  autoNumber,
  caseRef,
  choices,
  computed,
  costVisible,
  deskAccess,
  evidence,
  financeAccess,
  fxRates,
  idOf,
  logActivity,
  management,
  related,
  ruleError,
  scalar,
} from "./shared.ts";
import { words } from "./shared.ts";
import * as link from "../links.ts";

type Doc = Record<string, unknown>;
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const round2 = (n: number) => Math.round(n * 100) / 100;
export const FINANCE_ROLES = ["management", "finance-director", "operations"];

export const arabic = (req: PayloadRequest | null | undefined) => req?.locale === "ar";

export const labelled = (ar: Record<string, string>) => choices(Object.keys(ar), ar);

export const APPROVAL_STATUS_AR: Record<string, string> = {
  Pending: "بانتظار القرار",
  "Approved 1 of 2": "اعتُمد 1 من 2",
  Approved: "معتمد",
  Rejected: "مرفوض",
};

export const PO_STATUS_AR: Record<string, string> = {
  Draft: "مسودة",
  "Awaiting approval": "بانتظار الاعتماد",
  Confirmed: "مؤكَّد",
  Acknowledged: "أقرّه المورّد",
  "Deposit paid": "المقدّم مدفوع",
  "Partially received": "مستلم جزئيًا",
  Received: "مستلم",
  Billed: "مفوتر",
  Closed: "مغلق",
  Cancelled: "ملغى",
};

const QC_AR: Record<string, string> = {
  OK: "سليم",
  Short: "ناقص",
  Damaged: "تالف",
  "Wrong item": "صنف خاطئ",
  "Shelf life too short": "مدة الصلاحية قصيرة",
  "Certificate missing": "الشهادة ناقصة",
};

export const CASE_PLACEHOLDER = { en: "e.g. GS-RFQ-0142", ar: "مثال: GS-RFQ-0142" };

const BILL_STATUS_AR: Record<string, string> = {
  Received: "مستلمة",
  Matched: "مطابَقة",
  "On hold": "معلّقة",
  "Approved for payment": "معتمدة للدفع",
  Paid: "مدفوعة",
  "Credit note": "إشعار دائن",
  Cancelled: "ملغاة",
};

export const moneyText = (n: number, cur: string) => {
  const whole = cur === "EGP" || Math.abs(n) >= 100000;
  return `${cur} ${n.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 })}`;
};
const DAY_FMT = {
  en: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
  ar: new Intl.DateTimeFormat("ar-EG-u-nu-latn", { day: "2-digit", month: "short", timeZone: "UTC" }),
};
export const dayText = (iso: unknown, locale?: string | null) =>
  typeof iso === "string" && iso && !Number.isNaN(new Date(iso).getTime())
    ? DAY_FMT[locale === "ar" ? "ar" : "en"].format(new Date(iso))
    : "—";

export function once<T>(req: PayloadRequest, key: string, load: () => Promise<T>): Promise<T> {
  const ctx = (req.context ??= {}) as Record<string, Promise<unknown> | undefined>;
  ctx[`once:${key}`] ??= load();
  return ctx[`once:${key}`] as Promise<T>;
}
export const findAll = async (req: PayloadRequest, collection: string, where?: Record<string, unknown>) =>
  (
    await req.payload.find({
      locale: req.locale,
      collection: collection as never,
      where: where as never,
      depth: 0,
      limit: 0,
    })
  ).docs as unknown as Doc[];

const moneyOut = (req: PayloadRequest) =>
  once(req, "money-out", async () => {
    const [bills, payments, approvals] = await Promise.all([
      findAll(req, "supplier-bills"),
      findAll(req, "payments", { direction: { equals: "out" } }),
      findAll(req, "approvals"),
    ]);
    return { bills, payments, approvals };
  });

const deliveriesOf = (req: PayloadRequest, caseId: string) =>
  once(req, `deliveries:${caseId}`, () => findAll(req, "deliveries", { case: { equals: caseId } }));

const costsFor = (req: PayloadRequest) => !req.context?.seed && costVisible({ req });

export const PAYABLE_STAGES = [
  "Deposit to pay",
  "Balance due",
  "Bill matched",
  "Balance on delivery",
  "Awaiting bill",
  "Bill on hold",
] as const;
export const PAYMENT_APPROVAL_TYPES = ["Supplier deposit (payment)", "Supplier payment"];

const names = (a: Doc, number: string) =>
  Boolean(number) && (scalar(a.detail).includes(number) || scalar(a.title).includes(number));

export function payableOf(
  po: Doc,
  { bills, payments, approvals }: { bills: Doc[]; payments: Doc[]; approvals: Doc[] },
) {
  if (["Draft", "Awaiting approval", "Cancelled", "Closed"].includes(scalar(po.status))) return null;
  const id = idOf(po.id);
  const number = scalar(po.number);
  const side = (po.supplierSide ?? {}) as Doc;
  const bill = bills.find((b) => idOf(b.purchaseOrder) === id && b.status !== "Cancelled");
  const out = payments.filter((p) => p.direction === "out");
  const paid = round2(
    out
      .filter((p) => idOf(p.purchaseOrder) === id || (bill ? idOf(p.bill) === idOf(bill.id) : false))
      .reduce((s, p) => s + num(p.amount), 0),
  );
  const total = num(bill?.amount ?? po.total);
  const balance = round2(Math.max(0, total - paid));
  if (!balance) return null;
  const depositPct = num(side.depositPct);
  const deposit = round2((num(po.total) * depositPct) / 100);
  const depositApproval = approvals.find((a) => /deposit/i.test(scalar(a.type)) && names(a, number));
  const recorded = new Set(out.map((p) => idOf(p.approval)).filter(Boolean));
  const paymentApproval = approvals.some(
    (a) =>
      PAYMENT_APPROVAL_TYPES.includes(scalar(a.type)) &&
      !(a.status === "Approved" && recorded.has(idOf(a.id))) &&
      a.status !== "Rejected" &&
      names(a, number),
  );
  const depositDue = deposit > 0 && paid < deposit;
  const due = depositDue
    ? TODAY.toISOString()
    : scalar(bill?.dueDate) || scalar(side.balanceDue) || new Date(TODAY.getTime() + 30 * DAY).toISOString();
  const stage: (typeof PAYABLE_STAGES)[number] = depositDue
    ? "Deposit to pay"
    : bill?.status === "On hold"
      ? "Bill on hold"
      : paid && side.balanceDue
        ? "Balance on delivery"
        : bill
          ? paid
            ? "Balance due"
            : "Bill matched"
          : "Awaiting bill";
  return {
    stage,
    currency: scalar(bill?.currency ?? po.currency) || "EGP",
    total,
    paid,
    balance,
    deposit,
    depositPct,
    toPay: depositDue ? deposit - paid : balance,
    due,
    bill: bill
      ? {
          id: scalar(bill.id),
          number: scalar(bill.billNumber),
          status: scalar(bill.status),
          holdReason: scalar(bill.holdReason) || null,
        }
      : null,
    depositApproval: depositApproval
      ? { id: scalar(depositApproval.id), status: scalar(depositApproval.status) }
      : null,
    paymentApproval,
  };
}
export type Payable = NonNullable<ReturnType<typeof payableOf>>;

export function backorderOf(r: Doc, deliveries: Doc[]) {
  if (!(num(r.shortfall) > 0)) return null;
  const sorted = [...deliveries].sort((a, b) => scalar(a.plannedAt).localeCompare(scalar(b.plannedAt)));
  const later = sorted.find(
    (d, i) =>
      i > 0 &&
      !/confirmed|Cancelled/.test(scalar(d.status)) &&
      ((d.lines as { lineNo?: number }[] | undefined) ?? []).some((l) => l.lineNo === r.lineNo),
  );
  const ready = scalar((later?.plan as Doc | undefined)?.readyAt) || scalar(later?.plannedAt);
  return {
    followsIn: later ? scalar(later.number) : null,
    late: Boolean(ready && r.backorderDate && scalar(r.backorderDate) > ready),
  };
}

export const PurchaseOrders: CollectionConfig = {
  slug: "purchase-orders",
  labels: {
    singular: { en: "Purchase order", ar: "أمر شراء" },
    plural: { en: "Purchase orders", ar: "أوامر الشراء" },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Request payment approval", ar: "طلب اعتماد الدفعة" }),
        when: { "payable.requestable": { equals: true } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/request-approval", body: { payable: "$row.id" } },
        confirm: {
          heading: words({
            en: "Request payment approval — $row.supplier.name",
            ar: "طلب اعتماد الدفعة — $row.supplier.name",
          }),
          text: words({
            en: "$row.payable.summary.\nRouted to Mohamed Helmy (Financial Director) or Karim Balbaa (CEO).",
            ar: "$row.payable.summary.\nيُحال إلى Mohamed Helmy (المدير المالي) أو Karim Balbaa (الرئيس التنفيذي).",
          }),
          label: words({ en: "Request approval", ar: "طلب الاعتماد" }),
        },
        done: words({
          en: "Payment approval requested from Mohamed Helmy or Karim Balbaa.",
          ar: "طُلب اعتماد الدفعة من Mohamed Helmy أو Karim Balbaa.",
        }),
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "supplier", "total", "currency", "status"],
    group: { en: "Fulfilment", ar: "التنفيذ" },
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: management,
  },
  hooks: {
    beforeValidate: [autoNumber("purchase-orders", "number", "P")],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const lines = (data.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? [];
        data.total =
          Math.round(lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0) * 100) / 100;
        if (data.status === "Confirmed" && originalDoc?.status !== "Confirmed") {
          if (!data.recheckDone)
            throw ruleError(
              arabic(req)
                ? "أعد التحقق من التوفر والتكلفة وسعر الصرف ومدة التوريد قبل التأكيد."
                : "Re-check availability, cost, FX and lead time before confirming.",
            );
          if (req.user?.role !== "management" && !req.context?.seed)
            throw ruleError(
              arabic(req) ? "أوامر الشراء من الموردين تعتمدها الإدارة." : "Supplier POs are approved by management.",
            );
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
              en: "Numbered automatically when the order is saved, like PO/2026/0214.",
              ar: "يُرقَّم تلقائيًا عند حفظ الأمر، مثل PO/2026/0214.",
            },
          },
        },
        caseRef(true, {
          placeholder: CASE_PLACEHOLDER,
          hint: {
            en: "The customer case this supplier order is placed for.",
            ar: "ملف العميل الذي صدر له أمر الشراء من المورّد.",
          },
        }),
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          label: { en: "Supplier", ar: "المورّد" },
          admin: {
            description: { en: "The supplier the goods are ordered from.", ar: "المورّد الذي تُطلب منه البضاعة." },
            placeholder: words({ en: "e.g. Delta Marine Stores", ar: "مثال: Delta Marine Stores" }),
          },
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      minRows: 1,
      label: { en: "Lines", ar: "البنود" },
      admin: {
        description: {
          en: "What is ordered from the supplier, one row per item.",
          ar: "ما يُطلب من المورّد، صف لكل صنف.",
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
                description: {
                  en: "The line's position on the order, starting at 1.",
                  ar: "ترتيب البند في الأمر، بدءًا من 1.",
                },
                placeholder: words({ en: "e.g. 1", ar: "مثال: 1" }),
              },
            },
            {
              name: "offer",
              type: "relationship",
              relationTo: "offers",
              label: { en: "Offer", ar: "العرض" },
              admin: {
                description: {
                  en: "The accepted supplier offer this line was ordered from.",
                  ar: "عرض المورّد المقبول الذي طُلب منه هذا البند.",
                },
                placeholder: words({ en: "Search offers", ar: "ابحث في العروض" }),
              },
            },
            {
              name: "description",
              type: "text",
              required: true,
              localized: true,
              label: { en: "Description", ar: "الوصف" },
              admin: {
                description: { en: "The item as the supplier will read it.", ar: "الصنف كما سيقرؤه المورّد." },
                placeholder: words({ en: "e.g. Coverall FR, size L", ar: "مثال: أفرول مقاوم للهب، مقاس L" }),
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
              min: 0,
              required: true,
              label: { en: "Qty", ar: "الكمية" },
              admin: {
                description: {
                  en: "How many units are ordered. Receipts and bills are matched against it.",
                  ar: "عدد الوحدات المطلوبة، وتُطابَق عليه إيصالات الاستلام والفواتير.",
                },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
            {
              name: "unitPrice",
              type: "number",
              min: 0,
              required: true,
              access: { read: costVisible },
              label: { en: "Unit Price", ar: "سعر الوحدة" },
              admin: {
                description: {
                  en: "The supplier's price per unit, in the order's currency, before VAT.",
                  ar: "سعر المورّد للوحدة بعملة الأمر، قبل ضريبة القيمة المضافة.",
                },
                placeholder: words({ en: "e.g. 1,650", ar: "مثال: 1,650" }),
              },
            },
            {
              name: "scheduledFor",
              type: "date",
              label: { en: "Scheduled for", ar: "موعد التوريد" },
              admin: {
                description: {
                  en: "The date the supplier promises to deliver this line.",
                  ar: "التاريخ الذي يتعهد فيه المورّد بتوريد هذا البند.",
                },
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
          required: true,
          defaultValue: "EGP",
          label: { en: "Currency", ar: "العملة" },
          admin: {
            description: {
              en: "The currency the supplier invoices this order in.",
              ar: "العملة التي يصدر بها المورّد فاتورة هذا الأمر.",
            },
            placeholder: words({ en: "EGP", ar: "EGP" }),
          },
        },
        {
          name: "total",
          type: "number",
          min: 0,
          access: { read: costVisible },
          label: { en: "Total", ar: "الإجمالي" },
          admin: {
            readOnly: true,
            description: {
              en: "Quantity times unit price, summed over all lines.",
              ar: "الكمية مضروبة في سعر الوحدة، مجموعة لكل البنود.",
            },
          },
          custom: formats.money("currency"),
        },
        {
          name: "deliverTo",
          type: "select",
          label: { en: "Route", ar: "المسار" },
          admin: {
            description: {
              en: "Where the goods go: a Golden Sea warehouse, or straight to the vessel.",
              ar: "وجهة البضاعة: أحد مخازن Golden Sea أو مباشرة إلى السفينة.",
            },
            placeholder: words({ en: "e.g. Warehouse · Alexandria", ar: "مثال: مخزن · الإسكندرية" }),
          },
          options: [
            ...WAREHOUSE_OPTIONS.map((o) => ({
              label: { en: `Warehouse · ${o.label.en}`, ar: `مخزن · ${o.label.ar}` },
              value: o.value,
            })),
            { label: { en: "Drop-ship to vessel", ar: "شحن مباشر إلى السفينة" }, value: "Direct to vessel (dropship)" },
          ],
          custom: tones({
            ...Object.fromEntries(WAREHOUSES.map((w) => [w, "neutral" as const])),
            "Direct to vessel (dropship)": "info",
          }),
        },
      ],
    },
    computed(
      {
        name: "linesSummary",
        type: "text",
        label: { en: "Lines", ar: "البنود" },
        admin: {
          description: {
            en: "Every line in one row, for lists and the case page.",
            ar: "كل البنود في سطر واحد، للقوائم وصفحة الملف.",
          },
        },
      },
      (po, req) =>
        ((po.lines as Doc[] | undefined) ?? [])
          .map(
            (l) =>
              `L${num(l.lineNo)} · ${num(l.qty)} × ${scalar(l.description)}${costVisible({ req }) && l.unitPrice != null ? ` · ${moneyText(num(l.unitPrice), scalar(po.currency))}` : ""}`,
          )
          .join("; "),
    ),
    {
      name: "recheck",
      type: "array",
      label: { en: "Recheck", ar: "إعادة التحقق" },
      labels: {
        singular: { en: "Re-check", ar: "إعادة تحقق" },
        plural: { en: "Re-check before approval", ar: "إعادة التحقق قبل الاعتماد" },
      },
      admin: {
        description: {
          en: "What is checked against the supplier again before the order is approved.",
          ar: "ما يُراجَع مع المورّد مرة أخرى قبل اعتماد الأمر.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "item",
              type: "text",
              required: true,
              localized: true,
              label: { en: "Item", ar: "البند" },
              admin: {
                description: {
                  en: "The price, stock or lead time being re-checked.",
                  ar: "السعر أو المخزون أو مدة التوريد قيد إعادة التحقق.",
                },
                placeholder: words({ en: "e.g. Unit price, Coverall FR", ar: "مثال: سعر الوحدة، أفرول مقاوم للهب" }),
              },
            },
            {
              name: "atQuotation",
              type: "text",
              label: { en: "At Quotation", ar: "عند التسعير" },
              admin: {
                description: { en: "The value when the supplier quoted.", ar: "القيمة وقت عرض المورّد." },
                placeholder: words({ en: "e.g. EGP 1,650", ar: "مثال: EGP 1,650" }),
              },
            },
            {
              name: "now",
              type: "text",
              label: { en: "Now", ar: "الآن" },
              admin: {
                description: { en: "The value the supplier gives today.", ar: "القيمة التي يعطيها المورّد اليوم." },
                placeholder: words({ en: "e.g. EGP 1,720", ar: "مثال: EGP 1,720" }),
              },
            },
            {
              name: "ok",
              type: "checkbox",
              defaultValue: true,
              label: { en: "Ok", ar: "سليم" },
              admin: {
                description: {
                  en: "Untick when the value changed and needs a decision.",
                  ar: "أزل العلامة إذا تغيّرت القيمة واحتاجت إلى قرار.",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "recheckDone",
      type: "checkbox",
      label: { en: "Re-check completed", ar: "اكتملت إعادة التحقق" },
      defaultValue: false,
      admin: {
        description: {
          en: "Tick once every re-check row has been confirmed with the supplier.",
          ar: "ضع علامة بعد تأكيد كل صفوف إعادة التحقق مع المورّد.",
        },
      },
    },
    {
      name: "supplierSide",
      type: "group",
      label: { en: "Supplier documents", ar: "مستندات المورّد" },
      admin: {
        description: {
          en: "The supplier's acknowledgement, pro forma and deposit terms.",
          ar: "إقرار المورّد والفاتورة المبدئية وشروط الدفعة المقدمة.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "acknowledgedAt",
              type: "date",
              label: { en: "Acknowledged At", ar: "تاريخ الإقرار" },
              admin: {
                description: {
                  en: "The day the supplier confirmed they accept the order.",
                  ar: "اليوم الذي أكّد فيه المورّد قبول الأمر.",
                },
              },
            },
            {
              name: "proforma",
              type: "text",
              label: { en: "Pro forma no.", ar: "رقم الفاتورة المبدئية" },
              admin: {
                description: {
                  en: "The number printed on the supplier's pro forma invoice.",
                  ar: "الرقم المطبوع على الفاتورة المبدئية للمورّد.",
                },
                placeholder: words({ en: "e.g. PF-2026-0387", ar: "مثال: PF-2026-0387" }),
              },
            },
            evidence(
              "proformaFile",
              { en: "Pro forma", ar: "الفاتورة المبدئية" },
              {
                hint: {
                  en: "The supplier's pro forma invoice, as a scan or PDF.",
                  ar: "الفاتورة المبدئية للمورّد، صورة ممسوحة أو PDF.",
                },
              },
            ),
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "depositPct",
              type: "number",
              min: 0,
              max: 100,
              label: { en: "Deposit %", ar: "نسبة المقدّم %" },
              admin: {
                description: {
                  en: "Share of the total the supplier wants up front, from 0 to 100.",
                  ar: "نسبة الإجمالي التي يطلبها المورّد مقدمًا، من 0 إلى 100.",
                },
                placeholder: words({ en: "e.g. 30", ar: "مثال: 30" }),
              },
            },
            {
              name: "depositPayment",
              type: "relationship",
              relationTo: "payments",
              label: { en: "Deposit Payment", ar: "دفعة المقدّم" },
              admin: {
                description: {
                  en: "The recorded payment that covered the deposit.",
                  ar: "الدفعة المسجلة التي غطّت المقدّم.",
                },
                placeholder: words({ en: "Search payments", ar: "ابحث في الدفعات" }),
              },
            },
            {
              name: "balanceDue",
              type: "date",
              label: { en: "Balance Due", ar: "استحقاق الرصيد" },
              admin: {
                description: {
                  en: "When the rest is due, usually on delivery.",
                  ar: "موعد استحقاق الباقي، عادةً عند التسليم.",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      label: { en: "Status", ar: "الحالة" },
      options: labelled(PO_STATUS_AR),
      custom: tones({
        Draft: "neutral",
        "Awaiting approval": "warning",
        Confirmed: "info",
        Acknowledged: "info",
        "Deposit paid": "info",
        "Partially received": "warning",
        Received: "success",
        Billed: "success",
        Closed: "neutral",
        Cancelled: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: { en: "Where the order is, from draft to closed.", ar: "مرحلة الأمر، من المسودة إلى الإغلاق." },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
    computed(
      {
        name: "statusNote",
        type: "text",
        label: { en: "Progress", ar: "التقدّم" },
        admin: {
          description: { en: "Acknowledgement and re-check in one line.", ar: "الإقرار وإعادة التحقق في سطر واحد." },
        },
        custom: {
          toneWhen: [{ when: { recheckDone: { equals: true }, "recheck.ok": { equals: false } }, tone: "warning" }],
        },
      },
      (po, req) => {
        const ar = arabic(req);
        const side = (po.supplierSide ?? {}) as Doc;
        const flagged = ((po.recheck as { ok?: boolean }[] | undefined) ?? []).some((x) => x.ok === false);
        return [
          side.acknowledgedAt
            ? `${ar ? "أقرّه المورّد" : "Acknowledged"} ${dayText(side.acknowledgedAt, req?.locale)}`
            : "",
          po.recheckDone
            ? ar
              ? `أُعيد التحقق${flagged ? " · رُصد تغيير" : ""}`
              : `Re-checked${flagged ? " · change flagged" : ""}`
            : "",
        ]
          .filter(Boolean)
          .join(" · ");
      },
    ),
    computed(
      {
        name: "deposit",
        type: "group",
        label: { en: "Pro forma · deposit", ar: "الفاتورة المبدئية · المقدّم" },
        admin: {
          condition: () => false,
          description: {
            en: "The pro forma deposit and where its payment stands.",
            ar: "مقدّم الفاتورة المبدئية وموقف دفعه.",
          },
        },
        fields: [
          {
            name: "text",
            type: "text",
            label: { en: "Pro forma · deposit", ar: "الفاتورة المبدئية · المقدّم" },
            admin: {
              description: {
                en: "Deposit share, amount and pro forma number.",
                ar: "نسبة المقدّم ومبلغه ورقم الفاتورة المبدئية.",
              },
              placeholder: words({ en: "e.g. 30% · EGP 49,500", ar: "مثال: 30% · EGP 49,500" }),
            },
            custom: { href: "$row.deposit.href" },
          },
          {
            name: "note",
            type: "text",
            label: { en: "Note", ar: "ملاحظة" },
            admin: {
              description: {
                en: "Whether the deposit is paid or waiting for approval.",
                ar: "هل دُفع المقدّم أم ينتظر الاعتماد.",
              },
              placeholder: words({ en: "e.g. Needs payment approval", ar: "مثال: يحتاج إلى اعتماد الدفع" }),
            },
            custom: {
              toneWhen: [
                { when: { "deposit.state": { in: ["Paid", "Approved"] } }, tone: "success" },
                { when: { "deposit.state": { equals: "Rejected" } }, tone: "error" },
                { when: { "deposit.state": { in: ["In approval", "Needs approval"] } }, tone: "warning" },
              ],
            },
          },
          {
            name: "state",
            type: "select",
            label: { en: "State", ar: "المرحلة" },
            options: labelled({
              Paid: "مدفوع",
              Approved: "معتمد",
              Rejected: "مرفوض",
              "In approval": "قيد الاعتماد",
              "Needs approval": "يحتاج إلى اعتماد",
            }),
            admin: {
              description: { en: "The deposit payment stage.", ar: "مرحلة دفع المقدّم." },
              placeholder: words({ en: "Pick a stage", ar: "اختر المرحلة" }),
            },
          },
          {
            name: "href",
            type: "text",
            label: { en: "Href", ar: "الرابط" },
            admin: {
              description: {
                en: "Link to the cash page while the payment is in approval.",
                ar: "رابط صفحة النقدية أثناء اعتماد الدفع.",
              },
              placeholder: words({ en: "e.g. /cash", ar: "مثال: /cash" }),
            },
          },
        ],
      },
      async (po, req) => {
        if (!costsFor(req)) return null;
        const ar = arabic(req);
        const side = (po.supplierSide ?? {}) as Doc;
        const proforma = scalar(side.proforma);
        const depositPct = num(side.depositPct);
        if (!depositPct)
          return { text: proforma || (ar ? "بلا مقدّم" : "No deposit"), note: "", state: null, href: null };
        const { payments, approvals } = await moneyOut(req);
        const id = idOf(po.id);
        const number = scalar(po.number);
        const cur = scalar(po.currency);
        const paid = round2(
          payments.filter((p) => idOf(p.purchaseOrder) === id).reduce((s, p) => s + num(p.amount), 0),
        );
        const ofCase = approvals.filter((a) => idOf(a.case) === idOf(po.case));
        const approval =
          ofCase.find((a) => /deposit|payment|PO/i.test(scalar(a.type)) && scalar(a.detail).includes(number)) ??
          ofCase.find((a) => idOf((a.subject as Doc | undefined)?.value) === id || scalar(a.title).includes(number));
        const due = side.balanceDue
          ? ar
            ? ` · الرصيد عند التسليم · ${dayText(side.balanceDue, "ar")}`
            : ` · Balance on delivery · ${dayText(side.balanceDue)}`
          : "";
        const status = scalar(approval?.status);
        return {
          text: `${depositPct}% · ${moneyText(round2((num(po.total) * depositPct) / 100), cur)}${proforma ? ` · ${proforma}` : ""}`,
          note: ar
            ? paid > 0
              ? `دُفع المقدّم ${moneyText(paid, cur)}${due}`
              : approval
                ? `اعتماد الدفع: ${APPROVAL_STATUS_AR[status] ?? status}${due}`
                : `يحتاج إلى اعتماد الدفع${due}`
            : paid > 0
              ? `Deposit paid ${moneyText(paid, cur)}${due}`
              : approval
                ? `Payment approval: ${status}${due}`
                : `Needs payment approval${due}`,
          state:
            paid > 0
              ? "Paid"
              : !approval
                ? "Needs approval"
                : status === "Approved"
                  ? "Approved"
                  : /rejected|returned/i.test(status)
                    ? "Rejected"
                    : "In approval",
          href: paid <= 0 && approval ? link.view("/cash") : null,
        };
      },
    ),
    computed(
      {
        name: "payable",
        type: "group",
        label: { en: "Payable", ar: "المستحق للمورّد" },
        admin: {
          condition: () => false,
          description: {
            en: "What Golden Sea still owes the supplier on this order.",
            ar: "ما زال على Golden Sea للمورّد عن هذا الأمر.",
          },
        },
        fields: [
          {
            name: "stage",
            type: "select",
            label: { en: "Stage", ar: "المرحلة" },
            options: labelled({
              "Deposit to pay": "مقدّم مستحق الدفع",
              "Balance due": "رصيد مستحق",
              "Bill matched": "فاتورة مطابَقة",
              "Balance on delivery": "رصيد عند التسليم",
              "Awaiting bill": "بانتظار الفاتورة",
              "Bill on hold": "فاتورة معلّقة",
            } satisfies Record<(typeof PAYABLE_STAGES)[number], string>),
            admin: {
              description: {
                en: "How far the payable has got, from awaiting bill to balance due.",
                ar: "مرحلة المستحق، من انتظار الفاتورة إلى استحقاق الرصيد.",
              },
              placeholder: words({ en: "e.g. Balance due", ar: "مثال: رصيد مستحق" }),
            },
            custom: tones({
              "Deposit to pay": "warning",
              "Balance due": "warning",
              "Bill matched": "neutral",
              "Balance on delivery": "neutral",
              "Awaiting bill": "neutral",
              "Bill on hold": "error",
            }),
          },
          {
            name: "currency",
            type: "text",
            label: { en: "Currency", ar: "العملة" },
            admin: {
              description: { en: "The currency the order is payable in.", ar: "العملة المستحق بها الأمر." },
              placeholder: words({ en: "e.g. USD", ar: "مثال: USD" }),
            },
          },
          {
            name: "total",
            type: "number",
            label: { en: "Total", ar: "الإجمالي" },
            admin: {
              description: { en: "The order total in its own currency.", ar: "إجمالي الأمر بعملته." },
              placeholder: words({ en: "e.g. 49,500", ar: "مثال: 49,500" }),
            },
            custom: formats.money("currency"),
          },
          {
            name: "paid",
            type: "number",
            label: { en: "Paid", ar: "المدفوع" },
            admin: {
              description: { en: "What has been paid to the supplier so far.", ar: "ما دُفع للمورّد حتى الآن." },
              placeholder: words({ en: "e.g. 14,850", ar: "مثال: 14,850" }),
            },
            custom: formats.money("currency"),
          },
          {
            name: "balance",
            type: "number",
            label: { en: "Balance", ar: "الرصيد" },
            admin: {
              description: { en: "What is still owed, in the order's currency.", ar: "المتبقي المستحق بعملة الأمر." },
              placeholder: words({ en: "e.g. 34,650", ar: "مثال: 34,650" }),
            },
            custom: formats.money("currency"),
          },
          {
            name: "balanceEgp",
            type: "number",
            label: { en: "Balance (EGP)", ar: "الرصيد (EGP)" },
            admin: {
              description: { en: "The balance at today's FX rate, in pounds.", ar: "الرصيد بسعر صرف اليوم، بالجنيه." },
              placeholder: words({ en: "e.g. 1,684,000", ar: "مثال: 1,684,000" }),
            },
            custom: formats.money("EGP"),
          },
          {
            name: "due",
            type: "date",
            virtual: true,
            label: { en: "Due", ar: "الاستحقاق" },
            admin: {
              description: {
                en: "When the next payment to the supplier falls due.",
                ar: "موعد استحقاق الدفعة التالية للمورّد.",
              },
            },
          },
          {
            name: "supplier",
            type: "text",
            label: { en: "Supplier", ar: "المورّد" },
            admin: {
              description: {
                en: "The supplier name, linking to the order on its case.",
                ar: "اسم المورّد، مع رابط الأمر في ملفه.",
              },
              placeholder: words({ en: "e.g. Delta Marine Stores", ar: "مثال: Delta Marine Stores" }),
            },
            custom: { href: link.doc("cases", "$row.case", "order") },
          },
          {
            name: "ref",
            type: "text",
            label: { en: "Reference", ar: "المرجع" },
            admin: {
              description: {
                en: "Order number, case and bill in one line.",
                ar: "رقم الأمر والملف والفاتورة في سطر واحد.",
              },
              placeholder: words({ en: "e.g. PO/2026/0214 · GS-0142", ar: "مثال: PO/2026/0214 · GS-0142" }),
            },
          },
          {
            name: "note",
            type: "text",
            label: { en: "Note", ar: "ملاحظة" },
            admin: {
              description: { en: "A bill hold reason or the deposit terms.", ar: "سبب تعليق الفاتورة أو شروط المقدّم." },
              placeholder: words({ en: "e.g. Deposit 30% EGP 14,850 · paid", ar: "مثال: مقدّم 30% EGP 14,850 · مدفوع" }),
            },
            custom: { toneWhen: [{ when: { "payable.stage": { equals: "Bill on hold" } }, tone: "error" }] },
          },
          {
            name: "next",
            type: "text",
            label: { en: "Next", ar: "التالي" },
            admin: {
              description: { en: "What the payable is waiting for, if anything.", ar: "ما ينتظره المستحق، إن وُجد." },
              placeholder: words({ en: "e.g. Approval in progress", ar: "مثال: الاعتماد جارٍ" }),
            },
          },
          {
            name: "requestable",
            type: "checkbox",
            label: { en: "Requestable", ar: "قابل للطلب" },
            admin: {
              description: {
                en: "On when finance can ask for approval to pay it now.",
                ar: "مفعّل حين تستطيع المالية طلب اعتماد دفعه الآن.",
              },
            },
          },
          {
            name: "summary",
            type: "text",
            label: { en: "Summary", ar: "الملخص" },
            admin: {
              description: {
                en: "The payable in one line for the approval request.",
                ar: "المستحق في سطر واحد لطلب الاعتماد.",
              },
              placeholder: words({
                en: "e.g. Delta Marine Stores · PO/2026/0214 · balance EGP 34,650",
                ar: "مثال: Delta Marine Stores · PO/2026/0214 · الرصيد EGP 34,650",
              }),
            },
          },
        ],
      },
      async (po, req) => {
        if (!costsFor(req)) return null;
        const p = payableOf(po, await moneyOut(req));
        if (!p) return null;
        const ar = arabic(req);
        const fx = await fxRates(req);
        const [supplier, caseDoc] = await Promise.all([
          related(req, "suppliers", po.supplier),
          related(req, "cases", po.case),
        ]);
        const number = scalar(po.number);
        const caseId = scalar(caseDoc?.caseId);
        const next =
          p.stage === "Bill on hold"
            ? ar
              ? "بانتظار الاستلام / إشعار دائن"
              : "Waits for receipt / credit note"
            : p.paymentApproval || p.depositApproval
              ? ar
                ? "الاعتماد جارٍ"
                : "Approval in progress"
              : "";
        const billWord = ar ? "فاتورة" : "bill";
        const depositNote = !p.depositPct
          ? ""
          : ar
            ? `مقدّم ${p.depositPct}% ${moneyText(p.deposit, p.currency)}${p.paid ? " · مدفوع" : p.depositApproval ? ` · الاعتماد ${APPROVAL_STATUS_AR[p.depositApproval.status] ?? p.depositApproval.status}` : ""}`
            : `Deposit ${p.depositPct}% ${moneyText(p.deposit, p.currency)}${p.paid ? " · paid" : p.depositApproval ? ` · approval ${p.depositApproval.status}` : ""}`;
        const billStatus = p.bill ? (ar ? (BILL_STATUS_AR[p.bill.status] ?? p.bill.status) : p.bill.status) : "";
        return {
          stage: p.stage,
          currency: p.currency,
          total: p.total,
          paid: p.paid,
          balance: p.balance,
          balanceEgp: Math.round(p.balance * (fx[p.currency] ?? 1)),
          due: p.due,
          supplier: scalar(supplier?.name),
          ref: `${number}${caseId ? ` · ${caseId}` : ""}${p.bill ? ` · ${billWord} ${p.bill.number}` : ""}`,
          note: [p.bill?.holdReason ?? "", depositNote].filter(Boolean).join(" · "),
          next,
          requestable: !next,
          summary: ar
            ? `${scalar(supplier?.name)} · ${number} · الرصيد ${moneyText(p.balance, p.currency)} مستحق ${dayText(p.due, "ar")}${p.bill ? ` · فاتورة ${p.bill.number} ${billStatus}` : ""}`
            : `${scalar(supplier?.name)} · ${number} · balance ${moneyText(p.balance, p.currency)} due ${dayText(p.due)}${p.bill ? ` · bill ${p.bill.number} ${billStatus}` : ""}`,
        };
      },
    ),
  ],
};

const uniqueBillNumber: TextFieldSingleValidation = async (value, { req, siblingData, id }) => {
  const supplier = idOf((siblingData as { supplier?: unknown } | undefined)?.supplier);
  if (!value || !supplier) return true;
  const { docs } = await req.payload.find({
    locale: req.locale,
    collection: "supplier-bills" as never,
    where: { and: [{ billNumber: { equals: value } }, { supplier: { equals: supplier } }] },
    depth: 0,
    limit: 2,
  });
  return docs.some((d) => String((d as { id: unknown }).id) !== String(id))
    ? arabic(req)
      ? "فاتورة مكررة: رقم فاتورة هذا المورّد مسجّل بالفعل."
      : "Duplicate bill: this supplier's bill number is already booked."
    : true;
};

export const SupplierBills: CollectionConfig = {
  slug: "supplier-bills",
  labels: {
    singular: { en: "Supplier bill", ar: "فاتورة مورّد" },
    plural: { en: "Supplier bills", ar: "فواتير الموردين" },
  },
  custom: {
    actions: [
      {
        label: words({ en: "Book incoming bill", ar: "قيد فاتورة واردة" }),
        when: { status: { not_in: ["Paid", "Cancelled", "Credit note"] } },
        roles: FINANCE_ROLES,
        call: { path: "/case-order/book-bill", body: { bill: "$row.id" } },
        confirm: {
          heading: words({ en: "Book incoming supplier bill", ar: "قيد فاتورة مورّد واردة" }),
          text: words({
            en: "Bill from $row.supplier.name received by email: $row.summary — read by AI (confidence 98%).\nBooking checks the bill number against this supplier's bills first.",
            ar: "فاتورة من $row.supplier.name وصلت بالبريد: $row.summary — قرأها الذكاء الاصطناعي (الثقة 98%).\nيتحقق القيد أولًا من رقم الفاتورة مقابل فواتير هذا المورّد.",
          }),
          label: words({ en: "Book bill", ar: "قيد الفاتورة" }),
        },
        done: words({ en: "Bill booked.", ar: "قُيّدت الفاتورة." }),
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "billNumber",
    defaultColumns: ["billNumber", "supplier", "purchaseOrder", "amount", "status", "dueDate"],
    group: { en: "Fulfilment", ar: "التنفيذ" },
  },
  access: financeAccess,
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.case && data.purchaseOrder) {
          const po = await related(req, "purchase-orders", idOf(data.purchaseOrder));
          if (po?.case) data.case = idOf(po.case);
        }
        return data;
      },
      ({ data }) => {
        const lines = (data.match as { ordered?: number; received?: number; billed?: number }[] | undefined) ?? [];
        const mismatch = lines.find(
          (l) => Number(l.billed) > Number(l.received) || Number(l.received) > Number(l.ordered),
        );
        if (!["Paid", "Cancelled", "Credit note"].includes(String(data.status))) {
          data.status = mismatch ? "On hold" : lines.length ? "Matched" : (data.status ?? "Received");
          data.holdReason = mismatch
            ? `Billed ${mismatch.billed}, received ${mismatch.received}, ordered ${mismatch.ordered}`
            : null;
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
          name: "billNumber",
          type: "text",
          required: true,
          validate: uniqueBillNumber,
          label: { en: "Bill Number", ar: "رقم الفاتورة" },
          admin: {
            description: {
              en: "The number printed on the supplier's bill. Each supplier's number can be entered once.",
              ar: "الرقم المطبوع على فاتورة المورّد، ويُسجَّل رقم كل مورّد مرة واحدة.",
            },
            placeholder: words({ en: "e.g. DM-5512", ar: "مثال: DM-5512" }),
          },
        },
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          label: { en: "Supplier", ar: "المورّد" },
          admin: {
            description: { en: "The supplier who issued the bill.", ar: "المورّد الذي أصدر الفاتورة." },
            placeholder: words({ en: "e.g. Delta Marine Stores", ar: "مثال: Delta Marine Stores" }),
          },
        },
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          label: { en: "PO", ar: "أمر الشراء" },
          admin: {
            description: {
              en: "The purchase order the bill is for, used for the 3-way match.",
              ar: "أمر الشراء الخاص بالفاتورة، ويُستخدم للمطابقة الثلاثية.",
            },
            placeholder: words({ en: "e.g. PO/2026/0214", ar: "مثال: PO/2026/0214" }),
          },
        },
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          index: true,
          label: { en: "Case", ar: "الملف" },
          admin: { readOnly: true, description: { en: "The PO's case.", ar: "ملف أمر الشراء." } },
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
          access: { read: costVisible },
          label: { en: "Amount", ar: "المبلغ" },
          admin: {
            description: {
              en: "The bill total as printed, including VAT.",
              ar: "إجمالي الفاتورة كما هو مطبوع، شاملًا ضريبة القيمة المضافة.",
            },
            placeholder: words({ en: "e.g. 96,400", ar: "مثال: 96,400" }),
          },
          custom: formats.money("currency"),
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          defaultValue: "EGP",
          label: { en: "Currency", ar: "العملة" },
          admin: {
            description: { en: "The currency printed on the bill.", ar: "العملة المطبوعة على الفاتورة." },
            placeholder: words({ en: "EGP", ar: "EGP" }),
          },
        },
        {
          name: "vatAmount",
          type: "number",
          min: 0,
          label: { en: "Input VAT (recoverable)", ar: "ضريبة المدخلات (قابلة للاسترداد)" },
          access: { read: costVisible },
          admin: {
            description: {
              en: "The 14% VAT on the bill that Golden Sea can recover.",
              ar: "ضريبة القيمة المضافة 14% على الفاتورة التي تستردها Golden Sea.",
            },
            placeholder: words({ en: "e.g. 11,838", ar: "مثال: 11,838" }),
          },
        },
        {
          name: "dueDate",
          type: "date",
          label: { en: "Due Date", ar: "تاريخ الاستحقاق" },
          admin: {
            description: {
              en: "The date payment is due under the supplier's terms.",
              ar: "تاريخ استحقاق الدفع وفق شروط المورّد.",
            },
          },
        },
      ],
    },
    {
      name: "match",
      type: "array",
      label: { en: "Match", ar: "المطابقة" },
      labels: {
        singular: { en: "Line", ar: "بند" },
        plural: { en: "PO / receipt / bill match", ar: "مطابقة أمر الشراء / الاستلام / الفاتورة" },
      },
      admin: {
        description: {
          en: "Ordered, received and billed quantities per line, side by side.",
          ar: "الكميات المطلوبة والمستلمة والمفوترة لكل بند، جنبًا إلى جنب.",
        },
      },
      custom: {
        about: {
          en: "A bill is matched when ordered, received and billed agree on every line. A mismatch puts the bill on hold until a receipt or credit note arrives.",
          ar: "تكون الفاتورة مطابَقة حين تتفق الكميات المطلوبة والمستلمة والمفوترة في كل بند. أي اختلاف يعلّق الفاتورة حتى يصل إيصال استلام أو إشعار دائن.",
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
                description: { en: "The PO line this row checks.", ar: "بند أمر الشراء الذي يفحصه هذا الصف." },
                placeholder: words({ en: "e.g. 1", ar: "مثال: 1" }),
              },
            },
            {
              name: "ordered",
              type: "number",
              min: 0,
              label: { en: "Ordered", ar: "المطلوب" },
              admin: {
                description: { en: "Units on the purchase order.", ar: "الوحدات في أمر الشراء." },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
            {
              name: "received",
              type: "number",
              min: 0,
              label: { en: "Received", ar: "المستلم" },
              admin: {
                description: { en: "Units received into the warehouse.", ar: "الوحدات المستلمة في المخزن." },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
            {
              name: "billed",
              type: "number",
              min: 0,
              label: { en: "Billed", ar: "المفوتر" },
              admin: {
                description: { en: "Units the supplier billed for.", ar: "الوحدات التي فوترها المورّد." },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
          ],
        },
      ],
    },
    computed(
      {
        name: "matchLines",
        type: "text",
        label: { en: "PO · receipt · bill", ar: "أمر الشراء · الاستلام · الفاتورة" },
        admin: {
          description: {
            en: "Ordered, received and billed per line, in that order.",
            ar: "المطلوب والمستلم والمفوتر لكل بند، بهذا الترتيب.",
          },
        },
        custom: { toneWhen: [{ when: { status: { equals: "On hold" } }, tone: "error" }] },
      },
      (b) =>
        ((b.match as Doc[] | undefined) ?? [])
          .map((m) => `L${num(m.lineNo)}: ${num(m.ordered)} · ${num(m.received)} · ${num(m.billed)}`)
          .join("; "),
    ),
    computed(
      {
        name: "summary",
        type: "text",
        label: { en: "Summary", ar: "الملخص" },
        admin: {
          condition: () => false,
          description: {
            en: "The bill in one sentence: number, amount and PO.",
            ar: "الفاتورة في جملة واحدة: الرقم والمبلغ وأمر الشراء.",
          },
        },
      },
      async (b, req) => {
        const po = await related(req, "purchase-orders", b.purchaseOrder);
        const amount = b.amount == null ? "" : ` · ${moneyText(num(b.amount), scalar(b.currency) || "EGP")}`;
        return `${scalar(b.billNumber)}${amount} · ${arabic(req) ? "أمر الشراء" : "PO"} ${scalar(po?.number) || "—"}`;
      },
    ),
    {
      name: "creditNote",
      type: "text",
      label: { en: "Linked credit note", ar: "إشعار الدائن المرتبط" },
      admin: {
        description: {
          en: "The supplier's credit note number that settles a mismatch.",
          ar: "رقم إشعار الدائن من المورّد الذي يسوّي الاختلاف.",
        },
        placeholder: words({ en: "e.g. CN-2026-044", ar: "مثال: CN-2026-044" }),
      },
    },
    evidence(
      "file",
      { en: "Bill document", ar: "مستند الفاتورة" },
      { hint: { en: "The supplier's bill, as a scan or PDF.", ar: "فاتورة المورّد، صورة ممسوحة أو PDF." } },
    ),
    {
      name: "status",
      type: "select",
      defaultValue: "Received",
      label: { en: "Status", ar: "الحالة" },
      options: labelled(BILL_STATUS_AR),
      custom: tones({
        Received: "info",
        Matched: "success",
        "On hold": "error",
        "Approved for payment": "success",
        Paid: "success",
        "Credit note": "neutral",
        Cancelled: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: { en: "Where the bill is, from received to paid.", ar: "مرحلة الفاتورة، من الاستلام إلى الدفع." },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
    {
      name: "holdReason",
      type: "text",
      label: { en: "Hold Reason", ar: "سبب التعليق" },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: {
          en: "Why the 3-way match failed, while the bill is on hold.",
          ar: "سبب فشل المطابقة الثلاثية أثناء تعليق الفاتورة.",
        },
      },
      custom: { toneWhen: [{ when: { status: { equals: "On hold" } }, tone: "error" }] },
    },
  ],
};

export const Receipts: CollectionConfig = {
  slug: "receipts",
  labels: {
    singular: { en: "Receipt", ar: "إيصال استلام" },
    plural: { en: "Receipts", ar: "إيصالات الاستلام" },
  },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "purchaseOrder", "received", "ordered", "qc"],
    group: { en: "Fulfilment", ar: "التنفيذ" },
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.label = `L${data.lineNo ?? "?"} · ${data.received ?? 0}/${data.ordered ?? 0}`;
        data.shortfall = Math.max(0, (Number(data.ordered) || 0) - (Number(data.received) || 0));
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === "create" && !req.context?.seed && (doc.shortfall > 0 || doc.qc !== "OK"))
          await logActivity(req, {
            case: idOf(doc.case),
            kind: "alert",
            text: {
              en: `Receipt ${doc.label}: ${doc.qc}${doc.shortfall ? ` — ${doc.shortfall} short` : ""}.`,
              ar: `إيصال الاستلام ${doc.label}: ${QC_AR[doc.qc] ?? doc.qc}${doc.shortfall ? ` — نقص ${doc.shortfall}` : ""}.`,
            },
          });
        return doc;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", label: { en: "Label", ar: "التسمية" }, admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(true, {
          placeholder: CASE_PLACEHOLDER,
          hint: {
            en: "The customer case this delivery from the supplier is for.",
            ar: "ملف العميل الذي وصلت له هذه الشحنة من المورّد.",
          },
        }),
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          required: true,
          label: { en: "Purchase Order", ar: "أمر الشراء" },
          admin: {
            description: {
              en: "The purchase order the goods arrived against.",
              ar: "أمر الشراء الذي وصلت البضاعة بموجبه.",
            },
            placeholder: words({ en: "e.g. PO/2026/0214", ar: "مثال: PO/2026/0214" }),
          },
        },
        {
          name: "lineNo",
          type: "number",
          min: 1,
          required: true,
          label: { en: "Line No", ar: "رقم البند" },
          admin: {
            description: { en: "The PO line number being received.", ar: "رقم بند أمر الشراء قيد الاستلام." },
            placeholder: words({ en: "e.g. 2", ar: "مثال: 2" }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "ordered",
          type: "number",
          min: 0,
          required: true,
          label: { en: "Ordered", ar: "المطلوب" },
          admin: {
            description: { en: "Units the PO line asked for.", ar: "الوحدات المطلوبة في بند أمر الشراء." },
            placeholder: words({ en: "e.g. 200", ar: "مثال: 200" }),
          },
        },
        {
          name: "received",
          type: "number",
          min: 0,
          required: true,
          label: { en: "Received", ar: "المستلم" },
          admin: {
            description: {
              en: "Units that actually arrived and were counted.",
              ar: "الوحدات التي وصلت فعلًا وعُدّت.",
            },
            placeholder: words({ en: "e.g. 180", ar: "مثال: 180" }),
          },
        },
        {
          name: "shortfall",
          type: "number",
          min: 0,
          label: { en: "Shortfall", ar: "العجز" },
          admin: {
            readOnly: true,
            description: {
              en: "Ordered minus received. Anything above zero is a backorder.",
              ar: "المطلوب ناقص المستلم، وأي قيمة فوق الصفر طلب متأخر التوريد.",
            },
          },
          custom: { toneWhen: [{ when: { shortfall: { greater_than: 0 } }, tone: "warning" }] },
        },
        {
          name: "receivedAt",
          type: "date",
          label: { en: "Received At", ar: "تاريخ الاستلام" },
          admin: {
            description: {
              en: "The day the goods reached the warehouse or dock.",
              ar: "اليوم الذي وصلت فيه البضاعة إلى المخزن أو الرصيف.",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "warehouse",
          type: "select",
          label: { en: "Warehouse", ar: "المخزن" },
          options: [
            ...WAREHOUSE_OPTIONS,
            { value: "Direct to vessel", label: { en: "Direct to vessel", ar: "مباشرة إلى السفينة" } },
          ],
          admin: {
            description: {
              en: "Where the goods were put away, or straight to the vessel.",
              ar: "مكان تخزين البضاعة، أو مباشرة إلى السفينة.",
            },
            placeholder: words({ en: "e.g. Alexandria", ar: "مثال: الإسكندرية" }),
          },
        },
        {
          name: "lot",
          type: "text",
          label: { en: "Lot", ar: "التشغيلة" },
          admin: {
            description: {
              en: "The supplier's lot or batch number, for traceability.",
              ar: "رقم التشغيلة أو الدفعة لدى المورّد، للتتبع.",
            },
            placeholder: words({ en: "e.g. LOT-24117", ar: "مثال: LOT-24117" }),
          },
        },
        {
          name: "expiry",
          type: "date",
          label: { en: "Expiry", ar: "تاريخ الانتهاء" },
          admin: {
            description: {
              en: "Best-before date for food and chemicals. Leave empty otherwise.",
              ar: "تاريخ الصلاحية للأغذية والكيماويات، واتركه فارغًا لغيرها.",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "qc",
          type: "select",
          label: { en: "Quality check", ar: "فحص الجودة" },
          options: labelled(QC_AR),
          defaultValue: "OK",
          admin: {
            description: { en: "The result of inspecting the goods on arrival.", ar: "نتيجة فحص البضاعة عند الوصول." },
            placeholder: words({ en: "Pick a result", ar: "اختر النتيجة" }),
          },
          custom: tones({
            OK: "success",
            Short: "error",
            Damaged: "error",
            "Wrong item": "error",
            "Shelf life too short": "warning",
            "Certificate missing": "error",
          }),
        },
        {
          name: "claim",
          type: "text",
          localized: true,
          label: { en: "Damage / shortage claim", ar: "مطالبة تلف / نقص" },
          admin: {
            description: {
              en: "The claim reference raised with the supplier, if any.",
              ar: "مرجع المطالبة المقدمة للمورّد، إن وُجدت.",
            },
            placeholder: words({ en: "e.g. CLM-0092, 20 units short", ar: "مثال: CLM-0092، نقص 20 وحدة" }),
          },
        },
        {
          name: "backorderDate",
          type: "date",
          label: { en: "Promised", ar: "الموعد المتعهَّد به" },
          admin: {
            description: {
              en: "When the supplier promises to send the missing units.",
              ar: "موعد تعهّد المورّد بإرسال الوحدات الناقصة.",
            },
          },
        },
      ],
    },
    {
      name: "certificates",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: { en: "Certificates", ar: "الشهادات" },
      admin: {
        description: {
          en: "Test, origin or food-safety certificates that came with the goods.",
          ar: "شهادات الاختبار أو المنشأ أو سلامة الغذاء المرفقة بالبضاعة.",
        },
      },
    },
    {
      type: "row",
      fields: [
        computed(
          {
            name: "item",
            type: "text",
            label: { en: "Line", ar: "البند" },
            admin: { description: { en: "The PO line and its description.", ar: "بند أمر الشراء ووصفه." } },
          },
          async (r, req) => {
            const po = await related(req, "purchase-orders", r.purchaseOrder);
            const line = ((po?.lines as Doc[] | undefined) ?? []).find((l) => l.lineNo === r.lineNo);
            return `L${num(r.lineNo)} · ${scalar(line?.description)}`;
          },
        ),
        computed(
          {
            name: "from",
            type: "text",
            label: { en: "Supplier", ar: "المورّد" },
            admin: { description: { en: "The supplier and the PO number.", ar: "المورّد ورقم أمر الشراء." } },
          },
          async (r, req) => {
            const po = await related(req, "purchase-orders", r.purchaseOrder);
            const supplier = await related(req, "suppliers", po?.supplier);
            return `${scalar(supplier?.name)} · ${scalar(po?.number)}`;
          },
        ),
        computed(
          {
            name: "quantity",
            type: "text",
            label: { en: "Received", ar: "المستلم" },
            admin: {
              description: { en: "Units received out of units ordered.", ar: "الوحدات المستلمة من الوحدات المطلوبة." },
            },
            custom: { toneWhen: [{ when: { shortfall: { greater_than: 0 } }, tone: "warning" }] },
          },
          (r, req) => `${num(r.received)} ${arabic(req) ? "من" : "of"} ${num(r.ordered)}`,
        ),
      ],
    },
    computed(
      {
        name: "backorder",
        type: "group",
        label: { en: "Backorder", ar: "الطلب المتأخر" },
        admin: {
          condition: () => false,
          description: {
            en: "What happens to the missing units, and whether they are in time.",
            ar: "مصير الوحدات الناقصة، وهل تصل في الموعد.",
          },
        },
        fields: [
          {
            name: "followsIn",
            type: "text",
            label: { en: "Follows in", ar: "تُشحن ضمن" },
            admin: {
              description: {
                en: "The delivery the missing units will travel in.",
                ar: "التسليم الذي ستُنقل فيه الوحدات الناقصة.",
              },
              placeholder: words({ en: "e.g. DN-0212", ar: "مثال: DN-0212" }),
            },
          },
          {
            name: "owner",
            type: "text",
            label: { en: "Owner", ar: "المسؤول" },
            admin: {
              description: { en: "The case owner who chases the supplier.", ar: "مسؤول الملف الذي يتابع المورّد." },
              placeholder: words({ en: "e.g. Karim Balbaa", ar: "مثال: Karim Balbaa" }),
            },
          },
          {
            name: "risk",
            type: "select",
            label: { en: "Risk", ar: "المخاطرة" },
            admin: {
              description: {
                en: "Whether the backorder lands before the vessel drop is packed.",
                ar: "هل يصل الطلب المتأخر قبل تجهيز شحنة السفينة.",
              },
              placeholder: words({ en: "Pick a risk", ar: "اختر المخاطرة" }),
            },
            options: labelled({
              "Arrives after the drop is packed": "يصل بعد تجهيز الشحنة",
              "In time for the drop": "في الموعد للشحنة",
            }),
            custom: tones({ "Arrives after the drop is packed": "error", "In time for the drop": "success" }),
          },
        ],
      },
      async (r, req) => {
        if (req.context?.seed) return null;
        const caseId = idOf(r.case);
        if (!caseId) return null;
        const b = backorderOf(r, await deliveriesOf(req, caseId));
        if (!b) return null;
        const caseDoc = await related(req, "cases", r.case);
        const owner = await related(req, "users", caseDoc?.owner);
        return {
          followsIn: b.followsIn ?? (arabic(req) ? "غير مخطط" : "Not planned"),
          owner: scalar(owner?.name) || idOf(caseDoc?.owner) || "",
          risk: b.late ? "Arrives after the drop is packed" : "In time for the drop",
        };
      },
    ),
  ],
};

export const Deliveries: CollectionConfig = {
  slug: "deliveries",
  labels: {
    singular: { en: "Delivery", ar: "تسليم" },
    plural: { en: "Deliveries", ar: "عمليات التسليم" },
  },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "plannedAt", "status"],
    group: { en: "Fulfilment", ar: "التنفيذ" },
  },
  access: deskAccess,
  hooks: {
    beforeValidate: [autoNumber("deliveries", "number", "DN-")],
    beforeChange: [
      ({ data, req }) => {
        if (data.status === "Delivered — confirmed" && !data.proof)
          throw ruleError(
            arabic(req)
              ? "أرفق إذن التسليم الموقّع أو صورة قبل تأكيد التسليم."
              : "Attach the signed delivery note or photo before confirming delivery.",
          );
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
              en: "Numbered automatically when saved, like DN-0212.",
              ar: "يُرقَّم تلقائيًا عند الحفظ، مثل DN-0212.",
            },
          },
        },
        caseRef(true, {
          placeholder: CASE_PLACEHOLDER,
          hint: {
            en: "The customer case this delivery to the vessel belongs to.",
            ar: "ملف العميل الذي يخصه هذا التسليم إلى السفينة.",
          },
        }),
        {
          name: "consolidatedWith",
          type: "relationship",
          relationTo: "cases",
          hasMany: true,
          label: { en: "Also carries (e.g. cleared spares)", ar: "يحمل أيضًا (مثل قطع غيار مُفرج عنها)" },
          admin: {
            description: {
              en: "Other cases whose goods travel on this same trip.",
              ar: "ملفات أخرى تُنقل بضاعتها في الرحلة نفسها.",
            },
            placeholder: words({ en: "Search cases", ar: "ابحث في الملفات" }),
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "plannedAt",
          type: "date",
          required: true,
          label: { en: "Planned At", ar: "الموعد المخطط" },
          admin: {
            description: { en: "The planned date and time of the handover.", ar: "تاريخ ووقت التسليم المخطط." },
            date: { pickerAppearance: "dayAndTime" },
          },
        },
        {
          name: "place",
          type: "text",
          required: true,
          localized: true,
          label: { en: "Place", ar: "المكان" },
          admin: {
            description: {
              en: "The port, berth or anchorage where the vessel takes delivery.",
              ar: "الميناء أو الرصيف أو المخطاف حيث تتسلم السفينة.",
            },
            placeholder: words({ en: "e.g. Port Said anchorage 4", ar: "مثال: مخطاف بورسعيد 4" }),
          },
        },
      ],
    },
    {
      name: "plan",
      type: "group",
      label: { en: "Plan", ar: "الخطة" },
      admin: {
        description: {
          en: "How the goods get to the vessel: transport, staff, clearance and cold chain.",
          ar: "كيف تصل البضاعة إلى السفينة: النقل والطاقم والتخليص وسلسلة التبريد.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "vehicle",
              type: "text",
              localized: true,
              label: { en: "Vehicle", ar: "المركبة" },
              admin: {
                description: {
                  en: "The truck or van that carries the goods to the port.",
                  ar: "الشاحنة أو الفان التي تنقل البضاعة إلى الميناء.",
                },
                placeholder: words({ en: "Golden Sea truck 3 (reefer)", ar: "شاحنة Golden Sea رقم 3 (مبردة)" }),
              },
            },
            {
              name: "boardingStaff",
              type: "text",
              label: { en: "Boarding Staff", ar: "موظف الصعود" },
              admin: {
                description: { en: "Who goes on board with the goods.", ar: "من يصعد إلى السفينة مع البضاعة." },
                placeholder: words({ en: "e.g. Ahmed Fathy", ar: "مثال: Ahmed Fathy" }),
              },
            },
            {
              name: "launch",
              type: "text",
              localized: true,
              label: { en: "Launch / boat booking", ar: "حجز اللنش / القارب" },
              admin: {
                description: {
                  en: "The launch or boat that takes the goods out to the vessel.",
                  ar: "اللنش أو القارب الذي ينقل البضاعة إلى السفينة.",
                },
                placeholder: words({ en: "e.g. Launch Nour, 09:30", ar: "مثال: لنش نور، 09:30" }),
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "readyAt",
              type: "date",
              label: { en: "Goods ready", ar: "جاهزية البضاعة" },
              admin: {
                description: {
                  en: "When the goods are packed and ready to leave the warehouse.",
                  ar: "موعد تعبئة البضاعة وجاهزيتها لمغادرة المخزن.",
                },
              },
            },
            {
              name: "clearance",
              type: "text",
              localized: true,
              label: { en: "Clearance / ship-stores declaration", ar: "التخليص / إقرار مؤن السفن" },
              admin: {
                description: {
                  en: "The customs ship-stores declaration number for this drop.",
                  ar: "رقم إقرار مؤن السفن الجمركي لهذه الشحنة.",
                },
                placeholder: words({ en: "e.g. SSD-2026-0381", ar: "مثال: SSD-2026-0381" }),
              },
            },
            {
              name: "coldChain",
              type: "checkbox",
              label: { en: "Cold chain (temperature log)", ar: "سلسلة التبريد (سجل الحرارة)" },
              defaultValue: false,
              admin: {
                description: {
                  en: "Tick for chilled or frozen goods. It adds a temperature log.",
                  ar: "ضع علامة للبضائع المبردة أو المجمدة، فيُضاف سجل للحرارة.",
                },
              },
            },
          ],
        },
        {
          name: "temperatureLog",
          type: "array",
          label: { en: "Temperature Log", ar: "سجل الحرارة" },
          admin: {
            condition: (_, s) => Boolean(s?.coldChain),
            description: {
              en: "Temperature readings taken along the trip.",
              ar: "قراءات الحرارة المأخوذة خلال الرحلة.",
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
                  admin: { description: { en: "When the reading was taken.", ar: "وقت أخذ القراءة." } },
                },
                {
                  name: "point",
                  type: "select",
                  label: { en: "Point", ar: "النقطة" },
                  options: labelled({
                    Loading: "التحميل",
                    Base: "القاعدة",
                    "Boat transfer": "النقل بالقارب",
                    "On board": "على متن السفينة",
                  }),
                  admin: {
                    description: {
                      en: "The step of the trip where it was measured.",
                      ar: "مرحلة الرحلة التي أُخذت فيها القراءة.",
                    },
                    placeholder: words({ en: "Pick a step", ar: "اختر المرحلة" }),
                  },
                },
                {
                  name: "celsius",
                  type: "number",
                  label: { en: "Celsius", ar: "الحرارة (°م)" },
                  admin: {
                    description: {
                      en: "The reading in degrees Celsius. Chilled goods stay at 2 to 5.",
                      ar: "القراءة بالدرجات المئوية، وتبقى البضائع المبردة بين 2 و5.",
                    },
                    placeholder: words({ en: "e.g. 4", ar: "مثال: 4" }),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      label: { en: "Lines", ar: "البنود" },
      admin: {
        description: {
          en: "The order lines and quantities loaded on this delivery.",
          ar: "بنود الطلب وكمياتها المحمّلة في هذا التسليم.",
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
                description: { en: "The order line being delivered.", ar: "بند الطلب قيد التسليم." },
                placeholder: words({ en: "e.g. 1", ar: "مثال: 1" }),
              },
            },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              label: { en: "Qty", ar: "الكمية" },
              admin: {
                description: { en: "Units of that line on this trip.", ar: "وحدات هذا البند في هذه الرحلة." },
                placeholder: words({ en: "e.g. 40", ar: "مثال: 40" }),
              },
            },
            {
              name: "lot",
              type: "text",
              label: { en: "Lot", ar: "التشغيلة" },
              admin: {
                description: {
                  en: "The lot the units come from, for traceability.",
                  ar: "التشغيلة التي جاءت منها الوحدات، للتتبع.",
                },
                placeholder: words({ en: "e.g. LOT-24117", ar: "مثال: LOT-24117" }),
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
          name: "dispatchedAt",
          type: "date",
          label: { en: "Dispatched At", ar: "وقت الإرسال" },
          admin: {
            description: {
              en: "When the goods left the warehouse for the port.",
              ar: "وقت مغادرة البضاعة المخزن إلى الميناء.",
            },
          },
        },
        {
          name: "confirmedAt",
          type: "date",
          label: { en: "Confirmed At", ar: "وقت التأكيد" },
          admin: {
            description: {
              en: "When the vessel confirmed it received the goods.",
              ar: "وقت تأكيد السفينة استلام البضاعة.",
            },
          },
        },
        {
          name: "confirmedBy",
          type: "text",
          label: { en: "Signed by (vessel)", ar: "الموقّع (من السفينة)" },
          admin: {
            description: { en: "The crew member who signed for the goods.", ar: "فرد الطاقم الذي وقّع على الاستلام." },
            placeholder: words({ en: "e.g. Chief Officer Petrov", ar: "مثال: Chief Officer Petrov" }),
          },
        },
      ],
    },
    evidence(
      "proof",
      { en: "Signed delivery note / photo", ar: "إذن التسليم الموقّع / صورة" },
      {
        hint: {
          en: "The signed delivery note or a photo. Needed to confirm delivery.",
          ar: "إذن التسليم الموقّع أو صورة، وهو مطلوب لتأكيد التسليم.",
        },
      },
    ),
    {
      name: "shortages",
      type: "textarea",
      localized: true,
      label: { en: "Shortages", ar: "النواقص" },
      admin: {
        description: {
          en: "Items missing or damaged on handover, one per line.",
          ar: "الأصناف الناقصة أو التالفة عند التسليم، صنف في كل سطر.",
        },
        placeholder: words({ en: "e.g. 2 of 40 coveralls short", ar: "مثال: نقص 2 من 40 أفرول" }),
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Planned",
      label: { en: "Status", ar: "الحالة" },
      options: labelled({
        Planned: "مخطط",
        Ready: "جاهز",
        Dispatched: "أُرسل",
        "Delivered — confirmed": "سُلّم — مؤكَّد",
        "Partially delivered": "سُلّم جزئيًا",
        Rescheduled: "أُعيدت جدولته",
        Cancelled: "ملغى",
      }),
      admin: {
        position: "sidebar",
        description: {
          en: "Where the delivery is, from planned to confirmed.",
          ar: "مرحلة التسليم، من التخطيط إلى التأكيد.",
        },
        placeholder: words({ en: "Pick a status", ar: "اختر الحالة" }),
      },
    },
  ],
};
