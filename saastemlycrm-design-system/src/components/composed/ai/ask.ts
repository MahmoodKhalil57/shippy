import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/index.ts";
import type { AskAnswer } from "../../base/ask-spec.ts";
import { m } from "../../../i18n/index.ts";

const READING_MS = 900;

@customElement("ui-ask")
export class UiAsk extends LightElement {
  @property({ attribute: false }) ask?: (question: string) => Promise<AskAnswer>;
  @property({ attribute: false }) suggestions: string[] = [];
  @property({ attribute: false }) loadSuggestions?: () => Promise<string[]>;
  @property() question = "";
  @property() name = m.ask_assistant();
  @property() placeholder = m.ask_placeholder();
  @property() intro = "";
  @property() reading = m.ask_reading_records();
  @property() footnote = "";
  @state() private turns: AskAnswer[] = [];
  @state() private asking = "";
  @state() private error = "";

  connectedCallback() {
    super.connectedCallback();
    void this.loadSuggestions?.().then((s) => (this.suggestions = s));
  }

  async send(q = this.question) {
    const question = q.trim();
    if (!question || this.asking || !this.ask) return;
    this.asking = question;
    this.error = "";
    this.question = "";
    try {
      const [answer] = await Promise.all([this.ask(question), new Promise((r) => setTimeout(r, READING_MS))]);
      this.turns = [...this.turns, answer];
    } catch (e) {
      this.error = (e as Error).message;
      this.question = question;
    } finally {
      this.asking = "";
    }
  }

  private _answer(a: AskAnswer) {
    return html`<ui-chat placement="end" color="primary" .author=${m.ask_you()}><bdi>${a.question}</bdi></ui-chat>
      <ui-chat .author=${this.name} .color=${a.refused ? "warning" : undefined}>
        <ui-flex direction="col" gap="2">
          <ui-text variant="label-lg">${a.answer}</ui-text>
          ${
            a.points.length
              ? html`<ui-flex direction="col" gap="1">
                  ${a.points.map((p) => html`<ui-text variant="body-md">· ${p}</ui-text>`)}
                </ui-flex>`
              : nothing
          }
          ${
            a.sources.length
              ? html`<ui-flex gap="1" wrap align="center">
                  <ui-text variant="body-sm" color="muted">${m.ask_sources()}</ui-text>
                  ${a.sources.map((s) => html`<ui-button size="xs" variant="tonal" .href=${s.href}>${s.label}</ui-button>`)}
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
                  ? html`<ui-chat placement="end" color="primary" .author=${m.ask_you()}>${this.asking}</ui-chat>
                      <ui-chat .author=${this.name}>
                        <ui-flex gap="2" align="center">
                          <ui-loading size="sm" .label=${m.ask_reading()}></ui-loading>
                          <ui-text variant="body-md">${this.reading}</ui-text>
                        </ui-flex>
                      </ui-chat>`
                  : nothing
              }
            </ui-flex>`
          : this.intro
            ? html`<ui-text variant="body-md" color="muted">${this.intro}</ui-text>`
            : nothing
      }
      ${this.error ? html`<ui-alert tone="error">${this.error}</ui-alert>` : nothing}
      <ui-flex gap="2" align="center" wrap>
        <ui-text-input
          width="fill"
          size="sm"
          autocomplete="off"
          aria-label=${m.ask_question()}
          .placeholder=${this.placeholder}
          .value=${this.question}
          @input=${(e: Event) => (this.question = (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") void this.send();
          }}
        ></ui-text-input>
        <ui-button size="xs" color="primary" ?disabled=${Boolean(this.asking)} @click=${() => void this.send()}
          ><ui-icon name="send" size="sm"></ui-icon>${m.ask_ask()}</ui-button
        >
      </ui-flex>
      ${
        this.suggestions.length
          ? html`<ui-flex gap="1" wrap>
              ${this.suggestions.map(
                (s) =>
                  html`<ui-button
                    size="xs"
                    variant="text"
                    ?disabled=${Boolean(this.asking)}
                    @click=${() => void this.send(s)}
                    >${s}</ui-button
                  >`,
              )}
            </ui-flex>`
          : nothing
      }
      ${this.footnote ? html`<ui-text variant="body-sm" color="muted">${this.footnote}</ui-text>` : nothing}
    </ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-ask": UiAsk;
  }
}
