import { html } from "lit";
import { mount, testDashboard, withDashboard, type TestDashboard } from "../dashboard.ts";
import { getLocale, overwriteGetLocale } from "../../src/lib/i18n/paraglide/runtime.js";
import { frameSizesAt, mainTiles, refit } from "../../src/lib/base/frame-fit.ts";
import { LAYOUT_STEP, type TileBounds, type TileSize } from "../../src/lib/base/board.ts";
import { tileH, tileW } from "../../src/lib/base/tiles.ts";
import type { Access, Dashboard } from "../../src/lib/dashboard/context.ts";
import type { Doc, MockConfig } from "../../src/lib/contracts/config.ts";
import type { MemoryData } from "../../src/lib/dashboard/memory.ts";
import * as k from "../../src/lib/widgets/kinds.ts";
import { frames, problems, SCREENS, tileCases } from "../../src/lib/dashboard/tiling.ts";
import { expand } from "../../src/lib/widgets/data.ts";
import { designProblems } from "../../src/lib/widgets/design-check.ts";
import { config, pageOf, seed, user, type Declaration } from "../fixtures/widgets.ts";
import type { AppWidgets, TileArrange } from "../../src/components/widgets/host.ts";
import { loadSource } from "../../src/lib/widgets/load.ts";
import type { ViewBlock } from "../../src/lib/widgets/schema.ts";
import {
  collectionPage,
  eachTiles,
  fill,
  widgets,
  type Widget,
  type WidgetPage,
  type WidgetScope,
} from "../../src/lib/widgets/widget.ts";
import "../../src/components/widgets/host.ts";

export const DIRECTIONS = ["ltr", "rtl"] as const;
export type Direction = (typeof DIRECTIONS)[number];

const widest = [...SCREENS].sort((a, b) => b.width - a.width)[0]!;
const sizes = frameSizesAt(widest.width);
const closed = { compact: false, navOpen: false, navSheet: false, asideOpen: false, asideSheet: false };
export const LANES = mainTiles(refit(closed, sizes), sizes);

export const boardFor = (span: number) => (span < LAYOUT_STEP ? span : LAYOUT_STEP * Math.ceil(span / LAYOUT_STEP));

export const sizeAt = (span: number): TileSize => (span <= 6 ? "s" : span <= 12 ? "m" : span <= 18 ? "l" : "full");

const MOTION_MS = 5000;
const moving = (a: Animation) => {
  const t = a.effect?.getTiming();
  return a.playState === "running" && t?.iterations !== Infinity && Number(t?.duration) <= MOTION_MS;
};

const pending = (root: Element) =>
  !!root.querySelector("ui-tile[loading]") ||
  [...root.querySelectorAll("app-widgets, app-arrange, app-widget, ui-board, ui-tile")].some(
    (e) => (e as AppWidgets).isUpdatePending,
  );

const finishMotion = () => {
  const running = document.getAnimations().filter(moving);
  for (const a of running) a.finish();
  return running.length;
};

export async function settle(root: Element) {
  for (let turn = 0, still = 0; still < 3; turn++) {
    const moved = finishMotion();
    await frames(1);
    still = moved || pending(root) ? 0 : still + 1;
  }
}

async function drawn(w: Widget, dashboard: Dashboard): Promise<ViewBlock[]> {
  const scope: WidgetScope = { user: user as WidgetScope["user"], params: {}, today: dashboard.project.today };
  const e = expand(w, scope, dashboard.project);
  const data = e.source ? await loadSource(fill(e.source, scope), scope, dashboard.data) : null;
  const out = e.each ? eachTiles(e, data, scope)[0]!.widget.render(data, scope) : e.render!(data, scope);
  return [out!].flat();
}

const page_ = (w: Widget) => ({ widgets: [w] });

export async function boundsOf(d: Declaration, dashboard: Dashboard): Promise<TileBounds> {
  const { host, remove } = await mount(
    html`<app-widgets board="probe" .page=${page_(d.widget)} .user=${user}></app-widgets>`,
    dashboard,
    LANES * tileW(),
  );
  try {
    await settle(host);
    return host.querySelector<HTMLElement & { arrange: TileArrange }>("app-arrange")!.arrange.bounds!;
  } finally {
    remove();
  }
}

export interface FitReport {
  bounds: TileBounds;
  spans: number[];
  sizes: string[];
  wanted: string[];
  cases: number;
  failures: [string, string[]][];
}

const setDir = (dir: Direction) => {
  const root = document.documentElement;
  root.dir = dir;
  root.lang = dir === "rtl" ? "ar" : "en";
  overwriteGetLocale(() => (dir === "rtl" ? "ar" : "en"));
};

const MOTION = ["effects", "spatial"].flatMap((m) =>
  ["", "-fast", "-slow"].flatMap((v) => [`--duration-${m}${v}`, `--settle-${m}${v}`]),
);

export const still = (on: boolean) => {
  for (const name of MOTION)
    if (on) document.documentElement.style.setProperty(name, "0ms");
    else document.documentElement.style.removeProperty(name);
};

export async function fitAll(d: Declaration): Promise<FitReport> {
  const original = getLocale;
  still(true);
  const { page } = await import("vite-plus/test/browser");
  await page.viewport(widest.width, widest.height);
  const dashboard = testDashboard({ config, data: seed() });
  const bounds = await boundsOf(d, dashboard);
  const blocks = await drawn(d.widget, dashboard);
  const cases = tileCases(bounds, LANES);
  await page.viewport(widest.width, Math.max(widest.height, Math.ceil((bounds.maxRows + 2) * tileH())));
  const spans = [...new Set(cases.map((c) => c.span))];
  const failures: [string, string[]][] = [];
  const sizes: string[] = [];
  const wanted: string[] = [];
  const prefs = dashboard.stores.preferences;
  const lay = (rows: number) =>
    prefs.set({
      boards: Object.fromEntries(spans.map((s) => [`fit-${s}`, { widths: { "0": s }, rows: { "0": rows } }])),
    });
  let count = 0;
  try {
    for (const dir of DIRECTIONS) {
      setDir(dir);
      lay(bounds.minRows);
      const { host, remove } = await mount(
        html`${spans.map(
          (s) =>
            html`<div
              data-span=${s}
              style=${`position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:${boardFor(s) * tileW()}px`}
            >
              <app-widgets board=${`fit-${s}`} .page=${page_(d.widget)} .user=${user}></app-widgets>
            </div>`,
        )}`,
        dashboard,
      );
      try {
        for (let rows = bounds.minRows; rows <= bounds.maxRows; rows++) {
          lay(rows);
          await settle(host);
          for (const span of spans) {
            count++;
            const where = `${d.name} at ${span}×${rows} ${dir}`;
            const cell = host.querySelector<HTMLElement>(`[data-span="${span}"] [data-board-tile][data-key="0"]`)!;
            const r = cell.getBoundingClientRect();
            sizes.push(`${where}: ${Math.round(r.width)}×${Math.round(r.height)}px`);
            wanted.push(`${where}: ${Math.round(span * tileW())}×${Math.round(rows * tileH())}px`);
            const tile = { title: d.widget.title, size: sizeAt(span), emphasis: d.widget.emphasis, blocks };
            failures.push([where, [...problems(cell), ...designProblems(blocks, where, [tile])]]);
          }
        }
      } finally {
        remove();
      }
    }
  } finally {
    setDir("ltr");
    overwriteGetLocale(original);
    still(false);
  }
  return { bounds, spans, cases: count, failures, sizes, wanted };
}

export type El = HTMLElement & Record<string, unknown>;

export const note = (text: string): Widget => k.text({ title: text, size: "s", format: () => ({ text }) });

export const hostConfig = {
  ...config,
  collections: config.collections.map((c) =>
    c.slug === "customers"
      ? {
          ...c,
          admin: {
            ...c.admin,
            components: {
              beforeList: [widgets(pageOf(note("Before the list")))],
              afterList: [widgets(pageOf(note("After the list"))), "plain"],
            },
          },
          custom: { edit: { before: [note("Before the form")] } },
        }
      : c,
  ),
  admin: {
    ...config.admin,
    components: {
      views: { ...config.admin!.components!.views, people: collectionPage("customers", { path: "/people" }) },
    },
  },
  globals: config.globals!.map((g) => ({ ...g, custom: { edit: { before: [note("Before the settings")] } } })),
} as unknown as MockConfig;

export const withView = (views: Record<string, unknown>) =>
  ({ ...hostConfig, admin: { ...hostConfig.admin, components: { views } } }) as MockConfig;

export interface BoardAttrs {
  board?: string;
  docId?: string;
  slug?: string;
  params?: Record<string, string>;
  access?: Access;
  user?: Doc | null;
}

export const widgetsOf = (page: WidgetPage, attrs: BoardAttrs = {}) =>
  html`<app-widgets
    .page=${page}
    .user=${attrs.user === null ? undefined : (attrs.user ?? user)}
    .board=${attrs.board ?? "test"}
    .docId=${attrs.docId ?? ""}
    .slug=${attrs.slug ?? ""}
    .params=${attrs.params ?? {}}
    .access=${attrs.access}
  ></app-widgets>`;

export const wide = (content: unknown, width = 24 * tileW()) =>
  html`<div style=${`flex:none;inline-size:${width}px`}>${content}</div>`;

export const boardOf = (page: WidgetPage, attrs: BoardAttrs = {}, width = 24 * tileW()) =>
  wide(widgetsOf(page, attrs), width);

export const keysOf = (root: Element) =>
  (root.querySelector<El>("app-widgets > ui-board")!.items as { key: string }[]).map((i) => i.key);
export const tileOf = (root: Element, key: string) => root.querySelector<El>(`[data-board-tile][data-key="${key}"]`)!;
export const arrangeOf = (root: Element, key: string) =>
  tileOf(root, key).querySelector<HTMLElement & { arrange: TileArrange }>("app-arrange")!;
export const handleOf = (root: Element, key: string) =>
  tileOf(root, key).querySelector<HTMLElement>("ui-tile-arrange")!;
export const buttonOf = (root: Element, text: string) =>
  [...root.querySelectorAll<HTMLElement>("ui-button")].find((b) => b.textContent!.trim() === text);
export const itemsOf = (el: Element) => el.querySelector<El>("ui-board")!.items as { key: string; rows: number }[];

class HostBench {
  dashboard = undefined as unknown as TestDashboard;
  make = (data: MemoryData = {}, c: MockConfig = hostConfig): TestDashboard =>
    (this.dashboard = testDashboard({
      config: c,
      data: { ...seed(), ...data, endpoints: { ...seed().endpoints, ...data.endpoints } },
    }));
  boards = () => this.dashboard.stores.preferences.get().boards;
  calls = () => (this.dashboard.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;
  decorator = withDashboard(() => this.dashboard);
  setup = () => {
    still(true);
    this.make();
    return () => {
      still(false);
      document.body.querySelectorAll(":scope > div:has(> dashboard-provider)").forEach((d) => d.remove());
    };
  };
  ready = async (root: HTMLElement) => {
    await settle(root);
    return { host: root, el: root.querySelector<AppWidgets>("app-widgets")! };
  };
  show = async (page: WidgetPage, attrs: BoardAttrs = {}, width = 24 * tileW()) => {
    const { host, remove } = await mount(widgetsOf(page, attrs), this.dashboard, width);
    await settle(host);
    return { host, el: host.querySelector<AppWidgets>("app-widgets")!, remove };
  };
}

export const hostBench = () => new HostBench();
