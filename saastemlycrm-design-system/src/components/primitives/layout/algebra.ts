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
 * - `floating`: a floating panel is whole tiles, at most the window's whole tiles less 1rem each side
 *   (I1 for the window); `floatingFit` its content's width rounded up to tiles, capped the same way.
 * - `tiles` / `tileCap`: a primitive's box N tiles wide, capped at its parent (I1).
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
/**
 * The same, its text wrapping instead (a list headline beside its count; with `text.label`): basis
 * 0, so the row never breaks before it; it gets what its fixed neighbours leave (I1).
 */
export const rowGrow = "min-w-0 flex-1 basis-0";
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
  /**
   * A calendar (a heatmap's days): seven rows, filled a column (a week) at a time, the weeks sharing
   * the width evenly however many there are.
   */
  calendar: "grid min-w-0 grid-flow-col grid-rows-7 auto-cols-[minmax(0,1fr)] gap-0.5",
  /**
   * A month (`<ui-month>`): seven columns, a week a row, sharing the width evenly however narrow.
   * Each column may go below 7rem: a cell holds a day's number and its dots, never running text,
   * and every column's minimum is 0 (I1).
   */
  month: "grid min-w-0 grid-cols-[repeat(7,minmax(0,1fr))] gap-0.5",
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
  /** One line in a tile one row high (a dense figure): 6px above and below, 12px a side. */
  xs: "[&>.card-body]:[--card-p:0.375rem_0.75rem]",
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
  /**
   * A one-line table's header cells: never narrower than their label and sort mark on one line, so
   * the header is one line whatever the rows hold (the scroller takes what's wider).
   */
  headOneLine: "[&_thead_th_button]:min-w-max",
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
  "4.5": "size-4.5 shrink-0",
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
  /** A card's corner: as large as the colour scheme's card radius (`--radius-box`), at least 20px. */
  corner: "size-[max(1.25rem,var(--radius-box))] shrink-0",
} as const;
/** A fixed width leaf (a narrow control, a rail item), at most 4rem. */
export const fixedWidth = {
  "2": "w-2 shrink-0",
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

/**
 * Floating panels (menus, dialogs, sheets, popovers, tooltips, snackbars, a chart's tooltip) are
 * tiles too: whole tiles across, as many as asked or as fit in the window less 1rem each side,
 * whichever is fewer (`round(down, …, --tile-w)`), so a panel never ends between tile lines and
 * never leaves the window (I1). 1 tile is 53px at the default text size (src/components/base/tiles.ts).
 * Down they're quarter tiles (`floatingHeight`). A floating surface is sized only from these
 * (tests/tiles.test.ts, "floating surfaces are tiles").
 */
export const floating = {
  "4": "w-[min(calc(4_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "5": "w-[min(calc(5_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "6": "w-[min(calc(6_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "7": "w-[min(calc(7_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "8": "w-[min(calc(8_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "10": "w-[min(calc(10_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "12": "w-[min(calc(12_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "18": "w-[min(calc(18_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  /** A content sheet: 8 tiles (424px at the default text size), a form's 12. */
  sheet: "w-[min(calc(8_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  sheetWide: "w-[min(calc(12_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  /**
   * A list under a field (a combobox's options): its anchor's width rounded up to whole tiles, at
   * least 4, at most the window's whole tiles.
   */
  anchor:
    "w-[round(up,max(anchor-size(width),calc(4_*_var(--tile-w))),var(--tile-w))] max-w-[round(down,calc(100vw_-_2rem),var(--tile-w))]",
  /** As wide as its content rounded up to whole tiles, at most the window's whole tiles less 1rem a side. */
  fit: "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[round(down,calc(100vw_-_2rem),var(--tile-w))]",
} as const;

/**
 * A floating panel as wide as its content rounded up to whole tiles (where `calc-size()` isn't
 * supported, its content's width: each fallback sits behind `not-supports-`, so it never competes), at most N tiles (a tooltip's
 * 6, a snackbar's 11) and at most the window's (or, `In`, its parent's) whole tiles. A panel this
 * narrow never squeezes its words to a letter a line: it's its content's width, in tiles.
 */
export const floatingFit = {
  "6": "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(6_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "11": "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(11_*_var(--tile-w)),round(down,calc(100vw_-_2rem),var(--tile-w)))]",
  "11In":
    "not-supports-[width:calc-size(max-content,size)]:w-max supports-[width:calc-size(max-content,size)]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] max-w-[min(calc(11_*_var(--tile-w)),round(down,100%,var(--tile-w)))]",
} as const;

/**
 * Floating panels down: their content's height rounded up to quarter tiles (`fit`, 14px at the
 * default text size), at most N tiles or the window less a margin, rounded down to quarter tiles.
 */
export const floatingHeight = {
  fit: "supports-[height:calc-size(auto,size)]:h-[calc-size(auto,round(up,size,calc(var(--tile-h)/4)))]",
  /** A list popover: at most 5 tiles (280px). */
  list: "max-h-[round(down,calc(5_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  /** A dialog with sections: at most 36rem, the window less 1rem, or 76% of it plus 4rem. */
  dialog: "max-h-[round(down,min(36rem,calc(100dvh_-_1rem),calc(76dvh_+_4rem)),calc(var(--tile-h)/4))]",
  /** A panel over the page (the assistant): 38rem, or the window less 7rem, exactly. */
  panel: "h-[round(down,min(38rem,calc(100dvh_-_7rem)),calc(var(--tile-h)/4))]",
  /** A tool panel: at most 28rem or 60% of the window. */
  tool: "max-h-[round(down,min(28rem,60dvh),calc(var(--tile-h)/4))]",
  /** A side sheet: the height it's given, rounded down to quarter tiles. */
  sheet: "h-[round(down,100%,calc(var(--tile-h)/4))]",
  /** A select's options: at most N tiles. */
  "2": "max-h-[round(down,calc(2_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "3": "max-h-[round(down,calc(3_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "4": "max-h-[round(down,calc(4_*_var(--tile-h)),calc(var(--tile-h)/4))]",
  "6": "max-h-[round(down,calc(6_*_var(--tile-h)),calc(var(--tile-h)/4))]",
} as const;

/**
 * A tooltip's tip (daisyUI's `::before`, or its `.tooltip-content`): its words rounded up to whole
 * tiles across, at most 6 (320px; M3's plain tooltip is a line of a few words), and quarter tiles
 * down. Written whole wherever a tooltip is (`TOOLTIP_GLASS`, the icon button, the rail).
 */
export const tip =
  "not-supports-[width:calc-size(max-content,size)]:[&::before]:w-max [&::before]:max-w-[calc(6_*_var(--tile-w))] supports-[width:calc-size(max-content,size)]:[&::before]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] supports-[height:calc-size(auto,size)]:[&::before]:h-[calc-size(auto,round(up,size,calc(var(--tile-h)/4)))] not-supports-[width:calc-size(max-content,size)]:[&>.tooltip-content]:w-max [&>.tooltip-content]:max-w-[calc(6_*_var(--tile-w))] supports-[width:calc-size(max-content,size)]:[&>.tooltip-content]:w-[calc-size(max-content,round(up,size,var(--tile-w)))] supports-[height:calc-size(auto,size)]:[&>.tooltip-content]:h-[calc-size(auto,round(up,size,calc(var(--tile-h)/4)))]";

/**
 * A primitive's own box in tiles (a field, a bar, a gauge): N tiles wide, at most its parent (I1).
 * In a tile on the board that's whole tiles whenever the tile has the room.
 */
export const tiles = {
  "2": "w-[calc(2_*_var(--tile-w))] max-w-full",
  "4": "w-[calc(4_*_var(--tile-w))] max-w-full",
  "5": "w-[calc(5_*_var(--tile-w))] max-w-full",
  "6": "w-[calc(6_*_var(--tile-w))] max-w-full",
  "7": "w-[calc(7_*_var(--tile-w))] max-w-full",
  "8": "w-[calc(8_*_var(--tile-w))] max-w-full",
  "10": "w-[calc(10_*_var(--tile-w))] max-w-full",
} as const;

/** As wide as its parent allows, up to N tiles. */
export const tileCap = {
  "6": "w-full max-w-[calc(6_*_var(--tile-w))]",
  "7": "w-full max-w-[calc(7_*_var(--tile-w))]",
  "8": "w-full max-w-[calc(8_*_var(--tile-w))]",
  "11": "w-full max-w-[calc(11_*_var(--tile-w))]",
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
  compact: "[--frame-gap:0px]",
  /** The header's inline padding: the frame's edge, 4px to 12px, on a header as wide as the window (≥ 320px). */
  headerInset: "px-[max(var(--frame-edge),0.25rem)]",
  /**
   * The frame is one grid of quarter tiles (13.25 x 14px at the default text size; four make a
   * tile each way), so every edge in the shell, a tile's or a quarter's, is a line of it. Across:
   * the start rail's four quarters at the screen's edge, half of what the tiles leave over
   * (`--frame-slack`), the tiles between the rails in quarters (`--frame-inner-quarters`, set by
   * `<ui-frame>`), the other half, and the end rail's four quarters at the other edge (0 wide in
   * compact: `--frame-end-quarter`). The leftover belongs to the main panel, whose span takes both
   * halves: the page pads its content by them, so the board keeps whole tiles on the frame's lines
   * with the extra room around it. Down: the tiles that fit, in quarters (`--frame-quarter-rows`),
   * then the height left over. The header spans the first 4 rows; each column its rail's 4
   * quarters under it, down to the footer's quarter; the main panel everything between them, its
   * window down to three quarters into the last tile and its footer the last quarter and the
   * height left over (a subgrid). An open column lies over the main panel's first tiles, which
   * starts after it (`push*`).
   */
  grid: "grid grid-rows-[repeat(var(--frame-quarter-rows,12),calc(var(--tile-h)/4))_minmax(0,1fr)] grid-cols-[repeat(4,calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(var(--frame-inner-quarters,16),calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(4,var(--frame-end-quarter,calc(var(--tile-w)/4)))]",
  /** The header: the first row, edge to edge. */
  headerArea: "[grid-area:1/1/5/-1]",
  /**
   * The header lays its parts on the frame's tile columns (a subgrid): the brand on the start
   * rail's tile (and the navigation's 4 tiles once the header is 40rem wide), the actions one tile
   * each against the end rail, the search centred on whole tiles between them (8 at most).
   */
  // Never a container itself: a container's layout containment would turn the subgrid back into a
  // grid of its own. Its parts read the frame's width (`@container/frame`) instead.
  headerGrid: "grid grid-cols-subgrid grid-rows-[var(--frame-header)]",
  /** The frame is a size container (its width), for the header's parts. */
  frameContainer: "@container/frame",
  headerStart: "[grid-row:1] [grid-column:1/span_4] @min-[40rem]/frame:[grid-column:1/span_16]",
  headerSearch: "[grid-row:1] [grid-column:6/span_4] @min-[40rem]/frame:[grid-column:18/-18]",
  headerActions:
    "[grid-row:1] [grid-column:6/var(--frame-actions-end,-1)] justify-self-end grid grid-flow-col auto-cols-(--tile-w) justify-items-center",
  searchBox: "w-full max-w-[calc(8*var(--tile-w))] grid justify-items-center",
  /** The brand's mark centred on the rail's tile, as the rail's icons are. */
  brandInset: "ps-[calc((var(--frame-rail)_-_2rem)/2)]",
  /** The start column, the main panel and the end column: the second row, between the edges. */
  startArea: "[grid-area:5/1/-2/5]",
  mainArea: "[grid-area:5/5/-1/-5]",
  /**
   * The main panel's column takes the frame's own rows (a subgrid): its window the tile rows and
   * three quarters of the last tile, its footer the last quarter and the height left over under it.
   */
  mainRows: "grid grid-rows-subgrid grid-cols-[minmax(0,1fr)]",
  windowRows: "[grid-row:1/-3]",
  footerRows: "[grid-row:-3/-1]",
  endArea: "[grid-area:5/-5/-2/-1] justify-self-end",
  /**
   * A column that pushes the page lies over the main panel's first (or last) tiles past its rail,
   * and the main panel starts that many tiles later: a margin of the open width less the rail,
   * which frame-fit counts (the page keeps its tiles beside it). It moves on the column's spring.
   */
  pushStart: "ms-[calc(var(--frame-nav)_-_var(--frame-rail)_+_var(--drag-start-o,0px))]",
  pushEnd: "me-[calc(var(--frame-aside)_-_var(--frame-rail)_+_var(--drag-end-o,0px))]",
  /**
   * Dragging the main panel's edge (`<ui-frame-main>`'s handles): the edge follows the pointer by
   * `--drag-start` / `--drag-end` (never past the column's open or closed width), then snaps.
   */
  dragStart: "ms-(--drag-start)",
  dragEnd: "me-(--drag-end)",
  /**
   * A drag handle on the main panel's edge: a 16px strip centred on it, over the window's lip. It
   * draws nothing under the pointer (only its cursor shows); keyboard focus outlines it.
   */
  dragHandle:
    "absolute inset-y-0 z-20 w-4 shrink-0 cursor-col-resize touch-none rounded-full touch-target focus-visible:outline-2 focus-visible:outline-primary",
  pushMove:
    "[transition:margin-inline-start_var(--duration-spatial)_var(--ease-spatial)_var(--push-start-delay,0s),margin-inline-end_var(--duration-spatial)_var(--ease-spatial)_var(--push-end-delay,0s)] motion-reduce:transition-none",
  /** A column keeps the width frame-fit gives it: its rail, or its open width while it pushes. */
  column: "group/column shrink-0",
  rail: "w-(--frame-rail)",
  navOpen: "w-(--frame-nav)",
  asideOpen: "w-(--frame-aside)",
  /**
   * A column's list while its edge is dragged keeps its open width, the column's open width less
   * the panel's inline padding (its rail less a 44px row, `appShellPanel`), so nothing in it moves
   * or re-wraps as the edge is pressed or dragged; the panel clips it (`overflow-hidden`) until the
   * column is that wide.
   */
  listDragStart: "data-[drag]:w-[calc(var(--frame-nav)_-_var(--frame-rail)_+_2.75rem)] data-[drag]:max-w-none",
  listDragEnd: "data-[drag]:w-[calc(var(--frame-aside)_-_var(--frame-rail)_+_2.75rem)] data-[drag]:max-w-none",
  /**
   * A column whose edge is being dragged (`<ui-frame-main>`'s handles): its rail or open width plus
   * the drag (`--drag-start` / `--drag-end`, 0 otherwise), never past its open or closed width.
   */
  railDragStart: "w-[calc(var(--frame-rail)_+_var(--drag-start,0px))]",
  railDragEnd: "w-[calc(var(--frame-rail)_+_var(--drag-end,0px))]",
  navDrag: "w-[calc(var(--frame-nav)_+_var(--drag-start-o,0px))]",
  asideDrag: "w-[calc(var(--frame-aside)_+_var(--drag-end-o,0px))]",
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
  center: "min-w-(--main-min)",
  /** The page footer under the main panel: the last quarter tile and the height left over, its line centred in them. */
  footer: "[grid-row:-3/-1] shrink-0",
  /** The column's toggle, a 40px icon button, keeps its height in the column. */
  toggle: "shrink-0 group/toggle",
} as const;

/**
 * The board (layout/board.ts, src/components/base/board.ts): a screen's widgets on the tile grid
 * (src/components/base/tiles.ts). Its tracks are quarter tiles, like the frame's (`--board-quarters`:
 * four per tile across, from its width; rows a quarter tile high), so the board's lines are the
 * frame's lines and round the same way; a tile spans four of them each way; no gaps: each surface sits
 * 4px inside its tiles. A tile's place is its column and span (`--lane`, `--span`) and its row and
 * rows (`--row`, `--rows`), from the board's placement, which never gives a tile more columns than
 * the board has (`spanOf`). A tile fills its tiles (a one-cell grid, so what it holds fills it too).
 */
export const board = {
  box: "@container/board w-full",
  lanes:
    "grid auto-rows-[calc(var(--tile-h)/4)] gap-0 [grid-template-columns:repeat(var(--board-quarters,4),calc(var(--tile-w)/4))]",
  tile: "grid min-w-0 min-h-0 overflow-clip grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] [grid-column:var(--lane)/span_var(--span)] [grid-row:var(--row)/span_var(--rows)]",
  /** Its surface 4px inside its tiles. */
  inset: "p-1",
  /**
   * Held by hand (`UiBoard.hold`, `data-held`): in the top layer (a manual popover), so no scrolling
   * panel clips it and it can be carried anywhere on the screen (over the side panel's Widgets), out
   * of the pointer's way; at `--lift-x` / `--lift-y` in the viewport, `--held-w` × `--held-h` (its
   * size when picked up, or the size it's resized to, px between tiles). The popover's own box
   * (inset, margin, border, canvas fill) is undone. Over another board that would keep it
   * (`data-out`: the side panel's Widgets), it shrinks to half towards the point it was grabbed by,
   * so the place it would go there shows round it. Let go, it springs back to its tiles.
   */
  held: "data-held:origin-(--grab) data-held:[transition:scale_var(--duration-spatial-fast)_var(--ease-spatial-fast)] data-out:scale-50 data-out:opacity-90 motion-reduce:data-held:transition-none data-held:fixed data-held:inset-auto data-held:left-(--lift-x) data-held:top-(--lift-y) data-held:m-0 data-held:border-0 data-held:bg-transparent data-held:text-inherit data-held:overflow-visible data-held:pointer-events-none data-held:w-(--held-w) data-held:h-(--held-h)",
  /** Where a held tile lands (gridstack's placeholder): its tiles, the surface inset like a tile's. */
  drop: "pointer-events-none p-1 [grid-column:var(--lane)/span_var(--span)] [grid-row:var(--row)/span_var(--rows)]",
  /**
   * What a tile that fits its content holds: as tall as that content (not stretched to the tile),
   * so the board can measure it and give the tile the whole tiles that hold it.
   */
  fit: "self-start min-w-0",
} as const;
