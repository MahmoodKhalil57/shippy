import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { vi } from "vite-plus/test";
import { page } from "vite-plus/test/browser";
import { mount } from "../dashboard.ts";
import { inShard } from "./shards.ts";
import { getLocale, overwriteGetLocale } from "../../src/lib/i18n/paraglide/runtime.js";
import { frames, problems, SCREENS, settleAnimations } from "../../src/lib/dashboard/tiling.ts";
import "../../src/components/shell/app.ts";
import { shell } from "../fixtures/shell.ts";

const DIRECTIONS = ["ltr", "rtl"] as const;
const PANELS = [false, true].flatMap((nav) => [false, true].map((aside) => ({ nav, aside })));

interface FitCase {
  name: string;
  at: string;
  signedIn: boolean;
  nav?: boolean;
  aside?: boolean;
}

const CASES = SCREENS.flatMap((screen) =>
  DIRECTIONS.map((dir) => {
    const where = `${screen.width}×${screen.height} ${dir}`;
    const cases: FitCase[] = [
      { name: `login at ${where}`, at: "/login", signedIn: false },
      ...PANELS.map(({ nav, aside }) => ({
        name: `reports at ${where}, navigation ${nav ? "open" : "closed"}, side panel ${aside ? "open" : "closed"}`,
        at: "/reports",
        signedIn: true,
        nav,
        aside,
      })),
    ];
    return { screen, dir, cases };
  }),
);

async function quiet(host: HTMLElement) {
  await waitFor(
    () => expect(host.querySelector("[aria-busy=true], ui-skeleton, ui-loading[variant=morph]")).toBeNull(),
    { timeout: 5000 },
  );
  await frames(3);
  settleAnimations();
  await frames(3);
}

async function fit({ at, signedIn, nav, aside }: FitCase): Promise<string[]> {
  const s = shell({ at, user: signedIn ? undefined : null });
  const { host, remove } = await mount(html`<dashboard-app .address=${s.address}></dashboard-app>`, s.dashboard);
  try {
    await waitFor(() => expect(host.querySelector(signedIn ? "ui-app-shell" : "dashboard-login")).not.toBeNull(), {
      timeout: 5000,
    });
    const found: string[] = [];
    const frame = host.querySelector("ui-app-shell");
    if (frame) {
      await frame.updateComplete;
      await frame.toggleNav(nav);
      await frame.toggleAside(aside);
      if (frame.navOpen !== nav || frame.asideOpen !== aside)
        found.push(`panels: navigation ${frame.navOpen}, side panel ${frame.asideOpen}`);
    }
    await quiet(host);
    return [...found, ...problems(host)];
  } finally {
    remove();
  }
}

export const APP_SHARDS = 6;

export const appFit = (shard: number) => {
  vi.setConfig({ testTimeout: 600_000 });
  return {
    name: `Fits every screen, shard ${shard + 1} of ${APP_SHARDS}`,
    play: async () => {
      const root = document.documentElement;
      const original = getLocale;
      const viewport = { width: innerWidth, height: innerHeight };
      const found: string[] = [];
      try {
        for (const { screen, dir, cases } of CASES.filter(inShard(APP_SHARDS, shard))) {
          await page.viewport(screen.width, screen.height);
          root.dir = dir;
          root.lang = dir === "rtl" ? "ar" : "en";
          overwriteGetLocale(() => (dir === "rtl" ? "ar" : "en"));
          for (const c of cases) for (const problem of await fit(c)) found.push(`${c.name}: ${problem}`);
        }
      } finally {
        overwriteGetLocale(original);
        root.dir = "ltr";
        root.lang = "en";
        await page.viewport(viewport.width, viewport.height);
      }
      await expect(CASES.flatMap((c) => c.cases)).toHaveLength(SCREENS.length * DIRECTIONS.length * 5);
      await expect(found).toEqual([]);
    },
  };
};
