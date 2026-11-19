import { block, note, type Action, type Row, type Tone, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { CaseLine, CaseRfqRow, CaseRfqsPayload, ReplyEvent } from "../endpoints/sourcing.ts";

/**
 * Case tab "Supplier RFQs": the case's lines go out to suppliers (split by category or as the
 * full list) in an anonymised RFQ (no client, vessel or customer files). Statuses, the reminder
 * schedule (stops on reply, escalation after two reminders), and the presenter's "Simulate
 * replies": replies matched by reference even with a changed subject, a new supplier saved on the
 * spot with its dated price, offers created for the Compare tab, and anything uncertain left for a
 * person. "Draft RFQs" picks the lines and drafts one anonymised RFQ per supplier ("How to send"
 * is the `send` parameter); the drafts stay on the server (the payload's `plan`) to preview,
 * remove one by one, and send after a confirmation.
 * Data: GET /api/sourcing/cases/:id; actions: POST /api/sourcing/cases/:id/plan, …/plan/remove,
 * …/plan/discard, …/send, /api/case-rfqs/:id/simulate-replies,
 * /api/sourcing/rfqs/:id/remind, /api/inbox/:id/review (../endpoints/sourcing.ts).
 */

const rfqs: Source = { endpoint: "/sourcing/cases/$doc.id" };
/** A widget drawn from the case's supplier RFQs (one request, however many widgets use it). */
const on = (w: Widget<CaseRfqsPayload>): Widget<CaseRfqsPayload> => ({ source: rfqs, ...w });

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

function remind(r: CaseRfqRow, ownerName: string): Action {
  const n = r.reminders + 1;
  return {
    label: "Remind now",
    call: { path: `/sourcing/rfqs/${encodeURIComponent(r.id)}/remind` },
    done: `${r.reference}: ${n >= 2 ? `Escalated to ${ownerName}` : `Reminder ${n} sent`}`,
  };
}

const stats = on({
  skeleton: "stats",
  render: (d) => {
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
  },
});

const table = on({
  title: "Supplier RFQs",
  skeleton: "table",
  head: (d) => ({
    count: d.rfqs.length,
    actions: [
      {
        label: "Simulate replies",
        icon: "sync",
        variant: "filled",
        call: { path: "/case-rfqs/$doc.id/simulate-replies" },
        done: "Supplier replies are in — offers are on the Compare tab",
      },
    ],
  }),
  render: (d) => [
    note("Each supplier sees only the lines they can quote — never the client, the vessel or the client's files."),
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

/** What the last "Simulate replies" brought in, for a while after. */
const arriving = on({
  title: "Replies arriving",
  hidden: (d) => !d.arrivals.length,
  render: (d) =>
    block("timeline", {
      items: d.arrivals.map((e) => ({
        heading: `${e.outcome} · ${e.supplier} · ${e.reference}`,
        text: [e.subject ? `Subject: “${e.subject}”` : "", e.detail].filter(Boolean).join("\n"),
        icon: OUTCOME[e.outcome].icon,
        tone: OUTCOME[e.outcome].tone,
        done: true,
      })),
    }),
});

const review = on({
  title: "Needs a person",
  hidden: (d) => !d.review.length,
  head: (d) => ({ count: d.review.length, countTone: "warning" }),
  render: (d) => {
    const decide = (id: string, decision: "link" | "not-related", caseId?: string) => ({
      call: { path: `/inbox/${encodeURIComponent(id)}/review`, body: { decision, case: caseId } },
      done: decision === "link" ? "Confirmed — your decision is in the audit log" : "Marked not related",
    });
    return [
      note("Anything the AI isn't sure of waits here — nothing uncertain is applied on its own."),
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
    ];
  },
});

const replies = on({
  title: "Replies matched",
  skeleton: "list",
  hidden: (d) => !d.replies.length,
  render: (d) => [
    note("Matched by reference, thread and sender — even when the supplier changed the subject."),
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

const newSuppliers = on({
  title: "New suppliers saved",
  hidden: (d) => !d.newSuppliers.length,
  render: (d) => [
    note(
      "Saved the moment they replied — contact, category and a dated price with its validity, even without an order.",
    ),
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

/** Lines picked for the next RFQs by default: those not yet asked of anyone. */
function picked(lines: CaseLine[]): number[] {
  const sendable = lines.filter((l) => !l.held);
  const fresh = sendable.filter((l) => !l.rfqs.length && !l.offers);
  return (fresh.length ? fresh : sendable).map((l) => l.lineNo);
}

const lineState = (l: CaseLine) =>
  `${l.qty} ${l.unit} · ${l.category}${l.held ? ` · held: ${l.held}` : l.rfqs.length ? ` · asked: ${l.rfqs.join(", ")}` : ""}${l.offers ? ` · ${l.offers} offer${l.offers > 1 ? "s" : ""}` : ""}`;

const composer = on({
  title: "Draft supplier RFQs",
  render: (d, { params }) => {
    const mode = params.send === "full" ? "full" : "split";
    const sendable = d.lines.filter((l) => !l.held);
    const held = d.lines.filter((l) => l.held);
    return [
      block("choice", {
        param: "send",
        label: "How to send",
        value: "split",
        options: [
          { value: "split", label: "Split by category" },
          { value: "full", label: "Full list" },
        ],
      }),
      note(
        mode === "split"
          ? "Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ."
          : "General chandlers receive every line in one RFQ.",
      ),
      block("list", {
        items: d.lines.map((l) => ({
          headline: `L${l.lineNo} · ${l.description}`,
          supporting: lineState(l),
          dot: l.held
            ? ("warning" as const)
            : l.offers
              ? ("success" as const)
              : l.rfqs.length
                ? ("info" as const)
                : undefined,
        })),
        empty: "This case has no lines yet.",
      }),
      block("actions", {
        items: [
          {
            label: "Draft RFQs",
            icon: "sparkles",
            variant: "tonal",
            prompt: "Draft supplier RFQs",
            disabled: !sendable.length,
            reason: sendable.length ? undefined : "Every line is held until clarified.",
            call: { path: "/sourcing/cases/$doc.id/plan", body: { mode } },
            fields: [
              {
                type: "select",
                name: "lineNos",
                label: "Lines",
                hasMany: true,
                required: true,
                defaultValue: picked(d.lines).map(String),
                options: sendable.map((l) => ({
                  value: String(l.lineNo),
                  label: `L${l.lineNo} · ${l.description} · ${lineState(l)}`,
                })),
                admin: {
                  description: held.length
                    ? `Held back until clarified: ${held.map((l) => `L${l.lineNo} (${l.held})`).join(" · ")}`
                    : "The system chooses the suppliers and drafts one anonymised RFQ each.",
                },
              },
            ],
            reply: true,
          },
        ],
      }),
    ];
  },
});

const ANONYMISED: { label: string; tone: Tone; icon: string }[] = [
  "Client name removed",
  "Vessel removed",
  "No customer files",
  "Our reference only",
].map((label) => ({ label, tone: "success", icon: "success" }));

/** The drafted RFQs kept on the server until a person sends (after a confirmation) or discards them. */
const drafts = on({
  title: "Drafted supplier RFQs",
  hidden: (d) => !d.plan?.drafts.length,
  head: (d) => {
    const plan = d.plan!;
    const n = plan.drafts.length;
    const s = n === 1 ? "" : "s";
    return {
      count: n,
      tags: [{ label: plan.mode === "full" ? "Full list" : "Split by category" }],
      actions: [
        {
          label: "Discard drafts",
          variant: "text",
          call: { path: "/sourcing/cases/$doc.id/plan/discard" },
          done: "Drafts discarded — nothing was sent",
        },
        {
          label: `Send ${n} RFQ${s}`,
          icon: "send",
          variant: "filled",
          call: { path: "/sourcing/cases/$doc.id/send" },
          confirm: {
            heading: "Send these supplier RFQs?",
            text: `${n} RFQ${s} to ${plan.drafts.map((r) => r.supplierName).join(", ")} — reply by ${at(plan.dueAt)}.\n\nThe client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a supplier answers, and the case owner is alerted after the second.`,
            label: "Send RFQs",
          },
          done: `${n} supplier RFQ${s} sent — replies will be matched automatically`,
        },
      ],
    };
  },
  render: (d) => {
    const plan = d.plan!;
    return [
      ...(plan.held.length
        ? [
            block("alert", {
              tone: "warning",
              text: `Held back until clarified: ${plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ")}`,
            }),
          ]
        : []),
      ...(plan.skipped.length ? [note(`Skipped (already asked): ${plan.skipped.join(" · ")}`)] : []),
      block("tags", { items: ANONYMISED }),
      ...plan.drafts.flatMap((r, i): ViewBlock[] => [
        ...(i ? [block("divider", {})] : []),
        block("list", {
          items: [
            {
              headline: `${r.supplierName} · ${r.reference}`,
              supporting: `${r.category} · L${r.lineNos.join(", L")} · ${r.note}`,
              tags: [{ label: "Draft" }],
              actions: [
                {
                  label: "Remove",
                  variant: "text",
                  call: { path: "/sourcing/cases/$doc.id/plan/remove", body: { reference: r.reference } },
                  done: `${r.reference} removed from the drafts`,
                },
              ],
            },
          ],
        }),
        block("message", { meta: [`To: ${r.preview.to}`], subject: r.preview.subject, body: r.preview.body }),
      ]),
    ];
  },
});

const reminders = on({
  title: "Reminders and escalation",
  render: (d) => {
    const open = d.rfqs.filter((r) => OPEN.includes(r.status) || r.escalated);
    return [
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
    ];
  },
});

export const caseRfqs = widgets({
  params: { send: "split" },
  widgets: [stats, table, arriving, review, { grid: [replies, newSuppliers], fit: "md" }, composer, drafts, reminders],
});
