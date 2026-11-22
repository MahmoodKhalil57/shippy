import { details, message, settings, widgets } from "saastemlycrm-design-system/contracts";
import * as fmt from "../format/integrations.ts";
import * as link from "../links.ts";
import { integrations, integrationsGlobal } from "../queries/integrations.ts";

/**
 * Integrations & data (/integrations): the connected mailboxes (status, last sync, messages
 * received, token expiry → Reconnect) and channels (the website's quick-quote form, WhatsApp,
 * Egyptian e-invoicing, AI extraction, documents, Odoo) are the integrations global's rows, read
 * with no code: what each value means and what people can do to a row are on the global's fields
 * (../globals/index.ts). Then the email-history import's dry run and the backups (the global's
 * groups), the branded acknowledgement (English / Arabic preview of the approved template,
 * `?lang=`) and the language settings: GET /api/integrations/status and the actions
 * POST /api/integrations/reconnect, /staging, /language (../endpoints/platform.ts), with their
 * formatters (../format/integrations.ts).
 */
export const integrationsPage = widgets({
  params: { lang: "en" },
  header: {
    eyebrow: "Configuration · integrations",
    heading: "Integrations & data",
    subtitle:
      "Your mailboxes, website, WhatsApp, the tax authority and Odoo, connected — with daily backups, a staging copy and your data exportable at any time.",
    actions: [
      { label: "Exception queue", href: "/automations" },
      { label: "Edit connections", href: link.global("integrations") },
    ],
  },
  // Each wide tile with a small one beside it.
  widgets: [
    {
      title: "Mailboxes",
      subhead:
        "Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops mail: it waits in the exception queue and imports once on reconnect.",
      size: "l",
      records: {
        global: "integrations",
        field: "mailboxes",
        columns: ["account", "status", "lastSyncAt", "received", "tokenExpiresAt"],
        supporting: { account: "kind", status: "notes", lastSyncAt: "poll", tokenExpiresAt: "expiresInDays" },
        labels: { account: "Mailbox", received: "Emails imported", tokenExpiresAt: "Token expires" },
      },
    },
    details({
      title: "Email history import",
      size: "s",
      skeleton: "card",
      data: integrationsGlobal,
      format: fmt.emailImport,
    }),
    {
      title: "Channels",
      subhead: "The website, WhatsApp, the tax authority, AI extraction, documents and Odoo underneath.",
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
      title: "Backups, staging & export",
      size: "s",
      skeleton: "text",
      data: integrationsGlobal,
      format: fmt.backups,
    }),
    message({
      title: "Branded acknowledgement",
      size: "l",
      skeleton: "text",
      data: integrations,
      format: fmt.acknowledgement,
    }),
    settings({
      title: "Language — English / العربية",
      size: "l",
      skeleton: "text",
      data: integrations,
      format: fmt.languages,
    }),
  ],
});
