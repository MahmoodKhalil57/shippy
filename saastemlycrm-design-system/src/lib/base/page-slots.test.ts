import { describe, it, expect } from "vite-plus/test";
import { pageSlots } from "./page-slots";

describe("pageSlots", () => {
  it("lists every page when they fit in the window", () => {
    expect(pageSlots(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pageSlots(3, 3)).toEqual([1, 2, 3]);
  });

  it("treats a total below one as a single page", () => {
    expect(pageSlots(1, 0)).toEqual([1]);
    expect(pageSlots(4, -3)).toEqual([1]);
  });

  it("collapses the tail when the page is near the start", () => {
    expect(pageSlots(1, 20)).toEqual([1, 2, 3, 4, 5, { from: 6, to: 19 }, 20]);
    expect(pageSlots(4, 20)).toEqual([1, 2, 3, 4, 5, { from: 6, to: 19 }, 20]);
  });

  it("clamps a page below one to the first page", () => {
    expect(pageSlots(-5, 20)).toEqual(pageSlots(1, 20));
  });

  it("collapses the head when the page is near the end", () => {
    expect(pageSlots(20, 20)).toEqual([1, { from: 2, to: 15 }, 16, 17, 18, 19, 20]);
    expect(pageSlots(17, 20)).toEqual([1, { from: 2, to: 15 }, 16, 17, 18, 19, 20]);
  });

  it("clamps a page past the end to the last page", () => {
    expect(pageSlots(99, 20)).toEqual(pageSlots(20, 20));
  });

  it("collapses both sides around a middle page", () => {
    expect(pageSlots(10, 20)).toEqual([1, { from: 2, to: 8 }, 9, 10, 11, { from: 12, to: 19 }, 20]);
  });

  it("widens the window with more siblings", () => {
    expect(pageSlots(10, 20, 2)).toEqual([1, { from: 2, to: 7 }, 8, 9, 10, 11, 12, { from: 13, to: 19 }, 20]);
    expect(pageSlots(1, 9, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("always keeps the same number of slots once the pages overflow", () => {
    for (let page = 1; page <= 30; page++) expect(pageSlots(page, 30)).toHaveLength(7);
  });
});
