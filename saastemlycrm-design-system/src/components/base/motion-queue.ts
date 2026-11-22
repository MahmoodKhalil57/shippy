/**
 * One queue for the app's motion, so a gesture never sets off more animations than a frame can
 * draw. Every animation joins it in one of three lanes:
 *
 * - `input`: the direct answer to what the person did (a column springing open, its menu folding,
 *   a page coming in). It plays at once, and while any input motion plays nothing else starts.
 * - `follow`: what follows from it (tiles sliding to their new places once the page has its new
 *   width). Waits for input motion to end, then plays, at most `FOLLOW_CONSUMERS` jobs at a time,
 *   in the order they came. A newer job with the same key replaces one still waiting: the old one
 *   jumps to its end, so only the newest move plays.
 * - `ambient`: low-stakes motion (a chart drawing itself in). Plays only when nothing else is
 *   waiting or playing, `AMBIENT_CONSUMERS` at a time. One that hasn't started and has waited
 *   `MAX_WAIT_MS` while frames run late, or while input motion plays, skips: it jumps to its end.
 *
 * A job that waits is held at its first frame (paused at 0), so what it moves stays where it was
 * until it plays: nothing jumps while it waits. The consumer is paced by animation frames, never
 * by timers, and decides each frame with `plan`, a pure function proved over every case of a
 * finite domain by tests/motion-queue.test.ts.
 */

/** A frame no later than this (ms since the previous one) is on schedule: 1.5 frames at 60 Hz. */
export const ON_TIME_MS = 25;
/** Follow jobs playing at once. */
export const FOLLOW_CONSUMERS = 2;
/** Ambient jobs playing at once. */
export const AMBIENT_CONSUMERS = 1;
/** An ambient job that has waited this long (ms) while frames run late, or behind input motion, skips. */
export const MAX_WAIT_MS = 250;

export type Lane = "input" | "follow" | "ambient";

/** What plays now, per lane. */
export interface Playing {
  input: number;
  follow: number;
  ambient: number;
}

/** A waiting job: its lane and how long (ms) it has waited. */
export interface Waiting {
  lane: "follow" | "ambient";
  waited: number;
}

/** What one frame does with the waiting jobs (indexes into `waiting`, which is in arrival order). */
export interface Plan {
  start: number[];
  skip: number[];
}

/**
 * This frame's decision, `frameMs` since the previous frame:
 * - input motion playing: start nothing; an ambient job that has waited `MAX_WAIT_MS` skips.
 * - a late frame: start nothing; the same ambient jobs skip.
 * - on time: follow jobs start in arrival order up to `FOLLOW_CONSUMERS` playing; ambient jobs
 *   start up to `AMBIENT_CONSUMERS` playing, and only once no follow job waits or plays.
 */
export function plan(frameMs: number, playing: Playing, waiting: readonly Waiting[]): Plan {
  const stale = () => waiting.flatMap((w, i) => (w.lane === "ambient" && w.waited >= MAX_WAIT_MS ? [i] : []));
  if (playing.input > 0 || frameMs > ON_TIME_MS) return { start: [], skip: stale() };
  const start: number[] = [];
  let follow = playing.follow;
  waiting.forEach((w, i) => {
    if (w.lane === "follow" && follow < FOLLOW_CONSUMERS) {
      start.push(i);
      follow++;
    }
  });
  const followLeft = waiting.some((w, i) => w.lane === "follow" && !start.includes(i));
  if (follow === 0 && !followLeft) {
    let ambient = playing.ambient;
    waiting.forEach((w, i) => {
      if (w.lane === "ambient" && ambient < AMBIENT_CONSUMERS) {
        start.push(i);
        ambient++;
      }
    });
  }
  return { start, skip: [] };
}

interface Job {
  lane: "follow" | "ambient";
  key?: unknown;
  animations: Animation[];
  since: number;
  done: () => void;
}

const settle = (animations: Animation[]) =>
  Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() => undefined);

/** The app's motion queue (see above). */
export class MotionQueue {
  #waiting: Job[] = [];
  #playing: Playing = { input: 0, follow: 0, ambient: 0 };
  #frame = 0;
  #last = 0;

  /** Input motion, already playing (a CSS transition, a tween): what else waits for. */
  input(animations: Animation[]): Promise<void> {
    if (!animations.length) return Promise.resolve();
    this.#playing.input++;
    this.#wake();
    return settle(animations).then(() => {
      this.#playing.input--;
      this.#wake();
    });
  }

  /**
   * Queues follow or ambient motion: its animations are held at their first frame until it plays.
   * Resolves once they've finished (played, or skipped to their end).
   */
  add(animations: Animation[], lane: "follow" | "ambient", key?: unknown): Promise<void> {
    if (!animations.length) return Promise.resolve();
    if (key !== undefined)
      for (const old of this.#waiting.filter((j) => j.key === key)) {
        this.#waiting.splice(this.#waiting.indexOf(old), 1);
        for (const a of old.animations) a.finish();
        old.done();
      }
    for (const a of animations) {
      a.pause();
      a.currentTime = 0;
    }
    return new Promise<void>((done) => {
      this.#waiting.push({ lane, key, animations, since: performance.now(), done });
      this.#wake();
    });
  }

  #wake() {
    if (this.#frame) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame(this.#tick);
  }

  #tick = (now: number) => {
    this.#frame = 0;
    const frameMs = now - this.#last;
    this.#last = now;
    const waiting = this.#waiting;
    const { start, skip } = plan(
      frameMs,
      this.#playing,
      waiting.map((j) => ({ lane: j.lane, waited: now - j.since })),
    );
    const leaving = new Set([...start, ...skip]);
    for (const i of skip) {
      const job = waiting[i]!;
      for (const a of job.animations) a.finish();
      job.done();
    }
    for (const i of start) {
      const job = waiting[i]!;
      this.#playing[job.lane]++;
      for (const a of job.animations) a.play();
      void settle(job.animations).then(() => {
        this.#playing[job.lane]--;
        job.done();
        this.#wake();
      });
    }
    this.#waiting = waiting.filter((_, i) => !leaving.has(i));
    // Keep looking while anything waits; playing jobs wake the queue when they end.
    if (this.#waiting.length) this.#frame = requestAnimationFrame(this.#tick);
  };
}

/** The app's one motion queue. */
export const motion = new MotionQueue();
