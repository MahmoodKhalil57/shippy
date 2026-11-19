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
/**
 * Every button squashes a little when pressed and springs back (M3 expressive fast spatial
 * spring; colours and shadows on the effects spring: src/styles/daisy-motion.css).
 */
/**
 * Pressed, a button morphs its corners (M3 Expressive's shape morph, on the fast spatial spring —
 * src/styles/daisy-motion.css times it): a rounded button squares up to at most `sm` (8dp), a
 * round icon button to `md` (12dp), and springs back on release. Selected (`active`), a round
 * button stays at `md`, as M3's toggle buttons do.
 */
export const button = rcva(
  "btn touch-target active:scale-[0.94] motion-reduce:active:scale-100 active:rounded-[min(var(--radius-sm),var(--radius-field))] [&.btn-circle]:active:rounded-md",
  {
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
        /**
         * Outline, dash, soft, ghost and link draw text in the button's colour: mixed toward the
         * ink so it reads at WCAG AA (filled on hover, they use the colour's own content ink).
         */
        outline:
          "btn-outline [&:not(:hover,:active,.btn-active)]:[color:color-mix(in_oklab,var(--btn-color,var(--color-base-content))_35%,var(--color-base-content))]",
        dash: "btn-dash [&:not(:hover,:active,.btn-active)]:[color:color-mix(in_oklab,var(--btn-color,var(--color-base-content))_35%,var(--color-base-content))]",
        soft: "btn-soft [&:not(:hover,:active,.btn-active)]:[color:color-mix(in_oklab,var(--btn-color,var(--color-base-content))_35%,var(--color-base-content))]",
        ghost:
          "btn-ghost [&:not(:hover,:active,.btn-active)]:[color:color-mix(in_oklab,var(--btn-color,var(--color-base-content))_35%,var(--color-base-content))]",
        link: "btn-link [&:not(:hover,:active,.btn-active)]:[color:color-mix(in_oklab,var(--btn-color,var(--color-base-content))_35%,var(--color-base-content))]",
        /**
         * Looks like a search field (the app header's command-palette trigger): rounded, filled,
         * placeholder-coloured text, a trailing `<ui-kbd>` hint. When its container (an `@container`)
         * has less than 13rem, it shrinks to an icon-only circle at the start (beside the brand) — no screen breakpoint.
         */
        field:
          "btn-ghost liquid-glass-clear h-11 w-full max-w-xl justify-start gap-2 rounded-full border-transparent px-4 font-normal text-on-surface-variant hover:bg-surface/60 hover:text-on-surface [&>ui-kbd>span]:ms-auto @max-[13rem]:me-auto @max-[13rem]:size-10 @max-[13rem]:justify-center @max-[13rem]:px-0 @max-[13rem]:[&>ui-kbd]:hidden @max-[13rem]:[&>ui-text]:hidden",
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
      active: { true: "btn-active [&.btn-circle]:rounded-md" },
      disabled: { true: "btn-disabled" },
      /** Hide the button, e.g. `hide="lg"` where a sidebar it toggles is always open. */
      hide: { true: "hidden" },
      /** Content alignment, e.g. for full-width buttons in menus. */
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
      },
      /** Text that wraps onto several lines (a suggested reply): the button grows to fit it. */
      multiline: { true: "h-auto min-h-(--size) py-2 text-start font-normal whitespace-normal" },
    },
  },
);

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
  @property({ type: Boolean }) multiline = false;
  @property({ converter: responsiveBoolean }) hide: Responsive<boolean> = false;
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
      multiline: this.multiline,
      hide: this.hide,
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
