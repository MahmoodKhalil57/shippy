import { details, list, steps, text, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/roles.ts";
import * as link from "../links.ts";
import { roles, routing } from "../queries/roles.ts";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import { m } from "../i18n/paraglide/messages.js";

function simulatorStart(): string {
  if (IS_TEMP_MOCK) {
    return "2026-11-17T19:40:00.000Z";
  } else {
    throw new TempMockError("the routing simulator's start: this evening after hours, not 17 Nov 2026 21:40 Cairo");
  }
}

export const rolesPage = widgets({
  params: { at: simulatorStart() },
  header: {
    eyebrow: m.page_roles_eyebrow(),
    heading: m.page_roles_heading(),
    subtitle: m.page_roles_subtitle(),
    actions: [
      { label: m.page_roles_people(), href: link.list("users") },
      { label: m.page_roles_approval_rules(), href: link.global("approval-rules") },
    ],
  },
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
