import { actions, document, steps, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/commercial.ts";
import { quotation } from "../queries/commercial.ts";
import { m } from "../i18n/paraglide/messages.js";

export const quotePreview = widgets({
  params: { currency: "quote", lang: "en" },
  widgets: [
    steps({
      title: m.page_quote_decision(),
      size: "m",
      data: quotation,
      format: fmt.quoteDecision,
    }),
    {
      title: m.page_quote_approvals(),
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
    {
      title: m.page_quote_versions(),
      size: "s",
      records: {
        doc: true,
        field: "versions",
        columns: ["number", "status", "totalExVat"],
        empty: m.page_quote_no_versions(),
      },
    },
    {
      title: m.page_quote_internal(),
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
      title: m.page_quote_portal(),
      size: "m",
      data: quotation,
      empty: {
        when: (v) => !v.can.portalCheck && !fmt.portalRows(v).length,
        heading: m.page_quote_no_portal(),
        description: m.page_quote_no_portal_description(),
      },
      format: fmt.portalCheck,
    }),
    actions({
      title: m.page_quote_copy(),
      subhead: m.page_quote_copy_subhead(),
      size: "full",
      skeleton: "text",
      data: quotation,
      format: fmt.quoteCurrency,
    }),
    document({
      size: "l",
      data: quotation,
      format: fmt.customerCopy,
    }),
  ],
});
