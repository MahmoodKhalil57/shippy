import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

export const flex = rcva("", {
  variants: {
    inline: { true: "inline-flex! max-w-full", false: "" },
    direction: {
      row: "flex flex-row flex-wrap min-w-0 max-w-full",
      col: "flex flex-col min-w-0",
      "row-reverse": "flex flex-row-reverse flex-wrap min-w-0 max-w-full",
      "col-reverse": "flex flex-col-reverse min-w-0",
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
      "0": "px-0 py-0",
      "1": "px-[min(4px,max(0px,calc((100%_-_7rem)/2)))] py-1",
      "2": "px-[min(8px,max(0px,calc((100%_-_7rem)/2)))] py-2",
      "3": "px-[min(12px,max(0px,calc((100%_-_7rem)/2)))] py-3",
      "4": "px-[min(16px,max(0px,calc((100%_-_7rem)/2)))] py-4",
      "5": "px-[min(20px,max(0px,calc((100%_-_7rem)/2)))] py-5",
      "6": "px-[min(24px,max(0px,calc((100%_-_7rem)/2)))] py-6",
      "8": "px-[min(32px,max(0px,calc((100%_-_7rem)/2)))] py-8",
      "10": "px-[min(40px,max(0px,calc((100%_-_7rem)/2)))] py-10",
      "12": "px-[min(48px,max(0px,calc((100%_-_7rem)/2)))] py-12",
      "16": "px-[min(64px,max(0px,calc((100%_-_7rem)/2)))] py-16",
    },
    wrap: { true: "" },
    grow: { true: "grow" },
    shrink: { true: "min-w-0" },
    fill: { true: "min-w-0 flex-1 basis-0" },
    fullWidth: { true: "w-full" },
    fullHeight: { true: "h-full" },
  },
  defaultVariants: { inline: false, direction: "row" },
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
  @property({ converter: responsiveBoolean }) shrink: Responsive<boolean> = false;
  @property({ type: Boolean }) fill = false;
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
      shrink: this.shrink,
      fill: this.fill,
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
