// The design system's lint rules for a Payload project (an oxlint JS plugin). A project registers
// it under `lint.jsPlugins` as `{ name: "saastemly", specifier: "saastemlycrm-design-system/lint" }`
// and spreads `recommended` into `lint.rules`. See AGENTS.md, "Lint rules".
import { definePlugin, defineRule } from "vite-plus/lint/plugins";

/** @typedef {import("vite-plus/lint/plugins").ESTree.Node} Node */

const CONTRACTS = "saastemlycrm-design-system/contracts";
const PAYLOAD = "saastemlycrm-design-system/payload";

// ---- AST helpers ----------------------------------------------------------------------------

/** Drops `as`, `satisfies`, `!` and parentheses around an expression. */
const unwrap = (/** @type {any} */ node) => {
  while (
    node &&
    (node.type === "TSAsExpression" ||
      node.type === "TSSatisfiesExpression" ||
      node.type === "TSNonNullExpression" ||
      node.type === "ParenthesizedExpression")
  )
    node = node.expression;
  return node;
};

/** A string literal's value (a template literal without expressions counts), else undefined. */
const stringOf = (/** @type {any} */ node) => {
  node = unwrap(node);
  if (node?.type === "Literal" && typeof node.value === "string") return node.value;
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis[0]?.value.cooked ?? "";
  return undefined;
};

/** The name of a non-computed property key. */
const keyName = (/** @type {any} */ prop) => {
  if (prop?.type !== "Property" || prop.computed) return undefined;
  if (prop.key.type === "Identifier") return prop.key.name;
  return stringOf(prop.key);
};

/** `block("<type>", …)`: the block type, else undefined. */
const blockType = (/** @type {any} */ node) => {
  node = unwrap(node);
  if (node?.type !== "CallExpression" || node.callee.type !== "Identifier" || node.callee.name !== "block") return;
  return stringOf(node.arguments[0]);
};

/** A `note(…)` call. */
const isNote = (/** @type {any} */ node) => {
  node = unwrap(node);
  return node?.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "note";
};

/** The value of property `name` in an object literal. */
const propValue = (/** @type {any} */ obj, /** @type {string} */ name) => {
  obj = unwrap(obj);
  if (obj?.type !== "ObjectExpression") return undefined;
  return obj.properties.find((/** @type {any} */ p) => keyName(p) === name)?.value;
};

const isFunction = (/** @type {any} */ node) =>
  node?.type === "ArrowFunctionExpression" ||
  node?.type === "FunctionExpression" ||
  node?.type === "FunctionDeclaration";

/** What a function returns: its expression body, or the arguments of its own `return`s. */
const returnsOf = (/** @type {any} */ fn) => {
  if (!isFunction(fn)) return [];
  if (fn.body.type !== "BlockStatement") return [unwrap(fn.body)];
  /** @type {any[]} */
  const out = [];
  const walk = (/** @type {any} */ node) => {
    if (!node || typeof node.type !== "string" || isFunction(node)) return;
    if (node.type === "ReturnStatement") {
      if (node.argument) out.push(unwrap(node.argument));
      return;
    }
    for (const key of Object.keys(node)) {
      if (key === "parent") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach(walk);
      else if (child && typeof child === "object") walk(child);
    }
  };
  fn.body.body.forEach(walk);
  return out;
};

/** The file's path with forward slashes, for directory tests. */
const pathOf = (/** @type {any} */ context) => String(context.filename ?? "").replaceAll("\\", "/");
const inDir = (/** @type {any} */ context, /** @type {string} */ dir) => pathOf(context).includes(`/${dir}/`);

// ---- prefer-entries -------------------------------------------------------------------------

/**
 * Block types an `Entry` covers, so a card made only of these is an entry. A card holding a list,
 * table or chart (a board column) is a container and stays a card.
 */
const ENTRY_PARTS = new Set(["text", "tags", "actions", "details", "alert", "stats"]);

/** `block("card", …)` whose content an `Entry` can carry (spread-in blocks aren't known, so pass). */
const isEntryCard = (/** @type {any} */ node) => {
  if (blockType(node) !== "card") return false;
  const blocks = unwrap(propValue(unwrap(node).arguments[1], "blocks"));
  if (!blocks) return true;
  if (blocks.type !== "ArrayExpression") return false;
  return blocks.elements.every(
    (/** @type {any} */ el) =>
      el && (el.type === "SpreadElement" || isNote(el) || ENTRY_PARTS.has(/** @type {string} */ (blockType(el)))),
  );
};

/**
 * Whether what `fn` returns is an entry-like card, following calls to the file's own top-level
 * functions (`rows.map((r) => card(r))`, `rows.map(card)`).
 * @param {any} fn
 * @param {Map<string, any>} fns
 */
const returnsCard = (fn, fns, depth = 0) =>
  depth < 3 &&
  returnsOf(fn).some((/** @type {any} */ ret) => {
    if (isEntryCard(ret)) return true;
    if (ret?.type === "CallExpression" && ret.callee.type === "Identifier" && fns.has(ret.callee.name))
      return returnsCard(fns.get(ret.callee.name), fns, depth + 1);
    return false;
  });

/**
 * `<expr>.map(… => block("card", …))`.
 * @param {any} node
 * @param {Map<string, any>} fns
 */
const isCardMap = (node, fns) => {
  node = unwrap(node);
  if (node?.type !== "CallExpression") return false;
  const callee = node.callee;
  if (callee.type !== "MemberExpression" || callee.computed || callee.property.name !== "map") return false;
  const cb = unwrap(node.arguments[0]);
  if (cb?.type === "Identifier") return fns.has(cb.name) && returnsCard(fns.get(cb.name), fns);
  return returnsCard(cb, fns);
};

/** The file's top-level functions by name (declarations and `const f = (…) => …`). */
const topLevelFunctions = (/** @type {any} */ program) => {
  const fns = new Map();
  for (let stmt of program.body) {
    if (stmt.type === "ExportNamedDeclaration" && stmt.declaration) stmt = stmt.declaration;
    if (stmt.type === "FunctionDeclaration" && stmt.id) fns.set(stmt.id.name, stmt);
    if (stmt.type === "VariableDeclaration")
      for (const d of stmt.declarations)
        if (d.id.type === "Identifier" && isFunction(unwrap(d.init))) fns.set(d.id.name, unwrap(d.init));
  }
  return fns;
};

const preferEntries = defineRule({
  meta: {
    type: "suggestion",
    docs: { description: "A set of like things is `entries`, not a grid of cards." },
    messages: {
      preferEntries:
        'A grid of cards built from a list: use block("entries", { items }) with one `Entry` per item instead.',
    },
    schema: [],
  },
  create(context) {
    /** Variables initialised with a card map: name to node. */
    const cardMaps = new Map();
    /** Grid `blocks` that are identifiers, checked once every variable is known. */
    /** @type {any[]} */
    const gridRefs = [];
    /** @type {Map<string, any>} */
    let fns = new Map();
    return {
      Program(/** @type {any} */ node) {
        fns = topLevelFunctions(node);
      },
      VariableDeclarator(/** @type {any} */ node) {
        if (node.id.type === "Identifier" && isCardMap(node.init, fns)) cardMaps.set(node.id.name, node.init);
      },
      CallExpression(/** @type {any} */ node) {
        if (blockType(node) !== "grid") return;
        const blocks = unwrap(propValue(node.arguments[1], "blocks"));
        if (!blocks) return;
        const candidates = blocks.type === "ArrayExpression" ? blocks.elements : [blocks];
        for (const el of candidates) {
          const expr = unwrap(el?.type === "SpreadElement" ? el.argument : el);
          if (isCardMap(expr, fns)) context.report({ node: expr, messageId: "preferEntries" });
          else if (expr?.type === "Identifier") gridRefs.push(expr);
        }
      },
      "Program:exit"() {
        for (const ref of gridRefs)
          if (cardMaps.has(ref.name)) context.report({ node: ref, messageId: "preferEntries" });
      },
    };
  },
});

// ---- no-local-block-helpers -----------------------------------------------------------------

/** Identifiers a parameter pattern binds. */
const boundNames = (/** @type {any} */ pattern, /** @type {Set<string>} */ out = new Set()) => {
  if (!pattern) return out;
  switch (pattern.type) {
    case "Identifier":
      out.add(pattern.name);
      break;
    case "AssignmentPattern":
      boundNames(pattern.left, out);
      break;
    case "RestElement":
      boundNames(pattern.argument, out);
      break;
    case "ArrayPattern":
      pattern.elements.forEach((/** @type {any} */ e) => boundNames(e, out));
      break;
    case "ObjectPattern":
      for (const p of pattern.properties) boundNames(p.type === "RestElement" ? p.argument : p.value, out);
      break;
    case "TSParameterProperty":
      boundNames(pattern.parameter, out);
      break;
  }
  return out;
};

/** Only literals and the helper's own parameters (in objects, arrays and templates). */
const isFixedArg = (/** @type {any} */ node, /** @type {Set<string>} */ params) => {
  node = unwrap(node);
  if (!node) return false;
  switch (node.type) {
    case "Literal":
      return true;
    case "Identifier":
      return params.has(node.name) || node.name === "undefined";
    case "UnaryExpression":
      return isFixedArg(node.argument, params);
    case "TemplateLiteral":
      return node.expressions.every((/** @type {any} */ e) => isFixedArg(e, params));
    case "ArrayExpression":
      return node.elements.every((/** @type {any} */ e) => e && isFixedArg(e, params));
    case "SpreadElement":
      return isFixedArg(node.argument, params);
    case "ObjectExpression":
      return node.properties.every((/** @type {any} */ p) =>
        p.type === "SpreadElement" ? isFixedArg(p.argument, params) : !p.computed && isFixedArg(p.value, params),
      );
    default:
      return false;
  }
};

/** A function whose whole body is one `block(…)` call with only literal or parameter args. */
const isBlockAlias = (/** @type {any} */ fn) => {
  if (!isFunction(fn)) return false;
  let body = fn.body;
  if (body.type === "BlockStatement") {
    if (body.body.length !== 1 || body.body[0].type !== "ReturnStatement") return false;
    body = body.body[0].argument;
  }
  body = unwrap(body);
  if (blockType(body) === undefined) return false;
  const params = new Set();
  for (const p of fn.params) boundNames(p, params);
  return body.arguments.slice(1).every((/** @type {any} */ a) => isFixedArg(a, params));
};

const noLocalBlockHelpers = defineRule({
  meta: {
    type: "suggestion",
    docs: { description: "Screens use the contracts' helpers or the block itself, not local block aliases." },
    messages: {
      noLocalBlockHelpers:
        "`{{name}}` only wraps one block(...) call: use the contracts' helper (note(text) for quiet text) or the block directly.",
    },
    schema: [],
  },
  create(context) {
    const check = (/** @type {any} */ node) => {
      const decl =
        node.type === "ExportNamedDeclaration" || node.type === "ExportDefaultDeclaration" ? node.declaration : node;
      if (!decl) return;
      if (decl.type === "FunctionDeclaration" && isBlockAlias(decl))
        context.report({ node: decl, messageId: "noLocalBlockHelpers", data: { name: decl.id?.name ?? "default" } });
      if (decl.type === "VariableDeclaration")
        for (const d of decl.declarations)
          if (d.id.type === "Identifier" && isBlockAlias(unwrap(d.init)))
            context.report({ node: d, messageId: "noLocalBlockHelpers", data: { name: d.id.name } });
    };
    return {
      Program(/** @type {any} */ node) {
        node.body.forEach(check);
      },
    };
  },
});

// ---- widgets-are-pure -----------------------------------------------------------------------

const IMPURE_GLOBALS = new Set(["localStorage", "sessionStorage", "document", "window", "navigator", "location"]);

const widgetsArePure = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Widget files are pure: they build blocks from data and import only the contracts." },
    messages: {
      import:
        'Widgets import only {{allowed}}, types and relative modules, not "{{source}}": UI belongs in the design system, data in an endpoint.',
      impure:
        "`{{what}}` makes a widget impure: render, head, visible and hidden only turn data into blocks. Load it through a source (an endpoint) instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allow: { type: "array", items: { type: "string" } },
          dir: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ allow: [CONTRACTS, PAYLOAD], dir: "widgets" }],
  },
  create(context) {
    const options = /** @type {{ allow?: string[], dir?: string }} */ (context.options[0] ?? {});
    const allow = options.allow ?? [CONTRACTS, PAYLOAD];
    if (!inDir(context, options.dir ?? "widgets")) return {};
    const allowed = allow.join(", ");
    const checkSource = (/** @type {any} */ node, /** @type {any} */ source, typeOnly = false) => {
      const value = stringOf(source);
      if (value === undefined || typeOnly || value.startsWith(".") || allow.includes(value)) return;
      context.report({ node: source, messageId: "import", data: { source: value, allowed } });
    };
    const impure = (/** @type {any} */ node, /** @type {string} */ what) =>
      context.report({ node, messageId: "impure", data: { what } });
    return {
      ImportDeclaration(/** @type {any} */ node) {
        const typeOnly =
          node.importKind === "type" ||
          (node.specifiers.length > 0 &&
            node.specifiers.every((/** @type {any} */ s) => s.type === "ImportSpecifier" && s.importKind === "type"));
        checkSource(node, node.source, typeOnly);
      },
      ExportNamedDeclaration(/** @type {any} */ node) {
        if (node.source) checkSource(node, node.source, node.exportKind === "type");
      },
      ExportAllDeclaration(/** @type {any} */ node) {
        checkSource(node, node.source, node.exportKind === "type");
      },
      ImportExpression(/** @type {any} */ node) {
        if (stringOf(node.source) === undefined) impure(node, "import()");
        else checkSource(node, node.source);
      },
      CallExpression(/** @type {any} */ node) {
        if (node.callee.type === "Identifier" && node.callee.name === "fetch") impure(node, "fetch()");
      },
      NewExpression(/** @type {any} */ node) {
        if (node.callee.type === "Identifier" && node.callee.name === "Date" && node.arguments.length === 0)
          impure(node, "new Date()");
      },
      MemberExpression(/** @type {any} */ node) {
        if (node.computed || node.object.type !== "Identifier") return;
        const name = `${node.object.name}.${node.property.name}`;
        if (name === "Date.now" || name === "Math.random") impure(node, name);
      },
      "Program:exit"(/** @type {any} */ program) {
        // Unresolved references to browser globals (not property keys, not local variables).
        const scope = context.sourceCode.getScope(program);
        for (const ref of scope.through)
          if (IMPURE_GLOBALS.has(ref.identifier.name)) impure(ref.identifier, ref.identifier.name);
      },
    };
  },
});

// ---- endpoints-return-data ------------------------------------------------------------------

const UI_HELPERS = new Set(["block", "note", "widgets", "widget"]);

const endpointsReturnData = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Endpoints return data; widgets turn it into blocks." },
    messages: {
      endpointsReturnData:
        "Endpoints return data, never UI: return the data and build `{{name}}(...)` in a widget (src/widgets) instead.",
    },
    schema: [
      {
        type: "object",
        properties: { dir: { type: "string" } },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ dir: "endpoints" }],
  },
  create(context) {
    const options = /** @type {{ dir?: string }} */ (context.options[0] ?? {});
    if (!inDir(context, options.dir ?? "endpoints")) return {};
    /** Local names bound to a UI helper: local name to helper name. */
    const locals = new Map();
    /** Namespace imports of the contracts. */
    const namespaces = new Set();
    const report = (/** @type {any} */ node, /** @type {string} */ name) =>
      context.report({ node, messageId: "endpointsReturnData", data: { name } });
    return {
      ImportDeclaration(/** @type {any} */ node) {
        if (stringOf(node.source) !== CONTRACTS || node.importKind === "type") return;
        for (const s of node.specifiers) {
          if (s.type === "ImportNamespaceSpecifier") namespaces.add(s.local.name);
          if (s.type !== "ImportSpecifier" || s.importKind === "type") continue;
          const name = s.imported.type === "Identifier" ? s.imported.name : s.imported.value;
          if (UI_HELPERS.has(name)) {
            locals.set(s.local.name, name);
            report(s, name);
          }
        }
      },
      CallExpression(/** @type {any} */ node) {
        const callee = node.callee;
        if (callee.type === "Identifier" && locals.has(callee.name)) report(node, locals.get(callee.name));
        if (
          callee.type === "MemberExpression" &&
          !callee.computed &&
          callee.object.type === "Identifier" &&
          namespaces.has(callee.object.name) &&
          UI_HELPERS.has(callee.property.name)
        )
          report(node, callee.property.name);
      },
    };
  },
});

// ---- sentence-case-titles -------------------------------------------------------------------

/** Keys checked inside blocks and widgets; `subhead` is checked everywhere. */
const HEADING_KEYS = new Set(["title", "heading", "label"]);

/**
 * "Open Purchase Orders": three or more words, every one capitalised (acronyms, numbers and the
 * given proper nouns aside).
 * @param {string} text
 * @param {string[]} [properNouns]
 */
const isTitleCase = (text, properNouns = []) => {
  for (const noun of properNouns) text = text.split(noun).join(" ");
  const words = text
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((w) => /\p{L}/u.test(w));
  if (words.length < 3) return false;
  const counted = words.filter((w) => !/\p{N}/u.test(w) && !/^\p{Lu}[\p{Lu}\p{N}]*s?$/u.test(w));
  return counted.length >= 3 && counted.every((w) => /^\p{Lu}/u.test(w));
};

/** Inside an object literal passed to block(...) or a widget (an object with `render`). */
const inBlockOrWidget = (/** @type {any} */ node) => {
  for (let n = node.parent; n; n = n.parent) {
    if (n.type !== "ObjectExpression") continue;
    if (n.properties.some((/** @type {any} */ p) => keyName(p) === "render")) return true;
    let up = n.parent;
    while (up && (up.type === "TSAsExpression" || up.type === "TSSatisfiesExpression")) up = up.parent;
    if (up?.type === "CallExpression" && blockType(up) !== undefined && up.arguments.includes(n)) return true;
  }
  return false;
};

const sentenceCaseTitles = defineRule({
  meta: {
    type: "suggestion",
    docs: { description: "Headings, titles and labels are in sentence case." },
    messages: {
      sentenceCase: 'Write headings in sentence case: "{{suggestion}}", not "{{text}}".',
    },
    schema: [
      {
        type: "object",
        properties: { properNouns: { type: "array", items: { type: "string" } } },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ properNouns: [] }],
  },
  create(context) {
    /** Names that keep their capitals ("Golden Sea"): a project lists its own. */
    const properNouns = /** @type {{ properNouns?: string[] }} */ (context.options[0] ?? {}).properNouns ?? [];
    return {
      Property(/** @type {any} */ node) {
        const key = keyName(node);
        if (!key || (key !== "subhead" && !HEADING_KEYS.has(key))) return;
        const text = stringOf(node.value);
        if (text === undefined || !isTitleCase(text, properNouns)) return;
        if (key !== "subhead" && !inBlockOrWidget(node)) return;
        let first = true;
        const suggestion = text.replace(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu, (w) => {
          const keep = first || /\p{N}/u.test(w) || /^\p{Lu}[\p{Lu}\p{N}]*s?$/u.test(w);
          first = false;
          return keep ? w : w[0].toLowerCase() + w.slice(1);
        });
        context.report({ node: node.value, messageId: "sentenceCase", data: { text, suggestion } });
      },
    };
  },
});

// ---- max-blocks -----------------------------------------------------------------------------

const maxBlocks = defineRule({
  meta: {
    type: "suggestion",
    docs: { description: "A widget's render returns a handful of blocks." },
    messages: {
      maxBlocks:
        "render returns {{count}} blocks (more than {{max}}): split the widget or use a richer block (entries, details).",
    },
    schema: [
      {
        type: "object",
        properties: { max: { type: "integer", minimum: 1 } },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ max: 6 }],
  },
  create(context) {
    const max = /** @type {{ max?: number }} */ (context.options[0] ?? {}).max ?? 6;
    return {
      Property(/** @type {any} */ node) {
        if (keyName(node) !== "render") return;
        for (const ret of returnsOf(unwrap(node.value)))
          if (ret?.type === "ArrayExpression" && ret.elements.length > max)
            context.report({
              node: ret,
              messageId: "maxBlocks",
              data: { count: String(ret.elements.length), max: String(max) },
            });
      },
    };
  },
});

// ---- no-raw-hrefs ---------------------------------------------------------------------------

/** A dashboard link built by hand: `/collections/…` or `/globals/…`. */
const RAW_HREF = /^\/(collections|globals)(\/|$)/;

const noRawHrefs = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Links to collections and globals come from the contracts' `links()`." },
    messages: {
      noRawHrefs:
        "Build this link with the project's `links()` helpers (doc, list, create, global) instead of a `{{start}}…` string, so a renamed collection or tab is a compile error.",
    },
    schema: [
      {
        type: "object",
        properties: { dir: { type: "string" } },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ dir: "src" }],
  },
  create(context) {
    // The project's source only: tests assert the exact paths the helpers build.
    const options = /** @type {{ dir?: string }} */ (context.options[0] ?? {});
    if (!inDir(context, options.dir ?? "src")) return {};
    const check = (/** @type {any} */ node, /** @type {string | undefined} */ text) => {
      const m = text === undefined ? null : RAW_HREF.exec(text);
      if (m) context.report({ node, messageId: "noRawHrefs", data: { start: `/${m[1]}/` } });
    };
    return {
      Literal(/** @type {any} */ node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateLiteral(/** @type {any} */ node) {
        check(node, node.quasis[0]?.value?.cooked ?? node.quasis[0]?.value?.raw);
      },
    };
  },
});

// ---- fluid-classes --------------------------------------------------------------------------

/**
 * Fluid layout, by construction (a design system's own primitives): class strings that would
 * overflow a narrow container. Grounded in M3 (Lists: the content slot "must be the largest-width
 * slot") and Apple's HIG (Layout: adapt to every size, checked "for clipping"). What classes alone
 * can't show, the on-screen layout audit finds (`?audit`).
 */
const FIXED_SIZE = /^(?:w|size)-(?:\d|px|\[)/;
const CAPPED = /^max-w-/;
const WIDE = /^(?:min-)?w-(?:4\d|5\d|6\d|7\d|8\d|9\d|3xs|2xs|xs|sm|md|lg|xl|[2-7]xl)$/;
const WIDE_ARBITRARY = /^(?:min-)?w-\[(\d+(?:\.\d+)?)(rem|px)\]$/;

/** Is this string a list of utility classes (not prose)? */
export const isClassString = (/** @type {string} */ value) =>
  (/\b(?:flex|grid|shrink-0|w-|min-w-|btn|fieldset|input|textarea|select)/.test(value) ||
    (/\blabel\b/.test(value) && /\S-\S/.test(value))) &&
  /^[\w\-[\]:/.%(),!@&>*+=#"' ]+$/.test(value) &&
  !value.includes("  ") &&
  !/\b[A-Z][a-z]/.test(value);

/**
 * What in one class string breaks a fluid layout (each a sentence naming the fix):
 * 1. a `shrink-0` group (`flex`/`grid` with a `gap`) that neither wraps nor is capped;
 * 2. a fixed width of 10rem or more without a cap (`max-w-*`);
 * 3. a wrapping group (`flex-wrap`) that isn't capped: as a flex item it keeps its one-line width;
 * 4. a button (`btn`) without `max-w-full`;
 * 5. a fieldset without `min-w-0` (it's `min-width: min-content` by default);
 * 6. a form control (`input`, `textarea`, `select`) without `min-w-0`: in a grid (a fieldset) it
 *    keeps its built-in width (about 20 characters) instead of shrinking with the column;
 * 7. daisyUI's `label` (`white-space: nowrap`) without `whitespace-normal`: a long hint sets the
 *    width of the column it's in.
 * A fieldset (5) also needs a `minmax(0, 1fr)` column: a plain `1fr` is at least as wide as its
 * widest unbreakable line.
 */
export function fluidProblems(/** @type {string} */ value) {
  const tokens = value.split(/\s+/).filter(Boolean);
  const has = (/** @type {RegExp} */ re) => tokens.some((c) => re.test(c));
  const out = [];
  const group = has(/^(?:inline-)?(?:flex|grid)$/) && has(/^gap(?:-[xy])?-/);
  if (has(/^shrink-0$/) && group && !has(/^flex-col$/) && !has(/^flex-wrap$/) && !has(CAPPED) && !has(FIXED_SIZE))
    out.push(
      `a shrink-0 group ("${value}") neither wraps nor is capped: add flex-wrap or max-w-*, or mark it "layout: fixed"`,
    );
  const wide = tokens.find((c) => {
    const m = WIDE_ARBITRARY.exec(c);
    return WIDE.test(c) || (m !== null && (m[2] === "px" ? Number(m[1]) / 16 : Number(m[1])) >= 10);
  });
  if (wide && !has(CAPPED))
    out.push(`"${wide}" is wider than a phone column can be: add max-w-full (or use min(100%, …))`);
  if (has(/^flex-wrap$/) && !has(/^(?:max-w-|min-w-0$|w-full$|flex-1$|grow$|basis-)/))
    out.push(`a wrapping group ("${value}") isn't capped, so it won't wrap as a flex item: add max-w-full`);
  if (has(/^fieldset$/) && !has(/^min-w-0$/))
    out.push(`a fieldset ("${value}") without min-w-0 refuses to shrink below its widest field`);
  if (has(/^fieldset$/) && !has(/^grid-cols-\[minmax\(0,1fr\)\]$/))
    out.push(`a fieldset ("${value}") needs grid-cols-[minmax(0,1fr)]: its 1fr column is as wide as its widest line`);
  if (has(/^label$/) && tokens.length > 0 && !has(/^whitespace-normal$/))
    out.push(`daisyUI's label ("${value}") never wraps: add whitespace-normal`);
  const control = tokens.find((c) => c === "input" || c === "textarea" || c === "select");
  if (control && tokens.some((c) => /[-:]/.test(c)) && !has(/^min-w-0$/))
    out.push(
      `a form control ("${value.slice(0, 40)}…") without min-w-0 keeps its built-in width in a grid: add min-w-0`,
    );
  if (has(/^btn$/) && !has(CAPPED)) out.push(`a button ("${value.slice(0, 40)}…") isn't capped: add max-w-full`);
  return out;
}

const fluidClasses = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Class strings that would overflow a narrow container." },
    messages: { fluidClasses: "{{problem}}" },
    schema: [],
  },
  create(context) {
    const lines = context.sourceCode.lines;
    /** A recipe fixed on purpose says so on one of the two lines above it: `// layout: fixed (why)`. */
    const marked = (/** @type {any} */ node) => {
      const line = node.loc.start.line;
      return [lines[line - 1], lines[line - 2], lines[line - 3]].some((l) => l?.includes("layout: fixed"));
    };
    const check = (/** @type {any} */ node, /** @type {string} */ value) => {
      if (!isClassString(value) || marked(node)) return;
      for (const problem of fluidProblems(value))
        context.report({ node, messageId: "fluidClasses", data: { problem } });
    };
    return {
      Literal(/** @type {any} */ node) {
        if (typeof node.value === "string") check(node, node.value);
      },
    };
  },
});

// ---- the plugin and its recommended rules ---------------------------------------------------

const plugin = definePlugin({
  meta: { name: "saastemly" },
  rules: {
    "prefer-entries": preferEntries,
    "no-local-block-helpers": noLocalBlockHelpers,
    "widgets-are-pure": widgetsArePure,
    "endpoints-return-data": endpointsReturnData,
    "sentence-case-titles": sentenceCaseTitles,
    "max-blocks": maxBlocks,
    "no-raw-hrefs": noRawHrefs,
    "fluid-classes": fluidClasses,
  },
});

const BOUNDARY =
  "A project imports only saastemlycrm-design-system/contracts (pure) and saastemlycrm-design-system/payload. UI belongs in the design system.";

/**
 * The rules a project turns on: spread into `lint.rules` next to the plugin in `lint.jsPlugins`.
 * Includes oxlint's `no-restricted-imports` for the project boundary.
 */
export const recommended = {
  "saastemly/prefer-entries": "error",
  "saastemly/no-local-block-helpers": "error",
  "saastemly/widgets-are-pure": "error",
  "saastemly/endpoints-return-data": "error",
  "saastemly/sentence-case-titles": "warn",
  "saastemly/max-blocks": "warn",
  "saastemly/no-raw-hrefs": "error",
  "saastemly/fluid-classes": "error",
  "no-restricted-imports": [
    "error",
    {
      paths: [
        { name: "saastemlycrm-design-system", message: BOUNDARY },
        { name: "saastemlycrm-design-system/app", message: BOUNDARY },
        { name: "saastemlycrm-design-system/client", message: BOUNDARY },
        { name: "saastemlycrm-design-system/vite", message: BOUNDARY },
        { name: "lit", message: BOUNDARY },
      ],
      patterns: [{ group: ["saastemlycrm-design-system/src/**", "lit/**"], message: BOUNDARY }],
    },
  ],
};

export { isTitleCase };
export default plugin;
