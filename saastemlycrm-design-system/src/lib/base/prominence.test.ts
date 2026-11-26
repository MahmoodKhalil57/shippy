import { describe, it, expect, afterEach } from "vite-plus/test";
import { MAX_PROMINENT, auditProminence } from "./prominence";

let host: HTMLElement | undefined;
afterEach(() => host?.remove());

const mount = (html: string) => {
  host = document.createElement("div");
  host.innerHTML = html;
  document.body.append(host);
  return host;
};

const btn = (cls: string, style = "") =>
  `<button class="btn ${cls}" style="width:40px;height:20px;${style}">b</button>`;

describe("auditProminence", () => {
  it("flags surfaces with more filled buttons than allowed", () => {
    const root = mount(`<main>${btn("btn-primary")}${btn("btn-error")}${btn("btn-neutral")}</main>`);
    const issues = auditProminence(root);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.surface).toBe(root.querySelector("main"));
    expect(issues[0]!.buttons).toHaveLength(3);
  });

  it("passes at the limit and honours a custom max", () => {
    const root = mount(`<main>${btn("btn-primary")}${btn("btn-accent")}</main>`);
    expect(MAX_PROMINENT).toBe(2);
    expect(auditProminence(root)).toEqual([]);
    expect(auditProminence(root, 1)).toHaveLength(1);
  });

  it("ignores quiet, unfilled, hidden and surface-less buttons", () => {
    const root = mount(
      `<main>${btn("btn-primary btn-ghost")}${btn("btn-primary btn-outline")}${btn("")}${btn("btn-primary", "visibility:hidden")}${btn("btn-primary", "display:none")}<button class="btn btn-primary" style="display:block;width:0;height:0;padding:0;border:0"></button></main><div>${btn("btn-primary")}${btn("btn-primary")}</div>`,
    );
    expect(auditProminence(root, 0)).toEqual([]);
  });

  it("separates open dialogs from the page", () => {
    const root = mount(`<main>${btn("btn-primary")}<dialog>${btn("btn-primary")}${btn("btn-primary")}</dialog></main>`);
    const dialog = root.querySelector("dialog")!;
    dialog.show();
    const issues = auditProminence(root, 1);
    expect(issues).toHaveLength(1);
    expect(issues[0]!.surface).toBe(dialog);
  });

  it("defaults to document.body and reads SVG classes too", () => {
    const root = mount(
      `<main><svg class="btn btn-primary" width="10" height="10"></svg><svg class="btn btn-primary" width="10" height="10"></svg><svg class="btn btn-primary" width="10" height="10"></svg></main>`,
    );
    const issues = auditProminence();
    expect(issues).toHaveLength(1);
    expect(issues[0]!.surface).toBe(root.querySelector("main"));
  });
});
