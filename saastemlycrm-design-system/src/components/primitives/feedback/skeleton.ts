import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";
import { row, stack } from "../../../styles/algebra.ts";
import { m } from "../../../lib/i18n/index.ts";

export const skeleton = rcva("skeleton", {
  variants: {
    text: { true: "skeleton-text" },
    shape: {
      square: "h-32 w-32 max-w-full",
      circle: "h-16 w-16 shrink-0 rounded-full",
      line: "h-4 w-full",
      block: "h-32 w-full",
    },
    width: {
      full: "w-full",
      "20": "w-20 max-w-full",
      "28": "w-28 max-w-full",
      "32": "w-32 max-w-full",
      "52": "w-52 max-w-full",
    },
    height: {
      "4": "h-4",
      "16": "h-16",
      "32": "h-32",
    },
  },
  defaultVariants: { shape: "square" },
});

export const skeletonStack = rcva(`${stack} gap-4`, {
  variants: {
    width: { "52": "w-52 max-w-full", full: "w-full" },
  },
});
export const skeletonRow = rcva(`${row} items-center gap-4`);

export type SkeletonVariants = VariantProps<typeof skeleton>;

@customElement("ui-skeleton")
export class UiSkeleton extends LightElement {
  @property({ converter: responsiveBoolean }) text: Responsive<boolean> = false;
  @property() shape: SkeletonVariants["shape"];
  @property() width: SkeletonVariants["width"];
  @property() height: SkeletonVariants["height"];
  @property({ type: Number }) lines = 1;
  @property() template?: "circle" | "rectangle";

  private _block(props: Parameters<typeof skeleton>[0]) {
    return html`<div class=${skeleton(props)}></div>`;
  }

  render() {
    if (this.text === true || this.text === "true") {
      return html`<span class=${skeleton({ text: true, shape: null })} aria-busy="true">${this.content}</span>`;
    }
    if (this.template === "circle") {
      return html`<div
        class=${skeletonStack({ width: "52" })}
        role="progressbar"
        aria-busy="true"
        aria-label=${m.skeleton_loading()}
      >
        <div class=${skeletonRow()}>
          ${this._block({ shape: "circle" })}
          <div class=${skeletonStack()}>
            ${this._block({ shape: "line", width: "20" })} ${this._block({ shape: "line", width: "28" })}
          </div>
        </div>
        ${this._block({ shape: "block" })}
      </div>`;
    }
    if (this.template === "rectangle") {
      return html`<div
        class=${skeletonStack({ width: "52" })}
        role="progressbar"
        aria-busy="true"
        aria-label=${m.skeleton_loading()}
      >
        ${this._block({ shape: "block" })} ${this._block({ shape: "line", width: "28" })}
        ${this._block({ shape: "line" })} ${this._block({ shape: "line" })}
      </div>`;
    }
    if (this.lines > 1) {
      const rows = Array.from({ length: this.lines }, (_, i) => i);
      return html`<div class=${skeletonStack()} role="progressbar" aria-busy="true" aria-label=${m.skeleton_loading()}>
        ${repeat(
          rows,
          (i) => i,
          (i) =>
            this._block({
              shape: this.shape ?? "line",
              width: i === rows.length - 1 ? "28" : this.width,
              height: this.height,
            }),
        )}
      </div>`;
    }
    return html`<div
      class=${skeleton({ shape: this.shape, width: this.width, height: this.height, text: this.text })}
      role="progressbar"
      aria-busy="true"
      aria-label=${m.skeleton_loading()}
    ></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-skeleton": UiSkeleton;
  }
}
