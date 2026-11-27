import { describe, expect, test } from "vite-plus/test";
import { executedCounts, hitUnits, identityHits, type V8Function } from "./executed.ts";
import { FIXTURE, vlq } from "./fixtures.ts";
import { splitUnits, unitsAt } from "./units.ts";

const LENGTH = 5;
const INTERVALS = Array.from({ length: LENGTH }, (_, s) =>
  Array.from({ length: LENGTH - s }, (_, k) => ({ start: s, end: s + k + 1 })),
).flat();
const compatible = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.end <= b.start ||
  b.end <= a.start ||
  (a.start <= b.start && b.end <= a.end) ||
  (b.start <= a.start && a.end <= b.end);

function* families(size: number, from = 0): Generator<{ start: number; end: number }[]> {
  if (size === 0) {
    yield [];
    return;
  }
  for (let i = from; i < INTERVALS.length; i++)
    for (const rest of families(size - 1, i + 1))
      if (rest.every((r) => compatible(r, INTERVALS[i]!))) yield [INTERVALS[i]!, ...rest];
}

describe("executedCounts", () => {
  test("each offset takes the count of the innermost range around it, for every nested family of up to three ranges and every count", () => {
    let checked = 0;
    for (let size = 0; size <= 3; size++)
      for (const family of families(size))
        for (let mask = 0; mask < 1 << family.length; mask++) {
          const ranges = family.map((r, i) => ({ startOffset: r.start, endOffset: r.end, count: (mask >> i) & 1 }));
          const counts = executedCounts(LENGTH, [{ ranges }]);
          for (let at = 0; at < LENGTH; at++) {
            const around = ranges.filter((r) => r.startOffset <= at && at < r.endOffset);
            const innermost = around.sort((a, b) => a.endOffset - a.startOffset - (b.endOffset - b.startOffset))[0];
            expect(counts[at]).toBe(innermost ? Math.min(innermost.count, 1) : 1);
          }
          checked++;
        }
    expect(checked).toBeGreaterThan(1000);
  });

  test("shifts ranges by the wrapper offset and clips them, for every offset up to the length", () => {
    for (let shift = 0; shift <= LENGTH; shift++) {
      const counts = executedCounts(
        LENGTH,
        [{ ranges: [{ startOffset: shift, endOffset: shift + 2, count: 0 }] }],
        shift,
      );
      expect([...counts]).toEqual([0, 0, 1, 1, 1]);
    }
  });

  test("counts above one mean executed", () => {
    expect([...executedCounts(2, [{ ranges: [{ startOffset: 0, endOffset: 2, count: 7 }] }])]).toEqual([1, 1]);
  });
});

const identityMap = (text: string, shift: number) => {
  const lines = text.split("\n");
  const groups: string[] = Array.from({ length: shift }, () => "");
  let previous = { line: 0, column: 0 };
  lines.forEach((line, n) => {
    const parts: string[] = [];
    let column = 0;
    for (let c = 0; c < line.length; c++) {
      if (/\s/.test(line[c]!)) continue;
      parts.push([c - column, 0, n - previous.line, c - previous.column].map(vlq).join(""));
      column = c;
      previous = { line: n, column: c };
    }
    groups.push(parts.join(","));
  });
  return groups.join(";");
};

describe("hitUnits", () => {
  const tree = splitUnits("fixture.ts", FIXTURE);
  const functions = tree.units.filter((u) => u.kind !== "field" && u.kind !== "top");

  test("marks exactly the units with an executed token, through a source map, for every subset of executed functions", () => {
    const picked = functions.slice(0, 8);
    const shift = 2;
    const generated = "\n".repeat(shift) + FIXTURE;
    const mappings = identityMap(FIXTURE, shift);
    for (let mask = 0; mask < 1 << picked.length; mask++) {
      const ranges = [
        { startOffset: 0, endOffset: generated.length, count: 1 },
        ...functions.map((u) => ({
          startOffset: u.start + shift,
          endOffset: u.end + shift,
          count: picked.indexOf(u) >= 0 && (mask >> picked.indexOf(u)) & 1 ? 1 : 0,
        })),
      ];
      const v8: V8Function[] = [{ ranges }];
      const counts = executedCounts(generated.length, v8);
      const expected = new Set<number>();
      for (let at = 0; at < FIXTURE.length; at++)
        if (!/\s/.test(FIXTURE[at]!) && counts[at + shift]) for (const u of unitsAt(tree, at)) expected.add(u);
      const hits = hitUnits(tree, FIXTURE, { generated, mappings, sources: [0] }, counts);
      expect(hits.all).toBe(false);
      if (hits.all) continue;
      expect([...hits.units].sort((a, b) => a - b)).toEqual([...expected].sort((a, b) => a - b));
      const direct = identityHits(
        tree,
        FIXTURE,
        executedCounts(FIXTURE.length, [
          { ranges: ranges.map((r) => ({ ...r, startOffset: r.startOffset - shift, endOffset: r.endOffset - shift })) },
        ]),
      );
      expect(direct).toEqual(hits);
      for (const [i, u] of picked.entries())
        if ((mask >> i) & 1) expect(hits.units.has(tree.units.indexOf(u))).toBe(true);
    }
  });

  test("falls back to every unit when the map does not fit the text, has no segment for the file, or lines are ambiguous", () => {
    const counts = executedCounts(FIXTURE.length, []);
    const fits = { generated: FIXTURE, mappings: identityMap(FIXTURE, 0), sources: [0] };
    expect(hitUnits(tree, FIXTURE, fits, counts).all).toBe(false);
    expect(hitUnits(tree, FIXTURE, { ...fits, mappings: [0, 0, 0, 500].map(vlq).join("") }, counts).all).toBe(true);
    expect(hitUnits(tree, FIXTURE, { ...fits, mappings: [500, 0, 0, 0].map(vlq).join("") }, counts).all).toBe(true);
    expect(hitUnits(tree, FIXTURE, { ...fits, sources: [1] }, counts).all).toBe(true);
    expect(hitUnits(tree, `${FIXTURE}\r`, fits, counts).all).toBe(true);
    expect(hitUnits(splitUnits("x.ts", "function ("), "function (", fits, counts).all).toBe(true);
    expect(identityHits(tree, FIXTURE, executedCounts(1, [])).all).toBe(true);
  });
});
