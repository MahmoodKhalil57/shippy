import { describe, expect, it } from "vite-plus/test";
import {
  AMBIENT_CONSUMERS,
  FOLLOW_CONSUMERS,
  MAX_WAIT_MS,
  ON_TIME_MS,
  plan,
  type Playing,
  type Waiting,
} from "../src/components/base/motion-queue.ts";

/**
 * The motion queue's policy (`plan`), over every case of a finite domain: frame times either side
 * of the on-time limit; 0 to 2 input jobs, 0 to 3 follow and 0 to 2 ambient jobs playing; and every
 * queue of up to 4 waiting jobs, each follow or ambient, with waits either side of the skip limit.
 */
const FRAMES = [16, ON_TIME_MS, ON_TIME_MS + 1, 500];
const WAITS = [0, MAX_WAIT_MS - 1, MAX_WAIT_MS];
const JOBS: Waiting[] = (["follow", "ambient"] as const).flatMap((lane) => WAITS.map((waited) => ({ lane, waited })));

function* queues(max: number): Generator<Waiting[]> {
  yield [];
  for (let n = 1; n <= max; n++) {
    const pick = Array.from({ length: n }, () => 0);
    for (;;) {
      yield pick.map((i) => JOBS[i]!);
      let k = n - 1;
      while (k >= 0 && pick[k] === JOBS.length - 1) pick[k--] = 0;
      if (k < 0) break;
      pick[k]!++;
    }
  }
}

function* playings(): Generator<Playing> {
  for (let input = 0; input <= 2; input++)
    for (let follow = 0; follow <= 3; follow++)
      for (let ambient = 0; ambient <= 2; ambient++) yield { input, follow, ambient };
}

describe("motion queue", () => {
  it("never overruns its consumers, holds everything behind input, and only ever skips stale ambient jobs", () => {
    let cases = 0;
    const bad: string[] = [];
    const check = (ok: boolean, what: string, at: () => string) => {
      if (!ok && bad.length < 10) bad.push(`${what}: ${at()}`);
    };
    for (const frameMs of FRAMES)
      for (const playing of playings())
        for (const waiting of queues(4)) {
          cases++;
          const { start, skip } = plan(frameMs, playing, waiting);
          const at = () => JSON.stringify({ frameMs, playing, waiting, start, skip });
          const started = start.map((i) => waiting[i]!);
          const late = frameMs > ON_TIME_MS;
          const held = playing.input > 0 || late;
          // Every index is a real waiting job, at most once, never both started and skipped.
          check(new Set([...start, ...skip]).size === start.length + skip.length, "an index twice", at);
          check(
            [...start, ...skip].every((i) => i >= 0 && i < waiting.length),
            "an index out of range",
            at,
          );
          // Nothing starts behind input motion, or on a late frame.
          check(!held || start.length === 0, "started while held", at);
          // Consumers: never more follow or ambient jobs playing than there are consumers.
          const follow = started.filter((w) => w.lane === "follow").length;
          const ambient = started.filter((w) => w.lane === "ambient").length;
          check(!follow || playing.follow + follow <= FOLLOW_CONSUMERS, "follow over its consumers", at);
          check(!ambient || playing.ambient + ambient <= AMBIENT_CONSUMERS, "ambient over its consumers", at);
          // Follow jobs start in arrival order, as many as there's room for when nothing holds them.
          const followIdx = waiting.flatMap((w, i) => (w.lane === "follow" ? [i] : []));
          const followStarted = start.filter((i) => waiting[i]!.lane === "follow");
          check(
            JSON.stringify(followStarted) === JSON.stringify(followIdx.slice(0, follow)),
            "follow out of order",
            at,
          );
          check(
            held || follow === Math.min(followIdx.length, Math.max(0, FOLLOW_CONSUMERS - playing.follow)),
            "follow room left unused",
            at,
          );
          // Ambient motion starts only once no follow job waits or plays.
          check(!ambient || (playing.follow === 0 && followIdx.length === 0), "ambient ahead of follow", at);
          // Skips: exactly the ambient jobs that waited the limit, and only when held.
          const stale = waiting.flatMap((w, i) => (w.lane === "ambient" && w.waited >= MAX_WAIT_MS ? [i] : []));
          check(JSON.stringify(skip) === JSON.stringify(held ? stale : []), "wrong skips", at);
        }
    expect(bad).toEqual([]);
    expect(cases).toBeGreaterThan(50_000);
  }, 60_000);
});
