import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const token = header.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail closed: never allow admin access if the server is misconfigured.
    return res.status(500).json({ error: "Server auth is not configured" });
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    if (payload.sub !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.isAdmin = true;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
