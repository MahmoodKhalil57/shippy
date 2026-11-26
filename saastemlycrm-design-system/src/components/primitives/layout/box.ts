import type { VariantProps } from "class-variance-authority";
import { backdrop, clipRoom, scrollRoom } from "../../../styles/algebra.ts";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { nothing } from "lit";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { scrollFocus } from "../../base/scroll-focus.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";

export const box = rcva("", {
  variants: {
    basis: {
      true: "min-w-[min(100%,12rem)] shrink basis-[calc(var(--box-basis)_-_1rem)]",
    },
    grow: { true: "grow", false: "grow-0" },
    surface: {
      "base-100": "bg-surface text-on-surface",
      "base-200": "bg-surface-container text-on-surface",
      "base-300": "bg-surface-container-highest text-on-surface",
      primary: "bg-primary text-primary-content",
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
    elevation: {
      "0": "shadow-none",
      "1": "shadow-elevation-1",
      "2": "shadow-elevation-2",
      "3": "shadow-elevation-3",
    },
    padding: {
      fluid: "px-[min(clamp(1rem,6vw,4rem),max(0px,calc((100%_-_7rem)/2)))] py-[clamp(1rem,6vw,4rem)]",
      "0": "px-0 py-0",
      "1": "px-[min(4px,max(0px,calc((100%_-_7rem)/2)))] py-1",
      "2": "px-[min(8px,max(0px,calc((100%_-_7rem)/2)))] py-2",
      "3": "px-[min(12px,max(0px,calc((100%_-_7rem)/2)))] py-3",
      "4": "px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      "5": "px-[min(20px,max(0px,calc((100%_-_7rem)/2)))] py-5",
      "6": "px-[min(24px,max(0px,calc((100%_-_7rem)/2)))] py-6",
      "8": "px-[min(32px,max(0px,calc((100%_-_7rem)/2)))] py-8",
      "10": "px-[min(40px,max(0px,calc((100%_-_7rem)/2)))] py-10",
      "12": "px-[min(48px,max(0px,calc((100%_-_7rem)/2)))] py-12",
      "16": "px-[min(64px,max(0px,calc((100%_-_7rem)/2)))] py-16",
    },
    max: { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" },
    maxHeight: {
      "56": `max-h-56 overflow-y-auto overscroll-contain ${scrollRoom} [--scrollbar-inset:var(--radius-field)]`,
      "72": `max-h-72 overflow-y-auto overscroll-contain ${scrollRoom} [--scrollbar-inset:var(--radius-field)]`,
      "96": `max-h-[min(24rem,70dvh)] overflow-y-auto overscroll-contain ${scrollRoom} [--scrollbar-inset:var(--radius-field)]`,
    },
    width: {
      auto: "w-auto",
      full: "w-full",
      fit: "w-fit",
      xs: "w-xs max-w-full",
      sm: "w-sm max-w-full",
      md: "w-md max-w-full",
      lg: "w-lg max-w-full",
      xl: "w-xl max-w-full",
      "2xl": "w-2xl max-w-full",
      "3xl": "w-3xl max-w-full",
      "4xl": "w-4xl max-w-full",
      "5xl": "w-5xl max-w-full",
      "6xl": "w-6xl max-w-full",
      "7xl": "w-7xl max-w-full",
      "96": "w-96 max-w-full",
      "80": "w-80 max-w-full",
      "64": "w-64 max-w-full",
      "52": "w-52 max-w-full",
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
      auto: `overflow-auto ${scrollRoom}`,
      hidden: clipRoom,
      "x-auto": `overflow-x-auto ${scrollRoom}`,
    },
    center: { true: "grid min-w-0 place-items-center" },
    backdrop: { true: `${backdrop} text-on-surface` },
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
  @property({ type: Boolean }) backdrop = false;
  @property() basis?: string;
  @property({ type: Boolean }) grow = false;
  /** Names the box as a region while it scrolls (overflow or max-height), so keyboard users know what they scroll. */
  @property() label?: string;

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
      backdrop: this.backdrop,
      basis: !!this.basis,
      grow: this.basis ? this.grow : undefined,
    });
    const scrolls = this.overflow === "auto" || this.overflow === "x-auto" || !!this.maxHeight;
    return html`<${tag}
      class=${cls}
      style=${styleMap(this.basis ? { "--box-basis": this.basis } : {})}
      ${scrolls ? scrollFocus({ label: this.label }) : nothing}
      >${this.content}</${tag}
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-box": UiBox;
  }
}
