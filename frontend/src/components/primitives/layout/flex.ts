import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Flex: lays its children out in a row or column with consistent spacing.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy, not daisyUI)
 *
 * The layout building block for pages: custom classes are only allowed inside
 * primitives, so spacing and alignment between components come from here.
 * Every variant is responsive, e.g. `direction="col md:row"`.
 */
export const flex = rcva("", {
  variants: {
    inline: { true: "inline-flex", false: "flex" },
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    gap: {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
      "8": "gap-8",
      "10": "gap-10",
      "12": "gap-12",
      "16": "gap-16",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    padding: {
      "0": "p-0",
      "1": "p-1",
      "2": "p-2",
      "3": "p-3",
      "4": "p-4",
      "5": "p-5",
      "6": "p-6",
      "8": "p-8",
      "10": "p-10",
      "12": "p-12",
      "16": "p-16",
    },
    wrap: { true: "flex-wrap" },
    grow: { true: "grow" },
    fullWidth: { true: "w-full" },
    fullHeight: { true: "h-full" },
  },
  defaultVariants: { inline: false },
});

export type FlexVariants = VariantProps<typeof flex>;

const FLEX_TAGS = {
  div: literal`div`,
  section: literal`section`,
  header: literal`header`,
  footer: literal`footer`,
  main: literal`main`,
  nav: literal`nav`,
  aside: literal`aside`,
  ul: literal`ul`,
  ol: literal`ol`,
} satisfies Record<string, StaticValue>;

export type FlexTag = keyof typeof FLEX_TAGS;

/**
 * @example <ui-flex gap="4" align="center"><ui-button>One</ui-button><ui-button>Two</ui-button></ui-flex>
 * @example <ui-flex direction="col md:row" gap="2 md:6" justify="between">…</ui-flex>
 * @example <ui-flex as="nav" wrap="max-sm" gap="2">…</ui-flex>
 *
 * Children (authored content) are laid out directly: component hosts are
 * `display: contents`, so a `<ui-button>` child is the flex item itself.
 */
@customElement("ui-flex")
export class UiFlex extends LightElement {
  @property() as: FlexTag = "div";
  @property({ converter: responsiveBoolean }) inline: Responsive<boolean> = false;
  @property() direction: FlexVariants["direction"];
  @property() gap: FlexVariants["gap"];
  @property() align: FlexVariants["align"];
  @property() justify: FlexVariants["justify"];
  @property() padding: FlexVariants["padding"];
  @property({ converter: responsiveBoolean }) wrap: Responsive<boolean> = false;
  @property({ converter: responsiveBoolean }) grow: Responsive<boolean> = false;
  @property({ attribute: "full-width", converter: responsiveBoolean }) fullWidth: Responsive<boolean> = false;
  @property({ attribute: "full-height", converter: responsiveBoolean }) fullHeight: Responsive<boolean> = false;

  render() {
    const tag = FLEX_TAGS[this.as] ?? FLEX_TAGS.div;
    const cls = flex({
      inline: this.inline,
      direction: this.direction,
      gap: this.gap,
      align: this.align,
      justify: this.justify,
      padding: this.padding,
      wrap: this.wrap,
      grow: this.grow,
      fullWidth: this.fullWidth,
      fullHeight: this.fullHeight,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-flex": UiFlex;
  }
}
