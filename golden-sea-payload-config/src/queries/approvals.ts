import { FINAL_APPROVAL, PAYMENT_APPROVALS } from "../collections/commercial.ts";

/**
 * Approval requests (the `approvals` collection, ../collections/commercial.ts): which ones a
 * widget shows. Whether the signed-in person may decide one is its virtual `canDecide` (a widget
 * filters on it with `keep`).
 */

/** Requests still waiting for a decision (none yet, or halfway through a two-person rule). */
export const openApprovals = { status: { not_in: FINAL_APPROVAL } };
/** Approved or returned requests. */
export const decidedApprovals = { status: { in: FINAL_APPROVAL } };
/** Supplier deposits and payments that aren't returned: waiting, or approved and still to record. */
export const paymentApprovals = { type: { in: PAYMENT_APPROVALS }, status: { not_equals: "Rejected" } };
