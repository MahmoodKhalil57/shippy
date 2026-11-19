import type { MockConfig } from "../contracts/config.ts";

/**
 * The project the dashboard draws: its Payload config, and the seeded users it offers on the
 * login page and in the role switcher (demo sign-in). Handed over once by `startDashboard`
 * (./index.ts) before the app's modules load; the app reads it, it never imports a project.
 */

export interface SeedUser {
  id: string;
  name?: string;
  initials?: string;
  email: string;
  password: string;
  role?: string;
}

let project: { config: MockConfig; seedUsers: SeedUser[] } | undefined;

export function setProject(p: { config: MockConfig; seedUsers?: SeedUser[] }) {
  project = { config: p.config, seedUsers: p.seedUsers ?? [] };
}

export function projectOf() {
  if (!project) throw new Error("No project: call startDashboard({ config }) first.");
  return project;
}
