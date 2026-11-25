import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

export const mockupWindow = rcva("mockup-window", {
  variants: {
    variant: {
      bordered: "border border-outline-variant w-full",
      filled: "bg-surface border border-outline-variant",
    },
  },
  defaultVariants: { variant: "bordered" },
});

export const mockupWindowContent = rcva("", {
  variants: {
    variant: {
      bordered: "border-t border-outline-variant",
      filled: "",
    },
    centered: { true: "grid place-content-center" },
    height: {
      sm: "h-40",
      md: "h-60",
      lg: "h-80",
      xl: "h-96",
    },
  },
  defaultVariants: { variant: "bordered" },
});

export type MockupWindowVariants = VariantProps<typeof mockupWindow> & VariantProps<typeof mockupWindowContent>;

@customElement("ui-mockup-window")
export class UiMockupWindow extends LightElement {
  @property() variant: MockupWindowVariants["variant"] = "bordered";
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = false;
  @property() height: MockupWindowVariants["height"];

  render() {
    return html`<div class=${mockupWindow({ variant: this.variant })}>
      <div class=${mockupWindowContent({ variant: this.variant, centered: this.centered, height: this.height })}>
        ${this.content}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-mockup-window": UiMockupWindow;
  }
}
