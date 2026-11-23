import { actions, custom, list, message, table, text, widgets } from "saastemlycrm-design-system/contracts";
import type { CmpLine } from "../endpoints/commercial.ts";
import * as fmt from "../format/commercial.ts";
import { compare } from "../queries/commercial.ts";

/**
 * Case tab "Compare offers": every offer checked against the customer's original line,
 * normalised to EGP per base unit at the approved FX rate. "Compare by" (the `by` parameter)
 * switches unit price and landed cost (freight to the vessel's port included): the cheapest unit
 * price is not always the cheapest on board. Own Alexandria stock and agency pricelists sit next
 * to supplier offers; deviations block or flag offers; the best fit is recommended; a person
 * selects (one offer or a split) and gives a reason when it isn't the best fit. Sales never sees
 * supplier costs (the data is refused, 403). Data and actions: /api/commercial/cases/:id/*
 * (../endpoints/commercial.ts). Each widget is a design-system kind given a query and a formatter
 * (../format/commercial.ts).
 */
export const caseCompare = widgets({
  params: { by: "unit" },
  // The control, a tile per line, then what goes with the lines (the AI check, who hasn't
  // offered, the correction requests), the next step and how offers are compared.
  widgets: [
    // It reads the offers, so it is refused with them (Sales).
    actions({
      size: "full",
      data: compare,
      empty: { when: (c) => !c.lines.length, heading: "No requested lines to compare yet." },
      format: fmt.compareBy,
    }),
    // Refused for Sales (supplier costs). A tile per requested line: six, as a case's RFQ usually
    // asks (more go in the last tile).
    table.each({
      data: compare,
      size: "l",
      tiles: 6,
      empty: { heading: "No more requested lines on this case." },
      skeleton: "table",
      items: (c) => c.lines,
      key: (l: CmpLine) => `L${l.lineNo}`,
      title: (l: CmpLine) => `L${l.lineNo} · ${l.description}`,
      format: fmt.lineOffers,
    }),
    // A tile per line with offers (most of a case's lines have some by the time they're compared).
    custom.each({
      data: compare,
      size: "s",
      tiles: 4,
      empty: { heading: "No more lines with offers to check." },
      items: (c) => c.lines.filter((l) => fmt.currentOffers(l).length),
      key: (l: CmpLine) => `L${l.lineNo}-check`,
      title: (l: CmpLine) => `Offer check · L${l.lineNo} · ${l.description}`,
      format: fmt.offerCheck,
    }),
    // Usually one line still waits on a supplier; more go in the same tile.
    list.each({
      data: compare,
      size: "s",
      tiles: 1,
      empty: { heading: "No line is waiting on a supplier's offer." },
      items: (c) => c.lines.filter((l) => l.others.length),
      key: (l: CmpLine) => `L${l.lineNo}-others`,
      title: (l: CmpLine) => `Asked, no offer · L${l.lineNo} · ${l.description}`,
      format: fmt.askedNoOffer,
    }),
    // Usually one offer to correct; more go in the same tile.
    message.each({
      data: compare,
      size: "m",
      tiles: 1,
      empty: { heading: "No offers need a correction request." },
      items: fmt.corrections,
      key: (x: fmt.Correction) => `${x.offer.id}-correction`,
      title: (x: fmt.Correction) => `Correction request · ${x.offer.supplier} v${x.offer.version}`,
      format: fmt.correctionRequest,
    }),
    actions({
      title: "Next step",
      size: "s",
      skeleton: "text",
      data: compare,
      format: fmt.toPricing,
    }),
    // Sales sees why the comparison is hidden instead (supplier costs).
    text({
      title: "How offers are compared",
      size: "s",
      skeleton: "text",
      denied:
        "Costs and margins are hidden for your role. Supplier offers carry supplier costs, so Sales sees the selling prices on the quotation instead. Supply chain, finance and management compare offers.",
      data: compare,
      format: fmt.howCompared,
    }),
  ],
});
