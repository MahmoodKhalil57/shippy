import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";
import { inlineRow, row, text } from "../layout/algebra.ts";

export const kbd = rcva("kbd", {
  variants: {
    size: {
      xs: "kbd-xs",
      sm: "kbd-sm",
      md: "kbd-md",
      lg: "kbd-lg",
      xl: "kbd-xl",
    },
  },
});

export const kbdRow = rcva(`${row} w-full justify-center`, {
  variants: {
    gap: {
      none: "",
      sm: "gap-1",
      xl: "gap-12",
    },
    spaced: { true: "my-1" },
  },
  defaultVariants: { gap: "sm" },
});

export const kbdKeys = rcva(`${inlineRow} ${text.label} items-center gap-1 text-body-sm text-on-surface-variant`);

export type KbdVariants = VariantProps<typeof kbd> & VariantProps<typeof kbdRow>;

@customElement("ui-kbd")
export class UiKbd extends LightElement {
  @property() size: KbdVariants["size"];
  @property({ converter: (v) => v?.split("+").map((k) => k.trim()) ?? [] }) keys: string[] = [];
  @property() separator = "+";
  @property({ attribute: false }) rows: string[][] = [];
  @property() gap: KbdVariants["gap"] = "sm";
  @property({ converter: responsiveBoolean }) spaced: Responsive<boolean> = false;

  render() {
    const cls = kbd({ size: this.size });
    if (this.rows.length) {
      return this.rows.map(
        (row) =>
          html`<div class=${kbdRow({ gap: this.gap, spaced: this.spaced })}>
            ${row.map((k) => html`<kbd class=${cls}>${k}</kbd>`)}
          </div>`,
      );
    }
    if (!this.keys.length) return html`<kbd class=${cls}>${this.content}</kbd>`;
    return html`<span class=${kbdKeys()}
      >${this.keys.map((k, i) => html`${i && this.separator ? html`<span>${this.separator}</span>` : ""}<kbd class=${cls}>${k}</kbd>`)}</span
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-kbd": UiKbd;
  }
}
