/**
 * Colours a canvas effect draws with (`<ui-waves>`, `<ui-magnet-lines>`), resolved from CSS: any
 * colour, `currentColor` as the element's text colour, handed over as plain `rgb()` (the effects
 * parse hex and rgb; a canvas reads any CSS colour back as that). The text colour follows the theme
 * and colour scheme, so it is read again when they change (`data-theme` / `data-scheme` on
 * <html>, the system's light or dark), and `changed` is called to redraw. Read once per change,
 * never per frame: a style read in the middle of a frame could make the browser restyle the page.
 */
export function liveColors(host: HTMLElement, changed: () => void) {
  let current: string | null = null;
  /** Each colour as `rgb(r, g, b)`, whatever CSS wrote it as (oklab, color-mix…): what the effects parse. */
  const plain = new Map<string, string>();
  const rgb = (value: string) => {
    let got = plain.get(value);
    if (got) return got;
    const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    if (!probe) return value;
    probe.fillStyle = "#000";
    probe.fillStyle = value;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    got = `rgb(${r}, ${g}, ${b})`;
    plain.set(value, got);
    return got;
  };
  const dark = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  const again = () => {
    current = null;
    changed();
  };
  const watch = new MutationObserver(again);
  return {
    /** The colour to draw with for `value` (`currentColor`: the element's text colour now). */
    resolve(value: string): string {
      if (value.trim().toLowerCase() !== "currentcolor") return rgb(value);
      current ??= rgb(getComputedStyle(host).color);
      return current;
    },
    connect() {
      watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-scheme"] });
      dark?.addEventListener("change", again);
    },
    disconnect() {
      watch.disconnect();
      dark?.removeEventListener("change", again);
    },
  };
}
