import { afterEach, beforeEach, describe, it, expect } from "vite-plus/test";
import {
  applyBackground,
  applyScheme,
  applyTheme,
  isDark,
  isLiveBackground,
  LIVE_BACKGROUNDS,
  liveBackgroundNow,
  remember,
  remembered,
  reveal,
  shrinkImage,
  STORAGE,
  THEMES,
} from "./appearance";
import { m } from "../i18n/index.ts";

const root = document.documentElement;

let saved: { attrs: Record<string, string | undefined>; style: string; storage: [string, string | null][] };

beforeEach(() => {
  saved = {
    attrs: Object.fromEntries(Object.entries(root.dataset)),
    style: root.getAttribute("style") ?? "",
    storage: Object.values(STORAGE).map((k) => [k, localStorage.getItem(k)]),
  };
});

afterEach(() => {
  for (const k of Object.keys(root.dataset)) delete root.dataset[k];
  Object.assign(root.dataset, saved.attrs);
  root.setAttribute("style", saved.style);
  for (const [k, v] of saved.storage) {
    if (v == null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  }
});

const failingStorage = (run: () => void) => {
  const { getItem, setItem, removeItem } = Storage.prototype;
  const fail = () => {
    throw new DOMException("denied", "SecurityError");
  };
  Storage.prototype.getItem = fail;
  Storage.prototype.setItem = fail;
  Storage.prototype.removeItem = fail;
  try {
    run();
  } finally {
    Object.assign(Storage.prototype, { getItem, setItem, removeItem });
  }
};

describe("constants", () => {
  it("offers the system, dark and light themes", () => {
    expect(THEMES).toEqual(["system", "dark", "light"]);
  });

  it("labels the live backgrounds in the current language", () => {
    expect(LIVE_BACKGROUNDS.map((b) => b.label())).toEqual([
      m.appearance_background_live_waves(),
      m.appearance_background_live_magnet_lines(),
    ]);
  });
});

describe("remember and remembered", () => {
  it("stores, reads and clears a value", () => {
    remember(STORAGE.theme, "dark");
    expect(remembered(STORAGE.theme)).toBe("dark");
    expect(localStorage.getItem("ui-theme")).toBe("dark");
    remember(STORAGE.theme, null);
    expect(remembered(STORAGE.theme)).toBeNull();
  });

  it("reads null and writes nothing when storage is denied", () => {
    localStorage.setItem(STORAGE.scheme, "ocean");
    failingStorage(() => {
      expect(remembered(STORAGE.scheme)).toBeNull();
      expect(() => remember(STORAGE.scheme, "forest")).not.toThrow();
      expect(() => remember(STORAGE.scheme, null)).not.toThrow();
    });
    expect(localStorage.getItem(STORAGE.scheme)).toBe("ocean");
  });
});

describe("applyTheme", () => {
  it("sets an explicit theme", () => {
    applyTheme("dark");
    expect(root.dataset.theme).toBe("dark");
    applyTheme("light");
    expect(root.dataset.theme).toBe("light");
  });

  it("clears the theme for system or anything unknown", () => {
    applyTheme("dark");
    applyTheme("system");
    expect(root.dataset.theme).toBeUndefined();
    applyTheme("dark");
    applyTheme("sepia");
    expect(root.dataset.theme).toBeUndefined();
  });
});

describe("applyScheme", () => {
  it("sets a named scheme and clears the default or an empty one", () => {
    applyScheme("ocean");
    expect(root.dataset.scheme).toBe("ocean");
    applyScheme("default");
    expect(root.dataset.scheme).toBeUndefined();
    applyScheme("ocean");
    applyScheme("");
    expect(root.dataset.scheme).toBeUndefined();
  });
});

describe("live backgrounds", () => {
  it("recognises only the live background ids", () => {
    expect(isLiveBackground("live-waves")).toBe(true);
    expect(isLiveBackground("live-magnet-lines")).toBe(true);
    expect(isLiveBackground("custom")).toBe(false);
    expect(isLiveBackground(null)).toBe(false);
    expect(isLiveBackground(undefined)).toBe(false);
  });

  it("reads the live background from the document", () => {
    delete root.dataset.background;
    expect(liveBackgroundNow()).toBeUndefined();
    root.dataset.background = "custom";
    expect(liveBackgroundNow()).toBeUndefined();
    root.dataset.background = "live-waves";
    expect(liveBackgroundNow()).toBe("live-waves");
  });
});

describe("applyBackground", () => {
  it("sets an image and a live background and announces the change", () => {
    let heard = 0;
    const listen = () => heard++;
    window.addEventListener("ui-background", listen);
    try {
      applyBackground("data:image/png;base64,AAAA", "live-magnet-lines");
      expect(root.style.getPropertyValue("--app-background")).toBe('url("data:image/png;base64,AAAA")');
      expect(root.dataset.background).toBe("live-magnet-lines");
      applyBackground(null);
      expect(root.style.getPropertyValue("--app-background")).toBe("");
      expect(root.dataset.background).toBeUndefined();
      applyBackground(null, null);
      expect(heard).toBe(3);
    } finally {
      window.removeEventListener("ui-background", listen);
    }
  });
});

describe("isDark", () => {
  it("follows the document's colour scheme", () => {
    root.style.colorScheme = "dark";
    expect(isDark()).toBe(true);
    root.style.colorScheme = "light";
    expect(isDark()).toBe(false);
  });
});

const imageFile = async (width: number, height: number) => {
  const canvas = new OffscreenCanvas(width, height);
  canvas.getContext("2d")!.fillRect(0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  return new File([blob], "picture.png", { type: "image/png" });
};

const sizeOf = async (src: string) => {
  const image = new Image();
  image.src = src;
  await image.decode();
  return [image.naturalWidth, image.naturalHeight];
};

describe("shrinkImage", () => {
  it("scales a large image down to the longest side as a jpeg", async () => {
    const url = await shrinkImage(await imageFile(400, 100), 200);
    expect(url.startsWith("data:image/jpeg")).toBe(true);
    expect(await sizeOf(url)).toEqual([200, 50]);
  });

  it("keeps a small image at its size", async () => {
    expect(await sizeOf(await shrinkImage(await imageFile(30, 60)))).toEqual([30, 60]);
  });
});

const withTransition = async (start: unknown, run: () => Promise<void>, reduced = false) => {
  const doc = document;
  const own = Object.getOwnPropertyDescriptor(doc, "startViewTransition");
  const media = window.matchMedia;
  Object.defineProperty(doc, "startViewTransition", { value: start, configurable: true, writable: true });
  window.matchMedia = ((q: string) =>
    Object.assign(new EventTarget(), { media: q, matches: reduced })) as unknown as typeof matchMedia;
  try {
    await run();
  } finally {
    if (own) Object.defineProperty(doc, "startViewTransition", own);
    else delete (doc as { startViewTransition?: unknown }).startViewTransition;
    window.matchMedia = media;
  }
};

const fakeTransition = (finished: () => Promise<void> = () => Promise.resolve()) => {
  const calls: number[] = [];
  const start = (update: () => Promise<void>) => {
    calls.push(1);
    const done = update().then(finished);
    return { finished: done };
  };
  return { start, calls };
};

describe("reveal", () => {
  it("applies directly without view transitions", async () => {
    await withTransition(undefined, async () => {
      let applied = 0;
      await reveal({ x: 0, y: 0 }, () => void applied++);
      expect(applied).toBe(1);
      expect(root.style.getPropertyValue("--theme-reveal-x")).toBe("");
    });
  });

  it("applies directly when the user prefers reduced motion", async () => {
    const fake = fakeTransition();
    await withTransition(
      fake.start,
      async () => {
        let applied = 0;
        await reveal({ x: 0, y: 0 }, () => void applied++);
        expect(applied).toBe(1);
        expect(fake.calls).toHaveLength(0);
      },
      true,
    );
  });

  it("reveals from the given point with a radius reaching the farthest corner", async () => {
    const fake = fakeTransition();
    await withTransition(fake.start, async () => {
      let applied = 0;
      await reveal({ x: 10, y: 20 }, async () => void applied++);
      expect(applied).toBe(1);
      expect(fake.calls).toHaveLength(1);
      expect(root.style.getPropertyValue("--theme-reveal-x")).toBe("10px");
      expect(root.style.getPropertyValue("--theme-reveal-y")).toBe("20px");
      expect(root.style.getPropertyValue("--theme-reveal-r")).toBe(
        `${Math.hypot(Math.max(10, innerWidth - 10), Math.max(20, innerHeight - 20))}px`,
      );
    });
  });

  it("ignores a reveal while another is running, then accepts the next", async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const fake = fakeTransition(() => gate);
    await withTransition(fake.start, async () => {
      const applied: string[] = [];
      const first = reveal({ x: 0, y: 0 }, () => void applied.push("first"));
      await reveal({ x: 0, y: 0 }, () => void applied.push("second"));
      expect(applied).toEqual(["first"]);
      release();
      await first;
      await reveal({ x: 0, y: 0 }, () => void applied.push("third"));
      expect(applied).toEqual(["first", "third"]);
    });
  });

  it("swallows a failed transition and stays usable", async () => {
    const fake = fakeTransition(() => Promise.reject(new DOMException("skipped", "AbortError")));
    await withTransition(fake.start, async () => {
      await expect(reveal({ x: 0, y: 0 }, () => {})).resolves.toBeUndefined();
      await expect(reveal({ x: 0, y: 0 }, () => {})).resolves.toBeUndefined();
      expect(fake.calls).toHaveLength(2);
    });
  });
});
