import type { Field, GlobalConfig, PayloadRequest } from "payload";
import { CURRENCIES, DAY, ROLES, STORES, TODAY, anyone, loggedIn, management } from "../collections/shared.ts";
import { formats, tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import { approvalRulesBefore } from "../pages/approval-rules.ts";
import { Assistant, Branding } from "./dashboard.ts";

const managementOnly: GlobalConfig["access"] = { read: anyone, update: management };
const staffRead: GlobalConfig["access"] = { read: loggedIn, update: management };

/** Interface and document languages (English / Arabic). */
export const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "العربية (Arabic)", value: "ar" },
];

/** The permission columns of the roles matrix, and where each is enforced. */
export const PERMISSIONS = [
  { key: "clientInfo", label: "Client info", enforced: "Read access on customers, vessels and cases" },
  {
    key: "supplierCosts",
    label: "Supplier costs",
    enforced: "Field access on offers, supplier prices and case pricing (hidden from Sales)",
  },
  { key: "margins", label: "Margins", enforced: "Field access on line margins and profit (hidden from Sales)" },
  {
    key: "approveQuotes",
    label: "Approve quotes & discounts",
    enforced: "Approval rules: customer quotation, discount",
  },
  { key: "approvePOs", label: "Approve supplier POs", enforced: "Approval rules: supplier PO" },
  {
    key: "approvePayments",
    label: "Approve payments & bank changes",
    enforced: "Approval rules: deposits and payments; bank changes need two people",
  },
  {
    key: "sendExternal",
    label: "Send external messages",
    enforced: "Only approved templates send automatically; anything else is sent by a person",
  },
  { key: "accounting", label: "Accounting postings", enforced: "Create / update on invoices, bills and payments" },
] as const;

/** Everyone's name by role, read once per request (the matrix's "People" column). */
async function namesByRole(req: PayloadRequest): Promise<Map<string, string[]>> {
  const ctx = (req.context ??= {}) as { namesByRole?: Promise<Map<string, string[]>> };
  ctx.namesByRole ??= req.payload
    .find({ collection: "users" as never, depth: 0, pagination: false, sort: "name" } as never)
    .then(({ docs }) => {
      const by = new Map<string, string[]>();
      for (const u of docs as unknown as { role?: string; name?: string }[])
        if (u.role) by.set(u.role, [...(by.get(u.role) ?? []), String(u.name ?? "")]);
      return by;
    });
  return ctx.namesByRole;
}

/**
 * The roles & permissions matrix (Settings › Roles & permissions; each column is enforced by
 * access rules). Each permission reads green where it's granted; management edits a role's row
 * (POST /api/roles/permission, which re-checks, logs it and answers with the Undo).
 */
const permissionsMatrix = {
  name: "permissions",
  type: "array",
  labels: { singular: "Role", plural: "Roles" },
  admin: { description: "Who can see and approve what. Shown on /roles." },
  custom: {
    actions: [
      {
        label: "Edit",
        roles: ["management"],
        call: { path: "/roles/permission", body: { role: "$row.role" } },
        fields: PERMISSIONS.map((p) => ({
          type: "checkbox",
          name: p.key,
          label: p.label,
          defaultValue: `$row.${p.key}`,
        })),
        done: "Permissions saved (logged on the audit trail)",
      },
    ] satisfies CollectionAction[],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "role",
          type: "select",
          required: true,
          options: [...ROLES, { label: "System mailbox (sales@)", value: "system" }],
        },
        { name: "note", type: "text" },
      ],
    },
    // The people in the role (the users collection), worked out on read.
    {
      name: "people",
      type: "text",
      label: "People",
      virtual: true,
      admin: { readOnly: true },
      hooks: {
        afterRead: [
          async ({ siblingData, req }: { siblingData?: { role?: string }; req: PayloadRequest }) => {
            if (!req.user) return undefined;
            const role = String(siblingData?.role ?? "");
            const names = (await namesByRole(req)).get(role) ?? [];
            return names.length ? names.join(", ") : role === "system" ? "System account" : undefined;
          },
        ],
      },
    },
    {
      type: "row",
      fields: PERMISSIONS.map((p) => ({
        name: p.key,
        type: "checkbox" as const,
        label: p.label,
        defaultValue: false,
        custom: { toneWhen: [{ when: { [p.key]: { equals: true } }, tone: "success" as const }] },
      })),
    },
  ],
} as Field;

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
            {
              type: "row",
              fields: [
                {
                  name: "defaultLanguage",
                  type: "select",
                  label: "Default language",
                  options: LANGUAGES,
                  defaultValue: "en",
                },
                {
                  name: "documentLanguages",
                  type: "select",
                  hasMany: true,
                  label: "Customer documents in",
                  options: LANGUAGES,
                  defaultValue: ["en", "ar"],
                  admin: { description: "Acknowledgements, quotations and invoices." },
                },
              ],
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
        { label: "Roles & permissions", fields: [permissionsMatrix] },
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
  // A Global view with widgets above its form: what these rules govern right now.
  custom: { edit: { before: approvalRulesBefore } } satisfies CollectionSettings,
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

/** A rule switched on or off by management (POST /api/automations/rule, which logs it and answers with the Undo). */
const switchRule = (label: string, value: boolean, when: Record<string, unknown>): CollectionAction => ({
  label,
  when,
  roles: ["management"],
  call: { path: "/automations/rule", body: { id: "$row.id", value } },
  done: `$row.name ${value ? "enabled" : "paused"} (logged)`,
});

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
      custom: {
        actions: [
          switchRule("Pause", false, { enabled: { not_equals: false } }),
          switchRule("Enable", true, { enabled: { equals: false } }),
        ],
      },
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
              custom: tones({ auto: "success", "pre-approved": "info", prepare: "warning" }),
            },
            { name: "usesAI", type: "checkbox", label: "AI-assisted", defaultValue: false },
          ],
        },
        // Whether it runs, as the registry reads it: worked out on read from `enabled`.
        {
          name: "state",
          type: "select",
          label: "On",
          options: ["On", "Paused"],
          virtual: true,
          admin: { readOnly: true },
          custom: tones({ On: "success", Paused: "neutral" }),
          hooks: {
            afterRead: [
              ({ siblingData }) => ((siblingData as { enabled?: unknown }).enabled === false ? "Paused" : "On"),
            ],
          },
        },
        // An AI-assisted rule and the confidence below which a person reviews its result.
        {
          name: "aiReview",
          type: "text",
          label: "AI",
          virtual: true,
          admin: { readOnly: true },
          hooks: {
            afterRead: [
              ({ siblingData }) => {
                const r = siblingData as { usesAI?: unknown; confidenceThreshold?: unknown };
                const below =
                  typeof r.confidenceThreshold === "number"
                    ? `review below ${Math.round(r.confidenceThreshold * 100)}%`
                    : "";
                return [r.usesAI ? "AI-assisted" : "", below].filter(Boolean).join(" · ") || undefined;
              },
            ],
          },
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
        { name: "subjectAr", type: "text", label: "Subject (Arabic)" },
        { name: "bodyAr", type: "textarea", label: "Body (Arabic)" },
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

/** The mailboxes among the connections; every other connection is a channel. */
const MAILBOXES = ["Outlook mailbox", "Gmail mailbox"];

/** What each kind of connection does, as its card says it. */
const ABOUT: Record<string, { title?: string; about: string }> = {
  "Outlook mailbox": { about: "Every email becomes or joins a case, with its attachments kept." },
  "Gmail mailbox": { about: "Every email becomes or joins a case, with its attachments kept." },
  "Website form": {
    title: "Website quick-quote form",
    about: "“Request a quick quote” creates a draft case and contact; AI reads the items.",
  },
  WhatsApp: {
    about:
      "Captains and agents message on WhatsApp: each message is logged on its case with a screenshot and who logged it.",
  },
  "E-invoicing (tax authority)": {
    title: "Egyptian e-invoicing (ETA)",
    about: "Invoices are signed and submitted to the tax authority; the UUID and status are stored on the invoice.",
  },
  "AI extraction": { about: "Reads PDF, Excel, Word and photos into draft lines. Drafts only." },
  "Document storage": { title: "Documents", about: "Every file on its case, searchable." },
  Odoo: {
    about:
      "Odoo for the books, SaaSTEMLY for the way you work. Standard, supported Odoo holds contacts, sales and purchase orders, stock, invoices and accounting. The sourcing desk on top — inbox, comparison, approvals, automations — writes into it, so any Odoo partner can read your books.",
  },
};

type Row = Record<string, unknown>;
const kindOf = (row: unknown) => {
  const kind = (row as Row | undefined)?.kind;
  return typeof kind === "string" ? kind : "";
};

/** A field worked out on read from the row it's on (`siblingData`), never stored. */
const fromRow = <F extends Field>(field: F, compute: (row: Row, req: PayloadRequest) => unknown): F =>
  ({
    ...field,
    virtual: true,
    admin: { readOnly: true },
    hooks: {
      afterRead: [
        ({ siblingData, req }: { siblingData?: Row; req: PayloadRequest }) => compute(siblingData ?? {}, req),
      ],
    },
  }) as F;

/** Amber within 30 days, red once expired. */
const expiryTones = [
  { when: { expiresInDays: { less_than: 0 } }, tone: "error" as const },
  { when: { expiresInDays: { less_than: 30 } }, tone: "warning" as const },
];

/** A connection's fields: what's stored, and what its cards read from it. */
const connectionFields: Field[] = [
  {
    type: "row",
    fields: [
      {
        name: "kind",
        type: "select",
        required: true,
        options: [
          ...MAILBOXES,
          "Website form",
          "WhatsApp",
          "AI extraction",
          "E-invoicing (tax authority)",
          "Document storage",
          "Odoo",
        ],
      },
      { name: "account", type: "text", admin: { placeholder: "sales@" } },
      {
        name: "status",
        type: "select",
        options: ["Connected", "Token expired", "To connect", "Sandbox", "Staging", "Manual", "Disabled"],
        defaultValue: "To connect",
        custom: tones({
          Connected: "success",
          "Token expired": "error",
          "To connect": "warning",
          Sandbox: "info",
          Staging: "info",
          Manual: "neutral",
          Disabled: "neutral",
        }),
      },
    ],
  },
  {
    type: "row",
    fields: [
      { name: "lastSyncAt", type: "date", label: "Last sync", admin: { date: { pickerAppearance: "dayAndTime" } } },
      { name: "pollEveryMinutes", type: "number", min: 1 },
      {
        name: "tokenExpiresAt",
        type: "date",
        label: "Token / certificate expires",
        custom: { toneWhen: expiryTones },
      },
      // Days from the demo's today until the token or certificate expires (negative once it has).
      fromRow(
        {
          name: "expiresInDays",
          type: "number",
          label: "Expires in",
          custom: { ...formats.days(), toneWhen: expiryTones },
        },
        ({ tokenExpiresAt: at }) =>
          typeof at === "string" && at ? Math.round((new Date(at).getTime() - TODAY.getTime()) / DAY) : null,
      ),
    ],
  },
  {
    type: "row",
    fields: [
      {
        name: "emailsImported",
        type: "number",
        min: 0,
        admin: { description: "Messages imported so far (history + live)." },
      },
      { name: "modules", type: "text", admin: { description: "Odoo apps in use, comma-separated." } },
    ],
  },
  { name: "notes", type: "text" },
  // What its cards read: its name and what it does (by kind), how often it's polled, and how many
  // messages came in through it (those imported, and the ones in the inbox now).
  fromRow({ name: "title", type: "text", label: "Connection" }, (row) => ABOUT[kindOf(row)]?.title ?? kindOf(row)),
  fromRow({ name: "about", type: "text", label: "What it does" }, (row) => ABOUT[kindOf(row)]?.about),
  fromRow({ name: "poll", type: "text", label: "Polled" }, (row) =>
    typeof row.pollEveryMinutes === "number" ? `every ${row.pollEveryMinutes} min` : undefined,
  ),
  fromRow({ name: "received", type: "number", label: "Messages received" }, async (row, req) => {
    if (row.emailsImported == null) return null;
    const or: Row[] = [];
    if (typeof row.account === "string" && row.account) or.push({ mailbox: { equals: row.account } });
    if (row.kind === "Website form") or.push({ channel: { equals: "Website form" } });
    const live = or.length
      ? (await req.payload.count({ collection: "intake-messages" as never, where: { or } as never })).totalDocs
      : 0;
    return (Number(row.emailsImported) || 0) + live;
  }),
];

/**
 * A mailbox with an expired or missing sign-in: "Reconnect" (management, operations, the office
 * manager), which imports the mail that waited once each (POST /api/integrations/reconnect).
 */
const reconnect = (kind: string, provider: string): CollectionAction => ({
  label: "Reconnect",
  main: true,
  when: { kind: { equals: kind }, status: { in: ["Token expired", "To connect"] } },
  roles: ["management", "operations", "office-admin"],
  call: { path: "/integrations/reconnect", body: { id: "$row.id" } },
  confirm: {
    heading: "Reconnect $row.account",
    text: `You'll sign in with the mailbox's ${provider} account (simulated in the demo). After sign-in, the emails that waited are imported once each — the idempotency check makes sure none is imported, acknowledged or turned into a case twice.`,
    label: "Sign in & reconnect",
  },
  reply: true,
});

/**
 * Some of the connections, worked out on read (never stored, not in the form): the mailboxes, or
 * the other channels, each with what people can do to it. Its rows are the connections' own.
 */
const connectionsWhere = (
  name: string,
  label: string,
  keep: (row: unknown) => boolean,
  actions: CollectionAction[],
): Field =>
  ({
    name,
    type: "array",
    label,
    virtual: true,
    admin: { readOnly: true, hidden: true },
    custom: { actions },
    fields: connectionFields,
    hooks: {
      afterRead: [
        ({ siblingData }: { siblingData?: Row }) =>
          ((siblingData?.connections as unknown[] | undefined) ?? []).filter(keep),
      ],
    },
  }) as Field;

/**
 * Connections and the email-history import job. The integrations page reads its mailboxes and
 * channels as rows (`records`), with what they mean on their fields.
 */
export const Integrations: GlobalConfig = {
  slug: "integrations",
  admin: { group: "Configuration" },
  access: staffRead,
  fields: [
    {
      name: "connections",
      type: "array",
      labels: { singular: "Connection", plural: "Connections" },
      fields: connectionFields,
    },
    connectionsWhere("mailboxes", "Mailboxes", (c) => MAILBOXES.includes(kindOf(c)), [
      reconnect("Outlook mailbox", "Microsoft 365"),
      reconnect("Gmail mailbox", "Google"),
    ]),
    connectionsWhere("channels", "Channels", (c) => !MAILBOXES.includes(kindOf(c)), [
      // Failed submissions wait in the exception queue.
      { label: "Exception queue", when: { kind: { equals: "E-invoicing (tax authority)" } }, href: "/automations" },
    ]),
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
    {
      name: "backups",
      type: "group",
      label: "Backups, staging and export",
      fields: [
        {
          type: "row",
          fields: [
            { name: "schedule", type: "text", defaultValue: "Daily 02:00 Cairo" },
            { name: "locations", type: "number", min: 1, defaultValue: 3 },
            { name: "retentionDays", type: "number", min: 1, defaultValue: 30 },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "lastBackupAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "restoreTestedAt", type: "date" },
            {
              name: "stagingRefreshedAt",
              type: "date",
              label: "Staging copy refreshed",
              admin: { date: { pickerAppearance: "dayAndTime" } },
            },
          ],
        },
      ],
    },
  ],
};

/** A shift's time as the roster reads it: Cairo time, day and hour. */
const cairo = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const cairoText = (v: unknown) => (typeof v === "string" && v ? cairo.format(new Date(v)) : "");

/**
 * Who is on call outside office hours (24/7 service). The roles page reads its shifts as rows
 * (`records`): the one on now is highlighted, and management or the office manager change who is on
 * duty and who backs them up (POST /api/roles/roster, which logs it and answers with the Undo).
 */
export const OnCallRoster: GlobalConfig = {
  slug: "on-call-roster",
  admin: { group: "Configuration" },
  access: { read: loggedIn, update: ({ req }) => ["management", "office-admin"].includes(String(req.user?.role)) },
  fields: [
    {
      name: "shifts",
      type: "array",
      labels: { singular: "Shift", plural: "Shifts" },
      custom: {
        actions: [
          {
            label: "Edit",
            roles: ["management", "office-admin"],
            call: { path: "/roles/roster", body: { id: "$row.id" } },
            fields: [
              {
                type: "relationship",
                relationTo: "users",
                name: "user",
                label: "On duty",
                required: true,
                defaultValue: "$row.user.id",
              },
              {
                type: "relationship",
                relationTo: "users",
                name: "backup",
                label: "Backup",
                defaultValue: "$row.backup.id",
              },
            ],
            done: "Roster saved",
          },
        ] satisfies CollectionAction[],
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "from", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "to", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
            { name: "user", type: "relationship", relationTo: "users", required: true, label: "On duty" },
            { name: "backup", type: "relationship", relationTo: "users" },
          ],
        },
        // Whether the demo's "now" falls in the shift, and the shift in Cairo time (the one on now
        // highlighted): worked out on read.
        fromRow(
          { name: "now", type: "checkbox", label: "On now" },
          ({ from, to }) => new Date(String(from)) <= TODAY && TODAY < new Date(String(to)),
        ),
        fromRow(
          {
            name: "shift",
            type: "text",
            label: "Shift (Cairo)",
            custom: { toneWhen: [{ when: { now: { equals: true } }, tone: "primary" }] },
          },
          ({ from, to }) => `${cairoText(from)} → ${cairoText(to)}`,
        ),
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
  Branding,
  Assistant,
  Settings,
  FxRates,
  PricingPolicy,
  ApprovalRules,
  AutomationRules,
  MessageTemplates,
  Integrations,
  OnCallRoster,
];
