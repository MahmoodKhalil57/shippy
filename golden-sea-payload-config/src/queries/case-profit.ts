import { query } from "saastemlycrm-design-system/contracts";
import type { CaseProfit } from "../endpoints/profit.ts";

/**
 * A case's profit and close (GET /api/case-profit/:id, ../endpoints/profit.ts): expected vs actual
 * cost, FX on receipts, claims and the close checklist. Sales is refused it (403).
 */
export const caseProfit = query.endpoint<CaseProfit>("/case-profit/$doc.id");
