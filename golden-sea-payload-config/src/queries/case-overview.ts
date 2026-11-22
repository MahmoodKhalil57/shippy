import { query } from "saastemlycrm-design-system/contracts";
import type { CaseOverview } from "../endpoints/platform.ts";

/**
 * A case at a glance (GET /api/case-overview/:id, ../endpoints/platform.ts): its lifecycle step,
 * what happened after the order and its timeline (for the on-device summary). What the case says
 * on its own (next action, line progress and status, owner and backup, clarifications, contact
 * rule, activity log) is read from it and its collections.
 */
export const caseOverview = query.endpoint<CaseOverview>("/case-overview/$doc.id");
