import type { CollectionConfig } from "payload";
import { CONTACT_RULES, CURRENCIES, PORTS, STORES, deskAccess, isManagement, logActivity } from "./shared.ts";

/** Sourcing categories (older records) + Golden Sea's stores. */
export const CATEGORIES = [
  "Chemicals",
  "Deck & engine stores",
  "Deck stores",
  "Engine spares",
  "Paints",
  "Safety & PPE",
  "Welding",
  "Adhesives",
  "Lubricants",
  ...STORES.filter((s) => s !== "Deck stores"),
];

const contactsField = {
  name: "contacts",
  type: "array" as const,
  labels: { singular: "Contact", plural: "Contacts" },
  fields: [
    {
      type: "row" as const,
      fields: [
        { name: "name", type: "text" as const, required: true },
        { name: "role", type: "text" as const },
      ],
    },
    {
      type: "row" as const,
      fields: [
        { name: "email", type: "email" as const },
        { name: "phone", type: "text" as const },
        {
          name: "preferredChannel",
          type: "select" as const,
          options: ["Email", "Phone", "WhatsApp"],
          defaultValue: "Email",
        },
      ],
    },
  ],
};

/** Shipowners, ship managers, offshore & industrial customers. */
export const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "country", "contactRule", "doNotChase"],
    group: "Directory",
  },
  access: deskAccess,
  hooks: {
    // Keep the legacy `doNotChase` flag and the contact rule in sync.
    beforeChange: [
      ({ data }) => {
        if (data.contactRule) data.doNotChase = data.contactRule === "do-not-chase";
        else if (data.doNotChase) data.contactRule = "do-not-chase";
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Account",
          fields: [
            { name: "name", type: "text", required: true, unique: true },
            {
              type: "row",
              fields: [
                {
                  name: "type",
                  type: "select",
                  options: ["Ship manager", "Shipowner", "Offshore / oil & gas", "Industrial", "Shipyard / repair"],
                },
                {
                  name: "segment",
                  type: "select",
                  options: ["Marine", "Offshore", "Onshore", "Oil & gas", "Shipbuilding & repair", "Industrial"],
                },
                { name: "country", type: "text" },
              ],
            },
            { name: "contactEmail", type: "email" },
            {
              name: "leadSource",
              type: "text",
              admin: { description: "Referral, port agent introduction, trade fair, website…" },
            },
            { name: "portPreferences", type: "select", hasMany: true, options: PORTS },
            contactsField,
          ],
        },
        {
          label: "Commercial",
          fields: [
            {
              type: "row",
              fields: [
                { name: "billingEntity", type: "text" },
                { name: "taxId", type: "text", label: "Tax / VAT ID" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "paymentTermsDays", type: "number", label: "Payment terms (days)", min: 0 },
                { name: "currency", type: "select", options: CURRENCIES, defaultValue: "USD" },
                { name: "creditLimit", type: "number", label: "Credit limit (USD)", min: 0 },
              ],
            },
            {
              name: "registration",
              type: "group",
              label: "Vendor registration (Golden Sea as their approved supplier)",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "status",
                      type: "select",
                      options: [
                        "Not registered",
                        "Documents requested",
                        "Under review",
                        "Approved vendor",
                        "Renewal overdue",
                      ],
                    },
                    { name: "portal", type: "text", label: "Portal / method" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "since", type: "date" },
                    { name: "renewBy", type: "date" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "contactRule",
      type: "select",
      options: CONTACT_RULES,
      defaultValue: "allowed",
      admin: { position: "sidebar", description: "Applied to every follow-up and reminder automation." },
    },
    {
      name: "doNotChase",
      type: "checkbox",
      label: "Do not chase",
      defaultValue: false,
      admin: { position: "sidebar", description: "Never send status requests; internal reminders only." },
    },
    { name: "accountOwner", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    {
      name: "vessels",
      type: "join",
      collection: "vessels",
      on: "customer",
      admin: { defaultColumns: ["name", "imo", "vesselType"] },
    },
  ],
};

/** The fleet: every case points at a vessel (or rig / platform) and its IMO number. */
export const Vessels: CollectionConfig = {
  slug: "vessels",
  admin: { useAsTitle: "name", defaultColumns: ["name", "imo", "vesselType", "customer"], group: "Directory" },
  access: deskAccess,
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "imo",
          type: "text",
          label: "IMO",
          unique: true,
          validate: (value: unknown) =>
            value == null ||
            value === "" ||
            (typeof value === "string" && /^\d{7}$/.test(value)) ||
            "IMO numbers have 7 digits.",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "vesselType",
          type: "select",
          options: [
            "Bulk carrier",
            "Tanker",
            "Container",
            "General cargo",
            "Reefer",
            "Offshore supply",
            "Platform / rig",
            "Ferry",
          ],
        },
        { name: "flag", type: "text" },
      ],
    },
    { name: "customer", type: "relationship", relationTo: "customers", required: true, label: "Manager / owner" },
    { name: "manager", type: "text", label: "Managing office" },
    { name: "notes", type: "textarea" },
  ],
};

/** Local suppliers, agency principals (pricelists) and Golden Sea's own stock. */
export const Suppliers: CollectionConfig = {
  slug: "suppliers",
  admin: { useAsTitle: "name", defaultColumns: ["name", "kind", "city", "status", "onTime"], group: "Directory" },
  access: deskAccess,
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const before = previousDoc?.bank?.iban;
        if (operation === "update" && doc.bank?.iban && before && doc.bank.iban !== before) {
          await logActivity(req, {
            kind: "alert",
            entity: `suppliers/${doc.id}`,
            text: `Bank details changed for ${doc.name} — verification and two-person approval required before any payment.`,
          });
        }
        return doc;
      },
    ],
    beforeChange: [
      // A bank-detail change resets verification.
      ({ data, originalDoc }) => {
        if (originalDoc?.bank?.iban && data.bank?.iban && data.bank.iban !== originalDoc.bank.iban) {
          data.bank = { ...data.bank, verified: false, verifiedBy: null, verifiedAt: null };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Supplier",
          fields: [
            {
              type: "row",
              fields: [
                { name: "name", type: "text", required: true, unique: true },
                { name: "city", type: "text" },
                { name: "country", type: "text", defaultValue: "Egypt" },
              ],
            },
            { name: "categories", type: "select", hasMany: true, options: CATEGORIES },
            {
              type: "row",
              fields: [
                { name: "currency", type: "select", options: CURRENCIES, defaultValue: "EGP" },
                { name: "terms", type: "text", label: "Payment terms" },
              ],
            },
            { name: "contact", type: "text", label: "Main contact" },
            {
              name: "emailDomain",
              type: "text",
              admin: { description: "Used to recognise replies from this supplier." },
            },
            contactsField,
          ],
        },
        {
          label: "Performance",
          fields: [
            {
              type: "row",
              fields: [
                { name: "replyHrs", type: "number", label: "Average reply (hours)", min: 0 },
                { name: "onTime", type: "number", label: "On-time delivery %", min: 0, max: 100 },
                { name: "compliance", type: "number", label: "Compliant offers %", min: 0, max: 100 },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "rfqCount", type: "number", label: "RFQs received", min: 0, admin: { readOnly: true } },
                { name: "poCount", type: "number", label: "POs placed", min: 0, admin: { readOnly: true } },
              ],
            },
          ],
        },
        {
          label: "Bank",
          fields: [
            {
              name: "bank",
              type: "group",
              access: { read: ({ req }) => Boolean(req.user) },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "beneficiary", type: "text" },
                    { name: "bankName", type: "text" },
                  ],
                },
                { name: "iban", type: "text", label: "IBAN / account" },
                {
                  type: "row",
                  fields: [
                    { name: "verified", type: "checkbox", defaultValue: false },
                    { name: "verifiedBy", type: "relationship", relationTo: "users" },
                    { name: "verifiedAt", type: "date" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "kind",
      type: "select",
      defaultValue: "local",
      options: [
        { label: "Local / regional supplier", value: "local" },
        { label: "Agency principal (pricelist)", value: "agency" },
        { label: "Own stock", value: "own-stock" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Approved",
      options: ["New", "Trial", "Approved", "On watch", "Blocked"],
      access: { update: isManagement },
      admin: { position: "sidebar", description: "Approved-vendor status is set by management." },
    },
    {
      name: "source",
      type: "text",
      admin: { position: "sidebar", readOnly: true, description: "e.g. auto-created from an email reply" },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  admin: { useAsTitle: "filename", group: "Directory" },
  access: deskAccess,
  fields: [
    { name: "alt", type: "text", label: "Alt text" },
    {
      name: "kind",
      type: "select",
      options: [
        "RFQ attachment",
        "Supplier offer",
        "Certificate",
        "SDS / TDS",
        "Delivery note / POD",
        "Customer PO",
        "Portal receipt",
        "Other",
      ],
    },
  ],
};
