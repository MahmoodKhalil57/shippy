import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import type { BankChange, Decision } from "../endpoints/cash.ts";
import { dayTime } from "../format/index.ts";

export const decisionLines = (list: Decision[]) =>
  list
    .map(
      (x) =>
        `${m.action_cash_decided({ decision: x.decision === "Approve" ? "approve" : "reject", name: x.name || x.user })}${x.at ? ` · ${dayTime(x.at)}` : ""}${x.reason ? ` — ${x.reason}` : ""}`,
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
            label: m.action_cash_called_back(),
          },
        ]
      : []),
    { type: "textarea", name: "reason", label: m.action_cash_note_optional() },
  ];
  return [
    {
      label: m.action_cash_reject(),
      call: call("Reject"),
      confirm: {
        heading: m.action_cash_reject_heading({ title: a.title }),
        label: m.action_cash_reject(),
        tone: "error",
      },
      fields: [{ type: "textarea", name: "reason", label: m.action_cash_reason_required(), required: true }],
      done: m.action_cash_rejected({ title: a.title }),
    },
    bank
      ? {
          label: m.action_cash_approve_call_back(),
          main: true,
          call: call("Approve"),
          confirm: {
            heading: m.action_cash_approve_heading({ title: a.title }),
            text: m.action_cash_call_back_text({ phone: bank.phoneOnFile || "—" }),
            label: m.action_cash_approve(),
          },
          fields: approveFields,
          done: m.action_cash_approved({ title: a.title }),
        }
      : {
          label: m.action_cash_approve(),
          main: true,
          call: call("Approve"),
          done: m.action_cash_approved({ title: a.title }),
        },
  ];
}
