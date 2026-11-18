import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button } from "../actions/button.ts";
import { badge } from "./badge.ts";

/**
 * Table: Shows a list of data in a table format.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/table/
 *
 * All variants are responsive (e.g. `size="xs md:md"`, `pin-rows="lg"`).
 */
export const table = rcva("table", {
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
    bordered: { true: "rounded-box border border-base-content/5 bg-base-100" },
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
      ${this.columns.map((c) => html`<th>${c.label ?? (c.kind === "button" ? "" : c.key)}</th>`)}
    </tr>`;
  }

  private _row(row: TableRowData, index: number) {
    const cell = (c: TableColumn): TemplateResult => {
      const v = c.render ? c.render(row, index) : this._kind(c, row, index);
      return c.header ? html`<th>${v}</th>` : html`<td>${v}</td>`;
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
      ${this.indexColumn ? html`<th>${index + 1}</th>` : nothing} ${this.columns.map(cell)}
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
              <th colspan=${this.columns.length + (this.indexColumn ? 1 : 0) + (this.selectable ? 1 : 0)}>
                ${g.label}
              </th>
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
      <tbody>
        ${this.rows.map((r, i) => this._row(r, i))}
      </tbody>`;
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
