import type { TemplateResult } from "lit";
import { mount } from "../dashboard.ts";
import { inShard } from "./shards.ts";
import { getLocale, overwriteGetLocale } from "../../src/lib/i18n/paraglide/runtime.js";
import type { Dashboard } from "../../src/lib/dashboard/context.ts";
import { frames, problems, SCREENS, type Screen, settleAnimations } from "../../src/lib/dashboard/tiling.ts";

export const DIRECTIONS = ["ltr", "rtl"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export interface FitState {
  name: string;
  dashboard: () => Dashboard;
  render: () => TemplateResult;
  ready: (host: HTMLElement) => Promise<unknown>;
}

export interface FitCase {
  state: FitState;
  screen: Screen;
  dir: Direction;
  name: string;
}

export const fitCases = (states: FitState[]): FitCase[] =>
  states.flatMap((state) =>
    SCREENS.flatMap((screen) =>
      DIRECTIONS.map((dir) => ({
        state,
        screen,
        dir,
        name: `${state.name} at ${screen.width}×${screen.height} ${dir}`,
      })),
    ),
  );

export async function viewport(width: number, height: number) {
  const { page } = await import("vite-plus/test/browser").catch(() => ({ page: null }));
  if (page && "__vitest_browser__" in globalThis) await page.viewport(width, height);
}

export async function onEveryScreen<T>(each: () => Promise<T>): Promise<T> {
  const width = innerWidth;
  const height = innerHeight;
  try {
    return await each();
  } finally {
    await viewport(width, height);
  }
}

export async function fitProblems({ state, screen, dir }: FitCase): Promise<string[]> {
  const root = document.documentElement;
  const original = getLocale;
  await viewport(screen.width, screen.height);
  root.dir = dir;
  root.lang = dir === "rtl" ? "ar" : "en";
  overwriteGetLocale(() => (dir === "rtl" ? "ar" : "en"));
  const { host, remove } = await mount(state.render(), state.dashboard(), screen.width);
  try {
    await state.ready(host);
    await frames(3);
    settleAnimations();
    await frames(2);
    return problems(host);
  } finally {
    remove();
    overwriteGetLocale(original);
    root.dir = "ltr";
    root.lang = "en";
  }
}

export const fitMatrix = (states: FitState[], count = 1, index = 0) =>
  onEveryScreen(async () => {
    const found: string[] = [];
    for (const c of fitCases(states).filter(inShard(count, index)))
      found.push(...(await fitProblems(c)).map((p) => `${c.name}: ${p}`));
    return found;
  });
