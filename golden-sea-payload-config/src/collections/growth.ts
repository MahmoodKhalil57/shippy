import type { CollectionConfig } from "payload";
import { DAY, TODAY, computed, deskAccess, management, related, scalar } from "./shared.ts";
import { tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";

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

const day = (v: unknown) =>
  typeof v === "string" && v
    ? new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
    : "";
/** The start of the demo's day: a next step dated before it is overdue. */
const TODAY_START = TODAY.toISOString().slice(0, 10);
/** A week after the demo's day: when a next step is planned for by default. */
const IN_A_WEEK = new Date(TODAY.getTime() + 7 * DAY).toISOString().slice(0, 10);

/**
 * "Record outcome" (or "Plan next step" when there is none): what happened on the step and the
 * next one; POST /api/growth/:id/outcome saves it, closes the step's task, puts the next step on
 * the owner's follow-ups and says what it planned.
 */
const outcome = (label: string, planning: boolean): CollectionAction => ({
  label,
  when: { noNextStep: planning ? { equals: true } : { not_equals: true } },
  call: { path: "/growth/$row.id/outcome", body: { company: "$row.name" } },
  prompt: `${label} — $row.name`,
  fields: [
    {
      type: "select",
      name: "result",
      label: "Outcome",
      required: true,
      options: SALES_RESULTS,
      defaultValue: planning ? "Sent" : "Reached — positive",
      admin: planning ? undefined : { description: "Step: $row.nextStep ($row.channel, $row.contact)" },
    },
    {
      type: "textarea",
      name: "note",
      label: "What happened",
      admin: { placeholder: "Who said what — e.g. Registration committee meets 24 Nov; documents complete." },
    },
    {
      type: "text",
      name: "nextStep",
      label: "Next step",
      admin: {
        placeholder: "e.g. Call after the committee decision",
        description: "Saved on the opportunity; the next step goes on the owner's follow-ups.",
      },
    },
    { type: "date", name: "nextStepDue", label: "Next step date", defaultValue: IN_A_WEEK, admin: { width: "50%" } },
    {
      type: "select",
      name: "stage",
      label: "Stage",
      options: GROWTH_STAGES,
      defaultValue: "$row.stage",
      admin: { width: "50%" },
    },
  ],
  reply: true,
});

/** Growth pipeline — kept apart from operational RFQs; linked to the customer once business is won. */
export const Opportunities: CollectionConfig = {
  slug: "opportunities",
  custom: {
    list: { board: "stage" },
    // Wherever opportunities show (the growth board, Sales' home): record what happened, plan what's next.
    actions: [outcome("Record outcome", false), outcome("Plan next step", true)],
  } satisfies CollectionSettings,
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
        {
          name: "name",
          type: "text",
          required: true,
          admin: { description: "The prospect company's name.", placeholder: "e.g. Nordvik Ship Management" },
        },
        {
          name: "kind",
          type: "text",
          admin: { description: "One line on what they are and how big.", placeholder: "Ship manager · 14 reefers" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "segment",
          type: "select",
          options: ["Marine", "Offshore", "Oil & gas", "Industrial", "Shipbuilding & repair"],
          admin: { description: "The market they belong to.", placeholder: "Pick a segment" },
        },
        {
          name: "source",
          type: "text",
          admin: { description: "How we found them.", placeholder: "e.g. Referral from a Port Said agent" },
        },
        {
          name: "estimatedValue",
          type: "text",
          admin: { description: "What we expect them to buy in a year.", placeholder: "USD 60k / yr" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "nextStep",
          type: "text",
          admin: {
            description: "The one thing to do next to move them forward.",
            placeholder: "e.g. Call after the committee decision",
          },
        },
        {
          name: "nextStepDue",
          type: "date",
          admin: { description: "The day the next step should happen by." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "contact",
          type: "text",
          label: "Who",
          admin: { description: "The person or role to reach.", placeholder: "Procurement lead" },
        },
        {
          name: "channel",
          type: "select",
          options: SALES_CHANNELS,
          custom: tones(Object.fromEntries(SALES_CHANNELS.map((c) => [c, "info" as const]))),
          admin: { description: "How the next step will be done.", placeholder: "Pick a channel" },
        },
      ],
    },
    {
      name: "script",
      type: "textarea",
      label: "What to say",
      admin: {
        description: "Talking points for the next step.",
        placeholder: "e.g. Introduce our Port Said stores and ask about their vendor list.",
      },
    },
    {
      name: "fleetSize",
      type: "number",
      min: 0,
      admin: { description: "How many vessels they run in total.", placeholder: "e.g. 14" },
    },
    {
      name: "fleet",
      type: "array",
      labels: { singular: "Vessel", plural: "Fleet (known vessels)" },
      admin: { description: "The prospect's vessels, before they become vessel records." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              admin: { description: "The vessel's name.", placeholder: "e.g. MV Nordic Star" },
            },
            {
              name: "imo",
              type: "text",
              label: "IMO",
              admin: { description: "The 7-digit IMO number, if known.", placeholder: "e.g. 9811204" },
              validate: (value: unknown) =>
                value == null ||
                value === "" ||
                (typeof value === "string" && /^\d{7}$/.test(value)) ||
                "IMO numbers have 7 digits.",
            },
            {
              name: "vesselType",
              type: "text",
              label: "Type",
              admin: { description: "What kind of vessel she is.", placeholder: "e.g. Reefer" },
            },
          ],
        },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      admin: { description: "What happened after each call, visit or email, newest last." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "at", type: "date", admin: { description: "When it happened." } },
            {
              name: "result",
              type: "select",
              options: SALES_RESULTS,
              admin: { description: "How the contact went.", placeholder: "Pick an outcome" },
            },
            {
              name: "by",
              type: "relationship",
              relationTo: "users",
              admin: { description: "Who made the contact.", placeholder: "Search users" },
            },
          ],
        },
        {
          name: "note",
          type: "textarea",
          admin: {
            description: "What was said and agreed.",
            placeholder: "e.g. Committee meets 24 Nov; documents complete.",
          },
        },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      admin: { description: "Set when the prospect becomes a customer.", placeholder: "Search customers" },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description: "Background that does not fit elsewhere.",
        placeholder: "e.g. Fleet manager prefers WhatsApp after 4 pm.",
      },
    },
    {
      name: "stage",
      type: "select",
      required: true,
      defaultValue: "Prospect",
      options: GROWTH_STAGES,
      admin: {
        position: "sidebar",
        description: "How far along they are, from prospect to active account.",
        placeholder: "Pick a stage",
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: { position: "sidebar", description: "The salesperson who owns this lead.", placeholder: "Search users" },
    },
    {
      name: "noNextStep",
      type: "checkbox",
      admin: { position: "sidebar", readOnly: true, description: "Set when no next step is planned." },
    },
    // Worked out on read (never stored): where the next step stands (red when there is none or
    // its date has passed), the step itself, and the last outcome recorded.
    computed(
      {
        name: "step",
        type: "text",
        label: "Next step status",
        custom: {
          toneWhen: [
            { when: { noNextStep: { equals: true } }, tone: "error" },
            { when: { nextStepDue: { less_than: TODAY_START } }, tone: "error" },
          ],
        },
        admin: { position: "sidebar", description: "Whether the next step is planned, due or overdue." },
      },
      (o) => {
        if (o.noNextStep === true) return "No next step — plan one or close";
        if (typeof o.nextStepDue !== "string" || !o.nextStepDue) return o.nextStep ? "Planned" : null;
        return o.nextStepDue < TODAY_START ? `Overdue · ${day(o.nextStepDue)}` : day(o.nextStepDue);
      },
    ),
    computed(
      {
        name: "brief",
        type: "text",
        label: "Next step",
        admin: { condition: () => false, description: "The next step, or a nudge to plan one." },
      },
      (o) => scalar(o.nextStep) || "Plan the next step, or close the opportunity.",
    ),
    computed(
      {
        name: "lastOutcome",
        type: "text",
        label: "Last outcome",
        admin: { condition: () => false, description: "The most recent contact, in one line." },
      },
      async (o, req) => {
        const last = (o.outcomes as { at?: string; result?: string; note?: string; by?: unknown }[] | undefined)?.at(
          -1,
        );
        if (!last) return null;
        const by = scalar((await related(req, "users", last.by))?.name);
        return `Last: ${scalar(last.result)}${last.note ? ` — ${last.note}` : ""} (${[by, day(last.at)].filter(Boolean).join(", ")})`;
      },
    ),
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
        {
          name: "company",
          type: "text",
          required: true,
          admin: { description: "The ship manager or owner we apply to.", placeholder: "e.g. Nordvik Ship Management" },
        },
        {
          name: "customer",
          type: "relationship",
          relationTo: "customers",
          admin: { description: "Their customer record, once they have one.", placeholder: "Search customers" },
        },
        {
          name: "opportunity",
          type: "relationship",
          relationTo: "opportunities",
          admin: { description: "The sales lead this application belongs to.", placeholder: "Search opportunities" },
        },
      ],
    },
    {
      name: "portal",
      type: "text",
      label: "Portal / method",
      admin: { description: "Where or how we submit the application.", placeholder: "e.g. Nordvik supplier portal" },
    },
    {
      type: "row",
      fields: [
        { name: "submittedAt", type: "date", admin: { description: "The day we sent the application in." } },
        {
          name: "committeeDate",
          type: "date",
          label: "Committee decides",
          admin: { description: "When their vendor committee meets to decide." },
        },
        { name: "renewBy", type: "date", admin: { description: "When the approval must be renewed." } },
      ],
    },
    {
      name: "contact",
      type: "text",
      label: "Their contact",
      admin: {
        description: "Who handles vendor approval on their side.",
        placeholder: "e.g. Sara Lindqvist, Procurement",
      },
    },
    {
      name: "documents",
      type: "array",
      admin: { description: "The papers they ask for, and where each one stands." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              admin: { description: "The document they ask for.", placeholder: "e.g. ISO 9001 certificate" },
            },
            {
              name: "status",
              type: "select",
              options: ["Missing", "Ready", "Submitted", "Expired"],
              defaultValue: "Missing",
              admin: { description: "Where this document stands.", placeholder: "Pick a status" },
            },
            { name: "file", type: "upload", relationTo: "media", admin: { description: "The scan or PDF we submit." } },
          ],
        },
      ],
    },
    {
      name: "nextStep",
      type: "text",
      admin: {
        description: "What we do next on this application.",
        placeholder: "e.g. Send the renewed ISO certificate",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Documents requested",
      options: ["Documents requested", "Submitted", "Under review", "Approved", "Rejected", "Renewal overdue"],
      custom: tones({
        "Documents requested": "warning",
        Submitted: "info",
        "Under review": "info",
        Approved: "success",
        Rejected: "error",
        "Renewal overdue": "error",
      }),
      admin: {
        position: "sidebar",
        description: "Where the application stands with the buyer.",
        placeholder: "Pick a status",
      },
    },
    // Worked out on read (never stored): its dates and its documents, in a line each.
    computed(
      {
        name: "dates",
        type: "text",
        label: "Dates",
        admin: { condition: () => false, description: "Submission, committee and renewal dates in one line." },
      },
      (r) =>
        [
          r.submittedAt && `Submitted ${day(r.submittedAt)}`,
          r.committeeDate && `Committee ${day(r.committeeDate)}`,
          r.renewBy && `Renew by ${day(r.renewBy)}`,
        ]
          .filter(Boolean)
          .join(" · ") || null,
    ),
    computed(
      {
        name: "paperwork",
        type: "text",
        label: "Documents",
        admin: { condition: () => false, description: "The documents, with the missing or expired ones flagged." },
      },
      (r) =>
        ((r.documents as { name?: string; status?: string }[] | undefined) ?? [])
          .map((d) => {
            const status = scalar(d.status) || "Missing";
            return status === "Missing" || status === "Expired"
              ? `${scalar(d.name)} — ${status.toLowerCase()}`
              : scalar(d.name);
          })
          .join(" · ") || null,
    ),
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
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "An internal name to find the campaign by.", placeholder: "e.g. Winter bond stores offer" },
    },
    {
      type: "row",
      fields: [
        {
          name: "audience",
          type: "text",
          required: true,
          admin: { description: "Who gets it, in a few words.", placeholder: "Ship managers, consented" },
        },
        {
          name: "recipients",
          type: "number",
          min: 0,
          admin: { description: "How many contacts are on the list.", placeholder: "e.g. 120" },
        },
        {
          name: "consentOnly",
          type: "checkbox",
          defaultValue: true,
          label: "Consented contacts only",
          admin: { description: "Keep ticked so only contacts who agreed to emails get it." },
        },
      ],
    },
    {
      name: "subject",
      type: "text",
      admin: {
        description: "The email subject line recipients see.",
        placeholder: "e.g. Bond stores for your winter port calls",
      },
    },
    {
      name: "body",
      type: "textarea",
      admin: {
        description: "The email text. It must be approved before sending.",
        placeholder: "e.g. Dear Captain, our Port Said stores now carry...",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "contentStatus",
          type: "select",
          defaultValue: "Draft",
          options: ["Draft", "Awaiting approval", "Approved"],
          custom: tones({ Draft: "warning", "Awaiting approval": "warning", Approved: "success" }),
          admin: { description: "Whether the wording has been signed off.", placeholder: "Pick a status" },
        },
        { name: "scheduledAt", type: "date", admin: { description: "When it goes out; management sets this." } },
      ],
    },
    {
      name: "stats",
      type: "group",
      admin: { description: "How the send performed." },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "sent",
              type: "number",
              min: 0,
              admin: { description: "Emails delivered.", placeholder: "e.g. 118" },
            },
            {
              name: "opened",
              type: "number",
              min: 0,
              admin: { description: "Recipients who opened it.", placeholder: "e.g. 54" },
            },
            {
              name: "replied",
              type: "number",
              min: 0,
              admin: { description: "Recipients who wrote back.", placeholder: "e.g. 9" },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Draft",
      options: ["Draft", "Scheduled", "Sent", "Cancelled"],
      admin: {
        position: "sidebar",
        description: "Only management can schedule or send.",
        placeholder: "Pick a status",
      },
    },
    // Worked out on read (never stored): who it reaches and how it did.
    computed(
      {
        name: "reach",
        type: "text",
        label: "Audience",
        admin: { condition: () => false, description: "Who it reaches, in one line." },
      },
      (c) =>
        [scalar(c.audience), `${Number(c.recipients) || 0} contacts`, c.consentOnly !== false ? "consented only" : ""]
          .filter(Boolean)
          .join(" · "),
    ),
    computed(
      {
        name: "results",
        type: "text",
        label: "Results",
        admin: { condition: () => false, description: "Sent, opened and replied counts in one line." },
      },
      (c) => {
        const s = (c.stats as { sent?: number; opened?: number; replied?: number } | undefined) ?? {};
        return Number(s.sent)
          ? `${Number(s.sent)} sent · ${Number(s.opened) || 0} opened · ${Number(s.replied) || 0} replied`
          : null;
      },
    ),
  ],
};
