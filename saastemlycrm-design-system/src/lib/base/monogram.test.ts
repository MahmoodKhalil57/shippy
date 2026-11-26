import { describe, it, expect } from "vite-plus/test";
import { MONOGRAM_HUES, monogramHue, monogramLetters } from "./monogram";

describe("monogramLetters", () => {
  it("takes the first letters of the first two words", () => {
    expect(monogramLetters("ada lovelace byron")).toBe("AL");
    expect(monogramLetters("Jean-Paul Sartre")).toBe("JP");
    expect(monogramLetters("  cher  ")).toBe("C");
  });

  it("prefers lettered words over numbered ones", () => {
    expect(monogramLetters("3M company")).toBe("C");
    expect(monogramLetters("42 / 7")).toBe("47");
  });

  it("skips words starting with symbols and keeps astral letters whole", () => {
    expect(monogramLetters("@home base")).toBe("B");
    expect(monogramLetters("\u{1D49C}lpha beta")).toBe("\u{1D49C}B");
  });

  it("returns # when nothing is lettered or numbered", () => {
    expect(monogramLetters("")).toBe("#");
    expect(monogramLetters(" — / . ")).toBe("#");
    expect(monogramLetters("@@ !!")).toBe("#");
  });
});

describe("monogramHue", () => {
  it("is stable and within range", () => {
    expect(monogramHue("Ada")).toBe(monogramHue("Ada"));
    expect(monogramHue("")).toBe(0);
    for (const n of ["a", "bb", "Zoë", "x".repeat(500)]) {
      const h = monogramHue(n);
      expect(Number.isInteger(h) && h >= 0 && h < MONOGRAM_HUES).toBe(true);
    }
  });

  it("spreads different names across hues", () => {
    const hues = new Set(["a", "b", "c", "d", "e", "f"].map(monogramHue));
    expect(hues.size).toBe(MONOGRAM_HUES);
  });
});
