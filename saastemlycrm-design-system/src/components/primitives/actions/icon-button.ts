import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { inlineRow } from "../layout/algebra.ts";
import { iconSvg, type IconName } from "../media/icon.ts";

export const iconButton = rcva(
  "btn btn-square max-w-full touch-target state-layer border-transparent p-0 active:rounded-[min(var(--radius-sm),var(--radius-field))] [&_svg]:size-5",
  {
    variants: {
      variant: {
        standard: "btn-ghost bg-transparent! text-on-surface-variant hover:text-on-surface",
        tonal: "btn-ghost bg-surface-container-highest! text-on-surface",
        outlined: "btn-ghost border-outline-variant! bg-transparent! text-on-surface-variant",
        filled: "btn-primary",
      },
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
export const iconButtonTooltip = rcva(inlineRow);

export type IconButtonVariants = VariantProps<typeof iconButton>;

@customElement("ui-icon-button")
export class UiIconButton extends LightElement {
  @property() icon?: IconName;
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
      : html`<span class=${iconButtonTooltip()} data-tip=${this.label} data-tip-side="bottom">${el}</span>${nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-icon-button": UiIconButton;
  }
}
