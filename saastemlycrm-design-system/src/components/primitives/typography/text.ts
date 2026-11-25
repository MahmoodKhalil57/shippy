import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

export const text = rcva("min-w-0 [overflow-wrap:anywhere]", {
  variants: {
    variant: {
      "display-lg": "text-display-lg",
      "display-md": "text-display-md",
      "display-sm": "text-display-sm",
      "headline-lg": "text-headline-lg",
      "headline-md": "text-headline-md",
      "headline-sm": "text-headline-sm",
      "title-lg": "text-title-lg",
      "title-md": "text-title-md",
      "title-sm": "text-title-sm",
      "body-lg": "text-body-lg",
      "body-md": "text-body-md",
      "body-sm": "text-body-sm",
      "label-lg": "text-label-lg",
      "label-md": "text-label-md",
      "label-sm": "text-label-sm",
    },
    color: {
      "base-content": "text-on-surface",
      muted: "text-on-surface-variant",
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
    truncate: { true: "min-w-0 truncate" },
    mono: { true: "font-mono" },
    italic: { true: "italic" },
    uppercase: { true: "uppercase" },
    "pre-line": { true: "whitespace-pre-line [overflow-wrap:break-word]" },
    highlight: { true: "rounded-xs bg-primary-container px-0.5 text-on-primary-container" },
  },
});

export const textEmphasis = rcva("", { variants: { step: { regular: "font-semibold", strong: "font-bold" } } });
export const emphasisStep = (variant: unknown) =>
  /^(headline|title)-/.test(typeof variant === "string" ? variant : "") ? "strong" : "regular";

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

@customElement("ui-text")
export class UiText extends LightElement {
  @property() as: TextTag = "p";
  @property() variant: TextVariants["variant"];
  @property({ type: Boolean }) emphasized = false;
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
      variant: this.variant,
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
    const emphasis = this.emphasized ? textEmphasis({ step: emphasisStep(this.variant) }) : "";
    return html`<${tag} class=${[cls, emphasis].filter(Boolean).join(" ")}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-text": UiText;
  }
}
