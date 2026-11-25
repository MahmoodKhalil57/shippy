import type { Plugin } from "vite-plus/lint/plugins";

type Severity = "off" | "warn" | "error";

declare const plugin: Plugin;
export default plugin;

export declare const recommended: Record<string, Severity | [Severity, ...unknown[]]>;

export declare function isTitleCase(text: string, properNouns?: string[]): boolean;

export declare function isClassString(value: string): boolean;

export declare function fluidProblems(value: string): string[];
