import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
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
/** Header cells at 75% ink (daisyUI's 60% falls below WCAG AA on light pages). */
export const table = rcva("table [&_:where(thead,tfoot)]:text-base-content/75", {
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
    surface: { true: "bg-base-200" },
    /** Keep every cell (and what's inside it) on one line; the wrapper scrolls sideways instead. */
    nowrap: { true: "[&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_.badge]:whitespace-nowrap" },
  },
});

/** Scroll container around the table (horizontal overflow). */
export const tableWrapper = rcva("overflow-x-auto", {
  variants: {
    /** "Table with border and background". */
    bordered: { true: "rounded-box border border-base-content/5 bg-base-100 [--scrollbar-inset:var(--radius-box)]" },
    /** Fixed scroll height (the pinned examples use `h-96`). */
    height: { sm: "h-64", md: "h-80", lg: "h-96" },
    /** Fixed scroll width (the pinned-cols example uses `w-96`). */
    width: { md: "w-80", lg: "w-96", full: "w-full" },
  },
});

/** Row states from the docs examples. */
export const tableRow = rcva("", {
  variants: {
    active: { true: "bg-base-200" },
    hover: { true: "hover:bg-base-300" },
  },
});

/** A cell's alignment: numbers line up on the right, in tabular figures. */
export const tableCell = rcva("", {
  variants: {
    align: { start: "", center: "text-center", end: "text-end tabular-nums whitespace-nowrap" },
    /** Keep on one line (ids and references that would break at their hyphens). */
    nowrap: { true: "whitespace-nowrap" },
  },
});

/**
 * A sortable column's header: a button showing which way it sorts (and, sorting by several
 * columns, in which order). Unsorted, the arrows show on hover / focus only.
 */
export const tableSort = rcva(
  "group/sort -mx-1.5 inline-flex items-center gap-1 rounded-field px-1.5 py-0.5 font-[inherit] text-[inherit] hover:bg-base-content/5 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary [transition:background-color_var(--duration-effects-fast)_var(--ease-effects-fast),color_var(--duration-effects-fast)_var(--ease-effects-fast)]",
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
export const tableSortOrder = rcva("text-[0.625rem] leading-none font-semibold text-primary tabular-nums");

/** The body while new rows load: the current ones stay, dimmed. */
export const tableBody = rcva("[transition:opacity_var(--duration-effects)_var(--ease-effects)]", {
  variants: { busy: { true: "opacity-50" } },
});
/** A loading placeholder cell (M3's skeleton loader). */
export const tableSkeleton = rcva("skeleton h-4 w-full max-w-40 rounded-field");
/** The one row shown when there are no rows. */
export const tableEmpty = rcva("py-10 text-center text-base-content/75");

/** Cell anatomy from "Table with visual elements". */
export const tablePerson = rcva("flex items-center gap-3");
export const tablePersonAvatar = rcva("avatar");
export const tablePersonImage = rcva("w-12 h-12 mask mask-squircle");
export const tablePersonName = rcva("font-bold");
export const tablePersonSub = rcva("text-sm opacity-50");

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

  private get _columns() {
    return this.columns.filter((c) => !this.hiddenColumns.includes(c.key));
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

  private _headCell(c: TableColumn) {
    const label = c.label ?? (c.kind === "button" ? "" : c.key);
    if (!c.sortable) return html`<th class=${tableCell({ align: c.align }) || nothing}>${label}</th>`;
    const path = typeof c.sortable === "string" ? c.sortable : c.key;
    const sorts = this._sorts;
    const at = sorts.findIndex((s) => s.path === path);
    const state = at < 0 ? "none" : sorts[at]!.desc ? "desc" : "asc";
    return html`<th
      class=${tableCell({ align: c.align }) || nothing}
      aria-sort=${state === "none" ? "none" : state === "asc" ? "ascending" : "descending"}
    >
      <button
        type="button"
        class=${tableSort({ align: c.align })}
        title="Sort (Shift-click to sort by several columns)"
        @click=${(e: MouseEvent) => this._sortBy(path, e.shiftKey)}
      >
        <span>${label}</span>
        <span class=${tableSortIcon({ state })} aria-hidden="true"
          >${iconSvg(state === "none" ? "unfold" : "arrow-up", { size: "sm" })}</span
        >
        ${sorts.length > 1 && at >= 0 ? html`<span class=${tableSortOrder()}>${at + 1}</span>` : nothing}
      </button>
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
      ${this.indexColumn ? html`<th></th>` : nothing} ${this._columns.map((c) => this._headCell(c))}
    </tr>`;
  }

  private _row(row: TableRowData, index: number) {
    const cell = (c: TableColumn): TemplateResult => {
      const v = c.render ? c.render(row, index) : this._kind(c, row, index);
      const cls = tableCell({ align: c.align, nowrap: c.nowrap }) || nothing;
      return c.header ? html`<th class=${cls}>${v}</th>` : html`<td class=${cls}>${v}</td>`;
    };
    return html`<tr
      class=${tableRow({ active: index === this.activeRow, hover: this.hover }) || nothing}
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
                      ${this._columns.map((c) => html`<td class=${tableCell({ align: c.align }) || nothing}><div class=${tableSkeleton()}></div></td>`)}
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
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-table": UiTable;
  }
}
