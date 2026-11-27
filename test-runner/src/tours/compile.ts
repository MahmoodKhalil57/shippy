import { AstBuilder, GherkinClassicTokenMatcher, Parser } from "@cucumber/gherkin";
import { IdGenerator } from "@cucumber/messages";

export type Words = { en: string; ar: string };

export interface TourStepDoc {
  as?: string;
  go?: string;
  open?: "aside" | "nav";
  click?: Words;
  wait?: number;
  target?: { text: Words; sel?: string };
  title: Words;
  body: Words;
}

export interface TourDoc {
  id: string;
  title: Words;
  summary: Words;
  steps: TourStepDoc[];
}

export interface Places {
  person(name: string): string;
  page(name: string): string;
  tab(tab: string, collection: string, title: string): string;
}

export const PANELS: Record<string, { open: "aside" | "nav"; sel: string }> = {
  "the side panel": { open: "aside", sel: "dashboard-aside li" },
  "the navigation": { open: "nav", sel: "nav li" },
};

const STEPS: { pattern: RegExp; apply: (m: RegExpExecArray, stop: Partial<Draft>, places: Places) => void }[] = [
  {
    pattern: /^I (?:am signed in|sign in) as "([^"]+)"$/,
    apply: (m, stop, places) => (stop.as = places.person(m[1]!)),
  },
  { pattern: /^I open my home page$/, apply: (_, stop) => (stop.go = "/") },
  {
    pattern: /^I open the "([^"]+)" tab of (.+) "([^"]+)"$/,
    apply: (m, stop, places) => (stop.go = places.tab(m[1]!, m[2]!, m[3]!)),
  },
  { pattern: /^I open the "([^"]+)" page$/, apply: (m, stop, places) => (stop.go = places.page(m[1]!)) },
  {
    pattern: /^I open (the side panel|the navigation)$/,
    apply: (m, stop) => (stop.open = PANELS[m[1]!]!.open),
  },
  { pattern: /^I click "(.+)"$/, apply: (m, stop) => (stop.click = m[1]!) },
  { pattern: /^I give it ([\d.]+) seconds?$/, apply: (m, stop) => (stop.wait = Math.round(Number(m[1]) * 1000)) },
];

const STOPS = [
  /^the tour says "(.+)"$/,
  /^the tour points at "(.+?)"(?: in (the side panel|the navigation))? and says "(.+)"$/,
];

interface Draft {
  as?: string;
  go?: string;
  open?: "aside" | "nav";
  click?: string;
  wait?: number;
  target?: { text: string; sel?: string };
  title: string;
  body: string;
}

export interface TourSource {
  id: string;
  title: string;
  summary: string;
  steps: Draft[];
}

const parser = new Parser(new AstBuilder(IdGenerator.incrementing()), new GherkinClassicTokenMatcher());

const text = (s: string) => s.replace(/\s+/g, " ").trim();

export function readTour(id: string, source: string, places: Places): TourSource {
  const feature = parser.parse(source).feature;
  if (!feature) throw new Error(`${id}: the file has no Feature.`);
  const scenarios = feature.children.flatMap((c) => (c.scenario ? [c.scenario] : []));
  if (scenarios.length !== 1) throw new Error(`${id}: a tour is one Scenario, found ${scenarios.length}.`);
  const steps: Draft[] = [];
  let pending: Partial<Draft> = {};
  for (const step of scenarios[0]!.steps) {
    const line = `${id}:${step.location.line}`;
    const said = STOPS.map((p) => p.exec(step.text)).find(Boolean);
    if (said) {
      const body = step.docString?.content;
      if (!body) throw new Error(`${line}: what the tour says goes in a """ block under the step.`);
      const pointsAt = said.length === 4;
      const panel = pointsAt && said[2] ? PANELS[said[2]]!.sel : undefined;
      steps.push({
        ...pending,
        ...(pointsAt ? { target: { text: said[1]!, ...(panel ? { sel: panel } : {}) } } : {}),
        title: pointsAt ? said[3]! : said[1]!,
        body: text(body),
      });
      pending = {};
      continue;
    }
    const known = STEPS.map((s) => ({ s, m: s.pattern.exec(step.text) })).find((x) => x.m);
    if (!known) throw new Error(`${line}: a tour can't say "${step.text}".`);
    known.s.apply(known.m!, pending, places);
  }
  if (Object.keys(pending).length) throw new Error(`${id}: the last actions lead to no stop.`);
  return { id, title: feature.name, summary: text(feature.description ?? ""), steps };
}

export const keyOf = (id: string, ...parts: (string | number)[]) =>
  ["tour", id.replace(/[^a-z0-9]+/gi, "_"), ...parts].join("_");

export function englishOf(tours: TourSource[]): Record<string, string> {
  const en: Record<string, string> = {};
  for (const t of tours) {
    en[keyOf(t.id, "title")] = t.title;
    en[keyOf(t.id, "summary")] = t.summary;
    t.steps.forEach((s, i) => {
      en[keyOf(t.id, i + 1, "title")] = s.title;
      en[keyOf(t.id, i + 1, "body")] = s.body;
      if (s.target) en[keyOf(t.id, i + 1, "target")] = s.target.text;
      if (s.click) en[keyOf(t.id, i + 1, "click")] = s.click;
    });
  }
  return en;
}

export function compileTours(tours: TourSource[], ar: Record<string, string>) {
  const en = englishOf(tours);
  const missing = Object.keys(en).filter((k) => !ar[k]);
  const words = (key: string): Words => ({ en: en[key]!, ar: ar[key] ?? "" });
  const docs: TourDoc[] = tours.map((t) => ({
    id: t.id,
    title: words(keyOf(t.id, "title")),
    summary: words(keyOf(t.id, "summary")),
    steps: t.steps.map((s, i) => ({
      ...(s.as ? { as: s.as } : {}),
      ...(s.go ? { go: s.go } : {}),
      ...(s.open ? { open: s.open } : {}),
      ...(s.click ? { click: words(keyOf(t.id, i + 1, "click")) } : {}),
      ...(s.wait ? { wait: s.wait } : {}),
      ...(s.target
        ? { target: { text: words(keyOf(t.id, i + 1, "target")), ...(s.target.sel ? { sel: s.target.sel } : {}) } }
        : {}),
      title: words(keyOf(t.id, i + 1, "title")),
      body: words(keyOf(t.id, i + 1, "body")),
    })),
  }));
  return { docs, en, missing };
}
