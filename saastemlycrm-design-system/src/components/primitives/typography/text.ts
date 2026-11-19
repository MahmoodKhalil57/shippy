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
 * Text is set by its role in the type scale (Material Design 3, src/styles/theme.css), never by a
 * raw size: `variant` picks the role, which brings its size, line height, weight and tracking.
 *   display-*    big numerals and hero text          headline-*   page and dialog titles
 *   title-*      section, card and item titles        body-*       running text, cells, descriptions
 *   label-*      text inside components: tags, captions under fields, counts, metadata
 * `emphasized` is the same role one weight heavier (M3's emphasized styles: unread, selected,
 * the key figure in a sentence). `color="muted"` is the secondary ink (on-surface-variant).
 * With no `variant`, the text takes the style around it.
 *
 * Every variant is responsive, e.g. `variant="body-sm md:body-md"`. Variant options are
 * written out inline (not shared constants) so the CSS plugin can read them
 * for responsive values.
 */
/**
 * Text never makes its container wider: as a flex or grid item it may shrink below its longest
 * word (`min-w-0`), and a word that can't fit then breaks (a file name in a phone-width row).
 */
export const text = rcva("min-w-0 [overflow-wrap:break-word]", {
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
    truncate: { true: "truncate" },
    mono: { true: "font-mono" },
    italic: { true: "italic" },
    uppercase: { true: "uppercase" },
    /** Keep the text's own line breaks and wrap long words (messages, generated answers). */
    "pre-line": { true: "whitespace-pre-line [overflow-wrap:break-word]" },
    /** A search match inside a result (with `as="mark"`). */
    highlight: { true: "rounded-xs bg-primary-container px-0.5 text-on-primary-container" },
  },
});

/**
 * One weight heavier than the role: regular roles (display, body, label, or no role) go to
 * semibold, the semibold roles (headline, title) to bold.
 */
export const textEmphasis = rcva("", { variants: { step: { regular: "font-semibold", strong: "font-bold" } } });
/** The weight step `emphasized` takes for a role (the first one of a responsive value). */
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

/**
 * @example <ui-text variant="body-sm" color="muted">Last updated 5 minutes ago</ui-text>
 * @example <ui-text as="span" variant="title-sm" truncate>Long label…</ui-text>
 * @example <ui-text variant="body-md" emphasized>3 unread</ui-text>
 * @example <ui-text as="code" mono variant="body-md">npm i daisyui</ui-text>
 * @example <ui-text as="mark" highlight>rpc</ui-text>  (a search match)
 */
@customElement("ui-text")
export class UiText extends LightElement {
  @property() as: TextTag = "p";
  /** The type-scale role. */
  @property() variant: TextVariants["variant"];
  /** One weight heavier than the role (M3's emphasized style). */
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
