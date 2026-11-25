import { env } from "./env.ts";

export const IS_TEMP_MOCK: boolean = env.PUBLIC_IS_TEMP_MOCK;

export const IS_MOCK: boolean = env.PUBLIC_IS_MOCK;

export class TempMockError extends Error {
  constructor(what: string) {
    super(`Not implemented without PUBLIC_IS_TEMP_MOCK: ${what}`);
    this.name = "TempMockError";
  }
}

export class NotConnectedError extends Error {
  constructor(what: string) {
    super(`No production connection yet (PUBLIC_IS_MOCK is off): ${what}`);
    this.name = "NotConnectedError";
  }
}
