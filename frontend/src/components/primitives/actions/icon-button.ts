import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

/**
 * Icon button: an action shown as an icon alone (M3 icon buttons; Apple: icons need a label).
 *
 * Purpose: Actions · Kind: primitive
 *
 * `label` is required: it's the accessible name and the tooltip people see on hover and focus
 * (M3: "the label describes the action"). Styles, by emphasis: `standard` (no container, the
 * default), `tonal`, `outlined`, `filled`. Sizes are M3's: `xs` 32px, `sm` 40px (default), `md`
 * 56px; every size has a 48px touch target. `toggle` + `selected` make an on/off icon button
 * (selected: filled container, `aria-pressed`). Round by default; `shape="square"` for
 * toolbars. Other primitives borrow `iconButton()` for their own icon controls.
 */
export const iconButton = rcva(
  "btn btn-square touch-target state-layer border-transparent p-0 active:rounded-[min(var(--radius-sm),var(--radius-field))] [&_svg]:size-5",
  {
    variants: {
      variant: {
        standard: "btn-ghost bg-transparent! text-on-surface-variant hover:text-on-surface",
        tonal: "btn-ghost bg-surface-container-highest! text-on-surface",
        outlined: "btn-ghost border-outline-variant! bg-transparent! text-on-surface-variant",
        filled: "btn-primary",
      },
      /** For filled ones: a destructive or secondary filled icon button. */
      color: {
        primary: "",
        error: "btn-error",
      },
      size: {
        xs: "btn-sm",
        sm: "btn-md",
        md: "btn-xl [&_svg]:size-6",
      },
      shape: {
        round: "btn-circle",
        square: "rounded-[min(var(--radius-md),var(--radius-field))]",
      },
      selected: { true: "bg-primary! text-primary-content! rounded-[min(var(--radius-md),var(--radius-field))]" },
    },
    defaultVariants: { variant: "standard", size: "sm", shape: "round" },
  },
);
/** The hover / focus label (a plain M3 tooltip). */
export const iconButtonTooltip = rcva(
  "tooltip tooltip-bottom [&>.tooltip-content]:liquid-glass-clear [&::before]:liquid-glass-clear [&::before]:text-on-surface [&::after]:invisible",
);

export type IconButtonVariants = VariantProps<typeof iconButton>;

/**
 * @example <ui-icon-button icon="x" label="Close"></ui-icon-button>
 * @example <ui-icon-button icon="filter" label="Filter" variant="tonal" size="xs"></ui-icon-button>
 * @example <ui-icon-button icon="star" label="Bookmark" toggle ?selected=${saved}></ui-icon-button>
 *
 * Renders an `<a>` with `href`, else a `<button>`. A custom icon template can go in the content
 * instead of `icon`.
 */
@customElement("ui-icon-button")
export class UiIconButton extends LightElement {
  @property() icon?: IconName;
  /** What the button does ("Close", "Delete line 3"): its name and tooltip. */
  @property() label = "";
  @property() variant: IconButtonVariants["variant"];
  @property() color: IconButtonVariants["color"];
  @property() size: IconButtonVariants["size"];
  @property() shape: IconButtonVariants["shape"];
  @property({ type: Boolean }) toggle = false;
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean }) disabled = false;
  @property() href?: string;
  @property() type: "button" | "submit" = "button";
  /** Show the label as a tooltip on hover and focus (default on). */
  @property({ type: Boolean, attribute: "no-tooltip" }) noTooltip = false;

  render() {
    const cls = iconButton({
      variant: this.variant,
      color: this.color,
      size: this.size,
      shape: this.shape,
      selected: this.toggle && this.selected,
    });
    const icon = this.icon ? iconSvg(this.icon) : this.content;
    const el = this.href
      ? html`<a class=${cls} href=${this.href} aria-label=${this.label}>${icon}</a>`
      : html`<button
          class=${cls}
          type=${this.type}
          ?disabled=${this.disabled}
          aria-label=${this.label}
          aria-pressed=${ifDefined(this.toggle ? String(this.selected) : undefined)}
        >
          ${icon}
        </button>`;
    return this.noTooltip || !this.label
      ? el
      : html`<span class=${iconButtonTooltip()} data-tip=${this.label}>${el}</span>${nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-icon-button": UiIconButton;
  }
}
