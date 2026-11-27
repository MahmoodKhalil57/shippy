import preview from "#.storybook/preview";
import { expect, spyOn, waitFor } from "storybook/test";
import {
  at,
  fire,
  fullAccess,
  lastClickPrevented,
  listPage,
  listRender,
  own,
  peek,
  pop,
  poppedBack,
  settled,
  shown,
  urlWith,
} from "../../../.storybook/fixtures/list-view.ts";
import type { DashboardListView } from "./list-view.ts";
import "./edit-view.ts";
import "./list-view.ts";

const meta = preview.meta({
  component: "dashboard-list-view",
  parameters: { layout: "fullscreen" },
  beforeEach: listPage,
  render: listRender(),
});

const link = (view: DashboardListView, href: string) => view.querySelector<HTMLAnchorElement>(`a[href="${href}"]`)!;
const editor = (view: DashboardListView) => view.querySelector("dashboard-edit-view")!;
const discardOf = (view: DashboardListView) =>
  [...view.querySelectorAll("ui-modal")].find((m) => !m.closest("dashboard-edit-view"))!;
const loadedDoc = (view: DashboardListView) => waitFor(() => expect(peek(view).doc?.loading).toBe(false));
const dirty = (view: DashboardListView, state: Partial<Record<string, unknown>> = {}) => {
  fire(editor(view), "dashboard-doc-state", {
    title: "Draft the launch plan",
    loading: false,
    saving: false,
    dirty: true,
    canSave: true,
    found: true,
    ...state,
  });
  return view.updateComplete;
};

export const OpenFromLink = meta.story({
  name: "Opens a record from its link, saves, closes on the way back",
  play: async ({ canvasElement }) => {
    const browser = [location.href, history.length];
    const { view, dashboard } = await shown(canvasElement);
    link(view, "/collections/tasks/t1").click();
    await view.updateComplete;
    await expect(peek(view).openId).toBe("t1");
    await expect(own().get("k[open]")).toBe("t1");
    await expect(dashboard.navigations).toEqual([{ to: "/?k[open]=t1", replace: false }]);
    const sheet = view.querySelector("ui-sheet")!;
    await expect(sheet.getAttribute("label") ?? (sheet as unknown as { label: string }).label).toBe(
      "Draft the launch plan",
    );
    await loadedDoc(view);
    const save = spyOn(editor(view), "save").mockImplementation(() => {});
    await dirty(view);
    const button = [...sheet.querySelectorAll("ui-button")].find((b) => b.textContent!.trim() === "Save")!;
    button.click();
    await expect(save).toHaveBeenCalled();
    await dirty(view, { saving: true });
    await expect(sheet.textContent).toContain("Saving…");
    await dirty(view, { dirty: false });
    await expect(sheet.textContent).toContain("Saved");
    await dirty(view, { canSave: false, dirty: false });
    await expect(sheet.textContent).toContain("Read only");
    await dirty(view, { loading: true, dirty: false });
    await expect(sheet.textContent).not.toContain("Read only");
    fire(editor(view), "dashboard-doc-saved");
    await settled(view);
    const back = poppedBack();
    fire(sheet, "ui-close");
    await back;
    await view.updateComplete;
    await expect(peek(view).openId).toBe("");
    await expect(peek(view).sheetId).toBe("");
    await expect(own().get("k[open]")).toBeNull();
    await expect([location.href, history.length]).toEqual(browser);
  },
});

export const OpenFromAddress = meta.story({
  name: "Opens the record in the address, closes in place",
  beforeEach: at("k[open]=t2"),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    await expect(peek(view).openId).toBe("t2");
    fire(view.querySelector("ui-sheet")!, "ui-close");
    await view.updateComplete;
    await expect(own().get("k[open]")).toBeNull();
    fire(view.querySelector("ui-sheet")!, "ui-close");
    const inner = document.createElement("span");
    view.querySelector("ui-sheet")!.append(inner);
    fire(inner, "ui-close");
    fire(inner, "ui-dismiss");
    await view.updateComplete;
    inner.remove();
  },
});

export const UnsavedGuard = meta.story({
  name: "Asks before leaving unsaved changes",
  beforeEach: at("k[open]=t1"),
  play: async ({ canvasElement }) => {
    const { view, dashboard } = await shown(canvasElement);
    await loadedDoc(view);
    await dirty(view);
    const sheet = view.querySelector("ui-sheet")!;
    await expect(sheet.textContent).toContain("Unsaved changes");
    await expect(fire(sheet, "ui-dismiss")).toBe(false);
    await view.updateComplete;
    await expect(peek(view).leaving).not.toBeNull();
    const discard = discardOf(view);
    fire(discard, "ui-close");
    await view.updateComplete;
    await expect(peek(view).leaving).toBeNull();
    link(view, "/collections/tasks/t2").click();
    await view.updateComplete;
    await expect(peek(view).leaving).not.toBeNull();
    fire(discard, "ui-confirm");
    await view.updateComplete;
    await expect(peek(view).openId).toBe("t2");
    await loadedDoc(view);
    await dirty(view);
    const inside = document.createElement("a");
    inside.href = "/collections/people/p1?tab=x";
    sheet.append(inside);
    inside.click();
    await view.updateComplete;
    fire(discard, "ui-confirm");
    await expect(dashboard.navigations).toEqual([
      { to: "/?k[open]=t2", replace: false },
      { to: "/collections/people/p1?tab=x", replace: false },
    ]);
    await dirty(view);
    const outside = document.createElement("a");
    outside.href = "/elsewhere/nowhere";
    sheet.append(outside);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    outside.addEventListener("click", (e) => e.preventDefault(), { once: false });
    outside.dispatchEvent(event);
    await dirty(view, { dirty: false });
    inside.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    await expect(peek(view).leaving).toBeNull();
    await dirty(view);
    fire(sheet, "ui-dismiss");
    await view.updateComplete;
    fire(discard, "ui-confirm");
    await view.updateComplete;
    await expect(peek(view).openId).toBe("");
    inside.remove();
    outside.remove();
  },
});

export const HistoryGuard = meta.story({
  name: "Follows the address back and forth, guarding changes",
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    link(view, "/collections/tasks/t1").click();
    await view.updateComplete;
    await loadedDoc(view);
    await dirty(view);
    urlWith("k[open]=t3");
    pop();
    await view.updateComplete;
    await expect(peek(view).leaving).not.toBeNull();
    fire(discardOf(view), "ui-confirm");
    await view.updateComplete;
    await expect(peek(view).openId).toBe("t3");
    await loadedDoc(view);
    await dirty(view);
    urlWith("k[sort]=title");
    pop();
    await view.updateComplete;
    fire(discardOf(view), "ui-confirm");
    await view.updateComplete;
    await expect(peek(view).openId).toBe("");
    urlWith("k[sort]=title&k[open]=t4");
    pop();
    await settled(view);
    await expect(peek(view).query.sort).toBe("title");
    await expect(peek(view).openId).toBe("t4");
    pop();
    await view.updateComplete;
    urlWith("k[sort]=title");
    pop();
    await view.updateComplete;
    await expect(peek(view).openId).toBe("");
  },
});

export const OrdinaryLinks = meta.story({
  name: "Leaves ordinary and foreign links alone",
  render: listRender({ spec: { columns: ["title", "owner"] } }),
  play: async ({ canvasElement }) => {
    const { view } = await shown(canvasElement);
    const a = link(view, "/collections/tasks/t1");
    const press = (el: Element, init: MouseEventInit = {}) => {
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ...init }));
      return lastClickPrevented();
    };
    await expect(press(a, { ctrlKey: true })).toBe(false);
    await expect(press(a, { metaKey: true })).toBe(false);
    await expect(press(a, { shiftKey: true })).toBe(false);
    await expect(press(a, { altKey: true })).toBe(false);
    await expect(press(a, { button: 1 })).toBe(false);
    await expect(press(view.querySelector("tbody td")!)).toBe(false);
    const added: Element[] = [];
    const extra = (href: string, set: (el: HTMLAnchorElement) => void = () => {}) => {
      const el = document.createElement("a");
      el.href = href;
      set(el);
      view.append(el);
      added.push(el);
      return el;
    };
    await expect(press(extra("/collections/tasks/t1", (el) => (el.target = "_blank")))).toBe(false);
    await expect(press(extra("/collections/tasks/t1", (el) => el.setAttribute("download", "")))).toBe(false);
    await expect(press(extra("https://example.com/collections/tasks/t1"))).toBe(false);
    await expect(press(extra("/collections/people/p1"))).toBe(false);
    await expect(press(extra("/collections/tasks/t1/notes"))).toBe(false);
    await expect(press(extra("/collections/tasks"))).toBe(false);
    await expect(press(extra("/"))).toBe(false);
    const nested = document.createElement("dashboard-list-view");
    nested.slug = "notes";
    nested.access = fullAccess;
    view.append(nested);
    added.push(nested);
    await nested.updateComplete;
    const deep = document.createElement("a");
    deep.href = "/collections/tasks/t2";
    nested.append(deep);
    await expect(press(deep)).toBe(false);
    const prevented = extra("/collections/tasks/t2");
    prevented.addEventListener("click", (e) => e.preventDefault());
    press(prevented);
    await expect(peek(view).openId).toBe("");
    await expect(press(a)).toBe(true);
    await expect(press(a)).toBe(true);
    await expect(peek(view).openId).toBe("t1");
    for (const el of added) el.remove();
  },
});
