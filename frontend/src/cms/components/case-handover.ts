import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { api } from "../client.ts";

/**
 * The "Reassign" button of a case's Owner & backup card (src/cms/views/case-overview.ts) and its
 * dialog: pick who takes over, let AI draft the handover note from the case (its clarifications,
 * open tasks and timeline), edit it, confirm. Nothing is saved until the person confirms.
 * Actions: /api/case-overview/:id/handover and /reassign (../endpoints/platform.ts).
 */

const say = (message: string, tone: "neutral" | "error" = "neutral") =>
  document.querySelector("ui-snackbar")?.push(message, { tone });

@customElement("gs-case-handover")
export class GsCaseHandover extends LightElement {
  /** The case document's id, and its human id (GS-RFQ-…). */
  @property() caseDoc = "";
  @property() caseId = "";
  /** Who can take over (everyone on the desk but the owner). */
  @property({ attribute: false }) options: { label: string; value: string }[] = [];
  /** Preselected: the backup. */
  @property() suggested = "";

  @state() private open = false;
  @state() private to = "";
  @state() private note = "";
  @state() private drafting = false;
  @state() private draftMeta: { confidence: number; sources: string[] } | null = null;
  @state() private saving = false;

  private get base() {
    return `/case-overview/${encodeURIComponent(this.caseDoc)}`;
  }

  private start() {
    this.to = this.suggested;
    this.note = "";
    this.draftMeta = null;
    this.open = true;
  }

  private async draft() {
    if (!this.to) return say("Pick who takes over first.");
    this.drafting = true;
    try {
      // The AI reads the case, its clarifications, open tasks and timeline (a short visible step).
      const [r] = await Promise.all([
        api.post<{ draft: string; confidence: number; sources: string[] }>(`${this.base}/handover`, { to: this.to }),
        new Promise((res) => setTimeout(res, 1000)),
      ]);
      this.note = r.draft;
      this.draftMeta = { confidence: r.confidence, sources: r.sources };
    } catch (e) {
      say((e as Error).message, "error");
    } finally {
      this.drafting = false;
    }
  }

  private async reassign() {
    const target = this.options.find((p) => p.value === this.to);
    if (!target || !this.note.trim()) return say("Choose the new owner and confirm a handover note.");
    this.saving = true;
    try {
      const r = await api.post<{ movedTasks: number; owner: { name: string } }>(`${this.base}/reassign`, {
        to: target.value,
        note: this.note,
      });
      say(
        `${this.caseId} handed over to ${r.owner.name}${r.movedTasks ? ` · ${r.movedTasks} open task${r.movedTasks === 1 ? "" : "s"} moved` : ""} · note logged on the timeline`,
      );
      this.open = false;
      this.dispatchEvent(new CustomEvent("app-view-reload", { bubbles: true }));
    } catch (e) {
      say((e as Error).message, "error");
    } finally {
      this.saving = false;
    }
  }

  render() {
    return html`<ui-flex gap="2">
        <ui-button size="xs" variant="tonal" color="primary" @click=${() => this.start()}>Reassign</ui-button>
      </ui-flex>
      <ui-modal
        heading=${`Reassign ${this.caseId}`}
        width="wide"
        .open=${this.open}
        @ui-close=${() => (this.open = false)}
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
            .options=${this.options}
            .value=${this.to}
            @change=${(e: Event) => {
              this.to = (e.target as HTMLSelectElement).value;
              this.draftMeta = null;
            }}
          ></ui-select>
          <ui-flex gap="2" align="center" wrap>
            <ui-button
              size="xs"
              variant="tonal"
              color="primary"
              ?disabled=${this.drafting || !this.to}
              @click=${() => this.draft()}
            >
              <ui-icon name="sparkles" size="sm"></ui-icon> Draft handover with AI
            </ui-button>
            ${this.drafting ? html`<ui-loading size="sm" color="primary"></ui-loading><ui-text variant="body-md" color="muted">Reading the case, clarifications and tasks…</ui-text>` : nothing}
            ${
              this.draftMeta
                ? html`<ui-tag tone="primary">AI draft</ui-tag>
                    <ui-tag>${Math.round(this.draftMeta.confidence * 100)}% confidence</ui-tag>
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
          <ui-button variant="text" @click=${() => (this.open = false)}>Cancel</ui-button>
          <ui-button
            color="primary"
            ?disabled=${this.saving || !this.to || !this.note.trim()}
            @click=${(e: Event) => {
              e.preventDefault();
              void this.reassign();
            }}
            >Confirm handover</ui-button
          >
        </ui-flex>
      </ui-modal>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-case-handover": GsCaseHandover;
  }
}
