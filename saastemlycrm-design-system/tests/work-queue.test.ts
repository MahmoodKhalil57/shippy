import { describe, expect, it } from "vite-plus/test";
import { WorkQueue, whenIdle, yieldToMain } from "../src/components/base/work-queue.ts";

/**
 * The queue's promises, over every case of a small finite domain (1–3 consumers, 0–6 jobs, each
 * job taking 0–2 yields): never more jobs running than consumers, every job runs once, and with one
 * consumer they run in the queue's order, whatever order they were pushed in.
 */
describe("WorkQueue", () => {
  it("never runs more jobs at once than it has consumers, and runs each once", async () => {
    for (let consumers = 1; consumers <= 3; consumers++)
      for (let n = 0; n <= 6; n++) {
        const q = new WorkQueue<number>({ consumers, sliceMs: 0 });
        let running = 0;
        let most = 0;
        const ran: number[] = [];
        await Promise.all(
          Array.from({ length: n }, (_, i) =>
            q.push(i, async () => {
              running++;
              most = Math.max(most, running);
              for (let y = 0; y < i % 3; y++) await yieldToMain();
              ran.push(i);
              running--;
            }),
          ),
        );
        expect(most).toBeLessThanOrEqual(consumers);
        expect([...ran].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
      }
  });

  it("runs jobs in its order with one consumer, whatever order they arrive in", async () => {
    const orders = [
      [0, 1, 2, 3],
      [3, 2, 1, 0],
      [2, 0, 3, 1],
      [1, 3, 0, 2],
    ];
    for (const pushed of orders) {
      const q = new WorkQueue<number>({ consumers: 1, order: (a, b) => a - b });
      const ran: number[] = [];
      await Promise.all(pushed.map((i) => q.push(i, () => ran.push(i))));
      expect(ran).toEqual([0, 1, 2, 3]);
    }
  });

  it("passes a job's failure to its caller and keeps going", async () => {
    const q = new WorkQueue<string>();
    const ran: string[] = [];
    const bad = q.push("bad", () => {
      throw new Error("no");
    });
    const good = q.push("good", () => ran.push("good"));
    await expect(bad).rejects.toThrow("no");
    await good;
    expect(ran).toEqual(["good"]);
  });
});

describe("whenIdle", () => {
  it("runs once for calls made before it starts", async () => {
    let runs = 0;
    const key = {};
    for (let i = 0; i < 5; i++) whenIdle(key, () => runs++);
    for (let i = 0; i < 4; i++) await yieldToMain();
    expect(runs).toBe(1);
  });
});
