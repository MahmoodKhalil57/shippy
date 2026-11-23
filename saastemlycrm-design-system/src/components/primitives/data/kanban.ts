import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, grid, inset, row, rowFill, rowLine, stack, text } from "../layout/algebra.ts";
import { badge } from "./badge.ts";

/**
 * Kanban: records as cards in columns, one column per state, moved between columns by dragging.
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * - **Columns** are as many as fit side by side, each at least 12rem (layout/algebra.ts
 *   `grid.xs`); on a phone they stack. A column has a heading (a tag in the state's tone), a count
 *   and its cards.
 * - **A card** is one record: its headline (a link when it has an `href`: the whole card opens
 *   it), up to two supporting lines, the person it belongs to (a 24px avatar and their name), and
 *   a `trailing` slot for its menu.
 * - **Moving** (`movable`): press a card and drag it to another column. A mouse or pen picks it
 *   up after 6px; touch needs a 350ms long press, so a swipe still scrolls the page. The card
 *   lifts (elevation +4, M3: "+4 and +5 are only for hover and drag") and follows the pointer,
 *   the column under it is outlined in the primary colour, and the page scrolls when the card
 *   nears its top or bottom edge. Escape cancels. Dropping on another column fires `ui-move` with
 *   `{ key, from, to }`; the kanban itself never reorders: whoever listens moves the record and
 *   hands back the new columns, and the card that landed is tinted for a moment. The click that
 *   ends a drag never opens the card.
 * - **Without a pointer**: the card's menu (its `trailing` slot) is where a page offers
 *   "Move to …"; the kanban announces a drag to screen readers.
 */
export const kanban = rcva(`${grid.xs} items-start gap-3`);
export const kanbanColumn = rcva(
  `${stack} ${inset["2"]} gap-2 rounded-lg bg-surface-container-low py-2 outline-2 -outline-offset-2 [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),outline-color_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  {
    variants: {
      /** A dragged card is over it: where the card will land. */
      over: { true: "bg-surface-container outline-primary", false: "outline-transparent" },
    },
  },
);
export const kanbanHeader = rcva(`${row} items-center justify-between gap-2 px-1 py-0.5`);
export const kanbanHeading = rcva(`${text.label} text-title-sm`);
export const kanbanList = rcva(`${stack} min-h-11 gap-2`);
export const kanbanCard = rcva(
  `${stack} ${inset["3"]} touch-target state-layer relative gap-1.5 rounded-md bg-surface-container-highest py-2.5 text-start text-on-surface has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-primary [transition:translate_var(--duration-spatial-fast)_var(--ease-spatial-fast),box-shadow_var(--duration-effects-fast)_var(--ease-effects-fast),background-color_var(--duration-effects)_var(--ease-effects),--state-layer_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  {
    variants: {
      /** The whole card opens its record. */
      link: { true: "cursor-pointer" },
      /** It can be dragged: a long press on touch must not select text or open the link's preview. */
      movable: { true: "cursor-grab select-none [-webkit-touch-callout:none]" },
      /** Picked up: lifted over the columns, following the pointer (its spring is switched off while it does). */
      dragging: {
        true: "pointer-events-none z-10 cursor-grabbing shadow-elevation-4 [--state-layer:var(--state-dragged)]",
      },
      /** Just dropped here: tinted, then back to its surface on the effects spring. */
      landed: { true: "bg-primary-container text-on-primary-container" },
    },
  },
);
export const kanbanCardTop = rcva(`${row} items-center gap-2`);
/** The headline: the slot that takes the room; as a link its hit area is the whole card. */
export const kanbanCardTitle = rcva(`${rowFill} text-title-sm`, {
  variants: {
    link: { true: "no-underline outline-none [--focus:host] after:absolute after:inset-0 after:content-['']" },
  },
});
/** The card's menu stays above the card's own link. */
export const kanbanCardTrailing = rcva(`${row} relative z-1 items-center`);
export const kanbanCardSupporting = rcva(`${text.prose} line-clamp-2 text-body-sm text-on-surface-variant`, {
  variants: { landed: { true: "text-on-primary-container" } },
});
/** Whose it is: a 24px avatar (M3 lists: primary container) and the name on one line. */
export const kanbanCardPerson = rcva(`${row} items-center gap-1.5 text-label-md text-on-surface-variant`, {
  variants: { landed: { true: "text-on-primary-container" } },
});
export const kanbanCardAvatar = rcva(
  `${fixed["6"]} ${row} items-center justify-center overflow-hidden [--clips:media] rounded-full bg-primary-container text-label-sm text-on-primary-container [&>img]:size-full [&>img]:object-cover`,
  { variants: { landed: { true: "bg-surface text-on-surface" } } },
);
export const kanbanCardName = rcva(rowLine);
/** Announces a drag to screen readers. */
export const kanbanAnnounce = rcva("sr-only");

export interface KanbanItem {
  key: string;
  headline: string;
  /** Up to two quiet lines under the headline. */
  supporting?: string;
  /** The whole card opens this. */
  href?: string;
  /** Who it belongs to: their picture or initials, and their name. */
  person?: { name: string; initials?: string; src?: string };
  /** The card's menu (a `<ui-dropdown>`), at the end of its first line. */
  trailing?: Renderable;
}

export interface KanbanColumn {
  key: string;
  /** Its plain name, for assistive tech and announcements. */
  label: string;
  /** What's shown as its heading (a tag in the state's tone); defaults to the label. */
  heading?: Renderable;
  items: KanbanItem[];
}

interface Drag {
  key: string;
  from: string;
  over: string;
}

/**
 * @example
 * <ui-kanban movable label="Cases by stage"
 *   .columns=${[{ key: "new", label: "New", items: [{ key: "c1", headline: "GS-0142", supporting: "Atlas Tankers", href: "/collections/cases/c1" }] }]}
 *   @ui-move=${(e) => move(e.detail.key, e.detail.to)}></ui-kanban>
 *
 * `ui-move` carries `{ key, from, to }` (column keys) when a card is dropped on another column.
 */
@customElement("ui-kanban")
export class UiKanban extends LightElement {
  @property({ attribute: false }) columns: KanbanColumn[] = [];
  /** Cards can be dragged to another column. */
  @property({ type: Boolean }) movable = false;
  /** Accessible name of the board. */
  @property() label?: string;

  @state() private _drag?: Drag;
  /** The card that was just dropped (tinted for a moment). */
  @state() private _landed?: string;
  @state() private _announce = "";
  private _landedTimer?: ReturnType<typeof setTimeout>;
  private _scrollFrame = 0;
  /** The dragged card, where it was grabbed, and where the pointer is. */
  private _held?: { card: HTMLElement; grabX: number; grabY: number; x: number; y: number; dx: number; dy: number };
  /** The click that ends a drag doesn't open the card. */
  private _swallowClick = false;

  constructor() {
    super();
    this.addEventListener(
      "click",
      (e) => {
        if (!this._swallowClick) return;
        this._swallowClick = false;
        e.stopPropagation();
        e.preventDefault();
      },
      true,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._landedTimer);
    cancelAnimationFrame(this._scrollFrame);
  }

  /**
   * A press on a card may become a drag: with a mouse or pen once it moves 6px, on touch after a
   * long press (moving first scrolls instead). Escape or a cancelled pointer drops nothing.
   */
  private _press(e: PointerEvent, column: KanbanColumn, item: KanbanItem) {
    if (!this.movable || e.button !== 0 || this._drag) return;
    // The card's own controls (its menu) keep their presses.
    if ((e.target as Element).closest("[data-kanban-trailing]")) return;
    const card = e.currentTarget as HTMLElement;
    const touch = e.pointerType === "touch";
    const start = { x: e.clientX, y: e.clientY };
    let armed = !touch;
    const begin = () => {
      const r = card.getBoundingClientRect();
      // It follows the pointer exactly: no spring between them until it is let go.
      card.style.transition = "none";
      this._held = { card, grabX: start.x - r.left, grabY: start.y - r.top, x: start.x, y: start.y, dx: 0, dy: 0 };
      this._drag = { key: item.key, from: column.key, over: column.key };
      this._announce = `Dragging ${item.headline}. Drop it on a column, or press Escape to cancel.`;
      this._autoScroll();
    };
    const timer = touch
      ? window.setTimeout(() => {
          armed = true;
          begin();
          navigator.vibrate?.(10);
        }, 350)
      : 0;
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      if (!this._drag) {
        const far = Math.hypot(ev.clientX - start.x, ev.clientY - start.y);
        if (!armed) {
          if (far > 8) stop();
          return;
        }
        if (far < 6) return;
        begin();
      }
      ev.preventDefault();
      this._dragTo(ev.clientX, ev.clientY);
    };
    // Once the card is picked up, a touch moves it instead of scrolling the page.
    const touchMove = (ev: TouchEvent) => {
      if (this._drag) ev.preventDefault();
    };
    const menu = (ev: Event) => ev.preventDefault();
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const dragging = !!this._drag;
      stop();
      if (dragging) this._drop(ev.type === "pointerup");
    };
    const key = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      ev.preventDefault();
      ev.stopPropagation();
      const dragging = !!this._drag;
      stop();
      if (dragging) this._drop(false);
    };
    const stop = () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("keydown", key, true);
      if (touch) window.removeEventListener("contextmenu", menu, true);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("keydown", key, true);
    // A long press on a link would open the browser's menu over the drag.
    if (touch) window.addEventListener("contextmenu", menu, true);
  }

  /** The pointer at (x, y): the card follows it, and the column under it is where it would land. */
  private _dragTo(x: number, y: number) {
    const h = this._held;
    if (!this._drag || !h) return;
    h.x = x;
    h.y = y;
    // Where the card sits without its offset: its box now, less the offset it already has.
    const r = h.card.getBoundingClientRect();
    h.dx = x - h.grabX - (r.left - h.dx);
    h.dy = y - h.grabY - (r.top - h.dy);
    h.card.style.translate = `${h.dx}px ${h.dy}px`;
    const over = this._columnAt(x, y);
    if (over && over !== this._drag.over) this._drag = { ...this._drag, over };
  }

  /** The column at a point, else the nearest one. */
  private _columnAt(x: number, y: number) {
    let best: { key: string; far: number } | undefined;
    for (const el of this.querySelectorAll<HTMLElement>("[data-kanban-column]")) {
      const r = el.getBoundingClientRect();
      const far = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      if (!best || far < best.far) best = { key: el.dataset.kanbanColumn!, far };
    }
    return best?.key;
  }

  /** Near the top or bottom of what scrolls the page, it scrolls under the dragged card. */
  private _autoScroll() {
    cancelAnimationFrame(this._scrollFrame);
    let scroller: Element | null = this.parentElement;
    while (
      scroller &&
      !(/(auto|scroll)/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight)
    )
      scroller = scroller.parentElement;
    const box = scroller ?? document.scrollingElement;
    const step = () => {
      const h = this._held;
      if (!this._drag || !h || !box) return;
      const r = scroller ? box.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      const edge = 56;
      const v =
        h.y < r.top + edge ? -(r.top + edge - h.y) / 4 : h.y > r.bottom - edge ? (h.y - (r.bottom - edge)) / 4 : 0;
      if (v) {
        const before = box.scrollTop;
        box.scrollTop += v;
        if (box.scrollTop !== before) this._dragTo(h.x, h.y);
      }
      this._scrollFrame = requestAnimationFrame(step);
    };
    this._scrollFrame = requestAnimationFrame(step);
  }

  private _drop(commit: boolean) {
    cancelAnimationFrame(this._scrollFrame);
    const d = this._drag;
    const h = this._held;
    this._drag = undefined;
    this._held = undefined;
    // Back to its place (on the card's own spring) unless whoever listens moves it.
    if (h) {
      h.card.style.transition = "";
      h.card.style.translate = "";
    }
    this._swallowClick = true;
    setTimeout(() => (this._swallowClick = false));
    if (!d) return;
    const name = (key: string) => this.columns.find((c) => c.key === key)?.label ?? key;
    if (!commit || d.over === d.from) {
      this._announce = "Not moved.";
      return;
    }
    this._announce = `Moved to ${name(d.over)}.`;
    this.land(d.key);
    this.dispatchEvent(new CustomEvent("ui-move", { detail: { key: d.key, from: d.from, to: d.over }, bubbles: true }));
  }

  /** Tints a card for a moment: the one that just moved (also when it moved from its menu). */
  land(key: string) {
    this._landed = key;
    clearTimeout(this._landedTimer);
    this._landedTimer = setTimeout(() => (this._landed = undefined), 900);
  }

  private _card(column: KanbanColumn, item: KanbanItem) {
    const dragging = this._drag?.key === item.key;
    const landed = this._landed === item.key && !dragging;
    const title = item.href
      ? html`<a class=${kanbanCardTitle({ link: true })} href=${item.href} draggable="false">${item.headline}</a>`
      : html`<span class=${kanbanCardTitle()}>${item.headline}</span>`;
    return html`<div
      role="listitem"
      class=${kanbanCard({ link: !!item.href && !this.movable, movable: this.movable, dragging, landed })}
      @pointerdown=${(e: PointerEvent) => this._press(e, column, item)}
    >
      <div class=${kanbanCardTop()}>
        ${title}
        ${
          item.trailing ? html`<div class=${kanbanCardTrailing()} data-kanban-trailing>${item.trailing}</div>` : nothing
        }
      </div>
      ${item.supporting ? html`<div class=${kanbanCardSupporting({ landed })}>${item.supporting}</div>` : nothing}
      ${
        item.person
          ? html`<div class=${kanbanCardPerson({ landed })}>
              <span class=${kanbanCardAvatar({ landed })} aria-hidden="true"
                >${item.person.src ? html`<img src=${item.person.src} alt="" />` : (item.person.initials ?? "")}</span
              >
              <span class=${kanbanCardName()}>${item.person.name}</span>
            </div>`
          : nothing
      }
    </div>`;
  }

  render() {
    return html`<div class=${kanban()} role="group" aria-label=${this.label ?? nothing}>
      ${repeat(
        this.columns,
        (c) => c.key,
        (c) =>
          html`<section
            class=${kanbanColumn({ over: !!this._drag && this._drag.over === c.key && this._drag.from !== c.key })}
            aria-label=${`${c.label}, ${c.items.length}`}
            data-kanban-column=${c.key}
          >
            <div class=${kanbanHeader()}>
              <h3 class=${kanbanHeading()}>${c.heading ?? c.label}</h3>
              <span class=${badge({ kind: "count" })}>${c.items.length}</span>
            </div>
            <div class=${kanbanList()} role="list">
              ${repeat(
                c.items,
                (i) => i.key,
                (i) => this._card(c, i),
              )}
            </div>
          </section>`,
      )}
      <span class=${kanbanAnnounce()} aria-live="polite">${this._announce}</span>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-kanban": UiKanban;
  }
}
