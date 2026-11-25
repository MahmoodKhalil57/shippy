import { details, gauges, message, settings, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/integrations.ts";
import * as link from "../links.ts";
import { integrations, integrationsGlobal } from "../queries/integrations.ts";
import { m } from "../i18n/paraglide/messages.js";

export const integrationsPage = widgets({
  params: { lang: "en" },
  header: {
    eyebrow: m.page_integrations_eyebrow(),
    heading: m.page_integrations_heading(),
    subtitle: m.page_integrations_subtitle(),
    actions: [
      { label: m.page_integrations_exception_queue(), href: "/automations" },
      { label: m.page_integrations_edit(), href: link.global("integrations") },
    ],
  },
  widgets: [
    {
      title: m.page_integrations_mailboxes(),
      subhead: m.page_integrations_mailboxes_subhead(),
      size: "l",
      records: {
        global: "integrations",
        field: "mailboxes",
        columns: ["account", "status", "lastSyncAt", "received", "tokenExpiresAt"],
        supporting: { account: "kind", status: "notes", lastSyncAt: "poll", tokenExpiresAt: "expiresInDays" },
        labels: {
          account: m.page_integrations_mailbox(),
          received: m.page_integrations_imported(),
          tokenExpiresAt: m.page_integrations_token(),
        },
      },
    },
    details({
      title: m.page_integrations_history(),
      subhead: m.page_integrations_history_subhead(),
      size: "s",
      skeleton: "card",
      data: integrationsGlobal,
      format: fmt.emailImport,
    }),
    {
      title: m.page_integrations_channels(),
      subhead: m.page_integrations_channels_subhead(),
      size: "l",
      rows: 14,
      records: {
        global: "integrations",
        field: "channels",
        layout: "entries",
        columns: ["title", "status", "account", "lastSyncAt"],
        text: "about",
        facts: ["received", "tokenExpiresAt", "modules"],
        notes: "notes",
      },
    },
    details({
      title: m.page_integrations_backups(),
      size: "s",
      skeleton: "text",
      data: integrationsGlobal,
      format: fmt.backups,
    }),
    {
      title: m.page_integrations_odoo_title(),
      subhead: m.page_integrations_odoo_subhead(),
      size: "l",
      records: {
        global: "integrations",
        field: "migration",
        columns: ["part", "inOdoo", "moved", "checked", "status"],
        supporting: { part: "odooModel", status: "note" },
      },
    },
    gauges({
      title: m.page_integrations_migration(),
      size: "s",
      rows: 4,
      data: integrationsGlobal,
      format: fmt.migration,
    }),
    message({
      title: m.page_integrations_ack(),
      size: "l",
      skeleton: "text",
      data: integrations,
      format: fmt.acknowledgement,
    }),
    settings({
      title: m.page_integrations_language(),
      size: "l",
      skeleton: "text",
      data: integrations,
      format: fmt.languages,
    }),
  ],
});
