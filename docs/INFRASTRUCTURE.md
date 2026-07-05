# Infrastructure — Summer Study

Operational reference for Neon and Vercel (no secrets in this file).

---

## Neon PostgreSQL

| Field | Value |
| ----- | ----- |
| Project name | `summer-study` |
| Project ID | `late-dream-74097303` |
| Branch | `main` |
| Database | `neondb` |
| Region | AWS us-west-2 |

**Connection:** set `DATABASE_URL` in local `.env` (copy from [Neon Console](https://console.neon.tech)).

**Local setup:**

```bash
npm run db:migrate
npm run db:seed
```

---

## Vercel

| Field | Value |
| ----- | ----- |
| Project | `summer-study` |
| Team | `alexs-projects-90662fbd` |
| Framework | Vite |
| Output | `dist` |

**Environment variables (Dashboard → Settings → Environment Variables):**

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DATABASE_URL` | Yes | Neon pooled connection string |
| `SESSION_SECRET` | Yes | Random 32+ byte hex string |
| `LLM_MODEL` | Yes | e.g. `gpt-4o-mini` |
| `LLM_API_KEY` | Later | When AI generation ships |

**Deploy:**

```bash
npx vercel deploy --prod
```

Or connect GitHub repo for automatic deploys on push to `main`.

---

## Local development

```bash
npm run dev:all   # Vite :5173 + API :3001
```

Vite proxies `/api` → `http://localhost:3001`.

---

## Health check

- Local API: `GET http://localhost:3001/api/v1/health`
- Production: `GET https://<vercel-domain>/api/v1/health`
