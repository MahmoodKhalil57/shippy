import type { Endpoint, PayloadRequest } from "payload";
import { block, type Action, type Row, type Tone, type View, type ViewBlock } from "../../app/view/schema.ts";
import {
  caseOr404,
  caseRfqsPayload,
  simulateReplies,
  type CaseRfqRow,
  type CaseRfqsPayload,
  type ReplyEvent,
} from "../endpoints/sourcing.ts";

/**
 * Case tab "Supplier RFQs": the case's lines go out to suppliers (split by category or as the
 * full list) in an anonymised RFQ (no client, vessel or customer files). Statuses, the reminder
 * schedule (stops on reply, escalation after two reminders), and the presenter's "Simulate
 * replies": replies matched by reference even with a changed subject, a new supplier saved on the
 * spot with its dated price, offers created for the Compare tab, and anything uncertain left for a
 * person. The RFQ composer is `gs-rfq-composer`. Logic: ../endpoints/sourcing.ts.
 */

const STATUS: Record<string, Tone> = {
  Draft: "neutral",
  Sent: "info",
  "Awaiting reply": "warning",
  "Partial reply": "warning",
  "Clarification needed": "warning",
  Replied: "success",
  "Revised offer received": "success",
  Declined: "neutral",
  "No response": "error",
};
const OPEN = ["Sent", "Awaiting reply", "Partial reply", "Clarification needed"];
const OUTCOME: Record<ReplyEvent["outcome"], { tone: Tone; icon: string }> = {
  Replied: { tone: "success", icon: "success" },
  Declined: { tone: "neutral", icon: "x" },
  "Reminder sent": { tone: "warning", icon: "send" },
  Escalated: { tone: "error", icon: "warning" },
  "New supplier saved": { tone: "info", icon: "user" },
};

const FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const DAY = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const at = (v: string) => (v ? FMT.format(new Date(v)) : "—");
const day = (v: string) => (v ? DAY.format(new Date(v)) : "—");
const pct = (c: number) => `${Math.round(c * 100)}%`;

/**
 * The replies the last "Simulate replies" brought in, per case, shown as "Replies arriving" for a
 * while after (the presenter's moment; the replies themselves are saved as messages and offers).
 */
const arrivals = new Map<string, { at: number; events: ReplyEvent[] }>();
const SHOW_ARRIVALS_MS = 15 * 60_000;

function remind(r: CaseRfqRow, ownerName: string): Action {
  const n = r.reminders + 1;
  return {
    label: "Remind now",
    call: { path: `/sourcing/rfqs/${encodeURIComponent(r.id)}/remind` },
    done: `${r.reference}: ${n >= 2 ? `Escalated to ${ownerName}` : `Reminder ${n} sent`}`,
  };
}

function stats(d: CaseRfqsPayload) {
  const c = d.counts;
  return block("stats", {
    size: "md",
    items: [
      { label: "Supplier RFQs", value: String(c.total), note: `from 1 customer RFQ · ${d.lines.length} lines` },
      { label: "Replied", value: String(c.replied), note: "offers captured automatically", tone: "success" },
      {
        label: "Waiting",
        value: String(c.waiting),
        note: "reminders scheduled",
        tone: c.waiting ? "warning" : undefined,
      },
      {
        label: "Declined · no response",
        value: String(c.closed),
        note: c.escalated ? `${c.escalated} escalated to the owner` : "none escalated",
        tone: c.escalated ? "error" : undefined,
      },
    ],
  });
}

function table(d: CaseRfqsPayload) {
  return block("card", {
    heading: "Supplier RFQs",
    count: d.rfqs.length,
    actions: [
      {
        label: "Simulate replies",
        icon: "sync",
        variant: "filled",
        call: { path: `/views/case-rfqs/${encodeURIComponent(d.case.id)}/simulate-replies` },
        done: "Supplier replies are in — offers are on the Compare tab",
      },
    ],
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "Each supplier sees only the lines they can quote — never the client, the vessel or the client's files.",
      }),
      block("table", {
        empty: "No supplier RFQs yet — draft them below.",
        columns: [
          { key: "reference", label: "Reference" },
          { key: "supplier", label: "Supplier", supporting: "where" },
          { key: "lines", label: "Lines" },
          { key: "sent", label: "Sent · due", supporting: "due" },
          { key: "status", label: "Status" },
          { key: "reminders", label: "Reminders", supporting: "next" },
          { key: "latest", label: "Latest" },
          { key: "actions", label: "" },
        ],
        rows: d.rfqs.map((r): Row => ({
          reference: { text: r.reference, mono: true, strong: true },
          supplier: {
            text: r.supplier.name,
            href: `/collections/suppliers/${r.supplier.id}`,
            tags: r.supplier.isNew ? [{ label: "New supplier", tone: "primary" }] : undefined,
          },
          where: [r.supplier.city, r.category].filter(Boolean).join(" · "),
          lines: { text: "", tags: r.lineNos.map((n) => ({ label: `L${n}` })) },
          sent: r.sentAt ? at(r.sentAt) : "not invited",
          due: `due ${at(r.dueAt)}`,
          status: { text: r.status, tag: true, tone: STATUS[r.status] ?? "neutral" },
          reminders: `${r.reminders} of 2`,
          next: r.escalated
            ? { text: "escalated", tone: "error" }
            : OPEN.includes(r.status)
              ? r.nextReminderAt
                ? `next ${at(r.nextReminderAt)}`
                : "—"
              : "stopped",
          latest: r.lastEvent,
          actions:
            OPEN.includes(r.status) && !(r.escalated && r.reminders >= 2)
              ? { text: "", actions: [remind(r, d.case.ownerName)] }
              : "",
        })),
      }),
    ],
  });
}

function arriving(events: ReplyEvent[]) {
  return block("card", {
    heading: "Replies arriving",
    blocks: [
      block("timeline", {
        items: events.map((e) => ({
          heading: `${e.outcome} · ${e.supplier} · ${e.reference}`,
          text: [e.subject ? `Subject: “${e.subject}”` : "", e.detail].filter(Boolean).join("\n"),
          icon: OUTCOME[e.outcome].icon,
          tone: OUTCOME[e.outcome].tone,
          done: true,
        })),
      }),
    ],
  });
}

function review(d: CaseRfqsPayload) {
  const decide = (id: string, decision: "link" | "not-related", caseId?: string) => ({
    call: { path: `/inbox/${encodeURIComponent(id)}/review`, body: { decision, case: caseId } },
    done: decision === "link" ? "Confirmed — your decision is in the audit log" : "Marked not related",
  });
  return block("card", {
    heading: "Needs a person",
    count: d.review.length,
    countTone: "warning",
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "Anything the AI isn't sure of waits here — nothing uncertain is applied on its own.",
      }),
      ...d.review.map((r) =>
        block("card", {
          variant: "outlined",
          heading: `${r.fromName}: “${r.subject}”`,
          subhead: at(r.receivedAt),
          tags: [{ label: pct(r.confidence), tone: "warning" }],
          blocks: [
            block("text", { variant: "body-sm", text: r.basis.map((b) => `• ${b}`).join("\n") }),
            ...r.uncertain.map((u) => block("alert", { tone: "warning", text: u })),
            block("actions", {
              items: [
                ...(r.kind === "new-supplier"
                  ? [{ label: "Confirm offer", variant: "filled" as const, ...decide(r.id, "link", d.case.id) }]
                  : r.candidates.map((c) => ({
                      label: `Link to ${c.caseId} (${pct(c.confidence)})`,
                      variant: c.case === d.case.id ? ("filled" as const) : ("tonal" as const),
                      ...decide(r.id, "link", c.case),
                    }))),
                { label: "Not related", variant: "text" as const, ...decide(r.id, "not-related") },
              ],
            }),
          ],
        }),
      ),
    ],
  });
}

function replies(d: CaseRfqsPayload) {
  return block("card", {
    heading: "Replies matched",
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "Matched by reference, thread and sender — even when the supplier changed the subject.",
      }),
      block("list", {
        items: d.replies.map((r) => ({
          headline: r.fromName,
          overline: `“${r.subject}” · ${at(r.receivedAt)}`,
          supporting: r.basis.slice(0, 2).join(" · "),
          tags: [{ label: `${r.reference || "linked"} · ${pct(r.confidence)}`, tone: "success" as const }],
        })),
      }),
    ],
  });
}

function newSuppliers(d: CaseRfqsPayload) {
  return block("card", {
    heading: "New suppliers saved",
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
        text: "Saved the moment they replied — contact, category and a dated price with its validity, even without an order.",
      }),
      block("grid", {
        fit: "sm",
        blocks: d.newSuppliers.map((s) =>
          block("card", {
            variant: "outlined",
            blocks: [
              block("list", {
                items: [
                  {
                    headline: s.name,
                    href: `/collections/suppliers/${s.id}`,
                    supporting: `${s.city} · ${s.source}`,
                    tags: [{ label: "New · quoted, never ordered", tone: "primary" as const }],
                  },
                ],
              }),
              block("text", {
                variant: "body-sm",
                text: s.prices
                  .map(
                    (p) =>
                      `${p.description}: ${
                        d.canSeeCosts && p.price !== undefined
                          ? `${p.currency} ${p.price.toLocaleString("en-US")} / ${p.per}`
                          : "price hidden for your role"
                      } · quoted ${day(p.quotedAt)} · valid to ${day(p.validUntil)}`,
                  )
                  .join("\n"),
              }),
            ],
          }),
        ),
      }),
    ],
  });
}

function composer(d: CaseRfqsPayload, mode: "split" | "full") {
  return block("card", {
    heading: "Draft supplier RFQs",
    blocks: [
      block("choice", {
        param: "send",
        label: "How to send",
        value: "split",
        options: [
          { value: "split", label: "Split by category" },
          { value: "full", label: "Full list" },
        ],
      }),
      block("text", {
        muted: true,
        variant: "body-sm",
        text:
          mode === "split"
            ? "Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ."
            : "General chandlers receive every line in one RFQ.",
      }),
      block("custom", {
        element: "gs-rfq-composer",
        props: { caseDoc: d.case.id, mode, lines: d.lines },
      }),
    ],
  });
}

function reminders(d: CaseRfqsPayload) {
  const open = d.rfqs.filter((r) => OPEN.includes(r.status) || r.escalated);
  return block("card", {
    heading: "Reminders and escalation",
    blocks: [
      block("text", {
        text: `Reminder 1 after 24 h, reminder 2 after 48 h, then the case owner (${d.case.ownerName}) is alerted. Reminders stop the moment a supplier replies or declines.`,
      }),
      ...(open.length
        ? open.flatMap((r): ViewBlock[] => [
            block("text", { variant: "label-lg", text: `${r.supplier.name} · ${r.reference}` }),
            block("steps", {
              tone: r.escalated ? "error" : "primary",
              current: r.schedule.filter((s) => s.state === "done").length - 1,
              items: r.schedule.map((s) => ({
                label: s.label,
                supporting: s.state === "skipped" ? "not needed" : s.state === "next" ? `next · ${at(s.at)}` : at(s.at),
                state: s.state === "done" || s.state === "skipped" ? s.state : undefined,
              })),
            }),
          ])
        : [block("text", { muted: true, text: "No supplier is being chased right now." })]),
    ],
  });
}

export function caseRfqsView(d: CaseRfqsPayload, mode: "split" | "full", events: ReplyEvent[] = []): View {
  const pair = [...(d.replies.length ? [replies(d)] : []), ...(d.newSuppliers.length ? [newSuppliers(d)] : [])];
  return {
    blocks: [
      stats(d),
      table(d),
      ...(events.length ? [arriving(events)] : []),
      ...(d.review.length ? [review(d)] : []),
      ...(pair.length ? [block("grid", { fit: "md", blocks: pair })] : []),
      composer(d, mode),
      reminders(d),
    ],
  };
}

const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });

/** Signed in, and the case exists: the case, or the error response. */
async function caseOf(req: PayloadRequest) {
  if (!req.user) return fail(401, "You are not allowed to perform this action.");
  try {
    return await caseOr404(req as never);
  } catch (e) {
    const err = e as Error & { status?: number };
    return fail(err.status ?? 500, err.message);
  }
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/case-rfqs/:id?send=split|full: the "Supplier RFQs" tab as a View.
    path: "/views/case-rfqs/:id",
    method: "get",
    handler: async (req: PayloadRequest) => {
      const c = await caseOf(req);
      if (c instanceof Response) return c;
      const last = arrivals.get(c.id);
      const events = last && Date.now() - last.at < SHOW_ARRIVALS_MS ? last.events : [];
      const mode = req.query?.send === "full" ? "full" : "split";
      return Response.json(caseRfqsView(await caseRfqsPayload(req as never, c), mode, events));
    },
  },
  {
    // The presenter's "Simulate replies": runs the simulation and keeps what arrived for the view.
    path: "/views/case-rfqs/:id/simulate-replies",
    method: "post",
    handler: async (req: PayloadRequest) => {
      const c = await caseOf(req);
      if (c instanceof Response) return c;
      const events = await simulateReplies(req as never, c);
      if (!events.length) return fail(400, "No supplier RFQs are waiting for a reply — send RFQs first");
      arrivals.set(c.id, { at: Date.now(), events });
      return Response.json({ events });
    },
  },
];
