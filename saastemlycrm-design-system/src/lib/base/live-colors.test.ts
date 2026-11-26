import { describe, it, expect, vi, afterEach } from "vite-plus/test";
import { liveColors } from "./live-colors";

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.documentElement.removeAttribute("data-theme");
});

const host = () => {
  const el = document.createElement("div");
  el.style.color = "rgb(10, 20, 30)";
  document.body.append(el);
  return el;
};

describe("liveColors", () => {
  it("resolves any CSS colour to rgb and caches it", () => {
    const el = host();
    try {
      const colors = liveColors(el, () => {});
      const spy = vi.spyOn(HTMLCanvasElement.prototype, "getContext");
      expect(colors.resolve("red")).toBe("rgb(255, 0, 0)");
      expect(colors.resolve("#00ff00")).toBe("rgb(0, 255, 0)");
      expect(colors.resolve("red")).toBe("rgb(255, 0, 0)");
      expect(spy).toHaveBeenCalledTimes(2);
      expect(colors.resolve("not-a-colour")).toBe("rgb(0, 0, 0)");
    } finally {
      el.remove();
    }
  });

  it("resolves currentColor from the host and re-reads it after a theme change", async () => {
    const el = host();
    let changes = 0;
    const colors = liveColors(el, () => changes++);
    colors.connect();
    try {
      expect(colors.resolve(" CurrentColor ")).toBe("rgb(10, 20, 30)");
      el.style.color = "rgb(1, 2, 3)";
      expect(colors.resolve("currentcolor")).toBe("rgb(10, 20, 30)");
      document.documentElement.setAttribute("data-theme", "dark");
      await vi.waitFor(() => expect(changes).toBe(1));
      expect(colors.resolve("currentcolor")).toBe("rgb(1, 2, 3)");
    } finally {
      colors.disconnect();
      el.remove();
    }
    document.documentElement.setAttribute("data-theme", "light");
    await frame();
    expect(changes).toBe(1);
  });

  it("follows the dark-scheme media query while connected", () => {
    const listeners = new Set<() => void>();
    const mql = {
      addEventListener: (_: string, f: () => void) => listeners.add(f),
      removeEventListener: (_: string, f: () => void) => listeners.delete(f),
    };
    vi.stubGlobal("matchMedia", () => mql);
    const changed = vi.fn();
    const colors = liveColors(document.body, changed);
    colors.connect();
    expect(listeners.size).toBe(1);
    for (const f of listeners) f();
    expect(changed).toHaveBeenCalledTimes(1);
    colors.disconnect();
    expect(listeners.size).toBe(0);
  });

  it("works without matchMedia", () => {
    vi.stubGlobal("matchMedia", undefined);
    const colors = liveColors(document.body, () => {});
    expect(() => {
      colors.connect();
      colors.disconnect();
    }).not.toThrow();
  });

  it("returns the value unchanged when no 2D context is available", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(liveColors(document.body, () => {}).resolve("teal")).toBe("teal");
  });
});
