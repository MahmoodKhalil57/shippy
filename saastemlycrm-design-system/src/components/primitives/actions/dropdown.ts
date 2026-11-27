import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { atWidth, floating as float, placementOf } from "../../base/floating.ts";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { isOn, rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";
import { floating, floatingHeight, floatMotion, row, stack, text } from "../../../styles/algebra.ts";
import { button, type ButtonVariants } from "./button.ts";
import { iconButton, type IconButtonVariants } from "./icon-button.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";

export type DropdownSide = "top" | "bottom" | "left" | "right";
export type DropdownAlign = "start" | "center" | "end";

export const dropdownItem = rcva(`${row} items-center gap-3`, {
  variants: { destructive: { true: "text-error-ink" } },
});
export const dropdownItemText = rcva(`${stack} min-w-0 flex-1`);
export const dropdownItemDescription = rcva(`${text.label} text-body-sm text-on-surface-variant`);
export const dropdownItemShortcut = rcva("text-label-md text-on-surface-variant");
export const dropdownSeparator = rcva("my-1 h-px bg-outline-variant");

export const dropdownContent = rcva(floatMotion);

export const dropdownPanel = rcva(
  "liquid-glass [--outer-radius:var(--radius-box)] [--outer-padding:var(--space-100)]",
  {
    variants: {
      kind: {
        menu: "menu",
        card: "card card-sm",
      },
      rounded: { true: "rounded-box" },
      width: {
        "4": `${floating["4"]} max-w-none`,
        "5": `${floating["5"]} max-w-none`,
        "6": `${floating["6"]} max-w-none`,
      },
      height: { fit: floatingHeight.fit },
      padding: {
        "0": "p-0",
        "2": "py-2",
        "4": "px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      },
      elevation: {
        "1": "shadow-elevation-1",
        "2": "shadow-elevation-2",
        "3": "shadow-elevation-3",
      },
      offset: { "1": "", "2": "", "4": "" },
    },
  },
);

export const dropdownCardBody = rcva("card-body");
export const dropdownCardTitle = rcva("card-title");

export const dropdownTrigger = rcva("[&>svg]:h-4 [&>svg]:w-4", {
  variants: {
    spaced: { true: "m-1" },
    rounded: { field: "rounded-field" },
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

export const dropdownIcon = rcva("h-4 w-4 stroke-current");

export const dropdownIcons = {
  info: () => iconSvg("info", {}, { label: m.dropdown_more_info(), class: dropdownIcon() }),
} as const;

export type DropdownPanelVariants = VariantProps<typeof dropdownPanel>;
export type DropdownTriggerVariants = VariantProps<typeof dropdownTrigger>;

export type DropdownPanelKind = "menu" | "card" | "plain";

export interface DropdownItem {
  label: Renderable;
  href?: string;
  value?: string;
  disabled?: boolean;
  icon?: IconName;
  checked?: boolean;
  destructive?: boolean;
  shortcut?: string;
  description?: Renderable;
  separator?: boolean;
}

export type DropdownMode = "focus" | "details" | "popover";

const PANEL_DEFAULTS: Record<DropdownPanelKind, DropdownPanelVariants> = {
  menu: { kind: "menu", rounded: true, width: "4", height: "fit", padding: "2", elevation: "2" },
  card: { kind: "card", width: "5", height: "fit", elevation: "2" },
  plain: {},
};

@customElement("ui-dropdown")
export class UiDropdown extends LightElement {
  @property() side?: string;
  @property() align?: string;
  @property({ type: Boolean }) hover = false;
  @property() force?: "open" | "close";
  @property() mode: DropdownMode = "focus";

  @property() label: Renderable = "";
  @property({ attribute: "trigger-label" }) triggerLabel?: string;
  @property({ attribute: "trigger-icon" }) triggerIcon?: keyof typeof dropdownIcons;
  @property({ attribute: "trigger-color" }) triggerColor: ButtonVariants["color"];
  @property({ attribute: "trigger-variant" }) triggerVariant: ButtonVariants["variant"];
  @property({ attribute: "trigger-size" }) triggerSize: ButtonVariants["size"];
  @property({ attribute: "trigger-shape" }) triggerShape: IconButtonVariants["shape"];
  @property({ attribute: "trigger-spaced", converter: responsiveBoolean }) triggerSpaced: Responsive<boolean> = true;
  @property({ attribute: "trigger-rounded" }) triggerRounded: DropdownTriggerVariants["rounded"];
  @property({ attribute: "trigger-tone" }) triggerTone: DropdownTriggerVariants["tone"];

  @property() panel: DropdownPanelKind = "menu";
  @property() heading: Renderable = "";
  @property({ attribute: "panel-rounded", converter: responsiveBoolean }) panelRounded?: Responsive<boolean>;
  @property({ attribute: "panel-width" }) panelWidth: DropdownPanelVariants["width"];
  @property({ attribute: "panel-padding" }) panelPadding: DropdownPanelVariants["padding"];
  @property({ attribute: "panel-elevation" }) panelElevation: DropdownPanelVariants["elevation"];
  @property({ attribute: "panel-offset" }) panelOffset: DropdownPanelVariants["offset"];

  @property({ attribute: false }) items: DropdownItem[] = [];
  @property({ type: Boolean, reflect: true }) open = false;
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
    if (changed.has("force") && this.force) {
      if (this.force === "open") this.show();
      else this.hide();
      return;
    }
    if (!changed.has("open")) return;
    const shown = !!this._popover?.matches(":popover-open");
    if (this.open && !shown) this.show();
    else if (!this.open && shown) this.hide();
  }

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

  private _focusFirst() {
    requestAnimationFrame(() =>
      this.querySelector<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])')?.focus(),
    );
  }

  private _selectKey(item: DropdownItem, index: number, e: KeyboardEvent) {
    if ((e.key !== "Enter" && e.key !== " ") || item.href) return;
    e.preventDefault();
    this._select(item, index, e);
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
    return this.triggerIcon ? html`${dropdownIcons[this.triggerIcon]()}${this.label}` : this.label;
  }

  private get _menuName() {
    return this.triggerLabel ?? (typeof this.label === "string" && this.label ? this.label : undefined);
  }

  private get _triggerName() {
    return this.triggerLabel ?? (this.hasSlotted("trigger") ? this._menuName : undefined);
  }

  private get _kind(): DropdownPanelKind {
    return this.items.length ? "menu" : this.panel;
  }

  private _look(popover = false) {
    const d = PANEL_DEFAULTS[this._kind];
    return dropdownPanel({
      kind: d.kind,
      rounded: this.panelRounded ?? d.rounded,
      width: this.panelWidth ?? d.width,
      height: d.height,
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
      return html`<div class=${dropdownCardBody()}>
        ${this.heading ? html`<h2 class=${dropdownCardTitle()}>${this.heading}</h2>` : nothing} ${this.slotted()}
      </div>`;
    }
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
              @keydown=${(e: KeyboardEvent) => this._selectKey(item, i, e)}
            >
              ${item.icon ? iconSvg(item.icon, { size: "sm" }) : nothing}
              <span class=${dropdownItemText()}
                >${item.label}${item.description ? html`<span class=${dropdownItemDescription()}>${item.description}</span>` : nothing}</span
              >
              ${item.shortcut ? html`<kbd class=${dropdownItemShortcut()} dir="ltr">${item.shortcut}</kbd>` : nothing}
              ${item.checked ? iconSvg("check", { size: "sm" }) : nothing}
            </a>
          </li>`,
    );
  }

  render() {
    const isMenu = this._kind === "menu";
    const look = dropdownContent({ class: this._look(this.mode === "popover") });
    const onToggle = (e: ToggleEvent) => {
      this.open = (e.currentTarget as HTMLElement).matches(":popover-open");
      if (this.open && isMenu) this._focusFirst();
    };
    const place = float({
      placement: placementOf(this.side, this.align),
      gap: this.hover
        ? 0
        : (({ "2": 8, "4": 16 } as Record<string, number>)[atWidth(this.panelOffset as string | undefined) ?? ""] ?? 4),
    });
    return html`<button
        data-trigger
        type="button"
        aria-label=${ifDefined(this._triggerName)}
        title=${ifDefined(this._triggerName)}
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
