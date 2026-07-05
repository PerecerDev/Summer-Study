# Infrastructure — Summer Study

Operational reference for Neon, Groq, and Vercel (no secrets in this file).

---

## Neon PostgreSQL

| Field | Value |
| ----- | ----- |
| Project name | `summer-study` |
| Project ID | `late-dream-74097303` |
| Branch | `main` |
| Database | `neondb` |
| Region | AWS us-west-2 |

**Connection:** set `DATABASE_URL` in local `.env` (pooled URI from [Neon Console](https://console.neon.tech)).

**Setup (local or production DB):**

```bash
npm run db:migrate
npm run db:seed
```

Migrations tracked in `schema_migrations` (`0000_init.sql`, `0001_rounds.sql`).

---

## Groq (LLM — free tier)

| Field | Value |
| ----- | ----- |
| Provider | [Groq](https://console.groq.com) |
| API | OpenAI-compatible |
| Default model | `llama-3.3-70b-versatile` |
| Base URL | `https://api.groq.com/openai/v1` |

**Get API key:** [console.groq.com/keys](https://console.groq.com/keys) (free tier).

**Environment variables:**

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `GROQ_API_KEY` | Yes* | Primary key (also accepts `LLM_API_KEY`) |
| `LLM_MODEL` | No | Default `llama-3.3-70b-versatile` |
| `LLM_BASE_URL` | No | Default Groq endpoint |
| `MOCK_LLM` | No | Set `true` to force mock exercises (dev/tests) |

\* In production, `GROQ_API_KEY` is required. Local dev falls back to mock if unset.

**Health check:** `GET /api/v1/health` → `"llm": "groq" | "mock" | "missing"`

---

## Vercel

| Field | Value |
| ----- | ----- |
| Project | `summer-study` |
| Team | `alexs-projects-90662fbd` |
| Production URL | https://summer-study-ebon.vercel.app |
| Build | `@hono/vite-build/vercel` → `.vercel/output` (Build Output API) |

**Environment variables (Dashboard → Settings → Environment Variables):**

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DATABASE_URL` | Yes | Neon **pooled** connection string |
| `SESSION_SECRET` | Yes | Random 32+ byte hex string |
| `NODEJS_HELPERS` | Yes | Set to `0` |
| `GROQ_API_KEY` | Yes | Groq API key |
| `LLM_MODEL` | No | `llama-3.3-70b-versatile` |
| `LLM_BASE_URL` | No | `https://api.groq.com/openai/v1` |

**Deploy:** automatic on push to `main` only (production branch). Pushes to `develop` are disabled in `vercel.json`.

**Git:** https://github.com/PerecerDev/Summer-Study

---

## Local development

```bash
cp .env.example .env
# Add DATABASE_URL + GROQ_API_KEY
npm run db:migrate
npm run db:seed
npm run dev:all   # Vite :5173 + API :3001
```

Vite proxies `/api` → `http://localhost:3001`.

---

## Health check

- Local: `GET http://localhost:3001/api/v1/health`
- Production: `GET https://summer-study-ebon.vercel.app/api/v1/health`

Expected when fully configured:

```json
{ "status": "ok", "db": "configured", "llm": "groq", "version": "0.1.0" }
```
