import type { Endpoint, PayloadRequest } from "payload";
import { block, type Row, type Tone, type View } from "../../app/view/schema.ts";
import { overview, type CaseOverview, type TimelineEntry } from "../endpoints/platform.ts";

/**
 * Case tab "Overview": the case at a glance. Where it is on the 16-step flow, how far each line
 * really is (partials never read as done), the next action and blocker, owner and backup with an
 * AI-drafted handover a person confirms (`gs-case-handover`), the clarification log, the
 * customer's contact rule and the activity timeline (automatic vs human vs alert, with the rule
 * that fired): the audit trail. Data and actions: /api/case-overview/:id (../endpoints/platform.ts).
 */

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

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
/** A date with no time of day (midnight) shows as just the day. */
const formatDate = (v?: string) => {
  if (!v) return "";
  const d = new Date(v);
  return d.getHours() === 0 && d.getMinutes() === 0 ? dayFmt.format(d) : dateFmt.format(d);
};

const bar = (label: string, value: number, total: number, tone: Tone) =>
  block("gauges", {
    items: [
      {
        label,
        value,
        max: Math.max(total, 1),
        tone,
        valueText: `${value} / ${total}`,
        a11y: `${label}: ${value} of ${total} lines`,
      },
    ],
  });

function lifecycle(d: CaseOverview) {
  const step = d.steps[d.current]!;
  return block("card", {
    heading: "Lifecycle — first email to last payment",
    tags: [{ label: `Step ${d.current + 1} of ${d.steps.length}`, tone: "primary" }],
    blocks: [
      block("steps", {
        current: d.current,
        tone: d.halted === "lost" ? "error" : "primary",
        items: d.steps.map((s) => ({ label: s.label })),
      }),
      block("tags", { items: [{ label: `Phase ${step.phase}` }] }),
      block("text", { variant: "title-md", text: `${step.label}: ${d.stage}` }),
      block("text", { muted: true, text: step.detail }),
      ...(d.halted
        ? [
            block("alert", {
              tone: d.halted === "lost" ? "error" : "warning",
              text: `${d.halted === "lost" ? "The case ended here" : "Paused at the customer's decision"} — ${d.next}`,
            }),
          ]
        : []),
    ],
  });
}

function lines(d: CaseOverview) {
  const l = d.lines;
  const f = d.fulfilment;
  const pct = l.total ? Math.round((l.ready / l.total) * 100) : 0;
  return block("card", {
    heading: "Line progress",
    tags: [{ label: `${pct}% ready`, tone: l.ready === l.total && l.total ? "success" : "warning" }],
    blocks: [
      block("text", {
        muted: true,
        text: `Each line moves on its own. A case with some lines ready is ${pct}% — never “done” until every line is.`,
      }),
      block("grid", {
        fit: "xs",
        blocks: [
          bar("Ready", l.ready, l.total, "success"),
          bar("Waiting", l.waiting, l.total, "warning"),
          bar("Blocked", l.blocked, l.total, "error"),
          bar("No offer", l.noOffer, l.total, "neutral"),
        ],
      }),
      ...(f.started
        ? [
            block("divider", {}),
            block("text", { variant: "label-lg", text: "After the order" }),
            block("grid", {
              fit: "xs",
              blocks: [
                bar("Ordered", f.ordered, f.total, "info"),
                bar("Received", f.received, f.total, "info"),
                bar("Delivered", f.delivered, f.total, "info"),
                bar("Invoiced", f.invoiced, f.total, "info"),
              ],
            }),
            ...(f.notes.length
              ? [block("alert", { tone: "warning", text: f.notes.map((n) => `⚑ ${n}`).join("\n") })]
              : []),
          ]
        : []),
      ...(l.rows.length
        ? [
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
          ]
        : []),
    ],
  });
}

function clarifications(d: CaseOverview) {
  const open = d.clarifications.filter((q) => q.open).length;
  return block("card", {
    heading: "Clarifications log",
    tags: [{ label: `${open} open`, tone: open ? "warning" : "success" }],
    blocks: [
      block("text", {
        muted: true,
        variant: "body-sm",
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
}

function timeline(d: CaseOverview, filter: string) {
  const entries = d.timeline.filter((t) => filter === "all" || t.kind === filter);
  const count = (k: TimelineEntry["kind"]) => d.timeline.filter((t) => t.kind === k).length;
  return block("card", {
    heading: "Activity timeline — audit trail",
    blocks: [
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
        variant: "body-sm",
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
    ],
  });
}

function next(d: CaseOverview) {
  return block("card", {
    heading: "Next action",
    blocks: [
      block("text", { variant: "label-lg", text: d.next || "—" }),
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
}

function owner(d: CaseOverview) {
  const person = (p: CaseOverview["owner"], role: string) =>
    p
      ? { headline: p.name, supporting: role, icon: "user" }
      : { headline: `No ${role.toLowerCase()} set`, icon: "user" };
  return block("card", {
    heading: "Owner & backup",
    blocks: [
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
      ...(d.canReassign
        ? [
            block("custom", {
              element: "gs-case-handover",
              props: {
                caseDoc: d.id,
                caseId: d.caseId,
                options: d.team
                  .filter((p) => p.id !== d.owner?.id)
                  .map((p) => ({ label: `${p.name}${p.id === d.backup?.id ? " (backup)" : ""}`, value: p.id })),
                suggested: d.backup && d.backup.id !== d.owner?.id ? d.backup.id : "",
              },
            }),
          ]
        : []),
    ],
  });
}

function contactRule(d: CaseOverview) {
  const c = d.customer;
  return block("card", {
    heading: "Customer contact rule",
    blocks: [
      block("text", { variant: "title-md", text: c.name }),
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
        variant: "body-sm",
        text: c.strict
          ? "Follow-ups for this customer are internal reminders only — the system refuses customer-facing chasers."
          : c.contactRule === "one-follow-up"
            ? "One customer follow-up per quotation; after that, internal reminders only."
            : "Follow-ups allowed, drafted for a person to send.",
      }),
    ],
  });
}

function tasks(d: CaseOverview) {
  return block("card", {
    heading: "Open tasks",
    count: d.tasks.length,
    blocks: [
      block("list", {
        empty: "Nothing open.",
        items: d.tasks.map((t) => ({
          headline: t.title,
          href: `/collections/tasks/${t.id}`,
          supporting: [
            t.channel,
            t.owner,
            t.due ? formatDate(t.due) : "",
            t.rule ? `rule: ${t.rule}` : "",
            t.stop ? `stops on: ${t.stop}` : "",
          ]
            .filter(Boolean)
            .join(" · "),
        })),
      }),
    ],
  });
}

export function caseOverviewView(d: CaseOverview, filter = "all"): View {
  const show = ["auto", "human", "alert"].includes(filter) ? filter : "all";
  return {
    blocks: [
      lifecycle(d),
      block("split", {
        main: [lines(d), clarifications(d), timeline(d, show)],
        side: [next(d), owner(d), contactRule(d), tasks(d)],
      }),
    ],
  };
}

const param = (v: unknown) => (typeof v === "string" ? v : "");
const fail = (status: number, message: string) => Response.json({ errors: [{ message }] }, { status });

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/case-overview/:id?show=all|auto|human|alert: the "Overview" tab as a View.
    path: "/views/case-overview/:id",
    method: "get",
    handler: async (req: PayloadRequest) => {
      if (!req.user) return fail(401, "Please sign in.");
      const o = await overview(req, param(req.routeParams?.id));
      if (!o) return fail(404, "Case not found.");
      return Response.json(caseOverviewView(o, param(req.query?.show) || "all"));
    },
  },
];
