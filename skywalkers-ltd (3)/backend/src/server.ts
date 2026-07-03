import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import consultationRoutes from "./routes/consultations.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "skywalkers-backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.use(errorHandler);

if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD_HASH) {
  console.warn(
    "\n⚠️  JWT_SECRET and/or ADMIN_PASSWORD_HASH are not set. Admin login will not work until backend/.env is configured — see backend/README.md.\n"
  );
}

app.listen(PORT, () => {
  console.log(`Skywalkers backend listening on http://localhost:${PORT}`);
  console.log(`Allowing requests from: ${FRONTEND_ORIGIN}`);
});
