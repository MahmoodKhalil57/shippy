import type { Action } from "saastemlycrm-design-system/contracts";
import type { BankChange, Decision } from "../endpoints/cash.ts";
import { dayTime } from "../format/index.ts";

/**
 * Payables: what people can do from the cash widgets (POST /api/cash/…, ../endpoints/cash.ts,
 * which re-check who may do what) and the words around it. The system records payments after the
 * bank movement: it never pays. Invoice reminders are the invoices' own actions
 * (../collections/finance.ts).
 */

/** Who decided what, one line each. */
export const decisionLines = (list: Decision[]) =>
  list
    .map(
      (x) =>
        `${x.decision === "Approve" ? "Approved" : "Rejected"} by ${x.name || x.user}${x.at ? ` · ${dayTime(x.at)}` : ""}${x.reason ? ` — ${x.reason}` : ""}`,
    )
    .join("\n");

export function decideActions(a: { id: string; title: string }, bank: BankChange["request"] | false): Action[] {
  const call = (decision: "Approve" | "Reject") => ({ path: "/cash/decide", body: { approval: a.id, decision } });
  const approveFields: Action["fields"] = [
    ...(bank
      ? [
          {
            type: "checkbox",
            name: "callBack",
            label: "I called back on the number on file and the supplier confirmed the new account",
          },
        ]
      : []),
    { type: "textarea", name: "reason", label: "Note (optional)" },
  ];
  return [
    {
      label: "Reject",
      call: call("Reject"),
      confirm: { heading: `Reject: ${a.title}`, label: "Reject", tone: "error" },
      fields: [{ type: "textarea", name: "reason", label: "Reason (required)", required: true }],
      done: `Rejected: ${a.title}.`,
    },
    // A bank-detail change asks for the call-back first (a form). A payment approval pays nothing
    // (recording the payment is its own confirmed step), so it happens at once. Either can be
    // withdrawn with the snackbar's Undo until the details are applied or the payment recorded.
    bank
      ? {
          label: "Approve after call-back",
          main: true,
          call: call("Approve"),
          confirm: {
            heading: `Approve: ${a.title}`,
            text: `Call the supplier back on the number on file (${bank.phoneOnFile || "—"}) — never on a number from the request — and confirm the new account with them.`,
            label: "Approve",
          },
          fields: approveFields,
          done: `Approved: ${a.title}.`,
        }
      : { label: "Approve", main: true, call: call("Approve"), done: `Approved: ${a.title}.` },
  ];
}
