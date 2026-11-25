import { FINAL_APPROVAL, PAYMENT_APPROVALS } from "../collections/commercial.ts";

export const openApprovals = { status: { not_in: FINAL_APPROVAL } };
export const decidedApprovals = { status: { in: FINAL_APPROVAL } };
export const paymentApprovals = { type: { in: PAYMENT_APPROVALS }, status: { not_equals: "Rejected" } };
