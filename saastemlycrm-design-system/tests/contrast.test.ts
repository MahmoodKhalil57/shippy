import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  AA,
  contrastRatio,
  labLuminance,
  luminanceOf,
  luminanceOver,
  mixOklab,
  parseOklab,
  readableInk,
  type Lab,
} from "../vite/contrast.ts";
import { INK_ON } from "../vite/schemes.ts";
import { createRequire } from "node:module";

/** daisyUI, wherever the package manager installed it. */
const daisyDir = path.dirname(createRequire(import.meta.url).resolve("daisyui/package.json"));

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
      ...readFileSync(path.join(daisyDir, `theme/${name}.css`), "utf8").matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g),
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

/**
 * The emphasis surfaces (`surface-inverse`, `surface-tinted` in src/styles/theme.css; a tile's
 * `emphasis`, a stat's `main`): each re-scopes the surface and the ink every colour role is derived
 * from, so what is drawn inside reads the same roles as anywhere else. Here every role a component
 * can put text in is computed inside each surface, for every colour scheme, light and dark, with
 * the percentages read from theme.css itself: nothing is sampled.
 */
describe("emphasis surfaces keep every text role readable (WCAG AA), in every scheme", () => {
  const theme = readFileSync(path.resolve(import.meta.dirname, "../src/styles/theme.css"), "utf8");
  /** A percentage from theme.css (the pattern's one group), as a fraction; the test fails if the rule changed shape. */
  const pct = (pattern: RegExp) => {
    const m = pattern.exec(theme);
    if (!m) throw new Error(`theme.css no longer matches ${pattern}`);
    return Number(m[1]) / 100;
  };
  const both = (pattern: RegExp): { light: number; dark: number } => {
    const m = pattern.exec(theme);
    if (!m) throw new Error(`theme.css no longer matches ${pattern}`);
    return { light: Number(m[1]) / 100, dark: Number(m[2]) / 100 };
  };
  /** A `surface-container-*` step: how far the surface is mixed towards the ink, in light and in dark. */
  const step = (role: string) => {
    const mix = String.raw`color-mix\(in oklab, var\(--color-base-100\), var\(--color-base-content\) (\d+)%\)`;
    return both(new RegExp(String.raw`--color-${role}: light-dark\(\s*${mix},\s*${mix}`));
  };
  const P = {
    inverseDeepen: pct(
      /--inverse-surface: light-dark\(\s*color-mix\(in oklab, var\(--color-base-content\), black (\d+)%\)/,
    ),
    inverseRaise: pct(
      /--inverse-surface: light-dark\([^;]*,\s*color-mix\(in oklab, var\(--color-base-100\), var\(--color-base-content\) (\d+)%\)/,
    ),
    tint: pct(/--tinted-surface: color-mix\(in oklab, var\(--color-primary\) (\d+)%, var\(--color-base-100\)\)/),
    tintedInk: pct(
      /--tinted-on-surface: color-mix\(in oklab, var\(--color-base-content\), light-dark\(black, white\) (\d+)%\)/,
    ),
    variant: pct(/--color-on-surface-variant: color-mix\(in oklab, var\(--color-base-content\) (\d+)%, transparent\)/),
    ink: pct(/--color-primary-ink: color-mix\(in oklab, var\(--color-primary\) (\d+)%, var\(--color-base-content\)\)/),
    container: pct(
      /--color-primary-container: color-mix\(in oklab, var\(--color-primary\) (\d+)%, var\(--color-base-100\)\)/,
    ),
    lowestDark: pct(
      /--color-surface-container-lowest: light-dark\(\s*var\(--color-base-100\),\s*color-mix\(in oklab, var\(--color-base-100\), black (\d+)%\)/,
    ),
  };
  const STEPS = ["surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"];
  const steps = STEPS.map((role) => ({ role, ...step(role) }));
  const BLACK: Lab = [0, 0, 0];
  const WHITE: Lab = [1, 0, 0];
  /** The tones a block can name (`Tone` in src/app/widgets/schema.ts; neutral is the ink itself). */
  const COLOURS = ["primary", "info", "success", "warning", "error"];

  /** Every palette: each scheme in light and dark (info, success and warning are daisyUI's own), and the default one. */
  const palettes = [
    ...blocks.map((b) => ({
      name: b.name,
      dark: b.name.endsWith(" dark"),
      tokens: { ...daisyTheme(b.name.endsWith(" dark") ? "dark" : "light"), ...b.tokens } as Record<string, string>,
    })),
    ...defaults.map((d) => ({
      name: d.name,
      dark: d.name.endsWith(" dark"),
      tokens: d.tokens as Record<string, string>,
    })),
  ];

  /**
   * What fails AA inside a region with this surface and ink: `on-surface` and `on-surface-variant`
   * on the surface and on each `surface-container-*` step (at the step sizes of `scheme`), and each
   * coloured ink on the surface, on `surface-container` and on its own container.
   */
  function failures(where: string, tokens: Record<string, string>, fill: Lab, ink: Lab, scheme: "light" | "dark") {
    const out: string[] = [];
    const check = (what: string, inkLum: number, on: Lab) => {
      const ratio = contrastRatio(inkLum, labLuminance(on));
      if (ratio < AA) out.push(`${where}: ${what} ${ratio.toFixed(2)}:1`);
    };
    const surfaces: [string, Lab][] = [
      ["surface", fill],
      ["surface-container-lowest", scheme === "dark" ? mixOklab(fill, BLACK, P.lowestDark) : fill],
      ...steps.map((s): [string, Lab] => [s.role, mixOklab(fill, ink, s[scheme])]),
    ];
    for (const [name, surface] of surfaces) {
      check(`on-surface on ${name}`, labLuminance(ink), surface);
      check(`on-surface-variant on ${name}`, luminanceOver(ink, surface, P.variant), surface);
    }
    const container = surfaces.find(([n]) => n === "surface-container")![1];
    for (const c of COLOURS) {
      const colour = parseOklab(tokens[c] ?? "");
      if (!colour) throw new Error(`${where}: no ${c}`);
      const coloured = labLuminance(mixOklab(ink, colour, P.ink));
      check(`${c}-ink on surface`, coloured, fill);
      check(`${c}-ink on surface-container`, coloured, container);
      check(`${c}-ink on ${c}-container`, coloured, mixOklab(fill, colour, P.container));
    }
    return out;
  }

  it("reads the rules from theme.css", () => {
    expect(palettes.length).toBeGreaterThan(100);
    expect(steps.map((s) => [s.light, s.dark])).toEqual([
      [0.03, 0.04],
      [0.05, 0.07],
      [0.07, 0.11],
      [0.1, 0.15],
    ]);
    expect(P.variant).toBe(0.8);
    // The schemes the two surfaces compute their steps in (what the cases below assume).
    const rule = (name: string) =>
      new RegExp(String.raw`@utility ${name} \{[^@]*?color-scheme: (\w+);`).exec(theme)?.[1];
    expect(rule("surface-inverse")).toBe("dark");
    expect(rule("surface-tinted")).toBe("light");
    expect(theme).toMatch(
      /@utility surface-tinted \{[\s\S]*?:root\[data-theme="dark"\] & \{\s*color-scheme: dark;[\s\S]*?:root:not\(\[data-theme\]\) & \{\s*color-scheme: dark;/,
    );
  });

  it("surface-inverse: the deepened ink in light themes, the raised surface in dark ones", () => {
    const bad = palettes.flatMap(({ name, dark, tokens }) => {
      const base = parseOklab(tokens["base-100"]!)!;
      const content = parseOklab(tokens["base-content"]!)!;
      const fill = dark ? mixOklab(base, content, P.inverseRaise) : mixOklab(content, BLACK, P.inverseDeepen);
      // The inverse surface is a dark region in either theme (`color-scheme: dark`).
      return failures(`${name}, inverse`, tokens, fill, dark ? WHITE : base, "dark");
    });
    expect([...new Set(bad)]).toEqual([]);
  });

  it("surface-tinted: the primary container with a strengthened ink", () => {
    const bad = palettes.flatMap(({ name, dark, tokens }) => {
      const base = parseOklab(tokens["base-100"]!)!;
      const content = parseOklab(tokens["base-content"]!)!;
      const fill = mixOklab(base, parseOklab(tokens.primary!)!, P.tint);
      const ink = mixOklab(content, dark ? WHITE : BLACK, P.tintedInk);
      // A tinted surface keeps the theme's own steps wherever it sits (it pins its `color-scheme`).
      return failures(`${name}, tinted`, tokens, fill, ink, dark ? "dark" : "light");
    });
    expect([...new Set(bad)]).toEqual([]);
  });
});
