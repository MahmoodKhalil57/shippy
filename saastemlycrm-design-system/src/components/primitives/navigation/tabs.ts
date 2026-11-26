import type { VariantProps } from "class-variance-authority";
import { scrollRoom } from "../../../styles/algebra.ts";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { booleanAttribute, rcva } from "../../../lib/base/variants.ts";
import { inlineStep } from "../../../lib/base/reading.ts";

export const tabs = rcva("tabs min-w-0 [overflow-wrap:anywhere] [&>.tab:not(.tab-active)]:text-on-surface-variant", {
  variants: {
    variant: {
      primary: "tabs-border [&>.tab]:text-title-sm",
      secondary: "tabs-border [&>.tab]:text-label-lg",
    },
    size: {
      sm: "tabs-sm",
      md: "tabs-md",
    },
    scroll: { true: "" },
  },
});

export const tabsScroll = rcva(`overflow-x-auto ${scrollRoom}`, {
  variants: {
    width: { xs: "max-w-60", sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", full: "max-w-full" },
  },
});

export const tabsTab = rcva("tab gap-2 [&>svg]:size-4", {
  variants: {
    active: { true: "tab-active" },
    disabled: { true: "tab-disabled" },
    scroll: { true: "z-1" },
    activeColor: {
      primary: "[&.tab-active,&:checked]:text-primary-ink",
    },
  },
});

export const tabsContent = rcva("tab-content");

export const tabsPanel = rcva("", {
  variants: {
    surface: { true: "bg-surface border-outline-variant" },
    padding: {
      md: "w-full px-[min(24px,max(0px,calc((100%_-_7rem)/2)))] py-6",
      lg: "w-full px-[min(40px,max(0px,calc((100%_-_7rem)/2)))] py-10",
      top: "w-full pt-5",
      none: "",
    },
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
  content?: Renderable;
  icon?: Renderable;
  disabled?: boolean;
  href?: string;
}

export type TabsMode = "tabs" | "radio";

@customElement("ui-tabs")
export class UiTabs extends LightElement {
  @property({ attribute: false }) items: TabItem[] = [];
  @property({ type: Number, reflect: true }) active = 0;
  @property() mode: TabsMode = "tabs";
  @property() variant: TabsVariants["variant"];
  @property() size: TabsVariants["size"];
  @property() name = uid("tabs");
  @property() padding: TabsPanelVariants["padding"] = "md";
  @property({ converter: booleanAttribute }) surface = true;
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
    const step = inlineStep(e.key, this);
    if (step) next = enabled[(pos + step + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    this.select(next);
    void this.updateComplete.then(() => this.querySelector<HTMLElement>(`#${this._id}-${next}`)?.focus());
  }

  private _list() {
    return tabs({ variant: this.variant ?? "primary", size: this.size, scroll: !!this.scrollArea });
  }

  private _panel(inScroll = true) {
    return tabsPanel({ surface: this.surface, padding: this.padding, scroll: inScroll ? this.scrollArea : undefined });
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
        const cls = tabsTab({ active: on, disabled: item.disabled, activeColor: this.activeColor ?? "primary" });
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
            class=${this._panel(false)}
          >
            ${activeItem.content}
          </div>`
        : nothing;
    const scroller = this.scrollArea ? html`<div class=${tabsScroll({ width: this.scrollArea })}>${list}</div>` : list;
    return html`${scroller}${panel}`;
  }

  private _renderRadio() {
    const tabCls = (disabled?: boolean) =>
      tabsTab({ disabled, scroll: !!this.scrollArea, activeColor: this.activeColor ?? "primary" });
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
