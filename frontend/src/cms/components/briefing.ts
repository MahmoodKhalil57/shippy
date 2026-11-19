import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { LightElement } from "../../components/base/light-element.ts";
import "../../components/index.ts";
import { api } from "../client.ts";
import type { Briefing } from "../endpoints/assistant.ts";

/**
 * The control room's "07:00 · daily AI briefing" card (GET /api/briefing). "Summarise" re-reads
 * the live records (`?refresh=1`) with a short visible reading step, and the briefing can be read
 * aloud. A draft to read: nothing is sent, priced or paid. Placed with
 * `block("custom", { element: "gs-briefing" })`.
 */

/** The "reading" pause before a refreshed summary appears. */
const READING_MS = 1000;

@customElement("gs-briefing")
export class GsBriefing extends LightElement {
  @state() private brief: Briefing | null = null;
  @state() private summarising = false;
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.brief) void this.load();
  }

  private async load(refresh = false) {
    try {
      if (refresh) this.summarising = true;
      const [b] = await Promise.all([
        api.get<Briefing>("/briefing", refresh ? { refresh: 1 } : undefined),
        new Promise((r) => setTimeout(r, refresh ? READING_MS : 0)),
      ]);
      this.brief = b;
      this.error = "";
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.summarising = false;
    }
  }

  render() {
    const b = this.brief;
    return html`<ui-card>
      <span slot="heading">07:00 · daily AI briefing</span>
      <ui-flex slot="trailing" gap="2" align="center" wrap
        ><ui-tag tone="primary" icon="sparkles">AI draft</ui-tag
        ><ui-speak
          .text=${b && !this.summarising ? [b.greeting, ...b.items.map((i) => i.text)].join(". ") : ""}
        ></ui-speak
        ><ui-button size="xs" variant="tonal" ?disabled=${this.summarising} @click=${() => void this.load(true)}
          ><ui-icon name="sparkles" size="sm"></ui-icon>Summarise</ui-button
        ></ui-flex
      >
      ${
        this.error
          ? html`<ui-alert tone="error">${this.error}</ui-alert>`
          : !b || this.summarising
            ? html`<ui-flex gap="2" align="center" padding="4">
                <ui-loading size="sm" label="Reading"></ui-loading>
                <ui-text variant="body-md" color="muted"
                  >Reading cases, approvals, supplier replies, invoices and FX…</ui-text
                >
              </ui-flex>`
            : html`<ui-flex direction="col" gap="3">
                <ui-text emphasized>${b.greeting}</ui-text>
                ${b.items.map(
                  (i) =>
                    html`<ui-flex gap="3" align="start">
                      <ui-badge dot .tone=${i.tone} .label=${i.tone}></ui-badge>
                      <ui-flex direction="col" gap="1" grow shrink>
                        <ui-text variant="body-md">${i.text}</ui-text>
                        <ui-flex gap="1" wrap>
                          ${i.sources.map(
                            (s) => html`<ui-button size="xs" variant="text" .href=${s.href}>${s.label}</ui-button>`,
                          )}
                        </ui-flex>
                      </ui-flex>
                    </ui-flex>`,
                )}
                <ui-text variant="body-sm" color="muted"
                  >${b.at === "07:00" ? "Written at 07:00" : `Summarised again at ${b.at}`} from ${b.read} live records.
                  A draft to read — nothing is sent, priced or paid.</ui-text
                >
              </ui-flex>`
      }
    </ui-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-briefing": GsBriefing;
  }
}
