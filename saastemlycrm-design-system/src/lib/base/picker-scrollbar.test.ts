import { describe, it, expect } from "vite-plus/test";
import { installPickerScrollbar } from "./picker-scrollbar";

const pickerSheets = (doc: Document) =>
  doc.adoptedStyleSheets.filter((s) => [...s.cssRules].some((r) => r.cssText.includes("::picker(select)")));

describe("installPickerScrollbar", () => {
  it("adopts the picker scrollbar rules into the document on import", () => {
    expect(pickerSheets(document)).toHaveLength(1);
  });

  it("does not adopt the rules twice", () => {
    installPickerScrollbar(document);
    installPickerScrollbar();
    expect(pickerSheets(document)).toHaveLength(1);
  });

  it("adopts the same sheet again after it was dropped, keeping the document's own sheets", () => {
    const before = document.adoptedStyleSheets;
    const [installed] = pickerSheets(document);
    const own = new CSSStyleSheet();
    document.adoptedStyleSheets = [own];
    try {
      installPickerScrollbar(document);
      expect(document.adoptedStyleSheets).toEqual([own, installed]);
    } finally {
      document.adoptedStyleSheets = before;
    }
  });

  it("does nothing without a document", () => {
    expect(() => installPickerScrollbar(undefined as unknown as Document)).not.toThrow();
  });

  it("does nothing where constructable sheets are missing", () => {
    const fake = {} as Document;
    expect(() => installPickerScrollbar(fake)).not.toThrow();
    expect("adoptedStyleSheets" in fake).toBe(false);
  });

  it("does nothing where CSSStyleSheet is not a constructor", () => {
    const real = globalThis.CSSStyleSheet;
    const other = document.implementation.createHTMLDocument("other");
    Object.defineProperty(globalThis, "CSSStyleSheet", { value: undefined, configurable: true, writable: true });
    try {
      installPickerScrollbar(other);
    } finally {
      Object.defineProperty(globalThis, "CSSStyleSheet", { value: real, configurable: true, writable: true });
    }
    expect(other.adoptedStyleSheets).toHaveLength(0);
  });
});
