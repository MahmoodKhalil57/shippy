import type { CollectionViewSpec, Widget } from "saastemlycrm-design-system/contracts";

/**
 * What each collection's own page shows beside its list (`collectionPage`'s `before`), and the
 * layout its list starts in. Each is a no-code widget of the collection's records: counts by a
 * status (each opening the filtered list), a share bar or a ring of how they split, a treemap of
 * who holds the most, a chart over time, a figure of what they add up to. The list stays the page's
 * main tile; people switch its layout (table, cards, list, board, calendar) and it's remembered.
 */
export interface ListPage {
  layout?: CollectionViewSpec["layout"];
  before: Widget[];
}

const share = (collection: string, by: string, title: string, sum?: string): Widget => ({
  title,
  size: "m",
  rows: 4,
  maxRows: 5,
  breakdown: { collection, by, as: "share", ...(sum ? { sum } : {}) },
});
const ring = (collection: string, by: string, title: string, sum?: string): Widget => ({
  title,
  size: "s",
  rows: 4,
  maxRows: 6,
  breakdown: { collection, by, as: "ring", ...(sum ? { sum } : {}) },
});
const treemap = (collection: string, by: string, title: string, sum: string): Widget => ({
  title,
  size: "m",
  rows: 5,
  maxRows: 6,
  breakdown: { collection, by, as: "treemap", sum, sort: "value" },
});
const byStatus = (collection: string, field: string, skip?: string[]): Widget => ({
  size: "m",
  rows: 2,
  counts: { collection, field, ...(skip ? { skip } : {}) },
});
const overTime = (collection: string, by: string, title: string, bucket: "day" | "week" | "month"): Widget => ({
  title,
  size: "m",
  rows: 5,
  maxRows: 6,
  breakdown: { collection, by, bucket, chart: "bars" },
});

export const LIST_PAGES: Record<string, ListPage> = {
  cases: {
    before: [
      share("cases", "stage", "Cases by stage"),
      treemap("cases", "customer", "Case value by customer", "value"),
      ring("cases", "owner", "Cases per owner"),
    ],
  },
  customers: {
    layout: "cards",
    before: [
      treemap("invoices", "customer", "Who owes us (USD)", "balanceUsd"),
      ring("customers", "type", "Customers by type"),
      share("customers", "contactRule", "Contact rules"),
    ],
  },
  suppliers: {
    layout: "cards",
    before: [
      ring("suppliers", "country", "Suppliers by country"),
      share("suppliers", "kind", "Kinds of supplier"),
      treemap("purchase-orders", "supplier", "Orders by supplier", "total"),
    ],
  },
  users: { layout: "cards", before: [ring("users", "role", "The team by role")] },
  "intake-messages": {
    before: [
      byStatus("intake-messages", "status"),
      ring("intake-messages", "channel", "Where messages come from"),
      overTime("intake-messages", "receivedAt", "Messages per day", "day"),
    ],
  },
  "supplier-rfqs": {
    layout: "list",
    before: [byStatus("supplier-rfqs", "status"), share("supplier-rfqs", "supplier", "Requests per supplier")],
  },
  offers: {
    layout: "cards",
    before: [ring("offers", "compliance", "Offers by compliance"), share("offers", "supplier", "Offers per supplier")],
  },
  quotations: {
    layout: "cards",
    before: [byStatus("quotations", "status"), share("quotations", "status", "Quoted value by status", "totalExVat")],
  },
  approvals: {
    layout: "list",
    before: [byStatus("approvals", "status"), ring("approvals", "type", "Decisions by kind")],
  },
  "customer-pos": { before: [overTime("customer-pos", "receivedAt", "Customer POs per week", "week")] },
  "purchase-orders": {
    layout: "cards",
    before: [
      byStatus("purchase-orders", "status"),
      treemap("purchase-orders", "supplier", "Order value by supplier", "total"),
    ],
  },
  "supplier-bills": {
    before: [
      byStatus("supplier-bills", "status"),
      overTime("supplier-bills", "dueDate", "Bills falling due, by week", "week"),
    ],
  },
  receipts: {
    layout: "list",
    before: [byStatus("receipts", "qc"), ring("receipts", "warehouse", "Receipts by warehouse")],
  },
  deliveries: {
    layout: "calendar",
    before: [ring("deliveries", "status", "Deliveries by status"), share("deliveries", "case", "Deliveries per case")],
  },
  invoices: {
    before: [
      share("invoices", "ageBucket", "Open balance by age (USD)", "balanceUsd"),
      treemap("invoices", "customer", "Open balance by customer (USD)", "balanceUsd"),
    ],
  },
  payments: {
    layout: "list",
    before: [
      ring("payments", "direction", "Money in and out", "amount"),
      overTime("payments", "paidAt", "Payments per week", "week"),
    ],
  },
  vessels: {
    layout: "cards",
    before: [ring("vessels", "vesselType", "Vessels by type"), share("vessels", "customer", "Vessels per customer")],
  },
  products: {
    layout: "list",
    before: [
      treemap("stock", "product", "Stock on hand by product", "onHand"),
      ring("products", "store", "Products by store"),
    ],
  },
  "supplier-prices": { layout: "list", before: [share("supplier-prices", "supplier", "Prices per supplier")] },
  pricelists: { layout: "cards", before: [ring("pricelists", "principal", "Price lists per principal")] },
  stock: {
    layout: "list",
    before: [
      ring("stock", "warehouse", "Units on hand by warehouse", "onHand"),
      treemap("stock", "product", "Available by product", "available"),
    ],
  },
  tasks: {
    layout: "board",
    before: [byStatus("tasks", "status"), share("tasks", "type", "Tasks by type")],
  },
  activities: {
    layout: "list",
    before: [ring("activities", "kind", "Activity by kind"), overTime("activities", "at", "Activity per day", "day")],
  },
  "ai-calls": {
    layout: "list",
    before: [byStatus("ai-calls", "outcome"), ring("ai-calls", "task", "AI calls by task")],
  },
  "integration-exceptions": {
    layout: "list",
    before: [
      byStatus("integration-exceptions", "status"),
      ring("integration-exceptions", "source", "Exceptions by source"),
    ],
  },
  opportunities: {
    layout: "board",
    before: [
      share("opportunities", "source", "Where prospects come from"),
      ring("opportunities", "segment", "By segment"),
    ],
  },
  "vendor-registrations": {
    layout: "cards",
    before: [byStatus("vendor-registrations", "status")],
  },
  campaigns: { layout: "cards", before: [byStatus("campaigns", "contentStatus")] },
};
