/**
 * A data table's filter conditions and the Payload `where` they make
 * (payloadcms.com/docs/queries/overview). Shared by `<ui-filter-builder>` (which edits them) and
 * the pages that query with them (e.g. restoring filters from the URL).
 */

export type FilterFieldType = "text" | "number" | "date" | "select" | "boolean";
export interface FilterChoice {
  label: string;
  value: string;
}
export interface FilterField {
  /** The field's path, as Payload queries it (`stage`, `customer`, `totals.usd`). */
  name: string;
  label: string;
  type: FilterFieldType;
  /** `select`: the choices (for a relationship, the related documents' ids and titles). */
  options?: FilterChoice[];
}
export type FilterOperator =
  | "like"
  | "not_like"
  | "equals"
  | "not_equals"
  | "in"
  | "not_in"
  | "greater_than"
  | "greater_than_equal"
  | "less_than"
  | "less_than_equal"
  | "exists";
/** A condition's value: text, a number, a date (`yyyy-mm-dd`), picked options, or yes / no. */
export type FilterValue = string | number | boolean | string[];
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}
export type FilterMatch = "and" | "or";

/** Whether a condition has everything it needs to filter. */
export function filterComplete(c: FilterCondition): boolean {
  if (c.operator === "exists" || typeof c.value === "boolean") return true;
  if (Array.isArray(c.value)) return c.value.length > 0;
  return c.value != null && String(c.value).trim() !== "";
}

/** The conditions as a Payload `where`. Dates filter by whole days: after the end of one, before its start. */
export function filterWhere(
  conditions: FilterCondition[],
  match: FilterMatch = "and",
  fields: FilterField[] = [],
): Record<string, unknown> | undefined {
  const parts = conditions.filter(filterComplete).map((c) => {
    const type = fields.find((f) => f.name === c.field)?.type;
    let value: unknown = c.value;
    if (type === "number" && typeof value === "string") value = Number(value);
    if (type === "date" && typeof value === "string" && c.operator !== "exists")
      value = new Date(`${value}T${c.operator === "greater_than" ? "23:59:59.999" : "00:00:00.000"}`).toISOString();
    return { [c.field]: { [c.operator]: value } };
  });
  if (!parts.length) return undefined;
  return parts.length === 1 ? parts[0] : { [match]: parts };
}
