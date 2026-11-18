import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button, type ButtonVariants } from "./button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Dropdown: Opens a menu or other element when a button is clicked.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/dropdown/
 *
 * The docs' `placement` group holds two independent axes, so it maps to two
 * variants: `side` (top/bottom/left/right) and `align` (start/center/end).
 */
export const dropdown = rcva("dropdown", {
  variants: {
    side: {
      top: "dropdown-top",
      bottom: "dropdown-bottom",
      left: "dropdown-left",
      right: "dropdown-right",
    },
    align: {
      start: "dropdown-start",
      center: "dropdown-center",
      end: "dropdown-end",
    },
    /** Open on hover as well as on click/focus. */
    hover: { true: "dropdown-hover" },
    /** Force the state regardless of focus. */
    force: {
      open: "dropdown-open",
      close: "dropdown-close",
    },
  },
});

/** The floating panel (`dropdown-content`). Combine with `dropdownPanel` for its look. */
export const dropdownContent = rcva("dropdown-content z-1");

/** Look of the panel, as in the daisyUI examples. */
export const dropdownPanel = rcva("", {
  variants: {
    /** `menu` for item lists; `card` for free content (the docs' "Card as dropdown"). */
    kind: {
      menu: "menu",
      card: "card card-sm",
    },
    surface: {
      /** Frosted glass (src/styles/theme.css): menus float above the page. The default. */
      glass: "liquid-glass",
      "base-100": "bg-base-100",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300",
    },
    rounded: { true: "rounded-box" },
    width: {
      "52": "w-52",
      "64": "w-64",
      "72": "w-72",
      "80": "w-80",
    },
    padding: {
      "0": "p-0",
      "2": "p-2",
      "4": "p-4",
    },
    shadow: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      "2xl": "shadow-2xl",
    },
    /** Gap between trigger and panel (the docs' navbar dropdown uses `mt-4`). */
    offset: {
      "1": "mt-1",
      "2": "mt-2",
      "4": "mt-4",
    },
  },
});

/** Card body inside a `card` panel. */
export const dropdownCardBody = rcva("card-body");
export const dropdownCardTitle = rcva("card-title");

/** Extra trigger styling on top of the `button` recipe. A bare `<svg>` trigger gets the docs' icon size. */
export const dropdownTrigger = rcva("[&>svg]:h-4 [&>svg]:w-4", {
  variants: {
    /** `m-1` around the trigger, as in most docs examples. */
    spaced: { true: "m-1" },
    /** `rounded-field` (the docs' navbar dropdown). */
    rounded: { field: "rounded-field" },
    /** Text colour, e.g. a ghost icon button in `info` (the docs' helper dropdown). */
    tone: {
      neutral: "text-neutral",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
  },
});

/** Built-in trigger icon. */
export const dropdownIcon = rcva("h-4 w-4 stroke-current");

/** Icons used as triggers in the docs (`info`: the helper dropdown). */
export const dropdownIcons = {
  info: iconSvg("info", {}, { label: "More info", class: dropdownIcon() }),
} as const;

export type DropdownVariants = VariantProps<typeof dropdown>;
export type DropdownPanelVariants = VariantProps<typeof dropdownPanel>;
export type DropdownTriggerVariants = VariantProps<typeof dropdownTrigger>;

/** `menu`: item list; `card`: card with `card-body` around the children; `plain`: no look at all. */
export type DropdownPanelKind = "menu" | "card" | "plain";

export interface DropdownItem {
  label: Renderable;
  href?: string;
  value?: string;
  disabled?: boolean;
}

/**
 * How the dropdown opens:
 * - `focus` (default): opens while the trigger/content has focus.
 * - `details`: `<details>/<summary>`, toggles on click, works without focus.
 * - `popover`: Popover API + CSS anchor positioning; escapes `overflow:hidden` parents.
 */
export type DropdownMode = "focus" | "details" | "popover";

/** Panel look per kind, from the docs examples. */
const PANEL_DEFAULTS: Record<DropdownPanelKind, DropdownPanelVariants> = {
  menu: { kind: "menu", surface: "glass", rounded: true, width: "52", padding: "2", shadow: "sm" },
  card: { kind: "card", surface: "glass", width: "64", shadow: "md" },
  plain: {},
};

/**
 * @example
 * <ui-dropdown label="Click" align="end"
 *   .items=${[{ label: "Item 1" }, { label: "Docs", href: "/docs" }]}
 *   @ui-select=${(e) => console.log(e.detail.item)}></ui-dropdown>
 * @example
 * <ui-dropdown label="Dropdown" align="end" trigger-variant="ghost" trigger-rounded="field"
 *   trigger-spaced="false" panel-surface="base-200" panel-offset="4" .items=${items}></ui-dropdown>
 * @example
 * <ui-dropdown panel="card" heading="You needed more info?" align="end" panel-shadow="sm" panel-rounded
 *   trigger-icon="info" trigger-shape="circle" trigger-variant="ghost" trigger-size="xs" trigger-tone="info"
 *   trigger-spaced="false">
 *   <p>Here is a description!</p>
 * </ui-dropdown>
 *
 * Without `items`, children are the panel content (`panel="card"` wraps them in
 * a card body with an optional `heading`). A rich trigger can be supplied as
 * `slot="trigger"`. `ui-select` (detail: { item, index }) fires when an item is
 * picked; the dropdown then closes. `show()` / `hide()` / `toggle()` control it
 * from JS. `side` / `align` / `hover` are responsive (`align="start md:end"`).
 */
@customElement("ui-dropdown")
export class UiDropdown extends LightElement {
  @property() side: DropdownVariants["side"];
  @property() align: DropdownVariants["align"];
  @property({ converter: responsiveBoolean }) hover: Responsive<boolean> = false;
  @property() force: DropdownVariants["force"];
  @property() mode: DropdownMode = "focus";

  /** Trigger text (or `slot="trigger"`). */
  @property() label: Renderable = "";
  /** Built-in icon as the trigger (e.g. the docs' helper `info` icon). */
  @property({ attribute: "trigger-icon" }) triggerIcon?: keyof typeof dropdownIcons;
  /** Trigger look: `button` variants plus spacing / rounding / text tone. */
  @property({ attribute: "trigger-color" }) triggerColor: ButtonVariants["color"];
  @property({ attribute: "trigger-variant" }) triggerVariant: ButtonVariants["variant"];
  @property({ attribute: "trigger-size" }) triggerSize: ButtonVariants["size"];
  @property({ attribute: "trigger-shape" }) triggerShape: ButtonVariants["shape"];
  @property({ attribute: "trigger-spaced", converter: responsiveBoolean }) triggerSpaced: Responsive<boolean> = true;
  @property({ attribute: "trigger-rounded" }) triggerRounded: DropdownTriggerVariants["rounded"];
  @property({ attribute: "trigger-tone" }) triggerTone: DropdownTriggerVariants["tone"];

  /** Panel kind; `items` always render as a menu. */
  @property() panel: DropdownPanelKind = "menu";
  /** Card panel: title above the children. */
  @property() heading: Renderable = "";
  /** Override the panel kind's default look. */
  @property({ attribute: "panel-surface" }) panelSurface: DropdownPanelVariants["surface"];
  @property({ attribute: "panel-rounded", converter: responsiveBoolean }) panelRounded?: Responsive<boolean>;
  @property({ attribute: "panel-width" }) panelWidth: DropdownPanelVariants["width"];
  @property({ attribute: "panel-padding" }) panelPadding: DropdownPanelVariants["padding"];
  @property({ attribute: "panel-shadow" }) panelShadow: DropdownPanelVariants["shadow"];
  @property({ attribute: "panel-offset" }) panelOffset: DropdownPanelVariants["offset"];

  @property({ attribute: false }) items: DropdownItem[] = [];
  /** details/popover modes: open state. */
  @property({ type: Boolean, reflect: true }) open = false;

  private _id = uid("dropdown");

  @query("details") private _details?: HTMLDetailsElement;
  @query("[popover]") private _popover?: HTMLElement;
  @query("[data-trigger]") private _trigger?: HTMLElement;

  show() {
    if (this.mode === "focus") this._trigger?.focus();
    else if (this.mode === "popover") this._popover?.showPopover();
    this.open = true;
  }

  hide() {
    if (this.mode === "focus") (document.activeElement as HTMLElement | null)?.blur();
    else if (this.mode === "popover") this._popover?.hidePopover();
    if (this._details) this._details.open = false;
    this.open = false;
  }

  toggle() {
    if (this.open || (this.mode === "focus" && this.contains(document.activeElement))) this.hide();
    else this.show();
  }

  private _select(item: DropdownItem, index: number, e: Event) {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    this.dispatchEvent(new CustomEvent("ui-select", { detail: { item, index }, bubbles: true }));
    this.hide();
  }

  private _trig() {
    if (this.hasSlotted("trigger")) return this.slotted("trigger");
    return this.triggerIcon ? html`${dropdownIcons[this.triggerIcon]}${this.label}` : this.label;
  }

  private get _kind(): DropdownPanelKind {
    return this.items.length ? "menu" : this.panel;
  }

  /** Panel look: the kind's defaults, overridden by the panel-* props. */
  private _look(popover = false) {
    const d = PANEL_DEFAULTS[this._kind];
    return dropdownPanel({
      kind: d.kind,
      surface: this.panelSurface ?? d.surface,
      rounded: this.panelRounded ?? d.rounded,
      width: this.panelWidth ?? d.width,
      // The docs' popover menu has no padding.
      padding: this.panelPadding ?? (popover ? undefined : d.padding),
      shadow: this.panelShadow ?? d.shadow,
      offset: this.panelOffset,
    });
  }

  private _triggerCls() {
    return button({
      color: this.triggerColor,
      variant: this.triggerVariant,
      size: this.triggerSize,
      shape: this.triggerShape,
      class: dropdownTrigger({
        spaced: isOn(this.triggerSpaced) ? this.triggerSpaced : false,
        rounded: this.triggerRounded,
        tone: this.triggerTone,
      }),
    });
  }

  private _panelBody() {
    if (!this.items.length) {
      if (this._kind !== "card") return this.slotted();
      return html`<div tabindex="0" class=${dropdownCardBody()}>
        ${this.heading ? html`<h2 class=${dropdownCardTitle()}>${this.heading}</h2>` : nothing} ${this.slotted()}
      </div>`;
    }
    return this.items.map(
      (item, i) =>
        html`<li class=${item.disabled ? "menu-disabled" : ""}>
          <a
            href=${ifDefined(item.href)}
            tabindex="0"
            aria-disabled=${ifDefined(item.disabled ? "true" : undefined)}
            @click=${(e: Event) => this._select(item, i, e)}
            @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && !item.href && this._select(item, i, e)}
            >${item.label}</a
          >
        </li>`,
    );
  }

  render() {
    const variants = { side: this.side, align: this.align, hover: this.hover, force: this.force };
    const isMenu = this._kind === "menu";
    const panelCls = dropdownContent({ class: this._look() });
    const panelTag = (cls: string) =>
      isMenu
        ? html`<ul tabindex="-1" class=${cls}>
            ${this._panelBody()}
          </ul>`
        : html`<div tabindex="0" class=${cls}>${this._panelBody()}</div>`;

    if (this.mode === "details") {
      return html`<details
        class=${dropdown(variants)}
        ?open=${this.open}
        @toggle=${(e: Event) => (this.open = (e.target as HTMLDetailsElement).open)}
      >
        <summary data-trigger class=${this._triggerCls()}>${this._trig()}</summary>
        ${panelTag(panelCls)}
      </details>`;
    }

    if (this.mode === "popover") {
      const anchor = `--${this._id}`;
      const popCls = dropdown({ ...variants, class: this._look(true) });
      const onToggle = (e: ToggleEvent) => (this.open = e.newState === "open");
      return html`<button
          data-trigger
          type="button"
          class=${this._triggerCls()}
          popovertarget=${this._id}
          style="anchor-name:${anchor}"
          aria-haspopup="menu"
          aria-expanded=${this.open ? "true" : "false"}
        >
          ${this._trig()}
        </button>
        ${
          isMenu
            ? html`<ul class=${popCls} popover id=${this._id} style="position-anchor:${anchor}" @toggle=${onToggle}>
                ${this._panelBody()}
              </ul>`
            : html`<div class=${popCls} popover id=${this._id} style="position-anchor:${anchor}" @toggle=${onToggle}>
                ${this._panelBody()}
              </div>`
        }`;
    }

    return html`<div class=${dropdown(variants)}>
      <div data-trigger tabindex="0" role="button" class=${this._triggerCls()} aria-haspopup="menu">
        ${this._trig()}
      </div>
      ${panelTag(panelCls)}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-dropdown": UiDropdown;
  }
}
