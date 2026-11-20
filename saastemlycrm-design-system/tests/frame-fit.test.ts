import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  boardWidth,
  closeColumn,
  FRAME_TOKENS,
  fluidCss,
  frameSizesAt,
  mainContent,
  room,
  wantsNav,
  ASIDE_OPEN,
  BOARD_THREE_LANES,
  M3_BREAKPOINTS,
  NAV_EXPANDED_FROM,
  NAV_OPEN,
  MAIN_COMFORT,
  MAIN_MIN,
  PAGE_MARGIN,
  openColumn,
  refit,
  type FrameState,
  type Side,
} from "../src/components/base/frame-fit.ts";
import { board, inset } from "../src/components/primitives/layout/algebra.ts";

/**
 * The app frame, proved for every window width the dashboard supports (320px to 3840px, each
 * whole pixel) and every state the frame can reach there: not sampled, every case. The shell makes
 * its decisions through src/components/base/frame-fit.ts, so this is what it does.
 *
 * Reachable states: a resize can bring any state from another width, so each width starts from
 * `refit` of all 32 combinations of open and sheet (more than can really happen, which only makes
 * the proof stronger), with the navigation wanted expanded and not, then follows every open, every
 * close (the shell refits after one, so the navigation may take the room back) and every resize
 * event from there until nothing new appears.
 */

const root = path.resolve(import.meta.dirname, "..");
const read = (f: string) => readFileSync(path.join(root, f), "utf8");

const WIDTHS = Array.from({ length: 3840 - 320 + 1 }, (_, i) => 320 + i);
const SIDES: Side[] = ["start", "end"];
const WANTS = [false, true];
const key = (s: FrameState) => JSON.stringify(s);
const CLOSED: FrameState = { compact: false, navOpen: false, navSheet: false, asideOpen: false, asideSheet: false };

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
    for (const want of WANTS)
      add(
        refit(
          width,
          { compact: compact!, navOpen: navOpen!, navSheet: navSheet!, asideOpen: asideOpen!, asideSheet: asideSheet! },
          sizes,
          want,
        ),
      );
  }
  while (queue.length) {
    const s = queue.pop()!;
    for (const side of SIDES) add(openColumn(side, width, s, sizes));
    for (const want of WANTS) {
      for (const side of SIDES) add(refit(width, closeColumn(side, s), sizes, want));
      add(refit(width, s, sizes, want));
    }
  }
  return [...seen.values()];
}

/** The frame as it starts at `width` when nobody has chosen anything: both columns closed, then fitted. */
const byDefault = (width: number) => refit(width, CLOSED, frameSizesAt(width), wantsNav(null, width));

describe("the frame, for every width and state", () => {
  it("uses the tokens and widths the CSS has", () => {
    const theme = read("src/styles/theme.css");
    for (const [name, f] of Object.entries(FRAME_TOKENS)) expect(theme).toContain(`--frame-${name}: ${fluidCss(f)};`);
    expect(theme).toContain(`--main-min: ${MAIN_MIN}px;`);
    expect(theme).toContain(`--main-comfort: ${MAIN_COMFORT}px;`);
    expect(theme).toContain(`--frame-nav: ${NAV_OPEN / 16}rem;`);
    expect(theme).toContain(`--frame-aside: ${ASIDE_OPEN / 16}rem;`);
    const frame = read("src/components/primitives/layout/frame.ts");
    // The columns take exactly the room the model gives them: each its rail, or its open width.
    expect(frame).toContain(`false: "w-(--frame-rail) `);
    expect(frame).toContain(`{ side: "start", push: true, class: "w-(--frame-nav)" }`);
    expect(frame).toContain(`{ side: "end", push: true, class: "w-(--frame-aside)" }`);
    // A compact frame: no edges or gaps, the navigation's rail is the icon rail, and the merged
    // side panel takes no room.
    expect(frame).toContain(`compact: { true: "[--frame-edge:0px] [--frame-gap:0px]" }`);
    expect(frame).toContain(`merged: { true: "w-0!", false: "" }`);
    // The board's three lanes and the page's margin, as the model has them.
    expect(board.lanes).toContain(`@min-[${BOARD_THREE_LANES / 16}rem]/board:grid-cols-3`);
    expect(inset.page).toContain(`clamp(1rem,3cqi,${PAGE_MARGIN / 16}rem)`);
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
    expect(edge).toBe(456);
    // Every reachable state at a width agrees on it.
    for (const width of WIDTHS)
      for (const s of reachable(width)) expect(s.compact, `${width}px ${key(s)}`).toBe(width <= edge);
  });

  it("settles: a resize event that changes nothing changes nothing", () => {
    const problems: string[] = [];
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width))
        for (const want of WANTS) {
          const once = refit(width, s, sizes, want);
          const twice = refit(width, once, sizes, want);
          if (key(once) !== key(twice)) problems.push(`${width}px ${key(s)} want ${want}`);
        }
    }
    expect(problems.slice(0, 5)).toEqual([]);
  });

  it("keeps the side panel's rail on the end side outside compact, and merges it into the one rail in compact", () => {
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width)) {
        const where = `${width}px ${key(s)}`;
        const end = room("end", s.asideOpen, s.asideSheet, s.compact, sizes);
        const start = room("start", s.navOpen, s.navSheet, s.compact, sizes);
        if (s.compact) {
          // One rail, on the start side, the fluid icon rail; nothing on the end side.
          expect(end, where).toBe(0);
          expect(start, where).toBe(sizes.rail);
          // Both columns open only as sheets (the merged side panel has no room to push from).
          expect(s.navOpen && !s.navSheet, where).toBe(false);
          expect(s.asideOpen && !s.asideSheet, where).toBe(false);
        } else {
          // The side panel's rail (or the panel, pushing) is on the end side; the navigation's rail (or its list) on the start.
          expect(end, where).toBe(s.asideOpen && !s.asideSheet ? ASIDE_OPEN : sizes.rail);
          expect(start, where).toBe(s.navOpen && !s.navSheet ? NAV_OPEN : sizes.rail);
          expect(sizes.rail, where).toBeGreaterThanOrEqual(48);
        }
      }
    }
  });

  it("opens each column beside the page when the page keeps its comfort width, else as a sheet", () => {
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      for (const s of reachable(width))
        for (const side of SIDES) {
          const next = openColumn(side, width, s, sizes);
          const where = `${width}px ${side} from ${key(s)}`;
          const [open, sheet] = side === "start" ? [next.navOpen, next.navSheet] : [next.asideOpen, next.asideSheet];
          expect(open, where).toBe(true);
          // Pushing leaves the page its comfort width (it may have closed the other column for it).
          if (!sheet) expect(mainContent(width, next, sizes), where).toBeGreaterThanOrEqual(MAIN_COMFORT);
          else {
            // A sheet only when it couldn't push, even with the other column closed.
            const alone = {
              ...s,
              navOpen: false,
              asideOpen: false,
              [side === "start" ? "navOpen" : "asideOpen"]: true,
            };
            const pushed = { ...alone, navSheet: false, asideSheet: false };
            expect(mainContent(width, pushed, sizes), where).toBeLessThan(MAIN_COMFORT);
            // And it moves nothing: every other part of the state stays.
            expect(next, where).toEqual({
              ...s,
              ...(side === "start" ? { navOpen: true, navSheet: true } : { asideOpen: true, asideSheet: true }),
            });
          }
        }
    }
  });

  it("expands the navigation by default from the first M3 window class that keeps the board's three lanes beside it", () => {
    // The board's width beside the expanded navigation and the side panel's rail, nothing else open.
    const expandedBoard = (width: number) => boardWidth(width, { ...CLOSED, navOpen: true }, frameSizesAt(width));
    // The threshold is derived, not chosen: the first M3 window class from which every width keeps three lanes.
    const first = M3_BREAKPOINTS.find((b) =>
      WIDTHS.filter((w) => w >= b).every((w) => expandedBoard(w) >= BOARD_THREE_LANES),
    );
    expect(first).toBe(NAV_EXPANDED_FROM);
    // The class before it does not (a large window, 1200px): the navigation would cost the board a lane there.
    const before = M3_BREAKPOINTS[M3_BREAKPOINTS.indexOf(NAV_EXPANDED_FROM) - 1]!;
    expect(expandedBoard(before)).toBeLessThan(BOARD_THREE_LANES);

    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      const start = byDefault(width);
      // By default: expanded and pushing from the threshold, the rail below it.
      expect(start.navOpen, `${width}px`).toBe(width >= NAV_EXPANDED_FROM);
      expect(start.navSheet).toBe(false);
      expect(start.asideOpen).toBe(false);
      // From M3's large window class the default frame always gives the board three lanes.
      if (width >= before)
        expect(boardWidth(width, start, sizes), `${width}px`).toBeGreaterThanOrEqual(BOARD_THREE_LANES);
      if (width < NAV_EXPANDED_FROM) continue;
      // The side panel still pushes beside the expanded navigation, without closing it.
      const both = openColumn("end", width, start, sizes);
      expect(both, `${width}px`).toMatchObject({ navOpen: true, navSheet: false, asideOpen: true, asideSheet: false });
      expect(mainContent(width, both, sizes)).toBeGreaterThanOrEqual(MAIN_COMFORT);
    }
  });

  it("does what the person chose for the navigation wherever it fits, and gives it back its room", () => {
    for (const width of WIDTHS) {
      const sizes = frameSizesAt(width);
      // Collapsed by choice: the rail at every width.
      expect(refit(width, CLOSED, sizes, wantsNav(false, width)).navOpen, `${width}px`).toBe(false);
      // Expanded by choice: beside the page exactly when the page keeps its comfort width.
      const expanded = refit(width, CLOSED, sizes, wantsNav(true, width));
      const fits = mainContent(width, { ...CLOSED, navOpen: true }, sizes) >= MAIN_COMFORT;
      expect(expanded.navOpen, `${width}px`).toBe(fits && !expanded.compact);
      // The side panel took its room (it closed the navigation): closing the panel gives it back.
      const withAside = openColumn("end", width, expanded, sizes);
      const after = refit(width, closeColumn("end", withAside), sizes, wantsNav(true, width));
      expect(after.navOpen, `${width}px`).toBe(expanded.navOpen);
    }
  });
});
