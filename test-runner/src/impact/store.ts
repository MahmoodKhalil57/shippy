import { readFileSync, writeFileSync } from "node:fs";
import type { Dependencies } from "./rules.ts";

export const STORE_FILE = ".test-impact.json";
const VERSION = 1;

export interface TestRecord extends Dependencies {
  own: string;
  global: string;
  passed: boolean;
  environment: string;
}

export interface Store {
  version: number;
  tests: Record<string, TestRecord>;
}

export function readStore(file: string): { store: Store; existed: boolean } {
  try {
    const store = JSON.parse(readFileSync(file, "utf8")) as Store;
    if (store.version === VERSION && store.tests && typeof store.tests === "object") return { store, existed: true };
  } catch {}
  return { store: { version: VERSION, tests: {} }, existed: false };
}

export function writeStore(file: string, store: Store) {
  const tests = Object.fromEntries(Object.entries(store.tests).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  writeFileSync(file, `${JSON.stringify({ version: VERSION, tests })}\n`);
}

export const testKey = (project: string, file: string) => `${project}|${file}`;
