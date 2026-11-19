import { block, type Action, type Cell, type Tone } from "../../app/widgets/schema.ts";
import { widgets, type Source, type Widget } from "../../app/widgets/widget.ts";
import type { AutomationsView } from "../endpoints/platform.ts";
import type { Doc } from "../../mock/types.ts";
import { formatDate } from "./format.ts";

/**
 * Automations & exceptions (/automations): the rule registry (trigger, owner, due, approval,
 * retry, stop condition — from the automation-rules global; management switches rules on and
 * off), the exception queue with an idempotent "Safe retry", the AI review queue for
 * low-confidence results and the audit log. Data: GET /api/automations; actions: POST
 * /api/automations/retry/:id, /review/:id, /rule (../endpoints/platform.ts).
 */

const data: Source = { endpoint: "/automations" };
const on = (w: Widget<AutomationsView>): Widget<AutomationsView> => ({ source: data, ...w });

const MODE: Record<string, { label: string; tone: Tone }> = {
  auto: { label: "Automatic", tone: "success" },
  "pre-approved": { label: "Automatic (pre-approved)", tone: "info" },
  prepare: { label: "Prepared for review", tone: "warning" },
};
const STATUS_TONE: Record<string, Tone> = {
  Open: "error",
  "Waiting for review": "warning",
  Resolved: "success",
  "Auto-resolved": "success",
  Ignored: "neutral",
};
const KIND_TONE = { auto: "info", human: "success", alert: "warning" } as const;
const KIND_LABEL = { auto: "Automatic", human: "Human", alert: "Alert" } as const;

const s = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const muted = (text: string) => block("text", { text, muted: true, variant: "body-sm" });

const AUTO = [
  "Capture emails, link files, extract draft data, spot likely duplicates",
  "Assign owners, update proven events, calculate waiting times",
  "Calculate costs, FX conversions, margins and comparisons",
  "Create reminders, escalations, dashboards and daily briefings",
  "Prepare linked quotations, POs, bills and invoice drafts",
];
const PEOPLE = [
  "Uncertain matches, technical interpretation, missing information",
  "Owner overrides, exception resolution, discretionary closure",
  "Final selling prices, discounts, substitutions, supplier selection",
  "External messages and follow-ups unless explicitly pre-approved",
  "Commercial commitments, accounting postings and payments",
];

/** The safe retry: the endpoint answers with what it did (the snackbar). */
const retry = (x: Doc, label: string, variant: Action["variant"]): Action => ({
  label,
  variant,
  call: { path: `/automations/retry/${encodeURIComponent(x.id)}` },
  reply: true,
});

const stats = on({
  skeleton: "stats",
  render: ({ stats: st }) =>
    block("stats", {
      size: "md",
      items: [
        { label: "Rules", value: `${st.enabled}/${st.rules}`, note: "enabled · every one explicit" },
        { label: "AI-assisted", value: String(st.ai), note: "drafts only, confidence on every value" },
        {
          label: "Open exceptions",
          value: String(st.open),
          note: "nothing fails silently",
          tone: st.open ? "error" : "success",
        },
        {
          label: "Waiting for review",
          value: String(st.review),
          note: "low-confidence results",
          tone: st.review ? "warning" : "success",
        },
        {
          label: "Auto-resolved",
          value: String(st.autoResolved),
          note: "duplicates caught by idempotency key",
          tone: "success",
        },
      ],
    }),
});

const exceptions = on({
  title: "Exception queue",
  skeleton: "table",
  head: (d) => ({ tags: [{ label: `${d.stats.open} open`, tone: d.stats.open ? "error" : "success" }] }),
  render: (d) => [
    muted(
      "A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported or sent twice. Retrying a resolved item changes nothing.",
    ),
    block("table", {
      columns: [
        { key: "when", label: "When" },
        { key: "summary", label: "What happened", supporting: "impact" },
        { key: "key", label: "Idempotency key" },
        { key: "retries", label: "Retries" },
        { key: "status", label: "Status" },
        { key: "action", label: "" },
      ],
      rows: d.exceptions.map((x) => ({
        when: formatDate(x.occurredAt),
        summary: { text: s(x.summary), strong: true, tags: [{ label: s(x.source) }] },
        impact: s(x.impact),
        key: s(x.idempotencyKey) ? { text: s(x.idempotencyKey), mono: true } : null,
        retries: s(x.retries) || "0",
        status: { text: s(x.status), tone: STATUS_TONE[s(x.status)] ?? "neutral", tag: true },
        action:
          x.status === "Open"
            ? { text: "", actions: [retry(x, "Safe retry", "tonal")] }
            : x.status === "Waiting for review"
              ? { text: "In the review queue", tone: "neutral" }
              : { text: "", actions: [retry(x, "Retry again", "text")] },
      })),
    }),
  ],
});

const review = on({
  title: "AI review queue",
  skeleton: "list",
  head: (d) => ({ count: d.review.length, countTone: d.review.length ? "warning" : "success" }),
  render: (d) => [
    muted(
      "Below the confidence threshold the AI never applies a value: it leaves the field blank or the match unlinked and waits here for a person.",
    ),
    block("list", {
      empty: "Nothing waiting for review.",
      items: d.review.map((r) => ({
        headline: r.title,
        supporting: r.detail,
        icon: "sparkles",
        tags:
          r.confidence === undefined ? undefined : [{ label: `${Math.round(r.confidence * 100)}%`, tone: "warning" }],
        actions: [
          { label: "Open", href: r.href, variant: "text" },
          ...(r.kind === "exception"
            ? [
                {
                  label: "Mark reviewed",
                  call: { path: `/automations/review/${encodeURIComponent(r.id)}`, body: {} },
                  confirm: {
                    heading: "Mark as reviewed?",
                    text: `${r.title}\nConfirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this.`,
                    label: "Confirm reviewed",
                  },
                  done: "Reviewed — your name is on the audit log",
                } satisfies Action,
              ]
            : []),
        ],
      })),
    }),
  ],
});

const registry = on({
  title: "Rule registry",
  skeleton: "table",
  head: (d) => ({ tags: [{ label: `${d.rules.length} rules` }] }),
  render: (d) => [
    muted(
      d.canEdit
        ? "You can pause or enable rules; each change is logged."
        : "Management can pause or enable rules; everyone can read them.",
    ),
    block("table", {
      columns: [
        { key: "name", label: "Rule" },
        { key: "trigger", label: "Trigger" },
        { key: "action", label: "Action" },
        { key: "owner", label: "Owner · due" },
        { key: "approval", label: "Approval" },
        { key: "retry", label: "Retry" },
        { key: "stop", label: "Stop condition" },
        { key: "enabled", label: "On" },
      ],
      rows: d.rules.map((r) => {
        const enabledNow = r.enabled !== false;
        const mode = MODE[s(r.mode)];
        const enabled: Cell = d.canEdit
          ? {
              text: `Enable ${s(r.name)}`,
              switch: { value: enabledNow, call: { path: "/automations/rule", body: { index: r.index } } },
            }
          : { text: enabledNow ? "On" : "Paused", tone: enabledNow ? "success" : "neutral", tag: true };
        return {
          name: {
            text: s(r.name),
            strong: true,
            tags: [
              { label: mode?.label ?? s(r.mode), tone: mode?.tone ?? "neutral" },
              ...(r.usesAI ? [{ label: "AI-assisted", tone: "primary" as const }] : []),
              ...(typeof r.confidenceThreshold === "number"
                ? [{ label: `review < ${Math.round(r.confidenceThreshold * 100)}%` }]
                : []),
            ],
          },
          trigger: s(r.trigger),
          action: s(r.action),
          owner: `${s(r.owner) || "—"} · ${s(r.due) || "—"}`,
          approval: s(r.approval) || "—",
          retry: s(r.retry) || "—",
          stop: s(r.stop) || "—",
          enabled,
        };
      }),
    }),
  ],
});

/** Fixed text: no data. */
const boundaries: Widget = {
  title: "Automation boundaries",
  render: () =>
    block("grid", {
      fit: "sm",
      blocks: [
        block("card", {
          variant: "filled",
          heading: "Runs automatically under approved rules",
          blocks: [block("list", { items: AUTO.map((headline) => ({ headline, icon: "bolt" })) })],
        }),
        block("card", {
          variant: "filled",
          heading: "Prepared for an authorised person",
          blocks: [block("list", { items: PEOPLE.map((headline) => ({ headline, icon: "user" })) })],
        }),
      ],
    }),
};

const audit = on({
  title: "Audit log",
  skeleton: "table",
  head: (d) => ({ tags: [{ label: `latest ${d.audit.length}` }] }),
  render: (d) => [
    muted("Every automatic step and human decision, append-only."),
    block("table", {
      columns: [
        { key: "at", label: "When" },
        { key: "kind", label: "Who", supporting: "actor" },
        { key: "text", label: "What", supporting: "rule" },
        { key: "case", label: "Case" },
      ],
      rows: d.audit.map((a) => ({
        at: formatDate(a.at),
        kind: { text: KIND_LABEL[a.kind], tone: KIND_TONE[a.kind], tag: true },
        actor: a.actor,
        text: a.text,
        rule: a.rule ? `rule: ${a.rule}` : "",
        case: a.caseHref ? { text: a.caseId ?? "", href: a.caseHref } : { text: a.entity || "—", tone: "neutral" },
      })),
    }),
  ],
});

export const automationsPage = widgets({
  header: {
    eyebrow: "Work · automation",
    heading: "Automations & exceptions",
    subtitle:
      "Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition. Reprocessing never creates duplicates; failures land in the exception queue with a safe retry.",
    actions: [
      { label: "All exceptions", href: "/collections/integration-exceptions" },
      { label: "Full activity log", href: "/collections/activities" },
    ],
  },
  widgets: [stats, { grid: [exceptions, review], fit: "lg" }, registry, boundaries, audit],
});
