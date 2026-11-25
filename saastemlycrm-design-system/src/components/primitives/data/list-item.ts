import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { fixedWidth, inset, row, rowEnd, rowFill, rowGrow, rowLine, stack, text } from "../layout/algebra.ts";

export const list = rcva(stack, {
  variants: {
    variant: {
      divided: "[&>*+*_[role=listitem]]:border-t [&>*+*_[role=listitem]]:border-outline-variant",
      separated: "gap-1",
    },
  },
  defaultVariants: { variant: "divided" },
});

export const listItem = rcva(
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
export const listItemWrap = rcva("block");
export const listItemLeadingText = rcva(`${fixedWidth["12"]} ${text.label} text-label-lg tabular-nums`);
export const listItemLeading = rcva(`${row} items-center self-start pt-1 text-on-surface-variant`);
export const listItemContent = rcva(`${stack} ${rowFill} gap-0.5`);
export const listItemTop = rcva(`${row} items-baseline justify-between gap-x-2`);
export const listItemOverline = rcva("text-label-sm text-on-surface-variant");
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
export const listItemTrailing = rcva(`${rowEnd} ${row} items-center justify-end gap-2 self-center`);

export type ListVariants = VariantProps<typeof list>;
export type ListItemLines = "1" | "2" | "3";

@customElement("ui-list")
export class UiList extends LightElement {
  @property() variant: ListVariants["variant"];
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
  @property({ attribute: "leading-text" }) leadingText: Renderable = "";
  @property() lines: ListItemLines = "2";
  @property() href?: string;
  @property({ type: Boolean }) action = false;
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
