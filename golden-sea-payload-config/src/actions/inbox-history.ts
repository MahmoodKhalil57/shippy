import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";

export const organise: Action = {
  label: m.action_history_organise(),
  icon: "sparkles",
  main: true,
  call: { path: "/inbox-history/organise" },
  done: m.action_history_organised(),
};
