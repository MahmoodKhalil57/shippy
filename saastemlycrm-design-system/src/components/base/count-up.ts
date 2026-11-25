import { intl } from "../../i18n/index.ts";

export interface Figure {
  before: string;
  value: number;
  after: string;
  decimals: number;
  grouped: boolean;
  minus: boolean;
}

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

export function figureAt(from: number, to: Figure, t: number): string {
  const v = from + (to.value - from) * Math.min(1, Math.max(0, t));
  const body = intl
    .number({ minimumFractionDigits: to.decimals, maximumFractionDigits: to.decimals, useGrouping: to.grouped })
    .format(Math.abs(v));
  const neg = v < 0 && Number(body.replaceAll(",", "")) !== 0;
  return `${to.before}${neg ? (to.minus ? "−" : "-") : ""}${body}${to.after}`;
}

export const settle = (t: number) => 1 - (1 - t) ** 3;
