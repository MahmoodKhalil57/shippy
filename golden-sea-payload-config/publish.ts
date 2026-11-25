// Builds the app from the last commit and publishes only the output to its own branch
// (`bun run mock:publish`, `bun run cf:publish`):
//
// - `mock`: the GitHub Pages demo (`mock:build`, mock/) on `mock-build`. Pages serves that
//   branch's root at /shippy/.
// - `cf`: the Cloudflare build (`cf:build`, dist/: the Worker in golden_sea/ with its
//   wrangler.json, the pages in client/) on `cf-build`.
//
// 1. HEAD is checked out in a temporary worktree (outside the repository), so uncommitted changes
//    never reach a build. Each package is installed there, its `link:` dependencies pointed at the
//    worktree's own packages (a registered `bun link` is the working folder, changes and all), and
//    the mode's env files (`.env.*`, ignored by git) copied in.
// 2. The output is checked: no OpenAI key, and no path of this machine in the Worker's config.
// 3. Git's plumbing commits the output folder as the branch's whole tree (a separate index, the
//    output as the work tree: the working tree, its index and the checked-out branch are never
//    touched), on top of the branch's last commit, and tags it `<branch>-<short hash of HEAD>`.
// 4. The branch and the tag are pushed to `origin` (`--no-push` keeps them local), and the
//    worktree is removed, whatever happened.
//
// A commit already published (its tag exists) isn't built again; its branch and tag are pushed.
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const TARGETS = {
  mock: { script: "mock:build", out: "mock", branch: "mock-build" },
  cf: { script: "cf:build", out: "dist", branch: "cf-build" },
} as const;
/** The packages, in install order (cf-runner links mock-runner; Golden Sea links all three). */
const PACKAGES = ["saastemlycrm-design-system", "mock-runner", "cf-runner", "golden-sea-payload-config"];
const PROJECT = "golden-sea-payload-config";

const which = process.argv[2];
if (which !== "mock" && which !== "cf") {
  console.error("Usage: vpx publish.ts mock|cf [--no-push]");
  process.exit(2);
}
const push = !process.argv.includes("--no-push");
const { script, out: outName, branch } = TARGETS[which];
const root = import.meta.dirname;

/** Runs git in `cwd`; its trimmed output, or throws with git's message. */
function git(args: string[], { cwd = root, env = process.env, allowFail = false } = {}): string {
  const r = spawnSync("git", args, { cwd, env, encoding: "utf8" });
  if (r.status !== 0) {
    if (allowFail) return "";
    throw new Error(`git ${args.join(" ")} failed:\n${r.stderr}`);
  }
  return r.stdout.trim();
}

/** Runs a command in `cwd` with its output shown; throws if it fails. */
function run(cmd: string, args: string[], cwd: string) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: true });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed in ${cwd}`);
}

const source = git(["rev-parse", "HEAD"]);
const short = source.slice(0, 7);
const tag = `${branch}-${short}`;
if (git(["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`], { allowFail: true })) {
  // Built before; push it in case that push didn't happen or failed.
  console.log(`${short} is already built (tag ${tag}).`);
  if (push) {
    git(["push", "origin", `refs/heads/${branch}:refs/heads/${branch}`, `refs/tags/${tag}:refs/tags/${tag}`]);
    console.log(`origin has ${branch} and ${tag}.`);
  }
  process.exit(0);
}
if (git(["status", "--porcelain"], { allowFail: true }))
  console.log(`Building ${short} (HEAD) in a worktree: uncommitted changes are not included.`);

const gitDir = git(["rev-parse", "--git-common-dir"]);
const absGitDir = path.resolve(root, gitDir);
const tree = path.join(tmpdir(), `publish-${branch}-${short}`);
const index = path.join(absGitDir, `publish-${branch}.index`);

const cleanup = () => {
  git(["worktree", "remove", "--force", tree], { allowFail: true });
  rmSync(tree, { recursive: true, force: true });
  git(["worktree", "prune"], { allowFail: true });
  rmSync(index, { force: true });
};

let failed = false;
try {
  // 1. The commit, on its own, with its dependencies.
  cleanup();
  git(["worktree", "add", "--detach", tree, source]);
  const top = git(["rev-parse", "--show-toplevel"], { cwd: tree });
  for (const pkg of PACKAGES) {
    const dir = path.join(top, pkg);
    if (!existsSync(path.join(dir, "package.json"))) throw new Error(`${pkg} isn't in ${short}`);
    run("bun", ["install"], dir);
    // A `link:` dependency is the registered package: the working folder. Point it here instead.
    for (const dep of PACKAGES) {
      const at = path.join(dir, "node_modules", dep);
      if (dep === pkg || !existsSync(at)) continue;
      if (lstatSync(at).isSymbolicLink() || lstatSync(at).isDirectory()) rmSync(at, { recursive: true, force: true });
      symlinkSync(path.join(top, dep), at, "junction");
    }
  }
  const project = path.join(top, PROJECT);
  for (const f of readdirSync(root).filter((f) => f.startsWith(".env.")))
    copyFileSync(path.join(root, f), path.join(project, f));

  // 2. The build, checked.
  run("bun", ["run", script], project);
  const out = path.join(project, outName);
  if (which === "cf") {
    // The Worker's generated wrangler.json names the config it came from by its absolute path on
    // this machine (`configPath`, `userConfigPath`): information only, and not this machine's to publish.
    const file = path.join(out, "golden_sea", "wrangler.json");
    const {
      configPath: _c,
      userConfigPath: _u,
      ...rest
    } = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
    writeFileSync(file, JSON.stringify(rest));
  }
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
  if (leaks.length)
    throw new Error(
      `Refusing to publish: an OpenAI key is in\n${leaks.map((f) => `  ${path.relative(out, f)}`).join("\n")}`,
    );

  // 3. The output as the branch's next commit, tagged with the source commit.
  const env = { ...process.env, GIT_INDEX_FILE: index };
  git(["--git-dir", absGitDir, "--work-tree", out, "add", "--all", "--force", "."], { env });
  const outTree = git(["--git-dir", absGitDir, "write-tree"], { env });
  const parent = git(["rev-parse", "--verify", "--quiet", `refs/heads/${branch}`], { allowFail: true });
  const message = `${which} build of ${source}`;
  const commit =
    parent && git(["rev-parse", `${parent}^{tree}`]) === outTree
      ? parent // The same output as the last publish: tag it, no new commit.
      : git(["commit-tree", outTree, ...(parent ? ["-p", parent] : []), "-m", message]);
  if (commit !== parent)
    // Moves the branch only if it is still where it was read (zeros: it must not exist yet).
    git(["update-ref", "-m", `publish: ${message}`, `refs/heads/${branch}`, commit, parent || "0".repeat(40)]);
  git(["tag", tag, commit]);
  console.log(
    commit === parent
      ? `${branch} already held this output: tagged ${commit.slice(0, 7)} as ${tag}.`
      : `Committed ${commit.slice(0, 7)} to ${branch} (${message}), tagged ${tag}.`,
  );

  // 4. Out.
  if (push) {
    git(["push", "origin", `refs/heads/${branch}:refs/heads/${branch}`, `refs/tags/${tag}:refs/tags/${tag}`]);
    console.log(`Pushed ${branch} and ${tag} to origin.`);
  } else console.log(`Not pushed. Push with: git push origin ${branch} ${tag}`);
} catch (e) {
  failed = true;
  console.error(e instanceof Error ? e.message : e);
} finally {
  cleanup();
}
process.exit(failed ? 1 : 0);
