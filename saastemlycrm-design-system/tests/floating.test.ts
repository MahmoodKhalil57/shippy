import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * Everything that floats beside something (a field's help, a menu, a combobox's list, a tile's
 * menu, a chart's tip, a tooltip) is a popover placed by Floating UI (src/components/base/floating.ts),
 * one way. No panel is placed by CSS anchor positioning or by daisyUI's dropdown / tooltip classes,
 * which a scrolling box clips and which don't shift to stay in the window.
 *
 * Not floating beside anything, so not Floating UI's: the snackbar (a fixed spot on the screen), a
 * tile held in a drag (it follows the pointer), the native select's own picker (the browser places
 * it), and the menu's sliding highlight (an in-flow element anchored to the active row: `anchor()`
 * there is layout, not a panel).
 */

const root = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith(".ts") ? [p] : [];
  });
const sources = files(root)
  .map((f) => ({ rel: path.relative(root, f).split(path.sep).join("/"), src: readFileSync(f, "utf8") }))
  .filter(({ rel }) => !rel.startsWith("testing/") && !rel.endsWith(".test.ts"));

/** The class strings of a source: string and template literals of more than one class, comments skipped. */
const classStrings = (src: string) =>
  src
    .split("\n")
    .filter((l) => !/^\s*(?:\*|\/\/|\/\*)/.test(l))
    .flatMap((l) => [...l.matchAll(/(["'`])((?:(?!\1).)*\s(?:(?!\1).)*)\1/g)].map((m) => m[2]!));

/** A popover that isn't beside anything, and why. */
const NOT_BESIDE: Record<string, string> = {
  "components/primitives/feedback/snackbar.ts": "a fixed spot on the screen",
  "components/primitives/layout/board.ts": "a tile held in a drag follows the pointer",
  "components/primitives/feedback/tooltip.ts": "the page's one tip is placed with place() as it moves",
  "components/primitives/feedback/coachmark.ts":
    "a tour's dim covers the window, and its card glides with the spotlight on the same spring",
};
/** In-flow layout anchored with CSS (not a floating panel). */
const IN_FLOW = new Set(["components/primitives/navigation/menu.ts", "components/composed/layout/app-shell.ts"]);

describe("floating", () => {
  it("no panel is placed by CSS anchor positioning", () => {
    const problems: string[] = [];
    for (const { rel, src } of sources) {
      if (IN_FLOW.has(rel)) continue;
      for (const m of src.matchAll(/position-area|position-anchor|position-try|anchor-name|anchor-size\(/g))
        problems.push(`${rel}: ${m[0]}`);
    }
    expect(problems).toEqual([]);
  });

  it("no panel uses daisyUI's dropdown or tooltip classes", () => {
    const DAISY =
      /^(?:dropdown|dropdown-content|dropdown-(?:top|bottom|left|right|start|center|end|hover|open|close)|tooltip|tooltip-(?:top|bottom|left|right|content|open))$/;
    const problems: string[] = [];
    for (const { rel, src } of sources)
      for (const cls of classStrings(src))
        for (const token of cls.split(/\s+/)) if (DAISY.test(token)) problems.push(`${rel}: ${token}`);
    expect(problems).toEqual([]);
  });

  it("every popover is placed by Floating UI, or isn't beside anything", () => {
    const problems: string[] = [];
    for (const { rel, src } of sources) {
      if (!rel.startsWith("components/primitives/") || NOT_BESIDE[rel]) continue;
      const popovers = [...src.matchAll(/\n\s*popover(?:=["'][a-z]+["'])?\s*\n/g)].length;
      if (!popovers) continue;
      if (!/\b(?:float|floating)\(\{/.test(src))
        problems.push(`${rel}: ${popovers} popovers, none placed by Floating UI`);
    }
    expect(problems).toEqual([]);
  });
});
