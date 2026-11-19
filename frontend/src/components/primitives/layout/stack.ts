import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement, type Renderable } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Stack: Visually stacks elements on top of each other.
 *
 * Purpose: Layout & page structure · Kind: primitive
 * Docs: https://daisyui.com/components/stack/
 *
 * daisyUI styles the stack's *direct* children, so the layers are rendered by
 * this element (`layers`), not passed as nested `ui-*` tags (a host element in
 * between would break `.stack > *`). Without `layers`, authored children are
 * rendered as-is (plain elements only).
 */
export const stack = rcva("stack", {
  variants: {
    /** Which side the stacked layers peek out from (bottom is default). */
    align: {
      top: "stack-top",
      bottom: "stack-bottom",
      start: "stack-start",
      end: "stack-end",
    },
    /** Sizes used in the docs examples. */
    size: {
      sm: "h-20 w-32",
      md: "size-28",
      lg: "w-48",
    },
  },
});

/** One layer of the stack (docs: colored boxes, images, cards). */
export const stackLayer = rcva("", {
  variants: {
    look: {
      primary: "bg-primary text-primary-content grid place-content-center rounded-box",
      secondary: "bg-secondary text-secondary-content grid place-content-center rounded-box",
      accent: "bg-accent text-accent-content grid place-content-center rounded-box",
      neutral: "bg-neutral text-neutral-content grid place-content-center rounded-box",
      /** Bordered card (docs "stacked cards"). */
      card: "card bg-surface border border-base-content text-center",
      /** Raised card (docs "stacked cards with shadow"). */
      "card-raised": "card bg-surface shadow-elevation-1",
      /** Filled card (docs "stacked cards" with shadows). */
      "card-filled": "card bg-surface-container text-center",
      image: "rounded-box",
    },
    /** M3 elevation of a layer. */
    elevation: {
      "1": "shadow-elevation-1",
      "2": "shadow-elevation-2",
    },
  },
});

export const stackLayerBody = rcva("card-body");
export const stackLayerTitle = rcva("card-title");

export type StackVariants = VariantProps<typeof stack>;
export type StackLayerVariants = VariantProps<typeof stackLayer>;

export type StackLayer =
  | string
  | ({ content?: Renderable; heading?: Renderable; src?: string; alt?: string } & StackLayerVariants);

/**
 * @example <ui-stack size="md" .layers=${[{ look: "primary", content: "1" }, { look: "accent", content: "2" }, { look: "secondary", content: "3" }]}></ui-stack>
 * @example <ui-stack size="lg" .layers=${["/a.webp", "/b.webp", "/c.webp"]}></ui-stack>
 * @example <ui-stack align="top" size="md" .layers=${[{ look: "card", content: "A" }, { look: "card", content: "B" }]}></ui-stack>
 *
 * A string layer is an image URL. Card layers render a `card-body` (with an
 * optional `card-title` from `heading`).
 */
@customElement("ui-stack")
export class UiStack extends LightElement {
  @property() align: StackVariants["align"];
  @property() size: StackVariants["size"];
  @property({ attribute: false }) layers: StackLayer[] = [];

  private _layer(layer: StackLayer) {
    const l = typeof layer === "string" ? { src: layer } : layer;
    if (l.src) {
      return html`<img
        src=${l.src}
        alt=${l.alt ?? ""}
        class=${stackLayer({ look: l.look ?? "image", elevation: l.elevation })}
      />`;
    }
    const isCard = typeof l.look === "string" && l.look.startsWith("card");
    return html`<div class=${stackLayer({ look: l.look, elevation: l.elevation })}>
      ${
        isCard
          ? html`<div class=${stackLayerBody()}>
              ${l.heading ? html`<h2 class=${stackLayerTitle()}>${l.heading}</h2>` : ""} ${l.content}
            </div>`
          : l.content
      }
    </div>`;
  }

  render() {
    return html`<div class=${stack({ align: this.align, size: this.size })}>
      ${
        this.layers.length
          ? repeat(
              this.layers,
              (_, i) => i,
              (l) => this._layer(l),
            )
          : this.content
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-stack": UiStack;
  }
}
