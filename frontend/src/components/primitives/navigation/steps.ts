import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Steps: Shows a list of steps in a process.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/steps/
 *
 * Responsive (docs): `direction="vertical lg:horizontal"`.
 * Scrollable wrapper (docs): `scrollable`.
 */
export const steps = rcva("steps", {
  variants: {
    direction: {
      vertical: "steps-vertical",
      horizontal: "steps-horizontal",
    },
  },
});

export const stepsStep = rcva("step", {
  variants: {
    color: {
      neutral: "step-neutral",
      primary: "step-primary",
      secondary: "step-secondary",
      accent: "step-accent",
      info: "step-info",
      success: "step-success",
      warning: "step-warning",
      error: "step-error",
    },
    clickable: { true: "cursor-pointer" },
  },
});
/** Horizontal scroll wrapper for long step lists (docs "With scrollable wrapper"). */
export const stepsScroll = rcva("overflow-x-auto");

/** Custom icon inside a step (replaces the number). */
export const stepsIcon = rcva("step-icon");

export type StepsVariants = VariantProps<typeof steps>;
export type StepsStepVariants = VariantProps<typeof stepsStep>;

export interface StepItem {
  label: Renderable;
  /** Overrides the progress color for this step. */
  color?: StepsStepVariants["color"];
  /** Custom icon (emoji, svg…) rendered in `step-icon`. */
  icon?: Renderable;
  /** Text shown in the circle instead of the number (`data-content`, e.g. "✓"). */
  marker?: string;
}

/**
 * @example
 * <ui-steps color="primary" current="1" .items=${[
 *   { label: "Register" }, { label: "Choose plan" }, { label: "Purchase" }, { label: "Receive Product" },
 * ]}></ui-steps>
 *
 * Steps with index <= `current` get `color` (completed + current step). Set
 * `current="-1"` to color none. With `clickable`, steps are buttons and fire
 * `ui-change` with `{ index, item }`. Without `items`, authored
 * `<li class="step">` children are rendered.
 */
@customElement("ui-steps")
export class UiSteps extends LightElement {
  @property({ attribute: false }) items: StepItem[] = [];
  @property() direction: StepsVariants["direction"];
  @property() color: StepsStepVariants["color"] = "primary";
  @property({ type: Number, reflect: true }) current = 0;
  @property({ type: Boolean }) clickable = false;
  /** Wrap in a horizontally scrolling container (docs "With scrollable wrapper"). */
  @property({ type: Boolean }) scrollable = false;

  private _select(index: number) {
    if (index === this.current) return;
    this.current = index;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index, item: this.items[index] }, bubbles: true }));
  }

  render() {
    const list = html`<ul class=${steps({ direction: this.direction })}>
      ${
        this.items.length
          ? this.items.map((item, i) => {
              const color = item.color ?? (i <= this.current ? this.color : undefined);
              const body = html`${item.icon != null ? html`<span class=${stepsIcon()}>${item.icon}</span>` : nothing}${item.label}`;
              return html`<li
                class=${stepsStep({ color, clickable: this.clickable })}
                data-content=${ifDefined(item.marker)}
                aria-current=${ifDefined(i === this.current ? "step" : undefined)}
                role=${ifDefined(this.clickable ? "button" : undefined)}
                tabindex=${ifDefined(this.clickable ? "0" : undefined)}
                @click=${this.clickable ? () => this._select(i) : nothing}
                @keydown=${
                  this.clickable
                    ? (e: KeyboardEvent) =>
                        (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._select(i))
                    : nothing
                }
              >
                ${body}
              </li>`;
            })
          : this.content
      }
    </ul>`;
    return this.scrollable ? html`<div class=${stepsScroll()}>${list}</div>` : list;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-steps": UiSteps;
  }
}
