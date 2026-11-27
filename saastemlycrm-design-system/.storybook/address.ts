import { memoryPlace } from "../src/lib/dashboard/address.ts";

export const place = memoryPlace();

export const here = () => place.address();
export const visit = (path: string) => place.go(path, true);
