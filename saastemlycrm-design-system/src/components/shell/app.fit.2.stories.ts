import preview from "#.storybook/preview";
import { html } from "lit";
import { appFit } from "../../../.storybook/fit/app.ts";
import "./app.ts";

const meta = preview.meta({
  component: "dashboard-app",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(appFit(1));
