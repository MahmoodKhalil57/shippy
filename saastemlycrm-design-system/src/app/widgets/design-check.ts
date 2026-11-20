import type { TileSize } from "../../components/base/board.ts";
import type { Action, Cell, Entry, ViewBlock } from "./schema.ts";
import type { TileEmphasis } from "./widget.ts";

/** The buttons a block shows itself (not its children's). */
const actionsOf = (b: ViewBlock): Action[] =>
  b.type === "actions"
    ? b.items
    : b.type === "card" || b.type === "alert"
      ? (b.actions ?? [])
      : b.type === "list"
        ? b.items.flatMap((i) => i.actions ?? [])
        : [];

/**
 * Design rules that only show with real data: what the types and the lint rules can't see.
 * `designProblems` reads the blocks a screen drew (as `render` returned them) and says what
 * breaks the design, in words a screen's author can act on. Pure: tests run it in Node
 * (`saastemlycrm-design-system/testing`, `screenDesignProblems`), with each user's data.
 *
 * Each limit comes from Material 3 or Apple's HIG (local copies: material-web/.m3-specs,
 * material-web/.apple-specs); the source is named next to it.
 */

/**
 * Longest heading that still reads as a heading (card, entry, widget, `heading` block): about two
 * lines in a card. HIG Alerts: "avoid overly long titles that wrap to more than two lines".
 */
export const MAX_HEADING = 90;
/** Most words in a button label. M3 Buttons: label text "should be very brief, ideally 1–3 words". */
export const MAX_ACTION_WORDS = 4;
/** Most stats in one row: the most a balanced row (`ui-grid balance`) lays out evenly. */
export const MAX_STATS = 6;

const words = (c: Cell): string =>
  c == null ? "" : typeof c === "string" || typeof c === "number" ? String(c) : c.text;
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/** Texts said twice in one place (a fact repeating another, a note repeating the text). */
function repeats(texts: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const t of texts.map(norm)) {
    if (t.length < 12) continue; // short values ("Yes", "USD 0") repeat legitimately
    if (seen.has(t)) out.add(t);
    seen.add(t);
  }
  return [...out];
}

function entryProblems(e: Entry, where: string): string[] {
  const out: string[] = [];
  const at = `${where} › "${e.heading}"`;
  if (e.heading.length > MAX_HEADING)
    out.push(`${at}: heading is ${e.heading.length} characters; put the detail in meta or facts`);
  const said = [e.text ?? "", ...(e.facts ?? []).map((f) => words(f.value)), ...(e.notes ?? []), e.notice?.text ?? ""];
  for (const r of repeats(said)) out.push(`${at}: "${r.slice(0, 60)}" is said twice`);
  return out;
}

/**
 * The most top-level blocks a tile of each size holds: keep a tile about one thing. M3 Cards: "Use
 * cards to display related information on a single subject"; HIG Layout: "An interface with too
 * much content and too many choices makes it harder to find information quickly" (disclose the
 * rest progressively: `details`, or another widget on the same source).
 */
export const MAX_TILE_BLOCKS: Record<TileSize, number> = { s: 4, m: 6, l: 8, full: 8 };

/** One tile of the board as a screen drew it: its widget's title, size and blocks. */
export interface DrawnTile {
  title?: string;
  /** Unknown when only the drawn blocks are at hand: then the rules that need it don't run. */
  size?: TileSize;
  /** The contrasting surface its widget asked for. */
  emphasis?: TileEmphasis;
  blocks: ViewBlock[];
}

/**
 * Blocks that may stand bare (an untitled tile): what steers the screen, an alert, or a strip of
 * key figures, where each figure is a labelled cell of its own (the header HIG asks a list or
 * table for is on every cell).
 */
const BARE: ReadonlySet<ViewBlock["type"]> = new Set<ViewBlock["type"]>([
  "choice",
  "actions",
  "alert",
  "document",
  "stats",
]);

/**
 * Most tiles on one screen that take the inverse surface. M3's inverse roles are "applied
 * selectively to components" to contrast with the UI around them: a second one contrasts with
 * nothing, and the screen has two things asking to be read first (M3 Buttons says the same of
 * actions: "a single prominent button for the primary action").
 */
export const MAX_INVERSE_TILES = 1;

/** Whether a table is anywhere in these blocks. */
const hasTable = (list: ViewBlock[]): boolean =>
  list.some((b) => {
    switch (b.type) {
      case "table":
        return true;
      case "card":
      case "grid":
        return hasTable(b.blocks);
      case "split":
        return hasTable(b.main) || hasTable(b.side);
      default:
        return false;
    }
  });

/** What breaks one tile's content for its size (sizes: src/components/base/board.ts). */
function tileRules(t: DrawnTile, where: string): string[] {
  const out: string[] = [];
  const at = `${where} › ${t.title?.trim() || "untitled tile"}`;
  // HIG Lists and tables: a multicolumn table shows "characteristics or attributes of the data in
  // separate, sortable columns", and wide tables need help to track rows; M3 Layout
  // (grids-spacing) keeps data tables for dense layouts that "scan, view, or compare a lot of
  // information". One 18rem lane leaves no room for columns.
  if (t.size === "s" && hasTable(t.blocks)) out.push(`${at}: a table in an \`s\` tile; make it \`m\` or wider`);
  // The board already lays the tiles out in lanes (M3 Cards: "Cards can be displayed together in a
  // grid"); a grid or split at a tile's top is a board inside a tile. Make its parts widgets
  // (`grid`/`split` widgets are flattened into tiles). Deeper, inside a card, is fine.
  for (const b of t.blocks)
    if (b.type === "grid" || b.type === "split")
      out.push(`${at}: a ${b.type} at the top of a tile; make its parts widgets of their own`);
  const max = MAX_TILE_BLOCKS[t.size ?? "full"];
  if (t.blocks.length > max)
    out.push(
      `${at}: ${t.blocks.length} blocks in ${t.size ? `an \`${t.size}\`` : "a"} tile (at most ${max}); keep it about one thing`,
    );
  // HIG Lists and tables: "use a label or a header to help people understand the context". Only
  // what steers the screen (a choice, actions), an alert or a strip of labelled figures stands
  // without a title.
  if (!t.title?.trim()) {
    const bare = [...new Set(t.blocks.filter((b) => !BARE.has(b.type)).map((b) => b.type))];
    if (bare.length) out.push(`${at}: ${bare.join(", ")} without a title; give the widget a \`title\``);
    // An emphasis is a surface, and an untitled tile has none.
    if (t.emphasis) out.push(`${at}: \`emphasis\` on an untitled tile does nothing; give the widget a \`title\``);
  }
  return out;
}

/** What breaks the tiles as a set: more than one inverse tile on the screen. */
function boardRules(tiles: DrawnTile[], where: string): string[] {
  const inverse = tiles.filter((t) => t.emphasis === "inverse" && t.title?.trim());
  if (inverse.length <= MAX_INVERSE_TILES) return [];
  return [
    `${where}: ${inverse.length} inverse tiles (${inverse.map((t) => t.title).join(", ")}); keep the one the screen is about, make the others \`tinted\` or plain`,
  ];
}

/**
 * The board's tiles when only the drawn blocks are at hand (`screenDesignProblems` draws a titled
 * widget as a `card` with its heading, a `grid`/`split` widget as a grid or split of its
 * children's, and an untitled widget as its blocks): each headed card is a tile, grids and splits
 * hold tiles, and any other top-level block is (part of) an untitled tile. Sizes are unknown.
 */
function tilesOf(blocks: ViewBlock[]): DrawnTile[] {
  return blocks.flatMap((b): DrawnTile[] => {
    switch (b.type) {
      case "card":
        return b.heading ? [{ title: b.heading, blocks: b.blocks }] : [{ blocks: [b] }];
      case "grid":
        return tilesOf(b.blocks);
      case "split":
        return [...tilesOf(b.main), ...tilesOf(b.side)];
      default:
        return [{ blocks: [b] }];
    }
  });
}

/**
 * What breaks the tiles' content: a table in an `s` tile, a grid or split at a tile's top, more
 * top-level blocks than its size holds (`MAX_TILE_BLOCKS`), an untitled tile that isn't a choice,
 * actions, an alert or key figures, and more than one inverse tile on the screen
 * (`MAX_INVERSE_TILES`). Each tile is a widget's title, size, emphasis and drawn blocks; the tiles
 * are one screen's, as one person sees it.
 */
export const tileProblems = (tiles: DrawnTile[], where: string): string[] => [
  ...tiles.flatMap((t) => tileRules(t, where)),
  ...boardRules(tiles, where),
];

/**
 * What breaks the design in these blocks; `where` names the screen and widget in messages. The
 * tile rules (`tileProblems`) run on `tiles` when given (each widget's title, size and blocks);
 * otherwise on the tiles read from the blocks' top level, without the rule that needs a size.
 */
export function designProblems(blocks: ViewBlock[], where: string, tiles?: DrawnTile[]): string[] {
  const out: string[] = tileProblems(tiles ?? tilesOf(blocks), where);
  const label = (a: Action, at: string) => {
    const n = a.label.trim().split(/\s+/).length;
    if (n > MAX_ACTION_WORDS) out.push(`${at}: button "${a.label}" is ${n} words; say the verb in 1–3 (M3 Buttons)`);
  };
  const walk = (list: ViewBlock[], at: string, depth: number) => {
    for (const b of list) {
      for (const a of actionsOf(b)) label(a, at);
      switch (b.type) {
        case "card": {
          const here = `${at} › ${b.heading ?? "card"}`;
          if (b.heading && b.heading.length > MAX_HEADING)
            out.push(`${here}: heading is ${b.heading.length} characters`);
          if (!b.blocks.length && b.count === undefined) out.push(`${here}: an empty card; hide it (\`hidden\`)`);
          if (depth >= 2) out.push(`${here}: a card three levels deep; flatten it or use \`entries\``);
          walk(b.blocks, here, depth + 1);
          break;
        }
        case "grid":
          walk(b.blocks, at, depth);
          break;
        case "split":
          walk(b.main, at, depth);
          walk(b.side, at, depth);
          break;
        case "heading":
          if (b.text.length > MAX_HEADING) out.push(`${at}: heading block is ${b.text.length} characters`);
          break;
        case "stats":
          if (b.items.length > MAX_STATS)
            out.push(`${at}: ${b.items.length} stats in a row; keep the ${MAX_STATS} that matter`);
          break;
        case "entries":
          for (const e of b.items) {
            out.push(...entryProblems(e, at));
            for (const a of e.actions ?? []) label(a, at);
          }
          break;
        case "alert":
          // HIG Alerts: "Avoid using an alert merely to provide information."
          if (b.tone === "info" && !b.actions?.length)
            out.push(`${at}: an info alert with nothing to do ("${b.text.slice(0, 50)}…"); make it a note()`);
          break;
        default:
          break;
      }
    }
  };
  walk(blocks, where, 0);
  return out;
}
