import { query } from "saastemlycrm-design-system/contracts";
import type { HistoryPayload } from "../endpoints/sourcing.ts";

/**
 * The email-history import (GET /api/inbox-history, ../endpoints/sourcing.ts): the mailboxes
 * scanned, the de-duplication, what "Organise" found, the uncertain items and the approval.
 */
export const history = query.endpoint<HistoryPayload>("/inbox-history");
