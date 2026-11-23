import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, fixedWidth, row, rowFill, rowGrow, rowLine, stack, text, tiles } from "../layout/algebra.ts";
import { cellCounts, foldParts, percentOf, type Slot } from "./visual-math.ts";

/**
 * Waffle: a share as a hundred cells (ten by ten), each cell one percent of the whole: "38 of
 * every 100 quotes are won" reads more surely as cells than as an angle. With `parts`, several
 * shares of one whole fill the cells one after the other, a legend beside them.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Identity by a fixed order of hues:** one share is `chart-1`; parts take `chart-1` … `chart-6`
 *   in their own order, a seventh and later folding into one "Other" in `chart-muted`. The cells
 *   not filled are the track (the highest container colour).
 * - **Whole cells, exactly:** each part fills its share of the cells by the largest remainder, so
 *   the filled cells are the whole's share to the percent and no part is short or over by more
 *   than one cell (src/components/primitives/data/visual-math.ts, proved in
 *   tests/visuals-gauges.test.ts).
 * - **Text in text colours:** the reading and the legend in ink; a dot beside each legend row
 *   carries its hue, so identity is never colour alone.
 * - **Alive:** the cells fill one after another as it enters (`cell-in`, theme.css, a token ×
 *   the cell's index; ambient motion, and with Reduce motion they're simply there). Pointing at a
 *   part's cells, or its legend row (hover or focus), brings its cells forward (the rest fade) and
 *   the reading says that part: its value, label and share. A part with `href` opens it.
 * - One share is a `meter` for assistive tech; parts are the legend's list. `label` names it.
 *
 * No `<svg>`: the cells are boxes in ten rows of ten.
 */
export const waffle = rcva(`${row} w-full items-center gap-4`);
/** The cells: two tiles square, ten rows of ten. */
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
export const waffleItem = rcva(
  `${row} items-center gap-2 rounded-field px-1 py-0.5 ${text.label} text-body-sm [transition:opacity_var(--duration-short4)_var(--ease-standard)]`,
  {
    variants: {
      dim: { true: "opacity-50", false: "" },
      link: { true: "cursor-pointer hover:underline", false: "" },
    },
  },
);
export const waffleDot = rcva(`${fixed["2.5"]} rounded-xs`, {
  variants: {
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
});
export const waffleLabel = rcva(`${rowLine} text-on-surface`);
export const waffleAmount = rcva(`${text.label} tabular-nums text-on-surface`);
export const waffleShare = rcva(`${fixedWidth["10"]} ${text.label} text-end tabular-nums text-on-surface-variant`);

export interface WafflePart {
  label: string;
  value: number;
  /** How the value reads ("USD 41.7k"); left out, the number. */
  valueText?: string;
  /** Pointing at it and choosing it opens this (its legend row is the link). */
  href?: string;
}

interface Drawn extends WafflePart {
  slot: Slot;
  cells: number;
}

const CELLS = 100;

/**
 * @example <ui-waffle label="Quotes won" caption="of quotes won" .value=${38} value-text="38%"></ui-waffle>
 * @example <ui-waffle label="Lines by stage" caption="of 120 lines" .max=${120} .parts=${[{ label: "Quoted", value: 54 }, { label: "Sourcing", value: 30 }]}></ui-waffle>
 */
@customElement("ui-waffle")
export class UiWaffle extends LightElement {
  /** The share (without `parts`), out of `max`. */
  @property({ type: Number }) value = 0;
  /** The whole the cells stand for; with parts, the parts' sum when that's more. */
  @property({ type: Number }) max = 100;
  /** The whole, for screen readers ("Quotes won"). */
  @property() label = "";
  /** How the share reads ("38%"); left out, its percent of the whole. */
  @property({ attribute: "value-text" }) valueText = "";
  /** What the share is, under it ("of quotes won"). */
  @property() caption = "";
  /** Several shares of the one whole, in their order; they fill the cells one after the other. */
  @property({ attribute: false }) parts?: WafflePart[];
  /** The part pointed at, by its index (-1: none). */
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

  #drawn(): Drawn[] {
    const given = this.parts?.length ? this.parts : [{ label: this.label || this.caption, value: this.value }];
    const folded = foldParts(given);
    const counts = cellCounts(
      folded.map((f) => f.part.value),
      this.max,
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
    const whole = Math.max(sum, this.max) || 1;
    const share = (v: number) => `${percentOf(v, whole) ?? 0}%`;
    // Which part each cell belongs to, in reading order (-1: not filled).
    const owner: number[] = drawn.flatMap((p, i) => Array.from({ length: p.cells }, () => i));
    while (owner.length < CELLS) owner.push(-1);
    const active = drawn[this._active];
    const value = active
      ? (active.valueText ?? String(active.value))
      : many
        ? this.valueText || share(sum)
        : this.valueText || share(this.value);
    const caption = active ? `${active.label} · ${share(active.value)}` : this.caption;
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
              aria-label=${this.label || this.caption || "Share"}
              aria-valuenow=${this.value}
              aria-valuemin="0"
              aria-valuemax=${this.max}
              aria-valuetext=${`${this.valueText || share(this.value)}${this.caption ? ` ${this.caption}` : ""}`}
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
                  const body = html`<span class=${waffleDot({ slot: p.slot })}></span>
                    <span class=${waffleLabel()}>${p.label}</span>
                    <span class=${waffleAmount()}>${p.valueText ?? String(p.value)}</span>
                    <span class=${waffleShare()}>${share(p.value)}</span>`;
                  const cls = waffleItem({ dim: this._active >= 0 && this._active !== i, link: !!p.href });
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
