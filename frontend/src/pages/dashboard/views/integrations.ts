import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { API_ROUTE, api } from "../../../cms/client.ts";
import type { IntegrationsView } from "../../../cms/endpoints/platform.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { formatDate, toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";

/**
 * Integrations & data (root view /integrations): the connected channels — Outlook and Gmail
 * mailboxes (status, last sync, emails imported, token expiry → reconnect), the branded
 * acknowledgement (English / Arabic preview of the approved template), website quick-quote form,
 * WhatsApp, Egyptian e-invoicing, Odoo; the email-history import; daily backups, the staging
 * copy and a full data export; the language settings. Data: GET /api/integrations/status.
 */

type Connection = IntegrationsView["connections"][number];

const s = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");
const STATUS: Record<string, "success" | "error" | "warning" | "info" | "neutral"> = {
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
const DAY = 86_400_000;

@customElement("gs-integrations")
export class GsIntegrations extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: ViewProps["access"];
  @property({ attribute: false }) user!: ViewProps["user"];

  @state() private data: IntegrationsView | null = null;
  @state() private error = "";
  @state() private previewLang: "en" | "ar" = "en";
  @state() private reconnecting: Connection | null = null;
  @state() private busy = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<IntegrationsView>("/integrations/status");
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _reconnect() {
    const c = this.reconnecting;
    if (!c) return;
    this.reconnecting = null;
    this.busy = `conn-${c.index}`;
    try {
      const [r] = await Promise.all([
        api.post<{ message: string }>("/integrations/reconnect", { index: c.index }),
        new Promise((res) => setTimeout(res, 1000)),
      ]);
      toast(r.message);
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _staging() {
    this.busy = "staging";
    try {
      await Promise.all([api.post("/integrations/staging"), new Promise((res) => setTimeout(res, 1000))]);
      toast("Staging copy refreshed from last night's backup");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private async _setting(data: Record<string, unknown>) {
    try {
      await api.updateGlobal("settings", data);
      toast("Language settings saved");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _myLanguage(language: string) {
    try {
      await api.update("users", this.user.id, { language });
      toast(
        language === "ar"
          ? "Your dashboard language: Arabic (applies after go-live translation)"
          : "Your dashboard language: English",
      );
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _status(c: Connection) {
    return html`<ui-badge size="sm" variant="soft" .color=${STATUS[s(c.status)] ?? "neutral"}
      >${s(c.status)}</ui-badge
    >`;
  }

  private _expiry(v: unknown) {
    if (!v) return html`<ui-text size="xs" color="muted">—</ui-text>`;
    const d = new Date(s(v));
    const days = Math.round((d.getTime() - Date.now()) / DAY);
    return html`<ui-text size="xs" .color=${days < 0 ? "error" : days < 30 ? "warning" : "muted"}
      >${formatDate(s(v))}${days < 0 ? " · expired" : days < 30 ? ` · in ${days} d` : ""}</ui-text
    >`;
  }

  private _mailboxes(d: IntegrationsView) {
    const rows = d.connections.filter((c) => /mailbox/.test(s(c.kind)));
    const columns: TableColumn<Connection>[] = [
      {
        key: "account",
        label: "Mailbox",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm" weight="semibold">${s(c.account)}</ui-text>
            <ui-text size="xs" color="muted">${s(c.kind)}</ui-text>
          </ui-flex>`,
      },
      { key: "status", label: "Status", render: (c) => this._status(c) },
      {
        key: "lastSyncAt",
        label: "Last sync",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="xs">${c.lastSyncAt ? formatDate(s(c.lastSyncAt)) : "—"}</ui-text>
            ${c.pollEveryMinutes ? html`<ui-text size="xs" color="muted">every ${s(c.pollEveryMinutes)} min</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "emailsImported",
        label: "Emails imported",
        render: (c) =>
          html`<ui-text size="sm" weight="semibold"
            >${((Number(c.emailsImported) || 0) + c.live).toLocaleString("en-US")}</ui-text
          >`,
      },
      { key: "tokenExpiresAt", label: "Token expires", render: (c) => this._expiry(c.tokenExpiresAt) },
      {
        key: "action",
        label: "",
        render: (c) =>
          this.busy === `conn-${c.index}`
            ? html`<ui-flex gap="2" align="center"
                ><ui-loading size="xs" color="primary"></ui-loading
                ><ui-text size="xs" color="muted">Importing…</ui-text></ui-flex
              >`
            : c.status === "Token expired" || c.status === "To connect"
              ? html`<ui-button
                  size="xs"
                  color="primary"
                  ?disabled=${!d.canManage}
                  @click=${() => (this.reconnecting = c)}
                  >Reconnect</ui-button
                >`
              : html`<ui-text size="xs" color="muted">${s(c.notes)}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>
        Mailboxes <ui-badge size="sm" variant="soft">${rows.length}</ui-badge>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops
        mail: it waits in the exception queue and imports once on reconnect.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${rows}></ui-table>
      ${d.canManage ? nothing : html`<ui-text size="xs" color="muted">Management, operations or the office manager reconnect mailboxes.</ui-text>`}
    </ui-card>`;
  }

  private _ack(d: IntegrationsView) {
    const a = d.ack;
    const t = a[this.previewLang];
    const ar = this.previewLang === "ar";
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Branded acknowledgement</span>
        <ui-flex gap="1">
          <ui-button size="xs" .variant=${ar ? "ghost" : "soft"} @click=${() => (this.previewLang = "en")}
            >English</ui-button
          >
          <ui-button size="xs" .variant=${ar ? "soft" : "ghost"} @click=${() => (this.previewLang = "ar")}
            >العربية</ui-button
          >
        </ui-flex>
      </ui-flex>
      <ui-flex gap="2" wrap>
        <ui-badge size="sm" variant="soft" color="success">${a.status} v${a.version} · ${a.approvedBy}</ui-badge>
        <ui-badge size="sm" variant="outline">Sent once per thread</ui-badge>
        <ui-badge size="sm" variant="outline">Never to internal senders</ui-badge>
      </ui-flex>
      <ui-mockup-window>
        <ui-flex direction="col" gap="3" padding="4" dir=${ar ? "rtl" : "ltr"} lang=${ar ? "ar" : "en"}>
          <ui-flex direction="col" gap="0">
            <ui-text size="xs" color="muted">From: Golden Sea &lt;${a.from}&gt;</ui-text>
            <ui-text size="xs" color="muted">To: ${a.to}</ui-text>
            <ui-text size="sm" weight="semibold">${t.subject}</ui-text>
          </ui-flex>
          <ui-divider></ui-divider>
          <ui-text size="sm" leading="relaxed"
            >${t.body.split("\n").map((line, i) => (i ? html`<br />${line}` : line))}</ui-text
          >
        </ui-flex>
      </ui-mockup-window>
      <ui-text size="xs" color="muted"
        >Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new
        approval.</ui-text
      >
      <ui-button size="xs" variant="ghost" href="/globals/message-templates">All message templates</ui-button>
    </ui-card>`;
  }

  private _channel(c: Connection | undefined, title: string, text: string, extra: unknown = nothing) {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>${title}</span>
        ${c ? this._status(c) : nothing}
      </ui-flex>
      ${c?.account ? html`<ui-text size="sm" weight="medium">${s(c.account)}</ui-text>` : nothing}
      <ui-text size="xs" color="muted">${text}</ui-text>
      ${c?.notes ? html`<ui-text size="xs">${s(c.notes)}</ui-text>` : nothing} ${extra}
    </ui-card>`;
  }

  private _channels(d: IntegrationsView) {
    const by = (kind: string) => d.connections.find((c) => c.kind === kind);
    const web = by("Website form");
    const eta = by("E-invoicing (tax authority)");
    return html`<ui-grid fit="sm" gap="4">
      ${this._channel(
        web,
        "Website quick-quote form",
        "“Request a quick quote” creates a draft case and contact; AI reads the items.",
        web
          ? html`<ui-text size="xs" color="muted"
              >${(Number(web.emailsImported) || 0) + web.live} requests received</ui-text
            >`
          : nothing,
      )}
      ${this._channel(
        by("WhatsApp"),
        "WhatsApp",
        "Captains and agents message on WhatsApp: each message is logged on its case with a screenshot and who logged it.",
      )}
      ${this._channel(
        eta,
        "Egyptian e-invoicing (ETA)",
        "Invoices are signed and submitted to the tax authority; the UUID and status are stored on the invoice.",
        html`${eta?.tokenExpiresAt ? html`<ui-text size="xs">Signing certificate: ${this._expiry(eta.tokenExpiresAt)}</ui-text>` : nothing}
          <ui-button size="xs" variant="ghost" href="/automations">Submission failures → exception queue</ui-button>`,
      )}
      ${this._channel(by("AI extraction"), "AI extraction", "Reads PDF, Excel, Word and photos into draft lines. Drafts only.")}
      ${this._channel(by("Document storage"), "Documents", "Every file on its case, searchable.")}
    </ui-grid>`;
  }

  private _odoo(d: IntegrationsView) {
    const o = d.connections.find((c) => c.kind === "Odoo");
    const modules = s(o?.modules)
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Odoo</span>
        ${o ? this._status(o) : nothing}
      </ui-flex>
      <ui-heading level="3" size="lg">Odoo for the books, SaaSTEMLY for the way you work.</ui-heading>
      <ui-text size="sm" color="muted"
        >Standard, supported Odoo holds contacts, sales and purchase orders, stock, invoices and accounting. The
        sourcing desk on top — inbox, comparison, approvals, automations — writes into it, so any Odoo partner can read
        your books.</ui-text
      >
      <ui-flex gap="2" wrap
        >${modules.map((m) => html`<ui-badge size="md" variant="soft" color="primary">${m}</ui-badge>`)}</ui-flex
      >
      <ui-text size="xs" color="muted"
        >${s(o?.account)}${o?.lastSyncAt ? ` · last sync ${formatDate(s(o.lastSyncAt))}` : ""}</ui-text
      >
    </ui-card>`;
  }

  private _import(d: IntegrationsView) {
    const i = d.emailImport;
    const stat = (label: string, v: unknown, note: string, color?: "warning" | "error") =>
      html`<ui-flex direction="col" gap="0">
        <ui-text size="xs" color="muted">${label}</ui-text>
        <ui-text size="2xl" weight="semibold" .color=${color}>${Number(v ?? 0).toLocaleString("en-US")}</ui-text>
        <ui-text size="xs" color="muted">${note}</ui-text>
      </ui-flex>`;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Email history import — ${s(i.days)} days</span>
        <ui-badge size="sm" variant="soft" color="info">${s(i.status)}</ui-badge>
      </ui-flex>
      <ui-grid fit="xs" gap="4">
        ${stat("Emails scanned", i.scanned, "sales@, purchasing@, Gmail")}
        ${stat("RFQ threads", i.rfqThreads, "become historical cases")}
        ${stat("Likely duplicates", i.duplicates, "linked, not re-created")}
        ${stat("Exceptions", i.exceptions, "unreadable attachments", "warning")}
        ${stat("Flagged confidential", i.confidential, "excluded unless approved", "error")}
      </ui-grid>
      <ui-text size="xs" color="muted"
        >Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for
        historical mail.</ui-text
      >
      <ui-button size="sm" variant="soft" href="/inbox-history">Open inbox history</ui-button>
    </ui-card>`;
  }

  private _backups(d: IntegrationsView) {
    const b = d.backups;
    const row = (label: string, value: string) =>
      html`<ui-flex justify="between" gap="3" wrap
        ><ui-text size="sm" color="muted">${label}</ui-text
        ><ui-text size="sm" weight="medium">${value}</ui-text></ui-flex
      >`;
    const management = this.user?.role === "management";
    return html`<ui-card variant="border" shadow="false" heading="Backups, staging & export">
      ${row("Schedule", s(b.schedule))}
      ${row("Copies", `${s(b.locations)} locations · kept ${s(b.retentionDays)} days`)}
      ${row("Last backup", b.lastBackupAt ? formatDate(s(b.lastBackupAt)) : "—")}
      ${row("Restore last tested", b.restoreTestedAt ? formatDate(s(b.restoreTestedAt)) : "—")}
      ${row("Staging copy", b.stagingRefreshedAt ? formatDate(s(b.stagingRefreshedAt)) : "—")}
      <ui-text size="xs" color="muted"
        >The staging copy is where changes are tried before they reach your team; email sending and integrations are
        switched off there. Your data is always yours: export everything at any time.</ui-text
      >
      <ui-flex gap="2" wrap>
        <ui-button size="sm" color="primary" href=${`${API_ROUTE}/_mock/export`} target="_blank"
          >Download full export (JSON)</ui-button
        >
        ${
          this.busy === "staging"
            ? html`<ui-loading size="sm" color="primary"></ui-loading>`
            : html`<ui-button size="sm" variant="soft" ?disabled=${!management} @click=${() => this._staging()}
                >Refresh staging copy</ui-button
              >`
        }
      </ui-flex>
      ${management ? nothing : html`<ui-text size="xs" color="muted">Only management refreshes staging.</ui-text>`}
    </ui-card>`;
  }

  private _language(d: IntegrationsView) {
    return html`<ui-card variant="border" shadow="false" heading="Language — English / العربية">
      <ui-text size="xs" color="muted"
        >The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the
        customer's language.</ui-text
      >
      <ui-select
        legend="Company default"
        width="full"
        .options=${LANG}
        .value=${d.language.default}
        ?disabled=${!d.canSettings}
        @change=${(e: Event) => this._setting({ defaultLanguage: (e.target as HTMLSelectElement).value })}
      ></ui-select>
      <ui-flex direction="col" gap="2">
        <ui-text size="sm" weight="medium">Customer documents in</ui-text>
        ${LANG.map(
          (l) =>
            html`<ui-toggle
              size="sm"
              color="primary"
              .label=${l.label}
              .checked=${d.language.documents.includes(l.value)}
              ?disabled=${!d.canSettings}
              @change=${(e: Event) => {
                const on = (e.target as HTMLInputElement).checked;
                const docs = on
                  ? [...new Set([...d.language.documents, l.value])]
                  : d.language.documents.filter((x) => x !== l.value);
                void this._setting({ documentLanguages: docs.length ? docs : ["en"] });
              }}
            ></ui-toggle>`,
        )}
      </ui-flex>
      ${d.canSettings ? nothing : html`<ui-text size="xs" color="muted">Company settings are changed by management.</ui-text>`}
      <ui-select
        legend="Your language"
        width="full"
        .options=${LANG}
        .value=${d.myLanguage}
        @change=${(e: Event) => this._myLanguage((e.target as HTMLSelectElement).value)}
      ></ui-select>
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    const r = this.reconnecting;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>Configuration · integrations</ui-text>
          <ui-heading level="1" size="page">Integrations & data</ui-heading>
          <ui-text color="muted"
            >Your mailboxes, website, WhatsApp, the tax authority and Odoo, connected — with daily backups, a staging
            copy and your data exportable at any time.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/automations">Exception queue</ui-button>
          <ui-button size="sm" variant="soft" href="/globals/integrations">Edit connections</ui-button>
        </ui-flex>
      </ui-flex>
      ${this._mailboxes(d)}
      <ui-grid fit="md" gap="6" align="start">${this._ack(d)} ${this._odoo(d)}</ui-grid>
      ${this._channels(d)}
      <ui-grid fit="md" gap="6" align="start">${this._import(d)} ${this._backups(d)} ${this._language(d)}</ui-grid>
      <ui-modal heading=${`Reconnect ${s(r?.account)}`} .open=${!!r} @ui-close=${() => (this.reconnecting = null)}>
        <ui-text size="sm"
          >You'll sign in with the mailbox's ${/Gmail/.test(s(r?.kind)) ? "Google" : "Microsoft 365"} account (simulated
          in the demo). After sign-in, the emails that waited are imported once each — the idempotency check makes sure
          none is imported, acknowledged or turned into a case twice.</ui-text
        >
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.reconnecting = null)}>Cancel</ui-button>
          <ui-button color="primary" @click=${() => this._reconnect()}>Sign in & reconnect</ui-button>
        </ui-flex>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-integrations": GsIntegrations;
  }
}
