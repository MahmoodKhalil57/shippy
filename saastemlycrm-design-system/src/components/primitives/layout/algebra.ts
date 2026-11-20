/**
 * The layout algebra: the only place where classes that decide an element's width are written.
 * Every primitive builds its layout from these bundles; the build refuses a width class anywhere
 * else (vite/layout-proof, run by the component stylesheet plugin). Nothing here depends on a
 * screen, on data or on a width: each bundle keeps one invariant by CSS alone, so any tree built
 * from them keeps it too.
 *
 * The invariant, for every box B in the page, at any window width and any text size:
 *   (I1) B's content never sticks out of B: its narrowest layout fits whatever width B has.
 *   (I2) Running text (`text.prose`) gets min(7rem, the room its parent has).
 *   (I3) Padding never leaves a box's content narrower than min(7rem, the box).
 * 7rem is the readable measure (MEASURE): about 14 characters; it scales with the text, so at
 * double text size it's 14rem of space, as Apple's Dynamic Type asks ("horizontally adjacent views
 * may need to stack vertically").
 *
 * The base fact: every word can break (`overflow-wrap: anywhere` on the page, src/index.css), so
 * no text's narrowest width is more than one character, and nothing is held wide by a long word,
 * a URL or a file name. What keeps a column readable is never the length of its words: it's the
 * explicit minimum of `rowFill`, `text.prose` and the grid tracks below.
 *
 * Why each bundle keeps it (CSS facts, each one sentence):
 * - `row`: a wrapping flex line breaks before an item that doesn't fit, so no line is wider than
 *   the row unless one item alone is; no item alone is (every item keeps I1: its minimum is at
 *   most 100%), so the row keeps I1 at any width and any number of items.
 * - `rowFill`: an item with `min-width: min(100%, 7rem)` and basis 7rem is never laid out narrower
 *   than that: when the line can't give it 7rem, the line breaks and it gets a line of its own (I2).
 * - `stack`: a column gives each item the full width (stretch) or its fit-content width, which is
 *   at most the column's (I1).
 * - `grid.fit`: `repeat(auto-fit, minmax(min(100%, X), 1fr))` makes as many columns as fit, each at
 *   least min(100%, X): never wider than the grid (I1). X ≥ 7rem (I2).
 * - `inset`: `padding-inline: min(p, max(0, (100% − 7rem) / 2))`, where 100% is the parent's
 *   content width, which is the box's own on a full-width box (`w-full`, part of the bundle): the
 *   content is W − 2·min(p, (W − 7rem)/2) ≥ min(W, 7rem) (I3), whatever p and however deep.
 * - `pad`: a box sized to its content pads at most 24px a side, so its narrowest width is at most
 *   7rem, and every box holding others is at least that (I3): it fits (I1).
 * - `scrollX`: content wider than the box scrolls inside it (I1); the only bundle where it may.
 * - `fixed`: a fixed size of at most 4rem, the largest leaf (an avatar): below every box I3 allows
 *   for its contents (7rem); fixed sizes above 4rem don't exist.
 * - `text.label` / `text.line`: a label's narrowest width is 0 (its words break, or one line is cut
 *   with an ellipsis), so it never widens its box (I1).
 * - `floating`: a floating panel is at most the window less 1rem each side (I1 for the window).
 * - `container`: a size container sizes itself as if empty (inline-size containment), so it always
 *   takes its parent's full width (`w-full`), or a content-sized parent would collapse it to 0.
 *
 * Classes that can't break the invariant stay free to use anywhere (vite/layout-proof/check.ts):
 * gaps, `w-full`, `max-w-*` (caps), `min-w-0`, `grow`, `flex-1`, `truncate`, `overflow-hidden`,
 * `overflow-x-auto`, `[overflow-wrap:break-word]`, display `block`/`hidden`/`contents`, positioning,
 * alignment, vertical sizes, colour, type and motion.
 */

/** The readable measure (I2, I3). */
export const MEASURE = "7rem";

/** A wrapping row: items that don't fit go to the next line (I1). Gaps (`gap-*`) are free. */
export const row = "flex flex-row flex-wrap max-w-full";
/** A wrapping row, right to left of the reading order (`flex-row-reverse`). */
export const rowReverse = "flex flex-row-reverse flex-wrap max-w-full";

/** The same, inline (a button's icon and label, a tag's): sized to its content, capped at its parent. */
export const inlineRow = "inline-flex flex-row flex-wrap max-w-full";
/** Makes a `row` or `stack` inline: sized to its content, capped at its parent (I1). */
export const inlineFlex = "inline-flex! max-w-full";

/** The item in a row that takes the room: never under min(100%, 7rem); short of it, it wraps (I2). */
export const rowFill = "min-w-[min(100%,7rem)] grow basis-[7rem]";
/**
 * The item in a row that takes the room as one line cut with an ellipsis (a search field's
 * placeholder beside its shortcut keys): its basis is 0, so the row never breaks before it; it
 * gets what its fixed neighbours leave and cuts the rest (I1).
 */
export const rowLine = "min-w-0 flex-1 basis-0 truncate";
/** A row's trailing group: pushed to the end, onto its own line when the row is narrow. */
export const rowEnd = "ms-auto min-w-0 max-w-full";

/** A column (I1). Gaps are free. */
export const stack = "flex flex-col";
/** A column, last item first (`flex-col-reverse`). */
export const stackReverse = "flex flex-col-reverse";

/**
 * A grid with no column template: one implicit column that stretches to the grid, whose items'
 * minimums are small (they keep I1), so it never sticks out (I1). Templates go with it: `grid.*`,
 * or N equal columns behind a container query whose width gives each of them 7rem:
 * `grid-cols-1 @min-[T]:grid-cols-N` with T ≥ 7N + 4(N − 1) rem (the widest gap, 4rem, between
 * each pair) — the proof checks that arithmetic wherever it's written (vite/layout-proof/check.ts).
 */
export const gridBase = "grid";

/** A grid of as many columns as fit, each at least min(100%, X) (I1, I2). */
export const grid = {
  /** 12rem columns (small things: stats, tiles). */
  xs: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]",
  /** 16rem columns. */
  sm: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
  /** 20rem columns (cards, charts, tables). */
  md: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]",
  /** 11rem columns (label and value pairs). */
  pairs: "grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))]",
  /** One column. */
  one: "grid min-w-0 grid-cols-[minmax(0,1fr)]",
} as const;

/**
 * Label beside value when the list's own width has room for both, else above (the container
 * is `container.plain`). At 24rem the value column is 24rem − min(8rem, 40%) − 16px ≥ 7rem at any
 * text size (I2): 9rem ≥ 16px.
 */
export const pairsInline =
  "grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-4 [&_dd]:mb-3 @min-[24rem]:grid-cols-[minmax(min(8rem,40%),max-content)_minmax(0,1fr)] @min-[24rem]:items-baseline @min-[24rem]:gap-y-2 @min-[24rem]:[&_dd]:mb-0";

/**
 * Main part and sidebar: side by side while the main part keeps 30rem beside an 18rem sidebar,
 * else the sidebar wraps under (a `row`). Both are at least min(100%, …) (I1, I2).
 */
export const sidebar = {
  /** The box: a wrapping row (it overrides a grid's display). */
  box: "flex! flex-row flex-wrap max-w-full",
  main: "min-w-[min(100%,30rem)] grow-[999] basis-0",
  side: "min-w-[min(100%,7rem)] grow basis-[18rem]",
} as const;

/**
 * Inline padding that limits itself (I3): `min(p, max(0, (100% − 7rem)/2))` on a full-width box.
 * The keys are the spacing scale; `card` and `page` are the fluid ones.
 */
export const inset = {
  "0": "w-full px-0",
  "0.5": "w-full px-[min(2px,max(0px,calc((100%_-_7rem)/2)))]",
  "1": "w-full px-[min(4px,max(0px,calc((100%_-_7rem)/2)))]",
  "1.5": "w-full px-[min(6px,max(0px,calc((100%_-_7rem)/2)))]",
  "2": "w-full px-[min(8px,max(0px,calc((100%_-_7rem)/2)))]",
  "2.5": "w-full px-[min(10px,max(0px,calc((100%_-_7rem)/2)))]",
  "3": "w-full px-[min(12px,max(0px,calc((100%_-_7rem)/2)))]",
  "4": "w-full px-[min(16px,max(0px,calc((100%_-_7rem)/2)))]",
  "5": "w-full px-[min(20px,max(0px,calc((100%_-_7rem)/2)))]",
  "6": "w-full px-[min(24px,max(0px,calc((100%_-_7rem)/2)))]",
  "8": "w-full px-[min(32px,max(0px,calc((100%_-_7rem)/2)))]",
  "10": "w-full px-[min(40px,max(0px,calc((100%_-_7rem)/2)))]",
  "12": "w-full px-[min(48px,max(0px,calc((100%_-_7rem)/2)))]",
  "16": "w-full px-[min(64px,max(0px,calc((100%_-_7rem)/2)))]",
  /** The page in the main panel: 16px on a phone up to 24px (M3 window margins: compact 16dp, medium and up 24dp). */
  page: "w-full px-[min(clamp(1rem,3cqi,1.5rem),max(0px,calc((100%_-_7rem)/2)))]",
} as const;

/**
 * Inline padding for a box sized to its content (a button, a tag, a chip): plain, at most 24px a
 * side. Such a box's narrowest width is at most 2 × 24px plus its fixed parts (≤ 4rem): 7rem.
 * Every box that holds others is at least min(7rem, …) wide (I3), so it fits (I1). Percentage
 * padding (`inset`) would be wrong here: against a parent sized to its content it comes out 0.
 * The proof allows these only on a box that's sized to its content (inline, `w-fit`, `w-max`, a
 * daisyUI button, badge, key or tab).
 */
export const pad = {
  "0": "px-0",
  "0.5": "px-0.5",
  "1": "px-1",
  "1.5": "px-1.5",
  "2": "px-2",
  "2.5": "px-2.5",
  "3": "px-3",
  "4": "px-4",
  "5": "px-5",
  "6": "px-6",
} as const;

/**
 * Inline padding on one side, limited the same way: it never leaves the content less than
 * min(7rem, the box) (a title clear of a corner icon, a list's indent).
 */
export const padStart = {
  "1": "ps-[min(4px,max(0px,calc(100%_-_7rem)))]",
  "2": "ps-[min(8px,max(0px,calc(100%_-_7rem)))]",
  "3": "ps-[min(12px,max(0px,calc(100%_-_7rem)))]",
  "4": "ps-[min(16px,max(0px,calc(100%_-_7rem)))]",
  "5": "ps-[min(20px,max(0px,calc(100%_-_7rem)))]",
  "6": "ps-[min(24px,max(0px,calc(100%_-_7rem)))]",
  "8": "ps-[min(32px,max(0px,calc(100%_-_7rem)))]",
} as const;
export const padEnd = {
  "1": "pe-[min(4px,max(0px,calc(100%_-_7rem)))]",
  "2": "pe-[min(8px,max(0px,calc(100%_-_7rem)))]",
  "3": "pe-[min(12px,max(0px,calc(100%_-_7rem)))]",
  "4": "pe-[min(16px,max(0px,calc(100%_-_7rem)))]",
  "5": "pe-[min(20px,max(0px,calc(100%_-_7rem)))]",
  "6": "pe-[min(24px,max(0px,calc(100%_-_7rem)))]",
  "8": "pe-[min(32px,max(0px,calc(100%_-_7rem)))]",
} as const;

/**
 * daisyUI's card body padding (`--card-p`): 16px on a phone (M3's compact margin) up to 24px. The
 * body's padding limits itself whatever this says (src/styles/daisy-m3.css, "layout").
 */
export const cardInset = {
  md: "[&>.card-body]:[--card-p:clamp(1rem,4cqi,1.5rem)]",
} as const;

/** Content wider than its box scrolls inside it (a table, a long row of steps). */
export const scrollX = "min-w-0 max-w-full overflow-x-auto";
/**
 * Inside a scroller only: a table's columns keep 10rem each, and the table scrolls sideways when
 * they can't all have it (data/table.ts draws every table inside `scrollX`); a horizontal row of
 * steps keeps 10rem per step (daisyUI's `steps` scroll themselves: `overflow: auto hidden`).
 */
export const scrolled = {
  tableColumns: "[&_:is(th,td)]:min-w-[10rem]",
  steps: "[&>.step]:min-w-[10rem]",
} as const;

/** A fixed square leaf (an icon, a dot, an avatar), at most 4rem. */
export const fixed = {
  "1.5": "size-1.5 shrink-0",
  "2": "size-2 shrink-0",
  "2.5": "size-2.5 shrink-0",
  "3": "size-3 shrink-0",
  "3.5": "size-3.5 shrink-0",
  "4": "size-4 shrink-0",
  "5": "size-5 shrink-0",
  "6": "size-6 shrink-0",
  "7": "size-7 shrink-0",
  "8": "size-8 shrink-0",
  "9": "size-9 shrink-0",
  "10": "size-10 shrink-0",
  "11": "size-11 shrink-0",
  "12": "size-12 shrink-0",
  "14": "size-14 shrink-0",
  "16": "size-16 shrink-0",
} as const;
/** A fixed width leaf (a narrow control, a rail item), at most 4rem. */
export const fixedWidth = {
  "4": "w-4 shrink-0",
  "6": "w-6 shrink-0",
  "8": "w-8 shrink-0",
  "10": "w-10 shrink-0",
  "11": "w-11 shrink-0",
  "12": "w-12 shrink-0",
  "16": "w-16 shrink-0",
} as const;

/** Text. */
export const text = {
  /** Running text: at least min(100%, 7rem) wide (I2); any word breaks (I1). */
  prose: "min-w-[min(100%,7rem)] [overflow-wrap:anywhere]",
  /** A label (a button's, a tag's, a title): any word breaks, so it never widens its box (I1). */
  label: "min-w-0 [overflow-wrap:anywhere]",
  /** One line cut with an ellipsis: narrowest width 0 (I1). */
  line: "min-w-0 truncate",
} as const;

/** A box as wide as its parent allows, up to this width. */
export const cap = {
  xs: "w-full max-w-xs",
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-lg",
  xl: "w-full max-w-xl",
  "2xl": "w-full max-w-2xl",
  "3xl": "w-full max-w-3xl",
  "4xl": "w-full max-w-4xl",
  "5xl": "w-full max-w-5xl",
  "6xl": "w-full max-w-6xl",
  "7xl": "w-full max-w-7xl",
  /** About 65 characters. */
  prose: "w-full max-w-[40rem]",
} as const;

/** A floating panel this wide, at most the window less 1rem each side (I1). */
export const floating = {
  /** Menus: 13rem, 16rem, 18rem (the dropdown's widths). */
  "52": "w-[min(13rem,calc(100vw_-_2rem))]",
  "64": "w-[min(16rem,calc(100vw_-_2rem))]",
  "72": "w-[min(18rem,calc(100vw_-_2rem))]",
  xs: "w-[min(20rem,calc(100vw_-_2rem))]",
  sm: "w-[min(24rem,calc(100vw_-_2rem))]",
  md: "w-[min(26rem,calc(100vw_-_2rem))]",
  lg: "w-[min(32rem,calc(100vw_-_2rem))]",
  /** As wide as its content, at most the window less 1rem each side. */
  fit: "w-max max-w-[calc(100vw_-_2rem)]",
} as const;

/** A size container: always its parent's full width (containment sizes it as if empty). */
export const container = {
  plain: "@container w-full",
  alert: "@container/alert w-full",
  item: "@container/item w-full",
  header: "@container/header w-full",
  axis: "@container w-full",
} as const;

/**
 * The app frame's geometry (layout/frame.ts), sized by the frame tokens (`--frame-*` in
 * src/styles/theme.css). Its room is proved for every window width from 320 to 3840px and every
 * reachable state by src/components/base/frame-fit.ts (tests/frame-fit.test.ts): the main panel's
 * content never drops under `--main-min`, and a column pushes the main panel only when that holds,
 * else it floats as a sheet. Each bundle adds one fact.
 */
export const frame = {
  /** Compact: the frame's edges and gaps are 0 (frame-fit's compact state). */
  compact: "[--frame-edge:0px] [--frame-gap:0px]",
  /** The header's inline padding: the frame's edge, 4px to 12px, on a header as wide as the window (≥ 320px). */
  headerInset: "px-[max(var(--frame-edge),0.25rem)]",
  /** The columns and the main panel side by side, at the widths frame-fit proves fit. */
  body: "flex min-h-0 gap-(--frame-gap) px-(--frame-edge) pb-(--frame-edge)",
  /** A column keeps the width frame-fit gives it: its rail, or its open width while it pushes. */
  column: "group/column shrink-0",
  rail: "w-(--frame-rail)",
  navOpen: "w-(--frame-nav)",
  asideOpen: "w-(--frame-aside)",
  /** The rail's 48px icon pills centred: (rail − 3rem) / 2 a side, and the rail is at least 3rem. */
  railInset: "px-[calc((var(--frame-rail)_-_2.75rem)/2)]",
  /** A panel reaches over the frame's edge: a negative margin the size of its transparent border (net 0). */
  edgeStart: "-ms-(--frame-edge) border-s-(length:--frame-edge)",
  edgeEnd: "-me-(--frame-edge) border-e-(length:--frame-edge)",
  /** The panel in its column: the column plus the edge it reaches over (above). */
  panel: "w-[calc(100%_+_var(--frame-edge))]",
  panelRail: "w-[calc(var(--frame-rail)_+_var(--frame-edge))]",
  /** A sheet floats over the page (`fixed`), capped at the window (`max-w-full` in its class). */
  sheetNav: "w-[calc(var(--frame-nav)_+_var(--frame-edge))]",
  sheetAside: "w-[calc(var(--frame-aside)_+_var(--frame-edge))]",
  /** The main panel's column: never narrower than its content's floor, which frame-fit keeps. */
  center: "min-w-[calc(var(--main-min)_+_0.25rem)]",
  /** The page footer under the main panel keeps its height (in a column) and reaches over the bottom edge. */
  footer: "-mb-(--frame-edge) shrink-0",
  /** The column's toggle, a 40px icon button, keeps its height in the column. */
  toggle: "shrink-0 group/toggle",
} as const;

/**
 * The board (layout/board.ts, src/components/base/board.ts): a screen's widgets as tiles in
 * lanes. Its lanes are N equal columns behind container queries that give each at least 18rem
 * (n × 18rem + (n − 1) × 1rem: 37, 56, 75rem; the proof checks the arithmetic); a tile's place is
 * its lane and span (`--lane`, `--span`) and its rows (`--row`, `--rows`, 4px each), from the
 * board's placement, which never gives a tile more lanes than the board has (`spanOf`).
 */
export const board = {
  box: "@container/board w-full",
  lanes:
    "grid grid-cols-[minmax(0,1fr)] gap-x-4 @min-[37rem]/board:grid-cols-2 @min-[56rem]/board:grid-cols-3 @min-[75rem]/board:grid-cols-4",
  /** Placed: rows of 4px, the tiles' own gaps in their row spans. Not yet: rows by content, 16px apart. */
  placed: "auto-rows-[4px]",
  unplaced: "gap-y-4",
  tile: "min-w-0 self-start [grid-column:var(--lane)/span_var(--span)] [grid-row:var(--row)/span_var(--rows)]",
} as const;
