import preview from "#.storybook/preview";
import { html } from "lit";
import { authFit, AUTH_SHARDS } from "../../../.storybook/fit/auth-views.ts";
import { shardGuard } from "../../../.storybook/fit/shards.ts";
import "./auth-views.ts";

const meta = preview.meta({
  component: "dashboard-login",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(authFit(0));

export const Shards = meta.story(
  shardGuard(import.meta.glob("./auth-views.fit.*.stories.ts"), "auth-views.fit", AUTH_SHARDS),
);
