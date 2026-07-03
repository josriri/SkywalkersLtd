import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../backend/src/app.js";

// Built once per cold start and reused across warm invocations of this function.
const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express request handlers are plain (req, res) functions, so the app instance
  // itself can be used directly as the Vercel function handler.
  return app(req, res);
}
