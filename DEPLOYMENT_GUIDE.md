# Skywalkers Ltd - Deployment Guide & Project Structure

## 📁 Project Overview

**Repository:** `josriri/SkywalkersLtd`  
**Languages:** TypeScript (97.6%), HTML (1.5%), Other (0.9%)  
**Node Version:** >= 20.0.0

This is a **monorepo** containing two separate applications:
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Express API + TypeScript

---

## 🏗️ Directory Structure

```
skywalkers-ltd (3)/
├── README.md                          # Main project documentation
├── index.html                         # HTML entry point for frontend
├── package.json                       # Frontend dependencies & scripts
├── tsconfig.json                      # Frontend TypeScript config
├── tsconfig.node.json                 # Build tools TypeScript config
├── vite.config.ts                     # Vite build configuration
├── tailwind.config.ts                 # Tailwind CSS theme & colors
├── postcss.config.js                  # PostCSS configuration
├── render.yaml                        # Render.com deployment blueprint
│
├── src/                               # Frontend source code
│   ├── main.tsx                       # React app entry point
│   ├── App.tsx                        # Router & main layout
│   ├── index.css                      # Global styles
│   ├── vite-env.d.ts                  # Vite TypeScript declarations
│   ├── components/                    # Reusable React components
│   │   ├── Nav.tsx                    # Navigation & theme toggle
│   │   ├── Footer.tsx                 # Shared footer
│   │   ├── PublicLayout.tsx           # Layout wrapper
│   │   ├── ContactBlock.tsx           # Consultation form
│   │   ├── ui.tsx                     # Shared UI primitives
│   │   ├── DigitizationPreview.tsx    # DigitizeBiz tool
│   │   ├── ROICalculator.tsx          # DigitizeBiz tool
│   │   ├── DocumentChecklist.tsx      # CitizenEase tool
│   │   └── theme-provider.tsx         # Dark mode provider
│   ├── pages/                         # Page components
│   │   ├── Home.tsx                   # Homepage
│   │   ├── DigitizeBiz.tsx            # Division A page
│   │   ├── CitizenEase.tsx            # Division B page
│   │   ├── AdminPage.tsx              # /admin routing
│   │   ├── AdminLogin.tsx             # Admin login form
│   │   └── AdminDashboard.tsx         # Consultation management
│   ├── lib/                           # Utility functions
│   │   ├── api.ts                     # Typed fetch client
│   │   └── auth.tsx                   # Auth context & JWT
│   └── data/
│       └── services.ts                # Service definitions
│
├── public/                            # Static assets & redirects
│   ├── _redirects                     # SPA routing for Render/Netlify
│   └── robots.txt                     # SEO robots directives
│
└── backend/                           # Express API server
    ├── README.md                      # Backend documentation
    ├── package.json                   # Backend dependencies & scripts
    ├── tsconfig.json                  # Backend TypeScript config
    ├── src/
    │   ├── server.ts                  # Express app & middleware setup
    │   ├── types.ts                   # Shared TypeScript types
    │   ├── lib/
    │   │   ├── store.ts               # JSON file data store
    │   │   └── hashPassword.ts        # CLI password hasher
    │   ├── middleware/
    │   │   ├── auth.ts                # JWT verification
    │   │   └── errorHandler.ts        # Error handling
    │   └── routes/
    │       ├── auth.ts                # /api/auth/login
    │       └── consultations.ts       # /api/consultations/*
    └── dist/                          # Compiled JavaScript (created on build)
```

---

## 🔧 Frontend Configuration Files

### `package.json`
```json
{
  "name": "skywalkers-ltd",
  "type": "module",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

**Key Dependencies:**
- React 18.3.1
- React Router 6.25.1
- Lucide React 0.487.0 (icons)
- Next Themes 0.3.0 (dark mode)
- Tailwind CSS 3.4.4
- TypeScript 5.5.3

### `tsconfig.json`
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** react-jsx
- **Strict:** true
- **Path aliases:** `@/*` → `src/*`

### `tailwind.config.ts`
Custom colors defined:
- **Ink:** `#16233A` (navy)
- **Paper:** `#F4F1EA` (warm)
- **Teal:** `#1F7A6C` (DigitizeBiz accent)
- **Clay:** `#B4552F` (CitizenEase accent)
- **Fonts:** Fraunces (display) + Inter (body)

---

## 🔧 Backend Configuration Files

### `backend/package.json`
```json
{
  "name": "skywalkers-backend",
  "type": "module",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "hash-password": "tsx src/lib/hashPassword.ts"
  }
}
```

**Key Dependencies:**
- Express 4.19.2
- bcryptjs 2.4.3 (password hashing)
- jsonwebtoken 9.0.2 (JWT)
- cors 2.8.5
- helmet 7.1.0 (security headers)
- express-rate-limit 7.4.0
- zod 3.23.8 (validation)

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality Checks
- [ ] TypeScript compilation succeeds: `npm run build` (both frontend and backend)
- [ ] No TypeScript errors or warnings
- [ ] All imports resolve correctly
- [ ] JSON files are well-formed (package.json, tsconfig.json, etc.)
- [ ] Brace/paren/bracket balance verified in all .ts/.tsx files

### ✅ Environment Variables
**Frontend `.env.example`:**
```
VITE_API_URL=http://localhost:4000
```

**Backend `.env.example`:**
```
NODE_ENV=development
PORT=4000
ADMIN_PASSWORD_HASH=<generate with: npm run hash-password>
JWT_SECRET=<long random string>
FRONTEND_ORIGIN=http://localhost:5173
```

### ✅ Frontend Checks
- [ ] `vite.config.ts` properly configured
- [ ] `tailwind.config.ts` has all custom colors and fonts
- [ ] `index.html` has correct charset, viewport, meta tags, and font imports
- [ ] Google Fonts loaded via CDN (Fraunces + Inter)
- [ ] `public/_redirects` exists for SPA routing
- [ ] `public/robots.txt` matches meta tags (index,follow)
- [ ] `src/main.tsx` correctly mounts React app
- [ ] All component imports use correct paths
- [ ] CSS custom properties available for Tailwind

### ✅ Backend Checks
- [ ] `src/server.ts` starts without errors
- [ ] All middleware loaded: auth, error handling, CORS, Helmet
- [ ] Routes registered: `/api/auth/login`, `/api/consultations`, `/api/health`
- [ ] Database path configured: `backend/data/`
- [ ] Rate limiting configured for public endpoints
- [ ] JWT secret and admin password hash are strong
- [ ] No hardcoded secrets in code (all in `.env`)

### ✅ API Endpoints
- [ ] `GET /api/health` — returns 200 (liveness check)
- [ ] `POST /api/auth/login` — accepts `{password}`, returns `{token}`
- [ ] `POST /api/consultations` — creates consultation, rate-limited
- [ ] `GET /api/consultations` — requires JWT, supports `?division=` & `?status=`
- [ ] `PATCH /api/consultations/:id` — updates status, requires JWT
- [ ] `DELETE /api/consultations/:id` — removes consultation, requires JWT

### ✅ Security Checks
- [ ] CORS configured to allowed origins only
- [ ] Helmet security headers enabled
- [ ] Rate limiting active (1 req/30s for submissions, 10 attempts/15min for login)
- [ ] Honeypot field (`website`) implemented on contact form
- [ ] Input validated with zod on all write endpoints
- [ ] JWT validation enforced on admin routes
- [ ] No plaintext passwords stored
- [ ] `ADMIN_PASSWORD_HASH` is bcrypt hash (not plaintext)

### ✅ Build & Output
- [ ] Frontend builds to `dist/` directory
- [ ] Backend compiles to `dist/` with correct JS files
- [ ] Source maps generated (optional but helpful for debugging)
- [ ] No build warnings or errors

### ✅ File System & Permissions
- [ ] `backend/data/` directory exists or will be created on first write
- [ ] Backend has write permissions to `backend/data/`
- [ ] For Render: persistent disk mounted at `/opt/render/project/src/backend/data`

---

## 🚀 Deployment Scenarios

### Option 1: Render (Recommended)
Uses `render.yaml` blueprint for automated deployment.

**Prerequisites:**
1. Push repository to GitHub (must be connected)
2. Generate admin password hash locally:
   ```bash
   cd backend && npm install && npm run hash-password -- "your-password"
   ```

**Steps:**
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New → Blueprint**
3. Connect the GitHub repository
4. Render auto-reads `render.yaml` from repo root
5. When prompted, provide `ADMIN_PASSWORD_HASH`
6. Leave `JWT_SECRET` (auto-generated), `FRONTEND_ORIGIN` & `VITE_API_URL` (auto-filled)
7. Click **Deploy Blueprint**
8. Wait for both services to build and deploy
9. Visit frontend URL + `/admin` to verify

**Important Notes:**
- Backend uses `plan: starter` (paid) because it has a persistent disk
- Frontend uses free tier (no persistent storage needed)
- To stay on free tier entirely: remove `disk:` block and change backend `plan: free`
  (consultations will reset on deploys)

### Option 2: Railway, Fly.io, VPS, or Docker
Plain Node processes — no vendor lock-in required.

**Frontend:**
```bash
npm ci && npm run build
# Output: dist/
# Deploy as static site
# Configure SPA routing: /* → /index.html
```

**Backend:**
```bash
cd backend && npm ci && npm run build && npm start
# Listens on process.env.PORT (default 4000)
# Requires persistent storage at backend/data/
```

**Environment Variables (all services):**
- `FRONTEND_ORIGIN` — backend reads this (e.g., `https://example.com`)
- `VITE_API_URL` — frontend reads at build time (e.g., `https://api.example.com`)
- `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `NODE_ENV`, `PORT`

### Option 3: Vercel + External Backend
**Frontend on Vercel:**
```bash
npm run build
# Deploy dist/ folder
# Add rewrite rule: /* → /index.html
```

**Backend elsewhere:** Render, Railway, Fly.io, etc.

**Set environment variable:** `VITE_API_URL=https://api-endpoint.example.com`

---

## 🔍 Common Deployment Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` errors | Missing dependencies | Run `npm install` both frontend & backend |
| TypeScript build fails | Type errors in src | Run `npm run build` locally to catch before deploy |
| Frontend shows blank page | React mount point missing | Check `src/main.tsx` mounts to `#root` in `index.html` |
| Admin login fails | Wrong password hash format | Regenerate with `npm run hash-password` CLI tool |
| API calls fail in deployed frontend | CORS misconfigured | Verify `FRONTEND_ORIGIN` set correctly on backend |
| Consultations lost after redeploy | No persistent storage | Backend needs mounted disk (render.yaml includes this) |
| 404 on `/admin` refresh | SPA routing not configured | Ensure `_redirects` or `public/_redirects` file exists |
| Fonts not loading | CDN blocked or timeout | Check Google Fonts URL in `index.html` is reachable |
| Dark mode not working | Theme context missing | Verify `theme-provider.tsx` wraps App in `ThemeProvider` |

---

## 📦 Build Commands

### Frontend
```bash
# Development
npm run dev                # Start dev server on http://localhost:5173

# Production
npm run build              # TypeScript + Vite build → dist/
npm run preview            # Preview production build locally
```

### Backend
```bash
# Development
npm run dev                # Watch mode with tsx → localhost:4000

# Production
npm run build              # TypeScript compile → dist/
npm start                  # Run compiled JavaScript
```

### Both (from repo root)
```bash
# Frontend
npm install && npm run build

# Backend (separate terminal)
cd backend && npm install && npm run build
```

---

## 🎨 Design System Reference

| Element | Color | Variable |
|---------|-------|----------|
| Primary text | #16233A | `ink` / `ink-soft` |
| Background | #F4F1EA | `paper` / `paper-dark` |
| DigitizeBiz accent | #1F7A6C | `teal` / `teal-soft` |
| CitizenEase accent | #B4552F | `clay` / `clay-soft` |
| Borders | #DED8C8 | `line` / `line-dark` |
| Card dark mode | #161F30 | `card-dark` |

**Typography:**
- Display headings: Fraunces
- Body text: Inter

---

## 📝 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Render Deployment Guide](https://render.com/docs)
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)

---

## ✨ Summary

This is a full-stack TypeScript application with:
- ✅ Modular frontend with routing, auth context, and dark mode
- ✅ Secure backend with JWT, rate limiting, and input validation
- ✅ Monorepo structure with shared types
- ✅ Ready for Render deployment via Blueprint
- ✅ Portable to any Node-supporting platform (Railway, Fly.io, VPS, etc.)

**Before deploying:** Run `npm install && npm run build` in both frontend and backend to catch issues early.
