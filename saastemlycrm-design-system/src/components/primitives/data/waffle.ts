import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../../lib/base/motion-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { fixed, fixedWidth, row, rowFill, rowGrow, rowLine, stack, text, tiles } from "../../../styles/algebra.ts";
import { cellCounts, foldParts, percentOf, percentText, type Slot } from "../../../lib/base/visual-math.ts";

export const waffle = rcva(`${row} w-full items-center gap-4`);
export const waffleGrid = rcva(`${tiles["2"]} ${stack} gap-0.5 rounded-xs`);
export const waffleRow = rcva(`${row} gap-0.5`);
export const waffleCell = rcva(
  `${rowGrow} aspect-square rounded-xs [animation:cell-in_var(--duration-medium2)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--c)*var(--duration-short1)/5)] [transition:opacity_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]`,
  {
    variants: {
      slot: {
        "0": "bg-chart-1",
        "1": "bg-chart-2",
        "2": "bg-chart-3",
        "3": "bg-chart-4",
        "4": "bg-chart-5",
        "5": "bg-chart-6",
        muted: "bg-chart-muted",
        empty: "bg-surface-container-highest",
      },
      dim: { true: "opacity-30", false: "" },
    },
  },
);
export const waffleSide = rcva(`${stack} ${rowFill} gap-1`);
export const waffleReading = rcva(`${stack} gap-0.5`);
export const waffleValue = rcva(`${text.label} text-title-md tabular-nums text-on-surface`);
export const waffleCaption = rcva(`${text.label} line-clamp-2 text-label-md text-on-surface-variant`);
export const waffleLegend = rcva(`${stack} gap-0.5`);
export const waffleItem = rcva(`${row} items-center gap-2 rounded-field px-1 py-0.5 ${text.label} text-body-sm`, {
  variants: {
    link: { true: "cursor-pointer hover:underline", false: "" },
  },
});
/** Focusing a part dims the other parts' marks; legend text keeps full contrast. */
export const waffleDot = rcva(
  `${fixed["2.5"]} rounded-xs [transition:opacity_var(--duration-short4)_var(--ease-standard)]`,
  {
    variants: {
      dim: { true: "opacity-30", false: "" },
      slot: {
        "0": "bg-chart-1",
        "1": "bg-chart-2",
        "2": "bg-chart-3",
        "3": "bg-chart-4",
        "4": "bg-chart-5",
        "5": "bg-chart-6",
        muted: "bg-chart-muted",
      },
    },
  },
);
export const waffleLabel = rcva(`${rowLine} text-on-surface`);
export const waffleAmount = rcva(`${text.label} tabular-nums text-on-surface`);
export const waffleShare = rcva(`${fixedWidth["10"]} ${text.label} text-end tabular-nums text-on-surface-variant`);

export interface WafflePart {
  label: string;
  value: number;
  valueText?: string;
  href?: string;
}

interface Drawn extends WafflePart {
  slot: Slot;
  cells: number;
}

const CELLS = 100;

@customElement("ui-waffle")
export class UiWaffle extends LightElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label = "";
  @property({ attribute: "value-text" }) valueText = "";
  @property() caption = "";
  @property({ attribute: false }) parts?: WafflePart[];
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  get #max() {
    return Number.isFinite(this.max) ? this.max : 100;
  }

  #drawn(): Drawn[] {
    const given = this.parts?.length ? this.parts : [{ label: this.label || this.caption, value: this.value }];
    const folded = foldParts(given);
    const counts = cellCounts(
      folded.map((f) => f.part.value),
      this.#max,
      CELLS,
    );
    return folded.map((f, i) => ({ ...f.part, slot: f.slot, cells: counts[i]! }));
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  render() {
    const drawn = this.#drawn();
    const many = !!this.parts?.length;
    const sum = drawn.reduce((t, p) => t + p.value, 0);
    const whole = Math.max(sum, this.#max) || 1;
    const share = (v: number) => percentText(percentOf(v, whole) ?? 0);
    const owner: number[] = drawn.flatMap((p, i) => Array.from({ length: p.cells }, () => i));
    while (owner.length < CELLS) owner.push(-1);
    const active = drawn[this._active];
    const value = active
      ? (active.valueText ?? formatInt(active.value))
      : many
        ? this.valueText || share(sum)
        : this.valueText || share(this.value);
    const caption = active ? [active.label, share(active.value)].filter(Boolean).join(" · ") : this.caption;
    const grid = html`${Array.from(
      { length: 10 },
      (_, r) =>
        html`<div class=${waffleRow()}>
          ${owner.slice(r * 10, r * 10 + 10).map((o, c) => {
            const i = r * 10 + c;
            return html`<span
              class=${waffleCell({
                slot: o < 0 ? "empty" : drawn[o]!.slot,
                dim: this._active >= 0 && o !== this._active,
              })}
              style=${styleMap({ "--c": String(i) })}
              @pointerenter=${() => this.#set(o)}
              @click=${() => {
                if (o >= 0 && drawn[o]!.href) this.querySelector<HTMLAnchorElement>(`a[data-part="${o}"]`)?.click();
              }}
            ></span>`;
          })}
        </div>`,
    )}`;
    return html`<div class=${waffle()}>
      ${
        many
          ? html`<div class=${waffleGrid()} aria-hidden="true" @pointerleave=${() => this.#set(-1)}>${grid}</div>`
          : html`<div
              class=${waffleGrid()}
              role="meter"
              tabindex="0"
              aria-label=${this.label || this.caption || m.waffle_label()}
              aria-valuenow=${Number.isFinite(this.value) ? this.value : 0}
              aria-valuemin="0"
              aria-valuemax=${this.#max}
              aria-valuetext=${
                this.caption
                  ? m.waffle_reading({ value: this.valueText || share(this.value), caption: this.caption })
                  : this.valueText || share(this.value)
              }
              @pointerleave=${() => this.#set(-1)}
              @focus=${() => this.#set(0)}
              @blur=${() => this.#set(-1)}
            >
              ${grid}
            </div>`
      }
      <div class=${waffleSide()}>
        <div class=${waffleReading()} aria-live=${many ? "polite" : nothing} aria-hidden=${many ? nothing : "true"}>
          <span class=${waffleValue()}>${value}</span>
          ${caption ? html`<span class=${waffleCaption()}>${caption}</span>` : nothing}
        </div>
        ${
          many
            ? html`<ul class=${waffleLegend()} aria-label=${this.label || nothing}>
                ${drawn.map((p, i) => {
                  const dim = this._active >= 0 && this._active !== i;
                  const body = html`<span class=${waffleDot({ slot: p.slot, dim })}></span>
                    <span class=${waffleLabel()}>${p.label}</span>
                    <span class=${waffleAmount()}>${p.valueText ?? formatInt(p.value)}</span>
                    <span class=${waffleShare()}>${share(p.value)}</span>`;
                  const cls = waffleItem({ link: !!p.href });
                  const on = () => this.#set(i);
                  const off = () => this.#set(-1);
                  return html`<li>
                    ${
                      p.href
                        ? html`<a
                            class=${cls}
                            href=${p.href}
                            data-part=${i}
                            @pointerenter=${on}
                            @pointerleave=${off}
                            @focus=${on}
                            @blur=${off}
                            >${body}</a
                          >`
                        : html`<div
                            class=${cls}
                            tabindex="0"
                            @pointerenter=${on}
                            @pointerleave=${off}
                            @focus=${on}
                            @blur=${off}
                          >
                            ${body}
                          </div>`
                    }
                  </li>`;
                })}
              </ul>`
            : nothing
        }
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-waffle": UiWaffle;
  }
}
