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

# golden-sea-payload-config

Golden Sea's project: a Payload config and nothing else. Collections (`src/collections`), globals
(`src/globals`, including the dashboard's own content: `branding`, `assistant`), endpoints with the
business logic (`src/endpoints`, returning data, never UI), screens as widgets (`src/widgets`) and
seed data (`src/seed`). Entry points: `.` (the config, `src/config.ts`) and `./seed` (`seedModules`,
`seedUsers`).

- **Contracts:** it imports only `saastemlycrm-design-system/contracts` (and `/payload`): the config
  types, `tones`, `CollectionSettings`, `widgets()` and the block vocabulary. Never the design
  system's components or app, never Lit: the config also runs in a service worker and, later, on
  a server. It defines no custom elements. `tests/template.test.ts` enforces all of this (and that
  the design system names no project or runner).
- **Screens:** see "Screens are widgets" in `saastemlycrm-design-system/AGENTS.md`. Anything the
  widget vocabulary can't draw becomes a generic block or component in the design system.
- **Tests** (`tests/`, `vp test`): its behaviour against a backend, mock-runner's engine in memory
  through `mock-runner/testing` (a dev dependency; `src` never imports it). `tests/backend.ts`
  sets it up with this config and `seedModules`: `backend.reset()` in `beforeEach`, `call(...)`,
  `login("karim.youssef")` (demo password). `rest.test.ts`: collections, globals, access and seed
  over REST; `case-views`, `commercial`, `data-model`, `insights`, `operations`, `platform`,
  `sourcing`: every endpoint and widget page; `template.test.ts`: the packages' roles.
  `STATE-AUDIT.md` maps the state behind each screen.
