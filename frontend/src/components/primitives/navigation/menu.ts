import type { VariantProps } from "class-variance-authority";
import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { TOOLTIP_GLASS } from "../feedback/tooltip.ts";

/**
 * Menu: Displays a list of links vertically or horizontally.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/menu/
 *
 * Responsive (docs): `direction="vertical lg:horizontal"`, `width="sm lg:auto"`.
 * Without padding and border radius (docs): `flush`.
 * The active item sits on a primary tint (the app's selection look, not daisyUI's neutral), in the
 * text colour: primary text on its own tint falls below WCAG AA in many schemes (ui-contrast-audit).
 */
export const menu = rcva(
  "menu [&_.menu-active]:bg-primary/20 [&_.menu-active]:text-base-content [&_.menu-active]:shadow-none",
  {
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
      /** One column that never wraps: rows keep the menu's width, so long labels can truncate. */
      nowrap: { true: "flex-nowrap [&_li>*]:min-w-0" },
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
      /**
       * App navigation look, shared by the expanded list (`layout="nav"`) and the rail
       * (`layout="rail"`): same text size and weight. One column that never wraps, so rows keep the menu's width and long labels truncate.
       */
      nav: {
        true: "flex-nowrap px-0 text-sm font-medium [&_.menu-title]:text-base-content/75 [interpolate-size:allow-keywords] [&_details::details-content]:overflow-hidden [&_details::details-content]:[block-size:0] [&_details::details-content]:[transition:block-size_var(--duration-spatial)_var(--ease-spatial),content-visibility_var(--duration-spatial)_allow-discrete] [&_details[open]::details-content]:[block-size:auto] motion-reduce:[&_details::details-content]:transition-none",
      },
      /**
       * Open navigation list that can fold into the rail's look with motion: set
       * the flags `--menu-collapse` (1: folded into the rail's look) and `--menu-expanded` (0: groups
       * held shut, e.g. while a column opens) on an ancestor (registered in src/styles/theme.css,
       * so it can flip them on a schedule; the menu reacts at once). Folding
       * slides and fades the labels and chevrons away, and the highlight (`menuIndicator`)
       * slides from the active page to its top-level item and shrinks to the rail's icon pill.
       * Where anchor positioning is missing, the active item keeps its own background.
       */
      fold: {
        true: "relative isolate [anchor-scope:all] supports-[anchor-name:--a]:[&_.menu-active]:bg-transparent [&_summary]:after:[opacity:calc(1_-_var(--menu-collapse,0))] [&_summary]:after:[transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),rotate_var(--duration-spatial-fast)_var(--ease-spatial-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:[&_summary]:after:transition-none",
      },
      /**
       * Navigation rail: exactly the open list's items with the labels left out, so each icon and
       * highlight sits where it does in the open list. Items are the icon pill (`w-11`), the
       * width the open list's highlight folds to.
       */
      rail: { true: "[&_li>*]:w-11" },
      /**
       * Panes (like VS Code's side bar): the menu fills its container's height, every top-level
       * group's title stays on screen, and each open group scrolls inside its own share of the
       * height: open groups share it equally, and a group needing less gives the rest away.
       * Opening or closing one, its share grows or shrinks on the same spring as its content
       * (only `flex-grow` changes, so it animates), and the other panes move with it.
       */
      panes: {
        true: "min-h-0 flex-1 [&>li]:min-h-8 [&>li]:flex-[0_0_2rem] [&>li]:max-h-max [&>li]:[transition:flex-grow_var(--duration-spatial)_var(--ease-spatial)] motion-reduce:[&>li]:transition-none [&>li:has(>details[open])]:flex-[1_1_2rem] [&>li>details]:h-full [&>li>details::details-content]:[block-size:calc(100%_-_2rem)] [&>li>details[open]::details-content]:[block-size:calc(100%_-_2rem)] [&>li>details>ul]:max-h-full [&>li>details>ul]:overflow-y-auto [&>li>details>ul]:overscroll-contain",
      },
    },
    defaultVariants: { surface: true, rounded: true, iconSize: "md" },
  },
);

/** Non-interactive title `<li>` (or `<h2>` inside an `<li>` that has a submenu). */
export const menuTitle = rcva("menu-title");

/** `<li>` wrapper. `menu-disabled` goes here, next to a disabled control. */
export const menuLi = rcva("", {
  variants: {
    disabled: { true: "menu-disabled" },
  },
});

/** The `<a>` / `<button>` inside a menu `<li>` (and a submenu's `<summary>`). */
export const menuLink = rcva("", {
  variants: {
    active: { true: "menu-active" },
    focus: { true: "menu-focus" },
    /**
     * Anchors for the `fold` highlight: the active page (`page`), the top-level item it sits
     * under (`root`), or a top-level active page (`both`).
     */
    anchor: {
      /** The highlight's target while its group is open. */
      page: "[[open]_&]:[anchor-name:--menu-target]",
      /**
       * The group holding the active page: the highlight's target while the group is closed
       * (or held shut), and drawn like the active item then, as in the rail.
       */
      root: "[anchor-name:--menu-active-root] [:not([open])>&]:[anchor-name:--menu-active-root,--menu-target] [:not([open])>&]:text-primary [@container_style(--menu-expanded:0)]:text-primary [transition:color_var(--duration-effects)_var(--ease-effects)]",
      both: "[anchor-name:--menu-active-root,--menu-target]",
    },
    /**
     * A card instead of a one-line row (`card: true` on the item): the whole title wraps, with an
     * optional description under it and the badge kept at full size — for items whose text
     * matters (notifications, tours…). Spaced from its neighbours; still a link or button.
     */
    card: {
      true: "my-1 flex! flex-col items-stretch! gap-0.5 rounded-box border border-base-content/10 bg-base-100/50 px-3 py-2 whitespace-normal hover:bg-base-100",
    },
    /** Icon-only items show a tooltip with the label. */
    tooltip: {
      top: `tooltip ${TOOLTIP_GLASS}`,
      right: `tooltip tooltip-right ${TOOLTIP_GLASS}`,
      bottom: `tooltip tooltip-bottom ${TOOLTIP_GLASS}`,
    },
  },
});

/**
 * The `fold` list's highlight: one element, anchored to the active page while its group is
 * open, to the group's row while it is closed (or held shut), and folded to the rail's icon
 * pill on that row — so it slides and resizes between them on M3's default spatial spring.
 * (`m-0 opacity-100`: daisyUI draws an empty menu `<li>` as a faint divider.)
 */
export const menuIndicator = rcva(
  "pointer-events-none absolute -z-10 m-0 rounded-field opacity-100 bg-primary/20 [position-anchor:--menu-target] [position-visibility:anchors-valid] top-[anchor(top)] left-[anchor(left)] h-[anchor-size(height)] w-[anchor-size(width)] [transition:top_var(--duration-spatial)_var(--ease-spatial),left_var(--duration-spatial)_var(--ease-spatial),width_var(--duration-spatial)_var(--ease-spatial),height_var(--duration-spatial)_var(--ease-spatial)] [@container_style(--menu-expanded:0)]:[position-anchor:--menu-active-root] [@container_style(--menu-collapse:1)]:[position-anchor:--menu-active-root] [@container_style(--menu-collapse:1)]:w-11 not-supports-[anchor-name:--a]:hidden motion-reduce:transition-none",
);

/** Navigation labels: one line (long ones end in an ellipsis); slide and fade away as the list folds (`--menu-collapse`). */
export const menuNavLabel = rcva(
  "inline-block truncate [opacity:calc(1_-_var(--menu-collapse,0))] [translate:calc(var(--menu-collapse,0)_*_-1rem)_0] [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast),translate_var(--duration-spatial-fast)_var(--ease-spatial-fast)] motion-reduce:transition-none",
);

/** A card item's parts: title row (title + badge), and the description under it. */
export const menuCardHead = rcva("flex items-start gap-2");
export const menuCardTitle = rcva("min-w-0 flex-1 text-sm leading-snug font-medium [overflow-wrap:anywhere]");
export const menuCardDescription = rcva(
  "text-xs leading-snug text-base-content/75 [overflow-wrap:anywhere] [.menu-active_&]:text-base-content",
);
export const menuCardBody = rcva(
  "flex flex-col gap-0.5 [opacity:calc(1_-_var(--menu-collapse,0))] [transition:opacity_var(--duration-effects-fast)_var(--ease-effects-fast)] motion-reduce:transition-none",
);

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
    /** In a card: never squeezed, on the title's first line. */
    card: { true: "mt-0.5 shrink-0 whitespace-nowrap" },
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
  /** Show the item as a card: the whole label wraps, with `description` under it. */
  card?: boolean;
  /** A card's second line (e.g. a notification's detail, a tour's summary). */
  description?: Renderable;
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

type MenuLinkAnchor = NonNullable<VariantProps<typeof menuLink>["anchor"]>;

/** Whether an item or any item under it is the active one. */
const hasActive = (item: MenuItem): boolean => !!item.active || !!item.children?.some(hasActive);

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
 * App navigation (for `<ui-app-shell>`): `layout="nav"` for the open column and
 * `layout="rail"` for the collapsed one: the same items with only their icons (labels become
 * tooltips), so nothing moves between the two. The open list's labels slide in.
 * Without `items`, authored `<li>` children are rendered directly in the `<ul>`.
 * Fires `ui-select` with `{ item, path }` when an item is clicked.
 * Fires `ui-toggle` with `{ item, path, open }` when a `details` submenu opens or closes.
 */
@customElement("ui-menu")
export class UiMenu extends LightElement {
  @property({ attribute: false }) items: MenuItem[] = [];
  @property() size: MenuVariants["size"];
  @property() direction: MenuVariants["direction"];
  @property({ converter: responsiveBoolean }) paged: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) nowrap: Responsive<boolean> = false;
  /** Fill the container's height; group titles stay visible and each open group scrolls on its own. */
  @property({ type: Boolean }) panes = false;
  @property({ converter: responsiveBoolean }) surface: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) rounded: Responsive<boolean> = true;
  @property({ converter: responsiveBoolean }) flush: Responsive<boolean> = false;
  @property() width: MenuVariants["width"];
  @property({ attribute: "icon-size" }) iconSize: MenuVariants["iconSize"] = "md";
  @property() submenu: MenuSubmenuMode = "details";
  @property({ type: Boolean, attribute: "icon-only" }) iconOnly = false;
  @property() tooltip: "top" | "right" | "bottom" | "none" = "right";
  /** `nav`: app navigation list; `rail`: the same items, icons only (collapsed navigation column). */
  @property() layout: "list" | "nav" | "rail" = "list";
  /** Keep the keyboard-focused item (`focus: true`, e.g. a palette's highlighted result) in view. */
  protected updated() {
    this.querySelector(".menu-focus")?.scrollIntoView({ block: "nearest" });
  }

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
    if (this.layout === "rail") {
      return html`${item.icon ?? nothing}`;
    }
    if (item.card) {
      return html`<span class=${menuCardBody()}>
        <span class=${menuCardHead()}>
          ${item.icon ?? nothing}
          <span class=${menuCardTitle()}>${item.label ?? nothing}</span>
          ${item.badge != null ? html`<span class=${menuBadge({ color: item.badgeColor, card: true })}>${item.badge}</span>` : nothing}
        </span>
        ${item.description != null ? html`<span class=${menuCardDescription()}>${item.description}</span>` : nothing}
      </span>`;
    }
    const text = this.iconOnly && item.icon ? nothing : (item.label ?? nothing);
    const label = this.layout === "nav" && text !== nothing ? html`<span class=${menuNavLabel()}>${text}</span>` : text;
    return html`${item.icon ?? nothing} ${label}
    ${item.badge != null ? html`<span class=${menuBadge({ color: item.badgeColor })}>${item.badge}</span>` : nothing}`;
  }

  private _link(item: MenuItem, path: number[]) {
    const rail = this.layout === "rail";
    const iconOnly = rail || (this.iconOnly && !!item.icon);
    // The rail scrolls (and would clip a CSS tooltip), so it uses the native one.
    const tip = iconOnly && !rail && this.tooltip !== "none" ? this.tooltip : undefined;
    const title = rail && typeof item.label === "string" ? item.label : undefined;
    const cls = menuLink({
      active: item.active,
      focus: item.focus,
      tooltip: tip,
      anchor: this._anchor(item, path),
      card: !!item.card && !rail,
    });
    const dataTip = tip && typeof item.label === "string" ? item.label : undefined;
    const ariaLabel = iconOnly && typeof item.label === "string" ? item.label : undefined;
    if (item.href && !item.disabled) {
      return html`<a
        class=${cls}
        href=${item.href}
        data-tip=${ifDefined(dataTip)}
        title=${ifDefined(title)}
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
      title=${ifDefined(title)}
      aria-label=${ifDefined(ariaLabel)}
      @click=${(e: Event) => this._select(item, path, e)}
    >
      ${this._label(item)}
    </button>`;
  }

  /** A `details` submenu opened or closed (by the user or `open`): fires `ui-toggle`. */
  private _toggled(item: MenuItem, path: number[], e: Event) {
    const open = (e.currentTarget as HTMLDetailsElement).open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { item, path, open }, bubbles: true }));
  }

  /** Which `fold` highlight anchor an item is (navigation list only). */
  private _anchor(item: MenuItem, path: number[]): MenuLinkAnchor | undefined {
    if (this.layout !== "nav") return undefined;
    const top = path.length === 1;
    if (item.active) return top ? "both" : "page";
    return top && hasActive(item) ? "root" : undefined;
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
      <details ?open=${!!item.open} @toggle=${(e: Event) => this._toggled(item, path, e)}>
        <summary class=${menuLink({ anchor: this._anchor(item, path) })}>${this._label(item)}</summary>
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
        nowrap: this.nowrap,
        panes: this.panes,
        surface: this.surface,
        rounded: this.rounded,
        flush: this.flush,
        width: this.width,
        iconSize: this.iconSize,
        nav: this.layout !== "list",
        // Panes scroll each group on its own; a highlight anchored across them would float over
        // other panes' titles, so the active item carries its own tint there.
        fold: this.layout === "nav" && !this.panes,
        rail: this.layout === "rail",
      })}
    >
      ${this.items.length ? this._list(this.items, []) : this.content}
      ${this.layout === "nav" && !this.panes ? html`<li class=${menuIndicator()} role="presentation"></li>` : nothing}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-menu": UiMenu;
  }
}
