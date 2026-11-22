import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vite-plus/test";
import {
  COLUMN_STEP,
  MIN_COLUMNS,
  PAGE_MAX_TILES,
  TILE_H_REM,
  TILE_W_REM,
  columnsFor,
  marginFor,
  tileW,
  tileWIn,
} from "../src/components/base/tiles.ts";
import { lanesFor } from "../src/components/base/board.ts";
import { board } from "../src/components/primitives/layout/algebra.ts";
import { container } from "../src/components/primitives/layout/container.ts";

/**
 * The tile grid (src/components/base/tiles.ts), proved for every window width from 320 to 3840px
 * (each whole pixel) at text sizes 1×, 1.25× and 1.5×: an even number of tiles across, never fewer
 * than 6, all of them inside the window, two more exactly when two more fit (so the grid gains a tile
 * on each side and never re-centres by half a tile), equal margins that are never negative, and a
 * column count that never drops as the window widens.
 */
const WIDTHS = Array.from({ length: 3840 - 320 + 1 }, (_, i) => 320 + i);
const SCALES = [1, 1.25, 1.5];

describe("the tile grid", () => {
  it("is 53 × 56px at the default text size, in the CSS's own tokens", () => {
    expect(tileW()).toBe(53);
    expect(TILE_H_REM * 16).toBe(56);
    const theme = readFileSync(path.resolve(import.meta.dirname, "../src/styles/theme.css"), "utf8");
    expect(theme).toContain(`--tile-w: ${TILE_W_REM}rem;`);
    expect(theme).toContain(`--tile-h: ${TILE_H_REM}rem;`);
  });

  it("holds 6 tiles at 320px, adds two at a time, and centres them", () => {
    expect(columnsFor(320)).toBe(6);
    expect(marginFor(320)).toBe(1);
    const problems: string[] = [];
    for (const scale of SCALES) {
      let before = 0;
      for (const w of WIDTHS) {
        const n = columnsFor(w, scale);
        const t = tileWIn(w, scale);
        const at = `${w}px ×${scale}`;
        if (n < MIN_COLUMNS || n % COLUMN_STEP !== 0) problems.push(`${at}: ${n} tiles`);
        if (n * t > w + 1e-6) problems.push(`${at}: ${n} tiles of ${t}px overflow`);
        // Two more exactly when two more full tiles fit.
        const more = (n + COLUMN_STEP) * tileW(scale) <= w + 1e-6;
        if (more) problems.push(`${at}: room for ${n + COLUMN_STEP}`);
        if (n > MIN_COLUMNS && (n * tileW(scale) > w + 1e-6 || t !== tileW(scale)))
          problems.push(`${at}: tiles shrank`);
        if (marginFor(w, scale) < -1e-6) problems.push(`${at}: negative margin`);
        if (n < before) problems.push(`${at}: fewer tiles than at ${w - 1}px`);
        before = n;
      }
    }
    expect(problems.slice(0, 5)).toEqual([]);
  });
});

/**
 * The page's content is at most `PAGE_MAX_TILES` tiles across (`<ui-container padding-x="slack">`):
 * its padding is the frame's (`--frame-pad-x`) or half of what's past 24 tiles, whichever is more.
 * Proved for every main panel from 320 to 3840px (each whole pixel), every padding the frame gives
 * there (half a tile to a tile and a half), at text sizes 1×, 1.25× and 1.5×: the board inside
 * counts at most 24 tiles, exactly 24 when the frame's padding leaves 24 or more, and otherwise as
 * many as before the cap; the recipe is that formula with that number.
 */
describe("the page is at most 24 tiles across", () => {
  it("is the recipe's formula", () => {
    const slack = container({ paddingX: "slack" });
    expect(slack).toContain(`calc((100%_-_var(--tile-w)*${PAGE_MAX_TILES})/2)`);
    expect(slack).toContain("max(var(--frame-pad-x,var(--frame-slack,0px)),");
  });
  it("counts at most 24 tiles, and the same tiles below the cap", () => {
    const problems: string[] = [];
    for (const scale of SCALES)
      for (const w of WIDTHS)
        for (const pad of [0.5, 0.75, 1, 1.5].map((t) => t * tileW(scale))) {
          const free = w - 2 * pad;
          if (free <= 0) continue;
          const content = w - 2 * Math.max(pad, (w - PAGE_MAX_TILES * tileW(scale)) / 2);
          const capped = lanesFor(content, scale);
          const was = lanesFor(free, scale);
          if (capped > PAGE_MAX_TILES) problems.push(`${w}px ×${scale}: ${capped} tiles`);
          if (capped !== Math.min(was, PAGE_MAX_TILES))
            problems.push(`${w}px ×${scale} pad ${pad}: ${capped}, not ${Math.min(was, PAGE_MAX_TILES)}`);
        }
    expect(problems.slice(0, 5)).toEqual([]);
  });
});

/**
 * Floating surfaces are tiles (the layout algebra's `floating`, `floatingFit`, `floatingHeight`,
 * `tip`, `tiles`): in every primitive, a class string that draws a floating surface (glass,
 * `liquid-glass*`, or a dialog, `modal-box`) sizes it only in tiles: every width it sets is in
 * tiles (`--tile-w`, or the frame's own tile widths `--frame-nav` / `--frame-aside` /
 * `--frame-rail`) or follows its parent (`w-full`, `max-w-full`, `max-w-none`, `min-w-0`,
 * `w-auto`), every height is in tiles (`--tile-h`) or follows its parent, and its recipe takes a
 * width in tiles. A surface sized by its content alone (`w-fit`, `w-max`, a rem width) is refused:
 * that's how a tooltip in a 64px sparkline ended up a letter a line.
 */
describe("floating surfaces are tiles", async () => {
  const { parseSync } = await import("vite/rolldown/utils");
  const { splitVariants } = await import("../vite/layout-proof/tokens.ts");
  const { readdirSync } = await import("node:fs");
  const dir = path.resolve(import.meta.dirname, "../src/components/primitives");
  const files = readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".ts") && e.name !== "index.ts" && e.name !== "algebra.ts")
    .map((e) => path.join(e.parentPath, e.name));
  const MARKER = /(?:^|[\s:`"])(?:liquid-glass(?:-clear|-surface)?|modal-box)(?=$|[\s`"])/;
  const TILE_REF =
    /\$\{\s*(?:floating|floatingFit|floatingHeight|tiles|tileCap|tip)\b|--tile-w|--frame-(?:nav|aside|rail)\b/;
  const FREE_W = new Set(["w-full", "max-w-full", "max-w-none", "min-w-0", "w-auto"]);
  const FREE_H = new Set(["h-full", "max-h-full", "h-auto", "min-h-0"]);
  type N = { type: string; start: number; end: number; [k: string]: unknown };
  const isN = (v: unknown): v is N => typeof v === "object" && v !== null && "type" in v;
  const problems = (text: string) =>
    text
      .replace(/\$\{[^}]*\}/g, " ")
      .split(/[\s`"']+/)
      .filter(Boolean)
      .flatMap((token) => {
        const base = splitVariants(token).pop()!.replace(/^!|!$/g, "");
        if (
          /^-?(?:w|min-w|max-w|size)-/.test(base) &&
          !FREE_W.has(base) &&
          !/--tile-w|--frame-(?:nav|aside|rail)\b/.test(base)
        )
          return [`${token}: a width that isn't tiles`];
        if (/^-?(?:h|min-h|max-h)-/.test(base) && !FREE_H.has(base) && !/--tile-h/.test(base))
          return [`${token}: a height that isn't tiles`];
        return [];
      });

  it.each(files.map((f) => [path.relative(dir, f), f]))("%s", (_, file) => {
    const source = readFileSync(file, "utf8");
    const { program } = parseSync(file, source);
    const bad: string[] = [];
    const text = (n: N) => source.slice(n.start, n.end);
    const visit = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!isN(node)) return;
      const callee = node.callee as N | undefined;
      if (
        node.type === "CallExpression" &&
        callee?.type === "Identifier" &&
        ["rcva", "cva"].includes(callee.name as string)
      ) {
        const call = text(node);
        const [base, config] = node.arguments as N[];
        const values: N[] = [];
        const options = (config?.properties as N[] | undefined)?.find(
          (p) => source.slice((p.key as N).start, (p.key as N).end) === "variants",
        );
        for (const v of ((options?.value as N | undefined)?.properties as N[] | undefined) ?? [])
          for (const o of ((v.value as N).properties as N[] | undefined) ?? []) values.push(o.value as N);
        const compound = (config?.properties as N[] | undefined)?.find(
          (p) => source.slice((p.key as N).start, (p.key as N).end) === "compoundVariants",
        );
        const baseText = base ? text(base) : "";
        // A recipe whose base is a floating surface: its base, variants and compounds size it.
        const units: string[][] = MARKER.test(baseText)
          ? [[baseText, ...values.map(text), ...(compound ? [text(compound.value as N)] : [])]]
          : values.filter((v) => MARKER.test(text(v))).map((v) => [text(v)]);
        for (const unit of units) {
          bad.push(...unit.flatMap(problems));
          if (!TILE_REF.test(call)) bad.push(`${baseText.slice(0, 60)}…: a floating surface with no width in tiles`);
        }
        return;
      }
      for (const [k, v] of Object.entries(node)) if (k !== "key") visit(v);
    };
    visit(program);
    expect(bad).toEqual([]);
  });
});

/**
 * Every widget keeps to the space it's given, by construction: the board's cell clips what's in it
 * (`board.tile`); a tile with a surface is a card exactly its cell's box, its body capped under its
 * header (`tile`, `tileBody`); a bare tile is a column that clips (`tile` `bare`) whose content takes
 * what's left of the box (`tileContent` `fill`); and a figure that is a widget of its own fills that
 * content and clips its own (`statSurface` `fill`), so its card is the tile, whatever it holds.
 */
describe("every widget keeps to its tile", () => {
  const src = (f: string) => readFileSync(path.join(import.meta.dirname, "../src/components/primitives", f), "utf8");
  const tileSrc = src("containers/tile.ts");
  const statSrc = src("data/stat.ts");
  /** The class string a recipe gives, in its source: `name` (`= rcva("…"`) or a variant (`key: { true: "…"`). */
  const has = (text: string, at: RegExp, ...cs: string[]) => {
    const m = at.exec(text);
    expect(m, String(at)).toBeTruthy();
    const set = new Set(m![1]!.split(/\s+/));
    for (const c of cs) expect(set.has(c), `${at} has ${c}`).toBe(true);
  };
  it("is the recipes' rules", () => {
    const cell = new Set(board.tile.split(/\s+/));
    expect(cell.has("overflow-clip")).toBe(true);
    has(tileSrc, /export const tile = rcva\("([^"]*)"/, "h-full", "min-h-0");
    has(tileSrc, /bare: \{ true: "([^"]*)"/, "flex", "flex-col", "overflow-hidden");
    has(tileSrc, /capped: \{ true: "([^"]*)"/, "grow", "min-h-0", "overflow-hidden");
    has(tileSrc, /fill: \{ true: "([^"]*)"/, "grow", "min-h-0");
    has(statSrc, /fill: \{ true: "([^"]*)"/, "grow", "basis-0", "min-h-0", "overflow-hidden");
  });
});
