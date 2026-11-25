import { query, type Doc } from "saastemlycrm-design-system/contracts";
import type { CompareWithDrafts, Pricing, QuoteView } from "../endpoints/commercial.ts";

export const compare = query.endpoint<CompareWithDrafts>("/commercial/cases/$doc.id/compare");
export const pricing = query.endpoint<Pricing>("/commercial/cases/$doc.id/pricing");
export const quotation = query.endpoint<QuoteView>("/commercial/quotations/$doc.id");
export const latestQuotation = query.find<Doc>("quotations", {
  where: { case: { equals: "$doc.id" } },
  sort: "-version",
  limit: 1,
  depth: 0,
});
