export function inlineStart(left: number, width: number): number {
  const rtl = getComputedStyle(document.documentElement).direction === "rtl";
  return rtl ? document.documentElement.clientWidth - left - width : left;
}
