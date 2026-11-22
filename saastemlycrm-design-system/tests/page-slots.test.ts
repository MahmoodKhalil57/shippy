import { describe, expect, it } from "vite-plus/test";
import { pageSlots } from "../src/components/base/page-slots.ts";

/**
 * The pager's buttons (src/components/base/page-slots.ts), for every total 1–300, every page in it
 * and siblings 0–2: at most `siblings × 2 + 5` buttons between the arrows (exactly that many once
 * the total is larger), the first, last and current pages shown as numbers, and the numbers and
 * gaps covering pages 1 to the total exactly once, in order, a gap never a single page.
 */
describe("pageSlots", () => {
  it("bounds the buttons and covers every page once, for every total up to 300", () => {
    const bad: string[] = [];
    let cases = 0;
    for (let siblings = 0; siblings <= 2; siblings++)
      for (let total = 1; total <= 300; total++)
        for (let page = 1; page <= total; page++) {
          cases++;
          const slots = pageSlots(page, total, siblings);
          const say = (m: string) => bad.push(`${page}/${total} s${siblings}: ${m}`);
          const width = siblings * 2 + 5;
          if (slots.length > width) say(`${slots.length} buttons`);
          if (total > width && slots.length !== width) say(`row length ${slots.length}`);
          const numbers = slots.filter((s): s is number => typeof s === "number");
          for (const must of [1, total, page]) if (!numbers.includes(must)) say(`${must} missing`);
          let next = 1;
          for (const s of slots) {
            const [from, to] = typeof s === "number" ? [s, s] : [s.from, s.to];
            if (from !== next || to < from) say(`covers ${from}–${to}, expected ${next}`);
            if (typeof s === "object" && s.to === s.from) say("a gap of one page");
            next = to + 1;
          }
          if (next !== total + 1) say(`ends at ${next - 1}`);
        }
    expect(cases).toBe((3 * (300 * 301)) / 2);
    expect(bad).toEqual([]);
  });

  it("reads a long list", () => {
    expect(pageSlots(50, 300)).toEqual([1, { from: 2, to: 48 }, 49, 50, 51, { from: 52, to: 299 }, 300]);
    expect(pageSlots(1, 300)).toEqual([1, 2, 3, 4, 5, { from: 6, to: 299 }, 300]);
  });
});
