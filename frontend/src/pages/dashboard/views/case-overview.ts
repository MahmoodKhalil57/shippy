import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { CaseOverview, TimelineEntry } from "../../../cms/endpoints/platform.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import type { TimelineItem } from "../../../components/primitives/data/timeline.ts";
import type { StepItem } from "../../../components/primitives/navigation/steps.ts";
import "../../../components/index.ts";
import { formatDate, toast } from "../shared.ts";
import type { ViewProps } from "../views.ts";

/**
 * The case at a glance (case tab /overview): where it is on the 16-step flow, how far each line
 * really is (partials never read as done), the next action and blocker, owner and backup with an
 * AI-drafted handover a person confirms, the clarification log, the customer's contact rule and
 * the activity timeline (automatic vs human vs alert, with the rule that fired) — the audit trail.
 * Data: GET /api/case-overview/:id (src/cms/endpoints/platform.ts).
 */

const KIND = {
  auto: { label: "Automatic", icon: "sync", color: "info" },
  human: { label: "Human", icon: "user", color: "success" },
  alert: { label: "Alert", icon: "warning", color: "warning" },
} as const;

const BUCKET_LABEL = {
  ready: "Ready",
  waiting: "Waiting",
  blocked: "Blocked",
  noOffer: "No offer",
  closed: "Not awarded",
} as const;
const BUCKET_COLOR = {
  ready: "success",
  waiting: "warning",
  blocked: "error",
  noOffer: "neutral",
  closed: "neutral",
} as const;

type Clarification = CaseOverview["clarifications"][number];
type LineRow = CaseOverview["lines"]["rows"][number];

@customElement("gs-case-overview")
export class GsCaseOverview extends LightElement implements ViewProps {
  @property({ attribute: false }) access!: ViewProps["access"];
  @property({ attribute: false }) user!: ViewProps["user"];
  @property({ attribute: false }) slug?: string;
  @property({ attribute: false }) docId?: string;

  @state() private data: CaseOverview | null = null;
  @state() private error = "";
  @state() private filter: "all" | TimelineEntry["kind"] = "all";
  @state() private reassignOpen = false;
  @state() private to = "";
  @state() private note = "";
  @state() private drafting = false;
  @state() private draftMeta: { confidence: number; sources: string[] } | null = null;
  @state() private saving = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.data = await api.get<CaseOverview>(`/case-overview/${encodeURIComponent(this.docId ?? "")}`);
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  /* ---------------------------------------------------------------- reassign */

  private _openReassign() {
    const d = this.data!;
    this.to = d.backup && d.backup.id !== d.owner?.id ? d.backup.id : "";
    this.note = "";
    this.draftMeta = null;
    this.reassignOpen = true;
  }

  private async _draft() {
    if (!this.to) return toast("Pick who takes over first.", "warning");
    this.drafting = true;
    try {
      // The AI reads the case, its clarifications, open tasks and timeline (a short visible step).
      const [r] = await Promise.all([
        api.post<{ draft: string; confidence: number; sources: string[] }>(
          `/case-overview/${encodeURIComponent(this.docId ?? "")}/handover`,
          { to: this.to },
        ),
        new Promise((res) => setTimeout(res, 1000)),
      ]);
      this.note = r.draft;
      this.draftMeta = { confidence: r.confidence, sources: r.sources };
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.drafting = false;
    }
  }

  private async _reassign() {
    const d = this.data!;
    const target = d.team.find((p) => p.id === this.to);
    if (!target || !this.note.trim()) {
      toast("Choose the new owner and confirm a handover note.", "warning");
      return;
    }
    this.saving = true;
    try {
      const r = await api.post<{ movedTasks: number }>(`/case-overview/${encodeURIComponent(d.id)}/reassign`, {
        to: target.id,
        note: this.note,
      });
      toast(
        `${d.caseId} handed over to ${target.name}${r.movedTasks ? ` · ${r.movedTasks} open task${r.movedTasks === 1 ? "" : "s"} moved` : ""} · note logged on the timeline`,
      );
      this.reassignOpen = false;
      await this._load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.saving = false;
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _lifecycle(d: CaseOverview) {
    const halted = d.halted === "lost" ? "error" : d.halted === "paused" ? "neutral" : undefined;
    const items: StepItem[] = d.steps.map((s, i) => ({
      label: s.label,
      color: i === d.current && halted ? halted : undefined,
      marker: i < d.current ? "✓" : undefined,
    }));
    const step = d.steps[d.current]!;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Lifecycle — first email to last payment</span>
        <ui-badge size="sm" variant="soft" color="primary">Step ${d.current + 1} of ${d.steps.length}</ui-badge>
      </ui-flex>
      <ui-steps scrollable color="primary" .current=${d.current} .items=${items}></ui-steps>
      <ui-flex gap="2" align="center" wrap>
        <ui-badge size="sm" variant="outline">Phase ${step.phase}</ui-badge>
        <ui-text variant="title-sm">${step.label}: ${d.stage}</ui-text>
        <ui-text variant="body-md" color="muted">${step.detail}</ui-text>
      </ui-flex>
      ${
        d.halted
          ? html`<ui-alert color=${d.halted === "lost" ? "error" : "warning"} variant="soft"
              >${d.halted === "lost" ? "The case ended here" : "Paused at the customer's decision"} —
              ${d.next}</ui-alert
            >`
          : nothing
      }
    </ui-card>`;
  }

  private _bar(
    label: string,
    value: number,
    total: number,
    color: "success" | "warning" | "error" | "neutral" | "info",
  ) {
    return html`<ui-flex direction="col" gap="1">
      <ui-flex justify="between" gap="2">
        <ui-text variant="body-md">${label}</ui-text>
        <ui-text variant="title-sm">${value} / ${total}</ui-text>
      </ui-flex>
      <ui-progress
        .color=${color}
        width="full"
        .value=${value}
        .max=${Math.max(total, 1)}
        .label=${`${label}: ${value} of ${total} lines`}
      ></ui-progress>
    </ui-flex>`;
  }

  private _lines(d: CaseOverview) {
    const l = d.lines;
    const f = d.fulfilment;
    const pct = l.total ? Math.round((l.ready / l.total) * 100) : 0;
    const columns: TableColumn<LineRow & Record<string, unknown>>[] = [
      { key: "lineNo", label: "#", render: (r) => html`<ui-text variant="title-sm">${r.lineNo}</ui-text>` },
      { key: "description", label: "Line", render: (r) => html`<ui-text variant="body-md">${r.description}</ui-text>` },
      {
        key: "status",
        label: "Status",
        render: (r) =>
          html`<ui-flex gap="2" align="center">
            <ui-status size="sm" .color=${BUCKET_COLOR[r.bucket]} .label=${BUCKET_LABEL[r.bucket]}></ui-status>
            <ui-text variant="body-md">${r.status}</ui-text>
          </ui-flex>`,
      },
      {
        key: "confidence",
        label: "AI read",
        render: (r) =>
          r.confidence === undefined
            ? html`<ui-text variant="body-md" color="muted">—</ui-text>`
            : html`<ui-badge size="sm" variant="soft" .color=${r.confidence < 0.85 ? "warning" : "neutral"}
                >${Math.round(r.confidence * 100)}%</ui-badge
              >`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Line progress</span>
        <ui-badge size="sm" variant="soft" .color=${l.ready === l.total && l.total ? "success" : "warning"}
          >${pct}% ready</ui-badge
        >
      </ui-flex>
      <ui-text variant="body-md" color="muted"
        >Each line moves on its own. A case with some lines ready is ${pct}% — never “done” until every line
        is.</ui-text
      >
      <ui-grid fit="xs" gap="4">
        ${this._bar("Ready", l.ready, l.total, "success")} ${this._bar("Waiting", l.waiting, l.total, "warning")}
        ${this._bar("Blocked", l.blocked, l.total, "error")} ${this._bar("No offer", l.noOffer, l.total, "neutral")}
      </ui-grid>
      ${
        f.started
          ? html`<ui-divider placement="start">After the order</ui-divider>
              <ui-grid fit="xs" gap="4">
                ${this._bar("Ordered", f.ordered, f.total, "info")}
                ${this._bar("Received", f.received, f.total, "info")}
                ${this._bar("Delivered", f.delivered, f.total, "info")}
                ${this._bar("Invoiced", f.invoiced, f.total, "info")}
              </ui-grid>
              ${f.notes.map((n) => html`<ui-text variant="body-sm" color="warning">⚑ ${n}</ui-text>`)}`
          : nothing
      }
      ${
        l.rows.length
          ? html`<ui-table
              size="sm"
              .columns=${columns}
              .rows=${l.rows as unknown as Record<string, unknown>[]}
            ></ui-table>`
          : nothing
      }
    </ui-card>`;
  }

  private _next(d: CaseOverview) {
    return html`<ui-card variant="border" shadow="false" heading="Next action">
      <ui-text emphasized>${d.next || "—"}</ui-text>
      ${
        d.blocker
          ? html`<ui-alert color="warning" variant="soft"
              ><span><strong>Blocker:</strong> ${d.blocker}</span></ui-alert
            >`
          : html`<ui-text variant="body-md" color="muted">No blocker.</ui-text>`
      }
      <ui-flex direction="col" gap="1">
        <ui-text variant="body-md"><strong>Quote due</strong> ${d.deadlineText}</ui-text>
        <ui-text variant="body-md"
          ><strong>Vessel</strong>
          ${d.vessel}${d.port ? ` · ${d.port}` : ""}${d.eta ? ` · ETA ${formatDate(d.eta)}` : ""}</ui-text
        >
        ${d.customerRef ? html`<ui-text variant="body-md"><strong>Customer ref</strong> ${d.customerRef}</ui-text>` : nothing}
        ${d.value !== undefined ? html`<ui-text variant="body-md"><strong>Value</strong> USD ${d.value.toLocaleString("en-US")}</ui-text>` : nothing}
      </ui-flex>
    </ui-card>`;
  }

  private _person(p: CaseOverview["owner"], role: string) {
    return p
      ? html`<ui-flex gap="3" align="center">
          <ui-avatar size="xs" .initials=${p.initials || p.name.slice(0, 2)}></ui-avatar>
          <ui-flex direction="col" gap="0">
            <ui-text variant="title-sm">${p.name}</ui-text>
            <ui-text variant="body-sm" color="muted">${role}</ui-text>
          </ui-flex>
        </ui-flex>`
      : html`<ui-text variant="body-md" color="muted">No ${role.toLowerCase()} set</ui-text>`;
  }

  private _owner(d: CaseOverview) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Owner & backup</span>
        ${
          d.canReassign
            ? html`<ui-button size="xs" variant="soft" color="primary" @click=${() => this._openReassign()}
                >Reassign</ui-button
              >`
            : nothing
        }
      </ui-flex>
      ${this._person(d.owner, "Owner")} ${this._person(d.backup, "Backup")}
      ${
        d.handoverNote
          ? html`<ui-collapse heading="Last handover note" icon="arrow">
              <ui-text variant="body-md">${d.handoverNote}</ui-text>
            </ui-collapse>`
          : nothing
      }
    </ui-card>`;
  }

  private _contactRule(d: CaseOverview) {
    const c = d.customer;
    return html`<ui-card variant="border" shadow="false" heading="Customer contact rule">
      <ui-text variant="title-sm">${c.name}</ui-text>
      <ui-badge
        size="md"
        variant="soft"
        .color=${c.strict ? "error" : c.contactRule === "one-follow-up" ? "warning" : "success"}
        >${c.contactRuleLabel}</ui-badge
      >
      <ui-text variant="body-sm" color="muted"
        >${
          c.strict
            ? "Follow-ups for this customer are internal reminders only — the system refuses customer-facing chasers."
            : c.contactRule === "one-follow-up"
              ? "One customer follow-up per quotation; after that, internal reminders only."
              : "Follow-ups allowed, drafted for a person to send."
        }</ui-text
      >
    </ui-card>`;
  }

  private _tasks(d: CaseOverview) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center">
        Open tasks <ui-badge size="sm" variant="soft">${d.tasks.length}</ui-badge>
      </ui-flex>
      ${
        d.tasks.length
          ? d.tasks.map(
              (t) =>
                html`<ui-flex direction="col" gap="0">
                  <ui-link variant="hover" .href=${`/collections/tasks/${t.id}`}
                    ><ui-text variant="label-lg">${t.title}</ui-text></ui-link
                  >
                  <ui-text variant="body-sm" color="muted"
                    >${[
                      t.channel,
                      t.owner,
                      t.due ? formatDate(t.due) : "",
                      t.rule ? `rule: ${t.rule}` : "",
                      t.stop ? `stops on: ${t.stop}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}</ui-text
                  >
                </ui-flex>`,
            )
          : html`<ui-text variant="body-md" color="muted">Nothing open.</ui-text>`
      }
    </ui-card>`;
  }

  private _clarifications(d: CaseOverview) {
    const open = d.clarifications.filter((q) => q.open).length;
    const columns: TableColumn<Clarification & Record<string, unknown>>[] = [
      {
        key: "lineNo",
        label: "Line",
        render: (q) => html`<ui-text variant="title-sm">${q.lineNo ?? "All"}</ui-text>`,
      },
      {
        key: "to",
        label: "To · via",
        render: (q) =>
          html`<ui-flex direction="col" gap="0">
            <ui-badge size="sm" variant="outline">${q.to}</ui-badge>
            <ui-text variant="body-sm" color="muted">${q.via}</ui-text>
          </ui-flex>`,
      },
      {
        key: "question",
        label: "Question",
        render: (q) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text variant="body-md">${q.question}</ui-text>
            <ui-text variant="body-sm" color="muted"
              >${q.askedBy}${q.askedAt ? ` · ${formatDate(q.askedAt)}` : ""}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "answer",
        label: "Answer",
        render: (q) =>
          q.open
            ? html`<ui-badge size="sm" variant="soft" color="warning">Waiting</ui-badge>`
            : html`<ui-flex direction="col" gap="0">
                <ui-text variant="body-md">${q.answer}</ui-text>
                ${q.answeredAt ? html`<ui-text variant="body-sm" color="muted">${formatDate(q.answeredAt)}</ui-text>` : nothing}
              </ui-flex>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap>
        Clarifications log
        <ui-badge size="sm" variant="soft" .color=${open ? "warning" : "success"}>${open} open</ui-badge>
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Questions and answers per line, to the customer, a supplier or internal. Clear lines keep moving while one
        waits.</ui-text
      >
      ${
        d.clarifications.length
          ? html`<ui-table
              size="sm"
              .columns=${columns}
              .rows=${d.clarifications as unknown as Record<string, unknown>[]}
            ></ui-table>`
          : html`<ui-text variant="body-md" color="muted">No clarifications on this case.</ui-text>`
      }
    </ui-card>`;
  }

  private _timeline(d: CaseOverview) {
    const entries = d.timeline.filter((t) => this.filter === "all" || t.kind === this.filter);
    const items: TimelineItem[] = entries.map((t) => {
      const k = KIND[t.kind];
      return {
        icon: html`<ui-icon .name=${k.icon} .color=${k.color} size="sm" .label=${k.label}></ui-icon>`,
        start: html`<ui-text variant="body-sm" color="muted">${formatDate(t.at)}</ui-text>`,
        end: html`<ui-flex direction="col" gap="1" padding="1">
          <ui-flex gap="2" align="center" wrap>
            <ui-badge size="xs" variant="soft" .color=${k.color}>${k.label}</ui-badge>
            <ui-text variant="body-sm" color="muted">${t.actor}</ui-text>
            ${t.rule ? html`<ui-badge size="xs" variant="outline">rule: ${t.rule}</ui-badge>` : nothing}
          </ui-flex>
          <ui-text variant="body-md">${t.text}</ui-text>
        </ui-flex>`,
        done: true,
      };
    });
    const counts = (k: TimelineEntry["kind"]) => d.timeline.filter((t) => t.kind === k).length;
    const tab = (key: typeof this.filter, label: string) =>
      html`<ui-button
        size="xs"
        .variant=${this.filter === key ? "soft" : "ghost"}
        .color=${this.filter === key ? "primary" : undefined}
        @click=${() => (this.filter = key)}
        >${label}</ui-button
      >`;
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" wrap full-width>
        <span>Activity timeline — audit trail</span>
        <ui-flex gap="1" wrap>
          ${tab("all", `All ${d.timeline.length}`)} ${tab("auto", `Automatic ${counts("auto")}`)}
          ${tab("human", `Human ${counts("human")}`)} ${tab("alert", `Alerts ${counts("alert")}`)}
        </ui-flex>
      </ui-flex>
      <ui-text variant="body-sm" color="muted"
        >Every automatic step names the rule that fired; every human step names the person. Nothing is edited after the
        fact.</ui-text
      >
      <ui-ai-summary
        label="Catch me up on this case"
        context="The activity log of a ship-supply case at Golden Sea, from the customer's RFQ to payment. Say where it stands and what is blocking it."
        .text=${d.timeline.map((t) => `${formatDate(t.at)} · ${t.actor}: ${t.text}`).join("\n")}
      ></ui-ai-summary>
      ${
        items.length
          ? html`<ui-timeline direction="vertical" compact snap-icon .items=${items}></ui-timeline>`
          : html`<ui-text variant="body-md" color="muted">Nothing logged yet.</ui-text>`
      }
    </ui-card>`;
  }

  private _reassignModal(d: CaseOverview) {
    const options = d.team
      .filter((p) => p.id !== d.owner?.id)
      .map((p) => ({ label: `${p.name}${p.id === d.backup?.id ? " (backup)" : ""}`, value: p.id }));
    return html`<ui-modal
      heading=${`Reassign ${d.caseId}`}
      width="wide"
      .open=${this.reassignOpen}
      @ui-close=${() => (this.reassignOpen = false)}
    >
      <ui-flex direction="col" gap="4">
        <ui-text variant="body-md" color="muted"
          >The new owner gets the case, its open tasks and a notification. The handover note is logged on the
          timeline.</ui-text
        >
        <ui-select
          legend="Hand over to"
          placeholder="Choose a person"
          width="full"
          .options=${options}
          .value=${this.to}
          @change=${(e: Event) => {
            this.to = (e.target as HTMLSelectElement).value;
            this.draftMeta = null;
          }}
        ></ui-select>
        <ui-flex gap="2" align="center" wrap>
          <ui-button
            size="sm"
            variant="soft"
            color="primary"
            ?disabled=${this.drafting || !this.to}
            @click=${() => this._draft()}
          >
            <ui-icon name="sparkles" size="sm"></ui-icon> Draft handover with AI
          </ui-button>
          ${this.drafting ? html`<ui-loading size="sm" color="primary"></ui-loading><ui-text variant="body-md" color="muted">Reading the case, clarifications and tasks…</ui-text>` : nothing}
          ${
            this.draftMeta
              ? html`<ui-badge size="sm" variant="soft" color="accent">AI draft</ui-badge>
                  <ui-badge size="sm" variant="soft"
                    >${Math.round(this.draftMeta.confidence * 100)}% confidence</ui-badge
                  >
                  <ui-text variant="body-sm" color="muted">from ${this.draftMeta.sources.join(", ")}</ui-text>`
              : nothing
          }
        </ui-flex>
        <ui-textarea
          legend="Handover note"
          hint="Edit freely — nothing is saved until you confirm."
          width="full"
          .rows=${10}
          .value=${this.note}
          @input=${(e: Event) => (this.note = (e.target as HTMLTextAreaElement).value)}
        ></ui-textarea>
        <ui-ai-tools
          tools="formal shorter proofread"
          .value=${this.note}
          @ui-change=${(e: CustomEvent<{ value: string }>) => (this.note = e.detail.value)}
        ></ui-ai-tools>
      </ui-flex>
      <ui-flex slot="actions" gap="2">
        <ui-button variant="ghost" @click=${() => (this.reassignOpen = false)}>Cancel</ui-button>
        <ui-button
          color="primary"
          ?disabled=${this.saving || !this.to || !this.note.trim()}
          @click=${(e: Event) => {
            e.preventDefault();
            void this._reassign();
          }}
          >Confirm handover</ui-button
        >
      </ui-flex>
    </ui-modal>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const d = this.data;
    if (!d)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      ${this._lifecycle(d)}
      <ui-grid
        sidebar
        gap="6"
        .items=${[
          {
            role: "main",
            content: html`<ui-flex direction="col" gap="6">
              ${this._lines(d)} ${this._clarifications(d)} ${this._timeline(d)}
            </ui-flex>`,
          },
          {
            role: "side",
            content: html`<ui-flex direction="col" gap="6">
              ${this._next(d)} ${this._owner(d)} ${this._contactRule(d)} ${this._tasks(d)}
            </ui-flex>`,
          },
        ]}
      ></ui-grid>
      ${this._reassignModal(d)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-overview": GsCaseOverview;
  }
}
