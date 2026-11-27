import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { availableParallelism } from "node:os";
import path from "node:path";
import type { Browser, BrowserContext, CDPSession, Page } from "playwright";
import {
  CHECKPOINTS_MANIFEST,
  CHECKPOINTS_PATH,
  EMBEDDED_SVG_FILE,
  FRAME_PATH,
  SCHEMES,
  SVG_FILE,
  TIERS,
  boundsOf,
  frameSearch,
  OPAQUE,
  type CheckpointManifest,
  type CheckpointShot,
  type FrameShots,
  type ManifestFrame,
  type PlacedFrame,
  type Scheme,
  type Tier,
} from "../src/explode/pages.ts";
import { explodeSvg } from "./explode-svg.ts";

export const SCALE = 2;
const SETTLE_TIMEOUT = 45_000;
const QUALITY = 90;
const TIER_SCALE: Record<Tier, number> = { "2x": 1, "1x": 1 / SCALE };

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

export const typeOf = (file: string) => TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";

export async function serve(out: string, base: string) {
  const server = createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (!pathname.startsWith(base)) {
        res.writeHead(404).end();
        return;
      }
      let file = path.join(out, pathname.slice(base.length));
      if (path.relative(out, file).startsWith("..")) {
        res.writeHead(403).end();
        return;
      }
      const found = await stat(file).catch(() => null);
      if (found?.isDirectory()) {
        if (!pathname.endsWith("/")) {
          res.writeHead(301, { location: `${pathname}/${url.search}` }).end();
          return;
        }
        file = path.join(file, "index.html");
      } else if (!found) {
        if (path.extname(file)) {
          res.writeHead(404).end();
          return;
        }
        file = path.join(out, "index.html");
      }
      const body = await readFile(file).catch(() => null);
      if (!body) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "content-type": typeOf(file), "cache-control": "no-cache" }).end(body);
    })();
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

export async function launch(): Promise<Browser> {
  const playwright = await import("playwright").catch((e: unknown) => {
    throw new Error(
      `mock-runner: the explode checkpoints need Playwright, and it could not be loaded (${(e as Error).message}). Install it with "bun add -d playwright".`,
    );
  });
  return playwright.chromium.launch({ headless: true }).catch((e: unknown) => {
    const message = (e as Error).message;
    if (/Executable doesn't exist|browserType\.launch/i.test(message))
      throw new Error(
        `mock-runner: Playwright's Chromium is missing, so the explode checkpoints cannot be captured. Run "npx playwright install chromium" and build again.\n${message}`,
      );
    throw e;
  });
}

export const launchPool = (size: number) =>
  Promise.all(Array.from({ length: Math.max(1, Math.ceil(size / 2)) }, launch));

export async function drain<T>(items: T[], consumers: number, work: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(consumers, queue.length)) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await work(item);
    }),
  );
}

export const consumersFor = () => Math.max(1, Math.floor(availableParallelism() * 0.75));

export async function settle(page: Page) {
  await page.waitForFunction(() => window.explode?.settle(), undefined, { timeout: SETTLE_TIMEOUT, polling: "raf" });
}

export interface AppKey {
  width: number;
  height: number;
  scheme: Scheme;
  as?: string;
}

export interface App extends AppKey {
  context: BrowserContext;
  page: Page;
  cdp: CDPSession;
}

export function appsOf(frames: PlacedFrame[], shards = 1): (AppKey & { frames: PlacedFrame[] })[] {
  const groups = new Map<string, AppKey & { frames: PlacedFrame[] }>();
  for (const frame of frames)
    for (const scheme of SCHEMES) {
      const key = `${frame.width}x${frame.height}|${scheme}|${frame.as ?? ""}`;
      const group = groups.get(key) ?? { width: frame.width, height: frame.height, scheme, as: frame.as, frames: [] };
      group.frames.push(frame);
      groups.set(key, group);
    }
  return [...groups.values()].flatMap((group) => {
    const count = Math.max(1, Math.min(shards, group.frames.length));
    const size = Math.ceil(group.frames.length / count);
    return Array.from({ length: count }, (_, i) => ({
      ...group,
      frames: group.frames.slice(i * size, (i + 1) * size),
    }));
  });
}

const QUIET = `*, *::before, *::after { caret-color: transparent !important; }`;

export class ContextPool {
  readonly browsers: Browser[];
  readonly clock: number;
  #contexts = new Map<string, Promise<BrowserContext>>();

  constructor(browsers: Browser[], clock: number) {
    this.browsers = browsers;
    this.clock = clock;
  }

  get(index: number, as?: string) {
    const browser = this.browsers[index % this.browsers.length]!;
    const key = `${index % this.browsers.length}|${as ?? ""}`;
    let context = this.#contexts.get(key);
    if (!context) {
      context = openContext(browser, this.clock);
      this.#contexts.set(key, context);
    }
    return context;
  }

  async close() {
    await Promise.allSettled([...this.#contexts.values()].map(async (c) => (await c).close()));
    await Promise.allSettled(this.browsers.map((b) => b.close()));
  }
}

async function openContext(browser: Browser, clock: number) {
  const context = await browser.newContext({
    deviceScaleFactor: SCALE,
    reducedMotion: "reduce",
    serviceWorkers: "allow",
  });
  await context.clock.setFixedTime(clock);
  await context.addInitScript((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
    });
  }, QUIET);
  return context;
}

export async function bootApp(
  context: BrowserContext,
  key: AppKey,
  url: (route: string, as?: string) => string,
  route: string,
  prepare?: (page: Page) => Promise<void>,
): Promise<App> {
  const page = await context.newPage();
  await page.setViewportSize({ width: key.width, height: key.height });
  await page.emulateMedia({ colorScheme: key.scheme, reducedMotion: "reduce" });
  await prepare?.(page);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: key.width,
    height: key.height,
    deviceScaleFactor: SCALE,
    mobile: false,
  });
  await page.goto(url(route, key.as), { waitUntil: "load" });
  await settle(page).catch((e: unknown) => {
    throw new Error(
      `mock-runner: the explode frame at ${key.width}×${key.height} (${key.scheme}) never settled: ${(e as Error).message}`,
    );
  });
  return { ...key, context, page, cdp };
}

export const captureClock = (at = Date.now()) => at - (at % 86_400_000);

export const frameUrl = (origin: string, base: string) => (route: string, as?: string) =>
  `${origin}${base}${FRAME_PATH}/${frameSearch(route, as)}`;

export const fileOf = (frame: PlacedFrame, scheme: Scheme, tier: Tier) => `${frame.id}-${scheme}@${tier}.webp`;

export class ShotStore {
  readonly dir: string;
  #previous = new Map<string, string>();
  #present = new Set<string>();
  #prior = new Map<string, ManifestFrame>();
  shots = new Map<string, FrameShots>();
  renders = new Map<string, Partial<Record<Scheme, string>>>();
  #written = new Set<string>();
  #kept = new Set<string>();
  #skipped = new Set<string>();

  get written() {
    return this.#written.size;
  }

  get kept() {
    return [...this.#kept].filter((f) => !this.#written.has(f)).length;
  }

  get skipped() {
    return this.#skipped.size;
  }

  constructor(dir: string) {
    this.dir = dir;
  }

  async open(previous: CheckpointManifest | null) {
    await mkdir(this.dir, { recursive: true });
    this.#present = new Set(await readdir(this.dir).catch(() => []));
    this.#previous.clear();
    this.commit(previous);
    for (const frame of previous?.frames ?? [])
      for (const scheme of SCHEMES)
        for (const tier of TIERS) {
          const shot = frame.shots?.[scheme]?.[tier];
          if (shot) this.#previous.set(shot.file, shot.hash);
        }
    return this;
  }

  commit(manifest: CheckpointManifest | null) {
    this.#prior = new Map((manifest?.frames ?? []).map((f) => [f.id, f]));
  }

  restart() {
    this.#written.clear();
    this.#kept.clear();
    this.#skipped.clear();
  }

  #render(frame: PlacedFrame, scheme: Scheme, render: string | null) {
    const renders = { ...this.renders.get(frame.id) };
    if (render) renders[scheme] = render;
    else delete renders[scheme];
    this.renders.set(frame.id, renders);
  }

  reuse(frame: PlacedFrame, scheme: Scheme, render: string | null) {
    this.#render(frame, scheme, render);
    const prior = this.#prior.get(frame.id);
    const shots = prior?.shots?.[scheme];
    if (!render || prior?.renders?.[scheme] !== render || !shots) return false;
    if (!TIERS.every((t) => shots[t] && this.#present.has(shots[t].file))) return false;
    this.#keep(frame, scheme, shots);
    for (const t of TIERS) this.#kept.add(shots[t].file);
    this.#skipped.add(`${frame.id}-${scheme}`);
    return true;
  }

  async put(frame: PlacedFrame, scheme: Scheme, tier: Tier, data: Buffer): Promise<CheckpointShot> {
    const file = fileOf(frame, scheme, tier);
    const hash = createHash("sha256").update(data).digest("hex").slice(0, 16);
    if (this.#previous.get(file) === hash && this.#present.has(file)) this.#kept.add(file);
    else {
      await writeFile(path.join(this.dir, file), data);
      this.#previous.set(file, hash);
      this.#present.add(file);
      this.#written.add(file);
    }
    const shot = { file, hash, bytes: data.length };
    this.#keep(frame, scheme, { ...this.shots.get(frame.id)?.[scheme], [tier]: shot } as FrameShots[Scheme]);
    return shot;
  }

  #keep(frame: PlacedFrame, scheme: Scheme, shots: FrameShots[Scheme]) {
    const all = this.shots.get(frame.id) ?? ({ light: {}, dark: {} } as FrameShots);
    this.shots.set(frame.id, { ...all, [scheme]: shots });
  }

  async prune(frames: PlacedFrame[]) {
    const wanted = new Set(frames.flatMap((f) => SCHEMES.flatMap((s) => TIERS.map((t) => fileOf(f, s, t)))));
    const stale = [...this.#present].filter((f) => !wanted.has(f));
    await Promise.all(stale.map((f) => rm(path.join(this.dir, f), { force: true })));
    for (const f of stale) this.#present.delete(f);
  }

  manifest(frames: PlacedFrame[], source: string): CheckpointManifest {
    const { width, height } = boundsOf(frames);
    return {
      builtAt: new Date().toISOString(),
      source,
      deviceScaleFactor: SCALE,
      width,
      height,
      frames: frames.map((f): ManifestFrame => {
        const shots = this.shots.get(f.id);
        const whole = shots && SCHEMES.every((s) => TIERS.every((t) => shots[s][t]));
        const renders = this.renders.get(f.id);
        return whole
          ? { ...f, shots: structuredClone(shots), ...(renders ? { renders: { ...renders } } : {}) }
          : { ...f };
      }),
    };
  }
}

export async function shoot(app: App, frame: PlacedFrame, store: ShotStore) {
  const key = await app.page.waitForFunction((route) => window.explode?.shot(route), frame.route, {
    timeout: SETTLE_TIMEOUT,
    polling: "raf",
  });
  const render = (await key.jsonValue()) as string;
  await key.dispose();
  if (store.reuse(frame, app.scheme, render === OPAQUE ? null : render)) return;
  for (const tier of TIERS) {
    const scale = TIER_SCALE[tier];
    const { data } = await app.cdp.send("Page.captureScreenshot", {
      format: "webp",
      quality: QUALITY,
      optimizeForSpeed: true,
      ...(scale === 1 ? {} : { clip: { x: 0, y: 0, width: frame.width, height: frame.height, scale } }),
    });
    await store.put(frame, app.scheme, tier, Buffer.from(data, "base64"));
  }
}

export async function readManifest(file: string): Promise<CheckpointManifest | null> {
  const text = await readFile(file, "utf8").catch(() => null);
  if (!text) return null;
  const manifest = JSON.parse(text) as Partial<CheckpointManifest>;
  return Array.isArray(manifest.frames) ? (manifest as CheckpointManifest) : null;
}

export async function writeOutputs(
  root: string,
  manifest: CheckpointManifest,
  shotsDir: string,
  extra: { svg: string; embedded: string; manifest: string },
) {
  const svg = explodeSvg(manifest, (shot) => `${CHECKPOINTS_PATH}/${shot.file}?v=${shot.hash}`);
  const files = new Map<string, Buffer>();
  for (const frame of manifest.frames)
    for (const scheme of SCHEMES) {
      const shot = frame.shots?.[scheme]["2x"];
      if (shot) files.set(shot.file, await readFile(path.join(shotsDir, shot.file)));
    }
  const embedded = explodeSvg(
    manifest,
    (shot) => `data:image/webp;base64,${files.get(shot.file)?.toString("base64") ?? ""}`,
  );
  await mkdir(path.dirname(path.join(root, extra.manifest)), { recursive: true });
  await Promise.all([
    writeFile(path.join(root, extra.manifest), `${JSON.stringify(manifest)}\n`),
    writeFile(path.join(root, extra.svg), svg),
    writeFile(path.join(root, extra.embedded), embedded),
  ]);
  return { svg: Buffer.byteLength(svg), embedded: Buffer.byteLength(embedded) };
}

async function sourceOf(out: string, frames: PlacedFrame[]) {
  const hash = createHash("sha256");
  for (const page of ["explode/index.html", `${FRAME_PATH}/index.html`])
    hash.update(page).update(await readFile(path.join(out, page)));
  hash.update(JSON.stringify(frames)).update(String(SCALE)).update(String(QUALITY));
  return hash.digest("hex").slice(0, 12);
}

async function complete(dir: string, manifest: CheckpointManifest | null, version: string) {
  if (!manifest || manifest.source !== version) return false;
  if (manifest.frames.some((f) => !f.shots)) return false;
  const present = new Set(await readdir(dir).catch(() => []));
  return manifest.frames.every((f) => SCHEMES.every((s) => TIERS.every((t) => present.has(f.shots![s][t].file))));
}

const seconds = (since: number) => ((performance.now() - since) / 1000).toFixed(1);

export async function captureCheckpoints(options: {
  out: string;
  base: string;
  cache: string;
  frames: PlacedFrame[];
  worker: () => Promise<void>;
  log: (message: string) => void;
}): Promise<void> {
  const { out, base, cache, frames, worker, log } = options;
  const started = performance.now();
  const version = await sourceOf(out, frames);
  const shotsDir = path.join(cache, "checkpoints");
  const cacheManifest = path.join(cache, "checkpoints.json");
  let manifest = await readManifest(cacheManifest);
  if (await complete(shotsDir, manifest, version)) {
    log(`mock-runner: explode checkpoints are current (${version}), reused ${frames.length} frames`);
  } else {
    await worker();
    const store = await new ShotStore(shotsDir).open(manifest);
    const consumers = consumersFor();
    const keys = appsOf(frames).length;
    const apps = appsOf(frames, Math.max(1, Math.floor(consumers / keys)));
    const browsers = await launchPool(Math.min(apps.length, consumers));
    const pool = new ContextPool(browsers, captureClock());
    const server = await serve(out, base);
    try {
      let next = 0;
      const url = frameUrl(server.origin, base);
      const booted = performance.now();
      let boot = 0;
      await drain(apps, consumers, async (key) => {
        const begun = performance.now();
        const app = await bootApp(await pool.get(next++, key.as), key, url, key.frames[0]!.route);
        boot += performance.now() - begun;
        try {
          for (const frame of key.frames) await shoot(app, frame, store);
        } finally {
          await app.page.close().catch(() => undefined);
        }
      });
      await store.prune(frames);
      manifest = store.manifest(frames, version);
      await writeFile(cacheManifest, `${JSON.stringify(manifest)}\n`);
      const captures = frames.length * SCHEMES.length;
      log(
        `mock-runner: captured ${frames.length} explode frames (${captures} shots × ${TIERS.length} tiers) ` +
          `in ${apps.length} apps on ${browsers.length} browsers with ${Math.min(consumers, apps.length)} consumers in ${seconds(booted)} s ` +
          `(${(captures / ((performance.now() - booted) / 1000)).toFixed(1)} shots/s, mean boot ${(boot / apps.length / 1000).toFixed(1)} s), ` +
          `${store.written} written, ${store.kept} unchanged, ${store.skipped} shots skipped by render key`,
      );
    } finally {
      await Promise.allSettled([pool.close(), server.close()]);
    }
  }
  const target = path.join(out, CHECKPOINTS_PATH);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  const files = manifest!.frames.flatMap((f) => SCHEMES.flatMap((s) => TIERS.map((t) => f.shots![s][t].file)));
  await drain(files, 16, (file) => copyFile(path.join(shotsDir, file), path.join(target, file)));
  const sizes = await writeOutputs(out, manifest!, shotsDir, {
    svg: SVG_FILE,
    embedded: EMBEDDED_SVG_FILE,
    manifest: CHECKPOINTS_MANIFEST,
  });
  log(
    `mock-runner: explode published in ${seconds(started)} s: ${SVG_FILE} ${(sizes.svg / 1024).toFixed(1)} KiB, ` +
      `${EMBEDDED_SVG_FILE} ${(sizes.embedded / 1024 / 1024).toFixed(2)} MiB`,
  );
}
