import { html, render, type TemplateResult } from "lit";
import type { Decorator } from "@storybook/web-components-vite";
import * as builtIn from "../src/lib/agent/built-in-ai.ts";
import * as codex from "../src/lib/agent/codex.ts";
import * as identity from "../src/lib/agent/identity.ts";
import * as polyfill from "../src/lib/agent/ai-polyfill.ts";
import * as webmcp from "../src/lib/agent/webmcp.ts";
import type { MockConfig } from "../src/lib/contracts/config.ts";
import { createDashboardStores } from "../src/lib/stores/index.ts";
import "../src/components/dashboard/dashboard-provider.ts";
import type { AiPort, Dashboard, NotifyAction, Site, Tone } from "../src/lib/dashboard/context.ts";
import { memoryData, type MemoryData } from "../src/lib/dashboard/memory.ts";
import { createProject, type SeedUser } from "../src/lib/dashboard/project.ts";

export interface TestDashboard extends Dashboard {
  navigations: { to: string; replace: boolean }[];
  notices: { message: string; tone: Tone; action?: NotifyAction }[];
}

export function testDashboard({
  config,
  seedUsers = [],
  data = {},
  ai = {},
  site = {},
  base = "",
}: {
  config: MockConfig;
  seedUsers?: SeedUser[];
  data?: MemoryData;
  ai?: Partial<AiPort>;
  site?: Partial<Site>;
  base?: string;
}): TestDashboard {
  const navigations: TestDashboard["navigations"] = [];
  const notices: TestDashboard["notices"] = [];
  return {
    project: createProject({ config, seedUsers, base }),
    site: {
      branding: { name: "Sample workspace", icon: "grid", backgrounds: [] },
      assistant: {
        name: "Assistant",
        business: "a business",
        ask: "/ask",
        roleNotes: [],
        suggestions: [],
        businessKeywords: [],
        examples: [],
      },
      tours: () => Promise.resolve([]),
      guide: () => Promise.resolve([]),
      ...site,
    },
    data: memoryData(data),
    stores: createDashboardStores({ persist: false }),
    ai: { builtIn, codex, identity, polyfill, webmcp, ...ai },
    navigate: (to, replace = false) => navigations.push({ to, replace }),
    notify: (message, tone = "success", action) => notices.push({ message, tone, action }),
    navigations,
    notices,
  };
}

export const withDashboard =
  (make: () => Dashboard): Decorator =>
  (story) =>
    html`<dashboard-provider .dashboard=${make()}>${story()}</dashboard-provider>`;

export async function mount(template: TemplateResult, dashboard: Dashboard, width?: number, height?: number) {
  const host = document.createElement("div");
  if (width) host.style.inlineSize = `${width}px`;
  if (height) host.style.blockSize = `${height}px`;
  document.body.append(host);
  render(html`<dashboard-provider .dashboard=${dashboard}>${template}</dashboard-provider>`, host);
  await (host.querySelector("dashboard-provider") as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  return { host, remove: () => host.remove() };
}
