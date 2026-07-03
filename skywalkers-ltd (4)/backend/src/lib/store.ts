import type { ConsultationStore } from "../types.js";
import { fileStore } from "./fileStore.js";

const usingUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Lazily import kvStore only when actually needed, so `@upstash/redis` never has to be
// initialized (and its env vars never have to exist) on deployments that use the file store.
export const consultationStore: ConsultationStore = usingUpstash
  ? (await import("./kvStore.js")).kvStore
  : fileStore;
