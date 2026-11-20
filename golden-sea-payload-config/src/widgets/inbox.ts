import {
  assist,
  block,
  type Action,
  type ListItem,
  type PromptField,
  type Row,
  type Tag,
  type Tone,
  type ViewBlock,
} from "saastemlycrm-design-system/contracts";
import {
  from,
  widgets,
  type DrawingWidget,
  type Source,
  type Widget,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import type { ExtractionResult, InboxDetail, InboxMessage, InboxPayload } from "../endpoints/sourcing.ts";
import { SIMULATED_FORWARD, SIMULATED_REPLY, SIMULATED_RFQ } from "../endpoints/sourcing-data.ts";
import * as link from "../links.ts";

/**
 * Inbox (`/inbox`): every channel in one list — Outlook and Gmail mailboxes, the website
 * quick-quote form, WhatsApp forwards — as master and detail. The side column lists the messages
 * (filter and order are screen parameters) and the review queue; clicking one sets `?message=`,
 * and the reading pane's widgets load it from `GET /api/inbox/message?id=` (the newest when none
 * is picked): the original as received with the on-device assists, "Extract with AI" into a draft
 * case with a confidence per value, the owner, backup and deadline, "Create the case", or the
 * reply matching and review decisions. Data and actions: /api/inbox (../endpoints/sourcing.ts);
 * the people a case can be given to: the `users` collection.
 */

const inbox: Source = { endpoint: "/inbox" };
const detail: Source = {
  all: {
    d: { endpoint: "/inbox/message", query: { id: "$param.message" } },
    users: { find: "users", sort: "name", limit: 0, depth: 0, select: { name: true } },
  },
};
type Detail = { d: InboxDetail; users: { docs: { id: string; name?: unknown }[] } };

const simulate = (kind: "rfq" | "forward" | "reply", label: string, done: string, primary = false): Action => ({
  label,
  icon: primary ? "mail" : undefined,
  main: primary,
  call: { path: "/inbox/simulate", body: { kind } },
  done,
  // The endpoint's `href` (`?message=<new id>`) opens the new message.
  reply: true,
});

/* ------------------------------------------------------------------ formats */

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
const when = (v: string) =>
  v ? (v.startsWith("2026-11-17") ? TIME.format(new Date(v)) : DAY.format(new Date(v))) : "";
const full = (v: string) => (v ? FULL.format(new Date(v)) : "");
const pct = (c: number) => `${Math.round(c * 100)}%`;
const confTone = (c: number): Tone => (c >= 0.85 ? "success" : c >= 0.6 ? "warning" : "error");
const conf = (c: number): Tag => ({ label: pct(c), tone: confTone(c) });
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const path = (id: string, step: string) => `/inbox/${encodeURIComponent(id)}/${step}`;

const STATUS: Record<string, [Tone, string]> = {
  New: ["info", "New"],
  "Needs review": ["warning", "Needs review"],
  Linked: ["success", "Linked"],
  "Case created": ["success", "Linked · case created"],
  Ignored: ["neutral", "Not related"],
};

function channelLabel(m: InboxMessage) {
  if (m.channel === "Email") return m.mailbox.startsWith("Gmail") ? m.mailbox : `Outlook · ${m.mailbox || "sales@"}`;
  if (m.channel === "WhatsApp") return "WhatsApp";
  if (m.channel === "Website form") return "Website quick-quote form";
  return m.channel;
}
const channelIcon = (m: InboxMessage) =>
  m.channel === "WhatsApp" ? "chat" : m.channel === "Website form" ? "link" : m.channel === "Phone" ? "phone" : "mail";

/** The message open in the reading pane: the one picked, else the newest. */
const openId = (messages: InboxMessage[], scope: WidgetScope) => scope.params.message || messages[0]?.id || "";

/* ------------------------------------------------------------------ side: list and review queue */

const channelTone = (s: string): Tone =>
  s === "Connected" ? "success" : s === "Manual" ? "neutral" : /expired|error/i.test(s) ? "error" : "warning";

const channels: Widget<InboxPayload> = {
  title: "Connected channels",
  size: "s",
  skeleton: "text",
  source: inbox,
  render: (d) => [
    block("tags", {
      items: d.connections.map((c) => ({
        label: `${c.kind.replace(" mailbox", "")} · ${c.account} — ${c.status}`,
        tone: channelTone(c.status),
      })),
    }),
    block("text", {
      muted: true,
      text: `Processed today: ${d.stats.processedToday} · duplicates suppressed: ${d.stats.duplicates} · waiting for a person: ${d.stats.review}`,
    }),
  ],
};

const SHOWS: Record<string, (m: InboxMessage) => boolean> = {
  all: () => true,
  new: (m) => m.status === "New",
  review: (m) => m.status === "Needs review",
  linked: (m) => ["Linked", "Case created"].includes(m.status),
};

const messageItem = (m: InboxMessage, open: string): ListItem => {
  const [tone, label] = STATUS[m.status] ?? ["neutral", m.status];
  const tags: Tag[] = [
    { label, tone },
    { label: channelLabel(m), icon: channelIcon(m) },
  ];
  if (m.files.length) tags.push({ label: plural(m.files.length, "file") });
  if (m.urgency >= 3) tags.push({ label: `Urgency ${m.urgency}/5`, tone: m.urgency >= 4 ? "warning" : undefined });
  return {
    headline: m.fromName || m.from,
    supporting: m.subject,
    trailing: when(m.receivedAt),
    tags,
    select: { param: "message", value: m.id },
    selected: m.id === open,
  };
};

const list: Widget<InboxPayload> = {
  title: "Messages",
  size: "s",
  skeleton: "list",
  source: inbox,
  head: (d) => ({ count: d.messages.length }),
  render: (d, scope) => {
    const show = SHOWS[scope.params.show ?? ""] ? (scope.params.show as string) : "all";
    let visible = d.messages.filter(SHOWS[show]!);
    if (scope.params.order === "urgency") visible = [...visible].sort((a, b) => b.urgency - a.urgency);
    const open = openId(d.messages, scope);
    return [
      block("choice", {
        param: "show",
        label: "Show messages",
        value: "all",
        options: [
          { value: "all", label: "All" },
          { value: "new", label: "New" },
          { value: "review", label: d.stats.review ? `Needs review · ${d.stats.review}` : "Needs review" },
          { value: "linked", label: "Linked" },
        ],
      }),
      block("choice", {
        param: "order",
        label: "Order",
        value: "time",
        options: [
          { value: "time", label: "Newest first" },
          { value: "urgency", label: "Most urgent first" },
        ],
      }),
      block("list", { variant: "separated", empty: "Nothing here.", items: visible.map((m) => messageItem(m, open)) }),
    ];
  },
};

const reviewQueue: Widget<InboxPayload> = {
  title: "Review queue",
  size: "s",
  skeleton: "list",
  source: inbox,
  head: (d) => ({ count: d.stats.review, countTone: d.stats.review ? "warning" : "success" }),
  render: (d, scope) => {
    const queue = d.messages.filter((m) => m.status === "Needs review");
    const open = openId(d.messages, scope);
    return [
      block("text", {
        muted: true,
        text: "Matches below 85% confidence are never linked automatically — a person picks the case.",
      }),
      block("list", {
        empty: "Nothing waiting — every reply is matched.",
        items: queue.map((m) => ({
          headline: m.subject,
          supporting: `${m.fromName} · ${m.match ? pct(m.match.confidence) : "no match"}`,
          dot: "warning" as const,
          select: { param: "message", value: m.id },
          selected: m.id === open,
        })),
      }),
    ];
  },
};

/* ------------------------------------------------------------------ reading pane */

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

/** The on-device assists on a message: category, warnings, offer details, short replies. */
function assists(m: InboxMessage): ViewBlock[] {
  if (!m.body) return [];
  const text = `${m.subject}\n\n${m.body}`;
  return [
    assist("ui-ai-language", "language", { text: `${m.subject}\n${m.body}` }),
    assist("ui-ai-classify", "kind", {
      text,
      options: MESSAGE_KINDS,
      what: "incoming emails and messages to a ship chandler",
    }),
    assist("ui-ai-flag", "bank", {
      text: m.body,
      tone: "error",
      heading: "Asks to change bank or payment details",
      question: "Does this message ask to change bank account, IBAN or payment details?",
      note: "Don't act on it from the email: a bank-detail change needs two people (Finance and the CEO) and a call-back on the number already on file.",
    }),
    assist("ui-ai-flag", "auto-reply", {
      text: m.body,
      tone: "info",
      heading: "Looks like an automatic reply",
      question: "Is this an automatic reply (out of office, auto-acknowledgement) rather than a written answer?",
      note: "It doesn't answer the request — supplier reminders keep running.",
    }),
    assist("ui-ai-flag", "cannot-supply", {
      text: m.body,
      tone: "warning",
      heading: "The sender can't supply",
      question: "Does the sender say they cannot supply, quote or deliver the requested items?",
      note: "Look for another supplier for these lines before the deadline.",
    }),
    assist("ui-ai-extract", "offer", {
      text: m.body,
      source: "text",
      label: "Pull out the offer details",
      what: "supplier offer or reply to a ship chandler",
      fields: OFFER_FIELDS,
    }),
    assist("ui-ai-replies", "replies", { text: m.body }),
  ];
}

/** A reading-pane widget: the open message's detail, shown while `show` says so. */
const onDetail = from<Detail>(detail);
const pane = ({ show, ...w }: Omit<DrawingWidget<Detail>, "source"> & { show?: (d: InboxDetail) => unknown }) =>
  onDetail({
    skeleton: "text",
    ...w,
    hidden: (data: Detail, scope: WidgetScope) => (show ? !show(data.d) : false) || !!w.hidden?.(data, scope),
  });

const nothingOpen = pane({
  title: "No message selected",
  size: "s",
  show: (d) => !d.message,
  render: () => block("text", { muted: true, text: "Pick a message in the list." }),
});

const original = pane({
  title: "Original message",
  // `m`: beside the message list (`s`) on a 3-lane board, master and detail together.
  size: "m",
  skeleton: "card",
  show: (d) => d.message,
  head: () => ({ tags: [{ label: "Kept as received" }] }),
  render: ({ d }) => {
    const m = d.message!;
    return [
      block("message", {
        meta: [`From: ${m.fromName} <${m.from}>`, `Via: ${channelLabel(m)} · ${full(m.receivedAt)}`],
        subject: m.subject,
        body: m.body || "(no text)",
        assist: !!m.body,
      }),
      ...(m.files.length
        ? [
            block("tags", {
              items: m.files.map((f) => ({ label: f.note ? `${f.name} · ${f.note}` : f.name, icon: "file" })),
            }),
          ]
        : []),
      ...assists(m),
      assist("ui-ai-read-file", "read-file", {}),
      block("text", {
        muted: true,
        text: `Message id ${m.messageId} · re-processing the same message never creates a second case or acknowledgement.`,
      }),
    ];
  },
});

/* -------- an RFQ: extract → draft → create */

const draft = (d: InboxDetail) => (d.rfq && d.message ? d.extraction : null);

const extractPrompt = pane({
  title: "Read it into a draft case",
  size: "s",
  show: (d) => d.rfq && d.message && !d.extraction && !d.message.createdCase && d.message.status !== "Ignored",
  render: ({ d }) => {
    const m = d.message!;
    return [
      block("text", {
        muted: true,
        text: `The AI reads the email${m.files.length ? " and every attachment (Excel, PDF, Word, photos)" : ""} into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every value. Nothing is created until you confirm.`,
      }),
      block("actions", {
        items: [{ label: "Extract with AI", icon: "sparkles", main: true, call: { path: path(m.id, "extract") } }],
      }),
    ];
  },
});

/** An RFQ read before this draft existed, or set aside: what became of it. */
const rfqOutcome = pane({
  title: "Outcome",
  size: "s",
  show: (d) => d.rfq && d.message && !d.extraction && (d.message.createdCase || d.message.status === "Ignored"),
  render: ({ d }) => {
    const m = d.message!;
    return m.createdCase
      ? block("alert", {
          tone: "success",
          text: `Case ${m.createdCase.caseId} was created from this message.`,
          actions: [{ label: "Open case", href: link.doc("cases", m.createdCase.id) }],
        })
      : block("alert", { tone: "info", text: "Marked “not an RFQ”." });
  },
});

const draftHeader = pane({
  title: "Draft case",
  size: "m",
  show: draft,
  head: ({ d }) => ({
    tags: [
      { label: "AI draft", tone: "primary", icon: "sparkles" },
      ...(d.extraction!.newCustomer ? [{ label: "New customer", tone: "primary" as const }] : []),
    ],
  }),
  render: ({ d }) => [
    block("text", {
      muted: true,
      text: "Low-confidence values are never applied without a person checking them.",
    }),
    block("tiles", {
      look: "card",
      fit: "xs",
      items: d.extraction!.header.map((f) => ({
        overline: f.field,
        heading: f.value,
        tags: [conf(f.confidence)],
        filled: f.confidence < 0.6,
      })),
    }),
  ],
});

const draftLines = pane({
  title: "Draft lines",
  size: "l",
  skeleton: "table",
  show: (d) => draft(d)?.lines.length,
  head: ({ d }) => ({
    count: d.extraction!.lines.length,
    tags: [{ label: "AI draft", tone: "primary", icon: "sparkles" }],
  }),
  render: ({ d }) => {
    const x = d.extraction!;
    const rows: Row[] = x.lines.map((l) => ({
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
      source: { text: "", tags: [{ label: l.source, icon: "file" }] },
      confidence: {
        text: "",
        tags: [conf(l.confidence)],
        marks: l.confidence < 0.8 ? [{ text: "Check against the original", tone: "warning" }] : undefined,
      },
    }));
    return [
      block("table", {
        size: "sm",
        columns: [
          { key: "lineNo", label: "#" },
          { key: "item", label: "Item", supporting: "original" },
          { key: "impa", label: "IMPA · ISSA", supporting: "issa" },
          { key: "partNo", label: "Part no." },
          { key: "qty", label: "Qty", align: "end" },
          { key: "unit", label: "Unit" },
          { key: "source", label: "Source" },
          { key: "confidence", label: "Confidence" },
        ],
        rows,
      }),
      ...x.notes.map((n) => block("alert", { tone: "info", text: n })),
    ];
  },
});

const missing = pane({
  title: "Missing or unclear",
  size: "l",
  show: (d) => draft(d)?.missing.length,
  render: ({ d }) => {
    const x = d.extraction!;
    const m = d.message!;
    return [
      block("alert", { tone: "warning", text: x.missing.join(" · ") }),
      ...(x.clarification
        ? [
            block("message", {
              meta: [`To: ${m.fromName} <${m.from}>`],
              subject: "Clarification request — drafted, not sent",
              body: x.clarification,
            }),
          ]
        : []),
    ];
  },
});

const assignment = pane({
  title: "Owner, backup and deadline",
  size: "s",
  show: draft,
  render: ({ d }) => {
    const a = d.extraction!.assignment;
    return [
      block("text", { muted: true, text: `Suggested by the assignment rules: ${a.rule}.` }),
      block("details", {
        items: [
          { label: "Owner", value: a.ownerName },
          { label: "Backup", value: a.backupName },
          { label: "Quote deadline", value: full(a.deadline), note: "A reminder is scheduled before it." },
        ],
      }),
      ...(d.message!.createdCase
        ? []
        : [block("text", { muted: true, text: "Change them when you create the case." })]),
    ];
  },
});

const acknowledgement = pane({
  title: "Acknowledgement draft",
  size: "l",
  show: draft,
  head: ({ d }) => {
    const m = d.message!;
    const a = d.extraction!.acknowledgement;
    return {
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
    };
  },
  render: ({ d }) => {
    const a = d.extraction!.acknowledgement;
    return [
      block("message", {
        meta: ["Golden Sea for Trading & Marketing"],
        subject: a.subject,
        body: a.body,
        assist: true,
      }),
      block("text", {
        muted: true,
        text: `Template: ${a.template}. ${a.manual ? "WhatsApp / form source: the owner sends it — the system never messages the customer by itself here." : "Sent once from the approved template — never twice, even if the email is re-processed."}`,
      }),
    ];
  },
});

function createAction(m: InboxMessage, x: ExtractionResult, users: Detail["users"]): Action {
  const people = users.docs.map((u) => ({ label: typeof u.name === "string" ? u.name : u.id, value: u.id }));
  const options = (id: string, name: string) => (people.length ? people : [{ label: name, value: id }]);
  const flagged = x.lines.filter((l) => l.flag).length;
  const kind = x.caseType === "service" ? "service" : "RFQ";
  const fields: PromptField[] = [
    {
      type: "select",
      name: "owner",
      label: "Owner",
      required: true,
      defaultValue: x.assignment.owner,
      options: options(x.assignment.owner, x.assignment.ownerName),
      admin: { width: "50%" },
    },
    {
      type: "select",
      name: "backup",
      label: "Backup",
      defaultValue: x.assignment.backup,
      options: options(x.assignment.backup, x.assignment.backupName),
      admin: { width: "50%" },
    },
    {
      type: "date",
      name: "deadline",
      label: "Quote deadline",
      required: true,
      defaultValue: x.assignment.deadline,
      admin: { description: "A reminder is scheduled before it." },
    },
  ];
  return {
    label: "Create case",
    main: true,
    call: { path: path(m.id, "create-case") },
    confirm: {
      heading: "Create this case?",
      label: "Create case",
      text: [
        `Creates a ${kind} case for ${x.customerName}${x.newCustomer ? " (new customer record)" : ""} with ${plural(x.lines.length, "line")} exactly as drafted.`,
        `${x.acknowledgement.manual ? "The acknowledgement is yours to send by hand." : "The acknowledgement is sent once, from the approved template."}${flagged ? " Flagged lines stay “Clarification needed” until the customer answers." : ""}`,
      ].join("\n"),
    },
    fields,
    reply: true,
  };
}

const createCase = pane({
  title: "Create the case",
  size: "s",
  show: (d) => draft(d) && !d.message!.createdCase,
  render: ({ d, users }) => {
    const m = d.message!;
    const x = d.extraction!;
    const flagged = x.lines.filter((l) => l.flag).length;
    return [
      block("text", {
        text: `${x.caseType === "service" ? "Service case" : "RFQ case"} for ${x.customerName} with ${plural(x.lines.length, "line")}${flagged ? ` (${flagged} flagged for clarification)` : ""}, owner ${x.assignment.ownerName}. The original message stays linked to it.`,
      }),
      block("actions", {
        items: [
          {
            label: "Not an RFQ",
            call: { path: path(m.id, "review"), body: { decision: "not-related" } },
            done: "Marked not related",
          },
          createAction(m, x, users),
        ],
      }),
    ];
  },
});

const caseCreated = pane({
  title: "Case created",
  size: "s",
  show: (d) => draft(d) && d.message!.createdCase,
  render: ({ d }) => {
    const c = d.message!.createdCase!;
    return block("alert", {
      tone: "success",
      text: `Case ${c.caseId} created from this message and linked to it.`,
      actions: [
        { label: "Send supplier RFQs", main: true, href: link.doc("cases", c.id, "rfqs") },
        { label: "Open case", href: link.doc("cases", c.id) },
      ],
    });
  },
});

/* -------- a reply or forward: match → linked, duplicate or a person decides */

const basisList = (basis: string[]) => block("list", { items: basis.map((b) => ({ headline: b })) });

/** A reply or forward (not an RFQ) in the reading pane. */
const reply = (d: InboxDetail) => (d.message && !d.rfq ? d.message : null);
/** Matched or found a duplicate: not new and unmatched, not waiting for a person, not set aside. */
const settled = (m: InboxMessage) =>
  !(m.status === "New" && !m.match) && m.status !== "Needs review" && m.status !== "Ignored";

const matchPrompt = pane({
  title: "Match this message",
  size: "s",
  show: (d) => {
    const m = reply(d);
    return m && m.status === "New" && !m.match;
  },
  render: ({ d }) => [
    block("text", {
      muted: true,
      text: "Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their files. Below 85% a person decides.",
    }),
    block("actions", {
      items: [
        {
          label: "Match reply",
          icon: "sparkles",
          main: true,
          call: { path: path(d.message!.id, "match") },
          reply: true,
        },
      ],
    }),
  ],
});

const needsPerson = pane({
  title: "Needs a person",
  size: "s",
  show: (d) => reply(d)?.status === "Needs review",
  head: ({ d }) => ({ tags: [conf(d.message?.match?.confidence ?? 0)] }),
  render: ({ d }) => {
    const m = d.message!;
    const match = m.match;
    return [
      block("alert", { tone: "warning", text: "Uncertain match — not linked automatically." }),
      basisList(match?.basis ?? []),
      block("list", {
        items: (match?.candidates ?? []).map((c) => ({
          headline: c.caseId,
          supporting: c.reason,
          tags: [conf(c.confidence)],
          actions: [
            {
              label: `Link to ${c.caseId}`,
              call: { path: path(m.id, "review"), body: { decision: "link", case: c.case } },
              done: "Linked — your decision is in the audit log",
            },
          ],
        })),
      }),
      block("actions", {
        items: [
          {
            label: "Not related",
            call: { path: path(m.id, "review"), body: { decision: "not-related" } },
            done: "Marked not related",
          },
        ],
      }),
    ];
  },
});

const setAside = pane({
  title: "Outcome",
  size: "s",
  show: (d) => reply(d)?.status === "Ignored",
  render: ({ d }) => {
    const match = d.message!.match;
    return block("alert", {
      tone: "info",
      text: `Marked not related${match?.reviewedBy ? ` by ${match.reviewedBy}` : ""}.`,
    });
  },
});

/** Linked to a case: as a duplicate copy, or as a matched reply. */
const linked = (title: string, duplicate: boolean) =>
  pane({
    title,
    size: "s",
    show: (d) => {
      const m = reply(d);
      return m && settled(m) && (m.classification === "Duplicate") === duplicate;
    },
    head: ({ d }) => ({ tags: [conf(d.message?.match?.confidence ?? 0)] }),
    render: ({ d }) => {
      const match = d.message!.match;
      const caseRef = match?.case;
      return [
        duplicate
          ? block("alert", {
              tone: "info",
              text: `No new case — ${caseRef?.caseId ? `already linked to ${caseRef.caseId}` : "kept with the original message"}. No second acknowledgement.`,
            })
          : block("alert", {
              tone: "success",
              text: `Matched to ${caseRef?.caseId ?? "the case"}${match?.reference ? ` by reference ${match.reference}` : ""}${match?.reviewedBy ? ` · confirmed by ${match.reviewedBy}` : ""}.`,
            }),
        basisList(match?.basis ?? []),
        ...(caseRef
          ? [
              block("actions", {
                items: [
                  { label: "Supplier RFQs", href: link.doc("cases", caseRef.id, "rfqs") },
                  { label: `Open ${caseRef.caseId}`, main: true, href: link.doc("cases", caseRef.id) },
                ],
              }),
            ]
          : []),
      ];
    },
  });

export const inboxPage = widgets({
  header: {
    eyebrow: "Sourcing desk · intake",
    heading: "Inbox",
    subtitle: "Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.",
    actions: [
      simulate("rfq", "Simulate new email", `New email: “${SIMULATED_RFQ.subject}”`, true),
      simulate("forward", "Simulate forwarded copy", `New email: “${SIMULATED_FORWARD.subject}”`),
      simulate("reply", "Simulate supplier reply", `New supplier reply: “${SIMULATED_REPLY.subject}”`),
    ],
  },
  // Master–detail: the message list beside the reading pane, then the side cards, then the open
  // message's next steps (only the ones that apply to it take a tile).
  widgets: [
    list,
    nothingOpen,
    original,
    reviewQueue,
    channels,
    extractPrompt,
    rfqOutcome,
    matchPrompt,
    needsPerson,
    setAside,
    linked("Duplicate detected", true),
    linked("Reply matched", false),
    draftHeader,
    assignment,
    draftLines,
    missing,
    acknowledgement,
    createCase,
    caseCreated,
  ] as Widget[],
});
