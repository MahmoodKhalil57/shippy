import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { button, type ButtonVariants } from "./button.ts";

/**
 * Swap: Toggles visibility of two elements via a checkbox or class name.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/swap/
 *
 * Icons inside (bare `<svg>` content) use `fill-current`, as in the docs;
 * outline icons (`fill="none"`, e.g. from the icon primitive) keep their stroke.
 */
export const swap = rcva("swap [&_svg:not([fill=none])]:fill-current", {
  variants: {
    /** Transition effect between the two states. */
    variant: {
      rotate: "swap-rotate",
      flip: "swap-flip",
    },
    /** Class-driven mode: shows `swap-on` without a checkbox. */
    active: { true: "swap-active" },
    /** Text / emoji size (the docs use `text-6xl` and `text-9xl`). */
    textSize: {
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "4xl": "text-4xl",
      "6xl": "text-6xl",
      "9xl": "text-9xl",
    },
    /** Size of icons inside (the docs' sun / moon icons use `h-10 w-10`). */
    iconSize: {
      "6": "[&_svg]:h-6 [&_svg]:w-6",
      "8": "[&_svg]:h-8 [&_svg]:w-8",
      "10": "[&_svg]:h-10 [&_svg]:w-10",
      "12": "[&_svg]:h-12 [&_svg]:w-12",
    },
  },
});

/** Shown when checked / active. */
export const swapOn = rcva("swap-on");
/** Shown when unchecked / inactive. */
export const swapOff = rcva("swap-off");
/** Shown when the checkbox is indeterminate. */
export const swapIndeterminate = rcva("swap-indeterminate");

export type SwapVariants = VariantProps<typeof swap>;

/**
 * @example <ui-swap on="ON" off="OFF"></ui-swap>
 * @example
 * <ui-swap variant="rotate" button="circle">
 *   <svg slot="off" …>…hamburger…</svg>
 *   <svg slot="on" …>…close…</svg>
 * </ui-swap>
 * @example <ui-swap mode="class" active on="🥳" off="😭" text-size="6xl"></ui-swap>
 * @example <ui-swap variant="flip" on="😈" off="😇" text-size="9xl"></ui-swap>
 *
 * Content comes from `on` / `off` / `undecided` props or `slot="on" | "off" |
 * "indeterminate"` children. In `checkbox` mode (default) the hidden checkbox
 * drives the state and native `change` bubbles out; `checked` stays in sync.
 * In `class` mode toggle the `active` property from JS (or call `toggle()`).
 */
@customElement("ui-swap")
export class UiSwap extends LightElement {
  @property() variant: SwapVariants["variant"];
  @property({ attribute: "text-size" }) textSize: SwapVariants["textSize"];
  @property({ attribute: "icon-size" }) iconSize: SwapVariants["iconSize"];
  /** Render the swap as a button (`plain`, or with a shape: the docs' hamburger is `circle`). */
  @property() button: "none" | "plain" | "circle" | "square" = "none";
  @property({ attribute: "button-variant" }) buttonVariant: ButtonVariants["variant"];
  @property({ attribute: "button-color" }) buttonColor: ButtonVariants["color"];
  @property({ attribute: "button-size" }) buttonSize: ButtonVariants["size"];
  @property() mode: "checkbox" | "class" = "checkbox";
  /** Class mode state (toggled by `toggle()` / JS, so not responsive). */
  @property({ type: Boolean }) active = false;
  /** Checkbox mode state. */
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property() name?: string;
  @property() value?: string;
  @property({ type: Boolean }) disabled = false;

  @property() on: Renderable = "";
  @property() off: Renderable = "";
  /** Content for the indeterminate state. */
  @property() undecided: Renderable = "";
  @property({ attribute: "aria-label" }) ariaLabelText?: string;

  toggle() {
    if (this.mode === "class") this.active = !this.active;
    else {
      this.indeterminate = false;
      this.checked = !this.checked;
    }
    this.dispatchEvent(
      new CustomEvent("ui-change", {
        detail: { on: this.mode === "class" ? this.active : this.checked },
        bubbles: true,
      }),
    );
  }

  private _part(name: "on" | "off" | "indeterminate", prop: Renderable, cls: string) {
    if (this.hasSlotted(name)) {
      // Authored nodes get the part class directly (keeps them direct children of .swap).
      for (const n of this.slottedNodes(name)) if (n instanceof Element) n.classList.add(cls);
      return this.slotted(name);
    }
    return prop !== "" && prop != null ? html`<div class=${cls}>${prop}</div>` : nothing;
  }

  private _cls(active?: boolean) {
    const btn =
      this.button === "none"
        ? ""
        : button({
            shape: this.button === "plain" ? undefined : this.button,
            variant: this.buttonVariant,
            color: this.buttonColor,
            size: this.buttonSize,
          });
    return swap({ variant: this.variant, active, textSize: this.textSize, iconSize: this.iconSize, class: btn });
  }

  render() {
    const parts = html`${this._part("indeterminate", this.undecided, swapIndeterminate())}
    ${this._part("on", this.on, swapOn())} ${this._part("off", this.off, swapOff())}`;

    if (this.mode === "class") {
      return html`<label
        class=${this._cls(this.active)}
        role="switch"
        aria-checked=${this.active ? "true" : "false"}
        aria-label=${ifDefined(this.ariaLabelText)}
        tabindex="0"
        @click=${() => this.toggle()}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.toggle();
          }
        }}
      >
        ${parts}
      </label>`;
    }

    return html`<label class=${this._cls()}>
      <input
        type="checkbox"
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        .checked=${live(this.checked)}
        .indeterminate=${live(this.indeterminate)}
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.ariaLabelText)}
        @change=${(e: Event) => {
          const t = e.target as HTMLInputElement;
          this.checked = t.checked;
          this.indeterminate = t.indeterminate;
        }}
      />
      ${parts}
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-swap": UiSwap;
  }
}
