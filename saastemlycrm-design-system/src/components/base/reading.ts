import { dir } from "../../i18n/index.ts";

export function isRtl(el?: Element | null): boolean {
  if (el && el.isConnected) return getComputedStyle(el).direction === "rtl";
  return dir() === "rtl";
}

export function inlineStep(key: string, el?: Element | null): -1 | 0 | 1 {
  if (key !== "ArrowRight" && key !== "ArrowLeft") return 0;
  const forward = (key === "ArrowRight") !== isRtl(el);
  return forward ? 1 : -1;
}

export const nextKey = (el?: Element | null) => (isRtl(el) ? "ArrowLeft" : "ArrowRight");
export const previousKey = (el?: Element | null) => (isRtl(el) ? "ArrowRight" : "ArrowLeft");
