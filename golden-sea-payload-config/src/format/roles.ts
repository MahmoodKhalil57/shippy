import type { KindData } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";
import * as link from "../links.ts";

/**
 * Roles & permissions, read for the widgets the globals' rows can't be: the live checks that the
 * matrix holds and where each permission is enforced, and the after-hours routing simulator with
 * who it alerts (a calculation over the roster at a picked time). The matrix and the roster are
 * `records` of the settings and on-call-roster globals. Pure: data in (GET /api/roles,
 * GET /api/on-call/route, ../endpoints/platform.ts), what a kind draws out.
 */

/** Simulator presets (Cairo time; the demo is set on Tue 17 Nov, 11:30). */
const PRESETS = [
  { label: "Tue 17 Nov 11:30 — office hours", at: "2026-11-17T09:30:00.000Z" },
  { label: "Tonight 21:40", at: "2026-11-17T19:40:00.000Z" },
  { label: "Fri 20 Nov 10:00 — weekend", at: "2026-11-20T08:00:00.000Z" },
  { label: "Sat 21 Nov 14:00 — weekend", at: "2026-11-21T12:00:00.000Z" },
  { label: "Sun 22 Nov 06:30 — before office", at: "2026-11-22T04:30:00.000Z" },
];

/**
 * The after-hours routing simulator: pick when an urgent RFQ arrives (`?at=`) and see which rule
 * applies and why. Who is alerted, in order, is `escalation`.
 */
export const routingSimulator = (r: Routing): KindData<"text"> => ({
  note: "Pick when an urgent RFQ arrives. The rule “After-hours & weekend RFQ” decides who is alerted; the alert is simulated and lands in that person's notifications.",
  choice: {
    param: "at",
    label: "When the urgent RFQ arrives",
    value: r.at,
    options: PRESETS.map((p) => ({ value: p.at, label: p.label })),
  },
  tags: [
    { label: r.atText },
    { label: r.inHours ? "Office hours" : "After hours", tone: r.inHours ? "info" : "warning" },
  ],
  text: r.routedTo ? r.reason : `${r.reason} Office hours — the case owner picks it up; no alert needed.`,
});

/** The live checks that each permission holds (Sales sees no costs…), passing or failing right now. */
export const permissionChecks = (d: RolesView): KindData<"list"> => ({
  items: d.checks.map((c) => ({
    headline: c.label,
    supporting: c.detail,
    tags: [{ label: c.pass ? "Verified" : "Failing", tone: c.pass ? "success" : "error" }],
  })),
});

/**
 * Who an urgent RFQ at the simulator's time (`routingSimulator`) alerts, in order: the on-duty
 * person now, the backup after the escalation delay, then the senior contacts; and the simulated
 * alert. Only after hours (in office hours the case owner picks it up).
 */
export const escalation = (r: Routing): KindData<"steps"> | null =>
  r.routedTo && {
    direction: "vertical",
    tone: "warning",
    current: 0,
    items: [
      { label: `Now: ${r.routedTo.name} (on duty)` },
      { label: `+${r.escalateAfterMinutes} min: ${r.backup?.name ?? "—"} (backup)` },
      { label: `Then: ${r.senior.map((p) => p.name).join(", ")} (senior)` },
    ],
    actions: [
      {
        label: "Send the alert (simulated)",
        call: { path: "/on-call/route", body: { at: r.at, simulate: true } },
        done: `Alert sent to ${r.routedTo.name} (WhatsApp / SMS simulated · notification created)`,
      },
    ],
  };

/** Where each permission is enforced in the system, and a way to see it: sign in as Sales. */
export const whereEnforced = (d: RolesView): KindData<"details"> => ({
  alerts: [
    {
      tone: "info",
      text: "Try it: switch the signed-in user to Soaad Amer (Sales) and open the pricing tab of GS-RFQ-0142 — costs and margins are gone.",
      actions: [{ label: "Open GS-RFQ-0142 pricing", href: link.doc("cases", "gs-rfq-0142", "pricing") }],
    },
  ],
  layout: "inline",
  items: d.permissions.map((p) => ({ label: p.label, value: p.enforced })),
});
