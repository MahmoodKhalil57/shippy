import { query } from "saastemlycrm-design-system/contracts";
import type { Cash, CashPayables } from "../endpoints/cash.ts";

export const cash = query.endpoint<Cash>("/operations/cash");
export const payables = query.endpoint<CashPayables>("/cash/payables");

export const openInvoices = { balance: { greater_than: 0 }, status: { not_in: ["Draft", "Cancelled"] } };
export const overdueInvoices = { ...openInvoices, dueDate: { less_than: "$today" } };
export const payablePurchaseOrders = { status: { not_in: ["Draft", "Awaiting approval", "Cancelled", "Closed"] } };
export const openPayables = { "payable.balance": { greater_than: 0 } };
export const paymentsToApprove = {
  type: { in: ["Supplier deposit (payment)", "Supplier payment"] },
  status: { equals: "Pending" },
};
