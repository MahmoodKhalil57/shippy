import { block, note, type Action, type Cell, type Tone, type ViewBlock } from "saastemlycrm-design-system/contracts";
import { from, widgets, type Source, type Widget } from "saastemlycrm-design-system/contracts";
import type { IntegrationsView } from "../endpoints/platform.ts";
import { formatDate } from "./format.ts";
import * as link from "../links.ts";

/**
 * Integrations & data (/integrations): the connected channels — Outlook and Gmail mailboxes
 * (status, last sync, emails imported, token expiry → reconnect), the branded acknowledgement
 * (English / Arabic preview of the approved template, `?lang=`), website quick-quote form,
 * WhatsApp, Egyptian e-invoicing, Odoo; the email-history import; daily backups, the staging copy
 * and a full data export; the language settings. Data: GET /api/integrations/status; actions:
 * POST /api/integrations/reconnect, /staging, /language (../endpoints/platform.ts).
 */

type Connection = IntegrationsView["connections"][number];

const data: Source = { endpoint: "/integrations/status" };
const on = from<IntegrationsView>(data);

const s = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const STATUS: Record<string, Tone> = {
  Connected: "success",
  "Token expired": "error",
  "To connect": "warning",
  Sandbox: "info",
  Staging: "info",
  Manual: "neutral",
  Disabled: "neutral",
};
const LANG = [
  { label: "English", value: "en" },
  { label: "العربية (Arabic)", value: "ar" },
];
const status = (c?: Connection) => (c ? [{ label: s(c.status), tone: STATUS[s(c.status)] ?? "neutral" }] : undefined);
const by = (d: IntegrationsView, kind: string) => d.connections.find((c) => c.kind === kind);

/** When a token or certificate expires, and how soon (the endpoint counts the days). */
function expiry(c?: Connection): Cell {
  const v = c?.tokenExpiresAt;
  const days = c?.expiresInDays;
  if (!v || days == null) return null;
  return {
    text: `${formatDate(s(v))}${days < 0 ? " · expired" : days < 30 ? ` · in ${days} d` : ""}`,
    tone: days < 0 ? "error" : days < 30 ? "warning" : "neutral",
  };
}

const mailboxRows = (d: IntegrationsView) => d.connections.filter((c) => /mailbox/.test(s(c.kind)));

const mailboxes = on({
  title: "Mailboxes",
  skeleton: "table",
  head: (d) => ({ count: mailboxRows(d).length }),
  render: (d) => {
    const reconnect = (c: Connection): Action => ({
      label: "Reconnect",
      main: true,
      disabled: !d.canManage,
      call: { path: "/integrations/reconnect", body: { index: c.index } },
      confirm: {
        heading: `Reconnect ${s(c.account)}`,
        text: `You'll sign in with the mailbox's ${/Gmail/.test(s(c.kind)) ? "Google" : "Microsoft 365"} account (simulated in the demo). After sign-in, the emails that waited are imported once each — the idempotency check makes sure none is imported, acknowledged or turned into a case twice.`,
        label: "Sign in & reconnect",
      },
      reply: true,
    });
    return [
      note(
        "Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops mail: it waits in the exception queue and imports once on reconnect.",
      ),
      block("table", {
        columns: [
          { key: "account", label: "Mailbox", supporting: "kind" },
          { key: "status", label: "Status" },
          { key: "sync", label: "Last sync", supporting: "poll" },
          { key: "imported", label: "Emails imported" },
          { key: "expires", label: "Token expires" },
          { key: "action", label: "" },
        ],
        rows: mailboxRows(d).map((c) => ({
          account: { text: s(c.account), strong: true },
          kind: s(c.kind),
          status: { text: s(c.status), tone: STATUS[s(c.status)] ?? "neutral", tag: true },
          sync: c.lastSyncAt ? formatDate(s(c.lastSyncAt)) : null,
          poll: c.pollEveryMinutes ? `every ${s(c.pollEveryMinutes)} min` : "",
          imported: { text: ((Number(c.emailsImported) || 0) + c.live).toLocaleString("en-US"), strong: true },
          expires: expiry(c),
          action:
            c.status === "Token expired" || c.status === "To connect"
              ? { text: "", actions: [reconnect(c)] }
              : { text: s(c.notes), tone: "neutral" },
        })),
      }),
      ...(d.canManage ? [] : [note("Management, operations or the office manager reconnect mailboxes.")]),
    ];
  },
});

/** The acknowledgement preview; `?lang=` picks the language (no new request: both come with the data). */
const ack = on({
  title: "Branded acknowledgement",
  skeleton: "text",
  render: ({ ack: a }, { params }) => {
    const lang = params.lang === "ar" ? "ar" : "en";
    const t = a[lang];
    return [
      block("choice", {
        param: "lang",
        label: "Preview language",
        value: lang,
        options: [
          { value: "en", label: "English" },
          { value: "ar", label: "العربية" },
        ],
      }),
      block("tags", {
        items: [
          { label: `${a.status} v${a.version} · ${a.approvedBy}`, tone: "success" },
          { label: "Sent once per thread" },
          { label: "Never to internal senders" },
        ],
      }),
      block("message", {
        meta: [`From: Golden Sea <${a.from}>`, `To: ${a.to}`],
        subject: t.subject,
        body: t.body,
        dir: lang === "ar" ? "rtl" : "ltr",
        lang,
      }),
      note(
        "Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new approval.",
      ),
      block("actions", {
        items: [{ label: "All message templates", href: link.global("message-templates") }],
      }),
    ];
  },
});

const odoo = on({
  title: "Odoo",
  skeleton: "text",
  head: (d) => ({ tags: status(by(d, "Odoo")) }),
  render: (d) => {
    const o = by(d, "Odoo");
    const modules = s(o?.modules)
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    return [
      block("heading", { text: "Odoo for the books, SaaSTEMLY for the way you work." }),
      block("text", {
        text: "Standard, supported Odoo holds contacts, sales and purchase orders, stock, invoices and accounting. The sourcing desk on top — inbox, comparison, approvals, automations — writes into it, so any Odoo partner can read your books.",
        muted: true,
      }),
      block("tags", { items: modules.map((label) => ({ label, tone: "primary" })) }),
      note(`${s(o?.account)}${o?.lastSyncAt ? ` · last sync ${formatDate(s(o.lastSyncAt))}` : ""}`),
    ];
  },
});

/** One connected channel as a card: its status in the header, its account and notes. */
const channel = (
  kind: string,
  title: string,
  text: string,
  extra: (c: Connection | undefined) => ViewBlock[] = () => [],
): Widget<IntegrationsView> =>
  on({
    title,
    skeleton: "text",
    head: (d) => ({ tags: status(by(d, kind)) }),
    render: (d) => {
      const c = by(d, kind);
      return [
        ...(c?.account ? [block("heading", { text: s(c.account) })] : []),
        note(text),
        ...(c?.notes ? [block("text", { text: s(c.notes) })] : []),
        ...extra(c),
      ];
    },
  });

const channels: Widget = {
  grid: [
    channel(
      "Website form",
      "Website quick-quote form",
      "“Request a quick quote” creates a draft case and contact; AI reads the items.",
      (web) => (web ? [note(`${(Number(web.emailsImported) || 0) + web.live} requests received`)] : []),
    ),
    channel(
      "WhatsApp",
      "WhatsApp",
      "Captains and agents message on WhatsApp: each message is logged on its case with a screenshot and who logged it.",
    ),
    channel(
      "E-invoicing (tax authority)",
      "Egyptian e-invoicing (ETA)",
      "Invoices are signed and submitted to the tax authority; the UUID and status are stored on the invoice.",
      (eta) => {
        const cert = expiry(eta);
        return [
          ...(cert && typeof cert === "object"
            ? [block("details", { items: [{ label: "Signing certificate", value: cert }] })]
            : []),
          block("actions", {
            items: [{ label: "Exception queue", href: "/automations" }],
          }),
        ];
      },
    ),
    channel("AI extraction", "AI extraction", "Reads PDF, Excel, Word and photos into draft lines. Drafts only."),
    channel("Document storage", "Documents", "Every file on its case, searchable."),
  ],
};

const n = (v: unknown) => Number(v ?? 0).toLocaleString("en-US");
const item = (label: string, v: unknown, note: string, tone?: Tone) => ({
  label,
  value: tone ? { text: n(v), tone, strong: true } : { text: n(v), strong: true },
  note,
});

/** Its heading carries the import's window, so it draws its own card. */
const emailImport = on({
  skeleton: "card",
  render: ({ emailImport: i }) =>
    block("card", {
      heading: `Email history import — ${s(i.days)} days`,
      tags: [{ label: s(i.status), tone: "info" }],
      blocks: [
        block("details", {
          items: [
            item("Emails scanned", i.scanned, "sales@, purchasing@, Gmail"),
            item("RFQ threads", i.rfqThreads, "become historical cases"),
            item("Likely duplicates", i.duplicates, "linked, not re-created"),
            item("Exceptions", i.exceptions, "unreadable attachments", "warning"),
            item("Flagged confidential", i.confidential, "excluded unless approved", "error"),
          ],
        }),
        note(
          "Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for historical mail.",
        ),
        block("actions", { items: [{ label: "Open inbox history", href: "/inbox-history" }] }),
      ],
    }),
});

const backups = on({
  title: "Backups, staging & export",
  skeleton: "text",
  render: ({ backups: b }, { user }) => {
    const management = user.role === "management";
    const when = (v: unknown) => (v ? formatDate(s(v)) : "—");
    return [
      block("details", {
        layout: "inline",
        items: [
          { label: "Schedule", value: s(b.schedule) },
          { label: "Copies", value: `${s(b.locations)} locations · kept ${s(b.retentionDays)} days` },
          { label: "Last backup", value: when(b.lastBackupAt) },
          { label: "Restore last tested", value: when(b.restoreTestedAt) },
          { label: "Staging copy", value: when(b.stagingRefreshedAt) },
        ],
      }),
      note(
        "The staging copy is where changes are tried before they reach your team; email sending and integrations are switched off there. Your data is always yours: export everything at any time.",
      ),
      block("actions", {
        items: [
          {
            label: "Refresh staging copy",
            call: { path: "/integrations/staging" },
            disabled: !management,
            reason: management ? undefined : "Only management refreshes staging.",
            done: "Staging copy refreshed from last night's backup",
          },
        ],
      }),
    ];
  },
});

const language = on({
  title: "Language — English / العربية",
  skeleton: "text",
  render: (d) => {
    const call = (body: Record<string, unknown>) => ({ path: "/integrations/language", body });
    return [
      note(
        "The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the customer's language.",
      ),
      block("settings", {
        items: [
          {
            label: "Company default",
            value: d.language.default,
            options: LANG,
            disabled: !d.canSettings,
            call: call({ field: "default" }),
          },
          ...LANG.map((l) => ({
            label: `Customer documents in ${l.label}`,
            value: d.language.documents.includes(l.value),
            disabled: !d.canSettings,
            call: call({ field: "documents", lang: l.value }),
          })),
        ],
      }),
      ...(d.canSettings ? [] : [note("Company settings are changed by management.")]),
      block("settings", {
        items: [{ label: "Your language", value: d.myLanguage, options: LANG, call: call({ field: "mine" }) }],
      }),
    ];
  },
});

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
  widgets: [mailboxes, { grid: [ack, odoo] }, channels, { grid: [emailImport, backups, language] }],
});
