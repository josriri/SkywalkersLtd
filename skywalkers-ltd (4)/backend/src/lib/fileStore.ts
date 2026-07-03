import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import type { Consultation, ConsultationStatus, ConsultationStore, Division } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");
const DATA_FILE = join(DATA_DIR, "consultations.json");

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, "[]\n", "utf-8");
}

function readAll(): Consultation[] {
  ensureStore();
  const raw = readFileSync(DATA_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt file — fail safe to an empty list rather than crashing the server.
    return [];
  }
}

function writeAll(items: Consultation[]): void {
  ensureStore();
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2) + "\n", "utf-8");
}

// NOTE: this backend requires a writable, persistent local filesystem — it works on
// Render (with the disk configured in render.yaml), a VPS, or local dev, but NOT on
// Vercel, where functions are stateless/serverless. The store selector in store.ts
// picks kvStore.ts instead whenever Upstash Redis env vars are present.
export const fileStore: ConsultationStore = {
  async list(filter) {
    let items = readAll();
    if (filter?.division) items = items.filter((c) => c.division === filter.division);
    if (filter?.status) items = items.filter((c) => c.status === filter.status);
    // Newest first.
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(input) {
    const items = readAll();
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
    items.push(record);
    writeAll(items);
    return record;
  },

  async updateStatus(id, status) {
    const items = readAll();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], status, updatedAt: new Date().toISOString() };
    writeAll(items);
    return items[idx];
  },

  async remove(id) {
    const items = readAll();
    const next = items.filter((c) => c.id !== id);
    if (next.length === items.length) return false;
    writeAll(next);
    return true;
  },

  async counts() {
    const items = readAll();
    const base: Record<ConsultationStatus, number> = { new: 0, contacted: 0, in_progress: 0, closed: 0 };
    for (const c of items) base[c.status] += 1;
    return base;
  },
};
