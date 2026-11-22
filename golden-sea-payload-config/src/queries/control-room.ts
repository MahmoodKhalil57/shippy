import { query } from "saastemlycrm-design-system/contracts";
import type { Briefing } from "../endpoints/assistant.ts";
import type { ControlRoom } from "../endpoints/control-room.ts";

/**
 * The control room: the management dashboards for the screen's period
 * (GET /api/control-room?period=, ../endpoints/control-room.ts) and the 07:00 AI briefing
 * (GET /api/briefing, ../endpoints/assistant.ts).
 */
export const room = query.endpoint<ControlRoom>("/control-room", { period: "$param.period" });
export const briefing = query.endpoint<Briefing>("/briefing");
