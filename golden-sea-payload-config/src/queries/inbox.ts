import { query } from "saastemlycrm-design-system/contracts";
import type { InboxDetail, InboxPayload } from "../endpoints/sourcing.ts";

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

export const liveMessages = { source: { not_equals: "History import" } };
export const messagesToReview = { ...liveMessages, status: { equals: "Needs review" } };
export const openMessage = { id: { equals: "$param.message" } };
export const RFQ_KINDS = ["New RFQ", "Service request"];
