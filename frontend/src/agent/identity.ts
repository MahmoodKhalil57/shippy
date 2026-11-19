import { site } from "../app/site.ts";

/**
 * Who the AI features work for, from the project's data (the `branding` and `assistant` globals):
 * the business's name, what it does, and the in-app helper's name. Prompts say these instead of
 * naming a company; they're read when a prompt is built, so edits apply at once.
 */
export const org = () => site().branding.name;
export const business = () => site().assistant.business;
export const helper = () => site().assistant.name;
