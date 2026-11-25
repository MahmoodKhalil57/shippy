import { actions, alert, details, entries, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/order-to-cash.ts";
import { caseOpenInvoices, caseOps, caseShortfalls, ofCase } from "../queries/case-ops.ts";
import { m } from "../i18n/paraglide/messages.js";

export const caseDelivery = widgets({
  widgets: [
    alert({
      size: "full",
      skeleton: "text",
      data: caseOps,
      format: fmt.replanNotice,
    }),
    details({
      title: m.page_delivery_plan_title(),
      size: "s",
      data: caseOps,
      format: fmt.deliveryPlan,
    }),
    entries({
      title: m.page_delivery_drops_title(),
      size: "m",
      subhead: m.page_delivery_drops_subhead(),
      skeleton: "entries",
      data: caseOps,
      empty: { when: (d) => !d.deliveries.length, heading: m.page_delivery_no_drops() },
      format: fmt.dropEntries,
    }),
    actions({
      title: m.page_delivery_check_title(),
      subhead: m.page_delivery_check_subhead(),
      size: "s",
      data: caseOps,
      empty: { when: (d) => !fmt.nextDrop(d), heading: m.page_delivery_no_dispatch() },
      format: fmt.preDispatchChecks,
    }),
    {
      size: "s",
      empty: {
        when: (d) => !Object.values(d as Record<string, { totalDocs: number }>).some((x) => x.totalDocs),
        heading: m.page_delivery_no_invoices(),
      },
      metrics: {
        collection: "invoices",
        items: [
          { label: m.page_delivery_invoiced(), sum: "amount", where: ofCase, note: m.page_delivery_invoiced_note() },
          { label: m.page_delivery_received(), sum: "paid", where: ofCase, note: m.page_delivery_received_note() },
          {
            label: m.page_delivery_balance(),
            sum: "balance",
            where: caseOpenInvoices,
            tone: { some: "warning", none: "success" },
            note: m.page_delivery_balance_note(),
          },
        ],
      },
    },
    {
      title: m.page_delivery_backorders_title(),
      subhead: m.page_delivery_backorders_subhead(),
      size: "l",
      records: {
        collection: "receipts",
        where: caseShortfalls,
        sort: "lineNo",
        limit: 50,
        columns: [
          "item",
          "shortfall",
          "from",
          "backorderDate",
          "backorder.followsIn",
          "backorder.owner",
          "backorder.risk",
        ],
        labels: { shortfall: m.page_delivery_short() },
        empty: m.page_delivery_no_backorders(),
      },
    },
    {
      title: m.page_delivery_invoices_title(),
      subhead: m.page_delivery_invoices_subhead(),
      size: "l",
      records: {
        collection: "invoices",
        where: ofCase,
        sort: "number",
        limit: 20,
        columns: ["number", "linesSummary", "amount", "eInvoice.status", "paid", "status"],
        supporting: {
          number: "basisNote",
          amount: "vatTreatment",
          "eInvoice.status": "eInvoiceNote",
          paid: "paymentsNote",
        },
        labels: {
          number: m.page_delivery_invoice(),
          amount: m.page_delivery_amount_vat(),
          paid: m.page_delivery_paid_balance(),
        },
        empty: m.page_delivery_no_invoice(),
      },
    },
  ],
});
