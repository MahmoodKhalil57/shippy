import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { row, rowEnd } from "../../../styles/algebra.ts";
import { inlineStep } from "../../../lib/base/reading.ts";

export const toolbar = rcva(`${row} items-center gap-2`);
export const toolbarStart = rcva(`${row} min-w-0 items-center gap-2`);
export const toolbarEnd = rcva(`${row} ${rowEnd} items-center gap-1`);

@customElement("ui-toolbar")
export class UiToolbar extends LightElement {
  @property() label = "";

  private _onKey(e: KeyboardEvent) {
    const step = inlineStep(e.key, this);
    if (!step) return;
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
    e.preventDefault();
    items[(i + step + items.length) % items.length]!.focus();
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
