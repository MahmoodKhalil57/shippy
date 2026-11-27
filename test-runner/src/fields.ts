import { dataFields, type FieldLike } from "mock-runner/server";

export interface FieldAt {
  path: string;
  field: FieldLike;
}

export function everyField(fields: FieldLike[], at = ""): FieldAt[] {
  return dataFields(fields).flatMap((field) => {
    const path = at ? `${at}.${field.name}` : field.name!;
    const own: FieldAt[] = [{ path, field }];
    if (field.type === "group" || field.type === "array") return [...own, ...everyField(field.fields ?? [], path)];
    if (field.type === "blocks")
      return [...own, ...(field.blocks ?? []).flatMap((b) => everyField(b.fields ?? [], `${path}[${b.slug}]`))];
    return own;
  });
}

export const targetsOf = (field: FieldLike): string[] =>
  field.type === "relationship" || field.type === "upload" ? [field.relationTo ?? []].flat().map(String) : [];

export const optionValues = (field: FieldLike): string[] =>
  (field.options ?? []).map((o) => (typeof o === "string" ? o : String((o as { value: unknown }).value)));

export function valuesAt(doc: unknown, fields: FieldLike[], visit: (field: FieldLike, value: unknown) => void) {
  if (!doc || typeof doc !== "object") return;
  const record = doc as Record<string, unknown>;
  for (const field of dataFields(fields)) {
    const value = record[field.name!];
    if (value === undefined || value === null) continue;
    visit(field, value);
    if (field.type === "group") valuesAt(value, field.fields ?? [], visit);
    if (field.type === "array" && Array.isArray(value))
      for (const row of value) valuesAt(row, field.fields ?? [], visit);
    if (field.type === "blocks" && Array.isArray(value))
      for (const row of value) {
        const block = (field.blocks ?? []).find((b) => b.slug === (row as { blockType?: string }).blockType);
        if (block) valuesAt(row, block.fields ?? [], visit);
      }
  }
}
