import { alert, custom, figures, gauges, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/profit.ts";
import type { CaseProfit } from "../endpoints/profit.ts";
import { caseProfit as profit } from "../queries/case-profit.ts";
import { m } from "../i18n/paraglide/messages.js";

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
      denied: m.page_profit_denied(),
      data: profit,
      format: fmt.profitStatus,
    }),
    figures({
      data: profit,
      labels: fmt.PROFIT_FIGURES,
      name: fmt.profitFigureName,
      format: fmt.profitFigures,
    }),
    gauges({
      title: m.page_profit_close_progress(),
      size: "s",
      data: profit,
      format: fmt.closeProgress,
    }),
    list({
      title: m.page_profit_close_checklist(),
      size: "s",
      skeleton: "list",
      data: profit,
      format: fmt.closeChecklist,
    }),
    list({
      title: m.page_profit_claims(),
      size: "s",
      skeleton: "list",
      data: profit,
      empty: { when: notCosted, heading: m.page_profit_no_claims() },
      format: fmt.claims,
    }),
    custom({
      title: m.page_profit_damage(),
      size: "s",
      data: profit,
      empty: { when: notCosted, heading: m.page_profit_no_delivery() },
      format: fmt.damageReader,
    }),
    table({
      title: m.page_profit_cost_title(),
      size: "l",
      skeleton: "table",
      data: profit,
      empty: {
        when: notCosted,
        heading: m.page_profit_no_cost_sheet(),
        description: m.page_profit_no_cost_sheet_description(),
      },
      format: fmt.costLines,
    }),
    table({
      title: m.page_profit_fx(),
      size: "l",
      skeleton: "table",
      data: profit,
      empty: { when: notCosted, heading: m.page_profit_no_receipts() },
      format: fmt.fxReceipts,
    }),
  ],
});
