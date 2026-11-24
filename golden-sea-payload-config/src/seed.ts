import { IS_TEMP_MOCK, TempMockError } from "./flags.ts";

/**
 * The seed data: every JSON file under ./seed (a collection's documents, `<slug>.json`, and
 * globals, `globals/<slug>.json`), as Vite glob modules keyed by path. A backend loads them on
 * first run; the dashboard's demo sign-in reads the users.
 */
export const seedModules = import.meta.glob("./seed/**/*.json", { eager: true });

/** A seeded user, with the demo password the sign-in page fills in. */
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

/** The seeded users (with their demo passwords), for the login page and the role switcher. */
export const seedUsers = demoSignIn();

/** The demo's sign-in: every seeded user and their password, handed to the page. */
function demoSignIn(): SeedUser[] {
  if (IS_TEMP_MOCK) {
    // TODO replace temporary mock logic with proper polished logic
    return users;
  } else {
    // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
    throw new TempMockError(
      "seedUsers hands every seeded user's password to the page for one-click demo sign-in and the role switcher: real sign-in, with no passwords in the bundle",
    );
  }
}
