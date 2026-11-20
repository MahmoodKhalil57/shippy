/**
 * Scheduling for work that bunches up (widgets drawing as their data arrives, audits, measuring),
 * without timers: an async queue with a fixed number of consumers, each giving the main thread
 * back between slices, so however much arrives at once the frame rate holds.
 *
 * - `yieldToMain()`: `scheduler.yield()` (the rest of the work continues first, ahead of other
 *   tasks, after the browser has had its turn to handle input and render); where it's missing, a
 *   message on a MessageChannel, which is a new task too. Never `setTimeout`.
 * - `WorkQueue`: jobs run by `consumers` consumers, in the order `order` gives (the queue sorts
 *   whatever is waiting before each pick); a consumer yields once it has run `sliceMs` of jobs.
 * - `whenIdle(key, fn)`: one run of `fn` at background priority (`scheduler.postTask`), coalescing
 *   the calls made before it starts.
 */

interface Scheduler {
  yield?: () => Promise<void>;
  postTask?: (
    fn: () => unknown,
    options?: { priority?: "user-blocking" | "user-visible" | "background" },
  ) => Promise<unknown>;
}
const scheduler = (globalThis as { scheduler?: Scheduler }).scheduler;

let channel: MessageChannel | undefined;
const waiting: (() => void)[] = [];

/** Gives the main thread back (input, rendering), then continues. */
export function yieldToMain(): Promise<void> {
  if (scheduler?.yield) return scheduler.yield();
  if (!channel) {
    channel = new MessageChannel();
    channel.port1.onmessage = () => waiting.shift()?.();
  }
  return new Promise<void>((resume) => {
    waiting.push(resume);
    channel!.port2.postMessage(null);
  });
}

/** Runs `fn` as a background-priority task (after what the page is doing for the person). */
function background(fn: () => unknown) {
  if (scheduler?.postTask) void scheduler.postTask(fn, { priority: "background" });
  else void yieldToMain().then(fn);
}

const idle = new Set<unknown>();

/** One run of `fn` at background priority for `key`; calls before it starts share that run. */
export function whenIdle(key: unknown, fn: () => unknown): void {
  if (idle.has(key)) return;
  idle.add(key);
  background(async () => {
    idle.delete(key);
    await fn();
  });
}

export interface WorkQueueOptions<J> {
  /** How many jobs run side by side (each consumer runs one job at a time). */
  consumers?: number;
  /** Script time a consumer spends before yielding (ms): about half a 60 Hz frame by default. */
  sliceMs?: number;
  /** Which waiting job goes first (a negative number puts `a` first). */
  order?: (a: J, b: J) => number;
}

/** An async queue with a fixed number of consumers that yield to the main thread between slices. */
export class WorkQueue<J> {
  #jobs: { job: J; run: () => Promise<unknown> }[] = [];
  #running = 0;
  readonly #consumers: number;
  readonly #sliceMs: number;
  readonly #order?: (a: J, b: J) => number;

  constructor(options: WorkQueueOptions<J> = {}) {
    this.#consumers = Math.max(1, options.consumers ?? 1);
    this.#sliceMs = options.sliceMs ?? 8;
    this.#order = options.order;
  }

  /** Queue `run` for `job`; resolves when it has run. */
  push(job: J, run: () => unknown): Promise<void> {
    return new Promise<void>((done, fail) => {
      this.#jobs.push({
        job,
        run: async () => {
          try {
            await run();
            done();
          } catch (e) {
            fail(e);
          }
        },
      });
      while (this.#running < this.#consumers) {
        this.#running++;
        void this.#consume();
      }
    });
  }

  async #consume() {
    try {
      // Everything that arrives in this turn is ordered with the rest before the first pick.
      await Promise.resolve();
      let start = performance.now();
      while (this.#jobs.length) {
        if (this.#order) this.#jobs.sort((a, b) => this.#order!(a.job, b.job));
        await this.#jobs.shift()!.run();
        if (this.#jobs.length && performance.now() - start >= this.#sliceMs) {
          await yieldToMain();
          start = performance.now();
        }
      }
    } finally {
      this.#running--;
    }
  }
}
