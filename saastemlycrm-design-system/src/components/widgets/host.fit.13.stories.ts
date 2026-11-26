import preview from "#.storybook/preview";
import { html } from "lit";
import { hostFit } from "../../../.storybook/fit/host.ts";
import "./host.ts";

const meta = preview.meta({
  component: "app-widgets",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(hostFit(12));
