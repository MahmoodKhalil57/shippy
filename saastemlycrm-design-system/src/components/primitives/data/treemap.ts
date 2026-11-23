import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { squarify } from "../../base/treemap.ts";
import { rcva } from "../../base/variants.ts";
import { stack, text } from "../layout/algebra.ts";

/**
 * Treemap: parts of a whole as rectangles tiling a box, each as big as its share, so the few that
 * make most of it are seen at once (spend by supplier, revenue by product line).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **Area is the amount** (squarified, src/components/base/treemap.ts, proved in
 *   tests/treemap.test.ts): the largest at the start corner, every cell as near square as the
 *   parts allow, together exactly the box.
 * - **Identity by a fixed order of hues:** the largest part is `chart-1`, the next `chart-2` … up to
 *   six; a seventh and later are each `chart-muted` (never a generated hue). A cell is its hue as a
 *   wash with a solid edge along its top, a 2px gap from its neighbours.
 * - **Text in text colours:** a cell's label and value are `on-surface` over the wash, never in the
 *   hue; a cell too small to hold them shows none (the readout and the list still have them).
 * - **Alive:** the cells grow and fade in as it enters, largest first (`cell-in`, theme.css; ambient
 *   motion); pointing at a cell (hover or focus, or Tab through them) brings it forward, fades the
 *   others, and the line under it reads it ("Shenzhen Brightway · USD 41.7k · 38%"); otherwise it
 *   reads the total. A cell with `href` is a link.
 * - It's a list of the parts for assistive tech, each named with its value and share; `label`
 *   names the whole; the readout is a live region.
 *
 * No `<svg>`: each cell is a positioned box, placed by `--x` `--y` `--w` `--h` (percentages).
 */
export const treemap = rcva(`${stack} w-full gap-2`);
/** The box the cells tile: the height it's given, at least 12rem. */
export const treemapPlot = rcva("relative h-full min-h-48 w-full overflow-hidden [--clips:shape] rounded-field");
export const treemapCell = rcva(
  "absolute start-(--x) top-(--y) w-(--w) max-w-full h-(--h) overflow-hidden [--clips:shape] rounded-sm border-2 border-transparent bg-clip-padding origin-top-left rtl:origin-top-right [animation:cell-in_var(--duration-long1)_var(--ease-emphasized-decelerate)_both] [animation-delay:calc(var(--i)*var(--duration-short2))] [transition:opacity_var(--duration-short4)_var(--ease-standard),background-color_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]",
  {
    variants: {
      slot: {
        "0": "bg-chart-1/30",
        "1": "bg-chart-2/30",
        "2": "bg-chart-3/30",
        "3": "bg-chart-4/30",
        "4": "bg-chart-5/30",
        "5": "bg-chart-6/30",
        muted: "bg-chart-muted/30",
      },
      on: { true: "", false: "" },
      dim: { true: "opacity-40", false: "" },
      link: { true: "cursor-pointer", false: "" },
    },
    compoundVariants: [
      { slot: "0", on: true, class: "bg-chart-1/55" },
      { slot: "1", on: true, class: "bg-chart-2/55" },
      { slot: "2", on: true, class: "bg-chart-3/55" },
      { slot: "3", on: true, class: "bg-chart-4/55" },
      { slot: "4", on: true, class: "bg-chart-5/55" },
      { slot: "5", on: true, class: "bg-chart-6/55" },
      { slot: "muted", on: true, class: "bg-chart-muted/55" },
    ],
  },
);
/** The cell's hue, solid, along its top edge. */
export const treemapEdge = rcva("pointer-events-none absolute inset-x-0 top-0 h-1", {
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
export const treemapText = rcva(`${stack} pointer-events-none absolute inset-x-1.5 top-2 gap-0.5`);
export const treemapName = rcva(`${text.line} text-label-md text-on-surface`);
export const treemapAmount = rcva(`${text.line} text-label-sm tabular-nums text-on-surface-variant`);
export const treemapReadout = rcva(`${text.label} text-label-md tabular-nums text-on-surface-variant`);

export interface TreemapItem {
  label: string;
  value: number;
  /** How the value reads ("USD 41.7k"); left out, the number. */
  valueText?: string;
  /** Choosing the cell opens this. */
  href?: string;
}

type Slot = "0" | "1" | "2" | "3" | "4" | "5" | "muted";
/** How much of a cell's text fits, by its size in px: label and value, the value, or nothing. */
const fits = (w: number, h: number): "both" | "value" | "none" =>
  w >= 64 && h >= 44 ? "both" : w >= 40 && h >= 24 ? "value" : "none";

/**
 * @example <ui-treemap label="Spend by supplier" total="USD 110k" .items=${[{ label: "Brightway", value: 41.7, valueText: "USD 41.7k" }, …]}></ui-treemap>
 */
@customElement("ui-treemap")
export class UiTreemap extends LightElement {
  @property({ attribute: false }) items: TreemapItem[] = [];
  /** The whole, for screen readers ("Spend by supplier"). */
  @property() label = "";
  /** How the whole reads ("USD 110k"), in the readout while no cell is pointed at; left out, the sum. */
  @property() total?: string;
  /** The cell pointed at, by its index in size order (-1: none). */
  @state() private _active = -1;
  /** The plot's size in px, so the cells are squarified for the box they're drawn in. */
  @state() private _box = { w: 320, h: 200 };
  #revealed = false;
  #observer?: ResizeObserver;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
    this.#observer = undefined;
  }

  protected firstUpdated() {
    const plot = this.querySelector<HTMLElement>("[data-treemap-plot]");
    if (!plot) return;
    this.#observer = new ResizeObserver(([e]) => {
      const w = Math.round(e!.contentRect.width);
      const h = Math.round(e!.contentRect.height);
      if (w > 0 && h > 0 && (w !== this._box.w || h !== this._box.h)) this._box = { w, h };
    });
    this.#observer.observe(plot);
  }

  protected updated() {
    if (!this.#revealed && this.items.some((x) => x.value > 0)) {
      this.#revealed = true;
      const enter = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "cell-in",
      );
      void motion.add(enter, "ambient", this);
    }
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  render() {
    const parts = this.items.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
    const sum = parts.reduce((t, x) => t + x.value, 0);
    const { w: W, h: H } = this._box;
    const rects = squarify(
      parts.map((x) => x.value),
      W,
      H,
    );
    const share = (v: number) => `${Math.round((v / (sum || 1)) * 100)}%`;
    const amount = (x: TreemapItem) => x.valueText ?? String(x.value);
    const on = parts[this._active];
    const readout = on
      ? `${on.label} · ${amount(on)} · ${share(on.value)}`
      : `${this.label ? `${this.label} · ` : ""}${this.total ?? String(sum)}`;
    return html`<div class=${treemap()}>
      <ul
        class=${treemapPlot()}
        data-treemap-plot
        aria-label=${this.label || nothing}
        @pointerleave=${() => this.#set(-1)}
      >
        ${parts.map((x, i) => {
          const r = rects[i]!;
          const slot: Slot = i < 6 ? (String(i) as Slot) : "muted";
          const show = fits(r.w, r.h);
          const cls = treemapCell({
            slot,
            on: this._active === i,
            dim: this._active >= 0 && this._active !== i,
            link: !!x.href,
          });
          const style = styleMap({
            "--x": `${(r.x / W) * 100}%`,
            "--y": `${(r.y / H) * 100}%`,
            "--w": `${(r.w / W) * 100}%`,
            "--h": `${(r.h / H) * 100}%`,
            "--i": String(i),
          });
          const name = `${x.label}, ${amount(x)}, ${share(x.value)}`;
          const body = html`<span class=${treemapEdge({ slot })}></span> ${
              show === "none"
                ? nothing
                : html`<span class=${treemapText()} aria-hidden="true">
                    ${show === "both" ? html`<span class=${treemapName()}>${x.label}</span>` : nothing}
                    <span class=${treemapAmount()}>${amount(x)}</span>
                  </span>`
            }`;
          const enter = () => this.#set(i);
          const leave = () => this.#set(-1);
          return x.href
            ? html`<li>
                <a
                  class=${cls}
                  style=${style}
                  href=${x.href}
                  aria-label=${name}
                  @pointerenter=${enter}
                  @focus=${enter}
                  @blur=${leave}
                  >${body}</a
                >
              </li>`
            : html`<li
                class=${cls}
                style=${style}
                tabindex="0"
                aria-label=${name}
                @pointerenter=${enter}
                @focus=${enter}
                @blur=${leave}
              >
                ${body}
              </li>`;
        })}
      </ul>
      <p class=${treemapReadout()} aria-live="polite">${readout}</p>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-treemap": UiTreemap;
  }
}
