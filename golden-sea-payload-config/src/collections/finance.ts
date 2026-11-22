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
import { formats, tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import { FINANCE_ROLES, dayText, findAll, moneyText, once } from "./fulfilment.ts";

/** Customer receipts (payments in), read once per request. */
const customerPayments = (req: PayloadRequest) =>
  once(req, "payments-in", () => findAll(req, "payments", { direction: { equals: "in" } }));

/** How late an open invoice is, in the buckets finance reads receivables by. */
export const AGE_BUCKETS = ["Not due", "1–30 days", "31–60 days", "60+ days"] as const;
const bucketOf = (days: number) => AGE_BUCKETS[days <= 0 ? 0 : days <= 30 ? 1 : days <= 60 ? 2 : 3];

/** An invoice with money still to collect (not a draft, not cancelled). */
const collectible = (inv: Record<string, unknown>) =>
  Number(inv.balance) > 0 && !["Draft", "Cancelled"].includes(String(inv.status));

const longDay = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * The collection reminder for an invoice, as the AI drafts it, following the customer's contact
 * rule: a "do not chase" customer gets no message (an internal reminder for the account owner
 * instead); the others get an email a person reviews and sends. Pure: the invoice and its customer in.
 */
export function reminderDraft(inv: Record<string, unknown>, customer: Record<string, unknown> | null) {
  const rule = scalar(customer?.contactRule) || "allowed";
  const days = daysSince(inv.dueDate);
  const cur = scalar(inv.currency);
  const amount = `${cur} ${Number(inv.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  const due = inv.dueDate ? longDay.format(new Date(scalar(inv.dueDate))) : "—";
  const when = days > 0 ? `${days} days overdue` : `due ${due}`;
  const name = scalar(customer?.name);
  if (rule === "do-not-chase")
    return {
      mode: "internal",
      rule,
      title: `Internal: ${scalar(inv.number)} ${amount} ${when} — ${name}`,
      body: `${name} must not be chased (account rule). Check the payment run with the account owner at the next scheduled call; escalate to Karim Balbaa if still open after 60 days. No message goes to the customer.`,
      confidence: 1,
    };
  const contact = ((customer?.contacts as { name?: string; email?: string }[] | undefined) ?? [])[0];
  const greeting = contact?.name ? `Dear ${contact.name.split(" ")[0]},` : "Dear accounts team,";
  const paid = Number(inv.paid) || 0;
  return {
    mode: "customer",
    rule,
    to: contact?.email ?? scalar(customer?.contactEmail),
    title: `Reminder: ${scalar(inv.number)} ${when} — ${name}`,
    subject: `Golden Sea invoice ${scalar(inv.number)} — ${amount} ${days > 0 ? "overdue" : `due ${due}`}`,
    body: `${greeting}

Our invoice ${scalar(inv.number)} for ${amount} ${days > 0 ? `fell due on ${due}` : `is due on ${due}`}${paid ? ` (balance after your payment of ${cur} ${paid.toLocaleString("en-US")})` : ""}. Could you let us know when it is scheduled for payment? A copy of the invoice and the signed delivery note are attached.

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

/** Customer invoices: from delivered quantities, never billing the same quantity twice. */
export const Invoices: CollectionConfig = {
  slug: "invoices",
  custom: {
    edit: { steps: { field: "status", skip: ["Overdue", "Cancelled"] } },
    // Reminders follow each customer's contact rule (the draft is the `reminder` field): an email a
    // person reviews and sends, or, for "do not chase", an internal reminder only. Offered on open
    // invoices due within 5 days or overdue, wherever invoices show.
    actions: [
      {
        label: "Draft reminder",
        when: {
          "reminder.mode": { equals: "customer" },
          daysOverdue: { greater_than: -6 },
          balance: { greater_than: 0 },
        },
        roles: ["management", "finance-director", "operations"],
        call: { path: "/cash/reminder", body: { invoice: "$row.id" } },
        confirm: {
          heading: "Collection reminder — $row.number",
          text: "AI draft · $row.reminder.note\nTo: $row.reminder.to · Subject: $row.reminder.subject",
          label: "Send reminder",
        },
        fields: [
          {
            type: "textarea",
            name: "body",
            label: "Email (edit before sending)",
            required: true,
            defaultValue: "$row.reminder.body",
            admin: { rows: 10 },
          },
        ],
        done: "Reminder sent to $row.customer.name by you (logged on the account).",
      },
      {
        label: "Internal reminder",
        when: {
          "reminder.mode": { equals: "internal" },
          daysOverdue: { greater_than: -6 },
          balance: { greater_than: 0 },
        },
        roles: ["management", "finance-director", "operations"],
        call: { path: "/cash/reminder", body: { invoice: "$row.id" } },
        confirm: {
          heading: "Collection reminder — $row.number",
          text: "$row.customer.name must not be chased: no customer message is drafted — an internal reminder for the account owner instead.",
          label: "Create internal reminder",
        },
        fields: [
          {
            type: "textarea",
            name: "body",
            label: "Internal reminder",
            required: true,
            defaultValue: "$row.reminder.body",
            admin: { rows: 6 },
          },
        ],
        done: "Internal reminder created — nothing sent to $row.customer.name.",
      },
      // The Egyptian e-invoice (`eInvoiceNext`): refresh a submitted one, else sign and submit it
      // (a local buyer's tax registration number checked first). Safe to retry.
      {
        label: "Refresh status · $row.number",
        when: { "eInvoiceNext.mode": { equals: "refresh" } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/einvoice", body: { invoice: "$row.id" } },
        reply: true,
      },
      ...(["foreign", "local"] as const).map((mode): CollectionAction => ({
        label: "$row.eInvoiceNext.label · $row.number",
        when: { "eInvoiceNext.mode": { equals: mode } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/einvoice", body: { invoice: "$row.id" } },
        prompt: "Sign & submit $row.number to the tax authority",
        confirm: {
          heading: "Sign & submit $row.number to the tax authority",
          text: "$row.eInvoiceNext.summary",
          label: "Sign & submit",
          tone: "primary",
        },
        fields:
          mode === "local"
            ? [
                {
                  type: "text",
                  name: "taxId",
                  label: "Buyer tax registration number",
                  defaultValue: "$row.billing.taxId",
                  admin: { description: "9 digits — on the customer's tax card on file: 100-200-300" },
                },
              ]
            : undefined,
        reply: true,
      })),
      // A customer payment, recorded once the money is in the bank (the system never moves money).
      {
        label: "Record payment · $row.number",
        when: { balance: { greater_than: 0 }, status: { not_in: ["Draft", "Cancelled"] } },
        roles: FINANCE_ROLES,
        call: { path: "/cash/payment", body: { invoice: "$row.id" } },
        prompt: "Record customer payment — $row.number",
        fields: [
          {
            type: "number",
            name: "amount",
            label: "Amount received ($row.currency)",
            required: true,
            defaultValue: "$row.balance",
            admin: { description: "$row.paymentDraft.note" },
          },
          { type: "text", name: "reference", label: "Bank reference", defaultValue: "$row.paymentDraft.reference" },
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
    group: "Finance",
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
              throw ruleError(`Line ${l.lineNo}: invoicing more than delivered (${already} already invoiced).`);
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
        { name: "number", type: "text", unique: true, admin: { readOnly: true } },
        caseRef(),
        { name: "customer", type: "relationship", relationTo: "customers", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "basis",
          type: "select",
          options: ["Delivery", "Milestone", "Deposit", "Installment", "Final balance", "Service fees"],
          defaultValue: "Delivery",
        },
        { name: "delivery", type: "relationship", relationTo: "deliveries" },
      ],
    },
    {
      name: "lines",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1 },
            { name: "description", type: "text", required: true },
            { name: "qty", type: "number", min: 0, required: true },
            { name: "deliveredQty", type: "number", min: 0 },
            { name: "unitPrice", type: "number", min: 0, required: true },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "currency", type: "select", options: CURRENCIES, defaultValue: "USD" },
        { name: "amount", type: "number", min: 0, custom: formats.money("currency") },
        { name: "paid", type: "number", min: 0, defaultValue: 0, custom: formats.money("currency") },
        {
          name: "balance",
          type: "number",
          min: 0,
          admin: { readOnly: true },
          custom: formats.money("currency"),
        },
      ],
    },
    // What finance reads an invoice by, worked out on every read (never stored).
    {
      type: "row",
      fields: [
        computed(
          { name: "balanceUsd", type: "number", label: "Balance (USD)", custom: formats.money("USD") },
          async (inv, req) => {
            const fx = await fxRates(req);
            const egp = (Number(inv.balance) || 0) * (fx[scalar(inv.currency) || "EGP"] ?? 1);
            return Math.round((egp / (fx.USD ?? 1)) * 100) / 100;
          },
        ),
        computed({ name: "daysOverdue", type: "number", label: "Days overdue", custom: formats.days() }, (inv) =>
          collectible(inv) ? daysSince(inv.dueDate) : 0,
        ),
        computed(
          {
            name: "ageBucket",
            type: "select",
            label: "Age",
            options: [...AGE_BUCKETS],
            custom: tones({ "Not due": "success", "1–30 days": "warning", "31–60 days": "error", "60+ days": "error" }),
          },
          (inv) => (collectible(inv) ? bucketOf(daysSince(inv.dueDate)) : null),
        ),
      ],
    },
    // The collection reminder the AI drafts for it (`custom.actions` offers it).
    computed(
      {
        name: "reminder",
        type: "group",
        admin: { condition: () => false },
        fields: [
          { name: "mode", type: "text" },
          { name: "to", type: "text" },
          { name: "subject", type: "text" },
          { name: "body", type: "textarea" },
          { name: "note", type: "text" },
        ],
      },
      async (inv, req) => (collectible(inv) ? reminderDraft(inv, await related(req, "customers", inv.customer)) : null),
    ),
    // What the case's invoice table reads it by, in one line each.
    {
      type: "row",
      fields: [
        computed({ name: "basisNote", type: "text", label: "Basis" }, async (inv, req) => {
          const delivery = await related(req, "deliveries", inv.delivery);
          return `${scalar(inv.basis) || "Delivery"}${delivery ? ` · ${scalar(delivery.number)}` : ""} · ${dayText(inv.issuedAt)}`;
        }),
        computed({ name: "linesSummary", type: "text", label: "Invoiced lines" }, (inv) =>
          ((inv.lines as Record<string, unknown>[] | undefined) ?? [])
            .map(
              (l) =>
                `L${scalar(l.lineNo)} · ${scalar(l.qty)}${l.deliveredQty != null ? ` of ${scalar(l.deliveredQty)} delivered` : ""} × ${moneyText(Number(l.unitPrice) || 0, scalar(inv.currency))}`,
            )
            .join("; "),
        ),
        // The tax authority's answer: its error, else the UUID it gave.
        computed({ name: "eInvoiceNote", type: "text", label: "E-invoice note" }, (inv) => {
          const e = (inv.eInvoice ?? {}) as { error?: string; uuid?: string };
          return e.error || (e.uuid ? `UUID ${e.uuid}` : "");
        }),
        // The balance and when it's due (or settled), then each payment received.
        computed({ name: "paymentsNote", type: "text", label: "Payments" }, async (inv, req) => {
          const cur = scalar(inv.currency);
          const payments = req.context?.seed
            ? []
            : (await customerPayments(req)).filter((p) => idOf(p.invoice) === idOf(inv.id));
          return [
            Number(inv.balance) > 0
              ? `Balance ${moneyText(Number(inv.balance), cur)} due ${dayText(inv.dueDate)}`
              : "Settled",
            ...payments.map(
              (p) => `${dayText(p.paidAt)} · ${scalar(p.reference)} · ${moneyText(Number(p.amount) || 0, cur)}`,
            ),
          ].join(" · ");
        }),
      ],
    },
    // The next step with the tax authority (the e-invoice actions read it): nothing once valid.
    computed(
      {
        name: "eInvoiceNext",
        type: "group",
        admin: { condition: () => false },
        fields: [
          { name: "mode", type: "text" },
          { name: "label", type: "text" },
          { name: "summary", type: "textarea" },
        ],
      },
      async (inv, req) => {
        const e = (inv.eInvoice ?? {}) as { status?: string; error?: string };
        const status = e.status || "Not submitted";
        if (status === "Valid") return null;
        if (status === "Submitted") return { mode: "refresh", label: "Refresh status", summary: "" };
        const billing = (inv.billing ?? {}) as { legalEntity?: string };
        const customer = billing.legalEntity ? null : await related(req, "customers", inv.customer);
        return {
          mode: inv.vatTreatment === "14% standard" ? "local" : "foreign",
          label: status === "Rejected" ? "Correct & resubmit" : e.error ? "Retry (safe)" : "Sign & submit",
          summary: [
            `${billing.legalEntity || scalar(customer?.name)} · ${moneyText(Number(inv.amount) || 0, scalar(inv.currency))} · ${scalar(inv.vatTreatment)}`,
            ...(e.error ? ["", e.error] : []),
            "",
            "Signed with Golden Sea's e-signature and submitted; the invoice number is the idempotency key, so a retry never creates a second submission.",
          ].join("\n"),
        };
      },
    ),
    // What recording a payment against it starts from.
    computed(
      {
        name: "paymentDraft",
        type: "group",
        admin: { condition: () => false },
        fields: [
          { name: "reference", type: "text" },
          { name: "note", type: "text" },
        ],
      },
      (inv) =>
        Number(inv.balance) > 0
          ? {
              // A fixed sample reference, so the action is the same on every read.
              reference: `TRX-77${scalar(inv.number).replace(/\D/g, "").slice(-3).padStart(3, "0")}`,
              note: `Balance ${moneyText(Number(inv.balance), scalar(inv.currency))} · due ${dayText(inv.dueDate)}. Recorded after the money is in the bank — the system never moves money.`,
            }
          : null,
    ),
    {
      type: "row",
      fields: [
        { name: "issuedAt", type: "date" },
        { name: "dueDate", type: "date" },
        {
          name: "vatTreatment",
          type: "select",
          options: ["14% standard", "0% — foreign vessel in transit", "Exempt"],
          defaultValue: "0% — foreign vessel in transit",
        },
      ],
    },
    {
      name: "billing",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "legalEntity", type: "text" },
            { name: "taxId", type: "text" },
          ],
        },
      ],
    },
    {
      name: "eInvoice",
      type: "group",
      label: "Egyptian e-invoice (tax authority)",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "status",
              type: "select",
              label: "E-invoice (tax authority)",
              options: ["Not submitted", "Submitted", "Valid", "Invalid", "Rejected", "Cancelled"],
              defaultValue: "Not submitted",
              custom: tones({
                "Not submitted": "neutral",
                Submitted: "info",
                Valid: "success",
                Invalid: "error",
                Rejected: "error",
                Cancelled: "neutral",
              }),
            },
            { name: "uuid", type: "text", label: "UUID" },
            { name: "submittedAt", type: "date" },
          ],
        },
        { name: "error", type: "text" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Draft",
      options: ["Draft", "Open", "Partially paid", "Paid", "Overdue", "Cancelled"],
      custom: tones({
        Draft: "neutral",
        Open: "info",
        "Partially paid": "warning",
        Paid: "success",
        Overdue: "error",
        Cancelled: "neutral",
      }),
      admin: { position: "sidebar" },
    },
    {
      name: "collectionRule",
      type: "text",
      admin: { position: "sidebar", readOnly: true, description: "From the customer's contact rule." },
    },
  ],
};

/**
 * Money in and out. Recorded after the bank movement — the system never initiates transfers.
 * Supplier payments need an approved approval record.
 */
export const Payments: CollectionConfig = {
  slug: "payments",
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "direction", "amount", "currency", "paidAt", "status"],
    group: "Finance",
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
            throw ruleError("Outgoing payments need an approved approval (deposit / payment).");
        }
        return data;
      },
    ],
    afterChange: [
      // Allocating a customer receipt updates the invoice's paid amount.
      async ({ doc, operation, req }) => {
        if (operation !== "create" || doc.direction !== "in" || !doc.invoice || req.context?.seed) return doc;
        const inv = (await req.payload.findByID({
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
          text: `Payment ${doc.currency} ${doc.amount} allocated to ${inv.number}.`,
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
          options: [
            { label: "Customer receipt", value: "in" },
            { label: "Supplier payment", value: "out" },
          ],
        },
        { name: "reference", type: "text", required: true, label: "Bank reference" },
        { name: "paidAt", type: "date", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "amount", type: "number", min: 0, required: true, custom: formats.money("currency") },
        { name: "currency", type: "select", options: CURRENCIES, required: true },
        { name: "fxRate", type: "number", min: 0, label: "Actual FX" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "invoice",
          type: "relationship",
          relationTo: "invoices",
          admin: { condition: (_, s) => s?.direction === "in" },
        },
        {
          name: "bill",
          type: "relationship",
          relationTo: "supplier-bills",
          admin: { condition: (_, s) => s?.direction === "out" },
        },
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          admin: { condition: (_, s) => s?.direction === "out" },
        },
      ],
    },
    {
      name: "kind",
      type: "select",
      options: ["Deposit / advance", "Installment", "Balance", "Full"],
      defaultValue: "Full",
    },
    {
      name: "approval",
      type: "relationship",
      relationTo: "approvals",
      admin: { condition: (_, s) => s?.direction === "out" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Recorded",
      options: ["Planned", "Recorded", "Reconciled", "Reversed"],
      admin: { position: "sidebar" },
    },
  ],
};
