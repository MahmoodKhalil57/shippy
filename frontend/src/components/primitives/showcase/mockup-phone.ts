import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { booleanAttribute, rcva, type Responsive, responsiveBoolean } from "../../base/variants.ts";

/**
 * Phone mockup: Mockup of an iPhone.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/mockup-phone/
 */
export const mockupPhone = rcva("mockup-phone", {
  variants: {
    /** Frame colour (theme colours only). */
    color: {
      neutral: "border-neutral",
      primary: "border-primary",
      secondary: "border-secondary",
      accent: "border-accent",
      info: "border-info",
      success: "border-success",
      warning: "border-warning",
      error: "border-error",
    },
  },
});

/** Camera notch part. */
export const mockupPhoneCamera = rcva("mockup-phone-camera");

/** Screen part. `centered` is the dark "It's Glowtime." style from the docs. */
export const mockupPhoneDisplay = rcva("mockup-phone-display", {
  variants: {
    centered: { true: "text-neutral-content grid place-content-center bg-neutral" },
  },
});

export type MockupPhoneVariants = VariantProps<typeof mockupPhone> & VariantProps<typeof mockupPhoneDisplay>;

/**
 * @example <ui-mockup-phone centered>It's Glowtime.</ui-mockup-phone>
 * @example <ui-mockup-phone color="warning" wallpaper="/wallpaper.webp"></ui-mockup-phone>
 */
@customElement("ui-mockup-phone")
export class UiMockupPhone extends LightElement {
  @property() color: MockupPhoneVariants["color"];
  /** Image shown full-screen on the display. */
  @property() wallpaper?: string;
  @property() alt = "wallpaper";
  /** Dark display with centered content. */
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = false;
  /** Show the camera notch (structure, not a style). */
  @property({ converter: booleanAttribute }) camera = true;

  render() {
    return html`<div class=${mockupPhone({ color: this.color })}>
      ${this.camera ? html`<div class=${mockupPhoneCamera()}></div>` : ""}
      <div class=${mockupPhoneDisplay({ centered: this.centered })}>
        ${this.wallpaper ? html`<img alt=${this.alt} src=${this.wallpaper} />` : this.content}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-mockup-phone": UiMockupPhone;
  }
}
