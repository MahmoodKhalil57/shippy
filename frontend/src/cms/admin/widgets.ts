import type { SideWidget } from "../types.ts";

type Where = Record<string, unknown>;

/** What each counter means, under its label. */
const WIDGET_HINTS: Record<string, string> = {
  "Decisions waiting for me": "Approvals routed to you that you haven't decided",
  "Live cases": "Every case not yet settled, lost or expired",
  "Awaiting internal approval": "Cases held for a margin, deposit or other approval",
  "Integration exceptions": "Failed mailbox, e-invoice or AI steps waiting for a person",
  "Invoices to collect": "Customer invoices with a balance still open",
  "Supplier bills": "Bills to match against the PO and goods received",
  Payments: "Payments in and out on record",
  "Deliveries in progress": "Drops planned or on the way to a vessel",
  "My live cases": "Cases you own that are still open",
  "Awaiting customer decision": "Quotes sent, waiting for the customer",
  "My pipeline": "Prospects you're working on",
  "Quotations in draft": "Quotes being prepared, not yet sent",
  "Inbox to triage": "New messages and uncertain matches to check",
  "Open follow-ups": "Reminders, calls and messages still to do",
  "Awaiting supplier": "Cases waiting for supplier replies",
  "Supplier RFQs awaiting reply": "Requests suppliers haven't answered yet",
  "My open tasks": "Your follow-ups that are still open",
};

const LIVE: Where = { stage: { not_in: ["Lost", "Expired", "Closed — settled"] } };
const PENDING: Where = { status: { not_in: ["Approved", "Rejected"] } };

/** The side panel's counters for each role (signed-in user `me`): what that role steers by. */
function roleWidgets({ id: me, role = "" }: { id: string; role?: string }): SideWidget[] {
  const mine = (w: Where): Where => ({ and: [{ owner: { equals: me } }, w] });
  const myDecisions: SideWidget = {
    label: "Decisions waiting for me",
    slug: "approvals",
    where: { and: [PENDING, { approvers: { in: [me] } }, { "decisions.user": { not_equals: me } }] },
    alert: true,
  };
  const exceptions: SideWidget = {
    label: "Integration exceptions",
    slug: "integration-exceptions",
    where: { status: { in: ["Open", "Waiting for review"] } },
    alert: true,
  };
  const toCollect: SideWidget = {
    label: "Invoices to collect",
    slug: "invoices",
    where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
  };
  const bills: SideWidget = { label: "Supplier bills", slug: "supplier-bills", where: {} };
  const inbox: SideWidget = {
    label: "Inbox to triage",
    slug: "intake-messages",
    where: { status: { in: ["New", "Needs review"] } },
    alert: true,
  };
  switch (role) {
    case "management":
      return [
        myDecisions,
        { label: "Live cases", slug: "cases", where: LIVE },
        {
          label: "Awaiting internal approval",
          slug: "cases",
          where: { wait: { equals: "Awaiting internal approval" } },
        },
        exceptions,
      ];
    case "finance-director":
      return [myDecisions, toCollect, bills, { label: "Payments", slug: "payments", where: {} }];
    case "operations":
      return [
        { label: "Deliveries in progress", slug: "deliveries", where: { status: { not_equals: "Delivered" } } },
        bills,
        toCollect,
        exceptions,
      ];
    case "sales":
      return [
        { label: "My live cases", slug: "cases", where: mine(LIVE) },
        {
          label: "Awaiting customer decision",
          slug: "cases",
          where: mine({ wait: { equals: "Awaiting customer decision" } }),
        },
        { label: "My pipeline", slug: "opportunities", where: { owner: { equals: me } } },
        { label: "Quotations in draft", slug: "quotations", where: { status: { equals: "Draft" } } },
      ];
    case "office-admin":
      return [
        inbox,
        { label: "Open follow-ups", slug: "tasks", where: { status: { equals: "Open" } } },
        { label: "Live cases", slug: "cases", where: LIVE },
        exceptions,
      ];
    default:
      return [
        { label: "My live cases", slug: "cases", where: mine(LIVE) },
        { label: "Awaiting supplier", slug: "cases", where: { wait: { equals: "Awaiting supplier" } } },
        {
          label: "Supplier RFQs awaiting reply",
          slug: "supplier-rfqs",
          where: { status: { equals: "Awaiting reply" } },
          alert: true,
        },
        { label: "My open tasks", slug: "tasks", where: mine({ status: { equals: "Open" } }) },
      ];
  }
}

/** The side panel's counters for the signed-in user, each with what it counts. */
export const widgets = (user: { id: string; role?: string }): SideWidget[] =>
  roleWidgets(user).map((w) => ({ ...w, hint: w.hint ?? WIDGET_HINTS[w.label] }));
