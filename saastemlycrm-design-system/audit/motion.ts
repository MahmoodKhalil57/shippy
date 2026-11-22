/**
 * Motion audit: frame by frame, what happens while the app changes page and opens its columns.
 * For each step it records the screen (the DevTools screencast) and every visible element's box on
 * every frame, and reports:
 *
 * - jumps: an element that moved or resized more than 4px in one frame with no animation running on
 *   it or an ancestor (it should have been motion);
 * - pop-ins: a large element that appeared fully visible with no animation on it or an ancestor;
 * - layout shifts: Chrome's own, with the nodes it blames;
 * - a heatmap of how often each pixel changed (over the last frame) and a strip of the busiest
 *   frames, per step.
 *
 * Run: AUDIT_EMAIL=… AUDIT_PASSWORD=… vpx audit/motion.ts [outDir]   (see ./browser.ts)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import type { Page } from "puppeteer-core";
import { env, go, open, screens, settled, slug } from "./browser.ts";

const outDir = process.argv[2] ?? "audit-out/motion";
mkdirSync(outDir, { recursive: true });

interface Found {
  jumps: { t: number; what: string; dx: number; dy: number; dw: number; dh: number }[];
  pops: { t: number; what: string; area: number }[];
  shifts: { t: number; value: number; sources: string[] }[];
}

/** In the page: the per-frame tracker (`__motion.start()` / `.stop()`). */
function install() {
  const describe = (el: Element) => {
    const parts: string[] = [];
    for (let e: Element | null = el; e && e !== document.body && parts.length < 2; e = e.parentElement)
      if (e.tagName.includes("-")) parts.unshift(e.tagName.toLowerCase());
    const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `${parts.join(" > ")} ${el.tagName.toLowerCase()}${text ? ` "${text}"` : ""}`;
  };
  const animated = (el: Element, targets: Set<Element>) => {
    for (let e: Element | null = el; e; e = e.parentElement) if (targets.has(e)) return true;
    return false;
  };
  const state = {
    on: false,
    t0: 0,
    rects: new WeakMap<Element, DOMRect>(),
    found: { jumps: [], pops: [], shifts: [] } as Found,
  };
  const frame = (first: boolean) => {
    const targets = new Set<Element>();
    for (const a of document.getAnimations()) {
      const target = (a.effect as KeyframeEffect | null)?.target;
      if (a.playState === "running" && target) targets.add(target);
    }
    const t = Math.round(performance.now() - state.t0);
    const moved = new Map<Element, string>();
    const born = new Set<Element>();
    for (const el of document.body.querySelectorAll("*")) {
      if (el.closest("ui-snackbar, ui-coachmark")) continue;
      const r = el.getBoundingClientRect();
      const visible =
        r.width >= 8 &&
        r.height >= 8 &&
        r.bottom > 0 &&
        r.top < innerHeight &&
        r.right > 0 &&
        r.left < innerWidth &&
        el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
      const prev = state.rects.get(el);
      if (visible) state.rects.set(el, r);
      else state.rects.delete(el);
      if (first || !visible) continue;
      if (!prev) {
        if (r.width * r.height >= 2500 && !animated(el, targets)) born.add(el);
        continue;
      }
      const d = [r.x - prev.x, r.y - prev.y, r.width - prev.width, r.height - prev.height].map(Math.round);
      if (Math.max(...d.map(Math.abs)) > 4 && !animated(el, targets)) moved.set(el, d.join());
    }
    // Only the topmost of each moving or new subtree (children go with their parent).
    for (const [el, d] of moved)
      if (!(el.parentElement && moved.get(el.parentElement) === d)) {
        const [dx, dy, dw, dh] = d.split(",").map(Number) as [number, number, number, number];
        state.found.jumps.push({ t, what: describe(el), dx, dy, dw, dh });
      }
    for (const el of born)
      if (!(el.parentElement && born.has(el.parentElement))) {
        const r = el.getBoundingClientRect();
        state.found.pops.push({ t, what: describe(el), area: Math.round(r.width * r.height) });
      }
  };
  new PerformanceObserver((list) => {
    if (!state.on) return;
    for (const e of list.getEntries() as (PerformanceEntry & { value: number; sources?: { node?: Node | null }[] })[])
      state.found.shifts.push({
        t: Math.round(e.startTime - state.t0),
        value: +e.value.toFixed(4),
        sources: (e.sources ?? []).map((s) => (s.node instanceof Element ? describe(s.node) : "?")),
      });
  }).observe({ type: "layout-shift", buffered: false });
  (window as unknown as { __motion: object }).__motion = {
    start() {
      state.on = true;
      state.t0 = performance.now();
      state.rects = new WeakMap();
      state.found = { jumps: [], pops: [], shifts: [] };
      frame(true);
      const loop = () => {
        if (!state.on) return;
        frame(false);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
    stop() {
      state.on = false;
      return state.found;
    },
  };
}

async function record(page: Page, name: string, act: () => Promise<unknown>) {
  const cdp = await page.createCDPSession();
  const frames: string[] = [];
  cdp.on("Page.screencastFrame", (f: { data: string; sessionId: number }) => {
    frames.push(f.data);
    void cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  const [maxWidth, maxHeight] = env.size;
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, everyNthFrame: 1, maxWidth, maxHeight });
  await page.evaluate(() => (window as unknown as { __motion: { start(): void } }).__motion.start());
  await act();
  await settled(page);
  await new Promise((r) => setTimeout(r, 600));
  const found = await page.evaluate(() => (window as unknown as { __motion: { stop(): Found } }).__motion.stop());
  await cdp.send("Page.stopScreencast");
  await cdp.detach();
  heatmap(name, frames);
  const cls = found.shifts.reduce((a, s) => a + s.value, 0);
  console.log(
    `\n== ${name}: ${frames.length} frames, ${found.jumps.length} jumps, ${found.pops.length} pop-ins, layout shift ${cls.toFixed(3)}`,
  );
  for (const j of found.jumps.slice(0, 10))
    console.log(`   jump  ${String(j.t).padStart(5)}ms  d(${j.dx},${j.dy}) size(${j.dw},${j.dh})  ${j.what}`);
  for (const p of [...found.pops].sort((a, b) => b.area - a.area).slice(0, 6))
    console.log(`   pop   ${String(p.t).padStart(5)}ms  ${p.area}px²  ${p.what}`);
  return { name, frames: frames.length, ...found, cls: +cls.toFixed(4) };
}

/** How often each pixel changed between frames, over the last frame; and the 6 busiest frames. */
function heatmap(name: string, frames: string[]) {
  if (frames.length < 2) return;
  const shots = frames.map((f) => jpeg.decode(Buffer.from(f, "base64"), { useTArray: true }));
  const { width: w, height: h } = shots[0]!;
  const heat = new Float32Array(w * h);
  const change: { i: number; n: number }[] = [];
  for (let i = 1; i < shots.length; i++) {
    const a = shots[i - 1]!.data;
    const b = shots[i]!.data;
    if (shots[i]!.width !== w) continue;
    let n = 0;
    for (let p = 0, q = 0; p < w * h; p++, q += 4)
      if (Math.abs(a[q]! - b[q]!) + Math.abs(a[q + 1]! - b[q + 1]!) + Math.abs(a[q + 2]! - b[q + 2]!) > 40) {
        heat[p]!++;
        n++;
      }
    change.push({ i, n });
  }
  let max = 1;
  for (const v of heat) if (v > max) max = v;
  const last = shots.at(-1)!.data;
  const png = new PNG({ width: w, height: h });
  for (let p = 0, q = 0; p < w * h; p++, q += 4) {
    const v = heat[p]! / max;
    const g = ((last[q]! + last[q + 1]! + last[q + 2]!) / 3) * 0.45;
    png.data[q] = Math.min(255, g + v * 255);
    png.data[q + 1] = Math.min(255, g + v * 60);
    png.data[q + 2] = Math.min(255, g * (1 - v));
    png.data[q + 3] = 255;
  }
  writeFileSync(`${outDir}/${name}-heat.png`, PNG.sync.write(png));
  const pick = change
    .sort((a, b) => b.n - a.n)
    .slice(0, 6)
    .sort((a, b) => a.i - b.i);
  const s = 3;
  const tw = Math.floor(w / s);
  const th = Math.floor(h / s);
  const strip = new PNG({ width: tw * Math.max(1, pick.length), height: th });
  pick.forEach(({ i }, k) => {
    const src = shots[i]!.data;
    for (let y = 0; y < th; y++)
      for (let x = 0; x < tw; x++) {
        const si = (y * s * w + x * s) * 4;
        const di = (y * tw * pick.length + k * tw + x) * 4;
        strip.data[di] = src[si]!;
        strip.data[di + 1] = src[si + 1]!;
        strip.data[di + 2] = src[si + 2]!;
        strip.data[di + 3] = 255;
      }
  });
  writeFileSync(`${outDir}/${name}-frames.png`, PNG.sync.write(strip));
}

const press = (label: RegExp) => async (page: Page) =>
  page.evaluate((src: string) => {
    const re = new RegExp(src, "i");
    const b = [...document.querySelectorAll<HTMLElement>("button, a")].find(
      (x) => re.test(x.getAttribute("aria-label") ?? "") && x.getBoundingClientRect().width,
    );
    b?.click();
  }, label.source);

const { browser, page } = await open();
await page.evaluate(install);
const results = [];
for (const path of await screens(page)) results.push(await record(page, `page-${slug(path)}`, () => go(page, path)));
await go(page, "/");
await settled(page);
for (const [name, act] of [
  ["navigation-open", press(/^expand navigation$/)],
  ["navigation-close", press(/^collapse navigation$/)],
  ["side-panel-open", press(/^(expand|open) (the )?side panel$|^notifications/)],
  ["side-panel-close", press(/^(collapse|close) (the )?side panel$/)],
] as const)
  results.push(await record(page, name, () => act(page)));
await browser.close();
writeFileSync(`${outDir}/report.json`, JSON.stringify(results, null, 1));
console.log(`\nHeatmaps and frame strips: ${outDir}`);
