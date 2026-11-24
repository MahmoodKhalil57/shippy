// Builds the app and commits only the output to its own branch (`bun run mock:publish`,
// `bun run cf:publish`):
//
// - `mock`: the GitHub Pages demo (`mock:build`, mock/) on `mock-build`. Pages serves that
//   branch's root at /shippy/.
// - `cf`: the Cloudflare build (`cf:build`, dist/: the Worker in golden_sea/ with its
//   wrangler.json, the pages in client/) on `cf-build`.
//
// Each branch holds the output and nothing else, one commit per publish on top of the last, each
// naming the source commit it was built from. Git's own plumbing writes the commit (a separate
// index, the output folder as the work tree), so the working tree, the index and the checked-out
// branch are never touched. Nothing is pushed: the script prints the push command. A build with
// an OpenAI key in it is refused before anything is committed.
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const TARGETS = {
  mock: { script: "mock:build", out: "mock", branch: "mock-build" },
  cf: { script: "cf:build", out: "dist", branch: "cf-build" },
} as const;

const which = process.argv[2];
if (which !== "mock" && which !== "cf") {
  console.error("Usage: vpx publish.ts mock|cf");
  process.exit(2);
}
const { script, out: outName, branch } = TARGETS[which];
const root = import.meta.dirname;
const out = path.join(root, outName);

/** Runs git; its trimmed output, or exits with git's message. */
function git(args: string[], env: NodeJS.ProcessEnv = process.env, allowFail = false): string {
  const r = spawnSync("git", args, { cwd: root, env, encoding: "utf8" });
  if (r.status !== 0 && !allowFail) {
    console.error(`git ${args.join(" ")} failed:\n${r.stderr}`);
    process.exit(1);
  }
  return r.status === 0 ? r.stdout.trim() : "";
}

// 1. Build.
const build = spawnSync("bun", ["run", script], { cwd: root, stdio: "inherit", shell: true });
if (build.status !== 0) process.exit(build.status ?? 1);

// The Worker's generated wrangler.json names the config it came from by its absolute path on this
// machine (`configPath`, `userConfigPath`): information only, and not this machine's to publish.
if (which === "cf") {
  const file = path.join(out, "golden_sea", "wrangler.json");
  const {
    configPath: _c,
    userConfigPath: _u,
    ...rest
  } = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  writeFileSync(file, JSON.stringify(rest));
}

// 2. Never publish a key: the OpenAI key meta must be empty, and no file may hold an OpenAI key.
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
const leaks = files(out).filter((f) => {
  if (!/\.(html|js|mjs|json|css|txt|map)$/.test(f)) return false;
  const text = readFileSync(f, "utf8");
  return /name="openai-api-key"\s+content="[^"]+"/.test(text) || /\bsk-[A-Za-z0-9_-]{20,}/.test(text);
});
if (leaks.length) {
  console.error(
    `Refusing to publish: an OpenAI key is in\n${leaks.map((f) => `  ${path.relative(root, f)}`).join("\n")}`,
  );
  process.exit(1);
}

// 3. Commit the output folder as the branch's whole tree.
const gitDir = git(["rev-parse", "--absolute-git-dir"]);
const index = path.join(gitDir, `publish-${branch}.index`);
rmSync(index, { force: true });
const env = { ...process.env, GIT_INDEX_FILE: index };
try {
  git(["--git-dir", gitDir, "--work-tree", out, "add", "--all", "--force", "."], env);
  const tree = git(["--git-dir", gitDir, "write-tree"], env);
  const parent = git(["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`], process.env, true);
  if (parent && git(["rev-parse", `${parent}^{tree}`]) === tree) {
    console.log(`${branch} already holds this build (${parent.slice(0, 7)}): nothing to commit.`);
    process.exit(0);
  }
  const source = git(["rev-parse", "--short", "HEAD"], process.env, true) || "no commit";
  const dirty = git(["status", "--porcelain"], process.env, true) ? " with uncommitted changes" : "";
  const message = `${which} build of ${source}${dirty}`;
  const commit = git(["commit-tree", tree, ...(parent ? ["-p", parent] : []), "-m", message]);
  // Moves the branch only if it is still where it was read (an empty old value: it must not exist).
  git(["update-ref", "-m", `publish: ${message}`, `refs/heads/${branch}`, commit, parent || "0".repeat(40)]);
  console.log(`Committed ${commit.slice(0, 7)} to ${branch}: ${message}.`);
  console.log(`Push it with: git push origin ${branch}`);
} finally {
  rmSync(index, { force: true });
}
