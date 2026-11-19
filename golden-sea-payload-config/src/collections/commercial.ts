import type { CollectionConfig } from "payload";
import {
  CURRENCIES,
  QUOTE_DECISIONS,
  UNITS,
  caseRef,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
  ruleError,
} from "./shared.ts";
import { tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import { quotePreview } from "../widgets/quote-preview.ts";

/** Customer quotations, versioned. A revision is a new document; the old version stays. */
export const Quotations: CollectionConfig = {
  slug: "quotations",
  custom: { edit: { steps: { field: "status", skip: ["Returned", "Superseded"] } } } satisfies CollectionSettings,
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "version", "status", "totalExVat", "currency", "validUntil"],
    group: "Commercial",
    // The quotation as the customer receives it (Payload custom edit view).
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
        const c = (await req.payload.findByID({ collection: "cases", id: String(idOf(data.case)), depth: 0 })) as {
          caseId?: string;
        };
        const { totalDocs } = await req.payload.count({
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
        // Totals from the line snapshot.
        const lines = (data.lines as { qty?: number; unitPrice?: number }[] | undefined) ?? [];
        const gross = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
        data.totalExVat = Math.round(gross * (1 - (Number(data.discountPct) || 0) / 100) * 100) / 100;
        // Approved quotations can't be edited — create a revision instead.
        if (
          originalDoc?.status === "Approved" &&
          data.status === "Approved" &&
          JSON.stringify(originalDoc.lines) !== JSON.stringify(data.lines)
        )
          throw ruleError("This version is approved. Create a revision to change lines or prices.");
        // Only management approves.
        if (data.status === "Approved" && originalDoc?.status !== "Approved" && req.user?.role !== "management")
          throw ruleError("Only management can approve quotations.");
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: `Quotation ${doc.number}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "number", type: "text", unique: true, admin: { readOnly: true } },
        caseRef(),
        { name: "version", type: "number", min: 1, admin: { readOnly: true } },
        { name: "previousVersion", type: "relationship", relationTo: "quotations" },
      ],
    },
    {
      name: "lines",
      type: "array",
      labels: { singular: "Line", plural: "Lines" },
      admin: { description: "Customer-facing snapshot — no supplier names, costs or margins." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1 },
            { name: "partNo", type: "text" },
            { name: "description", type: "text", required: true },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "unit", type: "select", options: UNITS },
            { name: "qty", type: "number", min: 0, required: true },
            { name: "unitPrice", type: "number", min: 0, required: true },
            { name: "lead", type: "text", defaultValue: "On arrival" },
          ],
        },
        { name: "alternative", type: "checkbox", label: "Alternative (customer accepted)", defaultValue: false },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "currency", type: "select", options: CURRENCIES, defaultValue: "USD" },
        { name: "fxRate", type: "number", min: 0, label: "FX (EGP per unit)" },
        { name: "discountPct", type: "number", min: 0, max: 50, defaultValue: 0 },
        { name: "totalExVat", type: "number", min: 0, admin: { readOnly: true } },
      ],
    },
    {
      name: "internal",
      type: "group",
      label: "Internal (never printed)",
      access: { read: costVisible },
      fields: [
        {
          type: "row",
          fields: [
            { name: "landedCostEGP", type: "number", min: 0 },
            { name: "grossProfitEGP", type: "number" },
            { name: "marginPct", type: "number" },
          ],
        },
        {
          name: "exceptions",
          type: "textarea",
          admin: { description: "Shown to the approver: margin below minimum, alternative pack, advance payment…" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "validUntil", type: "date" },
        { name: "paymentTerms", type: "text", defaultValue: "90 days from invoice date" },
        { name: "deliveryTerms", type: "text" },
      ],
    },
    { name: "remarks", type: "textarea" },
    {
      name: "submission",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "method",
              type: "select",
              options: ["Email from Odoo", "Customer procurement portal"],
              defaultValue: "Email from Odoo",
            },
            { name: "submittedAt", type: "date" },
            { name: "followUpAt", type: "date" },
          ],
        },
        {
          name: "portalCheck",
          type: "array",
          labels: { singular: "Checked field", plural: "Portal vs quote" },
          admin: { condition: (_, s) => s?.method === "Customer procurement portal" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "field", type: "text", required: true },
                { name: "portal", type: "text" },
                { name: "quote", type: "text" },
                { name: "matches", type: "checkbox", defaultValue: false },
              ],
            },
          ],
        },
        evidence("receipt", "Portal receipt / screenshot"),
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: ["Draft", "Awaiting approval", "Approved", "Returned", "Submitted", "Superseded"],
      custom: tones({
        Draft: "neutral",
        "Awaiting approval": "warning",
        Approved: "success",
        Returned: "error",
        Submitted: "info",
        Superseded: "neutral",
      }),
      admin: { position: "sidebar" },
    },
    {
      name: "decision",
      type: "select",
      options: [...QUOTE_DECISIONS, "Partially won"],
      admin: { position: "sidebar" },
    },
    { name: "preparedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "approvedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true } },
  ],
};

/**
 * Everything that needs an authorised person: quotations, discounts, margin exceptions, supplier POs,
 * deposits & payments, bank-detail changes, FX rates, alternatives, pricelists. Status is computed
 * from the decisions — a two-person rule needs two different approvers.
 */
export const Approvals: CollectionConfig = {
  slug: "approvals",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "status", "requestedBy", "createdAt"],
    group: "Commercial",
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
        const decisions = (data.decisions as { user?: unknown; decision?: string; at?: string }[] | undefined) ?? [];
        const before = (originalDoc?.decisions as unknown[] | undefined)?.length ?? 0;
        const approvers = ((data.approvers as unknown[] | undefined) ?? []).map(idOf);
        // New decisions must come from a listed approver, once each, recorded as themselves.
        decisions.slice(before).forEach((d) => {
          const uid = idOf(d.user) ?? idOf(req.user);
          if (!req.context?.seed && uid !== idOf(req.user)) throw ruleError("You can only record your own decision.");
          if (approvers.length && !approvers.includes(uid))
            throw ruleError("You are not an approver for this request.");
          d.user = uid;
          d.at ??= new Date().toISOString();
        });
        const users = decisions.map((d) => idOf(d.user));
        if (new Set(users).size !== users.length) throw ruleError("Each approver decides once.");
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
          await logActivity(req, { case: idOf(doc.case), text: `Approval “${doc.title}”: ${doc.status}.` });
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            "Customer quotation",
            "Quotation margin exception",
            "Customer discount",
            "Alternative product (internal)",
            "Supplier PO",
            "Supplier deposit (payment)",
            "Supplier payment",
            "Bank detail change",
            "Exchange rate",
            "Agency pricelist",
            "Approved-vendor status",
            "Close with exception",
          ],
        },
        caseRef(false),
      ],
    },
    { name: "detail", type: "textarea" },
    {
      name: "subject",
      type: "relationship",
      relationTo: ["quotations", "purchase-orders", "payments", "suppliers", "pricelists"],
      label: "Record to approve",
    },
    {
      type: "row",
      fields: [
        {
          name: "requestedBy",
          type: "relationship",
          relationTo: "users",
          defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
        },
        { name: "approvers", type: "relationship", relationTo: "users", hasMany: true },
        { name: "twoPerson", type: "checkbox", label: "Two-person rule", defaultValue: false },
      ],
    },
    {
      name: "decisions",
      type: "array",
      labels: { singular: "Decision", plural: "Decisions" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "user", type: "relationship", relationTo: "users" },
            { name: "decision", type: "select", options: ["Approve", "Reject"], required: true },
            { name: "at", type: "date" },
          ],
        },
        { name: "reason", type: "textarea" },
      ],
    },
    {
      name: "status",
      type: "text",
      defaultValue: "Pending",
      admin: { position: "sidebar", readOnly: true, description: "Computed from the decisions." },
    },
  ],
};

/** The customer's purchase order, checked line by line against the approved quotation version. */
export const CustomerPOs: CollectionConfig = {
  slug: "customer-pos",
  labels: { singular: "Customer PO", plural: "Customer POs" },
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "case", "quotation", "status", "receivedAt"],
    group: "Commercial",
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Blocked while any mismatch lacks a recorded resolution.
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
        { name: "number", type: "text", required: true, unique: true },
        caseRef(),
        { name: "quotation", type: "relationship", relationTo: "quotations", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "receivedAt", type: "date" },
        { name: "billingEntity", type: "text" },
        { name: "file", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "checks",
      type: "array",
      labels: { singular: "Check", plural: "PO vs quotation" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 0, admin: { description: "0 = header" } },
            {
              name: "field",
              type: "select",
              required: true,
              options: [
                "Price",
                "Quantity",
                "Pack size",
                "Specification",
                "Currency",
                "Taxes",
                "Delivery terms",
                "Billing entity",
                "Payment terms",
                "Quote validity",
              ],
            },
            { name: "matches", type: "checkbox", defaultValue: false },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "po", type: "text", label: "On the PO" },
            { name: "quote", type: "text", label: "On the quotation" },
          ],
        },
        {
          name: "resolution",
          type: "text",
          admin: { description: "Written customer agreement or approved exception." },
        },
        evidence("evidence", "Customer's written confirmation"),
      ],
    },
    {
      name: "unawarded",
      type: "array",
      labels: { singular: "Unawarded line", plural: "Unawarded lines" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", min: 1, required: true },
            { name: "outcome", type: "select", options: ["Open — revision to follow", "Closed"], required: true },
            { name: "reason", type: "text" },
          ],
        },
      ],
    },
    { name: "status", type: "text", admin: { position: "sidebar", readOnly: true } },
    { name: "openMismatches", type: "number", admin: { position: "sidebar", readOnly: true } },
  ],
};
