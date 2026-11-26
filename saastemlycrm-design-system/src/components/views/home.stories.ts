import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { testDashboard, withDashboard } from "../../../.storybook/dashboard.ts";
import "./home.ts";
import "../widgets/host.ts";
import { viewElement } from "../../lib/dashboard/view-element.ts";
import { config, data, emptyConfig, fullAccess, maya, seedUsers } from "../../../.storybook/fixtures/views.ts";

const meta = preview.meta({
  title: "Views/Home",
  component: "dashboard-home",
  decorators: [withDashboard(() => testDashboard({ config, seedUsers, data: data() }))],
  parameters: { layout: "fullscreen" },
  render: () => html`<dashboard-home .access=${fullAccess}></dashboard-home>`,
});

export const Playground = meta.story({});

export const Groups = meta.story({
  name: "Views grouped by section",
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Sample workspace" })).toBeVisible();
    const headings = canvas.getAllByRole("heading", { level: 2 }).map((h) => h.textContent?.trim());
    await expect(headings).toEqual(["Sales", "Setup", "Insights"]);
    await expect(canvas.getByRole("link", { name: /Pipeline/ })).toHaveAttribute("href", "/pipeline");
    await expect(canvas.getByText("Every open deal by stage.")).toBeVisible();
    await expect(canvas.queryByRole("link", { name: /^Deal$/ })).toBeNull();
  },
});

export const Empty = meta.story({
  decorators: [withDashboard(() => testDashboard({ config: emptyConfig, data: data() }))],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Sample workspace" })).toBeVisible();
    await expect(canvas.queryByRole("link")).toBeNull();
  },
});

export const DashboardWidgets = meta.story({
  name: "Dashboard widgets",
  render: () =>
    html`${viewElement("app-widgets", {
      access: fullAccess,
      user: maya,
      page: {
        widgets: [
          {
            title: "Deals by status",
            metrics: {
              collection: "deals",
              items: [
                { label: "Open", where: { status: { equals: "open" } } },
                { label: "Lost", where: { status: { equals: "lost" } } },
              ],
            },
          },
        ],
      },
    })}`,
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText("Lost")).toBeVisible());
  },
});
