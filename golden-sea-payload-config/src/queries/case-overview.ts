import { query } from "saastemlycrm-design-system/contracts";
import type { CaseOverview } from "../endpoints/platform.ts";

export const caseOverview = query.endpoint<CaseOverview>("/case-overview/$doc.id");
