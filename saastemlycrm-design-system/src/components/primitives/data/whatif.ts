import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { formatInt, m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { range } from "../forms/range.ts";
import { inlineRow, inset, pad, row, rowFill, stack, text } from "../../../styles/algebra.ts";

export const whatif = rcva(`${stack} w-full gap-3`);
export const whatifInputs = rcva(`${stack} gap-2`);
export const whatifInput = rcva(`${stack} gap-1`);
export const whatifInputHead = rcva(`${row} items-baseline gap-x-2`);
export const whatifInputLabel = rcva(`${rowFill} truncate text-body-md text-on-surface`);
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
  value: number;
  format?: (n: number) => string;
}

export interface WhatifOutput {
  label: string;
  value: string;
  tone?: "success" | "warning" | "error";
  note?: string;
}

@customElement("ui-whatif")
export class UiWhatif extends LightElement {
  @property({ attribute: false }) inputs: WhatifInput[] = [];
  @property({ attribute: false }) compute: (values: Record<string, number>) => WhatifOutput[] = () => [];
  @property() label = "";
  @state() private _values: Record<string, number> = {};
  #shape = "";
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
    for (const el of this.querySelectorAll<HTMLElement>("[data-output]")) {
      const key = el.dataset.output!;
      const now = el.dataset.value!;
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
    const read = (i: WhatifInput) => (i.format ? i.format(values[i.key]!) : formatInt(values[i.key]!));
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
                .value=${String(values[i.key])}
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
          ${m.whatif_reset()}
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
