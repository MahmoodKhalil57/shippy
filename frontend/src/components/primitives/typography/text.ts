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
      muted: "text-base-content/80",
      primary: "text-primary-ink",
      secondary: "text-secondary-ink",
      accent: "text-accent-ink",
      neutral: "text-neutral",
      info: "text-info-ink",
      success: "text-success-ink",
      warning: "text-warning-ink",
      error: "text-error-ink",
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
    /** Keep the text's own line breaks and wrap long words (messages, generated answers). */
    "pre-line": { true: "whitespace-pre-line [overflow-wrap:anywhere]" },
    /** A search match inside a result (with `as="mark"`). */
    highlight: { true: "rounded-sm bg-primary/20 px-0.5 text-primary" },
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
  mark: literal`mark`,
} satisfies Record<string, StaticValue>;

export type TextTag = keyof typeof TEXT_TAGS;

/**
 * @example <ui-text color="muted">Last updated 5 minutes ago</ui-text>
 * @example <ui-text as="span" size="sm md:base" weight="semibold" truncate>Long label…</ui-text>
 * @example <ui-text as="code" mono size="sm">npm i daisyui</ui-text>
 * @example <ui-text as="mark" highlight>rpc</ui-text>  (a search match)
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
  @property({ converter: responsiveBoolean }) highlight: Responsive<boolean> = false;
  @property({ attribute: "pre-line", converter: responsiveBoolean }) preLine: Responsive<boolean> = false;

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
      highlight: this.highlight,
      "pre-line": this.preLine,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-text": UiText;
  }
}
