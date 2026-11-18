import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Dock: Bottom navigation bar that sticks to the bottom of the screen.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/dock/
 *
 * The dock is `position: fixed` at the bottom. Custom colors (docs):
 * `color="neutral"`. Add
 * `<meta name="viewport" content="viewport-fit=cover">` for iOS safe areas.
 */
export const dock = rcva("dock", {
  variants: {
    size: {
      xs: "dock-xs",
      sm: "dock-sm",
      md: "dock-md",
      lg: "dock-lg",
      xl: "dock-xl",
    },
    color: {
      neutral: "bg-neutral text-neutral-content",
      primary: "bg-primary text-primary-content",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300",
    },
  },
});

/** A dock button/link; `active` adds `dock-active`. Sizes its icon like the docs. */
export const dockItem = rcva("[&_svg]:size-[1.2em]", {
  variants: {
    active: { true: "dock-active" },
  },
});

export const dockLabel = rcva("dock-label");

export type DockVariants = VariantProps<typeof dock>;

export interface DockItem {
  label?: Renderable;
  /** Icon, e.g. an inline `<svg>` (sized by the dock). */
  icon?: Renderable;
  href?: string;
  /** Accessible name when there's no text label. */
  ariaLabel?: string;
}

/**
 * @example
 * <ui-dock size="sm" active="1" .items=${[
 *   { icon: homeSvg, label: "Home" }, { icon: inboxSvg, label: "Inbox" }, { icon: cogSvg, label: "Settings" },
 * ]}></ui-dock>
 *
 * Without `items`, authored `<button>` children are rendered inside the dock.
 * Fires `ui-change` with `{ index, item }`.
 */
@customElement("ui-dock")
export class UiDock extends LightElement {
  @property({ attribute: false }) items: DockItem[] = [];
  @property({ type: Number, reflect: true }) active = 0;
  @property() size: DockVariants["size"];
  @property() color: DockVariants["color"];
  /** Hide the text labels (icon-only dock). */
  @property({ type: Boolean, attribute: "hide-labels" }) hideLabels = false;

  select(index: number) {
    if (index === this.active) return;
    this.active = index;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index, item: this.items[index] }, bubbles: true }));
  }

  render() {
    return html`<nav class=${dock({ size: this.size, color: this.color })}>
      ${
        this.items.length
          ? this.items.map((item, i) => {
              const on = i === this.active;
              const aria =
                item.ariaLabel ?? (this.hideLabels && typeof item.label === "string" ? item.label : undefined);
              const body = html`${item.icon ?? nothing}
              ${item.label != null && !this.hideLabels ? html`<span class=${dockLabel()}>${item.label}</span>` : nothing}`;
              return item.href
                ? html`<a
                    class=${dockItem({ active: on })}
                    href=${item.href}
                    aria-label=${aria ?? nothing}
                    aria-current=${on ? "page" : nothing}
                    @click=${() => this.select(i)}
                    >${body}</a
                  >`
                : html`<button
                    type="button"
                    class=${dockItem({ active: on })}
                    aria-label=${aria ?? nothing}
                    aria-pressed=${on ? "true" : "false"}
                    @click=${() => this.select(i)}
                  >
                    ${body}
                  </button>`;
            })
          : this.content
      }
    </nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-dock": UiDock;
  }
}
