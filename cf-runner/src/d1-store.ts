import type { D1Database, R2Bucket } from "@cloudflare/workers-types/index.ts";
import type { Doc, Store, StoredFile } from "mock-runner/server";

/**
 * The backend's `Store` in Cloudflare D1 (and uploads in R2, `files`, when bound): the same
 * documents, globals, uploads and bookkeeping the browser's backend keeps in IndexedDB, in the
 * tables of ../migrations. One store per request: what it has read in that request it keeps (a
 * collection read whole, a document read by id), so the engine's many reads of one request
 * (populating relationships, joins, access) cost one query each, and its writes update what it
 * keeps. Nothing outlives the request, so no request sees another's data.
 */
export class D1Store implements Store {
  /** Collections read whole in this request. */
  readonly #collections = new Map<string, Map<string, Doc>>();
  /** Documents read by id in this request (`null`: not there). */
  readonly #docs = new Map<string, Doc | null>();
  readonly #db: D1Database;
  readonly #files?: R2Bucket;

  constructor(db: D1Database, files?: R2Bucket) {
    this.#db = db;
    this.#files = files;
  }

  static #key = (collection: string, id: string) => `${collection}\u0000${id}`;

  async all(collection: string): Promise<Doc[]> {
    let docs = this.#collections.get(collection);
    if (!docs) {
      const { results } = await this.#db
        .prepare("SELECT id, data FROM docs WHERE collection = ? ORDER BY rowid")
        .bind(collection)
        .all<{ id: string; data: string }>();
      docs = new Map(results.map((r) => [r.id, JSON.parse(r.data) as Doc]));
      this.#collections.set(collection, docs);
    }
    return [...docs.values()].map((d) => structuredClone(d));
  }

  async get(collection: string, id: string): Promise<Doc | undefined> {
    const whole = this.#collections.get(collection);
    if (whole) {
      const d = whole.get(id);
      return d && structuredClone(d);
    }
    const key = D1Store.#key(collection, id);
    if (!this.#docs.has(key)) {
      const row = await this.#db
        .prepare("SELECT data FROM docs WHERE collection = ? AND id = ?")
        .bind(collection, id)
        .first<{ data: string }>();
      this.#docs.set(key, row ? (JSON.parse(row.data) as Doc) : null);
    }
    const d = this.#docs.get(key);
    return d ? structuredClone(d) : undefined;
  }

  async put(collection: string, doc: Doc): Promise<void> {
    await this.#db
      .prepare(
        "INSERT INTO docs (collection, id, data) VALUES (?, ?, ?) ON CONFLICT (collection, id) DO UPDATE SET data = excluded.data",
      )
      .bind(collection, doc.id, JSON.stringify(doc))
      .run();
    const kept = structuredClone(doc);
    this.#collections.get(collection)?.set(doc.id, kept);
    this.#docs.set(D1Store.#key(collection, doc.id), kept);
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.#db.prepare("DELETE FROM docs WHERE collection = ? AND id = ?").bind(collection, id).run();
    this.#collections.get(collection)?.delete(id);
    this.#docs.set(D1Store.#key(collection, id), null);
  }

  async getGlobal(slug: string) {
    const row = await this.#db.prepare("SELECT data FROM globals WHERE slug = ?").bind(slug).first<{ data: string }>();
    return row ? (JSON.parse(row.data) as Record<string, unknown>) : undefined;
  }

  async putGlobal(slug: string, doc: Record<string, unknown>) {
    await this.#db
      .prepare("INSERT INTO globals (slug, data) VALUES (?, ?) ON CONFLICT (slug) DO UPDATE SET data = excluded.data")
      .bind(slug, JSON.stringify(doc))
      .run();
  }

  static #object = (collection: string, filename: string) => `${collection}/${filename}`;

  async getFile(collection: string, filename: string): Promise<StoredFile | undefined> {
    const row = await this.#db
      .prepare("SELECT type, body FROM files WHERE collection = ? AND filename = ?")
      .bind(collection, filename)
      .first<{ type: string; body: ArrayBuffer | number[] | null }>();
    if (!row) return undefined;
    if (this.#files) {
      const object = await this.#files.get(D1Store.#object(collection, filename));
      if (!object) return undefined;
      return { blob: new Blob([await object.arrayBuffer()], { type: row.type }), type: row.type };
    }
    const bytes = row.body instanceof ArrayBuffer ? new Uint8Array(row.body) : new Uint8Array(row.body ?? []);
    return { blob: new Blob([bytes], { type: row.type }), type: row.type };
  }

  async putFile(collection: string, filename: string, file: StoredFile) {
    const bytes = new Uint8Array(await file.blob.arrayBuffer());
    if (this.#files)
      await this.#files.put(D1Store.#object(collection, filename), bytes, { httpMetadata: { contentType: file.type } });
    await this.#db
      .prepare(
        "INSERT INTO files (collection, filename, type, body) VALUES (?, ?, ?, ?) ON CONFLICT (collection, filename) DO UPDATE SET type = excluded.type, body = excluded.body",
      )
      .bind(collection, filename, file.type, this.#files ? null : bytes)
      .run();
  }

  async deleteFile(collection: string, filename: string) {
    if (this.#files) await this.#files.delete(D1Store.#object(collection, filename));
    await this.#db.prepare("DELETE FROM files WHERE collection = ? AND filename = ?").bind(collection, filename).run();
  }

  async listFiles() {
    const { results } = await this.#db
      .prepare("SELECT collection, filename FROM files ORDER BY rowid")
      .all<{ collection: string; filename: string }>();
    const out: { collection: string; filename: string; file: StoredFile }[] = [];
    for (const r of results) {
      const file = await this.getFile(r.collection, r.filename);
      if (file) out.push({ ...r, file });
    }
    return out;
  }

  async getMeta<T>(key: string): Promise<T | undefined> {
    const row = await this.#db.prepare("SELECT value FROM meta WHERE key = ?").bind(key).first<{ value: string }>();
    return row ? (JSON.parse(row.value) as T) : undefined;
  }

  async setMeta(key: string, value: unknown) {
    await this.#db
      .prepare("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value")
      .bind(key, JSON.stringify(value ?? null))
      .run();
  }

  async clear() {
    if (this.#files) {
      const { results } = await this.#db
        .prepare("SELECT collection, filename FROM files")
        .all<{ collection: string; filename: string }>();
      for (const r of results) await this.#files.delete(D1Store.#object(r.collection, r.filename));
    }
    await this.#db.batch([
      this.#db.prepare("DELETE FROM docs"),
      this.#db.prepare("DELETE FROM globals"),
      this.#db.prepare("DELETE FROM files"),
    ]);
    this.#collections.clear();
    this.#docs.clear();
  }
}
