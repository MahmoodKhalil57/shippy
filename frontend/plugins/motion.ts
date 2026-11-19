/**
 * Material Design 3 motion tokens for CSS, generated from M3's spring physics.
 *
 * M3 motion is spring based: every token is a damping ratio and a stiffness (mass 1). The
 * values below are the **expressive** scheme (M3 Expressive: spatial springs overshoot and
 * settle, i.e. bounce), from Jetpack Compose's generated tokens
 * (`material3/tokens/ExpressiveMotionTokens.kt`, v0_14_0).
 *
 * - `spatial`: things that move or change size or shape (positions, widths, heights).
 * - `effects`: things that change without moving (opacity, colour); damping 1, no overshoot.
 * - `fast` for small components, `default` for most, `slow` for full-screen changes.
 *
 * CSS has no springs, so each one becomes a `linear()` easing that traces the spring's step
 * response (overshoot included), a duration: the time until it stays within {@link SETTLE}
 * of its target, and a settle time: when it is visually done (within {@link SETTLED}), which
 * is when a following step of a sequence can start.
 *
 * Beside the springs, M3's easing and duration tokens (m3.material.io/styles/motion/easing-and-
 * duration/tokens-specs). M3 keeps them for **transitions** (navigating between screens, a component
 * entering or leaving: m3.material.io/styles/motion/transitions), which shouldn't bounce; the
 * springs are for everything else. `emphasized` has no CSS curve in M3 (it's a path of two cubic
 * Béziers), so it becomes a `linear()` easing like the springs.
 *
 * Tailwind's defaults are pointed at the tokens too, so nothing falls back to its own curves: a
 * bare `transition` / `transition-colors` uses the effects spring, and `ease-in` / `ease-out` /
 * `ease-in-out` are M3's standard accelerate / decelerate / standard.
 *
 * Run `vpx plugins/motion.ts` to regenerate `src/styles/motion.css`;
 * tests/motion.test.ts fails while that file is out of date.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

type Point = { x: number; y: number };

export interface Spring {
  damping: number;
  stiffness: number;
}

export const springs = {
  "spatial-fast": { damping: 0.6, stiffness: 800 },
  spatial: { damping: 0.8, stiffness: 380 },
  "spatial-slow": { damping: 0.8, stiffness: 200 },
  "effects-fast": { damping: 1, stiffness: 3800 },
  effects: { damping: 1, stiffness: 1600 },
  "effects-slow": { damping: 1, stiffness: 800 },
} satisfies Record<string, Spring>;

/** M3's easing tokens as cubic Béziers (md.sys.motion.easing.*). */
export const easings = {
  "emphasized-decelerate": [0.05, 0.7, 0.1, 1],
  "emphasized-accelerate": [0.3, 0, 0.8, 0.15],
  standard: [0.2, 0, 0, 1],
  "standard-decelerate": [0, 0, 0, 1],
  "standard-accelerate": [0.3, 0, 1, 1],
  legacy: [0.4, 0, 0.2, 1],
  "legacy-decelerate": [0, 0, 0.2, 1],
  "legacy-accelerate": [0.4, 0, 1, 1],
} satisfies Record<string, [number, number, number, number]>;

type Cubic = [Point, Point, Point, Point];

/**
 * md.sys.motion.easing.emphasized: `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4
 * C 0.208333,0.82 0.25,1 1,1` (two cubic Béziers joined at (0.166666, 0.4)).
 */
export const EMPHASIZED: Cubic[] = [
  [
    { x: 0, y: 0 },
    { x: 0.05, y: 0 },
    { x: 0.133333, y: 0.06 },
    { x: 0.166666, y: 0.4 },
  ],
  [
    { x: 0.166666, y: 0.4 },
    { x: 0.208333, y: 0.82 },
    { x: 0.25, y: 1 },
    { x: 1, y: 1 },
  ],
];

/** M3's duration tokens (md.sys.motion.duration.*), in ms. */
export const durations = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  "extra-long1": 700,
  "extra-long2": 800,
  "extra-long3": 900,
  "extra-long4": 1000,
} satisfies Record<string, number>;

/** Settled once within 0.1% of the distance from the target, e.g. 0.2px of a 200px move. */
export const SETTLE = 0.001;
/** Visually done: within 1% of the distance (2px of a 200px move). */
export const SETTLED = 0.01;
/** Largest gap the `linear()` points may leave between the curve and the spring. */
const TOLERANCE = 0.002;

/** Progress (0 → 1) of a spring released from rest at 0 towards 1, `t` seconds in. */
export function springAt({ damping: z, stiffness }: Spring, t: number): number {
  const w = Math.sqrt(stiffness); // natural frequency, mass 1
  if (z >= 1) return 1 - (1 + w * t) * Math.exp(-w * t); // critically damped
  const wd = w * Math.sqrt(1 - z * z); // damped frequency
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

/** Seconds until the spring stays within `within` (default {@link SETTLE}) of its target. */
export function settleTime(spring: Spring, within = SETTLE): number {
  const step = 0.0001;
  let last = 0;
  for (let t = 0; t < 5; t += step) if (Math.abs(1 - springAt(spring, t)) >= within) last = t;
  return last + step;
}

/** CSS `linear()` easing that follows the spring over its settle time (one stop per line). */
export function springEasing(spring: Spring): string {
  const duration = settleTime(spring);
  const samples = 400;
  return linearEasing(
    Array.from({ length: samples + 1 }, (_, i) => {
      const x = i / samples;
      return { x, y: i === samples ? 1 : springAt(spring, x * duration) };
    }),
  );
}

/** A point on a cubic Bézier at parameter `t`. */
export function bezierAt([a, b, c, d]: Cubic, t: number): Point {
  const u = 1 - t;
  const at = (k: "x" | "y") => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k];
  return { x: at("x"), y: at("y") };
}

/** CSS `linear()` easing that follows a path of cubic Béziers (M3's `emphasized`). */
export function pathEasing(path: Cubic[]): string {
  const samples = 400;
  return linearEasing(
    path.flatMap((segment, i) =>
      Array.from({ length: samples + 1 }, (_, j) => bezierAt(segment, j / samples)).slice(i ? 1 : 0),
    ),
  );
}

/** `linear()` through the fewest of `points` that stay within {@link TOLERANCE} of them. */
function linearEasing(points: Point[]): string {
  const kept = simplify(points);
  const round = (n: number, d: number) => Number(n.toFixed(d));
  return `linear(${kept
    .map((p, i) => (i === 0 || i === kept.length - 1 ? `${p.y}` : `${round(p.y, 4)} ${round(p.x * 100, 2)}%`))
    .map(
      (stop) => `
    ${stop}`,
    )
    .join(",")}
  )`; // one stop per line, as the formatter writes it
}

/** Keeps the fewest points whose straight segments stay within {@link TOLERANCE} (Ramer–Douglas–Peucker). */
function simplify(points: Point[]): Point[] {
  const a = points[0]!;
  const b = points.at(-1)!;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const lineY = a.y + ((b.y - a.y) * (p.x - a.x)) / (b.x - a.x);
    const gap = Math.abs(p.y - lineY);
    if (gap > worst) [worst, index] = [gap, i];
  }
  if (worst <= TOLERANCE) return [a, b];
  return [...simplify(points.slice(0, index + 1)).slice(0, -1), ...simplify(points.slice(index))];
}

/** The generated stylesheet: per token `--ease-*` (a Tailwind `ease-*` utility), `--duration-*` and `--settle-*`. */
export function motionCss(): string {
  const ms = (seconds: number) => `${Math.round(seconds * 1000)}ms`;
  const lines = Object.entries(springs).flatMap(([name, spring]) => [
    `  /* ${name}: damping ${spring.damping}, stiffness ${spring.stiffness} */`,
    `  --ease-${name}: ${springEasing(spring)};`,
    `  --duration-${name}: ${ms(settleTime(spring))};`,
    `  --settle-${name}: ${ms(settleTime(spring, SETTLED))};`,
  ]);
  const bezier = Object.entries(easings).map(
    ([name, [x1, y1, x2, y2]]) => `  --ease-${name}: cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});`,
  );
  const time = Object.entries(durations).map(([name, value]) => `  --duration-${name}: ${value}ms;`);
  return `/* GENERATED by plugins/motion.ts from Material Design 3's motion tokens.
   Do not edit; run \`vpx plugins/motion.ts\`.

   Springs (the motion physics system, expressive scheme): everything that isn't a transition.
     spatial  moves or resizes: position, size, rotation, shape   overshoots, then settles
     effects  changes in place: colour, opacity, shadow, blur      never overshoots
     -fast for small components (buttons, switches, chevrons), default for most, -slow full screen
   Pair a token's easing and duration, e.g.
   \`transition-[width] ease-spatial duration-(--duration-spatial)\`. In a sequence, start
   the next step when the previous one has settled: \`delay-(--settle-spatial)\`.

   Easing and duration: M3 keeps them for transitions (screens changing, a component entering or
   leaving), which shouldn't bounce. Enter on a decelerate curve; exit on an accelerate one, and
   quicker. Emphasized for most, standard for small utility motion. Short durations for small
   utility motion, medium for medium travel, long for large expressive changes, extra-long for
   ambient motion nobody triggered. The patterns themselves are in src/styles/transitions.css. */
@theme static {
${lines.join("\n")}

  /* emphasized: M3's path (two cubic Béziers), traced as linear() */
  --ease-emphasized: ${pathEasing(EMPHASIZED)};
${bezier.join("\n")}
${time.join("\n")}

  /* Tailwind's own curves and default duration, pointed at M3's */
  --default-transition-duration: var(--duration-effects);
  --default-transition-timing-function: var(--ease-effects);
  --ease-in: var(--ease-standard-accelerate);
  --ease-out: var(--ease-standard-decelerate);
  --ease-in-out: var(--ease-standard);
  --animate-spin: spin var(--duration-extra-long4) linear infinite;
  --animate-ping: ping var(--duration-extra-long4) var(--ease-standard-decelerate) infinite;
  --animate-pulse: pulse calc(var(--duration-extra-long4) * 2) var(--ease-standard) infinite;
}
`;
}

export const motionCssPath = path.resolve(import.meta.dirname, "../src/styles/motion.css");

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  writeFileSync(motionCssPath, motionCss());
  console.log(`wrote ${motionCssPath}`);
}
