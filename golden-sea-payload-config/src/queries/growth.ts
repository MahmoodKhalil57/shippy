import { query } from "saastemlycrm-design-system/contracts";
import { GROWTH_STAGES } from "../collections/growth.ts";
import type { Growth } from "../endpoints/growth-crm.ts";
import { m } from "../i18n/paraglide/messages.js";

export const growth = query.endpoint<Growth>("/growth");

export const BOARD_STAGES = GROWTH_STAGES.filter((s) => s !== "Closed");

export const openOpportunities = { stage: { not_equals: "Closed" } };
export const nextSteps = {
  and: [openOpportunities, { or: [{ stage: { not_equals: "Active account" } }, { nextStep: { exists: true } }] }],
};
export const registrationsInProgress = { status: { not_in: ["Approved", "Rejected"] } };

const STAGE_NAMES: Record<string, () => string> = {
  Prospect: m.page_growth_stage_prospect,
  Introduced: m.page_growth_stage_introduced,
  "Registration submitted": m.page_growth_stage_registration,
  "Approved vendor": m.page_growth_stage_approved,
  "First RFQ": m.page_growth_stage_first_rfq,
  "Active account": m.page_growth_stage_active,
};

export const funnelStages = GROWTH_STAGES.filter((s) => s !== "Closed").map((s, i, stages) => ({
  label: STAGE_NAMES[s]?.() ?? s,
  where: { stage: { in: stages.slice(i) } },
}));
