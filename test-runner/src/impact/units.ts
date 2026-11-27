import { parseSync } from "vite/rolldown/utils";
import { hashText, normalise, type Comment, type Span } from "./normalize.ts";

export type UnitKind = "top" | "function" | "arrow" | "method" | "getter" | "setter" | "constructor" | "field";

export interface Unit {
  id: string;
  kind: UnitKind;
  start: number;
  end: number;
  body: Span;
  parent: number;
  children: number[];
  hash: string;
}

export interface UnitTree {
  units: Unit[];
  parsed: boolean;
}

interface Node {
  type: string;
  start: number;
  end: number;
  [key: string]: unknown;
}

const isNode = (v: unknown): v is Node =>
  !!v && typeof v === "object" && typeof (v as Node).type === "string" && typeof (v as Node).start === "number";

const FUNCTIONS = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);
const FIELDS = new Set(["PropertyDefinition", "AccessorProperty"]);
const LITERALS = new Set(["Literal", "TemplateElement", "JSXText"]);
const METHOD_KINDS = new Map<string, UnitKind>([
  ["method", "method"],
  ["get", "getter"],
  ["set", "setter"],
  ["constructor", "constructor"],
]);

const squash = (text: string) => text.replace(/\s+/g, " ").trim().slice(0, 80);

export function wholeFile(source: string): UnitTree {
  return {
    parsed: false,
    units: [
      {
        id: "",
        kind: "top",
        start: 0,
        end: source.length,
        body: { start: 0, end: source.length },
        parent: -1,
        children: [],
        hash: hashText(`raw\u0001${source}`),
      },
    ],
  };
}

export function splitUnits(filename: string, source: string): UnitTree {
  let parsed: { program: Node; comments: Comment[]; errors: unknown[] };
  try {
    parsed = parseSync(filename, source) as unknown as typeof parsed;
  } catch {
    return wholeFile(source);
  }
  if (parsed.errors.length) return wholeFile(source);

  const literals: Span[] = [];
  const units: Unit[] = [
    {
      id: "",
      kind: "top",
      start: 0,
      end: source.length,
      body: { start: 0, end: source.length },
      parent: -1,
      children: [],
      hash: "",
    },
  ];
  const ordinals = new Map<number, Map<string, number>>();
  const text = (n: Node) => squash(source.slice(n.start, n.end));

  const keyName = (key: unknown, computed: unknown): string => {
    if (!isNode(key)) return "?";
    if (computed) return `[${text(key)}]`;
    if (key.type === "Identifier") return String(key.name);
    if (key.type === "PrivateIdentifier") return `#${String(key.name)}`;
    if (key.type === "Literal") return String(key.value);
    return text(key);
  };

  const nameOf = (node: Node, parent: Node | undefined, field: string, className: string | undefined): string => {
    const member = (name: string) => (className === undefined ? name : `${className}.${name}`);
    if (node.type === "PropertyDefinition" || node.type === "AccessorProperty")
      return member(keyName(node.key, node.computed));
    if (parent?.type === "MethodDefinition" && field === "value") {
      const kind = String(parent.kind);
      const prefix = `${parent.static ? "static " : ""}${kind === "get" || kind === "set" ? `${kind} ` : ""}`;
      return member(kind === "constructor" ? "constructor" : `${prefix}${keyName(parent.key, parent.computed)}`);
    }
    if (parent?.type === "Property" && field === "value") {
      const kind = String(parent.kind);
      return `${kind === "get" || kind === "set" ? `${kind} ` : ""}${keyName(parent.key, parent.computed)}`;
    }
    if (isNode(node.id) && node.id.type === "Identifier") return String(node.id.name);
    if (parent?.type === "VariableDeclarator" && field === "init")
      return isNode(parent.id) && parent.id.type === "Identifier" ? String(parent.id.name) : text(parent.id as Node);
    if (parent?.type === "AssignmentExpression" && field === "right") return text(parent.left as Node);
    if (parent?.type === "AssignmentPattern" && field === "right") return `default ${text(parent.left as Node)}`;
    if ((parent?.type === "CallExpression" || parent?.type === "NewExpression") && field === "arguments")
      return `${text(parent.callee as Node)}()`;
    if (parent?.type === "ExportDefaultDeclaration") return "default";
    if (parent?.type === "PropertyDefinition" && field === "value") return "value";
    return node.type === "ArrowFunctionExpression" ? "arrow" : "function";
  };

  const kindOf = (node: Node, parent: Node | undefined, field: string): UnitKind => {
    if (FIELDS.has(node.type)) return "field";
    if (parent?.type === "MethodDefinition" && field === "value")
      return METHOD_KINDS.get(String(parent.kind)) ?? "method";
    if (parent?.type === "Property" && field === "value") {
      const kind = String(parent.kind);
      if (kind === "get") return "getter";
      if (kind === "set") return "setter";
      if (parent.method) return "method";
    }
    return node.type === "ArrowFunctionExpression" ? "arrow" : "function";
  };

  const addUnit = (node: Node, parent: Node | undefined, field: string, owner: number, className?: string) => {
    const base = nameOf(node, parent, field, className);
    const seen = ordinals.get(owner) ?? new Map<string, number>();
    ordinals.set(owner, seen);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    const name = n === 1 ? base : `${base}#${n}`;
    const up = units[owner]!;
    const isField = FIELDS.has(node.type);
    const body = (isField ? node.value : node.body) as Node;
    const start = isField ? (node.key as Node).start : node.start;
    const index = units.length;
    units.push({
      id: up.id ? `${up.id} > ${name}` : name,
      kind: kindOf(node, parent, field),
      start,
      end: node.end,
      body: { start: body.start, end: body.end },
      parent: owner,
      children: [],
      hash: "",
    });
    up.children.push(index);
    return index;
  };

  const isUnit = (node: Node) =>
    (FUNCTIONS.has(node.type) && isNode(node.body)) ||
    (FIELDS.has(node.type) && !node.static && !node.computed && isNode(node.value) && isNode(node.key));

  const visit = (node: Node, parent: Node | undefined, field: string, owner: number, className?: string): void => {
    if (LITERALS.has(node.type)) literals.push({ start: node.start, end: node.end });
    let inner = owner;
    if (isUnit(node)) inner = addUnit(node, parent, field, owner, className);
    let members: string | undefined;
    if (node.type === "ClassDeclaration" || node.type === "ClassExpression") {
      if (isNode(node.id)) members = String(node.id.name);
      else if (parent?.type === "VariableDeclarator" && isNode(parent.id)) members = text(parent.id);
      else members = "class";
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "type" || key === "start" || key === "end") continue;
      const into = FIELDS.has(node.type) && inner !== owner && key !== "value" ? owner : inner;
      const scope = node.type === "ClassBody" || node.type === "MethodDefinition" ? className : undefined;
      if (Array.isArray(value)) {
        for (const item of value) if (isNode(item)) visit(item, node, key, into, scope);
      } else if (isNode(value)) {
        visit(value, node, key, into, key === "body" && members !== undefined ? members : scope);
      }
    }
  };

  const program = parsed.program;
  for (const [key, value] of Object.entries(program)) {
    if (Array.isArray(value)) for (const item of value) if (isNode(item)) visit(item, program, key, 0);
  }

  const comments = parsed.comments;
  for (const unit of units) {
    const holes = unit.children.map((c) => units[c]!.body);
    unit.hash = hashText(`${unit.kind}\u0001${normalise(source, unit, { comments, literals, holes })}`);
  }
  return { units, parsed: true };
}

export function unitsAt(tree: UnitTree, offset: number): number[] {
  const { units } = tree;
  let at = 0;
  for (;;) {
    const next = units[at]!.children.find((c) => units[c]!.start <= offset && offset < units[c]!.end);
    if (next === undefined) break;
    at = next;
  }
  const marked = [at];
  while (at > 0) {
    const unit = units[at]!;
    if (offset >= unit.body.start && offset < unit.body.end) break;
    at = unit.parent;
    marked.push(at);
  }
  return marked;
}
