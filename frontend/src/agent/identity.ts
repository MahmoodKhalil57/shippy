import config from "../cms/config.ts";

/**
 * Who the AI features work for, from the project's settings (`admin.custom` in src/cms/config.ts):
 * the business's name, what it does, and the in-app helper's name. Prompts say these instead of
 * naming a company.
 */
const custom = config.admin?.custom;
export const ORG = custom?.branding?.name ?? "the company";
export const BUSINESS = custom?.assistant?.business ?? "a business";
export const HELPER = custom?.assistant?.name ?? "Assistant";
