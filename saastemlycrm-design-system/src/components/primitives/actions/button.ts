import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Button: an action (M3 buttons; Apple buttons).
 *
 * Purpose: Actions · Kind: primitive
 *
 * Five styles, by how much the action should stand out (M3), never by size (Apple):
 *   filled     the screen's main action — one, two at most (the prominence audit counts them)
 *   tonal      a secondary action that still needs presence (a tinted container)
 *   outlined   a medium-emphasis alternative ("Cancel" beside "Save")
 *   text       low emphasis: in cards, toolbars, dialogs' dismissive actions
 *   elevated   a filled-tonal action that must lift off a busy surface (rare)
 * Every style reads as pressable by construction: a text or outlined button without a colour takes
 * the primary ink (M3's text button), a tonal one without a colour the secondary container (M3's
 * filled tonal), never the neutral ink of body text.
 * With a `color` and no `variant` a button is filled; with neither it's tonal. Colours are the
 * roles that mean something: `primary`, `secondary`, `error` (destructive: never the primary
 * action, Apple). Sizes are M3's: `xs` 32px (compact rows, cards), `sm` 40px (the default),
 * `md` 56px (a hero action). Every button has a 48px touch target and a pressed shape morph.
 * A toggle (`toggle`) shows and announces its state with `selected` (`aria-pressed`). `loading`
 * swaps the content for a spinner while the action runs and blocks a second press.
 */
/**
 * Pressed, a button morphs its corners (M3 Expressive's shape morph, on the fast spatial spring —
 * src/styles/daisy-motion.css times it): it squares up to at most `sm` (8dp), and springs back
 * on release. Selected, it stays at `md` (12dp), as M3's toggle buttons do.
 */
// Never wider than its container: a label too long for the room wraps (a last resort; M3 asks
// for 1–3 words) instead of spilling past the card, and the button grows to hold it.
export const button = rcva(
  "btn touch-target max-w-full h-auto min-h-(--size) whitespace-normal [text-wrap:balance] active:scale-[0.94] motion-reduce:active:scale-100 active:rounded-[min(var(--radius-sm),var(--radius-field))]",
  {
    variants: {
      variant: {
        filled: "",
        tonal: "btn-ghost state-layer border-transparent",
        outlined: "btn-ghost state-layer border-outline-variant",
        text: "btn-ghost state-layer border-transparent bg-transparent!",
        elevated:
          "btn-ghost state-layer border-transparent bg-surface-container-low! shadow-elevation-1 hover:shadow-elevation-2",
      },
      color: {
        primary: "",
        secondary: "",
        error: "",
      },
      size: {
        xs: "btn-sm",
        sm: "btn-md",
        md: "btn-xl",
      },
      wide: { true: "btn-wide" },
      block: { true: "btn-block" },
      /** A toggle that's on: it keeps the pressed corners and its container colour. */
      selected: { true: "btn-active rounded-[min(var(--radius-md),var(--radius-field))]" },
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
    compoundVariants: [
      { variant: "filled", color: "primary", class: "btn-primary" },
      { variant: "filled", color: "secondary", class: "btn-secondary" },
      { variant: "filled", color: "error", class: "btn-error" },
      { variant: "tonal", color: undefined, class: "bg-secondary-container text-on-secondary-container" },
      { variant: "tonal", color: "primary", class: "bg-primary-container text-on-primary-container" },
      { variant: "tonal", color: "secondary", class: "bg-secondary-container text-on-secondary-container" },
      { variant: "tonal", color: "error", class: "bg-error-container text-on-error-container" },
      { variant: ["outlined", "text", "elevated"], color: undefined, class: "text-primary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "primary", class: "text-primary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "secondary", class: "text-secondary-ink" },
      { variant: ["outlined", "text", "elevated"], color: "error", class: "text-error-ink" },
      {
        variant: ["tonal", "outlined", "text"],
        selected: true,
        class: "bg-primary-container! text-on-primary-container!",
      },
    ],
  },
);
/** The spinner shown while a button's action runs. */
export const buttonSpinner = rcva("loading loading-spinner loading-sm");

export type ButtonVariants = VariantProps<typeof button>;

/**
 * @example <ui-button color="primary">Save</ui-button>
 * @example <ui-button variant="tonal" size="xs">Draft reply</ui-button>
 * @example <ui-button variant="text" href="/collections/cases">All cases</ui-button>
 * @example <ui-button color="error" variant="outlined">Delete…</ui-button>
 * @example <ui-button toggle ?selected=${urgentFirst}>Most urgent first</ui-button>
 * @example <ui-button color="primary" ?loading=${saving}>Save</ui-button>
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
  @property() justify: ButtonVariants["justify"];
  @property({ converter: responsiveBoolean }) wide: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) block: Responsive<boolean> = false;
  /** A toggle button: it announces `selected` (aria-pressed). */
  @property({ type: Boolean }) toggle = false;
  @property({ type: Boolean }) selected = false;
  /** The action is running: a spinner, and no second press. */
  @property({ type: Boolean }) loading = false;
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
    const variant = this.variant ?? (this.color ? "filled" : "tonal");
    const color = this.color ?? (variant === "filled" ? "primary" : undefined);
    const cls = button({
      color,
      variant,
      size: this.size,
      justify: this.justify,
      wide: this.wide,
      block: this.block,
      selected: this.selected,
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
      ?disabled=${this.disabled || this.loading}
      aria-busy=${ifDefined(this.loading ? "true" : undefined)}
      aria-label=${ifDefined(this.label)}
      aria-current=${ifDefined(this.current)}
      aria-pressed=${ifDefined(this.toggle ? String(this.selected) : undefined)}
    >
      ${this.loading ? html`<span class=${buttonSpinner()} aria-hidden="true"></span>` : nothing}${this.content}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-button": UiButton;
  }
}
