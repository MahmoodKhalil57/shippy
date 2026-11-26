import { describe, it, expect, afterEach } from "vite-plus/test";
import { auditContrast } from "./contrast";

let host: HTMLElement | undefined;
const html = document.documentElement;

afterEach(() => {
  host?.remove();
  host = undefined;
  html.style.removeProperty("background-color");
  document.body.style.removeProperty("background-color");
});

const mount = (inner: string, style = "background:#fff") => {
  host = document.createElement("div");
  host.setAttribute("style", `position:fixed;top:0;left:0;width:600px;${style}`);
  host.innerHTML = inner;
  document.body.append(host);
  return host;
};

const p = (color: string, text: string, style = "") =>
  `<p style="color:${color};font-size:16px;margin:0;${style}">${text}</p>`;

describe("auditContrast", () => {
  it("flags small text below 4.5:1 and large text below 3:1, worst first", () => {
    const root = mount(
      p("#777", "grey small") +
        p("#767676", "ok small") +
        p("#999", "grey large", "font-size:24px") +
        p("#888", "ok large", "font-size:24px") +
        p("#888", "ok bold", "font-size:19px;font-weight:700") +
        p("#888", "weak normal", "font-size:19px"),
    );
    const issues = auditContrast(root);
    expect(issues.map((i) => i.text)).toEqual(["grey large", "weak normal", "grey small"]);
    const [large, normal, small] = issues;
    expect(large!.required).toBe(3);
    expect(normal!.required).toBe(4.5);
    expect(small).toMatchObject({
      element: root.children[0],
      required: 4.5,
      color: "rgb(119 119 119)",
      background: "rgb(255 255 255)",
      overImage: false,
    });
    expect(small!.ratio).toBeCloseTo(4.48, 2);
  });

  it("checks each element once and trims long text to 80 characters", () => {
    const root = mount(p("#aaa", `  ${"word ".repeat(30)}<b style="color:#000">bold</b> tail`));
    const issues = auditContrast(root);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.text).toHaveLength(80);
  });

  it("skips hidden, disabled, tiny, off-screen, transparent and blank text", () => {
    const root = mount(
      `<button disabled style="color:#ccc">disabled</button>` +
        `<div aria-disabled="true">${p("#ccc", "aria")}</div>` +
        `<div inert>${p("#ccc", "inert")}</div>` +
        `<ui-contrast-audit>${p("#ccc", "audit")}</ui-contrast-audit>` +
        p("#ccc", "tiny", "display:inline-block;width:3px;height:3px;overflow:hidden") +
        p("#ccc", "above", "position:fixed;top:-200px") +
        p("#ccc", "below", "position:fixed;top:100000px") +
        p("#ccc", "left", "position:fixed;left:-2000px;width:100px") +
        p("#ccc", "right", "position:fixed;left:100000px") +
        p("#ccc", "faded", "opacity:0") +
        p("#ccc", "hidden", "visibility:hidden") +
        p("transparent", "clear") +
        p("#ccc", "   ") +
        `<style>.x{color:#ccc}</style><template>${p("#ccc", "t")}</template>`,
    );
    expect(auditContrast(root)).toEqual([]);
  });

  it("composites translucent backgrounds over the nearest opaque one", () => {
    const root = mount(`<div style="background:rgba(0,0,0,0.5)">${p("#fff", "on grey")}</div>`);
    const [issue] = auditContrast(root);
    expect(issue!.background).toBe("rgb(127 127 127)");
    expect(issue!.color).toBe("rgb(255 255 255)");
  });

  it("composites translucent text colour over its background", () => {
    const root = mount(p("rgba(0,0,0,0.3)", "faint"));
    expect(auditContrast(root)[0]!.color).toBe("rgb(178 178 178)");
  });

  it("falls back to a white page when nothing is opaque", () => {
    const root = mount(p("#999", "grey") + p("#000", "black"), "");
    const issues = auditContrast(root);
    expect(issues.map((i) => i.text)).toEqual(["grey"]);
    expect(issues[0]!.background).toBe("rgb(255 255 255)");
  });

  it("uses a mostly opaque page colour as the page", () => {
    html.style.backgroundColor = "rgba(0,0,0,0.7)";
    const root = mount(p("#fff", "white") + p("#333", "dark"), "");
    const issues = auditContrast(root);
    expect(issues.map((i) => i.text)).toEqual(["dark"]);
    expect(issues[0]!.background).toBe("rgb(0 0 0)");
  });

  it("defaults to auditing document.body", () => {
    const root = mount(p("#eee", "pale"));
    const issues = auditContrast();
    expect(issues.map((i) => i.element)).toContain(root.firstElementChild);
  });
});

type Backdrop = (rect: DOMRect, blur?: number) => number[] | null;

const frame = (backdropAt: Backdrop, inner: string, layers: string, withMain = true) => {
  const root = mount(
    `<ui-app-shell><div data-frame style="position:relative">` +
      layers +
      (withMain
        ? `<ui-frame-main><main style="display:block;width:300px;height:100px">${p("#fff", "inside")}</main></ui-frame-main>`
        : "") +
      inner +
      `</div></ui-app-shell>`,
    "",
  );
  Object.assign(root.querySelector("ui-app-shell")!, { backdropAt });
  return root;
};

const layer = (kind: string, style: string) =>
  `<div data-frame-layer ${kind} style="position:absolute;inset:0;pointer-events:none;${style}"></div>`;

describe("auditContrast over an app-shell frame", () => {
  it("reads the image under text and marks it as over an image", () => {
    const calls: number[] = [];
    const root = frame(
      (_, blur) => {
        calls.push(blur!);
        return [0.9, 0.002];
      },
      p("#fff", "outside", "margin-top:20px"),
      layer("data-frame-backdrop", "background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)") +
        layer("data-frame-shell", "background:rgba(0,0,0,0.2);backdrop-filter:blur(12px)") +
        layer("data-frame-live", "background:transparent"),
    );
    const issues = auditContrast(root);
    const by = Object.fromEntries(issues.map((i) => [i.text, i]));
    expect(by.inside!.overImage).toBe(true);
    expect(by.outside!.overImage).toBe(true);
    expect(by.inside!.background).toBe("rgb(194 194 194)");
    expect(by.outside!.background).toBe("rgb(121 121 121)");
    expect(calls).toEqual([12, 4]);
  });

  it("uses every shell layer when the frame has no window", () => {
    const root = frame(
      () => [0.002],
      p("#fff", "light"),
      layer("data-frame-backdrop", "background:rgba(255,255,255,0.5)") +
        layer("data-frame-shell", "background:rgba(0,0,0,0.5)"),
      false,
    );
    const [issue] = auditContrast(root);
    expect(issue!.background).toBe("rgb(131 131 131)");
    expect(issue!.overImage).toBe(true);
  });

  it("keeps walking up when the shell has no image", () => {
    for (const image of [null, []]) {
      const root = frame(() => image, "", layer("data-frame-shell", "background:rgba(0,0,0,0.5)"));
      root.setAttribute("style", `${root.getAttribute("style")};background:#fff`);
      const issues = auditContrast(root);
      expect(issues).toHaveLength(1);
      expect(issues[0]!.overImage).toBe(false);
      expect(issues[0]!.background).toBe("rgb(127 127 127)");
      host!.remove();
    }
  });

  it("ignores frame layers outside an app shell and blur on plain ancestors", () => {
    const root = mount(
      `<div style="backdrop-filter:blur(3px);background:rgba(0,0,0,0.5)"><div data-frame>${layer("data-frame-shell", "background:#000")}${p("#fff", "plain")}</div></div>`,
    );
    const [issue] = auditContrast(root);
    expect(issue!.overImage).toBe(false);
    expect(issue!.background).toBe("rgb(127 127 127)");
  });
});
