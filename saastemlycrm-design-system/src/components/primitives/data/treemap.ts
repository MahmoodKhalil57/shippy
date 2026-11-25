import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, intl, m } from "../../../i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { squarify } from "../../base/treemap.ts";
import { rcva } from "../../base/variants.ts";
import { stack, text } from "../layout/algebra.ts";

export const treemap = rcva(`${stack} w-full gap-2`);
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
  valueText?: string;
  href?: string;
}

type Slot = "0" | "1" | "2" | "3" | "4" | "5" | "muted";
const fits = (w: number, h: number): "both" | "value" | "none" =>
  w >= 64 && h >= 44 ? "both" : w >= 40 && h >= 24 ? "value" : "none";

@customElement("ui-treemap")
export class UiTreemap extends LightElement {
  @property({ attribute: false }) items: TreemapItem[] = [];
  @property() label = "";
  @property() total?: string;
  @state() private _active = -1;
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
    const share = (v: number) => intl.number({ style: "percent", maximumFractionDigits: 0 }).format(v / (sum || 1));
    const amount = (x: TreemapItem) => x.valueText ?? formatInt(x.value);
    const on = parts[this._active];
    const readout = on
      ? `${on.label} · ${amount(on)} · ${share(on.value)}`
      : `${this.label ? `${this.label} · ` : ""}${this.total ?? formatInt(sum)}`;
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
          const name = m.treemap_cell({ label: x.label, amount: amount(x), share: share(x.value) });
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
