import type { CollectionConfig, TextFieldSingleValidation } from "payload";
import {
  CURRENCIES,
  WAREHOUSES,
  autoNumber,
  caseRef,
  deskAccess,
  evidence,
  financeAccess,
  idOf,
  logActivity,
  management,
  ruleError,
} from "./shared.ts";

/** Supplier purchase orders, created from the approved sales requirement (split suppliers, scheduled quantities). */
export const PurchaseOrders: CollectionConfig = {
  slug: "purchase-orders",
  labels: { singular: "Purchase order", plural: "Purchase orders" },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "supplier", "total", "currency", "status"],
    group: "Fulfilment",
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
        // Confirming a PO is a commercial commitment: re-check must be done and management must approve.
        if (data.status === "Confirmed" && originalDoc?.status !== "Confirmed") {
          if (!data.recheckDone) throw ruleError("Re-check availability, cost, FX and lead time before confirming.");
          if (req.user?.role !== "management" && !req.context?.seed)
            throw ruleError("Supplier POs are approved by management.");
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
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
      ],
    },
    {
      name: "lines",
      type: "array",
      minRows: 1,
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1, required: true },
            { name: "offer", type: "relationship", relationTo: "offers" },
            { name: "description", type: "text", required: true },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "qty", type: "number", min: 0, required: true },
            { name: "unitPrice", type: "number", min: 0, required: true },
            { name: "scheduledFor", type: "date", label: "Scheduled for" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "currency", type: "select", options: CURRENCIES, required: true, defaultValue: "EGP" },
        { name: "total", type: "number", min: 0, admin: { readOnly: true } },
        { name: "deliverTo", type: "select", options: [...WAREHOUSES, "Direct to vessel (dropship)"] },
      ],
    },
    {
      name: "recheck",
      type: "array",
      labels: { singular: "Re-check", plural: "Re-check before approval" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "item", type: "text", required: true },
            { name: "atQuotation", type: "text" },
            { name: "now", type: "text" },
            { name: "ok", type: "checkbox", defaultValue: true },
          ],
        },
      ],
    },
    { name: "recheckDone", type: "checkbox", label: "Re-check completed", defaultValue: false },
    {
      name: "supplierSide",
      type: "group",
      label: "Supplier documents",
      fields: [
        {
          type: "row",
          fields: [
            { name: "acknowledgedAt", type: "date" },
            { name: "proforma", type: "text", label: "Pro forma no." },
            evidence("proformaFile", "Pro forma"),
          ],
        },
        {
          type: "row",
          fields: [
            { name: "depositPct", type: "number", min: 0, max: 100, label: "Deposit %" },
            { name: "depositPayment", type: "relationship", relationTo: "payments" },
            { name: "balanceDue", type: "date" },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: [
        "Draft",
        "Awaiting approval",
        "Confirmed",
        "Acknowledged",
        "Deposit paid",
        "Partially received",
        "Received",
        "Billed",
        "Closed",
        "Cancelled",
      ],
      admin: { position: "sidebar" },
    },
  ],
};

/** The same supplier can't book the same bill number twice (the demo's blocked duplicate bill). */
const uniqueBillNumber: TextFieldSingleValidation = async (value, { req, siblingData, id }) => {
  const supplier = idOf((siblingData as { supplier?: unknown } | undefined)?.supplier);
  if (!value || !supplier) return true;
  const { docs } = await req.payload.find({
    collection: "supplier-bills" as never,
    where: { and: [{ billNumber: { equals: value } }, { supplier: { equals: supplier } }] },
    depth: 0,
    limit: 2,
  });
  return docs.some((d) => String((d as { id: unknown }).id) !== String(id))
    ? "Duplicate bill: this supplier's bill number is already booked."
    : true;
};

/** Supplier bills: matched to PO and received quantities; the same supplier + bill number can't be booked twice. */
export const SupplierBills: CollectionConfig = {
  slug: "supplier-bills",
  labels: { singular: "Supplier bill", plural: "Supplier bills" },
  admin: {
    useAsTitle: "billNumber",
    defaultColumns: ["billNumber", "supplier", "purchaseOrder", "amount", "status", "dueDate"],
    group: "Fulfilment",
  },
  access: financeAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Three-way match: ordered = received = billed, otherwise on hold.
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
        },
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
        { name: "purchaseOrder", type: "relationship", relationTo: "purchase-orders" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "amount", type: "number", min: 0, required: true },
        { name: "currency", type: "select", options: CURRENCIES, defaultValue: "EGP" },
        { name: "vatAmount", type: "number", min: 0, label: "Input VAT (recoverable)" },
        { name: "dueDate", type: "date" },
      ],
    },
    {
      name: "match",
      type: "array",
      labels: { singular: "Line", plural: "PO / receipt / bill match" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1 },
            { name: "ordered", type: "number", min: 0 },
            { name: "received", type: "number", min: 0 },
            { name: "billed", type: "number", min: 0 },
          ],
        },
      ],
    },
    { name: "creditNote", type: "text", label: "Linked credit note" },
    evidence("file", "Bill document"),
    {
      name: "status",
      type: "select",
      defaultValue: "Received",
      options: ["Received", "Matched", "On hold", "Approved for payment", "Paid", "Credit note", "Cancelled"],
      admin: { position: "sidebar" },
    },
    { name: "holdReason", type: "text", admin: { position: "sidebar", readOnly: true } },
  ],
};

/** Goods received: quantities, lots, expiry and quality check per PO line. */
export const Receipts: CollectionConfig = {
  slug: "receipts",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "purchaseOrder", "received", "ordered", "qc"],
    group: "Fulfilment",
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
            text: `Receipt ${doc.label}: ${doc.qc}${doc.shortfall ? ` — ${doc.shortfall} short` : ""}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(),
        { name: "purchaseOrder", type: "relationship", relationTo: "purchase-orders", required: true },
        { name: "lineNo", type: "number", min: 1, required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "ordered", type: "number", min: 0, required: true },
        { name: "received", type: "number", min: 0, required: true },
        { name: "shortfall", type: "number", min: 0, admin: { readOnly: true } },
        { name: "receivedAt", type: "date" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "warehouse", type: "select", options: [...WAREHOUSES, "Direct to vessel"] },
        { name: "lot", type: "text" },
        { name: "expiry", type: "date" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "qc",
          type: "select",
          label: "Quality check",
          options: ["OK", "Short", "Damaged", "Wrong item", "Shelf life too short", "Certificate missing"],
          defaultValue: "OK",
        },
        { name: "claim", type: "text", label: "Damage / shortage claim" },
        { name: "backorderDate", type: "date" },
      ],
    },
    { name: "certificates", type: "upload", relationTo: "media", hasMany: true },
  ],
};

/** Deliveries to vessel or site: plan, dispatch and confirmed receipt with evidence. */
export const Deliveries: CollectionConfig = {
  slug: "deliveries",
  admin: { useAsTitle: "number", defaultColumns: ["number", "case", "plannedAt", "status"], group: "Fulfilment" },
  access: deskAccess,
  hooks: {
    beforeValidate: [autoNumber("deliveries", "number", "DN-")],
    beforeChange: [
      ({ data }) => {
        // "Delivered" needs evidence; dispatch and confirmed receipt are separate.
        if (data.status === "Delivered — confirmed" && !data.proof)
          throw ruleError("Attach the signed delivery note or photo before confirming delivery.");
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
        {
          name: "consolidatedWith",
          type: "relationship",
          relationTo: "cases",
          hasMany: true,
          label: "Also carries (e.g. cleared spares)",
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "plannedAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
        { name: "place", type: "text", required: true },
      ],
    },
    {
      name: "plan",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "vehicle", type: "text", admin: { placeholder: "Golden Sea truck 3 (reefer)" } },
            { name: "boardingStaff", type: "text" },
            { name: "launch", type: "text", label: "Launch / boat booking" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "readyAt", type: "date", label: "Goods ready" },
            { name: "clearance", type: "text", label: "Clearance / ship-stores declaration" },
            { name: "coldChain", type: "checkbox", label: "Cold chain (temperature log)", defaultValue: false },
          ],
        },
        {
          name: "temperatureLog",
          type: "array",
          admin: { condition: (_, s) => Boolean(s?.coldChain) },
          fields: [
            {
              type: "row",
              fields: [
                { name: "at", type: "date" },
                { name: "point", type: "select", options: ["Loading", "Base", "Boat transfer", "On board"] },
                { name: "celsius", type: "number" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "lines",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1, required: true },
            { name: "qty", type: "number", min: 0, required: true },
            { name: "lot", type: "text" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "dispatchedAt", type: "date" },
        { name: "confirmedAt", type: "date" },
        { name: "confirmedBy", type: "text", label: "Signed by (vessel)" },
      ],
    },
    evidence("proof", "Signed delivery note / photo"),
    { name: "shortages", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Planned",
      options: [
        "Planned",
        "Ready",
        "Dispatched",
        "Delivered — confirmed",
        "Partially delivered",
        "Rescheduled",
        "Cancelled",
      ],
      admin: { position: "sidebar" },
    },
  ],
};
