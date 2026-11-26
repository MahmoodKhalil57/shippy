import preview from "#.storybook/preview";
import { html } from "lit";
import { expect } from "storybook/test";
import { vi } from "vite-plus/test";
import { testDashboard } from "../../../.storybook/dashboard.ts";
import { fitMatrix, type FitState } from "../../../.storybook/fit/views.ts";
import { config, data, emptyConfig, fullAccess, seedUsers } from "../../../.storybook/fixtures/views.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import "./home.ts";

vi.setConfig({ testTimeout: 600_000 });

const state = (name: string, c = config): FitState => ({
  name,
  dashboard: () => testDashboard({ config: c, seedUsers, data: data() }),
  render: () => html`<dashboard-home .access=${fullAccess}></dashboard-home>`,
  ready: () => frames(2),
});

const meta = preview.meta({
  component: "dashboard-home",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const EveryScreen = meta.story({
  name: "Fits every screen",
  play: async () => {
    await expect(await fitMatrix([state("groups"), state("empty", emptyConfig)])).toEqual([]);
  },
});
