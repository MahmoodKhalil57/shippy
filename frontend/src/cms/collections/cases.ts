import type { CollectionConfig } from "payload";

export const STAGES = [
  "New",
  "Sourcing",
  "Awaiting supplier",
  "Comparing offers",
  "Awaiting corrected offer",
  "Awaiting management approval",
  "Awaiting customer decision",
  "Revision requested",
  "Won — PO mismatch",
  "Delivering (drop 1 of 2)",
  "Invoiced — partially paid",
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

/** A client RFQ, from sourcing to settlement. */
export const Cases: CollectionConfig = {
  slug: "cases",
  labels: { singular: "Case", plural: "Cases" },
  admin: {
    useAsTitle: "caseId",
    defaultColumns: ["caseId", "customer", "stage", "deadline", "owner", "value"],
    group: "Sourcing desk",
    description: "Client RFQs and everything that follows: supplier RFQs, quotes, POs, delivery and payment.",
  },
  defaultSort: "deadline",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "management",
  },
  hooks: {
    // Number new cases GS-RFQ-0143, GS-RFQ-0144, …
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data || data.caseId) return data;
        const { docs } = await req.payload.find({ collection: "cases", limit: 0, depth: 0 });
        const last = Math.max(0, ...docs.map((d) => Number(String(d.caseId).replace(/\D/g, "")) || 0));
        return { ...data, caseId: `GS-RFQ-${String(last + 1).padStart(4, "0")}` };
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
              ],
            },
            {
              type: "row",
              fields: [
                { name: "vessel", type: "text", required: true },
                {
                  name: "port",
                  type: "select",
                  options: ["Port Said", "Suez", "Damietta", "Alexandria", "Abu Qir"],
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "eta", type: "date", label: "ETA", admin: { date: { pickerAppearance: "dayOnly" } } },
                { name: "deadline", type: "date", required: true },
              ],
            },
            { name: "nextAction", type: "text", required: true },
            { name: "blocker", type: "text" },
          ],
        },
        {
          label: "Lines",
          fields: [
            {
              name: "lines",
              type: "group",
              label: "Line status",
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
      ],
    },
    {
      name: "stage",
      type: "select",
      required: true,
      defaultValue: "New",
      options: STAGES,
      admin: { position: "sidebar" },
    },
    { name: "wait", type: "select", label: "Waiting for", options: WAITS, admin: { position: "sidebar" } },
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
    { name: "value", type: "number", label: "Value (USD)", min: 0, admin: { position: "sidebar" } },
    { name: "urgent", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
  ],
};
