import { query } from "saastemlycrm-design-system/contracts";
import type { InboxDetail, InboxPayload } from "../endpoints/sourcing.ts";

/**
 * The inbox (../endpoints/sourcing.ts): the connections and today's figures, and the message open
 * in the reading pane (`?message=`, the newest when none is picked) with its extraction state,
 * beside the people a case can be given to (the `users` collection). The messages themselves are
 * the intake-messages collection's (../collections/sourcing.ts), read with these `where`s.
 */
export const inbox = query.endpoint<InboxPayload>("/inbox");
export const message = query.all({
  d: query.endpoint<InboxDetail>("/inbox/message", { id: "$param.message" }),
  users: query.find<{ id: string; name?: unknown }>("users", {
    sort: "name",
    limit: 0,
    depth: 0,
    select: { name: true },
  }),
});

/** Live messages: not the past ones the inbox-history import organised. */
export const liveMessages = { source: { not_equals: "History import" } };
/** Of those, the ones waiting for a person (a match below 85%). */
export const messagesToReview = { ...liveMessages, status: { equals: "Needs review" } };
/** The message open in the reading pane (`?message=`; none until one is picked). */
export const openMessage = { id: { equals: "$param.message" } };
/** RFQs and service requests: read into a draft case rather than matched. */
export const RFQ_KINDS = ["New RFQ", "Service request"];
