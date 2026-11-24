import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { recommended } from "saastemlycrm-design-system/lint";
import { designSystem, i18n, localeText, STATIC_LOCALE } from "saastemlycrm-design-system/vite";
import mockBackend from "mock-runner/vite";
import { cfBackend } from "cf-runner/vite";
import { defineConfig, loadEnv, type Plugin } from "vite-plus";
import { readBuildEnv, readPublicEnv } from "./src/env.ts";

/**
 * Golden Sea's app: this Payload config (src) drawn by the design system's dashboard, with the
 * mock runner as its backend in the browser (`--mode mock`), or cf-runner's Worker on Cloudflare
 * (`--mode cf.local`, `--mode cf.remote`). `bun run mock:dev` runs it; `bun run mock:build` writes
 * the demo site to mock/ (GitHub Pages). The design system and the backend know nothing of this project: this file joins them.
 */

const branding = JSON.parse(readFileSync(new URL("./src/seed/globals/branding.json", import.meta.url), "utf8")) as {
  name?: string;
  description?: string;
};
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/**
 * A legal notice kept at the top of every built script. The bundle is minified (names mangled,
 * dead code dropped), so the source is never shipped; this is the matching legal discouragement.
 * A minifier strips ordinary comments, but a bundler banner is prepended after minifying, so it
 * survives on every chunk. The app build and the service worker both carry it.
 */
const owner = branding.name ?? "This application";
const license =
  `/*! ${owner} — © ${new Date().getFullYear()}. All rights reserved. Proprietary.\n` +
  ` * This is a minified build delivered only to run the application in your browser.\n` +
  ` * Copying, redistribution, or reverse engineering of this bundle is not permitted. */`;

/** The page's title and description: the seeded `branding` global. */
const brandedPage: Plugin = {
  name: "golden-sea:branding",
  transformIndexHtml(html) {
    let out = html;
    if (branding.name) out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(branding.name)}</title>`);
    if (branding.description)
      out = out.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escapeHtml(branding.description)}$2`);
    return out;
  },
};

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command, isPreview, mode }) => {
  // The mode's environment (`--mode mock` reads .env.mock, `cf.local` .env.cf.local, `cf.remote`
  // .env.cf.remote), checked by src/env.ts. Which backend the app runs on: `mock` (the browser's,
  // mock-runner, the demo site on GitHub Pages) or `cf` (Cloudflare, cf-runner: one Worker serving
  // the API from D1 and these pages, wrangler.jsonc). The pages are the same; only `ready`
  // (app/main.ts) and the plugins differ.
  const raw = loadEnv(mode, root, "");
  const cf = readPublicEnv(raw).PUBLIC_BACKEND === "cf";
  const build = readBuildEnv(raw);
  // One language per build (build-locales.ts) is the mock's: a Worker answers every request in its
  // own language, so its build keeps both (its pages too, for now).
  const locale = cf ? undefined : build.I18N_LOCALE;
  return {
    // Only `PUBLIC_` variables reach the browser's `import.meta.env` (src/env.ts).
    envPrefix: "PUBLIC_",
    // The build is the demo website: GitHub Pages serves mock/ at /shippy/ (.github/workflows/pages.yml).
    // The base lives here, not as a `--base` flag: Git Bash rewrites `/shippy/` on a command line
    // into a Windows path ("C:/Program Files/Git/shippy/"), which broke every asset URL once. On
    // Cloudflare the app is the whole site.
    base: !cf && (command === "build" || isPreview) ? "/shippy/" : "/",
    define: locale ? { [STATIC_LOCALE]: JSON.stringify(locale) } : {},
    plugins: [
      // The design system: component stylesheets, Tailwind, cascade layers, icons, its text.
      ...designSystem(),
      // This project's own interface text (messages/*.json into src/i18n/paraglide), the same way.
      i18n(root),
      // A build in one language (`I18N_LOCALE`, build-locales.ts): the config's `{ en, ar }` keeps
      // only that language's words in the page (the backend's worker keeps both).
      localeText(locale, ["en", "ar"], /\/golden-sea-payload-config\/src\/.*\.ts$/),
      // The backend: on Cloudflare, the Worker (worker/index.ts) built beside the pages; else a
      // service worker serving this config's REST API from IndexedDB. Its own bundle carries the
      // same minification and legal banner as the app's (set in its build).
      ...(cf ? [cfBackend()] : mockBackend({ config: "./src/config.ts", seed: "./src/seed.ts", banner: license })),
      brandedPage,
    ],
    build: {
      // The demo site is mock/ (GitHub Pages); Cloudflare's build is dist/ (the Worker and its assets).
      outDir: cf ? "dist" : "mock",
      // build-locales.ts builds one language after another into it: the second adds its files.
      emptyOutDir: cf || !build.I18N_APPEND,
      // Make the production hardening explicit so a default can't silently regress: oxc minifies
      // and mangles identifiers, tree-shakes dead code, and the banner (a legal notice) is kept on
      // every emitted chunk. Property names stay (Payload field names, Lit attributes and JSON keys
      // are part of the contract), so this shrinks and obscures the code without breaking it.
      minify: "oxc",
      // `postBanner`, not `banner`: it is prepended after minification, so oxc can't strip it.
      rollupOptions: { output: { postBanner: license } },
    },
    fmt: {
      // src/i18n/paraglide: compiled from messages/*.json (saastemlycrm-design-system/vite/i18n.ts).
      ignorePatterns: ["bun.lock", "src/i18n/paraglide/**", "project.inlang/cache/**", "mock/**", "dist/**"],
      printWidth: 120,
      sortPackageJson: true,
    },
    lint: {
      ignorePatterns: ["src/i18n/paraglide/**", "project.inlang/cache/**", "mock/**", "dist/**"],
      // The design system's rules for a project (saastemlycrm-design-system/lint): the import
      // boundary, pure widgets, endpoints that return data, and the block conventions.
      jsPlugins: [
        { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
        { name: "saastemly", specifier: "saastemlycrm-design-system/lint" },
      ],
      rules: {
        "vite-plus/prefer-vite-plus-imports": "error",
        ...recommended,
        "saastemly/sentence-case-titles": ["warn", { properNouns: ["Golden Sea"] }],
      },
      // The app's entry (app/) and this file join the packages: they import the dashboard and the
      // backend, which the config itself (src/) never does.
      overrides: [{ files: ["app/**", "vite.config.ts"], rules: { "no-restricted-imports": "off" } }],
      options: { typeAware: true, typeCheck: true },
    },
    // Its behaviour is tested against the backend's engine in Node (`mock-runner/testing`), and its
    // screens against the design system's rules (`saastemlycrm-design-system/testing`).
    test: {
      include: ["tests/**/*.test.ts"],
    },
  };
});
