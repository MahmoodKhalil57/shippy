/**
 * The app frame's room decisions, as pure functions of the window's width: whether the frame is
 * compact, and whether an open column pushes the main panel or floats over it as a sheet.
 * `<ui-app-shell>` makes every decision through these, so what `tests/frame-fit.test.ts` proves
 * here, for every window width from 320px to 3840px and every state the frame can reach, is what
 * the shell does:
 *
 * - the main panel's content is never narrower than `MAIN_MIN` (258px);
 * - outside compact, it's never narrower than `MAIN_COMFORT` (320px), so a pushing column never
 *   crushes the page;
 * - the frame is compact exactly below one window width (no width where it flips back and forth).
 *
 * What the proof assumes, and its own test checks: the fluid tokens here are the ones in
 * src/styles/theme.css (`fluidCss` renders them as written there), and the open widths are the
 * frame recipes' (`w-72`, `w-80`).
 */

/** A fluid length, `clamp(min, vw + rem, max)`; all lengths in rem (16px), the slope in vw. */
export interface Fluid {
  min: number;
  vw: number;
  rem: number;
  max: number;
}

const REM = 16;

/** As CSS, the way src/styles/theme.css writes it. */
export function fluidCss(f: Fluid): string {
  const rem = f.rem > 0 ? ` + ${f.rem}rem` : f.rem < 0 ? ` - ${-f.rem}rem` : "";
  return `clamp(${f.min}rem, ${f.vw}vw${rem}, ${f.max}rem)`;
}

/** Its size in px in a window `width` px wide. */
export function fluidPx(f: Fluid, width: number): number {
  return Math.min(f.max * REM, Math.max(f.min * REM, (f.vw * width) / 100 + f.rem * REM));
}

/** The frame's fluid tokens (src/styles/theme.css `--frame-*`). */
export const FRAME_TOKENS = {
  /** A closed column: 48px → 96px. */
  rail: { min: 3, vw: 5, rem: 2, max: 6 },
  /** Between columns: 2px → 8px. */
  gap: { min: 0.125, vw: 0.625, rem: 0, max: 0.5 },
  /** To the screen's edge: 2px → 12px. */
  edge: { min: 0.125, vw: 1.042, rem: -0.083, max: 0.75 },
} satisfies Record<string, Fluid>;

/** Open widths (the frame recipes' `w-72`, `w-80`). */
export const NAV_OPEN = 288;
export const ASIDE_OPEN = 320;
/** The main panel's narrowest content box (`--main-min`). */
export const MAIN_MIN = 258;
/** The content width a pushing column, or a normal frame, leaves the page (`--main-comfort`). */
export const MAIN_COMFORT = 320;
/** The most the main panel takes beside its content: its 2×2px border and a 10px scrollbar (src/index.css). */
export const MAIN_CHROME = 14;

/** The sizes the decisions read: the shell passes the live ones, the proof the model's. */
export interface FrameSizes {
  rail: number;
  /** Both gaps and both edges. */
  chrome: number;
  /** The main panel's border and scrollbar. */
  mainChrome: number;
  mainComfort: number;
}

export function frameSizesAt(width: number, mainChrome = MAIN_CHROME): FrameSizes {
  const px = (f: Fluid) => fluidPx(f, width);
  return {
    rail: px(FRAME_TOKENS.rail),
    chrome: 2 * px(FRAME_TOKENS.gap) + 2 * px(FRAME_TOKENS.edge),
    mainChrome,
    mainComfort: MAIN_COMFORT,
  };
}

export interface FrameState {
  compact: boolean;
  navOpen: boolean;
  navSheet: boolean;
  asideOpen: boolean;
  asideSheet: boolean;
}

export type Side = "start" | "end";

/** Room a column takes: its open width when it pushes, else its rail (none for the merged side panel). */
export function room(side: Side, open: boolean, sheet: boolean, compact: boolean, s: FrameSizes): number {
  if (open && !sheet) return side === "start" ? NAV_OPEN : ASIDE_OPEN;
  return side === "end" && compact ? 0 : s.rail;
}

/** Whether the page keeps `mainComfort` with the columns taking this much room. A compact frame has no edges or gaps. */
export function fits(width: number, nav: number, aside: number, compact: boolean, s: FrameSizes): boolean {
  return width >= nav + aside + (compact ? 0 : s.chrome) + s.mainChrome + s.mainComfort;
}

/** Compact when the normal frame (edges, gaps and both rails) leaves the page under `mainComfort`. */
export function isCompact(width: number, s: FrameSizes): boolean {
  return !fits(width, s.rail, s.rail, false, s);
}

/** The main panel's content width in this state. */
export function mainContent(width: number, st: FrameState, s: FrameSizes): number {
  const nav = room("start", st.navOpen, st.navSheet, st.compact, s);
  const aside = room("end", st.asideOpen, st.asideSheet, st.compact, s);
  return width - nav - aside - (st.compact ? 0 : s.chrome) - s.mainChrome;
}

/**
 * Opening a column: it pushes when the page keeps its room; failing that, if the other column is
 * pushing and closing it makes room, that one closes; otherwise this one opens as a sheet.
 */
export function openColumn(side: Side, width: number, st: FrameState, s: FrameSizes): FrameState {
  const nav = side === "start";
  const other = nav
    ? room("end", st.asideOpen, st.asideSheet, st.compact, s)
    : room("start", st.navOpen, st.navSheet, st.compact, s);
  const mine = nav ? NAV_OPEN : ASIDE_OPEN;
  const pushing = (w: number) => (nav ? fits(width, mine, w, st.compact, s) : fits(width, w, mine, st.compact, s));
  const otherPushes = nav ? st.asideOpen && !st.asideSheet : st.navOpen && !st.navSheet;
  if (pushing(other))
    return nav ? { ...st, navOpen: true, navSheet: false } : { ...st, asideOpen: true, asideSheet: false };
  if (otherPushes && pushing(s.rail))
    return nav
      ? { ...st, navOpen: true, navSheet: false, asideOpen: false }
      : { ...st, asideOpen: true, asideSheet: false, navOpen: false };
  return nav ? { ...st, navOpen: true, navSheet: true } : { ...st, asideOpen: true, asideSheet: true };
}

export function closeColumn(side: Side, st: FrameState): FrameState {
  return side === "start" ? { ...st, navOpen: false } : { ...st, asideOpen: false };
}

/** The window resized (or first layout): compact or not, then close pushing columns, side panel first, until the page fits. */
export function refit(width: number, st: FrameState, s: FrameSizes): FrameState {
  const compact = isCompact(width, s);
  let { navOpen, asideOpen } = st;
  const taken = () =>
    room("start", navOpen, st.navSheet, compact, s) + room("end", asideOpen, st.asideSheet, compact, s);
  if (asideOpen && !st.asideSheet && !fits(width, 0, taken(), compact, s)) asideOpen = false;
  if (navOpen && !st.navSheet && !fits(width, 0, taken(), compact, s)) navOpen = false;
  return { ...st, compact, navOpen, asideOpen };
}
