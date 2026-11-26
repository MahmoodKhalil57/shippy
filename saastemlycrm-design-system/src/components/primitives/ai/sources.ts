import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.ts";
import { rcva } from "../../../lib/base/variants.ts";
import { inset, pad, padStart, row, stack, text } from "../../../styles/algebra.ts";
import { iconSvg } from "../media/icon.ts";
import { m } from "../../../lib/i18n/index.ts";

export const sources = rcva(`${text.label} group/sources text-body-sm`);
export const sourcesSummary = rcva(
  `${row} ${pad["1.5"]} touch-target w-fit cursor-pointer list-none items-center gap-1.5 rounded-field py-1 font-medium text-on-surface-variant state-layer [&::-webkit-details-marker]:hidden`,
);
export const sourcesChevron = rcva(
  "transition-transform duration-(--duration-spatial-fast) ease-spatial-fast group-open/sources:rotate-180 motion-reduce:transition-none",
);
export const sourcesList = rcva(`${stack} ${padStart["1"]} mt-1 gap-0.5 border-s-2 border-outline-variant`);
export const sourcesLink = rcva(
  `${row} ${inset["2"]} touch-target items-center gap-1.5 rounded-field py-1 state-layer`,
);
export const sourcesLabel = rcva(`${text.line} flex-1`);

export interface Source {
  label: string;
  href: string;
}

@customElement("ui-sources")
export class UiSources extends LightElement {
  @property({ attribute: false }) items: Source[] = [];
  @property({ type: Boolean }) open = false;

  render() {
    const first = new Map<string, Source>();
    for (const s of this.items) if (!first.has(s.href)) first.set(s.href, s);
    const unique = [...first.values()];
    if (!unique.length) return html``;
    return html`<details class=${sources()} ?open=${this.open}>
      <summary class=${sourcesSummary()}>
        ${iconSvg("globe", { size: "sm" })} ${m.sources_used({ count: unique.length })}
        <span class=${sourcesChevron()}>${iconSvg("chevron-down", { size: "xs" })}</span>
      </summary>
      <div class=${sourcesList()} role="list">
        ${unique.map((s) => {
          const external = !s.href.startsWith("/");
          return html`<div role="listitem">
            <a
              class=${sourcesLink()}
              href=${s.href}
              target=${external ? "_blank" : "_self"}
              rel=${external ? "noreferrer noopener" : ""}
            >
              ${iconSvg(external ? "external" : "link", { size: "xs" })}
              <span class=${sourcesLabel()}>${s.label}</span>
            </a>
          </div>`;
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
