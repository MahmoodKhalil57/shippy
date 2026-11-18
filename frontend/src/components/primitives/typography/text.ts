import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Text: body copy, captions, labels and inline emphasis.
 *
 * Purpose: Typography · Kind: primitive (Shippy, not daisyUI)
 *
 * Every variant is responsive, e.g. `size="sm md:base"`. Variant options are
 * written out inline (not shared constants) so the CSS plugin can read them
 * for responsive values.
 */
export const text = rcva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      "base-content": "text-base-content",
      muted: "text-base-content/70",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      neutral: "text-neutral",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
      start: "text-start",
      end: "text-end",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    clamp: {
      "1": "line-clamp-1",
      "2": "line-clamp-2",
      "3": "line-clamp-3",
      "4": "line-clamp-4",
      "5": "line-clamp-5",
      "6": "line-clamp-6",
    },
    truncate: { true: "truncate" },
    mono: { true: "font-mono" },
    italic: { true: "italic" },
    uppercase: { true: "uppercase" },
  },
});

export type TextVariants = VariantProps<typeof text>;

const TEXT_TAGS = {
  p: literal`p`,
  span: literal`span`,
  div: literal`div`,
  small: literal`small`,
  strong: literal`strong`,
  em: literal`em`,
  code: literal`code`,
} satisfies Record<string, StaticValue>;

export type TextTag = keyof typeof TEXT_TAGS;

/**
 * @example <ui-text color="muted">Last updated 5 minutes ago</ui-text>
 * @example <ui-text as="span" size="sm md:base" weight="semibold" truncate>Long label…</ui-text>
 * @example <ui-text as="code" mono size="sm">npm i daisyui</ui-text>
 */
@customElement("ui-text")
export class UiText extends LightElement {
  @property() as: TextTag = "p";
  @property() size: TextVariants["size"];
  @property() weight: TextVariants["weight"];
  @property() color: TextVariants["color"];
  @property() align: TextVariants["align"];
  @property() leading: TextVariants["leading"];
  @property() clamp: TextVariants["clamp"];
  @property({ converter: responsiveBoolean }) truncate: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) mono: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) italic: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) uppercase: Responsive<boolean> = false;

  render() {
    const tag = TEXT_TAGS[this.as] ?? TEXT_TAGS.p;
    const cls = text({
      size: this.size,
      weight: this.weight,
      color: this.color,
      align: this.align,
      leading: this.leading,
      clamp: this.clamp,
      truncate: this.truncate,
      mono: this.mono,
      italic: this.italic,
      uppercase: this.uppercase,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-text": UiText;
  }
}
