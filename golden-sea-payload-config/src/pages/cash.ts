import {
  chart,
  details,
  figures,
  month,
  steps,
  text,
  treemap,
  waterfall,
  widgets,
  type WidgetScope,
} from "saastemlycrm-design-system/contracts";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import * as shapes from "../format/visuals.ts";
import { visuals } from "../queries/visuals.ts";
import type { BankChange } from "../endpoints/cash.ts";
import * as fmt from "../format/cash.ts";
import { dateFormat } from "../format/index.ts";
import * as link from "../links.ts";
import { paymentApprovals } from "../queries/approvals.ts";
import {
  cash,
  openInvoices,
  openPayables,
  overdueInvoices,
  payablePurchaseOrders,
  payables,
  paymentsToApprove,
} from "../queries/cash.ts";
import { m } from "../i18n/paraglide/messages.js";

function demoDay(): string {
  if (IS_TEMP_MOCK) {
    return dateFormat({ weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
      new Date("2026-11-17T09:30:00.000Z"),
    );
  } else {
    throw new TempMockError("the cash page's day: today, not the demo's Tue 17 Nov 2026");
  }
}

const notSales = (s: WidgetScope) => s.user.role !== "sales";

export const cashPage = widgets({
  header: {
    eyebrow: m.page_cash_eyebrow({ day: demoDay() }),
    heading: m.page_cash_heading(),
    subtitle: m.page_cash_subtitle(),
    actions: [
      { label: m.page_cash_approvals_queue(), href: "/approvals" },
      { label: m.page_cash_all_invoices(), href: link.list("invoices") },
    ],
  },
  widgets: [
    treemap({
      title: m.page_cash_who_owes(),
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      visible: shapes.seesMoney,
      empty: { when: (v) => !v.receivables.length, heading: m.page_cash_no_receivables() },
      format: shapes.receivablesMap,
    }),
    waterfall({
      title: m.page_cash_next_weeks(),
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: cash,
      visible: notSales,
      format: fmt.bridge,
    }),
    month({
      title: m.page_cash_due_month(),
      size: "s",
      rows: 7,
      maxRows: 8,
      skeleton: "list",
      data: visuals,
      format: shapes.calendar,
    }),
    {
      size: "s",
      metrics: {
        collection: "invoices",
        items: [
          {
            label: m.page_cash_receivables(),
            sum: "balanceUsd",
            where: openInvoices,
            note: m.page_cash_receivables_note(),
          },
          {
            label: m.page_cash_overdue(),
            sum: "balanceUsd",
            where: overdueInvoices,
            tone: { some: "error", none: "success" },
            note: m.page_cash_overdue_note(),
          },
        ],
      },
    },
    {
      size: "s",
      visible: notSales,
      metrics: {
        collection: "approvals",
        items: [
          {
            label: m.page_cash_payments_to_approve(),
            where: paymentsToApprove,
            tone: { some: "warning", none: "success" },
            note: m.page_cash_fd_or_ceo(),
          },
        ],
      },
    },
    {
      size: "s",
      visible: notSales,
      metrics: {
        collection: "purchase-orders",
        items: [
          {
            label: m.page_cash_payables(),
            sum: "payable.balanceEgp",
            where: payablePurchaseOrders,
            keep: openPayables,
            note: m.page_cash_payables_note(),
          },
          { label: m.page_cash_supplier_balances(), where: payablePurchaseOrders, keep: openPayables },
        ],
      },
    },
    figures({
      data: cash,
      visible: notSales,
      labels: fmt.CASH_FIGURES,
      format: fmt.position,
    }),
    text({
      title: m.page_cash_remittance(),
      size: "s",
      data: cash,
      format: fmt.remittance,
    }),
    {
      title: m.page_cash_payments_title(),
      size: "s",
      subhead: m.page_cash_payments_subhead(),
      visible: notSales,
      records: {
        collection: "approvals",
        where: paymentApprovals,
        keep: { "payment.open": { equals: true } },
        sort: "-createdAt",
        limit: 20,
        layout: "entries",
        columns: ["status", "case", "approvers"],
        tags: ["type", "rule"],
        facts: ["payment.purchaseOrder", "payment.amount", "payment.kind", "progress"],
        text: "detail",
        empty: m.page_cash_no_payments(),
      },
    },
    {
      title: m.page_cash_ageing_title(),
      subhead: m.page_cash_ageing_subhead(),
      size: "m",
      breakdown: { collection: "invoices", where: openInvoices, by: "customer", stack: "ageBucket", sum: "balanceUsd" },
    },
    chart({
      title: m.page_cash_in_out(),
      subhead: m.page_cash_in_out_subhead(),
      size: "m",
      skeleton: "chart",
      data: cash,
      format: fmt.forecast,
    }),
    steps.each({
      data: payables,
      size: "m",
      visible: notSales,
      tiles: 1,
      empty: { heading: m.page_cash_no_bank_changes() },
      items: (d) => d.bankChanges,
      key: (b: BankChange) => b.id,
      title: (b: BankChange) => b.title,
      subhead: () => m.page_cash_bank_change_subhead(),
      format: fmt.bankChange,
    }),
    details.each({
      data: payables,
      size: "s",
      visible: notSales,
      tiles: 1,
      empty: { heading: m.page_cash_no_bank_request() },
      items: (d) => d.bankChanges.filter((b) => b.request),
      key: (b: BankChange) => `${b.id}-request`,
      title: (b: BankChange) => m.page_cash_requested_change({ supplier: b.supplierName }),
      format: fmt.bankChangeRequest,
    }),
    {
      title: m.page_cash_buckets_title(),
      size: "l",
      breakdown: {
        collection: "invoices",
        where: openInvoices,
        by: "customer",
        stack: "ageBucket",
        sum: "balanceUsd",
        as: "table",
      },
    },
    {
      title: m.page_cash_collections_title(),
      subhead: m.page_cash_collections_subhead(),
      size: "l",
      records: {
        collection: "invoices",
        where: openInvoices,
        sort: "dueDate",
        limit: 50,
        columns: ["number", "balance", "dueDate", "customer.contactRule", "eInvoice.status"],
        supporting: { number: "customer", balance: "amount", dueDate: "ageBucket" },
        labels: { "eInvoice.status": m.page_cash_e_invoice() },
        empty: m.page_cash_no_open_invoices(),
      },
    },
    {
      title: m.page_cash_payables_title(),
      subhead: m.page_cash_payables_subhead(),
      size: "l",
      visible: notSales,
      records: {
        collection: "purchase-orders",
        where: payablePurchaseOrders,
        keep: openPayables,
        sort: "payable.due",
        limit: 50,
        columns: [
          "payable.supplier",
          "payable.stage",
          "payable.total",
          "payable.paid",
          "payable.balance",
          "payable.due",
          "payable.next",
        ],
        supporting: { "payable.supplier": "payable.ref", "payable.stage": "payable.note" },
        labels: { "payable.next": "" },
        empty: m.page_cash_nothing_owed(),
      },
    },
    {
      title: m.page_cash_open_invoices(),
      size: "l",
      rows: 12,
      minRows: 8,
      collection: {
        collection: "invoices",
        key: "open",
        layout: "cards",
        where: { status: { in: ["Open", "Partially paid", "Overdue"] } },
        sort: "dueDate",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    {
      title: m.page_cash_bills_by_due(),
      size: "s",
      rows: 10,
      minRows: 8,
      collection: {
        collection: "supplier-bills",
        key: "bills",
        layout: "calendar",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
  ],
});
