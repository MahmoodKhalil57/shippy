import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { AutomationsView, TimelineEntry } from "../../../cms/endpoints/platform.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { formatDate, toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";

/**
 * Automations & exceptions (root view /automations): the rule registry (trigger, owner, due,
 * approval, retry, stop condition — from the automation-rules global; management switches rules
 * on and off), the exception queue with an idempotent "Safe retry", the AI review queue for
 * low-confidence results and the audit log. Data: GET /api/automations.
 */

type Rule = AutomationsView["rules"][number];
type Review = AutomationsView["review"][number];

const MODE: Record<string, { label: string; color: "success" | "info" | "warning" }> = {
  auto: { label: "Automatic", color: "success" },
  "pre-approved": { label: "Automatic (pre-approved)", color: "info" },
  prepare: { label: "Prepared for review", color: "warning" },
};
const STATUS_COLOR: Record<string, "error" | "warning" | "success" | "neutral"> = {
  Open: "error",
  "Waiting for review": "warning",
  Resolved: "success",
  "Auto-resolved": "success",
  Ignored: "neutral",
};
const KIND_COLOR = { auto: "info", human: "success", alert: "warning" } as const;
const KIND_LABEL = { auto: "Automatic", human: "Human", alert: "Alert" } as const;

const s = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

@customElement("gs-automations")
export class GsAutomations extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: ViewProps["access"];
  @property({ attribute: false }) user!: ViewProps["user"];

  @state() private data: AutomationsView | null = null;
  @state() private error = "";
  @state() private retrying = "";
  @state() private reviewing: Review | null = null;
  @state() private lastResult = "";

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<AutomationsView>("/automations");
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private async _retry(x: Doc) {
    this.retrying = x.id;
    try {
      const [r] = await Promise.all([
        api.post<{ message: string; alreadyDone: boolean }>(`/automations/retry/${encodeURIComponent(x.id)}`),
        new Promise((res) => setTimeout(res, 900)),
      ]);
      this.lastResult = r.message;
      toast(r.alreadyDone ? r.message : `Retried safely — ${r.message}`, r.alreadyDone ? "info" : "success");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.retrying = "";
    }
  }

  private async _confirmReview() {
    const r = this.reviewing;
    if (!r) return;
    this.reviewing = null;
    try {
      await api.post(`/automations/review/${encodeURIComponent(r.id)}`, {});
      toast("Reviewed — your name is on the audit log");
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  private async _toggle(rule: Rule, enabled: boolean) {
    const d = this.data!;
    const rules = d.rules.map(({ index, ...r }) => (index === rule.index ? { ...r, enabled } : r));
    try {
      await api.updateGlobal("automation-rules", { rules });
      await api.create("activities", {
        kind: "human",
        text: `${enabled ? "Enabled" : "Paused"} automation “${s(rule.name)}”.`,
        entity: "globals/automation-rules",
      });
      toast(`${s(rule.name)} ${enabled ? "enabled" : "paused"} (logged)`);
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _header() {
    return html`<ui-page-header>
      <span slot="eyebrow">Work · automation</span>
      <span slot="heading">Automations & exceptions</span>
      <span slot="subtitle"
        >Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition.
        Reprocessing never creates duplicates; failures land in the exception queue with a safe retry.</span
      >
      <ui-flex slot="actions" gap="2" wrap>
        <ui-button size="xs" variant="tonal" href="/collections/integration-exceptions">All exceptions</ui-button>
        <ui-button size="xs" variant="tonal" href="/collections/activities">Full activity log</ui-button>
      </ui-flex>
    </ui-page-header>`;
  }

  private _tiles(d: AutomationsView) {
    const tile = (label: string, value: string, note: string, color?: "error" | "warning" | "success") =>
      html`<ui-card size="sm">
        <ui-text variant="body-md" color="muted" truncate>${label}</ui-text>
        <ui-text variant="headline-md" leading="tight" .color=${color}>${value}</ui-text>
        <ui-text variant="body-sm" color="muted">${note}</ui-text>
      </ui-card>`;
    return html`<ui-grid fit="xs" gap="4">
      ${tile("Rules", `${d.stats.enabled}/${d.stats.rules}`, "enabled · every one explicit")}
      ${tile("AI-assisted", String(d.stats.ai), "drafts only, confidence on every value")}
      ${tile("Open exceptions", String(d.stats.open), "nothing fails silently", d.stats.open ? "error" : "success")}
      ${tile("Waiting for review", String(d.stats.review), "low-confidence results", d.stats.review ? "warning" : "success")}
      ${tile("Auto-resolved", String(d.stats.autoResolved), "duplicates caught by idempotency key", "success")}
    </ui-grid>`;
  }

  private _exceptions(d: AutomationsView) {
    const columns: TableColumn[] = [
      {
        key: "occurredAt",
        label: "When",
        render: (x) => html`<ui-text variant="body-sm">${formatDate(x.occurredAt)}</ui-text>`,
      },
      {
        key: "summary",
        label: "What happened",
        render: (x) =>
          html`<ui-flex direction="col" gap="0">
            <ui-flex gap="2" align="center" wrap>
              <ui-tag variant="outline">${s(x.source)}</ui-tag>
              <ui-text variant="label-lg">${s(x.summary)}</ui-text>
            </ui-flex>
            <ui-text variant="body-sm" color="muted">${s(x.impact)}</ui-text>
          </ui-flex>`,
      },
      {
        key: "idempotencyKey",
        label: "Idempotency key",
        render: (x) => html`<ui-text as="code" variant="body-sm" mono>${s(x.idempotencyKey) || "—"}</ui-text>`,
      },
      {
        key: "retries",
        label: "Retries",
        render: (x) => html`<ui-text variant="body-md">${s(x.retries) || "0"}</ui-text>`,
      },
      {
        key: "status",
        label: "Status",
        render: (x) => html`<ui-tag .tone=${STATUS_COLOR[s(x.status)] ?? "neutral"}>${s(x.status)}</ui-tag>`,
      },
      {
        key: "action",
        label: "",
        render: (x) =>
          x.status === "Open"
            ? this.retrying === x.id
              ? html`<ui-flex gap="2" align="center"
                  ><ui-loading size="sm" color="primary"></ui-loading
                  ><ui-text variant="body-sm" color="muted">Checking key…</ui-text></ui-flex
                >`
              : html`<ui-button size="xs" color="primary" variant="tonal" @click=${() => this._retry(x as Doc)}
                  >Safe retry</ui-button
                >`
            : x.status === "Waiting for review"
              ? html`<ui-text variant="body-sm" color="muted">In the review queue</ui-text>`
              : html`<ui-button size="xs" variant="text" @click=${() => this._retry(x as Doc)}>Retry again</ui-button>`,
      },
    ];
    return html`<ui-card>
      <span slot="heading">Exception queue</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag .tone=${d.stats.open ? "error" : "success"}>${d.stats.open} open</ui-tag></ui-flex
      >
      <ui-text variant="body-sm" color="muted"
        >A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported
        or sent twice. Retrying a resolved item changes nothing.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.exceptions}></ui-table>
      ${this.lastResult ? html`<ui-alert tone="success">${this.lastResult}</ui-alert>` : nothing}
    </ui-card>`;
  }

  private _review(d: AutomationsView) {
    return html`<ui-card .count=${d.review.length} .countTone=${d.review.length ? "warning" : "success"}>
      <span slot="heading">AI review queue</span>
      <ui-text variant="body-sm" color="muted"
        >Below the confidence threshold the AI never applies a value: it leaves the field blank or the match unlinked
        and waits here for a person.</ui-text
      >
      <ui-flex direction="col" gap="3">
        ${
          d.review.length
            ? d.review.map(
                (r) =>
                  html`<ui-flex gap="3" align="start" wrap>
                    <ui-icon name="sparkles" color="accent" size="sm"></ui-icon>
                    <ui-flex direction="col" gap="0" grow shrink>
                      <ui-text variant="label-lg">${r.title}</ui-text>
                      <ui-text variant="body-sm" color="muted">${r.detail}</ui-text>
                    </ui-flex>
                    ${
                      r.confidence !== undefined
                        ? html`<ui-tag tone="warning">${Math.round(r.confidence * 100)}%</ui-tag>`
                        : nothing
                    }
                    <ui-flex gap="1">
                      <ui-button size="xs" variant="text" .href=${r.href}>Open</ui-button>
                      ${
                        r.kind === "exception"
                          ? html`<ui-button
                              size="xs"
                              variant="tonal"
                              color="primary"
                              @click=${() => (this.reviewing = r)}
                              >Mark reviewed</ui-button
                            >`
                          : nothing
                      }
                    </ui-flex>
                  </ui-flex>`,
              )
            : html`<ui-empty-state size="sm">Nothing waiting for review.</ui-empty-state>`
        }
      </ui-flex>
    </ui-card>`;
  }

  private _boundaries() {
    const auto = [
      "Capture emails, link files, extract draft data, spot likely duplicates",
      "Assign owners, update proven events, calculate waiting times",
      "Calculate costs, FX conversions, margins and comparisons",
      "Create reminders, escalations, dashboards and daily briefings",
      "Prepare linked quotations, POs, bills and invoice drafts",
    ];
    const people = [
      "Uncertain matches, technical interpretation, missing information",
      "Owner overrides, exception resolution, discretionary closure",
      "Final selling prices, discounts, substitutions, supplier selection",
      "External messages and follow-ups unless explicitly pre-approved",
      "Commercial commitments, accounting postings and payments",
    ];
    const col = (title: string, icon: "bolt" | "user", rows: string[]) =>
      html`<ui-flex direction="col" gap="2">
        <ui-flex gap="2" align="center"
          ><ui-icon .name=${icon} size="sm"></ui-icon><ui-text emphasized>${title}</ui-text></ui-flex
        >
        ${rows.map((r) => html`<ui-text variant="body-md">• ${r}</ui-text>`)}
      </ui-flex>`;
    return html`<ui-card heading="Automation boundaries">
      <ui-grid fit="sm" gap="6">
        ${col("Runs automatically under approved rules", "bolt", auto)}
        ${col("Prepared for an authorised person", "user", people)}
      </ui-grid>
    </ui-card>`;
  }

  private _registry(d: AutomationsView) {
    const columns: TableColumn<Rule>[] = [
      {
        key: "name",
        label: "Rule",
        render: (r) =>
          html`<ui-flex direction="col" gap="1" align="start">
            <ui-text variant="title-sm">${s(r.name)}</ui-text>
            <ui-flex gap="1" wrap>
              <ui-tag .tone=${MODE[s(r.mode)]?.color ?? "neutral"}>${MODE[s(r.mode)]?.label ?? s(r.mode)}</ui-tag>
              ${r.usesAI ? html`<ui-tag tone="primary">AI-assisted</ui-tag>` : nothing}
              ${
                typeof r.confidenceThreshold === "number"
                  ? html`<ui-tag variant="outline">review &lt; ${Math.round(r.confidenceThreshold * 100)}%</ui-tag>`
                  : nothing
              }
            </ui-flex>
          </ui-flex>`,
      },
      { key: "trigger", label: "Trigger", render: (r) => html`<ui-text variant="body-sm">${s(r.trigger)}</ui-text>` },
      { key: "action", label: "Action", render: (r) => html`<ui-text variant="body-sm">${s(r.action)}</ui-text>` },
      {
        key: "owner",
        label: "Owner · due",
        render: (r) => html`<ui-text variant="body-sm">${s(r.owner) || "—"} · ${s(r.due) || "—"}</ui-text>`,
      },
      {
        key: "approval",
        label: "Approval",
        render: (r) => html`<ui-text variant="body-sm">${s(r.approval) || "—"}</ui-text>`,
      },
      { key: "retry", label: "Retry", render: (r) => html`<ui-text variant="body-sm">${s(r.retry) || "—"}</ui-text>` },
      {
        key: "stop",
        label: "Stop condition",
        render: (r) => html`<ui-text variant="body-sm">${s(r.stop) || "—"}</ui-text>`,
      },
      {
        key: "enabled",
        label: "On",
        render: (r) =>
          d.canEdit
            ? html`<ui-switch
                size="sm"
                .checked=${r.enabled !== false}
                aria-label=${`Enable ${s(r.name)}`}
                @change=${(e: Event) => this._toggle(r, (e.target as HTMLInputElement).checked)}
              ></ui-switch>`
            : html`<ui-tag .tone=${r.enabled !== false ? "success" : "neutral"}
                >${r.enabled !== false ? "On" : "Paused"}</ui-tag
              >`,
      },
    ];
    return html`<ui-card>
      <span slot="heading">Rule registry</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap><ui-tag>${d.rules.length} rules</ui-tag></ui-flex>
      <ui-text variant="body-sm" color="muted"
        >${d.canEdit ? "You can pause or enable rules; each change is logged." : "Management can pause or enable rules; everyone can read them."}</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.rules}></ui-table>
    </ui-card>`;
  }

  private _audit(d: AutomationsView) {
    const columns: TableColumn<TimelineEntry & Record<string, unknown>>[] = [
      { key: "at", label: "When", render: (a) => html`<ui-text variant="body-sm">${formatDate(a.at)}</ui-text>` },
      {
        key: "kind",
        label: "Who",
        render: (a) =>
          html`<ui-flex direction="col" gap="0" align="start">
            <ui-tag .tone=${KIND_COLOR[a.kind]}>${KIND_LABEL[a.kind]}</ui-tag>
            <ui-text variant="body-sm" color="muted">${a.actor}</ui-text>
          </ui-flex>`,
      },
      {
        key: "text",
        label: "What",
        render: (a) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${a.text}</ui-text>
            ${a.rule ? html`<ui-text variant="body-sm" color="muted">rule: ${a.rule}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "caseId",
        label: "Case",
        render: (a) =>
          a.caseHref
            ? html`<ui-link color="primary" .href=${a.caseHref}
                ><ui-text variant="body-md">${a.caseId}</ui-text></ui-link
              >`
            : html`<ui-text variant="body-sm" color="muted">${a.entity || "—"}</ui-text>`,
      },
    ];
    return html`<ui-card>
      <span slot="heading">Audit log</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap><ui-tag>latest ${d.audit.length}</ui-tag></ui-flex>
      <ui-text variant="body-sm" color="muted">Every automatic step and human decision, append-only.</ui-text>
      <ui-table size="sm" .columns=${columns} .rows=${d.audit as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  render() {
    if (this.error)
      return html`<ui-empty-state
        tone="error"
        heading="This page couldn't load"
        .description=${this.error}
      ></ui-empty-state>`;
    const d = this.data;
    if (!d) return html`<ui-empty-state loading></ui-empty-state>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._header()} ${this._tiles(d)}
      <ui-grid fit="lg" gap="6" align="start">${this._exceptions(d)} ${this._review(d)}</ui-grid>
      ${this._registry(d)} ${this._boundaries()} ${this._audit(d)}
      <ui-modal
        heading="Mark as reviewed?"
        confirm-label="Confirm reviewed"
        .open=${!!this.reviewing}
        @ui-confirm=${() => this._confirmReview()}
        @ui-close=${() => (this.reviewing = null)}
      >
        <ui-text variant="body-md">${this.reviewing?.title}</ui-text>
        <ui-text variant="body-md" color="muted"
          >Confirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are
          never applied without this.</ui-text
        >
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-automations": GsAutomations;
  }
}
