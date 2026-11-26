import preview from "#.storybook/preview";
import { html } from "lit";
import { hostFit, HOST_SHARDS } from "../../../.storybook/fit/host.ts";
import { shardGuard } from "../../../.storybook/fit/shards.ts";
import "./host.ts";

const meta = preview.meta({
  component: "app-widgets",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(hostFit(0));

export const Shards = meta.story(shardGuard(import.meta.glob("./host.fit.*.stories.ts"), "host.fit", HOST_SHARDS));
