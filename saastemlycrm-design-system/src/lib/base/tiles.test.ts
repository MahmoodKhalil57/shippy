import { describe, it, expect } from "vite-plus/test";
import {
  COLUMN_STEP,
  MIN_COLUMNS,
  TILE_H_REM,
  TILE_W_REM,
  columnsFor,
  marginFor,
  tileH,
  tileW,
  tileWIn,
} from "./tiles";

describe("tile sizes", () => {
  it("scales the rem tile size to pixels", () => {
    expect(tileW()).toBe(TILE_W_REM * 16);
    expect(tileH()).toBe(TILE_H_REM * 16);
    expect(tileW(2)).toBe(TILE_W_REM * 32);
    expect(tileH(0.5)).toBe(TILE_H_REM * 8);
  });
});

describe("columnsFor", () => {
  it("never goes below the minimum", () => {
    expect(columnsFor(0)).toBe(MIN_COLUMNS);
    expect(columnsFor(-100)).toBe(MIN_COLUMNS);
    expect(columnsFor(tileW() * 3)).toBe(MIN_COLUMNS);
  });

  it("grows in steps of two", () => {
    expect(columnsFor(tileW() * 7)).toBe(MIN_COLUMNS);
    expect(columnsFor(tileW() * 8)).toBe(MIN_COLUMNS + COLUMN_STEP);
    expect(columnsFor(tileW() * 9.9)).toBe(MIN_COLUMNS + COLUMN_STEP);
    expect(columnsFor(tileW() * 10)).toBe(MIN_COLUMNS + 2 * COLUMN_STEP);
    expect(columnsFor(tileW(2) * 10, 2)).toBe(10);
  });
});

describe("tileWIn and marginFor", () => {
  it("shrinks tiles to fit the minimum columns", () => {
    expect(tileWIn(120)).toBe(20);
    expect(tileWIn(10000)).toBe(tileW());
  });

  it("centres the grid", () => {
    expect(marginFor(120)).toBe(0);
    expect(marginFor(tileW() * 8 + 30)).toBeCloseTo(15);
  });
});
