import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  LANE,
  MAX_LANES,
  TILE_SIZES,
  laneThreshold,
  lanesFor,
  place,
  spanOf,
  type TileSize,
} from "../src/components/base/board.ts";
import { board } from "../src/components/primitives/layout/algebra.ts";

/**
 * The board (src/components/base/board.ts), proved over finite domains, every case:
 * - its lanes, for every board width from the smallest page (226px: a 258px main panel less its
 *   16px page padding a side) to 3840px, at text sizes 1×, 1.5× and 2×: one lane at the smallest
 *   page, and with two or more, each lane at least 18rem; the CSS thresholds are the same numbers;
 * - its placement, for every sequence of up to 5 tiles of every size and of heights 1 to 3 rows,
 *   on boards of 1 to 4 lanes: tiles stay inside the board, never overlap, take at least the lanes
 *   their size gives and sit where the rule says (the lowest run, the first on a tie), widen only
 *   into lanes free beside them that the next tile couldn't use, and leave none of those empty.
 */

const GAP = 16;

describe("the board's lanes", () => {
  it("are the CSS's: each count from its container query", () => {
    for (let n = 2; n <= MAX_LANES; n++)
      expect(board.lanes).toContain(`@min-[${laneThreshold(n)}rem]/board:grid-cols-${n}`);
    const css = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/primitives/layout/algebra.ts"),
      "utf8",
    );
    expect(css).toContain("@container/board w-full");
  });

  it("give each lane 18rem once there are two, at every width and text size", () => {
    const problems: string[] = [];
    for (const scale of [1, 1.5, 2])
      for (let w = 226; w <= 3840; w++) {
        const n = lanesFor(w, scale);
        if (n < 1 || n > MAX_LANES) problems.push(`${w}px ×${scale}: ${n} lanes`);
        const lane = (w - (n - 1) * GAP) / n;
        if (n > 1 && lane < LANE * 16 * scale) problems.push(`${w}px ×${scale}: lanes of ${lane.toFixed(1)}px`);
        if (n < MAX_LANES && w >= laneThreshold(n + 1) * 16 * scale)
          problems.push(`${w}px ×${scale}: room for ${n + 1}`);
      }
    expect(problems.slice(0, 5)).toEqual([]);
    expect(lanesFor(226)).toBe(1);
  });
});

describe("the board's placement", () => {
  /** Every sequence of `len` items from `alphabet`. */
  function* sequences<T>(alphabet: readonly T[], len: number): Generator<T[]> {
    if (len === 0) return yield [];
    for (const head of sequences(alphabet, len - 1)) for (const x of alphabet) yield [...head, x];
  }
  const tiles = TILE_SIZES.flatMap((size) => [1, 2, 3].map((height) => ({ size, height })));

  it("keeps every tile inside the board, apart, where the rule puts it, and no lane empty beside it", () => {
    const problems: string[] = [];
    let cases = 0;
    for (let lanes = 1; lanes <= MAX_LANES; lanes++)
      for (let len = 1; len <= 5; len++)
        for (const seq of sequences(tiles, len)) {
          cases++;
          const placed = place(seq, lanes, 0);
          const base = seq.map((x) => spanOf(x.size as TileSize, lanes));
          const bottom = Array.from({ length: lanes }, () => 0);
          placed.forEach((p, i) => {
            const t = seq[i]!;
            const b = base[i]!;
            const at = `${lanes} lanes, ${seq.map((x) => `${x.size}${x.height}`).join(" ")}, tile ${i}`;
            if (p.span < b || p.lane < 0 || p.lane + p.span > lanes)
              problems.push(`${at}: lane ${p.lane} span ${p.span}`);
            // Its size's lanes: the lowest run, the first on a tie, inside where it sits.
            const tops = Array.from({ length: lanes - b + 1 }, (_, s) => Math.max(...bottom.slice(s, s + b)));
            const best = Math.min(...tops);
            const first = tops.indexOf(best);
            if (p.top !== best || first < p.lane || first + b > p.lane + p.span)
              problems.push(`${at}: not where the rule puts it`);
            // Wider than its size only into lanes free at its top, and only when the next tile
            // couldn't have used them.
            const next = base[i + 1];
            if (p.span > b && next !== undefined && next <= p.span - b)
              problems.push(`${at}: took lanes the next tile fits`);
            for (let k = p.lane; k < p.lane + p.span; k++) if (bottom[k]! > p.top) problems.push(`${at}: overlaps`);
            // No lane left free beside it that the next tile couldn't use.
            let from = p.lane;
            let to = p.lane + p.span;
            while (from > 0 && bottom[from - 1]! <= p.top) from--;
            while (to < lanes && bottom[to]! <= p.top) to++;
            const free = to - from - p.span;
            if (free > 0 && (next === undefined || next > free))
              problems.push(`${at}: left ${free} lanes empty beside it`);
            for (let k = p.lane; k < p.lane + p.span; k++) bottom[k] = p.top + t.height;
          });
        }
    expect(cases).toBeGreaterThan(1_000_000);
    expect(problems.slice(0, 5)).toEqual([]);
  }, 30_000);

  it("widens as the rule says", () => {
    const spans = (sizes: TileSize[], heights: number[], lanes: number) =>
      place(
        sizes.map((size, i) => ({ size, height: heights[i]! })),
        lanes,
        0,
      ).map((p) => p.span);
    // All `m` on 3 lanes: whole rows (the next `m` can't use the lane left).
    expect(spans(["m", "m", "m", "m"], [1, 1, 1, 1], 3)).toEqual([3, 3, 3, 3]);
    // An `s` before an `l` takes the row; an `s` beside an `m` (a list and its reading pane) stays.
    expect(spans(["s", "l"], [1, 1], 3)).toEqual([3, 3]);
    expect(spans(["s", "m"], [1, 1], 3)).toEqual([1, 2]);
    // A short `m` beside a tall `s`: the next `m` fills the hole under the first, not a whole row.
    expect(spans(["m", "s", "m", "full"], [1, 3, 1, 1], 3)).toEqual([2, 1, 2, 3]);
    // One lane: everything is one lane.
    expect(spans(["s", "m", "l"], [1, 1, 1], 1)).toEqual([1, 1, 1]);
  });

  it("is one column in order on one lane", () => {
    const placed = place(
      ["s", "full", "m", "l"].map((size, i) => ({ size: size as TileSize, height: i + 1 })),
      1,
      0,
    );
    expect(placed.map((p) => [p.lane, p.top])).toEqual([
      [0, 0],
      [0, 1],
      [0, 3],
      [0, 6],
    ]);
  });
});

describe("the board's measuring", () => {
  /**
   * `<ui-board>` measures its tiles, places them, measures again (a tile that widened is shorter
   * now) and places again. Proved here, for every sequence of up to 5 tiles of every size, on 1 to
   * 4 lanes, with every base height 1 to 3 rows per tile and heights that shrink as a tile widens
   * (h = ⌈base × k / span⌉, k = 1, 2, 3): the passes reach a fixpoint (two equal placements in a
   * row) within n + 1 passes for n tiles, and the same one whether the first heights were measured
   * at each tile's own span, at one lane or at the whole board. Why: `place` decides tile i from
   * the tiles before it only, so after pass i + 1 tile i never moves again.
   *
   * A size reaches `place` only through `spanOf` (its span on that board), so sizes with the same
   * span on a board (`m`, `l` and `full` on 2 lanes) give the same placements: each board runs one
   * size per span, and every sequence of sizes is one of those.
   */
  function* sequences<T>(alphabet: readonly T[], len: number): Generator<T[]> {
    if (len === 0) return yield [];
    for (const head of sequences(alphabet, len - 1)) for (const x of alphabet) yield [...head, x];
  }
  type Tile = { size: TileSize; base: number };
  const same = (a: { lane: number; span: number; top: number }[], b: typeof a) =>
    a.every((p, i) => p.lane === b[i]!.lane && p.span === b[i]!.span && p.top === b[i]!.top);

  /** The passes from `heights`: the placement they settle on and how many passes that took. */
  function settle(seq: Tile[], lanes: number, height: (t: Tile, span: number) => number, heights: number[]) {
    let placed = place(
      seq.map((t, i) => ({ size: t.size, height: heights[i]! })),
      lanes,
      0,
    );
    for (let pass = 2; pass <= seq.length + 2; pass++) {
      const next = place(
        seq.map((t, i) => ({ size: t.size, height: height(t, placed[i]!.span) })),
        lanes,
        0,
      );
      if (same(placed, next)) return { placed, passes: pass - 1 };
      placed = next;
    }
    return { placed, passes: Infinity };
  }

  it("settles within n + 1 passes, on the same placement from any first heights", () => {
    const problems: string[] = [];
    let cases = 0;
    let most = 0;
    for (let lanes = 1; lanes <= MAX_LANES; lanes++) {
      const sizes = TILE_SIZES.filter(
        (s, i) => TILE_SIZES.findIndex((x) => spanOf(x, lanes) === spanOf(s, lanes)) === i,
      );
      const covers = (seq: Tile[]) =>
        seq.reduce((n, t) => n * TILE_SIZES.filter((x) => spanOf(x, lanes) === spanOf(t.size, lanes)).length, 1);
      const alphabet = sizes.flatMap((size) => [1, 2, 3].map((base) => ({ size, base })));
      for (const k of [1, 2, 3]) {
        const height = (t: Tile, span: number) => Math.ceil((t.base * k) / span);
        for (let len = 1; len <= 5; len++)
          for (const seq of sequences(alphabet, len)) {
            cases += covers(seq);
            const at = () => `${lanes} lanes, k ${k}, ${seq.map((t) => `${t.size}${t.base}`).join(" ")}`;
            const own = settle(
              seq,
              lanes,
              height,
              seq.map((t) => height(t, spanOf(t.size, lanes))),
            );
            most = Math.max(most, own.passes);
            if (own.passes > len + 1) problems.push(`${at()}: ${own.passes} passes`);
            for (const span of [1, lanes]) {
              const other = settle(
                seq,
                lanes,
                height,
                seq.map((t) => height(t, span)),
              );
              if (other.passes > len + 1) problems.push(`${at()}, first at span ${span}: ${other.passes} passes`);
              if (!same(own.placed, other.placed)) problems.push(`${at()}, first at span ${span}: another fixpoint`);
            }
          }
      }
    }
    // Every sequence of up to 5 sizes × base heights, on 1–4 lanes, for each k.
    expect(cases).toBe(3 * MAX_LANES * [1, 2, 3, 4, 5].reduce((n, len) => n + 12 ** len, 0));
    expect(problems.slice(0, 5)).toEqual([]);
    // The slowest settles on its 4th placement (confirmed by the 5th), inside n + 1 = 6.
    expect(most).toBeLessThanOrEqual(4);
  }, 30_000);
});
