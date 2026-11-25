import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, m } from "../../../i18n/index.ts";
import { isRtl } from "../../base/reading.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { bridge, bridgeAt, bridgeDomain, bridgeFit, type BridgeColumn } from "../../base/waterfall.ts";
import { fixed, row, stack, text } from "../layout/algebra.ts";

export const waterfall = rcva(`${stack} w-full gap-2`);
export const waterfallPlot = rcva("relative h-40 w-full");
export const waterfallSlot = rcva(
  "absolute inset-y-0 start-(--x) w-(--w) max-w-full rounded-xs [transition:opacity_var(--duration-short4)_var(--ease-standard)]",
  {
    variants: {
      dim: { true: "opacity-40", false: "" },
      on: { true: "bg-on-surface/(--state-hover)", false: "" },
    },
  },
);
export const waterfallBar = rcva(
  "pointer-events-none absolute inset-x-[18%] bottom-(--b) h-(--h) min-h-px rounded-xs [transition:scale_var(--duration-long2)_var(--ease-emphasized-decelerate)_calc(var(--i)*var(--duration-short2))] motion-reduce:transition-none starting:scale-y-0",
  {
    variants: {
      kind: {
        up: "origin-bottom bg-chart-1",
        down: "origin-top bg-chart-3",
        total: "origin-bottom bg-chart-muted",
      },
    },
  },
);
export const waterfallConnector = rcva(
  "pointer-events-none absolute start-(--x) w-(--w) max-w-full bottom-(--y) border-t border-outline-variant",
);
export const waterfallBaseline = rcva("pointer-events-none absolute inset-x-0 bottom-(--y) border-t border-outline", {
  variants: { cut: { true: "border-dashed", false: "" } },
});
export const waterfallAxis = rcva("relative h-5 w-full");
export const waterfallTick = rcva(
  `${text.line} absolute top-0 start-(--x) w-(--w) max-w-full text-center text-label-sm text-on-surface-variant`,
);
export const waterfallFoot = rcva(`${row} items-center justify-between gap-x-3 gap-y-1`);
export const waterfallReadout = rcva(`${text.label} text-label-md tabular-nums text-on-surface-variant`);
export const waterfallKey = rcva(`${row} items-center gap-x-3 gap-y-1 text-label-sm text-on-surface-variant`);
export const waterfallKeyItem = rcva(`${row} items-center gap-1`);
export const waterfallSwatch = rcva(`${fixed["2.5"]} rounded-xs`, {
  variants: { kind: { up: "bg-chart-1", down: "bg-chart-3", total: "bg-chart-muted" } },
});

export interface WaterfallStep {
  label: string;
  value: number;
  valueText?: string;
  total?: boolean;
}

const MINUS = "−";

@customElement("ui-waterfall")
export class UiWaterfall extends LightElement {
  @property({ attribute: false }) steps: WaterfallStep[] = [];
  @property() label = "";
  @property({ attribute: false }) format: (n: number) => string = (n) => formatInt(n);
  @property({ type: Boolean }) fit = false;
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.steps.length) {
      this.#revealed = true;
      const grow = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSTransition && a.transitionProperty === "scale",
      );
      void motion.add(grow, "ambient", this);
    }
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  #read(s: WaterfallStep, c: BridgeColumn) {
    if (c.kind === "total") return m.waterfall_total({ label: s.label, run: this.format(c.run) });
    const sign = s.value < 0 ? MINUS : "+";
    const change = `⁦${sign}${s.valueText ?? this.format(Math.abs(s.value))}⁩`;
    return m.waterfall_change({ label: s.label, change, run: this.format(c.run) });
  }

  #key = (e: KeyboardEvent) => {
    const n = this.steps.length;
    const marks = [...this.querySelectorAll<HTMLElement>("[data-step]")];
    const at = marks.indexOf(document.activeElement as HTMLElement);
    if (!n || at < 0) return;
    const rtl = isRtl(this);
    const step: Record<string, number> = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 };
    let next: number;
    if (e.key in step) next = Math.min(n - 1, Math.max(0, at + step[e.key]!));
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    marks[next]?.focus();
  };

  render() {
    const s = this.steps;
    const cols = bridge(s);
    const domain = this.fit ? bridgeFit(cols) : bridgeDomain(cols);
    const [lo, hi] = domain;
    const at = (v: number) => bridgeAt(Math.min(hi, Math.max(lo, v)), domain);
    const cut = lo > 0 || hi < 0;
    const n = s.length || 1;
    const slot = 100 / n;
    const on = s[this._active];
    const end = cols.at(-1);
    const readout = on
      ? this.#read(on, cols[this._active]!)
      : end
        ? `${this.label ? `${this.label} · ` : ""}${this.format(end.run)}`
        : "";
    const kinds = new Set(cols.map((c) => c.kind));
    return html`<div class=${waterfall()}>
      <ul
        class=${waterfallPlot()}
        aria-label=${this.label || nothing}
        @keydown=${this.#key}
        @pointerleave=${() => this.#set(-1)}
      >
        <li class=${waterfallBaseline({ cut })} style=${styleMap({ "--y": `${at(0)}%` })} aria-hidden="true"></li>
        ${cols.slice(0, -1).map(
          (c, i) =>
            html`<li
              class=${waterfallConnector()}
              aria-hidden="true"
              style=${styleMap({
                "--x": `${(i + 0.82) * slot}%`,
                "--w": `${0.36 * slot}%`,
                "--y": `${at(c.run)}%`,
              })}
            ></li>`,
        )}
        ${s.map((x, i) => {
          const c = cols[i]!;
          const cls = waterfallSlot({
            dim: this._active >= 0 && this._active !== i,
            on: this._active === i,
          });
          const style = styleMap({ "--x": `${i * slot}%`, "--w": `${slot}%` });
          const enter = () => this.#set(i);
          const leave = () => this.#set(-1);
          return html`<li
            class=${cls}
            style=${style}
            tabindex="0"
            data-step
            aria-label=${this.#read(x, c)}
            @pointerenter=${enter}
            @focus=${enter}
            @blur=${leave}
          >
            <span
              class=${waterfallBar({ kind: c.kind })}
              style=${styleMap({
                "--b": `${at(Math.min(c.from, c.to))}%`,
                "--h": `${Math.abs(at(c.to) - at(c.from))}%`,
                "--i": String(i),
              })}
            ></span>
          </li>`;
        })}
      </ul>
      <div class=${waterfallAxis()} aria-hidden="true">
        ${s.map(
          (x, i) =>
            html`<span class=${waterfallTick()} style=${styleMap({ "--x": `${i * slot}%`, "--w": `${slot}%` })}
              >${x.label}</span
            >`,
        )}
      </div>
      <div class=${waterfallFoot()}>
        <p class=${waterfallReadout()} aria-live="polite">${readout}</p>
        <span class=${waterfallKey()} aria-hidden="true">
          ${(
            [
              ["up", m.waterfall_increase()],
              ["down", m.waterfall_decrease()],
              ["total", m.waterfall_total_key()],
            ] as const
          )
            .filter(([k]) => kinds.has(k))
            .map(
              ([k, name]) =>
                html`<span class=${waterfallKeyItem()}
                  ><span class=${waterfallSwatch({ kind: k })}></span>${name}</span
                >`,
            )}
        </span>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-waterfall": UiWaterfall;
  }
}
