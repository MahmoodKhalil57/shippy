import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { inset, pad, row, text, tileCap } from "../layout/algebra.ts";

/**
 * Range slider: Selects a value by sliding a handle.
 *
 * Purpose: Forms & input · Kind: primitive
 * Docs: https://daisyui.com/components/range/
 *
 * All variants are responsive (e.g. `size="sm lg:lg"`). The docs' "Range with
 * custom color and no fill" uses `fill-color` / `track-color` / `thumb-color`,
 * which take theme colours (the design system has no free-form colours).
 */
export const range = rcva("range", {
  variants: {
    color: {
      neutral: "range-neutral",
      primary: "range-primary",
      secondary: "range-secondary",
      accent: "range-accent",
      success: "range-success",
      warning: "range-warning",
      info: "range-info",
      error: "range-error",
    },
    size: {
      xs: "range-xs",
      sm: "range-sm",
      md: "range-md",
      lg: "range-lg",
      xl: "range-xl",
    },
    direction: {
      horizontal: "",
      vertical: "range-vertical",
    },
    /** Turn off the filled part of the track. */
    unfilled: { true: "[--range-fill:0]" },
    /** Width (the docs' "steps and measure" uses `w-full max-w-xs`). */
    width: { xs: tileCap["6"], sm: tileCap["7"], md: tileCap["8"], full: "w-full" },
    /** Filled part of the track (and the thumb, unless `thumbColor`). */
    fillColor: {
      neutral: "text-neutral",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      "base-100": "text-base-100",
      "base-200": "text-base-200",
      "base-300": "text-base-300",
      "base-content": "text-on-surface",
    },
    /** Track background. */
    trackColor: {
      neutral: "[--range-bg:var(--color-neutral)]",
      primary: "[--range-bg:var(--color-primary)]",
      secondary: "[--range-bg:var(--color-secondary)]",
      accent: "[--range-bg:var(--color-accent)]",
      info: "[--range-bg:var(--color-info)]",
      success: "[--range-bg:var(--color-success)]",
      warning: "[--range-bg:var(--color-warning)]",
      error: "[--range-bg:var(--color-error)]",
      "base-100": "[--range-bg:var(--color-base-100)]",
      "base-200": "[--range-bg:var(--color-base-200)]",
      "base-300": "[--range-bg:var(--color-base-300)]",
      "base-content": "[--range-bg:var(--color-base-content)]",
    },
    /** Thumb. */
    thumbColor: {
      neutral: "[--range-thumb:var(--color-neutral)]",
      primary: "[--range-thumb:var(--color-primary)]",
      secondary: "[--range-thumb:var(--color-secondary)]",
      accent: "[--range-thumb:var(--color-accent)]",
      info: "[--range-thumb:var(--color-info)]",
      success: "[--range-thumb:var(--color-success)]",
      warning: "[--range-thumb:var(--color-warning)]",
      error: "[--range-thumb:var(--color-error)]",
      "base-100": "[--range-thumb:var(--color-base-100)]",
      "base-200": "[--range-thumb:var(--color-base-200)]",
      "base-300": "[--range-thumb:var(--color-base-300)]",
      "base-content": "[--range-thumb:var(--color-base-content)]",
    },
  },
});

/** Wrapper around the slider + measure rows. */
export const rangeWrapper = rcva("", {
  variants: {
    width: { xs: tileCap["6"], sm: tileCap["7"], md: tileCap["8"], full: "w-full" },
  },
});

/** Row under the slider holding tick marks or step labels ("With steps and measure"). */
export const rangeMeasure = rcva(`${row} ${inset["2.5"]} ${text.label} justify-between mt-2 text-body-sm`);

/**
 * The value riding above the thumb (`bubble`): it follows the thumb (`--p`, 0 to 1, across the
 * track less a thumb's width), and swells while the thumb is held, so the number being set is
 * where the eye already is. Room above the track for it: `rangeBubbled`.
 */
export const rangeBubbled = rcva("relative pt-9");
export const rangeBubble = rcva(
  `${text.line} ${pad["2.5"]} pointer-events-none absolute top-0 start-[calc(var(--p)*(100%_-_1.5rem)+0.75rem)] w-max max-w-full -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-primary py-0.5 text-label-lg tabular-nums text-on-primary shadow-elevation-1 [transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] origin-bottom [:has(>input:active)>&]:scale-110 [:has(>input:focus-visible)>&]:scale-110 motion-reduce:transition-none`,
);

export type RangeVariants = VariantProps<typeof range>;

/**
 * @example <ui-range name="volume" value="40" color="primary" size="sm"></ui-range>
 * @example <ui-range min="0" max="100" step="25" value="25" ticks width="xs" .labels=${[1, 2, 3, 4, 5]}></ui-range>
 * @example <ui-range unfilled fill-color="info" track-color="warning" thumb-color="primary"></ui-range>
 * @example <ui-range direction="vertical md:horizontal"></ui-range>
 *
 * Native `input`/`change` events bubble out; `ui-change` carries `{ value }` (a number).
 */
@customElement("ui-range")
export class UiRange extends LightElement {
  @property() color: RangeVariants["color"];
  @property() size: RangeVariants["size"];
  @property() direction: RangeVariants["direction"];
  @property({ converter: responsiveBoolean }) unfilled: Responsive<boolean> = false;
  @property() width: RangeVariants["width"];
  @property({ attribute: "fill-color" }) fillColor: RangeVariants["fillColor"];
  @property({ attribute: "track-color" }) trackColor: RangeVariants["trackColor"];
  @property({ attribute: "thumb-color" }) thumbColor: RangeVariants["thumbColor"];
  @property({ type: Number }) value = 50;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step?: number;
  @property() name?: string;
  @property() label?: string;
  @property({ type: Boolean }) disabled = false;
  /** Show a `|` tick for every step under the slider (needs `step`). */
  @property({ type: Boolean }) ticks = false;
  /** Labels shown evenly spaced under the slider. */
  @property({ attribute: false }) labels: Renderable[] = [];
  /** The value in a bubble above the thumb, following it (`format` writes it). */
  @property({ type: Boolean }) bubble = false;
  /** How the bubble writes the value ("24%", "EGP 1,200"); else the number. */
  @property({ attribute: false }) format?: (v: number) => string;

  private _onInput(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value);
  }

  private _onChange() {
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: this.value }, bubbles: true }));
  }

  render() {
    const wrapped = this.ticks || this.labels.length > 0;
    const input = html`<input
      type="range"
      class=${range({
        color: this.color,
        size: this.size,
        direction: this.direction,
        unfilled: this.unfilled,
        width: wrapped ? undefined : this.width,
        fillColor: this.fillColor,
        trackColor: this.trackColor,
        thumbColor: this.thumbColor,
      })}
      .value=${String(this.value)}
      min=${this.min}
      max=${this.max}
      step=${ifDefined(this.step)}
      name=${ifDefined(this.name)}
      aria-label=${ifDefined(this.label)}
      ?disabled=${this.disabled}
      @input=${this._onInput}
      @change=${this._onChange}
    />`;

    const p = this.max > this.min ? (this.value - this.min) / (this.max - this.min) : 0;
    const bubble = this.bubble
      ? html`<span class=${rangeBubble()} aria-hidden="true"
          >${this.format ? this.format(this.value) : this.value}</span
        >`
      : nothing;
    if (!wrapped)
      return this.bubble
        ? html`<div
            class=${rangeWrapper({ width: this.width ?? "full", class: rangeBubbled() })}
            style="--p:${Math.min(1, Math.max(0, p))}"
          >
            ${bubble}${input}
          </div>`
        : input;

    const count = this.step ? Math.floor((this.max - this.min) / this.step) + 1 : 0;
    return html`<div
      class=${rangeWrapper({ width: this.width ?? "xs", class: this.bubble ? rangeBubbled() : "" })}
      style="--p:${Math.min(1, Math.max(0, p))}"
    >
      ${bubble}${input}
      ${
        this.ticks && count
          ? html`<div class=${rangeMeasure()} aria-hidden="true">
              ${Array.from({ length: count }, () => html`<span>|</span>`)}
            </div>`
          : nothing
      }
      ${
        this.labels.length
          ? html`<div class=${rangeMeasure()}>${this.labels.map((l) => html`<span>${l}</span>`)}</div>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-range": UiRange;
  }
}
