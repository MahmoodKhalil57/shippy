import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssLuminance, lumaOf, sampleBehind, type Luma, type Rect } from "../../base/legibility.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { auditContrast } from "../../base/contrast.ts";
import type { PageTransition } from "../../primitives/layout/frame.ts";
import "../../primitives/layout/frame.ts";
import type { IconName } from "../../primitives/media/icon.ts";

export type { PageTransition } from "../../primitives/layout/frame.ts";

/**
 * App shell: the application frame — a header (brand, centred search, actions), a
 * collapsible navigation column, a rounded main panel that scrolls on its own, and a
 * collapsible side panel. The header and the closed columns share one surface; the
 * main panel sits on top of it, fully inside the viewport (Material-style app frame).
 *
 * Purpose: Layout & page structure · Kind: composed (Frame / Frame header / Frame column / Frame main;
 * replaces daisyUI drawer + navbar)
 *
 * Two columns built the same way, one each side of the main panel: a toggle (the same in both
 * states, never moving), then the open list or, closed, its rail — the same menu, icons only.
 * - start (navigation): `slot="nav"` (`<ui-menu layout="nav">`) / `slot="rail"` (`layout="rail"`)
 * - end (side panel): `slot="aside"` / `slot="aside-rail"`, likewise
 * - under the main panel: `slot="footer"`, one centred line (e.g. a credit)
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
 * Space: the main panel's content is never narrower than `--main-min` (258px, src/styles/theme.css:
 * what a 320px phone leaves it) beside the columns. Opening a
 * column pushes the main panel when there is room; otherwise it first closes the other column if
 * that makes room, and failing that opens as a sheet over the page (its rail keeps its place)
 * with everything else dimmed. When the window shrinks, open columns close (side panel first)
 * until the main panel fits again.
 *
 * Compact: when both rails would leave the main panel's content under `--main-comfort` (320px),
 * the frame goes full screen, trading the second rail for the page's room.
 * The side panel's rail joins the navigation's in one rail that shows either at a time: the button
 * at its top (where the navigation's toggle is) switches between them, so neither moves the other's
 * icons. The side panel takes no room and opens only as a sheet, from that rail; the navigation
 * opens from its section icons. The frame's edges and gaps go to 0, and the main panel runs to the
 * screen's end and bottom edges (only its corner by the header and rail stays round).
 */
/**
 * @example
 * <ui-app-shell brand="Acme" brand-icon="grid" brand-href="/" nav-open>
 *   <ui-search slot="search" label="Search"></ui-search>
 *   <ui-appearance slot="actions" kind="theme"></ui-appearance>
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
/** Open widths the room checks use (px; they mirror the recipes above). */
const NAV_OPEN = 288; // w-72
const ASIDE_OPEN = 320; // w-80
/** The frame's live fluid sizes (`--frame-*`, registered so they compute to px): a rail, and gaps + edges. */
const frame = () => {
  const css = getComputedStyle(document.documentElement);
  const px = (name: string) => parseFloat(css.getPropertyValue(name)) || 0;
  return {
    rail: px("--frame-rail"),
    chrome: 2 * px("--frame-gap") + 2 * px("--frame-edge"),
    /** The main panel's narrowest content box (`--main-min`). */
    mainMin: px("--main-min") || 258,
    /** The content width under which a frame with both rails goes compact (`--main-comfort`). */
    mainComfort: px("--main-comfort") || 320,
  };
};

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
  /** Which rail a compact frame's one rail shows: the navigation's, or the side panel's. */
  @state() private _railView: "own" | "extra" = "own";
  /** Full screen with one rail: both rails would leave the main panel's content under `--main-comfort`. */
  @state() private _compact = false;

  /** Before the first render: fit the saved open columns to the window, so nothing shifts after. */
  protected willUpdate() {
    if (!this.hasUpdated) this._refit();
  }

  /** The frame's root, and the parts of it drawn over the background image (header, columns, footer). */
  private get _root() {
    return this.querySelector("[data-frame]");
  }

  private get _regions() {
    return [...this.querySelectorAll("[data-frame-region]")];
  }

  protected firstUpdated() {
    // Two frames: the first paint happens with transitions off, then they come on.
    requestAnimationFrame(() => requestAnimationFrame(() => (this._settling = false)));
    for (const el of this._regions) {
      this.#regions.observe(el);
      // What's drawn over the image changes too (a group opens, a notification arrives).
      this.#content.observe(el, { childList: true, subtree: true, characterData: true });
    }
    void this._onBackground();
  }

  /* ------------------------------------------------------------ legible chrome over a background image */

  /**
   * Text over the background image stays readable whatever the image, in the theme's own colours:
   * one scrim of the theme's surface (base-200) over the whole image, just strong enough that the
   * theme's text (base-content) keeps its contrast over the pixels behind all the text regions
   * together (header, both columns; src/components/base/legibility.ts). Re-measured when the image, the theme or
   * colour scheme, or a region's size changes.
   */
  /** The scrim over the background image (`<ui-frame scrim>`). */
  @state() private _scrim = "";
  #luma: { src: string; luma: Luma } | null = null;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #regions = new ResizeObserver(() => this._measureSoon());
  #content = new MutationObserver(() => this._measureSoon());

  private _onBackground = async () => {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--app-background").trim();
    const src = /^url\((['"]?)(.*)\1\)$/.exec(value)?.[2];
    if (!src) {
      this.#luma = null;
      this._scrim = "";
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

  /** Re-measure once things settle: measuring audits the frame's text (tens of ms), so not on every frame of a column's animation. */
  private _measureSoon() {
    if (!this.#luma) return;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => this._measure(), 200);
  }

  /**
   * The least scrim (as much of the photo as possible) at which every text drawn over the image
   * in the header and both columns passes WCAG AA — judged exactly as `<ui-contrast-audit>` judges
   * it (the text's own colour, the cards and glass under it, the image pixels behind each text),
   * found by bisection. A floor keeps a hint of the theme's surface so the frame reads as one.
   */
  private _measure() {
    const shell = this._root;
    if (!this.#luma || !shell) return;
    // The frame's own colour and background are the theme's base-content and base-200.
    const css = getComputedStyle(shell);
    this.#scrim = { ink: cssLuminance(css.color), surface: cssLuminance(css.backgroundColor) };
    const regions = this._regions;
    const fails = (alpha: number) => {
      this.#scrim.alpha = alpha;
      return regions.some((r) => auditContrast(r).some((i) => i.overImage));
    };
    let [lo, hi] = [0.05, 0.94];
    if (!fails(lo)) hi = lo;
    else if (!fails(hi))
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        if (fails(mid)) lo = mid;
        else hi = mid;
      }
    this.#scrim.alpha = hi;
    this._scrim = `color-mix(in oklab, var(--color-base-200) ${(hi * 100).toFixed(1)}%, transparent)`;
  }

  #scrim: { ink: number; surface: number; alpha?: number } = { ink: 0, surface: 0 };

  /**
   * Luminances of what the frame shows behind `rect` (the background image under its scrim), or
   * `null` without a background image — for contrast audits (`<ui-contrast-audit>`). `blur` (a CSS
   * `blur()` radius) is for text on frosted glass: each sample becomes the mean of the image
   * around it (a box with the same spread as the Gaussian).
   */
  backdropAt(rect: Rect, blur = 0): number[] | null {
    const shell = this._root;
    if (!this.#luma || !shell || this.#scrim.alpha == null) return null;
    const a = this.#scrim.alpha;
    const frame = shell.getBoundingClientRect();
    const luma = this.#luma.luma;
    const h = blur * 1.7;
    const raw = h
      ? Array.from({ length: 64 }, (_, i) => {
          const x = rect.x + ((i % 8) + 0.5) * (rect.width / 8);
          const y = rect.y + (Math.floor(i / 8) + 0.5) * (rect.height / 8);
          const around = sampleBehind(luma, frame, { x: x - h, y: y - h, width: 2 * h, height: 2 * h }, 5);
          return around.reduce((s, l) => s + l, 0) / around.length;
        })
      : sampleBehind(luma, frame, rect, 8);
    return raw.map((l) => a * this.#scrim.surface + (1 - a) * l);
  }

  /** The theme or colour scheme changed (a theme controller in the header): re-measure once it's applied. */
  private _onThemeChange = (e: Event) => {
    if ((e.target as Element | null)?.tagName !== "UI-APPEARANCE") return;
    setTimeout(() => this._measureSoon(), 50);
  };

  /** Room a column takes in the layout: open width when pushing, else its rail (none when merged). */
  private _room(side: "start" | "end", open: boolean, sheet: boolean) {
    if (open && !sheet) return side === "start" ? NAV_OPEN : ASIDE_OPEN;
    return side === "end" && this._compact ? 0 : frame().rail;
  }

  /**
   * What the main panel takes beside its content: its border and its scrollbar, measured (the
   * scrollbar's width is the browser's; before the panel is drawn, its 2×2px border only).
   */
  private _mainChrome() {
    const main = this.querySelector("main");
    return main ? main.offsetWidth - main.clientWidth : 4;
  }

  /** Whether the main panel's content keeps `--main-comfort` with the columns taking this much room. */
  private _fits(nav: number, aside: number) {
    // A compact frame has no edges or gaps (`appShell`'s `compact`).
    const edges = this._compact ? 0 : frame().chrome;
    // A column pushes the page only when the page keeps `--main-comfort`: below that it's a sheet.
    return document.documentElement.clientWidth >= nav + aside + edges + this._mainChrome() + frame().mainComfort;
  }

  /**
   * Whether the normal frame (its edges and gaps, both rails) leaves the main panel's content at
   * least `--main-comfort`: if not, the frame goes compact to give the page that room back.
   */
  private _fitsFrame(nav: number, aside: number) {
    return (
      document.documentElement.clientWidth >= nav + aside + frame().chrome + this._mainChrome() + frame().mainComfort
    );
  }

  /** Plays an M3 transition pattern as a new page enters the main panel (see `<ui-frame-main>`). */
  pageTransition(kind: PageTransition) {
    this.querySelector("ui-frame-main")?.pageTransition(kind);
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
    const column = this.querySelector<HTMLElementTagNameMap["ui-frame-column"]>(`ui-frame-column[side="${side}"]`);
    await column?.updateComplete;
    column?.prepareSheet();
  }

  /** Window resized (or first layout): close pushing columns, side panel first, until the main panel fits. */
  private _refit = () => {
    // Compact when both rails (the frame's normal, roomiest closed state) leave under `--main-comfort`.
    this._compact = !this._fitsFrame(frame().rail, frame().rail);
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
    this.#content.disconnect();
    clearTimeout(this.#timer);
  }

  render() {
    const navSheet = this.navOpen && this._navSheet;
    const asideSheet = this.asideOpen && this._asideSheet;
    const compact = this._compact;
    // The side panel's rail moves between columns by property (see `railNodes`): in its own
    // column normally, above the navigation's in a compact frame.
    const asideRail = this.slottedNodes("aside-rail");
    return html`<ui-frame ?settling=${this._settling} ?compact=${compact} .scrim=${this._scrim}>
      <ui-frame-header
        .brand=${this.brand}
        .brandHref=${this.brandHref}
        .brandIcon=${this.brandIcon}
        ?lift-start=${navSheet || (compact && asideSheet)}
        ?lift-end=${!compact && asideSheet}
        >${this.slotted("start")}${this.slotted("search")}${this.slotted("actions")}</ui-frame-header
      >
      <ui-frame-body>
        <ui-frame-column
          side="start"
          .label=${this.navLabel}
          .open=${this.navOpen}
          .sheet=${this._navSheet}
          list-slot="nav"
          rail-slot="rail"
          footer-slot="nav-footer"
          .extraRailNodes=${compact ? asideRail : undefined}
          rail-view=${this._railView}
          extra-label=${this.asideLabel}
          @ui-rail-switch=${(e: CustomEvent<{ view: "own" | "extra" }>) => (this._railView = e.detail.view)}
          @ui-column-toggle=${(e: CustomEvent<{ open: boolean }>) => void this.toggleNav(e.detail.open)}
          >${this.slotted("nav")}${this.slotted("rail")}${this.slotted("nav-footer")}</ui-frame-column
        >
        <ui-frame-main ?compact=${compact}>${this.slotted()}${this.slotted("footer")}</ui-frame-main>
        <ui-frame-column
          side="end"
          .label=${this.asideLabel}
          .open=${this.asideOpen}
          .sheet=${this._asideSheet}
          list-slot="aside"
          rail-slot="aside-rail"
          footer-slot="aside-footer"
          ?merged=${compact}
          .railNodes=${compact ? [] : asideRail}
          @ui-column-toggle=${(e: CustomEvent<{ open: boolean }>) => void this.toggleAside(e.detail.open)}
          >${this.slotted("aside")}${this.slotted("aside-footer")}</ui-frame-column
        >
      </ui-frame-body>
    </ui-frame>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-app-shell": UiAppShell;
  }
}
