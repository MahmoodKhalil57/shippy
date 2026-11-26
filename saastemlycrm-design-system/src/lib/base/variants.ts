import { cva, cx } from "class-variance-authority";

export const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl", "max-sm", "max-md", "max-lg", "max-xl", "max-2xl"] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

type ClassValue = Parameters<typeof cva>[0];
type Schema = Record<string, Record<string, ClassValue>>;
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
type Value<T extends Schema, K extends keyof T> = StringToBoolean<keyof T[K]>;

export type Responsive<V> =
  | V
  | `${Breakpoint}:${string}`
  | `${string} ${string}`
  | (boolean extends V ? Breakpoint | "true" | "false" : never);

type RcvaConfig<T extends Schema> = {
  variants?: T;
  defaultVariants?: { [K in keyof T]?: Value<T, K> | null };
  compoundVariants?: ({ [K in keyof T]?: Value<T, K> | Value<T, K>[] | null } & {
    class?: ClassValue;
    className?: ClassValue;
  })[];
};

export type RcvaProps<T extends Schema> = { [K in keyof T]?: Responsive<Value<T, K>> | null } & {
  class?: ClassValue;
  className?: ClassValue;
};

const isBreakpoint = (s: string): s is Breakpoint => (BREAKPOINTS as readonly string[]).includes(s);

export function parseResponsive(raw: string, options: Record<string, unknown>) {
  if (raw in options) return null;
  const boolean = "true" in options || "false" in options;
  let base: string | boolean | undefined;
  const at: [Breakpoint, string][] = [];
  for (const token of raw.split(/\s+/).filter(Boolean)) {
    const i = token.indexOf(":");
    if (i > 0 && isBreakpoint(token.slice(0, i))) at.push([token.slice(0, i) as Breakpoint, token.slice(i + 1)]);
    else if (boolean && isBreakpoint(token)) at.push([token, "true"]);
    else if (boolean) base = token !== "false";
    else base = token;
  }
  return { base, at };
}

export function rcva<T extends Schema>(base?: ClassValue, config?: RcvaConfig<T>) {
  const recipe = cva<T>(base, config as never);
  const variants = (config?.variants ?? {}) as Schema;
  return (props: RcvaProps<T> = {} as RcvaProps<T>): string => {
    const plain: Record<string, unknown> = {};
    const responsive: string[] = [];
    for (const [key, value] of Object.entries(props)) {
      if (key === "class" || key === "className") continue;
      const options = variants[key];
      const parsed = options && typeof value === "string" ? parseResponsive(value, options) : null;
      if (!parsed) {
        plain[key] = value;
        continue;
      }
      plain[key] = parsed.base;
      for (const [bp, v] of parsed.at) {
        for (const c of cx(options[v]).split(/\s+/).filter(Boolean)) responsive.push(`${bp}:${c}`);
      }
    }
    return recipe({ ...plain, class: [props.class, props.className, responsive] } as never);
  };
}

export const responsiveBoolean = {
  fromAttribute(value: string | null): Responsive<boolean> {
    if (value === null || value === "false") return false;
    if (value === "" || value === "true") return true;
    return value as Responsive<boolean>;
  },
  toAttribute(value: Responsive<boolean>): string | null {
    if (value === false) return null;
    return value === true ? "" : value;
  },
};

export const booleanAttribute = {
  fromAttribute: (value: string | null) => value !== null && value !== "false",
  toAttribute: (value: boolean) => (value ? "" : "false"),
};

export const isOn = (value: Responsive<boolean> | null | undefined) =>
  value !== false && value != null && value !== "false";
