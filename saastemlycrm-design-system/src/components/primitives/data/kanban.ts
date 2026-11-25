import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { m } from "../../../i18n/index.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixed, grid, inset, row, rowFill, rowLine, stack, text } from "../layout/algebra.ts";
import { badge } from "./badge.ts";

export const kanban = rcva(`${grid.xs} items-start gap-3`);
export const kanbanColumn = rcva(
  `${stack} ${inset["2"]} gap-2 rounded-lg bg-surface-container-low py-2 outline-2 -outline-offset-2 [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),outline-color_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  {
    variants: {
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
      link: { true: "cursor-pointer" },
      movable: { true: "cursor-grab select-none [-webkit-touch-callout:none]" },
      dragging: {
        true: "pointer-events-none z-10 cursor-grabbing shadow-elevation-4 [--state-layer:var(--state-dragged)]",
      },
      landed: { true: "bg-primary-container text-on-primary-container" },
    },
  },
);
export const kanbanCardTop = rcva(`${row} items-center gap-2`);
export const kanbanCardTitle = rcva(`${rowFill} text-title-sm`, {
  variants: {
    link: { true: "no-underline outline-none [--focus:host] after:absolute after:inset-0 after:content-['']" },
  },
});
export const kanbanCardTrailing = rcva(`${row} relative z-1 items-center`);
export const kanbanCardSupporting = rcva(`${text.prose} line-clamp-2 text-body-sm text-on-surface-variant`, {
  variants: { landed: { true: "text-on-primary-container" } },
});
export const kanbanCardPerson = rcva(`${row} items-center gap-1.5 text-label-md text-on-surface-variant`, {
  variants: { landed: { true: "text-on-primary-container" } },
});
export const kanbanCardAvatar = rcva(
  `${fixed["6"]} ${row} items-center justify-center overflow-hidden [--clips:media] rounded-full bg-primary-container text-label-sm text-on-primary-container [&>img]:size-full [&>img]:object-cover`,
  { variants: { landed: { true: "bg-surface text-on-surface" } } },
);
export const kanbanCardName = rcva(rowLine);
export const kanbanAnnounce = rcva("sr-only");

export interface KanbanItem {
  key: string;
  headline: string;
  supporting?: string;
  href?: string;
  person?: { name: string; initials?: string; src?: string };
  trailing?: Renderable;
}

export interface KanbanColumn {
  key: string;
  label: string;
  heading?: Renderable;
  items: KanbanItem[];
}

interface Drag {
  key: string;
  from: string;
  over: string;
}

@customElement("ui-kanban")
export class UiKanban extends LightElement {
  @property({ attribute: false }) columns: KanbanColumn[] = [];
  @property({ type: Boolean }) movable = false;
  @property() label?: string;

  @state() private _drag?: Drag;
  @state() private _landed?: string;
  @state() private _announce = "";
  private _landedTimer?: ReturnType<typeof setTimeout>;
  private _scrollFrame = 0;
  private _held?: { card: HTMLElement; grabX: number; grabY: number; x: number; y: number; dx: number; dy: number };
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

  private _press(e: PointerEvent, column: KanbanColumn, item: KanbanItem) {
    if (!this.movable || e.button !== 0 || this._drag) return;
    if ((e.target as Element).closest("[data-kanban-trailing]")) return;
    const card = e.currentTarget as HTMLElement;
    const touch = e.pointerType === "touch";
    const start = { x: e.clientX, y: e.clientY };
    let armed = !touch;
    const begin = () => {
      const r = card.getBoundingClientRect();
      card.style.transition = "none";
      this._held = { card, grabX: start.x - r.left, grabY: start.y - r.top, x: start.x, y: start.y, dx: 0, dy: 0 };
      this._drag = { key: item.key, from: column.key, over: column.key };
      this._announce = m.kanban_dragging({ card: item.headline });
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
    if (touch) window.addEventListener("contextmenu", menu, true);
  }

  private _dragTo(x: number, y: number) {
    const h = this._held;
    if (!this._drag || !h) return;
    h.x = x;
    h.y = y;
    const r = h.card.getBoundingClientRect();
    h.dx = x - h.grabX - (r.left - h.dx);
    h.dy = y - h.grabY - (r.top - h.dy);
    h.card.style.translate = `${h.dx}px ${h.dy}px`;
    const over = this._columnAt(x, y);
    if (over && over !== this._drag.over) this._drag = { ...this._drag, over };
  }

  private _columnAt(x: number, y: number) {
    let best: { key: string; far: number } | undefined;
    for (const el of this.querySelectorAll<HTMLElement>("[data-kanban-column]")) {
      const r = el.getBoundingClientRect();
      const far = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      if (!best || far < best.far) best = { key: el.dataset.kanbanColumn!, far };
    }
    return best?.key;
  }

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
    if (h) {
      h.card.style.transition = "";
      h.card.style.translate = "";
    }
    this._swallowClick = true;
    setTimeout(() => (this._swallowClick = false));
    if (!d) return;
    const name = (key: string) => this.columns.find((c) => c.key === key)?.label ?? key;
    if (!commit || d.over === d.from) {
      this._announce = m.kanban_not_moved();
      return;
    }
    this._announce = m.kanban_moved({ column: name(d.over) });
    this.land(d.key);
    this.dispatchEvent(new CustomEvent("ui-move", { detail: { key: d.key, from: d.from, to: d.over }, bubbles: true }));
  }

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
            aria-label=${m.kanban_column({ column: c.label, count: c.items.length })}
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
