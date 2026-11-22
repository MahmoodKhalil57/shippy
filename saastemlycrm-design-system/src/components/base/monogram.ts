/**
 * A record's monogram: up to two letters from its name and one of the six chart hues, the same
 * name always the same hue. No DOM; tests/monogram.test.ts proves every hue is one of the six and
 * every name gives the first letters of its first two words (letter-led words first), or "#" when
 * it has none, over a finite domain.
 */

/** The number of hues a monogram can take (the chart palette's six slots). */
export const MONOGRAM_HUES = 6;

/** The first letters of its first two words, letter-led ones first ("Delta Offshore Services" → "DO"; "MV Corallo" → "MC"). */
export function monogramLetters(name: string): string {
  const words = name
    .trim()
    .split(/[\s\-–—/·,.()]+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w));
  if (!words.length) return "#";
  // The first two words that start with a letter (a name's, not a count's or a line number's),
  // else the first two words.
  const lettered = words.filter((w) => /^\p{L}/u.test(w));
  const pick = (lettered.length ? lettered : words).slice(0, 2);
  return pick.map((w) => String.fromCodePoint(w.codePointAt(0)!).toUpperCase()).join("");
}

/** A stable hue slot, 0 to 5, for a name (a string hash, folded into the six). */
export function monogramHue(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h % MONOGRAM_HUES;
}
