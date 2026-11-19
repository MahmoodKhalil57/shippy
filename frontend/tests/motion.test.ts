import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import {
  bezierAt,
  EMPHASIZED,
  motionCss,
  motionCssPath,
  SETTLE,
  settleTime,
  springAt,
  springs,
} from "../plugins/motion.ts";

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

  it("emphasized is one continuous path from (0, 0) to (1, 1)", () => {
    expect(bezierAt(EMPHASIZED[0]!, 0)).toEqual({ x: 0, y: 0 });
    expect(bezierAt(EMPHASIZED[0]!, 1)).toEqual(bezierAt(EMPHASIZED[1]!, 0));
    expect(bezierAt(EMPHASIZED[1]!, 1)).toEqual({ x: 1, y: 1 });
  });

  it("points Tailwind's defaults at M3's tokens", () => {
    const css = motionCss();
    expect(css).toContain("--default-transition-timing-function: var(--ease-effects);");
    expect(css).toContain("--ease-in-out: var(--ease-standard);");
    expect(css).not.toMatch(/--animate-[\w-]+:[^;]*cubic-bezier/);
  });
});
