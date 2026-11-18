import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";

/**
 * Tabs: Shows a list of links in a tabbed format.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/tab/
 *
 * Horizontal scroll when there's no room (docs): `scroll-area="xs"` (the max width
 * of the scroll area). Custom active color (docs): `active-color="primary"`.
 */
export const tabs = rcva("tabs", {
  variants: {
    variant: {
      box: "tabs-box",
      border: "tabs-border",
      lift: "tabs-lift",
    },
    size: {
      xs: "tabs-xs",
      sm: "tabs-sm",
      md: "tabs-md",
      lg: "tabs-lg",
      xl: "tabs-xl",
    },
    placement: {
      top: "tabs-top",
      bottom: "tabs-bottom",
    },
    /** Keep tabs on one line inside a scroll area. */
    scroll: { true: "min-w-max" },
  },
});

/** Scroll area around the tabs (docs "horizontal scroll when there's no space"). */
export const tabsScroll = rcva("overflow-x-auto", {
  variants: {
    width: { xs: "max-w-60", sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", full: "max-w-full" },
  },
});

/** A single tab (button, link, radio input or label wrapping a radio). */
export const tabsTab = rcva("tab [&>svg]:me-2 [&>svg]:size-4", {
  variants: {
    active: { true: "tab-active" },
    disabled: { true: "tab-disabled" },
    /** Above the sticky panels in a scroll area. */
    scroll: { true: "z-1" },
    /** Active tab colors (docs "Tabs with custom color"). */
    activeColor: {
      primary:
        "[&.tab-active,&:checked]:text-primary-content [--tab-bg:var(--color-primary)] [--tab-border-color:var(--color-primary)]",
      secondary:
        "[&.tab-active,&:checked]:text-secondary-content [--tab-bg:var(--color-secondary)] [--tab-border-color:var(--color-secondary)]",
      accent:
        "[&.tab-active,&:checked]:text-accent-content [--tab-bg:var(--color-accent)] [--tab-border-color:var(--color-accent)]",
      neutral:
        "[&.tab-active,&:checked]:text-neutral-content [--tab-bg:var(--color-neutral)] [--tab-border-color:var(--color-neutral)]",
    },
  },
});

/** Panel that must come immediately after its (radio) tab. */
export const tabsContent = rcva("tab-content");

/** Panel look from the docs examples. */
export const tabsPanel = rcva("", {
  variants: {
    surface: { true: "bg-base-100 border-base-300" },
    padding: { md: "p-6", lg: "p-10", none: "" },
    /** Stays in view inside a horizontally scrolling tabs area. */
    scroll: {
      xs: "sticky start-0 max-w-60",
      sm: "sticky start-0 max-w-sm",
      md: "sticky start-0 max-w-md",
      lg: "sticky start-0 max-w-lg",
      full: "sticky start-0 max-w-full",
    },
  },
  defaultVariants: { surface: true, padding: "md" },
});

export type TabsVariants = VariantProps<typeof tabs>;
export type TabsTabVariants = VariantProps<typeof tabsTab>;
export type TabsPanelVariants = VariantProps<typeof tabsPanel>;
export type TabsScrollVariants = VariantProps<typeof tabsScroll>;

export interface TabItem {
  label: Renderable;
  /** Panel content. */
  content?: Renderable;
  icon?: Renderable;
  disabled?: boolean;
  href?: string;
}

/**
 * - `tabs`: `role="tablist"` of buttons/links with `tab-active`; the active
 *   item's content (if any) is shown in a `role="tabpanel"` below. Arrow keys,
 *   Home and End move between tabs.
 * - `radio`: CSS-only radio tabs, each followed by its `tab-content` panel
 *   (the daisyUI "radio tabs + tab content" examples). Works without JS state
 *   and takes part in forms via `name`.
 */
export type TabsMode = "tabs" | "radio";

/**
 * @example
 * <ui-tabs variant="lift" mode="radio" .items=${[
 *   { label: "Tab 1", content: "Tab content 1" },
 *   { label: "Tab 2", content: "Tab content 2" },
 * ]} active="1"></ui-tabs>
 *
 * Without `items`, authored children are rendered inside `.tabs`.
 * Fires `ui-change` with `{ index, item }`.
 */
@customElement("ui-tabs")
export class UiTabs extends LightElement {
  @property({ attribute: false }) items: TabItem[] = [];
  @property({ type: Number, reflect: true }) active = 0;
  @property() mode: TabsMode = "tabs";
  @property() variant: TabsVariants["variant"];
  @property() size: TabsVariants["size"];
  @property() placement: TabsVariants["placement"];
  /** Radio group name (radio mode). */
  @property() name = uid("tabs");
  /** Panel padding (`lg` = docs tabs-box example). */
  @property() padding: TabsPanelVariants["padding"] = "md";
  /** Panel background + border (docs default). */
  @property({ converter: booleanAttribute }) surface = true;
  /** Scroll horizontally inside an area of this max width (radio mode). */
  @property({ attribute: "scroll-area" }) scrollArea: TabsScrollVariants["width"];
  @property({ attribute: "active-color" }) activeColor: TabsTabVariants["activeColor"];
  @property() label?: string;

  private _id = uid("tab");

  select(index: number) {
    const item = this.items[index];
    if (!item || item.disabled || index === this.active) return;
    this.active = index;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index, item }, bubbles: true }));
  }

  private _onKey(e: KeyboardEvent) {
    const enabled = this.items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
    if (!enabled.length) return;
    const pos = enabled.indexOf(this.active);
    let next: number | undefined;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    this.select(next);
    void this.updateComplete.then(() => this.querySelector<HTMLElement>(`#${this._id}-${next}`)?.focus());
  }

  private _list() {
    return tabs({ variant: this.variant, size: this.size, placement: this.placement, scroll: !!this.scrollArea });
  }

  private _panel() {
    return tabsPanel({ surface: this.surface, padding: this.padding, scroll: this.scrollArea });
  }

  private _renderTabs() {
    const activeItem = this.items[this.active];
    const list = html`<div
      role="tablist"
      aria-label=${ifDefined(this.label)}
      class=${this._list()}
      @keydown=${this._onKey}
    >
      ${this.items.map((item, i) => {
        const on = i === this.active;
        const cls = tabsTab({ active: on, disabled: item.disabled, activeColor: this.activeColor });
        const common = { id: `${this._id}-${i}`, panel: `${this._id}-panel` };
        return item.href
          ? html`<a
              role="tab"
              id=${common.id}
              class=${cls}
              href=${item.href}
              aria-selected=${on ? "true" : "false"}
              aria-disabled=${ifDefined(item.disabled ? "true" : undefined)}
              tabindex=${on ? "0" : "-1"}
              @click=${() => this.select(i)}
              >${item.icon ?? nothing}${item.label}</a
            >`
          : html`<button
              type="button"
              role="tab"
              id=${common.id}
              class=${cls}
              aria-selected=${on ? "true" : "false"}
              aria-controls=${ifDefined(activeItem?.content != null ? common.panel : undefined)}
              ?disabled=${!!item.disabled}
              tabindex=${on ? "0" : "-1"}
              @click=${() => this.select(i)}
            >
              ${item.icon ?? nothing}${item.label}
            </button>`;
      })}
    </div>`;
    const panel =
      activeItem?.content != null
        ? html`<div
            role="tabpanel"
            id="${this._id}-panel"
            aria-labelledby="${this._id}-${this.active}"
            class=${this._panel()}
          >
            ${activeItem.content}
          </div>`
        : nothing;
    return this.placement === "bottom" ? html`${panel}${list}` : html`${list}${panel}`;
  }

  private _renderRadio() {
    const tabCls = (disabled?: boolean) =>
      tabsTab({ disabled, scroll: !!this.scrollArea, activeColor: this.activeColor });
    const list = html`<div class=${this._list()}>
      ${this.items.map((item, i) => {
        const input = (cls: string) =>
          html`<input
            type="radio"
            name=${this.name}
            class=${cls}
            aria-label=${ifDefined(!item.icon && typeof item.label === "string" ? item.label : undefined)}
            ?checked=${i === this.active}
            ?disabled=${!!item.disabled}
            @change=${() => this.select(i)}
          />`;
        const tab = item.icon
          ? html`<label class=${tabCls(item.disabled)}>${input("")}${item.icon}${item.label}</label>`
          : input(tabCls(item.disabled));
        return html`${tab}${
          item.content != null
            ? html`<div class=${tabsContent({ class: this._panel() })}>${item.content}</div>`
            : nothing
        }`;
      })}
    </div>`;
    return this.scrollArea ? html`<div class=${tabsScroll({ width: this.scrollArea })}>${list}</div>` : list;
  }

  render() {
    if (!this.items.length) {
      return html`<div role="tablist" class=${this._list()}>${this.content}</div>`;
    }
    return this.mode === "radio" ? this._renderRadio() : this._renderTabs();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-tabs": UiTabs;
  }
}
