import { WorkQueue } from "../../components/base/work-queue.ts";

/**
 * Draws widgets' first loads in page order, a slice at a time, giving the main thread back between
 * slices. A screen's data tends to arrive together (widgets share their sources), and drawing every
 * tile in one task makes the browser lay out and paint the whole page in one long frame before
 * anything shows. In slices, the tiles at the top of the page (first in the document, as the board
 * places them in order) draw first and the rest fill in under them, and input stays responsive.
 *
 * One consumer (drawing is main-thread work, so a second one would only interleave), yielding with
 * `scheduler.yield()` after about 8ms of drawing (src/components/base/work-queue.ts).
 * Only first loads queue: a refresh after an action changes what's on screen in place, at once.
 */
const draws = new WorkQueue<Element>({
  consumers: 1,
  sliceMs: 8,
  order: (a, b) => (a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1),
});

/** Queue a widget's first draw; `draw` sets its state and resolves when it has rendered. */
export function drawInTurn(el: Element, draw: () => Promise<unknown>): void {
  void draws.push(el, () => (el.isConnected ? draw() : undefined));
}
