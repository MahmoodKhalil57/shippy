import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import { MAX_WAIT_MS, ON_TIME_MS, START_PER_FRAME, holdIcon, pace } from "./icon-motion";

describe("pace", () => {
  it("starts up to two icons per on-time frame", () => {
    expect(START_PER_FRAME).toBe(2);
    expect(pace(16, [0, 5, 9])).toEqual({ start: [0, 1], skip: [] });
    expect(pace(ON_TIME_MS, [1])).toEqual({ start: [0], skip: [] });
    expect(pace(0, [])).toEqual({ start: [], skip: [] });
  });

  it("starts nothing on a late frame and finishes icons that waited too long", () => {
    expect(pace(ON_TIME_MS + 1, [0, MAX_WAIT_MS, MAX_WAIT_MS - 1, 9999])).toEqual({ start: [], skip: [1, 3] });
  });
});

const SVG = "http://www.w3.org/2000/svg";
let now = 0;
let frames: FrameRequestCallback[] = [];
const els: Element[] = [];

const frame = (ms = 16) => {
  now += ms;
  const due = frames;
  frames = [];
  for (const cb of due) cb(now);
};

const icon = (offscreen = false) => {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  if (offscreen) svg.setAttribute("style", "position:fixed;top:-500px;left:0");
  const rect = document.createElementNS(SVG, "rect");
  rect.setAttribute("width", "20");
  rect.setAttribute("height", "20");
  const anim = document.createElementNS(SVG, "animate");
  anim.setAttribute("attributeName", "x");
  anim.setAttribute("from", "0");
  anim.setAttribute("to", "10");
  anim.setAttribute("dur", "1s");
  rect.append(anim);
  svg.append(rect);
  document.body.append(svg);
  els.push(svg);
  return svg;
};

beforeEach(() => {
  now = 1000;
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
  vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
  while (frames.length) frame(1000);
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const el of els.splice(0)) el.remove();
});

describe("holdIcon", () => {
  it("ignores non-SVG and missing elements", () => {
    const div = document.createElement("div");
    expect(() => {
      holdIcon(undefined);
      holdIcon(div);
    }).not.toThrow();
  });

  it("pauses an icon at its start and plays it once it is seen, two per frame", async () => {
    const icons = [icon(), icon(), icon()];
    for (const s of icons) holdIcon(s);
    for (const s of icons) {
      expect(s.animationsPaused()).toBe(true);
      expect(s.getCurrentTime()).toBe(0);
    }
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    expect(icons.map((s) => s.animationsPaused())).toEqual([false, false, true]);
    frame();
    expect(icons[2]!.animationsPaused()).toBe(false);
    expect(frames).toHaveLength(0);
  });

  it("holds an icon only once", async () => {
    const s = icon();
    holdIcon(s);
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    expect(s.animationsPaused()).toBe(false);
    holdIcon(s);
    expect(s.animationsPaused()).toBe(false);
  });

  it("finishes icons that waited through late frames", async () => {
    const icons = [icon(), icon(), icon()];
    for (const s of icons) holdIcon(s);
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    frame(100);
    expect(icons[2]!.animationsPaused()).toBe(true);
    frame(MAX_WAIT_MS);
    expect(icons[2]!.animationsPaused()).toBe(false);
    expect(icons[2]!.getCurrentTime()).toBeGreaterThanOrEqual(3600);
    expect(frames).toHaveLength(0);
  });

  it("drops icons removed before their turn", async () => {
    const a = icon();
    holdIcon(a);
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    a.remove();
    frame();
    expect(a.animationsPaused()).toBe(true);
    expect(frames).toHaveLength(0);
  });

  it("waits for off-screen icons to scroll into view", async () => {
    const s = icon(true);
    holdIcon(s);
    const seen = icon();
    holdIcon(seen);
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    expect(seen.animationsPaused()).toBe(false);
    expect(s.animationsPaused()).toBe(true);
    s.removeAttribute("style");
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    expect(s.animationsPaused()).toBe(false);
  });

  it("jumps straight to the end under reduced motion", async () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
    const s = icon();
    holdIcon(s);
    await vi.waitFor(() => expect(s.animationsPaused()).toBe(false));
    expect(s.getCurrentTime()).toBeGreaterThanOrEqual(3600);
    expect(frames).toHaveLength(0);
  });

  it("animates normally where matchMedia is missing", async () => {
    vi.stubGlobal("matchMedia", undefined);
    const s = icon();
    holdIcon(s);
    await vi.waitFor(() => expect(frames).toHaveLength(1));
    frame();
    expect(s.animationsPaused()).toBe(false);
    expect(s.getCurrentTime()).toBeLessThan(3600);
  });
});
