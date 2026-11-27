import { Engine, MemoryStore, RestApi, type BackendConfig, type Seeds } from "mock-runner/server";
import { authCollection, personNamed, project, seeds, type Person } from "./project.ts";

export class SnapshotStore extends MemoryStore {
  #saved?: {
    docs: Map<string, Map<string, unknown>>;
    globals: Map<string, unknown>;
    files: Map<string, unknown>;
    meta: Map<string, unknown>;
  };

  save() {
    this.#saved = {
      docs: new Map([...this.docs].map(([k, m]) => [k, new Map(m)])),
      globals: new Map(this.globals),
      files: new Map(this.files),
      meta: new Map(this.meta),
    };
  }

  restore() {
    const s = this.#saved!;
    this.docs = new Map([...s.docs].map(([k, m]) => [k, new Map(m)])) as typeof this.docs;
    this.globals = new Map(s.globals) as typeof this.globals;
    this.files = new Map(s.files) as typeof this.files;
    this.meta = new Map(s.meta);
  }
}

export interface Reply {
  status: number;
  body: unknown;
}

export interface Skipped {
  collection: string;
  id: string;
  reason: string;
}

export class Backend {
  readonly engine: Engine;
  readonly skipped: Skipped[];
  readonly #api: RestApi;
  readonly #store: SnapshotStore;
  readonly #tokens = new Map<string, string>();

  private constructor(engine: Engine, api: RestApi, store: SnapshotStore, skipped: Skipped[]) {
    this.engine = engine;
    this.#api = api;
    this.#store = store;
    this.skipped = skipped;
  }

  static async start(config: BackendConfig = project, data: Seeds = seeds): Promise<Backend> {
    const store = new SnapshotStore();
    const engine = new Engine(config, store);
    const api = new RestApi(engine, data, { session: "cookie", tools: false });
    const skipped: Skipped[] = [];
    const warn = console.warn;
    console.warn = (message: unknown, reason?: unknown) => {
      const m = /seed ([^/]+)\/(\S+) skipped:/.exec(String(message));
      if (m) skipped.push({ collection: m[1]!, id: m[2]!, reason: String(reason) });
      else warn(message, reason);
    };
    try {
      await api.ready();
    } finally {
      console.warn = warn;
    }
    store.save();
    return new Backend(engine, api, store, skipped);
  }

  reset() {
    this.#store.restore();
  }

  async signIn(person: Person): Promise<string> {
    const known = this.#tokens.get(person.email);
    if (known) return known;
    const r = await this.#api.handle(
      this.#request("POST", `/${authCollection().slug}/login`, { email: person.email, password: person.password }),
    );
    if (r.status !== 200) throw new Error(`${person.email} could not sign in: ${r.status} ${await r.text()}`);
    const token = /payload-token=([^;]*)/.exec(r.headers.get("set-cookie") ?? "")?.[1];
    if (!token) throw new Error(`${person.email} signed in without a session cookie.`);
    this.#tokens.set(person.email, token);
    return token;
  }

  async send(method: string, path: string, options: { body?: unknown; as?: Person | string } = {}): Promise<Reply> {
    const who = typeof options.as === "string" ? personNamed(options.as) : options.as;
    const token = who ? await this.signIn(who) : undefined;
    const r = await this.#api.handle(this.#request(method, path, options.body, token));
    const text = await r.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    return { status: r.status, body };
  }

  #request(method: string, path: string, body?: unknown, token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers.cookie = `payload-token=${token}`;
    if (body !== undefined) headers["content-type"] = "application/json";
    return new Request(`http://test.local${this.engine.apiRoute}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
}

let shared: Promise<Backend> | undefined;

export const backend = () => (shared ??= Backend.start());
