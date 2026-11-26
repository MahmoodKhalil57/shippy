import { describe, it, expect, afterEach } from "vite-plus/test";
import { MIN_COLUMN_WIDTH, MIN_TEXT_WIDTH, auditLayers, auditLayout, type LayoutIssue } from "./layout";

const mounted: Element[] = [];
afterEach(() => {
  for (const el of mounted.splice(0)) el.remove();
});

const mount = (inner: string, style = "", tag = "div") => {
  const root = document.createElement(tag);
  root.setAttribute("style", `display:block;width:400px;font:16px/20px sans-serif;${style}`);
  root.innerHTML = inner;
  document.body.append(root);
  mounted.push(root);
  return root;
};

const summary = (issues: LayoutIssue[]) => issues.map((i) => [i.kind, i.element.id, i.detail]);
const wide = (id: string, style = "") => `<div id="${id}" style="width:500px;height:10px;${style}"></div>`;
const LONG = "a long piece of running text that keeps going";

describe("auditLayout", () => {
  it("returns nothing without a root", () => {
    expect(auditLayout(null)).toEqual([]);
  });

  it("is quiet for content that fits", () => {
    expect(auditLayout(mount(`<p>${LONG}</p><div style="width:400px;height:4px"></div>`))).toEqual([]);
  });

  it("reports page scroll and the element that escapes the page", () => {
    const issues = auditLayout(mount(wide("w")));
    expect(summary(issues)).toEqual([
      ["page-scroll", "", "100px wider than the page"],
      ["escapes", "w", "100px past its box"],
    ]);
    expect(issues[0]!.element.tagName).toBe("DIV");
  });

  it("reports scrolling roots but not clipped ones", () => {
    expect(auditLayout(mount(wide("w"), "overflow-x:auto")).map((i) => i.kind)).toEqual(["page-scroll", "escapes"]);
    expect(auditLayout(mount(wide("w"), "overflow-x:hidden")).map((i) => i.kind)).toEqual(["escapes"]);
  });

  it("names the box an element escapes", () => {
    const box = (attrs: string, tag = "div") =>
      `<${tag} ${attrs} style="display:block;width:200px;background:#eee">${wide(tag + attrs.length)}</${tag}>`;
    const root = mount(
      box("data-list-row") +
        box(`class="card"`) +
        box("", "main") +
        `<dialog open style="position:static;width:200px;margin:0;padding:0;border:0">${wide("dlg")}</dialog>` +
        box("", "ui-thing") +
        `<div style="width:200px;border-left:1px solid">${wide("b")}</div>`,
      "overflow:hidden",
    );
    const details = auditLayout(root).map((i) => i.detail);
    expect(details).toEqual([
      "300px past its list row",
      "300px past its card",
      "300px past its page",
      "300px past its dialog",
      "300px past its ui-thing",
      "300px past its box",
    ]);
  });

  it("measures escapes on the start side too, and ignores a pixel of slack", () => {
    const root = mount(
      `<div id="l" style="margin-left:-30px;width:10px;height:4px"></div><div id="s" style="margin-left:-1px;width:10px;height:4px"></div>`,
      "overflow:hidden",
    );
    expect(summary(auditLayout(root))).toEqual([["escapes", "l", "30px past its box"]]);
  });

  it("checks against the nearest box, passing through plain wrappers", () => {
    const root = mount(
      `<div class="card" style="width:200px;border-right:2px solid"><div><div style="display:contents">${wide("deep")}</div></div></div>` +
        `<div style="width:200px;border-left:3px none;background:rgba(10,10,10,0)"><div style="width:600px;height:4px" id="plain"></div></div>` +
        `<div style="width:100px;backdrop-filter:blur(2px)">${wide("frost")}</div>`,
      "overflow:hidden",
    );
    expect(summary(auditLayout(root))).toEqual([
      ["escapes", "deep", "298px past its card"],
      ["escapes", "plain", "200px past its box"],
      ["escapes", "frost", "400px past its box"],
    ]);
  });

  it("does not report an escaped element's own children", () => {
    const root = mount(
      `<div id="out" style="width:500px;height:4px">${wide("in", "width:900px")}</div>`,
      "overflow:hidden",
    );
    expect(summary(auditLayout(root)).map((s) => s[1])).toEqual(["out"]);
  });

  it("skips floating, hidden, skipped and animating content", () => {
    const root = mount(
      `<div style="position:absolute;width:900px;height:4px"></div>` +
        `<div style="position:fixed;width:900px;height:4px"></div>` +
        `<div style="display:none">${wide("n")}</div>` +
        `<div style="visibility:hidden">${wide("v")}</div>` +
        `<div style="height:0;overflow:visible">${wide("z")}</div>` +
        `<div style="width:0;height:20px;overflow:hidden">${wide("c")}</div>` +
        `<template>${wide("t")}</template><div hidden>${wide("h")}</div><div inert>${wide("i")}</div>` +
        `<div popover>${wide("p")}</div><dialog>${wide("d")}</dialog><ui-contrast-audit>${wide("a")}</ui-contrast-audit>` +
        `<div id="anim" style="width:100px;height:4px">${wide("moving")}</div>`,
      "overflow:hidden",
    );
    const anim = root.querySelector("#anim")!.animate([{ opacity: 1 }, { opacity: 0.5 }], { duration: 100_000 });
    try {
      expect(auditLayout(root)).toEqual([]);
    } finally {
      anim.cancel();
    }
    expect(summary(auditLayout(root)).map((s) => s[1])).toEqual(["moving"]);
    const paused = root.querySelector("#anim")!.animate([{ opacity: 1 }, { opacity: 0.5 }], { duration: 100_000 });
    paused.pause();
    try {
      expect(summary(auditLayout(root)).map((s) => s[1])).toEqual(["moving"]);
    } finally {
      paused.cancel();
    }
  });

  it("reports sticky elements that escape", () => {
    const root = mount(wide("sticky", "position:sticky;top:0"), "overflow:hidden");
    expect(summary(auditLayout(root)).map((s) => s[1])).toEqual(["sticky"]);
  });

  it("walks through zero-width wrappers that show their overflow", () => {
    const root = mount(`<div style="width:0;height:20px">${wide("x")}</div>`, "overflow:hidden");
    expect(summary(auditLayout(root)).map((s) => s[1])).toEqual(["x"]);
  });

  it("keeps zero-width elements with their own text", () => {
    const root = mount(`<div id="t" style="width:0;height:20px;white-space:nowrap">hello</div>`, "overflow:hidden");
    expect(auditLayout(root)).toEqual([]);
  });

  it("stops checking escapes inside horizontal scrollers", () => {
    const root = mount(`<div style="overflow-x:auto;width:100px">${wide("s")}</div>`, "overflow:hidden");
    expect(auditLayout(root)).toEqual([]);
  });

  it("reports truncated text squeezed below the minimum width", () => {
    expect(MIN_TEXT_WIDTH).toBe(40);
    const ellipsis = "overflow:hidden;white-space:nowrap;text-overflow:ellipsis;";
    const root = mount(
      `<div id="e" style="${ellipsis}width:30px">${LONG}</div>` +
        `<div id="k" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow:hidden;width:20px;height:20px">${LONG}</div>` +
        `<div id="short" style="${ellipsis}width:10px">abc</div>` +
        `<div id="roomy" style="${ellipsis}width:60px">${LONG}</div>` +
        `<div id="fits" style="${ellipsis}width:30px;font-size:6px">ab cd</div>` +
        `<div id="cut" style="overflow:hidden;white-space:nowrap;width:30px">${LONG}</div>`,
      "overflow:hidden",
    );
    const issues = auditLayout(root).filter((i) => i.kind === "squeezed");
    expect(summary(issues)).toEqual([
      ["squeezed", "e", "squeezed to 30px"],
      ["squeezed", "k", "squeezed to 20px"],
    ]);
  });

  it("reports text wrapped into a narrow column", () => {
    expect(MIN_COLUMN_WIDTH).toBe(112);
    const root = mount(
      `<div id="narrow" style="width:100px">${LONG}</div>` +
        `<div id="normal" style="width:100px;line-height:normal;font-size:10px">${LONG} ${LONG}</div>` +
        `<div id="nowrap" style="width:100px;white-space:nowrap;overflow:hidden">${LONG}</div>` +
        `<div id="few" style="width:100px">short words only</div>` +
        `<div id="two" style="width:100px;font-size:8px;line-height:10px">${LONG}</div>` +
        `<div id="ok" style="width:200px">${LONG}</div>`,
      "overflow:hidden",
    );
    const cramped = auditLayout(root).filter((i) => i.kind === "cramped");
    expect(cramped.map((i) => i.element.id)).toEqual(["narrow", "normal"]);
    expect(cramped[0]!.detail).toMatch(/^\d+ lines in 100px$/);
    expect(Number(cramped[0]!.detail.split(" ")[0])).toBeGreaterThanOrEqual(3);
  });

  it("measures inline text by its block's content width", () => {
    const root = mount(
      `<div style="width:100px;padding:0 10px"><b><span id="in">${LONG}</span></b></div>` +
        `<div style="width:200px"><span id="wide">${LONG}</span></div>`,
      "overflow:hidden",
    );
    expect(auditLayout(root).map((i) => i.element.id)).toEqual(["in"]);
  });

  it("uses the inline element's own width when no block contains it", () => {
    const host = mount("", "overflow:hidden");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `<span id="top" style="display:inline"><span id="txt">${LONG}</span></span>`;
    const top = shadow.getElementById("top")!;
    const issues = auditLayout(top);
    expect(issues.filter((i) => i.kind === "cramped")).toEqual([]);
  });

  it("defaults to the page's main element, else the body", () => {
    const loose = mount(wide("loose"), "overflow:hidden");
    expect(auditLayout().some((i) => i.element === loose.firstElementChild)).toBe(true);
    const main = mount(wide("in-main"), "overflow:hidden", "main");
    const issues = auditLayout();
    expect(issues.map((i) => i.element)).toEqual([main.firstElementChild]);
  });
});

describe("auditLayers", () => {
  it("audits the page and each open top-level layer", () => {
    const main = mount(wide("page"), "overflow:hidden", "main");
    const pop = mount(wide("pop"), "overflow:hidden;width:200px");
    pop.setAttribute("popover", "manual");
    pop.showPopover();
    const nested = document.createElement("div");
    nested.setAttribute("role", "dialog");
    nested.setAttribute("style", "width:100px;height:10px");
    pop.append(nested);
    const hidden = mount(wide("hidden-dialog"), "display:none");
    hidden.setAttribute("role", "dialog");
    const invisible = mount(wide("invisible"), "visibility:hidden");
    invisible.setAttribute("role", "dialog");
    const audit = mount("", "", "ui-contrast-audit");
    const own = document.createElement("div");
    own.setAttribute("popover", "manual");
    own.innerHTML = wide("own");
    audit.append(own);
    own.showPopover();
    try {
      const ids = auditLayers().map((i) => i.element.id);
      expect(ids).toContain("page");
      expect(ids).toContain("pop");
      expect(ids).not.toContain("own");
      expect(ids).not.toContain("hidden-dialog");
      expect(ids).not.toContain("invisible");
      expect(main.isConnected).toBe(true);
    } finally {
      pop.hidePopover();
      own.hidePopover();
    }
  });
});
