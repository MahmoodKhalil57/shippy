import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Link: Adds the missing underline style to links.
 *
 * Purpose: Navigation · Kind: primitive
 * Docs: https://daisyui.com/components/link/
 */
export const link = rcva("link", {
  variants: {
    color: {
      neutral: "link-neutral",
      primary: "link-primary",
      secondary: "link-secondary",
      accent: "link-accent",
      success: "link-success",
      info: "link-info",
      warning: "link-warning",
      error: "link-error",
    },
    variant: {
      /** Only shows the underline on hover. */
      hover: "link-hover",
    },
  },
});

export type LinkVariants = VariantProps<typeof link>;

/**
 * @example <ui-link href="/docs" color="primary">Read the docs</ui-link>
 * @example <ui-link href="https://example.com" variant="hover" external>Example</ui-link>
 *
 * `external` opens in a new tab with `rel="noopener noreferrer"`.
 */
@customElement("ui-link")
export class UiLink extends LightElement {
  @property() color: LinkVariants["color"];
  @property() variant: LinkVariants["variant"];
  @property() href?: string;
  @property() target?: string;
  @property() rel?: string;
  @property() download?: string;
  @property({ type: Boolean }) external = false;

  render() {
    const target = this.target ?? (this.external ? "_blank" : undefined);
    const rel = this.rel ?? (this.external ? "noopener noreferrer" : undefined);
    return html`<a
      class=${link({ color: this.color, variant: this.variant })}
      href=${ifDefined(this.href)}
      target=${ifDefined(target)}
      rel=${ifDefined(rel)}
      download=${ifDefined(this.download)}
      >${this.content}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-link": UiLink;
  }
}
