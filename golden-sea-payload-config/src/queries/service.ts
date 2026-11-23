import { query } from "saastemlycrm-design-system/contracts";
import type { UsageView } from "../endpoints/service.ts";

/**
 * The service counted (GET /api/usage, ../endpoints/service.ts): this month's use of each measure
 * against the plan at full use, and what the AI's work saved. Units only, no prices.
 */
export const usage = query.endpoint<UsageView>("/usage");
