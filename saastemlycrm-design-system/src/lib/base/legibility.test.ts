import { describe, it, expect } from "vite-plus/test";
import { contrast, cssLuminance, luminance, lumaOf, rgba, sampleBehind, type Luma } from "./legibility";

const picture = async (width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
  const canvas = Object.assign(document.createElement("canvas"), { width, height });
  paint(canvas.getContext("2d")!);
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
  await image.decode();
  return image;
};

describe("luminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(luminance(0, 0, 0)).toBe(0);
    expect(luminance(255, 255, 255)).toBeCloseTo(1, 10);
  });

  it("uses the linear segment for very dark channels", () => {
    expect(luminance(10, 10, 10)).toBeCloseTo(10 / 255 / 12.92, 10);
  });

  it("uses the gamma curve above the knee", () => {
    expect(luminance(128, 128, 128)).toBeCloseTo(((128 / 255 + 0.055) / 1.055) ** 2.4, 10);
  });

  it("weights green most and blue least", () => {
    expect(luminance(0, 255, 0)).toBeCloseTo(0.7152, 4);
    expect(luminance(255, 0, 0)).toBeCloseTo(0.2126, 4);
    expect(luminance(0, 0, 255)).toBeCloseTo(0.0722, 4);
  });
});

describe("contrast", () => {
  it("is 21 between black and white in either order", () => {
    expect(contrast(1, 0)).toBeCloseTo(21, 10);
    expect(contrast(0, 1)).toBeCloseTo(21, 10);
  });

  it("is 1 between equal luminances", () => {
    expect(contrast(0.4, 0.4)).toBe(1);
  });
});

describe("lumaOf", () => {
  it("keeps a small image at its natural size", async () => {
    const image = await picture(4, 2, (ctx) => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 2, 2);
      ctx.fillStyle = "#000";
      ctx.fillRect(2, 0, 2, 2);
    });
    const luma = lumaOf(image);
    expect(luma.width).toBe(4);
    expect(luma.height).toBe(2);
    expect(luma.data.length).toBe(8);
    expect(luma.data[0]).toBeCloseTo(1, 5);
    expect(luma.data[3]).toBe(0);
    expect(luma.data[4]).toBeCloseTo(1, 5);
  });

  it("scales a large image down to fit the longest side", async () => {
    const image = await picture(400, 100, (ctx) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 400, 100);
    });
    const luma = lumaOf(image, 40);
    expect(luma.width).toBe(40);
    expect(luma.height).toBe(10);
    expect([...luma.data].every((v) => v === 0)).toBe(true);
  });

  it("never shrinks a side below one pixel", async () => {
    const image = await picture(300, 1, () => {});
    const luma = lumaOf(image, 10);
    expect(luma.width).toBe(10);
    expect(luma.height).toBe(1);
  });
});

describe("sampleBehind", () => {
  const luma: Luma = { width: 2, height: 2, data: new Float32Array([0.1, 0.2, 0.3, 0.4]) };
  const frame = { x: 0, y: 0, width: 200, height: 200 };

  it("takes steps × steps samples from the covered image cells", () => {
    const out = sampleBehind(luma, frame, { x: 0, y: 0, width: 100, height: 100 }, 3);
    expect(out).toHaveLength(9);
    expect(out.every((v) => Math.abs(v - 0.1) < 1e-6)).toBe(true);
  });

  it("reads the cell under each part of the rect", () => {
    const out = sampleBehind(luma, frame, { x: 0, y: 0, width: 200, height: 200 }, 2);
    expect(out.map((v) => Math.round(v * 10))).toEqual([1, 2, 3, 4]);
  });

  it("clamps samples outside the image to its edges", () => {
    const out = sampleBehind(luma, frame, { x: -500, y: 500, width: 10, height: 10 }, 1);
    expect(out).toHaveLength(1);
    expect(out[0]).toBeCloseTo(0.3, 6);
  });

  it("centres a covering image in a frame of another shape", () => {
    const wide = { x: 0, y: 0, width: 400, height: 200 };
    const out = sampleBehind(luma, wide, { x: 0, y: 100, width: 400, height: 1 }, 2);
    expect(out.map((v) => Math.round(v * 10))).toEqual([3, 4, 3, 4]);
  });

  it("samples twenty by twenty by default", () => {
    expect(sampleBehind(luma, frame, frame)).toHaveLength(400);
  });
});

describe("rgba", () => {
  it("gives transparent black when no canvas context is available, then recovers", () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = (() => null) as typeof original;
    try {
      expect(rgba("#fff")).toEqual([0, 0, 0, 0]);
    } finally {
      HTMLCanvasElement.prototype.getContext = original;
    }
    expect(rgba("#fff")).toEqual([255, 255, 255, 1]);
  });

  it("resolves any CSS colour to channels and alpha", () => {
    expect(rgba("rgb(255 0 0)")).toEqual([255, 0, 0, 1]);
    expect(rgba("blue")).toEqual([0, 0, 255, 1]);
    const [, , , a] = rgba("rgb(0 0 0 / 0.5)");
    expect(a).toBeCloseTo(0.5, 1);
  });

  it("falls back to black for an invalid colour", () => {
    expect(rgba("not a colour")).toEqual([0, 0, 0, 1]);
  });
});

describe("cssLuminance", () => {
  it("is the luminance of the resolved colour", () => {
    expect(cssLuminance("white")).toBeCloseTo(1, 10);
    expect(cssLuminance("black")).toBe(0);
  });
});
