// Compiles a package's messages (messages/*.json) into its src/i18n/paraglide, as `vp dev` and
// `vp build` do: `vpx <design system>/vite/compile-i18n.ts [package root]`.
import { compile } from "@inlang/paraglide-js";
import { i18nCompileOptions } from "./i18n.ts";

await compile(i18nCompileOptions(process.argv[2] ?? process.cwd()));
