import type { VariantProps } from "class-variance-authority";
import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { booleanAttribute, rcva } from "../../../lib/base/variants.ts";

export const join = rcva("join", {
  variants: {
    direction: {
      vertical: "join-vertical",
      horizontal: "join-horizontal",
    },
    auto: {
      true: "[&>:not([data-ui])]:join-item [&>[data-ui]>:not([data-tip])]:join-item [&>[data-ui]>[data-tip]>*]:join-item",
    },
    equal: {
      true: "flex flex-row flex-wrap max-w-full [&>*]:flex-1 [&>[data-ui]>*]:flex-1 [&>[data-ui]>[data-tip]>*]:flex-1",
    },
    surface: {
      "base-100": "bg-surface",
      "base-200": "bg-surface-container",
      "base-300": "bg-surface-container-highest",
    },
  },
});

export const joinItem = rcva("join-item");

export type JoinVariants = VariantProps<typeof join>;

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
