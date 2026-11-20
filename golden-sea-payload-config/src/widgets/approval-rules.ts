import type { Widget } from "saastemlycrm-design-system/contracts";

/**
 * The approval rules global (/globals/approval-rules), a Payload Global view: above its form, what
 * these rules govern right now. Two `s` tiles side by side on a laptop or desktop, stacked on a
 * phone. No endpoint: both are no-code data widgets on the approvals collection.
 */
export const approvalRulesBefore: Widget[] = [
  {
    title: "Requests under these rules",
    size: "s",
    counts: {
      collection: "approvals",
      items: [
        { label: "Waiting", where: { status: { equals: "Pending" } }, tone: "warning" },
        { label: "Halfway", where: { status: { like: "Approved 1 of" } }, note: "Two-person rules" },
        { label: "Approved", where: { status: { equals: "Approved" } }, tone: "success" },
        { label: "Rejected", where: { status: { equals: "Rejected" } }, tone: "error" },
      ],
    },
  },
  {
    title: "Waiting for a decision",
    size: "s",
    records: {
      collection: "approvals",
      where: { status: { equals: "Pending" } },
      sort: "-createdAt",
      limit: 5,
      columns: ["title", "type"],
      layout: "list",
      empty: "Nothing is waiting for a decision.",
      more: true,
    },
  },
];
