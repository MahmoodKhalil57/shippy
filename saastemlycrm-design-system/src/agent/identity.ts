import { site } from "../app/site.ts";
import { locale } from "../i18n/index.ts";

/**
 * Who the AI features work for, from the project's data (the `branding` and `assistant` globals):
 * the business's name, what it does, and the in-app helper's name. Prompts say these instead of
 * naming a company; they're read when a prompt is built, so edits apply at once.
 */
export const org = () => site().branding.name;
export const business = () => site().assistant.business;
export const helper = () => site().assistant.name;

/**
 * The language a prompt tells the model to answer in: the person's interface language
 * (`locale()`), which their screen, the tools' labels and most records are in. Arabic is Modern
 * Standard Arabic, the register of business software in Egypt and the Gulf; codes, record
 * numbers, currency codes and names stay as written.
 */
export const answerIn = () =>
  locale() === "ar"
    ? "The person's interface is in Arabic: answer in Arabic (Modern Standard Arabic, short and plain, as business software in Egypt and the Gulf writes it), even when tool results are in English, unless they write to you in another language. Keep record numbers, codes, currency codes, emails and names exactly as written."
    : "The person's interface is in English: answer in English, unless they write to you in another language.";
