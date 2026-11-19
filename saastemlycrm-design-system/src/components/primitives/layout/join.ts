import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../base/variants.ts";

/**
 * Join: Groups buttons, inputs and similar items in a horizontal or vertical row.
 * Applies border radius to the first and last item.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/join/
 *
 * daisyUI rounds the join's direct children and styles elements marked
 * `join-item`. `ui-join` marks its children itself: a plain child gets
 * `join-item`, and for a `ui-*` child (whose host has `display: contents`) the
 * element it renders gets it. The radius variables are set on the direct
 * child and inherit through the host, so `<ui-button>` / `<ui-select>` etc.
 * can be placed straight inside.
 *
 * Responsive (docs): `direction="vertical lg:horizontal"`.
 */
export const join = rcva("join", {
  variants: {
    direction: {
      vertical: "join-vertical",
      horizontal: "join-horizontal",
    },
    /** Mark children as join items automatically (see above). */
    auto: { true: "[&>:not([data-ui])]:join-item [&>[data-ui]>*]:join-item" },
    /** Equal-width items in a 2-column grid (docs: pagination "Next/Prev"). */
    equal: { true: "grid grid-cols-2" },
    /** Background behind the group (docs: accordion "Using Accordion and Join together"). */
    surface: {
      "base-100": "bg-surface",
      "base-200": "bg-surface-container",
      "base-300": "bg-surface-container-highest",
    },
  },
});

/** Put on every item inside a hand-built join (button, input, select, …). */
export const joinItem = rcva("join-item");

export type JoinVariants = VariantProps<typeof join>;

/**
 * @example
 * <ui-join direction="vertical lg:horizontal">
 *   <ui-button>Button</ui-button>
 *   <ui-button>Button</ui-button>
 * </ui-join>
 * @example <ui-join as="nav" label="Pagination" equal>…</ui-join>
 *
 * `label` names the group for assistive tech (`aria-label`; a `div` also gets
 * `role="group"`).
 */
@customElement("ui-join")
export class UiJoin extends LightElement {
  @property() direction: JoinVariants["direction"];
  @property() surface: JoinVariants["surface"];
  @property({ converter: booleanAttribute }) equal = false;
  @property() as: "div" | "nav" = "div";
  @property() label?: string;

  render() {
    const cls = join({ direction: this.direction, surface: this.surface, equal: this.equal, auto: true });
    if (this.as === "nav") {
      return html`<nav class=${cls} aria-label=${ifDefined(this.label)}>${this.content}</nav>`;
    }
    return html`<div class=${cls} role=${this.label ? "group" : nothing} aria-label=${ifDefined(this.label)}>
      ${this.content}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-join": UiJoin;
  }
}
