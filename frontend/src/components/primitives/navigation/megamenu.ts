import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";

/**
 * Megamenu: Large horizontal menu whose items open popovers with navigation links.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/megamenu/
 *
 * Structure: `.megamenu` > `.megamenu-active` (moving indicator) + pairs of
 * `<button popovertarget>` / `<div id popover>` (max 10) and plain links.
 * Popover content is usually `<ui-menu>`s (e.g. `surface="false"`,
 * `direction="md:horizontal"`, `width="full"`).
 *
 * `collapsible` (docs responsive pattern): on small screens the whole megamenu
 * is a popover opened by a button, shown vertically. Its direction then
 * defaults to `"max-sm:vertical"` = `max-sm:megamenu-vertical` (spelled out
 * here so Tailwind generates it for this primitive default).
 */
/** Its popovers float over the page, so they are liquid glass (src/styles/theme.css). */
export const megamenu = rcva("megamenu [&_[popover]]:liquid-glass", {
  variants: {
    size: {
      xs: "megamenu-xs",
      sm: "megamenu-sm",
      md: "megamenu-md",
      lg: "megamenu-lg",
      xl: "megamenu-xl",
    },
    /** Popover width: as wide as the megamenu, or the entire page. */
    width: {
      wide: "megamenu-wide",
      full: "megamenu-full",
    },
    /** Vertical; responsive, e.g. `"max-sm:vertical"`. */
    direction: {
      vertical: "megamenu-vertical",
    },
    /** Border + padding used in the docs examples. */
    bordered: { true: "p-2 border border-outline-variant" },
  },
});

/** The visual indicator that moves to the active item. */
export const megamenuActive = rcva("megamenu-active");

/** A `popovertarget` button; `arrow: false` hides its arrow. */
export const megamenuTrigger = rcva("", {
  variants: {
    arrow: { false: "after:content-none", true: "" },
  },
});

/** Button that opens a collapsible megamenu on small screens. */
export const megamenuOpener = rcva("btn sm:hidden");

/** Popover body (docs `p-4`; image layouts put content and image in a row). */
export const megamenuPanel = rcva("", {
  variants: {
    padded: { true: "p-4" },
    /** Content + image side by side, stacked on phones (docs "lots of links"). */
    withImage: { true: "flex max-sm:flex-col items-start" },
  },
});
export const megamenuImage = rcva("md:max-w-sm max-md:w-auto");

export type MegamenuVariants = VariantProps<typeof megamenu>;

export interface MegamenuItem {
  label: Renderable;
  /** Popover content. When set the item is a button that opens it. */
  content?: Renderable;
  /** Image shown beside the popover content (docs "lots of links"). */
  image?: { src: string; alt?: string };
  /** `p-4` around the popover content (default on). */
  padded?: boolean;
  /** Plain link when there's no `content`. */
  href?: string;
  /** Click handler for a plain button item (e.g. open a login modal). */
  onClick?: (e: Event) => void;
}

/**
 * @example
 * <ui-megamenu collapsible bordered .items=${[
 *   { label: "Services", content: html`<ui-menu surface="false" .items=${[{ label: "Enterprise" }]}></ui-menu>` },
 *   { label: "Pricing", href: "/pricing" },
 * ]}></ui-megamenu>
 *
 * Without `items`, authored children are rendered after the `megamenu-active`
 * indicator, so you can hand-write the button/popover pairs.
 */
@customElement("ui-megamenu")
export class UiMegamenu extends LightElement {
  @property({ attribute: false }) items: MegamenuItem[] = [];
  @property() size: MegamenuVariants["size"];
  @property() width: MegamenuVariants["width"];
  @property() direction: MegamenuVariants["direction"];
  @property({ converter: responsiveBoolean }) bordered: Responsive<boolean> = false;
  /** Show the arrow on popover buttons. */
  @property({ converter: booleanAttribute }) arrows = true;
  /** Collapse into a popover opened by a button on small screens. */
  @property({ type: Boolean }) collapsible = false;
  /** Label of the small-screen opener button. */
  @property({ attribute: "opener-label" }) openerLabel = "Menu";

  private _id = uid("megamenu");

  render() {
    const direction = this.direction ?? (this.collapsible ? "max-sm:vertical" : undefined);
    const items = this.items.slice(0, 10);
    return html`${
        this.collapsible
          ? html`<button class=${megamenuOpener()} popovertarget=${this._id}>${this.openerLabel}</button>`
          : nothing
      }
      <div
        class=${megamenu({ size: this.size, width: this.width, direction, bordered: this.bordered })}
        id=${this._id}
        ?popover=${this.collapsible}
      >
        <span class=${megamenuActive()}></span>
        ${
          items.length
            ? items.map((item, i) => {
                if (item.content != null) {
                  const pid = `${this._id}-${i}`;
                  const image = item.image
                    ? html`<img src=${item.image.src} alt=${item.image.alt ?? ""} class=${megamenuImage()} />`
                    : nothing;
                  return html`<button class=${megamenuTrigger({ arrow: this.arrows })} popovertarget=${pid}>
                      ${item.label}
                    </button>
                    <div id=${pid} popover>
                      <div class=${megamenuPanel({ padded: item.padded ?? true, withImage: !!item.image })}>
                        ${item.content}${image}
                      </div>
                    </div>`;
                }
                if (item.href) return html`<a href=${ifDefined(item.href)}>${item.label}</a>`;
                return html`<button @click=${(e: Event) => item.onClick?.(e)}>${item.label}</button>`;
              })
            : this.content
        }
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-megamenu": UiMegamenu;
  }
}
