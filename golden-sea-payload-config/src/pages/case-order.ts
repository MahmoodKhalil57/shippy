import { attach, custom, figures, list, table, widgets } from "saastemlycrm-design-system/contracts";
import type { OpsPO } from "../endpoints/order-to-cash.ts";
import * as fmt from "../format/order-to-cash.ts";
import { caseOps, ofCase } from "../queries/case-ops.ts";
import { m } from "../i18n/paraglide/messages.js";

export const caseOrder = widgets({
  widgets: [
    figures({
      data: caseOps,
      labels: (s) => (s.user.role === "sales" ? fmt.ORDER_FIGURES.slice(0, 3) : fmt.ORDER_FIGURES),
      name: fmt.orderFigureName,
      format: fmt.orderFigures,
    }),
    list({
      title: m.page_order_partial_title(),
      size: "s",
      data: caseOps,
      empty: { when: (d) => !fmt.unorderedLines(d).length, heading: m.page_order_no_partial() },
      format: fmt.partialAward,
    }),
    table({
      title: m.page_order_po_check_title(),
      subhead: m.page_order_po_check_subhead(),
      size: "l",
      data: caseOps,
      format: fmt.customerPoCheck,
    }),
    attach.each({
      data: caseOps,
      size: "s",
      tiles: 3,
      empty: { heading: m.page_order_no_mismatch() },
      items: fmt.openMismatches,
      key: ({ i }: fmt.OpenMismatch) => `amendment-${i}`,
      title: ({ c }: fmt.OpenMismatch) =>
        c.lineNo ? m.page_order_amendment_line({ line: c.lineNo }) : m.page_order_amendment_header(),
      format: fmt.customerAmendment,
    }),
    custom({
      title: m.page_order_ai_check_title(),
      size: "s",
      data: caseOps,
      empty: { when: (d) => !d.customerPo, heading: m.page_order_no_po() },
      format: fmt.customerPoAiCheck,
    }),
    {
      title: m.page_order_pos_title(),
      subhead: m.page_order_pos_subhead(),
      size: "l",
      records: {
        collection: "purchase-orders",
        where: ofCase,
        sort: "number",
        limit: 20,
        columns: ["number", "linesSummary", "deliverTo", "total", "deposit.text", "status"],
        supporting: { number: "supplier", "deposit.text": "deposit.note", status: "statusNote" },
        labels: { number: m.page_order_po(), total: m.page_order_amount() },
        empty: m.page_order_no_pos(),
      },
    },
    table.each({
      data: caseOps,
      size: "m",
      skeleton: "table",
      visible: (s) => s.user.role !== "sales",
      tiles: 3,
      empty: { heading: m.page_order_no_confirm() },
      items: fmt.purchaseOrdersToConfirm,
      key: (p: OpsPO) => p.id,
      title: fmt.recheckTitle,
      format: fmt.recheck,
    }),
    {
      title: m.page_order_bills_title(),
      subhead: m.page_order_bills_subhead(),
      size: "l",
      visible: (s) => s.user.role !== "sales",
      records: {
        collection: "supplier-bills",
        where: ofCase,
        sort: "billNumber",
        limit: 20,
        columns: ["billNumber", "purchaseOrder", "matchLines", "amount", "dueDate", "status"],
        supporting: { billNumber: "supplier", status: "holdReason" },
        labels: { billNumber: m.page_order_bill(), dueDate: m.page_order_due() },
        empty: m.page_order_no_bills(),
      },
    },
    {
      title: m.page_order_receipts_title(),
      subhead: m.page_order_receipts_subhead(),
      size: "l",
      records: {
        collection: "receipts",
        where: ofCase,
        sort: "lineNo",
        limit: 50,
        columns: ["item", "quantity", "warehouse", "lot", "qc", "shortfall"],
        supporting: { item: "from", warehouse: "receivedAt", lot: "expiry", qc: "claim", shortfall: "backorderDate" },
        labels: { lot: m.page_order_lot_expiry(), shortfall: m.page_order_backorder() },
        empty: m.page_order_no_receipts(),
      },
    },
  ],
});
