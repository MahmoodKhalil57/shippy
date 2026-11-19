import type { Plugin } from "vite-plus/lint/plugins";

type Severity = "off" | "warn" | "error";

/** The `saastemly` oxlint plugin: register it under `lint.jsPlugins`. */
declare const plugin: Plugin;
export default plugin;

/** The rules a project turns on: spread into `lint.rules`. */
export declare const recommended: Record<string, Severity | [Severity, ...unknown[]]>;

/** Three or more words, every one capitalised (acronyms, numbers and the given proper nouns aside). */
export declare function isTitleCase(text: string, properNouns?: string[]): boolean;
