import { block, type Action, type Row, type Tone } from "saastemlycrm-design-system/contracts";
import { from, widget, widgets, type Source } from "saastemlycrm-design-system/contracts";
import type { CaseOverview, TimelineEntry } from "../endpoints/platform.ts";
import { formatDate } from "./format.ts";

/**
 * Case tab "Overview": the case at a glance. Where it is on the 16-step flow, how far each line
 * really is (partials never read as done), the next action and blocker, owner and backup with an
 * AI-drafted handover a person confirms ("Reassign"), the clarification log, the
 * customer's contact rule, the open tasks and the activity timeline (automatic vs human vs alert,
 * with the rule that fired). Data: GET /api/case-overview/:id (../endpoints/platform.ts).
 */

const overview: Source = { endpoint: "/case-overview/$doc.id" };
/** A widget drawn from the case overview (one request, however many widgets use it). */
const on = from<CaseOverview>(overview);

const KIND = {
  auto: { label: "Automatic", icon: "sync", tone: "info" },
  human: { label: "Human", icon: "user", tone: "success" },
  alert: { label: "Alert", icon: "warning", tone: "warning" },
} as const;

const BUCKET_TONE = {
  ready: "success",
  waiting: "warning",
  blocked: "error",
  noOffer: "neutral",
  closed: "neutral",
} as const;

/** One gauge per count, each out of the case's lines, in one `gauges` block. */
const bars = (total: number, items: [label: string, value: number, tone: Tone][]) =>
  block("gauges", {
    items: items.map(([label, value, tone]) => ({
      label,
      value,
      max: Math.max(total, 1),
      tone,
      valueText: `${value} / ${total}`,
      a11y: `${label}: ${value} of ${total} lines`,
    })),
  });

const lifecycle = on({
  title: "Lifecycle — first email to last payment",
  size: "m",
  head: (d) => ({ tags: [{ label: `Step ${d.current + 1} of ${d.steps.length}`, tone: "primary" }] }),
  render: (d) => {
    const step = d.steps[d.current]!;
    return [
      block("steps", {
        current: d.current,
        tone: d.halted === "lost" ? "error" : "primary",
        items: d.steps.map((s) => ({ label: s.label })),
      }),
      block("tags", { items: [{ label: `Phase ${step.phase}` }] }),
      block("text", { text: `${step.label}: ${d.stage}` }),
      block("text", { muted: true, text: step.detail }),
      ...(d.halted
        ? [
            block("alert", {
              tone: d.halted === "lost" ? "error" : "warning",
              text: `${d.halted === "lost" ? "The case ended here" : "Paused at the customer's decision"} — ${d.next}`,
            }),
          ]
        : []),
    ];
  },
});

/** Each line on its own: how many are ready, waiting, blocked or without an offer. */
const lines = on({
  title: "Line progress",
  size: "s",
  head: ({ lines: l }) => {
    const pct = l.total ? Math.round((l.ready / l.total) * 100) : 0;
    return {
      tags: [{ label: `${pct}% ready`, tone: l.ready === l.total && l.total ? "success" : "warning" }],
      subhead: `Each line moves on its own. A case with some lines ready is ${pct}% — never “done” until every line is.`,
    };
  },
  render: ({ lines: l }) =>
    bars(l.total, [
      ["Ready", l.ready, "success"],
      ["Waiting", l.waiting, "warning"],
      ["Blocked", l.blocked, "error"],
      ["No offer", l.noOffer, "neutral"],
    ]),
});

/** Once ordered: how far the lines are from order to invoice. */
const fulfilment = on({
  title: "After the order",
  size: "s",
  hidden: ({ fulfilment: f }) => !f.started,
  render: ({ fulfilment: f }) => [
    bars(f.total, [
      ["Ordered", f.ordered, "info"],
      ["Received", f.received, "info"],
      ["Delivered", f.delivered, "info"],
      ["Invoiced", f.invoiced, "info"],
    ]),
    ...(f.notes.length ? [block("alert", { tone: "warning", text: f.notes.map((n) => `⚑ ${n}`).join("\n") })] : []),
  ],
});

const lineStatus = on({
  title: "Line status",
  size: "l",
  hidden: ({ lines: l }) => !l.rows.length,
  render: ({ lines: l }) =>
    block("table", {
      columns: [
        { key: "lineNo", label: "#" },
        { key: "description", label: "Line" },
        { key: "status", label: "Status" },
        { key: "confidence", label: "AI read" },
      ],
      rows: l.rows.map((r): Row => ({
        lineNo: { text: String(r.lineNo), strong: true },
        description: r.description,
        status: { text: r.status, dot: BUCKET_TONE[r.bucket] },
        confidence:
          r.confidence === undefined
            ? null
            : {
                text: `${Math.round(r.confidence * 100)}%`,
                tag: true,
                tone: r.confidence < 0.85 ? "warning" : "neutral",
              },
      })),
    }),
});

const clarifications = on({
  title: "Clarifications log",
  size: "l",
  head: (d) => {
    const open = d.clarifications.filter((q) => q.open).length;
    return { tags: [{ label: `${open} open`, tone: open ? "warning" : "success" }] };
  },
  render: (d) => [
    block("text", {
      muted: true,
      text: "Questions and answers per line, to the customer, a supplier or internal. Clear lines keep moving while one waits.",
    }),
    block("table", {
      empty: "No clarifications on this case.",
      columns: [
        { key: "line", label: "Line" },
        { key: "to", label: "To · via", supporting: "via" },
        { key: "question", label: "Question", supporting: "asked" },
        { key: "answer", label: "Answer", supporting: "answeredAt" },
      ],
      rows: d.clarifications.map((q): Row => ({
        line: { text: q.lineNo === undefined ? "All" : String(q.lineNo), strong: true },
        to: { text: q.to, tag: true },
        via: q.via,
        question: q.question,
        asked: `${q.askedBy}${q.askedAt ? ` · ${formatDate(q.askedAt)}` : ""}`,
        answer: q.open ? { text: "Waiting", tag: true, tone: "warning" } : q.answer,
        answeredAt: q.open ? "" : formatDate(q.answeredAt),
      })),
    }),
  ],
});

const timeline = on({
  title: "Activity timeline — audit trail",
  size: "m",
  render: (d, { params }) => {
    const filter = ["auto", "human", "alert"].includes(params.show ?? "") ? params.show! : "all";
    const entries = d.timeline.filter((t) => filter === "all" || t.kind === filter);
    const count = (k: TimelineEntry["kind"]) => d.timeline.filter((t) => t.kind === k).length;
    return [
      block("choice", {
        param: "show",
        label: "Show",
        value: "all",
        options: [
          { value: "all", label: `All ${d.timeline.length}` },
          { value: "auto", label: `Automatic ${count("auto")}` },
          { value: "human", label: `Human ${count("human")}` },
          { value: "alert", label: `Alerts ${count("alert")}` },
        ],
      }),
      block("text", {
        muted: true,
        text: "Every automatic step names the rule that fired; every human step names the person. Nothing is edited after the fact.",
      }),
      block("custom", {
        element: "ui-ai-summary",
        props: {
          label: "Catch me up on this case",
          context:
            "The activity log of a ship-supply case at Golden Sea, from the customer's RFQ to payment. Say where it stands and what is blocking it.",
          text: d.timeline.map((t) => `${formatDate(t.at)} · ${t.actor}: ${t.text}`).join("\n"),
        },
      }),
      entries.length
        ? block("timeline", {
            items: entries.map((t) => {
              const k = KIND[t.kind];
              return {
                time: formatDate(t.at),
                heading: [k.label, t.actor, t.rule ? `rule: ${t.rule}` : ""].filter(Boolean).join(" · "),
                text: t.text,
                icon: k.icon,
                tone: k.tone,
                done: true,
              };
            }),
          })
        : block("text", { muted: true, text: "Nothing logged yet." }),
    ];
  },
});

const next = on({
  title: "Next action",
  size: "s",
  render: (d) => [
    block("heading", { text: d.next || "—" }),
    d.blocker
      ? block("alert", { tone: "warning", heading: "Blocker", text: d.blocker })
      : block("text", { muted: true, text: "No blocker." }),
    block("details", {
      layout: "inline",
      items: [
        { label: "Quote due", value: d.deadlineText },
        {
          label: "Vessel",
          value: `${d.vessel}${d.port ? ` · ${d.port}` : ""}${d.eta ? ` · ETA ${formatDate(d.eta)}` : ""}`,
        },
        ...(d.customerRef ? [{ label: "Customer ref", value: d.customerRef }] : []),
        ...(d.value !== undefined ? [{ label: "Value", value: `USD ${d.value.toLocaleString("en-US")}` }] : []),
      ],
    }),
  ],
});

/**
 * "Reassign": pick who takes over; AI drafts the handover note from the case (its clarifications,
 * open tasks and timeline) for the person picked; edit it, confirm. Nothing is saved until then.
 */
const reassign = (d: CaseOverview): Action => ({
  label: "Reassign",
  call: { path: `/case-overview/${d.id}/reassign` },
  confirm: {
    heading: `Reassign ${d.caseId}`,
    text: "The new owner gets the case, its open tasks and a notification. The handover note is logged on the timeline. AI drafts the note from the case, its clarifications, open tasks and timeline.",
    label: "Confirm handover",
  },
  fields: [
    {
      type: "select",
      name: "to",
      label: "Hand over to",
      required: true,
      defaultValue: d.backup && d.backup.id !== d.owner?.id ? d.backup.id : undefined,
      options: d.team
        .filter((p) => p.id !== d.owner?.id)
        .map((p) => ({ label: `${p.name}${p.id === d.backup?.id ? " (backup)" : ""}`, value: p.id })),
      admin: { placeholder: "Choose a person" },
    },
    {
      type: "textarea",
      name: "note",
      label: "Handover note",
      required: true,
      admin: { description: "Edit freely — nothing is saved until you confirm.", rows: 10 },
    },
  ],
  prefill: { when: "to", into: "note", from: "draft", call: { path: `/case-overview/${d.id}/handover` } },
  assist: { field: "note", tools: "formal shorter proofread" },
  reply: true,
});

const owner = on({
  title: "Owner & backup",
  size: "s",
  render: (d) => {
    const person = (p: CaseOverview["owner"], role: string) =>
      p
        ? { headline: p.name, supporting: role, icon: "user" as const }
        : { headline: `No ${role.toLowerCase()} set`, icon: "user" as const };
    return [
      block("list", { items: [person(d.owner, "Owner"), person(d.backup, "Backup")] }),
      ...(d.handoverNote
        ? [
            block("card", {
              heading: "Last handover note",
              open: false,
              blocks: [block("text", { text: d.handoverNote })],
            }),
          ]
        : []),
      ...(d.canReassign ? [block("actions", { items: [reassign(d)] })] : []),
    ];
  },
});

const contactRule = on({
  title: "Customer contact rule",
  size: "s",
  render: ({ customer: c }) => [
    block("heading", { text: c.name }),
    block("tags", {
      items: [
        {
          label: c.contactRuleLabel,
          tone: c.strict ? "error" : c.contactRule === "one-follow-up" ? "warning" : "success",
        },
      ],
    }),
    block("text", {
      muted: true,
      text: c.strict
        ? "Follow-ups for this customer are internal reminders only — the system refuses customer-facing chasers."
        : c.contactRule === "one-follow-up"
          ? "One customer follow-up per quotation; after that, internal reminders only."
          : "Follow-ups allowed, drafted for a person to send.",
    }),
  ],
});

/** The case's open tasks: a plain query, no code. */
const tasks = widget({
  title: "Open tasks",
  size: "s",
  records: {
    collection: "tasks",
    where: { case: { equals: "$doc.id" }, status: { equals: "Open" } },
    sort: "due",
    columns: ["title", "channel", "owner", "due"],
    layout: "list",
    empty: "Nothing open.",
  },
});

export const caseOverview = widgets({
  // 3 lanes: m + s, then a row of s, then the tables, then m + s.
  widgets: [lifecycle, next, lines, fulfilment, owner, tasks, lineStatus, clarifications, timeline, contactRule],
});
