import preview from "#.storybook/preview";
import { html } from "lit";
import { editFit, EDIT_SHARDS } from "../../../.storybook/fit/edit-view.ts";
import { shardGuard } from "../../../.storybook/fit/shards.ts";
import "./edit-view.ts";

const meta = preview.meta({
  component: "dashboard-edit-view",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(editFit(0));

export const Shards = meta.story(
  shardGuard(import.meta.glob("./edit-view.fit.*.stories.ts"), "edit-view.fit", EDIT_SHARDS),
);
