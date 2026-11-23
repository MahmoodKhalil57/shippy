import type { Access, CollectionConfig } from "payload";
import { DAY, TODAY, computed, deskAccess, idOf, loggedIn, management, related, ruleError, scalar } from "./shared.ts";
import { tones, type CollectionAction, type CollectionSettings } from "saastemlycrm-design-system/contracts";

const clock = (d: Date) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
/**
 * When something is due, against the demo's clock: "Overdue" once passed, its time today ("11:00"),
 * else its day ("Wed 18 Nov", with the time when it has one). Pure: the date in.
 */
export function dueLabel(iso: unknown): string | null {
  if (typeof iso !== "string" || !iso) return null;
  const d = new Date(iso);
  if (d < TODAY) return "Overdue";
  const timed = d.getTime() % DAY !== 0;
  if (Math.floor(d.getTime() / DAY) === Math.floor(TODAY.getTime() / DAY)) return timed ? clock(d) : "Today";
  const day = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  return timed ? `${day} ${clock(d)}` : day;
}

const KIND_LABEL: Record<string, string> = { auto: "Automatic", human: "Human", alert: "Alert" };

/** Case timeline + audit log: every automatic step and human decision. Append-only. */
export const Activities: CollectionConfig = {
  slug: "activities",
  labels: { singular: "Activity", plural: "Activity log" },
  admin: { useAsTitle: "text", defaultColumns: ["at", "case", "kind", "text", "actor"], group: "Work" },
  defaultSort: "-at",
  access: { read: loggedIn, create: loggedIn, update: () => false, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "at",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: "dayAndTime" }, description: "When the step happened." },
        },
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          index: true,
          admin: { description: "The customer case it belongs to.", placeholder: "e.g. GS-RFQ-0142" },
        },
        {
          name: "kind",
          type: "select",
          options: [
            { label: "Automatic", value: "auto" },
            { label: "Human", value: "human" },
            { label: "Alert", value: "alert" },
          ],
          custom: tones({ auto: "info", human: "success", alert: "warning" }),
          defaultValue: "auto",
          admin: { description: "Whether the system, a person or a warning did it.", placeholder: "Pick a kind" },
        },
      ],
    },
    {
      name: "text",
      type: "textarea",
      required: true,
      admin: {
        description: "What happened, in plain words.",
        placeholder: "e.g. Reminder sent to Delta Marine for RFQ 0142.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "actor",
          type: "relationship",
          relationTo: "users",
          admin: { description: "The person who did it; empty for automatic steps.", placeholder: "Search users" },
        },
        {
          name: "entity",
          type: "text",
          admin: { description: "The record that changed, as collection/id.", placeholder: "e.g. suppliers/12" },
        },
        {
          name: "rule",
          type: "text",
          label: "Automation rule",
          admin: { description: "Set when an automation did it.", placeholder: "e.g. RFQ reminder" },
        },
      ],
    },
    {
      name: "undoOf",
      type: "relationship",
      relationTo: "activities",
      label: "Undoes",
      admin: { description: "The earlier step this one reverses.", placeholder: "Search the activity log" },
    },
    // Who or what did it, in a line (never stored): "Automatic · System · rule: RFQ reminder",
    // "Human · Karim Youssef". Every automatic step names its rule, every human one the person.
    computed(
      {
        name: "byline",
        type: "text",
        label: "By",
        admin: { condition: () => false, description: "Who or what did it, with the rule if automatic." },
      },
      async (a, req) => {
        const kind = KIND_LABEL[scalar(a.kind)] ?? "Automatic";
        const actor = a.actor ? scalar((await related(req, "users", a.actor))?.name) : "";
        return [kind, actor || (a.kind === "human" ? "" : "System"), a.rule ? `rule: ${scalar(a.rule)}` : ""]
          .filter(Boolean)
          .join(" · ");
      },
    ),
  ],
};

/**
 * Everything someone has to do by a time: supplier reminders, customer follow-ups (respecting the
 * account's contact rule), sales next steps, collections, delivery tasks.
 */
export const Tasks: CollectionConfig = {
  slug: "tasks",
  custom: { list: { board: "status", cardFields: ["type", "due", "owner"] } } satisfies CollectionSettings,
  admin: { useAsTitle: "title", defaultColumns: ["title", "type", "channel", "due", "owner", "status"], group: "Work" },
  defaultSort: "due",
  access: deskAccess,
  hooks: {
    beforeChange: [
      // Customer-facing follow-ups are refused for "do not chase" accounts (internal reminders only).
      async ({ data, req }) => {
        if (data.type !== "Customer follow-up" || !data.customer || data.internalOnly) return data;
        const c = (await req.payload
          .findByID({ collection: "customers", id: String(idOf(data.customer)), depth: 0 })
          .catch(() => null)) as { contactRule?: string } | null;
        if (c?.contactRule === "do-not-chase")
          throw ruleError("This customer must not be chased — create an internal reminder instead.");
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "What has to be done, in a few words.",
        placeholder: "e.g. Chase Delta Marine for RFQ 0142 prices",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            "Supplier reminder",
            "Customer follow-up",
            "Internal reminder",
            "Sales next step",
            "Collection",
            "Delivery task",
            "Clarification",
          ],
          admin: { description: "Decides who is contacted and how it is tracked.", placeholder: "Pick a task type" },
        },
        {
          name: "channel",
          type: "select",
          options: ["Email", "Call", "WhatsApp", "Site visit", "Meeting", "Internal"],
          admin: { description: "How it will be done.", placeholder: "Pick a channel" },
        },
        {
          name: "due",
          type: "date",
          required: true,
          admin: { date: { pickerAppearance: "dayAndTime" }, description: "When it must be done by." },
        },
      ],
    },
    // "Overdue" (in red), "11:00" or its day: how every list of follow-ups says when (never stored).
    computed(
      {
        name: "when",
        type: "text",
        label: "When",
        custom: { toneWhen: [{ when: { when: { equals: "Overdue" } }, tone: "error" }] },
        admin: { position: "sidebar", description: "Overdue, a time today, or the due day." },
      },
      (t) => (t.status === "Open" || !t.status ? dueLabel(t.due) : null),
    ),
    {
      type: "row",
      fields: [
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          admin: { description: "The case this task is about.", placeholder: "e.g. GS-RFQ-0142" },
        },
        {
          name: "customer",
          type: "relationship",
          relationTo: "customers",
          admin: { description: "The customer to contact, if any.", placeholder: "Search customers" },
        },
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          admin: { description: "The supplier to contact, if any.", placeholder: "Search suppliers" },
        },
        {
          name: "opportunity",
          type: "relationship",
          relationTo: "opportunities",
          admin: { description: "The sales lead this belongs to.", placeholder: "Search opportunities" },
        },
      ],
    },
    {
      name: "who",
      type: "text",
      label: "Who (person / role)",
      admin: { description: "The person or role to reach.", placeholder: "e.g. Purchasing manager" },
    },
    {
      name: "goal",
      type: "text",
      admin: { description: "What we want out of it.", placeholder: "e.g. Get a firm price by Thursday" },
    },
    {
      name: "script",
      type: "textarea",
      label: "What to say / draft",
      admin: {
        description: "Talking points or a draft message.",
        placeholder: "e.g. Ask if the quote for 40 drums of lube oil still stands.",
      },
    },
    {
      name: "internalOnly",
      type: "checkbox",
      label: "Internal only (no customer contact)",
      defaultValue: false,
      admin: { description: "Tick when nobody outside Golden Sea is contacted." },
      custom: {
        about: "Customers set to do not chase can only get internal tasks; customer follow-ups to them are refused.",
      },
    },
    {
      name: "outcome",
      type: "group",
      admin: {
        description: "How it went, once done or skipped.",
        condition: (data) => data?.status === "Done" || data?.status === "Skipped",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "result",
              type: "select",
              options: ["Reached — positive", "Reached — call back", "No answer", "Not interested", "Sent"],
              admin: { description: "How the contact went.", placeholder: "Pick an outcome" },
            },
            { name: "nextDate", type: "date", admin: { description: "When to try again, if needed." } },
          ],
        },
        {
          name: "note",
          type: "textarea",
          admin: {
            description: "What was said or decided.",
            placeholder: "e.g. Left a voicemail, will call back tomorrow.",
          },
        },
      ],
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: { position: "sidebar", description: "The person who has to do it.", placeholder: "Search users" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Open",
      options: ["Open", "Done", "Skipped", "Cancelled"],
      custom: tones({ Open: "info", Done: "success", Skipped: "neutral", Cancelled: "neutral" }),
      admin: {
        position: "sidebar",
        description: "Open until done, skipped or cancelled.",
        placeholder: "Pick a status",
      },
    },
    {
      name: "createdByRule",
      type: "text",
      admin: { position: "sidebar", readOnly: true, description: "The automation rule that created it, if any." },
    },
    {
      name: "stopCondition",
      type: "text",
      admin: {
        position: "sidebar",
        description: "When to stop the task without doing it.",
        placeholder: "e.g. Reply received or case closed",
      },
    },
  ],
};

/** The safe retry of an exception: the endpoint answers with what it did (the snackbar). */
const retry = (label: string, when: Record<string, unknown>): CollectionAction => ({
  label,
  when,
  call: { path: "/automations/retry/$row.id" },
  reply: true,
});

/** Failed integrations and uncertain automation results — nothing fails silently; retries are idempotent. */
export const IntegrationExceptions: CollectionConfig = {
  slug: "integration-exceptions",
  labels: { singular: "Exception", plural: "Exception queue" },
  admin: {
    useAsTitle: "summary",
    defaultColumns: ["occurredAt", "source", "summary", "status", "retries"],
    group: "Work",
  },
  defaultSort: "-occurredAt",
  // Wherever exceptions show: a safe retry (it checks the idempotency key first, so nothing is
  // created, imported or sent twice; on a done one it changes nothing), and for an uncertain AI
  // result, marking it reviewed under the person's name (POST /api/automations/…,
  // ../endpoints/platform.ts, which re-checks).
  custom: {
    actions: [
      retry("Safe retry", { status: { equals: "Open" } }),
      retry("Retry again", { status: { in: ["Resolved", "Auto-resolved", "Ignored"] } }),
      {
        label: "Mark reviewed",
        when: { status: { equals: "Waiting for review" } },
        call: { path: "/automations/review/$row.id", body: {} },
        confirm: {
          heading: "Mark as reviewed?",
          text: "$row.source: $row.summary\nConfirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this.",
          label: "Confirm reviewed",
        },
        done: "Reviewed — your name is on the audit log",
        reply: true,
      },
    ],
  } satisfies CollectionSettings,
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: management },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "occurredAt",
          type: "date",
          required: true,
          admin: { date: { pickerAppearance: "dayAndTime" }, description: "When the failure happened." },
        },
        {
          name: "source",
          type: "select",
          required: true,
          options: ["Outlook", "Gmail", "Website form", "AI extraction", "E-invoicing", "Automation rule", "Import"],
          admin: { description: "Which integration raised it.", placeholder: "Pick a source" },
        },
      ],
    },
    {
      name: "summary",
      type: "text",
      required: true,
      admin: { description: "What went wrong, in one line.", placeholder: "e.g. Supplier offer PDF could not be read" },
    },
    {
      name: "impact",
      type: "text",
      admin: { description: "What this blocks or delays.", placeholder: "e.g. RFQ 0142 has no comparison yet" },
    },
    {
      name: "idempotencyKey",
      type: "text",
      admin: { description: "The message or document id behind it.", placeholder: "e.g. msg-7f3a91" },
      custom: { about: "A retry checks this id first, so nothing is created or sent twice." },
    },
    {
      name: "payload",
      type: "json",
      admin: { description: "Technical detail kept for the retry." },
    },
    {
      type: "row",
      fields: [
        {
          name: "retries",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { description: "How many times it was retried.", placeholder: "e.g. 0" },
        },
        { name: "lastRetryAt", type: "date", admin: { description: "When it was last retried." } },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "Open",
      options: ["Open", "Waiting for review", "Resolved", "Auto-resolved", "Ignored"],
      custom: tones({
        Open: "error",
        "Waiting for review": "warning",
        Resolved: "success",
        "Auto-resolved": "success",
        Ignored: "neutral",
      }),
      admin: {
        position: "sidebar",
        description: "Open until retried, reviewed or ignored.",
        placeholder: "Pick a status",
      },
    },
    {
      name: "resolvedBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", description: "Who closed it.", placeholder: "Search users" },
    },
  ],
};

/** Only the signed-in user's own documents (a Payload Where-returning access function). */
const own: Access = ({ req }) => (req.user ? { user: { equals: req.user.id } } : false);

/**
 * Per-user notifications (the side panel's bell): what happened that needs this person —
 * approvals routed to them, replies on their cases, failures in their area. Each person sees
 * only their own; opening one marks it read.
 */
export const Notifications: CollectionConfig = {
  slug: "notifications",
  labels: { singular: "Notification", plural: "Notifications" },
  admin: { useAsTitle: "title", defaultColumns: ["at", "title", "kind", "read"], group: "Work" },
  defaultSort: "-at",
  access: { read: own, create: loggedIn, update: own, delete: own },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
      admin: { position: "sidebar", description: "The person who sees it in their bell.", placeholder: "Search users" },
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The headline they read first.",
        placeholder: "e.g. Quotation GS-Q-0142 needs your approval",
      },
    },
    {
      name: "detail",
      type: "text",
      admin: { description: "One more line of context.", placeholder: "e.g. Margin is below the approval threshold." },
    },
    {
      type: "row",
      fields: [
        {
          name: "kind",
          type: "select",
          required: true,
          defaultValue: "Update",
          options: ["Approval", "Reply", "Reminder", "Alert", "Payment", "Update"],
          custom: tones({ Approval: "warning", Alert: "error", Payment: "success", Reply: "info", Reminder: "info" }),
          admin: { description: "What sort of news it is.", placeholder: "Pick a kind" },
        },
        {
          name: "href",
          type: "text",
          label: "Link",
          admin: { description: "The dashboard page it opens.", placeholder: "e.g. /collections/cases/gs-rfq-0142" },
        },
      ],
    },
    {
      name: "at",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" }, description: "When it was sent." },
    },
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Set once the person has opened it." },
    },
  ],
};

/** Per-user bookmarks (the side panel's star): pages a person keeps coming back to. */
export const Bookmarks: CollectionConfig = {
  slug: "bookmarks",
  labels: { singular: "Bookmark", plural: "Bookmarks" },
  admin: { useAsTitle: "label", defaultColumns: ["label", "href"], group: "Work", hidden: true },
  defaultSort: "createdAt",
  access: { read: own, create: loggedIn, update: own, delete: own },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
      admin: { description: "The person whose list it is in.", placeholder: "Search users" },
    },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: "The name shown in the side panel.", placeholder: "e.g. Open RFQs" },
    },
    {
      name: "href",
      type: "text",
      required: true,
      admin: { description: "The dashboard page it opens.", placeholder: "e.g. /collections/cases" },
    },
  ],
};
