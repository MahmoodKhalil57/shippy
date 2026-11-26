import { describe, expect, it } from "vite-plus/test";
import { setIn } from "./set-in.ts";

describe("setIn", () => {
  it("sets a top-level value without touching the original", () => {
    const root = { title: "Draft", total: 4 };
    const next = setIn(root, ["title"], "Final");
    expect(next).toEqual({ title: "Final", total: 4 });
    expect(root).toEqual({ title: "Draft", total: 4 });
    expect(next).not.toBe(root);
  });

  it("copies every level on the path and keeps siblings", () => {
    const lines = [{ item: "Desk" }, { item: "Chair" }];
    const root = { lines, notes: "keep" };
    const next = setIn(root, ["lines", 1, "item"], "Lamp");
    expect(next).toEqual({ lines: [{ item: "Desk" }, { item: "Lamp" }], notes: "keep" });
    expect(Array.isArray(next.lines)).toBe(true);
    expect(next.lines).not.toBe(lines);
    expect(lines[1]).toEqual({ item: "Chair" });
  });

  it("creates an array when the next key is a number and an object otherwise", () => {
    expect(setIn({}, ["lines", 0, "item"], "Desk")).toEqual({ lines: [{ item: "Desk" }] });
    expect(Array.isArray(setIn({}, ["lines", 0], "Desk").lines)).toBe(true);
    expect(setIn({}, ["address", "city"], "Lyon")).toEqual({ address: { city: "Lyon" } });
  });

  it("replaces a stored value that isn't a container instead of spreading it", () => {
    expect(setIn({ address: "broken" }, ["address", "city"], "Lyon")).toEqual({ address: { city: "Lyon" } });
    expect(setIn({ lines: 7 }, ["lines", 0], "Desk")).toEqual({ lines: ["Desk"] });
  });
});
