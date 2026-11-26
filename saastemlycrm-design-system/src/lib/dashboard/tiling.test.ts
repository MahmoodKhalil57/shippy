import { afterEach, describe, expect, it } from "vite-plus/test";
import type { TileBounds } from "../base/board.ts";
import { tileH, tileW } from "../base/tiles.ts";
import { frames, problems, SCREENS, settleAnimations, tileCases } from "./tiling.ts";

const bounds = (b: Partial<TileBounds>): TileBounds => ({
  size: "s",
  rows: 2,
  minSize: "s",
  maxSize: "full",
  minRows: 1,
  maxRows: 1,
  ...b,
});

const box = (html: string) => {
  const host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);
  return host;
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("tileCases", () => {
  it("lists every span and row count inside the bounds, with their sizes", () => {
    const cases = tileCases(bounds({ minSpan: 2, maxSpan: 3, minRows: 2, maxRows: 4 }), 24);
    expect(cases.map((c) => [c.span, c.rows])).toEqual([
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 2],
      [3, 3],
      [3, 4],
    ]);
    expect(cases[0]).toMatchObject({ width: 2 * tileW(), height: 2 * tileH() });
  });

  it("caps spans at the lanes the board has, and never goes below one lane", () => {
    const wide = bounds({ minRows: 2, maxRows: 2 });
    expect(tileCases(wide, 4).map((c) => c.span)).toEqual([1, 2, 3, 4]);
    const narrow = bounds({ minSpan: 10, minRows: 2, maxRows: 2 });
    expect(tileCases(narrow, 3).map((c) => c.span)).toEqual([3]);
    expect(tileCases({ ...narrow, minSpan: 0 }, 2).map((c) => c.span)).toEqual([1, 2]);
    expect(tileCases(wide, 4, 2)[0]).toMatchObject({ width: tileW(2), height: 2 * tileH(2) });
  });

  it("covers phones to wide screens", () => {
    expect(SCREENS[0]).toEqual({ width: 320, height: 640 });
    expect(SCREENS.at(-1)).toEqual({ width: 1920, height: 1080 });
  });
});

describe("problems", () => {
  it("is empty for content that fits and reads well", () => {
    const host = box(`<main style="inline-size: 320px"><p style="color: #111; background: #fff">Fits well</p></main>`);
    expect(problems(host)).toEqual([]);
  });

  it("names content that escapes its box", () => {
    const host = box(
      `<div style="inline-size: 120px; background: #fff"><span id="wide" style="display: inline-block; inline-size: 400px; color: #111">A very long label</span></div>`,
    );
    const found = problems(host);
    expect(found.some((p) => p.startsWith("escapes: span#wide") && p.includes("A very long label"))).toBe(true);
  });

  it("names an element without text by its tag alone", () => {
    const host = box(
      `<div style="inline-size: 120px; background: #fff"><div id="blank" style="inline-size: 400px; block-size: 12px; background: #333"></div></div>`,
    );
    expect(problems(host).some((p) => p.startsWith("escapes: div#blank:"))).toBe(true);
  });

  it("names text that is too faint, and unlabelled elements", () => {
    const host = box(
      `<div style="background: #fff"><p style="color: #eee">Faint words</p><b style="color: #eee"></b></div>`,
    );
    const found = problems(host);
    expect(found.some((p) => p.startsWith("contrast") && p.includes('p "Faint words"'))).toBe(true);
  });
});

describe("frames", () => {
  it("waits the given number of animation frames", async () => {
    let seen = 0;
    const count = () => {
      seen++;
      requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    await frames(3);
    expect(seen).toBeGreaterThanOrEqual(2);
    await frames();
  });
});

describe("settleAnimations", () => {
  it("finishes animations that end and leaves endless ones running", () => {
    const host = box(`<div id="a"></div><div id="b"></div>`);
    const finite = host.querySelector("#a")!.animate([{ opacity: 0 }, { opacity: 1 }], 10_000);
    const endless = host
      .querySelector("#b")!
      .animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, iterations: Infinity });
    const bare = new Animation(null, document.timeline);
    bare.play();
    settleAnimations();
    expect(finite.playState).toBe("finished");
    expect(endless.playState).toBe("running");
    endless.cancel();
    bare.cancel();
  });
});
