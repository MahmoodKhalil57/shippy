import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  boundsOf,
  keepOrder,
  lanesFor,
  LAYOUT_STEP,
  layoutLanes,
  place,
  resizeTo,
  rowsAt,
  rowsFor,
  rowsHeight,
  scaleArranged,
  spanOf,
  stretch,
  TILE_SIZES,
  type TileSize,
} from "../src/components/base/board.ts";
import { tileH, tileW } from "../src/components/base/tiles.ts";
import { board } from "../src/components/primitives/layout/algebra.ts";

/**
 * The board (src/components/base/board.ts), proved over finite domains, every case:
 * - its tiles across: for every main panel of 1 to 72 of the screen's tiles, at text sizes 1×, 1.25×
 *   and 1.5×, less its border and scrollbar and the page's 4px inset, the board counts exactly that
 *   many tiles; a widget never takes more than there are;
 * - its placement, for every sequence of up to 5 widgets 1 to 3 tiles wide and 1 to 3 high (some
 *   allowed to stretch wider or taller), on boards of 1 to 4 tiles across: each at the first place
 *   in reading order, at or after the one before it, where its target fits among the earlier ones
 *   (no earlier place fits), inside the board, none overlapping; each exactly its target width and
 *   height (or `rowsAt`'s, clamped to a narrower board), stretched only within the bounds it declares
 *   and never lower than its neighbours reach; and no later widget moving an earlier one. What a
 *   widget holds never goes in;
 * - its heights: a widget of n tiles is n × 56px, and "Show all" asks for the fewest tiles that hold
 *   its content.
 */
const MAX_LANES = 4;

describe("the board's tiles across", () => {
  it("counts the main panel's tiles, and never gives a widget more", () => {
    const problems: string[] = [];
    for (const scale of [1, 1.25, 1.5])
      for (let k = 1; k <= 72; k++) {
        // As the browser lays it out: each tile snapped to 1/64px below its width.
        const width = k * (tileW(scale) - 1 / 64);
        if (lanesFor(width, scale) !== Math.max(1, k)) problems.push(`${k} tiles ×${scale}: ${lanesFor(width, scale)}`);
        for (const size of ["s", "m", "l", "full"] as const) if (spanOf(size, k) > k) problems.push(`${size} on ${k}`);
      }
    expect(problems.slice(0, 5)).toEqual([]);
    expect(spanOf("s", 22)).toBe(6);
    expect(spanOf("full", 22)).toBe(22);
    expect(spanOf("m", 5)).toBe(5);
  });

  it("is the CSS's: columns of one tile each, rows a tile high, no gaps", () => {
    const css = readFileSync(
      path.resolve(import.meta.dirname, "../src/components/primitives/layout/algebra.ts"),
      "utf8",
    );
    expect(css).toContain("@container/board w-full");
    // Quarter tracks, like the frame's: a tile spans four each way (the board sets the spans).
    expect(board.lanes).toContain("repeat(var(--board-quarters,4),calc(var(--tile-w)/4))");
    expect(board.lanes).toContain("auto-rows-[calc(var(--tile-h)/4)]");
    expect(board.lanes).toContain("gap-0");
    expect(board.tile).toContain("[grid-column:var(--lane)/span_var(--span)]");
    expect(board.tile).toContain("[grid-row:var(--row)/span_var(--rows)]");
    expect(board.inset).toBe("p-1");
  });
});

describe("the default layout across a band", () => {
  // Every board width from 1 to 29 tiles: laid out at its band, no wider than itself and within a
  // band of it; and every layout width of a band stretched to every width in that band, over every
  // pair of tile spans [a, b) and [c, d) inside it (0 ≤ a < b ≤ from, likewise c, d): a tile keeps
  // at least a tile per tile, stays inside the board, the board's start and end stay its edges, and
  // two spans that touch, overlap or are apart still do, in the same order.
  it("is laid out at its band", () => {
    for (let lanes = 1; lanes <= 29; lanes++) {
      const at = layoutLanes(lanes);
      expect(at).toBeLessThanOrEqual(lanes);
      if (lanes < LAYOUT_STEP) expect(at).toBe(lanes);
      else {
        expect(at % LAYOUT_STEP).toBe(0);
        expect(lanes - at).toBeLessThan(LAYOUT_STEP);
      }
    }
  });
  it("keeps every tile's size, order and contacts when stretched", () => {
    const rel = (a: number, b: number, c: number, d: number) =>
      b < c ? "before" : b === c ? "touches" : d < a ? "after" : d === a ? "touched" : "overlaps";
    for (let from = LAYOUT_STEP; from <= 24; from += LAYOUT_STEP)
      for (let to = from; to < from + LAYOUT_STEP; to++) {
        const spans: [number, number][] = [];
        for (let a = 0; a < from; a++) for (let b = a + 1; b <= from; b++) spans.push([a, b]);
        const out = new Map(
          spans.map(([a, b]) => {
            const [p] = stretch([{ lane: a, span: b - a, row: 0, rows: 1 }], from, to);
            return [`${a},${b}`, [p!.lane, p!.lane + p!.span] as const];
          }),
        );
        for (const [a, b] of spans) {
          const [x, y] = out.get(`${a},${b}`)!;
          expect(y - x).toBeGreaterThanOrEqual(b - a);
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(to);
          if (a === 0) expect(x).toBe(0);
          if (b === from) expect(y).toBe(to);
          for (const [c, d] of spans) {
            const [u, v] = out.get(`${c},${d}`)!;
            expect(rel(x, y, u, v)).toBe(rel(a, b, c, d));
          }
        }
      }
  }, 60_000);
});

describe("a hand arrangement on a board of another width", () => {
  // Every arrangement width 1 to 24 and board width 1 to 30, every tile [a, a + w) inside it: on a
  // wider board it's `stretch` exactly; on one at least half as wide it stays inside the board, at
  // least a tile wide, its start in the same order as every other tile's (monotone), and a tile
  // apart from another (b ≤ c) stays apart whenever both keep a tile of their own; below half, only
  // its width, clamped to the board, is kept (no lane: the arrangement's order places it).
  it("scales places and widths", () => {
    const bad: string[] = [];
    for (let from = 1; from <= 24; from++)
      for (let to = 1; to <= 30; to++) {
        const tiles: [number, number][] = [];
        for (let a = 0; a < from; a++) for (let w = 1; a + w <= from; w++) tiles.push([a, w]);
        const out = tiles.map(([a, w]) => scaleArranged(a, w, from, to));
        const own = (x: number, y: number) => Math.round(((x + y) * to) / from) > Math.round((x * to) / from);
        tiles.forEach(([a, w], i) => {
          const s = out[i]!;
          const at = `${from}→${to} [${a}, ${a + w})`;
          if (to * 2 < from) {
            if ("at" in s || s.span !== Math.min(w, to)) bad.push(`${at}: list`);
            return;
          }
          if (!("at" in s)) return void bad.push(`${at}: no lane`);
          if (s.at < 0 || s.span < 1 || s.at + s.span > to) bad.push(`${at}: outside`);
          if (to >= from) {
            const [p] = stretch([{ lane: a, span: w, row: 0, rows: 1 }], from, to);
            if (s.at !== p!.lane || s.span !== p!.span) bad.push(`${at}: not stretch`);
          }
          tiles.forEach(([c, v], j) => {
            const t = out[j]!;
            if (!("at" in t)) return;
            if (a <= c && s.at > t.at) bad.push(`${at}: order`);
            if (a + w <= c && own(a, w) && own(c, v) && s.at + s.span > t.at) bad.push(`${at}: overlap`);
          });
        });
      }
    expect(bad.slice(0, 5)).toEqual([]);
  }, 60_000);
});

describe("the board's placement", () => {
  /** Every sequence of `len` items from `alphabet`. */
  function* sequences<T>(alphabet: readonly T[], len: number): Generator<T[]> {
    if (len === 0) return yield [];
    for (const head of sequences(alphabet, len - 1)) for (const x of alphabet) yield [...head, x];
  }
  // Two-tile-high widgets wrap (they grow up to 4× when narrowed); two-wide ones may stretch to 3
  // across; one-high ones may stretch to 3 down. The rest are strict.
  const tiles = [1, 2, 3].flatMap((span) =>
    [1, 2, 3].map((rows) => ({
      size: "s" as const,
      span,
      rows,
      reflow: rows === 2 ? 4 : 1,
      maxSpan: span === 2 ? 3 : undefined,
      maxRows: rows === 1 ? 3 : undefined,
    })),
  );

  it("puts every widget at the first free place after the one before it, its target size, stretched only within its bounds, none overlapping", () => {
    const problems: string[] = [];
    let cases = 0;
    const before = (a: { row: number; lane: number }, b: { row: number; lane: number }) =>
      a.row < b.row || (a.row === b.row && a.lane < b.lane);
    for (let lanes = 1; lanes <= MAX_LANES; lanes++)
      for (let len = 1; len <= 5; len++)
        for (const seq of sequences(tiles, len)) {
          cases++;
          const got = place(seq, lanes);
          const at = `${lanes} lanes, ${seq.map((t) => `${t.span}x${t.rows}`).join(" ")}`;
          // The tiles each earlier widget took at its target size (what a later one was placed among).
          const targets: { row: number; lane: number; span: number; rows: number }[] = [];
          const clear = (row: number, lane: number, span: number, rows: number) =>
            targets.every(
              (q) => q.row >= row + rows || q.row + q.rows <= row || q.lane >= lane + span || q.lane + q.span <= lane,
            );
          got.forEach((p, i) => {
            const t = seq[i]!;
            const want = Math.min(t.span, lanes);
            const rows = rowsAt(t.rows, t.span, want, t.reflow);
            if (p.lane < 0 || p.lane + p.span > lanes) problems.push(`${at} #${i}: past the board`);
            // Its target width and height, or more only up to its bounds.
            if (p.span < want || p.span > Math.max(want, Math.min(lanes, t.maxSpan ?? 0)))
              problems.push(`${at} #${i}: span ${p.span}`);
            if (p.rows < rows || p.rows > Math.max(rows, t.maxRows ?? 0)) problems.push(`${at} #${i}: rows ${p.rows}`);
            // Never before the one ahead of it in the order.
            const prev = i > 0 ? got[i - 1]! : { row: 0, lane: 0 };
            if (before(p, prev)) problems.push(`${at} #${i}: before #${i - 1}`);
            // The first place from there where its target fits among the earlier widgets' targets.
            if (!clear(p.row, p.lane, want, rows)) problems.push(`${at} #${i}: on an earlier widget`);
            for (let r = prev.row; r <= p.row; r++)
              for (let c = r === prev.row ? prev.lane : 0; c + want <= lanes; c++) {
                if (!before({ row: r, lane: c }, p)) break;
                if (clear(r, c, want, rows)) problems.push(`${at} #${i}: fits earlier, at ${r}:${c}`);
              }
            targets.push({ row: p.row, lane: p.lane, span: want, rows });
          });
          // No two widgets share a tile.
          const taken = new Set<string>();
          for (const p of got)
            for (let r = p.row; r < p.row + p.rows; r++)
              for (let c = p.lane; c < p.lane + p.span; c++) {
                if (taken.has(`${r}:${c}`)) problems.push(`${at}: overlap at ${r}:${c}`);
                taken.add(`${r}:${c}`);
              }
          // A taller widget grows no lower than the widgets beside it reach.
          got.forEach((p, i) => {
            const rows = rowsAt(seq[i]!.rows, seq[i]!.span, Math.min(seq[i]!.span, lanes), seq[i]!.reflow);
            if (p.rows === rows) return;
            const reach = Math.max(
              ...got
                .filter((q, k) => k !== i && q.row < p.row + rows && q.row + q.rows > p.row)
                .map((q) => q.row + q.rows),
            );
            if (p.row + p.rows > reach) problems.push(`${at} #${i}: grew past its neighbours`);
          });
          // A later widget never moves an earlier one.
          const earlier = place(seq.slice(0, -1), lanes);
          if (earlier.some((p, i) => p.row !== got[i]!.row || p.lane !== got[i]!.lane))
            problems.push(`${at}: a later widget moved an earlier one`);
        }
    expect(cases).toBe(MAX_LANES * [1, 2, 3, 4, 5].reduce((n, len) => n + 9 ** len, 0));
    expect(problems.slice(0, 5)).toEqual([]);
  }, 60_000);

  it("puts a widget placed by hand at exactly its lane, at the first free row after the one before it", () => {
    // Every sequence of up to 4 widgets 1 or 2 wide, 1 or 2 high, each unplaced or placed at lane 0, 1
    // or 2, on boards of 1 to 4 lanes.
    const kinds = [1, 2].flatMap((span) =>
      [1, 2].flatMap((rows) => [undefined, 0, 1, 2].map((at) => ({ size: "s" as const, span, rows, at }))),
    );
    const problems: string[] = [];
    let cases = 0;
    const before = (a: { row: number; lane: number }, b: { row: number; lane: number }) =>
      a.row < b.row || (a.row === b.row && a.lane < b.lane);
    for (let lanes = 1; lanes <= MAX_LANES; lanes++)
      for (let len = 1; len <= 4; len++)
        for (const seq of sequences(kinds, len)) {
          cases++;
          const got = place(seq, lanes);
          const at = `${lanes} lanes, ${seq.map((t) => `${t.span}x${t.rows}@${t.at ?? "-"}`).join(" ")}`;
          const targets: { row: number; lane: number; span: number; rows: number }[] = [];
          const clear = (row: number, lane: number, span: number, rows: number) =>
            targets.every(
              (q) => q.row >= row + rows || q.row + q.rows <= row || q.lane >= lane + span || q.lane + q.span <= lane,
            );
          got.forEach((p, i) => {
            const t = seq[i]!;
            const want = Math.min(t.span, lanes);
            const prev = i > 0 ? got[i - 1]! : { row: 0, lane: 0 };
            if (p.lane < 0 || p.lane + p.span > lanes) problems.push(`${at} #${i}: past the board`);
            if (before(p, prev)) problems.push(`${at} #${i}: before #${i - 1}`);
            if (!clear(p.row, p.lane, want, t.rows)) problems.push(`${at} #${i}: on an earlier widget`);
            if (t.at !== undefined) {
              const pin = Math.max(0, Math.min(lanes - want, t.at));
              if (p.lane !== pin) problems.push(`${at} #${i}: lane ${p.lane}, not ${pin}`);
              // The first row from the one before it where its lane is free.
              for (let r = prev.row; r < p.row; r++)
                if (!before({ row: r, lane: pin }, prev) && clear(r, pin, want, t.rows))
                  problems.push(`${at} #${i}: fits earlier, at ${r}`);
            }
            targets.push({ row: p.row, lane: p.lane, span: want, rows: t.rows });
          });
          const earlier = place(seq.slice(0, -1), lanes);
          if (earlier.some((p, i) => p.row !== got[i]!.row || p.lane !== got[i]!.lane))
            problems.push(`${at}: a later widget moved an earlier one`);
        }
    expect(cases).toBe(MAX_LANES * [1, 2, 3, 4].reduce((n, len) => n + 16 ** len, 0));
    expect(problems.slice(0, 5)).toEqual([]);
  }, 60_000);

  it("keeps a widget put somewhere by hand there, never floats one up, and takes out only rows no tile is in", () => {
    // Every sequence of up to 3 widgets 1 or 2 wide, 1 or 2 high, each flowing or put at lane 0 or
    // 1 and row 0, 1 or 3, on boards of 1 to 4 lanes.
    const spots = [undefined, ...[0, 1].flatMap((lane) => [0, 1, 3].map((row) => ({ lane, row })))];
    const kinds = [1, 2].flatMap((span) =>
      [1, 2].flatMap((rows) => spots.map((s) => ({ size: "s" as const, span, rows, at: s?.lane, atRow: s?.row }))),
    );
    const problems: string[] = [];
    let cases = 0;
    for (let lanes = 1; lanes <= MAX_LANES; lanes++)
      for (let len = 1; len <= 3; len++)
        for (const seq of sequences(kinds, len)) {
          cases++;
          const got = place(seq, lanes);
          const at = `${lanes} lanes, ${seq.map((t) => `${t.span}x${t.rows}@${t.at ?? "-"},${t.atRow ?? "-"}`).join(" ")}`;
          // No two widgets share a tile, and none is past the board.
          const taken = new Set<string>();
          for (const p of got) {
            if (p.lane < 0 || p.lane + p.span > lanes) problems.push(`${at}: past the board`);
            for (let r = p.row; r < p.row + p.rows; r++)
              for (let c = p.lane; c < p.lane + p.span; c++) {
                if (taken.has(`${r}:${c}`)) problems.push(`${at}: overlap at ${r}:${c}`);
                taken.add(`${r}:${c}`);
              }
          }
          // Every row from the top to the last is some widget's (empty rows were taken out).
          const bottom = Math.max(...got.map((p) => p.row + p.rows));
          for (let r = 0; r < bottom; r++)
            if (!got.some((p) => p.row <= r && r < p.row + p.rows)) problems.push(`${at}: row ${r} is empty`);
          seq.forEach((t, i) => {
            const p = got[i]!;
            if (t.at === undefined) return;
            // Its lane, exactly (clamped to the board).
            const want = Math.max(0, Math.min(lanes - Math.min(t.span, lanes), t.at));
            if (p.lane !== want) problems.push(`${at} #${i}: lane ${p.lane}, not ${want}`);
          });
          // Two widgets put by hand, apart and in order down the board, keep that order and their
          // gap in rows minus only rows no widget is in.
          const put = seq.map((t, i) => ({ t, p: got[i]! })).filter(({ t }) => t.atRow !== undefined);
          if (put.length === seq.length && put.length === 2) {
            const [a, b] = put;
            const apart = a!.t.atRow! + a!.t.rows <= b!.t.atRow!;
            if (apart && a!.p.row > b!.p.row) problems.push(`${at}: the lower one went above the higher one`);
          }
        }
    expect(cases).toBe(MAX_LANES * [1, 2, 3].reduce((n, len) => n + 28 ** len, 0));
    expect(problems.slice(0, 5)).toEqual([]);
  }, 60_000);

  it("fills the column beside a tall widget with the small ones after it", () => {
    // A 12-tile message 10 high on 18 tiles, then three 6-tile cards 2 high: one under another beside it.
    const got = place(
      [
        { size: "m", rows: 10 },
        { size: "s", rows: 2 },
        { size: "s", rows: 2 },
        { size: "s", rows: 2 },
        { size: "full", rows: 2 },
      ],
      18,
    );
    expect(got.map((p) => [p.lane, p.row])).toEqual([
      [0, 0],
      [12, 0],
      [12, 2],
      [12, 4],
      [0, 10],
    ]);
  });

  it("leaves a strict widget's spare tiles empty rather than stretch it", () => {
    // A 12-tile and a 6-tile widget on 22 tiles: both keep their sizes; 4 tiles across stay empty.
    const [a, b] = place(
      [
        { size: "m", rows: 8 },
        { size: "s", rows: 10 },
      ],
      22,
    );
    expect([a!.span, b!.span, a!.rows, b!.rows]).toEqual([12, 6, 8, 10]);
  });

  it("makes a widget of n tiles n × 56px tall, and asks for the fewest tiles that hold content", () => {
    for (let n = 1; n <= 12; n++) {
      expect(rowsHeight(n)).toBe(n * tileH());
      // Exactly n rows' height needs n rows; a pixel more needs n + 1 (up to the most).
      expect(rowsFor(rowsHeight(n))).toBe(n);
      if (n < 12) expect(rowsFor(rowsHeight(n) + 1)).toBe(n + 1);
    }
  });
});

describe("arranging by hand", async () => {
  const { resizeTo, moveTo, boundsOf } = await import("../src/components/base/board.ts");
  it("resizes within the widget's bounds and the board's lanes, every case", () => {
    let cases = 0;
    for (const lanes of [5, 6, 12, 18, 24, 30])
      for (const [minWidth, maxWidth] of [
        [undefined, undefined],
        [4, 8],
        [6, 30],
        [10, 12],
      ] as const)
        for (const rows of [2, 6, 12])
          for (const span of [-3, 0, 1, 4, 7, 12, 40])
            for (const want of [-1, 0, 1, 3, 8, 30, 300]) {
              cases++;
              const b = boundsOf({ size: "m", rows, minWidth, maxWidth });
              const r = resizeTo(b, lanes, span, want);
              const most = Math.min(lanes, b.maxSpan ?? lanes);
              expect(r.span).toBeGreaterThanOrEqual(1);
              expect(r.span).toBeLessThanOrEqual(most);
              if (most >= (b.minSpan ?? 1)) expect(r.span).toBeGreaterThanOrEqual(b.minSpan ?? 1);
              expect(r.rows).toBeGreaterThanOrEqual(b.minRows);
              expect(r.rows).toBeLessThanOrEqual(b.maxRows);
              // Inside the bounds, it's what was asked.
              if (span >= Math.max(1, b.minSpan ?? 1) && span <= most) expect(r.span).toBe(span);
              if (want >= b.minRows && want <= b.maxRows) expect(r.rows).toBe(want);
            }
    expect(cases).toBeGreaterThan(1000);
  });

  it("moves a tile next to the one it's dropped on, keeping every other tile's order", () => {
    const order = ["a", "b", "c", "d", "e"];
    for (const key of [...order, "x"])
      for (const over of [...order, "y"])
        for (const after of [false, true]) {
          const out = moveTo(order, key, over, after);
          expect([...out].sort()).toEqual([...order].sort());
          if (key === over || !order.includes(key) || !order.includes(over)) {
            expect(out).toEqual(order);
            continue;
          }
          expect(out.indexOf(key)).toBe(out.indexOf(over) + (after ? 1 : -1));
          expect(out.filter((k) => k !== key)).toEqual(order.filter((k) => k !== key));
        }
  });
});

describe("the board's document order", () => {
  /** Every ordering of every subset of `xs`. */
  function* arrangements<T>(xs: readonly T[]): Generator<T[]> {
    yield [];
    for (let i = 0; i < xs.length; i++)
      for (const rest of arrangements([...xs.slice(0, i), ...xs.slice(i + 1)])) yield [xs[i]!, ...rest];
  }
  it("never moves a tile that stays, whatever the new order, and adds new tiles at the end", () => {
    // Every order of every subset of 5 tiles, before and after: 326 × 326 cases.
    const keys = ["a", "b", "c", "d", "e"];
    const all = [...arrangements(keys)];
    const problems: string[] = [];
    for (const was of all)
      for (const now of all) {
        const got = keepOrder(was, now);
        const at = `${was.join("")} → ${now.join("")}: ${got.join("")}`;
        // Exactly the tiles there now, once each.
        if (got.length !== now.length || new Set(got).size !== got.length || !now.every((k) => got.includes(k)))
          problems.push(`${at}: not the tiles there now`);
        // The tiles that stay keep their order among themselves: none is moved.
        const stay = was.filter((k) => now.includes(k));
        if (got.slice(0, stay.length).join() !== stay.join()) problems.push(`${at}: moved a tile that stays`);
        // New ones after them, in the order they come.
        const fresh = now.filter((k) => !was.includes(k));
        if (got.slice(stay.length).join() !== fresh.join()) problems.push(`${at}: new ones out of order`);
      }
    expect(all.length).toBe(326);
    expect(problems.slice(0, 5)).toEqual([]);
  });
});

describe("a widget's bounds", () => {
  it("always hold its own size, so a tile resized by hand can always go back to it", () => {
    // Every size, own width (none, 1 to 26), rows (1 to 16), and declared bounds (none, or each
    // bound below, at and above its own size), on boards of 1 to 26 lanes.
    const problems: string[] = [];
    let cases = 0;
    const maybe = (v: number) => [undefined, Math.max(1, v - 2), v, v + 2];
    for (const size of TILE_SIZES as TileSize[])
      for (const width of [undefined, 1, 4, 5, 6, 12, 20, 26])
        for (const rows of [1, 2, 3, 5, 8, 12, 16]) {
          const own = width ?? (size === "full" ? undefined : { s: 6, m: 12, l: 18 }[size as "s" | "m" | "l"]);
          for (const minWidth of own === undefined ? [undefined] : maybe(own))
            for (const maxWidth of own === undefined ? [undefined] : maybe(own))
              for (const minRows of maybe(rows))
                for (const maxRows of maybe(rows)) {
                  cases++;
                  const b = boundsOf({ size, rows, width, minWidth, maxWidth, minRows, maxRows });
                  const at = JSON.stringify({ size, width, rows, minWidth, maxWidth, minRows, maxRows });
                  if (b.rows !== rows) problems.push(`${at}: rows ${b.rows}`);
                  if (b.minRows > rows || b.maxRows < rows) problems.push(`${at}: rows ${b.minRows}–${b.maxRows}`);
                  if (own !== undefined && ((b.minSpan ?? 1) > own || (b.maxSpan ?? Infinity) < own))
                    problems.push(`${at}: across ${b.minSpan}–${b.maxSpan}`);
                  // Resized to anything and back: its own size again, on any board that holds it.
                  for (const lanes of [own ?? 1, 26])
                    if (own !== undefined && own <= lanes) {
                      const back = resizeTo(b, lanes, own, rows);
                      if (back.span !== own || back.rows !== rows)
                        problems.push(`${at} on ${lanes}: back to ${back.span}×${back.rows}`);
                    }
                }
        }
    expect(cases).toBeGreaterThan(10000);
    expect(problems.slice(0, 5)).toEqual([]);
  });
});
