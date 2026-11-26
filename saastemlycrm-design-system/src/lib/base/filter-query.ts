export type FilterFieldType = "text" | "number" | "date" | "select" | "boolean";
export interface FilterChoice {
  label: string;
  value: string;
}
export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
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
export type FilterValue = string | number | boolean | string[];
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}
export type FilterMatch = "and" | "or";

export function filterComplete(c: FilterCondition): boolean {
  if (c.operator === "exists" || typeof c.value === "boolean") return true;
  if (Array.isArray(c.value)) return c.value.length > 0;
  return c.value != null && String(c.value).trim() !== "";
}

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
