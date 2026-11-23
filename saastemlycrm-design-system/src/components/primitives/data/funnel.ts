import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { row, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * Funnel: how many make it from one stage to the next (inquiries → quoted → won), each stage a bar
 * as long as its share of the first, centred, and between two stages the share that went on.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * The data-viz rules it follows:
 * - **One measure, one hue** (`chart-1`), the stages in their own order (never sorted by size): the
 *   bars narrow as the stages do, so the shape is the story. Labels and values stay in text colours.
 * - **The conversion between stages** in words under each step ("72% went on"), and the whole
 *   funnel's (last ÷ first) in its caption, so nothing has to be measured by eye.
 * - **Alive:** the bars grow out from the middle as it enters, one after the other (a transition
 *   from `@starting-style`, as ambient motion); pointing at a stage (hover or focus) brings it
 *   forward and fades the rest. A stage with `href` opens it.
 * - It reads as a list of stages, each with its value, for assistive tech.
 */
export const funnel = rcva(`${stack} w-full gap-1`);
export const funnelCaption = rcva(`${text.label} text-label-md text-on-surface-variant`);
export const funnelStage = rcva(
  `${stack} gap-1 rounded-field px-1 py-1 [transition:opacity_var(--duration-short4)_var(--ease-standard)]`,
  { variants: { dim: { true: "opacity-50", false: "" }, link: { true: "cursor-pointer", false: "" } } },
);
export const funnelHead = rcva(`${row} items-baseline gap-2`);
export const funnelLabel = rcva(`${rowLine} text-body-md text-on-surface`);
export const funnelValue = rcva(`${text.label} text-title-sm tabular-nums text-on-surface`);
/** The bar's track: the whole width, the bar centred in it. */
export const funnelTrack = rcva(`${row} h-3 w-full justify-center`);
export const funnelBar = rcva(
  "h-full w-(--fill) max-w-full rounded-full bg-chart-1 [transition:width_var(--duration-long2)_var(--ease-emphasized-decelerate)] [transition-delay:calc(var(--i)*var(--duration-short2))] starting:w-0 motion-reduce:transition-none",
);
/** Between two stages: the share that went on. */
export const funnelStep = rcva(
  `${row} justify-center ${text.label} text-label-sm text-on-surface-variant tabular-nums`,
);

export interface FunnelStage {
  label: string;
  value: number;
  /** How the value reads; left out, the number. */
  valueText?: string;
  href?: string;
}

const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");

/**
 * @example <ui-funnel label="Quote funnel" .stages=${[{ label: "Inquiries", value: 150 }, { label: "Quoted", value: 116 }, { label: "Won", value: 42 }]}></ui-funnel>
 */
@customElement("ui-funnel")
export class UiFunnel extends LightElement {
  @property({ attribute: false }) stages: FunnelStage[] = [];
  /** The whole funnel, for screen readers. */
  @property() label = "";
  /** What a step's share says after it ("went on", "quoted"). */
  @property() step = "went on";
  @state() private _active = -1;
  #revealed = false;

  protected updated() {
    if (!this.#revealed && this.stages.length) {
      this.#revealed = true;
      const grow = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSTransition && a.transitionProperty === "width",
      );
      void motion.add(grow, "ambient", this);
    }
  }

  render() {
    const s = this.stages;
    const first = s[0]?.value ?? 0;
    const last = s.at(-1)?.value ?? 0;
    const set = (i: number) => () => {
      if (i !== this._active) this._active = i;
    };
    return html`<div class=${funnel()}>
      ${
        s.length > 1
          ? html`<p class=${funnelCaption()}>
              ${pct(last, first)} of ${s[0]!.label.toLowerCase()} reach ${s.at(-1)!.label.toLowerCase()}
            </p>`
          : nothing
      }
      <ol class=${stack} aria-label=${this.label || nothing}>
        ${s.map((x, i) => {
          const cls = funnelStage({ dim: this._active >= 0 && this._active !== i, link: !!x.href });
          const body = html`<span class=${funnelHead()}>
              <span class=${funnelLabel()}>${x.label}</span>
              <span class=${funnelValue()}>${x.valueText ?? String(x.value)}</span>
            </span>
            <span class=${funnelTrack()} aria-hidden="true">
              <span
                class=${funnelBar()}
                style=${styleMap({ "--fill": `${first > 0 ? Math.max(2, (x.value / first) * 100) : 0}%`, "--i": String(i) })}
              ></span>
            </span>`;
          return html`<li>
            ${
              x.href
                ? html`<a
                    class=${cls}
                    href=${x.href}
                    @pointerenter=${set(i)}
                    @pointerleave=${set(-1)}
                    @focus=${set(i)}
                    @blur=${set(-1)}
                    >${body}</a
                  >`
                : html`<div
                    class=${cls}
                    tabindex="0"
                    @pointerenter=${set(i)}
                    @pointerleave=${set(-1)}
                    @focus=${set(i)}
                    @blur=${set(-1)}
                  >
                    ${body}
                  </div>`
            }
            ${
              i < s.length - 1
                ? html`<span class=${funnelStep()}>↓ ${pct(s[i + 1]!.value, x.value)} ${this.step}</span>`
                : nothing
            }
          </li>`;
        })}
      </ol>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-funnel": UiFunnel;
  }
}
