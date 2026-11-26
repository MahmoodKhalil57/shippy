import { whenIdle } from "../../../lib/base/work-queue.ts";
import { html, type LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cssLuminance, lumaOf, sampleBehind, type Luma, type Rect } from "../../../lib/base/legibility.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { auditContrast } from "../../../lib/base/contrast.ts";
import { liveBackgroundNow } from "../../../lib/base/appearance.ts";
import { liveBackground } from "../actions/live-background.ts";
import {
  closeColumn,
  frameSizesAt,
  openColumn,
  refit,
  wantsNav,
  type FrameSizes,
  type FrameState,
  type Side,
} from "../../../lib/base/frame-fit.ts";
import type { PageTransition } from "../../primitives/layout/frame.ts";
import "../../primitives/layout/frame.ts";
import type { IconName } from "../../primitives/media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";

export type { PageTransition } from "../../primitives/layout/frame.ts";

const anchors = () => CSS.supports("anchor-name: --a");

const textScale = () => parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;

@customElement("ui-app-shell")
export class UiAppShell extends LightElement {
  @property() brand: Renderable = "";
  @property({ attribute: "brand-href" }) brandHref?: string;
  @property({ attribute: "brand-icon" }) brandIcon?: IconName;
  @property({ type: Boolean, reflect: true, attribute: "nav-open" }) navOpen = false;
  @property({ type: Boolean, reflect: true, attribute: "aside-open" }) asideOpen = false;
  @property({ attribute: "nav-label" }) navLabel = m.app_shell_navigation();
  @property({ attribute: "aside-label" }) asideLabel = m.app_shell_side_panel();
  @property({ attribute: false }) navExpanded: boolean | null = null;

  @state() private _navSheet = false;
  @state() private _asideSheet = false;
  @state() private _settling = true;
  @state() private _railView: "own" | "extra" = "own";
  @state() private _compact = false;

  protected willUpdate(changed: Map<string, unknown>) {
    if (!this.hasUpdated || changed.has("navExpanded")) this._refit();
  }

  private get _root() {
    return this.querySelector("[data-frame]");
  }

  private get _regions() {
    return [...this.querySelectorAll("[data-frame-region]")];
  }

  protected async firstUpdated() {
    requestAnimationFrame(() => requestAnimationFrame(() => (this._settling = false)));
    this._report();
    const parts = this.querySelectorAll<LitElement>("ui-frame, ui-frame-header, ui-frame-column, ui-frame-main");
    await Promise.all([...parts].map((el) => el.updateComplete));
    for (const el of this._regions) {
      this.#regions.observe(el);
      this.#content.observe(el, { childList: true, subtree: true, characterData: true });
    }
    void this._onBackground();
  }

  @state() private _scrim = "";
  @state() private _windowScrim = "";
  #luma: { src: string; luma: Luma } | null = null;
  #regions = new ResizeObserver(() => this._measureSoon());
  #content = new MutationObserver(() => this._measureSoon());

  @state() private _live = liveBackgroundNow();

  private _onBackground = async () => {
    this._live = liveBackgroundNow();
    const value = getComputedStyle(document.documentElement).getPropertyValue("--app-background").trim();
    const src = /^url\((['"]?)(.*)\1\)$/.exec(value)?.[2];
    if (!src) {
      this.#luma = null;
      this._scrim = "";
      this._windowScrim = "";
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
    this._measure(true);
  };

  #dark = matchMedia("(prefers-color-scheme: dark)");
  #themeAttrs = new MutationObserver(() => this._measureSoon());
  private _measureSoonBound = () => this._measureSoon();

  private _measureSoon() {
    if (!this.#luma) return;
    whenIdle(this, async () => {
      const moving = this._regions.flatMap((r) => r.getAnimations({ subtree: true }));
      await Promise.allSettled(moving.map((a) => a.finished));
      if (moving.length) return this._measureSoon();
      this._measure();
    });
  }

  #measured = "";

  private _measure(force = false) {
    if (!this.#luma) return;
    const shell = this._root!;
    const root = document.documentElement;
    const seen = [
      innerWidth,
      innerHeight,
      root.dataset.theme,
      root.dataset.scheme,
      this.#dark.matches,
      ...this._regions.map((r) => `${r.clientWidth}x${r.clientHeight}:${r.textContent}`),
    ].join("|");
    if (!force && seen === this.#measured) return;
    this.#measured = seen;
    const css = getComputedStyle(shell);
    this.#scrim = { ink: cssLuminance(css.color), surface: cssLuminance(css.backgroundColor), alpha: 0, window: 0 };
    const mix = (a: number) =>
      a > 0.05 ? `color-mix(in oklab, var(--color-base-200) ${(a * 100).toFixed(1)}%, transparent)` : "";
    this.#scrim.alpha = this._leastScrim(this._regions, (a) => (this.#scrim.alpha = a));
    this._scrim = mix(this.#scrim.alpha);
    const main = this.querySelector("main")!;
    this.#scrim.window = anchors() ? this._leastScrim([main], (a) => (this.#scrim.window = a)) : 0;
    this._windowScrim = mix(this.#scrim.window);
  }

  private _leastScrim(regions: Element[], set: (alpha: number) => void) {
    const issues = (alpha: number) => {
      set(alpha);
      return regions.flatMap((r) => auditContrast(r).filter((i) => i.overImage));
    };
    const unfixable = new Set(issues(1).map((i) => i.element));
    const fails = (alpha: number) => issues(alpha).some((i) => !unfixable.has(i.element));
    let [lo, hi] = [0.05, 0.94];
    if (!fails(lo)) hi = lo;
    else if (!fails(hi))
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        if (fails(mid)) lo = mid;
        else hi = mid;
      }
    set(hi);
    return hi;
  }

  #scrim = { ink: 0, surface: 0, alpha: 0, window: 0 };

  backdropAt(rect: Rect, blur = 0): number[] | null {
    if (!this.#luma) return null;
    const shell = this._root!;
    const window = anchors() ? this.querySelector("main")!.getBoundingClientRect() : undefined;
    const inWindow =
      !!window &&
      rect.x >= window.left &&
      rect.y >= window.top &&
      rect.x + rect.width <= window.right &&
      rect.y + rect.height <= window.bottom;
    const a = inWindow ? this.#scrim.window : this.#scrim.alpha;
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

  private _onThemeChange = (e: Event) => {
    if ((e.target as Element | null)?.tagName !== "UI-APPEARANCE") return;
    this._measureSoon();
  };

  private _mainChrome() {
    const main = this.querySelector("main");
    return main ? main.offsetWidth - main.clientWidth : 4;
  }

  private _sizes(): FrameSizes {
    return frameSizesAt(document.documentElement.clientWidth, textScale(), this._mainChrome());
  }

  @state() private _cols = 6;

  private get _state(): FrameState {
    return {
      compact: this._compact,
      navOpen: this.navOpen,
      navSheet: this._navSheet,
      asideOpen: this.asideOpen,
      asideSheet: this._asideSheet,
    };
  }

  private async _apply(next: FrameState, expanded?: boolean) {
    this._compact = next.compact;
    if (expanded !== undefined) this.navExpanded = expanded;
    if (next.navSheet && !this._navSheet) await this._toSheet("start");
    else this._navSheet = next.navSheet;
    if (next.asideSheet && !this._asideSheet) await this._toSheet("end");
    else this._asideSheet = next.asideSheet;
    this._set(next.navOpen, next.asideOpen, expanded);
  }

  pageTransition(kind: PageTransition) {
    this.querySelector("ui-frame-main")?.pageTransition(kind);
  }

  toggleNav(open = !this.navOpen) {
    return this._toggle("start", open);
  }

  toggleAside(open = !this.asideOpen) {
    return this._toggle("end", open);
  }

  private _toggle(side: Side, open: boolean) {
    const st = this._state;
    const sizes = this._sizes();
    if (open) {
      const next = openColumn(side, st, sizes);
      return this._apply(next, side === "start" && !next.navSheet && !st.navOpen ? true : undefined);
    }
    const expanded = side === "start" && st.navOpen && !st.navSheet ? false : undefined;
    const want = side === "end" && wantsNav(this.navExpanded, sizes);
    return this._apply(refit(closeColumn(side, st), sizes, want), expanded);
  }

  private async _toSheet(side: "start" | "end") {
    if (side === "start") this._navSheet = true;
    else this._asideSheet = true;
    await this.updateComplete;
    const column = this.querySelector<HTMLElementTagNameMap["ui-frame-column"]>(`ui-frame-column[side="${side}"]`)!;
    await column.updateComplete;
    column.prepareSheet();
  }

  private _refit = () => {
    const sizes = this._sizes();
    const next = refit(this._state, sizes, wantsNav(this.navExpanded, sizes));
    this._cols = sizes.cols;
    this._compact = next.compact;
    this._navSheet = next.navSheet;
    this._asideSheet = next.asideSheet;
    this._set(next.navOpen, next.asideOpen);
  };
  #resize = new ResizeObserver(() => this._refit());

  private _set(nav: boolean, aside: boolean, expanded?: boolean) {
    if (nav === this.navOpen && aside === this.asideOpen && expanded === undefined) return;
    this.navOpen = nav;
    this.asideOpen = aside;
    this._report(expanded);
  }

  private _report(expanded?: boolean) {
    this.dispatchEvent(
      new CustomEvent("ui-change", { detail: { nav: this.navOpen, aside: this.asideOpen, expanded }, bubbles: true }),
    );
  }

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
  }

  render() {
    const navSheet = this.navOpen && this._navSheet;
    const asideSheet = this.asideOpen && this._asideSheet;
    const compact = this._compact;
    const asideRail = this.slottedNodes("aside-rail");
    return html`<ui-frame
      ?settling=${this._settling}
      ?compact=${compact}
      .cols=${this._cols}
      .scrim=${this._scrim}
      .windowScrim=${this._windowScrim}
      .background=${liveBackground(this._live)}
    >
      <ui-frame-header
        .brand=${this.brand}
        .brandHref=${this.brandHref}
        .brandIcon=${this.brandIcon}
        ?lift-start=${navSheet || (compact && asideSheet)}
        ?lift-end=${!compact && asideSheet}
        >${this.slotted("start")}${this.slotted("search")}${this.slotted("actions")}</ui-frame-header
      >
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
      <ui-frame-main
        ?compact=${compact}
        start-label=${this.navLabel}
        end-label=${this.asideLabel}
        @ui-frame-drag=${(e: CustomEvent<{ side: "start" | "end"; open: boolean }>) =>
          void (e.detail.side === "start" ? this.toggleNav(e.detail.open) : this.toggleAside(e.detail.open))}
        ?push-start=${this.navOpen && !this._navSheet}
        ?push-end=${!compact && this.asideOpen && !this._asideSheet}
        >${this.slotted()}${this.slotted("footer")}</ui-frame-main
      >
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
    </ui-frame>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-app-shell": UiAppShell;
  }
}
