import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Browser mockup: Box that looks like a browser window.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/mockup-browser/
 */
export const mockupBrowser = rcva("mockup-browser w-full", {
  variants: {
    /** `bordered`: border only. `filled`: border + base-100 background. */
    variant: {
      bordered: "border border-base-300",
      filled: "bg-base-100 border border-base-300",
    },
  },
  defaultVariants: { variant: "bordered" },
});

/** Toolbar part; holds the address bar, etc. */
export const mockupBrowserToolbar = rcva("mockup-browser-toolbar");

/** Address bar inside the toolbar (an `input`-styled box, as in the docs). */
export const mockupBrowserAddress = rcva("input");

/** Page area under the toolbar. The docs' examples use `centered` + height `lg` (h-80). */
export const mockupBrowserContent = rcva("", {
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

export type MockupBrowserVariants = VariantProps<typeof mockupBrowser> & VariantProps<typeof mockupBrowserContent>;

/**
 * @example <ui-mockup-browser url="https://daisyui.com" centered height="lg">Hello!</ui-mockup-browser>
 * @example <ui-mockup-browser variant="filled" url="https://daisyui.com" centered height="lg">Hello!</ui-mockup-browser>
 *
 * Custom toolbar content: a child with `slot="toolbar"` replaces the address bar.
 */
@customElement("ui-mockup-browser")
export class UiMockupBrowser extends LightElement {
  @property() variant: MockupBrowserVariants["variant"] = "bordered";
  @property() url: Renderable = "";
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = false;
  @property() height: MockupBrowserVariants["height"];

  render() {
    const toolbar = this.hasSlotted("toolbar")
      ? this.slotted("toolbar")
      : this.url
        ? html`<div class=${mockupBrowserAddress()}>${this.url}</div>`
        : nothing;
    return html`<div class=${mockupBrowser({ variant: this.variant })}>
      <div class=${mockupBrowserToolbar()}>${toolbar}</div>
      <div class=${mockupBrowserContent({ variant: this.variant, centered: this.centered, height: this.height })}>
        ${this.slotted()}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-mockup-browser": UiMockupBrowser;
  }
}
