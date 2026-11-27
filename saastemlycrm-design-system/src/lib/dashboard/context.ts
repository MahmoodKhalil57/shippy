import { createContext } from "@lit/context";
import type * as BuiltInAi from "../agent/built-in-ai.ts";
import type * as Codex from "../agent/codex.ts";
import type * as Identity from "../agent/identity.ts";
import type * as Polyfill from "../agent/ai-polyfill.ts";
import type * as WebMcp from "../agent/webmcp.ts";
import type { api } from "../api/client.ts";
import type * as Stores from "../stores/index.ts";
import type { AssistantInfo, Branding } from "../../app/site.ts";
import type { Tour } from "../contracts/config.ts";
import type { Address } from "./address.ts";
import type { Project } from "./project.ts";

export type { Address };

export type DataPort = typeof api;
export type Access = Awaited<ReturnType<DataPort["access"]>>;

export type DashboardStores = Stores.DashboardStores;

export interface AiPort {
  builtIn: typeof BuiltInAi;
  codex: typeof Codex;
  identity: typeof Identity;
  polyfill: typeof Polyfill;
  webmcp: typeof WebMcp;
}

export type Tone = "success" | "info" | "warning" | "error";
export interface NotifyAction {
  label: string;
  onClick: () => void;
  undo?: boolean;
}

export interface GuideTopic {
  topic: string;
  keywords: string;
  text: string;
}

export interface Site {
  branding: Branding;
  assistant: AssistantInfo;
  tours(): Promise<Tour[]>;
  guide(): Promise<GuideTopic[]>;
}

export interface Dashboard {
  project: Project;
  site: Site;
  data: DataPort;
  stores: DashboardStores;
  ai: AiPort;
  address(): Address;
  navigate(to: string, replace?: boolean): void;
  back(): void;
  notify(message: string, tone?: Tone, action?: NotifyAction): void;
}

export const dashboardContext = createContext<Dashboard>(Symbol("dashboard"));
