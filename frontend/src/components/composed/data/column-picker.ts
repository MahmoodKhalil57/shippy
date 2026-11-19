import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/forms/checkbox.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/typography/text.ts";

/**
 * Column picker: which of a data table's columns show, and in what order. A "Columns" button
 * opens a checklist in the table's order; each column moves earlier or later with its arrows (the
 * keyboard way to do what dragging a header does), and Reset goes back to the defaults.
 * Pairs with `<ui-table>`'s `hiddenColumns` and `columnOrder`.
 *
 * Purpose: Data & metrics · Kind: composed (Dropdown / Checkbox / Button)
 *
 * `ui-change` carries `{ hidden, order, reset }`: hidden column keys, every key in the new order,
 * and `reset: true` when Reset was chosen (the page also clears what else it keeps, like widths).
 * Columns marked `required` (the one that links to the record) are always shown and stay first.
 */
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
  /** Every column, in the table's current order. */
  @property({ attribute: false }) columns: PickerColumn[] = [];
  /** Keys of the columns not shown. */
  @property({ attribute: false }) hiddenColumns: string[] = [];
  /** The hidden columns to go back to with "Reset". */
  @property({ attribute: false }) defaults: string[] = [];
  /** Something else differs from the defaults (the order, a width), so Reset is offered. */
  @property({ type: Boolean }) customized = false;

  private _emit(hidden: string[], order = this.columns.map((c) => c.key), reset = false) {
    this.hiddenColumns = hidden;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { hidden, order, reset }, bubbles: true }));
  }

  /** Swaps a column with its neighbour; required columns stay where they are. */
  private _move(i: number, by: -1 | 1) {
    const keys = this.columns.map((c) => c.key);
    const j = i + by;
    if (!this.columns[j] || this.columns[j].required) return;
    [keys[i], keys[j]] = [keys[j]!, keys[i]!];
    this._emit(this.hiddenColumns, keys);
  }

  render() {
    const changed = this.customized || [...this.hiddenColumns].sort().join() !== [...this.defaults].sort().join();
    const shown = this.columns.length - this.hiddenColumns.length;
    const first = this.columns.findIndex((c) => !c.required);
    return html`<ui-dropdown
      mode="popover"
      panel="card"
      panel-width="64"
      align="end"
      trigger-variant="ghost"
      trigger-size="sm"
      .label=${`Columns (${shown} of ${this.columns.length} shown)`}
    >
      <span slot="trigger"><ui-icon name="columns" size="sm"></ui-icon> Columns</span>
      <ui-flex justify="between" align="center" gap="2">
        <ui-text variant="title-sm">Columns</ui-text>
        ${
          changed
            ? html`<ui-button size="xs" variant="ghost" @click=${() => this._emit([...this.defaults], [], true)}
                >Reset</ui-button
              >`
            : nothing
        }
      </ui-flex>
      <ui-flex direction="col" gap="1">
        ${this.columns.map(
          (c, i) =>
            html`<ui-flex align="center" gap="1">
              <ui-flex grow>
                <ui-checkbox
                  size="sm"
                  .label=${c.label}
                  .checked=${!this.hiddenColumns.includes(c.key)}
                  ?disabled=${c.required}
                  @change=${(e: Event) => {
                    const on = (e.target as HTMLInputElement).checked;
                    this._emit(on ? this.hiddenColumns.filter((k) => k !== c.key) : [...this.hiddenColumns, c.key]);
                  }}
                ></ui-checkbox>
              </ui-flex>
              ${
                c.required
                  ? nothing
                  : html`<ui-button
                        size="xs"
                        variant="ghost"
                        shape="square"
                        .label=${`Move ${typeof c.label === "string" ? c.label : c.key} earlier`}
                        ?disabled=${i <= first}
                        @click=${() => this._move(i, -1)}
                        ><ui-icon name="arrow-up" size="xs"></ui-icon
                      ></ui-button>
                      <ui-button
                        size="xs"
                        variant="ghost"
                        shape="square"
                        .label=${`Move ${typeof c.label === "string" ? c.label : c.key} later`}
                        ?disabled=${i === this.columns.length - 1}
                        @click=${() => this._move(i, 1)}
                        ><ui-icon name="arrow-down" size="xs"></ui-icon
                      ></ui-button>`
              }
            </ui-flex>`,
        )}
      </ui-flex>
    </ui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-column-picker": UiColumnPicker;
  }
}
