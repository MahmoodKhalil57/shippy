import { describe, expect, it } from "vite-plus/test";
import { MAX_WAIT_MS, ON_TIME_MS, START_PER_FRAME, pace } from "../src/components/base/icon-motion.ts";

/**
 * The icon pacing policy (`pace`), over every case of a finite domain: frame times around the
 * on-time limit, and every queue of up to 6 icons whose waits are drawn from the values either side
 * of the skip limit.
 */
const FRAMES = [0, 8, 16, 17, ON_TIME_MS - 1, ON_TIME_MS, ON_TIME_MS + 1, 33, 50, 100, 500];
const WAITS = [0, 1, MAX_WAIT_MS - 1, MAX_WAIT_MS, MAX_WAIT_MS + 1, 2000];

function* queues(max: number): Generator<number[]> {
  yield [];
  for (let n = 1; n <= max; n++) {
    const pick = Array.from({ length: n }, () => 0);
    for (;;) {
      // Oldest first: waits never grow along the queue.
      const q = pick.map((i) => WAITS[i]!);
      if (q.every((w, i) => i === 0 || w <= q[i - 1]!)) yield q;
      let k = n - 1;
      while (k >= 0 && pick[k] === WAITS.length - 1) pick[k--] = 0;
      if (k < 0) break;
      pick[k]!++;
    }
  }
}

describe("icon pacing", () => {
  it("starts the oldest few on time, starts none when late, and skips only long waits when late", () => {
    let cases = 0;
    for (const frame of FRAMES)
      for (const q of queues(6)) {
        cases++;
        const { start, skip } = pace(frame, q);
        const onTime = frame <= ON_TIME_MS;
        // Never both: an icon is started or skipped, not both.
        expect(start.filter((i) => skip.includes(i))).toEqual([]);
        if (onTime) {
          // On time: the oldest min(K, n), in order, and nothing skipped.
          expect(start).toEqual(Array.from({ length: Math.min(START_PER_FRAME, q.length) }, (_, i) => i));
          expect(skip).toEqual([]);
        } else {
          // Late: nothing starts; exactly the icons that waited the limit or more are skipped.
          expect(start).toEqual([]);
          expect(skip).toEqual(q.flatMap((w, i) => (w >= MAX_WAIT_MS ? [i] : [])));
        }
      }
    expect(cases).toBeGreaterThan(1000);
  });

  it("empties any queue: each frame either starts or skips something, or every icon is still young", () => {
    for (const frame of FRAMES)
      for (const q of queues(6)) {
        const { start, skip } = pace(frame, q);
        if (q.length && !start.length && !skip.length) expect(q.every((w) => w < MAX_WAIT_MS)).toBe(true);
      }
  });
});
