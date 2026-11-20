import { html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { GAP, ROW, lanesFor, place, type Placed, type TileSize } from "../../base/board.ts";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { board as layout } from "./algebra.ts";

/**
 * Board: a screen's widgets as tiles in lanes, placed by a masonry (Material 3 layout: one pane at
 * the compact breakpoint, more as the window grows).
 *
 * Purpose: Layout & page structure · Kind: primitive
 *
 * Each tile has a size, `s` (1 lane), `m` (2), `l` (3) or `full`, and takes at most the lanes
 * the board has. The board has 1 to 4 lanes by its own width (never under 18rem each); the
 * placement is src/components/base/board.ts `place`: each tile, in order, goes to the run of lanes
 * whose top is lowest. So the layout follows from the tiles, their sizes and their heights alone,
 * and when the board resizes, tiles reflow by the same rule (and slide there on M3's spatial
 * spring; at once with Reduce motion). Until it has measured its tiles, the board is a plain
 * grid in reading order, so nothing overlaps on the first frame.
 */
export const boardBox = rcva(layout.box);
export const boardLanes = rcva(layout.lanes, {
  variants: { placed: { true: layout.placed, false: layout.unplaced } },
});
/** A tile new to the board fades in (M3: entering content fades, quickly); it never pops in. */
export const boardTile = rcva(
  `${layout.tile} [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none`,
);

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
  content: unknown;
}

/**
 * @example <ui-board .items=${[{ key: "stats", size: "m", content: statsCard }, { key: "queue", size: "l", content: queue }]}></ui-board>
 */
@customElement("ui-board")
export class UiBoard extends LightElement {
  @property({ attribute: false }) items: BoardItem[] = [];
  @state() private _placed: Placed[] | null = null;
  @state() private _heights: number[] = [];

  /**
   * Each tile's height and the lanes' width, as the ResizeObserver last reported them: read from its
   * entries (sizes the browser already computed in its one layout pass), never from the elements,
   * so placing tiles as their data arrives never forces a layout of the page.
   */
  #sizes = new WeakMap<Element, number>();
  #width = 0;
  /** The text scale (root font size / 16), read with the sizes: there, style is already up to date. */
  #scale = 1;
  #resize = new ResizeObserver((entries) => {
    const lanes = this._lanesEl;
    this.#scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
    for (const e of entries) {
      const box = e.borderBoxSize?.[0];
      if (e.target === lanes) this.#width = box?.inlineSize ?? e.contentRect.width;
      else this.#sizes.set(e.target, box?.blockSize ?? e.contentRect.height);
    }
    this._layout();
  });
  /** The lane count of the last placement: tiles slide only when it changes (a resize). */
  #lanes = 0;
  #observed = new Set<Element>();
  /** A placement is queued (several observations in one turn place once). */
  #queued = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#observed.clear();
  }

  private get _lanesEl() {
    return this.querySelector<HTMLElement>(":scope > div > [data-board-lanes]");
  }
  private get _tiles() {
    // Its own tiles only: a tile may hold another board, whose tiles aren't this board's.
    const lanes = this._lanesEl;
    return lanes ? [...lanes.children].filter((e): e is HTMLElement => e.hasAttribute("data-board-tile")) : [];
  }

  protected updated(changed: Map<string, unknown>) {
    // New items (another size, order or tile) are placed again even if no box changed size.
    if (changed.has("items")) this._layout();
    const lanes = this._lanesEl;
    const watch = [lanes, ...this._tiles].filter((e): e is HTMLElement => !!e);
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
  }

  /** Measure the lanes (from the CSS) and the tiles' heights, place them, and slide what moved. */
  private _layout() {
    // Before the next paint (a microtask, not a frame): the first painted frame is placed, and
    // it runs where frames are paused (a background tab).
    if (this.#queued) return;
    this.#queued = true;
    queueMicrotask(() => {
      this.#queued = false;
      if (!this.isConnected) return;
      const lanesEl = this._lanesEl;
      const tiles = this._tiles;
      if (!lanesEl || tiles.length !== this.items.length) return;
      // Until the observer has reported every tile (a new one is reported on the next frame,
      // before it paints), there is nothing to place yet.
      if (!this.#width || tiles.some((t) => !this.#sizes.has(t))) return;
      // The lane count from the board's width, by the same thresholds as its container queries
      // (tests/board.test.ts ties them): never read back from the grid, which a stale span would
      // have widened with an extra column.
      const lanes = lanesFor(this.#width, this.#scale);
      // Heights in whole rows (4px), each with the gap under it: placing in rows keeps tiles apart
      // exactly, with no rounding between them.
      const heights = tiles.map((t) => Math.max(1, Math.ceil((this.#sizes.get(t)! + GAP) / ROW)));
      const next = place(
        this.items.map((it, i) => ({ size: it.size, height: heights[i]! })),
        lanes,
        0,
      );
      const same =
        this._placed?.length === next.length &&
        next.every((p, i) => {
          const q = this._placed![i]!;
          return q.lane === p.lane && q.span === p.span && q.top === p.top && this._heights[i] === heights[i];
        });
      if (same) return;
      // Where each tile was and where it goes, from the placements themselves (lanes and rows), not
      // read back from the page: a tile that moves for any reason (data arriving above it, a tile
      // opening, a resize) slides there instead of jumping. A tile new to the board fades in (CSS).
      const at = (p: Placed, lanes: number, width: number) => {
        const lane = (width - GAP * (lanes - 1)) / lanes;
        return { x: p.lane * (lane + GAP), y: p.top * ROW };
      };
      const before = new Map<string, { x: number; y: number }>();
      if (this._placed && this.#placedWidth)
        this._placed.forEach((p, i) => {
          const key = this.#placedKeys[i];
          if (key !== undefined) before.set(key, at(p, this.#lanes, this.#placedWidth));
        });
      const moves = this.items.flatMap((it, i) => {
        const was = before.get(it.key);
        if (!was) return [];
        const now = at(next[i]!, lanes, this.#width);
        const dx = was.x - now.x;
        const dy = was.y - now.y;
        return Math.abs(dx) < 1 && Math.abs(dy) < 1 ? [] : [{ tile: tiles[i]!, dx, dy }];
      });
      this.#lanes = lanes;
      this.#placedWidth = this.#width;
      this.#placedKeys = this.items.map((it) => it.key);
      this._heights = heights;
      this._placed = next;
      if (moves.length) void this.updateComplete.then(() => this._slide(moves));
    });
  }

  /** Where the last placement put each tile: the width it was made at and the items' keys, in order. */
  #placedWidth = 0;
  #placedKeys: string[] = [];

  /** M3: things that move go on the spatial spring; with Reduce motion its duration is 0. */
  private _slide(moves: { tile: HTMLElement; dx: number; dy: number }[]) {
    const duration = parseFloat(motion("--duration-spatial")) || 0;
    if (!duration) return;
    const easing = motion("--ease-spatial") || "ease";
    // Logical lanes run from the start side: in right to left, the start is on the right.
    const dir = (this.closest("[dir]")?.getAttribute("dir") ?? document.dir) === "rtl" ? -1 : 1;
    for (const { tile, dx, dy } of moves)
      tile.animate([{ translate: `${dx * dir}px ${dy}px` }, { translate: "0 0" }], {
        duration,
        easing,
        composite: "add",
      });
  }

  private _style(i: number) {
    const p = this._placed?.[i];
    const h = this._heights[i];
    if (!p || h === undefined) return {};
    return { "--lane": String(p.lane + 1), "--span": String(p.span), "--row": String(p.top + 1), "--rows": String(h) };
  }

  render(): TemplateResult {
    const placed = !!this._placed && this._placed.length === this.items.length;
    return html`<div class=${boardBox()}>
      <div class=${boardLanes({ placed })} data-board-lanes>
        ${repeat(
          this.items,
          (it) => it.key,
          (it, i) =>
            html`<div
              class=${boardTile()}
              data-board-tile
              data-size=${it.size}
              style=${styleMap(placed ? this._style(i) : { "--span": "1" })}
            >
              ${it.content}
            </div>`,
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
