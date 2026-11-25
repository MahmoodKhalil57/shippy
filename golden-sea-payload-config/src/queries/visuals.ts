import { query } from "saastemlycrm-design-system/contracts";
import type { Visuals } from "../endpoints/visuals.ts";

export const visuals = query.endpoint<Visuals>("/visuals");
