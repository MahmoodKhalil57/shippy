interface Scheduler {
  yield?: () => Promise<void>;
  postTask?: (
    fn: () => unknown,
    options?: { priority?: "user-blocking" | "user-visible" | "background" },
  ) => Promise<unknown>;
}
const scheduler = () => (globalThis as { scheduler?: Scheduler }).scheduler;

let channel: MessageChannel | undefined;
const waiting: (() => void)[] = [];

export function yieldToMain(): Promise<void> {
  const s = scheduler();
  if (s?.yield) return s.yield();
  if (!channel) {
    channel = new MessageChannel();
    channel.port1.onmessage = () => waiting.shift()!();
  }
  return new Promise<void>((resume) => {
    waiting.push(resume);
    channel!.port2.postMessage(null);
  });
}

export function afterNextPaint(): Promise<void> {
  return new Promise((resume) => requestAnimationFrame(() => void yieldToMain().then(resume)));
}

function background(fn: () => unknown) {
  const s = scheduler();
  if (s?.postTask) void s.postTask(fn, { priority: "background" });
  else void yieldToMain().then(fn);
}

const idle = new Set<unknown>();

export function whenIdle(key: unknown, fn: () => unknown): void {
  if (idle.has(key)) return;
  idle.add(key);
  background(async () => {
    idle.delete(key);
    await fn();
  });
}

export interface WorkQueueOptions<J> {
  consumers?: number;
  sliceMs?: number;
  order?: (a: J, b: J) => number;
}

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
