import { query } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";

/**
 * Roles & permissions (../endpoints/platform.ts): where each permission is enforced and the live
 * checks that it is (GET /api/roles), and who an urgent RFQ arriving at `?at=` goes to
 * (GET /api/on-call/route, its own request so picking a time asks only that). The matrix and the
 * roster are the settings and on-call-roster globals' rows (`records` on the page).
 */
export const roles = query.endpoint<RolesView>("/roles");
export const routing = query.endpoint<Routing>("/on-call/route", { at: "$param.at" });
