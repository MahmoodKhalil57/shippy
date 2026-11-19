import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { heading } from "../typography/heading.ts";

/**
 * Page header: the top of a page — where you are, what the page is, one line about it, and the
 * page's actions (M3 app bar: headline, subtitle, trailing actions; Apple: large title + toolbar).
 *
 * Purpose: Layout · Kind: primitive
 *
 * One per page, first in the main panel. The heading is the page's `<h1>` in the page-title role
 * (fluid, src/styles/theme.css). Slots:
 *   breadcrumbs   the path back (`<ui-breadcrumbs slot="breadcrumbs">`), or use `eyebrow` for a
 *                 short context line ("Sourcing desk · intake") on pages without a path
 *   heading       the title, when it needs markup (else the `heading` property)
 *   status        a tag beside the title ("Unsaved changes")
 *   subtitle      one line about the page (else the `subtitle` property)
 *   actions       the page's actions, at the end (M3: keep them few; one filled at most)
 *   (default)     anything that belongs under the subtitle (an AI summary, a filter line)
 * On a narrow panel the actions wrap under the text.
 */
export const pageHeader = rcva("flex max-w-full flex-wrap items-end justify-between gap-x-4 gap-y-3");
export const pageHeaderText = rcva("flex min-w-0 flex-[1_1_24rem] flex-col gap-1");
export const pageHeaderTitleRow = rcva("flex max-w-full flex-wrap items-center gap-x-3 gap-y-1");
export const pageHeaderEyebrow = rcva("text-label-md text-on-surface-variant");
export const pageHeaderSubtitle = rcva("max-w-[70ch] text-body-lg text-on-surface-variant");
export const pageHeaderActions = rcva("flex max-w-full flex-wrap items-center gap-2");

/**
 * @example
 * <ui-page-header eyebrow="Sourcing desk · intake" heading="Inbox"
 *   subtitle="Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.">
 *   <ui-button slot="actions" size="sm" color="primary">Simulate new email</ui-button>
 * </ui-page-header>
 * @example
 * <ui-page-header .heading=${doc.title}>
 *   <ui-breadcrumbs slot="breadcrumbs" .items=${crumbs}></ui-breadcrumbs>
 *   <ui-tag slot="status" tone="warning">Unsaved changes</ui-tag>
 * </ui-page-header>
 */
@customElement("ui-page-header")
export class UiPageHeader extends LightElement {
  @property() heading: Renderable = "";
  @property() eyebrow: Renderable = "";
  @property() subtitle: Renderable = "";

  render() {
    const title = this.hasSlotted("heading") ? this.slotted("heading") : this.heading;
    const eyebrow = this.hasSlotted("eyebrow") ? this.slotted("eyebrow") : this.eyebrow;
    const subtitle = this.hasSlotted("subtitle") ? this.slotted("subtitle") : this.subtitle;
    return html`<header class=${pageHeader()}>
      <div class=${pageHeaderText()}>
        ${this.slotted("breadcrumbs")} ${eyebrow ? html`<p class=${pageHeaderEyebrow()}>${eyebrow}</p>` : nothing}
        <div class=${pageHeaderTitleRow()}>
          <h1 class=${heading({ variant: "page" })}>${title}</h1>
          ${this.slotted("status")}
        </div>
        ${subtitle ? html`<p class=${pageHeaderSubtitle()}>${subtitle}</p>` : nothing} ${this.slotted()}
      </div>
      ${this.hasSlotted("actions") ? html`<div class=${pageHeaderActions()}>${this.slotted("actions")}</div>` : nothing}
    </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-page-header": UiPageHeader;
  }
}
