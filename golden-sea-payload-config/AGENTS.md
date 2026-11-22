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
business logic (`src/endpoints`, returning data, never UI), screens (`src/pages`, declaring the design system's widgets with queries and formatters) and
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
- **Business logic lives in the collections**, so every screen reads it the same way:
  - **Values derived from a document** are fields on its collection. If a query must filter on them, they are stored by a `beforeChange` hook (an invoice's `balance`, `status`). If they depend on the time or on other documents, they are virtual and computed on read (`computed()` in `src/collections/shared.ts`). Examples: an invoice's `balanceUsd`, `daysOverdue`, `ageBucket` and its AI `reminder` draft.
  - **The demo's clock** is `TODAY` (`src/collections/shared.ts`). The config's `admin.custom.today` is set from it, so `$today-30d` in a widget query counts from the same day as the virtual fields.
  - **What a value means** is on its field: select tones (`tones()`) and number formats (`formats.money("currency")`).
  - **What people can do to a document** is on its collection (`custom.actions`, with `when`, `roles` and `$row.<path>`), calling an endpoint that re-checks access. Example: the invoices' reminders, which follow the customer's contact rule.
  - **Pages declare the design system's data widgets with no code**: `records` (table, list, entries; dotted columns such as `customer.contactRule`), `metrics`, `breakdown` (a chart, or `as: "table"`), `counts`, `fields`. Shared `where`s go in `src/queries/` (`openInvoices`).
  - **A formatter is only for what the collections can't say**: aggregates across collections, forecasts, AI briefings and multi-step workflows. These read an endpoint, and endpoints return data.
- **Widgets** are the design system's generic kinds (`chart`, `table`, `list`, `entries`, `steps`,
  `details`, `gauges`, `timeline`, `text`, `message`, `tiles`, `form`, `figures`, `assists`,
  `header`…; `kind.each` for one tile per item). They know no business and the config has none of
  its own (there is no `src/widgets`). The config declares each one on a page and passes it what
  makes it Golden Sea's:
  - `src/pages/<page>.ts`: a screen. Each widget is declared inline: a kind, where it goes (title,
    size, rows, visible, hidden…), a query (`data`) and a formatter (`format`). Near-identical
    widgets are one declaration (`kind.each` over the data, or one formatter taking a parameter),
    never copies.
  - `src/format/<domain>.ts`: the formatters, the business logic. Pure functions from data (an
    endpoint's answer, documents) to what a kind draws (`KindData<"table">`, `Stat[]`…), plus the
    slots every kind has: `note`, `tags`, `choice` (one or several), `alerts`, `actions`, `head`.
    Written by the data they read, not by the page that shows them, so any page reuses them. A
    formatter doesn't know where its data comes from. `src/format/index.ts`: what they all share
    (money, dates, people, status tones).
  - `src/queries/<domain>.ts`: the Payload queries (`query.find`, `query.endpoint`, `query.all`…),
    typed by what they answer; the endpoints' response types stay with the endpoints.
  - `src/actions/<domain>.ts`: the POST actions (calls, confirms, fields) formatters offer.
  - The no-code data widgets (`records`, `counts`, `fields`) take their meaning from the field
    config and need no formatter: a page declares them as plain objects.
  - A widget that showed two things at once (a table and a details list) is two widgets.
  - Each collection's looks (the line over a record's name, its status, its figure, its facts and
    its calendar date) are in `src/collections/looks.ts`, merged into its `custom.list`. Each
    list page's widgets and starting layout are in `src/pages/records.ts`: counts, share bars,
    rings, treemaps and charts of its records (`collectionPage`'s `before`).
  - A widget that draws a collection's own records is that collection's widget (a `collection` in
    one of its layouts, or a no-code `breakdown`), never a shape computed by an endpoint: my
    deadlines (cases, `chart`), what live cases wait on (cases, `breakdown` share), the suppliers'
    quadrant (suppliers, `scatter`) and their on-time ranking (suppliers, `ranking`), the growth
    pipeline (opportunities, `board`). Endpoint shapes are for what spans collections or is
    history: the trends, the briefing, the money bridges.
    Plain lists of one collection are collection widgets too (home's decisions, pipeline next
    steps and inbox to triage; a case's open tasks, audit timeline and matched replies; the
    approval rules' queue; the quotation preview's approvals), their records' actions on each row. A `records` widget stays where it says more
    than a list layout can: second lines and own column labels (a case's orders, bills and
    receipts, the collections table, the case queue, the exception queue and audit log, today's
    follow-ups), entries' text, scripts and notes (sales next
    steps, the inbox's review lists), an array field's rows, a master-detail list, or a filter on
    virtual fields (`keep`).
  - The dashboards also place lists in their own layouts:
    - home: the open tasks as rows and the quote deadlines on a calendar;
    - control room: the live cases as cards and the deliveries on a calendar;
    - cash: the open invoices as cards and the supplier bills on a calendar;
    - growth: the pipeline as a board and the registrations as cards;
    - approvals: every approval as rows;
    - delivery plan: a delivery calendar.
  - The dashboards' shapes (countdown, month, bullets, dials, waffle, share bar, treemap,
    quadrant, the profit bridge) read one endpoint, `GET /api/visuals` (`src/endpoints/visuals.ts`,
    per signed-in role), through `src/queries/visuals.ts` and `src/format/visuals.ts`. The cash
    bridge reads the cash forecast (`format/cash.ts` `bridge`) and the pricing tab's dial, bridge
    and what-if read the case's pricing, so each figure matches the one beside it. A shape with
    nothing to draw is hidden (`hidden`: unpriced cases, roles without money).
  - `tests/widget-files.test.ts` enforces this: no `src/widgets`, pages that never draw (no
    `render`, `source` or `block(`), formatters that import no queries, and only those imports.
- **Screens:** see "Screens are widgets" in `saastemlycrm-design-system/AGENTS.md`. Anything the
  widget vocabulary can't draw becomes a generic block or component in the design system.
- **Where collections, records and globals are:** `src/pages.ts`. Nothing has a page of its own, so
  the config places them: every collection people work in gets its list (`collectionPage`), every
  collection its record page (`documentPage`), every global its form (`globalPage`), at the
  addresses `links()` writes. `sourcingPipeline` shows related collections on one page, each list
  set up for it (a fixed `where`, its columns, parts hidden, its own URL key). A new collection
  people should open needs its pages there, or links to it lead nowhere (the screen check says so).
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
