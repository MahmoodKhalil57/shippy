import { query } from "saastemlycrm-design-system/contracts";
import type { Visuals } from "../endpoints/visuals.ts";

/**
 * What the dashboards draw as shapes (GET /api/visuals, ../endpoints/visuals.ts): live deadlines,
 * the month's calendar, targets, dials, what cases wait on, the suppliers' quadrant and, for the
 * money roles, receivables by customer and the gross-profit bridge.
 */
export const visuals = query.endpoint<Visuals>("/visuals");
