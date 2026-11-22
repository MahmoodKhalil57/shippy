import { query } from "saastemlycrm-design-system/contracts";
import type { AutomationsView } from "../endpoints/platform.ts";

/**
 * Automations & exceptions (GET /api/automations, ../endpoints/platform.ts): the rule registry
 * (the automation-rules global), the exception queue, the AI review queue and the figures that
 * span them.
 */
export const automations = query.endpoint<AutomationsView>("/automations");

/** Exceptions nobody has dealt with yet (the integration-exceptions collection). */
export const openExceptions = { status: { equals: "Open" } };
/** Exceptions closed by the idempotency check on their own (a duplicate caught). */
export const autoResolvedExceptions = { status: { equals: "Auto-resolved" } };
