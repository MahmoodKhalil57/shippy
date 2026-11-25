import { query } from "saastemlycrm-design-system/contracts";
import type { Briefing } from "../endpoints/assistant.ts";
import type { ControlRoom } from "../endpoints/control-room.ts";

export const room = query.endpoint<ControlRoom>("/control-room", { period: "$param.period" });
export const briefing = query.endpoint<Briefing>("/briefing");
