# Shippy workspace

Four separate packages, each with its own `package.json`, `bun.lock` and `node_modules` (no root
package). They use each other through Bun's links: register each shared package once with
`bun link` in `mock-runner`, `saastemlycrm-design-system` and `cf-runner`, then run `bun install`
in each package (`cf-runner` before `golden-sea-payload-config`). A `link:` dependency is the
package's folder itself, so edits show at once:

- **`saastemlycrm-design-system`**: the design system, the dashboard app, the contracts a
  Payload project implements, its lint rules and its screen checks. Standalone: imports neither
  other package.
- **`mock-runner`**: a Payload-compatible backend in the browser (a service worker serving a
  config's REST API from IndexedDB), its Vite plugin and a Node test harness. Standalone: imports
  neither other package. Replaceable by a real backend (D1, Workers).
- **`cf-runner`**: the same backend full stack on Cloudflare: one Worker serving the config's REST
  API from D1 (uploads in R2) and the app's pages as static assets, on mock-runner's engine
  (`mock-runner/server`). Imports neither the design system nor a project.
- **`golden-sea-payload-config`**: Golden Sea's Payload config (collections, globals, endpoints,
  widgets, seed) and its app. It is the only package that imports the others: its `app/` and
  `vite.config.ts` join the dashboard and the backend, and it holds the app's scripts. The
  GitHub Pages demo builds into `golden-sea-payload-config/mock/`, the Cloudflare build into its
  `dist/`, with local D1 and R2 in its `.wrangler/` (all ignored). `bun run mock:publish` and
  `bun run cf:publish` build and commit only the output to the `mock-build` and `cf-build`
  branches (GitHub Pages serves `mock-build`). Its config (`src/`) imports only the design
  system's pure contracts.

In `golden-sea-payload-config`, `bun run mock:dev` / `bun run mock:build` run the app on the
browser's mock backend (the GitHub Pages demo), and `bun run cf:dev` / `bun run cf:deploy` run it
on Cloudflare; its `package.json` has the rest (`mock:preview`, `cf:migrate`, `cf:seed`…). Each
package has its own
`vp check` and `vp test`, and its own AGENTS.md. Packages export their TypeScript sources; Vite
compiles them. `golden-sea-payload-config/tests/template.test.ts` enforces these roles.
