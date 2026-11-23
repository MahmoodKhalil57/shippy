import type { KindData, Tone, WidgetScope } from "saastemlycrm-design-system/contracts";
import type { IntegrationsView } from "../endpoints/platform.ts";
import * as link from "../links.ts";
import { formatDate } from "./index.ts";

/**
 * What the integrations page shows beyond the integrations global's rows (its mailboxes and
 * channels are `records`, their meaning on the global's fields): the email-history import's dry run
 * and the backups (the global's groups, which no data widget reads), the branded acknowledgement
 * and the languages (GET /api/integrations/status, ../endpoints/platform.ts). Pure: data in, what a
 * kind draws out.
 */

/** The integrations global as stored: its email-history import, the Odoo migration and its backups. */
export interface IntegrationsGlobal {
  emailImport?: Record<string, unknown>;
  migration?: MigrationPart[];
  backups?: Record<string, unknown>;
}

/** One part of Odoo's data on its way into the platform. */
export interface MigrationPart {
  part?: string;
  inOdoo?: number;
  moved?: number;
  checked?: number;
  status?: string;
}

const count = new Intl.NumberFormat("en-GB");
const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0);

/**
 * Moving off Odoo, as a whole: how many of its records are in the platform and how many a person
 * has checked against Odoo, then the parts done. Odoo is switched off only once every part is.
 */
export const migration = ({ migration: parts = [] }: IntegrationsGlobal): KindData<"gauges"> => {
  const sum = (k: "inOdoo" | "moved" | "checked") => parts.reduce((t, p) => t + (Number(p[k]) || 0), 0);
  const all = sum("inOdoo");
  const done = parts.filter((p) => p.status === "Done").length;
  const ready = parts.length > 0 && done === parts.length;
  return {
    items: [
      {
        label: "Moved into the platform",
        value: sum("moved"),
        max: all || 1,
        valueText: `${pct(sum("moved"), all)}%`,
        note: `${count.format(sum("moved"))} of ${count.format(all)} records`,
      },
      {
        label: "Checked against Odoo",
        value: sum("checked"),
        max: all || 1,
        valueText: `${pct(sum("checked"), all)}%`,
        note: `${count.format(sum("checked"))} records checked by a person`,
      },
      {
        label: "Parts done",
        value: done,
        max: parts.length || 1,
        tone: ready ? "success" : undefined,
        valueText: `${done} of ${parts.length}`,
        note: ready ? "Ready to switch Odoo off" : "Odoo stays on until every part is done",
      },
    ],
    note: "Odoo keeps running beside the platform while its data moves. Nothing in Odoo is changed or deleted.",
  };
};

/** A stored value as text (the groups hold them loosely). */
export const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

/** A count of records, as the import cards show it. */
export const figure = (v: unknown) => Number(v ?? 0).toLocaleString("en-US");

/** The languages the platform runs in. */
export const LANG = [
  { label: "English", value: "en" },
  { label: "العربية (Arabic)", value: "ar" },
];

/**
 * The branded acknowledgement a new RFQ gets, as management approved it, previewed in English or
 * Arabic: `?lang=` picks the language (no new request: both come with the data).
 */
export const acknowledgement = ({ ack: a }: IntegrationsView, { params }: WidgetScope): KindData<"message"> => {
  const lang = params.lang === "ar" ? "ar" : "en";
  const t = a[lang];
  return {
    choice: {
      param: "lang",
      label: "Preview language",
      value: lang,
      options: [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
      ],
    },
    tags: [
      { label: `${a.status} v${a.version} · ${a.approvedBy}`, tone: "success" },
      { label: "Sent once per thread" },
      { label: "Never to internal senders" },
    ],
    meta: [`From: Golden Sea <${a.from}>`, `To: ${a.to}`],
    subject: t.subject,
    body: t.body,
    dir: lang === "ar" ? "rtl" : "ltr",
    lang,
    note: "Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new approval.",
    actions: [{ label: "All message templates", href: link.global("message-templates") }],
  };
};

const importItem = (label: string, v: unknown, note: string, tone?: Tone) => ({
  label,
  value: tone ? { text: figure(v), tone, strong: true } : { text: figure(v), strong: true },
  note,
});

/**
 * The email-history import's dry run: what it scanned and found (RFQ threads, duplicates,
 * exceptions, confidential mail), over the window in its subhead. Nothing is imported before approval.
 */
export const emailImport = ({ emailImport: i = {} }: IntegrationsGlobal): KindData<"details"> => ({
  head: { subhead: `${str(i.days)} days`, tags: [{ label: str(i.status), tone: "info" }] },
  items: [
    importItem("Emails scanned", i.scanned, "sales@, purchasing@, Gmail"),
    importItem("RFQ threads", i.rfqThreads, "become historical cases"),
    importItem("Likely duplicates", i.duplicates, "linked, not re-created"),
    importItem("Exceptions", i.exceptions, "unreadable attachments", "warning"),
    importItem("Flagged confidential", i.confidential, "excluded unless approved", "error"),
  ],
  note: "Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for historical mail.",
  actions: [{ label: "Open inbox history", href: "/inbox-history" }],
});

/**
 * The platform's languages: the company default and the languages customer documents go out in
 * (management changes them), then the signed-in person's own language.
 */
export const languages = (d: IntegrationsView): KindData<"settings"> => {
  const call = (body: Record<string, unknown>) => ({ path: "/integrations/language", body });
  return {
    note: [
      "The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the customer's language.",
      ...(d.canSettings ? [] : ["Company settings are changed by management."]),
    ].join("\n"),
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
      { label: "Your language", value: d.myLanguage, options: LANG, call: call({ field: "mine" }) },
    ],
  };
};

/**
 * Backups, the staging copy and data export: the schedule, the copies kept, the last backup and
 * restore test. Only management refreshes the staging copy.
 */
export const backups = ({ backups: b = {} }: IntegrationsGlobal, { user }: WidgetScope): KindData<"details"> => {
  const management = user.role === "management";
  const when = (v: unknown) => (v ? formatDate(str(v)) : "—");
  return {
    layout: "inline",
    items: [
      { label: "Schedule", value: str(b.schedule) },
      { label: "Copies", value: `${str(b.locations)} locations · kept ${str(b.retentionDays)} days` },
      { label: "Last backup", value: when(b.lastBackupAt) },
      { label: "Restore last tested", value: when(b.restoreTestedAt) },
      { label: "Staging copy", value: when(b.stagingRefreshedAt) },
    ],
    note: "The staging copy is where changes are tried before they reach your team; email sending and integrations are switched off there. Your data is always yours: export everything at any time.",
    actions: [
      {
        label: "Refresh staging copy",
        call: { path: "/integrations/staging" },
        disabled: !management,
        reason: management ? undefined : "Only management refreshes staging.",
        done: "Staging copy refreshed from last night's backup",
      },
    ],
  };
};
