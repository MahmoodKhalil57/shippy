import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixedWidth, inset, row, rowEnd, rowFill, rowGrow, rowLine, stack, text } from "../layout/algebra.ts";

/**
 * List and list item: rows of records, each one subject (M3 lists; Apple lists).
 *
 * Purpose: Data & metrics · Kind: primitive
 *
 * `<ui-list>` holds `<ui-list-item>`s: divided by hairlines (the default), or as separate rounded
 * rows (`variant="separated"`). An item's anatomy, in M3's slots:
 *   leading-text    a time or a date in a fixed leading column, so every row's headline starts
 *                   on the same line (an agenda: what's due, in order)
 *   leading         a dot (`<ui-badge dot>`), an icon or an avatar (slot `leading`)
 *   overline        a small line above the headline
 *   headline        what the row is (the largest part)
 *   trailing-text   a date, a count or an amount, at the end of the headline's line
 *   supporting      one to three lines about it (`lines`, default 2; then "…")
 *   (default)       anything under the supporting text: a row of tags, a progress line
 *   trailing        a tag, a link or one small action at the end (slot `trailing`)
 * The whole row is the target when it does something: `href` makes it a link, `action` a button
 * (listen for `click`). It then has a state layer, a 48px touch target and keyboard focus;
 * `selected` marks the open one in a list-and-detail screen (primary container, `aria-current`).
 */
export const list = rcva(stack, {
  variants: {
    variant: {
      // The hairline is on the square listitem, not on its row: a row that is a target is rounded
      // (its state layer), and a border on it would bend at its corners.
      divided: "[&>*+*_[role=listitem]]:border-t [&>*+*_[role=listitem]]:border-outline-variant",
      separated: "gap-1",
    },
  },
  defaultVariants: { variant: "divided" },
});

export const listItem = rcva(
  // A wrapping row (layout/algebra.ts): leading, content, trailing. The content keeps 7rem; when the
  // row can't give it that beside the trailing slot, the trailing slot goes on its own line.
  `${row} ${inset["3"]} items-start gap-x-3 gap-y-1.5 py-2.5 text-start text-on-surface [--outer-radius:var(--radius-box)]`,
  {
    variants: {
      interactive: {
        true: "touch-target state-layer cursor-pointer rounded-field",
      },
      selected: { true: "rounded-field bg-primary-container" },
      separated: { true: "rounded-field bg-surface-container-low" },
      disabled: { true: "pointer-events-none text-on-surface-disabled" },
    },
  },
);
/** The listitem wrapper adds no layout of its own (the row inside is the box). */
export const listItemWrap = rcva("block");
/**
 * The time or date that leads an agenda row: a 3rem column in tabular figures, in the row's main
 * ink (it is what the row is ordered by). "09:30" and "17 Nov" fit on one line; "Wed 10:00" breaks
 * at its space into two.
 */
export const listItemLeadingText = rcva(`${fixedWidth["12"]} ${text.label} text-label-lg tabular-nums`);
export const listItemLeading = rcva(`${row} items-center self-start pt-1 text-on-surface-variant`);
/** The content: the slot that takes the room (M3 Lists: "the largest-width slot"), never under 7rem. */
export const listItemContent = rcva(`${stack} ${rowFill} gap-0.5`);
export const listItemTop = rcva(`${row} items-baseline justify-between gap-x-2`);
export const listItemOverline = rcva("text-label-sm text-on-surface-variant");
/**
 * The headline: one line, cut with an ellipsis, taking the line's room so the trailing text stays
 * at its end however narrow the row. In an agenda row (one led by a time) or beside a trailing
 * text it may take two: what is due, or what a count counts, is the row's point, and the columns
 * beside it leave it little room.
 */
export const listItemHeadline = rcva("", {
  variants: {
    lines: { "1": `${rowLine} text-title-sm`, "2": `${rowGrow} ${text.label} line-clamp-2 text-title-sm` },
  },
  defaultVariants: { lines: "1" },
});
export const listItemTrailingText = rcva(`${text.label} text-label-md text-on-surface-variant tabular-nums`);
export const listItemSupporting = rcva(`${text.prose} text-body-md text-on-surface-variant`, {
  variants: { lines: { "1": "line-clamp-1", "2": "line-clamp-2", "3": "line-clamp-3" } },
  defaultVariants: { lines: "2" },
});
export const listItemExtra = rcva(`${row} mt-1 items-center gap-1`);
/**
 * The trailing slot (M3 Lists: a value or an action at the end): at the row's end, or on a line
 * of its own under the content when the row can't give the content 7rem beside it.
 */
export const listItemTrailing = rcva(`${rowEnd} ${row} items-center justify-end gap-2 self-center`);

export type ListVariants = VariantProps<typeof list>;
export type ListItemLines = "1" | "2" | "3";

/**
 * @example
 * <ui-list>
 *   <ui-list-item headline="ORD-0142" supporting="Acme Ltd · Rotterdam" trailing-text="14 Nov" href="/collections/orders/ord-0142">
 *     <ui-badge slot="leading" dot tone="warning" label="Waiting"></ui-badge>
 *     <ui-tag slot="trailing" tone="warning">Awaiting supplier</ui-tag>
 *   </ui-list-item>
 * </ui-list>
 * @example
 * <ui-list>
 *   <ui-list-item leading-text="14:00" headline="Client call" supporting="Acme Ltd" lines="1" href="/collections/tasks/t-1">
 *     <ui-icon slot="trailing" name="chevron-right" size="sm"></ui-icon>
 *   </ui-list-item>
 * </ui-list>
 */
@customElement("ui-list")
export class UiList extends LightElement {
  @property() variant: ListVariants["variant"];
  /** Accessible name of the list. */
  @property() label?: string;

  render() {
    return html`<div class=${list({ variant: this.variant })} role="list" aria-label=${this.label ?? nothing}>
      ${this.content}
    </div>`;
  }
}

@customElement("ui-list-item")
export class UiListItem extends LightElement {
  @property() headline: Renderable = "";
  @property() supporting: Renderable = "";
  @property() overline: Renderable = "";
  @property({ attribute: "trailing-text" }) trailingText: Renderable = "";
  /** A time or a date leading the row, in a fixed column (an agenda). */
  @property({ attribute: "leading-text" }) leadingText: Renderable = "";
  /** Supporting text lines before "…". */
  @property() lines: ListItemLines = "2";
  /** The row is a link. */
  @property() href?: string;
  /** The row is a button (listen for `click`). */
  @property({ type: Boolean }) action = false;
  /** The open item in a list-and-detail screen. */
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) disabled = false;

  private get _separated() {
    return this.closest("ui-list")?.getAttribute("variant") === "separated";
  }

  render() {
    const interactive = (!!this.href || this.action) && !this.disabled;
    const cls = listItem({
      interactive,
      selected: this.selected,
      separated: this._separated && !this.selected,
      disabled: this.disabled,
    });
    const headline = this.hasSlotted("headline") ? this.slotted("headline") : this.headline;
    const supporting = this.hasSlotted("supporting") ? this.slotted("supporting") : this.supporting;
    const inner = html`${this.leadingText ? html`<span class=${listItemLeadingText()}>${this.leadingText}</span>` : nothing}
      ${this.hasSlotted("leading") ? html`<span class=${listItemLeading()}>${this.slotted("leading")}</span>` : nothing}
      <span class=${listItemContent()}>
        ${this.overline ? html`<span class=${listItemOverline()}>${this.overline}</span>` : nothing}
        ${
          headline || this.trailingText
            ? html`<span class=${listItemTop()}>
                <span class=${listItemHeadline({ lines: this.leadingText || this.trailingText ? "2" : "1" })}
                  >${headline}</span
                >
                ${this.trailingText ? html`<span class=${listItemTrailingText()}>${this.trailingText}</span>` : nothing}
              </span>`
            : nothing
        }
        ${supporting ? html`<span class=${listItemSupporting({ lines: this.lines })}>${supporting}</span>` : nothing}
        ${this.hasContent ? html`<span class=${listItemExtra()}>${this.slotted()}</span>` : nothing}
      </span>
      ${this.hasSlotted("trailing") ? html`<span class=${listItemTrailing()}>${this.slotted("trailing")}</span>` : nothing}`;
    const current = this.selected ? "true" : nothing;
    return html`<div role="listitem" class=${listItemWrap()}>
      ${
        this.href && !this.disabled
          ? html`<a data-list-row class=${cls} href=${this.href} aria-current=${current}>${inner}</a>`
          : this.action
            ? html`<button data-list-row type="button" class=${cls} ?disabled=${this.disabled} aria-current=${current}>
                ${inner}
              </button>`
            : html`<div data-list-row class=${cls}>${inner}</div>`
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-list": UiList;
    "ui-list-item": UiListItem;
  }
}
