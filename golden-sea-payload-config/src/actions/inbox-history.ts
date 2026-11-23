import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The email-history import's actions (POST /api/inbox-history/…, ../endpoints/sourcing.ts).
 * "Organise" turns the kept messages into customers, vessels, suppliers and dated prices; the
 * uncertain ones wait for a person (Confirm / Reject / Change are the intake-messages collection's
 * actions), and nothing is saved before management approves the import.
 */
export const organise: Action = {
  label: m.action_history_organise(),
  icon: "sparkles",
  main: true,
  call: { path: "/inbox-history/organise" },
  done: m.action_history_organised(),
};
