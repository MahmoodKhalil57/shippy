import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { groupName } from "./fieldset.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { row, rowGrow, stack, text } from "../../../styles/algebra.ts";
import { inlineStep } from "../../../lib/base/reading.ts";
import { formatInt } from "../../../lib/i18n/index.ts";

export const scale = rcva(`${stack} gap-1.5`);
export const scaleSteps = rcva(`${row} gap-1`);
export const scaleStep = rcva(
  `${rowGrow} ${text.label} touch-target h-10 cursor-pointer rounded-field text-label-lg tabular-nums [transition:background-color_var(--duration-effects)_var(--ease-effects),color_var(--duration-effects)_var(--ease-effects),border-radius_var(--duration-spatial-fast)_var(--ease-spatial-fast)] disabled:cursor-default motion-reduce:transition-none`,
  {
    variants: {
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

@customElement("ui-scale")
export class UiScale extends LightElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max = 5;
  @property() label = "";
  @property() low = "";
  @property() high = "";
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: "aria-label" }) ariaLabelText?: string;
  @property({ attribute: "input-id" }) inputId = uid("scale");

  private _set(n: number) {
    if (this.disabled || n === this.value) return;
    this.value = n;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: n }, bubbles: true }));
  }

  private _key(e: KeyboardEvent) {
    const cur = this.value ?? this.min;
    const step = inlineStep(e.key, this) || (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0);
    const next =
      step > 0
        ? Math.min(this.max, cur + 1)
        : step < 0
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
    const name = groupName(this, { ariaLabel: this.ariaLabelText, label: this.label, controlId: this.inputId });
    return html`<div class=${scale()}>
      <div
        class=${scaleSteps()}
        id=${this.inputId}
        role="radiogroup"
        aria-label=${name.label ?? nothing}
        aria-labelledby=${name.labelledby ?? nothing}
        @keydown=${this._key}
      >
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
            ${formatInt(n)}
          </button>`;
          return step;
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
