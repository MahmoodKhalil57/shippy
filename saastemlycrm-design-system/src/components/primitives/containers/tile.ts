import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
  },
});
export const tileBody = rcva(`${stack} relative gap-3`, {
  variants: {
    capped: { true: "max-h-(--tile-cap) overflow-hidden", false: "" },
    // Only a tile that holds more than its cap fades out (towards "Show all").
    faded: { true: "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_3rem),transparent)]", false: "" },
  },
});
export const tileWait = rcva(`${stack} min-h-(--tile-wait) gap-3`);
/** The tile's own content (hidden while the skeleton shows). */
export const tileContent = rcva(`${stack} gap-3`, { variants: { hidden: { true: "hidden", false: "" } } });
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
  @state() private _open = false;
  @state() private _over = false;
  #resize = new ResizeObserver(() => this._measure());

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resize.disconnect();
  }

  protected updated() {
    const body = this.querySelector<HTMLElement>("[data-tile-body]");
    const content = this.querySelector<HTMLElement>("[data-tile-content]");
    if (body) this.#resize.observe(body);
    if (content) this.#resize.observe(content);
    this._measure();
  }

  /** Whether the body holds more than its cap (then "Show all" is offered). */
  private _measure() {
    // The content's own box against the body's: `scrollHeight` would also count what's hidden on
    // purpose (a chart's table for screen readers).
    const body = this.querySelector<HTMLElement>("[data-tile-body]");
    const content = this.querySelector<HTMLElement>("[data-tile-content]");
    const over = !!body && !!content && !this._open && content.offsetHeight > body.clientHeight + 1;
    if (over !== this._over && !this._open) this._over = over;
  }

  private _toggle() {
    this._open = !this._open;
    if (!this._open) this._over = true;
  }

  render() {
    const waiting = html`<div class=${tileWait()} aria-busy="true">
      <div class=${skeleton({ shape: "line" })}></div>
      <div class=${skeleton({ shape: "block" })}></div>
    </div>`;
    // The authored children are always placed (a LightElement places them from its first render,
    // or the parent's later updates land outside the template); while loading they're hidden.
    const content = html`${this.loading ? waiting : nothing}
      <div class=${tileContent({ hidden: this.loading })} data-tile-content>${this.slotted()}</div>`;
    if (this.bare) return html`<div class=${tile({ size: this.size })}>${content}</div>`;
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
    return html`<div class=${tile({ size: this.size, class: surface })} data-surface=${this.emphasis ?? nothing}>
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
