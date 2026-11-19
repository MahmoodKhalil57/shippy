import { projectOf, type SeedUser } from "./config.ts";
import { cellText, collectionOf, dataFields, fieldsOf, userSlug } from "./shared.ts";

/** Demo sign-in helpers: the project's seeded users (handed to `startDashboard`) and their roles. */

export type { SeedUser };

/** Seeded users with their passwords. */
export const seedUsers = projectOf().seedUsers.filter((u) => u.email && u.password);

/** A role's option label ("Sales", "Management approver"…), when the user collection has a `role` field. */
const roleField = dataFields(fieldsOf(collectionOf(userSlug)!)).find((f) => f.name === "role");
export const roleLabel = (role?: string) => (roleField && role ? cellText(roleField, role) : (role ?? ""));

/** One seeded user per role (the first one seeded with it): the roles you can switch between. */
export const roleLogins = seedUsers.filter((u, i, all) => u.role && all.findIndex((x) => x.role === u.role) === i);

/** The login page's pre-filled email. */
export const defaultLogin = seedUsers[0];

/** A seeded user's password (demo sign-in never asks for it), or the demo password for others. */
export const demoPassword = (email: string) =>
  seedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())?.password ?? "demo1234";
