import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { uid } from "../../../lib/base/uid.ts";
import { booleanAttribute } from "../../../lib/base/variants.ts";
import type { CollapseVariants } from "../../primitives/containers/collapse.ts";
import "../../primitives/containers/collapse.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/layout/join.ts";

export interface AccordionItem {
  heading: Renderable;
  content: Renderable;
  open?: boolean;
}

@customElement("ui-accordion")
export class UiAccordion extends LightElement {
  @property({ attribute: false }) items: AccordionItem[] = [];
  @property() mode: "radio" | "details" = "radio";
  @property() icon: CollapseVariants["icon"];
  @property({ type: Boolean }) joined = false;
  @property({ converter: booleanAttribute }) bordered = true;
  @property() name = uid("accordion");

  #current = -1;

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("items")) this.#current = this.items.findIndex((i) => i.open);
  }

  private _toggled(index: number, open: boolean) {
    if (!open) {
      if (index === this.#current) this.#current = -1;
      return;
    }
    if (index === this.#current) return;
    this.#current = index;
    this.dispatchEvent(new CustomEvent("ui-change", { detail: { index }, bubbles: true }));
  }

  private _item(item: AccordionItem, index: number, firstOpen: number) {
    return html`<ui-collapse
      .mode=${this.mode}
      .name=${this.name}
      .icon=${this.icon}
      .bordered=${this.bordered}
      .heading=${item.heading}
      .open=${index === firstOpen}
      @ui-toggle=${(e: CustomEvent<{ open: boolean }>) => this._toggled(index, e.detail.open)}
      >${item.content}</ui-collapse
    >`;
  }

  render() {
    const firstOpen = this.items.findIndex((i) => i.open);
    const items = this.items.length
      ? repeat(
          this.items,
          (_, i) => i,
          (item, i) => this._item(item, i, firstOpen),
        )
      : this.content;
    return this.joined
      ? html`<ui-join direction="vertical" surface="base-100">${items}</ui-join>`
      : html`<ui-flex direction="col">${items}</ui-flex>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-accordion": UiAccordion;
  }
}
