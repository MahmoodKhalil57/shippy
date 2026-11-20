import { readFileSync } from "node:fs";
import { recommended } from "saastemlycrm-design-system/lint";
import { designSystem } from "saastemlycrm-design-system/vite";
import mockBackend from "mock-runner/vite";
import { defineConfig, type Plugin } from "vite-plus";

/**
 * Golden Sea's app: this Payload config (src) drawn by the design system's dashboard, with the
 * mock runner as its backend in the browser. `vp dev` runs it; `vp build` writes the demo site to
 * ../docs. The design system and the backend know nothing of this project: this file joins them.
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

export default defineConfig(({ command, isPreview }) => ({
  // The build is the demo website: GitHub Pages serves the repository's docs/ folder at /shippy/.
  // The base lives here, not as a `--base` flag: Git Bash rewrites `/shippy/` on a command line
  // into a Windows path ("C:/Program Files/Git/shippy/"), which broke every asset URL once.
  base: command === "build" || isPreview ? "/shippy/" : "/",
  plugins: [
    // The design system: component stylesheets, Tailwind, cascade layers, icons.
    ...designSystem(),
    // The backend: a service worker serving this config's REST API from IndexedDB. Its own bundle
    // carries the same minification and legal banner as the app's (set in its build).
    ...mockBackend({ config: "./src/config.ts", seed: "./src/seed.ts", banner: license }),
    brandedPage,
  ],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    // Make the production hardening explicit so a default can't silently regress: oxc minifies
    // and mangles identifiers, tree-shakes dead code, and the banner (a legal notice) is kept on
    // every emitted chunk. Property names stay (Payload field names, Lit attributes and JSON keys
    // are part of the contract), so this shrinks and obscures the code without breaking it.
    minify: "oxc",
    // `postBanner`, not `banner`: it is prepended after minification, so oxc can't strip it.
    rollupOptions: { output: { postBanner: license } },
  },
  fmt: {
    ignorePatterns: ["bun.lock"],
    printWidth: 120,
    sortPackageJson: true,
  },
  lint: {
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
}));
