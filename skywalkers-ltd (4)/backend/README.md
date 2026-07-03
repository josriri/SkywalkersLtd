# Skywalkers Backend

Express + TypeScript API that powers the consultation forms on the DigitizeBiz and CitizenEase
pages, plus the `/admin` dashboard in the frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run hash-password -- "choose-a-strong-password"   # paste the printed hash into .env
# also set JWT_SECRET in .env to any long random string, e.g.:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev
```

The API starts on `http://localhost:4000` by default. The frontend's `VITE_API_URL` should point
here in development (see the frontend `.env.example`).

## Storage

Consultations are stored via `src/lib/store.ts`, which picks one of two backends automatically —
nothing to configure by hand:

- **File store** (`src/lib/fileStore.ts`) — a dependency-free JSON file at
  `backend/data/consultations.json`. Used whenever `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN` aren't set. This is the path for Render, local dev, a VPS, or any
  host with a writable persistent filesystem.
- **Upstash Redis store** (`src/lib/kvStore.ts`) — used automatically when those env vars *are*
  set, which Vercel does for you once you connect an Upstash Redis integration (see "Deploying to
  Vercel" in the root README). This path exists because Vercel functions are stateless — there's
  no local disk to persist a JSON file to.

Both implement the same `ConsultationStore` interface (see `src/types.ts`), so the routes never
know or care which one is active.

## App structure

- `src/app.ts` — builds and returns the configured Express app (middleware + routes), but never
  calls `.listen()`.
- `src/server.ts` — the standalone entry point: imports `createApp()` and calls `.listen()`. Used
  by `npm run dev` / `npm start`, i.e. Render, local dev, or any plain Node host.
- The repo root's `api/[...path].ts` is the *other* entry point — it imports the same
  `createApp()` and hands it directly to Vercel as a serverless function, instead of calling
  `.listen()`. This is what lets the exact same routes/middleware run on either a long-lived Node
  process or a stateless serverless function.

## API

| Method | Path                        | Auth  | Purpose                                  |
|--------|-----------------------------|-------|-------------------------------------------|
| GET    | `/api/health`               | —     | Liveness check                            |
| POST   | `/api/auth/login`           | —     | `{ password }` → `{ token }`              |
| POST   | `/api/consultations`        | —     | Create a consultation (used by contact forms) |
| GET    | `/api/consultations`        | Admin | List, optional `?division=` `&status=`   |
| PATCH  | `/api/consultations/:id`    | Admin | `{ status }` — update status              |
| DELETE | `/api/consultations/:id`    | Admin | Remove a consultation                     |

Admin routes require `Authorization: Bearer <token>` from `/api/auth/login`.

### Consultation shape

```json
{
  "id": "uuid",
  "name": "string",
  "contact": "phone or email",
  "division": "digitizebiz | citizenease",
  "message": "string",
  "status": "new | contacted | in_progress | closed",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

## Security notes

- **Single admin account.** Password is never stored in plaintext — only a bcrypt hash in
  `ADMIN_PASSWORD_HASH`. There's no user database or self-registration by design (this is a
  one-person or small-team admin panel).
- **JWT** issued on login, 12h expiry, verified on every admin request. If `JWT_SECRET` or
  `ADMIN_PASSWORD_HASH` are unset, admin routes fail closed (500), not open.
- **Rate limiting**: the public submission endpoint allows 1 request per 30s per IP; login allows
  10 attempts per 15 minutes per IP.
- **Honeypot field** (`website`) on the public submission endpoint silently drops obvious bot
  submissions.
- **CORS** is locked to `FRONTEND_ORIGIN` — update it per environment (see deployment below).
- **Helmet** sets standard security headers.
- Input is validated with `zod` on every write endpoint; nothing from the request body reaches the
  store unvalidated.

## Build & run in production

```bash
npm run build
npm start
```

## Deployment

This runs two ways, and the code is identical either way:

- **As a standalone Node process** (Render, Railway, Fly.io, a VPS) via `src/server.ts`. For a
  ready-made setup, see **"Deploying to Render"** in the repo root README — `render.yaml`
  provisions this service with a persistent disk and wires it to the frontend automatically.
- **As a Vercel serverless function** via the repo root's `api/[...path].ts`, in the same Vercel
  project as the frontend. See **"Deploying to Vercel"** in the repo root README — this path uses
  the Upstash-backed store instead of the file store, since Vercel functions can't write to a
  persistent local disk.

For any other plain-Node host, the general steps are the same:

1. Set `FRONTEND_ORIGIN`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` as environment variables on the host
   (never commit `.env`). `PORT` is usually injected by the platform — the app already reads
   `process.env.PORT` with a local fallback of 4000.
2. `npm install && npm run build && npm start`.
3. Point the frontend's `VITE_API_URL` at this service's public URL, and rebuild the frontend.
4. Give `backend/data` persistent storage (a mounted volume/disk) so
   `consultations.json` survives deploys and restarts — otherwise it resets every time the
   container is rebuilt. (Not applicable if you're on the Upstash-backed path instead.)
