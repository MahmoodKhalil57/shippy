import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { clampColumnWidth, COLUMN_MAX_WIDTH, COLUMN_MIN_WIDTH, moveColumn, orderColumns } from "../../base/columns.ts";
import { formatInt, m } from "../../../i18n/index.ts";
import { isRtl } from "../../base/reading.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import {
  fixed,
  fixedWidth,
  inlineRow,
  row,
  rowLine,
  scrolled,
  scrollRoom,
  scrollX,
  stack,
  text,
} from "../layout/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { tag } from "./tag.ts";

export const table = rcva(
  [
    "table",
    "[&_thead_tr]:border-b [&_thead_tr]:border-outline-variant [&_thead_th]:bg-surface-container-low [&_thead_th]:text-label-md [&_thead_th]:tracking-wide [&_thead_th]:uppercase [&_:where(thead,tfoot)]:text-on-surface-variant",
    "[&_tbody_tr]:border-outline-variant [&_tbody_tr:last-child]:border-b-0 [&_tbody_tr]:state-layer",
    "[&_td]:text-on-surface-variant [&_td_a]:no-underline [&_td_a]:underline-offset-2 [&_td_a:hover]:underline [&_td_a:hover]:text-on-surface [&_td:first-of-type_a]:font-medium [&_td:first-of-type_a]:text-on-surface",
    "[&_tbody_tr]:relative [&_tbody_td:first-of-type_a]:after:absolute [&_tbody_td:first-of-type_a]:after:inset-0 [&_tbody_td:first-of-type_a]:after:content-[''] [&_tbody_tr:has(td:first-of-type_a)]:cursor-pointer [&_tbody_td:not(:first-of-type)_:is(a,button,label,input)]:relative [&_tbody_td:not(:first-of-type)_:is(a,button,label,input)]:z-1 [&_tbody_th_:is(a,button,label,input)]:relative [&_tbody_th_:is(a,button,label,input)]:z-1 [--focus:host] [&_tbody_td:first-of-type_a]:focus-visible:outline-none [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:outline-2 [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:-outline-offset-2 [&_tbody_tr:has(td:first-of-type_a:focus-visible)]:outline-primary",
  ].join(" "),
  {
    variants: {
      zebra: { true: "table-zebra" },
      pinRows: { true: "table-pin-rows" },
      pinCols: { true: "table-pin-cols" },
      size: {
        xs: "table-xs",
        sm: "table-sm",
        md: "table-md",
        lg: "table-lg",
        xl: "table-xl",
      },
      density: {
        "0": "",
        "-1": "[&_:is(th,td)]:py-2.5",
        "-2": "[&_:is(th,td)]:py-2",
      },
      lines: {
        wrap: scrolled.tableColumns,
        one: "[&_thead_th_button]:min-w-max [&_tbody_tr]:h-11 [&_tbody_:is(td,th)]:max-w-80 [&_tbody_:is(td,th)]:py-1.5 [&_tbody_td]:truncate [&_tbody_td_*]:text-nowrap [&_thead_th]:py-2 [&_thead_th]:whitespace-nowrap [&_thead_th]:bg-transparent! [&_thead_th]:text-label-sm!",
      },
      surface: { true: "bg-surface-container" },
      nowrap: { true: "" },
    },
    compoundVariants: [
      { lines: "one", density: "-1", class: "[&_tbody_tr]:h-10! [&_tbody_:is(td,th)]:py-1!" },
      { lines: "one", density: "-2", class: "[&_tbody_tr]:h-9! [&_tbody_:is(td,th)]:py-0.5!" },
    ],
    defaultVariants: { lines: "wrap" },
  },
);

export const tableWrapper = rcva(scrollX, {
  variants: {
    nowrap: {
      true: `overflow-x-auto ${scrollRoom} [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_.badge]:whitespace-nowrap`,
    },
    bordered: { true: "rounded-box border border-outline-variant bg-surface [--scrollbar-inset:var(--radius-box)]" },
    height: { sm: "h-64", md: "h-80", lg: "h-96" },
    width: { md: "w-80 max-w-full", lg: "w-96 max-w-full", full: "w-full" },
  },
});

export const tableRow = rcva("", {
  variants: {
    active: { true: "bg-surface-container" },
    hover: { true: "state-layer" },
    selected: { true: "bg-primary-container" },
  },
});

export const tableCell = rcva("", {
  variants: {
    align: { start: "", center: "text-center", end: "text-end tabular-nums min-w-0 truncate" },
    nowrap: { true: "min-w-0 truncate" },
    sized: { true: "overflow-hidden [--clips:text] text-ellipsis" },
    dragging: { true: "bg-primary/5" },
  },
});

export const tableHead = rcva("group/th", {
  variants: {
    draggable: { true: "cursor-grab touch-pan-y select-none" },
    dragging: { true: "z-2 cursor-grabbing rounded-field bg-surface! opacity-95 shadow-elevation-2" },
  },
});
export const tableCellStack = rcva(`${stack} gap-0.5`);
export const tableCellLine = rcva("", { variants: { one: { true: "min-w-0 truncate" } } });
export const tableSupporting = rcva(`${text.label} text-body-sm`, {
  variants: {
    tone: {
      error: "text-error-ink",
      warning: "text-warning-ink",
      success: "text-success-ink",
    },
  },
});
export const tableHeadLabel = rcva("", { variants: { sized: { true: "block min-w-0 truncate" } } });

export const tableResize = rcva(
  `${row} absolute inset-y-0 z-1 w-3 pointer-coarse:w-6 cursor-col-resize touch-none justify-center outline-none [--focus:fill] before:h-full before:w-0.5 before:rounded-full before:content-[''] before:[transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast)] group-hover/th:not-hover:before:bg-outline hover:before:bg-primary focus-visible:before:bg-primary`,
  {
    variants: {
      last: { true: "end-0", false: "-end-1.5 pointer-coarse:-end-3" },
      active: { true: "before:bg-primary!" },
    },
  },
);
export const tableDropMark = rcva("pointer-events-none absolute top-0 z-3 w-0.5 rounded-full bg-primary", {
  variants: { edge: { start: "-start-px", end: "-end-px" } },
});
export const tableAnnounce = rcva("sr-only");

export const tableSort = rcva(
  `${inlineRow} group/sort touch-target items-center gap-1 rounded-field py-0.5 font-[inherit] text-[inherit] tracking-[inherit] uppercase state-layer hover:text-on-surface [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),color_var(--duration-effects-fast)_var(--ease-effects-fast)]`,
  { variants: { align: { start: "", center: "", end: "flex flex-row-reverse flex-wrap max-w-full inline-flex!" } } },
);
export const tableSortLabel = rcva(rowLine);
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
export const tableSortOrder = rcva("text-label-sm leading-none font-semibold text-primary-ink tabular-nums");

export const tableBody = rcva("[transition:opacity_var(--duration-effects)_var(--ease-effects)]", {
  variants: { busy: { true: "opacity-50" } },
});
export const tableSkeleton = rcva(`skeleton h-4 ${fixedWidth["16"]} rounded-field`);
export const tableEmpty = rcva("py-10 text-center text-on-surface-variant");

export const tablePerson = rcva(`${row} items-center gap-2`);
export const tablePersonAvatar = rcva(
  `${fixed["7"]} ${row} items-center justify-center overflow-hidden [--clips:media] rounded-full bg-primary-container text-label-sm text-on-primary-container [&>img]:size-full [&>img]:object-cover [tr[aria-selected=true]_&]:bg-surface [tr[aria-selected=true]_&]:text-on-surface`,
);
export const tablePersonName = rcva(rowLine);

export type TableVariants = VariantProps<typeof table>;
export type TableWrapperVariants = VariantProps<typeof tableWrapper>;

export interface TableAvatar {
  src?: string;
  initials?: string;
  alt?: string;
}
export interface TableTextBadgeCell {
  text: Renderable;
  badge?: Renderable;
}

export type TableRowData = Record<string, unknown>;

export type TableSupporting = Renderable | { text: Renderable; tone?: "error" | "warning" | "success" };

export interface TableColumn<T extends TableRowData = TableRowData> {
  key: string;
  label?: Renderable;
  render?: (row: T, index: number) => Renderable;
  supporting?: (row: T, index: number) => TableSupporting;
  avatar?: (row: T, index: number) => TableAvatar | null | undefined;
  header?: boolean;
  sortable?: boolean | string;
  align?: "start" | "center" | "end";
  nowrap?: boolean;
  fixed?: boolean;
  kind?: "text-badge" | "button";
}

export interface TableGroup<T extends TableRowData = TableRowData> {
  label: Renderable;
  rows: T[];
}

@customElement("ui-table")
export class UiTable extends LightElement {
  @property({ attribute: false }) columns: TableColumn[] = [];
  @property({ attribute: false }) rows: TableRowData[] = [];
  @property({ attribute: false }) groups: TableGroup[] = [];
  @property({ converter: responsiveBoolean }) zebra: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean, attribute: "pin-rows" }) pinRows: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean, attribute: "pin-cols" }) pinCols: Responsive<boolean> = false;
  @property() size: TableVariants["size"];
  @property() density: TableVariants["density"];
  @property() lines: TableVariants["lines"];
  @property({ converter: responsiveBoolean }) nowrap: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) bordered: Responsive<boolean> = false;
  @property() height: TableWrapperVariants["height"];
  @property() width: TableWrapperVariants["width"];
  @property({ converter: responsiveBoolean }) hover: Responsive<boolean> = false;
  @property({ type: Number, attribute: "active-row" }) activeRow = -1;
  @property({ type: Boolean, attribute: "index-column" }) indexColumn = false;
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) footer = false;
  @property({ attribute: false }) selected: number[] = [];
  @property() sort = "";
  @property({ attribute: false }) hiddenColumns: string[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ type: Number, attribute: "skeleton-rows" }) skeletonRows = 5;
  @property({ type: Number, attribute: "min-rows" }) minRows = 0;
  @property({ attribute: false }) empty: Renderable = "";
  @property({ type: Boolean }) reorderable = false;
  @property({ type: Boolean }) resizable = false;
  @property({ attribute: false }) columnOrder: string[] = [];
  @property({ attribute: false }) columnWidths: Record<string, number> = {};

  @state() private _drag?: { key: string; dx: number; target: number; height: number };
  @state() private _resizing?: string;
  @state() private _announce = "";
  private _geom = { mids: [] as number[], x0: 0, fixed: 0 };
  private _lastX = 0;
  private _scrollFrame = 0;
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
    return isRtl(this);
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

  private _move(c: TableColumn, to: { before?: string; after?: string }, place: number) {
    this._emitColumns(
      moveColumn(
        this._ordered.map((x) => x.key),
        c.key,
        to,
      ),
    );
    this._announce = m.table_column_moved({ column: this._name(c), place: place + 1, total: this._columns.length });
  }

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

  private _dragTo(x: number) {
    const table = this.querySelector("table");
    if (!this._drag || !table) return;
    this._lastX = x;
    const tx = x - table.getBoundingClientRect().left;
    const rtl = this._rtl;
    const passed = this._geom.mids.filter((mid) => (rtl ? mid > tx : mid < tx)).length;
    this._drag = { ...this._drag, dx: tx - this._geom.x0, target: Math.max(this._geom.fixed, passed) };
  }

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

  private _startResize(e: PointerEvent, c: TableColumn) {
    if (e.button !== 0) return;
    const th = this._th(c.key);
    if (!th) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
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
    this._announce = m.table_column_width({ column: this._name(c), width });
  }

  private _fit(c: TableColumn) {
    if (this.columnWidths[c.key] === undefined) return;
    const { [c.key]: _, ...rest } = this.columnWidths;
    this._emitColumns(undefined, rest);
    this._announce = m.table_column_fit({ column: this._name(c) });
  }

  private get _sorts() {
    return this.sort
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({ path: s.replace(/^-/, ""), desc: s.startsWith("-") }));
  }

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
            aria-label=${m.table_resize_column({ column: this._name(c) })}
            aria-valuemin=${COLUMN_MIN_WIDTH}
            aria-valuemax=${COLUMN_MAX_WIDTH}
            aria-valuenow=${this.columnWidths[c.key] ?? nothing}
            title=${m.table_resize_hint()}
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
        title=${live && this.reorderable && !c.fixed ? m.table_sort_move_hint() : m.table_sort_hint()}
        @click=${(e: MouseEvent) => this._sortBy(path, e.shiftKey)}
        @keydown=${(e: KeyboardEvent) => live && this._moveKey(e, c)}
      >
        <span class=${tableSortLabel()}>${text}</span>
        <span class=${tableSortIcon({ state })} aria-hidden="true"
          >${iconSvg(state === "none" ? "unfold" : "arrow-up", { size: "sm" })}</span
        >
        ${sorts.length > 1 && at >= 0 ? html`<span class=${tableSortOrder()}>${formatInt(at + 1)}</span>` : nothing}
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
                        aria-label=${m.table_select_all()}
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
      const one = this.lines === "one";
      const value = c.render ? c.render(row, index) : this._kind(c, row, index);
      const s = c.supporting?.(row, index);
      const sup = s && typeof s === "object" && "text" in s ? s : { text: s as Renderable, tone: undefined };
      const lines =
        sup.text != null && sup.text !== "" && sup.text !== nothing
          ? html`<div class=${tableCellStack()}>
              <div class=${tableCellLine({ one }) || nothing}>${value}</div>
              <div class=${tableSupporting({ tone: sup.tone, class: tableCellLine({ one }) })}>${sup.text}</div>
            </div>`
          : value;
      const who = c.avatar?.(row, index);
      const v = who
        ? html`<div class=${tablePerson()}>
            <span class=${tablePersonAvatar()} aria-hidden=${who.src ? nothing : "true"}
              >${who.src ? html`<img src=${who.src} alt=${who.alt ?? ""} />` : (who.initials ?? "")}</span
            >
            <div class=${tablePersonName()}>${lines}</div>
          </div>`
        : lines;
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
                  aria-label=${m.table_select_row({ row: index + 1 })}
                  .checked=${this.selected.includes(index)}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${(e: Event) => this._toggle(index, (e.target as HTMLInputElement).checked)}
                />
              </label>
            </th>`
          : nothing
      }
      ${this.indexColumn ? html`<th>${formatInt(index + 1)}</th>` : nothing} ${this._columns.map(cell)}
    </tr>`;
  }

  private _kind(c: TableColumn, row: TableRowData, index: number): Renderable {
    const v = row[c.key];
    if (c.kind === "text-badge" && v && typeof v === "object") {
      const t = v as TableTextBadgeCell;
      return html`${t.text}${
        t.badge != null ? html`<br /><span class=${tag({ variant: "outline" })}>${t.badge}</span>` : nothing
      }`;
    }
    if (c.kind === "button") {
      return html`<button
        type="button"
        class=${button({ variant: "text", size: "xs" })}
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
        @mouseover=${this._hint}
      >
        ${
          this.rows.length
            ? this.rows.map((r, i) => this._row(r, i))
            : this.loading
              ? Array.from(
                  { length: this.skeletonRows },
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
        ${this._filler()}
      </tbody>`;
  }

  private _hint = (e: Event) => {
    if (this.lines !== "one") return;
    const cell = (e.target as Element).closest?.("td");
    if (!cell) return;
    const cut = [cell, ...cell.querySelectorAll<HTMLElement>("div")].some((el) => el.scrollWidth > el.clientWidth + 1);
    if (cut) cell.title = cell.innerText.trim();
    else cell.removeAttribute("title");
  };

  private _filler() {
    const shown = this.rows.length || (this.loading ? this.skeletonRows : this.empty ? 1 : 0);
    const n = Math.max(0, this.minRows - shown);
    return Array.from(
      { length: n },
      () =>
        html`<tr aria-hidden="true">
          <td colspan=${this._span} class=${tableCell({}) || nothing}>&nbsp;</td>
        </tr>`,
    );
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
      density: this.density,
      lines: this.lines,
      surface: this.surface,
      nowrap: this.nowrap,
    });
    return html`<div
      class=${tableWrapper({ bordered: this.bordered, height: this.height, width: this.width, nowrap: this.nowrap })}
    >
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
