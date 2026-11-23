import { figures, whatif, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/service.ts";
import * as link from "../links.ts";
import { usage } from "../queries/service.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Value (/value): when the platform pays for itself, on Golden Sea's side: a what-if of the margin
 * from extra orders and the hours saved (starting at the proposal's illustration, to replace with
 * Golden Sea's own figures), next to what the AI's work measurably saved this month (GET
 * /api/usage, ../endpoints/service.ts). No running costs or prices.
 */
export const valuePage = widgets({
  header: {
    eyebrow: m.page_value_eyebrow(),
    heading: m.page_value_heading(),
    subtitle: m.page_value_subtitle(),
    actions: [
      { label: m.page_value_usage(), href: link.view("/usage") },
      { label: m.page_value_plan(), href: link.view("/project") },
    ],
  },
  widgets: [
    whatif({ title: m.page_value_payback(), size: "l", rows: 9, data: usage, format: fmt.payback }),
    figures({ data: usage, labels: fmt.MEASURED, format: fmt.measured }),
  ],
});
