export type Lab = [number, number, number];

const oklch = (s: string): Lab | null => {
  const m = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(s);
  if (!m) return null;
  const L = m[1]!.endsWith("%") ? parseFloat(m[1]!) / 100 : parseFloat(m[1]!);
  const C = parseFloat(m[2]!);
  const h = (parseFloat(m[3]!) * Math.PI) / 180;
  return [L, C * Math.cos(h), C * Math.sin(h)];
};

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

export function labLuminance(lab: Lab): number {
  const [R, G, B] = linearRgb(lab);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export const mixOklab = (a: Lab, b: Lab, p: number): Lab => [
  a[0] * (1 - p) + b[0] * p,
  a[1] * (1 - p) + b[1] * p,
  a[2] * (1 - p) + b[2] * p,
];

function linearRgb([L, a, b]: Lab): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clip = (v: number) => Math.min(1, Math.max(0, v));
  return [
    clip(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clip(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clip(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

export function luminanceOver(ink: Lab, fill: Lab, alpha: number): number {
  const encode = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  const decode = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const i = linearRgb(ink).map(encode);
  const f = linearRgb(fill).map(encode);
  const [R, G, B] = i.map((v, k) => decode(v * alpha + f[k]! * (1 - alpha)));
  return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!;
}

export const luminanceOf = (css: string) => {
  const lab = parseOklab(css);
  return lab ? labLuminance(lab) : null;
};

export const contrastRatio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export const AA = 4.5;

export const LIGHT_INK = "oklch(0.985 0 0)";
export const DARK_INK = "oklch(0.21 0.006 285)";

export function readableInk(ink: string, fill: string): string {
  const f = luminanceOf(fill);
  const i = luminanceOf(ink);
  if (f == null || i == null || contrastRatio(i, f) >= AA) return ink;
  const light = contrastRatio(luminanceOf(LIGHT_INK)!, f);
  const dark = contrastRatio(luminanceOf(DARK_INK)!, f);
  const best = light >= dark ? LIGHT_INK : DARK_INK;
  const own = contrastRatio(i, f);
  return Math.max(light, dark) >= AA || Math.max(light, dark) >= own * 1.3 ? best : ink;
}
