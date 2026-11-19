/**
 * The contracts a project implements against: everything a Payload config needs to know about
 * this design system, and nothing that draws. Pure (no DOM, no Lit), so a project's config can
 * also run in a service worker or on a server.
 *
 * - The config: `defineConfig`, `MockConfig`, field and document types, `tones`,
 *   `CollectionSettings`, `DashboardSettings`, tours.
 * - Screens: `widgets()`, `widget()`, `Widget`, `Source`, `WidgetScope` (./app/widgets/widget.ts).
 * - What widgets draw: the block vocabulary, `block()`, `formatNumber`, `Action`, `Cell`… (schema).
 */
export * from "./config.ts";
export * from "../app/widgets/widget.ts";
export * from "../app/widgets/schema.ts";
