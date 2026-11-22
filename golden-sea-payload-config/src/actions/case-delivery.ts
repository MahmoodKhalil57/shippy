import type { Action } from "saastemlycrm-design-system/contracts";
import { day, dayTime, person } from "../format/index.ts";
import type { CaseOps } from "../endpoints/order-to-cash.ts";

/**
 * A case's delivery and billing: what people can do from the delivery widgets (POST
 * /api/case-delivery/:id/…, ../endpoints/order-to-cash.ts, which re-checks who may do what).
 */

/** The delivery tab's own endpoints, for the case the tab is about. */
export const caseDeliveryPath = "/case-delivery/$doc.id";

/** The agents' ETA emails the presenter can "receive" (mirrors ETA_UPDATES in the endpoint). */
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

/** The agent's ETA email arriving: what it moves (open drops, backorders), applied on confirm. */
export function etaAction(d: CaseOps): Action | undefined {
  const email = AGENT_EMAIL[d.case.id];
  if (!email) return undefined;
  const open = d.deliveries.filter((x) => !/confirmed|Cancelled|Dispatched/.test(x.status));
  const moves = [
    ...(open.length
      ? open.map(
          (x) =>
            `${x.number}: on board ${dayTime(x.plannedAt)} → ${dayTime(email.eta)} · launch re-booked · truck & boarding staff re-confirmed (task for ${person(d.case.owner)})`,
        )
      : ["No open drop to move."]),
    ...d.backorders.map(
      (b) =>
        `Backorder L${b.lineNo} (${b.supplierName}, ${day(b.date)}): ${b.date && b.date > email.eta ? "still late — escalate" : "now in time for the drop"}`,
    ),
    `Alert to ${person(d.case.owner)} and Karim Balbaa.`,
  ];
  return {
    label: "Agent email: ETA update",
    call: { path: `${caseDeliveryPath}/eta` },
    confirm: {
      heading: "Agent email — ETA update",
      text: [
        `From ${email.from} · Subject: ${email.subject}`,
        email.body,
        "",
        `AI read · 97% · New ETA ${dayTime(email.eta)} (was ${dayTime(d.case.eta)})`,
        "",
        "What moves",
        ...moves,
      ].join("\n"),
      label: "Apply re-plan & alert",
    },
    reply: true,
  };
}
