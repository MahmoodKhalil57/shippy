import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { api } from "../../../cms/client.ts";
import type { Answer } from "../../../cms/endpoints/assistant.ts";
import { LightElement } from "../../../components/base/light-element.ts";
import "../../../components/index.ts";

/**
 * "Ask Golden Sea": the assistant as a small chat panel. Questions go to POST /api/ask, which
 * answers from the live records (cases, approvals, invoices, suppliers, pipeline) and cites the
 * ones it used; each citation links to its record. Sales gets no cost or margin answers.
 *
 * Self-contained so any screen can embed it: `<gs-ask></gs-ask>` (optionally `.question` to
 * pre-fill the box, `compact` to hide the suggestions once a conversation has started).
 */

/** How long the visible "reading…" state lasts at least, so the AI step reads as one. */
const READING_MS = 900;

@customElement("gs-ask")
export class GsAsk extends LightElement {
  /** Pre-filled question. */
  @property() question = "What's the status of Aurora Crest?";
  @state() private turns: Answer[] = [];
  @state() private suggestions: string[] = [];
  @state() private asking = "";
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    void api
      .get<{ suggestions: string[] }>("/ask/suggestions")
      .then((r) => (this.suggestions = r.suggestions))
      .catch(() => {});
  }

  /** Asks `q` (or what's typed), shows the reading state, then the cited answer. */
  async ask(q = this.question) {
    const question = q.trim();
    if (!question || this.asking) return;
    this.asking = question;
    this.error = "";
    this.question = "";
    try {
      const [answer] = await Promise.all([
        api.post<Answer>("/ask", { question }),
        new Promise((r) => setTimeout(r, READING_MS)),
      ]);
      this.turns = [...this.turns, answer];
    } catch (e) {
      this.error = (e as Error).message;
      this.question = question;
    } finally {
      this.asking = "";
    }
  }

  private _answer(a: Answer) {
    return html`<ui-chat placement="end" color="primary" author="You">${a.question}</ui-chat>
      <ui-chat author="Golden Sea assistant" .color=${a.refused ? "warning" : undefined}>
        <ui-flex direction="col" gap="2">
          <ui-text size="sm" weight="medium">${a.answer}</ui-text>
          ${
            a.points.length
              ? html`<ui-flex direction="col" gap="1">
                  ${a.points.map((p) => html`<ui-text size="sm">· ${p}</ui-text>`)}
                </ui-flex>`
              : nothing
          }
          ${
            a.sources.length
              ? html`<ui-flex gap="1" wrap align="center">
                  <ui-text size="xs" color="muted">Sources:</ui-text>
                  ${a.sources.map(
                    (s) => html`<ui-button size="xs" variant="soft" .href=${s.href}>${s.label}</ui-button>`,
                  )}
                </ui-flex>`
              : nothing
          }
        </ui-flex>
      </ui-chat>`;
  }

  render() {
    return html`<ui-flex direction="col" gap="3">
      ${
        this.turns.length || this.asking
          ? html`<ui-flex direction="col" gap="1">
              ${this.turns.map((t) => this._answer(t))}
              ${
                this.asking
                  ? html`<ui-chat placement="end" color="primary" author="You">${this.asking}</ui-chat>
                      <ui-chat author="Golden Sea assistant">
                        <ui-flex gap="2" align="center">
                          <ui-loading variant="dots" size="sm" label="Reading"></ui-loading>
                          <ui-text size="sm">Reading cases, approvals, invoices and suppliers…</ui-text>
                        </ui-flex>
                      </ui-chat>`
                  : nothing
              }
            </ui-flex>`
          : html`<ui-text size="sm" color="muted"
              >Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth
              pipeline. Answers come from the live records and link to them.</ui-text
            >`
      }
      ${this.error ? html`<ui-alert color="error" variant="soft">${this.error}</ui-alert>` : nothing}
      <ui-flex gap="2" align="center" wrap>
        <ui-text-input
          width="fill"
          size="sm"
          icon="search"
          autocomplete="off"
          placeholder="Ask Golden Sea…"
          .value=${this.question}
          @input=${(e: Event) => (this.question = (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") void this.ask();
          }}
        ></ui-text-input>
        <ui-button size="sm" color="primary" ?disabled=${Boolean(this.asking)} @click=${() => void this.ask()}
          ><ui-icon name="send" size="sm"></ui-icon>Ask</ui-button
        >
      </ui-flex>
      ${
        this.suggestions.length
          ? html`<ui-flex gap="1" wrap>
              ${this.suggestions.map(
                (s) =>
                  html`<ui-button
                    size="xs"
                    variant="ghost"
                    ?disabled=${Boolean(this.asking)}
                    @click=${() => void this.ask(s)}
                    >${s}</ui-button
                  >`,
              )}
            </ui-flex>`
          : nothing
      }
      <ui-text size="xs" color="muted">The assistant reads and answers; it never sends, prices or pays.</ui-text>
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gs-ask": GsAsk;
  }
}
