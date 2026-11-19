import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button, type ButtonVariants } from "./button.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * FAB / Speed Dial: Floating button in a bottom corner that reveals extra
 * buttons when activated.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/fab/
 *
 * Icons inside (bare `<svg>` content) get the docs' `size-6`.
 */
export const fab = rcva("fab [&_svg]:size-6", {
  variants: {
    /** Open in a quarter circle instead of a vertical stack (max 4 actions). */
    flower: { true: "fab-flower" },
  },
});

/**
 * A speed-dial action's text label: a glass pill (src/styles/theme.css), so it reads on any
 * background the FAB opens over.
 */
export const fabLabel = rcva(
  "liquid-glass rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-base-content",
);

/** Replaces the trigger with a close button while open (visual only, not focusable). */
export const fabClose = rcva("fab-close");
/** Replaces the trigger with a main action button while open. */
export const fabMainAction = rcva("fab-main-action");
/** Tooltip around a flower action (no room for text labels in a quarter circle). */
export const fabTooltip = rcva("tooltip", {
  variants: {
    left: { true: "tooltip-left" },
  },
});

/**
 * `panel` mode: the button opens a floating glass panel above it (an assistant, a help chat) that
 * stays open while the page is used, until closed. Header (title + close), a scrolling body
 * (the children), and a footer (`slot="footer"`, e.g. a message box).
 */
export const fabDock = rcva(
  "fixed end-4 bottom-4 z-[60] flex flex-col items-end gap-3 pointer-events-none [&>*]:pointer-events-auto",
);
/** Closed, the panel stays mounted but hidden, so its content (a conversation) never lands in the page. */
export const fabPanel = rcva(
  "liquid-glass flex h-[min(38rem,calc(100dvh-7rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-box origin-bottom-right transition-[opacity,scale] duration-(--duration-effects) ease-effects starting:scale-95 starting:opacity-0 motion-reduce:transition-none",
  { variants: { hidden: { true: "hidden" } } },
);
export const fabPanelHead = rcva("flex shrink-0 items-center gap-2 border-b border-base-content/10 px-4 py-2.5");
export const fabPanelTitle = rcva("min-w-0 flex-1 truncate text-sm font-semibold");
export const fabPanelBody = rcva(
  "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-3 [--scrollbar-inset:var(--radius-box)]",
);
export const fabPanelFooter = rcva("shrink-0 border-t border-base-content/10 px-3 py-2.5");

export type FabVariants = VariantProps<typeof fab>;

export interface FabAction {
  /** Button content (letter, icon…). */
  content: Renderable;
  /** Text label beside the button (vertical) or tooltip text (flower). */
  label?: string;
  /** Accessible name when `content` is an icon. */
  ariaLabel?: string;
  color?: ButtonVariants["color"];
  href?: string;
  disabled?: boolean;
}

/**
 * @example
 * <ui-fab trigger="F" color="primary"
 *   .actions=${[{ content: "A", label: "Label A" }, { content: "B", label: "Label B" }]}
 *   close="Close" @ui-select=${(e) => …}></ui-fab>
 * @example <ui-fab flower trigger="F" .mainAction=${{ content: "M" }} .actions=${[…]}></ui-fab>
 * @example <ui-fab trigger="+"></ui-fab>   <!-- single FAB, no speed dial -->
 * @example <ui-fab circle="false" trigger="F" .actions=${[…]}></ui-fab>   <!-- rectangle buttons -->
 *
 * The trigger can be rich markup via `slot="trigger"`. Without `actions`, the
 * authored children are rendered as the speed-dial items. `ui-select`
 * (detail: { action, index }) fires on click; `mainAction` click fires `ui-main`.
 *
 * @example
 * <ui-fab panel heading="Assistant" trigger-label="Open the assistant" .open=${open}
 *   @ui-toggle=${(e) => (open = e.detail.open)}>
 *   <ui-icon slot="trigger" name="sparkles"></ui-icon>
 *   …messages…
 *   <ui-flex slot="footer">…message box…</ui-flex>
 * </ui-fab>
 *
 * `panel`: the button toggles a floating panel (`open`; `ui-toggle` with { open } on change). The
 * body scrolls; a conversation inside (`<ui-message-scroller>`) fills it and scrolls itself.
 */
@customElement("ui-fab")
export class UiFab extends LightElement {
  @property({ converter: responsiveBoolean }) flower: Responsive<boolean> = false;

  @property() trigger: Renderable = "";
  @property({ attribute: "trigger-label" }) triggerLabel?: string;
  @property() color: ButtonVariants["color"] = "primary";
  @property() size: ButtonVariants["size"] = "lg";
  /** Round action buttons (default). `circle="false"` for rectangular ones. */
  @property({ converter: booleanAttribute }) circle = true;
  @property({ attribute: false }) actions: FabAction[] = [];
  /** Text for a `fab-close` replacement while open (true = no text). */
  @property() close: string | boolean = false;
  @property({ attribute: false }) mainAction?: FabAction;
  /** Panel mode: the button opens a floating panel (see `fabPanel`). */
  @property({ type: Boolean }) panel = false;
  /** Panel mode: whether the panel is open. */
  @property({ type: Boolean, reflect: true }) open = false;
  /** Panel mode: the panel's title. */
  @property() heading: Renderable = "";

  private _toggle(open = !this.open) {
    this.open = open;
    this.dispatchEvent(new CustomEvent("ui-toggle", { detail: { open }, bubbles: true }));
  }

  private _renderPanel() {
    const trigger = this.hasSlotted("trigger") ? this.slotted("trigger") : this.trigger;
    return html`<div class=${fabDock()}>
      <section class=${fabPanel({ hidden: !this.open })} role="dialog" aria-label=${ifDefined(this.triggerLabel)}>
        <header class=${fabPanelHead()}>
          <span class=${fabPanelTitle()}>${this.heading}</span>
          <button
            type="button"
            class=${button({ variant: "ghost", size: "sm", shape: "circle" })}
            aria-label="Close"
            @click=${() => this._toggle(false)}
          >
            ${iconSvg("x", { size: "sm" })}
          </button>
        </header>
        <div class=${fabPanelBody()}>${this.slotted()}</div>
        ${this.hasSlotted("footer") ? html`<footer class=${fabPanelFooter()}>${this.slotted("footer")}</footer>` : nothing}
      </section>
      <button
        type="button"
        class=${button({ size: this.size, color: this.color, shape: "circle", class: "shadow-lg" })}
        aria-label=${ifDefined(this.triggerLabel)}
        aria-expanded=${this.open ? "true" : "false"}
        @click=${() => this._toggle()}
      >
        ${trigger}
      </button>
    </div>`;
  }

  private _btn(a: FabAction, onClick: () => void, extra = "") {
    const cls = button({
      size: this.size,
      color: a.color,
      shape: this.circle ? "circle" : undefined,
      class: extra,
    });
    return a.href
      ? html`<a class=${cls} href=${a.href} aria-label=${ifDefined(a.ariaLabel ?? a.label)} @click=${onClick}
          >${a.content}</a
        >`
      : html`<button
          class=${cls}
          type="button"
          ?disabled=${!!a.disabled}
          aria-label=${ifDefined(a.ariaLabel ?? a.label)}
          @click=${onClick}
        >
          ${a.content}
        </button>`;
  }

  private _fire(name: string, detail: object) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }

  // Items must stay direct children of `.fab` (it positions them with :nth-child).
  private _action(a: FabAction, i: number) {
    const onClick = () => this._fire("ui-select", { action: a, index: i });
    if (!a.label) return this._btn(a, onClick);
    if (isOn(this.flower)) {
      // No room for text in a quarter circle: labels become tooltips.
      return html`<div class=${fabTooltip({ left: i < 2 })} data-tip=${a.label}>${this._btn(a, onClick)}</div>`;
    }
    return html`<div><span class=${fabLabel()}>${a.label}</span> ${this._btn(a, onClick)}</div>`;
  }

  render() {
    if (this.panel) return this._renderPanel();
    const triggerContent = this.hasSlotted("trigger") ? this.slotted("trigger") : this.trigger;
    const triggerCls = button({ size: this.size, color: this.color, shape: "circle" });
    const items = this.actions.length ? this.actions.map((a, i) => this._action(a, i)) : this.slotted();
    const single = !this.actions.length && !this.hasContent && !this.mainAction;

    if (single) {
      return html`<div class=${fab({ flower: this.flower })}>
        <button
          class=${triggerCls}
          type="button"
          aria-label=${ifDefined(this.triggerLabel)}
          @click=${() => this._fire("ui-main", {})}
        >
          ${triggerContent}
        </button>
      </div>`;
    }

    const main = this.mainAction;
    return html`<div class=${fab({ flower: this.flower })}>
      <div
        tabindex="0"
        role="button"
        class=${triggerCls}
        aria-label=${ifDefined(this.triggerLabel)}
        aria-haspopup="menu"
      >
        ${triggerContent}
      </div>
      ${
        this.close !== false
          ? html`<div class=${fabClose()}>
              ${typeof this.close === "string" ? this.close : nothing}
              <span class=${button({ size: this.size, color: "error", shape: "circle" })}>✕</span>
            </div>`
          : nothing
      }
      ${
        main
          ? isOn(this.flower)
            ? this._btn(main, () => this._fire("ui-main", { action: main }), fabMainAction())
            : html`<div class=${fabMainAction()}>
                ${main.label ?? nothing}
                ${this._btn({ color: "secondary", ...main }, () => this._fire("ui-main", { action: main }))}
              </div>`
          : nothing
      }
      ${items}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-fab": UiFab;
  }
}
