import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";

/**
 * Suggestions: one-click prompts the person can send without typing.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Suggestion")
 *
 * One row that scrolls sideways when it doesn't fit, its edges fading where there's more
 * (`wrap` lets them wrap onto lines instead, e.g. in an empty state).
 */
export const suggestions = rcva("flex gap-1.5", {
  variants: {
    wrap: {
      true: "flex-wrap",
      false:
        "overflow-x-auto overscroll-x-contain [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-1rem),transparent)] px-4 -mx-4",
    },
  },
  defaultVariants: { wrap: false },
});
export const suggestion = rcva("shrink-0 font-normal");

/**
 * @example <ui-suggestions .items=${["What's waiting for me?", "Who owes us money?"]} @ui-select=${(e) => send(e.detail.value)}></ui-suggestions>
 */
@customElement("ui-suggestions")
export class UiSuggestions extends LightElement {
  @property({ attribute: false }) items: string[] = [];
  @property({ type: Boolean }) wrap = false;
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`<div class=${suggestions({ wrap: this.wrap })} role="group" aria-label="Suggestions">
      ${this.items.map(
        (value) =>
          html`<button
            type="button"
            class=${button({ variant: "tonal", size: "xs", class: suggestion() })}
            ?disabled=${this.disabled}
            @click=${() => this.dispatchEvent(new CustomEvent("ui-select", { detail: { value }, bubbles: true }))}
          >
            ${value}
          </button>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-suggestions": UiSuggestions;
  }
}
