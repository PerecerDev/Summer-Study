# ADR-002: Drizzle ORM for Neon PostgreSQL

**Status:** Accepted  
**Date:** 2026-07-05  
**Deciders:** Software Architect, Database Administrator

---

## Context

Summer Study requires type-safe database access to Neon PostgreSQL with versioned migrations, serverless-friendly connection handling, and alignment with TypeScript domain types in `DATA_MODEL.md`.

## Decision

Use **Drizzle ORM** with `drizzle-kit` for schema and migrations.

## Alternatives Considered

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **Prisma** | Mature, great DX | Heavier runtime; binary engine concerns on serverless |
| **Raw SQL (pg)** | Full control | No type safety; more boilerplate |
| **Drizzle** | Lightweight, SQL-like, excellent TS inference | Smaller community than Prisma |

## Consequences

**Positive:**

- Schema defined in TypeScript close to `DATA_MODEL.md` types
- Small bundle for serverless functions
- SQL transparency for complex queries (history, stats)
- Good Neon compatibility with connection pooling

**Negative:**

- Team must learn Drizzle patterns
- Fewer Stack Overflow answers than Prisma

## Follow-up

- Define schema in `server/db/schema.ts`
- Migrations in `server/db/migrations/`
- Seed script for dev subjects and test user
