import { figures, list, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/automations.ts";
import * as link from "../links.ts";
import { autoResolvedExceptions, automations, openExceptions } from "../queries/automations.ts";

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
    eyebrow: "Work · automation",
    heading: "Automations & exceptions",
    subtitle:
      "Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition. Reprocessing never creates duplicates; failures land in the exception queue with a safe retry.",
    actions: [
      { label: "All exceptions", href: link.list("integration-exceptions") },
      { label: "Full activity log", href: link.list("activities") },
    ],
  },
  // The figures across the top, the review queue and what runs on its own (and what needs a person)
  // in a row, then the tables.
  widgets: [
    figures({ data: automations, labels: fmt.AUTOMATION_FIGURES, format: fmt.automationFigures }),
    // The exception queue's own counts, each linking to the list.
    {
      size: "s",
      metrics: {
        collection: "integration-exceptions",
        items: [
          {
            label: "Open exceptions",
            where: openExceptions,
            tone: { some: "error", none: "success" },
            note: "nothing fails silently",
          },
          {
            label: "Auto-resolved",
            where: autoResolvedExceptions,
            tone: "success",
            note: "duplicates caught by idempotency key",
          },
        ],
      },
    },
    list({
      title: "AI review queue",
      size: "s",
      skeleton: "list",
      data: automations,
      format: fmt.reviewQueue,
    }),
    // Fixed text, no data: what runs on its own, and what waits for an authorised person.
    list({
      title: "Runs automatically under approved rules",
      size: "s",
      format: fmt.iconLines("bolt", fmt.AUTOMATIC),
    }),
    list({
      title: "Prepared for an authorised person",
      size: "s",
      format: fmt.iconLines("user", fmt.BY_PEOPLE),
    }),
    // The exception queue: what failed and what it affects, each with its safe retry (the
    // collection's actions: they check the idempotency key first).
    {
      title: "Exception queue",
      subhead:
        "A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported or sent twice. Retrying a resolved item changes nothing.",
      size: "l",
      records: {
        collection: "integration-exceptions",
        sort: "-occurredAt",
        limit: 20,
        columns: ["occurredAt", "summary", "idempotencyKey", "retries", "status"],
        supporting: { occurredAt: "source", summary: "impact" },
        labels: { occurredAt: "When", summary: "What happened" },
        more: true,
      },
    },
    // Every rule of the automation-rules global, switched on and off by management (the rows' own actions).
    {
      title: "Rule registry",
      subhead: "Every rule is explicit; management pauses or enables one, and each change is logged.",
      size: "l",
      records: {
        global: "automation-rules",
        field: "rules",
        columns: ["name", "trigger", "action", "owner", "approval", "retry", "stop", "state"],
        supporting: { name: "mode", action: "aiReview", owner: "due" },
        labels: { name: "Rule", owner: "Owner · due" },
      },
    },
    // Every automatic step and human decision (the activities collection), latest first.
    {
      title: "Audit log",
      subhead: "Every automatic step and human decision, append-only.",
      size: "l",
      records: {
        collection: "activities",
        sort: "-at",
        limit: 40,
        columns: ["at", "kind", "text", "case"],
        supporting: { kind: "actor", text: "rule" },
        labels: { at: "When", kind: "Who", text: "What" },
      },
    },
    // Every AI call (the ai-calls collection), latest first: what it read, how sure it was, and
    // who confirmed, corrected or rejected the result.
    {
      title: "AI log",
      subhead: "Every AI call: what it read, how sure it was, and the person who checked it.",
      size: "l",
      records: {
        collection: "ai-calls",
        sort: "-at",
        limit: 20,
        columns: ["at", "task", "subject", "confidence", "outcome"],
        supporting: { task: "model", subject: "case", outcome: "reviewedBy" },
        labels: { at: "When", subject: "What it read" },
        more: true,
      },
    },
  ],
});
