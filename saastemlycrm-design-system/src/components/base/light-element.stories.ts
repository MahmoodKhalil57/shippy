import preview from "#.storybook/preview";
import { html, nothing, render } from "lit";
import { expect } from "storybook/test";
import { LightElement } from "./light-element.ts";

class StoryLight extends LightElement {
  static properties = { mode: { type: String } };
  declare mode: "div" | "span" | "bare" | "content" | "none";

  constructor() {
    super();
    this.mode = "div";
  }

  get report() {
    return {
      has: this.hasContent,
      icon: this.hasSlotted("icon"),
      nodes: this.slottedNodes().length,
      iconNodes: this.slottedNodes("icon").length,
    };
  }

  slotResult() {
    return this.slotted();
  }

  render() {
    switch (this.mode) {
      case "span":
        return html`<span class="body">${this.slotted()}</span><i>${this.slotted("icon")}</i>`;
      case "bare":
        return html`${this.slotted()}`;
      case "none":
        return html`<hr />`;
      case "content":
        return html`<p>${this.content}</p>`;
      default:
        return html`<div class="body">${this.slotted()}</div>
          <b>${this.slotted("icon")}</b>`;
    }
  }
}
if (!customElements.get("story-light-element")) customElements.define("story-light-element", StoryLight);

class StoryToggle extends LightElement {
  get nodes() {
    return this.contentNodes;
  }

  render() {
    return this.hasContent ? html`<div class="box">${this.content}</div>` : html`<span class="empty">empty</span>`;
  }
}
if (!customElements.get("story-light-toggle")) customElements.define("story-light-toggle", StoryToggle);

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const light = async (root: HTMLElement) => {
  const el = root.querySelector<StoryLight>("story-light-element")!;
  await el.updateComplete;
  return el;
};

const toggleHost = (note: boolean) =>
  html`<story-light-toggle>${note ? html`<em>note</em>` : nothing}</story-light-toggle>`;

const meta = preview.meta({
  render: () => html`<story-light-element>Hi</story-light-element>`,
});

export const RendersIntoItself = meta.story({
  name: "Renders into itself",
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    await expect(el.shadowRoot).toBeNull();
    await expect(el.hasAttribute("data-ui")).toBe(true);
    await expect(el.querySelector(".body")!.textContent).toBe("Hi");
  },
});

export const NamedSlots = meta.story({
  name: "Named slots",
  render: () => html`<story-light-element><u slot="icon"></u>text<em>x</em></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    await expect(el.querySelector("b > u")).not.toBeNull();
    await expect(el.querySelector(".body > em")).not.toBeNull();
    await expect(el.querySelector(".body")!.textContent).toBe("textx");
    await expect(el.report).toEqual({ has: true, icon: true, nodes: 2, iconNodes: 1 });
  },
});

export const NoContent = meta.story({
  name: "No content",
  render: () =>
    html`<story-light-element> </story-light-element><story-light-element><!-- note --></story-light-element
      ><story-light-element><span></span></story-light-element
      ><story-light-element><i slot="icon"></i></story-light-element>`,
  play: async ({ canvasElement }) => {
    const [blank, comment, span, icon] = canvasElement.querySelectorAll<StoryLight>("story-light-element");
    await Promise.all([blank, comment, span, icon].map((el) => el.updateComplete));
    await expect(blank.report).toMatchObject({ has: false, icon: false });
    await expect(comment.report.has).toBe(false);
    await expect(span.report.has).toBe(true);
    await expect(icon.report.has).toBe(false);
  },
});

export const StableAcrossRenders = meta.story({
  name: "Stable across re-renders",
  render: () => html`<story-light-element><em>x</em></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    const em = el.querySelector("em")!;
    el.requestUpdate();
    await el.updateComplete;
    await expect(el.querySelector(".body > em")).toBe(em);
  },
});

export const MovesIntoNewTemplate = meta.story({
  name: "Moves into a new template",
  render: () => html`<story-light-element><em>x</em><u slot="icon"></u></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    const em = el.querySelector("em")!;
    el.querySelector(".body")!.append(document.createElement("u"));
    el.mode = "span";
    await el.updateComplete;
    await expect(el.querySelector("span.body > em")).toBe(em);
    await expect(el.querySelector("span.body > u")).not.toBeNull();
    await expect(el.querySelector("i > u")).not.toBeNull();
    await expect(el.querySelector("div")).toBeNull();
  },
});

export const RecoversOriginalNodes = meta.story({
  name: "Recovers nodes after the part left",
  render: () => html`<story-light-element><em>x</em></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    const em = el.querySelector("em")!;
    el.mode = "bare";
    await el.updateComplete;
    await expect(em.parentNode).toBe(el);
    el.mode = "none";
    await el.updateComplete;
    await expect(em.isConnected).toBe(false);
    el.mode = "div";
    await el.updateComplete;
    await expect(el.querySelector(".body > em")).toBe(em);
  },
});

export const AllContent = meta.story({
  name: "All children through content",
  render: () => html`<story-light-element mode="content">a<u slot="icon"></u></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    const p = el.querySelector("p")!;
    await expect(p.textContent).toBe("a");
    await expect(p.querySelector("u")).not.toBeNull();
  },
});

export const CapturesOnce = meta.story({
  name: "Captures children on first connection",
  render: () => html`<story-light-element><em>x</em></story-light-element>`,
  play: async ({ canvasElement }) => {
    const el = await light(canvasElement);
    const parent = el.parentElement!;
    el.remove();
    el.append(document.createElement("strong"));
    parent.append(el);
    await el.updateComplete;
    await expect(el.report.nodes).toBe(1);
  },
});

export const MisplacedSlot = meta.story({
  name: "Error: slot outside a child position",
  play: async () => {
    const el = document.createElement("story-light-element") as StoryLight;
    await expect(() => render(html`<p title=${el.slotResult()}></p>`, document.createElement("div"))).toThrow(
      "slotted()/content can only be rendered in child positions",
    );
  },
});

export const ContentArrivesLater = meta.story({
  name: "Content that arrives later",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas }) => {
    const host = canvas.getByTestId("host");
    render(toggleHost(false), host);
    const el = host.querySelector<StoryToggle>("story-light-toggle")!;
    await el.updateComplete;
    await expect(el.querySelector(".empty")).not.toBeNull();
    render(toggleHost(true), host);
    await frame();
    await el.updateComplete;
    await expect(el.querySelector(".empty")).toBeNull();
    await expect(el.querySelector(".box > em")!.textContent).toBe("note");
    el.requestUpdate();
    await el.updateComplete;
    render(toggleHost(false), host);
    await el.updateComplete;
    await expect(el.querySelector(".box em")).toBeNull();
    el.requestUpdate();
    await el.updateComplete;
    await expect(el.querySelector(".box")).not.toBeNull();
  },
});

export const StopsWatching = meta.story({
  name: "Stops watching once disconnected",
  render: () => html`<div data-testid="host"></div>`,
  play: async ({ canvas }) => {
    const host = canvas.getByTestId("host");
    render(toggleHost(false), host);
    const el = host.querySelector<StoryToggle>("story-light-toggle")!;
    await el.updateComplete;
    el.requestUpdate();
    await el.updateComplete;
    await frame();
    await expect(el.isUpdatePending).toBe(false);
    el.remove();
    el.append(document.createElement("em"));
    await frame();
    await expect(el.isUpdatePending).toBe(false);
  },
});

export const BeforeConnection = meta.story({
  name: "Content before first connection",
  render: () => html`<story-light-toggle>text</story-light-toggle>`,
  play: async ({ canvasElement }) => {
    const shown = canvasElement.querySelector<StoryToggle>("story-light-toggle")!;
    await shown.updateComplete;
    await expect(shown.querySelector(".box")!.textContent).toBe("text");
    const el = document.createElement("story-light-toggle") as StoryToggle;
    el.append("text");
    await expect(el.nodes.map((n) => n.textContent)).toEqual(["text"]);
  },
});
