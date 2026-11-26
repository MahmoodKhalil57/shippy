import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import {
  AMBIENT_CONSUMERS,
  FOLLOW_CONSUMERS,
  MAX_WAIT_MS,
  MotionQueue,
  ON_TIME_MS,
  afterMs,
  motion,
  plan,
  type Waiting,
} from "./motion-queue";

const idle = { input: 0, follow: 0, ambient: 0 };
const f = (waited = 0): Waiting => ({ lane: "follow", waited });
const a = (waited = 0): Waiting => ({ lane: "ambient", waited });

describe("plan", () => {
  it("starts follow jobs up to the consumer limit, ahead of ambient", () => {
    expect(FOLLOW_CONSUMERS).toBe(2);
    expect(plan(16, idle, [a(), f(), f(), f()])).toEqual({ start: [1, 2], skip: [] });
    expect(plan(16, { ...idle, follow: 1 }, [f(), f()])).toEqual({ start: [0], skip: [] });
  });

  it("starts ambient only when no follow job plays or waits", () => {
    expect(AMBIENT_CONSUMERS).toBe(1);
    expect(plan(16, idle, [a(), a()])).toEqual({ start: [0], skip: [] });
    expect(plan(16, { ...idle, ambient: 1 }, [a()])).toEqual({ start: [], skip: [] });
    expect(plan(16, { ...idle, follow: 2 }, [a(), f()])).toEqual({ start: [], skip: [] });
  });

  it("holds everything while input plays or the frame is late", () => {
    expect(plan(16, { ...idle, input: 1 }, [f(), a()])).toEqual({ start: [], skip: [] });
    expect(plan(ON_TIME_MS + 1, idle, [f(), a()])).toEqual({ start: [], skip: [] });
    expect(plan(ON_TIME_MS, idle, [f()])).toEqual({ start: [0], skip: [] });
  });

  it("skips ambient jobs that waited too long, even in a late frame", () => {
    expect(plan(100, idle, [a(MAX_WAIT_MS), f(MAX_WAIT_MS)])).toEqual({ start: [], skip: [0] });
    expect(plan(16, idle, [a(MAX_WAIT_MS), a(MAX_WAIT_MS - 1)])).toEqual({ start: [1], skip: [0] });
    expect(plan(16, idle, [])).toEqual({ start: [], skip: [] });
  });
});

let now = 0;
let frames = new Map<number, FrameRequestCallback>();
let ids = 0;

const frame = (ms = 16) => {
  now += ms;
  const due = [...frames.values()];
  frames = new Map();
  for (const cb of due) cb(now);
};

const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

const els: Element[] = [];
const anim = (target: Element | null = null) => {
  const el = target ?? document.body.appendChild(document.createElement("div"));
  els.push(el);
  return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 10_000 });
};

beforeEach(() => {
  now = 0;
  frames = new Map();
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    frames.set(++ids, cb);
    return ids;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const el of els.splice(0)) el.remove();
});

describe("afterMs", () => {
  it("calls back on the first frame at or after the delay", () => {
    const fn = vi.fn();
    afterMs(40, fn);
    frame(16);
    frame(16);
    expect(fn).not.toHaveBeenCalled();
    frame(16);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(frames.size).toBe(0);
  });

  it("can be cancelled", () => {
    const fn = vi.fn();
    const cancel = afterMs(20, fn);
    frame(16);
    cancel();
    frame(16);
    expect(fn).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
  });
});

describe("MotionQueue", () => {
  it("resolves empty batches at once", async () => {
    const q = new MotionQueue();
    await expect(q.input([])).resolves.toBeUndefined();
    await expect(q.add([], "follow")).resolves.toBeUndefined();
    expect(frames.size).toBe(0);
  });

  it("parks added animations at the start and plays them on an on-time frame", async () => {
    const q = new MotionQueue();
    const x = anim();
    const done = vi.fn();
    void q.add([x], "follow").then(done);
    expect(x.playState).toBe("paused");
    expect(x.currentTime).toBe(0);
    frame(40);
    expect(x.playState).toBe("paused");
    frame(16);
    expect(x.playState).toBe("running");
    await flush();
    expect(done).not.toHaveBeenCalled();
    x.finish();
    await flush();
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("holds queued motion while input animations play", async () => {
    const q = new MotionQueue();
    const user = anim();
    const follow = anim();
    const inputDone = q.input([user]);
    void q.add([follow], "follow");
    frame();
    frame();
    expect(follow.playState).toBe("paused");
    user.cancel();
    await inputDone;
    frame();
    expect(follow.playState).toBe("running");
  });

  it("plays at most two follow jobs, and ambient only after follow drains", async () => {
    const q = new MotionQueue();
    const [f1, f2, f3, am] = [anim(), anim(), anim(), anim()];
    void q.add([f1], "follow");
    void q.add([f2], "follow");
    void q.add([f3], "follow");
    void q.add([am], "ambient");
    frame();
    expect([f1, f2, f3, am].map((x) => x.playState)).toEqual(["running", "running", "paused", "paused"]);
    f1.finish();
    await flush();
    frame();
    expect(f3.playState).toBe("running");
    expect(am.playState).toBe("paused");
    f2.finish();
    f3.finish();
    await flush();
    frame();
    expect(am.playState).toBe("running");
  });

  it("finishes ambient motion that waited too long instead of playing it late", async () => {
    const q = new MotionQueue();
    const busy = anim();
    const late = anim();
    void q.add([busy], "follow");
    const lateDone = q.add([late], "ambient");
    frame();
    frame(MAX_WAIT_MS);
    await lateDone;
    expect(late.playState).toBe("finished");
    expect(busy.playState).toBe("running");
  });

  it("replaces a waiting job with the same key", async () => {
    const q = new MotionQueue();
    const key = "row";
    const first = anim();
    const second = anim();
    const firstDone = q.add([first], "follow", key);
    void q.add([second], "follow", key);
    await firstDone;
    expect(first.playState).toBe("finished");
    frame();
    expect(second.playState).toBe("running");
  });

  it("drops jobs whose key node or targets left the document", async () => {
    const q = new MotionQueue();
    const keyed = anim();
    const keyNode = document.body.appendChild(document.createElement("span"));
    els.push(keyNode);
    const orphan = anim();
    const keyedDone = q.add([keyed], "follow", keyNode);
    const orphanDone = q.add([orphan], "follow");
    keyNode.remove();
    (orphan.effect as KeyframeEffect).target!.remove();
    frame();
    await Promise.all([keyedDone, orphanDone]);
    expect(keyed.playState).toBe("idle");
    expect(orphan.playState).toBe("idle");
    expect(frames.size).toBe(0);
  });

  it("treats effect-less animations as connected", async () => {
    const q = new MotionQueue();
    const bare = new Animation(null);
    const done = q.add([bare], "ambient");
    frame();
    await done;
    expect(bare.playState).toBe("finished");
  });

  it("keeps ticking while jobs wait, and stops when none do", async () => {
    const q = new MotionQueue();
    const x = anim();
    void q.add([x], "follow");
    frame(100);
    expect(frames.size).toBe(1);
    frame();
    expect(frames.size).toBe(0);
    x.finish();
    await flush();
    expect(frames.size).toBe(1);
    frame();
    expect(frames.size).toBe(0);
  });

  it("exports a shared queue", () => {
    expect(motion).toBeInstanceOf(MotionQueue);
  });
});
