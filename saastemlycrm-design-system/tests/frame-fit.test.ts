import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  closeColumn,
  FRAME_TOKENS,
  fluidCss,
  frameSizesAt,
  mainContent,
  ASIDE_OPEN,
  NAV_OPEN,
  MAIN_COMFORT,
  MAIN_MIN,
  openColumn,
  refit,
  type FrameState,
  type Side,
} from "../src/components/base/frame-fit.ts";

/**
 * The app frame, proved for every window width the dashboard supports (320px to 3840px, each
 * whole pixel) and every state the frame can reach there: not sampled, every case. The shell makes
 * its decisions through src/components/base/frame-fit.ts, so this is what it does.
 *
 * Reachable states: a resize can bring any state from another width, so each width starts from
 * `refit` of all 32 combinations of open and sheet (more than can really happen, which only makes
 * the proof stronger), then follows every open and close from there until nothing new appears.
 */

const root = path.resolve(import.meta.dirname, "..");
const read = (f: string) => readFileSync(path.join(root, f), "utf8");

const WIDTHS = Array.from({ length: 3840 - 320 + 1 }, (_, i) => 320 + i);
const SIDES: Side[] = ["start", "end"];
const key = (s: FrameState) => JSON.stringify(s);

/** Every state the frame can be in at `width`. */
function reachable(width: number): FrameState[] {
  const sizes = frameSizesAt(width);
  const seen = new Map<string, FrameState>();
  const queue: FrameState[] = [];
  const add = (s: FrameState) => {
    if (!seen.has(key(s))) {
      seen.set(key(s), s);
      queue.push(s);
    }
  };
  for (let bits = 0; bits < 32; bits++) {
    const [compact, navOpen, navSheet, asideOpen, asideSheet] = [0, 1, 2, 3, 4].map((b) => !!(bits & (1 << b)));
    add(
      refit(
        width,
        { compact: compact!, navOpen: navOpen!, navSheet: navSheet!, asideOpen: asideOpen!, asideSheet: asideSheet! },
        sizes,
      ),
    );
  }
  while (queue.length) {
    const s = queue.pop()!;
    for (const side of SIDES) {
      add(openColumn(side, width, s, sizes));
      add(closeColumn(side, s));
    }
  }
  return [...seen.values()];
}

describe("the frame, for every width and state", () => {
  it("uses the tokens and widths the CSS has", () => {
    const theme = read("src/styles/theme.css");
    for (const [name, f] of Object.entries(FRAME_TOKENS)) expect(theme).toContain(`--frame-${name}: ${fluidCss(f)};`);
    expect(theme).toContain(`--main-min: ${MAIN_MIN}px;`);
    expect(theme).toContain(`--main-comfort: ${MAIN_COMFORT}px;`);
    const frame = read("src/components/primitives/layout/frame.ts");
    expect(theme).toContain(`--frame-nav: ${NAV_OPEN / 16}rem;`);
    expect(theme).toContain(`--frame-aside: ${ASIDE_OPEN / 16}rem;`);
    expect(frame).toContain(`{ side: "start", push: true, class: "w-(--frame-nav)" }`);
    expect(frame).toContain(`{ side: "end", push: true, class: "w-(--frame-aside)" }`);
  });

  it("never leaves the main panel's content under --main-min, nor under --main-comfort outside compact", () => {
    const problems: string[] = [];
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width)) {
        const main = mainContent(width, s, sizes);
        const floor = s.compact ? MAIN_MIN : MAIN_COMFORT;
        if (main < floor) problems.push(`${width}px ${key(s)}: main ${main.toFixed(1)}px < ${floor}px`);
      }
    }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("is compact exactly below one width", () => {
    const compact = WIDTHS.filter((w) => refit(w, reachable(w)[0]!, frameSizesAt(w)).compact);
    const edge = Math.max(...compact);
    expect(compact).toEqual(WIDTHS.filter((w) => w <= edge));
    expect(edge).toBeGreaterThan(440);
    expect(edge).toBeLessThan(470);
  });
});
