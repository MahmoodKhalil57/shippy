import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { fixed, row } from "../../../styles/algebra.ts";

export const swatches = rcva(`${row} -space-x-1.5`);
export const swatch = rcva(`${fixed["4"]} rounded-full ring-2 ring-base-100`);

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
