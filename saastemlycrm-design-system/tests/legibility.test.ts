import { describe, expect, it } from "vite-plus/test";
import { contrast, luminance, sampleBehind } from "../src/components/base/legibility.ts";

describe("legible chrome over a background image", () => {
  it("measures WCAG luminance and contrast", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1);
    expect(luminance(0, 0, 0)).toBe(0);
    expect(contrast(1, 0)).toBeCloseTo(21);
  });

  it("maps a region to the pixels behind it under background-size: cover", () => {
    // A 2×1 image (left dark, right bright) covering a 200×100 frame.
    const luma = { width: 2, height: 1, data: new Float32Array([0, 1]) };
    const frame = { x: 0, y: 0, width: 200, height: 100 };
    expect(sampleBehind(luma, frame, { x: 0, y: 0, width: 50, height: 100 }, 4).every((v) => v === 0)).toBe(true);
    expect(sampleBehind(luma, frame, { x: 150, y: 0, width: 50, height: 100 }, 4).every((v) => v === 1)).toBe(true);
  });
});
