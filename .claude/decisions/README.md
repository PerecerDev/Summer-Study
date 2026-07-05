# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records for Summer Study.

## Index

| ADR | Title | Status |
| --- | ----- | ------ |
| [001](001-react-vite-spa.md) | React + Vite SPA (not Next.js) | Accepted |
| [002](002-drizzle-orm.md) | Drizzle ORM for Neon PostgreSQL | Accepted |
| [003](003-rest-api.md) | REST API with version prefix | Accepted |
| [004](004-session-auth.md) | Session-based auth with httpOnly cookies | Accepted |
| [005](005-neon-postgresql.md) | Neon PostgreSQL as primary datastore | Accepted |

## Format

Each ADR follows:

1. **Context** — What prompted the decision
2. **Decision** — What we chose
3. **Alternatives Considered** — What we rejected and why
4. **Consequences** — Positive and negative outcomes

## Process

New ADRs require:

- Software Architect draft
- Human client approval for stack/auth/schema changes
- PM records in this directory before implementation

## Template

```markdown
# ADR-NNN: Title

**Status:** Proposed | Accepted | Deprecated | Superseded
**Date:** YYYY-MM-DD
**Deciders:** Roles

## Context
## Decision
## Alternatives Considered
## Consequences
```
