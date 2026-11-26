import { html, nothing, type TemplateResult } from "lit";
import type { Dashboard } from "../../lib/dashboard/context.ts";
import type { Action, ViewBlock, ViewBlocks } from "../../lib/widgets/schema.ts";

export interface ViewContext {
  dashboard: Dashboard;
  run(action: Action): Promise<void> | void;
  setParam(param: string, value: string): void;
  reload(): void;
  inCard?: boolean;
  params: Record<string, string>;
  mount(element: string, props: Record<string, unknown>, key?: string): HTMLElement | typeof nothing;
}

type Renderer<B> = (block: B, ctx: ViewContext) => TemplateResult | typeof nothing;

const renderers = new Map<string, Renderer<never>>();

export function defineBlock<K extends keyof ViewBlocks>(type: K, render: Renderer<ViewBlocks[K]>) {
  renderers.set(type, render as Renderer<never>);
}

export function renderBlock(block: ViewBlock, ctx: ViewContext): TemplateResult | typeof nothing {
  const render = renderers.get(block.type) as Renderer<ViewBlock> | undefined;
  if (!render)
    return html`<ui-alert tone="warning" heading="Unknown block">No renderer for "${block.type}".</ui-alert>`;
  return render(block, ctx);
}

export const inCard = (ctx: ViewContext): ViewContext =>
  ctx.inCard ? ctx : Object.create(ctx, { inCard: { value: true } });

export const renderBlocks = (blocks: ViewBlock[], ctx: ViewContext) => blocks.map((b) => renderBlock(b, ctx));
