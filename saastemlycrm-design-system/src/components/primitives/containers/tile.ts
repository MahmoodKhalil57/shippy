import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { rowsFor, type TileSize } from "../../../lib/base/board.ts";
import { floating as float } from "../../base/floating.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";
import { badge, type BadgeVariants } from "../data/badge.ts";
import { skeleton } from "../feedback/skeleton.ts";
import {
  clipRoom,
  fixed,
  fixedWidth,
  floatingFit,
  floatMotion,
  inlineRow,
  pad,
  scrollRoom,
  stack,
  text,
  tiles,
} from "../../../styles/algebra.ts";
import { scrollFocus } from "../../base/scroll-focus.ts";
import { card, cardBody, cardHeader, cardHeadingGroup, cardTitle, cardTrailing } from "./card.ts";

export const tile = rcva("h-full min-h-0 [[data-board-tile]_&]:w-full", {
  variants: {
    bare: { true: `flex flex-col ${clipRoom}`, false: "" },
    size: { s: tiles["6"], m: tiles["12"], l: tiles["18"], full: "w-full" },
    kind: { stats: "", text: "", card: "", table: "", list: "", chart: "", entries: "" },
  },
});
export const tileBody = rcva(`${stack} relative gap-3 [[data-fit]_&]:overflow-visible`, {
  variants: {
    capped: { true: "min-h-0 grow", false: "" },
    overflow: { clip: clipRoom, scroll: `overflow-y-auto ${scrollRoom}`, none: "" },
    faded: { true: "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]", false: "" },
  },
});
export const tileWait = rcva(`${stack} grow gap-3`);
export const tileWaitBlock = rcva("min-h-8 w-full grow");
export const tileContent = rcva(
  `${stack} gap-3 [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none`,
  {
    variants: {
      hidden: { true: "hidden", false: "" },
      fill: { true: "grow min-h-0", false: "" },
    },
  },
);
export const tileMore = rcva("self-start", {
  variants: { over: { true: "absolute bottom-0 start-0 z-10 bg-surface shadow-elevation-1", false: "" } },
  defaultVariants: { over: false },
});
export const tileCardBody = rcva("min-h-0");
export const tileBodyBox = rcva(`${stack} relative min-h-0 grow`);
export const tileEmphasis = rcva("border border-transparent");
export const tileTitle = rcva(`${text.label} text-title-md`);

export const tileArrange = rcva(
  "group/arrange relative block h-full min-h-0 [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:transition-none",
  {
    variants: {
      lift: { true: "-translate-y-0.5", false: "" },
      moving: { true: "z-20 opacity-90 shadow-elevation-3 rounded-box" },
    },
  },
);
export const tileGrip = rcva(
  `${fixedWidth["8"]} touch-target touch-none absolute top-1.5 start-1/2 z-10 h-1 -translate-x-1/2 rtl:translate-x-1/2 cursor-grab rounded-full bg-on-surface-variant/40 opacity-0 transition-opacity group-hover/arrange:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100 data-[dragging]:cursor-grabbing data-[dragging]:opacity-100 motion-reduce:transition-none`,
);
export const tileResize = rcva(
  `${fixed.corner} touch-target touch-none absolute bottom-0 end-0 z-10 cursor-nwse-resize rtl:cursor-nesw-resize rounded-ee-box border-e-2 border-b-2 border-on-surface-variant/40 opacity-0 transition-opacity group-hover/arrange:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100 data-[dragging]:opacity-100 motion-reduce:transition-none`,
);
export const tileMenu = rcva(
  `${floatingFit["6"]} ${floatMotion} liquid-glass rounded-box [--outer-radius:var(--radius-box)] [--outer-padding:var(--space-50)] p-1 text-center text-on-surface`,
);
export const tileMenuItem = rcva(
  `${inlineRow} ${pad["2"]} touch-target state-layer cursor-pointer items-center gap-2 rounded-inner py-1.5 text-label-lg hover:text-error`,
);
export const tileMenuLabel = rcva(text.line);
export const tileSubhead = rcva(`${text.line} text-body-sm text-on-surface-variant`);

export type TileEmphasis = "inverse" | "tinted";
export type TileVariants = VariantProps<typeof tile>;

@customElement("ui-tile")
export class UiTile extends LightElement {
  @property() size: TileSize = "s";
  @property() heading: Renderable = "";
  @property() subhead: Renderable = "";
  @property({ type: Number }) count?: number;
  @property({ attribute: "count-tone" }) countTone: BadgeVariants["tone"];
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) bare = false;
  @property({ type: Boolean }) scrolls = false;
  @property() emphasis?: TileEmphasis;
  @property() kind: TileVariants["kind"];
  @state() private _open = false;
  @state() private _over = false;
  #rootHeight = 0;
  #bodyHeight = 0;
  #contentHeight = 0;
  #resize = new ResizeObserver((entries) => {
    for (const e of entries) {
      const height = e.borderBoxSize[0]!.blockSize;
      const el = e.target as HTMLElement;
      if (el.hasAttribute("data-tile-root")) {
        this.#rootHeight = height;
        if (!this.loading && height > 0)
          this.dispatchEvent(new CustomEvent("ui-tile-height", { detail: { height }, bubbles: true }));
      } else if (el.hasAttribute("data-tile-content")) this.#contentHeight = height;
      else this.#bodyHeight = e.contentBoxSize[0]!.blockSize;
    }
    this._measure();
  });
  #observed = new WeakSet<Element>();

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#observed = new WeakSet();
  }

  protected updated() {
    for (const el of this.querySelectorAll<HTMLElement>(
      ":scope [data-tile-body], :scope [data-tile-content], :scope [data-tile-root]",
    ))
      if (!this.#observed.has(el) && el.closest("ui-tile") === this) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
  }

  private _measure() {
    const over = !this.scrolls && !this._open && !!this.#bodyHeight && this.#contentHeight > this.#bodyHeight + 1;
    if (over !== this._over && !this._open) this._over = over;
  }

  private _toggle() {
    this._open = !this._open;
    if (!this._open) this._over = true;
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const need = this.#rootHeight + Math.max(0, this.#contentHeight - this.#bodyHeight) + 48;
    this.dispatchEvent(
      new CustomEvent("ui-tile-rows", { detail: { rows: this._open ? rowsFor(need, scale) : null }, bubbles: true }),
    );
  }

  render() {
    const waiting = html`<div class=${tileWait()} aria-busy="true">
      <div class=${skeleton({ shape: "line" })}></div>
      <div class=${skeleton({ shape: null, class: tileWaitBlock() })}></div>
    </div>`;
    const content = html`${this.loading ? waiting : nothing}
      <div class=${tileContent({ hidden: this.loading, fill: this.bare })} data-tile-content>${this.slotted()}</div>`;
    if (this.bare)
      return html`<div class=${tile({ size: this.size, kind: this.kind, bare: true })} data-tile-root>${content}</div>`;
    const trailing = this.hasSlotted("trailing");
    const header =
      this.heading || trailing || this.count !== undefined
        ? html`<div class=${cardHeader()}>
            <div class=${cardHeadingGroup()}>
              ${this.heading ? html`<h2 class=${cardTitle({ class: tileTitle() })}>${this.heading}</h2>` : nothing}
              ${
                this.count !== undefined
                  ? html`<span class=${badge({ kind: "count", tone: this.countTone })}>${this.count}</span>`
                  : nothing
              }
            </div>
            ${trailing ? html`<div class=${cardTrailing()}>${this.slotted("trailing")}</div>` : nothing}
          </div>`
        : nothing;
    const more =
      this._over || this._open
        ? html`<button
            type="button"
            class=${button({ variant: "text", size: "xs", class: tileMore({ over: !this._open }) })}
            aria-expanded=${this._open ? "true" : "false"}
            @click=${this._toggle}
          >
            ${this._open ? m.tile_show_less() : m.tile_show_all()}
          </button>`
        : nothing;
    const surface = this.emphasis ? card({ variant: null, size: "sm", class: tileEmphasis() }) : card({ size: "sm" });
    return html`<div
      class=${tile({ size: this.size, kind: this.kind, class: surface })}
      data-surface=${this.emphasis ?? nothing}
      data-tile-root
    >
      <div class=${cardBody({ class: tileCardBody() })}>
        ${header}
        ${
          this.subhead
            ? html`<p class=${tileSubhead()} title=${typeof this.subhead === "string" ? this.subhead : nothing}>
                ${this.subhead}
              </p>`
            : nothing
        }
        <div class=${tileBodyBox()}>
          <div
            class=${tileBody({
              capped: !this._open && !this.loading,
              overflow: this._open || this.loading ? "none" : this.scrolls ? "scroll" : "clip",
              faded: this._over && !this._open,
            })}
            data-tile-body
            ${scrollFocus({ label: typeof this.heading === "string" ? this.heading : undefined })}
          >
            ${content}
          </div>
          ${this._open ? nothing : more}
        </div>
        ${this._open ? more : nothing}
      </div>
    </div>`;
  }
}

export interface TileDrag {
  phase: "start" | "move" | "end" | "cancel";
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const START_DISTANCE = 4;
const SCROLL_EDGE = 48;
const SCROLL_SPEED = 20;

function scrollerOf(el: Element): HTMLElement {
  for (let at: Element | null = el; at;) {
    if (at instanceof HTMLElement && at.scrollHeight > at.clientHeight) {
      const y = getComputedStyle(at).overflowY;
      if (y === "auto" || y === "scroll") return at;
    }
    at = at.parentElement ?? ((at.getRootNode() as ShadowRoot).host || null);
  }
  return document.scrollingElement as HTMLElement;
}

let anchors = 0;

@customElement("ui-tile-arrange")
export class UiTileArrange extends LightElement {
  @property() label = "";
  @property({ type: Boolean }) resizable = false;
  @state() private _moving = false;
  readonly #anchor = `tile-grip-${++anchors}`;
  @state() private _lift = false;
  #drag?: {
    kind: "move" | "resize";
    id: number;
    x: number;
    y: number;
    handle: HTMLElement;
    started: boolean;
    last: { clientX: number; clientY: number };
    scroller?: HTMLElement;
    frame?: number;
  };

  #rtl() {
    return getComputedStyle(this.querySelector(":scope > div")!).direction === "rtl" ? -1 : 1;
  }

  #emit(phase: TileDrag["phase"], e: { clientX: number; clientY: number }) {
    const d = this.#drag!;
    const detail: TileDrag = {
      phase,
      x: e.clientX,
      y: e.clientY,
      dx: (e.clientX - d.x) * (d.kind === "resize" ? this.#rtl() : 1),
      dy: e.clientY - d.y,
    };
    this.dispatchEvent(new CustomEvent(d.kind === "move" ? "ui-drag" : "ui-resize", { detail, bubbles: true }));
  }

  #menu() {
    return this.querySelector<HTMLElement>(":scope > div > [popover]");
  }
  #pressed = false;
  #wasOpen = false;

  #click = (e: MouseEvent) => {
    const fromKeys = e.detail === 0;
    if (!this.#pressed && !fromKeys) return;
    this.#pressed = false;
    const menu = this.#menu()!;
    if (fromKeys) menu.togglePopover();
    else if (!this.#wasOpen) menu.showPopover();
  };

  #down(kind: "move" | "resize", e: PointerEvent) {
    if (kind === "move") this.#wasOpen = this.#menu()!.matches(":popover-open");
    if (e.button !== 0 || !e.isPrimary || this.#drag) return;
    const handle = e.currentTarget as HTMLElement;
    try {
      handle.setPointerCapture(e.pointerId);
    } catch {}
    const at = { clientX: e.clientX, clientY: e.clientY };
    this.#drag = { kind, id: e.pointerId, x: e.clientX, y: e.clientY, handle, started: false, last: at };
    e.preventDefault();
    window.addEventListener("keydown", this.#escape, true);
  }

  #move = (e: PointerEvent) => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    d.last = { clientX: e.clientX, clientY: e.clientY };
    if (!d.started) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < START_DISTANCE) return;
      d.started = true;
      d.handle.setAttribute("data-dragging", "");
      this._moving = true;
      this.#emit("start", { clientX: d.x, clientY: d.y });
      d.scroller = scrollerOf(this);
      d.frame = requestAnimationFrame(this.#scroll);
    }
    this.#emit("move", e);
  };

  #scroll = () => {
    const d = this.#drag!;
    const s = d.scroller!;
    const page = s === document.scrollingElement || s === document.documentElement;
    const r = page ? { top: 0, bottom: innerHeight } : s.getBoundingClientRect();
    const y = d.last.clientY;
    const near =
      y - r.top < SCROLL_EDGE
        ? -(SCROLL_EDGE - (y - r.top))
        : r.bottom - y < SCROLL_EDGE
          ? SCROLL_EDGE - (r.bottom - y)
          : 0;
    if (near) {
      const before = s.scrollTop;
      s.scrollTop += Math.sign(near) * Math.ceil((Math.min(SCROLL_EDGE, Math.abs(near)) / SCROLL_EDGE) * SCROLL_SPEED);
      if (s.scrollTop !== before) this.#emit("move", d.last);
    }
    d.frame = requestAnimationFrame(this.#scroll);
  };

  #end = (e: PointerEvent, phase: "end" | "cancel") => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    this.#finish(phase, e);
  };

  #escape = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    e.stopPropagation();
    this.#finish("cancel", this.#drag!.last);
  };

  #finish(phase: "end" | "cancel", e: { clientX: number; clientY: number }) {
    const d = this.#drag!;
    window.removeEventListener("keydown", this.#escape, true);
    if (d.frame !== undefined) cancelAnimationFrame(d.frame);
    d.handle.removeAttribute("data-dragging");
    this._moving = false;
    if (d.started) this.#emit(phase, e);
    this.#drag = undefined;
    if (!d.started && phase === "end") {
      d.handle.focus({ preventScroll: true });
      if (d.kind === "move") this.#pressed = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#drag) this.#finish("cancel", this.#drag.last);
  }

  #key = (e: KeyboardEvent) => {
    const rtl = this.#rtl() < 0;
    const back = e.key === "ArrowUp" || e.key === (rtl ? "ArrowRight" : "ArrowLeft");
    const on = e.key === "ArrowDown" || e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const to = e.key === "Home" ? "start" : back ? "earlier" : on ? "later" : null;
    if (to) this.dispatchEvent(new CustomEvent("ui-step", { detail: { to }, bubbles: true }));
    else if (e.key === "Delete" || e.key === "Backspace")
      this.dispatchEvent(new CustomEvent("ui-hide", { bubbles: true }));
    else return;
    e.preventDefault();
  };

  #cornerKey = (e: KeyboardEvent) => {
    const rtl = this.#rtl() < 0;
    const step =
      e.key === (rtl ? "ArrowLeft" : "ArrowRight")
        ? { span: 1, rows: 0 }
        : e.key === (rtl ? "ArrowRight" : "ArrowLeft")
          ? { span: -1, rows: 0 }
          : e.key === "ArrowDown"
            ? { span: 0, rows: 1 }
            : e.key === "ArrowUp"
              ? { span: 0, rows: -1 }
              : null;
    if (!step) return;
    e.preventDefault();
    this.dispatchEvent(new CustomEvent("ui-resize-step", { detail: step, bubbles: true }));
  };

  render() {
    return html`<div
      class=${tileArrange({ moving: this._moving, lift: this._lift })}
      @pointerenter=${() => (this._lift = !!this.querySelector("[data-tile-lift]"))}
      @pointerleave=${() => (this._lift = false)}
    >
      ${this.slotted()}
      <button
        type="button"
        class=${tileGrip()}
        data-grip
        aria-label=${this.label ? m.tile_move_named({ name: this.label }) : m.tile_move()}
        title=${m.tile_move_hint()}
        aria-haspopup="menu"
        @click=${this.#click}
        @pointerdown=${(e: PointerEvent) => this.#down("move", e)}
        @pointermove=${this.#move}
        @pointerup=${(e: PointerEvent) => this.#end(e, "end")}
        @pointercancel=${(e: PointerEvent) => this.#end(e, "cancel")}
        @lostpointercapture=${(e: PointerEvent) => this.#end(e, "cancel")}
        @keydown=${this.#key}
      ></button>
      ${
        this.resizable
          ? html`<button
              type="button"
              class=${tileResize()}
              aria-label=${this.label ? m.tile_resize_named({ name: this.label }) : m.tile_resize()}
              title=${m.tile_resize_hint()}
              @pointerdown=${(e: PointerEvent) => this.#down("resize", e)}
              @pointermove=${this.#move}
              @pointerup=${(e: PointerEvent) => this.#end(e, "end")}
              @pointercancel=${(e: PointerEvent) => this.#end(e, "cancel")}
              @lostpointercapture=${(e: PointerEvent) => this.#end(e, "cancel")}
              @keydown=${this.#cornerKey}
            ></button>`
          : nothing
      }
      <div
        class=${tileMenu()}
        popover
        id=${this.#anchor}
        ${float({ placement: "top", gap: 20, anchor: () => this.querySelector("[data-grip]") })}
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          aria-label=${this.label ? m.tile_remove_named({ name: this.label }) : m.tile_remove()}
          class=${tileMenuItem()}
          @click=${(e: Event) => {
            ((e.currentTarget as HTMLElement).parentElement as HTMLElement).hidePopover();
            this.dispatchEvent(new CustomEvent("ui-hide", { bubbles: true }));
          }}
        >
          ${iconSvg("trash", { size: "sm" })}<span class=${tileMenuLabel()}>${m.tile_remove()}</span>
        </button>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tile-arrange": UiTileArrange;
    "ui-tile": UiTile;
  }
}
