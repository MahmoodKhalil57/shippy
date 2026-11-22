import { describe, expect, it } from "vite-plus/test";
import { figureAt, readFigure } from "../src/components/base/count-up.ts";

/**
 * Counting figures (src/components/base/count-up.ts), proved over a finite domain: for every
 * figure made of a prefix ("", "USD ", "EGP "), a sign (none, "-", "−"), every integer 0 to 1,200 (every 7th as hundredths and tenths)
 * written with and without separators, 0 to 2 decimals and a suffix ("", " d", "k", "%"), the
 * figure is read back exactly, drawing it all the way (t = 1) gives the very text it was, and
 * drawing it from 0 at no way along (t = 0) gives zero in the same words.
 */
describe("counting figures", () => {
  it("reads every figure and draws it back exactly", () => {
    const bad: string[] = [];
    for (const before of ["", "USD ", "EGP "])
      for (const sign of ["", "-", "−"])
        for (const after of ["", " d", "k", "%"])
          for (const decimals of [0, 1, 2])
            for (const grouped of [false, true])
              for (let n = 0; n <= 1200; n += decimals ? 7 : 1) {
                const v = n / 10 ** decimals;
                const body = v.toLocaleString("en-US", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                  useGrouping: grouped,
                });
                const neg = sign && v !== 0;
                const text = `${before}${neg ? sign : ""}${body}${after}`;
                const f = readFigure(text);
                if (!f) {
                  bad.push(`unread ${text}`);
                  continue;
                }
                if (figureAt(0, f, 1) !== text) bad.push(`${text} → ${figureAt(0, f, 1)}`);
                const zero = figureAt(0, f, 0);
                if (zero !== `${before}${(0).toFixed(decimals)}${after}`) bad.push(`${text} from 0 → ${zero}`);
              }
    expect(bad.slice(0, 5)).toEqual([]);
  }, 60_000);

  it("leaves words with no number alone", () => {
    expect(readFigure("—")).toBeUndefined();
    expect(readFigure("No data")).toBeUndefined();
  });
});
