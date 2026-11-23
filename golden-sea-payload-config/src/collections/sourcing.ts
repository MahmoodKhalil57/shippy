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
  admin: { readOnly: true, description: "The same confidence as a whole percentage." },
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

/** A 0–1 confidence the AI gives, with its hint. */
const confidenceField = (hint: string): Field => ({
  name: "confidence",
  type: "number",
  min: 0,
  max: 1,
  admin: { description: hint, placeholder: "e.g. 0.92" },
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
                  admin: { description: "How the message reached us.", placeholder: "Pick a channel" },
                },
                {
                  name: "mailbox",
                  type: "text",
                  admin: {
                    description: "The shared mailbox that received it, for email.",
                    placeholder: "sales@ / purchasing@",
                  },
                },
                {
                  name: "receivedAt",
                  type: "date",
                  required: true,
                  admin: {
                    description: "When it arrived. The inbox sorts newest first.",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "from",
                  type: "text",
                  required: true,
                  admin: {
                    description: "Sender's email address or phone number.",
                    placeholder: "e.g. ops@nordictern.com",
                  },
                },
                {
                  name: "fromName",
                  type: "text",
                  admin: {
                    description: "Sender's display name, as shown in the mailbox.",
                    placeholder: "e.g. Anders Holm",
                  },
                },
              ],
            },
            {
              name: "subject",
              type: "text",
              required: true,
              admin: {
                description: "The email subject or the first line of the message.",
                placeholder: "e.g. RFQ provisions for MV Nordic Tern, Port Said",
              },
            },
            {
              name: "body",
              type: "textarea",
              admin: {
                description: "The message text, kept as received.",
                placeholder: "e.g. Please quote the attached list, delivery Port Said 14 Dec.",
              },
            },
            {
              name: "attachments",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              admin: { description: "Files that came with the message, stored in the media library." },
            },
            {
              name: "files",
              type: "array",
              labels: { singular: "Attachment", plural: "Attachments (as received)" },
              admin: { description: "The original attachments, kept with the message." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      required: true,
                      admin: { description: "The file name as received.", placeholder: "e.g. provisions-list.xlsx" },
                    },
                    {
                      name: "kind",
                      type: "select",
                      options: ["Excel", "PDF", "Word", "Image", "Other"],
                      admin: {
                        description: "The kind of file, so the AI reads it the right way.",
                        placeholder: "Pick a type",
                      },
                    },
                    {
                      name: "note",
                      type: "text",
                      admin: {
                        description: "Anything worth knowing about this file.",
                        placeholder: "e.g. Second sheet is deck stores",
                      },
                    },
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
                description:
                  "Mailbox message-id or form submission id. Processing the same message twice does nothing.",
              },
            },
            {
              name: "attachmentHash",
              type: "text",
              admin: {
                readOnly: true,
                description: "Fingerprint of the attachments, to spot the same files sent twice.",
              },
            },
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
              admin: { description: "What the AI read from the message. A person checks it before a case is built." },
              fields: [
                {
                  name: "header",
                  type: "array",
                  labels: { singular: "Field", plural: "Fields" },
                  admin: { description: "Case details the AI found, such as vessel, port and ETA." },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "field",
                          type: "text",
                          required: true,
                          admin: { description: "Which case detail this is.", placeholder: "e.g. Vessel" },
                        },
                        {
                          name: "value",
                          type: "text",
                          admin: { description: "What the AI read for it.", placeholder: "e.g. MV Nordic Tern" },
                        },
                        confidenceField("How sure the AI is, from 0 to 1."),
                      ],
                    },
                  ],
                },
                {
                  name: "lines",
                  type: "array",
                  labels: { singular: "Line", plural: "Lines" },
                  admin: { description: "The requested items the AI found, one line each." },
                  fields: [
                    {
                      name: "description",
                      type: "text",
                      required: true,
                      admin: {
                        description: "What the customer asked for.",
                        placeholder: "e.g. Fresh water hose 25 mm",
                      },
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "brand",
                          type: "text",
                          admin: { description: "Brand named in the request.", placeholder: "e.g. Gates" },
                        },
                        {
                          name: "partNo",
                          type: "text",
                          admin: { description: "Maker's part number, if given.", placeholder: "e.g. 7-11-10-8" },
                        },
                        {
                          name: "impa",
                          type: "text",
                          admin: {
                            description: "IMPA code, the marine stores catalogue number.",
                            placeholder: "e.g. 590312",
                          },
                        },
                        {
                          name: "issa",
                          type: "text",
                          admin: {
                            description: "ISSA code, used for ship cleaning and chemicals.",
                            placeholder: "e.g. 75.110.01",
                          },
                        },
                        {
                          name: "qty",
                          type: "text",
                          admin: {
                            description: "Quantity as written, before it is cleaned up.",
                            placeholder: "e.g. 12",
                          },
                        },
                        {
                          name: "unit",
                          type: "text",
                          admin: { description: "Unit as written in the request.", placeholder: "e.g. pcs" },
                        },
                        {
                          name: "brandRule",
                          type: "select",
                          options: ["Any", "Preferred brand", "Exact brand"],
                          admin: {
                            description: "How strictly the customer wants the brand.",
                            placeholder: "Pick a rule",
                          },
                          custom: {
                            about: "Exact brand means a different brand is a deviation the customer must accept.",
                          },
                        },
                        confidenceField("How sure the AI is about this line, from 0 to 1."),
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "store",
                          type: "text",
                          admin: { description: "Ship store this item belongs to.", placeholder: "e.g. Deck stores" },
                        },
                        {
                          name: "source",
                          type: "text",
                          label: "Source attachment",
                          admin: {
                            description: "The attachment this line came from.",
                            placeholder: "e.g. provisions-list.xlsx",
                          },
                        },
                        {
                          name: "flag",
                          type: "text",
                          label: "Missing / unclear",
                          admin: {
                            description: "What is missing or unclear on this line.",
                            placeholder: "e.g. No quantity given",
                          },
                        },
                      ],
                    },
                    {
                      name: "originalText",
                      type: "text",
                      admin: {
                        description: "The line exactly as the customer wrote it.",
                        placeholder: "e.g. 12x hose 25mm gates",
                      },
                    },
                  ],
                },
                {
                  name: "missing",
                  type: "array",
                  admin: { description: "Details still needed from the customer before pricing." },
                  fields: [
                    {
                      name: "item",
                      type: "text",
                      required: true,
                      admin: { description: "One missing detail.", placeholder: "e.g. Vessel ETA" },
                    },
                  ],
                },
                {
                  name: "clarification",
                  type: "textarea",
                  label: "Drafted clarification request (not sent)",
                  admin: {
                    description: "A reply asking for the missing details. A person sends it.",
                    placeholder: "e.g. Could you confirm the vessel ETA and quantities?",
                  },
                },
                {
                  name: "assignment",
                  type: "group",
                  label: "Suggested by the assignment rules",
                  admin: { description: "Who should handle the case, by the assignment rules." },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "owner",
                          type: "relationship",
                          relationTo: "users",
                          admin: { description: "Suggested case owner.", placeholder: "e.g. Karim Youssef" },
                        },
                        {
                          name: "backup",
                          type: "relationship",
                          relationTo: "users",
                          admin: { description: "Covers when the owner is away.", placeholder: "e.g. Mona Adel" },
                        },
                        {
                          name: "deadline",
                          type: "date",
                          admin: { description: "When the quote should go out, by the rules." },
                        },
                      ],
                    },
                    {
                      name: "rule",
                      type: "text",
                      admin: {
                        description: "The assignment rule that picked them.",
                        placeholder: "e.g. Port Said vessels",
                      },
                    },
                  ],
                },
                {
                  name: "acknowledgement",
                  type: "group",
                  label: "Acknowledgement draft",
                  admin: { description: "A short receipt reply for the customer. Never sent without a person." },
                  fields: [
                    {
                      name: "subject",
                      type: "text",
                      admin: {
                        description: "Subject of the receipt reply.",
                        placeholder: "e.g. RE: RFQ for MV Nordic Tern",
                      },
                    },
                    {
                      name: "body",
                      type: "textarea",
                      admin: {
                        description: "Text of the receipt reply.",
                        placeholder: "e.g. Thank you, we received your request and will quote shortly.",
                      },
                    },
                    {
                      name: "manual",
                      type: "checkbox",
                      label: "Owner sends it by hand (WhatsApp / phone)",
                      admin: { description: "Tick when the message came by WhatsApp or phone, so no email goes out." },
                    },
                  ],
                },
                { name: "model", type: "text", admin: { readOnly: true, description: "Model and version used." } },
                {
                  name: "extractedAt",
                  type: "date",
                  admin: { readOnly: true, description: "When the AI last read this message." },
                },
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
      admin: { position: "sidebar", description: "What the AI decided this message is.", placeholder: "Pick a class" },
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
      admin: { position: "sidebar", description: "Where the message is in triage.", placeholder: "Pick a status" },
    },
    {
      name: "match",
      type: "group",
      admin: { position: "sidebar", description: "Which case and supplier RFQ this message belongs to." },
      fields: [
        {
          name: "case",
          type: "relationship",
          relationTo: "cases",
          admin: { description: "The case the message was linked to.", placeholder: "e.g. GS-RFQ-0142" },
        },
        {
          name: "supplierRfq",
          type: "relationship",
          relationTo: "supplier-rfqs",
          admin: { description: "The supplier RFQ a reply answers.", placeholder: "e.g. GS-SRFQ-0142-A" },
        },
        {
          name: "reference",
          type: "text",
          label: "Reference found",
          admin: { description: "A case or RFQ reference quoted in the message.", placeholder: "e.g. GS-SRFQ-0142-A" },
        },
        confidenceField("How sure the AI is about the match, from 0 to 1."),
        percentOf("match.confidencePct", "Match confidence"),
        {
          name: "basis",
          type: "textarea",
          label: "Why it matched",
          admin: {
            description: "The reason the AI gave for the match.",
            placeholder: "e.g. Subject quotes GS-SRFQ-0142-A.",
          },
        },
        {
          name: "candidates",
          type: "array",
          admin: { description: "Cases it might belong to, when the match is unsure." },
          custom: {
            about: "Below 85% confidence nothing is linked by itself. A person picks the case in the review queue.",
          },
          fields: [
            {
              name: "case",
              type: "relationship",
              relationTo: "cases",
              required: true,
              admin: { description: "A case this message could belong to.", placeholder: "e.g. GS-RFQ-0142" },
            },
            confidenceField("How sure the AI is about this case, from 0 to 1."),
            {
              name: "reason",
              type: "text",
              admin: { description: "Why this case is a candidate.", placeholder: "e.g. Same vessel and port" },
            },
          ],
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "users",
          admin: { description: "Who made the review decision.", placeholder: "e.g. Karim Youssef" },
        },
        { name: "reviewedAt", type: "date", admin: { description: "When the review decision was made." } },
      ],
    },
    // The cases a person may link an uncertain match to, each with its confidence: its "Link to…"
    // actions (`each`), read from `match.candidates` (an action repeats over a top-level array).
    computed(
      {
        name: "candidates",
        type: "array",
        label: "Candidate cases",
        admin: {
          position: "sidebar",
          description: "Cases to link the message to, each with its confidence.",
          condition: (data) => Boolean(data?.match?.candidates?.length),
        },
        fields: [
          {
            name: "case",
            type: "relationship",
            relationTo: "cases",
            admin: { description: "A case this message could belong to.", placeholder: "e.g. GS-RFQ-0142" },
          },
          {
            name: "confidence",
            type: "number",
            admin: { description: "How sure the AI is about this case, from 0 to 1.", placeholder: "e.g. 0.72" },
          },
          {
            name: "confidencePct",
            type: "number",
            label: "Confidence",
            admin: { description: "The same confidence as a percentage.", placeholder: "e.g. 72" },
            custom: formats.percent(0),
          },
          {
            name: "reason",
            type: "text",
            admin: { description: "Why this case is a candidate.", placeholder: "e.g. Same vessel and port" },
          },
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
        admin: { position: "sidebar", description: "What a person should confirm in the offer read from the reply." },
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
        description: "Supplier offer lines read from a reply, saved as offers once matched.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "lineNo",
              type: "number",
              required: true,
              min: 1,
              admin: { description: "The RFQ line this price answers.", placeholder: "e.g. 3" },
            },
            {
              name: "price",
              type: "number",
              min: 0,
              access: { read: costVisible },
              admin: { description: "The supplier's price per pack, as read.", placeholder: "e.g. 1250" },
            },
            {
              name: "currency",
              type: "select",
              options: CURRENCIES,
              defaultValue: "EGP",
              admin: { description: "Currency the supplier quoted in.", placeholder: "Pick a currency" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "packs",
              type: "number",
              min: 0,
              admin: { description: "How many packs the supplier offers.", placeholder: "e.g. 12" },
            },
            {
              name: "packSize",
              type: "number",
              min: 0,
              admin: { description: "Base units in one pack.", placeholder: "e.g. 100" },
            },
            {
              name: "packLabel",
              type: "text",
              admin: { description: "How the pack is described.", placeholder: "e.g. 100 × 500 ml" },
            },
            {
              name: "leadDays",
              type: "number",
              min: 0,
              admin: { description: "Days from order to delivery.", placeholder: "e.g. 5" },
            },
            {
              name: "validDays",
              type: "number",
              min: 0,
              admin: { description: "Days the price stays valid.", placeholder: "e.g. 14" },
            },
          ],
        },
        {
          name: "offeredDescription",
          type: "text",
          admin: { description: "The item as the supplier describes it.", placeholder: "e.g. Gates hose 25 mm, 10 m" },
        },
        {
          name: "uncertain",
          type: "text",
          label: "What a person should confirm",
          admin: {
            description: "What the AI was unsure about on this line.",
            placeholder: "e.g. Is the price per pack or per unit?",
          },
        },
        confidenceField("How sure the AI is about this line, from 0 to 1."),
      ],
    },
    {
      name: "source",
      type: "select",
      defaultValue: "Live",
      options: ["Live", "History import"],
      admin: {
        position: "sidebar",
        description: "History import means a past email organised by the inbox-history import.",
        placeholder: "Pick a source",
      },
    },
    {
      name: "history",
      type: "group",
      label: "History import review",
      admin: {
        position: "sidebar",
        description: "What the import found in a past email, for a person to confirm.",
        condition: (data) => data?.source === "History import",
      },
      fields: [
        {
          name: "kind",
          type: "select",
          options: ["Customer", "Vessel", "Supplier", "Price", "Confidential"],
          admin: { description: "What kind of fact the import found.", placeholder: "Pick a kind" },
          custom: tones({
            Customer: "neutral",
            Vessel: "info",
            Supplier: "info",
            Price: "warning",
            Confidential: "error",
          }),
        },
        {
          name: "question",
          type: "text",
          admin: {
            description: "What the import is asking a person to check.",
            placeholder: "e.g. Is Delta Marine Stores a supplier?",
          },
        },
        {
          name: "proposal",
          type: "text",
          admin: {
            description: "What the import proposes to record.",
            placeholder: "e.g. Add Delta Marine Stores as supplier",
          },
        },
        confidenceField("How sure the import is, from 0 to 1."),
        percentOf(),
        {
          name: "decision",
          type: "select",
          options: ["Confirmed", "Rejected"],
          admin: { description: "A person's decision on the proposal.", placeholder: "Pick a decision" },
          custom: tones({ Confirmed: "success", Rejected: "neutral" }),
        },
        // Once management approves the import its decisions are final (no more Change).
        {
          name: "locked",
          type: "checkbox",
          label: "Import approved",
          virtual: true,
          admin: { readOnly: true, description: "Once management approves the import, decisions are final." },
          hooks: { afterRead: [({ req }: { req: PayloadRequest }) => historyApproved(req)] },
        },
      ],
    },
    // How the inbox lists it: where it came from, its files, how urgent it reads.
    computed(
      {
        name: "via",
        type: "text",
        label: "Channel",
        admin: { position: "sidebar", description: "Where the message came from." },
      },
      (m) => {
        const mailbox = scalar(m.mailbox);
        if (m.channel === "Email") return mailbox.startsWith("Gmail") ? mailbox : `Outlook · ${mailbox || "sales@"}`;
        return m.channel === "Website form" ? "Website quick-quote form" : scalar(m.channel);
      },
    ),
    computed(
      {
        name: "fileCount",
        type: "text",
        label: "Files",
        admin: { position: "sidebar", description: "How many files came with it." },
      },
      (m) => {
        const n = ((m.files as unknown[] | undefined) ?? []).length;
        return n ? `${n} file${n === 1 ? "" : "s"}` : "";
      },
    ),
    {
      name: "urgency",
      type: "number",
      min: 1,
      max: 5,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "How urgent it reads, from 1 to 5, by its words and status.",
      },
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
    {
      name: "createdCase",
      type: "relationship",
      relationTo: "cases",
      admin: { position: "sidebar", readOnly: true, description: "The case built from this message, if any." },
    },
    {
      name: "acknowledgedAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Set once, so a customer is never acknowledged twice.",
      },
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
        {
          name: "reference",
          type: "text",
          unique: true,
          admin: { readOnly: true, description: "Numbered per case, such as GS-SRFQ-0142-A." },
        },
        caseRef(true, { hint: "The customer case this supplier request is for." }),
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          admin: { description: "The supplier asked to quote.", placeholder: "e.g. Delta Marine Stores" },
        },
      ],
    },
    {
      name: "lineNos",
      type: "number",
      hasMany: true,
      label: "Lines included",
      required: true,
      admin: { description: "Case line numbers sent to this supplier.", placeholder: "e.g. 1, 2, 5" },
    },
    {
      type: "row",
      fields: [
        {
          name: "sentAt",
          type: "date",
          admin: { description: "When the request went to the supplier.", date: { pickerAppearance: "dayAndTime" } },
        },
        {
          name: "dueAt",
          type: "date",
          required: true,
          admin: { description: "When we need the supplier's answer by.", date: { pickerAppearance: "dayAndTime" } },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "reminders",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { description: "How many reminders went to the supplier.", placeholder: "e.g. 1" },
          custom: { about: "Two reminders go out. After that the case owner is alerted." },
        },
        {
          name: "nextReminderAt",
          type: "date",
          admin: { description: "When the next reminder is due." },
        },
        {
          name: "escalated",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Ticked once the case owner has been alerted." },
        },
        // Worked out on read: how many reminders went out and what comes next (never stored).
        computed(
          {
            name: "reminderState",
            type: "text",
            label: "Reminders",
            admin: { description: "Reminders sent and what comes next." },
          },
          reminderState,
        ),
      ],
    },
    {
      name: "lastEvent",
      type: "text",
      label: "Latest",
      admin: {
        description: "The most recent thing that happened on this request.",
        placeholder: "e.g. Supplier replied by email",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "mode",
          type: "select",
          options: ["Split by category", "Full list"],
          defaultValue: "Split by category",
          admin: {
            description: "Whether the supplier gets the whole list or only their category.",
            placeholder: "Pick a mode",
          },
        },
        {
          name: "category",
          type: "text",
          admin: { description: "The category this supplier was asked for.", placeholder: "e.g. Deck stores" },
        },
      ],
    },
    {
      name: "supplierQuestion",
      type: "textarea",
      admin: {
        description: "What the supplier asked us to clarify.",
        placeholder: "e.g. Is the hose with or without couplings?",
        condition: (_, s) => s?.status === "Clarification needed",
      },
    },
    {
      name: "anonymised",
      type: "checkbox",
      label: "Client identity & attachments removed",
      defaultValue: true,
      admin: { description: "Always on. The supplier never sees who the customer is." },
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
      admin: {
        position: "sidebar",
        description: "Where the request stands with the supplier.",
        placeholder: "Pick a status",
      },
    },
    {
      name: "sentBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", description: "Who sent the request.", placeholder: "e.g. Karim Youssef" },
    },
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
        caseRef(true, { hint: "The customer case this offer prices." }),
        {
          name: "lineNo",
          type: "number",
          required: true,
          min: 1,
          label: "Line #",
          admin: { description: "The case line this offer answers.", placeholder: "e.g. 3" },
        },
        {
          name: "supplierRfq",
          type: "relationship",
          relationTo: "supplier-rfqs",
          admin: { description: "The supplier request this offer replies to.", placeholder: "e.g. GS-SRFQ-0142-A" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "supplier",
          type: "relationship",
          relationTo: "suppliers",
          required: true,
          admin: { description: "Who made the offer.", placeholder: "e.g. Delta Marine Stores" },
        },
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          admin: { description: "The catalogue product this matches, if known.", placeholder: "Search products" },
        },
        {
          name: "version",
          type: "number",
          min: 1,
          defaultValue: 1,
          admin: { description: "Revision number, 1 for the first offer.", placeholder: "e.g. 1" },
        },
        {
          name: "supersedes",
          type: "relationship",
          relationTo: "offers",
          admin: { description: "The earlier offer this revision replaces.", placeholder: "Search offers" },
          custom: { about: "A revision replaces the earlier offer, which is kept for audit and marked superseded." },
        },
      ],
    },
    {
      name: "offeredDescription",
      type: "text",
      label: "As offered (brand / part / spec)",
      admin: { description: "The item as the supplier describes it.", placeholder: "e.g. Gates hose 25 mm, 10 m" },
    },
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
          admin: { description: "The supplier's price for one pack, before freight.", placeholder: "e.g. 1250" },
        },
        {
          name: "currency",
          type: "select",
          options: CURRENCIES,
          required: true,
          defaultValue: "EGP",
          admin: { description: "Currency the supplier quoted in.", placeholder: "Pick a currency" },
        },
        {
          name: "discountPct",
          type: "number",
          min: 0,
          max: 100,
          admin: { description: "Discount the supplier gave, in percent.", placeholder: "e.g. 5" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "packs",
          type: "number",
          required: true,
          min: 0,
          label: "Packs offered",
          admin: { description: "How many packs the supplier can supply.", placeholder: "e.g. 12" },
        },
        {
          name: "packSize",
          type: "number",
          min: 0,
          defaultValue: 1,
          label: "Base units per pack",
          admin: { description: "Units in one pack, to compare with the quantity asked.", placeholder: "e.g. 100" },
        },
        {
          name: "packLabel",
          type: "text",
          admin: { description: "How the pack is described by the supplier.", placeholder: "100 × 500 ml" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "leadDays",
          type: "number",
          min: 0,
          required: true,
          label: "Lead time (days)",
          admin: { description: "Days from order to delivery. Checked against the vessel ETA.", placeholder: "e.g. 5" },
        },
        {
          name: "validUntil",
          type: "date",
          admin: { description: "The last day the price holds." },
        },
        {
          name: "expiry",
          type: "text",
          label: "Batch expiry (YYYY-MM)",
          admin: { description: "Expiry of the batch offered, for shelf life checks.", placeholder: "e.g. 2027-06" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "paymentTerms",
          type: "text",
          admin: { description: "When the supplier wants to be paid.", placeholder: "e.g. 30 days from invoice" },
        },
        {
          name: "deliveryBasis",
          type: "text",
          admin: { description: "Where the supplier delivers to.", placeholder: "e.g. Ex warehouse Port Said" },
        },
        {
          name: "freightEGP",
          type: "number",
          min: 0,
          label: "Freight (EGP)",
          admin: { description: "Freight the supplier charges on top, in EGP.", placeholder: "e.g. 800" },
        },
      ],
    },
    {
      name: "deviations",
      type: "array",
      labels: { singular: "Deviation", plural: "Deviations" },
      admin: { description: "Where the offer differs from what the customer asked." },
      custom: {
        about:
          "Wrong brand or part, missing item, quantity shortfall, spec, unit, pack size, expired validity, lead time vs ETA, shelf life. Some block use, others need the customer's acceptance.",
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
              admin: { description: "What kind of difference it is.", placeholder: "Pick a type" },
            },
            {
              name: "severity",
              type: "select",
              options: ["Blocks use", "Needs customer acceptance", "Warning"],
              defaultValue: "Warning",
              admin: { description: "How much it matters for the quote.", placeholder: "Pick a severity" },
            },
          ],
        },
        {
          name: "detail",
          type: "text",
          admin: { description: "What exactly differs.", placeholder: "e.g. Offered 20 mm, asked 25 mm" },
        },
        {
          name: "detectedBy",
          type: "select",
          options: ["Rules", "AI", "Person"],
          defaultValue: "Rules",
          admin: { description: "Who spotted it.", placeholder: "Pick a source" },
        },
      ],
    },
    evidence("evidence", "Source (email, PDF, WhatsApp screenshot)"),
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "Email",
      options: ["Email", "WhatsApp / phone", "Supplier portal", "Agency pricelist", "Own stock"],
      admin: { position: "sidebar", description: "Where the price came from.", placeholder: "Pick a source" },
    },
    {
      name: "compliance",
      type: "select",
      defaultValue: "Pending",
      options: ["Pending", "Confirmed", "Rejected", "Awaiting corrected offer"],
      admin: {
        position: "sidebar",
        description: "Whether the offer meets the request. A person decides.",
        placeholder: "Pick a status",
      },
      custom: { about: "Technical equivalence is a human decision, never the AI's." },
    },
    {
      name: "superseded",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", readOnly: true, description: "Set when a newer version replaces this offer." },
    },
    {
      name: "enteredBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", description: "Who captured this offer.", placeholder: "e.g. Karim Youssef" },
      defaultValue: ({ user }: { user?: { id?: string } }) => user?.id,
    },
  ],
};
