import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Text Rotate: Cycles through up to 6 lines of text with an animation.
 *
 * Purpose: Media & visual effects · Kind: primitive
 * Docs: https://daisyui.com/components/text-rotate/
 *
 * Markup is `text-rotate > span > span*`. The default duration is 10s and the
 * animation pauses on hover. Every variant is responsive, e.g. `size="3xl md:7xl"`.
 */
export const textRotate = rcva("text-rotate", {
  variants: {
    /** Font size. The docs' big examples use `7xl`. */
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
    },
    /** Extra line height for tall fonts or emoji (the docs' `leading-[2]`). */
    tall: { true: "leading-[2]" },
    /** Full cycle (default 10s; the docs' `duration-6000` is `6000`). */
    duration: {
      "3000": "duration-3000",
      "6000": "duration-6000",
      "10000": "duration-10000",
      "15000": "duration-15000",
    },
  },
});

/** Inner wrapper that holds the lines. */
export const textRotateLines = rcva("", {
  variants: {
    center: { true: "justify-items-center" },
  },
});

/** One line. `color` gives it a coloured pill (docs: "Different colors for each word"). */
export const textRotateLine = rcva("", {
  variants: {
    color: {
      neutral: "bg-neutral text-neutral-content px-2",
      primary: "bg-primary text-primary-content px-2",
      secondary: "bg-secondary text-secondary-content px-2",
      accent: "bg-accent text-accent-content px-2",
      info: "bg-info text-info-content px-2",
      success: "bg-success text-success-content px-2",
      warning: "bg-warning text-warning-content px-2",
      error: "bg-error text-error-content px-2",
    },
    /** Bold italic (docs: "FAST ▶︎▶︎"). */
    emphasis: { true: "font-bold italic px-2" },
  },
});

export type TextRotateVariants = VariantProps<typeof textRotate> & VariantProps<typeof textRotateLines>;
export type TextRotateLineVariants = VariantProps<typeof textRotateLine>;

export interface TextRotateLine extends TextRotateLineVariants {
  text: Renderable;
}

/** daisyUI animates at most 6 lines. */
export const TEXT_ROTATE_MAX_LINES = 6;

const isLine = (l: unknown): l is TextRotateLine => typeof l === "object" && l !== null && "text" in l;

/**
 * @example <ui-text-rotate center size="7xl" duration="6000" .lines=${["BLAZING", { text: "FAST ▶︎▶︎", emphasis: true }]}></ui-text-rotate>
 * @example <ui-text-rotate .lines=${[{ text: "Designers", color: "teal" }, { text: "Developers", color: "red" }]}></ui-text-rotate>
 * @example <ui-text-rotate center tall size="7xl" .lines=${["📐 DESIGN", "⌨️ DEVELOP"]}></ui-text-rotate>
 *
 * Without `lines`, each authored child element becomes one line.
 */
@customElement("ui-text-rotate")
export class UiTextRotate extends LightElement {
  @property({ attribute: false }) lines: (Renderable | TextRotateLine)[] = [];
  @property() size: TextRotateVariants["size"];
  @property({ converter: responsiveBoolean }) tall: Responsive<boolean> = false;
  /** Center lines horizontally. */
  @property({ converter: responsiveBoolean }) center: Responsive<boolean> = false;
  @property() duration: TextRotateVariants["duration"];

  private _line(line: Renderable | TextRotateLine) {
    if (isLine(line)) {
      return html`<span class=${textRotateLine({ color: line.color, emphasis: line.emphasis })}>${line.text}</span>`;
    }
    return html`<span>${line}</span>`;
  }

  render() {
    const lines = this.lines.length
      ? this.lines.slice(0, TEXT_ROTATE_MAX_LINES).map((l) => this._line(l))
      : this.content;
    return html`<span class=${textRotate({ size: this.size, tall: this.tall, duration: this.duration })}>
      <span class=${textRotateLines({ center: this.center })}>${lines}</span>
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-text-rotate": UiTextRotate;
  }
}
