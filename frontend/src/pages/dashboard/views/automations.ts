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
    return html`<ui-flex justify="between" align="end" gap="4" wrap>
      <ui-flex direction="col" gap="1" shrink>
        <ui-text size="xs" color="muted" weight="medium" uppercase>Work · automation</ui-text>
        <ui-heading level="1" size="page">Automations & exceptions</ui-heading>
        <ui-text color="muted"
          >Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition.
          Reprocessing never creates duplicates; failures land in the exception queue with a safe retry.</ui-text
        >
      </ui-flex>
      <ui-flex gap="2" wrap>
        <ui-button size="sm" variant="soft" href="/collections/integration-exceptions">All exceptions</ui-button>
        <ui-button size="sm" variant="soft" href="/collections/activities">Full activity log</ui-button>
      </ui-flex>
    </ui-flex>`;
  }

  private _tiles(d: AutomationsView) {
    const tile = (label: string, value: string, note: string, color?: "error" | "warning" | "success") =>
      html`<ui-card variant="border" size="sm" shadow="false">
        <ui-text size="sm" color="muted" truncate>${label}</ui-text>
        <ui-text size="3xl" weight="semibold" leading="tight" .color=${color}>${value}</ui-text>
        <ui-text size="xs" color="muted">${note}</ui-text>
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
        render: (x) => html`<ui-text size="xs">${formatDate(x.occurredAt)}</ui-text>`,
      },
      {
        key: "summary",
        label: "What happened",
        render: (x) =>
          html`<ui-flex direction="col" gap="0">
            <ui-flex gap="2" align="center" wrap>
              <ui-badge size="xs" variant="outline">${s(x.source)}</ui-badge>
              <ui-text size="sm" weight="medium">${s(x.summary)}</ui-text>
            </ui-flex>
            <ui-text size="xs" color="muted">${s(x.impact)}</ui-text>
          </ui-flex>`,
      },
      {
        key: "idempotencyKey",
        label: "Idempotency key",
        render: (x) => html`<ui-text as="code" size="xs" mono>${s(x.idempotencyKey) || "—"}</ui-text>`,
      },
      { key: "retries", label: "Retries", render: (x) => html`<ui-text size="sm">${s(x.retries) || "0"}</ui-text>` },
      {
        key: "status",
        label: "Status",
        render: (x) =>
          html`<ui-badge size="sm" variant="soft" .color=${STATUS_COLOR[s(x.status)] ?? "neutral"}
            >${s(x.status)}</ui-badge
          >`,
      },
      {
        key: "action",
        label: "",
        render: (x) =>
          x.status === "Open"
            ? this.retrying === x.id
              ? html`<ui-flex gap="2" align="center"
                  ><ui-loading size="xs" color="primary"></ui-loading
                  ><ui-text size="xs" color="muted">Checking key…</ui-text></ui-flex
                >`
              : html`<ui-button size="xs" color="primary" variant="soft" @click=${() => this._retry(x as Doc)}
                  >Safe retry</ui-button
                >`
            : x.status === "Waiting for review"
              ? html`<ui-text size="xs" color="muted">In the review queue</ui-text>`
              : html`<ui-button size="xs" variant="ghost" @click=${() => this._retry(x as Doc)}
                  >Retry again</ui-button
                >`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>
        Exception queue
        <ui-badge size="sm" variant="soft" .color=${d.stats.open ? "error" : "success"}>${d.stats.open} open</ui-badge>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported
        or sent twice. Retrying a resolved item changes nothing.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.exceptions}></ui-table>
      ${this.lastResult ? html`<ui-alert color="success" variant="soft">${this.lastResult}</ui-alert>` : nothing}
    </ui-card>`;
  }

  private _review(d: AutomationsView) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>
        AI review queue
        <ui-badge size="sm" variant="soft" .color=${d.review.length ? "warning" : "success"}
          >${d.review.length}</ui-badge
        >
      </ui-flex>
      <ui-text size="xs" color="muted"
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
                      <ui-text size="sm" weight="medium">${r.title}</ui-text>
                      <ui-text size="xs" color="muted">${r.detail}</ui-text>
                    </ui-flex>
                    ${
                      r.confidence !== undefined
                        ? html`<ui-badge size="sm" variant="soft" color="warning"
                            >${Math.round(r.confidence * 100)}%</ui-badge
                          >`
                        : nothing
                    }
                    <ui-flex gap="1">
                      <ui-button size="xs" variant="ghost" .href=${r.href}>Open</ui-button>
                      ${
                        r.kind === "exception"
                          ? html`<ui-button
                              size="xs"
                              variant="soft"
                              color="primary"
                              @click=${() => (this.reviewing = r)}
                              >Mark reviewed</ui-button
                            >`
                          : nothing
                      }
                    </ui-flex>
                  </ui-flex>`,
              )
            : html`<ui-text size="sm" color="muted">Nothing waiting for review.</ui-text>`
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
          ><ui-icon .name=${icon} size="sm"></ui-icon><ui-text weight="semibold">${title}</ui-text></ui-flex
        >
        ${rows.map((r) => html`<ui-text size="sm">• ${r}</ui-text>`)}
      </ui-flex>`;
    return html`<ui-card variant="border" shadow="false" heading="Automation boundaries">
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
            <ui-text size="sm" weight="semibold">${s(r.name)}</ui-text>
            <ui-flex gap="1" wrap>
              <ui-badge size="xs" variant="soft" .color=${MODE[s(r.mode)]?.color ?? "neutral"}
                >${MODE[s(r.mode)]?.label ?? s(r.mode)}</ui-badge
              >
              ${r.usesAI ? html`<ui-badge size="xs" variant="soft" color="accent">AI-assisted</ui-badge>` : nothing}
              ${
                typeof r.confidenceThreshold === "number"
                  ? html`<ui-badge size="xs" variant="outline"
                      >review &lt; ${Math.round(r.confidenceThreshold * 100)}%</ui-badge
                    >`
                  : nothing
              }
            </ui-flex>
          </ui-flex>`,
      },
      { key: "trigger", label: "Trigger", render: (r) => html`<ui-text size="xs">${s(r.trigger)}</ui-text>` },
      { key: "action", label: "Action", render: (r) => html`<ui-text size="xs">${s(r.action)}</ui-text>` },
      {
        key: "owner",
        label: "Owner · due",
        render: (r) => html`<ui-text size="xs">${s(r.owner) || "—"} · ${s(r.due) || "—"}</ui-text>`,
      },
      { key: "approval", label: "Approval", render: (r) => html`<ui-text size="xs">${s(r.approval) || "—"}</ui-text>` },
      { key: "retry", label: "Retry", render: (r) => html`<ui-text size="xs">${s(r.retry) || "—"}</ui-text>` },
      { key: "stop", label: "Stop condition", render: (r) => html`<ui-text size="xs">${s(r.stop) || "—"}</ui-text>` },
      {
        key: "enabled",
        label: "On",
        render: (r) =>
          d.canEdit
            ? html`<ui-toggle
                size="sm"
                color="success"
                .checked=${r.enabled !== false}
                aria-label=${`Enable ${s(r.name)}`}
                @change=${(e: Event) => this._toggle(r, (e.target as HTMLInputElement).checked)}
              ></ui-toggle>`
            : html`<ui-badge size="xs" variant="soft" .color=${r.enabled !== false ? "success" : "neutral"}
                >${r.enabled !== false ? "On" : "Paused"}</ui-badge
              >`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>
        Rule registry <ui-badge size="sm" variant="soft">${d.rules.length} rules</ui-badge>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >${d.canEdit ? "You can pause or enable rules; each change is logged." : "Management can pause or enable rules; everyone can read them."}</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${d.rules}></ui-table>
    </ui-card>`;
  }

  private _audit(d: AutomationsView) {
    const columns: TableColumn<TimelineEntry & Record<string, unknown>>[] = [
      { key: "at", label: "When", render: (a) => html`<ui-text size="xs">${formatDate(a.at)}</ui-text>` },
      {
        key: "kind",
        label: "Who",
        render: (a) =>
          html`<ui-flex direction="col" gap="0" align="start">
            <ui-badge size="xs" variant="soft" .color=${KIND_COLOR[a.kind]}>${KIND_LABEL[a.kind]}</ui-badge>
            <ui-text size="xs" color="muted">${a.actor}</ui-text>
          </ui-flex>`,
      },
      {
        key: "text",
        label: "What",
        render: (a) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${a.text}</ui-text>
            ${a.rule ? html`<ui-text size="xs" color="muted">rule: ${a.rule}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "caseId",
        label: "Case",
        render: (a) =>
          a.caseHref
            ? html`<ui-link color="primary" .href=${a.caseHref}><ui-text size="sm">${a.caseId}</ui-text></ui-link>`
            : html`<ui-text size="xs" color="muted">${a.entity || "—"}</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap
        >Audit log <ui-badge size="sm" variant="soft">latest ${d.audit.length}</ui-badge></ui-flex
      >
      <ui-text size="xs" color="muted">Every automatic step and human decision, append-only.</ui-text>
      <ui-table size="sm" .columns=${columns} .rows=${d.audit as unknown as Record<string, unknown>[]}></ui-table>
    </ui-card>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._header()} ${this._tiles(d)}
      <ui-grid fit="lg" gap="6" align="start">${this._exceptions(d)} ${this._review(d)}</ui-grid>
      ${this._registry(d)} ${this._boundaries()} ${this._audit(d)}
      <ui-modal heading="Mark as reviewed?" .open=${!!this.reviewing} @ui-close=${() => (this.reviewing = null)}>
        <ui-text size="sm">${this.reviewing?.title}</ui-text>
        <ui-text size="sm" color="muted"
          >Confirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are
          never applied without this.</ui-text
        >
        <ui-flex slot="actions" gap="2">
          <ui-button variant="ghost" @click=${() => (this.reviewing = null)}>Cancel</ui-button>
          <ui-button color="primary" @click=${() => this._confirmReview()}>Confirm reviewed</ui-button>
        </ui-flex>
      </ui-modal>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-automations": GsAutomations;
  }
}
