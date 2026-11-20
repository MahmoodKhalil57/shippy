import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  APART,
  CHART_SURFACES,
  CHART_TOKENS,
  EMPHASIS_SURFACES,
  NON_TEXT,
  TURNS,
  apart,
  chartPair,
  chromaOf,
  evalColor,
  inGamut,
  regions,
  surfaceLuminances,
  type Lab,
  type Tokens,
} from "../vite/chart-colors.ts";
import { contrastRatio, labLuminance } from "../vite/contrast.ts";
import { chartRules, defaultPalettes } from "../vite/schemes.ts";

/**
 * The chart palette (`chart-1` … `chart-6`, `chart-muted`; src/styles/theme.css, "charts") in
 * every colour scheme, light and dark: a finite domain, checked whole, with nothing sampled.
 *
 * - **WCAG 1.4.11:** every chart colour has at least 3:1 against every surface it can be drawn
 *   on. In the theme itself: the surface, its five container steps and the primary container
 *   (`CHART_SURFACES`). Inside an emphasis surface (a tinted one; the inverse one, a dark region in
 *   a light theme too): that surface, a card in it and a stat's cell in it (`EMPHASIS_SURFACES`).
 *   The surfaces are computed from the roles as src/styles/theme.css writes them, so a role that
 *   changes is checked as it now is.
 * - **What's measured is what's drawn:** every chart colour is inside sRGB, so no browser maps it
 *   to another colour; and a token is `light-dark(a, b)`, each half checked where `color-scheme`
 *   picks it.
 * - **Neighbours are told apart:** slots next to each other (the pairs that touch in a stack, a
 *   group of bars or a legend) are apart for full colour vision and for red-green colour
 *   blindness (`APART`), and keep enough chroma to read as a hue.
 * - **Nothing is hand-set:** each scheme's tokens are exactly what vite/chart-colors.ts derives
 *   from that scheme's own colours.
 */
const root = path.resolve(import.meta.dirname, "..");
const theme = readFileSync(path.join(root, "src/styles/theme.css"), "utf8");
const rules = chartRules();

const schemesCss = readFileSync(path.join(root, "src/styles/schemes.css"), "utf8");
const declarations = (body: string, prefix: string): Tokens =>
  Object.fromEntries(
    [...body.matchAll(new RegExp(`--${prefix}([\\w-]+):\\s*([^;]+);`, "g"))].map(([, k, v]) => [k!, v!.trim()]),
  );
const blocks = [
  ...schemesCss.matchAll(/(:root(?:\[data-scheme="([^"]+)"\]|:not\(\[data-scheme\]\))[^{]*)\{([^}]*)\}/g),
].map(([, selector, id, body]) => ({
  id: id ?? "default",
  // Each scheme is written three times: light, dark by choice, dark by the system.
  variant: /:not\(\[data-theme\]\)/.test(selector!) ? "system" : /data-theme="dark"/.test(selector!) ? "dark" : "light",
  colours: declarations(body!, "color-"),
  charts: declarations(body!, "chart-"),
}));
const ids = [...new Set(blocks.map((b) => b.id))];
const block = (id: string, variant: string) => blocks.find((b) => b.id === id && b.variant === variant);

interface Scheme {
  id: string;
  light: Tokens;
  dark: Tokens;
  /** Its chart tokens as written: `light-dark(a, b)` each. */
  written: Tokens;
}
const schemes: Scheme[] = ids.map((id) => {
  const base = block(id, "light")!;
  // The default scheme's own colours are daisyUI's themes; schemes.css holds only its chart tokens.
  const palettes = id === "default" ? defaultPalettes() : { light: base.colours, dark: block(id, "dark")!.colours };
  return {
    id,
    ...palettes,
    written: Object.fromEntries(Object.entries(base.charts).map(([k, v]) => [`chart-${k}`, v])),
  };
});

/** One half of a scheme's chart colours, with the regions it is drawn in. */
const halves = schemes.flatMap((s) => {
  const places = regions(s.light, s.dark, rules);
  return (["light", "dark"] as const).map((mode) => ({
    name: `${s.id} ${mode}`,
    places: places[mode],
    colours: Object.fromEntries(
      CHART_TOKENS.map((t): [string, Lab] => {
        const m = /^light-dark\((oklch\([^)]*\)), (oklch\([^)]*\))\)$/.exec(s.written[t] ?? "");
        const lab = m && evalColor(m[mode === "light" ? 1 : 2]!, {}, false);
        if (!lab) throw new Error(`${s.id}: ${t} isn't light-dark(oklch(…), oklch(…)): ${s.written[t]}`);
        return [t, lab];
      }),
    ),
  }));
});
const slots = CHART_TOKENS.filter((t) => t !== "chart-muted");

describe("chart colours in every colour scheme", () => {
  it("covers every scheme in light and dark, and the default scheme", () => {
    expect(ids.length).toBeGreaterThan(30);
    expect(ids).toContain("default");
    for (const id of ids.filter((i) => i !== "default")) {
      // The dark palette is written twice (by choice, by the system): the same colours.
      expect(block(id, "system")!.colours, id).toEqual(block(id, "dark")!.colours);
      // Only the base block holds chart tokens: they follow `color-scheme` on their own.
      expect(Object.keys(block(id, "dark")!.charts), id).toEqual([]);
    }
    expect(halves).toHaveLength(ids.length * 2);
    expect(TURNS).toHaveLength(slots.length);
    // A light palette is light and a dark one dark (what "which half" assumes).
    for (const s of schemes) {
      const lum = (tokens: Tokens, name: string) => labLuminance(evalColor(tokens[name]!, tokens, false)!);
      expect(lum(s.light, "base-100"), s.id).toBeGreaterThan(lum(s.light, "base-content"));
      expect(lum(s.dark, "base-100"), s.id).toBeLessThan(lum(s.dark, "base-content"));
    }
  });

  it("is drawn through tokens that follow the element's colour scheme", () => {
    // The roles point at the generated tokens, unregistered, so `light-dark()` is resolved where
    // the chart is: inside the inverse surface (always a dark region) it's the dark half.
    for (const t of CHART_TOKENS) expect(theme).toContain(`--color-${t}: var(--${t});`);
    expect(theme).not.toMatch(/@property --chart-/);
    expect(theme).toMatch(/@utility surface-inverse \{[^@]*?color-scheme: dark;/);
    expect(theme).toMatch(
      /@utility surface-tinted \{[\s\S]*?:root\[data-theme="dark"\] & \{\s*color-scheme: dark;[\s\S]*?:root:not\(\[data-theme\]\) & \{\s*color-scheme: dark;/,
    );
    // Where each half is drawn, and on which surfaces there.
    const places = regions(schemes[0]!.light, schemes[0]!.dark, rules);
    expect(places.light.map((p) => [p.name, p.dark, p.surfaces])).toEqual([
      ["light", false, CHART_SURFACES],
      ["tinted, in light", false, EMPHASIS_SURFACES],
    ]);
    expect(places.dark.map((p) => [p.name, p.dark, p.surfaces])).toEqual([
      ["dark", true, CHART_SURFACES],
      ["tinted, in dark", true, EMPHASIS_SURFACES],
      ["inverse, in dark", true, EMPHASIS_SURFACES],
      ["inverse, in light", true, EMPHASIS_SURFACES],
    ]);
  });

  it("every chart colour has 3:1 against every surface it is drawn on (WCAG 1.4.11)", () => {
    let checked = 0;
    const failures = halves.flatMap((h) =>
      h.places.flatMap((place) => {
        const surfaces = surfaceLuminances(place, rules);
        return CHART_TOKENS.flatMap((t) =>
          surfaces.flatMap((s, i) => {
            checked++;
            const ratio = contrastRatio(labLuminance(h.colours[t]!), s);
            return ratio < NON_TEXT
              ? [`${h.name}: ${t} on ${place.surfaces[i]} (${place.name}) ${ratio.toFixed(2)}:1`]
              : [];
          }),
        );
      }),
    );
    expect(failures).toEqual([]);
    // Light: 7 surfaces and 3 in a tinted one; dark: 7, and 3 in each of three emphasis regions.
    expect(checked).toBe(ids.length * CHART_TOKENS.length * (7 + 3 + 7 + 3 * 3));
  });

  it("every chart colour is inside sRGB (what's measured is what's drawn)", () => {
    const failures = halves.flatMap((h) =>
      CHART_TOKENS.flatMap((t) => (inGamut(h.colours[t]!) ? [] : [`${h.name}: ${t}`])),
    );
    expect(failures).toEqual([]);
  });

  it("neighbouring series are told apart, with and without red-green colour blindness", () => {
    const failures = halves.flatMap((h) =>
      slots.slice(1).flatMap((t, i) => {
        const d = apart(h.colours[slots[i]!]!, h.colours[t]!);
        return d.normal < APART.normal || d.cvd < APART.cvd
          ? [`${h.name}: ${slots[i]} and ${t} are ${d.normal.toFixed(1)} apart (${d.cvd.toFixed(1)} colour blind)`]
          : [];
      }),
    );
    expect(failures).toEqual([]);
  });

  it("every series colour reads as a hue, and the muted one as a grey", () => {
    const failures = halves.flatMap((h) => [
      ...slots.flatMap((t) => (chromaOf(h.colours[t]!) < 0.07 ? [`${h.name}: ${t} is nearly grey`] : [])),
      ...(chromaOf(h.colours["chart-muted"]!) > 0.03 ? [`${h.name}: chart-muted has a hue`] : []),
    ]);
    expect(failures).toEqual([]);
  });

  it("every scheme's chart colours are the ones derived from its own tokens (run `vpx vite/schemes.ts` otherwise)", () => {
    const stale = schemes.flatMap((s) => {
      const derived = chartPair(s.light, s.dark, rules);
      return CHART_TOKENS.flatMap((t) => {
        const now = `light-dark(${derived.light[t]}, ${derived.dark[t]})`;
        return now === s.written[t] ? [] : [`${s.id}: ${t} is ${s.written[t]}, derived ${now}`];
      });
    });
    expect(stale).toEqual([]);
  });
});

describe("the chart never borrows a status colour", () => {
  it("draws series in the chart palette only", () => {
    const source = readFileSync(path.join(root, "src/components/primitives/data/chart.ts"), "utf8");
    expect(source.match(/(?:text|bg|fill|stroke|border)-(?:success|warning|error|info)\b/g) ?? []).toEqual([]);
    expect(source.match(/text-chart-(?:[1-6]|muted)\b/g)).toHaveLength(CHART_TOKENS.length);
  });
});

describe("the colour reader", () => {
  it("reads the forms the tokens are written in", () => {
    const tokens = { "base-100": "oklch(1 0 0)", "base-content": "oklch(0 0 0)" };
    const L = (css: string, dark = false) => evalColor(css, tokens, dark)![0];
    expect(evalColor("white", tokens, false)).toEqual([1, 0, 0]);
    expect(L("oklch(50% 0 0)")).toBeCloseTo(0.5);
    expect(evalColor("var(--color-base-100)", tokens, false)).toEqual([1, 0, 0]);
    expect(evalColor("light-dark(white, black)", tokens, true)).toEqual([0, 0, 0]);
    // `a, b 10%` is 90% a; `a 16%, b` is 16% a.
    expect(L("color-mix(in oklab, var(--color-base-100), var(--color-base-content) 10%)")).toBeCloseTo(0.9);
    expect(L("color-mix(in oklab, black 16%, white)")).toBeCloseTo(0.84);
    expect(L("color-mix(in oklab, oklch(0.2 0 0), black 22%)")).toBeCloseTo(0.156);
    expect(L("color-mix(in oklab, var(--color-base-content), light-dark(black, white) 60%)", true)).toBeCloseTo(0.6);
    expect(evalColor("rgb(0 0 0)", tokens, false)).toBeNull();
    expect(Object.keys(rules.roles)).toEqual([...CHART_SURFACES]);
    expect(Object.keys(rules.emphasis)).toEqual([
      "inverse-surface",
      "inverse-on-surface",
      "tinted-surface",
      "tinted-on-surface",
    ]);
  });
});
