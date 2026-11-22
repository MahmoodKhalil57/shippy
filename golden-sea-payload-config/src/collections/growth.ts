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
        {
          name: "channel",
          type: "select",
          options: SALES_CHANNELS,
          custom: tones(Object.fromEntries(SALES_CHANNELS.map((c) => [c, "info" as const]))),
        },
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
        admin: { position: "sidebar" },
      },
      (o) => {
        if (o.noNextStep === true) return "No next step — plan one or close";
        if (typeof o.nextStepDue !== "string" || !o.nextStepDue) return o.nextStep ? "Planned" : null;
        return o.nextStepDue < TODAY_START ? `Overdue · ${day(o.nextStepDue)}` : day(o.nextStepDue);
      },
    ),
    computed(
      { name: "brief", type: "text", label: "Next step", admin: { condition: () => false } },
      (o) => scalar(o.nextStep) || "Plan the next step, or close the opportunity.",
    ),
    computed(
      { name: "lastOutcome", type: "text", label: "Last outcome", admin: { condition: () => false } },
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
      custom: tones({
        "Documents requested": "warning",
        Submitted: "info",
        "Under review": "info",
        Approved: "success",
        Rejected: "error",
        "Renewal overdue": "error",
      }),
      admin: { position: "sidebar" },
    },
    // Worked out on read (never stored): its dates and its documents, in a line each.
    computed(
      { name: "dates", type: "text", label: "Dates", admin: { condition: () => false } },
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
      { name: "paperwork", type: "text", label: "Documents", admin: { condition: () => false } },
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
          custom: tones({ Draft: "warning", "Awaiting approval": "warning", Approved: "success" }),
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
    // Worked out on read (never stored): who it reaches and how it did.
    computed({ name: "reach", type: "text", label: "Audience", admin: { condition: () => false } }, (c) =>
      [scalar(c.audience), `${Number(c.recipients) || 0} contacts`, c.consentOnly !== false ? "consented only" : ""]
        .filter(Boolean)
        .join(" · "),
    ),
    computed({ name: "results", type: "text", label: "Results", admin: { condition: () => false } }, (c) => {
      const s = (c.stats as { sent?: number; opened?: number; replied?: number } | undefined) ?? {};
      return Number(s.sent)
        ? `${Number(s.sent)} sent · ${Number(s.opened) || 0} opened · ${Number(s.replied) || 0} replied`
        : null;
    }),
  ],
};
