import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Coachmark: a guided-tour step — the page dims, a spotlight frames one element, and a step card
 * explains it, with Back / Next / close.
 *
 * Purpose: Feedback & guidance · Kind: primitive (Shippy, not daisyUI)
 *
 * The spotlight is a hole in the dim (one element with a huge spread shadow) that glides from
 * target to target with the M3 spatial spring; the card is the floating layer's glass and sits
 * below the target when there's room, above it otherwise, centred without a target. It follows
 * the target while the page scrolls or resizes. Keyboard: ← → move, Esc closes.
 */
/**
 * The layer itself has no box: the spotlight and card are fixed on their own. (A full-screen box
 * here would make Chromium apply the card's refracting backdrop to the whole page.)
 */
export const coachmark = rcva("contents [&>*]:z-[60]");
export const coachmarkSpot = rcva(
  "pointer-events-none fixed rounded-box scrim-cutout ring-2 ring-primary [transition:top_var(--duration-spatial)_var(--ease-spatial),left_var(--duration-spatial)_var(--ease-spatial),width_var(--duration-spatial)_var(--ease-spatial),height_var(--duration-spatial)_var(--ease-spatial)] motion-reduce:transition-none top-(--top) left-(--left) h-(--h) w-(--w)",
);
export const coachmarkCard = rcva(
  "liquid-glass pointer-events-auto fixed flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 rounded-box p-4 text-on-surface [transition:top_var(--duration-spatial)_var(--ease-spatial),left_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none top-(--top) left-(--left) starting:opacity-0",
);
export const coachmarkEyebrow = rcva("flex items-center gap-2 text-label-md text-on-surface-variant");
export const coachmarkHeading = rcva("text-title-lg leading-snug");
export const coachmarkBody = rcva("text-body-md leading-relaxed text-on-surface-variant");
export const coachmarkFooter = rcva("mt-1 flex flex-wrap items-center justify-between gap-2");
export const coachmarkProgress = rcva("flex items-center gap-1");
export const coachmarkSpinner = rcva("loading loading-spinner loading-xs");
export const coachmarkDot = rcva(
  "h-1.5 rounded-full [transition:width_var(--duration-spatial-fast)_var(--ease-spatial-fast),background-color_var(--duration-effects-fast)_var(--ease-effects-fast)]",
  {
    variants: { state: { done: "w-1.5 bg-primary/60", current: "w-4 bg-primary", todo: "w-1.5 bg-outline" } },
  },
);
export const coachmarkButton = rcva("btn btn-sm", {
  variants: { kind: { primary: "btn-primary", ghost: "btn-ghost", close: "btn-ghost btn-circle btn-xs" } },
});

const GAP = 12;
const PAD = 6;

/**
 * @example
 * <ui-coachmark open .target=${el} eyebrow="RFQ email → one case" step="2" total="7" heading="AI drafts the case"
 *   @ui-next=${…} @ui-back=${…} @ui-close=${…}>Body text</ui-coachmark>
 *
 * Without a `target` the card sits in the middle (for intros and outros). `busy` shows a
 * spinner in place of Next (e.g. while the page changes user or loads).
 */
@customElement("ui-coachmark")
export class UiCoachmark extends LightElement {
  @property({ type: Boolean }) open = false;
  /** The element to spotlight (its first rendered box, for `display: contents` hosts). */
  @property({ attribute: false }) target: Element | null = null;
  @property() eyebrow: Renderable = "";
  @property() heading: Renderable = "";
  @property({ type: Number }) step = 1;
  @property({ type: Number }) total = 1;
  @property({ type: Boolean }) busy = false;
  @state() private _rect: DOMRect | null = null;
  @state() private _card = { w: 384, h: 220 };

  #frame = 0;
  #observer = new ResizeObserver(() => this._measure());
  #onMove = () => {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => this._measure());
  };
  #onKey = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (e.key === "Escape") this._fire("ui-close");
    else if (e.key === "ArrowRight" && !this.busy) this._fire("ui-next");
    else if (e.key === "ArrowLeft" && this.step > 1) this._fire("ui-back");
  };

  connectedCallback() {
    super.connectedCallback();
    addEventListener("scroll", this.#onMove, { capture: true, passive: true });
    addEventListener("resize", this.#onMove, { passive: true });
    addEventListener("keydown", this.#onKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("scroll", this.#onMove, { capture: true });
    removeEventListener("resize", this.#onMove);
    removeEventListener("keydown", this.#onKey);
    this.#observer.disconnect();
    cancelAnimationFrame(this.#frame);
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("target") || changed.has("open")) {
      this.#observer.disconnect();
      const box = this._box();
      if (box) this.#observer.observe(box);
      this._measure();
    }
  }

  protected updated() {
    const card = this.querySelector<HTMLElement>("[data-card]");
    if (card && (card.offsetWidth !== this._card.w || card.offsetHeight !== this._card.h))
      this._card = { w: card.offsetWidth, h: card.offsetHeight };
  }

  /** The target's first element that has a box (component hosts are `display: contents`). */
  private _box(): Element | null {
    let el = this.target;
    while (el && getComputedStyle(el).display === "contents") el = el.firstElementChild;
    return el;
  }

  private _measure() {
    const box = this.open ? this._box() : null;
    const r = box?.getBoundingClientRect();
    this._rect = r && r.width + r.height > 0 ? r : null;
  }

  private _fire(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  /** Card position: below the target if it fits, else above, else over it; clamped to the screen. */
  private _cardAt(): { top: number; left: number } {
    const vw = innerWidth;
    const vh = innerHeight;
    const { w, h } = this._card;
    const r = this._rect;
    if (!r) return { top: Math.max(16, (vh - h) / 2), left: Math.max(16, (vw - w) / 2) };
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), vw - w - 16);
    const below = r.bottom + PAD + GAP;
    const above = r.top - PAD - GAP - h;
    const top = below + h <= vh - 16 ? below : above >= 16 ? above : Math.max(16, vh - h - 16);
    return { top, left };
  }

  render() {
    if (!this.open) return nothing;
    const r = this._rect;
    // Without a target the hole shrinks to nothing in the middle: the whole page dims.
    const spot = r
      ? { top: r.top - PAD, left: r.left - PAD, h: r.height + PAD * 2, w: r.width + PAD * 2 }
      : { top: innerHeight / 2, left: innerWidth / 2, h: 0, w: 0 };
    const at = this._cardAt();
    const last = this.step >= this.total;
    return html`<div class=${coachmark()}>
      <div
        class=${coachmarkSpot()}
        style=${styleMap({ "--top": `${spot.top}px`, "--left": `${spot.left}px`, "--h": `${spot.h}px`, "--w": `${spot.w}px` })}
      ></div>
      <div
        class=${coachmarkCard()}
        data-card
        role="dialog"
        aria-modal="false"
        aria-live="polite"
        aria-label=${typeof this.heading === "string" ? this.heading : "Guided tour"}
        style=${styleMap({ "--top": `${at.top}px`, "--left": `${at.left}px` })}
      >
        <div class=${coachmarkEyebrow()}>
          ${iconSvg("compass", { size: "sm" })}
          <span>${this.eyebrow}</span>
        </div>
        <div class=${coachmarkHeading()}>${this.heading}</div>
        <div class=${coachmarkBody()}>${this.content}</div>
        <div class=${coachmarkFooter()}>
          <div class=${coachmarkProgress()} aria-label=${`Step ${this.step} of ${this.total}`}>
            ${Array.from(
              { length: this.total },
              (_, i) =>
                html`<span
                  class=${coachmarkDot({ state: i + 1 < this.step ? "done" : i + 1 === this.step ? "current" : "todo" })}
                ></span>`,
            )}
          </div>
          <div class=${coachmarkProgress()}>
            <button type="button" class=${coachmarkButton({ kind: "ghost" })} @click=${() => this._fire("ui-close")}>
              ${last ? "Close" : "Skip"}
            </button>
            ${
              this.step > 1
                ? html`<button
                    type="button"
                    class=${coachmarkButton({ kind: "ghost" })}
                    @click=${() => this._fire("ui-back")}
                  >
                    Back
                  </button>`
                : nothing
            }
            <button
              type="button"
              class=${coachmarkButton({ kind: "primary" })}
              ?disabled=${this.busy}
              @click=${() => this._fire(last ? "ui-finish" : "ui-next")}
            >
              ${this.busy ? html`<span class=${coachmarkSpinner()}></span>` : last ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-coachmark": UiCoachmark;
  }
}
