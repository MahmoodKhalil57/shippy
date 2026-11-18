import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute, isOn, rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { button, type ButtonVariants } from "./button.ts";

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
