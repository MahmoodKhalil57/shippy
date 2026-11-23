import { LIVE, mine, type Where } from "./cases.ts";
import { m } from "../i18n/paraglide/messages.js";

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
  label: m.page_aside_my_decisions(),
  collection: "approvals",
  where: { and: [PENDING, { approvers: { in: ["$user.id"] } }, { "decisions.user": { not_equals: "$user.id" } }] },
  note: m.page_aside_my_decisions_note(),
  tone: "warning",
};
export const exceptions: Counter = {
  label: m.page_aside_exceptions(),
  collection: "integration-exceptions",
  where: { status: { in: ["Open", "Waiting for review"] } },
  note: m.page_aside_exceptions_note(),
  tone: "warning",
};
export const toCollect: Counter = {
  label: m.page_aside_to_collect(),
  collection: "invoices",
  where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
  note: m.page_aside_to_collect_note(),
};
export const bills: Counter = {
  label: m.page_aside_bills(),
  collection: "supplier-bills",
  where: {},
  note: m.page_aside_bills_note(),
};
export const liveCases: Counter = {
  label: m.page_aside_live_cases(),
  collection: "cases",
  where: LIVE,
  note: m.page_aside_live_cases_note(),
};
export const myLiveCases: Counter = {
  label: m.page_aside_my_live_cases(),
  collection: "cases",
  where: mine(LIVE),
  note: m.page_aside_my_live_cases_note(),
};
