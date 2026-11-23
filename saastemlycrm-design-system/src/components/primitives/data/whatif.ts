import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { range } from "../forms/range.ts";
import { inlineRow, inset, pad, row, rowFill, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * What-if: a live calculator. Sliders in, figures out, worked out again as a slider moves ("if
 * the freight were 12% more and the margin 18%, the quote would be…").
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The rules it follows:
 * - **Inputs are native range inputs** with the range recipe (`range()`, forms/range.ts), each
 *   named by its label and its value shown beside it (and read out, `aria-valuetext`), in the
 *   input's own `format`.
 * - **Figures in text colours,** a tone only for what the tone means (`success`, `warning`,
 *   `error` inks) with a note under it, so colour is never alone.
 * - **Alive:** `compute` runs on every `input` (as the thumb moves, not when it's let go); a
 *   figure whose value changed flashes its container colour and fades back (a CSS transition on
 *   `data-flash`, M3 tokens; none with Reduce motion). The figures are a live region. "Reset"
 *   puts every slider back to where it started; it's off while they're there.
 * - Emits `ui-whatif-change` with `{ values }` on every change (bubbles, composed).
 *
 * @example <ui-whatif label="Quote what-if" .inputs=${[{ key: "margin", label: "Margin", min: 0, max: 40, step: 1, value: 18, format: (n) => `${n}%` }]} .compute=${(v) => [{ label: "Price", value: `USD ${(1000 * (1 + v.margin / 100)).toFixed(0)}` }]}></ui-whatif>
 */
export const whatif = rcva(`${stack} w-full gap-3`);
export const whatifInputs = rcva(`${stack} gap-2`);
export const whatifInput = rcva(`${stack} gap-1`);
export const whatifInputHead = rcva(`${row} items-baseline gap-x-2`);
export const whatifInputLabel = rcva(`${rowLine} text-body-md text-on-surface`);
export const whatifInputValue = rcva(`${text.label} text-label-lg tabular-nums text-on-surface-variant`);
export const whatifOutputs = rcva(`${row} gap-2`);
export const whatifOutput = rcva(
  `${stack} ${rowFill} ${inset["2"]} gap-0.5 rounded-sm py-1.5 bg-surface-container-low [transition:background-color_var(--duration-long2)_var(--ease-standard)] data-flash:bg-primary-container data-flash:[transition:none] motion-reduce:[transition:none]`,
);
export const whatifOutputLabel = rcva(`${text.label} text-label-md text-on-surface-variant`);
export const whatifOutputValue = rcva(`${text.label} text-title-lg tabular-nums`, {
  variants: {
    tone: {
      none: "text-on-surface",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
    },
  },
});
export const whatifOutputNote = rcva(`${text.label} text-body-sm text-on-surface-variant`);
export const whatifFoot = rcva(`${row} justify-end`);
export const whatifReset = rcva(
  `${inlineRow} ${pad["2"]} touch-target state-layer cursor-pointer items-center rounded-full py-1.5 text-label-lg text-primary disabled:cursor-default disabled:text-on-surface-disabled`,
);

export interface WhatifInput {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  /** Where it starts (and where Reset puts it back). */
  value: number;
  /** How its value reads ("18%"); left out, the number. */
  format?: (n: number) => string;
}

export interface WhatifOutput {
  label: string;
  value: string;
  tone?: "success" | "warning" | "error";
  note?: string;
}

/**
 * @example <ui-whatif label="Quote what-if" .inputs=${inputs} .compute=${compute}></ui-whatif>
 */
@customElement("ui-whatif")
export class UiWhatif extends LightElement {
  @property({ attribute: false }) inputs: WhatifInput[] = [];
  /** The figures for a set of values, worked out again on every change. */
  @property({ attribute: false }) compute: (values: Record<string, number>) => WhatifOutput[] = () => [];
  /** The whole, for screen readers ("Quote what-if"). */
  @property() label = "";
  @state() private _values: Record<string, number> = {};
  /** The inputs' shape last seen: a new array with the same inputs keeps what was moved. */
  #shape = "";
  /** Each figure's value at the last render, by its label. */
  #was = new Map<string, string>();

  #initial(): Record<string, number> {
    return Object.fromEntries(this.inputs.map((i) => [i.key, i.value]));
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has("inputs")) {
      const shape = JSON.stringify(this.inputs.map((i) => [i.key, i.min, i.max, i.step, i.value]));
      if (shape !== this.#shape) {
        this.#shape = shape;
        this._values = this.#initial();
      }
    }
  }

  protected updated() {
    // Flash each figure that changed: set the flag, let the style see it, then let it fade.
    for (const el of this.querySelectorAll<HTMLElement>("[data-output]")) {
      const key = el.dataset.output!;
      const now = el.dataset.value ?? "";
      const was = this.#was.get(key);
      this.#was.set(key, now);
      if (was === undefined || was === now) continue;
      el.dataset.flash = "";
      void getComputedStyle(el).backgroundColor;
      delete el.dataset.flash;
    }
  }

  #set(values: Record<string, number>) {
    this._values = values;
    this.dispatchEvent(
      new CustomEvent("ui-whatif-change", { detail: { values: { ...values } }, bubbles: true, composed: true }),
    );
  }

  render() {
    const values = this._values;
    const initial = this.#initial();
    const moved = this.inputs.some((i) => values[i.key] !== initial[i.key]);
    const outputs = this.compute(values);
    const read = (i: WhatifInput) => (i.format ? i.format(values[i.key] ?? i.value) : String(values[i.key] ?? i.value));
    return html`<div class=${whatif()} role="group" aria-label=${this.label || nothing}>
      <div class=${whatifInputs()}>
        ${this.inputs.map(
          (i) =>
            html`<label class=${whatifInput()}>
              <span class=${whatifInputHead()}>
                <span class=${whatifInputLabel()}>${i.label}</span>
                <span class=${whatifInputValue()} aria-hidden="true">${read(i)}</span>
              </span>
              <input
                type="range"
                class=${range({ size: "xs", color: "primary", width: "full" })}
                min=${i.min}
                max=${i.max}
                step=${i.step}
                .value=${String(values[i.key] ?? i.value)}
                aria-label=${i.label}
                aria-valuetext=${read(i)}
                @input=${(e: Event) =>
                  this.#set({ ...this._values, [i.key]: Number((e.target as HTMLInputElement).value) })}
              />
            </label>`,
        )}
      </div>
      <div class=${whatifOutputs()} aria-live="polite">
        ${outputs.map(
          (o) =>
            html`<div class=${whatifOutput()} data-output=${o.label} data-value=${o.value}>
              <span class=${whatifOutputLabel()}>${o.label}</span>
              <span class=${whatifOutputValue({ tone: o.tone ?? "none" })}>${o.value}</span>
              ${o.note ? html`<span class=${whatifOutputNote()}>${o.note}</span>` : nothing}
            </div>`,
        )}
      </div>
      <div class=${whatifFoot()}>
        <button type="button" class=${whatifReset()} ?disabled=${!moved} @click=${() => this.#set(this.#initial())}>
          Reset
        </button>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-whatif": UiWhatif;
  }
}
