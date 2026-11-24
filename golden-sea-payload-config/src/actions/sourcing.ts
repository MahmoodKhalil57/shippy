import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { IS_MOCK } from "../flags.ts";

/**
 * The presenter's "Simulate replies" on a case's supplier RFQs (POST /api/case-rfqs/:id/simulate-replies,
 * ../endpoints/sourcing.ts): the suppliers' replies come in, are matched by reference and become
 * offers on the Compare tab. Reminding one supplier is the supplier RFQs' own action
 * (../collections/sourcing.ts).
 */
export const simulateReplies: Action = {
  label: m.action_rfqs_simulate(),
  icon: "sync",
  main: true,
  call: { path: "/case-rfqs/$doc.id/simulate-replies" },
  done: m.action_rfqs_simulated(),
};

/** The supplier RFQs list's own actions: "Simulate replies" while the suppliers are simulated. */
export function replyActions(): Action[] {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return [simulateReplies];
  } else {
    // TODO implement actual prod third party connections
    // Suppliers' replies arrive in the purchasing mailbox: nothing to simulate.
    return [];
  }
}
