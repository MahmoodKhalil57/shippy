import type { CollectionConfig } from "payload";
import { CURRENCIES, autoNumber, caseRef, financeAccess, idOf, logActivity, ruleError } from "./shared.ts";
import { tones, type CollectionSettings } from "../../mock/types.ts";
import { widgets } from "../../app/widgets/widget.ts";

/** Customer invoices: from delivered quantities, never billing the same quantity twice. */
export const Invoices: CollectionConfig = {
  slug: "invoices",
  custom: { edit: { steps: { field: "status", skip: ["Overdue", "Cancelled"] } } } satisfies CollectionSettings,
  admin: {
    components: { beforeList: [widgets({ widgets: [{ counts: { collection: "invoices", field: "status" } }] })] },
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
        { name: "amount", type: "number", min: 0 },
        { name: "paid", type: "number", min: 0, defaultValue: 0 },
        { name: "balance", type: "number", min: 0, admin: { readOnly: true } },
      ],
    },
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
              options: ["Not submitted", "Submitted", "Valid", "Invalid", "Rejected", "Cancelled"],
              defaultValue: "Not submitted",
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
        { name: "amount", type: "number", min: 0, required: true },
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
