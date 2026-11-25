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
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";

export type Open = { d: InboxDetail };
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
export function when(v: string): string {
  if (!v) return "";
  if (IS_TEMP_MOCK) {
    return dateFormat(v.startsWith("2026-11-17") ? TIME : DAY).format(new Date(v));
  } else {
    throw new TempMockError("the inbox's times: today's messages by today's date, not the demo's fixed 17 Nov");
  }
}
export const full = (v: string) => (v ? dateFormat(FULL).format(new Date(v)) : "");
export const pct = (c: number) => formatNumber(Math.round(c * 100), { unit: "pct", decimals: 0 });
const confTone = (c: number): Tone => (c >= 0.85 ? "success" : c >= 0.6 ? "warning" : "error");
export const conf = (c: number): Tag => ({ label: pct(c), tone: confTone(c) });
export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const channelTone = (s: string): Tone =>
  s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";

export const draft = (d: InboxDetail) => (d.rfq && d.message ? d.extraction : null);
export const reply = (d: InboxDetail) => (d.message && !d.rfq ? d.message : null);

export type Assist = Omit<ViewBlocks["custom"], "type"> & { key: string };

export const acknowledgementNote = (a: { template: string; manual: boolean }) =>
  a.manual ? t.inbox_ack_note_manual({ template: a.template }) : t.inbox_ack_note_once({ template: a.template });

const messageKinds = () => [
  t.inbox_kind_rfq(),
  t.inbox_kind_offer(),
  t.inbox_kind_order(),
  t.inbox_kind_invoice(),
  t.inbox_kind_delivery(),
  t.inbox_kind_complaint(),
  t.inbox_kind_other(),
];

const offerFields = () => [
  { id: "item", label: t.inbox_offer_item(), hint: "product, brand and part number" },
  { id: "price", label: t.inbox_offer_price(), type: "number" },
  { id: "currency", label: t.inbox_offer_currency() },
  { id: "pack", label: t.inbox_offer_pack() },
  { id: "leadTime", label: t.inbox_offer_lead_time() },
  { id: "validity", label: t.inbox_offer_validity() },
];

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

export const messageAssists =
  (which: (m: InboxMessage | null) => Assist[]) =>
  ({ d }: Open): AssistsData => ({ items: which(d.message) });

export const SHOWS = {
  all: "New,Needs review,Linked,Case created,Ignored",
  new: "New",
  review: "Needs review",
  linked: "Linked,Case created",
};
export const ORDERS = { time: "-receivedAt", urgency: "-urgency,-receivedAt" };

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

export const unreadRfq = ({ d }: Open) =>
  !!(d.rfq && d.message && !d.extraction && !d.message.createdCase && d.message.status !== "Ignored");

export const settledWithoutDraft = ({ d }: Open) =>
  (!!d.rfq && !!d.message && !d.extraction && (!!d.message.createdCase || d.message.status === "Ignored")) ||
  reply(d)?.status === "Ignored";

export const unmatchedReply = ({ d }: Open) => {
  const m = reply(d);
  return !!(m && m.status === "New" && !m.match);
};

export const extractPrompt = ({ d }: Open): KindData<"text"> => {
  const m = d.message!;
  return {
    muted: true,
    text: m.files.length ? t.inbox_extract_text_files() : t.inbox_extract_text(),
    actions: [{ label: t.inbox_extract(), icon: "sparkles", main: true, call: { path: path(m.id, "extract") } }],
  };
};

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

export const matchPrompt = ({ d }: Open): KindData<"text"> => ({
  muted: true,
  text: t.inbox_match_text(),
  actions: [
    { label: t.inbox_match(), icon: "sparkles", main: true, call: { path: path(d.message!.id, "match") }, reply: true },
  ],
});

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

export const nextStep = (o: OpenWithPeople): KindData<"text"> | null => {
  const { d } = o;
  if (!d.message) return null;
  if (unreadRfq(o)) return extractPrompt(o);
  if (draft(d)) return d.message.createdCase ? caseCreated(o) : createCase(o);
  if (settledWithoutDraft(o)) return messageOutcome(o);
  if (unmatchedReply(o)) return matchPrompt(o);
  return matchState(o);
};

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
