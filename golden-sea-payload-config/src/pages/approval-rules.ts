import type { Widget } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

export const approvalRulesBefore: Widget[] = [
  {
    title: m.page_approval_rules_requests_title(),
    size: "s",
    counts: {
      collection: "approvals",
      items: [
        { label: m.page_approval_rules_waiting(), where: { status: { equals: "Pending" } }, tone: "warning" },
        {
          label: m.page_approval_rules_halfway(),
          where: { status: { like: "Approved 1 of" } },
          note: m.page_approval_rules_two_person(),
        },
        { label: m.page_approval_rules_approved(), where: { status: { equals: "Approved" } }, tone: "success" },
        { label: m.page_approval_rules_rejected(), where: { status: { equals: "Rejected" } }, tone: "error" },
      ],
    },
  },
  {
    title: m.page_approval_rules_waiting_title(),
    size: "s",
    collection: {
      collection: "approvals",
      key: "waiting-for-a-decision",
      layout: "list",
      where: { status: { equals: "Pending" } },
      sort: "-createdAt",
      hide: ["export", "columns", "select", "around", "search", "filters", "create"],
    },
  },
];
