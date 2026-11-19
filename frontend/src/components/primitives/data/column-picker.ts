import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Column picker: which of a data table's columns show — a "Columns" button opening a checklist,
 * with a way back to the defaults. Pairs with `<ui-table>`'s `hiddenColumns`.
 *
 * Purpose: Data & metrics · Kind: primitive (Shippy)
 *
 * `ui-change` carries `{ hidden }` (column keys). Columns marked `required` (e.g. the one that
 * links to the record) are always shown.
 */
export const columnPickerTrigger = rcva("flex items-center gap-1");
export const columnPickerList = rcva("flex flex-col gap-1");
export const columnPickerHead = rcva("flex items-center justify-between gap-2 pb-1 text-sm font-semibold");

export interface PickerColumn {
  key: string;
  label: Renderable;
  required?: boolean;
}

/**
 * @example
 * <ui-column-picker .columns=${[{ key: "caseId", label: "Case", required: true }, { key: "owner", label: "Owner" }]}
 *   .hiddenColumns=${["owner"]} .defaults=${[]} @ui-change=${(e) => (hidden = e.detail.hidden)}></ui-column-picker>
 */
@customElement("ui-column-picker")
export class UiColumnPicker extends LightElement {
  @property({ attribute: false }) columns: PickerColumn[] = [];
  /** Keys of the columns not shown. */
  @property({ attribute: false }) hiddenColumns: string[] = [];
  /** The hidden columns to go back to with "Reset". */
  @property({ attribute: false }) defaults: string[] = [];

  private _emit(hidden: string[]) {
    this.hiddenColumns = hidden;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { hidden }, bubbles: true }));
  }

  render() {
    const changed = [...this.hiddenColumns].sort().join() !== [...this.defaults].sort().join();
    const shown = this.columns.length - this.hiddenColumns.length;
    return html`<ui-dropdown
      mode="popover"
      panel="card"
      panel-width="64"
      align="end"
      trigger-variant="ghost"
      trigger-size="sm"
      .label=${`Columns (${shown} of ${this.columns.length} shown)`}
    >
      <span slot="trigger" class=${columnPickerTrigger()}>${iconSvg("columns", { size: "sm" })} Columns</span>
      <div class=${columnPickerHead()}>
        <span>Columns</span>
        ${
          changed
            ? html`<ui-button size="xs" variant="ghost" @click=${() => this._emit([...this.defaults])}
                >Reset</ui-button
              >`
            : nothing
        }
      </div>
      <div class=${columnPickerList()} role="group" aria-label="Columns shown">
        ${this.columns.map(
          (c) =>
            html`<ui-checkbox
              size="sm"
              .label=${c.label}
              .checked=${!this.hiddenColumns.includes(c.key)}
              ?disabled=${c.required}
              @change=${(e: Event) => {
                const on = (e.target as HTMLInputElement).checked;
                this._emit(on ? this.hiddenColumns.filter((k) => k !== c.key) : [...this.hiddenColumns, c.key]);
              }}
            ></ui-checkbox>`,
        )}
      </div>
    </ui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-column-picker": UiColumnPicker;
  }
}
