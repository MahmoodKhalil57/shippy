/**
 * Two flags for going to production. Every place that isn't production logic yet is marked with
 * one of them, so the work left is `grep -rn "IS_TEMP_MOCK\|IS_MOCK" src` and nothing ships by
 * accident:
 *
 * - **IS_TEMP_MOCK**: temporary logic written to make the demo run, which production must not use
 *   (a stub AI answer, the demo's fixed clock, canned numbers or text standing in for a
 *   calculation). On, it runs; off, it throws `TempMockError`: the polished logic, the same for
 *   the mock and for production, replaces it and the if/else melts away.
 *
 *   ```ts
 *   if (IS_TEMP_MOCK) {
 *     // TODO replace temporary mock logic with proper polished logic
 *   } else {
 *     // TODO Throw error, polished logic should be implemented for mock and prod and the if/else should be melted
 *     throw new TempMockError("…what is missing…");
 *   }
 *   ```
 *
 * - **IS_MOCK**: the third parties are simulated (the mailboxes and WhatsApp, suppliers' and
 *   agents' replies, the tax authority's e-invoicing, the bank, the AI model, the Odoo import).
 *   On, the simulation runs: the mock backend is the whole world. Off, the real connection runs;
 *   until it's written it throws `NotConnectedError`.
 *
 *   ```ts
 *   if (IS_MOCK) {
 *     // TODO implement mock only logic to simulate third party connections
 *   } else {
 *     // TODO implement actual prod third party connections
 *     throw new NotConnectedError("…which connection…");
 *   }
 *   ```
 *
 * Both are on unless the environment says otherwise (`IS_MOCK=false`, `IS_TEMP_MOCK=false`; in a
 * browser build `VITE_IS_MOCK` / `VITE_IS_TEMP_MOCK`). Production is `IS_MOCK=false` and
 * `IS_TEMP_MOCK=false`; a polished mock is `IS_MOCK=true` and `IS_TEMP_MOCK=false`. Production
 * running temporary mock logic (`IS_MOCK=false`, `IS_TEMP_MOCK=true`) is refused as this loads.
 * `tests/flags.test.ts` keeps every use in that shape.
 */

/** A flag from the environment: the server's (`process.env`), else a browser build's (`VITE_<name>`). */
function flag(name: string, fallback: boolean): boolean {
  const server = typeof process !== "undefined" ? process.env?.[name] : undefined;
  const browser = (import.meta as { env?: Record<string, string | undefined> }).env?.[`VITE_${name}`];
  const v = (server ?? browser)?.trim().toLowerCase();
  if (v === undefined || v === "") return fallback;
  return !["false", "0", "no", "off"].includes(v);
}

/** Temporary demo logic may run (see above). Off: each such path throws `TempMockError`. */
export const IS_TEMP_MOCK: boolean = flag("IS_TEMP_MOCK", true);

/** The third parties are simulated (see above). Off: the real connections run (`NotConnectedError` until written). */
export const IS_MOCK: boolean = flag("IS_MOCK", true);

/** A temporary mock path reached with `IS_TEMP_MOCK` off: its polished logic isn't written yet. */
export class TempMockError extends Error {
  constructor(what: string) {
    super(`Not implemented without IS_TEMP_MOCK: ${what}`);
    this.name = "TempMockError";
  }
}

/** A third party reached with `IS_MOCK` off: its production connection isn't written yet. */
export class NotConnectedError extends Error {
  constructor(what: string) {
    super(`No production connection yet (IS_MOCK is off): ${what}`);
    this.name = "NotConnectedError";
  }
}

if (!IS_MOCK && IS_TEMP_MOCK)
  throw new Error("Production (IS_MOCK=false) can't run temporary mock logic: set IS_TEMP_MOCK=false.");
