import type { VariantProps } from "class-variance-authority";
import { customElement, property } from "lit/decorators.js";
import { html, literal, type StaticValue } from "lit/static-html.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva, responsiveBoolean, type Responsive } from "../../base/variants.ts";

/**
 * Container: limits content to a readable width, centered, with page padding.
 *
 * Purpose: Layout & page structure · Kind: primitive (Shippy, not daisyUI)
 *
 * Every variant is responsive, e.g. `padding-x="4 md:8"`.
 */
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
      /** Scales with the space it sits in (the app's main panel): 1rem → 2.5rem. */
      fluid: "px-[clamp(1rem,5cqi,2.5rem)]",
      "0": "px-0",
      "1": "px-1",
      "2": "px-2",
      "3": "px-3",
      "4": "px-4",
      "5": "px-5",
      "6": "px-6",
      "8": "px-8",
      "10": "px-10",
      "12": "px-12",
      "16": "px-16",
    },
    paddingY: {
      /** Scales with the space it sits in: 1.5rem → 2.5rem. */
      fluid: "py-[clamp(1.5rem,4cqi,2.5rem)]",
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

/**
 * @example <ui-container as="main" width="5xl" padding-x="4 md:8" padding-y="8">…page…</ui-container>
 * @example <ui-container width="prose">…article…</ui-container>
 */
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
