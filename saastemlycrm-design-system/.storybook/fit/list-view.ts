import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { vi } from "vite-plus/test";
import { mount, testDashboard } from "../dashboard.ts";
import { inShard } from "./shards.ts";
import { DIRECTIONS, onEveryScreen, viewport } from "./views.ts";
import { config, fullAccess, LAYOUTS, seed, user } from "../fixtures/list-view.ts";
import { frames, problems, SCREENS } from "../../src/lib/dashboard/tiling.ts";
import type { DashboardListView } from "../../src/components/views/list-view.ts";
import "../../src/components/views/list-view.ts";

const DRAWN: Record<(typeof LAYOUTS)[number], string> = {
  table: "ui-table",
  cards: "ui-record-cards",
  list: "ui-record-list",
  compact: "ui-record-chips",
  focus: "ui-record-hero",
  groups: "ui-record-list",
  board: "ui-kanban",
  calendar: "ui-month",
  timeline: "ui-timeline",
  heatmap: "ui-heatmap",
  chart: "ui-chart",
  ranking: "ui-record-list",
  treemap: "ui-treemap",
  scatter: "ui-quadrant",
};

type State = "records" | "selected" | "empty";
const CASES: { layout: (typeof LAYOUTS)[number]; state: State }[] = [
  ...LAYOUTS.map((layout) => ({ layout, state: "records" as const })),
  { layout: "table", state: "selected" },
  ...LAYOUTS.map((layout) => ({ layout, state: "empty" as const })),
];

const idle = (view: DashboardListView) =>
  waitFor(() => expect((view as unknown as { loading: boolean }).loading).toBe(false));

async function render(screen: (typeof SCREENS)[number], dir: (typeof DIRECTIONS)[number], tile: boolean) {
  await viewport(screen.width, screen.height);
  document.documentElement.dir = dir;
  const found: string[] = [];
  for (const { layout, state } of CASES) {
    const dashboard = testDashboard({ config, data: state === "empty" ? { docs: {} } : seed() });
    const { host, remove } = await mount(
      html`<dashboard-list-view
        .slug=${"tasks"}
        .stateKey=${"fit"}
        ?tile=${tile}
        .spec=${{ collection: "tasks", layout, home: !tile }}
        .access=${fullAccess}
        .user=${user}
      ></dashboard-list-view>`,
      dashboard,
    );
    try {
      const view = host.querySelector("dashboard-list-view")!;
      await idle(view);
      if (state === "selected") {
        view
          .querySelector("ui-table")!
          .dispatchEvent(new CustomEvent("ui-select", { detail: { selected: [...Array(10).keys()] }, bubbles: true }));
      }
      await view.updateComplete;
      await frames(3);
      const where = `${screen.width}×${screen.height} ${dir} ${tile ? "tile" : "page"} ${layout} ${state}`;
      if (state === "records") await expect(view.querySelector(DRAWN[layout]), where).not.toBeNull();
      if (state === "selected") await expect(view.textContent, where).toContain("10 selected");
      if (state === "empty")
        await expect(view.textContent, where).toContain(layout === "calendar" ? "0 by due" : "No tasks yet");
      found.push(...problems(document.body).map((p) => `${where}: ${p}`));
    } finally {
      remove();
    }
  }
  return found;
}

export const LIST_SHARDS = 8;

const GROUPS = SCREENS.flatMap((screen) =>
  DIRECTIONS.flatMap((dir) => [false, true].map((tile) => ({ screen, dir, tile }))),
);

export const listFit = (shard: number) => {
  vi.setConfig({ testTimeout: 600_000 });
  return {
    name: `Fits every screen, shard ${shard + 1} of ${LIST_SHARDS}`,
    play: async () => {
      const found = await onEveryScreen(async () => {
        const all: string[] = [];
        try {
          for (const { screen, dir, tile } of GROUPS.filter(inShard(LIST_SHARDS, shard)))
            all.push(...(await render(screen, dir, tile)));
        } finally {
          document.documentElement.dir = "ltr";
        }
        return all;
      });
      await expect(GROUPS).toHaveLength(SCREENS.length * DIRECTIONS.length * 2);
      await expect(found).toEqual([]);
    },
  };
};
