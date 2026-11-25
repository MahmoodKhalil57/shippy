import { query } from "saastemlycrm-design-system/contracts";
import type { CaseProfit } from "../endpoints/profit.ts";

export const caseProfit = query.endpoint<CaseProfit>("/case-profit/$doc.id");
