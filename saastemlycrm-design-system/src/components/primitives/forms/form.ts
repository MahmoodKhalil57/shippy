import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";

@customElement("ui-form")
export class UiForm extends LightElement {
  @property({ type: Boolean }) novalidate = false;
  @property() label?: string;

  render() {
    return html`<form
      ?novalidate=${this.novalidate}
      aria-label=${ifDefined(this.label)}
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        this.dispatchEvent(
          new CustomEvent("ui-submit", { detail: { data: new FormData(form), submitter: e.submitter }, bubbles: true }),
        );
      }}
    >
      ${this.content}
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-form": UiForm;
  }
}
