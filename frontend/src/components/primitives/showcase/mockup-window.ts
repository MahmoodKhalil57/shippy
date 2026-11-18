import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Window mockup: Box that looks like an operating system window.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/mockup-window/
 */
export const mockupWindow = rcva("mockup-window", {
  variants: {
    /** `bordered`: border only, full width. `filled`: border + base-100 background. */
    variant: {
      bordered: "border border-base-300 w-full",
      filled: "bg-base-100 border border-base-300",
    },
  },
  defaultVariants: { variant: "bordered" },
});

/** Window body under the title bar. The docs' examples use `centered` + height `lg` (h-80). */
export const mockupWindowContent = rcva("", {
  variants: {
    variant: {
      bordered: "border-t border-base-300",
      filled: "",
    },
    /** Center the content (grid place-content-center). */
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

/**
 * @example <ui-mockup-window centered height="lg">Hello!</ui-mockup-window>
 * @example <ui-mockup-window variant="filled" centered height="lg">Hello!</ui-mockup-window>
 */
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
