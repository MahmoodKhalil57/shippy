import { describe, expect, it } from "vite-plus/test";
import { compact, insert, putAt, type Box, type Edge } from "../src/components/base/arrange.ts";

/**
 * Arranging by hand (src/components/base/arrange.ts):
 * - the cases people expect, exactly: a tile put in by a start edge pushes the row on, wrapping the
 *   last one to the next row's start; by the end edge of the tile before it, the tiles before move
 *   back into the room there first and the rest push on; by a bottom edge, the tiles above move up
 *   into the room there first and the rest push down;
 * - for every row of up to 3 tiles 1 to 3 wide on a 6-lane board (each placement), with a tile
 *   under them, every tile put in by every edge of every tile in the row: no two tiles overlap,
 *   none is past the board or above the top, and the one put in is at the line (its row; by a
 *   start edge at the other tile's lane, by an end edge ending no later than the line plus its own
 *   width).
 */
const fixed = new Set<string>();
const at = (m: Map<string, { lane: number; row: number }>) =>
  Object.fromEntries([...m].map(([k, v]) => [k, `${v.lane},${v.row}`]));

describe("arranging by hand", () => {
  // The cases list's figures on 24 lanes: a gap of 2, then 4 + 6 + 6 + 6; a 6-wide figure being
  // moved (from under them) and the list itself under everything.
  const board = (): Map<string, Box> =>
    new Map([
      ["delivery", { lane: 2, row: 0, span: 4, rows: 3 }],
      ["customer", { lane: 6, row: 0, span: 6, rows: 3 }],
      ["internal", { lane: 12, row: 0, span: 6, rows: 3 }],
      ["corrected", { lane: 18, row: 0, span: 6, rows: 3 }],
      ["supplier", { lane: 0, row: 3, span: 6, rows: 3 }],
      ["cases", { lane: 0, row: 6, span: 24, rows: 12 }],
    ]);

  it("by a start edge: the row moves on, the last one wraps to the next row's start", () => {
    const got = at(insert(board(), "supplier", "customer", "start", 24, 0, fixed));
    expect(got).toMatchObject({ delivery: "2,0", supplier: "6,0", customer: "12,0", internal: "18,0" });
    expect(got.corrected).toBe("0,3");
    expect(got.cases).toBe("0,6");
  });

  it("by the end edge before it: the tiles before move back into the room first, the rest move on", () => {
    const got = at(insert(board(), "supplier", "delivery", "end", 24, 0, fixed));
    expect(got).toMatchObject({ delivery: "0,0", supplier: "4,0", customer: "10,0", internal: "16,0" });
    expect(got.corrected).toBe("0,3");
  });

  it("by a bottom edge: the tiles above move up into the room first, the rest push down", () => {
    const places = new Map<string, Box>([
      ["a", { lane: 0, row: 2, span: 4, rows: 2 }],
      ["b", { lane: 0, row: 4, span: 4, rows: 2 }],
      ["m", { lane: 8, row: 0, span: 4, rows: 3 }],
    ]);
    // Put in under `a` (row 4): 2 rows of room above it, so `a` goes up 2 and `b` down 1.
    const got = at(insert(places, "m", "a", "bottom", 12, 0, fixed));
    expect(got).toMatchObject({ a: "0,0", m: "0,2", b: "0,5" });
  });

  it("moves only what's actually in the way: tiles in the same lanes in other rows stay", () => {
    // The inbox history: de-duplication moved down one row, into space only it was in.
    const places = new Map<string, Box>([
      ["progress", { lane: 0, row: 2, span: 12, rows: 2 }],
      ["perYear", { lane: 12, row: 2, span: 12, rows: 8 }],
      ["dedup", { lane: 0, row: 4, span: 6, rows: 8 }],
      ["approval", { lane: 6, row: 4, span: 6, rows: 2 }],
      ["years", { lane: 6, row: 6, span: 6, rows: 2 }],
      ["mailboxes", { lane: 6, row: 10, span: 18, rows: 10 }],
    ]);
    expect(at(putAt(places, "dedup", { lane: 0, row: 5 }, 24, fixed))).toEqual({
      progress: "0,2",
      perYear: "12,2",
      dedup: "0,5",
      approval: "6,4",
      years: "6,6",
      mailboxes: "6,10",
    });
  });

  it("in empty space: what it lands on goes down", () => {
    const places = new Map<string, Box>([
      ["a", { lane: 0, row: 0, span: 4, rows: 2 }],
      ["m", { lane: 8, row: 0, span: 4, rows: 2 }],
    ]);
    expect(at(putAt(places, "m", { lane: 2, row: 1 }, 12, fixed))).toMatchObject({ m: "2,1", a: "0,3" });
  });

  it("squeezed into a gap too small for it: the row makes room, what's after moves on", () => {
    const places = new Map<string, Box>([
      ["a", { lane: 0, row: 0, span: 4, rows: 2 }],
      ["b", { lane: 8, row: 0, span: 4, rows: 2 }],
      ["c", { lane: 12, row: 0, span: 4, rows: 2 }],
      ["m", { lane: 0, row: 4, span: 6, rows: 2 }],
    ]);
    // A 4-lane gap at lane 4, a 6-wide tile put there: b and c move on by 2, c wraps.
    expect(at(putAt(places, "m", { lane: 4, row: 0 }, 16, fixed))).toMatchObject({
      a: "0,0",
      m: "4,0",
      b: "10,0",
      c: "0,2",
    });
  });

  it("put anywhere, squeezed or not: never overlaps, never leaves the board, stays where it's put", () => {
    const LANES = 6;
    const problems: string[] = [];
    const rowsOf = (n: number): Box[][] => {
      if (n === 0) return [[]];
      const out: Box[][] = [];
      for (const rest of rowsOf(n - 1)) {
        const from = rest.length ? rest.at(-1)!.lane + rest.at(-1)!.span : 0;
        for (let lane = from; lane < LANES; lane++)
          for (let span = 1; span <= 3 && lane + span <= LANES; span++)
            out.push([...rest, { lane, row: 0, span, rows: 1 }]);
      }
      return out;
    };
    for (let n = 1; n <= 3; n++)
      for (const row of rowsOf(n))
        for (let span = 1; span <= 3; span++)
          for (let lane = 0; lane + span <= LANES; lane++)
            for (const r of [0, 1]) {
              const places = new Map<string, Box>(row.map((b, i) => [`t${i}`, b]));
              places.set("m", { lane: 0, row: 3, span, rows: 1 });
              const got = putAt(places, "m", { lane, row: r }, LANES, fixed);
              const boxes = [...got].map(([k, p]) => ({
                k,
                ...p,
                span: places.get(k)!.span,
                rows: places.get(k)!.rows,
              }));
              const where = `${JSON.stringify(row)} m${span} at ${lane},${r}`;
              const m = got.get("m")!;
              if (m.lane !== lane || m.row !== r) problems.push(`${where}: m not where it was put`);
              for (const b of boxes)
                if (b.lane < 0 || b.lane + b.span > LANES || b.row < 0) problems.push(`${where}: ${b.k} off`);
              for (let i = 0; i < boxes.length; i++)
                for (let j = i + 1; j < boxes.length; j++) {
                  const x = boxes[i]!;
                  const y = boxes[j]!;
                  if (
                    x.row < y.row + y.rows &&
                    x.row + x.rows > y.row &&
                    x.lane < y.lane + y.span &&
                    x.lane + x.span > y.lane
                  )
                    problems.push(`${where}: ${x.k} and ${y.k} overlap`);
                }
            }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("never overlaps, never leaves the board, and puts the tile in at the line", () => {
    const LANES = 6;
    const problems: string[] = [];
    let cases = 0;
    const rows = (n: number): Box[][] => {
      if (n === 0) return [[]];
      const out: Box[][] = [];
      for (const rest of rows(n - 1)) {
        const from = rest.length ? rest.at(-1)!.lane + rest.at(-1)!.span : 0;
        for (let lane = from; lane < LANES; lane++)
          for (let span = 1; span <= 3 && lane + span <= LANES; span++)
            out.push([...rest, { lane, row: 0, span, rows: 1 }]);
      }
      return out;
    };
    for (let n = 1; n <= 3; n++)
      for (const row of rows(n))
        for (let span = 1; span <= 3; span++)
          for (let target = 0; target < n; target++)
            for (const edge of ["start", "end", "top", "bottom"] as Edge[])
              for (let near = 0; near < LANES; near++) {
                cases++;
                const places = new Map<string, Box>(row.map((b, i) => [`t${i}`, b]));
                places.set("under", { lane: 0, row: 1, span: LANES, rows: 1 });
                places.set("m", { lane: 0, row: 2, span, rows: 1 });
                const got = insert(places, "m", `t${target}`, edge, LANES, near, fixed);
                const boxes = [...got].map(([k, p]) => ({
                  k,
                  ...p,
                  span: places.get(k)!.span,
                  rows: places.get(k)!.rows,
                }));
                const where = `${JSON.stringify(row)} m${span} ${edge} t${target} near ${near}`;
                for (const b of boxes)
                  if (b.lane < 0 || b.lane + b.span > LANES || b.row < 0)
                    problems.push(`${where}: ${b.k} off the board`);
                for (let i = 0; i < boxes.length; i++)
                  for (let j = i + 1; j < boxes.length; j++) {
                    const a = boxes[i]!;
                    const b = boxes[j]!;
                    if (
                      a.row < b.row + b.rows &&
                      a.row + a.rows > b.row &&
                      a.lane < b.lane + b.span &&
                      a.lane + a.span > b.lane
                    )
                      problems.push(`${where}: ${a.k} and ${b.k} overlap`);
                  }
                const t = places.get(`t${target}`)!;
                const m = got.get("m")!;
                if ((edge === "start" || edge === "end") && m.row !== t.row)
                  problems.push(`${where}: m not in the row`);
                if (edge === "start" && m.lane !== Math.min(t.lane, LANES - span))
                  problems.push(`${where}: m at ${m.lane}`);
                if (edge === "end" && m.lane + span > Math.max(span, t.lane + t.span + span))
                  problems.push(`${where}: m past the line`);
                if (edge === "top" && m.row !== t.row) problems.push(`${where}: m not at the top`);
              }
    expect(cases).toBeGreaterThan(1000);
    expect(problems.slice(0, 5)).toEqual([]);
  });
});

describe("compact", () => {
  // Every board of 3 lanes with up to 3 tiles, each 1 or 2 across, 1 or 2 down, its top row 0 to
  // 4, none overlapping, any one of them fixed or none: no tile changes lane or size or goes down,
  // none overlap, a fixed tile stays, tiles sharing lanes keep their order down, and no tile can
  // then move up a row (the fixpoint).
  it("closes every gap it can, and only those", () => {
    const shapes: Box[] = [];
    for (let lane = 0; lane < 3; lane++)
      for (let span = 1; lane + span <= 3; span++)
        for (let rows = 1; rows <= 2; rows++) for (let row = 0; row <= 4; row++) shapes.push({ lane, row, span, rows });
    const hit = (a: Box, b: Box) =>
      a.row < b.row + b.rows && a.row + a.rows > b.row && a.lane < b.lane + b.span && a.lane + a.span > b.lane;
    const bad: string[] = [];
    const check = (boxes: Box[]) => {
      for (let f = -1; f < boxes.length; f++) {
        const places = new Map(boxes.map((b, i) => [String(i), b]));
        const fixed = new Set(f < 0 ? [] : [String(f)]);
        const out = compact(places, fixed);
        const after = boxes.map((b, i) => ({ ...b, row: out.get(String(i))!.row, lane: out.get(String(i))!.lane }));
        const at = JSON.stringify(boxes) + " fixed " + f;
        after.forEach((b, i) => {
          if (b.lane !== boxes[i]!.lane || b.row > boxes[i]!.row) bad.push(at + " moved wrong");
          if (i === f && b.row !== boxes[i]!.row) bad.push(at + " fixed moved");
          if (i !== f && b.row > 0 && !after.some((o, j) => j !== i && hit(o, { ...b, row: b.row - 1 })))
            bad.push(at + " not compact");
          after.forEach((o, j) => {
            if (j <= i) return;
            if (hit(b, o)) bad.push(at + " overlap");
            const lanes = b.lane < o.lane + o.span && o.lane < b.lane + b.span;
            if (lanes && boxes[i]!.row < boxes[j]!.row !== b.row < o.row) bad.push(at + " order");
          });
        });
      }
    };
    for (const a of shapes) {
      check([a]);
      for (const b of shapes) {
        if (hit(a, b)) continue;
        check([a, b]);
        for (const c of shapes) if (!hit(a, c) && !hit(b, c)) check([a, b, c]);
      }
    }
    expect(bad.slice(0, 5)).toEqual([]);
  }, 120_000);
});
