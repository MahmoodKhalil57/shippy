import { cssTime } from "../../base/css-time.ts";
import { tileH, tileW } from "../../base/tiles.ts";
import type { VariantProps } from "class-variance-authority";
import { html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { menuFoldTween, type MenuFoldTween } from "../navigation/menu.ts";
import { motion } from "../../base/motion-queue.ts";

/**
 * Frame: the parts of an application frame — a header across the top, a collapsible column on
 * each side of a rounded main panel that scrolls on its own, over a background — as primitives.
 * `<ui-app-shell>` (src/components/composed/layout/app-shell.ts) puts them together and decides
 * when columns open, push the page or float over it as sheets; these only draw each state.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy)
 *
 * - `<ui-frame>`: the root (the background image under its `scrim`, the colour wash), and the frame's
 *   grid: the header across the top, then the start column, the main panel and the end column, each a
 *   direct grid item (`frame.grid` in the layout algebra), so the frame tiles from the top down.
 * - `<ui-frame-header>`: brand, `slot="start"`, `slot="search"`, `slot="actions"`; the parts over
 *   an open sheet are lifted above it (`lift-start`, `lift-end`).
 * - `<ui-frame-column>`: a side column — its toggle (`ui-column-toggle`), its open list and its rail
 *   stacked, a footer, and its backdrop when it's a sheet. Its states (`open`, `sheet`) animate
 *   in two steps on M3's springs (src/styles/motion.css): groups collapse, then the column folds.
 * - `<ui-frame-main>`: the main panel (a size container, `@container/main`) and `slot="footer"`
 *   under it; `pageTransition()` plays M3's transition patterns as a page enters.
 * Parts the shell measures carry `data-frame-region`; the root carries `data-frame`.
 *
 * Nothing moves an icon: a column's rail is its list with the labels left out (`<ui-menu
 * layout="rail">` / `layout="nav"`: the same rows, 40px tall with 24px icons), both drawn in the
 * same box (the panel's inset centres a 48px icon pill in the rail), so opening a column only
 * reveals what is beside the icons. The header is 56px (M3's small app bar is 64dp; ours holds no
 * page title).
 */
/**
 * The app's two glass layers, behind the header, the columns and the window (see `frame-liquid` and
 * `frame-matte`, src/styles/theme.css): the chrome's glass (a tint and blur, no refraction) under
 * the header, the columns and the footer, and the main window's slab, a raised pane of refracting
 * liquid glass, only where the main window is (`UiFrame`'s clip paths). Elements of their own,
 * first in the frame, so the layering is in the DOM as it is on screen.
 */
export const appShellLayer = rcva("pointer-events-none absolute", {
  variants: {
    kind: {
      backdrop: "-z-10 inset-0 frame-liquid",
      shell: "-z-10 inset-0 frame-matte",
    },
  },
});

/** One column that never grows past the viewport, whatever the page inside needs. */
export const appShell = rcva(
  /* A faint wash of the theme's primary / secondary / accent at the corners: the frame the header
     and rails sit on, and what the floating glass (sheets, menus, dialogs) refracts. Under it, the
     chosen background image (`--app-background`, set by `<ui-appearance kind="background">`)
     (the scrim that keeps text on the shell readable is a layer of its own, `appShellLayer`). */
  "group/shell @container/frame relative isolate grid h-dvh [--main-radius:var(--radius-lg)] grid grid-rows-[repeat(var(--frame-quarter-rows,12),calc(var(--tile-h)/4))_minmax(0,1fr)] grid-cols-[repeat(4,calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(var(--frame-inner-quarters,16),calc(var(--tile-w)/4))_var(--frame-slack,0px)_repeat(4,var(--frame-end-quarter,calc(var(--tile-w)/4)))] overflow-hidden bg-surface-container [background-image:var(--app-background,none),radial-gradient(70%_60%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%),radial-gradient(60%_55%_at_100%_100%,color-mix(in_oklab,var(--color-secondary)_12%,transparent),transparent_70%),radial-gradient(45%_40%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_70%)] bg-cover bg-center text-on-surface",
  {
    variants: {
      /**
       * Until the first paint: no transitions inside the shell, so a reload shows the final
       * layout at once (open columns, expanded groups) instead of animating into it.
       */
      settling: { true: "[&_*]:transition-none!" },
      /**
       * Too narrow for `--main-comfort` of content beside both rails: the frame goes full screen. Its
       * edges and gaps are 0, so the header, the rail and the main panel meet the screen's edges
       * and each other (the side panel's rail has moved into the navigation's: `merged`).
       */
      compact: { true: "[--frame-gap:0px] [--main-radius:0px] [--main-radius-ss:var(--radius-lg)]" },
    },
  },
);

/**
 * Header: one tile high, its parts on the frame's tile columns (`frame.headerGrid`): the brand on
 * the start rail's tile (and the navigation's width from a 40rem header, its name shown), the
 * actions one tile each against the end rail, and the search centred on whole tiles between them
 * (at most 8; it collapses to an icon when that room gets small, a container query).
 */
export const appShellHeader = rcva(
  "[grid-area:1/1/5/-1] w-full grid grid-cols-subgrid grid-rows-[var(--frame-header)] min-h-(--frame-header) items-center",
);
export const appShellHeaderStart = rcva(
  "[grid-row:1] [grid-column:1/span_4] @min-[40rem]/frame:[grid-column:1/span_16] flex flex-row flex-wrap max-w-full min-w-0 items-center gap-1",
);
export const appShellBrand = rcva(
  "w-fit gap-2 rounded-full ps-[calc((var(--frame-rail)_-_2rem)/2)] pe-3 min-w-0 [overflow-wrap:anywhere] text-title-md tracking-tight",
);
/**
 * The brand's name: on a header narrower than 40rem the brand has only the rail's tile, so only the
 * mark shows; the name stays for screen readers (it's the link's name).
 */
export const appShellBrandName = rcva("@max-[40rem]/frame:sr-only");
/** The brand's mark (`brand-icon`): primary, on a soft primary disc. */
export const appShellBrandMark = rcva("grid size-8 place-items-center rounded-full bg-primary/15 text-primary");
export const appShellSearch = rcva(
  "[grid-row:1] [grid-column:6/span_4] @min-[40rem]/frame:[grid-column:18/-18] @container w-full flex flex-row flex-wrap max-w-full min-w-0 justify-center",
);
/** The search itself: as wide as that room allows, up to 28rem. */
export const appShellSearchBox = rcva("w-full max-w-[calc(8*var(--tile-w))] grid justify-items-center");
export const appShellActions = rcva(
  "[grid-row:1] [grid-column:6/var(--frame-actions-end,-1)] justify-self-end grid grid-flow-col auto-cols-(--tile-w) justify-items-center items-center",
);

/**
 * Header items kept above an open sheet and its backdrop (they sit in the sheet's empty top
 * band): the brand and search over the navigation sheet, the actions over the side panel's.
 * Closing, they stay lifted exactly as long as the sheet stays up (its groups collapsing, then
 * its shrink), so they never duck under it.
 */
export const appShellLift = rcva("relative", {
  variants: {
    side: { start: "", end: "" },
    lifted: { true: "z-50 [transition:z-index_0s]", false: "z-auto" },
  },
  compoundVariants: [
    {
      side: "start",
      lifted: false,
      class:
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-data-[start-groups-open]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
    {
      side: "end",
      lifted: false,
      class:
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-data-[end-groups-open]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
  ],
});

/**
 * A column (`side="start"`: navigation, `"end"`: side panel) as it takes up room in the layout:
 * its open width when it pushes the main panel, the rail (`--frame-rail`) otherwise (closed, or
 * open as a sheet). Resizes on M3's default spatial spring (src/styles/motion.css).
 */
export const appShellColumn = rcva(
  "group/column flex min-h-0 shrink-0 flex-col transition-[width] ease-spatial duration-(--duration-spatial) motion-reduce:transition-none",
  {
    variants: {
      /** While its edge is dragged it follows the pointer: no transition then (`data-drag-*` on the frame). */
      side: {
        start: "[grid-area:5/1/-2/5] group-data-[drag-start]/shell:transition-none",
        end: "[grid-area:5/-5/-2/-1] justify-self-end group-data-[drag-end]/shell:transition-none",
      },
      /** Open and pushing the main panel. */
      push: {
        true: "delay-0",
        /** Shrinks once open groups have collapsed. */
        false: "delay-0 data-[groups-open]:delay-(--settle-spatial) data-[drag]:delay-0!",
      },
      /** Its rail lives in the other column (compact frame): it takes no room, and shows only as a sheet. */
      merged: { true: "w-0!", false: "" },
    },
    // Its rail, or its open width (`--frame-nav`, `--frame-aside`: the shell pushes only when
    // frame-fit says they fit), plus the drag while its edge is dragged.
    compoundVariants: [
      { side: "start", push: false, class: "w-[calc(var(--frame-rail)_+_var(--drag-start,0px))]" },
      { side: "end", push: false, class: "w-[calc(var(--frame-rail)_+_var(--drag-end,0px))]" },
      { side: "start", push: true, class: "w-[calc(var(--frame-nav)_+_var(--drag-start-o,0px))]" },
      { side: "end", push: true, class: "w-[calc(var(--frame-aside)_+_var(--drag-end-o,0px))]" },
    ],
  },
);

/**
 * What a column shows: its toggle and menus. Inset so the 48px icon pills (and the toggle) sit
 * centred in the rail: `(--frame-rail − 3rem) / 2` from the column's edges. Each panel also
 * reaches over the frame's edge padding (a transparent border), so as a sheet it can meet the
 * screen edge without its icons moving. As a sheet it is lifted out of the layout (`fixed`, over
 * a backdrop) and widens there; closing, it stays lifted until it has folded back into the rail.
 */
export const appShellPanel = rcva(
  "flex h-full min-h-0 flex-col gap-0 overflow-hidden border-transparent px-[calc((var(--frame-rail)_-_2.75rem)/2)] motion-reduce:transition-none",
  {
    variants: {
      side: {
        start: "-ms-(--frame-edge) border-s-(length:--frame-edge) group-data-[drag-start]/shell:transition-none",
        end: "-me-(--frame-edge) border-e-(length:--frame-edge) group-data-[drag-end]/shell:transition-none",
      },
      open: { true: "", false: "" },
      sheet: { true: "", false: "" },
      /**
       * Merged into the other column: hidden unless open as a sheet. Closing, it hides once it has
       * folded (the sheet's own delayed `all` transition holds `visibility` until then).
       */
      merged: { true: "", false: "" },
    },
    compoundVariants: [
      { merged: true, open: false, class: "invisible" },
      /*
       * Pushing: the panel is exactly its column plus the edge padding at every frame, and its
       * inset springs exactly like the column's width (same curve, duration and delay), so the
       * rail's icons and the toggle stay centred while the rail resizes with the window.
       */
      {
        sheet: false,
        class:
          "w-[calc(100%_+_var(--frame-edge))] transition-[padding] ease-spatial duration-(--duration-spatial) delay-0 group-data-[groups-open]/column:delay-(--settle-spatial) group-data-[drag]/column:delay-0!",
      },
      /*
       * Sheet mode: explicit lengths, so the width transition starts from the rail's width (the
       * shell switches to sheet mode a frame before opening one).
       */
      { sheet: true, open: false, class: "w-[calc(var(--frame-rail)_+_var(--frame-edge))]" },
      {
        sheet: true,
        open: true,
        class:
          "fixed inset-y-0 z-40 max-w-full liquid-glass pt-(--frame-header) pb-1 shadow-elevation-1 [transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete,z-index_0s_allow-discrete]",
      },
      {
        sheet: true,
        open: true,
        side: "start",
        class: "start-0 ms-0 w-[calc(var(--frame-nav)_+_var(--frame-edge))] rounded-e-xl-increased",
      },
      {
        sheet: true,
        open: true,
        side: "end",
        merged: false,
        class: "end-0 me-0 w-[calc(var(--frame-aside)_+_var(--frame-edge))] rounded-s-xl-increased",
      },
      /*
       * Merged into the start column (a compact frame): the side panel's rail is on the start
       * side, so its sheet grows out of that rail, like the navigation's, and folds back into it.
       */
      {
        sheet: true,
        open: true,
        side: "end",
        merged: true,
        class: "start-0 ms-0 w-[calc(var(--frame-aside)_+_var(--frame-edge))] rounded-e-xl-increased",
      },
      /*
       * Closing a sheet: it stays a sheet (fixed, pinned, full height, background, shadow — every
       * property held by a delayed discrete transition) until it has shrunk. It shrinks as soon as
       * its open groups have collapsed, while the labels fold (as when pushing), then drops back
       * into the layout. With groups open: collapse 0 → shrink and fold at S → drop at S + D;
       * without: shrink and fold at 0 → drop at D (S = --settle-spatial, D = --duration-spatial).
       */
      {
        sheet: true,
        open: false,
        class:
          "[transition:all_0s_allow-discrete_var(--duration-spatial),width_var(--duration-spatial)_var(--ease-spatial)_0s] group-data-[groups-open]/column:[transition:all_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial)),width_var(--duration-spatial)_var(--ease-spatial)_var(--settle-spatial)]",
      },
    ],
  },
);

/**
 * The frame's window: a thick slab of glass laid over the page (`frame-matte` under it, clipped to
 * the window). The well holds the scrolling page and, over it, the slab's edge (`appShellLip`,
 * `frame-lip`): drawn above the content, so what scrolls to the edge goes under the glass and bends
 * with it. The window's corner radius (`--main-radius`) is the frame's, for the page, the edge and
 * the slab alike (`<ui-frame>` clips the slab to the window's box and corners).
 */
export const appShellWell = rcva("[grid-row:1/-3] flex flex-col relative min-h-0");

/**
 * The page plane seen through the window: it scrolls, flat, under the lip.
 *
 * Its content is never narrower than `--main-min` (the shell's room checks; src/styles/theme.css).
 * A size container (`main`), so pages size themselves to the window (container units, container
 * queries), not to the screen. No border and no scrollbar gutter: its content box is exactly its
 * tiles, so the board inside it lies on the frame's tile lines. It scrolls by wheel, touch and
 * keyboard; its scrollbar isn't drawn (a classic one would take part of a tile).
 */
export const appShellMain = rcva(
  "@container/main w-full min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-(--main-radius)",
  { variants: { compact: { true: "rounded-ss-lg" } } },
);

/** The slab's edge around the window, over the page (see `frame-lip`, src/styles/theme.css). */
export const appShellLip = rcva("pointer-events-none absolute inset-0 z-10 rounded-(--main-radius) frame-lip", {
  variants: { compact: { true: "rounded-ss-lg" } },
});

/**
 * A drag handle on the main panel's start or end edge: drag it to open or close that column (the
 * panel's edge follows the pointer, then snaps to the nearer state), or focus it and press Enter,
 * Space or the arrow keys.
 */
export const appShellDragHandle = rcva(
  "absolute inset-y-0 z-20 w-4 shrink-0 cursor-col-resize touch-none rounded-full touch-target focus-visible:outline-2 focus-visible:outline-primary",
  {
    variants: {
      side: {
        start: "start-0 -translate-x-1/2 rtl:translate-x-1/2",
        end: "end-0 translate-x-1/2 rtl:-translate-x-1/2",
      },
    },
  },
);

/** The page inside the main panel: the box a page transition moves (see `pageTransition`). */
export const appShellPage = rcva("");

/** The main panel with its footer under it; takes the room the columns leave. */
// The main panel keeps `--main-min` for its content (frame-fit proves the room).
export const appShellCenter = rcva(
  "[grid-area:5/5/-1/-5] relative grid grid-rows-subgrid grid-cols-[minmax(0,1fr)] min-w-(--main-min) min-h-0 [transition:margin-inline-start_var(--duration-spatial)_var(--ease-spatial)_var(--push-start-delay,0s),margin-inline-end_var(--duration-spatial)_var(--ease-spatial)_var(--push-end-delay,0s)] motion-reduce:transition-none group-data-[drag-start]/shell:transition-none group-data-[drag-end]/shell:transition-none",
  {
    variants: {
      /**
       * The navigation pushes: the panel starts after it. Shrinking back waits for its groups to
       * close. While its edge is dragged, it follows the pointer (`--drag-start`).
       */
      pushStart: {
        true: "ms-[calc(var(--frame-nav)_-_var(--frame-rail)_+_var(--drag-start-o,0px))]",
        false:
          "ms-(--drag-start) group-data-[start-groups-open]/shell:[--push-start-delay:var(--settle-spatial)] data-[drag-start]:[--push-start-delay:initial]!",
      },
      /** The side panel pushes: the panel ends before it (`--drag-end` while its edge is dragged). */
      pushEnd: {
        true: "me-[calc(var(--frame-aside)_-_var(--frame-rail)_+_var(--drag-end-o,0px))]",
        false:
          "me-(--drag-end) group-data-[end-groups-open]/shell:[--push-end-delay:var(--settle-spatial)] data-[drag-end]:[--push-end-delay:initial]!",
      },
    },
  },
);

/**
 * The page's footer (`slot="footer"`): one centred line under the main panel, on the frame
 * (e.g. a credit), clear of the screen edge and quieter than the page: 65% is the faintest that
 * keeps it WCAG AA in light (5.3:1) and dark (6.3:1). Part of what the scrim keeps readable.
 */
// Under the main panel: the last quarter of the frame's last tile and the height left over under
// it (the main panel's subgrid), its one line centred in them.
export const appShellPageFooter = rcva(
  "[grid-row:-3/-1] shrink-0 min-w-0 content-center overflow-hidden [overflow-wrap:anywhere] text-center text-body-sm leading-none opacity-65",
);

/**
 * A column's toggle: centred on its rail's icon axis (the 40px button 2px inside the rows' 44px
 * icon pill), at the same spot open or closed: the navigation's at its start edge, the side
 * panel's at its end edge (the panel grows from there, so its toggle never moves; its section
 * icons ride the start edge as it opens).
 */
// Three quarters of a tile, the 40px button centred in it: the first row of the column's tile grid.
export const appShellToggle = rcva("shrink-0 group/toggle my-[calc((var(--tile-h)*0.75_-_2.5rem)/2)]", {
  variants: {
    column: { start: "ms-0.5", end: "me-0.5 self-end" },
  },
});

/** Dims the page behind a sheet: M3's scrim (the scrim role at 32%). */
export const appShellBackdrop = rcva(
  "fixed inset-0 z-30 bg-scrim/32 transition-opacity ease-effects duration-(--duration-effects) starting:opacity-0 motion-reduce:transition-none",
);

/**
 * A column's footer (`slot="nav-footer"` / `"aside-footer"`): pinned under the menus (e.g. the
 * person signed in), in every state — rail, open, sheet. It starts on the icon axis, so what it
 * leads with (an avatar) stays where it is while the column opens and shows what follows it.
 */
export const appShellFooter = rcva(
  // What follows the avatar (the name) appears once the column has opened, so it never shows
  // squeezed into the rail's width while the column grows. The footer is one row tall and clips
  // below it: while the column is still narrow the name wraps under the avatar, and without the
  // clip that second line would lift the avatar until the column is wide enough.
  "flex flex-col justify-center gap-1 ps-1 h-(--tile-h) min-h-(--tile-h) max-h-(--tile-h) overflow-y-clip [&>*>*+*]:[transition:opacity_var(--duration-effects)_var(--ease-effects)_var(--settle-spatial)] [&>*>*+*]:starting:opacity-0 motion-reduce:[&>*>*+*]:[transition:none]",
);

/**
 * A column's two rails when another column's rail is merged into it (a compact frame): stacked in
 * one spot, so either shows in the same place.
 */
export const appShellRailGroups = rcva("grid min-h-0 flex-1 [&>*]:[grid-area:1/1]");

/**
 * One of those rails. One shows at a time, chosen with the switch at the top; switching slides them
 * sideways, like pages of one strip: the column's own rail sits to the start, the merged one to the
 * end, so the one leaving goes out its side as the other comes in from its own (M3 spatial spring
 * for the slide, effects spring for the fade). The one leaving stays visible until it's out.
 */
export const appShellRailGroup = rcva("flex min-h-0 flex-col gap-3 motion-reduce:transition-none!", {
  variants: {
    shown: {
      true: "translate-x-0 opacity-100 [transition:translate_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects),visibility_0s]",
      false:
        "invisible pointer-events-none opacity-0 [transition:translate_var(--duration-spatial)_var(--ease-spatial),opacity_var(--duration-effects)_var(--ease-effects),visibility_0s_var(--duration-spatial)]",
    },
    /** Where it sits in the strip: the column's own rail at the start, the merged one at the end. */
    place: { start: "", end: "" },
  },
  compoundVariants: [
    { shown: false, place: "start", class: "-translate-x-full rtl:translate-x-full" },
    { shown: false, place: "end", class: "translate-x-full rtl:-translate-x-full" },
  ],
});

/** Wrapper that keeps a slot's nodes mounted while hidden. */
export const appShellSlot = rcva("flex min-h-0 w-full flex-col gap-[calc(var(--tile-h)*0.25)]", {
  variants: {
    hidden: { true: "hidden" },
    /** The scrolling part of a column (its toggle stays put above it). */
    // It scrolls without a scrollbar: while the column folds, one would show beside half-drawn rows.
    scroll: {
      true: "flex-1 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    },
  },
});

/**
 * A column's two menus, stacked: the rail sits on top of the list with the same
 * icon spots. The list sets the menu's flags (`--menu-collapse`, `--menu-expanded`, see
 * `<ui-menu layout="nav">`) and the menu animates as they flip. Closing, the list stays until
 * it has folded into the rail's look, so the hand-over is invisible.
 */
export const appShellNavList = rcva("motion-reduce:transition-none", {
  variants: {
    /**
     * While its column's edge is dragged, the list shows over the rail and folds or unfolds with
     * the drag, its groups and panes held shut, as while the column opens and closes (they open
     * again once the column has sprung open). It's laid out open (`--menu-collapse` 0) and folds as
     * a tween the drag scrubs (`menuFoldTween`, set going by `<ui-frame-main>`): its labels slide
     * and fade, its highlight narrows to the rail's pill, exactly as far as the column is open, then
     * play on with the column's width as it springs to where it snapped. Its transitions are off,
     * over the state's own: closed with open groups, those wait for the groups to fold
     * (`visibility`, `--menu-collapse`), which would hold the list hidden behind the pointer.
     */
    side: {
      start:
        "data-[drag-done]:[transition:none]! data-[drag]:[&_[data-menu-fold]]:transition-none! data-[drag]:[&_summary]:after:transition-none! data-[drag]:visible data-[drag]:[--menu-collapse:0] data-[drag]:[--menu-expanded:0] data-[drag]:[transition:none]! data-[drag]:[&_details::details-content]:[block-size:0]! data-[drag]:[&_li]:grow-0! data-[drag]:w-[calc(var(--frame-nav)_-_var(--frame-rail)_+_2.75rem)] data-[drag]:max-w-none",
      end: "data-[drag-done]:[transition:none]! data-[drag]:[&_[data-menu-fold]]:transition-none! data-[drag]:[&_summary]:after:transition-none! data-[drag]:visible data-[drag]:[--menu-collapse:0] data-[drag]:[--menu-expanded:0] data-[drag]:[transition:none]! data-[drag]:[&_details::details-content]:[block-size:0]! data-[drag]:[&_li]:grow-0! data-[drag]:w-[calc(var(--frame-aside)_-_var(--frame-rail)_+_2.75rem)] data-[drag]:max-w-none",
    },
    state: {
      /**
       * Unfold once the column has grown: the labels, headings and chevrons fade in beside icons that
       * never moved, so nothing shows cut off in a column still on its way open; groups expand then too.
       */
      shown: `visible [--menu-collapse:0] [--menu-expanded:1] [transition:visibility_0s,--menu-collapse_0s_var(--settle-spatial),--menu-expanded_0s_var(--settle-spatial)] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-(--settle-spatial) [&_li>details>ul]:starting:[block-size:0] motion-reduce:[&_li>details>ul]:transition-none`,
      /** Groups collapse first; fold as they settle; hand over to the rail once folded. */
      hidden: `invisible [--menu-collapse:1] [--menu-expanded:0] [transition:visibility_0s_var(--settle-spatial),--menu-collapse_0s,--menu-expanded_0s] group-data-[groups-open]/column:[transition:visibility_0s_calc(var(--settle-spatial)_*_2),--menu-collapse_0s_var(--settle-spatial),--menu-expanded_0s] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:[block-size:0] [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-0 motion-reduce:[&_li>details>ul]:transition-none`,
    },
  },
});
// The rail scrolls without a scrollbar: one would take a share of its 48px and push the icons off their axis.
export const appShellNavRail = rcva(
  "transition-[visibility] duration-0 motion-reduce:delay-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  {
    variants: {
      /** Hidden while its column's edge is dragged (the list shows the drag). */
      side: {
        start: "data-[drag]:invisible data-[drag]:[transition:none] data-[drag-done]:[transition:none]!",
        end: "data-[drag]:invisible data-[drag]:[transition:none] data-[drag-done]:[transition:none]!",
      },
      state: {
        /** Takes over once the list has folded into its look. */
        shown:
          "visible delay-(--settle-spatial) group-data-[groups-open]/column:delay-[calc(var(--settle-spatial)_*_2)]",
        hidden: "invisible delay-0",
      },
    },
  },
);

/** Stacks a column's two views in one grid cell, so the one on its way out never pushes the other. */
export const appShellStack = rcva("grid w-full min-h-0 grid-cols-[minmax(0,1fr)] [&>*]:[grid-area:1/1]", {
  variants: {
    /** Fill the column below its toggle (navigation lists). */
    fill: { true: "flex-1 grid-rows-[minmax(0,1fr)]" },
  },
});

/*
 * Register the frame sizes as lengths (values: src/styles/theme.css), so they compute to px
 * for the room check. (Initial values must be px: `rem` depends on the root font size, which
 * makes a registration invalid.)
 */
for (const [name, initialValue] of [
  ["--frame-rail", "48px"],
  ["--frame-gap", "2px"],
  ["--frame-edge", "2px"],
] as const) {
  try {
    CSS.registerProperty({ name, syntax: "<length>", inherits: true, initialValue });
  } catch {
    /* already registered (hot reload) */
  }
}

/*
 * The drag's values (see `<ui-frame-main>`), registered as not inherited: they're set on the
 * elements that read them (the column, the main panel's box), so a pointer move restyles those two
 * elements, not every element under them.
 */
for (const [name, syntax, initialValue] of [
  ["--drag-start", "<length>", "0px"],
  ["--drag-end", "<length>", "0px"],
  ["--drag-start-o", "<length>", "0px"],
  ["--drag-end-o", "<length>", "0px"],
] as const) {
  try {
    CSS.registerProperty({ name, syntax, inherits: false, initialValue });
  } catch {
    /* already registered (hot reload) */
  }
}

export type FrameColumnVariants = VariantProps<typeof appShellColumn>;

/**
 * Material Design 3's transition patterns between pages (m3.material.io/styles/motion/transitions),
 * for the page entering the main panel:
 * - `top-level`: another destination of the navigation; fades in, with no movement (top-level
 *   destinations aren't related, so nothing suggests they are).
 * - `forward` / `backward`: one level deeper (a list → one of its records) or back up; slides in
 *   a little from the side it comes from while fading in.
 * - `lateral-forward` / `lateral-backward`: a peer at the same level (a record's next or previous
 *   tab); slides in from that side, without a fade, as if swiped.
 * Like every M3 transition they use the easing and duration tokens, not the bouncing springs.
 * With Reduce motion every one is a short fade.
 */
export type PageTransition = "top-level" | "forward" | "backward" | "lateral-forward" | "lateral-backward";

@customElement("ui-frame")
export class UiFrame extends LightElement {
  /** The scrim over the background image (a CSS colour), chosen so text over it stays readable. */
  @property() scrim = "";
  /** The scrim inside the main window, under its page plane, for text drawn on it (the page header). */
  @property() windowScrim = "";
  /** Until the first paint: no transitions, so a reload shows the final layout at once. */
  @property({ type: Boolean }) settling = false;
  /** The screen's tiles across (src/components/base/tiles.ts): the frame centres that many tiles. */
  @property({ type: Number }) cols = 6;
  /** Full screen: no edges or gaps (the shell sets it when the main panel's content would be under `--main-comfort`). */
  @property({ type: Boolean }) compact = false;

  render() {
    return html`<div
      data-frame
      class=${appShell({ settling: this.settling, compact: this.compact })}
      style=${styleMap({
        "--app-scrim": this.scrim || undefined,
        "--app-window-scrim": this.windowScrim || undefined,
        "--frame-cols": String(this.cols),
        // Half of what the tiles leave over: the main panel's, on each side of the page (the rails
        // meet the screen's edges). Worked out here: a custom property's `var()`s resolve where
        // it's declared, so the root's would only ever see the root's column count.
        "--frame-slack": `max(0px, calc((100vw - ${this.cols} * var(--tile-w)) / 2))`,
        // The tiles between the rails, in quarters (in compact there is no end rail: its tile goes
        // to the page, and its quarters are 0 wide).
        "--frame-inner-quarters": String(4 * Math.max(1, this.cols - (this.compact ? 1 : 2))),
        "--frame-end-quarter": this.compact ? "0px" : undefined,
        // The header's actions end on the end rail, or (in compact, no end rail) on the last tile.
        "--frame-actions-end": this.compact ? "-6" : undefined,
      })}
    >
      <div class=${appShellLayer({ kind: "backdrop" })} aria-hidden="true" data-frame-layer data-frame-backdrop></div>
      <div class=${appShellLayer({ kind: "shell" })} aria-hidden="true" data-frame-layer data-frame-shell></div>
      ${this.content}
    </div>`;
  }

  /**
   * The shell's hole: the main window's box and corners, cut out of the frame-sized shell with an
   * even-odd clip path. Re-cut when the frame or the window changes size (what the ResizeObserver
   * reports, read in its callback, after layout: nothing is laid out again for it). A frame-sized
   * layer, not one reaching past the screen: a backdrop filter is re-rendered over its whole area,
   * and a 9000px one made the compositor repaint about 78 megapixels on every hover.
   */
  #window: HTMLElement | null = null;
  #sizes = new ResizeObserver(() => this.#cut());

  /** `<ui-frame-main>` hands over its window once it's drawn. */
  watchWindow(window: HTMLElement) {
    this.#window = window;
    this.#sizes.observe(window);
    this.#cut();
  }

  protected firstUpdated() {
    this.#sizes.observe(this.querySelector("[data-frame]")!);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#sizes.disconnect();
  }

  #cut() {
    const frame = this.querySelector<HTMLElement>("[data-frame]");
    const shell = this.querySelector<HTMLElement>("[data-frame-shell]");
    const backdrop = this.querySelector<HTMLElement>("[data-frame-backdrop]");
    const window = this.#window;
    if (!frame || !shell) return;
    if (!window?.isConnected) {
      shell.style.clipPath = "";
      if (backdrop) backdrop.style.clipPath = "";
      return;
    }
    const f = frame.getBoundingClientRect();
    const r = window.getBoundingClientRect();
    const c = getComputedStyle(window);
    const [tl, tr, br, bl] = [
      c.borderTopLeftRadius,
      c.borderTopRightRadius,
      c.borderBottomRightRadius,
      c.borderBottomLeftRadius,
    ].map((v) => Math.min(parseFloat(v) || 0, r.width / 2, r.height / 2));
    const n = (v: number) => Math.round(v * 100) / 100;
    // The whole tiles that fit down the frame, in quarters (what's left over stays at the bottom,
    // under the footer).
    const scale = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
    const tile = tileH(scale);
    // The page's side padding: the slack (half of what the tiles leave over), plus half a tile when
    // the slack is under half a tile, so the page always has at least half a tile each side and the
    // board inside stays whole tiles on the frame's quarter lines.
    const half = tileW(scale) / 2;
    const slack = Math.max(0, (f.width - this.cols * tileW(scale)) / 2);
    frame.style.setProperty("--frame-pad-x", `${n(slack < half - 0.01 ? slack + half : slack)}px`);
    frame.style.setProperty("--frame-quarter-rows", String(4 * Math.max(3, Math.floor(f.height / tile + 1e-6))));
    const [x, y, w, h] = [r.left - f.left, r.top - f.top, r.width, r.height].map(n);
    const hole =
      `M${n(x + tl!)} ${y}H${n(x + w - tr!)}A${tr} ${tr} 0 0 1 ${n(x + w)} ${n(y + tr!)}` +
      `V${n(y + h - br!)}A${br} ${br} 0 0 1 ${n(x + w - br!)} ${n(y + h)}` +
      `H${n(x + bl!)}A${bl} ${bl} 0 0 1 ${x} ${n(y + h - bl!)}V${n(y + tl!)}A${tl} ${tl} 0 0 1 ${n(x + tl!)} ${y}Z`;
    // The slab only where the main window is, the chrome's glass everywhere else: each draws its
    // backdrop filter over its own area, and the slab bends the photo itself, not a blurred copy.
    shell.style.clipPath = `path("${hole}")`;
    if (backdrop) backdrop.style.clipPath = `path(evenodd, "M0 0H${n(f.width)}V${n(f.height)}H0Z${hole}")`;
  }
}

@customElement("ui-frame-header")
export class UiFrameHeader extends LightElement {
  @property() brand: Renderable = "";
  @property({ attribute: "brand-href" }) brandHref?: string;
  /** Mark shown before the brand name. */
  @property({ attribute: "brand-icon" }) brandIcon?: IconName;
  /** Lift the brand, `start` and `search` over an open start-side sheet. */
  @property({ type: Boolean, attribute: "lift-start" }) liftStart = false;
  /** Lift the actions over an open end-side sheet. */
  @property({ type: Boolean, attribute: "lift-end" }) liftEnd = false;

  render() {
    const brand = this.brand
      ? html`<a class=${button({ variant: "text", class: appShellBrand() })} href=${ifDefined(this.brandHref)}
          >${this.brandIcon ? html`<span class=${appShellBrandMark()}>${iconSvg(this.brandIcon, { size: "md" })}</span>` : nothing}<span
            class=${appShellBrandName()}
            >${this.brand}</span
          ></a
        >`
      : nothing;
    return html`<header class=${appShellHeader()} data-frame-region>
      <div class=${appShellHeaderStart({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        ${brand} ${this.slotted("start")}
      </div>
      <div class=${appShellSearch({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        <div class=${appShellSearchBox()}>${this.slotted("search")}</div>
      </div>
      <div class=${appShellActions({ class: appShellLift({ side: "end", lifted: this.liftEnd }) })}>
        ${this.slotted("actions")}
      </div>
    </header>`;
  }
}

/**
 * @example
 * <ui-frame-column side="start" label="Navigation" open>
 *   <ui-menu slot="list" layout="nav" .items=${items}></ui-menu>
 *   <ui-menu slot="rail" layout="rail" .items=${rail}></ui-menu>
 * </ui-frame-column>
 *
 * `list-slot` / `rail-slot` / `footer-slot` rename its slots (default `list`, `rail`, `footer`),
 * so a shell can pass its own authored children straight through. The toggle and the backdrop fire
 * `ui-column-toggle` { open } with the state asked for. (Not `ui-toggle`: that's what a menu inside
 * fires when one of its sections opens or closes, and it bubbles through the column.)
 */
/**
 * The fold running on each column's list (`menuFoldTween`): a drag's (`<ui-frame-main>`), or the
 * column's own when its toggle opens or closes it (`columnFolds`). Whoever starts one cancels the
 * one before; each hands the list back only while its fold is still the list's.
 */
const listFolds = new WeakMap<Element, MenuFoldTween>();
const columnFolds = new WeakSet<MenuFoldTween>();

@customElement("ui-frame-column")
export class UiFrameColumn extends LightElement {
  @property() side: "start" | "end" = "start";
  /**
   * A group in this column is open (a `<details>` in its list). Kept as a flag the column sets from
   * its groups' own `toggle` events, on itself (`data-groups-open`) and on the frame
   * (`data-start-groups-open` / `data-end-groups-open`), and read by `data-*` selectors. A `:has()`
   * over the column's or the frame's descendants did the same, but made every element under the
   * frame "affected by :has()": each change anywhere on the page then restyled the whole frame.
   */
  @state() private _groupsOpen = false;
  #onToggle = () => {
    const open = !!this.querySelector("details[open]");
    if (open !== this._groupsOpen) this._groupsOpen = open;
    this.closest("[data-frame]")?.toggleAttribute(`data-${this.side}-groups-open`, open);
  };

  connectedCallback() {
    super.connectedCallback();
    // `toggle` doesn't bubble: listen while it passes down (capture).
    this.addEventListener("toggle", this.#onToggle, true);
    queueMicrotask(this.#onToggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("toggle", this.#onToggle, true);
  }
  /** Its name ("Navigation"): the region's label and the toggle's ("Collapse navigation"). */
  @property() label = "";
  @property({ type: Boolean }) open = false;
  /** Open over the page (no room to push the main panel), with a backdrop. */
  @property({ type: Boolean }) sheet = false;
  @property({ attribute: "list-slot" }) listSlot = "list";
  @property({ attribute: "rail-slot" }) railSlot = "rail";
  @property({ attribute: "footer-slot" }) footerSlot = "footer";
  /**
   * Its rail as nodes, in place of `rail-slot` (when a shell moves a rail between columns: a
   * light-DOM slot is read once, so nodes handed over later go by property).
   */
  @property({ attribute: false }) railNodes?: Node[];
  /**
   * Another column's rail merged into this one (a compact frame). One rail shows at a time
   * (`railView`); while the column is closed, its toggle switches between them (`ui-rail-switch`),
   * so neither moves the other's icons, and opening either column moves nothing.
   */
  @property({ attribute: false }) extraRailNodes?: Node[];
  /** Which rail shows: the column's own, or the merged one. */
  @property({ attribute: "rail-view" }) railView: "own" | "extra" = "own";
  /** The merged rail's column ("Side panel"): the switch's name. */
  @property({ attribute: "extra-label" }) extraLabel = "";
  /** Its rail is shown in the other column: it takes no room and shows only when open, as a sheet. */
  @property({ type: Boolean }) merged = false;

  /**
   * Before opening as a sheet: start its width transition from the rail's width in px. Switching
   * to sheet mode (same width, written as a length instead of a percentage) starts a width
   * transition of its own; finish it, so opening doesn't start from the stale push-mode width.
   */
  prepareSheet() {
    const panel = this.querySelector("[data-frame-panel]");
    if (!panel) return;
    void getComputedStyle(panel).width;
    for (const a of panel.getAnimations())
      if (a instanceof CSSTransition && a.transitionProperty === "width") a.finish();
  }

  private _ask(open: boolean) {
    this.dispatchEvent(new CustomEvent("ui-column-toggle", { detail: { open } }));
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("open") && changed.get("open") !== undefined) this.#fold(this.open);
  }

  /**
   * Opening or closing (its toggle, the shell): the list folds or unfolds with the column, as when
   * its edge is dragged. It shows over the rail at once, laid out open with its groups held shut
   * (`data-drag`), and its labels slide and fade on a tween (`menuFoldTween`) that plays with the
   * column's width spring (its start, delay, duration and easing) from as open as the column is
   * now. Once the column has sprung there, the list goes back to its state: open, its groups
   * unfold; closed, it gives way to the rail in one frame. Closing with groups open keeps the
   * list's own schedule (the groups fold first, then the column), and a drag drives its own fold.
   */
  #fold(open: boolean) {
    const list = this.querySelector<HTMLElement>("[data-frame-list]");
    const rail = this.querySelector<HTMLElement>("[data-frame-rail]");
    const panel = this.querySelector<HTMLElement>("[data-frame-panel]");
    const region = this.querySelector<HTMLElement>("[data-frame-region]");
    if (!list || !rail || !panel || !region) return;
    const current = listFolds.get(list);
    if (list.hasAttribute("data-drag") && !(current && columnFolds.has(current))) return;
    current?.cancel();
    listFolds.delete(list);
    if (!open && this._groupsOpen) {
      list.removeAttribute("data-drag");
      rail.removeAttribute("data-drag");
      return;
    }
    list.setAttribute("data-drag", "");
    rail.setAttribute("data-drag", "");
    // How open it is now (its width: the rail's 1 tile to the open column's 4), and its spring.
    const tile = tileW(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
    const from = (panel.getBoundingClientRect().width - tile) / (3 * tile);
    const fold = menuFoldTween(list);
    fold.seek(from);
    listFolds.set(list, fold);
    columnFolds.add(fold);
    const spring = [region, panel]
      .flatMap((el) => el.getAnimations())
      .find((a) => a instanceof CSSTransition && a.transitionProperty === "width");
    if (spring) fold.follow(spring, open ? 1 : 0);
    else fold.seek(open ? 1 : 0);
    if (spring) void motion.input([spring]);
    void (async () => {
      await spring?.finished.catch(() => undefined);
      if (listFolds.get(list) !== fold) return;
      const swap = open ? [] : [list, rail];
      for (const el of swap) el.setAttribute("data-drag-done", "");
      list.removeAttribute("data-drag");
      rail.removeAttribute("data-drag");
      await new Promise((r) => requestAnimationFrame(r));
      for (const el of swap) el.removeAttribute("data-drag-done");
      const settling = list.getAnimations({ subtree: true }).filter((a) => a instanceof CSSTransition);
      await Promise.all(settling.map((a) => a.finished.catch(() => undefined)));
      if (listFolds.get(list) === fold) {
        fold.cancel();
        listFolds.delete(list);
      }
    })();
  }

  render() {
    const { side, open, sheet, merged } = this;
    const what = this.label.toLowerCase();
    const extra = !!this.extraRailNodes?.length;
    const showExtra = extra && this.railView === "extra";
    // Closed with a merged rail, the toggle switches rails (the swap icon: it isn't a menu);
    // otherwise it opens and closes the column.
    const switches = extra && !open;
    const toggle = switches
      ? html`<button
          type="button"
          class=${iconButton({ class: appShellToggle({ column: side }) })}
          aria-label=${showExtra ? `Show ${what} icons` : `Show ${this.extraLabel.toLowerCase()} icons`}
          @click=${() => this.dispatchEvent(new CustomEvent("ui-rail-switch", { detail: { view: showExtra ? "own" : "extra" } }))}
        >
          ${iconSvg("swap", { size: "md" })}
        </button>`
      : html`<button
          type="button"
          class=${iconButton({ class: appShellToggle({ column: merged ? "start" : side }) })}
          aria-label=${open ? `Collapse ${what}` : `Expand ${what}`}
          aria-expanded=${open ? "true" : "false"}
          @click=${() => this._ask(!open)}
        >
          ${iconSvg(side === "start" ? "menu" : "menu-panel", { size: "md" })}
        </button>`;
    const panel = html`<div class=${appShellPanel({ side, open, sheet, merged })} data-frame-panel>
      ${toggle}
      <div class=${appShellStack({ fill: true })}>
        <div
          class=${appShellSlot({ scroll: true, class: appShellNavList({ side, state: open ? "shown" : "hidden" }) })}
          data-frame-list
        >
          ${this.slotted(this.listSlot)}
        </div>
        <div
          class=${appShellSlot({ scroll: true, class: appShellNavRail({ side, state: open ? "hidden" : "shown" }) })}
          data-frame-rail
        >
          ${
            extra
              ? html`<div class=${appShellRailGroups()}>
                  <div class=${appShellRailGroup({ shown: !showExtra, place: "start" })} ?inert=${showExtra}>
                    ${this.railNodes ?? this.slotted(this.railSlot)}
                  </div>
                  <div class=${appShellRailGroup({ shown: showExtra, place: "end" })} ?inert=${!showExtra}>
                    ${this.extraRailNodes}
                  </div>
                </div>`
              : (this.railNodes ?? this.slotted(this.railSlot))
          }
        </div>
      </div>
      ${this.hasSlotted(this.footerSlot) ? html`<div class=${appShellFooter()}>${this.slotted(this.footerSlot)}</div>` : nothing}
    </div>`;
    const column =
      side === "start"
        ? html`<nav
            class=${appShellColumn({ side, push: open && !sheet, merged })}
            aria-label=${this.label}
            data-frame-region
            ?data-groups-open=${this._groupsOpen}
          >
            ${panel}
          </nav>`
        : html`<aside
            class=${appShellColumn({ side, push: open && !sheet, merged })}
            aria-label=${this.label}
            data-frame-region
            ?data-groups-open=${this._groupsOpen}
          >
            ${panel}
          </aside>`;
    return html`${column}${open && sheet ? html`<div class=${appShellBackdrop()} @click=${() => this._ask(false)}></div>` : nothing}`;
  }
}

/** The motion tokens' values, read once each (they never change while the page runs). */
const motionTokens = new Map<string, string>();

/** How far a page slides as it enters (M3's shared axis: 30dp). */
const SLIDE = 30;

@customElement("ui-frame-main")
export class UiFrameMain extends LightElement {
  /** Full screen (a compact frame): only the corner by the header and rail stays round. */
  @property({ type: Boolean }) compact = false;
  /** The navigation is open beside the page: the panel starts after it. */
  @property({ type: Boolean, attribute: "push-start" }) pushStart = false;
  /** The side panel is open beside the page: the panel ends before it. */
  @property({ type: Boolean, attribute: "push-end" }) pushEnd = false;
  #pageAnimation?: Animation;

  /**
   * Plays an M3 transition pattern as a new page enters the main panel (call it once the new page
   * has rendered). The page that left is already gone, so only the entering half plays: the panel
   * shows nothing for a moment, as M3 wants (no cross-faded frames).
   */
  pageTransition(kind: PageTransition) {
    const page = this.querySelector("main > div");
    if (!(page instanceof HTMLElement)) return;
    // The motion tokens are read once: reading styles here, just after the new page went in, made
    // the browser restyle the whole page on the spot at every navigation.
    const token = (name: string) => {
      let v = motionTokens.get(name);
      if (v === undefined)
        motionTokens.set(name, (v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()));
      return v;
    };
    const ms = (name: string) => cssTime(token(name));
    const rtl = (this.closest("[dir]")?.getAttribute("dir") ?? document.dir) === "rtl" ? -1 : 1;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = (x: number) => `${x * rtl}px 0`;
    const [keyframes, options]: [Keyframe[], KeyframeAnimationOptions] = reduce
      ? [[{ opacity: 0 }, { opacity: 1 }], { duration: ms("--duration-short4"), easing: token("--ease-standard") }]
      : kind === "top-level"
        ? [
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: ms("--duration-medium1"), easing: token("--ease-emphasized-decelerate") },
          ]
        : kind === "forward" || kind === "backward"
          ? [
              [
                { opacity: 0, translate: from(kind === "forward" ? SLIDE : -SLIDE) },
                { opacity: 1, offset: 0.35 },
                { opacity: 1, translate: "0 0" },
              ],
              { duration: ms("--duration-medium2"), easing: token("--ease-emphasized-decelerate") },
            ]
          : [
              [{ translate: from(kind === "lateral-forward" ? SLIDE * 4 : -SLIDE * 4) }, { translate: "0 0" }],
              { duration: ms("--duration-medium2"), easing: token("--ease-emphasized-decelerate") },
            ];
    this.#pageAnimation?.cancel();
    this.#pageAnimation = page.animate(keyframes, options);
    void motion.input([this.#pageAnimation]);
  }

  /**
   * While a column opens or closes (its toggle, or its edge dragged), the page follows the main
   * panel's edge on every frame, so nothing is cut off or left beyond the screen; the springs are
   * input motion (`motion`), so follow and ambient motion waits for them. Laying the page out
   * again on each frame costs about 5ms since nothing restyles the whole page any more (an
   * inherited board value, daisyUI's `not-prose` rule: see AGENTS.md).
   */
  /** The springs of the columns' widths and the panel's edges, playing now. */
  #springs() {
    const frame = this.#frame();
    const boxes = [
      this.querySelector<HTMLElement>(":scope > div"),
      ...(frame?.querySelectorAll<HTMLElement>("[data-frame-region]:is(nav, aside), [data-frame-panel]") ?? []),
    ];
    return boxes
      .flatMap((el) => el?.getAnimations() ?? [])
      .filter((a): a is CSSTransition => a instanceof CSSTransition && /^(?:width|margin)/.test(a.transitionProperty));
  }

  protected updated(changed: PropertyValues<this>) {
    const moved = (k: "pushStart" | "pushEnd") => changed.has(k) && changed.get(k) !== undefined;
    if (!moved("pushStart") && !moved("pushEnd")) return;
    const springs = this.#springs();
    const settled = motion.input(springs);
    // How much narrower the page will be once the panel's edges have sprung there (its margins'
    // springs, from where they start to where they end): its boards place their tiles for that
    // width from the start, so none is ever beyond the panel's edge (`UiBoard.expectWidth`).
    const center = this.querySelector<HTMLElement>(":scope > div");
    let delta = 0;
    for (const a of springs) {
      if ((a.effect as KeyframeEffect | null)?.target !== center || !a.transitionProperty.startsWith("margin"))
        continue;
      const frames = (a.effect as KeyframeEffect).getKeyframes();
      const value = (f?: Keyframe) =>
        parseFloat(String(Object.entries(f ?? {}).find(([k]) => k.startsWith("margin"))?.[1] ?? 0));
      delta += value(frames.at(-1)) - value(frames[0]);
    }
    if (!delta) return;
    for (const board of this.querySelectorAll<HTMLElement & { expectWidth?: (d: number, s: Promise<unknown>) => void }>(
      "main > div ui-board",
    ))
      if (!board.parentElement?.closest("ui-board")) board.expectWidth?.(delta, settled);
  }

  /** The column next to each edge's name ("Navigation", "Side panel"): the handles' accessible names. */
  @property({ attribute: "start-label" }) startLabel = "";
  @property({ attribute: "end-label" }) endLabel = "";

  /** The drag in progress: its side, where it started and whether that column was open. */
  #drag?: { side: "start" | "end"; x: number; open: boolean; dx: number; id: number };

  /** Each column's list's fold while its edge is dragged and the column springs on (`menuFoldTween`). */
  #folds: Partial<Record<"start" | "end", MenuFoldTween>> = {};

  /** How far a column's edge travels between closed and open: its open width less its rail (3 tiles). */
  #span() {
    return 3 * tileW(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16);
  }

  /** The frame's root, which carries the drag's state (`data-drag-*`) for the columns and the panel. */
  #frame() {
    return this.closest("[data-frame]") as HTMLElement | null;
  }

  /** The elements that read a side's drag values: its column, the main panel's box, its list. */
  #targets(side: "start" | "end") {
    const column = this.#frame()?.querySelector<HTMLElement>(
      side === "start" ? "nav[data-frame-region]" : "aside[data-frame-region]",
    );
    return {
      column,
      center: this.querySelector<HTMLElement>(":scope > div"),
      list: column?.querySelector<HTMLElement>("[data-frame-list]") ?? null,
    };
  }

  /**
   * The column's list shows the drag (and the snap after it) over its rail: `data-drag` on the list
   * and the rail themselves. The column (`data-drag`) and the main panel's box (`data-drag-start` /
   * `-end`) carry it too, until the column has sprung to where it snapped: their springs start at
   * once, not after open groups have folded (`--settle-spatial`), as the drag already holds the
   * groups shut. On them, not on the frame: a rule keyed to an attribute on the frame
   * with a part under the list (`[&_li]`, `[&_details…]`) has the browser restyle everything in the
   * frame when it changes (about 70ms with the dashboard open), and on the list only the list.
   */
  #listDrag(side: "start" | "end", on: boolean) {
    const { column, center } = this.#targets(side);
    for (const el of column?.querySelectorAll("[data-frame-list], [data-frame-rail]") ?? [])
      el.toggleAttribute("data-drag", on);
    column?.toggleAttribute("data-drag", on);
    center?.toggleAttribute(`data-drag-${side}`, on);
  }

  /** Sets (or, with null, clears) a drag value on the elements that read it. */
  #set(side: "start" | "end", name: string, value: string | null) {
    const t = this.#targets(side);
    for (const el of [t.column, t.center]) {
      if (value === null) el?.style.removeProperty(name);
      else el?.style.setProperty(name, value);
    }
  }

  #open(side: "start" | "end") {
    return side === "start" ? this.pushStart : this.pushEnd;
  }

  /** Opening or closing a column from its edge: the shell decides (it may open it as a sheet). */
  #ask(side: "start" | "end", open: boolean) {
    this.dispatchEvent(new CustomEvent("ui-frame-drag", { detail: { side, open }, bubbles: true, composed: true }));
  }

  #down = (side: "start" | "end", e: PointerEvent) => {
    if (e.button !== 0) return;
    // Keep the pointer's moves while it's outside the thin handle (a pen or touch may refuse it).
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* the handle still follows the moves that reach it */
    }
    this.#drag = { side, x: e.clientX, open: this.#open(side), dx: 0, id: e.pointerId };
    // The frame carries the drag, so the column (its width, its list) and the panel follow it.
    this.#frame()?.setAttribute(`data-drag-${side}`, "");
    // The column's list shows the drag (and the snap after it) over its rail.
    this.#listDrag(side, true);
    // Its fold, as open as the column: the drag scrubs it (in place of any fold still playing).
    this.#folds[side]?.cancel();
    const list = this.#targets(side).list;
    if (list) listFolds.get(list)?.cancel();
    const fold = list ? menuFoldTween(list) : undefined;
    fold?.seek(this.#open(side) ? 1 : 0);
    this.#folds[side] = fold;
    if (list && fold) listFolds.set(list, fold);
    (e.currentTarget as HTMLElement).setAttribute("data-dragging", "");
  };

  #move = (e: PointerEvent) => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    const rtl = getComputedStyle(this).direction === "rtl" ? -1 : 1;
    // Towards the page opens the column: rightwards for the start edge, leftwards for the end one.
    const raw = (e.clientX - d.x) * rtl * (d.side === "start" ? 1 : -1);
    const span = this.#span();
    d.dx = d.open ? Math.min(0, Math.max(-span, raw)) : Math.min(span, Math.max(0, raw));
    // An open column's drag and a closed one's are separate values (see `#up`).
    this.#set(d.side, `--drag-${d.side}${d.open ? "-o" : ""}`, `${d.dx}px`);
    // The list folds exactly as far as the column is open, 0 (its rail) to 1 (open).
    this.#folds[d.side]?.seek((d.open ? span + d.dx : d.dx) / span);
  };

  #up = (e: PointerEvent) => {
    const d = this.#drag;
    if (!d || e.pointerId !== d.id) return;
    this.#drag = undefined;
    (e.currentTarget as HTMLElement).removeAttribute("data-dragging");
    // Snaps to the nearer state: past half its travel, the column changes. The drag ends and the
    // column's state changes in the same frame, so its width, its labels and the panel's edge
    // spring on from where the drag left them.
    const half = this.#span() / 2;
    const open = d.open ? d.dx > -half : d.dx > half;
    const frame = this.#frame();
    const name = `--drag-${d.side}${d.open ? "-o" : ""}`;
    // Transitions back on, and the drag carries the column the rest of the way: all of its travel
    // when it changes state, none when it springs back. Its state then changes to a width that is
    // already the drag's target (the other state's drag value is 0), so nothing retargets: the
    // column, its labels and the panel's edge spring on from where the pointer left them.
    frame?.removeAttribute(`data-drag-${d.side}`);
    if (open !== d.open) this.#set(d.side, name, `${d.open ? -this.#span() : this.#span()}px`);
    else this.#set(d.side, name, null);
    const fold = this.#folds[d.side];
    // Once the width has sprung there, the column's state alone holds it. The fold goes once the
    // list's own transitions into that state have run (closed, it hides after its labels have
    // faded under the fold's): letting go of it sooner would show them fading again from open.
    const handBack = async () => {
      // Closed, the list has already folded into the rail's look under the fold: it gives way to
      // the rail in this frame (`data-drag-done`: no transitions), not on the button's schedule
      // (which waits for open groups to fold, and would show the list's open groups squeezed into
      // the rail meanwhile).
      const swap = open
        ? []
        : [...(this.#targets(d.side).column?.querySelectorAll("[data-frame-list], [data-frame-rail]") ?? [])];
      for (const el of swap) el.setAttribute("data-drag-done", "");
      this.#listDrag(d.side, false);
      this.#set(d.side, name, null);
      const list = this.#targets(d.side).list;
      await new Promise((r) => requestAnimationFrame(r));
      for (const el of swap) el.removeAttribute("data-drag-done");
      const settling = (list?.getAnimations({ subtree: true }) ?? []).filter((a) => a instanceof CSSTransition);
      await Promise.all(settling.map((a) => a.finished.catch(() => undefined)));
      if (this.#folds[d.side] === fold) {
        fold?.cancel();
        delete this.#folds[d.side];
        if (list && listFolds.get(list) === fold) listFolds.delete(list);
      }
    };
    if (open !== d.open) this.#ask(d.side, open);
    // Hands back once the column's width has finished springing to where it snapped: its width
    // animation's end, or at once when there's none (it was already there: dragged all the way, no
    // travel, or Reduce motion). Read after the column has taken its new state (two frames).
    const column = frame?.querySelector<HTMLElement>(
      d.side === "start" ? "nav[data-frame-region]" : "aside[data-frame-region]",
    );
    const widthMoves = () =>
      (column?.getAnimations() ?? []).filter((a) => a instanceof CSSTransition && a.transitionProperty === "width");
    // The fold plays on with the width (its start, delay, duration and spring) to where it
    // snapped, from this frame: the width's spring starts now (reading its animations brings the
    // column's style up to date).
    const spring = widthMoves()[0];
    if (spring) fold?.follow(spring, open ? 1 : 0);
    else fold?.seek(open ? 1 : 0);
    void (async () => {
      for (let i = 0; i < 2; i++) await new Promise((r) => requestAnimationFrame(r));
      const moving = widthMoves();
      // The column's new state may have started its spring over (a sheet, say): follow that one.
      if (this.#folds[d.side] === fold && moving[0] && moving[0] !== spring) fold?.follow(moving[0], open ? 1 : 0);
      await Promise.all(moving.map((a) => a.finished.catch(() => undefined)));
      // Another drag may have started on this side since: it owns the values now.
      if (this.#drag?.side !== d.side) await handBack();
    })();
  };

  #key = (side: "start" | "end", e: KeyboardEvent) => {
    const rtl = getComputedStyle(this).direction === "rtl";
    const toward = (side === "start") !== rtl ? "ArrowRight" : "ArrowLeft";
    const away = toward === "ArrowRight" ? "ArrowLeft" : "ArrowRight";
    const open = this.#open(side);
    if (e.key === "Enter" || e.key === " ") this.#ask(side, !open);
    else if (e.key === toward && !open) this.#ask(side, true);
    else if (e.key === away && open) this.#ask(side, false);
    else return;
    e.preventDefault();
  };

  /**
   * A handle is reached by Tab (it shows its focus outline then), never focused by a mouse press:
   * focused that way, a later key such as Alt would count as keyboard use and outline it.
   */
  #handle(side: "start" | "end") {
    const label = side === "start" ? this.startLabel : this.endLabel;
    const open = this.#open(side);
    return html`<div
      class=${appShellDragHandle({ side })}
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      aria-label=${label ? `Resize to ${open ? "close" : "open"} ${label.toLowerCase()}` : "Resize"}
      aria-valuemin="0"
      aria-valuemax="1"
      aria-valuenow=${open ? 1 : 0}
      title=${label ? `Drag to ${open ? "close" : "open"} ${label.toLowerCase()}` : ""}
      @pointerdown=${(e: PointerEvent) => this.#down(side, e)}
      @mousedown=${(e: MouseEvent) => e.preventDefault()}
      @pointermove=${this.#move}
      @pointerup=${this.#up}
      @pointercancel=${this.#up}
      @keydown=${(e: KeyboardEvent) => this.#key(side, e)}
    ></div>`;
  }

  /** The frame cuts its shell's hole around this window (`UiFrame.watchWindow`). */
  protected firstUpdated() {
    const main = this.querySelector("main");
    const frame = this.closest("ui-frame") as UiFrame | null;
    if (main && frame) frame.watchWindow(main);
  }

  render() {
    return html`<div class=${appShellCenter({ pushStart: this.pushStart, pushEnd: this.pushEnd })}>
      <div class=${appShellWell()}>
        <main class=${appShellMain({ compact: this.compact })}>
          <div class=${appShellPage()}>${this.slotted()}</div>
        </main>
        <div class=${appShellLip({ compact: this.compact })} aria-hidden="true" data-frame-lip></div>
      </div>
      ${this.hasSlotted("footer") ? html`<footer class=${appShellPageFooter()} data-frame-region>${this.slotted("footer")}</footer>` : nothing}
      ${this.#handle("start")} ${this.compact ? nothing : this.#handle("end")}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-frame": UiFrame;
    "ui-frame-header": UiFrameHeader;
    "ui-frame-column": UiFrameColumn;
    "ui-frame-main": UiFrameMain;
  }
}
