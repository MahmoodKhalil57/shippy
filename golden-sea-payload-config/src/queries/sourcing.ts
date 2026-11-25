import { query } from "saastemlycrm-design-system/contracts";
import { OPEN_RFQ_STATUSES } from "../collections/sourcing.ts";
import type { CaseRfqsPayload } from "../endpoints/sourcing.ts";

export const rfqs = query.endpoint<CaseRfqsPayload>("/sourcing/cases/$doc.id");

export const caseSupplierRfqs = { case: { equals: "$doc.id" } };
export const repliedRfqs = { ...caseSupplierRfqs, status: { in: ["Replied", "Revised offer received"] } };
export const waitingRfqs = { ...caseSupplierRfqs, status: { in: OPEN_RFQ_STATUSES } };
export const closedRfqs = { ...caseSupplierRfqs, status: { in: ["Declined", "No response"] } };

export const repliesOnCase = {
  "match.case": { equals: "$doc.id" },
  classification: { equals: "Supplier reply" },
  status: { not_equals: "Needs review" },
};
export const repliesToReview = {
  status: { equals: "Needs review" },
  or: [{ "match.case": { equals: "$doc.id" } }, { "match.candidates.case": { equals: "$doc.id" } }],
};
