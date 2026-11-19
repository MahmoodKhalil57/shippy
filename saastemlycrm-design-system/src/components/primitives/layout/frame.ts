import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconButton } from "../actions/icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Frame: the parts of an application frame — a header across the top, a collapsible column on
 * each side of a rounded main panel that scrolls on its own, over a background — as primitives.
 * `<ui-app-shell>` (src/components/composed/layout/app-shell.ts) puts them together and decides
 * when columns open, push the page or float over it as sheets; these only draw each state.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy)
 *
 * - `<ui-frame>`: the root (the background image under its `scrim`, the colour wash).
 * - `<ui-frame-header>`: brand, `slot="start"`, `slot="search"`, `slot="actions"`; the parts over
 *   an open sheet are lifted above it (`lift-start`, `lift-end`).
 * - `<ui-frame-body>`: the row of columns and the main panel.
 * - `<ui-frame-column>`: a side column — its toggle (`ui-column-toggle`), its open list and its rail
 *   stacked, a footer, and its backdrop when it's a sheet. Its states (`open`, `sheet`) animate
 *   in two steps on M3's springs (src/styles/motion.css): groups collapse, then the column folds.
 * - `<ui-frame-main>`: the main panel (a size container, `@container/main`) and `slot="footer"`
 *   under it; `pageTransition()` plays M3's transition patterns as a page enters.
 * Parts the shell measures carry `data-frame-region`; the root carries `data-frame`.
 */
/** One column that never grows past the viewport, whatever the page inside needs. */
export const appShell = rcva(
  /* A faint wash of the theme's primary / secondary / accent at the corners: the frame the header
     and rails sit on, and what the floating glass (sheets, menus, dialogs) refracts. Under it, the
     chosen background image (`--app-background`, set by `<ui-appearance kind="background">`)
     behind one scrim (`--app-scrim`, chosen from the image so text on it stays readable). */
  "group/shell grid h-dvh grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-surface-container [background-image:radial-gradient(70%_60%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%),radial-gradient(60%_55%_at_100%_100%,color-mix(in_oklab,var(--color-secondary)_12%,transparent),transparent_70%),radial-gradient(45%_40%_at_100%_0%,color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_70%),linear-gradient(var(--app-scrim,transparent),var(--app-scrim,transparent)),var(--app-background,none)] bg-cover bg-center text-on-surface",
  {
    variants: {
      /**
       * Until the first paint: no transitions inside the shell, so a reload shows the final
       * layout at once (open columns, expanded groups) instead of animating into it.
       */
      settling: { true: "[&_*]:transition-none!" },
      /**
       * Too narrow for a 320px main panel beside both rails: the frame goes full screen. Its
       * edges and gaps are 0, so the header, the rail and the main panel meet the screen's edges
       * and each other (the side panel's rail has moved into the navigation's: `merged`).
       */
      compact: { true: "[--frame-edge:0px] [--frame-gap:0px]" },
    },
  },
);

/**
 * Header: brand, the search (centred in the room left between brand and actions; it collapses
 * to an icon when that room gets small — a container query, not a screen breakpoint), actions.
 */
export const appShellHeader = rcva("flex h-16 items-center gap-[clamp(0.5rem,1vw,1rem)] px-(--frame-edge)");
// layout: fixed (the menu button and the brand)
export const appShellHeaderStart = rcva("flex min-w-0 shrink-0 items-center gap-1");
export const appShellBrand = rcva("gap-2 rounded-full px-3 text-title-md tracking-tight");
/** The brand's mark (`brand-icon`): primary, on a soft primary disc. */
export const appShellBrandMark = rcva("grid size-8 place-items-center rounded-full bg-primary/15 text-primary");
export const appShellSearch = rcva("@container flex min-w-0 flex-1 justify-center");
// layout: fixed (icon buttons)
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
      /** Its rail lives in the other column (compact frame): it takes no room, and shows only as a sheet. */
      merged: { true: "w-0!", false: "" },
    },
    // layout: fixed (the frame's side columns; the shell folds them away when the room is short)
    compoundVariants: [
      { side: "start", push: true, class: "w-72" },
      // layout: fixed (as above)
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
          "fixed inset-y-0 z-40 max-w-full liquid-glass pt-16 pb-(--frame-edge) shadow-elevation-1 [transition:width_var(--duration-spatial)_var(--ease-spatial),position_0s_allow-discrete,z-index_0s_allow-discrete]",
      },
      {
        sheet: true,
        open: true,
        side: "start",
        class: "start-0 ms-0 w-[calc(18rem_+_var(--frame-edge))] rounded-e-xl-increased",
      },
      {
        sheet: true,
        open: true,
        side: "end",
        class: "end-0 me-0 w-[calc(20rem_+_var(--frame-edge))] rounded-s-xl-increased",
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
   * A 2px inset all round (a transparent border, not padding: a scroll container clips its content
   * at the padding edge, so the gap stays while the page scrolls instead of scrolling away), so
   * content never runs into the panel's rim.
   */
  "@container/main min-h-0 flex-1 overflow-x-clip overflow-y-auto overscroll-contain border-2 border-transparent rounded-(--main-radius) liquid-glass-surface [--main-radius:clamp(var(--radius-lg),3vw,var(--radius-xl-increased))] [--scrollbar-inset:var(--main-radius)]",
  {
    variants: {
      /**
       * A compact frame: the panel runs to the screen's end and bottom edges, so only the corner
       * that meets the header and the rail stays round.
       */
      compact: { true: "[--main-radius:0px] rounded-ss-lg" },
    },
  },
);

/** The page inside the main panel: the box a page transition moves (see `pageTransition`). */
export const appShellPage = rcva("");

/** The main panel with its footer under it; takes the room the columns leave. */
// layout: fixed (the main panel keeps room for content when both side columns are open)
export const appShellCenter = rcva("flex min-w-[13.5rem] flex-1 flex-col gap-1");

/**
 * The page's footer (`slot="footer"`): one centred line under the main panel, on the frame
 * (e.g. a credit). Part of what the scrim keeps readable.
 */
export const appShellPageFooter = rcva("shrink-0 text-center text-body-sm leading-4 -mb-1");

/**
 * A column's toggle: centred on its icon axis (where the rail's icons are centred, 2px inside
 * the 44px pill), at the same spot whether the column is open or closed.
 */
export const appShellToggle = rcva("shrink-0", {
  variants: {
    column: { start: "ms-0.5", end: "me-0.5 self-end" },
  },
});

/** Dims the page behind a sheet: M3's scrim (the scrim role at 32%). */
export const appShellBackdrop = rcva(
  "fixed inset-0 z-30 bg-scrim/32 transition-opacity ease-effects duration-(--duration-effects) starting:opacity-0 motion-reduce:transition-none",
);

/**
 * A column's footer (`slot="nav-footer"` / `"aside-footer"`): pinned under the menus, on the same
 * icon axis as the column's toggle (e.g. an account switcher), in every state — rail, open, sheet.
 * Several elements stack, each always shown in full: they centre on the icon axis (the footer is one
 * icon wide), so a short note under the switcher spreads evenly either side of it and fits the rail.
 */
export const appShellFooter = rcva("flex w-10 shrink-0 flex-col items-center gap-1 ms-0.5 pb-1 text-center");

/** Between a column's own rail and the rail merged into it (`extra-rail-slot`). */
export const appShellRailDivider = rcva("mx-auto h-px w-6 shrink-0 bg-outline-variant");

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
  /** Until the first paint: no transitions, so a reload shows the final layout at once. */
  @property({ type: Boolean }) settling = false;
  /** Full screen: no edges or gaps (the shell sets it when the main panel would be under 320px). */
  @property({ type: Boolean }) compact = false;

  render() {
    return html`<div
      data-frame
      class=${appShell({ settling: this.settling, compact: this.compact })}
      style=${styleMap(this.scrim ? { "--app-scrim": this.scrim } : {})}
    >
      ${this.content}
    </div>`;
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
            >${this.brand}</span
          ></a
        >`
      : nothing;
    return html`<header class=${appShellHeader()} data-frame-region>
      <div class=${appShellHeaderStart({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        ${brand} ${this.slotted("start")}
      </div>
      <div class=${appShellSearch({ class: appShellLift({ side: "start", lifted: this.liftStart }) })}>
        ${this.slotted("search")}
      </div>
      <div class=${appShellActions({ class: appShellLift({ side: "end", lifted: this.liftEnd }) })}>
        ${this.slotted("actions")}
      </div>
    </header>`;
  }
}

@customElement("ui-frame-body")
export class UiFrameBody extends LightElement {
  render() {
    return html`<div class=${appShellBody()}>${this.content}</div>`;
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
@customElement("ui-frame-column")
export class UiFrameColumn extends LightElement {
  @property() side: "start" | "end" = "start";
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
  /** Another column's rail, shown under this one's after a divider (a compact frame merges them). */
  @property({ attribute: false }) extraRailNodes?: Node[];
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

  render() {
    const { side, open, sheet, merged } = this;
    const what = this.label.toLowerCase();
    const extra = !!this.extraRailNodes?.length;
    const panel = html`<div class=${appShellPanel({ side, open, sheet, merged })} data-frame-panel>
      <button
        type="button"
        class=${iconButton({ class: appShellToggle({ column: side }) })}
        aria-label=${open ? `Collapse ${what}` : `Expand ${what}`}
        @click=${() => this._ask(!open)}
      >
        ${iconSvg(side === "start" ? "menu" : "menu-panel", { size: "md" })}
      </button>
      <div class=${appShellStack({ fill: true })}>
        <div class=${appShellSlot({ scroll: true, class: appShellNavList({ state: open ? "shown" : "hidden" }) })}>
          ${this.slotted(this.listSlot)}
        </div>
        <div class=${appShellSlot({ scroll: true, class: appShellNavRail({ state: open ? "hidden" : "shown" }) })}>
          ${this.railNodes ?? this.slotted(this.railSlot)}
          ${extra ? html`<div class=${appShellRailDivider()} role="separator"></div>` : nothing}
          ${extra ? this.extraRailNodes : nothing}
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
          >
            ${panel}
          </nav>`
        : html`<aside
            class=${appShellColumn({ side, push: open && !sheet, merged })}
            aria-label=${this.label}
            data-frame-region
          >
            ${panel}
          </aside>`;
    return html`${column}${open && sheet ? html`<div class=${appShellBackdrop()} @click=${() => this._ask(false)}></div>` : nothing}`;
  }
}

/** How far a page slides as it enters (M3's shared axis: 30dp). */
const SLIDE = 30;

@customElement("ui-frame-main")
export class UiFrameMain extends LightElement {
  /** Full screen (a compact frame): only the corner by the header and rail stays round. */
  @property({ type: Boolean }) compact = false;
  #pageAnimation?: Animation;

  /**
   * Plays an M3 transition pattern as a new page enters the main panel (call it once the new page
   * has rendered). The page that left is already gone, so only the entering half plays: the panel
   * shows nothing for a moment, as M3 wants (no cross-faded frames).
   */
  pageTransition(kind: PageTransition) {
    const page = this.querySelector("main > div");
    if (!(page instanceof HTMLElement)) return;
    const css = getComputedStyle(this);
    const token = (name: string) => css.getPropertyValue(name).trim();
    const ms = (name: string) => Number.parseFloat(token(name)) || 0;
    const rtl = css.direction === "rtl" ? -1 : 1;
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
  }

  render() {
    return html`<div class=${appShellCenter()}>
      <main class=${appShellMain({ compact: this.compact })}><div class=${appShellPage()}>${this.slotted()}</div></main>
      ${this.hasSlotted("footer") ? html`<footer class=${appShellPageFooter()} data-frame-region>${this.slotted("footer")}</footer>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-frame": UiFrame;
    "ui-frame-header": UiFrameHeader;
    "ui-frame-body": UiFrameBody;
    "ui-frame-column": UiFrameColumn;
    "ui-frame-main": UiFrameMain;
  }
}
