import type { KindData } from "saastemlycrm-design-system/contracts";
import type { RolesView, Routing } from "../endpoints/platform.ts";
import { m } from "../i18n/paraglide/messages.js";
import { getLocale } from "../i18n/paraglide/runtime.js";
import { IS_MOCK, IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import * as link from "../links.ts";

function presets() {
  if (IS_TEMP_MOCK) {
    return [
      { label: m.roles_preset_office, at: "2026-11-17T09:30:00.000Z" },
      { label: m.roles_preset_tonight, at: "2026-11-17T19:40:00.000Z" },
      { label: m.roles_preset_friday, at: "2026-11-20T08:00:00.000Z" },
      { label: m.roles_preset_saturday, at: "2026-11-21T12:00:00.000Z" },
      { label: m.roles_preset_sunday, at: "2026-11-22T04:30:00.000Z" },
    ];
  } else {
    throw new TempMockError(
      "the routing simulator's presets (office hours, tonight, Friday, Saturday, Sunday) counted from today, not fixed dates in Nov 2026",
    );
  }
}

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

export const permissionChecks = (d: RolesView): KindData<"list"> => ({
  items: d.checks.map((c) => ({
    headline: c.label,
    supporting: c.detail,
    tags: [{ label: c.pass ? m.roles_verified() : m.roles_failing(), tone: c.pass ? "success" : "error" }],
  })),
});

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

function simulatedAlert(r: Routing) {
  if (IS_MOCK) {
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
    return [];
  }
}

function tryItCase(): string {
  if (IS_TEMP_MOCK) {
    return link.doc("cases", "gs-rfq-0142", "pricing");
  } else {
    throw new TempMockError(
      'the case the "try it as Sales" hint opens: a live case from the data, not the demo\'s gs-rfq-0142',
    );
  }
}

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
