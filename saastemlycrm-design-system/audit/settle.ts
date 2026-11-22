/**
 * Settle audit: for every screen, each board tile's box when it is first painted (its skeleton)
 * against its box once nothing is loading. Reports per screen what moved, grew, shrank, vanished or
 * came late, and a cumulative score (the area that moved, times how far, as a share of the window:
 * 0 is a screen whose skeleton is exactly what it settles into). Writes, per screen, an overlay of
 * the skeleton boxes (red) and the final boxes (green) on the final screenshot, and report.json.
 *
 * Boxes are layout boxes (offsets, without transforms): a page transition or a tile sliding is
 * motion, not a shift. Only tiles the board has placed count (an unplaced tile is never painted).
 *
 * Run: AUDIT_EMAIL=… AUDIT_PASSWORD=… vpx audit/settle.ts [outDir]   (see ./browser.ts)
 * AUDIT_PASSES=2 visits every screen twice and reports the second visit (what a returning person
 * sees, with the skeletons' remembered heights).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import type { Page } from "puppeteer-core";
import { PNG } from "pngjs";
import { env, go, open, screens, settled, slug } from "./browser.ts";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  t: number;
}
interface Row {
  what: "moved" | "vanished" | "late";
  label: string;
  dx?: number;
  dy?: number;
  dw?: number;
  dh?: number;
  at?: number;
}

const outDir = process.argv[2] ?? "audit-out/settle";
const passes = Number(process.env.AUDIT_PASSES ?? 1);
mkdirSync(outDir, { recursive: true });

/** In the page: records each tile's first and last placed layout box from the next change of page on. */
function install() {
  type Rec = { first: Map<string, Box>; last: Map<string, Box>; on: boolean; t0: number };
  const w = window as unknown as { __settle: Rec };
  w.__settle = { first: new Map(), last: new Map(), on: false, t0: 0 };
  const layoutBox = (el: HTMLElement, main: Element) => {
    let x = 0;
    let y = 0;
    for (let e: HTMLElement | null = el; e && e !== main; e = e.offsetParent as HTMLElement | null) {
      x += e.offsetLeft;
      y += e.offsetTop;
      if (!main.contains(e.offsetParent)) break;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const label = (el: Element) => {
    const t = el.querySelector("ui-tile") as (Element & { heading?: unknown }) | null;
    const h = typeof t?.heading === "string" ? t.heading : "";
    return h || (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 48) || "(empty)";
  };
  const sample = () => {
    const rec = w.__settle;
    if (!rec.on) return;
    const main = document.querySelector("ui-frame-main main");
    if (main) {
      const boards = [...main.querySelectorAll("ui-board")].filter((b) => !b.closest("[data-settle-old]"));
      const t = Math.round(performance.now() - rec.t0);
      const add = (key: string, el: HTMLElement, name: string) => {
        const r = layoutBox(el, main);
        if (!r.w || !r.h) return;
        const box = { ...r, label: name, t };
        if (!rec.first.has(key)) rec.first.set(key, box);
        rec.last.set(key, box);
      };
      for (const el of main.querySelectorAll<HTMLElement>("[data-board-tile]"))
        // Only what the board has placed (an unplaced tile is never painted), and only the new page's
        // (the page being left is still there for a frame).
        if (el.style.getPropertyValue("--lane") && !el.closest("[data-settle-old]"))
          add(
            `${boards.indexOf(el.closest("ui-board")!)}:${el.dataset.key}`,
            el,
            el.dataset.key === "header" ? "page header" : label(el),
          );
      // A page without a board (an edit page) still has its header outside one.
      const header = main.querySelector<HTMLElement>("ui-page-header header");
      if (header && !header.closest("[data-board-tile]") && !header.closest("[data-settle-old]"))
        add("header", header, "page header");
    }
    requestAnimationFrame(sample);
  };
  (w as unknown as { __settleStart: () => void }).__settleStart = () => {
    // The page on screen now is the one being left.
    for (const el of document.querySelectorAll(
      "ui-frame-main [data-board-tile], ui-frame-main ui-page-header, ui-frame-main ui-board",
    ))
      el.setAttribute("data-settle-old", "");
    w.__settle = { first: new Map(), last: new Map(), on: true, t0: performance.now() };
    requestAnimationFrame(sample);
  };
}

async function visit(page: Page, path: string) {
  await go(page, "/account");
  await settled(page, 300, 5000);
  await page.evaluate(() => (window as unknown as { __settleStart: () => void }).__settleStart());
  await go(page, path);
  await settled(page);
  await new Promise((r) => setTimeout(r, 300));
  return page.evaluate(() => {
    const rec = (window as unknown as { __settle: { first: Map<string, Box>; last: Map<string, Box>; on: boolean } })
      .__settle;
    rec.on = false;
    const main = document.querySelector("ui-frame-main main")!;
    const boards = [...main.querySelectorAll("ui-board")];
    const present = [...main.querySelectorAll<HTMLElement>("[data-board-tile]")].map(
      (el) => `${boards.indexOf(el.closest("ui-board")!)}:${el.dataset.key}`,
    );
    const header = main.querySelector("ui-page-header header");
    if (header && !header.closest("[data-board-tile]")) present.push("header");
    const r = main.getBoundingClientRect();
    return {
      first: [...rec.first],
      last: [...rec.last],
      present,
      origin: [r.left + main.clientLeft, r.top + main.clientTop - main.scrollTop] as [number, number],
    };
  });
}

function compare(first: Map<string, Box>, last: Map<string, Box>, present: Set<string>, [W, H]: [number, number]) {
  const rows: Row[] = [];
  let score = 0;
  for (const [k, a] of first) {
    const b = present.has(k) ? last.get(k) : undefined;
    if (!b) {
      rows.push({ what: "vanished", label: `${a.label} (${a.w}×${a.h})` });
      score += (a.w * Math.min(a.h, H)) / (W * H);
      continue;
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dw = b.w - a.w;
    const dh = b.h - a.h;
    if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dw), Math.abs(dh)) <= 4) continue;
    rows.push({ what: "moved", label: b.label, dx, dy, dw, dh });
    const area = (Math.max(a.w, b.w) * Math.min(H, Math.max(a.h, b.h))) / (W * H);
    score += area * Math.min(1, (Math.abs(dx) + Math.abs(dy) + Math.abs(dw) + Math.abs(dh)) / H);
  }
  for (const k of present)
    if (!first.has(k) && last.has(k)) rows.push({ what: "late", label: last.get(k)!.label, at: last.get(k)!.t });
  return { rows, score: +score.toFixed(3) };
}

/** The final screenshot with the first boxes (red) and the final ones (green). */
function overlay(png: PNG, boxes: [Box, number[]][], [ox, oy]: [number, number]) {
  const { width: W, height: H } = png;
  const dot = (x: number, y: number, c: number[]) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    [png.data[i], png.data[i + 1], png.data[i + 2]] = c as [number, number, number];
  };
  for (const [b, c] of boxes) {
    const x0 = Math.round(b.x + ox);
    const y0 = Math.round(b.y + oy);
    for (let t = 0; t < 2; t++) {
      for (let x = x0; x < x0 + b.w; x++) {
        dot(x, y0 + t, c);
        dot(x, y0 + b.h - 1 - t, c);
      }
      for (let y = y0; y < y0 + b.h; y++) {
        dot(x0 + t, y, c);
        dot(x0 + b.w - 1 - t, y, c);
      }
    }
  }
  return png;
}

const { browser, page } = await open();
await page.evaluate(install);
const list = await screens(page);
const report: { screen: string; score: number; rows: Row[] }[] = [];
for (let pass = 1; pass <= passes; pass++)
  for (const path of list) {
    const got = await visit(page, path);
    if (pass < passes) continue;
    const first = new Map(got.first);
    const last = new Map(got.last);
    const present = new Set(got.present);
    const { rows, score } = compare(first, last, present, env.size);
    report.push({ screen: path, score, rows, tracked: first.size } as never);
    const png = PNG.sync.read(Buffer.from(await page.screenshot({ type: "png" })));
    const boxes: [Box, number[]][] = [
      ...[...first.values()].map((b): [Box, number[]] => [b, [255, 60, 60]]),
      ...[...present].flatMap((k): [Box, number[]][] => (last.has(k) ? [[last.get(k)!, [60, 230, 90]]] : [])),
    ];
    writeFileSync(`${outDir}/${slug(path)}.png`, PNG.sync.write(overlay(png, boxes, got.origin)));
  }
await browser.close();

report.sort((a, b) => b.score - a.score);
writeFileSync(`${outDir}/report.json`, JSON.stringify(report, null, 1));
for (const r of report) {
  console.log(`\n${String(r.score).padStart(6)}  ${r.screen}`);
  for (const x of r.rows.slice(0, 12))
    console.log(
      x.what === "moved"
        ? `        moved     dy ${x.dy} dh ${x.dh} dx ${x.dx} dw ${x.dw}  ${x.label}`
        : x.what === "vanished"
          ? `        vanished  ${x.label}`
          : `        late      @${x.at}ms  ${x.label}`,
    );
}
console.log(
  `\nTotal ${report.reduce((a, r) => a + r.score, 0).toFixed(3)} over ${report.length} screens. Overlays: ${outDir}`,
);
