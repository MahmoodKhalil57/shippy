import { figures, whatif, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/service.ts";
import * as link from "../links.ts";
import { usage } from "../queries/service.ts";
import { m } from "../i18n/paraglide/messages.js";

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
