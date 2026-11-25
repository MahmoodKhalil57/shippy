import type { TileSize } from "../../components/base/board.ts";
import type { Action, Cell, Entry, ViewBlock } from "./schema.ts";
import type { TileEmphasis } from "./widget.ts";

const actionsOf = (b: ViewBlock): Action[] =>
  b.type === "actions"
    ? b.items
    : b.type === "card" || b.type === "alert"
      ? (b.actions ?? [])
      : b.type === "list"
        ? b.items.flatMap((i) => i.actions ?? [])
        : [];

export const MAX_HEADING = 90;
export const MAX_ACTION_WORDS = 4;
export const MAX_STATS = 6;

const words = (c: Cell): string =>
  c == null ? "" : typeof c === "string" || typeof c === "number" ? String(c) : c.text;
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

function repeats(texts: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const t of texts.map(norm)) {
    if (t.length < 12) continue;
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

export const MAX_TILE_BLOCKS: Record<TileSize, number> = { s: 4, m: 6, l: 8, full: 8 };

export interface DrawnTile {
  title?: string;
  size?: TileSize;
  emphasis?: TileEmphasis;
  blocks: ViewBlock[];
}

const BARE: ReadonlySet<ViewBlock["type"]> = new Set<ViewBlock["type"]>([
  "choice",
  "actions",
  "alert",
  "document",
  "stats",
  "empty",
]);

export const MAX_INVERSE_TILES = 1;

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

function tileRules(t: DrawnTile, where: string): string[] {
  const out: string[] = [];
  const at = `${where} › ${t.title?.trim() || "untitled tile"}`;
  if (t.size === "s" && hasTable(t.blocks)) out.push(`${at}: a table in an \`s\` tile; make it \`m\` or wider`);
  for (const b of t.blocks)
    if (b.type === "grid" || b.type === "split")
      out.push(`${at}: a ${b.type} at the top of a tile; make its parts widgets of their own`);
  const max = MAX_TILE_BLOCKS[t.size ?? "full"];
  if (t.blocks.length > max)
    out.push(
      `${at}: ${t.blocks.length} blocks in ${t.size ? `an \`${t.size}\`` : "a"} tile (at most ${max}); keep it about one thing`,
    );
  if (!t.title?.trim()) {
    const bare = [...new Set(t.blocks.filter((b) => !BARE.has(b.type)).map((b) => b.type))];
    if (bare.length) out.push(`${at}: ${bare.join(", ")} without a title; give the widget a \`title\``);
    if (t.emphasis) out.push(`${at}: \`emphasis\` on an untitled tile does nothing; give the widget a \`title\``);
  }
  return out;
}

function boardRules(tiles: DrawnTile[], where: string): string[] {
  const inverse = tiles.filter((t) => t.emphasis === "inverse" && t.title?.trim());
  if (inverse.length <= MAX_INVERSE_TILES) return [];
  return [
    `${where}: ${inverse.length} inverse tiles (${inverse.map((t) => t.title).join(", ")}); keep the one the screen is about, make the others \`tinted\` or plain`,
  ];
}

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

export const tileProblems = (tiles: DrawnTile[], where: string): string[] => [
  ...tiles.flatMap((t) => tileRules(t, where)),
  ...boardRules(tiles, where),
];

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
          if (!b.blocks.length && b.count === undefined)
            out.push(`${here}: an empty card; give its widget an empty state (\`empty\`)`);
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
          if (b.items.length > 1 && b.size !== "sm")
            out.push(
              `${at}: ${b.items.length} figures in one tile; make each its own widget (\`figures\`, or \`metrics\`/\`counts\`)`,
            );
          if (b.items.length > MAX_STATS)
            out.push(`${at}: ${b.items.length} stats in a row; keep the ${MAX_STATS} that matter`);
          if (b.size !== "sm")
            for (const s of b.items)
              if (/\d/.test(s.value) && !s.trend && !s.delta && !s.share)
                out.push(
                  `${at} › "${s.label}": a bare figure; give it a trend (\`trend\`), a change (\`delta\`) or its part of a whole or a target (\`share\`)`,
                );
          break;
        case "entries":
          for (const e of b.items) {
            out.push(...entryProblems(e, at));
            for (const a of e.actions ?? []) label(a, at);
          }
          break;
        case "alert":
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
