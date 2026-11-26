import preview from "#.storybook/preview";
import { html } from "lit";
import { authFit } from "../../../.storybook/fit/auth-views.ts";
import "./auth-views.ts";

const meta = preview.meta({
  component: "dashboard-login",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => html``,
});

export const Fit = meta.story(authFit(1));
