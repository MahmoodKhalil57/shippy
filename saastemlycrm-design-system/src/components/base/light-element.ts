import { LitElement, noChange, type ChildPart, type nothing, type TemplateResult } from "lit";
import { Directive, directive, PartType, type DirectiveResult, type PartInfo } from "lit/directive.js";

export class LightElement extends LitElement {
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

  protected get hasContent() {
    return this.slottedNodes().some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()),
    );
  }

  protected slottedNodes(name?: string): Node[] {
    return this.contentNodes.filter((n) => {
      const s = n instanceof Element ? n.getAttribute("slot") : null;
      return name ? s === name : !s;
    });
  }

  readonly _slotParts = new Map<string, { part: ChildPart; nodes: Node[] }>();

  protected slotted(name?: string): DirectiveResult {
    return slot(this, name ?? "", () => this.slottedNodes(name));
  }

  protected get content(): DirectiveResult {
    return slot(this, "*", () => this.contentNodes);
  }

  protected hasSlotted(name: string) {
    return this.slottedNodes(name).length > 0;
  }
}

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

function nodesIn(part: ChildPart): Node[] | null {
  const start = part.startNode;
  if (!start?.parentNode) return null;
  const out: Node[] = [];
  for (let n = start.nextSibling; n && n !== part.endNode; n = n.nextSibling) out.push(n);
  return out;
}

const slot = directive(SlotDirective);

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
export const uid = (prefix = "ui") => `${prefix}-${++_uid}`;
