import { LitElement, noChange, type ChildPart, type nothing, type TemplateResult } from "lit";
import { Directive, directive, PartType, type DirectiveResult, type PartInfo } from "lit/directive.js";

/**
 * Base class for all UI components.
 *
 * - Renders into light DOM (no shadow root) so the global Tailwind + daisyUI
 *   stylesheet applies to the rendered markup, and native form controls rendered
 *   inside still take part in their surrounding `<form>`. Native events
 *   (`input`, `change`, `click`, `toggle`...) bubble out through the host as-is.
 * - Captures the children authored inside the tag before the first render and
 *   exposes them as `content`, standing in for a default `<slot>`.
 * - Styling comes only from typed variant properties (see `rcva` in
 *   ./variants.ts, which also makes them responsive). There is deliberately no
 *   `class`/`classes` passthrough: custom classes and inline styles are only
 *   allowed inside primitives (enforced by tests/architecture.test.ts).
 * - The host element is `display: contents` (see src/styles/theme.css), so it
 *   doesn't add a box between a parent's layout and the rendered markup.
 *
 * Where daisyUI relies on direct-child selectors (e.g. `.join > .join-item`,
 * `.menu > li`), primitives render the repeated parts themselves; composed
 * components use the exported recipes in their own templates.
 */
export class LightElement extends LitElement {
  /** The children authored inside the tag, captured before the first render. */
  protected contentNodes: Node[] = [];
  private _captured = false;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    this.toggleAttribute("data-ui", true);
    if (!this._captured) {
      this.contentNodes = Array.from(this.childNodes);
      this._captured = true;
    }
    super.connectedCallback();
  }

  /** True when the author put any non-whitespace children inside the tag. */
  protected get hasContent() {
    return this.slottedNodes().some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()),
    );
  }

  /** Authored children whose `slot` attribute is `name` (or, without a name, have none). */
  protected slottedNodes(name?: string): Node[] {
    return this.contentNodes.filter((n) => {
      const s = n instanceof Element ? n.getAttribute("slot") : null;
      return name ? s === name : !s;
    });
  }

  /** Where each slot's nodes were last placed (see `SlotDirective`). */
  readonly _slotParts = new Map<string, { part: ChildPart; nodes: Node[] }>();

  /**
   * Light-DOM stand-in for named slots, for use in templates: `slotted("title")`
   * renders the children marked `slot="title"`; `slotted()` the unmarked rest.
   */
  protected slotted(name?: string): DirectiveResult {
    return slot(this, name ?? "", () => this.slottedNodes(name));
  }

  /** All authored children, for use in templates (see `slotted`). */
  protected get content(): DirectiveResult {
    return slot(this, "*", () => this.contentNodes);
  }

  /** Has the author supplied a child marked `slot="<name>"`? */
  protected hasSlotted(name: string) {
    return this.slottedNodes(name).length > 0;
  }
}

/**
 * Moves a host's authored children into the part where its template renders
 * them, as they are:
 *
 * - One DocumentFragment, not an array: an array would put Lit's per-item
 *   marker comments between the nodes and break bindings of the template that
 *   authored them (`<ui-button>Count is ${n}</ui-button>` would stop updating).
 * - Re-rendering into the same part leaves the nodes alone (`noChange`), so
 *   nodes the authoring template added since, e.g. a growing
 *   `<ui-join>${items.map(...)}</ui-join>`, are kept.
 * - Rendering into a new part (the host switched templates, e.g. `<button>` to
 *   `<a>`) moves whatever currently sits in the previous part, so those
 *   additions move along too.
 */
class SlotDirective extends Directive {
  constructor(info: PartInfo) {
    super(info);
    if (info.type !== PartType.CHILD) throw new Error("slotted()/content can only be rendered in child positions");
  }

  render(_host: LightElement, _key: string, _initial: () => Node[]) {
    return noChange;
  }

  update(part: ChildPart, [host, key, initial]: Parameters<this["render"]>) {
    const previous = host._slotParts.get(key);
    if (previous?.part === part) return noChange;
    const nodes = previous ? (nodesIn(previous.part) ?? previous.nodes) : initial();
    host._slotParts.set(key, { part, nodes });
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
  }
}

/** The nodes currently between a child part's markers, or null if they were taken apart. */
function nodesIn(part: ChildPart): Node[] | null {
  const start = part.startNode;
  if (!start?.parentNode) return null;
  const out: Node[] = [];
  for (let n = start.nextSibling; n && n !== part.endNode; n = n.nextSibling) out.push(n);
  return out;
}

const slot = directive(SlotDirective);

/** Anything Lit can render in a child position. */
export type Renderable =
  | TemplateResult
  | DirectiveResult
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | typeof nothing
  | readonly Renderable[];

let _uid = 0;
/** Unique id for wiring radio groups, labels, popovers, etc. */
export const uid = (prefix = "ui") => `${prefix}-${++_uid}`;
