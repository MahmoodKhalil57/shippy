import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, inlineRow, row, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { inlineStep } from "../../base/reading.ts";
import { m } from "../../../i18n/index.ts";

export const rating = rcva(`${row} items-center gap-x-3 gap-y-1`);
export const ratingStars = rcva(
  `${inlineRow} items-center gap-0.5 [&:has(>button:hover)>button]:text-warning [&>button:hover~button]:text-outline-variant`,
);
export const ratingStar = rcva(
  `${inlineRow} ${fixed["8"]} touch-target cursor-pointer items-center justify-center rounded-full [transition:color_var(--duration-effects-fast)_var(--ease-effects-fast),scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] hover:scale-110 disabled:cursor-default motion-reduce:transition-none [&>svg]:fill-current`,
  {
    variants: {
      on: { true: "text-warning", false: "text-outline-variant" },
      picked: {
        true: "[animation:field-pop_var(--duration-medium2)_var(--ease-spatial-fast)] motion-reduce:animate-none",
      },
    },
  },
);
export const ratingWords = rcva(`${text.label} text-label-lg tabular-nums text-on-surface-variant`);

@customElement("ui-rating")
export class UiRating extends LightElement {
  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) max = 5;
  @property() label = "";
  @property({ attribute: false }) words: string[] = [];
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;

  #picked = 0;

  private _set(n: number | null) {
    if (this.disabled || n === this.value) return;
    this.#picked = n ?? 0;
    this.value = n;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { value: n }, bubbles: true }));
  }

  private _key(e: KeyboardEvent) {
    const cur = this.value ?? 0;
    const step = inlineStep(e.key, this) || (e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0);
    const next =
      step > 0
        ? Math.min(this.max, cur + 1)
        : step < 0
          ? Math.max(1, cur - 1)
          : e.key === "Home"
            ? 1
            : e.key === "End"
              ? this.max
              : undefined;
    if (next === undefined) return;
    e.preventDefault();
    this._set(next);
    void this.updateComplete.then(() => this.querySelectorAll<HTMLButtonElement>("button")[next - 1]?.focus());
  }

  render() {
    const v = this.value ?? 0;
    const words = v ? (this.words[v - 1] ?? m.rating_of({ value: v, max: this.max })) : m.rating_none();
    return html`<div class=${rating()}>
      <div class=${ratingStars()} role="radiogroup" aria-label=${this.label || nothing} @keydown=${this._key}>
        ${Array.from({ length: this.max }, (_, i) => {
          const n = i + 1;
          const star = html`<button
            type="button"
            role="radio"
            class=${ratingStar({ on: n <= v, picked: n === this.#picked })}
            aria-checked=${String(n === v)}
            aria-label=${this.words[i] ? m.rating_star_words({ value: n, words: this.words[i] }) : m.rating_of({ value: n, max: this.max })}
            tabindex=${n === (v || 1) ? "0" : "-1"}
            ?disabled=${this.disabled}
            @click=${() => this._set(n === v && !this.required ? null : n)}
          >
            ${iconSvg("star", { size: "md" })}
          </button>`;
          return n === this.#picked ? keyed(`${n}:${v}`, star) : star;
        })}
      </div>
      <span class=${ratingWords()}>${words}</span>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-rating": UiRating;
  }
}
