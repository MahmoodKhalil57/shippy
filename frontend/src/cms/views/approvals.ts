import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type View, type ViewBlock } from "../../app/view/schema.ts";
import { commercialEndpoints, type ApprovalCard } from "../endpoints/commercial.ts";
import type { Doc } from "../types.ts";
import { text, via } from "./via.ts";

/**
 * Approvals (/approvals): everything that needs an authorised person — quotations, margin
 * exceptions, deposits and payments, alternative items, bank-detail changes, FX rates. Each card
 * shows what is being decided and the evidence behind it, who decides and why you can't (when you
 * can't). Approve / Return with a reason go through the approvals collection, whose hooks enforce
 * one decision per approver and the two-person rule. Data: GET /api/commercial/approvals.
 */

interface Queue {
  pending: ApprovalCard[];
  decided: ApprovalCard[];
  mine: number;
}

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
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });
const RECORDED = "Recorded under your name with the time, on the request and the case timeline.";

function decisions(a: ApprovalCard, me: string): Action[] {
  const call = (decision: "Approve" | "Reject") => ({
    path: `/views/approvals/${encodeURIComponent(a.id)}/decide`,
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
      variant: "filled",
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

function card(a: ApprovalCard, me: string): ViewBlock {
  const done = ["Approved", "Rejected"].includes(a.status);
  const requested = `Requested by ${a.requestedBy}${a.requestedAt ? ` · ${day(a.requestedAt)}` : ""}`;
  return block("card", {
    heading: a.title,
    subhead: a.case ? `${a.case.caseId} · ${a.case.vessel} · ${requested}` : requested,
    tags: [
      { label: a.type, tone: "primary" },
      { label: a.status, tone: a.tone },
      ...(a.twoPerson ? [{ label: "Two-person rule", tone: "warning" as const }] : []),
    ],
    blocks: [
      block("custom", {
        element: "ui-ai-summary",
        key: a.id,
        props: {
          type: "tldr",
          auto: true,
          context:
            "An approval request at a ship chandler: say in one sentence what is being asked and what matters for the decision.",
          text: [a.title, a.type, ...a.evidence.map((e) => `${e.label}: ${e.value}`), a.progress].join("\n"),
        },
      }),
      block("details", {
        layout: "inline",
        items: a.evidence.map((e) => ({
          label: e.label,
          value:
            e.tone === "success" || e.tone === "warning" || e.tone === "error"
              ? { text: e.value, tone: e.tone }
              : e.value,
        })),
      }),
      block("divider", {}),
      block("tags", {
        items: a.approvers.map((p) => ({
          label: `${p.name}${p.decision ? (p.decision === "Approve" ? " ✓" : " ✕") : ""}`,
          tone: p.decision === "Approve" ? "success" : p.decision === "Reject" ? "error" : "neutral",
        })),
      }),
      block("text", { text: a.progress, variant: "label-lg" }),
      ...a.approvers.filter((p) => p.reason).map((p) => muted(`${p.name}: “${p.reason}”`)),
      muted(`Who decides: ${a.rule}`),
      ...(!done && !a.canDecide ? [block("alert", { tone: "info", text: a.why })] : []),
      block("actions", {
        items: [
          ...a.links.map((l): Action => ({ label: l.label, href: l.href, variant: "text" })),
          ...(a.canDecide ? decisions(a, me) : []),
        ],
      }),
    ],
  });
}

function section(heading: string, sub: string, cards: ApprovalCard[], empty: string, me: string) {
  return block("card", {
    heading,
    count: cards.length,
    blocks: [
      block("text", { text: sub, muted: true }),
      cards.length
        ? block("grid", { fit: "md", blocks: cards.map((c) => card(c, me)) })
        : block("text", { text: empty, muted: true }),
    ],
  });
}

export function approvalsView(q: Queue, user: Doc | null): View {
  const me = user?.id ?? "";
  const mine = q.pending.filter((a) => a.canDecide);
  const others = q.pending.filter((a) => !a.canDecide);
  const first = typeof user?.name === "string" ? user.name.split(" ")[0] : "";
  return {
    header: {
      eyebrow: "Approvals",
      heading: mine.length
        ? `${mine.length} decision${mine.length === 1 ? "" : "s"} waiting for you`
        : "Nothing waiting for you",
      subtitle: `${first ? `${first}, every` : "Every"} quotation, margin exception, payment, alternative item, bank-detail change and FX rate needs a named person. AI never approves.`,
      actions: [{ label: "Approval rules", href: "/globals/approval-rules" }],
    },
    blocks: [
      block("stats", {
        size: "md",
        items: [
          { label: "Waiting for you", value: String(mine.length), note: "You are a listed approver" },
          { label: "Waiting for others", value: String(others.length), note: "You can see the evidence, not decide" },
          {
            label: "Two-person requests",
            value: String(q.pending.filter((a) => a.twoPerson).length),
            note: "Finance + CEO",
          },
          { label: "Decided", value: String(q.decided.length), note: "Kept with the record for audit" },
        ],
      }),
      section(
        "Waiting for you",
        "Approve or return with a reason. Your decision is recorded under your name.",
        mine,
        "Nothing needs your decision right now.",
        me,
      ),
      section(
        "Waiting for others",
        "Requests you can follow but not decide — each card says who can.",
        others,
        "No other open requests.",
        me,
      ),
      section(
        "Recently decided",
        "Approved and returned requests, with who decided and why.",
        q.decided,
        "No decisions yet.",
        me,
      ),
    ],
  };
}

const userOf = (req: PayloadRequest) => req.user as unknown as Doc | null;

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/approvals: the approvals queue as a View (src/app/view).
    path: "/views/approvals",
    method: "get",
    handler: async (req) => {
      const q = await via<Queue>(commercialEndpoints, "get", "/commercial/approvals", req);
      return q instanceof Response ? q : Response.json(approvalsView(q, userOf(req)));
    },
  },
  {
    // POST /api/views/approvals/:id/decide { decision, reason }: the decision, answered with what it did.
    path: "/views/approvals/:id/decide",
    method: "post",
    handler: async (req) => {
      const c = await via<ApprovalCard>(commercialEndpoints, "post", "/commercial/approvals/:id/decide", req, {
        id: text(req.routeParams?.id),
      });
      if (c instanceof Response) return c;
      return Response.json({
        ok: true,
        message:
          c.status === "Approved"
            ? `Approved: ${c.title}`
            : c.status === "Rejected"
              ? `Returned: ${c.title}`
              : `Your approval is recorded — ${c.progress}.`,
      });
    },
  },
];
