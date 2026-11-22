import { actions, alert, details, entries, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/order-to-cash.ts";
import { caseOpenInvoices, caseOps, caseShortfalls, ofCase } from "../queries/case-ops.ts";

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
    alert({
      size: "full",
      skeleton: "text",
      data: caseOps,
      format: fmt.replanNotice,
    }),
    details({
      title: "Vessel delivery plan",
      size: "s",
      data: caseOps,
      format: fmt.deliveryPlan,
    }),
    entries({
      title: "Drops & proof of delivery",
      size: "m",
      subhead:
        "“Delivered” needs evidence: dispatch and confirmed receipt are separate, and a drop is confirmed only with the signed delivery note or photo from the vessel.",
      skeleton: "entries",
      data: caseOps,
      hidden: (d) => !d.deliveries.length,
      format: fmt.dropEntries,
    }),
    actions({
      title: "Pre-dispatch check",
      size: "s",
      data: caseOps,
      hidden: (d) => !fmt.nextDrop(d),
      format: fmt.preDispatchChecks,
    }),
    // The case's invoices added up (each in the case's currency): invoiced, received, the balance.
    {
      size: "s",
      hidden: (d) => !Object.values(d as Record<string, { totalDocs: number }>).some((x) => x.totalDocs),
      metrics: {
        collection: "invoices",
        items: [
          { label: "Invoiced", sum: "amount", where: ofCase, note: "Delivered quantities only" },
          { label: "Received", sum: "paid", where: ofCase, note: "Customer payments allocated" },
          {
            label: "Balance",
            sum: "balance",
            where: caseOpenInvoices,
            tone: { some: "warning", none: "success" },
            note: "Invoices still open: $count",
          },
        ],
      },
    },
    // The case's receipts short of what was ordered (each receipt's own `backorder`).
    {
      title: "Backorders & late suppliers",
      subhead:
        "Receipt shortfalls become backorders with a date and an owner; a late supplier is escalated against the drop it was meant for.",
      size: "l",
      records: {
        collection: "receipts",
        where: caseShortfalls,
        sort: "lineNo",
        limit: 50,
        hideEmpty: true,
        columns: [
          "item",
          "shortfall",
          "from",
          "backorderDate",
          "backorder.followsIn",
          "backorder.owner",
          "backorder.risk",
        ],
        labels: { shortfall: "Short" },
      },
    },
    // The case's invoices with their e-invoice status and payments, and their own actions (sign &
    // submit, record a payment).
    {
      title: "Customer invoices & payments",
      subhead:
        "Invoices come from signed deliveries: only delivered quantities, never the same quantity twice. Each one is signed and submitted to the Egyptian Tax Authority; a failed signature submits nothing and is safe to retry.",
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
        labels: { number: "Invoice", amount: "Amount · VAT", paid: "Paid · balance" },
        empty: "No invoice yet — the first one is created from a delivery confirmed with a signed note.",
      },
    },
  ],
});
