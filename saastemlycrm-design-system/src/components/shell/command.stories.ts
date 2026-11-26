import preview from "#.storybook/preview";
import type { Decorator } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, fn, waitFor } from "storybook/test";
import { withDashboard } from "../../../.storybook/dashboard.ts";
import type { MockConfig } from "../../lib/contracts/config.ts";
import { frames } from "../../lib/dashboard/tiling.ts";
import { shortcutOf } from "./command.ts";
import { access, config, crud, shell, type Shell, type ShellOptions } from "../../../.storybook/fixtures/shell.ts";

let current: Shell;
const withShell: Decorator = (story, context) => {
  current = shell(context.parameters.shell as ShellOptions | undefined);
  return withDashboard(() => current.dashboard)(story, context);
};

type Args = { path: string; pageTitle: string; onLogout?: () => void };

const meta = preview.type<{ args: Args }>().meta({
  title: "Shell/Command palette",
  component: "dashboard-command",
  decorators: [withShell],
  args: { path: "/collections/invoices", pageTitle: "Invoices", onLogout: fn() },
  argTypes: {
    path: { control: "text", description: "The current page, for the bookmark action." },
    pageTitle: { control: "text", description: "The current page's title." },
    onLogout: { table: { category: "events" } },
  },
  render: (args) =>
    html`<dashboard-command
      .access=${access}
      .path=${args.path}
      .pageTitle=${args.pageTitle}
      .onLogout=${args.onLogout}
    ></dashboard-command>`,
});

const closed = async (root: HTMLElement) => {
  await waitFor(() => expect(root.querySelector("dialog")?.open).toBe(false));
  await frames(2);
};
const palette = () => current.dashboard.stores.palette.get();
const input = (canvas: { findByRole: (r: string, o: object) => Promise<HTMLElement> }) =>
  canvas.findByRole("searchbox", { name: "Search actions, pages and records…" });

export const Playground = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Search actions, pages, records/ }));
    await waitFor(() => expect(palette().open).toBe(true));
    await waitFor(() => expect(canvas.getByText("Go to")).toBeVisible());
    await expect(canvas.getByText("Quick actions")).toBeInTheDocument();
    await expect(canvas.getByText("Type to search · fuzzy + semantic")).toBeVisible();
  },
});

export const Search = meta.story({
  name: "Search records",
  play: async ({ canvas, userEvent }) => {
    await userEvent.keyboard("{Control>}k{/Control}");
    await waitFor(() => expect(palette().open).toBe(true));
    await userEvent.type(await input(canvas), "INV-1002");
    await expect(await canvas.findByText("Records")).toBeVisible();
    await waitFor(() => expect(canvas.getByText(/results · fuzzy \+ semantic/)).toBeVisible());
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(current.dashboard.navigations).toEqual([{ to: "/collections/invoices/i2", replace: false }]),
    );
    await expect(palette().open).toBe(false);
  },
});

export const Keyboard = meta.story({
  name: "Keyboard: arrows and slash",
  play: async ({ canvas, userEvent }) => {
    await userEvent.keyboard("/");
    await waitFor(() => expect(palette().open).toBe(true));
    const search = await input(canvas);
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard("/");
    await expect(palette()).toMatchObject({ open: true, query: "/" });
    await userEvent.clear(search);
    await userEvent.keyboard("{ArrowDown}");
    await expect(palette().highlighted).toBe(1);
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    await expect(palette().highlighted).toBe(9);
    await userEvent.type(await input(canvas), "zzzzqqq");
    await expect(await canvas.findByText("No results for “zzzzqqq”")).toBeVisible();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(palette().open).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Close", hidden: true }));
    await waitFor(() => expect(palette().open).toBe(false));
  },
});

export const Actions = meta.story({
  name: "Actions: bookmark, contrast and log out",
  play: async ({ canvas, canvasElement, userEvent, args }) => {
    const audit = fn();
    window.addEventListener("ui-contrast-audit", audit, { once: true });
    await userEvent.keyboard("{Control>}k{/Control}");
    await userEvent.type(await input(canvas), "bookmark");
    await userEvent.click(await canvas.findByRole("button", { name: /Bookmark this page/ }));
    await waitFor(() => expect(current.dashboard.stores.bookmarks.get().items).toHaveLength(1));
    await closed(canvasElement);
    await userEvent.keyboard("{Control>}k{/Control}");
    await userEvent.clear(await input(canvas));
    await userEvent.type(await input(canvas), "contrast");
    await userEvent.keyboard("{Enter}");
    await expect(audit).toHaveBeenCalledOnce();
    await closed(canvasElement);
    await userEvent.keyboard("{Control>}k{/Control}");
    await userEvent.clear(await input(canvas));
    await userEvent.type(await input(canvas), "log out");
    await userEvent.click(await canvas.findByRole("button", { name: /Log out/ }));
    await expect(args.onLogout).toHaveBeenCalledOnce();
  },
});

export const Shortcut = meta.story({
  name: "The platform's shortcut",
  play: async ({ canvasElement }) => {
    await expect(shortcutOf("MacIntel")).toBe("⌘+K");
    await expect(shortcutOf("Win32")).toBe("Ctrl+K");
    await expect(canvasElement.querySelector("ui-search[launcher]")).toHaveAttribute(
      "shortcut",
      shortcutOf(navigator.platform),
    );
  },
});

const bare = { collections: config.collections, admin: { user: "users" } } as unknown as MockConfig;

export const Indexing = meta.story({
  name: "Indexes once, ignores other keys and works without globals",
  args: { path: "/" },
  parameters: { shell: { config: bare } },
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector("dashboard-command")!;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    await el.updateComplete;
    await expect(palette().open).toBe(true);
    await expect(
      (current.dashboard.data as unknown as { calls: { method: string }[] }).calls.filter((c) => c.method === "find"),
    ).toHaveLength(3);
    canvasElement.querySelector("ui-modal")!.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
    await expect(palette().highlighted).toBe(0);
    current.dashboard.stores.palette.set({ query: "bill" });
    await el.updateComplete;
    const menu = canvasElement.querySelector<HTMLElement & { items: { badge?: string }[] }>("ui-modal ui-menu")!;
    await expect(menu.items.some((i) => i.badge === "related")).toBe(true);
    menu.dispatchEvent(new CustomEvent("ui-select", { detail: { item: { value: "page:invoices" } } }));
    await expect(palette().open).toBe(false);
    await frames(4);
    el.remove();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await expect(palette().open).toBe(false);
  },
});

export const Restricted = meta.story({
  name: "Read-only access",
  args: { onLogout: undefined },
  render: (args) =>
    html`<dashboard-command
      .access=${{ ...access, collections: { ...access.collections, invoices: crud(false, true), customers: crud(false, false) }, globals: {} }}
      .path=${args.path}
      .pageTitle=${""}
    ></dashboard-command>`,
  play: async ({ canvas, userEvent }) => {
    current.dashboard.stores.bookmarks.set({ items: [{ id: "b1", href: "/collections/invoices", label: "Invoices" }] });
    current.dashboard.data.find = () => Promise.reject(new Error("Offline"));
    await userEvent.keyboard("{Control>}k{/Control}");
    await userEvent.type(await input(canvas), "this page");
    await expect(await canvas.findByRole("button", { name: /Remove this page from bookmarks/ })).toBeVisible();
    await userEvent.clear(await input(canvas));
    await userEvent.type(await input(canvas), "create");
    await waitFor(() => expect(canvas.queryByText(/Create new/)).toBeNull());
  },
});
