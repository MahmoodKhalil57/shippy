import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { api } from "../client.ts";
import type { CaseLine, RfqPlan } from "../endpoints/sourcing.ts";

/**
 * The supplier RFQ composer of a case's "Supplier RFQs" tab (src/cms/views/case-rfqs.ts): pick
 * lines, let the system choose suppliers and draft one anonymised RFQ each, preview, drop the
 * ones not wanted, then send after a confirmation. Actions: /api/sourcing/cases/:id/plan and
 * /send (../endpoints/sourcing.ts).
 */

const FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const at = (v: string) => (v ? FMT.format(new Date(v)) : "—");
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const say = (message: string, tone: "neutral" | "error" = "neutral") =>
  document.querySelector("ui-snackbar")?.push(message, { tone });

@customElement("gs-rfq-composer")
export class GsRfqComposer extends LightElement {
  /** The case document's id. */
  @property() caseDoc = "";
  @property() mode: "split" | "full" = "split";
  @property({ attribute: false }) lines: CaseLine[] = [];

  @state() private chosen: number[] | null = null;
  @state() private plan: RfqPlan | null = null;
  @state() private previewAt = 0;
  @state() private confirming = false;
  @state() private busy = "";

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("mode") || changed.has("caseDoc")) this.plan = null;
  }

  private get base() {
    return `/sourcing/cases/${encodeURIComponent(this.caseDoc)}`;
  }

  /** Lines picked for the next RFQs: by default, those not yet asked of anyone. */
  private get picked(): number[] {
    if (this.chosen) return this.chosen;
    const sendable = this.lines.filter((l) => !l.held);
    const fresh = sendable.filter((l) => !l.rfqs.length && !l.offers);
    return (fresh.length ? fresh : sendable).map((l) => l.lineNo);
  }

  private toggle(n: number, on: boolean) {
    const set = new Set(this.picked);
    if (on) set.add(n);
    else set.delete(n);
    this.chosen = [...set].sort((a, b) => a - b);
    this.plan = null;
  }

  private async draft() {
    this.busy = "plan";
    try {
      const [plan] = await Promise.all([
        api.post<RfqPlan>(`${this.base}/plan`, { mode: this.mode, lineNos: this.picked }),
        wait(500),
      ]);
      this.plan = plan;
      this.previewAt = 0;
      if (!plan.drafts.length) say("Nothing new to send — every picked line was already asked of these suppliers");
    } catch (e) {
      say((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private drop(i: number) {
    if (!this.plan) return;
    const drafts = this.plan.drafts.filter((_, j) => j !== i);
    this.plan = { ...this.plan, drafts };
    this.previewAt = Math.min(this.previewAt, Math.max(0, drafts.length - 1));
  }

  private async send() {
    const plan = this.plan;
    this.confirming = false;
    if (!plan) return;
    this.busy = "send";
    try {
      const r = await api.post<{ sent: { reference: string }[] }>(`${this.base}/send`, {
        mode: plan.mode,
        dueAt: plan.dueAt,
        drafts: plan.drafts.map((d) => ({ supplier: d.supplier, lineNos: d.lineNos, category: d.category })),
      });
      say(
        `${r.sent.length} supplier RFQ${r.sent.length === 1 ? "" : "s"} sent — replies will be matched automatically`,
      );
      this.plan = null;
      this.chosen = null;
      this.dispatchEvent(new CustomEvent("app-view-reload", { bubbles: true }));
    } catch (e) {
      say((e as Error).message, "error");
    } finally {
      this.busy = "";
    }
  }

  private planned(plan: RfqPlan) {
    const preview = plan.drafts[this.previewAt];
    return html`<ui-divider></ui-divider>
      ${plan.held.length ? html`<ui-alert tone="warning">Held back until clarified: ${plan.held.map((h) => `L${h.lineNo} (${h.reason})`).join(" · ")}</ui-alert>` : nothing}
      ${plan.skipped.length ? html`<ui-text variant="body-sm" color="muted">Skipped (already asked): ${plan.skipped.join(" · ")}</ui-text>` : nothing}
      <ui-list>
        ${plan.drafts.map(
          (r, i) =>
            html`<ui-list-item
              .headline=${`${r.supplierName} · ${r.reference}`}
              .supporting=${`${r.category} · L${r.lineNos.join(", L")} · ${r.note}`}
            >
              <ui-flex slot="trailing" gap="1" align="center">
                <ui-tag>Draft</ui-tag>
                <ui-button
                  size="xs"
                  variant="text"
                  toggle
                  ?selected=${i === this.previewAt}
                  @click=${() => (this.previewAt = i)}
                  >Preview</ui-button
                >
                <ui-button size="xs" variant="text" @click=${() => this.drop(i)}>Remove</ui-button>
              </ui-flex>
            </ui-list-item>`,
        )}
      </ui-list>
      ${
        preview
          ? html`<ui-flex gap="1" wrap>
                <ui-tag tone="success" icon="success">Client name removed</ui-tag>
                <ui-tag tone="success" icon="success">Vessel removed</ui-tag>
                <ui-tag tone="success" icon="success">No customer files</ui-tag>
                <ui-tag tone="success" icon="success">Our reference only</ui-tag>
              </ui-flex>
              <ui-mockup-window variant="bordered">
                <ui-flex direction="col" gap="2" padding="4">
                  <ui-text variant="body-sm" color="muted"><strong>To</strong> ${preview.preview.to}</ui-text>
                  <ui-text variant="title-sm">${preview.preview.subject}</ui-text>
                  <ui-divider></ui-divider>
                  <ui-ai-text .text=${preview.preview.body} translatable></ui-ai-text>
                </ui-flex>
              </ui-mockup-window>`
          : nothing
      }
      <ui-flex justify="end" gap="2" wrap>
        <ui-button size="xs" variant="text" @click=${() => (this.plan = null)}>Discard drafts</ui-button>
        <ui-button
          size="xs"
          color="primary"
          ?disabled=${!plan.drafts.length || this.busy === "send"}
          @click=${() => (this.confirming = true)}
          ><ui-icon name="send" size="sm"></ui-icon>Send RFQs</ui-button
        >
      </ui-flex>
      <ui-modal
        heading="Send these supplier RFQs?"
        .open=${this.confirming}
        @ui-close=${() => (this.confirming = false)}
      >
        <ui-flex direction="col" gap="2">
          <ui-text variant="body-md"
            >${plan.drafts.length} RFQ${plan.drafts.length === 1 ? "" : "s"} to
            ${plan.drafts.map((r) => r.supplierName).join(", ")} — reply by ${at(plan.dueAt)}.</ui-text
          >
          <ui-text variant="body-md"
            >The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a
            supplier answers, and the case owner is alerted after the second.</ui-text
          >
        </ui-flex>
        <ui-button slot="actions" variant="text" @click=${() => (this.confirming = false)}>Cancel</ui-button>
        <ui-button slot="actions" color="primary" @click=${() => this.send()}>Send RFQs</ui-button>
      </ui-modal>`;
  }

  render() {
    const picked = new Set(this.picked);
    return html`<ui-flex direction="col" gap="4">
      <ui-grid fit="sm" gap="2">
        ${this.lines.map(
          (l) =>
            html`<ui-checkbox
              size="sm"
              .checked=${picked.has(l.lineNo)}
              ?disabled=${Boolean(l.held)}
              .label=${html`<ui-flex direction="col" gap="0">
                <ui-text variant="body-md">L${l.lineNo} · ${l.description}</ui-text>
                <ui-text variant="body-sm" .color=${l.held ? "warning" : "muted"}
                  >${l.qty} ${l.unit} ·
                  ${l.category}${l.held ? ` · held: ${l.held}` : l.rfqs.length ? ` · asked: ${l.rfqs.join(", ")}` : ""}${l.offers ? ` · ${l.offers} offer${l.offers > 1 ? "s" : ""}` : ""}</ui-text
                >
              </ui-flex>`}
              @change=${(e: Event) => this.toggle(l.lineNo, (e.target as HTMLInputElement).checked)}
            ></ui-checkbox>`,
        )}
      </ui-grid>
      <ui-flex gap="2" wrap>
        <ui-button
          size="xs"
          variant="tonal"
          ?disabled=${!picked.size || this.busy === "plan"}
          @click=${() => this.draft()}
          ><ui-icon name="sparkles" size="sm"></ui-icon
          >${this.busy === "plan" ? "Choosing suppliers…" : "Draft RFQs"}</ui-button
        >
      </ui-flex>
      ${this.plan ? this.planned(this.plan) : nothing}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-rfq-composer": GsRfqComposer;
  }
}
