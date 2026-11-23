import type { Widget } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The approval rules global (/globals/approval-rules), a Payload Global view: above its form, what
 * these rules govern right now (its `custom.edit.before`, ../globals/index.ts). Two `s` tiles side
 * by side on a laptop or desktop, stacked on a phone. Both are no-code widgets on the approvals
 * collection: no endpoint, no formatter.
 */
export const approvalRulesBefore: Widget[] = [
  // How many requests stand where under these rules (waiting, halfway through a two-person rule,
  // approved, rejected), each opening its list.
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
  // The newest requests still waiting for a decision, with a link to all of them.
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
