import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import componentCss from "./component-css.ts";
import dedupeCss from "./dedupe-css.ts";
import icons from "./icons.ts";
import { i18n } from "./i18n.ts";
import layerVariants from "./layer-variants.ts";
import scopedInvalidation from "./scoped-invalidation.ts";

const pkg = fileURLToPath(new URL("..", import.meta.url));

export function designSystem(options: { scan?: string[] } = {}) {
  return [
    i18n(pkg),
    componentCss({
      dir: path.join(pkg, "src/components"),
      reference: path.join(pkg, "src/styles/reference.css"),
      scan: [path.join(pkg, "src"), ...(options.scan ?? [])],
    }),
    tailwindcss(),
    scopedInvalidation(),
    layerVariants(),
    dedupeCss(),
    icons(),
  ];
}

export { i18n, i18nCompileOptions, LANGUAGE_KEY, localeText, STATIC_LOCALE } from "./i18n.ts";
