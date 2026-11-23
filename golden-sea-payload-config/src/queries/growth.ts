import { query } from "saastemlycrm-design-system/contracts";
import { GROWTH_STAGES } from "../collections/growth.ts";
import type { Growth } from "../endpoints/growth-crm.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The growth CRM: fleets per ship manager (GET /api/growth, ../endpoints/growth-crm.ts), and the
 * opportunities' shared `where`s (../pages/growth.ts).
 */
export const growth = query.endpoint<Growth>("/growth");

/** The board's columns, the opportunities' stages in order ("Closed" stays off the board). */
export const BOARD_STAGES = GROWTH_STAGES.filter((s) => s !== "Closed");

/** Opportunities still open (not closed). */
export const openOpportunities = { stage: { not_equals: "Closed" } };
/** Of those, the ones with a next step to take: every one but an active account with nothing planned. */
export const nextSteps = {
  and: [openOpportunities, { or: [{ stage: { not_equals: "Active account" } }, { nextStep: { exists: true } }] }],
};
/** Registrations still waiting on documents or a committee. */
export const registrationsInProgress = { status: { not_in: ["Approved", "Rejected"] } };

/** A stage's words in the interface's language (the stored value is the English one). */
const STAGE_NAMES: Record<string, () => string> = {
  Prospect: m.page_growth_stage_prospect,
  Introduced: m.page_growth_stage_introduced,
  "Registration submitted": m.page_growth_stage_registration,
  "Approved vendor": m.page_growth_stage_approved,
  "First RFQ": m.page_growth_stage_first_rfq,
  "Active account": m.page_growth_stage_active,
};

/**
 * The growth funnel's stages (counts, `layout: "funnel"`): each the prospects that reached it or
 * went further, so the funnel narrows as the pipeline does. "Closed" is left out.
 */
export const funnelStages = GROWTH_STAGES.filter((s) => s !== "Closed").map((s, i, stages) => ({
  label: STAGE_NAMES[s]?.() ?? s,
  where: { stage: { in: stages.slice(i) } },
}));
