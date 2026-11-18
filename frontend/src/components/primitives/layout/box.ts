import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Box: a generic surface: background, border, radius, shadow, padding, size.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy, not daisyUI)
 *
 * The wrapper the daisyUI docs keep writing as utilities
 * (`bg-base-100 border border-base-300 rounded-box p-4 w-64`...), as variants.
 * Every variant is responsive, e.g. `padding="4 md:8"`.
 */
export const box = rcva("", {
  variants: {
    surface: {
      "base-100": "bg-base-100 text-base-content",
      "base-200": "bg-base-200 text-base-content",
      "base-300": "bg-base-300 text-base-content",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
    },
    border: { true: "border border-base-300" },
    rounded: {
      none: "rounded-none",
      field: "rounded-field",
      selector: "rounded-selector",
      box: "rounded-box",
      full: "rounded-full",
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
    },
    padding: {
      "0": "p-0",
      "1": "p-1",
      "2": "p-2",
      "3": "p-3",
      "4": "p-4",
      "5": "p-5",
      "6": "p-6",
      "8": "p-8",
      "10": "p-10",
      "12": "p-12",
      "16": "p-16",
    },
    width: {
      auto: "w-auto",
      full: "w-full",
      fit: "w-fit",
      xs: "w-xs",
      sm: "w-sm",
      md: "w-md",
      lg: "w-lg",
      xl: "w-xl",
      "2xl": "w-2xl",
      "3xl": "w-3xl",
      "4xl": "w-4xl",
      "5xl": "w-5xl",
      "6xl": "w-6xl",
      "7xl": "w-7xl",
      "96": "w-96",
      "80": "w-80",
      "64": "w-64",
      "52": "w-52",
    },
    height: {
      "32": "h-32",
      "48": "h-48",
      "64": "h-64",
      "80": "h-80",
      "96": "h-96",
      full: "h-full",
      screen: "h-screen",
    },
    overflow: {
      auto: "overflow-auto",
      hidden: "overflow-hidden",
      "x-auto": "overflow-x-auto",
    },
    /** Center the content on both axes. */
    center: { true: "grid place-items-center" },
  },
});

export type BoxVariants = VariantProps<typeof box>;

const BOX_TAGS = {
  div: literal`div`,
  section: literal`section`,
  article: literal`article`,
  aside: literal`aside`,
  header: literal`header`,
  footer: literal`footer`,
  figure: literal`figure`,
} satisfies Record<string, StaticValue>;

export type BoxTag = keyof typeof BOX_TAGS;

/**
 * @example <ui-box surface="base-100" border rounded="box" padding="4">…</ui-box>
 * @example <ui-box surface="base-200" padding="4 md:8" width="full md:96" shadow="sm">…</ui-box>
 * @example <ui-box height="64" center surface="base-300" rounded="box">Centered</ui-box>
 */
@customElement("ui-box")
export class UiBox extends LightElement {
  @property() as: BoxTag = "div";
  @property() surface: BoxVariants["surface"];
  @property({ converter: responsiveBoolean }) border: Responsive<boolean> = false;
  @property() rounded: BoxVariants["rounded"];
  @property() shadow: BoxVariants["shadow"];
  @property() padding: BoxVariants["padding"];
  @property() width: BoxVariants["width"];
  @property() height: BoxVariants["height"];
  @property() overflow: BoxVariants["overflow"];
  @property({ converter: responsiveBoolean }) center: Responsive<boolean> = false;

  render() {
    const tag = BOX_TAGS[this.as] ?? BOX_TAGS.div;
    const cls = box({
      surface: this.surface,
      border: this.border,
      rounded: this.rounded,
      shadow: this.shadow,
      padding: this.padding,
      width: this.width,
      height: this.height,
      overflow: this.overflow,
      center: this.center,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-box": UiBox;
  }
}
