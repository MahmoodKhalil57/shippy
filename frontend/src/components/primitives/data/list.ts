import type { VariantProps } from "class-variance-authority";
import { html, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button } from "../actions/button.ts";

/**
 * List: Vertical layout that displays information in rows.
 *
 * Purpose: Data & metrics · Kind: primitive
 * Docs: https://daisyui.com/components/list/
 *
 * Each `list-row` is a horizontal grid; by default its second column grows.
 * Another column can be marked `list-col-grow` to grow instead, or
 * `list-col-wrap` to move onto its own line below the row.
 * All variants are responsive (e.g. `width="full md:lg"`).
 */
export const list = rcva("list", {
  variants: {
    /** Card look used in the docs examples. */
    framed: { true: "bg-base-100 rounded-box shadow-md" },
    /** The docs wrap lists in `w-full max-w-lg`. */
    width: {
      full: "w-full",
      sm: "w-full max-w-sm",
      md: "w-full max-w-md",
      lg: "w-full max-w-lg",
    },
  },
  defaultVariants: { framed: true },
});

export const listRow = rcva("list-row");

/** Header `<li>` above the rows. */
export const listHeading = rcva("p-4 pb-2 text-xs opacity-60 tracking-wide");

export const listCol = rcva("", {
  variants: {
    grow: { true: "list-col-grow" },
    wrap: { true: "list-col-wrap" },
  },
});

/** Parts of the docs' row anatomy. */
export const listIndex = rcva("text-4xl font-thin opacity-30 tabular-nums");
export const listImage = rcva("size-10 rounded-box");
export const listSubtitle = rcva("text-xs uppercase font-semibold opacity-60");
export const listDescription = rcva("list-col-wrap text-xs");
export const listActionIcon = rcva("size-[1.2em]");

export type ListVariants = VariantProps<typeof list>;

const LIST_ICONS = {
  play: svg`<g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g>`,
  favorite: svg`<g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g>`,
};
export type ListIconName = keyof typeof LIST_ICONS;

export interface ListAction {
  /** Built-in icon or any template. */
  icon: ListIconName | Exclude<Renderable, string>;
  /** Accessible name (the docs use "Play" / "Favorite"). */
  label: string;
  onClick?: (item: ListItem, index: number) => void;
}

/** One row in the docs' anatomy: [index] [image] title/subtitle [description] actions. */
export interface ListItem {
  /** Leading number, e.g. "01" (makes the title column grow, as in the docs). */
  index?: Renderable;
  image?: string;
  imageAlt?: string;
  heading: Renderable;
  subtitle?: Renderable;
  /** Text that wraps onto its own line under the row. */
  description?: Renderable;
  actions?: ListAction[];
}

/**
 * @example
 * <ui-list heading="Most played songs this week" width="lg"
 *   .items=${[{ image: "/1.webp", heading: "Dio Lupa", subtitle: "Remaining Reason",
 *     actions: [{ icon: "play", label: "Play" }, { icon: "favorite", label: "Favorite" }] }]}>
 * </ui-list>
 * @example (third column grows) items with `index: "01"`
 * @example (third column wraps) items with `description: "…"`
 * @example Free-form cells: <ui-list grow-col="2" .rows=${[[a, b, c]]}></ui-list>
 *
 * Column indexes are 0-based. Without `items`/`rows`, authored `<li>` children are rendered inside the `<ul>`.
 * Action clicks fire `ui-action` with `{ item, index, action }`.
 */
@customElement("ui-list")
export class UiList extends LightElement {
  @property() heading: Renderable = "";
  @property({ attribute: false }) items: ListItem[] = [];
  /** Free-form rows: one array of cells per row. */
  @property({ attribute: false }) rows: Renderable[][] = [];
  @property({ converter: responsiveBoolean }) framed: Responsive<boolean> = true;
  @property() width: ListVariants["width"];
  /** (rows mode) Column that grows (default: daisyUI's second column). */
  @property({ type: Number, attribute: "grow-col" }) growCol?: number;
  /** (rows mode) Column that wraps onto its own line. */
  @property({ type: Number, attribute: "wrap-col" }) wrapCol?: number;

  private _icon(icon: ListAction["icon"], label: string) {
    return typeof icon === "string" && icon in LIST_ICONS
      ? html`<svg aria-label=${label} class=${listActionIcon()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          ${LIST_ICONS[icon as ListIconName]}
        </svg>`
      : icon;
  }

  private _item(item: ListItem, i: number) {
    return html`<li class=${listRow()}>
      ${item.index != null ? html`<div class=${listIndex()}>${item.index}</div>` : nothing}
      ${item.image ? html`<div><img class=${listImage()} src=${item.image} alt=${item.imageAlt ?? ""} /></div>` : nothing}
      <div class=${listCol({ grow: item.index != null }) || nothing}>
        <div>${item.heading}</div>
        ${item.subtitle != null ? html`<div class=${listSubtitle()}>${item.subtitle}</div>` : nothing}
      </div>
      ${item.description != null ? html`<p class=${listDescription()}>${item.description}</p>` : nothing}
      ${(item.actions ?? []).map(
        (a) =>
          html`<button
            type="button"
            class=${button({ shape: "square", variant: "ghost" })}
            aria-label=${a.label}
            @click=${() => {
              a.onClick?.(item, i);
              this.dispatchEvent(
                new CustomEvent("ui-action", { detail: { item, index: i, action: a }, bubbles: true }),
              );
            }}
          >
            ${this._icon(a.icon, a.label)}
          </button>`,
      )}
    </li>`;
  }

  private _rows() {
    return this.rows.map(
      (cells) =>
        html`<li class=${listRow()}>
          ${cells.map((cell, i) => {
            const cls = listCol({ grow: i === this.growCol, wrap: i === this.wrapCol });
            return html`<div class=${cls || nothing}>${cell}</div>`;
          })}
        </li>`,
    );
  }

  render() {
    const body = this.items.length
      ? this.items.map((it, i) => this._item(it, i))
      : this.rows.length
        ? this._rows()
        : this.content;
    return html`<ul class=${list({ framed: this.framed, width: this.width })}>
      ${this.heading ? html`<li class=${listHeading()}>${this.heading}</li>` : nothing} ${body}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-list": UiList;
  }
}
