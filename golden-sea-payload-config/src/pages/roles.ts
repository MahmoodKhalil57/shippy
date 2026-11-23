import { details, list, steps, text, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/roles.ts";
import * as link from "../links.ts";
import { roles, routing } from "../queries/roles.ts";
import { m } from "../i18n/paraglide/messages.js";

/**
 * Roles & permissions (/roles): the permissions matrix per role and its people (the settings
 * global's rows: each permission green where granted, management edits a role), where each
 * permission is enforced with live checks, the after-hours routing simulator (`?at=`: urgent RFQs
 * outside Sun–Thu 08:00–17:00 go to the on-duty person) and the on-call roster (the
 * `on-call-roster` global's rows: management and the office manager edit a shift). The matrix and
 * the roster are `records`, their meaning and actions on the globals' fields
 * (../globals/index.ts). Data for the rest: GET /api/roles (the live checks) and
 * GET /api/on-call/route?at=; actions: POST /api/roles/permission, /api/roles/roster,
 * /api/on-call/route (../endpoints/platform.ts). Formatters: ../format/roles.ts.
 */
export const rolesPage = widgets({
  // The simulator opens after hours (tonight 21:40 Cairo), so "Who is alerted" shows the chain;
  // its presets include office hours, when no one is.
  params: { at: "2026-11-17T19:40:00.000Z" },
  header: {
    eyebrow: m.page_roles_eyebrow(),
    heading: m.page_roles_heading(),
    subtitle: m.page_roles_subtitle(),
    actions: [
      { label: m.page_roles_people(), href: link.list("users") },
      { label: m.page_roles_approval_rules(), href: link.global("approval-rules") },
    ],
  },
  // The matrix across, the routing simulator with how it's enforced beside it (who is alerted
  // after hours under it), then the roster.
  widgets: [
    {
      title: m.page_roles_matrix(),
      subhead: m.page_roles_matrix_subhead(),
      size: "l",
      records: {
        global: "settings",
        field: "permissions",
        columns: [
          "role",
          "people",
          "clientInfo",
          "supplierCosts",
          "margins",
          "approveQuotes",
          "approvePOs",
          "approvePayments",
          "sendExternal",
          "accounting",
        ],
        supporting: { role: "note" },
        labels: { role: m.page_roles_role() },
      },
    },
    text({
      title: m.page_roles_routing(),
      size: "m",
      skeleton: "text",
      data: routing,
      format: fmt.routingSimulator,
    }),
    list({
      title: m.page_roles_enforced(),
      size: "s",
      skeleton: "list",
      data: roles,
      format: fmt.permissionChecks,
    }),
    steps({
      title: m.page_roles_alerted(),
      size: "m",
      skeleton: "text",
      data: routing,
      // In office hours nobody is alerted: the tile keeps its place and says so.
      empty: {
        when: (r) => !r.routedTo,
        heading: m.page_roles_no_alert(),
        description: m.page_roles_no_alert_description(),
      },
      format: fmt.escalation,
    }),
    details({
      title: m.page_roles_where(),
      size: "s",
      skeleton: "card",
      data: roles,
      format: fmt.whereEnforced,
    }),
    {
      title: m.page_roles_roster(),
      subhead: m.page_roles_roster_subhead(),
      size: "l",
      records: {
        global: "on-call-roster",
        field: "shifts",
        columns: ["shift", "user", "backup"],
      },
    },
  ],
});
