import { contrastRatio, labLuminance } from "./contrast.ts";

export type Lab = [L: number, a: number, b: number];

export const CHART_TOKENS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-muted"] as const;
export const CHART_SURFACES = [
  "surface",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
  "primary-container",
] as const;
export const EMPHASIS_SURFACES = ["surface", "surface-container-low", "surface-container"] as const;

export const NON_TEXT = 3;
const AIM = 3.08;
export const TURNS = [0, 180, 60, 240, 120, 300] as const;
export const APART = { cvd: 8, normal: 15 } as const;
const VIVID = { light: 0.64, dark: 0.66 } as const;
const MOVE = { size: 0.025, count: 7 } as const;
const CHROMA_FLOOR = 0.09;
const GREY = 0.04;
const FALLBACK_HUE = 255;

const splitTop = (s: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") depth--;
    else if (s[i] === "," && depth === 0) {
      parts.push(s.slice(from, i));
      from = i + 1;
    }
  }
  parts.push(s.slice(from));
  return parts.map((p) => p.trim());
};

export function evalColor(css: string, tokens: Record<string, string>, dark: boolean): Lab | null {
  const s = css.trim();
  if (s === "black") return [0, 0, 0];
  if (s === "white") return [1, 0, 0];
  const fn = /^([\w-]+)\(([\s\S]*)\)$/.exec(s);
  if (!fn) return null;
  const body = fn[2]!.trim();
  switch (fn[1]) {
    case "oklch": {
      const m = /^([\d.]+%?)\s+([\d.]+)\s+([\d.]+)$/.exec(body);
      if (!m) return null;
      const L = m[1]!.endsWith("%") ? parseFloat(m[1]!) / 100 : parseFloat(m[1]!);
      const C = parseFloat(m[2]!);
      const h = (parseFloat(m[3]!) * Math.PI) / 180;
      return [L, C * Math.cos(h), C * Math.sin(h)];
    }
    case "var": {
      const name = /^--color-([\w-]+)$/.exec(body)?.[1];
      const value = name ? tokens[name] : undefined;
      return value ? evalColor(value, tokens, dark) : null;
    }
    case "light-dark": {
      const [light, darker] = splitTop(body);
      return light && darker ? evalColor(dark ? darker : light, tokens, dark) : null;
    }
    case "color-mix": {
      const [space, first, second] = splitTop(body);
      if (space !== "in oklab" || !first || !second) return null;
      const part = (p: string) => {
        const m = /^([\s\S]*?)\s+([\d.]+)%$/.exec(p);
        return m && !p.endsWith(")")
          ? { color: m[1]!, pct: parseFloat(m[2]!) / 100 }
          : { color: p, pct: undefined as number | undefined };
      };
      const a = part(first);
      const b = part(second);
      const ca = evalColor(a.color, tokens, dark);
      const cb = evalColor(b.color, tokens, dark);
      if (!ca || !cb) return null;
      const pa = a.pct ?? (b.pct === undefined ? 0.5 : 1 - b.pct);
      const pb = b.pct ?? 1 - pa;
      const wa = pa / (pa + pb);
      return [0, 1, 2].map((i) => ca[i]! * wa + cb[i]! * (1 - wa)) as Lab;
    }
    default:
      return null;
  }
}

const lch = (L: number, C: number, h: number): Lab => {
  const r = (h * Math.PI) / 180;
  return [L, C * Math.cos(r), C * Math.sin(r)];
};
export const chromaOf = ([, a, b]: Lab) => Math.hypot(a, b);
export const hueOf = ([, a, b]: Lab) => ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

export function linearRgb([L, a, b]: Lab): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export const inGamut = (lab: Lab) => linearRgb(lab).every((v) => v >= -1e-4 && v <= 1 + 1e-4);

const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;
const clip = (v: number) => Math.min(1, Math.max(0, v));
const labOfLinear = ([r, g, b]: number[]): Lab => {
  const l = Math.cbrt(0.4122214708 * r! + 0.5363325363 * g! + 0.0514459929 * b!);
  const m = Math.cbrt(0.2119034982 * r! + 0.6806995451 * g! + 0.1073969566 * b!);
  const s = Math.cbrt(0.0883024619 * r! + 0.2817188376 * g! + 0.6299787005 * b!);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
export function simulate(lab: Lab, kind: keyof typeof MACHADO): Lab {
  const rgb = linearRgb(lab).map(clip);
  return labOfLinear(MACHADO[kind].map((row) => clip(row[0] * rgb[0]! + row[1] * rgb[1]! + row[2] * rgb[2]!)));
}
export const distance = (a: Lab, b: Lab) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100;
export const apart = (a: Lab, b: Lab) => ({
  normal: distance(a, b),
  cvd: Math.min(
    distance(simulate(a, "protan"), simulate(b, "protan")),
    distance(simulate(a, "deutan"), simulate(b, "deutan")),
  ),
});

const round = (v: number, places: number) => Number(v.toFixed(places));

export type Tokens = Record<string, string>;

export interface ThemeRules {
  roles: Record<string, string>;
  emphasis: Record<(typeof EMPHASIS)[number], string>;
}
const EMPHASIS = ["inverse-surface", "inverse-on-surface", "tinted-surface", "tinted-on-surface"] as const;

export function themeRules(themeCss: string): ThemeRules {
  const css = themeCss.replace(/\/\*[\s\S]*?\*\//g, "");
  const read = (name: string) => {
    const m = new RegExp(`${name}:\\s*([^;]+);`).exec(css);
    if (!m) throw new Error(`chart colours: src/styles/theme.css has no ${name}`);
    return m[1]!.replace(/\s+/g, " ").trim();
  };
  return {
    roles: Object.fromEntries(CHART_SURFACES.map((name) => [name, read(`--color-${name}`)])),
    emphasis: Object.fromEntries(EMPHASIS.map((name) => [name, read(`--${name}`)])) as ThemeRules["emphasis"],
  };
}

export interface Region {
  name: string;
  tokens: Tokens;
  dark: boolean;
  surfaces: readonly (typeof CHART_SURFACES)[number][];
}

const written = (lab: Lab) => `oklch(${lab[0].toFixed(6)} ${chromaOf(lab).toFixed(6)} ${hueOf(lab).toFixed(4)})`;

function emphasised(
  name: string,
  tokens: Tokens,
  dark: boolean,
  rules: ThemeRules,
  kind: "inverse" | "tinted",
): Region {
  const surface = evalColor(rules.emphasis[`${kind}-surface`], tokens, dark);
  const ink = evalColor(rules.emphasis[`${kind}-on-surface`], tokens, dark);
  if (!surface || !ink) throw new Error(`chart colours: can't read the ${kind} surface`);
  return {
    name,
    tokens: { ...tokens, "base-100": written(surface), "base-content": written(ink) },
    dark: kind === "inverse" ? true : dark,
    surfaces: EMPHASIS_SURFACES,
  };
}

export function regions(light: Tokens, dark: Tokens, rules: ThemeRules): { light: Region[]; dark: Region[] } {
  return {
    light: [
      { name: "light", tokens: light, dark: false, surfaces: CHART_SURFACES },
      emphasised("tinted, in light", light, false, rules, "tinted"),
    ],
    dark: [
      { name: "dark", tokens: dark, dark: true, surfaces: CHART_SURFACES },
      emphasised("tinted, in dark", dark, true, rules, "tinted"),
      emphasised("inverse, in dark", dark, true, rules, "inverse"),
      emphasised("inverse, in light", light, false, rules, "inverse"),
    ],
  };
}

export function surfaceLuminances(region: Region, rules: ThemeRules): number[] {
  return region.surfaces.map((name) => {
    const lab = evalColor(rules.roles[name], region.tokens, region.dark);
    if (!lab) throw new Error(`chart colours: can't read the surface role ${name}`);
    return labLuminance(lab);
  });
}

export function chartColors(
  tokens: Tokens,
  places: Region[],
  rules: ThemeRules,
  dark: boolean,
): Record<string, string> {
  const surfaces = places.flatMap((place) => surfaceLuminances(place, rules));
  const reads = (lab: Lab, aim: number) => surfaces.every((s) => contrastRatio(labLuminance(lab), s) >= aim);
  const own = ["primary", "accent", "secondary"]
    .map((name) => evalColor(tokens[name] ?? "", tokens, dark))
    .find((c) => c && chromaOf(c) >= GREY);
  const hue = own ? hueOf(own) : FALLBACK_HUE;
  const chroma = Math.min(0.19, Math.max(0.11, own ? chromaOf(own) : 0.15));
  const toward = dark ? 0.004 : -0.004;

  const at = (L: number, h: number, wanted: number): [number, number, number] => {
    let C = wanted;
    while (C > 0 && !inGamut(lch(round(L, 3), round(C, 3), round(h, 1)))) C -= 0.002;
    return [round(L, 3), round(Math.max(0, C), 3), round(h, 1)];
  };
  const edge = (h: number, wanted: number, start: number): number => {
    for (let L = start; L > 0.05 && L < 0.99; L += toward) if (reads(lch(...at(L, h, wanted)), AIM)) return L;
    throw new Error("chart colours: no lightness reads on every surface");
  };
  const css = (c: [number, number, number]) => `oklch(${c[0]} ${c[1]} ${c[2]})`;

  const choices = TURNS.map((turn) => {
    const h = (hue + turn) % 360;
    const from = edge(h, chroma, dark ? VIVID.dark : VIVID.light);
    return Array.from({ length: MOVE.count + 1 }, (_, move) => {
      const color = at(from + move * MOVE.size * Math.sign(toward), h, chroma);
      return { color, lab: lch(...color), move };
    }).filter((c) => c.move === 0 || (c.color[1] >= CHROMA_FLOOR && reads(c.lab, AIM)));
  });
  const settle = (normal: number, cvd: number, reach: number): [number, number, number][] | null => {
    const fits = (a: Lab, b: Lab) => {
      const d = apart(a, b);
      return d.normal >= normal && d.cvd >= cvd;
    };
    let paths = choices[0]!.filter((c) => c.move <= reach).map((c) => ({ cost: c.move, picked: [c] }));
    for (const slot of choices.slice(1))
      paths = slot
        .filter((c) => c.move <= reach)
        .flatMap((c) => {
          const before = paths.filter((p) => fits(p.picked.at(-1)!.lab, c.lab)).sort((x, y) => x.cost - y.cost)[0];
          return before ? [{ cost: before.cost + c.move, picked: [...before.picked, c] }] : [];
        });
    const best = paths.sort((x, y) => x.cost - y.cost)[0];
    return best ? best.picked.map((c) => c.color) : null;
  };
  let picked: [number, number, number][] | null = null;
  for (let normal = APART.normal + 0.5; !picked && normal >= 0; normal -= 2.5)
    for (let cvd = APART.cvd + 0.5; !picked && cvd >= 0; cvd -= 0.5)
      for (let reach = 0; !picked && reach <= MOVE.count; reach++) picked = settle(normal, cvd, reach);
  if (!picked) throw new Error("chart colours: neighbouring slots can't be told apart");

  const out: Record<string, string> = {};
  picked.forEach((color, k) => (out[`chart-${k + 1}`] = css(color)));
  const ink = evalColor(tokens["base-content"] ?? "", tokens, dark);
  const mutedHue = ink && chromaOf(ink) > 0.005 ? hueOf(ink) : hue;
  out["chart-muted"] = css(at(edge(mutedHue, 0.02, dark ? 0.4 : 0.8), mutedHue, 0.02));
  return out;
}

export function chartPair(light: Tokens, dark: Tokens, rules: ThemeRules) {
  const places = regions(light, dark, rules);
  return {
    light: chartColors(light, places.light, rules, false),
    dark: chartColors(dark, places.dark, rules, true),
  };
}
