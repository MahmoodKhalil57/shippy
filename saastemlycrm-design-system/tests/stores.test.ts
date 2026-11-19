import { describe, expect, it } from "vite-plus/test";
import { createStore, endTour, startTour, tour } from "../src/stores/index.ts";

describe("frontend stores", () => {
  it("merges, notifies only on change, and resets", () => {
    const s = createStore({ a: 1, b: "x" });
    const seen: number[] = [];
    s.subscribe((st) => seen.push(st.a));
    s.set({ a: 1 });
    s.set({ a: 2 });
    s.set((st) => ({ a: st.a + 1 }));
    expect(seen).toEqual([2, 3]);
    s.reset();
    expect(s.get()).toEqual({ a: 1, b: "x" });
  });

  it("starts and finishes tours", () => {
    startTour("morning");
    endTour(true);
    expect(tour.get()).toMatchObject({ active: null, completed: ["morning"] });
  });
});
