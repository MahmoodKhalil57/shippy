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

/**
 * Case tab "Pricing": the selected offers become landed costs (shared charges — launch, freight,
 * bank charges… — allocated by value, quantity or equally), a margin per line (shown next to its
 * markup), an optional customer discount and the selling price in the quote currency at the
 * approved FX rate. Policy checks come from the pricing-policy global; "Request approval"
 * snapshots the quotation and creates a real approval for Karim Balbaa. Sales is refused the
 * pricing (403) and sees why, with a link to the quotation. Data and actions:
 * /api/commercial/cases/:id/pricing and /request-approval (../endpoints/commercial.ts). Each widget
 * is a design-system kind given a query and a formatter (../format/commercial.ts).
 */
/** Nothing priced yet: the shapes would only draw zeros, so they say so in their own boxes. */
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
    // The totals with the checks beside them, the levers and the lines, the build-up, the charges.
    figures({
      data: pricing,
      labels: fmt.PRICING_FIGURES,
      name: fmt.pricingFigureName,
      format: fmt.pricingFigures,
    }),
    // Margin and markup, the same profit read two ways: a figure each.
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
    // The margin against the policy on a dial, how the price is built as a bridge, and a live
    // what-if: move the margin, the discount or the rate and see the price and margin follow.
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
