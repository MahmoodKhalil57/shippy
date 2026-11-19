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

Runs a Payload project's dashboard entirely in the browser, with nothing deployed: a service
worker (`src/mock/sw.ts`, served as `<base>cms-sw.js` by `plugins/mock-backend.ts`) serves Payload's
REST API from IndexedDB through a Payload-compatible engine (`src/mock/runtime`). The project is
one setting, `mockBackend({ project: "golden-sea-payload-config" })` in `vite.config.ts`: the app
(`src/main.ts`) and the worker import it as `virtual:mock-project` (its config, `seedModules`,
`seedUsers`), the site's public files are the project's `public/`, and the page's title and
description come from its `branding` seed. `src/main.ts` starts the worker and hands the project
to the dashboard with `startDashboard({ config, seedUsers, ready })`. A real deployment (Payload on
D1 and Workers) replaces only this package: the design system and the project stay.

- **Run:** `vp dev` (or `bun run dev` at the workspace root). `vp build` writes the demo site to
  `../docs` (GitHub Pages, base `/shippy/`), with an offline precache.
- **Seed:** loaded from the project's `./seed` on first run; seed documents and globals added later
  are written into existing browsers once. `/api/_mock/export|import|reset` snapshot or reset.
- **Not emulated:** drafts/versions, localization, `richText` (plain text), querying through
  relationships (`author.name`), login with username, email flows, GraphQL.
- **Tests** (`tests/`): the engine and REST API only (`rest.test.ts`: query syntax, select,
  populate, joins, access, auth, validation, hooks, endpoints, uploads, globals, export/reset,
  seed top-up), in Node on an in-memory store, against a fixture project (`tests/fixture/config.ts`
  and its `seed/`), never a real one. A project's own tests (and the package-roles test) live in
  the project.
- **Test harness** (`mock-runner/testing`, `src/testing.ts`; Node only, imports no project):
  `testBackend(config, seed)` builds an `Engine` + `RestApi` on a `MemoryStore` (seed: Vite glob
  modules such as a project's `seedModules`, or `Seeds`); it returns `call(method, url, body?,
  headers?)` (`{ status, body, text, res }`, JSON or `FormData` bodies), `login(email, password)`
  (session, as in the browser), `reset({ config?, seeds?, store? })` for `beforeEach`, and `api`,
  `engine`, `seeds`. Also `seedsFromDir(dir)`, `seedsFromGlob`, `Engine`, `RestApi`, `MemoryStore`.
- **OpenAI key:** `index.html`'s `<meta name="openai-api-key">` stays empty in the repository.
