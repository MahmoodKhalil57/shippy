import type { KindData } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";
import { getLocale } from "../i18n/paraglide/runtime.js";
import { IS_MOCK, IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import * as link from "../links.ts";

/**
 * Roles & permissions, read for the widgets the globals' rows can't be: the live checks that the
 * matrix holds and where each permission is enforced, and the after-hours routing simulator with
 * who it alerts (a calculation over the roster at a picked time). The matrix and the roster are
 * `records` of the settings and on-call-roster globals. Pure: data in (GET /api/roles,
 * GET /api/on-call/route, ../endpoints/platform.ts), what a kind draws out.
 */

/** Simulator presets (Cairo time), their words read when drawn. */
function presets() {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    // Fixed times around the demo's day (Tue 17 Nov, 11:30).
    return [
      { label: m.roles_preset_office, at: "2026-11-17T09:30:00.000Z" },
      { label: m.roles_preset_tonight, at: "2026-11-17T19:40:00.000Z" },
      { label: m.roles_preset_friday, at: "2026-11-20T08:00:00.000Z" },
      { label: m.roles_preset_saturday, at: "2026-11-21T12:00:00.000Z" },
      { label: m.roles_preset_sunday, at: "2026-11-22T04:30:00.000Z" },
    ];
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the routing simulator's presets (office hours, tonight, Friday, Saturday, Sunday) counted from today, not fixed dates in Nov 2026",
    );
  }
}

/**
 * The after-hours routing simulator: pick when an urgent RFQ arrives (`?at=`) and see which rule
 * applies and why. Who is alerted, in order, is `escalation`.
 */
export const routingSimulator = (r: Routing): KindData<"text"> => ({
  note: m.roles_simulator_note(),
  choice: {
    param: "at",
    label: m.roles_simulator_choice(),
    value: r.at,
    options: presets().map((p) => ({ value: p.at, label: p.label() })),
  },
  tags: [
    { label: r.atText },
    { label: r.inHours ? m.roles_office_hours() : m.roles_after_hours(), tone: r.inHours ? "info" : "warning" },
  ],
  text: r.routedTo ? r.reason : m.roles_in_hours_text({ reason: r.reason }),
});

/** The live checks that each permission holds (Sales sees no costs…), passing or failing right now. */
export const permissionChecks = (d: RolesView): KindData<"list"> => ({
  items: d.checks.map((c) => ({
    headline: c.label,
    supporting: c.detail,
    tags: [{ label: c.pass ? m.roles_verified() : m.roles_failing(), tone: c.pass ? "success" : "error" }],
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
      { label: m.roles_step_now({ name: r.routedTo.name }) },
      { label: m.roles_step_backup({ minutes: r.escalateAfterMinutes, name: r.backup?.name ?? "—" }) },
      { label: m.roles_step_senior({ names: r.senior.map((p) => p.name).join(getLocale() === "ar" ? "، " : ", ") }) },
    ],
    actions: simulatedAlert(r),
  };

/** "Send the alert": an urgent RFQ arriving at the simulator's time, simulated. */
function simulatedAlert(r: Routing) {
  if (IS_MOCK) {
    // TODO implement mock only logic to simulate third party connections
    return r.routedTo
      ? [
          {
            label: m.roles_send_alert(),
            call: { path: "/on-call/route", body: { at: r.at, simulate: true } },
            done: m.roles_alert_sent({ name: r.routedTo.name }),
          },
        ]
      : [];
  } else {
    // TODO implement actual prod third party connections
    // Real RFQs arrive from the mailbox and alert on their own: nothing to send from here.
    return [];
  }
}

/** The case "sign in as Sales and look" opens. */
function tryItCase(): string {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return link.doc("cases", "gs-rfq-0142", "pricing");
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      'the case the "try it as Sales" hint opens: a live case from the data, not the demo\'s gs-rfq-0142',
    );
  }
}

/** Where each permission is enforced in the system, and a way to see it: sign in as Sales. */
export const whereEnforced = (d: RolesView): KindData<"details"> => ({
  alerts: [
    {
      tone: "info",
      text: m.roles_try_it(),
      actions: [{ label: m.roles_open_pricing(), href: tryItCase() }],
    },
  ],
  layout: "inline",
  items: d.permissions.map((p) => ({ label: p.label, value: p.enforced })),
});
