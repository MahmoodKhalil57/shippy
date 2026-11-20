# saastemlycrm-design-system

The design system (Lit components on daisyUI, Material Design 3 roles), the dashboard app that draws
any Payload project, and the contracts a project implements. It never imports a project:
`golden-sea-payload-config/tests/template.test.ts` enforces that, and that it never names a business.

Entry points (package.json `exports`, TypeScript sources):

- `.`: registers every component. `./styles.css`: the stylesheet.
- `./contracts`: what a project's config uses, all pure (`defineConfig`, field types, `tones`,
  `CollectionSettings`, `widgets()`, the block vocabulary). A project imports only this (and `./payload`).
- `./payload`: pure Payload helpers (`where` matching, `select`/`joins`, errors).
- `./client`: the Payload REST client (`api`); `setBackendReady` for a backend that needs starting.
- `./app`: `startDashboard({ config, seedUsers, ready })` hands a project to the dashboard and starts it.
- `./vite`: `designSystem()`, the Vite plugins an app needs (component stylesheets, Tailwind, layers, icons).

The sections below describe the design system and the app; paths without a package name are in this package.

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

# Design system rules

The design system is enforced through the components (`tests/architecture.test.ts` fails otherwise):

- **Only primitives style things** (`src/components/primitives`): padding, spacing, sizes, colours, typography. They expose design tokens as typed, responsive variant properties (`size="sm lg:lg"`, `force-open="lg"`).
- **A primitive is one building block.** It draws its own markup and may borrow another primitive's recipes or icons (`button()`, `iconSvg()`), but it never renders another `ui-*` element. Anything assembled from components is **composed** (`src/components/composed`): the app shell, the appearance controls, the filter builder, the column picker, the model selector, the AI assists and the doc form. Code that isn't a component lives in `src/components/base`, for example the contrast audit, brightness sampling, filter queries and appearance helpers.
- **Pages and composed components** (`src/components/composed`) are assembled from `ui-*` elements only:
  - no `class` / `style`, no DOM styling APIs (`classList`, `.style`, `innerHTML`…), no stylesheets, no `css`/`svg`/`unsafeHTML`;
  - no primitive recipes: import only types (`import type`) and element registrations (`import "…/button.ts"`);
  - templates hold `ui-*` elements plus unstyled inline text (`strong`, `em`, `span`, `br`…), nothing else;
  - attribute values must be the primitive's tokens; the test reads each primitive's variants and checks every literal value.
- **Primitives use theme colours only** (`primary`, `surface-container`…), never the Tailwind palette (`red-400`) or literal colours.
- **Layout is proved, not tested.** Every width-deciding class in the design system comes from the layout algebra (`src/components/primitives/layout/algebra.ts`), and the build refuses one written anywhere else. Each of its bundles keeps one invariant by CSS alone, so any page built from them keeps it too, by induction over the DOM: no screen, data, window width or text size is enumerated, because none can make a difference.
  - **The invariant**, for every box, at any width and any text size: (I1) its content never sticks out of it; (I2) running text gets min(7rem, the room its parent has); (I3) padding never leaves a box's content narrower than min(7rem, the box). 7rem is the readable measure (about 14 characters); it scales with the text (HIG Layout, Dynamic Type: adjacent views "may need to stack vertically"). M3 Lists: the content slot "must be the largest-width slot".
  - **The base fact**: every word can break (`overflow-wrap: anywhere` on the page, `src/index.css`), so nothing is held wide by a long word, a URL or a file name. Columns stay readable through explicit minimums, never word lengths.
  - **The bundles** (each with its one-sentence reason in `algebra.ts`): `row` (always wraps: what doesn't fit goes to the next line), `inlineRow`, `rowFill` (the item that takes the room: never under min(100%, 7rem), else it gets a line of its own), `rowEnd`, `stack`, `gridBase` and `grid.*` (auto-fit, each track at least min(100%, X)), `pairsInline` (label beside value from 24rem), `sidebar`, `inset` / `pad` / `padStart` / `padEnd` (padding that limits itself: `min(p, max(0, (100% − 7rem) / 2))`, so nesting can't squeeze content), `cardInset`, `scrollX` (the only place content may be wider than its box) with `scrolled.*` (a table's or steps' 10rem floor, inside it), `fixed` / `fixedWidth` (leaves of at most 4rem), `text.prose` / `text.label` / `text.line`, `cap`, `floating` (a panel at most the window less 1rem a side), `container` (a size container is always `w-full`: containment sizes it as if empty).
  - **daisyUI's components** keep the invariant through `src/styles/daisy-m3.css`'s layout section (buttons wrap and pad within limits, labels and dividers wrap, fieldsets and fields shrink, a horizontal menu wraps, joined controls wrap, card bodies, dialogs, chat bubbles and accordion titles pad within limits). Only the components it covers are allowed (`DAISY_SAFE` in `vite/layout-proof/check.ts`); steps scroll themselves and tables are always drawn inside `scrollX`.
  - **The check** (`vite/layout-proof/check.ts`, with the class vocabulary in `tokens.ts`), run when each primitive's stylesheet is built (`vite/component-css.ts`), and over every primitive by `tests/layout-proof.test.ts` (`vpx vite/layout-proof/report.ts` lists them all). It reads class strings where they're written (recipes, `class` attributes, `classMap`, inline `style`), removes the algebra bundles it finds (referenced, or written out in a variant value, which must stay literal for responsive variants), and refuses what's left if it can change a width: a raw `flex` / `grid` / direction, padding over 4px, a width or minimum width that can exceed its box, `shrink-0` on something not fixed, text that never wraps without being cut, fixed grid columns (unless behind a container query that gives each 7rem: `@min-[T]:grid-cols-N` with T ≥ 7N + 4(N − 1) rem, checked arithmetically), column spans the same way, a size container without `w-full`, physical `left` / `right` sides (write `start` / `end`, so right to left is right too), an undeclared daisyUI component, or running text (`text-body-*`, `text-title-*`, `text-headline-*`) that doesn't say how it wraps (`text.prose`, `text.label` or `text.line`). Composed components, the app and projects write no classes (`tests/architecture.test.ts`), so they're covered by construction.
  - **The frame** (`layout/frame.ts`) is checked like any primitive. Its geometry (rails, open columns, sheets, edges, the main panel's floor) is the algebra's `frame` bundles, sized by the frame tokens (`--frame-*`, `--frame-nav`, `--frame-aside` in `theme.css`), whose room `src/components/base/frame-fit.ts` proves for every window width from 320 to 3840px in every reachable state (`tests/frame-fit.test.ts`); its header and toolbars are wrapping rows like everything else.
  - **What stays assumed**: the CSS facts each bundle rests on (one sentence each in `algebra.ts`), and the global stylesheets (`theme.css`, `index.css`, `daisy-*.css`), which are reviewed, not checked.
  - **A diagnostic, not the safety net**: `<ui-contrast-audit>` (`?audit`, or "Check contrast and layout") still measures the page and every open floating layer at the current width (`src/components/base/layout.ts`, `auditLayers`): anything that escapes its box, truncated text squeezed to almost nothing, text cramped under 7rem, a page that scrolls sideways. Use it to look at a page; the proof is what guarantees it.
- **Glass is for the floating layer only**: sheets, dialogs, menus and other controls that float above content use `liquid-glass` (or `liquid-glass-clear` for small controls), defined in `src/styles/theme.css` (tint, light blur, refraction via the `#liquid-glass-refraction` SVG filter in `index.html`, rim shine, shadow). Tooltips, the snackbar, popovers and pickers already use it through their primitives; `shadow-*` utilities on glass replace only its drop shadow. The main panel is see-through frosted glass (`liquid-glass-surface`) over the background; content surfaces inside it (cards, tables) stay solid, and glass never sits on glass. Over a background image, the app shell picks the lightest scrim (`--app-scrim`) at which `<ui-contrast-audit>` finds no failing text over the image, so the photo shows as much as stays readable. The material already handles light/dark, Reduce transparency, Increase contrast and browsers without `backdrop-filter`. Enforced (`tests/design-roles.test.ts`, "everything that floats is glass"): dropdown panels are always glass and have no solid surface option; every `<select>`'s open list (`::picker(select)`) gets the glass from `daisy-m3.css`, because a utility on `<ui-select>`'s wrapper can't reach it; and any primitive that renders a popover or a `<dialog>` must use the glass.
- **Colour contrast (WCAG AA) is checked**: `tests/contrast.test.ts` checks every colour scheme's ink/fill pairs (the scheme generator, `vite/schemes.ts`, fixes unreadable `*-content` tokens); on screen, the command palette's **"Check contrast and layout"** (or `?audit` in the URL) runs `<ui-contrast-audit>`, which measures every visible text against what's really behind it — glass, tints, and the background image — and outlines failures. Run it in light and dark after visual changes. Rules that keep it green: secondary text is the `on-surface-variant` role (80% of the ink), never fainter; coloured text uses the `*-ink` tokens (`text-success-ink`…, the colour mixed toward the ink), never raw `text-success`; tinted backgrounds take full-strength text.
- **Icons come from the registry only**: `ICONS` / `iconSvg()` / `<ui-icon name>` in `src/components/primitives/media/icon.ts`, filled with `import x from "~icons/<collection>/<name>"` (unplugin-icons, tree-shaken) from line-md (preferred, animated), material-symbols-light, devicon or logos. Nothing else draws an `<svg>` (`tests/icons.test.ts`).
- Missing something? Add a variant (or a new primitive) in `src/components/primitives`, not a workaround in the page.

## Which component (M3 and Apple component names in brackets)

Pages say what a thing is, and the primitive decides how it looks. `tests/design-roles.test.ts` ("pages use the semantic components") rejects the hand-built versions listed here.

- **Page top**: `<ui-page-header heading subtitle eyebrow>` with `slot="breadcrumbs"`, `slot="status"` and `slot="actions"` (top app bar; large title). Never `<ui-heading level="1">`.
- **Cards**: `<ui-card variant="outlined|filled|elevated" heading subhead .count>` with `slot="trailing"` for tags or actions in the header. Cards have no colour, width or shadow options.
- **Words and numbers on things**: `<ui-tag tone>` is a status or category word ("Overdue"). `<ui-badge .count>` is a number and `<ui-badge dot tone label>` is a dot. A badge never holds a word.
- **Key figures**: `<ui-stat label value note tone href>`, with `slot="trend"`.
- **Label and value pairs**: `<ui-description-list .items layout="stacked|inline">`. It renders a real `<dl>`.
- **Rows of things**: `<ui-list>` with `<ui-list-item headline supporting overline trailing-text href selected>` (list). A table cell's second line is the column's `supporting`, not a hand-built stack.
- **Nothing to show, loading, failed**: `<ui-empty-state heading description icon tone loading>` with `slot="actions"`.
- **Messages**:
  - `<ui-alert tone>` is inline, next to what it's about.
  - The snackbar is for something that just happened: the `toast()` helper pushes to the one `<ui-snackbar>`. A message with an action or an error stays until it is dismissed.
  - A decision is a `<ui-modal confirm-label confirm-tone="error">` (dialog; alert). Its button names the verb ("Delete"), and Cancel is always there.
- **Actions**:
  - `<ui-button variant="filled|tonal|outlined|text|elevated" color size="xs|sm|md">`. Use at most one or two filled buttons per view.
  - An icon-only action is `<ui-icon-button label>`. The label is its name and its tooltip.
  - A row of controls over content is a `<ui-toolbar label>`, with `slot="end"` for the trailing group.
  - Menus are `<ui-dropdown .items>` with icons, `checked`, `destructive` and separators.
- **Choosing**:
  - One or several options from a few: `<ui-button-group .options select="single|multi">` (segmented button). Never a colour swap between buttons.
  - A setting that applies at once: `<ui-switch>`. A statement someone confirms: `<ui-checkbox>`.
  - A button that stays on: `<ui-button toggle ?selected>`.
  - Chips: `variant="input"` is a picked value, `variant="filter"` is an active filter.
- **Fields**: every field has a name: `label`, `legend`, `aria-label` or a placeholder. A search is `<ui-search label>`, which has the icon, a clear button and Escape to clear. The header's command-palette trigger is `<ui-search launcher shortcut>`.
- **Amounts and progress**:
  - A measurement ("3 of 5 lines ready", "92% on time") is `<ui-gauge tone heading value-text label>`.
  - `<ui-progress>` is only for work the app is doing now, and it is always primary.
  - A position in a fixed sequence is `<ui-steps current tone>`: earlier steps get a tick, `state: "skipped"` shows a dash, and `supporting` is the small line under a label.
- **Text**: `<ui-text variant="body-md">` and `<ui-heading variant="title-lg">` take type roles, plus `emphasized`. They have no `size` or `weight`.

# The project is a Payload config package; this design system draws it

This repository is a template. A new project changes only its config package (`golden-sea-payload-config`: config, endpoints, widgets, seed, and `public/` for its photos and icons) and its app joins the packages (`golden-sea-payload-config/app/main.ts`, `vite.config.ts`: `designSystem()`, `mockBackend({ config, seed })`, `startDashboard`); the design system, the agent and the mock backend stay as they are. `golden-sea-payload-config/tests/template.test.ts` fails when the design system or the backend imports another package or names the business, or when the project imports more of the design system than its pure contracts or defines a custom element: UI is always a block or a design-system component.

- **`golden-sea-payload-config`, the project:** only Payload concepts: the data model (`collections`, `globals`, `config.ts`), the business logic (`endpoints`, which return data, never UI), the screens (`widgets`) and the seed data.
- **`src/app`, the dashboard:** the shell, the generated list and edit pages, the widget host, the assistant and the tours. It reads everything from the config.
- **`src/components` and `src/styles`, the design system.** `src/agent`: the AI runtime.
- **`mock-runner`, the in-browser backend:** the service worker, the Payload-compatible engine, its Vite plugin (`mock-runner/vite`) and a test harness (`mock-runner/testing`); an app hands it a config and seed. It has its own copy of Payload's query semantics; Golden Sea's `tests/payload-parity.test.ts` checks it agrees with this package's `./payload`. The REST client is this package's `./client`, the config types and helpers are `./contracts`, the screen checks `./testing`.

**Screens are widgets.** A screen is a list of widgets placed in one of Payload's component slots with `widgets({ header, params, widgets })` (`src/app/widgets/widget.ts`), which gives Payload's own `{ path, clientProps }` form. They cover Payload's four kinds of admin view:

- **Root views:** `admin.components.views.dashboard` (the home page) and the other root views in `admin.components.views`;
- **Collection views:** a collection's `beforeList` / `afterList`;
- **Document views:** an edit tab in a collection's `admin.components.views.edit`, and a collection's `custom.edit.before` (above the form);
- **Global views:** the same two on a global: an edit tab in its `admin.components.views.edit` (`/globals/<slug>/<tab>`) and its `custom.edit.before` (Golden Sea's approval rules: what those rules govern right now, `golden-sea-payload-config/src/widgets/approval-rules.ts`).

Each screen's widgets live in `golden-sea-payload-config/src/widgets/<screen>.ts`. `<app-widgets>` (`src/app/widgets/host.ts`) draws them.

**A screen is a board of tiles.** Every widget is one tile on `<ui-board>` (`src/components/primitives/layout/board.ts`), laid out by `src/components/base/board.ts`, proved over finite domains by `tests/board.test.ts`:

- **Lanes** come from the board's own width: 1, then 2 from 37rem, 3 from 56rem, 4 from 75rem (container queries in the algebra's `board.lanes`; n lanes of at least 18rem, about M3's 360dp fixed pane, and n − 1 gaps of 16px, M3's compact spacer). The smallest screen (a 258px main panel) is always one lane, so the phone layout is the tiles stacked in order.
- **Sizes:** a widget's `size` is `s` (1 lane), `m` (2), `l` (3) or `full`, and a tile never takes more lanes than the board has. Without one, `tileSizeOf` (`src/app/widgets/tile.ts`, in the contracts) takes the widest of what it draws: `l` for a table, gantt, document, form, settings or message; `m` for a chart, entries, a timeline, tiles, steps, an ask box, 3+ stats, a grid or split of cards; `full` for a choice that steers the screen; else `s`. Screens set `size` explicitly.
- **No lane left empty beside a tile:** a tile takes the lanes beside it that are free at its top when the next tile couldn't use them (it needs more lanes than there are). All-`m` tiles on 3 lanes become whole rows, an `s` before an `l` takes the row, an `s` list beside an `m` reading pane stays as it is, and an `m` after a tall `s` still fills the hole under the tile before it. It reads only the tiles before it, never its own height, so a tile that widens (and gets shorter) never changes whether it widens: measuring again settles.
- **Placement:** each tile in order goes to the run of lanes whose top is lowest, the first on a tie; heights are the tiles' own, in 4px rows with the 16px gap. So the layout is a pure function of the tiles, their sizes and heights; tiles never overlap; and when the board resizes, they reflow by the same rule and slide there on M3's spatial spring (at once with Reduce motion). The lane count comes from the board's width, never read back from the grid.
- **One widget, one tile, one card about one thing.** A widget that would draw several cards is several widgets on the same source (`from<T>(source)`: identical requests go out once). Order them so rows fill on a 2- and 3-lane board (`l, s`, `m, s`, `s, s, s`). `grid` and `split` widgets are flattened into tiles (a split's main ones `l`, its side ones `s`, unless they say).
- A widget hidden for the user, or by `hidden` once its data is in, takes no tile.

**A widget** is a design-system block plus where its data comes from. It loads on its own and shows a skeleton until the data arrives.

- **Sources:** `{ endpoint }` is a GET data endpoint; `{ find }` and `{ count }` are collection queries; `{ doc: true }` is the document of an edit tab; `{ global }` is a global; `{ all }` is several at once.
  - Strings may hold `$doc.id`, `$user.id`, `$user.role` and `$param.<name>`.
  - Identical requests on one screen go out once, so several cards can share one endpoint.
  - A refused source (403) hides its widget, or shows its `denied` text.
- **Drawing:** `render(data, scope)` turns data into blocks (`src/app/widgets/schema.ts`). The blocks are entries, card, heading (a subheading inside a card), grid, split, stats, table, list, details, gauges, steps, chart, alert, empty, tags, actions, choice, timeline, form, attach, settings, tiles, gantt, message, document (a printable document, `ui-document`), ask (questions answered from the records, `ui-ask`) and custom (one of the design system's AI assists, `AssistElement`; build it with `assist(element, key, props)`).
- **The design decisions live in the blocks, not in the screens.** A screen says what to show; the renderers decide how it looks, so a project can't get the hierarchy wrong:
  - **A set of like things is `entries`** (requests, next steps, deliveries): each `Entry` gives its parts (heading, `meta`, `status`, `tags`, `summary`, `text`, `facts`, `people`, `notes`, `notice`, `actions`) and `src/app/widgets/blocks/entries.ts` draws them the same way everywhere. Don't build these from `card` + `text` + `tags` + `actions`. A titled widget whose content is `entries` is drawn as a section (its heading, count and `subhead` over the entries' own cards; `skeleton: "entries"` loads in that shape); with no items it is one quiet line (`empty`).
  - **No cards in cards:** a `card` block drawn inside a card (a titled widget, another card) becomes a filled panel; `entries` inside a card become rows between dividers.
  - **Actions** say what they are, not how they look: `main: true` marks the one primary action (M3: "a single prominent button for the primary action"); a link (`href` only) is drawn as a text button, anything else tonal; `tone: "error"` is destructive and can't be `main` (HIG Buttons; the `Emphasis` type forbids it). `actions` blocks and entries go through `actionBar` (`src/app/widgets/blocks.ts`): links first (past two, the rest in "More"), the main action last, one main at most.
  - **Entries can ask for a file:** `Entry.attach` is an `attach` block's dialog next to the actions (proof of delivery).
  - **Stats** of 2 to 6 sit in balanced rows (`ui-grid balance`, by the grid's own width): all in one row, or even rows, never one left over.
  - **Supporting text** is `note(text)` from the contracts, not a local helper. A `text` block has no size: body text, or `muted` (a note). Subheadings are `heading` blocks, never styled text.
  - **Grids** choose their column width from what's in them (wide for charts, tables, lists, cards, entries; narrow otherwise); cards have no `variant`.
- **The contract types forbid what the design doesn't allow:** icons are `IconName` (`src/components/primitives/media/icon-names.ts`, the list `icon.ts` must cover); stat tones are only `success`, `warning`, `error`; a `Cell` is text, a tag (`tag: true`) or a switch, never a mix; a `Widget` is exactly one kind (`render`, `records`, `counts`, `fields`, `grid` or `split`). Widgets sharing one source use `from<Data>(source)`: `const on = from<Cash>({ endpoint: "/cash" })`, then `on({ title, render })`.
- **Links** to the dashboard's pages come from `links()` (`src/app/widgets/links.ts`, in the contracts): `doc(collection, id, tab?)`, `list(collection, filter?)`, `create(collection)`, `global(slug)`, `view(path, query?)`. A project narrows them to its own names (`links<CollectionSlug, GlobalSlug, ViewPath>()`), so a wrong slug doesn't compile; the `no-raw-hrefs` lint rule reports `/collections/…` and `/globals/…` strings built by hand in `src/`; `screenDesignProblems` reports links that lead nowhere (a missing collection, document, edit tab, global or view).
- **Design rules that need data** (`src/app/widgets/design-check.ts`, `designProblems`, pure and in the contracts): button labels of more than four words (M3 Buttons: "ideally 1–3 words"), info alerts with nothing to do (HIG Alerts: make it a `note()`), headings past about two lines, more than six stats, a fact or note said twice in one entry, empty cards, cards three levels deep. `saastemlycrm-design-system/testing` exports `screenDesignProblems({ config, backend, users, password })`, which draws every screen in the config as each user, from any backend that serves Payload's REST API (`ScreenBackend`: `call` and `login`), and runs them; a project calls it in one test (Golden Sea: `tests/design.test.ts`). Each limit cites Material 3 or Apple's HIG; ground new ones the same way (local copies: `material-web/.m3-specs`, `material-web/.apple-specs`).
- **Master–detail:** a list item with `select: { param, value }` sets a screen parameter when clicked and shows selected; detail widgets read it through `$param` (the inbox: the message list sets `?message=`, the reading pane loads `/inbox/message?id=$param.message`).
- **Optional parts of a widget:**
  - `title` makes it a card; `head(data)` gives the card's count, tags and actions.
  - `visible(scope)` shows it by role; `hidden(data)` hides it when there's nothing to show.
  - `size` is its tile's size on the board (see "A screen is a board of tiles").
  - `grid` and `split` group child widgets; the board flattens them into tiles.
- **No-code data widgets:** `records` (a collection as a table or list: `columns` are field names), `counts` (documents per select value, or per `where`, each linking to the filtered list) and `fields` (the document's own fields). Labels, formats, links and tag tones come from the field config.
- **`render`, `head`, `visible` and `hidden` are pure.** Widget files import only types, `src/app/widgets/schema.ts`, `src/app/widgets/widget.ts` and pure helpers in `golden-sea-payload-config`.
- **Actions are data:** `{ label, call: { path, body }, confirm, fields, prefill, extract, done, reply, assist, print }`. `prefill` fills a field from the server when another changes (an AI-drafted handover note for the person picked); `extract` fills the fields from pasted text or a photo on the device; `reply` shows the endpoint's `message` and goes to its `href`. The host asks, calls, shows `done` (or the endpoint's `message` with `reply`) in the snackbar, and reloads every widget. A `choice` block sets a URL parameter that sources read through `$param`.
- **Business logic** stays in `golden-sea-payload-config/src/endpoints`. GET endpoints return data for widgets; POST endpoints do the work and check access as the signed-in user. `forward` / `via` (`golden-sea-payload-config/src/endpoints/forward.ts`, `via.ts`) run an existing endpoint as the same request.
- **New block types:** a generic need is a new block: its type goes in `ViewBlocks` in `src/app/widgets/schema.ts` (pure, so the config can use it), and its renderer in `src/app/widgets/blocks/<type>.ts` with `defineBlock`. It holds no project words.
- **No project elements.** Something no block can draw becomes a generic block or a design-system component (composed), never a custom element in `golden-sea-payload-config`. State a screen needs between steps (a drafted RFQ plan) lives on the server, read by widgets like any other data.

**Lint rules.** `lint/index.js` (exported as `saastemlycrm-design-system/lint`) is an oxlint JS plugin named `saastemly`. A project registers it under `lint.jsPlugins` and spreads its `recommended` rules into `lint.rules`, so the editor and `vp check` report these rules. Tests: `tests/lint.test.ts`.

- `prefer-entries`: a grid of cards mapped from a list. Use `block("entries", { items })`.
- `no-local-block-helpers`: a top-level helper that only wraps one `block(...)` call. Use `note(text)` or the block.
- `widgets-are-pure`: in `widgets/`, imports other than the contracts, `/payload`, types and relative files (option `allow`), and `fetch`, `Date.now`, `new Date()`, `Math.random` or browser globals.
- `endpoints-return-data`: in `endpoints/`, importing or calling `block`, `note`, `widget` or `widgets`.
- `no-raw-hrefs`: in `src/`, a `/collections/…` or `/globals/…` string or template. Use the project's `links()` helpers.
- `sentence-case-titles` (warning): a Title Case `title`, `heading` or `label` in a block or widget, or a `subhead`. Option `properNouns`.
- `max-blocks` (warning): a widget `render` returning more than 6 blocks (option `max`). Split the widget or use `entries` or `details`.
- `no-restricted-imports` (oxlint's own): the project imports only `/contracts` and `/payload` of this package, and no Lit.

**The dashboard's own content is data**, editable under Configuration (`golden-sea-payload-config/src/globals/dashboard.ts`, seeded from `golden-sea-payload-config/src/seed`):

- the `branding` global: name, icon, login line, footer line, background photos and credit (read before sign-in);
- the `assistant` global: the helper's name, what the business is (the AI prompts read both, `src/agent/identity.ts`), the question endpoint, what each role does and its starter questions (`roleNotes[].suggestions`; `suggestions` for other roles), and how the helper reads requests: `mainRecord` (the collection "status of …" looks in first), `recordPattern` (what record numbers look like, a regex source), `businessKeywords` (words that send a message to `ask_records`) and `examples` (`{ question, kind, argument }` per simple tool, the small model's brief). All optional: without them the helper uses neutral defaults;
- the `guide-topics` collection: the platform guide the helper quotes;
- the `tours` collection: guided tours (steps can sign in as a user, go to a page, click, spotlight).

`src/app/site.ts` loads them. Two structural settings stay in the config's `admin.custom`: `nav.groups` (the order and icons of `admin.group`s) and `aside` (the side panel's counters: `counts` widgets with `visible` by role, `golden-sea-payload-config/src/widgets/aside.ts`). `search.synonyms` adds the business's own groups of words that mean the same to the command palette's generic thesaurus (`src/app/command-search.ts`). Notification colours are `custom.tones` on the `notifications.kind` field. Seed globals, and seed fields added to existing globals, are written into existing browsers' data (without overwriting what people set).

**Collection pages** take their look from the config:

- A select field's `custom: tones({ value: tone })` colours its tags everywhere.
- A collection's `custom` (`CollectionSettings` in `src/contracts/config.ts`) sets:
  - `list.board`: a select field, which adds a Board layout with one column per option.
  - `list.cardFields`: the fields cards and board items show.
  - `edit.steps`: a select field shown as steps above the form, with `skip` for values that aren't steps.
  - `edit.before`: widgets about the document, drawn above the form.
- Payload's `admin.components.beforeList` / `afterList` take widgets: `widgets({ widgets: [{ counts: { collection, field } }] })` gives counts per value, each linking to the filtered list.
- Without settings, everything falls back to the generated defaults, and the home page lists every screen and collection by group.

# Mock backend (Payload-compatible, in the browser)

Mock apps get a real-feeling backend with nothing deployed: a Service Worker serves Payload's REST API from IndexedDB.

- **Data model**: `golden-sea-payload-config/src/config.ts` and `golden-sea-payload-config/src/collections/*.ts`, written with Payload's own types (`CollectionConfig`, `GlobalConfig`, `Endpoint`). Hooks, access control, validation, defaults, `admin.*` options and custom endpoints work like in Payload, so these files can be copied into a real `payload.config.ts` later. (`admin` there is Payload's config key and configures the dashboard; in our own code "admin" is never a page, component or route — it can only be a role.)
- **API**: `fetch("/api/<collection>?where[...]&depth=1")`, `/api/<collection>/<id>`, `/api/globals/<slug>`, `/api/<auth-collection>/login|logout|me`, custom endpoints. Same routes, query syntax and response shapes as Payload. Pages use `api` from `src/api/client.ts`, which waits until the backend is ready (`setBackendReady`, handed over by `startDashboard`).
- **Dashboard**: the site root (`/`, `/collections/<slug>/<id>`, `/globals/<slug>`, `/account`), generated from the config and built from `ui-*` components (`src/app`, `ui-doc-form`). Seeded users log in with `demo1234`.
- **Seed data**: `golden-sea-payload-config/src/seed/<collection>.json` and `golden-sea-payload-config/src/seed/globals/<slug>.json`, loaded on first run. Give documents an `id` to reference them from relationships. Local edits stay in the browser; `/api/_mock/export|import|reset` (no dashboard page) snapshot them or reset to the seed.
- **Not emulated**: drafts/versions, localization, `richText` (edited as plain text), querying through relationships (`author.name`), login with username, email flows (verify/forgot password), GraphQL. Default access is Payload's: logged-in users only, unless a collection says otherwise.
- **Tests**: `mock-runner/tests/rest.test.ts` exercises the engine's REST API in Node against a small fixture project; a project tests its own endpoints and widgets with `testBackend` from `mock-runner/testing` and its screens with `screenDesignProblems` from `./testing` (Golden Sea: `golden-sea-payload-config/tests`).
- **Demo screens** are Payload custom views made of widgets (see "The project is golden-sea-payload-config" above): root views in `config.admin.components.views`, collection tabs in `admin.components.views.edit` (the case workspace, the quotation preview), the home page in `admin.components.views.dashboard`. Their data logic is in custom endpoints (`golden-sea-payload-config/src/endpoints/<area>.ts`); the widgets in `golden-sea-payload-config/src/widgets` draw it. The demo is set on Tue 17 Nov 2026 09:30 (`DEMO_NOW` in `golden-sea-payload-config/src/endpoints/home.ts`).
- **Works offline**: the same Service Worker precaches the build for offline use: `mock-runner/plugins/mock-backend.ts` writes the list of built files (`__PRECACHE__`, versioned by their hash) into `cms-sw.js`; `mock-runner/src/mock/sw.ts` caches them on install (full-size background photos just after), serves them cache-first, and drops old caches on the next deploy. Dev has no precache.
- **AI agents (WebMCP)**: the dashboard describes itself to agents as tools — `src/app/agent-tools.ts`, registered through `src/agent/webmcp.ts` (`document.modelContext.registerTool`, or `navigator.modelContext` in older Chrome; also `agentTools()` / `callAgentTool()` for an in-page assistant). Tools are built on the config, the REST API (as the signed-in user) and the stores — never the DOM — and are re-registered when the user changes. `get_screen` describes a custom screen by loading its widgets' sources (each widget's title with the data it draws). The simple tools read screens as text instead: each widget's `render` output through `blocksText` (`src/app/widgets/text.ts`: stats → "label: value", lists and tables → their first entries, muted text and controls left out), so `my_day` is the home page (`admin.components.views.dashboard`; else the side panel's counters) and `record_status` is a record's list columns plus its `custom.edit.before` widgets and edit tabs, read until a budget. Records are found by their `useAsTitle` and the collection's `admin.listSearchableFields`. No tool names a collection, field or endpoint of a project; a new action the UI offers gets a tool (mark read-only ones `readOnlyHint`, ones that change data `consequentialHint`).
- **AI primitives** (`src/components/primitives/ai`, after shadcn's AI Elements): `ui-message-scroller` (thread that follows the reply, "Jump to latest", `empty` welcome), `ui-message` (person / assistant turn; copy, rate, retry, edit), `ui-markdown` (formatted replies, built as templates — never raw HTML), `ui-trace` + `ui-trace-line` (thinking and tool steps; running / done / error / denied / waiting, details on open), `ui-confirmation` (Allow / Don't before an action), `ui-suggestions`, `ui-sources`, `ui-prompt-input` (grows; Enter sends, Shift+Enter new line; Send ↔ Stop); `ui-model-selector` is composed (`src/components/composed/ai`). Running text uses the `shimmer` utility (src/styles/theme.css). Any agent UI is built from these. **On-device assists** (composed, `src/components/composed/ai/assist.ts`; Chrome's built-in task APIs, `src/agent/built-in-ai.ts` (pages may call it directly, e.g. to sort or search); each shows only where the browser supports it, downloads start on a click, auto features run only when the model is already there): `ui-ai-language` (language badge), `ui-ai-text` (message text with Translate / Show original and Catch me up), `ui-ai-summary` (key points on a click, or `auto` one-line `tldr` / `headline`), `ui-ai-tools` (under a text field: Draft with AI from a `brief` + `context`, More formal, Friendlier, Firmer, Shorter, Proofread, Translate, Undo — results go into the field via `ui-change`), `ui-ai-classify` (suggested category, `pickable` to confirm), `ui-ai-check` (yes / no checks shown as things to look at — offers against the request, a PO against its quotation), `ui-ai-read-file` (reads a photo or voice note the person picks; Prompt API multimodal input; `pickable`), `ui-ai-extract` (fills named fields from pasted text, a photo or a recording; `pickable` → "Use these"), `ui-ai-flag` (asks one yes / no question on its own and warns only on yes — bank-detail changes, auto-replies, can't-supply), `ui-ai-replies` (three short replies, copied on a click), `ui-ai-dictate` (speak instead of typing), `ui-speak` (read aloud with the browser's voice). Classification and checks use the Decisions API (`DecisionModel`, with confidences) when the browser has it, else the Prompt API; Prompt API sessions ask for `samplingMode: "most-predictable"`. Used in the inbox, supplier RFQ preview, case timeline and handover, approvals, collection reminders and quotation notes.
- **The helper (bottom right)**, named by the `assistant` global: `<dashboard-agent>` (`src/app/agent.ts`, in `ui-fab panel`) chats with an OpenAI Codex model through the Responses API (`src/agent/codex.ts`), which works the app only through the WebMCP tools above; tools marked `consequentialHint` wait for the person's Allow. The key is a `<meta name="openai-api-key">` in `index.html`, empty in the repository: a developer fills it in locally and never commits or deploys it (the build copies index.html into docs/). Models: the person picks Luna, Terra, Sol or Astra (`CODEX_MODELS`, sent as the model id; default from `<meta name="openai-model">`). Nothing is checked before sending: a missing or wrong key shows OpenAI's own error in the chat. **Saastama-Micro-3.5** (id `aibrowser`, the default model; setup steps on the login page) runs on the browser's on-device model instead (Chrome's Prompt API, `src/agent/browser-model.ts`): no key, nothing leaves the machine; it uses the Prompt API's native tool calling where the browser has it (tools passed to `create()`, `tool-call` replies answered with `LanguageModelToolSuccess`), else each step returns JSON (`responseConstraint`) naming a tool or the answer; sessions ask for `samplingMode: "most-predictable"`, and the brief and tool results shrink to fit the device's context. Small models get a small, clear job: only the tools marked `simple` (`what_is_on_screen`, `open_page`, `my_day`, `record_status`, `find`, `ask_records`, `platform_guide` — one or two plain arguments, a few lines of text back; the platform guide is the `guide-topics` collection and the role notes are on the `assistant` global; prompts name the business through `src/agent/identity.ts`), a short brief with an example per kind of request (`browserInstructions()` in codex.ts, from the `assistant` global's `examples`, else neutral ones), and every message starts with who is asking, their role and their page (`provideAgentContext`, set by `<dashboard-agent>`'s app). "go to / open / take me to …" opens the page without the model, and common requests (status of a record, what's waiting for me, what's on screen, find …, how do I …, business questions) go straight to their simple tool, whose text is the answer (`routes()` in codex.ts, built at call time with the `assistant` global's `recordPattern` and `businessKeywords`). Starter suggestions in the helper come from the same global. For the rest, an answer given without consulting any tool, or the same tool call repeated, is replaced by `ask_records`'s answer: a small model left alone makes things up. A new screen or workflow that people will ask about gets a line in the guide or a simple tool. **Without Chrome's flags** (`src/agent/ai-polyfill.ts`): Google's polyfills (`prompt-api-polyfill`, `built-in-ai-task-apis-polyfills`, loaded from jsDelivr at run time — not bundled, not precached) provide `LanguageModel` and the task APIs on an open model that runs in the page (Transformers.js, Gemma 3 1B, ~760 MB, WebGPU when available). Opt-in ("Download the AI model" in the helper and on the login page), remembered per browser (`saastemly:local-ai`), never loaded where Chrome's own works; an OpenAI key in index.html makes it use OpenAI instead. Not polyfilled: Decisions API (checks fall back to the Prompt API), Proofreader, native tool calling (JSON steps), photos / voice notes (hidden: the model is text-only). It is warmed up ahead of the first message: the session is prepared in the background when the page loads (or the model is picked), the one-time download starts at the first click or key press (Chrome requires a user action), and each conversation is a `clone()` of that prepared session.
- **Guided tours**: the `tours` collection (`golden-sea-payload-config/src/seed/tours.json`) (steps can switch user with `as`, navigate with `go`, click a button, and spotlight a card by its heading text), played by `<dashboard-tour>` with `<ui-coachmark>`; started from the side panel's Tours section.

## Motion (Material Design 3)

All motion is M3's, from the generated tokens in `src/styles/motion.css` (`vpx vite/motion.ts`); `tests/motion-usage.test.ts` rejects raw durations, delays and curves (`duration-200`, `ease-in-out`, `.2s`, `cubic-bezier(…)`) in primitives and stylesheets.

- **State changes use springs.** This covers hover, press, checked, open/closed, a chevron turning and a section resizing. Colour, opacity and shadow go on `effects`; position, size, rotation and shape go on `spatial`. Use `-fast` for small controls, the default for most things, and `-slow` for full-screen changes. Give each property its own spring, e.g. `[transition:width_var(--duration-spatial-fast)_var(--ease-spatial-fast),background-color_var(--duration-effects-fast)_var(--ease-effects-fast)]`, and chain the steps of a sequence with `delay-(--settle-…)`.
- **Transitions use M3's easing and duration tokens, with no bounce.** A transition is a page changing or a component entering or leaving. Enter on `ease-emphasized-decelerate`. Exit on `ease-emphasized-accelerate`, and quicker. Use `emphasized` for large changes; for example, a FAB opening into a panel is `medium4` on `emphasized`. Use `standard` for small utility motion. Components that appear within the screen (menus, dropdowns, toasts) grow along one axis, away from the edge they're attached to. They don't scale up uniformly. A dialog's fade stays short.
- **daisyUI's own transitions** are retimed in `src/styles/daisy-motion.css`. A primitive's own `transition-*` classes still win over that file.
- **Pages:** `<dashboard-app>` picks the M3 pattern for each navigation and calls `<ui-app-shell>`'s `pageTransition()` (played by `<ui-frame-main>`). The navigation's destinations are `top-level` (a fade). Into a record is `forward` (a slide with a fade), back to its list is `backward`, and another tab of the same record is `lateral` (a slide without a fade).
- **Reduce motion:** the spatial tokens are 0, so nothing slides or scales; fades remain. Add `motion-reduce:` fallbacks for keyframe animations.

## Data tables (collection lists)

Collection lists (`src/app/list-view.ts`) are built on Payload's REST query parameters, which the mock backend implements. `src/payload/select.ts` handles `select`, `populate` and `joins`; `locale` and `fallback-locale` are accepted but do nothing, because no field is localized.

- `<ui-table>`:
  - **Sorting:** columns marked `sortable` sort from their header; `sort` holds a Payload sort string and `ui-sort` reports changes. Shift-click sorts by several columns.
  - **Columns:** `align: "end"` right-aligns numbers in tabular figures; `hiddenColumns` hides columns by key.
  - **States:** `loading` dims the current rows, or shows skeleton rows when there are none; `empty` is what shows when there are no rows.
  - **Arranging columns** (opt in with `reorderable` / `resizable`; `columnOrder`, `columnWidths`, `ui-columns` with `{ order, widths }`):
    - Move: drag a header (a mouse moves it after 6px sideways; touch needs a 350ms long press so swipes still scroll). The header lifts to elevation +2 and follows the pointer, the column's cells are tinted, and a primary line down the table shows where it lands. Escape cancels; the click that ends a drag never sorts. Keyboard: Ctrl + Shift + ← / → on a sortable header. A `fixed` column (the record link) stays first, because the whole-row link comes from the first cell.
    - Resize: drag the line on a header's end edge (64–800px), or focus it and use ← / → (Shift: 48px steps). Double-click or Enter fits the column to its content again. A sized column's text ends in "…".
    - Order is applied leniently (`src/components/base/columns.ts`): unknown keys are dropped, and a column added later keeps its place after the column it followed. Header cells are `position: relative` from the base layer (`daisy-m3.css`), so daisyUI's pinned columns stay sticky.
  - **`<ui-column-picker>`** lists the columns in the table's order, with earlier / later arrows (the keyboard and screen-reader way to reorder). Reset restores the default columns and order, and the list page also clears the widths.
- `<ui-filter-builder>`: its fields are typed text, number, date, select (also used for relationships) or boolean. It edits conditions as chips and emits a Payload `where`. The conversion lives in `src/components/base/filter-query.ts`, so pages can build the same `where` from saved conditions.
- `<ui-column-picker>`: the "Columns" checklist, with Reset; it pairs with `hiddenColumns`.
- **List page behaviour:**
  - The table's state lives in the URL (`q`, `sort`, `page`, `limit`, `filters`, `match`, `view`).
  - Table or cards: the cards view shows each record as a card (title, then the visible columns as label and value), with a Sort select in place of the headers. The choice is saved in `preferences.listView`; a `view` in the URL wins.
  - The columns someone picks are saved in `preferences.listColumns`.
  - A select with `custom: tones({ Overdue: "error", … })` shows as a tag in that tone in the table, on cards, on the board and in summaries. Without tones, a single select named `status`, `stage` or `…Status` gets its tone from its words (`statusColor()` in `src/app/shared.ts`): ended grey, problems red, waiting amber, in progress blue, done green. The words are generic; a project adds its own with `admin.custom.statusWords` (Golden Sea's "on board", "customs").
  - Requests ask only for the visible fields (`select`), related titles (`populate`) and join counts (`joins[...][count]`).

## Generated forms (`<ui-doc-form>`, `src/components/composed/forms/doc-form.ts`)

The forms render every Payload field type (payloadcms.com/docs/fields/overview) and follow the Admin Panel's behaviour:

- **Choices:** select, relationship and upload fields are a `<ui-combobox>`, a searchable picker. It uses chips for `hasMany`, groups polymorphic `relationTo` by collection, and offers an ✕ (`admin.isClearable`; on by default for optional fields). Text and number fields with `hasMany` are combobox chips you type into.
- **Relationships:** the hint line links to "Open" the related document and to create a "+ New" one (`admin.allowEdit` / `admin.allowCreate`). Uploads preview the picked image.
- **Dates:** `admin.date.pickerAppearance` (`dayOnly`, `dayAndTime`, `timeOnly`, `monthOnly`) picks the input, bounded by `minDate` / `maxDate`.
- **Numbers and text:** numbers take `admin.step`. A textarea takes `admin.rows`, and shows a counter with `maxLength`. Code and JSON fields are monospaced. JSON is checked as it's typed and kept as typed until it parses.
- **Arrays and blocks:**
  - Rows collapse (`admin.initCollapsed`), with Collapse all / Expand all.
  - Each row is labelled with its first value ("Line 03 · Lincoln Omnia 46").
  - A ⋯ menu moves, duplicates (below the original) and removes rows (`admin.isSortable`, `minRows` / `maxRows`).
  - Blocks are added from a menu and take an optional block name.
- **Widths:** `admin.width` (`"50%"`, `"20rem"`) sets a field's share of its row (`<ui-box basis grow>` in a wrapping `<ui-flex>`). Fields without a width share what's left equally. A field never gets narrower than 12rem, so rows wrap on a narrow panel. A field with a width outside a row keeps that width.
- **`filterOptions`:**
  - Relationship and upload pickers offer only the related documents matching the `where`, or the `where` a function returns from `{ data, siblingData, id, relationTo, user, req }`.
  - Selects offer the options their function returns.
  - Blocks offer only the slugs their function allows.
  - The current value always stays listed.
  - The mock API enforces the same rules on save (`mock-runner/src/mock/runtime/fields.ts`). For example, Payload's error "This relationship field has the following invalid selections: S1".
- **Layout fields:** a collapsible honours `admin.initCollapsed`. A group with `admin.hideGutter` has no box. Tabs show how many errors they hold.
- **Join fields:** shown as a table of the documents pointing at this one (`admin.defaultColumns`, with a count and "+ Create new"). The page fetches them with `joins`.
- **Errors:** a field with an error turns red, with its message in place. The edit page lists the fields that need attention at the top.
- **Edit page:** Save stays disabled until something changes. Ctrl/⌘ + S saves. Leaving with unsaved changes asks first.

`vite/layer-variants.ts` moves only top-level daisyUI base rules (such as `.input`) to the `components` layer. A rule nested in another (daisyUI's `.mockup-browser-toolbar { .input {…} }`) stays where it is; moving it once gave every input on the page a search icon.

## App frame

- **`<ui-app-shell>` (composed, `src/components/composed/layout/app-shell.ts`) holds the frame's logic:**
  - whether a column pushes the main panel or opens as a sheet over it, from the room it needs (a column pushes only when the main panel keeps `--main-comfort`, 320px, beside it, so a pushed navigation never crushes the page; the main panel's content is never narrower than `--main-min`, 258px in `src/styles/theme.css`: what a 320px phone leaves it after a 48px rail, the panel's 2×2px border and its scrollbar; the shell's room checks add the rails, the frame's edges and gaps, and the panel's measured border and scrollbar to it);
  - **the rail's section icons open the navigation**: a section's icon (Commercial, Finance…) opens the navigation, pushing or as a sheet, with that section expanded (`ui-menu`'s `openGroup(path)`, which also reopens a section closed by hand), instead of going to the section's first page; Dashboard and other single pages stay links (`_rail` / `_openSection` in `src/app/app.ts`);
  - **compact**, when both rails would leave the main panel's content under `--main-comfort` (320px in `src/styles/theme.css`; below a window of about 456px): the page gets the second rail's room back, and compact keeps `--main-min` down to a 320px phone: the frame goes full screen. The side panel's rail joins the navigation's in one rail that shows either at a time; the button at its top, where the navigation's toggle was, switches between them (the `swap` icon, sideways arrows, so it doesn't read as a menu; the groups slide sideways as on one strip, the navigation's to the start and the side panel's to the end, on M3's spatial and effects springs; `railView`, `ui-rail-switch`), so neither group moves the other's icons and opening a sheet moves nothing (the shell hands the same `<ui-menu>` to whichever column shows it, by `railNodes` / `extraRailNodes`, since a light-DOM slot is read once), the side panel takes no room (`merged`) and opens only as a sheet, from the start side where its rail now is: it grows out of the rail like the navigation's sheet and folds back into it on closing (the header lifts the brand and search over it), the navigation opens from its section icons, the frame's edges and gaps are 0 (`<ui-frame compact>`), and the main panel runs to the screen's end and bottom edges with only its corner by the header and rail round (`<ui-frame-main compact>`). At 390px the main panel gets 339px instead of about 272px; at 320px (the smallest supported screen) every screen, sheet and the search palette fit, the header shows only the brand's mark when it can't hold the name too (a container query on the header), cards pad fluidly (16px on a phone, 24px from about a 600px panel) and tags wrap onto a second line rather than cut their words;
  - closing sheets when you navigate or press Escape;
  - the background scrim, sized so no text over the image fails WCAG AA.
- **The frame primitives draw each state (`src/components/primitives/layout/frame.ts`):**
  - `<ui-frame>`: the background and scrim.
  - `<ui-frame-header>`: the brand, `start`, `search` and `actions`, lifted over sheets.
  - `<ui-frame-body>`.
  - `<ui-frame-column>`: a side column with its toggle, its list and rail stack, its footer and its sheet backdrop.
  - `<ui-frame-main>`: the glass panel and the page footer; it plays the page transitions.
- **Appearance:** the header's theme, colour-scheme and background controls are `<ui-appearance kind="theme|scheme|background">` (composed). The document-level changes and the circular reveal are in `src/components/base/appearance.ts`.

## Colour, type and state roles (Material Design 3, with Apple's guidance)

The roles are in `src/styles/theme.css`, derived from each colour scheme's daisyUI colours. `tests/design-roles.test.ts` rejects raw values in primitives (and the old `size` / `weight` on text in pages). Pick a role by what the thing is, never by how it should look.

- **Ink:**
  - `on-surface` is the main text.
  - `on-surface-variant` is secondary text: supporting lines, captions, header labels and icons. `<ui-text color="muted">` uses it.
  - `on-surface-disabled` (38%) is for disabled content.
  - Never "base-content at 70%".
- **Lines:**
  - `outline` is for boundaries people must find: text fields, selects, checkboxes and radios. It's at least 3:1 against the surface (WCAG 1.4.11). Hovered, fields darken to `on-surface-variant`.
  - `outline-variant` is decorative: dividers, card, table and chip borders.
  - `daisy-m3.css` maps daisyUI's own field and divider lines onto these roles.
- **Surfaces** (separation by tone first, shadows only for what floats):
  - `surface` is the base.
  - `surface-container-lowest` → `-low` (cards, table header bands) → `surface-container` (navigation, grouped sections) → `-high` (dialogs, hovered rows) → `-highest` (filled fields, code).
  - The steps are larger in dark themes.
- **Containers:** `primary-container`, `success-container` and the like are tinted fills, each paired with an `on-*-container` ink. Selected rows, list items, chips and the active navigation item use `primary-container`. The colour schemes' `secondary` is often near-white, so M3's secondary-container isn't used for selection.
- **State layers:**
  - A state layer is a wash of the content's own colour: hover 8%, focus 10%, pressed 10%, dragged 16% (`--state-hover` and the rest).
  - Use the `state-layer` utility on any interactive element; primitives have no hand-made hover fills left, and daisyUI's menu items hover at the same 8%. It's a background-image over the element's own background, applies hover only with a real pointer, focus only for keyboard focus, and nothing when disabled.
  - For a one-off, use the token: `hover:bg-on-surface/(--state-hover)`. Never `hover:bg-primary/12`.
- **Target sizes:** every control is easy to hit whatever it looks like. `touch-target` adds an invisible hit area, centred on the control: at least 48px on touch screens (M3) and 24px with a mouse (WCAG 2.5.8). The control keeps its visual size, so dense layouts stay dense.
  - It's on every `.btn`, the small icon controls (chip remove, combobox clear, sort headers, trace and source rows) and labels that wrap a checkbox, radio or toggle.
  - The rule: anything with `state-layer` also has `touch-target` (`tests/design-roles.test.ts`).
  - It uses `::before`; the table's resize handle draws with `::before`, so it widens itself on touch instead.
- **Density (opt-in):** `<ui-table density="0|-1|-2">` makes each row 4dp shorter per step, with text unchanged (M3 density; `size` scales the text instead). Collection tables offer it as "Row height" (Default, Compact, Dense) in the Columns menu, saved in `preferences.listDensity`.
- **Prominence:** one main action per screen, two at most (Apple HIG; M3's filled button is for the most important action). Every other action is tonal (`variant="soft"`), outlined or plain, and per-item actions in lists are never filled. The screen audit (`?audit`, or "Check colour contrast") counts the visible filled buttons per surface: the page, and each dialog, sheet or popover separately (`src/components/base/prominence.ts`). It outlines the extras in warning colour.
- **Default scheme:** daisyUI's own themes get two fills darkened for AA in `daisy-m3.css` (dark primary, secondary). `tests/contrast.test.ts` checks the default light and dark themes with those overrides.
- **Type:** M3's 15 roles. Text is set by role (`<ui-text variant="body-sm">`, `<ui-heading variant="title-lg">`), never by a raw size. Each role brings its size, line height, weight and tracking:
  - `display-*`: big numerals.
  - `headline-*`: page and dialog titles. `<ui-heading variant="page">` is the fluid page title.
  - `title-*`: section, card and item titles.
  - `body-*`: running text, table cells and descriptions.
  - `label-*`: text inside components, such as tags, counts and metadata.
  - `emphasized` is the same role one weight heavier (unread, selected, the key figure).
  - Sizes and line heights are M3's. Weights and tracking follow Apple's advice for system fonts: titles and headlines semibold, labels medium, tracking only on small labels.
  - Components whose `size` prop is itself a display scale (swap, countdown, text-rotate, diff, avatar initials) are the listed exceptions.

## Elevation, shape and spacing (Material Design 3)

The tokens are in `src/styles/theme.css`. `tests/m3-tokens.test.ts` rejects anything off the scales in a primitive's classes.

- **Spacing:** M3's dp scale, on a 4px Tailwind unit. The steps are `0.5` (2), `1` (4), `1.5` (6), `2` (8), `2.5` (10), `3` (12), `3.5` (14), `4` (16), `5` (20), `6` (24), `8` (32), `9` (36), `10` (40), `12` (48), `14` (56), `16` (64) and `18` (72). It's in px, so spacing stays the same when text is scaled up. Arbitrary values use the `--space-*` tokens (M3's names, e.g. `--space-300` is 24dp) or a fluid `clamp()`.
- **Shape:** M3's corner scale: `rounded-none`, `-xs` (4), `-sm` (8), `-md` (12), `-lg` (16), `-lg-increased` (20), `-xl` (28), `-xl-increased` (32), `-2xl` (48) and `-full`. The colour scheme's role radii (`rounded-field`, `-box`, `-selector`) are the scheme's choices.
- **Nested corners:** use `rounded-inner` (M3's optical roundness: inner radius = outer radius − padding). A container sets `--outer-radius` and `--outer-padding`. Dropdown panels, combobox lists and menu items already do.
- **Elevation:** `shadow-elevation-1` … `-5` (M3's levels +1 … +5), or `shadow-none`.
  - At rest, use 0 to +3; +4 and +5 are only for hover and drag. Hovered, a component rises one level.
  - Mapping: cards +1 (rising to +2 on hover), menus and popovers +2 (the glass panels' default), dialogs, FABs, snackbars, date pickers and the jump-to-latest button +3, sheets +1 over a scrim.
  - Separation comes from surface tones first. daisyUI's `--depth` is off, so buttons and fields rest at 0.
- **Scrims:** the scrim role at 32%: `bg-scrim/32` (sheet backdrops), dialogs (`src/styles/daisy-m3.css`), and `scrim-cutout` for a spotlight.
- **Shape morph:** M3's shape library has no web version, so morphs are border-radius ones on the expressive springs.
  - Pressed, a button squares its corners (to at most `sm`; a round icon button to `md`) and springs back. A selected round button stays at `md`.
  - `<ui-loading variant="morph">` is M3 Expressive's loading indicator, for page-level waits.
