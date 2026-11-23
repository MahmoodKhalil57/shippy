import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowFill, text, tiles } from "../layout/algebra.ts";

/**
 * Gauge: how much of something there is, a value within a known range: lines ready, checks
 * passed, on-time rate (Apple gauge; the HTML `meter`).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * It isn't progress. `<ui-progress>` is for work the app is doing now. A gauge reports a
 * measurement. `heading` and `value-text` add the line above the bar ("Ready", "3 / 5"); `label`
 * is the full sentence for screen readers ("3 of 5 lines ready"). `tone` says how good the value
 * is: success, warning, error, or neutral/primary when it's just an amount. A 4px track in the
 * highest container colour, the filled part in the tone (M3 linear indicator shape).
 */
export const gauge = rcva("flex min-w-0 flex-col gap-1", {
  variants: {
    width: { xs: tiles["2"], sm: tiles["4"], full: "w-full" },
  },
  defaultVariants: { width: "full" },
});
export const gaugeHead = rcva(`${row} items-baseline justify-between gap-x-2`);
export const gaugeHeading = rcva(`${rowFill} truncate text-body-md text-on-surface`);
export const gaugeValue = rcva(`${text.label} text-title-sm text-on-surface tabular-nums`);
export const gaugeTrack = rcva("h-1 w-full overflow-hidden [--clips:bar] rounded-full bg-surface-container-highest");
export const gaugeFill = rcva(
  // As wide as the reading (`--fill`, a share of the track), never wider than the track.
  "h-full w-(--fill) max-w-full rounded-full [transition:width_var(--duration-medium2)_var(--ease-emphasized-decelerate)]",
  {
    variants: {
      tone: {
        neutral: "bg-on-surface-variant",
        primary: "bg-primary",
        info: "bg-info",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

export type GaugeVariants = VariantProps<typeof gauge>;
export type GaugeTone = NonNullable<VariantProps<typeof gaugeFill>["tone"]>;

/**
 * @example <ui-gauge tone="success" .value=${3} .max=${5} label="3 of 5 lines ready"></ui-gauge>
 * @example <ui-gauge heading="Quoted" value-text="4 / 6" .value=${4} .max=${6} label="Quoted: 4 of 6 lines"></ui-gauge>
 */
@customElement("ui-gauge")
export class UiGauge extends LightElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property() tone: GaugeTone = "primary";
  @property() width: GaugeVariants["width"];
  /** The full reading for screen readers: "3 of 5 lines ready". */
  @property() label = "";
  /** Visible name above the bar (or `slot="heading"`). */
  @property() heading: Renderable = "";
  /** Visible value above the bar: "3 / 5", "92%". */
  @property({ attribute: "value-text" }) valueText: Renderable = "";

  render() {
    const span = this.max - this.min;
    const pct = span > 0 ? Math.min(100, Math.max(0, ((this.value - this.min) / span) * 100)) : 0;
    const head = this.heading || this.valueText || this.hasSlotted("heading");
    return html`<div class=${gauge({ width: this.width })}>
      ${
        head
          ? html`<div class=${gaugeHead()} aria-hidden="true">
              <span class=${gaugeHeading()}
                >${this.hasSlotted("heading") ? this.slotted("heading") : this.heading}</span
              >
              ${this.valueText ? html`<span class=${gaugeValue()}>${this.valueText}</span>` : nothing}
            </div>`
          : nothing
      }
      <div
        role="meter"
        class=${gaugeTrack()}
        aria-valuenow=${this.value}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-label=${this.label || (typeof this.heading === "string" ? this.heading : "") || "Gauge"}
        aria-valuetext=${this.label || `${this.value} of ${this.max}`}
      >
        <div class=${gaugeFill({ tone: this.tone })} style="--fill:${pct}%"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-gauge": UiGauge;
  }
}
