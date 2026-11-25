import type { MockConfig } from "../contracts/config.ts";

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
