import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { formatInt, intl } from "../../../lib/i18n/index.ts";
import { LightElement } from "../../base/light-element.ts";
import { motion } from "../../../lib/base/motion-queue.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { fixed, fixedWidth, row, rowFill, stack, text, tiles } from "../../../styles/algebra.ts";
import { foldParts, slotColor, TRACK, type Slot } from "../../../lib/base/visual-math.ts";

export const ring = rcva(`${row} w-full items-center gap-4`);
export const ringDial = rcva(`${tiles["2"]} relative aspect-square`);
export const ringArc = rcva(
  "absolute inset-0 rounded-full [background:var(--ring-fill)] [mask-image:radial-gradient(closest-side,transparent_66%,#000_67%),conic-gradient(#000_var(--ring-sweep),transparent_0)] [mask-composite:intersect] [animation:ring-sweep_var(--duration-long2)_var(--ease-emphasized-decelerate)_both] [transition:background_var(--duration-short4)_var(--ease-standard)] motion-reduce:[animation:none]",
);
export const ringMiddle = rcva(
  `${stack} pointer-events-none absolute inset-[22%] items-center justify-center text-center`,
);
export const ringValue = rcva(`${text.label} max-w-full text-title-sm tabular-nums text-on-surface`);
export const ringCaption = rcva(`${text.label} line-clamp-2 text-label-sm text-on-surface-variant`);
export const ringLegend = rcva(`${stack} ${rowFill} gap-0.5`);
export const ringItem = rcva(`${row} items-center gap-2 rounded-field px-1 py-0.5 ${text.label} text-body-sm`, {
  variants: {
    link: { true: "cursor-pointer hover:underline", false: "" },
  },
});
/** Focusing a part dims the other parts' marks; legend text keeps full contrast. */
export const ringDot = rcva(
  `${fixed["2.5"]} rounded-full [transition:opacity_var(--duration-short4)_var(--ease-standard)]`,
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
export const ringLabel = rcva(`${rowFill} ${text.line} text-on-surface`);
export const ringAmount = rcva(`${text.label} tabular-nums text-on-surface`);
export const ringShare = rcva(`${fixedWidth["10"]} ${text.label} text-end tabular-nums text-on-surface-variant`);

export interface RingPart {
  label: string;
  value: number;
  valueText?: string;
  href?: string;
}

interface Drawn extends RingPart {
  slot: Slot;
  from: number;
  to: number;
}

const GAP = 1.5;

@customElement("ui-ring")
export class UiRing extends LightElement {
  @property({ attribute: false }) parts: RingPart[] = [];
  @property({ type: Number }) max?: number;
  @property() label = "";
  @property({ attribute: "center-label" }) centerLabel = "";
  @property({ attribute: "total-text" }) totalText = "";
  @state() private _active = -1;
  #revealed = false;

  #drawn(): { parts: Drawn[]; whole: number; sum: number } {
    const shown = foldParts(this.parts);
    const sum = shown.reduce((t, x) => t + x.part.value, 0);
    const whole = Math.max(sum, this.max ?? 0) || 1;
    let at = 0;
    const parts = shown.map(({ part, slot }): Drawn => {
      const from = at;
      at += (part.value / whole) * 360;
      return { ...part, slot, from, to: at };
    });
    return { parts, whole, sum };
  }

  #gradient(parts: Drawn[]) {
    const gap = parts.length > 1 || (this.max ?? 0) > 0 ? GAP : 0;
    const stops = parts.flatMap((p, i) => {
      const end = Math.max(p.from, p.to - gap);
      const c = slotColor(p.slot, this._active >= 0 && this._active !== i);
      return [`${c} ${p.from}deg ${end}deg`, `transparent ${end}deg ${p.to}deg`];
    });
    const last = parts.at(-1)?.to ?? 0;
    if (last < 360) stops.push(`${TRACK} ${last}deg 360deg`);
    return `conic-gradient(${stops.join(", ")})`;
  }

  #point(e: PointerEvent, parts: Drawn[]) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y) / (r.width / 2);
    if (d < 0.66 || d > 1) return -1;
    const deg = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
    return parts.findIndex((p) => deg >= p.from && deg < p.to);
  }

  #set(i: number) {
    if (i !== this._active) this._active = i;
  }

  protected updated() {
    if (!this.#revealed && this.parts.length) {
      this.#revealed = true;
      const sweep = this.getAnimations({ subtree: true }).filter(
        (a) => a instanceof CSSAnimation && a.animationName === "ring-sweep",
      );
      void motion.add(sweep, "ambient", this);
    }
  }

  render() {
    const { parts, whole, sum } = this.#drawn();
    const active = parts[this._active];
    const share = (v: number) =>
      intl.number({ style: "percent", maximumFractionDigits: 0 }).format(v / (this.max ? whole : sum));
    return html`<div class=${ring()}>
      <div class=${ringDial()}>
        <div
          class=${ringArc()}
          aria-hidden="true"
          style=${styleMap({ "--ring-fill": this.#gradient(parts) })}
          @pointermove=${(e: PointerEvent) => this.#set(this.#point(e, parts))}
          @pointerleave=${() => this.#set(-1)}
          @click=${(e: PointerEvent) => {
            const p = parts[this.#point(e, parts)];
            if (p?.href) this.querySelector<HTMLAnchorElement>(`a[data-part="${parts.indexOf(p)}"]`)?.click();
          }}
        ></div>
        <div class=${ringMiddle()} aria-hidden="true">
          <span class=${ringValue()}
            >${active ? (active.valueText ?? formatInt(active.value)) : this.totalText || formatInt(sum)}</span
          >
          <span class=${ringCaption()}>${active ? `${active.label} · ${share(active.value)}` : this.centerLabel}</span>
        </div>
      </div>
      <ul class=${ringLegend()} aria-label=${this.label || nothing}>
        ${parts.map((p, i) => {
          const dim = this._active >= 0 && this._active !== i;
          const body = html`<span class=${ringDot({ slot: p.slot, dim })}></span>
            <span class=${ringLabel()}>${p.label}</span>
            <span class=${ringAmount()}>${p.valueText ?? formatInt(p.value)}</span>
            <span class=${ringShare()}>${share(p.value)}</span>`;
          const cls = ringItem({ link: !!p.href });
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
    "ui-ring": UiRing;
  }
}
