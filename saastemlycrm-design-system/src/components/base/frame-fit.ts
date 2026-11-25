import { columnsFor, tileWIn } from "./tiles.ts";

export const RAIL = 1;
export const OPEN = 4;
export const SHEET = 8;
export const MAIN_MIN_TILES = 5;
export const MAIN_COMFORT_TILES = 6;
export const PAGE_TILES_EXPANDED = 18;
export const NAV_EXPANDED_COLUMNS = OPEN + RAIL + PAGE_TILES_EXPANDED + ((OPEN + RAIL + PAGE_TILES_EXPANDED) % 2);
export const MAIN_CHROME = 0;

export interface FrameSizes {
  cols: number;
  tile: number;
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

export function wantsNav(choice: boolean | null | undefined, s: FrameSizes): boolean {
  return choice ?? s.cols >= NAV_EXPANDED_COLUMNS;
}

export function room(side: Side, open: boolean, sheet: boolean, compact: boolean): number {
  if (open && !sheet) return OPEN;
  return side === "end" && compact ? 0 : RAIL;
}

export function fits(nav: number, aside: number, s: FrameSizes): boolean {
  return s.cols - nav - aside >= MAIN_COMFORT_TILES;
}

export const isCompact = (s: FrameSizes) => !fits(RAIL, RAIL, s);

export function mainTiles(st: FrameState, s: FrameSizes): number {
  return (
    s.cols - room("start", st.navOpen, st.navSheet, st.compact) - room("end", st.asideOpen, st.asideSheet, st.compact)
  );
}

export const mainContent = (st: FrameState, s: FrameSizes) => mainTiles(st, s) * s.tile - s.mainChrome;

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

export function refit(st: FrameState, s: FrameSizes, wantNav = false): FrameState {
  const compact = isCompact(s);
  let { navOpen, navSheet, asideOpen, asideSheet } = st;
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
