import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { row, stack, text } from "./algebra.ts";
import { heading } from "../typography/heading.ts";
import { skeleton } from "../feedback/skeleton.ts";

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
 *   actions       the page's actions, at the end of the title's line (M3: keep them few; one
 *                 filled at most)
 *   (default)     anything that belongs under the subtitle (an AI summary, a filter line)
 *
 * The header takes as little height as reads well, so the page's content starts high: the eyebrow,
 * the title and the subtitle are 4dp apart, and the actions share the title's line, at its end
 * (M3 App bars: the title and its "trailing elements" are one bar; HIG Toolbars: "Only specify one
 * primary action, and put it on the trailing side of the toolbar"). When the panel is too narrow
 * for the title and the actions on one line, the actions wrap under the title, at the start; the
 * title itself only wraps once it has the whole line.
 */
export const pageHeader = rcva(`${stack} gap-1`);
/** The title's line: the title group takes the room, the actions the end. */
export const pageHeaderTitleRow = rcva(`${row} items-center justify-between gap-x-4 gap-y-2`);
/** The title and its status tag: as wide as its words, so the actions wrap before the title does. */
export const pageHeaderTitle = rcva(`${row} min-w-0 grow items-center gap-x-3 gap-y-1`);
export const pageHeaderEyebrow = rcva("text-label-md text-on-surface-variant");
export const pageHeaderSubtitle = rcva(`${text.prose} max-w-[80ch] text-body-md text-on-surface-variant`);
export const pageHeaderActions = rcva(`${row} items-center gap-2`);
/**
 * A loading line: a skeleton the height of the text it stands for (a no-break space in that text's
 * own role), so the header takes its real height before its words arrive and nothing under it
 * moves when they do.
 */
/** A line's height in its text role, with nothing to read (U+00A0). */
const NO_BREAK_SPACE = String.fromCharCode(0xa0);
export const pageHeaderPlaceholder = rcva("inline-block rounded-sm align-middle");

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
  /** The header's words are on their way: draw its lines as skeletons of their real heights. */
  @property({ type: Boolean }) loading = false;

  render() {
    if (this.loading) {
      const line = (width: "20" | "32" | "52" | "full") =>
        html`<span class=${skeleton({ shape: null, width, class: pageHeaderPlaceholder() })}>${NO_BREAK_SPACE}</span>`;
      return html`<header class=${pageHeader()} aria-busy="true">
        <p class=${pageHeaderEyebrow()}>${line("32")}</p>
        <div class=${pageHeaderTitleRow()}>
          <h1 class=${heading({ variant: "page" })}>${line("52")}</h1>
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
