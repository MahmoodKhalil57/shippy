import type { FieldLike } from "../../types.ts";
import type { Where } from "payload";
import { matches } from "../../payload/index.ts";
import { isObject, objectId } from "../../payload/index.ts";

const PRESENTATIONAL = new Set(["row", "collapsible"]);

export function dataFields(fields: FieldLike[]): FieldLike[] {
  const out: FieldLike[] = [];
  for (const f of fields) {
    if (PRESENTATIONAL.has(f.type)) out.push(...dataFields(f.fields ?? []));
    else if (f.type === "tabs") {
      for (const tab of f.tabs ?? []) {
        if (tab.name) out.push({ type: "group", name: tab.name, label: tab.label, fields: tab.fields });
        else out.push(...dataFields(tab.fields));
      }
    } else if (f.name && f.type !== "ui" && f.type !== "join") out.push(f);
  }
  return out;
}

export function joinFields(fields: FieldLike[]): FieldLike[] {
  return fields.flatMap((f): FieldLike[] => {
    if (f.type === "join" && f.name) return [f];
    if (PRESENTATIONAL.has(f.type)) return joinFields(f.fields ?? []);
    if (f.type === "tabs") return (f.tabs ?? []).flatMap((tab) => (tab.name ? [] : joinFields(tab.fields)));
    return [];
  });
}

export const childFields = (f: FieldLike) => dataFields(f.fields ?? []);

export const blockFields = (f: FieldLike, blockType: unknown) =>
  dataFields(f.blocks?.find((b) => b.slug === blockType)?.fields ?? []);

export const optionValues = (f: FieldLike) => (f.options ?? []).map((o) => (typeof o === "string" ? o : o.value));

export function sanitize(fields: FieldLike[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of dataFields(fields)) {
    const name = f.name!;
    if (!(name in data)) continue;
    const v = data[name];
    if (f.type === "group") out[name] = isObject(v) ? sanitize(childFields(f), v) : v;
    else if (f.type === "array" && Array.isArray(v)) {
      out[name] = v.map((row) =>
        isObject(row)
          ? { ...sanitize(childFields(f), row), id: typeof row.id === "string" ? row.id : objectId() }
          : row,
      );
    } else if (f.type === "blocks" && Array.isArray(v)) {
      out[name] = v.map((row) =>
        isObject(row)
          ? {
              ...sanitize(blockFields(f, row.blockType), row),
              blockType: row.blockType,
              id: typeof row.id === "string" ? row.id : objectId(),
            }
          : row,
      );
    } else out[name] = coerce(f, v);
  }
  return out;
}

function coerce(f: FieldLike, v: unknown): unknown {
  if (v === "" && ["number", "date", "relationship", "upload", "select", "radio"].includes(f.type)) return null;
  if (f.type === "number") {
    const n = (x: unknown) => (typeof x === "string" && x.trim() !== "" && !isNaN(Number(x)) ? Number(x) : x);
    return Array.isArray(v) ? v.map(n) : n(v);
  }
  if (f.type === "checkbox" && typeof v === "string") return v === "true" || v === "on";
  return v;
}

export function merge(fields: FieldLike[], original: Record<string, unknown>, data: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...original };
  for (const f of dataFields(fields)) {
    const name = f.name!;
    if (!(name in data)) continue;
    out[name] =
      f.type === "group" && isObject(original[name]) && isObject(data[name])
        ? merge(childFields(f), original[name], data[name])
        : data[name];
  }
  return out;
}

export async function applyDefaults(
  fields: FieldLike[],
  data: Record<string, unknown>,
  args: Record<string, unknown>,
): Promise<void> {
  for (const f of dataFields(fields)) {
    const name = f.name!;
    if (data[name] === undefined && f.defaultValue !== undefined) {
      data[name] =
        typeof f.defaultValue === "function"
          ? await (f.defaultValue as (a: unknown) => unknown)(args)
          : structuredClone(f.defaultValue);
    }
    if (f.type === "group") {
      if (data[name] === undefined) data[name] = {};
      if (isObject(data[name])) await applyDefaults(childFields(f), data[name], args);
    }
    if (f.type === "array" && Array.isArray(data[name])) {
      for (const row of data[name]) if (isObject(row)) await applyDefaults(childFields(f), row, args);
    }
    if (f.type === "blocks" && Array.isArray(data[name])) {
      for (const row of data[name]) if (isObject(row)) await applyDefaults(blockFields(f, row.blockType), row, args);
    }
  }
}

export interface FieldError {
  path: string;
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const empty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

export async function validate(
  fields: FieldLike[],
  data: Record<string, unknown>,
  ctx: {
    root: Record<string, unknown>;
    path?: string;
    options: Record<string, unknown>;
    lookup?: (collection: string, id: string) => Promise<Record<string, unknown> | null | undefined>;
  },
): Promise<FieldError[]> {
  const errors: FieldError[] = [];
  for (const f of dataFields(fields)) {
    const name = f.name!;
    const path = ctx.path ? `${ctx.path}.${name}` : name;
    const v = data[name];
    const fail = (message: string) => errors.push({ path, message });

    if (f.required && empty(v) && f.type !== "checkbox" && f.type !== "group") {
      fail("This field is required.");
      continue;
    }
    if (!empty(v)) {
      const values = Array.isArray(v) && f.hasMany ? v : [v];
      switch (f.type) {
        case "text":
        case "textarea":
        case "code":
          for (const s of values) {
            if (typeof s !== "string") fail("This field must be text.");
            else if (f.minLength != null && s.length < f.minLength)
              fail(`This value is shorter than the minimum allowed length of ${f.minLength} characters.`);
            else if (f.maxLength != null && s.length > f.maxLength)
              fail(`This value is longer than the maximum allowed length of ${f.maxLength} characters.`);
          }
          break;
        case "email":
          if (typeof v !== "string" || !EMAIL.test(v)) fail("Please enter a valid email address.");
          break;
        case "number":
          for (const n of values) {
            if (typeof n !== "number" || Number.isNaN(n)) fail(`"${String(n)}" is not a valid number.`);
            else if (f.min != null && n < f.min) fail(`"${n}" is less than the min allowed value of ${f.min}.`);
            else if (f.max != null && n > f.max) fail(`"${n}" is greater than the max allowed value of ${f.max}.`);
          }
          break;
        case "date":
          if (typeof v !== "string" || Number.isNaN(Date.parse(v))) fail(`"${String(v)}" is not a valid date.`);
          break;
        case "checkbox":
          if (typeof v !== "boolean") fail("This field can only be equal to true or false.");
          break;
        case "select":
        case "radio": {
          let allowed = optionValues(f);
          if (f.type === "select" && typeof f.filterOptions === "function") {
            const offered = (await f.filterOptions({
              data: ctx.root,
              siblingData: data,
              options: f.options ?? [],
              req: ctx.options.req,
            })) as FieldLike["options"];
            if (Array.isArray(offered)) allowed = offered.map((o) => (typeof o === "string" ? o : o.value));
          }
          if (values.some((x) => !allowed.includes(x as string))) fail("This field has an invalid selection.");
          break;
        }
        case "relationship":
        case "upload": {
          if (!f.filterOptions || !ctx.lookup) break;
          const invalid: string[] = [];
          for (const x of values) {
            const poly = isObject(x) && "relationTo" in x;
            const relationTo = poly ? String(x.relationTo) : String(f.relationTo);
            const raw = poly ? (x as { value: unknown }).value : x;
            const id = String(isObject(raw) ? raw.id : raw);
            const filter =
              typeof f.filterOptions === "function"
                ? await f.filterOptions({
                    data: ctx.root,
                    siblingData: data,
                    id: ctx.root.id,
                    relationTo,
                    user: ctx.options.user,
                    req: ctx.options.req,
                  })
                : f.filterOptions;
            if (filter === true || filter == null) continue;
            const doc = filter === false ? null : await ctx.lookup(relationTo, id);
            if (!doc || !matches(doc, filter as Where)) invalid.push(id);
          }
          if (invalid.length)
            fail(`This relationship field has the following invalid selections: ${invalid.join(", ")}`);
          break;
        }
        case "point":
          if (!Array.isArray(v) || v.length !== 2 || v.some((n) => typeof n !== "number"))
            fail("This field requires two numbers.");
          break;
        case "array":
        case "blocks": {
          if (!Array.isArray(v)) {
            fail("This field must be a list of rows.");
            break;
          }
          if (f.minRows != null && v.length < f.minRows) fail(`This field requires at least ${f.minRows} row(s).`);
          if (f.maxRows != null && v.length > f.maxRows) fail(`This field requires no more than ${f.maxRows} row(s).`);
          const allowedBlocks =
            f.type === "blocks" && typeof f.filterOptions === "function"
              ? await f.filterOptions({ data: ctx.root, siblingData: data })
              : true;
          for (const [i, row] of v.entries()) {
            if (!isObject(row)) continue;
            if (Array.isArray(allowedBlocks) && !allowedBlocks.includes(row.blockType)) {
              errors.push({
                path: `${path}.${i}`,
                message: `Block type "${String(row.blockType)}" isn't allowed here.`,
              });
              continue;
            }
            const rowFields = f.type === "array" ? childFields(f) : blockFields(f, row.blockType);
            if (f.type === "blocks" && !f.blocks?.some((b) => b.slug === row.blockType)) {
              errors.push({ path: `${path}.${i}`, message: `Unknown block type "${String(row.blockType)}".` });
              continue;
            }
            errors.push(...(await validate(rowFields, row, { ...ctx, path: `${path}.${i}` })));
          }
          break;
        }
      }
    }
    if (f.type === "group" && isObject(v)) {
      errors.push(...(await validate(childFields(f), v, { ...ctx, path })));
    }
    if (f.validate && !errors.some((e) => e.path === path)) {
      const result = await f.validate(v, { ...ctx.options, data: ctx.root, siblingData: data, path });
      if (result !== true) fail(typeof result === "string" ? result : "This field is invalid.");
    }
  }
  return errors;
}

export async function runFieldHooks(
  kind: "beforeValidate" | "beforeChange" | "afterChange" | "afterRead",
  fields: FieldLike[],
  data: Record<string, unknown>,
  args: Record<string, unknown> & { root: Record<string, unknown>; original?: Record<string, unknown> },
): Promise<void> {
  for (const f of dataFields(fields)) {
    const name = f.name!;
    const v = data[name];
    if (f.type === "group" && isObject(v)) {
      await runFieldHooks(kind, childFields(f), v, {
        ...args,
        original: isObject(args.original?.[name]) ? args.original[name] : undefined,
      });
    }
    if ((f.type === "array" || f.type === "blocks") && Array.isArray(v)) {
      for (const row of v) {
        if (!isObject(row)) continue;
        const rowFields = f.type === "array" ? childFields(f) : blockFields(f, row.blockType);
        await runFieldHooks(kind, rowFields, row, { ...args, original: undefined });
      }
    }
    for (const hook of f.hooks?.[kind] ?? []) {
      const { root, original, ...rest } = args;
      const result = await hook({
        ...rest,
        value: data[name],
        previousValue: original?.[name],
        originalDoc: args.originalDoc,
        data: root,
        siblingData: data,
        field: f,
      });
      if (result !== undefined) data[name] = result;
    }
  }
}

export function dropVirtual(fields: FieldLike[], data: Record<string, unknown>): void {
  for (const f of dataFields(fields)) {
    const name = f.name!;
    const v = data[name];
    if (f.virtual) delete data[name];
    else if (f.type === "group" && isObject(v)) dropVirtual(childFields(f), v);
    else if ((f.type === "array" || f.type === "blocks") && Array.isArray(v))
      for (const row of v)
        if (isObject(row)) dropVirtual(f.type === "array" ? childFields(f) : blockFields(f, row.blockType), row);
  }
}
