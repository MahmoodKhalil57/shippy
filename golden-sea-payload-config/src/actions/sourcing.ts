import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { IS_MOCK } from "../flags.ts";

export const simulateReplies: Action = {
  label: m.action_rfqs_simulate(),
  icon: "sync",
  main: true,
  call: { path: "/case-rfqs/$doc.id/simulate-replies" },
  done: m.action_rfqs_simulated(),
};

export function replyActions(): Action[] {
  if (IS_MOCK) {
    return [simulateReplies];
  } else {
    return [];
  }
}
