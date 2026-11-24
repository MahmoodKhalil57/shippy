import type { D1Database } from "@cloudflare/workers-types/index.ts";
import { readFileSync } from "node:fs";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

/**
 * D1's API (the parts the store uses: `prepare` / `bind` / `first` / `all` / `run`, `batch`, `exec`)
 * over Node's SQLite, which D1 is: the store, the migrations and the seed SQL run against a real
 * SQLite database in Node, the same statements D1 runs.
 */
export function sqliteD1(): D1Database & { exec(sql: string): Promise<unknown> } {
  const db = new DatabaseSync(":memory:");
  const statement = (sql: string, args: unknown[] = []) => {
    const params = args.map((a) => (a === undefined ? null : a)) as SQLInputValue[];
    const s = {
      bind: (...next: unknown[]) => statement(sql, next),
      first: async <T>() => (db.prepare(sql).get(...params) as T | undefined) ?? null,
      all: async <T>() => ({ results: db.prepare(sql).all(...params) as T[], success: true, meta: {} }),
      run: async () => {
        const r = db.prepare(sql).run(...params);
        return { success: true, results: [], meta: { changes: Number(r.changes) } };
      },
    };
    return s;
  };
  return {
    prepare: (sql: string) => statement(sql),
    batch: async (stmts: { run: () => Promise<unknown> }[]) => {
      db.exec("BEGIN");
      try {
        const out = [];
        for (const s of stmts) out.push(await s.run());
        db.exec("COMMIT");
        return out;
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
    exec: async (sql: string) => db.exec(sql),
  } as unknown as D1Database & { exec(sql: string): Promise<unknown> };
}

/** A database with cf-runner's tables (../migrations). */
export async function migrated() {
  const db = sqliteD1();
  await db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
  return db;
}
