import { motion as motionQueue } from "../../base/motion-queue.ts";
import { cssTime } from "../../base/css-time.ts";
import { tileH, tileW } from "../../base/tiles.ts";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  clampRows,
  keepOrder,
  lanesFor,
  layoutLanes,
  place,
  rowsFor,
  scaleArranged,
  stretch,
  type Placed,
  type TileSize,
} from "../../base/board.ts";
import { pack, type PackInput } from "../../base/pack.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { board as layout, inlineRow, text } from "./algebra.ts";
import { iconSvg } from "../media/icon.ts";

/*
 * The board's placement values, set inline (the lanes' count on the lanes, each tile's column,
 * span, row and rows on the tile) and read only by the box they're set on: registered as not
 * inherited (`*`: unset still means unset). Inherited, every change of placement restyled
 * everything inside the tiles: the board re-placing its tiles for a new width (a column opening)
 * took 33ms of style; not inherited, 2ms.
 */
for (const name of [
  "--board-cols",
  "--board-quarters",
  "--lane",
  "--span",
  "--row",
  "--rows",
  "--lift-x",
  "--lift-y",
  "--held-w",
  "--held-h",
]) {
  try {
    CSS.registerProperty({ name, syntax: "*", inherits: false });
  } catch {
    /* already registered (hot reload) */
  }
}

/**
 * Board: a screen's widgets as tiles on a grid of cells (after Android's app widgets: a widget
 * declares its size in cells and is placed by them, never by what it holds; Material 3 layout: one
 * pane at the compact breakpoint, more as the window grows).
 *
 * Purpose: Layout & page structure · Kind: primitive
 *
 * Each tile has a size, `s` (1 lane), `m` (2), `l` (3) or `full`, and rows (5rem cells, 16px apart).
 * The board has 1 to 4 lanes by its own width (never under 18rem each). Each tile goes to the first
 * place in reading order, at or after the one before it, where its cells are free
 * (src/components/base/board.ts `place`): small tiles after a tall one go one under another beside
 * it. Only sizes, rows and order go in, so the box a tile waits in while loading is the box it shows
 * its data in. A tile that opens past its rows ("Show all", `ui-tile-rows`) takes the rows it asks
 * for until it closes. When tiles move (one opened, the board resized), they slide there on M3's spatial spring
 * (at once with Reduce motion). Until it knows its width, the board is one column in reading order.
 */
export const boardBox = rcva(layout.box);
export const boardLanes = rcva(layout.lanes);
/** A tile new to the board fades in (M3: entering content fades, quickly); it never pops in. */
export const boardTile = rcva(
  `${layout.tile} ${layout.held} [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none data-empty:absolute data-empty:start-0 data-empty:end-0 data-empty:invisible`,
  { variants: { inset: { true: layout.inset, false: "" } } },
);
/**
 * Where the held tile lands if let go now (`UiBoard.hold`; gridstack's placeholder): its tiles in the
 * arrangement shown live, which the other tiles have made room for. It glides with them.
 */
export const boardDrop = rcva(layout.drop);
export const boardDropMark = rcva(
  "h-full rounded-box border-2 border-dashed border-primary bg-primary/12 [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] starting:opacity-0 motion-reduce:transition-none",
  // A place to let go on another board: its label centred in it.
  { variants: { target: { true: "grid place-items-center", false: "" } } },
);
/** That label: a plus and a few words, in primary, on one line (cut short if the board is narrow). */
export const boardDropLabel = rcva(`${inlineRow} ${text.line} items-center gap-2 text-label-lg text-primary`);
/** An edge of a tile a moved tile goes by. */
export type BoardEdge = "start" | "end" | "top" | "bottom";
/** What a tile that fits its content holds: its content's own height, measured by the board. */
export const boardFit = rcva(layout.fit);

/**
 * The tiles each fitting tile took last time, by its `remember` key: a tile measured once starts at
 * that height next time, so coming back to a page moves nothing.
 */
const fitMemory = new Map<string, number>();

/** Motion tokens, read once each (they never change while the page runs). */
const tokens = new Map<string, string>();
const motion = (name: string) => {
  let v = tokens.get(name);
  if (v === undefined) tokens.set(name, (v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()));
  return v;
};

export interface BoardItem {
  /** Stays the same while the item exists (its tile keeps its state, and slides when it moves). */
  key: string;
  size: TileSize;
  /**
   * Its height in tiles (Android's `targetCellHeight`): the same loading and loaded. `"fit"`: the
   * whole tiles that hold what it shows, measured as it resizes (a generated form or table, whose
   * height is its data's): one tile until measured, then its content rounded up to whole tiles.
   */
  rows: number | "fit";
  /**
   * Its content fills its tiles edge to edge, with no 4px inset: for a board inside it, whose own
   * tiles then lie on this board's tile lines.
   */
  flush?: boolean;
  /** For a fitting tile: the key its height is remembered by, so it starts at that height next time. */
  remember?: string;
  /** Its width in tiles, when it's exact rather than its size's (never more than the board has). */
  span?: number;
  /** The most it grows when narrowed below its design (`rowsAt`): text 2, figures 4, else 1. */
  reflow?: number;
  /** The most tiles across and down the board may stretch it to (its `maxWidth`, `maxRows`). */
  maxSpan?: number;
  maxRows?: number;
  /**
   * How far the default layout may bend it (its widget's bounds; `pack`): left out, it keeps its
   * width and rows.
   */
  bounds?: PackInput["bounds"];
  /** The board's width and its own rows, always (a screen's header). */
  fixed?: boolean;
  /** The lane someone placed it at by hand (free placement; `place`'s `at`). */
  at?: number;
  /** And the row (`place`'s `atRow`): it stays exactly there. */
  atRow?: number;
  /**
   * The board's tiles across when `at` and `span` were set by hand: on a board of another width
   * they're scaled to it (`scaleArranged`). Left out, they're this board's own.
   */
  arrangedAt?: number;
  /** One tile. */
  content?: unknown;
  /**
   * A place something dragged here can be let go (another board's tile): drawn as the dashed mark,
   * its `content` (a short label) centred in it after a plus.
   */
  drop?: boolean;
  /**
   * Draws nothing yet, and takes no lanes: a tile that may not show at all (its widget is still
   * finding out). It's in the DOM, out of the board's flow, and placed like any other once it isn't
   * away (on a board nobody arranged, the default layout is worked out again with it in).
   */
  away?: boolean;
}

/** Where the pointer is (client px). */
export interface BoardPoint {
  x: number;
  y: number;
}

/**
 * @example <ui-board .items=${[{ key: "stats", size: "m", content: statsCard }, { key: "queue", size: "l", content: queue }]}></ui-board>
 */
@customElement("ui-board")
export class UiBoard extends LightElement {
  @property({ attribute: false }) items: BoardItem[] = [];
  /**
   * Fills a box of its own exactly (a side panel's section): as many whole tiles as its width holds
   * to the nearest, each stretched or shrunk to share the width, rather than whole tiles of the
   * screen's size with the rest left over. Rows stay a tile high.
   */
  @property({ type: Boolean }) fit = false;
  /** With `fit`: the width each lane takes, px. */
  @state() private _laneW = 0;
  /** The lane count, from the board's width (the same thresholds as its container queries). */
  @state() private _lanes = 0;
  /** Its tiles across now (0 until it knows its width). */
  get lanes() {
    return this._lanes;
  }
  /** The lanes' width, as the observer last reported it. */
  #width = 0;
  /** The width the lanes will have once the column springing now has settled (`expectWidth`). */
  #expected?: number;

  /** Lanes for its width: while a column springs, also no more than its width at the end will hold. */
  #fitLanes() {
    if (!this.#width) return;
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    if (this.fit) {
      const lanes = Math.max(1, Math.round(this.#width / tileW(scale)));
      if (lanes !== this._lanes) this._lanes = lanes;
      const w = this.#width / lanes;
      if (Math.abs(w - this._laneW) > 0.1) this._laneW = w;
      return;
    }
    const now = lanesFor(this.#width, scale);
    const lanes = this.#expected === undefined ? now : Math.min(now, lanesFor(this.#expected, scale));
    if (lanes !== this._lanes) this._lanes = lanes;
  }

  /**
   * A column is springing open or shut, and the page will be `delta` px narrower (or, negative,
   * wider) once it has settled (`<ui-frame-main>` tells its boards as the spring starts). Until
   * `settled`, the board has no more lanes than both its width now and its width then will hold:
   * narrowing, its tiles take their final places at once and slide there as the panel's edge comes
   * in, so none is ever beyond the edge; widening, they gain lanes as the room arrives.
   */
  expectWidth(delta: number, settled: Promise<unknown>) {
    if (!this.#width || !delta) return;
    const expected = this.#width - delta;
    this.#expected = expected;
    this.#fitLanes();
    void settled.then(() => {
      if (this.#expected !== expected) return;
      this.#expected = undefined;
      this.#fitLanes();
    });
  }
  /** Rows a tile asked for while it's open past its own ("Show all"), by its key. */
  @state() private _open = new Map<string, number>();
  /** The whole tiles a fitting tile's content takes, by its key (from `#fits`). */
  @state() private _fit = new Map<string, number>();
  /**
   * The content of each fitting tile, measured in the observer's callback (after layout): the tiles
   * that hold it, its inset included. Its height doesn't depend on its tile's, so this settles.
   */
  #fits = new ResizeObserver((entries) => {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    let next: Map<string, number> | undefined;
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const key = el.dataset.fit!;
      const remember = el.dataset.remember || undefined;
      const inset = el.dataset.flush !== undefined ? 0 : 8;
      const rows = rowsFor((e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height) + inset, scale);
      if (remember) fitMemory.set(remember, rows);
      if ((next ?? this._fit).get(key) !== rows) (next ??= new Map(this._fit)).set(key, rows);
    }
    if (next) this._fit = next;
  });
  #fitting = new Set<Element>();

  /**
   * The board's width from the ResizeObserver's entries, and where each tile was: read in the
   * observer's callback, which runs after layout and before paint, so the reads cost nothing and a
   * tile that moved slides from where it was in the same frame.
   */
  #resize = new ResizeObserver((entries) => {
    const lanesEl = this._lanesEl;
    let resized = false;
    for (const e of entries)
      if (e.target === lanesEl) {
        resized = true;
        this.#width = e.borderBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
        this.#fitLanes();
      }
    this._slide(resized);
  });
  #observed = new Set<Element>();
  /** The held tile's dashed mark as last drawn (what its next glide starts from). */
  #mark?: { x: number; y: number; w: number; h: number };
  /** Each tile's last offset in the lanes, by key. */
  #at = new Map<string, { x: number; y: number; span: number; rows: number; w: number; h: number }>();
  /** Each tile's size animation while it plays (a new one takes over from where it is). */
  #sizing = new WeakMap<HTMLElement, Animation>();
  /**
   * The tile held by hand (`hold`): its key, how it follows (`move`: the point it was grabbed by
   * stays under the pointer; `resize`: its start corner stays put), where that corner was in the
   * lanes, the pointer and its size in px.
   */
  #held?: {
    key: string;
    how: "move" | "resize";
    grab: BoardPoint;
    corner: { left: number; right: number; top: number };
    pointer: BoardPoint;
    size?: { width: number; height: number };
    /** Its size when picked up. */
    box: { width: number; height: number };
  };
  /** The tile just let go, until its drop animation starts (no slide of its own meanwhile). */
  #dropping?: string;
  /** A tile was just let go: the slides it causes play with its drop, as input motion. */
  #arranging = false;
  /** The key of the held tile, for its dashed mark: where it lands in the arrangement shown now. */
  @state() private _held?: string;

  /** Each tile's place as last drawn, by key. */
  #placed = new Map<string, Placed>();
  placed(): ReadonlyMap<string, Placed> {
    return this.#placed;
  }

  /** A lane's width and a row's height, px: the screen's tile, or a fitted board's share of its width. */
  #cellSize() {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    return { w: this.fit && this._laneW ? this._laneW : tileW(scale), h: tileH(scale) };
  }

  /** The board's lanes and the tile (lane, row) under a point (client px), unclamped. */
  cellAt(point: BoardPoint) {
    const lanes = this._lanesEl;
    if (!lanes) return null;
    const l = lanes.getBoundingClientRect();
    const { w, h } = this.#cellSize();
    const across = Math.max(1, this._lanes);
    const rtl = getComputedStyle(lanes).direction === "rtl";
    return {
      lanes: across,
      lane: (rtl ? l.right - point.x : point.x - l.left) / w,
      row: (point.y - l.top) / h,
      inside: point.x >= l.left && point.x <= l.right && point.y >= l.top && point.y <= l.bottom + h * 2,
    };
  }

  /**
   * Where a place's tiles are on the lanes now (client px), whatever is drawn there: a drag's
   * targets are worked out against places, not against tiles gliding to new ones.
   */
  rectOf(p: Placed): DOMRect | null {
    const lanes = this._lanesEl;
    if (!lanes) return null;
    const l = lanes.getBoundingClientRect();
    const { w, h } = this.#cellSize();
    const rtl = getComputedStyle(lanes).direction === "rtl";
    const start = rtl ? l.right - (p.lane + p.span) * w : l.left + p.lane * w;
    return new DOMRect(start, l.top + p.row * h, p.span * w, p.rows * h);
  }

  /** The order tiles are drawn in the document (`keepOrder`), by key. */
  #drawn: string[] = [];
  #inOrder(): BoardItem[] {
    this.#drawn = keepOrder(
      this.#drawn,
      this.items.map((it) => it.key),
    );
    const byKey = new Map(this.items.map((it) => [it.key, it]));
    return this.#drawn.map((k) => byKey.get(k)!);
  }

  #cell(key: string) {
    return this._tiles.find((t) => t.dataset.key === key);
  }

  /**
   * Holds a tile by hand, as gridstack does: lifted over the others (`data-held`), it follows the
   * pointer by a transform alone (no re-render per move: `follow` writes two not inherited custom
   * properties on its box), out of the pointer's way so what's under the pointer is the tile it's
   * over. `move`: the point it was grabbed by stays under the pointer; `resize`: its start corner
   * stays put while `follow` gives it a size in px. Either way its owner re-places the board live
   * as the place it would land changes: a dashed mark (`boardDrop`) shows that place, and the other
   * tiles glide out of its way at once (input motion, the fast spatial spring), so the board always
   * shows what letting go does.
   */
  hold(key: string, how: "move" | "resize", pointer: BoardPoint) {
    const cell = this.#cell(key);
    const lanes = this._lanesEl;
    if (!cell || !lanes) return;
    // Whatever it was doing (sliding, growing) stops where it is.
    for (const a of cell.getAnimations()) a.cancel();
    const r = cell.getBoundingClientRect();
    const l = lanes.getBoundingClientRect();
    this.#held = {
      key,
      how,
      grab: { x: pointer.x - r.left, y: pointer.y - r.top },
      corner: { left: r.left - l.left, right: r.right - l.left, top: r.top - l.top },
      pointer,
      box: { width: r.width, height: r.height },
    };
    // Into the top layer, where it was: nothing clips it while it's carried.
    this.#lift();
    cell.style.setProperty("--grab", `${pointer.x - r.left}px ${pointer.y - r.top}px`);
    cell.toggleAttribute("data-held", true);
    cell.setAttribute("popover", "manual");
    try {
      cell.showPopover();
    } catch {
      /* no top layer (an older browser): it moves within its panel */
    }
    this._held = key;
  }

  /** The held tile is over another board that would keep it (`true`): drawn at half its size. */
  carry(out: boolean) {
    const cell = this.#held && this.#cell(this.#held.key);
    cell?.toggleAttribute("data-out", out);
  }

  /** The held tile follows the pointer (and, resizing, takes this size in px). */
  follow(pointer: BoardPoint, size?: { width: number; height: number }) {
    const h = this.#held;
    if (!h) return;
    h.pointer = pointer;
    if (size) h.size = size;
    this.#lift();
  }

  /**
   * Lets the held tile go: on the next frame (once its owner has re-placed it, or put it back) it
   * springs from where it's shown to its tiles, position and size, as input motion.
   */
  drop() {
    const h = this.#held;
    if (!h) return;
    // Where it's shown the moment it's let go, read now: by the next frame its owner has re-placed
    // it, and its lift (measured from its old place) would put it somewhere it never was.
    const from = this.#cell(h.key)?.getBoundingClientRect();
    this.#held = undefined;
    this.#dropping = h.key;
    // What the drop pushes aside moves with it, as the same input motion, not after it.
    this.#arranging = true;
    requestAnimationFrame(() => {
      this._held = undefined;
      this.#dropping = undefined;
      this.#arranging = false;
      const cell = this.#cell(h.key);
      if (!cell || !from) return;
      // Out of the top layer, back into its tiles (removing the attribute takes it out at once,
      // without a hidden frame in between, so it doesn't fade in again).
      cell.removeAttribute("popover");
      cell.removeAttribute("data-held");
      cell.removeAttribute("data-out");
      for (const p of ["--lift-x", "--lift-y", "--held-w", "--held-h", "--grab"]) cell.style.removeProperty(p);
      const to = cell.getBoundingClientRect();
      this.#remember(cell);
      const duration = cssTime(motion("--duration-spatial"));
      if (!duration) return;
      const easing = motion("--ease-spatial") || "ease";
      const sized = Math.abs(from.width - to.width) >= 1 || Math.abs(from.height - to.height) >= 1;
      const anims = [
        cell.animate([{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: "0 0" }], {
          duration,
          easing,
          composite: "add",
        }),
      ];
      if (sized) {
        const grow = cell.animate(
          [
            { width: `${from.width}px`, height: `${from.height}px` },
            { width: `${to.width}px`, height: `${to.height}px` },
          ],
          { duration, easing },
        );
        this.#sizing.set(cell, grow);
        anims.push(grow);
      }
      void motionQueue.input(anims);
    });
  }

  /**
   * Puts the held tile where the pointer has it, in the viewport (it's in the top layer): the
   * pointer less where it was grabbed (moving), anywhere on the screen, or its start corner where
   * it is on the lanes now (resizing), at its size. Kept on the screen.
   */
  #lift() {
    const h = this.#held;
    const lanes = this._lanesEl;
    const cell = h && this.#cell(h.key);
    if (!h || !lanes || !cell) return;
    const { width: w, height: ht } = h.size ?? h.box;
    let x: number;
    let y: number;
    if (h.how === "move") {
      x = h.pointer.x - h.grab.x;
      y = h.pointer.y - h.grab.y;
    } else {
      const l = lanes.getBoundingClientRect();
      const rtl = getComputedStyle(cell).direction === "rtl";
      x = l.left + (rtl ? h.corner.right - w : h.corner.left);
      y = l.top + h.corner.top;
    }
    x = Math.max(0, Math.min(x, innerWidth - w));
    y = Math.max(0, Math.min(y, innerHeight - Math.min(ht, innerHeight)));
    cell.style.setProperty("--lift-x", `${x}px`);
    cell.style.setProperty("--lift-y", `${y}px`);
    cell.style.setProperty("--held-w", `${w}px`);
    cell.style.setProperty("--held-h", `${ht}px`);
  }

  /** A tile's place and tiles as they are now (what the next slide starts from). */
  #remember(tile: HTMLElement) {
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    const qw = (this._lanesEl?.clientWidth ?? 0) / (4 * Math.max(1, this._lanes));
    const qh = tileH(scale) / 4;
    const span = Number(tile.style.getPropertyValue("--span")) || 0;
    const rows = Number(tile.style.getPropertyValue("--rows")) || 0;
    this.#at.set(tile.dataset.key!, { x: tile.offsetLeft, y: tile.offsetTop, span, rows, w: span * qw, h: rows * qh });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#fits.disconnect();
    this.#fitting.clear();
    this.#observed.clear();
    this.#at.clear();
  }

  private get _lanesEl() {
    return this.querySelector<HTMLElement>(":scope > div > [data-board-lanes]");
  }
  private get _tiles() {
    // Its own tiles only: a tile may hold another board, whose tiles aren't this board's.
    const lanes = this._lanesEl;
    return lanes ? [...lanes.children].filter((e): e is HTMLElement => e.hasAttribute("data-board-tile")) : [];
  }

  protected updated() {
    // Every tile and the lanes are watched: any change of size is where a move starts (a tile that
    // grew moves the rows under it; the board's width moves everything).
    const watch = [this._lanesEl, ...this._tiles].filter((e): e is HTMLElement => !!e);
    for (const el of watch)
      if (!this.#observed.has(el)) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
    for (const el of this.#observed)
      if (!el.isConnected) {
        this.#resize.unobserve(el);
        this.#observed.delete(el);
      }
    for (const tile of this._tiles) {
      const fit = tile.querySelector(":scope > [data-fit]");
      if (fit && !this.#fitting.has(fit)) {
        this.#fitting.add(fit);
        this.#fits.observe(fit);
      }
    }
    for (const el of this.#fitting)
      if (!el.isConnected) {
        this.#fits.unobserve(el);
        this.#fitting.delete(el);
      }
    // Re-placed while held: the held tile stays under the pointer from its new place.
    if (this.#held) this.#lift();
    // Tiles that moved in this render slide from where they were, whether or not their size
    // changed (a tile pushed down a row keeps its size, so no ResizeObserver entry reports it).
    // Read here, after the render and before the frame is painted.
    this._slide();
  }

  /**
   * Tiles that moved since the last look slide from where they were, and tiles whose size changed
   * (resized by hand, or given other tiles by a new width) grow or shrink from their old size to
   * their new tiles, rather than jumping to them (M3's spatial spring; with Reduce motion its
   * duration is 0), as one follow job in the motion queue. A size is compared by the tiles the
   * placement gives (`--span`, `--rows`), never by what's measured, which a size animation moves;
   * a new size while one plays takes over from where it is. Called in the observer's callback,
   * after layout.
   */
  private _slide(resized = false) {
    // While a tile is held, the board answers the hand: the fast spring (gridstack's is 0.3s).
    const fast = this.#held ? "-fast" : "";
    const duration = cssTime(motion(`--duration-spatial${fast}`));
    const easing = motion(`--ease-spatial${fast}`) || "ease";
    const seen = new Set<string>();
    const slides: Animation[] = [];
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    // A quarter track each way: the board's width over its quarters, a quarter of a tile down.
    const qw = (this._lanesEl?.clientWidth ?? 0) / (4 * Math.max(1, this._lanes));
    const qh = tileH(scale) / 4;
    for (const tile of this._tiles) {
      const key = tile.dataset.key!;
      // Only placed tiles count: the first frame lays tiles out in reading order before the board
      // knows its lanes, and sliding from there flew every tile across the page as it loaded.
      if (tile.hasAttribute("data-empty") || !tile.style.getPropertyValue("--lane")) continue;
      seen.add(key);
      const span = Number(tile.style.getPropertyValue("--span")) || 0;
      const rows = Number(tile.style.getPropertyValue("--rows")) || 0;
      const now = { x: tile.offsetLeft, y: tile.offsetTop, span, rows, w: span * qw, h: rows * qh };
      const was = this.#at.get(key);
      this.#at.set(key, now);
      if (!was || !duration) continue;
      // The held tile follows the pointer, not the layout (`hold`); it springs to its place on `drop`.
      if (key === this.#held?.key) {
        this.#lift();
        continue;
      }
      // Just let go: it springs from where it was shown on `drop`'s frame, not from its old place.
      if (key === this.#dropping) continue;
      // Its size: from what it shows now (a size animation playing) or its old tiles, to its new ones.
      if (was.span !== span || was.rows !== rows) {
        const playing = this.#sizing.get(tile);
        const from =
          playing?.playState === "running" ? { w: tile.offsetWidth, h: tile.offsetHeight } : { w: was.w, h: was.h };
        playing?.cancel();
        const grow = tile.animate(
          [
            { width: `${from.w}px`, height: `${from.h}px` },
            { width: `${now.w}px`, height: `${now.h}px` },
          ],
          { duration, easing },
        );
        this.#sizing.set(tile, grow);
        slides.push(grow);
      }
      const dx = was.x - now.x;
      const dy = was.y - now.y;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      slides.push(
        tile.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], { duration, easing, composite: "add" }),
      );
    }
    // The held tile's dashed mark glides to its new place and size with the tiles making room.
    const mark = this._lanesEl?.querySelector<HTMLElement>(":scope > [data-board-drop]");
    if (mark) {
      const now = { x: mark.offsetLeft, y: mark.offsetTop, w: mark.offsetWidth, h: mark.offsetHeight };
      const was = this.#mark;
      this.#mark = now;
      if (was && duration) {
        const dx = was.x - now.x;
        const dy = was.y - now.y;
        if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1)
          slides.push(
            mark.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], {
              duration,
              easing,
              composite: "add",
            }),
          );
        if (Math.abs(was.w - now.w) >= 1 || Math.abs(was.h - now.h) >= 1)
          slides.push(
            mark.animate(
              [
                { width: `${was.w}px`, height: `${was.h}px` },
                { width: `${now.w}px`, height: `${now.h}px` },
              ],
              { duration, easing },
            ),
          );
      }
    } else this.#mark = undefined;
    for (const key of this.#at.keys()) if (!seen.has(key)) this.#at.delete(key);
    // The board's own width changed (a column springing open moves the panel's edge): the tiles
    // keep up with it, as input motion, so none is left beyond the edge. Anything else that moved
    // them (a tile grew, data came in) is follow motion: held where they were until input motion
    // has played, then a board at a time (src/components/base/motion-queue.ts). Tiles making room
    // for a held one, or for one just let go, answer the hand: input motion too.
    if (resized || this.#arranging || this.#held) void motionQueue.input(slides);
    else void motionQueue.add(slides, "follow", this);
  }

  /** The rows an item takes: what its tile asked for while open, else its own. */
  private _rows(it: BoardItem) {
    const open = this._open.get(it.key);
    if (open) return open;
    if (it.rows === "fit") return this._fit.get(it.key) ?? (it.remember ? fitMemory.get(it.remember) : undefined) ?? 1;
    return clampRows(it.rows);
  }

  /** A tile opened past its rows, or closed again (`ui-tile-rows` from inside an item). */
  private _onRows(key: string, e: Event) {
    const rows = (e as CustomEvent<{ rows: number | null }>).detail.rows;
    const next = new Map(this._open);
    if (rows) next.set(key, clampRows(rows));
    else next.delete(key);
    this._open = next;
  }

  /**
   * The default layout (`pack`: of the layouts the tiles' bounds allow, the one with the fewest gaps
   * and the most different shapes side by side), while nothing is placed by hand. Each tile is then
   * placed exactly there, so a tile opened past its rows pushes only what's under it.
   */
  private _packed(shown: BoardItem[], lanes: number): Placed[] | undefined {
    if (shown.some((it) => it.at !== undefined)) return undefined;
    // Laid out at its band and stretched across it (`stretch`): a tile more or less moves nothing,
    // it only widens or narrows the tiles; a widget stretched past the most it may take keeps that.
    const at = layoutLanes(lanes);
    return stretch(this._packAt(shown, at), at, lanes).map((p, i) => {
      const it = shown[i]!;
      const most = Math.min(it.maxSpan ?? Infinity, it.bounds?.maxSpan ?? Infinity);
      return p.span > most && !it.fixed && it.size !== "full" ? { ...p, span: Math.max(1, most) } : p;
    });
  }

  private _packAt(shown: BoardItem[], lanes: number): Placed[] {
    return pack(
      shown.map((it) => {
        const rows =
          it.rows === "fit"
            ? (this._fit.get(it.key) ?? (it.remember ? fitMemory.get(it.remember) : undefined) ?? 1)
            : clampRows(it.rows);
        const bounds = it.bounds && (it.rows === "fit" ? { ...it.bounds, minRows: rows, maxRows: rows } : it.bounds);
        return { size: it.size, rows, span: it.span, reflow: it.reflow, bounds, fixed: it.fixed };
      }),
      lanes,
    );
  }

  render(): TemplateResult {
    const lanes = this._lanes;
    const shown = this.items.filter((it) => !it.away);
    const packed = lanes ? this._packed(shown, lanes) : undefined;
    const where = lanes
      ? place(
          shown.map((it, i) => {
            const p = packed?.[i];
            // Placed by hand on a board of another width: scaled to this one.
            if (!p && it.at !== undefined && it.arrangedAt && it.arrangedAt !== lanes) {
              const s = scaleArranged(it.at, it.span ?? 1, it.arrangedAt, lanes);
              return {
                size: it.size,
                rows: this._rows(it),
                span: s.span,
                reflow: it.reflow,
                maxSpan: it.maxSpan,
                maxRows: it.maxRows,
                at: "at" in s ? s.at : undefined,
                atRow: "at" in s ? it.atRow : undefined,
              };
            }
            return {
              size: it.size,
              rows: p ? (this._open.get(it.key) ?? p.rows) : this._rows(it),
              span: p ? p.span : it.span,
              reflow: p ? 1 : it.reflow,
              maxSpan: it.maxSpan,
              maxRows: it.maxRows,
              at: p ? p.lane : it.at,
              atRow: p ? p.row : it.atRow,
            };
          }),
          lanes,
        )
      : [];
    const placeOf = new Map<string, Placed>(shown.map((it, i) => [it.key, where[i]!]));
    this.#placed = placeOf;
    // Where the held tile lands, in the arrangement shown now.
    const landing = this._held ? placeOf.get(this._held) : undefined;
    return html`<div class=${boardBox()}>
      <div
        class=${boardLanes()}
        style=${styleMap({
          "--board-cols": String(lanes || 1),
          "--board-quarters": String(4 * (lanes || 1)),
          // A fitted board's lanes share its width (`fit`); otherwise the screen's tile.
          "--tile-w": this.fit && this._laneW ? `${this._laneW}px` : undefined,
        })}
        data-board-lanes
      >
        ${
          landing
            ? html`<div
                class=${boardDrop()}
                data-board-drop
                aria-hidden="true"
                style=${styleMap({
                  "--lane": String(4 * landing.lane + 1),
                  "--span": String(4 * landing.span),
                  "--row": String(4 * landing.row + 1),
                  "--rows": String(4 * landing.rows),
                })}
              >
                <div class=${boardDropMark()}></div>
              </div>`
            : nothing
        }
        ${repeat(
          // In the order the tiles were first drawn, whatever order they're placed in: Lit's repeat
          // moves an element when the order changes, and a moved tile replays its entrance.
          this.#inOrder(),
          (it) => it.key,
          (it) => {
            const p = placeOf.get(it.key);
            return html`<div
              class=${boardTile({ inset: !it.flush })}
              data-board-tile
              data-key=${it.key}
              data-size=${it.size}
              ?data-empty=${!!it.away}
              style=${styleMap({
                // In the board's quarter tracks: a tile is four of them each way.
                "--lane": p ? String(4 * p.lane + 1) : undefined,
                "--span": p ? String(4 * p.span) : undefined,
                "--row": p ? String(4 * p.row + 1) : undefined,
                "--rows": String(4 * (p ? p.rows : this._rows(it))),
              })}
              @ui-tile-rows=${(e: Event) => this._onRows(it.key, e)}
            >
              ${
                it.drop
                  ? html`<div class=${boardDropMark({ target: true })}>
                      <span class=${boardDropLabel()}>${iconSvg("plus", { size: "sm" })}${it.content}</span>
                    </div>`
                  : it.rows === "fit"
                    ? html`<div
                        class=${boardFit()}
                        data-fit=${it.key}
                        data-remember=${it.remember ?? ""}
                        ?data-flush=${!!it.flush}
                      >
                        ${it.content}
                      </div>`
                    : it.content
              }
            </div>`;
          },
        )}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-board": UiBoard;
  }
}
