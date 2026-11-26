import { describe, it, expect } from "vite-plus/test";
import { inlineStart } from "./inline-start";

describe("inlineStart", () => {
  it("returns the left edge in LTR", () => {
    expect(inlineStart(30, 100)).toBe(30);
  });

  it("measures from the right edge in RTL", () => {
    const root = document.documentElement;
    root.dir = "rtl";
    try {
      expect(inlineStart(30, 100)).toBe(root.clientWidth - 130);
    } finally {
      root.removeAttribute("dir");
    }
  });
});
