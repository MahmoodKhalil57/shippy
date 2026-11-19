import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Toolbar: the row of controls that acts on the content below it: filters, view, sort,
 * columns, export (M3 docked toolbar; Apple toolbar).
 *
 * Purpose: Actions · Kind: primitive
 *
 * Children go at the start (what's shown: filters); `slot="end"` items sit at the end (how it's
 * shown and what to do with it). It wraps on narrow screens. Keep at most one filled action in
 * it, and put rarely used ones in a menu. `label` names it for screen readers, and Left/Right
 * move between its buttons (fields, selects and option groups keep their own arrow keys).
 * A contextual toolbar ("3 selected" and what to do with them) is the same element with its
 * own label.
 */
export const toolbar = rcva("flex flex-wrap items-center gap-2");
export const toolbarStart = rcva("flex min-w-0 flex-wrap items-center gap-2");
export const toolbarEnd = rcva("ms-auto flex flex-wrap items-center gap-1");

/**
 * @example
 * <ui-toolbar label="Cases">
 *   <ui-filter-builder …></ui-filter-builder>
 *   <ui-button-group slot="end" label="View" …></ui-button-group>
 *   <ui-button slot="end" size="xs" variant="text">Export CSV</ui-button>
 * </ui-toolbar>
 */
@customElement("ui-toolbar")
export class UiToolbar extends LightElement {
  @property() label = "";

  private _onKey(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const from = e.target as HTMLElement;
    if (from.closest("input, select, textarea, [role=radiogroup], [role=menu], [role=listbox], [popover]")) return;
    const items = [...this.querySelectorAll<HTMLElement>("button, a[href]")].filter(
      (b) =>
        !b.closest("[role=radiogroup], [role=menu], [popover]") &&
        !(b as HTMLButtonElement).disabled &&
        b.offsetParent !== null,
    );
    const i = items.indexOf(from);
    if (i < 0) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    const step = (e.key === "ArrowRight") !== rtl ? 1 : -1;
    const next = items[(i + step + items.length) % items.length];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }

  render() {
    return html`<div role="toolbar" aria-label=${this.label || nothing} class=${toolbar()} @keydown=${this._onKey}>
      ${this.hasContent ? html`<div class=${toolbarStart()}>${this.slotted()}</div>` : nothing}
      ${this.hasSlotted("end") ? html`<div class=${toolbarEnd()}>${this.slotted("end")}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-toolbar": UiToolbar;
  }
}
