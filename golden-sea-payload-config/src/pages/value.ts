import { figures, whatif, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/service.ts";
import * as link from "../links.ts";
import { usage } from "../queries/service.ts";

/**
 * Value (/value): when the platform pays for itself, on Golden Sea's side: a what-if of the margin
 * from extra orders and the hours saved (starting at the proposal's illustration, to replace with
 * Golden Sea's own figures), next to what the AI's work measurably saved this month (GET
 * /api/usage, ../endpoints/service.ts). No running costs or prices.
 */
export const valuePage = widgets({
  header: {
    eyebrow: "Insights · value",
    heading: "What the platform is worth to you",
    subtitle:
      "Extra orders won and hours saved, in your own figures. Move the sliders; nothing is saved. Below, what the AI's work saved this month.",
    actions: [
      { label: "Service usage", href: link.view("/usage") },
      { label: "Delivery plan", href: link.view("/project") },
    ],
  },
  widgets: [
    whatif({ title: "When it pays for itself", size: "l", rows: 9, data: usage, format: fmt.payback }),
    figures({ data: usage, format: fmt.measured }),
  ],
});
