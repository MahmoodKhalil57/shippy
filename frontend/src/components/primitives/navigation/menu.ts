import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Menu: Displays a list of links vertically or horizontally.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/menu/
 *
 * Responsive (docs): `direction="vertical lg:horizontal"`, `width="sm lg:auto"`.
 * Without padding and border radius (docs): `flush`.
 */
export const menu = rcva("menu", {
  variants: {
    size: {
      xs: "menu-xs",
      sm: "menu-sm",
      md: "menu-md",
      lg: "menu-lg",
      xl: "menu-xl",
    },
    direction: {
      vertical: "menu-vertical",
      horizontal: "menu-horizontal",
    },
    /** Show one level at a time; the open `<summary>` becomes a back button. */
    paged: { true: "menu-paged" },
    /** Background used in the docs examples. */
    surface: { true: "bg-base-200" },
    /** Rounded corners (docs default; off in the "without radius" example). */
    rounded: { true: "rounded-box" },
    /** No padding and square items (docs "Menu without padding and border radius"). */
    flush: { true: "p-0 [&_li>*]:rounded-none" },
    /** Widths used in the docs examples. */
    width: {
      sm: "w-56",
      xs: "w-full max-w-xs",
      full: "w-full",
      /** Fill the remaining space (docs drawer icon-only sidebar). */
      grow: "w-full grow",
      auto: "w-auto",
      max: "min-w-max",
    },
    /** Icon size (docs: `h-5 w-5`, `h-4 w-4` in small menus). */
    iconSize: {
      sm: "[&_svg]:size-4",
      md: "[&_svg]:size-5",
    },
  },
  defaultVariants: { surface: true, rounded: true, iconSize: "md" },
});

/** Non-interactive title `<li>` (or `<h2>` inside an `<li>` that has a submenu). */
export const menuTitle = rcva("menu-title");

/** `<li>` wrapper. `menu-disabled` goes here, next to a disabled control. */
export const menuLi = rcva("", {
  variants: {
    disabled: { true: "menu-disabled" },
  },
});

/** The `<a>` / `<button>` inside a menu `<li>`. */
export const menuLink = rcva("", {
  variants: {
    active: { true: "menu-active" },
    focus: { true: "menu-focus" },
    /** Icon-only items show a tooltip with the label. */
    tooltip: {
      top: "tooltip",
      right: "tooltip tooltip-right",
      bottom: "tooltip tooltip-bottom",
      /** Only while a drawer is closed (docs icon-only drawer sidebar). */
      drawer: "is-drawer-close:tooltip is-drawer-close:tooltip-right",
    },
  },
});

/** Label hidden while a drawer is closed (docs icon-only drawer sidebar). */
export const menuDrawerLabel = rcva("is-drawer-close:hidden");

/** Trailing badge (docs "Menu with icons and badge"). */
export const menuBadge = rcva("badge badge-xs", {
  variants: {
    color: {
      neutral: "badge-neutral",
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      info: "badge-info",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
    },
  },
});

/** Collapsible `<ul>` controlled with JS (alternative to `<details>`). */
export const menuDropdown = rcva("menu-dropdown", {
  variants: {
    show: { true: "menu-dropdown-show" },
  },
});

/** Toggle for a `menu-dropdown`, controlled with JS. */
export const menuDropdownToggle = rcva("menu-dropdown-toggle", {
  variants: {
    show: { true: "menu-dropdown-show" },
  },
});

export type MenuVariants = VariantProps<typeof menu>;
export type MenuBadgeVariants = VariantProps<typeof menuBadge>;

export interface MenuItem {
  label?: Renderable;
  href?: string;
  /** Leading icon, e.g. an inline `<svg>` (sized by the menu's `icon-size`). */
  icon?: Renderable;
  /** Trailing badge text, rendered as `badge badge-xs`. */
  badge?: Renderable;
  badgeColor?: MenuBadgeVariants["color"];
  active?: boolean;
  focus?: boolean;
  disabled?: boolean;
  /** Render as a non-interactive `menu-title`; with `children`, a titled group. */
  heading?: boolean;
  /** Submenu items. */
  children?: MenuItem[];
  /** Submenu initially open (collapsible modes). */
  open?: boolean;
  /** Any value to identify the item in `ui-select`. */
  value?: unknown;
}

/**
 * How submenus behave:
 * - `static`: always expanded nested `<ul>`.
 * - `details`: native `<details>/<summary>` (default).
 * - `js`: `menu-dropdown-toggle` + `menu-dropdown`, toggled by this element.
 */
export type MenuSubmenuMode = "static" | "details" | "js";

/**
 * @example
 * <ui-menu size="sm" width="sm" .items=${[
 *   { label: "Item 1", active: true },
 *   { label: "Parent", open: true, children: [{ label: "Submenu 1" }] },
 *   { label: "Disabled", disabled: true },
 * ]}></ui-menu>
 *
 * Icon-only menus: give items an `icon` and set `icon-only` (labels become
 * tooltips; `tooltip="top"` for horizontal menus, `"none"` for no tooltip).
 * Drawer sidebar that collapses to icons: `collapse="drawer"` inside
 * `<ui-drawer panel="icon-only">` (labels hide and tooltips show while closed).
 * Without `items`, authored `<li>` children are rendered directly in the `<ul>`.
 * Fires `ui-select` with `{ item, path }` when an item is clicked.
 */
@customElement("ui-menu")
export class UiMenu extends LightElement {
  @property({ attribute: false }) items: MenuItem[] = [];
  @property() size: MenuVariants["size"];
  @property() direction: MenuVariants["direction"];
  @property({ converter: responsiveBoolean }) paged: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) rounded: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) flush: Responsive<boolean> = false;
  @property() width: MenuVariants["width"];
  @property({ attribute: "icon-size" }) iconSize: MenuVariants["iconSize"] = "md";
  @property() submenu: MenuSubmenuMode = "details";
  @property({ type: Boolean, attribute: "icon-only" }) iconOnly = false;
  @property() tooltip: "top" | "right" | "bottom" | "none" = "right";
  /** `drawer`: collapse to icons while the surrounding `ui-drawer` is closed. */
  @property() collapse: "none" | "drawer" = "none";

  /** Open state of `js` submenus, keyed by item. */
  private _shown = new WeakMap<MenuItem, boolean>();

  private _select(item: MenuItem, path: number[], e: Event) {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { item, path }, bubbles: true }));
  }

  private _label(item: MenuItem): TemplateResult {
    const label = this.iconOnly && item.icon ? nothing : (item.label ?? nothing);
    return html`${item.icon ?? nothing}
    ${this.collapse === "drawer" && label !== nothing ? html`<span class=${menuDrawerLabel()}>${label}</span>` : label}
    ${item.badge != null ? html`<span class=${menuBadge({ color: item.badgeColor })}>${item.badge}</span>` : nothing}`;
  }

  private _link(item: MenuItem, path: number[]) {
    const tip =
      this.collapse === "drawer"
        ? ("drawer" as const)
        : this.iconOnly && item.icon && this.tooltip !== "none"
          ? this.tooltip
          : undefined;
    const cls = menuLink({ active: item.active, focus: item.focus, tooltip: tip });
    const dataTip = tip && typeof item.label === "string" ? item.label : undefined;
    const ariaLabel =
      (this.iconOnly || this.collapse === "drawer") && typeof item.label === "string" ? item.label : undefined;
    if (item.href && !item.disabled) {
      return html`<a
        class=${cls}
        href=${item.href}
        data-tip=${ifDefined(dataTip)}
        aria-label=${ifDefined(ariaLabel)}
        aria-current=${ifDefined(item.active ? "page" : undefined)}
        @click=${(e: Event) => this._select(item, path, e)}
        >${this._label(item)}</a
      >`;
    }
    return html`<button
      type="button"
      class=${cls}
      ?disabled=${!!item.disabled}
      data-tip=${ifDefined(dataTip)}
      aria-label=${ifDefined(ariaLabel)}
      @click=${(e: Event) => this._select(item, path, e)}
    >
      ${this._label(item)}
    </button>`;
  }

  private _list(items: MenuItem[], path: number[]): unknown {
    return items.map((item, i) => this._li(item, [...path, i]));
  }

  private _li(item: MenuItem, path: number[]): TemplateResult {
    const li = menuLi({ disabled: item.disabled });

    if (item.heading && !item.children) {
      return html`<li class=${menuTitle()}>${item.label}</li>`;
    }
    if (item.heading && item.children) {
      return html`<li>
        <h2 class=${menuTitle()}>${item.label}</h2>
        <ul>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }
    if (!item.children) {
      return html`<li class=${li}>${this._link(item, path)}</li>`;
    }

    if (this.submenu === "static") {
      return html`<li class=${li}>
        ${this._link(item, path)}
        <ul>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }

    if (this.submenu === "js") {
      const show = this._shown.get(item) ?? !!item.open;
      const toggle = () => {
        this._shown.set(item, !show);
        this.requestUpdate();
      };
      return html`<li class=${li}>
        <span
          class=${menuDropdownToggle({ show })}
          role="button"
          tabindex="0"
          aria-expanded=${show ? "true" : "false"}
          @click=${toggle}
          @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle())}
          >${this._label(item)}</span
        >
        <ul class=${menuDropdown({ show })}>
          ${this._list(item.children, path)}
        </ul>
      </li>`;
    }

    return html`<li class=${li}>
      <details ?open=${!!item.open}>
        <summary>${this._label(item)}</summary>
        <ul>
          ${this._list(item.children, path)}
        </ul>
      </details>
    </li>`;
  }

  render() {
    return html`<ul
      class=${menu({
        size: this.size,
        direction: this.direction,
        paged: this.paged,
        surface: this.surface,
        rounded: this.rounded,
        flush: this.flush,
        width: this.width,
        iconSize: this.iconSize,
      })}
    >
      ${this.items.length ? this._list(this.items, []) : this.content}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-menu": UiMenu;
  }
}
