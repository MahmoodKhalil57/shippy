import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt } from "../../../i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../base/motion-queue.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, inlineRow, row, rowLine, stack, text } from "../layout/algebra.ts";
import { foldParts, percentText, sharePercents, type Slot } from "./visual-math.ts";

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
  valueText?: string;
  href?: string;
}

interface Drawn extends SharePart {
  slot: Slot;
  share: number;
}

@customElement("ui-share-bar")
export class UiShareBar extends LightElement {
  @property({ attribute: false }) parts: SharePart[] = [];
  @property() label = "";
  @property() total?: string;
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
        <span class=${shareBarLabel()}>${active ? `${active.label} · ${percentText(active.share)}` : this.label}</span>
        <span class=${shareBarTotal()}
          >${active ? (active.valueText ?? formatInt(active.value)) : (this.total ?? nothing)}</span
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
            <span class=${shareBarAmount()}>${p.valueText ?? formatInt(p.value)}</span>
            <span class=${shareBarShare()}>${percentText(p.share)}</span>`;
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
