import { compile } from "@inlang/paraglide-js";
import { i18nCompileOptions } from "./i18n.ts";

await compile(i18nCompileOptions(process.argv[2] ?? process.cwd()));
