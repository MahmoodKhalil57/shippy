import type { Endpoint } from "payload";
import { assistantEndpoints } from "./assistant.ts";
import { controlRoomEndpoints } from "./control-room.ts";
import { growthEndpoints } from "./growth-crm.ts";
import { profitEndpoints } from "./profit.ts";
import { visualsEndpoints } from "./visuals.ts";

export const insightsEndpoints: Endpoint[] = [
  ...profitEndpoints,
  ...controlRoomEndpoints,
  ...assistantEndpoints,
  ...growthEndpoints,
  ...visualsEndpoints,
];
