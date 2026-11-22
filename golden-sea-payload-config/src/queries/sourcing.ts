import { query } from "saastemlycrm-design-system/contracts";
import { OPEN_RFQ_STATUSES } from "../collections/sourcing.ts";
import type { CaseRfqsPayload } from "../endpoints/sourcing.ts";

/**
 * A case's supplier RFQs (../endpoints/sourcing.ts): its lines, the RFQs' reminder schedules, new
 * suppliers saved from replies, and the drafts kept on the server until sent. The RFQs themselves
 * are read from their collection (`caseSupplierRfqs`), the replies from the intake messages
 * (`repliesOnCase`, `repliesToReview`).
 */
export const rfqs = query.endpoint<CaseRfqsPayload>("/sourcing/cases/$doc.id");

/** The open case's supplier RFQs. */
export const caseSupplierRfqs = { case: { equals: "$doc.id" } };
/** Of those, the ones a supplier answered with an offer. */
export const repliedRfqs = { ...caseSupplierRfqs, status: { in: ["Replied", "Revised offer received"] } };
/** Still waiting on the supplier: reminders apply. */
export const waitingRfqs = { ...caseSupplierRfqs, status: { in: OPEN_RFQ_STATUSES } };
/** Closed without an offer. */
export const closedRfqs = { ...caseSupplierRfqs, status: { in: ["Declined", "No response"] } };

/** Supplier replies matched to the open case (by reference, thread and sender), not waiting for a person. */
export const repliesOnCase = {
  "match.case": { equals: "$doc.id" },
  classification: { equals: "Supplier reply" },
  status: { not_equals: "Needs review" },
};
/** Replies waiting for a person that may belong to the open case: its own guess, or one of its candidates. */
export const repliesToReview = {
  status: { equals: "Needs review" },
  or: [{ "match.case": { equals: "$doc.id" } }, { "match.candidates.case": { equals: "$doc.id" } }],
};
