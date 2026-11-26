export const TILE_W_REM = 3.3125;
export const TILE_H_REM = 3.5;
export const MIN_COLUMNS = 6;
export const COLUMN_STEP = 2;
export const TILE_INSET = 4;
export const PAGE_MAX_TILES = 24;

export const tileW = (scale = 1) => TILE_W_REM * 16 * scale;
export const tileH = (scale = 1) => TILE_H_REM * 16 * scale;

export function columnsFor(width: number, scale = 1): number {
  const fit = Math.floor(width / tileW(scale) + 1e-9);
  return Math.max(MIN_COLUMNS, MIN_COLUMNS + COLUMN_STEP * Math.floor((fit - MIN_COLUMNS) / COLUMN_STEP));
}

export const tileWIn = (width: number, scale = 1) => Math.min(tileW(scale), width / MIN_COLUMNS);

export const marginFor = (width: number, scale = 1) => (width - columnsFor(width, scale) * tileWIn(width, scale)) / 2;
