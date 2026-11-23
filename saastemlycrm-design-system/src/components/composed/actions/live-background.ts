import { html, nothing } from "lit";
import type { LiveBackground } from "../../base/appearance.ts";
import "../../primitives/media/magnet-lines.ts";
import "../../primitives/media/waves.ts";

/**
 * A live background as drawn: behind the app (`<ui-app-shell>` hands it to `<ui-frame>`'s
 * `background`) or, `preview`, small in its tile in the background picker (`<ui-appearance>`),
 * the same effect at the tile's scale. Lines in `currentColor`: the page's quiet text colour.
 * Magnet needles are long, thick and widely spaced, in one colour (no rose tip), so they still
 * read through the frame's two layers of glass.
 */
export function liveBackground(id: LiveBackground | undefined, preview = false) {
  if (id === "live-waves")
    return preview
      ? html`<ui-waves
          line-color="currentColor"
          spacing="9"
          amplitude="0"
          twist="0"
          speed="0"
          line-width="1"
          rotation="90"
          scale="0.4"
          mouse-radius="60"
          mouse-strength="0.9"
          bounce="0.35"
          click-ripple="false"
          intro="false"
          opacity="0.65"
        ></ui-waves>`
      : html`<ui-waves
          line-color="currentColor"
          spacing="28"
          amplitude="0"
          twist="0"
          speed="0"
          line-width="2.75"
          rotation="90"
          scale="0.4"
          mouse-radius="140"
          mouse-strength="0.9"
          bounce="0.35"
          intro="false"
          opacity="0.65"
        ></ui-waves>`;
  if (id === "live-magnet-lines")
    return preview
      ? html`<ui-magnet-lines
          line-color="currentColor"
          accent-color="currentColor"
          spacing="20"
          line-width="1.5"
          line-height="14"
          mode="orbit"
          shape="needle"
          radius="120"
          fade="0"
          base-angle="-180"
          stretch="0.8"
          inertia="0"
          ripple="0"
          click-pulse="false"
          intro="false"
          idle
        ></ui-magnet-lines>`
      : html`<ui-magnet-lines
          line-color="currentColor"
          accent-color="currentColor"
          spacing="56"
          line-width="4"
          line-height="40"
          mode="orbit"
          shape="needle"
          radius="340"
          fade="0"
          base-angle="-180"
          stretch="0.8"
          inertia="0"
          ripple="0"
          click-pulse="false"
          idle
        ></ui-magnet-lines>`;
  return nothing;
}
