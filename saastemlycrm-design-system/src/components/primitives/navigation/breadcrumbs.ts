import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inlineRow, text } from "../../../styles/algebra.ts";
import { m } from "../../../lib/i18n/index.ts";

export const breadcrumbs = rcva(
  `${text.label} breadcrumbs ms-0 overflow-visible [&>ul]:flex-wrap [&>ul]:ps-0 [&>ul]:whitespace-normal [&>ul>li]:max-w-full [&>ul>li]:[overflow-wrap:break-word]`,
  {
    variants: {
      size: {
        xs: "text-body-sm",
        sm: "text-body-md",
        md: "text-body-lg",
        lg: "text-title-md",
      },
      width: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        full: "",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export const breadcrumbsItem = rcva(`${inlineRow} items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:stroke-current`);

export type BreadcrumbsVariants = VariantProps<typeof breadcrumbs>;

export interface BreadcrumbItem {
  label: Renderable;
  href?: string;
  icon?: Renderable;
}

@customElement("ui-breadcrumbs")
export class UiBreadcrumbs extends LightElement {
  @property({ attribute: false }) items: BreadcrumbItem[] = [];
  @property() size: BreadcrumbsVariants["size"] = "sm";
  @property() width: BreadcrumbsVariants["width"];
  @property() label = m.breadcrumbs_label();

  render() {
    const last = this.items.length - 1;
    return html`<nav class=${breadcrumbs({ size: this.size, width: this.width })} aria-label=${this.label}>
      <ul>
        ${
          this.items.length
            ? this.items.map((item, i) => {
                const inner = item.icon
                  ? html`<span class=${breadcrumbsItem()}>${item.icon}${item.label}</span>`
                  : item.label;
                const click = () =>
                  this.dispatchEvent(new CustomEvent("ui-select", { detail: { item, index: i }, bubbles: true }));
                return html`<li>
                  ${
                    item.href && i !== last
                      ? html`<a href=${item.href} @click=${click}>${inner}</a>`
                      : html`<span aria-current=${i === last ? "page" : nothing}>${inner}</span>`
                  }
                </li>`;
              })
            : this.content
        }
      </ul>
    </nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-breadcrumbs": UiBreadcrumbs;
  }
}
