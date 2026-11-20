import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { TileSize } from "../../base/board.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { badge, type BadgeVariants } from "../data/badge.ts";
import { skeleton } from "../feedback/skeleton.ts";
import { stack, text } from "../layout/algebra.ts";
import { card, cardBody, cardHeader, cardHeadingGroup, cardTitle, cardTrailing } from "./card.ts";

/**
 * Tile: one widget on a screen's board (`<ui-board>`), the same anatomy everywhere.
 *
 * Purpose: Layout & page structure · Kind: primitive
 *
 * - **Header:** its title, a count, and `slot="trailing"` for tags and actions; a subhead under it.
 * - **Body:** its content. A tile's height is capped by its size (`s` 28rem, `m` 32rem, `l` and
 *   `full` 40rem), so one tile can't stretch a board's rows: what's more fades out and "Show all"
 *   opens the rest in place (the board makes room).
 * - **Loading:** a skeleton of a fixed height for its size, so tiles barely move when data arrives.
 * - **`bare`:** a tile with no surface or cap, for what steers the screen rather than shows
 *   something (a period choice, a page-wide alert), or a strip of key figures that are cells of
 *   their own.
 * - **`emphasis`:** the one tile a screen is about takes a contrasting surface. `inverse` is M3's
 *   inverse surface ("Background fills for elements which contrast against surface"; dark in a
 *   light theme, a raised surface in a dark one), one per screen; `tinted` is the primary
 *   container. Both re-scope the colour roles for everything inside (`surface-inverse`,
 *   `surface-tinted` in src/styles/theme.css), so any content reads on them as it does elsewhere:
 *   tests/contrast.test.ts computes that for every colour scheme.
 *
 * Card recipes are borrowed for the surface and header (a tile is a card on the board).
 */
export const tile = rcva("h-full", {
  variants: {
    size: {
      s: "[--tile-cap:28rem] [--tile-wait:10rem]",
      m: "[--tile-cap:32rem] [--tile-wait:14rem]",
      l: "[--tile-cap:40rem] [--tile-wait:18rem]",
      full: "[--tile-cap:40rem] [--tile-wait:18rem]",
    },
    /**
     * What's on its way, when the screen says (`skeleton` on the widget): a strip of key figures or
     * a few lines wait at about their own height instead of the size's.
     */
    kind: {
      stats: "[--tile-wait-kind:6.5rem]",
      text: "[--tile-wait-kind:5rem]",
      card: "",
      table: "",
      list: "",
      chart: "",
      entries: "",
    },
  },
});
export const tileBody = rcva(`${stack} relative gap-3`, {
  variants: {
    capped: { true: "max-h-(--tile-cap) overflow-hidden", false: "" },
    // Only a tile that holds more than its cap fades out (towards "Show all").
    faded: { true: "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]", false: "" },
  },
});
/** The skeleton: a line over a block that fills the wait height (so the tile waits at that height). */
export const tileWait = rcva(`${stack} min-h-[var(--tile-wait-kind,var(--tile-wait))] gap-3`);
export const tileWaitBlock = rcva("min-h-8 w-full grow");
/** The tile's own content (hidden while the skeleton shows). */
export const tileContent = rcva(
  // The content fades in as it takes the skeleton's place (from `display: none`, so `@starting-style`
  // applies), rather than popping in.
  `${stack} gap-3 [transition:opacity_var(--duration-effects)_var(--ease-effects)] starting:opacity-0 motion-reduce:transition-none`,
  { variants: { hidden: { true: "hidden", false: "" } } },
);
export const tileMore = rcva("self-start");
/**
 * An emphasised tile carries its edge in its fill: the border stays, transparent, so every tile has
 * the same box. The surface itself comes from `data-surface` (src/styles/theme.css).
 */
export const tileEmphasis = rcva("border border-transparent");
/** Its title: M3 title-medium (16px), a step under a page's own headings. */
export const tileTitle = rcva(`${text.label} text-title-md`);
export const tileSubhead = rcva(`${text.prose} text-body-sm text-on-surface-variant`);

export type TileEmphasis = "inverse" | "tinted";
export type TileVariants = VariantProps<typeof tile>;

/**
 * @example <ui-tile size="m" heading="Line pricing" .count=${6}><ui-tag slot="trailing">Draft</ui-tag>…</ui-tile>
 * @example <ui-tile size="full" bare>…a period choice…</ui-tile>
 * @example <ui-tile size="s" emphasis="inverse" heading="Next up">…what's due today…</ui-tile>
 */
@customElement("ui-tile")
export class UiTile extends LightElement {
  @property() size: TileSize = "s";
  @property() heading: Renderable = "";
  @property() subhead: Renderable = "";
  @property({ type: Number }) count?: number;
  @property({ attribute: "count-tone" }) countTone: BadgeVariants["tone"];
  /** Draw the skeleton (the data is on its way). */
  @property({ type: Boolean }) loading = false;
  /** No surface and no cap: a control or notice that steers the screen. */
  @property({ type: Boolean }) bare = false;
  /** A contrasting surface for the tile the screen is about (none on a `bare` tile: it has no surface). */
  @property() emphasis?: TileEmphasis;
  /** What's on its way (sets the skeleton's height when nothing better is known). */
  @property() kind: TileVariants["kind"];
  /**
   * The height this tile had last time it showed here (px): the skeleton takes it, so the tiles
   * under it don't move when the data arrives. The tile reports its height with `ui-tile-height`.
   */
  @property({ type: Number }) waitHeight?: number;
  @state() private _open = false;
  @state() private _over = false;
  /**
   * The body's and the content's heights, as the ResizeObserver last reported them. Read from its
   * entries (sizes the browser already computed in its one layout pass), never from the elements:
   * a tile that measured itself after each render forced a layout of the whole page per tile, which
   * made opening a screen of tiles stall for seconds.
   */
  #bodyHeight = 0;
  #contentHeight = 0;
  #resize = new ResizeObserver((entries) => {
    for (const e of entries) {
      const height = e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height;
      const el = e.target as HTMLElement;
      if (el.hasAttribute("data-tile-root")) {
        // Its loaded height, for the next time it waits here.
        if (!this.loading && height > 0)
          this.dispatchEvent(new CustomEvent("ui-tile-height", { detail: { height }, bubbles: true }));
      } else if (el.hasAttribute("data-tile-content")) this.#contentHeight = height;
      else this.#bodyHeight = e.contentBoxSize?.[0]?.blockSize ?? e.contentRect.height;
    }
    this._measure();
  });
  #observed = new WeakSet<Element>();

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
    this.#observed = new WeakSet();
  }

  protected updated() {
    // Observing reports each element's size on the next frame (and again whenever it changes);
    // nothing is read here.
    for (const el of this.querySelectorAll<HTMLElement>(
      ":scope [data-tile-body], :scope [data-tile-content], :scope [data-tile-root]",
    ))
      if (!this.#observed.has(el) && el.closest("ui-tile") === this) {
        this.#observed.add(el);
        this.#resize.observe(el);
      }
  }

  /** Whether the body holds more than its cap (then "Show all" is offered). */
  private _measure() {
    // The content's own box against the body's: `scrollHeight` would also count what's hidden on
    // purpose (a chart's table for screen readers).
    const over = !this._open && !!this.#bodyHeight && this.#contentHeight > this.#bodyHeight + 1;
    if (over !== this._over && !this._open) this._over = over;
  }

  private _toggle() {
    this._open = !this._open;
    if (!this._open) this._over = true;
  }

  render() {
    const waiting = html`<div class=${tileWait()} aria-busy="true">
      <div class=${skeleton({ shape: "line" })}></div>
      <div class=${skeleton({ shape: null, class: tileWaitBlock() })}></div>
    </div>`;
    // The authored children are always placed (a LightElement places them from its first render,
    // or the parent's later updates land outside the template); while loading they're hidden.
    const content = html`${this.loading ? waiting : nothing}
      <div class=${tileContent({ hidden: this.loading })} data-tile-content>${this.slotted()}</div>`;
    // While loading, the height it had last time here (when known) holds its place.
    const hold = styleMap(this.loading && this.waitHeight ? { minHeight: `${this.waitHeight}px` } : {});
    if (this.bare)
      return html`<div class=${tile({ size: this.size, kind: this.kind })} style=${hold} data-tile-root>
        ${content}
      </div>`;
    const trailing = this.hasSlotted("trailing");
    const header =
      this.heading || trailing || this.count !== undefined
        ? html`<div class=${cardHeader()}>
            <div class=${cardHeadingGroup()}>
              ${this.heading ? html`<h2 class=${cardTitle({ class: tileTitle() })}>${this.heading}</h2>` : nothing}
              ${
                this.count !== undefined
                  ? html`<span class=${badge({ kind: "count", tone: this.countTone })}>${this.count}</span>`
                  : nothing
              }
            </div>
            ${trailing ? html`<div class=${cardTrailing()}>${this.slotted("trailing")}</div>` : nothing}
          </div>`
        : nothing;
    const more =
      this._over || this._open
        ? html`<button
            type="button"
            class=${button({ variant: "text", size: "xs", class: tileMore() })}
            aria-expanded=${this._open ? "true" : "false"}
            @click=${this._toggle}
          >
            ${this._open ? "Show less" : "Show all"}
          </button>`
        : nothing;
    const surface = this.emphasis ? card({ variant: null, size: "sm", class: tileEmphasis() }) : card({ size: "sm" });
    return html`<div
      class=${tile({ size: this.size, kind: this.kind, class: surface })}
      style=${hold}
      data-surface=${this.emphasis ?? nothing}
      data-tile-root
    >
      <div class=${cardBody()}>
        ${header} ${this.subhead ? html`<p class=${tileSubhead()}>${this.subhead}</p>` : nothing}
        <div
          class=${tileBody({ capped: !this._open && !this.loading, faded: this._over && !this._open })}
          data-tile-body
        >
          ${content}
        </div>
        ${more}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tile": UiTile;
  }
}
