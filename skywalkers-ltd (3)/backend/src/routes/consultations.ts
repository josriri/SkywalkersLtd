import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { consultationStore } from "../lib/store.js";
import { requireAdmin } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";
import type { ConsultationStatus, Division } from "../types.js";

const router = Router();

const DIVISIONS: Division[] = ["digitizebiz", "citizenease"];
const STATUSES: ConsultationStatus[] = ["new", "contacted", "in_progress", "closed"];

// Public endpoint — one submission every 30s per IP is plenty for a real visitor,
// and blunts basic spam/scraping without needing a captcha.
const submitLimiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Please wait a moment before submitting again." },
});

const createSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  contact: z.string().trim().min(5, "Add a phone number or email").max(160),
  division: z.enum(["digitizebiz", "citizenease"]),
  message: z.string().trim().max(2000).optional().default(""),
  // Honeypot field — real users never fill this in; bots that fill every field will.
  website: z.string().max(0).optional().default(""),
});

// POST /api/consultations — used by the DigitizeBiz and CitizenEase contact forms.
router.post("/", submitLimiter, (req, res, next) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
  }
  if (parsed.data.website) {
    // Honeypot tripped — pretend success so the bot doesn't learn anything, but drop it.
    return res.status(201).json({ ok: true });
  }

  try {
    const record = consultationStore.create({
      name: parsed.data.name,
      contact: parsed.data.contact,
      division: parsed.data.division,
      message: parsed.data.message,
    });
    return res.status(201).json({ ok: true, id: record.id });
  } catch (err) {
    next(err instanceof Error ? err : new HttpError(500, "Could not save submission"));
  }
});

// GET /api/consultations — admin dashboard list, with optional filters.
router.get("/", requireAdmin, (req, res) => {
  const division = req.query.division;
  const status = req.query.status;

  const divisionFilter = typeof division === "string" && DIVISIONS.includes(division as Division)
    ? (division as Division)
    : undefined;
  const statusFilter = typeof status === "string" && STATUSES.includes(status as ConsultationStatus)
    ? (status as ConsultationStatus)
    : undefined;

  const items = consultationStore.list({ division: divisionFilter, status: statusFilter });
  return res.json({ items, counts: consultationStore.counts() });
});

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "in_progress", "closed"]),
});

// PATCH /api/consultations/:id — admin updates the status of a consultation.
router.patch("/:id", requireAdmin, (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "status must be one of: " + STATUSES.join(", ") });
  }
  const updated = consultationStore.updateStatus(req.params.id, parsed.data.status);
  if (!updated) return res.status(404).json({ error: "Consultation not found" });
  return res.json({ item: updated });
});

// DELETE /api/consultations/:id — admin removes a consultation.
router.delete("/:id", requireAdmin, (req, res) => {
  const removed = consultationStore.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "Consultation not found" });
  return res.status(204).send();
});

export default router;
