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
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import { visuals } from "../queries/visuals.ts";
import type { BankChange } from "../endpoints/cash.ts";
import * as fmt from "../format/cash.ts";
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

/**
 * Root view "Receivables & payables" (/cash): what customers owe (ageing by customer, collection
 * reminders that respect each customer's contact rule) and what we owe suppliers (deposits,
 * balances on delivery, bills on hold), payments waiting for the Financial Director or the CEO,
 * the two-person bank-detail change with its call-back check, and cash in vs out for the next
 * 8 weeks. Each widget is a design-system kind given a query and a formatter (../format/cash.ts).
 */
export const cashPage = widgets({
  header: {
    eyebrow: "Finance · Tue 17 Nov",
    heading: "Receivables & payables",
    subtitle:
      "What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here people approve and record it.",
    actions: [
      { label: "Approvals queue", href: "/approvals" },
      { label: "All invoices", href: link.list("invoices") },
    ],
  },
  // The position with the two things to act on beside it, the two charts, then the tables.
  widgets: [
    // The money at a glance: who owes the most (sized by it), the next 8 weeks' cash as a bridge,
    // and the month's due dates.
    treemap({
      title: "Who owes us",
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: visuals,
      hidden: (v) => !v.money,
      format: shapes.receivablesMap,
    }),
    waterfall({
      title: "Cash, next 8 weeks",
      size: "m",
      rows: 6,
      maxRows: 7,
      skeleton: "chart",
      data: cash,
      hidden: (d) => !d.canSeePayables,
      format: fmt.bridge,
    }),
    month({
      title: "Due this month",
      size: "s",
      rows: 7,
      maxRows: 8,
      skeleton: "list",
      data: visuals,
      format: shapes.calendar,
    }),
    // What customers owe, in USD at today's rates (each invoice's own `balanceUsd`).
    {
      size: "s",
      metrics: {
        collection: "invoices",
        items: [
          { label: "Receivables", sum: "balanceUsd", where: openInvoices, note: "Open invoices · USD equivalent" },
          {
            label: "Overdue",
            sum: "balanceUsd",
            where: overdueInvoices,
            tone: { some: "error", none: "success" },
            note: "Past their due date · USD equivalent",
          },
        ],
      },
    },
    {
      size: "s",
      visible: (s) => s.user.role !== "sales",
      metrics: {
        collection: "approvals",
        items: [
          {
            label: "Payments to approve",
            where: paymentsToApprove,
            tone: { some: "warning", none: "success" },
            note: "Financial Director or CEO",
          },
        ],
      },
    },
    // What we owe suppliers, in EGP at today's rates (each supplier PO's own `payable`).
    {
      size: "s",
      visible: (s) => s.user.role !== "sales",
      metrics: {
        collection: "purchase-orders",
        items: [
          {
            label: "Payables",
            sum: "payable.balanceEgp",
            where: payablePurchaseOrders,
            keep: openPayables,
            note: "Open supplier balances · EGP equivalent",
          },
          { label: "Supplier balances open", where: payablePurchaseOrders, keep: openPayables },
        ],
      },
    },
    // The 8-week net, forecast by the cash endpoint (it spans invoices, POs, bills and payments).
    figures({
      data: cash,
      format: fmt.position,
    }),
    text({
      title: "Match a remittance",
      size: "s",
      data: cash,
      format: fmt.remittance,
    }),
    // The approvals collection's own: each request's PO and amount (`payment`), how far it has got,
    // and its actions (Approve / Return for an approver, Record payment for finance once approved).
    {
      title: "Payments needing approval",
      size: "s",
      subhead:
        "Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and records it here with the bank reference.",
      visible: (s) => s.user.role !== "sales",
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
        empty: "Nothing waiting.",
      },
    },
    {
      title: "Receivables ageing by customer",
      subhead: "Open balances in USD equivalent at today's rates, by days past due.",
      size: "m",
      breakdown: { collection: "invoices", where: openInvoices, by: "customer", stack: "ageBucket", sum: "balanceUsd" },
    },
    chart({
      title: "Cash in vs out — next 8 weeks",
      size: "m",
      skeleton: "chart",
      data: cash,
      format: fmt.forecast,
    }),
    steps.each({
      data: payables,
      size: "m",
      hidden: (d) => !d.bankChanges.length,
      // A change in progress is the usual case here: its tile holds its place while loading.
      expect: "shown",
      items: (d) => d.bankChanges,
      key: (b: BankChange) => b.id,
      title: (b: BankChange) => b.title,
      subhead: () => "Two-person check: Finance and the CEO, after a call-back on the number on file.",
      format: fmt.bankChange,
    }),
    details.each({
      data: payables,
      size: "s",
      hidden: (d) => !d.bankChanges.some((b) => b.request),
      items: (d) => d.bankChanges.filter((b) => b.request),
      key: (b: BankChange) => `${b.id}-request`,
      title: (b: BankChange) => `${b.supplierName}: requested change`,
      format: fmt.bankChangeRequest,
    }),
    {
      title: "Ageing buckets by customer",
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
    // Each invoice's reminder follows its customer's contact rule (the invoices' own actions).
    {
      title: "Collections — open invoices",
      subhead:
        "Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the others the AI drafts the email and a person reviews and sends it.",
      size: "l",
      records: {
        collection: "invoices",
        where: openInvoices,
        sort: "dueDate",
        limit: 50,
        columns: ["number", "balance", "dueDate", "customer.contactRule", "eInvoice.status"],
        supporting: { number: "customer", balance: "amount", dueDate: "ageBucket" },
        labels: { "eInvoice.status": "E-invoice" },
      },
    },
    // What we owe on each supplier PO (its own `payable`: the supplier links to the case's order
    // tab, a hold reads in red) and its action: request payment approval.
    {
      title: "Supplier payables",
      subhead:
        "Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't match.",
      size: "l",
      visible: (s) => s.user.role !== "sales",
      records: {
        collection: "purchase-orders",
        where: payablePurchaseOrders,
        keep: openPayables,
        // The soonest due first (`payable.due` is worked out on read, so every PO is read and sorted).
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
        empty: "Nothing owed to suppliers.",
      },
    },
    // The open invoices as cards (balance large, age and due date under it) and the bills falling
    // due on their month.
    {
      title: "Open invoices",
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
      title: "Supplier bills by due date",
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
