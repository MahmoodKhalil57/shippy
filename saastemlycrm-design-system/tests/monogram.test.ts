import { describe, expect, it } from "vite-plus/test";
import { MONOGRAM_HUES, monogramHue, monogramLetters } from "../src/components/base/monogram.ts";

/**
 * Monograms (src/components/base/monogram.ts), over every name of up to three words drawn from a
 * small alphabet of words (with letters, digits, Arabic, punctuation and empty parts):
 * - the hue is a whole number 0 to 5, and the same name always gives the same hue;
 * - the letters are one or two characters, upper case, each the first of a word of the name, or
 *   "#" when no word starts with a letter or digit.
 */
const WORDS = ["Delta", "offshore", "MV", "9600777", "شركة", "—", "(rig", "", "x"];

function* names(n: number): Generator<string> {
  if (n === 0) return yield "";
  for (const rest of names(n - 1)) for (const w of WORDS) yield rest ? `${rest} ${w}` : w;
}

describe("monogram", () => {
  it("gives every name a hue of the six and its words' first letters", () => {
    const bad: string[] = [];
    let cases = 0;
    for (let n = 1; n <= 3; n++)
      for (const name of names(n)) {
        cases++;
        const hue = monogramHue(name);
        if (!Number.isInteger(hue) || hue < 0 || hue >= MONOGRAM_HUES) bad.push(`${name}: hue ${hue}`);
        if (monogramHue(name) !== hue) bad.push(`${name}: hue not stable`);
        const letters = monogramLetters(name);
        const starts = name
          .split(/[\s\-–—/·,.()]+/)
          .filter((w) => /^[\p{L}\p{N}]/u.test(w))
          .map((w) => String.fromCodePoint(w.codePointAt(0)!).toUpperCase());
        if (!starts.length) {
          if (letters !== "#") bad.push(`${name}: expected #`);
          continue;
        }
        const chars = Array.from(letters);
        if (chars.length < 1 || chars.length > 2) bad.push(`${name}: ${letters}`);
        if (chars[0] !== starts[0] || (starts.length > 1 && chars[1] !== starts[starts.length - 1]))
          bad.push(`${name}: ${letters} from ${starts.join("")}`);
      }
    expect(cases).toBe(9 + 81 + 729);
    expect(bad).toEqual([]);
  });

  it("reads real names", () => {
    expect(monogramLetters("Delta Offshore Services")).toBe("DS");
    expect(monogramLetters("MV Corallo")).toBe("MC");
    expect(monogramLetters("GS-RFQ-0142")).toBe("G0");
    expect(monogramLetters("  ")).toBe("#");
  });
});
