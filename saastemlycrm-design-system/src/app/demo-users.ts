import { projectOf, type SeedUser } from "./config.ts";
import { cellText, collectionOf, dataFields, fieldsOf, userSlug } from "./shared.ts";

export type { SeedUser };

export const seedUsers = projectOf().seedUsers.filter((u) => u.email && u.password);

const roleField = dataFields(fieldsOf(collectionOf(userSlug)!)).find((f) => f.name === "role");
export const roleLabel = (role?: string) => (roleField && role ? cellText(roleField, role) : (role ?? ""));

export const roleLogins = seedUsers.filter((u, i, all) => u.role && all.findIndex((x) => x.role === u.role) === i);

export const defaultLogin = seedUsers[0];

export const demoPassword = (email: string) =>
  seedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())?.password ?? "demo1234";
