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
                  admin: { description: "9 digits, from the customer's tax card on file." },
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
        {
          name: "number",
          type: "text",
          unique: true,
          admin: { readOnly: true, description: "Numbered automatically when saved, like INV/2026/0412." },
        },
        caseRef(true, { hint: "The customer case this invoice bills." }),
        {
          name: "customer",
          type: "relationship",
          relationTo: "customers",
          required: true,
          admin: {
            description: "The shipping company or owner who pays this invoice.",
            placeholder: "e.g. Nile Maritime Co.",
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
          options: ["Delivery", "Milestone", "Deposit", "Installment", "Final balance", "Service fees"],
          defaultValue: "Delivery",
          admin: {
            description: "Why this invoice is raised: a delivery, a deposit or a milestone.",
            placeholder: "Pick a basis",
          },
        },
        {
          name: "delivery",
          type: "relationship",
          relationTo: "deliveries",
          admin: {
            description: "The delivery being billed, when the basis is a delivery.",
            placeholder: "e.g. DN-0212",
          },
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      admin: { description: "What is billed, one row per item delivered." },
      custom: {
        about:
          "A line's total invoiced quantity across all invoices cannot exceed what was delivered, so the same quantity is never billed twice.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              min: 1,
              admin: { description: "The order line this row bills.", placeholder: "e.g. 1" },
            },
            {
              name: "description",
              type: "text",
              required: true,
              admin: { description: "The item as it appears on the invoice.", placeholder: "e.g. Coverall FR, size L" },
            },
            {
              name: "qty",
              type: "number",
              min: 0,
              required: true,
              admin: { description: "Units billed on this invoice.", placeholder: "e.g. 40" },
            },
            {
              name: "deliveredQty",
              type: "number",
              min: 0,
              admin: {
                description: "Units delivered to the vessel. Billing cannot go above it.",
                placeholder: "e.g. 40",
              },
            },
            {
              name: "unitPrice",
              type: "number",
              min: 0,
              required: true,
              admin: { description: "The selling price per unit, before VAT.", placeholder: "e.g. 1,950" },
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
          admin: { description: "The currency the customer is billed in.", placeholder: "USD" },
        },
        {
          name: "amount",
          type: "number",
          min: 0,
          admin: { description: "The invoice total. It is worked out from the lines.", placeholder: "e.g. 48,200" },
          custom: formats.money("currency"),
        },
        {
          name: "paid",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: {
            description: "Payments received so far. It grows as customer receipts are recorded.",
            placeholder: "e.g. 10,000",
          },
          custom: formats.money("currency"),
        },
        {
          name: "balance",
          type: "number",
          min: 0,
          admin: { readOnly: true, description: "Amount minus paid. It reaches zero when the invoice is settled." },
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
            label: "Balance (USD)",
            admin: { description: "The open balance at today's FX rate, so invoices compare." },
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
            label: "Days overdue",
            admin: { description: "Days past the due date. Zero or less means not yet due." },
            custom: formats.days(),
          },
          (inv) => (collectible(inv) ? daysSince(inv.dueDate) : 0),
        ),
        computed(
          {
            name: "ageBucket",
            type: "select",
            label: "Age",
            options: [...AGE_BUCKETS],
            admin: { description: "How late the invoice is, in the buckets finance reads receivables by." },
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
        admin: { condition: () => false, description: "The collection reminder the AI drafts for this invoice." },
        fields: [
          {
            name: "mode",
            type: "text",
            admin: {
              description: "Customer email, or internal only for a do-not-chase account.",
              placeholder: "e.g. customer",
            },
          },
          {
            name: "to",
            type: "text",
            admin: {
              description: "The customer contact the email goes to.",
              placeholder: "e.g. accounts@nilemaritime.com",
            },
          },
          {
            name: "subject",
            type: "text",
            admin: {
              description: "The email subject line.",
              placeholder: "e.g. Golden Sea invoice INV/2026/0412, overdue",
            },
          },
          {
            name: "body",
            type: "textarea",
            admin: {
              description: "The drafted message a person reviews before sending.",
              placeholder: "Dear accounts team,",
            },
          },
          {
            name: "note",
            type: "text",
            admin: {
              description: "The account's contact rule that shaped the draft.",
              placeholder: "e.g. Account rule: follow-ups allowed.",
            },
          },
        ],
      },
      async (inv, req) => (collectible(inv) ? reminderDraft(inv, await related(req, "customers", inv.customer)) : null),
    ),
    // What the case's invoice table reads it by, in one line each.
    {
      type: "row",
      fields: [
        computed(
          {
            name: "basisNote",
            type: "text",
            label: "Basis",
            admin: { description: "Basis, delivery and issue date in one line." },
          },
          async (inv, req) => {
            const delivery = await related(req, "deliveries", inv.delivery);
            return `${scalar(inv.basis) || "Delivery"}${delivery ? ` · ${scalar(delivery.number)}` : ""} · ${dayText(inv.issuedAt)}`;
          },
        ),
        computed(
          {
            name: "linesSummary",
            type: "text",
            label: "Invoiced lines",
            admin: { description: "Each billed line against what was delivered." },
          },
          (inv) =>
            ((inv.lines as Record<string, unknown>[] | undefined) ?? [])
              .map(
                (l) =>
                  `L${scalar(l.lineNo)} · ${scalar(l.qty)}${l.deliveredQty != null ? ` of ${scalar(l.deliveredQty)} delivered` : ""} × ${moneyText(Number(l.unitPrice) || 0, scalar(inv.currency))}`,
              )
              .join("; "),
        ),
        // The tax authority's answer: its error, else the UUID it gave.
        computed(
          {
            name: "eInvoiceNote",
            type: "text",
            label: "E-invoice note",
            admin: { description: "The tax authority's error, or the UUID it issued." },
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
            label: "Payments",
            admin: { description: "The open balance and each payment received." },
          },
          async (inv, req) => {
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
          },
        ),
      ],
    },
    // The next step with the tax authority (the e-invoice actions read it): nothing once valid.
    computed(
      {
        name: "eInvoiceNext",
        type: "group",
        admin: { condition: () => false, description: "The next step with the tax authority for this invoice." },
        fields: [
          {
            name: "mode",
            type: "text",
            admin: { description: "Local buyer, foreign buyer, or a status refresh.", placeholder: "e.g. local" },
          },
          {
            name: "label",
            type: "text",
            admin: { description: "The action's name on the button.", placeholder: "e.g. Sign & submit" },
          },
          {
            name: "summary",
            type: "textarea",
            admin: {
              description: "What the submission contains, shown before sending.",
              placeholder: "e.g. Nile Maritime Co. · EGP 48,200 · 14% standard",
            },
          },
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
        admin: { condition: () => false, description: "What recording a payment starts from." },
        fields: [
          {
            name: "reference",
            type: "text",
            admin: { description: "A sample bank reference to start from.", placeholder: "e.g. TRX-77412" },
          },
          {
            name: "note",
            type: "text",
            admin: {
              description: "The open balance and due date, as a reminder.",
              placeholder: "e.g. Balance EGP 48,200 · due 17 Nov",
            },
          },
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
        { name: "issuedAt", type: "date", admin: { description: "The invoice date printed on the document." } },
        {
          name: "dueDate",
          type: "date",
          admin: { description: "The date payment is due under the customer's terms." },
        },
        {
          name: "vatTreatment",
          type: "select",
          options: ["14% standard", "0% — foreign vessel in transit", "Exempt"],
          defaultValue: "0% — foreign vessel in transit",
          admin: {
            description: "The VAT rate applied. Foreign vessels in transit are usually 0%.",
            placeholder: "Pick a VAT treatment",
          },
          custom: {
            about:
              "A 14% standard invoice goes to a local buyer and needs their tax registration number when submitted to the tax authority.",
          },
        },
      ],
    },
    {
      name: "billing",
      type: "group",
      admin: { description: "The legal entity and tax number the invoice is issued to." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "legalEntity",
              type: "text",
              admin: {
                description: "The company name as it appears on its tax card.",
                placeholder: "e.g. Nile Maritime Co. S.A.E.",
              },
            },
            {
              name: "taxId",
              type: "text",
              admin: { description: "The buyer's tax registration number, 9 digits.", placeholder: "e.g. 100-200-300" },
            },
          ],
        },
      ],
    },
    {
      name: "eInvoice",
      type: "group",
      label: "Egyptian e-invoice (tax authority)",
      admin: { description: "Where the invoice stands with the Egyptian tax authority." },
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
              admin: {
                description: "The tax authority's verdict on the submitted invoice.",
                placeholder: "Pick a status",
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
              label: "UUID",
              admin: {
                description: "The unique ID the tax authority gave the invoice.",
                placeholder: "e.g. 7K3M9X2P4Q8R",
              },
            },
            {
              name: "submittedAt",
              type: "date",
              admin: { description: "When the invoice was sent to the tax authority." },
            },
          ],
        },
        {
          name: "error",
          type: "text",
          admin: {
            description: "The reason the tax authority gave when it refused the invoice.",
            placeholder: "e.g. Buyer tax ID not found",
          },
        },
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
      admin: {
        position: "sidebar",
        description: "Where the invoice is. It moves on its own as payments arrive.",
        placeholder: "Pick a status",
      },
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
          admin: {
            description: "Money in from a customer, or money out to a supplier.",
            placeholder: "Pick a direction",
          },
        },
        {
          name: "reference",
          type: "text",
          required: true,
          label: "Bank reference",
          admin: { description: "The reference on the bank transfer or cheque.", placeholder: "e.g. TRX-77412" },
        },
        {
          name: "paidAt",
          type: "date",
          required: true,
          admin: { description: "The day the money moved at the bank." },
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
          admin: { description: "The amount that moved at the bank.", placeholder: "e.g. 48,200" },
          custom: formats.money("currency"),
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          admin: { description: "The currency of the transfer.", placeholder: "EGP" },
        },
        {
          name: "fxRate",
          type: "number",
          min: 0,
          label: "Actual FX",
          admin: { description: "The rate the bank applied, in pounds per unit.", placeholder: "e.g. 48.6" },
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
          admin: {
            condition: (_, s) => s?.direction === "in",
            description: "The customer invoice this receipt is allocated to.",
            placeholder: "e.g. INV/2026/0412",
          },
        },
        {
          name: "bill",
          type: "relationship",
          relationTo: "supplier-bills",
          admin: {
            condition: (_, s) => s?.direction === "out",
            description: "The supplier bill this payment settles.",
            placeholder: "e.g. DM-5512",
          },
        },
        {
          name: "purchaseOrder",
          type: "relationship",
          relationTo: "purchase-orders",
          admin: {
            condition: (_, s) => s?.direction === "out",
            description: "The purchase order a deposit or advance is paid against.",
            placeholder: "e.g. PO/2026/0214",
          },
        },
      ],
    },
    {
      name: "kind",
      type: "select",
      options: ["Deposit / advance", "Installment", "Balance", "Full"],
      defaultValue: "Full",
      admin: { description: "Whether this covers the whole amount or only a part.", placeholder: "Pick a kind" },
    },
    {
      name: "approval",
      type: "relationship",
      relationTo: "approvals",
      admin: {
        condition: (_, s) => s?.direction === "out",
        description: "The approved payment approval. A supplier payment cannot be recorded without it.",
        placeholder: "Search approvals",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Recorded",
      options: ["Planned", "Recorded", "Reconciled", "Reversed"],
      admin: {
        position: "sidebar",
        description: "Recorded once the bank movement happened, Reconciled once matched.",
        placeholder: "Pick a status",
      },
    },
  ],
};
