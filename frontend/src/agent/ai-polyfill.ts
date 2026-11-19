/**
 * On-device AI without Chrome's experimental flags: Google's official polyfills
 * (https://developer.chrome.com/docs/ai/prompt-api-polyfill, …/task-api-polyfill) provide
 * `LanguageModel` (the Prompt API) and Summarizer, Writer, Rewriter, Translator and Language
 * Detector on top of it, backed by an open model that runs in the page (Transformers.js, on
 * WebGPU when the device has it) — no key, nothing leaves the machine.
 *
 * Opt-in, because the model is a large one-time download (about 800 MB, kept by the browser): the
 * person chooses it (the helper or the login page), and it's remembered on this browser. Browsers
 * where the real APIs work never load any of this. With an OpenAI key in index.html, the polyfill
 * uses OpenAI instead (no download).
 *
 * Loaded from jsDelivr at run time — not bundled — so the app's build and offline cache stay small.
 * Not polyfilled: the Decisions API (its polyfill needs a second model; our checks fall back to
 * the Prompt API), the Proofreader, native tool calling (the helper uses JSON steps), and photos /
 * voice notes (the default model reads text only).
 */

const CDN = "https://cdn.jsdelivr.net/npm";
const PROMPT_POLYFILL = `${CDN}/prompt-api-polyfill@1.25.1/+esm`;
const TASK_POLYFILL = (file: string) => `${CDN}/built-in-ai-task-apis-polyfills@2.1.2/dist/${file}.js/+esm`;
/** The task APIs we use, and the polyfill file for each. */
const TASKS: [api: string, file: string, force: string][] = [
  ["Summarizer", "summarizer", "__FORCE_SUMMARIZER_POLYFILL__"],
  ["Writer", "writer", "__FORCE_WRITER_POLYFILL__"],
  ["Rewriter", "rewriter", "__FORCE_REWRITER_POLYFILL__"],
  ["Translator", "translator", "__FORCE_TRANSLATOR_POLYFILL__"],
  ["LanguageDetector", "language-detector", "__FORCE_LANGUAGE_DETECTOR_POLYFILL__"],
];
const STORAGE = "gs:local-ai";
/** Announced (on window) when AI APIs appear, so features that were hidden show themselves. */
export const AI_CHANGE = "built-in-ai-change";

type AiFactory = { availability?(o?: object): Promise<string>; __isPolyfill?: boolean };
const g = globalThis as unknown as Record<string, unknown>;
const api = (name: string) => g[name] as AiFactory | undefined;

/** The local model is in use (polyfilled `LanguageModel`), so photos / voice notes aren't available. */
export const usingLocalModel = () => api("LanguageModel")?.__isPolyfill === true;

/** The person chose the downloadable model on this browser. */
export const localModelChosen = () => {
  try {
    return localStorage.getItem(STORAGE) === "on";
  } catch {
    return false;
  }
};

/** Chrome's real on-device AI is there and usable (the flags are on and the device can run it). */
export async function nativeAiUsable(): Promise<boolean> {
  const lm = api("LanguageModel");
  if (!lm || lm.__isPolyfill || typeof lm.availability !== "function") return false;
  try {
    return (await lm.availability()) !== "unavailable";
  } catch {
    return false;
  }
}

/** What the helper and the login page say about on-device AI here. */
export type LocalAiState = "native" | "local" | "loading" | "off";
let loading: Promise<void> | null = null;
export async function localAiState(): Promise<LocalAiState> {
  if (loading) return "loading";
  if (usingLocalModel()) return "local";
  return (await nativeAiUsable()) ? "native" : "off";
}

const openAiKey = () => document.querySelector<HTMLMetaElement>('meta[name="openai-api-key"]')?.content.trim() ?? "";

/**
 * Load the polyfills (once). Where Chrome's own API exists but can't run here, the polyfill
 * replaces it. Remembers the choice unless `remember` is false.
 */
export function useLocalModel(remember = true): Promise<void> {
  if (remember)
    try {
      localStorage.setItem(STORAGE, "on");
    } catch {
      /* storage unavailable: this visit only */
    }
  loading ??= (async () => {
    const key = openAiKey();
    if (key) g.OPENAI_CONFIG = { apiKey: key, modelName: "gpt-4o-mini" };
    else
      g.TRANSFORMERS_CONFIG = {
        apiKey: "dummy",
        device: "gpu" in navigator ? "webgpu" : "wasm",
        dtype: "gpu" in navigator ? "q4f16" : "q4",
      };
    if (!(await nativeAiUsable())) {
      g.__FORCE_PROMPT_API_POLYFILL__ = true;
      await import(/* @vite-ignore */ PROMPT_POLYFILL);
    }
    await Promise.all(
      TASKS.map(async ([name, file, force]) => {
        const native = api(name);
        if (
          native &&
          !native.__isPolyfill &&
          (await native.availability?.().catch(() => "unavailable")) !== "unavailable"
        )
          return;
        g[force] = true;
        await import(/* @vite-ignore */ TASK_POLYFILL(file));
      }),
    );
    window.dispatchEvent(new Event(AI_CHANGE));
  })().finally(() => {
    loading = null;
  });
  return loading;
}

/** Forget the choice (the browser keeps the downloaded model until its storage is cleared). */
export function stopUsingLocalModel() {
  try {
    localStorage.removeItem(STORAGE);
  } catch {
    /* storage unavailable */
  }
}

/** On page load: if the person chose the local model here before (and Chrome's isn't usable), load it. */
export async function restoreLocalModel() {
  if (localModelChosen() && !(await nativeAiUsable())) await useLocalModel(false).catch(() => undefined);
}
