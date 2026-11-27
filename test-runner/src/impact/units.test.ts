import { describe, expect, test } from "vite-plus/test";
import { FIXTURE, UNITS } from "./fixtures.ts";
import { splitUnits, unitsAt, type UnitTree } from "./units.ts";

const OWNERS: Record<number, string[]> = {
  1: [""],
  2: ["", "decl"],
  3: ["decl"],
  4: ["", "arrow"],
  5: ["arrow"],
  6: ["named"],
  7: ["Box.field"],
  8: [""],
  9: ["Box.#secret"],
  10: [""],
  11: ["Box.handler > value"],
  12: ["Box.constructor"],
  13: ["Box.method > arrow"],
  14: ["Box.get value"],
  15: ["Box.set value"],
  16: ["Box.static make"],
  17: ["run"],
  18: ["get size"],
  19: ["set size"],
  20: ["plain"],
  21: ["call()"],
  22: ["default"],
};

const hashes = (tree: UnitTree) => new Map(tree.units.map((u) => [u.id, u.hash]));
const split = (source: string) => splitUnits("fixture.ts", source);

function changed(before: UnitTree, after: UnitTree): string[] {
  const a = hashes(before);
  const b = hashes(after);
  return [...new Set([...a.keys(), ...b.keys()])].filter((id) => a.get(id) !== b.get(id)).sort();
}

function bruteForce(tree: UnitTree, offset: number): number[] {
  const inside = (i: number) => tree.units[i]!.start <= offset && offset < tree.units[i]!.end;
  const inBody = (i: number) => tree.units[i]!.body.start <= offset && offset < tree.units[i]!.body.end;
  return tree.units
    .map((_, i) => i)
    .filter((i) => i === 0 || inside(i))
    .filter((i) => !tree.units[i]!.children.some((c) => inside(c) && inBody(c)))
    .sort((x, y) => x - y);
}

describe("splitUnits", () => {
  const tree = split(FIXTURE);

  test("finds exactly one unit per function, method, getter, setter, constructor, arrow and instance field", () => {
    expect(tree.parsed).toBe(true);
    expect(tree.units.map((u) => [u.kind, u.id])).toEqual(UNITS);
  });

  test("changing each literal changes exactly the units whose own text holds it, for every literal", () => {
    for (const [n, owners] of Object.entries(OWNERS)) {
      const edited = FIXTURE.replace(new RegExp(`\\b${n}\\b`), "99");
      expect(edited).not.toBe(FIXTURE);
      expect([n, changed(tree, split(edited))]).toEqual([n, [...owners].sort()]);
    }
  });

  test("extra whitespace or a comment in any existing gap changes no hash, for every gap", () => {
    const gaps = [...FIXTURE.matchAll(/[ \n]+/g)].map((m) => ({ at: m.index, run: m[0] }));
    const quoted = [...FIXTURE.matchAll(/"[^"]*"/g)].map((m) => [m.index, m.index + m[0].length]);
    for (const { at, run } of gaps) {
      if (quoted.some(([s, e]) => at >= s! && at < e!)) continue;
      const end = at + run.length;
      const widened = FIXTURE.slice(0, end) + (run.includes("\n") ? "\n  \t" : " \t") + FIXTURE.slice(end);
      expect(changed(tree, split(widened))).toEqual([]);
      const commented = FIXTURE.slice(0, end) + (run.includes("\n") ? "// c\n" : "/* c */ ") + FIXTURE.slice(end);
      expect(changed(tree, split(commented))).toEqual([]);
    }
  });

  test("a space before or after any bracket or separator changes no hash, for every bracket and separator", () => {
    const quoted = [...FIXTURE.matchAll(/"[^"]*"/g)].map((m) => [m.index, m.index + m[0].length]);
    let checked = 0;
    for (let at = 0; at < FIXTURE.length; at++) {
      if (!/[()[\]{};,]/.test(FIXTURE[at]!) || quoted.some(([s, e]) => at >= s! && at < e!)) continue;
      for (const cut of [at, at + 1]) {
        expect(changed(tree, split(`${FIXTURE.slice(0, cut)} ${FIXTURE.slice(cut)}`))).toEqual([]);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(100);
  });

  test("turning a space into a newline changes the units around it, since a newline can change parsing", () => {
    const at = FIXTURE.indexOf("return 3");
    const edited = `${FIXTURE.slice(0, at + 6)}\n${FIXTURE.slice(at + 7)}`;
    expect(changed(tree, split(edited))).toEqual(["decl"]);
  });

  test("renaming a method removes its unit and changes the text of its parent", () => {
    expect(changed(tree, split(FIXTURE.replace("method()", "renamed()")))).toEqual(
      ["", "Box.method", "Box.method > arrow", "Box.renamed", "Box.renamed > arrow"].sort(),
    );
  });

  test("numbers siblings that share a name", () => {
    const twins = split("call(() => 1);\ncall(() => 2);\n");
    expect(twins.units.map((u) => u.id)).toEqual(["", "call()", "call()#2"]);
  });

  test("falls back to one raw unit when the source does not parse", () => {
    const broken = split("function (");
    expect(broken.parsed).toBe(false);
    expect(broken.units).toHaveLength(1);
    expect(split("function  (").units[0]!.hash).not.toBe(broken.units[0]!.hash);
  });
});

describe("unitsAt", () => {
  test("marks the innermost unit and every parent whose own text holds the offset, for every offset", () => {
    const tree = split(FIXTURE);
    for (let offset = 0; offset <= FIXTURE.length; offset++)
      expect([offset, unitsAt(tree, offset).sort((x, y) => x - y)]).toEqual([offset, bruteForce(tree, offset)]);
  });
});
