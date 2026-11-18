import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { AA, contrastRatio, luminanceOf, readableInk } from "../plugins/contrast.ts";
import { INK_ON } from "../plugins/schemes.ts";

/**
 * Colour accessibility of every colour scheme (src/styles/schemes.css), light and dark: each ink
 * must read on its fill. Runtime contrast (text over images, opacity, glass) is checked on screen
 * by `<ui-contrast-audit>` (command palette → "Check colour contrast").
 */
const css = readFileSync(path.resolve(import.meta.dirname, "../src/styles/schemes.css"), "utf8");
const blocks = [...css.matchAll(/(:root\[data-scheme="([^"]+)"\][^{]*)\{([^}]*)\}/g)].map(([, selector, id, body]) => ({
  name: `${id} ${/dark|not\(\[data-theme\]\)/.test(selector!) ? "dark" : "light"}`,
  tokens: Object.fromEntries([...body!.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k!, v!.trim()])),
}));

describe("colour scheme contrast (WCAG)", () => {
  it("parses every scheme", () => {
    expect(blocks.length).toBeGreaterThan(50);
    expect(luminanceOf("oklch(1 0 0)")).toBeCloseTo(1, 2);
    expect(luminanceOf("oklch(0 0 0)")).toBeCloseTo(0, 5);
  });

  it("body text reads on the page at AA in every scheme", () => {
    const failures = blocks.flatMap(({ name, tokens }) => {
      const ink = luminanceOf(tokens["base-content"] ?? "");
      const page = luminanceOf(tokens["base-100"] ?? "");
      if (ink == null || page == null) return [];
      const ratio = contrastRatio(ink, page);
      return ratio < AA ? [`${name}: base-content on base-100 ${ratio.toFixed(2)}:1`] : [];
    });
    expect(failures).toEqual([]);
  });

  it("every ink on a coloured fill is the most readable choice (AA where reachable, never below 3:1)", () => {
    const failures = blocks.flatMap(({ name, tokens }) =>
      INK_ON.flatMap(([ink, fill]) => {
        const i = tokens[ink];
        const f = tokens[fill];
        if (!i || !f) return [];
        const ratio = contrastRatio(luminanceOf(i)!, luminanceOf(f)!);
        const problems = [];
        if (readableInk(i, f) !== i) problems.push(`${name}: ${ink} on ${fill} ${ratio.toFixed(2)}:1 (regenerate)`);
        if (ratio < 3) problems.push(`${name}: ${ink} on ${fill} only ${ratio.toFixed(2)}:1`);
        return problems;
      }),
    );
    expect(failures).toEqual([]);
  });
});
