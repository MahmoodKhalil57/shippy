import { custom, gauges, steps, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/case-overview.ts";
import { caseOverview as overview } from "../queries/case-overview.ts";
import { m } from "../i18n/paraglide/messages.js";

export const caseOverview = widgets({
  widgets: [
    steps({
      title: m.page_overview_lifecycle_title(),
      subhead: m.page_overview_lifecycle_subhead(),
      size: "full",
      data: overview,
      format: fmt.lifecycle,
    }),
    {
      title: m.page_overview_next_action(),
      size: "s",
      fields: {
        fields: ["nextAction", "blocker", "deadline", "due", "vesselPort", "eta", "customerRef", "value"],
        layout: "inline",
        actions: false,
      },
    },
    {
      title: m.page_overview_line_progress(),
      subhead: m.page_overview_line_progress_subhead(),
      size: "s",
      empty: { when: (d) => !(d as { lineCount?: unknown }).lineCount, heading: m.page_overview_no_lines() },
      fields: {
        fields: [
          "lineCount.readyPct",
          "lineCount.ready",
          "lineCount.waiting",
          "lineCount.blocked",
          "lineCount.noOffer",
        ],
        actions: false,
      },
    },
    {
      title: m.page_overview_owner_backup(),
      size: "s",
      fields: { fields: ["owner", "backup"] },
    },
    {
      title: m.page_overview_handover_title(),
      size: "s",
      empty: { when: (d) => !(d as { handoverNote?: string }).handoverNote, heading: m.page_overview_no_handover() },
      fields: { fields: ["handoverNote"], actions: false },
    },
    {
      title: m.page_overview_open_tasks(),
      size: "s",
      collection: {
        collection: "tasks",
        key: "open-tasks",
        layout: "list",
        where: { case: { equals: "$doc.id" }, status: { equals: "Open" } },
        sort: "due",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_overview_line_status(),
      size: "l",
      records: {
        doc: true,
        field: "items",
        columns: ["lineNo", "description", "status", "aiRead"],
        labels: { lineNo: "#", description: m.page_overview_line() },
        empty: m.page_overview_no_lines(),
      },
    },
    gauges({
      title: m.page_overview_after_order(),
      size: "s",
      data: overview,
      empty: { when: ({ fulfilment: f }) => !f.started, heading: m.page_overview_nothing_ordered() },
      format: fmt.fulfilment,
    }),
    {
      title: m.page_overview_contact_rule(),
      size: "s",
      fields: { fields: ["customer", "customer.contactRule", "customer.contactNote"], actions: false },
    },
    {
      title: m.page_overview_clarifications_title(),
      subhead: m.page_overview_clarifications_subhead(),
      size: "l",
      records: {
        doc: true,
        field: "clarifications",
        columns: ["lineNo", "to", "question", "reply"],
        supporting: { to: "via", question: "askedBy", reply: "answeredAt" },
        labels: { lineNo: m.page_overview_line(), to: m.page_overview_to_via() },
        empty: m.page_overview_no_clarifications(),
      },
    },
    {
      title: m.page_overview_timeline_title(),
      subhead: m.page_overview_timeline_subhead(),
      size: "m",
      collection: {
        collection: "activities",
        key: "activity-timeline-audit-",
        layout: "timeline",
        where: { case: { equals: "$doc.id" } },
        sort: "-at",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    custom({
      title: m.page_overview_summary(),
      size: "s",
      data: overview,
      format: fmt.timelineSummary,
    }),
  ],
});
