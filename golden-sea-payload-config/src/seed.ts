import { IS_TEMP_MOCK, TempMockError } from "./flags.ts";

export const seedModules = import.meta.glob("./seed/**/*.json", { eager: true });

interface SeedUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  initials?: string;
  role?: string;
}

const users = (import.meta.glob("./seed/users.json", { eager: true, import: "default" })["./seed/users.json"] ??
  []) as SeedUser[];

export const seedUsers = demoSignIn();

function demoSignIn(): SeedUser[] {
  if (IS_TEMP_MOCK) {
    return users;
  } else {
    throw new TempMockError(
      "seedUsers hands every seeded user's password to the page for one-click demo sign-in and the role switcher: real sign-in, with no passwords in the bundle",
    );
  }
}
