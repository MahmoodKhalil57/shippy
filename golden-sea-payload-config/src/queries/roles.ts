import { query } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";

export const roles = query.endpoint<RolesView>("/roles");
export const routing = query.endpoint<Routing>("/on-call/route", { at: "$param.at" });
