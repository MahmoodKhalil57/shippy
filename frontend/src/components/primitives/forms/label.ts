import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Label: Name or title for an input field, placed before or after it.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/label/
 *
 * Two daisyUI classes:
 * - `label`: text label; inside `label.input` / `label.select` it becomes an
 *   inline prefix/suffix (e.g. "https://", ".com").
 * - `floating-label`: wraps a control and a `<span>`; the span floats above the
 *   control once it has focus or a value.
 */
export const label = rcva("", {
  variants: {
    variant: {
      text: "label",
      floating: "floating-label",
    },
  },
  defaultVariants: { variant: "text" },
});

export type LabelVariants = VariantProps<typeof label>;

/**
 * @example <ui-label for="email">Email</ui-label>
 * @example
 * <ui-label variant="floating" text="Your Email">
 *   <ui-text-input placeholder="mail@site.com" size="md"></ui-text-input>
 * </ui-label>
 * @example
 * <ui-label variant="floating" text="Input">
 *   <ui-text-input placeholder="Input" size="xs sm:sm md:md lg:lg xl:xl"></ui-text-input>
 * </ui-label>
 *
 * The `ui-text-input`, `ui-select` and `ui-textarea` elements already support
 * `leading`/`trailing` (inline labels) and `floating`, so use those first.
 */
@customElement("ui-label")
export class UiLabel extends LightElement {
  @property() variant: LabelVariants["variant"] = "text";
  /** Floating variant: the label text (otherwise children are the label text). */
  @property() text: Renderable = "";
  /** id of the labelled control. */
  @property() for?: string;
  /** Render as `<span>` / `<p>` (e.g. inline adornment or helper text) instead of `<label>`. */
  @property() as: "label" | "span" | "p" = "label";

  render() {
    const cls = label({ variant: this.variant });
    if (this.variant === "floating") {
      return html`<label class=${cls}>
        <span>${this.text}</span>
        ${this.content}
      </label>`;
    }
    if (this.as === "span") return html`<span class=${cls}>${this.content}</span>`;
    if (this.as === "p") return html`<p class=${cls}>${this.content}</p>`;
    return html`<label class=${cls} for=${this.for ?? nothing}>${this.content}</label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-label": UiLabel;
  }
}
