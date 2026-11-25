import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fieldsetField, fieldsetLabel } from "./fieldset.ts";

export const switchControl = rcva("toggle toggle-primary", {
  variants: {
    size: { sm: "toggle-sm", md: "toggle-md" },
  },
  defaultVariants: { size: "md" },
});

export type SwitchVariants = VariantProps<typeof switchControl>;

@customElement("ui-switch")
export class UiSwitch extends LightElement {
  @property() size: SwitchVariants["size"];
  @property({ type: Boolean }) checked = false;
  @property() name?: string;
  @property({ type: Boolean }) disabled = false;
  @property() label: Renderable = "";
  @property({ attribute: "label-start", type: Boolean }) labelStart = false;
  @property() legend: Renderable = "";
  @property() hint: Renderable = "";
  @property({ attribute: "aria-label" }) ariaLabelText?: string;

  @query("input") input!: HTMLInputElement;

  focus(options?: FocusOptions) {
    this.input?.focus(options);
  }

  render() {
    const text = this.label || (this.hasContent ? this.slotted() : "");
    const input = html`<input
      type="checkbox"
      role="switch"
      class=${switchControl({ size: this.size })}
      name=${ifDefined(this.name)}
      .checked=${live(this.checked)}
      aria-checked=${this.checked ? "true" : "false"}
      ?disabled=${this.disabled}
      aria-label=${ifDefined(text ? undefined : this.ariaLabelText)}
      @change=${(e: Event) => (this.checked = (e.target as HTMLInputElement).checked)}
    />`;
    const control = text
      ? html`<label class=${fieldsetLabel({ control: true })}>
          ${this.labelStart ? text : nothing} ${input} ${this.labelStart ? nothing : text}
        </label>`
      : input;
    return fieldsetField({ legend: this.legend, hint: this.hint }, control);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-switch": UiSwitch;
  }
}
