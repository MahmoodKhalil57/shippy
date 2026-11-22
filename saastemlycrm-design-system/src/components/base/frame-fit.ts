/**
 * The app frame's room decisions, in tiles (src/components/base/tiles.ts), as pure functions of the
 * window's width: whether the frame is compact, whether the navigation is expanded, and whether an
 * open column pushes the main panel or floats over it as a sheet. `<ui-app-shell>` makes every
 * decision through these, so what `tests/frame-fit.test.ts` proves here, for every window width from
 * 320px to 3840px and every state the frame can reach, is what the shell does.
 *
 * The frame is tiles: the screen is `columnsFor(width)` tiles across (6 at 320px, two more at a
 * time), the header 1 tile high, a closed column (its rail) 1 tile wide, an open one (the navigation,
 * the side panel) `OPEN` = 4. The main panel takes the tiles between them:
 *
 * - never fewer than `MAIN_MIN_TILES` (5), and outside compact never fewer than
 *   `MAIN_COMFORT_TILES` (6), so a pushing column never crushes the page;
 * - the frame is compact (one rail, the side panel's joined to the navigation's, both columns only
 *   as sheets) exactly when both rails would leave the page under its comfort: on 6 tiles;
 * - the navigation is expanded beside the page by default from `NAV_EXPANDED_COLUMNS` tiles (unless
 *   someone collapsed it), with the side panel still pushing beside it.
 */
import { columnsFor, tileWIn } from "./tiles.ts";

/** A closed column (its rail), in tiles. */
export const RAIL = 1;
/** An open column (the navigation, the side panel, their sheets), in tiles. */
export const OPEN = 4;
/** A content sheet (a record over its list), in tiles: the whole screen when that's fewer. */
export const SHEET = 8;
/** The main panel's fewest tiles: what a 320px phone leaves it beside its one rail. */
export const MAIN_MIN_TILES = 5;
/** The tiles a pushing column, or a normal frame, leaves the page. */
export const MAIN_COMFORT_TILES = 6;
/**
 * The screen's tiles from which the navigation is expanded unless someone collapsed it: beside the
 * expanded navigation and the side panel's rail, the page keeps 18 tiles (three widgets of six, about
 * Material 3's 360dp fixed pane each).
 */
export const PAGE_TILES_EXPANDED = 18;
export const NAV_EXPANDED_COLUMNS = OPEN + RAIL + PAGE_TILES_EXPANDED + ((OPEN + RAIL + PAGE_TILES_EXPANDED) % 2);
/** What the main panel takes beside its content: nothing (no border, and its scrollbar isn't drawn). */
export const MAIN_CHROME = 0;

/** What the decisions read: the screen's tiles across and a tile's width. */
export interface FrameSizes {
  cols: number;
  /** A tile's width, px. */
  tile: number;
  /** The main panel's border and scrollbar, px. */
  mainChrome: number;
}

export function frameSizesAt(width: number, scale = 1, mainChrome = MAIN_CHROME): FrameSizes {
  return { cols: columnsFor(width, scale), tile: tileWIn(width, scale), mainChrome };
}

export interface FrameState {
  compact: boolean;
  navOpen: boolean;
  navSheet: boolean;
  asideOpen: boolean;
  asideSheet: boolean;
}

export type Side = "start" | "end";

/**
 * Whether the navigation should be expanded: what the person last chose (`true` expanded it,
 * `false` collapsed it), else expanded from `NAV_EXPANDED_COLUMNS` tiles across.
 */
export function wantsNav(choice: boolean | null | undefined, s: FrameSizes): boolean {
  return choice ?? s.cols >= NAV_EXPANDED_COLUMNS;
}

/** Tiles a column takes: open when it pushes, else its rail (none for the merged side panel). */
export function room(side: Side, open: boolean, sheet: boolean, compact: boolean): number {
  if (open && !sheet) return OPEN;
  return side === "end" && compact ? 0 : RAIL;
}

/** Whether the page keeps its comfort with the columns taking this many tiles. */
export function fits(nav: number, aside: number, s: FrameSizes): boolean {
  return s.cols - nav - aside >= MAIN_COMFORT_TILES;
}

/** Compact when both rails leave the page under its comfort. */
export const isCompact = (s: FrameSizes) => !fits(RAIL, RAIL, s);

/** The main panel's tiles in this state. */
export function mainTiles(st: FrameState, s: FrameSizes): number {
  return (
    s.cols - room("start", st.navOpen, st.navSheet, st.compact) - room("end", st.asideOpen, st.asideSheet, st.compact)
  );
}

/** The main panel's content width in this state, px. */
export const mainContent = (st: FrameState, s: FrameSizes) => mainTiles(st, s) * s.tile - s.mainChrome;

/**
 * Opening a column: it pushes when the page keeps its comfort; failing that, if the other column is
 * pushing and closing it makes room, that one closes; otherwise this one opens as a sheet.
 */
export function openColumn(side: Side, st: FrameState, s: FrameSizes): FrameState {
  const nav = side === "start";
  const other = nav
    ? room("end", st.asideOpen, st.asideSheet, st.compact)
    : room("start", st.navOpen, st.navSheet, st.compact);
  const otherClosed = room(nav ? "end" : "start", false, false, st.compact);
  const pushing = (w: number) => !st.compact && fits(OPEN, w, s);
  const otherPushes = nav ? st.asideOpen && !st.asideSheet : st.navOpen && !st.navSheet;
  if (pushing(other))
    return nav ? { ...st, navOpen: true, navSheet: false } : { ...st, asideOpen: true, asideSheet: false };
  if (otherPushes && pushing(otherClosed))
    return nav
      ? { ...st, navOpen: true, navSheet: false, asideOpen: false }
      : { ...st, asideOpen: true, asideSheet: false, navOpen: false };
  return nav ? { ...st, navOpen: true, navSheet: true } : { ...st, asideOpen: true, asideSheet: true };
}

export function closeColumn(side: Side, st: FrameState): FrameState {
  return side === "start" ? { ...st, navOpen: false } : { ...st, asideOpen: false };
}

/**
 * The window resized, a column closed, or first layout: compact or not; then pushing columns close,
 * side panel first, until the page fits; then the navigation expands beside the page if it's wanted
 * (`wantNav`, from `wantsNav`) and there is room for it.
 */
export function refit(st: FrameState, s: FrameSizes, wantNav = false): FrameState {
  const compact = isCompact(s);
  let { navOpen, navSheet, asideOpen, asideSheet } = st;
  // In compact nothing pushes: an open column is a sheet.
  if (compact) {
    if (navOpen) navSheet = true;
    if (asideOpen) asideSheet = true;
  }
  const nav = () => room("start", navOpen, navSheet, compact);
  const aside = () => room("end", asideOpen, asideSheet, compact);
  if (asideOpen && !asideSheet && !fits(nav(), aside(), s)) asideOpen = false;
  if (navOpen && !navSheet && !fits(nav(), aside(), s)) navOpen = false;
  if (wantNav && !navOpen && !compact && fits(OPEN, aside(), s)) {
    navOpen = true;
    navSheet = false;
  }
  return { compact, navOpen, navSheet, asideOpen, asideSheet };
}
