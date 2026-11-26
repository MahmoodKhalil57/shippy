import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import type { MockConfig } from "../../lib/contracts/config.ts";
import { widgets } from "../../lib/widgets/widget.ts";
import "./app.ts";
import { config, current, ready, withShell } from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App/Screens",
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
  render: () => html`<dashboard-app .address=${current.address}></dashboard-app>`,
});

const ownHome = {
  ...config,
  admin: {
    ...config.admin,
    meta: {},
    components: {
      views: { ...config.admin!.components!.views, dashboard: { Component: widgets({ widgets: [] }) } },
    },
  },
} as unknown as MockConfig;
const missingHome = {
  ...config,
  admin: { ...config.admin, components: { views: { dashboard: { Component: "demo-missing-home" } } } },
} as unknown as MockConfig;
export const Record = meta.story({
  name: "A record",
  args: { at: "/collections/invoices/i1" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(document.title).toBe("Invoice · Workspace"));
    await waitFor(() => expect(canvasElement.querySelector("app-widgets")).toBeTruthy());
  },
});

export const Settings = meta.story({
  name: "Settings",
  args: { at: "/globals/settings" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(document.title).toBe("Workspace settings · Workspace"));
  },
});

export const ScreenLoading = meta.story({
  name: "A screen whose element is not loaded",
  args: { at: "/reports" },
  play: async ({ canvas, canvasElement }) => {
    await ready(canvasElement);
    await expect(await canvas.findByText("This screen is loading.")).toBeVisible();
  },
});

export const Account = meta.story({
  args: { at: "/account" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector("dashboard-edit-view")).toBeTruthy());
    await expect(document.title).toBe("Account · Workspace");
  },
});

export const NotFound = meta.story({
  name: "Not found",
  args: { at: "/nowhere" },
  play: async ({ canvas, canvasElement }) => {
    await ready(canvasElement);
    await expect(await canvas.findByText("Nothing found")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Back to the dashboard" })).toHaveAttribute("href", "/");
    await expect(document.title).toBe("Not found · Workspace");
  },
});

export const OwnHome = meta.story({
  name: "The configured home screen",
  parameters: { shell: { config: ownHome } },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector("app-widgets")).not.toBeNull());
    await expect(document.title).toBe("Dashboard · Dashboard");
  },
});

export const DefaultHome = meta.story({
  name: "The default home screen when the configured one is missing",
  parameters: { shell: { config: missingHome } },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector("dashboard-home")).not.toBeNull());
  },
});
