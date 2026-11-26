export const MONOGRAM_HUES = 6;

export function monogramLetters(name: string): string {
  const words = name
    .trim()
    .split(/[\s\-–—/·,.()]+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w));
  if (!words.length) return "#";
  const lettered = words.filter((w) => /^\p{L}/u.test(w));
  const pick = (lettered.length ? lettered : words).slice(0, 2);
  return pick.map((w) => String.fromCodePoint(w.codePointAt(0)!).toUpperCase()).join("");
}

export function monogramHue(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h % MONOGRAM_HUES;
}
