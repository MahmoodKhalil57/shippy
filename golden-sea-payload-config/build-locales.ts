import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = import.meta.dirname;
const out = path.join(root, "mock");
const LOCALES = ["ar", "en"] as const;

const entries: Record<string, string> = {};
for (const [i, locale] of LOCALES.entries()) {
  const run = spawnSync("vp", ["build", "--mode", "mock"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, I18N_LOCALE: locale, I18N_APPEND: i ? "1" : "" },
  });
  if (run.status !== 0) process.exit(run.status ?? 1);
  const html = readFileSync(path.join(out, "index.html"), "utf8");
  const src = /<script type="module" crossorigin src="([^"]+)"><\/script>/.exec(html)?.[1];
  if (!src) throw new Error(`No module entry in the ${locale} build's index.html`);
  entries[locale] = src;
}

const page = readFileSync(path.join(out, "index.html"), "utf8");
const tag = `<script type="module" crossorigin src="${entries.en}"></script>`;
if (!page.includes(tag)) throw new Error("The English entry's script tag isn't in index.html");
const pick = `document.documentElement.lang === "ar" ? ${JSON.stringify(entries.ar)} : ${JSON.stringify(entries.en)}`;
const loader =
  `<script>\n      // This language's build only (build-locales.ts): fetched now, run once the page is parsed.\n` +
  `      document.head.append(Object.assign(document.createElement("link"), { rel: "modulepreload", crossOrigin: "", href: ${pick} }));\n` +
  `    </script>\n` +
  `    <script type="module">\n      import(${pick});\n    </script>`;
const html = page.replace(tag, loader);
for (const f of ["index.html", "404.html"]) writeFileSync(path.join(out, f), html);
console.log(
  `Built ${LOCALES.join(" and ")}: ${Object.entries(entries)
    .map(([l, s]) => `${l} ${s}`)
    .join(", ")}`,
);
