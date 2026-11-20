import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { recipeVariants } from "../vite/recipes.ts";

/**
 * One-line table rows (`<ui-table lines="one">`, src/components/primitives/data/table.ts), read
 * from the recipe itself and checked for every density (a finite domain: 0, −1, −2):
 * - a row is 44px (Apple HIG's 44pt target), then 4dp shorter per density step (M3 density);
 * - whatever the density, the row's padding leaves 32px for what's in it, so the tallest things a
 *   cell holds (an `xs` button, 32px; an avatar, 28px; a checkbox, 24px) never make a row taller
 *   than its neighbours;
 * - every body cell is cut with "…" (`truncate`) at a cap, and nothing inside it wraps again.
 */

const file = path.resolve(import.meta.dirname, "../src/components/primitives/data/table.ts");
const source = readFileSync(file, "utf8");
const one = recipeVariants(source, file)
  .find((r) => r.lines?.one)!
  .lines!.one!.split(/\s+/);

/** The classes a density adds to one-line rows (the recipe's compound variants). */
const compound = (density: string) => {
  const m = new RegExp(`\\{\\s*lines:\\s*"one",\\s*density:\\s*"${density}",\\s*class:\\s*"([^"]+)"`).exec(source);
  return m ? m[1]!.split(/\s+/) : [];
};
/** Tailwind's spacing unit is 4px (src/styles/theme.css). */
const px = (classes: string[], prefix: string) => {
  const found = classes.filter((c) => c.replace(/!$/, "").startsWith(prefix));
  expect(found, `one ${prefix}`).toHaveLength(1);
  return Number(found[0]!.replace(/!$/, "").slice(prefix.length)) * 4;
};
/** What's tallest in a row: an `xs` button (daisyUI's `btn-sm`, 2rem). */
const TALLEST = 32;

describe("one-line table rows", () => {
  it.each([
    ["0", 44],
    ["-1", 40],
    ["-2", 36],
  ])("at density %s a row is %dpx and holds a 32px control", (density, height) => {
    // A density's classes are important (`!`), so they win over the base's.
    const own = compound(density);
    for (const c of own) expect(c.endsWith("!"), c).toBe(true);
    const classes = own.length ? own : one;
    const row = px(classes, "[&_tbody_tr]:h-");
    const pad = px(classes, "[&_tbody_:is(td,th)]:py-");
    expect(row).toBe(height);
    expect(row - 2 * pad).toBeGreaterThanOrEqual(TALLEST);
  });

  it("cuts every body cell at a cap, and nothing in a cell wraps again", () => {
    expect(one).toContain("[&_tbody_td]:truncate");
    expect(one).toContain("[&_tbody_td_*]:text-nowrap");
    expect(one.some((c) => /^\[&_tbody_:is\(td,th\)\]:max-w-\d+$/.test(c))).toBe(true);
  });

  it("is what collection lists and widget tables use", () => {
    const read = (rel: string) => readFileSync(path.resolve(import.meta.dirname, "../src/app", rel), "utf8");
    for (const rel of ["list-view.ts", "widgets/blocks.ts"]) {
      const tables = read(rel).match(/<ui-table\b[^>]*>/g) ?? [];
      expect(tables.length, rel).toBeGreaterThan(0);
      for (const t of tables) expect(t, rel).toMatch(/\slines="one"/);
    }
  });
});
