import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { inlineStart } from "../../base/inline-start.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { floating, floatingHeight, pad, row, stack, text } from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { inlineStep } from "../../base/reading.ts";
import { m } from "../../../i18n/index.ts";

export const coachmark = rcva("contents");
export const coachmarkSpot = rcva(
  "pointer-events-none fixed inset-auto m-0 overflow-visible border-0 bg-transparent p-0 rounded-box scrim-cutout outline-2 outline-primary [transition:top_var(--duration-spatial)_var(--ease-spatial),inset-inline-start_var(--duration-spatial)_var(--ease-spatial),width_var(--duration-spatial)_var(--ease-spatial),height_var(--duration-spatial)_var(--ease-spatial)] motion-reduce:transition-none top-(--top) start-(--left) h-(--h) w-(--w) max-w-full",
);
export const coachmarkCard = rcva(
  `${stack} ${floating["7"]} ${floatingHeight.fit} ${pad["4"]} liquid-glass bg-surface-container-high/85! pointer-events-auto fixed inset-auto m-0 gap-2 rounded-box py-4 text-on-surface [transition:top_var(--duration-spatial)_var(--ease-spatial),inset-inline-start_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects)] motion-reduce:transition-none top-(--top) start-(--left) starting:opacity-0`,
);
export const coachmarkEyebrow = rcva(`${row} items-center gap-2 text-label-md text-on-surface-variant`);
export const coachmarkHeading = rcva(`${text.label} text-title-lg leading-snug`);
export const coachmarkBody = rcva(`${text.prose} text-body-md leading-relaxed text-on-surface-variant`);
export const coachmarkFooter = rcva(`${row} mt-1 items-center justify-between gap-2`);
export const coachmarkProgress = rcva(`${row} items-center gap-1`);
export const coachmarkSpinner = rcva("loading loading-spinner loading-xs");
export const coachmarkDot = rcva(
  "h-1.5 rounded-full [transition:width_var(--duration-spatial-fast)_var(--ease-spatial-fast),background-color_var(--duration-effects-fast)_var(--ease-effects-fast)]",
  {
    variants: { state: { done: "w-1.5 bg-primary/60", current: "w-4 bg-primary", todo: "w-1.5 bg-outline" } },
  },
);
export const coachmarkButton = rcva("btn btn-sm max-w-full", {
  variants: { kind: { primary: "btn-primary", ghost: "btn-ghost", close: "btn-ghost btn-circle btn-xs" } },
});

const GAP = 12;
const PAD = 6;

@customElement("ui-coachmark")
export class UiCoachmark extends LightElement {
  @property({ type: Boolean }) open = false;
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
    else if (inlineStep(e.key, this) === 1 && !this.busy) this._fire("ui-next");
    else if (inlineStep(e.key, this) === -1 && this.step > 1) this._fire("ui-back");
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
    for (const el of this.querySelectorAll<HTMLElement>("[data-spot], [data-card]"))
      if (!el.matches(":popover-open")) el.showPopover();
    const card = this.querySelector<HTMLElement>("[data-card]");
    if (card && (card.offsetWidth !== this._card.w || card.offsetHeight !== this._card.h))
      this._card = { w: card.offsetWidth, h: card.offsetHeight };
  }

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

  private _spot(): DOMRect | null {
    const r = this._rect;
    if (!r) return null;
    const vh = innerHeight;
    const top = Math.max(8, r.top - PAD);
    let bottom = Math.min(vh - 8, r.bottom + PAD);
    const fitsBeside = r.height + PAD * 2 + GAP + this._card.h + 32 <= vh;
    if (!fitsBeside) bottom = Math.max(top + 48, Math.min(bottom, vh - this._card.h - GAP - 16));
    return new DOMRect(r.left - PAD, top, r.width + PAD * 2, bottom - top);
  }

  private _cardAt(): { top: number; left: number } {
    const vw = innerWidth;
    const vh = innerHeight;
    const { w, h } = this._card;
    const s = this._spot();
    const r = s && new DOMRect(s.left + PAD, s.top + PAD, s.width - PAD * 2, s.height - PAD * 2);
    if (!r) return { top: Math.max(16, (vh - h) / 2), left: Math.max(16, (vw - w) / 2) };
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), vw - w - 16);
    const below = r.bottom + PAD + GAP;
    const above = r.top - PAD - GAP - h;
    const top = below + h <= vh - 16 ? below : above >= 16 ? above : Math.max(16, vh - h - 16);
    return { top, left };
  }

  render() {
    if (!this.open) return nothing;
    const s = this._spot();
    const spot = s
      ? { top: s.top, left: s.left, h: s.height, w: s.width }
      : { top: innerHeight / 2, left: innerWidth / 2, h: 0, w: 0 };
    const at = this._cardAt();
    const last = this.step >= this.total;
    return html`<div class=${coachmark()}>
      <div
        class=${coachmarkSpot()}
        popover="manual"
        data-spot
        aria-hidden="true"
        style=${styleMap({ "--top": `${spot.top}px`, "--left": `${inlineStart(spot.left, spot.w)}px`, "--h": `${spot.h}px`, "--w": `${spot.w}px` })}
      ></div>
      <div
        class=${coachmarkCard()}
        popover="manual"
        data-card
        role="dialog"
        aria-modal="false"
        aria-live="polite"
        aria-label=${typeof this.heading === "string" ? this.heading : m.coachmark_label()}
        style=${styleMap({ "--top": `${at.top}px`, "--left": `${inlineStart(at.left, this._card.w)}px` })}
      >
        <div class=${coachmarkEyebrow()}>
          ${iconSvg("compass", { size: "sm" })}
          <span>${this.eyebrow}</span>
        </div>
        <div class=${coachmarkHeading()}>${this.heading}</div>
        <div class=${coachmarkBody()}>${this.content}</div>
        <div class=${coachmarkFooter()}>
          <div class=${coachmarkProgress()} aria-label=${m.coachmark_step({ step: this.step, total: this.total })}>
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
              ${last ? m.coachmark_close() : m.coachmark_skip()}
            </button>
            ${
              this.step > 1
                ? html`<button
                    type="button"
                    class=${coachmarkButton({ kind: "ghost" })}
                    @click=${() => this._fire("ui-back")}
                  >
                    ${m.coachmark_back()}
                  </button>`
                : nothing
            }
            <button
              type="button"
              class=${coachmarkButton({ kind: "primary" })}
              ?disabled=${this.busy}
              @click=${() => this._fire(last ? "ui-finish" : "ui-next")}
            >
              ${this.busy ? html`<span class=${coachmarkSpinner()}></span>` : last ? m.coachmark_finish() : m.coachmark_next()}
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
