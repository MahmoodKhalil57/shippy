<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# mock-runner

A Payload-compatible backend that runs in the browser, for any Payload config: a service worker
(`src/mock/sw.ts`, served as `<base>cms-sw.js`) serves the config's REST API from IndexedDB through
a Payload-compatible engine (`src/mock/runtime`). It imports neither the design system nor any
project, and names no business (`golden-sea-payload-config/tests/template.test.ts` checks).
A real deployment (Payload on D1 and Workers) replaces it.

- **Entry points:** `./vite` (`mockBackend({ config, seed, watch? })`, the Vite plugin: the app
  names a module default-exporting its Payload config and one exporting `seedModules`; the worker
  imports them as `virtual:mock-backend`, and the build bundles the worker with an offline
  precache), `./client` (`startMockBackend()`: registers the worker and resolves once it controls
  the page), `./testing` (the Node harness) and `./payload` (Payload's query semantics as this
  backend implements them: `where`, sort, `select` / `populate` / `joins`, errors).
- **Types:** `src/types.ts`: `BackendConfig` (the parts of a Payload config the engine reads, in
  Payload's own types), `Doc`, `PaginatedDocs`, `FieldLike`.
- **No app here:** it has no `index.html`, no dev server and no build of its own. An app
  (Golden Sea's, in `golden-sea-payload-config`) adds the plugin and calls `startMockBackend()`.
- **Seed:** loaded from the app's `seedModules` on first run; seed documents and globals added
  later are written into existing browsers once. `/api/_mock/export|import|reset` snapshot or reset.
- **Not emulated:** drafts/versions, localization, `richText` (plain text), querying through
  relationships (`author.name`), login with username, email flows, GraphQL.
- **Tests** (`tests/`): the engine and REST API only (`rest.test.ts`: query syntax, select,
  populate, joins, access, auth, validation, hooks, endpoints, uploads, globals, export/reset,
  seed top-up), in Node on an in-memory store, against a fixture project (`tests/fixture/config.ts`
  and its `seed/`), never a real one.
- **Test harness** (`mock-runner/testing`, `src/testing.ts`; Node only):
  `testBackend(config, seed)` builds an `Engine` + `RestApi` on a `MemoryStore` (seed: Vite glob
  modules such as a project's `seedModules`, or `Seeds`); it returns `call(method, url, body?,
  headers?)` (`{ status, body, text, res }`, JSON or `FormData` bodies), `login(email, password)`
  (session, as in the browser), `reset({ config?, seeds?, store? })` for `beforeEach`, and `api`,
  `engine`, `seeds`. Also `seedsFromDir(dir)`, `seedsFromGlob`, `Engine`, `RestApi`, `MemoryStore`.
