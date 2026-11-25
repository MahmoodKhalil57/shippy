import { query } from "saastemlycrm-design-system/contracts";
import type { HistoryPayload } from "../endpoints/sourcing.ts";

export const history = query.endpoint<HistoryPayload>("/inbox-history");
