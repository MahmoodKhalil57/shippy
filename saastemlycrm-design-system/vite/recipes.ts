import { parseSync } from "vite/rolldown/utils";

export const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl", "max-sm", "max-md", "max-lg", "max-xl", "max-2xl"] as const;

type AstNode = { type: string; [key: string]: unknown };
const isNode = (v: unknown): v is AstNode => typeof v === "object" && v !== null && "type" in v;

const keyName = (key: unknown): string | undefined => {
  if (!isNode(key)) return undefined;
  if (key.type === "Identifier") return key.name as string;
  if (key.type === "Literal") return String(key.value);
  return undefined;
};

function staticClasses(node: unknown): string | null {
  if (!isNode(node)) return null;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && (node.expressions as unknown[]).length === 0) {
    return (node.quasis as { value: { cooked?: string } }[]).map((q) => q.value.cooked ?? "").join("");
  }
  if (node.type === "ArrayExpression") {
    const parts = (node.elements as unknown[]).map(staticClasses);
    return parts.every((p) => p !== null) ? parts.join(" ") : null;
  }
  return null;
}

export type RecipeVariants = Record<string, Record<string, string>>;

export function recipeVariants(source: string, filename: string): RecipeVariants[] {
  const { program } = parseSync(filename, source);
  const recipes: RecipeVariants[] = [];
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isNode(node)) return;
    const callee = node.callee as AstNode | undefined;
    if (
      node.type === "CallExpression" &&
      callee?.type === "Identifier" &&
      ["cva", "rcva"].includes(callee.name as string)
    ) {
      const config = (node.arguments as unknown[])[1];
      const variantsProp = isNode(config)
        ? (config.properties as AstNode[] | undefined)?.find((p) => keyName(p.key) === "variants")
        : undefined;
      const recipe: RecipeVariants = {};
      if (variantsProp && isNode(variantsProp.value) && variantsProp.value.type === "ObjectExpression") {
        for (const variant of variantsProp.value.properties as AstNode[]) {
          const name = keyName(variant.key);
          if (!name || !isNode(variant.value) || variant.value.type !== "ObjectExpression") continue;
          const options: Record<string, string> = {};
          for (const option of variant.value.properties as AstNode[]) {
            const optionName = keyName(option.key);
            const classes = staticClasses(option.value);
            if (optionName !== undefined && classes !== null) options[optionName] = classes;
          }
          recipe[name] = options;
        }
      }
      recipes.push(recipe);
    }
    for (const v of Object.values(node)) visit(v);
  };
  visit(program);
  return recipes;
}

const BP_ALT = BREAKPOINTS.join("|");
const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function responsiveTokens(source: string): Set<string> {
  const out = new Set<string>();
  for (const m of source.matchAll(new RegExp(`(?<![\\w-])(${BP_ALT}):([a-z0-9][a-z0-9-]*)`, "g"))) {
    out.add(`${m[1]}:${m[2]}`);
  }
  const assignment = /([A-Za-z][\w-]*)\s*[=:]\s*(?:\$\{\s*)?(["'`])([^"'`\n]*)\2/g;
  for (const m of source.matchAll(assignment)) {
    const name = m[1].replace(/^[.?]/, "");
    for (const token of m[3].split(/\s+/)) {
      if (!(BREAKPOINTS as readonly string[]).includes(token)) continue;
      out.add(`${name}|${token}`);
      out.add(`${camel(name)}|${token}`);
    }
  }
  return out;
}

function thisMembers(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    for (const n of node) thisMembers(n, out);
    return out;
  }
  if (!isNode(node)) return out;
  if (node.type === "MemberExpression" && (node.object as AstNode).type === "ThisExpression") {
    const name = keyName(node.property);
    if (name) out.add(name);
  }
  for (const v of Object.values(node)) thisMembers(v, out);
  return out;
}

export function booleanBindings(source: string, filename: string): Map<string, Set<string>> {
  const { program } = parseSync(filename, source);
  const attributes = new Map<string, string>();
  const bindings = new Map<string, Set<string>>();
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isNode(node)) return;
    if (node.type === "PropertyDefinition") {
      const name = keyName(node.key);
      for (const d of (node.decorators as AstNode[] | undefined) ?? []) {
        const call = d.expression as AstNode;
        const options = isNode(call) && call.type === "CallExpression" ? (call.arguments as AstNode[])[0] : undefined;
        const props = (isNode(options) ? (options.properties as AstNode[] | undefined) : undefined) ?? [];
        const converter = props.find((p) => keyName(p.key) === "converter");
        if (!name || !converter || (converter.value as { name?: string }).name !== "responsiveBoolean") continue;
        const attr = props.find((p) => keyName(p.key) === "attribute");
        const attrName =
          attr && isNode(attr.value) && attr.value.type === "Literal" ? String(attr.value.value) : undefined;
        attributes.set(name, attrName ?? name.toLowerCase());
      }
    }
    const variant = node.type === "Property" ? keyName(node.key) : undefined;
    if (variant && isNode(node.value)) {
      for (const property of thisMembers(node.value)) {
        if (!bindings.has(variant)) bindings.set(variant, new Set());
        bindings.get(variant)!.add(property);
      }
    }
    for (const v of Object.values(node)) visit(v);
  };
  visit(program);
  const out = new Map<string, Set<string>>();
  for (const [variant, properties] of bindings) {
    const names = new Set<string>([variant]);
    for (const p of properties) {
      if (!attributes.has(p)) continue;
      names.add(p);
      names.add(attributes.get(p)!);
    }
    out.set(variant, names);
  }
  return out;
}

export function responsiveSafelist(
  recipes: RecipeVariants[],
  tokens: Set<string>,
  bindings: Map<string, Set<string>> = new Map(),
): string[] {
  const out = new Set<string>();
  const add = (bp: string, classes: string) => {
    for (const c of classes.split(/\s+/).filter(Boolean)) out.add(`${bp}:${c}`);
  };
  for (const recipe of recipes) {
    for (const [variant, options] of Object.entries(recipe)) {
      const names = bindings.get(variant) ?? new Set([variant]);
      for (const [value, classes] of Object.entries(options)) {
        for (const bp of BREAKPOINTS) {
          const used =
            tokens.has(`${bp}:${value}`) ||
            (value === "true" && [variant, ...names].some((n) => tokens.has(`${n}|${bp}`)));
          if (used) add(bp, classes);
        }
      }
    }
  }
  return [...out].sort();
}

export function classStrings(source: string, filename: string): { classes: string[]; styles: string[] } {
  const { program } = parseSync(filename, source);
  const classes: string[] = [];
  const styles: string[] = [];
  const COMPARISON = new Set(["===", "!==", "==", "!="]);
  const NOT_CLASSES = new Set(["defaultVariants", "compoundVariants"]);
  const strings = (node: unknown, take: (s: string) => void): void => {
    if (Array.isArray(node)) return node.forEach((n) => strings(n, take));
    if (!isNode(node)) return;
    if (node.type === "BinaryExpression" && COMPARISON.has(node.operator as string)) return;
    if (node.type === "Property" && NOT_CLASSES.has(keyName(node.key) ?? "")) {
      if (keyName(node.key) === "compoundVariants") {
        const items = ((node.value as AstNode).elements as AstNode[] | undefined) ?? [];
        for (const item of items)
          for (const p of (item?.properties as AstNode[] | undefined) ?? [])
            if (["class", "className"].includes(keyName(p.key) ?? "")) strings(p.value, take);
      }
      return;
    }
    if (node.type === "CallExpression" && (node.callee as AstNode).type === "Identifier") return;
    if (node.type === "Literal" && typeof node.value === "string") take(node.value);
    if (node.type === "TemplateElement") take((node.value as { cooked?: string }).cooked ?? "");
    for (const [k, v] of Object.entries(node)) if (k !== "key") strings(v, take);
  };
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isNode(node)) return;
    const callee = node.callee as AstNode | undefined;
    if (
      node.type === "CallExpression" &&
      callee?.type === "Identifier" &&
      ["cva", "rcva"].includes(callee.name as string)
    ) {
      strings(node.arguments, (s) => classes.push(s));
      return;
    }
    if (node.type === "Property" && ["class", "className"].includes(keyName(node.key) ?? "")) {
      strings(node.value, (s) => classes.push(s));
      return;
    }
    if (node.type === "TaggedTemplateExpression") {
      const quasi = node.quasi as { quasis: { value: { cooked?: string } }[]; expressions: unknown[] };
      for (const q of quasi.quasis) {
        const text = q.value.cooked ?? "";
        for (const m of text.matchAll(/\bclass="([^"]*)/g)) classes.push(m[1]);
        for (const m of text.matchAll(/\bstyle="([^"]*)/g)) styles.push(m[1]);
      }
      visit(quasi.expressions);
      return;
    }
    for (const v of Object.values(node)) visit(v);
  };
  visit(program);
  return { classes, styles };
}
