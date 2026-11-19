import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, uid, type Renderable } from "../../base/light-element.ts";
import { booleanAttribute } from "../../base/variants.ts";
import type { CollapseVariants } from "../../primitives/containers/collapse.ts";
import "../../primitives/containers/collapse.ts";
import "../../primitives/layout/flex.ts";
import "../../primitives/layout/join.ts";

/**
 * Accordion: Shows and hides content, with only one item open at a time.
 *
 * Purpose: Content containers & disclosure · Kind: composed (Collapse + Join)
 * Docs: https://daisyui.com/components/accordion/
 *
 * daisyUI has no `accordion` class: it's a group of Collapse items whose radio
 * inputs (or `<details name>`) share one name, optionally inside a vertical
 * Join. Built only from `ui-collapse`, `ui-join` and `ui-flex`.
 */
export interface AccordionItem {
  heading: Renderable;
  content: Renderable;
  /** Initially open. Only the first open item wins. */
  open?: boolean;
}

/**
 * @example
 * <ui-accordion icon="arrow" joined
 *   .items=${[{ heading: "How do I create an account?", content: "Click Sign Up…", open: true }]}>
 * </ui-accordion>
 *
 * Without `items`, the authored children (e.g. `<ui-collapse mode="radio" name="faq">`
 * items) are rendered inside the group.
 * Native `change` events from the radios bubble out; `ui-change` carries the open index.
 */
@customElement("ui-accordion")
export class UiAccordion extends LightElement {
  @property({ attribute: false }) items: AccordionItem[] = [];
  /** `radio`: one open at a time, can't close all. `details`: one open at a time, searchable, can close all. */
  @property() mode: "radio" | "details" = "radio";
  @property() icon: CollapseVariants["icon"];
  /** Join items together (the docs' "Using Accordion and Join together"). */
  @property({ type: Boolean }) joined = false;
  @property({ converter: booleanAttribute }) bordered = true;
  /** Shared group name; generated when omitted. */
  @property() name = uid("accordion");

  private _changed(index: number) {
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
      @ui-toggle=${(e: CustomEvent<{ open: boolean }>) => e.detail.open && this._changed(index)}
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
