import { createHash } from "node:crypto";
import path from "node:path";
import type { ViteDevServer } from "vite-plus";
import {
  CHECKPOINTS_MANIFEST,
  CHECKPOINTS_PATH,
  EMBEDDED_SVG_FILE,
  HOT_EVENT,
  SCHEMES,
  SVG_FILE,
  TIERS,
  type PlacedFrame,
} from "../src/explode/pages.ts";
import {
  appsOf,
  bootApp,
  ContextPool,
  drain,
  frameUrl,
  launchPool,
  readManifest,
  settle,
  shoot,
  ShotStore,
  writeOutputs,
  type App,
} from "./checkpoints.ts";

interface Warm {
  app: App;
  frames: PlacedFrame[];
}

export interface ExplodeWatch {
  dir: string;
  ready: () => boolean;
  changed: () => void;
  close: () => Promise<void>;
}

const seconds = (ms: number) => (ms / 1000).toFixed(2);

const NAVIGATED = /context was destroyed|navigat|interrupted/i;

export function explodeWatch(
  server: ViteDevServer,
  options: { frames: () => PlacedFrame[]; dir: string; log: (message: string) => void },
): ExplodeWatch {
  const { dir, log } = options;
  const base = server.config.base;
  const shotsDir = path.join(dir, CHECKPOINTS_PATH);
  const store = new ShotStore(shotsDir);
  let warms: Warm[] = [];
  let pool: ContextPool | null = null;
  let url = (route: string, as?: string) => `${route}${as ?? ""}`;
  let closed = false;
  let published = false;
  let epoch = 0;
  let dirty = false;
  let running: Promise<void> | null = null;
  let changedAt = 0;

  async function publish(frames: PlacedFrame[], since: number, phases: string) {
    await store.prune(frames);
    const hash = createHash("sha256");
    for (const [id, shots] of [...store.shots].sort(([a], [b]) => a.localeCompare(b)))
      for (const s of SCHEMES) for (const t of TIERS) hash.update(id).update(shots[s][t]?.hash ?? "");
    const manifest = store.manifest(frames, hash.digest("hex").slice(0, 12));
    const sizes = await writeOutputs(dir, manifest, shotsDir, {
      svg: SVG_FILE,
      embedded: EMBEDDED_SVG_FILE,
      manifest: CHECKPOINTS_MANIFEST,
    });
    store.commit(manifest);
    server.ws.send({ type: "custom", event: HOT_EVENT, data: { source: manifest.source } });
    published = true;
    log(
      `mock-runner: explode watch: ${frames.length} frames, ${store.written} images written, ${store.kept} unchanged ` +
        `(${store.skipped} of ${frames.length * SCHEMES.length} shots skipped by render key), ` +
        `${SVG_FILE} ${(sizes.svg / 1024).toFixed(1)} KiB, ${phases}${seconds(performance.now() - since)} s since the change`,
    );
  }

  async function capture(warm: Warm, generation: number, reload: boolean, marks: { loaded: number; settled: number }) {
    const { page } = warm.app;
    for (let attempt = 0; generation === epoch; attempt++) {
      try {
        if (reload) {
          await page.goto(url(warm.frames[0]!.route, warm.app.as), { waitUntil: "load" });
          marks.loaded = Math.max(marks.loaded, performance.now());
        }
        await settle(page);
        marks.settled = Math.max(marks.settled, performance.now());
        for (const frame of warm.frames) {
          if (generation !== epoch) return;
          await shoot(warm.app, frame, store);
        }
        return;
      } catch (e) {
        if (!NAVIGATED.test((e as Error).message) || attempt >= 3) throw e;
      }
    }
  }

  async function refresh() {
    const since = changedAt || performance.now();
    changedAt = 0;
    const generation = epoch;
    store.restart();
    const marks = { loaded: since, settled: since };
    await Promise.all(warms.map((warm) => capture(warm, generation, true, marks)));
    if (generation !== epoch) return;
    await publish(
      options.frames(),
      since,
      `reloaded ${seconds(marks.loaded - since)} s, settled ${seconds(marks.settled - since)} s, `,
    );
  }

  function request() {
    dirty = true;
    running ??= (async () => {
      while (dirty && !closed) {
        dirty = false;
        await refresh().catch((e: unknown) => log(`mock-runner: explode watch failed: ${(e as Error).message}`));
      }
      running = null;
    })();
  }

  async function start() {
    const begun = performance.now();
    const address = server.httpServer?.address();
    const port = typeof address === "object" && address ? address.port : server.config.server.port;
    url = frameUrl(`http://localhost:${port}`, base);
    const frames = options.frames();
    await store.open(await readManifest(path.join(dir, CHECKPOINTS_MANIFEST)));
    const keys = appsOf(frames);
    pool = new ContextPool(await launchPool(keys.length), Date.now());
    const booted: Warm[] = [];
    await drain(
      keys.map((key, i) => ({ key, i })),
      keys.length,
      async ({ key, i }) => {
        const app = await bootApp(await pool!.get(i, key.as), key, url, key.frames[0]!.route);
        booted[i] = { app, frames: key.frames };
      },
    );
    warms = booted;
    log(
      `mock-runner: explode watch: ${keys.length} warm pages for ${frames.length} frames booted in ${seconds(performance.now() - begun)} s`,
    );
    const marks = { loaded: begun, settled: begun };
    await Promise.all(warms.map((warm) => capture(warm, epoch, false, marks)));
    await publish(frames, begun, "");
  }

  server.httpServer?.once("listening", () => {
    running = start().catch((e: unknown) => log(`mock-runner: explode watch could not start: ${(e as Error).message}`));
    void running.then(() => {
      running = null;
      if (dirty) request();
    });
  });

  return {
    dir,
    ready: () => published,
    changed: () => {
      if (closed) return;
      epoch++;
      changedAt ||= performance.now();
      if (published) request();
      else dirty = true;
    },
    close: async () => {
      closed = true;
      await pool?.close();
    },
  };
}
