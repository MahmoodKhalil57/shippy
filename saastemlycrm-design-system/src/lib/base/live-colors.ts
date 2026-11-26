export function liveColors(host: HTMLElement, changed: () => void) {
  let current: string | null = null;
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
