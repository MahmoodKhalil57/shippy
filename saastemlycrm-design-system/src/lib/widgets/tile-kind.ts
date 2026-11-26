import { boundsOf, type SpanRows, type TileBounds, type TileSize } from "../base/board.ts";

export type TileKind = "stats" | "text" | "card" | "table" | "list" | "chart" | "entries";

export const TILE_KINDS: readonly TileKind[] = ["stats", "text", "card", "table", "list", "chart", "entries"];

export const KIND_BOUNDS: Record<TileKind, Required<Pick<SpanRows, "minSpan" | "minRows" | "maxRows">> & SpanRows> = {
  stats: { minSpan: 3, maxSpan: 8, minRows: 2, maxRows: 6 },
  text: { minSpan: 4, minRows: 1, maxRows: 6 },
  list: { minSpan: 5, minRows: 4, maxRows: 20 },
  card: { minSpan: 5, minRows: 3, maxRows: 20 },
  entries: { minSpan: 6, minRows: 4, maxRows: 30 },
  chart: { minSpan: 6, minRows: 4, maxRows: 14 },
  table: { minSpan: 8, minRows: 5, maxRows: 30 },
};

export function defaultRows(kind: TileKind | undefined, size: TileSize): number {
  switch (kind) {
    case "text":
      return 2;
    case "stats":
      return 3;
    case "list":
    case "chart":
    case "card":
      return 8;
    case "table":
    case "entries":
      return 10;
    default:
      return size === "s" || size === "m" ? 8 : 10;
  }
}

export const reflowOf = (kind: TileKind | undefined) => (kind === "stats" ? 4 : kind === "text" ? 2 : 1);

export const kindBoundsOf = (w: Parameters<typeof boundsOf>[0] & { kind?: TileKind }): TileBounds =>
  boundsOf(w, w.kind ? KIND_BOUNDS[w.kind] : {});
