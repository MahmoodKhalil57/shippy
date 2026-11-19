import type { Action, Cell, Entry, ViewBlock } from "./schema.ts";

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
 * (`mock-runner/testing`, `screenDesignProblems`), with each user's data.
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

/** What breaks the design in these blocks; `where` names the screen and widget in messages. */
export function designProblems(blocks: ViewBlock[], where: string): string[] {
  const out: string[] = [];
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
