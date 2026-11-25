const CDN = "https://cdn.jsdelivr.net/npm";
const PROMPT_POLYFILL = `${CDN}/prompt-api-polyfill@1.25.1/+esm`;
const TASK_POLYFILL = (file: string) => `${CDN}/built-in-ai-task-apis-polyfills@2.1.2/dist/${file}.js/+esm`;
const TASKS: [api: string, file: string, force: string][] = [
  ["Summarizer", "summarizer", "__FORCE_SUMMARIZER_POLYFILL__"],
  ["Writer", "writer", "__FORCE_WRITER_POLYFILL__"],
  ["Rewriter", "rewriter", "__FORCE_REWRITER_POLYFILL__"],
  ["Translator", "translator", "__FORCE_TRANSLATOR_POLYFILL__"],
  ["LanguageDetector", "language-detector", "__FORCE_LANGUAGE_DETECTOR_POLYFILL__"],
];
const STORAGE = "saastemly:local-ai";
export const AI_CHANGE = "built-in-ai-change";

type AiFactory = { availability?(o?: object): Promise<string>; __isPolyfill?: boolean };
const g = globalThis as unknown as Record<string, unknown>;
const api = (name: string) => g[name] as AiFactory | undefined;

export const usingLocalModel = () => api("LanguageModel")?.__isPolyfill === true;

export const localModelChosen = () => {
  try {
    return localStorage.getItem(STORAGE) === "on";
  } catch {
    return false;
  }
};

export async function nativeAiUsable(): Promise<boolean> {
  const lm = api("LanguageModel");
  if (!lm || lm.__isPolyfill || typeof lm.availability !== "function") return false;
  try {
    return (await lm.availability({ expectedOutputs: [{ type: "text", languages: ["en"] }] })) !== "unavailable";
  } catch {
    return false;
  }
}

export type LocalAiState = "native" | "local" | "loading" | "off";
let loading: Promise<void> | null = null;
export async function localAiState(): Promise<LocalAiState> {
  if (loading) return "loading";
  if (usingLocalModel()) return "local";
  return (await nativeAiUsable()) ? "native" : "off";
}

const openAiKey = () => document.querySelector<HTMLMetaElement>('meta[name="openai-api-key"]')?.content.trim() ?? "";

export function useLocalModel(remember = true): Promise<void> {
  if (remember)
    try {
      localStorage.setItem(STORAGE, "on");
    } catch {}
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

export function stopUsingLocalModel() {
  try {
    localStorage.removeItem(STORAGE);
  } catch {}
}

export async function restoreLocalModel() {
  if (localModelChosen() && !(await nativeAiUsable())) await useLocalModel(false).catch(() => undefined);
}
