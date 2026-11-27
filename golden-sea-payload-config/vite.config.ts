import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { recommended } from "saastemlycrm-design-system/lint";
import { designSystem, i18n, localeText, STATIC_LOCALE } from "saastemlycrm-design-system/vite";
import mockBackend from "mock-runner/vite";
import { cfBackend } from "cf-runner/vite";
import { testRunner } from "test-runner/vite";
import { impactCoverage } from "test-runner/impact";
import { playwright } from "vite-plus/test/browser-playwright";
import { defineConfig, loadEnv, type Plugin } from "vite-plus";
import { readBuildEnv, readPublicEnv } from "./src/env.ts";

const branding = JSON.parse(readFileSync(new URL("./src/seed/globals/branding.json", import.meta.url), "utf8")) as {
  name?: string;
  description?: string;
};
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const owner = branding.name ?? "This application";
const license =
  `/*! ${owner} — © ${new Date().getFullYear()}. All rights reserved. Proprietary.\n` +
  ` * This is a minified build delivered only to run the application in your browser.\n` +
  ` * Copying, redistribution, or reverse engineering of this bundle is not permitted. */`;

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
  const raw = loadEnv(mode, root, "");
  const cf = readPublicEnv(raw).PUBLIC_BACKEND === "cf";
  const build = readBuildEnv(raw);
  const locale = cf ? undefined : build.I18N_LOCALE;
  return {
    envPrefix: "PUBLIC_",
    base: !cf && (command === "build" || isPreview) ? "/shippy/" : "/",
    define: locale ? { [STATIC_LOCALE]: JSON.stringify(locale) } : {},
    plugins: [
      ...designSystem(),
      i18n(root),
      localeText(locale, ["en", "ar"], /\/golden-sea-payload-config\/src\/.*\.ts$/),
      ...(cf ? [cfBackend()] : mockBackend({ config: "./src/config.ts", seed: "./src/seed.ts", banner: license })),
      brandedPage,
    ],
    test: {
      projects: testRunner({
        config: "./src/config.ts",
        seed: "./src/seed.ts",
        steps: ["./features/steps/index.ts"],
        tours: { features: "./features/tours", messages: "./messages/tours", seed: "./src/seed/tours.json" },
        playwright,
      }),
      coverage: impactCoverage(),
    },
    build: {
      outDir: cf ? "dist" : "mock",
      emptyOutDir: cf || !build.I18N_APPEND,
      minify: "oxc",
      rollupOptions: { output: { postBanner: license } },
    },
    fmt: {
      ignorePatterns: ["bun.lock", "src/i18n/paraglide/**", "project.inlang/cache/**", "mock/**", "dist/**"],
      printWidth: 120,
      sortPackageJson: true,
    },
    lint: {
      ignorePatterns: ["src/i18n/paraglide/**", "project.inlang/cache/**", "mock/**", "dist/**"],
      jsPlugins: [
        { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
        { name: "saastemly", specifier: "saastemlycrm-design-system/lint" },
      ],
      rules: {
        "vite-plus/prefer-vite-plus-imports": "error",
        ...recommended,
        "saastemly/sentence-case-titles": ["warn", { properNouns: ["Golden Sea"] }],
      },
      overrides: [{ files: ["app/**", "vite.config.ts"], rules: { "no-restricted-imports": "off" } }],
      options: { typeAware: true, typeCheck: true },
    },
  };
});
