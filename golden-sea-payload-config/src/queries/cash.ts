import { query } from "saastemlycrm-design-system/contracts";
import type { Cash, CashPayables } from "../endpoints/cash.ts";

/**
 * Receivables and payables (../endpoints/cash.ts): the cash forecast, and the payment approvals
 * and bank-detail changes (refused for Sales).
 */
export const cash = query.endpoint<Cash>("/operations/cash");
export const payables = query.endpoint<CashPayables>("/cash/payables");

/** Invoices with money still to collect: what receivables are. */
export const openInvoices = { balance: { greater_than: 0 }, status: { not_in: ["Draft", "Cancelled"] } };
/** Of those, the ones past their due date. */
export const overdueInvoices = { ...openInvoices, dueDate: { less_than: "$today" } };
/** Supplier POs that can owe the supplier something: confirmed, not closed or cancelled. */
export const payablePurchaseOrders = { status: { not_in: ["Draft", "Awaiting approval", "Cancelled", "Closed"] } };
/** Of those, the ones with a balance still to pay (their virtual `payable`, so a `keep`). */
export const openPayables = { "payable.balance": { greater_than: 0 } };
/** Supplier payments waiting for the Financial Director or the CEO. */
export const paymentsToApprove = {
  type: { in: ["Supplier deposit (payment)", "Supplier payment"] },
  status: { equals: "Pending" },
};
