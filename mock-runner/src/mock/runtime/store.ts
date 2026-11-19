import type { Doc } from "saastemlycrm-design-system/contracts";
import { clone, text } from "saastemlycrm-design-system/payload";

/** A stored upload. */
export interface StoredFile {
  blob: Blob;
  type: string;
}

/** Everything the mock backend keeps, as a portable snapshot. */
export interface Snapshot {
  collections: Record<string, Doc[]>;
  globals: Record<string, Record<string, unknown>>;
  files?: { collection: string; filename: string; type: string; base64: string }[];
}

/** Where documents, globals, uploads and bookkeeping live. */
export interface Store {
  all(collection: string): Promise<Doc[]>;
  get(collection: string, id: string): Promise<Doc | undefined>;
  put(collection: string, doc: Doc): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  getGlobal(slug: string): Promise<Record<string, unknown> | undefined>;
  putGlobal(slug: string, doc: Record<string, unknown>): Promise<void>;
  getFile(collection: string, filename: string): Promise<StoredFile | undefined>;
  putFile(collection: string, filename: string, file: StoredFile): Promise<void>;
  deleteFile(collection: string, filename: string): Promise<void>;
  listFiles(): Promise<{ collection: string; filename: string; file: StoredFile }[]>;
  getMeta<T>(key: string): Promise<T | undefined>;
  setMeta(key: string, value: unknown): Promise<void>;
  /** Removes documents, globals and files (bookkeeping such as the secret stays). */
  clear(): Promise<void>;
}

/** In-memory store (tests, or when IndexedDB isn't available). */
export class MemoryStore implements Store {
  protected docs = new Map<string, Map<string, Doc>>();
  protected globals = new Map<string, Record<string, unknown>>();
  protected files = new Map<string, StoredFile>();
  protected meta = new Map<string, unknown>();

  protected col(collection: string) {
    let m = this.docs.get(collection);
    if (!m) this.docs.set(collection, (m = new Map()));
    return m;
  }

  async all(collection: string) {
    return [...this.col(collection).values()].map(clone);
  }
  async get(collection: string, id: string) {
    const d = this.col(collection).get(id);
    return d && clone(d);
  }
  async put(collection: string, doc: Doc) {
    this.col(collection).set(doc.id, clone(doc));
  }
  async delete(collection: string, id: string) {
    this.col(collection).delete(id);
  }
  async getGlobal(slug: string) {
    const g = this.globals.get(slug);
    return g && clone(g);
  }
  async putGlobal(slug: string, doc: Record<string, unknown>) {
    this.globals.set(slug, clone(doc));
  }
  async getFile(collection: string, filename: string) {
    return this.files.get(`${collection}/${filename}`);
  }
  async putFile(collection: string, filename: string, file: StoredFile) {
    this.files.set(`${collection}/${filename}`, file);
  }
  async deleteFile(collection: string, filename: string) {
    this.files.delete(`${collection}/${filename}`);
  }
  async listFiles() {
    return [...this.files].map(([key, file]) => {
      const i = key.indexOf("/");
      return { collection: key.slice(0, i), filename: key.slice(i + 1), file };
    });
  }
  async getMeta<T>(key: string) {
    return this.meta.get(key) as T | undefined;
  }
  async setMeta(key: string, value: unknown) {
    this.meta.set(key, value);
  }
  async clear() {
    this.docs.clear();
    this.globals.clear();
    this.files.clear();
  }
}

const STORES = ["docs", "globals", "files", "meta"] as const;
type StoreName = (typeof STORES)[number];

const promised = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

/**
 * IndexedDB store with an in-memory cache. Keys are `<collection>/<id>`, so the
 * schema never needs an upgrade when collections change.
 */
export class IndexedDbStore extends MemoryStore {
  private db?: Promise<IDBDatabase>;
  private loaded?: Promise<void>;

  private name: string;

  constructor(name = "shippy-mock-backend") {
    super();
    this.name = name;
  }

  private open() {
    this.db ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, 1);
      request.onupgradeneeded = () => {
        for (const s of STORES) if (!request.result.objectStoreNames.contains(s)) request.result.createObjectStore(s);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.db;
  }

  private async tx(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest) {
    const db = await this.open();
    return promised(fn(db.transaction(store, mode).objectStore(store)));
  }

  /** Loads everything into memory once. */
  private load() {
    this.loaded ??= (async () => {
      const db = await this.open();
      const read = async (store: StoreName) => {
        const s = db.transaction(store).objectStore(store);
        const [keys, values] = await Promise.all([promised(s.getAllKeys()), promised(s.getAll())]);
        return keys.map((k, i) => [text(k), values[i]] as const);
      };
      for (const [key, doc] of await read("docs")) {
        const i = key.indexOf("/");
        this.col(key.slice(0, i)).set(key.slice(i + 1), doc as Doc);
      }
      for (const [key, doc] of await read("globals")) this.globals.set(key, doc as Record<string, unknown>);
      for (const [key, file] of await read("files")) this.files.set(key, file as StoredFile);
      for (const [key, value] of await read("meta")) this.meta.set(key, value);
    })();
    return this.loaded;
  }

  async all(collection: string) {
    await this.load();
    return super.all(collection);
  }
  async get(collection: string, id: string) {
    await this.load();
    return super.get(collection, id);
  }
  async put(collection: string, doc: Doc) {
    await this.load();
    await super.put(collection, doc);
    await this.tx("docs", "readwrite", (s) => s.put(clone(doc), `${collection}/${doc.id}`));
  }
  async delete(collection: string, id: string) {
    await this.load();
    await super.delete(collection, id);
    await this.tx("docs", "readwrite", (s) => s.delete(`${collection}/${id}`));
  }
  async getGlobal(slug: string) {
    await this.load();
    return super.getGlobal(slug);
  }
  async putGlobal(slug: string, doc: Record<string, unknown>) {
    await this.load();
    await super.putGlobal(slug, doc);
    await this.tx("globals", "readwrite", (s) => s.put(clone(doc), slug));
  }
  async getFile(collection: string, filename: string) {
    await this.load();
    return super.getFile(collection, filename);
  }
  async putFile(collection: string, filename: string, file: StoredFile) {
    await this.load();
    await super.putFile(collection, filename, file);
    await this.tx("files", "readwrite", (s) => s.put(file, `${collection}/${filename}`));
  }
  async deleteFile(collection: string, filename: string) {
    await this.load();
    await super.deleteFile(collection, filename);
    await this.tx("files", "readwrite", (s) => s.delete(`${collection}/${filename}`));
  }
  async listFiles() {
    await this.load();
    return super.listFiles();
  }
  async getMeta<T>(key: string) {
    await this.load();
    return super.getMeta<T>(key);
  }
  async setMeta(key: string, value: unknown) {
    await this.load();
    await super.setMeta(key, value);
    await this.tx("meta", "readwrite", (s) => s.put(value, key));
  }
  async clear() {
    await this.load();
    await super.clear();
    for (const s of ["docs", "globals", "files"] as const) await this.tx(s, "readwrite", (store) => store.clear());
  }
}
