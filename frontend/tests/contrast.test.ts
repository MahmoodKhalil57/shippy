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

/**
 * The default scheme: daisyUI's own light and dark themes, with the fills src/styles/daisy-m3.css
 * darkens (`:root:not([data-scheme])` blocks; the `[data-theme="dark"]` one is dark only).
 */
const daisyTheme = (name: string) =>
  Object.fromEntries(
    [
      ...readFileSync(path.resolve(import.meta.dirname, `../node_modules/daisyui/theme/${name}.css`), "utf8").matchAll(
        /--color-([a-z0-9-]+):\s*([^;]+);/g,
      ),
    ].map((m) => [m[1]!, m[2]!.trim()]),
  );
const m3css = readFileSync(path.resolve(import.meta.dirname, "../src/styles/daisy-m3.css"), "utf8");
const overrides = (selector: RegExp) =>
  Object.fromEntries(
    [...m3css.matchAll(new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`, "g"))].flatMap((b) =>
      [...b[1]!.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]),
    ),
  );
const both = overrides(/:root:not\(\[data-scheme\]\)/);
const darkOnly = overrides(/:root:not\(\[data-scheme\]\)\[data-theme="dark"\]/);
const defaults = [
  { name: "default light", tokens: { ...daisyTheme("light"), ...both } },
  { name: "default dark", tokens: { ...daisyTheme("dark"), ...both, ...darkOnly } },
];

describe("default scheme contrast (WCAG)", () => {
  it.each(defaults)("$name: every ink reads on its fill at AA", ({ name, tokens }) => {
    const fills = ["primary", "secondary", "accent", "neutral", "info", "success", "warning", "error"];
    const failures = [["base-content", "base-100"], ...fills.map((f) => [`${f}-content`, f])].flatMap(([ink, fill]) => {
      const ratio = contrastRatio(luminanceOf(tokens[ink!]!)!, luminanceOf(tokens[fill!]!)!);
      return ratio < AA ? [`${name}: ${ink} on ${fill} ${ratio.toFixed(2)}:1`] : [];
    });
    expect(failures).toEqual([]);
  });
});

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
