import preview from "#.storybook/preview";
import { ContextConsumer } from "@lit/context";
import { html, LitElement } from "lit";
import { expect, waitFor } from "storybook/test";
import { testDashboard } from "../../../.storybook/dashboard.ts";
import type { MockConfig } from "../../lib/contracts/config.ts";
import { dashboardContext, type Dashboard } from "../../lib/dashboard/context.ts";
import "./dashboard-provider.ts";

class DashboardReader extends LitElement {
  context = new ContextConsumer(this, { context: dashboardContext, subscribe: true });
  get dashboard(): Dashboard | undefined {
    return this.context.value;
  }
  protected createRenderRoot() {
    return this;
  }
  render() {
    const slug = this.dashboard?.project.collectionOf("invoices")?.slug;
    return html`<p>${slug ? `Reads the ${slug} collection` : "No dashboard"}</p>`;
  }
}
if (!customElements.get("story-dashboard-reader")) customElements.define("story-dashboard-reader", DashboardReader);

const config = {
  collections: [{ slug: "invoices", fields: [{ name: "number", type: "text" }], admin: { useAsTitle: "number" } }],
  globals: [],
} as unknown as MockConfig;

const dashboard = testDashboard({
  config,
  data: { docs: { invoices: [{ id: "a", number: "INV-1" } as never, { id: "b", number: "INV-2" } as never] } },
});

const meta = preview.meta({
  component: "dashboard-provider",
  render: () =>
    html`<dashboard-provider .dashboard=${dashboard}
      ><story-dashboard-reader></story-dashboard-reader
    ></dashboard-provider>`,
});

export const ProvidesTheDashboard = meta.story({
  name: "Provides the dashboard",
  play: async ({ canvas, canvasElement }) => {
    await expect(await canvas.findByText("Reads the invoices collection")).toBeVisible();
    const reader = canvasElement.querySelector<DashboardReader>("story-dashboard-reader")!;
    await expect(reader.dashboard).toBe(dashboard);
    const found = await reader.dashboard!.data.find("invoices", { where: { number: { equals: "INV-2" } } });
    await expect(found.docs.map((d) => d.id)).toEqual(["b"]);
    reader.dashboard!.navigate("/collections/invoices");
    await expect(dashboard.navigations.at(-1)).toEqual({ to: "/collections/invoices", replace: false });
  },
});

export const LaysOutNothing = meta.story({
  name: "Lays out nothing",
  play: async ({ canvasElement }) => {
    const provider = canvasElement.querySelector("dashboard-provider")!;
    await waitFor(() => expect(getComputedStyle(provider).display).toBe("contents"));
  },
});
