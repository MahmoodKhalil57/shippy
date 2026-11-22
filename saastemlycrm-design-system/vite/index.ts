import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import componentCss from "./component-css.ts";
import dedupeCss from "./dedupe-css.ts";
import icons from "./icons.ts";
import layerVariants from "./layer-variants.ts";
import scopedInvalidation from "./scoped-invalidation.ts";

const pkg = fileURLToPath(new URL("..", import.meta.url));

/**
 * The design system's Vite plugins, for an app that uses it: each component's stylesheet
 * (generated from its recipes, so only imported components ship CSS), Tailwind, variant rules
 * in ordered cascade layers, de-duplicated CSS, and `~icons/<collection>/<name>` icons.
 * `scan`: more folders whose templates use responsive tokens (`size="sm lg:lg"`).
 */
export function designSystem(options: { scan?: string[] } = {}) {
  return [
    // Must come before tailwindcss(): generates each component's stylesheet.
    componentCss({
      dir: path.join(pkg, "src/components"),
      reference: path.join(pkg, "src/styles/reference.css"),
      scan: [path.join(pkg, "src"), ...(options.scan ?? [])],
    }),
    tailwindcss(),
    // After tailwindcss(): no rule that makes a class change restyle a whole subtree.
    scopedInvalidation(),
    // After tailwindcss(): variant rules into ordered cascade layers.
    layerVariants(),
    dedupeCss(),
    icons(),
  ];
}
