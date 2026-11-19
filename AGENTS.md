# Shippy workspace

Three packages, linked as a Bun workspace (`bun install` at the root):

- **`saastemlycrm-design-system`**: the design system, the dashboard app and the contracts a
  Payload project implements. Knows no project.
- **`golden-sea-payload-config`**: Golden Sea's Payload config (collections, globals, endpoints,
  widgets, seed). Imports only the design system's pure contracts.
- **`mock-runner`**: runs a project's dashboard in the browser with a service-worker backend
  (the project is one setting in its `vite.config.ts`); builds the demo into `docs/`. Replaceable
  by a real backend (D1, Workers). Knows no project otherwise.

`bun run dev` / `bun run build` run the mock runner. Each package has its own `vp check` and
`vp test`, and its own AGENTS.md. Packages export their TypeScript sources; Vite compiles them.
