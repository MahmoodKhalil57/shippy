import type { Widget } from "saastemlycrm-design-system/contracts";

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
  // The newest requests still waiting for a decision, with a link to all of them.
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
