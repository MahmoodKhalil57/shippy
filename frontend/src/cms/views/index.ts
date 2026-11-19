import type { Endpoint } from "payload";

/**
 * The project's screens as views (src/app/view/schema.ts): each file here exports
 * `viewEndpoints`, endpoints that return a `View` the app draws with the design system. The
 * config points at them with `viewEndpoint("/views/<name>")`. Files are picked up on their own.
 */
const modules = import.meta.glob<{ viewEndpoints?: Endpoint[] }>("./*.ts", { eager: true });
export const viewEndpoints: Endpoint[] = Object.entries(modules)
  .filter(([file]) => file !== "./index.ts")
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([, m]) => m.viewEndpoints ?? []);
