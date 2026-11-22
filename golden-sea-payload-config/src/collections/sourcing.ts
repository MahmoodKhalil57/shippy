import type { CollectionConfig, Field, PayloadRequest } from "payload";
import {
  CURRENCIES,
  SUPPLIER_RFQ_STATUSES,
  caseRef,
  computed,
  costVisible,
  deskAccess,
  evidence,
  idOf,
  logActivity,
  scalar,
} from "./shared.ts";
import { formats, tones, type CollectionSettings } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";

/** Supplier RFQ statuses still waiting on the supplier: reminders apply. */
export const OPEN_RFQ_STATUSES = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed"];
/** How many reminders go out before the case owner is alerted. */
const REMINDERS = 2;

const AT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Where an RFQ's reminders stand: how many of the two went out, and the next one, the escalation, or none. */
export function reminderState(r: Record<string, unknown>): string {
  const sent = `${Number(r.reminders) || 0} of ${REMINDERS}`;
  if (r.escalated) return `${sent} · escalated`;
  if (!OPEN_RFQ_STATUSES.includes(String(r.status))) return `${sent} · stopped`;
  return typeof r.nextReminderAt === "string" && r.nextReminderAt
    ? `${sent} · next ${AT.format(new Date(r.nextReminderAt))}`
    : sent;
}

/** How urgent a message reads (1–5): a deadline today, "asap", a complaint or a cancellation, still waiting. */
export function urgencyOf(m: Record<string, unknown>): number {
  const text = `${scalar(m.subject)}\n${scalar(m.body)}`;
  const status = scalar(m.status);
  let n = status === "Needs review" ? 3 : status === "New" ? 2 : 1;
  if (/\burgent|\basap\b|immediately|within 24\s*h|\btoday\b|tonight/i.test(text)) n += 2;
  if (/complain|cancel|\bstop\b|damaged|wrong (item|delivery)/i.test(text)) n += 2;
  return Math.min(5, n);
}

/** Below this a match waits for a person (the review queue). */
const SURE = 85;

/**
 * A confidence (stored 0–1, as the AI gives it) read as a whole percentage, worked out on read
 * from its sibling `confidence`, in a row of an array or a group too. `tonePath`, the field's path
 * in the document, gives it the confidence tones: green from 85%, amber from 60%, red under.
 */
const percentOf = (tonePath?: string, label = "Confidence"): Field => ({
  name: "confidencePct",
  type: "number",
  label,
  virtual: true,
  admin: { readOnly: true },
  custom: {
    ...formats.percent(0),
    ...(tonePath
      ? {
          toneWhen: [
            { when: { [tonePath]: { greater_than_equal: SURE } }, tone: "success" },
            { when: { [tonePath]: { greater_than_equal: 60 } }, tone: "warning" },
            { when: { [tonePath]: { exists: true } }, tone: "error" },
          ],
        }
      : {}),
  },
  hooks: {
    afterRead: [
      ({ siblingData }: { siblingData?: Record<string, unknown> }) =>
        typeof siblingData?.confidence === "number" ? Math.round(siblingData.confidence * 100) : undefined,
    ],
  },
});

/** Whether the inbox-history import is approved (its decisions are then final), read once per request. */
async function historyApproved(req: PayloadRequest): Promise<boolean> {
  const ctx = (req.context ??= {}) as { historyApproved?: Promise<boolean> };
  ctx.historyApproved ??= req.payload
    .findGlobal({ slug: "integrations" as never, depth: 0 } as never)
    .then((g) => {
      const imp = ((g as Record<string, unknown>).emailImport ?? {}) as Record<string, unknown>;
      return ["Approved", "Running", "Done"].includes(scalar(imp.status)) && Boolean(idOf(imp.approvedBy));
    })
    .catch(() => false);
  return ctx.historyApproved;
}

/** Live messages (the inbox), not the past ones the inbox-history import organised. */
const LIVE = { source: { not_equals: "History import" } };
const NEEDS_REVIEW = { ...LIVE, status: { equals: "Needs review" } };
const LINKED = { ...LIVE, status: { equals: "Linked" }, "match.case": { exists: true } };
/** A review decision (`case`: the case's id, as the records read it, populated). */
const review = (decision: "link" | "not-related", caseId?: string) => ({
  path: "/inbox/$row.id/review",
  body: caseId ? { decision, case: caseId } : { decision },
});
const HISTORY = (decision: "confirm" | "reject") => ({
  call: { path: "/inbox-history/review/$row.id", body: { decision } },
  done: decision === "confirm" ? "Proposal confirmed" : "Proposal rejected — left out of the import",
});
/** A history item a person may still decide again: until the import is approved. */
const CHANGEABLE = { source: { equals: "History import" }, "history.locked": { not_equals: true } };

/**
 * Everything that arrives: emails (Outlook / Gmail), the website quick-quote form, WhatsApp photos,
 * phone notes. Each message is classified, matched or turned into a case. `messageId` makes
 * re-processing idempotent (no duplicate cases or acknowledgements).
 */
export const IntakeMessages: CollectionConfig = {
  slug: "intake-messages",
  labels: { singular: "Intake message", plural: "Intake messages" },
  custom: {
    // What a person decides on a message, wherever it shows (the inbox, a case's supplier RFQs, the
    // history import). Below 85% nothing is linked by itself: a person picks the case, confirms the
    // reply's own guess (a new supplier's, matched by reference), or sets it aside. The endpoints
    // re-check and answer with how to take it back.
    actions: [
      {
        label: "Confirm offer",
        main: true,
        when: { ...NEEDS_REVIEW, "match.case": { exists: true } },
        call: review("link", "$row.match.case.id"),
        done: "Confirmed — your decision is in the audit log",
      },
      {
        label: "Link to $item.case.caseId ($item.confidencePct%)",
        when: NEEDS_REVIEW,
        each: "candidates",
        call: review("link", "$item.case.id"),
        done: "Linked — your decision is in the audit log",
      },
      { label: "Not related", when: NEEDS_REVIEW, call: review("not-related"), done: "Marked not related" },
      // A message linked to its case: the case, and a supplier's reply's RFQs there.
      {
        label: "Supplier RFQs",
        when: { ...LINKED, classification: { equals: "Supplier reply" } },
        href: link.doc("cases", "$row.match.case", "rfqs"),
      },
      { label: "Open $row.match.case.caseId", main: true, when: LINKED, href: link.doc("cases", "$row.match.case") },
      // The history import's uncertain items: confirmed or rejected, changeable until approved.
      { label: "Confirm", when: { ...CHANGEABLE, "history.decision": { exists: false } }, ...HISTORY("confirm") },
      { label: "Reject", when: { ...CHANGEABLE, "history.decision": { exists: false } }, ...HISTORY("reject") },
      { label: "Change", when: { ...CHANGEABLE, "history.decision": { equals: "Confirmed" } }, ...HISTORY("reject") },
      { label: "Change", when: { ...CHANGEABLE, "history.decision": { equals: "Rejected" } }, ...HISTORY("confirm") },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "fromName", "channel", "classification", "status", "receivedAt"],
    group: "Sourcing desk",
  },
  defaultSort: "-receivedAt",
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [
      // Stored, so the inbox can sort by it ("Most urgent first").
      ({ data, originalDoc }) => {
        data.urgency = urgencyOf({ ...originalDoc, ...data });
        return data;
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Message",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "channel",
                  type: "select",
                  required: true,
                  options: ["Email", "Website form", "WhatsApp", "Phone", "Customer portal"],
                },
                { name: "mailbox", type: "text", admin: { placeholder: "sales@ / purchasing@" } },
                {
                  name: "receivedAt",
                  type: "date",
                  required: true,
                  admin: { date: { pickerAppearance: "dayAndTime" } },
                },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "from", type: "text", required: true },
                { name: "fromName", type: "text" },
              ],
            },
            { name: "subject", type: "text", required: true },
            { name: "body", type: "textarea" },
            { name: "attachments", type: "upload", relationTo: "media", hasMany: true },
            {
              name: "files",
              type: "array",
              labels: { singular: "Attachment", plural: "Attachments (as received)" },
              admin: { description: "The original attachments, kept with the message." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "kind", type: "select", options: ["Excel", "PDF", "Word", "Image", "Other"] },
                    { name: "note", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "messageId",
              type: "text",
              unique: true,
              admin: {
                readOnly: true,
                description: "Mailbox message-id / form submission id — re-processing the same message is a no-op.",
              },
            },
            { name: "attachmentHash", type: "text", admin: { readOnly: true } },
            {
              name: "scenario",
              type: "text",
              admin: { hidden: true, description: "Demo: which canned AI result this message gets." },
            },
          ],
        },
        {
          label: "Extraction",
          fields: [
            {
              name: "extraction",
              type: "group",
              label: "AI draft (never applied automatically when confidence is low)",
              fields: [
                {
                  name: "header",
                  type: "array",
                  labels: { singular: "Field", plural: "Fields" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "field", type: "text", required: true },
                        { name: "value", type: "text" },
                        { name: "confidence", type: "number", min: 0, max: 1 },
                      ],
                    },
                  ],
                },
                {
                  name: "lines",
                  type: "array",
                  labels: { singular: "Line", plural: "Lines" },
                  fields: [
                    { name: "description", type: "text", required: true },
                    {
                      type: "row",
                      fields: [
                        { name: "brand", type: "text" },
                        { name: "partNo", type: "text" },
                        { name: "impa", type: "text" },
                        { name: "issa", type: "text" },
                        { name: "qty", type: "text" },
                        { name: "unit", type: "text" },
                        { name: "brandRule", type: "select", options: ["Any", "Preferred brand", "Exact brand"] },
                        { name: "confidence", type: "number", min: 0, max: 1 },
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        { name: "store", type: "text" },
                        { name: "source", type: "text", label: "Source attachment" },
                        { name: "flag", type: "text", label: "Missing / unclear" },
                      ],
                    },
                    { name: "originalText", type: "text" },
                  ],
                },
                { name: "missing", type: "array", fields: [{ name: "item", type: "text", required: true }] },
                { name: "clarification", type: "textarea", label: "Drafted clarification request (not sent)" },
                {
                  name: "assignment",
                  type: "group",
                  label: "Suggested by the assignment rules",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "owner", type: "relationship", relationTo: "users" },
                        { name: "backup", type: "relationship", relationTo: "users" },
                        { name: "deadline", type: "date" },
                      ],
                    },
                    { name: "rule", type: "text" },
                  ],
                },
                {
                  name: "acknowledgement",
                  type: "group",
                  label: "Acknowledgement draft",
                  fields: [
                    { name: "subject", type: "text" },
                    { name: "body", type: "textarea" },
                    { name: "manual", type: "checkbox", label: "Owner sends it by hand (WhatsApp / phone)" },
                  ],
                },
                { name: "model", type: "text", admin: { readOnly: true, description: "Model / version used" } },
                { name: "extractedAt", type: "date", admin: { readOnly: true } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "classification",
      type: "select",
      options: ["New RFQ", "Supplier reply", "Service request", "Duplicate", "Customer reply", "Not an RFQ"],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "New",
      options: [
        "New",
        "Needs review",
        "Linked",
        { label: "Linked · case created", value: "Case created" },
        { label: "Not related", value: "Ignored" },
      ],
      custom: tones({
        New: "info",
        "Needs review": "warning",
        Linked: "success",
        "Case created": "success",
        Ignored: "neutral",
      }),
      admin: { position: "sidebar" },
    },
    {
      name: "match",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        { name: "case", type: "relationship", relationTo: "cases" },
        { name: "supplierRfq", type: "relationship", relationTo: "supplier-rfqs" },
        { name: "reference", type: "text", label: "Reference found" },
        { name: "confidence", type: "number", min: 0, max: 1 },
        percentOf("match.confidencePct", "Match confidence"),
        { name: "basis", type: "textarea", label: "Why it matched" },
        {
          name: "candidates",
          type: "array",
          admin: { description: "Below 85% confidence a person picks the case (review queue)." },
          fields: [
            { name: "case", type: "relationship", relationTo: "cases", required: true },
            { name: "confidence", type: "number", min: 0, max: 1 },
            { name: "reason", type: "text" },
          ],
        },
        { name: "reviewedBy", type: "relationship", relationTo: "users" },
        { name: "reviewedAt", type: "date" },
      ],
    },
    // The cases a person may link an uncertain match to, each with its confidence: its "Link to…"
    // actions (`each`), read from `match.candidates` (an action repeats over a top-level array).
    computed(
      {
        name: "candidates",
        type: "array",
        label: "Candidate cases",
        admin: { position: "sidebar", condition: (data) => Boolean(data?.match?.candidates?.length) },
        fields: [
          { name: "case", type: "relationship", relationTo: "cases" },
          { name: "confidence", type: "number" },
          { name: "confidencePct", type: "number", label: "Confidence", custom: formats.percent(0) },
          { name: "reason", type: "text" },
        ],
      },
      (m) =>
        (
          ((m.match as Record<string, unknown> | undefined)?.candidates as Record<string, unknown>[] | undefined) ?? []
        ).map((c) => ({
          ...c,
          confidencePct: typeof c.confidence === "number" ? Math.round(c.confidence * 100) : undefined,
        })),
    ),
    // What a person should confirm in the offer read from a reply, a line each.
    computed(
      {
        name: "uncertain",
        type: "textarea",
        label: "To confirm",
        admin: { position: "sidebar" },
        custom: { toneWhen: [{ when: {}, tone: "warning" }] },
      },
      (m) =>
        ((m.offerDraft as { uncertain?: unknown }[] | undefined) ?? [])
          .map((d) => scalar(d.uncertain))
          .filter(Boolean)
          .join("\n"),
    ),
    {
      name: "offerDraft",
      type: "array",
      labels: { singular: "Offer line", plural: "Offer read from the reply" },
      admin: {
        position: "sidebar",
        description: "Supplier offer lines read from a reply; saved as offers once matched.",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lineNo", type: "number", required: true, min: 1 },
            { name: "price", type: "number", min: 0, access: { read: costVisible } },
            { name: "currency", type: "select", options: CURRENCIES, defaultValue: "EGP" },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "packs", type: "number", min: 0 },
            { name: "packSize", type: "number", min: 0 },
            { name: "packLabel", type: "text" },
            { name: "leadDays", type: "number", min: 0 },
            { name: "validDays", type: "number", min: 0 },
          ],
        },
        { name: "offeredDescription", type: "text" },
        { name: "uncertain", type: "text", label: "What a person should confirm" },
        { name: "confidence", type: "number", min: 0, max: 1 },
      ],
    },
    {
      name: "source",
      type: "select",
      defaultValue: "Live",
      options: ["Live", "History import"],
      admin: {
        position: "sidebar",
        description: "History import: a past email organised by the inbox-history import.",
      },
    },
    {
      name: "history",
      type: "group",
      label: "History import review",
      admin: { position: "sidebar", condition: (data) => data?.source === "History import" },
      fields: [
        {
          name: "kind",
          type: "select",
          options: ["Customer", "Vessel", "Supplier", "Price", "Confidential"],
          custom: tones({
            Customer: "neutral",
            Vessel: "info",
            Supplier: "info",
            Price: "warning",
            Confidential: "error",
          }),
        },
        { name: "question", type: "text" },
        { name: "proposal", type: "text" },
        { name: "confidence", type: "number", min: 0, max: 1 },
        percentOf(),
        {
          name: "decision",
          type: "select",
          options: ["Confirmed", "Rejected"],
          custom: tones({ Confirmed: "success", Rejected: "neutral" }),
        },
        // Once management approves the import its decisions are final (no more Change).
        {
          name: "locked",
          type: "checkbox",
          label: "Import approved",
          virtual: true,
          admin: { readOnly: true },
          hooks: { afterRead: [({ req }: { req: PayloadRequest }) => historyApproved(req)] },
        },
      ],
    },
    // How the inbox lists it: where it came from, its files, how urgent it reads.
    computed({ name: "via", type: "text", label: "Channel", admin: { position: "sidebar" } }, (m) => {
      const mailbox = scalar(m.mailbox);
      if (m.channel === "Email") return mailbox.startsWith("Gmail") ? mailbox : `Outlook · ${mailbox || "sales@"}`;
      return m.channel === "Website form" ? "Website quick-quote form" : scalar(m.channel);
    }),
    computed({ name: "fileCount", type: "text", label: "Files", admin: { position: "sidebar" } }, (m) => {
      const n = ((m.files as unknown[] | undefined) ?? []).length;
      return n ? `${n} file${n === 1 ? "" : "s"}` : "";
    }),
    {
      name: "urgency",
      type: "number",
      min: 1,
      max: 5,
      admin: { position: "sidebar", readOnly: true, description: "From its words and status (1–5)." },
    },
    computed(
      {
        name: "urgencyTag",
        type: "text",
        label: "Urgency",
        admin: { hidden: true },
        custom: { toneWhen: [{ when: { urgency: { greater_than_equal: 4 } }, tone: "warning" }] },
      },
      (m) => (Number(m.urgency) >= 3 ? `Urgency ${Number(m.urgency)}/5` : ""),
    ),
    { name: "createdCase", type: "relationship", relationTo: "cases", admin: { position: "sidebar", readOnly: true } },
    {
      name: "acknowledgedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true, description: "Set once — never acknowledged twice." },
    },
  ],
};

/** One request per supplier, anonymised: only the lines they can quote, no client identity. */
export const SupplierRfqs: CollectionConfig = {
  slug: "supplier-rfqs",
  labels: { singular: "Supplier RFQ", plural: "Supplier RFQs" },
  custom: {
    // "Remind now" while the supplier hasn't answered (POST /api/sourcing/rfqs/:id/remind). The
    // first reminder goes to the supplier: outward, so it asks first and can't be undone. The
    // second also alerts the case owner (internal), at once. Nothing once escalated twice.
    actions: [
      {
        label: "Remind now",
        when: {
          status: { in: OPEN_RFQ_STATUSES },
          or: [{ reminders: { less_than: 1 } }, { reminders: { exists: false } }],
        },
        call: { path: "/sourcing/rfqs/$row.id/remind" },
        confirm: {
          heading: "Send a reminder to $row.supplier.name?",
          text: "Reminder 1 for $row.reference goes to the supplier now, from the approved template (client hidden).",
          label: "Send reminder",
        },
        done: "$row.reference: Reminder 1 sent",
      },
      {
        label: "Remind now",
        when: {
          status: { in: OPEN_RFQ_STATUSES },
          reminders: { greater_than_equal: 1 },
          or: [{ escalated: { not_equals: true } }, { reminders: { less_than: REMINDERS } }],
        },
        call: { path: "/sourcing/rfqs/$row.id/remind" },
        done: "$row.reference: escalated to the case owner",
      },
    ],
  } satisfies CollectionSettings,
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "case", "supplier", "status", "dueAt", "reminders"],
    group: "Sourcing desk",
  },
  defaultSort: "dueAt",
  access: deskAccess,
  hooks: {
    beforeValidate: [
      // GS-SRFQ-0142-A, -B, … per case.
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data || data.reference || !data.case) return data;
        const c = (await req.payload.findByID({ collection: "cases", id: String(idOf(data.case)), depth: 0 })) as {
          caseId?: string;
        };
        const { totalDocs } = await req.payload.count({
          collection: "supplier-rfqs" as never,
          where: { case: { equals: idOf(data.case) } },
        });
        const n = String(c.caseId ?? "").replace(/\D/g, "");
        return { ...data, reference: `GS-SRFQ-${n}-${String.fromCharCode(65 + totalDocs)}` };
      },
    ],
    beforeChange: [
      // Reminders stop when the supplier answers or declines.
      ({ data }) => {
        if (["Replied", "Revised offer received", "Declined"].includes(String(data.status))) data.nextReminderAt = null;
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.seed && previousDoc?.status !== doc.status)
          await logActivity(req, {
            case: idOf(doc.case),
            text: `${doc.reference}: ${previousDoc?.status ?? "—"} → ${doc.status}.`,
          });
        return doc;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "reference", type: "text", unique: true, admin: { readOnly: true } },
        caseRef(),
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
      ],
    },
    { name: "lineNos", type: "number", hasMany: true, label: "Lines included", required: true },
    {
      type: "row",
      fields: [
        { name: "sentAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
        { name: "dueAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "reminders", type: "number", min: 0, defaultValue: 0 },
        { name: "nextReminderAt", type: "date" },
        { name: "escalated", type: "checkbox", defaultValue: false },
        // Worked out on read: how many reminders went out and what comes next (never stored).
        computed({ name: "reminderState", type: "text", label: "Reminders" }, reminderState),
      ],
    },
    { name: "lastEvent", type: "text", label: "Latest" },
    {
      type: "row",
      fields: [
        {
          name: "mode",
          type: "select",
          options: ["Split by category", "Full list"],
          defaultValue: "Split by category",
        },
        { name: "category", type: "text", admin: { description: "The category this supplier was asked for." } },
      ],
    },
    {
      name: "supplierQuestion",
      type: "textarea",
      admin: { condition: (_, s) => s?.status === "Clarification needed" },
    },
    {
      name: "anonymised",
      type: "checkbox",
      label: "Client identity & attachments removed",
      defaultValue: true,
      validate: (v: unknown) => v === true || "Supplier RFQs never carry the client's identity.",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Draft",
      options: SUPPLIER_RFQ_STATUSES,
      custom: tones({
        Draft: "neutral",
        Sent: "info",
        "Awaiting reply": "warning",
        "Partial reply": "warning",
        "Clarification needed": "warning",
        Replied: "success",
        "Revised offer received": "success",
        Declined: "neutral",
        "No response": "error",
      }),
      admin: { position: "sidebar" },
    },
    { name: "sentBy", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};

/** Supplier offers, one per line and version. Revisions supersede, never overwrite. */
export const Offers: CollectionConfig = {
  slug: "offers",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "case", "lineNo", "supplier", "price", "currency", "leadDays", "compliance"],
    group: "Sourcing desk",
  },
  access: { ...deskAccess, read: ({ req }) => Boolean(req.user) },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        const sup = data.supplier
          ? ((await req.payload
              .findByID({ collection: "suppliers", id: String(idOf(data.supplier)), depth: 0 })
              .catch(() => null)) as { name?: string } | null)
          : null;
        data.label = `L${data.lineNo ?? "?"} · ${sup?.name ?? "Supplier"} v${data.version ?? 1}`;
        // A new version supersedes the previous one (kept for audit).
        if (operation === "create" && data.supersedes) {
          await req.payload.update({
            collection: "offers" as never,
            id: String(idOf(data.supersedes)),
            data: { superseded: true } as never,
            req,
          });
        }
        return data;
      },
    ],
    afterChange: [
      // Every captured price also lands in the supplier's dated price history.
      async ({ doc, operation, req }) => {
        if (operation !== "create" || req.context?.seed || doc.source === "Own stock") return doc;
        await req.payload
          .create({
            collection: "supplier-prices" as never,
            data: {
              supplier: idOf(doc.supplier),
              product: idOf(doc.product),
              description: doc.offeredDescription,
              price: doc.price,
              currency: doc.currency,
              per: doc.packLabel ?? "EA",
              quotedAt: new Date().toISOString(),
              validUntil: doc.validUntil,
              source:
                doc.source === "Agency pricelist"
                  ? "Agency pricelist"
                  : doc.source === "WhatsApp / phone"
                    ? "WhatsApp / phone"
                    : "Case offer",
              case: idOf(doc.case),
            } as never,
            req,
          })
          .catch(() => undefined);
        return doc;
      },
    ],
  },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    {
      type: "row",
      fields: [
        caseRef(),
        { name: "lineNo", type: "number", required: true, min: 1, label: "Line #" },
        { name: "supplierRfq", type: "relationship", relationTo: "supplier-rfqs" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "supplier", type: "relationship", relationTo: "suppliers", required: true },
        { name: "product", type: "relationship", relationTo: "products" },
        { name: "version", type: "number", min: 1, defaultValue: 1 },
        { name: "supersedes", type: "relationship", relationTo: "offers" },
      ],
    },
    { name: "offeredDescription", type: "text", label: "As offered (brand / part / spec)" },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          label: "Price per pack",
          access: { read: costVisible },
        },
        { name: "currency", type: "select", options: CURRENCIES, required: true, defaultValue: "EGP" },
        { name: "discountPct", type: "number", min: 0, max: 100 },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "packs", type: "number", required: true, min: 0, label: "Packs offered" },
        { name: "packSize", type: "number", min: 0, defaultValue: 1, label: "Base units per pack" },
        { name: "packLabel", type: "text", admin: { placeholder: "100 × 500 ml" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "leadDays", type: "number", min: 0, required: true, label: "Lead time (days)" },
        { name: "validUntil", type: "date" },
        { name: "expiry", type: "text", label: "Batch expiry (YYYY-MM)" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "paymentTerms", type: "text" },
        { name: "deliveryBasis", type: "text" },
        { name: "freightEGP", type: "number", min: 0, label: "Freight (EGP)" },
      ],
    },
    {
      name: "deviations",
      type: "array",
      labels: { singular: "Deviation", plural: "Deviations" },
      admin: {
        description:
          "Wrong brand / part, missing item, quantity shortfall, spec, unit, pack size, expired validity, lead time vs ETA, shelf life.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "type",
              type: "select",
              required: true,
              options: [
                "Wrong brand / part",
                "Missing item",
                "Quantity shortfall",
                "Specification",
                "Unit",
                "Pack size",
                "Expired validity",
                "Lead time vs ETA",
                "Shelf life",
              ],
            },
            {
              name: "severity",
              type: "select",
              options: ["Blocks use", "Needs customer acceptance", "Warning"],
              defaultValue: "Warning",
            },
          ],
        },
        { name: "detail", type: "text" },
        { name: "detectedBy", type: "select", options: ["Rules", "AI", "Person"], defaultValue: "Rules" },
      ],
    },
    evidence("evidence", "Source (email, PDF, WhatsApp screenshot)"),
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "Email",
      options: ["Email", "WhatsApp / phone", "Supplier portal", "Agency pricelist", "Own stock"],
      admin: { position: "sidebar" },
    },
    {
      name: "compliance",
      type: "select",
      defaultValue: "Pending",
      options: ["Pending", "Confirmed", "Rejected", "Awaiting corrected offer"],
      admin: { position: "sidebar", description: "Technical equivalence is a human decision." },
    },
    { name: "superseded", type: "checkbox", defaultValue: false, admin: { position: "sidebar", readOnly: true } },
    {
      name: "enteredBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
    },
  ],
};
