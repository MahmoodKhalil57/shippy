/**
 * Figures that count to their value (a stat's number rolling up as it comes in, or from its old
 * value to a new one), keeping how the figure reads: its words around the number ("USD ", " d",
 * "%"), its decimals and its thousands separators. Pure: `readFigure` splits a figure, `figureAt`
 * draws it part of the way from one number to another. The motion itself is a stat's
 * (`<ui-stat>`): ambient, in the motion queue, paced by animation frames, none with Reduce motion.
 * Numbers are written the language's way (`intl.number`; Arabic writes Latin digits, with the
 * same separators).
 */

import { intl } from "../../i18n/index.ts";

export interface Figure {
  /** What comes before the number ("USD ", "−"). */
  before: string;
  value: number;
  /** What comes after it (" d", "k", "%"). */
  after: string;
  decimals: number;
  /** Written with thousands separators. */
  grouped: boolean;
  /** Written with the minus sign (U+2212) rather than a hyphen. */
  minus: boolean;
}

/** The first number in a figure and the words around it; undefined when it has none. */
export function readFigure(text: string): Figure | undefined {
  const m = /^(.*?)([-−]?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(.*)$/su.exec(text);
  if (!m) return undefined;
  const [, before, sign, whole, frac = "", after] = m;
  const n = Number(`${whole!.replaceAll(",", "")}${frac ? `.${frac}` : ""}`);
  return {
    before: before!,
    value: sign ? -n : n,
    after: after!,
    decimals: frac.length,
    grouped: whole!.includes(","),
    minus: sign === "−",
  };
}

/** The figure `to`, its number `t` (0 to 1) of the way from `from`: the same words, decimals and separators. */
export function figureAt(from: number, to: Figure, t: number): string {
  const v = from + (to.value - from) * Math.min(1, Math.max(0, t));
  const body = intl
    .number({ minimumFractionDigits: to.decimals, maximumFractionDigits: to.decimals, useGrouping: to.grouped })
    .format(Math.abs(v));
  const neg = v < 0 && Number(body.replaceAll(",", "")) !== 0;
  return `${to.before}${neg ? (to.minus ? "−" : "-") : ""}${body}${to.after}`;
}

/** The count's easing: fast, then settling (M3 emphasized decelerate, near enough). */
export const settle = (t: number) => 1 - (1 - t) ** 3;
