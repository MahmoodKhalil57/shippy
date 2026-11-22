import { query } from "saastemlycrm-design-system/contracts";
import type { CaseOps } from "../endpoints/order-to-cash.ts";

/**
 * A case's order to cash: what GET /api/operations/case/:id returns (its customer PO check, the
 * supplier POs' re-checks, drops and delivery plan; the types are ../endpoints/order-to-cash.ts's),
 * for the order and delivery tabs' workflow widgets.
 */
export const caseOps = query.endpoint<CaseOps>("/operations/case/$doc.id");

/** A case's own records (its POs, bills, receipts, invoices), on its tabs. */
export const ofCase = { case: { equals: "$doc.id" } };
/** Its receipts short of what was ordered: its backorders. */
export const caseShortfalls = { ...ofCase, shortfall: { greater_than: 0 } };
/** Its invoices with money still to collect. */
export const caseOpenInvoices = { ...ofCase, balance: { greater_than: 0 } };
