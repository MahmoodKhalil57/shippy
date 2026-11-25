import { html } from "lit";
import { scrollRoom } from "../layout/algebra.ts";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { m } from "../../../i18n/index.ts";

export const suggestions = rcva("", {
  variants: {
    wrap: {
      true: "flex flex-row flex-wrap max-w-full gap-1.5",
      false: `${scrollRoom} min-w-0 max-w-full overflow-x-auto whitespace-nowrap overscroll-x-contain [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%-1rem),transparent)] rtl:[mask-image:linear-gradient(to_left,black_calc(100%-1rem),transparent)] [&>*+*]:ms-1`,
    },
  },
  defaultVariants: { wrap: false },
});
export const suggestion = rcva("font-normal");

@customElement("ui-suggestions")
export class UiSuggestions extends LightElement {
  @property({ attribute: false }) items: string[] = [];
  @property({ type: Boolean }) wrap = false;
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`<div class=${suggestions({ wrap: this.wrap })} role="group" aria-label=${m.suggestions_label()}>
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
