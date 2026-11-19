import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Box: a generic surface: background, border, radius, shadow, padding, size.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy, not daisyUI)
 *
 * The wrapper the daisyUI docs keep writing as utilities
 * (`bg-surface border border-outline-variant rounded-box p-4 w-64`...), as variants.
 * Every variant is responsive, e.g. `padding="4 md:8"`.
 */
export const box = rcva("", {
  variants: {
    /**
     * A share of a wrapping row (`<ui-flex wrap gap="4">`), from `--box-basis` (set by `basis`):
     * the row's gap comes off it, and it never gets narrower than 12rem (or the row), so a row of
     * shares wraps instead of squeezing on a narrow panel. `grow` lets it take spare room.
     */
    basis: {
      true: "min-w-[min(100%,12rem)] shrink basis-[calc(var(--box-basis)_-_1rem)]",
    },
    grow: { true: "grow", false: "grow-0" },
    surface: {
      "base-100": "bg-surface text-on-surface",
      "base-200": "bg-surface-container text-on-surface",
      "base-300": "bg-surface-container-highest text-on-surface",
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      secondary: "bg-secondary text-secondary-content",
      accent: "bg-accent text-accent-content",
      /** A light primary tint with a primary border: something the AI produced, to check. */
      "primary-soft": "bg-primary-container text-on-surface",
    },
    border: { true: "border border-outline-variant" },
    rounded: {
      none: "rounded-none",
      field: "rounded-field",
      selector: "rounded-selector",
      box: "rounded-box",
      full: "rounded-full",
    },
    /** M3 elevation: 0 (none) to +3 at rest; +4 / +5 are for hover and drag only. */
    elevation: {
      "0": "shadow-none",
      "1": "shadow-elevation-1",
      "2": "shadow-elevation-2",
      "3": "shadow-elevation-3",
    },
    padding: {
      /** Scales with the window: 1rem → 4rem. */
      fluid: "p-[clamp(1rem,6vw,4rem)]",
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
    /** Width cap, so `width="full"` boxes stop growing (no breakpoint needed). */
    max: { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" },
    /** At most this tall; what's more scrolls (a long list in a popover). */
    maxHeight: {
      "56": "max-h-56 overflow-y-auto overscroll-contain pe-1 [--scrollbar-inset:var(--radius-field)]",
      "72": "max-h-72 overflow-y-auto overscroll-contain pe-1 [--scrollbar-inset:var(--radius-field)]",
      "96": "max-h-[min(24rem,70dvh)] overflow-y-auto overscroll-contain pe-1 [--scrollbar-inset:var(--radius-field)]",
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
 * @example <ui-box surface="base-200" padding="4 md:8" width="full md:96" elevation="1">…</ui-box>
 * @example <ui-box height="64" center surface="base-300" rounded="box">Centered</ui-box>
 * @example <ui-flex wrap gap="4"><ui-box basis="50%" grow>…</ui-box><ui-box basis="25%" grow>…</ui-box></ui-flex>
 */
@customElement("ui-box")
export class UiBox extends LightElement {
  @property() as: BoxTag = "div";
  @property() surface: BoxVariants["surface"];
  @property({ converter: responsiveBoolean }) border: Responsive<boolean> = false;
  @property() rounded: BoxVariants["rounded"];
  @property() elevation: BoxVariants["elevation"];
  @property() padding: BoxVariants["padding"];
  @property() width: BoxVariants["width"];
  @property() max: BoxVariants["max"];
  @property({ attribute: "max-height" }) maxHeight: BoxVariants["maxHeight"];
  @property() height: BoxVariants["height"];
  @property() overflow: BoxVariants["overflow"];
  @property({ converter: responsiveBoolean }) center: Responsive<boolean> = false;
  /**
   * Its share of a wrapping row: any CSS length or percentage (`50%`, `20rem`), e.g. a Payload
   * field's `admin.width`. See the `basis` variant.
   */
  @property() basis?: string;
  /** With `basis`: also take a share of the row's spare room. */
  @property({ type: Boolean }) grow = false;

  render() {
    const tag = BOX_TAGS[this.as] ?? BOX_TAGS.div;
    const cls = box({
      surface: this.surface,
      border: this.border,
      rounded: this.rounded,
      elevation: this.elevation,
      padding: this.padding,
      width: this.width,
      max: this.max,
      maxHeight: this.maxHeight,
      height: this.height,
      overflow: this.overflow,
      center: this.center,
      basis: !!this.basis,
      grow: this.basis ? this.grow : undefined,
    });
    return html`<${tag} class=${cls} style=${styleMap(this.basis ? { "--box-basis": this.basis } : {})}
      >${this.content}</${tag}
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-box": UiBox;
  }
}
