import type { CollectionConfig } from "payload";
import { deskAccess, management } from "./shared.ts";
import type { CollectionSettings } from "../../mock/types.ts";

export const GROWTH_STAGES = [
  "Prospect",
  "Introduced",
  "Registration submitted",
  "Approved vendor",
  "First RFQ",
  "Active account",
  "Closed",
];

export const SALES_CHANNELS = ["Call", "Email", "WhatsApp", "Site visit", "Meeting"];
export const SALES_RESULTS = ["Reached — positive", "Reached — call back", "No answer", "Not interested", "Sent"];

/** Growth pipeline — kept apart from operational RFQs; linked to the customer once business is won. */
export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  custom: { list: { board: "stage" } } satisfies CollectionSettings,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "stage", "owner", "nextStepDue", "estimatedValue"],
    group: "Growth",
  },
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Flag opportunities with no next step (the demo's "plan one or close it").
      ({ data }) => {
        data.noNextStep = !data.nextStep && data.stage !== "Closed" && data.stage !== "Active account";
        return data;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "kind", type: "text", admin: { placeholder: "Ship manager · 14 reefers" } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "segment",
          type: "select",
          options: ["Marine", "Offshore", "Oil & gas", "Industrial", "Shipbuilding & repair"],
        },
        { name: "source", type: "text", admin: { placeholder: "Referral, trade fair, website…" } },
        { name: "estimatedValue", type: "text", admin: { placeholder: "USD 60k / yr" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "nextStep", type: "text" },
        { name: "nextStepDue", type: "date" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "contact", type: "text", label: "Who", admin: { placeholder: "Procurement lead" } },
        { name: "channel", type: "select", options: SALES_CHANNELS },
      ],
    },
    {
      name: "script",
      type: "textarea",
      label: "What to say",
      admin: { description: "Talking points for the next step." },
    },
    { name: "fleetSize", type: "number", min: 0 },
    {
      name: "fleet",
      type: "array",
      labels: { singular: "Vessel", plural: "Fleet (known vessels)" },
      admin: { description: "The prospect's vessels, before they become customer vessel records." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "imo",
              type: "text",
              label: "IMO",
              validate: (value: unknown) =>
                value == null ||
                value === "" ||
                (typeof value === "string" && /^\d{7}$/.test(value)) ||
                "IMO numbers have 7 digits.",
            },
            { name: "vesselType", type: "text", label: "Type" },
          ],
        },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      admin: { description: "Recorded after each call, visit or email (newest last)." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "at", type: "date" },
            { name: "result", type: "select", options: SALES_RESULTS },
            { name: "by", type: "relationship", relationTo: "users" },
          ],
        },
        { name: "note", type: "textarea" },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      admin: { description: "Set when the prospect becomes a customer." },
    },
    { name: "notes", type: "textarea" },
    {
      name: "stage",
      type: "select",
      required: true,
      defaultValue: "Prospect",
      options: GROWTH_STAGES,
      admin: { position: "sidebar" },
    },
    { name: "owner", type: "relationship", relationTo: "users", required: true, admin: { position: "sidebar" } },
    { name: "noNextStep", type: "checkbox", admin: { position: "sidebar", readOnly: true } },
  ],
};

/** Applications to become an approved supplier of a ship manager / owner. */
export const VendorRegistrations: CollectionConfig = {
  slug: "vendor-registrations",
  labels: { singular: "Vendor registration", plural: "Vendor registrations" },
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "portal", "status", "submittedAt", "renewBy"],
    group: "Growth",
  },
  access: deskAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "company", type: "text", required: true },
        { name: "customer", type: "relationship", relationTo: "customers" },
        { name: "opportunity", type: "relationship", relationTo: "opportunities" },
      ],
    },
    { name: "portal", type: "text", label: "Portal / method" },
    {
      type: "row",
      fields: [
        { name: "submittedAt", type: "date" },
        { name: "committeeDate", type: "date", label: "Committee decides" },
        { name: "renewBy", type: "date" },
      ],
    },
    { name: "contact", type: "text", label: "Their contact" },
    {
      name: "documents",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "status",
              type: "select",
              options: ["Missing", "Ready", "Submitted", "Expired"],
              defaultValue: "Missing",
            },
            { name: "file", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },
    { name: "nextStep", type: "text" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Documents requested",
      options: ["Documents requested", "Submitted", "Under review", "Approved", "Rejected", "Renewal overdue"],
      admin: { position: "sidebar" },
    },
  ],
};

/** Email campaigns: approved lists and content; only management sends. */
export const Campaigns: CollectionConfig = {
  slug: "campaigns",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "audience", "contentStatus", "status", "scheduledAt"],
    group: "Growth",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: management,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const sending = ["Scheduled", "Sent"].includes(String(data.status)) && data.status !== originalDoc?.status;
        if (sending && req.user?.role !== "management" && !req.context?.seed)
          throw Object.assign(new Error("Only management can schedule or send campaigns."), {
            status: 403,
            name: "Forbidden",
          });
        if (sending && data.contentStatus !== "Approved")
          throw Object.assign(new Error("Content must be approved before sending."), { status: 400, name: "APIError" });
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "audience", type: "text", required: true, admin: { placeholder: "Ship managers — consented" } },
        { name: "recipients", type: "number", min: 0 },
        { name: "consentOnly", type: "checkbox", defaultValue: true, label: "Consented contacts only" },
      ],
    },
    { name: "subject", type: "text" },
    { name: "body", type: "textarea" },
    {
      type: "row",
      fields: [
        {
          name: "contentStatus",
          type: "select",
          defaultValue: "Draft",
          options: ["Draft", "Awaiting approval", "Approved"],
        },
        { name: "scheduledAt", type: "date" },
      ],
    },
    {
      name: "stats",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "sent", type: "number", min: 0 },
            { name: "opened", type: "number", min: 0 },
            { name: "replied", type: "number", min: 0 },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Draft",
      options: ["Draft", "Scheduled", "Sent", "Cancelled"],
      admin: { position: "sidebar" },
    },
  ],
};
