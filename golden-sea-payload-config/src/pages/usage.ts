import { bullet, figures, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/service.ts";
import * as link from "../links.ts";
import { usage } from "../queries/service.ts";
import { m } from "../i18n/paraglide/messages.js";

export const usagePage = widgets({
  header: {
    eyebrow: m.page_usage_eyebrow(),
    heading: m.page_usage_heading(),
    subtitle: m.page_usage_subtitle(),
    actions: [
      { label: m.page_usage_ai_log(), href: link.list("ai-calls"), main: true },
      { label: m.page_usage_edit_plan(), href: link.global("service-usage") },
    ],
  },
  widgets: [
    bullet({
      title: m.page_usage_against_plan(),
      size: "l",
      rows: 8,
      skeleton: "list",
      data: usage,
      format: fmt.againstPlan,
    }),
    {
      title: m.page_usage_ai_calls(),
      size: "s",
      rows: 8,
      breakdown: { collection: "ai-calls", by: "task", as: "ring" },
    },
    figures({ data: usage, labels: fmt.MEASURED, format: fmt.measured }),
    {
      title: m.page_usage_support_title(),
      subhead: m.page_usage_support_subhead(),
      size: "m",
      records: {
        global: "service-usage",
        field: "support",
        columns: ["date", "topic", "kind", "hours"],
      },
    },
    {
      title: m.page_usage_changes_title(),
      subhead: m.page_usage_changes_subhead(),
      size: "m",
      records: {
        global: "service-usage",
        field: "changes",
        columns: ["requestedAt", "title", "requestedBy", "status"],
      },
    },
  ],
});
