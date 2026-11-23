import { attach, custom, figures, list, table, widgets } from "saastemlycrm-design-system/contracts";
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
  // The PO check (before a PO, what it waits for; with it, the check, its open mismatches and the
  // AI's second look); the supplier POs and their re-checks. Every tile is there before the data.
  widgets: [
    // Supplier bills only for those who see costs.
    figures({
      data: caseOps,
      labels: (s) => (s.user.role === "sales" ? fmt.ORDER_FIGURES.slice(0, 3) : fmt.ORDER_FIGURES),
      format: fmt.orderFigures,
    }),
    list({
      title: "Partial award",
      size: "s",
      data: caseOps,
      empty: { when: (d) => !fmt.unorderedLines(d).length, heading: "No partial award on this case." },
      format: fmt.partialAward,
    }),
    // Before the PO is on the case, what it waits for (just arrived, or the order already confirmed);
    // then the check itself, in the same tile.
    table({
      title: "Customer PO check",
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: "The customer's PO against the quotation",
      size: "l",
      data: caseOps,
      format: fmt.customerPoCheck,
    }),
    // A tile per open mismatch (a PO has had up to three; more go in the last tile).
    attach.each({
      data: caseOps,
      size: "s",
      tiles: 3,
      empty: { heading: "No open mismatch on the customer's PO." },
      items: fmt.openMismatches,
      key: ({ i }: fmt.OpenMismatch) => `amendment-${i}`,
      title: ({ c }: fmt.OpenMismatch) => `Customer amendment · ${c.lineNo ? `line ${c.lineNo}` : "header"}`,
      format: fmt.customerAmendment,
    }),
    custom({
      title: "AI check of the customer PO",
      size: "s",
      data: caseOps,
      empty: { when: (d) => !d.customerPo, heading: "No customer PO to check yet." },
      format: fmt.customerPoAiCheck,
    }),
    // The case's supplier POs (their own fields: lines, route, deposit, progress). A deposit in
    // approval links to /cash; its note and a flagged re-check take their tone from the PO.
    {
      title: "Supplier purchase orders",
      subhead:
        "Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment approval. Supplier costs are hidden for Sales.",
      size: "l",
      records: {
        collection: "purchase-orders",
        where: ofCase,
        sort: "number",
        limit: 20,
        columns: ["number", "linesSummary", "deliverTo", "total", "deposit.text", "status"],
        supporting: { number: "supplier", "deposit.text": "deposit.note", status: "statusNote" },
        labels: { number: "PO", total: "Amount" },
        empty:
          "No supplier PO yet. They are prepared once the customer's PO is validated and the sales order is confirmed.",
      },
    },
    // A tile per supplier PO still to confirm, the same tile before and after its re-check: the
    // re-check to run, then what it found. A confirmed order makes one PO per supplier (three for
    // gs-rfq-0136; more go in the last tile). Sales sees no supplier costs, so none.
    table.each({
      data: caseOps,
      size: "m",
      skeleton: "table",
      visible: (s) => s.user.role !== "sales",
      tiles: 3,
      empty: { heading: "No supplier PO waiting to be confirmed." },
      items: fmt.purchaseOrdersToConfirm,
      key: (p: OpsPO) => p.id,
      title: fmt.recheckTitle,
      format: fmt.recheck,
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
        columns: ["billNumber", "purchaseOrder", "matchLines", "amount", "dueDate", "status"],
        supporting: { billNumber: "supplier", status: "holdReason" },
        labels: { billNumber: "Bill", dueDate: "Due" },
        empty: "No supplier bills on this case yet.",
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
        columns: ["item", "quantity", "warehouse", "lot", "qc", "shortfall"],
        supporting: { item: "from", warehouse: "receivedAt", lot: "expiry", qc: "claim", shortfall: "backorderDate" },
        labels: { lot: "Lot · expiry", shortfall: "Backorder" },
        empty: "No receipts on this case yet.",
      },
    },
  ],
});
