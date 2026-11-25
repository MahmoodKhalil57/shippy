import { z } from "zod";

const yesNo = (fallback: boolean) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim().toLowerCase() || undefined : v),
    z.stringbool().default(fallback),
  );

export const publicEnvSchema = z.object({
  PUBLIC_BACKEND: z.enum(["mock", "cf"]).default("mock"),
  PUBLIC_IS_MOCK: yesNo(true),
  PUBLIC_IS_TEMP_MOCK: yesNo(true),
});

export const buildEnvSchema = z.object({
  D1_TARGET: z.enum(["local", "remote"]).default("local"),
  I18N_LOCALE: z.enum(["en", "ar"]).optional(),
  I18N_APPEND: yesNo(false),
});

export type PublicEnv = z.output<typeof publicEnvSchema>;
export type BuildEnv = z.output<typeof buildEnvSchema>;

declare global {
  interface ImportMetaEnv extends Readonly<Partial<Record<keyof PublicEnv, string>>> {}
}

function parse<T extends z.ZodType>(schema: T, raw: Record<string, unknown>): z.output<T> {
  const r = schema.safeParse(raw);
  if (r.success) return r.data;
  throw new Error(
    `Invalid environment (.env.<mode>):\n${r.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")}`,
  );
}

export function readPublicEnv(raw: Record<string, unknown>): PublicEnv {
  const env = parse(publicEnvSchema, raw);
  if (!env.PUBLIC_IS_MOCK && env.PUBLIC_IS_TEMP_MOCK)
    throw new Error("Production (PUBLIC_IS_MOCK=false) can't run temporary mock logic: set PUBLIC_IS_TEMP_MOCK=false.");
  return env;
}

export const readBuildEnv = (raw: Record<string, unknown>): BuildEnv => parse(buildEnvSchema, raw);

export const env: PublicEnv = readPublicEnv({
  ...(typeof process !== "undefined" ? process.env : {}),
  ...(import.meta as { env?: Record<string, unknown> }).env,
});
