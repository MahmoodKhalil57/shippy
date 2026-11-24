import { z } from "zod";

/**
 * Golden Sea's environment, declared once and checked as it loads. Each way of running the app has
 * its own file, picked by Vite's mode (`--mode <name>` reads `.env.<name>`):
 *
 * - `.env.mock`: the browser's mock backend, the GitHub Pages demo (`mock:*` scripts);
 * - `.env.cf.local`: Cloudflare on this machine, local D1 and R2 (`cf:dev`, `cf:preview`, `cf:seed`);
 * - `.env.cf.remote`: the deployed Worker and its D1 (`cf:deploy`, `cf:seed:remote`).
 *
 * Names starting with `PUBLIC_` are the browser's: Vite puts them, and only them, in
 * `import.meta.env` (`envPrefix` in vite.config.ts), so they reach the pages, the mock's service
 * worker and the Cloudflare Worker alike. Everything else stays in the build and Node scripts
 * (`process.env`). None of these files holds a secret: the Worker's `PAYLOAD_SECRET` is a Wrangler
 * secret (`wrangler secret put`), and the OpenAI key is never in the repository.
 */

/** A yes/no value: `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`; empty or unset is `fallback`. */
const yesNo = (fallback: boolean) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() || undefined : v),
    z.stringbool().default(fallback),
  );

/** What the browser sees (`PUBLIC_`). */
export const publicEnvSchema = z.object({
  /** Which backend the app runs on: `mock` (in the browser) or `cf` (Cloudflare, cf-runner). */
  PUBLIC_BACKEND: z.enum(["mock", "cf"]).default("mock"),
  /** The third parties are simulated (src/flags.ts, `IS_MOCK`). */
  PUBLIC_IS_MOCK: yesNo(true),
  /** Temporary demo logic may run (src/flags.ts, `IS_TEMP_MOCK`). */
  PUBLIC_IS_TEMP_MOCK: yesNo(true),
});

/** The build's and Node scripts' own (never in a page). */
export const buildEnvSchema = z.object({
  /** Which D1 database the Cloudflare scripts write to (cf-seed.ts). */
  D1_TARGET: z.enum(["local", "remote"]).default("local"),
  /** One language per page build (set by build-locales.ts). */
  I18N_LOCALE: z.enum(["en", "ar"]).optional(),
  /** The second language's build adds its files to the first's (set by build-locales.ts). */
  I18N_APPEND: yesNo(false),
});

export type PublicEnv = z.output<typeof publicEnvSchema>;
export type BuildEnv = z.output<typeof buildEnvSchema>;

declare global {
  // `import.meta.env` as Vite gives it (the raw text of each `PUBLIC_` value).
  interface ImportMetaEnv extends Readonly<Partial<Record<keyof PublicEnv, string>>> {}
}

/** Checks the environment: a misspelt value stops the build or the app, naming the variable. */
function parse<T extends z.ZodType>(schema: T, raw: Record<string, unknown>): z.output<T> {
  const r = schema.safeParse(raw);
  if (r.success) return r.data;
  throw new Error(
    `Invalid environment (.env.<mode>):\n${r.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`,
  );
}

/** The browser's variables from a raw environment (a page's `import.meta.env`, or `process.env`). */
export function readPublicEnv(raw: Record<string, unknown>): PublicEnv {
  const env = parse(publicEnvSchema, raw);
  if (!env.PUBLIC_IS_MOCK && env.PUBLIC_IS_TEMP_MOCK)
    throw new Error("Production (PUBLIC_IS_MOCK=false) can't run temporary mock logic: set PUBLIC_IS_TEMP_MOCK=false.");
  return env;
}

/** The build's and Node scripts' variables from `process.env`. */
export const readBuildEnv = (raw: Record<string, unknown>): BuildEnv => parse(buildEnvSchema, raw);

/**
 * This run's browser variables: a Vite build's `import.meta.env` (the mode's file, fixed at build
 * time), over `process.env` where there is one (Node scripts, tests).
 */
export const env: PublicEnv = readPublicEnv({
  ...(typeof process !== "undefined" ? process.env : {}),
  ...(import.meta as { env?: Record<string, unknown> }).env,
});
