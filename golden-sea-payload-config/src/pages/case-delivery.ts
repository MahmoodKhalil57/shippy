import { actions, alert, details, entries, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/order-to-cash.ts";
import { caseOpenInvoices, caseOps, caseShortfalls, ofCase } from "../queries/case-ops.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Case tab "Delivery & billing" (/collections/cases/<id>/delivery): the vessel delivery plan
 * (port, ETA, agent, truck, boarding staff, launch, documents, pre-dispatch check), the agent's
 * ETA change re-planning every open drop (escalated to the owner and management), drops with
 * proof of delivery (a signed delivery note is required), backorders from late suppliers, and
 * invoicing only delivered quantities with the Egyptian e-invoice status per invoice and
 * partial payments. The backorders, the invoices and their balance are the collections' own records
 * (`records` and `metrics` widgets: their fields and actions, ../collections/fulfilment.ts and
 * finance.ts). The plan, its checks and the drops span the case's records: design-system kinds given GET
 * /api/operations/case/:id (../endpoints/operations.ts) and a formatter
 * (../format/order-to-cash.ts, shared with the order tab); writes: the POST endpoints there, in
 * ../endpoints/order-to-cash.ts and the invoices' (../endpoints/cash.ts).
 */
export const caseDelivery = widgets({
  // The plan with the drops, the checks beside them, then the tables.
  widgets: [
    // The re-plan, else the blocker, else that the delivery is on plan.
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
      // Its subhead comes with the data; this line holds its place while it loads.
      subhead: m.page_delivery_check_subhead(),
      size: "s",
      data: caseOps,
      empty: { when: (d) => !fmt.nextDrop(d), heading: m.page_delivery_no_dispatch() },
      format: fmt.preDispatchChecks,
    }),
    // The case's invoices added up (each in the case's currency): invoiced, received, the balance.
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
    // The case's receipts short of what was ordered (each receipt's own `backorder`).
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
    // The case's invoices with their e-invoice status and payments, and their own actions (sign &
    // submit, record a payment).
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
