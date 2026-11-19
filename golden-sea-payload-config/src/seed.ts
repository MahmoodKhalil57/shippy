/**
 * The seed data: every JSON file under ./seed (a collection's documents, `<slug>.json`, and
 * globals, `globals/<slug>.json`), as Vite glob modules keyed by path. A backend loads them on
 * first run; the dashboard's demo sign-in reads the users.
 */
export const seedModules = import.meta.glob("./seed/**/*.json", { eager: true });

/** The seeded users (with their demo passwords), for the login page and the role switcher. */
export const seedUsers = (import.meta.glob("./seed/users.json", { eager: true, import: "default" })[
  "./seed/users.json"
] ?? []) as {
  id: string;
  email: string;
  password: string;
  name?: string;
  initials?: string;
  role?: string;
}[];
