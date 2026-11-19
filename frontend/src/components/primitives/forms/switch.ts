import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fieldsetField, fieldsetLabel } from "./fieldset.ts";

/**
 * Switch: turns one setting on or off, effective at once (M3 switch; Apple toggle).
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * Use it for a setting that applies as soon as it's flipped, typically in a list or a table row
 * (enable a rule, grant a permission). Not for something people confirm and then submit (that's
 * a checkbox), not for choosing several options of one thing (checkboxes), and it has no
 * "mixed" state (M3). One colour: primary when on. Announced as a switch (`role="switch"`).
 * Needs a `label`, or `aria-label` when the row says what it switches.
 */
export const switchControl = rcva("toggle toggle-primary", {
  variants: {
    size: { sm: "toggle-sm", md: "toggle-md" },
  },
  defaultVariants: { size: "md" },
});

export type SwitchVariants = VariantProps<typeof switchControl>;

/**
 * @example <ui-switch label="Send reminders automatically" .checked=${on} @change=${…}></ui-switch>
 * @example <ui-switch .checked=${rule.enabled} aria-label=${`Enable ${rule.name}`}></ui-switch>
 *
 * Native `change` events bubble out; `checked` stays in sync.
 */
@customElement("ui-switch")
export class UiSwitch extends LightElement {
  @property() size: SwitchVariants["size"];
  @property({ type: Boolean }) checked = false;
  @property() name?: string;
  @property({ type: Boolean }) disabled = false;
  @property() label: Renderable = "";
  /** The label before the switch (settings rows put it at the start). */
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
