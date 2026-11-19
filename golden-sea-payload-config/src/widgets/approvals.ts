import { block, type Action, type Entry, type ViewHeader } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget, type WidgetScope } from "saastemlycrm-design-system/contracts";
import type { ApprovalCard } from "../endpoints/commercial.ts";
import * as link from "../links.ts";

/**
 * Approvals (/approvals): everything that needs an authorised person — quotations, margin
 * exceptions, deposits and payments, alternative items, bank-detail changes, FX rates. Each card
 * shows what is being decided and the evidence behind it, who decides and why you can't (when you
 * can't). Approve / Return with a reason go through the approvals collection, whose hooks enforce
 * one decision per approver and the two-person rule. Data: GET /api/commercial/approvals;
 * deciding: POST /api/commercial/approvals/:id/decide, which answers with what it recorded.
 */

interface Queue {
  pending: ApprovalCard[];
  decided: ApprovalCard[];
  mine: number;
}

const queue: Source = { endpoint: "/commercial/approvals" };
const on = from<Queue>(queue);
const mineOf = (q: Queue) => q.pending.filter((a) => a.canDecide);
const othersOf = (q: Queue) => q.pending.filter((a) => !a.canDecide);

const day = (iso: string) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "—";
const RECORDED = "Recorded under your name with the time, on the request and the case timeline.";

function decisions(a: ApprovalCard, me: string): Action[] {
  const call = (decision: "Approve" | "Reject") => ({
    path: `/commercial/approvals/${encodeURIComponent(a.id)}/decide`,
    body: { decision },
  });
  const approved = a.approvers.filter((p) => p.decision === "Approve").length;
  const others = a.approvers.filter((p) => !p.decision && p.id !== me);
  const twoPerson =
    a.twoPerson && a.needed - approved > 1
      ? `\nTwo-person rule: after you, ${others.map((p) => p.name).join(" or ")} must also approve.`
      : "";
  return [
    {
      label: "Return",
      tone: "error",
      call: call("Reject"),
      confirm: { heading: "Return with a reason", text: `${a.title}\n${RECORDED}`, label: "Return", tone: "error" },
      fields: [
        {
          type: "textarea",
          name: "reason",
          label: "Reason (required)",
          required: true,
          admin: { placeholder: "e.g. Margin too thin — ask the customer to accept v1 prices" },
        },
      ],
      reply: true,
    },
    {
      label: "Approve",
      main: true,
      call: call("Approve"),
      confirm: { heading: "Approve request", text: `${a.title}${twoPerson}\n${RECORDED}`, label: "Approve" },
      fields: [
        {
          type: "textarea",
          name: "reason",
          label: "Comment (optional)",
          admin: { placeholder: "e.g. Call-back done on the number on file" },
        },
      ],
      reply: true,
    },
  ];
}

/** One request: what is decided, the evidence, who stands where, and the decision buttons. */
function entry(a: ApprovalCard, me: string): Entry {
  const done = ["Approved", "Rejected"].includes(a.status);
  return {
    id: a.id,
    heading: a.title,
    meta: [
      a.case ? `${a.case.caseId} · ${a.case.vessel}` : "",
      `Requested by ${a.requestedBy}`,
      a.requestedAt ? day(a.requestedAt) : "",
    ],
    status: { label: a.status, tone: a.tone },
    tags: [
      { label: a.type, tone: "primary" },
      ...(a.twoPerson ? [{ label: "Two-person rule", tone: "warning" as const }] : []),
    ],
    summary: {
      context:
        "An approval request at a ship chandler: say in one sentence what is being asked and what matters for the decision.",
      text: [a.title, a.type, ...a.evidence.map((e) => `${e.label}: ${e.value}`), a.progress].join("\n"),
    },
    facts: a.evidence.map((e) => ({
      label: e.label,
      value:
        e.tone === "success" || e.tone === "warning" || e.tone === "error" ? { text: e.value, tone: e.tone } : e.value,
    })),
    people: a.approvers.map((p) => ({
      name: p.name,
      state: p.decision === "Approve" ? "done" : p.decision === "Reject" ? "declined" : "waiting",
      note: p.reason,
    })),
    notes: [a.progress, `Who decides: ${a.rule}`],
    notice: !done && !a.canDecide ? { tone: "info", text: a.why } : undefined,
    actions: [
      ...a.links.map((l): Action => ({ label: l.label, href: l.href })),
      ...(a.canDecide ? decisions(a, me) : []),
    ],
  };
}

/** One section of the queue: its requests, each on its own card. */
const section = (title: string, sub: string, cards: (q: Queue) => ApprovalCard[], empty: string): Widget<Queue> =>
  on({
    title,
    subhead: sub,
    skeleton: "entries",
    head: (q) => ({ count: cards(q).length }),
    render: (q, { user }) => block("entries", { items: cards(q).map((c) => entry(c, user.id)), empty }),
  });

const header = (q: unknown, { user }: WidgetScope): ViewHeader => {
  const mine = mineOf(q as Queue);
  const first = typeof user.name === "string" ? user.name.split(" ")[0] : "";
  return {
    eyebrow: "Approvals",
    heading: mine.length
      ? `${mine.length} decision${mine.length === 1 ? "" : "s"} waiting for you`
      : "Nothing waiting for you",
    subtitle: `${first ? `${first}, every` : "Every"} quotation, margin exception, payment, alternative item, bank-detail change and FX rate needs a named person. AI never approves.`,
    actions: [{ label: "Approval rules", href: link.global("approval-rules") }],
  };
};

export const approvalsPage = widgets({
  header: { source: queue, render: header },
  widgets: [
    on({
      skeleton: "stats",
      render: (q) =>
        block("stats", {
          size: "md",
          items: [
            { label: "Waiting for you", value: String(mineOf(q).length), note: "You are a listed approver" },
            {
              label: "Waiting for others",
              value: String(othersOf(q).length),
              note: "You can see the evidence, not decide",
            },
            {
              label: "Two-person requests",
              value: String(q.pending.filter((a) => a.twoPerson).length),
              note: "Finance + CEO",
            },
            { label: "Decided", value: String(q.decided.length), note: "Kept with the record for audit" },
          ],
        }),
    }),
    section(
      "Waiting for you",
      "Approve or return with a reason. Your decision is recorded under your name.",
      mineOf,
      "Nothing needs your decision right now.",
    ),
    section(
      "Waiting for others",
      "Requests you can follow but not decide — each card says who can.",
      othersOf,
      "No other open requests.",
    ),
    section(
      "Recently decided",
      "Approved and returned requests, with who decided and why.",
      (q) => q.decided,
      "No decisions yet.",
    ),
  ],
});
