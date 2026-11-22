/**
 * The contracts a project implements against: everything a Payload config needs to know about
 * this design system, and nothing that draws. Pure (no DOM, no Lit), so a project's config can
 * also run in a service worker or on a server.
 *
 * - The config: `defineConfig`, `MockConfig`, field and document types, `tones`,
 *   `CollectionSettings`, `DashboardSettings`, tours.
 * - Screens: `widgets()`, `Widget`, `Source`, `WidgetScope`, `figures()` (./app/widgets/widget.ts), and the
 *   widget kinds a config feeds with a query and a formatter: `chart()`, `table()`, `list()`…,
 *   `assists()`, `header()`, `query` (./app/widgets/kinds.ts).
 * - What widgets draw: the block vocabulary, `block()`, `note()`, `formatNumber`, `Action`, `Cell`… (schema).
 * - Design rules that need real data: `designProblems` (./app/widgets/design-check.ts).
 * - Links to the dashboard's pages: `links()`, `linkTarget()` (./app/widgets/links.ts), and where they
 *   lead: `placesOf()`, `placeOf()` (./app/widgets/places.ts).
 * - Pages for a collection, a document or a global: `collectionPage()`, `documentPage()`, `globalPage()`.
 */
export * from "./config.ts";
export * from "../app/widgets/widget.ts";
export * from "../app/widgets/schema.ts";
export * from "../app/widgets/design-check.ts";
export * from "../app/widgets/tile.ts";
export * from "../app/widgets/links.ts";
export * from "../app/widgets/places.ts";
export * from "../app/widgets/kinds.ts";
