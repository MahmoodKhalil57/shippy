import type { CollectionConfig } from "payload";
import {
  CURRENCIES,
  SUPPLIER_RFQ_STATUSES,
  caseRef,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
} from "./shared.ts";

/**
 * Everything that arrives: emails (Outlook / Gmail), the website quick-quote form, WhatsApp photos,
 * phone notes. Each message is classified, matched or turned into a case. `messageId` makes
 * re-processing idempotent (no duplicate cases or acknowledgements).
 */
export const IntakeMessages: CollectionConfig = {
  slug: "intake-messages",
  labels: { singular: "Intake message", plural: "Intake messages" },
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "fromName", "channel", "classification", "status", "receivedAt"],
    group: "Sourcing desk",
  },
  defaultSort: "-receivedAt",
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Message",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "channel",
                  type: "select",
                  required: true,
                  options: ["Email", "Website form", "WhatsApp", "Phone", "Customer portal"],
                },
                { name: "mailbox", type: "text", admin: { placeholder: "sales@ / purchasing@" } },
                {
                  name: "receivedAt",
                  type: "date",
                  required: true,
                  admin: { date: { pickerAppearance: "dayAndTime" } },
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "from", type: "text", required: true },
                { name: "fromName", type: "text" },
              ],
            },
            { name: "subject", type: "text", required: true },
            { name: "body", type: "textarea" },
            { name: "attachments", type: "upload", relationTo: "media", hasMany: true },
            {
              name: "files",
              type: "array",
              labels: { singular: "Attachment", plural: "Attachments (as received)" },
              admin: { description: "The original attachments, kept with the message." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "kind", type: "select", options: ["Excel", "PDF", "Word", "Image", "Other"] },
                    { name: "note", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "messageId",
              type: "text",
              unique: true,
              admin: {
                readOnly: true,
                description: "Mailbox message-id / form submission id — re-processing the same message is a no-op.",
              },
            },
            { name: "attachmentHash", type: "text", admin: { readOnly: true } },
            {
              name: "scenario",
              type: "text",
              admin: { hidden: true, description: "Demo: which canned AI result this message gets." },
            },
          ],
        },
        {
          label: "Extraction",
          fields: [
            {
              name: "extraction",
              type: "group",
              label: "AI draft (never applied automatically when confidence is low)",
              fields: [
                {
                  name: "header",
                  type: "array",
                  labels: { singular: "Field", plural: "Fields" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "field", type: "text", required: true },
                        { name: "value", type: "text" },
                        { name: "confidence", type: "number", min: 0, max: 1 },
                      ],
                    },
                  ],
                },
                {
                  name: "lines",
                  type: "array",
                  labels: { singular: "Line", plural: "Lines" },
                  fields: [
                    { name: "description", type: "text", required: true },
                    {
                      type: "row",
                      fields: [
                        { name: "brand", type: "text" },
                        { name: "partNo", type: "text" },
                        { name: "impa", type: "text" },
                        { name: "issa", type: "text" },
                        { name: "qty", type: "text" },
                        { name: "unit", type: "text" },
                        { name: "brandRule", type: "select", options: ["Any", "Preferred brand", "Exact brand"] },
                        { name: "confidence", type: "number", min: 0, max: 1 },
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        { name: "store", type: "text" },
                        { name: "source", type: "text", label: "Source attachment" },
                        { name: "flag", type: "text", label: "Missing / unclear" },
                      ],
                    },
                    { name: "originalText", type: "text" },
                  ],
                },
                { name: "missing", type: "array", fields: [{ name: "item", type: "text", required: true }] },
                { name: "clarification", type: "textarea", label: "Drafted clarification request (not sent)" },
                {
                  name: "assignment",
                  type: "group",
                  label: "Suggested by the assignment rules",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "owner", type: "relationship", relationTo: "users" },
                        { name: "backup", type: "relationship", relationTo: "users" },
                        { name: "deadline", type: "date" },
                      ],
                    },
                    { name: "rule", type: "text" },
                  ],
                },
                {
                  name: "acknowledgement",
                  type: "group",
                  label: "Acknowledgement draft",
                  fields: [
                    { name: "subject", type: "text" },
                    { name: "body", type: "textarea" },
                    { name: "manual", type: "checkbox", label: "Owner sends it by hand (WhatsApp / phone)" },
                  ],
                },
                { name: "model", type: "text", admin: { readOnly: true, description: "Model / version used" } },
                { name: "extractedAt", type: "date", admin: { readOnly: true } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "classification",
      type: "select",
      options: ["New RFQ", "Supplier reply", "Service request", "Duplicate", "Customer reply", "Not an RFQ"],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "New",
      options: ["New", "Needs review", "Linked", "Case created", "Ignored"],
      admin: { position: "sidebar" },
    },
    {
      name: "match",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        { name: "case", type: "relationship", relationTo: "cases" },
        { name: "supplierRfq", type: "relationship", relationTo: "supplier-rfqs" },
        { name: "reference", type: "text", label: "Reference found" },
        { name: "confidence", type: "number", min: 0, max: 1 },
        { name: "basis", type: "textarea" },
        {
          name: "candidates",
          type: "array",
          admin: { description: "Below 85% confidence a person picks the case (review queue)." },
          fields: [
            { name: "case", type: "relationship", relationTo: "cases", required: true },
            { name: "confidence", type: "number", min: 0, max: 1 },
            { name: "reason", type: "text" },
          ],
        },
        { name: "reviewedBy", type: "relationship", relationTo: "users" },
        { name: "reviewedAt", type: "date" },
      ],
    },
    {
      name: "offerDraft",
      type: "array",
      labels: { singular: "Offer line", plural: "Offer read from the reply" },
      admin: {
        position: "sidebar",
        description: "Supplier offer lines read from a reply; saved as offers once matched.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", required: true, min: 1 },
            { name: "price", type: "number", min: 0, access: { read: costVisible } },
            { name: "currency", type: "select", options: CURRENCIES, defaultValue: "EGP" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "packs", type: "number", min: 0 },
            { name: "packSize", type: "number", min: 0 },
            { name: "packLabel", type: "text" },
            { name: "leadDays", type: "number", min: 0 },
            { name: "validDays", type: "number", min: 0 },
          ],
        },
        { name: "offeredDescription", type: "text" },
        { name: "uncertain", type: "text", label: "What a person should confirm" },
        { name: "confidence", type: "number", min: 0, max: 1 },
      ],
    },
    {
      name: "source",
      type: "select",
      defaultValue: "Live",
      options: ["Live", "History import"],
      admin: {
        position: "sidebar",
        description: "History import: a past email organised by the inbox-history import.",
      },
    },
    {
      name: "history",
      type: "group",
      label: "History import review",
      admin: { position: "sidebar", condition: (data) => data?.source === "History import" },
      fields: [
        { name: "kind", type: "select", options: ["Customer", "Vessel", "Supplier", "Price", "Confidential"] },
        { name: "question", type: "text" },
        { name: "proposal", type: "text" },
        { name: "confidence", type: "number", min: 0, max: 1 },
        { name: "decision", type: "select", options: ["Confirmed", "Rejected"] },
      ],
    },
    { name: "createdCase", type: "relationship", relationTo: "cases", admin: { position: "sidebar", readOnly: true } },
    {
      name: "acknowledgedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true, description: "Set once — never acknowledged twice." },
    },
  ],
};

/** One request per supplier, anonymised: only the lines they can quote, no client identity. */
export const SupplierRfqs: CollectionConfig = {
  slug: "supplier-rfqs",
  labels: { singular: "Supplier RFQ", plural: "Supplier RFQs" },
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "case", "supplier", "status", "dueAt", "reminders"],
    group: "Sourcing desk",
  },
  defaultSort: "dueAt",
  access: deskAccess,
  hooks: {
    beforeValidate: [
      // GS-SRFQ-0142-A, -B, … per case.
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data || data.reference || !data.case) return data;
        const c = (await req.payload.findByID({ collection: "cases", id: String(idOf(data.case)), depth: 0 })) as {
          caseId?: string;
        };
        const { totalDocs } = await req.payload.count({
          collection: "supplier-rfqs" as never,
          where: { case: { equals: idOf(data.case) } },
        });
        const n = String(c.caseId ?? "").replace(/\D/g, "");
        return { ...data, reference: `GS-SRFQ-${n}-${String.fromCharCode(65 + totalDocs)}` };
      },
    ],
    beforeChange: [
      // Reminders stop when the supplier answers or declines.
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
            text: `${doc.reference}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "reference", type: "text", unique: true, admin: { readOnly: true } },
        caseRef(),
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
      ],
    },
    { name: "lineNos", type: "number", hasMany: true, label: "Lines included", required: true },
    {
      type: "row",
      fields: [
        { name: "sentAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
        { name: "dueAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "reminders", type: "number", min: 0, defaultValue: 0 },
        { name: "nextReminderAt", type: "date" },
        { name: "escalated", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "lastEvent", type: "text" },
    {
      type: "row",
      fields: [
        {
          name: "mode",
          type: "select",
          options: ["Split by category", "Full list"],
          defaultValue: "Split by category",
        },
        { name: "category", type: "text", admin: { description: "The category this supplier was asked for." } },
      ],
    },
    {
      name: "supplierQuestion",
      type: "textarea",
      admin: { condition: (_, s) => s?.status === "Clarification needed" },
    },
    {
      name: "anonymised",
      type: "checkbox",
      label: "Client identity & attachments removed",
      defaultValue: true,
      validate: (v: unknown) => v === true || "Supplier RFQs never carry the client's identity.",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: SUPPLIER_RFQ_STATUSES,
      admin: { position: "sidebar" },
    },
    { name: "sentBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};

/** Supplier offers, one per line and version. Revisions supersede, never overwrite. */
export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "case", "lineNo", "supplier", "price", "currency", "leadDays", "compliance"],
    group: "Sourcing desk",
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
        // A new version supersedes the previous one (kept for audit).
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
      // Every captured price also lands in the supplier's dated price history.
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
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(),
        { name: "lineNo", type: "number", required: true, min: 1, label: "Line #" },
        { name: "supplierRfq", type: "relationship", relationTo: "supplier-rfqs" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
        { name: "product", type: "relationship", relationTo: "products" },
        { name: "version", type: "number", min: 1, defaultValue: 1 },
        { name: "supersedes", type: "relationship", relationTo: "offers" },
      ],
    },
    { name: "offeredDescription", type: "text", label: "As offered (brand / part / spec)" },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          label: "Price per pack",
          access: { read: costVisible },
        },
        { name: "currency", type: "select", options: CURRENCIES, required: true, defaultValue: "EGP" },
        { name: "discountPct", type: "number", min: 0, max: 100 },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "packs", type: "number", required: true, min: 0, label: "Packs offered" },
        { name: "packSize", type: "number", min: 0, defaultValue: 1, label: "Base units per pack" },
        { name: "packLabel", type: "text", admin: { placeholder: "100 × 500 ml" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "leadDays", type: "number", min: 0, required: true, label: "Lead time (days)" },
        { name: "validUntil", type: "date" },
        { name: "expiry", type: "text", label: "Batch expiry (YYYY-MM)" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "paymentTerms", type: "text" },
        { name: "deliveryBasis", type: "text" },
        { name: "freightEGP", type: "number", min: 0, label: "Freight (EGP)" },
      ],
    },
    {
      name: "deviations",
      type: "array",
      labels: { singular: "Deviation", plural: "Deviations" },
      admin: {
        description:
          "Wrong brand / part, missing item, quantity shortfall, spec, unit, pack size, expired validity, lead time vs ETA, shelf life.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "type",
              type: "select",
              required: true,
              options: [
                "Wrong brand / part",
                "Missing item",
                "Quantity shortfall",
                "Specification",
                "Unit",
                "Pack size",
                "Expired validity",
                "Lead time vs ETA",
                "Shelf life",
              ],
            },
            {
              name: "severity",
              type: "select",
              options: ["Blocks use", "Needs customer acceptance", "Warning"],
              defaultValue: "Warning",
            },
          ],
        },
        { name: "detail", type: "text" },
        { name: "detectedBy", type: "select", options: ["Rules", "AI", "Person"], defaultValue: "Rules" },
      ],
    },
    evidence("evidence", "Source (email, PDF, WhatsApp screenshot)"),
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "Email",
      options: ["Email", "WhatsApp / phone", "Supplier portal", "Agency pricelist", "Own stock"],
      admin: { position: "sidebar" },
    },
    {
      name: "compliance",
      type: "select",
      defaultValue: "Pending",
      options: ["Pending", "Confirmed", "Rejected", "Awaiting corrected offer"],
      admin: { position: "sidebar", description: "Technical equivalence is a human decision." },
    },
    { name: "superseded", type: "checkbox", defaultValue: false, admin: { position: "sidebar", readOnly: true } },
    {
      name: "enteredBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
    },
  ],
};
