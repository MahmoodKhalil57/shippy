import type { CollectionConfig, GlobalConfig, Where } from "payload";
import type { Doc, FieldLike, BackendConfig, PaginatedDocs } from "../../types.ts";
import { hashPassword, randomHex, signToken, verifyPassword, verifyToken } from "./auth.ts";
import {
  applyDefaults,
  blockFields,
  childFields,
  dataFields,
  joinFields,
  merge,
  runFieldHooks,
  dropVirtual,
  sanitize,
  validate,
  type FieldError,
} from "./fields.ts";
import { matches, paginate, sortDocs, valuesAt } from "../../payload/index.ts";
import { applySelect, selects, type JoinQuery, type Joins, type Select } from "../../payload/index.ts";
import type { Store } from "./store.ts";
import { inLocale, localeRead, toStored, type LocaleRead } from "./locales.ts";
import {
  APIError,
  clone,
  forbidden,
  isObject,
  notFound,
  objectId,
  plural,
  singular,
  text,
} from "../../payload/index.ts";

export interface MockRequest {
  payload: Engine;
  user: (Doc & { collection: string }) | null;
  payloadAPI: "REST" | "local";
  context: Record<string, unknown>;
  headers: Headers;
  method?: string;
  url?: string;
  query?: Record<string, unknown>;
  routeParams?: Record<string, string>;
  data?: unknown;
  json?: () => Promise<unknown>;
  formData?: () => Promise<FormData>;
  locale?: string;
  fallbackLocale?: string | false;
}

export interface FileInput {
  data: Blob;
  name: string;
  mimetype?: string;
  size?: number;
}

interface Common {
  req?: Partial<MockRequest>;
  overrideAccess?: boolean;
  depth?: number;
  showHiddenFields?: boolean;
  context?: Record<string, unknown>;
  select?: Select;
  populate?: Record<string, Select>;
  joins?: Joins;
  locale?: string;
  fallbackLocale?: string | false;
}

interface ReadOptions {
  depth: number;
  override: boolean;
  showHidden?: boolean;
  findMany?: boolean;
  select?: Select;
  populate?: Record<string, Select>;
  joins?: Joins;
}

type Hook = (args: Record<string, unknown>) => unknown;
type HookName =
  | "beforeOperation"
  | "beforeValidate"
  | "beforeChange"
  | "afterChange"
  | "beforeRead"
  | "afterRead"
  | "beforeDelete"
  | "afterDelete";

const DEFAULT_DEPTH = 2;

export class Engine {
  readonly config: BackendConfig;
  readonly store: Store;
  readonly apiRoute: string;
  private readonly collections = new Map<string, CollectionConfig>();
  private readonly globals = new Map<string, GlobalConfig>();
  private secret?: string;

  constructor(config: BackendConfig, store: Store, options: { apiRoute?: string } = {}) {
    this.config = config;
    this.store = store;
    this.apiRoute = options.apiRoute ?? "/api";
    for (const c of config.collections) this.collections.set(c.slug, c);
    for (const g of config.globals ?? []) this.globals.set(g.slug, g);
  }

  collection(slug: string): CollectionConfig {
    const c = this.collections.get(slug);
    if (!c) throw new APIError(`Collection "${slug}" not found`, 404, undefined, "NotFound");
    return c;
  }

  global(slug: string): GlobalConfig {
    const g = this.globals.get(slug);
    if (!g) throw new APIError(`Global "${slug}" not found`, 404, undefined, "NotFound");
    return g;
  }

  hasCollection = (slug: string) => this.collections.has(slug);
  hasGlobal = (slug: string) => this.globals.has(slug);

  fields(slug: string): FieldLike[] {
    const c = this.collection(slug);
    const own = c.fields as unknown as FieldLike[];
    const extra: FieldLike[] = [];
    const has = (name: string) => dataFields(own).some((f) => f.name === name);
    if (c.auth && !has("email")) extra.push({ name: "email", type: "email", required: true, unique: true });
    if (c.upload) {
      for (const [name, type] of [
        ["filename", "text"],
        ["mimeType", "text"],
        ["filesize", "number"],
        ["width", "number"],
        ["height", "number"],
        ["url", "text"],
      ] as const) {
        if (!has(name)) extra.push({ name, type, admin: { readOnly: true }, unique: name === "filename" });
      }
    }
    return [...extra, ...own];
  }

  globalFields(slug: string): FieldLike[] {
    return this.global(slug).fields as unknown as FieldLike[];
  }

  get userSlug(): string | undefined {
    return this.config.admin?.user ?? this.config.collections.find((c) => c.auth)?.slug;
  }

  labels(slug: string) {
    const c = this.collection(slug);
    return { singular: singular(slug, c.labels), plural: plural(slug, c.labels) };
  }

  private req(args: Common & { user?: MockRequest["user"] }): MockRequest {
    const r = args.req ?? {};
    return {
      payload: this,
      user: r.user ?? args.user ?? null,
      payloadAPI: r.payloadAPI ?? "local",
      context: { ...r.context, ...args.context },
      headers: r.headers ?? new Headers(),
      ...r,
      locale: args.locale ?? r.locale,
      fallbackLocale: args.fallbackLocale ?? r.fallbackLocale,
    } as MockRequest;
  }

  private reading(req: MockRequest): LocaleRead | undefined {
    return localeRead(this.config.localization, req.locale, req.fallbackLocale);
  }

  private writing(req: MockRequest): LocaleRead | undefined {
    const r = this.reading(req);
    return r && r.locale === "all" ? { ...r, locale: r.defaultLocale } : r;
  }

  private select(fields: FieldLike[], docs: Doc[], req: MockRequest, where?: Where, sort?: unknown) {
    const r = this.writing(req);
    if (!r)
      return sortDocs(
        docs.filter((d) => matches(d, where)),
        sort,
      );
    const stored = new Map<Doc, Doc>();
    const views: Doc[] = [];
    for (const d of docs) {
      const v = inLocale(fields, d, r);
      if (!matches(v, where)) continue;
      stored.set(v, d);
      views.push(v);
    }
    return sortDocs(views, sort).map((v) => stored.get(v)!);
  }

  private async hooks<T>(
    owner: { hooks?: unknown },
    name: HookName,
    args: Record<string, unknown>,
    key: string,
    value: T,
  ): Promise<T> {
    const list = ((owner.hooks as Record<string, Hook[]> | undefined)?.[name] ?? []) as Hook[];
    let current = value;
    for (const hook of list) {
      const result = await hook({ ...args, [key]: current });
      if (result !== undefined) current = result as T;
    }
    return current;
  }

  private async access(
    owner: CollectionConfig | GlobalConfig,
    op: "read" | "create" | "update" | "delete",
    req: MockRequest,
    override: boolean,
    extra: Record<string, unknown> = {},
  ): Promise<Where | null> {
    if (override) return null;
    const fn =
      (owner.access as Record<string, ((a: unknown) => unknown) | undefined> | undefined)?.[op] ??
      ((a: unknown) => Boolean((a as { req: MockRequest }).req.user));
    const result = await fn({ req, ...extra });
    if (result === true) return null;
    if (!result) throw forbidden();
    return result as Where;
  }

  private async unique(slug: string, fields: FieldLike[], doc: Record<string, unknown>, id?: string) {
    const errors: FieldError[] = [];
    const others = (await this.store.all(slug)).filter((d) => d.id !== id);
    for (const f of dataFields(fields)) {
      if (!f.unique || doc[f.name!] == null || doc[f.name!] === "") continue;
      const value = doc[f.name!];
      const norm = (v: unknown) => (f.type === "email" && typeof v === "string" ? v.toLowerCase() : v);
      if (others.some((d) => norm(d[f.name!]) === norm(value))) {
        errors.push({ path: f.name!, message: "Value must be unique" });
      }
    }
    return errors;
  }

  private validationError(slug: string, errors: FieldError[]) {
    const names = errors.map((e) => e.path).join(", ");
    return new APIError(
      `The following field${errors.length > 1 ? "s are" : " is"} invalid: ${names}`,
      400,
      { collection: slug, errors },
      "ValidationError",
    );
  }

  private async readFields(
    fields: FieldLike[],
    data: Record<string, unknown>,
    root: Record<string, unknown>,
    ctx: {
      req: MockRequest;
      depth: number;
      override: boolean;
      showHidden: boolean;
      populate?: Record<string, Select>;
    },
  ) {
    for (const f of dataFields(fields)) {
      const name = f.name!;
      if (f.hidden && !ctx.showHidden) {
        delete data[name];
        continue;
      }
      if (!ctx.override && f.access?.read && !(await f.access.read({ req: ctx.req, doc: root, siblingData: data }))) {
        delete data[name];
        continue;
      }
      const v = data[name];
      if (f.type === "group" && isObject(v)) await this.readFields(childFields(f), v, root, ctx);
      if ((f.type === "array" || f.type === "blocks") && Array.isArray(v)) {
        for (const row of v) {
          if (!isObject(row)) continue;
          await this.readFields(f.type === "array" ? childFields(f) : blockFields(f, row.blockType), row, root, ctx);
        }
      }
      if ((f.type === "relationship" || f.type === "upload") && ctx.depth > 0 && v != null) {
        data[name] = await this.populate(f, v, ctx);
      }
    }
  }

  private async populate(
    f: FieldLike,
    value: unknown,
    ctx: { req: MockRequest; depth: number; override: boolean; populate?: Record<string, Select> },
  ): Promise<unknown> {
    const one = async (relationTo: string, id: unknown) => {
      if (isObject(id) || id == null || !this.hasCollection(relationTo)) return id;
      try {
        const target = this.collection(relationTo) as CollectionConfig & { defaultPopulate?: Select };
        return await this.findByID({
          collection: relationTo,
          id: text(id),
          depth: ctx.depth - 1,
          req: ctx.req,
          overrideAccess: ctx.override,
          select: ctx.populate?.[relationTo] ?? target.defaultPopulate,
          populate: ctx.populate,
          joins: false,
        });
      } catch {
        return id;
      }
    };
    const resolve = async (v: unknown) => {
      if (Array.isArray(f.relationTo)) {
        if (!isObject(v) || typeof v.relationTo !== "string") return v;
        return { relationTo: v.relationTo, value: await one(v.relationTo, v.value) };
      }
      return one(f.relationTo as string, v);
    };
    return Array.isArray(value) ? Promise.all(value.map(resolve)) : resolve(value);
  }

  private async afterRead(slug: string, doc: Doc, req: MockRequest, opts: ReadOptions): Promise<Doc> {
    const c = this.collection(slug);
    let d = inLocale(this.fields(slug), clone(doc), this.reading(req));
    d = await this.hooks(c, "beforeRead", { req, collection: c, context: req.context }, "doc", d);
    await this.readFields(this.fields(slug), d, d, {
      req,
      depth: opts.depth,
      override: opts.override,
      showHidden: !!opts.showHidden,
      populate: opts.populate,
    });
    if (opts.joins !== false) {
      for (const f of joinFields(this.fields(slug))) {
        const query = opts.joins?.[f.name!];
        if (query === false || !selects(opts.select, f.name!)) continue;
        d[f.name!] = await this.join(f, d, query ?? {}, req, opts);
      }
    }
    await runFieldHooks("afterRead", this.fields(slug), d, {
      root: d,
      req,
      operation: "read",
      collection: c,
      context: req.context,
    });
    if (c.upload && typeof d.filename === "string") {
      d.url = `${this.apiRoute}/${slug}/file/${encodeURIComponent(d.filename)}`;
    }
    if (c.auth) {
      delete d.salt;
      delete d.hash;
      delete d.password;
    }
    d = await this.hooks(
      c,
      "afterRead",
      { req, collection: c, context: req.context, findMany: opts.findMany },
      "doc",
      d,
    );
    return applySelect(d, opts.select);
  }

  private async join(f: FieldLike, doc: Doc, query: JoinQuery, req: MockRequest, opts: ReadOptions) {
    const field = f as FieldLike & {
      collection: string;
      on: string;
      where?: Where;
      defaultLimit?: number;
      defaultSort?: string;
    };
    const where: Where = {
      and: [
        { [field.on]: { equals: doc.id } },
        ...(field.where ? [field.where] : []),
        ...(query.where ? [query.where] : []),
      ],
    };
    const page = await this.find({
      collection: field.collection,
      where,
      sort: query.sort ?? field.defaultSort,
      limit: query.limit ?? field.defaultLimit ?? 10,
      page: query.page ?? 1,
      depth: Math.max(0, opts.depth - 1),
      req,
      overrideAccess: opts.override,
      populate: opts.populate,
      joins: false,
    });
    return {
      docs: opts.depth > 0 ? page.docs : page.docs.map((d) => d.id),
      hasNextPage: page.hasNextPage,
      ...(query.count ? { totalDocs: page.totalDocs } : {}),
    };
  }

  private async prepare(
    slug: string,
    op: "create" | "update",
    incoming: Record<string, unknown>,
    original: Doc | undefined,
    req: MockRequest,
    override: boolean,
  ): Promise<Record<string, unknown>> {
    const c = this.collection(slug);
    const fields = this.fields(slug);
    const args = { req, operation: op, collection: c, context: req.context, originalDoc: original };

    const password = typeof incoming.password === "string" ? incoming.password : undefined;
    const r = this.writing(req);
    const view = original && inLocale(fields, original, r);
    let data = sanitize(fields, inLocale(fields, incoming, r));
    if (op === "create" && typeof incoming.id === "string" && incoming.id) data.id = incoming.id;

    data = await this.hooks(c, "beforeValidate", args, "data", data);
    let doc = op === "create" ? data : merge(fields, view ?? {}, data);
    await runFieldHooks("beforeValidate", fields, doc, { ...args, root: doc, original });
    if (op === "create") await applyDefaults(fields, doc, { user: req.user, req });

    if (!override) {
      for (const f of dataFields(fields)) {
        const fn = f.access?.[op];
        if (fn && !(await fn({ req, data: doc, siblingData: doc, doc: original }))) {
          if (original && f.name! in original) doc[f.name!] = original[f.name!];
          else delete doc[f.name!];
        }
      }
    }

    const errors = [
      ...(await validate(fields, doc, {
        root: doc,
        options: { req, operation: op, id: original?.id, user: req.user },
        lookup: (collection, id) => this.store.get(collection, id),
      })),
      ...(await this.unique(slug, fields, doc, original?.id)),
    ];
    if (c.auth && op === "create" && !password) errors.push({ path: "password", message: "This field is required." });
    if (errors.length) throw this.validationError(slug, errors);

    doc = await this.hooks(c, "beforeChange", args, "data", doc);
    await runFieldHooks("beforeChange", fields, doc, { ...args, root: doc, original });
    dropVirtual(fields, doc);

    if (c.auth && password) Object.assign(doc, await hashPassword(password));
    if (c.auth && original) {
      doc.salt ??= original.salt;
      doc.hash ??= original.hash;
    }
    return toStored(fields, doc, original, this.reading(req), incoming);
  }

  private async storeFile(slug: string, file: FileInput, previous?: Doc) {
    const base = file.name.replace(/[^\w.-]+/g, "-");
    const dot = base.lastIndexOf(".");
    const [stem, ext] = dot > 0 ? [base.slice(0, dot), base.slice(dot)] : [base, ""];
    let filename = base;
    for (let i = 1; await this.store.getFile(slug, filename); i++) {
      if (previous?.filename === filename) break;
      filename = `${stem}-${i}${ext}`;
    }
    const type = file.mimetype ?? (file.data.type || "application/octet-stream");
    await this.store.putFile(slug, filename, { blob: file.data, type });
    const meta: Record<string, unknown> = { filename, mimeType: type, filesize: file.size ?? file.data.size };
    if (type.startsWith("image/") && typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file.data);
        meta.width = bitmap.width;
        meta.height = bitmap.height;
        bitmap.close();
      } catch {}
    }
    if (previous?.filename && previous.filename !== filename) {
      await this.store.deleteFile(slug, text(previous.filename));
    }
    return meta;
  }

  private async guardQuery(slug: string, where: Where | undefined, req: MockRequest, override: boolean) {
    if (override || !where) return;
    const paths: string[] = [];
    const walk = (w: Where) => {
      for (const [key, value] of Object.entries(w)) {
        if (key === "and" || key === "or") for (const inner of value as Where[]) walk(inner);
        else paths.push(key);
      }
    };
    walk(where);
    const hidden: string[] = [];
    for (const path of paths) {
      let fields = this.fields(slug);
      for (const part of path.split(".")) {
        const f = dataFields(fields).find((x) => x.name === part);
        if (!f) break;
        if (f.access?.read && !(await f.access.read({ req, doc: undefined, siblingData: undefined }))) {
          hidden.push(path);
          break;
        }
        if (f.type !== "group" && f.type !== "array") break;
        fields = childFields(f);
      }
    }
    if (hidden.length)
      throw new APIError(`The following paths cannot be queried: ${hidden.join(", ")}`, 400, undefined, "QueryError");
  }

  async find(
    args: Common & {
      collection: string;
      where?: Where;
      sort?: string | string[];
      limit?: number;
      page?: number;
      pagination?: boolean;
    },
  ): Promise<PaginatedDocs> {
    const req = this.req(args);
    const c = this.collection(args.collection);
    const override = args.overrideAccess ?? true;
    const constraint = await this.access(c, "read", req, override);
    await this.guardQuery(args.collection, args.where, req, override);
    const where: Where | undefined = constraint
      ? args.where
        ? { and: [args.where, constraint] }
        : constraint
      : args.where;
    const docs = this.select(
      this.fields(args.collection),
      await this.store.all(args.collection),
      req,
      where,
      args.sort ?? c.defaultSort ?? (c.timestamps === false ? undefined : "-createdAt"),
    );
    const page = paginate(docs, args.limit ?? 10, args.page ?? 1, args.pagination ?? true);
    const depth = args.depth ?? DEFAULT_DEPTH;
    page.docs = await Promise.all(
      page.docs.map((d) =>
        this.afterRead(args.collection, d, req, {
          depth,
          override,
          showHidden: args.showHiddenFields,
          findMany: true,
          select: args.select,
          populate: args.populate,
          joins: args.joins,
        }),
      ),
    );
    return page;
  }

  async findByID(args: Common & { collection: string; id: string; disableErrors?: boolean }): Promise<Doc> {
    const req = this.req(args);
    const c = this.collection(args.collection);
    const override = args.overrideAccess ?? true;
    const constraint = await this.access(c, "read", req, override, { id: args.id });
    const doc = await this.store.get(args.collection, args.id);
    if (!doc || (constraint && !this.select(this.fields(args.collection), [doc], req, constraint).length)) {
      if (args.disableErrors) return null as unknown as Doc;
      throw notFound();
    }
    return this.afterRead(args.collection, doc, req, {
      depth: args.depth ?? DEFAULT_DEPTH,
      override,
      showHidden: args.showHiddenFields,
      select: args.select,
      populate: args.populate,
      joins: args.joins,
    });
  }

  async count(args: Common & { collection: string; where?: Where }) {
    const req = this.req(args);
    const constraint = await this.access(this.collection(args.collection), "read", req, args.overrideAccess ?? true);
    await this.guardQuery(args.collection, args.where, req, args.overrideAccess ?? true);
    const where = constraint ? (args.where ? { and: [args.where, constraint] } : constraint) : args.where;
    const all = await this.store.all(args.collection);
    return { totalDocs: this.select(this.fields(args.collection), all, req, where).length };
  }

  async create(args: Common & { collection: string; data: Record<string, unknown>; file?: FileInput }): Promise<Doc> {
    const req = this.req(args);
    const c = this.collection(args.collection);
    const override = args.overrideAccess ?? true;
    await this.access(c, "create", req, override, { data: args.data });
    let data = { ...args.data };
    data = await this.hooks(c, "beforeOperation", { req, operation: "create", collection: c }, "args", {
      data,
    }).then((a) => (a as { data: Record<string, unknown> }).data ?? data);
    if (c.upload) {
      if (args.file) Object.assign(data, await this.storeFile(args.collection, args.file));
      else if (!data.filename) throw new APIError("No files were uploaded.", 400, undefined, "MissingFile");
    }
    const prepared = await this.prepare(args.collection, "create", data, undefined, req, override);
    const now = new Date().toISOString();
    const doc: Doc = {
      ...prepared,
      id: typeof prepared.id === "string" ? prepared.id : objectId(),
      ...(c.timestamps === false
        ? {}
        : {
            createdAt: typeof args.data.createdAt === "string" ? args.data.createdAt : now,
            updatedAt: typeof args.data.updatedAt === "string" ? args.data.updatedAt : now,
          }),
    };
    if (await this.store.get(args.collection, doc.id)) {
      throw this.validationError(args.collection, [{ path: "id", message: "Value must be unique" }]);
    }
    await this.store.put(args.collection, doc);
    const read = await this.afterRead(args.collection, doc, req, { depth: args.depth ?? DEFAULT_DEPTH, override });
    await runFieldHooks("afterChange", this.fields(args.collection), read, {
      root: read,
      req,
      operation: "create",
      collection: c,
      context: req.context,
    });
    return this.hooks(
      c,
      "afterChange",
      { req, operation: "create", collection: c, previousDoc: {}, context: req.context },
      "doc",
      read,
    );
  }

  update(
    args: Common & { collection: string; id: string; data: Record<string, unknown>; file?: FileInput },
  ): Promise<Doc>;
  update(
    args: Common & { collection: string; where: Where; data: Record<string, unknown> },
  ): Promise<{ docs: Doc[]; errors: { id: string; message: string }[] }>;
  async update(
    args: Common & { collection: string; id?: string; where?: Where; data: Record<string, unknown>; file?: FileInput },
  ): Promise<Doc | { docs: Doc[]; errors: { id: string; message: string }[] }> {
    if (args.id === undefined) {
      const req = this.req(args);
      const constraint = await this.access(
        this.collection(args.collection),
        "update",
        req,
        args.overrideAccess ?? true,
        { data: args.data },
      );
      const where = constraint ? { and: [args.where ?? {}, constraint] } : args.where;
      const targets = this.select(this.fields(args.collection), await this.store.all(args.collection), req, where);
      const docs: Doc[] = [];
      const errors: { id: string; message: string }[] = [];
      for (const t of targets) {
        try {
          docs.push(await this.update({ ...args, id: t.id, where: undefined } as typeof args & { id: string }));
        } catch (e) {
          errors.push({ id: t.id, message: (e as Error).message });
        }
      }
      return { docs, errors };
    }
    const req = this.req(args);
    const c = this.collection(args.collection);
    const override = args.overrideAccess ?? true;
    const original = await this.store.get(args.collection, args.id);
    if (!original) throw notFound();
    const constraint = await this.access(c, "update", req, override, { id: args.id, data: args.data });
    if (constraint && !this.select(this.fields(args.collection), [original], req, constraint).length) throw forbidden();
    const data = { ...args.data };
    if (c.upload && args.file) Object.assign(data, await this.storeFile(args.collection, args.file, original));
    const previous = await this.afterRead(args.collection, original, req, { depth: 0, override: true });
    const prepared = await this.prepare(args.collection, "update", data, original, req, override);
    const doc: Doc = {
      ...prepared,
      id: original.id,
      ...(c.timestamps === false ? {} : { createdAt: original.createdAt, updatedAt: new Date().toISOString() }),
    };
    await this.store.put(args.collection, doc);
    const read = await this.afterRead(args.collection, doc, req, { depth: args.depth ?? DEFAULT_DEPTH, override });
    await runFieldHooks("afterChange", this.fields(args.collection), read, {
      root: read,
      req,
      operation: "update",
      collection: c,
      context: req.context,
      originalDoc: previous,
    });
    return this.hooks(
      c,
      "afterChange",
      { req, operation: "update", collection: c, previousDoc: previous, context: req.context },
      "doc",
      read,
    );
  }

  delete(args: Common & { collection: string; id: string }): Promise<Doc>;
  delete(
    args: Common & { collection: string; where: Where },
  ): Promise<{ docs: Doc[]; errors: { id: string; message: string }[] }>;
  async delete(
    args: Common & { collection: string; id?: string; where?: Where },
  ): Promise<Doc | { docs: Doc[]; errors: { id: string; message: string }[] }> {
    if (args.id === undefined) {
      const req = this.req(args);
      const constraint = await this.access(
        this.collection(args.collection),
        "delete",
        req,
        args.overrideAccess ?? true,
      );
      const where = constraint ? { and: [args.where ?? {}, constraint] } : args.where;
      const targets = this.select(this.fields(args.collection), await this.store.all(args.collection), req, where);
      const docs: Doc[] = [];
      const errors: { id: string; message: string }[] = [];
      for (const t of targets) {
        try {
          docs.push(await this.delete({ ...args, id: t.id, where: undefined } as typeof args & { id: string }));
        } catch (e) {
          errors.push({ id: t.id, message: (e as Error).message });
        }
      }
      return { docs, errors };
    }
    const req = this.req(args);
    const c = this.collection(args.collection);
    const override = args.overrideAccess ?? true;
    const original = await this.store.get(args.collection, args.id);
    if (!original) throw notFound();
    const constraint = await this.access(c, "delete", req, override, { id: args.id });
    if (constraint && !this.select(this.fields(args.collection), [original], req, constraint).length) throw forbidden();
    await this.hooks(c, "beforeDelete", { req, collection: c, context: req.context }, "id", args.id);
    const read = await this.afterRead(args.collection, original, req, { depth: args.depth ?? 0, override });
    await this.store.delete(args.collection, args.id);
    if (c.upload && typeof original.filename === "string")
      await this.store.deleteFile(args.collection, original.filename);
    return this.hooks(c, "afterDelete", { req, collection: c, id: args.id, context: req.context }, "doc", read);
  }

  async references(collection: string, id: string) {
    const out: { collection: string; id: string; path: string }[] = [];
    for (const c of this.config.collections) {
      const rels = dataFields(c.fields as unknown as FieldLike[]).filter(
        (f) =>
          (f.type === "relationship" || f.type === "upload") &&
          (Array.isArray(f.relationTo) ? f.relationTo.includes(collection) : f.relationTo === collection),
      );
      if (!rels.length) continue;
      for (const d of await this.store.all(c.slug)) {
        for (const f of rels)
          if (valuesAt(d, f.name!).some((v) => v === id || (isObject(v) && v.value === id))) {
            out.push({ collection: c.slug, id: d.id, path: f.name! });
          }
      }
    }
    return out;
  }

  async findGlobal(args: Common & { slug: string }): Promise<Record<string, unknown>> {
    const req = this.req(args);
    const g = this.global(args.slug);
    const override = args.overrideAccess ?? true;
    await this.access(g, "read", req, override);
    const fields = this.globalFields(args.slug);
    let doc: Record<string, unknown> = inLocale(
      fields,
      (await this.store.getGlobal(args.slug)) ?? {},
      this.reading(req),
    );
    await applyDefaults(fields, doc, { user: req.user, req });
    doc = await this.hooks(g, "beforeRead", { req, global: g, context: req.context }, "doc", doc);
    await this.readFields(fields, doc, doc, {
      req,
      depth: args.depth ?? DEFAULT_DEPTH,
      override,
      showHidden: !!args.showHiddenFields,
      populate: args.populate,
    });
    await runFieldHooks("afterRead", fields, doc, {
      root: doc,
      req,
      operation: "read",
      global: g,
      context: req.context,
    });
    doc = await this.hooks(g, "afterRead", { req, global: g, context: req.context }, "doc", {
      globalType: args.slug,
      ...doc,
    });
    return applySelect(doc, args.select);
  }

  async updateGlobal(args: Common & { slug: string; data: Record<string, unknown> }) {
    const req = this.req(args);
    const g = this.global(args.slug);
    const override = args.overrideAccess ?? true;
    await this.access(g, "update", req, override, { data: args.data });
    const fields = this.globalFields(args.slug);
    const stored = (await this.store.getGlobal(args.slug)) ?? {};
    const original = inLocale(fields, stored, this.writing(req));
    const hookArgs = { req, global: g, context: req.context, originalDoc: original };
    let data = sanitize(fields, inLocale(fields, args.data, this.writing(req)));
    data = await this.hooks(g, "beforeValidate", hookArgs, "data", data);
    let doc = merge(fields, original, data);
    await applyDefaults(fields, doc, { user: req.user, req });
    const errors = await validate(fields, doc, {
      root: doc,
      options: { req, operation: "update", user: req.user },
      lookup: (slug, id) => this.store.get(slug, id),
    });
    if (errors.length) throw this.validationError(args.slug, errors);
    doc = await this.hooks(g, "beforeChange", hookArgs, "data", doc);
    await runFieldHooks("beforeChange", fields, doc, { ...hookArgs, root: doc, original, operation: "update" });
    doc.updatedAt = new Date().toISOString();
    doc.createdAt ??= doc.updatedAt;
    await this.store.putGlobal(args.slug, toStored(fields, doc, stored, this.reading(req), args.data));
    const read = await this.findGlobal({ ...args, overrideAccess: true });
    return this.hooks(g, "afterChange", { ...hookArgs, previousDoc: original }, "doc", read);
  }

  async getSecret() {
    if (this.config.secret) return this.config.secret;
    this.secret ??= (await this.store.getMeta<string>("secret")) ?? undefined;
    if (!this.secret) {
      this.secret = randomHex(32);
      await this.store.setMeta("secret", this.secret);
    }
    return this.secret;
  }

  private tokenExpiration(slug: string) {
    const auth = this.collection(slug).auth;
    return (isObject(auth) && typeof auth.tokenExpiration === "number" ? auth.tokenExpiration : undefined) ?? 7200;
  }

  async login(args: Common & { collection: string; data: { email?: string; password?: string } }) {
    const c = this.collection(args.collection);
    if (!c.auth) throw new APIError(`Collection "${args.collection}" is not an auth collection`, 400);
    const email = String(args.data.email ?? "").toLowerCase();
    const user = (await this.store.all(args.collection)).find(
      (d) => typeof d.email === "string" && d.email.toLowerCase() === email,
    );
    const ok =
      user &&
      typeof user.salt === "string" &&
      typeof user.hash === "string" &&
      (await verifyPassword(String(args.data.password ?? ""), user.salt, user.hash));
    if (!ok) throw new APIError("The email or password provided is incorrect.", 401, undefined, "AuthenticationError");
    const { token, exp } = await signToken(
      { id: user.id, collection: args.collection, email: user.email },
      await this.getSecret(),
      this.tokenExpiration(args.collection),
    );
    const req = this.req(args);
    const read = await this.afterRead(args.collection, user, req, {
      depth: args.depth ?? DEFAULT_DEPTH,
      override: true,
    });
    return { user: { ...read, collection: args.collection }, token, exp };
  }

  async userFromToken(token: string | null | undefined): Promise<(Doc & { collection: string }) | null> {
    if (!token) return null;
    const payload = await verifyToken(token, await this.getSecret());
    if (!payload || !this.hasCollection(payload.collection)) return null;
    const user = await this.store.get(payload.collection, payload.id);
    if (!user) return null;
    const read = await this.afterRead(payload.collection, user, this.req({}), { depth: 0, override: true });
    return { ...read, collection: payload.collection };
  }

  async refresh(user: Doc & { collection: string }) {
    return signToken(
      { id: user.id, collection: user.collection, email: user.email },
      await this.getSecret(),
      this.tokenExpiration(user.collection),
    );
  }

  async permissions(req: MockRequest) {
    const can = async (owner: CollectionConfig | GlobalConfig, op: "read" | "create" | "update" | "delete") => {
      try {
        await this.access(owner, op, req, false);
        return { permission: true };
      } catch {
        return { permission: false };
      }
    };
    const collections: Record<string, Record<string, { permission: boolean }>> = {};
    for (const c of this.config.collections) {
      collections[c.slug] = {
        create: await can(c, "create"),
        read: await can(c, "read"),
        update: await can(c, "update"),
        delete: await can(c, "delete"),
      };
    }
    const globals: Record<string, Record<string, { permission: boolean }>> = {};
    for (const g of this.config.globals ?? []) {
      globals[g.slug] = { read: await can(g, "read"), update: await can(g, "update") };
    }
    return { canAccessAdmin: !!req.user && req.user.collection === this.userSlug, collections, globals };
  }
}
