import { LIVE, mine, type Where } from "./cases.ts";

/**
 * The side panel's counters (../pages/aside.ts): what each role steers by, as `counts` queries
 * (a count of a collection per `where`, each opening its list). `$user.id` is the signed-in user.
 * The ones several roles share are here; the cases' and tasks' `where`s are ./cases.ts's and ./work.ts's.
 */

/** One counter: its collection and `where`, a line under it, amber when it needs attention. */
export type Counter = { label: string; collection: string; where: Where; note: string; tone?: "warning" };

/** The roles that have counters of their own; everyone else gets the sourcing desk's. */
export const ROLES = ["management", "finance-director", "operations", "sales", "office-admin"];

const PENDING: Where = { status: { not_in: ["Approved", "Rejected"] } };

export const myDecisions: Counter = {
  label: "Decisions waiting for me",
  collection: "approvals",
  where: { and: [PENDING, { approvers: { in: ["$user.id"] } }, { "decisions.user": { not_equals: "$user.id" } }] },
  note: "Approvals routed to you that you haven't decided",
  tone: "warning",
};
export const exceptions: Counter = {
  label: "Integration exceptions",
  collection: "integration-exceptions",
  where: { status: { in: ["Open", "Waiting for review"] } },
  note: "Failed mailbox, e-invoice or AI steps waiting for a person",
  tone: "warning",
};
export const toCollect: Counter = {
  label: "Invoices to collect",
  collection: "invoices",
  where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
  note: "Customer invoices with a balance still open",
};
export const bills: Counter = {
  label: "Supplier bills",
  collection: "supplier-bills",
  where: {},
  note: "Bills to match against the PO and goods received",
};
export const liveCases: Counter = {
  label: "Live cases",
  collection: "cases",
  where: LIVE,
  note: "Every case not yet settled, lost or expired",
};
export const myLiveCases: Counter = {
  label: "My live cases",
  collection: "cases",
  where: mine(LIVE),
  note: "Cases you own that are still open",
};
