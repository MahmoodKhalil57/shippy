import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  closeColumn,
  frameSizesAt,
  mainTiles,
  room,
  wantsNav,
  MAIN_COMFORT_TILES,
  MAIN_MIN_TILES,
  NAV_EXPANDED_COLUMNS,
  OPEN,
  PAGE_TILES_EXPANDED,
  RAIL,
  openColumn,
  refit,
  type FrameState,
  type Side,
} from "../src/components/base/frame-fit.ts";
import { MIN_COLUMNS } from "../src/components/base/tiles.ts";

/**
 * The app frame in tiles, proved for every window width the dashboard supports (320px to 3840px,
 * each whole pixel, at text sizes 1× and 1.25×) and every state the frame can reach there: not
 * sampled, every case. The shell makes its decisions through src/components/base/frame-fit.ts, so
 * this is what it does.
 *
 * Reachable states: a resize can bring any state from another width, so each width starts from
 * `refit` of all 32 combinations of open and sheet, with the navigation wanted expanded and not,
 * then follows every open, every close (the shell refits after one) and every resize from there
 * until nothing new appears.
 */
const root = path.resolve(import.meta.dirname, "..");
const read = (f: string) => readFileSync(path.join(root, f), "utf8");

const WIDTHS = Array.from({ length: 3840 - 320 + 1 }, (_, i) => 320 + i);
const SCALES = [1, 1.25];
const SIDES: Side[] = ["start", "end"];
const WANTS = [false, true];
const key = (s: FrameState) => JSON.stringify(s);
const CLOSED: FrameState = { compact: false, navOpen: false, navSheet: false, asideOpen: false, asideSheet: false };

/** Every state the frame can be in on `cols` tiles (the decisions read nothing else). */
const memo = new Map<number, FrameState[]>();
function reachable(width: number, scale: number): FrameState[] {
  const sizes = frameSizesAt(width, scale);
  const hit = memo.get(sizes.cols);
  if (hit) return hit;
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
    for (const want of WANTS)
      add(
        refit(
          { compact: compact!, navOpen: navOpen!, navSheet: navSheet!, asideOpen: asideOpen!, asideSheet: asideSheet! },
          sizes,
          want,
        ),
      );
  }
  while (queue.length) {
    const s = queue.pop()!;
    for (const side of SIDES) add(openColumn(side, s, sizes));
    for (const want of WANTS) {
      for (const side of SIDES) add(refit(closeColumn(side, s), sizes, want));
      add(refit(s, sizes, want));
    }
  }
  const out = [...seen.values()];
  memo.set(sizes.cols, out);
  return out;
}

describe("the frame, in tiles, for every width and state", () => {
  it("uses the tile tokens: a rail is 1 tile, an open column 4, the header 1 tile high", () => {
    const theme = read("src/styles/theme.css");
    expect(theme).toContain(`--frame-rail: calc(${RAIL} * var(--tile-w));`);
    expect(theme).toContain(`--frame-nav: calc(${OPEN} * var(--tile-w));`);
    expect(theme).toContain(`--frame-aside: calc(${OPEN} * var(--tile-w));`);
    expect(theme).toContain(`--frame-header: var(--tile-h);`);
    const frame = read("src/components/primitives/layout/frame.ts");
    // Each width plus the drag while its edge is dragged (0 otherwise).
    expect(frame).toContain(
      `{ side: "start", push: false, class: "w-[calc(var(--frame-rail)_+_var(--drag-start,0px))]" }`,
    );
    expect(frame).toContain(
      `{ side: "start", push: true, class: "w-[calc(var(--frame-nav)_+_var(--drag-start-o,0px))]" }`,
    );
    expect(frame).toContain(
      `{ side: "end", push: true, class: "w-[calc(var(--frame-aside)_+_var(--drag-end-o,0px))]" }`,
    );
    expect(frame).toContain(`merged: { true: "w-0!", false: "" }`);
  });

  it("never leaves the main panel under 5 tiles, nor under 6 outside compact", () => {
    const problems: string[] = [];
    for (const scale of SCALES)
      for (const width of WIDTHS) {
        const sizes = frameSizesAt(width, scale);
        for (const s of reachable(width, scale)) {
          const main = mainTiles(s, sizes);
          const floor = s.compact ? MAIN_MIN_TILES : MAIN_COMFORT_TILES;
          if (main < floor) problems.push(`${width}px ×${scale} ${key(s)}: ${main} tiles`);
        }
      }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("is compact exactly on the fewest tiles", () => {
    for (const scale of SCALES)
      for (const width of WIDTHS) {
        const sizes = frameSizesAt(width, scale);
        for (const s of reachable(width, scale))
          expect(s.compact, `${width}px ${key(s)}`).toBe(sizes.cols === MIN_COLUMNS);
      }
  });

  it("settles: a resize that changes nothing changes nothing", () => {
    for (const width of [320, 500, 900, 1280, 1600, 2560]) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width, 1))
        for (const want of WANTS) {
          const once = refit(s, sizes, want);
          expect(key(refit(once, sizes, want)), `${width}px ${key(s)}`).toBe(key(once));
        }
    }
  });

  it("keeps the side panel's rail on the end side outside compact, and merges it in compact", () => {
    for (const width of WIDTHS) {
      for (const s of reachable(width, 1)) {
        const where = `${width}px ${key(s)}`;
        const end = room("end", s.asideOpen, s.asideSheet, s.compact);
        const start = room("start", s.navOpen, s.navSheet, s.compact);
        if (s.compact) {
          expect(end, where).toBe(0);
          expect(start, where).toBe(RAIL);
          expect(s.navOpen && !s.navSheet, where).toBe(false);
          expect(s.asideOpen && !s.asideSheet, where).toBe(false);
        } else {
          expect(end, where).toBe(s.asideOpen && !s.asideSheet ? OPEN : RAIL);
          expect(start, where).toBe(s.navOpen && !s.navSheet ? OPEN : RAIL);
        }
      }
    }
  });

  it("opens each column beside the page when the page keeps its comfort, else as a sheet that moves nothing", () => {
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width, 1))
        for (const side of SIDES) {
          const next = openColumn(side, s, sizes);
          const where = `${width}px ${side} from ${key(s)}`;
          const [open, sheet] = side === "start" ? [next.navOpen, next.navSheet] : [next.asideOpen, next.asideSheet];
          expect(open, where).toBe(true);
          if (!sheet) expect(mainTiles(next, sizes), where).toBeGreaterThanOrEqual(MAIN_COMFORT_TILES);
          else
            expect(next, where).toEqual({
              ...s,
              ...(side === "start" ? { navOpen: true, navSheet: true } : { asideOpen: true, asideSheet: true }),
            });
        }
    }
  });

  it("expands the navigation by default from the tiles that keep the page 18 beside it", () => {
    expect(NAV_EXPANDED_COLUMNS % 2).toBe(0);
    expect(NAV_EXPANDED_COLUMNS - OPEN - RAIL).toBeGreaterThanOrEqual(PAGE_TILES_EXPANDED);
    expect(NAV_EXPANDED_COLUMNS - 2 - OPEN - RAIL).toBeLessThan(PAGE_TILES_EXPANDED);
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      const start = refit(CLOSED, sizes, wantsNav(null, sizes));
      expect(start.navOpen, `${width}px`).toBe(sizes.cols >= NAV_EXPANDED_COLUMNS);
      if (!start.navOpen) continue;
      expect(mainTiles(start, sizes)).toBeGreaterThanOrEqual(PAGE_TILES_EXPANDED);
      // The side panel still pushes beside the expanded navigation.
      const both = openColumn("end", start, sizes);
      expect(both, `${width}px`).toMatchObject({ navOpen: true, navSheet: false, asideOpen: true, asideSheet: false });
    }
  });

  it("does what the person chose for the navigation wherever it fits", () => {
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      expect(refit(CLOSED, sizes, wantsNav(false, sizes)).navOpen, `${width}px`).toBe(false);
      const expanded = refit(CLOSED, sizes, wantsNav(true, sizes));
      const fits = mainTiles({ ...CLOSED, navOpen: true }, sizes) >= MAIN_COMFORT_TILES;
      expect(expanded.navOpen, `${width}px`).toBe(fits && !expanded.compact);
      const withAside = openColumn("end", expanded, sizes);
      const after = refit(closeColumn("end", withAside), sizes, wantsNav(true, sizes));
      expect(after.navOpen, `${width}px`).toBe(expanded.navOpen);
    }
  });
});
