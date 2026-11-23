import type { CollectionConfig, PayloadRequest } from "payload";
import { formats, tones } from "saastemlycrm-design-system/contracts";
import {
  CONTACT_RULES,
  CURRENCIES,
  PORTS,
  STORES,
  computed,
  deskAccess,
  idOf,
  isManagement,
  logActivity,
} from "./shared.ts";

/** A supplier RFQ that is out and not fully answered yet. */
export const OPEN_RFQ_STATUSES = ["Sent", "Awaiting reply", "Partial reply", "No response"];

/** The supplier RFQs still open, read once per request (every supplier read counts its own). */
async function openRfqs(req: PayloadRequest): Promise<Record<string, unknown>[]> {
  const ctx = (req.context ??= {}) as { openRfqs?: Promise<Record<string, unknown>[]> };
  ctx.openRfqs ??= req.payload
    .find({
      collection: "supplier-rfqs",
      where: { status: { in: OPEN_RFQ_STATUSES } },
      limit: 0,
      depth: 0,
      pagination: false,
    } as never)
    .then((r) => r.docs as unknown as Record<string, unknown>[])
    .catch(() => []);
  return ctx.openRfqs;
}

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
  admin: { description: "People at the company we write to, with the channel they answer on." },
  fields: [
    {
      type: "row" as const,
      fields: [
        {
          name: "name",
          type: "text" as const,
          required: true,
          admin: { description: "Full name of the person.", placeholder: "e.g. Anders Nordvik" },
        },
        {
          name: "role",
          type: "text" as const,
          admin: {
            description: "Their job title, so we know who decides what.",
            placeholder: "e.g. Purchasing manager",
          },
        },
      ],
    },
    {
      type: "row" as const,
      fields: [
        {
          name: "email",
          type: "email" as const,
          admin: { description: "Where RFQs and quotations are sent.", placeholder: "e.g. purchasing@nordvik.example" },
        },
        {
          name: "phone",
          type: "text" as const,
          admin: { description: "Direct line or mobile, with country code.", placeholder: "e.g. +47 22 33 44 55" },
        },
        {
          name: "preferredChannel",
          type: "select" as const,
          options: ["Email", "Phone", "WhatsApp"],
          defaultValue: "Email",
          admin: { description: "How this person prefers to be reached first.", placeholder: "Pick a channel" },
        },
      ],
    },
  ],
};

/** What each contact rule means for follow-ups and reminders. */
const CONTACT_NOTE: Record<string, string> = {
  allowed: "Follow-ups allowed, drafted for a person to send.",
  "one-follow-up": "One customer follow-up per quotation; after that, internal reminders only.",
  "do-not-chase":
    "Follow-ups for this customer are internal reminders only — the system refuses customer-facing chasers.",
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
            {
              name: "name",
              type: "text",
              required: true,
              unique: true,
              admin: {
                description: "The company's registered trading name.",
                placeholder: "e.g. Nordvik Ship Management",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "type",
                  type: "select",
                  options: ["Ship manager", "Shipowner", "Offshore / oil & gas", "Industrial", "Shipyard / repair"],
                  admin: { description: "What kind of business they run.", placeholder: "Pick a type" },
                },
                {
                  name: "segment",
                  type: "select",
                  options: ["Marine", "Offshore", "Onshore", "Oil & gas", "Shipbuilding & repair", "Industrial"],
                  admin: {
                    description: "The market they belong to, used for sales reporting.",
                    placeholder: "Pick a segment",
                  },
                },
                {
                  name: "country",
                  type: "text",
                  admin: { description: "Where the company is based.", placeholder: "e.g. Norway" },
                },
              ],
            },
            {
              name: "contactEmail",
              type: "email",
              admin: {
                description: "The shared mailbox for quotations and invoices.",
                placeholder: "e.g. purchasing@nordvik.example",
              },
            },
            {
              name: "leadSource",
              type: "text",
              admin: { description: "How we first met them.", placeholder: "e.g. Port agent introduction" },
            },
            {
              name: "portPreferences",
              type: "select",
              hasMany: true,
              options: PORTS,
              admin: {
                description: "Ports where their vessels usually call for stores.",
                placeholder: "e.g. Port Said",
              },
            },
            contactsField,
          ],
        },
        {
          label: "Commercial",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "billingEntity",
                  type: "text",
                  admin: {
                    description: "The legal entity invoices are issued to.",
                    placeholder: "e.g. Nordvik Ship Management AS",
                  },
                },
                {
                  name: "taxId",
                  type: "text",
                  label: "Tax / VAT ID",
                  admin: {
                    description: "Their tax number, printed on every invoice.",
                    placeholder: "e.g. NO 912 345 678 MVA",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "paymentTermsDays",
                  type: "number",
                  label: "Payment terms (days)",
                  min: 0,
                  admin: { description: "Days after invoice date they agreed to pay.", placeholder: "e.g. 30" },
                },
                {
                  name: "currency",
                  type: "select",
                  options: CURRENCIES,
                  defaultValue: "USD",
                  admin: { description: "The currency we quote and invoice them in.", placeholder: "USD" },
                },
                {
                  name: "creditLimit",
                  type: "number",
                  label: "Credit limit (USD)",
                  min: 0,
                  admin: { description: "The most we allow them to owe at once.", placeholder: "e.g. 50,000" },
                },
              ],
            },
            {
              name: "registration",
              type: "group",
              label: "Vendor registration (Golden Sea as their approved supplier)",
              admin: { description: "Where we stand as an approved supplier on their vendor list." },
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
                      admin: {
                        description: "How far their vendor approval of us has got.",
                        placeholder: "Pick a status",
                      },
                    },
                    {
                      name: "portal",
                      type: "text",
                      label: "Portal / method",
                      admin: {
                        description: "Where we keep our listing with them.",
                        placeholder: "e.g. Nordvik supplier portal",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "since",
                      type: "date",
                      admin: { description: "The day they approved us as a vendor." },
                    },
                    {
                      name: "renewBy",
                      type: "date",
                      admin: { description: "The date the approval lapses unless we renew." },
                    },
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
      label: "Contact rule",
      options: CONTACT_RULES,
      custom: {
        ...tones({ allowed: "success", "one-follow-up": "warning", "do-not-chase": "error" }),
        about: "Applied to every follow-up and reminder automation, so no chaser goes out against this rule.",
      },
      defaultValue: "allowed",
      admin: {
        position: "sidebar",
        description: "Sets how often we may chase this customer.",
        placeholder: "Pick a rule",
      },
    },
    // What the rule means for anyone about to contact them (never stored).
    computed(
      {
        name: "contactNote",
        type: "text",
        label: "What it means",
        admin: { position: "sidebar", description: "The contact rule in plain words, for whoever is about to write." },
      },
      (c) => CONTACT_NOTE[typeof c.contactRule === "string" ? c.contactRule : "allowed"] ?? CONTACT_NOTE.allowed,
    ),
    {
      name: "doNotChase",
      type: "checkbox",
      label: "Do not chase",
      defaultValue: false,
      admin: { position: "sidebar", description: "Tick to stop all customer status requests." },
      custom: { about: "Never send status requests to this customer; internal reminders only." },
    },
    {
      name: "accountOwner",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: "The Golden Sea person who looks after them.",
        placeholder: "Search users",
      },
    },
    {
      name: "fleetSize",
      type: "number",
      label: "Vessels in fleet (total)",
      min: 0,
      admin: {
        position: "sidebar",
        description: "All vessels they own or manage, not only ours.",
        placeholder: "e.g. 14",
      },
    },
    {
      name: "vessels",
      type: "join",
      collection: "vessels",
      on: "customer",
      admin: { defaultColumns: ["name", "imo", "vesselType"], description: "The vessels we know for this customer." },
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
        {
          name: "name",
          type: "text",
          required: true,
          admin: { description: "The vessel's name as on her papers.", placeholder: "e.g. MV Nordic Star" },
        },
        {
          name: "imo",
          type: "text",
          label: "IMO",
          unique: true,
          admin: { description: "The 7-digit IMO number; it identifies the ship.", placeholder: "e.g. 9811204" },
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
          admin: { description: "Decides which stores she is likely to need.", placeholder: "Pick a vessel type" },
        },
        {
          name: "flag",
          type: "text",
          admin: { description: "The country she is registered in.", placeholder: "e.g. Panama" },
        },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      label: "Manager / owner",
      admin: { description: "The customer who orders stores for her.", placeholder: "Search customers" },
    },
    {
      name: "manager",
      type: "text",
      label: "Managing office",
      admin: {
        description: "The office or desk that handles her purchasing.",
        placeholder: "e.g. Nordvik Oslo fleet desk",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Anything useful at delivery, like berth or agent.",
        placeholder: "e.g. Usually calls at Port Said, agent is Suez Marine.",
      },
    },
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
                {
                  name: "name",
                  type: "text",
                  required: true,
                  unique: true,
                  admin: { description: "The supplier's trading name.", placeholder: "e.g. Delta Marine Chandlers" },
                },
                {
                  name: "city",
                  type: "text",
                  admin: { description: "Where their warehouse or office is.", placeholder: "e.g. Alexandria" },
                },
                {
                  name: "country",
                  type: "text",
                  defaultValue: "Egypt",
                  admin: { description: "The country they ship from.", placeholder: "e.g. Egypt" },
                },
              ],
            },
            {
              name: "categories",
              type: "select",
              hasMany: true,
              options: CATEGORIES,
              admin: {
                description: "What they sell, used to pick who gets an RFQ.",
                placeholder: "e.g. Engine spares",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "currency",
                  type: "select",
                  options: CURRENCIES,
                  defaultValue: "EGP",
                  admin: { description: "The currency they quote in.", placeholder: "EGP" },
                },
                {
                  name: "terms",
                  type: "text",
                  label: "Payment terms",
                  admin: { description: "When they expect to be paid.", placeholder: "e.g. 30 days from delivery" },
                },
              ],
            },
            {
              name: "contact",
              type: "text",
              label: "Main contact",
              admin: { description: "The person to call first.", placeholder: "e.g. Hossam Fathy" },
            },
            {
              name: "emailDomain",
              type: "text",
              admin: {
                description: "Lets us match incoming replies to this supplier.",
                placeholder: "e.g. deltamarine.example",
              },
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
                {
                  name: "replyHrs",
                  type: "number",
                  label: "Average reply (hours)",
                  min: 0,
                  admin: { description: "How long they take to answer an RFQ.", placeholder: "e.g. 18" },
                  // Amber past a day.
                  custom: {
                    number: { unit: "hours" as const },
                    toneWhen: [{ when: { replyHrs: { greater_than: 24 } }, tone: "warning" }],
                  },
                },
                {
                  name: "onTime",
                  type: "number",
                  label: "On-time delivery %",
                  min: 0,
                  max: 100,
                  admin: { description: "Share of orders delivered on the promised date.", placeholder: "e.g. 92" },
                  // A bar of 100%: amber under 85%, green from there.
                  custom: {
                    ...formats.percent(0),
                    gauge: { max: 100 },
                    toneWhen: [
                      { when: { onTime: { less_than: 85 } }, tone: "warning" },
                      { when: {}, tone: "success" },
                    ],
                  },
                },
                {
                  name: "compliance",
                  type: "number",
                  label: "Compliant offers %",
                  min: 0,
                  max: 100,
                  admin: { description: "Share of offers that matched the RFQ spec.", placeholder: "e.g. 88" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "rfqCount",
                  type: "number",
                  label: "RFQs received",
                  min: 0,
                  admin: { readOnly: true, description: "How many RFQs we have sent them." },
                },
                {
                  name: "poCount",
                  type: "number",
                  label: "POs placed",
                  min: 0,
                  admin: { readOnly: true, description: "How many purchase orders we gave them." },
                },
                // The RFQs sent to it that it hasn't fully answered (never stored).
                computed(
                  {
                    name: "openRfqs",
                    type: "number",
                    label: "Open RFQs",
                    admin: { description: "RFQs sent to them and not fully answered yet." },
                  },
                  async (s, req) => (await openRfqs(req)).filter((r) => idOf(r.supplier) === s.id).length,
                ),
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
              admin: { description: "Where we pay them; a change needs verification first." },
              access: { read: ({ req }) => Boolean(req.user) },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "beneficiary",
                      type: "text",
                      admin: {
                        description: "The account holder's name, as the bank has it.",
                        placeholder: "e.g. Delta Marine Chandlers LLC",
                      },
                    },
                    {
                      name: "bankName",
                      type: "text",
                      admin: { description: "The bank that holds the account.", placeholder: "e.g. Banque Misr" },
                    },
                  ],
                },
                {
                  name: "iban",
                  type: "text",
                  label: "IBAN / account",
                  admin: {
                    description: "Changing it resets verification.",
                    placeholder: "e.g. EG380019000500000000263180002",
                  },
                  custom: {
                    about:
                      "A change is logged as an alert and needs verification and two-person approval before any payment.",
                  },
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "verified",
                      type: "checkbox",
                      defaultValue: false,
                      admin: { description: "Tick once the details were confirmed with the supplier." },
                    },
                    {
                      name: "verifiedBy",
                      type: "relationship",
                      relationTo: "users",
                      admin: { description: "Who confirmed the bank details.", placeholder: "Search users" },
                    },
                    {
                      name: "verifiedAt",
                      type: "date",
                      admin: { description: "The day the bank details were confirmed." },
                    },
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
      admin: {
        position: "sidebar",
        description: "Local supplier, agency pricelist or our own stock.",
        placeholder: "Pick a kind",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Approved",
      options: ["New", "Trial", "Approved", "On watch", "Blocked"],
      access: { update: isManagement },
      admin: {
        position: "sidebar",
        description: "Only management can approve or block a supplier.",
        placeholder: "Pick a status",
      },
    },
    {
      name: "source",
      type: "text",
      admin: { position: "sidebar", readOnly: true, description: "How the record was created, like an email reply." },
    },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
  admin: { useAsTitle: "filename", group: "Directory" },
  access: deskAccess,
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      admin: {
        description: "A short description of what the file shows.",
        placeholder: "e.g. Signed delivery note, MV Nordic Star",
      },
    },
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
      admin: { description: "What the file is, so it can be found later.", placeholder: "Pick a file kind" },
    },
  ],
};
