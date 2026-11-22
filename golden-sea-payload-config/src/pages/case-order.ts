import { alert, attach, custom, figures, list, table, widgets } from "saastemlycrm-design-system/contracts";
import type { OpsPO } from "../endpoints/order-to-cash.ts";
import * as fmt from "../format/order-to-cash.ts";
import { caseOps, ofCase } from "../queries/case-ops.ts";

/**
 * Case tab "Order & purchasing" (/collections/cases/<id>/order): the customer's PO checked line
 * by line against the approved quotation version (commitment blocked until every mismatch has
 * written customer agreement), partial awards, the supplier POs (re-checked before confirming,
 * deposits through approval), supplier bills with the 3-way match and the duplicate-bill block,
 * drop-ship vs warehouse, and receipts with lots, expiry, QC and backorders.
 * The supplier POs, bills and receipts are the collections' own records (`records` widgets: their
 * fields and actions, ../collections/fulfilment.ts). The customer PO check and the POs' re-check
 * and confirmation are workflows: design-system kinds given GET /api/operations/case/:id
 * (../endpoints/operations.ts) and a formatter (../format/order-to-cash.ts, shared with the
 * delivery tab); writes: the POST endpoints there and in ../endpoints/order-to-cash.ts.
 */
export const caseOrder = widgets({
  // The PO check, before a PO (`customerPoPending`) or with it (the check, its open mismatches and
  // the AI's second look); the supplier POs (or why there are none yet) and their re-checks.
  widgets: [
    figures({
      data: caseOps,
      format: fmt.orderFigures,
    }),
    list({
      title: "Partial award",
      size: "s",
      data: caseOps,
      hidden: (d) => !fmt.unorderedLines(d).length,
      format: fmt.partialAward,
    }),
    table({
      title: "Customer PO check",
      size: "l",
      data: caseOps,
      hidden: fmt.customerPoAwaited,
      expect: "shown",
      format: fmt.customerPoCheck,
    }),
    alert({
      title: "Customer PO check",
      size: "l",
      data: caseOps,
      hidden: (d) => !fmt.customerPoAwaited(d),
      format: fmt.customerPoPending,
    }),
    attach.each({
      data: caseOps,
      size: "s",
      items: fmt.openMismatches,
      key: ({ i }: fmt.OpenMismatch) => `amendment-${i}`,
      title: ({ c }: fmt.OpenMismatch) => `Customer amendment · ${c.lineNo ? `line ${c.lineNo}` : "header"}`,
      format: fmt.customerAmendment,
    }),
    custom({
      title: "AI check of the customer PO",
      size: "s",
      data: caseOps,
      hidden: (d) => !d.customerPo,
      format: fmt.customerPoAiCheck,
    }),
    // The case's supplier POs (their own fields: lines, route, deposit, progress). A deposit in
    // approval links to /cash; its note and a flagged re-check take their tone from the PO.
    {
      title: "Supplier purchase orders",
      subhead:
        "Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment approval. Supplier costs are hidden for Sales.",
      size: "l",
      expect: "shown",
      records: {
        collection: "purchase-orders",
        where: ofCase,
        sort: "number",
        limit: 20,
        hideEmpty: true,
        columns: ["number", "linesSummary", "deliverTo", "total", "deposit.text", "status"],
        supporting: { number: "supplier", "deposit.text": "deposit.note", status: "statusNote" },
        labels: { number: "PO", total: "Amount" },
      },
    },
    alert({
      title: "Supplier purchase orders",
      size: "l",
      skeleton: "table",
      data: caseOps,
      hidden: (d) => d.purchaseOrders.length > 0,
      format: fmt.noPurchaseOrders,
    }),
    // A tile per supplier PO still to confirm: the re-check to run, then what it found.
    list.each({
      data: caseOps,
      size: "m",
      skeleton: "table",
      items: fmt.purchaseOrdersToConfirm(false),
      key: (p: OpsPO) => p.id,
      title: fmt.recheckTitle,
      format: fmt.recheckRequest,
    }),
    table.each({
      data: caseOps,
      size: "m",
      skeleton: "table",
      items: fmt.purchaseOrdersToConfirm(true),
      key: (p: OpsPO) => p.id,
      title: fmt.recheckTitle,
      format: fmt.recheckResult,
    }),
    // The case's supplier bills against PO and receipt (their own 3-way match and hold), for those
    // who see costs; finance books an incoming copy from a bill (the duplicate check refuses it).
    {
      title: "Supplier bills — 3-way match",
      subhead:
        "A bill is payable only when ordered = received = billed. More billed than received puts it on hold; the same supplier's bill number can't be booked twice.",
      size: "l",
      visible: (s) => s.user.role !== "sales",
      records: {
        collection: "supplier-bills",
        where: ofCase,
        sort: "billNumber",
        limit: 20,
        hideEmpty: true,
        columns: ["billNumber", "purchaseOrder", "matchLines", "amount", "dueDate", "status"],
        supporting: { billNumber: "supplier", status: "holdReason" },
        labels: { billNumber: "Bill", dueDate: "Due" },
      },
    },
    // The case's receipts: lot, expiry and quality check per line; a shortfall is a backorder (the
    // received quantity in the warning tone).
    {
      title: "Receipts · lots · expiry · quality",
      subhead:
        "Warehouse receipts and drop-ship deliveries, with lot, expiry and quality check per line. A shortfall becomes a backorder with a date and an owner — it follows in the next drop.",
      size: "l",
      records: {
        collection: "receipts",
        where: ofCase,
        sort: "lineNo",
        limit: 50,
        hideEmpty: true,
        columns: ["item", "quantity", "warehouse", "lot", "qc", "shortfall"],
        supporting: { item: "from", warehouse: "receivedAt", lot: "expiry", qc: "claim", shortfall: "backorderDate" },
        labels: { lot: "Lot · expiry", shortfall: "Backorder" },
      },
    },
  ],
});
