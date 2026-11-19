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
- **Primitives use theme colours only** (`primary`, `base-200`…), never the Tailwind palette (`red-400`) or literal colours.
- **Fluid before breakpoints**: lay pages out intrinsically — `<ui-grid fit>` (as many columns as fit), `<ui-grid sidebar>`, wrapping `<ui-flex wrap>`, `fill` widths, and fluid sizes (`padding-x="fluid"`, heading `size="page"`, `clamp()` + container units of the main panel, which is an `@container`). The dashboard uses no screen breakpoints; reach for `sm:`/`md:` tokens only when no intrinsic pattern works.
- **Glass is for the floating layer only**: sheets, dialogs, menus and other controls that float above content use `liquid-glass` (or `liquid-glass-clear` for small controls), defined in `src/styles/theme.css` (tint, light blur, refraction via the `#liquid-glass-refraction` SVG filter in `index.html`, rim shine, shadow). Tooltips, toasts, popovers, pickers and the dock already use it through their primitives; `shadow-*` utilities on glass replace only its drop shadow. The main panel is see-through frosted glass (`liquid-glass-surface`) over the background; content surfaces inside it (cards, tables) stay solid, and glass never sits on glass. Over a background image, the app shell picks the lightest scrim (`--app-scrim`) at which `<ui-contrast-audit>` finds no failing text over the image, so the photo shows as much as stays readable. The material already handles light/dark, Reduce transparency, Increase contrast and browsers without `backdrop-filter`. Enforced (`tests/design-roles.test.ts`, "everything that floats is glass"): dropdown panels are always glass and have no solid surface option; every `<select>`'s open list (`::picker(select)`) gets the glass from `daisy-m3.css`, because a utility on `<ui-select>`'s wrapper can't reach it; and any primitive that renders a popover or a `<dialog>` must use the glass.
- **Colour contrast (WCAG AA) is checked**: `tests/contrast.test.ts` checks every colour scheme's ink/fill pairs (the scheme generator, `plugins/schemes.ts`, fixes unreadable `*-content` tokens); on screen, the command palette's **"Check colour contrast"** (or `?audit` in the URL) runs `<ui-contrast-audit>`, which measures every visible text against what's really behind it — glass, tints, and the background image — and outlines failures. Run it in light and dark after visual changes. Rules that keep it green: secondary text is the `on-surface-variant` role (80% of the ink), never fainter; coloured text uses the `*-ink` tokens (`text-success-ink`…, the colour mixed toward the ink), never raw `text-success`; tinted backgrounds take full-strength text.
- **Icons come from the registry only**: `ICONS` / `iconSvg()` / `<ui-icon name>` in `src/components/primitives/media/icon.ts`, filled with `import x from "~icons/<collection>/<name>"` (unplugin-icons, tree-shaken) from line-md (preferred, animated), material-symbols-light, devicon or logos. Nothing else draws an `<svg>` (`tests/icons.test.ts`).
- Missing something? Add a variant (or a new primitive) in `src/components/primitives`, not a workaround in the page.

# Mock backend (Payload-compatible, in the browser)

Mock apps get a real-feeling backend with nothing deployed: a Service Worker serves Payload's REST API from IndexedDB.

- **Data model**: `src/cms/config.ts` and `src/cms/collections/*.ts`, written with Payload's own types (`CollectionConfig`, `GlobalConfig`, `Endpoint`). Hooks, access control, validation, defaults, `admin.*` options and custom endpoints work like in Payload, so these files can be copied into a real `payload.config.ts` later. (`admin` there is Payload's config key and configures the dashboard; in our own code "admin" is never a page, component or route — it can only be a role.)
- **API**: `fetch("/api/<collection>?where[...]&depth=1")`, `/api/<collection>/<id>`, `/api/globals/<slug>`, `/api/<auth-collection>/login|logout|me`, custom endpoints. Same routes, query syntax and response shapes as Payload. From pages, call `startMockBackend()` once (or use `api` from `src/cms/client.ts`, which does it for you).
- **Dashboard**: the site root (`/`, `/collections/<slug>/<id>`, `/globals/<slug>`, `/account`), generated from the config and built from `ui-*` components (`src/pages/dashboard`, `ui-doc-form`). Seeded users log in with `demo1234`.
- **Seed data**: `src/cms/seed/<collection>.json` and `src/cms/seed/globals/<slug>.json`, loaded on first run. Give documents an `id` to reference them from relationships. Local edits stay in the browser; `/api/_mock/export|import|reset` (no dashboard page) snapshot them or reset to the seed.
- **Not emulated**: drafts/versions, localization, `richText` (edited as plain text), querying through relationships (`author.name`), login with username, email flows (verify/forgot password), GraphQL. Default access is Payload's: logged-in users only, unless a collection says otherwise.
- **Tests**: `tests/cms.test.ts` exercises the REST API in Node with an in-memory store.
- **Demo screens** are Payload custom views: root views in `config.admin.components.views` (path, `Component` = a custom element, optional `nav`), collection tabs in `admin.components.views.edit` (the case workspace, the quotation preview). Each element lives in `src/pages/dashboard/views/<name>.ts` (auto-imported) and receives `access`, `user` and, for tabs, `slug`/`docId`. Their server logic is in custom endpoints (`src/cms/endpoints/<area>.ts`). The demo is set on Tue 17 Nov 2026 09:30 (`DEMO_NOW` in `src/cms/endpoints/home.ts`).
- **Works offline**: the same Service Worker precaches the build for offline use: `plugins/mock-backend.ts` writes the list of built files (`__PRECACHE__`, versioned by their hash) into `cms-sw.js`; `src/cms/sw.ts` caches them on install (full-size background photos just after), serves them cache-first, and drops old caches on the next deploy. Dev has no precache.
- **AI agents (WebMCP)**: the dashboard describes itself to agents as tools — `src/pages/dashboard/agent-tools.ts`, registered through `src/agent/webmcp.ts` (`document.modelContext.registerTool`, or `navigator.modelContext` in older Chrome; also `agentTools()` / `callAgentTool()` for an in-page assistant). Tools are built on the config, the REST API (as the signed-in user) and the stores — never the DOM — and are re-registered when the user changes. A new screen adds its data endpoint to `VIEW_DATA` / `TAB_DATA` so `get_screen` can describe it; a new action the UI offers gets a tool (mark read-only ones `readOnlyHint`, ones that change data `consequentialHint`).
- **AI primitives** (`src/components/primitives/ai`, after shadcn's AI Elements): `ui-message-scroller` (thread that follows the reply, "Jump to latest", `empty` welcome), `ui-message` (person / assistant turn; copy, rate, retry, edit), `ui-markdown` (formatted replies, built as templates — never raw HTML), `ui-trace` + `ui-trace-line` (thinking and tool steps; running / done / error / denied / waiting, details on open), `ui-confirmation` (Allow / Don't before an action), `ui-suggestions`, `ui-sources`, `ui-prompt-input` (grows; Enter sends, Shift+Enter new line; Send ↔ Stop); `ui-model-selector` is composed (`src/components/composed/ai`). Running text uses the `shimmer` utility (src/styles/theme.css). Any agent UI is built from these. **On-device assists** (composed, `src/components/composed/ai/assist.ts`; Chrome's built-in task APIs, `src/agent/built-in-ai.ts` (pages may call it directly, e.g. to sort or search); each shows only where the browser supports it, downloads start on a click, auto features run only when the model is already there): `ui-ai-language` (language badge), `ui-ai-text` (message text with Translate / Show original and Catch me up), `ui-ai-summary` (key points on a click, or `auto` one-line `tldr` / `headline`), `ui-ai-tools` (under a text field: Draft with AI from a `brief` + `context`, More formal, Friendlier, Firmer, Shorter, Proofread, Translate, Undo — results go into the field via `ui-change`), `ui-ai-classify` (suggested category, `pickable` to confirm), `ui-ai-check` (yes / no checks shown as things to look at — offers against the request, a PO against its quotation), `ui-ai-read-file` (reads a photo or voice note the person picks; Prompt API multimodal input; `pickable`), `ui-ai-extract` (fills named fields from pasted text, a photo or a recording; `pickable` → "Use these"), `ui-ai-flag` (asks one yes / no question on its own and warns only on yes — bank-detail changes, auto-replies, can't-supply), `ui-ai-replies` (three short replies, copied on a click), `ui-ai-dictate` (speak instead of typing), `ui-speak` (read aloud with the browser's voice). Classification and checks use the Decisions API (`DecisionModel`, with confidences) when the browser has it, else the Prompt API; Prompt API sessions ask for `samplingMode: "most-predictable"`. Used in the inbox, supplier RFQ preview, case timeline and handover, approvals, collection reminders and quotation notes.
- **Golden Sea helper (bottom right)**: `<dashboard-agent>` (`src/pages/dashboard/agent.ts`, in `ui-fab panel`) chats with an OpenAI Codex model through the Responses API (`src/agent/codex.ts`), which works the app only through the WebMCP tools above; tools marked `consequentialHint` wait for the person's Allow. The key is a `<meta name="openai-api-key">` in `index.html`, empty in the repository: a developer fills it in locally and never commits or deploys it (the build copies index.html into docs/). Models: the person picks Luna, Terra, Sol or Astra (`CODEX_MODELS`, sent as the model id; default from `<meta name="openai-model">`). Nothing is checked before sending: a missing or wrong key shows OpenAI's own error in the chat. **Saastama-Micro-3.5** (id `aibrowser`, the default model; setup steps on the login page) runs on the browser's on-device model instead (Chrome's Prompt API, `src/agent/browser-model.ts`): no key, nothing leaves the machine; it uses the Prompt API's native tool calling where the browser has it (tools passed to `create()`, `tool-call` replies answered with `LanguageModelToolSuccess`), else each step returns JSON (`responseConstraint`) naming a tool or the answer; sessions ask for `samplingMode: "most-predictable"`, and the brief and tool results shrink to fit the device's context. Small models get a small, clear job: only the tools marked `simple` (`what_is_on_screen`, `open_page`, `my_day`, `case_status`, `find`, `ask_golden_sea`, `platform_guide` — one or two plain arguments, a few lines of text back; the platform guide and role notes live in agent-tools.ts), a short brief with an example per kind of request (`BROWSER_INSTRUCTIONS` in codex.ts), and every message starts with who is asking, their role and their page (`provideAgentContext`, set by `<dashboard-agent>`'s app). "go to / open / take me to …" opens the page without the model, and common requests (status of a case, what's waiting for me, what's on screen, find …, how do I …, business questions) go straight to their simple tool, whose text is the answer (`ROUTES` in codex.ts). For the rest, an answer given without consulting any tool, or the same tool call repeated, is replaced by `ask_golden_sea`'s answer: a small model left alone makes things up. A new screen or workflow that people will ask about gets a line in the guide or a simple tool. **Without Chrome's flags** (`src/agent/ai-polyfill.ts`): Google's polyfills (`prompt-api-polyfill`, `built-in-ai-task-apis-polyfills`, loaded from jsDelivr at run time — not bundled, not precached) provide `LanguageModel` and the task APIs on an open model that runs in the page (Transformers.js, Gemma 3 1B, ~760 MB, WebGPU when available). Opt-in ("Download the AI model" in the helper and on the login page), remembered per browser (`gs:local-ai`), never loaded where Chrome's own works; an OpenAI key in index.html makes it use OpenAI instead. Not polyfilled: Decisions API (checks fall back to the Prompt API), Proofreader, native tool calling (JSON steps), photos / voice notes (hidden: the model is text-only). It is warmed up ahead of the first message: the session is prepared in the background when the page loads (or the model is picked), the one-time download starts at the first click or key press (Chrome requires a user action), and each conversation is a `clone()` of that prepared session.
- **Guided tours**: `src/pages/dashboard/tours.ts` (steps can switch user with `as`, navigate with `go`, click a button, and spotlight a card by its heading text), played by `<dashboard-tour>` with `<ui-coachmark>`; started from the side panel's Tours section.

## Motion (Material Design 3)

All motion is M3's, from the generated tokens in `src/styles/motion.css` (`vpx plugins/motion.ts`); `tests/motion-usage.test.ts` rejects raw durations, delays and curves (`duration-200`, `ease-in-out`, `.2s`, `cubic-bezier(…)`) in primitives and stylesheets.

- **State changes use springs.** This covers hover, press, checked, open/closed, a chevron turning and a section resizing. Colour, opacity and shadow go on `effects`; position, size, rotation and shape go on `spatial`. Use `-fast` for small controls, the default for most things, and `-slow` for full-screen changes. Give each property its own spring, e.g. `[transition:width_var(--duration-spatial-fast)_var(--ease-spatial-fast),background-color_var(--duration-effects-fast)_var(--ease-effects-fast)]`, and chain the steps of a sequence with `delay-(--settle-…)`.
- **Transitions use M3's easing and duration tokens, with no bounce.** A transition is a page changing or a component entering or leaving. Enter on `ease-emphasized-decelerate`. Exit on `ease-emphasized-accelerate`, and quicker. Use `emphasized` for large changes; for example, a FAB opening into a panel is `medium4` on `emphasized`. Use `standard` for small utility motion. Components that appear within the screen (menus, dropdowns, toasts) grow along one axis, away from the edge they're attached to. They don't scale up uniformly. A dialog's fade stays short.
- **daisyUI's own transitions** are retimed in `src/styles/daisy-motion.css`. A primitive's own `transition-*` classes still win over that file.
- **Pages:** `<dashboard-app>` picks the M3 pattern for each navigation and calls `<ui-app-shell>`'s `pageTransition()` (played by `<ui-frame-main>`). The navigation's destinations are `top-level` (a fade). Into a record is `forward` (a slide with a fade), back to its list is `backward`, and another tab of the same record is `lateral` (a slide without a fade).
- **Reduce motion:** the spatial tokens are 0, so nothing slides or scales; fades remain. Add `motion-reduce:` fallbacks for keyframe animations.

## Data tables (collection lists)

Collection lists (`src/pages/dashboard/list-view.ts`) are built on Payload's REST query parameters, which the mock backend implements. `src/cms/runtime/select.ts` handles `select`, `populate` and `joins`; `locale` and `fallback-locale` are accepted but do nothing, because no field is localized.

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
  - A status or stage (a single select named `status`, `stage` or `…Status`) shows as a soft badge in the table and on cards, coloured by `statusColor()` (`src/pages/dashboard/shared.ts`): problems red, waiting amber, in progress blue, done green, ended or other grey. A new status word that lands in the wrong colour gets added to its pattern there.
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
  - The mock API enforces the same rules on save (`src/cms/runtime/fields.ts`). For example, Payload's error "This relationship field has the following invalid selections: S1".
- **Layout fields:** a collapsible honours `admin.initCollapsed`. A group with `admin.hideGutter` has no box. Tabs show how many errors they hold.
- **Join fields:** shown as a table of the documents pointing at this one (`admin.defaultColumns`, with a count and "+ Create new"). The page fetches them with `joins`.
- **Errors:** a field with an error turns red, with its message in place. The edit page lists the fields that need attention at the top.
- **Edit page:** Save stays disabled until something changes. Ctrl/⌘ + S saves. Leaving with unsaved changes asks first.

`plugins/layer-variants.ts` moves only top-level daisyUI base rules (such as `.input`) to the `components` layer. A rule nested in another (daisyUI's `.mockup-browser-toolbar { .input {…} }`) stays where it is; moving it once gave every input on the page a search icon.

## App frame

- **`<ui-app-shell>` (composed, `src/components/composed/layout/app-shell.ts`) holds the frame's logic:**
  - whether a column pushes the main panel or opens as a sheet over it, from the room it needs (the main panel keeps the width a 320px screen would leave);
  - closing sheets when you navigate or press Escape;
  - the background scrim, sized so no text over the image fails WCAG AA.
- **The frame primitives draw each state (`src/components/primitives/layout/frame.ts`):**
  - `<ui-frame>`: the background and scrim.
  - `<ui-frame-header>`: the brand, `start`, `search` and `actions`, lifted over sheets.
  - `<ui-frame-body>`.
  - `<ui-frame-column>`: a side column with its toggle, its list and rail stack, its footer and its sheet backdrop.
  - `<ui-frame-main>`: the glass panel and the page footer; it plays the page transitions.
- **Appearance:** the header's theme, colour-scheme and background controls are `<ui-appearance kind="theme|scheme|background">` (composed). The document-level changes and the circular reveal are in `src/components/base/appearance.ts`. `<ui-theme-controller>` keeps only daisyUI's pure-CSS modes (toggle, checkbox, swap, radio, buttons, dropdown).

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
