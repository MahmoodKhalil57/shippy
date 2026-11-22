import type { Action } from "saastemlycrm-design-system/contracts";

/**
 * A case's order and purchasing: what people can do from the order widgets (POST
 * /api/case-order/:id/…, ../endpoints/order-to-cash.ts, and /api/operations/…,
 * ../endpoints/operations.ts, which re-check who may do what).
 */

/** The order tab's own endpoints, for the case the tab is about. */
export const caseOrderPath = "/case-order/$doc.id";

/** The AI reads the customer's PO and checks it against the quotation version it refers to. */
export const readPo: Action = {
  label: "Read customer PO",
  main: true,
  call: { path: `${caseOrderPath}/po-check` },
  reply: true,
};
