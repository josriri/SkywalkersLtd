# Skywalkers Ltd

A Vite + React + TypeScript + Tailwind site for Skywalkers Ltd, the parent corporation of two
divisions, backed by an Express API and an admin dashboard for handling consultation requests.

- **DigitizeBiz** — digitizes and manages **business** assets (web/app design, social media,
  database management, company/business/sacco registration, payroll).
- **CitizenEase** — digitizes and manages **individual** assets: a consultancy that handles every
  eCitizen and county-government service a person needs (identity & civil registration, travel &
  mobility, property & housing, compliance & clearance, education & family, county-level permits,
  plus a diaspora concierge tier).
- **Admin dashboard** (`/admin`) — password-protected page where consultation requests submitted
  from either division's contact form can be reviewed, filtered, have their status updated, or be
  deleted. See `backend/README.md` for the full API and security notes.

## Project layout

This is two apps in one repo:

```
/                 the frontend (this README)
/backend          the Express API — see backend/README.md
```

They run as two separate processes, talking over HTTP.

## Getting started (both apps)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
npm run hash-password -- "choose-a-strong-password"   # paste result into .env as ADMIN_PASSWORD_HASH
# also set JWT_SECRET in .env — see backend/README.md
npm run dev            # starts on http://localhost:4000

# 2. Frontend (separate terminal, from the repo root)
npm install
cp .env.example .env    # VITE_API_URL defaults to http://localhost:4000, adjust if needed
npm run dev             # starts on http://localhost:5173
```

Visit `http://localhost:5173` for the site, and `http://localhost:5173/admin` to sign in with the
password you hashed above.

Build for production:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  App.tsx                   Router setup: public layout (Home/DigitizeBiz/CitizenEase) + /admin
  components/
    Nav.tsx                  Top nav + division links + theme toggle
    Footer.tsx                Shared footer (includes a discreet Admin link)
    PublicLayout.tsx          Wraps the three public pages with Nav + Footer
    ui.tsx                    Shared primitives: Btn, Card, Pill, Eyebrow, cn
    ContactBlock.tsx          Consultation form — POSTs to the backend, shows loading/success/error
    DigitizationPreview.tsx   DigitizeBiz signature tool — draggable ledger → dashboard slider
    ROICalculator.tsx         DigitizeBiz signature tool — monthly value-recovered calculator
    DocumentChecklist.tsx     CitizenEase signature tool — required-documents checklist per service
    theme-provider.tsx        next-themes wrapper (light/dark)
  pages/
    Home.tsx                  Skywalkers Ltd homepage — links into the two divisions
    DigitizeBiz.tsx            Division A page
    CitizenEase.tsx            Division B page
    AdminPage.tsx               /admin — renders AdminLogin or AdminDashboard based on auth state
    AdminLogin.tsx               Password sign-in form
    AdminDashboard.tsx           Consultations table: filter, update status, delete
  lib/
    api.ts                     Typed fetch client for the backend
    auth.tsx                   Admin auth context (JWT kept in localStorage)
  data/
    services.ts                 DigitizeBiz service list + CitizenEase categories/documents

backend/
  src/app.ts                    Express app factory (routes/middleware — no .listen())
  src/server.ts                 Standalone entry: createApp() + .listen() — for Render/local/any plain Node host
  src/routes/                   auth.ts (login), consultations.ts (public create + admin CRUD)
  src/middleware/                auth.ts (JWT guard), errorHandler.ts
  src/lib/store.ts               Picks fileStore or kvStore automatically based on env vars present
  src/lib/fileStore.ts           JSON-file backed store — Render/local/any host with persistent disk
  src/lib/kvStore.ts             Upstash Redis backed store — used automatically on Vercel
  src/lib/hashPassword.ts        CLI helper to generate ADMIN_PASSWORD_HASH

api/
  [...path].ts                  Vercel serverless entry point — reuses createApp() from backend/src/app.ts
```

## Design system

- **Palette**: ink navy (`#16233A`), warm paper (`#F4F1EA`), signal teal (`#1F7A6C`), terracotta
  clay (`#B4552F`) — teal is DigitizeBiz's accent, clay is CitizenEase's accent, so the two
  divisions stay visually distinct while sharing the same masterbrand shell.
- **Typography**: Fraunces (display) + Inter (body), loaded via Google Fonts in `index.html`.
- **Dark mode**: via `next-themes`, toggled from the nav.

## Deploying to Render

This repo includes a `render.yaml` Blueprint that provisions both services — the backend (Node
web service, with a persistent disk for consultation data) and the frontend (static site) — and
wires their public URLs to each other automatically. You don't need to hand-copy any URLs between
them.

**Prerequisite:** Render Blueprints deploy from a connected Git repository, not a zip upload. Push
this project to a GitHub, GitLab, or Bitbucket repo first.

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the Render Dashboard: **New → Blueprint**, and connect that repo. Render reads
   `render.yaml` from the repo root automatically.
3. Render will prompt you for the one variable marked `sync: false` — `ADMIN_PASSWORD_HASH`.
   Generate it locally first:
   ```bash
   cd backend && npm install && npm run hash-password -- "choose-a-strong-password"
   ```
   Paste the printed hash in when Render asks for it. (`JWT_SECRET` is generated for you
   automatically; `FRONTEND_ORIGIN` and `VITE_API_URL` are filled in from each service's actual
   deployed URL — that's what the `fromService` entries in `render.yaml` do.)
4. Click **Deploy Blueprint**. Render builds and deploys both services. The backend is created on
   the **Starter** plan — see the note below on why.
5. Once both are live, visit the frontend's `.onrender.com` URL, and `/admin` to sign in with the
   password you hashed in step 3.

### Why the backend isn't on Render's free tier

`render.yaml` requests a persistent disk for `backend/data`, so submitted consultations survive
deploys and restarts. **Free Render web services can't attach a persistent disk** — only paid
instance types can — so the backend is set to `plan: starter` (Render's smallest paid tier) in the
Blueprint. The static frontend has no such requirement and deploys free either way.

If you'd rather stay entirely on the free tier and accept that `backend/data/consultations.json`
resets on every deploy/restart, edit `render.yaml` before deploying: remove the `disk:` block and
change `plan: starter` to `plan: free` on the backend service.

### Manual setup (without the Blueprint)

If you'd rather click through the dashboard instead of using `render.yaml`:

1. **New → Web Service** → connect the repo → set **Root Directory** to `backend`, build command
   `npm install && npm run build`, start command `npm start`, health check path `/api/health`. Add a
   disk (Advanced → Add Disk) mounted at `/opt/render/project/src/backend/data`. Set
   `ADMIN_PASSWORD_HASH` and `JWT_SECRET` under Environment (leave `FRONTEND_ORIGIN` for step 3).
2. **New → Static Site** → connect the repo → Root Directory `.` (repo root), build command
   `npm install && npm run build`, publish directory `dist`. Add a rewrite rule `/*` → `/index.html` so
   client-side routes like `/admin` work on refresh (the included `public/_redirects` covers this
   automatically on Render and Netlify alike).
3. Copy each service's `.onrender.com` URL into the other's environment variables:
   `FRONTEND_ORIGIN` on the backend, `VITE_API_URL` on the frontend (this triggers a frontend
   rebuild since Vite bakes it in at build time).

### Other hosts

Nothing here is Render-specific at the code level — the backend is a plain Node process
(`npm run build && npm start`) and the frontend is a static build (`npm run build` → `dist/`), so
both also run as-is on Railway, Fly.io, a VPS, etc. Just replicate the same three things anywhere:
point the frontend's `VITE_API_URL` at wherever the backend ends up, point the backend's
`FRONTEND_ORIGIN` at wherever the frontend ends up, and give the backend persistent storage for
`backend/data` (or swap in a real database).

## Deploying to Vercel

Vercel deploys this as **one project**: the frontend builds as a static site, and the backend
runs as a single serverless function (`api/[...path].ts`, a catch-all that hands every `/api/*`
request to the same Express app used by the standalone server). `vercel.json` at the repo root
configures the SPA fallback so `/admin` and the division pages work on direct load; `/api/*` is
left alone so it reaches the function.

**The one real difference from Render: storage.** Vercel functions are stateless — there's no
persistent local filesystem to write `consultations.json` to. The backend already accounts for
this: `backend/src/lib/store.ts` automatically uses **Upstash Redis** (Vercel's current
Marketplace-integrated key-value store — Vercel's own former "Vercel KV" product was sunset and
replaced by this) whenever its environment variables are present, and falls back to the JSON file
store otherwise. You don't need to change any code — just connect the integration:

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the Vercel dashboard: **Add New → Project**, import the repo. Vercel auto-detects the Vite
   framework; the included `vercel.json` handles the rest (build command, output directory, SPA
   rewrite). Leave the root directory as the repo root — the `/api` function needs to sit next to
   `vercel.json`.
3. **Storage → Marketplace Database Storage → Redis (Upstash)** → create a database and connect
   it to this project. Vercel injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into
   the project automatically — that's what flips `store.ts` over to the Redis-backed
   implementation.
4. Under **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD_HASH` — generate it the same way as for Render:
     `cd backend && npm install && npm run hash-password -- "your-password"`
   - `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
   - `FRONTEND_ORIGIN` — your Vercel deployment's own URL (e.g.
     `https://your-project.vercel.app`); CORS is same-origin here so this mostly matters if you
     also expose the API separately
   - `VITE_API_URL` — set to an **empty string**. Frontend and backend share one origin in this
     setup, so the app should call relative paths like `/api/consultations`, not an absolute URL.
5. Deploy. Visit the project's URL, and `/admin` to sign in.

### Why this needs its own storage path (and how to verify it)

This part — the Upstash-backed store and the `api/[...path].ts` entry point — is new code that
hasn't been run against a live Vercel deployment or a real Upstash instance in this environment
(same no-network sandbox constraint as everything else in this repo). It was written directly
against Upstash's documented `@upstash/redis` SDK (`get`/`set`/`mget`/`zadd`/`zrange`/`zrem`,
all stable, long-standing methods), and passes the same static checks as the rest of the project
(see below) — but treat it as the part most worth a real test deploy before relying on it,
specifically:
- Connect the Upstash integration on a throwaway Vercel project first and submit a test
  consultation through the live site, then confirm it shows up in `/admin`.
- Restart/redeploy the function afterward and confirm the data is still there (that's the actual
  point of not using the file store on Vercel).

If anything about the Upstash SDK's method signatures has changed since this was written, the fix
is isolated to `backend/src/lib/kvStore.ts` — nothing else needs to change.

## Known constraints / how this was verified

This project was built in a sandboxed environment with **no network access**, so `npm install` and
a live build could not be run here for either app. Dependency versions were checked against
known-good, currently-published ranges (in particular `lucide-react` is pinned to `^0.487.0` — the
stable pre-1.0 range — and the file-storage path deliberately avoids any dependency with native
bindings; the Upstash-backed path used for Vercel is the one dependency that talks to an external
service and is the piece most worth a real test deploy — see "Deploying to Vercel" above).

In place of a live build, the following checks were run manually against every source file, across
the frontend, the backend, and the `api/` serverless entry point:

- Brace/paren/bracket balance across all `.ts`/`.tsx` files
- Every local import traced to a real file — including the cross-directory import from
  `api/[...path].ts` into `backend/src/app.ts` — and every named import checked against that
  file's actual exports
- All `package.json`/`tsconfig*.json` files, plus `render.yaml` and `vercel.json`, validated as
  well-formed JSON/YAML
- Backend relative imports checked for the `.js` extension required by `NodeNext` module
  resolution
- `robots.txt` (`Allow: /`) checked for consistency with the `index,follow` meta tag in
  `index.html`
- Tailwind color utility classes (`bg-ink-soft`, `text-teal`, `border-clay`, `bg-card-dark`, etc.)
  checked against the nested color tokens defined in `tailwind.config.ts`

Before deploying, run `npm install && npm run build` locally (or in CI) for both `/` and
`/backend` to catch anything a static read-through can't — type errors, resolution issues, etc.

**No lockfiles are committed** (`package-lock.json`), for the same reason — they're generated by
`npm install`, which couldn't run here. `render.yaml` and the manual setup steps above use
`npm install` rather than `npm ci` for this reason: `npm ci` requires a lockfile that matches
`package.json` exactly and fails immediately if one isn't present. Once you've run
`npm install` locally for both `/` and `/backend` and committed the resulting
`package-lock.json` files, you can switch either build command back to `npm ci` for faster,
more reproducible installs — just keep the lockfile in sync with `package.json` after that (delete
and regenerate it if `EUSAGE` reappears after editing dependencies by hand).

## Next steps

- Confirm final Skywalkers Ltd domain/branding assets (logo mark currently a placeholder "S").
- Add pricing to the DigitizeBiz and CitizenEase service cards once the revenue model (see the
  Skywalkers Ltd strategy document) is finalized.
- Optional backend extensions: email/SMS notification on new consultation, CSV export from the
  admin dashboard, multi-admin accounts if more than one person needs access.

