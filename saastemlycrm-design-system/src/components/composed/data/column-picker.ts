import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import "../../primitives/actions/button.ts";
import "../../primitives/actions/icon-button.ts";
import "../../primitives/actions/dropdown.ts";
import "../../primitives/forms/checkbox.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/actions/button-group.ts";
import "../../primitives/media/icon.ts";
import "../../primitives/typography/text.ts";
import { m } from "../../../lib/i18n/index.ts";

export interface PickerColumn {
  key: string;
  label: Renderable;
  required?: boolean;
}

@customElement("ui-column-picker")
export class UiColumnPicker extends LightElement {
  @property({ attribute: false }) columns: PickerColumn[] = [];
  @property({ attribute: false }) hiddenColumns: string[] = [];
  @property({ attribute: false }) defaults: string[] = [];
  @property({ type: Boolean }) customized = false;
  @property() density?: "0" | "-1" | "-2";

  private _density(density: "0" | "-1" | "-2") {
    this.density = density;
    this.dispatchEvent(new CustomEvent("ui-density", { detail: { density }, bubbles: true }));
  }

  private _emit(hidden: string[], order = this.columns.map((c) => c.key), reset = false) {
    this.hiddenColumns = hidden;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { hidden, order, reset }, bubbles: true }));
  }

  private _move(i: number, by: -1 | 1) {
    const keys = this.columns.map((c) => c.key);
    const j = i + by;
    if (this.columns[j]!.required) return;
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
      panel-width="5"
      align="end"
      trigger-variant="text"
      trigger-size="xs"
      .label=${m.column_picker_label({ shown, total: this.columns.length })}
    >
      <span slot="trigger"><ui-icon name="columns" size="sm"></ui-icon> ${m.column_picker_columns()}</span>
      <ui-flex justify="between" align="center" gap="2">
        <ui-text variant="title-sm">${m.column_picker_columns()}</ui-text>
        ${
          changed
            ? html`<ui-button size="xs" variant="text" @click=${() => this._emit([...this.defaults], [], true)}
                >${m.column_picker_reset()}</ui-button
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
                  : html`<ui-icon-button
                        icon="arrow-up"
                        size="xs"
                        shape="square"
                        .label=${m.column_picker_move_earlier({ name: typeof c.label === "string" ? c.label : c.key })}
                        ?disabled=${i <= first}
                        @click=${() => this._move(i, -1)}
                      ></ui-icon-button>
                      <ui-icon-button
                        icon="arrow-down"
                        size="xs"
                        shape="square"
                        .label=${m.column_picker_move_later({ name: typeof c.label === "string" ? c.label : c.key })}
                        ?disabled=${i === this.columns.length - 1}
                        @click=${() => this._move(i, 1)}
                      ></ui-icon-button>`
              }
            </ui-flex>`,
        )}
      </ui-flex>
      ${
        this.density === undefined
          ? nothing
          : html`<ui-flex direction="col" gap="2">
              <ui-text variant="label-md" color="muted">${m.column_picker_row_height()}</ui-text>
              <ui-button-group
                .label=${m.column_picker_row_height()}
                size="xs"
                .value=${this.density}
                .options=${[
                  { value: "0", label: m.column_picker_density_default() },
                  { value: "-1", label: m.column_picker_density_compact() },
                  { value: "-2", label: m.column_picker_density_dense() },
                ]}
                @ui-change=${(e: CustomEvent<{ value: string }>) => {
                  e.stopPropagation();
                  this._density(e.detail.value as "0" | "-1" | "-2");
                }}
              ></ui-button-group>
            </ui-flex>`
      }
    </ui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-column-picker": UiColumnPicker;
  }
}
