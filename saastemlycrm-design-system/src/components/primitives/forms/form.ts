import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";

/**
 * Form: A native `<form>` around fields, so Enter submits and
 * `<ui-button type="submit">` works. Adds no styling.
 *
 * Purpose: Forms & input · Kind: primitive (Shippy, not daisyUI)
 *
 * Submitting doesn't navigate: `ui-submit` fires with the form's `FormData`
 * (fields with a `name`) and the native submit is prevented. Native
 * constraint validation (`required`, `pattern`…) runs first unless `novalidate`.
 */

/**
 * @example
 * <ui-form @ui-submit=${(e) => save(e.detail.data)}>
 *   <ui-text-input name="email" type="email" required></ui-text-input>
 *   <ui-button type="submit" color="primary">Save</ui-button>
 * </ui-form>
 */
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
