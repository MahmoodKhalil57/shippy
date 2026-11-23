import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, fixedWidth, inlineRow, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Stepper: a whole number nudged up or down (days, pieces, people), or typed.
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * − and + on either side of the number, each a 48px target, greyed at `min` / `max`; the number
 * itself can be typed (and the arrow keys step it), its unit after it (`unit`: "days"). A new
 * value swells as it lands (`field-pop`, none with Reduce motion). Fires `ui-change` { value }
 * (`null` when emptied).
 */
export const stepper = rcva(`${inlineRow} items-center gap-1 rounded-full bg-surface-container-highest p-1`);
export const stepperButton = rcva(
  `${inlineRow} ${fixed["10"]} touch-target state-layer cursor-pointer items-center justify-center rounded-full bg-surface text-on-surface shadow-elevation-1 [transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] active:scale-90 disabled:cursor-default disabled:opacity-40 disabled:shadow-none motion-reduce:transition-none`,
);
export const stepperValue = rcva(
  `${inlineRow} items-baseline justify-center gap-1 rounded-full px-2 [transition:background-color_var(--duration-effects)_var(--ease-effects),box-shadow_var(--duration-effects)_var(--ease-effects)] has-[>input:focus]:bg-surface has-[>input:focus]:inset-ring-2 has-[>input:focus]:inset-ring-primary`,
);
export const stepperInput = rcva(
  `${text.label} ${fixedWidth["12"]} bg-transparent text-center text-title-lg tabular-nums text-on-surface caret-primary outline-none [--focus:field] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [animation:field-pop_var(--duration-medium2)_var(--ease-spatial-fast)] motion-reduce:animate-none`,
);
export const stepperUnit = rcva("text-label-md text-on-surface-variant");

/**
 * @example <ui-stepper label="Payment terms" .value=${30} .min=${0} .max=${120} .step=${15} unit="days"></ui-stepper>
 */
@customElement("ui-stepper")
export class UiStepper extends LightElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) step = 1;
  /** Its unit, after the number ("days", "pcs"). */
  @property() unit = "";
  /** Its accessible name. */
  @property() label = "";
  @property() placeholder = "";
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: "input-id" }) inputId?: string;

  private _clamp(n: number) {
    return Math.min(this.max ?? Infinity, Math.max(this.min ?? -Infinity, n));
  }

  private _set(n: number | null) {
    const next = n == null ? null : this._clamp(n);
    if (next === this.value) return;
    this.value = next;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: next }, bubbles: true }));
  }

  private _by(dir: 1 | -1) {
    this._set((this.value ?? this.min ?? 0) + dir * this.step);
  }

  render() {
    const v = this.value;
    const input = html`<input
      id=${this.inputId ?? nothing}
      class=${stepperInput()}
      type="number"
      inputmode="numeric"
      aria-label=${this.label || nothing}
      placeholder=${this.placeholder || nothing}
      .value=${live(v == null ? "" : String(v))}
      min=${this.min ?? nothing}
      max=${this.max ?? nothing}
      step=${this.step}
      ?disabled=${this.disabled}
      @change=${(e: Event) => {
        const raw = (e.target as HTMLInputElement).value;
        this._set(raw === "" ? null : Number(raw));
      }}
    />`;
    return html`<div class=${stepper()}>
      <button
        type="button"
        class=${stepperButton()}
        aria-label=${`Less${this.label ? ` ${this.label}` : ""}`}
        ?disabled=${this.disabled || (this.min != null && v != null && v <= this.min)}
        @click=${() => this._by(-1)}
      >
        ${iconSvg("minus", { size: "sm" })}
      </button>
      <span class=${stepperValue()}>
        ${keyed(String(v), input)} ${this.unit ? html`<span class=${stepperUnit()}>${this.unit}</span>` : nothing}
      </span>
      <button
        type="button"
        class=${stepperButton()}
        aria-label=${`More${this.label ? ` ${this.label}` : ""}`}
        ?disabled=${this.disabled || (this.max != null && v != null && v >= this.max)}
        @click=${() => this._by(1)}
      >
        ${iconSvg("plus", { size: "sm" })}
      </button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stepper": UiStepper;
  }
}
