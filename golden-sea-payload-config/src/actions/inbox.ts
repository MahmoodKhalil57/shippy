import type { Action, PromptField } from "saastemlycrm-design-system/contracts";
import type { ExtractionResult, InboxMessage } from "../endpoints/sourcing.ts";
import { SIMULATED_FORWARD, SIMULATED_REPLY, SIMULATED_RFQ } from "../endpoints/sourcing-data.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * The inbox: what people can do from its widgets (POST /api/inbox/…, ../endpoints/sourcing.ts):
 * simulate a new message, extract, match, review and create the case.
 */

/** A message's own step: `/inbox/<id>/<step>`. */
export const path = (id: string, step: string) => `/inbox/${encodeURIComponent(id)}/${step}`;

const simulate = (kind: "rfq" | "forward" | "reply", label: string, done: string, primary = false): Action => ({
  label,
  icon: primary ? "mail" : undefined,
  main: primary,
  call: { path: "/inbox/simulate", body: { kind } },
  done,
  // The endpoint's `href` (`?message=<new id>`) opens the new message.
  reply: true,
});

/** The demo's new arrivals: an RFQ email, a forwarded copy of one, a supplier's reply. */
export const simulations: Action[] = [
  simulate("rfq", m.action_inbox_simulate_email(), m.action_inbox_new_email({ subject: SIMULATED_RFQ.subject }), true),
  simulate(
    "forward",
    m.action_inbox_simulate_forward(),
    m.action_inbox_new_email({ subject: SIMULATED_FORWARD.subject }),
  ),
  simulate("reply", m.action_inbox_simulate_reply(), m.action_inbox_new_reply({ subject: SIMULATED_REPLY.subject })),
];

/** Set a message aside: not an RFQ, or not related to any case. */
export const notRelated = (msg: InboxMessage, label: string): Action => ({
  label,
  call: { path: path(msg.id, "review"), body: { decision: "not-related" } },
  done: m.action_inbox_not_related(),
});

/** Create the case from the draft: owner, backup and deadline are confirmed in the dialog. */
export function createAction(
  msg: InboxMessage,
  x: ExtractionResult,
  users: { docs: { id: string; name?: unknown }[] },
): Action {
  const people = users.docs.map((u) => ({ label: typeof u.name === "string" ? u.name : u.id, value: u.id }));
  const options = (id: string, name: string) => (people.length ? people : [{ label: name, value: id }]);
  const flagged = x.lines.filter((l) => l.flag).length;
  const fields: PromptField[] = [
    {
      type: "select",
      name: "owner",
      label: m.action_inbox_owner(),
      required: true,
      defaultValue: x.assignment.owner,
      options: options(x.assignment.owner, x.assignment.ownerName),
      admin: { width: "50%" },
    },
    {
      type: "select",
      name: "backup",
      label: m.action_inbox_backup(),
      defaultValue: x.assignment.backup,
      options: options(x.assignment.backup, x.assignment.backupName),
      admin: { width: "50%" },
    },
    {
      type: "date",
      name: "deadline",
      label: m.action_inbox_deadline(),
      required: true,
      defaultValue: x.assignment.deadline,
      admin: { description: m.action_inbox_deadline_hint() },
    },
  ];
  return {
    label: m.action_inbox_create(),
    main: true,
    call: { path: path(msg.id, "create-case") },
    confirm: {
      heading: m.action_inbox_create_heading(),
      label: m.action_inbox_create(),
      text: [
        m.action_inbox_creates({
          kind: x.caseType === "service" ? "service" : "rfq",
          customer: x.customerName,
          isNew: x.newCustomer ? "yes" : "no",
          count: x.lines.length,
        }),
        [
          x.acknowledgement.manual ? m.action_inbox_ack_manual() : m.action_inbox_ack_auto(),
          ...(flagged ? [m.action_inbox_flagged()] : []),
        ].join(" "),
      ].join("\n"),
    },
    fields,
    reply: true,
  };
}
