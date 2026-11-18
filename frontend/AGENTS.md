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
- **Pages and composed components** (`src/components/composed`) are assembled from `ui-*` elements only:
  - no `class` / `style`, no DOM styling APIs (`classList`, `.style`, `innerHTML`…), no stylesheets, no `css`/`svg`/`unsafeHTML`;
  - no primitive recipes: import only types (`import type`) and element registrations (`import "…/button.ts"`);
  - templates hold `ui-*` elements plus unstyled inline text (`strong`, `em`, `span`, `br`…), nothing else;
  - attribute values must be the primitive's tokens; the test reads each primitive's variants and checks every literal value.
- **Primitives use theme colours only** (`primary`, `base-200`…), never the Tailwind palette (`red-400`) or literal colours.
- **Fluid before breakpoints**: lay pages out intrinsically — `<ui-grid fit>` (as many columns as fit), `<ui-grid sidebar>`, wrapping `<ui-flex wrap>`, `fill` widths, and fluid sizes (`padding-x="fluid"`, heading `size="page"`, `clamp()` + container units of the main panel, which is an `@container`). The dashboard uses no screen breakpoints; reach for `sm:`/`md:` tokens only when no intrinsic pattern works. Motion uses the M3 spring tokens in `src/styles/motion.css`.
- **Glass is for the floating layer only**: sheets, dialogs, menus and other controls that float above content use `liquid-glass` (or `liquid-glass-clear` for small controls), defined in `src/styles/theme.css` (tint, light blur, refraction via the `#liquid-glass-refraction` SVG filter in `index.html`, rim shine, shadow). Tooltips, toasts, popovers, pickers and the dock already use it through their primitives; `shadow-*` utilities on glass replace only its drop shadow. Content surfaces (the main panel, cards, tables) stay solid, and glass never sits on glass. The material already handles light/dark, Reduce transparency, Increase contrast and browsers without `backdrop-filter`.
- **Colour contrast (WCAG AA) is checked**: `tests/contrast.test.ts` checks every colour scheme's ink/fill pairs (the scheme generator, `plugins/schemes.ts`, fixes unreadable `*-content` tokens); on screen, the command palette's **"Check colour contrast"** (or `?audit` in the URL) runs `<ui-contrast-audit>`, which measures every visible text against what's really behind it — glass, tints, and the background image — and outlines failures. Run it in light and dark after visual changes. Rules that keep it green: secondary text no fainter than `text-base-content/75`; coloured text uses the `*-ink` tokens (`text-success-ink`…, the colour mixed toward the ink), never raw `text-success`; tinted backgrounds take full-strength text.
- **Icons come from the registry only**: `ICONS` / `iconSvg()` / `<ui-icon name>` in `src/components/primitives/media/icon.ts`, filled with `import x from "~icons/<collection>/<name>"` (unplugin-icons, tree-shaken) from line-md (preferred, animated), material-symbols-light, devicon or logos. Nothing else draws an `<svg>` (`tests/icons.test.ts`).
- Missing something? Add a variant (or a new primitive) in `src/components/primitives`, not a workaround in the page.

# Mock backend (Payload-compatible, in the browser)

Mock apps get a real-feeling backend with nothing deployed: a Service Worker serves Payload's REST API from IndexedDB.

- **Data model**: `src/cms/config.ts` and `src/cms/collections/*.ts`, written with Payload's own types (`CollectionConfig`, `GlobalConfig`, `Endpoint`). Hooks, access control, validation, defaults, `admin.*` options and custom endpoints work like in Payload, so these files can be copied into a real `payload.config.ts` later. (`admin` there is Payload's config key and configures the dashboard; in our own code "admin" is never a page, component or route — it can only be a role.)
- **API**: `fetch("/api/<collection>?where[...]&depth=1")`, `/api/<collection>/<id>`, `/api/globals/<slug>`, `/api/<auth-collection>/login|logout|me`, custom endpoints. Same routes, query syntax and response shapes as Payload. From pages, call `startMockBackend()` once (or use `api` from `src/cms/client.ts`, which does it for you).
- **Dashboard**: the site root (`/`, `/collections/<slug>/<id>`, `/globals/<slug>`, `/account`), generated from the config and built from `ui-*` components (`src/pages/dashboard`, `ui-doc-form`). Seeded users log in with `demo1234`.
- **Seed data**: `src/cms/seed/<collection>.json` and `src/cms/seed/globals/<slug>.json`, loaded on first run. Give documents an `id` to reference them from relationships. Local edits stay in the browser; `/api/_mock/export|import|reset` (no dashboard page) snapshot them or reset to the seed.
- **Not emulated**: drafts/versions, localization, `richText` (edited as plain text), querying through relationships (`author.name`), `select`/`populate` options, login with username, email flows (verify/forgot password), GraphQL. Default access is Payload's: logged-in users only, unless a collection says otherwise.
- **Tests**: `tests/cms.test.ts` exercises the REST API in Node with an in-memory store.
- **Demo screens** are Payload custom views: root views in `config.admin.components.views` (path, `Component` = a custom element, optional `nav`), collection tabs in `admin.components.views.edit` (the case workspace, the quotation preview). Each element lives in `src/pages/dashboard/views/<name>.ts` (auto-imported) and receives `access`, `user` and, for tabs, `slug`/`docId`. Their server logic is in custom endpoints (`src/cms/endpoints/<area>.ts`). The demo is set on Tue 17 Nov 2026 09:30 (`DEMO_NOW` in `src/cms/endpoints/home.ts`).
- **Installable, works offline (PWA)**: `public/manifest.webmanifest` (+ `public/icons/`, linked from `index.html`). The same Service Worker precaches the build for offline use: `plugins/mock-backend.ts` writes the list of built files (`__PRECACHE__`, versioned by their hash) into `cms-sw.js`; `src/cms/sw.ts` caches them on install (full-size background photos just after), serves them cache-first, and drops old caches on the next deploy. Dev has no precache.
- **Guided tours**: `src/pages/dashboard/tours.ts` (steps can switch user with `as`, navigate with `go`, click a button, and spotlight a card by its heading text), played by `<dashboard-tour>` with `<ui-coachmark>`; started from the side panel's Tours section.
