import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg, type IconName } from "../media/icon.ts";
import type { MenuItem } from "../navigation/menu.ts";

/**
 * Model selector: which model an agent runs on — a small chip (its icon and name) opening a menu
 * of models grouped by provider, each with an optional line about it.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Model Selector")
 *
 * Opens upward (a popover, so a panel around it doesn't clip it). `ui-change` { value } fires on
 * a pick; the menu closes.
 */
export const modelSelectorChip = rcva("flex items-center gap-1 text-xs font-semibold");

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
      icon: m.icon ? iconSvg(m.icon, { size: "sm" }) : undefined,
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
      panel-width="64"
      panel-shadow="lg"
      trigger-variant="ghost"
      trigger-size="xs"
      trigger-spaced="false"
      .label=${`Model: ${current?.label ?? ""}`}
    >
      <span slot="trigger" class=${modelSelectorChip()}>
        ${current?.icon ? iconSvg(current.icon, { size: "sm" }) : ""} ${current?.label}
        ${iconSvg("unfold", { size: "sm" })}
      </span>
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
