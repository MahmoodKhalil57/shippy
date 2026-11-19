import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { clampColumnWidth, COLUMN_MAX_WIDTH, COLUMN_MIN_WIDTH, moveColumn, orderColumns } from "../../base/columns.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { iconSvg } from "../media/icon.ts";
import { badge } from "./badge.ts";

/**
 * Table: Shows a list of data in a table format.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/table/
 *
 * All variants are responsive (e.g. `size="xs md:md"`, `pin-rows="lg"`).
 */
/**
 * A data table that reads at a glance:
 * - a header band (a tint of the surface) with small, spaced, uppercase labels at 75% ink (AA);
 * - rows separated by hairlines, a hover state layer (M3: 8% of the ink), selected rows tinted
 *   with the primary colour, and no line under the last row;
 * - body text at 80% ink, so the record's own link (the row's first cell) stands out as a label:
 *   full ink, medium weight, underlined only on hover;
 * - a row whose first cell links to its record opens it from anywhere on the row (the link's
 *   hit area covers the row; other links and controls in the row stay on top and keep working),
 *   and shows the link's keyboard focus as a ring around the whole row.
 */
export const table = rcva(
  [
    "table",
    // header band
    "[&_thead_tr]:border-b [&_thead_tr]:border-outline-variant [&_thead_th]:bg-surface-container-low [&_thead_th]:text-label-md [&_thead_th]:tracking-wide [&_thead_th]:uppercase [&_:where(thead,tfoot)]:text-on-surface-variant",
    // rows
    "[&_tbody_tr]:border-outline-variant [&_tbody_tr:last-child]:border-b-0 [&_tbody_tr]:[transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] [&_tbody_tr:hover]:bg-on-surface/(--state-hover)",
    // cells: secondary ink; the record link as a label
    "[&_td]:text-on-surface-variant [&_td_a]:no-underline [&_td_a]:underline-offset-2 [&_td_a:hover]:underline [&_td_a:hover]:text-on-surface [&_td:first-of-type_a]:font-medium [&_td:first-of-type_a]:text-on-surface",
    // the whole row opens the record
    "[&_tbody_tr]:relative [&_tbody_td:first-of-type_a]:after:absolute [&_tbody_td:first-of-type_a]:after:inset-0 [&_tbody_td:first-of-type_a]:after:content-[''] [&_tbody_tr:has(td:first-of-type_a)]:cursor-pointer [&_tbody_td:not(:first-of-type)_:is(a,button,label,input)]:relative [&_tbody_td:not(:first-of-type)_:is(a,button,label,input)]:z-1 [&_tbody_th_:is(a,button,label,input)]:relative [&_tbody_th_:is(a,button,label,input)]:z-1 [&_tbody_td:first-of-type_a]:focus-visible:outline-none [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:outline-2 [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:-outline-offset-2 [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:outline-primary",
  ].join(" "),
  {
    variants: {
      zebra: { true: "table-zebra" },
      /** Sticky rows inside `<thead>` / `<tfoot>`. */
      pinRows: { true: "table-pin-rows" },
      /** Sticky `<th>` columns. */
      pinCols: { true: "table-pin-cols" },
      size: {
        xs: "table-xs",
        sm: "table-sm",
        md: "table-md",
        lg: "table-lg",
        xl: "table-xl",
      },
      /** Table background ("Table with pinned-rows" uses base-200). */
      surface: { true: "bg-surface-container" },
      /** Keep every cell (and what's inside it) on one line; the wrapper scrolls sideways instead. */
      nowrap: { true: "[&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_.badge]:whitespace-nowrap" },
    },
  },
);

/** Scroll container around the table (horizontal overflow). */
export const tableWrapper = rcva("overflow-x-auto", {
  variants: {
    /** "Table with border and background". */
    bordered: { true: "rounded-box border border-outline-variant bg-surface [--scrollbar-inset:var(--radius-box)]" },
    /** Fixed scroll height (the pinned examples use `h-96`). */
    height: { sm: "h-64", md: "h-80", lg: "h-96" },
    /** Fixed scroll width (the pinned-cols example uses `w-96`). */
    width: { md: "w-80", lg: "w-96", full: "w-full" },
  },
});

/** Row states from the docs examples. */
export const tableRow = rcva("", {
  variants: {
    active: { true: "bg-surface-container" },
    hover: { true: "hover:bg-surface-container-highest" },
    /** Checked in a selectable table: M3's selected state (the primary container). */
    selected: { true: "bg-primary-container" },
  },
});

/** A cell's alignment: numbers line up on the right, in tabular figures. */
export const tableCell = rcva("", {
  variants: {
    align: { start: "", center: "text-center", end: "text-end tabular-nums whitespace-nowrap" },
    /** Keep on one line (ids and references that would break at their hyphens). */
    nowrap: { true: "whitespace-nowrap" },
    /** A column someone sized: what doesn't fit wraps, or ends in "…" on one-line cells. */
    sized: { true: "overflow-hidden text-ellipsis" },
    /** The column being dragged: its cells tinted, so it's clear which one moves. */
    dragging: { true: "bg-primary/5" },
  },
});

/**
 * A header cell of a reorderable table is the handle for its column: a grab cursor, and while
 * dragged it lifts (a solid surface at elevation +2) and follows the pointer. On touch it is
 * picked up with a long press, so a swipe still scrolls the page.
 */
export const tableHead = rcva("group/th", {
  variants: {
    draggable: { true: "cursor-grab touch-pan-y select-none" },
    dragging: { true: "z-2 cursor-grabbing rounded-field bg-surface! opacity-95 shadow-elevation-2" },
  },
});
/** A sized column's header label: one line, ending in "…" when it doesn't fit. */
export const tableHeadLabel = rcva("", { variants: { sized: { true: "block min-w-0 truncate" } } });

/**
 * The resize handle on a header's end edge: a 12px hit area over the column border, drawn as a
 * 2px line that shows on hovering the header and turns primary on hover, focus and drag.
 */
export const tableResize = rcva(
  "absolute inset-y-0 z-1 flex w-3 cursor-col-resize touch-none justify-center outline-none before:h-full before:w-0.5 before:rounded-full before:content-[''] before:[transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] group-hover/th:not-hover:before:bg-outline hover:before:bg-primary focus-visible:before:bg-primary",
  {
    variants: {
      /** Over the border between two columns; the last column's stays inside the table (no overflow). */
      last: { true: "end-0", false: "-end-1.5" },
      active: { true: "before:bg-primary!" },
    },
  },
);
/** Where a dragged column will land: a primary line down the table at that edge. */
export const tableDropMark = rcva("pointer-events-none absolute top-0 z-3 w-0.5 rounded-full bg-primary", {
  variants: { edge: { start: "-start-px", end: "-end-px" } },
});
/** Announces moves and size changes to screen readers. */
export const tableAnnounce = rcva("sr-only");

/**
 * A sortable column's header: a button showing which way it sorts (and, sorting by several
 * columns, in which order). Unsorted, the arrows show on hover / focus only.
 */
export const tableSort = rcva(
  "group/sort -mx-1.5 inline-flex max-w-full items-center gap-1 rounded-field px-1.5 py-0.5 font-[inherit] text-[inherit] tracking-[inherit] uppercase hover:bg-on-surface/(--state-hover) hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),color_var(--duration-effects-fast)_var(--ease-effects-fast)]",
  { variants: { align: { start: "", center: "", end: "flex-row-reverse" } } },
);
export const tableSortIcon = rcva(
  "[transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),rotate_var(--duration-spatial-fast)_var(--ease-spatial-fast)]",
  {
    variants: {
      state: {
        none: "opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60",
        asc: "text-primary",
        desc: "text-primary rotate-180",
      },
    },
  },
);
/** With several sort columns: this column's place among them. */
export const tableSortOrder = rcva("text-label-sm leading-none font-semibold text-primary-ink tabular-nums");

/** The body while new rows load: the current ones stay, dimmed. */
export const tableBody = rcva("[transition:opacity_var(--duration-effects)_var(--ease-effects)]", {
  variants: { busy: { true: "opacity-50" } },
});
/** A loading placeholder cell (M3's skeleton loader). */
export const tableSkeleton = rcva("skeleton h-4 w-full max-w-40 rounded-field");
/** The one row shown when there are no rows. */
export const tableEmpty = rcva("py-10 text-center text-on-surface-variant");

/** Cell anatomy from "Table with visual elements". */
export const tablePerson = rcva("flex items-center gap-3");
export const tablePersonAvatar = rcva("avatar");
export const tablePersonImage = rcva("w-12 h-12 mask mask-squircle");
export const tablePersonName = rcva("font-bold");
export const tablePersonSub = rcva("text-body-md text-on-surface-variant");

export type TableVariants = VariantProps<typeof table>;
export type TableWrapperVariants = VariantProps<typeof tableWrapper>;

/** Value shapes for the built-in cell kinds. */
export interface TablePersonCell {
  image: string;
  imageAlt?: string;
  name: Renderable;
  sub?: Renderable;
}
export interface TableTextBadgeCell {
  text: Renderable;
  badge?: Renderable;
}

export type TableRowData = Record<string, unknown>;

export interface TableColumn<T extends TableRowData = TableRowData> {
  key: string;
  label?: Renderable;
  /** Custom cell content; defaults to `row[key]`. */
  render?: (row: T, index: number) => Renderable;
  /** Render cells as `<th>` (with `pin-cols` these stick to the side). */
  header?: boolean;
  /**
   * Sorting by this column from its header: `true` sorts by `key`, a string by that path
   * (e.g. `"customer.name"`). See the table's `sort`.
   */
  sortable?: boolean | string;
  /** `end` for numbers and amounts (right-aligned, tabular figures). */
  align?: "start" | "center" | "end";
  /** Keep the cells on one line (ids, references). */
  nowrap?: boolean;
  /**
   * Stays first and can't be moved in a `reorderable` table: the column that links to the
   * record (the whole row opens it from the first cell's link).
   */
  fixed?: boolean;
  /**
   * Built-in cell layouts from the docs ("Table with visual elements"):
   * - `person`: value is `{ image, name, sub }` (avatar + two lines)
   * - `text-badge`: value is `{ text, badge }` (text with a small ghost badge below)
   * - `button`: value is the label of a ghost xs button; clicks fire `ui-cell-action`
   */
  kind?: "person" | "text-badge" | "button";
}

export interface TableGroup<T extends TableRowData = TableRowData> {
  /** Group heading row (sticks while scrolling with `pin-rows`). */
  label: Renderable;
  rows: T[];
}

/**
 * @example
 * <ui-table zebra index-column
 *   .columns=${[{ key: "name", label: "Name" }, { key: "job", label: "Job" }]}
 *   .rows=${[{ name: "Cy Ganderton", job: "Quality Control Specialist" }]}></ui-table>
 * @example <ui-table pin-rows surface height="lg" .groups=${[{ label: "A", rows: [...] }]} .columns=${[...]}></ui-table>
 * @example <ui-table selectable .columns=${[{ key: "user", label: "Name", kind: "person" }, { key: "more", kind: "button", header: true }]}></ui-table>
 *
 * Sorting: give columns `sortable`; `sort` is the current order as a Payload sort string
 * (`"-value"`, `"stage,-value"`). Clicking a header sorts by it (ascending, descending, then off);
 * Shift-click adds it to the current sort instead. `ui-sort` carries `{ sort }`; the table only
 * shows the order, the data comes sorted from whoever sets `rows`.
 * `hidden-columns` (`.hiddenColumns`) hides columns by key (see `<ui-column-picker>`). `loading`
 * dims the rows while new ones load, or shows skeleton rows when there are none yet; `empty` is
 * shown when there are no rows.
 *
 * Columns people arrange (opt in; whoever listens saves the result):
 * - `reorderable`: drag a header to move its column (a long press first on touch); a line shows
 *   where it lands, Escape cancels. From the keyboard, Ctrl + Shift + ← / → on a sortable header.
 *   `fixed` columns stay first.
 * - `resizable`: drag the line on a header's edge; with the edge focused, ← / → (Shift: bigger
 *   steps); double-click or Enter fits the column to its content again.
 * - `columnOrder` (keys) and `columnWidths` (px by key) hold the arrangement; `ui-columns`
 *   carries `{ order, widths }` after each change. Columns not in the order keep their place.
 *
 * `selectable` adds a checkbox column; `ui-select` carries `{ selected: number[] }`
 * (row indexes). `ui-row-click` carries `{ row, index }`; `ui-cell-action` carries
 * `{ row, index, key }` for `kind: "button"` cells.
 * Data-driven only: the HTML parser drops `<thead>`/`<tbody>`/`<tr>` that aren't
 * inside a real `<table>`, so authored children can't be forwarded. For fully
 * custom markup, write `<table class=${table({ zebra: true })}>` yourself.
 */
@customElement("ui-table")
export class UiTable extends LightElement {
  @property({ attribute: false }) columns: TableColumn[] = [];
  @property({ attribute: false }) rows: TableRowData[] = [];
  /** Grouped rows, each with its own `<thead>` heading (the "pinned-rows" example). */
  @property({ attribute: false }) groups: TableGroup[] = [];
  @property({ converter: responsiveBoolean }) zebra: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean, attribute: "pin-rows" }) pinRows: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean, attribute: "pin-cols" }) pinCols: Responsive<boolean> = false;
  @property() size: TableVariants["size"];
  /** e.g. `nowrap="max-lg"`: one-line cells on small screens, scrolling sideways. */
  @property({ converter: responsiveBoolean }) nowrap: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) bordered: Responsive<boolean> = false;
  @property() height: TableWrapperVariants["height"];
  @property() width: TableWrapperVariants["width"];
  /** Highlight rows on hover. */
  @property({ converter: responsiveBoolean }) hover: Responsive<boolean> = false;
  /** Index of the highlighted (active) row. */
  @property({ type: Number, attribute: "active-row" }) activeRow = -1;
  /** Leading `<th>` with the 1-based row number. */
  @property({ type: Boolean, attribute: "index-column" }) indexColumn = false;
  /** Leading checkbox column. */
  @property({ type: Boolean }) selectable = false;
  /** Repeat the header row in a `<tfoot>`. */
  @property({ type: Boolean }) footer = false;
  @property({ attribute: false }) selected: number[] = [];
  /** The current order, as a Payload sort string: `"-value"`, `"stage,-value"`. */
  @property() sort = "";
  /** Keys of columns not shown. */
  @property({ attribute: false }) hiddenColumns: string[] = [];
  /** New rows are on their way. */
  @property({ type: Boolean }) loading = false;
  /** Shown in place of rows when there are none (and nothing is loading). */
  @property({ attribute: false }) empty: Renderable = "";
  /** Columns move by dragging their header. */
  @property({ type: Boolean }) reorderable = false;
  /** Columns resize from their header's edge. */
  @property({ type: Boolean }) resizable = false;
  /** Column keys in the order to show them. */
  @property({ attribute: false }) columnOrder: string[] = [];
  /** Widths people set, in px by key; other columns fit their content. */
  @property({ attribute: false }) columnWidths: Record<string, number> = {};

  @state() private _drag?: { key: string; dx: number; target: number; height: number };
  @state() private _resizing?: string;
  @state() private _announce = "";
  /** Header midpoints (from the table's left edge) and the pointer's start, taken when a drag starts. */
  private _geom = { mids: [] as number[], x0: 0, fixed: 0 };
  private _lastX = 0;
  private _scrollFrame = 0;
  /** The click that ends a drag isn't a sort. */
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

  private get _ordered() {
    return orderColumns(this.columns, this.columnOrder);
  }

  private get _columns() {
    return this._ordered.filter((c) => !this.hiddenColumns.includes(c.key));
  }

  private get _rtl() {
    return getComputedStyle(this).direction === "rtl";
  }

  private _name(c: TableColumn) {
    return typeof c.label === "string" && c.label ? c.label : c.key;
  }

  private _th(key: string) {
    return this.querySelector<HTMLElement>(`thead th[data-key="${CSS.escape(key)}"]`);
  }

  private _widthStyle(key: string) {
    const w = this.columnWidths[key];
    return w === undefined ? "" : `width:${w}px;min-width:${w}px;max-width:${w}px;`;
  }

  private _emitColumns(order = this._ordered.map((c) => c.key), widths = this.columnWidths) {
    this.columnOrder = order;
    this.columnWidths = widths;
    this.dispatchEvent(new CustomEvent("ui-columns", { detail: { order, widths }, bubbles: true }));
  }

  // ---------------------------------------------------------------- moving columns

  private _move(c: TableColumn, to: { before?: string; after?: string }, place: number) {
    this._emitColumns(
      moveColumn(
        this._ordered.map((x) => x.key),
        c.key,
        to,
      ),
    );
    this._announce = `${this._name(c)} moved to column ${place + 1} of ${this._columns.length}`;
  }

  /** Ctrl + Shift + ← / → on a sortable header moves its column one place, keeping the focus on it. */
  private async _moveKey(e: KeyboardEvent, c: TableColumn) {
    if (!this.reorderable || c.fixed || !e.ctrlKey || !e.shiftKey) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const cols = this._columns;
    const i = cols.indexOf(c);
    const forward = (e.key === "ArrowRight") !== this._rtl;
    const j = forward ? i + 1 : i - 1;
    const other = cols[j];
    if (!other || other.fixed) return;
    this._move(c, forward ? { after: other.key } : { before: other.key }, j);
    await this.updateComplete;
    this._th(c.key)?.querySelector("button")?.focus();
  }

  /**
   * A press on a header may become a drag: with a mouse or pen once it moves sideways, on touch
   * after a long press (moving first scrolls instead). Escape or a cancelled pointer drops nothing.
   */
  private _press(e: PointerEvent, c: TableColumn) {
    if (!this.reorderable || c.fixed || e.button !== 0 || this._drag) return;
    if ((e.target as Element).closest('[role="separator"]')) return;
    const touch = e.pointerType === "touch";
    const start = { x: e.clientX, y: e.clientY };
    let armed = !touch;
    const timer = touch
      ? window.setTimeout(() => {
          armed = true;
          this._beginDrag(c.key, start.x);
          navigator.vibrate?.(10);
        }, 350)
      : 0;
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!this._drag) {
        if (!armed) {
          if (Math.hypot(dx, dy) > 8) stop();
          return;
        }
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
        this._beginDrag(c.key, start.x);
      }
      ev.preventDefault();
      this._dragTo(ev.clientX);
    };
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
      window.removeEventListener("keydown", key, true);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("keydown", key, true);
  }

  private _beginDrag(key: string, x: number) {
    const table = this.querySelector("table");
    if (!table) return;
    const t = table.getBoundingClientRect();
    const cols = this._columns;
    this._geom = {
      mids: cols.map((c) => {
        const r = this._th(c.key)?.getBoundingClientRect();
        return r ? r.left - t.left + r.width / 2 : 0;
      }),
      x0: x - t.left,
      fixed: cols.filter((c) => c.fixed).length,
    };
    this._lastX = x;
    this._drag = { key, dx: 0, target: cols.findIndex((c) => c.key === key), height: t.height };
    this._autoScroll();
  }

  /** The pointer at `x`: the header follows it, and the drop line goes to the nearest gap. */
  private _dragTo(x: number) {
    const table = this.querySelector("table");
    if (!this._drag || !table) return;
    this._lastX = x;
    const tx = x - table.getBoundingClientRect().left;
    const rtl = this._rtl;
    const passed = this._geom.mids.filter((m) => (rtl ? m > tx : m < tx)).length;
    this._drag = { ...this._drag, dx: tx - this._geom.x0, target: Math.max(this._geom.fixed, passed) };
  }

  /** Near the scroll area's side, a wide table scrolls under the dragged header. */
  private _autoScroll() {
    cancelAnimationFrame(this._scrollFrame);
    const step = () => {
      if (!this._drag) return;
      const wrap = this.firstElementChild as HTMLElement | null;
      if (wrap) {
        const r = wrap.getBoundingClientRect();
        const edge = 48;
        const x = this._lastX;
        const v = x < r.left + edge ? -(r.left + edge - x) / 3 : x > r.right - edge ? (x - (r.right - edge)) / 3 : 0;
        if (v) {
          const before = wrap.scrollLeft;
          wrap.scrollLeft += v;
          if (wrap.scrollLeft !== before) this._dragTo(x);
        }
      }
      this._scrollFrame = requestAnimationFrame(step);
    };
    this._scrollFrame = requestAnimationFrame(step);
  }

  private _drop(commit: boolean) {
    cancelAnimationFrame(this._scrollFrame);
    const d = this._drag;
    this._drag = undefined;
    this._swallowClick = true;
    setTimeout(() => (this._swallowClick = false));
    if (!d || !commit) return;
    const cols = this._columns;
    const i = cols.findIndex((c) => c.key === d.key);
    const t = d.target;
    if (i < 0 || t === i || t === i + 1) return;
    this._move(cols[i]!, t < i ? { before: cols[t]!.key } : { after: cols[t - 1]!.key }, t < i ? t : t - 1);
  }

  // ---------------------------------------------------------------- resizing columns

  private _startResize(e: PointerEvent, c: TableColumn) {
    if (e.button !== 0) return;
    const th = this._th(c.key);
    if (!th) return;
    e.preventDefault();
    e.stopPropagation();
    // Capture keeps the resize cursor while the pointer leaves the handle; the moves are read
    // from the window either way.
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* not an active pointer */
    }
    const from = th.getBoundingClientRect().width;
    const sign = this._rtl ? -1 : 1;
    let width: number | undefined;
    let frame = 0;
    this._resizing = c.key;
    const apply = () => {
      if (width !== undefined) this.columnWidths = { ...this.columnWidths, [c.key]: width };
    };
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      width = clampColumnWidth(from + (ev.clientX - e.clientX) * sign);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      this._resizing = undefined;
      if (width === undefined) return;
      apply();
      this._emitColumns();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  private _resizeKey(e: KeyboardEvent, c: TableColumn) {
    if (e.key === "Enter") {
      e.preventDefault();
      this._fit(c);
      return;
    }
    const grow = this._rtl ? "ArrowLeft" : "ArrowRight";
    const shrink = this._rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key !== grow && e.key !== shrink) return;
    e.preventDefault();
    const from = this.columnWidths[c.key] ?? this._th(c.key)?.getBoundingClientRect().width ?? 160;
    const width = clampColumnWidth(from + (e.shiftKey ? 48 : 8) * (e.key === grow ? 1 : -1));
    this._emitColumns(undefined, { ...this.columnWidths, [c.key]: width });
    this._announce = `${this._name(c)} ${width} pixels wide`;
  }

  /** Back to fitting its content. */
  private _fit(c: TableColumn) {
    if (this.columnWidths[c.key] === undefined) return;
    const { [c.key]: _, ...rest } = this.columnWidths;
    this._emitColumns(undefined, rest);
    this._announce = `${this._name(c)} fits its content`;
  }

  private get _sorts() {
    return this.sort
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ path: s.replace(/^-/, ""), desc: s.startsWith("-") }));
  }

  /**
   * Click: sort by this column alone; clicking it again goes ascending → descending → off.
   * Shift-click: add it to the sort, or step it (ascending → descending → removed) in place.
   */
  private _sortBy(path: string, add: boolean) {
    const sorts = this._sorts;
    const at = sorts.findIndex((s) => s.path === path);
    const step = (s?: { path: string; desc: boolean }) =>
      !s ? [{ path, desc: false }] : !s.desc ? [{ path, desc: true }] : [];
    const list = add
      ? at < 0
        ? [...sorts, ...step()]
        : sorts.flatMap((s, i) => (i === at ? step(s) : [s]))
      : step(sorts.length === 1 ? sorts[at] : undefined);
    this.sort = list.map((s) => (s.desc ? `-${s.path}` : s.path)).join(",");
    this.dispatchEvent(new CustomEvent("ui-sort", { detail: { sort: this.sort }, bubbles: true }));
  }

  /** A header cell; `live` ones (the head, not the repeated foot) can be dragged and resized. */
  private _headCell(c: TableColumn, index: number, live: boolean) {
    const label = c.label ?? (c.kind === "button" ? "" : c.key);
    const sized = this.columnWidths[c.key] !== undefined;
    const drag = live ? this._drag : undefined;
    const dragging = drag?.key === c.key;
    const cls = [
      tableCell({ align: c.align }),
      live ? tableHead({ draggable: this.reorderable && !c.fixed, dragging }) : "",
    ]
      .filter(Boolean)
      .join(" ");
    const style = `${this._widthStyle(c.key)}${dragging ? `translate:${drag!.dx}px 0;` : ""}`;
    const text = html`<span class=${tableHeadLabel({ sized }) || nothing}>${label}</span>`;
    // Where the dragged column would land, unless that's where it already is.
    const from = drag ? this._columns.findIndex((x) => x.key === drag.key) : -1;
    const lands = drag && drag.target !== from && drag.target !== from + 1;
    const last = index === this._columns.length - 1;
    const mark =
      lands && (drag.target === index || (last && drag.target === index + 1))
        ? html`<span
            class=${tableDropMark({ edge: drag.target === index ? "start" : "end" })}
            style=${`height:${drag.height}px`}
          ></span>`
        : nothing;
    const resize =
      live && this.resizable
        ? html`<span
            role="separator"
            tabindex="0"
            aria-orientation="vertical"
            aria-label=${`Resize ${this._name(c)} column`}
            aria-valuemin=${COLUMN_MIN_WIDTH}
            aria-valuemax=${COLUMN_MAX_WIDTH}
            aria-valuenow=${this.columnWidths[c.key] ?? nothing}
            title="Drag to resize · double-click to fit"
            class=${tableResize({ last, active: this._resizing === c.key })}
            @pointerdown=${(e: PointerEvent) => this._startResize(e, c)}
            @keydown=${(e: KeyboardEvent) => this._resizeKey(e, c)}
            @dblclick=${() => this._fit(c)}
            @click=${(e: Event) => e.stopPropagation()}
          ></span>`
        : nothing;
    const down = (e: PointerEvent) => live && this._press(e, c);
    if (!c.sortable)
      return html`<th
        class=${cls || nothing}
        style=${style || nothing}
        data-key=${live ? c.key : nothing}
        @pointerdown=${down}
      >
        ${text}${resize}${mark}
      </th>`;
    const path = typeof c.sortable === "string" ? c.sortable : c.key;
    const sorts = this._sorts;
    const at = sorts.findIndex((s) => s.path === path);
    const state = at < 0 ? "none" : sorts[at]!.desc ? "desc" : "asc";
    return html`<th
      class=${cls || nothing}
      style=${style || nothing}
      data-key=${live ? c.key : nothing}
      aria-sort=${state === "none" ? "none" : state === "asc" ? "ascending" : "descending"}
      @pointerdown=${down}
    >
      <button
        type="button"
        class=${tableSort({ align: c.align })}
        title=${
          live && this.reorderable && !c.fixed
            ? "Sort (Shift-click to sort by several columns). Drag or Ctrl+Shift+← / → to move"
            : "Sort (Shift-click to sort by several columns)"
        }
        @click=${(e: MouseEvent) => this._sortBy(path, e.shiftKey)}
        @keydown=${(e: KeyboardEvent) => live && this._moveKey(e, c)}
      >
        ${text}
        <span class=${tableSortIcon({ state })} aria-hidden="true"
          >${iconSvg(state === "none" ? "unfold" : "arrow-up", { size: "sm" })}</span
        >
        ${sorts.length > 1 && at >= 0 ? html`<span class=${tableSortOrder()}>${at + 1}</span>` : nothing}
      </button>
      ${resize}${mark}
    </th>`;
  }

  private _toggle(index: number, on: boolean) {
    this.selected = on ? [...this.selected, index] : this.selected.filter((i) => i !== index);
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { selected: this.selected }, bubbles: true }));
  }

  private _toggleAll(on: boolean) {
    const total = this.groups.length ? this.groups.reduce((n, g) => n + g.rows.length, 0) : this.rows.length;
    this.selected = on ? Array.from({ length: total }, (_, i) => i) : [];
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { selected: this.selected }, bubbles: true }));
  }

  private _headRow(withSelectAll: boolean) {
    const total = this.groups.length ? this.groups.reduce((n, g) => n + g.rows.length, 0) : this.rows.length;
    return html`<tr>
      ${
        this.selectable
          ? html`<th>
              ${
                withSelectAll
                  ? html`<label>
                      <input
                        type="checkbox"
                        class="checkbox"
                        aria-label="Select all"
                        .checked=${total > 0 && this.selected.length === total}
                        @change=${(e: Event) => this._toggleAll((e.target as HTMLInputElement).checked)}
                      />
                    </label>`
                  : nothing
              }
            </th>`
          : nothing
      }
      ${this.indexColumn ? html`<th></th>` : nothing}
      ${this._columns.map((c, i) => this._headCell(c, i, withSelectAll))}
    </tr>`;
  }

  private _row(row: TableRowData, index: number) {
    const cell = (c: TableColumn): TemplateResult => {
      const v = c.render ? c.render(row, index) : this._kind(c, row, index);
      const cls =
        tableCell({
          align: c.align,
          nowrap: c.nowrap,
          sized: this.columnWidths[c.key] !== undefined,
          dragging: this._drag?.key === c.key,
        }) || nothing;
      const style = this._widthStyle(c.key) || nothing;
      return c.header
        ? html`<th class=${cls} style=${style}>${v}</th>`
        : html`<td class=${cls} style=${style}>${v}</td>`;
    };
    return html`<tr
      class=${tableRow({ active: index === this.activeRow, hover: this.hover, selected: this.selected.includes(index) }) || nothing}
      aria-selected=${this.selectable ? (this.selected.includes(index) ? "true" : "false") : nothing}
      @click=${() => this.dispatchEvent(new CustomEvent("ui-row-click", { detail: { row, index }, bubbles: true }))}
    >
      ${
        this.selectable
          ? html`<th>
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                  aria-label=${`Select row ${index + 1}`}
                  .checked=${this.selected.includes(index)}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${(e: Event) => this._toggle(index, (e.target as HTMLInputElement).checked)}
                />
              </label>
            </th>`
          : nothing
      }
      ${this.indexColumn ? html`<th>${index + 1}</th>` : nothing} ${this._columns.map(cell)}
    </tr>`;
  }

  private _kind(c: TableColumn, row: TableRowData, index: number): Renderable {
    const v = row[c.key];
    if (c.kind === "person" && v && typeof v === "object") {
      const p = v as TablePersonCell;
      return html`<div class=${tablePerson()}>
        <div class=${tablePersonAvatar()}>
          <div class=${tablePersonImage()}><img src=${p.image} alt=${p.imageAlt ?? ""} /></div>
        </div>
        <div>
          <div class=${tablePersonName()}>${p.name}</div>
          ${p.sub != null ? html`<div class=${tablePersonSub()}>${p.sub}</div>` : nothing}
        </div>
      </div>`;
    }
    if (c.kind === "text-badge" && v && typeof v === "object") {
      const t = v as TableTextBadgeCell;
      return html`${t.text}${
        t.badge != null ? html`<br /><span class=${badge({ variant: "ghost", size: "sm" })}>${t.badge}</span>` : nothing
      }`;
    }
    if (c.kind === "button") {
      return html`<button
        type="button"
        class=${button({ variant: "ghost", size: "xs" })}
        @click=${(e: Event) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent("ui-cell-action", { detail: { row, index, key: c.key }, bubbles: true }));
        }}
      >
        ${v as Renderable}
      </button>`;
    }
    return v as Renderable;
  }

  private _body() {
    if (this.groups.length) {
      let offset = 0;
      return this.groups.map((g) => {
        const start = offset;
        offset += g.rows.length;
        return html`<thead>
            <tr>
              <th colspan=${this._span}>${g.label}</th>
            </tr>
          </thead>
          <tbody>
            ${g.rows.map((r, i) => this._row(r, start + i))}
          </tbody>`;
      });
    }
    return html`<thead>
        ${this._headRow(true)}
      </thead>
      <tbody
        class=${tableBody({ busy: this.loading && this.rows.length > 0 })}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${
          this.rows.length
            ? this.rows.map((r, i) => this._row(r, i))
            : this.loading
              ? Array.from(
                  { length: 5 },
                  () =>
                    html`<tr>
                      ${this.selectable ? html`<th></th>` : nothing} ${this.indexColumn ? html`<th></th>` : nothing}
                      ${this._columns.map((c) => html`<td class=${tableCell({ align: c.align }) || nothing} style=${this._widthStyle(c.key) || nothing}><div class=${tableSkeleton()}></div></td>`)}
                    </tr>`,
                )
              : this.empty
                ? html`<tr>
                    <td colspan=${this._span} class=${tableEmpty()}>${this.empty}</td>
                  </tr>`
                : nothing
        }
      </tbody>`;
  }

  private get _span() {
    return this._columns.length + (this.indexColumn ? 1 : 0) + (this.selectable ? 1 : 0);
  }

  render() {
    const cls = table({
      zebra: this.zebra,
      pinRows: this.pinRows,
      pinCols: this.pinCols,
      size: this.size,
      surface: this.surface,
      nowrap: this.nowrap,
    });
    return html`<div class=${tableWrapper({ bordered: this.bordered, height: this.height, width: this.width })}>
      <table class=${cls}>
        ${this._body()}
        ${
          this.footer
            ? html`<tfoot>
                ${this._headRow(false)}
              </tfoot>`
            : nothing
        }
      </table>
      <span class=${tableAnnounce()} aria-live="polite">${this._announce}</span>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-table": UiTable;
  }
}
