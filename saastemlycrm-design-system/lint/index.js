import { existsSync } from "node:fs";
import { definePlugin, defineRule } from "vite-plus/lint/plugins";

/** @typedef {import("vite-plus/lint/plugins").ESTree.Node} Node */

const CONTRACTS = "saastemlycrm-design-system/contracts";
const PAYLOAD = "saastemlycrm-design-system/payload";

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

const stringOf = (/** @type {any} */ node) => {
  node = unwrap(node);
  if (node?.type === "Literal" && typeof node.value === "string") return node.value;
  if (node?.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis[0]?.value.cooked ?? "";
  return undefined;
};

const keyName = (/** @type {any} */ prop) => {
  if (prop?.type !== "Property" || prop.computed) return undefined;
  if (prop.key.type === "Identifier") return prop.key.name;
  return stringOf(prop.key);
};

const blockType = (/** @type {any} */ node) => {
  node = unwrap(node);
  if (node?.type !== "CallExpression" || node.callee.type !== "Identifier" || node.callee.name !== "block") return;
  return stringOf(node.arguments[0]);
};

const isNote = (/** @type {any} */ node) => {
  node = unwrap(node);
  return node?.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "note";
};

const propValue = (/** @type {any} */ obj, /** @type {string} */ name) => {
  obj = unwrap(obj);
  if (obj?.type !== "ObjectExpression") return undefined;
  return obj.properties.find((/** @type {any} */ p) => keyName(p) === name)?.value;
};

const isFunction = (/** @type {any} */ node) =>
  node?.type === "ArrowFunctionExpression" ||
  node?.type === "FunctionExpression" ||
  node?.type === "FunctionDeclaration";

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

const pathOf = (/** @type {any} */ context) => String(context.filename ?? "").replaceAll("\\", "/");
const inDir = (/** @type {any} */ context, /** @type {string} */ dir) => pathOf(context).includes(`/${dir}/`);

const ENTRY_PARTS = new Set(["text", "tags", "actions", "details", "alert", "stats"]);

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
    const cardMaps = new Map();
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
        const scope = context.sourceCode.getScope(program);
        for (const ref of scope.through)
          if (IMPURE_GLOBALS.has(ref.identifier.name)) impure(ref.identifier, ref.identifier.name);
      },
    };
  },
});

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
    const locals = new Map();
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

const RENDERING_BASES = new Set(["LitElement", "Directive", "AsyncDirective"]);

const componentsHaveStories = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Every module in components renders UI and has a story; logic and its tests live in lib." },
    messages: {
      noTests:
        "Components are tested by their stories. Move this test into `{{stories}}`, or move the logic it tests into src/lib.",
      noStory: "Every component module has a story: add `{{stories}}`.",
      renders: "This module renders nothing. Modules in components render UI; move it into src/lib.",
      noModule: "A stories file sits next to the module it shows: `{{module}}` does not exist.",
    },
    schema: [{ type: "object", properties: { dir: { type: "string" } }, additionalProperties: false }],
    defaultOptions: [{ dir: "src/components" }],
  },
  create(context) {
    const options = /** @type {{ dir?: string }} */ (context.options[0] ?? {});
    const file = pathOf(context);
    if (!file.includes(`/${options.dir ?? "src/components"}/`)) return {};
    const slash = file.lastIndexOf("/");
    const dir = file.slice(0, slash + 1);
    const name = file.slice(slash + 1);
    if (name === "index.ts" || name.endsWith(".d.ts") || !name.endsWith(".ts")) return {};
    const stem = name.slice(0, name.indexOf("."));
    let renders = false;
    return {
      TaggedTemplateExpression(/** @type {any} */ node) {
        if (node.tag.type === "Identifier" && (node.tag.name === "html" || node.tag.name === "svg")) renders = true;
      },
      ClassDeclaration(/** @type {any} */ node) {
        if (node.superClass?.type === "Identifier" && RENDERING_BASES.has(node.superClass.name)) renders = true;
      },
      Decorator(/** @type {any} */ node) {
        const e = node.expression;
        if (e.type === "CallExpression" && e.callee.type === "Identifier" && e.callee.name === "customElement")
          renders = true;
      },
      CallExpression(/** @type {any} */ node) {
        const c = node.callee;
        if (
          c.type === "MemberExpression" &&
          c.object.type === "Identifier" &&
          c.object.name === "customElements" &&
          c.property.type === "Identifier" &&
          c.property.name === "define"
        )
          renders = true;
      },
      "Program:exit"(/** @type {any} */ node) {
        if (name.endsWith(".test.ts")) {
          context.report({ node, messageId: "noTests", data: { stories: `${stem}.stories.ts` } });
        } else if (name.endsWith(".stories.ts")) {
          if (!existsSync(dir + stem + ".ts"))
            context.report({ node, messageId: "noModule", data: { module: `${stem}.ts` } });
        } else {
          if (!existsSync(dir + stem + ".stories.ts"))
            context.report({ node, messageId: "noStory", data: { stories: `${stem}.stories.ts` } });
          if (!renders) context.report({ node, messageId: "renders" });
        }
      },
    };
  },
});

const templatesInComponents = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Lit templates live in components and their stories, or in the Storybook setup." },
    messages: {
      template:
        "Only src/components and .storybook render lit templates. Move this markup into a component or a story, or build the DOM this test needs with document.createElement.",
    },
    schema: [],
  },
  create(context) {
    const file = pathOf(context);
    if (file.includes("/src/components/") || file.includes("/.storybook/")) return {};
    return {
      TaggedTemplateExpression(/** @type {any} */ node) {
        if (node.tag.type === "Identifier" && (node.tag.name === "html" || node.tag.name === "svg"))
          context.report({ node, messageId: "template" });
      },
    };
  },
});

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
    "components-have-stories": componentsHaveStories,
    "templates-in-components": templatesInComponents,
  },
});

const BOUNDARY =
  "A project imports only saastemlycrm-design-system/contracts (pure) and saastemlycrm-design-system/payload. UI belongs in the design system.";

export const recommended = {
  "saastemly/prefer-entries": "error",
  "saastemly/no-local-block-helpers": "error",
  "saastemly/widgets-are-pure": "error",
  "saastemly/endpoints-return-data": "error",
  "saastemly/sentence-case-titles": "warn",
  "saastemly/max-blocks": "warn",
  "saastemly/no-raw-hrefs": "error",
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
