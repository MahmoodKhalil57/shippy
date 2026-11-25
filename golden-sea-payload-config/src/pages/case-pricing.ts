import {
  actions,
  chart,
  dial,
  figures,
  form,
  list,
  table,
  waterfall,
  whatif,
  widgets,
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import * as fmt from "../format/commercial.ts";
import type { Pricing } from "../endpoints/commercial.ts";
import { latestQuotation, pricing } from "../queries/commercial.ts";
import { m } from "../i18n/paraglide/messages.js";

const NOT_PRICED = {
  when: (P: Pricing) => !P.totals.landedEGP,
  heading: m.page_pricing_not_priced(),
  description: m.page_pricing_not_priced_description(),
};

export const casePricing = widgets({
  widgets: [
    actions({
      title: m.page_pricing_hidden(),
      size: "s",
      skeleton: "text",
      visible: ({ user }) => user.role === "sales",
      data: latestQuotation,
      format: fmt.pricingForSales,
    }),
    figures({
      data: pricing,
      labels: fmt.PRICING_FIGURES,
      name: fmt.pricingFigureName,
      format: fmt.pricingFigures,
    }),
    figures({
      data: pricing,
      labels: fmt.MARGIN_FIGURES,
      name: fmt.marginFigureName,
      format: fmt.marginVsMarkup,
    }),
    list({
      title: m.page_pricing_policy_checks(),
      size: "s",
      skeleton: "list",
      data: pricing,
      format: fmt.policyChecks,
    }),
    actions({
      title: m.page_pricing_approval(),
      size: "s",
      skeleton: "text",
      data: pricing,
      format: fmt.pricingApproval,
    }),
    dial({
      title: m.page_pricing_margin_vs_policy(),
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: pricing,
      empty: NOT_PRICED,
      format: shapes.marginDial,
    }),
    waterfall({
      title: m.page_pricing_how_built(),
      size: "m",
      rows: 5,
      maxRows: 7,
      skeleton: "chart",
      data: pricing,
      empty: NOT_PRICED,
      format: shapes.priceBuildUp,
    }),
    whatif({
      title: m.page_pricing_what_if(),
      size: "m",
      rows: 8,
      maxRows: 9,
      skeleton: "card",
      data: pricing,
      empty: NOT_PRICED,
      format: shapes.pricingWhatIf,
    }),
    form({
      title: m.page_pricing_levers(),
      size: "l",
      skeleton: "card",
      data: pricing,
      format: fmt.pricingLevers,
    }),
    table({
      title: m.page_pricing_lines(),
      size: "l",
      skeleton: "table",
      data: pricing,
      format: fmt.linePricing,
    }),
    chart({
      title: m.page_pricing_build_up(),
      subhead: m.page_pricing_build_up_subhead(),
      size: "m",
      skeleton: "chart",
      data: pricing,
      format: fmt.priceBuildUp,
    }),
    table({
      title: m.page_pricing_shared_charges(),
      size: "l",
      skeleton: "table",
      data: pricing,
      format: fmt.sharedCharges,
    }),
  ],
});
