import { site } from "../../app/site.ts";
import { locale } from "../i18n/index.ts";

export const org = () => site().branding.name;
export const business = () => site().assistant.business;
export const helper = () => site().assistant.name;

export const answerIn = () =>
  locale() === "ar"
    ? "The person's interface is in Arabic: answer in Arabic (Modern Standard Arabic, short and plain, as business software in Egypt and the Gulf writes it), even when tool results are in English, unless they write to you in another language. Keep record numbers, codes, currency codes, emails and names exactly as written."
    : "The person's interface is in English: answer in English, unless they write to you in another language.";
