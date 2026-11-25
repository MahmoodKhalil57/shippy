import type { Action } from "saastemlycrm-design-system/contracts";
import { m } from "../i18n/paraglide/messages.js";
import { day, dayTime, person } from "../format/index.ts";
import type { CaseOps } from "../endpoints/order-to-cash.ts";
import { IS_MOCK } from "../flags.ts";

export const caseDeliveryPath = "/case-delivery/$doc.id";

const AGENT_EMAIL: Record<string, { from: string; subject: string; body: string; eta: string }> = {
  "gs-rfq-0133": {
    from: "ops@abuqir-marine.example",
    subject: "DOS Falcon — revised return to base",
    body: "Good morning, due to weather at the rig the DOS Falcon will now return to Abu Qir base on 22 Nov at 16:00 local slot. Please re-arrange your delivery accordingly. Regards, Abu Qir Marine Services",
    eta: "2026-11-22T16:00:00.000Z",
  },
  "gs-rfq-0142": {
    from: "ops@canallink.example",
    subject: "MV Aurora Crest — ETA update",
    body: "Dear Golden Sea, MV Aurora Crest now expected Port Said anchorage 20 Nov 22:00 (was 21 Nov 08:00). Launch to be re-booked. Rgds, Canal Link Agency",
    eta: "2026-11-20T22:00:00.000Z",
  },
};

export function etaAction(d: CaseOps): Action | undefined {
  if (IS_MOCK) {
    return simulatedEta(d);
  } else {
    return undefined;
  }
}

function simulatedEta(d: CaseOps): Action | undefined {
  const email = AGENT_EMAIL[d.case.id];
  if (!email) return undefined;
  const open = d.deliveries.filter((x) => !/confirmed|Cancelled|Dispatched/.test(x.status));
  const moves = [
    ...(open.length
      ? open.map((x) =>
          m.action_eta_move({
            drop: x.number,
            from: dayTime(x.plannedAt),
            to: dayTime(email.eta),
            owner: person(d.case.owner),
          }),
        )
      : [m.action_eta_no_drop()]),
    ...d.backorders.map((b) =>
      (b.date && b.date > email.eta ? m.action_eta_backorder_late : m.action_eta_backorder_in_time)({
        line: b.lineNo,
        supplier: b.supplierName,
        date: day(b.date),
      }),
    ),
    m.action_eta_alert({ owner: person(d.case.owner) }),
  ];
  return {
    label: m.action_eta_label(),
    call: { path: `${caseDeliveryPath}/eta` },
    confirm: {
      heading: m.action_eta_heading(),
      text: [
        m.action_eta_from({ from: email.from, subject: email.subject }),
        email.body,
        "",
        m.action_eta_read({ eta: dayTime(email.eta), was: dayTime(d.case.eta) }),
        "",
        m.action_eta_what_moves(),
        ...moves,
      ].join("\n"),
      label: m.action_eta_apply(),
    },
    reply: true,
  };
}
