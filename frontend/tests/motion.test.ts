import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { motionCss, motionCssPath, SETTLE, settleTime, springAt, springs } from "../plugins/motion.ts";

describe("Material Design 3 motion tokens", () => {
  it("src/styles/motion.css is up to date (run `vpx plugins/motion.ts`)", () => {
    expect(readFileSync(motionCssPath, "utf8").replace(/\r\n/g, "\n")).toBe(motionCss());
  });

  it("each spring starts at rest and settles on its target", () => {
    for (const spring of Object.values(springs)) {
      expect(springAt(spring, 0)).toBe(0);
      const t = settleTime(spring);
      for (const after of [t, t * 1.5, t * 3]) expect(Math.abs(1 - springAt(spring, after))).toBeLessThan(SETTLE);
    }
  });

  it("stiffer springs are faster", () => {
    expect(settleTime(springs["spatial-fast"])).toBeLessThan(settleTime(springs.spatial));
    expect(settleTime(springs.spatial)).toBeLessThan(settleTime(springs["spatial-slow"]));
    expect(settleTime(springs["effects-fast"])).toBeLessThan(settleTime(springs.effects));
  });
});
