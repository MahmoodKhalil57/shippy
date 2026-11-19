import type { VariantProps } from "class-variance-authority";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";

/**
 * Hover 3D card: Wrapper that adds a 3D tilt effect following the mouse.
 *
 * Purpose: Media & visual effects · Kind: primitive
 * Docs: https://daisyui.com/components/hover-3d/
 *
 * daisyUI needs exactly one content element as the first child, followed by
 * 8 empty `<div>` hover zones. This element renders the zones for you.
 */
export const hover3d = rcva("hover-3d", {
  variants: {
    /** Pointer cursor, used when the whole card is a link. */
    link: { true: "cursor-pointer" },
  },
});

/** Rounded image figure used in the docs' image examples. */
export const hover3dFigure = rcva("rounded-lg", {
  variants: {
    /** `md`: the docs' single image (max-w-100). `sm`: the gallery images (w-60). */
    size: {
      sm: "w-60",
      md: "max-w-100",
      full: "w-full",
    },
  },
  defaultVariants: { size: "md" },
});

export type Hover3dVariants = VariantProps<typeof hover3d> & VariantProps<typeof hover3dFigure>;

const ZONES = Array.from({ length: 8 }, () => html`<div></div>`);

/**
 * @example <ui-hover-3d src="/creditcard.webp" alt="3D card"></ui-hover-3d>
 * @example <ui-hover-3d src="/1.webp" size="sm"></ui-hover-3d>   (gallery size)
 * @example <ui-hover-3d href="/cards/1"><ui-card heading="Card"></ui-card></ui-hover-3d>
 *
 * Renders an `<a>` when `href` is set (the whole card becomes a link), otherwise a `<div>`.
 * Several authored elements are wrapped in one `<div>`, because only the first child tilts.
 */
@customElement("ui-hover-3d")
export class UiHover3d extends LightElement {
  /** Shortcut: render an image in a rounded figure as the content. */
  @property() src?: string;
  @property() alt = "";
  /** Width of the `src` figure. */
  @property() size: Hover3dVariants["size"] = "md";
  @property() href?: string;
  @property() target?: string;

  private _body() {
    if (this.src) {
      return html`<figure class=${hover3dFigure({ size: this.size })}><img src=${this.src} alt=${this.alt} /></figure>`;
    }
    const elements = this.contentNodes.filter((n) => n instanceof Element);
    return elements.length === 1 ? elements[0] : html`<div>${this.content}</div>`;
  }

  render() {
    return this.href
      ? html`<a class=${hover3d({ link: true })} href=${this.href} target=${ifDefined(this.target)}
          >${this._body()}${ZONES}</a
        >`
      : html`<div class=${hover3d()}>${this._body()}${ZONES}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-hover-3d": UiHover3d;
  }
}
