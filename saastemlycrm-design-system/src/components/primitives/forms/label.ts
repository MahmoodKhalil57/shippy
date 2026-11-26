import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";

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

@customElement("ui-label")
export class UiLabel extends LightElement {
  @property() variant: LabelVariants["variant"] = "text";
  @property() text: Renderable = "";
  @property() for?: string;
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
