import { alert, custom, figures, gauges, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/profit.ts";
import { caseProfit as profit } from "../queries/case-profit.ts";

/**
 * Case tab "Profit & close": the profit expected when the quotation was approved against the
 * actual once costs are billed, the FX differences on receipts, claims, and the close checklist.
 * Data and actions: /api/case-profit/:id (../endpoints/profit.ts). Sales is refused it (403).
 * Each widget is a design-system kind given a query and a formatter (../format/profit.ts).
 */
export const caseProfit = widgets({
  widgets: [
    // Above everything; Sales is told the tab isn't for them.
    alert({
      size: "full",
      skeleton: "text",
      denied: "Profit, costs and margins are not visible to Sales.",
      data: profit,
      hidden: (p) => !p.closed && p.costed,
      format: fmt.profitStatus,
    }),
    figures({
      data: profit,
      hidden: (p) => !p.costed,
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
      hidden: (p) => !p.costed,
      format: fmt.claims,
    }),
    custom({
      title: "Damage for a claim",
      size: "s",
      data: profit,
      hidden: (p) => !p.costed,
      format: fmt.damageReader,
    }),
    table({
      title: "Expected vs actual cost",
      size: "l",
      skeleton: "table",
      data: profit,
      hidden: (p) => !p.costed,
      format: fmt.costLines,
    }),
    table({
      title: "FX differences",
      size: "l",
      skeleton: "table",
      data: profit,
      hidden: (p) => !p.costed,
      format: fmt.fxReceipts,
    }),
  ],
});
