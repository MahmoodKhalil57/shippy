import type { GlobalConfig } from "payload";
import { CURRENCIES, ROLES, STORES, anyone, loggedIn, management } from "../collections/shared.ts";

const managementOnly: GlobalConfig["access"] = { read: anyone, update: management };
const staffRead: GlobalConfig["access"] = { read: loggedIn, update: management };

/** Company basics, numbering, tax and document defaults. */
export const Settings: GlobalConfig = {
  slug: "settings",
  admin: { group: "Configuration" },
  access: managementOnly,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Company",
          fields: [
            { name: "companyName", type: "text", defaultValue: "Golden Sea" },
            { name: "workingHours", type: "text", defaultValue: "Sun–Thu 08:00–17:00" },
            {
              type: "row",
              fields: [
                { name: "timezone", type: "text", defaultValue: "Africa/Cairo" },
                { name: "baseCurrency", type: "select", options: CURRENCIES, defaultValue: "EGP" },
                { name: "defaultQuoteCurrency", type: "select", options: CURRENCIES, defaultValue: "USD" },
              ],
            },
            {
              name: "service24x7",
              type: "checkbox",
              label: "24/7 service (after-hours routing on)",
              defaultValue: true,
            },
          ],
        },
        {
          label: "Commercial",
          fields: [
            {
              type: "row",
              fields: [
                { name: "marginFloor", type: "number", label: "Minimum margin %", defaultValue: 15, min: 0, max: 100 },
                { name: "vatRatePct", type: "number", label: "VAT %", defaultValue: 14, min: 0, max: 100 },
                { name: "quoteValidityDays", type: "number", defaultValue: 7, min: 1 },
              ],
            },
            { name: "defaultPaymentTerms", type: "text", defaultValue: "90 days from invoice date" },
            { name: "quoteRemarks", type: "textarea", label: "Standard quotation remarks" },
            { name: "quoteFooter", type: "text" },
          ],
        },
        {
          label: "Numbering",
          fields: [
            {
              type: "row",
              fields: [
                { name: "rfqPrefix", type: "text", defaultValue: "GS-RFQ-" },
                { name: "servicePrefix", type: "text", defaultValue: "GS-SVC-" },
                { name: "quotePrefix", type: "text", defaultValue: "GS-Q-" },
                { name: "supplierRfqPrefix", type: "text", defaultValue: "GS-SRFQ-" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Approved exchange rates. Quotations and comparisons only use approved rates. */
export const FxRates: GlobalConfig = {
  slug: "fx-rates",
  label: "Exchange rates",
  admin: { group: "Configuration" },
  access: staffRead,
  hooks: {
    beforeChange: [
      // Newest approved rate per currency becomes active; older approved ones are superseded.
      ({ data }) => {
        const rates = (data.rates as { currency?: string; status?: string; date?: string }[] | undefined) ?? [];
        for (const cur of CURRENCIES) {
          const approved = rates.filter(
            (r) => r.currency === cur && (r.status === "Active" || r.status === "Superseded"),
          );
          approved.sort((a, b) => String(b.date).localeCompare(String(a.date)));
          approved.forEach((r, i) => (r.status = i === 0 ? "Active" : "Superseded"));
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "rates",
      type: "array",
      labels: { singular: "Rate", plural: "Rates" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "currency", type: "select", options: CURRENCIES.filter((c) => c !== "EGP"), required: true },
            { name: "egpPerUnit", type: "number", min: 0, required: true, label: "EGP per unit" },
            { name: "date", type: "date", required: true },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "source", type: "text", defaultValue: "CBE mid-rate + 0.5% buffer" },
            { name: "proposedBy", type: "relationship", relationTo: "users" },
            { name: "approvedBy", type: "relationship", relationTo: "users" },
            {
              name: "status",
              type: "select",
              options: ["Awaiting approval", "Active", "Superseded", "Rejected"],
              defaultValue: "Awaiting approval",
            },
          ],
        },
      ],
    },
    {
      name: "recheckOpenQuotes",
      type: "checkbox",
      label: "Re-check open quotations when a rate changes",
      defaultValue: true,
    },
  ],
};

/** Management-approved pricing policy. Past assumptions never become a fixed default. */
export const PricingPolicy: GlobalConfig = {
  slug: "pricing-policy",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      type: "row",
      fields: [
        { name: "targetMarginPct", type: "number", defaultValue: 25, min: 0, max: 90 },
        { name: "minMarginPct", type: "number", defaultValue: 15, min: 0, max: 90 },
        { name: "maxDiscountWithoutApprovalPct", type: "number", defaultValue: 3, min: 0, max: 50 },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "allocationDefault",
          type: "select",
          defaultValue: "value",
          options: [
            { label: "By line value", value: "value" },
            { label: "By quantity", value: "qty" },
            { label: "Equal per line", value: "lines" },
          ],
        },
        { name: "roundingUSD", type: "number", defaultValue: 0.05, min: 0 },
      ],
    },
    {
      name: "byStore",
      type: "array",
      labels: { singular: "Store rule", plural: "Per-store margins" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "store", type: "select", options: STORES, required: true },
            { name: "targetPct", type: "number", min: 0, max: 90 },
            { name: "minPct", type: "number", min: 0, max: 90 },
            { name: "maxDiscountPct", type: "number", min: 0, max: 50 },
          ],
        },
      ],
    },
    {
      name: "flags",
      type: "select",
      hasMany: true,
      label: "Raise an approval exception for",
      defaultValue: ["negative-profit", "below-min", "expired-price", "missing-cost"],
      options: [
        { label: "Negative profit", value: "negative-profit" },
        { label: "Below minimum margin", value: "below-min" },
        { label: "Expired supplier price", value: "expired-price" },
        { label: "Missing cost estimate", value: "missing-cost" },
        { label: "Alternative without customer acceptance", value: "alternative" },
        { label: "Advance-payment exposure", value: "advance" },
      ],
    },
  ],
};

/** Who approves what. */
export const ApprovalRules: GlobalConfig = {
  slug: "approval-rules",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      name: "rules",
      type: "array",
      labels: { singular: "Rule", plural: "Rules" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "type", type: "text", required: true, admin: { placeholder: "Customer quotation" } },
            { name: "approvers", type: "relationship", relationTo: "users", hasMany: true },
            { name: "approverRoles", type: "select", hasMany: true, options: ROLES },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "twoPerson", type: "checkbox", defaultValue: false },
            { name: "thresholdEGP", type: "number", min: 0, label: "Only above (EGP)" },
            { name: "always", type: "checkbox", label: "Always required", defaultValue: true },
          ],
        },
        { name: "note", type: "text" },
      ],
    },
  ],
};

/** Every automation: trigger, owner, due, approval, retry, stop condition. */
export const AutomationRules: GlobalConfig = {
  slug: "automation-rules",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      name: "rules",
      type: "array",
      labels: { singular: "Rule", plural: "Rules" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", required: true },
            { name: "enabled", type: "checkbox", defaultValue: true },
            {
              name: "mode",
              type: "select",
              defaultValue: "auto",
              options: [
                { label: "Automatic", value: "auto" },
                { label: "Automatic (pre-approved)", value: "pre-approved" },
                { label: "Prepare for review", value: "prepare" },
              ],
            },
            { name: "usesAI", type: "checkbox", label: "AI-assisted", defaultValue: false },
          ],
        },
        { name: "trigger", type: "text", required: true },
        { name: "action", type: "textarea", required: true },
        {
          type: "row",
          fields: [
            { name: "owner", type: "text" },
            { name: "due", type: "text" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "approval", type: "text" },
            { name: "retry", type: "text" },
            { name: "stop", type: "text", label: "Stop condition" },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "confidenceThreshold",
              type: "number",
              min: 0,
              max: 1,
              admin: { description: "AI rules: below this, route to review." },
            },
            { name: "template", type: "text", label: "Message template key" },
          ],
        },
      ],
    },
  ],
};

/** Message templates (acknowledgement, supplier RFQ, reminders, corrections, follow-ups, collections, intros). */
export const MessageTemplates: GlobalConfig = {
  slug: "message-templates",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      name: "templates",
      type: "array",
      labels: { singular: "Template", plural: "Templates" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "key", type: "text", required: true, admin: { placeholder: "rfq-ack" } },
            { name: "name", type: "text", required: true },
            { name: "channel", type: "select", options: ["Email", "WhatsApp", "SMS"], defaultValue: "Email" },
          ],
        },
        { name: "subject", type: "text" },
        {
          name: "body",
          type: "textarea",
          admin: { description: "Placeholders: {{caseId}}, {{customer}}, {{vessel}}, {{lines}}, {{dueAt}}, {{user}}" },
        },
        {
          type: "row",
          fields: [
            { name: "status", type: "select", defaultValue: "Draft", options: ["Draft", "Approved", "Retired"] },
            { name: "version", type: "number", min: 1, defaultValue: 1 },
            { name: "approvedBy", type: "relationship", relationTo: "users" },
          ],
        },
        {
          name: "neverIncludeClientIdentity",
          type: "checkbox",
          defaultValue: false,
          label: "Supplier-facing (strip client identity)",
        },
      ],
    },
  ],
};

/** Connections and the email-history import job. */
export const Integrations: GlobalConfig = {
  slug: "integrations",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      name: "connections",
      type: "array",
      labels: { singular: "Connection", plural: "Connections" },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "kind",
              type: "select",
              required: true,
              options: [
                "Outlook mailbox",
                "Gmail mailbox",
                "Website form",
                "WhatsApp",
                "AI extraction",
                "E-invoicing (tax authority)",
                "Document storage",
              ],
            },
            { name: "account", type: "text", admin: { placeholder: "sales@" } },
            {
              name: "status",
              type: "select",
              options: ["Connected", "Token expired", "To connect", "Sandbox", "Disabled"],
              defaultValue: "To connect",
            },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "lastSyncAt", type: "date" },
            { name: "pollEveryMinutes", type: "number", min: 1 },
          ],
        },
        { name: "notes", type: "text" },
      ],
    },
    {
      name: "emailImport",
      type: "group",
      label: "Email history import",
      fields: [
        {
          type: "row",
          fields: [
            { name: "days", type: "number", min: 1, defaultValue: 90 },
            {
              name: "status",
              type: "select",
              options: ["Not started", "Dry run ready", "Approved", "Running", "Done"],
              defaultValue: "Not started",
            },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "scanned", type: "number", min: 0 },
            { name: "rfqThreads", type: "number", min: 0 },
            { name: "duplicates", type: "number", min: 0 },
            { name: "exceptions", type: "number", min: 0 },
            { name: "confidential", type: "number", min: 0, label: "Flagged confidential" },
          ],
        },
        {
          name: "approvedBy",
          type: "relationship",
          relationTo: "users",
          access: { update: ({ req }) => req.user?.role === "management" },
        },
        { name: "excludeConfidential", type: "checkbox", defaultValue: true },
      ],
    },
  ],
};

/** Who is on call outside office hours (24/7 service). */
export const OnCallRoster: GlobalConfig = {
  slug: "on-call-roster",
  admin: { group: "Configuration" },
  access: { read: loggedIn, update: ({ req }) => ["management", "office-admin"].includes(String(req.user?.role)) },
  fields: [
    {
      name: "shifts",
      type: "array",
      labels: { singular: "Shift", plural: "Shifts" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "from", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "to", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "user", type: "relationship", relationTo: "users", required: true },
            { name: "backup", type: "relationship", relationTo: "users" },
          ],
        },
      ],
    },
    { name: "escalateAfterMinutes", type: "number", min: 1, defaultValue: 15 },
    {
      name: "seniorContacts",
      type: "array",
      fields: [{ name: "user", type: "relationship", relationTo: "users", required: true }],
    },
  ],
};

export const globals = [
  Settings,
  FxRates,
  PricingPolicy,
  ApprovalRules,
  AutomationRules,
  MessageTemplates,
  Integrations,
  OnCallRoster,
];
