import { cva, cx } from "class-variance-authority";

/**
 * Responsive CVA recipes.
 *
 * `rcva` is a drop-in replacement for `cva` whose variant values also accept a
 * responsive spec, using Tailwind's breakpoints:
 *
 *   size="sm lg:lg"                  -> btn-sm lg:btn-lg
 *   direction="vertical lg:horizontal" -> menu-vertical lg:menu-horizontal
 *   wide="lg"   (boolean variant)    -> lg:btn-wide
 *   side="true" / side               -> card-side
 *   compact="max-md"  (boolean)      -> max-md:timeline-compact
 *
 * A bare value applies at every width; `<bp>:<value>` applies from that
 * breakpoint up, `max-<bp>:<value>` below it. For boolean variants a bare
 * breakpoint means "on in that range". Responsive values can only switch a
 * variant on (or to another value); they can't remove a base class, so use
 * `max-*` for "only on small screens".
 *
 * The prefixed classes are built at runtime, so Tailwind can't see them in the
 * source. plugins/component-css.ts reads each recipe's variant config and adds
 * only the responsive classes the app actually uses: enum options written as
 * `<bp>:<value>`, and boolean variants where a bare breakpoint is assigned to
 * the attribute/property that feeds them (`force-open="lg"`). Write responsive
 * values literally (in attributes or string literals) so they are found.
 */

export const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl", "max-sm", "max-md", "max-lg", "max-xl", "max-2xl"] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

type ClassValue = Parameters<typeof cva>[0];
type Schema = Record<string, Record<string, ClassValue>>;
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
type Value<T extends Schema, K extends keyof T> = StringToBoolean<keyof T[K]>;

/** A variant value or a responsive spec string (see module docs). */
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

/**
 * Split a responsive spec into the base value and `[breakpoint, value]` pairs.
 * Returns null when `raw` is a plain option value.
 */
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

/**
 * Lit converter for boolean variant properties so they accept responsive
 * specs: `<ui-button wide>` -> true, `wide="lg"` -> "lg", `wide="false"` -> false.
 * Declare as `@property({ converter: responsiveBoolean }) open: Responsive<boolean> = false;`
 */
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

/**
 * Lit converter for plain (non-responsive) booleans that default to `true`:
 * unlike `type: Boolean`, `attr="false"` turns them off from HTML.
 * Declare as `@property({ converter: booleanAttribute }) closeButton = true;`
 */
export const booleanAttribute = {
  fromAttribute: (value: string | null) => value !== null && value !== "false",
  toAttribute: (value: boolean) => (value ? "" : "false"),
};

/** True when a (possibly responsive) boolean variant is on at any width. */
export const isOn = (value: Responsive<boolean> | null | undefined) =>
  value !== false && value != null && value !== "false";
