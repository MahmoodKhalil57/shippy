import { widgets, type RecordsSpec } from "saastemlycrm-design-system/contracts";
import * as link from "../links.ts";
import { decidedApprovals, openApprovals } from "../queries/approvals.ts";
import { m } from "../i18n/paraglide/messages.js";

const entry = (
  keep: Record<string, unknown> | undefined,
  where: Record<string, unknown>,
  empty: string,
  notice?: string,
): RecordsSpec => ({
  collection: "approvals",
  where,
  keep,
  sort: "-createdAt",
  limit: 50,
  layout: "entries",
  columns: ["status", "case", "requestedBy", "createdAt"],
  tags: ["type", "rule"],
  facts: ["progress", "whoDecides"],
  notes: "evidence",
  notice,
  empty,
});

export const approvalsPage = widgets({
  header: {
    eyebrow: m.page_approvals_eyebrow(),
    heading: m.page_approvals_heading(),
    subtitle: m.page_approvals_subtitle(),
    actions: [{ label: m.page_approvals_rules(), href: link.global("approval-rules") }],
  },
  widgets: [
    {
      title: m.page_approvals_by_kind(),
      size: "m",
      rows: 4,
      maxRows: 5,
      breakdown: { collection: "approvals", by: "type", as: "share" },
    },
    {
      size: "m",
      metrics: {
        collection: "approvals",
        items: [
          {
            label: m.page_approvals_waiting_for_you(),
            where: openApprovals,
            keep: { canDecide: { equals: true } },
            note: m.page_approvals_listed_approver(),
            tone: { some: "warning", none: "success" },
            main: true,
          },
          {
            label: m.page_approvals_waiting_for_others(),
            where: openApprovals,
            keep: { canDecide: { equals: false } },
            note: m.page_approvals_see_not_decide(),
          },
          {
            label: m.page_approvals_two_person(),
            where: { ...openApprovals, twoPerson: { equals: true } },
            note: m.page_approvals_finance_ceo(),
          },
          { label: m.page_approvals_decided(), where: decidedApprovals, note: m.page_approvals_kept_for_audit() },
        ],
      },
    },
    {
      title: m.page_approvals_waiting_for_you(),
      subhead: m.page_approvals_yours_subhead(),
      size: "m",
      records: entry({ canDecide: { equals: true } }, openApprovals, m.page_approvals_yours_empty()),
    },
    {
      title: m.page_approvals_waiting_for_others(),
      subhead: m.page_approvals_others_subhead(),
      size: "m",
      records: entry({ canDecide: { equals: false } }, openApprovals, m.page_approvals_others_empty(), "why"),
    },
    {
      title: m.page_approvals_recent_title(),
      subhead: m.page_approvals_recent_subhead(),
      size: "m",
      records: entry(undefined, decidedApprovals, m.page_approvals_recent_empty()),
    },
    {
      title: m.page_approvals_all(),
      size: "full",
      rows: 10,
      minRows: 6,
      collection: {
        collection: "approvals",
        key: "all",
        layout: "list",
        sort: "status",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
