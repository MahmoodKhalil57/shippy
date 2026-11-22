import { query } from "saastemlycrm-design-system/contracts";
import type { Home } from "../endpoints/home.ts";

/**
 * The signed-in user's day (GET /api/home, ../endpoints/home.ts), tailored to their role, and
 * their unread notifications (for the header's "While you were away").
 */
export const home = query.endpoint<Home>("/home");
export const unread = query.find<Record<string, unknown>>("notifications", {
  where: { read: { equals: false } },
  sort: "-at",
  limit: 20,
  depth: 0,
});
