import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

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
  "grid h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-base-200 text-base-content",
);

/**
 * Header: brand, the search (centred in the room left between brand and actions, shrinking to
 * an icon on phones), and actions.
 */
export const appShellHeader = rcva("flex h-16 items-center gap-2 px-3 md:gap-4 md:px-4");
export const appShellHeaderStart = rcva("flex min-w-0 shrink-0 items-center gap-1");
export const appShellBrand = rcva("btn btn-ghost gap-2 rounded-full px-3 text-lg font-semibold tracking-tight");
/** The brand's mark (`brand-icon`): primary, on a soft primary disc. */
export const appShellBrandMark = rcva("grid size-8 place-items-center rounded-full bg-primary/15 text-primary");
export const appShellSearch = rcva("flex min-w-0 flex-1 justify-end sm:justify-center");
export const appShellActions = rcva("flex shrink-0 items-center justify-end gap-1");

/** Below `md` the frame is compact: 2px gaps and padding, 48px rails (see `appShellColumn`). */
export const appShellBody = rcva("flex min-h-0 gap-0.5 pb-0.5 pe-0.5 md:gap-2 md:pb-3 md:pe-3");

/**
 * A column (`side="start"`: navigation, `"end"`: side panel) as it takes up room in the layout:
 * its open width when it pushes the main panel, the 96px rail otherwise (closed, or open as a
 * sheet). Resizes on M3's default spatial spring (src/styles/motion.css).
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
        false: "delay-0 has-[details[open]]:delay-(--settle-spatial) md:w-24",
      },
    },
    compoundVariants: [
      { side: "start", push: true, class: "w-72" },
      /* Closed below `md`: the 44px pill with 4px to the screen edge and 2px + a 2px gap to the main panel (the end column's edge padding is the frame's). */
      { side: "start", push: false, class: "w-[calc(3rem_+_0.125rem)]" },
      { side: "end", push: false, class: "w-12" },
      { side: "end", push: true, class: "w-80" },
    ],
  },
);

/**
 * What a column shows: its toggle and menus. Closed, both columns are 96px wide (below `md`: the 44px icon pill with 4px to each screen edge and to the main panel), so the rail's
 * icons sit on the icon axis, 48px from the outer edge — where the toggle sits too. As a sheet
 * it is lifted out of the layout (`fixed`, over a backdrop) and widens there; closing, it stays
 * lifted until it has folded back into the rail.
 */
export const appShellPanel = rcva(
  "flex h-full min-h-0 flex-col gap-3 overflow-hidden ps-0.5 md:ps-2 motion-reduce:transition-none",
  {
    variants: {
      /** The end column's panel reaches over the frame's end padding (a transparent border), so as a sheet it can meet the screen edge without its icons moving. */
      side: {
        start: "ps-1 md:ps-2",
        end: "-me-0.5 border-e-2 border-transparent pe-0.5 md:-me-3 md:border-e-12 md:pe-2",
      },
      open: { true: "pe-0.5 md:pe-2", false: "" },
      sheet: { true: "", false: "" },
    },
    compoundVariants: [
      /*
       * Pushing: the panel is exactly its column (the end one plus the frame's end padding) at
       * every frame, so its toggle never drifts while the column resizes.
       */
      { side: "start", sheet: false, class: "w-full" },
      { side: "end", sheet: false, class: "w-[calc(100%_+_0.125rem)] md:w-[calc(100%_+_0.75rem)]" },
      /*
       * Sheet mode: explicit lengths, so the width transition starts from the rail's width (the
       * shell switches to sheet mode a frame before opening one).
       */
      { side: "start", sheet: true, open: false, class: "w-[calc(3rem_+_0.125rem)] md:w-24" },
      { side: "end", sheet: true, open: false, class: "w-[calc(3rem_+_0.125rem)] md:w-[calc(6rem_+_0.75rem)]" },
      {
        sheet: true,
        open: true,
        class:
          "fixed inset-y-0 z-40 max-w-full bg-base-200 pt-16 pb-3 shadow-2xl [transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete,z-index_0s_allow-discrete]",
      },
      { sheet: true, open: true, side: "start", class: "start-0 w-72 rounded-e-[2rem]" },
      {
        sheet: true,
        open: true,
        side: "end",
        class: "end-0 me-0 w-[calc(20rem_+_0.125rem)] rounded-s-[2rem] md:w-[calc(20rem_+_0.75rem)]",
      },
      {
        sheet: true,
        open: false,
        class:
          "[transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete_var(--settle-spatial),z-index_0s_allow-discrete_var(--settle-spatial)] has-[details[open]]:[transition:width_var(--duration-spatial)_var(--ease-spatial)_var(--settle-spatial),position_0s_allow-discrete_calc(var(--settle-spatial)_*_2),z-index_0s_allow-discrete_calc(var(--settle-spatial)_*_2)]",
      },
    ],
  },
);

export const appShellMain = rcva(
  /* Never narrower than what a 320px screen leaves beside both compact rails (see MAIN_MIN). */
  "min-w-[calc(320px_-_2_*_3rem_-_4_*_0.125rem)] flex-1 overflow-y-auto overscroll-contain rounded-[2rem] bg-base-100 shadow-sm",
);

/**
 * A column's toggle: centred on its icon axis (48px from the column's outer edge, where the
 * rail's icons are centred), at the same spot whether the column is open or closed.
 */
export const appShellToggle = rcva("btn btn-ghost btn-circle shrink-0", {
  variants: {
    column: { start: "ms-0.5 md:ms-5", end: "me-0.5 self-end md:me-5" },
  },
});

/** Dims the page behind a sheet. */
export const appShellBackdrop = rcva(
  "fixed inset-0 z-30 bg-neutral/50 transition-opacity ease-effects duration-(--duration-effects) starting:opacity-0 motion-reduce:transition-none",
);

/** Wrapper that keeps a slot's nodes mounted while hidden. */
export const appShellSlot = rcva("flex min-h-0 w-full flex-col gap-3", {
  variants: {
    hidden: { true: "hidden" },
    /** Navigation menus (open list and rail alike): inset so item icons sit on the column's icon axis. */
    railAxis: { true: "md:ps-2.5" },
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
/** Layout sizes the room checks use (px; they mirror the recipes above). */
const NAV_OPEN = 288; // w-72
const ASIDE_OPEN = 320; // w-80
/** Closed column (rail) and the frame's gaps + end padding: compact below `md`, roomier from it. */
const frame = () =>
  matchMedia("(min-width: 48rem)").matches
    ? { rail: 96, chrome: 2 * 8 + 12 } // w-24; gap-2 ×2 + pe-3
    : { rail: 48, chrome: 2 * 2 + 2 + 2 }; // w-12; gap-0.5 ×2 + pe-0.5 + the navigation rail's 2px start inset
/** The main panel's minimum: what the smallest supported screen (320px) leaves beside both compact rails. */
const MAIN_MIN = 320 - 2 * 48 - (2 * 2 + 2 + 2);

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
    await new Promise(requestAnimationFrame);
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
  private _onKey = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (this.navOpen && this._navSheet) void this.toggleNav(false);
    else if (this.asideOpen && this._asideSheet) void this.toggleAside(false);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._onKey);
    this.#resize.observe(document.documentElement);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._onKey);
    this.#resize.disconnect();
  }

  private _toggle(label: string, icon: "menu" | "menu-panel", onClick: () => void, column: "start" | "end") {
    return html`<button type="button" class=${appShellToggle({ column })} aria-label=${label} @click=${onClick}>
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
        <div
          class=${appShellSlot({ railAxis: true, scroll: true, class: appShellNavList({ state: open ? "shown" : "hidden" }) })}
        >
          ${this.slotted(list)}
        </div>
        <div
          class=${appShellSlot({ railAxis: true, scroll: true, class: appShellNavRail({ state: open ? "hidden" : "shown" }) })}
        >
          ${this.slotted(rail)}
        </div>
      </div>
    </div>`;
  }

  render() {
    const brand = this.brand
      ? html`<a class=${appShellBrand()} href=${ifDefined(this.brandHref)}
          >${this.brandIcon ? html`<span class=${appShellBrandMark()}>${iconSvg(this.brandIcon, { size: "md" })}</span>` : nothing}<span
            >${this.brand}</span
          ></a
        >`
      : nothing;
    const navSheet = this.navOpen && this._navSheet;
    const asideSheet = this.asideOpen && this._asideSheet;
    return html`<div class=${appShell()}>
      <header class=${appShellHeader()}>
        <div class=${appShellHeaderStart()}>${brand} ${this.slotted("start")}</div>
        <div class=${appShellSearch()}>${this.slotted("search")}</div>
        <div class=${appShellActions()}>${this.slotted("actions")}</div>
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
