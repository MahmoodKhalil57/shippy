import type { Action, PromptField } from "saastemlycrm-design-system/contracts";
import type { ExtractionResult, InboxMessage } from "../endpoints/sourcing.ts";
import { SIMULATED_FORWARD, SIMULATED_REPLY, SIMULATED_RFQ } from "../endpoints/sourcing-data.ts";
import { plural } from "../format/inbox.ts";

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
  simulate("rfq", "Simulate new email", `New email: “${SIMULATED_RFQ.subject}”`, true),
  simulate("forward", "Simulate forwarded copy", `New email: “${SIMULATED_FORWARD.subject}”`),
  simulate("reply", "Simulate supplier reply", `New supplier reply: “${SIMULATED_REPLY.subject}”`),
];

/** Set a message aside: not an RFQ, or not related to any case. */
export const notRelated = (m: InboxMessage, label: string): Action => ({
  label,
  call: { path: path(m.id, "review"), body: { decision: "not-related" } },
  done: "Marked not related",
});

/** Create the case from the draft: owner, backup and deadline are confirmed in the dialog. */
export function createAction(
  m: InboxMessage,
  x: ExtractionResult,
  users: { docs: { id: string; name?: unknown }[] },
): Action {
  const people = users.docs.map((u) => ({ label: typeof u.name === "string" ? u.name : u.id, value: u.id }));
  const options = (id: string, name: string) => (people.length ? people : [{ label: name, value: id }]);
  const flagged = x.lines.filter((l) => l.flag).length;
  const kind = x.caseType === "service" ? "service" : "RFQ";
  const fields: PromptField[] = [
    {
      type: "select",
      name: "owner",
      label: "Owner",
      required: true,
      defaultValue: x.assignment.owner,
      options: options(x.assignment.owner, x.assignment.ownerName),
      admin: { width: "50%" },
    },
    {
      type: "select",
      name: "backup",
      label: "Backup",
      defaultValue: x.assignment.backup,
      options: options(x.assignment.backup, x.assignment.backupName),
      admin: { width: "50%" },
    },
    {
      type: "date",
      name: "deadline",
      label: "Quote deadline",
      required: true,
      defaultValue: x.assignment.deadline,
      admin: { description: "A reminder is scheduled before it." },
    },
  ];
  return {
    label: "Create case",
    main: true,
    call: { path: path(m.id, "create-case") },
    confirm: {
      heading: "Create this case?",
      label: "Create case",
      text: [
        `Creates a ${kind} case for ${x.customerName}${x.newCustomer ? " (new customer record)" : ""} with ${plural(x.lines.length, "line")} exactly as drafted.`,
        `${x.acknowledgement.manual ? "The acknowledgement is yours to send by hand." : "The acknowledgement is sent once, from the approved template."}${flagged ? " Flagged lines stay “Clarification needed” until the customer answers." : ""}`,
      ].join("\n"),
    },
    fields,
    reply: true,
  };
}
