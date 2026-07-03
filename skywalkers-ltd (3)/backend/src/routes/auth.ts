import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const router = Router();

// Slow down brute-force attempts against the single admin account.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in a few minutes." },
});

const loginSchema = z.object({
  password: z.string().min(1),
});

router.post("/login", loginLimiter, (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.JWT_SECRET;
  if (!hash || !secret) {
    return res.status(500).json({ error: "Admin login is not configured on the server" });
  }

  const ok = bcrypt.compareSync(parsed.data.password, hash);
  if (!ok) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign({ sub: "admin" }, secret, { expiresIn: "12h" });
  return res.json({ token, expiresIn: "12h" });
});

export default router;
