/**
 * WCAG contrast for design tokens, in Node (no DOM): OKLCH colours (as tweakcn and our schemes
 * write them, including `color-mix(in oklab, <oklch>, black N%)`) to relative luminance.
 * Used by plugins/schemes.ts to keep every `*-content` token readable on its colour, and by
 * tests/contrast.test.ts to check every scheme's text pairs.
 */

type Lab = [number, number, number];

const oklch = (s: string): Lab | null => {
  const m = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(s);
  if (!m) return null;
  const L = m[1]!.endsWith("%") ? parseFloat(m[1]!) / 100 : parseFloat(m[1]!);
  const C = parseFloat(m[2]!);
  const h = (parseFloat(m[3]!) * Math.PI) / 180;
  return [L, C * Math.cos(h), C * Math.sin(h)];
};

/** An OKLab colour from `oklch(…)` or `color-mix(in oklab, oklch(…), black|white N%)`. */
export function parseOklab(css: string): Lab | null {
  const mix = /color-mix\(\s*in oklab,\s*(oklch\([^)]*\)),\s*(black|white)\s+([\d.]+)%\s*\)/.exec(css);
  if (mix) {
    const base = oklch(mix[1]!);
    if (!base) return null;
    const p = parseFloat(mix[3]!) / 100;
    const target: Lab = mix[2] === "black" ? [0, 0, 0] : [1, 0, 0];
    return [base[0] * (1 - p) + target[0] * p, base[1] * (1 - p), base[2] * (1 - p)];
  }
  return oklch(css);
}

/** Relative luminance (WCAG) of an OKLab colour, gamut-clipped to sRGB. */
export function labLuminance([L, a, b]: Lab): number {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (v: number) => Math.min(1, Math.max(0, v));
  const R = clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const G = clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const B = clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export const luminanceOf = (css: string) => {
  const lab = parseOklab(css);
  return lab ? labLuminance(lab) : null;
};

export const contrastRatio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** WCAG AA for normal text. */
export const AA = 4.5;

/** Near-white and near-black inks to fall back on when a scheme's own ink is unreadable. */
export const LIGHT_INK = "oklch(0.985 0 0)";
export const DARK_INK = "oklch(0.21 0.006 285)";

/**
 * `ink` if it reads on `fill` at AA; otherwise near-white or near-black, whichever reads better.
 * (Returns `ink` unchanged when either colour can't be parsed.)
 */
export function readableInk(ink: string, fill: string): string {
  const f = luminanceOf(fill);
  const i = luminanceOf(ink);
  if (f == null || i == null || contrastRatio(i, f) >= AA) return ink;
  const light = contrastRatio(luminanceOf(LIGHT_INK)!, f);
  const dark = contrastRatio(luminanceOf(DARK_INK)!, f);
  const best = light >= dark ? LIGHT_INK : DARK_INK;
  const own = contrastRatio(i, f);
  // Only override the scheme's choice when that actually reaches AA, or is clearly better (a
  // mid-tone fill can't reach 4.5:1 with either; then the designer's ink stays).
  return Math.max(light, dark) >= AA || Math.max(light, dark) >= own * 1.3 ? best : ink;
}
