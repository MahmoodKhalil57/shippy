import { LIVE, mine, type Where } from "./cases.ts";
import { FINAL_APPROVAL } from "../collections/commercial.ts";
import { m } from "../i18n/paraglide/messages.js";

export type Counter = { label: string; collection: string; where: Where; note: string; tone?: "warning" };

export const ROLES = ["management", "finance-director", "operations", "sales", "office-admin"];

export const PENDING: Where = { status: { not_in: FINAL_APPROVAL } };
export const pendingApproval = (a: Record<string, unknown>) =>
  !FINAL_APPROVAL.includes(typeof a.status === "string" && a.status ? a.status : "Pending");

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
