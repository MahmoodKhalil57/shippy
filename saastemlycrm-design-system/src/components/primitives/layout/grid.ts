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
export const grid = rcva("grid min-w-0", {
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
    sidebar: { true: "flex! flex-row flex-wrap min-w-0 max-w-full items-start" },
    /**
     * This many equal columns once the grid's own width gives each of them 7rem (a container
     * query: 7N + 4(N − 1) rem, room for the widest gap), one column before that.
     */
    cols: {
      "1": "grid-cols-[minmax(0,1fr)]",
      "2": "grid-cols-[minmax(0,1fr)] @min-[18rem]:grid-cols-2",
      "3": "grid-cols-[minmax(0,1fr)] @min-[29rem]:grid-cols-3",
      "4": "grid-cols-[minmax(0,1fr)] @min-[40rem]:grid-cols-4",
      "5": "grid-cols-[minmax(0,1fr)] @min-[51rem]:grid-cols-5",
      "6": "grid-cols-[minmax(0,1fr)] @min-[62rem]:grid-cols-6",
      "7": "grid-cols-[minmax(0,1fr)] @min-[73rem]:grid-cols-7",
      "8": "grid-cols-[minmax(0,1fr)] @min-[84rem]:grid-cols-8",
      "9": "grid-cols-[minmax(0,1fr)] @min-[95rem]:grid-cols-9",
      "10": "grid-cols-[minmax(0,1fr)] @min-[106rem]:grid-cols-10",
      "11": "grid-cols-[minmax(0,1fr)] @min-[117rem]:grid-cols-11",
      "12": "grid-cols-[minmax(0,1fr)] @min-[128rem]:grid-cols-12",
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
    /** How items fill the grid's columns (a column per item, `grid-flow-col`, would stick out). */
    flow: {
      row: "grid-flow-row",
      dense: "grid-flow-dense",
    },
    /** Inline padding limits itself (layout/algebra.ts `pad`). */
    padding: {
      "0": "px-0 py-0",
      "1": "px-[min(4px,max(0px,calc((100%_-_7rem)/2)))] py-1",
      "2": "px-[min(8px,max(0px,calc((100%_-_7rem)/2)))] py-2",
      "3": "px-[min(12px,max(0px,calc((100%_-_7rem)/2)))] py-3",
      "4": "px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      "5": "px-[min(20px,max(0px,calc((100%_-_7rem)/2)))] py-5",
      "6": "px-[min(24px,max(0px,calc((100%_-_7rem)/2)))] py-6",
      "8": "px-[min(32px,max(0px,calc((100%_-_7rem)/2)))] py-8",
      "10": "px-[min(40px,max(0px,calc((100%_-_7rem)/2)))] py-10",
      "12": "px-[min(48px,max(0px,calc((100%_-_7rem)/2)))] py-12",
      "16": "px-[min(64px,max(0px,calc((100%_-_7rem)/2)))] py-16",
    },
  },
});

/** The container a `balance` grid measures. */
export const gridBox = rcva("@container w-full");

/** A cell spanning several columns. */
export const gridItem = rcva("", {
  variants: {
    /**
     * In a `sidebar` grid: the part that takes the room, or the sidebar (18rem, growing when alone).
     * The sidebar is in rem, not spacing px, so it grows with the text size and wraps under the
     * main part sooner (HIG Layout, Dynamic Type: adjacent views "may need to stack vertically").
     */
    role: {
      main: "min-w-[min(100%,30rem)] grow-[999] basis-0",
      side: "min-w-[min(100%,7rem)] grow basis-[18rem]",
    },
    /** Spans N columns once there's room for N (as `cols`); the whole row before that. */
    span: {
      "1": "col-span-1",
      "2": "col-span-full @min-[18rem]:col-span-2",
      "3": "col-span-full @min-[29rem]:col-span-3",
      "4": "col-span-full @min-[40rem]:col-span-4",
      "5": "col-span-full @min-[51rem]:col-span-5",
      "6": "col-span-full @min-[62rem]:col-span-6",
      "7": "col-span-full @min-[73rem]:col-span-7",
      "8": "col-span-full @min-[84rem]:col-span-8",
      "9": "col-span-full @min-[95rem]:col-span-9",
      "10": "col-span-full @min-[106rem]:col-span-10",
      "11": "col-span-full @min-[117rem]:col-span-11",
      "12": "col-span-full @min-[128rem]:col-span-12",
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
