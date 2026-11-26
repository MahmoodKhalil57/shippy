import { describe, it, expect } from "vite-plus/test";
import { inlineStep, isRtl, nextKey, previousKey } from "./reading";

const placed = (dir: "ltr" | "rtl") => {
  const el = document.createElement("div");
  el.dir = dir;
  document.body.append(el);
  return el;
};

describe("isRtl", () => {
  it("reads the computed direction of a connected element", () => {
    const rtl = placed("rtl");
    const ltr = placed("ltr");
    try {
      expect(isRtl(rtl)).toBe(true);
      expect(isRtl(ltr)).toBe(false);
    } finally {
      rtl.remove();
      ltr.remove();
    }
  });

  it("falls back to the language direction without a connected element", () => {
    const loose = document.createElement("div");
    loose.dir = "rtl";
    expect(isRtl(loose)).toBe(false);
    expect(isRtl(null)).toBe(false);
    expect(isRtl()).toBe(false);
  });
});

describe("inlineStep", () => {
  it("ignores keys that are not left or right", () => {
    expect(inlineStep("ArrowUp")).toBe(0);
    expect(inlineStep("Enter")).toBe(0);
  });

  it("moves forward on the right arrow and back on the left in left-to-right text", () => {
    expect(inlineStep("ArrowRight")).toBe(1);
    expect(inlineStep("ArrowLeft")).toBe(-1);
  });

  it("swaps the arrows in right-to-left text", () => {
    const el = placed("rtl");
    try {
      expect(inlineStep("ArrowRight", el)).toBe(-1);
      expect(inlineStep("ArrowLeft", el)).toBe(1);
    } finally {
      el.remove();
    }
  });
});

describe("nextKey and previousKey", () => {
  it("name the arrows that move forward and back", () => {
    expect(nextKey()).toBe("ArrowRight");
    expect(previousKey()).toBe("ArrowLeft");
    const el = placed("rtl");
    try {
      expect(nextKey(el)).toBe("ArrowLeft");
      expect(previousKey(el)).toBe("ArrowRight");
    } finally {
      el.remove();
    }
  });
});
