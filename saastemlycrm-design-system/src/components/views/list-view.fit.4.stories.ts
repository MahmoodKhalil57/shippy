import preview from "#.storybook/preview";
import { html } from "lit";
import { listFit } from "../../../.storybook/fit/list-view.ts";
import "./list-view.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(listFit(3));
