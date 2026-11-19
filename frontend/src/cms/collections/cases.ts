import type { CollectionConfig } from "payload";
import { tones, type CollectionSettings } from "../../mock/types.ts";
import { widgets } from "../../app/widgets/widget.ts";
import {
  CASE_TYPES,
  CURRENCIES,
  PORTS,
  QUOTE_DECISIONS,
  STORES,
  UNITS,
  autoNumber,
  costVisible,
  logActivity,
} from "./shared.ts";
import { caseDelivery } from "../widgets/case-delivery.ts";
import { caseOrder } from "../widgets/case-order.ts";
import { caseOverview } from "../widgets/case-overview.ts";
import { caseRfqs } from "../widgets/case-rfqs.ts";
import { caseCompare } from "../widgets/case-compare.ts";
import { casePricing } from "../widgets/case-pricing.ts";
import { caseProfit } from "../widgets/case-profit.ts";

export const STAGES = [
  "New",
  "Validating",
  "Sourcing",
  "Awaiting supplier",
  "Comparing offers",
  "Awaiting corrected offer",
  "Awaiting management approval",
  "Quotation submitted",
  "Awaiting customer decision",
  "Revision requested",
  "Won — PO mismatch",
  "Won — sales order confirmed",
  "Purchasing",
  "Delivering (drop 1 of 2)",
  "Delivered",
  "Invoiced — partially paid",
  "Customs clearance",
  "Held for vessel",
  "Closed — settled",
  "On hold",
  "Lost",
  "Expired",
];

export const WAITS = [
  "Awaiting supplier",
  "Awaiting corrected offer",
  "Awaiting internal approval",
  "Awaiting customer decision",
  "Awaiting delivery or payment",
];

const LINE_STATUSES = [
  "Clarification needed",
  "Not sourced",
  "Awaiting supplier",
  "Ready to select",
  "Awaiting customer acceptance",
  "Offer selected",
  "Split offer selected",
  "Ordered",
  "Received",
  "Delivered",
  "Invoiced",
  "Closed — not awarded",
];

/** A client RFQ (or service request), from intake to settlement. The parent of everything else. */
export const Cases: CollectionConfig = {
  slug: "cases",
  labels: { singular: "Case", plural: "Cases" },
  admin: {
    useAsTitle: "caseId",
    defaultColumns: ["caseId", "customer", "vessel", "stage", "deadline", "owner", "value"],
    group: "Sourcing desk",
    description: "Client RFQs and everything that follows: supplier RFQs, quotes, POs, delivery and payment.",
    // The case workspace: one tab per step from first email to last payment (Payload custom
    // edit views, each a screen of widgets in src/cms/widgets).
    // Counts by what each case is waiting for, above the list, each opening the filtered list.
    components: {
      beforeList: [widgets({ widgets: [{ counts: { collection: "cases", field: "wait" } }] })],
      views: {
        edit: {
          overview: {
            Component: caseOverview,
            path: "/overview",
            tab: { label: "Overview", href: "/overview" },
          },
          rfqs: {
            Component: caseRfqs,
            path: "/rfqs",
            tab: { label: "Supplier RFQs", href: "/rfqs" },
          },
          compare: {
            Component: caseCompare,
            path: "/compare",
            tab: { label: "Compare offers", href: "/compare" },
          },
          pricing: {
            Component: casePricing,
            path: "/pricing",
            tab: { label: "Pricing", href: "/pricing" },
          },
          order: {
            Component: caseOrder,
            path: "/order",
            tab: { label: "Order & purchasing", href: "/order" },
          },
          delivery: {
            Component: caseDelivery,
            path: "/delivery",
            tab: { label: "Delivery & billing", href: "/delivery" },
          },
          profit: {
            Component: caseProfit,
            path: "/profit",
            tab: { label: "Profit & close", href: "/profit" },
          },
        },
      },
    },
  },
  defaultSort: "deadline",
  // A board by what each case waits for; the stage as steps above the form.
  custom: {
    list: { board: "wait", cardFields: ["customer", "vessel", "deadline", "owner"] },
    edit: {
      steps: {
        field: "stage",
        skip: [
          "Awaiting corrected offer",
          "Revision requested",
          "Won — PO mismatch",
          "Customs clearance",
          "Held for vessel",
          "On hold",
          "Lost",
          "Expired",
        ],
      },
    },
  } satisfies CollectionSettings,
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    // Number new cases GS-RFQ-0143, GS-RFQ-0144, … (service and held cases use their own prefixes).
    beforeValidate: [
      async (args) => {
        const { data } = args;
        const prefix = data?.caseType === "service" ? "GS-SVC-" : data?.caseType === "held" ? "GS-HLD-" : "GS-RFQ-";
        return autoNumber("cases", "caseId", prefix)(args);
      },
    ],
    afterChange: [
      // Stage, owner and decision changes go to the case timeline.
      async ({ doc, previousDoc, operation, req }) => {
        if (req.context?.seed) return doc;
        if (operation === "create") await logActivity(req, { case: doc.id, text: `Case ${doc.caseId} created.` });
        else {
          if (previousDoc?.stage !== doc.stage)
            await logActivity(req, { case: doc.id, text: `Stage: ${previousDoc?.stage ?? "—"} → ${doc.stage}.` });
          const prevOwner = typeof previousDoc?.owner === "object" ? previousDoc?.owner?.id : previousDoc?.owner;
          const owner = typeof doc.owner === "object" ? doc.owner?.id : doc.owner;
          if (prevOwner && prevOwner !== owner) {
            const user = await req.payload
              .findByID({ collection: "users", id: String(owner), depth: 0 })
              .catch(() => null);
            const name = typeof user?.name === "string" ? user.name : String(owner);
            await logActivity(req, { case: doc.id, text: `Reassigned to ${name}. ${doc.handoverNote ?? ""}`.trim() });
          }
        }
        return doc;
      },
    ],
  },
  endpoints: [
    {
      // GET /api/cases/:id/summary — one-line status for chat replies and notifications.
      path: "/:id/summary",
      method: "get",
      handler: async (req) => {
        const doc = await req.payload.findByID({ collection: "cases", id: String(req.routeParams?.id), depth: 1 });
        const customer = typeof doc.customer === "object" && doc.customer ? doc.customer.name : doc.customer;
        return Response.json({
          id: doc.id,
          summary: `${doc.caseId} · ${customer} · ${doc.vessel}: ${doc.stage}. Next: ${doc.nextAction}.`,
        });
      },
    },
  ],
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Case",
          fields: [
            {
              type: "row",
              fields: [
                { name: "caseId", type: "text", label: "Case", unique: true, admin: { readOnly: true } },
                { name: "customer", type: "relationship", relationTo: "customers", required: true },
                { name: "customerRef", type: "text", label: "Customer reference" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "vessel", type: "text", required: true },
                { name: "vesselRecord", type: "relationship", relationTo: "vessels", label: "Vessel record (IMO)" },
                { name: "port", type: "select", options: PORTS },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "eta", type: "date", label: "ETA", admin: { date: { pickerAppearance: "dayAndTime" } } },
                { name: "deadline", type: "date", required: true, label: "Quote deadline" },
                { name: "currency", type: "select", options: CURRENCIES, defaultValue: "USD", label: "Quote currency" },
              ],
            },
            { name: "agent", type: "text", label: "Port agent / delivery contact" },
            { name: "nextAction", type: "text", required: true },
            { name: "blocker", type: "text" },
            {
              name: "handoverNote",
              type: "textarea",
              admin: { description: "Logged on the timeline when the owner changes." },
            },
          ],
        },
        {
          label: "Requested lines",
          fields: [
            {
              name: "items",
              type: "array",
              labels: { singular: "Line", plural: "Lines" },
              admin: {
                description:
                  "The customer's lines, as extracted and validated. Offers and the quotation refer to them by line number.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "lineNo", type: "number", required: true, min: 1, label: "#" },
                    { name: "description", type: "text", required: true },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "product", type: "relationship", relationTo: "products" },
                    { name: "brand", type: "text" },
                    { name: "exactBrand", type: "checkbox", label: "Exact brand / part only", defaultValue: false },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "model", type: "text" },
                    { name: "partNo", type: "text", label: "Part no." },
                    { name: "impa", type: "text", label: "IMPA" },
                    { name: "issa", type: "text", label: "ISSA" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "qty", type: "number", required: true, min: 0 },
                    { name: "unit", type: "select", options: UNITS, required: true },
                    { name: "packSize", type: "number", min: 0, label: "Base units per unit", defaultValue: 1 },
                    { name: "store", type: "select", options: STORES },
                  ],
                },
                { name: "certificates", type: "text", label: "Certificates / requirements" },
                {
                  type: "row",
                  fields: [
                    { name: "status", type: "select", options: LINE_STATUSES, defaultValue: "Not sourced" },
                    {
                      name: "confidence",
                      type: "number",
                      min: 0,
                      max: 1,
                      label: "AI extraction confidence",
                      admin: { readOnly: true },
                    },
                  ],
                },
                { name: "missing", type: "text", label: "Missing / unclear" },
                {
                  name: "originalText",
                  type: "textarea",
                  admin: { readOnly: true, description: "Exactly as written by the customer." },
                },
                {
                  name: "selection",
                  type: "group",
                  label: "Selected offer",
                  fields: [
                    {
                      name: "offers",
                      type: "relationship",
                      relationTo: "offers",
                      hasMany: true,
                      admin: { description: "More than one = split sourcing." },
                    },
                    {
                      name: "splitQty",
                      type: "array",
                      labels: { singular: "Split", plural: "Split quantities" },
                      fields: [
                        {
                          type: "row",
                          fields: [
                            { name: "offer", type: "relationship", relationTo: "offers", required: true },
                            { name: "qty", type: "number", min: 0, required: true },
                          ],
                        },
                      ],
                    },
                    {
                      name: "reason",
                      type: "textarea",
                      admin: { description: "Required when the choice isn't the best-fit offer." },
                    },
                    {
                      name: "marginPct",
                      type: "number",
                      min: -50,
                      max: 90,
                      label: "Margin %",
                      access: { read: costVisible },
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "customerAccepted",
                          type: "checkbox",
                          label: "Customer accepted alternative in writing",
                          defaultValue: false,
                        },
                        { name: "acceptanceEvidence", type: "upload", relationTo: "media" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "clarifications",
              type: "array",
              labels: { singular: "Clarification", plural: "Clarifications" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "lineNo", type: "number", min: 1, label: "Line #" },
                    {
                      name: "to",
                      type: "select",
                      options: ["Customer", "Supplier", "Internal"],
                      defaultValue: "Customer",
                    },
                    { name: "via", type: "select", options: ["Email", "Phone", "WhatsApp", "Supplier question"] },
                  ],
                },
                { name: "question", type: "textarea", required: true },
                {
                  type: "row",
                  fields: [
                    { name: "askedAt", type: "date" },
                    { name: "askedBy", type: "relationship", relationTo: "users" },
                  ],
                },
                { name: "answer", type: "textarea" },
                { name: "answeredAt", type: "date" },
              ],
            },
          ],
        },
        {
          label: "Line status",
          fields: [
            {
              name: "lines",
              type: "group",
              label: "Line status (summary)",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "ready", type: "number", defaultValue: 0, min: 0 },
                    { name: "waiting", type: "number", defaultValue: 0, min: 0 },
                    { name: "blocked", type: "number", defaultValue: 0, min: 0 },
                    { name: "noOffer", type: "number", label: "No offer", defaultValue: 0, min: 0 },
                  ],
                },
              ],
            },
            {
              name: "quoteLines",
              type: "array",
              labels: { singular: "Quote line", plural: "Quote lines" },
              fields: [
                { name: "description", type: "text", required: true },
                {
                  type: "row",
                  fields: [
                    { name: "qty", type: "number", min: 0 },
                    { name: "unit", type: "select", options: ["pcs", "kg", "ltr", "set", "roll"] },
                    { name: "unitPrice", type: "number", label: "Unit price (USD)", min: 0 },
                  ],
                },
                { name: "supplier", type: "relationship", relationTo: "suppliers" },
              ],
            },
          ],
        },
        {
          label: "Pricing",
          fields: [
            {
              name: "pricing",
              type: "group",
              access: { read: costVisible },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "allocation",
                      type: "select",
                      label: "Shared charges allocated",
                      defaultValue: "value",
                      options: [
                        { label: "By line value", value: "value" },
                        { label: "By quantity", value: "qty" },
                        { label: "Equal per line", value: "lines" },
                      ],
                    },
                    {
                      name: "discountPct",
                      type: "number",
                      label: "Customer discount %",
                      min: 0,
                      max: 50,
                      defaultValue: 0,
                    },
                    {
                      name: "fxRateUSD",
                      type: "number",
                      label: "FX snapshot USD/EGP",
                      min: 0,
                      admin: { readOnly: true },
                    },
                  ],
                },
                {
                  name: "charges",
                  type: "array",
                  labels: { singular: "Shared charge", plural: "Shared charges" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "label", type: "text", required: true },
                        { name: "amountEGP", type: "number", min: 0, label: "Amount (EGP)" },
                        {
                          name: "status",
                          type: "select",
                          options: ["Estimate", "Confirmed", "Not applicable"],
                          defaultValue: "Estimate",
                        },
                        { name: "actualEGP", type: "number", min: 0, label: "Actual (EGP)" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Service",
          fields: [
            {
              name: "service",
              type: "group",
              label: "Spare-parts clearance & forwarding",
              admin: { condition: (data) => data?.caseType === "service" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "awb", type: "text", label: "AWB / B/L" },
                    { name: "carrier", type: "text" },
                    { name: "arrival", type: "date" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "customsDeclaration", type: "text" },
                    {
                      name: "customsStatus",
                      type: "select",
                      options: ["Documents pending", "Submitted", "Released", "Held by customs"],
                    },
                    { name: "releasedAt", type: "date" },
                  ],
                },
                {
                  name: "consolidateWith",
                  type: "relationship",
                  relationTo: "cases",
                  label: "Deliver together with case",
                },
                {
                  name: "fees",
                  type: "array",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "label", type: "text", required: true },
                        { name: "amountUSD", type: "number", min: 0 },
                        { name: "atCost", type: "checkbox", label: "Re-billed at cost", defaultValue: false },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "held",
              type: "group",
              label: "Held stores",
              admin: { condition: (data) => data?.caseType === "held" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "location", type: "text" },
                    { name: "receivedAt", type: "date" },
                    { name: "freeDays", type: "number", min: 0, defaultValue: 14 },
                    { name: "dailyChargeUSD", type: "number", min: 0, defaultValue: 5 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    { name: "caseType", type: "select", options: CASE_TYPES, defaultValue: "rfq", admin: { position: "sidebar" } },
    {
      name: "stage",
      type: "select",
      required: true,
      defaultValue: "New",
      options: STAGES,
      custom: tones({
        New: "info",
        Validating: "info",
        Sourcing: "info",
        "Awaiting supplier": "warning",
        "Comparing offers": "info",
        "Awaiting corrected offer": "warning",
        "Awaiting management approval": "warning",
        "Quotation submitted": "info",
        "Awaiting customer decision": "warning",
        "Revision requested": "warning",
        "Won — PO mismatch": "error",
        "Won — sales order confirmed": "success",
        Purchasing: "info",
        "Delivering (drop 1 of 2)": "info",
        Delivered: "success",
        "Invoiced — partially paid": "warning",
        "Customs clearance": "info",
        "Held for vessel": "warning",
        "Closed — settled": "success",
        "On hold": "error",
        Lost: "neutral",
        Expired: "neutral",
      }),
      admin: { position: "sidebar" },
    },
    {
      name: "decision",
      type: "select",
      label: "Customer decision",
      options: [...QUOTE_DECISIONS, "Partially won"],
      admin: { position: "sidebar" },
    },
    {
      name: "wait",
      type: "select",
      label: "Waiting for",
      options: WAITS,
      custom: tones({
        "Awaiting supplier": "warning",
        "Awaiting corrected offer": "warning",
        "Awaiting internal approval": "warning",
        "Awaiting customer decision": "info",
        "Awaiting delivery or payment": "info",
      }),
      admin: { position: "sidebar" },
    },
    {
      name: "tone",
      type: "select",
      label: "Risk",
      defaultValue: "info",
      options: [
        { label: "Blocked", value: "danger" },
        { label: "At risk", value: "warn" },
        { label: "On track", value: "info" },
        { label: "Done", value: "ok" },
        { label: "Paused", value: "neutral" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "owner", type: "relationship", relationTo: "users", required: true, admin: { position: "sidebar" } },
    { name: "backup", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "value", type: "number", label: "Value (USD)", min: 0, admin: { position: "sidebar" } },
    { name: "urgent", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "lostReason", type: "text", admin: { position: "sidebar", condition: (data) => data?.stage === "Lost" } },
    {
      name: "sourceMessage",
      type: "relationship",
      relationTo: "intake-messages",
      admin: { position: "sidebar", readOnly: true },
    },
    { name: "closedAt", type: "date", admin: { position: "sidebar", readOnly: true } },
  ],
};
