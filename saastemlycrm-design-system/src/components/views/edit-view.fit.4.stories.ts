import preview from "#.storybook/preview";
import { html } from "lit";
import { editFit } from "../../../.storybook/fit/edit-view.ts";
import "./edit-view.ts";

const meta = preview.meta({
  component: "dashboard-edit-view",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(editFit(3));
