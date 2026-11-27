const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const SIBLINGS = {
  "saastemlycrm-design-system": "packages/saastemlycrm-design-system",
  "mock-runner": "runners/mock-runner",
  "cf-runner": "runners/cf-runner",
  "test-runner": "runners/test-runner",
  "tauri-runner": "runners/tauri-runner",
};

const dir = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
const declared = { ...manifest.dependencies, ...manifest.devDependencies };

for (const [name, rel] of Object.entries(SIBLINGS)) {
  const target = path.join(root, rel);
  if (!(name in declared) || !fs.existsSync(path.join(target, "package.json"))) continue;
  const at = path.join(dir, "node_modules", name);
  const stat = fs.lstatSync(at, { throwIfNoEntry: false });
  if (stat?.isSymbolicLink()) fs.unlinkSync(at);
  else if (stat) fs.rmSync(at, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(at), { recursive: true });
  fs.symlinkSync(target, at, "junction");
  console.log(`${manifest.name}: ${name} -> ${rel}`);
}
