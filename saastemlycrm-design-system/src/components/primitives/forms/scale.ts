import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowGrow, stack, text } from "../layout/algebra.ts";

/**
 * Scale: one step of a short whole range, every step in view (an urgency 1–5, a fit 0–10).
 *
 * Purpose: Forms & input · Kind: primitive
 *
 * The steps as numbered cells sharing the width, a radio group. The steps up to the chosen one
 * fill in one hue that deepens towards the top of the scale (sequential, light to dark, so the
 * further it goes the more it reads), the chosen one swells as it's picked (`field-pop`, none with
 * Reduce motion), and the ends say what they mean (`low` / `high`: "Routine" … "Critical").
 * Keyboard: ← / → (or ↑ / ↓), Home / End. Fires `ui-change` { value }.
 */
export const scale = rcva(`${stack} gap-1.5`);
export const scaleSteps = rcva(`${row} gap-1`);
export const scaleStep = rcva(
  `${rowGrow} ${text.label} touch-target h-10 cursor-pointer rounded-field text-label-lg tabular-nums [transition:background-color_var(--duration-effects)_var(--ease-effects),color_var(--duration-effects)_var(--ease-effects),border-radius_var(--duration-spatial-fast)_var(--ease-spatial-fast)] disabled:cursor-default motion-reduce:transition-none`,
  {
    variants: {
      /** Up to the chosen step: the hue at its level (`--level`, 0 to 1). */
      on: {
        true: "bg-[color-mix(in_oklab,var(--color-primary)_calc(30%+var(--level)*70%),var(--color-primary-container))] text-on-primary",
        false: "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high",
      },
      chosen: {
        true: "rounded-full [animation:field-pop_var(--duration-medium2)_var(--ease-spatial-fast)] motion-reduce:animate-none",
      },
    },
  },
);
export const scaleEnds = rcva(`${row} justify-between gap-2 text-label-sm text-on-surface-variant`);

/**
 * @example <ui-scale label="Urgency" .min=${1} .max=${5} .value=${4} low="Routine" high="Critical"></ui-scale>
 */
@customElement("ui-scale")
export class UiScale extends LightElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max = 5;
  /** Its accessible name. */
  @property() label = "";
  /** What the lowest and highest steps mean. */
  @property() low = "";
  @property() high = "";
  @property({ type: Boolean }) disabled = false;

  private _set(n: number) {
    if (this.disabled || n === this.value) return;
    this.value = n;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: n }, bubbles: true }));
  }

  private _key(e: KeyboardEvent) {
    const cur = this.value ?? this.min;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowUp"
        ? Math.min(this.max, cur + 1)
        : e.key === "ArrowLeft" || e.key === "ArrowDown"
          ? Math.max(this.min, cur - 1)
          : e.key === "Home"
            ? this.min
            : e.key === "End"
              ? this.max
              : undefined;
    if (next === undefined) return;
    e.preventDefault();
    this._set(next);
    void this.updateComplete.then(() => this.querySelectorAll<HTMLButtonElement>("button")[next - this.min]?.focus());
  }

  render() {
    const steps = Array.from({ length: Math.max(0, this.max - this.min + 1) }, (_, i) => this.min + i);
    const span = Math.max(1, this.max - this.min);
    return html`<div class=${scale()}>
      <div class=${scaleSteps()} role="radiogroup" aria-label=${this.label || nothing} @keydown=${this._key}>
        ${steps.map((n) => {
          const on = this.value != null && n <= this.value;
          const chosen = n === this.value;
          const step = html`<button
            type="button"
            role="radio"
            class=${scaleStep({ on, chosen })}
            style=${styleMap({ "--level": String((n - this.min) / span) })}
            aria-checked=${String(chosen)}
            tabindex=${n === (this.value ?? this.min) ? "0" : "-1"}
            ?disabled=${this.disabled}
            @click=${() => this._set(n)}
          >
            ${n}
          </button>`;
          return chosen ? keyed(`chosen-${n}`, step) : step;
        })}
      </div>
      ${this.low || this.high ? html`<div class=${scaleEnds()}><span>${this.low}</span><span>${this.high}</span></div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-scale": UiScale;
  }
}
