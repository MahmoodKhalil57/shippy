import { figures, list, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/automations.ts";
import * as link from "../links.ts";
import { autoResolvedExceptions, automations, openExceptions } from "../queries/automations.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Automations & exceptions (/automations): the rule registry (trigger, owner, due, approval,
 * retry, stop condition: the automation-rules global's rows; management pauses and enables them),
 * the exception queue with an idempotent "Safe retry" (the integration-exceptions collection, its
 * actions on the collection), the AI review queue for low-confidence results and the audit log.
 * The registry, the queue, its counts and the audit log are data widgets; GET /api/automations
 * answers what spans the rules global, exceptions, messages and case lines (the figures and the
 * review queue). Actions: POST /api/automations/retry/:id, /review/:id, /rule
 * (../endpoints/platform.ts). Formatters: ../format/automations.ts.
 */
export const automationsPage = widgets({
  header: {
    eyebrow: m.page_automations_eyebrow(),
    heading: m.page_automations_heading(),
    subtitle: m.page_automations_subtitle(),
    actions: [
      { label: m.page_automations_all_exceptions(), href: link.list("integration-exceptions") },
      { label: m.page_automations_activity_log(), href: link.list("activities") },
    ],
  },
  // The figures across the top, the review queue and what runs on its own (and what needs a person)
  // in a row, then the tables.
  widgets: [
    figures({
      data: automations,
      labels: fmt.AUTOMATION_FIGURES,
      name: fmt.automationFigureName,
      format: fmt.automationFigures,
    }),
    // The exception queue's own counts, each linking to the list.
    {
      size: "s",
      metrics: {
        collection: "integration-exceptions",
        items: [
          {
            label: m.page_automations_open_exceptions(),
            where: openExceptions,
            tone: { some: "error", none: "success" },
            note: m.page_automations_nothing_silent(),
          },
          {
            label: m.page_automations_auto_resolved(),
            where: autoResolvedExceptions,
            tone: "success",
            note: m.page_automations_duplicates_caught(),
          },
        ],
      },
    },
    list({
      title: m.page_automations_review_queue(),
      size: "s",
      skeleton: "list",
      data: automations,
      format: fmt.reviewQueue,
    }),
    // Fixed text, no data: what runs on its own, and what waits for an authorised person.
    list({
      title: m.page_automations_automatic(),
      size: "s",
      format: fmt.iconLines("bolt", fmt.AUTOMATIC),
    }),
    list({
      title: m.page_automations_by_people(),
      size: "s",
      format: fmt.iconLines("user", fmt.BY_PEOPLE),
    }),
    // The exception queue: what failed and what it affects, each with its safe retry (the
    // collection's actions: they check the idempotency key first).
    {
      title: m.page_automations_queue_title(),
      subhead: m.page_automations_queue_subhead(),
      size: "l",
      records: {
        collection: "integration-exceptions",
        sort: "-occurredAt",
        limit: 20,
        columns: ["occurredAt", "summary", "idempotencyKey", "retries", "status"],
        supporting: { occurredAt: "source", summary: "impact" },
        labels: { occurredAt: m.page_automations_when(), summary: m.page_automations_what_happened() },
        more: true,
      },
    },
    // Every rule of the automation-rules global, switched on and off by management (the rows' own actions).
    {
      title: m.page_automations_registry_title(),
      subhead: m.page_automations_registry_subhead(),
      size: "l",
      records: {
        global: "automation-rules",
        field: "rules",
        columns: ["name", "trigger", "action", "owner", "approval", "retry", "stop", "state"],
        supporting: { name: "mode", action: "aiReview", owner: "due" },
        labels: { name: m.page_automations_rule(), owner: m.page_automations_owner_due() },
      },
    },
    // Every automatic step and human decision (the activities collection), latest first.
    {
      title: m.page_automations_audit_title(),
      subhead: m.page_automations_audit_subhead(),
      size: "l",
      records: {
        collection: "activities",
        sort: "-at",
        limit: 40,
        columns: ["at", "kind", "text", "case"],
        supporting: { kind: "actor", text: "rule" },
        labels: { at: m.page_automations_when(), kind: m.page_automations_who(), text: m.page_automations_what() },
      },
    },
    // Every AI call (the ai-calls collection), latest first: what it read, how sure it was, and
    // who confirmed, corrected or rejected the result.
    {
      title: m.page_automations_ai_log_title(),
      subhead: m.page_automations_ai_log_subhead(),
      size: "l",
      records: {
        collection: "ai-calls",
        sort: "-at",
        limit: 20,
        columns: ["at", "task", "subject", "confidence", "outcome"],
        supporting: { task: "model", subject: "case", outcome: "reviewedBy" },
        labels: { at: m.page_automations_when(), subject: m.page_automations_what_it_read() },
        more: true,
      },
    },
  ],
});
