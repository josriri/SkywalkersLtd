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

Consultations are stored in `backend/data/consultations.json`, created automatically on first
write. This is intentionally dependency-free (no native DB bindings) so it runs anywhere Node
runs, with no separate database to provision. It's appropriate for the expected volume of
consultation requests; if that volume grows significantly, swap `src/lib/store.ts` for a real
database (e.g. Postgres) without touching the routes — they only call the `consultationStore`
interface.

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

This is a plain Node process with no native dependencies, so it runs on Render, Railway, Fly.io,
a VPS, or a container. For a ready-made Render setup (recommended), see **"Deploying to Render"**
in the repo root README — there's a `render.yaml` Blueprint that provisions this service with a
persistent disk and wires it to the frontend automatically.

For any other host, the general steps are the same:

1. Set `FRONTEND_ORIGIN`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` as environment variables on the host
   (never commit `.env`). `PORT` is usually injected by the platform — the app already reads
   `process.env.PORT` with a local fallback of 4000.
2. `npm ci && npm run build && npm start`.
3. Point the frontend's `VITE_API_URL` at this service's public URL, and rebuild the frontend.
4. Give `backend/data` persistent storage (a mounted volume/disk) so
   `consultations.json` survives deploys and restarts — otherwise it resets every time the
   container is rebuilt.
