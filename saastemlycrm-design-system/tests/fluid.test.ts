import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { fluidProblems, isClassString } from "../lint/index.js";

/**
 * Fluid layout, by construction: the class recipes of every component can't hold a layout that
 * overflows its container at a narrow width. What the classes alone can't show (real content at
 * a real width) the layout audit finds on screen (src/components/base/layout.ts, `?audit`).
 *
 * Grounded in M3 (Lists: "the content slot must be the largest-width slot"; leading and trailing
 * "must be a smaller width than the content section") and Apple's HIG (Layout: "adapts gracefully"
 * to every window size, checked at "the largest and smallest layouts … for clipping").
 *
 * 1. A part that won't shrink (`shrink-0`) and lays out several things (`flex` / `grid` with a
 *    `gap`) must wrap (`flex-wrap`), be capped (`max-w-*`) or have a fixed size (`w-*`, `size-*`).
 *    Otherwise a long list of tags pushes past the card and squeezes the content to nothing.
 * 2. A fixed width of 10rem or more (`w-40`…, `w-[…rem]`, `min-w-[…]`) must be capped too
 *    (`max-w-*`, or written as `min(100%, …)`), so it never exceeds a phone-width container.
 * 3. A wrapping group (`flex-wrap`) must be capped (`max-w-*`, `min-w-0`, `w-full`, `flex-1`,
 *    `grow`, `basis-*`): as a flex item with an automatic width it keeps its one-line width, so it
 *    never wraps and spills out of its row instead (the CSS trap behind card headers' tags).
 * 4. A button (`btn`) is capped (`max-w-full`): a label too long for the room wraps instead of
 *    spilling past the card.
 * 5. A fieldset (`fieldset`) has `min-w-0`: browsers give it `min-width: min-content`, so it
 *    refuses to shrink below its widest field.
 * 6. A form control (`input`, `textarea`, `select`) has `min-w-0`: as a grid item (in a fieldset)
 *    it keeps its built-in width of about 20 characters instead of shrinking with the column.
 *
 * A recipe that is fixed on purpose (a toolbar of icon buttons) says so in a comment on one of
 * the two lines above it: `// layout: fixed (…why…)`.
 */

const SRC = path.resolve(import.meta.dirname, "../src/components");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith(".ts") ? [path.join(dir, e.name)] : [],
  );

/** Every class string in a file with what's wrong in it, unless marked `layout: fixed` just above. */
function fileProblems(source: string): string[] {
  const out: string[] = [];
  const lines = source.split("\n");
  for (const [i, text] of lines.entries()) {
    const marked = [lines[i - 1], lines[i - 2], text].some((l) => l?.includes("layout: fixed"));
    if (marked) continue;
    for (const m of text.matchAll(/"([^"\n]*)"/g))
      if (isClassString(m[1]!)) out.push(...fluidProblems(m[1]!).map((p) => `line ${i + 1}: ${p}`));
  }
  return out;
}

describe("fluid layout, by construction", () => {
  it.each(files(SRC).map((f) => [path.relative(SRC, f).split(path.sep).join("/"), f]))("%s", (_, file) => {
    expect(fileProblems(readFileSync(file, "utf8"))).toEqual([]);
  });

  it("catches the patterns it's meant to", () => {
    expect(fluidProblems("flex shrink-0 items-center gap-2")).toHaveLength(1);
    expect(fluidProblems("flex max-w-full shrink-0 flex-wrap items-center gap-2")).toEqual([]);
    expect(fluidProblems("flex max-w-[40%] shrink-0 gap-2")).toEqual([]);
    expect(fileProblems(`// layout: fixed (icon buttons)\nconst t = rcva("flex shrink-0 gap-1");`)).toEqual([]);
    expect(fileProblems(`const t = rcva("flex shrink-0 gap-1");`)).toHaveLength(1);
    expect(isClassString("With fieldset and label")).toBe(false);
    expect(fluidProblems("textarea w-full")).toHaveLength(1);
    expect(fluidProblems("textarea min-w-0 w-full")).toEqual([]);
    expect(fluidProblems("select an option")).toEqual([]);
    expect(fluidProblems("grid grid-cols-[minmax(8rem,max-content)_1fr]")).toHaveLength(1);
    expect(fluidProblems("grid grid-cols-[auto_minmax(0,1fr)]")).toEqual([]);
    expect(fluidProblems("grid grid-cols-2")).toHaveLength(1);
    expect(fluidProblems("grid grid-cols-1 @sm:grid-cols-[minmax(min(8rem,40%),max-content)_minmax(0,1fr)]")).toEqual(
      [],
    );
    expect(fluidProblems("w-96")).toHaveLength(1);
    expect(fluidProblems("w-96 max-w-full")).toEqual([]);
    expect(fluidProblems("min-w-[13.5rem] flex-1")).toHaveLength(1);
    expect(fluidProblems("w-10 shrink-0")).toEqual([]);
    expect(fluidProblems("flex flex-wrap items-center gap-2")).toHaveLength(1);
    expect(fluidProblems("flex max-w-full flex-wrap items-center gap-2")).toEqual([]);
    expect(fluidProblems("btn btn-ghost")).toHaveLength(1);
    expect(fluidProblems("btn max-w-full")).toEqual([]);
    expect(fluidProblems("fieldset")).toHaveLength(2);
    expect(fluidProblems("fieldset min-w-0")).toHaveLength(1);
    expect(fluidProblems("fieldset min-w-0 grid-cols-[minmax(0,1fr)]")).toEqual([]);
    expect(fluidProblems("label")).toHaveLength(1);
    expect(fluidProblems("label whitespace-normal")).toEqual([]);
    expect(isClassString("the label")).toBe(false);
  });
});
