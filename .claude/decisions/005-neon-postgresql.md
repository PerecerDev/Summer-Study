# ADR-005: Neon PostgreSQL as Primary Datastore

**Status:** Accepted  
**Date:** 2026-07-05  
**Deciders:** Software Architect, DevOps Engineer

---

## Context

Summer Study requires persistent storage for rounds, exercises, attempts, progress, and rewards — retained for years with reliable backups. The stack targets Vercel deployment.

## Decision

Use **Neon PostgreSQL** (serverless Postgres) as the sole production database.

## Alternatives Considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **Supabase** | Auth + DB bundled | Auth model doesn't fit custom child/parent model |
| **PlanetScale (MySQL)** | Serverless | MySQL less ideal for JSON exercise metadata |
| **SQLite (local)** | Simple | Not suitable for production multi-device |
| **Neon PostgreSQL** | Serverless, branching, Vercel integration | Vendor lock-in (mitigated: standard Postgres) |

## Consequences

**Positive:**

- Standard SQL; portable if needed
- Connection pooling for serverless
- Branching for preview environments
- Aligns with `DATA_MODEL.md` relational design

**Negative:**

- Free tier limits (monitor usage)
- Cold start on connection (use pooler)

## Configuration

- Pooled `DATABASE_URL` in Vercel
- Migrations in CI on deploy to `main`
- Backups via Neon automatic snapshots
