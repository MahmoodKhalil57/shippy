import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Aura: Border light effect that can wrap around any component.
 *
 * Purpose: Media & visual effects · Kind: primitive
 * Docs: https://daisyui.com/components/aura/
 *
 * The light uses `currentColor` (`color`) and the backdrop uses the background
 * colour (`backdrop`). The wrapped element should have its own background
 * (e.g. a card). Every variant is responsive.
 */
export const aura = rcva("aura", {
  variants: {
    variant: {
      /** two light effects */
      dual: "aura-dual",
      rainbow: "aura-rainbow",
      holo: "aura-holo",
      gold: "aura-gold",
      silver: "aura-silver",
      /** glowing light instead of a rotating border */
      glow: "aura-glow",
    },
    size: {
      xs: "aura-xs",
      sm: "aura-sm",
      md: "aura-md",
      lg: "aura-lg",
      xl: "aura-xl",
    },
    /** Light colour (theme colours only). */
    color: {
      neutral: "text-neutral",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
    /** Backdrop colour behind the light. */
    backdrop: {
      "base-100": "bg-base-100",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300",
      neutral: "bg-neutral",
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      warning: "bg-warning",
    },
    /** Animation speed (the docs' `duration-2000`). */
    duration: {
      "1000": "duration-1000",
      "2000": "duration-2000",
      "3000": "duration-3000",
      "5000": "duration-5000",
    },
  },
});

export type AuraVariants = VariantProps<typeof aura>;

/**
 * @example
 * <ui-aura variant="rainbow" size="lg" duration="2000">
 *   <ui-card heading="Highlighted"></ui-card>
 * </ui-aura>
 * @example <ui-aura color="error" backdrop="warning"><ui-button>button with aura</ui-button></ui-aura>
 */
@customElement("ui-aura")
export class UiAura extends LightElement {
  @property() variant: AuraVariants["variant"];
  @property() size: AuraVariants["size"];
  @property() color: AuraVariants["color"];
  @property() backdrop: AuraVariants["backdrop"];
  @property() duration: AuraVariants["duration"];

  render() {
    return html`<div
      class=${aura({
        variant: this.variant,
        size: this.size,
        color: this.color,
        backdrop: this.backdrop,
        duration: this.duration,
      })}
    >
      ${this.content}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-aura": UiAura;
  }
}
