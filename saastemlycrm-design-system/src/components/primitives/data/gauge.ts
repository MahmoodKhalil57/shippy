import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formatInt, m } from "../../../i18n/index.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowFill, text, tiles } from "../layout/algebra.ts";

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

@customElement("ui-gauge")
export class UiGauge extends LightElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property() tone: GaugeTone = "primary";
  @property() width: GaugeVariants["width"];
  @property() label = "";
  @property() heading: Renderable = "";
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
        aria-label=${this.label || (typeof this.heading === "string" ? this.heading : "") || m.gauge_label()}
        aria-valuetext=${this.label || m.gauge_value_of({ value: formatInt(this.value), max: formatInt(this.max) })}
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
