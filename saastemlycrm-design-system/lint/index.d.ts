import type { Plugin } from "vite-plus/lint/plugins";

type Severity = "off" | "warn" | "error";

/** The `saastemly` oxlint plugin: register it under `lint.jsPlugins`. */
declare const plugin: Plugin;
export default plugin;

/** The rules a project turns on: spread into `lint.rules`. */
export declare const recommended: Record<string, Severity | [Severity, ...unknown[]]>;

/** Three or more words, every one capitalised (acronyms, numbers and the given proper nouns aside). */
export declare function isTitleCase(text: string, properNouns?: string[]): boolean;

/** Is this string a list of utility classes (not prose)? */
export declare function isClassString(value: string): boolean;

/** What in one class string breaks a fluid layout (the `fluid-classes` rule), each a sentence naming the fix. */
export declare function fluidProblems(value: string): string[];
