import preview from "#.storybook/preview";
import type { Decorator } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import type { Doc, MockConfig } from "../../lib/contracts/config.ts";
import { asideRail } from "./aside.ts";
import {
  access,
  config,
  crud,
  maya,
  shell,
  type Shell,
  type ShellOptions,
} from "../../../.storybook/fixtures/shell.ts";

let current: Shell;
const withShell: Decorator = (story, context) => {
  current = shell(context.parameters.shell as ShellOptions | undefined);
  return withDashboard(() => current.dashboard)(story, context);
};

type Args = { path: string; pageTitle: string; onAttention: (e: CustomEvent) => void };

const meta = preview.type<{ args: Args }>().meta({
  title: "Shell/Aside",
  component: "dashboard-aside",
  decorators: [withShell],
  args: { path: "/collections/invoices", pageTitle: "Invoices", onAttention: fn() },
  argTypes: {
    path: { control: "text", description: "The page the side panel is shown beside." },
    pageTitle: { control: "text", description: "That page's title, used when bookmarking it." },
    onAttention: { table: { category: "events" } },
  },
  render: (args) =>
    html`<div style="inline-size: 22rem; block-size: 48rem; display: flex; flex-direction: column">
      <dashboard-aside
        .access=${access}
        .user=${maya}
        .path=${args.path}
        .pageTitle=${args.pageTitle}
        @dashboard-attention=${args.onAttention}
      ></dashboard-aside>
    </div>`,
});

const calls = () => (current.dashboard.data as unknown as { calls: { method: string; args: unknown[] }[] }).calls;

export const Playground = meta.story({
  play: async ({ canvas, args }) => {
    await expect(await canvas.findByRole("link", { name: /Invoice overdue/ })).toBeVisible();
    await waitFor(() => expect(args.onAttention).toHaveBeenCalled());
    const detail = (args.onAttention as unknown as { mock: { calls: [CustomEvent][] } }).mock.calls.at(-1)![0].detail;
    await expect(detail).toEqual({ invoices: 1 });
    await expect(current.dashboard.stores.notifications.get().unread).toBe(2);
  },
});

export const Notifications = meta.story({
  name: "Notifications: open one marks it read",
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("button", { name: /Quarter closed/ }));
    await waitFor(() =>
      expect(
        calls()
          .find((c) => c.method === "update")
          ?.args.slice(0, 3),
      ).toEqual(["notifications", "n2", { read: true }]),
    );
    await waitFor(() => expect(current.dashboard.stores.notifications.get().unread).toBe(1));
  },
});

export const CaughtUp = meta.story({
  name: "Notifications: all caught up",
  parameters: { shell: { data: { docs: { notifications: [] } } } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText("You're all caught up")).toBeVisible();
  },
});

export const NoAccess = meta.story({
  name: "Notifications not readable",
  render: (args) =>
    html`<div style="inline-size: 22rem; block-size: 48rem; display: flex; flex-direction: column">
      <dashboard-aside
        .access=${{ ...access, collections: { ...access.collections, notifications: crud(false, false, false, false), invoices: crud(true, false) } }}
        .user=${maya}
        .path=${args.path}
        .pageTitle=${args.pageTitle}
        @dashboard-attention=${args.onAttention}
      ></dashboard-aside>
    </div>`,
  play: async ({ canvas, args }) => {
    await expect(await canvas.findByText("You're all caught up")).toBeVisible();
    await waitFor(() => expect(args.onAttention).toHaveBeenCalled());
  },
});

export const Bookmarks = meta.story({
  name: "Bookmarks",
  parameters: {
    shell: {
      data: {
        docs: {
          bookmarks: [
            { id: "b1", href: "/collections/invoices", label: "Invoices" },
            { id: "b2", href: "/collections/invoices/i1", label: "INV-1001" },
            { id: "b3", href: "/globals/settings", label: "Workspace settings" },
            { id: "b4", href: "/reports", label: "Reports" },
          ],
        },
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await expect(await canvas.findByRole("link", { name: /INV-1001/ })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /Workspace settings/ })).toHaveTextContent("Settings");
    await expect(canvas.getByRole("link", { name: /Reports/ })).toHaveTextContent("Screen");
    const star = canvas.getByRole("button", { name: "Remove this page from bookmarks" });
    await userEvent.click(star);
    await waitFor(() => expect(calls().some((c) => c.method === "delete")).toBe(true));
    await expect(await canvas.findByRole("button", { name: "Bookmark this page" })).toBeVisible();
  },
});

export const AddBookmark = meta.story({
  name: "Bookmarks: add this page",
  play: async ({ canvas, userEvent }) => {
    await expect(await canvas.findByText("Press the star to keep a page here")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Bookmark this page" }));
    await expect(await canvas.findByRole("link", { name: /Invoices/ })).toHaveTextContent("List");
    await expect(current.dashboard.stores.bookmarks.get().items).toEqual([
      { id: "doc-1", href: "/collections/invoices", label: "Invoices" },
    ]);
  },
});

export const BookmarkFails = meta.story({
  name: "Bookmarks: saving fails",
  play: async ({ canvas, userEvent }) => {
    current.dashboard.data.create = () => Promise.reject(new Error("Offline"));
    await userEvent.click(await canvas.findByRole("button", { name: "Bookmark this page" }));
    await waitFor(() =>
      expect(current.dashboard.notices).toEqual([
        { message: "Couldn't update bookmarks: Offline", tone: "error", action: undefined },
      ]),
    );
  },
});

export const Collapsed = meta.story({
  name: "Collapsed groups",
  play: async ({ canvas, canvasElement, userEvent }) => {
    current.dashboard.stores.preferences.set({ asideCollapsed: ["widgets", "notifications"] });
    await canvas.findByText("Press the star to keep a page here");
    const summary = (path: number) =>
      canvasElement.querySelector<HTMLElement>(`details[data-menu-path="${path}"] > summary`)!;
    await userEvent.click(summary(1));
    await waitFor(() =>
      expect([...current.dashboard.stores.preferences.get().asideCollapsed].sort()).toEqual([
        "bookmarks",
        "notifications",
        "widgets",
      ]),
    );
    await userEvent.click(summary(0));
    await waitFor(() =>
      expect([...current.dashboard.stores.preferences.get().asideCollapsed].sort()).toEqual(["bookmarks", "widgets"]),
    );
  },
});

const many = Array.from({ length: 120 }, (_, i) => ({ id: `m${i}`, title: `Alert ${i}`, read: false, kind: "Alert" }));

export const FailingReads = meta.story({
  name: "Over 99 unread, then every read fails",
  args: { path: "/" },
  parameters: { shell: { data: { docs: { notifications: many as Doc[] } } } },
  play: async ({ canvasElement }) => {
    const aside = canvasElement.querySelector("dashboard-aside")!;
    await waitFor(() => expect(current.dashboard.stores.notifications.get().unread).toBe(20));
    current.dashboard.data.find = () => Promise.reject(new Error("down"));
    current.dashboard.data.count = () => Promise.reject(new Error("down"));
    current.dashboard.data.update = () => Promise.reject(new Error("down"));
    aside.path = "/reports";
    await waitFor(() => expect(current.dashboard.stores.notifications.get().unread).toBe(0));
    const menu = aside.querySelector("ui-menu")!;
    menu.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { label: "Reports" } } }));
    menu.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "elsewhere" } } }));
    menu.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "notification:m1" } } }));
    menu.dispatchEvent(new CustomEvent("ui-icon-action", { detail: { item: { value: "widgets" } } }));
    await aside.updateComplete;
    await expect(current.dashboard.stores.bookmarks.get().items).toEqual([]);
    await expect(asideRail(120)[0]!.label).toBe("Notifications 99+");
  },
});

const ownCounters = {
  ...config,
  admin: {
    ...config.admin,
    custom: {
      aside: [
        {
          title: "Mine",
          counts: {
            collection: "invoices",
            items: [{ label: "Clients", collection: "customers", where: {}, tone: "warning" }],
          },
        },
      ],
    },
  },
} as unknown as MockConfig;

export const OwnCounters = meta.story({
  name: "Counters of another collection",
  args: { path: "/" },
  parameters: { shell: { config: ownCounters } },
  play: async ({ args }) => {
    const details = () =>
      (args.onAttention as unknown as { mock: { calls: [CustomEvent][] } }).mock.calls.map(([e]) => e.detail);
    await waitFor(() => expect(details()).toEqual([{ customers: 2 }]));
  },
});

export const NoWidgets = meta.story({
  name: "No side panel widgets",
  args: { path: "/" },
  parameters: { shell: { config: { collections: config.collections, admin: { user: "users" } } as MockConfig } },
  play: async () => {
    await waitFor(() => expect(current.dashboard.stores.notifications.get().unread).toBe(2));
  },
});

export const Tours = meta.story({
  name: "Tours",
  play: async ({ canvas, userEvent }) => {
    current.dashboard.stores.tour.set({ completed: ["t2"] });
    await userEvent.click(await canvas.findByRole("button", { name: /Getting around/ }));
    await expect(current.dashboard.stores.tour.get()).toMatchObject({ active: "t1", step: 0 });
    await expect(canvas.getByRole("button", { name: /Approvals/ })).toHaveTextContent("Done");
  },
});
