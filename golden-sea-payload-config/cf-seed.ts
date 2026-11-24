// Seeds Golden Sea's D1 database (cf-runner): the seed written through the same engine as SQL
// (`seedSql`), then run by Wrangler. `--mode cf.local` (the default: the database `bun run cf:dev`
// uses) or `--mode cf.remote` (the deployed one) picks the env file (src/env.ts), whose
// `D1_TARGET` names the database; `--reset` empties it first (the demo back to its seed), else
// only what the database doesn't have is added.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnv } from "vite-plus";
import { seedSql } from "cf-runner/seed";
import { seedsFromDir } from "mock-runner/testing";
import { readBuildEnv } from "./src/env.ts";

const root = import.meta.dirname;
const at = process.argv.indexOf("--mode");
const mode = at > 0 ? (process.argv[at + 1] ?? "cf.local") : "cf.local";
// The mode's variables, before the config loads: its flags read them (src/flags.ts).
Object.assign(process.env, loadEnv(mode, root, ""));
const { D1_TARGET } = readBuildEnv(process.env);
const reset = process.argv.includes("--reset");
const { default: config } = await import("./src/config.ts");

const file = path.join(root, ".wrangler", "seed.sql");
mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(file, await seedSql(config, seedsFromDir(path.join(root, "src/seed")), { reset }));
const run = spawnSync("wrangler", ["d1", "execute", "golden-sea", `--${D1_TARGET}`, "--file", file, "--yes"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
process.exit(run.status ?? 1);
