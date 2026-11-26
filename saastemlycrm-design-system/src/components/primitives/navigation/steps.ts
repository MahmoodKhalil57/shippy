import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { scrolled, scrollRoom, text } from "../../../styles/algebra.ts";
import { scrollFocus } from "../../base/scroll-focus.ts";
import { m } from "../../../lib/i18n/index.ts";

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
export const stepsScroll = rcva(`overflow-x-auto ${scrollRoom}`);
export const stepsButton = rcva("cursor-pointer rounded-field text-inherit");
export const stepsSupporting = rcva(`block ${text.label} text-body-sm text-on-surface-variant`);

export type StepsVariants = VariantProps<typeof steps>;
export type StepsTone = NonNullable<VariantProps<typeof stepsStep>["tone"]>;

export interface StepItem {
  label: Renderable;
  supporting?: Renderable;
  state?: "done" | "skipped";
}

@customElement("ui-steps")
export class UiSteps extends LightElement {
  @property({ attribute: false }) items: StepItem[] = [];
  @property() direction: StepsVariants["direction"];
  @property() tone: StepsTone = "primary";
  @property({ type: Number, reflect: true }) current = 0;
  @property({ type: Boolean }) clickable = false;
  @property({ type: Boolean }) scrollable = false;
  @property() label = "";

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
        const body = html`${item.label}${item.supporting ? html`<span class=${stepsSupporting()}>${item.supporting}</span>` : nothing}
        ${state === "skipped" ? html`<span class="sr-only">${m.steps_skipped()}</span>` : state === "done" ? html`<span class="sr-only">${m.steps_done()}</span>` : nothing}`;
        const current = i === this.current ? "step" : undefined;
        return html`<li
          class=${stepsStep({ tone: reached ? this.tone : undefined, clickable: this.clickable })}
          data-content=${ifDefined(marker)}
          aria-current=${ifDefined(this.clickable ? undefined : current)}
          @click=${this.clickable ? () => this._select(i) : nothing}
        >
          ${
            this.clickable
              ? html`<button type="button" class=${stepsButton()} aria-current=${ifDefined(current)}>${body}</button>`
              : html`<span>${body}</span>`
          }
        </li>`;
      })}
    </ol>`;
    return this.scrollable
      ? html`<div class=${stepsScroll()} ${scrollFocus({ label: this.label || undefined })}>${list}</div>`
      : list;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-steps": UiSteps;
  }
}
