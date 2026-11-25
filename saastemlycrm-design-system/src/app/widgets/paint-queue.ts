import { WorkQueue } from "../../components/base/work-queue.ts";

const draws = new WorkQueue<Element>({
  consumers: 1,
  sliceMs: 8,
  order: (a, b) => (a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1),
});

export function drawInTurn(el: Element, draw: () => Promise<unknown>): void {
  void draws.push(el, () => (el.isConnected ? draw() : undefined));
}
