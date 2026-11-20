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
export const boardTile = rcva(layout.tile);

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

  #resize = new ResizeObserver(() => this._layout());
  #observed = new Set<Element>();
  #frame = 0;

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#observed.clear();
    cancelAnimationFrame(this.#frame);
  }

  private get _lanesEl() {
    return this.querySelector<HTMLElement>("[data-board-lanes]");
  }
  private get _tiles() {
    return [...this.querySelectorAll<HTMLElement>(":scope [data-board-tile]")];
  }

  protected updated() {
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
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      const lanesEl = this._lanesEl;
      const tiles = this._tiles;
      if (!lanesEl || tiles.length !== this.items.length) return;
      // The lane count from the board's width, by the same thresholds as its container queries
      // (tests/board.test.ts ties them): never read back from the grid, which a stale span would
      // have widened with an extra column.
      const box = lanesEl.parentElement ?? lanesEl;
      const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;
      const lanes = lanesFor(box.clientWidth, scale);
      // Heights in whole rows (4px), each with the gap under it: placing in rows keeps tiles apart
      // exactly, with no rounding between them.
      const heights = tiles.map((t) => Math.max(1, Math.ceil((t.offsetHeight + GAP) / ROW)));
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
      const before = this._placed ? tiles.map((t) => t.getBoundingClientRect()) : null;
      this._heights = heights;
      this._placed = next;
      if (before) void this.updateComplete.then(() => this._slide(tiles, before));
    });
  }

  /** M3: things that move go on the spatial spring; with Reduce motion its duration is 0. */
  private _slide(tiles: HTMLElement[], before: DOMRect[]) {
    const css = getComputedStyle(document.documentElement);
    const duration = parseFloat(css.getPropertyValue("--duration-spatial")) || 0;
    const easing = css.getPropertyValue("--ease-spatial").trim() || "ease";
    if (!duration) return;
    tiles.forEach((t, i) => {
      const a = before[i];
      const b = t.getBoundingClientRect();
      if (!a) return;
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      t.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0 0" }], { duration, easing });
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
