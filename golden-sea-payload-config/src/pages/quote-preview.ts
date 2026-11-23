import { actions, document, steps, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/commercial.ts";
import { quotation } from "../queries/commercial.ts";

/**
 * Quotation tab "Preview & send" (/collections/quotations/:id/preview): the quotation as Golden
 * Sea's customer receives it, in their own layout: EGP or the quote currency (`?currency=EGP`),
 * English or Arabic, right-to-left (`?lang=ar`), versions (older ones superseded, kept for
 * audit) and decision states. Actions follow the rules: request approval, approve / return
 * (management only), send (a draft email someone confirms), revise, record the customer's
 * decision, print, and the AI portal-submission check. Data: GET /api/commercial/quotations/:id
 * (../endpoints/commercial.ts); the actions that answer in words: ../endpoints/quotations.ts.
 * Its approvals, versions and internal cost and margin are the collections' own, read with no
 * code; the rest is a design-system kind given a query and a formatter (../format/commercial.ts).
 */
export const quotePreview = widgets({
  params: { currency: "quote", lang: "en" },
  // The decision (and its approvals) with the versions and the internal notes beside it, the
  // portal check, the copy (with its currency above it and its language on it).
  widgets: [
    steps({
      title: "Decision state",
      size: "m",
      data: quotation,
      format: fmt.quoteDecision,
    }),
    // The approval requests on this quotation and how far each has got (the approvals
    // collection's own `progress`). Deciding is in the decision state beside it.
    {
      title: "Approvals",
      size: "s",
      collection: {
        collection: "approvals",
        key: "approvals",
        layout: "list",
        where: { "subject.value": { equals: "$doc.id" } },
        sort: "-createdAt",
        hide: ["export", "columns", "select", "around", "search", "filters", "create"],
      },
    },
    // The quotation's own: every version of it (its virtual `versions`, each opening its preview),
    // and its cost and margin, never printed (the `internal` group, which Sales can't read; the
    // margin amber under the pricing policy's minimum), with its link to the pricing.
    {
      title: "Versions",
      size: "s",
      records: {
        doc: true,
        field: "versions",
        columns: ["number", "status", "totalExVat"],
        empty: "No other versions.",
      },
    },
    {
      title: "Internal — never printed",
      size: "s",
      visible: ({ user }) => user.role !== "sales",
      fields: {
        fields: [
          "internal.landedCostEGP",
          "internal.grossProfitEGP",
          "internal.marginPct",
          "internal.minMarginPct",
          "internal.exceptions",
        ],
      },
    },
    table({
      title: "Portal submission check",
      size: "m",
      data: quotation,
      empty: {
        when: (v) => !v.can.portalCheck && !fmt.portalRows(v).length,
        heading: "No portal submission to check.",
        description: "Only quotations sent through a customer's procurement portal are checked here.",
      },
      format: fmt.portalCheck,
    }),
    // It heads the copy, which is customer-facing.
    actions({
      title: "Customer copy",
      subhead: "Customer-facing: supplier names, costs and margins are never printed.",
      size: "full",
      skeleton: "text",
      data: quotation,
      format: fmt.quoteCurrency,
    }),
    // The sheet is its own surface, so no card title.
    document({
      size: "l",
      data: quotation,
      format: fmt.customerCopy,
    }),
  ],
});
