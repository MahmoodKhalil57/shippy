import preview from "#.storybook/preview";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import type { Doc, MockConfig } from "../../lib/contracts/config.ts";
import { setLanguage } from "../../lib/i18n/index.ts";
import { overwriteSetLocale, setLocale } from "../../lib/i18n/paraglide/runtime.js";
import "./app.ts";
import { app, auth, calls, config, current, ready, withShell } from "../../../.storybook/fixtures/shell.ts";

const meta = preview.type<{ args: { at: string } }>().meta({
  title: "Shell/App/Language",
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

const originalSetLocale = setLocale;
const people = {
  ...config,
  collections: config.collections.map((c) =>
    c.slug === "users"
      ? { ...c, fields: [...c.fields, { name: "language", type: "select", options: ["en", "ar"] }] }
      : c,
  ),
} as unknown as MockConfig;
const speaker = { id: "u1", name: "Maya Patel", email: "maya@example.com", role: "manager", language: "ar" } as Doc;
let switched: string[] = [];
const language = (saved?: string) => () => {
  switched = [];
  overwriteSetLocale((l) => void switched.push(l));
  try {
    if (saved) localStorage.setItem("ui-language", saved);
    else localStorage.removeItem("ui-language");
    sessionStorage.removeItem("ui-language-followed");
  } catch {}
  return () => {
    overwriteSetLocale(originalSetLocale);
    try {
      localStorage.removeItem("ui-language");
      sessionStorage.removeItem("ui-language-followed");
    } catch {}
  };
};
export const FollowLanguage = meta.story({
  name: "Language: follows the user's own",
  parameters: { shell: { config: people, user: speaker } },
  beforeEach: language(),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(switched).toEqual(["ar"]));
    await expect(canvasElement.querySelector("ui-app-shell")).toBeNull();
  },
});

export const KeepLanguage = meta.story({
  name: "Language: saves the chosen one to the user",
  parameters: { shell: { config: people, user: speaker } },
  beforeEach: language("en"),
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() =>
      expect(calls().find((c) => c.method === "update")?.args).toEqual(["users", "u1", { language: "en" }, undefined]),
    );
    current.dashboard.data.update = () => Promise.reject(new Error("offline"));
    auth(canvasElement);
    await app(canvasElement).updateComplete;
    await setLanguage("ar");
    await expect(switched).toEqual(["ar"]);
  },
});

export const SameLanguage = meta.story({
  name: "Language: already the user's own",
  parameters: { shell: { config: people, user: speaker } },
  beforeEach: language("ar"),
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(calls().some((c) => c.method === "update")).toBe(false);
  },
});

export const DashboardAddress = meta.story({
  name: "Reads the address from the dashboard",
  args: { at: "/collections/invoices" },
  render: () => html`<dashboard-app></dashboard-app>`,
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await expect(current.dashboard.ai.webmcp.agentContext()?.path).toBe("/collections/invoices");
  },
});
