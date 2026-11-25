import { actions, custom, list, message, table, text, widgets } from "saastemlycrm-design-system/contracts";
import type { CmpLine } from "../endpoints/commercial.ts";
import * as fmt from "../format/commercial.ts";
import { compare } from "../queries/commercial.ts";
import { m } from "../i18n/paraglide/messages.js";

export const caseCompare = widgets({
  params: { by: "unit" },
  widgets: [
    actions({
      size: "full",
      data: compare,
      empty: { when: (c) => !c.lines.length, heading: m.page_compare_no_lines() },
      format: fmt.compareBy,
    }),
    table.each({
      data: compare,
      size: "l",
      tiles: 6,
      empty: { heading: m.page_compare_no_more_lines() },
      skeleton: "table",
      items: (c) => c.lines,
      key: (l: CmpLine) => `L${l.lineNo}`,
      title: (l: CmpLine) => m.page_compare_line_title({ line: l.lineNo, description: l.description }),
      format: fmt.lineOffers,
    }),
    custom.each({
      data: compare,
      size: "s",
      tiles: 4,
      empty: { heading: m.page_compare_no_more_checks() },
      items: (c) => c.lines.filter((l) => fmt.currentOffers(l).length),
      key: (l: CmpLine) => `L${l.lineNo}-check`,
      title: (l: CmpLine) => m.page_compare_check_title({ line: l.lineNo, description: l.description }),
      format: fmt.offerCheck,
    }),
    list.each({
      data: compare,
      size: "s",
      tiles: 1,
      empty: { heading: m.page_compare_no_waiting() },
      items: (c) => c.lines.filter((l) => l.others.length),
      key: (l: CmpLine) => `L${l.lineNo}-others`,
      title: (l: CmpLine) => m.page_compare_others_title({ line: l.lineNo, description: l.description }),
      format: fmt.askedNoOffer,
    }),
    message.each({
      data: compare,
      size: "m",
      tiles: 1,
      empty: { heading: m.page_compare_no_corrections() },
      items: fmt.corrections,
      key: (x: fmt.Correction) => `${x.offer.id}-correction`,
      title: (x: fmt.Correction) =>
        m.page_compare_correction_title({ supplier: x.offer.supplier, version: x.offer.version }),
      format: fmt.correctionRequest,
    }),
    actions({
      title: m.page_compare_next_step(),
      size: "s",
      skeleton: "text",
      data: compare,
      format: fmt.toPricing,
    }),
    text({
      title: m.page_compare_how_title(),
      size: "s",
      skeleton: "text",
      denied: m.page_compare_denied(),
      data: compare,
      format: fmt.howCompared,
    }),
  ],
});
