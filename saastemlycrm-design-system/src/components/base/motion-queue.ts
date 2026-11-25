export const ON_TIME_MS = 25;
export const FOLLOW_CONSUMERS = 2;
export const AMBIENT_CONSUMERS = 1;
export const MAX_WAIT_MS = 250;

export type Lane = "input" | "follow" | "ambient";

export interface Playing {
  input: number;
  follow: number;
  ambient: number;
}

export interface Waiting {
  lane: "follow" | "ambient";
  waited: number;
}

export interface Plan {
  start: number[];
  skip: number[];
}

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

export class MotionQueue {
  #waiting: Job[] = [];
  #playing: Playing = { input: 0, follow: 0, ambient: 0 };
  #frame = 0;
  #last = 0;

  input(animations: Animation[]): Promise<void> {
    if (!animations.length) return Promise.resolve();
    this.#playing.input++;
    this.#wake();
    return settle(animations).then(() => {
      this.#playing.input--;
      this.#wake();
    });
  }

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
    if (this.#waiting.length) this.#frame = requestAnimationFrame(this.#tick);
  };
}

export const motion = new MotionQueue();
