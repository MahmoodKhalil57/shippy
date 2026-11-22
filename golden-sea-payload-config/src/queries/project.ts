import { query } from "saastemlycrm-design-system/contracts";
import type { ProjectView } from "../endpoints/platform.ts";

/**
 * The delivery plan (GET /api/project, ../endpoints/platform.ts): phases, work packages, the
 * brief line by line and the acceptance tests checked live. No prices, rates, effort or costs.
 */
export const plan = query.endpoint<ProjectView>("/project");
