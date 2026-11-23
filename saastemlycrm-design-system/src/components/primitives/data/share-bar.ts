import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, inlineRow, row, rowLine, stack, text } from "../layout/algebra.ts";
import { foldParts, sharePercents, type Slot } from "./visual-math.ts";

/**
 * Share bar: parts of a whole as one bar split end to end (a 100% stacked bar), the legend under
 * it: what a ring says, in the height of a line, for a small tile or a row of a card.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Identity by a fixed order of hues:** part 1 is `chart-1`, part 2 `chart-2` … up to six; a
 *   seventh and later fold into one "Other" in `chart-muted` (never a generated hue). The parts
 *   keep their own order (never sorted here), so the same part is the same hue on every screen.
 * - **A 2px gap** between touching segments, the bar's ends rounded.
 * - **Shares that add up:** the legend's percents are whole and sum to 100 (largest remainder,
 *   src/components/primitives/data/visual-math.ts, proved in tests/visuals-gauges.test.ts).
 * - **Text in text colours:** the legend's labels, values and shares never take a part's hue; a
 *   dot beside each carries it, so identity is never colour alone.
 * - **Alive:** the segments grow in from their middles one after the other as it enters
 *   (`share-in`, theme.css, as ambient motion; with Reduce motion they're simply there). Pointing
 *   at a segment or its chip in the legend (hover or focus) brings it forward (the others fade) and
 *   the line over the bar reads it; a part with `href` opens it (its chip is the link).
 * - The legend is what assistive tech reads (the bar is drawn, `aria-hidden`), and the line over
 *   it is a live region; `label` names the whole.
 *
 * No `<svg>`: the segments are flex items whose grow is their value.
 */
export const shareBar = rcva(`${stack} w-full gap-1.5`);
export const shareBarHead = rcva(`${row} items-baseline gap-x-2`);
export const shareBarLabel = rcva(`${rowLine} text-label-md text-on-surface-variant`);
export const shareBarTotal = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);
export const shareBarTrack = rcva(`${row} h-3 w-full gap-0.5 overflow-hidden [--clips:bar] rounded-full`);
export const shareBarSegment = rcva(
  "h-full min-w-1 basis-0 rounded-xs [animation:share-in_var(--duration-medium4)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--i)*var(--duration-short2))] [transition:opacity_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]",
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
      },
      dim: { true: "opacity-30", false: "" },
      link: { true: "cursor-pointer", false: "" },
    },
  },
);
export const shareBarLegend = rcva(`${row} items-center gap-x-3 gap-y-0.5`);
export const shareBarChip = rcva(
  `${inlineRow} items-center gap-1.5 rounded-field px-1 py-0.5 ${text.label} text-body-sm [transition:opacity_var(--duration-short4)_var(--ease-standard)]`,
  {
    variants: {
      dim: { true: "opacity-50", false: "" },
      link: { true: "cursor-pointer hover:underline", false: "" },
    },
  },
);
export const shareBarDot = rcva(`${fixed["2.5"]} rounded-full`, {
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
export const shareBarName = rcva(`${text.label} text-on-surface`);
export const shareBarAmount = rcva(`${text.label} tabular-nums text-on-surface`);
export const shareBarShare = rcva(`${text.label} tabular-nums text-on-surface-variant`);

export interface SharePart {
  label: string;
  value: number;
  /** How the value reads ("USD 41.7k"); left out, the number. */
  valueText?: string;
  /** Pointing at it and choosing it opens this (its chip is the link). */
  href?: string;
}

interface Drawn extends SharePart {
  slot: Slot;
  share: number;
}

/**
 * @example <ui-share-bar label="Pipeline by stage" total="USD 58.8k" .parts=${[{ label: "Quoted", value: 41.7, valueText: "USD 41.7k" }, { label: "Sourcing", value: 17.1, valueText: "USD 17.1k" }]}></ui-share-bar>
 */
@customElement("ui-share-bar")
export class UiShareBar extends LightElement {
  @property({ attribute: false }) parts: SharePart[] = [];
  /** The whole ("Pipeline by stage"): over the bar, and its name for screen readers. */
  @property() label = "";
  /** How the whole reads ("USD 58.8k"), over the bar's end; left out, nothing. */
  @property() total?: string;
  /** The part pointed at, by its index (-1: none). */
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.parts.length) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "share-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  #drawn(): Drawn[] {
    const folded = foldParts(this.parts);
    const shares = sharePercents(folded.map((f) => f.part.value));
    return folded.map((f, i) => ({ ...f.part, slot: f.slot, share: shares[i]! }));
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  render() {
    const parts = this.#drawn();
    const active = parts[this._active];
    const dim = (i: number) => this._active >= 0 && this._active !== i;
    return html`<div class=${shareBar()}>
      <div class=${shareBarHead()} aria-live="polite">
        <span class=${shareBarLabel()}>${active ? `${active.label} · ${active.share}%` : this.label}</span>
        <span class=${shareBarTotal()}
          >${active ? (active.valueText ?? String(active.value)) : (this.total ?? nothing)}</span
        >
      </div>
      <div class=${shareBarTrack()} aria-hidden="true" @pointerleave=${() => this.#set(-1)}>
        ${parts.map(
          (p, i) =>
            html`<span
              class=${shareBarSegment({ slot: p.slot, dim: dim(i), link: !!p.href })}
              style=${styleMap({ flexGrow: String(p.value), "--i": String(i) })}
              @pointerenter=${() => this.#set(i)}
              @click=${() => {
                if (p.href) this.querySelector<HTMLAnchorElement>(`a[data-part="${i}"]`)?.click();
              }}
            ></span>`,
        )}
      </div>
      <ul class=${shareBarLegend()} aria-label=${this.label || nothing}>
        ${parts.map((p, i) => {
          const body = html`<span class=${shareBarDot({ slot: p.slot })}></span>
            <span class=${shareBarName()}>${p.label}</span>
            <span class=${shareBarAmount()}>${p.valueText ?? String(p.value)}</span>
            <span class=${shareBarShare()}>${p.share}%</span>`;
          const cls = shareBarChip({ dim: dim(i), link: !!p.href });
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
      </ul>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-share-bar": UiShareBar;
  }
}
