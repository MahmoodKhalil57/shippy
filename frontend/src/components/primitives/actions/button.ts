import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Button: Lets users take actions or make choices.
 *
 * Purpose: Actions · Kind: primitive
 * Docs: https://daisyui.com/components/button/
 *
 * Every variant is responsive, e.g. the docs' responsive button:
 * `size="xs sm:sm md:md lg:lg xl:xl"`.
 */
export const button = rcva("btn", {
  variants: {
    color: {
      neutral: "btn-neutral",
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      info: "btn-info",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
    },
    variant: {
      outline: "btn-outline",
      dash: "btn-dash",
      soft: "btn-soft",
      ghost: "btn-ghost",
      link: "btn-link",
    },
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      xl: "btn-xl",
    },
    shape: {
      square: "btn-square",
      circle: "btn-circle",
    },
    wide: { true: "btn-wide" },
    block: { true: "btn-block" },
    active: { true: "btn-active" },
    disabled: { true: "btn-disabled" },
    /** Content alignment, e.g. for full-width buttons in menus. */
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
  },
});

export type ButtonVariants = VariantProps<typeof button>;

/**
 * @example <ui-button color="primary" variant="soft" size="sm">Save</ui-button>
 * @example <ui-button href="/docs" variant="link">Docs</ui-button>
 * @example <ui-button size="xs sm:sm md:md lg:lg xl:xl">Responsive</ui-button>
 * @example <ui-button block="max-sm">Full width on phones</ui-button>
 *
 * @example <ui-button type="radio" name="page" value="1" label="1" shape="square"></ui-button>
 *
 * Renders an `<a>` when `href` is set, otherwise a `<button>`. `type="radio"`
 * / `type="checkbox"` render the docs' button-styled `<input>` (labelled by
 * `label`; its native `change` event bubbles out).
 */
@customElement("ui-button")
export class UiButton extends LightElement {
  @property() color: ButtonVariants["color"];
  @property() variant: ButtonVariants["variant"];
  @property() size: ButtonVariants["size"];
  @property() shape: ButtonVariants["shape"];
  @property() justify: ButtonVariants["justify"];
  @property({ converter: responsiveBoolean }) wide: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) block: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) active: Responsive<boolean> = false;
  /** Behaviour, not just looks: disables the native button / link. */
  @property({ type: Boolean }) disabled = false;
  @property() type: "button" | "submit" | "reset" | "radio" | "checkbox" = "button";
  @property() href?: string;
  @property() target?: string;
  @property() label?: string;
  /** `aria-current`, e.g. `page` for the current page in a pagination. */
  @property() current?: string;
  /** Radio / checkbox inputs. */
  @property() name?: string;
  @property() value?: string;
  @property({ type: Boolean }) checked = false;

  render() {
    const cls = button({
      color: this.color,
      variant: this.variant,
      size: this.size,
      shape: this.shape,
      justify: this.justify,
      wide: this.wide,
      block: this.block,
      active: this.active,
      disabled: this.disabled && !!this.href,
    });
    if (this.type === "radio" || this.type === "checkbox") {
      return html`<input
        class=${cls}
        type=${this.type}
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        aria-label=${ifDefined(this.label)}
        .checked=${live(this.checked)}
        ?disabled=${this.disabled}
        @change=${(e: Event) => (this.checked = (e.target as HTMLInputElement).checked)}
      />`;
    }
    if (this.href) {
      return html`<a
        class=${cls}
        href=${this.href}
        target=${ifDefined(this.target)}
        aria-label=${ifDefined(this.label)}
        aria-current=${ifDefined(this.current)}
        aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
        tabindex=${ifDefined(this.disabled ? "-1" : undefined)}
        >${this.content}</a
      >`;
    }
    return html`<button
      class=${cls}
      type=${this.type}
      ?disabled=${this.disabled}
      aria-label=${ifDefined(this.label)}
      aria-current=${ifDefined(this.current)}
    >
      ${this.content}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button": UiButton;
  }
}
