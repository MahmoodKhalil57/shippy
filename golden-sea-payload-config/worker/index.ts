import { createWorker } from "cf-runner/worker";
import config from "../src/config.ts";

export default createWorker({ config });
