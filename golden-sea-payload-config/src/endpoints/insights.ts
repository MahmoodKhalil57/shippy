import type { Endpoint } from "payload";
import { assistantEndpoints } from "./assistant.ts";
import { controlRoomEndpoints } from "./control-room.ts";
import { growthEndpoints } from "./growth-crm.ts";
import { profitEndpoints } from "./profit.ts";

/**
 * Root endpoints for: Actual profit, control room, AI briefing, Ask Golden Sea, growth CRM.
 * Registered in ./index.ts.
 *
 * - /api/case-profit/:id (+ /actuals, /receipt, /claims/:ref, /close) — ./profit.ts
 * - /api/control-room?period= — ./control-room.ts
 * - /api/briefing, /api/ask, /api/ask/suggestions — ./assistant.ts
 * - /api/growth, /api/growth/:id/outcome — ./growth-crm.ts
 */
export const insightsEndpoints: Endpoint[] = [
  ...profitEndpoints,
  ...controlRoomEndpoints,
  ...assistantEndpoints,
  ...growthEndpoints,
];
