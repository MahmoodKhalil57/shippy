import preview from "#.storybook/preview";
import { html } from "lit";
import { listFit, LIST_SHARDS } from "../../../.storybook/fit/list-view.ts";
import { shardGuard } from "../../../.storybook/fit/shards.ts";
import "./list-view.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(listFit(0));

export const Shards = meta.story(
  shardGuard(import.meta.glob("./list-view.fit.*.stories.ts"), "list-view.fit", LIST_SHARDS),
);
