import { describe, expect, it } from "vite-plus/test";
import { loadBookmarks } from "./stores.ts";
import { shell } from "../../../.storybook/fixtures/shell.ts";

describe("bookmarks", () => {
  it("load as empty when the read fails", async () => {
    const { dashboard } = shell();
    dashboard.stores.bookmarks.set({ items: [{ href: "/x", label: "X" }] });
    dashboard.data.find = () => Promise.reject(new Error("down"));
    await loadBookmarks(dashboard);
    expect(dashboard.stores.bookmarks.get().items).toEqual([]);
  });
});
