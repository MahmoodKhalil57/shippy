import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Grid: lays its children out in columns and rows.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy, not daisyUI)
 *
 * Every variant is responsive, e.g. `cols="1 md:2 lg:4"`.
 */
export const grid = rcva("grid", {
  variants: {
    /**
     * Intrinsic columns, no breakpoints: as many as fit the space, each at least this wide (and
     * never wider than the grid), sharing what's left.
     */
    fit: {
      xs: "grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]",
      sm: "grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
      md: "grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]",
      lg: "grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))]",
    },
    /**
     * This many cells in even rows, by the grid's own width (a container query, so it works the
     * same in a card or on the page): all in one row when they fit, else halves or thirds, else
     * one per row. Never one cell left alone on a row (a row of stats).
     */
    balance: {
      "2": "grid-cols-1 @sm:grid-cols-2",
      "3": "grid-cols-1 @2xl:grid-cols-3",
      "4": "grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-4",
      "5": "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-5",
      "6": "grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 @5xl:grid-cols-6",
    },
    /**
     * Main content and a sidebar (`items` with `role: "main"` / `"side"`), side by side while the
     * main part keeps at least 30rem, otherwise the sidebar wraps underneath. No breakpoints.
     */
    sidebar: { true: "flex! max-w-full flex-wrap items-start" },
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
      "7": "grid-cols-7",
      "8": "grid-cols-8",
      "9": "grid-cols-9",
      "10": "grid-cols-10",
      "11": "grid-cols-11",
      "12": "grid-cols-12",
    },
    rows: {
      "1": "grid-rows-1",
      "2": "grid-rows-2",
      "3": "grid-rows-3",
      "4": "grid-rows-4",
      "5": "grid-rows-5",
      "6": "grid-rows-6",
    },
    gap: {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
      "8": "gap-8",
      "10": "gap-10",
      "12": "gap-12",
      "16": "gap-16",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
    },
    flow: {
      row: "grid-flow-row",
      col: "grid-flow-col",
      dense: "grid-flow-dense",
    },
    padding: {
      "0": "p-0",
      "1": "p-1",
      "2": "p-2",
      "3": "p-3",
      "4": "p-4",
      "5": "p-5",
      "6": "p-6",
      "8": "p-8",
      "10": "p-10",
      "12": "p-12",
      "16": "p-16",
    },
  },
});

/** The container a `balance` grid measures. */
export const gridBox = rcva("@container");

/** A cell spanning several columns. */
export const gridItem = rcva("", {
  variants: {
    /** In a `sidebar` grid: the part that takes the room, or the sidebar (18rem, growing when alone). */
    role: {
      main: "min-w-[min(100%,30rem)] grow-[999] basis-0",
      side: "min-w-0 grow basis-72",
    },
    span: {
      "1": "col-span-1",
      "2": "col-span-2",
      "3": "col-span-3",
      "4": "col-span-4",
      "5": "col-span-5",
      "6": "col-span-6",
      "7": "col-span-7",
      "8": "col-span-8",
      "9": "col-span-9",
      "10": "col-span-10",
      "11": "col-span-11",
      "12": "col-span-12",
      full: "col-span-full",
    },
  },
});

export type GridVariants = VariantProps<typeof grid>;
export type GridItemVariants = VariantProps<typeof gridItem>;

export interface GridItem {
  content: Renderable;
  /** In a `sidebar` grid: which part this is. */
  role?: GridItemVariants["role"];
  /** Columns to span; responsive, e.g. "full md:2". */
  span?: Responsive<NonNullable<GridItemVariants["span"]>>;
}

/**
 * @example <ui-grid fit="sm" gap="4">…cards…</ui-grid>   (as many 16rem+ columns as fit)
 * @example <ui-grid sidebar gap="8" .items=${[{ content: form, role: "main" }, { content: side, role: "side" }]}></ui-grid>
 * @example <ui-grid cols="1 md:2 lg:4" gap="4">…cards…</ui-grid>
 * @example <ui-grid balance="4" gap="4">…four stats…</ui-grid>   (4, 2 + 2, or 1 per row)
 * @example <ui-grid cols="3" gap="6" .items=${[{ content: chart, span: "full md:2" }, { content: stats }]}></ui-grid>
 *
 * Authored children are the cells (component hosts are `display: contents`).
 * Use `items` when a cell needs to span several columns: each item is wrapped
 * in a cell element carrying the span.
 */
@customElement("ui-grid")
export class UiGrid extends LightElement {
  @property() cols: GridVariants["cols"];
  @property() fit: GridVariants["fit"];
  @property() balance: GridVariants["balance"];
  @property({ converter: responsiveBoolean }) sidebar: Responsive<boolean> = false;
  @property() rows: GridVariants["rows"];
  @property() gap: GridVariants["gap"];
  @property() align: GridVariants["align"];
  @property() justify: GridVariants["justify"];
  @property() flow: GridVariants["flow"];
  @property() padding: GridVariants["padding"];
  @property({ attribute: false }) items: GridItem[] = [];

  render() {
    const cls = grid({
      cols: this.cols,
      fit: this.fit,
      balance: this.balance,
      sidebar: this.sidebar,
      rows: this.rows,
      gap: this.gap,
      align: this.align,
      justify: this.justify,
      flow: this.flow,
      padding: this.padding,
    });
    const body = html`<div class=${cls}>
      ${
        this.items.length
          ? repeat(
              this.items,
              (_, i) => i,
              (item) => html`<div class=${gridItem({ span: item.span, role: item.role })}>${item.content}</div>`,
            )
          : this.content
      }
    </div>`;
    // `balance` measures the grid's own box: a container around it.
    return this.balance ? html`<div class=${gridBox()}>${body}</div>` : body;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-grid": UiGrid;
  }
}
