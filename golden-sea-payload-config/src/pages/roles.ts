import { details, list, steps, text, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/roles.ts";
import * as link from "../links.ts";
import { roles, routing } from "../queries/roles.ts";

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
  header: {
    eyebrow: "Team · access",
    heading: "Roles & permissions",
    subtitle:
      "Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs after hours go to whoever is on call.",
    actions: [
      { label: "People", href: link.list("users") },
      { label: "Approval rules", href: link.global("approval-rules") },
    ],
  },
  // The matrix across, the routing simulator with how it's enforced beside it (who is alerted
  // after hours under it), then the roster.
  widgets: [
    {
      title: "Permissions matrix",
      subhead:
        "Who can see and approve what, per role and person. Named users and licences are confirmed in Phase 0. Management edits a role: it applies to everyone in it and is logged on the audit trail.",
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
        labels: { role: "Role" },
      },
    },
    text({
      title: "After-hours routing — try it",
      size: "m",
      skeleton: "text",
      data: routing,
      format: fmt.routingSimulator,
    }),
    list({
      title: "Enforced, not just written down",
      size: "s",
      skeleton: "list",
      data: roles,
      format: fmt.permissionChecks,
    }),
    steps({
      title: "Who is alerted",
      size: "m",
      skeleton: "text",
      data: routing,
      hidden: (r) => !r.routedTo,
      format: fmt.escalation,
    }),
    details({
      title: "Where each permission is enforced",
      size: "s",
      skeleton: "card",
      data: roles,
      format: fmt.whereEnforced,
    }),
    {
      title: "On-call roster",
      subhead:
        "Office hours Sun–Thu 08:00–17:00 Cairo. Outside them, urgent RFQs (or a vessel ETA under 24 h) alert the on-duty person by WhatsApp / SMS, then the backup, then the senior contacts. Management and the office manager edit a shift.",
      size: "l",
      records: {
        global: "on-call-roster",
        field: "shifts",
        columns: ["shift", "user", "backup"],
      },
    },
  ],
});
