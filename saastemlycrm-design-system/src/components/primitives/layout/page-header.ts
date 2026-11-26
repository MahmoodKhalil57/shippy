import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { row, stack, text } from "../../../styles/algebra.ts";
import { heading } from "../typography/heading.ts";
import { skeleton } from "../feedback/skeleton.ts";
import { m } from "../../../lib/i18n/index.ts";

export const pageHeader = rcva(`${stack} gap-1`);
export const pageHeaderTitleRow = rcva(`${row} items-center justify-between gap-x-4 gap-y-2`);
export const pageHeaderTitle = rcva(`${row} min-w-0 grow items-center gap-x-3 gap-y-1`);
export const pageHeaderEyebrow = rcva("text-label-md text-on-surface-variant");
export const pageHeaderSubtitle = rcva(`${text.prose} max-w-[80ch] text-body-md text-on-surface-variant`);
export const pageHeaderActions = rcva(`${row} items-center gap-2`);
const NO_BREAK_SPACE = String.fromCharCode(0xa0);
export const pageHeaderPlaceholder = rcva("inline-block rounded-sm align-middle");

@customElement("ui-page-header")
export class UiPageHeader extends LightElement {
  @property() heading: Renderable = "";
  @property() eyebrow: Renderable = "";
  @property() subtitle: Renderable = "";
  @property({ type: Boolean }) loading = false;

  render() {
    if (this.loading) {
      const line = (width: "20" | "32" | "52" | "full") =>
        html`<span class=${skeleton({ shape: null, width, class: pageHeaderPlaceholder() })}>${NO_BREAK_SPACE}</span>`;
      return html`<header class=${pageHeader()} aria-busy="true">
        <p class=${pageHeaderEyebrow()}>${line("32")}</p>
        <div class=${pageHeaderTitleRow()}>
          <h1 class=${heading({ variant: "page" })}>
            ${line("52")}<span class="sr-only">${this.heading || m.skeleton_loading()}</span>
          </h1>
        </div>
        <p class=${pageHeaderSubtitle()}>${line("full")}</p>
        ${this.slotted()}
      </header>`;
    }
    const title = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    const eyebrow = this.hasSlotted("eyebrow") ? this.slotted("eyebrow") : this.eyebrow;
    const subtitle = this.hasSlotted("subtitle") ? this.slotted("subtitle") : this.subtitle;
    return html`<header class=${pageHeader()}>
      ${this.slotted("breadcrumbs")} ${eyebrow ? html`<p class=${pageHeaderEyebrow()}>${eyebrow}</p>` : nothing}
      <div class=${pageHeaderTitleRow()}>
        <div class=${pageHeaderTitle()}>
          <h1 class=${heading({ variant: "page" })}>${title}</h1>
          ${this.slotted("status")}
        </div>
        ${this.hasSlotted("actions") ? html`<div class=${pageHeaderActions()}>${this.slotted("actions")}</div>` : nothing}
      </div>
      ${subtitle ? html`<p class=${pageHeaderSubtitle()}>${subtitle}</p>` : nothing} ${this.slotted()}
    </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-page-header": UiPageHeader;
  }
}
