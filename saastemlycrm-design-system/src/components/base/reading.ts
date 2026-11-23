import { dir } from "../../i18n/index.ts";

/**
 * Arrow keys in reading order. In right to left, ArrowRight goes to the previous item and
 * ArrowLeft to the next one (roving focus, sliders, tabs, carousels, moving a tile); up and down
 * don't change.
 */

/** Whether `el` is laid out right to left (its own computed direction; else the page's language). */
export function isRtl(el?: Element | null): boolean {
  if (el && el.isConnected) return getComputedStyle(el).direction === "rtl";
  return dir() === "rtl";
}

/**
 * The step a horizontal arrow key takes in reading order: 1 forward (ArrowRight in left to right,
 * ArrowLeft in right to left), -1 back, 0 for any other key.
 */
export function inlineStep(key: string, el?: Element | null): -1 | 0 | 1 {
  if (key !== "ArrowRight" && key !== "ArrowLeft") return 0;
  const forward = (key === "ArrowRight") !== isRtl(el);
  return forward ? 1 : -1;
}

/** The arrow key that goes forward in reading order ("ArrowRight", or "ArrowLeft" in right to left). */
export const nextKey = (el?: Element | null) => (isRtl(el) ? "ArrowLeft" : "ArrowRight");
/** The arrow key that goes back in reading order. */
export const previousKey = (el?: Element | null) => (isRtl(el) ? "ArrowRight" : "ArrowLeft");
