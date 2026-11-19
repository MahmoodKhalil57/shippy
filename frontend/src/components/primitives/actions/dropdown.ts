import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button, type ButtonVariants } from "./button.ts";
import { iconButton, type IconButtonVariants } from "./icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

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

/** A menu item's row: icon, label (and description), shortcut, check. */
export const dropdownItem = rcva("flex items-center gap-3", {
  variants: { destructive: { true: "text-error-ink" } },
});
export const dropdownItemText = rcva("flex min-w-0 flex-1 flex-col");
export const dropdownItemDescription = rcva("text-body-sm text-on-surface-variant");
export const dropdownItemShortcut = rcva("text-label-md text-on-surface-variant");
export const dropdownSeparator = rcva("my-1 h-px bg-outline-variant");

/** The floating panel (`dropdown-content`). Combine with `dropdownPanel` for its look. */
/** Above everything in the page layer (indicator badges are `z-1` too and would paint over a later-opened panel). */
export const dropdownContent = rcva("dropdown-content z-50");

/** Look of the panel, as in the daisyUI examples. */
/**
 * Always frosted glass (src/styles/theme.css): a panel floats above the page, and everything that
 * floats is glass (AGENTS.md, "Glass is for the floating layer only"). There's no solid option.
 * Nested corners inside the panel (its menu items) follow its own: `rounded-inner`.
 */
export const dropdownPanel = rcva(
  "liquid-glass [--outer-radius:var(--radius-box)] [--outer-padding:var(--space-100)]",
  {
    variants: {
      /** `menu` for item lists; `card` for free content (the docs' "Card as dropdown"). */
      kind: {
        menu: "menu",
        card: "card card-sm",
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
      /** M3 elevation: menus rest at +2 (the default); +3 for pickers that hold a task (date, search). */
      elevation: {
        "1": "shadow-elevation-1",
        "2": "shadow-elevation-2",
        "3": "shadow-elevation-3",
      },
      /** Gap between trigger and panel (the docs' navbar dropdown uses `mt-4`). */
      offset: {
        "1": "mt-1",
        "2": "mt-2",
        "4": "mt-4",
      },
    },
  },
);

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

/**
 * A menu item (M3 menus; Apple menus): a command, or an option that can be on (`checked`, shown
 * with a check, announced as a checkbox item). Group related items and put a `separator` between
 * groups; put a destructive command last, marked `destructive` (error ink), and confirm it before
 * acting. End a label with "…" when the command asks for more before it runs (Apple).
 */
export interface DropdownItem {
  label: Renderable;
  href?: string;
  value?: string;
  disabled?: boolean;
  /** A leading icon (use them for all items of a group, or none). */
  icon?: IconName;
  /** An option that's on (a check at the end; `menuitemcheckbox`). `false` = an option that's off. */
  checked?: boolean;
  /** Deletes or discards something: error ink. */
  destructive?: boolean;
  /** A keyboard shortcut hint, shown at the end ("Ctrl+D"). */
  shortcut?: string;
  /** A line under the label. */
  description?: Renderable;
  /** A divider before this item, starting a new group. */
  separator?: boolean;
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
  menu: { kind: "menu", rounded: true, width: "52", padding: "2", elevation: "2" },
  card: { kind: "card", width: "64", elevation: "2" },
  plain: {},
};

/**
 * @example
 * <ui-dropdown label="Click" align="end"
 *   .items=${[{ label: "Item 1" }, { label: "Docs", href: "/docs" }]}
 *   @ui-select=${(e) => console.log(e.detail.item)}></ui-dropdown>
 * @example
 * <ui-dropdown label="Dropdown" align="end" trigger-variant="ghost" trigger-rounded="field"
 *   trigger-spaced="false" panel-offset="4" .items=${items}></ui-dropdown>
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
  /** The trigger's accessible name and tooltip, for an icon-only trigger (`slot="trigger"`). */
  @property({ attribute: "trigger-label" }) triggerLabel?: string;
  /** Built-in icon as the trigger (e.g. the docs' helper `info` icon). */
  @property({ attribute: "trigger-icon" }) triggerIcon?: keyof typeof dropdownIcons;
  /** Trigger look: `button` variants plus spacing / rounding / text tone. */
  @property({ attribute: "trigger-color" }) triggerColor: ButtonVariants["color"];
  @property({ attribute: "trigger-variant" }) triggerVariant: ButtonVariants["variant"];
  @property({ attribute: "trigger-size" }) triggerSize: ButtonVariants["size"];
  /** An icon-only trigger: an icon button of this shape (`round`, `square`). */
  @property({ attribute: "trigger-shape" }) triggerShape: IconButtonVariants["shape"];
  @property({ attribute: "trigger-spaced", converter: responsiveBoolean }) triggerSpaced: Responsive<boolean> = true;
  @property({ attribute: "trigger-rounded" }) triggerRounded: DropdownTriggerVariants["rounded"];
  @property({ attribute: "trigger-tone" }) triggerTone: DropdownTriggerVariants["tone"];

  /** Panel kind; `items` always render as a menu. */
  @property() panel: DropdownPanelKind = "menu";
  /** Card panel: title above the children. */
  @property() heading: Renderable = "";
  /** Override the panel kind's default look. */
  @property({ attribute: "panel-rounded", converter: responsiveBoolean }) panelRounded?: Responsive<boolean>;
  @property({ attribute: "panel-width" }) panelWidth: DropdownPanelVariants["width"];
  @property({ attribute: "panel-padding" }) panelPadding: DropdownPanelVariants["padding"];
  /** The panel's M3 elevation (default +2, as menus). */
  @property({ attribute: "panel-elevation" }) panelElevation: DropdownPanelVariants["elevation"];
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

  /** Choosing an item in a menu inside the panel (its `ui-select`) closes the dropdown. */
  #closeOnSelect = (e: Event) => {
    if (e.target !== this) this.hide();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("ui-select", this.#closeOnSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("ui-select", this.#closeOnSelect);
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

  /** Arrow keys, Home / End and type-ahead move between items; Escape closes back to the trigger. */
  private _menuKey(e: KeyboardEvent) {
    const items = [...this.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')];
    if (!items.length) return;
    const at = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (at + 1) % items.length;
    else if (e.key === "ArrowUp") next = (at - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === "Escape") {
      e.preventDefault();
      this.hide();
      this.querySelector<HTMLElement>("[data-trigger]")?.focus();
      return;
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      next = items.findIndex((el, i) => i > at && el.textContent?.trim().toLowerCase().startsWith(k));
      if (next < 0) next = items.findIndex((el) => el.textContent?.trim().toLowerCase().startsWith(k));
    }
    if (next < 0) return;
    e.preventDefault();
    items[next]!.focus();
  }

  /** On opening a menu, focus goes to its first item (M3). */
  private _focusFirst() {
    requestAnimationFrame(() =>
      this.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')?.focus(),
    );
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

  /** The menu's accessible name: the trigger's label. */
  private get _menuName() {
    return this.triggerLabel ?? (typeof this.label === "string" ? this.label : undefined);
  }

  private get _kind(): DropdownPanelKind {
    return this.items.length ? "menu" : this.panel;
  }

  /** Panel look: the kind's defaults, overridden by the panel-* props. */
  private _look(popover = false) {
    const d = PANEL_DEFAULTS[this._kind];
    return dropdownPanel({
      kind: d.kind,
      rounded: this.panelRounded ?? d.rounded,
      width: this.panelWidth ?? d.width,
      // The docs' popover menu has no padding.
      padding: this.panelPadding ?? (popover ? undefined : d.padding),
      elevation: this.panelElevation ?? d.elevation,
      offset: this.panelOffset,
    });
  }

  private _triggerCls() {
    const trigger = dropdownTrigger({
      spaced: isOn(this.triggerSpaced) ? this.triggerSpaced : false,
      rounded: this.triggerRounded,
      tone: this.triggerTone,
    });
    if (this.triggerShape)
      return iconButton({
        variant:
          this.triggerVariant === "tonal" ? "tonal" : this.triggerVariant === "outlined" ? "outlined" : "standard",
        size: this.triggerSize,
        shape: this.triggerShape,
        class: trigger,
      });
    return button({
      color: this.triggerColor,
      variant: this.triggerVariant,
      size: this.triggerSize,
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
      // No tabindex: in popover mode this body is the `.dropdown`'s first child, and daisyUI's
      // "click the trigger again to close" rule (`.dropdown:focus-within > [tabindex]:first-child
      // { pointer-events: none }`) would make the whole card unclickable once focus is inside it.
      return html`<div class=${dropdownCardBody()}>
        ${this.heading ? html`<h2 class=${dropdownCardTitle()}>${this.heading}</h2>` : nothing} ${this.slotted()}
      </div>`;
    }
    return this.items.map(
      (item, i) =>
        html`${item.separator && i > 0 ? html`<li role="separator" class=${dropdownSeparator()}></li>` : nothing}
          <li role="none" class=${item.disabled ? "menu-disabled" : ""}>
            <a
              href=${ifDefined(item.href)}
              tabindex="-1"
              role=${item.checked === undefined ? "menuitem" : "menuitemcheckbox"}
              aria-checked=${ifDefined(item.checked === undefined ? undefined : String(item.checked))}
              aria-disabled=${ifDefined(item.disabled ? "true" : undefined)}
              class=${dropdownItem({ destructive: !!item.destructive })}
              @click=${(e: Event) => this._select(item, i, e)}
              @keydown=${(e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && !item.href && this._select(item, i, e)}
            >
              ${item.icon ? iconSvg(item.icon, { size: "sm" }) : nothing}
              <span class=${dropdownItemText()}
                >${item.label}${item.description ? html`<span class=${dropdownItemDescription()}>${item.description}</span>` : nothing}</span
              >
              ${item.shortcut ? html`<kbd class=${dropdownItemShortcut()}>${item.shortcut}</kbd>` : nothing}
              ${item.checked ? iconSvg("check", { size: "sm" }) : nothing}
            </a>
          </li>`,
    );
  }

  render() {
    const variants = { side: this.side, align: this.align, hover: this.hover, force: this.force };
    const isMenu = this._kind === "menu";
    const panelCls = dropdownContent({ class: this._look() });
    const panelTag = (cls: string) =>
      isMenu
        ? html`<ul
            tabindex="-1"
            class=${cls}
            role="menu"
            aria-label=${ifDefined(this._menuName)}
            @keydown=${this._menuKey}
          >
            ${this._panelBody()}
          </ul>`
        : html`<div tabindex="0" class=${cls}>${this._panelBody()}</div>`;

    if (this.mode === "details") {
      return html`<details
        class=${dropdown(variants)}
        ?open=${this.open}
        @toggle=${(e: Event) => (this.open = (e.target as HTMLDetailsElement).open)}
      >
        <summary
          data-trigger
          class=${this._triggerCls()}
          aria-label=${ifDefined(this.triggerLabel)}
          title=${ifDefined(this.triggerLabel)}
        >
          ${this._trig()}
        </summary>
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
          aria-label=${ifDefined(this.triggerLabel)}
          title=${ifDefined(this.triggerLabel)}
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
            ? html`<ul
                class=${popCls}
                popover
                id=${this._id}
                style="position-anchor:${anchor}"
                role="menu"
                aria-label=${ifDefined(this._menuName)}
                @toggle=${(e: ToggleEvent) => {
                  onToggle(e);
                  if (e.newState === "open") this._focusFirst();
                }}
                @keydown=${this._menuKey}
              >
                ${this._panelBody()}
              </ul>`
            : html`<div class=${popCls} popover id=${this._id} style="position-anchor:${anchor}" @toggle=${onToggle}>
                ${this._panelBody()}
              </div>`
        }`;
    }

    return html`<div class=${dropdown(variants)}>
      <div
        data-trigger
        tabindex="0"
        role="button"
        class=${this._triggerCls()}
        aria-haspopup="menu"
        aria-label=${ifDefined(this.triggerLabel)}
        title=${ifDefined(this.triggerLabel)}
      >
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
