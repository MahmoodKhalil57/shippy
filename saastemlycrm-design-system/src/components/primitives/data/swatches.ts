import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Swatches: a few colours side by side, overlapping — a preview of a colour scheme or palette.
 *
 * Purpose: Data & metrics · Kind: primitive (Shippy)
 *
 * The colours are data (a scheme's own values), not theme tokens, so they're set inline.
 * Decorative: name the scheme next to it.
 */
export const swatches = rcva("flex shrink-0 -space-x-1.5");
export const swatch = rcva("size-4 rounded-full ring-2 ring-base-100");

/** @example <ui-swatches .colors=${["#fff", "#2563eb", "#9333ea", "#f59e0b"]}></ui-swatches> */
@customElement("ui-swatches")
export class UiSwatches extends LightElement {
  @property({ attribute: false }) colors: string[] = [];

  render() {
    return html`<span class=${swatches()} aria-hidden="true"
      >${this.colors.map((c) => html`<span class=${swatch()} style=${styleMap({ background: c })}></span>`)}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-swatches": UiSwatches;
  }
}
