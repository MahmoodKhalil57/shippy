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

Golden Sea's project and its app. The config (`src/`): collections (`src/collections`), globals
(`src/globals`, including the dashboard's own content: `branding`, `assistant`), endpoints with the
business logic (`src/endpoints`, returning data, never UI), screens as widgets (`src/widgets`) and
seed data (`src/seed`). Entry points: `.` (the config, `src/config.ts`) and `./seed` (`seedModules`,
`seedUsers`).

- **The app** is the only place the three packages meet: `index.html` and `app/main.ts` start the
  backend (`startMockBackend()` from `mock-runner/client`) and hand the config to the dashboard
  (`startDashboard` from `saastemlycrm-design-system/app`); `vite.config.ts` adds
  `designSystem()` and `mockBackend({ config: "./src/config.ts", seed: "./src/seed.ts" })`, sets the
  base (`/shippy/` for the build) and writes the page's title from the `branding` seed. `public/`
  is the site's static files. `vp dev` runs it (`bun run dev` at the root); `vp build` writes the
  demo to `../docs`. The OpenAI key meta in `index.html` stays empty in the repository.

- **Contracts:** it imports only `saastemlycrm-design-system/contracts` (and `/payload`): the config
  types, `tones`, `CollectionSettings`, `widgets()` and the block vocabulary. Never the design
  system's components or app, never Lit: the config also runs in a service worker and, later, on
  a server. It defines no custom elements. `tests/template.test.ts` enforces all of this, and that
  the design system and the backend import neither other package. Only `app/`, `vite.config.ts`
  and `tests/` import the dashboard and the backend (lint `overrides` allow it there).
- **Screens:** see "Screens are widgets" in `saastemlycrm-design-system/AGENTS.md`. Anything the
  widget vocabulary can't draw becomes a generic block or component in the design system.
- **Undo or a dialog** (the rule is `Reversal` in the design system's `schema.ts`): a reversible,
  internal action happens at once and its endpoint answers with `undo: { path, body }`, the call
  that takes it back (the snackbar's Undo). Today: an approval decision
  (`/commercial/approvals/:id/withdraw`, until the quotation is sent, the payment recorded, the
  bank details applied or the PO confirmed; never an exchange rate), an inbox review
  (`/inbox/:id/reopen`, unless the link counted a supplier's reply), a history-import decision
  (until the import is approved), a partial-award line (`/operations/po-award-undo`, until the
  sales order is confirmed), an offer selection (`…/select-undo`, until a quotation is on its
  way), removed or discarded RFQ drafts (`…/plan/restore`, until drafted again or sent), and
  every switch and setting (the same call with the value it had). An undo endpoint checks access
  as the signed-in user, lets only the person who acted take it back where it's a personal
  decision, and answers 409 once the thing has moved on. Outward or irreversible actions keep
  their `confirm` dialog and answer with no `undo`: sending RFQs, quotations, reminders and
  correction requests, confirming a supplier PO, recording payments and receipts, applying bank
  details, e-invoices, closing a case. "AI never sends, prices or pays without a person."
- **Lint rules:** `vite.config.ts` loads the `saastemly` oxlint plugin from
  `saastemlycrm-design-system/lint` and spreads its `recommended` rules. `vp check` and the editor
  then report: `no-restricted-imports` (only `/contracts` and `/payload`), `widgets-are-pure`,
  `endpoints-return-data`, `prefer-entries`, `no-local-block-helpers`, `sentence-case-titles` (with
  "Golden Sea" as a proper noun), `max-blocks` and `no-raw-hrefs`.
- **Links:** `src/links.ts` narrows the design system's `links()` to this config's collections,
  globals and views; widgets and endpoints import it as `import * as link from "../links.ts"` and
  write `link.doc("cases", id, "pricing")`. `tests/links.test.ts` keeps its lists equal to the config.
- **Design test:** `tests/design.test.ts` draws every screen as every seeded user and checks it with
  the design system's data rules (`screenDesignProblems` from `saastemlycrm-design-system/testing`,
  fed by the mock backend). A failure
  names the user, screen and widget, and what to change.
- **Tests** (`tests/`, `vp test`): its behaviour against a backend, mock-runner's engine in memory
  through `mock-runner/testing` (`src` never imports it). `tests/backend.ts`
  sets it up with this config and `seedModules`: `backend.reset()` in `beforeEach`, `call(...)`,
  `login("karim.youssef")` (demo password). `rest.test.ts`: collections, globals, access and seed
  over REST; `case-views`, `commercial`, `data-model`, `insights`, `operations`, `platform`,
  `sourcing`: every endpoint and widget page; `undo.test.ts`: each reversible action's Undo (it
  puts things back as they were, runs as the signed-in user, and is refused once built on);
  `design.test.ts`: the design rules on real data;
  `payload-parity.test.ts`: the dashboard's and the backend's `where` matching agree;
  `template.test.ts`: the packages' roles.
  `STATE-AUDIT.md` maps the state behind each screen.
