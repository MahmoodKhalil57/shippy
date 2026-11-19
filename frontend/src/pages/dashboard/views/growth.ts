import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type {
  CampaignRow,
  Deal,
  FleetVessel,
  Growth,
  NextStep,
  Registration,
} from "../../../cms/endpoints/growth-crm.ts";
import type { Doc } from "../../../cms/types.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import type { TableColumn } from "../../../components/primitives/data/table.ts";
import "../../../components/index.ts";
import { toast } from "../shared.ts";
import type { Access } from "../app.ts";

/**
 * The growth board (/growth): the growth CRM, kept apart from operational RFQs — prospects by
 * stage, the sales next steps with "what to say" and "Record outcome", fleets per ship manager
 * (vessels with IMO), vendor registrations and campaigns. Data: GET /api/growth; recording an
 * outcome: POST /api/growth/:id/outcome (src/cms/endpoints/growth-crm.ts).
 */

interface Draft {
  step: NextStep;
  result: string;
  note: string;
  nextStep: string;
  nextStepDue: string;
  stage: string;
}

const CHANNEL_ICON: Record<string, "phone" | "mail" | "chat" | "compass" | "users"> = {
  Call: "phone",
  Email: "mail",
  WhatsApp: "chat",
  "Site visit": "compass",
  Meeting: "users",
};
const DOC_COLOR: Record<string, "success" | "info" | "warning" | "error"> = {
  Submitted: "success",
  Ready: "info",
  Missing: "warning",
  Expired: "error",
};

/** A week after the demo's "today", as a date input value. */
const inAWeek = () => "2026-11-24";

@customElement("gs-growth")
export class GsGrowth extends LightElement {
  @property({ attribute: false }) access?: Access;
  @property({ attribute: false }) user?: Doc & { collection: string };
  @state() private g: Growth | null = null;
  @state() private error = "";
  @state() private draft: Draft | null = null;
  @state() private busy = false;

  connectedCallback() {
    super.connectedCallback();
    void this._load();
  }

  private async _load() {
    try {
      this.g = await api.get<Growth>("/growth");
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private _open(step: NextStep) {
    this.draft = {
      step,
      result: step.noNext ? "Sent" : "Reached — positive",
      note: "",
      nextStep: "",
      nextStepDue: inAWeek(),
      stage: step.stage,
    };
  }

  private _set(patch: Partial<Draft>) {
    if (this.draft) this.draft = { ...this.draft, ...patch };
  }

  private async _save() {
    const d = this.draft;
    if (!d) return;
    this.busy = true;
    try {
      this.g = await api.post<Growth>(`/growth/${encodeURIComponent(d.step.id)}/outcome`, {
        result: d.result,
        note: d.note,
        nextStep: d.nextStep,
        nextStepDue: d.nextStepDue,
        stage: d.stage,
      });
      toast(
        d.nextStep
          ? `Outcome saved — next step “${d.nextStep}” planned for ${new Date(d.nextStepDue).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          : `Outcome saved — ${d.step.company} is now “${d.stage}”`,
      );
      this.draft = null;
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      this.busy = false;
    }
  }

  /* ---------------------------------------------------------------- sections */

  private _tile(label: string, value: number, note: string, color?: "error" | "warning") {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" color="muted" truncate>${label}</ui-text>
        <ui-text size="3xl" weight="semibold" leading="tight" .color=${value ? color : undefined}>${value}</ui-text>
        <ui-text size="xs" color="muted" clamp="2">${note}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _deal(d: Deal) {
    return html`<ui-card variant="border" size="xs" shadow="false" .href=${d.href}>
      <ui-flex direction="col" gap="1">
        <ui-text size="sm" weight="semibold">${d.name}</ui-text>
        <ui-text size="xs" color="muted">${d.kind}</ui-text>
        ${
          d.noNext
            ? html`<ui-text size="xs" color="error">⚑ No next step — plan one or close</ui-text>`
            : d.next
              ? html`<ui-text size="xs" .color=${d.overdue ? "error" : undefined}
                  >Next: ${d.next}${d.due ? ` · ${d.due}` : ""}</ui-text
                >`
              : nothing
        }
        <ui-text size="xs" color="muted">${[d.value, d.owner, d.source].filter(Boolean).join(" · ")}</ui-text>
      </ui-flex>
    </ui-card>`;
  }

  private _board(g: Growth) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Prospects by stage</span>
        <ui-button size="xs" variant="ghost" href="/collections/opportunities">All opportunities</ui-button>
      </ui-flex>
      <ui-text size="xs" color="muted"
        >Introduced → registration submitted → approved vendor → first RFQ → active account. Every open opportunity has
        a next step, or it's flagged.</ui-text
      >
      <ui-grid fit="xs" gap="4">
        ${g.columns.map(
          (c) =>
            html`<ui-flex direction="col" gap="2">
              <ui-flex justify="between" align="center" gap="2">
                <ui-text size="sm" weight="semibold">${c.stage}</ui-text>
                <ui-badge size="sm" variant="soft">${c.deals.length}</ui-badge>
              </ui-flex>
              ${c.deals.length ? c.deals.map((d) => this._deal(d)) : html`<ui-text size="xs" color="muted">—</ui-text>`}
            </ui-flex>`,
        )}
      </ui-grid>
    </ui-card>`;
  }

  private _step(s: NextStep) {
    return html`<ui-card variant="border" size="sm" shadow="false">
      <ui-flex direction="col" gap="2">
        <ui-flex gap="2" align="center" wrap>
          <ui-badge
            size="sm"
            variant="soft"
            color="info"
            .icon=${html`<ui-icon .name=${CHANNEL_ICON[s.channel] ?? "phone"} size="xs"></ui-icon>`}
            >${s.channel}</ui-badge
          >
          ${
            s.noNext
              ? html`<ui-badge size="sm" variant="soft" color="error">No next step</ui-badge>`
              : html`<ui-badge size="sm" variant="soft" .color=${s.overdue ? "error" : "neutral"}
                  >${s.overdue ? `Overdue · ${s.due}` : s.due}</ui-badge
                >`
          }
          <ui-text size="xs" color="muted">${s.owner}</ui-text>
        </ui-flex>
        <ui-flex direction="col" gap="0">
          <ui-link variant="hover" .href=${s.href}><ui-text weight="semibold">${s.company}</ui-text></ui-link>
          <ui-text size="xs" color="muted">${[s.who, s.stage].filter(Boolean).join(" · ")}</ui-text>
        </ui-flex>
        <ui-text size="sm">${s.goal || "Plan the next step, or close the opportunity."}</ui-text>
        ${
          s.script
            ? html`<ui-flex direction="col" gap="1">
                <ui-text size="xs" color="muted" weight="medium" uppercase>What to say</ui-text>
                <ui-text size="sm" italic>${s.script}</ui-text>
              </ui-flex>`
            : nothing
        }
        ${
          s.last
            ? html`<ui-text size="xs" color="muted"
                >Last: ${s.last.result}${s.last.note ? ` — ${s.last.note}` : ""}
                (${s.last.by}${s.last.at ? `, ${s.last.at}` : ""})</ui-text
              >`
            : nothing
        }
        <ui-flex gap="2" wrap>
          <ui-button size="xs" color="primary" @click=${() => this._open(s)}
            >${s.noNext ? "Plan next step" : "Record outcome"}</ui-button
          >
        </ui-flex>
      </ui-flex>
    </ui-card>`;
  }

  private _steps(g: Growth) {
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" gap="2" align="center" wrap
        >Sales next steps<ui-badge size="sm" variant="soft">${g.steps.length}</ui-badge></ui-flex
      >
      <ui-text size="xs" color="muted"
        >Each step has a channel, a date and what to say. Call or message yourself, then record what happened — the next
        step lands on the owner's follow-ups.</ui-text
      >
      <ui-grid fit="sm" gap="4">${g.steps.map((s) => this._step(s))}</ui-grid>
    </ui-card>`;
  }

  private _fleets(g: Growth) {
    type Row = FleetVessel & Record<string, unknown>;
    const columns: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Vessel",
        render: (v) =>
          v.href
            ? html`<ui-link variant="hover" .href=${v.href}><ui-text size="sm">${v.name}</ui-text></ui-link>`
            : html`<ui-text size="sm">${v.name}</ui-text>`,
      },
      { key: "imo", label: "IMO", render: (v) => html`<ui-text size="sm" mono>${v.imo || "—"}</ui-text>` },
      { key: "type", label: "Type", render: (v) => html`<ui-text size="sm">${v.type || "—"}</ui-text>` },
      {
        key: "supplied",
        label: "",
        render: (v) =>
          html`<ui-badge size="sm" variant="soft" .color=${v.supplied ? "success" : "neutral"}
            >${v.supplied ? "Supplied" : "Not yet"}</ui-badge
          >`,
      },
    ];
    const groups = g.fleets.map((f) => ({
      label: html`<ui-flex gap="2" align="center" wrap>
        <ui-link variant="hover" .href=${f.href}><ui-text size="sm" weight="semibold">${f.company}</ui-text></ui-link>
        <ui-badge size="xs" variant="soft" .color=${f.tone}>${f.relation}</ui-badge>
        <ui-text size="xs" color="muted"
          >${f.vessels.length} of ${f.fleetSize} vessels on file · ${f.vessels.filter((v) => v.supplied).length}
          supplied</ui-text
        >
      </ui-flex>`,
      rows: f.vessels as Row[],
    }));
    return html`<ui-card variant="border" shadow="false" heading="Fleets per ship manager">
      <ui-text size="xs" color="muted"
        >Vessels with IMO for customers and prospects — the room to grow is every vessel we don't supply yet.</ui-text
      >
      <ui-table size="sm" .columns=${columns} .groups=${groups}></ui-table>
    </ui-card>`;
  }

  private _registrations(g: Growth) {
    type Row = Registration & Record<string, unknown>;
    const columns: TableColumn<Row>[] = [
      {
        key: "company",
        label: "Company",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            <ui-link variant="hover" .href=${r.href}><ui-text size="sm" weight="medium">${r.company}</ui-text></ui-link>
            <ui-text size="xs" color="muted">${r.portal}</ui-text>
          </ui-flex>`,
      },
      {
        key: "status",
        label: "Status",
        render: (r) => html`<ui-badge size="sm" variant="soft" .color=${r.tone}>${r.status}</ui-badge>`,
      },
      {
        key: "dates",
        label: "Dates",
        render: (r) =>
          html`<ui-flex direction="col" gap="0">
            ${r.submitted ? html`<ui-text size="xs">Submitted ${r.submitted}</ui-text>` : nothing}
            ${r.committee ? html`<ui-text size="xs" weight="medium">Committee ${r.committee}</ui-text>` : nothing}
            ${r.renewBy ? html`<ui-text size="xs" color="muted">Renew by ${r.renewBy}</ui-text>` : nothing}
            ${!r.submitted && !r.committee && !r.renewBy ? html`<ui-text size="xs" color="muted">—</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "documents",
        label: "Documents",
        render: (r) =>
          html`<ui-flex gap="1" wrap>
            ${r.documents.map(
              (d) =>
                html`<ui-badge size="xs" variant="soft" .color=${DOC_COLOR[d.status] ?? "neutral"}
                  >${d.name}${d.status === "Missing" ? " — missing" : ""}</ui-badge
                >`,
            )}
          </ui-flex>`,
      },
      { key: "next", label: "Next", render: (r) => html`<ui-text size="xs">${r.next || "—"}</ui-text>` },
    ];
    return html`<ui-card variant="border" shadow="false">
      <ui-flex slot="heading" justify="between" align="center" gap="2" full-width wrap>
        <span>Vendor registrations</span>
        <ui-button size="xs" variant="ghost" href="/collections/vendor-registrations">All registrations</ui-button>
      </ui-flex>
      <ui-text size="xs" color="muted">Applications to become an approved supplier of a ship manager or owner.</ui-text>
      <ui-table size="sm" .columns=${columns} .rows=${g.registrations as Row[]}></ui-table>
      <ui-ai-extract
        source="file"
        label="Read a registration document"
        what="company registration document (commercial register, tax card or vendor certificate)"
        .fields=${[
          { id: "company", label: "Company" },
          { id: "registration", label: "Commercial register no." },
          { id: "tax", label: "Tax card no." },
          { id: "issued", label: "Issued" },
          { id: "expires", label: "Expires", hint: "the expiry or renewal date" },
        ]}
      ></ui-ai-extract>
    </ui-card>`;
  }

  private _campaigns(g: Growth) {
    type Row = CampaignRow & Record<string, unknown>;
    const columns: TableColumn<Row>[] = [
      {
        key: "name",
        label: "Campaign",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-link variant="hover" .href=${c.href}><ui-text size="sm" weight="medium">${c.name}</ui-text></ui-link>
            <ui-text size="xs" color="muted"
              >${c.audience} · ${c.recipients} contacts${c.consentOnly ? " · consented only" : ""}</ui-text
            >
          </ui-flex>`,
      },
      {
        key: "content",
        label: "Content",
        render: (c) =>
          html`<ui-badge size="sm" variant="soft" .color=${c.content === "Approved" ? "success" : "warning"}
            >${c.content}</ui-badge
          >`,
      },
      {
        key: "status",
        label: "Status",
        render: (c) =>
          html`<ui-flex direction="col" gap="0">
            <ui-text size="sm">${c.status}</ui-text>
            ${c.scheduled ? html`<ui-text size="xs" color="muted">${c.scheduled}</ui-text>` : nothing}
          </ui-flex>`,
      },
      {
        key: "stats",
        label: "Results",
        render: (c) =>
          c.stats
            ? html`<ui-text size="xs"
                >${c.stats.sent} sent · ${c.stats.opened} opened · ${c.stats.replied} replied</ui-text
              >`
            : html`<ui-text size="xs" color="muted">—</ui-text>`,
      },
    ];
    return html`<ui-card variant="border" shadow="false" heading="Campaigns">
      <ui-text size="xs" color="muted"
        >Approved lists and content only.
        ${g.canSend ? "You can schedule and send." : "Only Karim Balbaa schedules or sends."}</ui-text
      >
      <ui-table size="sm" .columns=${columns} .rows=${g.campaigns as Row[]}></ui-table>
    </ui-card>`;
  }

  private _modal(g: Growth) {
    const d = this.draft;
    return html`<ui-modal
      heading=${d ? `${d.step.noNext ? "Plan next step" : "Record outcome"} — ${d.step.company}` : ""}
      .open=${Boolean(d)}
      @ui-close=${() => (this.draft = null)}
    >
      ${
        d
          ? html`<ui-flex direction="col" gap="3">
              ${d.step.goal ? html`<ui-text size="sm" color="muted">Step: ${d.step.goal} (${d.step.channel}, ${d.step.who || "—"})</ui-text>` : nothing}
              <ui-select
                legend="Outcome"
                size="sm"
                field-width="full"
                width="full"
                .options=${g.results}
                .value=${d.result}
                @change=${(e: Event) => this._set({ result: (e.target as HTMLSelectElement).value })}
              ></ui-select>
              <ui-textarea
                legend="What happened"
                size="sm"
                width="full"
                field-width="full"
                placeholder="Who said what — e.g. Registration committee meets 24 Nov; documents complete."
                .value=${d.note}
                @input=${(e: Event) => this._set({ note: (e.target as HTMLTextAreaElement).value })}
              ></ui-textarea>
              <ui-text-input
                legend="Next step"
                size="sm"
                width="full"
                field-width="full"
                placeholder="e.g. Call after the committee decision"
                .value=${d.nextStep}
                @input=${(e: Event) => this._set({ nextStep: (e.target as HTMLInputElement).value })}
              ></ui-text-input>
              <ui-flex gap="3" wrap>
                <ui-text-input
                  legend="Next step date"
                  type="date"
                  size="sm"
                  width="fill"
                  .value=${d.nextStepDue}
                  @input=${(e: Event) => this._set({ nextStepDue: (e.target as HTMLInputElement).value })}
                ></ui-text-input>
                <ui-select
                  legend="Stage"
                  size="sm"
                  .options=${[...g.stages, "Closed"]}
                  .value=${d.stage}
                  @change=${(e: Event) => this._set({ stage: (e.target as HTMLSelectElement).value })}
                ></ui-select>
              </ui-flex>
              <ui-text size="xs" color="muted"
                >Saved on the opportunity; the next step goes on the owner's follow-ups.</ui-text
              >
            </ui-flex>`
          : nothing
      }
      <ui-flex slot="actions" gap="2">
        <ui-button variant="ghost" @click=${() => (this.draft = null)}>Cancel</ui-button>
        <ui-button color="primary" ?disabled=${this.busy} @click=${() => void this._save()}>Save outcome</ui-button>
      </ui-flex>
    </ui-modal>`;
  }

  render() {
    if (this.error) return html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>`;
    const g = this.g;
    if (!g)
      return html`<ui-flex justify="center" padding="8"><ui-loading size="lg" color="primary"></ui-loading></ui-flex>`;
    return html`<ui-flex direction="col" gap="6">
      <ui-flex justify="between" align="end" gap="4" wrap>
        <ui-flex direction="col" gap="1" shrink>
          <ui-text size="xs" color="muted" weight="medium" uppercase>Growth</ui-text>
          <ui-heading level="1" size="page">Growth board</ui-heading>
          <ui-text color="muted"
            >Prospects, fleets, introductions and vendor registrations — kept apart from operational RFQs, and linked to
            the customer once business is won.</ui-text
          >
        </ui-flex>
        <ui-flex gap="2" wrap>
          <ui-button size="sm" variant="soft" href="/collections/campaigns">Campaigns</ui-button>
          <ui-button size="sm" color="primary" href="/collections/opportunities/create">Add opportunity</ui-button>
        </ui-flex>
      </ui-flex>
      <ui-grid fit="xs" gap="4">
        ${this._tile("Open opportunities", g.totals.open, "prospects to active accounts")}
        ${this._tile("Next steps this week", g.totals.dueThisWeek, "calls, emails and visits planned")}
        ${this._tile("No next step", g.totals.noNext, "plan one or close the opportunity", "error")}
        ${this._tile("Registrations in progress", g.totals.registrations, "waiting on documents or a committee", "warning")}
      </ui-grid>
      ${this._board(g)} ${this._steps(g)}
      <ui-grid fit="lg" gap="4">${this._fleets(g)} ${this._registrations(g)}</ui-grid>
      ${this._campaigns(g)} ${this._modal(g)}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-growth": GsGrowth;
  }
}
