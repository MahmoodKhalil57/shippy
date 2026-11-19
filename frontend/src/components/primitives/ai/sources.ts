import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../base/variants.ts";
import { iconSvg } from "../media/icon.ts";

/**
 * Sources: what an answer was based on — "Used 3 sources", opening to the list of links.
 *
 * Purpose: AI · Kind: primitive (Shippy; after the AI Elements "Sources")
 *
 * Paths in the app open in place (the app handles the link); other addresses open in a new tab.
 */
export const sources = rcva("group/sources text-xs");
export const sourcesSummary = rcva(
  "flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-field px-1.5 py-1 -ms-1.5 font-medium text-base-content/80 hover:bg-base-content/5 focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden",
);
export const sourcesChevron = rcva(
  "transition-transform duration-(--duration-effects) ease-effects group-open/sources:rotate-180 motion-reduce:transition-none",
);
export const sourcesList = rcva("mt-1 flex flex-col gap-0.5 border-s-2 border-base-content/10 ps-3");
export const sourcesLink = rcva(
  "flex items-center gap-1.5 rounded-field px-1.5 py-1 -ms-1.5 hover:bg-base-content/5 focus-visible:outline-2 focus-visible:outline-primary",
);
export const sourcesLabel = rcva("min-w-0 truncate");

export interface Source {
  label: string;
  href: string;
}

/**
 * @example <ui-sources .items=${[{ label: "INV/2026/0371", href: "/collections/invoices/inv-0371" }]}></ui-sources>
 */
@customElement("ui-sources")
export class UiSources extends LightElement {
  @property({ attribute: false }) items: Source[] = [];
  @property({ type: Boolean }) open = false;

  render() {
    const unique = [...new Map(this.items.map((s) => [s.href, s])).values()];
    if (!unique.length) return html``;
    return html`<details class=${sources()} ?open=${this.open}>
      <summary class=${sourcesSummary()}>
        ${iconSvg("globe", { size: "sm" })} Used ${unique.length} ${unique.length === 1 ? "source" : "sources"}
        <span class=${sourcesChevron()}>${iconSvg("chevron-down", { size: "xs" })}</span>
      </summary>
      <div class=${sourcesList()} role="list">
        ${unique.map((s) => {
          const external = !s.href.startsWith("/");
          return html`<a
            role="listitem"
            class=${sourcesLink()}
            href=${s.href}
            target=${external ? "_blank" : "_self"}
            rel=${external ? "noreferrer noopener" : ""}
          >
            ${iconSvg(external ? "external" : "link", { size: "xs" })}
            <span class=${sourcesLabel()}>${s.label}</span>
          </a>`;
        })}
      </div>
    </details>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ui-sources": UiSources;
  }
}
