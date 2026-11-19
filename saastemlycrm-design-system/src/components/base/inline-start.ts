/**
 * A box measured from the window's left edge (`getBoundingClientRect().left`), as a distance from
 * the inline start, for an element placed with `start-*` / `inset-inline-start` (logical, so right
 * to left is right too): the same in left to right, mirrored in right to left.
 */
export function inlineStart(left: number, width: number): number {
  const rtl = getComputedStyle(document.documentElement).direction === "rtl";
  return rtl ? document.documentElement.clientWidth - left - width : left;
}
