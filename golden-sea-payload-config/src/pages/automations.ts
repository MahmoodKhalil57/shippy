import { figures, list, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/automations.ts";
import * as link from "../links.ts";
import { autoResolvedExceptions, automations, openExceptions } from "../queries/automations.ts";
import { m } from "../i18n/paraglide/messages.js";

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
  widgets: [
    figures({
      data: automations,
      labels: fmt.AUTOMATION_FIGURES,
      name: fmt.automationFigureName,
      format: fmt.automationFigures,
    }),
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
