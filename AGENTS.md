# Shippy workspace

Three packages, linked as a Bun workspace (`bun install` at the root):

- **`saastemlycrm-design-system`**: the design system, the dashboard app, the contracts a
  Payload project implements, its lint rules and its screen checks. Standalone: imports neither
  other package.
- **`mock-runner`**: a Payload-compatible backend in the browser (a service worker serving a
  config's REST API from IndexedDB), its Vite plugin and a Node test harness. Standalone: imports
  neither other package. Replaceable by a real backend (D1, Workers).
- **`golden-sea-payload-config`**: Golden Sea's Payload config (collections, globals, endpoints,
  widgets, seed) and its app. It is the only package that imports the other two: its `app/` and
  `vite.config.ts` join the dashboard and the backend, and it holds the `dev`, `build` and
  `preview` scripts (the demo builds into `docs/`). Its config (`src/`) imports only the design
  system's pure contracts.

`bun run dev` / `bun run build` at the root run Golden Sea's app. Each package has its own
`vp check` and `vp test`, and its own AGENTS.md. Packages export their TypeScript sources; Vite
compiles them. `golden-sea-payload-config/tests/template.test.ts` enforces these roles.
