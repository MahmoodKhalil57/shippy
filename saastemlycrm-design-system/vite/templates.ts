import { parseSync } from "vite/rolldown/utils";
import { BREAKPOINTS } from "./recipes.ts";

type AstNode = { type: string; [key: string]: unknown };
const isNode = (v: unknown): v is AstNode => typeof v === "object" && v !== null && "type" in v;

const keyName = (key: unknown): string | undefined => {
  if (!isNode(key)) return undefined;
  if (key.type === "Identifier") return key.name as string;
  if (key.type === "Literal") return String(key.value);
  return undefined;
};

const walk = (node: unknown, fn: (n: AstNode) => void | false): void => {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, fn));
  if (!isNode(node)) return;
  if (fn(node) === false) return;
  for (const v of Object.values(node)) if (typeof v === "object") walk(v, fn);
};

export type ValueSpec =
  | { kind: "tokens"; options: string[] }
  | { kind: "boolean"; responsive: boolean; allowFalse: boolean }
  | { kind: "literal"; options: string[] }
  | { kind: "number" }
  | { kind: "any" };

export interface ElementApi {
  tag: string;
  file: string;
  attributes: Map<string, ValueSpec>;
  properties: Map<string, ValueSpec>;
}

interface Scope {
  recipes: Map<string, Record<string, string[]>>;
  aliases: Map<string, AstNode>;
  objects: Map<string, string[]>;
}

const RECIPE_FACTORIES = new Set(["cva", "rcva"]);

function collectScope(program: AstNode, scope: Scope) {
  walk(program, (node) => {
    if (node.type === "VariableDeclarator" && isNode(node.id) && node.id.type === "Identifier") {
      const name = node.id.name as string;
      const init = node.init as AstNode | undefined;
      const callee = init?.callee as AstNode | undefined;
      if (
        init?.type === "CallExpression" &&
        callee?.type === "Identifier" &&
        RECIPE_FACTORIES.has(callee.name as string)
      ) {
        const config = (init.arguments as unknown[])[1];
        const variantsProp = isNode(config)
          ? (config.properties as AstNode[] | undefined)?.find((p) => keyName(p.key) === "variants")
          : undefined;
        const variants: Record<string, string[]> = {};
        if (isNode(variantsProp?.value) && variantsProp.value.type === "ObjectExpression") {
          for (const v of variantsProp.value.properties as AstNode[]) {
            const vName = keyName(v.key);
            if (vName && isNode(v.value) && v.value.type === "ObjectExpression") {
              variants[vName] = (v.value.properties as AstNode[]).map((o) => keyName(o.key)).filter((k) => k != null);
            }
          }
        }
        scope.recipes.set(name, variants);
      }
      let obj = init;
      while (obj && (obj.type === "TSAsExpression" || obj.type === "TSSatisfiesExpression")) {
        obj = obj.expression as AstNode;
      }
      if (obj?.type === "ObjectExpression") {
        scope.objects.set(
          name,
          (obj.properties as AstNode[]).map((p) => keyName(p.key)).filter((k) => k != null),
        );
      }
    }
    if (node.type === "TSTypeAliasDeclaration") {
      scope.aliases.set((node.id as AstNode).name as string, node.typeAnnotation as AstNode);
    }
  });
}

const typeArgs = (node: AstNode): AstNode[] =>
  ((node.typeArguments ?? node.typeParameters) as { params?: AstNode[] } | undefined)?.params ?? [];
const refName = (node: AstNode): string | undefined =>
  node.type === "TSTypeReference" ? keyName(node.typeName) : undefined;

function recipeOf(node: AstNode, scope: Scope, depth = 0): Record<string, string[]> | undefined {
  if (depth > 10) return undefined;
  const name = refName(node);
  if (name === "VariantProps") {
    const query = typeArgs(node)[0];
    const recipe = query?.type === "TSTypeQuery" ? keyName(query.exprName) : undefined;
    return recipe ? scope.recipes.get(recipe) : undefined;
  }
  const alias = name ? scope.aliases.get(name) : undefined;
  return alias ? recipeOf(alias, scope, depth + 1) : undefined;
}

const ANY: ValueSpec = { kind: "any" };

function specOf(node: AstNode | undefined, scope: Scope, depth = 0): ValueSpec {
  if (!node || depth > 10) return ANY;
  switch (node.type) {
    case "TSTypeAnnotation":
      return specOf(node.typeAnnotation as AstNode, scope, depth + 1);
    case "TSLiteralType": {
      const lit = node.literal as AstNode;
      return typeof lit.value === "string" ? { kind: "literal", options: [lit.value] } : ANY;
    }
    case "TSNumberKeyword":
      return { kind: "number" };
    case "TSUnionType": {
      const parts = (node.types as AstNode[])
        .filter((t) => !["TSUndefinedKeyword", "TSNullKeyword"].includes(t.type))
        .map((t) => specOf(t, scope, depth + 1));
      if (parts.length === 1) return parts[0];
      if (parts.every((p) => p.kind === "literal")) {
        return { kind: "literal", options: parts.flatMap((p) => (p.kind === "literal" ? p.options : [])) };
      }
      return ANY;
    }
    case "TSIndexedAccessType": {
      const recipe = recipeOf(node.objectType as AstNode, scope);
      const index = node.indexType as AstNode;
      const variant = index.type === "TSLiteralType" ? keyName(index.literal) : undefined;
      const options = recipe && variant ? recipe[variant] : undefined;
      if (!options) return ANY;
      return options.includes("true")
        ? { kind: "boolean", responsive: true, allowFalse: true }
        : { kind: "tokens", options };
    }
    case "TSTypeOperator": {
      const target = node.typeAnnotation as AstNode;
      if (node.operator === "keyof" && target.type === "TSTypeQuery") {
        const keys = scope.objects.get(keyName(target.exprName) ?? "");
        if (keys) return { kind: "literal", options: keys };
      }
      return ANY;
    }
    case "TSTypeReference": {
      const name = refName(node);
      const [arg] = typeArgs(node);
      if (name === "Responsive" && arg) {
        if (arg.type === "TSBooleanKeyword") return { kind: "boolean", responsive: true, allowFalse: true };
        return specOf(arg, scope, depth + 1);
      }
      if (name === "NonNullable" && arg) return specOf(arg, scope, depth + 1);
      const alias = name ? scope.aliases.get(name) : undefined;
      return alias ? specOf(alias, scope, depth + 1) : ANY;
    }
    default:
      return ANY;
  }
}

function propertyOptions(field: AstNode): AstNode[] | undefined {
  for (const d of (field.decorators as AstNode[] | undefined) ?? []) {
    const call = d.expression as AstNode;
    if (call.type !== "CallExpression" || keyName(call.callee) !== "property") continue;
    const options = (call.arguments as AstNode[])[0];
    return isNode(options) && options.type === "ObjectExpression" ? (options.properties as AstNode[]) : [];
  }
  return undefined;
}

export function elementApis(files: { file: string; source: string }[]): Map<string, ElementApi> {
  const scope: Scope = { recipes: new Map(), aliases: new Map(), objects: new Map() };
  const programs = files.map(({ file, source }) => ({
    file,
    program: parseSync(file, source).program as unknown as AstNode,
  }));
  for (const { program } of programs) collectScope(program, scope);

  const out = new Map<string, ElementApi>();
  for (const { file, program } of programs) {
    walk(program, (node) => {
      if (node.type !== "ClassDeclaration") return;
      const tag = ((node.decorators as AstNode[] | undefined) ?? [])
        .map((d) => d.expression as AstNode)
        .filter((c) => c.type === "CallExpression" && keyName(c.callee) === "customElement")
        .map((c) => ((c.arguments as AstNode[])[0] as AstNode | undefined)?.value)
        .find((v): v is string => typeof v === "string");
      if (!tag) return;
      const api: ElementApi = { tag, file, attributes: new Map(), properties: new Map() };
      for (const field of (node.body as AstNode).body as AstNode[]) {
        if (field.type !== "PropertyDefinition") continue;
        const name = keyName(field.key);
        const options = propertyOptions(field);
        if (!name || !options) continue;
        const opt = (k: string) => options.find((p) => keyName(p.key) === k)?.value as AstNode | undefined;
        const converter = keyName(opt("converter"));
        const type = keyName(opt("type"));
        let spec: ValueSpec;
        if (converter === "responsiveBoolean") spec = { kind: "boolean", responsive: true, allowFalse: true };
        else if (converter === "booleanAttribute") spec = { kind: "boolean", responsive: false, allowFalse: true };
        else if (type === "Boolean") spec = { kind: "boolean", responsive: false, allowFalse: false };
        else if (type === "Number") spec = { kind: "number" };
        else spec = specOf(field.typeAnnotation as AstNode | undefined, scope);
        api.properties.set(name, spec);
        const attribute = opt("attribute");
        if (attribute?.type === "Literal" && attribute.value === false) continue;
        api.attributes.set(typeof attribute?.value === "string" ? attribute.value : name.toLowerCase(), spec);
      }
      out.set(tag, api);
      return false;
    });
  }
  return out;
}

export function invalidValue(spec: ValueSpec, value: string): string | null {
  const bps = BREAKPOINTS as readonly string[];
  const tokens = value.split(/\s+/).filter(Boolean);
  const perToken = (ok: (v: string) => boolean, allowBareBreakpoint: boolean) => {
    for (const t of tokens) {
      const i = t.indexOf(":");
      if (i > 0) {
        if (!bps.includes(t.slice(0, i))) return `"${t.slice(0, i)}" is not a breakpoint (${bps.join(", ")})`;
        if (!ok(t.slice(i + 1))) return `"${t.slice(i + 1)}" is not an option`;
      } else if (!(ok(t) || (allowBareBreakpoint && bps.includes(t)))) return `"${t}" is not an option`;
    }
    return null;
  };
  switch (spec.kind) {
    case "tokens":
      if (!tokens.length) return "needs a value";
      return perToken((v) => spec.options.includes(v), false);
    case "boolean":
      if (!spec.responsive) {
        if (value === "" || (spec.allowFalse && ["true", "false"].includes(value))) return null;
        return spec.allowFalse
          ? `expects no value, "true" or "false"`
          : `is a plain boolean: write the bare attribute (any value, even "false", means true)`;
      }
      return perToken((v) => ["true", "false"].includes(v), true);
    case "literal":
      return spec.options.includes(value) ? null : `expects one of ${spec.options.map((o) => `"${o}"`).join(", ")}`;
    case "number":
      return /^-?\d+(\.\d+)?$/.test(value.trim()) ? null : "expects a number";
    default:
      return null;
  }
}

export interface TemplateAttribute {
  name: string;
  value: string | undefined;
  bare: boolean;
}

export interface TemplateElement {
  tag: string;
  attributes: TemplateAttribute[];
  elementBinding: boolean;
  line: number;
}

const HOLE = "\u0001";

export function templateElements(source: string, filename: string): TemplateElement[] {
  const { program } = parseSync(filename, source);
  const out: TemplateElement[] = [];
  const lineOf = (offset: number) => source.slice(0, offset).split("\n").length;
  walk(program, (node) => {
    if (node.type !== "TaggedTemplateExpression" || !["html", "svg"].includes(keyName(node.tag) ?? "")) return;
    const quasi = node.quasi as { quasis: { value: { raw: string } }[]; expressions: AstNode[] };
    const expressionValue = (i: number): string | undefined => {
      const e = quasi.expressions[i];
      if (e.type === "Literal" && typeof e.value === "string") return e.value;
      if (e.type === "TemplateLiteral" && (e.expressions as unknown[]).length === 0) {
        return (e.quasis as { value: { cooked?: string } }[]).map((q) => q.value.cooked ?? "").join("");
      }
      return undefined;
    };
    const text = quasi.quasis
      .map((q, i) => q.value.raw + (i < quasi.expressions.length ? `${HOLE}${i}${HOLE}` : ""))
      .join("");
    const holeOnly = new RegExp(`^${HOLE}(\\d+)${HOLE}$`);
    const startTag = /<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
    const attribute = /([^\s=/"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    for (const m of text.matchAll(startTag)) {
      const attributes: TemplateAttribute[] = [];
      let elementBinding = false;
      for (const a of m[2].matchAll(attribute)) {
        if (a[1].includes(HOLE)) {
          elementBinding = true;
          continue;
        }
        const raw = a[2] ?? a[3] ?? a[4];
        let value: string | undefined = raw;
        if (raw?.includes(HOLE)) {
          const only = holeOnly.exec(raw);
          value = only ? expressionValue(Number(only[1])) : undefined;
        }
        attributes.push({ name: a[1], value: raw === undefined ? "" : value, bare: raw === undefined });
      }
      const line = lineOf((node.start as number) ?? 0) + text.slice(0, m.index).split("\n").length - 1;
      out.push({ tag: m[1].toLowerCase(), attributes, elementBinding, line });
    }
  });
  return out;
}

export function stylingApis(source: string, filename: string): string[] {
  const { program } = parseSync(filename, source);
  const out: string[] = [];
  const MEMBERS = new Set([
    "className",
    "classList",
    "style",
    "adoptedStyleSheets",
    "styleSheets",
    "insertRule",
    "innerHTML",
    "outerHTML",
    "insertAdjacentHTML",
  ]);
  const ATTRS = new Set(["class", "style"]);
  const IMPORTS = /\.css($|\?)|lit\/directives\/(class-map|style-map|unsafe-html|unsafe-svg|unsafe-mathml)\.js$/;
  const LIT_NAMES = new Set(["css", "unsafeCSS", "svg", "mathml", "unsafeStatic"]);
  walk(program, (node) => {
    if (node.type === "ImportDeclaration") {
      const from = (node.source as AstNode).value as string;
      if (IMPORTS.test(from)) out.push(`imports ${from}`);
      if (from === "lit" || from.startsWith("lit/")) {
        for (const s of (node.specifiers as AstNode[]) ?? []) {
          const name = keyName(s.imported);
          if (name && LIT_NAMES.has(name)) out.push(`imports \`${name}\` from ${from}`);
        }
      }
    }
    if (node.type === "MemberExpression" && !node.computed) {
      const name = keyName(node.property);
      if (name && MEMBERS.has(name)) out.push(`uses .${name}`);
    }
    if (node.type === "CallExpression") {
      const callee = node.callee as AstNode;
      const method = callee.type === "MemberExpression" ? keyName(callee.property) : undefined;
      const first = (node.arguments as AstNode[])[0];
      if (
        method &&
        ["setAttribute", "toggleAttribute", "removeAttribute", "setAttributeNS"].includes(method) &&
        first?.type === "Literal" &&
        ATTRS.has(String(first.value))
      ) {
        out.push(`calls ${method}("${String(first.value)}")`);
      }
    }
    if (node.type === "PropertyDefinition" && node.static && keyName(node.key) === "styles")
      out.push("declares static styles");
  });
  return out;
}

export function valueImports(source: string, filename: string): { from: string; names: string[] }[] {
  const { program } = parseSync(filename, source);
  const out: { from: string; names: string[] }[] = [];
  walk(program, (node) => {
    if (node.type !== "ImportDeclaration" || node.importKind === "type") return;
    const names = ((node.specifiers as AstNode[]) ?? [])
      .filter((s) => s.importKind !== "type")
      .map((s) => keyName(s.local) ?? "?");
    if (names.length) out.push({ from: (node.source as AstNode).value as string, names });
  });
  return out;
}

const TEXT_ATTRS =
  /^\.?(aria-label|aria-description|aria-roledescription|aria-valuetext|label|title|placeholder|alt|heading|subhead|subtitle|description|supporting|eyebrow|text|tooltip|caption|hint|empty|summary|trigger-label|triggerLabel|confirm-label|confirmLabel|cancel-label|cancelLabel|action-label|actionLabel|message)$/;

const WORDS = /[A-Za-z]{2,}/;

export function literalTexts(source: string, filename: string): { line: number; text: string }[] {
  const { program } = parseSync(filename, source);
  const out: { line: number; text: string }[] = [];
  const lineOf = (offset: number) => source.slice(0, offset).split("\n").length;
  walk(program, (node) => {
    if (node.type !== "TaggedTemplateExpression") return;
    const tag = node.tag as AstNode;
    if (tag.type !== "Identifier" || tag.name !== "html") return;
    const quasi = node.quasi as AstNode;
    const quasis = quasi.quasis as AstNode[];
    const expressions = quasi.expressions as AstNode[];
    let state: "text" | "tag" | "comment" | "style" = "text";
    let attr = "";
    quasis.forEach((q, i) => {
      const raw = (q.value as { raw: string }).raw;
      const start = (q.start as number) ?? 0;
      let textRun = "";
      let runAt = 0;
      const flush = () => {
        const t = textRun.replace(/&[a-z]+;/gi, " ").trim();
        if (WORDS.test(t)) out.push({ line: lineOf(start + runAt), text: t });
        textRun = "";
      };
      for (let j = 0; j < raw.length; j++) {
        const c = raw[j]!;
        if (state === "comment") {
          if (raw.startsWith("-->", j)) {
            state = "text";
            j += 2;
          }
          continue;
        }
        if (state === "style") {
          if (raw.startsWith("</style", j)) state = "tag";
          continue;
        }
        if (state === "text") {
          if (raw.startsWith("<!--", j)) {
            flush();
            state = "comment";
            j += 3;
          } else if (c === "<") {
            flush();
            state = raw.startsWith("<style", j) ? "style" : "tag";
          } else {
            if (!textRun) runAt = j;
            textRun += c;
          }
          continue;
        }
        const m = /^([.?@]?[\w-]+)\s*=\s*"([^"$]*)"/.exec(raw.slice(j));
        if (m) {
          const v = m[2]!.trim();
          if (TEXT_ATTRS.test(m[1]!) && WORDS.test(v) && (/\s/.test(v) || /^[A-Z]/.test(v)))
            out.push({ line: lineOf(start + j), text: v });
          j += m[0].length - 1;
          continue;
        }
        const open = /^([.?@]?[\w-]+)\s*=\s*"?$/.exec(raw.slice(j));
        if (open) {
          attr = open[1]!;
          break;
        }
        if (c === ">") state = "text";
      }
      if (state === "text") flush();
      const e = expressions[i];
      if (e && state === "tag" && TEXT_ATTRS.test(attr)) {
        const v =
          e.type === "Literal"
            ? e.value
            : e.type === "TemplateLiteral" && !(e.expressions as AstNode[]).length
              ? ((e.quasis as AstNode[])[0]!.value as { cooked: string }).cooked
              : undefined;
        if (typeof v === "string" && WORDS.test(v)) out.push({ line: lineOf((e.start as number) ?? 0), text: v });
      }
      attr = "";
    });
  });
  return out;
}
