import type { Endpoint } from "payload";
import { block, type Action, type Cell, type Tone, type View } from "../../app/view/schema.ts";
import { platformEndpoints, type AutomationsView } from "../endpoints/platform.ts";
import type { Doc } from "../types.ts";
import { bodyOf, formatDate, refuse, via } from "./via.ts";

/**
 * Automations & exceptions (/automations): the rule registry (trigger, owner, due, approval,
 * retry, stop condition — from the automation-rules global; management switches rules on and
 * off), the exception queue with an idempotent "Safe retry", the AI review queue for
 * low-confidence results and the audit log. Data and actions: /api/automations
 * (../endpoints/platform.ts).
 */

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

function retry(x: Doc, label: string, variant: Action["variant"]): Action {
  return { label, variant, call: { path: `/views/automations/retry/${encodeURIComponent(x.id)}` }, reply: true };
}

function exceptions(d: AutomationsView) {
  return block("card", {
    heading: "Exception queue",
    tags: [{ label: `${d.stats.open} open`, tone: d.stats.open ? "error" : "success" }],
    blocks: [
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
}

function review(d: AutomationsView) {
  return block("card", {
    heading: "AI review queue",
    count: d.review.length,
    countTone: d.review.length ? "warning" : "success",
    blocks: [
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
}

function registry(d: AutomationsView) {
  return block("card", {
    heading: "Rule registry",
    tags: [{ label: `${d.rules.length} rules` }],
    blocks: [
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
          const on = r.enabled !== false;
          const mode = MODE[s(r.mode)];
          const enabled: Cell = d.canEdit
            ? {
                text: `Enable ${s(r.name)}`,
                switch: { value: on, call: { path: "/views/automations/rule", body: { index: r.index } } },
              }
            : { text: on ? "On" : "Paused", tone: on ? "success" : "neutral", tag: true };
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
}

function audit(d: AutomationsView) {
  return block("card", {
    heading: "Audit log",
    tags: [{ label: `latest ${d.audit.length}` }],
    blocks: [
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
}

export function automationsView(d: AutomationsView): View {
  const st = d.stats;
  return {
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
    blocks: [
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
      block("grid", { fit: "lg", blocks: [exceptions(d), review(d)] }),
      registry(d),
      block("card", {
        heading: "Automation boundaries",
        blocks: [
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
        ],
      }),
      audit(d),
    ],
  };
}

export const viewEndpoints: Endpoint[] = [
  {
    // GET /api/views/automations: automations & exceptions as a View (src/app/view).
    path: "/views/automations",
    method: "get",
    handler: async (req) => {
      const d = await via<AutomationsView>(platformEndpoints, "get", "/automations", req);
      return d instanceof Response ? d : Response.json(automationsView(d));
    },
  },
  {
    // POST /api/views/automations/retry/:id: the safe retry, answered with what it did.
    path: "/views/automations/retry/:id",
    method: "post",
    handler: async (req) => {
      const id = s(req.routeParams?.id);
      const r = await via<{ message: string; alreadyDone: boolean }>(
        platformEndpoints,
        "post",
        "/automations/retry/:id",
        req,
        { id },
      );
      if (r instanceof Response) return r;
      return Response.json({ ...r, message: r.alreadyDone ? r.message : `Retried safely — ${r.message}` });
    },
  },
  {
    // POST /api/views/automations/rule { index, value }: switch a rule on or off (management), logged.
    path: "/views/automations/rule",
    method: "post",
    handler: async (req) => {
      if (!req.user) return refuse("Please sign in.", 401);
      if (s((req.user as Doc).role) !== "management") return refuse("Management can pause or enable rules.");
      const b = await bodyOf(req);
      const enabled = b.value === true;
      const g = await req.payload.findGlobal({ slug: "automation-rules", depth: 0 } as never);
      const list = (g.rules as Record<string, unknown>[] | undefined) ?? [];
      const rule = list[Number(b.index)];
      if (!rule) return refuse("Rule not found.", 404);
      const rules = list.map((r, i) => (i === Number(b.index) ? { ...r, enabled } : r));
      await req.payload.updateGlobal({
        slug: "automation-rules",
        data: { rules },
        req,
        overrideAccess: false,
      } as never);
      await req.payload.create({
        collection: "activities",
        data: {
          kind: "human",
          text: `${enabled ? "Enabled" : "Paused"} automation “${s(rule.name)}”.`,
          entity: "globals/automation-rules",
          actor: (req.user as Doc).id,
        },
        req,
        overrideAccess: false,
      } as never);
      return Response.json({ ok: true, message: `${s(rule.name)} ${enabled ? "enabled" : "paused"} (logged)` });
    },
  },
];
