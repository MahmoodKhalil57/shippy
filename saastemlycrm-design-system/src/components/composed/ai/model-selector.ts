import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import "../../primitives/actions/dropdown.ts";
import type { IconName } from "../../primitives/media/icon.ts";
import "../../primitives/media/icon.ts";
import type { MenuItem } from "../../primitives/navigation/menu.ts";
import "../../primitives/navigation/menu.ts";
import "../../primitives/typography/text.ts";

/**
 * Model selector: which model an agent runs on — a small chip (its icon and name) opening a menu
 * of models grouped by provider, each with an optional line about it.
 *
 * Purpose: AI · Kind: composed (Dropdown / Menu / Icon; after the AI Elements "Model Selector")
 *
 * Opens upward (a popover, so a panel around it doesn't clip it). `ui-change` { value } fires on
 * a pick; the menu closes.
 */

export interface ModelOption {
  id: string;
  label: string;
  icon?: IconName;
  description?: string;
}
export interface ModelGroup {
  label: string;
  models: ModelOption[];
}

/**
 * @example
 * <ui-model-selector value="luna" .groups=${[
 *   { label: "OpenAI", models: [{ id: "luna", label: "Luna", icon: "cloud" }] },
 *   { label: "On this device", models: [{ id: "aibrowser", label: "Saastama-Micro-3.5", icon: "device" }] },
 * ]} @ui-change=${(e) => (model = e.detail.value)}></ui-model-selector>
 */
@customElement("ui-model-selector")
export class UiModelSelector extends LightElement {
  @property({ attribute: false }) groups: ModelGroup[] = [];
  @property() value = "";
  @property({ type: Boolean }) disabled = false;

  render() {
    const all = this.groups.flatMap((g) => g.models);
    const current = all.find((m) => m.id === this.value) ?? all[0];
    const item = (m: ModelOption): MenuItem => ({
      label: m.label,
      icon: m.icon ? html`<ui-icon name=${m.icon} size="sm"></ui-icon>` : undefined,
      active: m.id === current?.id,
      value: m.id,
      ...(m.description ? { card: true, description: m.description } : {}),
    });
    const items: MenuItem[] = this.groups.map((g) => ({ heading: true, label: g.label, children: g.models.map(item) }));
    return html`<ui-dropdown
      mode="popover"
      side="top"
      align="start"
      panel="card"
      panel-width="5"
      panel-elevation="2"
      trigger-variant="text"
      trigger-size="xs"
      trigger-spaced="false"
      .label=${`Model: ${current?.label ?? ""}`}
    >
      <ui-text slot="trigger" as="span" variant="label-md" emphasized>
        ${current?.icon ? html`<ui-icon name=${current.icon} size="sm"></ui-icon>` : ""} ${current?.label}
        <ui-icon name="unfold" size="sm"></ui-icon>
      </ui-text>
      <ui-menu
        width="full"
        surface="false"
        .items=${items}
        @ui-select=${(e: CustomEvent<{ item: MenuItem }>) => {
          e.stopPropagation();
          const value = e.detail.item.value;
          if (typeof value !== "string" || this.disabled) return;
          this.value = value;
          this.dispatchEvent(new CustomEvent("ui-change", { detail: { value }, bubbles: true }));
          this.querySelector("ui-dropdown")?.hide();
        }}
      ></ui-menu>
    </ui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-model-selector": UiModelSelector;
  }
}
