import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { cssLuminance, lumaOf, sampleBehind, scrimFor, type Luma, type Rect } from "./legibility.ts";

/**
 * App shell: the application frame — a header (brand, centred search, actions), a
 * collapsible navigation column, a rounded main panel that scrolls on its own, and a
 * collapsible side panel. The header and the closed columns share one surface; the
 * main panel sits on top of it, fully inside the viewport (Material-style app frame).
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy; replaces daisyUI drawer + navbar)
 *
 * Two columns built the same way, one each side of the main panel: a toggle (the same in both
 * states, never moving), then the open list or, closed, its rail — the same menu, icons only.
 * - start (navigation): `slot="nav"` (`<ui-menu layout="nav">`) / `slot="rail"` (`layout="rail"`)
 * - end (side panel): `slot="aside"` / `slot="aside-rail"`, likewise
 *
 * Motion is CSS only (`nav-open` / `aside-open` flip) on Material Design 3 expressive springs
 * (src/styles/motion.css), in two back-to-back steps (the second starts as the first settles,
 * `--settle-spatial`, with no pause):
 * - opening: the column widens while the labels slide and fade in and the highlight grows
 *   from the rail's icon pill → open groups expand (the highlight follows to the active page).
 * - closing: open groups collapse (the highlight moves to its group) → the column shrinks while
 *   labels slide and fade out and the highlight folds to the icon pill; the rail then takes
 *   over. With no group open, closing starts with the second step.
 * The groups' own open state is never changed, so they come back as they were.
 *
 * Space: both rails are always shown, and the main panel never gets narrower than what a
 * 320px screen leaves it beside them (`MAIN_MIN`). Opening a column pushes the main panel when
 * there is room; otherwise it first closes the other column if that makes room, and failing that
 * opens as a sheet over the page (its rail keeps its place) with everything else dimmed. When the
 * window shrinks, open columns close (side panel first) until the main panel fits again.
 */
/** One column that never grows past the viewport, whatever the page inside needs. */
export const appShell = rcva(
  /* A faint wash of the theme's primary / secondary / accent at the corners: the frame the header
     and rails sit on, and what the floating glass (sheets, menus, dialogs) refracts. Under it, the
     chosen background image (`--app-background`, set by `<ui-theme-controller as="background">`)
     behind one scrim (`--app-scrim`, chosen from the image so text on it stays readable). */
  "group/shell grid h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-base-200 [background-image:radial-gradient(70%_60%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%),radial-gradient(60%_55%_at_100%_100%,color-mix(in_oklab,var(--color-secondary)_12%,transparent),transparent_70%),radial-gradient(45%_40%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_70%),linear-gradient(var(--app-scrim,transparent),var(--app-scrim,transparent)),var(--app-background,none)] bg-cover bg-center text-base-content",
  {
    variants: {
      /**
       * Until the first paint: no transitions inside the shell, so a reload shows the final
       * layout at once (open columns, expanded groups) instead of animating into it.
       */
      settling: { true: "[&_*]:transition-none!" },
    },
  },
);

/**
 * Header: brand, the search (centred in the room left between brand and actions; it collapses
 * to an icon when that room gets small — a container query, not a screen breakpoint), actions.
 */
export const appShellHeader = rcva("flex h-16 items-center gap-[clamp(0.5rem,1vw,1rem)] px-(--frame-edge)");
export const appShellHeaderStart = rcva("flex min-w-0 shrink-0 items-center gap-1");
export const appShellBrand = rcva("gap-2 rounded-full px-3 text-lg font-semibold tracking-tight");
/** The brand's mark (`brand-icon`): primary, on a soft primary disc. */
export const appShellBrandMark = rcva("grid size-8 place-items-center rounded-full bg-primary/15 text-primary");
export const appShellSearch = rcva("@container flex min-w-0 flex-1 justify-center");
export const appShellActions = rcva("flex shrink-0 items-center justify-end gap-1");

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
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-has-[nav_details[open]]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
    {
      side: "end",
      lifted: false,
      class:
        "[transition:z-index_0s_allow-discrete_var(--duration-spatial)] group-has-[aside_details[open]]/shell:[transition:z-index_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial))]",
    },
  ],
});

/**
 * The frame around the main panel. Its sizes are fluid (`--frame-*`, src/styles/theme.css):
 * they scale with the window from a 320px phone to a 1280px desktop, with no breakpoints.
 */
export const appShellBody = rcva("flex min-h-0 gap-(--frame-gap) px-(--frame-edge) pb-(--frame-edge)");

/**
 * A column (`side="start"`: navigation, `"end"`: side panel) as it takes up room in the layout:
 * its open width when it pushes the main panel, the rail (`--frame-rail`) otherwise (closed, or
 * open as a sheet). Resizes on M3's default spatial spring (src/styles/motion.css).
 */
export const appShellColumn = rcva(
  "group/column flex min-h-0 shrink-0 flex-col transition-[width] ease-spatial duration-(--duration-spatial) motion-reduce:transition-none",
  {
    variants: {
      side: { start: "", end: "" },
      /** Open and pushing the main panel. */
      push: {
        true: "delay-0",
        /** Shrinks once open groups have collapsed. */
        false: "w-(--frame-rail) delay-0 has-[details[open]]:delay-(--settle-spatial)",
      },
    },
    compoundVariants: [
      { side: "start", push: true, class: "w-72" },
      { side: "end", push: true, class: "w-80" },
    ],
  },
);

/**
 * What a column shows: its toggle and menus. Inset so the 44px icon pills (and the toggle) sit
 * centred in the rail: `(--frame-rail − 2.75rem) / 2` from the column's edges. Each panel also
 * reaches over the frame's edge padding (a transparent border), so as a sheet it can meet the
 * screen edge without its icons moving. As a sheet it is lifted out of the layout (`fixed`, over
 * a backdrop) and widens there; closing, it stays lifted until it has folded back into the rail.
 */
export const appShellPanel = rcva(
  "flex h-full min-h-0 flex-col gap-3 overflow-hidden border-transparent px-[calc((var(--frame-rail)_-_2.75rem)/2)] motion-reduce:transition-none",
  {
    variants: {
      side: {
        start: "-ms-(--frame-edge) border-s-(length:--frame-edge)",
        end: "-me-(--frame-edge) border-e-(length:--frame-edge)",
      },
      open: { true: "", false: "" },
      sheet: { true: "", false: "" },
    },
    compoundVariants: [
      /*
       * Pushing: the panel is exactly its column plus the edge padding at every frame, and its
       * inset springs exactly like the column's width (same curve, duration and delay), so the
       * rail's icons and the toggle stay centred while the rail resizes with the window.
       */
      {
        sheet: false,
        class:
          "w-[calc(100%_+_var(--frame-edge))] transition-[padding] ease-spatial duration-(--duration-spatial) delay-0 has-[details[open]]:delay-(--settle-spatial)",
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
          "fixed inset-y-0 z-40 max-w-full liquid-glass pt-16 pb-(--frame-edge) shadow-2xl [transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete,z-index_0s_allow-discrete]",
      },
      {
        sheet: true,
        open: true,
        side: "start",
        class: "start-0 ms-0 w-[calc(18rem_+_var(--frame-edge))] rounded-e-[2rem]",
      },
      {
        sheet: true,
        open: true,
        side: "end",
        class: "end-0 me-0 w-[calc(20rem_+_var(--frame-edge))] rounded-s-[2rem]",
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
          "[transition:all_0s_allow-discrete_var(--duration-spatial),width_var(--duration-spatial)_var(--ease-spatial)_0s] has-[details[open]]:[transition:all_0s_allow-discrete_calc(var(--settle-spatial)_+_var(--duration-spatial)),width_var(--duration-spatial)_var(--ease-spatial)_var(--settle-spatial)]",
      },
    ],
  },
);

export const appShellMain = rcva(
  /*
   * Never narrower than what a 320px screen leaves beside both rails (MAIN_MIN: 320 − 2×48 −
   * 2×2 gaps − 2×2 edges). A size container (`main`), so pages size themselves to the panel
   * (container units, container queries), not to the window. Its scrollbar stays inside the
   * rounded corners (`--scrollbar-inset`, src/index.css).
   */
  "@container/main min-w-[13.5rem] flex-1 overflow-y-auto overscroll-contain rounded-(--main-radius) liquid-glass-surface [--main-radius:clamp(1rem,3vw,2rem)] [--scrollbar-inset:var(--main-radius)]",
);

/**
 * A column's toggle: centred on its icon axis (where the rail's icons are centred, 2px inside
 * the 44px pill), at the same spot whether the column is open or closed.
 */
export const appShellToggle = rcva("shrink-0", {
  variants: {
    column: { start: "ms-0.5", end: "me-0.5 self-end" },
  },
});

/** Dims the page behind a sheet (lightly: the sheet's glass already sets it apart). */
export const appShellBackdrop = rcva(
  "fixed inset-0 z-30 bg-neutral/30 transition-opacity ease-effects duration-(--duration-effects) starting:opacity-0 motion-reduce:transition-none",
);

/**
 * A column's footer (`slot="nav-footer"` / `"aside-footer"`): pinned under the menus, on the same
 * icon axis as the column's toggle (e.g. an account switcher), in every state — rail, open, sheet.
 */
export const appShellFooter = rcva("flex shrink-0 ps-0.5 pb-1");

/** Wrapper that keeps a slot's nodes mounted while hidden. */
export const appShellSlot = rcva("flex min-h-0 w-full flex-col gap-3", {
  variants: {
    hidden: { true: "hidden" },
    /** The scrolling part of a column (its toggle stays put above it). */
    scroll: { true: "flex-1 overflow-x-hidden overflow-y-auto overscroll-contain" },
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
    state: {
      /** Unfold at once; groups expand as the column settles. */
      shown: `visible [--menu-collapse:0] [--menu-expanded:1] [transition:visibility_0s,--menu-collapse_0s,--menu-expanded_0s_var(--settle-spatial)] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-(--settle-spatial) [&_li>details>ul]:starting:[block-size:0] motion-reduce:[&_li>details>ul]:transition-none`,
      /** Groups collapse first; fold as they settle; hand over to the rail once folded. */
      hidden: `invisible [--menu-collapse:1] [--menu-expanded:0] [transition:visibility_0s_var(--settle-spatial),--menu-collapse_0s,--menu-expanded_0s] group-has-[details[open]]/column:[transition:visibility_0s_calc(var(--settle-spatial)_*_2),--menu-collapse_0s_var(--settle-spatial),--menu-expanded_0s] [&_li>details>ul]:overflow-hidden [&_li>details>ul]:[block-size:0] [&_li>details>ul]:transition-[block-size] [&_li>details>ul]:duration-(--duration-spatial) [&_li>details>ul]:ease-spatial [&_li>details>ul]:delay-0 motion-reduce:[&_li>details>ul]:transition-none`,
    },
  },
});
export const appShellNavRail = rcva("transition-[visibility] duration-0 motion-reduce:delay-0", {
  variants: {
    state: {
      /** Takes over once the list has folded into its look. */
      shown:
        "visible delay-(--settle-spatial) group-has-[details[open]]/column:delay-[calc(var(--settle-spatial)_*_2)]",
      hidden: "invisible delay-0",
    },
  },
});

/** Stacks a column's two views in one grid cell, so the one on its way out never pushes the other. */
export const appShellStack = rcva("grid w-full min-h-0 grid-cols-[minmax(0,1fr)] [&>*]:[grid-area:1/1]", {
  variants: {
    /** Fill the column below its toggle (navigation lists). */
    fill: { true: "flex-1 grid-rows-[minmax(0,1fr)]" },
  },
});

export type AppShellColumnVariants = VariantProps<typeof appShellColumn>;

/**
 * @example
 * <ui-app-shell brand="Golden Sea" brand-icon="anchor" brand-href="/" nav-open>
 *   <ui-text-input slot="search" type="search" icon="search" width="full"></ui-text-input>
 *   <ui-theme-controller slot="actions" as="swap"></ui-theme-controller>
 *   <ui-menu slot="nav" .items=${items}></ui-menu>
 *   <ui-menu slot="rail" layout="rail" .items=${railItems}></ui-menu>
 *   <ui-menu slot="aside" layout="nav" .items=${sections}></ui-menu>
 *   <ui-menu slot="aside-rail" layout="rail" .items=${sectionRail}></ui-menu>
 *   Page content
 * </ui-app-shell>
 *
 * `nav-open` / `aside-open` reflect the columns' state; the built-in toggles flip them
 * and fire `ui-change` with `{ nav, aside }`. Escape closes a floating column.
 */
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

/** Open widths the room checks use (px; they mirror the recipes above). */
const NAV_OPEN = 288; // w-72
const ASIDE_OPEN = 320; // w-80
/** The frame's live fluid sizes (`--frame-*`, registered so they compute to px): a rail, and gaps + edges. */
const frame = () => {
  const css = getComputedStyle(document.documentElement);
  const px = (name: string) => parseFloat(css.getPropertyValue(name)) || 0;
  return { rail: px("--frame-rail"), chrome: 2 * px("--frame-gap") + 2 * px("--frame-edge") };
};
/** The main panel's minimum: what the smallest supported screen (320px) leaves beside both rails. */
const MAIN_MIN = 320 - 2 * 48 - 2 * 2 - 2 * 2;

@customElement("ui-app-shell")
export class UiAppShell extends LightElement {
  @property() brand: Renderable = "";
  @property({ attribute: "brand-href" }) brandHref?: string;
  /** Mark shown before the brand name. */
  @property({ attribute: "brand-icon" }) brandIcon?: IconName;
  @property({ type: Boolean, reflect: true, attribute: "nav-open" }) navOpen = false;
  @property({ type: Boolean, reflect: true, attribute: "aside-open" }) asideOpen = false;
  @property({ attribute: "nav-label" }) navLabel = "Navigation";
  @property({ attribute: "aside-label" }) asideLabel = "Side panel";

  /** Open columns shown as sheets over the page (no room to push the main panel). */
  @state() private _navSheet = false;
  @state() private _asideSheet = false;
  /** True until the first paint (see `appShell`'s `settling`). */
  @state() private _settling = true;

  /** Before the first render: fit the saved open columns to the window, so nothing shifts after. */
  protected willUpdate() {
    if (!this.hasUpdated) this._refit();
  }

  protected firstUpdated() {
    // Two frames: the first paint happens with transitions off, then they come on.
    requestAnimationFrame(() => requestAnimationFrame(() => (this._settling = false)));
    for (const el of this.querySelectorAll(
      ":scope > div > header, :scope > div > div > nav, :scope > div > div > aside",
    ))
      this.#regions.observe(el);
    void this._onBackground();
  }

  /* ------------------------------------------------------------ legible chrome over a background image */

  /**
   * Text over the background image stays readable whatever the image, in the theme's own colours:
   * one scrim of the theme's surface (base-200) over the whole image, just strong enough that the
   * theme's text (base-content) keeps its contrast over the pixels behind all the text regions
   * together (header, both columns; ./legibility.ts). Re-measured when the image, the theme or
   * colour scheme, or a region's size changes.
   */
  @state() private _chrome: Record<string, string> = {};
  #luma: { src: string; luma: Luma } | null = null;
  #frame = 0;
  #regions = new ResizeObserver(() => this._measureSoon());

  private _onBackground = async () => {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--app-background").trim();
    const src = /^url\((['"]?)(.*)\1\)$/.exec(value)?.[2];
    if (!src) {
      this.#luma = null;
      this._chrome = {};
      return;
    }
    if (this.#luma?.src !== src) {
      const image = new Image();
      image.src = src;
      try {
        await image.decode();
      } catch {
        return;
      }
      this.#luma = { src, luma: lumaOf(image) };
    }
    this._measure();
  };

  #dark = matchMedia("(prefers-color-scheme: dark)");
  #themeAttrs = new MutationObserver(() => this._measureSoon());
  private _measureSoonBound = () => this._measureSoon();

  private _measureSoon() {
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => this._measure());
  }

  private _measure() {
    const shell = this.firstElementChild;
    if (!this.#luma || !shell) return;
    const frame = shell.getBoundingClientRect();
    const samples = [":scope > header", ":scope > div > nav", ":scope > div > aside"].flatMap((sel) => {
      const r = shell.querySelector(sel)?.getBoundingClientRect();
      return r && r.width && r.height ? sampleBehind(this.#luma!.luma, frame, r) : [];
    });
    if (!samples.length) return;
    // The shell's own colour and background are the theme's base-content and base-200.
    const css = getComputedStyle(shell);
    this.#scrim = { ink: cssLuminance(css.color), surface: cssLuminance(css.backgroundColor) };
    // Plan for the faintest text the frame uses (muted labels at ~65% of the ink, so their
    // luminance sits ~35% of the way to the surface), at AA plus headroom, over 95% of the pixels.
    const muted = this.#scrim.ink + 0.35 * (this.#scrim.surface - this.#scrim.ink);
    this.#scrim.alpha = scrimFor(samples, muted, this.#scrim.surface, 5, 0.12, 0.94, 0.95);
    this._chrome = {
      "--app-scrim": `color-mix(in oklab, var(--color-base-200) ${(this.#scrim.alpha * 100).toFixed(1)}%, transparent)`,
    };
  }

  #scrim: { ink: number; surface: number; alpha?: number } = { ink: 0, surface: 0 };

  /**
   * Luminances of what the frame shows behind `rect` (the background image under its scrim), or
   * `null` without a background image — for contrast audits (`<ui-contrast-audit>`).
   */
  backdropAt(rect: Rect): number[] | null {
    const shell = this.firstElementChild;
    if (!this.#luma || !shell || this.#scrim.alpha == null) return null;
    const a = this.#scrim.alpha;
    return sampleBehind(this.#luma.luma, shell.getBoundingClientRect(), rect, 8).map(
      (l) => a * this.#scrim.surface + (1 - a) * l,
    );
  }

  /** The theme or colour scheme changed (a theme controller in the header): re-measure once it's applied. */
  private _onThemeChange = (e: Event) => {
    if ((e.target as Element | null)?.tagName !== "UI-THEME-CONTROLLER") return;
    setTimeout(() => this._measureSoon(), 50);
  };

  /** Room a column takes in the layout: open width when pushing, else its rail. */
  private _room(side: "start" | "end", open: boolean, sheet: boolean) {
    return open && !sheet ? (side === "start" ? NAV_OPEN : ASIDE_OPEN) : frame().rail;
  }

  /** Whether the main panel keeps its minimum width with the columns taking this much room. */
  private _fits(nav: number, aside: number) {
    return document.documentElement.clientWidth >= nav + aside + frame().chrome + MAIN_MIN;
  }

  async toggleNav(open = !this.navOpen) {
    if (!open) return this._set(false, this.asideOpen);
    const aside = this._room("end", this.asideOpen, this._asideSheet);
    if (this._fits(NAV_OPEN, aside)) this._navSheet = false;
    else if (this.asideOpen && !this._asideSheet && this._fits(NAV_OPEN, frame().rail)) {
      this._navSheet = false;
      return this._set(true, false); // make room by closing the side panel
    } else await this._toSheet("start");
    this._set(true, this.asideOpen);
  }

  async toggleAside(open = !this.asideOpen) {
    if (!open) return this._set(this.navOpen, false);
    const nav = this._room("start", this.navOpen, this._navSheet);
    if (this._fits(nav, ASIDE_OPEN)) this._asideSheet = false;
    else if (this.navOpen && !this._navSheet && this._fits(frame().rail, ASIDE_OPEN)) {
      this._asideSheet = false;
      return this._set(false, true); // make room by closing the navigation
    } else await this._toSheet("end");
    this._set(this.navOpen, true);
  }

  /**
   * Switch a closed column to sheet mode and let one frame render it (same look, explicit
   * width) before opening, so the sheet's width transition starts from the rail's width.
   */
  private async _toSheet(side: "start" | "end") {
    const was = side === "start" ? this._navSheet : this._asideSheet;
    if (side === "start") this._navSheet = true;
    else this._asideSheet = true;
    if (was) return;
    await this.updateComplete;
    // Make the browser compute the sheet's rail width now: otherwise the open state's transition
    // would start from the stale push-mode (percentage) width — i.e. the whole screen.
    // The switch itself (same width, written as a percentage vs. a length) also starts a width
    // transition; finish it so opening starts from the rail's width in px.
    const panel = this.querySelector(side === "start" ? "nav" : "aside")?.firstElementChild;
    if (panel) {
      void getComputedStyle(panel).width;
      for (const a of panel.getAnimations())
        if (a instanceof CSSTransition && a.transitionProperty === "width") a.finish();
    }
  }

  /** Window resized (or first layout): close pushing columns, side panel first, until the main panel fits. */
  private _refit = () => {
    let nav = this.navOpen;
    let aside = this.asideOpen;
    const room = () => this._room("start", nav, this._navSheet) + this._room("end", aside, this._asideSheet);
    if (aside && !this._asideSheet && !this._fits(0, room())) aside = false;
    if (nav && !this._navSheet && !this._fits(0, room())) nav = false;
    this._set(nav, aside);
  };
  #resize = new ResizeObserver(() => this._refit());

  private _set(nav: boolean, aside: boolean) {
    if (nav === this.navOpen && aside === this.asideOpen) return;
    this.navOpen = nav;
    this.asideOpen = aside;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { nav, aside }, bubbles: true }));
  }

  /** Escape closes an open sheet. */
  /**
   * Navigating anywhere (a sidebar link, the search palette, back/forward — the app navigates with
   * the History API and a `popstate`) closes an open sheet: it covers the page you went to. A
   * column pushing the main panel stays open: the user closes it.
   */
  private _onNavigate = () => {
    if (this.navOpen && this._navSheet) void this.toggleNav(false);
    if (this.asideOpen && this._asideSheet) void this.toggleAside(false);
  };

  private _onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (this.navOpen && this._navSheet) void this.toggleNav(false);
    else if (this.asideOpen && this._asideSheet) void this.toggleAside(false);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._onKey);
    window.addEventListener("popstate", this._onNavigate);
    window.addEventListener("ui-background", this._onBackground);
    this.addEventListener("ui-change", this._onThemeChange);
    // Any theme or colour-scheme change (however it's made) changes the ink the scrim is sized for.
    this.#themeAttrs.observe(document.documentElement, { attributeFilter: ["data-theme", "data-scheme"] });
    this.#dark.addEventListener("change", this._measureSoonBound);
    this.#resize.observe(document.documentElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._onKey);
    window.removeEventListener("popstate", this._onNavigate);
    window.removeEventListener("ui-background", this._onBackground);
    this.removeEventListener("ui-change", this._onThemeChange);
    this.#themeAttrs.disconnect();
    this.#dark.removeEventListener("change", this._measureSoonBound);
    this.#resize.disconnect();
    this.#regions.disconnect();
    cancelAnimationFrame(this.#frame);
  }

  private _toggle(label: string, icon: "menu" | "menu-panel", onClick: () => void, column: "start" | "end") {
    return html`<button
      type="button"
      class=${button({ variant: "ghost", shape: "circle", class: appShellToggle({ column }) })}
      aria-label=${label}
      @click=${onClick}
    >
      ${iconSvg(icon, { size: "md" })}
    </button>`;
  }

  /** A column's panel: its toggle and its two stacked menus (open list and rail). */
  private _panel(
    side: "start" | "end",
    open: boolean,
    sheet: boolean,
    label: string,
    toggle: () => void,
    list: string,
    rail: string,
  ) {
    const what = label.toLowerCase();
    return html`<div class=${appShellPanel({ side, open, sheet })}>
      ${this._toggle(open ? `Collapse ${what}` : `Expand ${what}`, side === "start" ? "menu" : "menu-panel", toggle, side)}
      <div class=${appShellStack({ fill: true })}>
        <div class=${appShellSlot({ scroll: true, class: appShellNavList({ state: open ? "shown" : "hidden" }) })}>
          ${this.slotted(list)}
        </div>
        <div class=${appShellSlot({ scroll: true, class: appShellNavRail({ state: open ? "hidden" : "shown" }) })}>
          ${this.slotted(rail)}
        </div>
      </div>
      ${this.hasSlotted(`${list}-footer`) ? html`<div class=${appShellFooter()}>${this.slotted(`${list}-footer`)}</div>` : nothing}
    </div>`;
  }

  render() {
    const brand = this.brand
      ? html`<a class=${button({ variant: "ghost", class: appShellBrand() })} href=${ifDefined(this.brandHref)}
          >${this.brandIcon ? html`<span class=${appShellBrandMark()}>${iconSvg(this.brandIcon, { size: "md" })}</span>` : nothing}<span
            >${this.brand}</span
          ></a
        >`
      : nothing;
    const navSheet = this.navOpen && this._navSheet;
    const asideSheet = this.asideOpen && this._asideSheet;
    return html`<div class=${appShell({ settling: this._settling })} style=${styleMap(this._chrome)}>
      <header class=${appShellHeader()}>
        <div class=${appShellHeaderStart({ class: appShellLift({ side: "start", lifted: navSheet }) })}>
          ${brand} ${this.slotted("start")}
        </div>
        <div class=${appShellSearch({ class: appShellLift({ side: "start", lifted: navSheet }) })}>
          ${this.slotted("search")}
        </div>
        <div class=${appShellActions({ class: appShellLift({ side: "end", lifted: asideSheet }) })}>
          ${this.slotted("actions")}
        </div>
      </header>
      <div class=${appShellBody()}>
        <nav
          class=${appShellColumn({ side: "start", push: this.navOpen && !this._navSheet })}
          aria-label=${this.navLabel}
        >
          ${this._panel("start", this.navOpen, this._navSheet, this.navLabel, () => this.toggleNav(), "nav", "rail")}
        </nav>
        <main class=${appShellMain()}>${this.slotted()}</main>
        <aside
          class=${appShellColumn({ side: "end", push: this.asideOpen && !this._asideSheet })}
          aria-label=${this.asideLabel}
        >
          ${this._panel("end", this.asideOpen, this._asideSheet, this.asideLabel, () => this.toggleAside(), "aside", "aside-rail")}
        </aside>
      </div>
      ${navSheet ? html`<div class=${appShellBackdrop()} @click=${() => this.toggleNav(false)}></div>` : nothing}
      ${asideSheet ? html`<div class=${appShellBackdrop()} @click=${() => this.toggleAside(false)}></div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-app-shell": UiAppShell;
  }
}
