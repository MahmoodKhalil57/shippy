import type { CollectionViewSpec, Widget } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

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
      share("cases", "stage", m.page_records_cases_by_stage()),
      treemap("cases", "customer", m.page_records_case_value_by_customer(), "value"),
      ring("cases", "owner", m.page_records_cases_per_owner()),
    ],
  },
  customers: {
    layout: "cards",
    before: [
      treemap("invoices", "customer", m.page_records_who_owes_us(), "balanceUsd"),
      ring("customers", "type", m.page_records_customers_by_type()),
      share("customers", "contactRule", m.page_records_contact_rules()),
    ],
  },
  suppliers: {
    layout: "cards",
    before: [
      ring("suppliers", "country", m.page_records_suppliers_by_country()),
      share("suppliers", "kind", m.page_records_supplier_kinds()),
      treemap("purchase-orders", "supplier", m.page_records_orders_by_supplier(), "total"),
    ],
  },
  users: { layout: "cards", before: [ring("users", "role", m.page_records_team_by_role())] },
  "intake-messages": {
    before: [
      byStatus("intake-messages", "status"),
      ring("intake-messages", "channel", m.page_records_message_sources()),
      overTime("intake-messages", "receivedAt", m.page_records_messages_per_day(), "day"),
    ],
  },
  "supplier-rfqs": {
    layout: "list",
    before: [
      byStatus("supplier-rfqs", "status"),
      share("supplier-rfqs", "supplier", m.page_records_requests_per_supplier()),
    ],
  },
  offers: {
    layout: "cards",
    before: [
      ring("offers", "compliance", m.page_records_offers_by_compliance()),
      share("offers", "supplier", m.page_records_offers_per_supplier()),
    ],
  },
  quotations: {
    layout: "cards",
    before: [
      byStatus("quotations", "status"),
      share("quotations", "status", m.page_records_quoted_value_by_status(), "totalExVat"),
    ],
  },
  approvals: {
    layout: "list",
    before: [byStatus("approvals", "status"), ring("approvals", "type", m.page_records_decisions_by_kind())],
  },
  "customer-pos": { before: [overTime("customer-pos", "receivedAt", m.page_records_customer_pos_per_week(), "week")] },
  "purchase-orders": {
    layout: "cards",
    before: [
      byStatus("purchase-orders", "status"),
      treemap("purchase-orders", "supplier", m.page_records_order_value_by_supplier(), "total"),
    ],
  },
  "supplier-bills": {
    before: [
      byStatus("supplier-bills", "status"),
      overTime("supplier-bills", "dueDate", m.page_records_bills_due_by_week(), "week"),
    ],
  },
  receipts: {
    layout: "list",
    before: [byStatus("receipts", "qc"), ring("receipts", "warehouse", m.page_records_receipts_by_warehouse())],
  },
  deliveries: {
    layout: "calendar",
    before: [
      ring("deliveries", "status", m.page_records_deliveries_by_status()),
      share("deliveries", "case", m.page_records_deliveries_per_case()),
    ],
  },
  invoices: {
    before: [
      share("invoices", "ageBucket", m.page_records_balance_by_age(), "balanceUsd"),
      treemap("invoices", "customer", m.page_records_balance_by_customer(), "balanceUsd"),
    ],
  },
  payments: {
    layout: "list",
    before: [
      ring("payments", "direction", m.page_records_money_in_out(), "amount"),
      overTime("payments", "paidAt", m.page_records_payments_per_week(), "week"),
    ],
  },
  vessels: {
    layout: "cards",
    before: [
      ring("vessels", "vesselType", m.page_records_vessels_by_type()),
      share("vessels", "customer", m.page_records_vessels_per_customer()),
    ],
  },
  products: {
    layout: "list",
    before: [
      treemap("stock", "product", m.page_records_stock_by_product(), "onHand"),
      ring("products", "store", m.page_records_products_by_store()),
    ],
  },
  "supplier-prices": {
    layout: "list",
    before: [share("supplier-prices", "supplier", m.page_records_prices_per_supplier())],
  },
  pricelists: { layout: "cards", before: [ring("pricelists", "principal", m.page_records_pricelists_per_principal())] },
  stock: {
    layout: "list",
    before: [
      ring("stock", "warehouse", m.page_records_units_by_warehouse(), "onHand"),
      treemap("stock", "product", m.page_records_available_by_product(), "available"),
    ],
  },
  tasks: {
    layout: "board",
    before: [byStatus("tasks", "status"), share("tasks", "type", m.page_records_tasks_by_type())],
  },
  activities: {
    layout: "list",
    before: [
      ring("activities", "kind", m.page_records_activity_by_kind()),
      overTime("activities", "at", m.page_records_activity_per_day(), "day"),
    ],
  },
  "ai-calls": {
    layout: "list",
    before: [byStatus("ai-calls", "outcome"), ring("ai-calls", "task", m.page_records_ai_calls_by_task())],
  },
  "integration-exceptions": {
    layout: "list",
    before: [
      byStatus("integration-exceptions", "status"),
      ring("integration-exceptions", "source", m.page_records_exceptions_by_source()),
    ],
  },
  opportunities: {
    layout: "board",
    before: [
      share("opportunities", "source", m.page_records_prospect_sources()),
      ring("opportunities", "segment", m.page_records_by_segment()),
    ],
  },
  "vendor-registrations": {
    layout: "cards",
    before: [byStatus("vendor-registrations", "status")],
  },
  campaigns: { layout: "cards", before: [byStatus("campaigns", "contentStatus")] },
};
