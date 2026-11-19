import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Breadcrumbs: Helps users navigate the website.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/breadcrumbs/
 *
 * `.breadcrumbs` wraps a `<ul>` of `<li>` links. Crumbs that don't fit wrap onto the next line
 * (each crumb stays whole) instead of daisyUI's horizontal scrolling, and without daisyUI's 4px
 * outdent (which cancels its own padding): in a column sized to its content the outdent made the
 * trail 4px too wide for its box, so it always showed a scrollbar and clipped the last crumb. `width="xs"` gives the docs "max-width" example.
 */
export const breadcrumbs = rcva(
  "breadcrumbs ms-0 overflow-visible [&>ul]:flex-wrap [&>ul]:ps-0 [&>ul]:whitespace-normal [&>ul>li]:whitespace-nowrap",
  {
    variants: {
      size: {
        xs: "text-body-sm",
        sm: "text-body-md",
        md: "text-body-lg",
        lg: "text-title-md",
      },
      /** Max width (the crumbs wrap when they don't fit). */
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

/** Wraps an icon + label in a crumb; sizes the icon like the docs. */
export const breadcrumbsItem = rcva("inline-flex items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:stroke-current");

export type BreadcrumbsVariants = VariantProps<typeof breadcrumbs>;

export interface BreadcrumbItem {
  label: Renderable;
  href?: string;
  icon?: Renderable;
}

/**
 * @example
 * <ui-breadcrumbs .items=${[{ label: "Home", href: "/" }, { label: "Documents", href: "/docs" }, { label: "Add Document" }]}>
 * </ui-breadcrumbs>
 * @example <ui-breadcrumbs width="xs" .items=${[…]}></ui-breadcrumbs>
 *
 * The last item is marked `aria-current="page"`. Without `items`, authored
 * `<li>` children are rendered inside the `<ul>`. Fires `ui-select` with
 * `{ item, index }` when a crumb is clicked.
 */
@customElement("ui-breadcrumbs")
export class UiBreadcrumbs extends LightElement {
  @property({ attribute: false }) items: BreadcrumbItem[] = [];
  @property() size: BreadcrumbsVariants["size"] = "sm";
  @property() width: BreadcrumbsVariants["width"];
  @property() label = "Breadcrumb";

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
