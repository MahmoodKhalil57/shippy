import type { TileSize } from "../../components/base/board.ts";
import type { ViewBlock } from "./schema.ts";
import type { Widget } from "./widget.ts";

export type { TileSize };

const ORDER: TileSize[] = ["s", "m", "l", "full"];
const wider = (a: TileSize, b: TileSize): TileSize => (ORDER.indexOf(a) >= ORDER.indexOf(b) ? a : b);

function blockSize(b: ViewBlock): TileSize {
  switch (b.type) {
    case "table":
    case "gantt":
    case "document":
    case "form":
    case "settings":
    case "message":
      return "l";
    case "chart":
    case "heatmap":
    case "treemap":
    case "waterfall":
    case "quadrant":
    case "whatif":
    case "entries":
    case "timeline":
    case "tiles":
    case "steps":
    case "ask":
    case "grid":
    case "split":
      return "m";
    case "stats":
      return b.items.length >= 3 ? "m" : "s";
    case "choice":
      return "full";
    case "card":
      return b.blocks.map(blockSize).reduce(wider, "s");
    default:
      return "s";
  }
}

export const tileSizeOf = (blocks: ViewBlock[]): TileSize => blocks.map(blockSize).reduce(wider, "s");

export function loadingSize(w: Widget): TileSize {
  switch (w.skeleton) {
    case "table":
      return "l";
    case "chart":
    case "entries":
    case "stats":
      return "m";
    default:
      return w.records ? (w.records.layout === "list" ? "s" : "l") : w.counts ? "m" : "s";
  }
}
