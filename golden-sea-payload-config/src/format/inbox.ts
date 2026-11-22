import type {
  Action,
  AssistsData,
  KindData,
  Row,
  Tag,
  Tone,
  ViewBlocks,
  WidgetScope,
} from "saastemlycrm-design-system/contracts";
import { createAction, notRelated, path } from "../actions/inbox.ts";
import type { InboxDetail, InboxMessage, InboxPayload } from "../endpoints/sourcing.ts";
import * as link from "../links.ts";

/**
 * The inbox, read for the widgets that show it (../pages/inbox.ts): the message list's filters and
 * the channels, the open message as received with its on-device assists, and the open message's
 * next step (read it into a draft case, match a reply, what became of it) with the AI draft it
 * makes. The messages themselves (the list, the review queue, a person's decision on a match) are
 * the intake-messages collection's, read with no code. Plus the inbox's own formats: times,
 * confidence tags, which next step applies to the open message. Pure: data in (GET /api/inbox,
 * GET /api/inbox/message, ../endpoints/sourcing.ts), what a kind draws out.
 */

/** The message open in the reading pane (`GET /api/inbox/message`), as the page's query gives it. */
export type Open = { d: InboxDetail };
/** The open message beside the people a case can be given to (the users collection). */
export type OpenWithPeople = Open & { users: { docs: { id: string; name?: unknown }[] } };

const TIME = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const FULL = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
/** Today's messages by their time, older ones by their day (the demo is set on 17 Nov). */
export const when = (v: string) =>
  v ? (v.startsWith("2026-11-17") ? TIME.format(new Date(v)) : DAY.format(new Date(v))) : "";
export const full = (v: string) => (v ? FULL.format(new Date(v)) : "");
export const pct = (c: number) => `${Math.round(c * 100)}%`;
const confTone = (c: number): Tone => (c >= 0.85 ? "success" : c >= 0.6 ? "warning" : "error");
/** A confidence as a tag: green from 85%, amber from 60%, red under. */
export const conf = (c: number): Tag => ({ label: pct(c), tone: confTone(c) });
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** A connected channel's state: connected green, manual grey, expired or failing red, else amber. */
export const channelTone = (s: string): Tone =>
  s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";

/* -------- which next step applies to the open message */

/** An RFQ's draft case, once read. */
export const draft = (d: InboxDetail) => (d.rfq && d.message ? d.extraction : null);
/** A reply or forward (not an RFQ) in the reading pane. */
export const reply = (d: InboxDetail) => (d.message && !d.rfq ? d.message : null);
/* -------- the on-device assists on a message */

/** An on-device assist (a `custom` kind's data): its element, what tells it apart, its props. */
export type Assist = Omit<ViewBlocks["custom"], "type"> & { key: string };

/** The acknowledgement's template, and who sends it: the owner by hand, or the system once. */
export const acknowledgementNote = (a: { template: string; manual: boolean }) =>
  `Template: ${a.template}. ${a.manual ? "WhatsApp / form source: the owner sends it — the system never messages the customer by itself here." : "Sent once from the approved template — never twice, even if the email is re-processed."}`;

/** What an incoming message can be, for the on-device category suggestion. */
const MESSAGE_KINDS = [
  "New RFQ",
  "Supplier offer or reply",
  "Customer PO or order",
  "Invoice or payment query",
  "Delivery or logistics",
  "Complaint",
  "Other",
];

/** What a supplier's reply can tell us, for "Pull out the offer details" (on the device). */
const OFFER_FIELDS = [
  { id: "item", label: "Item offered", hint: "product, brand and part number" },
  { id: "price", label: "Unit price", type: "number" },
  { id: "currency", label: "Currency" },
  { id: "pack", label: "Unit / pack size" },
  { id: "leadTime", label: "Lead time" },
  { id: "validity", label: "Valid until" },
];

/** What the message is: its language and its kind. */
export function kindAssists(m: InboxMessage | null): Assist[] {
  if (!m?.body) return [];
  return [
    { element: "ui-ai-language", key: "language", props: { text: `${m.subject}\n${m.body}` } },
    {
      element: "ui-ai-classify",
      key: "kind",
      props: {
        text: `${m.subject}\n\n${m.body}`,
        options: MESSAGE_KINDS,
        what: "incoming emails and messages to a ship chandler",
      },
    },
  ];
}

/** Its warnings: a bank-detail change, an automatic reply, a supplier that can't supply. */
export function flagAssists(m: InboxMessage | null): Assist[] {
  if (!m?.body) return [];
  return [
    {
      element: "ui-ai-flag",
      key: "bank",
      props: {
        text: m.body,
        tone: "error",
        heading: "Asks to change bank or payment details",
        question: "Does this message ask to change bank account, IBAN or payment details?",
        note: "Don't act on it from the email: a bank-detail change needs two people (Finance and the CEO) and a call-back on the number already on file.",
      },
    },
    {
      element: "ui-ai-flag",
      key: "auto-reply",
      props: {
        text: m.body,
        tone: "info",
        heading: "Looks like an automatic reply",
        question: "Is this an automatic reply (out of office, auto-acknowledgement) rather than a written answer?",
        note: "It doesn't answer the request — supplier reminders keep running.",
      },
    },
    {
      element: "ui-ai-flag",
      key: "cannot-supply",
      props: {
        text: m.body,
        tone: "warning",
        heading: "The sender can't supply",
        question: "Does the sender say they cannot supply, quote or deliver the requested items?",
        note: "Look for another supplier for these lines before the deadline.",
      },
    },
  ];
}

/** What it offers: the offer details and suggested replies (from its text), and reading a file. */
export function offerAssists(m: InboxMessage | null): Assist[] {
  if (!m) return [];
  return [
    ...(m.body
      ? [
          {
            element: "ui-ai-extract" as const,
            key: "offer",
            props: {
              text: m.body,
              source: "text",
              label: "Pull out the offer details",
              what: "supplier offer or reply to a ship chandler",
              fields: OFFER_FIELDS,
            },
          },
          { element: "ui-ai-replies" as const, key: "replies", props: { text: m.body } },
        ]
      : []),
    { element: "ui-ai-read-file", key: "read-file", props: {} },
  ];
}

/**
 * Some of the on-device assists on the open message, read on the device: `kindAssists` (what it
 * is: its language and kind), `flagAssists` (its warnings), `offerAssists` (what it offers).
 */
export const messageAssists =
  (which: (m: InboxMessage | null) => Assist[]) =>
  ({ d }: Open): AssistsData => ({ items: which(d.message) });

/* -------- the message list's filters and the channels */

/** The list's filters (`?show=`): the message statuses each one lists (`status in …`). */
export const SHOWS = {
  all: "New,Needs review,Linked,Case created,Ignored",
  new: "New",
  review: "Needs review",
  linked: "Linked,Case created",
};
/** Its orders (`?order=`): newest first, or most urgent first (the messages' own `urgency`). */
export const ORDERS = { time: "-receivedAt", urgency: "-urgency,-receivedAt" };

/**
 * Which messages the list shows and in what order: the screen's `show` and `order` parameters,
 * which the message list's query reads. The review count is today's (GET /api/inbox).
 */
export const messageFilters = (d: InboxPayload, { params }: WidgetScope): KindData<"actions"> => ({
  choice: [
    {
      param: "show",
      label: "Show messages",
      value: params.show ?? SHOWS.all,
      options: [
        { value: SHOWS.all, label: "All" },
        { value: SHOWS.new, label: "New" },
        { value: SHOWS.review, label: d.stats.review ? `Needs review · ${d.stats.review}` : "Needs review" },
        { value: SHOWS.linked, label: "Linked" },
      ],
    },
    {
      param: "order",
      label: "Order",
      value: params.order ?? ORDERS.time,
      options: [
        { value: ORDERS.time, label: "Newest first" },
        { value: ORDERS.urgency, label: "Most urgent first" },
      ],
    },
  ],
  items: [],
});

/** The mailboxes, form and WhatsApp the inbox reads, each with its state, and today's figures. */
export const connectedChannels = (d: InboxPayload): KindData<"text"> => ({
  tags: d.connections.map((c) => ({
    label: `${c.kind.replace(" mailbox", "")} · ${c.account} — ${c.status}`,
    tone: channelTone(c.status),
  })),
  muted: true,
  text: `Processed today: ${d.stats.processedToday} · duplicates suppressed: ${d.stats.duplicates} · waiting for a person: ${d.stats.review}`,
});

/* -------- the open message */

/**
 * The open message as received (kept as it came, with its files), with the on-device Translate
 * and "Catch me up". With no message (an empty inbox) it says so.
 */
export const originalMessage = ({ d }: Open): KindData<"message"> => {
  const m = d.message;
  if (!m) return { subject: "Pick a message in the list.", body: "" };
  return {
    head: {
      tags: [{ label: "Kept as received" }],
      subhead: `Message id ${m.messageId} · re-processing the same message never creates a second case or acknowledgement.`,
    },
    tags: m.files.map((f) => ({ label: f.note ? `${f.name} · ${f.note}` : f.name, icon: "file" as const })),
    meta: [`From: ${m.fromName} <${m.from}>`, `Via: ${m.via} · ${full(m.receivedAt)}`],
    subject: m.subject,
    body: m.body || "(no text)",
    assist: !!m.body,
  };
};

/* -------- the open message's next step */

/** An RFQ not read into a draft yet, nor turned into a case or set aside. */
export const unreadRfq = ({ d }: Open) =>
  !!(d.rfq && d.message && !d.extraction && !d.message.createdCase && d.message.status !== "Ignored");

/**
 * Settled without a draft: an RFQ read before this draft existed (it made a case, or was set
 * aside), or a reply or forward a person marked not related.
 */
export const settledWithoutDraft = ({ d }: Open) =>
  (!!d.rfq && !!d.message && !d.extraction && (!!d.message.createdCase || d.message.status === "Ignored")) ||
  reply(d)?.status === "Ignored";

/** A reply or forward not matched yet. */
export const unmatchedReply = ({ d }: Open) => {
  const m = reply(d);
  return !!(m && m.status === "New" && !m.match);
};

/**
 * An RFQ not read yet: "Extract with AI" reads it (and its attachments) into a draft case with a
 * confidence for every value. Nothing is created until a person confirms.
 */
export const extractPrompt = ({ d }: Open): KindData<"text"> => {
  const m = d.message!;
  return {
    muted: true,
    text: `The AI reads the email${m.files.length ? " and every attachment (Excel, PDF, Word, photos)" : ""} into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every value. Nothing is created until you confirm.`,
    actions: [{ label: "Extract with AI", icon: "sparkles", main: true, call: { path: path(m.id, "extract") } }],
  };
};

/**
 * What became of a message settled without a draft: an RFQ's case (or marked "not an RFQ"), or a
 * reply or forward a person marked not related, and who did.
 */
export const messageOutcome = ({ d }: Open): KindData<"alert"> => {
  const m = d.message!;
  if (!d.rfq)
    return { tone: "info", text: `Marked not related${m.match?.reviewedBy ? ` by ${m.match.reviewedBy}` : ""}.` };
  return m.createdCase
    ? {
        tone: "success",
        text: `Case ${m.createdCase.caseId} was created from this message.`,
        actions: [{ label: "Open case", href: link.doc("cases", m.createdCase.id) }],
      }
    : { tone: "info", text: "Marked “not an RFQ”." };
};

/**
 * A reply or forward not matched yet: "Match reply" finds its case by the supplier-RFQ reference
 * (or a forward by its files). Below 85% a person decides.
 */
export const matchPrompt = ({ d }: Open): KindData<"text"> => ({
  muted: true,
  text: "Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their files. Below 85% a person decides.",
  actions: [
    { label: "Match reply", icon: "sparkles", main: true, call: { path: path(d.message!.id, "match") }, reply: true },
  ],
});

/* -------- the draft case an RFQ makes */

/**
 * The draft case's header values (customer, vessel, IMO, port, ETA…), each with its confidence:
 * the uncertain ones filled, so nobody applies them without checking.
 */
export const draftHeader = ({ d }: Open): KindData<"tiles"> => {
  const x = d.extraction!;
  return {
    head: {
      tags: [
        { label: "AI draft", tone: "primary", icon: "sparkles" },
        ...(x.newCustomer ? [{ label: "New customer", tone: "primary" as const }] : []),
      ],
    },
    note: "Low-confidence values are never applied without a person checking them.",
    look: "card",
    fit: "xs",
    items: x.header.map((f) => ({
      overline: f.field,
      heading: f.value,
      tags: [conf(f.confidence)],
      filled: f.confidence < 0.6,
    })),
  };
};

/** Who the draft case goes to and by when, as the assignment rules suggest (changed on create). */
export const draftAssignment = ({ d }: Open): KindData<"details"> => {
  const a = d.extraction!.assignment;
  return {
    note: `Suggested by the assignment rules: ${a.rule}.${d.message!.createdCase ? "" : " Change them when you create the case."}`,
    items: [
      { label: "Owner", value: a.ownerName },
      { label: "Backup", value: a.backupName },
      { label: "Quote deadline", value: full(a.deadline), note: "A reminder is scheduled before it." },
    ],
  };
};

/** What creating the case makes (its type, customer, lines and owner), or "Not an RFQ". */
export const createCase = ({ d, users }: OpenWithPeople): KindData<"text"> => {
  const m = d.message!;
  const x = d.extraction!;
  const flagged = x.lines.filter((l) => l.flag).length;
  const actions: Action[] = [notRelated(m, "Not an RFQ"), createAction(m, x, users)];
  return {
    text: `${x.caseType === "service" ? "Service case" : "RFQ case"} for ${x.customerName} with ${plural(x.lines.length, "line")}${flagged ? ` (${flagged} flagged for clarification)` : ""}, owner ${x.assignment.ownerName}. The original message stays linked to it.`,
    actions,
  };
};

/** The case made from this message, with its next step: sending the supplier RFQs. */
export const caseCreated = ({ d }: Open): KindData<"alert"> => {
  const c = d.message!.createdCase!;
  return {
    tone: "success",
    text: `Case ${c.caseId} created from this message and linked to it.`,
    actions: [
      { label: "Send supplier RFQs", main: true, href: link.doc("cases", c.id, "rfqs") },
      { label: "Open case", href: link.doc("cases", c.id) },
    ],
  };
};

/**
 * The draft's lines as read: the customer's own words beside each, IMPA / ISSA and part numbers,
 * where each came from and its confidence (under 80%: check it against the original).
 */
export const draftLines = ({ d }: Open): KindData<"table"> => {
  const x = d.extraction!;
  return {
    head: { count: x.lines.length, tags: [{ label: "AI draft", tone: "primary", icon: "sparkles" }] },
    alerts: x.notes.map((n) => ({ tone: "info" as const, text: n })),
    size: "sm",
    columns: [
      { key: "lineNo", label: "#" },
      { key: "item", label: "Item", supporting: "original" },
      { key: "impa", label: "IMPA · ISSA", supporting: "issa" },
      { key: "partNo", label: "Part no." },
      { key: "qty", label: "Qty", align: "end" },
      { key: "unit", label: "Unit" },
      { key: "origin", label: "Source" },
      { key: "confidence", label: "Confidence" },
    ],
    rows: x.lines.map((l): Row => ({
      lineNo: String(l.lineNo),
      item: {
        text: l.description,
        strong: true,
        marks: [
          ...(l.brandRule !== "Any"
            ? [{ text: `${l.brandRule}${l.brand ? ` · ${l.brand}` : ""}`, tone: "info" as const }]
            : []),
          ...(l.flag ? [{ text: `⚑ ${l.flag}`, tone: "warning" as const }] : []),
        ],
      },
      original: `“${l.originalText}”`,
      impa: { text: l.impa || "—", mono: true },
      issa: l.issa || "—",
      partNo: { text: l.partNo || "—", mono: true },
      qty: { text: String(l.qty), strong: true },
      unit: l.unit,
      origin: { text: "", tags: [{ label: l.source, icon: "file" }] },
      confidence: {
        text: "",
        tags: [conf(l.confidence)],
        marks: l.confidence < 0.8 ? [{ text: "Check against the original", tone: "warning" }] : undefined,
      },
    })),
  };
};

/** What the draft couldn't read or found unclear (the clarification request is `clarification`). */
export const draftMissing = ({ d }: Open): KindData<"alert"> => ({
  tone: "warning",
  text: d.extraction!.missing.join(" · "),
});

/**
 * The clarification request the AI drafted for what is missing or unclear (`draftMissing`), to
 * the sender: drafted, never sent by itself.
 */
export const clarification = ({ d }: Open): KindData<"message"> => {
  const m = d.message!;
  return {
    meta: [`To: ${m.fromName} <${m.from}>`],
    subject: "Clarification request — drafted, not sent",
    body: d.extraction!.clarification,
  };
};

/**
 * The acknowledgement to the customer, from the approved template: sent once on create (never
 * twice), or, for WhatsApp and the form, by the owner by hand.
 */
export const acknowledgement = ({ d }: Open): KindData<"message"> => {
  const m = d.message!;
  const a = d.extraction!.acknowledgement;
  return {
    head: {
      tags: [
        {
          label: m.acknowledgedAt
            ? `Sent once · ${full(m.acknowledgedAt)}`
            : a.manual
              ? "Send by hand"
              : "Sent once on create",
          tone: m.acknowledgedAt ? "success" : a.manual ? "warning" : "neutral",
        },
      ],
    },
    note: acknowledgementNote(a),
    meta: ["Golden Sea for Trading & Marketing"],
    subject: a.subject,
    body: a.body,
    assist: true,
  };
};
