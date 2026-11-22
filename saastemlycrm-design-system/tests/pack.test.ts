import { describe, expect, it } from "vite-plus/test";
import { boundsOf, place, type Placed, type TileSize } from "../src/components/base/board.ts";
import {
  aligned,
  bandsOf,
  contact,
  less,
  pack,
  score,
  slides,
  type Cost,
  type PackInput,
} from "../src/components/base/pack.ts";

/**
 * The default layout (src/components/base/pack.ts):
 * - for every sequence of up to 3 widgets of 5 kinds (a header, a list, a chart, a figure, a note,
 *   each with its widget's default bounds) on boards 5, 6, 12 and 24 tiles across, the cost of what
 *   `pack` returns (`score`, the formula on the boxes themselves) is no more than the least cost of
 *   every band layout, found by listing them all (every way to cut the widgets into bands, and every
 *   way to lay out each band); before the slides it equals that least cost, or first fit's where
 *   that's less (the band step is exact),
 *   and after them no single seam slide (`slides`) lowers it;
 * - and what it returns is a layout: no two widgets share a tile, none is past the board, each is
 *   inside its bounds, and reading the board (bands down, columns across, stacks down) gives the
 *   widgets in their order;
 * - the diamond: edge neighbours weigh 1, corner neighbours ½, boxes a tile or more apart 0;
 * - straight seams: lined-up tops, bottoms, starts and ends of touching boxes.
 */

const kind = (size: TileSize, rows: number, extra: Partial<PackInput> = {}): PackInput => {
  const b = boundsOf({ size, rows, width: extra.span });
  return {
    size,
    rows,
    bounds: { minSpan: b.minSpan, maxSpan: b.maxSpan, minRows: b.minRows, maxRows: b.maxRows },
    ...extra,
  };
};
const KINDS: PackInput[] = [
  { size: "full", rows: 2, fixed: true },
  kind("l", 10),
  kind("m", 8),
  kind("s", 3, { span: 4, reflow: 4 }),
  kind("s", 2, { reflow: 2 }),
];
const LANES = [5, 6, 12, 24];

function* sequences(n: number): Generator<PackInput[]> {
  if (n === 0) return yield [];
  for (const rest of sequences(n - 1)) for (const k of KINDS) yield [...rest, k];
}

/** Every layout in `pack`'s space: each cut into bands, each band laid out every way it can be. */
function* everyLayout(tiles: PackInput[], lanes: number): Generator<Placed[]> {
  const bandOf = bandsOf(tiles, lanes);
  function* from(i: number, top: number, done: Placed[]): Generator<Placed[]> {
    if (i === tiles.length) return yield done;
    for (let j = i + 1; j <= tiles.length; j++)
      for (const band of bandOf(i, j))
        yield* from(j, top + band.height, [...done, ...band.boxes.map((b) => ({ ...b, row: b.row + top }))]);
  }
  yield* from(0, 0, []);
}

describe("the default layout", () => {
  it("costs no more than the best band layout, and no seam slide improves it, on every board", () => {
    const problems: string[] = [];
    let cases = 0;
    for (const lanes of LANES)
      for (let n = 1; n <= 3; n++)
        for (const tiles of sequences(n)) {
          cases++;
          let least: Cost | undefined;
          for (const l of everyLayout(tiles, lanes)) {
            const c = score(l, tiles, lanes);
            if (!least || less(c, least)) least = c;
          }
          const boxes = pack(tiles, lanes);
          const got = score(boxes, tiles, lanes);
          const where = `${lanes} lanes, ${tiles.map((t) => `${t.size}${t.rows}`).join(" ")}`;
          if (less(least!, got)) problems.push(`${where}: ${JSON.stringify(got)} vs least ${JSON.stringify(least)}`);
          // The band step alone is exact: the least of them all, or first fit where that's less.
          const first = score(
            place(
              tiles.map((t) => (t.fixed ? { size: "full" as const, rows: t.rows, reflow: t.reflow } : t)),
              lanes,
            ),
            tiles,
            lanes,
          );
          const want = less(first, least!) ? first : least!;
          const banded = score(pack(tiles, lanes, false), tiles, lanes);
          if (less(want, banded) || less(banded, want)) problems.push(`${where}: bands ${JSON.stringify(banded)}`);
          for (const next of slides(boxes, tiles, lanes))
            if (less(score(next, tiles, lanes), got)) problems.push(`${where}: a slide improves it`);
        }
    expect(cases).toBe(LANES.length * (5 + 25 + 125));
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("is a layout: no overlap, on the board, inside the bounds, in order", () => {
    const problems: string[] = [];
    for (const lanes of LANES)
      for (let n = 1; n <= 4; n++)
        for (const tiles of sequences(n)) {
          const got = pack(tiles, lanes);
          const where = `${lanes} lanes, ${tiles.map((t) => `${t.size}${t.rows}`).join(" ")}`;
          const taken = new Set<string>();
          got.forEach((p, i) => {
            const t = tiles[i]!;
            if (p.lane < 0 || p.lane + p.span > lanes || p.row < 0) problems.push(`${where}: #${i} off the board`);
            if (t.fixed && p.span !== lanes) problems.push(`${where}: #${i} fixed, not the board's width`);
            const lo = Math.min(lanes, t.bounds?.minSpan ?? lanes);
            const hi = Math.min(lanes, t.bounds?.maxSpan ?? lanes);
            const own = Math.min(lanes, t.span ?? { s: 6, m: 12, l: 18, full: lanes }[t.size]);
            if (!t.fixed && (p.span < Math.min(lo, own) || p.span > Math.max(hi, own)))
              problems.push(`${where}: #${i} ${p.span} wide`);
            for (let r = p.row; r < p.row + p.rows; r++)
              for (let c = p.lane; c < p.lane + p.span; c++) {
                if (taken.has(`${r}:${c}`)) problems.push(`${where}: overlap at ${r}:${c}`);
                taken.add(`${r}:${c}`);
              }
            // In order: each starts no earlier in reading order (row, then lane) than its band's
            // order allows: never above the one before it unless beside it (a later column).
            const prev = got[i - 1];
            if (prev && p.row < prev.row && p.lane < prev.lane + prev.span)
              problems.push(`${where}: #${i} before #${i - 1}`);
          });
        }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("weighs neighbours by a diamond: an edge 1, a corner ½, apart 0", () => {
    const a = { lane: 0, row: 0, span: 2, rows: 2 };
    expect(contact(a, { lane: 2, row: 0, span: 2, rows: 2 })).toBe(1);
    expect(contact(a, { lane: 0, row: 2, span: 2, rows: 2 })).toBe(1);
    expect(contact(a, { lane: 2, row: 2, span: 2, rows: 2 })).toBe(0.5);
    expect(contact(a, { lane: 3, row: 0, span: 2, rows: 2 })).toBe(0);
    expect(contact(a, { lane: 0, row: 3, span: 2, rows: 2 })).toBe(0);
  });

  it("counts lined-up edges of neighbours", () => {
    const a = { lane: 0, row: 1, span: 2, rows: 2 };
    // Side by side, tops and bottoms level.
    expect(aligned(a, { lane: 2, row: 1, span: 2, rows: 2 })).toBe(2);
    // Offset like bricks: nothing lines up.
    expect(aligned(a, { lane: 2, row: 2, span: 2, rows: 2 })).toBe(0);
    // One over the other, the same lanes; then narrower, sharing only the start.
    expect(aligned(a, { lane: 0, row: 3, span: 2, rows: 2 })).toBe(2);
    expect(aligned(a, { lane: 0, row: 3, span: 1, rows: 2 })).toBe(1);
    // A corner: both lines cross there.
    expect(aligned(a, { lane: 2, row: 3, span: 2, rows: 2 })).toBe(2);
  });
});
