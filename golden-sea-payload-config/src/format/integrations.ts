import { formatNumber, type KindData, type Tone, type WidgetScope } from "saastemlycrm-design-system/contracts";
import type { IntegrationsView } from "../endpoints/platform.ts";
import { IS_TEMP_MOCK, TempMockError } from "../flags.ts";
import { m } from "../i18n/paraglide/messages.js";
import * as link from "../links.ts";
import { count, formatDate } from "./index.ts";

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

/** A part of a whole as a whole percentage ("45%"). */
const pct = (n: number, of: number) => formatNumber(of ? Math.round((n / of) * 100) : 0, { unit: "pct", decimals: 0 });

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
        label: m.integrations_moved_label(),
        value: sum("moved"),
        max: all || 1,
        valueText: pct(sum("moved"), all),
        note: m.integrations_moved_note({ n: all, moved: count(sum("moved")), all: count(all) }),
      },
      {
        label: m.integrations_checked_label(),
        value: sum("checked"),
        max: all || 1,
        valueText: pct(sum("checked"), all),
        note: m.integrations_checked_note({ n: sum("checked"), checked: count(sum("checked")) }),
      },
      {
        label: m.integrations_parts_label(),
        value: done,
        max: parts.length || 1,
        tone: ready ? "success" : undefined,
        valueText: m.integrations_parts_value({ done: count(done), total: count(parts.length) }),
        note: ready ? m.integrations_ready() : m.integrations_stays_on(),
      },
    ],
    note: m.integrations_migration_note(),
  };
};

/** A stored value as text (the groups hold them loosely). */
export const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

/** A count of records, as the import cards show it. */
export const figure = (v: unknown) => count(Number(v ?? 0));

/** The languages the platform runs in, each named in its own language. */
export const languageOptions = () => [
  { label: "English", value: "en" },
  { label: m.integrations_lang_ar(), value: "ar" },
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
      label: m.integrations_preview_language(),
      value: lang,
      // Each language is named in its own language.
      options: [
        { value: "en", label: "English" },
        { value: "ar", label: "العربية" },
      ],
    },
    tags: [
      {
        label: m.integrations_ack_status({ status: a.status, version: a.version, approvedBy: a.approvedBy }),
        tone: "success",
      },
      { label: m.integrations_once_per_thread() },
      { label: m.integrations_never_internal() },
    ],
    meta: [m.integrations_ack_from({ from: a.from }), m.integrations_ack_to({ to: a.to })],
    subject: t.subject,
    body: t.body,
    dir: lang === "ar" ? "rtl" : "ltr",
    lang,
    note: m.integrations_ack_note(),
    actions: [{ label: m.integrations_all_templates(), href: link.global("message-templates") }],
  };
};

const importItem = (label: string, v: unknown, note: string, tone?: Tone) => ({
  label,
  value: tone ? { text: figure(v), tone, strong: true } : { text: figure(v), strong: true },
  note,
});

/** The mailboxes the email-history import scanned. */
function scannedMailboxes(): string {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return "sales@, purchasing@, Gmail";
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "the mailboxes the email-history import scanned, from the integrations global's connections, not a fixed list",
    );
  }
}

/**
 * The email-history import's dry run: what it scanned and found (RFQ threads, duplicates,
 * exceptions, confidential mail), over the window in its subhead. Nothing is imported before approval.
 */
export const emailImport = ({ emailImport: i = {} }: IntegrationsGlobal): KindData<"details"> => ({
  head: {
    subhead: m.integrations_import_days({ n: Number(i.days) || 0, days: str(i.days) }),
    tags: [{ label: str(i.status), tone: "info" }],
  },
  items: [
    // The mailboxes are addresses, the same in any language.
    importItem(m.integrations_emails_scanned(), i.scanned, scannedMailboxes()),
    importItem(m.integrations_rfq_threads(), i.rfqThreads, m.integrations_rfq_threads_note()),
    importItem(m.integrations_duplicates(), i.duplicates, m.integrations_duplicates_note()),
    importItem(m.integrations_exceptions(), i.exceptions, m.integrations_exceptions_note(), "warning"),
    importItem(m.integrations_confidential(), i.confidential, m.integrations_confidential_note(), "error"),
  ],
  note: m.integrations_import_note(),
  actions: [{ label: m.integrations_open_inbox_history(), href: "/inbox-history" }],
});

/**
 * The platform's languages: the company default and the languages customer documents go out in
 * (management changes them), then the signed-in person's own language.
 */
export const languages = (d: IntegrationsView): KindData<"settings"> => {
  const call = (body: Record<string, unknown>) => ({ path: "/integrations/language", body });
  const options = languageOptions();
  const documentsIn = { en: m.integrations_documents_en, ar: m.integrations_documents_ar };
  return {
    note: [m.integrations_languages_note(), ...(d.canSettings ? [] : [m.integrations_settings_by_management()])].join(
      "\n",
    ),
    items: [
      {
        label: m.integrations_company_default(),
        value: d.language.default,
        options,
        disabled: !d.canSettings,
        call: call({ field: "default" }),
      },
      ...options.map((l) => ({
        label: documentsIn[l.value as "en" | "ar"](),
        value: d.language.documents.includes(l.value),
        disabled: !d.canSettings,
        call: call({ field: "documents", lang: l.value }),
      })),
      { label: m.integrations_your_language(), value: d.myLanguage, options, call: call({ field: "mine" }) },
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
      { label: m.integrations_schedule(), value: str(b.schedule) },
      {
        label: m.integrations_copies(),
        value: m.integrations_copies_value({ locations: str(b.locations), days: str(b.retentionDays) }),
      },
      { label: m.integrations_last_backup(), value: when(b.lastBackupAt) },
      { label: m.integrations_restore_tested(), value: when(b.restoreTestedAt) },
      { label: m.integrations_staging_copy(), value: when(b.stagingRefreshedAt) },
    ],
    note: m.integrations_backups_note(),
    actions: [
      {
        label: m.integrations_refresh_staging(),
        call: { path: "/integrations/staging" },
        disabled: !management,
        reason: management ? undefined : m.integrations_refresh_staging_reason(),
        done: m.integrations_refresh_staging_done(),
      },
    ],
  };
};
