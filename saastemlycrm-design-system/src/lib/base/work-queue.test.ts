import { describe, it, expect, vi, afterEach } from "vite-plus/test";
import { WorkQueue, afterNextPaint, whenIdle, yieldToMain } from "./work-queue";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const withoutScheduler = () => vi.stubGlobal("scheduler", undefined);

describe("yieldToMain", () => {
  it("uses scheduler.yield when available", async () => {
    const y = vi.fn(() => Promise.resolve());
    vi.stubGlobal("scheduler", { yield: y });
    await yieldToMain();
    expect(y).toHaveBeenCalledTimes(1);
  });

  it("falls back to a message channel and resumes callers in order", async () => {
    withoutScheduler();
    const order: number[] = [];
    const a = yieldToMain().then(() => order.push(1));
    const b = yieldToMain().then(() => order.push(2));
    let sync = true;
    const c = yieldToMain().then(() => order.push(sync ? -1 : 3));
    sync = false;
    await Promise.all([a, b, c]);
    expect(order).toEqual([1, 2, 3]);
    await yieldToMain();
  });

  it("yields to a macrotask, after pending microtasks", async () => {
    const seen: string[] = [];
    queueMicrotask(() => seen.push("micro"));
    await yieldToMain();
    seen.push("after");
    expect(seen).toEqual(["micro", "after"]);
  });
});

describe("afterNextPaint", () => {
  it("resolves after an animation frame", async () => {
    let framed = false;
    requestAnimationFrame(() => (framed = true));
    await afterNextPaint();
    expect(framed).toBe(true);
  });
});

describe("whenIdle", () => {
  it("runs once per key until it has started", async () => {
    const fn = vi.fn();
    const key = {};
    whenIdle(key, fn);
    whenIdle(key, fn);
    await new Promise<void>((r) => whenIdle({}, r));
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
  });

  it("can schedule the same key again once it ran", async () => {
    const key = Symbol();
    const first = new Promise<void>((r) => whenIdle(key, r));
    await first;
    const second = new Promise<void>((r) => whenIdle(key, r));
    await expect(second).resolves.toBeUndefined();
  });

  it("uses background postTask priority", async () => {
    const postTask = vi.fn((fn: () => unknown) => Promise.resolve(fn()));
    vi.stubGlobal("scheduler", { postTask });
    const ran = new Promise<void>((r) => whenIdle("posted", r));
    await ran;
    expect(postTask).toHaveBeenCalledWith(expect.any(Function), { priority: "background" });
  });

  it("falls back to yielding without a scheduler", async () => {
    withoutScheduler();
    const ran = new Promise<void>((r) => whenIdle("fallback", r));
    await expect(ran).resolves.toBeUndefined();
  });
});

describe("WorkQueue", () => {
  it("runs jobs in push order with one consumer", async () => {
    const q = new WorkQueue<number>();
    const seen: number[] = [];
    await Promise.all([1, 2, 3].map((n) => q.push(n, () => seen.push(n))));
    expect(seen).toEqual([1, 2, 3]);
  });

  it("never runs more jobs at once than it has consumers", async () => {
    const q = new WorkQueue<number>({ consumers: 2 });
    let live = 0;
    let most = 0;
    const job = async () => {
      live++;
      most = Math.max(most, live);
      await yieldToMain();
      live--;
    };
    await Promise.all(Array.from({ length: 6 }, (_, i) => q.push(i, job)));
    expect(most).toBe(2);
  });

  it("clamps consumers to at least one", async () => {
    const q = new WorkQueue<number>({ consumers: 0 });
    await expect(q.push(1, () => {})).resolves.toBeUndefined();
  });

  it("orders waiting jobs by the comparator", async () => {
    const q = new WorkQueue<number>({ order: (a, b) => b - a });
    const seen: number[] = [];
    await Promise.all([1, 5, 3, 4].map((n) => q.push(n, () => seen.push(n))));
    expect(seen).toEqual([5, 4, 3, 1]);
  });

  it("rejects a failing job and keeps going", async () => {
    const q = new WorkQueue<string>();
    const bad = q.push("bad", () => {
      throw new Error("boom");
    });
    const good = q.push("good", async () => {});
    await expect(bad).rejects.toThrow("boom");
    await expect(good).resolves.toBeUndefined();
  });

  it("yields to the main thread once a slice is used up", async () => {
    let clock = 0;
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    const y = vi.fn(() => Promise.resolve());
    vi.stubGlobal("scheduler", { yield: y });
    const q = new WorkQueue<number>({ sliceMs: 5 });
    const seen: number[] = [];
    await Promise.all(
      [3, 3, 3].map((cost, i) =>
        q.push(i, () => {
          clock += cost;
          seen.push(i);
        }),
      ),
    );
    expect(seen).toEqual([0, 1, 2]);
    expect(y).toHaveBeenCalledTimes(1);
  });

  it("does not yield after the last job of a slice", async () => {
    let clock = 0;
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    const y = vi.fn(() => Promise.resolve());
    vi.stubGlobal("scheduler", { yield: y });
    const q = new WorkQueue<number>();
    await q.push(0, () => (clock += 100));
    expect(y).not.toHaveBeenCalled();
  });

  it("restarts consumers for jobs pushed after it drained", async () => {
    const q = new WorkQueue<number>();
    await q.push(1, () => {});
    const seen: number[] = [];
    await q.push(2, () => seen.push(2));
    expect(seen).toEqual([2]);
  });
});
