import preview from "#.storybook/preview";
import { html } from "lit";
import { appFit, APP_SHARDS } from "../../../.storybook/fit/app.ts";
import { shardGuard } from "../../../.storybook/fit/shards.ts";
import "./app.ts";

const meta = preview.meta({
  component: "dashboard-app",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(appFit(0));

export const Shards = meta.story(shardGuard(import.meta.glob("./app.fit.*.stories.ts"), "app.fit", APP_SHARDS));
