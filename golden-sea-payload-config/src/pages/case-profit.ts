import { alert, custom, figures, gauges, list, table, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/profit.ts";
import type { CaseProfit } from "../endpoints/profit.ts";
import { caseProfit as profit } from "../queries/case-profit.ts";
import { m } from "../i18n/paraglide/messages.js";

const notCosted = (p: CaseProfit) => !p.costed;

export const caseProfit = widgets({
  widgets: [
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
