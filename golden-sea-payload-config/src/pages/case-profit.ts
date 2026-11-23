import { alert, custom, figures, gauges, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/profit.ts";
import type { CaseProfit } from "../endpoints/profit.ts";
import { caseProfit as profit } from "../queries/case-profit.ts";

/**
 * Case tab "Profit & close": the profit expected when the quotation was approved against the
 * actual once costs are billed, the FX differences on receipts, claims, and the close checklist.
 * Data and actions: /api/case-profit/:id (../endpoints/profit.ts). Sales is refused it (403).
 * Each widget is a design-system kind given a query and a formatter (../format/profit.ts).
 */
/** Not costed yet (the expected profit waits for the customer PO): nothing to compare or claim. */
const notCosted = (p: CaseProfit) => !p.costed;

export const caseProfit = widgets({
  widgets: [
    // Above everything: closed, not costed yet, or the close checks still open. Sales is told the
    // tab isn't for them.
    alert({
      size: "full",
      skeleton: "text",
      denied: "Profit, costs and margins are not visible to Sales.",
      data: profit,
      format: fmt.profitStatus,
    }),
    figures({
      data: profit,
      labels: fmt.PROFIT_FIGURES,
      format: fmt.profitFigures,
    }),
    gauges({
      title: "Close progress",
      size: "s",
      data: profit,
      format: fmt.closeProgress,
    }),
    list({
      title: "Close checklist",
      size: "s",
      skeleton: "list",
      data: profit,
      format: fmt.closeChecklist,
    }),
    list({
      title: "Claims",
      size: "s",
      skeleton: "list",
      data: profit,
      empty: { when: notCosted, heading: "No claims before the case is costed." },
      format: fmt.claims,
    }),
    custom({
      title: "Damage for a claim",
      size: "s",
      data: profit,
      empty: { when: notCosted, heading: "No delivery to claim against yet." },
      format: fmt.damageReader,
    }),
    table({
      title: "Expected vs actual cost",
      size: "l",
      skeleton: "table",
      data: profit,
      empty: {
        when: notCosted,
        heading: "No cost sheet yet.",
        description: "Expected costs are fixed when the customer's PO is confirmed.",
      },
      format: fmt.costLines,
    }),
    table({
      title: "FX differences",
      size: "l",
      skeleton: "table",
      data: profit,
      empty: { when: notCosted, heading: "No receipts yet." },
      format: fmt.fxReceipts,
    }),
  ],
});
