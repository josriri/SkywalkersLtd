import { Redis } from "@upstash/redis";
import { randomUUID } from "node:crypto";
import type { Consultation, ConsultationStatus, ConsultationStore } from "../types.js";

// Redis.fromEnv() reads UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, which Vercel
// injects automatically once an Upstash Redis integration is connected to the project.
const redis = Redis.fromEnv();

// Sorted set of consultation IDs, scored by creation time, so we can page/sort without
// scanning the whole keyspace. Each consultation itself is stored as a JSON string under
// its own key.
const INDEX_KEY = "skywalkers:consultations:index";
const recordKey = (id: string) => `skywalkers:consultation:${id}`;

async function readAll(): Promise<Consultation[]> {
  const ids = await redis.zrange<string[]>(INDEX_KEY, 0, -1, { rev: true });
  if (!ids.length) return [];
  const records = await redis.mget<(Consultation | null)[]>(...ids.map(recordKey));
  return records.filter((r): r is Consultation => r !== null);
}

export const kvStore: ConsultationStore = {
  async list(filter) {
    let items = await readAll();
    if (filter?.division) items = items.filter((c) => c.division === filter.division);
    if (filter?.status) items = items.filter((c) => c.status === filter.status);
    return items; // already newest-first via the sorted set's `rev: true` order
  },

  async create(input) {
    const now = new Date().toISOString();
    const record: Consultation = {
      id: randomUUID(),
      name: input.name,
      contact: input.contact,
      division: input.division,
      message: input.message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    await redis.set(recordKey(record.id), record);
    await redis.zadd(INDEX_KEY, { score: Date.now(), member: record.id });
    return record;
  },

  async updateStatus(id, status) {
    const existing = await redis.get<Consultation>(recordKey(id));
    if (!existing) return null;
    const updated: Consultation = { ...existing, status, updatedAt: new Date().toISOString() };
    await redis.set(recordKey(id), updated);
    return updated;
  },

  async remove(id) {
    const existing = await redis.get<Consultation>(recordKey(id));
    if (!existing) return false;
    await redis.del(recordKey(id));
    await redis.zrem(INDEX_KEY, id);
    return true;
  },

  async counts() {
    const items = await readAll();
    const base: Record<ConsultationStatus, number> = { new: 0, contacted: 0, in_progress: 0, closed: 0 };
    for (const c of items) base[c.status] += 1;
    return base;
  },
};
