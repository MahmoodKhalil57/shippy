import {
  actions,
  chart,
  dial,
  figures,
  form,
  list,
  stats,
  table,
  waterfall,
  whatif,
  widgets,
} from "saastemlycrm-design-system/contracts";
import * as shapes from "../format/visuals.ts";
import * as fmt from "../format/commercial.ts";
import type { Pricing } from "../endpoints/commercial.ts";
import { latestQuotation, pricing } from "../queries/commercial.ts";

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
/** Nothing priced yet: the shapes would only draw zeros. */
const unpriced = (P: Pricing) => !P.totals.landedEGP;

export const casePricing = widgets({
  widgets: [
    actions({
      title: "Costs and margins are hidden for your role",
      size: "s",
      skeleton: "text",
      visible: ({ user }) => user.role === "sales",
      data: latestQuotation,
      format: fmt.pricingForSales,
    }),
    // The totals with the checks beside them, the levers and the lines, the build-up, the charges.
    figures({
      data: pricing,
      format: fmt.pricingFigures,
    }),
    stats({
      title: "Margin vs markup",
      size: "s",
      skeleton: "stats",
      data: pricing,
      format: fmt.marginVsMarkup,
    }),
    list({
      title: "Policy checks",
      size: "s",
      skeleton: "list",
      data: pricing,
      format: fmt.policyChecks,
    }),
    actions({
      title: "Approval",
      size: "s",
      skeleton: "text",
      data: pricing,
      format: fmt.pricingApproval,
    }),
    // The margin against the policy on a dial, how the price is built as a bridge, and a live
    // what-if: move the margin, the discount or the rate and see the price and margin follow.
    dial({
      title: "Margin vs policy",
      size: "s",
      rows: 4,
      maxRows: 5,
      skeleton: "stats",
      data: pricing,
      hidden: unpriced,
      format: shapes.marginDial,
    }),
    waterfall({
      title: "How the price is built",
      size: "m",
      rows: 5,
      maxRows: 7,
      skeleton: "chart",
      data: pricing,
      hidden: unpriced,
      format: shapes.priceBuildUp,
    }),
    whatif({
      title: "What if",
      size: "m",
      rows: 8,
      maxRows: 9,
      skeleton: "card",
      data: pricing,
      hidden: unpriced,
      format: shapes.pricingWhatIf,
    }),
    form({
      title: "Margins and discount",
      size: "l",
      skeleton: "card",
      data: pricing,
      format: fmt.pricingLevers,
    }),
    table({
      title: "Line pricing",
      size: "l",
      skeleton: "table",
      data: pricing,
      format: fmt.linePricing,
    }),
    chart({
      title: "Price build-up per line",
      subhead: "Supplier cost + shared charges + gross profit = selling price (EGP)",
      size: "m",
      skeleton: "chart",
      data: pricing,
      format: fmt.priceBuildUp,
    }),
    table({
      title: "Shared charges",
      size: "l",
      skeleton: "table",
      data: pricing,
      format: fmt.sharedCharges,
    }),
  ],
});
