# Summer Study — Deployment Strategy

Version: 1.0  
Status: Active

---

# Purpose

Defines deployment architecture, environments, CI/CD, and configuration for GitHub, Vercel, and Neon.

---

# Environments

| Environment | Branch | URL | Database |
| ----------- | ------ | --- | -------- |
| Development | local | `localhost:5173` | Neon dev branch or local |
| Preview | PR branches | `*.vercel.app` | Neon preview branch |
| Production | `main` | custom domain TBD | Neon production |

---

# Infrastructure Diagram

```
GitHub (public repo)
  │
  ├── push/PR → GitHub Actions (lint, test, build)
  │
  └── merge to main → Vercel deploy
                        │
                        ├── Static SPA (Vite build)
                        └── Serverless API (/api/*)
                              │
                              └── Neon PostgreSQL
                                    (connection pooling)
```

---

# Vercel Configuration

## Frontend

- Framework: Vite
- Build: `npm run build`
- Output: `dist/`
- SPA fallback: `vercel.json` rewrites all routes to `index.html`

## API

- Serverless functions in `/api` or Vite plugin for dev
- Bind: platform handles port (not applicable for serverless)
- Env vars via Vercel dashboard (never in repo)

## vercel.json (planned)

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

# Neon PostgreSQL

## Projects

| Instance | Purpose |
| -------- | ------- |
| `summer-study-prod` | Production data |
| `summer-study-dev` | Development + preview branches |

## Connection

- Use pooled connection string in serverless (`?sslmode=require`)
- Migrations via CI or manual `npm run db:migrate`
- Branch per PR preview (Neon branching) — optional Phase 1

## Secrets

| Variable | Where |
| -------- | ----- |
| `DATABASE_URL` | Vercel env (production, preview) |
| `DATABASE_URL` | Local `.env` (gitignored) |

---

# Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | Yes | Neon connection string |
| `LLM_API_KEY` | Yes | LLM provider key |
| `LLM_MODEL` | Yes | Model identifier |
| `SESSION_SECRET` | Yes | Cookie signing |
| `NODE_ENV` | Auto | development / production |
| `VITE_API_BASE_URL` | Optional | Override API URL in dev |

**Never commit:** `.env`, `.env.local`, credentials.

`.env.example` committed with placeholder keys.

---

# CI/CD Pipeline

## On pull request

1. Checkout
2. `npm ci`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run test`
6. `npm run build`
7. Vercel preview deploy (automatic via integration)

## On merge to `main`

1. All PR checks pass
2. Vercel production deploy
3. Run migrations (if pending)
4. Smoke test: health endpoint + login

---

# GitHub Repository

- Public repository
- Default branch: `main` (production)
- Branch protection on `main` (recommended):
  - Require PR
  - Require CI pass
  - No force push
- Conventional commits enforced via PR review (commitlint optional)

---

# Rollback

| Layer | Method |
| ----- | ------ |
| Frontend/API | Vercel instant rollback to previous deployment |
| Database | Neon point-in-time restore (production) |
| Migrations | Forward-only; rollback scripts for breaking changes |

---

# Monitoring (Future)

- Vercel Analytics (Web Vitals)
- Error tracking: Sentry (ADR if adopted)
- Uptime: Vercel or external ping on `/api/health`

---

# Health Check

`GET /api/v1/health`

```json
{ "status": "ok", "db": "connected", "version": "1.0.0" }
```

Used by deploy smoke tests.

---

# Local Development Setup (when code exists)

```bash
cp .env.example .env
# Fill DATABASE_URL, LLM_API_KEY, SESSION_SECRET
npm install
npm run db:migrate
npm run dev
```

---

# Security Checklist (Deploy)

- [ ] HTTPS only (Vercel default)
- [ ] httpOnly secure cookies in production
- [ ] Env vars not in client bundle (audit `VITE_*` prefix)
- [ ] CORS restricted to app origin
- [ ] Dependency audit in CI (`npm audit`)
