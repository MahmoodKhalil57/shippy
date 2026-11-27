import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "./app.ts";
import { appShell, ready, withShell } from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App",
  component: "dashboard-app",
  decorators: [withShell],
  parameters: { layout: "fullscreen" },
  args: { at: "/" },
  argTypes: {
    at: {
      control: "select",
      options: [
        "/",
        "/collections/invoices",
        "/collections/invoices/i1",
        "/globals/settings",
        "/reports",
        "/account",
        "/nowhere",
      ],
      description: "The address the dashboard opens at.",
    },
  },
  render: () => html`<dashboard-app></dashboard-app>`,
});

export const Playground = meta.story({
  play: async ({ canvasElement, canvas }) => {
    await ready(canvasElement);
    await expect(await canvas.findByRole("link", { name: "Dashboard" })).toBeVisible();
    await waitFor(() => expect(document.title).toBe("Dashboard · Workspace"));
  },
});

export const Compact = meta.story({
  name: "Compact screen",
  args: { at: "/collections/invoices" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(document.documentElement.clientWidth).toBeLessThan(500);
    await expect(appShell(canvasElement).navOpen).toBe(false);
  },
});

export const Dark = meta.story({
  name: "Dark theme with a background",
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(canvasElement.querySelector('ui-appearance[kind="background"]')).toBeTruthy();
  },
});
