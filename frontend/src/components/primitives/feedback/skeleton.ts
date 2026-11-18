import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Skeleton: Shows a loading state for a component.
 *
 * Purpose: Feedback & system status · Kind: primitive
 * Docs: https://daisyui.com/components/skeleton/
 */
export const skeleton = rcva("skeleton", {
  variants: {
    /** Animated gradient on the text itself instead of a block. */
    text: { true: "skeleton-text" },
    /** Shapes from the docs examples (each with its default size). */
    shape: {
      square: "h-32 w-32",
      circle: "h-16 w-16 shrink-0 rounded-full",
      line: "h-4 w-full",
      block: "h-32 w-full",
    },
    /** Width override (the docs' short lines: `w-20`, `w-28`). */
    width: {
      full: "w-full",
      "20": "w-20",
      "28": "w-28",
      "32": "w-32",
      "52": "w-52",
    },
    /** Height override. */
    height: {
      "4": "h-4",
      "16": "h-16",
      "32": "h-32",
    },
  },
  defaultVariants: { shape: "square" },
});

/** Layouts of the docs' composite examples. */
export const skeletonStack = rcva("flex flex-col gap-4", {
  variants: {
    width: { "52": "w-52", full: "w-full" },
  },
});
export const skeletonRow = rcva("flex items-center gap-4");

export type SkeletonVariants = VariantProps<typeof skeleton>;

/**
 * @example <ui-skeleton></ui-skeleton>                                  <!-- h-32 w-32 -->
 * @example <ui-skeleton shape="line" width="28"></ui-skeleton>
 * @example <ui-skeleton shape="line" lines="3"></ui-skeleton>
 * @example <ui-skeleton template="circle"></ui-skeleton>                 <!-- "circle with content" -->
 * @example <ui-skeleton template="rectangle"></ui-skeleton>              <!-- "rectangle with content" -->
 * @example <ui-skeleton text>AI is thinking harder...</ui-skeleton>
 *
 * In `text` mode the children are the animated text; otherwise children are ignored.
 * `lines` > 1 renders a stack of skeletons (last one shortened).
 */
@customElement("ui-skeleton")
export class UiSkeleton extends LightElement {
  @property({ converter: responsiveBoolean }) text: Responsive<boolean> = false;
  @property() shape: SkeletonVariants["shape"];
  @property() width: SkeletonVariants["width"];
  @property() height: SkeletonVariants["height"];
  @property({ type: Number }) lines = 1;
  /** Ready-made placeholders matching the docs' composite examples. */
  @property() template?: "circle" | "rectangle";

  private _block(props: Parameters<typeof skeleton>[0]) {
    return html`<div class=${skeleton(props)}></div>`;
  }

  render() {
    if (this.text === true || this.text === "true") {
      return html`<span class=${skeleton({ text: true, shape: null })} aria-busy="true">${this.content}</span>`;
    }
    if (this.template === "circle") {
      return html`<div class=${skeletonStack({ width: "52" })} aria-busy="true" aria-label="Loading">
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
      return html`<div class=${skeletonStack({ width: "52" })} aria-busy="true" aria-label="Loading">
        ${this._block({ shape: "block" })} ${this._block({ shape: "line", width: "28" })}
        ${this._block({ shape: "line" })} ${this._block({ shape: "line" })}
      </div>`;
    }
    if (this.lines > 1) {
      const rows = Array.from({ length: this.lines }, (_, i) => i);
      return html`<div class=${skeletonStack()} aria-busy="true" aria-label="Loading">
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
      aria-busy="true"
      aria-label="Loading"
    ></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-skeleton": UiSkeleton;
  }
}
