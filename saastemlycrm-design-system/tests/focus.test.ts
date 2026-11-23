import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";

/**
 * Focus shows the way a control is used, never as a ring around it (AGENTS.md "Focus"). One place
 * draws it for every element (`src/styles/daisy-m3.css`): typing shows the caret and the field's
 * edge in primary, pressing a line just inside the control's edge from the keyboard, choosing a
 * soft halo. So a primitive draws no focus outline or ring of its own, and one that turns the
 * outline off says what shows its focus instead.
 */

const root = path.resolve(import.meta.dirname, "../src");
const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : e.name.endsWith(".ts") ? [p] : [];
  });

/** The string and template literals of a source file, line by line, comments skipped. */
const strings = (src: string) =>
  src
    .split("\n")
    .filter((l) => !/^\s*(?:\*|\/\/|\/\*)/.test(l))
    .flatMap((l) => [...l.matchAll(/(["'`])((?:(?!\1).)*)\1/g)].map((m) => m[2]!));

/** What shows the focus of an element whose outline is off. */
const REASONS = new Set(["field", "host", "fill"]);

const sources = files(root)
  .map((f) => ({ rel: path.relative(root, f).split(path.sep).join("/"), f }))
  .filter(({ rel }) => !rel.startsWith("testing/") && !rel.endsWith(".test.ts"))
  .map(({ rel, f }) => ({ rel, list: strings(readFileSync(f, "utf8")) }));

describe("focus", () => {
  it("no primitive draws a focus outline or ring of its own", () => {
    const problems: string[] = [];
    for (const { rel, list } of sources)
      for (const cls of list)
        for (const m of cls.matchAll(
          /(?:^|\s)((?:[\w-]+:)*(?:focus|focus-visible|focus-within):(?:-?outline|ring|inset-ring)[\w/.\-[\]]*)/g,
        ))
          problems.push(`${rel}: ${m[1]}`);
    expect(problems).toEqual([]);
  });

  it("an element whose outline is off says what shows its focus", () => {
    const problems: string[] = [];
    for (const { rel, list } of sources)
      for (const cls of list) {
        if (!/(?:^|\s)(?:[^\s]*:)?outline-none!?(?=\s|$)/.test(cls)) continue;
        const reason = /\[--focus:([a-z]+)\]/.exec(cls)?.[1];
        if (!reason) problems.push(`${rel}: outline-none with no reason: ${cls.slice(0, 90)}`);
        else if (!REASONS.has(reason)) problems.push(`${rel}: "${reason}" isn't what shows focus: ${cls.slice(0, 90)}`);
      }
    expect(problems).toEqual([]);
  });

  it("the one place that draws focus keeps pressing inside the edge and typing ringless", () => {
    const css = readFileSync(path.join(root, "styles/daisy-m3.css"), "utf8");
    const press = /:focus-visible:not\([\s\S]*?\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    expect(press).toMatch(/outline-offset:\s*-2px/);
    const type =
      /:is\(\.input, \.textarea, \.select, \.file-input\):is\(:focus, :focus-within\)\s*\{([^}]*)/.exec(css)?.[1] ?? "";
    expect(type).toMatch(/outline:\s*none/);
    expect(type).toMatch(/caret-color:\s*var\(--color-primary\)/);
  });
});
