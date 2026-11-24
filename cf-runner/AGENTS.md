# cf-runner

The same Payload-compatible backend as mock-runner, full stack on Cloudflare: one Worker serves a
Payload config's REST API with its data in D1 (uploads in R2) and the app's built pages as static
assets. It runs mock-runner's engine and REST API unchanged (`mock-runner/server`), so a config
behaves the same in the browser and on Cloudflare. It imports neither the design system nor any
project, and names no business (`golden-sea-payload-config/tests/template.test.ts` checks).

- **Entry points:**
  - `./worker`: `createWorker({ config, apiRoute? })`, the Worker's default export: `/api/*` is
    the REST API, every other path the static assets (an unknown path gets the app, which routes
    it). Each request has its own store and engine (nothing a request reads outlives it).
  - `./store`: `D1Store`, mock-runner's `Store` on D1 (documents, globals, uploads, bookkeeping as
    JSON rows, ./migrations). Per request it keeps what it read (a collection read whole, a
    document read by id), so the engine's many reads in one request cost one query each.
  - `./seed`: `seedSql(config, seeds, { reset? })`: the seed written through the engine in Node
    (hooks, defaults, localization) and turned into SQL for `wrangler d1 execute`. It only adds what
    the database doesn't have; `reset` empties it first. No request ever seeds.
  - `./vite`: `cfBackend({ configPath? })`, Cloudflare's Vite plugin: `vp dev` runs the Worker
    locally (workerd, local D1 and R2 in `.wrangler/state`), `vp build` builds the Worker and the
    pages for `wrangler deploy`.
  - `./client`: `startCfBackend()`, the page's `ready` (nothing to start).
  - `./migrations/*`: the D1 schema (`migrations_dir` in the app's wrangler config).
- **Sessions** are Payload's `payload-token` cookie (HTTP-only, Secure, SameSite=Lax), one per
  browser (`RestApi`'s `session: "cookie"`). The mock's `/_mock/*` tools aren't served.
- **Bindings** (`CfEnv`): `DB` (D1), `FILES` (R2, optional: without it uploads are kept in D1),
  `ASSETS` (static assets), `PAYLOAD_SECRET` (a Wrangler secret that signs sessions; without it one
  is made and kept in D1).
- **Queries** read a collection whole and match in the engine, as the browser's backend does: fine
  for a demo's or a small business's data. Pushing `where`, `sort` and paging into SQL
  (`json_extract`) is the step for large collections.
- **Tests** (`tests/`, `vp test`): the store, the seed SQL and the Worker on Node's SQLite (D1's
  engine) through a small D1 adapter (`tests/sqlite-d1.ts`), against mock-runner's fixture project.
- **Types**: Workers types are imported as modules (`@cloudflare/workers-types/index.ts`), never
  global, so an app that compiles these sources keeps the DOM's types.

An app wires it like Golden Sea does: a Worker (`worker/index.ts`: `createWorker({ config })`), a
wrangler config (D1, R2, assets with `run_worker_first: ["/api/*"]`), `cfBackend()` in its Vite
config, `startCfBackend()` as the dashboard's `ready`, and a seed script calling `seedSql`.
