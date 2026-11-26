import { describe, it, expect } from "vite-plus/test";
import {
  closeColumn,
  fits,
  frameSizesAt,
  isCompact,
  MAIN_CHROME,
  MAIN_COMFORT_TILES,
  mainContent,
  mainTiles,
  NAV_EXPANDED_COLUMNS,
  OPEN,
  openColumn,
  RAIL,
  refit,
  room,
  wantsNav,
  type FrameSizes,
  type FrameState,
} from "./frame-fit";
import { columnsFor, tileWIn } from "./tiles";

const sizes = (cols: number, mainChrome = 0): FrameSizes => ({ cols, tile: 50, mainChrome });

const closed: FrameState = { compact: false, navOpen: false, navSheet: false, asideOpen: false, asideSheet: false };
const state = (over: Partial<FrameState> = {}): FrameState => ({ ...closed, ...over });

describe("frame constants", () => {
  it("rounds the expanded navigation width up to an even column count", () => {
    expect(NAV_EXPANDED_COLUMNS % 2).toBe(0);
    expect(NAV_EXPANDED_COLUMNS).toBe(24);
  });
});

describe("frameSizesAt", () => {
  it("measures columns and tile width from the tile grid", () => {
    expect(frameSizesAt(1000)).toEqual({ cols: columnsFor(1000, 1), tile: tileWIn(1000, 1), mainChrome: MAIN_CHROME });
  });

  it("passes the text scale and main chrome through", () => {
    expect(frameSizesAt(1000, 1.5, 12)).toEqual({
      cols: columnsFor(1000, 1.5),
      tile: tileWIn(1000, 1.5),
      mainChrome: 12,
    });
  });
});

describe("wantsNav", () => {
  it("follows an explicit choice", () => {
    expect(wantsNav(true, sizes(6))).toBe(true);
    expect(wantsNav(false, sizes(40))).toBe(false);
  });

  it("expands the navigation only on wide frames without a choice", () => {
    expect(wantsNav(null, sizes(NAV_EXPANDED_COLUMNS))).toBe(true);
    expect(wantsNav(undefined, sizes(NAV_EXPANDED_COLUMNS - 2))).toBe(false);
  });
});

describe("room", () => {
  it("takes the open width for a pushing column", () => {
    expect(room("start", true, false, false)).toBe(OPEN);
    expect(room("end", true, false, true)).toBe(OPEN);
  });

  it("takes a rail for a closed or sheet column", () => {
    expect(room("start", false, false, false)).toBe(RAIL);
    expect(room("start", true, true, true)).toBe(RAIL);
    expect(room("end", true, true, false)).toBe(RAIL);
  });

  it("takes nothing for the end column when compact", () => {
    expect(room("end", false, false, true)).toBe(0);
    expect(room("end", true, true, true)).toBe(0);
  });
});

describe("fits and isCompact", () => {
  it("fits while the main keeps its comfortable width", () => {
    expect(fits(OPEN, RAIL, sizes(OPEN + RAIL + MAIN_COMFORT_TILES))).toBe(true);
    expect(fits(OPEN, RAIL, sizes(OPEN + RAIL + MAIN_COMFORT_TILES - 1))).toBe(false);
  });

  it("is compact when two rails leave too little main", () => {
    expect(isCompact(sizes(8))).toBe(false);
    expect(isCompact(sizes(6))).toBe(true);
  });
});

describe("mainTiles and mainContent", () => {
  it("subtracts both columns from the frame", () => {
    expect(mainTiles(state(), sizes(12))).toBe(10);
    expect(mainTiles(state({ navOpen: true, asideOpen: true }), sizes(12))).toBe(4);
    expect(mainTiles(state({ compact: true, navOpen: true, navSheet: true }), sizes(6))).toBe(5);
  });

  it("converts the tiles to pixels less the main chrome", () => {
    expect(mainContent(state(), sizes(12, 8))).toBe(10 * 50 - 8);
  });
});

describe("openColumn", () => {
  it("pushes the navigation when it fits beside the aside", () => {
    expect(openColumn("start", state(), sizes(12))).toEqual(state({ navOpen: true }));
  });

  it("pushes the aside when it fits beside the navigation", () => {
    expect(openColumn("end", state(), sizes(12))).toEqual(state({ asideOpen: true }));
  });

  it("closes a pushing aside to make room for the navigation", () => {
    expect(openColumn("start", state({ asideOpen: true }), sizes(12))).toEqual(state({ navOpen: true }));
  });

  it("closes a pushing navigation to make room for the aside", () => {
    expect(openColumn("end", state({ navOpen: true }), sizes(12))).toEqual(state({ asideOpen: true }));
  });

  it("opens a sheet when even closing the other column leaves too little room", () => {
    expect(openColumn("start", state({ asideOpen: true }), sizes(9))).toEqual(
      state({ asideOpen: true, navOpen: true, navSheet: true }),
    );
    expect(openColumn("end", state({ navOpen: true }), sizes(9))).toEqual(
      state({ navOpen: true, asideOpen: true, asideSheet: true }),
    );
  });

  it("opens a sheet beside a sheet column that pushes nothing", () => {
    expect(openColumn("start", state({ asideOpen: true, asideSheet: true }), sizes(10))).toEqual(
      state({ asideOpen: true, asideSheet: true, navOpen: true, navSheet: true }),
    );
  });

  it("always opens a sheet when compact", () => {
    expect(openColumn("start", state({ compact: true }), sizes(40))).toEqual(
      state({ compact: true, navOpen: true, navSheet: true }),
    );
    expect(openColumn("end", state({ compact: true }), sizes(40))).toEqual(
      state({ compact: true, asideOpen: true, asideSheet: true }),
    );
  });
});

describe("closeColumn", () => {
  it("closes only the given side", () => {
    const open = state({ navOpen: true, asideOpen: true });
    expect(closeColumn("start", open)).toEqual(state({ asideOpen: true }));
    expect(closeColumn("end", open)).toEqual(state({ navOpen: true }));
  });
});

describe("refit", () => {
  it("turns open columns into sheets when the frame becomes compact", () => {
    expect(refit(state({ navOpen: true, asideOpen: true }), sizes(6))).toEqual(
      state({ compact: true, navOpen: true, navSheet: true, asideOpen: true, asideSheet: true }),
    );
  });

  it("leaves closed columns closed when compact", () => {
    expect(refit(state(), sizes(6), true)).toEqual(state({ compact: true }));
  });

  it("closes a pushing aside that no longer fits", () => {
    expect(refit(state({ navOpen: true, asideOpen: true }), sizes(12))).toEqual(state({ navOpen: true }));
  });

  it("closes a pushing navigation that no longer fits", () => {
    expect(refit(state({ navOpen: true }), sizes(10))).toEqual(state());
  });

  it("keeps a sheet navigation open whatever the room", () => {
    expect(refit(state({ navOpen: true, navSheet: true }), sizes(8))).toEqual(state({ navOpen: true, navSheet: true }));
  });

  it("keeps columns that still fit", () => {
    expect(refit(state({ asideOpen: true }), sizes(12))).toEqual(state({ asideOpen: true }));
  });

  it("opens a wanted navigation as a pushing column when it fits", () => {
    expect(refit(state(), sizes(12), true)).toEqual(state({ navOpen: true }));
    expect(refit(state({ navOpen: true, navSheet: true }), sizes(12), true)).toEqual(
      state({ navOpen: true, navSheet: true }),
    );
  });

  it("leaves a wanted navigation closed when it would not fit", () => {
    expect(refit(state(), sizes(10), true)).toEqual(state());
  });
});
