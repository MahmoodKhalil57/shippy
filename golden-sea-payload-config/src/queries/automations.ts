import { query } from "saastemlycrm-design-system/contracts";
import type { AutomationsView } from "../endpoints/platform.ts";

export const automations = query.endpoint<AutomationsView>("/automations");

export const openExceptions = { status: { equals: "Open" } };
export const autoResolvedExceptions = { status: { equals: "Auto-resolved" } };
