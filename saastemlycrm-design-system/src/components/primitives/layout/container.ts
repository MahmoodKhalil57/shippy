import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../../lib/base/variants.ts";

export const container = rcva("w-full", {
  variants: {
    width: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      prose: "max-w-prose",
      full: "max-w-full",
    },
    centered: { true: "mx-auto" },
    paddingX: {
      fluid: "w-full px-[min(clamp(1rem,3cqi,1.5rem),max(0px,calc((100%_-_7rem)/2)))]",
      slack:
        "w-full px-[min(max(var(--frame-pad-x,var(--frame-slack,0px)),calc((100%_-_var(--tile-w)*24)/2)),max(0px,calc((100%_-_7rem)/2)))]",
      "0": "w-full px-0",
      "1": "w-full px-[min(4px,max(0px,calc((100%_-_7rem)/2)))]",
      "2": "w-full px-[min(8px,max(0px,calc((100%_-_7rem)/2)))]",
      "3": "w-full px-[min(12px,max(0px,calc((100%_-_7rem)/2)))]",
      "4": "w-full px-[min(16px,max(0px,calc((100%_-_7rem)/2)))]",
      "5": "w-full px-[min(20px,max(0px,calc((100%_-_7rem)/2)))]",
      "6": "w-full px-[min(24px,max(0px,calc((100%_-_7rem)/2)))]",
      "8": "w-full px-[min(32px,max(0px,calc((100%_-_7rem)/2)))]",
      "10": "w-full px-[min(40px,max(0px,calc((100%_-_7rem)/2)))]",
      "12": "w-full px-[min(48px,max(0px,calc((100%_-_7rem)/2)))]",
      "16": "w-full px-[min(64px,max(0px,calc((100%_-_7rem)/2)))]",
    },
    paddingY: {
      fluid: "py-[clamp(1rem,3cqi,1.5rem)]",
      half: "py-[calc(var(--tile-h)/2)]",
      "0": "py-0",
      "1": "py-1",
      "2": "py-2",
      "3": "py-3",
      "4": "py-4",
      "5": "py-5",
      "6": "py-6",
      "8": "py-8",
      "10": "py-10",
      "12": "py-12",
      "16": "py-16",
    },
  },
  defaultVariants: { width: "7xl", centered: true },
});

export type ContainerVariants = VariantProps<typeof container>;

const CONTAINER_TAGS = {
  div: literal`div`,
  main: literal`main`,
  section: literal`section`,
  article: literal`article`,
} satisfies Record<string, StaticValue>;

export type ContainerTag = keyof typeof CONTAINER_TAGS;

@customElement("ui-container")
export class UiContainer extends LightElement {
  @property() as: ContainerTag = "div";
  @property() width: ContainerVariants["width"];
  @property({ converter: responsiveBoolean }) centered: Responsive<boolean> = true;
  @property({ attribute: "padding-x" }) paddingX: ContainerVariants["paddingX"];
  @property({ attribute: "padding-y" }) paddingY: ContainerVariants["paddingY"];

  render() {
    const tag = CONTAINER_TAGS[this.as] ?? CONTAINER_TAGS.div;
    const cls = container({
      width: this.width,
      centered: this.centered,
      paddingX: this.paddingX,
      paddingY: this.paddingY,
    });
    return html`<${tag} class=${cls}>${this.content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-container": UiContainer;
  }
}
