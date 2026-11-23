import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { rowsFor, type TileSize } from "../../base/board.ts";
import { floating as float } from "../../base/floating.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";
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
} from "../layout/algebra.ts";
import { card, cardBody, cardHeader, cardHeadingGroup, cardTitle, cardTrailing } from "./card.ts";

/**
 * Tile: one widget on a screen's board (`<ui-board>`), the same anatomy everywhere.
 *
 * Purpose: Layout & page structure · Kind: primitive
 *
 * - **Header:** its title, a count, and `slot="trailing"` for tags and actions; a subhead under it.
 * - **Body:** its content, in the box the board gives the tile (its cells: the same while loading and
 *   loaded, so nothing moves when the data arrives). What doesn't fit fades out, and "Show all" asks
 *   the board for the rows the content needs (`ui-tile-rows`); "Show less" gives them back.
 * - **Loading:** a skeleton that fills the tile's box.
 * - **`bare`:** a tile with no surface or cap, for what steers the screen rather than shows
 *   something (a period choice, a page-wide alert), or a strip of key figures that are cells of
 *   their own.
 * - **`emphasis`:** the one tile a screen is about takes a contrasting surface. `inverse` is M3's
 *   inverse surface ("Background fills for elements which contrast against surface"; dark in a
 *   light theme, a raised surface in a dark one), one per screen; `tinted` is the primary
 *   container. Both re-scope the colour roles for everything inside (`surface-inverse`,
 *   `surface-tinted` in src/styles/theme.css), so any content reads on them as it does elsewhere:
 *   tests/contrast.test.ts computes that for every colour scheme.
 *
 * Card recipes are borrowed for the surface and header (a tile is a card on the board).
 */
export const tile = rcva("h-full min-h-0", {
  variants: {
    /** No surface: a column its content fills, never past the tile's box. */
    bare: { true: `flex flex-col ${clipRoom}`, false: "" },
    size: { s: "", m: "", l: "", full: "" },
    /** What's on its way, when the screen says (`skeleton` on the widget). */
    kind: { stats: "", text: "", card: "", table: "", list: "", chart: "", entries: "" },
  },
});
/**
 * A tile that fits its content (the board's `rows: "fit"`, a `[data-fit]` cell) never clips it:
 * its body overflows visibly there, whatever its `overflow` says, so it's measured whole and
 * nothing at its edges (a button, a ring) is cut.
 */
export const tileBody = rcva(`${stack} relative gap-3 [[data-fit]_&]:overflow-visible`, {
  variants: {
    /** In its box: the body takes what's left of the tile's cells under the header, clipping the rest. */
    capped: { true: "min-h-0 grow", false: "" },
    /** What doesn't fit: clipped (towards "Show all"), or scrolled inside the box (`scrolls`). */
    overflow: { clip: clipRoom, scroll: `overflow-y-auto ${scrollRoom}`, none: "" },
    // Only a tile that holds more than its box fades out (towards "Show all").
    faded: { true: "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]", false: "" },
  },
});
/** The skeleton: a line over a block that fills the tile's box. */
export const tileWait = rcva(`${stack} grow gap-3`);
export const tileWaitBlock = rcva("min-h-8 w-full grow");
/** The tile's own content (hidden while the skeleton shows). */
export const tileContent = rcva(
  // The content fades in as it takes the skeleton's place (from `display: none`, so `@starting-style`
  // applies), rather than popping in.
  `${stack} gap-3 [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none`,
  {
    variants: {
      hidden: { true: "hidden", false: "" },
      /** A bare tile's content: what's left of the tile's box (its only child may fill it). */
      fill: { true: "grow min-h-0", false: "" },
    },
  },
);
/**
 * "Show all" sits over the faded bottom of a capped body, never in a row of its own: whether the
 * content overflows can change while the tile settles (its content first lays out before the board
 * has given it its width), and a row that came and went resized the tile and moved every tile under
 * it. "Show less" (after the person opened it) follows the content.
 */
export const tileMore = rcva("self-start", {
  // Over the fade it's a pill of the tile's own surface, so it never reads into the last line under it.
  variants: { over: { true: "absolute bottom-0 start-0 z-10 bg-surface shadow-elevation-1", false: "" } },
  defaultVariants: { over: false },
});
/** The card's body in a tile: it shrinks to the tile's cells (a flex item keeps its content's height otherwise). */
export const tileCardBody = rcva("min-h-0");
/** The capped body and its "Show all", together: the button is placed over the body's faded end. */
export const tileBodyBox = rcva(`${stack} relative min-h-0 grow`);
/**
 * An emphasised tile carries its edge in its fill: the border stays, transparent, so every tile has
 * the same box. The surface itself comes from `data-surface` (src/styles/theme.css).
 */
export const tileEmphasis = rcva("border border-transparent");
/** Its title: M3 title-medium (16px), a step under a page's own headings. */
export const tileTitle = rcva(`${text.label} text-title-md`);

/**
 * A tile someone arranges by hand (a screen of widgets): the box its grab bar and resize corner sit
 * on, over the tile. Both show while the pointer is over the tile or they have focus (always on a
 * touch screen, which has no hover).
 */
export const tileArrange = rcva(
  "group/arrange relative block h-full min-h-0 [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:transition-none",
  {
    variants: {
      /**
       * A tile that lifts on hover (a figure that links somewhere: `data-tile-lift`) lifts with its
       * handles, as one piece, so the corner stays on the card's corner.
       */
      lift: { true: "-translate-y-0.5", false: "" },
      /** Held by hand (the board moves it, `UiBoard.hold`): a little lifted. */
      moving: { true: "z-20 opacity-90 shadow-elevation-3 rounded-box" },
    },
  },
);
/**
 * The grab bar on a tile's top edge (M3's drag handle: a 32 × 4dp pill in on-surface-variant at
 * 40%): drag it to move the tile among the others; focused, the arrow keys move it earlier or later.
 */
export const tileGrip = rcva(
  `${fixedWidth["8"]} touch-target touch-none absolute top-1.5 start-1/2 z-10 h-1 -translate-x-1/2 rtl:translate-x-1/2 cursor-grab rounded-full bg-on-surface-variant/40 opacity-0 transition-opacity group-hover/arrange:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100 data-[dragging]:cursor-grabbing data-[dragging]:opacity-100 motion-reduce:transition-none`,
);
/**
 * The resize corner at a tile's bottom end: the card's own corner, traced (its radius, on its edge,
 * in on-surface-variant at 40%), so it reads as the corner itself; drag it to make the
 * tile wider, narrower, taller or shorter, in whole tiles, within its widget's bounds; focused, the
 * arrow keys do the same a tile at a time.
 */
export const tileResize = rcva(
  `${fixed.corner} touch-target touch-none absolute bottom-0 end-0 z-10 cursor-nwse-resize rtl:cursor-nesw-resize rounded-ee-box border-e-2 border-b-2 border-on-surface-variant/40 opacity-0 transition-opacity group-hover/arrange:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100 data-[dragging]:opacity-100 motion-reduce:transition-none`,
);
/**
 * What a click on the grab bar opens (a press that doesn't move: a drag never opens it): a small
 * popover 20px above the bar, clear of the tile's edge (Floating UI: `top`, flipping under it where
 * there's no room),
 * in the top layer so no tile clips it; Escape or a click elsewhere closes it (`popover="auto"`).
 * It holds the tile's one destructive action, Hide, so the action is never on the tile itself to be
 * brushed while scrolling or grabbing it.
 */
export const tileMenu = rcva(
  `${floatingFit["6"]} ${floatMotion} liquid-glass rounded-box [--outer-radius:var(--radius-box)] [--outer-padding:var(--space-50)] p-1 text-center text-on-surface`,
);
/**
 * Remove (hides the tile), in the grab bar's popover: its trash icon and "Remove"; red when pointed
 * at. Padded so it fits two tiles (the popover's width, in whole tiles), centred in them; its corners
 * the popover's less its padding (`rounded-inner`), the popover's the theme's card radius.
 */
export const tileMenuItem = rcva(
  `${inlineRow} ${pad["2"]} touch-target state-layer cursor-pointer items-center gap-2 rounded-inner py-1.5 text-label-lg hover:text-error`,
);
/** Its label: one line (the popover is as wide as it, in whole tiles, up to 6). */
export const tileMenuLabel = rcva(text.line);
/**
 * One line, whatever it says (the rest in its tooltip): its height is decided before its words,
 * so a subhead that comes with the data never moves the body under it.
 */
export const tileSubhead = rcva(`${text.line} text-body-sm text-on-surface-variant`);

export type TileEmphasis = "inverse" | "tinted";
export type TileVariants = VariantProps<typeof tile>;

/**
 * @example <ui-tile size="m" heading="Line pricing" .count=${6}><ui-tag slot="trailing">Draft</ui-tag>…</ui-tile>
 * @example <ui-tile size="full" bare>…a period choice…</ui-tile>
 * @example <ui-tile size="s" emphasis="inverse" heading="Next up">…what's due today…</ui-tile>
 */
@customElement("ui-tile")
export class UiTile extends LightElement {
  @property() size: TileSize = "s";
  @property() heading: Renderable = "";
  @property() subhead: Renderable = "";
  @property({ type: Number }) count?: number;
  @property({ attribute: "count-tone" }) countTone: BadgeVariants["tone"];
  /** Draw the skeleton (the data is on its way). */
  @property({ type: Boolean }) loading = false;
  /** No surface and no cap: a control or notice that steers the screen. */
  @property({ type: Boolean }) bare = false;
  /**
   * Its body scrolls inside its box instead of fading behind "Show all": a page's own collection,
   * record or setting, as tall as it is until someone sizes it by hand, then that tall.
   */
  @property({ type: Boolean }) scrolls = false;
  /** A contrasting surface for the tile the screen is about (none on a `bare` tile: it has no surface). */
  @property() emphasis?: TileEmphasis;
  /** What's on its way. */
  @property() kind: TileVariants["kind"];
  @state() private _open = false;
  @state() private _over = false;
  /** The tile's own height (px), as last reported: "Show all" asks for it plus what's hidden. */
  #rootHeight = 0;
  /**
   * The body's and the content's heights, as the ResizeObserver last reported them. Read from its
   * entries (sizes the browser already computed in its one layout pass), never from the elements:
   * a tile that measured itself after each render forced a layout of the whole page per tile, which
   * made opening a screen of tiles stall for seconds.
   */
  #bodyHeight = 0;
  #contentHeight = 0;
  #resize = new ResizeObserver((entries) => {
    for (const e of entries) {
      const height = e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height;
      const el = e.target as HTMLElement;
      if (el.hasAttribute("data-tile-root")) {
        this.#rootHeight = height;
        // Its loaded height (whether it showed at all, for the next time it waits here).
        if (!this.loading && height > 0)
          this.dispatchEvent(new CustomEvent("ui-tile-height", { detail: { height }, bubbles: true }));
      } else if (el.hasAttribute("data-tile-content")) this.#contentHeight = height;
      else this.#bodyHeight = e.contentBoxSize?.[0]?.blockSize ?? e.contentRect.height;
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
    // Observing reports each element's size on the next frame (and again whenever it changes);
    // nothing is read here.
    for (const el of this.querySelectorAll<HTMLElement>(
      ":scope [data-tile-body], :scope [data-tile-content], :scope [data-tile-root]",
    ))
      if (!this.#observed.has(el) && el.closest("ui-tile") === this) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
  }

  /** Whether the body holds more than its cap (then "Show all" is offered). */
  private _measure() {
    // The content's own box against the body's: `scrollHeight` would also count what's hidden on
    // purpose (a chart's table for screen readers).
    const over = !this.scrolls && !this._open && !!this.#bodyHeight && this.#contentHeight > this.#bodyHeight + 1;
    if (over !== this._over && !this._open) this._over = over;
  }

  /**
   * "Show all" asks the board for the rows the whole content needs (its box, plus what's hidden, plus
   * the "Show less" under it); "Show less" gives them back. Read in the click, from the sizes the
   * ResizeObserver last reported.
   */
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
    // The authored children are always placed (a LightElement places them from its first render,
    // or the parent's later updates land outside the template); while loading they're hidden.
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
            ${this._open ? "Show less" : "Show all"}
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

/** Where a drag is: the pointer, how far it has gone since the drag began. */
export interface TileDrag {
  phase: "start" | "move" | "end" | "cancel";
  x: number;
  y: number;
  dx: number;
  dy: number;
}

/**
 * How far the pointer goes (px) before a press on a handle is a drag (interact.js' `startDistance`,
 * jQuery UI's `distance`): a press that doesn't move is a click, and focuses the handle for keys.
 */
const START_DISTANCE = 4;
/**
 * Near a scrolling edge (px), a drag scrolls (interact.js' `autoScroll`, gridstack's scroll on
 * drag): up to this many px a frame, faster the nearer the edge, once per frame (rAF).
 */
const SCROLL_EDGE = 48;
const SCROLL_SPEED = 20;

/** The nearest box that scrolls up and down around an element (through shadow roots), or the page. */
function scrollerOf(el: Element): HTMLElement {
  for (let at: Element | null = el; at;) {
    if (at instanceof HTMLElement && at.scrollHeight > at.clientHeight) {
      const y = getComputedStyle(at).overflowY;
      if (y === "auto" || y === "scroll") return at;
    }
    at = at.parentElement ?? ((at.getRootNode() as ShadowRoot).host || null);
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}

/**
 * A tile someone arranges by hand: its content, with a grab bar on its top edge and a resize
 * corner at its bottom end (`resizable`). It only reports, the owner decides what that does (and
 * moves the tile: `UiBoard.hold`):
 *
 * - dragging the bar: `ui-drag` (`TileDrag`: start, move, end, or cancel); dragging the corner:
 *   `ui-resize` (by how far it has gone: towards the inline end is wider, in either writing
 *   direction);
 * - the gesture, as interact.js does it: the pointer is captured (its moves arrive off the small
 *   handle), a drag starts only past `START_DISTANCE`, only the pointer that pressed counts, it
 *   ends on release and is cancelled by Escape (anywhere: the handle never took focus), a lost
 *   capture or the tile leaving the page; near the top or bottom of what scrolls, it scrolls, and
 *   reports a move for each frame it does (the pointer is still, the page moves under it);
 * - keys on the bar: `ui-step` `{ to: "start" | "earlier" | "later" }` (Home, the arrows) and
 *   `ui-hide` (Delete); on the corner: `ui-resize-step` `{ span, rows }` (±1 a key).
 *
 * @example <ui-tile-arrange label="Messages" resizable @ui-drag=${…} @ui-resize=${…}>…</ui-tile-arrange>
 */
let anchors = 0;

@customElement("ui-tile-arrange")
export class UiTileArrange extends LightElement {
  /** The tile's name, for its handles' labels ("Move Messages"). */
  @property() label = "";
  @property({ type: Boolean }) resizable = false;
  @state() private _moving = false;
  /** Ties the grab bar's popover to it (CSS anchor positioning): unique per tile. */
  readonly #anchor = `tile-grip-${++anchors}`;
  /** Hovered, and what it holds lifts on hover (`data-tile-lift`): the box lifts, handles and all. */
  @state() private _lift = false;
  #drag?: {
    kind: "move" | "resize";
    /** Which way a resize goes: both (the corner), across only (the end edge), down only (the bottom edge). */
    axis: "xy" | "x" | "y";
    id: number;
    x: number;
    y: number;
    handle: HTMLElement;
    /** Past `START_DISTANCE`: a drag, reported. */
    started: boolean;
    last: { clientX: number; clientY: number };
    scroller?: HTMLElement;
    frame?: number;
  };

  #box() {
    return this.querySelector<HTMLElement>(":scope > div");
  }

  #rtl() {
    return getComputedStyle(this.#box() ?? document.documentElement).direction === "rtl" ? -1 : 1;
  }

  #emit(phase: TileDrag["phase"], e: { clientX: number; clientY: number }) {
    const d = this.#drag!;
    const detail: TileDrag = {
      phase,
      x: e.clientX,
      y: e.clientY,
      dx: d.axis === "y" ? 0 : (e.clientX - d.x) * (d.kind === "resize" ? this.#rtl() : 1),
      dy: d.axis === "x" ? 0 : e.clientY - d.y,
    };
    this.dispatchEvent(new CustomEvent(d.kind === "move" ? "ui-drag" : "ui-resize", { detail, bubbles: true }));
  }

  /** The grab bar's popover. */
  #menu() {
    return this.querySelector<HTMLElement>(":scope > div > [popover]");
  }
  /** A press on the grab bar ended without moving: its click opens the popover. */
  #pressed = false;
  /** The popover was open when the press began (that press closed it: light dismiss), so the click leaves it shut. */
  #wasOpen = false;

  /**
   * The grab bar's click: opens its popover, after a press that didn't move or from the keyboard
   * (Enter, Space). Opened on click, not on the pointer's release: the popover closes on a release
   * outside it (`popover="auto"`'s light dismiss), and the release that ends the press is one.
   */
  #click = (e: MouseEvent) => {
    const fromKeys = e.detail === 0;
    if (!this.#pressed && !fromKeys) return;
    this.#pressed = false;
    const menu = this.#menu();
    if (!menu) return;
    if (fromKeys) menu.togglePopover();
    else if (!this.#wasOpen) menu.showPopover();
  };

  #down(kind: "move" | "resize", e: PointerEvent, axis: "xy" | "x" | "y" = "xy") {
    if (kind === "move") this.#wasOpen = !!this.#menu()?.matches(":popover-open");
    if (e.button !== 0 || !e.isPrimary || this.#drag) return;
    const handle = e.currentTarget as HTMLElement;
    // Keep the pointer's moves while it's off the small handle (a pen or touch may refuse it).
    try {
      handle.setPointerCapture(e.pointerId);
    } catch {
      /* the handle still follows the moves that reach it */
    }
    const at = { clientX: e.clientX, clientY: e.clientY };
    this.#drag = { kind, axis, id: e.pointerId, x: e.clientX, y: e.clientY, handle, started: false, last: at };
    // No text selection, no focus ring from a press; Escape is heard wherever focus is.
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

  /** Each frame of a drag: near the scroller's top or bottom, scroll it, and report the move it makes. */
  #scroll = () => {
    const d = this.#drag;
    if (!d?.started || !d.scroller) return;
    const s = d.scroller;
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
    if (e.key !== "Escape" || !this.#drag) return;
    e.preventDefault();
    e.stopPropagation();
    this.#finish("cancel", this.#drag.last);
  };

  #finish(phase: "end" | "cancel", e: { clientX: number; clientY: number }) {
    const d = this.#drag;
    if (!d) return;
    window.removeEventListener("keydown", this.#escape, true);
    if (d.frame !== undefined) cancelAnimationFrame(d.frame);
    d.handle.removeAttribute("data-dragging");
    this._moving = false;
    if (d.started) this.#emit(phase, e);
    this.#drag = undefined;
    // A press that didn't move: a click, which focuses the handle (its keys arrange the tile).
    if (!d.started && phase === "end") {
      d.handle.focus({ preventScroll: true });
      // A press on the grab bar that didn't move: the click that follows opens its popover (`#click`).
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
        aria-label=${this.label ? `Move ${this.label}` : "Move"}
        title="Drag to move. Click for more. Arrow keys: earlier or later. Delete: hide."
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
              aria-label=${this.label ? `Resize ${this.label}` : "Resize"}
              title="Drag to resize. Arrow keys: a tile at a time."
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
          aria-label=${this.label ? `Remove ${this.label}` : "Remove"}
          class=${tileMenuItem()}
          @click=${(e: Event) => {
            ((e.currentTarget as HTMLElement).parentElement as HTMLElement).hidePopover();
            this.dispatchEvent(new CustomEvent("ui-hide", { bubbles: true }));
          }}
        >
          ${iconSvg("trash", { size: "sm" })}<span class=${tileMenuLabel()}>Remove</span>
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
