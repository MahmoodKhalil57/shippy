import { describe, expect, it } from "vite-plus/test";
import { contrast, luminance, sampleBehind, scrimFor } from "../src/components/primitives/layout/legibility.ts";

describe("legible chrome over a background image", () => {
  it("measures WCAG luminance and contrast", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1);
    expect(luminance(0, 0, 0)).toBe(0);
    expect(contrast(1, 0)).toBeCloseTo(21);
  });

  it("needs only the floor scrim when the image already contrasts with the theme's ink", () => {
    // Dark theme (light ink, dark surface) over a dark image; light theme over a bright one.
    expect(scrimFor(Array(100).fill(0.01), 0.8, 0.02, 5, 0)).toBe(0);
    expect(scrimFor(Array(100).fill(0.9), 0.02, 0.95, 5, 0)).toBe(0);
  });

  it("adds just enough of the theme's surface to keep the target contrast over a busy image", () => {
    const samples = [...Array(50).fill(0.05), ...Array(50).fill(0.7)]; // dark sea, bright sky
    for (const [ink, surface] of [
      [0.8, 0.02], // dark theme
      [0.02, 0.95], // light theme
    ] as const) {
      const a = scrimFor(samples, ink, surface, 5, 0, 1);
      const worst = ink > surface ? 0.7 : 0.05;
      expect(contrast(ink, a * surface + (1 - a) * worst)).toBeGreaterThanOrEqual(4.99);
    }
  });

  it("maps a region to the pixels behind it under background-size: cover", () => {
    // A 2×1 image (left dark, right bright) covering a 200×100 frame.
    const luma = { width: 2, height: 1, data: new Float32Array([0, 1]) };
    const frame = { x: 0, y: 0, width: 200, height: 100 };
    expect(sampleBehind(luma, frame, { x: 0, y: 0, width: 50, height: 100 }, 4).every((v) => v === 0)).toBe(true);
    expect(sampleBehind(luma, frame, { x: 150, y: 0, width: 50, height: 100 }, 4).every((v) => v === 1)).toBe(true);
  });
});
