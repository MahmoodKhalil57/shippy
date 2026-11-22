import { query, type Doc } from "saastemlycrm-design-system/contracts";
import type { CompareWithDrafts, Pricing, QuoteView } from "../endpoints/commercial.ts";

/**
 * A case's commercial side (../endpoints/commercial.ts): its offers compared (with the AI-drafted
 * correction requests), its pricing, and a quotation as the customer receives it. Supplier costs
 * are refused for Sales (403).
 */
export const compare = query.endpoint<CompareWithDrafts>("/commercial/cases/$doc.id/compare");
export const pricing = query.endpoint<Pricing>("/commercial/cases/$doc.id/pricing");
export const quotation = query.endpoint<QuoteView>("/commercial/quotations/$doc.id");
/** The case's latest quotation (selling prices only: what Sales may open). */
export const latestQuotation = query.find<Doc>("quotations", {
  where: { case: { equals: "$doc.id" } },
  sort: "-version",
  limit: 1,
  depth: 0,
});
