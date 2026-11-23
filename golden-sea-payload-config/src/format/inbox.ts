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
import { formatNumber } from "saastemlycrm-design-system/contracts";
import { createAction, notRelated, path } from "../actions/inbox.ts";
import type { InboxDetail, InboxMessage, InboxPayload } from "../endpoints/sourcing.ts";
import { m as t } from "../i18n/paraglide/messages.js";
import * as link from "../links.ts";
import { dateFormat } from "./index.ts";

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

const TIME: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", timeZone: "UTC" };
const DAY: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", timeZone: "UTC" };
const FULL: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};
/** Today's messages by their time, older ones by their day (the demo is set on 17 Nov). */
export const when = (v: string) => (v ? dateFormat(v.startsWith("2026-11-17") ? TIME : DAY).format(new Date(v)) : "");
export const full = (v: string) => (v ? dateFormat(FULL).format(new Date(v)) : "");
export const pct = (c: number) => formatNumber(Math.round(c * 100), { unit: "pct", decimals: 0 });
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
  a.manual ? t.inbox_ack_note_manual({ template: a.template }) : t.inbox_ack_note_once({ template: a.template });

/**
 * What an incoming message can be, for the on-device category suggestion (shown as the
 * suggestion, so in the interface's language).
 */
const messageKinds = () => [
  t.inbox_kind_rfq(),
  t.inbox_kind_offer(),
  t.inbox_kind_order(),
  t.inbox_kind_invoice(),
  t.inbox_kind_delivery(),
  t.inbox_kind_complaint(),
  t.inbox_kind_other(),
];

/**
 * What a supplier's reply can tell us, for "Pull out the offer details" (on the device). The
 * labels are shown; a hint guides the on-device model, so it stays in English like the prompts.
 */
const offerFields = () => [
  { id: "item", label: t.inbox_offer_item(), hint: "product, brand and part number" },
  { id: "price", label: t.inbox_offer_price(), type: "number" },
  { id: "currency", label: t.inbox_offer_currency() },
  { id: "pack", label: t.inbox_offer_pack() },
  { id: "leadTime", label: t.inbox_offer_lead_time() },
  { id: "validity", label: t.inbox_offer_validity() },
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
        options: messageKinds(),
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
        heading: t.inbox_flag_bank(),
        question: "Does this message ask to change bank account, IBAN or payment details?",
        note: t.inbox_flag_bank_note(),
      },
    },
    {
      element: "ui-ai-flag",
      key: "auto-reply",
      props: {
        text: m.body,
        tone: "info",
        heading: t.inbox_flag_auto_reply(),
        question: "Is this an automatic reply (out of office, auto-acknowledgement) rather than a written answer?",
        note: t.inbox_flag_auto_reply_note(),
      },
    },
    {
      element: "ui-ai-flag",
      key: "cannot-supply",
      props: {
        text: m.body,
        tone: "warning",
        heading: t.inbox_flag_cannot_supply(),
        question: "Does the sender say they cannot supply, quote or deliver the requested items?",
        note: t.inbox_flag_cannot_supply_note(),
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
              label: t.inbox_offer_extract(),
              what: "supplier offer or reply to a ship chandler",
              fields: offerFields(),
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
      label: t.inbox_show(),
      value: params.show ?? SHOWS.all,
      options: [
        { value: SHOWS.all, label: t.inbox_show_all() },
        { value: SHOWS.new, label: t.inbox_show_new() },
        {
          value: SHOWS.review,
          label: d.stats.review ? t.inbox_show_review_count({ count: d.stats.review }) : t.inbox_show_review(),
        },
        { value: SHOWS.linked, label: t.inbox_show_linked() },
      ],
    },
    {
      param: "order",
      label: t.inbox_order(),
      value: params.order ?? ORDERS.time,
      options: [
        { value: ORDERS.time, label: t.inbox_order_newest() },
        { value: ORDERS.urgency, label: t.inbox_order_urgent() },
      ],
    },
  ],
  items: [],
});

/** The mailboxes, form and WhatsApp the inbox reads, each with its state, and today's figures. */
export const connectedChannels = (d: InboxPayload): KindData<"text"> => ({
  tags: d.connections.map((c) => ({
    label: t.inbox_channel({ kind: c.kind.replace(" mailbox", ""), account: c.account, status: c.status }),
    tone: channelTone(c.status),
  })),
  muted: true,
  text: t.inbox_today({
    processed: d.stats.processedToday,
    duplicates: d.stats.duplicates,
    review: d.stats.review,
  }),
});

/* -------- the open message */

/**
 * The open message as received (kept as it came, with its files), with the on-device Translate
 * and "Catch me up". With no message (an empty inbox) it says so.
 */
export const originalMessage = ({ d }: Open): KindData<"message"> => {
  const m = d.message;
  if (!m) return { subject: t.inbox_pick_message(), body: "" };
  return {
    head: {
      tags: [{ label: t.inbox_kept_as_received() }],
      subhead: t.inbox_message_id({ id: m.messageId }),
    },
    tags: m.files.map((f) => ({ label: f.note ? `${f.name} · ${f.note}` : f.name, icon: "file" as const })),
    meta: [t.inbox_from({ name: m.fromName, email: m.from }), t.inbox_via({ via: m.via, when: full(m.receivedAt) })],
    subject: m.subject,
    body: m.body || t.inbox_no_text(),
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
    text: m.files.length ? t.inbox_extract_text_files() : t.inbox_extract_text(),
    actions: [{ label: t.inbox_extract(), icon: "sparkles", main: true, call: { path: path(m.id, "extract") } }],
  };
};

/**
 * What became of a message settled without a draft: an RFQ's case (or marked "not an RFQ"), or a
 * reply or forward a person marked not related, and who did.
 */
export const messageOutcome = ({ d }: Open): KindData<"text"> => {
  const m = d.message!;
  const settled = { muted: true, text: t.inbox_nothing_more() };
  if (!d.rfq)
    return {
      ...settled,
      alerts: [
        {
          tone: "info",
          text: m.match?.reviewedBy ? t.inbox_not_related_by({ by: m.match.reviewedBy }) : t.inbox_not_related(),
        },
      ],
    };
  return m.createdCase
    ? {
        ...settled,
        alerts: [{ tone: "success", text: t.inbox_case_was_created({ caseId: m.createdCase.caseId }) }],
        actions: [{ label: t.inbox_open_case(), href: link.doc("cases", m.createdCase.id) }],
      }
    : { ...settled, alerts: [{ tone: "info", text: t.inbox_not_rfq() }] };
};

/**
 * A reply or forward not matched yet: "Match reply" finds its case by the supplier-RFQ reference
 * (or a forward by its files). Below 85% a person decides.
 */
export const matchPrompt = ({ d }: Open): KindData<"text"> => ({
  muted: true,
  text: t.inbox_match_text(),
  actions: [
    { label: t.inbox_match(), icon: "sparkles", main: true, call: { path: path(d.message!.id, "match") }, reply: true },
  ],
});

/**
 * A reply or forward whose match is tried: an uncertain one waits for a person (its candidate
 * cases are in "Reply match"), a linked one says its case.
 */
const matchState = ({ d }: Open): KindData<"text"> | null => {
  const m = reply(d);
  if (m?.status === "Needs review")
    return {
      muted: true,
      text: t.inbox_match_uncertain(),
    };
  const c = m?.status === "Linked" ? m.match?.case : undefined;
  return c
    ? {
        muted: true,
        alerts: [
          {
            tone: "success",
            text: m!.match!.reviewedBy
              ? t.inbox_linked_by({ caseId: c.caseId, by: m!.match!.reviewedBy })
              : t.inbox_linked({ caseId: c.caseId }),
          },
        ],
        text: t.inbox_linked_text(),
        actions: [{ label: t.inbox_open_case(), href: link.doc("cases", c.id) }],
      }
    : null;
};

/**
 * The open message's next step, whichever applies, in one tile (so the reading pane keeps its
 * shape whichever message is open): read an RFQ into a draft case, create the case from the draft
 * (or open the one made), match a reply (or what its match is), or what became of a message
 * settled without a draft. Nothing when no message is open.
 */
export const nextStep = (o: OpenWithPeople): KindData<"text"> | null => {
  const { d } = o;
  if (!d.message) return null;
  if (unreadRfq(o)) return extractPrompt(o);
  if (draft(d)) return d.message.createdCase ? caseCreated(o) : createCase(o);
  if (settledWithoutDraft(o)) return messageOutcome(o);
  if (unmatchedReply(o)) return matchPrompt(o);
  return matchState(o);
};

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
        { label: t.inbox_ai_draft(), tone: "primary", icon: "sparkles" },
        ...(x.newCustomer ? [{ label: t.inbox_new_customer(), tone: "primary" as const }] : []),
      ],
    },
    note: t.inbox_low_confidence(),
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
    note: d.message!.createdCase
      ? t.inbox_assignment_rule({ rule: a.rule })
      : t.inbox_assignment_rule_change({ rule: a.rule }),
    items: [
      { label: t.inbox_owner(), value: a.ownerName },
      { label: t.inbox_backup(), value: a.backupName },
      { label: t.inbox_quote_deadline(), value: full(a.deadline), note: t.inbox_reminder_scheduled() },
    ],
  };
};

/** What creating the case makes (its type, customer, lines and owner), or "Not an RFQ". */
export const createCase = ({ d, users }: OpenWithPeople): KindData<"text"> => {
  const m = d.message!;
  const x = d.extraction!;
  const flagged = x.lines.filter((l) => l.flag).length;
  const actions: Action[] = [notRelated(m, t.inbox_not_an_rfq()), createAction(m, x, users)];
  const what = {
    customer: x.customerName,
    lines: x.lines.length,
    flagged,
    owner: x.assignment.ownerName,
  };
  return {
    text:
      x.caseType === "service"
        ? flagged
          ? t.inbox_create_service_flagged(what)
          : t.inbox_create_service(what)
        : flagged
          ? t.inbox_create_rfq_flagged(what)
          : t.inbox_create_rfq(what),
    actions,
  };
};

/** The case made from this message, with its next step: sending the supplier RFQs. */
export const caseCreated = ({ d }: Open): KindData<"text"> => {
  const c = d.message!.createdCase!;
  return {
    alerts: [{ tone: "success", text: t.inbox_case_created({ caseId: c.caseId }) }],
    muted: true,
    text: t.inbox_next_rfqs(),
    actions: [
      { label: t.inbox_send_rfqs(), main: true, href: link.doc("cases", c.id, "rfqs") },
      { label: t.inbox_open_case(), href: link.doc("cases", c.id) },
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
    head: { count: x.lines.length, tags: [{ label: t.inbox_ai_draft(), tone: "primary", icon: "sparkles" }] },
    alerts: x.notes.map((n) => ({ tone: "info" as const, text: n })),
    size: "sm",
    columns: [
      { key: "lineNo", label: "#" },
      { key: "item", label: t.inbox_col_item(), supporting: "original" },
      { key: "impa", label: "IMPA · ISSA", supporting: "issa" },
      { key: "partNo", label: t.inbox_col_part_no() },
      { key: "qty", label: t.inbox_col_qty(), align: "end" },
      { key: "unit", label: t.inbox_col_unit() },
      { key: "origin", label: t.inbox_col_source() },
      { key: "confidence", label: t.inbox_col_confidence() },
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
        marks: l.confidence < 0.8 ? [{ text: t.inbox_check_original(), tone: "warning" }] : undefined,
      },
    })),
  };
};

/**
 * What the draft couldn't read or found unclear, over the clarification request the AI drafted for
 * it to the sender: drafted, never sent by itself.
 */
export const clarification = ({ d }: Open): KindData<"message"> => {
  const m = d.message!;
  const x = d.extraction!;
  return {
    alerts: [{ tone: "warning", text: x.missing.join(" · ") }],
    meta: [t.inbox_to({ name: m.fromName, email: m.from })],
    subject: t.inbox_clarification_subject(),
    body: x.clarification || t.inbox_no_clarification(),
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
            ? t.inbox_ack_sent({ when: full(m.acknowledgedAt) })
            : a.manual
              ? t.inbox_ack_by_hand()
              : t.inbox_ack_on_create(),
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
