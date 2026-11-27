import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import type { MockConfig } from "../../lib/contracts/config.ts";
import { widgets } from "../../lib/widgets/widget.ts";
import "./app.ts";
import {
  access,
  app,
  appShell,
  auth,
  config,
  crud,
  current,
  ready,
  settled,
  site,
  tool,
  withShell,
} from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App/Navigation",
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

const preferences = () => current.dashboard.stores.preferences.get();
const extraGroup = {
  ...config,
  admin: {
    ...config.admin,
    custom: { ...config.admin!.custom, nav: undefined },
    components: {
      views: {
        ...config.admin!.components!.views,
        board: { Component: widgets({ widgets: [] }), path: "/board", nav: { group: "Extras", label: "Board" } },
      },
    },
  },
} as unknown as MockConfig;
export const Navigation = meta.story({
  name: "Signed in, with navigation",
  args: { at: "/collections/invoices" },
  play: async ({ canvasElement, canvas, userEvent }) => {
    await ready(canvasElement);
    await appShell(canvasElement).toggleNav(true);
    const nav = canvasElement.querySelector<HTMLElement>('ui-menu[slot="nav"]')!;
    await waitFor(() => expect(nav.textContent).toContain("Work"));
    await expect(nav.textContent).toContain("Sales");
    await expect(nav.textContent).toContain("Insights");
    await expect(nav.textContent).toContain("Configuration");
    await expect(canvas.getByRole("link", { name: /^Invoices/ })).toHaveAttribute("aria-current", "page");
    await waitFor(() => expect(nav.querySelector("ui-badge")).toBeTruthy());
    await userEvent.click(canvas.getByRole("link", { name: "Customers" }));
    await waitFor(() =>
      expect(current.dashboard.navigations.at(-1)).toEqual({ to: "/collections/customers", replace: false }),
    );
    await waitFor(() => expect(document.title).toBe("Customers · Workspace"));
  },
});

export const AgentTools = meta.story({
  name: "The agent's tools and context",
  args: { at: "/collections/invoices" },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(current.dashboard.ai.webmcp.agentContext()).toEqual({
      name: "Maya Patel",
      role: "Manager",
      roleId: "manager",
      page: "Invoices",
      path: "/collections/invoices",
    });
    await expect(await tool("get_screen")).toMatchObject({ title: "Invoices", signedInAs: { id: "u1" } });
    await expect(await tool("list_pages")).toMatchObject({
      groups: [
        { group: "Home", pages: [{ label: "Dashboard", path: "/" }] },
        { group: "Sales", pages: [{ label: "Invoices" }, { label: "Customers" }] },
        { group: "Insights", pages: [{ label: "Reports" }] },
        { group: "Configuration", pages: [{ label: "Workspace settings" }] },
      ],
    });
    await expect(await tool("describe_schema")).toMatchObject({ globals: [{ slug: "settings" }] });
    await expect(await tool("set_layout", { panel: "aside", open: true })).toMatchObject({ sidePanelOpen: true });
    await expect(await tool("set_layout", { panel: "nav", open: true })).toMatchObject({ navigationOpen: true });
    const looks = (await tool("get_appearance")) as Record<string, { choices: { id: string }[] }>;
    await expect(Object.keys(looks)).toEqual(["theme", "scheme", "background"]);
    await expect(await tool("set_appearance", { kind: "theme", id: looks.theme!.choices[0]!.id })).toBeTruthy();
    await expect(tool("switch_user", { id: "nobody" })).rejects.toThrow('No demo user "nobody"');
    await tool("switch_user", { id: "u2" });
    await waitFor(() => expect(current.dashboard.notices.at(-1)?.message).toBe("Signed in as Jordan Lee (Accounts)"));
    await tool("switch_user", { id: "u2" });
    await expect(current.dashboard.notices).toHaveLength(1);
    auth(canvasElement);
    await current.dashboard.data.logout("users");
    auth(canvasElement);
    await waitFor(() => expect(current.dashboard.ai.webmcp.agentContext()).toBeNull());
  },
});

export const TourControls = meta.story({
  name: "The tour switches users quietly and opens panels",
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const tour = canvasElement.querySelector("dashboard-tour")!;
    await tour.switchTo("u2");
    await tour.switchTo("nobody");
    await waitFor(() => expect(current.dashboard.ai.webmcp.agentContext()?.name).toBe("Jordan Lee"));
    await expect(current.dashboard.notices).toEqual([]);
    await tour.openPanel("aside");
    await tour.openPanel("nav");
    const frame = appShell(canvasElement);
    await expect([frame.navOpen, frame.asideOpen]).toEqual([true, true]);
  },
});

export const Sections = meta.story({
  name: "Rail sections, panel preferences and attention",
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    current.dashboard.stores.preferences.set({ asideCollapsed: ["bookmarks"] });
    const rail = canvasElement.querySelector('ui-menu[slot="rail"]')!;
    rail.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { label: "Dashboard" } } }));
    rail.dispatchEvent(
      new CustomEvent("ui-select", { detail: { item: { label: "Sales", value: { section: "Sales", path: [2] } } } }),
    );
    await waitFor(() => expect(appShell(canvasElement).navOpen).toBe(true));
    canvasElement
      .querySelector('ui-menu[slot="aside-rail"]')!
      .dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "bookmarks" } } }));
    await waitFor(() => expect(appShell(canvasElement).asideOpen).toBe(true));
    await expect(preferences().asideCollapsed).toEqual([]);
    canvasElement
      .querySelector('ui-menu[slot="nav"]')!
      .dispatchEvent(new CustomEvent("ui-change", { bubbles: true, detail: { nav: false, aside: false } }));
    await expect(preferences().navOpen).toBe(true);
    appShell(canvasElement).dispatchEvent(
      new CustomEvent("ui-change", { detail: { nav: true, aside: true, expanded: false } }),
    );
    await expect(preferences()).toMatchObject({ navOpen: true, asideOpen: true, navExpanded: false });
    appShell(canvasElement).dispatchEvent(new CustomEvent("dashboard-attention", { detail: { invoices: 3 } }));
    await settled(app(canvasElement));
    await expect(canvasElement.querySelector('ui-menu[slot="nav"] ui-badge')).not.toBeNull();
    const profile = canvasElement.querySelector<HTMLElement>('ui-dropdown[slot="actions"] ui-menu')!;
    profile.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "account" } } }));
    profile.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "logout" } } }));
    await waitFor(() => expect(canvasElement.querySelector("dashboard-login")).not.toBeNull());
  },
});

export const Groups = meta.story({
  name: "Navigation groups without an order, unreadable pages or demo users",
  parameters: {
    shell: {
      config: extraGroup,
      seedUsers: [],
      access: { ...access, collections: { ...access.collections, customers: crud(false, false) }, globals: {} },
      site: { ...site(), branding: { name: "North office", icon: "grid", backgrounds: [] } },
    },
  },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    const nav = canvasElement.querySelector('ui-menu[slot="nav"]')!;
    await expect(nav.textContent).toContain("Extras");
    await expect(nav.textContent).not.toContain("Customers");
    await expect(canvasElement.querySelector('[slot="nav-footer"]')).toBeNull();
    await expect(canvasElement.querySelector('ui-text[slot="footer"]')).toBeNull();
  },
});
