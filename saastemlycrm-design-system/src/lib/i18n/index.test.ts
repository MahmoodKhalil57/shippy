import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { getLocale as runtimeLocale, overwriteGetLocale, overwriteSetLocale, setLocale } from "./paraglide/runtime.js";
import {
  BASE_LOCALE,
  dir,
  followLanguage,
  formatInt,
  getLocale,
  intl,
  intlTag,
  isLocalized,
  keepLanguage,
  LANGUAGES,
  locale,
  LOCALES,
  localize,
  localizeConfig,
  m,
  savedLanguage,
  setLanguage,
  type Locale,
} from "./index.ts";

class MemoryStorage {
  items = new Map<string, string>();
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
}

const refusing = {
  getItem: () => {
    throw new DOMException("Denied", "SecurityError");
  },
  setItem: () => {
    throw new DOMException("Denied", "SecurityError");
  },
};

const realGetLocale = runtimeLocale;
const realSetLocale = setLocale;
let current: Locale;
let switched: Locale[];
let local: MemoryStorage;
let session: MemoryStorage;

beforeEach(() => {
  current = "en";
  switched = [];
  local = new MemoryStorage();
  session = new MemoryStorage();
  vi.stubGlobal("localStorage", local);
  vi.stubGlobal("sessionStorage", session);
  overwriteGetLocale(() => current);
  overwriteSetLocale((l) => void switched.push(l));
});

afterEach(() => {
  overwriteGetLocale(realGetLocale);
  overwriteSetLocale(realSetLocale);
  vi.unstubAllGlobals();
});

describe("languages", () => {
  it("lists English and Arabic, with English as the base", () => {
    expect(LOCALES).toEqual(["en", "ar"]);
    expect(BASE_LOCALE).toBe("en");
    expect(LANGUAGES).toEqual({ en: { name: "English", dir: "ltr" }, ar: { name: "العربية", dir: "rtl" } });
  });

  it("reads the current language and its direction", () => {
    expect([locale(), getLocale(), dir()]).toEqual(["en", "en", "ltr"]);
    current = "ar";
    expect([locale(), getLocale(), dir()]).toEqual(["ar", "ar", "rtl"]);
    expect(dir("en")).toBe("ltr");
  });

  it("translates messages in the current language", () => {
    expect(m.field_error_required()).toBe("Fill this in to save.");
  });
});

describe("setLanguage", () => {
  it("does nothing for the language already in use", async () => {
    const keep = vi.fn(() => Promise.resolve());
    const stop = keepLanguage(keep);
    await setLanguage("en");
    stop();
    expect(keep).not.toHaveBeenCalled();
    expect(switched).toEqual([]);
  });

  it("lets every keeper save the new language, even when one fails, before it switches", async () => {
    const order: string[] = [];
    const saving = vi.fn((l: Locale) => Promise.resolve(void order.push(`saved ${l}`)));
    const failing = vi.fn(() => Promise.reject(new Error("offline")));
    const stopSaving = keepLanguage(saving);
    const stopFailing = keepLanguage(failing);
    overwriteSetLocale((l) => void order.push(`switched ${l}`));
    await setLanguage("ar");
    expect(order).toEqual(["saved ar", "switched ar"]);
    expect(failing).toHaveBeenCalledWith("ar");
    expect(stopSaving()).toBeUndefined();
    stopFailing();
    order.length = 0;
    await setLanguage("ar");
    expect(order).toEqual(["switched ar"]);
  });
});

describe("savedLanguage", () => {
  it("reads a language the person chose before", () => {
    local.setItem("ui-language", "ar");
    expect(savedLanguage()).toBe("ar");
    local.setItem("ui-language", "en");
    expect(savedLanguage()).toBe("en");
  });

  it("ignores a missing or unknown language and storage that refuses to be read", () => {
    expect(savedLanguage()).toBeUndefined();
    local.setItem("ui-language", "fr");
    expect(savedLanguage()).toBeUndefined();
    vi.stubGlobal("localStorage", refusing);
    expect(savedLanguage()).toBeUndefined();
  });
});

describe("followLanguage", () => {
  it("switches once per session to a person's saved language", () => {
    expect(followLanguage("ar")).toBe(true);
    expect(session.getItem("ui-language-followed")).toBe("ar");
    expect(switched).toEqual(["ar"]);
    expect(followLanguage("ar")).toBe(false);
    expect(switched).toEqual(["ar"]);
  });

  it("ignores values that are not a language, the language in use and a session it cannot write", () => {
    expect(followLanguage(undefined)).toBe(false);
    expect(followLanguage(1)).toBe(false);
    expect(followLanguage("fr")).toBe(false);
    expect(followLanguage("en")).toBe(false);
    vi.stubGlobal("sessionStorage", refusing);
    expect(followLanguage("ar")).toBe(false);
    expect(switched).toEqual([]);
  });
});

describe("localize", () => {
  it("passes text through", () => {
    expect(localize("Deals")).toBe("Deals");
  });

  it("picks the language asked for, then the current one, then English, then any text", () => {
    const deals = { en: "Deals", ar: "الصفقات" };
    expect(localize(deals, "ar")).toBe("الصفقات");
    expect(localize(deals)).toBe("Deals");
    current = "ar";
    expect(localize(deals)).toBe("الصفقات");
    expect(localize({ en: "Deals" })).toBe("Deals");
    expect(localize({ fr: "Affaires" })).toBe("Affaires");
    expect(localize({ ar: 5, fr: "Affaires" })).toBe("");
    expect(localize({ count: 3 })).toBe("");
    expect(localize({})).toBe("");
  });

  it("calls a label function with the language and localizes what it returns", () => {
    const label = ({ i18n }: { i18n: { language: Locale } }) =>
      i18n.language === "ar" ? { ar: "الفواتير" } : "Invoices";
    expect(localize(label, "ar")).toBe("الفواتير");
    expect(localize(label, "en")).toBe("Invoices");
  });

  it("turns anything else into empty text", () => {
    for (const v of [undefined, null, 0, 12, true, false]) expect(localize(v)).toBe("");
  });
});

describe("intlTag", () => {
  it("uses Latin digits in Arabic and British dates in English", () => {
    expect(intlTag("number", "ar")).toBe("ar-u-nu-latn");
    expect(intlTag("date", "ar")).toBe("ar-u-nu-latn");
    expect(intlTag("number", "en")).toBe("en-US");
    expect(intlTag("date", "en")).toBe("en-GB");
    expect(intlTag()).toBe("en-US");
    current = "ar";
    expect(intlTag("date")).toBe("ar-u-nu-latn");
  });
});

describe("intl", () => {
  it("reuses one formatter per kind, language and options", () => {
    expect(intl.number()).toBe(intl.number());
    expect(intl.number({ style: "percent" })).toBe(intl.number({ style: "percent" }));
    expect(intl.number({ style: "percent" })).not.toBe(intl.number());
    const english = intl.date({ month: "short" });
    current = "ar";
    expect(intl.date({ month: "short" })).not.toBe(english);
    expect(intl.date({ month: "short" })).toBe(intl.date({ month: "short" }));
  });

  it("formats in the current language", () => {
    expect(intl.number().format(1234.5)).toBe("1,234.5");
    expect(intl.date({ timeZone: "UTC" }).format(new Date(Date.UTC(2026, 2, 14)))).toBe("14/03/2026");
    expect(intl.relative().format(-1, "day")).toBe("1 day ago");
    expect(intl.list().format(["Ana", "Omar", "Bilal"])).toBe("Ana, Omar, and Bilal");
    expect(intl.plural().select(1)).toBe("one");
    expect(intl.collator().compare("item 2", "Item 10")).toBeLessThan(0);
    expect(intl.collator({ sensitivity: "variant" }).compare("a", "A")).not.toBe(0);
    expect(intl.date().format(new Date(Date.UTC(2026, 2, 14)))).toBe("14/03/2026");
    current = "ar";
    expect(intl.number().format(1234.5)).toBe("1,234.5");
    expect(intl.date({ timeZone: "UTC" }).format(new Date(Date.UTC(2026, 2, 14)))).toMatch(/2026/);
  });

  it("formats whole numbers", () => {
    expect(formatInt(1234567)).toBe("1,234,567");
    expect(formatInt(0.5, { style: "percent" })).toBe("50%");
  });
});

describe("isLocalized", () => {
  it("accepts a plain object of text for known languages", () => {
    expect(isLocalized({ en: "Deals" })).toBe(true);
    expect(isLocalized({ en: "Deals", ar: "الصفقات" })).toBe(true);
  });

  it("rejects everything else", () => {
    const bare = Object.assign(Object.create(null) as object, { en: "Deals" });
    class Label {
      en = "Deals";
    }
    for (const v of [
      undefined,
      null,
      "Deals",
      ["Deals"],
      {},
      { fr: "Affaires" },
      { en: "Deals", fr: "Affaires" },
      { en: 1 },
      bare,
      new Label(),
    ])
      expect(isLocalized(v)).toBe(false);
  });
});

describe("localizeConfig", () => {
  it("replaces every localized text in place, deeply and in arrays", () => {
    const both = (en: string, ar: string) => ({ en, ar });
    const when = new Date(0);
    const bare = Object.assign(Object.create(null) as object, { label: both("Bare", "مجرد") });
    const config = {
      labels: { singular: both("Deal", "صفقة"), plural: both("Deals", "صفقات") },
      fields: [
        { name: "stage", label: both("Stage", "المرحلة"), options: [both("Open", "مفتوحة"), "won", 3, null] },
        { name: "when", defaultValue: when, label: "When" },
      ],
      when,
      bare,
      count: 2,
      empty: null,
      hook: () => both("Hook", "خطاف"),
    };
    const out = localizeConfig(config, "ar");
    expect(out).toBe(config);
    expect(config.labels).toEqual({ singular: "صفقة", plural: "صفقات" });
    expect(config.fields[0]).toEqual({ name: "stage", label: "المرحلة", options: ["مفتوحة", "won", 3, null] });
    expect(config.fields[1]).toEqual({ name: "when", defaultValue: when, label: "When" });
    expect((bare as { label: unknown }).label).toBe("مجرد");
    expect(config.count).toBe(2);
    expect(typeof config.hook).toBe("function");
  });

  it("uses the current language and leaves objects that are not plain alone", () => {
    class Settings {
      label = { en: "Settings", ar: "الإعدادات" };
    }
    const settings = new Settings();
    const config = { title: { en: "Deals", ar: "الصفقات" }, settings };
    localizeConfig(config);
    expect(config.title).toBe("Deals");
    expect(settings.label).toEqual({ en: "Settings", ar: "الإعدادات" });
  });

  it("visits shared and circular parts once", () => {
    const shared = { label: { en: "Shared", ar: "مشترك" } };
    const config: Record<string, unknown> = { a: shared, b: [shared, shared] };
    config.self = config;
    localizeConfig(config, "en");
    expect(shared.label).toBe("Shared");
    expect(config.self).toBe(config);
  });

  it("leaves values that are not objects alone", () => {
    expect(localizeConfig("Deals")).toBe("Deals");
    expect(localizeConfig(null)).toBeNull();
    expect(localizeConfig(5)).toBe(5);
  });
});
