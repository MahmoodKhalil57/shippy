import type { TileSize } from "../../components/base/board.ts";
import type { ViewBlock } from "./schema.ts";
import type { Widget } from "./widget.ts";

/**
 * How many lanes of the board a widget takes (src/components/base/board.ts): its own `size` when
 * it says, else the widest of what it draws, by this rule, so screens look the same everywhere:
 *
 * - `l` (3 lanes): what needs width to read: a table, a timeline chart (gantt), a document, a
 *   form, settings, a message;
 * - `m` (2 lanes): a chart, a set of entries, a timeline, tiles, steps, a question box, three or
 *   more stats, a grid or split of cards;
 * - `full`: a choice (it sets what every other tile shows);
 * - `s` (1 lane): everything else (a card of facts, a list, gauges, an alert, one or two stats).
 *
 * A tile never takes more lanes than the board has, so every size works on a phone (one lane).
 */
export type { TileSize };

const ORDER: TileSize[] = ["s", "m", "l", "full"];
const wider = (a: TileSize, b: TileSize): TileSize => (ORDER.indexOf(a) >= ORDER.indexOf(b) ? a : b);

/** The size one block asks for. */
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

/** The size of what a widget draws: the widest of its blocks. */
export const tileSizeOf = (blocks: ViewBlock[]): TileSize => blocks.map(blockSize).reduce(wider, "s");

/** The size while it loads: from its skeleton's shape. */
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
