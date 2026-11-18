import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Kbd: Displays keyboard shortcuts.
 *
 * Purpose: Showcase & docs · Kind: primitive
 * Docs: https://daisyui.com/components/kbd/
 */
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

/** One centered row of keys, as in the docs' keyboard / arrow-key layouts. */
export const kbdRow = rcva("flex w-full justify-center", {
  variants: {
    /** Space between keys: `sm` (gap-1, full keyboard), `xl` (gap-12, arrow keys). */
    gap: {
      none: "",
      sm: "gap-1",
      xl: "gap-12",
    },
    /** Vertical spacing between rows (my-1). */
    spaced: { true: "my-1" },
  },
  defaultVariants: { gap: "sm" },
});

export type KbdVariants = VariantProps<typeof kbd> & VariantProps<typeof kbdRow>;

/**
 * @example <ui-kbd size="sm">F</ui-kbd>
 * @example <ui-kbd .keys=${["ctrl", "shift", "del"]}></ui-kbd>  → ctrl + shift + del
 * @example <ui-kbd keys="⌘+⌥+⇧+⌃" separator=""></ui-kbd>       (function keys)
 * @example <ui-kbd .rows=${[["q", "w", "e"], ["a", "s", "d"]]} spaced></ui-kbd>   (full keyboard)
 * @example <ui-kbd .rows=${[["▲"], ["◀︎", "▶︎"], ["▼"]]} gap="xl"></ui-kbd>     (arrow keys)
 *
 * Without `keys` / `rows`, renders one key containing the authored children.
 */
@customElement("ui-kbd")
export class UiKbd extends LightElement {
  @property() size: KbdVariants["size"];
  /** Key combination; each entry becomes its own key. Also accepts "ctrl+shift+del". */
  @property({ converter: (v) => v?.split("+").map((k) => k.trim()) ?? [] }) keys: string[] = [];
  /** Text between `keys`; "" for none. */
  @property() separator = "+";
  /** Keyboard layout: one centered row of keys per entry. */
  @property({ attribute: false }) rows: string[][] = [];
  /** Gap between keys in `rows`. */
  @property() gap: KbdVariants["gap"] = "sm";
  /** Vertical spacing between `rows`. */
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
    return this.keys.map(
      (k, i) => html`${i && this.separator ? html` ${this.separator} ` : i ? " " : ""}<kbd class=${cls}>${k}</kbd>`,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-kbd": UiKbd;
  }
}
