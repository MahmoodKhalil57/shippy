import { query } from "saastemlycrm-design-system/contracts";
import type { UsageView } from "../endpoints/service.ts";

export const usage = query.endpoint<UsageView>("/usage");
