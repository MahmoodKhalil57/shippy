/**
 * A record's monogram: up to two letters from its name and one of the six chart hues, the same
 * name always the same hue. No DOM; tests/monogram.test.ts proves every hue is one of the six and
 * every name gives one or two letters (or "#" when it has none), over a finite domain.
 */

/** The number of hues a monogram can take (the chart palette's six slots). */
export const MONOGRAM_HUES = 6;

/** Letters or digits that start a word ("Delta Offshore Services" → "DS"; "MV Corallo" → "MC"). */
export function monogramLetters(name: string): string {
  const words = name
    .trim()
    .split(/[\s\-–—/·,.()]+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w));
  if (!words.length) return "#";
  const pick = words.length > 1 ? [words[0]!, words[words.length - 1]!] : [words[0]!];
  return pick.map((w) => String.fromCodePoint(w.codePointAt(0)!).toUpperCase()).join("");
}

/** A stable hue slot, 0 to 5, for a name (a string hash, folded into the six). */
export function monogramHue(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h % MONOGRAM_HUES;
}
