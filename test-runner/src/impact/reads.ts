import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hashText } from "./normalize.ts";

export const READ_PREFIX = "\0impact-read:";
type Kind = "file" | "dir" | "exists";

const own = { readFileSync: fs.readFileSync, readdirSync: fs.readdirSync, existsSync: fs.existsSync };
const shared = globalThis as typeof globalThis & { __testImpactReads?: { seen: Set<string>; watching: boolean } };
const state = (shared.__testImpactReads ??= { seen: new Set<string>(), watching: false });
const seen = state.seen;

const toPath = (target: unknown): string | undefined => {
  if (typeof target === "string") return target.startsWith("file:") ? fileURLToPath(target) : target;
  if (target instanceof URL) return fileURLToPath(target);
  if (Buffer.isBuffer(target)) return target.toString();
  return undefined;
};

export const readId = (kind: Kind, file: string) =>
  `${READ_PREFIX}${kind}:${path.resolve(file).split(path.sep).join("/")}`;

function note(kind: Kind, target: unknown) {
  const file = toPath(target);
  if (file === undefined || path.resolve(file).split(path.sep).includes("node_modules")) return;
  seen.add(readId(kind, file));
}

type Fn = (this: unknown, ...args: unknown[]) => unknown;

function wrap(owner: object, name: string, kind: Kind) {
  const table = owner as Record<string, Fn | undefined>;
  const original = table[name];
  if (typeof original !== "function") return;
  table[name] = function (this: unknown, ...args: unknown[]) {
    note(kind, args[0]);
    return original.apply(this, args);
  };
}

export function watchReads() {
  if (state.watching) return;
  state.watching = true;
  for (const [name, kind] of [
    ["readFileSync", "file"],
    ["readFile", "file"],
    ["readdirSync", "dir"],
    ["readdir", "dir"],
    ["existsSync", "exists"],
  ] as const)
    wrap(fs, name, kind);
  wrap(fs.promises, "readFile", "file");
  wrap(fs.promises, "readdir", "dir");
  syncBuiltinESMExports();
}

export function writeReads(coverageFile: string) {
  const ids = [...seen];
  seen.clear();
  fs.writeFileSync(`${coverageFile}.reads.json`, JSON.stringify(ids));
}

export function takeReads(coverageFile: string): string[] {
  try {
    return JSON.parse(own.readFileSync(`${coverageFile}.reads.json`, "utf8")) as string[];
  } catch {
    return [];
  }
}

export function readPath(id: string): string | undefined {
  if (!id.startsWith(READ_PREFIX)) return undefined;
  const rest = id.slice(READ_PREFIX.length);
  return rest.slice(rest.indexOf(":") + 1);
}

export function readHash(id: string): string | undefined {
  const file = readPath(id);
  if (file === undefined) return undefined;
  const kind = id.slice(READ_PREFIX.length).split(":", 1)[0];
  if (kind === "exists") return own.existsSync(file) ? "exists" : "absent";
  try {
    if (kind === "dir") return hashText(`dir\u0001${own.readdirSync(file).sort().join("\n")}`);
    return hashText(`file\u0001${own.readFileSync(file).toString("base64")}`);
  } catch {
    return "missing";
  }
}
