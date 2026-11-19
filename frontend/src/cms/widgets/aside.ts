import type { Widget, WidgetScope } from "../../app/widgets/widget.ts";

/**
 * The side panel's counters: what each role steers by, as `counts` widgets (a count per `where`,
 * each opening its list). `$user.id` is the signed-in user. Placed by `admin.custom.aside`.
 */

type Where = Record<string, unknown>;
const LIVE: Where = { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } };
const PENDING: Where = { status: { not_in: ["Approved", "Rejected"] } };
const mine = (w: Where): Where => ({ and: [{ owner: { equals: "$user.id" } }, w] });

type Item = { label: string; collection: string; where: Where; note: string; tone?: "warning" };
const myDecisions: Item = {
  label: "Decisions waiting for me",
  collection: "approvals",
  where: { and: [PENDING, { approvers: { in: ["$user.id"] } }, { "decisions.user": { not_equals: "$user.id" } }] },
  note: "Approvals routed to you that you haven't decided",
  tone: "warning",
};
const exceptions: Item = {
  label: "Integration exceptions",
  collection: "integration-exceptions",
  where: { status: { in: ["Open", "Waiting for review"] } },
  note: "Failed mailbox, e-invoice or AI steps waiting for a person",
  tone: "warning",
};
const toCollect: Item = {
  label: "Invoices to collect",
  collection: "invoices",
  where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
  note: "Customer invoices with a balance still open",
};
const bills: Item = {
  label: "Supplier bills",
  collection: "supplier-bills",
  where: {},
  note: "Bills to match against the PO and goods received",
};
const liveCases: Item = {
  label: "Live cases",
  collection: "cases",
  where: LIVE,
  note: "Every case not yet settled, lost or expired",
};

const ROLES = ["management", "finance-director", "operations", "sales", "office-admin"];
const forRole =
  (...roles: string[]) =>
  ({ user }: WidgetScope) =>
    roles.includes(user.role ?? "");
const counters = (visible: Widget["visible"], items: Item[]): Widget => ({
  visible,
  counts: { collection: items[0]!.collection, items },
});

export const aside: Widget[] = [
  counters(forRole("management"), [
    myDecisions,
    liveCases,
    {
      label: "Awaiting internal approval",
      collection: "cases",
      where: { wait: { equals: "Awaiting internal approval" } },
      note: "Cases held for a margin, deposit or other approval",
    },
    exceptions,
  ]),
  counters(forRole("finance-director"), [
    myDecisions,
    toCollect,
    bills,
    { label: "Payments", collection: "payments", where: {}, note: "Payments in and out on record" },
  ]),
  counters(forRole("operations"), [
    {
      label: "Deliveries in progress",
      collection: "deliveries",
      where: { status: { not_equals: "Delivered" } },
      note: "Drops planned or on the way to a vessel",
    },
    bills,
    toCollect,
    exceptions,
  ]),
  counters(forRole("sales"), [
    { label: "My live cases", collection: "cases", where: mine(LIVE), note: "Cases you own that are still open" },
    {
      label: "Awaiting customer decision",
      collection: "cases",
      where: mine({ wait: { equals: "Awaiting customer decision" } }),
      note: "Quotes sent, waiting for the customer",
    },
    {
      label: "My pipeline",
      collection: "opportunities",
      where: { owner: { equals: "$user.id" } },
      note: "Prospects you're working on",
    },
    {
      label: "Quotations in draft",
      collection: "quotations",
      where: { status: { equals: "Draft" } },
      note: "Quotes being prepared, not yet sent",
    },
  ]),
  counters(forRole("office-admin"), [
    {
      label: "Inbox to triage",
      collection: "intake-messages",
      where: { status: { in: ["New", "Needs review"] } },
      note: "New messages and uncertain matches to check",
      tone: "warning",
    },
    {
      label: "Open follow-ups",
      collection: "tasks",
      where: { status: { equals: "Open" } },
      note: "Reminders, calls and messages still to do",
    },
    liveCases,
    exceptions,
  ]),
  counters(
    ({ user }) => !ROLES.includes(user.role ?? ""),
    [
      { label: "My live cases", collection: "cases", where: mine(LIVE), note: "Cases you own that are still open" },
      {
        label: "Awaiting supplier",
        collection: "cases",
        where: { wait: { equals: "Awaiting supplier" } },
        note: "Cases waiting for supplier replies",
      },
      {
        label: "Supplier RFQs awaiting reply",
        collection: "supplier-rfqs",
        where: { status: { equals: "Awaiting reply" } },
        note: "Requests suppliers haven't answered yet",
        tone: "warning",
      },
      {
        label: "My open tasks",
        collection: "tasks",
        where: mine({ status: { equals: "Open" } }),
        note: "Your follow-ups that are still open",
      },
    ],
  ),
];
