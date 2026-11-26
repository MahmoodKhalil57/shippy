import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";

export const link = rcva("link", {
  variants: {
    color: {
      neutral: "link-neutral",
      primary: "text-primary-ink",
      secondary: "text-secondary-ink",
      accent: "text-accent-ink",
      success: "text-success-ink",
      info: "text-info-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
    },
    variant: {
      hover: "link-hover",
    },
  },
});

export type LinkVariants = VariantProps<typeof link>;

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
