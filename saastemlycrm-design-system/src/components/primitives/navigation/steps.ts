import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { scrolled, text } from "../layout/algebra.ts";

/**
 * Steps: where something is in a fixed sequence (M3 / Apple progress through stages).
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/steps/
 *
 * Steps before `current` are done and show a tick; `current` is highlighted; later ones are
 * still to come. One `tone` colours the done and current steps: primary, or warning / error
 * when the sequence itself is in trouble (an escalation). An item can say it was `skipped`
 * (a dash) or `done` out of order. `supporting` is the small line under a label ("next · 14:00").
 * `direction="vertical lg:horizontal"` is responsive; `scrollable` lets a long row scroll.
 */
// Each step keeps 10rem for its label (`scrolled.steps`): a row that can't fit scrolls (daisyUI's steps scroll themselves).
export const steps = rcva(`steps ${scrolled.steps}`, {
  variants: {
    direction: {
      vertical: "steps-vertical",
      horizontal: "steps-horizontal",
    },
  },
});

export const stepsStep = rcva("step", {
  variants: {
    tone: {
      primary: "step-primary",
      warning: "step-warning",
      error: "step-error",
    },
    clickable: { true: "cursor-pointer" },
  },
});
/** Horizontal scroll wrapper for long step lists. */
export const stepsScroll = rcva("overflow-x-auto");
export const stepsSupporting = rcva(`block ${text.label} text-body-sm text-on-surface-variant`);

export type StepsVariants = VariantProps<typeof steps>;
export type StepsTone = NonNullable<VariantProps<typeof stepsStep>["tone"]>;

export interface StepItem {
  label: Renderable;
  /** A small line under the label: a time, who, "not needed". */
  supporting?: Renderable;
  /** Overrides the position-based state: `done` out of order, `skipped` (not needed). */
  state?: "done" | "skipped";
}

/**
 * @example
 * <ui-steps current="1" .items=${[
 *   { label: "Request received" }, { label: "Call-back", supporting: "on the number on file" }, { label: "Approved" },
 * ]}></ui-steps>
 *
 * Set `current="-1"` when nothing has started. With `clickable`, steps are buttons and fire
 * `ui-change` with `{ index, item }`.
 */
@customElement("ui-steps")
export class UiSteps extends LightElement {
  @property({ attribute: false }) items: StepItem[] = [];
  @property() direction: StepsVariants["direction"];
  @property() tone: StepsTone = "primary";
  @property({ type: Number, reflect: true }) current = 0;
  @property({ type: Boolean }) clickable = false;
  @property({ type: Boolean }) scrollable = false;

  private _select(index: number) {
    if (index === this.current) return;
    this.current = index;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index, item: this.items[index] }, bubbles: true }));
  }

  render() {
    const list = html`<ol class=${steps({ direction: this.direction })}>
      ${this.items.map((item, i) => {
        const state = item.state ?? (i < this.current ? "done" : undefined);
        const reached = state === "done" || i === this.current;
        const marker = state === "done" ? "✓" : state === "skipped" ? "–" : undefined;
        return html`<li
          class=${stepsStep({ tone: reached ? this.tone : undefined, clickable: this.clickable })}
          data-content=${ifDefined(marker)}
          aria-current=${ifDefined(i === this.current ? "step" : undefined)}
          role=${ifDefined(this.clickable ? "button" : undefined)}
          tabindex=${ifDefined(this.clickable ? "0" : undefined)}
          @click=${this.clickable ? () => this._select(i) : nothing}
          @keydown=${
            this.clickable
              ? (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this._select(i))
              : nothing
          }
        >
          <span>
            ${item.label}${item.supporting ? html`<span class=${stepsSupporting()}>${item.supporting}</span>` : nothing}
            ${state === "skipped" ? html`<span class="sr-only">(skipped)</span>` : state === "done" ? html`<span class="sr-only">(done)</span>` : nothing}
          </span>
        </li>`;
      })}
    </ol>`;
    return this.scrollable ? html`<div class=${stepsScroll()}>${list}</div>` : list;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-steps": UiSteps;
  }
}
