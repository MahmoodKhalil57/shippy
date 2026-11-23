import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { atWidth, floating as float, placementOf } from "../../base/floating.ts";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { floating, floatingHeight, floatMotion, row, stack, text } from "../layout/algebra.ts";
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
/** Where the panel opens: a side and an alignment (responsive: `align="start md:end"`), for Floating UI. */
export type DropdownSide = "top" | "bottom" | "left" | "right";
export type DropdownAlign = "start" | "center" | "end";

/** A menu item's row: icon, label (and description), shortcut, check. */
export const dropdownItem = rcva(`${row} items-center gap-3`, {
  variants: { destructive: { true: "text-error-ink" } },
});
export const dropdownItemText = rcva(`${stack} min-w-0 flex-1`);
export const dropdownItemDescription = rcva(`${text.label} text-body-sm text-on-surface-variant`);
export const dropdownItemShortcut = rcva("text-label-md text-on-surface-variant");
export const dropdownSeparator = rcva("my-1 h-px bg-outline-variant");

/**
 * The floating panel: a popover in the top layer (above everything, clipped by nothing), placed by
 * Floating UI, coming and going with `floatMotion`. Combine with `dropdownPanel` for its look.
 */
export const dropdownContent = rcva(floatMotion);

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
      /**
       * Whole tiles (`floating.*`): 4 (212px, a menu), 5 (a card), 6. Never wider than the window's
       * whole tiles; `max-w-none` lifts daisyUI's menu `max-width: 100%` (of the trigger).
       */
      width: {
        "4": `${floating["4"]} max-w-none`,
        "5": `${floating["5"]} max-w-none`,
        "6": `${floating["6"]} max-w-none`,
      },
      /** Quarter tiles down: its content's height, rounded up. */
      height: { fit: floatingHeight.fit },
      padding: {
        "0": "p-0",
        // Inline: daisyUI's menu padding (0.5rem); a panel's own would be measured against its trigger.
        "2": "py-2",
        "4": "px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      },
      /** M3 elevation: menus rest at +2 (the default); +3 for pickers that hold a task (date, search). */
      elevation: {
        "1": "shadow-elevation-1",
        "2": "shadow-elevation-2",
        "3": "shadow-elevation-3",
      },
      /** Gap between trigger and panel, in Floating UI's `offset` (4, 8 or 16px; read by the dropdown). */
      offset: { "1": "", "2": "", "4": "" },
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
 * Every dropdown is one thing: a button and a popover panel (the Popover API: the top layer,
 * clipped by nothing; Escape and a click outside close it; focus goes back to the button), placed
 * by Floating UI at `side` / `align`, flipping and shifting to stay in the window. The button
 * toggles it with a click, Enter or Space; `hover` opens it on the pointer as well. A menu takes
 * focus on its first item and moves with the arrow keys, Home, End and type-ahead.
 *
 * `mode` only sets the panel's default padding: `popover` has none (the docs' popover menu);
 * `focus` and `details` (kept for the API) have the kind's own.
 */
export type DropdownMode = "focus" | "details" | "popover";

/** Panel look per kind, from the docs examples. */
const PANEL_DEFAULTS: Record<DropdownPanelKind, DropdownPanelVariants> = {
  menu: { kind: "menu", rounded: true, width: "4", height: "fit", padding: "2", elevation: "2" },
  card: { kind: "card", width: "5", height: "fit", elevation: "2" },
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
 * from JS. `side` / `align` are responsive (`align="start md:end"`).
 */
@customElement("ui-dropdown")
export class UiDropdown extends LightElement {
  /** The side it opens on (default bottom); responsive. */
  @property() side?: string;
  /** Its alignment along that side (default start); responsive. */
  @property() align?: string;
  /** Open on the pointer as well as on a click. */
  @property({ type: Boolean }) hover = false;
  /** Hold it open or closed, whatever the pointer and keys do. */
  @property() force?: "open" | "close";
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
  /**
   * A menu's items are built the first time it's about to open (the pointer reaches the trigger,
   * it takes focus, or the popover is about to show), not with the page: a screen of tiles has a
   * closed ⋯ menu on each, and building them all made every navigation lay out a third more
   * elements than anyone could see.
   */
  @state() private _built = false;
  #build = () => {
    if (!this._built) this._built = true;
  };

  private _id = uid("dropdown");

  @query("[popover]") private _popover?: HTMLElement;
  @query("[data-trigger]") private _trigger?: HTMLElement;

  show() {
    this.#build();
    if (!this._popover?.matches(":popover-open")) this._popover?.showPopover();
    this.open = true;
  }

  /** Choosing an item in a menu inside the panel (its `ui-select`) closes the dropdown. */
  #closeOnSelect = (e: Event) => {
    if (e.target !== this) this.hide();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("ui-select", this.#closeOnSelect);
    this.addEventListener("pointerover", this.#build);
    this.addEventListener("focusin", this.#build);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("ui-select", this.#closeOnSelect);
    this.removeEventListener("pointerover", this.#build);
    this.removeEventListener("focusin", this.#build);
  }

  hide() {
    if (this._popover?.matches(":popover-open")) this._popover.hidePopover();
    this.open = false;
  }

  toggle() {
    if (this.open) this.hide();
    else this.show();
  }

  /** `hover`: the pointer on the trigger opens it; leaving both the trigger and the panel closes it. */
  #enter = () => {
    if (this.hover) this.show();
  };
  #leave = (e: PointerEvent) => {
    if (!this.hover) return;
    const to = e.relatedTarget as Node | null;
    if (to && (this._trigger?.contains(to) || this._popover?.contains(to))) return;
    this.hide();
  };

  protected override updated(changed: Map<string, unknown>) {
    super.updated?.(changed);
    if (!changed.has("force") || !this.force) return;
    if (this.force === "open") this.show();
    else this.hide();
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
      height: d.height,
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
    // Not built yet (never about to open): nothing to lay out.
    if (!this._built && !this.open) return nothing;
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
    const isMenu = this._kind === "menu";
    const look = dropdownContent({ class: this._look(this.mode === "popover") });
    const onToggle = (e: ToggleEvent) => {
      this.open = e.newState === "open";
      if (this.open && isMenu) this._focusFirst();
    };
    // Where it opens (`side`, `align`, responsive) and how far off its trigger (`panel-offset`).
    const place = float({
      placement: placementOf(this.side, this.align),
      gap: this.hover
        ? 0
        : (({ "1": 4, "2": 8, "4": 16 } as Record<string, number>)[
            atWidth(this.panelOffset as string | undefined) ?? "1"
          ] ?? 4),
    });
    return html`<button
        data-trigger
        type="button"
        aria-label=${ifDefined(this.triggerLabel)}
        title=${ifDefined(this.triggerLabel)}
        class=${this._triggerCls()}
        popovertarget=${this._id}
        aria-haspopup=${isMenu ? "menu" : "dialog"}
        aria-expanded=${this.open ? "true" : "false"}
        @pointerenter=${this.#enter}
        @pointerleave=${this.#leave}
      >
        ${this._trig()}
      </button>
      ${
        isMenu
          ? html`<ul
              class=${look}
              popover
              id=${this._id}
              ${place}
              role="menu"
              aria-label=${ifDefined(this._menuName)}
              @beforetoggle=${(e: ToggleEvent) => e.newState === "open" && this.#build()}
              @toggle=${onToggle}
              @keydown=${this._menuKey}
              @pointerleave=${this.#leave}
            >
              ${this._panelBody()}
            </ul>`
          : html`<div
              class=${look}
              popover
              id=${this._id}
              ${place}
              role="dialog"
              aria-label=${ifDefined(this._menuName)}
              @beforetoggle=${(e: ToggleEvent) => e.newState === "open" && this.#build()}
              @toggle=${onToggle}
              @pointerleave=${this.#leave}
            >
              ${this._panelBody()}
            </div>`
      }`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-dropdown": UiDropdown;
  }
}
