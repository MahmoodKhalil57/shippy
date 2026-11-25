import { query } from "saastemlycrm-design-system/contracts";
import type { Home } from "../endpoints/home.ts";

export const home = query.endpoint<Home>("/home");
export const unread = query.find<Record<string, unknown>>("notifications", {
  where: { read: { equals: false } },
  sort: "-at",
  limit: 20,
  depth: 0,
});
