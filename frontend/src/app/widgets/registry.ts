import { html, nothing, type TemplateResult } from "lit";
import type { Action, ViewBlock, ViewBlocks } from "./schema.ts";

/** What a block renderer can ask of the view that holds it. */
export interface ViewContext {
  /** Run an action: navigate, or confirm / prompt, call the API, report, reload. */
  run(action: Action): void;
  /** Set a view parameter (a `choice`) and reload with it. */
  setParam(param: string, value: string): void;
  /** Reload the view's data. */
  reload(): void;
  /** Current view parameters. */
  params: Record<string, string>;
  /** The project element for a `custom` block, kept across reloads, with `props` set on it. */
  mount(element: string, props: Record<string, unknown>, key?: string): HTMLElement | typeof nothing;
}

type Renderer<B> = (block: B, ctx: ViewContext) => TemplateResult | typeof nothing;

const renderers = new Map<string, Renderer<never>>();

/**
 * Register how a block type is drawn: ./blocks.ts and ./blocks/*.ts, built from `ui-*` elements
 * only. A new block is generic (no project words); its type goes in `ViewBlocks` (./schema.ts).
 */
export function defineBlock<K extends keyof ViewBlocks>(type: K, render: Renderer<ViewBlocks[K]>) {
  renderers.set(type, render as Renderer<never>);
}

export const hasBlock = (type: string) => renderers.has(type);

export function renderBlock(block: ViewBlock, ctx: ViewContext): TemplateResult | typeof nothing {
  const render = renderers.get(block.type) as Renderer<ViewBlock> | undefined;
  if (!render)
    return html`<ui-alert tone="warning" heading="Unknown block">No renderer for "${block.type}".</ui-alert>`;
  return render(block, ctx);
}

export const renderBlocks = (blocks: ViewBlock[], ctx: ViewContext) => blocks.map((b) => renderBlock(b, ctx));
